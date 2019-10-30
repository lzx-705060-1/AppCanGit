cmp.ready(function(){
    platform=cmp.device.info().platform;
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content1").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件

    //webview
    cmp.webViewListener.add({type: 'close_banli_page'});
    document.addEventListener('close_banli_page', function(event) {
        cmp.webViewListener.fire({
            type:"close_xietong_page",  //此参数必须和webview1注册的事件名相同
            data:"close"
        });
        cmp.href.back();
    })

    //webview
    cmp.webViewListener.add({type: 'banli_alertMsg'});
    document.addEventListener('banli_alertMsg', function(event) {
        var paramObj = event.data
        var type = paramObj.type
        var contnet = paramObj.content
        alertMsg(type,content)
    })
    //webview选择多人抄送
    cmp.webViewListener.add({type: 'choosemembers_chaosong'});
    document.addEventListener('choosemembers_chaosong', function(event) {
        setCaoS()
    })
});

function intiPage(){
    initPage2()
    
    
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
var paramObj = cmp.href.getParam()
var submit_button = false;//防止多次点击
function initPage2() {
    var title = paramObj.title;
    $("#xietongcontent").html(cmp.storage.get("xietongcontent"))
    //设置头部title
    $(".cmp-title").html(title)
    //$("#faqiren").html("发起人：" + cmp.storage.get('sendername'));
    //$("#shijian").html("发起时间：" + cmp.storage.get('create_date'));
    //得到权限节点
    //var node_policy = cmp.storage.get('node_policy');
    var node_policy = paramObj.node_policy
    //如果是公告审批权限，则出现“通过并发布”
    if (node_policy == "沟通") {
        $("#submit").removeClass('ub');
        $("#submit").hide();
        $("#back").removeClass('ub');
        $("#back").hide();
        $("#over").removeClass('ub');
        $("#over").hide();
        $("#goutong").removeClass('ub');
        $("#goutong").hide();
        $("#zhuanban").removeClass('ub');
        $("#zhuanban").hide();
        $("#chaosong").removeClass('ub');
        $("#chaosong").hide();
        $("#cxgt").removeClass('ub');
        $("#cxgt").hide();
        $("#tgfb").removeClass('ub');
        $("#tgfb").hide();
    } else if (node_policy == "公告审批" || node_policy == "新闻审批") {
        $("#submit").removeClass('ub');
        $("#submit").hide();
        $("#tijiao").removeClass('ub');
        $("#tijiao").hide();
    } else {
        $("#tgfb").removeClass('ub');
        $("#tgfb").hide();
        $("#tijiao").removeClass('ub');
        $("#tijiao").hide();
    }
    var formid = cmp.storage.get("formid");
    if (formid.indexOf("C-CW-018") != -1 || formid.indexOf("C-CW-017") != -1) {
        // $("#back").removeClass('ub');
        //$("#back").hide();
        // $("#over").removeClass('ub');
        //$("#over").hide();
    }
}

var platform = ""
function showButton(data) {
    console.log(data);
}

function setCaoS() {
    console.log('1231234432');
    var csids = cmp.storage.get('csids');
    var csnames = cmp.storage.get('csnames');
    $("#csnames").html("抄送给：" + csnames);
}

//检查是否有沟通
function checkGT() {
    var obj = new Object()
    var r = false;
    var affairid = paramObj.affairid;
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_gt&stype=check";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid;
    url = url + "&platform=" + platform;
    obj.url=url
    //obj.successFun='checkGTSuccess'
    //obj.async=false;
   // r=ajaxJson_v1(obj)
    ajaxJson(url, function(data) {
        console.log(data);
        if (data.Is_submit.RESULT == 'true') {
            cmp.notification.alert("您有沟通还未返回所有意见",function(){
                //do something after tap button
                //uexWindow.evaluateScript("ygzz_qksq", 0, "appcan.window.close(-1);");
            },"提示","确定","",false,false);
            r = true;
        }
    });
    return r;
}

function checkGTSuccess(data){
    console.log(data);
    var r =false;
    if (data.Is_submit.RESULT == 'true') {
        cmp.notification.alert("您有沟通还未返回所有意见",function(){
            //do something after tap button
            //uexWindow.evaluateScript("ygzz_qksq", 0, "appcan.window.close(-1);");
        },"提示","确定","",false,false);
        r = true;
    }
    return r
}

function checkOpin() {
    if ($("#content").val() == '' || $("#content").val() == null) {
        cmp.notification.alert("请输入办理意见",function(){

        },"提示","确定","",false,false);
        return false
    } else {
        return true;
    }
}

$("#tijiao").on( "tap", function() {
    if (!checkOpin()) {
        return;
    }
    var obj =new Object()
    var affairid = paramObj.affairid;
    var summaryid = paramObj.summaryid
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_banli&doaction=goutong&stype=submit";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
    url = url + "&platform=" + platform;
    obj.url=url
    obj.successFun='tijiaoSuccess'
    ajaxJson_v1(obj)
    /*ajaxJson(url, function(data) {
        console.log(data);
        appcan.window.alert({
            title : "提醒",
            content : "办理成功",
            buttons : '确定',
            callback : function(err, data, dataType, optId) {
                console.log(err, data, dataType, optId);
                cmp.storage.save('dbtabindex', 0);
                appcan.window.open({
                    name : 'myApply',
                    data : 'myApply.html',
                    aniId : 10,
                    type : 4
                });
                appcan.window.evaluateScript({
                    name : 'banli',
                    scriptContent : 'appcan.window.close(-1)'
                });
                appcan.window.evaluateScript({
                    name : 'xietongdetail',
                    scriptContent : 'appcan.window.close(-1)'
                });
            }
        });
    });*/
})

function tijiaoSuccess(data){

    cmp.notification.alert("办理成功",function(){
        cmp.webViewListener.fire({
            type:"close_xietong_page",  //此参数必须和webview1注册的事件名相同
            data:"close"
        });
    if(paramObj.isfromwx=="true"){
        cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
    }else{
        cmp.href.back(2)
    }

    },"提示","确定","",false,false);
}
//同意
$("#submit").on("tap", function() {
    if(submit_button){
        return
    }
    submit_button=true

    //cmp.notification.toast(str,"center",2000,0);
    if (checkGT())
        return;
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    //表单标题
    var title = paramObj.title;
    //模板id
    var templeteId = cmp.storage.get('templeteId');
    //appcan.window.openToast("正在加载...", 0, 5, 1);
    //submitFormData方法的js已存放在服务器上
    var extData={
        "title":title,
        "templeteId":templeteId
    }
    cmp.dialog.loading("加载中...");
	   submitFormData(title,templeteId);
   /* cmp.webViewListener.fire({
        type:"xietong_submitFormData",  //此参数必须和webview1注册的事件名相同
        data:extData
    });*/
   // uexWindow.evaluatePopoverScript("xietongdetail", "content", "submitFormData('" + title + "','" + templeteId + "');");
})
function httpsucess(info_list) {
    submit_button=false
    console.log(info_list);
    if (info_list['submit'] && (info_list['submit'].RETURN == 'true' || info_list['submit'].RETURN == true)) {
        cmp.notification.alert("办理成功",function(){
            cmp.webViewListener.fire({
                type:"close_xietong_page",  //此参数必须和webview1注册的事件名相同
                data:"close"
            });
            if(paramObj.isfromwx=="true"){
                cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
            }else{
                cmp.href.back(2)
            }
           // cmp.href.back(2);
        },"提示","确定","",false,false);
        /*appcan.window.alert({
            title : "提醒",
            content : "办理成功",
            buttons : '确定',
            callback : function(err, data, dataType, optId) {
                console.log(err, data, dataType, optId);
                cmp.storage.save('affairid', '');
                cmp.storage.save('summaryid', '');
                cmp.storage.save('csids', '');
                cmp.storage.save('csnames', '');
                cmp.storage.save('dbtabindex', 0);
                appcan.window.evaluateScript({
                    name : 'xietongdetail',
                    scriptContent : 'appcan.window.close(-1)'
                });
                appcan.window.evaluateScript({
                    name : 'banli',
                    scriptContent : 'appcan.window.close(-1)'
                });
                appcan.window.open({
                    name : 'myApply',
                    data : 'myApply.html',
                    aniId : 10,
                    type : 4
                });
            }
        });*/
        /*
         appcan.window.evaluatePopoverScript({
         name:"myApply",
         popName:"content",
         scriptContent:"showNewOAPageDaiban(1);"
         });*/
        return false;
    }else if(!info_list['submit']&&(info_list['preParams']==''||!(info_list['preParams'].DATA))){
        cmp.notification.alert("网络异常，请重试",function(){

        },"提示","确定","",false,false);
    } 
    else {
        cmp.notification.alert("该事项暂不支持在移动端审批,请到电脑端审批。",function(){

        },"提示","确定","",false,false);

    }
}


$("#back").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    if (checkGT())
        return;
    cmp.notification.confirm("您确定要驳回吗",function(index){
        if(index == 0){
            //点击了第一个按钮
            console.log('-----------发送数据------------');
            var obj = new Object()
            var affairid = paramObj.affairid;
            var summaryid = paramObj.summaryid;
            var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
            var phoneid = cmp.storage.get('ygzz_phoneid');
            var loginname = cmp.storage.get('ygzz_loginname');
            var password = cmp.storage.get('ygzz_password');
            var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_banli&stype=submit";
            url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
            url = url + "&platform=" + platform;
            obj.url=url
            obj.successFun='sucessBack'
           // ajaxJson(url, sucessBack);
            ajaxJson_v1(obj);
        }else if(index == 1){
            //点击了第二个按钮
        }
    },"确认",["确定","取消"],"http://www.baidu.com/log.png",false,0);
    /*appcan.window.alert({
        title : "提醒",
        content : "您确定要驳回吗？",
        buttons : ['确定', '取消'],
        callback : function(err, data, dataType, optId) {
            console.log(err, data, dataType, optId);
            if (data == 0) {
                var affairid = cmp.storage.get('affairid');
                var summaryid = cmp.storage.get('summaryid');
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var loginname = cmp.storage.get('loginname');
                var password = cmp.storage.get('password');
                var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_banli&stype=submit";
                url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
                url = url + "&platform=" + platform;
                ajaxJson(url, sucessBack);
            }
        }
    });*/
})
function sucessBack(data) {
    //打开分支
    console.log(data);
    var option = "";
    var result = data.List3.OPTION;
    for (var i = 0; i < result.length; i++) {
        option += "<option value='" + result[i].value + "'>" + result[i].name + "</option>";
    }
    cmp.storage.save('new_option', option);
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    openPopover()
}

