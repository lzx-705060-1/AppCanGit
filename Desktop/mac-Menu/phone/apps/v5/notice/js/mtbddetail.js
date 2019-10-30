cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    //document.getElementById("content").style.marginTop=document.getElementsByClassName("cmp-title")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getInfo();
}

function bindEvent() {
	    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
       fanhui();
    });
    document.getElementById("fujian").addEventListener("tap", function () {
        console.log("附件 ");
        getFuJian();
    });
}
/***********************************************分割线***************************************************/
isFromQYWX=false;
urlParamObj=null;
var states=0;
function getInfo() {
	 var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i]=="from=notistest"){
                isFromQYWX=true
                urlParamObj=transUrlToObj()//获取参数
                //alert(JSON.stringify(urlParamObj))
                setLoginname()//设置用户名
                break;
            }
        }
    }
	 var obj = new Object();
    var paramObj = cmp.href.getParam();
	if(urlParamObj != null){
		var bulid=urlParamObj.bulid;
		states = 1;
		$('.cmp-title').html(urlParamObj.title);
		var phoneid = "null";
	}else{
	 var bulid = paramObj.bulid;
     var title = paramObj.title;
	$(".cmp-title").html(title);
	var phoneid = cmp.storage.get('phoneid');	
	}
    console.log("bulid    "+bulid);
    cmp.storage.save('bulid',bulid);
    var serviceUrl = cmp.storage.get('serviceUrl');
    
    console.log("phoneid     "+phoneid);
    var loginname = cmp.storage.get('loginname');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_bul" ;
    url = url + "&username="+loginname+"&PHONE_ID="+phoneid+"&bulid="+bulid;
    console.log("url   "+url);
    obj.url = url;
    obj.successFun = "httpInfosucess";
    ajaxJson_v1(obj);
}
function httpInfosucess(info_list) {
    var info = info_list['info'];
    var fileid = info.content;
    $('#deptname').html('发起部门：' + info.name);
    $('#read_count').html('阅读量：' + info.read_count);
    $('#sendername').html('发起人：' + info.name);
    $('#create_time').html('发起时间：' + info.publish_date);
    //保存附件列表
    var attachments_list =info_list['attachments'];
    cmp.storage.save('fileid', fileid);
    var homeObj = JSON.stringify(attachments_list);
    console.log(homeObj)
    cmp.storage.save('attachments', homeObj);
    $("footer .cmp-tab-label").eq(0).html('附件(' + attachments_list.length + ')');
    if (fileid) {
        getDetail();
    }
}

function getDetail() {
    console.log("开始表演 getDetail" );
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var loginname = cmp.storage.get('loginname');
    var fileid = cmp.storage.get('fileid');
    console.log("getDetail     fileid   " + fileid);
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_file&checktype=text";
    url = url + "&username=" + loginname +  "&PHONE_ID=" + phoneid + "&fileid=" + fileid;
    console.log(url);
    var obj = new Object();
    obj.url = url;
    obj.successFun = "httpsucess";
    ajaxJson_v1(obj);
}

function httpsucess(info_list) {
    console.log(info_list)
    var content = info_list['content'].CONTENT;
    console.log("内容    "+content);
    $("#content").html(content);
    var loginname = cmp.storage.get('loginname');
}
function getFuJian(){
    var bulId = cmp.storage.get("bulid");
    console.log("getFuJian  bulId "+bulId);
    var bulArr = ["1097701539513648366","5944103826823923770","4024855395544550125",
        "-9039048947767426043","-4058898636129091205","579450893060164531",
        "-77735207251522199","5444167005453568730","-8552185690487176826",
        "2883675091640601464","5152887225165236948","6186143587579283448",
        "-2811523369530736572","-1074029117340234649"]
    //对《关于公布各产业集团1-8月指标完成情况排行榜的通知》这条公文进行权限控制
    //只对控股公司管理层、八大产业集团管理层、运营部门（雅生活为董秘办）及控股审计监察部开放
    if("3070918942024745623"==bulId){
        var departmentId = cmp.storage.get("org_department_id");
        console.log("departmentId   "+departmentId);
        if(bulArr.indexOf(departmentId)==-1){
            cmp.notification.alert("您没有访问此公告附件的权限！！", function () {
            }, "提醒", "确定", "", false, false);
        }
    }

    var extData = {

    }
	
    cmp.href.next(noticeBasePath +"/html/fujian.html?useNativebanner=1",extData,{openWebViewCatch: true,nativeBanner: true})
}


function transUrlToObj(){
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        var obj = {};
        var obj2 ={}
        for(var i = 0; i < strs.length; i ++) {
            var pair = strs[i].split('=');
            if(pair[0]){
                var key = decodeURIComponent(pair[0]);
                var value = pair[1];
                if(value != undefined ){
                    value = decodeURIComponent(value);
                }
                //这里判断转化后的obj里面有没有重复的属性
                if( key in obj ){
                    /*if( obj [key] != Array ){
                        //把属性值变为数组，将另外的属性值也存放到数组中去
                        obj [key] = [obj [key]];
                    }
                    obj [key].push(value)*/;
                }else{
                    obj [key] = value;
                }
            }
        }
        obj2["bulid"]=obj["bulid"]?obj["bulid"]:""
		obj2["title"]=obj["title"]?obj["title"]:""
        return obj2
    }
}
function setLoginname(){
    var tk = window.localStorage.CMP_V5_TOKEN;
    tk = tk!=undefined ? tk : ''  ;
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
                cmp.storage.save("loginname",r);
               cmp.storage.save("serviceUrl","https://mportal.agile.com.cn:8443");
            }
        },
        error: function(r){
            console.log(JSON.stringify(r))
        }
    })
}
function fanhui(){
	var extData={}
 if(states == 1){
	  cmp.href.next(noticeBasePath+"/html/mtbd.html",extData,{openWebViewCatch: true,nativeBanner: true})
 }else{
	  cmp.href.back();//返回上一页面
 }
     

}
