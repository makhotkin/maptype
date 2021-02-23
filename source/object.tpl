<!-- Заголовок -->
<!-- start:thread -->
<div id="eventShapka" class="matryoshka">
	<!-- <img src="{%category_picture%}" class="icon" /> -->
	<h1><a href="{%category_url%}" class="cmd-locRef">{%category_name%}</a></h1>
	<h3>{%title%}</h3>
	<!-- table width="100%">
		<tr>
			<td width="100%">
				<h3>{%title%}</h3>
			</td>
			<td>
				<button class="cmd-placeAdd" style="color: black;">В&nbsp;любимые</button>
			</td>
		</tr>
	</table -->
</div>
<!-- end:thread -->
<!-- /Заголовок -->
	
<!-- Промо -->
<div class="promo" id="object{%id%}">
	<div class="container">
		<div class="container-overflow">
			<!-- start:title_image_tpl -->
			<img src="{%title_image%}" class="image" alt="" />
			<!-- end:title_image_tpl -->
			<i class="curtain"><a href="#"></a></i>
			<i class="linkarea"></i>
			<!-- start:object_rating -->
			<include src="static.event_rating" />
			<!-- end:object_rating -->
		</div>
	</div>
</div>
<script>$('i.rating', "#object{%object_id%}").each(_mt.rating.updateRating);</script>
<!-- /Промо -->
	
<!-- start:directions -->
<div style="margin-bottom:5px;">
	<address>{%address%}</address>
	<span class="homesite" style="font-size:10px; color:#999999">{%path%}</span>
	<div class="homesite" style="font-size:10px; color:#999999">{%phone%}</div>
</div>
<!-- end:directions -->

<!-- Меню -->
<ul id="objectTabs" class="submenu1 menu"><!--
	--><!-- start:schedule_link --><li><!--
		--><a class="cmd-lp-objTab{%sel%}" href="/object/{%id%}/schedule"><i><u></u></i><span class="name">{%schedule_lang%}</span></a><!--
	--></li><!-- end:schedule_link --><!-- start:review_link --><li><!--
		--><a class="cmd-lp-objTab{%sel%}" href="/object/{%id%}/review"><i><u></u></i><span class="name">{%review_lang%}</span></a><!--
	--></li><!-- end:review_link --><!-- start:gallery_link --><li><!--
		--><a class="cmd-lp-objTab" href="/object/{%id%}/gallery"><i><u></u></i><span class="name">{%gallery_lang%}</span></a><!--
	--></li><!-- end:gallery_link --><!-- start:comments_link --><li><!--
		--><a class="cmd-lp-objTab" href="/object/{%id%}/comments"><i><u></u></i><span class="name">{%comments_lang%}</span></a><!--
	--></li><!-- end:comments_link -->
</ul>
<!-- /Меню -->
	
