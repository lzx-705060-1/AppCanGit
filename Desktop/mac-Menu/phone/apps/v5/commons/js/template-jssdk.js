(function( global ) {
    var api = {
    	Template : {
			templates :  function(loginName,moduleType,_params,options){return SeeyonApi.Rest.get('template/templateidlist/'+loginName+'/'+moduleType+'',_params,'',cmp.extend({},options))}, 
	        
            rencentTemplates :  function(_params,options){return SeeyonApi.Rest.get('template/rencentTemplates',_params,'',cmp.extend({},options))}, 
       
            searchTemplates :  function(_params,_body,options){return SeeyonApi.Rest.post('template/searchTemplates',_params,_body,cmp.extend({},options))}, 
       
            formTemplates :  function(_params,options){return SeeyonApi.Rest.get('template/formTemplates',_params,'',cmp.extend({},options))}
       }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);