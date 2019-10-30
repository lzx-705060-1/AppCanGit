(function(_){
    //特色组件
    _.distinc = {};

    /*
	 *判断是否有钱包权限，true：有，false：没有
	 */ 
    _.distinc.walletAuthorization = function(options){
		var successFun = function(msg){
			var result = msg == 1?true:false;
			if(typeof options.success == "function"){
				options.success(result);
			}
		}
        cordova.exec(
            successFun,
            options.error,
            "CMPWalletPlugin",
            "walletAuthorizationStatus",
            [{}]
        );
    }
    _.distinc.walletOpen = function(options){
		var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPWalletPlugin",
            "openWallet",
            [{}]
        );
	}

})(cmp);