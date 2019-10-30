(function( global ) {
	var api = {
		Signet : {
	           
            saveSignets :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/saveSignets',_params,_body,cmp.extend({},options))}, 
       
            getIsignatureKeysn :  function(_params,options){return SeeyonApi.Rest.get('signet/getIsignatureKeysn',_params,'',cmp.extend({},options))}, 
       
            signetPic :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/signetPic',_params,_body,cmp.extend({},options))}, 
       
            updateIsignatureDocumentId :  function(_params,_body,options){return SeeyonApi.Rest.post('signet/updateIsignatureDocumentId',_params,_body,cmp.extend({},options))}, 
       
            signets :  function(affairId,_params,options){return SeeyonApi.Rest.get('signet/signets/'+affairId+'',_params,'',cmp.extend({},options))},
            
            findsignets :  function(summaryId,fieldName,_params,options){return SeeyonApi.Rest.get('signet/findsignets/'+summaryId+'/'+fieldName+'',_params,'',cmp.extend({},options))} 
       
		}
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);