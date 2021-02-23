// (c) 2008 Max Makhotkin (maxim.makhotkin@gmail.com) 
// All your rights belong to us

var CDbg = function(){
	this.dump = function( what, filter ) 
	{
		var res = []; 
		if ( typeof what == 'object' )
		{
			for( i in what ) 
				res.push( i + ": " + ( what[i] && what[i].toString && what[i].toString() ) );
			return res.join("<br>\n");
		}
		else
			return what;
	}
	
	this.out = function( what, filter )
	{
		$('#debug').html( what );
	}
	
	function constructor() 
	{
		if( window.maxDebuggerEnabled )
			return;
		
		$('<div id="debugHolder" style="z-index:90; position:absolute; top: 10px; right: 10px; width: 300px; height: 80px; background-color: aliceblue;">Окно отладки скриптов (не бояться!)<div id="debug"></div></div>').appendTo('body');
		window.maxDebuggerEnabled = true;
	}
	
	constructor();
} 
window.dbg = new CDbg();
