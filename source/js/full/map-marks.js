var CMapMarks = function( $, settings, map, transform )
{
	var t = this;
	var settings = $.extend( {
		maxScale: 3, //1,
		maxFullScale: 1,
		maxForceScale: 5, //3,
		maxForceFullScale: 3,
		minScaleRadii: 3,
		api_url: "/map"
	}, settings);

	// хранить отметки на карте сюда
	var mapObjects = {};
	var mapObjectsVisible = true;
	var mapBookmarks = {};
	var mapPeople = {};
	var nBookMarks = 0;
	
	var coordsRadii = [];
	var canvas = null;
	var ctx = null;
	
	var lastHovered = 0;
	var tooltipShown = false;
	var ttShownCode = "";
		
	var autoloadCategory = 0;
	var selectObject = 0;
	
	var layers = {};
	var sideBar = {};
	var isScaleSmallForRadii = false;
	var isRadiiShown = true;
	var idBookmark = 0;
	var maxRad = 1;
	
	var isDrawingMarks = false;
	var isLmbDown = false;

	var eventPlaces = null;
	var lastMapData = [];
	var iBeingPut = 0;
	var scale = 0;
	var outOfSync = true;

	var evPlaceLastHoverd = null;
	var eventMarksArea = [];

	var iconsPerMpx = 120;
	var lastMPix = 0;
	var lastVisibleArea = null;
	var lastViewCenter = null;
	var lastViewAspectAngle = Math.PI / 4;
	var lastViewport = [];
		
	var iconsVelocity = {};
	var iconsOffset = {};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// CTOR and other 1-time calls
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function ctor()
	{
		var borderFrame = $('<div class="border-outer">');
		utils.makeUnselectable.apply(borderFrame[0]);
		sideBar['n'] = $("<div class='bar-n'>").appendTo(borderFrame);
		sideBar['e'] = $("<div class='bar-e'>").appendTo(borderFrame);
		sideBar['w'] = $("<div class='bar-w'>").appendTo(borderFrame);
		sideBar['s'] = $("<div class='bar-s'>").appendTo(borderFrame);
		
		
		layers['border-objects'] = $('<div class="border-inner marks">')//.appendTo(borderFrame);
		layers['border-friends'] = $('<div class="border-inner friends">')//.appendTo(borderFrame);
		layers['border-bookmarks'] = $('<div class="border-inner bookmarks">')//.appendTo(borderFrame);

		map.pushStatic( borderFrame );
		
		var layersHolder = $("<div class=\"layers\">");
		layers['radius'] = $("#radii").appendTo(layersHolder);
		layers['marks_images'] = $("<div class=\"marks-image layer\">").appendTo(layersHolder);
		layers['marks'] = $("<div class=\"marks layer\">").appendTo(layersHolder);
		layers['friends'] = $("<div class=\"friends layer\">").appendTo(layersHolder);
		layers['bookmarks'] = $("<div class=\"bookmarks layer\">").appendTo(layersHolder);
		map.pushMovable( layersHolder[0] )
		
		canvas = document.getElementById("radius-canvas");
		if ( canvas && canvas.getContext )
			ctx = canvas.getContext("2d");
		else
		{
			canvas = null;
			$('*', layers['radius']).each( utils.makeUnselectable );
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.placeMarks = function( plannedScale ) {
		scale = plannedScale
		isScaleSmallForRadii = scale > settings.minScaleRadii;
		
		for( var login in settings.friends )
		{
			var fr = settings.friends[login];
			addFriendImpl( login, fr );
		}
		for( var id in settings.bookmarks )
		{
			var bm = settings.bookmarks[id];
			addBookmarkImpl( id, bm.x, bm.y, bm.name, bm.a );
			if( bm.a ) 
				idBookmark =  id;
		}
		if ( idBookmark )
			t.setRadiusAtMark( idBookmark );
		
		settings.eventPlace && t.setEventPlaces( settings.eventPlace );
		settings.selectObject && ( selectObject = settings.selectObject );
		settings.autoloadCategory && ( autoloadCategory = settings.autoloadCategory ) 
		outOfSync = false;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Forwarded events
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.onClick = function( ev )
	{
		if ( ev[0] == 3 )
			onBookmarkClick( ev[1]);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.onTick = function() 
	{
		if( lastHovered > 10 && !tooltipShown && evPlaceLastHoverd ) 
		{
			showTooltipFor( evPlaceLastHoverd );
		}
		animateIcons();
		lastHovered++;
		// Эта штука заберет себе весь такт! =(
		if ( !outOfSync && isDrawingMarks && !isLmbDown )
			keepPuttingItems();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.onMouseMove = function ( eventSource, prevSource, xy ) {
		if ( prevSource[1] != eventSource[1] || eventSource[0] == 1 ) 
		{
			lastHovered = 0;
			if ( prevSource[0] > 1 ) onMouseOut( prevSource )			
			if ( eventSource[0] > 1 ) onMouseOver( eventSource )
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseOut( evSource ) 
	{
		if ( evSource[0] == 4 ) 
		{
			var id = evSource[1];
			var e4o = getEventForObject(id);
			e4o && _mt.throwMiscEvent ( "mapMarkOutEvent", e4o );
			_mt.throwMiscEvent ( "mapMarkOutObject", [ "#object"+id ] );
			if ( id in mapObjects )
				mapObjects[id].g[0].className = deriveClassForObject( id, mapObjects[id].m[3], false );
		}
		hideTooltip();
		evPlaceLastHoverd = null
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function onMouseOver( evSource )
	{
		if ( evSource[0] == 4 ) 
		{
			var id = evSource[1];
			var e4o = getEventForObject(id);
			e4o && _mt.throwMiscEvent ( "mapMarkOverEvent", e4o );
			_mt.throwMiscEvent ( "mapMarkOverObject", [ "#object"+id ] );
			if ( id in mapObjects )
				mapObjects[id].g[0].className = deriveClassForObject( id, mapObjects[id].m[3], true );
		}
		evPlaceLastHoverd = evSource;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function animateIcons()
	{
		// Разгоняющая сила
		for( var i in iconsVelocity )
		{
			if ( i in iconsOffset )
			{
				iconsOffset[i] += iconsVelocity[i]*3;
				iconsVelocity[i] -= 0.5;
				if ( iconsVelocity[i] < 0 )
					delete iconsVelocity[i];
			}
			else
				iconsOffset[i] = 0;
		}
		
		var down_threshold = 0.7;
		// Инерция, тормозящая 
		for( var i in iconsOffset )
		{
			var o = mapObjects[i];
			var bs = o.b[0].style;
			if ( iconsOffset[i] < down_threshold && !( i in iconsVelocity ) )
			{ // движение закончилось
				delete iconsOffset[i];
				switch (o.a)
				{
					case 'c': o.g[0].style.top = o.h[0].style.top; break;
					case 'n': bs.top = '0%'; break;
					case 's': bs.top = '100%'; break;
					case 'e': bs.left = '0%'; break;
					case 'w': bs.left = '100%'; break;
				}
			}
			else 
			{
				if (!( i in iconsVelocity )) iconsOffset[i] -= down_threshold;
				var borderJump = Math.round(iconsOffset[i])/3
				switch (o.a)
				{
					case 'c': o.g[0].style.top = -Math.round(iconsOffset[i])+parseInt(o.h[0].style.top)+"px"; break;
					case 'n': bs.top = borderJump+'%'; break;
					case 's': bs.top = (100-borderJump)+'%'; break;
					case 'e': bs.left = borderJump+'%'; break;
					case 'w': bs.left = (100-borderJump)+'%'; break;
				}
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Logical events
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.startZoom = function()
	{
		layers['bookmarks'].hide();
		layers['friends'].hide();
		layers['marks'].hide();
		layers['marks_images'].hide();
		layers['border-objects'].hide();
		layers['radius'].hide();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.endZoom = function( _scale)
	{
		t.redraw( _scale );
		layers['bookmarks'].show();
		layers['friends'].show();
		if ( mapObjectsVisible )
		{
			layers['marks'].show();
			layers['marks_images'].show();
			layers['border-objects'].show();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.onMiscEvent = function( code, params )
	{
		switch( code )
		{
			case "eventOver": updateMarksHighLite( getObjectsForEvent( params ), 1 ); break;
			case "eventOut": updateMarksHighLite( getObjectsForEvent( params ), 0 ); break;
			case "objectOver": updateMarksHighLite( [ params ], 1 ); break;
			case "objectOut": updateMarksHighLite( [ params ], 0 ); break;
			default: return;
		}
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.onViewDesync = function()
	{
		// stop drawing marks
		outOfSync = true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.setEventPlaces = function( places )
	{
		// remove all previous marks
		flushMarks();
		selectObject = 0;
		autoloadCategory = 0;
		eventPlaces = places;
		var mH = { maxY: 0, minX: 1000000, minY: 10000000, maxX: 0}; // top, right, bottom, left		
		for( var iEvent in eventPlaces)
			for( var id in eventPlaces[iEvent] )
			{
				var ep = places[iEvent][id];
				addMarkImpl( id, ep, false );
				if ( mH.minY > ep[1] ) mH.minY = ep[1];
				if ( mH.maxY < ep[1] ) mH.maxY = ep[1];
				if ( mH.minX > ep[0] ) mH.minX = ep[0];
				if ( mH.maxX < ep[0] ) mH.maxX = ep[0];
			}
		eventMarksArea = mH.maxY ? mH : {}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.selectObject = function( obj_id ) {
		selectObject = obj_id ? obj_id : 0;
		flushMarks( selectObject );
		eventPlaces = null;
		autoloadCategory = 0;
		selectObject && t.syncToView( scale );
		if ( selectObject in mapObjects )
		{
			var el = mapObjects[selectObject].g[0];
			el.className = el.className + ' sel';
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.setAutoloadCategory = function( cat_id )
	{
		if ( cat_id != autoloadCategory )
		{
			autoloadCategory = cat_id;
			eventPlaces = null;
			selectObject = 0;
			t.redraw(scale);
			if ( lastVisibleArea ) t.syncToView( scale, lastVisibleArea, lastMPix )
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.syncToView = function( _scale, visArea, mPixels )
	{
		if (visArea) 
		{
			lastVisibleArea = visArea;
			lastViewCenter = [ (visArea[0] + visArea[2]) / 2 , (visArea[3] + visArea[1]) / 2 ];
			lastViewport = [(visArea[2]- visArea[0])/2, (visArea[3] - visArea[1])/2] 
			lastViewAspectAngle = Math.atan2( lastViewport[0], lastViewport[1] );
		}
		mPixels && ( lastMPix = mPixels );
		scale = _scale;
		
		var toPost = {};
		if ( visArea && visArea.length && autoloadCategory ) 
		{
			var aa = visArea;
			gc( aa );
			toPost = {x1:aa[0],x2:aa[2],y1:aa[1],y2:aa[3]/*,x3:aa[4],x4:aa[6],y3:aa[5],y4:aa[7]*/};
			toPost.limit = Math.round( iconsPerMpx * mPixels / 1000000 );
			toPost.cid = autoloadCategory;
		}
		selectObject && ( toPost.poi = selectObject )
		var willLoad = ( toPost.poi || toPost.cid )
		if ( toPost.poi in mapObjects ) willLoad = false;
		if ( willLoad ) $.post( settings.api_url, toPost , onObjectsRecieved );
		outOfSync = false;
		
		updateMarksPosition();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function updateMarksPositionFor( oo, ai )
	{
		for ( var i in oo )
		{
			var o = oo[i];
			var m = o.m;
			var ws = o.a == 'c';
			var sn = isCoordVisible( m )
			if ( !sn ) // update on-border position
			{
				o.a = getBorderIconDirection( m );
				o.a != 'c' && o.b.appendTo(sideBar[o.a]);
				o.b.css(getBorderPos(m, o.a));
			}
			if ( sn && !ws ) // move to screen
			{
				o.b.hide();
				o.g.show();
				o.h && o.h.show();
				o.a = 'c';
			}
			if ( !sn && ws ) // move to border
			{
				o.b.show();
				o.g.hide();
				o.h && o.h.hide();
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function updateMarksPosition()
	{
		updateMarksPositionFor( mapObjects );
		updateMarksPositionFor( mapBookmarks, idBookmark );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function isCoordVisible( m )
	{
		return	m[0] >= lastVisibleArea[0] && m[0] <= lastVisibleArea[2] && 
				m[1] >= lastVisibleArea[1] && m[1] <= lastVisibleArea[3];
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getBorderIconDirection( m )
	{
		var angle = Math.atan2( m[0] - lastViewCenter[0], m[1] - lastViewCenter[1] );
		return Math.abs(angle) < lastViewAspectAngle ? "n" : Math.abs(angle) > Math.PI - lastViewAspectAngle ? "s" : angle > 0 ? "e" : "w";
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getBorderPos(m, dir)
	{
		var pos = { left: 0, top: 0 };
		var x_rel_center = m[0] - lastViewCenter[0];
		var y_rel_center = m[1] - lastViewCenter[1];
		switch( dir )
		{
			case 'n':
				pos.left = (50 + 50 * x_rel_center/(y_rel_center/lastViewport[1])/lastViewport[0] )+ "%";
				break;
			case 's':
				pos.left = (50 - 50 * x_rel_center/(y_rel_center/lastViewport[1])/lastViewport[0] )+ "%";
				break;
			case 'e':
				pos.top = ( 50 - 50*y_rel_center/(x_rel_center/lastViewport[0])/lastViewport[1] )+"%";
				break;
			case 'w':
				pos.top = ( 50 + 50*y_rel_center/(x_rel_center/lastViewport[0])/lastViewport[1] )+"%"
				break;
		};
		return pos;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function onObjectsRecieved( indata )
	{
		if( indata.length < 15 ) return;
		lastMapData = indata.split('|');
		iBeingPut = 0;
		isDrawingMarks = true;	// start draw-by-portion output
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.redraw = function( new_scale ) 
	{
		// Ordinary marks 
		//var nObjects = 0;
		var elmt = null, el2 = null, w = [0,0];
		function redrawThisObj( ai )
		{
			w[0] = ai.m[0];
			w[1] = ai.m[1];
			transform.toScreen_m( w );
			var pos = { left: Math.round(w[0]), top: Math.round(w[1]) };
			ai.g.css( pos );
			ai.h.css( pos );
		}
		function redrawThisFriend( ai )
		{
			elmt = ai[0];
			w[0] = ai[1][0];
			w[1] = ai[1][1];
			transform.toScreen_m( w );
			var pos = { left: Math.round(w[0]), top: Math.round(w[1]) };
			elmt.css( pos );
		}
		
		function redrawThis( ai )
		{
			elmt = ai.g;
			w[0] = ai.m[0];
			w[1] = ai.m[1];
			transform.toScreen_m( w );
			var pos = { left: Math.round(w[0]), top: Math.round(w[1]) };
			elmt.css( pos );
		}
		
		lastMapData = [];
		if ( settings.disableAutoLoad || eventPlaces )
			for( var i in mapObjects ) redrawThisObj(mapObjects[i]);
		else flushMarks();
		
		// Places & people
		for( var i in mapBookmarks ) redrawThis(mapBookmarks[i]);
		for( var i in mapPeople ) redrawThisFriend(mapPeople[i]);
		
		if ( typeof new_scale != "undefined" )
			scale = new_scale;
		// radii
		isScaleSmallForRadii = scale > settings.minScaleRadii;
		if ( !isScaleSmallForRadii ) 
			updateRadiiPosition();
		else 
			layers['radius'].hide();
		_mt.throwMiscEvent("radiiButton", isScaleSmallForRadii )
		if ( isRadiiShown && !isScaleSmallForRadii && idBookmark ) drawRadius();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// MOB : map objects management
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function addMarkImpl( id, obj, smallIcon )
	{
		if ( id in mapObjects ) return;
		var classname = deriveClassForObject( id, obj[3] );
		// 1. calc on-screen coordinates
		var w = transform.toScreen_m( [ obj[0], obj[1] ] );
		var html_bottom =["<div class=\"",classname,"\" style=\"left:",w[0],"px;top:",w[1],"px\"></div>"].join("");
		var html_top =["<a href=\"/object/",id,"\" class=\"cmd-locRef\" style=\"left:",w[0],"px;top:",w[1],"px\"></a>"].join("");
		// 2. Create an element
		var elmt_bottom = $(html_bottom).appendTo( layers['marks_images'] );
		var elmt_top = $(html_top).appendTo( layers['marks'] );
		elmt_top[0].dbId = id;
		
		var htMark = $('<a class="mark ' + obj[3] +' cmd-locRef" href="/object/'+id+'"></a>');
		htMark[0].dbId = id;

		// 3. add to model
		mapObjects[id] = { h:elmt_top, g:elmt_bottom, b:htMark, m:obj, a:'c' };  /* act for <a> part, g for bg-img, m=model, _a_lign */
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function deriveClassForObject( id, type, forceSel )
	{
		var cl = type
		if ( forceSel ) cl = cl + " hover";
		else if ( id && id == selectObject ) cl = cl + " sel";
		return cl;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function updateMarksHighLite( aObjects, lightUp ) 
	{
		for( i = 0; i < aObjects.length; ++i )
		{
			var idx = aObjects[i];
			if ( !(idx in mapObjects) )
				continue;
			
			var model = mapObjects[idx].m;
			var bg = mapObjects[idx].g;
			
			if ( lightUp )
				if ( !( idx in iconsOffset ) )
					iconsVelocity[idx] = 1;
			else
				delete iconsVelocity[idx];
				
			bg[0].className = deriveClassForObject( i, model[3], lightUp );
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function gc( visArea ) // ptCenter, keepIconsRaduis )
	{
		var ptCenter = [ (visArea[0] + visArea[2]) / 2, (visArea[1] + visArea[3]) / 2 ];
		var keepIconsRaduis = 0.7 * Math.max( Math.abs( visArea[0] - visArea[2] ), Math.abs( visArea[1] - visArea[3] ) ); 
		
		if ( !autoloadCategory ) return;
		
		// Эту функцию надо будет звать после зума или далекого скролла... 
		// чтобы всякие элементы, которые далеко от просмтатриваемой области удалять из памяти
		//var objectsTotal = 0;
		//var objectsDeleted = 0;
		for( var i in mapObjects )
		{
			var obj = mapObjects[i].m;
			var dist = Math.sqrt( (obj[0]-ptCenter[0])*(obj[0]-ptCenter[0]) + (obj[1]-ptCenter[1])*(obj[1]-ptCenter[1]) );
			//objectsTotal++;
			if ( dist > keepIconsRaduis && i != selectObject )
			{
				mapObjects[i].g.remove();
				mapObjects[i].h.remove();
				mapObjects[i].b && mapObjects[i].b.remove();
				delete mapObjects[i];
			}
		}
		// Для каждой отметки: если она далеко, удалить ее нафиг.
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function keepPuttingItems()
	{
		var endAt = lastMapData.length
		var w = [0,0];		
		var iconsShown = 0;

		for( ; iBeingPut < endAt && iconsShown < 8 ; iBeingPut++ )
		{
			var colon = lastMapData[iBeingPut].indexOf(':');
			var id = parseInt( lastMapData[iBeingPut].substring(0,colon) );
			if ( mapObjects[id] ) continue;

			iconsShown++;
			var obj = eval( lastMapData[iBeingPut].substring(colon+1) );

			addMarkImpl( id, obj );
		}

		if ( iBeingPut >= lastMapData.length )
			isDrawingMarks = false;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.toggleMarks = function()
	{
		mapObjectsVisible = !mapObjectsVisible;
		
		layers["marks"].toggle();
		layers['marks_images'].toggle();
		layers['border-objects'].toggle();
		return layers["marks"][0].style.display != 'none';
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function flushMarks( obj_id )
	{
		var saved = []
		for( var i in mapObjects )
		{
			if ( i == obj_id )
			{
				saved = [ mapObjects[i].g, mapObjects[i].h ];
				continue;
			}
			
			mapObjects[i].g = null;
			mapObjects[i].h = null;
			mapObjects[i].b.remove(); // don't know where on which bar it is, have to remove each item personally
			mapObjects[i].b = null;
			delete mapObjects[i];
		}
		layers['marks'][0].innerHTML = '';
		layers['marks_images'][0].innerHTML = ''
		
		if ( saved )
		{
			layers['marks'].append( saved[0] );
			layers['marks_images'].append( saved[1] );
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.getEventsArea = function()
	{
		return eventMarksArea;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getObjectsForEvent( idEvent ) 
	{
		var id = "event"+idEvent;
		var res = [];
		
		if ( eventPlaces && (id in eventPlaces) ) 
			for( var i in eventPlaces[id] ) res.push( i );
		return res;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getEventForObject( idObj )
	{
		var aEv = [];
		if ( eventPlaces )
			for( var iEvent in eventPlaces )
				( idObj in eventPlaces[iEvent] ) && aEv.push( '#' + iEvent );
		return aEv;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// BM: Bookmarks
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function addBookmarkImpl( id, cx, cy, description, active )
	{
		// 1. Create an element.
		var elmt = $("<div>").appendTo( layers['bookmarks'] );
		//elmt.click( onBookmarkClicked ); 			
		elmt[0].dbId = id;
		if	( active )
			elmt[0].className += " active";
		// 2. calc on-screen coordinates
		var w = [ cx, cy ];
		transform.toScreen_m( w );
		elmt.css( 'left', Math.round(w[0]) ).css( 'top', Math.round(w[1]) );
		
		var htMark = $('<div class="bookmark'+(active?' bookmark-active':'')+'">'); // will it work without being appended?
		htMark[0].dbId = id;

		// 3. add to objects map model
		mapBookmarks[id] = { g:elmt, b:htMark, m:[ cx, cy, description ] }; // G for background, M for model
		nBookMarks++;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.bookmarkActivate = function( id )
	{
		for( var i in mapBookmarks )
		{
			mapBookmarks[i].g[i==id?"addClass":"removeClass"]('active');
			mapBookmarks[i].b[i==id?"addClass":"removeClass"]('active');
		}
		idBookmark = id;
		idBookmark && t.setRadiusAtMark( idBookmark );
		this.updateRadii();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.getActiveBookmark = function()
	{
		return idBookmark;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function onBookmarkClick( id ) 
	{
		t.bookmarkActivate( id );
		_mt.mapctrl.onBookmarkClick( id, mapBookmarks[id].m[2], mapBookmarks[id].g.offset(), isCoordVisible( mapBookmarks[id].m ) );
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.removeBookmark = function( id ) 
	{
		if (!( id in mapBookmarks ))
			return;
		mapBookmarks[id].g.hide().remove();
		delete mapBookmarks[id];
		nBookMarks--;
		if ( idBookmark == id )
		{
			idBookmark = 0;
			t.updateRadii();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.addBookmark = function( id, cx, cy, description, active ) 
	{
		addBookmarkImpl.apply( this, arguments );
		t.setRadiusAtMark(id);
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.getBookmarkCount = function()
	{
		return nBookMarks;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.setBookmarkText = function( id, description ) 
	{
		if ( mapBookmarks[id] )
			mapBookmarks[id].m[2] = description;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.getMarkText = function( id ) 
	{
		if ( mapBookmarks[id] )
			return mapBookmarks[id].m[2];
		else 
			return null;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.getBookmarkCoordinates = function( id ) 
	{
		return mapBookmarks[id] ? [ Math.round(mapBookmarks[id].m[0]), Math.round(mapBookmarks[id].m[1]) ] : null;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// FF: Friends
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	function addFriendImpl( name, f )
	{
		//console.log( name, f )
		
		var online = f[2] ? " online" : "";
		var ht = '<a class="ptr_friend'+online+'" href="/profile/'+name+'"><img src="/usr/pic/avatar/'+f[3]+'"/></a>';
		var elmt = $(ht).appendTo( layers['friends'] );
		
		elmt[0].dbId = name;
		
		// 2. calc on-screen coordinates
		var w = [ f[0], f[1] ];
		transform.toScreen_m( w );
		elmt.css( { left: Math.round(w[0]), top: Math.round(w[1]) } );
		// 3. add to objects map model
		mapPeople[name] = [ elmt, f ];
	}			
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	this.toggleFriends = function()
	{
		layers["friends"].toggle();
		return layers["friends"][0].style.display != 'none';
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// -=R=-: Radii
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	this.setRadiusAtMark = function( _idBookmark )
	{
		idBookmark = _idBookmark;
		if ( idBookmark in mapBookmarks )
		{
			var bm = mapBookmarks[idBookmark].m;
			coordsRadii = bm.slice(0,2);
			updateRadiiPosition();
			if ( !isScaleSmallForRadii && isRadiiShown )
				drawRadius();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.isRadiiAllowedByZoom = function()
	{
		return isScaleSmallForRadii;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.toggleRadii = function() 
	{
		if ( isRadiiShown )
			layers['radius'].hide();
		else if ( !isScaleSmallForRadii )
			drawRadius();
		isRadiiShown = !isRadiiShown;
		return isRadiiShown;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.updateRadii = function()
	{
		if ( idBookmark && isRadiiShown && !isScaleSmallForRadii ) 
			drawRadius();
		else
			layers['radius'].hide();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.isRadiiDisabled = function()
	{
		return isScaleSmallForRadii;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function updateRadiiPosition()
	{
		if ( !idBookmark )
			return;
		
		var place = coordsRadii.slice();
		transform.toScreen_m( place );
		var oneHour = 4000;
		var p1 = transform.toScreen_m([oneHour/4,0]);
		var p2 = transform.toScreen_m([0,0]);
		maxRad = p1[0] - p2[0];
		
		layers['radius'][0].style.left = Math.round( place[0] - maxRad )+'px';
		layers['radius'][0].style.top = Math.round( place[1] - maxRad )+'px';
		layers['radius'][0].style.width = Math.round( maxRad*2 )+'px';
		layers['radius'][0].style.height = Math.round( maxRad*2 )+'px';
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function drawRadius()
	{
		var N_CIRCLES = 7;
		var alpha = [8,64,32,16,8,4,2];
		var color = 'rgb( 0, 255, 0 )'
		layers['radius'].show();
		
		var rounds = [5,10,15]
		if ( ctx ) // All great browsers' way
		{
			canvas.width = Math.round( maxRad*2 );
			canvas.height = Math.round( maxRad*2 );
			
			for( var j=0;j<N_CIRCLES;j++ )
			{
				ctx.globalAlpha = alpha[j]/100;
				ctx.strokeStyle = color;
				for (var i=0;i<rounds.length;i++)
				{
					ctx.beginPath();
					ctx.arc(Math.round( maxRad ),Math.round( maxRad ),Math.round(rounds[i]*maxRad/15 - j),0,Math.PI*2,true);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TT: Tooltip
	////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	function hideTooltip()
	{
		// Наш ли еще этот лайтбокс?
		
		if ( _mt.lightbox.getOwner() == ttShownCode )
			_mt.lightbox.hide();
		tooltipShown = false;
	}	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function showTooltipFor( eventSource )
	{
		var id = eventSource[1];
		var text = null
		switch( eventSource[0] )
		{
			case 2: text = mapPeople[id][1][4]; break;
			case 3: text = mapBookmarks[id].m[2]; break;
			case 4: text = mapObjects[id].m[2]; break;
		}
		tooltipShown = true;
		
		if ( !text ) return;
		
		ttShownCode = "mark/"+ eventSource[0] + "/" + id;
		_mt.lightbox.setHtml( text );
		_mt.lightbox.show( ttShownCode );
		tooltipShown = true;
	}		
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// 4. Запуск конструктора самого класса отметок
	////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	ctor();
}