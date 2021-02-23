var CLoading = function( $, settings )
{
	var holder = $( settings.holder );
	var list = $( 'ul', holder );
	var isVisible = false;
	var cntLoaders = 0;
	var loaderTimes = {};
	
	var ID_PREFIX = 'request';
	var liTemplate = "<li class=\""+settings.classLoading+"\" id=\""+ID_PREFIX+"$2\"><i class=\"status-icon\"></i><span>$1</span></li>";
	var liNotify = "<li class=\""+settings.classNotify+"\" id=\""+ID_PREFIX+"$2\"><i class=\"status-icon\"></i><span>$1</span></li>";
	
	var TIME_NOTIFY_EXPOSITION = 250;
	var TIME_COMPLETE_EXPOSITION = 70;
	// 1. added
	// 2. wait for reaction
	// 3. expose
	// 4. fadeout
	///////////////////////////////////////////////////////////////////////////////
	function hide() {
		isVisible = false;
		holder.hide();
	}
	///////////////////////////////////////////////////////////////////////////////
	function showLoader()
	{
		// 2. show loader
		cntLoaders++
		if ( !isVisible )
		{
			isVisible = true;
			holder.show();
		}
	}
	///////////////////////////////////////////////////////////////////////////////
	this.notify = function( contents ) 
	{
		var id = "notify"+Math.round( Math.random()*5000 );
		var ht = sprintf( liNotify, contents, id );
		list.prepend( ht );
		showLoader()
		loaderTimes[id] = TIME_NOTIFY_EXPOSITION;
	}
	///////////////////////////////////////////////////////////////////////////////
	this.add = function( id, contents ) {
		// 1. Add li
		var ht = sprintf( liTemplate, contents, id )
		var jqItem = $("#"+ID_PREFIX+id)
		if ( jqItem.length )
		{
			$('span', jqItem).html(contents);
			return;
		}
		list.prepend( ht );
		showLoader();
	}
	///////////////////////////////////////////////////////////////////////////////
	this.complete = function( id, new_text ) {
		doneLoader( id, settings.classComplete );
		if( new_text )
			$("span", "#"+ID_PREFIX+id).html(new_text);
	}
	///////////////////////////////////////////////////////////////////////////////
	this.fail = function( id ) {
		doneLoader( id, settings.classFailed );
	}
	///////////////////////////////////////////////////////////////////////////////	
	function doneLoader( id, clasz ) {
		// 1. switch class
		var elt = $("#"+ID_PREFIX+id);
		if ( elt.length )
			elt[0].className = clasz;
		// 2. set up timer to fade
		loaderTimes[id] = TIME_COMPLETE_EXPOSITION;
	}
	///////////////////////////////////////////////////////////////////////////////
	this.onTick = function()
	{
		for ( var i in loaderTimes )
		{
			if ( loaderTimes[i] ) loaderTimes[i]--;
			else
			{
				var id = i
				$("#"+ID_PREFIX+i).fadeOut( function() { afterExpose(id) } );
				delete loaderTimes[i];
			}
			
		}
	}
	///////////////////////////////////////////////////////////////////////////////
	function afterExpose( id ) {
		$("#"+ID_PREFIX+id).remove();
		cntLoaders--;
		if ( 0 == cntLoaders )
			hide();
	}
	///////////////////////////////////////////////////////////////////////////////
	function ctor() {
		
	}
	///////////////////////////////////////////////////////////////////////////////
	ctor();
}