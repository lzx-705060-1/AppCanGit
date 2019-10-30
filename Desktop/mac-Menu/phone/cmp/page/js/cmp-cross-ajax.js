

var jsonType = 'application/json';
var htmlType = 'text/html';
var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
var scriptTypeRE = /^(?:text|application)\/javascript/i;
var xmlTypeRE = /^(?:text|application)\/xml/i;
var blankRE = /^\s*_/;
var rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
var mimeToDataType = function (mime) {
    if (mime) {
        mime = mime.split(';', 2)[0];
    }
    return mime && (mime === htmlType ? 'html' :
                    mime === jsonType ? 'json' :
                            scriptTypeRE.test(mime) ? 'script' :
                            xmlTypeRE.test(mime) && 'xml') || 'text';
};
var postResult = function(data){
    window.parent.postMessage(JSON.stringify(data),'*');
};
var repeatXhr = function(messageId,settings,headers,protocol,callback){
    ajaxAction(messageId,settings,headers,protocol,callback);
};
var ajaxAction = function(messageId,settings,headers,protocol,callback){
    var xhr = new window.XMLHttpRequest();
    var abortTimeout;
    var dataType = settings.dataType;
    var mime = settings.accepts[dataType];
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
//                  xhr.onreadystatechange = _.noop;
            clearTimeout(abortTimeout);
            var result, error = false;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:')) {
                dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                dataType = dataType.toLowerCase();
                result = xhr.responseText;
                try {
                    // http://perfectionkills.com/global-eval-what-are-the-options/
                    if (dataType === 'script') {
                        (1, eval)(result);
                    } else if (dataType === 'xml') {
                        result = xhr.responseXML;
                    } else if (dataType === 'json') {
                        result = blankRE.test(result) ? null : JSON.parse(result);
                    }
                } catch (e) {
                    error = e;
                }
                if (error) {
                    callback({
                        success:false,
                        data:error,
                        type:"parsererror",
                        xhr:xhr,
                        messageId:messageId
                    })
                } else {
                    callback({
                        success:true,
                        data:result,
                        messageId:messageId,
                        xhr:xhr
                    })
                }
            } else {
                if(settings.repeat && settings.repeatTime && xhr.status == 0){//只对断网时重新repeat
                    xhr.abort();
                    setTimeout(function(){
                        repeatXhr(messageId,settings,headers,protocol);
                        settings.repeatTime--;
                    },settings.repeatTimer);
                }else {
                    callback({
                        success:false,
                        data:xhr.statusText || null,
                        type:"abort",
                        messageId:messageId,
                        xhr:xhr
                    });
                    xhr.abort();
                }
            }
        }
    };
    if (settings.xhrFields) {
        for (var name in settings.xhrFields) {
            xhr[name] = settings.xhrFields[name];
        }
    }

    var async = 'async' in settings ? settings.async : true;

    xhr.open(settings.type.toUpperCase(), settings.url, async, settings.username, settings.password);

    for(var name in headers){
        xhr.setRequestHeader(name,headers[name]);
    }
    if (settings.timeout > 0) {
        abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = function(){};
            xhr.abort();
            callback({
                success:false,
                data:null,
                type:"timeout",
                messageId:messageId,
                xhr:xhr
            })
        }, settings.timeout);
    }
    xhr.send(settings.data ? settings.data : null);
    return xhr;
};
window.addEventListener("message",function(e){
    var data = e.data;
    data = JSON.parse(data);
    var messageId = data.messageId,settings = data.settings,headers = data.headers,protocol = data.protocol;
    ajaxAction(messageId,settings,headers,protocol,postResult);
},false)
