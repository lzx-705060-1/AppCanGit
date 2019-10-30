;(function( global ) {
    var api = {
		 Onlinecustomerservice : {
		        checkOnlineCustomerService :  function(_params,options){return SeeyonApi.Rest.get('onlinecustomerservice/checkOnlineCustomerService',_params,'',cmp.extend({},options))}, 
		   
		        getCustomerServicePage :  function(_params,options){return SeeyonApi.Rest.get('onlinecustomerservice/getCustomerServicePage',_params,'',cmp.extend({},options))} 
		   
		    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);