function openPopover() {
    //var titHeight = $('#header').offset().height;
    /*var s = window.getComputedStyle($('#page_0')[0], null);
    var w = parseInt(s.width);
    var h = parseInt(s.height);*/
    //uexWindow.openPopover("new_bh_content", "0", "new_bh_content.html", "", "0", titHeight, w, h, "5", "0");
    var extData = cmp.href.getParam()
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/new_bh_content.html",extData,{openWebViewCatch: true,nativeBanner: false})
}


$("#over").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    if (checkGT())
        return;
    /*appcan.window.alert({
        title : "提醒",
        content : "您确定要作废吗？",
        buttons : ['确定', '取消'],
        callback : function(err, data, dataType, optId) {
            console.log(err, data, dataType, optId);
            if (data == 0) {
                var affairid = cmp.storage.get('affairid');
                var summaryid = cmp.storage.get('summaryid');
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var loginname = cmp.storage.get('loginname');
                var password = cmp.storage.get('password');
                var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_col&stype=submit&doaction=stop&isHidden=false";
                url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
                //console.log(url);
                url = url + "&platform=" + platform;

                ajaxJson(url, sucesszuofei);
            }
        }
    });*/
    cmp.notification.confirm("您确定要作废吗",function(index){
        if(index == 0){
            //点击了第一个按钮
            console.log('-----------发送数据------------');
            var obj = new Object()
            var affairid = paramObj.affairid;
            var summaryid = paramObj.summaryid;
            var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
            var phoneid = cmp.storage.get('ygzz_phoneid');
            var loginname = cmp.storage.get('ygzz_loginname');
            var password = cmp.storage.get('ygzz_password');
            var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_col&stype=submit&doaction=stop&isHidden=false";
            url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
            //console.log(url);
            url = url + "&platform=" + platform;
            obj.url=url
            obj.successFun='sucesszuofei'
            //ajaxJson(url, sucesszuofei);
            ajaxJson_v1(obj);
        }else if(index == 1){
            //点击了第二个按钮
        }
    },"确认",["确定","取消"],"http://www.baidu.com/log.png",false,0);
})
function sucesszuofei(data) {
    console.log(data);
    cmp.notification.alert("作废成功",function(){
        cmp.webViewListener.fire({
            type:"close_xietong_page",  //此参数必须和webview1注册的事件名相同
            data:"close"
        });
        //cmp.href.back()
        if(paramObj.isfromwx=="true"){
            cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
        }else{
            cmp.href.back(2)
        }

    },"提示","确定","",false,false);
    /*appcan.window.alert({
        title : "提醒",
        content : "作废成功",
        buttons : '确定',
        callback : function(err, data, dataType, optId) {
            console.log(err, data, dataType, optId);
            cmp.storage.save('dbtabindex', 0);
            appcan.window.evaluateScript({
                name : 'banli',
                scriptContent : 'appcan.window.close(-1)'
            });
            appcan.window.evaluateScript({
                name : 'xietongdetail',
                scriptContent : 'appcan.window.close(-1)'
            });
            appcan.window.open({
                name : 'myApply',
                data : 'myApply.html',
                aniId : 10,
                type : 4
            });
        }
    });*/
}


