// JavaScript Document

function qf() { return false; } // megafunction!!! 
function pd(e) { e.preventDefault(); } // not that much mega 
function pdf(e) { if ( e.preventDefault ) { e.preventDefault(); } return false; } 
function sp(e) { if ( e.stopPropagation ) { e.stopPropagation() }; e.cancelBubble = true; } 

function dump( what, filter ) 
{
	if ( typeof what == "number" || typeof what == "string" ) 
	{
		document.getElementById("debugger").innerHTML = what;
		return;
	}
	
	var thedump = [];
	for ( i in what )
		if ( arguments.length < 2 || filter(i) ) 
			thedump.push( i + ": " + what[i] );
			
	document.getElementById("debugger").innerHTML = thedump.join("<br />");
}

function sprintf( z ) { for( var i = 1, len = arguments.length; i < len; ++i ) { z = z.replace( "$"+i, arguments[i] ); } return z; };

/*
	coordinate systems are:
	1. pixels relative to upper-left corner of theMap
	1a. pixels relative to layers holder (which is moved to make the whole map scroll)
	2. meters relative to (0,0)m
	
	as for 1-1a translation, it's clear: add offsetLeft/Top to translate
	as for 1-2 - it's not that much. there should be a translation matrix
	
	as for theMap to client or to Screen coordinates - we do not care. browser handles.
*/	


// This is transition matrix for 2D: 
// | a00 a01 | x0 |
// | a10 a11 | y0 | 
// |---------+----|
// |  0   0  |  1 | 

// inverse M(-1) * det(M) = 
// |  a11 -a01 | y0*a01 - a11*x0 |
// | -a10  a00 | x0*a10 - a00*y0 | 
// |-----------+-----------------|
// |   0   0   | a11*a00-a10*a01 | 



