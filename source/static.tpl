<!-- start:alert_message -->
<script>
	_mt.msgbox.show('{%text%}');
</script>
<!-- end:alert_message -->



<!-- start:main_list_header -->
	<table class="header" width="100%">
		<tr>
			<td class="name"><div><i></i><a class="cmd-locRef" href="{%event_id_href%}">{%event_name%}</a></div></td>
			<td class="date">{%event_date%}</td>
		</tr>
	</table>
<!-- end:main_list_header -->



<!-- start:event_block -->
<div class="promo {%special_class%}" id="event{%event_id%}">
	
	{%header%}
	<div class="container">
		<img class="image" src="{%event_image%}" alt="{%event_name%}"/>
		<a class="hiliter cmd-locRef" href="{%event_id_href%}"></a>
		<ul class="tags"><!--
			--><!-- start:event_tags --><li><a>{%tag_name%}</a></li><!-- end:event_tags --><!--
		--></ul>
		{%event_rating_place%}
	</div>
</div>
<!-- end:event_block -->

<!-- start:event_rating -->
<i class="rating">
	<b>
		<div class="scale">
			<div class="neg" style="width:{%neg_width%}%"><div></div></div>
			<div class="pos" style="width:{%pos_width%}%"><div></div></div>
		</div>
		<table class="control">
			<tr>
				<td class="neg">
					{%event_minus%}
					<span>{%minus_count%}</span>
					<ins>зло</ins>
				</td>
				<td class="pos">
					<ins>добро</ins>
					<span >{%plus_count%}</span>
					{%event_plus%}
				</td>
			</tr>
		</table>
		
	</b>
</i>
<!-- end:event_rating -->

<!-- start:event_del_sel --><button title="{%alt%}" class="remove-sel cmd-{%code3letters%}Del"></button><!-- end:event_del_sel -->
<!-- start:event_del --><button title="{%alt%}" class="remove cmd-{%code3letters%}Del"></button><!-- end:event_del -->
<!-- start:event_add_sel --><button title="{%alt%}" class="add-sel cmd-{%code3letters%}Add"></button><!-- end:event_add_sel -->
<!-- start:event_add --><button title="{%alt%}" class="add cmd-{%code3letters%}Add"></button><!-- end:event_add -->

<!-- start:event_offset --><td colspan="{%days%}"><ins class="chart-segment-strip"></ins></td><!-- end:event_offset -->

<!-- start:input -->
<div class="formelem fe-text {%class%}">
	<div class="fe-body">
		<i class="fe-cn fe_tl"><u></u></i>
		<i class="fe-cn fe_tr"><u></u></i>
		<div class="fe-cont"><input type="text" name="{%name%}" value="{%value%}" id="{%id%}" class="text" /></div>
		<i class="fe-cn fe_bl"><u></u></i>
		<i class="fe-cn fe_br"><u></u></i>
	</div>
</div>
<!-- end:input -->

<!-- start:password -->
<div class="formelem fe-text">
	<div class="fe-body">
		<i class="fe-cn fe_tl"><u></u></i>
		<i class="fe-cn fe_tr"><u></u></i>
		<div class="fe-cont"><input type="password" name="{%name%}" value="{%value%}" id="{%id%}" class="text" /></div>
		<i class="fe-cn fe_bl"><u></u></i>
		<i class="fe-cn fe_br"><u></u></i>
	</div>
</div>
<!-- end:password -->

<!-- start:button -->
<div class="formelem fe-button" id="{%hid%}">
	<div class="fe-body">
		<i class="fe-cn fe_tl"><u></u></i>
		<i class="fe-cn fe_tr"><u></u></i>
		<i class="fe-cn fe_bl"><u></u></i>
		<i class="fe-cn fe_br"><u></u></i>
		<div class="fe-cont"><button type="button" id="{%id%}" class="{%class%}">{%text%}</button></div>
	</div>
</div>
<!-- end:button -->

<!-- start:tab -->
<li><a class="tab-{%class%} loc-ref" href="#{%href%}" id="{%id%}"><i><u></u></i><span class="name">{%text%}</span></a></li>
<!-- end:tab -->

