;(function( global ) {
    var api = {
    	Show : {
             setShowpostTop :  function(showbarId,showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/top/'+showbarId+'/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
             getAvatarImageUrl :  function(memberId,_params,options){return SeeyonApi.Rest.get('show/avatar/url/'+memberId+'',_params,'',cmp.extend({},options))}, 
        
           
             addViewTimes :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/viewtimes/add/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             getCommentNum :  function(showpostId,_params,options){return SeeyonApi.Rest.get('show/showpost/comment/num/'+showpostId+'',_params,'',cmp.extend({},options))}, 
        
             removeShowbar :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/remove/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             showpostLike :  function(showpostId,_params,options){return SeeyonApi.Rest.get('show/showpost/like/'+showpostId+'',_params,'',cmp.extend({},options))}, 
        
             getFirstCreateShowbar :  function(_params,options){return SeeyonApi.Rest.get('show/showbar/firstCreateShowbar',_params,'',cmp.extend({},options))}, 
        
             removeShowpost :  function(showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/remove/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
             saveShowpostInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showpost/save',_params,_body,cmp.extend({},options))}, 
        
             saveComment :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showpost/comment',_params,_body,cmp.extend({},options))}, 
        
             hasShowBarExist :  function(showbarId,_params,options){return SeeyonApi.Rest.get('show/showbar/check/exist/'+showbarId+'',_params,'',cmp.extend({},options))}, 
        
             transferShow :  function(showpostId,showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/transfer/'+showpostId+'/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             getShowauth :  function(_params,options){return SeeyonApi.Rest.get('show/show/showauth',_params,'',cmp.extend({},options))}, 
        
             checkRepeatName :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showbar/check/repeatName',_params,_body,cmp.extend({},options))}, 
        
             cancelShowpostTop :  function(showbarId,showpostId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/top/cancel/'+showbarId+'/'+showpostId+'',_params,_body,cmp.extend({},options))}, 
        
             hasGroupAuth :  function(_params,options){return SeeyonApi.Rest.get('show/hasGroupAuth',_params,'',cmp.extend({},options))}, 
        
             cancelShowbarTop :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/top/cancel/'+showbarId+'',_params,_body,cmp.extend({},options))}, 
        
             saveShowbarInfo :  function(_params,_body,options){return SeeyonApi.Rest.post('show/showbar/save',_params,_body,cmp.extend({},options))}, 
        
             removeComment :  function(showpostId,replyId,_params,_body,options){return SeeyonApi.Rest.post('show/showpost/comment/remove/'+showpostId+'/'+replyId+'',_params,_body,cmp.extend({},options))}, 
        
             getShowThreeList :  function(_params,_body,options){return SeeyonApi.Rest.post('show/getShowThreeList',_params,_body,cmp.extend({},options))}, 
        
             getShowbarDetail :  function(showbarId,_params,options){return SeeyonApi.Rest.get('show/showbar/'+showbarId+'',_params,'',cmp.extend({},options))}, 
        
             uploadImages :  function(_params,_body,options){return SeeyonApi.Rest.post('show/uploadImages',_params,_body,cmp.extend({},options))}, 
        
             setShowbarTop :  function(showbarId,_params,_body,options){return SeeyonApi.Rest.post('show/showbar/top/'+showbarId+'',_params,_body,cmp.extend({},options))} 
        
        
    	},
		Shows : {
           
             getShowpostList :  function(_params,options){return SeeyonApi.Rest.get('shows/showpost',_params,'',cmp.extend({},options))}, 
        
             findComments :  function(_params,options){return SeeyonApi.Rest.get('shows/showpost/comment',_params,'',cmp.extend({},options))}, 
        
             getShowbarList :  function(_params,_body,options){return SeeyonApi.Rest.post('shows/showbar',_params,_body,cmp.extend({},options))}, 
        
             getDefaultCover :  function(_params,options){return SeeyonApi.Rest.get('shows/showbar/defaultCover',_params,'',cmp.extend({},options))}, 
        
             latestShowposts :  function(page,_params,options){return SeeyonApi.Rest.get('shows/showpost/'+page+'',_params,'',cmp.extend({},options))},
	        
             showposts :  function(page,pageSize,_params,options){return SeeyonApi.Rest.get('shows/showpost/'+page+'/'+pageSize+'',_params,'',cmp.extend({},options))}
	        
	    }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);