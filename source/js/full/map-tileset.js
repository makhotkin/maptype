/* (c) 2008 Max Makhotkin ( maxim.makhotkin@gmail.com )
 * 
 * Lutic LLC owns a non-exclusive right to use this file as part of its products
 * 
 */

// TileSet - Набор плиток (aka мозайка), из которых составляется карта
////////////////////////////////////////////////////////////////////////////////////////////////////////////	
function CTileSet( div, tileSize, zoom )
{
	var tile = [];
	var tilePlace = [];
	var tiles_per_dimension = [0,0];
	var largest_vp = [0,0];
	var scale = 0;
	var scale_mul = 1;
	var lastScaleMul = scale_mul;
	var x0, y0;		// экранные координаты нулевой плитки в нулевом периоде (а период - это количество пролистанных плиток/плиток_в_ряду)
	var ww = [];

	this.which = div[0].className;
	
	this.onResize = function( viewportSize, dds, transform )
	{
		tiles_per_dimension[0] = 1 + Math.ceil( viewportSize[0] / tileSize );
		tiles_per_dimension[1] = 1 + Math.ceil( viewportSize[1] / tileSize );

		// create more tiles, but does not remove excessive tiles (if user shrinked window)
		var deficit = tiles_per_dimension[0] * tiles_per_dimension[1] - tile.length;
		for( var i = 0; i < deficit; i++ )
			div.append( createTile( i ) );
			
		if ( deficit > 0 )
		{
			// will save this size for later uses (if vp gets smaller, will still use this large one)
			largest_vp[0] = Math.max( viewportSize[0], largest_vp[0] );
			largest_vp[1] = Math.max( viewportSize[1], largest_vp[1] );
			this.setupTileLayout( dds, transform );
		}
		this.onScroll( dds );
	}
	
	this.setScaleMul = function( newMul )
	{
		scale_mul = newMul;
	}
	
	this.onScroll = function( dds, ptZoom8 ) 
	{
		//var d1 = new Date();
		
		// на сколько плиток улистали карту, с момента раскладки плиток
		var sx = ( -x0 - dds[0] ) / tileSize + tiles_per_dimension[0] - 1;
		var sy = ( -y0 - dds[1] ) / tileSize + tiles_per_dimension[1] - 1;
		// а теперь для каждой плитки нужно понять, на месте ли она.
		
		var ptZoom = [ 0, 0 ];
		if ( ptZoom8 && scale_mul != 1 )
		{
			ptZoom[0] = ptZoom8 ? ( ptZoom8[0] - dds[0] ) : 0; 
			ptZoom[1] = ptZoom8 ? ( ptZoom8[1] - dds[1] ) : 0; 		
		}
		
		for( i = 0; i < tile.length; i++ )
		{
			// "плиточные" координаты данной плитки
			var tx = i % tiles_per_dimension[0];
			var ty = Math.floor( i / tiles_per_dimension[0] );
			// в каком периоде находится данная плитка?
			var px = Math.floor( ( sx - tx ) / tiles_per_dimension[0] );
			var py = Math.floor( ( sy - ty ) / tiles_per_dimension[1] );			
			// целевые экранные координаты для плитки
			var x = tileSize * ( px * tiles_per_dimension[0] + tx ) + x0;
			var y = tileSize * ( py * tiles_per_dimension[1] + ty ) + y0;

			var el = tile[i];
			if ( scale_mul != 1 )
			{
				x = ptZoom[0] + ( x - ptZoom[0] ) * scale_mul;
				y = ptZoom[1] + ( y - ptZoom[1] ) * scale_mul;				
			}
			if ( lastScaleMul == scale_mul )
			{				
				// если примерно* совпало, двигать не надо, рисунок менять тоже не надо.
				// *точно оно никогда не сопадет - это же float'ы
				if( Math.abs(tilePlace[i][0] - x) < 2 && Math.abs(tilePlace[i][1] - y) < 2 )
					continue;				
			}
			var els = el[0].style
			els.left = x+"px";
			els.top = y+"px";
			els.height = Math.ceil(tileSize*scale_mul)+"px";
			els.width = Math.ceil(tileSize*scale_mul)+"px";
			tilePlace[i][0] = x
			tilePlace[i][1] = y;
			// осталось понять, какой будет картинка на новом месте (мировые координаты левого-верхнего угла)
			var w0 = ww[0] + tileSize*zoom[scale].mpp * ( px * tiles_per_dimension[0] + tx );
			var w1 = ww[1] - tileSize*zoom[scale].mpp * ( py * tiles_per_dimension[1] + ty );				
			var newsrc = getSrcForCoordinate( w0, w1, scale, i ); 
	
			if ( -1 == el[0].src.indexOf( newsrc ) )
			{
				el[0].src = newsrc;
				// Вот как я узнаю, будет IE картинку грузить или возьмет из памяти (и не позвовет онлоад)?
				if( !$.browser.msie ) 
					el[0].style.display = "none"; 
			}
			
		}
		lastScaleMul = scale_mul;
	}
	
	this.setupTileLayout = function( dds, transform ) {
		var tileSizeMeters = tileSize*zoom[scale].mpp;
		// Рассмотрим точку, принадлежащую нулевой плитке, экранные координаты будут преобразованы в мировые:
		var w = [ -dds[0], -dds[1] ];					
		transform.toWorld_m( w );
		// сделать копию
		var m = w.slice();
		// m = расстояние от угла плитки до точки W в мировых координатах
		m[0] = ( w[0] - zoom[scale].x0 ) - Math.floor( ( w[0] - zoom[scale].x0 ) / tileSizeMeters ) * tileSizeMeters;
		m[1] = ( w[1] - zoom[scale].y0 ) - Math.floor( ( w[1] - zoom[scale].y0 ) / tileSizeMeters ) * tileSizeMeters;
		
		// Отмечаем точку 0 в углу нулевой плитки (экранные координаты)
		x0 = -m[0] / zoom[scale].mpp - dds[0];
		y0 = m[1] / zoom[scale].mpp - dds[1];
		
		ww[0] = w[0] - m[0];
		ww[1] = w[1] - m[1];
		
		return;
	}
	
	this.hide = function() { div.hide(); }
	this.show = function() { div.show(); }
	this.css = function() { div.css( arguments[0], arguments[1] ); } 

	// Filename for tile containing the point
	function getSrcForCoordinate( x, y, scale )
	{
		var szs = zoom[scale];
		var tile_side = szs.mpp * tileSize;
		var tx = Math.round(( x - szs.x0 ) / tile_side);
		var ty = -Math.round(( y - szs.y0 ) / tile_side);
		
		var domain = 'http://k' + (1 + tx%2 + 2*(ty%2)) + '.';  
		
		if ( x >= szs.x0 - tile_side && y <= szs.y0 + tile_side ) 
			return domain + szs.file + utils.letterMath.add( szs.l, ty ) + utils.numberMath.add( szs.i, tx ) + ".png"
		else
			return "undefined.map" + "?x="+x+"&y="+y+"&s="+scale + ( arguments.length > 3 ? "&i="+arguments[3] : "" ) ;
	}		
	
	this.clear = function() 
	{
		div.empty();
		for( var i = 0; i < tile.length; i++ )
			tile[i] = null;
		tile = [];
		tilePlace = [];	
	}

	this.setScale = function( _scale )
	{
		scale = _scale;
		scale_mul = 1;
	}
	this.getScale = function() { return scale; } 
	
	function createTile( i )
	{
		var elmt = $('<img>');
		utils.makeUnselectable.apply( elmt[0] );
		
		// elmt.ready( elmt.show() ); ??? mayne this is the key to Yandex-maps no-flickering... Google does live without it.
		
		// Ахтуин и алёрт! 
		// Эксплорер не делает онлоад всякий раз, когда меняется картинка. 
		// Остальные браузеры не страдают такой ...
		
		elmt[0].onload = function(){ 
			this.style.display = "block"; 
		};
		tile.push( elmt );
		tilePlace.push([0,0]);
		return elmt; 
	}
}