cmp.ready(function(){

    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    var new_option = cmp.storage.get('new_option');
    $("#select1").append(new_option);
    /*$('select').selectMania({
        size : "medium"
        //width : "240px"
        //background-color:"#eeeeee",
        // placeholder:"请选择性别"
    });
    $(".select-mania").css("background-color","white")*/
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
var paramObj = cmp.href.getParam();
$(".btn").on("tap", function() {
    switch(this.id) {
        case "btn1":
            cmp.href.back();
            break;
        case "submit":

            if($("#select1").val().length<2){
                cmp.notification.alert("请选择人员",function(){

                },"提示","确定","",false,false);
                break;
            }
            var obj = new Object()
            var affairid = paramObj.affairid;
            var summaryid = paramObj.summaryid;
            var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
            var phoneid = cmp.storage.get('ygzz_phoneid');
            var loginname = cmp.storage.get('ygzz_loginname');
            var password = cmp.storage.get('ygzz_password');
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_banli&stype=submit&doaction=back";
            url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + cmp.storage.get('content');
            url = url + "&value="+$("#select1").val();
            //console.log(url);
            obj.url=url
            obj.successFun='sucessBack'
            ajaxJson_v1(obj)
            //ajaxJson(url, sucessBack);
    }
})
function sucessBack(data) {
    console.log(data);
    cmp.notification.alert("办理成功",function(){
        cmp.webViewListener.fire({
            type:"close_banli_page",  //此参数必须和webview1注册的事件名相同
            data:"close"
        });
        if(paramObj.isfromwx=="true"){
            cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
        }else{
            cmp.href.back(3)
        }
        //cmp.href.back()

    },"提示","确定","",false,false);
    /*appcan.window.alert({
        title : "提醒",
        content : "办理成功",
        buttons : '确定',
        callback : function(err, data, dataType, optId) {
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
            closepop();
        }
    });*/
}
$("select").on("change", function(evt) {
    var ele = $(evt.currentTarget);
    selectChange(evt.currentTarget);
});
var selectChange = function(sel) {
    var sl = $(sel)[0];
    if (sl) {
        var sp = sl.parentElement;
        //<span>
        if (sp) {
            var ch = sp.getElementsByTagName('div')[0];
            var t = sl.options[sl.selectedIndex].text;
            if (ch) {
                $(ch).html(t);
            }
        }
    }
};