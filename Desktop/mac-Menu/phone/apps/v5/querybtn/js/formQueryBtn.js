(function(factory){
    var nameSpace = 'field_5902128098173592526';
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
    	dynamicLoading.css("/seeyon/m3/apps/v5/querybtn" + '/css/formQueryBtnMb.css');
    	dynamicLoading.js("/seeyon/m3/apps/v5/cap4" + '/cap4_m_api.s3js');
        var Builder = factory();
        window[nameSpace] = {
            instance: {}
        };
        window[nameSpace].init = function (options) {
            window[nameSpace].instance[options.privateId] = new Builder(options);
        };
        window[nameSpace].isNotNull = function (obj) {
            return true;
        };
        window[nameSpace].destroy = function (privateId){
        	var instance = window[nameSpace].instance[privateId];
        	if(instance){
        		instance.destroy();
        		instance = null;
        	}
        };
    }
})(function(){
    /**
	 * 构造函数
     * @param options
     * @constructor
     */
	function App(options) {
		var self = this;
		//初始化参数
		self.initParams(options);
		//初始化dom
		self.initDom();
		//事件
		self.events();
    }
    
    App.prototype = {
		initParams : function (options) {
			var self = this;
            self.adaptation = options.adaptation;
            self.privateId = options.privateId;
            self.messageObj = options.getData;
            self.preUrl = options.url_prefix;
            
            self.isSourceForm = !self.messageObj.formdata.rawData.viewInfo.viewContent.skin;
        },
		initDom : function () {
			var self = this;
            self.appendChildDom();
        },
		events : function () {
			var self = this;
			
            // 监听是否数据刷新
            self.adaptation.ObserverEvent.listen('Event' + self.privateId, function() {
                self.messageObj = self.adaptation.childrenGetData(self.privateId);
                self.appendChildDom();
            });
        },
        appendChildDom : function () {
        	var self = this;
        	self.container = document.querySelector('#' + self.privateId);
        	self.cmpContainer = cmp("#" + self.privateId);
        	
			var fieldStyle = self.messageObj.extra;
			
			var domStructure = '<div class="customButton_box" style = "background:' + fieldStyle.fieldBg + ';border-bottom: ' + fieldStyle.fieldLine + '"><section class="customButton_box_content">' +
				'<div class="customButton_class_box ' + self.privateId + '">' + self.messageObj.display.escapeHTML() + '</div>' +
				'</section></div>';
			self.container.innerHTML = domStructure;
	
			self.cmpContainer.off('tap','.customButton_class_box').on('tap','.customButton_class_box',function() {
				if(self.messageObj.auth === 'hide' || !self.messageObj.customFieldInfo.customParam) {
					return;
				}
				var designId,designType;
				designId = self.messageObj.customFieldInfo.customParam.templateId.designId;
				designType = self.messageObj.customFieldInfo.customParam.templateId.designType;
				
				var content = self.messageObj.formdata.rawData.content || {};
				var formId = content.contentTemplateId;
				var fieldName = self.messageObj.id;
				var formDataId = content.contentDataId;
				var formSubDataId = self.messageObj.recordId ? self.messageObj.recordId : '';
	
				cmp.dialog.loading('加载中...');
				self.adaptation.backCallApi('presave', function() {
					self.dealCdtMapping({
						formId: formId,
						fieldName: fieldName,
						formDataId: formDataId,
						formSubDataId: formSubDataId,
						designId: designId,
						callback: function() {
							cmp.dialog.loading(false);
							cmp.event.trigger("beforepageredirect",document);
							cap4Api.openFormQueryReport({
								type : designType == "QUERY" ? 4 : 3,
								appId : designId
							});
						}
					});
				},{
					privateId : self.privateId,
					validation: { 
				      needCheckRule: '0', // 数据校验 
				      needDataUnique: '0', // 数据唯一性校验 
				      needSn: '0' // 流水号 
				    }
				});
			});
            //渲染隐藏权限
            if (self.messageObj.auth === 'hide') {
            	if(self.isSourceForm){
            		self.container.querySelector('.customButton_box').style.padding = "0";
            		self.container.querySelector('.customButton_box').innerHTML = '<div class="cap4-text__browse" style="line-height: 1.8; color: rgb(0, 0, 0) !important;">***</div>';
            	}else{
            		self.container.querySelector('.customButton_box').style.display = 'none';
            	}
            }
        },
        dealCdtMapping : function (opt) {
			var header = {
				'Accept': 'application/json; charset=utf-8',
				'Accept-Language': navigator.language,
				'Content-Type': 'application/json; charset=utf-8',
				'token': cmp.token ? cmp.token : '',
				'option.n_a_s': '1'
			}
			cmp.ajax({
				type: 'GET',
				async: true,
				headers: header,
				url: cmp.seeyonbasepath + '/rest/cap4/formquerybtn/dealCdtMapping?formId=' + opt.formId + '&fieldName=' + opt.fieldName + '&formDataId=' + opt.formDataId + '&formSubDataId=' + opt.formSubDataId + '&designId=' + opt.designId,
				repeat: true,
				success: function(data) {
					if(opt.callback && typeof opt.callback === 'function')
						opt.callback.apply();
				},
				error: function(e) {
					cmp.dialog.loading(false);
					console.log(e);
					cmp.notification.alert(e.message);
				}
			});
    	},
    	destroy : function(){
    		var self = this;
    		self.adaptation.ObserverEvent.remove('Event' + self.privateId);
    		cmp("#" + self.privateId).off('tap','.customButton_class_box');
    	}
	};
    return App;
});
