// JavaScript Document
;var utils = {
	scrollbarWidth : 0,
	getScrollbarWidth: function () 
		{
			 if ( this.scrollbarWidth )
			 		return this.scrollbarWidth;
			
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
			 
			 this.scrollbarWidth = (wNoScroll - wScroll)
	 		 return this.scrollbarWidth;
		},
	getWindowClientAreaSize: function ()
	{
		var size = [0,0];
		// Yes, jQuery's standart $(document).height() fails - under Opera it does.
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			size[0] = window.innerWidth - this.getScrollbarWidth();
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
	//  getPageSize() (taken from from Lightbox v2.04 by Lokesh Dhakar - http://www.lokeshdhakar.com)
	getPageSize: function() {
				
		 var xScroll, yScroll;
		
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		
		if (self.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth; 
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}

		return [pageWidth,pageHeight];
	},	
	findPlaceInArray: function( needle, arr ) 
	{
		if( arr.length == 0 ) return 0; 
		for( var i = 0; i < arr.length; i++ )
			if ( needle < arr[i] ) return i;
		return arr.length;
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
		this.toString = function() { return Math.ceil(a[0][0]) +' @ '+ Math.round(a[0][2])+', '+Math.round(a[1][2]); } 																					
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
	
///////////////////////////////////////////////////////////////////////////////////////////	
	findParentWithClass: function( child, searchClass, max_depth )
	{
		var parent = child.parentNode;
		var depth = max_depth || 6;		
		while ( parent != null && depth )
		{
			if ( 1 + parent.className.indexOf( searchClass ) ) return parent;
			parent = parent.parentNode;
			depth--;
		}		
	},
/////////////////////////////////////////////////////////////////////////////////////				
	makeUnselectable: function() 
	{
		if (typeof document.onselectstart!="undefined") //IE tends to select everythin'
		{
			this.unselectable = 'on'; 
			this.onselectstart = rf;
		}
		else 
		{
			this.onmousedown = pdf;
		}
	},
/////////////////////////////////////////////////////////////////////////////////////					
	setCookie: function( name, data, days ) {
		var cdate = new Date();
		cdate.setTime( cdate.getTime() + days * 86400 * 1000 );
		var toSet = name+"= "+data+"; expires= "+cdate.toGMTString()+"; path=/";
		document.cookie = toSet;
	},
/////////////////////////////////////////////////////////////////////////////////////				
	getCookie: function(name) {
		var prefix = name + "="
		var cookieStartIndex = document.cookie.indexOf(prefix)
		if (cookieStartIndex == -1)
				return null;
		var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length)
		if (cookieEndIndex == -1)
				cookieEndIndex = document.cookie.length
		return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex))
	},
/////////////////////////////////////////////////////////////////////////////////////					
	toRGB: function( h, s, v ) {
		function return_rgb( r,g,b ) { return ret = 'rgb(' + Math.floor(255*r) + ',' + Math.floor(255*g) + ',' + Math.floor(255*b) + ')'; }
		h *= 6;
		var i = Math.floor(h);
		var f = h - i;
		if ( !(i&1) ) f = 1 - f; // if i is even
		var m = v * (1 - s);
		var n = v * (1 - s * f);
		switch (i) {
			case 6:
			case 0: return return_rgb(v, n, m);
			case 1: return return_rgb(n, v, m);
			case 2: return return_rgb(m, v, n);
			case 3: return return_rgb(m, n, v);
			case 4: return return_rgb(n, m, v);
			case 5: return return_rgb(v, m, n);
		}
	},
	
	//Queue: function(){var _1=[];var _2=0;this.getSize=function(){return _1.length-_2;};this.isEmpty=function(){return (_1.length==0);};this.enqueue=function(_3){_1.push(_3);};this.dequeue=function(){var _4=undefined;if(_1.length){_4=_1[_2];if(++_2*2>=_1.length){_1=_1.slice(_2);_2=0;}}return _4;};this.getOldestElement=function(){var _5=undefined;if(_1.length){_5=_1[_2];}return _5;};},	
/////////////////////////////////////////////////////////////////////////////////////				
// Линейная интерполяция по ключевым точкам
	irp : function( value, rule ) {
		for( var i = 1; i < rule.length/2; i++ )
			if ( value < rule[2*i] )
				return (value-rule[2*i-2])/(rule[2*i]-rule[2*i-2])*(rule[2*i+1]-rule[2*i-1])+rule[2*i-1];
	},
	irp_rev : function( value, rule ) {
		for( var i = 1; i < rule.length/2; i++ )
			if ( value < rule[2*i+1] )
				return (value-rule[2*i-1])/(rule[2*i+1]-rule[2*i-1])*(rule[2*i]-rule[2*i-2])+rule[2*i-2];
	}
};

utils.letterMath = new utils.someMath( 26, 65 ); // Буквенная математика (26 цифр, начиная с 65ого символа)
utils.numberMath = new utils.someMath( 10, 48 ); // Обычная математика - она умеет сохранять нули впереди аргументов
utils.hash = function( elmt ) { return elmt.href.substring(elmt.href.indexOf('#')+1) }
utils.path = function( elmt ) { return elmt.href.substring(elmt.href.replace("//",'**').indexOf('/')) }
utils.clamp = function( value, min, max ) { return Math.min( max, Math.max( min, value ) ); }
utils.countFor = function( amount ) { 
	amount = amount % 100;
	var c10 = amount % 10;
	if (c10 == 0 || c10 >= 5 || ( amount > 5 && amount < 21 )) return 0
	return c10 == 1 ? 1 : 2;
}