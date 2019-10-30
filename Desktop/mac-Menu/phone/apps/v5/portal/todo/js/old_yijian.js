cmp.ready(function(){

    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getYijian()
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
function getYijian() {
    var obj = new Object()
    var paramObj = cmp.href.getParam()
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    //var olduser = cmp.storage.get('olduser');
    //var oldpwd = cmp.storage.get('oldpwd');
	var olduser = "huanghaobin1";
	var oldpwd = "84695103";
    var processGUID = cmp.storage.get('processGUID');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=yijian";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID;
    obj.url=url;
    obj.successFun="httpsucess";
    ajaxJson_v1(obj);
}

function httpsucess(info_list) {
    console.log(info_list['opinions'].RESULT);
    var info_list_mode = new Array(info_list['opinions'].RESULT.length);
    console.log(info_list['opinions'].RESULT.length);
    for ( i = 0; i < info_list['opinions'].RESULT.length; i++) {
        var info_mode = new Object();
        info_mode.describe = "<div>" + info_list['opinions'].RESULT[i].content +"</div><div>"+info_list['opinions'].RESULT[i].time+ "</div>";
        info_mode.title = "<div>" + info_list['opinions'].RESULT[i].yijian+"</div>";
        info_list_mode.push(info_mode);
    }

    var html = ""
    html += '<ul>'
    for (i = 0; i < info_list_mode.length; i++) {
        if (info_list_mode[i] == null) {
            continue;
        }

        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
        html += '<ul class="ub-f1 ub ub-ver marg-l">'
        html += '<li class="bc-text ub ub-ver ut-m line3">'
        html += info_list_mode[i].title
        html += '</li>'
        html += '<li class="ulev-lv sc-text1 uinn3">'
        html += info_list_mode[i].describe
        html += '</li>'
        html += '</ul>'
        html += '</ul>'
        html += '</li>'
    }
    html += '</ul>'
    $("#listview").html(html)
}


