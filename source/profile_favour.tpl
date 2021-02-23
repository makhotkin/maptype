<style>
.category_listing {}
.cat_fav_info {
	font-size:10px;
	color:#CCCCCC;
	text-decoration:underline;
	padding-left:5px;
}
.header_fav {
	border-bottom:1px solid #CCCCCC;
	margin-bottom:5px;
}
.category_listing {
padding-top:10px;
}
</style>

<!-- start:favour_objects -->
<h2>Любимые места</h2>
<table class="l-body">
	<tr>
		<td class="l-submenu">
			<ins class="min-widther"></ins>
			<ul class="submenu">
				<!-- start:favour_total -->
				<li class="all"><a href="/profile/{%username%}/favourite/all" class="cmd-catFav cat_all">Все</a><ins>{%count%}</ins></li>
				<!-- end:favour_total -->
				<!-- start:favour_cat -->
				<li><a href="/profile/{%username%}/favourite/cat/{%cat_id%}" class="cmd-catFav cat{%cat_id%}">{%cat_title%}</a><ins>{%count%}</ins></li>
				<!-- end:favour_cat -->
				<!-- start:recycle_url -->
				<li class="deleted"><a href="{%del_url%}" class="cmd-catFav cat_del">Удаленные</a><ins>{%del_count%}</ins></li>
				<!-- end:recycle_url -->
			</ul>
		</td>
		<td class="l-content" id="obj_result">
		<!-- start:main_ajax_favourite_objects -->
			<!-- start:favourite_objects -->
			<ul class="search-results_list list" id="objectSearch">
				{%favour_object_list%}
			</ul>
			<!-- end:favourite_objects -->
			<!-- start:main_pager -->
			<include src="static.paginator" ondblclick="return{url:'{%dir_url%}',dest:'#obj_result'}"/>
			<!-- end:main_pager -->
		<!-- end:main_ajax_favourite_objects -->
		</td>
	</tr>
</table>
<!-- end:favour_objects -->

<!--
<div class="promo {%dir_or_cat%}" id="object{%id%}">
	<h6><a href="{%url%}" class="name cmd-objRef">{%title%}</a></h6>
	<div class="promo-categoty">{%cat%}</div>
	<address>{%way%}</address>
	<div class="promo-body">
		
	</div>
</div>
-->


<!-- start:object_row -->
<li class="promo {%dir_or_cat%}" id="object{%id%}">
	<h6><a href="{%url%}" class="name cmd-objRef">{%title%}</a></h6>
	<i>{%cat%}</i>
	<address>{%adress%}</address>
	<span class="homesite">{%way%}</span>
	<div class="container" style="height:20px; width:250px; ">{%event_rating%}</div>
</li>
<!-- end:object_row -->
