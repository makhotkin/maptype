<div class="page page-events">
			
				<h2>Календарь</h2>
			
				<table class="l-body">
					<tr>
						<td class="l-submenu">
							<ins class="min-widther"></ins>
							<ul class="submenu" id="eveTabs">
								<li id="eveTabPlanned" class="selected"><span><a href="/profile/{%name%}/planned" class="cmd-lp-calTab"><i></i>Запланированные</a><ins></ins></span></li>
								<li id="eveTabRecommended"><span><a href="/profile/{%name%}/recommended" class="cmd-lp-calTab"><i></i>Рекомендуемые</a><ins></ins></span></li>
								<li id="eveTabFriends"><span><a href="/profile/{%name%}/friends" class="cmd-lp-calTab">Друзей</a><ins></ins></span></li>
								<li id="eveTabWaste"><span><a href="/profile/{%name%}/waste" class="cmd-lp-calTab"><i></i>Удаленные</a><ins></ins></span></li>
							</ul>
						</td>
						<td class="l-content" id="calMonth">
							<!-- start:ajax_calendar -->
							<!-- start:calendar -->
							<div class="chart days_{%days_in_month%}">
								<!-- Список дней -->
								<table class="chart-x">
									<tr>
										<td class="l-chart-legendx"><ins class="min-widther"></ins></td>
										<td colspan="31">
											<!-- Переключатели -->
											<table class="chart-switches">
												<tr>
												
													<td class="l-chart-switch l-chart-switch-prev" style="padding-bottom: 10px;">
														<a href="/profile/{%name%}/{%mode%}/{%prev_year%}-{%prev_month%}" class="cmd-lp-monGet">&larr; {%cal_month_m1%}</a>
													</td>
													<td class="l-chart-switch l-chart-switch-current">
														<h5 style="font-weight: bold">{%cal_month%}, {%int_year%}<span class="{%int_year%}-{%int_month%}" id="yearMonth"></span></h5>
													</td>
													<td class="l-chart-switch l-chart-switch-next">
														<a href="/profile/{%name%}/{%mode%}/{%next_year%}-{%next_month%}" class="cmd-lp-monGet">{%cal_month_p1%}&nbsp;&rarr;</a>
													</td>
												</tr>
											</table>
											<!-- / Переключатели -->
										</td>
									</tr>
									<tr class="chart-days">
										<td class="l-chart-legendx"><ins class="min-widther"></ins></td>
										<!-- start:calendar_date_top --><th class="{%dayoff%}{%today%}">{%day%}</th><!-- end:calendar_date_top -->
									</tr>
								</table>
								<!-- / Список дней -->
								
								<div class="l-chart-y">
									<div class="l-chart-gutters">
										<table class="chart-gutters">
											<tr>
												<th class="l-chart-legendx"><ins class="min-widther"></ins></th>
												<!-- start:calendar_date_middle_lines --><td class="{%dayoff%}{%today%}"></td><!-- end:calendar_date_middle_lines -->
											</tr>
										</table>
									</div>
									<!-- Список событий -->
									<table class="chart-y">
										<tr class="chart-y-filler">
											<th class="l-chart-legendx"><ins class="min-widther"></ins></th>
											<!-- start:calendar_date_middle_legend --><td></td><!-- end:calendar_date_middle_legend -->
										</tr>
										<!-- start:single_event -->
										<tr>
											<th><span><a href="/event/{%id_event%}">{%event_name%}</a><a href="#" class="chart-icon-archive"></a></span></th>
											
											{%td_before%}
											<td colspan="{%duration%}"><ins class="chart-segment" style="background-image:url(/usr/pic/lines/{%bg_img%})"></ins></td>
											{%td_after%}
										</tr><!-- end:single_event -->
									</table>
									<!-- / Список событий -->
								</div>
								
								<!-- Список дней -->
								<table class="chart-x">
									<tr class="chart-days">
										<td class="l-chart-legendx"><ins class="min-widther"></ins></td>
										<!-- start:calendar_date_bottom --><th class="{%dayoff%}{%today%}">{%day%}</th><!-- end:calendar_date_bottom -->
									</tr>
								</table>
								<!-- / Список дней -->
							</div>
							<!-- end:calendar -->
							<!-- end:ajax_calendar -->
						</td>
						<td class="extra">
							<ins class="min-widther"></ins>
							<div id="calendarPlace" style="margin-bottom: 40px;">
								<!-- start-profile_cal -->
								<!-- include src="profile_calendar.tpl" /-->
								<!-- end-profile_cal -->
							</div>
						</td>
					</tr>
				</table>
			</div>
