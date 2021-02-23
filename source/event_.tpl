<!-- Заголовок -->
<!-- start:thread -->
<div id="eventShapka" class="matryoshka">
	<h1><a href="{%category_url%}" class="cmd-locRef">{%category_name%}</a></h1>
	<h3>{%title%}</h3>
</div>
<!-- end:thread -->
<!-- /Заголовок -->
	
<!-- start:event -->
<include src="static.event_block" />
<!-- end:event -->

<!-- Теги -->
<dl class="tags">
	<dt>Теги</dt>
	<dd>
		<ul>
			<!-- start:event_tags -->
			<li><a>{%tag_names%}</a></li>
			<!-- end:event_tags -->
		</ul>
	</dd>
</dl>
<!-- /Теги -->

<!-- Меню -->
<ul class="submenu1 menu">
	<!-- start:review_link --><li><!--
		--><a class="loc-ref selected cmd-lp-objTab" href="/event/{%id%}/review"><i><u></u></i><span class="name">{%review_lang%}</span></a><!--
	--></li><!-- end:review_link --><!-- start:gallery_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/gallery"><i><u></u></i><span class="name">{%gallery_lang%}</span></a><!--
	--></li><!-- end:gallery_link --><!-- start:object_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/places"><i><u></u></i><span class="name">{%object_lang%}</span></a><!--
	--></li><!-- end:object_link --><!-- start:trailer_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/trailer"><i><u></u></i><span class="name">{%trailer_lang%}</span></a><!--
	--></li><!-- end:trailer_link --><!-- start:schedule_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/schedule"><i><u></u></i><span class="name">{%schedule_lang%}</span></a><!--
	--></li><!-- end:schedule_link --><!-- start:comments_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/comments"><i><u></u></i><span class="name">{%comments_lang%}</span></a><!--
	
	--></li><!-- end:comments_link --><!-- start:going_link --><li><!--
		--><a class="loc-ref cmd-lp-objTab" href="/event/{%id%}/going"><i><u></u></i><span class="name">Кто идет</span></a><!--	
	--></li><!-- end:going_link -->
	
</ul>
<!-- /Меню -->
	
	
<!-- Контент -->
<div id="center_content">
<!-- start:event_ajax_box -->
		
	<!-- Обзор -->
	<!-- start:review_text -->
	<div id="review">
		<!-- Титры -->
		<div class="titres">
			<!-- start:info1 --><dl><dt>{%info1_lang%}</dt><dd>{%info1_value%}</dd></dl><!-- end:info1 -->
			<!-- start:info2 --><dl><dt>{%info2_lang%}</dt><dd>{%info2_value%}</dd></dl><!-- end:info2 -->
			<!-- start:info4 --><dl><dt>{%info4_lang%}</dt><dd>{%info4_value%}</dd></dl><!-- end:info4 -->
			<!-- start:info5 --><dl><dt>{%info5_lang%}</dt><dd>{%info5_value%}</dd></dl><!-- end:info5 -->
			<!-- start:info3 --><dl><dt>{%info3_lang%}</dt><dd>{%info3_value%}</dd></dl><!-- end:info3 -->
		</div>
		<!-- /Титры -->
		<!-- Описание -->
		<div class="description">
			<div class="header">
				<img src="/usr/pic/avatar/{%author_avatar%}" />
				<h5><a href="/profile/{%author_id%}" class="name">{%author%}</a></h5>
				<small class="date">{%data_time%}</small>
			</div>
			<div class="content">
				{%review_message%}
			</div>
		</div>
		<!-- /Описание -->
	</div>
	<!-- end:review_text -->
	<!-- /Обзор -->
		
	<!-- Галерея -->
	<!-- start:gallery_file -->
	
	<style>
		.gallery {
		
		}	.l-gallery-slides {
				/* border: 1px solid red; */
				text-align: center;
				width: 100%;

		}	.gallery-slides {
				display: inline-block; //display: inline; zoom: 1;
				/* border: 1px solid green; */
				position: relative;
				//height: 1;
				margin: 0 auto;
				text-align: center;
				
				}	.gallery-slides-ribbon {
					margin: 0 15px;
						
						}	.gallery-slides-ribbon ul {
								display: inline-block; //display: inline; zoom: 1;
								}	.gallery-slides-ribbon li {
										/* display: -moz-display-box; display: inline-block; //display: inline; zoom: 1; */
										padding: 0; margin: 0;
								
				}	.gallery-slides-control {
						position: absolute;
						top: 0; left: 0;
						width: 100%; height: 100%;
						
						}	.gallery-slides-control a {
								position: absolute;
								display: block;
								font-size: 0;
								top: 50%;
								margin-top: -5px;
								background-image: url(/usr/tpl/picts/igallery-arrows.gif);
								width: 6px; height: 11px;
								
								}	.gallery-slides-control-button1 {
										left: 0;
										background-position: 0 0;
										
								}	.gallery-slides-control-button2 {
										right: 0;
										background-position: 100% 0;
		}
	</style>
	
	
	
	<div class="gallery">
		<div class="l-gallery-slides">
			<div class="gallery-slides">
				<div class="gallery-slides-ribbon">
					<ul>
						<!-- start:picture_gallery --><li style="margin: 0; padding: 0"><img style="cursor:pointer" big="{%picture_gallery_pic_big%}" src="{%picture_gallery_pic_small%}" /></li><!-- end:picture_gallery -->
					</ul>
				</div>
				<div class="gallery-slides-control">
					<!-- start:gallery_prev_button --><a href="#" class="gallery-slides-control-button1"></a><!-- end:gallery_prev_button -->
					<!-- start:gallery_next_button --><a href="#" class="gallery-slides-control-button2"></a><!-- end:gallery_next_button -->
				</div>
			</div>
		</div>
		<div class="gallery-image" style="margin-top: 5px;">
			<!-- start:gallery_big --><img id="main_gallery_picture" src="{%first_picture_gallery%}" style="width: 100%" /><!-- end:gallery_big -->
		</div>
	</div>
	
	<script src="/usr/tpl/js/jcarousellite_1.0.1.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			$(".gallery-slides-ribbon").jCarouselLite({
				btnNext: ".gallery-slides-control-button2",
				btnPrev: ".gallery-slides-control-button1",
				visible: 2
			});
		});
		$(".gallery-slides-ribbon li").click(function(){
			var biger = $(this).find("img").attr("big");
			$(".gallery-image").fadeOut(function(){
				$("#main_gallery_picture", this).attr("src",biger);
				$(".gallery-image").fadeIn();
			});
		});
	</script>

	<!-- </div> -->

	<!-- end:gallery_file -->
	<!-- /Галерея -->
	
	
	
	
