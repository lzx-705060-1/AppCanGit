cmp.ready(function(){

	if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
	cmp.backbutton();//将Android返回按钮劫持
	cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
	intiPage();//初始化页面，对页面中的显示进行初始化
	bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
	var olduser;
	if(cmp.storage.get('olduser'))
	{
		olduser=cmp.storage.get('olduser');
	}else{
		olduser=cmp.storage.get('adcode');
	};
	var oldpwd;
	if(cmp.storage.get('oldpwd'))
	{
		oldpwd=cmp.storage.get('oldpwd');
	}else{
		oldpwd=cmp.storage.get('ygzz_password');
	};
	$("#olduser").val(olduser);
	//console.log(oldpwd);
	$("#oldpwd").val(oldpwd);
}
var StationGUID ;
var istest = false ;

function bindEvent(){
	//给头部返回按钮绑定事件
	document.getElementById("backBtn").addEventListener("tap",function(){
		cmp.href.back();//返回上一页面
	});
}

/***********************************************分割线***************************************************/
$("#test").on( "tap", function() {
	var olduser = $("#olduser").val();
	var oldpwd = $("#oldpwd").val();
	if (olduser == '') {
		cmp.notification.alert("请输入AD用户", function () {
			//do something after tap button
		}, "提示", "确定", "", false, false);

	} else if (oldpwd == '') {
		cmp.notification.alert("请输入AD密码", function () {
			//do something after tap button
		}, "提示", "确定", "", false, false);
	} else {
		var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
		serviceUrl = 'http://10.1.9.144'
		var phoneid = cmp.storage.get('ygzz_phoneid');
		var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_login_new&username="+olduser+"&password="+oldpwd;
		ajaxJson(url, httpsucess);
	}
})
function httpsucess(info_list) {
	console.log(info_list);
	if(info_list['login'].RESULT=='false'){
		cmp.notification.alert("AD帐号或密码不正确", function () {
			//do something after tap button
		}, "提示", "确定", "", false, false);
	}else{

		//cmp.storage.save('oldpwd', oldpwd);
		//StationGUID
		// istest = true ;
		var olduser = $("#olduser").val();
		var oldpwd = $("#oldpwd").val();
		if (olduser && oldpwd) {
		    cmp.storage.save("olduser",olduser)
		    cmp.storage.save("oldpwd",oldpwd)
		    //保存ad信息到微协同服务器
		    cmp.ajax({
                    type: "get" ,
                    data: "",
                    //url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
                    url : 'https://oamobile.agile.com.cn/olduser/saveuser?olduser='+olduser+'&oldpwd='+oldpwd+'&loginname='+cmp.storage.get("ygzz_loginname") ,
						//url : 'https://oamobile.agile.com.cn/olduser/saveuser?olduser='+olduser+'&oldpwd='+oldpwd+'&loginname=liuquan' ,
                    async : false,
                    dataType : "json",
                    success : function ( r, textStatus, jqXHR ){
                        if(r&&JSON.stringify(r) != "{}"){
                            if(r.success=='true'){
                                cmp.notification.alert("AD账号绑定成功", function () {
                                    //do something after tap button
                                    cmp.href.back()
                                }, "提示", "确定", "", false, false);
                            }
                        }
                    },
                    error: function(r){
                        console.log(JSON.stringify(r))
                        cmp.notification.alert("AD账号绑定失败，请重试！", function () {
                        }, "提示", "确定", "", false, false);
                    }
                })
			/*cmp.storageDB.save('oldInfo', olduser+"="+oldpwd,function(result){
				if(result.success){
					//alert("1")
				}else {
					//保存失败
					//alert("0")
					var errorCode = result.code;//错误码：91001打开数据失败；91002保存数据失败
					var errorMsg = result.error;//错误信息
				}
			});*/

			// jzuser();
			// if(StationGUID){
			//    cmp.storage.save('StationGUID', StationGUID);
			//  }
			cmp.storage.save('olddblist','');
			cmp.storage.save('newdblist','');
			cmp.storage.save('olddbCount','');
			//cmp.storage.save('jzdbCount','');
			/*uexWindow.evaluateScript("main", 0, "getNewTotal();");
			 uexWindow.evaluatePopoverScript("chatmain", "content0", "getdaibanTotalCount();");
			 uexWindow.evaluateScript('old_user',0,'appcan.window.close(-1);');*/
			// StationGUID = info_list['stationguid'].GW.guid ;
		}
		
	}
}

/*$("#submit").on("tap", function() {
 var olduser = $("#olduser").val();
 var oldpwd = $("#oldpwd").val();
 if (istest && olduser && oldpwd) {
 cmp.storage.save('olduser', olduser);
 cmp.storage.save('oldpwd', oldpwd);
 // if(StationGUID){
 //    cmp.storage.save('StationGUID', StationGUID);
 //  }
 cmp.storage.save('olddblist','');
 cmp.storage.save('newdblist','');
 /!*appcan.window.evaluateScript({
 name : 'old_user',
 scriptContent : 'closethis();'
 });*!/
 } else if(!istest){
 appcan.window.alert({
 title : "提醒",
 content : "请先测试",
 buttons : '确定',
 callback : function(err, data, dataType, optId) {
 console.log(err, data, dataType, optId);
 }
 });
 }else{
 appcan.window.alert({
 title : "提醒",
 content : "AD帐号和密码不能为空！",
 buttons : '确定',
 callback : function(err, data, dataType, optId) {
 console.log(err, data, dataType, optId);
 }
 });
 }
 })*/
function jzuser(){

	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var oauser = cmp.storage.get('ygzz_loginname');
	var aduser = cmp.storage.get('ygzz_olduser');
	var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=jeezuser";
	url = url + "&oauser=" + oauser + "&aduser=" + aduser + "&PHONE_ID=" + phoneid;
	ajaxJson(url, httpjzuser);
}
function httpjzuser(data) {
	cmp.storage.save('jeezqx',0);
	if (data.jeezuser.length>0)
	{
		cmp.storage.save('jeezqx',1);
	}

}
