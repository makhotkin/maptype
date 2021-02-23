<!-- start:login -->
<script>_mt.loadComponent( "auth", CAuthForm, { startYear: {%REG_START_YEAR%}, endYear: {%REG_END_YEAR%} } );</script>
<!-- Форма регистрации -->

<!-- 
<form id="registration_" style="display: none">
	
	<div id="registration-error_" class="form-errors">
		<ul></ul>
	</div>
	
	<table class="form-fields">
		<tbody>
			<tr class="field-login">
				<th><label for="registerLogin">{%LANG_REG_LOGIN%}</label></th>
				<td>
					<push:static.input id="registerLogin" name="login">
					<small class="field-descr">{%LANG_REG_LOGIN_DESCR%}</small>
				</td>
			</tr>
			<tr class="field-pass">
				<th><label for="reg-pass">{%LANG_REG_PASSWORD%}</label></th>
				<td>
					<push:static.password id="reg-pass" name="password">
					<small class="field-descr">{%LANG_REG_PASSWORD_DESCR%}</small>
				</td>
			</tr>
			<tr class="field-cpass">
				<th><label for="reg-pass">{%LANG_REG_CONFIRM%}</label></th>
				<td><push:static.password id="reg-pass" name="confirm"></td>
			</tr>
			<tr class="field-mail">
				<th><label for="reg-email">{%LANG_REG_MAIL%}</label></th>
				<td><push:static.input id="reg-email" name="email"></td>
			</tr>
			<tr class="field-birth">
				<th><label for="reg-dob">{%LANG_REG_B%}</label></th>
				<td>
					<div class="formelem fe-select" id="rBirthDay" style="width: 42px; font-size: 11px; //width: auto;">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
							<div class="fe-cont">
								<div class="fe-select-elem">
									<span><b id="userBirthDay">день</b><i></i></span>
									<ul class="j-hidden" style="//height: 150px;">
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="formelem fe-select" id="rBirthMonth" style="width: 70px; font-size: 11px; //width: auto;">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
							<div class="fe-cont">
								<div class="fe-select-elem">
									<span><b id="userBirthMonth">месяц</b><i></i></span>
									<ul class="j-hidden">
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="formelem fe-select" id="rBirthYear" style="width: 47px; font-size: 11px;">
						<div class="fe-body">
							<i class="fe-cn fe_tl"><u></u></i>
							<i class="fe-cn fe_tr"><u></u></i>
							<i class="fe-cn fe_bl"><u></u></i>
							<i class="fe-cn fe_br"><u></u></i>
							<div class="fe-cont" style="width: 47px">
								<div class="fe-select-elem">
									<span><b id="userBirthYear">год</b><i></i></span>
									<ul class="j-hidden" style="//height: 150px;">
									</ul>
								</div>
							</div>
						</div>
					</div>
				</td>
			</tr>
			<tr class="field-sex">
				<th><label for="reg-sex">Пол</label></th>
				<td>
					<div class="form-selectors">
						<div class="form-selector">
							<input type="radio" name="sex" value="male" id="reg-sex_male" checked="checked" /><label for="reg-sex_male">М</label>
						</div><div class="form-selector">
							<input type="radio" name="sex" value="female" id="reg-sex_female" /><label for="reg-sex_female">Ж</label>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="form-selectors">
						<div class="form-selector">
							<input type="checkbox" name="subscription" id="subscription"/><label for="subscription">Подписаться на рассылку новостей</label>
						</div>
						
						<div class="form-selector">
							<input type="checkbox" name="confirm_eula" id="reg-agreement"/><label for="reg-agreement">Я принимаю условия <a href="#" id="loc-ref_agreement" class="loc-ref">Пользовательского соглашения</a></label>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th></th>
				<td><push:static.button id="doRegister" name="go" text="{%LANG_REG_SEND%}"></td>
			</tr>
		</tfoot>
	</table>
	
</form>

-->




