(function( global ) {
	var api = {
		EditContent : {
	           
            getOfficeAuthKey :  function(_params,_body,options){return SeeyonApi.Rest.post('editContent/getOfficeAuthKey',_params,_body,cmp.extend({},options))}, 
       
            saveFile :  function(_params,_body,options){return SeeyonApi.Rest.post('editContent/saveFile',_params,_body,cmp.extend({},options))} 
       }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);