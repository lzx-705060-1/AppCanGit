cmp.ready(function(){
	cmp.storage.save("serviceUrl", 'https://mportal.agile.com.cn:8443');
	 cmp.storage.save("jituanaccountid", '-1730833917365171641 ');
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
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
   // document.getElementById("content").style.marginTop=document.getElementsByClassName("cmp-title")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getnew();
	getbul();
}

function bindEvent(){

}


/***********************************************分割线***************************************************/

 //获取新闻请求
        function getnew() {
			
            var loginname = cmp.storage.get('loginname');
			//var password = cmp.storage.get('password');
            var accountid = cmp.storage.get('jituanaccountid');
            if (loginname) {
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var obj = new Object();
                obj.url = serviceUrl + "/servlet/PublicServiceServlet";
                obj.errorAlert = false;
                obj.async = false;
                obj.data = {
                    'message_id' : "nhoa_news",
                    'stype' : "newstype",
                    'username' : loginname,
					//'password' : password,
                    'PHONE_ID' : phoneid,
                   'accountid' : accountid
                };
                obj.successFun = 'Newssuccess';
                ajaxJson_v1(obj);
            }
        }

        //请求成功
        function Newssuccess(obj) {
            var newsid = obj['new1'].id;
            var title = obj['new1'].title;
            var type_name = obj['new1'].type_name;
            if (title == '' || title == null) {
                $('#news').html("获取失败");
            } else {
                $('#news').html(title);
				cmp.storage.save("title", title);
                $('#newsid').html(newsid);
				cmp.storage.save("newsid", newsid);
                $('#news_title').html(title);
            }
        }

	$("#news_more").click(function(){
		 var extData = {
        }
   cmp.href.next("/seeyon/m3/apps/v5/test/html/test.html",extData, {openWebViewCatch: true,nativeBanner: true});
}); 
	$("#news").click(function(){
		 var newsid = cmp.storage.get('newsid');
		 var title = cmp.storage.get('title');
		var extData = {
            'newsid': newsid,
            'title': title
        }
         cmp.href.next("/seeyon/m3/apps/v5/test/html/newsdetail.html", extData, {openWebViewCatch: true,nativeBanner: true});
});


        //获取公告请求
        function getbul() {
            var loginname = cmp.storage.get('loginname');
			//var password = cmp.storage.get('password');
            var userid = cmp.storage.get('userid');
			//var userid="1578839829813543505";
            if (loginname) {
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var obj = new Object();
                obj.url = serviceUrl + "/servlet/PublicServiceServlet";
                obj.errorAlert = false;
                obj.async = false;
                obj.data = {
                    'message_id' : "newoa_list",
                    'stype' : "newbul",
                   // 'password' : password,
					 'username' : loginname
                };
                obj.successFun = 'Bulsuccess';
                ajaxJson_v1(obj);
            }
        }

        //请求成功
        function Bulsuccess(obj) {
            console.log(obj);
            $('#bulid').text("")//清空数据
            var bulid = ""
            var title =""
            if(obj['newbul'].LIST.length>0){
                 bulid = obj['newbul'].LIST[0].id;
                 title = obj['newbul'].LIST[0].title;
            }
            if (title == '' || title == null) {
                $('#bul').html("获取失败,点击刷新");
            } else {
                $('#bul').html(title);
				cmp.storage.save("titles", title);
                $('#bulid').html(bulid);
				cmp.storage.save("bulid", bulid);
                $('#bul_title').html(title);
            }

        }


	$("#bul_more").click(function(){
		 var extData = {
        }
 cmp.href.next("/seeyon/m3/apps/v5/notice/html/mtbd.html",extData, {openWebViewCatch: true,nativeBanner: true});
}); 
	$("#bul").click(function(){
		
		var bulid = cmp.storage.get('bulid'); 
		var title = cmp.storage.get('titles'); 
  var extData = {
        'id': bulid,
        'title': title,
        'bulid': bulid,
        'bulqry': bulid
    }
    cmp.href.next("/seeyon/m3/apps/v5/notice/html/mtbddetail.html", extData, {openWebViewCatch: true, nativeBanner: true})
});
