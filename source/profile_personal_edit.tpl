<table class="page_personal" width="100%">
	<tr>
		<td class="navigation">
			<ins class="min-widther"></ins>
		</td>
		<td class="content">
			
			<form name="personal" id="editPersonal" method="POST" action="/profile/{%user_id%}/edit" class="person_data">
				<table class="iform">
					<tr>
						<td class="name"><label for="">Фамилия, имя</label></td>
						<!-- <td class="field"><push:static.input name="name" value="{%name%}"></td>  -->
						<td class="field"><push:static.input name="name" value="{%name%}"></td>
					</tr>
					<tr>
						<td class="name"><label for="">E-mail</label></td>
						<td class="field"><push:static.input name="email" value="{%email%}"></td>
					</tr>
					<tr>
						<td class="name"><label for="">Сменить пароль</label></td>
						<td class="field">Текущий пароль<push:static.password name="curr_pass"></td>
						
					</tr>
					
					<tr>
						<td class="name"></td>
						
						<td class="field">Новый пароль  <push:static.password name="new_pass"></td>
					</tr>
					
					
					<tr>
						<td class="name"></td>
						
						<td class="field">Поддтверждение нового пароля  <push:static.password name="retype_pass"></td>
					</tr>
					
					<tr>
						<td class="name">Пол</td>
						<td class="field">
							<div class="g_selector-box">
								<input type="radio" name="sex" value="male" />
								<label>М</label>
							</div>
							<div class="g_selector-box">
								<input type="radio" name="sex" value="female" />
								<label>Ж</label>
							</div>
						</td>
					</tr>
					<tr>
						<td class="name"><label for="">Дата рождения</label></td>
						<td class="field">
							<select id="birthDay" name="b_date"></select>
							<select id="birthMonth" name="b_month"></select>
							<select id="birthYear" name="b_year"></select>
						</td>
					</tr>
					<tr>
						<td class="name"><label for="">ICQ</label></td>
						<td class="field"><push:static.input name="icq" value="{%icq%}" ></td>
					</tr>
					<tr>
						<td class="name"><label for="">Skype</label></td>
						<td class="field"><push:static.input name="skype" value="{%skype%}" ></td>
					</tr>
					<tr>
						<td class="name"><label for="">MSN</label></td>
						<td class="field"><push:static.input name="msn" value="{%msn%}" ></td>
					</tr>
					<tr>
						<td class="name"><label for="">gtalk</label></td>
						<td class="field"><push:static.input name="gtalk" value="{%gtalk%}" ></td>
					</tr>
					<tr>
						<td class="name">Оповещения на e-mail</td>
						<td class="field">
							<div class="g_selector-box">
								<input type="checkbox" name="subscribe" {%subscribe%}/>
								<label>Рассылка новостей сайта</label>
							</div>
							<div class="g_selector-box">
								<input type="checkbox" name="email_friended" {%email_friended%}/>
								<label>Добавили в друзья</label>
							</div>
							<div class="g_selector-box">
								<input type="checkbox" name="email_private" {%email_private%}/>
								<label>Личные сообщения</label>
							</div>
							<div class="g_selector-box">
								<input type="checkbox" name="email_recommended" {%email_recommended%}/>
								<label>Рекомендации друзей</label>
							</div>
						</td>
					</tr>
					<tr>
						<td class="name">Настройки</td>
						<td class="field">
							<div class="g_selector-box">
								<input type="checkbox" name="email_hide" {%email_hide%} />
								<label>Скрыть мой e-mail</label>
							</div>
						</td>
					</tr>
					<tr>
						<td></td>
						<td class="buttons">
							<push:static.button id="saveProfile" text="Сохранить">
						</td>
					</tr>
				</table>
			</form>

		</td>
		<td class="extra">
			<ins class="min-widther"></ins>
			
			<form enctype="multipart/form-data" method="post" action="/profile/{%user_id%}/photo" id="uploadPhoto">
				<img src="/usr/pic/avatar/{%u_pic%}" id="cur_photo"/>
				
				<div style="margin-top: 5px;">
					<span style="color: #b1b1b1; font-size: 9px">Сменить картинку:</span><br>
					<input type="file" name="photos"/>
					<push:static.button id="uploadFileP" text="ОК">
				</div>
			</form>
		</td>
	</tr>
</table>

<script>
	_mt.dateSelect.fill( 1950, 1995, "#birthDay", "#birthMonth", "#birthYear", {%day%}, {%month%}, {%year%} );
	$('#uploadFileP').click(_mt.profile.uploadPhoto);
	$('#saveProfile').click(_mt.profile.editPersonal);
</script>