;(function(global) {
	var api = {
		Excelreport : {
			detail : function(_params, _body, options) {
				return SeeyonApi.Rest.post('excelreport/detail', _params, _body, cmp.extend({}, options))
			}
		}
	}
	global.SeeyonApi = global.SeeyonApi || {};
	for ( var key in api) {
		global.SeeyonApi[key] = api[key];
	}
})(this);
