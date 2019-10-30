/// code from common-make-variables.s3js - start ///
var colBuildVersion =  "?buildversion=181210172434";
var $verstion = "?buildversion=181210172434";
var $version_and = "&buildversion=181210172434";
var _bulletinPath = "/seeyon/m3/apps/v5/bulletin";
var _cap4Path = "/seeyon/m3/apps/v5/cap4";
var _cmpPath = "/seeyon/m3/cmp";
var _collPath = "/seeyon/m3/apps/v5/collaboration";  
var _common_v5_path = "/seeyon/m3/apps/v5/commons";
var _deePath = "/seeyon/m3/apps/v5/dee";
var _docPath = "/seeyon/m3/apps/v5/doc";
var _formPath = "/seeyon/m3/apps/v5/form";
var _meetingPath = "/seeyon/m3/apps/v5/meeting";
var _newsPath = "/seeyon/m3/apps/v5/news";
var _unflowform = "/seeyon/m3/apps/v5/unflowform";
var _wfPath = "/seeyon/m3/apps/v5/workflow";
//other jssdk
var editContent_jssdk = "/seeyon/m3/apps/v5/commons/js/editContent-jssdk.js?buildversion=181210172433";
var signet_jssdk = "/seeyon/m3/apps/v5/commons/js/signet-jssdk.js?buildversion=181210172433";
var template_jssdk = "/seeyon/m3/apps/v5/commons/js/template-jssdk.js?buildversion=181210172433";
var user_jssdk = "/seeyon/m3/apps/v5/commons/js/user-jssdk.js?buildversion=181210172433";
var doc_jssdk = "/seeyon/m3/apps/v5/doc/js/doc-jssdk.js?buildversion=181210172433";
var commonPhrase_jssdk = "/seeyon/m3/apps/v5/commons/js/commonPhrase-jssdk.js?buildversion=181210172433";
var workflow_jssdk = "/seeyon/m3/apps/v5/workflow/js/workflow-jssdk.js?buildversion=181210172433";
var cmporgnization_jssdk = "/seeyon/m3/apps/v5/commons/js/cmporgnization-jssdk.js?buildversion=181210172433";
var dee_jssdk = "/seeyon/m3/apps/v5/dee/js/dee-jssdk.js?buildversion=181210172433";
var news_jssdk = "/seeyon/m3/apps/v5/news/js/news-jssdk.js?buildversion=181210172433";
var bulletin_jssdk = "/seeyon/m3/apps/v5/bulletin/js/bulletin-jssdk.js?buildversion=181210172433";
var bbs_jssdk = "/seeyon/m3/apps/v5/bbs/js/bbs-jssdk.js?buildversion=181210172433";
var last_jssdk = "/seeyon/m3/apps/v5/commons/wechat-jssdk.js?buildversion=181210172433";
var unflowform_jssdk = "/seeyon/m3/apps/v5/unflowform/js/unflowform-jssdk.js?buildversion=181210172434";
/// code from common-make-variables.s3js - end ///
var KEY_CODE = {
        DOWN: 40,
        UP: 38,
        ESC: 27,
        TAB: 9,
        ENTER: 13,
        CTRL: 17,
        A: 65,
        P: 80,
        N: 78,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        BACKSPACE: 8,
        SPACE: 32,
        At_2 : 50
  };

/**
 * 缓加载工具类
 */
