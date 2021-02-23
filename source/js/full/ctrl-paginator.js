  ///////////////////////////////////////////////////////////////////////////////////////////
;function CPaginator( $, settings )
{
	///////////////////////////////////////////////////////////////////////////////////////////	
	function onPageSelect(elmt, parent )
	{
		if ( null == parent ) return;
		var options = parent.ondblclick();
		if ( options.hide ) $(options.hide).hide();
		if ( options.show ) $(options.show).show();
		if ( options.tabs ) { $(options.tabs).removeClass('selected'); elmt.className += ' selected'; }

		var body = elmt.name;
		if ( options.dest && ( options.url || elmt.href > "#/" ))
		{
			var url = options.url || elmt.href.substring(elmt.href.indexOf('#/')+1);
			var dest = options.dest;
			$(dest).html('<ins class="preloader">Идет загрузка</ins>');		
			function onReceived( msg ) { $(dest).html( msg ); }
			if ( url == '/refresh' ) { window.location.reload(); return }
			$['GET'==options.method?"get":"post"](url,body,onReceived);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	function catchComponentClick( ev )
	{
		if ( !ev ) ev = window.event;
		if ( 0 != ev.button )
			return true;
		var target = ev.srcElement || ev.target;
		
		if ( hasBoundLogic( target ) ) return pdf( ev );
		if ( !(target = target.parentNode) ) return true;
		if ( hasBoundLogic( target ) ) return pdf( ev );
		if ( !(target = target.parentNode) ) return true;
		if ( hasBoundLogic( target ) ) return pdf( ev );
		return true;
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	function hasBoundLogic( target )
	{
		if ( !target ) return false;
		var cn = target.className || "";
		if ( cn.indexOf( 'selected') >= 0) return true;

		if ( cn.indexOf('cmd-') >= 0 )
		{
			var code = cn.match(/cmd-([^\s]*)/)[1];
			var cmdQueue = code.split('-');
			
			var last_was_prefix = false;
			var params;
			// Очевидно, что если мы решили устроить тут еще и очередь, то использующих историю команд должно быть не больше одной 
			for( var i = 0; i < cmdQueue.length; i++ )
			{
				if ( !last_was_prefix ) params = [];
				
				last_was_prefix = true;
				switch( cmdQueue[i] )
				{
					case "lt": params = [ target ]; continue;
					case "lp": params = [ utils.path(target) ]; continue;
					case "lh": params = [ utils.hash(target) ]; continue;
					case "l": params = []; continue;
				}
				
				last_was_prefix = false;
				switch( cmdQueue[i] )
				{
					case "letter": params = [ target.name, utils.path(target) ]; break;
					case "rrrRef":
						cmdQueue[i] = "locRef";
						if ( _mt.rrr ) _mt.rrr.hide("Yes, I order you!");
						/* no break here */
					case "locRef": // обыяная ajax-ссылка
					case "objRef": // ссылка на объект - нужно после открытия показать на карте
						if ( $("#themap").length == 0 ) return false; 
						params = utils.path(target);
						if ( params.length == 0 ) return false;
						break;
					case "tabula": params = [ target ]; break;
					case "objDay": params = [ utils.path(target) ]; break;
					case "catFav": params = [ utils.path(target) ]; break;
					case "proTab": params = utils.hash(target)+"|"+target.id; break;
					case "calTab": params.push( $("#yearMonth")[0].className ); break;

					case "placeAdd":
						params = [ window.location.pathname.match(/object\/(\d{1,7})/)[1] ];
						break;
					case "eveAdd": case "locAdd":
						params = [ $(target).parents(".promo")[0].id.replace(/event|object/,'') ];
						$(target).toggleClass('add').toggleClass('add-sel');
						_mt.rating.onRate( target );
						break;
						
					case "eveDel": case "locDel":
						params = [ $(target).parents(".promo")[0].id.replace(/event|object/,'') ]; 
						$(target).toggleClass('remove').toggleClass('remove-sel');					
						_mt.rating.onRate( target );
						break;
				}
				if ( typeof params == "string" )
					_mt.history.registerAction( cmdQueue[i]+"|"+params );
				else
					_mt.history.directExecute( cmdQueue[i], params );
			}
			return true;
		}		
		
		// old fashion
		if ( target.tagName != 'A' ) return false;
		
		if ( 1+cn.indexOf('pg_d') )        onPageSelect( target, utils.findParentWithClass( target, 'paginator' ) );		
		else if ( 1+cn.indexOf('tab-') )    onPageSelect( target, utils.findParentWithClass( target, 'submenu' ) );		
		else return false;
		return true;
	}
	///////////////////////////////////////////////////////////////////////////////////////////	
	function constructor()
	{
		document.onclick = catchComponentClick;
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	constructor();
}

