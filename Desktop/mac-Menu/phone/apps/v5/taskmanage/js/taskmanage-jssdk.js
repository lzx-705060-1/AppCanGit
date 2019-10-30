;(function( global ) {
    var api = {
		Task : {
             getCurrentUser :  function(_params,_body,options){return SeeyonApi.Rest.post('task/currentUser',_params,_body,cmp.extend({},options))}, 
        
           
             taskFeedback :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/feedback',_params,_body,cmp.extend({},options))}, 
        
             updateTaskStatus :  function(_params,_body,options){return SeeyonApi.Rest.post('task/updateTaskStatus',_params,_body,cmp.extend({},options))}, 
        
             removeTaskById :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/remove/'+taskId+'',_params,'',cmp.extend({},options))}, 
        
             taskHasten :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/hasten',_params,_body,cmp.extend({},options))}, 
        
             initCondition :  function(_params,options){return SeeyonApi.Rest.get('task/initCondition',_params,'',cmp.extend({},options))}, 
        
             getTaskDetail :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/'+taskId+'/detail',_params,'',cmp.extend({},options))}, 
        
             updateTask :  function(_params,_body,options){return SeeyonApi.Rest.post('task/update',_params,_body,cmp.extend({},options))}, 
        
             getTaskById :  function(taskId,_params,options){return SeeyonApi.Rest.get('task/'+taskId+'',_params,'',cmp.extend({},options))}, 
        
             saveFeedBack :  function(_params,_body,options){return SeeyonApi.Rest.post('task/saveFeedBack',_params,_body,cmp.extend({},options))}, 
        
             taskComment :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/comment',_params,_body,cmp.extend({},options))}, 
        
             audit :  function(_params,_body,options){return SeeyonApi.Rest.post('task/audit',_params,_body,cmp.extend({},options))}, 
        
             updateTask4M3 :  function(taskId,_params,_body,options){return SeeyonApi.Rest.post('task/'+taskId+'/update',_params,_body,cmp.extend({},options))}, 
        
             createTask :  function(_params,_body,options){return SeeyonApi.Rest.post('task/add',_params,_body,cmp.extend({},options))},
             
             findTaskType :  function(isNew,taskId,_params,options){return SeeyonApi.Rest.get('task/findTaskType/'+isNew+'/'+taskId,_params,'',cmp.extend({},options))} 
	        
	    },
	    Tasks : {
             getPendingTaskNum :  function(userId,_params,options){return SeeyonApi.Rest.get('tasks/'+userId+'',_params,'',cmp.extend({},options))}, 
        
             getProjectTasks :  function(projectId,_params,options){return SeeyonApi.Rest.get('tasks/project/'+projectId+'',_params,'',cmp.extend({},options))}, 
        
           
             taskHastenMembers :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/hastenMembers',_params,'',cmp.extend({},options))}, 
        
             countTasks :  function(_params,_body,options){return SeeyonApi.Rest.post('tasks/count',_params,_body,cmp.extend({},options))}, 
        
             taskComments :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/comments',_params,'',cmp.extend({},options))}, 
        
             findTasks :  function(_params,_body,options){return SeeyonApi.Rest.post('tasks',_params,_body,cmp.extend({},options))}, 
        
             taskPraise :  function(commentId,_params,options){return SeeyonApi.Rest.get('tasks/'+commentId+'/praise',_params,'',cmp.extend({},options))}, 
        
             taskLogs :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/tasklogs',_params,'',cmp.extend({},options))}, 
        
             taskFeedbacks :  function(taskId,_params,options){return SeeyonApi.Rest.get('tasks/'+taskId+'/feedbacks',_params,'',cmp.extend({},options))} 
	        
	        
	    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);