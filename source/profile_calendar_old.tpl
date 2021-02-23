<!-- start:calendar -->
<div class="calendar" id="calendar_all">
	
	<table class="header">
		<tr>
			<td class="prev" width="50%"><a href="#" class="cmd-monPrev"></a></td>
			<td nowrap="nowrap"><h4>{%cal_month%}, {%int_year%}</h4><span id="yearMonth" class="date-{%int_month%}-{%int_year%}"></span></td>
			<td class="next" width="50%"><a href="#" class="cmd-monNext"></a></td>
		</tr>
	</table>

	<table class="mesh">
		<tr>
			<th>пн</th>
			<th>вт</th>
			<th>ср</th>
			<th>чт</th>
			<th>пт</th>
			<th class="dayoff">сб</th>
			<th class="dayoff">вс</th>
		</tr>
		<!-- start:cal_row -->
		<tr>
			<!-- start:cal_column_old -->
			<td>
				<a href="#" class="day passday prevmonth">
					<span class="date">{%cal_day%}</span>
					<ul class="flags">
						{%plan%}{%recs%}{%friendz%}
					</ul>
				</a>
			</td>
			<!-- end:cal_column_old -->
			<!-- start:cal_column_now -->
			<td>
				<a href="#" class="day today cmd-dayGet">
					<span class="date">{%cal_day%}</span>
					<ul class="flags">
						{%plan%}{%recs%}{%friendz%}
					</ul>
				</a>
			</td>
			<!-- end:cal_column_now -->
			<!-- start:cal_column -->
			<td>
				<a href="#" class="day {%passday%} cmd-dayGet">
					<span class="date">{%cal_day%}</span>
					<ul class="flags">
						{%plan%}{%recs%}{%friendz%}
					</ul>
				</a>
			</td>
			<!-- end:cal_column -->
		</tr>
		<!-- end:cal_row -->

		<!-- start:aj_row -->
		{%ajax_cal%}
		<!-- end:aj_row -->

	</table>
	<!-- end:calendar -->
</div>
<!-- start:friendz --><li class="friend-s">{%count%}</li><!-- end:friendz -->
<!-- start:plan --><li class="scheduled">{%count%}</li><!-- end:plan -->
<!-- start:recs --><li class="recommended">{%count%}</li><!-- end:recs -->