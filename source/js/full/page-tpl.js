_mt.tpl = {
	event_block:'<div class="promo $ci$" id="event$#">'+
	'<table class="balcony" width="100%"><tr>' +
			'<td class="name"><div><i></i><a class="cmd-locRef" href="/event/$#">$n</a></div></td>'+
			'<td class="date">$w</td>'+
		'</tr>'+
	'</table>'+
		'<div class="container">'+
			'<div class="container-overflow">'+
				'<img class="image" src="/usr/pic/main/$i" alt="$n" />'+
				'<i class="curtain"><a class="cmd-locRef" href="/event/$#"></a></i>'+
				'<i class="linkarea"></i>'+
				'$event_rating:rr$' + 
				'<i class="tags"><b>$event_tag:tt$</b></i>'+
			'</div>'+
		'</div>'+
	'</div>',
	event_tag: "<a>$1</a>",
	event_rating:'<i class="rating"><b>'+
		'<div class="scale">'+
			'<div class="neg"><div></div></div>'+
			'<div class="pos"><div></div></div>'+
		'</div>'+
		'<table class="control"><tr>'+
			'<td class="neg">$event_del::3$$event_del_sel::2$<span>$0</span><ins>зло</ins></td>'+
			'<td class="pos"><ins>добро</ins><span>$1</span>$event_add::5$$event_add_sel::4$</td>'+
		'</tr></table></b></i>',
	
	event_add:'<button title="$1" class="add cmd-$0%Add"></button>',
	event_add_sel:'<button title="$2" class="add-sel cmd-$0%Add"></button>',
	event_del:'<button title="$3" class="remove cmd-$0%Del"></button>',
	event_del_sel:'<button title="$4" class="remove-sel cmd-$0%Del"></button>',
	last:""
};

function T( b, pp, g, id )
{
	g = g || Lo(b+"_gl"); 
	var p;
	function sr( w )
	{
		var l = w.substr(w.length-1)
		if ( l == "%" ) l = "";
		w = w.substr(1, w.length-2);
		return p && w in p ? p[w]+l : ( g && w in g ? g[w]+l : l )
	}
	function srb( w )
	{
		w = w.replace(/\$/g,"");
		return p && w in p ? p[w] : ( g && w in g ? g[w] : "" )
	}
	function cr( w )
	{
		w = w.replace(/\$/g,"").split( ":" );
		if ( w[2] && w[2] in p && p[w[2]] ) return "";
		return w[0] in _mt.tpl ? T( w[0], p && w[1] in p ? p[w[1]] : {}, g ) : "";
	}
	var s = [];
	var r = 1;
	if ( pp && pp.length && typeof pp[0] == "object" )
	{ r = pp.length; p = pp[0];}	else p = pp;
	for( var i = 0; i < r; )
	{	
		var c = _mt.tpl[b].replace(/\$\#/g, id ).replace(/\$([^\>\<$]+:[^\$]+\$)/g, cr).replace(/\$[\w\d][^\w\d]/g, sr).replace(/\$([\w\d]{2,30}\$)/g, srb);
		s.push( c )
		i++;
		p = pp[i];
	}
	return s.join("");
}