<!-- start:people_going -->

	<!-- start:people_template --><li><a href="{%link%}"><img src="/usr/pic/avatar/{%avatar%}" title="{%user_name%}" /></a></li><!-- end:people_template -->

	<!-- start:empty_list_message --><b>{%message%}</b><!-- end:empty_list_message -->

	<!-- start:friends_going -->
	<div class="l-user-list">
		<h1>Друзья<ins>{%count%}</ins></h1>
		<ul class="user-list">{%list%}</ul>
	</div>
	<!-- end:friends_going -->

	<!-- start:all_people_going -->
	<div class="l-user-list">
		<h1>Остальные<ins>{%count%}</ins></h1>
		<ul class="user-list">{%list%}</ul>
	</div>
	<!-- end:all_people_going -->

	<!-- start:all_people_going_only -->
	<div class="l-user-list">
		<ul class="user-list">{%list%}</ul>
	</div>
	<!-- end:all_people_going_only -->
	
<!-- end:people_going -->



	<!-- Трейлер -->
	<!-- start:trailer_file -->
	<!-- start:flash_trailer -->
		<div id="trailer_place">
			<div id="trailer_flashobj">
				У вас не установлен <a href="http://www.adobe.com/go/EN_US-H-GET-FLASH">флеш-плейер</a>
			</div>
			<script type="text/javascript">
				(function(){
					var flashvars = {};
					var params = {
						wmode: "transparent",
						allowFullScreen: "true"
					};
					var attributes = {};
					swfobject.embedSWF("/usr/tpl/player/maptypePlayer.swf?id={%current_video_xml%}", "trailer_flashobj", "336", "210", "9.0.0", "/usr/tpl/images/expressInstall.swf", flashvars, params, attributes);
				})();
			</script>
		</div>
	<!-- end:flash_trailer -->
	<!-- end:trailer_file -->
	<!-- /Трейлер -->

	<!-- Расписание -->
	<!-- start:schedule_file -->
	<div class="timetable">

		<table class="week-days">
			<tr>
				<td class="days-list">
					<ul>
						<!-- start:week_day --><li><a class="cmd-objDay {%selected%}" href="/event/{%id%}/schedule/{%date%}" id="{%week_link%}" class="cal_day">{%day%}</a></li><!-- end:week_day -->
					</ul>
				</td>
				<td class="switch">
					<!-- start:prev_week -->
					<a class="cmd-objDay ctrl_page-prev" href="/event/{%id%}/schedule/{%date%}">предыдущая неделя</a>
					<!-- end:prev_week -->
					<!-- start:next_week -->
					<a class="cmd-objDay ctrl_page-next" href="/event/{%id%}/schedule/{%date%}">следующая неделя</a>
					<!-- end:next_week -->
					<!-- start:no_nweek -->
					<a>следующая неделя</a>
					<!-- end:no_nweek -->
				</td>
			</tr>
		</table>
		
		<!-- start:cweek -->
		<h4>{%current_date%}</h4>
		<!-- end:cweek -->

		<table class="grid">
			<!-- start:timetable -->
			<tr>
				<td class="name"><a href="{%cinema_link%}" class="cmd-objRef">{%cinema_name%}</a></td>
				<td class="times">
					<ul>
						<!-- start:cinema_time_pass --><li class="past">{%time%}</li><!-- end:cinema_time_pass -->
						<!-- start:cinema_time --><li>{%time%}</li><!-- end:cinema_time -->
					</ul>
				</td>
			</tr>
			<!-- end:timetable -->
		</table>

	</div>
	<!-- end:schedule_file -->
	<!-- /Расписание -->
		
	<!-- Комментарии -->
	<!-- start:event_messages -->
	<script>$("button.sendMessage").click(function(){ $(this).parents("form").ajaxSubmit({ target:'#center_content' }); return false; });</script>
	<div id="review_comments">
		<!-- start:message_none -->
		<div>Здесь еще нет комментариев</div>
		<!-- end:message_none -->
		<!-- start:message_s -->
		<form id="eventForm" class="message_adding" method="post" action="/event/{%id%}/comments/add">
		<!-- class="new_message" -->
			<!-- Текст -->
			<div class="formelem fe-text" style="margin-bottom: 5px; width: 100%">
				<div class="fe-body">
					<i class="fe-cn fe_tl"><u></u></i>
					<i class="fe-cn fe_tr"><u></u></i>
					<div class="fe-cont"><textarea rows="3" name="text" style="width: 100%;"></textarea></div>
					<i class="fe-cn fe_bl"><u></u></i>
					<i class="fe-cn fe_br"><u></u></i>
				</div>
			</div>
			<!-- /Текст -->
			<!-- Кнопка -->
			<div id="startSearch" class="formelem fe-button">
				<div class="fe-body">
					<i class="fe-cn fe_tl"><u></u></i>
					<i class="fe-cn fe_tr"><u></u></i>
					<div class="fe-cont"><button class="sendMessage">Отправить</button></div>
					<i class="fe-cn fe_bl"><u></u></i>
					<i class="fe-cn fe_br"><u></u></i>
				</div>
			</div>
			<!-- /Кнопка -->
		</form>
		<!-- end:message_s -->
		<!-- start:mesages_n -->
		<div>Оставлять комментарии могут только зарегистрированные пользователи. <a href="#login" class="loc-ref" onClick="$('#enter').click(); return false;">Войдите</a> или <a href="#register" onClick="$('#register').click(); return false;">зарегистрируйтесь</a>.</div>
		<!-- end:mesages_n -->
		<!-- start:message_e -->
		<div class="message comment">
			<table class="message_header">
				<tr>
					<td class="mh_image">
						<span class="user-image">
							<img src="/usr/pic/avatar/{%u_pic%}" />
						</span>
					</td>
					<td class="mh_text">
						<a href="/profile/{%u_name%}" class="user-name"><i></i><u>{%u_name%}</u></a>
						<small class="date">{%m_date%}</small>
					</td>
				</tr>
			</table>
			<div class="message_content">
				{%text%}
			</div>
		</div>
		<!-- end:message_e -->
	</div>
	<!-- start:main_pager -->
	<include src="static.paginator" ondblclick="return{url:'/event/{%id%}/comments',dest:'#center_content'}"/>
	<!-- end:main_pager -->
	
	<!-- end:event_messages -->
	<!-- /Комментарии -->

	<!-- Объект -->
	<!-- start:object_file -->
	<ul class="list">
		<!-- start:objectList -->
		<li>
			<h6><a href="/object/{%object_id%}" class="cmd-locRef">{%object_title%}</a></h6>
			<address title="Показать на карте"><a href="#show" onclick="return map.scrollTo( {%object_x%}, {%object_y%} ,1) && false">{%object_adress%}</a></address>
		</li>
		<!-- end:objectList -->
	</ul>
	<!-- end:object_file -->
	<!-- /Объект -->
	
	<!-- Навигация -->
	<include src="static.ib_navigation" />
	<!-- /Навигация -->
	
<!-- end:event_ajax_box -->
</div>
<!-- /Контент -->
	
	
<script>
<!-- start:lenta_coords -->
if ( 0{%dir_id%} ) _mt.setSettings( 'rrr', { loaded: '/dir{%dir_id%}' } );
_mt.setSettings('marks', { eventPlace: {%lenta_script%} } );
<!-- end:lenta_coords -->
<!-- start:lenta_coords_ajax -->
if ( 0{%dir_id%} ) _mt.rrr.sync( '/dir{%dir_id%}' );
map.marks.setEventPlaces( {%lenta_script%} );
map.adjustViewForEvents();
<!-- end:lenta_coords_ajax -->
$('i.rating', "#content").each(_mt.rating.updateRating);
</script>
