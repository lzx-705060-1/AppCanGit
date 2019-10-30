;(function( global ) {
    var api = {
    	Event : {
             delCalEventById :  function(eventId,_params,_body,options){return SeeyonApi.Rest.post('event/remove/'+eventId+'',_params,_body,cmp.extend({},options))}, 
        
             getCurrentUser :  function(_params,_body,options){return SeeyonApi.Rest.post('event/currentUser',_params,_body,cmp.extend({},options))}, 
        
             getCaleventById :  function(eventId,_params,options){return SeeyonApi.Rest.get('event/'+eventId+'',_params,'',cmp.extend({},options))}, 
        
           
             newCalevent :  function(_params,_body,options){return SeeyonApi.Rest.post('event/add',_params,_body,cmp.extend({},options))}, 
        
             updateCalEvent :  function(_params,_body,options){return SeeyonApi.Rest.post('event/update',_params,_body,cmp.extend({},options))}, 
        
             getCalEventDetailById :  function(id,_params,options){return SeeyonApi.Rest.get('event/'+id+'/detail',_params,'',cmp.extend({},options))} 
        
        
    	},
		Events : {
             getScheduleByUserId :  function(userId,dateStr,_params,options){return SeeyonApi.Rest.get('events/schedule/'+userId+'/'+dateStr+'',_params,'',cmp.extend({},options))}, 
        
             getShareCaleventById :  function(_params,options){return SeeyonApi.Rest.get('events/share',_params,'',cmp.extend({},options))}, 
        
             getPersonalCaleventById :  function(_params,options){return SeeyonApi.Rest.get('events',_params,'',cmp.extend({},options))}, 
        
           
             findOtherCalendarByPortal :  function(_params,_body,options){return SeeyonApi.Rest.post('events/portal/otherCalendar',_params,_body,cmp.extend({},options))}, 
        
             findArrangeAuths :  function(_params,options){return SeeyonApi.Rest.get('events/auths',_params,'',cmp.extend({},options))}, 
        
             findPlugins :  function(_params,options){return SeeyonApi.Rest.get('events/plugins',_params,'',cmp.extend({},options))}, 
        
             findTimeArrange :  function(_params,_body,options){return SeeyonApi.Rest.post('events/arrangetimes',_params,_body,cmp.extend({},options))}, 
        
             syncTimeArrange :  function(_params,_body,options){return SeeyonApi.Rest.post('events/sync/arrangetimes',_params,_body,cmp.extend({},options))}, 
        
             findMyCalendarByPortal :  function(_params,_body,options){return SeeyonApi.Rest.post('events/portal/myCalendar',_params,_body,cmp.extend({},options))} 
        
    	}
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);