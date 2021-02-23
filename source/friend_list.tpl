<script>
	addBubble();
</script>

<form id="friend-list" class="friends">
	<h2>{%friend_count%} друга</h2>
	<ul>
		<!-- start:fiend_rows -->
		<li>
			<a href="#" class="user{%friend%}" id="{%friend_id%}">
				<span class="avatar"><img src="/usr/pic/avatar/{%friend_image%}" /></span>
				<span class="user-name" ><i class="icon"></i><u>{%friend_name%}</u></span>
			</a>
		</li>
		<!-- end:fiend_rows -->
		
	</ul>
</form>
