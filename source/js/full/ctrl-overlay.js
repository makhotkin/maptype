// JavaScript Document

;function COverlay( $, settings )
{
	var container = null;
	var dataHolder = null;
	var dataHeight = 0;
	///////////////////////////////////////////////////////////////////////////////////////////	
	function onLinkActivated( ev )
	{
		var id = ev.target.id 
		if ( settings.links['#'+id] )
		{
			var href = settings.path+settings.links['#'+id];
			dataHolder.empty();
			// pwl is better here
			container.show();
			$.post( href, null, onDataReceived );			
		}
		return false;
	}
	///////////////////////////////////////////////////////////////////////////////////////////		
	function onClose()
	{
		container.hide();
		return false;
	}
	///////////////////////////////////////////////////////////////////////////////////////////		
	function onDataReceived( data ) 
	{
		dataHolder.html( data );
		
		var mySize = utils.getWindowClientAreaSize();
	}
	///////////////////////////////////////////////////////////////////////////////////////////		
/*
	this.show = function()
	{
		var docSize = utils.getPageSize();
		var wndSize = utils.getWindowClientAreaSize();
		shader.css('height', page[1] );
		
		// if !IE 6
		var contentWidth = 600;
		var contentHeight = wndSize[1] - 50;	
		
		container.css({left:-contentWidth/2,top:-contentHeight/2,width:contentWidth,height:contentHeight});
		
		// else
		// position: absolute;
		// top: expression(document.compatMode=="CSS1Compat"? document.documentElement.scrollTop+50+"px" : body.scrollTop+50+"px");
		// marginTop: 
	}
*/	
	///////////////////////////////////////////////////////////////////////////////////////////		
/*	function adjustSize( w, h )
	{
		var newH = h - 80;
		
		var dataFirstTag = dataHolder.children();
		dataHeight = dataFirstTag.length ? dataFirstTag.height() : 0;
		
		if ( dataHeight < newH ) newH = dataHeight;
		
		dataHolder.css('height', newH );		
	}
	///////////////////////////////////////////////////////////////////////////////////////////		
	this.onResize = function( w, h )
	{
		adjustSize( w, h );
	}*/
	///////////////////////////////////////////////////////////////////////////////////////////	
	function constructor()
	{
		container = $(settings.container);
		dataHolder = $(settings.dataHolder);
		for( var i in settings.links )
			$( i ).click( onLinkActivated );
		$(settings.closeButton).click( onClose );
		
	//	var mySize = utils.getWindowClientAreaSize();
	//	adjustSize( mySize[0], mySize[1] );
	}
	///////////////////////////////////////////////////////////////////////////////////////////
	constructor();
};

/*
$(document).ready(function(){
	$("#find_error_link").click(function(){
		$("#find_error").show();
	});
	
	function showInfo(referer, filename){
		$("#"+referer).click(function(){
			$("#popup").show();
			$.get(""+filename, function(data){
				$("#popup-content").html(data);
			});
			return false;
		});
	}
});
*/