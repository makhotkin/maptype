<div id="search-results" class="cat">

	<!-- start:search_status -->
	<h5>Вы искали &laquo;{%whatYouSearch%}&raquo;</h5>
	<!-- end:search_status -->
	
	<!-- Заголовок -->
	<!-- start:thread -->
	<div id="eventShapka" class="matryoshka">
		<!-- <img src="{%category_picture%}" class="icon" /> -->
		<h1><a href="{%category_url%}" >{%category_name%}</a></h1>
		<table width="100%">
			<tr>
				<td width="100%">
					<h3>{%title%}</h3>
				</td>
			</tr>
		</table>
	</div>
	<!-- end:thread -->
	<!-- /Заголовок -->
	
	<!-- Меню -->
	<ul class="submenu1 menu" id="catSearchMenu">
		<!-- start:object_resulttab --><li><!--
			--><a href="#objectsTable" class="selected cmd-tabula"><i><u></u></i><span class="name ob">Объекты</span></a><!--
			--><sup>{%object_count%}</sup><!--
		--></li><!-- end:object_resulttab --><!-- start:near_resulttab --><li><!--
			--><a href="#nearSearch" class="cmd-tabula-showPoint"><i><u></u></i><span class="name sh">Шаговая доступность</span></a><!--
			--><sup>{%near_count%}</sup><!--
		--></li><!-- end:near_resulttab -->
		<!-- <div class="submenu-shadow"></div> -->
	</ul>
	<!-- /Меню -->


	<!-- Объекты -->
	<!-- start:objectbox -->
	<div id="objectsTable">
		<script type="text/javascript">
			function placeAlphabet(alphabet_type, target, letrs_have ){
				var alphabet = ["АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
				var result = [];
				var len = alphabet[alphabet_type].length;
				for (var i=0; i<len; i++)
				{
					var letter = alphabet[alphabet_type].substring(i,i+1);
					if ( -1 != letrs_have.indexOf( letter ) )
						result.push( '<span class="letter"><a href="/cat{%category_id%}" name="' + letter + '" class="cmd-letter loc-ref">'+letter+'</a></span>' );
					else
						result.push( '<span class="letter">'+letter+ '</span>' );
				}
				$(target).html(result.join(""));
			}
		</script>
		
		<!-- Фильтр -->
		<div class="filter" id="letterSoup" style="margin-bottom: 15px"><!--
			--><div style="width: 1.5em; text-align: right"><span class="letter"><a href="/cat{%category_id%}" class="selected cmd-locRef">Все</a></span></div><!--
			--><div id="filter-alphabet-cyrillic" class="alphabet"></div><!--
			--><div style="width: 1.5em; text-align: right"><span class="letter"><a href="##">#</a></span></div><!--
			--><div id="filter-alphabet-roman" class="alphabet"></div><!--
		--></div>
		<!-- /Фильтр -->
		
		<ul class="search-results_list list" id="objectSearch">
			<!-- start:objectresult -->
			<li id="object{%id_object%}">
				<h6><a href="/object/{%id_object%}" class="name cmd-objRef">{%object_title%}</a></h6>
				<i>{%object_cat%}</i>
				<address>{%object_adress%}</address>
				<span class="homesite">{%object_way%}</span>
			</li>
			<!-- end:objectresult -->
		</ul>
		
		<!-- start:main_pager___ -!->
		<include src="static.paginator" id="pages" ondblclick="return {dest:'#content', url:'/cat{%category_id%}'};"/>
		<!-!- end:main_pager___ -->

		<!-- start:main_pager -->
		<include src="static.paginator_2" href="/cat{%category_id%}" />
		<!-- end:main_pager -->
		
		<!-- Навигация -->
		<include src="static.ib_navigation" />
		<!-- /Навигация -->
		
		<script>
			placeAlphabet( 0, "#filter-alphabet-cyrillic", '{%letters_all%}', {%category_id%} );
			placeAlphabet( 1, "#filter-alphabet-roman", '{%letters_all%}', {%category_id%} );
		</script>
		
	</div>
	<!-- end:objectbox -->
	<!-- /Объекты -->

	<!-- start:object_nearbox -->
	<!-- Шаговая доступность -->
	<div id="nearSearch" <!-- start:nearest_point_class -->class="point{%point_id%}"<!-- end:nearest_point_class --> style="display:none;">
		<table width="100%" height="100%">
			<tr>
				<td>
					<!-- Статичная часть -->
					<div class="content_solid">

					</div>
					<!-- /Статичная часть -->
				</td>
			</tr>
			<tr>
				<td height="100%">
					<!-- Резиновая часть -->
					<div class="content-oveflow_fluid">
						<div>
							<!--  start:no_near_obejcts -->
							Поблизости нет объектов выбранного типа
							<!--  end:no_near_obejcts -->
							<!--  start:no_points -->
							Отметьте себя на карте, чтобы мы могли показать ближайшие объекты
							<!--  end:no_points -->
							<ul class="list">
								<!-- start:object_nearItem -->
								<li style="margin-left: 10px" id="object{%id_object%}">
									<h6>
										<a href="{%object_url%}" class="name cmd-objRef">{%object_title%}</a>
									</h6>
									<i>{%object_cat%}</i>
									<address>{%object_adress%}</address>
									<span class="homesite">{%object_way%}</span>
								</li>
								<!-- end:object_nearItem -->
								<!-- start:objectresult_near5 -->
								<li>
									<h2 style="color: #cc0000; font-size: 11px">5 минут</h2>
									<ul class="search-results_list">
										{%object_nearItemPlace%}
									</ul>
								</li>
								<!-- end:objectresult_near5 -->
		
								<!-- start:objectresult_near10 -->
								<li>
									<h2 style="color: #cc0000; font-size: 11px">10 минут</h2>
									<ul class="search-results_list">
										{%object_nearItemPlace%}
									</ul>
								</li>
								<!-- end:objectresult_near10 -->
		
								<!-- start:objectresult_near15 -->
								<li>
									<h2 style="color: #cc0000; font-size: 11px">15 минут</h2>
									<ul class="search-results_list">
										{%object_nearItemPlace%}
									</ul>
								</li>
								<!-- end:objectresult_near15 -->
							</ul>
							
						</div>
					</div>
					<!-- /Резиновая часть -->
				</td>
			</tr>
		</table>
	</div>
	<!-- /Шаговая доступность -->
	<!-- end:object_nearbox -->	
</div>


<script>
<!-- start:js_cat_initial -->
	_mt.setSettings( 'marks', { autoloadCategory: '{%category_class%}' } );
	_mt.setSettings( 'rrr', { loaded: '/cat{%category_id%}' } );
	_mt.loadComponent( 'mainlist', CMainList );
<!-- end:js_cat_initial -->
<!-- start:js_cat_ajax -->
	map.marks.selectObject(0);
	map.marks.setAutoloadCategory( '{%category_class%}' );
	_mt.rrr.sync( '/cat{%category_id%}' );
	if ( !_mt.mainlist ) _mt.addComponentNow( 'mainlist', CMainList );
	_mt.mainlist.setHandlers();	
<!-- end:js_cat_ajax -->
</script>


