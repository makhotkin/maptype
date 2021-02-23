var CLightBox = function( $, settings ) {
	var settings = $.extend({
		item: "#tooltip"
	},settings);
	
	var theBox = $(settings.item);
	var textPlace = $('span',theBox);
	var cursorSize = 16;
	var lastXY = [0,0];
	var shown = false;
	var belongsTo = "*noone*";
	
	this.getOwner = function() { return belongsTo; } 
	
	this.onMouseMove = function( mousePos )
	{
		lastXY = mousePos;
		if ( shown )
			updatePosition()
		//console.log( 'tt mousemove', ev );
	}
	
	function updatePosition()
	{
		var screen_c = [ lastXY[0] + cursorSize, lastXY[1] ];
		// Adjust to hit no edges
		theBox.css( { left: screen_c[0], top: screen_c[1] });
	}
	this.setHtml = function( html ) {
		textPlace[0].style.width = "auto";
		textPlace[0].style.whiteSpace = "nowrap";
		textPlace[0].innerHTML = html; 
		if ( textPlace[0].offsetWidth > 200 )
		{
			textPlace[0].style.width = '200px'
			textPlace[0].style.whiteSpace = "normal";				
		}
	}
	this.show = function( owner ) { 
		theBox[0].style.visibility = 'visible';
		updatePosition();
		shown = true;
		belongsTo = owner;
	}
	this.hide = function() { 
		theBox[0].style.visibility = "hidden"; 
		shown = false;
	}
	function ctor()
	{
		jqTextPlace = $( "#map-infobubble-contents" );
		theBox.mousedown(sp);
	};

	ctor();
};