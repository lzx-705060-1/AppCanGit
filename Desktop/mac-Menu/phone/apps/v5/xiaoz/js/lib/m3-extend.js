
(function(){
    m3.penetratedByUrl = function(appInfo,callback){
        var pkage = appInfo.package,
            jsapi = appInfo.jsapi,
            openAppMethod = appInfo.openAppMethod;
        var jsapiurl = pkage + "/"+jsapi;

        if (m3.penetratedHandle(openAppMethod.replace(".openApp", ""), jsapiurl)) {

            if (!appInfo.sendParms) {
                console.error("穿透接口无返回参数");
                callback && callback({error:true});
            } else {
                try{
                    callback && callback();
                    if (appInfo.appId == "43") {
                        m3.s3Caller("bizApi.openBizInfo", ["", appInfo.sendParms, appInfo.returnParms], "", "");
                    } else {
                        m3.s3Caller(openAppMethod, [appInfo.type, "", appInfo.sendParms, appInfo.returnParms], "", "");
                    }
                }catch (e){
                    callback && callback({error:true});
                }

            }
        }
    };

    m3.penetratedHandle = function(id, url) {

        // if ($("#" + id).length > 0) {
        //     return true;
        // }
        var xmlHttp = null;
        if (window.ActiveXObject) //IE
        {
            try {
                //IE6以及以后版本中可以使用
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                //IE5.5以及以后版本可以使用
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else if (window.XMLHttpRequest) //Firefox，Opera 8.0+，Safari，Chrome
        {
            xmlHttp = new XMLHttpRequest();
        }
        //采用同步加载
        xmlHttp.open("GET", url, false);
        //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
        xmlHttp.send(null);
        //4代表数据发送完毕
        if (xmlHttp.readyState == 4) {
            //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
            if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
                var myHead = document.getElementsByTagName("HEAD").item(0);
                var myScript = document.createElement("script");
                myScript.language = "javascript";
                myScript.type = "text/javascript";
                myScript.id = id;
                try {
                    //IE8以及以下不支持这种方式，需要通过text属性来设置
                    myScript.appendChild(document.createTextNode(xmlHttp.responseText));
                } catch (ex) {
                    myScript.text = xmlHttp.responseText;
                }
                myHead.appendChild(myScript);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    m3.s3Caller = function(expression, args, $scope, defaultValue) {
        var scope = $scope || window;
        if (typeof expression === 'string') {
            expression = expression.replace(/\[/g, '.').replace(/\]/g, '');
            var arr = expression.split('.');
            if (arr.length > 1) {
                expression = scope;

                arr.forEach(function(item) {
                    if (expression && expression[item])
                        scope = expression;
                    expression = expression[item];
                });
            } else {
                expression = scope[expression];
            }
        }

        if (typeof expression === 'function') {
            return expression.apply(scope, args);
        } else if (typeof expression !== 'undefined') {
            //如果是对象，则返回对象本身
            return expression;
        }
        return defaultValue;
    }
})();