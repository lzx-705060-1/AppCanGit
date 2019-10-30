(function( global ) {
	var api = {
		Workflow : {
            getWorkflowXMLData :  function(_params,options){return SeeyonApi.Rest.get('workflow/processXml',_params,'',cmp.extend({},options))}, 
       
            addNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/addNode',_params,_body,cmp.extend({},options))}, 
       
            lockH5Workflow :  function(_params,options){return SeeyonApi.Rest.get('workflow/lockH5Workflow',_params,'',cmp.extend({},options))}, 
       
          
            transBeforeInvokeWorkFlow :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/transBeforeInvokeWorkFlow',_params,_body,cmp.extend({},options))}, 
       
            canWorkflowCurrentNodeSubmit :  function(_params,options){return SeeyonApi.Rest.get('workflow/canWorkflowCurrentNodeSubmit',_params,'',cmp.extend({},options))}, 
       
            canBatchDelete :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/canBatchDelete',_params,_body,cmp.extend({},options))}, 
       
            deleteNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/deleteNode',_params,_body,cmp.extend({},options))}, 
       
            freeReplaceNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeReplaceNode',_params,_body,cmp.extend({},options))}, 
       
            getAcountExcludeElements :  function(_params,options){return SeeyonApi.Rest.get('workflow/accountExcludeElements',_params,'',cmp.extend({},options))}, 
       
            canTakeBack :  function(_params,options){return SeeyonApi.Rest.get('workflow/canTakeBack',_params,'',cmp.extend({},options))}, 
       
            executeWorkflowBeforeEvent :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/executeWorkflowBeforeEvent',_params,_body,cmp.extend({},options))}, 
       
            getProcessXmlandJson :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/processXmlandJson',_params,_body,cmp.extend({},options))}, 
       
            freeChangeNodeProperty :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeChangeNodeProperty',_params,_body,cmp.extend({},options))}, 
       
            getWorkflowDiagramData :  function(_params,options){return SeeyonApi.Rest.get('workflow/diagramdata',_params,'',cmp.extend({},options))}, 
       
            preDeleteNodeFromDiagram :  function(_params,options){return SeeyonApi.Rest.get('workflow/preDeleteNodeFromDiagram',_params,'',cmp.extend({},options))}, 
       
            unLockH5Workflow :  function(_params,options){return SeeyonApi.Rest.get('workflow/unLockH5Workflow',_params,'',cmp.extend({},options))}, 
       
            freeDeleteNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/freeDeleteNode',_params,_body,cmp.extend({},options))}, 
       
            multiSignDeptMembers :  function(_params,options){return SeeyonApi.Rest.get('workflow/multiSignDeptMembers',_params,'',cmp.extend({},options))}, 
       
            validateCurrentSelectedNode :  function(_params,_body,options){return SeeyonApi.Rest.post('workflow/validateCurrentSelectedNode',_params,_body,cmp.extend({},options))}, 
       
            canChangeNode :  function(_params,options){return SeeyonApi.Rest.get('workflow/canChangeNode',_params,'',cmp.extend({},options))} 
       }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);