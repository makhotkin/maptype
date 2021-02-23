///////////////////////////////////////////////////////////////////////////////////////////
;function CHistoryCommand( $, settings )
{
	var _t = this;
	var command = { 
			locRef: { target:'#content', url:"$1", params: 1, method: 'get' },
			objRef: { target:'#content', url:"$1", params: 1, method: 'get' },
			tabula: { e: execTabulator },
			reset : { e: executeReset },
			reload: { e: executorReload },
			search: { target:'#content', url: '/search_engine', params: ['search','tab','page'] },
			proTab: { target:'#profile_center', url: '/profile/$1', params: 1, tabs: '#profileTabs a', method: 'get', beforeLoad: proTabBeforeLoad },
			calTab: { url: '$1', params: 1, target:'#calMonth', tabs:'#eveTabs li', method: 'get', beforeLoad: calTabBeforeLoad },
			monGet: { url: '$1', params: 1, target:'#calMonth', method: 'get'},
			
			objTab: { target:'#center_content', url:"$1", params: 1, method: 'get', tabs: "#content ul.submenu1 a", beforeLoad: objTabBeforeLoad  },
			objDay: { target:'#center_content', url:"$1", params: 1, method: 'get' },
			letter: { target:'#objectSearch', url: '$2letter', params: ['letter', 2], hide:'#pages', tabs:'#letterSoup a', afterLoad: lettersAfterLoad },
			eveAdd: { url: '/profile/{uname}/event/add/$1', params: 1, loading:"EVENT_ADDING", afterLoad: _mt.rating.eventAddAfterLoad, method: 'get' },
			eveDel: { url: '/profile/{uname}/event/ban/$1', params: 1, loading:"EVENT_DELETING", afterLoad: _mt.rating.eventDeleteAfterLoad, method: 'get' },
			locAdd: { url: '/profile/{uname}/object/add/$1', params: 1, loading:"OBJECT_ADDING", beforeLoad: _mt.rating.addFavBeforeLoad, afterLoad: _mt.rating.addFavAfterLoad, method: 'get' },
			locDel: { url: '/profile/{uname}/object/ban/$1', params: 1, loading:"OBJECT_DELETING", beforeLoad: _mt.rating.delFavBeforeLoad, afterLoad: _mt.rating.delFavAfterLoad, method: 'get' },
			catFav: { url: '$1', params:1, method: 'get', target:"#obj_result" },
			msgbox: { url: '$1', params:1, method: 'get', target:"#list_place", tabs: "#menu_place li", afterLoad: msgAfterLoad },
			fract : { url: '$1', params:1, method: 'get', target: '#friends'},
			
			lastitem:{}
		};
	var isFirstLoad = true;
	
	var fromChangeWeCome = false;
	/////////////////////////////////////////////////////////////////////////////	
	function ctor()
	{
		$.historyInit( pageload );
		isFirstLoad = false;
	}
	/////////////////////////////////////////////////////////////////////////////
	function pageload( hash )
	{
		if ( hash > "#" || !isFirstLoad )
			parseAndExecute( hash );
	}
	///////////////////////////////////////////////////////////////////////////////
	this.addCommand = function( code, theStructure )
	{
		if( code in command ) return;
		command[code] = theStructure; 
	}
	///////////////////////////////////////////////////////////////////////////////
	this.registerAction = function ( hash )
	{
		fromChangeWeCome = true;
		$.historyLoad( hash );
	}
	///////////////////////////////////////////////////////////////////////////////
	function parseAndExecute( hash )
	{
		if ( '' == hash )
			execute( command["reset"], [ window.location.pathname ] );
		else
		{
			var ptPipe = hash.indexOf("|");
			if ( -1 == ptPipe ) return false;
			var opcode = hash.substr(0,ptPipe);
			if ( !opcode || opcode.length < 2 ) return false;
			return ( opcode in command ) && execute( command[opcode], hash.substr(1+ptPipe).split("|") );
		}
	}
	///////////////////////////////////////////////////////////////////////////////
	this.directExecute = function( opcode, params )
	{
		return ( opcode in command ) && execute( command[opcode], params );
	}
	///////////////////////////////////////////////////////////////////////////////
	function execute( cmd, params ) 
	{
		if ( cmd.e )
		{
			cmd.e( cmd, params );
			return;
		}
		cmd.hide		&& $(cmd.hide).hide();
		cmd.show		&& $(cmd.show).show();
		cmd.tabs		&& $(cmd.tabs).removeClass("selected");
		
		if ( cmd.url )
		{
			var request = { data: {} };
			request.url = cmd.url.replace('{here}', window.location.pathname);
			request.url = request.url.replace( '{uid}', _mt.getUID() );
			request.url = request.url.replace( '{uname}', _mt.getUsername() );
			request.method = cmd.method == 'get' ? 'get' : 'post';
			if ( cmd.params )
				if ( typeof cmd.params == 'number' )
					for( var i = 0; i < cmd.params ; ++i )
						request.url = request.url.replace("$"+(i+1), params[i] || "");
				else
					for( var i = 0; i < cmd.params.length; ++i )
						if ( typeof cmd.params[i] != "number" )
							request.data[cmd.params[i]] = params[i] || "";
						else
							request.url = request.url.replace("$"+(i+1), params[i] || "");
			
			if ( cmd.target )
			{
				_mt.throwMiscEvent( "blockBeforeRemove", cmd.target );
				$(cmd.target).html('<ins class="preloader"></ins>');
			}
			
			var loadingId = params.toString().replace(/[|\s,]/g,'')
			cmd.loading && _mt.loading.add( loadingId, L(cmd.loading) )

			
			function onLoaded( data ) { 
				if( cmd.target )
				{
					$(cmd.target).html( data );
					window.pageTracker && window.pageTracker._trackPageview(request.url);
				}
				cmd.afterLoad && cmd.afterLoad(cmd, params, data);
				cmd.loading && _mt.loading.complete( loadingId, L(cmd.loading) );
			}
			if ( cmd.beforeLoad ) cmd.beforeLoad(request, cmd, params)
			$[request.method]( request.url, request.data, onLoaded );
			// Ненависть! Ненависть! Крутить свои глупые баннеры
			
			if ( $("#banner2 > iframe").length ) $("#banner2 > iframe")[0].src = $("#banner2 > iframe")[0].src
			if ( $("#banner1 > iframe").length ) $("#banner1 > iframe")[0].src = $("#banner1 > iframe")[0].src
		}
	}
	///////////////////////////////////////////////////////////////////////////////
	function lettersAfterLoad( cmd, params )
	{
		$(cmd.tabs+"[name="+params[0]+"]").addClass("selected");
	}
	///////////////////////////////////////////////////////////////////////////////
	function proTabBeforeLoad( query, cmd, params )
	{
		$("#"+params[1]).addClass("selected");
		query.url += "?"+Math.ceil(Math.random()*50000)
	}
	///////////////////////////////////////////////////////////////////////////////
	function objTabBeforeLoad( query, cmd, params )
	{
		$( "a[href$="+params[0]+"]", "#content ul.submenu1").addClass("selected");
	}
	///////////////////////////////////////////////////////////////////////////////
	function msgAfterLoad(cmd, params)
	{
		$( "li a[href$="+params[0]+"]" ).parent().parent().addClass("selected");
	}
	///////////////////////////////////////////////////////////////////////////////
	function calTabBeforeLoad(query, cmd, params)
	{
		$( "a[href$="+params[0]+"]", cmd.tabs ).parent().parent().addClass("selected");
		query.url += '/' + params[1];
	}
	///////////////////////////////////////////////////////////////////////////////
	function executeReset( opcode, params )
	{
		var url = params[0];
		var idxProfile = url.indexOf("/profile");
		if ( -1 == idxProfile )
			// Если не в профиле, загрузить снова глагне
			execute( command["locRef"], [ url ] );
		else
			// Если в профиле, сделать вид что мы снова открыли календарь.
			execute( command["proTab"], [ _mt.profile.getOwner() + "/calendar", "proCalendar" ] );
	}
	///////////////////////////////////////////////////////////////////////////////
	function execTabulator( cmd, params )
	{
		var tabClicked = params[0];
		var lastSelected = $( "a.selected", $(tabClicked).parents("ul.submenu1") );
		if ( lastSelected.length )
		{
			lastSelected.removeClass("selected");
			var oldBlock = utils.hash(lastSelected[0]);
			$("#"+oldBlock).hide();
		}
		if ( tabClicked )
		{
			tabClicked.className += " selected";
			var newBlock = utils.hash(tabClicked);
			$("#"+newBlock).show();
		}
	}
	///////////////////////////////////////////////////////////////////////////////	
	function executorReload( cmd, params )
	{
		if ( !isFirstLoad )
			return window.location.reload();
	}
	///////////////////////////////////////////////////////////////////////////////
	ctor();
}