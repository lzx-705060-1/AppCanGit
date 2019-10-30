(function (ctx,factory) {
    var nameSpace = 'field_7578843372267869145';
    var dynamicLoading = {
		css: function(path) {
			if(!path || path.length === 0) {
				throw new Error('argument "path" is required !');
			}
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.href = path;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			head.appendChild(link);
		},
		js: function(path) {
			if(!path || path.length === 0) {
				throw new Error('argument "path" is required !');
			}
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.src = path;
			script.type = 'text/javascript';
			head.appendChild(script);
		}
	}
    if(!window[nameSpace]){
    	dynamicLoading.css('/seeyon/m3/apps/v5/ocrbtn/css/ocrbtn.css');
        var Builder = factory(ctx,nameSpace);
        window[nameSpace] = {
            instance: {}
        };
        window[nameSpace].init = function (options) {
            window[nameSpace].instance[options.privateId] = new Builder(options);
        };
    }
})(cmp,function(cmp,domain){
    function App(options) {
        var self = this;
        //初始参数
        self.initParams(options);
        //原样表单
        if(self.isSourceForm){
        	//初始化原样表单dom
        	self.renderSourceForm();
        	//原样表单事件
        	self.sourceFormEvents();
        }else{
        	//初始DOM
	        self.initDom();
	        //事件
	        self.events();
        }
    }
    App.prototype.initParams = function (options) {
        var self = this;
        self.path = {
            cmp : '/seeyon/m3/cmp'
        }
        self.adaptation = options.adaptation;
        self.privateId = options.privateId;
        self.messageObj = options.getData;
        self.auth = self.messageObj.auth;
        self.isNotNull = self.messageObj.isNotNull;
        self.content = self.messageObj.formdata.rawData.content || {};
        self.attachmentInfo = self.messageObj.attachmentInfo;
        self.formId = self.content.contentTemplateId;
        self.fieldName = self.messageObj.id;
        self.formMessage = options.formMessage;
        self.formDataId = self.content.contentDataId;
        self.formSubDataId = self.messageObj.recordId;
        self.rightId = self.content.rightId;
        self.fieldDefine = self.messageObj.customFieldInfo.customParam.mapping;
        self.fieldStyle = self.messageObj.extra;
        
        self.isSourceForm = !self.messageObj.formdata.rawData.viewInfo.viewContent.skin;
    };
    App.prototype.initDom = function () {
        var self = this;
        self.container = document.querySelector('#' + self.privateId);
        var dom = '<section class="cap4-attach is-two section-ocr" style="background: ' + self.fieldStyle.fieldBg + '"><div class="cap4-attach__star"><i class="icon CAP cap-icon-bitian"></i></div><div class="cap4-attach__content" style="border-bottom: ' + self.fieldStyle.fieldLine + '"><div class="cap4-attach__left"><div class="cap4-attach__tt" style="color: ' + self.fieldStyle.fieldTitleDefaultColor + '">' + self.messageObj.display + '</div><div class="cap4-attach__placeholder" style="color: ' + self.fieldStyle.placeholderColor + ' !important;"></div></div><div class="cap4-attach__right"><div class="cap4-attach__real"><div class="cap4-attach__real--edit"><div class="cap4-attach__real--ret"></div></div></div></div><div class="cap4-attach__aicon"><i class="icon CAP cap-icon-credentials-recognition"></i></div></div></section>'
        self.container.innerHTML = dom;
        
        if(self.attachmentInfo.attachmentInfos.length !== 0){
        	var attachment = self.attachmentInfo.attachmentInfos[0];
            self.attachmentId = attachment.id;
            
	        var attContainer = self.container.querySelector('.cap4-attach__right .cap4-attach__real--ret');
	        var imgHtml = '<div class="cap4-attach__item" style="background: ' + self.fieldStyle.fileBg + '"><div class="cap4-attach__item--left"><i class="icon cmp-icon-document ' + getIconClass(attachment.filename) + '" style="color: rgb(47, 178, 102);"></i></div><div class="cap4-attach__item--center cmp-ellipsis" style="width: 100px"><div class="cap4-attach__itemUp" style="color: ' + self.fieldStyle.fieldValueDefaultColor + '">' + attachment.filename + '</div><div class="cap4-attach__itemDown" style="color: ' + self.fieldStyle.fieldValueDefaultColor + '">' + countAttSize(attachment.size) + '</div></div><div class="cap4-attach__item--right"><i class="icon CAP cap-icon-shanchu-X"></i></div></div>';
	        attContainer.innerHTML = imgHtml;
	        self.container.querySelector('.cap4-attach__aicon').style.display = 'none';
        }
        
        //渲染必填
        self.renderIsMust();
        
        //渲染隐藏
        if(self.auth === 'hide'){
            self.container.querySelector('.section-ocr').style.display = 'none';
        }
        
        if(self.auth === 'browse'){
        	if(self.container.querySelector('.cap-icon-shanchu-X'))
        		self.container.querySelector('.cap-icon-shanchu-X').style.display = 'none';
        	if(self.container.querySelector('.cap-icon-credentials-recognition'))
        		self.container.querySelector('.cap-icon-credentials-recognition').style.display = 'none';
        }
    };
    App.prototype.events = function () {
        var self = this;
       
        //上传附件图标点击
        cmp("#" + self.privateId).on('tap','.cap4-attach__aicon .cap-icon-credentials-recognition',function () {
            var initAtt = function () {
                cmp.dialog.actionSheet([{
                    key: 1,
                    name: '拍照'
                }, {
                    key: 2,
                    name: '本地图片'
                }], '取消', function (result) {
                    var type = '';
                    switch (result.key) {
                        case '1':
                            type = 'photo';
                            break;
                        case '2':
                            type = 'picture';
                            break;
                        default:
                            break;
                    }
                    cmp.att.suite({
                        type: type,
                        pictureNum: 1,
                        initDocData: null,
                        extData : {
                        	firstSave : 'true'
                        },
                        success: function (ret) {
                            self.uploadOcrCallback(ret);
                        }
                    });
                }, function () {});
            };
            if(cmp.att){
                initAtt();
            }else{
                var jsList = [];
                jsList.push(self.path.cmp + 'js/cmp-att.js');
                jsList.push(self.path.cmp + 'js/cmp-audio.js');
                jsList.push(self.path.cmp + 'js/cmp-camera.js');
                cmp.asyncLoad.js(jsList,function(){
                    initAtt();
                });
            }
        });
        //清除按钮
        cmp('#' + self.privateId).on('tap','.cap-icon-shanchu-X',function(){
        	self.container.querySelector('.cap4-attach__right .cap4-attach__real--ret').innerHTML = '';
        	self.container.querySelector('.cap4-attach__aicon').style.display = 'block';
        	//回填表单
        	/*
        	var renderFields = [];
            cmp.each(self.fieldDefine.subPropMapping,function (index,item) {
                var main = {},target = main[item.target] = {};
                target.showValue = '';
                target.showValue2 = '';
                target.value = '';
                renderFields.push(main);
            });
            self.renderFormData(renderFields);
            */
           
            //渲染必填
            self.renderIsMust();
           
            //删除附件
            var attData = {
                tableName : self.formMessage.tableName,
                tableCategory : self.formMessage.tableCategory,
                updateRecordId : self.formSubDataId,
                handlerMode : 'delete',
                fieldName : self.fieldName,
                deleteAttchmentData : [self.attachmentId]
            };
            self.adaptation.backfillFormAttachment(attData,self.privateId);
        });
        //附件查看
        cmp("#" + self.privateId).on('tap','.cap4-attach__item--left,.cap4-attach__item--center',function(){
        	var attachment = self.attachmentInfo.attachmentInfos[0];
        	var path = cmp.origin + "/rest/attachment/file/" + attachment.fileUrl;
			var fileName = attachment.filename;
	        var option={
	            path : path,
	            url : path,
	            filename : fileName,
	            extData:{
	                fileId: attachment.fileUrl,
	                lastModified: attachment.createdate,
	                isClearTrace: true
	            },
	            success: function(res){
	                cmp.dialog.loading(false);
	            },
	            error:function(err){
	                cmp.dialog.loading(false);
					cmp.notification.alert(cmp.toJSON(err));
	            }
	        }
            cmp.att.read(option);
        });
        
        //监听数据变化
        self.adaptation.ObserverEvent.listen('Event' + self.privateId, function () {
            self.messageObj = self.adaptation.childrenGetData(self.privateId);
            self.isNotNull = self.messageObj.isNotNull;
            self.auth = self.messageObj.auth;
            self.initDom();
        });
    };
    //附件上传完成后回调
    App.prototype.uploadOcrCallback = function (atts) {
    	var self = this;
        var attachment = atts.att[0];
        
        //渲染附件
        var attContainer = self.container.querySelector('.cap4-attach__right .cap4-attach__real--ret');
        var imgHtml = '<div class="cap4-attach__item"><div class="cap4-attach__item--left"><i class="icon cmp-icon-document ' + getIconClass(attachment.filename) + '" style="color: rgb(47, 178, 102);"></i></div><div class="cap4-attach__item--center cmp-ellipsis" style="width: 100px"><div class="cap4-attach__itemUp" style="color: ' + self.fieldStyle.fieldValueDefaultColor + '">' + attachment.filename + '</div><div class="cap4-attach__itemDown" style="color: ' + self.fieldStyle.fieldValueDefaultColor + '">' + countAttSize(attachment.size) + '</div></div><div class="cap4-attach__item--right"><i class="icon CAP cap-icon-shanchu-X"></i></div></div>';
        attContainer.innerHTML = imgHtml;
        self.container.querySelector('.cap4-attach__aicon').style.display = 'none';
        
        //上传附件
        attachment.reference = self.attachmentInfo.baseAttachmentInfo.reference;
        attachment.subReference = self.attachmentInfo.baseAttachmentInfo.subReference;
        var attData = {
            tableName : self.formMessage.tableName,
            tableCategory : self.formMessage.tableCategory,
            updateRecordId : self.formSubDataId,
            handlerMode : 'add',
            fieldName : self.fieldName,
            addAttchmentData : atts.att
        };
        self.attachmentId = attachment.id;
        self.adaptation.backfillFormAttachment(attData,self.privateId);
        
        //渲染必填
        self.renderIsMust();
        
        //调用后台rest处理结果
        var fileId = attachment.fileUrl;
        var header = {
            'Accept' : 'application/json; charset=utf-8',
            'Accept-Language' : navigator.language,
            'Content-Type': 'application/json; charset=utf-8',
            'token' : cmp.token ? cmp.token : '',
            'option.n_a_s' : '1'
        }
        cmp.dialog.loading('证照识别中...');
        cmp.ajax({
        	type: 'GET',
        	async : true,
        	headers: header,
            url: cmp.seeyonbasepath + '/rest/cap4/formOcrCtrl/recognition?formId=' + self.formId + '&fieldName=' + self.fieldName + '&fileId=' + fileId + '&formDataId=' + self.formDataId + '&formSubDataId=' + self.formSubDataId + '&rightId=' + self.rightId,
            repeat : true,
            success: function (data) {
                cmp.dialog.loading(false);
                var renderData = data.data;
                if(renderData)
                    self.renderFormData(renderData);
            },
            error: function (e) {
                cmp.dialog.loading(false);
                console.log(e);
                cmp.notification.alert(e.message);
            }
        });
    };
    /**
     * 回填表单
     * @param data
     */
    App.prototype.renderFormData = function (data) {
        var self = this;
        var lists = [];
        cmp.each(data,function (index,item) {
            var obj = {
                tableName : self.formMessage.tableName,
                tableCategory : self.formMessage.tableCategory,
                updateRecordId : self.formSubDataId,
                updateData : item
            };
            lists.push(obj);
        });
        self.adaptation.backfillFormControlData(lists,self.privateId);
    };
    
    /**
     * 刷新必填样式
     */
    App.prototype.renderIsMust = function () {
        var self = this;
        if(self.isNotNull === '1' && !self.container.querySelector(".cap4-attach__right .cap4-attach__real--ret").innerHTML){
            self.container.querySelector('section').classList.add('is-must');
            self.container.querySelector('.cap4-attach__placeholder').style.backgroundColor = self.fieldStyle.isNotNullBg;
        }else{
            self.container.querySelector('section').classList.remove('is-must');
        }
    };
    
    /**
     * 渲染原样表单
     */
    App.prototype.renderSourceForm = function(){
    	var self = this;
        self.container = document.querySelector('#' + self.privateId);
        
        var html = '<section class="cap4-images is-one section-ocr"><div class="cap4-images__left">' + self.messageObj.display + '</div><div class="cap4-images__right"><div class="cap4-images__cnt" style="min-height: 30px;"><div class="cap4-images__items"><div class="cap4-images__holder"></div></div><div class="cap4-images__picker upload ' + self.privateId + '"><div class="icon CAP cap-icon-credentials-recognition"></div></div></div></div></section>';
        self.container.innerHTML = html;
        
        if(self.attachmentInfo.attachmentInfos.length !== 0){
            var attachment = self.attachmentInfo.attachmentInfos[0];
            self.attachmentId = attachment.id;
            var imgDom = '<div class="cap4-images__it">' + attachment.filename + '<div class="cap4-images__close"><i class="icon CAP cap-icon-guanbi delete"></i></div></div>';
            var imgContainer = self.container.querySelector(".cap4-images__holder");
            imgContainer.innerHTML = imgDom;
            self.container.querySelector(".upload").style.display = 'none';
        }
        
        self.renderIsMust4SourceForm();
        
        //渲染隐藏
        if(self.auth === 'hide'){
            self.container.querySelector('.cap4-images__right').innerHTML = '<div class="cap4-text__browse" style="line-height: 1.8; color: rgb(0, 0, 0) !important;">***</div>';
        }
        
        //PC端不显示标题
        self.container.querySelector(".cap4-images__left").style.display = 'none';
        self.container.querySelector(".cap4-images__right").style.marginLeft = '0';
        
        if(self.auth === 'browse'){
        	if(self.container.querySelector(".cap4-images__cnt"))
            	self.container.querySelector(".cap4-images__cnt").style.border = 'none';
            if(self.container.querySelector(".cap4-images__cnt"))
            	self.container.querySelector(".cap4-images__cnt").style.background = 'none';
            if(self.container.querySelector(".upload"))
            	self.container.querySelector(".upload").style.display = 'none';
            if(self.container.querySelector(".cap4-images__close"))
            	self.container.querySelector(".cap4-images__close").style.display = 'none';
        }
    };
    
    /**
     * 渲染原样表单必填
     */
    App.prototype.renderIsMust4SourceForm = function(){
    	var self = this;
        if(self.isNotNull === '1' && self.auth !== 'browse' && !self.container.querySelector(".cap4-images__holder").innerHTML){
            self.container.querySelector('section').classList.add('is-must');
        }else{
            self.container.querySelector('section').classList.remove('is-must');
        }
    }
	/**
	 * 原样表单事件
	 */
	App.prototype.sourceFormEvents = function(){
		var self = this;
            
        //上传附件
        self.container.querySelector('.upload.' + self.privateId).addEventListener('tap',function(){
        	var initAtt = function () {
                cmp.dialog.actionSheet([{
                    key: 1,
                    name: '拍照'
                }, {
                    key: 2,
                    name: '本地图片'
                }], '取消', function (result) {
                    var type = '';
                    switch (result.key) {
                        case '1':
                            type = 'photo';
                            break;
                        case '2':
                            type = 'picture';
                            break;
                        default:
                            break;
                    }
                    cmp.att.suite({
                        type: type,
                        pictureNum: 1,
                        initDocData: null,
                        extData : {
                        	firstSave : 'true'
                        },
                        success: function (ret) {
                            self.uploadOcrCallback4SourceForm(ret);
                        }
                    });
                }, function () {});
            };
            if(cmp.att){
                initAtt();
            }else{
                var jsList = [];
                jsList.push(self.path.cmp + 'js/cmp-att.js');
                jsList.push(self.path.cmp + 'js/cmp-audio.js');
                jsList.push(self.path.cmp + 'js/cmp-camera.js');
                cmp.asyncLoad.js(jsList,function(){
                    initAtt();
                });
            }
        });
        
        //附件清除按钮
        cmp("#" + self.privateId).on('tap','.delete',function(){
            self.container.querySelector(".cap4-images__holder").innerHTML = '';
            self.container.querySelector(".upload").style.display = 'block';
            self.renderIsMust4SourceForm();
            //删除附件
            var attData = {
                tableName : self.formMessage.tableName,
                tableCategory : self.formMessage.tableCategory,
                updateRecordId : self.formSubDataId,
                handlerMode : 'delete',
                fieldName : self.fieldName,
                deleteAttchmentData : [self.attachmentId]
            };
            self.adaptation.backfillFormAttachment(attData,self.privateId);
        });
        
        //附件查看
        cmp("#" + self.privateId).on('tap','.cap4-images__it',function(){
        	var attachment = self.attachmentInfo.attachmentInfos[0];
        	var path = cmp.origin + "/rest/attachment/file/" + attachment.fileUrl;
			var fileName = attachment.filename;
	        var option={
	            path : path,
	            url : path,
	            filename : fileName,
	            extData:{
	                fileId: attachment.fileUrl,
	                lastModified: attachment.createdate,
	                isClearTrace: true
	            },
	            success: function(res){
	                cmp.dialog.loading(false);
	            },
	            error:function(err){
	                cmp.dialog.loading(false);
					cmp.notification.alert(cmp.toJSON(err));
	            }
	        }
            cmp.att.read(option);
        });
        
        //监听数据变化
        self.adaptation.ObserverEvent.listen('Event' + self.privateId, function () {
            self.messageObj = self.adaptation.childrenGetData(self.privateId);
            self.isNotNull = self.messageObj.isNotNull;
            self.auth = self.messageObj.auth;
            self.renderSourceForm();
        });
	}
	
	/**
	 * 原样表单附件上传回调
	 */
	App.prototype.uploadOcrCallback4SourceForm = function(atts){
		var self = this;
        var attachment = atts.att[0];
        
        var imgDom = '<div class="cap4-images__it">' + attachment.filename + '<div class="cap4-images__close"><i class="icon CAP cap-icon-guanbi delete"></i></div></div>';
        var imgContainer = self.container.querySelector(".cap4-images__holder");
        imgContainer.innerHTML = imgDom;
        self.container.querySelector(".upload").style.display = 'none';
        
        //渲染必填
        self.renderIsMust4SourceForm();
        
        //上传附件
        attachment.reference = self.attachmentInfo.baseAttachmentInfo.reference;
        attachment.subReference = self.attachmentInfo.baseAttachmentInfo.subReference;
        var attData = {
            tableName : self.formMessage.tableName,
            tableCategory : self.formMessage.tableCategory,
            updateRecordId : self.formSubDataId,
            handlerMode : 'add',
            fieldName : self.fieldName,
            addAttchmentData : atts.att
        };
        self.attachmentId = attachment.id;
        self.adaptation.backfillFormAttachment(attData,self.privateId);
        
        //调用后台rest处理结果
        var fileId = attachment.fileUrl;
        var header = {
            'Accept' : 'application/json; charset=utf-8',
            'Accept-Language' : navigator.language,
            'Content-Type': 'application/json; charset=utf-8',
            'token' : cmp.token ? cmp.token : '',
            'option.n_a_s' : '1'
        }
        cmp.dialog.loading('证照识别中...');
        cmp.ajax({
        	type: 'GET',
        	async : true,
        	headers: header,
            url: cmp.seeyonbasepath + '/rest/cap4/formOcrCtrl/recognition?formId=' + self.formId + '&fieldName=' + self.fieldName + '&fileId=' + fileId + '&formDataId=' + self.formDataId + '&formSubDataId=' + self.formSubDataId + '&rightId=' + self.rightId,
            repeat : true,
            success: function (data) {
                cmp.dialog.loading(false);
                var renderData = data.data;
                if(renderData)
                    self.renderFormData(renderData);
            },
            error: function (e) {
                cmp.dialog.loading(false);
                console.log(e);
                cmp.notification.alert(e.message);
            }
        });
	}
	var getIconClass = function(type){
		var className = "";
        type = type.substring(type.lastIndexOf(".") + 1);
        switch (type) {
            case "gif":
            case "jpg":
            case "jpeg":
            case "bmp":
            case "png":
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
	}
	var countAttSize = function (size) {
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
    return App;
});
