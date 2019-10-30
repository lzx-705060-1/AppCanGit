(function( global ) {
	var api = {
			Dee:{
	             excFlow :  function(flowNo,_params,options){return SeeyonApi.Rest.get('dee/task/'+flowNo+'',_params,'',cmp.extend({},options))}, 
	        
	             excFlowParameters :  function(flowNo,_params,_body,options){return SeeyonApi.Rest.post('dee/task/'+flowNo+'',_params,_body,cmp.extend({},options))}, 
	        
	             valiateFormDeeDev :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/valiateFormDeeDev',_params,_body,cmp.extend({},options))}, 
	        
	             updateUnFlowFormData :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/unflow/update',_params,_body,cmp.extend({},options))}, 
	           
	             preExtHandler :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/preExtHandler',_params,_body,cmp.extend({},options))}, 
	        
	             achieveTaskType :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/achieveTaskType',_params,_body,cmp.extend({},options))}, 
	        
	             preDeeHandler :  function(_params,_body,options){return SeeyonApi.Rest.post('dee/preDeeHandler',_params,_body,cmp.extend({},options))} 
	        
	        
			}
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);