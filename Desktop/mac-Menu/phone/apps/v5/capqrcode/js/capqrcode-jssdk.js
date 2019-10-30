;(function( global ) {
    var api = {
      capBarcode : {
        showTemplatesByFormId :  function(formId,_params,options){return SeeyonApi.Rest.get('capBarcode/showTemplatesByFormId/'+formId+'',_params,'',cmp.extend({},options))}

      },
      UnflowForm : {
        checkLock :  function(_params,_body,options){return SeeyonApi.Rest.post('cap4/form/checkLock',_params,_body,cmp.extend({},options))}

       }

    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);