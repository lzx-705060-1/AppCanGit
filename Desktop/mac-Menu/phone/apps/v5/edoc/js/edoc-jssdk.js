(function( global ) {
	var api = {
		EdocResource : {
            cancel :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/cancel',_params,_body,cmp.extend({},options))}, 
       
            checkTakeBack :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkTakeBack',_params,'',cmp.extend({},options))}, 
       
            exportEdocFile :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/exportFile',_params,_body,cmp.extend({},options))}, 
       
            getSummaryListByEdocTypeAndListType :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/getSummaryListByEdocTypeAndListType',_params,_body,cmp.extend({},options))}, 
       
            submit :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/submit',_params,_body,cmp.extend({},options))}, 
       
            takeBack :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/takeBack',_params,_body,cmp.extend({},options))}, 
       
            checkAffairValid :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkAffairValid',_params,'',cmp.extend({},options))}, 
       
            registered :  function(_params,options){return SeeyonApi.Rest.get('edocResource/registered',_params,'',cmp.extend({},options))}, 
       
            setTrack :  function(_params,options){return SeeyonApi.Rest.get('edocResource/setTrack',_params,'',cmp.extend({},options))}, 
       
            stepStop :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/stepStop',_params,_body,cmp.extend({},options))}, 
       
            getPhrase :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/phrase',_params,_body,cmp.extend({},options))}, 
       
            qianpiLock :  function(_params,options){return SeeyonApi.Rest.get('edocResource/qianpiLock',_params,'',cmp.extend({},options))}, 
       
            unlockEdocAll :  function(_params,options){return SeeyonApi.Rest.get('edocResource/unlockEdocAll',_params,'',cmp.extend({},options))}, 
       
            permissions :  function(_params,options){return SeeyonApi.Rest.get('edocResource/permissions',_params,'',cmp.extend({},options))}, 
       
            getAllPending :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/getAllPending',_params,_body,cmp.extend({},options))}, 
       
            stepback :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/stepback',_params,_body,cmp.extend({},options))}, 
       
            checkIsExchanged :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkCanTakeBack',_params,'',cmp.extend({},options))}, 
       
            edocSummary :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/edocSummary',_params,_body,cmp.extend({},options))}, 
       
            edocUserPeivMenu :  function(_params,options){return SeeyonApi.Rest.get('edocResource/edoc/user/privMenu',_params,'',cmp.extend({},options))}, 
       
            zcdb :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/zcdb',_params,_body,cmp.extend({},options))}, 
       
            checkEdocMarkIsUsed :  function(_params,options){return SeeyonApi.Rest.get('edocResource/checkEdocMarkIsUsed',_params,'',cmp.extend({},options))}, 
       
          
            getListSizeByEdocType :  function(_params,options){return SeeyonApi.Rest.get('edocResource/getListSizeByEdocType',_params,'',cmp.extend({},options))}, 
       
            canStepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/canStepBack',_params,_body,cmp.extend({},options))}, 
       
            signed :  function(_params,options){return SeeyonApi.Rest.get('edocResource/signed',_params,'',cmp.extend({},options))}, 
       
            transfer :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/transfer',_params,_body,cmp.extend({},options))}, 
       
            trackValue :  function(_params,options){return SeeyonApi.Rest.get('edocResource/trackValue',_params,'',cmp.extend({},options))},
            
            specifiesReturn :  function(_params,_body,options){return SeeyonApi.Rest.post('edocResource/specifiesReturn',_params,_body,cmp.extend({},options))}

       }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);