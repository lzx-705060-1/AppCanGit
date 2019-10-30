cmp.ready(function(){
	platform=cmp.device.info().platform;
	if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
	document.getElementsByClassName("ub")[0].style.top=document.getElementsByTagName("header")[0].offsetHeight+"px";
	document.getElementById("content").style.marginTop=(document.getElementsByTagName("header")[0].offsetHeight+document.getElementsByClassName("ub")[0].offsetHeight)+"px";
	cmp.backbutton();//将Android返回按钮劫持
	cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
	intiPage();//初始化页面，对页面中的显示进行初始化
	bindEvent();//给页面中的按钮绑定事件


});

function intiPage(){
	getDeptlist();
	getMemberList('79625beb-1218-4766-a550-194d7911d6dd');
}

function bindEvent(){
	//给头部返回按钮绑定事件
	document.getElementById("backBtn").addEventListener("tap",function(){
		cmp.href.back();//返回上一页面
	});
	//给头部右边按钮绑定事件
	document.getElementsByClassName("cmp-header-right")[0].addEventListener("tap",function(){
		submitok();
	});
}

/***********************************************分割线***************************************************/
var members = [];
var platform = cmp.storage.get('platform');

function qcRepet(obj){
	if (obj.oid!='0')
	{
		members.splice(0,1,obj);
	}
	//console.log(members);
}


function getDeptlist(){
	var serviceUrl = cmp.storage.get('serviceUrl');
	var phoneid = cmp.storage.get('phoneid');
	var olduser = cmp.storage.get('olduser');
	var oldpwd =  cmp.storage.get('oldpwd');

	var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_bmry";
	url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
	ajaxJson(url,deptsucess);

	//2019270092824660923
}

function deptsucess(data){
	console.log(data);
	var first = [{title : "<div style='font-weight:bold;color:#00A1EA;'>已选人员</div>",id : "0"}];
	if(data){
		var types = data.deptList.LIST ;
		console.log(types);
		var arr = first.concat(types)
		//lv2.set(first.concat(types));
		var html=""
		html+='<ul>'
		for(var i=0;i<arr.length;i++){
			html+='<li class="ubb ub bc-border bc-text ub-ac lis" id="'+arr[i].id+'" data-index="'+i+'">'
			html+='<div class="lv_title ub-f1 marg-l ub ub-ver ut-m line1">'
			html+=arr[i].title
			html+='</div>'
			html+='</li>'
		}
		html+='</ul>'
		$("#column").html(html)
		$("#column ul li").on('tap', function(obj) {
			if(obj.currentTarget.attributes["data-index"].value!='0'){
				getMemberList(arr[obj.currentTarget.attributes["data-index"].value].id);
			}else{
				setMembers(members);
				$("input").eq(1).attr("checked", "true");
			}
		});
		first = types = null ;
	}else{
		//lv2.set(first)
		var arr = first
		var html=""
		html+='<ul>'
		for(var i=0;i<arr.length;i++){
			html+='<li class="ubb ub bc-border bc-text ub-ac lis" id="'+arr[i].id+'" data-index="'+i+'">'
			html+='<div class="lv_title ub-f1 marg-l ub ub-ver ut-m line1">'
			html+=arr[i].title
			html+='</div>'
			html+='</li>'
		}
		html+='</ul>'
		$("#column").html(html)
		$("#column ul li").on('tap', function(obj) {
			if(obj.currentTarget.attributes["data-index"].value!='0'){
				getMemberList(arr[obj.currentTarget.attributes["data-index"].value].id);
			}else{
				setMembers(members);
				$("input").eq(1).attr("checked", "true");
			}
		});
	}
}

function getMemberList(deptid,key){
	var serviceUrl = cmp.storage.get('serviceUrl');
	var phoneid = cmp.storage.get('phoneid');
	var olduser = cmp.storage.get('olduser');
	var oldpwd =  cmp.storage.get('oldpwd');
	var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_bmry&stype=user";
	url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
	url = url + "&deptid="+deptid ;
	if(key){
		url = url + "&key="+key ;
	}
	ajaxJson(url,membersucess);
}