<form id="registration" class="form" style="display: none; top: -600px">
	<div id="registration-error" class="error" style="white-space: normal"><ul></ul></div>
	<table width="100%" border="0">
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 8px"><label for="registerLogin">{%LANG_REG_LOGIN%}</label></td>
			<td>
				<push:static.input id="registerLogin" name="login">
				<br />
				<span class="descr">{%LANG_REG_LOGIN_DESCR%}</span>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 8px"><label for="reg-pass">{%LANG_REG_PASSWORD%}</label></td>
			<td>
				<push:static.password id="reg-pass" name="password">
				<br />
				<span class="descr">{%LANG_REG_PASSWORD_DESCR%}</span>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 5px"><label for="reg-pass">{%LANG_REG_CONFIRM%}</label></td>
			<td>
				<push:static.password id="reg-pass" name="confirm">
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 8px"><label for="reg-email">{%LANG_REG_MAIL%}</label></td>
			<td>
				<push:static.input id="reg-email" name="email">
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 5px "><label for="reg-dob">{%LANG_REG_B%}</label></td>
			<td>
				
				
				<div class="formelem fe-select" id="rBirthDay" style="width: 42px; font-size: 11px; //width: auto;">
					<div class="fe-body">
						<i class="fe-cn fe_tl"><u></u></i>
						<i class="fe-cn fe_tr"><u></u></i>
						<i class="fe-cn fe_bl"><u></u></i>
						<i class="fe-cn fe_br"><u></u></i>
						<div class="fe-cont">
							<div class="fe-select-elem">
								<span><b id="userBirthDay">день</b><i></i></span>
								<ul class="j-hidden" style="//height: 150px;">
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="formelem fe-select" id="rBirthMonth" style="width: 70px; font-size: 11px; //width: auto;">
					<div class="fe-body">
						<i class="fe-cn fe_tl"><u></u></i>
						<i class="fe-cn fe_tr"><u></u></i>
						<i class="fe-cn fe_bl"><u></u></i>
						<i class="fe-cn fe_br"><u></u></i>
						<div class="fe-cont">
							<div class="fe-select-elem">
								<span><b id="userBirthMonth">месяц</b><i></i></span>
								<ul class="j-hidden">
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="formelem fe-select" id="rBirthYear" style="width: 47px; font-size: 11px;">
					<div class="fe-body">
						<i class="fe-cn fe_tl"><u></u></i>
						<i class="fe-cn fe_tr"><u></u></i>
						<i class="fe-cn fe_bl"><u></u></i>
						<i class="fe-cn fe_br"><u></u></i>
						<div class="fe-cont" style="width: 47px">
							<div class="fe-select-elem">
								<span><b id="userBirthYear">год</b><i></i></span>
								<ul class="j-hidden" style="//height: 150px;">
								</ul>
							</div>
						</div>
					</div>
				</div>
				<!--
				<select id="rBirthDay" name="b_date">
					<option>--</option>
				</select>
				<select id="rBirthMonth" name="b_month">
					<option>--</option>
				</select>
				<select id="rBirthYear" name="b_year">
					<option>--</option>
				</select>
				-->
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 3px"><label for="reg-sex">Пол</label></td>
			<td style="padding-bottom: 10px">
				<input type="radio" name="sex" value="male" id="reg-sex_male" checked />&nbsp;<label for="reg-sex_male">М</label>
				<input type="radio" name="sex" value="female" id="reg-sex_female" />&nbsp;<label for="reg-sex_female">Ж</label><br>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="border-top: 1px solid #bbb; padding-top: 10px">
				<div style="position: relative; margin-bottom: 5px">
					<input type="checkbox" name="subscription" id="subscription" style="position: absolute; top:0; left: 0;" /><label for="subscription" style="padding-left: 20px; display: block">Подписаться на рассылку новостей</label>
				</div>
				<div style="position: relative">
					<input type="checkbox" name="confirm_eula" id="reg-agreement" style="position: absolute; top:0; left: 0;" /><label for="reg-agreement" style="padding-left: 20px; display: block">Я принимаю условия <a href="#" id="loc-ref_agreement" class="loc-ref">Пользовательского соглашения</a></label><p></p>
				</div>
				
			</td>
		</tr>
		<tr>
			<td align="right" colspan="2">
				<push:static.button id="doRegister" name="go" text="{%LANG_REG_SEND%}">
			</td>
		</tr>
	</table>
	
	<div style="text-align: right"><a href="#" id="reg_cancel" style="color: #888; font-size: 11px">{%LANG_REG_CANCEL%}</a></div>
	
