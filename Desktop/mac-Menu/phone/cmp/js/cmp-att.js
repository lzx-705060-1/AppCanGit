(function(_){
    if(typeof cmpAttI18nLoaded  == "undefined") _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-att',function(){
        cmpAttI18nLoaded = true;
        _.event.trigger("cmp-att-init",document);
    },cmpBuildversion);
    //===========================================================附件操作 start=======================================//
    /**
     * 附件部分的上传,下载,查看,编辑等
     * @class att
     * @namespace cmp
     * @type {{}}
     */
    _.att = {};
    /**
     * @description 金格打开wps
     * @param {object} param 参数
     * @param {function} success 成功回调
     * @param {function} fail 失败回调
     */
    _.att.openWpsByJinge = function(param, success, fail) {
        cmp.sdk.openWpsByJinge(param, success || function() {}, function(err) {
            var _message, defaultMsg = _.i18n('jingeOpenFail');
            if (cmp.os.ios) {
                _message = err || defaultMsg;
            } else {
                _message = err.message || defaultMsg;
            }
            fail(err);
            cmp.notification.alertView({
                title:_.i18n('failTip'),
                message: message,
                buttonTitles:[_.i18n('cmp.att.ok')],
                success:function(){}
            });
        });
    }
    _.att.iconCss = function (type, flag) {
        var className = "cmp-icon-document ";
        type = type.substring(type.lastIndexOf(".") + 1);
        switch (type) {
            case "gif":
            case "jpg":
            case "jpeg":
            case "bmp":
            case "png":
            case "tif":
            case "tiff":
                className += "img";
                break;
            case "txt":
                className += "txt";
                break;
            case "doc":
            case "docx":
                className += "doc";
                break;
            case "xls":
            case "xlsx":
                className += "xls";
                break;
            case "ppt":
            case "pptx":
                className += "ppt";
                break;
            case "pdf":
                className += "pdf";
                break;
            case "xml":
                className += "xml";
                break;
            case "html":
            case "htm":
            case "xhtml":
                className += "html";
                break;
            case "et":
                className += "et";
                break;
            case "wps":
                className += "wps";
                break;
            case "mp3":
            case "rm":
            case "wav":
            case "wma":
            case "mp4":
            case "amr":
                className += "music";
                break;
            case "3gp":
            case "rmvb":
            case "avi":
                className += "video";
                break;
            case "collaboration":// 协同应用
                className += "synergy";
                break;
            case "form":// 表单
                className += "squares";
                break;
            case "edoc": // 公文
                className += "flag";
                break;
            case "plan"://计划
                className += "cal";
                break;
            case "meeting":// 会议
                className += "meet";
                break;
            case "bulletin":// 公告
                className += "minvideo";
                break;
            case "news":// 新闻
                className += "news";
                break;
            case "bbs"://讨论
                className += "message";
                break;
            case "inquiry"://调查
                className += "confirm";
                break;
            case "link"://映射文件
            case "km"://文档中心乱七八糟的类型
                className += "link";
                break;
            case "zip"://zip
            case "rar":
                className += "rar";
                break;
            case "cvs":
                className += "cvs";
                break;
            case "":
                className += "synergy";
                break;

            default :
                className += "emptyfile";
                break;
        }
        return className;
    };
    _.att.countAttSize = function (size) {
        var result = "0B";
        var temp = size;
        if (size == null) {
            return "";
        }
        if (typeof size == "string") {
            size = parseInt(size);
        }
        if (size == 0) {
            result = "1B";
        } else {
            var k = 0;
            result = size;
            while (result >= 1024) {
                result = result / (1024);
                k++;
            }
            result = result.toString();
            var inte = result.indexOf(".") > 0 ? result.substring(0,
                result.indexOf(".")) : result;
            var flot = result.indexOf(".") > 0 ? result.substring(result
                .indexOf(".")) : "";
            if (flot.length > 3) {
                flot = flot.substring(0, 2);
            }
            result = inte + flot;
            var suff = ["B", "KB", "MB", "GB", "TB"];
            result = result + suff[k];
        }
        return result;
    };
    /**
     * 根据文件全路径获取文件名
     * @param filepath
     * @returns {string}
     */
    _.att.filename = function(filepath){
        if(filepath.indexOf("/") != -1){
            filepath = filepath.substring(filepath.lastIndexOf("/")+1);
        }
        return filepath;
    };
    /**
     * 根据文件全路径获取文件id（没有后缀）
     * @param filepath
     * @returns {string|*}
     */
    _.att.fileId = function(filepath){
        var fileId = _.att.filename(filepath);
        if(fileId.indexOf(".") != -1){
            fileId = fileId.substring(0,fileId.lastIndexOf("."));
        }
        return fileId;
    };
    /**
     * 根据文件全路径获取文件类型
     * @param filepath
     * @returns {string}
     */
    _.att.type = function(filepath){
        var type = "";
        var filename = _.att.filename(filepath);
        if(filename.indexOf(".") != -1){
            type = filename.substring(filename.lastIndexOf(".") + 1);
        }
        return type;
    };
    _.att.canSee = function(extension){
        if (_.os.android) {return true};
        var canSee = false;
        switch (extension.toLocaleLowerCase()){
            case "word":
            case "excel":
            case "ppt":
            case "pptx":
            case "wps":
            case "et":
            case "mp3":
            case "mp4":
            case "txt":
            case "pdf":
            case "html":
            case "tif":
            case "tiff":
            case "png":
            case "bmp":
            case "jpg":
            case "jpeg":
            case "gif":
            case "amr":
            case "wav":
            case "doc":
            case "docx":
            case "xls":
            case "xlsx":
                canSee = true;
                break;
            default:
                break;
        }
        return canSee;
    };
    _.att.canPlay = function(type){
        var canPlay = false;
        switch (type){
            case "wav":
            case "mp3":
            case "amr":
                canPlay = true;
                break;
        }
        return canPlay;
    };
    _.att.canDownload4Wechat = function(extension){
        var canDownload = false;
        switch (extension.toLocaleLowerCase()){
            case "word":
            case "excel":
            case "ppt":
            case "pptx":
            case "pdf":
            case "html":
            case "png":
            case "bmp":
            case "jpg":
            case "jpeg":
            case "gif":
            case "doc":
            case "docx":
            case "tif":
            case "tiff":
            case "xls":
            case "xlsx":
            case "et"://金格的excel文件-----对应xlsx
            case "wps"://金格的word文件-----对应doc
                canDownload = true;
                break;
            case "txt":
                if(!_.platform.wechatOrDD){
                    canDownload = true;
                }
                break;
            default:
                break;
        }
        return canDownload;
    };

    /**
     * 附件下载
     * @method download
     */
    _.att.download = function (options) {

        var _options = {
            url: "",
            title: "",
            isSaveToLocal:true,//文件是否保存到本地离线文件中
            extData: null,
            progress: function () {
            },
            success: function () {
            },
            error: null
        };
        _options = _.extend(_options, options);
        if(_.platform.wechatOrDD ){
            downloadFile4Wechat(_options);
        }else if(_.platform.CMPShell){
            if(_.platform.M3W){ //m3集成微协同要带上token
                _options.url = convertFilePath4Wechat(_options.url);
            }
            cordova.exec(
                function (result) {
                    var tempStr = result;
                    try {
                        result = cmp.parseJSON(tempStr);
                    } catch (e) {
                        result = tempStr;
                    }
                    if (parseInt(result["pos"]) == 1) {
                        _options.success(result);
                    } else {
                        _options.progress(result);
                    }
                },
                _options.error,
                "DownLoadPlugin",
                "download",
                [
                    {
                        "url": _options.url,
                        "title": _options.title,
                        "extData": _options.extData,
                        "isSaveToLocal":_options.isSaveToLocal
                    }
                ]
            );
        }else if(_.platform.third){
            cmp.event.trigger("cmpThirdPlatformPlugins",document,{data:_options,backupsFun:downloadFile4Wechat,plugin:"download"});
        }

    };


    /**
     * 获取下载列表信息
     */
    _.att.getDownLoadListInfo = function (options) {
        var _options = {
            success: null,
            error: null
        };

        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "DownLoadPlugin",
            "getDownLoadListInfo",
            [{}]
        );
    };


    /**
     * 附件上传
     */
    _.att.upload = function (options) {
        var _options = {
            url: "",
            fileList: [],
            extData: null,
            imgIndex:"sortNum",
            progress: function () {
            },
            success: function () {
            },
            error: function(){}
        };
        _options = _.extend(_options, options);
        if(_.platform.wechatOrDD){//使用ajax上传文件
            uploadFileByAjax(_options);
        }else  if(_.platform.CMPShell){
            if(_.platform.M3W){
                _options.url = convertFilePath4Wechat(_options.url);
            }

            cordova.exec(
                function (result) {
                    var tempStr = result;
                    try {
                        result = cmp.parseJSON(tempStr);
                    } catch (e) {
                        result = tempStr;
                    }
                    if (parseInt(result["pos"]) == 1) {
                        _options.success(result);
                    }else {
                        _options.progress(result);
                    }
                    if (result["finish"] == true || parseInt(result["finish"]) == 1 || result["finish"] == "true") {
                        _options.success(result);
                    }
                },
                _options.error,
                "FileUploadPlugin",
                "upload",
                [
                    {
                        "url": _options.url,
                        "fileList": _options.fileList,
                        "extData": _options.extData,
                        "imgIndex":_options.imgIndex
                    }
                ]
            );
        }else if(_.platform.third){
            _.event.trigger("cmpThirdPlatformPlugins",document,{data:_options,backupsFun:uploadFileByAjax,plugin:"upload"})
        }
    };
    /**
     * 获取下载列表信息
     */
    _.att.getUploadListInfo = function (options) {
        var _options = {
            success: null,
            error: null
        };

        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "FileUploadPlugin",
            "getUploadListInfo",
            [
                {}
            ]
        );
    };

    /**
     * 根据路径读取文件信息
     * filepath:数组，可以传多个文件，返回的信息对应到相应的文件上
     * @param options
     */
    _.att.getFileInfo = function(options){
        var _options = _.extend({
            filepath:null,
            success:null,
            error:null
        },options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPFilePlugin",
            "getFileInfo",
            [
                {filepath:_options.filepath}
            ]
        );
    };

    var _getParamForPath = function (path, paramKey) {
        var s_param = "", a_param = [], p_value = '';
        if (path.indexOf("?") >= 0) {
            s_param = path.split("?")[1];
        } else if (path.indexOf(".") > 0) {
            if (path.lastIndexOf("/") > 0) {
                p_value = path.substring(path.lastIndexOf("/") + 1, path.length);
            } else {
                p_value = path
            }
            return p_value;
        } else {
            return path;
        }

        if (s_param.length > 0) {
            a_param = s_param.split("&");
        } else {
            return "";
        }

        for (var i = (a_param.length-1); i >= 0; i--) {
            var param = a_param[i].split("=");
            if (param[0] == paramKey) {
                p_value = param[1];
                break;
            }
        }
        return p_value;
    };

    /**
     * 查看附件内容,包括pdf,excel,word,jpeg...
     */
    _.att.read = function (options) {
        var _options = {
            path: "", //和openFile的url相同
            edit:false,//新增-----是否可编辑
            filename: "",
            extData:null,//原来readAttachment 有fileId、lastModified、origin三个参数，openFile增加1、editable:是否可编译；2、autoSave：是否自动保存到离线文档；3、autoOpen:是否自动打开
            success: null,
            error: null,
            //=========================openFile参数
            header:null,//文件下载头
            localPath:null,//文件本地路径
            fileId:null,//文件唯一标识
            type:null,//文件类型
            size:null,//文件大小
            openFile:false
        };
        _options = _.extend(_options, options);
        var extension;
        if(_options.filename){
            extension = _options.filename.substring(_options.filename.lastIndexOf(".")+1);
        }else {
            extension = _.att.type(_options.path);
        }
        if(!_.att.canSee(extension)){
            _.notification.toast(_.i18n("cmp.att.noApp"),"bottom",1000);
            return;
        }
        var path = _options.path;
        if(_.platform.wechatOrDD){
            downloadFile4Wechat(options);
        }else if(_.platform.CMPShell){
            if (!options['filename']) {
                options['filename'] = _getParamForPath(path, 'filename');
            }
            if(_.platform.M3W){//如果是M3集成微协同，需要转换带上token
                _options.path = convertFilePath4Wechat(path);
            }

            if(_options.extData){
                if(typeof _options.extData.origin == "undefined"){
                    _options.extData.origin = _.origin;
                }
            }
            if(_options.openFile){
                cordova.exec(
                    _options.success,
                    _options.error,
                    "AttachmentPlugin",
                    "openFile",
                    [
                        {
                            "url": _options.path,
                            "header":_options.header,
                            "filePath":_options.localPath,
                            "fileId":_options.fileId,
                            "fileName": _options.filename,
                            "fileType":_options.type,
                            "fileSize":_options.size,
                            "extra":_options.extData
                        }
                    ]
                );
            }else {
                cordova.exec(
                    _options.success,
                    _options.error,
                    "AttachmentPlugin",
                    "readAttachment",
                    [
                        {
                            "path": _options.path,
                            "filename": _options.filename,
                            "edit":_options.edit,
                            "extData":_options.extData
                        }
                    ]
                );
            }
        }else if(_.platform.third){
            _.event.trigger("cmpThirdPlatformPlugins",document,{data:_options,backupsFun:downloadFile4Wechat,plugin:"read"})
        }
    };
    var hasOpenByThirdAppPlugin = false;
   //使用第三方app打开
    _.att.openByThirdApp = function(options){
        var _options = {
            path: "",
            filename: "",
            extData: null,
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "AttachmentPlugin",
            "openFileByThirdApp",
            [_options]
        );
    };
    _.ready(function(){
        if(_.platform.CMPShell && _.os.ios){
            cordova.exec(
                function(res){
                    if(res == "true") hasOpenByThirdAppPlugin = true;
                },null,"AttachmentPlugin","hasOpenFileByThirdApp",[{}]);
        }
    });

    /**
     * 保存base64数据到本地
     * @param options
     *         options.base64 base64数据
     *         options.filename 保存成文件的名称
     *         options.type 保存成文件的类型
     */
    _.att.saveBase64 = function(options){
        var _options = {
            base64: null,
            filename: null,
            type:null,
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPFilePlugin",
            "saveBase64",
            [
                {
                    "base64": _options.base64,
                    "filename": _options.filename,
                    "type":_options.type
                }
            ]
        );
    };
    //=============================================================附件操作 end=======================================//

    //============================================================离线文件 start======================================//
    _.att.getOfflineFiles = function(options){
        var _options = {
            success:null,
            error:null,
            maxFileSize:50*1024*1024
        };
        _options = _.extend(_options, options);
        if(_.platform.wechatOrDD ) {//支持微信端的选文件
            _.att.getFile4Html(options);
        }else  if(_.platform.CMPShell){
            cordova.exec(
                _options.success,
                _options.error,
                "CMPOfflineFilesPlugin",
                "getLocalOfflineFiles",
                [
                    {
                        maxFileSize:_options.maxFileSize
                    }
                ]
            );
        }else if(_.platform.third){
            _.event.trigger("cmpThirdPlatformPlugins",document,{data:_options,backupsFun:_.att.getFile4Html,plugin:"getFile"})
        }
    };

    _.att.getFile4Html = function(options){
        var _options = {
            success:null,
            error:null,
            maxFileSize:50*1024*1024
        };
        _options = _.extend(_options, options);
        var fileDom = document.createElement("input");
        fileDom.name = "file";
        fileDom.type = "file";
        fileDom.style.display = "none";
        document.body.appendChild(fileDom);
        fileDom.addEventListener("change",function(){
            this.remove();
            document.removeEventListener("visibilitychange",_checkFileControlUseState,false);
            var files = [];
            var errorMsg = "";
            for(var i = 0;i<this.files.length;i++){
                var file = this.files[i];
                var fileSize = file.size;
                var fileType = file.type.split("/")[1]||"";
                var filename = file.name;
                if(fileSize == 0){
                    errorMsg = errorMsg?",":"";
                    errorMsg+= _.i18n("cmp.att.errorMsgFileSizeEmpty",[filename]);
                }else if(fileSize > _options.maxFileSize){
                    errorMsg = errorMsg?",":"";
                    errorMsg+= _.i18n("cmp.att.errorMsgFileSizeOver",[filename]);
                }else {
                    files.push({
                        fileSize:fileSize,
                        filepath:filename,
                        type:fileType,
                        fileData:file
                    })
                }
            }
            if(errorMsg){
                _.notification.toast(errorMsg,"bottom",3000);
                if(typeof _options.error == "function"){
                    _options.error({
                        code:20015,
                        message:errorMsg
                    });
                }
            }
            if(files.length){
                if(typeof _options.success == "function"){
                    setTimeout(function(){
                        _options.success({files:files});
                    },300);
                }
            }
        });
        var _checkFileControlUseState = function(){//由于Android端不能选择Sd卡的文件，所以进行确认操作
            if(document.visibilityState == "visible"){
                _.storage.delete("cmpwechatdownloadfile",true);
                setTimeout(function(){
                    if(fileDom.files.length == 0){
                        fileDom.remove();
                        document.removeEventListener("visibilitychange",_checkFileControlUseState,false);
                        if(typeof _options.error == "function"){
                            _options.error({
                                code:21003,
                                message:_.i18n("cmp.att.errorMsgChooseFileFail")
                            });
                        }
                    }
                },300);
            }
        };
        if(_.os.android){
            // _.storage.save("cmpwechatdownloadfile","cmpwechatdownloadfile",true);//现在微信端又优化回来了，暂时注释掉这个防护CAPF-13849
            document.addEventListener("visibilitychange",_checkFileControlUseState,false);
        }
        fileDom.click();
    };
    _.att.openOfflineFilesModule = function(options){
        var _options = {
            name:options.name,
            success:null,
            error:null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPOfflineFilesPlugin",
            "openOfflineFilesModule",
            [
                {
                    name:_options.name
                }
            ]
        );
    };
    //============================================================离线文件 end======================================//


    //========================================================================office编辑 start========================//
    _.att.officeEdit = function(options){
        var filePath = options.path,
            fileName = options.filename,
            uploadPath = options.uploadPath,
            callback = options.callback;
        var localFilePath = filePath;
        if(_.storage.get("cmpFileName_" + filePath) != null && typeof _.storage.get("cmpFileName_" + filePath) != "undefined"){ //表明文件已经被下载到了本地
            localFilePath = _.storage.get("cmpFileName_" + filePath);
        }
        editFile(filePath,fileName,localFilePath,uploadPath,callback)
    };
    function editFile(filePath,fileName,localFilePath,uploadPath,callback){
        _.att.read({
            path:localFilePath, //先读本地文件（如果是第一次修改的话，也是远程的文件地址）
            filename:fileName,
            edit:true,
            success:function(readedFilePath){
                readedFilePath = "file://"+readedFilePath;
                if(_.os.android) {
                    if(!_.storage.get("cmpFileName_" + filePath)) {
                        _.storage.save("cmpFileName_" + filePath,readedFilePath);
                    }
                }
                var filePath = [{
                    filepath:readedFilePath,
                    fileId: _.buildUUID()
                }];
                _.dialog.loading();
                _.att.upload({
                    url:uploadPath,
                    fileList:filePath,
                    extData: {fileName: fileName},
                    success:function(saveResult) {
                        _.dialog.loading(false);
                        callback && callback(saveResult);//将上传后返回的信息回调（开发者重新关联文件）
                    },
                    error:function(saveError){
                        _.dialog.loading(false);
                        _.dialog.error(_.i18n("cmp.att.errorMsgSaveFileFailed"),null,_.i18n("cmp.att.fail"));
                    }
                })
            },
            error:function(readError){
                _.dialog.loading(false);
                if(_.storage.get("cmpFileName_" + filePath)) {  //可能是本地文件删除了
                    _.storage.delete("cmpFileName_" + filePath);
                    editFile(filePath,fileName,filePath,uploadPath,callback);//重新读远程的文件
                }else {
                    _.dialog.error(_.i18n("cmp.att.openFailed"),null,_.i18n("cmp.att.fail"));
                }
            }
        });
    }
    //========================================================================office编辑 end========================//

    //===============================================================v5文件组件下载和查看 start=================================//
    /**
     * 专门为V5封装的一套附件上传,下载,查看和关联文档的组件
     */

    /*默认附件模板，即调用cmp.att.init展示的样式*/
    var v5AttTpl = function() {
        var v5AttTpl= '<% var files = this.data,i = 0,len = files.length; %>' +
        '<% for(;i < len ;i++){ %>' +
        '<li class="cmp-list-cell v5file-read cmp-after-line" cmp-data=\'<%=cmp.toJSON(files[i]).escapeHTML() %>\'>' +
        '   <div class="cmp-list-accessory">' +
        '       <div class="cmp-list-cell-img  cmp-left">' +
        '           <div class="<%=cmp.att.iconCss(files[i].extension) %>"></div>' +
        '       </div>' +
        '       <div class="cmp-list-cell-info">' +
        '          <span class="cmp-ellipsis cmp-pull-left list_title_name"><%=files[i].filename.escapeHTML() %></span>' +
        '         <% if(files[i].type >= 0){ %>' +
        '          <h6 class="cmp-ellipsis list_cont_info"><%=cmp.att.countAttSize(files[i].size) %></h6>' +
        '         <% } %>' +
        '       </div>' +
        '    <% if(this.isShowDelete){ %>' +
        '    <div class="cmp-icon see-icon-close-round-fill v5file-delete delete"></div>' +
        '    <% } %>' +
        '      <div class="cmp-list-navigate">' +
        '        <% if(files[i].type != 2  && files[i].extension != ""  ){ %>' +
        '         <span class="cmp-icon see-icon-download  download"></span>' +
        '        <% } %>' +
        '     </div>' +

        '   </div>' +
        '</li>' +
        '<% } %>';
        return v5AttTpl;
    };
    /*默认文档模板，即调用cmp.att.init展示的样式*/
    var v5DocTpl = function() {
        var v5DocTpl =
        '<% var docs = this.data,i = 0,len = docs.length; %>' +
        '<% for(;i<len;i++){ %>' +
        '<% var docName=docs[i].subject?docs[i].subject:docs[i].filename; %>' +
        '  <li class="cmp-list-cell v5Doc-read " cmp-data=\'<%=cmp.toJSON(docs[i]).escapeHTML() %>\'>' +
        '<div class="cmp-list-accessory">' +
        '    <div class="cmp-list-cell-img  cmp-left item">' +
        '      <% if(docs[i].type && docs[i].type == "collaboration" || docs[i].type == "2"){ %>' +
        '        <% var type=docs[i].type == "collaboration"?"collaboration":docs[i].mimeType; %>' +
        '        <div class="cmp-icon-document <%=cmp.att.iconCss(type) %>"></div>' +
        '       <% }else{ %>' +
        '        <div class="<%=cmp.att.iconCss(cmp.att.getExtension4DocFile(docs[i])) %>"></div>' +
        '       <% } %>' +
        '     </div>' +
        '    <div class="cmp-list-cell-info item">' +
        '       <span class="cmp-ellipsis-2"><% if(docs[i].type == "collaboration" || docs[i].type == "2"){ %><%=docName.escapeHTML() %> <% }else{ %><%=docs[i].file_name.escapeHTML() %><% } %></span>' +
        '      <% if(!docs[i].type || docs[i].type != "2"){ %><small><%=cmp.att.countAttSize(docs[i].file_size) %></small><% } %>' +
        '   </div>' +
        '   <% if(this.isShowDelete){ %>' +
        '   <div class="cmp-fileupload-animation item">' +
        '       <span style="opacity: 1;" class="see-icon-close-round-fill v5file-delete delete"></span>' +
        '   </div>' +
        '<% } %>' +
        '</div>' +
        '</li>' +
        '<% } %>';
        return v5DocTpl;
    };
    /*调用新上传的附件模板，即调用cmp.att.initUpload展示的样式*/
    var v5FileItem = function() {
        var v5FileItem =
        '<% var files = this.data,i = 0,len = files.length; %>' +
        '<% for(;i < len ;i++){ %>' +
        '<% var filename = files[i].filename || cmp.att.filename(files[i].filepath),fileId = files[i].fileUrl || files[i].fileId,size=files[i].size||files[i].fileSize,isNew=files[i].new; %>' +
        '<li wrapper="<%=this.wrapperID %>" class="<%=fileId %> cmp-fileupload-item cmp-after-line" cmp-data=\'<%=cmp.toJSON(files[i]).escapeHTML() %>\'>' +
        ' <div class="cmp-fileupload-file-content"> ' +
        '<div class="cmp-fileupload-file item">' +
        '    <div class="<%=cmp.att.iconCss(filename) %>"></div>' +
        '  </div>' +
        '  <div class="cmp-fileupload-info item">' +
        '   <span><%=filename.escapeHTML() %></span>' +
        '   <small><%=cmp.att.countAttSize(size) %></small>' +
        '  </div>' +
        '  <div class="cmp-fileupload-animation item">' +
        '  <% if(isNew){ %>' +
        '     <span class="see-icon-close-round-fill delete"></span>' +
        '  <% }else{ %>' +
        '     <div class="circle progressPie">' +
        '       <div class="pie_left"><div class="left progressLeft"></div></div>' +
        '      <div class="pie_right"><div class="right progressRight"></div></div>' +
        '     <div class="mask"><span class="stop"></span></div>' +
        '    </div>' +
        '<% } %>' +
        '  </div></div>' +
        '</li>' +
        '<% } %>';
        return v5FileItem;
    };
    /*调用新上传的附件上传进度的模板，即调用cmp.att.initUpload展示的样式*/
    var v5ProgressPie =
        '     <div class="circle progressPie">' +
        '       <div class="pie_left"><div class="left progressLeft"></div></div>' +
        '      <div class="pie_right"><div class="right progressRight"></div></div>' +
        '     <div class="mask"><span class="stop"></span></div>' +
        '    </div>';
    /*调用新上传的文档模板，即调用cmp.att.initUpload展示的样式*/
    var v5DocItem = function() {
        var v5DocItem =
        '<% var docs = this.data,i = 0,len = docs.length; %>' +
        '<% for(;i<len;i++){ %>' +
        '  <% var docId = docs[i].docId || docs[i].id;var docName=docs[i].docName || docs[i].filename; %>' +
        '  <li wrapper="<%=this.wrapperID %>" class="<%=docId %> cmp-fileupload-item v5Doc-read cmp-after-line" cmp-data=\'<%=cmp.toJSON(docs[i]).escapeHTML() %>\'>' +
        '  <div class="cmp-fileupload-file-content"> ' +
        '    <div class="cmp-fileupload-file item">' +
        '       <% if(docs[i].type && (docs[i].type == "collaboration")){ %>' +
        '        <div class="cmp-icon-document synergy"></div>' +
        '       <% }else if(docs[i].type == "2"){ %>' +
        '           <% if(docs[i].mimeType && docs[i].mimeType=="edoc"){ %>' +
        '               <div class="cmp-icon-document flag"></div>' +
        '           <% }else { %>' +
        '               <div class="cmp-icon-document synergy"></div>' +
        '           <% } %>' +
        '       <% }else if(docs[i].type && docs[i].type == "edoc"){ %>' +
        '       <div class="cmp-icon-document flag"></div>' +
        '       <% }else{ %>' +
        '        <div class="<%=cmp.att.iconCss(cmp.v5.att_getExtension4DocFile(docs[i])) %>"></div>' +
        '       <% } %>' +
        '     </div>' +
        '    <div class="cmp-fileupload-info item">' +
        '       <span><%=docName.escapeHTML() %></span>' +
        '      <% if(!docs[i].type || docs[i].type != "2"){ %><small><%=cmp.att.countAttSize(docs[i].fr_size) %></small><% } %>' +
        '      <% if(docs[i].type && docs[i].type == "edoc"){ %><small><% if(docs[i].summary.docMark){ %><%=docs[i].summary.docMark %><% } %></small><% } %>' +
        '   </div>' +
        '   <div class="cmp-fileupload-animation item"><span class="see-icon-close-round-fill v5file-delete delete"></span></div>' +
        ' </div> </li>' +
        '<% } %>';
        return v5DocItem;
    };

    /**
     * V5附件类(直接渲染已经存在的附件)
     */

    function V5Att(selector, atts,docs, options) {
        var self = this;
        self.wrapper = typeof selector == "string" ? document.querySelector(selector) : selector;
        self.wrapper.classList.add("cmp-accessory-content");
        self.atts = atts;
        self.docs = docs;
        self.callback = options.callback;
        self.delCallback = options.delCallback;
        self.isShowDelete = options.isShowDelete;
        self.isDefault = options.isDefault;
        self.wrapperID = options.wrapperID;
        if(typeof cmpAttI18nLoaded == "undefined"){
            document.addEventListener("cmp-att-init",function(){
                self._initDom();
                self._bindEvent();
            });
        }else {
            self._initDom();
            self._bindEvent();
        }

    };
    V5Att.prototype._initDom = function () {
        var self = this;
        self.wrapper.innerHTML =  _.tpl(v5AttTpl(), {
            isShowDelete: self.isShowDelete,
            data: self.atts,
            wrapperID:self.wrapperID
        });
        var Items=self.wrapper.querySelectorAll('li');
        _.each(Items,function(i,Item){
            var type=JSON.parse(Item.getAttribute("cmp-data"));
            if(type.extension == ""){
                Item.classList.add("DocItem");
            }
        });

        if(self.docs && self.docs.length > 0){
            if(self.isDefault){

                _.append(self.wrapper, _.tpl(v5DocItem(),{
                    isShowDelete: self.isShowDelete,
                    data: self.docs,
                    wrapperID:self.wrapperID
                }));
            }else{
                _.append(self.wrapper,_.tpl(v5DocTpl(),{
                    isShowDelete: self.isShowDelete,
                    data: self.docs
                }));
            }
        }
    };

    V5Att.prototype._bindEvent = function () {
        var self = this;
        var v5FileReadItems = self.wrapper.querySelectorAll(".v5file-read");
        var v5DocReadItems = self.wrapper.querySelectorAll(".v5Doc-read");
        var i = 0,j= 0,len = v5FileReadItems.length,length = v5DocReadItems.length;
        for(;i<len;i++){
            (function(i){
                v5FileReadItems[i].addEventListener("tap",function(e){
                    var domView = this;
                    e.stopPropagation();
                    var fileData = domView.getAttribute("cmp-data");
                    fileData = _.parseJSON(fileData);

                    if (self.callback && parseInt(fileData["type"]) != 0) {//关联文档，使用自定义回调
                        if(_.platform.CMPShell){
                            self.callback(fileData);
                        }else {
                            _.notification.toast(_.i18n("cmp.att.cantViewByClient"), 'top', 1000);
                        }
                        return;
                    }
                    var extension = fileData.extension;
                    var id = fileData.fileUrl;
                    var lastModified = fileData.lastModified || fileData.createDate || fileData.createdate;
                    var filePath = _.origin + "/rest/attachment/file/"+ id;
                    var filename = fileData.filename;
                    var fileType = fileData.extension;
                    fileType = fileType.toLocaleLowerCase();
                    filePath = encodeURI(encodeURI(filePath));
                    if(_.platform.CMPShell){
                        var items = [];
                        if(hasOpenByThirdAppPlugin){
                            items.push({key:"thirdApp",name:_.i18n("cmp.att.openByThirdApp")});
                        }
                        items.push({key:"save",name:_.i18n("cmp.att.save")});

                        if(_.att.canSee(extension)){
                            items.unshift({
                                key:"see",
                                name:_.i18n("cmp.att.view")
                            });
                        }
                        _.dialog.actionSheet(items, _.i18n("cmp.att.cancel"), function (item) {
                            if(item.key == "see"){ //查看文件，查看本地的（不是查看服务器端的）
                                if(_.att.canPlay(fileData.extension) && !_.platform.wechatOrDD){ //amr是android  wav是ios格式
                                    _playFile(id,filePath,filename,lastModified);
                                }else {
                                    _readFile(id,filePath,filename,lastModified);
                                }

                            }else if(item.key == "save"){ //保存文件
                                _.notification.toast(_.i18n("cmp.att.downloadingFile"),"center",500);
                                //拼接下载地址
                                _.att.download({
                                    url: filePath,
                                    title: filename,
                                    extData: {
                                        lastModified:lastModified,
                                        fileId:id,
                                        origin:_.origin
                                    },
                                    progress: function (result) {
                                        _.dialog.loading(false);
                                    },
                                    success: function (result) {
                                        var resultMsg = 
                                            (fileType == "png" || fileType == "jpg" || fileType == "jpeg" || fileType == "bmp" || fileType == "gif" || fileType == "tif" || fileType == "tiff")?_.i18n("cmp.att.downloadSuccessImg"):_.i18n("cmp.att.downloadSuccessOfflineDoc");
                                        _.dialog.loading(false);
                                        _.notification.toast(resultMsg,"center",1000);
                                    },
                                    error: function (e) {
                                        console.log(e);
                                        _.dialog.loading(false);
                                        if(!_.errorHandler(e)){
                                            var msg = e.message;
                                            _.notification.alert(msg, null,_.i18n("cmp.att.tips"),_.i18n("cmp.att.ok"));
                                        }
                                    }
                                });
                            }else if(item.key == "thirdApp"){
                                _.dialog.loading();
                                _.att.openByThirdApp({
                                    path:filePath,
                                    filename:filename,
                                    extData: {
                                        lastModified:lastModified,
                                        fileId:id,
                                        origin:_.origin
                                    },
                                    success:function(){_.dialog.loading(false);},
                                    error:function(e){
                                        _.dialog.loading(false);
                                        if(!_.errorHandler(e)){
                                            var msg = e.message;
                                            _.notification.alert(msg, null,_.i18n("cmp.att.tips"),_.i18n("cmp.att.ok"));
                                        }
                                    }
                                })
                            }
                        }, function () {//点击取消
                        });
                    }else {
                        if(_.att.canDownload4Wechat(extension)){
                            _.att.download({
                                url: filePath,
                                title: filename,
                                extData: {
                                    lastModified:lastModified,
                                    fileId:id,
                                    origin:_.origin
                                }
                            });
                        }else {
                            _.notification.toast(_.i18n("cmp.att.cantViewByClient"), 'top', 1000);
                        }
                    }
                });
            })(i);
        }
        for(;j<length;j++){
            (function(j){
                v5DocReadItems[j].addEventListener("tap",function(e){
                    e.stopPropagation();
                    if(self.callback) {
                        var domView = this;
                        var docData = domView.getAttribute("cmp-data");
                        docData = _.parseJSON(docData);
                        self.callback(docData,domView);
                    }
                });
            })(j);
        }
        if (self.isShowDelete) {
            var v5FileDeleteItems = self.wrapper.querySelectorAll(".v5file-delete");
            var k = 0,leng = v5FileDeleteItems.length;
            for(;k<leng;k++){
                (function(k){
                    v5FileDeleteItems[k].addEventListener("tap",function(e){
                        e.stopPropagation();
                        var parentView = _.parents(this,"cmp-data")[0];
                        var fileData = parentView.getAttribute("cmp-data");
                        fileData = _.parseJSON(fileData);
                        if (parentView) {
                            parentView.parentNode.removeChild(parentView);
                            self.delCallback && self.delCallback(fileData);
                        }
                    });
                })(k)
            }
        }
    };
    function _playFile(id,filePath,fileName,lastModified){
        if(_.system.filePermission()){
            _.audio.checkPermission({//增加语音权限判断
                success:function(){
                    _.dialog.loading(_.i18n("cmp.att.downloadingFile"));
                    _.att.download({
                        url: filePath,
                        title: fileName,
                        isSaveToLocal:false,
                        extData: {
                            lastModified:lastModified,
                            fileId:id,
                            origin:_.origin
                        },
                        progress: function (result) {

                        },
                        success: function (result) {
                            var localPath =  result["target"];
                            localPath = "file://" + localPath;
                            _.dialog.loading(false);
                            _.audio.play({
                                filepath:localPath,
                                filename:fileName
                            });
                        },
                        error: function (e) {
                            _.dialog.loading(false);
                            if(!_.errorHandler(e)){
                                _.notification.alert(e.message,null);
                            }
                        }
                    });
                }
            });
        }else {
            _.notification.toast(_.i18n("cmp.att.cantViewByClient"), 'top', 1000);
        }
    };
    function _readFile(id,filePath,fileName,lastModified) {
        if(_.system.filePermission()){
            _.dialog.loading();
            _.att.read({
                path: filePath,
                filename: fileName,
                extData:{
                    fileId:id,
                    lastModified:lastModified,
                    origin: _.origin
                },
                success: function (result) {
                    _.dialog.loading(false);
                },
                error: function (e) {
                    _.dialog.loading(false);
                    if(!_.errorHandler(e)){
                        _.notification.alert(_.i18n("cmp.att.fileNonExist"),null,_.i18n("cmp.att.tips"),_.i18n("cmp.att.ok"));
                    }
                }
            });

        }else {
            _.notification.toast(_.i18n("cmp.att.cantViewByClient"), 'top', 1000);
        }

    };
    

    //att.suit处理超过大小的问题提示
    function _handleOffSizeFile(cantUploadFiles,maxFileSize,cancel){
        if(cantUploadFiles.length >0){
            var tipsMsg  = "";//todo 处理大于最大值的
            for(var i = 0;i<cantUploadFiles.length;i++){
                tipsMsg += _.att.filename(cantUploadFiles[i].filepath);
            }
            tipsMsg += _.i18n("cmp.att.fileOversize") + _.att.countAttSize(maxFileSize)+ _.i18n("cmp.att.cantUpload");
            _.notification.toast(tipsMsg,"top",3000);
            if(typeof cancel == "function"){
                cancel();
            }
        }

    }
    var imgFormat = ["jpg","jpeg","gif","png","bmp","img","image","tif","tiff"];
    var wpsSufixRegex = /(.wps)$/i;
    var etSufixRegex =/(.et)$/i;
    var downloadedImg = {};
    function downloadFile4Wechat(options){
        options.url = options.url || options.path;
        var filePath = convertFilePath4Wechat(options.url);
        var filename = options.title||options.filename;
        var fileType;
        if(filename){
            fileType = _.att.type(filename);
        }else {
            fileType = _.att.type(options.url);
        }
        if(imgFormat.indexOf(fileType.toLocaleLowerCase()) != -1){ //如果是图片格式的附件，使用H5的页面查看
            if(downloadedImg[options.url]){//如果有缓存，则使用缓存进行查看，避免重复下载
                viewDownloadImg4Wechat(options.url,downloadedImg[options.url]);
            }else {
                _.dialog.loading(_.i18n("cmp.att.downloadingFile"));
                var xhr = new XMLHttpRequest();
                xhr.open('GET', options.url, true);
                xhr.setRequestHeader("token",_.token);
                xhr.responseType = 'blob';
                xhr.onload = function() {
                    var blob = xhr.response;
                    viewDownloadImg4Wechat(options.url,blob);
                };
                xhr.onerror = function(){
                    console.log(xhr);
                    _.notification.alert(_.i18n("cmp.att.downloadFailed"),null,_.i18n("cmp.att.tips"),_.i18n("cmp.att.ok"));
                };
                xhr.onloadend = function(){
                    _.dialog.loading(false);
                };
                xhr.send();
            }
        }else {
            _.dialog.loading(false);
            if(filename && filename.lastIndexOf(".") != -1){
                filename = filename.replace(wpsSufixRegex,".doc");
                filename = filename.replace(etSufixRegex,".xls");
                filePath += "&fileName=" + encodeURIComponent(filename);
            }
            if(_.os.ios){//ios跳转行为有两种，（但是点击返回按钮时都是回退两次）
                _.event.trigger("beforepageredirect",document); 
            }
            if(_.platform.DDShell || (_.os.ios && _.platform.wechatOrDD)){//看来微信客户端已经修复了这个问题，目前就只对钉钉客户端做一个防护20.18-07-29/ios升级到11.4又要进行防护了，哎
                _.storage.save("cmpwechatdownloadfile","cmpwechatdownloadfile",true);//在sessionstorage里面存一个标示，用于兼容back的情况
            }

            window.location.href = filePath;//android系统直接本页面跳转
        }
        return true;
    }
    function uploadFileByAjax(_options){
        var errorFun = _options.error;
        if(!_options.url){
            errorFun({code:23001,message:_.i18n("cmp.att.errorMsgNoUploadAddress")});
            return;
        }
        if(!_options.fileList[0].fileData){
            errorFun({code:23003,message:_.i18n("cmp.att.errorMsgNoFileObj")});
            return;
        }
        var joint = _options.url.indexOf("?") == -1?"?":"&";
        for(var i = 0;i<_options.fileList.length;i++){
            (function(i){
                var uploadUrl = _options.url + joint + _options.imgIndex + "=" +i;
                var xhr = new window.XMLHttpRequest();
                var formData = new FormData();
                formData.append("file",_options.fileList[i].fileData);
                xhr.open("POST",uploadUrl,true);
                xhr.setRequestHeader("token",_.token);
                xhr.upload.addEventListener("progress",function(e){
                    var done = e.position || e.loaded,total = e.totalSize || e.total;
                    var progressVal = done/total;
                    if(progressVal < 1){
                        var result = {
                            pos:done/total,
                            fileId:_options.fileList[i].fileId
                        };
                        _options.progress(result);
                    }
                });
                xhr.addEventListener("load",function(){
                    //alert("上传成功");
                });
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        xhr.onreadystatechange = _.noop;
                        var result, response;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                            response = xhr.responseText;
                            result = {
                                pos:1,
                                fileId:_options.fileList[i].fileId,
                                response:response
                            };
                            _options.success(result);
                        }else{
                            errorFun({"response":xhr.statusText,message:_.i18n("cmp.att.uploadFailed"),fileId:_options.fileList[i].fileId});
                            xhr.abort();
                        }
                    }
                };
                xhr.send(formData);
            })(i);
        }
    }

    function convertFilePath4Wechat(filePath){
        filePath = filePath.indexOf('?')>-1 ? filePath + '&' :  filePath+ '?';
        filePath = filePath + 'token='+_.token;
        return filePath;

    }
    window.URL = window.URL || window.webkitURL;
    var imgContainerTemp = function() {
        var imgContainerTemp =
            '<div class="cmp-att-imgzoom-pack  cmp-hide cmp-att-div-hidden ">' +
            '   <div class="cmp-att-imgzoom-img">' +
            '   </div>' +
            '</div>';
        return imgContainerTemp;
    };
    function viewDownloadImg4Wechat(key,blob){
        _.after(document.body,imgContainerTemp());
        var imgContainer = document.querySelector(".cmp-att-imgzoom-pack");
        setTimeout(function(){
            imgContainer.style.visibility="visible";
        },310);
        var img = document.createElement("img");
        img.src = window.URL.createObjectURL(blob);
        img.onload = function() {
            window.URL.revokeObjectURL(this.src);
            downloadedImg[key] = blob;
            imgContainer.querySelector(".cmp-att-imgzoom-img").appendChild(img);
            setTimeout(function () {
                imgContainer.classList.remove("cmp-hide");
                imgContainer.classList.remove("cmp-att-div-hidden");
                imgContainer.classList.add("cmp-active");
                imgContainer.classList.add("cmp-att-div-show");
            }, 50);
            var imgH = this.offsetHeight;
            if(imgH < CMPFULLSREENHEIGHT){
                this.style.marginTop = "-" + (imgH / 2) + "px";
            }else {
                imgContainer.classList.add("cmp-long-img");
            }
            _.event.click(imgContainer,function(){
                removeImgContainer(imgContainer);
            });
            var zoomImg = new _zoomImg(imgContainer);
        };
        _.backbutton.push(function(){
            removeImgContainer(imgContainer);
        });
    }
    function removeImgContainer(imgContainer){
        _.backbutton.pop();
        imgContainer.classList.remove("cmp-active");
        imgContainer.classList.add("cmp-hide");
        imgContainer.classList.add("cmp-att-div-hidden");
        imgContainer.classList.remove("cmp-att-div-show");
        setTimeout(function(){
            imgContainer.remove();
        },300);
    }
    function _zoomImg(imgContainer){
        var self= this;
        self.img = imgContainer.querySelector(".cmp-att-imgzoom-pack img");
        var zoomContainer = imgContainer.querySelector(".cmp-att-imgzoom-pack .cmp-att-imgzoom-img");
        var imgWidth = self.img.offsetWidth,imgContainerWidth = imgContainer.offsetWidth;
        if(imgWidth <= imgContainerWidth){
            self.img.style.width = imgContainerWidth + "px";
        }
        self.imgBaseWidth = self.img.offsetWidth;
        self.imgBaseHeight = self.img.offsetHeight;
        //config set
        self.buffMove   = 3; //缓冲系数
        self.buffScale  = 2; //放大系数
        self.finger = false; //触摸手指的状态 false：单手指 true：多手指
        self.wrapX = (imgWidth < imgContainerWidth)?imgWidth: imgContainerWidth; 	//可视区域宽度
        self.wrapY = imgContainer.offsetHeight; 	//可视区域高度
        self.mapX  = self.img.width; 	    //地图宽度
        self.mapY  = self.img.height;      //地图高度
        //初始值设置 start
        self.distX = 0;
        self.distY = 0;
        self.newX  = 0;
        self.newY  = 0;
        //初始值设置 end

        self.outDistY = (self.mapY - self.wrapY)/2; //图片超过一屏的时候有用

        self.width  = self.mapX - self.wrapX;   //地图的宽度减去可视区域的宽度
        self.height = self.mapY - self.wrapY;   //地图的高度减去可视区域的高度

        
        zoomContainer.addEventListener("touchstart",function(e){
            self._touchstart(e);
        },false);
        zoomContainer.addEventListener("touchmove",function(e){
            self._touchmove(e);
        },false);
        zoomContainer.addEventListener("touchend",function(e){
            self._touchend(e);
        },false);
    }

    _zoomImg.prototype = {
        _changeData: function(){
            var self = this;
            self.mapX     = self.img.offsetWidth; 	  //地图宽度
            self.mapY     = self.img.offsetHeight;      //地图高度
            // this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
            self.width    = self.mapX - self.wrapX;   //地图的宽度减去可视区域的宽度
            self.height   = self.mapY - self.wrapY;   //地图的高度减去可视区域的高度
        },
        _touchstart: function(e){
            var self = this;

            e.preventDefault();

            var touchTarget = e.targetTouches.length; //获得触控点数

            self._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算

            if(touchTarget == 1){
                // 获取开始坐标
                self.basePageX = self._getPage(e, "pageX");
                self.basePageY = self._getPage(e, "pageY");

                self.finger = false;
            }else{
                self.finger = true;

                self.startFingerDist = self._getTouchDist(e).dist;
                self.startFingerX    = self._getTouchDist(e).x;
                self.startFingerY    = self._getTouchDist(e).y;
            }
        },
        _touchmove: function(e){
            var self = this;
            e.preventDefault();
            e.stopPropagation();

            var touchTarget = e.targetTouches.length; //获得触控点数

            if(touchTarget == 1 && !self.finger){
                self._move(e);
            }

            if(touchTarget>=2){
                self._zoom(e);
            }
        },
        _touchend: function(e){
            var self = this;
            self._changeData(); //重新计算数据
            if(self.finger){
                self.distX = -self.imgNewX;
                self.distY = -self.imgNewY;
            }

            if( self.distX>0 ){
                self.newX = 0;
                self._reset();

            }else if( self.distX<=0 && self.distX>=-self.width ){
                self.newX = self.distX;
                self.newY = self.distY;
                self.offsetXRecode = 0;
                self._reset();
            }else if( self.distX<-self.width ){
                self.newX = -self.width;
                self._reset();
            }
        },
        _move: function(e){
            var self = this,
                pageX = self._getPage(e, "pageX"), //获取移动坐标
                pageY = self._getPage(e, "pageY");

            // 禁止默认事件
            // e.preventDefault();
            // e.stopPropagation();

            // 获得移动距离
            self.distX = (pageX - self.basePageX) + self.newX;
            self.distY = (pageY - self.basePageY) + self.newY;

            if(self.distX > 0){
                self.moveX = Math.round(self.distX/self.buffMove);
            }else if( self.distX<=0 && self.distX>=-self.width ){
                self.moveX = self.distX;
            }else if(self.distX < -self.width ){
                self.moveX = -self.width+Math.round((self.distX+self.width)/self.buffMove);
            }
            self._movePos();
            self.finger = false;
        },
// 图片缩放
        _zoom: function(e,r){
            var self = this;
            var nowFingerDist = self._getTouchDist(e).dist, //获得当前长度
                ratio 		  = r?r:nowFingerDist / self.startFingerDist, //计算缩放比
                imgWidth  	  = Math.round(self.mapX * ratio), //计算图片宽度
                imgHeight 	  = Math.round(self.mapY * ratio); //计算图片高度

            // 计算图片新的坐标
            self.imgNewX = Math.round(self.startFingerX * ratio - self.startFingerX - self.newX * ratio);
            self.imgNewY = Math.round((self.startFingerY * ratio - self.startFingerY)/2 - self.newY * ratio);
            if(imgWidth >=self.imgBaseWidth){
                self.img.style.width = imgWidth + "px";
                self._refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
                self.finger = true;
            }else{
                if(imgWidth < self.imgBaseWidth){
//                    self.container.remove();
                }
            }
            self.finger = true;
        },
// 移动坐标
        _movePos: function(){
            var self = this;

            if(self.height<0){
                if(self.img.offsetWidth == self.imgBaseWidth){
                    self.moveY = Math.round(self.distY/self.buffMove);
                }else{
                    var moveTop = Math.round((self.img.offsetHeight-self.imgBaseHeight)/2);
                    self.moveY = -moveTop + Math.round((self.distY + moveTop)/self.buffMove);
                }
            }else{
                var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
                    b = self.img.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;

                if(self.distY >= -a){
                    self.moveY = Math.round((self.distY + a)/self.buffMove) - a;
                }else if(self.distY <= -b){
                    self.moveY = Math.round((self.distY + b)/self.buffMove) - b;
                }else{
                    self.moveY = self.distY;
                }
            }
            self._refresh(self.moveX, self.moveY, "0s", "ease");
        },
// 重置数据
        _reset: function(){
            var self = this,
                hideTime = ".2s";
            if(self.height<0){
                self.newY = -Math.round(self.img.offsetHeight - self.imgBaseHeight)/2;
            }else{
                var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
                    b = self.img.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;

                if(self.distY >= -a){
                    self.newY = -a;
                }else if(self.distY <= -b){
                    self.newY = -b;
                }else{
                    self.newY = self.distY;
                }
            }
            self._refresh(self.newX, self.newY, hideTime, "ease-in-out");
        },
// 执行图片移动
        _refresh: function(x, y, timer, type){
            var self = this;
            self.img.style.webkitTransitionProperty = "-webkit-transform";
            self.img.style.webkitTransitionDuration = timer;
            self.img.style.webkitTransitionTimingFunction = type;
            self.img.style.webkitTransform = self._getTranslate(x, y);
        },
// 获取多点触控
        _getTouchDist: function(e){
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0,
                x3 = 0,
                y3 = 0,
                result = {};

            x1 = e.touches[0].pageX;
            x2 = e.touches[1].pageX;
            y1 = e.touches[0].pageY - document.body.scrollTop;
            y2 = e.touches[1].pageY - document.body.scrollTop;

            if(!x1 || !x2) return;

            if(x1<=x2){
                x3 = (x2-x1)/2+x1;
            }else{
                x3 = (x1-x2)/2+x2;
            }
            if(y1<=y2){
                y3 = (y2-y1)/2+y1;
            }else{
                y3 = (y1-y2)/2+y2;
            }

            result = {
                dist: Math.round(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))),
                x: Math.round(x3),
                y: Math.round(y3)
            };
            return result;
        },
        _eventStop: function(e){
            e.preventDefault();
            e.stopPropagation();
        },
        _getTranslate:function(x,y){
            var distX = x, distY = y;
            return ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()) ? "translate3d("+ distX +"px, "+ distY +"px, 0)" : "translate("+ distX +"px, "+ distY +"px)";
        },
        _getPage:function(event, page){
            return ("ontouchstart" in window) ? event.changedTouches[0][page] : event[page];
        }
    };

    _.att.init = function (selector, atts,docs, options) {
        var _options = {
            callback: _.att.readCallback,
            delCallback: _.att.delCallback,
            isShowDelete: false,
            isDefault:false,
            warpperID:null
        };


        _options = _.extend(_options, options);

        return new V5Att(selector, atts,docs, _options);
    };
    //===============================================================v5文件组件下载和查看 end=================================//

    //=============================================================v5附件套件（适用于协同和表单）=================================================//
    var attSuiteType = {
        photo:"photo",
        picture:"picture",
        accDoc:"accDoc",
        voice:"voice",
        localFile:"localFile"
    };
    var AttType = {
        pic: 0,//图片
        localFile: 1,//本地离线文件
        voice: 2,//录音文件
        accessoryDoc: 3 //关联文档
    };
    var sourceType = {
        local:"localSource", //资源是本地资源，如相机、录音是手机生产的资源
        remote:"remoteSource"//资源是远程资源，如关联文档中的协同和文档中心是远程服务器资源
    };
    function AttUploadResponse(type, data,success,error,extData) {
        this.type = type;
        this.data = data;
        this.success = success;
        this.error = error;
        this.extData = extData;
    }
    var docDataCache = [];//关联文档缓存
    /**
     * 附件组件套件（不涉及到ue）
     */
    _.att.suite = function(options){
        var _options = _.extend({
            type:"",
            pictureNum:1,
            initDocData:null,
            maxFileSize:50*1024*1024,//可以上传的附件的最大大小,默认50M
            success:null,
            error:null,
            cancel:null,//相册，离线文件选择的取消回调
            extData:{}//上传时的额外参数，依赖调用者进行key  value的传值（组件不必关心是什么值）
        },options);
        _.dialog.loading(false);//由于微协同上传附件，取消事件监听不了，这里做一个去掉dialog的操作，当上传时再有dialog
        switch (_options.type){
            case attSuiteType.photo:
                _.camera.getPictures({
                    allowEdit: false,
                    sourceType: _.camera.PictureSourceType.CAMERA,
                    destinationType: _.camera.DestinationType.FILE_URI,
                    success: function (result) {
                        var imgData = result.files;
                        var imgs = [];
                        var cantUploadFiles = [];
                        for(var i = 0;i<imgData.length;i++){
                            if(imgData[i].fileSize > _options.maxFileSize){
                                cantUploadFiles.push(imgData[i]);
                                continue;
                            }
                            var imgFile = {
                                filepath:imgData[i].filepath,
                                fileId: _.buildUUID(),
                                fileData:imgData[i].fileData
                            };
                            imgs.push(imgFile);
                        }
                        if(imgs.length > 0){
                            _uploadAtt4v5(new AttUploadResponse(0, imgs,_options.success,_options.error,_options.extData));
                        }
                        _handleOffSizeFile(cantUploadFiles,_options.maxFileSize,_options.cancel);
                    }, error: function (e) {
                        switch(e.code){
                            case 56004://取消选择
                                if(typeof _options.cancel == "function"){
                                    _options.cancel(e);
                                }
                                break;
                            case 56005://拍照超过了大小
                                if(typeof _options.cancel == "function"){
                                    _options.cancel();
                                }
                                break;
                            default :
                                if(typeof _options.error == "function"){
                                    _options.error(e);
                                }
                                break;
                        }
                    }
                });
                break;
            case attSuiteType.picture:
                _.camera.getPictures({
                    allowEdit: false,
                    sourceType: cmp.camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: cmp.camera.DestinationType.FILE_URI,
                    quality:AttUploadConstant.C_iPic_quality,
                    pictureNum:_options.pictureNum,//表单选图片，只能单选
                    maxFileSize:_options.maxFileSize,
                    success: function (result) {
                        var imgData = result.files;
                        var imgs = [];
                        var cantUploadFiles = [];
                        for(var i = 0;i<imgData.length;i++){
                            if(imgData[i].fileSize > _options.maxFileSize){
                                cantUploadFiles.push(imgData[i]);
                                continue;
                            }
                            var imgFile = {
                                filepath:imgData[i].filepath,
                                fileId: _.buildUUID(),
                                fileData:imgData[i].fileData
                            };
                            imgs.push(imgFile);
                        }
                        if(imgs.length > 0){
                            _uploadAtt4v5(new AttUploadResponse(0, imgs,_options.success,_options.error,_options.extData));
                        }
                        _handleOffSizeFile(cantUploadFiles,_options.maxFileSize,_options.cancel);
                    }, error: function (e) {
                        switch(e.code){
                            case 56004://取消选择
                                if(typeof _options.cancel == "function"){
                                    _options.cancel(e);
                                }
                                break;
                            default :
                                if(typeof _options.error == "function"){
                                    _options.error(e);
                                }
                                break;
                        }
                    }
                });
                break;
            case attSuiteType.accDoc:
                if(_options.initDocData && docDataCache.length == 0){
                    docDataCache = _options.initDocData;
                }
                _.accDoc({
                    fillbackData:docDataCache,
                    callback:function(result){
                        result = _.parseJSON(result);
                        var docArr = [];
                        for(var i = 0;i<result.length;i++){
                            docArr.push(_.parseJSON(result[i]));
                        }
                        docDataCache = docArr;//又将选择好的关联文档数据作为回填值进行设置
                        var attResult = {sourceType:sourceType.remote};//远程资源
                        attResult["att"] = docArr;
                        if(_options.success && typeof _options.success == "function"){
                            _options.success(attResult);
                        }
                    }
                });
                break;
            case attSuiteType.voice:
                _.dialog.loading(false);
                _.audio.checkPermission({ //增加语音权限的判断
                    success:function(){
                        _.audio.init({
                            callback: function (src) { //统一格式都是相机返回的数据格式
                                var sound = [];
                                var soundFile = {
                                    filepath:src,
                                    fileId: _.buildUUID()
                                };
                                sound.push(soundFile);
                                _.dialog.loading();
                                _.att.getFileInfo({
                                    filepath:[src],
                                    success:function(result){
                                        var fileSize = result[0].fileSize;
                                        if(fileSize > _options.maxFileSize){//录音文件超了，在此处理
                                            _.notification.toast(_.i18n("cmp.att.fileOversize")+ _.att.countAttSize(_options.maxFileSize)+_.i18n("cmp.att.cantUpload"),"top",3000);
                                            if(typeof _options.cancel == "function"){
                                                _options.cancel();
                                            }
                                            return;
                                        }
                                        _uploadAtt4v5(new AttUploadResponse(2, sound,_options.success,_options.error,_options.extData));
                                    },
                                    error:function(){
                                        _uploadAtt4v5(new AttUploadResponse(2, sound,_options.success,_options.error,_options.extData));
                                    }
                                });
                            },
                            cancelCallback: function () {
                                if(typeof _options.cancel == "function"){
                                    _options.cancel();
                                }
                            },
                            text: {
                                use: _.i18n("cmp.att.use")
                            }
                        });
                    }
                });

                break;
            case attSuiteType.localFile:
                _.att.getOfflineFiles({
                    maxFileSize:_options.maxFileSize,
                    success: function (result) {
                        var files = result.files;
                        var offlineFiles = [];
                        var cantUploadFiles = [];
                        for(var i = 0;i<files.length;i++){
                            if(files[i].fileSize > _options.maxFileSize){
                                cantUploadFiles.push(files[i]);
                                continue;
                            }
                            var offlineFile = {
                                filepath:files[i].filepath,
                                fileId: _.buildUUID(),
                                fileData:files[i].fileData
                            };
                            offlineFiles.push(offlineFile);
                        }
                        if(offlineFiles.length > 0){
                            _uploadAtt4v5(new AttUploadResponse(1, offlineFiles,_options.success,_options.error,_options.extData));
                        }
                        _handleOffSizeFile(cantUploadFiles,_options.maxFileSize,_options.cancel);
                    }, error: function (e) {
                        if(e.code == 21002){
                            if(typeof _options.cancel == "function"){
                                _options.cancel(e);
                            }
                        }else {
                            if(typeof _options.error == "function"){
                                _options.error(e);
                            }
                        }
                    }
                });
                break;
        }
    };
    var _uploadAtt4v5 = function (obj) {
        var filePath = "";
        switch (obj.type) {
            case AttType.pic:
            case AttType.voice:
            case AttType.localFile:
                filePath = obj.data;
                break;
            case AttType.accessoryDoc:
                break;
            default :
                break;
        }
        //filePath   新改后传的全是数组-----2016-07-23
        // _.notification.toast(_.i18n("cmp.att.uploadingFile"),"top",500);
        var queryParam = _.token == ""?("?token=" + _.token + "&option.n_a_s=1"):"?option.n_a_s=1";
        if(obj.extData && !_.isEmptyObject(obj.extData)){
            for(var key in obj.extData){
                queryParam += "&"+ key + "=" + obj.extData[key];
            }
        }
        _.dialog.loading(_.i18n("cmp.att.uploadingFile"));
        _.att.upload({
            url: _.origin + "/rest/attachment"+queryParam,
            fileList: filePath,
            progress: function (result) {
            },
            success: function (result) {
                _.dialog.loading(false);
                _.notification.toast(_.i18n("cmp.att.uploadSuccess"),"top",1000);
                var fileId = result.fileId;
                var response = _.parseJSON(result.response);
                var _att = response["atts"];
                var attResult = {sourceType:sourceType.local};//本地资源
                var i = 0,len = filePath.length;
                for(;i<len;i++){
                    if(filePath[i].fileId == fileId){
                        attResult["localSource"]  = filePath[i].filepath;
                    }
                }
                attResult["att"] = _att;
                if(obj.success && typeof obj.success == "function"){
                    obj.success(attResult);
                }
            }, error: function (error) {
                _.dialog.loading(false);
                _.notification.toast(_.i18n("cmp.att.uploadFailed"),"top",500);
                if(!_.errorHandler(error)){
                    if(obj.error && typeof obj.error == "function"){
                        obj.error(error);
                    }
                }
            }
        });
    };
    //=============================================================v5附件套件（适用于协同和表单）end=================================================//



    //==============================================================v5附件组合 start===================================//
    var v5AttInitUploadCache = {};//组件缓存
    var allChoosedData = new _.map();
    var docDataCacheMap = new _.map();
    _.att.initUpload = function (selector, options) {
        var regExp = /\#|\./;
        var cacheId =  selector.replace(regExp,"");
        if(!v5AttInitUploadCache[cacheId]){
            v5AttInitUploadCache[cacheId] = new AttUpload(selector, options);
            return v5AttInitUploadCache[cacheId];
        }else {
            if(allChoosedData.values().length > 0){
                if(!v5AttInitUploadCache[cacheId].options.fileWrapper){
                    v5AttInitUploadCache[cacheId]._v5FilePageAnimation(true);
                }else {
                    v5AttInitUploadCache[cacheId]._noToggle();
                }
            }else {
                v5AttInitUploadCache[cacheId]._noToggle();
            }

        }

    };
    /**
     * 关闭v5附件【继续上传】页面的方法
     */
    _.att.initUpload_filePage_close = function(){
       var v5FilePage = document.querySelector(".cmp-v5-file-pageShow");
        if(v5FilePage){
            var uid = v5FilePage.getAttribute("uid");
            if(v5AttInitUploadCache[uid]){
                v5AttInitUploadCache[uid]._v5FilePageAnimation();
            }
        }
    };
    _.att.initUpload_wrapperPage_close = function(){
        var v5FileWrapperPage = document.querySelector(".cmp-v5-file-wrapper-show");
        if(v5FileWrapperPage){
            var uid = v5FileWrapperPage.getAttribute("uid");
            if(v5AttInitUploadCache[uid]){
                v5AttInitUploadCache[uid]._toggle();
            }
        }
    };
    var AttUploadConstant = {
        C_iPic_quality:60,//默认选择图片的压缩率为60%
        C_iShow_auth_att:1,//显示权限-------只显示附件类的按钮 （其余情况，两种同时显示）
        C_iShow_auth_acc:2,//显示权限-------只显示关联文档的按钮
        C_iShow_auth_createFolder:3,//显示权限-------只显示新建文件夹按钮
        C_iShow_auth_createFolder_att:4//显示权限------显示新建文件夹按钮+拍照+本地图片+本地文件按钮
    };
    var v5FileBackdrop = function(){ return  '<div class="cmp-backdrop cmp-backdrop-action cmp-active" style=""></div>';};
    var v5FileGroupTpl = function() {
        var v5FileGroupTpl =
        ' <div class="cmp-accessory-file"><ul class="overflow_hidden">' +
        '	<li id="photoDiv" class="item" <% if(this.showAuth == "' + AttUploadConstant.C_iShow_auth_acc + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder + '"){ %> style="display:none;" <% } %>>' +
        '		<div class="box">' +
        '			<span class="see-icon-camera-fill"></span>' +
        '		</div>' +
        '           <p>' + _.i18n("cmp.att.photo") + '</p>' +
        '	</li>' +
        '	<li id="soundRecordDiv" class="item" <% if(!cmp.platform.CMPShell || cmp.platform.M3W ||this.showAuth == "' + AttUploadConstant.C_iShow_auth_acc + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder_att + '"){ %> style="display:none;" <% } %>>' +
        '		<div id="soundRecordDiv" class="box">' +
        '			<span class="see-icon-record-fill"></span>' +
        '		</div>' +
        '			<p>' + _.i18n("cmp.att.voice") + '</p>' +
        '	</li>' +
        '	<li id="relateDocDiv" class="item" <% if(this.showAuth == "' + AttUploadConstant.C_iShow_auth_att + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder_att + '"){ %> style="display:none;" <% } %>>' +
        '		<div class="box">' +
        '			<span class="see-icon-doc-relation"></span>' +
        '		</div>' +
        '			<p>' + _.i18n("cmp.att.relation") + '</p>' +
        '	</li>' +
        '	<li id="localFileDiv" class="item" <% if(this.showAuth == "' + AttUploadConstant.C_iShow_auth_acc + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder + '"){ %> style="display:none;" <% } %>>' +
        '		<div class="box">' +
        '			<span class="see-icon-folder-open-fill"></span>' +
        '		</div>' +
        '			<p>' + _.i18n("cmp.att.localFile") + '</p>' +
        '	</li>' +
        '	<li id="localImgDiv" class="item" <% if(this.showAuth == "' + AttUploadConstant.C_iShow_auth_acc + '"|| this.showAuth == "' + AttUploadConstant.C_iShow_auth_createFolder + '"){ %> style="display:none;" <% } %>>' +
        '		<div class="box">' +
        '			<span class="see-icon-picture"></span>' +
        '		</div>' +
        '			<p>' + _.i18n("cmp.att.picture") + '</p>' +
        '	</li>' +
        '	<li id="createFolder" class="item" <% if(this.showAuth != "' + AttUploadConstant.C_iShow_auth_createFolder + '"&& this.showAuth != "' + AttUploadConstant.C_iShow_auth_createFolder_att + '"){ %> style="display:none;" <% } %>>' +
        '		<div class="box">' +
        '			<span class="see-icon-v5-common-newfolder"></span>' +
        '		</div>' +
        '			<p>' + _.i18n("cmp.att.createFolder") + '</p>' +
        '	</li>' +
        '</ul>' +
        '<div class="cmp-accessory-btn" id="cancelBtn">' + _.i18n("cmp.att.cancel") + '</div>' +
        '</div>';
        return v5FileGroupTpl;
    };

    var v5FileUploadPage = function() {
        var v5FileUploadPage =
        '<div id="v5FileContainer" class=" position_relative background_fff" style="overflow: auto;">' +
        '    <ul id="v5FileList" class="cmp-fileupload-animate-content cmp-accessory-content"></ul>' +
        '</div>' +
        '<footer class="cmp-bar cmp-bar-footer cmp-att-footer cmp-att-footer_replay <% if(!this.continue){ %>cmp-hidden<% } %>">' +
        '    <button id="v5UploadBtn" type="button" class="cmp-btn cmp-btn-primary cmp-btn-block display_inline-block ">' + _.i18n("cmp.att.continue") + '</button>' +
        '</footer>';
        return v5FileUploadPage;
    };




    function AttUpload(selector, options) {
        var self = this;
        self.options = _.extend({
            showAuth:-1, //显示权限，1，只显示附件按钮，2，只显示关联文档按钮，3,只显示新建文件夹按钮，4，显示新建文件夹按钮+拍照+本地文件+本地图片，其余数字两种按钮一起显示（但是不显示新建文件夹按钮）
            initDocData:null,//默认存在的关联文档数据
            initAttData:null,//默认存在的附件数据
            fileWrapper:null,//将附件渲染到开发者指定的位置，如果为null则组件自己渲染(如协同处理页面，需要开发者自定义渲染位置)
            callback:null,//回调函数，将选择好的附件和关联文档返回给开发者
            delCallback:null,//如果开发者设置了fileWrapper即自定义渲染位置，需要传删除的回调函数，告诉开发者删除的是哪个文件
            clearCache:false,//当选中或上传的数据返回给开发者的时候，是否清空已选缓存数据
            docPenetrateCallback:null,//关联文档的穿透查看
            createFolderCallback:null,//创建文件夹的回调调用开发者提供的接口
            closeCallback:null,//关闭【继续上传】页面回调
            continueUpload:true,//根据业务需要是否显示继续上传附件
            pageKey:null//页面跳转开发者自定义取数据的key
        },options);
        if(self.options.showAuth != 3 && self.options.showAuth != 4){  //由于协同那是有选关联文档的权限的，所以1,2权限都进行页面跳转
            if(!self.options._transed){
                self._doJumpPage();
                return;
            }
        }
        self.wrapper = document.querySelector(selector);
        var regExp = /\#|\./;
        self.wrapperID = selector.replace(regExp,"");
        self.wrapper.className = "cmp-popover cmp-popover-action cmp-popover-bottom cmp-v5-file-wrapper-show";
        self.wrapper.setAttribute("uid",self.wrapperID);
        self.callback = options.callback;
        self.delCallback = options.delCallback;
        self.docs = options.initDocData||null;  //关联文档的数据要单独处理
        self.atts = options.initAttData || null;
        self.newAttsData = options.newAttsData || null;//穿透回来后的之前已选数据
        self.newDocsData = options.newDocsData || null;
        self.enableCloseCount = 0;//用于控制上传附件的时候，还在上传的时候是不能回退的,防护多次上传时
        self.oherTitle = document.title;
        self._handleInitData();
        if(typeof cmpAttI18nLoaded == "undefined"){
            document.addEventListener("cmp-att-init",function(){
                self._initDom(options);
                self._bindEvent();
            });
        }else {
            self._initDom(options);
            self._bindEvent();
        }

    };
    AttUpload.prototype._doJumpPage = function(){
        var self = this;
        var currentSearch = window.location.search;
        if(currentSearch != "" && currentSearch.length >0){
            if(currentSearch.indexOf("?") != -1){
                currentSearch= currentSearch.replace("?","");
            }
            if(currentSearch.indexOf("pageKey") != -1){
                var searchArr=[];
                if(currentSearch.indexOf("&") != -1){
                    searchArr = currentSearch.split("&");
                }
                if(searchArr.length >0) {
                    for(var i = 0;i<searchArr.length;i++){
                        if(searchArr[i].indexOf("pageKey") != -1){
                            var pageKeyVal = searchArr[i].split("=")[1];
                            if(pageKeyVal != self.options.pageKey){
                                _.storage.delete("cmp-v5-att-jump-pageKey",true);
                            }
                            break;
                        }
                    }
                }else {
                    var pageKeyVal = currentSearch.split("=")[1];
                    if(pageKeyVal != self.options.pageKey){
                        _.storage.delete("cmp-v5-att-jump-pageKey",true);
                    }
                }
            }

        }else {
            var historyPageKey = _.storage.get("cmp-v5-att-jump-pageKey",true);
            if(historyPageKey){
                _.storage.delete("cmp-v5-att-jump-pageKey",true);
            }
        }
        _.storage.save("cmp-v5-att-initUpload-options", _.toJSON(self.options),true);
        var jumpPageUrl = cmpBASEPATH + "/page/cmp-v5-file-doc-penetrate-page.html";
        _.event.trigger("beforepageredirect",document);
        _.href.next(jumpPageUrl);
    };
    AttUpload.prototype._handleInitData = function(){
       var self = this;
        var renderNewDocsData = new _.map();
        if(self.options._selectedDocAction){//如果是关联文档组件选择了关联文档，需要处理重复值和初始值被删除的情况
            self._handleInitDocData4SelectedAction();
        }

        if(self.docs && self.docs.length > 0) {
            var i = 0,len = self.docs.length;
            for(;i<len;i++){
                var data = self.docs[i];
                if(data.type == "2"){  //必须是服务器端传的数据格式才设置old值
                    self.docs[i].old = true;
                }
                var key = self._getFileDataId(data);
                allChoosedData.put(key,data);
                docDataCacheMap.put(key,data);
            }
        }
        if(self.atts && self.atts.length > 0) {
            var i = 0,len = self.atts.length;
            for(;i<len;i++){
                self.atts[i].old = true;
                var key = self._getFileDataId(self.atts[i]);
                allChoosedData.put(key,self.atts[i]);
            }
        }
        if(self.newAttsData && self.newAttsData.length >0){
            var i = 0,len = self.newAttsData.length;
            for(;i<len;i++){
                var data = self.newAttsData[i];
                var key = self._getFileDataId(data);
                allChoosedData.put(key,data);
            }
        }
        if(self.newDocsData && self.newDocsData.length > 0) {
            var i = 0,len = self.newDocsData.length;
            for(;i<len;i++){
                var data = self.newDocsData[i];
                var key = self._getFileDataId(data);
                data.docId = key;
                data.docName = data.subject||data.filename || data.fr_name||data.summary.subject;
                if(!docDataCacheMap.containsKey(key)){
                    renderNewDocsData.put(key,data);
                }
                allChoosedData.put(key,data);
                docDataCacheMap.put(key,data);
            }
            self.newDocsData = renderNewDocsData.values();
        }
        if(self.docs && self.docs.length > 0){
            var i = 0,len = self.docs.length;
            var renderInitDocsData = [];
            for(;i<len;i++){
                var data = self.docs[i];
                var key = self._getFileDataId(data);
                if(!renderNewDocsData.containsKey(key)){
                    renderInitDocsData.push(data);
                }
            }
            self.docs = renderInitDocsData;
        }
    };
    //处理有默认关联文档数据时，通过关联文档组件删除的初始关联文档数据的处理
    AttUpload.prototype._handleInitDocData4SelectedAction = function(){
        var self = this;
        if(self.newDocsData.length == 0){
            self.docs = null;
        }else {
            if(self.docs && self.docs.length > 0) {
                var newDocDataMap = new _.map();
                for(var i = 0;i<self.newDocsData.length;i++){
                    var key = self._getFileDataId(self.newDocsData[i]);
                    newDocDataMap.put(key,self.newDocsData[i]);
                }
                var renderDocData = [],i = 0,len = self.docs.length;
                for(;i<len;i++){
                    var key = self._getFileDataId(self.docs[i]);
                    if(newDocDataMap.containsKey(key)){
                        renderDocData.push(self.docs[i]);
                    }
                }
                self.docs = renderDocData;
            }

        }
    };
    AttUpload.prototype._initDom = function (options) {
        var self = this;
        var popoverContainer = document.createElement("div");
        popoverContainer.classList.add("cmp-popover-container");
        popoverContainer.innerHTML = _.tpl(v5FileGroupTpl(), {path: cmpJSPATH,showAuth:options.showAuth});
        self.wrapper.appendChild(popoverContainer);
        self.v5FilePage = null;
        var noToggle = true;
        self.photoBtn = self.wrapper.querySelector("#photoDiv");
        self.soundRecordBtn = self.wrapper.querySelector("#soundRecordDiv");
        self.relateDocBtn = self.wrapper.querySelector("#relateDocDiv");
        self.localFileBtn = self.wrapper.querySelector("#localFileDiv");
        self.localImgBtn = self.wrapper.querySelector("#localImgDiv");
        self.createFolderBtn = self.wrapper.querySelector("#createFolder");
        self.cancelBtn = self.wrapper.querySelector("#cancelBtn");

        if(!self.options.fileWrapper){
            //默认有附件的情况渲染在附件列表上
            if((self.docs && self.docs.length > 0) || (self.atts && self.atts.length > 0)){
                noToggle = false;
                if(self.options._transed){
                    self._initV5FilePage4Transed();
                    _.att.init(self.attShowWrapper,self.atts,self.docs,{
                        delCallback:function(delData){
                            self._v5delFile(delData);
                        },
                        isDefault:true,
                        isShowDelete:true,
                        wrapperID:self.wrapperID,
                        callback:function(docData,docView){
                            _v5DocItemAction(docData,docView,function(docData){
                                self._handleBeforeDocPenetrate();
                                AttUtil.transfer(docData);
                            },self.options.delCallback);
                        }
                    });
                }else {
                    self._initV5FilePage();
                    _.att.init(self.attShowWrapper,self.atts,self.docs,{
                        delCallback:self.delCallback,
                        isDefault:true,
                        isShowDelete:true,
                        callback:self.options.docPenetrateCallback
                    });
                    self._v5FilePageAnimation(true);
                }
            }
            if(self.newAttsData || self.newDocsData) {
                noToggle = false;
                if(self.options._transed){
                    self._initV5FilePage4Transed();
                }
                self._handleDocPenetrateBackChoosedData();
            }
            if(noToggle){
                if(self.options._transed){
                    self._initV5FilePage4Transed();
                }
                self._noToggle();

            }
        }else {
            if(self.options._transed){
                _.backbutton.push(function(){  //如果是页面跳转的方式，需要将处理回退已选数据的方法push
                    _.storage.delete("cmp-accDoc-opts", true);
                    self._handleJumpPageAttResult();
                });
            }
            self._noToggle();
        }
    };
    AttUpload.prototype._v5FilePage = function(){
        var self = this;
        var v5FilePage = document.createElement("div");
        v5FilePage.setAttribute("uid",self.wrapperID);
        v5FilePage.classList.add("cmp-att-basicDiv");
        v5FilePage.classList.add("cmp-att-basicDiv-thisPage");
        v5FilePage.style.cssText = "left:100%;top:0";
        var v5FileUploadPageStr = _.tpl(v5FileUploadPage(),{continue:self.options.continueUpload});
        _.append(v5FilePage,v5FileUploadPageStr);
        return v5FilePage;
    };
    AttUpload.prototype._bindEvent = function () {
        var self = this;
        //给照相按钮绑定事件
        _.event.click(self.photoBtn,function(){
            self._toggle();
            _.camera.getPictures({
                allowEdit: false,
                sourceType: _.camera.PictureSourceType.CAMERA,
                destinationType: _.camera.DestinationType.FILE_URI,
                success: function (result) {
                    var imgData = result.files;
                    self._uploadAtt(new AttUploadResponse(0, imgData));
                }, error: function (e) {
                    console.log(e);
                }
            });
        });

        //给录音按钮绑定事件
        _.event.click(self.soundRecordBtn,function(){
            //这里调用录音组件
            self._toggle();
            _.audio.checkPermission({//增加语音权限
                success:function(){
                    _.audio.init({
                        callback: function (src) {
                            var sounds = [];
                            sounds.push(src);
                            _.att.getFileInfo({   //读取录音文件的信息
                                filepath:sounds,
                                success:function(result){
                                    self._uploadAtt(new AttUploadResponse(2, result));
                                },
                                error:function(error){
                                    _.notification.toast(error,"top",2000);
                                }
                            });

                        },
                        cancelCallback: function () {
                        },
                        text: {
                            use: _.i18n("cmp.att.use")
                        }
                    });
                }
            });

        });

        //给关联文档绑定事件
        _.event.click(self.relateDocBtn,function(){
            if(self.enableCloseCount <= 0){//防护文件还在上传，就进行页面跳转
                self._toggle();
                self._handleBeforeDocPenetrate();
                _.accDocJump({//以页面跳转的方式进行选择
                    fillbackData:docDataCacheMap.values(),
                    pageKey:"cmp-accDoc-select"
                });
            }else {
                _.notification.toast(_.i18n("cmp.att.cantChooseDocOnUploading"),"top");
            }

        });

        //给本地图片按钮绑定事件
        _.event.click(self.localFileBtn,function(){
            self._toggle();
            _.att.getOfflineFiles({
                success: function (result) {
                    var localFile = result.files;
                    self._uploadAtt(new AttUploadResponse(1, localFile));
                }, error: function (e) {
                }
            });
        });

        //给本地图片按钮绑定事件
        _.event.click(self.localImgBtn,function(){
            self._toggle();
            _.camera.getPictures({
                allowEdit: false,
                sourceType: cmp.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: cmp.camera.DestinationType.FILE_URI,
                quality:AttUploadConstant.C_iPic_quality,
                success: function (result) {
                    var imgData = result.files;
                    self._uploadAtt(new AttUploadResponse(0, imgData));
                }, error: function (e) {
                    console.log(e);
                }
            });
        });
        //给新建文件夹按钮绑定事件
        _.event.click(self.createFolderBtn,function(){
            self._toggle();
            var callback = self.options.createFolderCallback;
            if(callback && typeof callback == "function"){
                callback();
            }
        });

        //给取消按钮绑定事件
        _.event.click(self.cancelBtn,function(){
            self._toggle();
        });

    };
    AttUpload.prototype._toggle = function(){
        var self = this;
        var backdrop = document.querySelector(".cmp-backdrop");
        if(backdrop){
            backdrop.parentNode.removeChild(backdrop);
            backdrop = null;
        }
        self.wrapper.classList.remove("cmp-active");
        self.wrapper.classList.add("cmp-hidden");
        self.wrapper.classList.remove("cmp-v5-file-wrapper-show");
        _.backbutton.pop();
    };
    AttUpload.prototype._noToggle = function(){
        var self = this;
        self.wrapper.classList.remove("cmp-hidden");
        _.append(document.body,v5FileBackdrop());
        if(!self.wrapper.classList.contains("cmp-active")){
            self.wrapper.classList.add("cmp-active");
            self.wrapper.classList.add("cmp-v5-file-wrapper-show");
        }
        _.backbutton.push(_.att.initUpload_wrapperPage_close);
        document.querySelector(".cmp-backdrop").addEventListener("tap",function(){
            var backdrop = this;
            self._toggle();
            backdrop = null;
        },false);
    };
    /**
     * 本地文件、照相，相册，录音传过来的数据格式是
     * {type:1,data:{files:[{filepath:"file:///dsadasdasd",base64:"file:///adasdasd",type:"jpg",fileSize:"12344"}]}}
     * @param obj
     * @private
     */
    AttUpload.prototype._uploadAtt = function (obj,reUpload) {
        var self = this;
        var filePath = [];
        var fileItems = "";
        var tpl = v5FileItem();
        var docItems = [];
        obj.wrapperID = self.wrapperID;
        switch (obj.type) {
            case AttType.pic:
            case AttType.voice:
            case AttType.localFile:

                var files = obj.data;
                for(var i = 0;i<files.length;i++){
                    var fileId;
                    if(!files[i].reload){
                        fileId = _.buildUUID();
                    }else {
                        fileId = files[i].fileId;
                    }
                    var file = {
                        filepath:files[i].filepath,
                        fileId: fileId
                    };
                    if(files[i].fileData){
                        file.fileData = files[i].fileData
                    }
                    filePath.push(file);
                    obj.data[i].fileId = fileId;
                    self.enableCloseCount++;//只有上传附件类时，才设置不能回退的防护
                }
                break;
            case AttType.accessoryDoc:
                tpl = v5DocItem();
                docItems = self._handleDocData(obj);
                obj.data = docItems;
                break;
            default :
                break;
        }
        if(self.options.fileWrapper != null){
            //todo  开发者自定义的渲染位置
            self.attShowWrapper = (typeof self.options.fileWrapper == "object")?self.options.fileWrapper:document.querySelector(self.options.fileWrapper);
            var attShowWrapper = self.attShowWrapper.querySelector("#v5FileList");
            if(!attShowWrapper){
                _.append(self.attShowWrapper,'<ul id="v5FileList" class="cmp-fileupload-animate-content cmp-accessory-content"></ul>');
                attShowWrapper = self.attShowWrapper.querySelector("#v5FileList");
            }
            if(!reUpload){
                fileItems = _.tpl(tpl,obj);
                _.append(attShowWrapper,fileItems);
            }
            if(obj.type == AttType.accessoryDoc){
                self._bindAccDocEvent(obj.data);
                self.callback && self.callback(obj.data);
            }
        }else {
            if(self.options._transed){
                self._initV5FilePage4Transed();
            }else {
                self._initV5FilePage();
                self._v5FilePageAnimation(true);
            }
            if(!reUpload){   //如果不是重新上传
                fileItems = _.tpl(tpl,obj);
                _.append(self.attShowWrapper,fileItems);
                if(obj.type == AttType.accessoryDoc){
                    self._bindAccDocEvent(docItems);
                    self.callback && self.callback(obj.data);
                }
            }
        }
        if(filePath.length > 0) {
            var queryParam = _.token == ""?("?token=" + _.token + "&option.n_a_s=1"):"?option.n_a_s=1";
            _.backbutton(false,function promptFileIsLoading(){
                _.notification.toast(_.i18n("cmp.att.uploadingFile"),"top",500);
            });
            _.att.upload({
                url: _.origin + "/rest/attachment"+queryParam,
                fileList: filePath,
                progress: function (result) {
                    self._updateProgress(result);

                    //todo 做对应文件进度条的更新
                },
                success: function (result) {
                    self._updateProgress(result);
                    var response = _.parseJSON(result.response);
                    var _att = response["atts"];
                    var i = 0,len = _att.length;
                    for(;i<len;i++){
                        allChoosedData.put(_att[i].fileUrl,_att[i]);
                    }
                    self.enableCloseCount--;//上传完了，才将回退按钮的回退事件置为true
                    self.callback && self.callback(_att);
                    if(self.enableCloseCount <= 0){//要等所有上传完了，才开启回退按钮
                        _.backbutton(true);
                    }

                }, error: function (error) {  //重新定义上传失败的回调，因为有重新上传的可能
                    _.errorHandler(error);
                    var fileId = error.fileId;
                    var fileItem = self.attShowWrapper.getElementsByClassName(fileId)[0];
                    var cmpData = fileItem.getAttribute("cmp-data");
                    var filePath = _.parseJSON(cmpData).filepath;
                    var fileName = _.att.filename(filePath);
                    _.notification.toast(fileName +_.i18n("cmp.att.uploadFailed"), 'top', 2000);
                    console.log(error);
                    self.enableCloseCount--;
                    self._updateProgress(error,true);
                    if(self.enableCloseCount <= 0){
                        _.backbutton(true);
                    }
                }
            });
        }
    };
    AttUpload.prototype._handleDocData = function(obj){
        var self = this;
        var filterOutDocItems = [],objDocDataTempMap = new _.map();
        for(var i = 0;i<obj.data.length;i++){//给allChoosedData添加本身无的数据
            var docData = obj.data[i],key = self._getFileDataId(docData);
            if(!allChoosedData.containsKey(key)) {
                allChoosedData.put(key,docData);
                docDataCacheMap.put(key,docData);
                filterOutDocItems.push(docData);
            }
            objDocDataTempMap.put(key,docData);
        }
        var docDataCacheArr = docDataCacheMap.values();
        for(var i = 0;i < docDataCacheArr.length;i++){//删除通过关联文档组件删除的文档的处理
            var docData = docDataCacheArr[i],key = self._getFileDataId(docData);
            if(!objDocDataTempMap.containsKey(key)){
                docDataCacheMap.remove(key);
                var docRenderItem = self.attShowWrapper.getElementsByClassName(key)[0];
                docRenderItem.remove();
                docRenderItem = null;
                self._v5delFile(docData,self.options.delCallback);
            }
        }
        return filterOutDocItems;
    };
    AttUpload.prototype._getFileDataId = function(fileData){
        var fileId,fileType=fileData.type+"";
        switch (fileType){
            case "collaboration"://新通过关联文档组件选中的协同
                fileId = fileData.id;
                break;
            case "2" :  //默认有的文档中的协同或文档中心选的文档
                fileId = fileData.description;
                break;
            case "docFile": //新通过关联文档组件选中的文档中心的文档
                fileId = fileData.fr_id;
                break;
            case "0":
                if(!fileData.id){
                    fileId = fileData.fileUrl;
                }else {
                    fileId = fileData.id;
                }
                break;
            case "edoc"://从关联文档组件中的公文选出的数据
                fileId = fileData.affairId;
                break;
        }
        return fileId;
    };
    AttUpload.prototype._initV5FilePage = function(){
        var self = this;
        if(self.v5FilePage == null){
            self.v5FilePage = self._v5FilePage();
            document.body.appendChild(self.v5FilePage);
            self.attShowWrapper = self.v5FilePage.querySelector("#v5FileList");
            self.uploadBtn = self.v5FilePage.querySelector("#v5UploadBtn");
            //给【继续上传】按绑定事件
            if(self.uploadBtn){
                self.uploadBtn.addEventListener("tap",function(){
                    self._noToggle();
                },false);
            }
            _.backbutton.push(function(){
                if(self.enableCloseCount > 0){
                    _.notification.toast(_.i18n("cmp.att.uploadingFile"),"top",500);
                    return;
                }
                self._updateTitle();
                _.backbutton.pop();
                self._v5FilePageAnimation();
                if(self.options.clearCache){
                    allChoosedData.clear();
                    setTimeout(function(){
                        self.v5FilePage.remove();
                        self.v5FilePage = null;
                    },500)
                }
            });
        }
        var container = document.querySelector("#v5FileContainer");
        var contentH = (window.innerHeight || document.body.clientHeight) - 50;
        container .style.height = contentH + "px";
        // self._updateTitle(true);
    };
    AttUpload.prototype._updateTitle = function(selfTitle){
        var self = this;
        if(selfTitle){
            document.title = _.i18n("cmp.att.upload");
        }else {
            document.title = self.oherTitle;
        }
    };
    AttUpload.prototype._initV5FilePage4Transed = function(){
        var self = this;
        if(self.v5FilePage == null){
            _.backbutton.push(function(){  //如果是页面跳转的方式，需要将处理回退已选数据的方法push
                if(self.enableCloseCount <= 0){
                    _.storage.delete("cmp-accDoc-opts", true);
                    self._handleJumpPageAttResult();
                }else {
                    _.notification.toast(_.i18n("cmp.att.uploadingFile"),"top");
                }
            });
            self.v5FilePage = document.querySelector("#v5FileContainer");
            self.attShowWrapper = self.v5FilePage.querySelector("#v5FileList");
            self.uploadBtn = document.querySelector("#v5UploadBtn");
            if(self.uploadBtn){
                self.uploadBtn.addEventListener("tap",function(){
                    self._noToggle();
                },false);
            }
        }
        var contentH = (window.innerHeight || document.body.clientHeight) - 50;
        self.v5FilePage .style.height = contentH + "px";

    };
    AttUpload.prototype._handleDocPenetrateBackChoosedData = function(){
        var self = this;
        if(self.newDocsData && self.newDocsData.length > 0){
            var docDatas = {data:self.newDocsData,wrapperID:self.wrapperID};
            var docItems = _.tpl(v5DocItem(),docDatas);
            _.append(self.attShowWrapper,docItems);
            self._bindAccDocEvent(self.newDocsData);
        }

        if(self.newAttsData && self.newAttsData.length > 0) {
            var fileDatas = {data:self.newAttsData,wrapperID:self.wrapperID};
            var fileItems = _.tpl(v5FileItem(),fileDatas);
            _.append(self.attShowWrapper,fileItems);
            var i = 0,len = self.newAttsData.length;
            for(;i<len;i++){
                (function(i){
                    var newFile = self.newAttsData[i];
                    var fileId = newFile.fileUrl|| newFile.fileId;
                    var fileItem = self.attShowWrapper.getElementsByClassName(fileId)[0];
                    fileItem.setAttribute("v5-file", _.toJSON(newFile));
                    fileItem.addEventListener("tap",self._chooseAction4Success,false);
                    var delBtn = fileItem.querySelector(".see-icon-close-round-fill");
                    if(delBtn){
                        delBtn.addEventListener("tap",function(e){
                            e.stopPropagation();
                            var v5file = _.parseJSON(fileItem.getAttribute("v5-file"));
                            self._v5delFile(v5file,self.options.delCallback);
                            fileItem.remove();
                            delBtn = null;
                        },false)
                    }
                })(i);
            }
        }
    };
    AttUpload.prototype._v5FilePageAnimation = function(show){
        var self = this;
        if(show){
            //filePath   新改后传的全是数组-----2016-07-23
            if(!self.v5FilePage.classList.contains("cmp-v5-file-pageShow")){
                self.v5FilePage.style.display = "block";
                self.v5FilePage.classList.remove("cmp-v5-file-pagClose");
                self.v5FilePage.classList.add("cmp-v5-file-pageShow");
                self.v5FilePage.style.Transform="translateX(-100%)";
                self.v5FilePage.style.WebkitTransform="translateX(-100%)";
                self.v5FilePage.style.Transition="300ms";
                self.v5FilePage.style.WebkitTransition="300ms";
                _.backbutton.push(_.att.initUpload_filePage_close);
                self._updateTitle(true);
            }

        }else {
            self.v5FilePage.classList.add("cmp-v5-file-pagClose");
            self.v5FilePage.classList.remove("cmp-v5-file-pageShow");
            self.v5FilePage.style.Transform="translateX(0%)";
            self.v5FilePage.style.WebkitTransform="translateX(0%)";
            self.v5FilePage.style.Transition="200ms";
            self.v5FilePage.style.WebkitTransition="200ms";
            var closeCallback = self.options.closeCallback;
            if(closeCallback && typeof closeCallback == "function"){
                closeCallback();
            }
            setTimeout(function(){
                self.v5FilePage.style.display = "none";
            },200);
            self._updateTitle();
            _.backbutton.pop();
        }
    };

    AttUpload.prototype._bindAccDocEvent = function(docItems){
        var self = this;
        var i = 0,len = docItems.length;
        for(;i<len;i++){
            (function(i){
                var doc = docItems[i];
                var docId = self._getFileDataId(doc);
                var docItem = self.attShowWrapper.getElementsByClassName(docId)[0];
                if(docItem){
                    docItem.addEventListener("tap",function(){
                        if(self.enableCloseCount<=0){
                            _v5DocItemAction(doc,this,function(docData){
                                if(docData.type == "edoc"){
                                    docData = _.v5.att_transeEdocData4Penetration(docData);
                                }
                                self._handleBeforeDocPenetrate();
                                AttUtil.transfer(docData);
                            },self.options.delCallback);
                        }else {
                            _.notification.toast(_.i18n("cmp.att.uploadingFile"),"top");
                        }

                    });
                    var delBtn = docItem.querySelector(".see-icon-close-round-fill");
                    if(delBtn){
                        delBtn.addEventListener("tap",function(e){
                            e.stopPropagation();
                            self._v5delFile(doc,self.options.delCallback);
                            docItem.remove();
                            delBtn = null;
                        },false)
                    }
                }
            })(i);
        }
    };

    AttUpload.prototype._updateProgress = function(result,fail){
        var self = this;
        var fileId = result.fileId;
        var fileItem = self.attShowWrapper.getElementsByClassName(fileId)[0];
        var fileItemAnimation = fileItem.querySelector(".cmp-fileupload-animation");
        if(fail){ //上传失败后点击刷新按钮可以重新上传
            fileItemAnimation.innerHTML = "<span class='see-icon-v5-common-refresh'></span>";
            var refreshBtn = fileItemAnimation.querySelector(".see-icon-v5-common-refresh");
            if(refreshBtn) {
                refreshBtn.addEventListener("tap",function(e){
                    e.stopPropagation();
                    var fileObj = _.parseJSON(fileItem.getAttribute("cmp-data"));
                    fileObj.reload = true;
                    var fileArr = [];
                    fileArr.push(fileObj);
                    var uploadFileObj  = new AttUploadResponse(0, fileArr);
                    refreshBtn = null;
                    fileItemAnimation.innerHTML = v5ProgressPie;
                    self._uploadAtt(uploadFileObj,true);
                },false);
            }
            fileItem.removeEventListener("tap",self._chooseAction4Success,false);//去掉成功的行动的监听
            fileItem.addEventListener("tap",self._chooseAction4Fail,false);
        }else {
            var progressPie = fileItem.querySelector(".progressPie");
            //var progressNum = progressPie.querySelector(".progressNum");
            var progressLeft = progressPie.querySelector(".progressLeft");
            var progressRight = progressPie.querySelector(".progressRight");
            if(result["pos"] < 1){
                var num = (Math.round(parseFloat(result["pos"]) * 100));
                var rotateNum = num * 3.6;
                //progressNum.innerHTML=num;
                if (rotateNum <= 180) {
                    progressLeft.style.webkitTransform="rotate("+(rotateNum)+"deg)";
                    progressLeft.style.msTransform="rotate("+(rotateNum)+"deg)";
                } else {
                    progressLeft.style.webkitTransform="rotate(180deg)";
                    progressLeft.style.msTransform="rotate(180deg)";
                    var ber=rotateNum-180;
                    progressRight.style.webkitTransform="rotate("+(ber)+"deg)";
                    progressRight.style.msTransform="rotate("+(ber)+"deg)";
                }
            }else {
                //progressNum.innerHTML = "100";
                progressRight.style.webkitTransform="rotate(180deg)";
                progressRight.style.msTransform="rotate(180deg)";
                setTimeout(function(){
                    fileItemAnimation.innerHTML = "<span class='see-icon-close-round-fill delete'></span>";
                    fileItem.classList.remove(fileId);
                    var response = _.parseJSON(result.response);
                    var _att = _.toJSON(response["atts"][0]);
                    fileItem.setAttribute("v5-file",_att);
                    fileItem.removeEventListener("tap",self._chooseAction4Fail,false);//去掉失败行动的监听
                    fileItem.addEventListener("tap",self._chooseAction4Success,false);
                    var delBtn = fileItemAnimation.querySelector(".see-icon-close-round-fill");
                    if(delBtn){
                        delBtn.addEventListener("tap",function(e){
                            e.stopPropagation();
                            var v5file = _.parseJSON(fileItem.getAttribute("v5-file"));
                            self._v5delFile(v5file,self.options.delCallback);
                            fileItem.remove();
                            delBtn = null;
                        },false)
                    }
                },150);
            }
        }
    };

    AttUpload.prototype._chooseAction4Fail = function(){
        var fileItem = this;
        var fileObj = _.parseJSON(this.getAttribute("cmp-data"));
        _v5AttItemAction(fileObj,fileItem,false);
    };
    AttUpload.prototype._chooseAction4Success = function(){
        var fileItem = this;
        var fileObj = _.parseJSON(this.getAttribute("cmp-data"));
        var v5file = _.parseJSON(this.getAttribute("v5-file"));
        _v5AttItemAction(fileObj,fileItem,true,v5file);
    };
    //处理在穿透跳转前的所选数据
    AttUpload.prototype._handleBeforeDocPenetrate = function(){
        var self = this;
        var currentFileDatas = self._getDiffFileData();
        self.options.initDocData = currentFileDatas.oldDocs;
        self.options.initAttData = currentFileDatas.oldAtts;
        self.options.newAttsData = currentFileDatas.newAtts;
        self.options.newDocsData = currentFileDatas.newDocs;
        _.storage.save("cmp-v5-att-initUpload-options", _.toJSON(self.options),true);
    };
    AttUpload.prototype._getDiffFileData = function(){
        var allChoosedDataArr = allChoosedData.values();
        var i = 0,len = allChoosedDataArr.length;
        var oldAtts = [],oldDocs = [],newAtts = [],newDocs = [], tempChooseNode =document.querySelectorAll('#v5FileList>li'), tempChooseData = [];
        function getJson(stringJson) {
            try {
                stringJson = JSON.parse(stringJson || '{}');
            } catch (e) {
                stringJson = {}
            }
            return stringJson
        }
        for (var j = 0; j < tempChooseNode.length; j++) {
            var item = tempChooseNode[j];
            var stringFile = getJson(item.getAttribute('v5-file'));
            var stringData = getJson(item.getAttribute('cmp-data'));
            var fileJson = (stringFile.fileUrl || stringFile.affairId) ? stringFile : stringData;
            for (var n = 0; n < len; n++) {
                var hasIn = (fileJson.fileUrl&&(fileJson.fileUrl == allChoosedDataArr[n].fileUrl)) || (fileJson.affairId&&(fileJson.affairId == allChoosedDataArr[n].affairId));
                if (hasIn) {
                    tempChooseData.push(allChoosedDataArr[n]);
                }
            }
        }
        for(;i<tempChooseData.length;i++){
            var data = tempChooseData[i];
            if(data.old) {
                if(data.type == "2") {  //等于2是服务器端返回的默认doc
                    oldDocs.push(data);
                }else {
                    oldAtts.push(data);
                }
            }else {
                if(data.type == "collaboration" || data.type == "docFile" || data.type== "edoc"){
                    newDocs.push(data);
                }else {
                    newAtts.push(data);
                }
            }
        }
        return {
            oldAtts:oldAtts,//初始的附件类文件
            oldDocs:oldDocs,//初始的文档类文件（包括协同和文档中心的文档）
            newDocs:newDocs,//新选的guan关联文档组件选出来的协同和文档中心的文档
            newAtts:newAtts//新上传的图片、照相、离线文件的文件
        }
    };
    AttUpload.prototype._handleJumpPageAttResult = function(){
        var self = this;
        var queryParams;
        var historyPageKey = _.storage.get("cmp-v5-att-jump-pageKey",true);
        var dataKey = self.options.pageKey;
        if(!historyPageKey){
            _.storage.save("cmp-v5-att-jump-pageKey",dataKey,true);
            queryParams = "pageKey=" + self.options.pageKey;
        }else {
            if(historyPageKey != dataKey){
                _.storage.save("cmp-v5-att-jump-pageKey",dataKey,true);
                queryParams = "pageKey=" + self.options.pageKey;
            }
        }
        var newData = [],oldData = [];
        var returnData = self._getDiffFileData();
        oldData = oldData.concat(returnData.oldAtts);
        oldData = oldData.concat(returnData.oldDocs);
        newData = newData.concat(returnData.newAtts);
        newData = newData.concat(returnData.newDocs);
        _.storage.save(dataKey, _.toJSON({newData:newData,oldData:oldData}),true);//todo 修改回传值格式
        _.href.back(1,queryParams);
    };
    //删除指定文件
    AttUpload.prototype._v5delFile = function(file,delCallback){
        var self = this;
        var fileId = self._getFileDataId(file);//取的是文档的id
        allChoosedData.remove(fileId);
        if(docDataCacheMap.containsKey(fileId)){
            docDataCacheMap.remove(fileId)
        }
        if(delCallback && typeof delCallback == "function"){
            delCallback(file);
        }
    };
    //文件操作动作
    var _v5AttItemAction = function(fileData,fileItem,success,v5file){
        var items = [];
        if(hasOpenByThirdAppPlugin){
            items.push({key:"thirdApp",name:_.i18n("cmp.att.openByThirdApp")});
        }
        items.push({key:"see",name:_.i18n("cmp.att.view")});
        if(_.platform.wechatOrDD || _.platform.third){//微信端不支持查看本地上传的附件，因为附件的数据是fileData的二进制的，查看不了
            items = [];
        }
        if(success){
            items.push({
                key:"del",
                name:_.i18n("cmp.att.del")
            });
        }else {
            items.push({
                key:"reUpload",
                name:_.i18n("cmp.att.reupload")
            },{
                key:"del",
                name:_.i18n("cmp.att.del")
            });
        }
        _.dialog.actionSheet(items, _.i18n("cmp.att.cancel"), function (item) {
            if(item.key == "see"){ //查看文件，查看本地的（不是查看服务器端的）
                if(fileData.new){//上传成功后又进行页面跳转，那么此时需要查看的话数据是服务器端的了
                    var id = fileData.fileUrl, fileName = fileData.filename, filePath = "",lastModified = fileData.lastModified || fileData.createDate || fileData.createdate;
                    filePath = _.origin + "/rest/attachment/file/"+ id;
                    if(_.att.canPlay(fileData.extension) && !_.platform.wechatOrDD){ //amr是android  wav是ios格式
                        _playFile(id,filePath,fileName,lastModified);
                    }else {
                        _readFile(id,filePath,fileName,lastModified);
                    }
                }else {
                    if(_.att.canPlay(fileData.type)){
                        _.audio.play({
                            filepath:fileData.filepath,
                            filename:_.att.filename(fileData.filepath)
                        });
                    }else {
                        _.att.read({
                            path: fileData.filepath,
                            filename: _.att.filename(fileData.filepath),
                            success: function (result) {
                            },
                            error: function (e) {
                                _.notification.toast(_.i18n("cmp.att.fileNonExist"),"top",2000);
                            }
                        });
                    }
                }
            }else if(item.key == "del"){ //删除文件
                var wrapperID = fileItem.getAttribute("wrapper");
                fileItem.remove();
                fileItem = null;

                var delCallback = v5AttInitUploadCache[wrapperID].options.delCallback;
                v5AttInitUploadCache[wrapperID]._v5delFile(v5file,delCallback);

            }else if(item.key == "reUpload"){//重新上传文件
                var wrapperID = fileItem.getAttribute("wrapper");
                fileData.reload = true;
                var fileArr = [];
                fileArr.push(fileData);
                var uploadFileObj  = new AttUploadResponse(0, fileArr);
                var fileItemAnimation = fileItem.querySelector(".cmp-fileupload-animation");
                fileItemAnimation.innerHTML = v5ProgressPie;
                v5AttInitUploadCache[wrapperID]._uploadAtt(uploadFileObj,true);
            }else if(item.key == "thirdApp"){
                _.dialog.loading();
                var filePath,fileName,lastModified,id;
                if(fileData.new){
                    id = fileData.fileUrl, fileName = fileData.filename, lastModified = fileData.lastModified || fileData.createDate || fileData.createdate;
                    filePath = _.origin + "/rest/attachment/file/"+ id;
                }else {
                    filePath = fileData.filepath;
                    fileName = _.att.filename(fileData.filepath)
                }
                _.att.openByThirdApp({
                    path:filePath,
                    filename:fileName,
                    extData: {
                        lastModified:lastModified,
                        fileId:id,
                        origin:_.origin
                    },
                    success:function(){_.dialog.loading(false);},
                    error:function(e){
                        _.dialog.loading(false);
                        if(!_.errorHandler(e)){
                            var msg = e.message;
                            _.notification.alert(msg, null,_.i18n("cmp.att.tips"),_.i18n("cmp.att.ok"));
                        }
                    }
                })
            }
        }, function () {//点击取消
        });
    };
    var _v5DocItemAction = function(docData,docItem,callback,delCallback){
        if(docData.type == "collaboration"//关联文档组件选出来的协同
            || docData.type == "edoc"//关联文档组件选出来的公文
            || docData.mimeType == "collaboration" //以下的mimeType都是服务器端的数据格式
            ||docData.mimeType == "edoc"
            ||docData.mimeType == "meeting"
            ||docData.mimeType == "km"){
            if(callback && typeof callback == "function"){
                if(docData.type == "edoc"){//公文选中的原始数据需要转换一下格式
                    docData = _.v5.att_transeEdocData4Penetration(docData);
                }
                callback(docData);
            }
        }else if (docData.fr_type){//回传回来的数据，有可能是之前通过文档中心选出来的文档协同、会议。。。。。
            if(_.v5.att_canPenetration4Doc(docData.fr_type,true)){
                docData = _.v5.att_transeDocData4Penetration(docData);
                callback(docData);
            }else {//这种情况是通过关联文档组件选出来的附件类
                var items = [];
                var fileName = docData.file_name || docData.fr_name;
                if(_.v5.att_canPenetration4Doc(docData.fr_type,true)){ //判断是否是可以进行穿透文档中心选出来的协同那些等
                    if(callback && typeof callback == "function"){
                        docData = _.v5.att_transeDocData4Penetration(docData);
                        callback(docData);
                    }
                }else{
                    var fileType = _.att.type(fileName);
                    if(_.att.canSee(fileType) &&  _.v5.att_canSee4DocFile(docData.fr_type)){
                        items.unshift({
                            key:"see",
                            name:_.i18n("cmp.att.view")
                        });
                    }
                    items.push({
                        key:"del",
                        name:_.i18n("cmp.att.del")
                    });
                    _.dialog.actionSheet(items, _.i18n("cmp.att.cancel"), function (item) {
                        if(item.key == "see"){ //查看文件，由于是关联文档选出来的，只能先下载，才能看
                            var id = docData.file_id, filePath = "";
                            var filePath = _.origin + "/rest/attachment/file/"+ id;
                            var lastModified = id;//文档中心的就用id作为lastModified，文档中心如果替换了id都会变
                            if(_.att.canPlay(fileType) && !_.platform.wechatOrDD ){
                                _playFile(id,filePath,fileName,lastModified);
                            }else {
                                _readFile(id,filePath,fileName,lastModified);
                            }

                        }else if(item.key == "del"){ //删除文件
                            var wrapperID = docItem.getAttribute("wrapper");
                            docItem.remove();
                            docItem = null;

                            v5AttInitUploadCache[wrapperID]._v5delFile(docData,delCallback);
                        }
                    }, function () {//点击取消
                    });
                }
            }
        }
    };
    //==============================================================v5附件组合(协同) end===================================//



})(cmp);

