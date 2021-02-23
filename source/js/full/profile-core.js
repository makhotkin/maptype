;var CProfile = function( $, settings ) 	
{
	var avatarPath = "/usr/pic/avatar/";
	var apiUrl = "/profile/"+_mt.getUID()+"/";
	var profile = this;
	
	var urlMy = "/profile/"+_mt.getUsername()+"/";
	var urlOwner = "/profile/" + ( ( settings && settings.owner ) || "" );  
	
	this.getOwner = function() { return settings && settings.owner; };
	this.isMyProfile = function() { return settings && settings.owner == _mt.getUsername(); }
	this.editPersonal = function() {
		$('#editPersonal').ajaxSubmit( { success: function( msg ){ _mt.msgbox.show( msg ); } });
	}

	function isImageFile(filename) {
		return filename.match(/(\.jpg|\.gif|\.jpeg|\.png)$/i)
	}

	this.uploadPhoto = function()
	{
		var input = $("input[name=photos]");
		var filename = input[0] && input[0].value
		if ( !filename ) return;
		if ( isImageFile(filename) )
		{
			var options={
				beforeSubmit: function(a,f,o){o.dataType = "html";},
				success: function(data) { $("#cur_photo")[0].src = avatarPath + data; }
			};
			$('#uploadPhoto').ajaxSubmit(options);
		}
		else
			_mt.msgbox.show(L("USER_PIC_WRONG_FORMAT"));
	}
	
	this.friends = {
		add: function ( uname )
		{
			_mt.loading.add(uname+'_add', L("FRIEND_ADDING") + uname  )
			$.get( urlMy + "friends/add/"+uname, function(msg){ 
				$(".main_left_content").html(msg);
				_mt.loading.complete(uname+'_add');
			});
		},
		
		hideFrom: function( uname )
		{
			_mt.loading.add(uname+'_hide', L("FRIEND_HIDING") + uname  )
			$.get( urlMy + "friends/hide_from/"+uname, function(){
				_mt.loading.complete(uname+'_hide');
			});
		},
		showFor: function( uname )
		{
			_mt.loading.add(uname+'_show', L("FRIEND_SHOWING") + uname  )
			$.get( urlMy + "friends/show_to/"+uname, function(){
				_mt.loading.complete(uname+'_show');
			});
		},
		remove: function( uname )
		{
			_mt.loading.add(uname+'_del', L("FRIEND_REMOVING") + uname  )
			$.get( urlMy + "friends/remove/"+uname, function(msg) { 
				_mt.loading[$.trim(msg) == "200" ?"complete":"fail"](uname+"_del");
				//_mt.msgbox.show( ? L("USER_FRIEND_REMOVED")  : "ошибка базы данных");
			});
		},
		reject: function( uname )
		{
			_mt.loading.add(uname+'_rej', L("FRIEND_REJECTING") + uname  )			
			$.get( urlMy + "friends/reject/"+uname, function(msg) { 
				_mt.loading[$.trim(msg) == "200" ?"complete":"fail"](uname+"_rej");
				//_mt.msgbox.show( $.trim(msg) == "200" ? L("USER_FRIENDSHIP_REJECTED") : "ошибка базы данных");
			});
		},
		sendMessage: function( uname, text )
		{
			function afterSend( msg )
			{
				_mt.loading[$.trim(msg) == "200" ?"complete":"fail"]("_send");
			}
			
			if ( typeof uname == "object" && uname.length )
			{
				_mt.loading.add('_send', L("SENDING_MSG") + uname.join(", ") );
				$.post( urlMy + "messages/masssend", { to: uname.join(","), text: text }, afterSend );
			}
			else
			{
				_mt.loading.add(uname+'_send', L("SENDING_MSG") + uname )
				$.post( urlMy + "messages/send/" + uname, { text: text }, afterSend );
			}
		}
	}
	
	this.messages = {
		receiver: 0,
		replyTo: 0,
		isNew : true,
		
		"delete": function( ev )
		{
			// do delete
			var dashPos = this.href.indexOf('#');
			var msgId = this.href.substring( dashPos + 1 );
			
			if ( msgId == profile.messages.replyTo )
			{
				// secure the reply form
				$("#newMessage").insertAfter($("#newMsgLink")).hide()[0].className = "new_message";
				$("#msgTo > option:eq(0)").select();
				profile.messages.replyTo = 0;
			}
			
			var obj = $("#message"+msgId);
			$.post( apiUrl + "messages", "num="+msgId, function(){
				obj.fadeOut(function(){ obj.remove(); });
			});
			return false;
		},

		reply: function()
		{
			var dashPos = this.href.indexOf('#');
			var msgId = this.href.substring( dashPos + 1 );
			var msgDiv = $("#message"+msgId);
			$("#newMessage").insertAfter(msgDiv).show()[0].className = "reply_message";
			var aAvatar = $("a.user", msgDiv)[0];
			var recieverUID = aAvatar.href.substring(aAvatar.href.indexOf('profile/')+8);
			profile.messages.receiver = recieverUID;
			profile.messages.isNew = false;
			profile.messages.replyTo = msgId;
			return false;
		},
		
		"new": function()
		{
			$("#newMessage").insertAfter($("#newMsgLink")).show()[0].className = "new_message";
			$("#msgTo > option:eq(0)").select();
			profile.messages.isNew = true;
		}
	};
	this.objects = {
		fadeOut: function( id )
		{
			$("#object"+id).animate({opacity:0,height:0},300,function(){this.style.display = 'none';});
		}			
	};
	
	var tplRecvSuggest = '<li><span class="b-user"><i><u><img src="/usr/pic/avatar/$1"/></u></i><b>$2</b></span></li>';
	var tplRecvTo = '<span class="b-user"><i><u><img src="/usr/pic/avatar/$1"/></u></i><b>$2</b><a class="cmd-lt-msgDelRecv">&times;</a></span>'
	
	var settings = $.extend( {
		fadeTimeout: 10
	}, settings ) 
		
	var t = this;
	var uname = 0;
	var popup_shown = false;
	var message_shown = false;

	var isShownToFriend = false;
	var isWannaBe = false;
	
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
		isWannaBe = wantsToBeFriend;
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
			if ( isWannaBe )
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
			profile.friends.hideFrom( uname );
			$("#user_"+uname).removeClass('shown');
		}
		else
		{
			profile.friends.showFor( uname );
			$("#user_"+uname).addClass('shown');
		}
		return false;
	}
	
	function onAddFriend()
	{
		hide();
		profile.friends.add( uname );
		if ( profile.isMyProfile() )
			$("#user_"+uname).remove();
		else
			$("#user_"+uname).toggleClass("friend");
		return false;
	}
	
	function onFriendDelete()
	{
		hide();
		var method = isWannaBe ? "reject" : "remove";
		profile.friends[method]( uname );
		if ( profile.isMyProfile() )
			$("#user_"+uname).remove();
		else
			$("#user_"+uname).toggleClass("friend");
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

	this.onFilterChange = function ()
	{
		var uname = $("#msgList option:selected").val();
		_mt.history.directExecute( "msgHistory", [ "/profile/messages/with/"+uname ] );
	}
	
	function onCancelMessage()
	{
		$("#user-bubble_message").css('visibility','hidden');
		message_shown = false;
		return false;
	}
	// suggestion code here
	var haveWisdom = false;
	var answer = {};
	var toRequest;
	var timerId = 0;
	var domLastSelected = null;

	function onItemSelected()
	{
		var id = $( 'b', this ).text();
		if ( $( "#recvList b:contains("+id+")" ).length ) 
			return;
		var ht = sprintf( tplRecvTo, answer[id], id );
		$("#recvList input").before(ht);
		loseWisdom();
		$("#recvList input").val('');
		toRequest = '';
	}
	
	function askSuggest( ev )
	{
		var kcCaught = true;
		switch( ev.keyCode ) 
		{
			case 13:
				domLastSelected && onItemSelected.call( domLastSelected );
				break;
			case 38: highliteSibling( -1 ); break;
			case 40: highliteSibling( +1 ); break;
			case 27: loseWisdom(); break;
			default:
				kcCaught = false;
		}

		var text = $("#recvList input").val();
		if ( text == toRequest || kcCaught ) return;
		toRequest = text;
		
		if ( timerId ) clearTimeout( timerId );
		if ( text == '' ) loseWisdom();
		else timerId = setTimeout( requestWisdom, 400 );
	}
		
	function requestWisdom()
	{
		$.post("/profile/friends/suggest","term="+toRequest,onOracleAnswered);
		timerId = 0;
	}
	
	function highliteItem() {
		if ( domLastSelected ) domLastSelected.className = ''; 
		domLastSelected = this;  
		domLastSelected.className = "hover"; 
	}
	
	function onLiClicked( ev )
	{
		ev.stopPropagation();
		ev.returnValue = false;
		onItemSelected.call( this );
	}
	
	function onOracleAnswered( text )
	{
		domLastSelected = null;
		haveWisdom = true;		
		var hintBox = $("#suggestRecv");
		answer = eval('('+text+")" )
		
		hintBox.empty();
		var hints = [];
		var isEmpty = true;
		for( var i in answer )
			hints.push( sprintf( tplRecvSuggest, answer[i], i ) );
		hintBox[hints.length?"hide":"show"]();
		hintBox.html( hints.join("\n") ).show();
		$( '> *', hintBox ).mouseover( highliteItem ).click( onLiClicked );
	}	
	
	function loseWisdom()
	{
		var hintBox = $("#suggestRecv");
		answer = {}
		hintBox.hide();
		haveWisdom = false;
	}	
		
	function recvListClick()
	{
		$("#recvList input").focus();
	}
	
	this.initSuggest = function()
	{
		
		var inp = $("#recvList input");
		inp.keyup( askSuggest )
		$("#recvList").click(recvListClick);
	}
	
	function onSendFromReply( cmd, params )
	{
		var target = params[0];
		var uname = $( "span.b-user b", $(target).parents('tr').eq(0).prev() ).text();
		var txt = $(target).parents('form').find('textarea').val();
		profile.friends.sendMessage( uname, txt, '' );
		onMessageClose();
	}
	
	function onSendFromMBox()
	{
		var uname = $('#recvList b').map(function(){ return $(this).text(); }).get();
		var txt = $('#composeText').val();
		if ( uname.length ) profile.friends.sendMessage( uname, txt, '' )
		_mt.history.directExecute( "msgbox", ["/profile/messages/all"] ); 
		return false;
	}
	
	function onMessgeOpen( cmd, params )
	{
		var target = params[0];
		var tr = $(target.parentNode.parentNode.parentNode)
		$( "> tr", tr.parent() ).removeClass("full")
		tr.addClass("full")
		$("#msgAnswerForm").insertAfter(tr).show();
		$("textarea", "#msgAnswerForm").val("");
	}

	function onMessageClose()
	{
		$( "#msgList tr" ).removeClass("full")
		$("#msgAnswerForm").hide();
	}
	
	function onDelRecipient( cmd, params )
	{
		$(params[0]).parent().remove();
	}
	
	function onSendMessage()
	{
		message_shown = false;
		$("#user-bubble_message").css('visibility','hidden');
		var txt = $('#textFromPopup').val();
		profile.friends.sendMessage( uname, txt ) 
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
		if ( tToFade <= 0 ) hide();
		else tToFade--;
	}

	this.resetHandlers = function()
	{
		if ( _mt.getUID() )
			$("a.user").hover( userMouseOver, userMouseOut );
	}
	
	function onUserInfoEdit()
	{
		$("#userInfo > div.profile_common").slideUp();
		$("#userInfo > div.profile_personal").slideDown();
		return false;
	}
	
	function onUserInfoCalcel()
	{
		$("#userInfo > div.profile_personal").slideUp();
		$("#userInfo > div.profile_common").slideDown();
		return false;
	}
	
	function onUserInfoSave()
	{
		function updateTehRibbon( msg )
		{
			$("#userInfo > div.profile_common").remove();
			$("#userInfo").append(msg);
			$("#userInfoEdit").click( onUserInfoEdit );
		}
		
		var data = {}
		data.name = $("#userName1_2").val();
		data.sex = $("img", "#userGender")[0].src;
		data.sex = data.sex.substr( data.sex.indexOf("sex-") + 4 ).replace('.gif',''); 
		data.bday = $("#userBirthDay").text();
		data.bmonth = $("#userBirthMonth").text();
		var mo = L("CALENDAR_MONTHS");
		var iMonth = 0;
		for(; iMonth < mo.length; iMonth++ )
			if ( mo[iMonth] == data.bmonth )
				break;
		data.bmonth = iMonth + 1;
		
		data.byear = $("#userBirthYear").text();
		data.curr_pass = $("#userInfo input[name=curr_pass]").val();
		data.new_pass = $("#userInfo input[name=new_pass]").val();
		data.retype_pass = $("#userInfo input[name=retype_pass]").val();
		data.email = $("#userInfo input[name=email]").val();
		data.icq = $("#userInfo input[name=icq]").val();
		data.skype = $("#userInfo input[name=skype]").val();
		
		if ( $("#userInfo input[name=subscribe]:checked").length ) data.subscribe = 1;
		if ( $("#userInfo input[name=email_friended]:checked").length ) data.email_friended = 1;
		if ( $("#userInfo input[name=email_private]:checked").length ) data.email_private = 1;
		if ( $("#userInfo input[name=email_recommended]:checked").length ) data.email_recommended = 1;
		if ( $("#userInfo input[name=email_hide]:checked").length ) data.email_hide = 1;
		
		$.post( urlMy+"edit", data, updateTehRibbon );
		$("#userInfo > div.profile_common").html('<ins class="preloader">Идет загрузка</ins>');
		return onUserInfoCalcel();
	}
	
	function tryUploadAvatar()
	{
		var input = $("#change_avatar");
		var filename = input[0] && input[0].value
		if ( !filename ) return;
		if ( isImageFile(filename) )
		{
			var options={
				beforeSubmit: function(a,f,o){o.dataType = "html";},
				success: function(data)
				{
					$("#cur_ava2")[0].src = avatarPath + data;
					$("#cur_ava1")[0].src = avatarPath + data;  
				}
			};
			$('#formAvatar').ajaxSubmit(options);
		}
		else
			_mt.msgbox.show(L("USER_PIC_WRONG_FORMAT"));
	}
	
	function ctor()
	{
		_mt.history.addCommand( "msgSend", { e: onSendFromMBox } );
		_mt.history.addCommand( "msgSend1", { e: onSendFromReply } );
		_mt.history.addCommand( "msgOpen", { e: onMessgeOpen } );
		_mt.history.addCommand( "msgCancel", { e: onMessageClose } );
		_mt.history.addCommand( "msgHistory", { target:"#list_place", url:'$1', params: 1, method: 'get', tabs:"#menu_place li" } );
		_mt.history.addCommand( "msgDelRecv", { e: onDelRecipient } );

		$("#change_avatar").change( tryUploadAvatar );
		$("#userInfoEdit").click( onUserInfoEdit );
		$("#userInfoReset").click( onUserInfoCalcel );
		$("#userInfoSave").click( onUserInfoSave );
		
		$("#user-bubble_write").click( onWriteMessageTo );
		$("#user-bubble_hide").click( onSelfToggleVisible );
		$("#user-bubble_add").click( onAddFriend );
		$("#user-bubble_delete").click( onFriendDelete );
		
		$("#cancelPopupMessage").click( onCancelMessage )
		$("#sendMessgeFromPopup").click( onSendMessage );
		
		_mt.addComponentNow( 'profile_day', CDropDown, { applyTo: "#birthDay", idPrefix: "day", dir: "down" } );		
		_mt.addComponentNow( 'profile_month', CDropDown, { applyTo: "#birthMonth", idPrefix: "month", dir: "down" } );
		_mt.addComponentNow( 'profile_year', CDropDown, { applyTo: "#birthYear", idPrefix: "year", dir: "down" } );		
		_mt.addComponentNow( 'profile_gender', CDropDown, { applyTo: "#selectUserGender", idPrefix: "gender", dir: "down" } );
		
	}
	ctor();	
}