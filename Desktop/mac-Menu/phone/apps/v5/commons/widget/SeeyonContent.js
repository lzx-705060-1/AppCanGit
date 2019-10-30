var __m3_v5_commons_path__ = "/seeyon/m3/apps/v5/commons";
var __m3_v5_unflowform_path__ = "/seeyon/m3/apps/v5/unflowform";

/**
 * 
 * 正文组件
 * 
 * 组件依赖 IScroll 5.2.0
 * 
 * 
 * API
 * 
 * SeeyonContent.init(config) 初始化正文
 * SeeyonContent.getBodyCode(type) 通过正文类型获取正文code，例如传入HTML返回10
 * SeeyonContent.getBodyType(code) 通过正文code获取正文类型，例如传入10返回HTML
 * SeeyonContent.refresh(targetId) 如果初始化时外层容器宽度为0的时候， 正文组件不会进行宽高设置
 * SeeyonContent.clearCache() 清楚页面里所有正文组件的缓存
 * 
 * 
 * @author xuqw
 * 
 */
var SeeyonContent = (function($){

    
    /**
     * 继承
     */
    var extend = function(child, parent) {
        for ( var key in parent) {
            if (hasProp.call(parent, key))
                child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    hasProp = {}.hasOwnProperty,
    deviceDPI = [96, 96];
    

    function _getDPI() {
        if(deviceDPI == null){
            deviceDPI = new Array;
            if (window.screen.deviceXDPI) {
                deviceDPI[0] = window.screen.deviceXDPI;
                deviceDPI[1] = window.screen.deviceYDPI;
            } else {
                var tmpNode = document.createElement("DIV");
                tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
                document.body.appendChild(tmpNode);
                deviceDPI[0] = parseInt(tmpNode.offsetWidth);
                deviceDPI[1] = parseInt(tmpNode.offsetHeight);
                tmpNode.parentNode.removeChild(tmpNode);
            }
        }
        return deviceDPI;
    }
    
    function pt2px(ptValue) {
        //pt = px * dpi / 72
        var dpi = _getDPI();
        return ptValue * dpi[0] / 72;
     }
    
    function getEleTextIndent(ele){
        
        var textIndent = 0, ti, reg = /(-?\d+)(pt|px)/i;
        if(ele && ele.tagName.toLocaleLowerCase() !== "body"){
            ti = ele.style.textIndent;
            if(ti && (r = ti.match(reg))){
                textIndent = parseInt(r[1], 10);
                if(textIndent < 0){
                    ele.style.textIndent = "0px";
                    textIndent = 0;
                }else{
                    var u = (r[2]||"").toLocaleLowerCase();
                    if(u == "pt"){
                        textIndent = pt2px(textIndent);
                    }
                }
            }else{
                textIndent += getEleTextIndent(ele.parentNode);
            }
        }
        return textIndent;
    }
    
    function _getRuntimeStyle(obj, k) {
        var v = null;
        if (obj.currentStyle) {
            v = obj.currentStyle[k];
        } else {
            v = window.getComputedStyle(obj, null).getPropertyValue(k);
        }
        return v;
    }
    
    
    var App = (function() {
        
      function App() {
          
          this.config = {
                  "target" : null,//目标容器
                  "bodyType" : "",//正文类型，MainbodyType
                                    // HTML(10),FORM(20),TXT(30),OfficeWord(41),OfficeExcel(42),
                                    // WpsWord(43), WpsExcel(44),Pdf(45);
                  "subfix" : "",//后缀名
                  "lastModified" : "",//最后更新时间
                  "title" : "",//名称
                  "padding" : "10",//自定义边距
                  "content" : "",//正文内容/Office正文ID/表单ID
                  "moduleType" : "1",//模块，1 - 协同
                    
                  "canDownLoad" : true,// M3 IOS 端是否支持正文下载, 产品经理强烈要求加的，只支持IOS M3端，其他端无效果
                  "useZoom" : true,//是否使用缩放组件
                  "zoomType" : "iscroll",//缩放模式, 使用iscroll缩放, zoom使用zoom缩放
                  "momentum" : false,//是否使用惯性滑动
                  "zoomMin": 1,//最小缩放比例
                  "zoomMax": 5,//最大缩放比例
                  "ext" : {},//扩展参数，如表单有权限ID等等
                  "onScrollAuto" : false,//滚动到头和尾按照原生滚动
                  
                  "onload" : null, //加载完成后事件
                  "tapImg" : null,//图片点击事件， 只用于HTML正文
                  "onScrollBottom" : null,//{Function}滚动到底部
                  "onScrollTop" : null,//{Function} 滚动到头的时候触发
                  "onScrollLeft" : null,//{Function} 滚动到最左时触发
                  "onScrollRight" : null,//{Function} 滚动到最右时触发
                  "onScroll" : null,//{Function} function (top, directionY)滚动事件，   directionY : -1下拉， 1上拉, top 距离顶部的高度
                  "onScrollEnd" : null//滚动结束
              };
          
          //初始化的正文列表
          this.contents = {};
          
          //是否加载了国际化
          this.initI18N = false;
      }
      
      App.prototype.WORD_BODY_TYPES = {
              "10" : "HTML",
              "20" : "form",
              "30" : "txt",
              "41" : "doc",
              "42" : "xls",
              "43" : "wps",
              "44" : "et",
              "45" : "pdf"
          };
      
      App.prototype.BODY_TYPES = {
              "html" : "10",
              "form" : "20",
              "officeword" : "41",
              "doc" : "41",
              "docx" : "41",
              "officeexcel" : "42",
              "wpsword" : "43",
              "wps" : "43",
              "wpsexcel" : "44",
              "pdf" : "45"
          };
      
      /**
       * 打开关联文档或下载附件
       */
      App.prototype.openEditorAssociate = function(id,mimeType,description,reference,category,createDate,filename,v){
          
          var obj = {};
          obj.id = id;
          if(id && id != 'undefined'){
              obj.fileUrl = id;
          }
          obj.mimeType = mimeType;
          obj.description = description;
          obj.reference = reference;
          obj.category = category;
          obj.createDate = createDate;
          obj.filename = filename;
          obj.v = v;
          
          this.clickAtt(obj);
      }
      
      /**
       * 点击附件事件
       */
      App.prototype.clickAtt = function(att){
          
          /*if(cmp.system.filePermission()){*/
              SeeyonAttachment.openRelatedDoc({"att" : att});
          /*}else{
              var attTypeMsg = cmp.i18n("commons.file.downloadOrView");
              switch (att.mimeType) {
                case "collaboration":
                case "edoc":
                case "meeting":
                case "km":
                    attTypeMsg = cmp.i18n("commons.file.current.view");
                    cmp.notification.toast(cmp.i18n("commons.client.notSupport") + attTypeMsg, 'top', 1000);
                    break;
                default:
                    SeeyonAttachment.openRelatedDoc({"att" : att});
                    break;
                }
          }*/
      }
      
      /**
       * 合并配置信息
       */
      App.prototype._mergeConfig = function(userConfig){
          
          var newConfig = {}
          for(var key in this.config){
              if(userConfig && userConfig.hasOwnProperty(key)){
                  newConfig[key] = userConfig[key];
              }else{
                  newConfig[key] = this.config[key];
              }
          }
          return newConfig;
      }
      
      App.prototype.init = function(config){
          
          var content = this.instance(config["target"]);
          if(content){
              this.refresh(config["target"]);
          }else{
              var newConfig = this._mergeConfig(config);
              
              newConfig.bodyType = newConfig.bodyType + "";
              
              switch (newConfig.bodyType) {
                case "10":
                    content = new HTMLContent();
                    break;
                case "cap4-Forward":    
                	content = new FormContent();
                	break;
                case "20":
                    content = new FormContent();
                    break;
                case "20-Forward":
                    content = new ForwardFormContent();
                    break;
                case "41":
                case "42":
                case "43":
                case "44":
                case "45":
                    content = new OfficeContent();
                    break;
                case "99":
                    content = new EdocContent();
                    break;
                default:
                    /*$.notification.alert("未适配正文类型" + newConfig.bodyType);
                    return null;*/
                    content = new OfficeContent();
                    break;
                }
              content.init(newConfig, this);
              
              this.contents[newConfig["target"]] = content;
              
              return content;
          }
      }
      
      
      
      /**
       * 通过正文类型获取正文code
       */
      App.prototype.getBodyCode = function(type){
          return this.BODY_TYPES[type && type.toLocaleLowerCase()];
      }
      
      /**
       * 通过正文code获取正文type
       */
      App.prototype.getBodyType = function(code){
          return this.WORD_BODY_TYPES[code];
      }
      
      /**
       * 刷新正文组件
       */
      App.prototype.refresh = function(targetId){
          var _this = this;
          setTimeout(function(){
              _this.instance(targetId).refresh(false)
          }, 10);
      }
      
      App.prototype.reLayout = function(targetId){

          var _args, ins;
          _args = arguments;
          ins = this.instance(targetId); 
          if(ins){
              ins.reLayout.apply(ins, Array.prototype.slice.call(_args, 1));
          }
      }
      
      /**
       * 获取正文实例
       */
      App.prototype.instance = function(targetId){
          return this.contents[targetId];
      }
      
      /**
       * 清除缓存
       */
      App.prototype.clearCache = function(){
          for(var key in this.contents){
              this.contents[key].clearCache();
          }
      }
      
      return App;
    })();
    
    
    var Content = (function(){
        
       function Content(){
            this.config = null;
            this.app = null;
            this.outer = null;//外部容器
            
            this.pointSY = 0;
            this.pointY = 0;
            
            var dummyStyle = document.createElement('div').style,
                vendor = (function () {
                    var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                        t,
                        i = 0,
                        l = vendors.length;
    
                    for (; i < l; i++) {
                        t = vendors[i] + 'ransform';
                        if (t in dummyStyle) {
                            return vendors[i].substr(0, vendors[i].length - 1);
                        }
                    }
                    return false;
                })(),
                cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '';
                
          this.vendor = vendor;
          
          this.transform = this.prefixStyle('transform');
       }
       
       Content.prototype.prefixStyle = function(style) {
           if (this.vendor === '') return style;

           style = style.charAt(0).toUpperCase() + style.substr(1);
           return this.vendor + style;
       }
        
        /**
         * 初始化
         * 
         */
        Content.prototype.init = function(config, app){
            
            //业务参数
            var target = config.target;
            this.outer = document.querySelector("#" + target);
            
            if(this.outer == null){
                this.alert("cannot find document, id:" + target);
                return;
            }
            
            var _this = this;
            
            if(!app.initI18N){
                //加载国际化
                cmp.i18n.load(__m3_v5_commons_path__ + "/i18n/", "Commons", function(){
					app.initI18N = true;
                    _this._init_(config, app);
                });
            }else{
                this._init_(config, app);
            }
        }
        
        Content.prototype._init_ = function(config, app){
            
          //获取后缀名
            if(!config.subfix){
                var index = config.title.lastIndexOf(".");
                if(index != -1){
                    config.subfix = config.title.substring(index + 1);
                }
                
                if(!config.subfix){
                    config.subfix = app.getBodyType(config.bodyType)
                }
            }
            
            this.config = config;
            this.app = app;
            
            this.isDebug = false;
            
            //初始化正文
            this.initAttribute();
            this.initContent();
        }
        
        /**
         * 初始化属性
         */
        Content.prototype.initAttribute = function(){
            
        }
        
        /**
         * 销毁
         */
        Content.prototype.destroy = function(targetId){
            
        }
        
        /**
         * 刷新
         */
        Content.prototype.refresh = function(isInit){
            
        }
        
        /**
         * 清除缓存
         */
        Content.prototype.clearCache = function(){
            
        }
        
        /**
         * 重新布局
         */
        Content.prototype.reLayout = function(){
            
        }

        
        /**
         * 触发事件
         */
        Content.prototype.fire = function(event, data){
            
            switch (event) {
            case "load":
                
                //正文区域加载完成后事件
                if(this.config.onload){
                    this.config.onload.call(this);
                }
                break;
            case "scrollTop" :
                if(this.config.onScrollTop){
                    this.config.onScrollTop.call(this);
                }
                break;
            case "scrollBottom" :
                if(this.config.onScrollBottom){
                    this.config.onScrollBottom.call(this);
                }
                break;
            case "scrollLeft" :
                if(this.config.onScrollLeft){
                    this.config.onScrollLeft.call(this);
                }
                break;
            case "scrollRight" :
                if(this.config.onScrollRight){
                    this.config.onScrollRight.call(this);
                }
                break;
            case "scroll":
                
                //滚动事件
                if(this.config.onScroll){
                    var top = data.top,//影藏的区域的高度， 是一个负数
                        directionY = data.directionY;//方向: -1:手指向下滑动/1:手指向上滑动
                    this.config.onScroll.call(this, -top, directionY);
                }
                break;
            case "scrollEnd":
              //滚动事件
                if(this.config.onScrollEnd){
                    var top = data.top,//影藏的区域的高度， 是一个负数
                        directionY = data.directionY;//方向: -1:手指向下滑动/1:手指向上滑动
                    this.config.onScrollEnd.call(this, -top, directionY);
                }
                break;
            default:
                break;
            }
        }
        
        /**
         * 增加样式
         */
        Content.prototype._addClass = function(el, className){
            
            var eClass = el.classList;
            
            if(!eClass.contains(className)){
                eClass.add(className);
            }
        }
        
        /**
         * 原生滚动事件
         */
        Content.prototype._scroll = function(){
            
            var outerHeight = this.outer.scrollHeight,
                clientHeight = this.outer.clientHeight,
                scrollTop = this.outer.scrollTop;
            
            if(this.isDebug){
                console.log(outerHeight + "/" + clientHeight + "/" + scrollTop);
            }
            
            if(scrollTop == 0){
                this.fire("scrollTop");
            }else if(scrollTop + clientHeight == outerHeight){
                this.fire("scrollBottom");
            }
        }
        
        /**
         * 触摸开始事件
         */
        Content.prototype._touchstart = function(e){
            this.pointY = e.touches[0].pageY;
            this.pointSY = this.pointY;
        }
        
        /**
         * 触摸中间事件
         */
        Content.prototype._touchmove = function(e){
            
            var scrollTop = 0, directionY = 0, nowPointY = e.touches[0].pageY;
            
            scrollTop = this.outer.scrollTop;
            directionY = this.pointY - nowPointY;
            if(directionY != 0){
                directionY = directionY/Math.abs(directionY);
            }
            
            this.pointY = nowPointY;
            
            this.fire("scroll", {
                "top" : (-scrollTop),
                "directionY" : directionY
            });
        }
        
        /**
         * 触摸结束事件
         */
        Content.prototype._touchend = function(e){
            
            var scrollTop = 0, directionY = 0;
            
            scrollTop = this.outer.scrollTop;
            directionY = this.pointSY - this.pointY;
            if(directionY != 0){
                directionY = directionY/Math.abs(directionY);
            }
            
            this.fire("scrollEnd", {
                "top" : (-scrollTop),
                "directionY" : directionY
            });
            
            
            if(this.pointY > this.pointSY){
                if(this.outer.scrollHeight == this.outer.clientHeight){
                    this.fire("scrollTop");
                }else{
                    //ios滚动条到底不后还可以再拖动
                    if(scrollTop <= 0){
                        this.fire("scrollTop");
                    }
                }
            }else if(this.pointY < this.pointSY){
                //没有滚动条的情况
                if(this.outer.scrollHeight == this.outer.clientHeight){
                    this.fire("scrollBottom");
                }else{
                    var outerHeight = this.outer.scrollHeight,
                        clientHeight = this.outer.clientHeight,
                        scrollTop = this.outer.scrollTop;
                    //ios滚动条到底不后还可以再拖动
                    if(scrollTop + clientHeight >= outerHeight){
                        this.fire("scrollBottom");
                    }
                }
            }
        }
        
        
        /**
         * 提示框
         */
        Content.prototype.alert = function(msg, callback, title, btnName){

            if(!title){
                title = $.i18n("commons.label.note");//提示
            }
            if(!btnName){
                btnName = $.i18n("commons.label.ok");//确定
            }
            $.notification.alert(msg, callback, title, btnName);
        }
        
        return Content;
    })(); 
    
    
    /**
     * 表单正文
     */
    var FormContent = (function(superClass){
        
        extend(FormContent, superClass);
        
        function FormContent(){
            return FormContent.__super__.constructor.apply(this, arguments);
        }
        
        /**
         * 初始化正文
         */
        FormContent.prototype.initContent = function(){
            
            this.reachTop = true;
            this.reachBottom = false;
            this.reachLeft = true;
            this.reachRight = false;
            this.options = null;//表单配置信息
            this.hasListener = false;
            this.viewIndex = this.config.ext.indexParam || "0";
            this.isLoading = false;
            this.isSubmiting = false;
            this.lastTapTime = 0;
            
            //业务参数
            var _this = this;
            
            if (typeof this.config.ext.isLightForm === "undefined"){
                //默认为轻表单
                this.config.ext.isLightForm = true;
            }
            
            /*this._addClass(this.outer, "content_ios_scroll"); */
            this.outer.addEventListener("tap", this);
            /*
             * 这个有问题，直接导致 表单字段不能聚焦
             * cmp.event.click(this.outer, function(e){
                var selfEv = {
                    "type" : "tap",
                    "target" : e.target
                }
                _this.handleEvent(selfEv);
            });*/
            
            this.loadForm(this.viewIndex, {
                    callback:function(contentList){
                        if(_this.config.ext.showFormView && typeof _this.config.ext.showFormView == 'function'){
                            _this.config.ext.showFormView(contentList);
                        }
                        //_this.fire("load");
                    },
                    loadCallback : function(){
                        _this.fire("load");
                    },
                    isInit : true
                }
            )
            
          //重新渲染
            var _this = this;
            document.addEventListener('refreshWebView', function(e){ 
                $.sui.refreshWhenWebViewShow(_this.options, function(){
                    //console.log("refreshWebView - 刷新表单成功...");
                });
            });
        }
        
        /**
         * 清除缓存
         */
        FormContent.prototype.clearCache = function(){
            
            if(this.options != null){
                $.sui.clearCache(this.options);
            }
        }
        
        /**
         * 重新布局
         */
        FormContent.prototype.reLayout = function(height){
            if(this.options != null && $.sui.refreshIScroll){
                $.sui.refreshIScroll();
            }
        }
        
        /**
         * 加载表单视图
         */
        FormContent.prototype.loadForm = function(index, moreParam){
          
            if(this.isLoading){
                //console.log("暴击...");
                return;
            }
            this.isLoading = true;
            
            //开始转圈
            cmp.dialog.loading();
            
            moreParam = moreParam || {};
            
            var _this = this,
                callback = moreParam.callback,
                containerId = this.config.target,
                loadCallback = moreParam.loadCallback,
                isInit = moreParam.isInit;
            
            var isLightForm = _this.config.ext.isLightForm;
            if(typeof moreParam.isLightForm == "boolean"){
                isLightForm = !!moreParam.isLightForm;
            }
            
            function _doLoadForm(){
                
                if(typeof index === "string"){
                    index = parseInt(index, 10);
                }
                
                _this.config.ext.isLightForm = isLightForm;
                
              //表单
                var options = {
                    containerId: containerId, //渲染的div根节点id
                    moduleId: _this.config.content,
                    moduleType: _this.config.moduleType,
                    rightId: _this.config.ext.rightId,
                    viewState: _this.config.ext.viewState,
                    allowQRScan : _this.config.ext.allowQRScan,
                    indexParam : _this.viewIndex,
                    affairId : _this.config.ext.affairId || "-1"
                }
                
                //CAP4适配
                options.operateType = options.viewState;
                
                if(_this.config.ext.summaryId){
                    options.summaryId = _this.config.ext.summaryId;
                }
                
                //CAP4表单, 视图切换进行托管
                if(_this.config.ext.isCAP4 === true
                        && _this.config.ext.onChangeViewEvent){
                    options.onChangeViewEvent = _this.config.ext.onChangeViewEvent;
                }
                
                _this.options = options;
                
                if(callback){
                    options.callback = callback;
                }
                
                if(_this.config.ext.isLightForm){
                    
                    options.templateType = "lightForm";
                    
                    if(_this.config.ext.isCAP4 === true){
                        
                        if(_this.config.onScroll){
                            options.onScroll = _this.config.onScroll;
                        }
                    }
                    
                    function _loadFormCallback(){
                        
                        _this.isLoading = false;
                        cmp.dialog.loading(false);
                        
                        if(loadCallback){
                            loadCallback();
                        }
                    }
                    
                    if(_this.config.ext.isCAP4 === true){
                        cmp.sui.ready(function(){
                            $.sui.loadForm(options, _loadFormCallback);
                        });
                    }else{
                        $.sui.loadForm(options, _loadFormCallback);
                    }
                    
                 // CAP4 自己实现滚动
                    if(_this.config.ext.isCAP4 !== true){
                        if(!_this.hasListener){
                            _this.outer.style.overflow = "auto";
                            _this._listener();
                            _this.hasListener = true;
                        }
                    }
                }else{
                    
                    if(_this.config.onScrollBottom){
                        options.onScrollBottom = _this.config.onScrollBottom;
                    }
                    
                    if(_this.config.onScroll){
                        options.onScroll = _this.config.onScroll;
                    }
                    
                    options.templateType = "infopath";
                    
                    function _loadFormCallback(){
                        _this.isLoading = false;
                        cmp.dialog.loading(false);
                        
                        if(loadCallback){
                            loadCallback();
                        }
                    }
                    if(_this.config.ext.isCAP4 === true){
                        cmp.sui.ready(function(){
                            $.sui.loadForm(options, _loadFormCallback);
                        });
                    }else{
                        $.sui.loadForm(options, _loadFormCallback);
                    }
                    
                    // CAP4 自己实现滚动
                    if(_this.config.ext.isCAP4 !== true){
                        
                        if(_this.hasListener){
                            _this.outer.style.overflow = "hidden";
                            _this.destroy();
                            _this.hasListener = false;
                        }
                    }
                }
            }
            
            var switchFormType = this.viewIndex == index;
            var needSubmit = _this.config.ext.viewState != "2" 
                                 && !switchFormType
                                 && (this.viewIndex == "0" && isInit !== true);
            //更新视图
            this.viewIndex = index;
            
            if(needSubmit){
                var submitSource = "pc";
                if(_this.config.ext.isLightForm === true){
                    submitSource = "mobile";
                }
                
                $.sui.submit( { 
                    moduleId:_this.config.content,
                    needCheckRule : false,
                    notSaveDB:true,
                    rightId:_this.config.ext.rightId,
                    needSn : false,
                    submitSource : submitSource//预提交， 直接是手机端
                },function(err,data){
                    if(err){
                        _this.isLoading = false;
                        cmp.dialog.loading(false);
                        
                        //页面有错误提示， 这里不再进行提示
                        //$.notification.toast(err.message,"center");
                    }else {
                        LazyUtil.addLoadedFn("lazy_form", _doLoadForm);
                    }
                });
            }else{
                //轻原表单切换
                if(isInit !== true && switchFormType){
                    $.sui.cacheFormData(function(){
                        LazyUtil.addLoadedFn("lazy_form", _doLoadForm);
                    });
                }else{
                    LazyUtil.addLoadedFn("lazy_form", _doLoadForm);
                }
            }
        }
        
        FormContent.prototype._tap = function(e){
            
            var nowTime = new Date().getTime();
            
            //ios会执行两次
            if(nowTime - this.lastTapTime < 1000){
                this.lastTapTime = nowTime;
                return;
            }
            this.lastTapTime = nowTime;
            
            var srcEle = e.target;
            
            // 附件
            if(srcEle.classList.contains("allow-click-attachment")){
                var attData = srcEle.getAttribute("see-att-data");
                SeeyonContent.clickAtt($.parseJSON(attData));
            }else if(srcEle.classList.contains("allow-click-relationform")){
                
              // 关联表单
                var relData = srcEle.getAttribute("see-att-data");
                relData = $.parseJSON(relData);
                
                if(relData.formType == "1"){
                    // 流程表单
                    var paramData = {
                            'openFrom' : "formRelation",
                            'summaryId' : relData.dataId,
                            'operationId' : relData.rightId || "",
                    };
                    
                    //人间处处是坑， PC就是这样坑的~~
                    if(window.summaryBO && summaryBO.summary){
                        paramData.baseObjectId = summaryBO.summary.id;
                        paramData.baseApp = "1";
                    }
                    
                    
                    //触发页面数据缓存
                    $.event.trigger("beforepageredirect",document);
                    
                    $.href.next(window._collPath + "/html/details/summary.html?_rand="+ new Date().getTime(), paramData);
                }else{
                    
                    //无流程表单
                    var paramData = {
                            moduleId : relData.dataId,
                            name :relData.title,
                            rightId : relData.rightId,
                            viewState : "2"
                    };
                    
                    var recordInfo = relData.record;
                    if(recordInfo){
                        recordInfo = $.parseJSON(recordInfo);
                        paramData.moduleType = recordInfo.formType;
                    }
                    $.openUnflowFormData(paramData);
                }
                
            }else if(srcEle.classList.contains("sui-input-url")){
                
                //连接
                var aHref = srcEle.getAttribute("url");
                if(aHref){
                    // 普通连接，直接弹出查看
                    if($.platform.CMPShell){
                        var tTitle = srcEle.innerText || $.i18n("commons.label.link");// 连接
                        $.href.open(aHref, tTitle);
                    }else{
                        $.notification.toast($.i18n("commons.note.notsuport1"), 'top', 1000);// 微信端暂不支持超链接跳转!
                    }
                }
                
            }else if(srcEle.tagName.toLocaleLowerCase() === "img"){
                
                if($.platform.CMPShell){
                    //图片
                    var path = srcEle.getAttribute("url"),
                    filename = srcEle.getAttribute('filename') || '' ;
                    var fileId = srcEle.getAttribute('fileid');
                    if(!fileId){
                    	//表单意见里面签名图片不支持打开
						return;
                    }
                    cmp.dialog.loading();
                    $.att.read({
                        filename: filename,
                        path: path, // 文件路径
                        extData:{
                            fileId:fileId,
                            lastModified:"1"
                        },
                        success: function(res){
                            cmp.dialog.loading(false);
                        },
                        error:function(err){
                            cmp.dialog.loading(false);
                            this.alert($.i18n("commons.note.readpicerror", [err]));//读取图片失败, 请稍重试.错误信息:
                        }
                    });
                }else{
                    $.notification.toast($.i18n("commons.note.notsuport2"), 'top', 1000);//微信端暂不支持图片查看!
                }
            }
        }
        
        /**
         * 添加监听
         */
        FormContent.prototype._listener = function(e){
            if(this.config.onScrollBottom
                    || this.config.scrollEnd
                    || this.config.onScroll){
                this.outer.addEventListener("touchstart", this);
                this.outer.addEventListener("touchmove", this);
                this.outer.addEventListener("touchend", this);
            }
        }
        
        /**
         * 销毁
         */
        FormContent.prototype.destroy = function(e){
            if(this.config.onScrollBottom
                    || this.config.scrollEnd
                    || this.config.onScroll){
                this.outer.removeEventListener("touchstart", this);
                this.outer.removeEventListener("touchmove", this);
                this.outer.removeEventListener("touchend", this);
            }
        }

        
        FormContent.prototype.handleEvent = function(e){
            switch (e.type) {
            case 'scroll':
                this._scroll(e);
                break;
            case 'touchstart':
                this._touchstart(e);
                break;
            case 'touchmove':
                this._touchmove(e);
                break;
            case 'touchend':
                this._touchend(e);
                break;
            case 'tap':
                this._tap(e);
                break;
            default:
                break;
            }
        }
        
        return FormContent;
    })(Content);
    
    /**
     * HTML正文
     */
    var HTMLContent = (function(superClass) {
        
        extend(HTMLContent, superClass);

        function HTMLContent() {
          return HTMLContent.__super__.constructor.apply(this, arguments);
        }
        
        
        /**
         * 初始化HTML正文
         */
        HTMLContent.prototype.initContent = function(){
            
            this.inner = null;// 正文区域，动态创建的
            this.imgCounts = 0;
            this.imgGroupKey = "";// 正文区域图片组key
            this.imgSrcs = [];
            this.tableLastTap = 0; 
            this.tableLastIndex = -1;
            this.imgLastTap = 0; 
            this.imgLastIndex = -1;
            this.loadAllImg = false;// 所有图片是否已经加载完成
            this.exeLoadAllImg = false;//是否执行了图片全部加载完成后的事件
            this.hasTable = false;

            this.iScroll = null;// iScoll对象
            this.isZoom = false;// 是否可以缩放
            this.reachTop = true;
            this.reachBottom = false;
            this.reachLeft = true;
            this.reachRight = false;
            this.scrollBeginTime = 0;// 滚动开始时间点
            this.scrollStartY = 0;
            this.startAtBottom = false;// 上拉时本身在底部
            
            
            this.outerWidth = 0;// 外层数据宽度
            this.innerWidth = 0;// 内层数据宽度
            this.innerHeight = 0;// 内层数据高度
            
            this.scaleWidth = 710;// 缩放临界点
            
            this.imgGroupKey = this.config.target + "_imgs";
            this._addClass(this.outer, "content-widget");
            
            this.inner = document.createElement("DIV");
            this.inner.innerHTML = this._preReplace(this.config.content);
            this._addClass(this.inner, "ct-inner-container");
            
            this.outer.appendChild(this.inner);
            
            /**
             * 加载图片
             */
            if(this.imgCounts > 0){
                SeeyonImgReady.load(this.imgGroupKey); 
            }else{
                this.initImgs = true;
                this.loadAllImg = true;
            }
            
            // 释放正文内容内存
            this.config.content = null;
            
            // 刷新正文内容，计算高度宽度等
            this.refresh(true);
            
            // 添加点击事件
            this._listenTap();
            
            // 触发加载完成
            this.fire("load");
        }
        
        /**
         * 监听点击事件， 处理附件
         */
        HTMLContent.prototype._listenTap = function(){
            
            var _this = this;
            this.inner.addEventListener("tap", function(e){
                
                var srcEle = e.target, tagName = srcEle.tagName.toLocaleLowerCase();
                if(tagName === "a"){
                    
                    _this._tapA(srcEle);
                    
                }else if(tagName === "img"){
                    if(typeof _this.config.tapImg === "function"){
                        _this.config.tapImg.call(srcEle, e);
                    }else if($.sliders){
                        
                        var i = srcEle.getAttribute("_imgIndex");
                        if(i){
                            i = parseInt(i, 10);
                        }else{
                            i = 0;
                        }
                        
                        var nowDate = new Date().getTime();
                        
                        if(_this.imgLastIndex == i && nowDate - _this.imgLastTap < 300){
                            $.sliders.addNew(_this.imgSrcs);
                            $.sliders.detect(i);
                        }
                        _this.imgLastIndex = i;
                        _this.imgLastTap = nowDate; 
                    }
                }else{
                    //a标签下面还有内容
                    var path = e.path || (e.composedPath && e.composedPath());
                    if (path) {
                        for(var i = 0, len = path.length; i < len; i++){
                            var nTag = path[i];
                            if(nTag.getAttribute("id") == _this.config.target){
                                break;
                            }else{
                                var tagName = nTag.tagName.toLocaleLowerCase();
                                if(tagName === "a"){
                                    _this._tapA(nTag);
                                    break;
                                }else if(tagName === "table" && nTag.getAttribute("_scaleTable") === "true"){
                                    
                                    var tIndex = nTag.getAttribute("_scaleTableIndex"), nowDate = new Date().getTime();
                                    
                                    if(_this.tableLastIndex == tIndex && nowDate - _this.tableLastTap < 300){
                                        
                                        var newT = nTag.cloneNode(true);
                                        newT.style.webkitTransform="";
                                        newT.style.transform ="";
                                        
                                        new HTMLViewer({
                                            type : "html",
                                            html : newT
                                        });
                                    }
                                    _this.tableLastIndex = tIndex;
                                    _this.tableLastTap = nowDate; 
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        /**
         * 点击A标签
         * @param aTag
         */
        HTMLContent.prototype._tapA = function(aTag){
      
            var _this = this, aHref = aTag.getAttribute("href");
            if(aHref){
                if(aHref.indexOf("openEditorAssociate") != -1){
                    // 附件类型
                    var attReg = /openEditorAssociate\((.*)\)/ig,
                        m = attReg.exec(aHref),
                        args = null;
                    if(m != null){
                        args = (new Function("return " + ("[" + m[1] + "]")))();
                        SeeyonContent.openEditorAssociate(args[0], 
                                args[1],
                                args[2],
                                args[3] || _this.config.ext.reference,
                                args[4] || _this.config.moduleType,
                                args[5],
                                args[6],
                                args[7]);
                    }
                }else{
                    // 普通连接，直接弹出查看
                    if($.platform.CMPShell){
                        var tTitle = aTag.innerText || $.i18n("commons.label.link");// 连接
                        $.href.open(aHref, tTitle);
                    }else{
                        $.notification.toast($.i18n("commons.note.notsuport1"), 'top', 1000);// 微信端暂不支持超链接跳转!
                    }
                }
            }
        }
        
        /**
         * 对HTML正文进行预处理
         */
        HTMLContent.prototype._preReplace = function(html){
            
            var _this = this,
                flushNote = '<p style="color:red">'+ $.i18n("commons.note.flashnotsuport")/* 该处为flash，暂不支持查看！ */+'</p>';
            
            //替换恶心的margin负值
            var marginPaddingReg = /(?:margin|padding)[^;]*?:-\d+\.?(?:\d+)?(?:px|pt|cm)/ig;
            
            // flush替换
            html = html.replace(/<[^<]*?class=FCK__Flash[^<]*?>/ig, flushNote);
            html = html.replace(/<embed[^<]*?(\/>|><\/embed>|>)/ig, flushNote);
            
            /*this.hasTable = html.indexOf("<table ") != -1;*/
            
          // 图片进行预加载处理
            if(this.config.useZoom){
                
                var imgReg = /<img [^<]*?(?=\/>|><\/img>|>)/ig, 
                    srcReg = / src[ ]*?=[ ]*?["']([^>]+?)["']/i,
                    styleReg = / style[ ]*?=[ ]*?[^>]+?["']/i,
                    idReg = / id[ ]*?=[ ]*?[^>]+?["']/i,
                    newHtml = html;
                
                var ret, imgArray = [];
                while((ret = imgReg.exec(html))!=null) { 
                    var imgStr = ret[0], 
                        imgSrc = srcReg.exec(imgStr),
                        imgStyle = styleReg.exec(imgStr),
                        imgId = idReg.exec(imgStr);
                    
                    if(imgSrc){
                        
                        var newImgSrc = imgSrc[1].replace(/&amp;/g, "&");
                        if($.platform.CMPShell && newImgSrc.indexOf("/seeyon") == 0){
                            // cmp壳需要进行路径替换
                            newImgSrc = $.origin + newImgSrc.substring(7);
                        }
                        this.imgSrcs.push(newImgSrc);
                        
                        imgSrc = imgSrc[0];
                        imgStr = imgStr.replace(imgSrc, "");
                        
                        if(imgId){
                            imgStr = imgStr.replace(imgId[0], "");
                        }
                        
                        var styleAtt = null, srcStyleWidth = "0", srcStyleHeight = "0";
                        
                        if(imgStyle){
                            imgStyle = imgStyle[0];
                            var styleCssReg = /([ ;"'])(width|height|display)[ ]*?:[ ]*?([^;"']+)/ig;
                            //提取原始的宽度和高度设置
                            while((styleAtt = styleCssReg.exec(imgStyle))!=null){
                                if(styleAtt[2].toLocaleLowerCase() == "width"){
                                    srcStyleWidth = styleAtt[3];
                                }else if(styleAtt[2].toLocaleLowerCase() == "height"){
                                    srcStyleHeight = styleAtt[3];
                                }
                            }
                            var newImgStyle = imgStyle.replace(styleCssReg, "$1");
                            
                            newImgStyle = newImgStyle.substring(0, newImgStyle.length - 1) 
                            + ";display:none;" 
                            + newImgStyle.charAt(newImgStyle.length - 1);
                            imgStr = imgStr.replace(imgStyle, newImgStyle);
                        }else{
                            imgStr += '  style="display:none"';
                        }
                        
                        var newImgId = this.imgGroupKey + "_" + this.imgCounts;
                        
                        
                        imgStr = "<span srcStyleWidth='" + srcStyleWidth + "' srcStyleHeight='" + srcStyleHeight + "' id='"+ newImgId +"_span' >"+ $.i18n("commons.label.loading")/* 图片加载中... */+"</span>"
                                + imgStr + ' _imgIndex="' + this.imgCounts + '" id="' + newImgId + '"';
            
                        // 创建预加载对象
                        SeeyonImgReady.addImg(this.imgGroupKey, {
                            "src" : newImgSrc,
                            "load" : function(imgObj, loadAll){
                                _this._onImgLoad(imgObj, loadAll)
                            },
                            "error" : function(imgObj, loadAll){
                                _this._onImgLoad(imgObj, loadAll)
                            },
                            "newImgId" : newImgId
                        });
                        
                        // 只替换一个
                        newHtml = newHtml.replace(ret[0], imgStr);
                        
                        this.imgCounts++;
                    }
                }
                
                return newHtml.replace(marginPaddingReg, "");
            }else{
                if($.platform.CMPShell){
                    // cmp壳需要进行路径替换
                    html = html.replace(/(<img[^<]*?src=)(["'])\/seeyon([^<]*?)\2/ig, "$1$2" + $.origin + "$3$2")
                }
                
                return html.replace(marginPaddingReg, "");
            }
        }
        
        /**
         * 图片加载完成后执行方法
         */
        HTMLContent.prototype._onImgLoad = function(imgObj, loadAll){
            
            this.loadAllImg = loadAll;
            
            if(this.outerWidth > 0 && !imgObj.__initDom){
                
                // 标记已经初始化了
                imgObj.__initDom = true;
                
                var iSpan = document.getElementById(imgObj.config.newImgId + "_span"),
                    img = document.getElementById(imgObj.config.newImgId),
                    imgH = imgObj.height,
                    imgW = imgObj.width;
        
                iSpan.remove();
                
                
                var srcStyleWidth = "0", srcStyleHeight = "0";
                srcStyleWidth = iSpan.getAttribute("srcStyleWidth");
                srcStyleHeight = iSpan.getAttribute("srcStyleHeight");
                
                srcStyleWidth = srcStyleWidth || img.getAttribute("width");
                srcStyleHeight = srcStyleHeight || img.getAttribute("height");
                
                if(srcStyleWidth && (srcStyleWidth = srcStyleWidth.toLocaleLowerCase()) != "auto"){
                    //百分比
                    if(srcStyleWidth.indexOf("%") == -1){
                        srcStyleWidth = parseInt(srcStyleWidth, 10);
                        if(srcStyleWidth > 0){
                            imgW = Math.min(srcStyleWidth, imgW);
                        }
                    }else{
                        srcStyleWidth = parseInt(srcStyleWidth, 10);
                        var parentWidth = _getRuntimeStyle(img.offsetParent || img.parentElement, "width");
                        if(parentWidth){
                            parentWidth = parseInt(parentWidth + "", 10);
                            imgW = Math.floor((parentWidth * (srcStyleWidth / 100)) * 10) / 10.0;
                        }
                    }
                }
                
                if(srcStyleHeight && (srcStyleHeight = srcStyleHeight.toLocaleLowerCase()) != "auto"){
                    srcStyleHeight = srcStyleHeight.toLocaleLowerCase();
                    if(srcStyleHeight.indexOf("%") == -1 && srcStyleHeight.indexOf("auto") == -1){
                        srcStyleHeight = parseInt(srcStyleHeight, 10);
                        if(srcStyleHeight > 0){
                            imgH = Math.min(srcStyleHeight, imgH);
                        }
                    }else{
                        srcStyleHeight = parseInt(srcStyleHeight, 10);
                        var parentHeight = _getRuntimeStyle(img.offsetParent || img.parentElement, "height");
                        if(parentHeight){
                            parentHeight = parseInt(parentHeight + "", 10);
                            imgH = Math.floor((parentHeight * (srcStyleHeight / 100)) * 10) / 10.0;
                        }
                    }
                }
                
                //设置了原始高度， 需要按比例进行缩放一下
                if(srcStyleWidth && !srcStyleHeight){
                    //有宽度没有高度， 按照宽度保证长宽比例缩放
                    imgH = Math.floor((imgH * (imgW / imgObj.width)) * 10) / 10.0;
                }
                if(srcStyleHeight && !srcStyleWidth){
                  //有高度没有宽度， 按照宽度保证长宽比例缩放
                    imgW = Math.floor((imgW * (imgH / imgObj.height)) * 10) / 10.0;
                }
                
                
                newWidth = imgW;
                newHeight = imgH;
                
                var imgMargin = 0, imgMarginLeft, imgMarginRight, textIndent;
                imgMarginLeft = _getRuntimeStyle(img, "margin-left");
                imgMarginRight = _getRuntimeStyle(img, "margin-right");

                if(imgMarginLeft && imgMarginLeft.match(/-?\d+/)){
                    imgMargin += parseInt(imgMarginLeft, 10);
                }
                if(imgMarginRight && imgMarginRight.match(/-?\d+/)){
                    imgMargin += parseInt(imgMarginRight, 10);
                }
                
              //首行缩进
                imgMargin += getEleTextIndent(img);
                
                imgW += imgMargin;
                
                // 缩放
                if(imgW > this.outerWidth && !this._hasParent(img, "td") /*&& !this.hasTable*/){
                    var srcImgWidth = newWidth;
                    newWidth = this.outerWidth - 20 - imgMargin;
                    newHeight = Math.floor((imgH * (newWidth / srcImgWidth)) * 10) / 10.0;
                }
                
                img.style.height = newHeight + "px";
                img.style.width = newWidth + "px";// 20是padding
                
                img.src = imgObj.config.src;
                img.style.display = "";
                
                // 刷新
                if(/*loadAll && */!this.exeLoadAllImg){
                    if(loadAll){
                        this.exeLoadAllImg = true;
                        this._scaleTable();
                    }
                    this.reLayout();
                }
            }
        }
        
        /**
         * 处理表格
         */
        HTMLContent.prototype._scaleTable = function(){
            
            var tables = this.inner.querySelectorAll("table");
            if(tables && tables.length > 0){
                for(var i = 0, len = tables.length; i < len; i++){
                    var t = tables[i];
                    
                    //内层的table不做处理
                    if(!this._hasParent(t, "td")){
                        var w, h, newW, newH, tI, scaleSize;
                        w = t.offsetWidth;
                        h = t.offsetHeight;
                        
                        //设置标记，用于放大显示
                        t.setAttribute("_scaleTable", "true");
                        t.setAttribute("_scaleTableIndex", i);
                        
                        //缩进， word里面编辑经常这样写
                        tI = getEleTextIndent(t);
                        if(w + tI > this.outerWidth){
                            
                            var pLeft = _getRuntimeStyle(this.outer, "padding-left") || "0"
                                pRight = _getRuntimeStyle(this.outer, "padding-right") || "0";
                            
                            var innerPading = 20;
                            if(this.config.padding){
                                innerPading = parseInt(this.config.padding, 10) * 2;
                            }
                            newW = this.outerWidth - innerPading - (parseInt(pLeft, 10) + parseInt(pRight, 10)) - tI;
                            
                            //缩放比列
                            scaleSize =  (Math.floor((newW / w) * 100) - 1) / 100.00;//保留2位有效数字
                            newH = Math.ceil(h * scaleSize);
                            
                            //在外面套上一层DIV
                            var tOuter, tParent = t.parentNode;
                            tOuter = document.createElement("div");
                            with(tOuter.style){
                                width = newW + "px";
                                height = newH + "px";
                                overflow = "hidden";
                            }
                            
                            //置换
                            tParent.insertBefore(tOuter, t);
                            tParent.removeChild(t);
                            tOuter.appendChild(t);
                            
                            t.style.webkitTransform="scale(" + scaleSize + ")";
                            t.style.transform ="scale(" + scaleSize + ")";
                            t.style.webkitTransformOrigin="0px 0px 0px";
                            t.style.transformOrigin ="0px 0px 0px";
                            //t.style.zoom = scaleSize;
                            t.style.margin = "0px";
                        }
                    }
                }
            }
        }
        
        /**
         * ele是否有tag类型的父节点
         */
        HTMLContent.prototype._hasParent = function(ele, tag){
            
            var ret = false, p, parentTag;
            p = ele.parentNode;
            
            if(p && (parentTag = p.tagName.toLocaleLowerCase()) !== "body"){
                ret = (parentTag === tag);
                if(!ret){
                    ret = this._hasParent(p, tag);
                }
            }
            return ret;
        }
        
        /**
         * 刷新列表
         */
        HTMLContent.prototype.refresh = function(isInit){
            
            if(this.outerWidth == 0){
                this.outerWidth = this.outer.clientWidth;
                
                if(this.outerWidth != 0){
                    
                    var innerMinWidth = this.clientWidth + "px";
                    if(this.outerWidth == 0){
                        innerMinWidth = "100%";
                    }
                    if(this.hasTable){
                        //有表格需要进行页面撑开
                        /*this.inner.classList.add("ct-inner-c-auto");
                        this.inner.style.width = "auto";*/
                    }
                    
                    this.inner.style.minWidth = innerMinWidth;
                    if(this.config.padding){
                        this.inner.style.padding = this.config.padding + "px";
                    }
                        
                    // 图片宽度初始化
                    var imgObjs = SeeyonImgReady.getImgs(this.imgGroupKey);
                    if(imgObjs && imgObjs.length > 0){
                        var loadFlag = this.loadAllImg;
                        for(var i = 0, len = imgObjs.length; i < len; i++){
                            var iObj = imgObjs[i];
                            if(iObj.loaded){
                                this._onImgLoad(iObj, (this.loadAllImg || loadFlag) && (loadFlag && i == len - 1));
                            }
                        }
                        if(loadFlag){
                            this.loadAllImg = loadFlag;
                        }
                    }else{
                        //缩放表格
                        this._scaleTable();
                    }
                    
                    var _this = this;
                    setTimeout(function(){
                        
                      // 有表格的时候浏览器布局有问题
                        _this.innerWidth = _this.inner.offsetWidth;
                        
                        _this.innerHeight = Math.max(_this.inner.offsetHeight, _this.inner.scrollHeight);
                        if(_this.innerHeight > 0){
                            _this.inner.style.height = _this.innerHeight + "px";
                        }
                        
                        _this._initZoom();
                    }, 100);
                }
            }
        }
        
        /**
         * 更新layout
         */
        HTMLContent.prototype.reLayout = function(){
            
            var _this = this;
            
            //赋初始值
            _this.__relayoutCount = _this.__relayoutCount || 0;
            
            if(!_this.config && _this.__relayoutCount < 20){
                
                _this.__relayoutCount++;
                
                setTimeout(function(){
                    _this.reLayout();
                }, 300);
            }else{
                
                _this.__relayoutCount = 0;
                
                if(this.config.zoomType == "iscroll"){
                    if(this.iScroll != null){
                        //重新设置高度
                        this.innerHeight = Math.max(this.inner.offsetHeight, this.inner.scrollHeight);
                        if(this.innerHeight > 0){
                            this.inner.style.height = this.innerHeight + "px";
                        }
                        this.iScroll.refresh();
                    }
                }
            }
        }
        
        /**
         * 初始化滚动区域
         */
        HTMLContent.prototype._initZoom = function(){
            
            if(!this.config.useZoom){
                return;
            }
            
            var _this = this;
            
            if(this.config.zoomType == "iscroll"){
                
                this.outer.style.overflow = "hidden";
                
                this.isZoom = true;
                
                var iscrollConfig = {

                        zoom : true,
                        zoomMin: this.config.zoomMin,
                        zoomMax: this.config.zoomMax, 
                        startZoom: this.config.zoomMin,
                        preventDefault:false,//释放默认阻止事件，是因为新设计需要对正文内容文本可复制。---马山
                        // INSERT POINT: OPTIONS
                        disableTouch : false,//utils.hasPointer || !utils.hasTouch,
                        scrollY: true,
                        scrollX: true,
                        /*eventPassthrough : true,*/
                        momentum: this.config.momentum,
                        bounce: false
                    }
                
                //事件绑定在容器上面
                if(this.config.onScrollAuto){
                    iscrollConfig.bindToWrapper = true;
                }
                
                this.iScroll = new IScroll(this.outer, iscrollConfig);
                
                if(_this.config.onScrollAuto){
                    
                    this.iScroll.on("beforeScrollStartBegin", function(e){
                        
                        //开始就到底部了
                        if(_this.iScroll.y == _this.iScroll.maxScrollY && _this.iScroll.y == 0){
                            _this.iScroll.resetPassthrough(true);
                        }
                    });
                    
                    this.iScroll.on("beforeScrollMove", function(e){
                            
                         //向上滑动
                        if(this.verticalDir == 1){
                            
                            if(this.y == 0){
                                this.resetPassthrough(false);//启用iscroll
                            }
                            
                            if(this.y == this.maxScrollY){
                                this.resetPassthrough(true);//禁用iscroll
                            }
                            
                        }else if(this.verticalDir == -1){//向下滑动
                            
                            if(this.y == this.maxScrollY){
                                this.resetPassthrough(false);//启用iscroll
                            }
                            
                          //滚动到头
                            if(this.y == 0){
                                this.resetPassthrough(true);//禁用iscroll
                            }
                        }
                    });
                    
                }else{
                    
                    this.iScroll.on('beforeScrollStart', function(){
                        _this.scrollBeginTime = new Date().getTime();
                        _this.scrollStartY = _this.iScroll.pointY;
                        _this.startAtBottom = _this.iScroll.y == _this.iScroll.maxScrollY;
                    });
                    
                    //自动滚动
                    this.iScroll.on('scrollEnd', function(){
                        _this._onScrollEnd();
                    });
                    
                    this.iScroll.on("scroll", function(e){
                        
                        _this.fire("scroll", {
                            "top" : this.y,
                            "directionY" : this.directionY
                        });
                    });
                }
            }
        }
        
        /**
         * 添加事件
         */
        HTMLContent.prototype._listen = function(){
            this.inner.addEventListener("touchstart", this, false);
            this.inner.addEventListener("touchmove", this, false);
            //this.inner.addEventListener("touchend", this, false);
        }
        
        
        HTMLContent.prototype.handleEvent = function(e){
            //事件处理
            if(this.config.zoomType == "iscroll"){
                
            }else {
                
            }
        }
        
        /**
         * 获取两个触碰点的距离
         */
        HTMLContent.prototype._getTouchDist = function(e) {
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0,
                dist = 0;
            
            var tPoints = e.touches;
            if(tPoints && tPoints.length > 1){
                
                x1 = tPoints[0].pageX;
                y1 = tPoints[0].pageY;
                
                x2 = tPoints[1].pageX;
                y2 = tPoints[1].pageY;
                
                //计算两点间的距离
                dist = Math.ceil(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
            }
            return dist;
        };
        
        
        
        /**
         * 触发滚动到最右
         */
        HTMLContent.prototype._onScrollEnd = function(){
            
            if(this.scrollBeginTime == 0){
                return;
            }
            
            this.scrollBeginTime = 0;
            
            var _this = this;
            
            
            
            this.fire("scrollEnd", {
                "top" : _this.iScroll.y,
                "directionY" : _this.iScroll.directionY
            });
            
            
            //到顶事件
            if(_this.iScroll.y == 0 && _this.iScroll.directionY == -1){
                if(_this.reachTop){
                    _this.reachTop = false;
                    _this.fire("scrollTop");
                }else{
                    _this.reachTop = true;
                }
            }else{
                _this.reachTop = false;
            }
            
            if(!_this.iScroll.hasVerticalScroll){
                
                if(_this.scrollStartY > _this.iScroll.pointY){
                    _this.fire("scrollBottom");
                }
                _this.reachBottom = false;
                
            }else{
              //到底事件
                if(_this.iScroll.y == _this.iScroll.maxScrollY && _this.iScroll.directionY == 1 ){
                    if(_this.reachBottom || _this.startAtBottom){
                        _this.reachBottom = false;
                        _this.fire("scrollBottom");
                    }else{
                        _this.reachBottom = true;
                    }
                }else{
                    _this.reachBottom = false;
                }
            }
            
            //到左边事件
            if(_this.iScroll.x == 0 && _this.iScroll.directionX == -1){
                if(_this.reachLeft){
                    _this.reachLeft = false;
                    _this.fire("scrollLeft");
                }else{
                    _this.reachLeft = true;
                }
            }else{
                _this.reachLeft = false;
            }
            
            
            //到右边事件
            if(_this.iScroll.x == _this.iScroll.maxScrollX && _this.iScroll.directionX == 1){
                if(_this.reachRight){
                    _this.reachRight = false;
                    _this.fire("scrollRight");
                }else{
                    _this.reachRight = true;
                }
            }else{
                _this.reachRight = false;
            }
        }
        
        /**
         * 销毁
         */
        HTMLContent.prototype.destroy = function(){
            
            if(this.iScroll){
                this.iScroll.destroy();
                this.iScroll = null;
            }
        }

        return HTMLContent;

      })(Content);
    
    /**
     * Edoc HTML正文
     */
    var EdocContent = (function(superClass) {
        
        extend(EdocContent, superClass);

        function EdocContent() {
          return EdocContent.__super__.constructor.apply(this, arguments);
        }
        
        
        /**
         * 初始化HTML正文
         */
        EdocContent.prototype.initContent = function(){
            
            this.inner = null;//正文区域，动态创建的

            this.imgCounts = 0;// 图片数量
            this.imgGroupKey = this.config.target + "_imgs",// 正文区域图片组key

            this.iScroll = null;//iScoll对象
            this.isZoom = false;//是否可以缩放

            this.scrollBeginTime = 0;//滚动开始时间点
            this.startAtBottom = false;//上拉时本身在底部
            
            this.outerWidth = 0;//外层数据宽度
            this.innerWidth = 0;//内层数据宽度
            this.innerHeight = 0;//内层数据高度
            this.setTimouttime = 0;
            this.setTimeoutFlag = 0;
            
            this.outer.style.overflow = "hidden";
            
            this.inner = document.createElement("DIV");
            with(this.inner.style){
            	overflow = "hidden";
	        	display = "inline-block";
	        	padding = "10px";
            }
            
            this.inner.innerHTML = this.config.content;
            
            this.dealImg(this.config.content);
            
            this.outer.appendChild(this.inner);
            
            //释放正文内容内存
            this.config.content = null;
            
            if(this.imgCounts > 0){
                SeeyonImgReady.load(this.imgGroupKey); 
            }else{
                this.refresh();
            }
            
            //处理点击事件
            this._listenTap();
            
            this.fire("load");
        }
        
        /**
         * 监听点击事件， 处理附件
         */
        EdocContent.prototype._listenTap = function(){
            
            this.inner.addEventListener("tap", this);
        }
        
        EdocContent.prototype.handleEvent = function(e){
                switch (e.type) {
                    case 'tap':
                        this._tap(e);
                        break;
                    default:
                        break;
                }
        }
        
        EdocContent.prototype._tap = function(e){
            var srcEle = e.target.parentElement;
            if(srcEle.classList.contains("allow-click-attachment")){
                var attData = srcEle.getAttribute("see-att-data");
                SeeyonContent.clickAtt($.parseJSON(attData));
            }
        }
        
        /**
         * 刷新列表
         */
        EdocContent.prototype.refresh = function(){
            
            if(this.outerWidth == 0){
                this.outerWidth = this.outer.clientWidth;
                
                if(this.outerWidth != 0){
                    
                    var innerMinWidth = this.outerWidth + "px";
                    if(this.outerWidth == 0){
                        innerMinWidth = "100%";
                    }
                    this.inner.style.minWidth = innerMinWidth;
                    
                    var _this = this;
                    
                    //处理加载速度慢，文单无法加载完的问题
                    var tempWidth =  _this.inner.offsetWidth;
                    var tempHeight = _this.inner.offsetHeight;
                    
                    if((_this.innerWidth != tempWidth || _this.innerHeight != tempHeight) && this.setTimouttime < 20){
                    	
                    	_this.innerWidth =tempWidth;
                        _this.innerHeight = tempHeight;
                        _this.setTimouttime++;
                    	
                    	clearTimeout(this.setTimeoutFlag);
                    	
                    	this.setTimeoutFlag = setTimeout(function(){
                    		_this.outerWidth = 0;
                    		_this.refresh();
                    	}, 500);
                    }else{
                    	_this._initZoom();
                    }
                }
            }
        }
        
        /**
         * 初始化滚动区域
         */
        EdocContent.prototype._initZoom = function(){
            var _this = this,
                startZoom = Math.floor((this.outerWidth / this.innerWidth) * 100) / 100.00;
            this.isZoom = true;

            if(!this.iScroll){
            	this.iScroll = new IScroll(this.outer, {
            		
            		zoom : true,
            		zoomMin: startZoom,
            		zoomMax: this.config.zoomMax, 
            		startZoom: startZoom,
            		
            		// INSERT POINT: OPTIONS
            		disableTouch : false,
            		scrollY: true,
            		scrollX: true,
            		momentum: this.config.momentum,
            		bounce: false
            	});
            	this.iScroll.on('beforeScrollStart', function(){
            		_this.scrollBeginTime = new Date().getTime();
            		_this.startAtBottom = _this.iScroll.y == _this.iScroll.maxScrollY;
            	});
            	this.iScroll.on('scrollEnd', function(){
            		_this._onScrollEnd();
            	});
            }else{
            	this.iScroll.refresh();
            }
        }
        

        /**
         * 触发滚动到底部
         */
        EdocContent.prototype._onScrollEnd = function(){
            
            if(this.scrollBeginTime == 0){
                return;
            }
            this.scrollBeginTime = 0;
            
            var _this = this;
            
            if(_this.iScroll.hasVerticalScroll){
              //到底事件
                if(_this.iScroll.y == _this.iScroll.maxScrollY && _this.iScroll.directionY == 1 ){
                    if(_this.reachBottom || _this.startAtBottom){
                        _this.reachBottom = false;
                        _this.fire("scrollBottom");
                    }else{
                        _this.reachBottom = true;
                    }
                }else{
                    _this.reachBottom = false;
                }
            }
        }
        
        /**
         * 销毁
         */
        EdocContent.prototype.destroy = function(){
            
            if(this.iScroll){
                this.iScroll.destroy();
                this.iScroll = null;
            }
        }
        
        /**
         * 获取数量以及预加载图片
         */
        EdocContent.prototype.dealImg = function(html){
        	var _this = this;
        	var imgReg = /<img [^<]*?(?=\/>|><\/img>|>)/ig, 
            	srcReg = / src[ ]*?=[ ]*?["']([^>]+?)["']/i;
        	while((ret = imgReg.exec(html))!=null) {
        		var imgStr = ret[0],
        			imgSrc = srcReg.exec(imgStr);
        		
        		var newImgSrc = imgSrc[1].replace(/&amp;/g, "&");
                if($.platform.CMPShell && newImgSrc.indexOf("/seeyon") == 0){
                    // cmp壳需要进行路径替换
                    newImgSrc = $.origin + newImgSrc.substring(7);
                }
        		if(imgStr){
        			this.imgCounts++;
        			
        			// 创建预加载对象
                    SeeyonImgReady.addImg(this.imgGroupKey, {
                    	"src" : newImgSrc,
                        "load" : function(imgObj, loadAll){
                            if(loadAll){
                            	_this.refresh();
                            }
                        },
                        "error" : function(imgObj, loadAll){
                            if(loadAll){
                            	_this.refresh();
                            }
                        }
                    });
        		}
        	}
        }

        return EdocContent;

      })(Content);
    
    
    /**
     * 表单正文
     */
    var OfficeContent = (function(superClass){
        
        extend(OfficeContent, superClass);
        
        function OfficeContent(){
            return OfficeContent.__super__.constructor.apply(this, arguments);
        }
        
        
        OfficeContent.prototype.initAttribute = function(){
            
            this.inner = null;//
            this.outerWidth = 0;
            this.outerHeight = 0;
            this.innerHeight = 0;
            
            this.inner = document.createElement("DIV");
            
            this._addClass(this.outer, "office-content-widget");
            this._addClass(this.inner, "office-content-widget-inner");
        }
        
        /**
         * 初始化正文
         */
        OfficeContent.prototype.initContent = function(){
            
            var type = this.config.subfix;
            
            var noteHTML  = '<div style="font-size:80px;" class="' + this.iconCss(type || "") + ' office-content-icon"></div>';
                noteHTML += '<p class="office-content-text">'+ (this.config.title || $.i18n("commons.label.bodyType", [type]))/* 该正文为xx格式，请点击按钮查看. */+'</p>';
                noteHTML += '<button type="button" class="office-content-btn">' + $.i18n("commons.label.view") /* 查看 */ + '</button>';
            
            this.inner.innerHTML = noteHTML;
            this.outer.appendChild(this.inner);
            
            //添加事件
            var _this = this;
            this.inner.querySelector("button").addEventListener("tap", function(e){
                
                var suffixMap = {
                        "wps" : "doc",
                        "et" : "xls"
                 }
                
                var newFileName = _this.config.title;
                var newSuffix = suffixMap[_this.config.subfix] || _this.config.subfix;
                if(newFileName){
                    
                  //获取后缀名, 替换wps相关文件的后缀名，  ios不认识
                    var dotIndex = newFileName.lastIndexOf(".");
                    if(dotIndex != -1){
                        var pureName = newFileName.substring(0, dotIndex);
                        var fileSuffix = newFileName.substring(dotIndex + 1);
                        for(var subType in suffixMap){
                            if(fileSuffix.toLowerCase() == subType){
                                newFileName = pureName + "." + suffixMap[subType];
                                break;
                            }
                        }
                    }
                }
                
                if($.platform.CMPShell){
                    var fileName = newFileName || (cmp.i18n("commons.label.defTitle") + "." + newSuffix);
                    
                    // IOS 端[]这个符号会被转义两次 传到服务器去也是 [], 服务器不认识
                    var downFilePath = $.origin + "/rest/attachment/file/" + _this.config.content + "?fileName=" + encodeURI(fileName.replace(/[\[\]]/g, ""));
                    var option={
                        path : downFilePath,
                        filename : fileName,
                        extData:{
                            fileId:_this.config.content,
                            lastModified:_this.config.lastModified == null ? "" : _this.config.lastModified,
                            isClearTrace:true,
                            download : _this.config.canDownLoad === false ? "0" : "1" // 控制M3 IOS端是否能下载
                        },
                        success: function(res){
                            cmp.dialog.loading(false);
                        },
                        error:function(err){
                            cmp.dialog.loading(false);
                            if(err.code==17002){
                            	this.alert($.i18n("commons.note.file.notorremoved"));
                            }else if(err.code==500){
                            	if(err.message){
                            		this.alert(err.message);
                            	}else{
                            		this.alert($.i18n("commons.server.error.tip"));
                            	}
                            }else{
                            	this.alert($.i18n("commons.note.readcontenterror", [JSON.stringify(err)]));//读取正文失败, 请稍重试.错误信息:
                            }
                        }
                    }
                    cmp.dialog.loading();
                    if(typeof(summaryBO) != "undefined"){//如果当前修改过正文，取修改正文后的文件
                    	if(summaryBO.editParam && summaryBO.editParam.filepath){
                    		option.path = summaryBO.editParam.filepath;
                    	}
                    }
                    $.att.read(option);
                }else{
                    var srcFileName = newFileName || (cmp.i18n("commons.label.defTitle") + "." + newSuffix);
                    var fileName = srcFileName;
                    fileName = encodeURI(fileName);
                    var downFilePath = $.origin + "/rest/attachment/file/" + _this.config.content + "?fileName=" + fileName;
                    if(cmp.att.canDownload4Wechat(_this.config.subfix)){
                        cmp.att.download({"url": downFilePath, "title" : srcFileName});
                    }else{
                       cmp.notification.toast(cmp.i18n("commons.note.notsuport3"), 'top', 1000);
                    }
                    //$.notification.toast($.i18n("commons.note.notsuport3"), 'top', 1000);//微信端暂不支持该正文查看!
                } 
            });
            
            this._listener();
            
            this.fire("load");
        }
        
        //参照的cmp-att.js
        OfficeContent.prototype.iconCss = function (type) {
            
            type = type.toLocaleLowerCase();
           var className = "cmp-icon-document ";
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
        
        OfficeContent.prototype._listener = function(e){
            if(this.config.onScrollBottom){
                this.outer.addEventListener("touchstart", this);
                this.outer.addEventListener("touchmove", this);
                this.outer.addEventListener("touchend", this);
            }
        }
        
        OfficeContent.prototype.handleEvent = function(e){
            switch (e.type) {
                case 'touchstart':
                    this._touchstart(e);
                    break;
                case 'touchmove':
                    this._touchmove(e);
                    break;
                case 'touchend':
                    this._touchend(e);
                    break;
                default:
                    break;
            }
        }
        
        return OfficeContent;
        
    })(Content);
    
    /**
     * 转发表单协同
     */
    var ForwardFormContent = (function(superClass) {

        extend(ForwardFormContent, superClass);

        function ForwardFormContent() {
            return ForwardFormContent.__super__.constructor.apply(this, arguments);
        }

        /**
         * 初始化正文
         */
        ForwardFormContent.prototype.initContent = function() {

            var _this = this;
            LazyUtil.addLoadedFn("lazy_form", function(){
              
                //表单
                var options = {
                    containerId: _this.config.target, //渲染的div根节点id
                    moduleId: _this.config.content,
                    moduleType: _this.config.moduleType,
                    rightId: _this.config.ext.rightId,
                    viewState: _this.config.ext.viewState,
                    allowQRScan : false,
                    indexParam : "0",
                    affairId : _this.config.ext.affairId || "-1",
                    templateType : "lightForm"
                }
                
                if(_this.config.onScrollBottom){
                    options.onScrollBottom = _this.config.onScrollBottom;
                }
                
                if(_this.config.onScroll){
                    options.onScroll = _this.config.onScroll;
                }
                
                $.sui.loadForm(options, function(){
                    _this.fire("load");
                });
            });
        }

        return ForwardFormContent;

    })(Content);
    
    return new App();
})(cmp);

/**
 * HTML片段查看器
 */
var HTMLViewer = (function($, win){
    
    /**
     * 
     * config.type : html/img
     * 
     * config.html : html片段， type为html时使用
     * config.imgSrc : 图片src, type为img时使用
     * config.width : 原始宽度
     * config.height : 原始高度
     * 
     */
    var Viewer = function(config){
        
        var blockdiv, innerDiv, html, winW, winH, scaleSize = 1, iScroll, _this = this;
        
        winW = document.documentElement.clientWidth;
        winH = document.documentElement.clientHeight;
        
        html = config.html;
        
        blockdiv = document.createElement("div");
        blockdiv.className = "content-viewer content-widget";
        with(blockdiv.style){
            width = winW + "px";
            height = winH + "px";
        }
        
        document.body.appendChild(blockdiv);
        
        innerDiv = document.createElement("div");
        innerDiv.className = "content-viewer-scorller";
        
        if(typeof html === "string"){
            innerDiv.innerHTML = html;
        }else{
            innerDiv.appendChild(html);
        }
        blockdiv.appendChild(innerDiv);
        
        //居中显示
        var innerHeight = innerDiv.offsetHeight;
        var innerWidth = innerDiv.offsetWidth;
        
        var paddingTB = 20, paddingLR = 0;
        if(innerHeight + paddingTB * 2 < winH){
            paddingTB = (winH - innerHeight) / 2;
        }
        if(innerWidth < winW){
            paddingLR = (winW - innerWidth) / 2;
        }
        innerDiv.style.padding = paddingTB + "px " + paddingLR + "px";
        
      
        
        if(innerWidth > winW){
            //缩放比列
            scaleSize =  Math.floor((winW / innerWidth) * 10000) / 10000.0000;//保留四位有效数字
        }
        iScroll = new IScroll(blockdiv, {
            zoom : true,
            zoomMin: scaleSize,
            zoomMax: 5, 
            startZoom: 1,
            // INSERT POINT: OPTIONS
            disableTouch : false,//utils.hasPointer || !utils.hasTouch,
            scrollY: true,
            scrollX: true,
            momentum: true,
            bounce: false
        });
        
        /*iScroll.on("zoomEnd", function(e){
            console.log("缩放情况：" + iScroll.maxScrollY + ", " + iScroll.maxScrollX);
        });*/
        
      //向cmp压堆栈
        cmp.backbutton.push(function(){
            _this.destory();
        });
        this.init = function(){
            blockdiv.addEventListener("tap", this);
        }
        this.destory = function(){
            
            //cmp 返回键注销事件
            cmp.backbutton.pop();
            
            blockdiv.removeEventListener("type", this);
            blockdiv.remove();
            iScroll.destroy();
            
            blockdiv = null;
            innerDiv = null;
            iScroll = null;
            _this = null;
        }
        
        /**
         * 处理事件
         */
        this.handleEvent = function(e){
            switch (e.type) {
            case 'tap':
                e.stopPropagation();
                this.destory();
                break;
            default:
                break;
            }
        }
        
        this.init();
    }
    
    return Viewer;
    
})(cmp);

/**
 * 图片预加载组件
 * 
 * Api
 * 
 * SeeyonImgReady.load(config) 预加载一张图片
 * SeeyonImgReady.loadAll(config) 批量预加载图片
 * SeeyonImgReady.getImgs(groupKey) 获取图片数组
 * 
 */
var SeeyonImgReady = (function($) {

    var ImgLoader = function(config, group) {

        this.img = null;
        this.config = config;
        this.width = 0;
        this.height = 0;
        this.loaded = false;
        this.isError = false;
        this.group = group;

        /**
         * 加载图片
         */
        this.loadImg = function() {

            var _this = this;

            this.img = new Image();
            this.img.onerror = function() {
                _this.error();
            };

            this.img.onload = function() {
                _this.load();
            };

            this.img.src = this.config.src;

            // 如果图片被缓存，则直接返回缓存数据
            if (this.img.complete) {
                this.load();
                return;
            }
        }

        this.load = function() {

            if(this.img){
                this.width = this.img.width;
                this.height = this.img.height;
            }
            

            var ret = this.finish();

            if (this.config.load) {
                this.config.load(this, ret);
            }
        }

        this.error = function() {
            this.isError = true;
            var ret = this.finish();
            if (this.config.error) {
                this.config.error(this, ret);
            }
        }

        this.finish = function() {
            this.loaded = true;
            this.destoryImg();

            var finish = true;

            if (this.group) {
                for (var i = 0; i < this.group.length; i++) {
                    if (!this.group[i].loaded) {
                        // 还有图片没有加载完
                        finish = false;
                        break;
                    }
                }
            }

            return finish;
        }

        this.destoryImg = function() {
            this.img = this.img.onload = this.img.onerror = null;
        }
    }

    var ImgReady = function() {

        // 预加载进行分组
        this.imgList = {};

        /**
         * 加载图片 
         * config.src {String} 图片路径 
         * config.load(config) {Function} 加载完毕
         * config.error(config) {Function} 加载错误
         */
        this.addImg = function(loadKey, config) {

            var list = this.imgList[loadKey];
            if (!list) {
                list = [];
            }

            var imgLoader = new ImgLoader(config, list);

            list.push(imgLoader);
            this.imgList[loadKey] = list;
        }
        
        /**
         * 获取图片数组
         */
        this.getImgs = function(loadKey){
            return this.imgList[loadKey];
        }

        /**
         * 批量加载图片
         */
        this.addAllImg = function(loadKey, configs) {

            if (configs && configs.length > 0) {
                for (var i = 0; i < configs.length; i++) {
                    this.load(loadKey, configs[i]);
                }
            }
        }

        this.load = function(loadKey) {
            var list = this.imgList[loadKey];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].loaded) {
                        list[i].loadImg();
                    }
                }
            }
        }
    }

    return new ImgReady();
})(cmp);
!function(a,b,c){function d(d,e){this.wrapper="string"==typeof d?b.querySelector(d):d,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={zoomMin:1,zoomMax:4,startZoom:1,resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,disablePointer:!0,disableTouch:false,disableMouse:h.hasPointer||h.hasTouch,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:!0,useTransition:!0,useTransform:!0,bindToWrapper:"undefined"==typeof a.onmousedown};for(var f in e)this.options[f]=e[f];this.translateZ=this.options.HWCompositing&&h.hasPerspective?" translateZ(0)":"",this.options.useTransition=h.hasTransition&&this.options.useTransition,this.options.useTransform=h.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"==this.options.eventPassthrough?!1:this.options.scrollY,this.options.scrollX="horizontal"==this.options.eventPassthrough?!1:this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?h.ease[this.options.bounceEasing]||h.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),this.options.useTransition||this.options.useTransform||/relative|absolute/i.test(this.scrollerStyle.position)||(this.scrollerStyle.position="relative"),"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,this.x=0,this.y=0,this.directionX=0,this.directionY=0,this.verticalDir=0,this.verticalY=0,this._events={},this.scale=c.min(c.max(this.options.startZoom,this.options.zoomMin),this.options.zoomMax),this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function e(a,c,d){var e=b.createElement("div"),f=b.createElement("div");return d===!0&&(e.style.cssText="position:absolute;z-index:9999",f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),f.className="iScrollIndicator","h"==a?(d===!0&&(e.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",f.style.height="100%"),e.className="iScrollHorizontalScrollbar"):(d===!0&&(e.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",f.style.width="100%"),e.className="iScrollVerticalScrollbar"),e.style.cssText+=";overflow:hidden",c||(e.style.pointerEvents="none"),e.appendChild(f),e}function f(c,d){this.wrapper="string"==typeof d.el?b.querySelector(d.el):d.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=c,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0};for(var e in d)this.options[e]=d[e];if(this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(this.options.disableTouch||(h.addEvent(this.indicator,"touchstart",this),h.addEvent(a,"touchend",this)),this.options.disablePointer||(h.addEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.addEvent(a,h.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(h.addEvent(this.indicator,"mousedown",this),h.addEvent(a,"mouseup",this))),this.options.fade){this.wrapperStyle[h.style.transform]=this.scroller.translateZ;var f=h.style.transitionDuration;if(!f)return;this.wrapperStyle[f]=h.isBadAndroid?"0.0001ms":"0ms";var i=this;h.isBadAndroid&&g(function(){"0.0001ms"===i.wrapperStyle[f]&&(i.wrapperStyle[f]="0s")}),this.wrapperStyle.opacity="0"}}var g=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(b){a.setTimeout(b,1e3/60)},h=function(){function d(a){return g===!1?!1:""===g?a:g+a.charAt(0).toUpperCase()+a.substr(1)}var e={},f=b.createElement("div").style,g=function(){for(var a,b=["t","webkitT","MozT","msT","OT"],c=0,d=b.length;d>c;c++)if(a=b[c]+"ransform",a in f)return b[c].substr(0,b[c].length-1);return!1}();e.getTime=Date.now||function(){return(new Date).getTime()},e.extend=function(a,b){for(var c in b)a[c]=b[c]},e.addEvent=function(a,b,c,d){a.addEventListener(b,c,!!d)},e.removeEvent=function(a,b,c,d){a.removeEventListener(b,c,!!d)},e.prefixPointerEvent=function(b){return a.MSPointerEvent?"MSPointer"+b.charAt(7).toUpperCase()+b.substr(8):b},e.momentum=function(a,b,d,e,f,g){var h,i,j=a-b,k=c.abs(j)/d;return g=void 0===g?6e-4:g,h=a+k*k/(2*g)*(0>j?-1:1),i=k/g,e>h?(h=f?e-f/2.5*(k/8):e,j=c.abs(h-a),i=j/k):h>0&&(h=f?f/2.5*(k/8):0,j=c.abs(a)+h,i=j/k),{destination:c.round(h),duration:i}};var h=d("transform");return e.extend(e,{hasTransform:h!==!1,hasPerspective:d("perspective")in f,hasTouch:"ontouchstart"in a,hasPointer:!(!a.PointerEvent&&!a.MSPointerEvent),hasTransition:d("transition")in f}),e.isBadAndroid=function(){var b=a.navigator.appVersion;if(/Android/.test(b)&&!/Chrome\/\d/.test(b)){var c=b.match(/Safari\/(\d+.\d)/);return c&&"object"==typeof c&&c.length>=2?parseFloat(c[1])<535.19:!0}return!1}(),e.extend(e.style={},{transform:h,transitionTimingFunction:d("transitionTimingFunction"),transitionDuration:d("transitionDuration"),transitionDelay:d("transitionDelay"),transformOrigin:d("transformOrigin")}),e.hasClass=function(a,b){var c=new RegExp("(^|\\s)"+b+"(\\s|$)");return c.test(a.className)},e.addClass=function(a,b){if(!e.hasClass(a,b)){var c=a.className.split(" ");c.push(b),a.className=c.join(" ")}},e.removeClass=function(a,b){if(e.hasClass(a,b)){var c=new RegExp("(^|\\s)"+b+"(\\s|$)","g");a.className=a.className.replace(c," ")}},e.offset=function(a){for(var b=-a.offsetLeft,c=-a.offsetTop;a=a.offsetParent;)b-=a.offsetLeft,c-=a.offsetTop;return{left:b,top:c}},e.preventDefaultException=function(a,b){for(var c in b)if(b[c].test(a[c]))return!0;return!1},e.extend(e.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),e.extend(e.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(a){return a*(2-a)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(a){return c.sqrt(1- --a*a)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(a){var b=4;return(a-=1)*a*((b+1)*a+b)+1}},bounce:{style:"",fn:function(a){return(a/=1)<1/2.75?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375}},elastic:{style:"",fn:function(a){var b=.22,d=.4;return 0===a?0:1==a?1:d*c.pow(2,-10*a)*c.sin((a-b/4)*(2*c.PI)/b)+1}}}),e.tap=function(a,c){var d=b.createEvent("Event");d.initEvent(c,!0,!0),d.pageX=a.pageX,d.pageY=a.pageY,a.target.dispatchEvent(d)},e.click=function(c){var d,e=c.target;/(SELECT|INPUT|TEXTAREA)/i.test(e.tagName)||(d=b.createEvent(a.MouseEvent?"MouseEvents":"Event"),d.initEvent("click",!0,!0),d.view=c.view||a,d.detail=1,d.screenX=e.screenX||0,d.screenY=e.screenY||0,d.clientX=e.clientX||0,d.clientY=e.clientY||0,d.ctrlKey=!!c.ctrlKey,d.altKey=!!c.altKey,d.shiftKey=!!c.shiftKey,d.metaKey=!!c.metaKey,d.button=0,d.relatedTarget=null,d._constructed=!0,e.dispatchEvent(d))},e}();d.prototype={version:"5.2.0",_init:function(){this._initEvents(),this.options.zoom&&this._initZoom(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),clearTimeout(this.resizeTimeout),this.resizeTimeout=null,this._execEvent("destroy")},_transitionEnd:function(a){a.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(a){var b,d=a.touches?a.touches[0]:a;if(this._execEvent("beforeScrollStartBegin"),this.verticalY=d.pageY,1!=h.eventType[a.type]){var e;if(e=a.which?a.button:a.button<2?0:4==a.button?1:2,0!==e)return}!this.enabled||this.initiated&&h.eventType[a.type]!==this.initiated||(!this.options.preventDefault||h.isBadAndroid||h.preventDefaultException(a.target,this.options.preventDefaultException)||a.preventDefault(),this.initiated=h.eventType[a.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this.startTime=h.getTime(),this.options.useTransition&&this.isInTransition?(this._transitionTime(),this.isInTransition=!1,b=this.getComputedPosition(),this._translate(c.round(b.x),c.round(b.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=d.pageX,this.pointY=d.pageY,this._execEvent("beforeScrollStart"))},_move:function(a){var b,d,e,f,g=a.touches?a.touches[0]:a,i=g.pageX-this.pointX,j=g.pageY-this.pointY,k=h.getTime(),l=g.pageY-this.verticalY;if(this.verticalDir=l>0?-1:0>l?1:this.verticalDir,this._execEvent("beforeScrollMove"),this.verticalY=g.pageY,this.enabled&&h.eventType[a.type]===this.initiated&&(this.options.preventDefault&&a.preventDefault(),this.pointX=g.pageX,this.pointY=g.pageY,this.distX+=i,this.distY+=j,e=c.abs(this.distX),f=c.abs(this.distY),!(k-this.endTime>300&&10>e&&10>f))){if(this.directionLocked||this.options.freeScroll||(e>f+this.options.directionLockThreshold?this.directionLocked="h":f>=e+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)a.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);j=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)a.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);i=0}i=this.hasHorizontalScroll?i:0,j=this.hasVerticalScroll?j:0,b=this.x+i,d=this.y+j,(b>0||b<this.maxScrollX)&&(b=this.options.bounce?this.x+i/3:b>0?0:this.maxScrollX),(d>0||d<this.maxScrollY)&&(d=this.options.bounce?this.y+j/3:d>0?0:this.maxScrollY),this.directionX=i>0?-1:0>i?1:0,this.directionY=j>0?-1:0>j?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(b,d),k-this.startTime>300&&(this.startTime=k,this.startX=this.x,this.startY=this.y),this._execEvent("scroll")}},_end:function(a){if(this.verticalDir=0,this.verticalY=0,this.enabled&&h.eventType[a.type]===this.initiated){this.options.preventDefault&&!h.preventDefaultException(a.target,this.options.preventDefaultException)&&a.preventDefault();var b,d,e=(a.changedTouches?a.changedTouches[0]:a,h.getTime()-this.startTime),f=c.round(this.x),g=c.round(this.y),i=c.abs(f-this.startX),j=c.abs(g-this.startY),k=0,l="";if(this.isInTransition=0,this.initiated=0,this.endTime=h.getTime(),!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(f,g),!this.moved)return this.options.tap&&h.tap(a,this.options.tap),this.options.click&&h.click(a),void this._execEvent("scrollCancel");if(this._events.flick&&200>e&&100>i&&100>j)return void this._execEvent("flick");if(this.options.momentum&&300>e&&(b=this.hasHorizontalScroll?h.momentum(this.x,this.startX,e,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:f,duration:0},d=this.hasVerticalScroll?h.momentum(this.y,this.startY,e,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:g,duration:0},f=b.destination,g=d.destination,k=c.max(b.duration,d.duration),this.isInTransition=1),this.options.snap){var m=this._nearestSnap(f,g);this.currentPage=m,k=this.options.snapSpeed||c.max(c.max(c.min(c.abs(f-m.x),1e3),c.min(c.abs(g-m.y),1e3)),300),f=m.x,g=m.y,this.directionX=0,this.directionY=0,l=this.options.bounceEasing}return f!=this.x||g!=this.y?((f>0||f<this.maxScrollX||g>0||g<this.maxScrollY)&&(l=h.ease.quadratic),void this.scrollTo(f,g,k,l)):void this._execEvent("scrollEnd")}}},_resize:function(){var a=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){a.refresh()},this.options.resizePolling)},resetPosition:function(a){var b=this.x,c=this.y;return a=a||0,!this.hasHorizontalScroll||this.x>0?b=0:this.x<this.maxScrollX&&(b=this.maxScrollX),!this.hasVerticalScroll||this.y>0?c=0:this.y<this.maxScrollY&&(c=this.maxScrollY),b==this.x&&c==this.y?!1:(this.scrollTo(b,c,a,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=c.round(this.scroller.offsetWidth*this.scale),this.scrollerHeight=c.round(this.scroller.offsetHeight*this.scale),this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,this.wrapperOffset=h.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(a,b){this._events[a]||(this._events[a]=[]),this._events[a].push(b)},off:function(a,b){if(this._events[a]){var c=this._events[a].indexOf(b);c>-1&&this._events[a].splice(c,1)}},_execEvent:function(a){if(this._events[a]){var b=0,c=this._events[a].length;if(c)for(;c>b;b++)this._events[a][b].apply(this,[].slice.call(arguments,1))}},scrollBy:function(a,b,c,d){a=this.x+a,b=this.y+b,c=c||0,this.scrollTo(a,b,c,d)},scrollTo:function(a,b,c,d){d=d||h.ease.circular,this.isInTransition=this.options.useTransition&&c>0;var e=this.options.useTransition&&d.style;!c||e?(e&&(this._transitionTimingFunction(d.style),this._transitionTime(c)),this._translate(a,b)):this._animate(a,b,c,d.fn)},scrollToElement:function(a,b,d,e,f){if(a=a.nodeType?a:this.scroller.querySelector(a)){var g=h.offset(a);g.left-=this.wrapperOffset.left,g.top-=this.wrapperOffset.top,d===!0&&(d=c.round(a.offsetWidth/2-this.wrapper.offsetWidth/2)),e===!0&&(e=c.round(a.offsetHeight/2-this.wrapper.offsetHeight/2)),g.left-=d||0,g.top-=e||0,g.left=g.left>0?0:g.left<this.maxScrollX?this.maxScrollX:g.left,g.top=g.top>0?0:g.top<this.maxScrollY?this.maxScrollY:g.top,b=void 0===b||null===b||"auto"===b?c.max(c.abs(this.x-g.left),c.abs(this.y-g.top)):b,this.scrollTo(g.left,g.top,b,f)}},_transitionTime:function(a){if(this.options.useTransition){a=a||0;var b=h.style.transitionDuration;if(b){if(this.scrollerStyle[b]=a+"ms",!a&&h.isBadAndroid){this.scrollerStyle[b]="0.0001ms";var c=this;g(function(){"0.0001ms"===c.scrollerStyle[b]&&(c.scrollerStyle[b]="0s")})}if(this.indicators)for(var d=this.indicators.length;d--;)this.indicators[d].transitionTime(a)}}},_transitionTimingFunction:function(a){if(this.scrollerStyle[h.style.transitionTimingFunction]=a,this.indicators)for(var b=this.indicators.length;b--;)this.indicators[b].transitionTimingFunction(a)},_translate:function(a,b){if(this.options.useTransform?this.scrollerStyle[h.style.transform]="translate("+a+"px,"+b+"px) scale("+this.scale+") "+this.translateZ:(a=c.round(a),b=c.round(b),this.scrollerStyle.left=a+"px",this.scrollerStyle.top=b+"px"),this.x=a,this.y=b,this.indicators)for(var d=this.indicators.length;d--;)this.indicators[d].updatePosition()},_initEvents:function(b){var c=b?h.removeEvent:h.addEvent,d=this.options.bindToWrapper?this.wrapper:a;c(a,"orientationchange",this),c(a,"resize",this),this.options.click&&c(this.wrapper,"click",this,!0),this.options.disableMouse||(c(this.wrapper,"mousedown",this),c(d,"mousemove",this),c(d,"mousecancel",this),c(d,"mouseup",this)),h.hasPointer&&!this.options.disablePointer&&(c(this.wrapper,h.prefixPointerEvent("pointerdown"),this),c(d,h.prefixPointerEvent("pointermove"),this),c(d,h.prefixPointerEvent("pointercancel"),this),c(d,h.prefixPointerEvent("pointerup"),this)),h.hasTouch&&!this.options.disableTouch&&(c(this.wrapper,"touchstart",this),c(d,"touchmove",this),c(d,"touchcancel",this),c(d,"touchend",this)),c(this.scroller,"transitionend",this),c(this.scroller,"webkitTransitionEnd",this),c(this.scroller,"oTransitionEnd",this),c(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var b,c,d=a.getComputedStyle(this.scroller,null);return this.options.useTransform?(d=d[h.style.transform].split(")")[0].split(", "),b=+(d[12]||d[4]),c=+(d[13]||d[5])):(b=+d.left.replace(/[^-\d.]/g,""),c=+d.top.replace(/[^-\d.]/g,"")),{x:b,y:c}},_initIndicators:function(){function a(a){if(h.indicators)for(var b=h.indicators.length;b--;)a.call(h.indicators[b])}var b,c=this.options.interactiveScrollbars,d="string"!=typeof this.options.scrollbars,g=[],h=this;this.indicators=[],this.options.scrollbars&&(this.options.scrollY&&(b={el:e("v",c,this.options.scrollbars),interactive:c,defaultScrollbars:!0,customStyle:d,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(b.el),g.push(b)),this.options.scrollX&&(b={el:e("h",c,this.options.scrollbars),interactive:c,defaultScrollbars:!0,customStyle:d,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(b.el),g.push(b))),this.options.indicators&&(g=g.concat(this.options.indicators));for(var i=g.length;i--;)this.indicators.push(new f(this,g[i]));this.options.fadeScrollbars&&(this.on("scrollEnd",function(){a(function(){this.fade()})}),this.on("scrollCancel",function(){a(function(){this.fade()})}),this.on("scrollStart",function(){a(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){a(function(){this.fade(1,!0)})})),this.on("refresh",function(){a(function(){this.refresh()})}),this.on("destroy",function(){a(function(){this.destroy()}),delete this.indicators})},_initZoom:function(){this.scrollerStyle[h.style.transformOrigin]="0 0"},_zoomStart:function(a){var b=c.abs(a.touches[0].pageX-a.touches[1].pageX),d=c.abs(a.touches[0].pageY-a.touches[1].pageY);this.touchesDistanceStart=c.sqrt(b*b+d*d),this.startScale=this.scale,this.originX=c.abs(a.touches[0].pageX+a.touches[1].pageX)/2+this.wrapperOffset.left-this.x,this.originY=c.abs(a.touches[0].pageY+a.touches[1].pageY)/2+this.wrapperOffset.top-this.y,this._execEvent("zoomStart")},_zoom:function(a){if(this.enabled&&h.eventType[a.type]===this.initiated){this.options.preventDefault&&a.preventDefault();var b,d,e,f=c.abs(a.touches[0].pageX-a.touches[1].pageX),g=c.abs(a.touches[0].pageY-a.touches[1].pageY),i=c.sqrt(f*f+g*g),j=1/this.touchesDistanceStart*i*this.startScale;this.scaled=!0,j<this.options.zoomMin?j=.5*this.options.zoomMin*c.pow(2,j/this.options.zoomMin):j>this.options.zoomMax&&(j=2*this.options.zoomMax*c.pow(.5,this.options.zoomMax/j)),b=j/this.startScale,d=this.originX-this.originX*b+this.startX,e=this.originY-this.originY*b+this.startY,this.scale=j,this.scrollTo(d,e,0)}},_zoomEnd:function(a){if(this.enabled&&h.eventType[a.type]===this.initiated){this.options.preventDefault&&a.preventDefault();var b,c,d;this.isInTransition=0,this.initiated=0,this.scale>this.options.zoomMax?this.scale=this.options.zoomMax:this.scale<this.options.zoomMin&&(this.scale=this.options.zoomMin),this.refresh(),d=this.scale/this.startScale,b=this.originX-this.originX*d+this.startX,c=this.originY-this.originY*d+this.startY,b>0?b=0:b<this.maxScrollX&&(b=this.maxScrollX),c>0?c=0:c<this.maxScrollY&&(c=this.maxScrollY),(this.x!=b||this.y!=c)&&this.scrollTo(b,c,this.options.bounceTime),this.scaled=!1,this._execEvent("zoomEnd")}},zoom:function(a,b,c,d){if(a<this.options.zoomMin?a=this.options.zoomMin:a>this.options.zoomMax&&(a=this.options.zoomMax),a!=this.scale){var e=a/this.scale;b=void 0===b?this.wrapperWidth/2:b,c=void 0===c?this.wrapperHeight/2:c,d=void 0===d?300:d,b=b+this.wrapperOffset.left-this.x,c=c+this.wrapperOffset.top-this.y,b=b-b*e+this.x,c=c-c*e+this.y,this.scale=a,this.refresh(),b>0?b=0:b<this.maxScrollX&&(b=this.maxScrollX),c>0?c=0:c<this.maxScrollY&&(c=this.maxScrollY),this.scrollTo(b,c,d)}},_wheelZoom:function(a){var b,d,e=this;if(clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){e._execEvent("zoomEnd")},400),"deltaX"in a)b=-a.deltaY/c.abs(a.deltaY);else if("wheelDeltaX"in a)b=a.wheelDeltaY/c.abs(a.wheelDeltaY);else if("wheelDelta"in a)b=a.wheelDelta/c.abs(a.wheelDelta);else{if(!("detail"in a))return;b=-a.detail/c.abs(a.wheelDelta)}d=this.scale+b/5,this.zoom(d,a.pageX,a.pageY,0)},_initWheel:function(){h.addEvent(this.wrapper,"wheel",this),h.addEvent(this.wrapper,"mousewheel",this),h.addEvent(this.wrapper,"DOMMouseScroll",this),this.on("destroy",function(){clearTimeout(this.wheelTimeout),this.wheelTimeout=null,h.removeEvent(this.wrapper,"wheel",this),h.removeEvent(this.wrapper,"mousewheel",this),h.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(a){if(this.enabled){a.preventDefault();var b,d,e,f,g=this;if(void 0===this.wheelTimeout&&g._execEvent("scrollStart"),clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){g.options.snap||g._execEvent("scrollEnd"),g.wheelTimeout=void 0},400),"deltaX"in a)1===a.deltaMode?(b=-a.deltaX*this.options.mouseWheelSpeed,d=-a.deltaY*this.options.mouseWheelSpeed):(b=-a.deltaX,d=-a.deltaY);else if("wheelDeltaX"in a)b=a.wheelDeltaX/120*this.options.mouseWheelSpeed,d=a.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in a)b=d=a.wheelDelta/120*this.options.mouseWheelSpeed;else{if(!("detail"in a))return;b=d=-a.detail/3*this.options.mouseWheelSpeed}if(b*=this.options.invertWheelDirection,d*=this.options.invertWheelDirection,this.hasVerticalScroll||(b=d,d=0),this.options.snap)return e=this.currentPage.pageX,f=this.currentPage.pageY,b>0?e--:0>b&&e++,d>0?f--:0>d&&f++,void this.goToPage(e,f);e=this.x+c.round(this.hasHorizontalScroll?b:0),f=this.y+c.round(this.hasVerticalScroll?d:0),this.directionX=b>0?-1:0>b?1:0,this.directionY=d>0?-1:0>d?1:0,e>0?e=0:e<this.maxScrollX&&(e=this.maxScrollX),f>0?f=0:f<this.maxScrollY&&(f=this.maxScrollY),this.scrollTo(e,f,0)}},_initSnap:function(){this.currentPage={},"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap)),this.on("refresh",function(){var a,b,d,e,f,g,h=0,i=0,j=0,k=this.options.snapStepX||this.wrapperWidth,l=this.options.snapStepY||this.wrapperHeight;if(this.pages=[],this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(this.options.snap===!0)for(d=c.round(k/2),e=c.round(l/2);j>-this.scrollerWidth;){for(this.pages[h]=[],a=0,f=0;f>-this.scrollerHeight;)this.pages[h][a]={x:c.max(j,this.maxScrollX),y:c.max(f,this.maxScrollY),width:k,height:l,cx:j-d,cy:f-e},f-=l,a++;j-=k,h++}else for(g=this.options.snap,a=g.length,b=-1;a>h;h++)(0===h||g[h].offsetLeft<=g[h-1].offsetLeft)&&(i=0,b++),this.pages[i]||(this.pages[i]=[]),j=c.max(-g[h].offsetLeft,this.maxScrollX),f=c.max(-g[h].offsetTop,this.maxScrollY),d=j-c.round(g[h].offsetWidth/2),e=f-c.round(g[h].offsetHeight/2),this.pages[i][b]={x:j,y:f,width:g[h].offsetWidth,height:g[h].offsetHeight,cx:d,cy:e},j>this.maxScrollX&&i++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1===0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}}),this.on("flick",function(){var a=this.options.snapSpeed||c.max(c.max(c.min(c.abs(this.x-this.startX),1e3),c.min(c.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,a)})},_nearestSnap:function(a,b){if(!this.pages.length)return{x:0,y:0,pageX:0,pageY:0};var d=0,e=this.pages.length,f=0;if(c.abs(a-this.absStartX)<this.snapThresholdX&&c.abs(b-this.absStartY)<this.snapThresholdY)return this.currentPage;for(a>0?a=0:a<this.maxScrollX&&(a=this.maxScrollX),b>0?b=0:b<this.maxScrollY&&(b=this.maxScrollY);e>d;d++)if(a>=this.pages[d][0].cx){a=this.pages[d][0].x;break}for(e=this.pages[d].length;e>f;f++)if(b>=this.pages[0][f].cy){b=this.pages[0][f].y;break}return d==this.currentPage.pageX&&(d+=this.directionX,0>d?d=0:d>=this.pages.length&&(d=this.pages.length-1),a=this.pages[d][0].x),f==this.currentPage.pageY&&(f+=this.directionY,0>f?f=0:f>=this.pages[0].length&&(f=this.pages[0].length-1),b=this.pages[0][f].y),{x:a,y:b,pageX:d,pageY:f}},goToPage:function(a,b,d,e){e=e||this.options.bounceEasing,a>=this.pages.length?a=this.pages.length-1:0>a&&(a=0),b>=this.pages[a].length?b=this.pages[a].length-1:0>b&&(b=0);var f=this.pages[a][b].x,g=this.pages[a][b].y;d=void 0===d?this.options.snapSpeed||c.max(c.max(c.min(c.abs(f-this.x),1e3),c.min(c.abs(g-this.y),1e3)),300):d,this.currentPage={x:f,y:g,pageX:a,pageY:b},this.scrollTo(f,g,d,e)},next:function(a,b){var c=this.currentPage.pageX,d=this.currentPage.pageY;c++,c>=this.pages.length&&this.hasVerticalScroll&&(c=0,d++),this.goToPage(c,d,a,b)},prev:function(a,b){var c=this.currentPage.pageX,d=this.currentPage.pageY;c--,0>c&&this.hasVerticalScroll&&(c=0,d--),this.goToPage(c,d,a,b)},_initKeys:function(b){var c,d={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};if("object"==typeof this.options.keyBindings)for(c in this.options.keyBindings)"string"==typeof this.options.keyBindings[c]&&(this.options.keyBindings[c]=this.options.keyBindings[c].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(c in d)this.options.keyBindings[c]=this.options.keyBindings[c]||d[c];h.addEvent(a,"keydown",this),this.on("destroy",function(){h.removeEvent(a,"keydown",this)})},_key:function(a){if(this.enabled){var b,d=this.options.snap,e=d?this.currentPage.pageX:this.x,f=d?this.currentPage.pageY:this.y,g=h.getTime(),i=this.keyTime||0,j=.25;switch(this.options.useTransition&&this.isInTransition&&(b=this.getComputedPosition(),this._translate(c.round(b.x),c.round(b.y)),this.isInTransition=!1),this.keyAcceleration=200>g-i?c.min(this.keyAcceleration+j,50):0,a.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?e+=d?1:this.wrapperWidth:f+=d?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?e-=d?1:this.wrapperWidth:f-=d?1:this.wrapperHeight;break;case this.options.keyBindings.end:e=d?this.pages.length-1:this.maxScrollX,f=d?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:e=0,f=0;break;case this.options.keyBindings.left:e+=d?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:f+=d?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:e-=d?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:f-=d?1:5+this.keyAcceleration>>0;break;default:return}if(d)return void this.goToPage(e,f);e>0?(e=0,this.keyAcceleration=0):e<this.maxScrollX&&(e=this.maxScrollX,this.keyAcceleration=0),f>0?(f=0,this.keyAcceleration=0):f<this.maxScrollY&&(f=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(e,f,0),this.keyTime=g}},_animate:function(a,b,c,d){function e(){var m,n,o,p=h.getTime();return p>=l?(f.isAnimating=!1,f._translate(a,b),void(f.resetPosition(f.options.bounceTime)||f._execEvent("scrollEnd"))):(p=(p-k)/c,o=d(p),m=(a-i)*o+i,n=(b-j)*o+j,f._translate(m,n),void(f.isAnimating&&g(e)))}var f=this,i=this.x,j=this.y,k=h.getTime(),l=k+c;this.isAnimating=!0,e()},handleEvent:function(a){switch(a.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(a),this.options.zoom&&a.touches&&a.touches.length>1&&this._zoomStart(a);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":if(this.options.zoom&&a.touches&&a.touches[1])return void this._zoom(a);this._move(a);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":if(this.scaled)return void this._zoomEnd(a);this._end(a);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(a);break;case"wheel":case"DOMMouseScroll":case"mousewheel":if("zoom"==this.options.wheelAction)return void this._wheelZoom(a);this._wheel(a);break;case"keydown":this._key(a)}},resetPassthrough:function(a){void 0!=a&&(this.options.eventPassthrough=a,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&!0,this.options.scrollY="vertical"==this.options.eventPassthrough?!1:!0,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,a===!1&&(this.initiated=1))}},f.prototype={handleEvent:function(a){switch(a.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(a);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(a);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(a)}},destroy:function(){this.options.fadeScrollbars&&(clearTimeout(this.fadeTimeout),this.fadeTimeout=null),this.options.interactive&&(h.removeEvent(this.indicator,"touchstart",this),h.removeEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.removeEvent(this.indicator,"mousedown",this),h.removeEvent(a,"touchmove",this),h.removeEvent(a,h.prefixPointerEvent("pointermove"),this),h.removeEvent(a,"mousemove",this),h.removeEvent(a,"touchend",this),h.removeEvent(a,h.prefixPointerEvent("pointerup"),this),h.removeEvent(a,"mouseup",this)),this.options.defaultScrollbars&&this.wrapper.parentNode.removeChild(this.wrapper)},_start:function(b){var c=b.touches?b.touches[0]:b;b.preventDefault(),b.stopPropagation(),this.transitionTime(),this.initiated=!0,this.moved=!1,this.lastPointX=c.pageX,this.lastPointY=c.pageY,this.startTime=h.getTime(),this.options.disableTouch||h.addEvent(a,"touchmove",this),this.options.disablePointer||h.addEvent(a,h.prefixPointerEvent("pointermove"),this),this.options.disableMouse||h.addEvent(a,"mousemove",this),this.scroller._execEvent("beforeScrollStart")},_move:function(a){var b,c,d,e,f=a.touches?a.touches[0]:a;h.getTime();this.moved||this.scroller._execEvent("scrollStart"),this.moved=!0,b=f.pageX-this.lastPointX,this.lastPointX=f.pageX,c=f.pageY-this.lastPointY,this.lastPointY=f.pageY,d=this.x+b,e=this.y+c,this._pos(d,e),a.preventDefault(),a.stopPropagation()},_end:function(b){if(this.initiated){if(this.initiated=!1,b.preventDefault(),b.stopPropagation(),h.removeEvent(a,"touchmove",this),h.removeEvent(a,h.prefixPointerEvent("pointermove"),this),h.removeEvent(a,"mousemove",this),this.scroller.options.snap){var d=this.scroller._nearestSnap(this.scroller.x,this.scroller.y),e=this.options.snapSpeed||c.max(c.max(c.min(c.abs(this.scroller.x-d.x),1e3),c.min(c.abs(this.scroller.y-d.y),1e3)),300);
(this.scroller.x!=d.x||this.scroller.y!=d.y)&&(this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=d,this.scroller.scrollTo(d.x,d.y,e,this.scroller.options.bounceEasing))}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(a){a=a||0;var b=h.style.transitionDuration;if(b&&(this.indicatorStyle[b]=a+"ms",!a&&h.isBadAndroid)){this.indicatorStyle[b]="0.0001ms";var c=this;g(function(){"0.0001ms"===c.indicatorStyle[b]&&(c.indicatorStyle[b]="0s")})}},transitionTimingFunction:function(a){this.indicatorStyle[h.style.transitionTimingFunction]=a},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(h.addClass(this.wrapper,"iScrollBothScrollbars"),h.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(h.removeClass(this.wrapper,"iScrollBothScrollbars"),h.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));this.wrapper.offsetHeight;this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=c.max(c.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=-this.indicatorWidth+8,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=c.max(c.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=-this.indicatorHeight+8,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var a=this.options.listenX&&c.round(this.sizeRatioX*this.scroller.x)||0,b=this.options.listenY&&c.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(a<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=c.max(this.indicatorWidth+a,8),this.indicatorStyle.width=this.width+"px"),a=this.minBoundaryX):a>this.maxBoundaryX?"scale"==this.options.shrink?(this.width=c.max(this.indicatorWidth-(a-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",a=this.maxPosX+this.indicatorWidth-this.width):a=this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),b<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=c.max(this.indicatorHeight+3*b,8),this.indicatorStyle.height=this.height+"px"),b=this.minBoundaryY):b>this.maxBoundaryY?"scale"==this.options.shrink?(this.height=c.max(this.indicatorHeight-3*(b-this.maxPosY),8),this.indicatorStyle.height=this.height+"px",b=this.maxPosY+this.indicatorHeight-this.height):b=this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px")),this.x=a,this.y=b,this.scroller.options.useTransform?this.indicatorStyle[h.style.transform]="translate("+a+"px,"+b+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=a+"px",this.indicatorStyle.top=b+"px")},_pos:function(a,b){0>a?a=0:a>this.maxPosX&&(a=this.maxPosX),0>b?b=0:b>this.maxPosY&&(b=this.maxPosY),a=this.options.listenX?c.round(a/this.sizeRatioX):this.scroller.x,b=this.options.listenY?c.round(b/this.sizeRatioY):this.scroller.y,this.scroller.scrollTo(a,b)},fade:function(a,b){if(!b||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var c=a?250:500,d=a?0:300;a=a?"1":"0",this.wrapperStyle[h.style.transitionDuration]=c+"ms",this.fadeTimeout=setTimeout(function(a){this.wrapperStyle.opacity=a,this.visible=+a}.bind(this,a),d)}}},d.utils=h,"undefined"!=typeof module&&module.exports?module.exports=d:"function"==typeof define&&define.amd?define(function(){return d}):a.IScroll=d}(window,document,Math);