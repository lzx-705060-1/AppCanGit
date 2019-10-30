cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    // document.getElementById("content").style.marginTop=document.getElementsByClassName("cmp-title")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
   testee();
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
function testee(){
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



