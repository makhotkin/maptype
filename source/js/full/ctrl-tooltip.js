// JavaScript Document
;function CTooltip( $, settings ) {
//////////////////////////////////////////////////////////////////////////////	
	var bfShown = 0;
	var bShownThisTime = 0;
	var lastTrigger = -1;
	
	// Триггеры для тултипов на наведение мыши: решено привязаться на документ, 
	// ибо элементы могут рождаться и умирать от аякса
	// event, selector, id_tt, onlyGuest
	var triggaz = [ 
		[ "click", "#editPointOk", 1 ],
		[ "click", "li#favour", 3 ]
	];

	var tooltip = [
		[ "После регистрации, вы получите возможность планировать события, сохранять свои локации, добавлять друзей, получать рекомендации о событиях и местах.", [-80, 0], "#banner2" ],
/*1*/	[ "Локации сохраняются только у зарегистрированных пользователей.", [0, -50], "#editPointOk" ],
		[ "Показывает ближайшие объекты к вашей последней выбранной локации.", [-230, 0], '#content'],
		[ "Здесь будут отображаться места, в которых проходят запланированные вами события и места, которые вы сами добавили в любимое.", [200, 120] ],
/*4*/	[ "Вы можете добавить событие в свое личное расписание.", [-230, -60], 'elmt' ],
		[ "Вы можете удалить событие из своего расписания.", [-230, -60], 'elmt' ],
/* 6-8 cutom text: object/place added/removed */ [],[],[]
	];
	
	var ttClass = 'ttip';

	var handler = [];

//////////////////////////////////////////////////////////////////////////////	
	function onEvent( index, elmt, customText )
	{
		if ( bShownThisTime & (1<<index) )
			return; 
		
		lastTrigger = index;
		var tt = tooltip[index];
		var rel = tt[2] == "elmt" ? elmt : (tt[2] || null);
		_mt.msgbox.show( customText || tt[0], ( customText ? 1 : 0 ) + _mt.msgbox.TOOLTIP, onClose, tt[1], rel );
		
		// make me unsee that
		bShownThisTime |= 1 << index;		
	}
///////////////////////////////////////////////////////////////////////////////	
	this.onMiscEvent = function( opCode )
	{
		if ( opCode == 1 )
			onEvent( arguments[2] );
	}
//////////////////////////////////////////////////////////////////////////////
	this.showTooltip = function( index, elmt, customText )
	{
		onEvent( index, elmt, customText || null );
	}
//////////////////////////////////////////////////////////////////////////////			
	function trigger(id )
	{
		return function( ev ){ return onEvent( id, this ) };
	}
//////////////////////////////////////////////////////////////////////////////
	this.onUnload = function()
	{
		var cdate = new Date ( 2012, 12, 21 );
		var toSet = "tooltips= "+bfShown+"; expires= "+cdate.toGMTString()+"; path=/";
		document.cookie = toSet;		
	}
//////////////////////////////////////////////////////////////////////////////
	function onClose( result )
	{
		switch ( result )
		{
			case _mt.msgbox.OK:
				bfShown |= 1 << lastTrigger;
				break;
			case _mt.msgbox.NO_MORE_TIPS:
				bfShown = -1;
				break;
		}
	}
//////////////////////////////////////////////////////////////////////////////	
	function ctor() 
	{
		// read cookies for shown tts
		bfShown = utils.getCookie('tooltips') || 0;
		// регистрированным не надо показывать подсказки с 0 по 3-ю
		if ( _mt.isLoggedIn() ) bfShown |= 15;
		
		bShownThisTime = bfShown;

		$(document).bind( "mouseover", onMouseOver );

		for( var i = 0; i < triggaz.length; i++ )
			if ( !( bfShown & (1 << triggaz[i][2]) ) && triggaz[i][1] )
			{
				handler[i] = trigger(triggaz[i][2])
				$(triggaz[i][1]).bind( triggaz[i][0], handler[i] );
			}
	//	$('a', settings.tooltip ).click( onClose );
	//	$(settings.btnOk).click( onCloseOk );
	//	$(settings.classify).addClass( 'tooltip' );
	}
//////////////////////////////////////////////////////////////////////////////	
	function onMouseOver( ev )
	{
		ev = ev || window.event;
		var target = ev.srcElement || ev.target;
		var cName = target.className;
	
		var idxClass = cName.indexOf( ttClass );
		if ( -1 == idxClass )
			if ( target.parentNode && ( cName = target.parentNode.className ) )
			{
				target = target.parentNode
				idxClass = cName.indexOf( ttClass );
				if ( -1 == idxClass )
					if ( target.parentNode && ( cName = target.parentNode.className ) )
					{
						target = target.parentNode
						idxClass = cName.indexOf( ttClass );
						if ( -1 == idxClass )
							return;
					}
					else	
						return;
			}
			else	
				return;
		
		var index = parseInt( cName.substring( idxClass + ttClass.length ) );
		if ( bShownThisTime & 1 << index ) 
			return;
		onEvent( index, target );
	}
//////////////////////////////////////////////////////////////////////////////	
	ctor();
}