$("#goutong").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    cmp.storage.save('newBLtype', 'goutong');
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    var extData = cmp.href.getParam()
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/newoa_bmry.html",extData,{openWebViewCatch: true,nativeBanner: false})
    /*appcan.window.open({
        name : 'newoa_bmry',
        data : 'newoa_bmry.html',
        aniId : 10,
        type : 4
    });*/
})
$("#zhuanban").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    if (checkGT())
        return;
    var extData = cmp.href.getParam()
    cmp.storage.save('newBLtype', 'zhuanban');
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/newoa_dbmry.html",extData,{openWebViewCatch: true,nativeBanner: false})

})
//新的抄送只用于选人  此为旧版
/*appcan.button("#chaosong1", "ani-act", function() {
    var msg = cmp.storage.get('msg');
    //console.log(msg);
    if (msg != '' && msg != null) {
        appcan.window.alert({
            title : "提醒",
            content : msg,
            buttons : '确定',
            callback : function(err, data, dataType, optId) {
                console.log(err, data, dataType, optId);
                return;
            }
        });
        return;
    }
    if (checkGT())
        return;
    cmp.storage.save('newBLtype', 'chaosong');
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    appcan.window.open({
        name : 'newoa_bmry',
        data : 'newoa_bmry.html',
        aniId : 10,
        type : 4
    });
})*/
//新的抄送
$("#chaosong").on("tap", function() {
    if (checkGT())
        return;
    cmp.storage.save('newBLtype', 'chaosong');
    //cmp.storage.save('content',$("#content").val());
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/newoa_bmry.html",{},{openWebViewCatch: true,nativeBanner: false})

})

$("#cxgt").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    cmp.storage.save('content', $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20"));
    openPopoverCx()
})

function openPopoverCx() {
    //var titHeight = $('#header').offset().height;
    /*var s = window.getComputedStyle($('#page_0')[0], null);
    var w = parseInt(s.width);
    var h = parseInt(s.height);*/
    var extData = cmp.href.getParam()
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/new_cxgt_content.html",extData,{openWebViewCatch: true,nativeBanner: false})
}

$("#tgfb").on("tap", function() {
    //需要判断能不能提交
    var msg = cmp.storage.get('msg');
    console.log(msg);
    if (msg != '' && msg != null) {
        cmp.notification.alert(msg,function(){

        },"提示","确定","",false,false);

        return;
    }
    if (checkGT())
        return;
    var obj =new Object()
    var affairid = paramObj.affairid;
    var summaryid = paramObj.summaryid;
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
    if (paramObj.node_policy == "公告审批") {
        var url = serviceUrl + "/servlet/PublicServiceServlet?attitude=&stype=submit&message_id=nhoa_col&isHidden=false&bul=true";
    } else {
        var url = serviceUrl + "/servlet/PublicServiceServlet?attitude=&stype=submit&message_id=nhoa_col&isHidden=false";
    }
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
    console.log(url);
    url = url + "&platform=" + platform;
    obj.url=url
    obj.successFun='httpsucess'
    ajaxJson_v1(obj)
})
//点【同意】之后经过一系列的方法最后都会执行这个方法
function getbranch() {
    cmp.dialog.loading(false)
    var affairid = paramObj.affairid;
    var summaryid = paramObj.summaryid;
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    //var password = cmp.storage.get('ygzz_password');
    var formData = cmp.storage.get('newoa_formData');
    var fullData = cmp.storage.get('newoa_fullData');
    var obj = new Object();
    var dataObj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    dataObj.message_id = 'nhoa_col';
    dataObj.stype = 'summary';
    dataObj.username = loginname;
    //dataObj.password = password;
    dataObj.PHONE_ID = phoneid;
    dataObj.affairid = affairid;
    dataObj.summaryid = summaryid;
    dataObj.content = $("#content").val();
    dataObj.platform = platform;
    if (formData != false && formData != 'false') {
        dataObj.formData = formData;
    }
    if (fullData != false && fullData != 'false') {
        dataObj.fullData = fullData;
    }
    obj.data = dataObj;
    //obj.async = false;
    obj.type = 'get';
    obj.successFun = 'httpsucess01';
    ajaxJson_v1(obj);
}

function httpsucess01(data) {
    var condition = data['condition'];
    //.condition.DATA ;
    
    if (condition && condition.DATA.branch) {
        submit_button=false
        var branch = condition.DATA.branch;
        var is_submit = false;
        for (var i = 0; i < branch.length; i++) {
            //当属性isshow=true时，显示
            if (branch[i].isshow == 'true') {
                is_submit = true
            }
        }
        if (is_submit) {
            cmp.storage.save('branch', JSON.stringify(branch));
            //保存信息后打开另一页
            cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/branch.html",paramObj,{openWebViewCatch: true,nativeBanner: false})

        } else {
            cmp.notification.alert("请选择流程，否则本分支流程将不能流转下去。",function(){

            },"提示","确定","",false,false);
        }
    } else if(data.preParams&&data.preParams.DATA&&(data.preParams.DATA.isPop=='false'||data.conditionPage.ISGUIDANG=='true')){
        var affairid = paramObj.affairid
        var summaryid = paramObj.summaryid
        var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
        var phoneid = cmp.storage.get('ygzz_phoneid');
        var loginname = cmp.storage.get('ygzz_loginname');
        var password = cmp.storage.get('ygzz_password');
        var formData = cmp.storage.get('newoa_formData');
        var fullData = cmp.storage.get('newoa_fullData');
        var csids = cmp.storage.get('csids');
        var csnames = cmp.storage.get('csnames');
        var obj = new Object();
        var dataObj = new Object();
        obj.url = serviceUrl + "/servlet/PublicServiceServlet";
        dataObj.message_id = 'nhoa_col';
        dataObj.attitude = '';
        dataObj.stype = 'submit';
        dataObj.isHidden = 'false';
        dataObj.inputed = 'true';
        dataObj.username = loginname;
        //dataObj.password = password;
        dataObj.PHONE_ID = phoneid;
        dataObj.affairid = affairid;
        dataObj.summaryid = summaryid;
        dataObj.content = $("#content").val();
        dataObj.platform = platform;
        if (formData != false && formData != 'false') {
            dataObj.formData = formData;
        }
        if (fullData != false && fullData != 'false') {
            dataObj.fullData = fullData;
        }
        if (csids && typeof (csids) != "undefined") {
            dataObj.ids = csids;
            dataObj.names = csnames;
        }
        obj.data = dataObj;
        //obj.async = false;
        obj.type = 'get';
        obj.successFun = 'httpsucess';
        ajaxJson_v1(obj);
    }else{
        submit_button=false
         cmp.notification.alert("网络异常，请重试",function(){

            },"提示","确定","",false,false);
            return false;
    }
}

