/* Copyright (c) 2008-2009 Maxim Makhotkin (maxim.makhotkin@gmail.com) 
 * 
 * Lutik LLC owns a non-exclusive license to use this code as part of its products
 * 
 */
	
;function CMap( $, settings )
{
	var t = this;
	var map_url = window.location.hostname;
	map_url = map_url.substring( map_url.indexOf('maptype') ); 
	
	var settings = $.extend({
		// 80.000 и мельче
		zoom: [ { mpp:0.661458333333, x0: 382346, y0: 6213256, file: map_url+"/2_5k/2_5k_", l:"AW", i:"018" }, // 2500 
				{ mpp:1.322916666666, x0: 382088, y0: 6213233, file: map_url+"/05k/5k_", l:"AC", i:"006" }, //  5k
				{ mpp:2.645833333333, x0: 381760, y0: 6213414, file: map_url+"/10k/10k_", l:"AL", i:"011" }, // 10k
				{ mpp:5.291666666666, x0: 381942, y0: 6214159, file: map_url+"/20k/20k_", l:"AM", i:"06" }, // 20k
				{ mpp:10.58333333333, x0: 380918, y0: 6213605, file: map_url+"/40k/40K_", l:"AO", i:"03" }, // 40k
				{ mpp:21.16666666666, x0: 380085, y0: 6217339, file: map_url+"/80k/80k_", l:"G", i:"02" },  // 80k
				{ mpp:42.33333333333, x0: 374176, y0: 6218821, file: map_url+"/160k/160k_", l:"A", i:"04" }  // 160k
				],			// all scales we have here	- meters per pixel
		tile_size: 240, 	// tile dimensions (in pixels) - think twice before changing this
		map_limits: [ 385194.619, 6212440.391, 436127.012, 6156613.196],	// viewable area bounds: left, top, right, bottom
		
		applyTo : $('div.map:first'),			// temporary here = should become parameter passed via $(element).myMap(...) call
		container: "#map-cover", // though should check for it
		// положение "себя" на карте - чтобы рисовать радиусы доступности
		user_location : [ 0, 0 ],
		defaultPt: [414711, 6182793, 1],
		
		scrollRate: 50,		// px per tick
		dragTolerance: 25,
		cookieName: "savedPos",
		
		viewUpdateDelay: 3,
		marks: {},
		listener: {}	// user might have omitted this, but let's create to avoid checks for its presence.

	}, settings);
	settings.listener = $.extend({ /* Add default listeners here */ } , settings.listener );

	// Map general state 
	var isDraggingMap = false;
	var isDraggingZoom = false;
	var isZooming = false;
	var isCTF = false;
	
	// Last mouse position (rel map corner)
	var lastXY = [0,0]; 			// latest mouse pos rel to theMap tag;
	var wasInsideMap = false;

	// Matrix world -> screen and vice versa
	var transform = new utils.Matrix();	// this matrix used to translate pixel coordinates relative to theMap into world ones and vice versa.	

	// The main element
	var theMap = $(settings.applyTo);
	var theContainer = $(settings.container);
	var mapOffset;						// положение карты относительно угла страницы
	var szViewport = [0,0]; 			// актуальный размер области с картой

	var stencil = null;
	
	// Layers holder
	var movableLayers = [];
	var layersHolderOffset = [0,0];		// layerHolder CSS left & top
	var lastDragStart = [0,0];			// will store delta for drag here
	var lastDrag = [0,0];				// Последний драг
	var isViewInSync = true;			// lho change mathces the one reported to marks
	var timeViewStill = 0;				// lho unchanged for {value} ticks

	// Geo layer
	var geoLayer = null;
	var frontBuffer = null
	var backBuffer = null;
	
	// Zoom slider & variables to provide smooth zoom
	var zoomSlider = null;
	// для анимации зума
	var subScaleValue = 1;			// текущий подмасштаб мозайки
	var subScaleDest = 1;			// целевой подмасштаб мозайки
	var subScaleStep;				// величина шага в подмасштабах
	var subScaleTick = 0;			// таймер для анимации
	var subScaleSkipTicks = 0;		// как часто менять шаг подмасштаба
	var subScaleZooming = null;
	var plannedScale = -1;

	// focus to hold for arrows map scrolling
	var focusFolder = null;
	var hasFocus = false;			// div'ы не должны иметь фокуса, но у нас тут особая уличная магия

	// Capture The Flag
	var flagHolder = null;
	var fnAfterCTF = null;
	var notifyChangeView = null;

	this.marks = null;		// CMapMarks
	var eventSource = [];
	var eventPrev = [];

	// should not create more than one map per page
	///////////////////////////////////////////////////////////////////////////////
	function ctor() {
		createHtmlElements();

		frontBuffer = new CTileSet( frontBuffer, settings.tile_size, settings.zoom ); 
		backBuffer = new CTileSet( backBuffer, settings.tile_size, settings.zoom ); 

		zoomSlider = new CZoomSlider( $("#map-zoom") );
		scrollArrows = new CScrollArrows( $("#map-arrows") ); // scroll arrows
		this.marks = new CMapMarks( $, _mt.getSettingsFor("marks"), this, transform );
		// флаг поднимается тут внутри, ибо элемент может получить форус и через табуляцию тоже. Проверять флаг лучше, чем проверять ДОМ.
		focusHolder.focus( function() { hasFocus = true; } )
		focusHolder.blur( function() { hasFocus = false; } )
		// обработчик евентов над картой должен остановить евент (сюда он не придет и не отменит фокус)
		
		$(document).mouseup( onMouseUp );
		$(document).keydown( onKeyDown );
		
		// wheee-e-e-el
		if(window.addEventListener) 
			theMap[0].addEventListener('DOMMouseScroll', onMouseWheel, false);
		theMap[0].onmousewheel = onMouseWheel;
		theMap[0].ondblclick = onDblClick;
		theMap[0].onmousedown = onMouseDown;
		theMap[0].onclick = onClick;

		readInitialViewpoint();

		plannedScale = settings.initialScale;
		frontBuffer.setScale( plannedScale );
		transform.setScale( settings.zoom[plannedScale].mpp );			
		transform.moveTo( settings.x0, settings.y0 );
		this.marks.placeMarks( plannedScale );

		backBuffer.css( "z-index", -1 );
		frontBuffer.css( "z-index", 0 );
		
		var mySize = utils.getWindowClientAreaSize();
		this.onResize(mySize[0], mySize[1]);		

		// Здесь часто заменяется масштаб - грузится второй набор тайлов
		//t.adjustViewForEvents();
		//console.log( frontBuffer );
		zoomSlider.updateView();
		this.marks.syncToView( plannedScale, getVisibleArea(), szViewport[0]*szViewport[1] );
		isViewInSync = true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function readInitialViewpoint()
	{
		if ( 1 || !cookieExists() )
		{
			var scale = 5;
			if ( screen.height < 801 ) scale = 6;
			if ( screen.height > 1079 ) scale = 4;
			$.extend(settings, { x0: 413383, y0: 6182003, initialScale: scale } );
		}
		else 
		{	
			var xy = readCookie();
			if ( !settings.x0 ) settings.x0 = isNaN(xy[0]) ? settings.defaultPt[0] : xy[0];
			if ( !settings.y0 ) settings.y0 = isNaN(xy[1]) ? settings.defaultPt[1] : xy[1];
			if ( typeof settings.initialScale == "undefined" || settings.initialScale == -1) settings.initialScale = xy[2] == undefined ? settings.defaultPt[2] : xy[2];
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function createHtmlElements()
	{
		// layers
		stencil = $("<div class=\"stencil\">").appendTo( theMap );
		focusHolder = $("<input class=\"focusEater\"/>").appendTo( theMap );
		geoLayer = $("<div class=\"geo layers\">").appendTo( stencil );
		frontBuffer = $("<div class=\"1st tileset\">").appendTo( geoLayer );
		backBuffer = $("<div class=\"2nd tileset\">").appendTo( geoLayer );
		t.pushMovable( geoLayer[0] );

		// other stuff
		flagHolder = $("<div class=\"flag\">").appendTo( theMap );
		$("#map-zoom").appendTo( theMap ); // 1st capital letter for classname 
		$("#map-arrows").appendTo( theMap ); // scroll arrows

		$("#map-extra-contents > *").appendTo( theMap );
		$("#map-extra-contents").remove();
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.pushMovable = function( what )
	{
		if ( stencil[0] !== what.parentNode )
			stencil.append( what );
		movableLayers.push( what );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.pushStatic = function( what )
	{
		if ( stencil[0] !== what.parentNode )
			stencil.append( what );
	}	
	// 1. controllers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function onClick( ev )
	{
		var clickedOn = {};
		getEventSource( ev || window.event, clickedOn );

		if ( clickedOn[0] > 1 )
			t.marks.onClick( clickedOn );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function onMouseDown( ev ) 
	{
		ev = ev || window.event;
		var button = ev.which || ev.button;
		if ( button == 1 )
		{
			isDraggingMap = true;
			theMap.addClass('dragging').removeClass('drag');
			lastDragStart[0] = ev.clientX;
			lastDragStart[1] = ev.clientY;
			lastDrag[0] = 0;
			lastDrag[1] = 0;
			if ( ev.shiftKey && console )
			{
				var relXY = getEventRelativeCoordinates( ev );
				relXY[0] -= layersHolderOffset[0];
				relXY[1] -= layersHolderOffset[1];
				relXY = transform.toWorld_m( relXY );
			}
		}
		// setFocus() function maybe?
		var target = ev.target || ev.srcElement;
		if ( target ) 
			switch ( target.tagName )
			{
				case "SELECT":
				case "OPTION":
				case "INPUT":
					return;
			}
		
		if( !hasFocus ) focusHolder.focus();
		sp(ev);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseUp( ev )
	{
		var lastMove = lastDrag[0]*lastDrag[0] + lastDrag[1]*lastDrag[1];
		ev = ev.originalEvent;
		var button = ev.which || ev.button;
		if ( isDraggingMap && button == 1 ) 
		{
			isDraggingMap = false;
			theMap.removeClass('dragging').addClass('drag');
		}
		
		if ( isDraggingZoom ) 
		{	// Юзер отпустил ползунок зума, а значит такой зум надо установить 
			zoomSlider.onSliderRelease( ev.pageY || ev.clientY + document.documentElement.scrollTop ); 
			isDraggingZoom = false;
		}
		if ( isCTF ) // Юзер отпустил мышку, собираясь поставить отметку.
		{
			var relXY = getEventRelativeCoordinates(ev);
			var scrXY = relXY.slice();
			var isInsideMap = relXY[0] >= 0 && relXY[0] < szViewport[0] && relXY[1] >= 0 && relXY[1] < szViewport[1] - 30;
			
			if ( lastMove < settings.dragTolerance )
				if ( isInsideMap )
				{
					relXY[0] -= layersHolderOffset[0];
					relXY[1] -= layersHolderOffset[1];
					relXY = transform.toWorld_m( relXY );
					fnAfterCTF && fnAfterCTF( relXY, scrXY );
					tellListener( "capture", relXY, scrXY );		// Если событие было над картой, то вернуть в listener координаты. 
					fnAfterCTF = null;
					
					isCTF = false;	
					flagHolder.hide();
				}
				else // Если вне карты, сказать что юзер раздумал ставить отметку.
				{
					// Сказать скрипту, что юзер не стал ставить отметку
					tellListener( "captureCancel" );
				}
		}
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.onMiscEvent = function ( code, params )
	{
		t.marks.onMiscEvent( code, params )
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.onMouseMove = function( mouse, target, ev ) { 
		lastXY = getRelativeCoordinates( mouse );

		var isInsideMap = lastXY[0] >= 0 && lastXY[0] < szViewport[0] && lastXY[1] >= 0 && lastXY[1] < szViewport[1];		
		
		if ( isDraggingMap )
		{
			// detect IE by undefined ev.which, detect no-left-button-pressed by ev.button lower bit cleared
			if ( typeof ev.which == "undefined" && 0 == ( ev.button & 1 ) ) 
				onMouseUp( ev );				
			else  // drag map
			{
				var dx = mouse[0] - lastDragStart[0];
				var dy = mouse[1] - lastDragStart[1];				
				lastDragStart[0] = mouse[0];
				lastDragStart[1] = mouse[1];
				scrollBy( dx, dy );
				lastDrag[0] += dx;
				lastDrag[1] += dy;
			}
		}

		if ( isDraggingZoom )
			zoomSlider.onSliderMove( ev.clientY );
		
		if ( isCTF )
			if ( isInsideMap ) 
				flagHolder.show().css( { top:lastXY[1], left:lastXY[0] } );				
			else
				flagHolder.hide();

		if( isInsideMap || wasInsideMap )
		{
			eventPrev = eventSource.slice();
			getEventSource( ev, eventSource );
			t.marks.onMouseMove( eventSource, eventPrev );
		}
		wasInsideMap = isInsideMap;
	};	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getEventSource( ev, result )
	{
		result[0] = 0; // 0 = outside. 1 = tile. 2 = friend. 3 = mark. 4 = object
		result[1] = 0;

		var target = ev.target || ev.srcElement || null;
		if ( !target ) return;
		var targetTag = target.nodeName;
		var targetClass = target.className;

		var parent = target.parentNode;
		var parentClass = parent ? parent.className : "";
		var parentTag = parent ? parent.nodeName : "";
		
		switch ( targetTag )
		{
			case "IMG":
				if( 1 + parentClass.indexOf( 'tileset' ) ) result[0] = 1;
				if ( 1 + parentClass.indexOf( 'friend' ) ) { result[0] = 2; target = parent; }
				break;
			case "A":
				if( targetClass.indexOf( 'friend' ) >= 0 ) result[0] = 2;
				if ( parentClass.indexOf( 'marks' ) >= 0 || targetClass.indexOf( 'mark' ) >= 0 ) result[0] = 4; // 1st on map, 2nd on border
				break;
			case "DIV":
				if ( 1 + targetClass.indexOf( 'flag' ) || 1 + targetClass.indexOf( 'stencil' ) ) result[0] = 1;
				if ( parentClass.indexOf( 'bookmarks' ) >= 0 || targetClass.indexOf( 'bookmark' ) >= 0 ) result[0] = 3; // bookmark on map || on border
				break;
			case "CANVAS": case "oval": case "OL": case "LI":
				result[0] = 1;
				break;
		}
		if ( result[0] > 1 )
			result[1] = target.dbId;
//		console.log( "%s.%s > %s.%s ==> ", parentTag, parentClass, targetTag, targetClass, result )	
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onDblClick( event ) 
	{
		event = event || window.event; /* For IE. */
		var target = event.target || event.srcElement;
		var targetClass = target.className || "";
		
		if ( target.tagName == 'IMG' || targetClass.indexOf( 'border-outer' ) >= 0 )
			onZoom( -1, getEventRelativeCoordinates(event) );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onKeyDown( ev ) 
	{
		if ( !hasFocus ) return;
		
		switch( ev.which ) 
		{
			/* tab */ case 9: hasFocus = false; return;
			/* + */ case 107: case 187: onZoom( -1 ); break;
			/* - */ case 109: case 189: onZoom( +1 ); break;
			/*  ← */ case 37: scrollBy( +settings.scrollRate, 0, true ); break;
			/*  ↑ */ case 38: scrollBy( 0, +settings.scrollRate, true );	break;
			/*  → */ case 39: scrollBy( -settings.scrollRate, 0, true ); 	break;
			/*  ↓ */ case 40: scrollBy( -0, -settings.scrollRate, true ); break;
			default: // если не знакомая кнопка, не надо ее отменять
				return true;
		}
		
		// если над картой, то скролл страницы не делается
		return pdf(ev);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseWheel( ev ) 
	{
		ev = ev || window.event;
		// wheel distance
		var delta = 0;
		if (ev.wheelDelta) { /* IE & opera */ delta = -ev.wheelDelta / 120; }
		else if (ev.detail) { delta = ev.detail / 3; }

		var target = ev.srcElement || ev.target;		
		var relXY = getEventRelativeCoordinates( ev );
		if ( relXY[0] < 0 || relXY[1] < 0 || relXY[0] > szViewport[0] || relXY[1] > szViewport[1] )
			return;
																																															
		// need event's coordinates: pixels relative to theMap element
		onZoom( delta, relXY );
		
		// если над картой, то скролл страницы не делается
		return pdf(ev);
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.onUnload = function( )
	{
		setCookie();

	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.showArea = function( area, minScale ) // choose best scale and show that area
	{
		var targetMPP = Math.max( Math.abs( area.maxX - area.minX ) / szViewport[0], Math.abs( area.maxY - area.minY ) / (szViewport[1]-50) );
		var chosenScale = 0;
		for( ; chosenScale < settings.zoom.length && settings.zoom[chosenScale].mpp < targetMPP; chosenScale++ );
		if ( minScale ) chosenScale = Math.max( minScale, chosenScale );
		t.scrollTo( (area.maxX + area.minX) / 2, (area.maxY + area.minY) / 2, chosenScale );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.onTick = function()
	{
		if ( isZooming )
		{	
			if ( 0 == subScaleTick % ( subScaleSkipTicks + 1 ) ) // действия предпринимать
			{
				frontBuffer.setScaleMul( subScaleValue );
				frontBuffer.onScroll(layersHolderOffset, subScaleZooming );
				subScaleValue *= subScaleStep;
			}
			if ( ( subScaleValue >= subScaleDest || subScaleStep <= 1 ) && ( subScaleValue <= subScaleDest || subScaleStep >= 1 ) )
			{
				onZoomAnimationComplete();
				return;
			}
			subScaleTick++;
		}
		
		if ( !isViewInSync ) 
			if( timeViewStill > settings.viewUpdateDelay )
			{
				t.marks.syncToView( t.getScale(), getVisibleArea(), szViewport[0]*szViewport[1] );
				frontBuffer.onScroll(layersHolderOffset);
				isViewInSync = true;
			}
			else
				timeViewStill++;
		
		t.marks.onTick();		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.onResize = function( w, h )
	{
		return onResizeImpl( w, h );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function onResizeImpl( w, h ) // the function gets a parameter but who cares...
	{
		var newSize = [ w, h ];
		// Коллбэку мы какбэ говорим "смотри, какие теперь размеры у окна. Если ты их меняешь, то я себе возьму такой размер"
		// Коллбэк какбэ отвечает нам: "стань таким и таким по размерам" либо "оставайся как есть", когда он не меняет параметры
		
		newSize[0] = theContainer.width();
		newSize[1] = theContainer.height();
		// Будем рассчитывать, что положение карты на странице не меняется в других случаях.
		mapOffset = theMap.offset();
			
		if ( newSize[0] == w )	// не меняли?
			newSize[0] = theMap.width();			
		else
			theMap.css( "width", newSize[0] ) ;

		if ( newSize[1] == h  ) // не меняли?
			newSize[1] = theMap.height();
		else
			theMap.css( "height", newSize[1] );
		
		var delta = [ newSize[0] - szViewport[0], newSize[1] - szViewport[1] ];
		szViewport = newSize;
		scrollByImpl( delta[0]/2, delta[1]/2 );
		frontBuffer.onResize( szViewport, layersHolderOffset, transform );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 2. Внешний программный интерфейс 
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.captureMark = function() 
	{
		isCTF = true;
		fnAfterCTF = typeof arguments[0] == "function" ? arguments[0] : null;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.captureMarkCancel = function() 
	{
		isCTF = false;
		flagHolder.hide();		
		fnAfterCTF = null;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.getMapPosition = function() 
	{
		var ptCenter = [szViewport[0]/2 - layersHolderOffset[0] , szViewport[1]/2 - layersHolderOffset[1]];
		return transform.toWorld_m( ptCenter );
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.scrollTo = function( x, y, scale )
	{
		var needRescale = arguments.length > 2 && scale != plannedScale;
		var scrollingFar = true || isFarFromHere( x, y );
		
		if ( !needRescale && !scrollingFar ) 
		{	
			// animate scroll
		}
		else
		{
			if ( needRescale )
			{
				scale = utils.clamp( scale, 0, settings.zoom.length - 1 );
				transform.setScale( settings.zoom[scale].mpp );	
				switchBuffers(); // to prevent 2nd layer loading
				prepareBufferForScale( scale );	
				switchBuffers();
			}
			transform.moveTo( x, y );
			layersHolderOffset[0] = szViewport[0] / 2 ;
			layersHolderOffset[1] = szViewport[1] / 2 ;		
			frontBuffer.setupTileLayout( layersHolderOffset, transform );	
			applyMapBoundaries( layersHolderOffset );
			applyScroll( layersHolderOffset );
			frontBuffer.onScroll( layersHolderOffset );
			
			t.marks.redraw( scale );
			zoomSlider.updateView();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.addListener = function( cbName, fnToCall )
	{
		if ( typeof( settings.listener[cbName] ) == "function" )
			settings.listener[cbName] = [ settings.listener[cbName], fnToCall ];
		else if ( typeof( settings.listener[cbName] ) == "object" && settings.listener[cbName].length )
		{ // будем надеяться что это именно массив
			settings.listener[cbName].push( fnToCall );
		}
		else 
			settings.listener[eventType] = [ fnToCall ];
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 3. Все что используется внутри
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function tellListener( cbName )
	{
			var args = [];
			for( var i = 1; i < arguments.length; i++ )
				args.push( arguments[i] );
				
			if ( typeof( settings.listener[cbName] ) == "function" )
				settings.listener[cbName].apply( theMap, args );	
			else if ( typeof( settings.listener[cbName] ) == "object" && settings.listener[cbName].length ) 
			{ // через length проверяем что это именно массив
				for ( var i = 0; i < settings.listener[cbName].length; i++ )
					settings.listener[cbName][i].apply( theMap, args );					
			}
			else 
				return false;
			return true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function scrollBy( dx, dy )
	{
		notifyChangeView && notifyChangeView(); 
		notifyChangeView = null;
		
		scrollByImpl( dx, dy );
		viewportStillFor = 0;
		viewportExpired = true;
	}	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getVisibleArea()
	{
		var l = transform.toWorld( [ -layersHolderOffset[0], -layersHolderOffset[1] ] );
		var r = transform.toWorld( [ szViewport[0] - layersHolderOffset[0] , szViewport[1] - layersHolderOffset[1] ] );
		
		l[0] = Math.round(l[0]);
		l[1] = Math.round(l[1]);
		r[0] = Math.round(r[0]);
		r[1] = Math.round(r[1]);

		if ( l[0] < r[0] && l[1] < r[1] ) return [ l[0], l[1], r[0], r[1] ]; 
		if ( l[0] < r[0] && l[1] > r[1] ) return [ l[0], r[1], r[0], l[1] ]; 
		if ( l[0] > r[0] && l[1] < r[1] ) return [ r[0], l[1], l[0], r[1] ]; 
		if ( l[0] > r[0] && l[1] > r[1] ) return [ r[0], r[1], l[0], l[1] ]; 
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function isFarFromHere( x, y )
	{
		var here = transform.toWorld_m( [ szViewport[0]/2 - layersHolderOffset[0], szViewport[1]/2 - layersHolderOffset[1] ] );
		var dist = Math.sqrt((x-here[0])*(x-here[0]) + (y-here[1])*(y-here[1]));
		return dist / settings.zoom[getScale()].mpp > Math.max(szViewport[0],szViewport[1]);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function scrollByImpl( dx, dy )
	{
		layersHolderOffset[0] += dx;
		layersHolderOffset[1] += dy;
		applyMapBoundaries( layersHolderOffset );
		applyScroll( layersHolderOffset );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function applyMapBoundaries( layersHolderOffset )
	{
		// можно сравнить мировые координаты углов экрана и границы
		var l = transform.toWorld_m( [ 0 - layersHolderOffset[0], 0 - layersHolderOffset[1] ]);
		var r = transform.toWorld_m( [ szViewport[0] - layersHolderOffset[0], szViewport[1] - layersHolderOffset[1] ] );
		
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
		else if( d[2] < 0 ) dw[0] = d[2] > d[0] ? d[2] : (d[2] + d[0]) / 2;

		if (d[1] > 0 && d[3] < 0 ) dw[1] = (d[3] + d[1]) / 2;
		else if( d[1] > 0 ) dw[1] = d[1] < d[3] ? d[1] : (d[3] + d[1]) / 2;
		else if( d[3] < 0 ) dw[1] = d[1] < d[3] ? d[3] : (d[3] + d[1]) / 2;

		var oo = [0,0]
		transform.toScreen_m( oo );
		transform.toScreen_m( dw );

		//  Здесь применяется коррекция на границы		
		layersHolderOffset[0] += Math.round( oo[0] - dw[0] );
		layersHolderOffset[1] += Math.round( oo[1] - dw[1] );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function applyScroll( lho )
	{
		var lhs = movableLayers[0].style;
		var left = parseInt(lhs.left.replace('px',''));
		var top = parseInt(lhs.top.replace('px',''));
		var wasInSync = isViewInSync;
		
		if ( left != lho[0] ) {
			for( var i = 0, ii = movableLayers.length; i < ii; i++ )
				movableLayers[i].style.left = lho[0]+"px";
			isViewInSync = false;
			timeViewStill = 0;
		}
		if ( top != lho[1] ) {
			for( var i = 0, ii = movableLayers.length; i < ii; i++ )
				movableLayers[i].style.top = lho[1]+"px";
			isViewInSync = false;
			timeViewStill = 0;
		}
		if ( wasInSync && !isViewInSync )
			t.marks.onViewDesync();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	// provides event's coordinates: pixels relative to theMap element
	function getEventRelativeCoordinates(event) // use browser native event
	{
		var mousePos = [];
		mousePos[0] = ( typeof event.pageX == "undefined" ? event.clientX + document.documentElement.scrollLeft : event.pageX ) - mapOffset.left;
		mousePos[1] = ( typeof event.pageY == "undefined" ? event.clientY + document.documentElement.scrollTop: event.pageY ) - mapOffset.top;
		// получили вроде пикселы отн. угла страницы (все кроме IE показывают pageX, pageY)
		return mousePos;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.adjustViewForEvents = function()
	{
		var area = t.marks.getEventsArea();
		if ( area.minY * area.maxY ) 
			t.showArea( area, 4 );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getRelativeCoordinates(screenCoords) // use browser native event
	{
		var mousePos = screenCoords.slice();
		mousePos[0] -= mapOffset.left;
		mousePos[1] -= mapOffset.top;		
		return mousePos;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// всякие компоненты могут узнавать масштаб, а про то, что масштаб хранится в фронтбуффере, им знать вобще не надо.
	this.getScale = function() { return frontBuffer.getScale(); }
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.planNotification = function ( fn )
	{	
		notifyChangeView = fn;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onZoom( delta, ptZoom /* экранные координаты точки зума отн. theMap */ )
	{
		// есть ли тут зум
		var new_scale = Math.max( 0, Math.min( plannedScale + delta, settings.zoom.length - 1 ) );
		if ( new_scale - plannedScale == 0 ) return;

		notifyChangeView && notifyChangeView(); 
		notifyChangeView = null;		

		if( !isZooming )	// zoom animation
		{
			isZooming = true; // zooming 
			subScaleTick = 0
			subScaleValue = 1;
			subScaleDest = delta < 0 ? 2 : 0.5;
			
			isViewInSync = false;
			timeViewStill = 0;
			//subScaleStep = delta < 0 ? 1.1892 : 0.8409; 	// these are pow(2,1/4) and pow(2,-1/4) respectively
			//subScaleStep = delta < 0 ? 1.2560 : 0.7937; 	// these are pow(2,1/3) and pow(2,-1/3) respectively
			//subScaleStep = delta < 0 ? 1.410 : 0.75; 	// these are pow(2,1/2) and pow(2,-1/2) respectively
			subScaleStep = delta < 0 ? 1.999 : 0.501; 	// these are pow(2,1) and pow(2,-1) respectively			
			subScaleZooming = arguments.length >= 2 ? ptZoom : [ Math.round(szViewport[0]/2), Math.round(szViewport[1]/2) ];
			t.marks.startZoom();
		}
		prepareTransformationForZoom( transform, plannedScale, new_scale, arguments.length >= 2 ? ptZoom : [ Math.round(szViewport[0]/2), Math.round(szViewport[1]/2) ]);
		plannedScale = new_scale;
		return;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onZoomAnimationComplete()
	{
		isZooming = false;
		subScaleValue = 1;
		prepareBufferForScale( plannedScale );		
		applyMapBoundaries( layersHolderOffset );
		applyScroll( layersHolderOffset );
		isViewInSync = false;
		timeViewStill = 0;

		switchBuffers();
		t.marks.endZoom( plannedScale );
		zoomSlider.updateView();
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function prepareBufferForScale( new_scale ) 
	{
		// clear & set backbuffer
		backBuffer.clear();
		backBuffer.setScale( new_scale );
		backBuffer.onResize( szViewport, layersHolderOffset, transform );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function switchBuffers()
	{
		// switchBuffers
		var _3 = frontBuffer;
		frontBuffer = backBuffer;
		backBuffer = _3;
		
		// adjust thier styles too 
		backBuffer.css( "z-index", -1 );
		frontBuffer.css( "z-index", 0 );	
		
		plannedScale = t.getScale();
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function setCookie() {
		var pt = transform.toWorld_m([szViewport[0]/2 - layersHolderOffset[0] , szViewport[1]/2 - layersHolderOffset[1]]);	
		var cdate = new Date ( 2012, 12, 21 );
		var data = Math.round(pt[0])+","+Math.round(pt[1])+","+t.getScale();
		var toSet = settings.cookieName+"= "+data+"; expires= "+cdate.toGMTString()+"; path=/";
		document.cookie = toSet;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function readCookie() {
		var xy = utils.getCookie(settings.cookieName);
		//alert( document.cookie );
		return eval( '['+xy+']' );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function cookieExists() {
		return ( document.cookie.indexOf(settings.cookieName+"=") != -1 );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function prepareTransformationForZoom( transform, old_scale, new_scale, ptZoom )
	{
		var wZoomCenter = transform.toWorld_m( [ ptZoom[0] - layersHolderOffset[0] , ptZoom[1] - layersHolderOffset[1] ] );
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

	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 4. Дополнительные классы для использования внутри карты
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	// ScrollArrows - стрелочки для движения по карте
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// Ожидаемая модель DOM:
  /*  <div id="map-arrows">
        <input id="map-arrows-up" type="image" src="../picts/up.gif" />
        <input id="map-arrows-left" type="image" src="../picts/left.gif" />
        <input id="map-arrows-down" type="image" src="../picts/down.gif" />
        <input id="map-arrows-right" type="image" src="../picts/right.gif" />                        
      </div>   
	*/

	function CScrollArrows( div ) 
	{
		$("#map-arrows-up").click( function( ev ) { scrollBy( 0, +settings.scrollRate, true ); ev.stopPropagation(); } );
		$("#map-arrows-left").click( function( ev ) { scrollBy( +settings.scrollRate, 0, true ); ev.stopPropagation(); } );
		$("#map-arrows-down").click( function( ev ) { scrollBy( 0, -settings.scrollRate, true ); ev.stopPropagation(); } );
		$("#map-arrows-right").click( function( ev ) { scrollBy( -settings.scrollRate, 0, true ); ev.stopPropagation(); } );			
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
	
	function CZoomSlider( div ) 
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
			jqSlider = $("#map-zoom-slider").mousedown( function ( ev ) { isDraggingZoom = true; } );

			// положения ползунка на разные уровни зума:
			sliderStep = ( jqRails.height() - jqSlider.height() ) / ( MAX_ZOOM - MIN_ZOOM );
			for( var i = MIN_ZOOM; i <= MAX_ZOOM; i++ )	zoomLevels[i] = sliderStep*i;

			// поведение элементов
			div.mousedown( function( ev ) { ev.stopPropagation(); } );
			div.click( function( ev ) { onZoom( getScaleFromClientY(ev.clientY) - plannedScale ) } );
		}		
		
		this.updateView = function()
		{
			var scale = t.getScale();
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
			var delta = newScale - plannedScale;
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
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 5. Запуск конструктора самого класса карты
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	ctor.call(this);
};