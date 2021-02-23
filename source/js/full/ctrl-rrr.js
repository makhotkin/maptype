/* Copyright (c) 2008 Maxim Makhotkin (maxim.makhotkin@gmail.com) 
 * 
 * Lutik LLC owns a non-exclusive license to use this code as part of its products
 *
 * 
 * Rotor module 
 *
 */

;function CRrr( $, settings )
{

// Переменные и настройки
/////////////////////////////////////////////////////////////////////////////////////	

	var settings = $.extend({	
		maxSpeed: 4,
		friction: 0.75,
		acceleration: 0.4,
		maxAutoPilotSpeed: 20, // px per tick
		autoPilotLag: 4,
		scroll: [0, 0.2, 0.08, 0, 0.25, 0, 0.8, -0.4, 1, -1.5],
		showDelay: 20,
		//equalityPoint: 0.12,
		
		template: '<a href="/$4$1" class="rubrika" style="background-color:$2">$3</a>',														
		left: null,
		right: null,
		dropdown: null,
		
		hues: [0,0.138,0.277,0.416,0.555,0.694,0.833,0.944],
		sat: 0.85,
		v: .9,
		
		sat_delta: 0.1,
		content: {
			fashion:{n:"Мода",d:{2:"Бутики", 14:"Магазины обуви", 15:"Магазины одежды" }},
			food:{n:"Еда",d:{22:"Рестораны", 19:"Клубы", 21:"Пиццерии", 6:"Кафе и кофейни", 16:"Магазины продуктовые", 23:"Супермаркеты", 13:"Кондитерские"}},
			alco:{n:"Алкоголь", d:{1:"Бары", 19:"Клубы", 22:"Рестораны", 12:"Магазины алкоголя", 17:"Магазины табака"}},
			dance:{n:"Танцы", d:{19:"Клубы", 1:"Бары"}},
			music:{n:"Музыка", d:{9:"Концертные залы", 19:"Клубы", 1:"Бары"}},
			movie:{n:"Кино", d:{7:"Кинотеатры", 19:"Клубы"}},
			art:{n:"Искусство",d:{4:"Галереи", 18:"Музеи", 19:"Клубы"}},
			knowledge:{n:"Знания", d:{3:"ВУЗы", 4:"Галереи", 18:"Музеи"}}
		}
		
		}, settings );

	var rrr = $(settings.rrr);
	var dropdown = $(settings.dropdown);
	var targetHeight = $(settings.left).height();
	var offsetTop = dropdown.offset().top;
	var offsetRrrTop = rrr.offset().top;

	var offsetLeftBarrel = $(settings.left_bg).offset().left;
	var offsetRightBarrel = $(settings.right_bg).offset().left;	
	var offsetBorder = offsetRightBarrel + (offsetRightBarrel - offsetLeftBarrel);		

	var visible = false;
	var hovered = false;
	var hiding = false;
	var mouseOver = [ false, false, false ];
	var timeBeforeShow = 0;

	var barrel = [null,null];
	var cell = [ $(settings.left_cell), $(settings.right_cell) ];
	var bg = [ $(settings.left_bg), $(settings.right_bg) ];
	var colors = [ {}, {} ];

	var ie_lt7 = /MSIE (5\.5|6).+Win/.test(navigator.userAgent);
	var isOpera = $.browser.opera;

	var rollLeader = -1;
	var elementHeight = 0;
	var objectsCount = [0,0];
	var absPos = 100;

	var irpLeftToRight = [0,0];
	var irpRightToLeft = [0,0];	

	//var dbg = new Debugger();	

// способы заполнения категорий и элементов
/////////////////////////////////////////////////////////////////////////////////////	
	function howToFillLeftBarrel( container, items ) { 
		var ic = 0, iid;
		for( var i in items ) 
		{
			for( var ii in items[i].d ) { iid = ii; break; }
			var color = getColorFor( ic, 0 );
			if( !colors[0].complete ) colors[0][i] = color;
			$(sprintf( settings.template, iid+i, color, items[i].n, 'dir' )).appendTo( container ); 
			ic++;
		}
		colors[0].complete = true;
	};
/////////////////////////////////////////////////////////////////////////////////////		
	function getColorFor( i, j )
	{
		var h = settings.hues[i];
		var s = settings.sat - j*settings.sat_delta;
		return utils.toRGB(h,s,settings.v);
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function howToFillRightBarrel( container, items ) 
	{ 
		var ic = 0, id = 0;
		for( var i in items )
		{
			id = 0;
			for( var ii in items[i].d )
			{
				var name = items[i].d[ii].replace( ' ', ' ' );
				var color = getColorFor(ic,id);
				var index = ii+i
				if( !colors[1].complete ) colors[1][index] = color;				
				$(sprintf( settings.template, index, color, name, 'cat' )).appendTo( container );
				id++;
			}
			ic++;
		}
		colors[1].complete = true;		
	};	
/////////////////////////////////////////////////////////////////////////////////////
//  Barrel - полотно, содержащее все элементы (как минимум 2 раза)
/////////////////////////////////////////////////////////////////////////////////////
	var Barrel = function( div, fillingStrategy, index ) 
	{
		var stencil = div.parent();
		var heightBlock = 0;
		var accelerator = 0; 
		var speed = 0;
		var offset = 0;	
		var targetOffset = 0;
		var blocks = 0;
/////////////////////////////////////////////////////////////////////////////////////
		this.onTick = function()
		{
			if ( mouseOver[index] ) // master mode
			{	
				offset += speed;
				speed *= settings.friction;
				speed += accelerator * settings.acceleration;
			}
			if ( mouseOver[1-index] ) // anal slave Mode
			{
				speed *= settings.friction;
				
				// расстояние от целевой точки до текущей
				var delta = targetOffset - offset;
				//var rawDelta = delta;
				
				// выбрать путь по барабану
				if ( delta > heightBlock / 2 ) delta = delta - heightBlock;
				if ( delta < -heightBlock / 2 ) delta = delta + heightBlock;

				//console.log( 'Fact: %d ... plan: %d... delta: %d... raw: %d  ', Math.round(offset), Math.round(targetOffset), Math.round(delta), Math.round( rawDelta ) );
					
				// запустить туда барабан
				speed += delta/settings.autoPilotLag;
				
				if ( Math.abs( speed ) > settings.maxAutoPilotSpeed ) 
					speed = speed/Math.abs(speed)*settings.maxAutoPilotSpeed;
				if ( Math.abs( speed ) > Math.abs( delta ) ) 
					speed = delta;

				offset += speed;
			}
			this.setPosition( offset );
		}
/////////////////////////////////////////////////////////////////////////////////////
		this.setPosition = function( position )
		{
			offset = position;
			if ( offset > 0 ) offset -= heightBlock;
			if ( offset < -heightBlock ) offset += heightBlock;
			if ( offset > 0 ) offset -= heightBlock;
			if ( offset < -heightBlock ) offset += heightBlock;			
			div.css( 'top', offset );
		}
/////////////////////////////////////////////////////////////////////////////////////		
		this.getHoveredIndex = function( absPos )
		{
			return Math.floor((absPos-offset)/elementHeight) % objectsCount[index];
		}
/////////////////////////////////////////////////////////////////////////////////////		
		this.getHoveredElmtPosition = function( absPos )
		{
			return (absPos-offset)%elementHeight;
		}		
/////////////////////////////////////////////////////////////////////////////////////		
		this.setOffsetForHover = function( index, absPos, dy )
		{
			targetOffset = absPos - index * elementHeight - dy;
		}				
/////////////////////////////////////////////////////////////////////////////////////
		this.stop = function() { speed = 0; }
/////////////////////////////////////////////////////////////////////////////////////
		this.reset = function() { this.setPosition(0); }		
/////////////////////////////////////////////////////////////////////////////////////		
		this.updateMousePos = function( y ) 
		{	// Здесь нужно из положения мышки получить множитель для ускорителя
			absPos = y;
			var relPos = Math.min(0.999, absPos / targetHeight );
			accelerator = utils.irp( relPos, settings.scroll );
		}
/////////////////////////////////////////////////////////////////////////////////////		
		function constructor()
		{
			// Заполнить контейнер
			blocks = 0;
			while( blocks < 6 && div.height() < targetHeight )
			{
				blocks++;
				fillingStrategy( div, settings.content );
			};
			heightBlock = -div.height();
			// для гарантии что контент хотя бы на одну свою высоту больше чем контейнер
			fillingStrategy( div, settings.content  );
			blocks++;
			heightBlock += div.height();			
		}
/////////////////////////////////////////////////////////////////////////////////////		
		constructor();
	};
/////////////////////////////////////////////////////////////////////////////////////////
// Методы класса Ротор
/////////////////////////////////////////////////////////////////////////////////////////
	function constructor()
	{
		barrel[0] = new Barrel( $(settings.left).children(), howToFillLeftBarrel, 0 );
		barrel[1] = new Barrel( $(settings.right).children(), howToFillRightBarrel, 1 );
		elementHeight = $('a:first', $(settings.left) ).height();
		dropdown.css({ display :'none', visibility: 'visible'});		

		// Приготовить интерполяторы
		var sIndex = 0;
		var sItems = 0;
		for( var i in settings.content )
		{
			sIndex++;
			for( var ii in settings.content[i].d ) { sItems ++; }
			irpLeftToRight.push(sIndex);
			irpLeftToRight.push(sItems);
			irpRightToLeft.push(sItems);				
			irpRightToLeft.push(sIndex);
		}
		objectsCount[0] = sIndex;
		objectsCount[1] = sItems;
		
		
		rrr.click(function(){ 
			if ( !visible ) onShow();
		}).mouseover( function(){ timeBeforeShow = 0; }  );

		if ( ie_lt7 ) // Все плохо...
		{
			$(settings.dropdown).appendTo('body').css({top: offsetTop-2, left: offsetLeftBarrel-2, width: offsetBorder - offsetLeftBarrel });
		}
		if ( $.browser.opera ) // Все тоже плохо...
		{
			$(settings.dropdown).appendTo('body').css({top: offsetTop, left: offsetLeftBarrel, width: offsetBorder - offsetLeftBarrel });
		}

		// sync
		if ( settings.loaded )
		{
			var locSlash = settings.loaded.indexOf('/');
			var cName = settings.loaded.substring( 1+locSlash );
			if( !cName || !cName.length ) 
				return;
			
			var isAll = settings.loaded.substring(0, locSlash ) == 'all';
			
			$(settings.left_bg).css('background-color', colors[0][cName])[0].className += ' ' + cName;
			$(settings.right_bg).css('background-color', isAll ? colors[0][cName] : colors[1][settings.loaded]);			
			
			$(settings.left_cell).text( settings.content[cName].n );
			$(settings.right_cell).text( isAll ? "Все" : settings.content[cName].d[settings.loaded.substring( 0, locSlash )] );			
		}
	}
/////////////////////////////////////////////////////////////////////////////////////////		
	this.onMouseMove = function( mouse ) 
	{
		if ( mouse[0] < offsetLeftBarrel || mouse[0] >= offsetBorder || mouse[1] < offsetRrrTop || mouse[1] > offsetTop + targetHeight ) { hovered = false; return; }
		
		mouseOver[0] = mouse[0] < offsetRightBarrel && mouse[1] > offsetTop;
		mouseOver[1] = mouse[0] >= offsetRightBarrel && mouse[1] > offsetTop;		
		mouseOver[2] = mouse[1] <= offsetTop;

		if ( mouseOver[0] ) {	rollLeader = 0; barrel[0].updateMousePos( mouse[1] - offsetTop ); } 
		if ( mouseOver[1] ) {	rollLeader = 1; barrel[1].updateMousePos( mouse[1] - offsetTop ); } 

		hovered = true;
	}
/////////////////////////////////////////////////////////////////////////////////////////	
	this.onTick = function()
	{
		if ( !visible ) 
		{
			if ( hovered && mouseOver[2] ) 
				timeBeforeShow++;
			else
				timeBeforeShow = 0;
			
			if ( timeBeforeShow > settings.showDelay )
				onShow();
				
			return;
		}
		
		if ( visible && !hovered && !hiding )
		{
			hiding = true;
			dropdown.fadeOut( onHidden );
		}
			
		var pos = 0;
		if ( rollLeader == 0 )
		{
			barrel[0].onTick();
			var i1 = barrel[0].getHoveredIndex( absPos );
			var dy = barrel[0].getHoveredElmtPosition( absPos );
			var i2 = utils.irp( i1, irpLeftToRight );
			barrel[1].setOffsetForHover( i2, absPos, dy );
			barrel[1].onTick();
		}
		else if( rollLeader == 1 )
		{
			barrel[1].onTick();
			var i2 = barrel[1].getHoveredIndex( absPos )
			var dy = barrel[1].getHoveredElmtPosition( absPos );
			var i1 = Math.floor( utils.irp( i2, irpRightToLeft ) );
			barrel[0].setOffsetForHover( i1, absPos, dy );			
			barrel[0].onTick();			
		}
	}
/////////////////////////////////////////////////////////////////////////////////////////	
	function onShow()
	{
		dropdown.slideDown("fast");		
		visible = true;
		hiding = false;
		mouseOver[2] = true;
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
	function onHidden()
	{
		visible = false;
		hiding = false;
	}
/////////////////////////////////////////////////////////////////////////////////////////
	constructor();
};