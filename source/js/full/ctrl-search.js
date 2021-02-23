// JavaScript Document

;function CSearcher( $, settings )
{
	var inProfile = window.location.pathname.indexOf( '/profile' ) != -1;
	
	function onDataReceived( msg )
	{
		$(settings.searchResults).html(msg);
	}
////////////////////////////////////////////////////////////////////	
	function onSearchLaunched()
	{
		var txt = $(settings.searchInput).val();
		if ( inProfile ) 
		{
			$('#search_form').submit();
			return;
		}
		
		if (txt!=''){
			_mt.history.registerAction("search|"+txt);
		}
		else {
			_mt.msgbox.show('Чтобы найти что-нибудь, поле поиска не должно быть пустым');
		}
	}
////////////////////////////////////////////////////////////////////////	
	function searchFor( txt )
	{
		$(settings.searchResults).html('<ins class="preloader"></ins>');
		$.post( '/search_engine', { 'search': txt }, onDataReceived );		
	}
////////////////////////////////////////////////////////////////////////	
	function ctor()
	{
		$(settings.searchInput).keydown(
			function(e){
				if (e.keyCode==13) 
				{
					onSearchLaunched();
					e.preventDefault();
				}
			}
		);
		$(settings.searchButton).click( onSearchLaunched );	
		
		if( settings.search_term )
			searchFor( settings.search_term );
	}
////////////////////////////////////////////////////////////////////////	
	ctor();
}

