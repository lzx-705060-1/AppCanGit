cmp.ready(function(){

    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    var new_option = cmp.storage.get('option');
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
var platform = cmp.storage.get('platform');
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
            var se = $("#select1").val().split(",");
            var steppathguid = se[0];
            var auditor = se[1];
            var auditorname = se[2];
            var oid = cmp.storage.get("link_uniqueid").toUpperCase();
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            var StationGUID = cmp.storage.get('StationGUID', StationGUID);
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_ht&stype=submit";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + cmp.storage.get('content') + "&oid=" + oid;
            url = url + "&steppathguid=" + steppathguid + "&auditor=" + auditor + "&auditorname=" + auditorname;
            url = url + "&StationGUID=" + StationGUID;
            url = url + "&platform=" + platform;
            obj.url=url
            obj.successFun='sucessBack'
            ajaxJson_v1(obj)
    }
})
function sucessBack(data) {
    console.log(data);
    cmp.notification.alert("办理成功",function(){
        cmp.href.back(3)
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