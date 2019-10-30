/**
 * Created by youlin on 2016/8/11.
 */
(function(_) {
    _.handWriteSignature = {};
    /**
     * 初始化签章图片
     *
     * @param cfg value 为一个数组[object] object.fieldName、object.fieldName、object.fieldValue
     *
     * @return value 为一个数组[object] object.fieldName、object.fieldName、object.fieldValue、object.picData
     *
     */
    _.handWriteSignature.initSignatureData = function (cfg) {
        var _options;
        _options = {
            success: null,
            error: null,
            "value":""
        }
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "CMPHandWriteSignaturePlugin",
                "initSignatureData",
                [
                    {
                        "value":_options.value
                    }
                ]
            );
        }
        else {
        }
    };
    /**
     *
     * 显示签章组件
     * @param cfg
     */
    _.handWriteSignature.show = function (cfg) {
        var _options;
        _options = {
            success: null,
            error: null,
            "fieldName": "",
            "fieldValue": "", // 需要提交到服务前端的base64数据
            "height": "", // 签章控件高
            "width": "",   // 签章控件宽
            "picData": "", // 可以显示在当前表单的签章图片base64
            "recordID": "0",
            "summaryID": "",
            "currentOrgID": "",
            "currentOrgName": "",
            "signatureListUrl": "", //签章列表url地址,http//10.5.6.240:88/seeyon/rest/signet/signets
            "signaturePicUrl": "",//获取签章数据url地址,http//10.5.6.240:88/seeyon/rest/signet/signetPic
            "hasSignetures": false, // 是否有签章权限
            "affairId":""
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "CMPHandWriteSignaturePlugin",
                "handWriteSignature",
                [
                    {
                        "fieldName":_options.fieldName,
                        "fieldValue":_options.fieldValue,
                        "height":_options.height,
                        "width":_options.width,
                        "picData":_options.picData,
                        "recordID":_options.recordID,
                        "summaryID":_options.summaryID,
                        "currentOrgID":_options.currentOrgID,
                        "currentOrgName":_options.currentOrgName,
                        "signatureListUrl":_options.signatureListUrl,
                        "signaturePicUrl":_options.signaturePicUrl,
                        "hasSignetures":_options.hasSignetures,
                        "affairId":_options.affairId
                    }
                ]
            );
        }
        else {
        }
    };
    /**
     * 清除签章
     * @param cfg
     */
    _.handWriteSignature.clear = function (cfg) {
        var _options;
        _options = {
            success: null,
            error: null,
        }
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "CMPHandWriteSignaturePlugin",
                "clear",
                [
                    {
                    }
                ]
            );
        }
        else {
        }
    };
})(cmp);