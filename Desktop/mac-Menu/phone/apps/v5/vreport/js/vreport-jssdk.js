;(function( global ) {
    var api = {
		Vreport : {
	        favour :  function(_params,_body,options){return SeeyonApi.Rest.post('vreport/favour',_params,_body,cmp.extend({},options))}, 
	    
	        getReportTreeAndData :  function(_params,options){return SeeyonApi.Rest.get('vreport/treeAndData',_params,'',cmp.extend({},options))}, 
	    
	        getMyFavour :  function(_params,options){return SeeyonApi.Rest.get('vreport/myFavour',_params,'',cmp.extend({},options))}, 
	    	
	    	fileReport :  function(id,_params,options){return SeeyonApi.Rest.get('vreport/fileReport/'+id+'',_params,'',cmp.extend({},options))},
	    	
	    	getReportCap4TreeAndData :  function(_params,options){return SeeyonApi.Rest.get('vreport/cap4TreeAndData',_params,'',cmp.extend({},options))},
	    	getReportViewtip :  function(_params,options){return SeeyonApi.Rest.get('vreport/reportViewtip',_params,'',cmp.extend({},options))},
			hideReportViewtip :  function(_params,options){return SeeyonApi.Rest.get('vreport/hideReportViewtip',_params,'',cmp.extend({},options))},
			saveReportRecordRead :  function(id,_params,options){return SeeyonApi.Rest.get('vreport/saveReportRecordRead/'+id+'',_params,'',cmp.extend({},options))},
		
			getExternalURL :  function(id,_params,options){return SeeyonApi.Rest.get('vreport/externalurl/'+id+'',_params,'',cmp.extend({},options))}
		},
		SeeyonReport : {
            getReportTemplateLinkParams :  function(templateId,_params,options){return SeeyonApi.Rest.get('seeyonReport/template/'+templateId+'/linkParams',_params,'',cmp.extend({},options))}, 
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);