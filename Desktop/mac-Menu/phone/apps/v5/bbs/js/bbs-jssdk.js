;
(function(global) {
    var api = {
        Bbs : {
            getBbsDetail : function(bbsId, from, _params, options) {
                return SeeyonApi.Rest.get('bbs/detail/' + bbsId + '/' + from + '', _params, '', cmp.extend({}, options))
            },

            removeBbs : function(bbsId, _params, options) {
                return SeeyonApi.Rest.get('bbs/remove/' + bbsId + '', _params, '', cmp.extend({}, options))
            },

            bbsReplyPraise : function(replyId, _params, _body, options) {
                return SeeyonApi.Rest.post('bbs/reply/praise/' + replyId + '', _params, _body, cmp.extend({}, options))
            },

            getBbsTypeByBoardId : function(boardId, loginName, _params, options) {
                return SeeyonApi.Rest.get('bbs/bbsType/' + boardId + '/' + loginName + '', _params, '', cmp.extend({}, options))
            },

            removeReply : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbs/reply/remove', _params, _body, cmp.extend({}, options))
            },

            bbsPraise : function(bbsId, _params, _body, options) {
                return SeeyonApi.Rest.post('bbs/' + bbsId + '/praise', _params, _body, cmp.extend({}, options))
            },

            bbsNewCreate : function(_params, options) {
                return SeeyonApi.Rest.get('bbs/create', _params, '', cmp.extend({}, options))
            },

            bbsSave : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbs/save', _params, _body, cmp.extend({}, options))
            },

            addReply : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbs/reply/add', _params, _body, cmp.extend({}, options))
            },

            bbsCreate : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbs', _params, _body, cmp.extend({}, options))
            },

            getBbsByUnitId : function(unitId, loginName, _params, options) {
                return SeeyonApi.Rest.get('bbs/unit/' + unitId + '/' + loginName + '', _params, '', cmp.extend({}, options))
            },

            getGroupBbsType : function(_params, options) {
                return SeeyonApi.Rest.get('bbs/bbsType/group', _params, '', cmp.extend({}, options))
            },

            bbsReplys : function(bbsId, _params, options) {
                return SeeyonApi.Rest.get('bbs/' + bbsId + '/replys', _params, '', cmp.extend({}, options))
            },

            getBbsTypeByUnitId : function(unitId, _params, options) {
                return SeeyonApi.Rest.get('bbs/bbsType/unit/' + unitId + '', _params, '', cmp.extend({}, options))
            },

            getBbsThreeList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbs/getBbsThreeList', _params, _body, cmp.extend({}, options))
            },
            vjoinAccess : function(accountId, _params, _body, options) {
                return SeeyonApi.Rest.post('bbs/board/vjoinAccess/' + accountId, _params, _body, cmp.extend({}, options))
            }
        },
        BbsList : {
            getBbsList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('bbsList', _params, _body, cmp.extend({}, options))
            },
            bbsBoardList :  function(_params,options){
              return SeeyonApi.Rest.get('bbsList/type/typeList', _params, '', cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);