function membersucess(data){
	var users = data.userList.LIST;
	//lv1.set(users);
	userlist=new Array();
	for (i=0;i<users.length;i++)
	{
		var tempuser=new Object();
		tempuser.oid=users[i].oid;
		var deptname=users[i].dept;
		tempuser.title=users[i].title+"("+deptname+")";
		tempuser.name=users[i].title;
		userlist.push(tempuser);

	}
	setMembers(userlist)

	$("#listview ul li").on('tap', function(obj) {
		qcRepet(userlist[obj.currentTarget.attributes["data-index"].value]);
	});
	//将原本已选中的展示出来
	var listView =  document.getElementById("listview");
	console.log(listView);
	for (var i=0; i < users.length; i++) {
		var id_s1 = users[i].oid;
		for (var j=0; j < members.length; j++) {
			var id_s2 = members[j].oid;
			if(id_s1==id_s2){
				$(listView).find("ul li[id='"+id_s2+"'] input").attr("checked", "checked");
			}
		}
	}

}
function setMembers(arrs){
	var html=""
	html+='<ul>'
	for(var i=0;i<arrs.length;i++){
		html+='<li class="ubb ub bc-border bc-text ub-ac lis" id="'+arrs[i].oid+'" data-index="'+i+'">'
		html+='<div class="lv_title ub-f1 marg-l ub ub-ver ut-m line3">'
		html+=arrs[i].title
		html+='</div>'
		html+='<div class="radiobox  umar-l">'
		html+='<input type="radio" class="uabs ub-con" name="lv_radio_1">'
		html+='</div>'
		html+='</li>'
	}
	html+='</ul>'
	$("#listview").html(html)
}
//展示信息



function submitok() {
	//提交根据不同的类型发送到不同的请求
	var submitType = cmp.storage.get('submitType');

	var url = '' ;
	var ids = "" ;
	var names = "" ;
	var codes =[];
	var groupnames=[];
	if(members.length<1){
		cmp.notification.alert("请选择人员",function(){

		},"提示","确定","",false,false);
		return ;
	}
	if(submitType!=null&&submitType=='next'){
		var auditor = members[0].oid ;
		var auditorname = members[0].name;
		var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		var serviceUrl = cmp.storage.get('serviceUrl');
		var phoneid = cmp.storage.get('phoneid');
		var olduser = cmp.storage.get('olduser');
		var oldpwd = cmp.storage.get('oldpwd');
		var StationGUID = cmp.storage.get('StationGUID');
		var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&passValue=1&stype=submitgo";
		url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + cmp.storage.get('content') + "&oid=" + oid;
		url = url + "&auditor=" + auditor + "&auditorname=" + auditorname;
		url = url + "&StationGUID=" + StationGUID;
		//console.log(url);
		ajaxJson(url, sucessJh);
	}else{
		var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		var content = cmp.storage.get('content');
		var serviceUrl = cmp.storage.get('serviceUrl');
		var phoneid = cmp.storage.get('phoneid');
		var olduser = cmp.storage.get('olduser');
		var oldpwd = cmp.storage.get('oldpwd');
		var StationGUID = cmp.storage.get('StationGUID');
		var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_zb";
		url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
		var userguid = members[0].oid ;
		var userguname = members[0].name ;
		url = url + "&userguid="+userguid+"&userguname="+userguname;
		url = url + "&StationGUID=" + StationGUID;
		url = url + "&platform=" + platform;
		console.log(url);
		ajaxJson(url, sucessJh);
	}

}

function sucessJh(data){
	cmp.storage.save("link_uniqueid","");
	console.log(data);
	cmp.notification.alert("办理成功",function(){
		cmp.href.back(3)
	},"提示","确定","",false,false);
}

function sucessSubmit(data){
	console.log(data);
	//cmp.storage.save('affairid','');
	//cmp.storage.save('summaryid','');
	cmp.storage.save('dbtabindex',0);
	cmp.notification.alert("办理成功",function(){
		cmp.href.back(3)

	},"提示","确定","",false,false);
}
//lv2.set(types);
$("#search").on("tap", function() {
	var infoName = $('#infoName').val();
	if (infoName == "" || infoName == null) {
		cmp.notification.alert("输入条件不能为空！",function(){

		},"提示","确定","",false,false);
	} else {
		//查找人员
		getMemberList('11b11db4-e907-4f1f-8835-b9daab6e1f23',infoName);
	}
})