function translation() {
	var a = [[1,0,0],[0,-1,0]]; // direct matrix
	var i = [];							   // inverse one
	var invActual = false;
	
	function det() {
		return a[0][0]*a[1][1] - a[1][0]*a[0][1];
	};

	// direct translation - a version which modifies its argument + one that does not
	this.direct_m = function( v ) { 
		// return v * this
		var x = a[0][0]*v[0] + a[0][1]*v[1] + a[0][2];
		var y = a[1][0]*v[0] + a[1][1]*v[1] + a[1][2];		
		v[0] = x; v[1] = y;
		return v;
	}
	this.direct = function( v ) {
		return this.direct_m( v.slice() );
	}

	// inverse translation - a version which modifies its argument + one that does not
	this.inverse_m = function( v ) {
		// return v * this(-1) 
		if ( !invActual ) calcInverse();
		var x = i[0][0]*v[0] + i[0][1]*v[1] + i[0][2];
		var y = i[1][0]*v[0] + i[1][1]*v[1] + i[1][2];		
		v[0] = x; v[1] = y;
		return v;
	}
	this.inverse = function( v ) {
		return this.inverse_m( v.slice() );
	}	
	
	// swap matrices	
	this.swapMatrices = function() { 
		if ( !invActual ) calcInverse();
		var x = a;
		a = i;
		i = x;
	}
	
	this.moveBy = function( v ) {
		a[0][2] += v[0];
		a[1][2] += v[1];
		invActual = false;
	}
	
	this.scaleBy = function( s ) {
		a[0][0] *= s;
		a[0][1] *= s;
//		a[0][2] *= s;
		a[1][0] *= s;
		a[1][1] *= s;
//		a[1][2] *= s;		
		invActual = false;		
	}
	
	this.setScale = function( s ) { 
		this.scaleBy( s / Math.sqrt( Math.abs(det()) ) );
	}
	
	this.toString = function() { return '['+a[0]+']\n['+a[1]+']'; } 																					
	this.toStringInv = function() { calcInverse(); return '['+i[0]+']\n['+i[1]+']'; } 																					

	// inverse = 
	function calcInverse() {
		// find minors, transpose, divide by det
		var x0 = a[0][1] * a[1][2] - a[1][1]*a[0][2];
		var y0 = a[1][0] * a[0][2] - a[0][0]*a[1][2];
		var i10 = -a[1][0], i01 = -a[0][1], i00 = a[1][1], i11 = a[0][0];
		var _det = det();
		i[0] = [ i00 / _det, i01 / _det, x0 / _det ];
		i[1] = [ i10 / _det, i11 / _det, y0 / _det ];
		invActual = true;
	};
}

	
function mapType( settings )
{

	var settings = $.extend({	
								// 80.000 и мельче
							  zoom:  [ { mpp:0.6614583333333, x0: 0, y0: 0 }, // 2500 
												 { mpp:1.3229166666666, x0: 0, y0: 0 }, //  5k
												 { mpp:2.6458333333333, x0: 0, y0: 0 }, // 10k
												 { mpp:5.2916666666666, x0: 0, y0: 0 }, // 20k
												 { mpp:10.583333333333, x0: 381095.816, y0: 6213620.630, file:"img/40x/40k_", l:"AO", i:"03" }, // 40k
												 { mpp:21.166666666666, x0: 380180.755, y0: 6217335.193, file:"img/80x/80k_", l:"G", i:"02" }  // 80k
											 ], 			// all scales we have here	- meters per pixel
								tile_size: 240,													 			// tile dimensions (in pixels) 	
								initialScale: 5,															// ok, this can be changed
								map_limits: [ -200000, 200000, 200000, -20000 ],	// viewable area bounds, order is like in CSS: top, right, bottom, left
								x0: 413649,															// как бы точка, которая будет в центре 
								y0: 6182172,														// после запуска карты сразу.
								applyTo : $('div.map:first'),								// temporary here = should become parameter passed via $(element).myMap(...) call 
								defaultimg : 'maps.php',											// image to substitute missing parts.
								// положение "себя" на карте - чтобы рисовать радиусы доступности
								user_location : [ 0, 0 ],
								// настройки для подсказок на карте
								bubble_width: 200,
								bubble_height: 120,
								mark_width: 32,
								scrollbarWidth : scrollbarWidth(), 						// ширина скроллбаров нужна ( 
								callback: {}																	// user might have omitted this, but let's create to avoid checks for its presence.
								}, settings);
	settings.callback = $.extend({ /* Add default callbacks here */ } , settings.callback );
	
	
	// ******************* THIS IS ZOOM SLIDER  ****************************
	function ZoomSlider( div ) 
	{
		var zoomLevels = []; 
		var MIN_ZOOM = 0;
		var MAX_ZOOM = settings.zoom.length - 1;
		
		var rails = null;
		
		var slider = null;
		var sliderStep = 0;

		// некоторые вещи лучше записать в переменные, чем потом каждый раз читать из ДОМа
		var railsTop = 0;
		var railsLength = 0;
		var sliderHeight = 0;
		
		function constructor() 
		{
			// create +/- and slider
			$("<input class=\"zoom-in\" type=\"image\" src=\"img/plus.gif\" />").appendTo(div).click( function( ev ) { onZoom( -1 ); ev.stopPropagation(); } );
			slider = $("<div class=\"zoom-slider\">" ).appendTo( rails = $("<div class=\"zoom-scale\">").appendTo(div) );
			$("<input class=\"zoom-out\" type=\"image\" src=\"img/minus.gif\" />").appendTo(div).click( function( ev ) { onZoom( +1 ); ev.stopPropagation();  } );

			// кешировать размеры
			railsLength = rails.height();		
			sliderHeight = slider.height()
			// положения ползунка на разные уровни зума:
			sliderStep =  ( railsLength - sliderHeight ) / ( MAX_ZOOM - MIN_ZOOM );	
			for( var i = MIN_ZOOM; i <= MAX_ZOOM; i++ )
				zoomLevels[i] = sliderStep*i;

			// поведение элементов
			div.mousedown( function( ev ) { ev.stopPropagation(); } );
			slider.mousedown( function ( ev ) { dragState = 2; } );
			div.click( function( ev ) { onZoom( getScaleFromClientY(ev.clientY) - getScale() ) } );
		}		
		
		this.updateView = function( scale )
		{
			slider.css( 'top', zoomLevels[scale] );
			if ( scale == MIN_ZOOM )
			{
				// сделать недоступной кнопку -
			}
			if ( scale == MAX_ZOOM )
			{
				// сделать недоступной кнопку	+
				
				
				// строго говоря, можно им только класс проставить чтобы выглядели иначе, на клик не реагировали, например
				// потому что код все равно не сможет сделать зум за пределы
			}
		}
		
		this.onSliderMove = function( clientY ) 
		{
			slider.css( 'top', zoomLevels[ getScaleFromClientY( clientY ) ] );
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
			// рельсы не должны никуда смещаться... так что их top будет постоянным, 
			// вот только мозилла "радует": в конструкторе считает неправильно top. пришлось унести сюда
			if ( 0 == railsTop ) 
				railsTop = rails.offset().top;

			return Math.max( 0, Math.min( Math.round( ( clientY - railsTop ) / sliderStep ), MAX_ZOOM - MIN_ZOOM ) );
			
// Вычтисление точной координаты еще пригодится? - оставим тут 
// var y = clientY < railsTop + sliderHeight/2 ? sliderHeight/2 : ( clientY - railsTop > railsLength - sliderHeight/2 ? railsLength - sliderHeight/2: clientY - railsTop );

		}
	
		constructor();
	}
	
	
	// ************************ TILE SET ************************************
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
				this.layoutTiles();
			}
			else	// a lighter version
				this.onScroll(); // no longer works - image is grown in both directions
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
				
				if( x == actX && y == actY )	// если совпало, двигать не надо, рисунок менять тоже не надо.
					continue;

				el.css( 'left', x ).css( 'top', y );		

				// осталось понять, какой будет картинка на новом месте (мировые координаты левого-верхнего угла)
				var w0 = ww[0] + settings.tile_size*settings.zoom[scale].mpp * ( px * tiles_per_dimension[0] + tx );
				var w1 = ww[1] - settings.tile_size*settings.zoom[scale].mpp * ( py * tiles_per_dimension[1] + ty );				
				el[0].src = getSrcForCoordinate( w0, w1, scale, i );
			}
		}		
		
		this.layoutTiles = function() {
			var tile_size = settings.tile_size*settings.zoom[scale].mpp;
			// Рассмотрим точку, принадлежащую нулевой плитке, экранные координаты будут преобразованы в мировые:
			var w = [ -dragDistanceScreen[0], -dragDistanceScreen[1] ];					
			trans.direct_m( w );
			// сделать копию
//			console.log( "layout, ", tile_size )
			var m = [ w[0], w[1] ];
			// m = расстояние от угла плитки до точки W в мировых координатах
			m[0] = ( w[0] - settings.zoom[scale].x0 ) - Math.floor( ( w[0] - settings.zoom[scale].x0 ) / tile_size ) * tile_size;
			m[1] = ( w[1] - settings.zoom[scale].y0 ) - Math.floor( ( w[1] - settings.zoom[scale].y0 ) / tile_size ) * tile_size;
//			console.log( "top-left screen corner: ", w );
//			console.log( "delta: ", m );
			
			//console.log( "top-offscreen tile: ", w[0] + m[0];
			// Отмечаем точку 0 в углу нулевой плитки (экранные координаты)
			x0 = ( -m[0] ) / settings.zoom[scale].mpp - dragDistanceScreen[0];
			y0 = ( m[1] ) / settings.zoom[scale].mpp - dragDistanceScreen[1];
//			console.log( x0, y0 );
			
			ww[0] = w[0] - m[0];
			ww[1] = w[1] - m[1];
//			console.log( "topmost tile (w)", ww );
			this.onScroll();
			return;
										
			// дальше осталось расположить плитки с заданным шагом относительно этой точки
			for ( var i = 0; i < tile.length; i++	)		
			{
				var el = tile[i];
				var tile_x = i % tiles_per_dimension[0];
				var tile_y = Math.floor( i / tiles_per_dimension[0] );
				// try to lay tiles across the screen;

				el[0].src = getSrcForCoordinate( ww[0]+(tile_x)*settings.tile_size*settings.zoom[scale].mpp, 
																				 ww[1]-(tile_y)*settings.tile_size*settings.zoom[scale].mpp, scale, i );
				el.css( 'left', settings.tile_size * tile_x + x0 );
				el.css( 'top', settings.tile_size * tile_y + y0 );
				el.css( 'width', settings.tile_size );
				el.css( 'height', settings.tile_size );					
			}
		}
		

		
		this.hide = function() { div.hide(); }
		this.show = function() { div.show(); }

		function makeUnselectable( elmnt ) 
		{
			if (typeof document.onselectstart!="undefined") //IE tends to select everythin'
			{
				elmnt.unselectable = 'on'; 
				elmnt.onselectstart = qf;
			}
			else 
			{
				elmnt.onmousedown = pdf;
			}
		}
		

		// Filename for tile containing the point
		function getSrcForCoordinate( x, y, scale )
		{
			var szs = settings.zoom[scale];
			var tile_side = szs.mpp * settings.tile_size;
			var tx = Math.round(( x - szs.x0 ) / tile_side);
			var ty = -Math.round(( y - szs.y0 ) / tile_side);
			
			if ( x >= szs.x0 - tile_side && y <= szs.y0 + tile_side && scale >= 4 ) 
				return szs.file + letterMath.add( szs.l, ty ) + numberMath.add( szs.i, tx ) + ".png"
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
			makeUnselectable( elmt[0] );
			
			// elmt.ready( elmt.show() ); ??? mayne this is the key to Yandex-maps no-flickering... Google does live without it.
			
			tile.push( elmt );
			return elmt; 
		}
	}

	function InfoBubble( div ) 
	{
		var textPlace = null;
		function constructor()
		{
			// у холдера будет относительная позиция, внутри все опять будут абсолютными
			var holder = $( "<div class=\"holder\">" ).appendTo(div);
			textPlace = $( "<div class=\"contents\">" ).appendTo(holder);
			holder.append( "<div class=\"shadow_r\">" );			
			holder.append( "<div class=\"shadow_d\">" );			
			holder.append( "<div class=\"shadow_rd\">" );						
			
			div.click( function() { div.hide(); } ).mousedown(sp);
		}
		
		this.placeAt = function(x, y) 
		{
			var screen_c = trans.inverse_m( [x,y] );
			screen_c[0] -= settings.bubble_width / 2;
			screen_c[1] -= settings.bubble_height + settings.mark_width / 2;
			div.css("left", screen_c[0]).css('top', screen_c[1]);
		}
		this.setHtml = function( html ) {
			textPlace.text( html ); 
		} 
		this.show = function() { div.show(); } 
		
		
		constructor();
	}

	var dragState = 0; // 0 : not draggin' 1: draggin' map; 2: draggin' zoom slider
	var dragStartClient = [0,0];	// will store delta for drag here
	var viewportSize = [0,0];
	
	var hasFocus = false; // строго говоря, div'ы не должны иметь фокуса, но у нас тут особый случай, мы делаем как бы элемент управления, так что будет хитро.
	var dragDistanceScreen = [0,0]; // reflects layerHolder CSS left & top

	var frontBuffer = null, backBuffer = null;
	var trans = new translation();	// this matrix used to translate pixel coordinates relative to theMap into world ones and vice versa.	
	
	// this one should become parameter passed via $(element).myMap( ... ) call
	var theMap = settings.applyTo;
	var zoomSlider = null;
	var focusFolder = null;
	var layersHolder = null, layers = {};
	var infoBubble = null;
	var radii = null;
	
	// хранить отметки на карте сюда
	var mapObjects = [];

	function constructor() {
		
		(function createHTMLelements () {
			theMap.empty();
			theMap.append( $("<div class=\"stencil\">").append( layersHolder = $("<div class=\"layers\">") ) );
			focusHolder = $("<input class=\"focusEater\"/>").appendTo( theMap );
			layers['geo'] = $("<div class=\"geo layer\">").appendTo(layersHolder);
			frontBuffer = new TileSet( $("<div class=\"1st tileset\">").appendTo( layers['geo'] ) );
			backBuffer = new TileSet( $("<div class=\"2nd tileset\">").appendTo( layers['geo'] ) );		
			layers['avaliability'] = $("<div class=\"avaliability layer\">").appendTo(layersHolder);
			layers['radius'] = $("<div class=\"radius layer\">").appendTo(layersHolder);
			layers['objects'] = $("<div class=\"objects layer\">").appendTo(layersHolder);			
			radii = $("<div class=\"radii\">").appendTo(layers['radius']);
			
			infoBubble = new InfoBubble( $("<div class=\"infobubble\">").appendTo(layersHolder) );
			
			if ( typeof( settings.callback.contents ) == "function" )
				theMap.append( settings.callback.contents() );
				
//			theMap.append( "<div class=\"glass\">" );

			zoomSlider = new ZoomSlider( $("<div class=\"controls\">").appendTo( theMap ) ); // 1st capital letter for classname 

		})();
		
		// should not create more than one map per page
		document.onmousemove = function ( ev ) { 
			if (!ev) /* For IE. */
				ev = window.event;		

//			dump ( ev, function (i) { return i.indexOf('X') > 0 ||  i.indexOf('Y') > 0 || i.indexOf('button') >= 0 || i.indexOf('which') >= 0 ; }  ) 

			// IE does not send a mouseUp when user releases mouse button outside browser window, 
			// so when mouse returns back over map, dragState is still 1... that should be fixed
			
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
	
		$(document).mouseup( onMouseUp );	
		theMap.mousedown( function(ev) { 
			if ( ev.which == 1 ) 
			{
				if( ev.shiftKey )
				{
					var relmap = getEventRelativeCoordinates( ev.originalEvent );
					relmap[0] -= dragDistanceScreen[0];
					relmap[1] -= dragDistanceScreen[1];						
					trans.direct_m( relmap );
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
		});
		// флаг поднимается тут внутри, ибо элемент может получить форус и через табуляцию тоже. Проверять флаг лучше, чем проверять ДОМ.
		focusHolder.focus( function() { hasFocus = true; } )
		// обработчик евентов над картой должен остановить евент (сюда он не придет и не отменит фокус)
		$(document).mousedown( function( ev ) { if( hasFocus ) focusHolder.blur(); } );

		// С нажатиями клавиш все тоже весело: 
		// Гугл начинает в ответ на нажатия кнопок листать карту только если по ней был клик до этого, 
		// после TAB он считает, что фокус уже не обязательно на карте и не скроллит ее.
		// Яндекс нашел хитрее способ. После клика по карте он тоже считает, что у нее есть фокус, а относительно табуляции
		// у них есть специальный элемент <button> (находится под картой), при выборе которого как бы карта получает фокус.
		
		// Делаем тогда такое: фокус получаем при mousedown, теряем при табуляции или mousedown за пределами карты.
		$(document).keydown( onKeyDown );
		$(document).keyup( onKeyUp );
		
		// Да, в этом проекте мы пошли еще дальше - сделав скролл карты клавишами. Для этого вместо button использовано текстовое поле, потому как кнопка не реагирует на стрелки

		$(window).resize( onResize );
		
		// wheel
	  if(window.addEventListener) theMap[0].addEventListener('DOMMouseScroll', onWheelMove, false);
		theMap[0].onmousewheel = onWheelMove;
		
		if (typeof document.onselectstart!="undefined") //IE tends to select everythin'
		{
			document.onselectstart=function(){return false;}		
			$('img').each( function() { this.unselectable = 'on'; this.onselectstart = qf; } ); 
		}
		
		frontBuffer.setInitialScale( settings.initialScale );
		zoomSlider.updateView( settings.initialScale );

		trans.setScale( settings.zoom[settings.initialScale].mpp );			
		trans.moveBy( [ settings.x0, settings.y0 ] );
		onResize();		
		updateRadii();
	}
	
	function scrollImpl( dx, dy )
	{
		// test and fix scroll if needed.
		// а чинить скролл нужно если где-то уткнулись в границу
		dragDistanceScreen[0] = layersHolder[0].offsetLeft + dx		
		dragDistanceScreen[1] = layersHolder[0].offsetTop + dy
		
		// как же об этом узнать? 
		var l = [ 0 - dragDistanceScreen[0], 0 - dragDistanceScreen[1] ];
		var r = [ viewportSize[0] - dragDistanceScreen[0], viewportSize[1] - dragDistanceScreen[1]  ];
		// можно сравнить мировые координаты углов экрана и границы
		trans.direct_m(l);
		trans.direct_m(r);
		
		// Отклонения от границы по всем направлениям:
		var d = [0, 0, 0, 0]; // порядок d: left top right bottom, порядок лимитов как в CSS
		d[0] = settings.map_limits[3] - l[0];		
		d[1] = settings.map_limits[0] - l[1];
		d[2] = settings.map_limits[1] - r[0];
		d[3] = settings.map_limits[2] - r[1];

		// вектор, на который надо скорректировать скролл:
		var dw = [0,0];
		if (d[0] > 0 && d[2] < 0 ) dw[0] = (d[2] + d[0]) / 2;
		else if( d[0] > 0 ) dw[0] = d[2] > d[0] ? d[0] : (d[2] + d[0]) / 2;
		else if( d[2] < 0 )	dw[0] = d[2] > d[0] ? d[2] : (d[2] + d[0]) / 2;
			
		if (d[1] > 0 && d[3] < 0 ) dw[1] = (d[3] + d[1]) / 2;
		else if( d[1] > 0 )	dw[1] = d[1] < d[3] ? d[1] : (d[3] + d[1]) / 2;
		else if( d[3] < 0 )	dw[1] = d[1] < d[3] ? d[3] : (d[3] + d[1]) / 2;

//		console.log ( dragDistanceScreen, "/// * /// ", d, "::", dw );
		
		var oo = [0,0]
		trans.inverse_m( oo );
		trans.inverse_m( dw );
		dw[0] -= oo[0];
		dw[1] -= oo[1];

//		console.log ( dw );
		
//  Здесь применяется коррекция на границы		
//		dragDistanceScreen[0] -= dw[0];
//		dragDistanceScreen[1] -= dw[1];		

		layersHolder.css( 'left', dragDistanceScreen[0] );
		layersHolder.css( 'top', dragDistanceScreen[1] );


	}
	function scrollBy( dx, dy )
	{
		scrollImpl( dx, dy );
		frontBuffer.onScroll();		
	}
	
	function updateRadii() 
	{
		// получили координаты в пикселах, отн layersHolder
		var u = trans.inverse(settings.user_location);
		radii[0].className = ( "radii scale" + getScale() );
		// рассчитываю, что сразу после установки класса подтянется размер
		var w = radii.width();
		var h = radii.height();
		radii.css('left', u[0] - w/2).css('top',u[1] - h/2);
	}
	
	this.toggleRadius = function()
	{
		layers["radius"].toggle();
	}
	
	
	function onKeyDown( ev ) 
	{
		if ( !hasFocus ) 
			return;
		var SCROLL_RATE = 50;	// px per one trigger
		var code = ev.which;
		//dump( code );
		
		switch( code ) 
		{
			case 9: // TAB
				hasFocus = false;
				return;
			case 107: case 187: // plus on keypad and in numbers' line
				onZoom( -1 );
				break;
			case 109: case 189: // minus on keypad and in numbers' line
				onZoom( +1 ); 
				break;
			case 37: // left
				scrollBy( +SCROLL_RATE, 0 );
				break;
			case 38: // up
				scrollBy( 0, +SCROLL_RATE );
				break;
			case 39: // right
				scrollBy( -SCROLL_RATE, 0 );
				break;
			case 40: // down
				scrollBy( -0, -SCROLL_RATE );
				break;
			default: // если не знакомая кнопка, не надо ее отменять
				return true;
		}
		
		// если над картой, то скролл страницы не делается
		if ( ev.preventDefault ) 
			ev.preventDefault();		
		return false;
		
	}
	function onKeyUp( ev ) 
	{
		if ( !hasFocus ) 
			return;
		
	//	dump( "-" + ev.which );
	}
	
	
	function onMouseUp( ev )
	{
		if ( dragState == 2 ) 
		{	// Юзер отпустил ползунок зума, а значит такой зум надо установить 
			zoomSlider.onSliderRelease( ev.clientY );			
		}
		
		dragState = 0;		
	}
		
	function UpdateStats()
	{
		$('#dragClient').text( dragDistanceScreen.toString() );
	}
	
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
	
	// всякие компоненты могут узнавать масштаб, а про то, что масштаб хранится в фронтбуффере, им знать вобще не надо.
	function getScale() { 
		return frontBuffer.getScale();
	}
	
	function onZoom( delta, ptZoom /* экранные координаты точки зума отн. theMap */ )
	{
		// сначала проверяем, есть ли тут зум вобще.	
		var old_scale = getScale();
		var new_scale = old_scale + delta;
		if ( new_scale < 0 ) new_scale = 0;
		if ( new_scale >= settings.zoom.length ) new_scale = settings.zoom.length - 1;
		var realDelta = new_scale - old_scale;
		if ( realDelta == 0 ) return;

		// точка вокруг которой зум, по умолчанию - это центр экрана (это когда юзер нажимал +/- или тянул слайдер)
		if ( arguments.length < 2 ) ptZoom = [ Math.round(viewportSize[0]/2), Math.round(viewportSize[1]/2) ];
		
		// получаем мировые координаты точки, вокруг которой и будет весь зум происходить.
		var w = [ ptZoom[0] - dragDistanceScreen[0] , ptZoom[1] - dragDistanceScreen[1] ];
//		console.log(ptZoom, "scr=", dragDistanceScreen, "d=" ,w)
		trans.direct_m( w );
		// теперь надо придумать такое новое смещение на трансформации, 
		// чтобы при новом скейле точка w осталась в прежних экранных координатах.
		// положение layersHolder'а (его смещение относительно theMap) тоже менять не будем
		
		// для этого узнаем расстояние от layerHolder'а до точки зума в мировых координатах
		var oo = [0,0];
		trans.direct_m( oo );		
		w[0] -= oo[0]; w[1] -= oo[1];
		// Умножаем этот вектор на отношение масштабов
		var mul = 1 - settings.zoom[new_scale].mpp / settings.zoom[old_scale].mpp;
		w[0] *= mul;
		w[1] *= mul;
		
		// zoom around mousePos should be
		trans.setScale( settings.zoom[new_scale].mpp );		
		trans.moveBy( w );
	
		
		// clear & set backbuffer
		backBuffer.clear();
		backBuffer.setScale( new_scale );
		
		// switchBuffers
		var _3 = frontBuffer;
		frontBuffer = backBuffer;
		backBuffer = _3;
		
		// adjust thier styles too 
		frontBuffer.show();
		scrollImpl(0,0);	// to fix boundaries
		backBuffer.hide();		
	
		zoomSlider.updateView( new_scale );
		updateRadii();
		redrawMarks();
		//backBuffer.animateZoom( realDelta );	
	}
	
	this.addMark = function( id, cx, cy, type, description ) 
	{
		if ( type == "radii" )
		{
			settings.user_location[0] = cx;
			settings.user_location[1] = cy;			
			updateRadii();		
			return;
		}
			
		// 1. add to objects map model
		// 2. calc on-screen coordinates
		// 3. add to DOM, give ref to #1.
		var elmt = $("<div class=\"simplemark " + type + "\">").appendTo( layers['objects'] );
		var w = [ cx, cy ];
		trans.inverse_m( w );
		elmt.css( 'left', w[0] - 16).css( 'top', w[1]-16 ); 
		elmt.click( onMarkClicked ); 			
		elmt.attr('mapobj', id );
		mapObjects[id] = [elmt, cx, cy, description ];
	}
	
	function redrawMarks() 
	{
		var elmt = null, w = [0,0];
		for( var i in mapObjects )
		{
			elmt = mapObjects[i][0];
			w[0] = mapObjects[i][1];
			w[1] = mapObjects[i][2];		
			// понять, где теперь этот значок будет стоять
			trans.inverse_m( w );
			elmt.css( 'left', w[0] - settings.mark_width/2 ).css( 'top', w[1]-16 )
		}
	}
	
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
	
	function gcMarks()
	{
		// Эту функцию надо будет звать после зума или далекого скролла... 
		// чтобы всякие элементы, которые далеко от просмтатриваемой области удалять из памяти
		
		// Для каждой отметки: если она далеко, удалить ее нафиг.
	}
	
	this.hideMarks = function() 
	{
		layers['objects'].hide();
	}
	this.showMarks = function() 
	{
		layers['objects'].show();
	}


	function onResize( /* event */ ) // the function gets a parameter but who cares...
	{
		var myWidth = 0, myHeight = 0;
		var newSize = [];
		getViewportSize( newSize, settings.scrollbarWidth );
		
		
		// here: dimensions can be set manually in callback OR can be set by parent elements - this cases should be distinguished
		// the 1st one is implemented, in the second one we must learn new size by measuring theMap and NOT set its size
		if( settings.callback.resize )
			settings.callback.resize( newSize );

		var delta = [ newSize[0] - viewportSize[0], newSize[1] - viewportSize[1] ];
		viewportSize = newSize;
		scrollImpl( delta[0]/2, delta[1]/2 );
		theMap.css( "height", viewportSize[1] ).css( "width", viewportSize[0] ) ;
		frontBuffer.onResize();
	}
	
	function scrollbarWidth() 
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
	}
		
	constructor();
}

function getViewportSize( size, w/*idth of the scrollbar */ )
{
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
}



var someMath = function( lettersCount, letterZero ) 
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
			if ( arguments.length < 2 ) 
				min_digits = 1;
			var res = "", mod, div;
			while ( num > 0 || min_digits > 0 )
			{
				mod = num % lettersCount;
				div = Math.floor( num /  lettersCount );
				res = String.fromCharCode( letterZero + mod) + res;
				num = div;
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
}

var letterMath = new someMath( 26, 65 )
var numberMath = new someMath( 10, 48 );