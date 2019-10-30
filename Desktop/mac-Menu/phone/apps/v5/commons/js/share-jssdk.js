;
(function(global) {
    var api = {
        ShareRecord : {
            delShareRecord : function(_params, _body, options) {
                return SeeyonApi.Rest.post('shareRecord/del', _params, _body, cmp.extend({}, options))
            },

            saveShareRecord : function(_params, _body, options) {
                return SeeyonApi.Rest.post('shareRecord/save', _params, _body, cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);