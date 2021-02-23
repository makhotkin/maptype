/* (c) 2008 Maxim Makhotkin
 * 
 * Developed for Lutic LLC
 *
 */
 
var CMsgBox = function( $, settings ) 
{
	var _t = this;
	// result
	this.NO_MORE_TIPS = -2;
	this.CLOSED = -1;
	this.NO = 0;
	this.YES = 1;	
	
	// type for creation
	this.OK = 0;
	this.YES_NO = 1;
	this.TOOLTIP = 2;
	this.TOOLTIP_SHADED = 3;
	
	var classes = ['event','confirm','tooltip','tooltip'];

	var myType = 0;
	
	var frame = $(settings.frame);
	var cmdOk = $(settings.btnOk);
	var cmdYes = $(settings.btnYes);
	var cmdNo = $(settings.btnNo);
	var cmdClose = $(settings.close);
	var checkbox = document.getElementById(settings.checkbox.substring(1));
	var setMyClass = $(settings.classify);
	var nativeClass = setMyClass[0].className;
	var textBox = $(settings.text);
	var teh_eclipse = document.getElementById( settings.clipse );
	
	var callAfterMessage = null;
	
	
	this.show = function( sText, eType, fnAfterCall, placeAt, rel )
	{
		// set window text
		textBox.html(sText);

		if ( eType < _t.OK || eType > _t.TOOLTIP_SHADED )
			return false;
		
		myType = eType || 0;
		setMyClass[0].className = nativeClass + ' '+ classes[myType];
		
		// under question
		if ( myType == _t.TOOLTIP ) checkbox.checked = false;
		callAfterMessage = typeof fnAfterCall == 'function' ? fnAfterCall : null;

		var place = { left: 0, top: 0, display: 'block' };
		if ( placeAt )
		{
			if ( rel )
			{
				var off = $(rel).offset();
				place.left = off.left;
				place.top = off.top;
			}
			place.left += placeAt[0];
			place.top += placeAt[1];
		}
		else
		{
			place.visibility = 'hidden';
		}
		frame.css( place );
		if ( !placeAt ) // поставить в центр!!11
		{
			var pageSize = utils.getPageSize();
			var elmt = frame[0];
			elmt.style.left = ( pageSize[0] - elmt.offsetWidth ) / 2;
			elmt.style.top = ( pageSize[1] - elmt.offsetHeight ) / 2;
			elmt.style.visibility = 'visible';
		}
		
		if ( myType != _t.TOOLTIP )
			teh_eclipse.style.visibility = 'visible';
		
		if ( myType != _t.YES_NO )
			$('button',cmdOk).focus();
	}
	
	function hide()
	{
		frame.hide();
		teh_eclipse.style.visibility = 'hidden';
	}
	
	
	function onClose()
	{
		hide();
		if ( callAfterMessage ) callAfterMessage( checkbox.checked ? _t.NO_MORE_TIPS : _t.CLOSED );
		return false;
	}
	
	function onYes()
	{
		hide();
		if ( callAfterMessage ) callAfterMessage( _t.YES );
	}
	
	function onNo()
	{
		hide();	
		if ( callAfterMessage ) callAfterMessage( _t.NO );		
	}
	
	function onOk()
	{
		hide();
		if ( callAfterMessage ) callAfterMessage( checkbox.checked ? _t.NO_MORE_TIPS : _t.OK  );		
	}
	
	function ctor( type )
	{
		cmdOk.click( onOk );
		cmdYes.click( onYes );
		cmdNo.click( onNo );
		cmdClose.click( onClose );
	}
	
	ctor();
}