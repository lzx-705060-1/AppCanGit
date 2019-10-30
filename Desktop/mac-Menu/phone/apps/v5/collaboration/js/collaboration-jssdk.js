(function( global ) {
	var api = {
		Coll : {
            findWaitSentAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/waitSentAffairs',_params,_body,cmp.extend({},options))}, 
       
            takeBack :  function(_params,options){return SeeyonApi.Rest.get('coll/takeBack',_params,'',cmp.extend({},options))}, 
       
            finishWorkItem :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/finishWorkItem/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            findPendingAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/pendingAffairs',_params,_body,cmp.extend({},options))}, 
       
            logJs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/logjs',_params,_body,cmp.extend({},options))}, 
       
            checkCollTemplate :  function(_params,options){return SeeyonApi.Rest.get('coll/checkCollTemplate',_params,'',cmp.extend({},options))}, 
       
            getSenderAffairId :  function(objectId,_params,options){return SeeyonApi.Rest.get('coll/getSenderAffairId/'+objectId+'',_params,'',cmp.extend({},options))}, 
            
            sendByRobot :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/sendByRobot',_params,_body,cmp.extend({},options))}, 
       
            getTrackInfo :  function(affairId,_params,options){return SeeyonApi.Rest.get('coll/trackInfo/'+affairId+'',_params,'',cmp.extend({},options))}, 
       
            getColQuoteCounts :  function(_params,options){return SeeyonApi.Rest.get('coll/colQuoteCounts',_params,'',cmp.extend({},options))}, 
       
            showNodeMembers :  function(_params,options){return SeeyonApi.Rest.get('coll/node/members',_params,'',cmp.extend({},options))}, 
       
            getSelfCollConfig :  function(_params,options){return SeeyonApi.Rest.get('coll/getSelfCollConfig',_params,'',cmp.extend({},options))}, 
       
            permissions :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/permissions',_params,_body,cmp.extend({},options))}, 
       
            doZCDB :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/doZCDB/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            doBatchStepbackColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchStepbackColl',_params,_body,cmp.extend({},options))}, 
       
            saveOrUpdate :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/saveOrUpdate',_params,_body,cmp.extend({},options))}, 
       
            pushMessageToMembersList :  function(_params,options){return SeeyonApi.Rest.get('coll/pushMsgMembers',_params,'',cmp.extend({},options))}, 
       
            selfCollMore :  function(_params,options){return SeeyonApi.Rest.get('coll/selfCollMore',_params,'',cmp.extend({},options))}, 
       
            likeComment :  function(commentId,_params,options){return SeeyonApi.Rest.get('coll/comment/like/'+commentId+'',_params,'',cmp.extend({},options))}, 
       
            lockCollForm :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/lockCollForm',_params,_body,cmp.extend({},options))}, 
       
            collUserPrivMenuAndQuoteCounts :  function(_params,options){return SeeyonApi.Rest.get('coll/collaboration/user/privMenuAndQuoteCounts',_params,'',cmp.extend({},options))}, 
       
            updateLockTime :  function(_params,options){return SeeyonApi.Rest.get('coll/updateLockTime',_params,'',cmp.extend({},options))}, 
       
            multiCall :  function(_params,options){return SeeyonApi.Rest.get('coll/multiCall',_params,'',cmp.extend({},options))}, 
       
            transRepal :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/transRepeal/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            transfer :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transfer',_params,_body,cmp.extend({},options))}, 
            
            quickfinishWorkItem :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/quick/finish',_params,_body,cmp.extend({},options))},
       
            getDataRelationByDR :  function(_params,options){return SeeyonApi.Rest.get('coll/getDataRelationByDR',_params,'',cmp.extend({},options))}, 
       
            doBatchColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchColl',_params,_body,cmp.extend({},options))}, 
       
            send :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/send',_params,_body,cmp.extend({},options))}, 
       
            transPigeonhole :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transPigeonhole',_params,_body,cmp.extend({},options))}, 
       
            collaborationUserPeivMenu :  function(_params,options){return SeeyonApi.Rest.get('coll/collaboration/user/privMenu',_params,'',cmp.extend({},options))}, 
       
            doBatchTerminateColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchTerminateColl',_params,_body,cmp.extend({},options))}, 
       
            forwardParams :  function(_params,options){return SeeyonApi.Rest.get('coll/forwardParams',_params,'',cmp.extend({},options))}, 
       
            attachments :  function(summaryId,affairId,attType,_params,options){return SeeyonApi.Rest.get('coll/attachments/'+summaryId+'/'+affairId+'/'+attType+'',_params,'',cmp.extend({},options))}, 
       
            checkTemplateCanUse :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/checkTemplateCanUse',_params,_body,cmp.extend({},options))}, 
       
            hasten :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/hasten',_params,_body,cmp.extend({},options))}, 
       
            checkAffairValid :  function(_params,options){return SeeyonApi.Rest.get('coll/checkAffairValid',_params,'',cmp.extend({},options))}, 
       
            doBatchRepealColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/doBatchRepealColl',_params,_body,cmp.extend({},options))}, 
       
            isTemplateDeleted :  function(_params,options){return SeeyonApi.Rest.get('coll/forward/check/template',_params,'',cmp.extend({},options))}, 
       
            stepStop :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/stepStop/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            transColForward :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transColForward',_params,_body,cmp.extend({},options))}, 
       
            cancelFavoriteAffair :  function(_params,options){return SeeyonApi.Rest.get('coll/cancelFavoriteAffair',_params,'',cmp.extend({},options))}, 
       
            stepBack :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/stepBack/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            findDoneAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/doneAffairs',_params,_body,cmp.extend({},options))}, 
       
            updateAppointStepBack :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/updateAppointStepBack',_params,_body,cmp.extend({},options))}, 
       
            sendImmediate :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/sendImmediate/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            saveDraft :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/saveDraft',_params,_body,cmp.extend({},options))}, 
       
            checkCanDelete :  function(_params,options){return SeeyonApi.Rest.get('coll/checkCanDelete',_params,'',cmp.extend({},options))}, 
       
            newColl :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/new',_params,_body,cmp.extend({},options))}, 
       
            unlockCollAll :  function(_params,options){return SeeyonApi.Rest.get('coll/unlockCollAll',_params,'',cmp.extend({},options))}, 
       
            repeal :  function(affairId,_params,_body,options){return SeeyonApi.Rest.post('coll/repeal/'+affairId+'',_params,_body,cmp.extend({},options))}, 
       
            checkPreBatch :  function(_params,options){return SeeyonApi.Rest.get('coll/batch/checkPreBatch',_params,'',cmp.extend({},options))}, 
       
            summary :  function(openFrom,affairId,summaryId,_params,options){return SeeyonApi.Rest.get('coll/summary/'+openFrom+'/'+affairId+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
       
            transStepBackValid :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transStepBackValid',_params,_body,cmp.extend({},options))}, 
       
            getColQuotes :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/colQuotes',_params,_body,cmp.extend({},options))}, 
       
          
            getCollListByRobot :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getCollListByRobot',_params,_body,cmp.extend({},options))}, 
       
            findSentAffairs :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/sentAffairs',_params,_body,cmp.extend({},options))}, 
       
            templateSendMore :  function(_params,options){return SeeyonApi.Rest.get('coll/templateSendMore',_params,'',cmp.extend({},options))}, 
       
            checkForwardPermission :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/check/forward',_params,_body,cmp.extend({},options))}, 
       
            getPigeonholeRight :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getPigeonholeRight',_params,_body,cmp.extend({},options))}, 
       
            getByDataRelationIds :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getByDataRelationIds',_params,_body,cmp.extend({},options))}, 
       
            favoriteAffair :  function(_params,options){return SeeyonApi.Rest.get('coll/favoriteAffair',_params,'',cmp.extend({},options))}, 
       
            handlers :  function(type,summaryId,_params,options){return SeeyonApi.Rest.get('coll/handlers/'+type+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
       
            commentsCount :  function(summaryId,_params,options){return SeeyonApi.Rest.get('coll/commentsCount/'+summaryId+'',_params,'',cmp.extend({},options))}, 
       
            templateDealMore :  function(_params,options){return SeeyonApi.Rest.get('coll/templateDealMore',_params,'',cmp.extend({},options))}, 
       
            summaryComment :  function(type,summaryId,_params,options){return SeeyonApi.Rest.get('coll/comments/'+type+'/'+summaryId+'',_params,'',cmp.extend({},options))}, 
       
            checkOperation :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/batch/checkOperation',_params,_body,cmp.extend({},options))}, 
       
            getIsSamePigeonhole :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getIsSamePigeonhole',_params,_body,cmp.extend({},options))}, 
       
            newCollaborationPolicy :  function(_params,options){return SeeyonApi.Rest.get('coll/newCollaborationPolicy',_params,'',cmp.extend({},options))}, 
       
            projectMore :  function(_params,options){return SeeyonApi.Rest.get('coll/projectMore',_params,'',cmp.extend({},options))}, 
       
            comment :  function(summaryId,_params,_body,options){return SeeyonApi.Rest.post('coll/comment/'+summaryId+'',_params,_body,cmp.extend({},options))}, 
       
            getCollProcessXmlandJson :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/getCollProcessXmlandJson',_params,_body,cmp.extend({},options))}, 
       
            checkAffairAndLock4NewCol :  function(_params,options){return SeeyonApi.Rest.get('coll/check/send',_params,'',cmp.extend({},options))}, 
       
            transRepalValid :  function(_params,_body,options){return SeeyonApi.Rest.post('coll/transRepalValid',_params,_body,cmp.extend({},options))}, 
       
            deleteAffairs :  function(from,affairIds,_params,options){return SeeyonApi.Rest.get('coll/deleteAffairs/'+from+'/'+affairIds+'',_params,'',cmp.extend({},options))} 
		},
        Template : {
            formTemplates :  function(_params,options){return SeeyonApi.Rest.get('template/formTemplates',_params,'',cmp.extend({},options))}
        }
    }
	global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);