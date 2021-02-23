<script src="/usr/tpl/js/profile.js" type="text/javascript"></script>
<script>
	_mt.loadComponent( 'profile', CProfile, { owner: "{%name%}" } );
</script>

<!-- start:edit_profile -->
<include src="profile_personal_edit.tpl" />
<!-- end:edit_profile -->

<!-- start:show_profile -->
<include src="profile_personal_view.tpl" />
<!-- end:show_profile -->

<!-- start:profile_news -+->
<include src="profile_news.tpl" />
<!-+- end:profile_news -->

		<div class="user-info" id="userInfo">
			<!-- start:someone_profile -->
			
			<div class="b-form">
				<table width="100%" class="l-profile-cols">
					<tr>
						<td class="l-block1">
							<span class="avatar"><img src="/usr/pic/avatar/{%nuser_pic%}" id="cur_ava1" /></span>
						</td>
						<td class="l-block2">
							<p><span class="user-name"><i></i><u>{%user_nick%}</u></span></p>
							<p>{%real_name%}<i class="contact-sex-icon"><img src="/usr/tpl/picts/profile-icon-sex-{%sex%}male.gif"/></i></p>
							<!-- start:birthday_show_not_mine -->
							<p class="contact-birthday">{%age%} ({%date_formed%})</p>
							<!-- end:birthday_show_not_mine -->
							<p class="profile-control">
								<!-- start:friend_add_remove_ -->
								<div class="{%is_friend%}">
									<a class="addFriend" href="javascript:_mt.profile.friends.add('{%name%}')" onclick="this.parentNode.className='remove';">Добавить в друзья</a>
									<a class="delFriend" href="javascript:_mt.profile.friends.remove('{%name%}')" onclick="this.parentNode.className='add';">Удалить из друзей</a>
								</div>
								<!-- end:friend_add_remove_ -->
							</p>
						</td>
						<td class="l-block3">
							<!-- start:email_info_not_mine -->
							<p><a href="mailto:{%email%}">{%email%}</a></p>
							<!-- end:email_info_not_mine -->
							<p>
								<!-- start:icq_info_not_mine -->
								<span class="contact contact-icq">{%icq%}</span>
								<!-- end:icq_info_not_mine -->
								<!-- start:skype_info_not_mine -->
								<span class="contact contact-skype">{%skype%}</span>
								<!-- end:skype_info_not_mine -->
							</p>
						</td>
						<td class="l-block4"></td>
					</tr>
				</table>
			</div>
			
			<!-- end:someone_profile -->
		
		
			<!-- start:user_info_common -->
			<div class="b-form profile_common">
				<table width="100%" class="l-profile-cols">
					<tr>
						<td class="l-block1">
							<span class="avatar"><img src="/usr/pic/avatar/{%nuser_pic%}" id="cur_ava2" /></span>
						</td>
						<td class="l-block2">
							<p><span class="user-name"><i></i><u>{%nuser_name%}</u></span></p>
							<p><span id="briefUserName">{%real_name%}</span>
							<i class="contact-sex-icon" id="briefUserGender"><img src="/usr/tpl/picts/profile-icon-sex-{%sex%}male.gif"/></i></p>
							<p class="contact-birthday"><span id="briefUserAge">{%age%}</span> (<span id="briefUserBirth">{%date_formed%}</span>)</p>
							<p class="profile-control"><a href="#" id="userInfoEdit">Редактировать</a></p>
						</td>
						<td class="l-block3">
						
						<!-- start:email_info -->
						<p><a href="mailto:{%email%}">{%email%}</a></p>
						<!-- end:email_info -->
						
							<p>
								<!-- start:icq_info -->
								<span class="contact contact-icq">{%icq%}</span>
								<!-- end:icq_info -->
								
								<!-- start:skype_info -->
								<span class="contact contact-skype">{%skype%}</span>
								<!-- end:skype_info -->
							</p>
						</td>
						<td class="l-block4"></td>
					</tr>
				</table>
			</div>
			<!-- end:user_info_common -->
			
			<!-- start:mProfile -->
			<div class="b-form profile_personal" style="display:none">
			<table width="100%" class="l-profile-cols">
				<tr>
					<td class="l-block1">
						<div class="avatar"><img src="/usr/pic/avatar/{%nuser_pic%}" id="cur_ava1" /></div>
						<div>
							<form class="felement-file" id="formAvatar" action="/profile/{%nuser_name%}/avatar" method="post">
								<input type="file" id="change_avatar" name="avatar" />
								<a href="#">сменить</a>
							</form>
						</div>
					</td>
					<td class="l-block2">
						<p><span class="user-name"><i></i><u>{%nuser_name%}</u></span></p>
						<div class="user-info-block">
							<push:static.input value="{%real_name%}" id="userName1_2">
							<div class="formelem fe-select" id="selectUserGender">
								<div class="fe-body">
									<i class="fe-cn fe_tl"><u></u></i>
									<i class="fe-cn fe_tr"><u></u></i>
									<i class="fe-cn fe_bl"><u></u></i>
									<i class="fe-cn fe_br"><u></u></i>
									<div class="fe-cont">
										<div class="fe-select-elem">
											<span><b id="userGender"><img src="/usr/tpl/picts/profile-icon-sex-{%sex%}male.gif"></b><i></i></span>
											<ul class="j-hidden">
												<li id="genderMale"><img src="/usr/tpl/picts/profile-icon-sex-male.gif"/></li>
												<li id="genderFemale"><img src="/usr/tpl/picts/profile-icon-sex-female.gif"/></li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="user-info-block" style="padding-bottom: 10px">
							<nobr>
								<div class="formelem fe-select" id="birthDay" style="width: 40px">
									<div class="fe-body">
										<i class="fe-cn fe_tl"><u></u></i>
										<i class="fe-cn fe_tr"><u></u></i>
										<i class="fe-cn fe_bl"><u></u></i>
										<i class="fe-cn fe_br"><u></u></i>
										<div class="fe-cont">
											<div class="fe-select-elem">
												<span><b id="userBirthDay">{%b_day%}</b><i></i></span>
												<ul class="j-hidden" style="//height: 150px;">
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="formelem fe-select" id="birthMonth" style="width: 80px">
									<div class="fe-body">
										<i class="fe-cn fe_tl"><u></u></i>
										<i class="fe-cn fe_tr"><u></u></i>
										<i class="fe-cn fe_bl"><u></u></i>
										<i class="fe-cn fe_br"><u></u></i>
										<div class="fe-cont">
											<div class="fe-select-elem">
												<span><b id="userBirthMonth">{%b_month%}</b><i></i></span>
												<ul class="j-hidden">
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="formelem fe-select" id="birthYear" style="width: 60px">
									<div class="fe-body">
										<i class="fe-cn fe_tl"><u></u></i>
										<i class="fe-cn fe_tr"><u></u></i>
										<i class="fe-cn fe_bl"><u></u></i>
										<i class="fe-cn fe_br"><u></u></i>
										<div class="fe-cont">
											<div class="fe-select-elem">
												<span><b id="userBirthYear">{%b_year%}</b><i></i></span>
												<ul class="j-hidden" style="//height: 150px;">
												</ul>
											</div>
										</div>
									</div>
								</div>
							</nobr>
						</div>
						<p style="color: #aaa">Сменить пароль</p>
						<div class="user-info-block">
							<label>Текущий пароль</label> <push:static.password value="" name="curr_pass">
						</div>
						<div class="user-info-block">
							<label>Новый пароль</label> <push:static.password value="" name="new_pass">
						</div>
						<div class="user-info-block">
							<label>Повторите пароль</label> <push:static.password value="" name="retype_pass">
						</div>
					</td>
					<td class="l-block3">
						<div class="user-info-block" style="margin-left: -16px; position: relative; zoom: 1">E-mail <push:static.input name="email" value="{%email%}"></div>
						<div class="user-info-block">
							<img src="/usr/tpl/picts/icons-contact-icq.png" style="margin-bottom: -3px"/>
							<push:static.input name="icq" value="{%icq%}">
						</div>
						<div class="user-info-block">
							<img src="/usr/tpl/picts/icons-contact-skype.png" style="margin-bottom: -3px"/>
							<push:static.input name="skype" value="{%skype%}">
						</div>
						<!-- <p><a href="#">добавить аккаунт</a></p> -->
					</td>
					<td class="l-block4">
						<p style="color: #aaa">Оповещать по e-mail</p>
						
						
						<span class="b-form-selector">
							<input type="checkbox" name="subscribe" {%subscribe%}/>&nbsp;<!--
							--><label>Рассылка новостей сайта</label>
						</span>
						
						<span class="b-form-selector">
							<input type="checkbox" name="email_friended" {%email_friended%}/>&nbsp;<!--
							--><label>Добавили в друзья</label>
						</span>
						
						<span class="b-form-selector">
							<input type="checkbox" name="email_private" {%email_private%}/>&nbsp;<!--
							--><label>Личные сообщения</label>
						</span>
						
						
						<span class="b-form-selector">
								<input type="checkbox" name="email_recommended" {%email_recommended%}/>&nbsp;<!--
							--><label>Рекомендации друзей</label>
						</span>
						
							<span class="b-form-selector">
								<input type="checkbox" name="email_hide" {%email_hide%} />&nbsp;<!--
							--><label>Скрыть мой e-mail</label>
						</span>
					</td>
				</tr>
			</table>
			
				<div class="b-form-buttons">
					<push:static.button text="Сохранить изменения" id="userInfoSave">
					<push:static.button text="Отменить" id="userInfoReset">
				</div>
			</div>
			<!--
			<div class="data">
				<form method="post" enctype="multipart/form-data" action="/profile/{%user_id%}/avatar" id="uploadAvatarForm">
					<fieldset>
						<legend>Сменить картинку</legend>
						<input type="file" name="avatar" />
						<push:static.button id="uploadAvatar" text="ОК">
					</fieldset>
				</form>
			</div>
			-->
			<!-- end:mProfile -->
			
			<!-- start:nProfile -->
			<div class="avatar user{%friend%}">
				<img src="/usr/pic/avatar/{%nuser_pic%}" />
				<span class="user-name" style="display: none"><u>{%nuser_name%}</u></span>
			</div>
			<div class="data">
				<h5><a href="#" class="user-name"><i></i><u>{%nuser_name%}</u></a></h5>
				<!-- start:friend_add_remove -->
				<div class="{%is_friend%}">
					<a class="addFriend" href="javascript:_mt.profile.friends.add('{%name%}')" onclick="this.parentNode.className='remove';">Добавить в друзья</a>
					<a class="delFriend" href="javascript:_mt.profile.friends.remove('{%name%}')" onclick="this.parentNode.className='add';">Удалить из друзей</a>
				</div>
				<!-- end:friend_add_remove -->
			</div>
			<!-- end:nProfile -->
	
		</div>
		<!-- /Информация о пользователе -->
		
		<!-- Меню -->
		<ul class="submenu1 menu" id="profileTabs"><!--
			--><li><a class="tab- selected cmd-proTab loc-ref" href="#{%name%}/calendar" id="proCalendar"><i><u></u></i><span class="name">Календарь</span></a></li><!--
			--><li><a class="tab- cmd-proTab loc-ref" href="#{%name%}/favourite" id="proFavourite"><i><u></u></i><span class="name">Любимые места</span></a></li><!--
			--><!-- start:private_messages --><!--
			--><li><a class="tab- cmd-proTab loc-ref" href="#{%name%}/messages" id="proMessages"><i><u></u></i><span class="name">Сообщения</span></a></li><!--
			--><!-- end:private_messages --><!--
			--><li><a class="tab- cmd-proTab loc-ref" href="#{%name%}/friends" id="proFriends"><i><u></u></i><span class="name">Друзья</span></a></li><!--
		--></ul>
		<!-- /Меню -->
		
		<!-- Тело -->
		<div class="body" id="profile_center">
			<!-- start:profile_calendar_holder -->
			<include src="profile_calendar.tpl" />
			<!-- end:profile_calendar_holder -->
			
			<!-- start:profile_messages -->
			<include src="profile_messages.tpl" />
			<!-- end:profile_messages -->
			
			<!-- start:private_messagess -->
			<include src="profile_messages.tpl" />
			<!-- end:private_messagess -->
			
			<!-- start:friends_list -->
			<include src="profile_friend_list.tpl" />
			<!-- end:friends_list -->
			
			<!-- start:like_list -->
			<style>
			.totozozo .promo {
				width: 350px;
				margin-right: 30px;
			}
			
			</style>
			<div class="totozozo">
				{%like_row%}
			</div>
			<!-- end:like_list -->
			
		</div>
		<!-- / Тело -->
		
		<!-- Баннер -->
		<div style="margin-top: 50px; padding-bottom: 20px; text-align: center">
			<!--AdFox START-->
			<!--Площадка: maptype.com / личный кабинет / 728х90-->
			<!--Тип баннера: 728х90-->
			<script type="text/javascript">
			if (typeof(pr) == 'undefined') { var pr = Math.floor(Math.random() * 1000000); }
			var addate = new Date();
			document.write('<iframe src="http://ads.adfox.ru/3933/getCode?p1=rih&amp;p2=cmy&amp;p3=a&amp;p4=a&amp;pucn=a&amp;pfc=a&amp;pfb=a&amp;pr=' + pr + '&amp;pt=b&amp;pd=' + addate.getDate() + '&amp;pw=' + addate.getDay() + '&amp;pv=' + addate.getHours() + '&amp;py=a" frameBorder="0" width="728" height="90" marginWidth="0" marginHeight="0" scrolling="no" style="border: 0px; margin: 0px; padding: 0px;"><a href="http://ads.adfox.ru/3933/goDefaultLink?p1=rih&amp;p2=cmy" target="_top"><img src="http://ads.adfox.ru/3933/getDefaultImage?p1=rih&amp;p2=cmy" border="0" alt=""><\/a><\/iframe>');
			</script>
			<noscript>
			<iframe src="http://ads.adfox.ru/3933/getCode?p1=rih&amp;p2=cmy&amp;p3=a&amp;p4=a&amp;pucn=a&amp;pfc=a&amp;pfb=a&amp;py=a" frameBorder="0" width="728" height="90" marginWidth="0" marginHeight="0" scrolling="no" style="border: 0px; margin: 0px; padding: 0px;"><a href="http://ads.adfox.ru/3933/goDefaultLink?p1=rih&amp;p2=cmy" target="_top"><img src="http://ads.adfox.ru/3933/getDefaultImage?p1=rih&amp;p2=cmy" border="0" alt=""></a></iframe>
			</noscript>
			<!--AdFox END-->
		</div>
		<!-- / Баннер -->
<script>
	_mt.dateSelect.fill( 1950, 1995, "#birthDay", "#birthMonth", "#birthYear", 0{%day%}, 0{%month%}, 0{%year%}, 'li' );
</script>
		