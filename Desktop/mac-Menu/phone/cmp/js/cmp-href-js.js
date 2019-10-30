(function(_){
    function getHistoryStack() {
        var historyStack = _.storage.get("cmp-href-history",true);
        if (!historyStack) {
            historyStack = [];
        } else {
            try {
                historyStack = _.parseJSON(historyStack);
            } catch (e) {
                historyStack = [];
            }
        }
        return historyStack;
    }

    var historyPush = function (url,params,nextUrl,uuid) {
        var historyStack = getHistoryStack();
        var historyParams = {};
        if(params){
            historyParams["data"] = params;
        }
        historyParams["url"] = url;
        if(uuid){
            historyParams["cmphistoryuuid"] = uuid;
            historyParams["nextUrl"] = nextUrl;


        }
        historyStack.push(historyParams);
        _.storage.save("cmp-href-history", _.toJSON(historyStack),true);
    };

    var historyPop = function (popIndex) {
        var popHistory;
        var historyStack = getHistoryStack();
        if(popIndex && !isNaN(popIndex)){
            if(popIndex > 1){
                popIndex = Math.abs(popIndex);
                if(popIndex <= historyStack.length){
                    popIndex = popIndex -1;
                    historyStack.splice(-popIndex,historyStack.length);
                    popHistory = historyStack.pop();
                }else {
                    console.log("大哥，你在瞎跳所，next几个，你回来要超出你跳的个数");
                }
            }else {
                popHistory = historyStack.pop();
            }
        }else {
            popHistory = historyStack.pop();
        }
        _.storage.save("cmp-href-history", _.toJSON(historyStack),true);
        return popHistory;
    };

    var historyTop = function () {
        var historyStack = getHistoryStack();
        return historyStack[historyStack.length - 1];
    };
    var historyUrlUUID = function(){
        try{
            return window.location.href.match(/(cmphistoryuuid=)([\d]+)/)[2];
        }catch(e){}
        return null;
    };
    if(typeof checkViolenceTap != "undefined" ){
        var urlUUID = historyUrlUUID();
        if(urlUUID){
            var historyTopParams = historyTop();
            if(historyTopParams){
                var historyTopUUID = historyTopParams.cmphistoryuuid;
                if(historyTopUUID && (historyTopUUID != urlUUID) && historyTopParams.nextUrl){
                    window.location.href = historyTopParams.nextUrl;
                }
            }

        }
        checkViolenceTap = true;
    }
    function saveBackParams(queryParams){
        var urlQueryParams;
        if(queryParams){
            if(typeof queryParams == "string"){ //如果有查询数据的话，back url需要重组一下查询(查询在前，hash在后)
                urlQueryParams = queryParams;
            }else if(queryParams && typeof queryParams == "object"){
                urlQueryParams = queryParams.queryParams;
                var params = queryParams.data;
                if (params) {
                    try {
                        params = _.toJSON(params);
                    } catch (e) {
                    }
                    _.storage.save("cmp-href-once-use", params,true);//保证back的时候也可以传值
                }
            }
        }
        return urlQueryParams
    }
    function delOnceUseParams(){
        var onceUseParams = _.storage.get("cmp-href-once-use",true);
        if(onceUseParams){
            _.storage.delete("cmp-href-once-use",true);
        }
    }
    function delAllPageParams (){
        delOnceUseParams();
        var historyPageKeys = _.storage.get("cmp-href-history",true);
        historyPageKeys = _.parseJSON(historyPageKeys);
        if(historyPageKeys && historyPageKeys instanceof Array && historyPageKeys.length > 0){
            _.storage.delete("cmp-href-history",true);
        }
    }

    function hrefUrl(currentUrl,targetUrl,params,enterStack){
        _.dialog.loading(false);
        focusAreaBlur();

        //将uuid绑定到url上，防止微信端的暴力返回点击
        var uuid = new Date().getTime()+"";
        var uuidStr = "cmphistoryuuid=" + uuid;
        var connector = targetUrl.indexOf("?") != -1 ? "&" :"?";
        if(targetUrl.indexOf("#") != -1){
            var pathname = targetUrl.split("#")[0];
            var hash = targetUrl.split("#")[1];
            targetUrl = pathname + connector + uuidStr + "#" + hash;
        }else {
            targetUrl += connector + uuidStr;
        }

        if(enterStack) historyPush(currentUrl,params,targetUrl,uuid);
        window.location.href = targetUrl;
    }

    function hrefBack(backIndex,queryParams){
        _.dialog.loading(false);
        focusAreaBlur();
        var _url,weixinmessage;
        var historyParam = historyPop(backIndex);
        if(historyParam) {
            _url = historyParam.url;
            weixinmessage = historyParam.weixinmessage
        }
        if (!_url  || weixinmessage) {
            _.href.closePage();
            return ;
        }
        var urlQueryParams = saveBackParams(queryParams);
        if(urlQueryParams){
            var connector = _url.indexOf("?") != -1 ? "&" :"?";
            if(_url.indexOf("#") != -1){
                var pathname = _url.split("#")[0];
                var hash = _url.split("#")[1];
                _url = pathname + connector + urlQueryParams + "#" + hash;
            }else {
                _url += connector + urlQueryParams;
            }
        }
        window.location.href =  _url;
    }
    //防护跳转前键盘弹出的情况
    var focusAreaBlur = function(){
        var focusArea = document.querySelector(":focus");
        if(focusArea){
            focusArea.blur();
        }
    };

    _.href = {};

    _.href.next = function (url, params,options) {
        var currentUrl = window.location.href;
        delOnceUseParams();//如果backpage堆栈中有值，先清除
        _.href.cacheListData();
        hrefUrl(currentUrl,url,params,true);
    };

    _.href.back = function (backIndex,queryParams) {
        var cmpwechatdownloadfile = _.storage.get("cmpwechatdownloadfile",true);
        if(cmpwechatdownloadfile){//释放由于微信端打开文件传的一个标识值
            _.storage.delete("cmpwechatdownloadfile",true);
            if(_.backbuttonBinded) return;//如果页面绑定了backbutton，那么就return了，不然的话按照正常路线back
        }
        _.backbutton(false);
        delOnceUseParams();
        hrefBack(backIndex,queryParams);
    };
    /**
     * 是否点击返回按钮是异常情况（如微信附件查看后，点穿微信的返回按钮点穿的问题）
     * @returns {boolean} true:说明是异常情况，false：说明是正常情况
     */
    _.href.backAbnormal = function(){
        if(_.storage.get("cmpwechatdownloadfile",true)){
            _.storage.delete("cmpwechatdownloadfile",true);
            return true;
        }
        return false;
    };
    _.href.go = function (url, params) {
        var cmpwechatdownloadfile = _.storage.get("cmpwechatdownloadfile",true);
        if(cmpwechatdownloadfile){//释放由于微信端打开文件传的一个标识值
            _.storage.delete("cmpwechatdownloadfile",true);
            if(_.backbuttonBinded) return;//如果页面绑定了backbutton，那么就return了，不然的话按照正常路线back
        }
        var currentUrl = window.location.href;
        delOnceUseParams();
        if (params) {
            try {
                params = cmp.toJSON(params);
            } catch (e) {
            }
            _.storage.save("cmp-href-once-use", params,true);
        }
        hrefUrl(currentUrl,url,params);
    };

    _.href.open = function(){};//空方法，壳才支持
    _.href.close = function(){};//空方法，壳才支持
    _.href.closePage = function(){
        delAllPageParams();
        if(_.platform.wechat){ //用于判断微信平台
            try{
                WeixinJSBridge.invoke('closeWindow',{},function(res){});
            }catch(e){}
            //微信端，应用模块回退到微协同门户，需要评审
        }else if(_.platform.DDShell){//如果是钉钉平台
            var script = document.createElement("script");
            script.onload = function(){
                dd.config({
                    agentId: _.storage.get("agentId"),
                    corpId: _.storage.get("appid"),
                    timeStamp: _.storage.get("timeStamp"),
                    nonceStr: _.storage.get("nonceStr"),
                    signature: _.storage.get("signature")
                });
                dd.ready();
                dd.biz.navigation.close();
            };
            script.src = "https://g.alicdn.com/dingding/open-develop/1.0.0/dingtalk.js";
            document.head.appendChild(script);
        }else if(_.os.mobile){//第三方移动端,需要重写改函数
            _.href.closePage_third();
        }else {//pc调试关闭窗口
            this.window.opener = null;
            window.close();
        }
    };

    var historyParamsCache = {};
    _.href.getParam = function (paramKey) {
        var historyParams;
        var data;
        if(Object.keys(historyParamsCache).length == 0){
            var onceUseParams = _.storage.get("cmp-href-once-use",true);
            if(onceUseParams){
                try{
                    data = _.parseJSON(onceUseParams);
                }catch(e){}
                delOnceUseParams();
            }else {
                historyParams = historyTop();
                if(historyParams){
                    historyParamsCache["url"] = historyParams.url;
                    data = historyParams.data
                }
            }
            if(data){
                historyParamsCache["data"] = data;
                try{
                    return paramKey ? data[paramKey] : data;
                }catch(e){
                    return  data;
                }
            }else {
                return undefined;
            }
        }else {
            var data = historyParamsCache["data"];
            try{
                return paramKey?data[paramKey]:data;
            }catch(e){
                return data;
            }
        }
    };

    _.href.getBackParam = function (paramKey) {
        var params =_.storage.get("cmp-href-once-use",true);
        if (params) {
            try {
                params = _.parseJSON(params);
                return paramKey ? params[paramKey] : params;
            } catch (e) {
                return params;
            }
        } else {
            return undefined;
        }
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

    _.href.closePage_third = function(){}
})(cmp);