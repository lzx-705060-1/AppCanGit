cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByClassName("cmp-title")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getInfo();
}

function bindEvent(){
    document.getElementById("fujian").addEventListener("tap",function(){
        getFuJian();

    });
}


/***********************************************分割线***************************************************/
function getInfo() {
    var paramObj = cmp.href.getParam();
    var title = paramObj.title;
    var newsid = paramObj.newsid;
    $(".cmp-title").html(title)
    // var newsid = cmp.storage.get(newsid);
    //var serviceUrl = cmp.storage.get('serviceUrl');
	var serviceUrl = "https://mportal.agile.com.cn:8443";
    var phoneid = cmp.storage.get('phoneid');
    var loginname = cmp.storage.get('loginname');
    //var password =  cmp.storage.get('password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_news" ;
    url = url + "&username="+loginname +"&PHONE_ID="+phoneid+"&newsid="+newsid;
    var obj = new Object();
    obj.url = url;
    obj.successFun = "httpInfosucess";
    ajaxJson_v1(obj);
}
function httpInfosucess(info_list){
    console.log(info_list);
    var info = info_list['info'];
    var fileid = info.content;
    $('#deptname').html('发起部门：'+info.name);
    $('#read_count').html('阅读量：'+info.read_count);
    $('#sendername').html('发起人：'+info.name);
    $('#create_time').html('发起时间：'+info.publish_date);
    //保存附件列表
    var attachments_list =info_list['attachments'];
    cmp.storage.save('fileid', fileid);
    var homeObj = JSON.stringify(attachments_list);
    console.log(homeObj)
    var num = attachments_list.length;
    cmp.storage.save('attachments', homeObj);
    cmp.storage.save('fileid', fileid);
    $("footer .cmp-tab-label").eq(0).html('附件(' + attachments_list.length + ')');
    if(fileid){
        getDetail2();
    }
}
function getDetail2() {
    var obj = new Object();
   // var serviceUrl = cmp.storage.get('serviceUrl');
		var serviceUrl = "https://mportal.agile.com.cn:8443";
    var phoneid = cmp.storage.get('phoneid');
    var loginname = cmp.storage.get('loginname');
   // var password =  cmp.storage.get('password');
    var fileid =  cmp.storage.get('fileid');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_file&checktype=text" ;
    url = url + "&username="+loginname+ "&PHONE_ID="+phoneid+"&fileid="+fileid;
    obj.url = url;
    obj.successFun = "httpsucess";
    ajaxJson_v1(obj);
}
function httpsucess(info_list){
    console.log(info_list)
    var content = info_list['content'].CONTENT ;

    $("#content").html(content);
    height = document.body.scrollHeight
    var loginname = cmp.storage.get('loginname');
}
function getFuJian(){
    var extData = {

    }
    //cmp.href.next(testBasePath+"/html/fujian.html?useNativebanner=1",{openWebViewCatch: true,nativeBanner: true});
    // cmp.href.next("http://test.v5.cmp/v"+"/html/fujian.html?useNativebanner=1",extData,{openWebViewCatch: true,nativeBanner: true})
     //cmp.href.next(testBasePath+"/html/fujian.html?useNativebanner=1",extData,{openWebViewCatch: true,nativeBanner: true}
     cmp.href.next(testBasePath+"/html/fujian.html?useNativebanner=1",extData,{openWebViewCatch: true,nativeBanner: true})

}

