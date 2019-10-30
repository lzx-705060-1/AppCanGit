cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件

});

function intiPage(){
	//cmp.storage.save("title","[审批] 请处理OA单点登陆用户提交雅居乐筹建酒店/高端会所采购业务单据审批流程_OA单点登陆用户_20190629000006待办。")
var title = cmp.storage.get("link_title");
var oids = cmp.storage.get("oid");
var oid1=oids.toUpperCase();
cmp.storage.save("link_uniqueid",oid1);
cmp.storage.save("platform","Simulator");

//var title = cmp.storage.get("title");
 if(title.indexOf('[沟通]')==0){
                $("#submit").removeClass('ub');
                $("#submit").hide();
                $("#back").removeClass('ub');
                $("#back").hide();
                $("#over").removeClass('ub');
                $("#over").hide();
                $("#gotong").removeClass('ub');
                $("#gotong").hide();
                $("#zhuanb").removeClass('ub');
                $("#zhuanb").hide();
                $("#cxgt").removeClass('ub');
                $("#cxgt").hide();
            }else{
                $("#tijiao").removeClass('ub');
                $("#tijiao").hide();
            }
            if (cmp.storage.get('oldformid').indexOf("C-CW-018")!=-1)
            {
                $("#back").removeClass('ub');
                $("#back").hide();
                $("#over").removeClass('ub');
                $("#over").hide();  
            }
}

function bindEvent(){

}

/***********************************************分割线***************************************************/
var platform = cmp.storage.get('platform');
        function showButton(data) {
            console.log(data);
        }
