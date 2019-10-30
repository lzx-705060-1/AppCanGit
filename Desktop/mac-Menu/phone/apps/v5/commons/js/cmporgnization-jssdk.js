(function( global ) {
	var api = {
		Cmporgnization : {
             getDeptByAccountId :  function(accountid,_params,options){return SeeyonApi.Rest.get('cmporgnization/firstleveldepts/'+accountid+'',_params,'',cmp.extend({},options))}, 
        
           
             getAccounts :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization/firstlevelaccount',_params,'',cmp.extend({},options))}, 
        
             getCmpOrganization :  function(_params,options){return SeeyonApi.Rest.get('cmporgnization',_params,'',cmp.extend({},options))}, 
        
             searchEntity :  function(accountid,searchtype,keyword,_params,options){return SeeyonApi.Rest.get('cmporgnization/searchentities/'+accountid+'/'+searchtype+'/'+keyword+'',_params,'',cmp.extend({},options))} 
	        
	    }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);