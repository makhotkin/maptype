/* Copyright (c) 2008 Maxim Makhotkin (maxim.makhotkin@gmail.com) 
 * 
 * Lutik, LLC owns a non-exclusive license to distribute this code as part of its products
 * 
 */
	
function mapType( settings )
{
	var map_url = "img/";
	var settings = $.extend({	
		// 80.000 и мельче
		zoom: [ /* { mpp:0.6614583333333, x0: 382346, y0: 6213256, file: map_url+"2_5k/2_5k_", l:"AW", i:"018" }, // 2500 
    				{ mpp:1.3229166666666, x0: 382088, y0: 6213233, file: map_url+"05k/5k_", l:"AC", i:"006" }, //  5k
						{ mpp:2.6458333333333, x0: 381760, y0: 6213414, file: map_url+"10k/10k_", l:"AL", i:"011" }, // 10k */
						{ mpp:5.2916666666666, x0: 381942, y0: 6214159, file: map_url+"20k/20k_", l:"AM", i:"06" }, // 20k
						{ mpp:10.583333333333, x0: 380918, y0: 6213605, file: map_url+"40x/40k_", l:"AO", i:"03" }, // 40k
						{ mpp:21.166666666666, x0: 380085, y0: 6217339, file: map_url+"80x/80k_", l:"G", i:"02" }  // 80k
					], 			// all scales we have here	- meters per pixel
		tile_size: 240,													 			// tile dimensions (in pixels) - think twice before changing this
		initialScale: 1,															// ok, this can be changed
		map_limits: [ 385194.619, 6212440.391, 436127.012, 6156613.196],	// viewable area bounds: left, top, right, bottom
		x0: 414711,															// как бы точка, которая будет в центре 
		y0: 6182793,														// после запуска карты сразу.
		applyTo : $('div.map:first'),								// temporary here = should become parameter passed via $(element).myMap(...) call 
		defaultimg : 'maps.php',											// image to substitute missing parts.
		// положение "себя" на карте - чтобы рисовать радиусы доступности
		user_location : [ 0, 0 ],
		api_url: "backend.php",

		mark_size: 32,														// для отметок на карте
		sectors: {x:[408711,409711,412711],y:[6179793,6182793,6183793]},										  // сектора
		scrollbarWidth : utils.scrollbarWidth(), 	// ширина скроллбаров нужна ( 
		callback: {}														  // user might have omitted this, but let's create to avoid checks for its presence.

	}, settings);
	settings.callback = $.extend({ /* Add default callbacks here */ } , settings.callback );


	var dragState = 0; 							// 0 : not draggin' 1: draggin' map; 2: draggin' zoom slider
	var dragStartClient = [0,0];		// will store delta for drag here
	var hasFocus = false; 					// строго говоря, div'ы не должны иметь фокуса, но у нас тут особый случай, мы делаем как бы элемент управления, так что будет хитро.

	var viewportSize = [0,0]; 			// актуальный размер области с картой
	var dragDistanceScreen = [0,0]; // reflects layerHolder CSS left & top

	var frontBuffer = null
	var backBuffer = null;
	var transform = new utils.Matrix();	// this matrix used to translate pixel coordinates relative to theMap into world ones and vice versa.	
	
	// this one should become parameter passed via $(element).myMap( ... ) call
	var theMap = settings.applyTo;
	
	var zoomSlider = null;
	var focusFolder = null;
	var layersHolder = null, layers = {};
	var infoBubble = null;
	var radii = null;
	
	// хранить отметки на карте сюда
	var sectorData = {};
	var mapObjects = [];

	function constructor() {
		
		(function createHTMLelements () {
			theMap.append( $("<div class=\"stencil\">").append( layersHolder = $("<div class=\"layers\">") ) );
			focusHolder = $("<input class=\"focusEater\"/>").appendTo( theMap );
			layers['geo'] = $("<div class=\"geo layer\">").appendTo(layersHolder);
			frontBuffer = new TileSet( $("<div class=\"1st tileset\">").appendTo( layers['geo'] ) );
			backBuffer = new TileSet( $("<div class=\"2nd tileset\">").appendTo( layers['geo'] ) );		
			layers['avaliability'] = $("<div class=\"avaliability layer\">").appendTo(layersHolder);
			layers['radius'] = $("<div class=\"radius layer\">").appendTo(layersHolder);
			layers['objects'] = $("<div class=\"objects layer\">").appendTo(layersHolder);			
			radii = $("<div class=\"radii\">").appendTo(layers['radius']);
			
			infoBubble = new InfoBubble( $("#map-infobubble").appendTo(layersHolder) );
			zoomSlider = new ZoomSlider( $("#map-zoom").appendTo( theMap ) ); // 1st capital letter for classname 

			$("#map-extra-contents > *").each( function() { $(this).appendTo( theMap ); } );
			$("#map-extra-contents").remove();
		})();
		
		// should not create more than one map per page
		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;	
		theMap.mousedown( onMouseDown );
		// флаг поднимается тут внутри, ибо элемент может получить форус и через табуляцию тоже. Проверять флаг лучше, чем проверять ДОМ.
		focusHolder.focus( function() { hasFocus = true; } )
		// обработчик евентов над картой должен остановить евент (сюда он не придет и не отменит фокус)
		$(document).mousedown( function( ev ) { if( hasFocus ) focusHolder.blur(); } );
		$(document).keydown( onKeyDown );
		$(window).resize( onResize );
		
		// wheee-e-e-el
	  if(window.addEventListener) theMap[0].addEventListener('DOMMouseScroll', onWheelMove, false);
		theMap[0].onmousewheel = onWheelMove;
		
		if (typeof document.onselectstart!="undefined") //IE tends to select everythin'
		{
			document.onselectstart=function(){return false;}		
			$('img').each( utils.makeUnselectable ); 
		}
		
		frontBuffer.setInitialScale( settings.initialScale );
		transform.setScale( settings.zoom[settings.initialScale].mpp );			
		transform.moveTo( settings.x0, settings.y0 );
		onResize();		
		updateView();		
		
		console.log( getVisibleSectors() );
	}
	
	// 1. controllers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function onMouseDown( ev ) 
	{
		if ( ev.which == 1 ) 
		{
			if( ev.shiftKey )
			{
				var relmap = getEventRelativeCoordinates( ev.originalEvent );
				relmap[0] -= dragDistanceScreen[0];
				relmap[1] -= dragDistanceScreen[1];						
				transform.toWorld_m( relmap );
				$("#poi_x").val( relmap[0] );
				$("#poi_y").val( relmap[1] );					
			}
			else 
			{
				dragState = 1; 
				dragStartClient[0] = ev.clientX;
				dragStartClient[1] = ev.clientY;
			}
		}
		// setFocus() function maybe? 
		if( !hasFocus )
		{
			// Без этого у нас IE не понимает, что выбрали целый элемент управления, который хочет сам принимать события с клавиатуры
			focusHolder.focus();
		}
		ev.stopPropagation();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseMove( ev ) { 
		if (!ev) /* For IE. */ ev = window.event;		

		// detect IE by undefined ev.which, detect no-left-button-pressed by ev.button lower bit cleared
		if ( dragState != 0 && typeof ev.which == "undefined" && 0 == ( ev.button & 1 ) ) 
		{
			onMouseUp( ev );				
		}
		else if ( dragState == 1 ) // drag map
		{
			var dx, dy;
			dx = ev.clientX - dragStartClient[0];
			dy = ev.clientY - dragStartClient[1];				
			dragStartClient[0] = ev.clientX;
			dragStartClient[1] = ev.clientY;
			scrollBy( dx, dy );
		}
		else if ( dragState == 2 ) // drag slider
		{
			// shall give the zoomSlider's handler coordinates relative to theMap elmt ( slider controller will count them further )
			zoomSlider.onSliderMove( ev.clientY );
		}
	};	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onKeyDown( ev ) 
	{
		if ( !hasFocus ) return;
		var SCROLL_RATE = 50;	// px per one trigger
		
		switch( ev.which ) 
		{
			/* tab */ case 9: hasFocus = false; return;
			/*  +  */ case 107: case 187: onZoom( -1 );	break;
			/*  -  */ case 109: case 189: onZoom( +1 ); break;
			/*  ← */ case 37: scrollBy( +SCROLL_RATE, 0 ); break;
			/*  ↑ */ case 38: scrollBy( 0, +SCROLL_RATE );	break;
			/*  → */ case 39: scrollBy( -SCROLL_RATE, 0 ); 	break;
			/*  ↓ */ case 40: scrollBy( -0, -SCROLL_RATE ); break;
			default: // если не знакомая кнопка, не надо ее отменять
				return true;
		}
		
		// если над картой, то скролл страницы не делается
		if ( ev.preventDefault ) 
			ev.preventDefault();		
		return false;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseUp( ev )
	{
		if (!ev) /* For IE. */ ev = window.event;

		if ( dragState == 2 ) 
		{	// Юзер отпустил ползунок зума, а значит такой зум надо установить 
			zoomSlider.onSliderRelease( ev.clientY );			
		}
		
		dragState = 0;		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onWheelMove( event ) 
	{
		if (!event) /* For IE. */
				event = window.event;

		// wheel distance
		var delta = 0;
		if (event.wheelDelta) { /* IE & opera */ delta = -event.wheelDelta / 120; }
		else if (event.detail) { delta = event.detail / 3; }
		
		// need event's coordinates: pixels relative to theMap element
		onZoom( delta, getEventRelativeCoordinates(event) );
		
		// если над картой, то скролл страницы не делается
		if ( event.preventDefault ) 
			event.preventDefault();
		return false;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onResize( /* event */ ) // the function gets a parameter but who cares...
	{
		var newSize = utils.getWindowClientAreaSize( settings.scrollbarWidth );
		var h = newSize[1];
		var w = newSize[0];
		
		// Коллбэку мы какбэ говорим "смотри, какие теперь размеры у окна. Если ты их меняешь, то я себе возьму такой размер"
		// Коллбэк какбэ отвечает нам: "стань таким и таким по размерам" либо "оставайся как есть", когда он не меняет параметры
		if( settings.callback.resize )
			settings.callback.resize( newSize );
	
		if ( newSize[0] == w )	// не меняли?
			newSize[0] = theMap.width();			
		else
			theMap.css( "width", newSize[0] ) ;

		if ( newSize[1] == h  ) // не меняли?
			newSize[1] = theMap.height();
		else
			theMap.css( "height", newSize[1] );
	
		var delta = [ newSize[0] - viewportSize[0], newSize[1] - viewportSize[1] ];
		viewportSize = newSize;
		scrollByImpl( delta[0]/2, delta[1]/2 );
		frontBuffer.onResize();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 2. Внешний программный интерфейс 
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.scrollTo = function( x, y, scale )
	{
		var needRescale = arguments.length > 2;
		var scrollingFar = isFarFromHere( x, y );
		
		if ( !needRescale && !scrollingFar ) 
		{	// use smooth scrolling
			
		}
		else
		{
			if ( needRescale )
			{
				scale = Math.max( 0, Math.min( scale, settings.zoom.length - 1 ) );
				transform.setScale( settings.zoom[scale].mpp );	
				prepareBufferForScale( scale );					
			}
			transform.moveTo( x, y );		
			dragDistanceScreen[0] = viewportSize[0] / 2 ;
			dragDistanceScreen[1] = viewportSize[1] / 2 ;		
			frontBuffer.setupTileLayout();	
			applyMapBoundaries( dragDistanceScreen );
			applyScroll( dragDistanceScreen );
			frontBuffer.onScroll();
			updateView();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.addMark = function( id, cx, cy, type, description ) 
	{
		// 1. Create an element.
		var elmt = $("<div class=\"simplemark " + type + "\">").appendTo( layers['objects'] );
		elmt.click( onMarkClicked ); 			
		elmt.attr('mapobj', id );
		// 2. calc on-screen coordinates
		var w = [ cx, cy ];
		transform.toScreen_m( w );
		elmt.css( 'left', w[0] - settings.mark_size/2 ).css( 'top', w[1] - settings.mark_size/2 ); 
		// 3. add to objects map model
		mapObjects[id] = [ elmt, cx, cy, description ];
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.setRadius = function( cx, cy ) 
	{
		settings.user_location[0] = cx;
		settings.user_location[1] = cy;			
		updateRadii();		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.toggleRadius = function()
	{
		layers["radius"].toggle();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.hideMarks = function() 
	{
		layers['objects'].hide();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.showMarks = function() 
	{
		layers['objects'].show();
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function scrollBy( dx, dy )
	{
		scrollByImpl( dx, dy );
		frontBuffer.onScroll();		
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 3. Все что используется внутри
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	function loadObjectsForSectors( sectors, objTypes ) 
	{
		var queryObj = { s: sectors, t: objTypes };
		$.getJSON( settings.api_url, queryObj, onObjectsReceived )			
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function onObjectsRecieved( data )
	{
		console.log( data );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function getVisibleSectors()
	{
		var l = transform.toWorld_m( [ 0 - dragDistanceScreen[0], 0 - dragDistanceScreen[1] ]);
		var r = transform.toWorld_m( [ viewportSize[0] - dragDistanceScreen[0], viewportSize[1] - dragDistanceScreen[1] ] );
		
		var x_sector_min = utils.findPlaceInArray( l[0], settings.sectors.x );
		var x_sector_max = utils.findPlaceInArray( r[0], settings.sectors.x );
		
		var y_sector_max = utils.findPlaceInArray( l[1], settings.sectors.y );
		var y_sector_min = utils.findPlaceInArray( r[1], settings.sectors.y );
		
		var sectors = [];

		for( var y = y_sector_min; y <= y_sector_max; y++ )
			for( var x = x_sector_min; x <= x_sector_max; x++ )
				sectors.push( x + y * (settings.sectors.x.length+1) );
				
		return sectors;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function isFarFromHere( x, y )
	{
		var here = transform.toWorld_m( [ viewportSize[0]/2 - dragDistanceScreen[0], viewportSize[1]/2 - dragDistanceScreen[1] ] );
		var dist = Math.sqrt((here[0]-x)*(x-here[0]) + (here[1]-y)*(y-here[1]));
		return true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	function scrollByImpl( dx, dy )
	{
		dragDistanceScreen[0] = layersHolder[0].offsetLeft + dx		
		dragDistanceScreen[1] = layersHolder[0].offsetTop + dy
		applyMapBoundaries( dragDistanceScreen );
		applyScroll( dragDistanceScreen );
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function applyMapBoundaries( dragDistanceScreen )
	{
		// можно сравнить мировые координаты углов экрана и границы
		var l = transform.toWorld_m( [ 0 - dragDistanceScreen[0], 0 - dragDistanceScreen[1] ]);
		var r = transform.toWorld_m( [ viewportSize[0] - dragDistanceScreen[0], viewportSize[1] - dragDistanceScreen[1] ] );
		
		// Отклонения от границы по всем направлениям:
		var d = [0, 0, 0, 0]; // порядок: left top right bottom 
		d[0] = settings.map_limits[0] - l[0];		
		d[3] = settings.map_limits[1] - l[1];
		d[2] = settings.map_limits[2] - r[0];
		d[1] = settings.map_limits[3] - r[1];

		// вектор, на который надо скорректировать скролл:
		var dw = [0,0];
		if (d[0] > 0 && d[2] < 0 ) dw[0] = (d[2] + d[0]) / 2;
		else if( d[0] > 0 ) dw[0] = d[2] > d[0] ? d[0] : (d[2] + d[0]) / 2;
		else if( d[2] < 0 )	dw[0] = d[2] > d[0] ? d[2] : (d[2] + d[0]) / 2;
			
		if (d[1] > 0 && d[3] < 0 ) dw[1] = (d[3] + d[1]) / 2;
		else if( d[1] > 0 )	dw[1] = d[1] < d[3] ? d[1] : (d[3] + d[1]) / 2;
		else if( d[3] < 0 )	dw[1] = d[1] < d[3] ? d[3] : (d[3] + d[1]) / 2;

		var oo = [0,0]
		transform.toScreen_m( oo );
		transform.toScreen_m( dw );

		//  Здесь применяется коррекция на границы		
		dragDistanceScreen[0] += Math.round( oo[0] - dw[0] );
		dragDistanceScreen[1] += Math.round( oo[1] - dw[1] );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function applyScroll( dragDistanceScreen )
	{
		layersHolder.css( 'left', dragDistanceScreen[0] );
		layersHolder.css( 'top', dragDistanceScreen[1] );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function scrollBy( dx, dy )
	{
		scrollByImpl( dx, dy );
		frontBuffer.onScroll();		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function updateRadii() 
	{
		// получили координаты в пикселах, отн layersHolder
		var u = transform.toScreen(settings.user_location);
		radii[0].className = ( "radii scale" + getScale() );
		// рассчитываю, что сразу после установки класса подтянется размер
		var w = radii.width();
		var h = radii.height();
		radii.css('left', u[0] - w/2).css('top',u[1] - h/2);
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	// provides event's coordinates: pixels relative to theMap element
	function getEventRelativeCoordinates(event) // use browser native event
	{
		var mousePos = [];
		mousePos[0] = event.pageX == undefined ? event.clientX + document.documentElement.scrollLeft : event.pageX;
		mousePos[1] = event.pageY == undefined ? event.clientY + document.documentElement.scrollTop: event.pageY;
		// получили вроде пикселы отн. угла страницы (все кроме IE показывают pageX, pageY)
		var mapoffs = theMap.offset();
		mousePos[0] -= mapoffs.left;
		mousePos[1] -= mapoffs.top;		
		return mousePos;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// всякие компоненты могут узнавать масштаб, а про то, что масштаб хранится в фронтбуффере, им знать вобще не надо.
	function getScale() { 
		return frontBuffer.getScale();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onZoom( delta, ptZoom /* экранные координаты точки зума отн. theMap */ )
	{
		// есть ли тут зум
		var old_scale = getScale();
		var new_scale = Math.max( 0, Math.min( old_scale + delta, settings.zoom.length - 1 ) );
		if ( new_scale - old_scale == 0 ) return;

		prepareTransformationForZoom( transform, old_scale, new_scale, arguments.length >= 2 ? ptZoom : [ Math.round(viewportSize[0]/2), Math.round(viewportSize[1]/2) ]);
		prepareBufferForScale( new_scale );
		applyMapBoundaries( dragDistanceScreen );
		applyScroll( dragDistanceScreen );
		updateView();
		//backBuffer.animateZoom( realDelta );			
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function prepareTransformationForZoom( transform, old_scale, new_scale, ptZoom )
	{
		var wZoomCenter = transform.toWorld_m( [ ptZoom[0] - dragDistanceScreen[0] , ptZoom[1] - dragDistanceScreen[1] ] );
		var wLeftUpperCorner = transform.toWorld_m( [0,0] );		
		wZoomCenter[0] -= wLeftUpperCorner[0]; 
		wZoomCenter[1] -= wLeftUpperCorner[1];
		// Умножаем этот вектор на отношение масштабов
		var mul = 1 - settings.zoom[new_scale].mpp / settings.zoom[old_scale].mpp;
		wZoomCenter[0] *= mul;
		wZoomCenter[1] *= mul;
		
		// zoom around mousePos should be
		transform.setScale( settings.zoom[new_scale].mpp );		
		transform.moveBy( wZoomCenter[0], wZoomCenter[1] );		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function prepareBufferForScale( new_scale ) 
	{
		// clear & set backbuffer
		backBuffer.clear();
		backBuffer.setScale( new_scale );
		
		// switchBuffers
		var _3 = frontBuffer;
		frontBuffer = backBuffer;
		backBuffer = _3;
		
		// adjust thier styles too 
		frontBuffer.show();
		backBuffer.hide();		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function updateView()
	{
		updateRadii();
		redrawMarks();
		infoBubble.placeAgain();
		zoomSlider.updateView();		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function redrawMarks() 
	{
		var elmt = null, w = [0,0];
		for( var i in mapObjects )
		{
			elmt = mapObjects[i][0];
			w[0] = mapObjects[i][1];
			w[1] = mapObjects[i][2];		
			transform.toScreen_m( w );						
			elmt.css( 'left', w[0] - settings.mark_size / 2 ).css( 'top', w[1] - settings.mark_size / 2 )
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMarkClicked() 
	{
		// понять, кого кликнули чтобы знать что показывать (например можно пройтись по массиву, а можно в элемент аттрибутом записать)
		var id = $(this).attr('mapobj')
		if ( undefined == mapObjects[id] )
			return; // непонятно как такое возможно.
		
		infoBubble.placeAt( mapObjects[id][1], mapObjects[id][2] );
		infoBubble.setHtml( mapObjects[id][3] );
		infoBubble.show();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function gcMarks()
	{
		// Эту функцию надо будет звать после зума или далекого скролла... 
		// чтобы всякие элементы, которые далеко от просмтатриваемой области удалять из памяти
		
		// Для каждой отметки: если она далеко, удалить ее нафиг.
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	


	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 4. Дополнительные классы для использования внутри карты
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	// TileSet - Набор плиток (либо мозайка), из которых составляется карта
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function TileSet( div )
	{
		var tile = [];
		var tiles_per_dimension = [0,0];
		var largest_vp = [0,0];
		var scale = 0;
		var x0, y0;		// экранные координаты нулевой плитки в нулевом периоде (а период - это количество пролистанных плиток/плиток_в_ряду)
		var ww = [];
	
		this.onResize = function()
		{
			tiles_per_dimension[0] = 1 + Math.ceil( viewportSize[0] / settings.tile_size );
			tiles_per_dimension[1] = 1 + Math.ceil( viewportSize[1] / settings.tile_size );

			// create more tiles, but does not remove excessive tiles (if user shrinked window)
			var deficit = tiles_per_dimension[0] * tiles_per_dimension[1] - tile.length;
			for( var i = 0; i < deficit; i++ )
				div.append( createTile() );
				
			if ( deficit > 0 )
			{
				// will save this size for later uses (if vp gets smaller, will still use this large one)
				largest_vp[0] = Math.max( viewportSize[0], largest_vp[0] );
				largest_vp[1] = Math.max( viewportSize[1], largest_vp[1] );
				this.setupTileLayout();
			}
			
			this.onScroll();
		}
		
		this.onScroll = function() 
		{
			// на сколько плиток улистали карту, с момента раскладки плиток
			var sx = ( -x0 - dragDistanceScreen[0] ) / settings.tile_size + tiles_per_dimension[0] - 1;
			var sy = ( -y0 - dragDistanceScreen[1] ) / settings.tile_size + tiles_per_dimension[1] - 1;
			// а теперь для каждой плитки нужно понять, на месте ли она.
			for( i = 0; i < tile.length; i++ )
			{
				// "плиточные" координаты данной плитки
				var tx = i % tiles_per_dimension[0];
				var ty = Math.floor( i / tiles_per_dimension[0] );
				// в каком периоде находится данная плитка?
				var px = Math.floor( ( sx - tx ) / tiles_per_dimension[0] );
				var py = Math.floor( ( sy - ty ) / tiles_per_dimension[1] );			
				// целевые экранные координаты для плитки
				var x = settings.tile_size * ( px * tiles_per_dimension[0] + tx ) + x0;
				var y = settings.tile_size * ( py * tiles_per_dimension[1] + ty ) + y0;

				var el = tile[i];
				// где на самом деле находится плитка
				var actX = el[0].offsetLeft;
				var actY = el[0].offsetTop;
				
				// если примерно* совпало, двигать не надо, рисунок менять тоже не надо.
				// *точно оно никогда не сопадет - это же float'ы
				if( Math.abs(x - actX) < 2 && Math.abs(y - actY) < 2 )
					continue;

				el.css( 'left', x ).css( 'top', y );		

				// осталось понять, какой будет картинка на новом месте (мировые координаты левого-верхнего угла)
				var w0 = ww[0] + settings.tile_size*settings.zoom[scale].mpp * ( px * tiles_per_dimension[0] + tx );
				var w1 = ww[1] - settings.tile_size*settings.zoom[scale].mpp * ( py * tiles_per_dimension[1] + ty );				
				var newsrc = getSrcForCoordinate( w0, w1, scale, i ); 
				if( newsrc == el[0].src ) alert("!!111");
				el[0].src = getSrcForCoordinate( w0, w1, scale, i );
				// Вот как я узнаю, будет IE картинку грузить или возьмет из памяти (и не позвовет онлоад)?
				if( !$.browser.msie ) 
					el[0].style.display = "none"; 

			}
		}		
		
		this.setupTileLayout = function() {
			var tile_size = settings.tile_size*settings.zoom[scale].mpp;
			// Рассмотрим точку, принадлежащую нулевой плитке, экранные координаты будут преобразованы в мировые:
			var w = [ -dragDistanceScreen[0], -dragDistanceScreen[1] ];					
			transform.toWorld_m( w );
			// сделать копию
			var m = w.slice();
			// m = расстояние от угла плитки до точки W в мировых координатах
			m[0] = ( w[0] - settings.zoom[scale].x0 ) - Math.floor( ( w[0] - settings.zoom[scale].x0 ) / tile_size ) * tile_size;
			m[1] = ( w[1] - settings.zoom[scale].y0 ) - Math.floor( ( w[1] - settings.zoom[scale].y0 ) / tile_size ) * tile_size;
			// Отмечаем точку 0 в углу нулевой плитки (экранные координаты)
			x0 = -m[0] / settings.zoom[scale].mpp - dragDistanceScreen[0];
			y0 = m[1] / settings.zoom[scale].mpp - dragDistanceScreen[1];
			
			ww[0] = w[0] - m[0];
			ww[1] = w[1] - m[1];
			return;
		}
		

		this.hide = function() { div.hide(); }
		this.show = function() { div.show(); }

		// Filename for tile containing the point
		function getSrcForCoordinate( x, y, scale )
		{
			var szs = settings.zoom[scale];
			var tile_side = szs.mpp * settings.tile_size;
			var tx = Math.round(( x - szs.x0 ) / tile_side);
			var ty = -Math.round(( y - szs.y0 ) / tile_side);
			
			if ( x >= szs.x0 - tile_side && y <= szs.y0 + tile_side ) 
				return szs.file + utils.letterMath.add( szs.l, ty ) + utils.numberMath.add( szs.i, tx ) + ".png"
			else
				return settings.defaultimg + "?x="+x+"&y="+y+"&s="+scale + ( arguments.length > 3 ? "&i="+arguments[3] : "" ) ;
		}		
		
		this.clear = function() 
		{
			div.empty();
			for( var i = 0; i < tile.length; i++ )
				tile[i] = null;
			tile = [];
		}

		this.setInitialScale = function( _scale )
		{
			scale = _scale;
		}

		this.setScale = function( _scale )
		{
			this.setInitialScale( _scale );
			this.onResize();
		}
		this.getScale = function() { return scale; } 
		
		function createTile( )
		{
			var elmt = $('<img>');
			utils.makeUnselectable.apply( elmt[0] );
			
			// elmt.ready( elmt.show() ); ??? mayne this is the key to Yandex-maps no-flickering... Google does live without it.
			
			// Ахтуин и алёрт! 
			// Эксплорер не делает онлоад всякий раз, когда меняется картинка. 
			// Остальные браузеры не страдают такой гомофилией
			
			elmt[0].onload = function(){ 
				this.style.display = "block"; 
			};
			tile.push( elmt );
			return elmt; 
		}
	}


	// ZoomSlider - ползунок изменения масштаба
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// Ожидаемая модель DOM:
  /* <div id="map-zoom">
       <input id="map-zoom-in" type="image" src="img/plus.gif" />
         <div id="map-zoom-rails">
           <div id="map-zoom-slider"></div>
         </div>
       <input id="map-zoom-out" type="image" src="img/minus.gif" />
     </div>
	*/
	
	function ZoomSlider( div ) 
	{
		var jqRails = null;
		var jqSlider = null;

		var zoomLevels = []; 
		var MIN_ZOOM = 0;
		var MAX_ZOOM = settings.zoom.length - 1;
		
		var sliderStep = 0;
		var railsTop = 0;
		
		function constructor() 
		{
			// find +/- and slider, relocate them to 
			$("#map-zoom-in").click( function( ev ) { onZoom( -1 ); ev.stopPropagation(); } );
			$("#map-zoom-out").click( function( ev ) { onZoom( +1 ); ev.stopPropagation();  } );
			jqRails = $("#map-zoom-rails");
			jqSlider = $("#map-zoom-slider").mousedown( function ( ev ) { dragState = 2; } );

			// положения ползунка на разные уровни зума:
			sliderStep = ( jqRails.height() - jqSlider.height() ) / ( MAX_ZOOM - MIN_ZOOM );
			for( var i = MIN_ZOOM; i <= MAX_ZOOM; i++ )	zoomLevels[i] = sliderStep*i;

			// поведение элементов
			div.mousedown( function( ev ) { ev.stopPropagation(); } );
			div.click( function( ev ) { onZoom( getScaleFromClientY(ev.clientY) - getScale() ) } );
		}		
		
		this.updateView = function()
		{
			var scale = getScale();
			jqSlider.css( 'top', zoomLevels[scale] );
			if ( scale == MIN_ZOOM )
			{
				// сделать недоступной кнопку -
			}
			if ( scale == MAX_ZOOM )
			{
				// сделать недоступной кнопку	+
			}
		}
		
		this.onSliderMove = function( clientY ) 
		{
			jqSlider.css( 'top', zoomLevels[ getScaleFromClientY( clientY ) ] );
		}
		
		this.onSliderRelease = function( clientY ) 
		{
			var newScale = getScaleFromClientY( clientY );
			var delta = newScale - getScale();
			if ( delta != 0 )
				onZoom( delta );
		}
		
		function getScaleFromClientY( clientY ) 
		{
			// рельсы не должны никуда смещаться... так что их top будет постоянным, только мозилла в конструкторе считает неправильно top. пришлось унести сюда
			if ( 0 == railsTop ) railsTop = jqRails.offset().top;
			return Math.max( 0, Math.min( Math.round( ( clientY - railsTop ) / sliderStep ), MAX_ZOOM - MIN_ZOOM ) );
		}
	
		constructor();
	}
	
	// InfoBubble - пузырек с информацией об объекте
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// Ожидаемая модель DOM: 
	/*	
		<div id="map-infobubble">
			<div id="map-infobubble-holder">
				<div id="map-infobubble-contents"></div>
				<div id="map-infobubble-close"></div>      			
				<!-- Любые теги внутри и около -->
			</div>
		</div>
	*/			

	function InfoBubble( div ) 
	{
		var jqTextPlace = null;
		var signPlace = [ settings.x0, settings.y0 ]; // надежно гарантирует действительные координаты
		
		this.placeAt = function(x, y) 
		{
			signPlace[0] = x;
			signPlace[1] = y;
			this.placeAgain();
		}
		this.placeAgain = function() 
		{
			var screen_c = transform.toScreen( signPlace );
			div.css("left", screen_c[0]).css('top', screen_c[1]);
		}
		this.setHtml = function( html ) {
			jqTextPlace[0].innerHTML = html; 
		} 
		this.show = function() { 
			if ( typeof( settings.callback.onInfoShow ) == "function" )
				settings.callback.onInfoShow( div );
			else	
				div.show(); 
		} 
		function hide() { 
			if ( typeof( settings.callback.onInfoShow ) == "function" )
				settings.callback.onInfoHide( div );
			else	
				div.hide(); 			
		}
		
		function constructor()
		{
			jqTextPlace = $( "#map-infobubble-contents" );
			$("#map-infobubble-close").click( hide );
			div.mousedown(sp);			
		};
		constructor();
	}	

	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 5. Запуск конструктора самого класса карты
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	constructor();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////	
//=8<=============================8<=================================8<================================8<===
////////////////////////////////////////////////////////////////////////////////////////////////////////////
var utils = {
	scrollbarWidth: function () 
		{
			 var scr = null;
			 var inn = null;
			 var wNoScroll = 0;
			 var wScroll = 0;
			 scr = document.createElement('div');
			 scr.style.position = 'absolute';
			 scr.style.top = '100px';
			 scr.style.left = '100px';
			 scr.style.width = '200px';
			 scr.style.height = '150px';
			 inn = document.createElement('div');
			 inn.style.width = '100%';
			 inn.style.height = '200px';
			 scr.appendChild(inn);
			 document.body.appendChild(scr);
			 scr.style.overflow = 'hidden';
			 wNoScroll = inn.offsetWidth;
			 scr.style.overflow = 'scroll';
			 wScroll = inn.offsetWidth;
			 if (wNoScroll == wScroll) wScroll = scr.clientWidth;
			 document.body.removeChild(document.body.lastChild);
			 return (wNoScroll - wScroll);
		},
	getWindowClientAreaSize: function ( w/*idth of the scrollbar */ )
	{
		var size = [0,0];
		// Yes, jQuery's standart $(document).height() fails - under Opera it does.
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			size[0] = window.innerWidth - w;
			size[1] = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			size[0] = document.documentElement.clientWidth;
			size[1] = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			size[0] = document.body.clientWidth;
			size[1] = document.body.clientHeight;
		}	
		return size;
	}, 
	findPlaceInArray: function( needle, array ) 
	{
		if( array.length == 0 ) return 0; 
		for( var i = 0; i < array.length; i++ )
			if ( needle < array[i] ) return i;
		return array.length;
	},
	someMath: function( lettersCount, letterZero ) 
	{
		this.toNumber = function ( aa ) 
		{
			var sum = 0;
			for( var i = 0; i < aa.length; i++ )
				sum = sum * lettersCount + aa.charCodeAt(i) - letterZero; 			
			return sum;
		}
		this.toLetters = function ( num, min_digits ) 
		{
			if ( arguments.length < 2 ) min_digits = 1;
			var res = "", mod, div;
			while ( num > 0 || min_digits > 0 )
			{
				mod = num % lettersCount;
				num = Math.floor( num / lettersCount );
				res = String.fromCharCode( letterZero + mod) + res;			
				min_digits--;
			}
			return res;
		},
		
		this.add = function( aa, bb )
		{
			var md = 1;
			var s1, s2; 
			if ( typeof aa == "string" ) 
			{
				s1 = this.toNumber( aa );
				md = Math.max( md, aa.length );
			}
			else 
				s1 = aa;
			
			if ( typeof bb == "string" ) 
			{
				s2 = this.toNumber( bb );
				md = Math.max( md, bb.length );
			}
			else
				s2 = bb;
			return this.toLetters( s1 + s2, md );
		}
	},
	Matrix: function () {
		var a = [[1,0,0],[0,-1,0]]; // direct matrix
		var i = [];							   // inverse one
		var invActual = false;
		
		// direct translation - a version which modifies its argument + one that does not
		this.toWorld = function( v ) { return this.toWorld_m( v.slice() ); }
		this.toWorld_m = function( v ) { 
			var x = a[0][0]*v[0] + a[0][1]*v[1] + a[0][2];
			v[1] = a[1][0]*v[0] + a[1][1]*v[1] + a[1][2];		
			v[0] = x;
			return v;
		}
	
		// inverse translation - a version which modifies its argument + one that does not
		this.toScreen = function( v ) { return this.toScreen_m( v.slice() ); }	
		this.toScreen_m = function( v ) {
			// return v * this(-1) 
			if ( !invActual ) calcInverse();
			var x = i[0][0]*v[0] + i[0][1]*v[1] + i[0][2];
			v[1] = i[1][0]*v[0] + i[1][1]*v[1] + i[1][2];		
			v[0] = x;
			return v;
		}
	
		this.moveTo = function( x, y ) { a[0][2] = x; a[1][2] = y; invActual = false; }
		this.moveBy = function( x, y ) { a[0][2] += x; a[1][2] += y; invActual = false; }
		
		function scaleBy( s ) {
			a[0][0] *= s; a[0][1] *= s; // a[0][2] *= s;
			a[1][0] *= s; a[1][1] *= s; // a[1][2] *= s;		
			invActual = false;		
		}
		
		this.setScale = function( s ) { scaleBy( s / Math.sqrt( Math.abs(det()) ) ); }
		this.toString = function() { return '['+a[0]+'] | ['+a[1]+']'; } 																					
		this.toStringInv = function() { calcInverse(); return '['+i[0]+'] | ['+i[1]+']'; } 																					
	
		function det() { return a[0][0]*a[1][1] - a[1][0]*a[0][1]; }
		function calcInverse() {
			// find minors, transpose, divide by det
			var _det = det();
			i[0] = [  a[1][1] / _det, -a[0][1] / _det, ( a[0][1] * a[1][2] - a[1][1]*a[0][2] ) / _det ];
			i[1] = [ -a[1][0] / _det,  a[0][0] / _det, ( a[1][0] * a[0][2] - a[0][0]*a[1][2] ) / _det ];
			invActual = true;
		}
	},
	makeUnselectable: function() 
	{
		if (typeof document.onselectstart!="undefined") //IE tends to select everythin'
		{
			this.unselectable = 'on'; 
			this.onselectstart = ret_false;
		}
		else 
		{
			this.onmousedown = pdf;
		}
	}
};

utils.letterMath = new utils.someMath( 26, 65 ); // Буквенная математика (26 цифр, начиная с 65ого символа)
utils.numberMath = new utils.someMath( 10, 48 ); // Обычная математика - она умеет сохранять нули впереди аргументов

function ret_false() { return false; } // megafunction!!! 
function pdf(e) { if ( e.preventDefault ) { e.preventDefault(); } return false; } 
function sp(e) { if ( e.stopPropagation ) { e.stopPropagation(); } e.cancelBubble = true; }