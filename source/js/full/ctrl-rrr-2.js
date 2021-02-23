/* Copyright (c) 2008 Maxim Makhotkin (maxim.makhotkin@gmail.com) 
 * 
 * Lutik LLC owns a non-exclusive license to use this code as part of its products
 *
 * Rotor module v 2
 *
 */

;function CRrr2( $, settings )
{
// Переменные и настройки
/////////////////////////////////////////////////////////////////////////////////////	
	var settings = $.extend( {
		weightStep: 0.08,
		weightFraction: 0.01,
		weightDecay: 0.8,
		maxWeight: 0.5,
//		noHide: 1,
		showDelay: 3
		}, settings );

	var t = this;
	
	var rrr = $(settings.rrr);
	var dropdown = $(settings.dropdown);
	var offsetTop = dropdown.offset().top;
	var offsetRrrTop = rrr.offset().top;

	var offsetLeftBarrel = $(settings.left_bg).offset().left;
	var offsetRightBarrel = $(settings.right_bg).offset().left;	
	var offsetBorder = offsetRightBarrel + (offsetRightBarrel - offsetLeftBarrel);

	var hovered = false;
	var mouseOver = -1;
	var timeBeforeShow = 0;

	var barrel = [null,null];
	var cell = [ $(settings.left_cell), $(settings.right_cell) ];
	var bg = [ $(settings.left_bg), $(settings.right_bg) ];
	var nativeColors = {};
	var nativeColorsSet = false;
	var virginClassLeft = "";
	
	var ie_lt7 = /MSIE (5\.5|6).+Win/.test(navigator.userAgent);
	var isOpera = $.browser.opera;

	var absPos = 100;
	var maxShader = 0.4;
	var shaderStep = 0.1;
	var shaderState = maxShader / (2*shaderStep);
	var shaderState_MAX = maxShader / shaderStep;	
	
	var RRR_DELAY_BEFORE_SHOW = 5 * _mt.getTicksPerSecond();
	var RRR_DELAY_BEFORE_HIDE = 3 * _mt.getTicksPerSecond();
	// rrr tutorial state = 0 - never shown+page not yet loaded, 1 - counting down to show, 2 - exposing (and counting), -1 - already shown/disabled 
	var rrr_tutorial_state = null === utils.getCookie("tooltips") ? 0 : -1;  
	
	
	// states:
	// -1 : not visible, display: block (set right after creation)
	// 0  : hidden
	// 1  : sliding down
	// 2  : shown
	// 3  : sliding up
	var rrr_show_state = -1; 
	
	var rrr_show_timer = 0;
	var targetHeight = $(settings.left).height();
	var dd_height = 0; // actual height (to use in animations)
	
/////////////////////////////////////////////////////////////////////////////////////
//  Barrel - полотно, содержащее элементы
/////////////////////////////////////////////////////////////////////////////////////
	var Barrel = function( div, index ) 
	{
		var nItems = 0;
		var aHeights = [];
		var addedWeight = [];
		
		var iGrow = 0;
		var holder = div;
		this.shader = $('a', div)
		var stencil = div.parent();
		var accelerator = 0; 
		var speed = 0;
		var blocks = 0;
/////////////////////////////////////////////////////////////////////////////////////		
		this.getHoveredIndex = function( absPos )
		{
			var cntY = 0;
			for( var i = 0; i < nItems; ++i )
				if ( absPos < cntY ) return i;
				else cntY += aHeights[i];
			return nItems;
		}
/////////////////////////////////////////////////////////////////////////////////////
		this.grow = function( i ) {
			for( var x = 0; x < nItems; ++x )
				addedWeight[x] =  x == i ? settings.maxWeight : 0;
		}
/////////////////////////////////////////////////////////////////////////////////////		
		this.massGrow = function( i )
		{
			for( var i = 0; i < nItems; ++i )
				addedWeight[i] = 0;
		}
/////////////////////////////////////////////////////////////////////////////////////
		this.stop = function() { speed = 0; }
/////////////////////////////////////////////////////////////////////////////////////
		this.reset = function() { }
/////////////////////////////////////////////////////////////////////////////////////
		this.updateMousePos = function( y ) { absPos = y; }
/////////////////////////////////////////////////////////////////////////////////////
		this.updateView = function() { harmonize(); }
/////////////////////////////////////////////////////////////////////////////////////
		function constructor()
		{
			nItems = holder.children().length;
			for( var i = 0; i < nItems; ++i )
				addedWeight[i] = 0;
			
			harmonize();
		}
/////////////////////////////////////////////////////////////////////////////////////
		function harmonize()
		{
			var nUnits = nItems
			for( var i = 0; i < nItems; ++i )
				nUnits += addedWeight[i];
			
			var maxAW = 0;
			var fTargetLH = targetHeight / nUnits;
			for( var i = 0; i < nItems; ++i )
			{
				aHeights[i] = fTargetLH * ( addedWeight[i] + 1);
				maxAW = Math.max( maxAW, addedWeight[i] )
			}
			
			var aa = holder.children();
			var realHeight = 0;
			var intHeight = 0;
			for( var i = 0; i < nItems; ++i )
			{
				realHeight += aHeights[i];
				var h = Math.floor(aHeights[i]);
				intHeight += h;
				if ( realHeight - intHeight > 1)
				{
					intHeight++;
					h++;
				}

				aa[i].style.lineHeight = h+'px';
				aa[i].style.height = h+'px';
				aa[i].style.fontSize = Math.floor( aHeights[i] * 0.5 ) + 'px';
				
			}
		}
/////////////////////////////////////////////////////////////////////////////////////
		constructor();
	};
/////////////////////////////////////////////////////////////////////////////////////////
// Методы класса Ротор
/////////////////////////////////////////////////////////////////////////////////////////
	function constructor()
	{
		barrel[0] = new Barrel( $(settings.left).children(), 0 );
		barrel[1] = new Barrel( $(settings.right).children(), 1 );
		elementHeight = $('a:first', $(settings.left) ).height();
		readNativeColors();
		dropdown.css( {display :'none', visibility: 'visible'} );
		dropdown[0].className = "";
		rrr_show_state = 0;

		rrr.click(show).mouseover( function(){ timeBeforeShow = 0; }  );

		if ( ie_lt7 ) // Все плохо...
			$(settings.dropdown).appendTo('body').css({top: offsetTop-2, left: offsetLeftBarrel-2, width: offsetBorder - offsetLeftBarrel });
		if ( $.browser.opera ) // Все тоже плохо...
			$(settings.dropdown).appendTo('body').css({top: offsetTop, left: offsetLeftBarrel, width: offsetBorder - offsetLeftBarrel });

		
		$("#rrr_bg_l > div, #rrr_bg_r > div").hover( function(){$(this).addClass('hover')}, function() {$(this).removeClass('hover')} );

		virginClassLeft = $(settings.left_bg)[0].className;
		// sync
		if ( settings.loaded )
			t.sync( settings.loaded );
	}
/////////////////////////////////////////////////////////////////////////////////////////
	this.getSectionLoaded = function()
	{
		return settings.loaded;
	}
/////////////////////////////////////////////////////////////////////////////////////////
	this.sync = function( ref )
	{
		// already equal if called from ctor
		if( settings.loaded != ref ) settings.loaded = ref;

		var aLeft = $( "a[href$="+ref+"now]", settings.left );
		if ( aLeft.length == 0 ) 
			aLeft = $( "a[href$="+ref+"future]", settings.left );
		var aRight = $( "a[href$="+ref+"]", settings.right );

		if ( aLeft.length )
		{
//			$(settings.left_bg)[0].style.backgroundColor = 'black';
			$(settings.left_bg)[0].className = virginClassLeft + " " + aLeft[0].className.substring(0,3);
			$('span', settings.left_bg).html(aLeft[0].innerHTML);
			$('span', settings.right_bg).html(settings.defRightText);
			$(settings.right_bg)[0].style.backgroundColor = '';
		} else if ( aRight.length )
		{
			$(settings.right_bg)[0].style.backgroundColor = nativeColorsSet ? "rgb(" + nativeColors[aRight[0].href].toString() + ")" : aRight.css('background-color');
			$('span', settings.right_bg).html(aRight.html());
//			$(settings.left_bg)[0].style.backgroundColor = '';
			$(settings.left_bg)[0].className = virginClassLeft;
			$('span', settings.left_bg).html(settings.defLeftText);
			
		} else {
//			$(settings.left_bg)[0].style.backgroundColor = '';
			$(settings.left_bg)[0].className = virginClassLeft;
			$('span', settings.left_bg).html(settings.defLeftText);
			$('span', settings.right_bg).html(settings.defRightText);
			$(settings.right_bg)[0].style.backgroundColor = '';
		}
	}
/////////////////////////////////////////////////////////////////////////////////////////
	function onHidden()
	{
		dropdown.hide();
		rrr_show_state = 0;
		dd_height = 0;
	}
	/////////////////////////////////////////////////////////////////////////////////////////
	this.hide = function( force )
	{
		hovered = false; 
		if ( rrr_show_state == 2 || force )
		{
			if ( settings.noHide )
				onHidden();
			else
				rrr_show_state = 3;
		}

	}
/////////////////////////////////////////////////////////////////////////////////////////	
	function show()
	{
		//console.log('rrr - show')
		rrr_show_state = 1;
		dropdown[0].style.display = "block";
	}	
/////////////////////////////////////////////////////////////////////////////////////////
	function onShown()
	{
		rrr_show_state = 2;
		dd_height = targetHeight;
	}
/////////////////////////////////////////////////////////////////////////////////////////
	this.onMouseMove = function( mouse ) 
	{
		if ( mouse[0] < offsetLeftBarrel || 
				mouse[0] >= offsetBorder || 
				 mouse[1] < offsetRrrTop || 
				mouse[1] > offsetTop + targetHeight ) { 
			rrr_tutorial_state == 2 || t.hide()
			mouseOver = -1;
			return; 
		}
		
		//$("#rrr_cr").html( mouse.toString() );
		
		// Раз навели сюда мышь, то туториал уже не нужен.
		rrr_tutorial_state = -1;
		
		if ( mouse[0] < offsetRightBarrel ) mouseOver = 0;
		if ( mouse[0] >= offsetRightBarrel ) mouseOver = 1
		if ( mouse[1] <= offsetTop ) mouseOver += 2
		if ( mouseOver == 0 ) { barrel[0].updateMousePos( mouse[1] - offsetTop ); } else
		if ( mouseOver == 1 ) { barrel[1].updateMousePos( mouse[1] - offsetTop ); } else
		hovered = true;
			
		var pos = 0;
		if ( mouseOver%2 == 0 )
		{
			var i1 = barrel[0].getHoveredIndex( absPos );
			barrel[0].grow(i1-1);
			barrel[1].massGrow(i1-1)
		}
		
		if( mouseOver%2 == 1 )
		{
			var i2 = barrel[1].getHoveredIndex( absPos )
			barrel[1].grow(i2-1);
			barrel[0].massGrow(i2-1);
		}
		if ( mouseOver >= 2 )
		{
			barrel[0].grow(-1);
			barrel[1].grow(-1);
		}
		
		barrel[0].updateView();
		barrel[1].updateView();		
	}
/////////////////////////////////////////////////////////////////////////////////////////
	this.onTick = function(nTicks)
	{
		if ( rrr_show_state == 0 ) 
		{
			if ( hovered && mouseOver >= 2 ) 
				timeBeforeShow++;
			else
				timeBeforeShow = 0;

			if ( timeBeforeShow > settings.showDelay )
				show();
		}
		
		if ( rrr_show_state == 1 )
		{
			dd_height += 40;
			if ( dd_height >= targetHeight )
				onShown();
			dropdown[0].style.height = dd_height+"px";
			$(settings.right)[0].style.height = dd_height+"px";
			$(settings.left)[0].style.height = dd_height+"px";
			//console.log( rrr_show_state, dd_height )
		}

		if ( rrr_show_state == 3 )
		{
			dd_height -= 40;
			if ( dd_height <= 0 )
				onHidden();
			dropdown[0].style.height = dd_height+"px";
			$(settings.right)[0].style.height = dd_height+"px";
			$(settings.left)[0].style.height = dd_height+"px";
			//console.log( rrr_show_state, dd_height )
		}

		
		// left-right sides shader 
		if ( mouseOver >= 0 )
		{
			var mo = mouseOver % 2;
			var needUpd = false;
			if ( mo && shaderState < shaderState_MAX )
			{
				shaderState++;
				needUpd = true;
			}
			else if( !mo && shaderState > 0 )
			{
				shaderState--;
				needUpd = true;
			}
			
			if( needUpd )
			{
				barrel[0].shader.css("opacity", 1 - shaderState * shaderStep );
				barrel[1].shader.css("opacity", 1 - ( shaderState_MAX - shaderState ) * shaderStep );
			}
		}
		
		// delay for auto-show (rrr usage tutorial)
		if ( rrr_tutorial_state == 1 )
		{
			RRR_DELAY_BEFORE_SHOW--;
			if ( RRR_DELAY_BEFORE_SHOW <= 0 )
			{
				show();
				rrr_tutorial_state = 2;
			}
		}

		if ( rrr_tutorial_state == 2 )
		{
			RRR_DELAY_BEFORE_HIDE--;
			if ( RRR_DELAY_BEFORE_HIDE <= 0 )
			{
				t.hide();
				rrr_tutorial_state = -1;
			}
		}
		
//		$("#content").html( rrr_tutorial_state + "; " + RRR_DELAY_BEFORE_SHOW + "; " + RRR_DELAY_BEFORE_HIDE )
	}
/////////////////////////////////////////////////////////////////////////////////////
	function colorMix( color, weight )
	{
		var res = []
		for( var i = 0; i < 3; ++i )
			res[i] = Math.floor(color[i] + weight*(255-color[i])/1.2);
		return "rgb("+res[0]+","+res[1]+","+res[2]+")";
	}
/////////////////////////////////////////////////////////////////////////////////////
	function readNativeColors()
	{
		var aa = $('a', settings.right);
		for( var i = 0; i < aa.length; ++i )
		{ 
			var cc = aa.eq(i).css("background-color");
			var res = [];
			//console.log(cc);
			var rgbm = cc.match(/rgb\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3})\)/ )
			if ( rgbm ) {
				for( var k = 1; k < 4; ++k )
					res.push( parseInt( rgbm[k] ) );
			} else {
				var ic = cc.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/);
				if ( ic )
					for( var k = 1; k < 4; ++k )
						res.push( parseInt( ic[k], 16 ) );
				else
				{
					ic = cc.match(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
					if ( ic ) 
						for( var k = 1; k < 4; ++k )
							res.push( parseInt( ic[k]+""+ic[k], 16 ) );
					else res = [0,0,0]
				}
			}
			nativeColors[aa[i].href] = res;
			nativeColorsSet = true; // ничего что в цикле
		}
	}
/////////////////////////////////////////////////////////////////////////////////////////	
	this.onResize = function()
	{
		offsetLeftBarrel = $(settings.left_bg).offset().left;
		offsetRightBarrel = $(settings.right_bg).offset().left;
		offsetBorder = offsetRightBarrel + (offsetRightBarrel - offsetLeftBarrel);	
		if ( ie_lt7 || $.browser.opera )
			$(settings.dropdown).css({left: offsetLeftBarrel-(ie_lt7?2:0), width: offsetBorder - offsetLeftBarrel });
	}
/////////////////////////////////////////////////////////////////////////////////////////
	this.onBodyLoad = function()
	{
		rrr_tutorial_state || (rrr_tutorial_state = 1)
	}
/////////////////////////////////////////////////////////////////////////////////////////
	constructor();
};