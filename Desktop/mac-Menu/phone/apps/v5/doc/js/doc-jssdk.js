;
(function(global) {
    var api = {
        Docs : {
            uploadDocFile : function(_params, _body, options) {
                return SeeyonApi.Rest.post('docs/uploadDocFile', _params, _body, cmp.extend({}, options))
            },

            pigeonholeFolder : function(_params, options) {
                return SeeyonApi.Rest.get('docs/pigeonholeFolder', _params, '', cmp.extend({}, options))
            },

            archiveLibraries : function(_params, options) {
                return SeeyonApi.Rest.get('docs/archive', _params, '', cmp.extend({}, options))
            },

            archiveList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('docs/search', _params, _body, cmp.extend({}, options))
            },

            myFavorityList : function(_params, options) {
                return SeeyonApi.Rest.get('docs/myFavorityList', _params, '', cmp.extend({}, options))
            },

            pigeonholeList : function(_params, options) {
                return SeeyonApi.Rest.get('docs/pigeonholeList', _params, '', cmp.extend({}, options))
            },

            hasAcl : function(_params, options) {
                return SeeyonApi.Rest.get('docs/hasAcl', _params, '', cmp.extend({}, options))
            },

            docs : function(_params, options) {
                return SeeyonApi.Rest.get('docs/files', _params, '', cmp.extend({}, options))
            },

            getDosBySourceId : function(sourceId, _params, options) {
                return SeeyonApi.Rest.get('docs/getDosBySourceId/' + sourceId + '', _params, '', cmp.extend({}, options))
            },

            doclibs : function(_params, options) {
                return SeeyonApi.Rest.get('docs/libs', _params, '', cmp.extend({}, options))
            },

            getPath : function(drId, isShareAndBorrowRoot, frType, isPigeonhole, _params, options) {
                return SeeyonApi.Rest.get('docs/getPath/' + drId + '/' + isShareAndBorrowRoot + '/' + frType + '/' + isPigeonhole + '', _params, '', cmp.extend({}, options))
            },

            archiveList4XZ : function(_params, _body, options) {
                return SeeyonApi.Rest.post('docs/archiveList4XZ', _params, _body, cmp.extend({}, options))
            },

            createFoleder : function(_params, _body, options) {
                return SeeyonApi.Rest.post('docs/createFoleder', _params, _body, cmp.extend({}, options))
            },

            getMyDoc4XZ : function(_params, _body, options) {
                return SeeyonApi.Rest.post('docs/myDoc', _params, _body, cmp.extend({}, options))
            }
        },
        Doc : {
            hasOpenPermissionByArgs : function(_params, options) {
                return SeeyonApi.Rest.get('doc/hasOpenPermission', _params, '', cmp.extend({}, options))
            },

            exitsDocLib : function(_params, options) {
                return SeeyonApi.Rest.get('doc/exitsDocLib', _params, '', cmp.extend({}, options))
            },

            removeReply : function(replyId, _params, options) {
                return SeeyonApi.Rest.get('doc/replay/remove/' + replyId + '', _params, '', cmp.extend({}, options))
            },

            replys : function(_params, _body, options) {
                return SeeyonApi.Rest.post('doc/replys', _params, _body, cmp.extend({}, options))
            },

            docView : function(_params, options) {
                return SeeyonApi.Rest.get('doc/docView', _params, '', cmp.extend({}, options))
            },

            insertOpLog4Doc : function(_params, options) {
                return SeeyonApi.Rest.get('doc/insertOpLog4Doc', _params, '', cmp.extend({}, options))
            },

            getCtpFileById : function(ctpFileId, _params, options) {
                return SeeyonApi.Rest.get('doc/getctpfile/' + ctpFileId + '', _params, '', cmp.extend({}, options))
            },

            getMySpace : function(_params, options) {
                return SeeyonApi.Rest.get('doc/getMySpace', _params, '', cmp.extend({}, options))
            },

            getDocResource : function(docResourceId, _params, options) {
                return SeeyonApi.Rest.get('doc/' + docResourceId + '', _params, '', cmp.extend({}, options))
            },

            cancelFavorite : function(_params, options) {
                return SeeyonApi.Rest.get('doc/favorite/cancel', _params, '', cmp.extend({}, options))
            },

            getContentAndAtt : function(_params, options) {
                return SeeyonApi.Rest.get('doc/getContentAndAtt', _params, '', cmp.extend({}, options))
            },

            saveReply : function(_params, _body, options) {
                return SeeyonApi.Rest.post('doc/replay/save', _params, _body, cmp.extend({}, options))
            },

            canOppen : function(_params, options) {
                return SeeyonApi.Rest.get('doc/canOppen', _params, '', cmp.extend({}, options))
            },

            favorite : function(_params, options) {
                return SeeyonApi.Rest.get('doc/favorite', _params, '', cmp.extend({}, options))
            },

            isExist : function(_params, options) {
                return SeeyonApi.Rest.get('doc/isExist', _params, '', cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);