//提醒：该方法主要被其它页面调用
function alertMsg(flag, content) {
    if (1 == flag || '1' == flag) {
        var msg = cmp.storage.get('msg');
        cmp.notification.alert(msg,function(){
            cmp.href.back()
        },"提示","确定","",false,false);

    } else if (2 == flag || '2' == flag) {
        cmp.notification.alert("此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。",function(){
            cmp.href.back()
        },"提示","确定","",false,false);

    } else if (3 == flag || '3' == flag) {
        cmp.notification.alert(content,function(){
            cmp.href.back()
        },"提示","确定","",false,false);
    }
}
//这里是入口：提交表单数据,开始审批操作
//调用该方法,下面4个方法都会被会按照顺序的执行
//该方法的作用是将input_xml中的数据整理封装在xmlData中,方便后续使用
function submitFormData(title, templeteId) {
    //一般的流程或是公文
    var dataBodyType= cmp.storage.get("data_bodytype");
    var dataBodyType = dataBodyType;
    //原始的input_xml配置文件
    var inputXML= cmp.storage.get("data_input_xml");
    var inputXML = inputXML;
    //原始的xml配置文件
    var data_xml= cmp.storage.get("data_xml");
    var xml =data_xml ;
    //表单是否允许在移动端编辑
    var CEF = isCanEditForm(templeteId);
    if ("FORM" == dataBodyType) {
        //一般的流程
        //xmlData:全部的数据都是封装在该对象中
        var xmlData = new Object();
        //repeatiArr：重复行的数据封装在该对象中
        var repeatiArr = new Array();
        //nonRepeatiArr:非重复行的数据封装在该对象中
        var nonRepeatiArr = new Array();
        //accessEditDetailArr:允许编辑的数据项非常详细的封装在该对象中
        var accessEditDetailArr = new Array();
        //accessEditArr:简单的记录可编辑项
        var accessEditArr = new Array();
        //fieldInputArr:一开始定义这个变量是为了解决[通用信息服务申请单]数据众多的问题
        var fieldInputArr = new Array();
        //fieldInputUpperCaseArr:一开始定义这个变量是为了方便解决一些兼容问题
        var fieldInputUpperCaseArr = new Array();
        //这个循环可以获取获取所有输入项,但是还没有分装详细的内容
        //一开始定义这个变量是为了解决[通用信息服务申请单]数据众多的问题
        $(inputXML).find("FieldInput[name^=my]").each(function(index0, element0) {
            var fildName = $(element0).attr("name");
            fieldInputArr.push(fildName);
            fieldInputUpperCaseArr.push(fildName.toUpperCase());
        })
        xmlData.fieldInputArr = fieldInputArr;
        xmlData.fieldInputUpperCaseArr = fieldInputUpperCaseArr;
        //这个循环可以获取重复行的相关属性,但是还不能知道重复行完整的结构
        $(inputXML).find("SlaveTable").each(function(index1, element1) {
            var slaveTableObj = new Object();
            var input_name = $(element1).attr("name");
            var input_allowadd = $(element1).attr("allowadd");
            var input_allowdelete = $(element1).attr("allowdelete");
            slaveTableObj.selfNodeName = input_name;
            slaveTableObj.allowadd = input_allowadd;
            slaveTableObj.allowdelete = input_allowdelete;
            repeatiArr.push(slaveTableObj);
        })
        xmlData.repeatiArr = repeatiArr;
        xmlData.title = title;
        xmlData.templeteId = templeteId;
        var repeatingTableArr = new Array();
        if ("-1682276082661768178" == templeteId) {
            //[通用信息服务申请单]存在较多的重复行,需要标记无关的可编辑项,方便后面数据处理
            //此处循环是得到页面上显示的重复行,并得到组重复行的结构,也就是下面定义的pathPrev
            $("tbody[xd\\:xctname='RepeatingTable']").each(function(index01, element01) {
                var isShow = $(element01).parent().css("display");
                if ("none" != isShow) {
                    $(element01).find("tr").each(function(index02, element02) {
                        if (0 == index02) {
                            var pathObj = new Object();
                            var repeatingTablePath = $(element02).attr("path");
                            var pathArr = repeatingTablePath.split("/");
                            pathObj.repeatingTablePath = repeatingTablePath;
                            pathObj.pathPrev = pathArr[0];
                            pathObj.pathNext = pathArr[1];
                            repeatingTableArr.push(pathObj);
                        }
                    })
                }
            })
        }
        //需要对传进来的xml去掉一些没用的部分和加上一些有用的部分
        xmlData.repeatingTableArr = repeatingTableArr;
        var reg01 = new RegExp('<my:myFields\\s+xmlns:my=".*?"\\s+recordid=".*?">\\s+(.*)');
        xml.replace(reg01, function() {
            xml = "<xml><my:myFields>" + arguments[1] + "</xml>";
        });
        //此处循环是封装重复行的详细信息
        for (var i = 0; i < repeatiArr.length; i++) {
            var repeatiBody = new Array();
            var selfNodeName = repeatiArr[i].selfNodeName;
            var slaveTableName = selfNodeName.replace(":", "\\:").replace(".", "\\.");
            $(xml).find(slaveTableName).each(function(index2, element2) {
                if (0 == index2) {
                    //对parentNodeName大小写处理不要轻易改动,可能影响[通用信息服务申请单]对重复行数据的发送
                    var parentNodeName = $(element2).parent()[0].nodeName;
                    if (null != parentNodeName && undefined != parentNodeName) {
                        parentNodeName = parentNodeName.replace("MY:", "my:");
                    }
                    repeatiArr[i].parentNodeName = parentNodeName;
                    $(element2).children().each(function(index3, element3) {
                        var inputObj = new Object();
                        //此处5行兼容代码，处理标签大小写问题：重要
                        var childNodeName = $(element3)[0].nodeName;
                        var indexUpperCase = fieldInputUpperCaseArr.indexOf(childNodeName);
                        if (-1 != indexUpperCase) {
                            childNodeName = fieldInputArr[indexUpperCase];
                        }
                        inputObj.childNodeName = childNodeName;
                        $(inputXML).find("FieldInput[name='" + childNodeName + "']").each(function(index4, element4) {
                            if (0 == index4) {
                                inputObj.type = $(element4).attr("type");
                                inputObj.fieldtype = $(element4).attr("fieldtype");
                                inputObj.name = $(element4).attr("name");
                                inputObj.id = $(element4).attr("name").replace(":", "");
                                inputObj.fieldlength = $(element4).attr("length");
                                inputObj.extendNameType = $(element4).attr("extendNameType");
                                inputObj.dataName = $(element4).attr("name");
                                inputObj.dataType = $(element4).attr("type");
                                inputObj.dataFieldtype = $(element4).attr("fieldtype");
                                inputObj.dataLength = $(element4).attr("length");
                                inputObj.dataAccess = $(element4).attr("access");
                                inputObj.extendExtendNameType = $(element4).attr("extendNameType");
                                inputObj.dataAllowprint = $(element4).attr("allowprint");
                                inputObj.dataAllowtransmit = $(element4).attr("allowtransmit");
                                inputObj.dataIsUnique = $(element4).attr("isUnique");
                                inputObj.dataIsNull = $(element4).attr("is_null");
                                inputObj.dataIsFile = $(element4).attr("is_file");
                                inputObj.dataIsImage = $(element4).attr("isImage");
                                inputObj.dataIsDisplayBaseForm = $(element4).attr("isDisplayBaseForm");
                                inputObj.dataAllowmodify = $(element4).attr("allowmodify");
                                inputObj.dataFormattype = $(element4).attr("formattype");
                                inputObj.dataFormAppId = $(element4).attr("formAppId");
                                inputObj.dataRelInputAtt = $(element4).attr("relInputAtt");
                                inputObj.dataSelectType = $(element4).attr("selectType");
                                inputObj.dataRelationConditionId = $(element4).attr("relationConditionId");
                                inputObj.dataIsDisplayRelated = $(element4).attr("isDisplayRelated");
                                inputObj.dataIsFinChild = $(element4).attr("isFinChild");
                            }
                        })
                        if ("edit" == inputObj.dataAccess && undefined != inputObj.type && "lable" != inputObj.type && "relation" != inputObj.type) {
                            if ("-1682276082661768178" == xmlData.templeteId) {
                                //reArr:在页面上能看到的重复发行
                                //此处有些复杂,定义isContent是为了解决[通用信息服务申请单]数据众多的问题
                                //[通用信息服务申请单]存在较多的重复行,需要标记无关的可编辑项,方便后面数据处理
                                var rtArr = xmlData.repeatingTableArr;
                                if (rtArr.length > 0) {
                                    var isContent = false;
                                    for (var i = 0; i < rtArr.length; i++) {
                                        if (rtArr[i].pathPrev == parentNodeName && rtArr[i].pathNext == selfNodeName) {
                                            isContent = true;
                                        }
                                    }
                                    if (isContent == true) {
                                        inputObj.dataBodyCanSend = 'true';
                                        accessEditDetailArr.push(inputObj);
                                        accessEditArr.push(childNodeName);
                                    } else {
                                        inputObj.dataBodyCanSend = 'false';
                                    }
                                } else {
                                    inputObj.dataBodyCanSend = 'false';
                                    accessEditDetailArr.push(inputObj);
                                    accessEditArr.push(childNodeName);
                                }
                            } else {
                                inputObj.dataBodyCanSend = 'true';
                                accessEditDetailArr.push(inputObj);
                                accessEditArr.push(childNodeName);
                            }
                        }
                        repeatiBody.push(inputObj);
                    })
                    repeatiArr[i].body = repeatiBody;
                }
            })
        }
        //此处循环是封装非重复行的详细信息
        $(xml).find("my\\:myFields").children().each(function(index5, element5) {
            var childLength = $(element5).children().length;
            if (0 == childLength) {
                var inputObj = new Object();
                //此处5行兼容代码，处理标签大小写问题：重要
                var childNodeName = $(element5)[0].nodeName;
                var indexUpperCase = fieldInputUpperCaseArr.indexOf(childNodeName);
                if (-1 != indexUpperCase) {
                    childNodeName = fieldInputArr[indexUpperCase];
                }
                inputObj.childNodeName = childNodeName;
                $(inputXML).find("FieldInput[name='" + childNodeName + "']").each(function(index6, element6) {
                    if (0 == index6) {
                        inputObj.type = $(element6).attr("type");
                        inputObj.fieldtype = $(element6).attr("fieldtype");
                        inputObj.name = $(element6).attr("name");
                        inputObj.id = $(element6).attr("name").replace(":", "");
                        inputObj.fieldlength = $(element6).attr("length");
                        inputObj.extendNameType = $(element6).attr("extendNameType");
                        inputObj.dataName = $(element6).attr("name");
                        inputObj.dataType = $(element6).attr("type");
                        inputObj.dataFieldtype = $(element6).attr("fieldtype");
                        inputObj.dataLength = $(element6).attr("length");
                        inputObj.dataAccess = $(element6).attr("access");
                        inputObj.extendExtendNameType = $(element6).attr("extendNameType");
                        inputObj.dataAllowprint = $(element6).attr("allowprint");
                        inputObj.dataAllowtransmit = $(element6).attr("allowtransmit");
                        inputObj.dataIsUnique = $(element6).attr("isUnique");
                        inputObj.dataIsNull = $(element6).attr("is_null");
                        inputObj.dataIsFile = $(element6).attr("is_file");
                        inputObj.dataIsImage = $(element6).attr("isImage");
                        inputObj.dataIsDisplayBaseForm = $(element6).attr("isDisplayBaseForm");
                        inputObj.dataAllowmodify = $(element6).attr("allowmodify");
                        inputObj.dataFormattype = $(element6).attr("formattype");
                        inputObj.dataFormAppId = $(element6).attr("formAppId");
                        inputObj.dataRelInputAtt = $(element6).attr("relInputAtt");
                        inputObj.dataSelectType = $(element6).attr("selectType");
                        inputObj.dataRelationConditionId = $(element6).attr("relationConditionId");
                        inputObj.dataIsDisplayRelated = $(element6).attr("isDisplayRelated");
                        inputObj.dataIsFinChild = $(element6).attr("isFinChild");
                    }
                })
                if ("edit" == inputObj.dataAccess && undefined != inputObj.type && "lable" != inputObj.type && "relation" != inputObj.type) {
                    accessEditDetailArr.push(inputObj);
                    accessEditArr.push(childNodeName);
                }
                nonRepeatiArr.push(inputObj);
                xmlData.nonRepeatiArr = nonRepeatiArr;
            }
        })
        xmlData.accessEditDetailArr = accessEditDetailArr;
        xmlData.accessEditArr = accessEditArr;
        //获取表单数据
        getFormData(xmlData, inputXML, xml, templeteId, CEF);
    } else if ("OfficeWord" == dataBodyType || "HTML" == dataBodyType) {
        //公文或新闻
        cmp.storage.save('newoa_formData', false);
        cmp.storage.save('newoa_fullData', false);

       getbranch();
        //uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
    } else {
        //其它未知流程
        alertMsg('3','请重新尝试：未知的BODY_TYPE类型。')
        /*cmp.webViewListener.fire({
            type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
            data:{
                "type":"3",
                "content":"请重新尝试：未知的BODY_TYPE类型。"
            }
        });*/
        //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','请重新尝试：未知的BODY_TYPE类型。');");
    }
}