<div id="center_content">
	
	<!-- Обзор -->
	<!-- start:object_ajax_box  -->
	<!-- start:review_text -->
	<div id="review">
		
		<!-- Титры -->
		<table width="100%" class="titres">
			<tr>
				<td width="60%">
					<!-- start:info_n -->
					<dl><dt>{%term%}</dt><dd>{%value%}</dd></dl>
					 <!-- end:info_n -->
				</td>
				<td width="40%">
					<!-- start:info3 -->
					<div class="descr">
						<dl><dt>{%info3_lang%}</dt><dd>{%info3_value%}</dd></dl>
					</div>
					<!-- end:info3 -->
				</td>
			</tr>
		</table>
		<!-- /Титры -->
		
		<!-- Описание -->
		<!-- start:review_title -->
		<div class="description">
			<div class="header">
				<img src="/usr/pic/avatar/{%author_avatar%}" />
				<h5><a href="/profile/{%author_id%}" class="name">{%author_name%}</a></h5>
				<small class="date">{%data_time%}</small>
			</div>
			<div class="content">
				{%review_message%}
			</div>
		</div>
		<!-- end:review_title -->
		<!-- /Описание -->
		
		<!-- start:no_review -->
			Для этого места никто еще не написал обзор
		<!-- end:no_review -->

	</div>
	<!-- end:review_text -->
	<!-- /Обзор -->
	<!-- start:schedule_file -->
	
	
	<!-- Расписание -->
	<div class="timetable">

		<table class="week-days">
			<tr>
				<td class="days-list">
					<ul>
						<!-- start:week_day -->
						<li><a class="cmd-objDay {%selected%}" href="/object/{%id%}/schedule/{%date%}" id="{%week_link%}" class="cal_day">{%day%}</a></li>
						<!-- end:week_day -->
					</ul>
				</td>
				<td class="switch">
					<!-- start:prev_week -->
					<a class="cmd-objDay ctrl_page-prev" href="/object/{%id%}/schedule/{%date%}">предыдущая неделя</a>
					<!-- end:prev_week -->
					<!-- start:next_week -->
					<a class="cmd-objDay ctrl_page-next" href="/object/{%id%}/schedule/{%date%}">следующая неделя</a>
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
	<!-- /Расписание -->
	<!-- end:schedule_file -->

	<!-- start:object_messages -->
	<div id="review_comments">
		
		<!-- start:message_none -->
		<div>Никто пока не оставлял отзывов об этом месте.<BR></div>
		<!-- end:mesages_none -->
		
		<!-- start:message_s -->
		<form id="eventForm" class="message_adding" method="post" action="/object/{%id%}/comments/add">
		<!-- class="new_message" -->
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
		<script>
		$("button.sendMessage").click(function(){
			$(this).parents("form").ajaxSubmit({ target:'#center_content' });
			return false;
		});
		</script>
		<!-- end:message_s -->

		<!-- start:mesages_n -->
		<div style="margin-bottom: 15px">Оставлять комментарии могут только зарегистрированные пользователи. <a href="#" class="loc-ref" onClick="$('#enter').click(); return false;">Войдите</a> или <a href="#" onClick="$('#register').click(); return false;">зарегистрируйтесь</a>.</div>
		<!-- end:mesages_n -->
		
		<!-- start:message_e -->
		<div class="message comment">
			<table class="message_header">
				<tr>
					<td class="mh_image">
						<span class="user-image"><img src="/usr/pic/avatar/{%u_pic%}" /></span>
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
	<include src="static.paginator" ondblclick="return{url:'/object/{%id%}/comments',dest:'#center_content'}"/>
	<!-- end:main_pager -->
	
	<!-- Навигация -->
	<div class="navigation">
		<table>
			<tr>
				<th>Что?</th>
				<th>Где?</th>
			</tr>
			<tr>
				<td>
					<h2><a href="/dir11{%movie_timeline%}">Кино</a></h2>
					<h2><a href="/dir3{%music_timeline%}">Музыка</a></h2>
					<h2><a href="/dir4{%dance_timeline%}">Танцы</a></h2>
					<h2><a href="/dir2{%art_timeline%}">Искусство</a></h2>
					<h2><a href="/dir10{%science_timeline%}">Знания</a></h2>
					<h2><a href="/dir6{%fashion_timeline%}">Мода</a></h2>
					<h2><a href="/dir5{%food_timeline%}">Еда</a></h2>
					<h2><a href="/dir7{%alco_timeline%}">Алко</a></h2>
				</td>
				<td>
					<h2><a href="/cat3">Центры&nbsp;знаний</a></h2>
					<h2><a href="/cat4">Галереи</a></h2>
					<h2><a href="/cat7">Кинотеатры</a></h2>
					<h2><a href="/cat9">Концертные&nbsp;залы</a></h2>
					<h2><a href="/cat19">Клубы</a></h2>
					<h2><a href="/cat1">Бары</a></h2>
					<h2><a href="/cat6">Рестораны</a></h2>
					<h2><a href="/cat23">Магазины</a></h2>
					<h2><a href="/cat24">Театры</a></h2>
				</td>
			</tr>
		</table>
	</div>
	<!-- /Навигация -->
	
	<!-- end:object_messages -->
	<!-- /Комментарии -->
	<!-- end:object_ajax_box  -->
	
</div>


<script>
	<!-- start:main_set_location -->
	_mt.setSettings('map', { x0: {%x%}, y0: {%y%}, initialScale: 1 }, true );
	_mt.setSettings('marks', { selectObject: {%id%} } );
	_mt.setSettings( 'rrr', { loaded: '/cat{%cid%}' } );	
	<!-- end:main_set_location -->
	<!-- start:ajax_set_location -->
	map.marks.selectObject( {%id%} );
	map.scrollTo( {%x%}, {%y%} );
	_mt.rrr.sync( '/cat{%cid%}' );	
	<!-- end:ajax_set_location -->
</script>