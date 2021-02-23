<table width="100%">
	<tr>
		<td class="navigation">
			<ins class="min-widther"></ins>
			
			<ul class="submenu links">
				<li class="all"><a href="#all" link="all" class="m_sel">Все</a><ins></ins></li>
				<li><a href="#inbox" link="inbox">Входящие</a><ins></ins></li>
				<li><a href="#outbox" link="out">Исходящие</a><ins></ins></li>
			</ul>
			
			<!--
			<ul>
				<li><a href="#history" id="history_with">История</a></li>
			</ul>
			-->
			
		</td>
		<td class="content" id="message_content">
			
			<!-- start:recieved_from -->
			<br />
			<span  style="font-size:10px; color:#999999;">Кому: {%to_user_id%}</span>
			<!-- end:recieved_from -->
			
			
			<!-- start:ajax_mess -->

				<!-- start:pr_message -->
				<dl class="_message" style="border: 1px solid #f4f4f4; margin-bottom: 20px;">
					<dt>
						<img src="/usr/pic/avatar/{%avatar%}" width="25" height="25" style="position: absolute; margin-left: -30px"/>
						<a href="/profile/{%user_name%}">{%user_name%}</a>
						<small>{%date%}</small>
						<h5>{%theme%}</h5>
					</dt>
					<dd>
						{%body%}
						{%from%}
					</dd>
				</dl>
				<!-- end:pr_message -->
			
			<!-- end:ajax_mess -->
			
		</td>
	</tr>
</table>


<script>
	$(document).ready(function(){
		$(".links a").each(function(){
			$(this).click(function(){
				var linked = $(this).attr("link");
				if ($(this).hasClass("m_sel")) {
				} else {
					/* $("#private_history").css({visibility:"hidden"}); */
					$.get("/profile/messages/"+linked,'',function(e){
						$("#message_content").html(e);
					});
				}
				/*
				$(".messages_holder a").removeClass("m_sel");
				$(this).addClass("m_sel");
				*/
			});
		});
	});	
</script>	

<!-- start:messages_history -->
			
		<script>
		$(document).ready(function(){
			$(".user_history").each(function(){
				$(this).click(function(){
					var user_id = $(this).attr("num");
					$("#history_with").removeClass("m_sel");
					$("#private_history").css({visibility:"visible"}).addClass("m_sel").html("История с " + $(this).html());
					$.get("/profile/messages/with/"+user_id,'',function(e){
						$(".message_content").html(e);
					});
				});
			});
		});
		</script>
		
		<!-- start:build_friends -->
			<div class="friend_history">
			
				<!-- start:friend_row -->
				<div class="user" style="margin-bottom:10px;">
				<img src="/usr/pic/avatar/{%avatar%}"   width="25" height="25"/>	
				<a href="#" class="user_history" num="{%user_id%}" >{%user%}</a>
				</div>	
				<!-- end:friend_row -->
			
			</div>		
		<!-- end:build_friends -->
	
	
	<!-- end:messages_history -->
	
	
	