//新OA协同：xietongdetail_content.html
//表单是否允许在移动端编辑审批
function isCanEditForm(templeteId) {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var loginname = cmp.storage.get('ygzz_loginname');
    console.log(templeteId);
    //正式服不开启表单编辑
    var oaArr = new Array();
    var formArr = [];
    oaArr.push('A000305');
    oaArr.push('A000508');
    oaArr.push('A000543');
    oaArr.push('A000929');
    oaArr.push('A002320');
    oaArr.push('A002780');
    oaArr.push('A003737');
    oaArr.push('A006826');
    oaArr.push('A006897');
    oaArr.push('A008698');
    oaArr.push('A013198');
    oaArr.push('A013237');
    oaArr.push('A015354');
    oaArr.push('A018053');
    oaArr.push('A023652');
    oaArr.push('A036247');
    oaArr.push('A055057');
    oaArr.push('A065798');
    oaArr.push('A067565');
    oaArr.push('A076216');
    oaArr.push('liuzhengjun');
    oaArr.push('seeyon2');
    oaArr.push('A000485');
    oaArr.push('A064151');
    oaArr.push('linlidan');
    oaArr.push('A000652');
    oaArr.push('A000415');
    oaArr.push('A002188');
    oaArr.push('A089999');
    oaArr.push('A049356');
    oaArr.push('A034569');
    oaArr.push('A000641');
    oaArr.push('A108248');//黄浩彬

    if (oaArr.indexOf(loginname) != -1 || templeteId == "7842420384121704041") {
        formArr = ["-3262929075556103983", "-6534540451007414205", "-1682276082661768178", "5521390291815648908", "-656673282741353770", "6783254089728410802", "4915972576696422178", "-3524333937175606019", "-8526166933915351303", "6560620198130893179", "788424823177561202", "-2481447930518813670", "-517030576051564970", "-4098333848254069463",
            "8939429994092776283",
            //"8922205370062031803",
            //"-7119516754335742861",
            //"1159662951455280498",
            "-1192552355850794725", "7842420384121704041"
            //"-4075340959497236759",
            //"-6113656700180872074",
            //"-3735391380211350158"
            //"5181108400302475433",
            //"4913029040738159614",
            //"7697658255577335036",
            //"-3328335427922278323",
            //"69356868501981685",
            //"8377028700636268812",
            //"-6928101050308345192",
            //"-1030900657859704135"
        ];
    }
    var checkR = formArr.indexOf(templeteId);
    if (-1 == checkR) {
        console.log("不允许编辑");
        return false;
    } else {
        console.log("允许编辑,当前允许表单编辑数量:" + formArr.length);
        return true;
    }
}


