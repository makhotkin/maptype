/* (c) 2008 Max Makhotkin (maxim.makhotkin@gmail.com)
 * 
 * Lutic LLC has an non-exclusive right to use this software.
 *
 */

////////////////////////////////////////////////////////////////////////////////////////////		
// The CPage class - the entry point for any activity withing the page
////////////////////////////////////////////////////////////////////////////////////////////		
var CPage = function() 
{
	var component = [];
	var events = [ 'Tick', 'Resize', 'Unload', 'MouseMove', 'MiscEvent', 'BodyLoad' ]; // writing with 1st capital is important
	var eventListener = {};
	var timerID = -1;
	var nTicks = 0;
	var updateInterval = 20; // ms
	var globalNames = {};
	var componentsToLoad = {};
	var myUID = 0;
	var myName = "";
	
	var settings = {};
	this.user = {};
	this.onload = null;
////////////////////////////////////////////////////////////////////////////////////////////		
	this.getTicksPerSecond = function() { return 1000/updateInterval; }
////////////////////////////////////////////////////////////////////////////////////////////		
	this.setSettings = function( what, toSet, rewrite )
	{
		if ( !settings[what] ) settings[what] = {};
		for( var i in toSet )
			if ( rewrite ) settings[what][i] = toSet[i]
			else if ( !settings[what][i] ) settings[what][i] = toSet[i]
	}
////////////////////////////////////////////////////////////////////////////////////////////
	this.getSettingsFor = function( what )
	{
		return settings[what];
	}
////////////////////////////////////////////////////////////////////////////////////////////		
	function onReady() 
	{
		for( var i in componentsToLoad )
		{
			var obj = settings[i] ? (new componentsToLoad[i]( jQuery, settings[i] )) : (new componentsToLoad[i]( jQuery ));			
			addComponent( obj );
			if ( globalNames[i] )
				window[globalNames[i]] = obj;
			else 
				this[i] = obj
		}
		
		if ( this.onload ) this.onload();
		
		if ( eventListener['Tick'] ) timerID = setInterval( onTick, updateInterval );
		if ( eventListener['Resize'] ) $(window).resize( onResize );
		if ( eventListener['Unload'] ) $(window).unload( onUnload );
		if ( eventListener['MouseMove'] ) document.onmousemove = onMouseMove;
	}
////////////////////////////////////////////////////////////////////////////////////////////				
	this.throwMiscEvent = function ( opCode, params )
	{
		for( var i = 0; i < eventListener['MiscEvent'].length; i++ )
			eventListener['MiscEvent'][i].onMiscEvent( opCode, params );		
	}
////////////////////////////////////////////////////////////////////////////////////////////				
	this.setGlobalName = function( id, alias ) 
	{
		globalNames[id] = alias;
	}
////////////////////////////////////////////////////////////////////////////////////////////			
	this.loadComponent = function( index, className, sett_ngs )
	{
		componentsToLoad[index] = className;
		if ( arguments.length > 2 ) 
			settings[index] = sett_ngs;
	}
////////////////////////////////////////////////////////////////////////////////////////////		
	this.addComponentNow = function( index, className, sett_ngs )
	{
		var obj = sett_ngs ? (new className( jQuery, sett_ngs )) : (new className( jQuery ));			
		addComponent( obj );
		if ( index )
			this[index] = obj;		
	}
////////////////////////////////////////////////////////////////////////////////////////////			
	this.setUser = function( uid, name )  { myUID = uid; myName = name; }
	this.getUID = function()        { return myUID; }
	this.getUsername = function()   { return myName; }
	this.isLoggedIn = function()    { return myUID != 0; }
////////////////////////////////////////////////////////////////////////////////////////////
	this.log = function()
	{
		if ( myUID == 33224 ) console.log( arguments )
	}
////////////////////////////////////////////////////////////////////////////////////////////		
	function addComponent( which )
	{
		for( var i = 0; i < events.length; i++ )
		{
			if ( typeof which['on'+events[i]] == 'function' ) 
			{	// subscribe component
				if ( !eventListener[events[i]] )
					eventListener[events[i]] = [];
				eventListener[events[i]].push( which );				
			}
		}
		component.push( which );
	}	
////////////////////////////////////////////////////////////////////////////////////////////		
	function onTick()
	{
		nTicks++;
		for( var i = 0; i < eventListener['Tick'].length; i++ )
			eventListener['Tick'][i].onTick(nTicks);
	}
////////////////////////////////////////////////////////////////////////////////////////////		
	function onUnload()
	{
		var q = eventListener['Unload']
		for( var i = 0; i < q.length; i++ )
			q[i].onUnload();

	}
////////////////////////////////////////////////////////////////////////////////////////////			
	function getMouseFromEvent( ev )
	{
		return [ev.pageX == undefined ? ev.clientX + document.documentElement.scrollLeft : ev.pageX, ev.pageY == undefined ? ev.clientY + document.documentElement.scrollTop: ev.pageY];
	}
////////////////////////////////////////////////////////////////////////////////////////////		
	function onMouseMove( ev )
	{
		ev = ev || window.event;
		var mousePos = getMouseFromEvent( ev );
		var target = ev.srcElement || ev.srcElement;
		var q = eventListener['MouseMove'];
		for( var i = 0; i < q.length; i++ )
			q[i].onMouseMove( mousePos, target, ev );
	}
////////////////////////////////////////////////////////////////////////////////////////////			
	this.onBodyLoad = function()
	{
		onResize();
		var q = eventListener['BodyLoad'];
		if ( q ) for( var i = 0; i < q.length; i++ ) q[i].onBodyLoad();
	}
////////////////////////////////////////////////////////////////////////////////////////////			
	function onResize()
	{
		var q = eventListener['Resize'];
		if ( !q || !q.length ) return; 

		var clientSize = utils.getWindowClientAreaSize();
		var h = clientSize[1];
		var w = clientSize[0];		
		for( var i = 0; i < q.length; i++ ) q[i].onResize( w, h );
	}	
////////////////////////////////////////////////////////////////////////////////////////////	
	function constructor()
	{
		var t = this;
		$(document).ready( function() { onReady.apply(t) } );		
	}
///////////////////////////////////////////////////////////////////////////////////////////
	constructor.apply(this);
}
/*window.*/
var _mt = new CPage();

// Some useful functions
function rf()   { return false; }; // megafunction!!! 
function pdf(e) { if ( e.preventDefault ) { e.preventDefault(); } return false; };
function sp(e)  { if ( e.stopPropagation ) { e.stopPropagation(); } e.cancelBubble = true; };
function sprintf(z) {for(var i=1, len=arguments.length; i<len; ++i ) {z=z.replace("$"+i,arguments[i]);} return z;};
