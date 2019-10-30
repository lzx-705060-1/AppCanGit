(function( global ) {
	var api = {
		CommonPhrase : {
	           
             phrases :  function(_params,options){return SeeyonApi.Rest.get('commonPhrase/phrases',_params,'',cmp.extend({},options))} 
	    }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);