var LazyUtil = (function(){
    
  //缓加载机制
    var lazyStack = {};
    var lazyBindIndex = 0;
    var lazyBindStack = {}
    var lazyUnfinish = 0;
    function LazyTool(){}
    LazyTool.prototype.addLazyStack = function(item){
        
        /**
         * item.code 字符串 | 堆栈标识
         * item.depend 字符串 | 依赖的js
         * item.dependModel strong/强关联，必须等父任务执行完成后在进行加载  weak/若关联，加载顺序没关系（默认值）
         * item.css 数组 | css数组
         * item.js  数组 | js数组
         * 
         */
        if(item.code){
            var i = lazyStack[item.code];
            if(!i){
                item.loaded = false;
                item.isLoading = false;
                lazyStack[item.code] = item;
                
                lazyUnfinish++;
                
            }else{
                console.warn("重复设置懒加载, code=" + item.code);
            }
        }else{
            alert(cmp.i18n("collaboration.exception.setException"));
        }
    };
    
  //启动懒加载
    LazyTool.prototype.startLazy = function(groups){
        
        for(var k in lazyStack){
            
            var thisI = lazyStack[k], _this = this;
            if(thisI.loaded || thisI.isLoading){
                continue;
            }
            //按组加载
            if(groups && thisI.groups != groups){
                continue;
            }
            thisI.isLoading = true;
            
            function loadThis(i){
                if(i.css && i.css.length > 0){
                    cmp.asyncLoad.css(i.css);
                }
                if(i.js && i.js.length > 0){
                    //console.log("开始加载:" + i.js);
                    cmp.asyncLoad.js(i.js, function(){
                        //console.log("完成加载:" + i.js);
                        _this._onJSLoad(i);
                    });
                }else{
                    _this._onJSLoad(i);
                }
            }
            
            if(thisI.depend && thisI.dependModel === "strong"){
                (function(child){
                    _this.addLoadedFn(child.depend, function(){
                        loadThis(child);
                    });
                })(thisI);
            }else{
                loadThis(thisI);
            }
        }
    };
    
    /**
     * 是否全部加载完成
     */
    LazyTool.prototype.isFinishAll = function(){
        return lazyUnfinish == 0;
    }
    
    /**
     * js加载完成后执行脚本
     */
    LazyTool.prototype._onJSLoad = function(i){
        
        lazyUnfinish--;
        
        var _this = this;
        i.loaded = true;
        if(i.functions && i.functions.length > 0){
            var checkRet = _this.isLoadChain(i.code);
            if(checkRet.finish){
                for(var j = 0; j < i.functions.length; j++){
                    i.functions[j]();
                }
                i.functions = [];
            }else{
                //事件转移
                for(var j = 0; j < i.functions.length; j++){
                    //console.log("事件转移:" + i.code + " to " + checkRet.code);
                    _this.addLoadedFn(checkRet.code, i.functions[j]);
                }
                i.functions = [];
            }
        }
    }
    
  //加载脚本加载完成后
    LazyTool.prototype.addLoadedFn = function(code, fn){
        //console.log("接收转移事件:code=" + code + " fn=" + fn);
        var i = lazyStack[code], _this = this;
        if(i){
            var checkRet = _this.isLoadChain(i.code);
            if(checkRet.finish){
                fn();
            }else{
                if(checkRet.code == i.code){
                    i.functions = i.functions || [];
                    i.functions.push(fn);
                }else{
                    //转移
                    _this.addLoadedFn(checkRet.code, fn);
                }
            }
        }else{
            fn();
        }
    };
    
    /**
     * 校验懒加载是否加载完成了
     * @param code
     */
    LazyTool.prototype.isLoad = function(code){
        
        var i = lazyStack[code];
        if(i){
            return this.isLoadChain(i.code).finish;
        }
        return true;
    }
    
  //校验依赖路径是否加载完成
    LazyTool.prototype.isLoadChain = function(code){
        
        if(!code){
            return {
                "finish" : true
            };
        }else{
            var i = lazyStack[code];
            if(!i.loaded){
                return {
                    "finish" : false,
                    "code" : code
                };
            }else{
                return this.isLoadChain(i.depend);
            }
        }
    };
    
    /** 延迟点击事件提醒  **/
    LazyTool.prototype._lazyBindInfo = function(){
        _alert(cmp.i18n("collaboration.page.lable.onloading"));//页面正在加载，请稍后点击.
    }
    
    /**
     * 
     * 延迟绑定事件
     * 
     **/
    LazyTool.prototype.lazyBindEven = function(lazyCods, ele, event, fn, useCapture){
        
        if(!lazyCods){
            ele.addEventListener(event, fn, useCapture);
        }else{
            var codes = lazyCods.split(",");
            
            //添加默认事件
            ele.addEventListener(event, this._lazyBindInfo, useCapture);
            
            var bindKey = "lazy_bind_" + (lazyBindIndex++);
            lazyBindStack[bindKey] = codes.length;
            
            for(var i = 0; i < codes.length; i++){
                
                (function(_this, lazyBindKey, lazyCode, ele, event, fn, useCapture){
                    
                    _this.addLoadedFn(lazyCode, function(){
                        
                        var leftSize = lazyBindStack[lazyBindKey] - 1;
                        if(leftSize < 1){
                            ele.removeEventListener(event, _this._lazyBindInfo, useCapture);
                            ele.addEventListener(event, fn, useCapture);
                            delete lazyBindStack[lazyBindKey];
                        }
                        
                        _this = null;
                        lazyBindKey = null;
                        ele = null;
                        event = null;
                        fn = null;
                        useCapture = null;
                    });
                    
                })(this, bindKey, codes[i], ele, event, fn, useCapture);
            }
        }
        
    };
    
    return new LazyTool();
})();

/**
 * 快速请求，用法同LazyUtil
 */
