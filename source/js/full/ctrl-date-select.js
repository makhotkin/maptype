_mt.dateSelect = 
{
	"fill": function( minYear, maxYear, cssDay, cssMonth, cssYear, b_date_sel, b_month_sel, b_year_sel, tag )
	{
		if ( !tag ) tag = "option"; 
		
		var dayz = [];
		var yearz = [];
		var monthz = [];

		var mo = L('CALENDAR_MONTHS');

		for (var i=1; i<=31; i++){
			dayz.push('<li id="day' + i + '" ' + ( b_date_sel == i ? 'class="selected"' : '' ) + '>' + i+ '</li>');
			if ( i <= 12 )
				monthz.push('<li id="month' + i + '" ' + ( b_month_sel == i ? 'class="selected"' : '' ) + '>' + mo[i-1]+ '</li>');	
		}
		for(var i = maxYear ; i >= minYear; i--){
			yearz.push( '<li id="year'+i+'"' + (b_year_sel==i? ' class="selected"' : '') + '>'+i+'</li>' );
		}

		$("ul", cssDay).append(dayz.join('\n'));
		$("ul", cssMonth).append(monthz.join('\n'));
		$("ul", cssYear).append(yearz.join('\n'));

	}
};