(function(_){
    _.contentEdit = {};

    //打开正文
    _.contentEdit.open = function(options){
        var _options = {
            copyRight:null,//金格授权码
            filename:null,//文件名
            fileType:null,//文件类型，如doc
            path:null,//文件下载路径
            extData:{
                fileId:null,//文件id  用于储存在数据库用
                lastModified:null,//文件lastModified
                origin: _.origin//域名
            },
            success: null,//成功回调
            error: null//失败回调
        };
        _options = _.extend(_options, options);
		var action = "openDocument";
		if(/pdf/i.test(_options.fileType)){
			action = "openPDF";
		}
        cordova.exec(
            _options.success,
            _options.error,
            "OfficePlugin",
            action,
            [
                {
                    "copyRight": _options.copyRight,
                    "filename": _options.filename,
                    "fileType":_options.fileType,
                    "path":_options.path,
                    "extData": _options.extData
                }
            ]
        );
    };

    //关闭正文
    _.contentEdit.close = function(options){
        var _options = {
            success:function(filepath){//返回保存后的手机本地路径
                options.success && typeof options.success == "function" && options.success.call(this,filepath);
            },
            error:options.error
        }
        cordova.exec(
            _options.success,
            _options.error,
            "OfficePlugin",
            "closeDocument",
            [{}]
        );
    };
    //清空正文
    _.contentEdit.clear = function(options){
        var _options = {
            fileId:"",//文件id
            lastModified:"",//文件lastModify
            success:null,
            error:null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfficePlugin",
            "clearDocument",
            [{
                fileId:_options.fileId,
                lastModified:_options.lastModified
            }]
        );
    }
})(cmp);