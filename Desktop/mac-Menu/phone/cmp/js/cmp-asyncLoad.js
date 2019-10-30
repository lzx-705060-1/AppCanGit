(function(_){
    var asyncLoadedResourceCache = {};
    var sslRegex = /^(https:)/i;
    var sslProtocol = sslRegex.test(window.location.protocol);

    _.asyncLoad = {};
    /**
     *
     * @param jss 需要加载的js数组
     * @param callback  所有js加载完成后的回调
     */
    _.asyncLoad.js = function(jss,callback){
        var scriptCounter = jss.length;
        if (!scriptCounter) {
            if(callback){
                callback();
            }
            return;
        }
        var loadingModuleList = {};
        var haveNewJsSource = false;
        var i = 0,len = jss.length;
        for(;i<len;i++){
            var js = jss[i],url,id;
            if(typeof js == "object"){
                url = js.url;
                id = js.id;
            }else {
                url = js;
            }
            if(loadingModuleList[url]){//避免重复加载相同的js
                scriptCounter --;
                continue;
            }else if(asyncLoadedResourceCache[url]){//避免已经加载过的资源又来加载一次，如果一旦有加载过的再次加载的话就break了
                scriptCounter --;
                if(!scriptCounter && !haveNewJsSource){//如果加载的资源中没有有新的js，并且轮询完了，则进行callback
                    callback();
                    break;
                }
                continue;
            }else {
                loadingModuleList[url] = url;
                //asyncLoadedResourceCache[url] = url;//去掉防护，避免门户那边同时加载的问题
            }
            haveNewJsSource = true;
            (function(url){
                injectScript(url,function onload(){
                        scriptCounter --;
                        if (!scriptCounter) {
                            if(callback){
                                callback();
                            }
                            return;
                        }
                    },
                    function onerror(){
                        console.log("加载" + url +"失败");
                        scriptCounter --;
                        if (!scriptCounter) {
                            if(callback){
                                callback();
                            }
                            return;
                        }
                    },id);
            })(url);

        }

    };
    function injectScript(url,onload,onerror,id){
        if(sslProtocol && !sslRegex.test(url)){
            url = url.replace("http","https");
        }
        var script = document.createElement("script");
        if(id) script.setAttribute("id",id);
        script.onload = onload;
        script.onerror = onerror;
        script.src = url;
        document.head.appendChild(script);
    }

    /**
     * 异步加载css
     * @param csss
     */
    _.asyncLoad.css = function(csss){
        var i = 0,len = csss.length;
        for(;i<len;i++){
            if(asyncLoadedResourceCache[csss[i]]) continue;
            asyncLoadedResourceCache[csss[i]] = csss[i];
            var style = document.createElement('link');
            if(sslProtocol && !sslRegex.test(csss[i])){
                csss[i] = csss[i].replace("http","https");
            }
            style.href = csss[i];
            style.rel = 'stylesheet';
            style.type = 'text/css';
            document.head.appendChild(style);
        }
    }
})(cmp);