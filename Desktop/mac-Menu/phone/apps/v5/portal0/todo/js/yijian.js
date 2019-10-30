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
    var affairid = paramObj['affairid'];
    var summaryid = paramObj['summaryid'];
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?stype=opinion&message_id=nhoa_col";
    url = url + "&username="+loginname/*+"&password="+password*/+"&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid;
    obj.url=url;
    obj.successFun="httpsucess";
    ajaxJson_v1(obj);
}

function httpsucess(info_list) {
    console.log(info_list['opinions']);
    var info_list_mode = new Array(info_list['opinions'].length);
    console.log(info_list['opinions'].length);
    for ( i = 0; i < info_list['opinions'].length; i++) {
        var info_mode = new Object();
        info_mode.title = "<div>" + info_list['opinions'][i].name +"   "+info_list['opinions'][i].tname+"   "+info_list['opinions'][i].create_date+ "</div>";
        info_mode.describe = "<div>" + info_list['opinions'][i].content+"</div>";
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
        html += '<div>'
        html += info_list_mode[i].title
        html += '</div>'
        html += '</li>'
        html += '<li class="ulev-lv sc-text1 uinn3">'
        html += '<div>'
        html += info_list_mode[i].describe
        html += '</div>'
        html += '</li>'
        html += '</ul>'
        html += '</ul>'
        html += '</li>'
    }
    html += '</ul>'
    $("#listview").html(html)
}


