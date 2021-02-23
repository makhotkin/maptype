/* Баббл для юзер-инфо */
;function CUserBubble( $, settings )
{
	var settings = $.extend( {
		fadeTimeout: 10
	}, settings ) 
		
	var t = this;
	var uname = 0;
	var popup_shown = false;
	var message_shown = false;

	var isShownToFriend = false;
	var bubble = $("#user-bubble");

	var overBubble = false;
	var overUser = false;
	var tToFade = 0;
	
	var pos = [0,0];
	var size = [0,0];

	function userMouseOut( e )
	{
		overUser = false;
		tToFade = settings.fadeTimeout;
	}

	function userMouseOver( e )
	{
		overUser = true;
		if ( message_shown ) return;
		var uname_now = this.id.match(/^user_(\w{2,30})$/);
		if ( !uname_now ) return false;
		
		if ( popup_shown && uname_now[1] == uname ) return;
		var elmt = $(this);
		var point = [ e.pageX-5, e.pageY-5 ];
		t.showFor( uname_now[1], point, elmt.hasClass('friend'), elmt.hasClass('wannabe'), elmt.hasClass('shown') )
	}

	this.showFor = function( name, point, isFriend, wantsToBeFriend, bVisible )
	{
		pos = point;
		uname = name;
		$("#userNameBubble, #userNameSendMesasge").html(name);
		$("#userNameBubble").parents('a')[0].href = '/profile/'+uname
		isShownToFriend = bVisible
		
		bubble.css({
			visibility: "visible",
			left: point[0],
			top: point[1]
		});
		size[0] = bubble.width();
		size[1] = bubble.height();
		
		overBubble = true;
		popup_shown = true;

		var t = $(this)
		if( isFriend )
		{
			$("#user-bubble_add").hide();
			$("#user-bubble_hide").show();
			$("#user-bubble_hide > a").text( L(isShownToFriend ? "USER_HIDE_FROM" : "USER_SHOW_TO" ));
			$("#user-bubble_delete").show();
			$("#user-bubble_delete > a").text( L("USER_DELETE_FRIEND") );
		} else {
			$("#user-bubble_add").show();
			$("#user-bubble_hide").hide();
			if ( wantsToBeFriend )
			{
				$("#user-bubble_delete").show();
				$("#user-bubble_delete > a").text( L( "USER_REJECT_FRIEND" ) );
			}
			else
			{
				$("#user-bubble_delete").hide();
			}
		}
	}
	
	function hide()
	{
		bubble.css({visibility: "hidden"});
		popup_shown = false;
		overBubble = false;
	}
	

	
	function onSelfToggleVisible()
	{
		hide();
		if ( isShownToFriend )
		{
			_mt.profile.friends.hideFrom( uname );
			$("#user_"+uname).removeClass('shown');
		}
		else
		{
			_mt.profile.friends.showFor( uname );
			$("#user_"+uname).addClass('shown');
		}
		return false;
	}
	
	function onAddFriend()
	{
		hide();
		_mt.profile.friends.add( uname );
		$("li > #user_"+uname).remove();
		return false;
	}
	
	function onFriendDelete()
	{
		// if in friends list $("#user"+uid).remove();
		
		hide();
		_mt.profile.friends.remove( uname );
		$("li > #user_"+uname).remove();
		return false;
	}
	
	function onWriteMessageTo()
	{
		hide();
		message_shown = true;
		$('#textFromPopup').val( '' )

		$("#user-bubble_message").css({
			visibility: "visible",
			top: pos[1],
			left: pos[0]
		});
		return false;
	}

	function onCancelMessage()
	{
		$("#user-bubble_message").css('visibility','hidden');
		message_shown = false;
		return false;
	}
	
	function onSendMessage()
	{
		message_shown = false;
		$("#user-bubble_message").css('visibility','hidden');
		var txt = $('#textFromPopup').val();
		var subj = $('#subjFromPopup').val();
		_mt.profile.friends.sendMessage( uname, txt, subj ) 
		return false;
	}
	
	this.onMouseMove = function( mouse, target, ev )
	{
		if ( !popup_shown || overUser )
			return;
		
		overBubble = ( mouse[0] >= pos[0] && mouse[1] >= pos[1] && mouse[0] <= pos[0] + size[0] && mouse[1] <= pos[1] + size[1])
	}
	
	this.onTick = function()
	{
		if ( !popup_shown || overBubble || overUser )
			return;
		
		if ( tToFade <= 0 ) 
			hide();
		else 
			tToFade--;
	}

	this.resetHandlers = function()
	{
		$("a.user").mouseover(userMouseOver).mouseout(userMouseOut);
	}
	
	function ctor()
	{
		$("#user-bubble_write").click( onWriteMessageTo );
		$("#user-bubble_hide").click( onSelfToggleVisible );
		$("#user-bubble_add").click( onAddFriend );
		$("#user-bubble_delete").click( onFriendDelete );
		
		$("#cancelPopupMessage").click( onCancelMessage )
		$("#sendMessgeFromPopup").click( onSendMessage );
	}
	ctor();
}