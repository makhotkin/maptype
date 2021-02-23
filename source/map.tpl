<script type="text/javascript" src="/usr/tpl/js/map.js"></script>
<script>
	_mt.loadComponent( 'map', CMap, { applyTo: "#themap" ,listener: {}, container: "#map-viewport" } );
	_mt.setGlobalName( 'map', "map" );
	_mt.loadComponent( 'map_dd', CDropDown, { applyTo: "#locations", width: 150, idPrefix: "mark", dir: "up" } );
	_mt.loadComponent( 'mapctrl', CMapCtrl, { locations: "map_dd" } );
	<!-- start:friendsOnMapInit -->_mt.setSettings( "marks", { friends: {%friends_json%} } );<!-- end:friendsOnMapInit -->
	<!-- start:user_marksjs -->_mt.setSettings( "marks", { bookmarks: {%user_marks%} } );<!-- end:user_marksjs -->
	<!-- start:point_cookie -->_mt.setSettings( "mapctrl", { cookie_mark: {%point_cookies%} } );<!-- end:point_cookie -->
</script>

<div style="width:100%;height:100%;position:relative">
	<div id="map-cover">
		<div id="map-viewport">
			<div id="themap" class="map drag" style="width: 100%; height: 100%">
				<!-- Зум -->
				<div id="map-zoom">
					<!-- some shadows and other stuff --><input id="map-zoom-in" type="image" src="/usr/tpl/picts/map/plus.gif" />
					<div id="map-zoom-rails">
						<div id="map-zoom-slider"></div>
					</div>
					<input id="map-zoom-out" type="image" src="/usr/tpl/picts/map/minus.gif" /><!-- some shadows and other shit -->
				</div>
				<!-- /Зум -->
				<!-- Стрелки на карте -->
				<div id="map-arrows" class="map-arrows">
					<div class="cont">
						<i id="map-arrows-up" class="arrow-up"></i>
						<i id="map-arrows-left" class="arrow-left"></i>
						<i id="map-arrows-down" class="arrow-down"></i>
						<i id="map-arrows-right" class="arrow-right"></i>
					</div>
				</div>
				<!-- /Стрелки на карте -->
		
				<!-- Инфобабл -->
				<div id="map-infobubble">
					<div class="map-infobubble_body">
						<span id="map-infobubble-contents" class="map-infobubble_content"></span>
					</div>
				</div>
				<!-- /Инфобабл -->
				
				<!-- Радиусы доступности -->
				<div id="radii" style="display: none">
					<div class="radii">
						<!--[if IE]><![if !IE]><![endif]-->
						<canvas id="radius-canvas"></canvas>
						<!--[if IE]><![endif]><![endif]-->
						<!--[if IE]>
						<v:oval stroked="true" class="oval1" filled="false" strokecolor="#00ff00"></v:oval>
						<v:oval stroked="true" class="oval2" filled="false" strokecolor="#00ff00"></v:oval>
						<v:oval stroked="true" class="oval3" filled="false" strokecolor="#00ff00"></v:oval>
						<![endif]-->
						<ol class="marks">
							<li class="mark1u">5 min</li>
							<li class="mark2u">10 min</li>
							<li class="mark3u">15 min</li>
							<li class="mark1r">5</li>
							<li class="mark2r">10</li>
							<li class="mark3r">15</li>
							<li class="mark1l">5</li>
							<li class="mark2l">10</li>
							<li class="mark3l">15</li>
							<li class="mark1d">5 min</li>
							<li class="mark2d">10 min</li>
							<li class="mark3d">15 min</li>
						</ol>
					</div>
				</div>
				<!-- Радиусы доступности -->
				
				<!-- Всякое другое, что нужно включить внутрь тега map -->
				<div id="map-extra-contents">
					<div class="copyright">&copy; ЗАО "<a href="http://www.geocenter-consulting.ru/">Геоцентр Консалтинг</a>"</div>
				</div>
				<!-- /Всякое -->
				
				<style type="text/css">
					@import url(/usr/tpl/styles/map.css);
				</style>

				<!-- <link rel="stylesheet" type="text/css" href="/usr/tpl/styles/map.css" /> -->


				<!-- TODO Отметь себя на карте -->
				<!-- Всплывающая подсказка "Отметь себя на карте" -->
				<!--
				<div class="l-map-banner" style="display: none">
					<div class="b-map-banner">
						<span></span>
						<a href="#"></a>
					</div>
				</div>
				-->
				<!-- /Всплывающая подсказка "Отметь себя на карте" -->
				
				<!-- TODO Пузырь -->
				<!-- Шаблон пузыря --
				<div class="l-bubble">
					<div class="b-bubble">
						<i class="bubble-cn" class="bubble-tl"><u></u></i>
						<i class="bubble-cn" class="bubble-tr"><u></u></i>
						<i class="bubble-cn" class="bubble-bl"><u></u></i>
						<i class="bubble-cn" class="bubble-br"><u></u></i>
						<div class="bubble-cont">
							
						</div>
					</div>
				</div>
				<!-- /Шаблон пузыря -->
				

				<!-- Бабл "Добавление новой локации" -->
				<div id="editPoint" class="bubble_holder adding" style="display: none;">
					<span class="bubble">
						<span class="bubble_cn bubble_tl"><b><u class="png"></u></b></span>
						<span class="bubble_cn bubble_tr"><b><u class="png"></u></b></span>
						<span class="bubble_body" style="background: #f7fcef; padding: 5px">
							<img src="/usr/tpl/picts/map_icon-x.gif" id="editPointClose" style="position: absolute; cursor: pointer; z-index: 13; top: -12px; right: 0; width: 21px; height: 12px" />
							<table>
								<tr>
									<td>
										<input type="hidden" value="" id="editPointX" />
										<input type="hidden" value="" id="editPointY" />
										<input type="hidden" value="" id="editPointId" />
										<!-- Текст -->
										<div class="formelem fe-text">
											<div class="fe-body">
												<i class="fe-cn fe_tl"><u></u></i>
												<i class="fe-cn fe_tr"><u></u></i>
												<div class="fe-cont"><input type="text" value="Безымянный" id="editPointText" class="text" style="width: 100px; font-size: 11px" /></div>
												<i class="fe-cn fe_bl"><u></u></i>
												<i class="fe-cn fe_br"><u></u></i>
											</div>
										</div>
										<!-- /Текст -->
									</td>
									<td width="5" nowrap="nowrap"></td>
									<td>
										<!-- Кнопка -->
										<div id="editPointOk" class="formelem fe-button">
											<div class="fe-body">
												<i class="fe-cn fe_tl"><u></u></i>
												<i class="fe-cn fe_tr"><u></u></i>
												<div class="fe-cont"><button type="button">ОК</button></div>
												<i class="fe-cn fe_bl"><u></u></i>
												<i class="fe-cn fe_br"><u></u></i>
											</div>
										</div>
										<!-- /Кнопка -->
									</td>
									<td width="5" nowrap="nowrap"></td>
									<td style="vertical-align: middle">
										<a id="editPointDelete" href="#" style="display: block; width: 16px; height: 16px; background: url(/usr/tpl/picts/icon-babams.gif) 50% 50% no-repeat"></a>
									</td>
								</tr>
							</table>
						</span>
						<span class="bubble_cn bubble_bl"><b><u class="png"></u></b></span>
						<span class="bubble_cn bubble_br"><b><u class="png"></u></b></span>
					</span>
					
					<div id="editPointMapPlace" style="position: absolute; width: 32px; height: 31px; top: 0px; left: -12px; background: url(/usr/tpl/picts/map/cursor.png); -background-image: none; -filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/usr/tpl/picts/map/cursor.png', sizingMethod='crop');"></div>
				</div>
				<!-- /Бабл "Добавление новой локации" -->
			
				<!-- Бабл "Отметь себя на карте" -->
				
				<style>
					#markSelfCloseFlag:hover {
						color: red !important;
					}
				</style>
				
				<div id="markSelfOnMap" style="position: absolute; bottom: 30px; right: 10px; display: none;">
					<div style="position: relative">
						<img src="/usr/tpl/picts/banner-huyanner1.png" width="238" height="111" class="png" style="cursor: pointer; -moz-user-select: none; -khtml-user-drag: none;" />
						<a href="#" id="markSelfCloseFlag" style="position: absolute; top: 0; right: 5px; display: block; padding: 4px 5px; text-decoration: none; color: #000; font-size: 14px;">&times;</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	
	<div id="map-ctrl-panel">
		<table width="100%" border="0">
			<tr>
				<td nowrap="nowrap">
					
					<!-- start:friends_button_guest -->
					<!-- Кнопка -->
					<div id="toggleFriends" class="formelem fe-button fe-button-disabled map-control-friend" title="Показать последние активные локации ваших друзей. Только для зарегистрированных">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="fe-cont"><button type="button" disabled="disabled"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					<!-- end:friends_button_guest -->
					
					<!-- start:friends_button_registered -->
					<!-- Кнопка -->
					<div id="toggleFriends" class="formelem fe-button fe-button-pressed map-control-friend" title="Показать последние активные локации ваших друзей">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					<!-- end:friends_button_registered -->

					<!-- Кнопка -->
					<div id="toggleRadii" class="formelem fe-button fe-button-pressed map-control-radii" title="Включить и отключить зоны шаговой доступности вокруг ваших локаций">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					
					<!-- Кнопка -->
					<div id="toggleMarks" class="formelem fe-button fe-button-pressed map-control-objectshow" title="Удалить объекты с карты">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->

				</td>
				<td width="100%">
				</td>
				<td nowrap="nowrap" style="padding: 0 10px">
					
					<!-- Кнопка -->
					<div id="addLocationLink" class="formelem fe-button map-control-mark" title="Добавить локацию">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					
					<!-- Кнопка -->
					<div id="addLocationCancel" class="formelem fe-button fe-button-pressed map-control-mark" title="Отменить локацию">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="cont fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					
					<!-- Кнопка -->
					<div id="resetLocations" class="formelem fe-button fe-button-pressed map-control-markshow" title="Отменить выбор локации">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="cont fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->
					
					<!-- Кнопка -->
					<div id="setLocations" class="formelem fe-button map-control-markshow" title="Вернуться к последней локации">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<div class="cont fe-cont"><button type="button"><i class="fe-button-icon"></i></button></div>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
						</div>
					</div>
					<!-- /Кнопка -->

					<!-- start:add_admin_object -->
					<a href="#" id="objectAdder">Добавить объект</a>
					<!-- end:add_admin_object -->

				</td>
				<td align="right" nowrap="nowrap">
					
					<div class="formelem fe-select" id="locations" style="width: 150px">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
							<div class="fe-cont" style="width: 150px">
								<div class="fe-select-elem">
									<span><b><!-- start:marked_location -->{%selected_mark%}<!-- end:marked_location --></b><i class="i-invert"></i></span>
									<ul>
										<!-- start:user_marks_opt -->
										<li id="mark{%mark_id%}">{%mark_name%}</li>
										<!-- end:user_marks_opt -->
									</ul>
								</div>
							</div>
						</div>
					</div>
					
				</td>
			</tr>
		</table>
	</div>
</div>
