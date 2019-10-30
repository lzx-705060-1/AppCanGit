(function(_){

    //防护跳转前键盘弹出的情况
    var focusAreaBlur = function(){
        var focusArea = document.querySelector(":focus");
        if(focusArea){
            focusArea.blur();
        }
    };
    var doHref = function(url,params,options,openWebview,inStack,animated){
        _.dialog.loading(false);
        focusAreaBlur();
        var _options={},direction;
        if(options){
            if(typeof options == "object"){
                _options = _.extend({
                    animated:true,       //默认是有动画的
                    direction:"left"//默认是从右向左
                },options);
                animated = _options.animated;
                direction = _options.direction;
            }else {
                animated = options;
                direction = "left";
            }
        }
        animated = typeof animated == "undefined"?true:animated == true;
        direction = typeof direction == "undefined"?"left":direction;

        _options.animated = animated;
        _options.direction = direction;
        _options.inStack = inStack;//是否入栈
        _options.openWebview = openWebview;
        if(params && typeof params == "object"){
            params = _.toJSON(params);
        }else if(!isNaN(params)){
            params = params + "";
        }
        cordova.exec(
            function (r) {

            },
            function (e) {

            },
            "CMPNavigationPlugin",
            "pushPage",
            [
                {
                    "url":url,
                    "originUrl":window.location.href,
                    "param":params,
                    "options":_options
                }
            ]
        );
    };

    var doBack = function(backIndex,params,options){
        _.dialog.loading(false);
        focusAreaBlur();
        if(params && typeof params == "object"){
            params = _.toJSON(params);
        }else if(!isNaN(params)){
            params = params + "";
        }
        cordova.exec(
            function (r) {

            },
            function (e) {

            },
            "CMPNavigationPlugin",
            "popPage",
            [
                {
                    "backIndex":backIndex || 1,
                    "param":params,
                    "options":options
                }
            ]
        );
    };
    _.href = {};
    //options 可以配置成true/false 表示是是否显示动画，如果是对象，则可以控制显示动画和动画方向
    _.href.next = function (url, params,options) {
        var openWebviewMark = _.href.openWebViewCatch();
        var openWebview = false,inStack = true, animated = true;
        if(openWebviewMark || (options && options.openWebview)){
            if(openWebviewMark == 1){
                var portalRegex = /http(s)?:\/\//;
                if(!portalRegex.test(url)) {
                    url = document.location.origin + url;
                }
                animated = true;
            }else if(openWebviewMark == 2){
                animated = false;
            }
            openWebview = true;
        }else {//不是打开的webview才进行listview的数据缓存
            openWebview = false;
            _.href.cacheListData();
        }
        doHref(url,params,options,openWebview,inStack,animated);
    };
    /**
     *
     * @param queryParams
     * queryParams可以是一个对象也可以是一个字符串，
     * 如果是对象，则格式{queryParams:"?search",data:"{name:"heha"}"}
     * 如果是字符串，则等于queryParams即传给前面页面的search
     * 对应的，获取back回来的页面参数使用cmp.href.getBackParam(backpage存的key)
     * fireType:触发对应的webview监听
     */
    _.href.back = function(backIndex,queryParams,fireType,fireData){
        var _options = {
            animated:true,
            direction:"right"
        };
        var params,urlParams;
        if(queryParams){
            if(typeof queryParams == "string"){ //如果有查询数据的话，back url需要重组一下查询(查询在前，hash在后)
                urlParams = queryParams;
            }else if(typeof queryParams == "object"){
                urlParams = queryParams.queryParams;
                params = queryParams.data;

            }
        }
        _options.urlParams = urlParams;
        _options.fireType = fireType||"";
        _options.fireData = fireData||"";
        doBack(backIndex,params,_options);
    };
    _.href.backAbnormal = function(){
        return false;
    };
    _.href.go = function(url, params, options){
        doHref(url,params,options,false,false);
    };
    _.href.closePage = function(){
        var _options = {
            closePage:true,
            animated:true,
            direction:"right"
        };
        doBack(null,null,_options);
    };
    //打开一个webview但是不传值
    _.href.open = function(url,nativeTitle){   //open也统一进入栈管理
        var portalRegex = /http(s)?:\/\//;
        if(!portalRegex.test(url)) {
            url = document.location.origin + url;
        }
        var options = {};
        if(nativeTitle){
            options.useNativebanner = true;//打开webview时是否需要原生导航栏
            options.header = nativeTitle;
        }
        doHref(url,null,options,true,true,true);
    };
    _.href.close = function(){
        _.closeWebView();
    };
    _storageTranseParams = function(params){
        params = _.os.android?_.toJSON(params):params;
        return params;
    };
    var historyParamsCache = {};
    _.href.getParam = function (paramKey) {
        var data;
        if(Object.keys(historyParamsCache).length == 0){
            var onceUseParams = window.cmpSyncRequest.smRequest("CMPNavigationPlugin","getParams",_storageTranseParams([{"fromStack":false}]));//先取出只用一次的
            if(onceUseParams){
                data = onceUseParams;
            }else {
                data = window.cmpSyncRequest.smRequest("CMPNavigationPlugin","getParams",_storageTranseParams([{"fromStack":true}]));
            }
            if(data){
                try{
                    data = _.parseJSON(data);
                }catch(e){}
                historyParamsCache["data"] = data;
            }
        }else {
            data = historyParamsCache["data"];
        }
        try{
            return paramKey ? data[paramKey] : data;
        }catch(e){
            return  data;
        }
    };

    _.href.getBackParam = function (paramKey) {
        var data = window.cmpSyncRequest.smRequest("CMPNavigationPlugin","getParams",_storageTranseParams([{"fromStack":false}]));
        if(data){
            try{
                data = _.parseJSON(data);
                return paramKey ? data[paramKey] : data;
            }catch(e){
                return  data;
            }
        }
        return undefined;
    };
    _.href.cacheListData = function(){
        try {
            var saveMark = _.cache["saveMark"];
            var _pageData = _.cache["list_cache_data_" + saveMark];
            var myPage = _.listView(_pageData.containerID);
            var pageData = {
                scrollX:myPage.x,
                scrollY:myPage.y,
                data: _pageData.data,
                finished:_pageData.finished,
                crumbs:_pageData.crumbs,
                pageNo:_pageData.pageNo,
                total:_pageData.total,
                pagingNo:_pageData.pagingNo,
                widgetShow:myPage.widgetShow,
                additionalPartsShow:myPage.additionalPartsShow
            };
            _.storage.save(saveMark, _.toJSON(pageData),true);
        } catch (e) {
        }
    };
    _.href.openWebViewCatch = function(){return null;};
    //======================================================================================webview操作 start=========//
    _.openWebView = function (options) {
        var _options = {
            uid: "",
            url: "",
            isNew: true,
            header: "header",
            useNativebanner:false, //是否显示原生导航栏
            "iOSStatusBarStyle":"", // ios状态栏颜色0=黑色 1=白色
            success: null,
            error: null
        };

        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "WebViewPlugin",
            "open",
            [
                {
                    "uid": _options.uid,
                    "url": _options.url,
                    "isNew": _options.isNew,
                    "header": _options.header,
                    "useNativebanner":_options.useNativebanner,
                    "iOSStatusBarStyle":_options.iOSStatusBarStyle
                }
            ]);
    };
    _.openRootWebView = function (options) {
        var _options = {
            uid: "",
            url: "",
            isNew: true,
            header: "header",
            useNativebanner:false, //是否显示原生导航栏
            "iOSStatusBarStyle":"", // ios状态栏颜色0=黑色 1=白色
            success: null,
            error: null
        };

        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "WebViewPlugin",
            "openRootWebView",
            [
                {
                    "uid": _options.uid,
                    "url": _options.url,
                    "isNew": _options.isNew,
                    "header": _options.header,
                    "useNativebanner":_options.useNativebanner,
                    "iOSStatusBarStyle":_options.iOSStatusBarStyle
                }
            ]);
    };
    _.closeWebView = function (options) {
        var _options = {
            callBack:"",
            data:[],
            success: null,
            error: null
        };
        _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "WebViewPlugin",
            "close",
            [
                {
                    "callBack":_options.callBack,
                    "data":_options.data
                }
            ]);
    };

    _.isRootWebView = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "WebViewPlugin",
            "isRootWebView",
            [
                {
                }
            ]);
    };
    //======================================================================================webview操作 end===========//

})(cmp);