<!-- start:text -->
<div class="formelem fe-text">
	<div class="fe-body">
		<i class="fe-cn fe_tl"><u></u></i>
		<i class="fe-cn fe_tr"><u></u></i>
		<i class="fe-cn fe_bl"><u></u></i>
		<i class="fe-cn fe_br"><u></u></i>
		<div class="fe-cont"><textarea rows="3" id="{%id%}" name="{%name%}" ></textarea></div>
	</div>
</div>
<!-- end:text -->

<!-- start:paginator -->
<div id="{%id%}" class="paginator" ondblclick="{%ondblclick%}">
	<div class="control">
		<h4>Страницы</h4>
		<!-- start:main_pager_start --><a href="#" name="page={%num_min%}" class="pg_d page-prev">Опа</a><!-- end:main_pager_start -->
		<!-- start:main_pager_fin --><a href="#" name="page={%num_max%}" class="pg_d page-next">Ать</a><!-- end:main_pager_fin -->
	</div>
	<div class="page-nums">
		<!-- start:main_pager_n --><a href="#" name="page={%num%}" class="pg_d page-num {%selected%}">{%num%}</a><!-- end:main_pager_n -->
	</div>
</div>
<!-- end:paginator -->

<!-- start:notify_new_message -->

<p>Новое сообщение от <a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}" /></u></i><b>{%user_name%}</b></a></p>
<p>{%message%}</p>


<!-- end:notify_new_message -->

<!-- start:notify_new_avatar -->

<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}" /></u></i><b>{%user_name%}</b></a> обноовил свой аватар</p>


<!-- end:notify_new_avatar -->


<!-- start:notify_new_photo -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> обновил свою фотографию</p>
<!-- end:notify_new_photo -->



<!-- start:notify_online -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> Зашел на сайт</p>
<!-- end:notify_online -->

<!-- start:notify_change_profile -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> изменил свой профиль</p>
<!-- end:notify_change_profile -->


<!-- start:notify_object_like -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> полюбил объект <a href="/object/{%event_id%}">{%event_name%}</a></p>
<!-- end:notify_object_like -->


<!-- start:notify_object_ban -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> возненавидел объект<a href="/object/{%event_id%}">{%event_name%}</a></p>
<!-- end:notify_object_ban -->

<!-- start:notify_event_add -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> добавил <a href="/event/{%event_id%}">{%event_name%}</a> в свой календарь</p>
<!-- end:notify_event_add -->


<!-- start:notify_event_ban -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> удалил <a href="/event/{%event_id%}">{%event_name%}</a> из своего календаря</p>
<!-- end:notify_event_ban -->


<!-- start:notify_user_online -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> появился ONLINE</p>
<!-- end:notify_user_online -->

<!-- start:notify_user_friended -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> добавил вас в друзья</p>
<!-- end:notify_user_friended -->

<!-- start:notify_user_unfriended -->
<p><a href="/profile/{%user_name%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}"  /></u></i><b>{%user_name%}</b></a> удалил Вас из друзей</p>
<!-- end:notify_user_unfriended -->

<!-- start:ib_navigation -->
<div class="navigation">
	<table>
		<tr>
			<th style="width: 26%">Что?</th>
			<th style="width: 37%">Где?</th>
			<th style="width: 37%">Личный кабинет</th>
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
			<td>
				<!-- <h2><a href="/profile/calendar">Календарь</a></h2>
				<h2><a href="/profile/favourite">Любимые места</a></h2>
				<h2><a href="/profile/messages">Сообщения</a></h2>
				<h2><a href="/profile/friends">Друзья</a></h2>
				<h2>&nbsp;</h2> -->
				<h2><a href="/">Главная</a></h2>
				<!--
				<h2><a href="/profile/friends">Выйти</a></h2>
				<h2><a href="/profile/friends">Войти</a></h2>
				<h2><a href="/profile/friends">Регистрация</a></h2>
				-->
			</td>
		</tr>
	</table>
</div>
<!-- end:ib_navigation -->

<!--  -->
	<div class="user-nav-towel">
		<div class="user-nav-towel-content">
			<ul>
				<li id="profCalendar"><a href="/profile#proTab|slo/calendar">Календарь</a></li>
				<li id="profFavour"><a href="/profile#proTab|slo/favourite">Любимые места</a></li>
				<li id="profMessages"><a href="/profile#proTab|slo/messages">Сообщения</a></li>
				<li id="profFriends"><a href="/profile#proTab|slo/friends">Друзья</a></li>
			</ul>
		</div>
	</div>
<!--  -->