var FastUtil = (function(){
    
    var fastStack = {};
    
    function FastTool(){}
    
    /**
     * 添加请求
     * request.code 字符串 | 堆栈标识
     * request.loadCache function | 应用层加载缓存， 返回true,表示缓存加载成功， 返回false, 表示需要请求
     * request.setting json对象， ajax请求内容
     */
    FastTool.prototype.addFast = function(req){
        
        if(req.code){
            var i = fastStack[req.code];
            if(!i){
                req.loaded = false;
                req.isError = false;
                req.called = false;
                req.isCache = false;
                
                fastStack[req.code] = req;
                this._exeFast(req);
            }else{
                console.warn("重复设置首屏加载, code=" + req.code);
            }
        }else{
            alert(cmp.i18n("collaboration.exception.setException"));
        }
    }
    
    /**
     * 调用加载
     * @param code
     * @param config
     */
    FastTool.prototype.call = function(code, config){
        
        var req = fastStack[code];
        if(req){
            if(!code.called){
                if(req.loaded){
                    this._exeCallBack(req, config);
                }else{
                    req.callConfig = config;
                }
            }else{
                console.warm("code is called, code=" + code);//请求已经被调用
            }
        }else{
            alert(cmp.i18n("collaboration.page.lable.noRegisRequest")+", code=" + code);//没有注册请求
        }
    }
    
    /**
     * 执行回调
     * @param req
     * @param config
     */
    FastTool.prototype._exeCallBack = function(req, config){
        
        if(config){
            if(req.isError){
                config.error && config.error(req.data, req.isCache); 
            }else{
                config.success && config.success(req.data, req.isCache);
            }
        }
        req.called = true;
        delete req.callConfig;
        delete req.data;
    }
    
    /**
     * 执行请求
     * @param setting
     * setting.url
     * setting.method
     */
    FastTool.prototype._exeFast = function(pReq){
        
        (function(req, _this){
          //没有缓存
            if(req.loadCache && !req.loadCache()){
                
                var setting = req.setting;
                
                var u = setting.url;
                var lang = navigator.language || 'zh-CN';
                cmp.ajax({
                    cmpReady2Fire:false,//是否是在ready后再执行callback
                    fastAjax:true,
                    remote : true,
                    type:setting.method || "GET",
                    url:cmp.seeyonbasepath + '/rest/' + u ,
                    headers:{Accept: "application/json; charset=utf-8", "Accept-Language": lang, "Content-Type": "application/json; charset=utf-8", token: cmp.token},
                    dataType : "json",
                    success:function(result){
                        req.loaded = true;
                        req.data = result;
                        if(req.callConfig){
                            _this._exeCallBack(req, req.callConfig);
                        }
                        delete req.setting;
                    },
                    error:function(error){
                        req.loaded = true;
                        req.isError = true;
                        req.data = error;
                        if(req.callConfig){
                            _this._exeCallBack(req, req.callConfig);
                        }
                        console.error(error);
                        delete req.setting;
                    }
                });
            }else{
                req.isCache = true;
                req.loaded = true;
                if(req.callConfig){
                    _this._exeCallBack(req, req.callConfig);
                }
                delete req.setting;
            }
        })(pReq, this);
    }
    
    return new FastTool();
    
})(); 

/**
 * 协同各个页面缓存key管理
 */
var CollCacheKey = (function(){

    var cacheMap = {
         "summary" : {
             "detail":"",
             "workflow":"",
             "senderComment" : "",
             "replyComment" : "",
             "comment" : "",
             "moreComment" : "",
             "summaryBO" : "",
             "dealer" : ""
         }
    }
    
    function createPath(src, obj){
        
        for(var key in obj){
            
            var nowPath = src + key + "_";
            
            if(obj[key] != ""){
                createPath(nowPath, obj[key]);
            }else if(obj[key] == ""){
                obj[key] = nowPath;
            }
        }
    }
    
    var root = "m3_v5_collaboration_";
    createPath(root, cacheMap);
    createPath = null;
    
    /**
     * 获取域下的所有缓存前缀
     */
    cacheMap.getCacheKeys = function(pObj, subfix){
        var keys = [], doSearch, sub = subfix || "";
        
        function doSearch(obj, arr){
            
            if(typeof obj === "string"){
                    arr.push(obj + sub);
            }else{
                for(var key in obj){
                    doSearch(obj[key], arr);
                }
            }
        }
        doSearch(pObj, keys);
        return keys;
    }
    
    /**
     * 删除域下的前缀与后缀拼接的缓存
     */
    cacheMap.delCacheKeys = function(pObj, subfix){
        var keys = CollCacheKey.getCacheKeys(pObj);
        for(var i = 0; i < keys.length; i++){
            cmp.storage.removeCacheData(keys[i] + subfix, true);
        }
        return keys;
    }
    
    return cacheMap;
})();

/**
 * 多webview事件名称前缀
 */
var WebEvents = {
    
    M3_EVENT_SUMMARY : "m3_event_coll_summary_",
    M3_EVENT_COMMENT : "m3_event_coll_comment_"
}


/**
 * 公共方法
 */
