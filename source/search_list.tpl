<div id="search-results" class="search">
	<!-- start:search_status -->
	<h5>Результаты поиска по слову &laquo;{%whatYouSearch%}&raquo;</h5>
	<script>
	$(document).ready(function(){
	
	$("#resultSearchMenu a:first").addClass('selected');
	
	});
	
	
	</script>
	<!-- end:search_status -->
	
	<!-- Меню -->
	<ul id="resultSearchMenu" class="submenu1 menu" ondblclick="return { url:'/search_engine', dest:'#search_tabs', tabs: '#resultSearchMenu a'};">
		
		
		
		
		<!-- start:lenta_resulttab --><li><!--
			--><a href="#" id="eventTab" name="search={%search_term%}&tab=event&page=1" class="tab-"><!--
				--><i><u></u></i><span class="name">События</span><!--
			--></a><sup>{%lenta_count%}</sup><!--
		--></li><!-- end:lenta_resulttab -->
		<!-- start:street_resulttab -->
		<li><!--
			--><a href="#" id="streetTab" name="search={%search_term%}&tab=street&page=1" class="tab-"><!--
				--><i><u></u></i><span class="name">Улицы</span><!--
			--></a><sup>{%street_count%}</sup><!--
		--></li><!-- end:street_resulttab -->
		
		<!-- start:object_resulttab --><li><!--
			--><a href="#" id="objectTab" name="search={%search_term%}&tab=object&page=1" class="tab-"><!--
				--><i><u></u></i><span class="name">Объекты</span><!--
			--></a><sup>{%object_count%}</sup><!--
		--></li><!-- end:object_resulttab --><!-- start:tag_resulttab --><li><!--
			--><a href="#" id="tagTab" name="search={%search_term%}&tab=tag&page=1" class="tab-"><!--
				--><i><u></u></i><span class="name">Теги</span><!--
			--></a><sup>{%tag_count%}</sup><!--
		--></li><!-- end:tag_resulttab --><!-- start:user_resulttab --><li><!--
			--><a href="#" id="userTab" name="search={%search_term%}&tab=user&page=1" class="tab-"><!--
				--><i><u></u></i><span class="name">Пользователи</span><!--
			--></a><sup>{%user_count%}</sup><!--
		--></li>
		<!-- end:user_resulttab -->
	</ul>
	<!-- /Меню -->
	<!--
	<div class="g_selector-box" >
		<input type="checkbox" name="cafe" value="" />
		<label for="cafe">Включить фильтрацию</label>
	</div>
	
	<div class="filter">
		<form class="iform">
			<div class="overflow">
				<div class="g_selector-box">
					<input type="checkbox" name="cafe" value="" />
					<label for="cafe">Кафе</label>
				</div>
				<div class="g_selector-box">
					<input type="checkbox" name="rest" value="" />
					<label for="rest">Рестораны</label>
				</div>
				<div class="g_selector-box">
					<input type="checkbox" name="muse" value="" />
					<label for="muse">Музеи</label>
				</div>
			</div>
		</form>
	</div>
	
	-->
	<div id="search_tabs" style="margin-top: 15px;">
		
		
		<!-- start:lentabox -->
		<ul id="eventSearch" class="list">
			<!-- start:lentaresult -->
			<li>
				<h6><a href="{%lenta_url%}" class="name cmd-locRef">{%lenta_title%}</a></h6>	
				<i>{%lenta_object%}</i><br />
				<span class="homesite">Дата проведения: {%lenta_date%}</span>
			</li>
			<!-- end:lentaresult -->
		</ul>
		{%main_pager%}
		<!-- end:lentabox -->
		
		
		
		<!-- start:streetbox -->
		<ul id="streetSearch" class="list">
			<!-- start:streetresult -->
			<li><h6><a href="#" onclick="map.showArea({%street_coords%}); return false;" class="name">{%street_title%}</a></h6></li>
			<!-- end:streetresult -->
		</ul>
		<!-- start:main_pager -->
		<div class="paginator" ondblclick="return {dest:'#search_tabs', url: '/search_engine'};">
				
			<div class="control">
				<h4>Страницы</h4>
				<!-- start:main_pager_start -->
				<span class="pg_d page-prev"><a href="#" name="page={%num_min%}&search={%search_term%}&tab={%tab_url%}">Опа</a></span>
				<!-- end:main_pager_start -->
				<!-- start:main_pager_fin -->
				<span class="pg_d page-next"><a href="#" name="page={%num_max%}&search={%search_term%}&tab={%tab_url%}">Ацц</a></span>
				<!-- end:main_pager_fin -->
			</div>
			<div class="page-nums">
				<!-- start:main_pager_n -->
				<a href="#" name="page={%num%}&search={%search_term%}&tab={%tab_url%}" class="pg_d page-num {%selected%}">{%num%}</a>
				<!-- end:main_pager_n -->
			</div>
		</div>
		<!-- end:main_pager -->
		
		
		<!-- end:streetbox -->
		
		
		
	
		<!-- start:objectbox -->
		<ul id="objectSearch" class="search-results_list list">
			<!-- start:objectresult -->
			<li>
				<h6><a href="{%object_url%}" class="name cmd-objRef">{%object_title%}</a></h6>
				<i>{%object_cat%}</i>
				<address>{%object_adress%}</address>
				<span class="homesite">{%object_way%}</span>
			</li>
			<!-- end:objectresult -->
		</ul>
		{%main_pager%}
		<!-- end:objectbox -->

		<!-- start:tagbox -->
		<ul id="tagSearch" class="search-results_list list">
			<!-- start:tagresult -->
			<li>
				<h6><a href="{%tag_url%}" class="name">{%tag_title%}</a></h6>
			</li>
			<!-- end:tagresult -->
		</ul>
		{%main_pager%}
		<!-- end:tagbox -->

		<!-- start:userbox -->
		<ul id="userSearch" class="search-results_list list">
			<!-- start:userresult -->
			<li>
				<a href="{%user_url%}" class="user{%friend%}" style="clear: both; zoom: 1; overflow: hidden; display: block">
					<span class="avatar"><img src="/usr/pic/avatar/{%user_pic%}" style="float: left; background: yellow; margin-right: 5px;" width="25" height="25" /></span>
					<span class="user-name" style="float: left;"><i class="icon"></i><u>{%user_name%}</u></span>
				</a>
			</li>
			<!-- end:userresult -->
		</ul>
		{%main_pager%}
		<!-- end:userbox -->
		
		<!-- start:js_activetab -->		
		<script>$('#{%tab_url%}Tab').addClass('selected');	
		
		
		</script>
		<!-- end:js_activetab -->
		
	</div>
	
</div>

