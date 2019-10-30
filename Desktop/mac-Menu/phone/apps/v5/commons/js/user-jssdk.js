(function( global ) {
	var api = {
		User : {
	        getResource :  function(_params,options){return SeeyonApi.Rest.get('user/resources',_params,'',cmp.extend({},options))}, 
	   
	        getLoginName :  function(_params,options){return SeeyonApi.Rest.get('user/loginName',_params,'',cmp.extend({},options))}, 
	   
	        getUserId :  function(_params,options){return SeeyonApi.Rest.get('user/userId',_params,'',cmp.extend({},options))} 
       }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);