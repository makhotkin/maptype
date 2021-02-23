/* Copyright (c) 2008 Maxim Makhotkin (maxim.makhotkin@gmail.com) 
 * 
 * Lutik LLC owns a non-exclusive license to use this code as part of its products
 *
 * 
 * Elements highlite module 
 *
 */

;function CMainList( $, settings )
{
	var t = this;
	var sss = $.extend({}, settings );	
	var scrollBar = $("#mainListScroll");
	var scroller = $( "i.se-runner", scrollBar )
	var scrollerPos = 0;
	var dragAt = 0;
	var newOffset = 0;
	var lastOffset = 0;
	
	var dragScroll = false;
	var topHint = $("#listTopHint");
	var bottomHint = $("#listBottomHint");
	var mode = sss.mode || "event"
	var height = {event:140, object:50};
	var elmtHeight = 0;
	var elms_per_page = 1;
	var offTop = 0;
	var scrollerH = 0;
	var PADDING = 20;
///////////////////////////////////////////////////////////////////////////////
	this.onMiscEvent = function( opCode, params )
	{
		var action = '';
		switch( opCode )
		{
			case "mapMarkOutEvent": case "mapMarkOutObject": action = "removeClass"; break;
			case "mapMarkOverEvent": case "mapMarkOverObject": action = "addClass"; break;
			case "blockBeforeRemove":
				removeHandlers( params )
				/* no break */ 
			default: return;
		}
		$(params.join(','))[action]('hilited');
	}
///////////////////////////////////////////////////////////////////////////////
	function mouseOverEvent( ev )
	{
		if ( this.id )
			_mt.throwMiscEvent( "eventOver", this.id.substring(5) );
		$(this).addClass('hilited');
	}
///////////////////////////////////////////////////////////////////////////////
	function mouseOutEvent( ev )
	{
		if ( this.id )
			_mt.throwMiscEvent( "eventOut", this.id.substring(5) );
		$(this).removeClass('hilited');
	}
///////////////////////////////////////////////////////////////////////////////
	function mouseOverObject( ev )
	{
		if ( this.id )
			_mt.throwMiscEvent( "objectOver", this.id.substring(6) );
		$(this).addClass('hilited');
	}
///////////////////////////////////////////////////////////////////////////////
	function mouseOutObject( ev )
	{
		if ( this.id )
			_mt.throwMiscEvent( "objectOut", this.id.substring(6) );
		$(this).removeClass('hilited');
	}
///////////////////////////////////////////////////////////////////////////////
	function removeHandlers( container )
	{
		$( "div.promo", container ).unbind( 'mouseover', mouseOverEvent );
		$( "div.promo", container ).unbind( 'mouseout', mouseOutEvent );
		$( "li", container ).unbind( 'mouseover', mouseOverObject );
		$( "li", container ).unbind( 'mouseout', mouseOutObject );
	}
///////////////////////////////////////////////////////////////////////////////
	this.setHandlers = function( settngs )
	{
		if ( settngs ) sss = settngs;
		$( "div.promo", "#content" ).hover( mouseOverEvent, mouseOutEvent );
		$( "li", "#objectSearch" ).hover( mouseOverObject, mouseOutObject );
		scroller.css("top", 0);
	}
///////////////////////////////////////////////////////////////////////////////	
	this.onResize = function( x, y )
	{
		offTop = scrollBar.offset().top;
		elmtHeight = $("#footer").offset().top - offTop;
		scrollerH = scroller.height();
		elms_per_page = Math.ceil( elmtHeight / height[ sss.mode || "event"] );
	}
///////////////////////////////////////////////////////////////////////////////
	this.onMouseMove = function( mouse, target, ev ) 
	{
		if ( !dragScroll ) return;
		// detect IE by undefined ev.which, detect no-left-button-pressed by ev.button lower bit cleared
		if ( typeof ev.which == "undefined" && 0 == ( ev.button & 1 ) ) 
			return onScrollMouseUp( ev );				
		
		var y = mouse[1] - offTop - dragAt;
		y = utils.clamp( y, 0, elmtHeight - scrollerH - PADDING ) ;
		scroller.css("top", y);
		
		var pc = y / (elmtHeight - PADDING - scrollerH);
		newOffset = Math.floor( pc * ( sss.cnt +1 - elms_per_page ) );
		if ( newOffset < 0 ) newOffset = 0;
	}
///////////////////////////////////////////////////////////////////////////////
	function onScrollMouseDown( evnt )
	{
		var ev = evnt.originalEvent;
		var button = ev.which || ev.button;
		if ( button == 1 )
		{
			dragScroll = true;
			var y  = typeof ev.pageY == "undefined" ? ev.clientY + document.documentElement.scrollTop: ev.pageY;
			dragAt = y - scroller.offset().top;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	function onScrollMouseUp( evnt )
	{
		var ev = evnt.originalEvent;
		var button = ev.which || ev.button;
		if ( dragScroll && button == 1 )
		{
			dragScroll = false;
			console.log( newOffset, lastOffset, sss.ref, elms_per_page);
			if ( newOffset != lastOffset )
			{
				lastOffset = newOffset
				var href = '/json/dir/' + sss.ref
				var post = {offset:newOffset, limit:elms_per_page}
				$.post( href, post, onLoad, "xml" );
			}
		} 
	}
///////////////////////////////////////////////////////////////////////////////
	function onLoad( xml )
	{

		console.log( xml );
		return;
		
		var dd = eval(msg);
		var ee = dd.data;
		var pp = {};
		var ht = []
//		$("#themap").html("").css("background","white");
		
		for ( var e in ee )
		{
			pp['event'+e] = ee[e][1]
			ht.push( T( "event_block", ee[e][0], ["eve","1","2","3","4"], L("event_block_gl") ) );
		}
		ht = ht.join("");
		$("#mainList").html( ht );
		map.marks.setEventPlaces( pp );
		$( "div.promo", "#content" ).hover( mouseOverEvent, mouseOutEvent ).each(_mt.rating.updateRating);
}
///////////////////////////////////////////////////////////////////////////////
	function ctor()
	{
		t.setHandlers();
		scrollBar.mousedown( onScrollMouseDown );
		$(document).mouseup( onScrollMouseUp );
		
		var mySize = utils.getWindowClientAreaSize();
		t.onResize(mySize[0], mySize[1]);		
	}
	
///////////////////////////////////////////////////////////////////////////////
	ctor();
}