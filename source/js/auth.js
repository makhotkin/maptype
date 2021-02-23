var CAuthForm = function( $, settings )
{
	var settings = $.extend( {
		day: "#rBirthDay",
		month: "#rBirthMonth",
		year: "#rBirthYear"
	} , settings );
	var t = this;
	
	var visibleObject = null;
	
	var slideLinkStatus = { 
			"#registration": [true,false], 
			"#forgot_form": [true,true],
			"#loginform": [false,true]
	};
	
	var cssNot_aLink = { "text-decoration": "none", "cursor": "default" };
	var cssActiveLink = { "text-decoration": "underline", "cursor": "pointer" };
	
	var email_pattern = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
	var areaLeft = 0;
	var areaTop = 0;
	var towelVisible = false;

	function keyForLogin( ev ) { if ( ev.keyCode == 13 ) tryLogin(); }
	
	$('#login_').keypress(keyForLogin);
	$('#pass_').keypress(keyForLogin);
	
	function cuntTrimmer( where )
	{
		var hairy = $(where).val();
		var shaved = $.trim(hairy);
		if ( shaved != hairy )
			$(where).val(shaved);
		return shaved;
	}
	
	function tryLogin()
	{
		var login = cuntTrimmer("#login_");
		var pass = cuntTrimmer("#pass_");
		var expire = '';
		var expireBox = $('#loginform table *:checked');
		if (expireBox.length)
			expire = expireBox.attr('value');
		var err = '';
		if (login == ''){ err += '<li>'+L("LOGON_NEED_LOGIN")+'</li>'; }
		if (pass == ''){ err += '<li>'+L("LOGON_NEED_PASSWORD")+'</li>'; }
		if (err!='')
			$("#loginform-error ul").html(err)
		else
		{
			$.post( "/auth", "login="+login+"&pass="+pass+"&expire="+expire, afterLoginAttempt );
			_mt.loading.add( 'login', L("LOGGING_IN") );
		} 
	}
	
	function afterLoginAttempt( msg )
	{
		if (msg.match(/0/))
			_mt.msgbox.show(L('LOGON_AUTH_FAILED'));
		else if (msg.match(/1/))
			window.location.reload();
			
		_mt.loading.complete( 'login' );
	}
	
	function slideDown( objDown )
	{
		if ( objDown == visibleObject ) return;
		function slideDown() { $(objDown).show().animate({top: "-30px"}, 400); }
		if ( visibleObject )
			$(visibleObject).animate( { top: "-600px" }, 400, "linear", slideDown );
		else
			slideDown();
		visibleObject = objDown;

		if ( visibleObject in slideLinkStatus )
		{
			var toSet = slideLinkStatus[visibleObject]
			$("#enter").css( toSet[0] ? cssActiveLink : cssNot_aLink );
			$("#register").css( toSet[1] ? cssActiveLink : cssNot_aLink );
		}
	}
	
	function slideUp( ev )
	{
		if ( visibleObject )
			$(visibleObject).animate( { top: "-600px" }, 400, "linear" );
		$("#enter").css(cssActiveLink);
		$("#register").css(cssActiveLink);
		visibleObject = null;
		
		if ( ev ) ev.preventDefault(); 
		return false;
	}
	
	function showLogin() { slideDown( "#loginform" ); }
	function showRegister() { slideDown( "#registration" ); return false; }
	function showForgotPass() { slideDown("#forgot_form"); }
	
	/* Вход */

	
	function onRegister()
	{
		var eula_confirm='';
		var err='';
		var log = cuntTrimmer('#registerLogin');
		var pass = cuntTrimmer('input[@name="password"]');
		var pass2 = cuntTrimmer('input[@name="confirm"]');
		var email = cuntTrimmer('input[@name="email"]');

		var bday = $("#userBirthDay").text();
		var bmonth = $("#userBirthMonth").text();
		var mo = L("CALENDAR_MONTHS");
		var iMonth = 0;
		for(; iMonth < mo.length; iMonth++ )
		{
			if ( mo[iMonth] == bmonth ) 
			{
				bmonth = iMonth + 1;
				break;
			}
		}
		
		var byear = $("#userBirthYear").text();
		
		var sex=$('input[@name="sex"]:checked').val();
		var subscribe = $('input#subscription"]:checked').length;
		
		function addError( txt ) { err+="<li>"+L(txt)+"</li>"; } 

		if($('input[@name="confirm_eula"]:checked').attr('value'))
			eula_confirm=$('input[@name="confirm_eula"]:checked').attr('value');
		
		if ( log.length < 2 ) addError("REG_NEED_LOGIN");
		if ( pass.length < 3 || pass2.length < 3 ) addError('REG_NEED_PASSWORD');
		if ( pass != pass2 ) addError('REG_PASS_MISMATCH');
		if ( !email.match(email_pattern) ) addError("REG_NEED_EMAIL");

		if ( eula_confirm == '' ) addError("REG_NEED_EULA");
		if ( !( parseInt(byear) + parseInt(bday) + parseInt(bmonth) > 0 ) ) addError("REG_NEED_BIRTHDAY");
		if ( !( $('#reg-sex_female')[0].checked ^ $('#reg-sex_male')[0].checked ) ) addError("REG_NEED_GENDER");
		
		$("#registration-error ul").html(err);
		if ( err=='' ) {
			$.post("/register", 
					"login="+log+"&password="+pass+"&confirm="+pass2+"&email="+email+"&b_date="+bday+"&b_month="+bmonth+"&b_year="+byear+"&confirm_eula="+eula_confirm+"&sex="+sex+"&subscribe="+subscribe,
					afterRegister);
			_mt.loading.add( 'register', L("REGISTERING") );
			slideUp();
		}
		return false;
	}
	
	function afterRegister( msg )
	{
		_mt.loading.complete( 'register' );
		var answers = [ 'REG_FAIL_UNKNOWN','REG_FAIL_USERNAME','REG_FAIL_EMAIL','REG_FAIL_PASSMATCH','REG_OK_CODESENT' ];
		var res = 0;
		var re_match = msg.match(/(\d)/);
		if ( re_match ) res = re_match[1];
		if ( res > 4 ) res = 0;
		_mt.msgbox.show(L(answers[res]));
		if ( !res ) slideUp();
	}
	
	function onRestorePassword( ev )
	{
		var err='';
		var email = $('input[@name="reg_mail"]').val();
		/* alert(email); */
		if ( !email.match(email_pattern) )
			err += '<li>'+L("REG_NEED_EMAIL")+'</li>';
		if (err!='')
			$("#forgotform-error ul").html(err);
		else
			$.post("/forget", "reg_mail="+email, afterRestorePass); 
		if ( ev ) ev.preventDefault();
		return false;		
	}
	
	function afterRestorePass( msg )
	{
		if (msg.match(/3/))
			_mt.msgbox.show(L('RESTORE_PASS_NOT_FOUND'));
		else if (msg.match(/1/))
			_mt.msgbox.show(L('RESTORE_PASS_OK_CODESENT'));
		else
			_mt.msgbox.show(L('RESTORE_PASS_FAILED'));
		slideUp();
	}

	function hideTowel()
	{
		towelVisible = false;
	        $("#towel").slideUp();
	}

	this.onMouseMove = function( mouse, target, ev )
	{
		if( towelVisible && (mouse[0] < areaLeft || mouse[1] > areaTop) )
			hideTowel();
	}

	this.onResize = function()
	{
		areaLeft = $("td.ml_col3").offset().left;
		areaTop = $("#body").offset().top + 100;
	}

	this.dbg = function()
	{
		console && console.log( areaLeft, areaTop );
	}

	function ctor()
	{
		$("#trylogin").click( tryLogin );
		$("#enter").click(showLogin);
		$("#register").click(showRegister);
		$("#cancel_login").click(slideUp);
		$("#reg_cancel").click(slideUp);
		$("#forgot_pass").click(showForgotPass);
		$("#forgot_cancel").click(slideUp);
		$('#doRegister').click(onRegister);
		
		$('#resetPassword').click( onRestorePassword );
		$('#forgot_form').submit( onRestorePassword );

		$("#hUserName").mouseover(function(){ if( !towelVisible ) { $("#towel").slideDown(); towelVisible = true; } });
		
		if ( _mt.getUID() ) 
		{
			var mySize = utils.getWindowClientAreaSize();
			t.onResize(mySize[0], mySize[1]);		
                	return;
                }

		_mt.dateSelect.fill( settings.startYear, settings.endYear, settings.day, settings.month, settings.year );
		_mt.addComponentNow( 'reg_day', CDropDown, { applyTo: settings.day, idPrefix: "day", dir: "down" } );		
		_mt.addComponentNow( 'reg_month', CDropDown, { applyTo: settings.month, idPrefix: "month", dir: "down" } );
		_mt.addComponentNow( 'reg_year', CDropDown, { applyTo: settings.year, idPrefix: "year", dir: "down" } );		
	}
	ctor();
}
                                                  