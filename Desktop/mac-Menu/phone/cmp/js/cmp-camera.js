(function(_){
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-camera',null,cmpBuildversion);
    //=======================================================================拍照录像组件 start=======================//
    var DEFAULT_CAMERA_QUALITY = 100; // 默认摄像头品质 100
    var DEFAULT_CAMERA_ALLOWEDIT = false; // 默认是否允许编辑false
    var DEFAULT_CAMERA_TARGE_WIDTH = -1; // 默认宽度100
    var DEFAULT_CAMERA_TARGE_HEIGHT = -1; // 默认高度100
    var DEFAULT_CAMERA_SAVE_ALBUM = false; // 默认是否保存到相册false
    var DEFAULT_PICTURE_NUMBER = 9; //默认选择的图片数量
    var DEFAULT_MAXFILE_SIZE=10*1024*1024;//默认可选的图片大小是10M
    _.camera = {};
    // 返回图片数据的类型
    _.camera.DestinationType = {
        DATA_URL: 0, // Return 64位编码格式的图片数据字符串
        FILE_URI: 1, // Return 图片文件路径
        NATIVE_URI: 2 // Return 本地图片路径，主要针对不同平台设备的区分 (e.g., assets-library:// on iOS or content:// on Android)
    };
    // 图片来源类型
    _.camera.PictureSourceType = {
        PHOTOLIBRARY: 0, // 图片库
        CAMERA: 1, // 摄像头（拍照）
        SAVEDPHOTOALBUM: 2 // 相册
    };
    // 图片编码类型
    _.camera.EncodingType = {
        JPEG: 0, // Return JPEG 编码图片
        PNG: 1 // Return PNG 编码图片
    };

    /**
     * 获取图像方法，开发者可通过配置获取自己想要的图像文件数据
     */
    _.camera.getPictures = function(options) {
        if(_.platform.wechatOrDD ){
            _getPictureByH5(options);
        }else if (_.platform.CMPShell || _.platform.M3W) {
            var successFun = function(result){
                var files,i = 0,len=  result.files.length;
                for(; i <len ;i ++){
                    result.files[i].base64 = result.files[i].filepath
                }
                if(_.os.ios){//只适配iphone6
                    if(!result.files.index){
                        console.log("建生兄，你没有加index这个参数啊");
                    }
                    result.files.sortByKey("index");
                }
                result.success = true;
                if( typeof options.success == "function"){
                    options.success(result);
                }
            };
            var errorFun = function(e){
                switch(e.code){
                    case 56002://无相册权限
                    case 56003://无拍照权限
                        _.dialog.loading(false);
                        _turnOnCameraPermission(e.code);
                        break;
                    default :
                        if(typeof options.error == "function"){
                            options.error(e);
                        }
                        break;
                }
            }
            var quality = options.quality || DEFAULT_CAMERA_QUALITY,
                targetWidth = options.targetWidth || DEFAULT_CAMERA_TARGE_WIDTH,
                targetHeight = options.targetHeight || DEFAULT_CAMERA_TARGE_HEIGHT,
                saveToPhotoAlbum = typeof options.saveToPhotoAlbum == "undefined" ? DEFAULT_CAMERA_SAVE_ALBUM : options.saveToPhotoAlbum,
                destinationType = typeof options.destinationType == "undefined" ? _.camera.DestinationType.FILE_URI : options.destinationType,
                sourceType = typeof options.sourceType == "undefined" ? _.camera.PictureSourceType.CAMERA : options.sourceType,
                encodingType = typeof options.encodingType == "undefined" ? _.camera.EncodingType.JPEG : options.encodingType,
                allowEdit = typeof options.edit != "undefined"?options.edit:false,//是否启用图片裁剪功能
                mediaType =  0,
                correctOrientation = false,
                popoverOptions = null,
                cameraDirection = 0,
                pictureNum = parseInt(options.pictureNum) || DEFAULT_PICTURE_NUMBER,
                maxFileSize = options.maxFileSize || DEFAULT_MAXFILE_SIZE,
				rename = typeof options.rename == "undefined"?false:options.rename;
            cordova.exec(
                successFun,
                errorFun,
                "Camera",
                "takePicture",
                [
                    quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                    mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, popoverOptions, cameraDirection, pictureNum,maxFileSize,rename
                ]
            );
        }else if(_.platform.third){
            _.event.trigger("cmpThirdPlatformPlugins",document,{data:options,backupsFun:_getPictureByH5,plugin:"camera"})
        }
    };

    //处理压缩base64
    _.camera.compressBase64 = function(options){
        var result;
        var _options = _.extend({
            data:"",
            width:100,
            height:100,
            quality:0.25
        },options);
        var imgDom = document.createElement("img");
        imgDom.src = _options.data;
        var cvs = document.createElement('canvas');
        cvs.width = _options.width;
        cvs.height = _options.height;
        imgDom.width = _options.width;
        imgDom.height = _options.height;
        var pen =  cvs.getContext("2d");
        //在canvas中绘制图片
        pen.drawImage(imgDom, 0, 0,imgDom.naturalWidth,imgDom.naturalHeight,0,0,imgDom.width,imgDom.height);
        //重置base64数据
        result = cvs.toDataURL("image/jpeg", _options.quality);
        return result;
    };

    //将base64转换成能上传的file二进制
    _.camera.base64ToFileData = function(base64Data){
        var arr = base64Data.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    };

    function _handleHTMLImgData(file,options){
        if (!/image\/\w+/.test(file.type)) {
            _.notification.alert(_.i18n("cmp.camera.errorMsgChooseImg"), null, "");
            if(typeof options.error == "function"){
                options.error({
                    code:56005,
                    message:_.i18n("cmp.camera.errorMsgChooseImg")
                });
            }
        } else {
            var fileSize = file.size;
            var fileType = file.type.replace("image/","");
            if(fileSize > DEFAULT_MAXFILE_SIZE){
                _.notification.alert(_.i18n("cmp.camera.errorMsgFileSizeOver"), null, "");
                if(typeof options.error == "function"){
                    options.error({
                        code:56006,
                        message:_.i18n("cmp.camera.errorMsgFileSizeOver")
                    });
                }
            }else {
                var dataURLReader = new FileReader();
                //获取图片base64编码
                dataURLReader.readAsDataURL(file);
                //读取后的回调
                dataURLReader.onload = function(e) {
                    var base64Data = e.target.result;
                    if (options.success && typeof options.success == "function") {//file按钮选择只能选择一条
                        var fileData = file;
                        if(_.os.ios && /image.(jpg)|(jpeg)/i.test(fileData.name)){//兼容ios拍照的图片名称一直不变的问题
                            fileData = new File([file],new Date().getTime()+".jpg",{type:fileType});
                        }
                        var result = {
                            success:true,
                            files:[{
                                base64:base64Data,//图片的base64字符串
                                filepath:fileData.name,
                                fileSize:fileSize,
                                type:fileType,
                                fileData:fileData
                            }]
                        };
                        _.dialog.loading(false);
                        options.success(result);
                    }else {
                        _.dialog.loading(false);
                    }
                };
                dataURLReader.onabort = function() {
                    _.dialog.loading(false);
                    if (options.error && typeof options.error == "function") {
                        options.error();
                    }
                };
                dataURLReader.onerror = function() {
                    _.dialog.loading(false);
                    if (options.error && typeof options.error == "function") {
                        options.error();
                    }
                };
                dataURLReader.onprogress = function(){
                    _.dialog.loading(_.i18n("cmp.camera.imgLoading"));
                };

            }
        }
    }

    function _turnOnCameraPermission(errorCode){
        var errorMsg = _.i18n("cmp.camera.cameraPermissionTips");
        if(errorCode == 56002){
            errorMsg = _.i18n("cmp.camera.photoPermissionTips");
        }
        _.notification.confirm(errorMsg, function (index) {
            if (index == 0) {
                return;
            } else if (index == 1) {
                cordova.exec(
                    function () {
                    },
                    function () {
                    },
                    "CMPSettingPlugin",
                    "enterSetting",
                    []
                );
            }
        }, "", [_.i18n("cmp.camera.cancel"), _.i18n("cmp.camera.toSet")]);//"取消","去设置"
    }
    function _getPictureByH5(options){
        var cameraBtnID = _.buildUUID();
        var cameraBtnHtml = '<input type="file" ';
        if (options.sourceType && options.sourceType == _.camera.PictureSourceType.CAMERA) {
            cameraBtnHtml += 'capture="camera" ';
        }
        cameraBtnHtml += ' accept="image/*" style="opacity:0;" id="' + cameraBtnID + '">';
        _.append(document.body, cameraBtnHtml);
        var cameraBtn = document.getElementById(cameraBtnID);
        cameraBtn.addEventListener("change", function() {
            if(this.files.length>1){
                _.notification.alert(_.i18n("cmp.camera.picNumLimit"), null, "");
                return;
            }
            var file = this.files[0];
            setTimeout(function(){//为了避免一些低性能手机，照完相后原生和H5同时处理导致程序崩溃，进行一个异步操作
                _handleHTMLImgData(file, options);
            },300);
            cameraBtn.remove();
            document.removeEventListener("visibilitychange",_checkFileControlUseState,false);
        });
        var _checkFileControlUseState = function(){//由于Android端不能选择Sd卡的文件，所以进行确认操作
            if(document.visibilityState == "visible"){
                _.storage.delete("cmpwechatdownloadfile",true);
                setTimeout(function(){
                    if(cameraBtn.files.length == 0){
                        cameraBtn.remove();
                        document.removeEventListener("visibilitychange",_checkFileControlUseState,false);
                        if(typeof options.error == "function"){
                            options.error({
                                code:56007,
                                message:_.i18n("cmp.camera.errorMsgChooseFileFail")
                            });
                        }
                    }
                },400);
            }
        };
        if(_.os.android){//android才适配选sd卡的问题
            // _.storage.save("cmpwechatdownloadfile","cmpwechatdownloadfile",true);//现在微信端又优化回来了，暂时注释掉这个防护CAPF-13849
            document.addEventListener("visibilitychange",_checkFileControlUseState,false);
        }
        cameraBtn.click();
    }
    //=======================================================================拍照录像组件 end=======================//


})(cmp);