//获取表单数据:此方法最有可能出错
//该方法的作用是对可移动端编辑的表单进行formData和fullData参数的拼接
//如果表单不允许在移动端编辑则对输入项的判断或是直接提交表单
function getFormData(xmlData, inputXML, xml, templeteId, CEF) {
//alert("开始");
   console.log(xmlData);
    if (CEF == true) {

        //能进入这里代表已是允许在移动端编辑
        try {
            //开始拼接formData和fullData
            var formData = '';
            var fullData = '';
            formData += '<FormData type="seeyonfrom">';
            formData += '<Engine>infopath</Engine>';
            formData += '<SubmitData type="submit" state="">';
            formData += '<my:myFields>';
            fullData = formData;
            //非重复行可填项的拼接
            var nonRepeatiArr = xmlData.nonRepeatiArr;
            for (var i = 0; i < nonRepeatiArr.length; i++) {
                var editObj_id = nonRepeatiArr[i].id;
                var editObj_name = nonRepeatiArr[i].name;
                var editObj_type = nonRepeatiArr[i].type;
                var editObj_access = nonRepeatiArr[i].dataAccess;
                var editObj_ENT = nonRepeatiArr[i].extendNameType;
                if ("edit" == editObj_access) {
                    if (('text' == editObj_type || 'relation' == editObj_type || 'textarea' == editObj_type) || ('extend' == editObj_type && ('日期选取器' == editObj_ENT || '日期时间选取器' == editObj_ENT))) {
                        formData += '<' + editObj_name + '>';
                        if ($("#" + editObj_id).val() != '') {
                            formData += $("#" + editObj_id).val();
                        } else {
                            formData += 0;
                        }
                        formData += '</' + editObj_name + '>';
                        //---------
                        fullData += '<' + editObj_name + '>';
                        fullData += $("#" + editObj_id).val();
                        fullData += '</' + editObj_name + '>';
                    } else if ('checkbox' == editObj_type) {
                        var a = document.getElementById(editObj_id);
                        formData += '<' + editObj_name + '>';
                        if (a.checked) {

                            formData += 1;

                        } else {
                            formData += 0;
                        }
                        formData += '</' + editObj_name + '>';

                        //---------
                        fullData += '<' + editObj_name + '>';
                        if (a.checked) {
                            fullData += 1;
                        } else {
                            fullData += 0;
                        }
                        fullData += '</' + editObj_name + '>';

                    } else if ('select' == editObj_type) {
                        var selectedValue = $("#"+editObj_id)[0].value;
                        var selectedText = $("#"+editObj_id).find("option[value='"+selectedValue+"']")[0].text;
                        formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                        formData += selectedValue;
                        formData += '</' + editObj_name + '>';
                        //---------
                        fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                        fullData += selectedText;
                        fullData += '</' + editObj_name + '>';
                    } else if ('extend' == editObj_type && ('选择单位' == editObj_ENT || '选择部门' == editObj_ENT || '选择人员' == editObj_ENT)) {
                        var selectedValue = $("#" + editObj_id).attr("default");
                        var selectedText = $("#" + editObj_id).val();
                        if (selectedValue == null || selectedValue == 'null') {
                            formData += '<' + editObj_name + '>';
                            formData += '</' + editObj_name + '>';
                            //---------
                            fullData += '<' + editObj_name + ' >';
                            fullData += selectedText;
                            fullData += '</' + editObj_name + '>';
                        } else {
                            formData += '<' + editObj_name + ' value="' + selectedValue + '">';

                            formData += selectedValue;
                            formData += '</' + editObj_name + '>';
                            //---------
                            fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                            fullData += selectedText
                            fullData += '</' + editObj_name + '>';
                        }
                    }
                }
            }
            //重复行可填项的拼接
            var repeatiArr = xmlData.repeatiArr;
            for (var i = 0; i < repeatiArr.length; i++) {
                //dataBodyCanSend:该变量的定义一开始是为了解决[通用信息服务申请单]数据众多的问题
                var isBodyNeedEdit = false;
                var repeatiBody = repeatiArr[i].body;
                //此处[预算解锁调整审批单]有问题：input_xml有重复行的标记,但是xml与之对应的重复行数据不完整,其它单据未发现问题。
                //当repeatiBody为undefined是跳过重复行
                if (undefined != repeatiBody) {
                    for (var k = 0; k < repeatiBody.length; k++) {
                        var needEdit = repeatiBody[k].dataAccess;
                        var dataBodyCanSend = repeatiBody[k].dataBodyCanSend;
                        if ("edit" == needEdit && 'true' == dataBodyCanSend) {
                            isBodyNeedEdit = true;
                            break;
                        }
                    }
                }
                if (isBodyNeedEdit == true) {
                    //一张单据可能存在众多的重复行,只有允许编辑的重复行才会进入这里
                    var repeatiParentNodeName = repeatiArr[i].parentNodeName;
                    var repeatiSelfNodeName = repeatiArr[i].selfNodeName;
                    var repetiPath = repeatiArr[i].parentNodeName + "/" + repeatiArr[i].selfNodeName;
                    formData += '<' + repeatiParentNodeName + '>';
                    fullData += '<' + repeatiParentNodeName + '>';
                    var repeatingTableTbody = "tbody[xd\\:xctname='RepeatingTable'] tr[path='" + repetiPath + "']";
                    //此处：[区域公司预算解锁调整审批单]和[集团本部预算解锁调整审批单]两张的页面重复行标记的位置标签与其它表单不一样
                    if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
                        repeatingTableTbody = "div[path='" + repetiPath + "']";
                    }
                    //审计监察发现事项整改计划完成卡
                    if ("-4075340959497236759" == templeteId) {
                        repeatingTableTbody = "div[path='" + repetiPath + "']";
                    }
                    $(repeatingTableTbody).each(function(index7, element7) {
                        var pathRecordId = $(element7).attr("recordid");
                        if ("-1" == pathRecordId) {
                            //当前新增的行
                            formData += '<' + repeatiSelfNodeName + ' state="add" sort="' + index7 + '">';
                            fullData += '<' + repeatiSelfNodeName + ' state="add" sort="' + index7 + '">';
                        } else {
                            //本来存在的行
                            formData += '<' + repeatiSelfNodeName + ' recordid="' + pathRecordId + '" sort="' + index7 + '">';
                            fullData += '<' + repeatiSelfNodeName + ' recordid="' + pathRecordId + '" sort="' + index7 + '">';
                        }
                        for (var j = 0; j < repeatiBody.length; j++) {
                            var editObj_id = repeatiBody[j].id;
                            var editObj_name = repeatiBody[j].name;
                            var editObj_type = repeatiBody[j].type;
                            var editObj_access = repeatiBody[j].dataAccess;
                            var editObj_ENT = repeatiBody[j].extendNameType;
                            if ("edit" == editObj_access) {
                                if (('text' == editObj_type || 'relation' == editObj_type || 'textarea' == editObj_type) || ('extend' == editObj_type && ('日期选取器' == editObj_ENT || '日期时间选取器' == editObj_ENT))) {
                                    formData += '<' + editObj_name + '>';
                                    formData += $(element7).find("#" + editObj_id).val();
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + '>';
                                    fullData += $(element7).find("#" + editObj_id).val();
                                    fullData += '</' + editObj_name + '>';
                                } else if ('select' == editObj_type) {
                                    var selectedValue = $(element7).find("#"+editObj_id)[0].value;
                                    var selectedText = $(element7).find("#"+editObj_id).find("option[value='"+selectedValue+"']")[0].text;
                                    formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    formData += selectedValue;
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    fullData += selectedText;
                                    fullData += '</' + editObj_name + '>';
                                } else if ('extend' == editObj_type && ('选择单位' == editObj_ENT || '选择部门' == editObj_ENT || '选择人员' == editObj_ENT)) {
                                    var selectedValue = $(element7).find("#" + editObj_id).attr("default");
                                    var selectedText = $(element7).find("#" + editObj_id).val();
                                    formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    formData += selectedValue;
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    fullData += selectedText;
                                    fullData += '</' + editObj_name + '>';
                                }
                            }
                        }
                        formData += '</' + repeatiSelfNodeName + '>';
                        fullData += '</' + repeatiSelfNodeName + '>';
                    })
                    formData += '</' + repeatiParentNodeName + '>';
                    fullData += '</' + repeatiParentNodeName + '>';
                }
            }
            formData += '</my:myFields>';
            formData += '</SubmitData>';
            formData += '</FormData>';
            //------------
            fullData += '</my:myFields>';
            fullData += '</SubmitData>';
            fullData += '</FormData>';
            //提交前的数据校验
            beforSubmit(xmlData, inputXML, xml, templeteId, CEF, formData, fullData);
        } catch(e) {
            console.error("出错了:" + e);
            var accessEditArr = xmlData.accessEditArr
            if (accessEditArr.length > 0) {
                //存在可编辑项
                alertMsg(2)
                //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
                /*cmp.webViewListener.fire({
                    type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                    data:{
                        "type":"2",
                        "content":""
                    }
                });*/
                //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
            } else {
                alertMsg('3','与服务器失去连接 ，请重新尝试。');
                //与服务器失去连接 ，请重新尝试
                /*cmp.webViewListener.fire({
                    type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                    data:{
                        "type":"3",
                        "content":"与服务器失去连接 ，请重新尝试。"
                    }
                });*/
                //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','与服务器失去连接 ，请重新尝试。');");
            }
        }
    } else {
        //这里代表还没有开放移动端编辑表单
        //如果xml的必填项没有值则提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
        //如果xml必填项都有值,则进行审批操作，但是不传formData和fullData参数
        //可编辑项的详细信息封装在此
        var accessEditDetailArr = xmlData.accessEditDetailArr;
        var alertStr = "";
        for (var i = 0; i < accessEditDetailArr.length; i++) {
            var displayName = accessEditDetailArr[i].dataName.replace("my:", "");
            var dataName = accessEditDetailArr[i].dataName.replace(":", "\\:");
            var dataAccess = accessEditDetailArr[i].dataAccess;
            var dataIsNull = accessEditDetailArr[i].dataIsNull;
            if ("edit" == dataAccess && "false" == dataIsNull) {
                $(xml).find(dataName).each(function(index8, element8) {
                    var editObj_text = $(element8).text();
                    if ("" == editObj_text) {
                        alertStr += "【" + displayName + "】不能为空\n";
                    }
                })
            }
        }
        if ("" == alertStr) {
            //此处代表未实现在移动端编辑的表单,没有可编辑项或是可编辑项都已经有值了
            cmp.storage.save('newoa_formData', false);
            cmp.storage.save('newoa_fullData', false);
            console.log("此处代表未实现在移动端编辑的表单,没有可编辑项或是可编辑项都已经有值了");
            //全部校验通过,开始审批
          getbranch();
            //uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
        } else {
            //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
            alertMsg(2)
            /*cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"2",
                    "content":""
                }
            });*/
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
        }
    }
}

