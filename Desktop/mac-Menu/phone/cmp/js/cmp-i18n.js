if(typeof cmp == "undefined"){
    cmp = {};
}
if(typeof fI18nData == "undefined"){
    fI18nData = {}
}
(function(_){
    var matchPlaceholder = /\{\d\}/g;
    var I18NParamPlaceholder = /\{\d\}/;
    var sslRegex = /^(https:)/i;
    var sslProtocol = sslRegex.test(window.location.protocol);
    function insertI18NJS (path,handleTagCallback,callback,langSuffix,errorLoadNum){
        var scriptObj = document.createElement("script");
        if(sslProtocol && !sslRegex.test(path)){
            path = path.replace("http","https");
        }
        scriptObj.src = path;
        scriptObj.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(scriptObj);
        scriptObj.onload = function(){
            if(handleTagCallback){
                handleTagCallback.call(this);
            }
            if(callback && typeof callback == "function"){
                callback.call(this);
            }

        };
        scriptObj.onerror = function(){
            if(!errorLoadNum){
                path = path.replace(langSuffix,"en");
                insertI18NJS(path,handleTagCallback,callback,langSuffix,1)
            }else {
                if(callback && typeof callback == "function"){
                    callback.call(this);
                }
            }

        }
    }
    function lang() {
        var lang = navigator.language;
        var enRegex = /en/g;
        var chiRegex = /zh/g;
        lang = lang.toLowerCase();
        if (lang.length > 3) {
            lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
        }
        if (enRegex.test(lang)) {
            lang = "en";
        } else if (chiRegex.test(lang)) {
            lang = (lang.toLocaleLowerCase().indexOf("cn") > -1) ? "zh-CN" : "zh-TW";
        }else {
            if(lang.indexOf("-") != -1 || lang.indexOf("_") != -1){//按照后台生成国际化文件的规范，只取地区编码，不要后面的大写字母了
                lang = lang.substring(0,2);
                lang = lang.toLocaleLowerCase();
            }
            // lang = "en";//由于rest接口未适配原因，暂时定死成英文
        }
        return lang;
    }
    function getValue (key,params){
        var value;
        if (typeof key == "string" && key.length > 0) {
            value = fI18nData[key];
        }
        if(value){
            if(params){
                var placeholders = value.match(matchPlaceholder);
                if(placeholders){
                    var i = 0,len = placeholders.length;
                    for(;i<len;i++){
                        if(params instanceof Array){
                            var index = placeholders[i].substring(placeholders[i].indexOf("{")+1,placeholders[i].indexOf("}"));
                            index = parseInt(index);
                            value = value.replace(I18NParamPlaceholder,params[index]);
                        }else {
                            value = value.replace(I18NParamPlaceholder,params);
                        }
                    }
                }
            }
        }else {
//            value = "["+key+"]";
            value = "";
        }
        return value;
    }
    var language = lang();
    _.i18n = function(key,params){
        return getValue(key,params);
    };
    _.i18n.init = function (path,name,callback,buildversion) {
        switch (language){
            case "zh-CN":
                handleI18NTag();
                if(callback && typeof callback == "function"){
                    callback.call(this);
                }
                break;
            default:
                var langSuffix = language.replace(/-/g,"_");
                var jsPath = path + name + "_"+langSuffix+".js";
                if(buildversion) {
                    var c = buildversion.indexOf("?") != -1?"":"?";
                    jsPath += c +buildversion;
                }
                insertI18NJS(jsPath,handleI18NTag,callback,langSuffix);
                break;
        }
    };
    _.i18n.load = function(path,name,callback,buildversion){
        var langSuffix = language.replace("-","_");
        var newPath = path + name + "_" + langSuffix+".js";
        if(buildversion){
            var c = buildversion.indexOf("?") != -1?"":"?";
            newPath += c +buildversion;
        }
        insertI18NJS(newPath,null,callback,langSuffix);
    };
    _.i18n.detect = function(){
        handleI18NTag();
    };

    var handleI18NTag = function(module){
        var i = 0,i18nTag = document.querySelectorAll("i18n"),len = i18nTag.length;
        for(;i<len;i++){
            var key = i18nTag[i].getAttribute("key");
            if(!key) {  //做了一个兼容，避免过去使用老方法的调用者在新方式后出错了
                key = i18nTag[i].innerHTML;
            }
            var value = fI18nData[key];
            if (value) {
                var nNode = document.createTextNode(value);
                i18nTag[i].parentNode.replaceChild(nNode, i18nTag[i]);
            }
        }
    };

})(cmp);