;
(function(global) {
    var api = {
        Asset : {
            assetAuditInfo : function(_params, _body, options) {
                return SeeyonApi.Rest.post('asset/auditInfo', _params, _body, cmp.extend({}, options))
            },

            assetAuditCheck : function(_params, _body, options) {
                return SeeyonApi.Rest.post('asset/asset/auditCheck', _params, _body, cmp.extend({}, options))
            },

            assetAuditSubmit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('asset/auditSubmit', _params, _body, cmp.extend({}, options))
            },

            findAssetAudits : function(_params, _body, options) {
                return SeeyonApi.Rest.post('asset/audits', _params, _body, cmp.extend({}, options))
            }
        },
        Auto : {
            autoAuditInfo : function(_params, _body, options) {
                return SeeyonApi.Rest.post('auto/auditInfo', _params, _body, cmp.extend({}, options))
            },

            autoAuditSubmit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('auto/auditSubmit', _params, _body, cmp.extend({}, options))
            },

            findAutoAudits : function(_params, _body, options) {
                return SeeyonApi.Rest.post('auto/audits', _params, _body, cmp.extend({}, options))
            },

            autoAuditCheck : function(_params, _body, options) {
                return SeeyonApi.Rest.post('auto/auditCheck', _params, _body, cmp.extend({}, options))
            }
        },
        Stock : {
            stockAuditInfo : function(_params, _body, options) {
                return SeeyonApi.Rest.post('stock/auditInfo', _params, _body, cmp.extend({}, options))
            },

            stockAuditSubmit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('stock/auditSubmit', _params, _body, cmp.extend({}, options))
            },

            findStockAudits : function(_params, _body, options) {
                return SeeyonApi.Rest.post('stock/audits', _params, _body, cmp.extend({}, options))
            },

            stockAuditCheck : function(_params, _body, options) {
                return SeeyonApi.Rest.post('stock/auditCheck', _params, _body, cmp.extend({}, options))
            }
        },
        Book : {
            findBookAudits : function(_params, _body, options) {
                return SeeyonApi.Rest.post('book/audits', _params, _body, cmp.extend({}, options))
            },

            bookAuditCheck : function(_params, _body, options) {
                return SeeyonApi.Rest.post('book/auditCheck', _params, _body, cmp.extend({}, options))
            },

            bookAuditInfo : function(_params, _body, options) {
                return SeeyonApi.Rest.post('book/auditInfo', _params, _body, cmp.extend({}, options))
            },

            bookAuditSubmit : function(_params, _body, options) {
                return SeeyonApi.Rest.post('book/auditSubmit', _params, _body, cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);