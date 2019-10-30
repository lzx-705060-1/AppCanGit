;(function( global ) {
    var api = {
		Attendance : {
             findSettings :  function(id,_params,options){return SeeyonApi.Rest.get('attendance/setting/'+id+'',_params,'',cmp.extend({},options))}, 
        
             availableSettings :  function(_params,options){return SeeyonApi.Rest.get('attendance/setting/available',_params,'',cmp.extend({},options))}, 
        
           
             updateAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/update',_params,_body,cmp.extend({},options))}, 
        
             currentAttendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/currentAttendance',_params,'',cmp.extend({},options))}, 
        
             mentionedAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/mentionedAttendance',_params,_body,cmp.extend({},options))}, 
        
             checkAuthScope :  function(_params,options){return SeeyonApi.Rest.get('attendance/checkAuthScope',_params,'',cmp.extend({},options))}, 
        
             saveAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/save',_params,_body,cmp.extend({},options))}, 
        
             findAttendanceHistory :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/findAttendanceHistory',_params,_body,cmp.extend({},options))}, 
        
             removeSetting :  function(id,_params,options){return SeeyonApi.Rest.get('attendance/removeSetting/'+id+'',_params,'',cmp.extend({},options))}, 
        
             myAttendance :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/myAttendance',_params,_body,cmp.extend({},options))}, 
        
             getAttendanceById :  function(attendanceId,_params,options){return SeeyonApi.Rest.get('attendance/'+attendanceId+'',_params,'',cmp.extend({},options))}, 
        
             getAuthorize :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/authorize',_params,_body,cmp.extend({},options))}, 
        
             systemData4Attendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/sysData',_params,'',cmp.extend({},options))}, 
        
             saveSetting :  function(_params,_body,options){return SeeyonApi.Rest.post('attendance/saveSetting',_params,_body,cmp.extend({},options))}, 
        
             checkAttendanceAtByUser :  function(attendanceId,_params,options){return SeeyonApi.Rest.get('attendance/checkAttendanceAtByUser/'+attendanceId+'',_params,'',cmp.extend({},options))}, 
        
             checkAuthForAttendance :  function(_params,options){return SeeyonApi.Rest.get('attendance/checkAuthForAttendance',_params,'',cmp.extend({},options))} 
	        
	        
	    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);