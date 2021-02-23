<!-- start:event_timeline -->
<ul class="submenu1 menu" style="margin-top:-15px;">
	<!-- start:now --><li><!--
		--><a id="review" class="cmd-locRef {%selected%}" href="/dir{%dir_id%}now"><i><u></u></i><span class="name">Настоящее</span></a><!--
	--></li><!-- end:now --><!-- start:future --><li><!--
		--><a id="review" class="cmd-locRef {%selected%}" href="/dir{%dir_id%}future"><i><u></u></i><span class="name">Будущее</span></a><!--
	--></li><!-- end:future --><!-- start:past --><li><!--
		--><a id="review" class="cmd-locRef {%selected%}" href="/dir{%dir_id%}past"><i><u></u></i><span class="name">Прошлое</span></a><!--
	--></li><!-- end:past -->
</ul>
<!-- end:event_timeline -->
<div id="mainList">
	<!-- start:event -->
		<include src="static.event_block" />
	<!-- end:event -->
	<!-- start:noevents -->
		Список пуст
	<!-- end:noevents -->
	
	<!-- start:main_pager -->
	<include src="static.paginator" ondblclick="return{url:'{%dir_url%}',dest:'#content'}" />
	<!-- end:main_pager -->
</div>


<push:static.ib_navigation >

<script type="text/javascript">
	<!-- start:lenta_coords -->
	var mlSettings = { cnt:0{%count%}, mode:"{%lenta_mode%}", ref:"{%dir_id%}{%when%}" };
	if ( 0{%dir_id%} ) _mt.setSettings( 'rrr', { loaded: '/dir{%dir_id%}' } );
	_mt.loadComponent( 'mainlist', CMainList, mlSettings );
	_mt.setSettings('marks', { eventPlace: {%lenta_script%} } );
	<!-- end:lenta_coords -->
	
	<!-- start:lenta_coords_ajax -->
	if ( 0{%dir_id%} ) _mt.rrr.sync( '/dir{%dir_id%}' );
	else _mt.rrr.sync( 'root' );
	map.marks.setEventPlaces( {%lenta_script%} );
	var mlSettings = { cnt:0{%count%}, mode:"{%lenta_mode%}", ref:"{%dir_id%}{%when%}" };
	if ( !_mt.mainlist ) _mt.addComponentNow( 'mainlist', CMainList, mlSettings );
	_mt.mainlist.setHandlers( mlSettings );
	<!-- end:lenta_coords_ajax -->
</script>
