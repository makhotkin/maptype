<html xmlns:v="urn:schemas-microsoft-com:vml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="keywords" content="Москва в Москве столица афиша карта город сеанс кино кинотеатр фильм на сегодня рестораны еда меню клуб театр выставка книга концерт музыка кофейня расписание музей галерея бар кафе казино бутик вуз галерея лидер проката рецензия отзывы балет опера танцы стриптиз классика искусство премьера новости новинки магазин стиль мода одежда отдых развлечения распродажа дешевле досуг посмотреть почитать потанцевать выпить поесть познакомиться купить погулять развлечься повеселиться отдохнуть послушать ночные вечер выходные пятница суббота воскресенье каникулы обзоры совет рекомендация место шаговая доступность" />
		<meta name="description" content="Maptype.com - афиша развлечений, культурного досуга и отдыха в Москве, карта Москвы. Полная афиша всех культурных мероприятий Москвы, адреса и координаты клубов, ресторанов, кинотеатров, музеев, галерей, вузов, магазинов Москвы, интерактивная карта города, свежие рецензии и обзоры, комментарии посетителей, новости, премьеры, расписания, возможность отметить места локаций на карте Москвы и найти досуг в шаговой доступности, а так же множество других сервисов и услуг для посетителей сайта Maptype.com." />
		<link rel="shortcut icon" href="/usr/tpl/picts/favicon.ico" />
		<title>MapType|ТипаКарта &mdash; афиша Москвы, афиша кино, кинотеатры Москвы, рестораны Москвы, концерты, ночные клубы, магазины, вузы Москвы, музеи и галереи на карте Москвы</title>
		<!--[if IE]>
		<style type="text/css">
			v\:* { behavior: url(#default#VML); }
		</style>
		<![endif]-->
		
		<!--[if lt IE 7]>
		<meta http-equiv="imagetoolbar" content="no" />
		<style>
			.png { filter: expression(fixPNG(this)); } 
		</style>
		<script type="text/javascript" src="/usr/tpl/js/ie6-fix.js"></script>
		<![endif]-->

		<!-- <script type="text/javascript" src="/usr/tpl/js/swfobject_.js"></script> -->

		<style type="text/css">
			@import url(/usr/tpl/styles/reset.css);
			@import url(/usr/tpl/styles/layout.css);
			@import url(/usr/tpl/styles/main.css);
			@import url(/usr/tpl/styles/formelem.css);
			@import url(/usr/tpl/styles/gallery.css);
			@import url(/usr/tpl/styles/profile.css);
		</style>
	</head>
	<body onLoad="$('#prevLoader').remove(); $('#shader').css({visibility:'hidden','opacity':0.6}); _mt.onBodyLoad();">
		
		<style>
			.z-eclipse {
				background: black;
				position: absolute;
				left: 0; top: 0;
				width: 100%; height: 100%;
				z-index: 15;
			}
		</style>
		
		<!-- Тень -->
		<div id="shader" class="z-eclipse"></div>
		<!-- /Тень -->

			<div id="prevLoader" class="png" style="position: absolute; top: 50%; left: 50%; width: 153px; height: 161px; margin-left: -77px; margin-top: -81px; z-index: 9999; background: url(/usr/tpl/picts/preloader2-bg.png); padding: 31px;">
				<img src="/usr/tpl/picts/preloader2-fg.gif"/>
			</div>

	
		<script src="/usr/tpl/js/jquery.js" type="text/javascript"></script>
		<script src="/usr/tpl/js/page.js?090306" type="text/javascript"></script>
		<script src="/usr/tpl/js/swfobject.js"></script>
		<script>
		<!-- start:user_auth -->
			_mt.setUser( {%user_id%}, "{%user_name%}" );
		<!-- end:user_auth -->
			_mt.loadComponent( 'paginator', CPaginator );
			_mt.loadComponent( 'rrr', CRrr2, {
				rrr: "#rrr", dropdown: "#rrr-dd", left: '#rr_l', right: '#rr_r', 
				left_bg: '#rrr_bg_l', right_bg: '#rrr_bg_r', left_cell: '#rrr_cl', right_cell: '#rrr_cr',
				defRightText: "Места", defLeftText: "События"
			} );
			_mt.loadComponent( 'overlay', COverlay, { 
				links: {	
					"#loc-ref_about-project": "about_project.html",
					"#loc-ref_agreement"		: "agreement.html",
					"#loc-ref_agreement1"		: "agreement.html",
					"#loc-ref_advert"				: "advertisement.html",
					"#loc-ref_location_adding" : "location_adding.html",
					"#loc-ref_error-reporting" : "error_reporting.html",
					"#loc-ref_help"					: "help.html"
				}, 
				path: "/usr/tpl/information/",
				container: "#popup",
				dataHolder: "#popup-content",
				closeButton: "#popup-close"
			} );
			_mt.loadComponent( 'search', CSearcher, { searchInput: "#search_text", searchButton: "#startSearch", searchResults: "#content" } ); 
			_mt.loadComponent( 'tooltip', CTooltip );
			_mt.loadComponent( 'loading', CLoading, { holder: "#status", classLoading: "loading", classNotify:"notify", classComplete:"finished", classFailed:"failed"  } );
			_mt.loadComponent( 'lightbox', CLightBox, { item: "#lightbox" } );
			_mt.loadComponent( 'msgbox', CMsgBox, { frame: "#infoBubble", btnNo: "#bubbleButtonNo", btnYes: "#bubbleButtonYes", btnOk: "#bubbleButtonOk", classify: "#infoBubbleClass", checkbox: "#doNotShowAnymore", text:"#bubbleText", close:"#bubble-close", clipse: 'shader' } );
<!-- start:search_post -->
			_mt.setSettings( 'search', { search_term: "{%search_value%}" } );
<!-- end:search_post -->
			_mt.loadComponent( 'history', CHistoryCommand );
		</script>

		<!-- Инфобабл -->
		<div id="lightbox">
			<div class="body">
				<span id="tooltip-text" class="content"></span>
			</div>
		</div>
		<!-- /Инфобабл -->

		<!-- Попап -->
		<div id="popup" class="popup_holder" style="width: 70%; height: 70%; position: absolute; left: 18%; top: 20%; display: none;">
			<div class="popup" style="height: 100%">
				<i class="popup_cn popup_tl"><b><u class="png"></u></b></i>
				<i class="popup_cn popup_tr"><b><u class="png"></u></b></i>
				<i class="popup_cn popup_bl"><b><u class="png"></u></b></i>
				<i class="popup_cn popup_br"><b><u class="png"></u></b></i>
				<div class="popup_body">
					<a href="#" id="popup-close" class="popup_closer">&times;</a>
					<div class="popup_content">
						<div id="popup-content" class="document">
							<ins class="preloader">Загрузка...</ins>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- /Попап -->
		
		<!-- Спешл фор админс  -->
		
		<!-- start:admin_chat -->
		
		<div class="status status-spec-adm" style="width:100px; right:160px; background-color:white; padding:0">	
			
			<input type="text" id="chatMessage" onKeyDown="sendChatMessage(event)" style="border: 1px solid #a4a4a4; width: 100%">
		</div>
		
		<!-- end:admin_chat -->
		<!-- / Спешл фор админс  -->
		
		
		<!-- Загрузчик  -->
		<div id="status" class="b-status" style="display: none">
			<ul class="list">
			</ul>
		</div>
		<!-- /Загрузчик  -->
		
		<!-- Баббл -->
		<div id="infoBubble" class="bubble_holder" style="display: none;">
			<span class="bubble">
				<span class="bubble_cn bubble_tl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_tr"><b><u class="png"></u></b></span>
				<span class="bubble_body" id="infoBubbleClass">
					<div class="bubble_content">
						<i class="icon"></i>
						<p class="text" id="bubbleText"></p>
						<table width="100%">
							<tr>
								<td width="100%" style="vertical-align: middle">
									<span id="doNotShowAgain"><input type="checkbox" id="doNotShowAnymore" style="vertical-align: middle" />&nbsp;<label for="doNotShowAnymore" style="font-size: 11px">отключить все подсказки</label></span>
								</td>
								<td nowrap="nowrap" style="padding-left: 5px;">
									<push:static.button hid="bubbleButtonOk" text="Ok">
									<push:static.button hid="bubbleButtonYes" text="Да">
									<push:static.button hid="bubbleButtonNo" text="Нет">
								</td>
							</tr>
						</table>
					</div>
					<a href="#" id="bubble-close" class="bubble_closer">&times;</a>					
				</span>
				<span class="bubble_cn bubble_bl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_br"><b><u class="png"></u></b></span>
			</span>
		</div>
		<!-- /Баббл -->
		
		<!-- Бабл "Юзер инфо" -->
		<div id="user-bubble" class="bubble2_holder">
			<span class="bubble2">
				<span class="bubble_cn bubble_tl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_tr"><b><u class="png"></u></b></span>
				<span class="bubble_body">
					<div class="bubble_content">
						<h6><a href="#" class="user-name"><i></i><u id="userNameBubble">Безымянный</u></a></h6>
						<input type="hidden" name="user-id" value="" />
						<ul class="list">
							<li id="user-bubble_write" class="write"><a href="#send">Написать сообщение</a></li>
							<li id="user-bubble_add" class="add"><a href="#add">Добавить в друзья</a></li>
							<li id="user-bubble_hide" class="hide"><a href="#hide">Скрыть/Показать себя</a></li>
							<li id="user-bubble_delete" class="delete"><a href="#del">Удалить</a></li>
						</ul>
					</div>
				</span>
				<span class="bubble_cn bubble_bl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_br"><b><u class="png"></u></b></span>
			</span>
		</div>
		<!-- Бабл "Юзер инфо" -->
		
		<!-- Бабл "Юзер инфо" - Ответить -->
		<div id="user-bubble_message" class="bubble2_holder">
			<span class="bubble2">
				<span class="bubble_cn bubble_tl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_tr"><b><u class="png"></u></b></span>
				<span class="bubble_body">
					<div class="bubble_content">
						<h6 style="margin-bottom: 10px">Сообщение для&nbsp;<a href="#" class="user-name"><i></i><u id="userNameSendMesasge">Безымянный</u></a></h6>
						<form onSubmit="return false;" style="margin-bottom: 10px">
							<!-- Тема: <push:static.input id="subjFromPopup">  -->
							<textarea rows="8" style="width: 300px" name="text" id="textFromPopup"></textarea>
							<div align="right" style="margin-top: 10px;">
								<push:static.button id="sendMessgeFromPopup" text="Отправить">
							</div>
						</form>
						<div align="right"><a href="#" id="cancelPopupMessage" style="color: #888; font-size: 11px">Отменить</a></div>
					</div>
				</span>
				<span class="bubble_cn bubble_bl"><b><u class="png"></u></b></span>
				<span class="bubble_cn bubble_br"><b><u class="png"></u></b></span>
			</span>
		</div>
		<!-- Бабл "Юзер инфо" - Ответить -->

		
		<!-- Главный координатор -->
		<table width="100%" height="100%" class="main_layout">

			<style>
				/* Внешний общий бокс. */
				#make-up_box {padding-top:25px;padding-left:25px;}
				.make-up_box_footer {background: url(/usr/tpl/img/make-up_block_footer.gif) bottom repeat-x;padding-bottom:10px;}
				
				/**  make-up - cinema **/
				#cinemalist {padding-right:18px;}
				#cinemalist .cinema {padding-bottom:20px;}
				#cinemalist .cinema .name {display:block;font-size:12px;color:#01ac01;}
				#cinemalist .cinema .name a {color:#01ac01;}
				#cinemalist .cinema .name .rating {float:right;width:56px;}
				#cinemalist .cinema .about {display:block;color:#666666;font-size:10px;padding-right:30px;}
				#cinemalist .cinema .onmap {display:block;padding-left:13px;background: url(/usr/tpl/img/arrow_left_2font_10px.gif) left no-repeat;font-size:10px;}
				#cinemalist .cinema .onmap a {color: #d3bb00;}
				#cinemalist .pageselect {font-size:10px;color:#666;padding-bottom:10px;}
				#cinemalist .pageselect a {color:#1fa51e;margin:2px;}
					
			</style>

			<!-- разметка:Баннер -->
			<tr>
				<td>
					<!-- start:top_banner -->
						 <include src="banner_top.tpl" /> 
					<!-- end:top_banner -->
				</td>
			</tr>
			<!-- /разметка:Баннер -->

			<!-- разметка:Заголовок -->
			<tr>
				<td>
					
					<!-- Заголовок -->
					<div class="b-header">
						<table width="100%" height="100%" class="ml_cols">
							<tr>
								<td class="spacer"><div></div></td>
								<td class="ml_col1">
									<table width="100%">
										<tr>
											<td width="40%">
												<a href="/" class="b-logo" title="[eta] версия"><v:rect stroked="false"><v:fill type="tile" src="/usr/tpl/picts/logo.png"></v:fill></v:rect></a>
											</td>
											<td width="60%" style="padding-right: 12px">
												<!-- Форма поиска -->
												<table class="b-search">
													<tr>
														<td class="l-search-field">
															<!-- Текст -->
															<div class="formelem fe-text">
																<div class="fe-body">
																	<i class="fe-cn fe_tl"><u></u></i>
																	<i class="fe-cn fe_tr"><u></u></i>
																	<div class="fe-cont">
																		<form id="search_form" action="/" method="post">
																			<input type="text" value="Поиск событий, объектов, пользователей" 
																			onFocus="if (value == 'Поиск событий, объектов, пользователей') {value =''}; this.style.color='#000'"
																			onBlur="if (value == '') {value = 'Поиск событий, объектов, пользователей'; this.style.color='#aaa'}" 
																			onClick="this.focus();" id="search_text" name="search" class="text" style="color:#aaa" />
																		</form>
																	</div>
																	<i class="fe-cn fe_bl"><u></u></i>
																	<i class="fe-cn fe_br"><u></u></i>
																</div>
															</div>
															<!-- /Текст -->
														</td>
														<td class="l-search-button">
															<div class="formelem fe-button" style="margin-top: 1px">
																<div class="fe-body">
																	<i class="fe-cn fe_tl"><u></u></i>
																	<i class="fe-cn fe_tr"><u></u></i>
																		<div class="fe-cont" style="padding: 3px 10px 5px 10px; zoom: 1">
																			<img id="startSearch" class="search-icon" src="/usr/tpl/picts/search_icon.gif" />
																		</div>
																	<i class="fe-cn fe_bl"><u></u></i>
																	<i class="fe-cn fe_br"><u></u></i>
																</div>
															</div>
														</td>
													</tr>
												</table>
												<!-- Форма поиска -->
											</td>
										</tr>
									</table>
									
								</td>
								<td class="ml_col2">
									<!-- Эмуляция свойства min-width / -->
									<div class="ml_minwidther"></div>
									
									<div id="rrr" class="b-rubricator">
										<img src="/usr/tpl/picts/rubricator_strip1.png" class="png" width="2" height="49" style="position: absolute; left: -1px;" />
										<img src="/usr/tpl/picts/rubricator_strip1.png" class="png" width="2" height="49" style="position: absolute; left: 50%; margin-left: -1px;" />
										<img src="/usr/tpl/picts/rubricator_strip1.png" class="png" width="2" height="49" style="position: absolute; left: 100%; margin-left: -1px" />
										
										<table class="rrr-selector b-rrr-selector">
											<tr>
												<td id="rrr_bg_l" class="b-rrr-slr-menu b-rrr-slr-category">
													<div class="sel-item" style="background: url(/usr/tpl/picts/rubricator_icon_slo.gif) 90% 50% no-repeat; width: 100%">
														<i></i>
														<div style="font-size: 23px; margin-left: 10px; line-height: 100%; color: white;" class="text">ЧТО?</div>
														<span id="rrr_cl" class="text" style="font-size: 13px; margin-left: 10px; line-height: 100%; color: white;">События</span>
													</div>
												</td>
												<!-- 
												<td width="2">
													<img src="/usr/tpl/picts/rubricator_strip2.png" class="png" width="1" height="63" style="border: 1px solid red;" /><img src="/usr/tpl/picts/rubricator_strip1.png" class="png" width="1" height="63" style="border: 1px solid red;" />
												</td>
												 -->
												<td id="rrr_bg_r" class="b-rrr-slr-menu b-rrr-slr-subcategory">
													
													<div class="sel-item" style="background: url(/usr/tpl/picts/rubricator_icon_slo.gif) 90% 50% no-repeat; width: 100%">
														<div style="font-size: 23px; margin-left: 10px; line-height: 100%; color: white;" class="text">ГДЕ?</div>
														<span id="rrr_cr" class="text" style="font-size: 13px; margin-left: 10px; line-height: 100%; color: white;">Места</span>
													</div>
												</td>
											</tr>
										</table>
									
										<div id="rrr-dd" class="readColors">
											<table>
												<tr>
													<td>
														<div class="barrel" id="rr_l">
															<div class="list part">
																<a class="cin cmd-rrrRef" href="/dir11{%movie_timeline%}"><i></i>Кино</a>
																<a class="mus cmd-rrrRef" href="/dir3{%music_timeline%}"><i></i>Музыка</a>
																<a class="dan cmd-rrrRef" href="/dir4{%dance_timeline%}"><i></i>Танцы</a>
																<a class="art cmd-rrrRef" href="/dir2{%art_timeline%}"><i></i>Искусство</a>
																<a class="edu cmd-rrrRef" href="/dir10{%science_timeline%}"><i></i>Знания</a>
																<a class="fas cmd-rrrRef" href="/dir6{%fashion_timeline%}"><i></i>Мода</a>
																<a class="foo cmd-rrrRef" href="/dir5{%food_timeline%}"><i></i>Еда</a>
																<a class="alc cmd-rrrRef" href="/dir7{%alco_timeline%}"><i></i>Алко</a>
															</div>
														</div>
													</td>
													<td>
														<div class="barrel" id="rr_r">
															<div class="list subpart">
																<a href="/cat3" class="rr-edu cmd-rrrRef">Центры знаний</a>
																<a href="/cat4" class="rr-gal cmd-rrrRef">Галереи</a>
																<a href="/cat7" class="rr-cin cmd-rrrRef">Кинотеатры</a>
																<a href="/cat9" class="rr-con cmd-rrrRef">Концертные залы</a>
																<a href="/cat19" class="rr-clu cmd-rrrRef">Клубы</a>
																<a href="/cat6" class="rr-res cmd-rrrRef">Рестораны</a>
																<a href="/cat1" class="rr-bar cmd-rrrRef">Бары</a>
																<a href="/cat2" class="rr-sto cmd-rrrRef">Магазины</a>
																<a href="/cat24" class="rr-the cmd-rrrRef">Театры</a>
															</div>
														</div>
													</td>
												</tr>
											</table>
										</div>
										
									</div>
								</td>
								
								<td class="ml_col3">
									<div class="ml_minwidther"></div>
									
									<div class="user-control">
										<script src="/usr/tpl/js/auth.js" type="text/javascript"></script>
										<!-- start:settings-box -->
										<script>
											function initDropDown()
											{
												_mt.addComponentNow( 'proDD', CDropDown, { applyTo: "#profileOptions", idPrefix: "prof", dir: "down" } );
											}
											$(initDropDown);
											/*
												function sendChatMessage(e) {
													if (e.which==13){
														$("#messageBox").append($("#chatMessage").val()+'<br>');
														getFlashMovie("socket").sendText('all_users',$("#chatMessage").val());
														$("#chatMessage").val('');
													}
												};
												 function getFlashMovie(movieName) {
												  var isIE = navigator.appName.indexOf("Microsoft") != -1;
												  return (isIE) ? window[movieName] : document[movieName];
												 
												 }
												
												$(function() 
												{
													var so = new SWFObject("/usr/tpl/images/socke.swf", "socket", "1", "1", "8", "#FFFFFF");
													so.addParam("allowScriptAccess", "always");
													so.write("socketdiv");
													
													_mt.loading.add('connecting','Устанавливается соединение...');
													
												});
												
												
												function socket_connected_successfully() {
													 _mt.loading.complete('connecting','Соединение установлено');
													 setTimeout( auth, 10 );
												};
												
												
												function socket_error() {
													_mt.loading.complete('connecting','Сокет умер =(((');
												};
												
												function message_parser(data) {}
												
												function socket_response(data)
												{
													var systemMessage = data.match(/\[@(.*?)\]/);
													if (systemMessage)
													{
														switch(systemMessage[1])
														{
															case 'Access Granted':	_mt.loading.complete('auth','Авторизация пройдена успешно!'); break;
															case 'Access Denied':	_mt.loading.notify('<b style="color:red">Доступ запрещен. Неизвестная ошибка!</b>'); break;
															case 'Client Disconnected':	_mt.loading.notify('<b style="color:red">Пользователь отключился. Сообщение будет доставлено позже</b>'); break;
															case 'User is offline':	_mt.loading.notify('<b style="color:red">Пользователь не в сети. Сообщение будет доставлено позже</b>'); break;
															case 'No user found with such nickname': _mt.loading.notify('<b style="color:red">Пользователя с таким именем не существует.</b>'); break;
														}
													}
													else 
													{
														_mt.loading.notify(data); 
														getFlashMovie("socket").playBeep();
													
													}
												}
												
												function is_nc() {
													if ({%user_id%}==20){
														return true;
													}
												};
												 
												function auth(){
													getFlashMovie("socket").sendText('{%user_id%}','init');
													_mt.loading.add('auth','Попытка авторизации...');
												
												};
												
												*/
										</script>
																			
										<!-- <div id="socketdiv" style="position:absolute; top:-10000"></div> -->
										
										
										
										<table class="user-control-header">
											<tr>
												<!-- start:user_status -->
												<td class="user-control-header-menu">
													<div class="uchm-ref-profile">
														<a href="/profile" id="hUserName" class="user-name"><i></i><u>{%user_name%}</u></a>
														<small>Личный кабинет</small>
													</div>
												</td>
												<!-- end:user_status -->
												<td class="user-control-header-menu">
													<div class="uchm-ref-logout">
														<a href="#" id="logmeout"><i></i><u>{%LANG_USER_EXIT%}</u></a>
													</div>
												</td>
											</tr>
										</table>
										
										<script>
											;function exitConfirmed( answer ) {
												answer && $.post( "/logout", "", function(msg){ if (msg.match(/1/)) window.location.reload(); });
											};
											function onExitClick() { return _mt.msgbox.show("{%LANG_MESSAGE_EXIT%}", 1, exitConfirmed ) && false; };
											$("#logmeout").click( onExitClick );
										</script>
										
										<div id="towel" class="user-nav-towel" style="display: none">
											<div class="user-nav-towel-content">
												<ul>
													<li id="profCalendar"><a href="/profile#proTab|{%user_name%}/calendar">Календарь</a></li>
													<li id="profFavour"><a href="/profile#proTab|{%user_name%}/favourite">Любимые места</a></li>
													<li id="profMessages"><a href="/profile#proTab|{%user_name%}/messages">Сообщения</a></li>
													<li id="profFriends"><a href="/profile#proTab|{%user_name%}/friends">Друзья</a></li>
												</ul>
											</div>
										</div>
										<script>_mt.loadComponent( "auth", CAuthForm );</script>
										<!-- end:settings-box -->

										<!-- start:reg-box -->
										<table class="user-control-header">
											<tr>
												<td class="user-control-header-menu">
													<div class="uchm-ref-login">
														<a href="#login" id="enter"><i></i><u>{%LANG_USER_ENTER%}</u></a>
													</div>
												</td>
												<td class="user-control-header-menu">
													<div class="uchm-ref-register">
														<a href="#register" id="register" class="ttip0"><i></i><u>{%LANG_USER_REG%}</u></a>
													</div>
												</td>
											</tr>
										</table>
										
										<!--
										<table width="100%">
											<tr>
												<td width="10" nowrap="nowrap"></td>
												<td><a href="#login" id="enter" style="color: white; background: url(/usr/tpl/picts/icon_enter.gif) 0 50% no-repeat; display: block; padding: 5px 0; padding-left: 25px;">{%LANG_USER_ENTER%}</a></td>
												<td width="100%"></td>
												<td><a href="#register" id="register" class="ttip0" style="color: white; background: url(/usr/tpl/picts/icon_registr.gif) 0 50% no-repeat; display: block; padding: 5px 0; padding-left: 25px;">{%LANG_USER_REG%}</a></td>
												<td width="20" nowrap="nowrap"></td>
											</tr>
										</table>
										-->

										<!-- end:reg-box -->
									
									</div>
								</td>
							</tr>
						</table>
					</div>
					<!-- /Заголовок -->
					<div class="header-shadow"></div>
				</td>
			</tr>
			<!-- /Разметка: Заголовок -->
			
			<!-- Тело -->
			<tr>
				<td height="100%" >
					<div id="body">
						<table width="100%" height="100%" class="ml_cols">
							<tr>
								<td class="spacer"><div></div></td>
								<!-- start:main_content -->
								<td class="ml_col1">
									<!-- start:map --><include src="map.tpl" /><!-- end:map -->
								</td>
								<td class="ml_col2" style="background: white">
									
									<!-- Эмуляция свойства min-width / -->
									<div class="ml_minwidther"></div>
									
									<!-- Содержание -->
									<div class="info-block">

										<div id="content" class="b-ib-cont">

											<!-- start:main_list -->
											<include src="main_list.tpl" />
											<!-- end:main_list -->

											<!-- start:map_event -->
											<include src="event.tpl" />
											<!-- end:map_event -->

											<!-- start:map_object -->
											<include src="object.tpl" />
											<!-- end:map_object -->

											<!-- start:search_engine -->
											<include src="search_list.tpl" />
											<!-- end:search_engine -->

											<!-- start:all_users -->
											<include src="users.tpl" />
											<!-- end:all_users -->

											<!-- start:cat_listing -->
											<include src="cat.tpl" />
											<!-- end:cat_listing -->

										</div>
										
										<!-- Скролл -->
										<div class="scrollelem" id="mainListScroll">
											<i class="se-arrow se-arrow-up"></i>
											<div class="se-track">
												<i class="se-runner png"></i>
											</div>
											<i class="se-arrow se-arrow-down"></i>
										</div>
										<!-- /Скролл -->
										
										<!-- Подсказка (верх) -->
										<div class="l-ib-hint l-ib-hint-top" id="listTopHint">
											<div class="ib-hint ib-hint-top" style="display: none">
												<i class="ib-hint-cn ib-hint-t"><u></u></i>
												<i class="ib-hint-cn ib-hint-r"><u></u></i>
												<i class="ib-hint-cn ib-hint-b"><u></u></i>
												<i class="ib-hint-cn ib-hint-l"><u></u></i>
												<i class="ib-hint-cn ib-hint-tl"><u></u></i>
												<i class="ib-hint-cn ib-hint-tr"><u></u></i>
												<i class="ib-hint-cn ib-hint-bl"><u></u></i>
												<i class="ib-hint-cn ib-hint-br"><u></u></i>
												<div class="ib-hint-cont">
													sdfas fsadf asdf asdf 
												</div>
											</div>
										</div>
										<!-- /Подсказка (верх) -->
										
										<!-- Подсказка (низ) -->
										<div class="l-ib-hint l-ib-hint-bottom" id="listBottomHint">
											<div class="ib-hint ib-hint-bottom" style="display: none">
												<i class="ib-hint-cn ib-hint-t"><u></u></i>
												<i class="ib-hint-cn ib-hint-r"><u></u></i>
												<i class="ib-hint-cn ib-hint-b"><u></u></i>
												<i class="ib-hint-cn ib-hint-l"><u></u></i>
												<i class="ib-hint-cn ib-hint-tl"><u></u></i>
												<i class="ib-hint-cn ib-hint-tr"><u></u></i>
												<i class="ib-hint-cn ib-hint-bl"><u></u></i>
												<i class="ib-hint-cn ib-hint-br"><u></u></i>
												<div class="ib-hint-cont">
													Тест<br>sdasdfsdf
												</div>
											</div>
										</div>
										<!-- /Подсказка (низ) -->
										
										<!-- start:letters -->
											<!-- start:objectletters -->
												<li>
													<h6><a href="{%object_url%}" class="name">{%object_title%}</a></h6>
													<i>{%object_cat%}</i>
													<address>{%object_adress%}</address>
													<span class="homesite">{%object_way%}</span>
												</li>
											<!-- end:objectletters -->
										<!-- end:letters -->

									</div>
									<!-- /Содержание -->
								</td>
								<!-- end:main_content -->
								
								<!-- start:profile_content -->
								<td class="ml_col12">
									<!-- Профиль -->
									<div id="profile" class="l-profile">
										<div class="profile">
											<include src="profile.tpl" />
										</div>
									</div>
									<!-- /Профиль -->
								</td>
								<!-- end:profile_content -->
								
								<td class="ml_col3">
									<div class="ml_minwidther"></div>
									
									
									
									<!-- Слой для всплывающих окон -->
									<div class="layer1">
										
										<!-- start:reg-form -->
											<include src="reg_form.tpl" />
										<!-- end:reg-form -->
										
										<!-- Юзеринфо 
										 start:personal-bar 
											<include src="personal-bar.tpl" />
										end:personal-bar 
										/Юзеринфо -->
										
									</div>
									<!-- /Слой для всплывающих окон -->
									
									<div></div>
									
									<!-- Баннер 2 -->
									<div class="block" style="position: relative; z-index: 1;">
										<div id="banner2" style="position: absolute; top: 0; left: 0; overflow: hidden; border: 1px solid #282828">
								
									
									<!-- start:right_banner -->								
									
										<include src="banner_right.tpl" />
									<!-- end:right_banner -->
										</div>
									</div>
									
									<!-- start:old_banner -->
								
									<script type="text/javascript">
									(function(){
										var flashvars = {
											link1: "http://www.mini.ru"
										};
										var params = {
											wmode: "transparent"
										};
										var attributes = {};
										swfobject.embedSWF("/usr/tpl/images/240x400_FLSv7_MINI_Bullet_240x400_080708.swf", "banner2", "240", "400", "9.0.0", "/usr/tpl/images/expressInstall.swf", flashvars, params, attributes);
									})();
									</script>
									
									<div class="block" style="position: relative; z-index: 1;">
										<div style="position: absolute; top: 0; left: 0; overflow: hidden; border: 1px solid #282828">
											<div id="banner2">
												У вас не установлен flash-плейер
											</div>
										</div>
									</div>
									<!-- end:old_banner -->
									
									<!-- /Баннер 2 -->
									
								</td>
							</tr>
						</table>			
					</div>					
					<!-- /Тело -->					
				</td>
			</tr>
			<!-- /разметка:Тело -->
			
			<!-- разметка:Плинтус -->
			<tr>
				<td>
					<!-- Плинтус -->
					<div id="footer">
						<ins class="shadow"></ins>
						<table class="ml_cols">
							<tr>
								<td nowrap="nowrap" class="ml_col12">
									<ul class="extra"><!--
										--><li><a href="/"><img src="/usr/tpl/picts/icon-home.gif" /></a>&nbsp;</li><!--
										--><li><a href="#" id="loc-ref_about-project">О проекте</a></li><!--
										--><li><a href="#" id="loc-ref_advert">Реклама на сайте</a></li><!--
										--><li><a href="#" id="loc-ref_location_adding">Сообщить о заведении/событии</a></li><!--
										--><li><a href="#" id="loc-ref_error-reporting" style="color: red">Сообщить об ошибке</a></li><!--
										--><li><a href="#" id="loc-ref_agreement1">Пользовательское соглашение</a></li><!--
										--><li><a href="#" id="loc-ref_help" style="color: #019902"><img src="/usr/tpl/picts/helpme.gif" />&nbsp;HELP</a></li><!--
									--></ul>
								</td>
								<td nowrap="nowrap" class="ml_col3">
									<div class="copyright">
										<a href="/"><img src="/usr/tpl/picts/copyright.gif"/></a><span class="text">&nbsp;&copy;&nbsp;2008</span>
									</div>
								</td>
							</tr>
						</table>
					</div>
					<!-- /Плинтус -->
				</td>
			</tr>
			<!-- /разметка:Плинтус -->
			
		</table>
		<!-- /Главный координатор -->
		
		<script>
			function showHelp() {
				$("#loc-ref_help").click();
			}
		</script>	
		
		<!-- start:activation_info -->
		<script>
			_mt.onload = function() { _mt.msgbox.show( '{%msg%}', 0, function(){ window.location = '/'; } ); };
		</script>
		<!-- end:activation_info -->
		<!-- start:helpus -->
		<script>
			_mt.onload = showHelp;
		</script>z
		<!-- end:helpus -->
		<script type="text/javascript">
			function tryAnal()
			{
				try {
					window.pageTracker = _gat._getTracker("UA-6139318-3");
					window.pageTracker._trackPageview();
				} catch(err) {}
			};
			function approachGoogle()
			{
				var script = document.createElement("script");
				script.src = "http://www.google-analytics.com/ga.js";
				document.getElementsByTagName("head")[0].appendChild(script);

				var _on_ready_execution = setInterval( function(){
					if (typeof _gat === 'object') { tryAnal(); clearInterval(_on_ready_execution); }
				}, 80);
			};
			$(approachGoogle);
		</script>
	</body>
</html>
