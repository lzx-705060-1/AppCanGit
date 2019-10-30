;
(function(global) {
    var api = {
        Hr : {
            wagestrip : function(_params, _body, options) {
                return SeeyonApi.Rest.post('hr/wagestrip', _params, _body, cmp.extend({}, options))
            },

            createPwd : function(_params, options) {
                return SeeyonApi.Rest.get('hr/createPwd', _params, '', cmp.extend({}, options))
            },

            findSalaryByDate : function(_params, _body, options) {
                return SeeyonApi.Rest.post('hr/salary', _params, _body, cmp.extend({}, options))
            },

            isHasPwd : function(_params, options) {
                return SeeyonApi.Rest.get('hr/isHasPassword', _params, '', cmp.extend({}, options))
            },

            checkPwd : function(_params, _body, options) {
                return SeeyonApi.Rest.post('hr/checkPassword', _params, _body, cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);