function checkGT(){
            var r = false ;
            var oid = cmp.storage.get("link_uniqueid");
			cmp.storage.save("https://mportal.agile.com.cn:8443");
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&stype=check";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
			console.log("checkGT   url     "+url);
            ajaxJson(url, function(data){
                console.log(data);
                if(data.Is_submit.RESULT){
					 cmp.notification.alert("您有沟通还未返回所有意见",function(){

        },"提醒","确定","",false,false);
                    r = true;
                }
            });
            return r;
        }
		
		$("#submit").on("tap", function() {
            //if(!checkOpin()){
            //    return ;
            //}
            //需要判断能不能提交
            var msg = cmp.storage.get('msg');
            if(msg!=''&&msg!=null){
                cmp.notification.alert(msg,function(){
			return ;
				},"提醒","确定","",false,false);
                return ;
            }				
				
            if(checkGT()) return;
			cmp.dialog.loading("加载中...");
            var oid = cmp.storage.get("link_uniqueid");
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            var StationGUID = cmp.storage.get('StationGUID', "38d8d3c4-25d8-4f47-a8e5-b8cad483acd9");
            var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&passValue=1&stype=submit";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
            url = url + "&content="+$("#content").val();
            url = url + "&StationGUID=" + StationGUID;
            url = url + "&platform=" + platform;
            //console.log(url);
            ajaxJson(url,httpsucess);
        })
		
        function httpsucess(data){
            console.log(data);
            if (data['stepXml'].DATA.step.billcode=='true')
            {
				cmp.notification.alert("此单据审批通过后需要调用外部接口，移动端审批暂不支持，请到电脑端审批。",function(){
			cmp.href.back(2);
				},"提醒","确定","",false,false);
				
               /*appcan.window.alert({
                    title : "提醒",
                    content : "",
                    buttons : '确定',
                    callback : function(err, data, dataType, optId) {
                        console.log(err, data, dataType, optId);
                        cmp.storage.save('dbtabindex',1);
                        appcan.window.evaluateScript({
                            name : 'old_banli',
                            scriptContent : 'appcan.window.close(-1)'
                        });
                        appcan.window.evaluateScript({
                            name : 'gw_atricle',
                            scriptContent : 'appcan.window.close(-1)'
                        });
                        appcan.window.open({
                            name : 'myApply',
                            data : 'myApply.html',
                            aniId : 10,
                            type:4
                        });
                    }
                });  */
            }
			

            if (data['submit']&&data['submit'].RESULT=='true') {
                cmp.notification.alert("办理成功",function(){
                    cmp.href.back(2)
                },"提示","确定","",false,false);
            }else if(data['submit']&&data['submit'].RESULT=='false'){
							
			cmp.notification.alert("此单据暂不支持在移动端审批，请到电脑端审批。",function(){
			cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/myApply.html");
           },"提醒","确定","",false,false);
	
              /*  appcan.window.alert({
                    title : "",
                    content : "",
                    buttons : '确定',
                    callback : function(err, data, dataType, optId) {
                        console.log(err, data, dataType, optId);
                        cmp.storage.save('dbtabindex',1);
                        appcan.window.evaluateScript({
                            name : 'old_banli',
                            scriptContent : 'appcan.window.close(-1)'
                        });
                        appcan.window.evaluateScript({
                            name : 'gw_atricle',
                            scriptContent : 'appcan.window.close(-1)'
                        });
                        appcan.window.open({
                            name : 'myApply',
                            data : 'myApply.html',
                            aniId : 10,
                            type:4
                        });
                    }
                });*/
            }
            else{
                //弹出选人框
                var opxml = data['persons'].RESULT;
                var option = '' ;
                
                console.log(opxml);
                console.log(opxml.length);
                //从此处开始应有两种
                console.log($(opxml).attr("result"));
                var xmlresult = $(opxml).attr("result");
                //console.log();
                if(xmlresult!=null&&typeof(xmlresult)!="undefined"&&xmlresult!="NONE"){
                    var setp = xmlresult.split('$');
                    for(var i=0;i<setp.length;i++){
                        //console.log(setp[i]);
                        var setpTemp = setp[i].split('^');
                        var setpid = setpTemp[0];
                        var setpname = setpTemp[1];
                        option += "<option value='"+setpid+","+setpname+"'>"+setpname+"</option>";
                        //console.log(setpid,setpname);
                    }
                    cmp.storage.save('option',option);
                    cmp.storage.save('content',$("#content").val());
                    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_submit_content.html")
                }else if(opxml!=null&&opxml.length>0&&xmlresult!="NONE"){
                    for(var i=0;i<opxml.length;i++){
                        option += "<option value='"+opxml[i].setpid+","+opxml[i].setpname+"'>"+opxml[i].setpname+"</option>";
                    }
                    cmp.storage.save('option',option);
                    cmp.storage.save('content',$("#content").val());
                    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_submit_content.html")
                }else{
                    //跳到单选
                    cmp.storage.save('submitType',"next");
                    cmp.storage.save('content',$("#content").val());
                    /*appcan.window.open({
                            name : 'old_dbmry',
                            data : 'old_dbmry.html',
                            aniId : 10
                    });*/
                    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_dbmry.html")
                }
            }
        }
		
		
		
		//作废
		$("#over").on("tap", function() {
    if (!checkOpin()) {
        return;
    }
    if (checkGT())
        return;
    
    cmp.notification.confirm("您确定要作废吗",function(index){
        if(index == 0){
            //点击了第一个按钮
            console.log('-----------发送数据------------');
       var platform="Simulator";
			 var oid = cmp.storage.get("link_uniqueid");
                        var serviceUrl = cmp.storage.get('serviceUrl');
                        var phoneid = cmp.storage.get('phoneid');
                        var olduser = cmp.storage.get('olduser');
                        var oldpwd = cmp.storage.get('oldpwd');
                        var StationGUID = cmp.storage.get('StationGUID', StationGUID);
						 var content = $("#content").val().replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2b").replace(/ /g,"%20")
                        var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_zf&passValue=";
                        url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
                        url = url + "&StationGUID=" + StationGUID;
                        url = url + "&platform=" + platform;
                        ajaxJson(url, sucessZuof);
						
        }else if(index == 1){
            //点击了第二个按钮
        }
    },"确认",["确定","取消"],"http://www.baidu.com/log.png",false,0);
})
		

		function sucessZuof(data) {
    console.log(data);
    cmp.notification.alert("作废成功",function(){
        cmp.href.back(2)
    },"提示","确定","",false,false);
   
}

function checkOpin() {
	//alert($("#contentValue").val());
    if ($("#contentValue").val() == '' || $("#contentValue").val() == null) {
        cmp.notification.alert("请输入办理意见",function(){

        },"提示","确定","",false,false);
        return false
    } else {
        return true;
    }
}

