;
(function(global) {
    var api = {
        CmpNews : {
            replays : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpNews/replays', _params, _body, cmp.extend({}, options))
            },

            removeReplyById : function(replyId, replyType, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/replays/remove/' + replyId + '/' + replyType + '', _params, '', cmp.extend({}, options))
            },

            newsAudit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpNews/audit', _params, _body, cmp.extend({}, options))
            },

            unlockNews : function(newsId, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/audit/unlock/' + newsId + '', _params, '', cmp.extend({}, options))
            },

            preIssueNews : function(bodyType, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/issue/prepare/' + bodyType + '', _params, '', cmp.extend({}, options))
            },

            addPraiseForComment : function(commentId, newsId, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/replay/like/' + commentId + '/' + newsId + '', _params, '', cmp.extend({}, options))
            },

            newsState : function(newsId, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/state/' + newsId + '', _params, '', cmp.extend({}, options))
            },

            newsDetails : function(newsId, comeFrom, affairId, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/' + newsId + '/' + comeFrom + '/' + affairId + '', _params, '', cmp.extend({}, options))
            },

            addReplay : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpNews/replay', _params, _body, cmp.extend({}, options))
            },

            issueNews : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpNews/issue', _params, _body, cmp.extend({}, options))
            },

            addPraiseForNews : function(newsId, _params, options) {
                return SeeyonApi.Rest.get('cmpNews/like/' + newsId + '', _params, '', cmp.extend({}, options))
            }
        },
        CmpNewsList : {
            newsList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpNewsList', _params, _body, cmp.extend({}, options))
            },

            getCountByReadState : function(readState, _params, options) {
                return SeeyonApi.Rest.get('cmpNewsList/count/' + readState + '', _params, '', cmp.extend({}, options))
            },
            newsTypeList :  function(_params,options){
            	return SeeyonApi.Rest.get('cmpNewsList/type/typeList',_params,'',cmp.extend({},options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);