;_mt.rating = {
	eventAddAfterLoad: function( cmd, params, response )
	{
		if ( response.match(/0/) )
		{
			if (_mt.profile) 
				_mt.profile.events.fadeOut( params[0] );
			_mt.tooltip.showTooltip(6, null, 'Событие перемещено в общий поток');
		}
		else if ( response.match(/1/) )
		{
			if (_mt.profile && _mt.profile.events.selected == "waste") 
				_mt.profile.events.fadeOut( params[0] );
			else
				_mt.tooltip.showTooltip(6, null, L("EVENT_ADDED"));
		}
		else
			_mt.msgbox.show('Случилась ошибка, и событие в Ваш календарь не добавлено :(');
	},
	///////////////////////////////////////////////////////////////////////////////	
	addFavBeforeLoad: function( cmd, request, params )
	{
		var total = $( "#profile_center a.cat_all ~ ins" );
		if ( total.length > 0 )
		{
			var obj = $("#object"+params);
			var bs = _mt.rating.readButtonState( obj );
			bs[1] = !bs[1];
			
			total.html( total.html() - (bs[0] ? -1 : 1) );
			var theLink = $( "#profile_center a."+obj[0].className.replace("promo ",'') + " ~ ins" );
			theLink.html( theLink.html() - (bs[0] ? -1 : 1) )
			
			var del = $( "#profile_center a.cat_del ~ ins" );
			del.html( del.html() - (bs[0] ? 1 : 0) )
		}
	},
	///////////////////////////////////////////////////////////////////////////////
	readButtonState: function( obj )
	{
		var isDel = false;
		var isAdd = false;
		var buttons = $( "button", obj );
		isDel = -1 != buttons[0].className.indexOf('remove-sel')
		isAdd = -1 != buttons[1].className.indexOf('add-sel')
		return [ isDel, isAdd ];
	},
	///////////////////////////////////////////////////////////////////////////////	
	delFavBeforeLoad: function( cmd, request, params )
	{
		var total = $( "#profile_center a.cat_all ~ ins" );
		if ( total.length > 0 )
		{
			var obj = $("#object"+params);
			var bs = _mt.rating.readButtonState( obj );
			bs[0] = !bs[0];
			
			total.html( total.html() - (bs[1] ? 1 : 0) );
			var theLink = $( "#profile_center a."+obj[0].className.replace("promo ",'') + " ~ ins" );
			theLink.html( theLink.html() - (bs[1] ? 1 : 0) );
			
			var del = $( "#profile_center a.cat_del ~ ins" );
			del.html( del.html() - (bs[0] ? 1 : -1) )
		}
	},
	///////////////////////////////////////////////////////////////////////////////	
	addFavAfterLoad: function( cmd, params, response )
	{
		_mt.tooltip.showTooltip(7, null, L("PLACE_ADDED") );
		if (_mt.profile) 
			_mt.profile.objects.fadeOut( params[0] );
	},
	///////////////////////////////////////////////////////////////////////////////	
	delFavAfterLoad: function( cmd, params, response )
	{
		_mt.tooltip.showTooltip(7, null, L("PLACE_REMOVED") );
		if (_mt.profile ) 
			_mt.profile.objects.fadeOut( params[0] );
	},
	///////////////////////////////////////////////////////////////////////////////	
	eventDeleteAfterLoad: function ( cmd, params, response )
	{
		var selPage = _mt.profile && _mt.profile.events.selected;
		if ( _mt.profile )
		{
			if ( selPage )
				_mt.profile.events.fadeOut( params[0] );
		}
		else
			_mt.tooltip.showTooltip(8, null, L("EVENT_REMOVED") );
	},
	
	///////////////////////////////////////////////////////////////////////////////////////////
	onRate: function( target )
	{
		var span = target.parentNode.getElementsByTagName('span')[0];
		var value = parseInt( span.innerHTML );
		var dir = ( 1 + target.className.indexOf( "-sel") ) ? +1: -1
		span.innerHTML = value + dir;
		for( var i = 5; i > 0; --i ) target = target.parentNode; 
		_mt.rating.updateRating.apply( target );
	},
	///////////////////////////////////////////////////////////////////////////////////////////
	updateRating: function()
	{
		var values = this.getElementsByTagName('span');
		if ( values.length < 2 ) return;
		values = [ parseInt('0'+values[0].innerHTML), parseInt('0'+values[1].innerHTML) ];
		if ( values[0] == values[1] ) values = [1,1];
		var weight = values[0] + values[1];
		var bars = $( "div.scale > div", this );
		bars[0].style.width = Math.round(100*values[0]/weight)+"%";
		bars[1].style.width = Math.round(100*values[1]/weight)+"%";
	}	
};