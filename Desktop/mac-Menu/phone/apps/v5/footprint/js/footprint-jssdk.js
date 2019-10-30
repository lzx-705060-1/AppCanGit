;(function( global ) {
    var api = {
		Footprint : {
           
             getCanSearchDateList :  function(_params,_body,options){return SeeyonApi.Rest.post('footprint/canSearchDateList',_params,_body,cmp.extend({},options))}, 
        
             getFootPrintData :  function(item,dateType,_params,_body,options){return SeeyonApi.Rest.post('footprint/footPrintData/'+item+'/'+dateType+'',_params,_body,cmp.extend({},options))}, 
        
             getUseDays :  function(_params,_body,options){return SeeyonApi.Rest.post('footprint/useDays',_params,_body,cmp.extend({},options))} 
	        
	    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);