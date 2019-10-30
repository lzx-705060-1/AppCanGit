;(function( global ) {
    var api = {
		Report : {
           
             getSeeyonreportTree :  function(_params,options){return SeeyonApi.Rest.get('report/seeyonreport/tree',_params,'',cmp.extend({},options))}, 
        
             getSeeyonreportList :  function(_params,options){return SeeyonApi.Rest.get('report/seeyonreport/list',_params,'',cmp.extend({},options))}, 
        
             getReportTemplates :  function(categoryId,_params,_body,options){return SeeyonApi.Rest.post('report/reportShow/'+categoryId+'',_params,_body,cmp.extend({},options))} 
        
	    }
    }
    
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);