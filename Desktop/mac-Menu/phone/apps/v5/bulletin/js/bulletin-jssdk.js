;
(function(global) {
    var api = {
        CmpBulletin : {
            bulAudit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpBulletin/audit', _params, _body, cmp.extend({}, options))
            },

            bulletinDetails : function(bulId, comeFrom, affairId, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletin/' + bulId + '/' + comeFrom + '/' + affairId + '', _params, '', cmp.extend({}, options))
            },

            unlockBulletin : function(bulId, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletin/audit/unlock/' + bulId + '', _params, '', cmp.extend({}, options))
            },

            bulState : function(bulId, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletin/state/' + bulId + '', _params, '', cmp.extend({}, options))
            },

            publishBulletin : function(bulId, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletin/publish/' + bulId + '', _params, '', cmp.extend({}, options))
            },

            issueBulletin : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpBulletin/issue', _params, _body, cmp.extend({}, options))
            },

            preIssueBulletin : function(bodyType, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletin/issue/prepare/' + bodyType + '', _params, '', cmp.extend({}, options))
            }
        },
        CmpBulletins : {
            searchByRobot : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpBulletins/searchByRobot', _params, _body, cmp.extend({}, options))
            },

            bulletinsList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('cmpBulletins', _params, _body, cmp.extend({}, options))
            },

            getCountByReadState : function(readState, _params, options) {
                return SeeyonApi.Rest.get('cmpBulletins/count/' + readState + '', _params, '', cmp.extend({}, options))
            },
            bulTypeList :  function(_params,options){
            	return SeeyonApi.Rest.get('cmpBulletins/type/typeList',_params,'',cmp.extend({},options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);