//沟通
$("#gotong").on("tap", function() {

            if(!checkOpin()){
                return ;
            }
            cmp.storage.save('content',$("#contentValue").val());
			cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_bmry.html")
        })
		
//撤销沟通
$("#cxgt").on("tap", function() {
            if(!checkOpin()){
                return ;
            }
			   cmp.notification.confirm("您确定要撤销沟通吗？",function(index){
        if(index == 0){
            //点击了第一个按钮
            console.log('-----------发送撤销数据------------');
						var oid = cmp.storage.get("link_uniqueid");
                        var serviceUrl = cmp.storage.get('serviceUrl');
                        var phoneid = cmp.storage.get('phoneid');
                        var olduser = cmp.storage.get('olduser');
                        var oldpwd = cmp.storage.get('oldpwd');
                        var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&stype=cxgt";
                        url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + $("#content").val()+"&oid="+oid;
                        url = url + "&platform=" + platform;
                        ajaxJson(url, function(data){
                            console.log(data);
                            if(data.cxsubmit.RESULT){
								cmp.notification.alert(data.cxsubmit.RESULT,function(){
			cmp.storage.save('dbtabindex',1);
                                    cmp.href.back(2)
           },"提醒","确定","",false,false);
                            }
                        });
						
        }else if(index == 1){
            //点击了第二个按钮
        }
    },"确认",["确定","取消"],"http://www.baidu.com/log.png",false,0);
        })


$("#back").on("tap", function() {
    if(checkGT()) return;
    cmp.notification.confirm("您确定要驳回吗？",function(index){
        if(index == 0){
            //点击了第一个按钮
            console.log('-----------发送驳回数据------------');
            var oid = cmp.storage.get("link_uniqueid").toUpperCase();
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            var StationGUID = cmp.storage.get('StationGUID', StationGUID);
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_ht";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + $("#content").val()+"&oid="+oid;
            url = url + "&StationGUID=" + StationGUID;
            url = url + "&platform=" + platform;
            ajaxJson(url, sucessBack);

        }else if(index == 1){
            //点击了第二个按钮
        }
    },"确认",["确定","取消"],"http://www.baidu.com/log.png",false,0);
})
function sucessBack(data) {
    console.log(data);
    //如果Is_submit不为空
    if(data.Is_submit.RESULT!=''){
        //不能处理
        cmp.notification.alert("您发起的OA还未返回所有意见;"+data.Is_submit.RESULT,function(){

        },"提示","确定","",false,false);
        return ;
    }
    //console.log(data.approve.ROLLBACKXML);
    var rollbackxml = data.approve.ROLLBACKXML ;
    var option="";
    $(rollbackxml).find("Step").each(function() {
        //var xmlAttr = $(this).attr("name");
        //var xmlText = $(this).text();
        //$("#" + xmlAttr).val(xmlText);
        option += "<option value='"+$(this).attr("StepPathGUID")+","+$(this).attr("Auditors")+","+$(this).attr("AuditorNames")+"'>"+$(this).attr("StepName");+"</option>";
    });
    cmp.storage.save('option',option);
    cmp.storage.save('content',$("#contentValue").val());
    //appcan.execScriptInWin('old_banli', 'openPopover()');
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/bh_content.html")
}
//转办
$("#zhuanb").on("tap", function() {

    if(!checkOpin()){
        return ;
    }
    if(checkGT()) return;
    cmp.storage.save('content',$("#contentValue").val());
    cmp.storage.save('submitType',"zb");

    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_dbmry.html")
})
//提交
$("#tijiao").on("tap", function() {
    //需要判断能不能提交
    var msg = cmp.storage.get('msg');
    if(!checkOpin()){
        return ;
    }
    var oid = cmp.storage.get("link_uniqueid").toUpperCase();
    var content = $("#contentValue").val();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var olduser = cmp.storage.get('olduser');
    var oldpwd = cmp.storage.get('oldpwd');
    var StationGUID = cmp.storage.get('StationGUID');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&passValue=&stype=jbtj";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
    url = url + "&StationGUID=" + StationGUID;
    url = url + "&platform=" + platform;
    ajaxJson(url,function(data){
        console.log(data);
        cmp.notification.alert("提交成功",function(){
            cmp.href.back(2)

        },"提示","确定","",false,false);
    });
})