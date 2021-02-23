	<style>
	.messages_holder {
		width:100%; 
	}
	.m_links {
	color:#666666;
	margin-right:10px;
	padding:10px;
	
	}
	.m_sel {
	background-color:#EEEEEE;
	padding:10px;
	}
	.message_body {
	margin-top:15px;
	width:100%;
	
	
	}
	.mes {
		padding:5px;
		border:1px solid #EEEEEE;
		width:100%;
	
	}
	.message_dating {
	
		font-size:10px;
		color:#515151;
		margin-left:10px;
	}
	.message_title {
		font-size:10px;
		color:#515151;
		font-weight:bold;
		margin-left:10px;
		
	
	}
	.friend_history {
	padding:10px;
	margin-top:3px;
	
	}
	.message_over {
	
	background-color:#F7FCEF;
	
	
	}
	
	</style>
	
	<div class="messages_holder">
		<div class="links">
			<a class="m_links m_sel" link="inbox" href="#" >Входящие</a>
			<a class="m_links" href="#" link="out" >Исходящие</a>	
			<a class="m_links" href="#" id="history_with" link="history" >История</a>
			<a class="m_links" href="#" style="visibility:hidden" id="private_history" link="history" >История</a>
		</div>
		
		<div class="message_content">
		
	<!-- start:recieved_from -->
	<br />
	<span  style="font-size:10px; color:#999999;">Кому: {%to_user_id%}</span>
	<!-- end:recieved_from -->
	
	<!-- start:ajax_mess -->
	<script>
	function over_message(obj){
	$(obj).addClass('message_over');	
	}
	
	function out_message(obj){
	$(obj).removeClass('message_over');	
	}
	
	</script>
			
			<!-- start:pr_message -->
			
			<div class="message_body" onmouseover="over_message(this)" onmouseout="out_message(this)">
			
			<table width="100%" border="0" class="mes">				
					<tr>
						<td colspan="2" width="100%"  align="left" style="padding:5px;" >
						<a href="/profile/{%user_name%}">{%user_name%}</a>
						<span class="message_title">{%theme%}</span>
						<span class="message_dating">{%date%}</span>					
						</td>
					</tr>				
					<tr>
						<td width="3%" align="center" style="padding:2px;">
						<img src="/usr/pic/avatar/{%avatar%}"  width="25" height="25"/>							
						</td>
						<td style="padding:5px;" >
						{%body%}
						{%from%}	
						</td>
					</tr>
					
			</table>
			
			
			</div>
			
			<!-- end:pr_message -->
		
	<!-- end:ajax_mess -->
		
			
	
		
		
		</div>
		
		
	
	</div>
	
	<script>
	
	$(document).ready(function(){
		
		$(".links a").each(function(){
			
			$(this).click(function(){			
				
				var linked = $(this).attr("link");
				
				if ( $(this).hasClass("m_sel") ){}
				else {
					$("#private_history").css({visibility:"hidden"});
					$.get("/profile/messages/"+linked,'',function(e){
					
						$(".message_content").html(e);
					});
					
				}
				
				$(".messages_holder a").removeClass("m_sel");
				
				$(this).addClass("m_sel");
				
				
				
				
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
	
	
	
