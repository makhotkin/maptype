<div class="page page-messages">
	<h2>Сообщения</h2>
	<table class="l-body">
		<tr>
			<td class="l-submenu" id="menu_place">
				<ins class="min-widther"></ins>

				<ul class="submenu">
					<li><span class="new-mes"><a href="/profile/messages/compose" class="cmd-lp-msgbox"><i></i>Написать сообщение</a></span></li>
				</ul>
				<ul class="submenu">
					<li><span class="all"><a href="/profile/messages/all" class="cmd-lp-msgbox"><i></i>Все</a><ins>{%all_count%}</ins></span></li>
					<li class="selected"><span class="inbox"><a href="/profile/messages/inbox" class="cmd-lp-msgbox"><i></i>Входящие</a><ins>{%inbox_count%}</ins></span></li>
					<li><span class="outbox"><a href="/profile/messages/outbox" class="cmd-lp-msgbox"><i></i>Исходящие</a><ins>{%outbox_count%}</ins></span></li>
				</ul>

			</td>
			<td class="l-content" id="list_place">
				<!-- start:message_no_friends -->
				<h3>Написать сообщение</h3>
				<div class="messahes messages-create">
					У вас нет друзей, и поэтому вы не можете писать никому сообщения
				</div>
				<!-- end:message_no_friends -->
				<!-- start:messages_compose -->
				<h3>Написать сообщение</h3>
				<div class="messages messages-create">
					<form>
						<table class="iform">
							
							<tr>
								<th width="100"><label style="font-weight: normal">Кому</label></th>
								<td width="100%">
									<div class="b-suggestion b-suggestion-multiselect" style="z-index: 4">
										<!-- Текст -->
										<div class="formelem fe-text" style="z-index: 4;">
											<div class="fe-body">
												<i class="fe-cn fe_tl"><u></u></i>
												<i class="fe-cn fe_tr"><u></u></i>
												<div class="fe-cont" id="recvList"><input type="text"/></div>
												<i class="fe-cn fe_bl"><u></u></i>
												<i class="fe-cn fe_br"><u></u></i>
											</div>
										</div>
										<!-- Текст -->
										<ul class="b-usernames-selector" id="suggestRecv" style="display: none">
										</ul>
									</div>
								</td>
							</tr>
							<tr>
								<th><label style="font-weight: normal">Что</label></th>
								<td>
									<!-- Текст -->
									<div class="formelem fe-text" style="width: 100%">
										<div class="fe-body">
											<i class="fe-cn fe_tl"><u></u></i>
											<i class="fe-cn fe_tr"><u></u></i>
											<div class="fe-cont"><textarea rows="3" id="composeText" style="width:100%"></textarea></div>
											<i class="fe-cn fe_bl"><u></u></i>
											<i class="fe-cn fe_br"><u></u></i>
										</div>
									</div>
									<!-- Текст -->
								</td>
							</tr>
							<tr>
								<th></th>
								<td class="buttons">
									<push:static.button text="Отправить" id="sendMessage" class="cmd-l-msgSend"/>
								</td>
							</tr>
						</table>
					</form>
				</div>
				<script>
					_mt.profile.initSuggest();
				</script>
				<!-- end:messages_compose -->
				
				<!-- start:messages_list -->

				<!-- start:message_inbox --><h3>Входящие</h3><!-- end:message_inbox -->
				<!-- start:message_outbox --><h3>Исходящие</h3><!-- end:message_outbox -->
				<!-- start:message_fullbox --><h3>Все сообщения</h3><!-- end:message_fullbox -->

				<div class="messages messages-inbox" id="msgList">
					<!-- start:filter_fullbox -->
					<div class="b-filter">
						Показать переписку с <select onchange="_mt.profile.onFilterChange()"><option>всеми</option><!-- start:msg_person --><option>{%name%}</option><!-- end:msg_person --></select>
					</div>
					<!-- end:filter_fullbox -->

					<div class="list">
						<table>
							<colgroup>
								<col class="l-user"/>
								<col class="l-message"/>
							</colgroup>
							<!-- start:pr_message -->
							<tr class="brief">
								<td>
									<span href="#" class="b-user">
										<a href="#"><i><u><img src="/usr/pic/avatar/{%avatar%}" /></u></i></a>
										<span><a href="/profile/{%user_name%}"><b>{%user_name%}</b></a><small>{%date%}</small></span>
									</span>
									
									<ul>
										<li><a href="/profile/messages/with/{%user_name%}" class="cmd-lp-msgHistory">История сообщений</a></li>
									</ul>
								</td>
								<td>
									<div class="message {%dir%}">
										<i class="message-icon"></i>
										<a href="/profile/messages/{%msg_id%}" class="cmd-lt-msgOpen msg-summary">{%summary%}</a>
										<span class="msg-fulltext">{%theme%} {%body%}</span>
									</div>
									
									<ul>
										<li><a href="#" class="cmd-delMsg"><i></i></a></li>
									</ul>
								</td>
							</tr>
							<!-- end:pr_message -->
							<tr class="reply" id="msgAnswerForm" style="display:none">
								<td>&nbsp;</td>
								<td>
									<form>
										<div class="formelem fe-text" style="width: 100%">
											<div class="fe-body">
												<i class="fe-cn fe_tl"><u></u></i>
												<i class="fe-cn fe_tr"><u></u></i>
												<div class="fe-cont"><textarea rows="3" id="{%id%}" name="{%name%}" style="width: 100%;"></textarea></div>
												<i class="fe-cn fe_bl"><u></u></i>
												<i class="fe-cn fe_br"><u></u></i>
											</div>
										</div>
										
										<div class="buttons" style="margin-top: 5px">
											<push:static.button text="Отправить" class="cmd-lt-msgSend1"/>
											<push:static.button text="Отменить" class="cmd-lt-msgCancel"/>
										</div>
										
									</form>
								</td>
							</tr>
						</table>
						<!-- start:main_pager -->
						<include src="static.paginator" ondblclick="return{url:'{%dir_url%}',dest:'#list_place'}"/>
						<!-- end:main_pager -->
					</div>
				</div>
				<!-- end:messages_list -->
				
				<!-- start:recieved_from -->
				<br />
				<span style="font-size:10px; color:#999999;">Кому: {%to_user_id%}</span>
				<!-- end:recieved_from -->
				
			</td>
		</tr>
	</table>
</div>	
