<!-- start:user_list -->
    <li>
        <a href="{%user_url%}" class="user{%friend%}" style="clear: both; zoom: 1; overflow: hidden; display: block">
            <span class="avatar"><img src="{%user_avatar%}" style="float: left; background: yellow; margin-right: 5px;" width="25" height="25" /></span>
            <span class="user-name" style="float: left;"><i class="icon"></i><u>{%user_name%}</u></span>
        </a>
    </li>  
<!-- end:user_list -->



<!-- start:user_pager -->
	<div class="pageselect">
		<!-- start:user_pager_n -->
		<a class="movePage" page="{%num%}" href="#{%num%}" >{%num%}</a>
		<!-- end:user_pager_n -->
		<!-- start:main_pager_start -->
		<span class="leftright">&lt; <a class="movePage" page="{%num_min%}" href="#{%num_min%}">Туда</a> 
		<!-- end:main_pager_start -->
		<!-- start:main_pager_fin -->
		<a href="#{%num_max%}" class="movePage" page="{%num_max%}">Сюда</a> &gt;</span>
		<!-- end:main_pager_fin -->
	</div>
<!-- end:user_pager -->