var CollUtils = {

    // 查看Value是否在array中
    isInArray : function(array, value) {
        var ret = false;
        if (array && array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                if (value == array[i]) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    },

    // 找到ID下面的所有input 和 textarea，通过ID拼装成json
    formPostData : function(selector) {
        var ret = {}

        function _formData(type, ele, retJson) {
            var inputs = ele.querySelectorAll(type);
            if (inputs && inputs.length > 0) {
                for (var i = 0, len = inputs.length; i < len; i++) {
                    var input = inputs[i];
                    var tempId = input.getAttribute("id");
                    if (!tempId) {
                        tempId = input.getAttribute("name");
                    }
                    if (tempId) {
                        var inputType = input.getAttribute("type");
                        if(inputType && (inputType.toLocaleLowerCase == "radio" || inputType.toLocaleLowerCase == "checkbox"))
                            retJson[tempId] = input.checked;
                        else
                            retJson[tempId] = CollUtils.filterUnreadableCode(input.value);
                    }
                }
            }
        }
        var ele = typeof selector == "object" ? selector : document.getElementById(selector);
        if (ele) {
            _formData("input", ele, ret);
            _formData("textarea", ele, ret);
        }

        return ret;
    },
    fillDom : function(selector, datas){
        
        var $dom = typeof selector == "object" ? selector : document.querySelector(selector);
        if($dom && datas){
            for(var key in datas){
                CollUtils.setDomainFieldVal($dom, key, datas[key]);
            }
        }
    },
    
    //设置某个值域的具体字段的值
    setDomainFieldVal : function(domain, fieldId, val){
        if(val == null){
        	return;
        }
        var domEle = null;
        if (typeof domain === 'object'){
            domEle = domain;
        }else if(typeof domain === 'string') {
            domEle = document.querySelector("#" + domain);
        }
        if(domEle){
            var fieldEle = domEle.querySelector("#" + fieldId);
            if(fieldEle){
                var inputType = fieldEle.getAttribute("type");
                if(inputType && (inputType.toLocaleLowerCase == "radio" || inputType.toLocaleLowerCase == "checkbox"))
                    fieldEle.checked = val === true;
                else
                    fieldEle.value = val;
                
            }
        }
    },

    trim : function(str) {
        var ret = "";
        if (str) {
            ret = str.replace(/(^\s*)|(\s*$)/g, "");
        }
        return ret;
    },

    getElementLeft : function(element) {// 获得某元素在网页中的绝对向左位置
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;

        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    },

    getElementTop : function(element) {// 获得某元素在网页中的绝对顶部位置
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    },

    getElementLocal : function(e) {
        return {
            "left" : this.getElementLeft(e),
            "top" : this.getElementTop(e)
        }
    },

    //判断是不是CMP壳
    isCMPShell : function(){
    	return cmp.platform.CMPShell;
    },
    getBackURL:function(){
        return CollUtils.getHrefParam("backURL");
    },
    getQueryString : function(){
        return window.location.search + window.location.hash;
    },
    getCurrentURL : function(){
        
    },
    getHrefParam:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var s = window.location.search;
        if(!s){
            s = window.location.hash;
        }
        if(s){
            var r = s.substr(1).match(reg);
            if(r!=null)
                return  unescape(r[2]); 
        }
        return "";
    },
    getHrefQuery: function ()  {
        
        var url = window.location.search,
            reg_url = /^\?([\w\W]+)$/, 
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g, 
            arr_url = reg_url.exec(url), 
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },
    isEmptyObj : function(obj){
        var ret = true;
        if(typeof obj === "object"){
            if(obj instanceof Array && obj.length > 0){
                ret = false;
            }else{
                for (var t in obj){
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    },
    
    /** 过滤emoji字符 **/
    filterUnreadableCode : function(val){
        
        if(!val){
            return val;
        }
        
        //ios输入中文只输入拼音不选汉字时特殊字符进行替换
        val = val.replace(/\u2006/g, " ");//8203特殊字符
        
        return val;
        
        //emoji表情
       /* var ranges = [
                      '\ud83c[\udf00-\udfff]', 
                      '\ud83d[\udc00-\ude4f]', 
                      '\ud83d[\ude80-\udeff]'
                  ];
        
        return val.replace(new RegExp(ranges.join('|'), 'g'), '');*/
    },
    getCharacter : function(selector, pos){
        var $input, inputValue, c = "";
        $input = typeof selector == "object" ? selector : document.querySelector(selector);
        if (pos === void 0) {
            pos = CollUtils.getPos($input);
        }
        inputValue = $input.value;
        if(inputValue && pos > 0){
            c = inputValue.slice(pos - 1, pos);
        }
        
        return c;
    },
    getPos : function(selector){
        var inputor;
        inputor = typeof selector == "object" ? selector : document.querySelector(selector);
        return inputor.selectionStart;
    },
    setPos : function(selector, pos){
        var inputor;
        inputor = typeof selector == "object" ? selector : document.querySelector(selector);
        inputor.setSelectionRange(pos, pos);
        //inputor.selectionStart = inputor.selectionEnd = pos;
        return inputor;
    },
    /**
     * 
     * 弹出框
     * 
     * API:
     * close() : 关闭窗口，并移除dom
     * hide() : 影藏dom
     * show() : 显示dom
     * 
     * container : 最外层的容器
     * mainDiv : 内容容器
     * mainDivHeight : 内容区域高度
     * bottonDIV : 底部容器
     * header : 头上容器
     * isVisible : 是否可见
     * 
     */
    openDialog : function(config){

        return new ColH5Dialog(config);
    },
    initAttStyle : function(selector, fileList){
        var loadParam = {
                selector : selector,
                atts : fileList
            }
        return new SeeyonAttachment({"loadParam" : loadParam});
    },
    getTextDealComment : function (selector){
        
        var tValue, $input;
        
        $input = typeof selector == "object" ? selector : document.querySelector(selector);
        tValue = CollUtils.filterUnreadableCode($input.value);
        
        return tValue;
    },
    fnFontCount : function (selector, fontSelector, maxSize) {
        
        var $input, $fontCount, content;
        
        $input = typeof selector == "object" ? selector : document.querySelector(selector);
        $fontCount = typeof fontSelector == "object" ? fontSelector : document.querySelector(fontSelector);
        
        content = CollUtils.getTextDealComment($input);
        if (content.length > maxSize) {
            $input.value = content.substr(0, maxSize);
            content = $input.value;
        }
        // 剩余可以输入的字数
        $fontCount.innerHTML = maxSize - content.length;
    },
    //展现Affair状态
    showAffairState : function(state, subState, backFromId){
        var nowState,bgcolor,stateIcon;
        
        if(state == 1){
            nowState = cmp.i18n("collaboration.default.tempToDo");
            bgcolor = "other";
            stateIcon = "see-icon-v5-common-more-circle-fill";
        }else if(state == 3){
            if(subState == 13){
                //暂存待办
                nowState = cmp.i18n("collaboration.default.tempToDo");
                bgcolor = "other";
                stateIcon = "see-icon-v5-common-more-circle-fill";
            }else if(subState == 15 || subState == 17){
                //指定回退
                nowState = cmp.i18n("collaboration.default.stepBack");
                bgcolor = "other";
                stateIcon = "see-icon-v5-common-rollback-fill";
            }else if(subState != 13 && subState != 15 && subState != 17 && backFromId != null){      
                //被回退
                nowState = cmp.i18n("collaboration.default.beBack");
                bgcolor = "other";
                stateIcon = "see-icon-v5-common-beback";
            }else if(subState == 11){
                //未读
                nowState = cmp.i18n("collaboration.default.unread");
                bgcolor = "other";
                stateIcon = "see-icon-v5-common-unview-circle-fill";
            }else{
                //已读
                nowState = cmp.i18n("collaboration.default.read");
                bgcolor = "has-read";
                stateIcon = "see-icon-v5-common-view-circle-fill";
            }
            
        }else if(state == 4){//已办
            if(subState == 21){//被终止
                nowState = cmp.i18n("collaboration.page.lable.button.terminate");
                stateIcon = "see-icon-v5-common-stop-circle-fill";
                bgcolor = "has-stop";
            }else if(subState == 25){//主动终止
            	nowState = cmp.i18n("collaboration.page.lable.button.terminate");
                stateIcon = "see-icon-v5-common-stop-circle-fill";
                bgcolor = "has-stop-node";
            }else{//已办
                nowState = cmp.i18n("collaboration.default.done");
                stateIcon = "see-icon-success-circle-fill";
                bgcolor = "has-haddle";
            }
        }else{
        	if(state=="2" && subState=="0"){
        		nowState = cmp.i18n("collaboration.default.sent");
        		bgcolor = "sent";
        	}else{
        		//暂存待办
        		nowState = cmp.i18n("collaboration.default.tempToDo");
        		bgcolor = "other";
        		stateIcon = "see-icon-v5-common-more-circle-fill";
        	}
        }
        
        return {
            "label" : nowState,
            "color" : bgcolor,
            "icon" : stateIcon
        }
    },
    loadCache : function(key, isDel){
        var ret = null, storageObj;
        
        storageObj = cmp.storage.get(key, true);
        if(storageObj) {
            ret = JSON.parse(storageObj);
            if(isDel === true){
                cmp.storage["delete"](key, true);
            }
        }
        return ret;
    },
    /*loadCache : function(key, isDel){
        var ret = null, storageObj;
        storageObj = sessionStorage.getItem(key);
        if(storageObj) {
            ret = JSON.parse(storageObj);
            if(isDel === true){
                sessionStorage.removeItem(key);
            }
        }
        return ret;
    },*/
    mask : function(show){
        
        var markDom;
        
        markDom = document.querySelector("#_collaboration_mask_");
        
        if(show === true || show === void 0){
            if(!markDom){
                CollUtils._creatMask();
            }
        }else{
            markDom && markDom.remove();
        }
    },
    _creatMask : function(){
        var dom = document.createElement("div");
        dom.setAttribute("id", "_collaboration_mask_");
        with(dom.style){
            position = "absolute";
            width = "100%";
            height = "100%";
            opacity = "0";
            zIndex = "40";
        }
        document.body.appendChild(dom);
    },
    isFromM3NavBar : function(){
    	var isFromM3NavBar = window.location.href.match('m3from=navbar');
    	return isFromM3NavBar == "m3from=navbar";
    },
    /** 将obj拼接成URL **/
    transObj2Url : function(obj, start, ignoreNull, defaultURL){
        var url = start || "?", split="", changeURL;
        for(var key in obj){
            var v = obj[key] || "";
            if(v === "" && ignoreNull === true){
                continue;
            }
            changeURL = true;
            url += split + key + "=" + v;
            if(split == ""){
                split = "&";
            }
        }
        if(changeURL){
            return url;
        }
        return defaultURL;
    }
    
}


var ColH5Dialog = (function(){
    
    var ColDialog = function(config){
        
        var defaultConfig = {
                
                initHeader : true,//是否加载头部
                title : "",
                dir : "bottom-go",//动画方向 left-go right-go bottom-go top-go
                zIndex : "15",//层级
                id : "H5_DIALOG_" + (new Date().getTime()),//
                containerId : "H5_DIALOG_CONTAINER_" + (new Date().getTime()),
                containerExtClass : "",//扩展class
                bottonId : "H5_DIALOG_BOTTON_" + (new Date().getTime()),
                show : true,//默认显示
                hideType : "close",//取消层级时方式 colse : 关闭，  hide : 影藏
                //正文区域内容，需要返回HTML代码或者dom对象
                initHTML : function(){return "";},
                onShow : null,
                onHide : null,
                onClose : null,
                beforeDisappear : null,//关闭或隐藏之前执行
                onInit : null,//加载完成后执行方法，主要用于事件绑定
                /*
                //左侧按钮配置
                leftBtnConfig :{
                    label:"",
                    extClass : "",
                    hander:function(){}
                },
                //右侧按钮配置
                rightBtnConfig : {
                    label : "",
                    extClass : "",
                    hander : function(){}
                },
                //底部配置
                bottonConfig : {
                   type : 0,
                   label : "",
                   extClass : "",
                   buttons :[
                       { 
                           label : "确定",
                           hander : function(){
                           }
                       }
                   ]
                }*/
        }
        
        for(var key in defaultConfig){
            if(typeof config[key] === "undefined"){
                config[key] = defaultConfig[key];
            }
        }
        
        //最外层的DOM
        this.container = null;
        this.mainDiv = null;
        this.bottonDIV = null;
        this.bottonHeight = 0;
        this.header = null;
        this.headerHeight = 0;
        this.setHeight = false;//标记是否设置了高度， 和滚动
        this.isVisible= false;
        this.popFun = null;//点手机返回触发事件
        this.beforeTitle = "";//修改前的标题
        this.title = "";//当前页面的 title
        
        this._init_ = function(){
          
            // 记录修改前的标题
            this.beforeTitle = document.querySelector("title").innerText;
         
            // 记录当前头部的标题
            this.title = config.title;
            
            //动画模块
            var tempContainer = document.createElement("DIV");
            tempContainer.className = "GM_Alert_Content Animated-Container " + config.dir + " animated";
            tempContainer.setAttribute("id", config.id);
            tempContainer.style.zIndex = config.zIndex;
            tempContainer.style.background = "#fff";
            
            // 设置了需要初始化头部
            if(config.initHeader === true){
                
                var tempHeader = document.createElement("header");
                tempHeader.className = "cmp-bar cmp-bar-nav head-style";
                //tempHeader.style.position = "static";
                
                //设置高度
                //var mainHeader = document.querySelector("body>header");
                var mainHeader = document.querySelector("header");
                if(mainHeader){
                    
                    this.headerHeight = mainHeader.offsetHeight;
                    
                    if(this.headerHeight == 0){
                        this.headerHeight = 44;
                        tempHeader.style.height = this.headerHeight + "px";
                    }else{
                        
                        tempHeader.style.height = mainHeader.style.height;;
                        tempHeader.style.paddingTop = mainHeader.style.paddingTop;
                    }
                    
                }else{
                 // 原生去头部适配
                    this.headerHeight = 44;
                    tempHeader.style.height = this.headerHeight + "px";
                }
                
                //左上角按钮
                if(config.leftBtnConfig){
                    var lConfig = config.leftBtnConfig;
                    var lNav = document.createElement("a");
                    lNav.className = "cmp-pull-left " + (lConfig.extClass  || "");
                    lNav.innerText = lConfig.label;
                    lNav.setAttribute("href", "javascript:void(0)");
                    if(lConfig.hander){
                        cmp.event.click(lNav, function(){
                            lConfig.hander();
                        });
                        /*lNav.addEventListener('tap', function(){
                            lConfig.hander();
                        });*/
                        if(lConfig.isPopBtn === true){
                            this.popFun = lConfig.hander;
                        }
                    }
                    tempHeader.appendChild(lNav);
                }
                
                //右上角按钮
                if(config.rightBtnConfig){
                    var rConfig = config.rightBtnConfig;
                    var nav = document.createElement("a");
                    nav.className = "cmp-pull-right right-btn " + (rConfig.extClass || "");//
                    nav.innerText = rConfig.label;
                    nav.style.fontSize = "14px";
                    nav.style.height = "100%";
                    // if(this.headerHeight){
                    //     nav.style.lineHeight = this.headerHeight + "px";
                    // }
                    //nav.style.marginTop = "6px";//同左边图标底部保持相同高度
                    nav.setAttribute("href", "javascript:void(0)");
                    if(rConfig.hander){
                        cmp.event.click(nav, function(){
                            rConfig.hander();
                        });
                        /*nav.addEventListener('tap', function(){
                            rConfig.hander();
                        });*/
                        if(rConfig.isPopBtn === true){
                            this.popFun = rConfig.hander;
                        }
                    }
                    tempHeader.appendChild(nav);
                }
               
                
                var tempTitle = document.createElement("h1");
                tempTitle.className = "cmp-title";
                tempTitle.innerText = config.title;
                tempHeader.appendChild(tempTitle);
                tempContainer.appendChild(tempHeader);
                
                
                this.header = tempHeader;
            }
            
            
            //流程展示容器
            var showEl = document.createElement("div");
            showEl.className = "GM_item_container " + (config.containerExtClass || "");
            showEl.setAttribute("id", config.containerId);
            //showEl.style.position = "static";
            showEl.style.top = "0";
            var cHTML = config.initHTML();
            if(cHTML){
                if (typeof cHTML === 'object'){
                    showEl.appendChild(cHTML);
                }else if (typeof cHTML === 'string'){
                    showEl.innerHTML = cHTML;
                }
            }
            tempContainer.appendChild(showEl);
            
            //底部区域
            if(config.bottonConfig){
                var pButtons = config.bottonConfig.buttons || [];
                var b = document.createElement("div");
                var bLen = pButtons.length;
                b.setAttribute("id", config.bottonId);
                b.className = "cmp-bar cmp-bar-footer flexbox col_footer " + (config.bottonConfig.extClass || "");
                if(bLen > 0){
                    for(var t = 0; t < bLen; t++){
                        var button = document.createElement("button");
                        button.setAttribute("type", "button");
                        
                        var secondaryClass = "";
                        if(pButtons[t]["type"] === 1){
                            secondaryClass = "secondary";
                        }
                        
                        button.className = "cmp-btn text-ellipsis flex-1 col_button " + secondaryClass;
                        button.style.verticalAlign = "middle";
                        button.innerText = pButtons[t]["label"];
                        if(pButtons[t]["hander"]){
                            button.addEventListener('tap', pButtons[t]["hander"]);
                            if(pButtons[t]["isPopBtn"] === true){
                                this.popFun = pButtons[t]["hander"];
                            }
                        }
                        b.appendChild(button);
                    }
                }else{
                    b.style.fontSize = "12px";
                    b.innerText = config.bottonConfig.label;
                }
                tempContainer.appendChild(b);
                this.bottonDIV = b;
            }
            
            document.body.appendChild(tempContainer);
            
            this.container = tempContainer;
            this.mainDiv = showEl;
            
            var _this = this;
            if(config.show){
              //动画进入
                setTimeout(function(){
                    _this.show();
                }, 300);
            }
            
            if(config.onInit){
                setTimeout(function(){
                    //执行加载完成
                      config.onInit();
                  }, 50);
            }
        }
        
        
        /**
         * 设置标题
         */
        this._setPageTitle = function(thisTitle){
            
            var $title = document.querySelector("title");
            
            if(thisTitle === true){
                if(this.title){
                    $title.innerText = this.title;
                }
            }else{
                $title.innerText = this.beforeTitle;
            }
        }
        
        this._beforeDisappear = function(){
            var tRet = true;
            if(config.beforeDisappear){
                tRet = config.beforeDisappear();
            }
            return tRet;
        }
        
        //关闭
        this.close = function(){
            
            if(!this.isVisible){
                return; 
             }
            
            if(!this._beforeDisappear()){
                return;
            }
            
            //移除层级
            this.container.classList.remove("cmp-active");
            if(config.onClose){
                config.onClose();
            }
            
            this.isVisible = false;
          //cmp 返回键注销事件
            cmp.backbutton.pop();
            
            // 设置标题
            this._setPageTitle(false);
            
            var _this = this;
            setTimeout(function(){
                _this.container.remove();
            }, 300);
        }
        
        //影藏
        this.hide = function(){
            
            if(!this.isVisible){
                return; 
             }
            
            if(!this._beforeDisappear()){
                return;
            }
            
            if(this.container.classList.contains('cmp-active')){
                this.container.classList.remove('cmp-active');
                if(config.onHide){
                    config.onHide();
                }
            }
            this.isVisible = false;
            
            //cmp 返回键注销事件
            cmp.backbutton.pop();
            
            // 设置标题
            this._setPageTitle(false);
        }
        
        /**
         * 
         */
        this.toggle = function(){
            
            if(!this.isVisible){
                this.show();
            }else{
                if(this.hideType == "close"){
                    this.close();
                }else{
                    this.hide();
                }
            }
        }
        
        //显示
        this.show = function(){
            
            if(this.isVisible){
               return; 
            }
            
            var toShow = false,
                _this = this;
            
            if(!this.container.classList.contains('cmp-active')){
                this.container.classList.add('cmp-active');
                toShow = true;
            }
            
            if(!this.setHeight){
                
                //底部高度
                if(this.bottonDIV){
                    this.bottonHeight = this.bottonDIV.offsetHeight
                }
                
                this.mainDiv.style.paddingTop = this.headerHeight + "px";
                
                if(this.bottonHeight > 0){
                    this.mainDiv.style.paddingBottom = this.bottonHeight + "px";
                }
                this.mainDiv.style.height = "100%";
                
                this.setHeight = true;
            }
            
            //触发回调
            if(toShow && config.onShow){
                config.onShow(); 
            }
            this.isVisible = true;
            
            //向cmp压堆栈
            cmp.backbutton.push(function(){
                if(_this.popFun){
                    _this.popFun();
                }else{
                    _this.toggle();
                }
            });
            
            // 设置标题
            this._setPageTitle(true);
        };
        
        //初始化
        this._init_();
    }
    
    return ColDialog;
})();

/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl){
    
    var p = pEl ? pEl : document;
    
    if(queryAll){
        return p.querySelectorAll(selector);
    }else{
        return p.querySelector(selector);
    }
}

function _alert(message, completeCallback, title, buttonLabel, popExeCallback) {
    if(!title) {
        title = cmp.i18n("collaboration.page.dialog.note");
    }
    if(!buttonLabel) {
        buttonLabel = cmp.i18n("collaboration.page.dialog.OK");
    }
    
    var popCallback = true;
    if(popExeCallback === false){
        popCallback = false;
    }
    var exeCallback = completeCallback;
    if(!completeCallback)
        exeCallback = function(){}
    
    cmp.notification.alert(message, exeCallback, title, buttonLabel, popCallback);
}

/**
 * 从listview缓存中删除某条记录
 * @param {String} affairId
 * 
 */
function removeListCache(affairId){
	var conditions = cmp.storage.get("conditions",true);
	if(!conditions){
		return;
	}
	conditions = cmp.parseJSON(conditions);
	var cache = cmp.storage.get(conditions.listContainer,true);
	if(!cache){
		return;
	}
	cache = cmp.parseJSON(cache);
	cmp.each(cache.data, function(i, v){
		if(v.affairId == affairId){
			cache.data.splice(i,1);
		}
	});
	cmp.storage.save(conditions.listContainer,cmp.toJSON(cache),true);
}

/**
 * 更新listview缓存
 * @param {String} affairId 记录affairId
 * @param {Object} type 更新类型('temp':暂存，'read':已读)
 */
function updateListCache(affairId,type){
	var listViewCacheKey = cmp.storage.get("m3_v5_collaboration_colAffairs_listView_cache_key",true);
	if(!listViewCacheKey){
		return;
	}
	var listViewCache = cmp.storage.get(listViewCacheKey,true);
	if(!listViewCache){
		return;
	}
	listViewCache = cmp.parseJSON(listViewCache);
	cmp.each(listViewCache.data, function(i, v){
		if(v.affairId == affairId && listViewCache.data[i].subState == 11){
			if(type == "temp"){
				listViewCache.data[i].subState = 13;
			}else if(type == "read"){
				listViewCache.data[i].subState = 12;
			}
		}
	});
	cmp.storage.save(listViewCacheKey,cmp.toJSON(listViewCache),true);
}

/**
 * 设置listview不使用缓存，重新刷新数据
 * 删除当前listview的缓存
 */
function setListCacheRefresh(){
	var conditions = cmp.storage.get("conditions",true);
	if(!conditions){
		return;
	}
	conditions = cmp.parseJSON(conditions);
	cmp.storage["delete"](conditions.listContainer,true);
	cmp.storage["delete"]("conditions",true);
}

/**
 * 设置跳转回协同首页listView刷新
 */
function setListViewRefresh(isRefresh){
	cmp.storage.save("isListViewRefresh",isRefresh,true);
}

/**
 * 判断listView是否刷新
 */
function isListViewRefresh(){
	var isRefresh = cmp.storage.get("isListViewRefresh",true);
	var ret = true;
	if(isRefresh == "false"){
	    ret = false;
	}
	if(isRefresh){
	    cmp.storage["delete"]("isListViewRefresh",true);
	}
	return ret;
}
/**
 * 设置跳转回协同首页listView数据操作
 */
function setListViewDateUpdate(datas) {
	cmp.storage.save("isListViewDataUpdate",cmp.toJSON(datas),true);
}
/**
 * 获取跳转回协同首页listView操作数据
 */
function getListViewDateUpdate() {
	var datas = cmp.storage.get("isListViewDataUpdate",true);
	if(datas){
		datas = cmp.parseJSON(datas);
	    cmp.storage["delete"]("isListViewDataUpdate",true);
	}
	return datas;
}

/**
 * 封装ajax报错方法
 */
function errorBuilder(setting){
    return new AjaxErrorHander(setting);
}

/**
 * 封装处理ajax报错
 */
var AjaxErrorHander = function(setting){
    
    var ajaxSetting = setting || {};
    this.success = function(result){
        if(typeof ajaxSetting.success == "function"){
            ajaxSetting.success(result);
        }
        ajaxSetting = null;
    }

    this.error = function(err){
        var cmpHandled = cmp.errorHandler(err);
        if(cmpHandled){
            //
            if(ajaxSetting.exeSelfError === true && typeof ajaxSetting.error == "function"){
                ajaxSetting.error(err);
            }else if(typeof ajaxSetting.alertFn == "function"){
                ajaxSetting.alertFn();
            }
            ajaxSetting = null;
        }else {
             if(typeof ajaxSetting.error == "function"){
                 ajaxSetting.error(err);
             }else{
                 
                 var alertMsg = err.message || cmp.i18n("collaboration.exception.reqException");
                 
                 _alert(alertMsg, ajaxSetting.alertFn);
             }
             ajaxSetting = null;
        }
    }
}
var pageErrorCatch = function(sMsg, sUrl, sLine, errorObj) {
    try {
        var stack = "";
        if (errorObj) {
            stack = errorObj.message + ",errorObj.stack:" + errorObj.stack;
        }
        var logs = "sMsg:" + sMsg + ",sUrl:" + sUrl + ",sLine:" + sLine
                + ",errorObj.message:" + stack;
                
        logToServer(logs);
    } catch (e) {
    }
}

var logToServer = function(logstr) {
    // 获取节点权限
    var params = {};
    params["logstr"] = logstr;
    SeeyonApi.Rest.post('coll/logJs', {}, params, cmp.extend({}, {}));
}

/**
 * CAP3 和 CAP4 适配工具类
 */
var CAPUtil = {
   
    mergeSubmitResult : function(err, data){
        
        if(err && err.isCAP4 === true){
            //CAP 4适配, 转换成CAP3格式
            var cap4Data = {
                "success" : "true",
                "errorMsg" : ""
            };
            
            var contentData = err.content;
            if(CollUtils.isEmptyObj(contentData) && cmp.sui){
                //预提交CAP4没有返回数据
                contentData = {
                    "contentDataId" : cmp.sui.getMainBodyData("contentDataId")
                }
            }
            
            cap4Data.contentAll = contentData;
            cap4Data.snMsg = err.snInfo;
            
            err = null;
            data = cap4Data;
        }
        return {"err": err, "data" : data};
    }
}

/** 流程锁CODE， WorkFlowLock 来自wf-debug.js **/
var CopyWorkFlowLock = {
    ADD_NODE : 3, //加签
    DEL_NODE : 4, //减签
    JOIN_SIGN : 5,//当前会签
    INFORM : 6, //知会
    PASS_READ : 7, //传阅
    MORE_SIGN : 8, //多级会签
    STEP_BACK : 9, //回退
    SPECIFIES_RETURN  :10,//指定回退
    STEP_STOP : 11, //终止
    REPEAL_ITEM : 12, //撤销
    TAKE_BACK : 13, //取回
    SUBMIT : 14, //提交
    EDIT_CONTENT : 15,//修改正文
    TRANSFER : 20 //移交
};