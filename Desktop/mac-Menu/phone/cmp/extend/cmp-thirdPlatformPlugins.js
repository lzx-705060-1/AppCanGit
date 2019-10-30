/**
 * 开发者在此文件中添加第三方app调用原生的接口
 */
(function(){
    //第三方app注册第三方app调用接口
    var cmpThirdPlatformPlugins = {
        "closeWebView":null,//关闭第三方app  webview
        "download":null,//调用第三方App   的下载文件接口
        "upload":null,//调用第三方App的上传接口
        "read":null,//调用第三方App的文件查看接口
        "getFile":null,//调用第三方App的获取手机本地文件接口
        "camera":null,//调用第三方App的相机接口
        "getPosition":null,//调用第三方App的定位接口
        "setTitle":null,//调用第三方App设置原生title的接口
    };




    document.addEventListener("cmpThirdPlatformPlugins",function(e){
        var data = e.data;
        var options = data.data,backupsFun = data.backupsFun,pluginName = e.plugin;
        if(cmpThirdPlatformPlugins[pluginName]){
            cmpThirdPlatformPlugins[pluginName].call(this,options)
        }else {//如果没有定义则使用cmp认为比较合理的备用方法进行实现
            backupsFun && backupsFun.call(this,options);
        }
    });
})();

