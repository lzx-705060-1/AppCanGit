cmp.ready(function(){
	var tk = window.localStorage.CMP_V5_TOKEN;
tk = tk!=undefined ? tk : ''  ;
//alert(tk)
var header={
    "Accept": "application/json; charset=utf-8",
    "Accept-Language": "zh-CN",
    "Content-Type": "application/json; charset=utf-8",
    "Cookie": "JSESSIONID=",
    "option.n_a_s": "1",
    "token": tk
}
cmp.ajax({
    type: "POST" ,
    data: "",
    //url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
    url : cmp.seeyonbasepath+'/rest/oa3/revert/queryLoginUserInfo' ,
    async : false,
    headers: header,
    dataType : "html",
    success : function ( r, textStatus, jqXHR ){
        if(r&&r!=""){
            cmp.storage.save("loginname",r)
        }
    },
    error: function(r){
        console.log(JSON.stringify(r))
    }
})
    cmp.storage.save("serviceUrl", 'https://mportal.agile.com.cn:8443');
    //cmp.storage.save("serviceUrl", 'http://10.1.9.144');
    //cmp.storage.save("loginname", 'A006833');
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    // document.getElementById("content").style.marginTop=document.getElementsByClassName("cmp-title")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getdwgg();
}

function bindEvent(){
 //给头部返回按钮绑定事件
    /*document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });*/
}

/***********************************************分割线***************************************************/
function getdwgg(){
    var obj = new Object();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var accountid = cmp.storage.get('org_account_id');
    accountid = '-1730833917365171641';
    var loginname = cmp.storage.get('loginname');
	
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_news";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid+ "&accountid="+ accountid;
    console.log(url);
    obj.url = url;
    obj.successFun = "httpsucess"
    ajaxJson_v1(obj);
}

function httpsucess(info_list){
    console.log(info_list['typelist']);
    var info_list_mode = new Array(info_list['typelist'].length);
    console.log(info_list['typelist'].length);
    for ( i = 0; i < info_list['typelist'].length; i++) {
        var info_mode = new Object();
        info_mode.id = info_list['typelist'][i].id;
        info_mode.title = info_list['typelist'][i].name;
        info_list_mode.push(info_mode);
    }
    console.log(info_list_mode);
    console.log("开始你的表演")
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
        html += '</ul>'
        html += '<li class="fa fa-angle-right ulev2">'
        html += '</li>'
        html += '</ul>'
        html += '</li>'
    }
    html += '</ul>'
    $("#goodsList").html(html);

    $("#goodsList>ul>li").on('tap', function (event) {
        openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })
}

function openDetail(obj) {
    cmp.storage.save('typeid',obj.id);
    cmp.storage.save('title',obj.title);
    var extData = {
        'id': obj.id,
        'title': obj.title,
        'typeid': obj.id
    }
    // cmp.href.next(noticeBasePath+ "/html/mtbdlist.html", extData, {openWebViewCatch: true, nativeBanner: false});

    //cmp.href.next("http://test.v5.cmp/v"+ "/html/dwxwlist.html?useNativebanner=1", extData, {openWebViewCatch: true, nativeBanner: true})
    cmp.href.next(testBasePath+ "/html/dwxwlist.html", extData, {openWebViewCatch: true, nativeBanner: true})
}
	$("#testNews").click(function(){
		 var extData = {
        }
   cmp.href.next("/seeyon/m3/apps/v5/test/html/testNews.html",extData, {openWebViewCatch: true,nativeBanner: true});
}); 



