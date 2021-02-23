var CDropDown = function( $, settings )
{
	var t = this;
	var elmt = $(settings.applyTo);
	var selarea = $( "div.fe-select-elem", elmt );
	var seltext = $( "b", selarea );
	var list = $( "ul", elmt );
	var ddPosActual = false;
	
	var itemTemplate = "<li id=\"$3$1\">$2</li>";
	var itemTemplateNoSel = "<li id=\"$3$1\" class=\"unselectable\">$2</li>";
	var isOpen = false;
	var selected = null;
	var hovered = null;
	
	var listener = {};
///////////////////////////////////////////////////////////////////////////////
	this.onResize = function( w, h )
	{
		pageH = h;
		ddPosActual = false;
	}
///////////////////////////////////////////////////////////////////////////////	
	this.get = function( id )
	{
		return $("#"+settings.idPrefix+id)
	}
///////////////////////////////////////////////////////////////////////////////
	this.select = function( id )
	{
		var seltd = t.get(id);
		if ( seltd.length )
		{
			$("> *", list).removeClass("selected");
			seltd.addClass("selected")
			seltext.html( seltd[0].innerHTML )
			selected = id;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	this.setText = function( text )
	{
		seltext.html( text );
	}
///////////////////////////////////////////////////////////////////////////////
	this.addListener = function( event, fn )
	{
		listener[event] = fn;
	}
///////////////////////////////////////////////////////////////////////////////
	function tellListener( event, thisref, params )
	{
		var fn = event in listener && listener[event];
		return fn && fn.apply( thisref, params );
	}
///////////////////////////////////////////////////////////////////////////////
	this.addElement = function( id, txt, unselectable )
	{
		var elt = sprintf( unselectable ? itemTemplateNoSel : itemTemplate, id, txt, settings.idPrefix );
		list.append( elt );
		ddPosActual = false;
	}
///////////////////////////////////////////////////////////////////////////////
	this.removeElement = function( id )	
	{
		var elt = $( "#" + settings.idPrefix + id );
		elt.remove();
		ddPosActual = false;
	}
///////////////////////////////////////////////////////////////////////////////
	this.clear = function()
	{
		list.empty();
		ddPosActual = false;
		
	}
///////////////////////////////////////////////////////////////////////////////
	this.deselect = function()
	{
		$("> *", list).removeClass("selected");
		selected = 0;
	}
///////////////////////////////////////////////////////////////////////////////
	function reposition()
	{
		// measure element, set position (on top or on bottom)
		var lh = settings.dir == "up" ? -list.height() - 8 : seltext.height()+8;
		var showAtY = lh;
		list[0].style.top = showAtY+"px";
		ddPosActual = true;
	}
///////////////////////////////////////////////////////////////////////////////	
	function openList()
	{
		ddPosActual || reposition();
		isOpen = true;
		elmt.addClass("fe-select-open");
	}
///////////////////////////////////////////////////////////////////////////////	
	function closeList()
	{
		isOpen = false;
		elmt.removeClass("fe-select-open");
	}
///////////////////////////////////////////////////////////////////////////////	
	function onButton( event )
	{
		if ( isOpen ) closeList();
		else openList();
		
		event.stopPropagation();
	}
///////////////////////////////////////////////////////////////////////////////
	function onMouseMove( ev )
	{
		var hoverd = ev.target;
		var banSelect = hoverd.className.indexOf('unselectable') >= 0;
		if ( banSelect || ( hoverd && hoverd.tagName != "LI" ) ) return;
		var idHover = hoverd.id;
		if ( idHover != hovered )
		{
			hovered = idHover;
			$("> *", list).removeClass("hover");
			$(hoverd).addClass("hover")
		}
	}
///////////////////////////////////////////////////////////////////////////////
	function onSelect( ev )
	{
		var target = ev.target;
		id = target.id.replace( settings.idPrefix, "" );
		var canSelect = target.className.indexOf('unselectable') < 0;
		if ( canSelect && selected != id )
		{
			t.select( id );
			tellListener( "change", ev.target, [ id ] );
		}
	}
///////////////////////////////////////////////////////////////////////////////
	function ctor()
	{
		list.click( onSelect );
		selarea.click( onButton );
		list.mousemove( onMouseMove );
	}
///////////////////////////////////////////////////////////////////////////////	
	ctor();
}