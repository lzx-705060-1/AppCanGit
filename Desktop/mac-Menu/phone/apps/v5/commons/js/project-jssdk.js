;(function( global ) {
    var api = {
	    Projects : {
	        findProjectList :  function(_params,_body,options){return SeeyonApi.Rest.post('projects/list',_params,_body,cmp.extend({},options))} 
	    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);