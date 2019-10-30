;
(function(global) {
    var api = {
        Inquiry : {
            getInquiriesTypeByUnitId : function(unitId, _params, options) {
                return SeeyonApi.Rest.get('inquiry/inquiriesType/unit/' + unitId + '', _params, '', cmp.extend({}, options))
            },

            getGroupInquiriesType : function(_params, options) {
                return SeeyonApi.Rest.get('inquiry/inquiriesType/group', _params, '', cmp.extend({}, options))
            },

            delInquiry : function(inquiryId, _params, options) {
                return SeeyonApi.Rest.get('inquiry/delInquiry/' + inquiryId + '', _params, '', cmp.extend({}, options))
            },

            inqAudit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiry/audit', _params, _body, cmp.extend({}, options))
            },

            inquiryCreate : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiry', _params, _body, cmp.extend({}, options))
            },

            unlockInquiry : function(inquiryId, _params, options) {
                return SeeyonApi.Rest.get('inquiry/audit/unlock/' + inquiryId + '', _params, '', cmp.extend({}, options))
            },

            getInquiriesByUnitId : function(unitId, loginName, _params, options) {
                return SeeyonApi.Rest.get('inquiry/unit/' + unitId + '/' + loginName + '', _params, '', cmp.extend({}, options))
            },

            submitInquiry : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiry/save', _params, _body, cmp.extend({}, options))
            },

            publishInquiry : function(inquiryId, _params, options) {
                return SeeyonApi.Rest.get('inquiry/publishInquiry/' + inquiryId + '', _params, '', cmp.extend({}, options))
            },

            getInquiriesTypeByBoardId : function(boardId, loginName, _params, options) {
                return SeeyonApi.Rest.get('inquiry/inquiriesType/' + boardId + '/' + loginName + '', _params, '', cmp.extend({}, options))
            },

            inquiryDetails : function(inquiryId, affairId, comeFrom, affairState, _params, options) {
                return SeeyonApi.Rest.get('inquiry/' + inquiryId + '/' + affairId + '/' + comeFrom + '/' + affairState + '', _params, '', cmp.extend({}, options))
            },

            inquiryNewCreate : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiry/create', _params, _body, cmp.extend({}, options))
            },

            checkInquiryState : function(inquiryId, _params, options) {
                return SeeyonApi.Rest.get('inquiry/state/' + inquiryId + '', _params, '', cmp.extend({}, options))
            }
        },
        Inquiries : {
            inquiriesList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiries', _params, _body, cmp.extend({}, options))
            },

            startInquiryList : function(_params, _body, options) {
                return SeeyonApi.Rest.post('inquiries/iStarted', _params, _body, cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);