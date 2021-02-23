;function CMapCtrl( $, settings ) {
	var STATE_CAPTURE = 3;
	var STATE_ADD = 2;
	var STATE_EDIT = 1;
	var STATE_NONE = 0;
	
	var CLASS_EDITING = "editing";
	var CLASS_ADDING = "adding";
	var CLASS_CAPTURE = "capture";
	var CLASS_SEL_MARKS = "sel-mark";
	
	var state = STATE_NONE; 
	var markSelected = 0;
	var markLastSelected = 0;
	var markX = 0;
	var markY = 0;
	
	var editForm = $("#editPoint");
	var pointCaption = $("#editPointText");
	var cboLocations = _mt[settings.locations];
	var flag = $('#markSelfOnMap');
	var ctrlPanel = $("#map-ctrl-panel");
	var isFlagClosed = false;
/////////////////////////////////////////////////////////////////////////////////////	
	// called from inside of map_marks 
	this.onBookmarkClick = function( id, d, wXY, vis )
	{
		id = parseInt( id );
		if ( id == markSelected ) {
			if ( state == STATE_EDIT )
			{
				onPointEdit();
				return;
			}
			// else	
			state = STATE_EDIT;
			editForm.addClass(CLASS_EDITING).removeClass(CLASS_ADDING);
			editForm.css(wXY).show(); // .appendTo( object );
			pointCaption.val(d);
			map.planNotification( onEditPointClose );
			return;
		}
		else if ( state == STATE_EDIT )
			onPointEdit();
		onBookmarkChange( id, !vis, true )
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onBookmarkChange( id, bUpdateMap, bUpdateCombo, bSkipServerNotify, bDoNotScroll )
	{
		markSelected = id;
		if ( id ) 
			markLastSelected = id
		if ( bUpdateCombo ) cboLocations.select(id);
		if ( bUpdateMap ) 
		{	
			map.marks.bookmarkActivate( id );
			var dest = map.marks.getBookmarkCoordinates( markSelected );
			if ( dest != null && !bDoNotScroll ) map.scrollTo( dest[0], dest[1] );
		}
		if ( !bSkipServerNotify && _mt.isLoggedIn() )
			$.post( "/points/switch", "id="+id );
		updateList();
		
		ctrlPanel[id?"removeClass":"addClass"](CLASS_SEL_MARKS);
		$( "#setLocations", ctrlPanel )[markLastSelected?"removeClass":"addClass"]("fe-button-disabled")
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onCapture( wXY, scrXY ){
		state = STATE_ADD;
		markX = wXY[0];
		markY = wXY[1];
		pointCaption.val(L("LOCATION_UNNAMED"));

		editForm.removeClass(CLASS_EDITING).addClass(CLASS_ADDING);
		editForm.css({left: scrXY[0], top: scrXY[1]}).show().appendTo("#map-cover-abs");
		map.planNotification( onEditPointClose );
		ctrlPanel.removeClass(CLASS_CAPTURE);
	}
/////////////////////////////////////////////////////////////////////////////////////
	function addObject() 
	{ 
		function onObjectAdded( wXY, scrXY ) {
			var x = Math.round(wXY[0]);
			var y = Math.round(wXY[1]);
			window.location.href='/core:object:add'+x+'-'+y;
		}
		map.captureMark(onObjectAdded);
		return false;
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onAddLocation() 
	{
		map.captureMark(onCapture);
		ctrlPanel.addClass(CLASS_CAPTURE);
		state = STATE_CAPTURE;
		updateFlag();
		updateList();
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onAddLocationCancel( ev ) 
	{
		map.captureMarkCancel(onCapture);
		ctrlPanel.removeClass(CLASS_CAPTURE);
		state = STATE_NONE;
		updateFlag();
		ev && ev.stopPropagation();
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onKeyPressed( ev )
	{
		if ( ev.keyCode == 13 ) onSomeActionPoint( ev );
		if ( ev.keyCode == 26 ) onEditPointClose( ev );
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onSomeActionPoint( ev ) 
	{
		return state == STATE_EDIT ? onPointEdit() : onPointAdd( ev );
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onPointEdit(){
		var txt = pointCaption.val();
		var oldtxt = map.marks.getMarkText( markSelected );
		var id = markSelected;
		// Нужно оставить вызов внутри замыкания, чтобы сохранить id
		function hideEditor()
		{
			state = STATE_NONE;
			map.planNotification( null );
			editForm.fadeOut();
		}
		// к моменту возврата ajax-вызова markSelected уже может измениться
		if ( txt == oldtxt ) 
		{
			hideEditor();
			return;
		}
		
		if ( txt == '' ) return;
		map.marks.setBookmarkText( id, txt );
		cboLocations.get( markSelected ).text( txt );
		cboLocations.select( markSelected );

		if ( _mt.isLoggedIn() ) {
			$.post( '/points/edit', { name: txt, id: markSelected }, hideEditor	);
		} else {
			var xy = map.marks.getMarkCoordinates( 1 );
			utils.setCookie( 'myLoc', xy[0]+','+xy[1]+','+encodeURIComponent( txt ), 3 );
		}
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onPointDelete() 
	{
		var id = markSelected;
		function afterPointDelete()
		{
			editForm.appendTo("#map-cover-abs").hide();
			map.marks.removeBookmark( id );
			cboLocations.removeElement( id );
			map.planNotification( null );
			markLastSelected = 0;
			onBookmarkChange( 0, false, false, true );
		}
		if ( state == STATE_EDIT )
		{
			updateFlag();
			if ( _mt.isLoggedIn() )
				$.post( '/points/remove', { id: id }, afterPointDelete );
			else
			{
				utils.setCookie( 'myLoc', '', -1 );
				afterPointDelete();
			}
		}
		else
			onEditPointClose();
		return false;
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onPointAdd()
	{
		var x = Math.round(markX);
		var y = Math.round(markY);
		var txt = $("#editPointText").val();
		if ( txt == '' ) return;

		function afterPointAdd( msg )
		{
			map.marks.addBookmark( msg, x, y, txt );
			cboLocations.addElement( msg, txt );
			editForm.fadeOut();
			onBookmarkChange( msg, true, true, true, true );
		}
		
		if ( _mt.isLoggedIn() )
			$.post( '/points/add', { name: txt, x: x, y: y }, afterPointAdd );
		else 
		{
			map.marks.removeBookmark(1);
			cboLocations.clear();
			afterPointAdd( 1 );
			utils.setCookie( 'myLoc', x+','+y+','+encodeURIComponent( txt ), 3 );
		}
	}
/////////////////////////////////////////////////////////////////////////////////////
	this.onMiscEvent = function( opcode, value )
	{
		if ( opcode != 'radiiButton' ) return;
		$("#toggleRadii")[0].disabled = value;
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onEditPointClose()
	{
		editForm.fadeOut();
		updateFlag();
		state = STATE_NONE;
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onToggleFriends()
	{
		var bActive = map.marks.toggleFriends(); // True = visible
		var tt = L("FRIENDS_TOGGLE")[bActive?1:0] 
		$("#toggleFriends")[bActive?"addClass":"removeClass"]('fe-button-pressed').attr('title', tt );
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onToggleMarks()
	{
		var bActive = map.marks.toggleMarks();
		var tt = L("MARKS_TOGGLE")[bActive?1:0] 
		$("#toggleMarks")[bActive?"addClass":"removeClass"]('fe-button-pressed').attr('title', tt );
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onToggleRadii()
	{
		var bActive = map.marks.toggleRadii();
		var tt = L("RADII_TOGGLE")[bActive?1:0] 
		$("#toggleRadii")[bActive?"addClass":"removeClass"]('fe-button-pressed').attr('title', tt );
	}
/////////////////////////////////////////////////////////////////////////////////////
	function updateFlag( bSkipFade )
	{
		var nMarks = map.marks.getBookmarkCount();
		var bShouldHide = state == STATE_CAPTURE || nMarks;
		var bVisible = flag[0].style.display != 'none';
		if ( isFlagClosed ) bShouldHide = true;
		
		if ( bShouldHide && bVisible )
			flag[bSkipFade?"hide":"fadeOut"]();
		
		if ( !bShouldHide && !bVisible )
			flag[bSkipFade?"show":"fadeIn"]();
			
	}
/////////////////////////////////////////////////////////////////////////////////////
	function updateList()
	{
		if( map.marks.getBookmarkCount() == 0 )
		{
			cboLocations.clear();
			cboLocations.addElement( 0, L("LOCATIONS_NOT_DEFINED"), true );
			$('#reseLocations').addClass('fe-button-disabled');
		}
		else
		{
			cboLocations.removeElement( 0 );
		}
		
		if ( 0 == markSelected )
		{
			$('#resetLocations').addClass('fe-button-disabled');
			cboLocations.setText( L("LOCATIONS_EMPTY") );
			cboLocations.deselect();
		}
		else
			$('#resetLocations').removeClass('fe-button-disabled');
	}	
/////////////////////////////////////////////////////////////////////////////////////
	function onSetLocation( ev ) 
	{
		if ( this.className.indexOf('disabled') >= 0 ) return;
		onBookmarkChange( markLastSelected, true, true );
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onResetLocation( ev ) 
	{
		if ( this.className.indexOf('disabled') >= 0 ) return;
		onBookmarkChange( 0, true, true );
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onLocationChange( id )
	{
		if ( state == STATE_CAPTURE )
			onAddLocationCancel();
		onBookmarkChange( id, true, false );
	}
/////////////////////////////////////////////////////////////////////////////////////	
	function onCloseFlag( ev )
	{
		isFlagClosed = true;
		updateFlag();
		
		ev.preventDefault();
		ev.stopPropagation();
		return false;
	}
/////////////////////////////////////////////////////////////////////////////////////
	function onShowPoint()
	{
		if ( markSelected )
		{
			var dest = map.marks.getBookmarkCoordinates( markSelected );
			var scale = map.getScale();
			if ( scale > 3 ) scale = 3;
			map.scrollTo( dest[0], dest[1], scale );
		}
	}
/////////////////////////////////////////////////////////////////////////////////////
	function ctor()
	{
		cboLocations.addListener( "change", onLocationChange );
		$("#editPointClose").click( onEditPointClose );
		$('#addLocationLink').click( onAddLocation );
		$('#markSelfOnMap').click( onAddLocation );
		$('#addLocationCancel').click( onAddLocationCancel );		
		$("#editPointOk").click( onSomeActionPoint );
		$("#editPointMapPlace").click(onSomeActionPoint);
		$("#editPointDelete").click(onPointDelete);
		$("#editPointText").keypress(onKeyPressed);
		$("#resetLocations").click( onResetLocation );
		$("#setLocations").click( onSetLocation );
		$("#objectAdder").bind( 'click', addObject );			
		$("#toggleFriends").bind( 'click', onToggleFriends );
		$("#toggleRadii").bind( 'click', onToggleRadii );
		$("#toggleMarks").bind( 'click', onToggleMarks );
		$("#markSelfCloseFlag").bind( 'click', onCloseFlag );
		$("#toggleRadii")[0].disabled = map.marks.isRadiiDisabled();

		editForm.click( sp );
		$("#editPoint").mouseup(sp).mousedown(sp);
		
		_mt.history.addCommand( "showPoint", { e: onShowPoint } );

		// read cookie returned back
		if ( settings.cookie_mark )
		{
			var x = parseInt( settings.cookie_mark[0] );
			var y = parseInt( settings.cookie_mark[1] );			
			var txt = decodeURIComponent( settings.cookie_mark[2] );
			var active = settings.cookie_mark[3] ? parseInt( settings.cookie_mark[3] ) : 0;
			map.marks.addBookmark(1, x, y, txt, active);
			cboLocations.addElement( 1, txt );
		}
		markSelected = map.marks.getActiveBookmark();
		if ( markSelected )
		{
			onBookmarkChange( markSelected, false, true, true );
		}
		
		updateFlag(true);
		updateList();
	}
/////////////////////////////////////////////////////////////////////////////////////	
	ctor();
}