</form>
<!-- /Форма регистрации -->

<!-- Форма логирования -->		
<form class="form" id="loginform" style="font-size: 90%; position: absolute; z-index: 2; display: none; top: -300px">
	<div id="loginform-error" class="error" style="white-space: nowrap"><ul class="zozoz1"></ul></div>

	<table width="100%">
	
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 8px"><label>{%LANG_USER_LOGIN%}</label></td>
			<td width="100%">
				<push:static.input id="login_">
			</td>
		</tr>
		
		<tr>
			<td style="vertical-align: top; text-align: right; padding-top: 8px"><label>{%LANG_USER_PASSWORD%}</label></td>
			<td width="100%">
				<push:static.password id="pass_">
			</td>
		</tr>

		<tr>
			<td></td>
			<td width="100%">
				<table width="100%">
					<tr>
						<td width="100%" style="vertical-align: middle"><nobr><input type="checkbox" id="expire" style="vertical-align: middle" />&nbsp;<label for="expire">{%LANG_USER_STORE%}</label></nobr></td>
						<td nowrap="nowrap" style="vertical-align: middle">
							<push:static.button id="trylogin" name="go" text="{%LANG_USER_ENTER%}">
						</td>
					</tr>
				</table>
				
				
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				<table width="100%">
					<tr>
						<td width="100%"></td>
						<td nowrap="nowrap">
							<a href="#" id="forgot_pass" style="color: #888;">{%LANG_USER_FORGET_PASSWORD%}</a>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<div style="text-align: right"><a href="#" id="cancel_login" style="color: #888; font-size: 11px">Отменить</a></div>
</form>
<!-- /Форма логирования -->



<!-- Забыли пароль -->
<form class="form" id="forgot_form" style="font-size: 90%; display: none; z-index: 2; top: -400px" onSubmit="return false;">

	<div>Восстановление пароля</div>
	<div style="color: #999; margin-bottom: 5px">Пароль будет выслан на указанный e-mail</div>
	<div id="forgotform-error" class="error" style="white-space: normal"><ul class="zozoz2"></ul></div>
	
	<table width="100%">
		<tr>
			<td width="25%" style="vertical-align: top; text-align: right; padding-top: 10px"><label>Email</label></td>
			<td width="75%">

				<!-- Текст -->
				<div class="formelem fe-text">
					<div class="fe-body">
						<i class="fe-cn fe_tl"><u></u></i>
						<i class="fe-cn fe_tr"><u></u></i>
						<i class="fe-cn fe_bl"><u></u></i>
						<i class="fe-cn fe_br"><u></u></i>
						<div class="fe-cont"><input type="text" class="text" value="" name="reg_mail" style="width: 100%;" /></div>
					</div>
				</div>
				<!-- /Текст -->
			
				<!-- <input type="text" class="pizdat_input" value="sdf" style="width: 100%;" />-->
			</td>
		</tr>
		<tr>
			<td></td>
			<td align="right">
				<!-- Кнопка -->
				<div class="formelem fe-button">
					<div class="fe-body">
						<i class="fe-cn fe_tl"><u></u></i>
						<i class="fe-cn fe_tr"><u></u></i>
						<i class="fe-cn fe_bl"><u></u></i>
						<i class="fe-cn fe_br"><u></u></i>
						<div class="fe-cont"><button type="button" id="resetPassword" name="forget">Отправить</button></div>
					</div>
				</div>
				<!-- /Кнопка -->
				
			</td>
		</tr>
	
	</table>
	
	
	<div style="text-align: right"><a href="#" id="forgot_cancel" style="color: #888">Отменить</a></div>

</form>
<!-- /Забыли пароль -->
<!-- end:login -->