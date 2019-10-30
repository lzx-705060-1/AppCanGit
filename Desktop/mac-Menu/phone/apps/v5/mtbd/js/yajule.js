

//(最新20170407封装)发送请求ajaxJson函数方法_版本1
//ajax请求的每一个参数在不同的请求环境中会有着不同的作用，不能在一个方法将其中的参数固定，应当通过传参动态灵活赋值。
//员工自助模块已全部采用这种请求方式
//调用cmp封装的ajax，故在之后加载
function ajaxJson_v1(obj) {
    cmp.dialog.loading("加载中...")
    console.log("发送请求参数如下:");
    console.log(obj);
    //请求的url：(必选,字符串，请求的url可以不包含参数，推荐将参数是封装在下面的data中)
    var url = obj.url;
    if (undefined == url || '' == String(url).trim()) {
        url = '';
    }
    //请求的发送方式(可选,post或get)
    var type = obj.type;
    if (undefined == type || '' == String(type).trim()) {
        type = 'get';
    }
    //请求的参数数据(可选,json格式的字符串数据)
    var data = obj.data;
    if (undefined == data || '' == String(data).trim()) {
        data = '';
    }
    //请求的数据类型(可选,常用是json，但也有可能用到其它类型如：xml、html、script、text)
    var dataType = obj.dataType;
    if (undefined == dataType || '' == String(dataType).trim()) {
        dataType = 'json';
    }
    //请求的是否异步(可选,true：请求是异步，不会出现页面卡死，可随时结束请求，主流用法。false：同步请求，会出现页面卡死，无法关闭和返回，特殊情况使用。)
    var async = obj.async;
    if (undefined == async || '' == String(async).trim()) {
        async = true;
    }
    //出错时返回的执行方法(可选,这个是出错时的回调方法，方法名可自定义)
    var errorFun = obj.errorFun;
    if (undefined == errorFun || '' == String(errorFun).trim()) {
        errorFun = '';
    }
    //出错时是否弹出框提醒(可选,传入true，出错时将使用默认的弹出框提醒。传入false，出错时不提醒，只返回出错时的回调方法，可以在回调方法中自定义提醒的内容，可以是Alert或Toast等。)
    var errorAlert = obj.errorAlert;
    if (undefined == errorAlert || '' == String(errorAlert).trim()) {
        errorAlert = true;
    }
    //成功时返回的执行方法(可选,这个是成功时的回调方法，方法名可自定义)
    var successFun = obj.successFun;
    if (undefined == successFun || '' == String(successFun).trim()) {
        successFun = '';
    }
    //超时时间(可选,当请求超出时间时将停止执行)
    var timeout = obj.timeout;
    if (undefined == timeout || '' == String(timeout).trim()) {
        timeout = 30000;
    }
    //扩展内容，(可选,不参与请求，主要用于标记,数据会原样返回。常用于在上一个方法中定义的变量会在下一个方法中继续使用或是页面中有多个标签有着相同id值的情况(加班单发起、请假单发起、签卡单发起中'增加一行'执行之后的页面就会出现这样的情况)。)
    var ext = obj.ext;
    if (undefined == ext || '' == String(ext).trim()) {
        ext = '';
    }
    if ('' != String(url).trim()) {

       $.ajax({
            url : url,
            type : type,
            data : data,
            dataType : dataType,
            contentType : 'application/json;charset=utf-8',
            async : async,
            error : function(cbData) {
                cmp.dialog.loading(false)
                console.log("请求失败，失败原因如下:");
                console.log(cbData);
                if (true == errorAlert || 'true' == errorAlert) {
                    if (type == 'error') {
                        cmp.notification.alert("数据加载失败",function(){
                            //do something after tap button
                        },"提示","确定","",false,false);

                    } else {
                        cmp.notification.alert("网络请求失败，请重试。",function(){
                            //do something after tap button
                        },"提示","确定","",false,false);

                    }
                } else {
                    if (undefined != errorFun && '' != errorFun.trim()) {
                        var errorFunction = eval(errorFun);
                        new errorFunction(cbData, ext);
                    }
                }
            },
            success : function(cbData) {
                cmp.dialog.loading(false)
                console.log("请求成功，获取数据如下:");
                console.log(cbData);
                if (undefined != successFun && '' != successFun.trim()) {
                    var successFunction = eval(successFun);
                    new successFunction(cbData, ext);
                }
            },
            timeout : timeout,
        });

       /* cmp.ajax({
            type:type,
            data:data,
            url:url,//
            dataType:dataType,
            timeout:timeout,
            headers:{
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language' : "zh-CN"
                //'option.n_a_s' : '1'
            },
            //dataType:"json",
            success:function(result){
                console.log("请求成功，获取数据如下:");
                console.log(result);
                if (undefined != successFun && '' != successFun.trim()) {
                    var successFunction = eval(successFun);
                    new successFunction(result, ext);
                }
            },
            error:function(error){
                console.log("请求失败："+error)
                if(!cmp.errorHandler(error)){ //先调用平台的错误统一处理机制
                    //如果平台的统一处理机制处理不了，则自己写业务逻辑
                    var code = error.code;
                    if(code==500){
                        //根据code值做自己的业务逻辑
                    }
                }
            }
        });*/
    }
}


//判断是否企业内网
function is_intranet() {
    var resultFlag = false;
    try {
        //内网ip地址:以10.开头
        var ip = uexDevice.getIP();
        if (undefined == ip || null == ip || 'undefined' == ip || 'null' == ip) {
            resultFlag = false;
        } else {
            if ("10." == ip.substring(0, 3)) {
                resultFlag = true;
            } else {
                resultFlag = false;
            }
        }
    } catch(e) {
        var platformName = uexWidgetOne.platformName;
        if ('Simulator' == platformName) {//AppCan模拟器调试代码
            resultFlag = true;
        }
    }
    return resultFlag;
}

function ajaxJson(sUrl, httpSuccess, ishtml) {
    // console.log(sUrl);
    cmp.dialog.loading("正在加载...", 0, 5, 1);
    if (ishtml) {
        $.ajax({
            type : 'POST',
            url : sUrl,
            dataType : 'html',
            async : false,
            timeout : 5000,
            success : function(data) {
                httpSuccess(data);
                cmp.dialog.loading(false);
            },
            error : function(xhr, type) {
                cmp.dialog.loading(false);
            }
        })
    } else {
        $.ajax({
            type : 'GET',
            url : sUrl,
            dataType : 'json',
            async : false,
            timeout : 50000,
            success : function(data) {
                cmp.dialog.loading(false);
                httpSuccess(data);

            },
            error : function(xhr, type) {
                cmp.dialog.loading(false);
                if (type == 'error') {
					cmp.notification.alert("数据加载失败",function(){
					    //do something after tap button
					},"提示","确定","",false,false);
                } else {
					cmp.notification.alert("网络请求失败，请重试.",function(){
					    //do something after tap button
					},"提示","确定","",false,false);
                }
            }
        })
    }
}