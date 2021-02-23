<div class="page-friends" id="friends">
	
	<h2>Друзья</h2>
	
	<table class="l-body">
		<tr>
			<td class="l-submenu">
				<ins class="min-widther"></ins>
				<ul class="submenu links">
					<li class="{%friends_sel%}"><span><a href="/profile/{%user_name%}/friends" class="cmd-lp-fract">Взаимные друзья</a></span><ins></ins></li>
					<li class="{%friends_wbe_sel%}"><span><a href="/profile/{%user_name%}/friends/wannabe" class="cmd-lp-fract">Хотят дружить</a></span><ins></ins></li>
					<li class="{%friends_wto_sel%}"><span><a href="/profile/{%user_name%}/friends/wannato" class="cmd-lp-fract">Хочу дружить</a></span><ins></ins></li>
				</ul>
			</td>
			<td class="l-content">
				<div class="page page-friends">
					<table width="100%">
						<tr>
							<td class="l-friends">
								
								<div id="friend-list" class="friends">
									<!-- start:friend_count -->
									<!-- <h2>{%count%}</h2> -->
									<!-- end:friend_count -->
									<ul>
										<!-- start:friend_row -->
										<li>
											<a href="/profile/{%friend_name%}" class="user {%is_friend%}{%wants_friends%}{%is_visible%}" id="user_{%friend_name%}">
												<span class="avatar"><img src="/usr/pic/avatar/{%friend_avatar%}" /></span>
												<span class="user-name" ><i class="icon"></i><u>{%friend_name%}</u></span>
											</a>
										</li>
										<!-- end:friend_row -->
									</ul>
								</div>
								
							</td>
							<td class="l-activity">
								<ins class="min-widther"></ins>
								
								<!-- start:user_activity -->
								<ul class="activity">
									
									<!-- start:wrap_user_nick -->
									<a href="/profile/{%user_id%}" class="b-user"><i><u><img src="/usr/pic/avatar/{%avatar%}" /></u></i><b>{%user_name%}</b></a>
									<!-- end:wrap_user_nick -->
									
									<!-- start:wrap_link --><a href="{%link%}">{%title%}</a><!-- end:wrap_link -->
									
									<!-- start:wrap_avatar -->					
										<img src="/usr/pic/avatar/{%avatar%}" width="50" />						
									<!-- end:wrap_avatar -->
									
									<!-- start:activity_row -->					
									<li class="op-{%activity_type%}">
										<small>{%time%}</small>
										{%row%}
									</li>					
									<!-- end:activity_row -->
									
								</ul>
								<!-- end:user_activity -->
							</td>
							
						</tr>
					</table>
				
				</div>
				
				<script>_mt.profile.resetHandlers();</script>
			</td>
		</tr>
	</table>
</div>