//提交前的数据校验:能进入这里的都是允许在移动端编辑的表单,此处校验必填项是否为空以及数字类型的输入是否为数字
function beforSubmit(xmlData, inputXML, xml, templeteId, CEF, formData, fullData) {
    var accessEditArr = xmlData.accessEditArr;
    var accessEditDetailArr = xmlData.accessEditDetailArr;
    var nonRepeatiArr = xmlData.nonRepeatiArr;
    var repeatiArr = xmlData.repeatiArr;
    var alertStr = '';
    var checkResult = false;
    if (accessEditDetailArr.length > 0) {
        //有必填项,先校验非重复行
        if (nonRepeatiArr.length > 0) {
            for (var i = 0; i < nonRepeatiArr.length; i++) {
                var fieldtype = nonRepeatiArr[i].fieldtype;
                var id = nonRepeatiArr[i].id;
                var name = nonRepeatiArr[i].name;
                if (undefined != name) {
                    var displayName = nonRepeatiArr[i].name.replace("my:", "");
                    var showName = nonRepeatiArr[i].name.replace(":", "\\:");
                    if (-1 != accessEditArr.indexOf(name)) {
                        for (var k = 0; k < accessEditDetailArr.length; k++) {
                            var dataIsNull = accessEditDetailArr[k].dataIsNull;
                            var dataName = accessEditDetailArr[k].name;
                            if (name == dataName && 'false' == dataIsNull) {
                                $(formData).find(showName).each(function(index8, element8) {
                                    var editObj_text = $(element8).text();
                                    if ('' == editObj_text || undefined == editObj_text || null == editObj_text) {
                                        alertStr += "【" + displayName + "】不能为空\n";
                                    } else {
                                        if ("DECIMAL" == fieldtype) {
                                            if ('NaN' == String(Number(editObj_text))) {
                                                alertStr += "【" + displayName + "】不为数字\n";
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
        //再校验重复项
        if (repeatiArr.length > 0) {
            for (var i = 0; i < repeatiArr.length; i++) {
                var repeatiBody = repeatiArr[i].body;
                if (undefined != repeatiBody) {
                    if (repeatiBody.length > 0) {
                        for (var j = 0; j < repeatiBody.length; j++) {
                            var fieldtype = repeatiBody[j].fieldtype;
                            var id = repeatiBody[j].id;
                            var name = repeatiBody[j].name;
                            if (undefined != name) {
                                var displayName = repeatiBody[j].name.replace("my:", "");
                                var showName = repeatiBody[j].name.replace(":", "\\:");
                                if (-1 != accessEditArr.indexOf(name)) {
                                    for (var k = 0; k < accessEditDetailArr.length; k++) {
                                        var dataIsNull = accessEditDetailArr[k].dataIsNull;
                                        var dataName = accessEditDetailArr[k].name;
                                        if (name == dataName && 'false' == dataIsNull) {
                                            $(formData).find(showName).each(function(index9, element9) {
                                                var editObj_text = $(element9).text();
                                                if ('' == editObj_text || undefined == editObj_text || null == editObj_text) {
                                                    alertStr += "【" + displayName + "】不能为空\n";
                                                } else {
                                                    if ("DECIMAL" == fieldtype) {
                                                        if ('NaN' == String(Number(editObj_text))) {
                                                            alertStr += "【" + displayName + "】不为数字\n";
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ('' != alertStr) {//提醒有必填项
            checkResult = false;
            alertMsg('3',alertStr);
            /*cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"3",
                    "content":alertStr
                }
            });*/
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','" + alertStr + "');");
        } else {
            checkResult = true;
        }
    } else {
        checkResult = true;
    }
    if (checkResult == true) {
        //存在可编辑项并且允许在移动端编辑的表单才传formData和fullData参数
        if (accessEditDetailArr.length > 0 && isCanEditForm(templeteId)) {
            cmp.storage.save('newoa_formData', formData);
            cmp.storage.save('newoa_fullData', fullData);
        } else {
            cmp.storage.save('newoa_formData', false);
            cmp.storage.save('newoa_fullData', false);
        }
        if (checkFormData(xmlData, inputXML, xml, templeteId, CEF, formData, fullData)) {
            //全部校验通过,开始审批
            getbranch();
            /*cmp.webViewListener.fire({
                type:"banli_getbranch",  //此参数必须和webview1注册的事件名相同
                data:{}
            });*/
            // uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
        }
    }
    //console.log(formData);
    //console.log(fullData);
}

//检查FormData的数据：能进入这里的都是允许在移动端编辑的表单,此处校验一些特殊字段的值
function checkFormData(xmlData, inputXML, xml, templeteId, CEF, formData, fullData) {
    var alertStr = "";
    var checkResult = true;
    if ("-656673282741353770" == templeteId) {
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:分数")) {
            $(formData).find("my\\:分数").each(function(index1, element1) {
                var score = Number($(element1).text());
                if ('NaN' == String(score)) {
                    alertStr += "【分数】不为数字\n";
                } else if (score <= 0) {
                    alertStr += "【分数】必须大于0\n";
                } else if (score > 100) {
                    alertStr += "【分数】输入不能大于100\n";
                }
            })
        }
        if (-1 != accessEditArr.indexOf("my:权重")) {
            var QZScore = 0;
            $(formData).find("my\\:权重").each(function(index2, element2) {
                QZScore += Number($(element2).text());
            })
            if ('NaN' == String(QZScore)) {
                alertStr += "【权重】不为数字\n";
            } else if (100 != QZScore) {
                alertStr += "【权重】总和不等于100\n";
            }
        }
    } else if ("4913029040738159614" == templeteId) {
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:得分")) {
            $(formData).find("my\\:myFields").children().each(function(index3, element3) {
                var nodeName = $(element3)[0].nodeName;
                var nodeText = $(element3).text();
                if (-1 != nodeName.indexOf("MY:评分")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\n";
                    }
                }
                if (-1 != nodeName.indexOf("MY:小计分数")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\n";
                    }
                }
                if (-1 != nodeName.indexOf("MY:得分")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\n";
                    }
                }
            })
        }
    } else if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
        //区域公司预算解锁调整审批单
        //集团本部预算解锁调整审批单
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:本次批复金额") && -1 != accessEditArr.indexOf("my:本次批复金额合计")) {
            var scoreTotal = 0;
            $(formData).find("my\\:本次批复金额").each(function(index1, element1) {
                var score = Number($(element1).text());
                if ('NaN' == String(score)) {
                    alertStr += "【本次批复金额】不为数字\n";
                } else {
                    scoreTotal += score;
                }
            })
            $(formData).find("my\\:本次批复金额合计").each(function(index2, element2) {
                var score2 = Number($(element2).text());
                if ('NaN' == String(score2)) {
                    alertStr += "【本次批复金额合计】不为数字\n";
                } else {
                    if (scoreTotal != score2) {
                        //校验不通过
                        checkResult = false;
                        alertStr += "【本次批复金额】合计应等于【本次批复金额合计】\n";
                    }
                }
            })
        }
    }
    if ('' != alertStr) {
        //进入此处代表数据校验不通过
        checkResult = false;
        if (CEF == true) {
            //提示具体的必填项内容
            alertMsg('3',alertStr);
            /*cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"3",
                    "content":alertStr
                }
            });*/
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','" + alertStr + "');");
        } else {
            //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
            alertMsg(2);
            /*cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"2",
                    "content":""
                }
            });*/
            uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
        }
    }
    console.log("校验结果：" + checkResult);
    return checkResult;
}
