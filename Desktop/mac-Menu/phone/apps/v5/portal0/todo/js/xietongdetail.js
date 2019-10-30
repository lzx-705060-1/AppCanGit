cmp.ready(function(){
    //cmp.storage.save("kingdeecom_serviceUrl","http://10.1.9.144")
    //cmp.storage.save("kingdeecom_loginname","A000508")
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    //document.getElementsByClassName("cmp-content")[0].style.marginTop=(document.getElementsByTagName("header")[0].offsetHeight)+"px";
    //document.getElementById("cmp-content").style.marginTop=(document.getElementsByTagName("header")[0].offsetHeight)+"px";
    intiPage();//初始化页面，对页面中的显示进行初始化
    cmp.backbutton();//将Android返回按钮劫持
    //cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面并且注销的函数
    cmp.backbutton.push(myback);//向返回按钮堆栈加入回退到上一个页面并且注销的函数
    bindEvent();//给页面中的按钮绑定事件

    //webview交互
    cmp.webViewListener.add({type: 'close_xietong_page'});
    document.addEventListener('close_xietong_page', function(event) {
        var extData = cmp.href.getParam()
        var affairid = extData.affairid
        cmp.webViewListener.fire({
            type:"reflesh_olddaiban",  //此参数必须和webview1注册的事件名相同
            data:affairid
        });
        cmp.href.back(1,{data:{olddaibanflag:"reflesh_old"}});
    })
    //webview交互
    cmp.webViewListener.add({type: 'xietong_submitFormData12'});
    document.addEventListener('xietong_submitFormData12', function(event) {
        var paramObj = event.data
        var title = paramObj.title
        var templeteId = paramObj.templeteId
        submitFormData(title,templeteId)
    })
});
var html = '';
var titleName;
var parent_node = [];//父节点数组
var child_nodes= [];//子节点数组
var data_xml_2;
var packet_size;//分组大小
var nodesName; //子节点名称
var paixu_arr = [];//指定排序顺序
var m = 1;
isFromQYWX=false;
urlParamObj=null;
function intiPage(){
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i]=="from=wxdaiban"){
                isFromQYWX=true
                urlParamObj=transUrlToObj()//获取参数
                //alert(JSON.stringify(urlParamObj))
                setLoginname()//设置用户名
                break;
            }
        }
    }
    getDetail();
    
    $(".cmp-tab-item").each(function(index){
        if(index==0){
            this.addEventListener("tap",openfujian)
            //$(this).on("tap",openfujian);
        }else if(index==1){
            $(this).on("tap",openyijian)
        }else{
            $(this).on('tap',change_content)
        }
    })

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
        obj2["affairid"]=obj["affairid"]?obj["affairid"]:""
        obj2["create_date"]=obj["create_date"]?obj["create_date"]:""
        obj2["node_policy"]=obj["node_policy"]?obj["node_policy"]:""
        obj2["processid"]=obj["processid"]?obj["processid"]:""
        obj2["sendername"]=obj["sendername"]?obj["sendername"]:""
        obj2["summaryid"]=obj["summaryid"]?obj["summaryid"]:""
        obj2["title"]=obj["title"]?obj["title"]:""
        obj2["isfromwx"]="true"
        return obj2
    }
}

function setLoginname(){
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
                cmp.storage.save("ygzz_loginname",r)
                getUserInfo()
            }
        },
        error: function(r){
            console.log(JSON.stringify(r))
        }
    })
}

//获取3.5用户信息
function getUserInfo(){
    //var _this=this
    //alert(JSON.stringify(cmp.member))
    //alert(typeof(cmp.storage.get("currentUserInfo"))+"--"+cmp.storage.get("currentUserInfo").account)
    //var username = cmp.member.account
    //var username = (JSON.parse(cmp.storage.get("currentUserInfo"))).account
    var username = cmp.storage.get("ygzz_loginname")
    var serviceUrl = "http://10.1.9.144";
    //var serviceUrl = "https://mportal.agile.com.cn:8443";
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_login&stype=getgroup";
    url = url + "&username=" + username
    console.log("发送请求参数如下:");
    //cmp.dialog.loading("加载中...")
    try{
        $.ajax({
            type : 'GET',
            url : url,
            dataType : 'json',
            async : false,
            timeout : 50000,
            success : function(data) {
                //cmp.dialog.loading(false)
                if(data.user&&data.user!=""){
                    //cmp.storage.save("ygzz_loginname",(JSON.parse(cmp.storage.get("currentUserInfo"))).account);
                    //cmp.storage.save("ygzz_loginname","A000508");
                    //cmp.storage.save("ygzz_password","asdf123");
                    if(username=="liuquan"){
                        cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144")
                    }else{
                        cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144")
                        //cmp.storage.save("ygzz_serviceUrl","https://mportal.agile.com.cn:8443");
                    }
                    //cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144")
                    cmp.storage.save('ygzz_org_department_id',data.user.org_department_id)
                    cmp.storage.save("ygzz_org_account_id",data.user.org_account_id);
                    //cmp.storage.save("ygzz_org_account_id","608696710712280500");
                    cmp.storage.save("ygzz_superior",data.user.superior);
                    //_this.getOldDaiban()
                    //getOldDaiban()
                }

            },
            error : function(xhr, type) {
                cmp.dialog.loading(false)
                if (type == 'error') {
                    cmp.notification.alert("数据加载失败",function(){
                        //do something after tap button
                    },"提示","确定","",false,false);

                } else {
                    cmp.notification.alert("网络请求失败，请重试。",function(){
                        //do something after tap button
                    },"提示","确定","",false,false);

                }
            }
        })
    }catch(e){

    }

}
//打开附件页面
function openfujian(){
    var extData = cmp.href.getParam()?cmp.href.getParam():urlParamObj
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/fujian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
//打开意见页面
function openyijian(){
    var extData = cmp.href.getParam()?cmp.href.getParam():urlParamObj
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/yijian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}

function bindEvent(){

    //给头部返回按钮绑定事件
    if(isFromQYWX){
        document.getElementById("backBtn").style.display=""
        document.getElementById("backBtn").addEventListener("tap",function(){
            if(isFromQYWX){
                cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
            }else{
                cmp.href.back(1,{data:{olddaibanflag:"reflesh_old"}});
            }
            //cmp.href.back();//返回上一页面
        });
    }
    //给头部右边按钮绑定事件
    document.getElementsByClassName("cmp-header-right")[0].addEventListener("tap",function(){
        var sdata = cmp.href.getParam()?cmp.href.getParam():urlParamObj;
		var data_bodytype= cmp.storage.get('data_bodytype');
		var data_input_xml= cmp.storage.get('data_input_xml');
		var data_xml= cmp.storage.get('data_xml');
        var isfromwx=urlParamObj?"true":""
		   var extData={
			 "affairid":sdata.affairid,
            "create_date":sdata.create_date,
            "node_policy":sdata.node_policy,
            "processid":sdata.processid,
            "sendername":sdata.sendername,
            "summaryid":sdata.summaryid,
            "title":sdata.title,
            "data_bodytype":data_bodytype,
            "data_input_xml":data_input_xml,
            "data_xml":data_xml,
            "isfromwx":isfromwx
        }
        cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/banli.html",extData,{openWebViewCatch: true,nativeBanner: false})
    });
}
function myback(){
    if(isFromQYWX){
        cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
    }else{
        cmp.href.back(1,{data:{olddaibanflag:"reflesh_old"}});
    }
}

/***********************************************分割线***************************************************/
function getDetail() {
    var paramObj = cmp.href.getParam()?cmp.href.getParam():urlParamObj
    var affairid = paramObj.affairid;
    var summaryid = paramObj.summaryid;
    var title = paramObj.title;
    //设置头部title
    $(".cmp-title").html(title)
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'newoa_col',
        'username' : loginname,
        //'password' : password,
        'PHONE_ID' : phoneid,
        'affairid' : affairid,
        'summaryid' : summaryid
    };
    obj.successFun = 'httpsucess';
    //alert(JSON.stringify(obj))
    ajaxJson_v1(obj);
}
//控制初始化页面及是否能放大缩小
function httpsucess(data) {
    var attachments = data['attachments'].count;
	var attachments = data['attachments'].count;
    var data_bodytype = data['form_data'].BODYTYPE;
    cmp.storage.save('data_bodytype', data_bodytype);
    var data_input_xml =data['form_data'].INPUT_XML;
    cmp.storage.save('data_input_xml', data_input_xml);
    var data_xml = data['form_data'].XML;
    cmp.storage.save('data_xml', data_xml);
    //var num = cmp.storage.get('fujiannum')
    $("footer .cmp-tab-label").eq(0).html('附件(' + attachments + ')')
    if (kongzhi(data.form_data.TEMPLETEID)) {
        //appcan.window.evaluateScript('xietongdetail', 'addtab(1)');
        addtab()
        yincang();

    } else {
        //appcan.window.evaluateScript('xietongdetail', 'addtab(2)');
       // $('meta[name="viewport"]').attr('content',"target-densitydpi=device-dpi, width=device-width, initial-scale=0.5, user-scalable=yes" );
    };
    //必填项进行标签的替换使得可以输入内容:该js存于服务器
    getReplaceHTMLinfo(data);
    get_new_content(data);
    if($("#new_content").css("display")== 'none'){
        var height = document.getElementById("content").offsetHeight;
    }else{
        var height = document.getElementById("new_content").offsetHeight;
    }
    tAlerts();
}
function addtab(){
    var transf = '<a class="cmp-tab-item  cmp-tabview-item" id="transf">'
    transf+='<span class="cmp-icon fa-list"></span>'
    transf+='<span class="cmp-tab-label">切换</span>'
    transf+='</a>'
    $("footer").append(transf);
}


//单行数据
var array = [];
//重复数据
var array2 = [];
//重复字段
var array3 = [];
var array4 = [];
var array5 = [];
var titleName;
function get_new_content(data) {
    xz_xml(data);
    var xml = data.form_data.XML.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    $(xml).children().each(function(index1, element1) {
        if (element1.tagName.replace('MY:', '') == '组1') {
            $(element1).children().each(function(index2, element2) {
                if (element2.tagName.replace('MY:', '') == '组2') {
                    $(element2).children().each(function(index3, element3) {
                        var obj = new Object();
                        obj.name = element3.tagName.replace('MY:', '');
                        obj.value = $(element3).text();
                        array2.push(obj);
                        array3.push(element3.tagName.replace('MY:', ''));
                    })
                }
            })
        } else if (element1.tagName.replace('MY:', '') == '组3') {
            $(element1).children().each(function(index2, element2) {
                if (element2.tagName.replace('MY:', '') == '组4') {
                    $(element2).children().each(function(index3, element3) {
                        var obj = new Object();
                        obj.name = element3.tagName.replace('MY:', '');
                        obj.value = $(element3).text();
                        array4.push(obj);
                        array5.push(element3.tagName.replace('MY:', ''));
                    })
                }
            })
        } else {
            var obj = new Object();
            obj.name = element1.tagName.replace('MY:', '');
            obj.value = $(element1).text();
            array.push(obj);
        }
    })
    var arrayN = uniq(array3);
    var arrayN1 = uniq(array5);
    console.log(array);
    console.log(array2);
    console.log(arrayN);
    console.log(array4);
    console.log(arrayN1);



    // var html = '';
    if (data.form_data.TEMPLETEID == '937751255366059273') { //行政综合服务申请单(行政类)
        var Service_type = parent_node[4].value;//服务类型
        var titleName = parent_node[4].value;//标题
        var titleArr = [1,2,3,4,5,6];
        html = xz_MainNodes_1(titleName , titleArr);
        html = xz_ComprehensiveService(data,Service_type);
    }
    else if (data.form_data.TEMPLETEID == '77298762289136847') {//集团本部证照、档案查阅借阅复制申请表(行政类)
        var titleArr = [1,2,3,4,9,5,6,7,8];
        var titleName ='集团本部证照、档案查阅借阅复制申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-8233977498163002399') {//文件会签表(行政类)
        var titleArr = [1,25,2,3,4,5,6,7,8,26];
        var titleName ='文件会签表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5520236027379927310') {//区域公司出差申请表(地产板块适用)
        var titleArr = [1,2,3,12,5,8,9,10,13,11,26,27,28,29,30,15,16,18,21,19,20,22,17,25,35];
        var titleName ='区域公司出差申请表(地产板块适用)';
        var num;
        for (var i = 0; i < parent_node.length; i++) {
            if(parent_node[i].name == '经办人'){
                parent_node[i].name = '填单人';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '是'){
                parent_node[i].value = '紧急订票';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '否'){
                parent_node[i].value = '普通订票';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '否'){
                parent_node[i].value = '正常出差申请';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '是'){
                parent_node[i].value = '后补出差申请';
            }
            else if(parent_node[i].name == '发票抬头top'){
                parent_node[i].name = '发票抬头';
            }else if(parent_node[i].value=='选择'){
                parent_node[i].value = parent_node[i].name;
                parent_node[i].name = '出差交通工具';
            }
            if(parent_node[i].value=='未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);
        html += '<div id="biaoti"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="出差明细"/></div>';
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,12,14,6,7,8,9,10,11,15,16,17];
        for (var i = 0; i <  child_nodes.length; i++) {
            if(child_nodes[i].name == '备注'){
                child_nodes[i].name = '时间段/航班号';
            }
        }
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '1048492752617819349') {//出差申请表(教育集团适用)
        var titleArr = [1,2,3,12,5,8,9,10,13,11,26,27,28,29,30,15,16,18,21,19,20,22,17,25,35];
        var titleName ='出差申请表(教育集团适用)';
        var num;
        for (var i = 0; i < parent_node.length; i++) {
            if(parent_node[i].name == '经办人'){
                parent_node[i].name = '填单人';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '是'){
                parent_node[i].value = '紧急订票';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '否'){
                parent_node[i].value = '普通订票';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '否'){
                parent_node[i].value = '正常出差申请';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '是'){
                parent_node[i].value = '后补出差申请';
            }
            else if(parent_node[i].name == '发票抬头top'){
                parent_node[i].name = '发票抬头';
            }else if(parent_node[i].value=='选择'){
                parent_node[i].value = parent_node[i].name;
                parent_node[i].name = '出差交通工具';
            }
            if(parent_node[i].value=='未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);
        html += '<div id="biaoti"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="出差明细"/></div>';
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,12,14,6,7,8,9,10,11,15,16,17];
        for (var i = 0; i <  child_nodes.length; i++) {
            if(child_nodes[i].name == '备注'){
                child_nodes[i].name = '时间段/航班号';
            }
        }
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '1716065264241035314') {//区域公司制度制定与修订审批单
        var titleArr = [1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16 , 17, 18, 19];
        var titleName ='区域公司制度制定与修订审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7812734632841228541') {//请假单(考勤类)
        var titleArr = [1, 2, 4, 6, 7, 9, 10 , 16];
        var titleName ='请假单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
    }
    //酒店行政车辆维修申请表
    else if (data.form_data.TEMPLETEID == '-2296586595266639809') {
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='酒店行政车辆维修申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%; "><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[0].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[0].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[12].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[12].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[13].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[13].value + '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }
    //球会行政车辆维修申请表
    else if (data.form_data.TEMPLETEID == '-241159187613791029') {
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='球会行政车辆维修申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%; "><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[0].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[0].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[12].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[12].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[13].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[13].value + '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }
    //区域公司行政车辆维修申请表
    else if (data.form_data.TEMPLETEID == '-4139124209889032790') {
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='区域公司行政车辆维修申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%; "><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[0].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[0].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[12].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[12].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[13].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[13].value + '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }
    else if (data.form_data.TEMPLETEID == '-3480261042881673583') {
        var titleArr = [1,2,4,3,6,5,12,11,7,8,9,10];
        var titleName ='雅生活集团综合请示审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-551529683811941910') {//集团本部印刷名片申请表
        parent_node[20].name= '入职日期';
        var titleArr = [0,17,3,1,2,19,14,4,11,10,20,16,12,9,6,13,8,7,15];
        var titleName ='集团本部印刷名片申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7296764394475571190') {// 区域机票订票、退票单
        var titleArr = [1,2,3,4,6,7,5];
        var titleName ='区域机票订票、退票单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 11;
        paixu_arr = [0, 1, 2, 3, 4, 5,6,7,8,9,10];
        paixu(paixu_arr,packet_size);

    }
    else if (data.form_data.TEMPLETEID == '3896864326085790690') {// 集团本部机票订票、退票单
        var titleArr = [1,2,3,4,6,7,5];
        var titleName ='集团本部机票订票、退票单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 11;
        paixu_arr = [0, 1, 2, 3, 4, 5,6,7,8,9,10];
        paixu(paixu_arr,packet_size);

    }
    else if (data.form_data.TEMPLETEID == '-6529574094086059314') {//项目公司注册变更注销申请表(控股地产适用)
        var titleArr = [1,2,3,4,5,6,16,7,8,24,17,18,22,23,19,20,21,9,10,11];
        var titleName ='项目公司注册变更注销申请表(控股地产适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5181108400302475433') {//加班单(考勤类)
        var titleArr = [1, 2, 4, 6, 7];
        var titleName ='加班单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 12;
        paixu_arr = [0, 1, 2, 3, 4, 9, 6, 7, 8];
        paixu(paixu_arr,packet_size);

    }
    else if (data.form_data.TEMPLETEID == '2035660100223779502') {//分公司、项目机票订票、退票单
        var titleArr = [1,2,3,4,6,7,5];
        var titleName ='分公司、项目机票订票、退票单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 11;
        paixu_arr = [0, 1, 2, 3, 4, 5,6,7,8,9,10];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3900115189928996865') {//刻制印章申请表(地产公司适用)
        var titleArr = [10, 8, 2, 1,3, 9, 4, 5, 6, 7, 17, 18];
        var titleName ='刻制印章申请表(地产公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2772328269487623878') {// 出差申请表(境外公司适用)
        var titleArr = [1,2,3,12,5,8,9,10,13,11,35];
        var titleName ='出差申请表(境外公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 17;
        paixu_arr = [0, 1, 2, 3];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '568995026641439267') {//签卡单(考勤类)
        var arrNum = [1, 2, 4, 8, 9, 6, 7];
        html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="签卡证明单"/></div>';
        html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        for (var i = 0; i < arrNum.length; i++) {
            var j;
            j = arrNum[i];
            if (i < 1) {
                html += '<tr style="width:100%;background-color:rgb(0, 166, 147);"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].value + '&nbsp&nbsp"/></td></tr>';
            } else {
                html += '<tr style="width:100%;"><td class="color2" style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + array[j].name + '"/></td><td class="color2" style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + array[j].value + '&nbsp&nbsp"/></td></tr>';
            }
        }
        html += '</table>';

        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 2) {
                    html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
                    html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="' + m + '" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r"  name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '&nbsp&nbsp"/></td></tr>';
                } else if (array2[i].name == '正常上班签卡时间_时') {
                    var j = i + 1;
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="正常上班签卡时间"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '时' + array2[j].value + '分&nbsp&nbsp"/></td></tr>';
                } else if (array2[i].name == '正常下班签卡时间_时') {
                    var j = i + 1;
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="正常下班签卡时间"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '时' + array2[j].value + '分&nbsp&nbsp"/></td></tr>';
                } else if (array2[i].name == '加班上班签卡时间_时') {
                    var j = i + 1;
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="加班上班签卡时间"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '时' + array2[j].value + '分&nbsp&nbsp"/></td></tr>';
                } else if (array2[i].name == '加班下班签卡时间_时') {
                    var j = i + 1;
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="加班下班签卡时间"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '时' + array2[j].value + '分&nbsp&nbsp"/></td></tr>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 2) {
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '&nbsp&nbsp"/></td></tr>';
                    html += '</table>';
                    m++;
                } else if (array2[i].name == '工号1' || array2[i].name == '姓名1' || array2[i].name == '员工编码1' || array2[i].name == '正常上班签卡时间_分' || array2[i].name == '正常下班签卡时间_分' || array2[i].name == '加班上班签卡时间_分' || array2[i].name == '加班下班签卡时间_分' || array2[i].name == '当天考勤记录') {
                    continue;
                } else {
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '&nbsp&nbsp"/></td></tr>';
                }
            }
        };
    }
    else if (data.form_data.TEMPLETEID == '-4009124918176628592') {//教育集团项目公司注册变更注销申请表
        var titleArr = [1,24,2,5,3,4,25,7,6,16,8,17,18,22,23,19,20,21,9,10,11];
        var titleName ='教育集团项目公司注册变更注销申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2600744919581803574') {//印章使用申请单(行政类)
        var titleArr = [1,22,12,4,2,3,7,6,5,8,9];
        var titleName ='印章使用申请单 ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0,1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3250564978480560965') {//刻制印章申请表(球会适用)
        var titleArr = [10, 8, 2, 1,3, 9, 4, 5, 6, 7, 17, 18];
        var titleName ='刻制印章申请表(球会适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    //行政车辆维修申请表(产业板块适用)
    else if (data.form_data.TEMPLETEID == '3844567553221806368') {
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='行政车辆维修申请表(产业板块适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%; "><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[0].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[0].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[12].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[12].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[13].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[13].value + '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }
    else if (data.form_data.TEMPLETEID == '7787044277212693536') {
        //个案 概 况
        //html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="雅居乐互助会个案资助申请电子审批表"/></div>';
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);

    }
    else if (data.form_data.TEMPLETEID == '-3735391380211350158') {
        //个案 概 况
        //html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="雅居乐互助会个案资助申请电子审批表(控股公司适用)"/></div>';
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(控股公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleArr = [60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);

    }
    else if (data.form_data.TEMPLETEID == '5281784317832219510') {//雅居乐集团展厅参观申请表(行政类)
        var titleArr = [1,2,3,4,15,5,6,7,8,18,9,11,12,14];
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '选择'){
                parent_node[i].value =  parent_node[i+1].value;
            }
        };
        var titleName ='雅居乐集团展厅参观申请表(行政类)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-3078021211368832386') {//集团总部内部车辆出入信息登记单(地产板块适用)
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='集团总部内部车辆出入信息登记单(地产板块适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5392143497167224499') {//集团总部内部车辆出入信息登记单(直管公司适用)
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='集团总部内部车辆出入信息登记单(直管公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '9201374726088377563') {//集团总部内部车辆出入信息登记单(雅生活集团适用))
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='集团总部内部车辆出入信息登记单(雅生活集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-1807943382927064355') {//区域公司内部车辆出入信息登记单(雅生活集团适用))
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='区域公司内部车辆出入信息登记单(雅生活集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '4787935543631366744') {//建设集团员工晋升评估审批表
        var titleArr = [1,71,72,2,79,3,7,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
        var titleName ='建设集团员工晋升评估审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-7150569741368737014') {//环保集团员工晋升评估审批表
        var titleArr = [1,71,72,73,2,3,7,4,5,6,8,9,10,11,12,13,14,15,16,83,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
        var titleName ='环保集团员工晋升评估审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '5671067115414176720') {//球会员工晋升评估审批表
        var titleArr = [1,71,72,73,2,3,7,4,5,6,8,9,10,11,12,13,14,15,16,83,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
        var titleName ='球会员工晋升评估审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-633230948592038601') {//物业管理拓展项目转介申请表
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,13,14,15,27,16,20,21];
        var titleName ='物业管理拓展项目转介申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0, 1, 2];
        paixu(paixu_arr,packet_size);
    }else if (data.form_data.TEMPLETEID == '-465454106832321650') {//异常改建报备表
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var titleName ='异常改建报备表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-610264067602232919') {//物业拓展激励奖金申请表
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,18,19,20,14,15,21,22,17];
        var titleName ='物业拓展激励奖金申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-3641074914828858405') {//物业疑难问题汇报表
        var titleArr = [1,2,3,4,5,7,6,8,9,10,11,12,13];
        var titleName ='物业疑难问题汇报表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-13501169223185569') {//改建户外工程申请表
        var titleArr = [1,2,3,4,5,7,6,8,9,10,12,11];
        var titleName ='改建户外工程申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '1737250438260345118') {//设计制作申请单
        var titleArr = [1,2,3,4,5,7,6,8,9,10,11];
        var titleName ='设计制作申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0,1,2,3];
        paixu(paixu_arr,packet_size);
    }else if (data.form_data.TEMPLETEID == '1027577815176859086') {//电话申请单
        var titleArr = [1,2,3,4,5,7,6];
        var titleName ='电话申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0,1,2,3];
        paixu(paixu_arr,packet_size);
    }else if (data.form_data.TEMPLETEID == '6403533832671547231 ') {//奖罚单
        var titleArr = [1,2,3,4,5,7,6,8,9,10,11,13,12];
        var titleName ='奖罚单';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '5671067115414176720') {//房管集团员工晋升评估审批表
        var titleArr = [1,71,72,73,2,3,7,4,5,6,8,9,10,11,12,13,14,15,16,83,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
        var titleName ='房管集团员工晋升评估审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-9045320827570404155') {//雅筑公司项目经理引入申报审批表
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11];
        var titleName ='雅筑公司项目经理引入申报审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-8822795880723821762') {//刻制印章申请表(建设集团适用)
        var titleArr = [10, 8, 2, 1,3, 9, 4, 5, 6, 7, 17, 18];
        var titleName ='刻制印章申请表(建设集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5728204707846733659') {//区域公司内部车辆出入信息登记单(直管公司适用))
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='区域公司内部车辆出入信息登记单(直管公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '262446142804805212') {//教育集团制度制定与修订审批单
        if (parent_node[8].value == '集团通用类' || parent_node[8].value == '集团专业类' || parent_node[8].value == '职能、运营管理类制度' || parent_node[8].value == '生产技术管理类制度'){
            var titleArr = [1,2,3,4,5,6,7,8,13,14,17,18,19];
        }else if (parent_node[8].value == '各校(园)适用专业类'){
            var titleArr = [1,2,3,4,5,6,7,8,13,14,24,25,26,17,18,19];
        }
        var titleName ='教育集团制度制定与修订审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5262880614361182669') {//刻制印章申请表(教育集团适用))
        var titleArr = [10,8,2,1,3,9,4,5,6,7,17,18];
        var titleName ='刻制印章申请表(教育集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6381262752882408630') {//环保集团制度制定与修订审批单
        var titleArr = [1,2,3,4,5,6,7,8,13,14,15,16,17,18,19];
        var titleName ='环保集团制度制定与修订审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2608409883646444999') {//内部车辆出入信息登记单(教育集团本部适用)
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='内部车辆出入信息登记单(教育集团本部适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8838706116918265531') {//内部车辆出入信息登记单(教育集团下属单位适用)
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='内部车辆出入信息登记单(教育集团下属单位适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8686396059014285706') {//区域公司内部车辆出入信息登记单(地产板块适用)
        var titleArr = [1,2,3,4,13,5,6,12,7,8,9,11,10];
        var titleName ='区域公司内部车辆出入信息登记单(地产板块适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '920908986682198882') {//项目公司注册变更注销申请表(酒店公司适用)
        var titleArr = [1,2,3,4,5,6,16,7,8,24,17,18,22,23,19,20,21,9,10,11];
        var titleName ='项目公司注册变更注销申请表(酒店公司适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }



    else if (data.form_data.TEMPLETEID == '-7575886243163911856') {//西安公司资产维修申请单(行政类)
        var titleArr = [19,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var titleName ='西安公司资产维修申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0, 1, 2, 3];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[17].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' +parent_node[17].value+ '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[18].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' +parent_node[18].value+ '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }

    else if(data.form_data.TEMPLETEID == '-3783931503799153638'){
        var titleArr = [0,17,3,1,2,19,14,4,11,10,20,16,12,9,6,13,8,7,15];
        parent_node[20].name = '入职日期';
        var titleName ='分公司印刷名片申请表';

        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '1960292154601849020') {//社会公益类奖项参评审批表(行政类)
        var titleArr = [1,2,3,4,5,6,7,8,9];
        var titleName ='社会公益类奖项参评审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '-5461635084680933438') {//城市公司参加社会评奖公益活动申请表(行政类)
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var titleName ='城市公司参加社会评奖公益活动申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }


    else if (data.form_data.TEMPLETEID == '8765153999093777869') {//集团本部参加社会评奖公益活动申请表(行政类)
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var titleName ='集团本部参加社会评奖公益活动申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '5017440158153788979') {//  控股公司行政车辆维修申请表(行政类)
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='控股公司行政车辆维修申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }


    else if (data.form_data.TEMPLETEID == '-6515677626749140212') {//  集团本部行政车辆维修申请表(行政类)
        var titleArr = [1,7,10,11,3,6,4,9,8,5];
        var titleName ='集团本部行政车辆维修申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = 'group2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '6280743566215169764') {//证照、档案查阅借阅复制审批表(产业板块适用)
        var titleArr = [1,2,3,4,9,5,6,7,8];
        var titleName ='证照、档案查阅借阅复制审批表(产业板块适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '3846065355546574898') {//车辆维修申请表(雅生活适用)(行政类)
        parent_node[2].name= '物业城市公司';
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12];
        var titleName ='车辆维修申请表(雅生活适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
        html += '<table class="tab" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%; "><td style="width:40%;"><input value="合计费用" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[13].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[13].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[14].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[14].value + '&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[15].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[15].value + '&nbsp&nbsp"/></td></tr>';
        html += '</table>';
    }

    else if (data.form_data.TEMPLETEID == '-6131764484774081912') {//  机票订票、退票单-样式调整专用(行政类)
        var titleArr = [1, 2, 3, 4, 6, 7, 5];
        var titleName ='机票订票、退票单-样式调整专用';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 11;
        paixu_arr =[0,1,2,3,4,5,6,7,8,9,10];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '4920821981846389600') {//  管理人员廉政关联信息申报表(行政类)
        var arrNum = [1,2,29,30,10,11,3,4,5,6,7,8,9,12,13,14,15];
        html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="管理人员廉政关联信息申报表"/></div>';
        html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        for (var i = 0; i < arrNum.length; i++) {
            var j;
            j = arrNum[i];
            if (i < 1) {
                html += '<tr style="width:100%;background-color:rgb(0, 166, 147);"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].value + '&nbsp&nbsp"/></td></tr>';
            } else {
                html += '<tr style="width:100%;"><td class="color2" style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + array[j].name + '"/></td><td class="color2" style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + array[j].value + '&nbsp&nbsp"/></td></tr>';
            }
        }
        html += '</table>';
        //在雅居乐工作履历信息
        html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="在雅居乐工作履历信息"/></div>';
        //只需要制定排列顺序
        for (var j = 0; j < array2.length; j++) {
            if (j == 0) {
                html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
                html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="'+m+'" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[j].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[j].value + '&nbsp&nbsp"/></td></tr>';
            } else if (j%4 == 0 && j != 0) {
                m++;
                html += '</table>';
                html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
                html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="'+m+'" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[j].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[j].value + '&nbsp&nbsp"/></td></tr>';
            } else if(j == array2.length-1){
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[j].value + '&nbsp&nbsp"/></td></tr>';
                m++;
                html += '</table>';
            }
            else {
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[j].value + '&nbsp&nbsp"/></td></tr>';
            }
        }

        //在当前职务管辖范围内以本人名义推荐引入或安排下属推荐引入合作单位情况
        var listValue=array[44].value;//获取下标为44 的值
        var reList = listValue.trim().split(/\s+/);
        var data = [];
        var len = reList.length;
        for (var item = 0; item < len; item++) {
            var newObject = {
                zw:reList[item], //职位
                ly:reList[item + 1]  //理由
            };
            if (item % 2 == 0 ){
                data.push(newObject);
            }
        }
        var listValue1=array[45].value;//获取下标为45 的值
        var reList1 = listValue1.trim().split(/\s+/);
        var data1 = [];
        var len1 = reList1.length;
        for (var item = 0; item < len1; item++) {
            var newObject = {
                zw:reList1[item], //职位
                ly:reList1[item + 1]  //理由
            };
            if (item % 2 == 0 ){
                data1.push(newObject);
            }
        }
        html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="在当前职务管辖范围内以本人名义推荐引入或安排下属推荐引入合作单位情况"/></div>';
        html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="详情" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        for (var item in data) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="本人名义推荐的单位名称"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data[item].zw+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="推荐引入理由"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data[item].ly+'&nbsp&nbsp"/></td></tr>';
        }
        for (var item1 in data1) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="安排下属推荐的单位名称"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data1[item1].zw+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="推荐引入理由"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data1[item1].ly+'&nbsp&nbsp"/></td></tr>';
        }
        m++;
        html += '</table>';
        //亲属关联信息
        var listValue3=array[41].value;//获取下标为41 的值
        var reList3 = listValue3.trim().split(/\s+/);
        var data3 = [];
        var len3 = reList3.length;
        for (var item = 0; item < len3; item++) {
            var newObject = {
                name:reList3[item],
                age:reList3[item + 1],
                mc:reList3[item + 2],
                yw:reList3[item + 3]

            };
            if (item % 4 == 0 ){
                data3.push(newObject);
            }
        }
        var listValue4=array[42].value;//获取下标为42 的值
        var reList4 = listValue4.trim().split(/\s+/);
        var data4 = [];
        var len4 = reList4.length;
        for (var item = 0; item < len4; item++) {
            var newObject = {
                name:reList4[item],
                age:reList4[item + 1],
                mc:reList4[item + 2],
                yw:reList4[item + 3]
            };
            if (item % 4 == 0 ){
                data4.push(newObject);
            }
        }
        var listValue5=array[43].value;//获取下标为43 的值
        var reList5 = listValue5.trim().split(/\s+/);
        var data5 = [];
        var len5 = reList5.length;
        for (var item = 0; item < len5; item++) {
            var newObject = {
                name:reList5[item],
                age:reList5[item + 1],
                mc:reList5[item + 2],
                yw:reList5[item + 3]
            };
            if (item % 4 == 0 ){
                data5.push(newObject);
            }
        }
        var arrNum = [16,17,18,19,20,21,22,23,32,33,34,35,36,37,38,39,24,25,26,27];
        html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="亲属关联信息"/></div>';
        html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
        html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="详情" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
        for (var i = 0; i < arrNum.length; i++) {
            var j;
            j = arrNum[i];
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array[j].value + '&nbsp&nbsp"/></td></tr>';
        }
        for (var j = 0; j < array4.length; j++) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array4[j].name+ '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' +array4[j].value+ '&nbsp&nbsp"/></td></tr>';
        }
        for (var item3 in data3) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="成年子女姓名"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data3[item3].name+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="成年子女年龄"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data3[item3].age+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="成年子女所任职务"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data3[item3].mc+'&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="成年子女业务往来情况"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data3[item3].yw+'&nbsp&nbsp"/></td></tr>';
        }
        for (var item4 in data4) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他与雅居乐各产业集团、直管公司存在业务往来的三代以内亲属姓名"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data4[item4].name+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他与雅居乐各产业集团、直管公司存在业务往来的三代以内亲属年龄"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data4[item4].age+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他与雅居乐各产业集团、直管公司存在业务往来的三代以内亲属职务"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data4[item4].mc+'&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他与雅居乐各产业集团、直管公司存在业务往来的三代以内亲属业务往来情况"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data4[item4].yw+'&nbsp&nbsp"/></td></tr>';
        }
        for (var item5 in data5) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他可能影响到您在雅居乐廉洁从业的情况姓名"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data5[item5].name+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他可能影响到您在雅居乐廉洁从业的情况年龄"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data5[item5].age+ '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他可能影响到您在雅居乐廉洁从业的情况所任职务"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data5[item5].mc+'&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="其他可能影响到您在雅居乐廉洁从业的情况业务往来情况"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + data5[item5].yw+'&nbsp&nbsp"/></td></tr>';
        }
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="员工本人郑重承诺："/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array[28].value+'&nbsp&nbsp"/></td></tr>';
        html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="员工廉政承诺书"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array[40].value+'&nbsp&nbsp"/></td></tr>';

        m++;
        html += '</table>';
    }


    else if (data.form_data.TEMPLETEID == '2781531993265291575') {//酒店印刷名片申请表(行政类)
        parent_node[20].name= '入职日期';
        var titleArr = [0,17,3,1,2,19,14,4,11,10,20,16,12,9,6,13,8,7,15];
        var titleName ='酒店印刷名片申请表';
        html = xz_MainNodes_1(titleName , titleArr);

    }

    else if (data.form_data.TEMPLETEID == '1027139718975671732') {//球会印刷名片申请表(行政类)
        parent_node[20].name= '入职日期';
        var titleArr = [0,17,3,1,2,19,14,4,11,10,20,16,12,9,6,13,8,7,15];
        var titleName ='球会印刷名片申请表';
        html = xz_MainNodes_1(titleName , titleArr);

    }

    else if (data.form_data.TEMPLETEID == '-5410812159219447474') {//集团总部出差申请表(地产板块适用)(行政类)
        var titleArr = [1,2,3,12,5,8,9,10,13,11,26,27,28,29,30,15,16,18,25,35];
        var titleName ='集团总部出差申请表(地产板块适用)';
        var num;
        for (var i = 0; i < parent_node.length; i++) {
            if(parent_node[i].name == '经办人'){
                parent_node[i].name = '填单人';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '是'){
                parent_node[i].value = '紧急订票';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '否'){
                parent_node[i].value = '普通订票';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '否'){
                parent_node[i].value = '正常出差申请';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '是'){
                parent_node[i].value = '后补出差申请';
            }
            else if(parent_node[i].name == '发票抬头top'){
                parent_node[i].name = '发票抬头';
            }else if(parent_node[i].value=='选择'){
                parent_node[i].value = parent_node[i].name;
                parent_node[i].name = '出差交通工具';
            }
            if(parent_node[i].value=='未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);
        html += '<div id="biaoti"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="出差明细"/></div>';
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,12,14,6,7,8,9,10,11,15];
        // paixu_arr = [0,1,2,3,4,5,12,14,6,7,8,9,10,11,13];
        for (var i = 0; i <  child_nodes.length; i++) {
            if(child_nodes[i].name == '备注'){
                child_nodes[i].name = '时间段/航班号';
            }
        }
        paixu(paixu_arr,packet_size);
    }

    else if (data.form_data.TEMPLETEID == '7138298345902264060') {//刻制印章申请表(控股地产总部适用)
        var titleArr = [10, 8, 2, 1,3, 9, 4, 5, 6, 7, 17, 18];
        var titleName ='刻制印章申请表(控股地产总部适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6537712324195171070') {//刻制印章申请表(酒店适用)
        var titleArr = [10, 1, 8, 2, 1, 3, 9, 4, 5, 6, 7, 17, 18];
        var titleName ='刻制印章申请表(酒店适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6698228782637561199') {//名片印刷申请(行政类)
        var titleArr = [0, 17, 3, 1, 2, 19, 14, 4, 11, 10, 20, 16, 12, 9, 6, 13, 8, 7, 15];
        var titleName ='名片印刷申请';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '3207317117236234991') {//集团总部制度制定与修订审批单
        var titleArr = [1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16 , 17, 18, 19];
        var titleName ='集团总部制度制定与修订审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7660662768402909317') {//区域公司证照、档案查阅借阅复制审批表(行政类)
        var titleArr = [1,2,3,4,9,5,6,7,8];
        var titleName ='区域公司证照、档案查阅借阅复制审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-6534540451007414205') {//信息中心信息系统帐户异动（变更/离调职）处理工作单(资讯类)
        var titleArr = [1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 17, 18, 19];
        var titleName ='信息中心信息系统帐户异动（变更/离调职）处理工作单(资讯类)';
        html = xz_MainNodes_1(titleName , titleArr);
    } else if (data.form_data.TEMPLETEID == '-3590058167739595400') {//ERP新增报表审批单 (EHR类)
        var titleArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        var titleName ='ERP新增报表审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '417871520731187825') {//ERP系统用户权限申请表 (EHR类)
        var titleArr = [1, 3, 4, 5, 11, 12, 6, 7, 8, 9, 10];
        var titleName ='ERP系统用户权限申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 12;
        paixu_arr = [0, 1, 2, 7, 8, 9, 3, 4, 5, 6];
        paixu(paixu_arr,packet_size);
    } else if (data.form_data.TEMPLETEID == '-8908439334822327916') {//外币汇率静态数据申请表 (财务类)
        for (var i = 0; i < array2.length; i++) {
            console.log(i + ' ' + array2[i].name);
        }
        var arrNum = [0, 1, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;">';
        for (var i = 0; i < arrNum.length; i++) {
            var j;
            j = arrNum[i];
            if (i < 3) {
                html += '<tr class="color2" style="width:100%;background-color:rgb(0, 166, 147);"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].name + '"/></td><td style="width:40%;"><input readOnly="readOnly" class="inp1 right color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].value + '"/></td></tr>';
            } else {
                html += '<tr class="color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + array[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + array[j].value + '"/></td></tr>';
            }
        }
        html += '</table>';

        for (var k = 0; k < array2.length / arrayN.length; k++) {
            var arrNum2 = [0, 1, 5, 6, 7, 4, 3, 2];
            //只需要制定排列顺序
            for (var j = 0; j < arrNum2.length; j++) {
                var i;
                i = arrNum2[j] + k * arrayN.length;
                if (j == 0) {
                    html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 10px;">';
                    html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '"/></td></tr>';
                } else if (j == arrNum2.length - 1) {
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '"/></td></tr>';
                    html += '</table>';
                    m++;
                } else {
                    html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + array2[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + array2[i].value + '"/></td></tr>';
                }
            }
        }
    } else if (data.form_data.TEMPLETEID == '6783254089728410802') {//项目立项申请单 (资讯类)

        for (var i = 0; i < array.length; i++) {
            console.log(i + ' ' + array[i].name);
        }
        var arrNum = [0, 1, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;">';
        for (var i = 0; i < arrNum.length; i++) {
            var j;
            j = arrNum[i];
            if (i < 3) {
                html += '<tr class="color2" style="width:100%;background-color:rgb(0, 166, 147);"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].name + '"/></td><td style="width:40%;"><input readOnly="readOnly" class="inp1 right color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + array[j].value + '"/></td></tr>';
            } else {
                html += '<tr class="color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + array[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + array[j].value + '"/></td></tr>';
            }
        }
        html += '</table>';
        for (var i = 0; i < array.length; i++) {
            var n = i + 1;
            if (array[i].value == '' || array[i].value == undefined || array[i].name == '辅助决策_量化说明' || array[i].name == '增加收入_量化说明' || array[i].name == '降低成本量化说明' || array[i].name == '提高效率_量化说明' || array[i].name == '无纸化办公_量化说明' || array[i].name == '控制风险_量化说明' || array[i].name == '业务管控_量化说明' || array[i].name == '审计要求_量化说明' || array[i].name == '其他量化说明') {
                continue;
            } else if (array[i].name == '辅助决策' || array[i].name == '增加收入' || array[i].name == '降低成本' || array[i].name == '提高效率' || array[i].name == '无纸化办公' || array[i].name == '控制风险' || array[i].name == '业务管控' || array[i].name == '审计要求' || array[i].name == '其他') {
                if (array[i].value == '选择') {
                    html += '<div class="border1" name="' + array[i].name + '" value="' + array[n].value + '"><div class="content-l" value="' + array[n].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[n].value + '">' + array[n].value + '</div></div>';
                } else {
                    continue;
                }
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 0) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                    m++;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                }
            }
        };
    } else if (data.form_data.TEMPLETEID == '-1682276082661768178') {//通用信息服务申请单 (咨询类 )
        var arr1 = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined || (i > 7 && i != 15)) {
                continue;
            } else if (i == 15) {
                var arr = array[i].value.split(" ");
                arr1 = uniq2(arr);
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < arr1.length; i++) {
            if (i % 7 == 0) {
                html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                html += '<div class="border1 team' + m + '" name="使用人部门" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">使用人部门</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 1) {
                html += '<div class="border1 team' + m + '" name="使用人岗位" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">使用人岗位</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 2) {
                html += '<div class="border1 team' + m + '" name="使用人姓名" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">使用人姓名</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 3) {
                html += '<div class="border1 team' + m + '" name="使用人工号" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">使用人工号</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 4) {
                html += '<div class="border1 team' + m + '" name="申请原因" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">申请原因</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 5) {
                html += '<div class="border1 team' + m + '" name="备注" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">备注</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 7 == 6) {
                html += '<div class="border1 team' + m + '" name="姓名拼音" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">姓名拼音</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
                m++;
            }
        };
    } else if (data.form_data.TEMPLETEID == '8431699790663205206') {//电脑资产领用单 (资讯类)
        var titleArr = [5,0,1,2,3,4];
        var titleName ='电脑资产领用单 ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);

    }
    else if (data.form_data.TEMPLETEID == '69356868501981685') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined || array[i].name == '是否一级部门' || array[i].name == '部门负责人' || array[i].name == '部门分管领导' || array[i].name == '是否批量预算追加') {
                continue;
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array4.length; i++) {
            if (arrayN1.indexOf(array4[i].name) != -1) {
                if (arrayN1.indexOf(array4[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="预算部门" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算部门</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == arrayN1.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].name == '预算公司1') {
                    html += '<div class="border1 team' + m + '" name="预算公司" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算公司</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].value == '' || array[i].value == undefined) {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                }
            }
        };
    }
    else if (data.form_data.TEMPLETEID == '-2481447930518813670') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined) {
                continue;
            } else if (array[i].name == '原币合计') {
                html += '<div class="border1" name="本币合计" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">本币合计</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                    m++;
                } else if (array2[i].value == '') {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                }
            }
        };
    } else if (data.form_data.TEMPLETEID == '-8526166933915351303') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined) {
                continue;
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                    m++;
                } else if (array2[i].value == '') {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                }
            }
        };
        for (var i = 0; i < array4.length; i++) {
            if (arrayN1.indexOf(array4[i].name) != -1) {
                if (arrayN1.indexOf(array4[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="预算部门" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算部门</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == arrayN1.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].value == '' || array[i].value == undefined) {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                }
            }
        };
    }
    else if (data.form_data.TEMPLETEID == '-2630831528790765999') {//刻制印章申请表(环保集团适用)
        var titleName ='刻制印章申请表(环保集团适用) ';
        parent_node[2].name = '单位性质';
        if(parent_node[6].value == '费用支出类'){
            titleArr = [1,2,20,4,22,6,7,5,15,9,10,8,16,18,23,12,13];
            if(parent_node[8].value == '否' ){  //是否涉及工程及采购
                for (var i=0; i < titleArr.length; i++) {
                    if(i==14){
                        titleArr.splice(i,1);
                    }
                };
            }
            if(parent_node[16].value == '否' ){ //是否涉及人力行政事项
                for (var i=0; i < titleArr.length; i++) {
                    if(i==13){
                        titleArr.splice(i,1);
                    }
                };
            }
        }
        else{
            titleArr = [1,2,20,4,22,6,5,8,16,18,23,19,12,13];
            if(parent_node[8].value == '否' ){  //是否涉及工程及采购
                for (var i=0; i < titleArr.length; i++) {
                    if(i==10){
                        titleArr.splice(i,1);
                    }
                };
            }
            if(parent_node[16].value == '否' ){ //是否涉及人力行政事项
                for (var i=0; i < titleArr.length; i++) {
                    if(i==9){
                        titleArr.splice(i,1);
                    }
                };
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);


    }
    else if (data.form_data.TEMPLETEID == '4477047349290027728') {//地产集团本部印刷名片申请表
        parent_node[20].name= '入职日期';
        var titleArr = [0,17,3,1,2,19,14,4,11,10,20,16,12,9,6,13,8,7,15];
        var titleName ='地产集团本部印刷名片申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '1183073910720184757') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        var titleName ='教育集团本部用车申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7127846378930418551') {//印章使用申请单(环保集团适用) 
        var titleArr = [1,12,4,2,3,7,6,5,8,9];
        var titleName ='印章使用申请单(环保集团适用) ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0,1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-4787472994505833395') {
        var titleArr = [10,8,2,1,3,9,4,5,6,7,17,18];
        var titleName ='刻制印章申请表(环保集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-2477597902101983450') {//项目公司注册变更注销申请表(建设集团适用)
        parent_node[23].name = '监事名单';
        var titleArr = [1,2,3,4,5,6,16,7,8,24,17,18,22,23,19,20,21,9 ,10,11];
        var titleName ='项目公司注册变更注销申请表(建设集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2378321832167490783') {//证照、档案查阅借阅复制审批表(球会适用)
        var titleArr = [1,2,3,4,9,5,6,7,8,12];
        var titleName ='证照、档案查阅借阅复制审批表(球会适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0, 1, 2, 3, 4, 5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5108510239686375320') {//员工代理晋升评估审批表
        var titleArr = [1,2,3,58,4,5,6,7,8,9,10,11,12,13,14,15,18,19,16,17,20,21,59,61,63,64];
        var titleName ='员工代理晋升评估审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '6266852002179400398') {//房管集团入职定薪审批表
        var titleArr = [1,3,62,6,68,14,7,70,69,2,4,82,19,21,64,9,13,11,73,71,8,17,20,15,16,18,63,22,23,24,39,60,41,42,47,61,49,50,55,54,77,44,78,45,57,38,46,40,48,43,51,45,53,56,58,76,84,87,89,91,79,81,31,67,83,33,29,26,72,36,37,86,88,59,34,25,65,93,74,30,35,32];
        var titleName ='房管集团入职定薪审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-5164607092120468978') {//教育集团招聘需求表（集团本部适用）
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（集团本部适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '8965615263629198277') {//教育集团招聘需求表（区域公司适用）
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（区域公司适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '5420151195026278632') {//建设集团转正审批表
        var titleArr = [64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46];
        var titleName ='建设集团转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-4792577248352255299') {//酒店转正审批表
        var titleArr = [64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46];
        var titleName ='酒店转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '3746099944750596287') {//环保集团转正审批表
        var titleArr = [64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46];
        var titleName ='环保集团转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '428353018133170462') {//控股公司/地产集团转正审批表
        var titleArr = [64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46];
        var titleName ='控股公司/地产集团转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-8898173532091432813') {//房管集团转正审批表
        var titleArr = [64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,51];
        var titleName ='房管集团转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-6158724769201109990') {//建设集团离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,17,18,19,20,21,22,25,24];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40];
        }
        var titleName ='建设集团离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '7018452972352720404') {//酒店离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,17,18,19,20,21,22,25,24];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40];
        }
        var titleName ='酒店离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '3221904248626563426') {//房管集团离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,18,19,20,21,22,25,24];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40];
        }
        var titleName ='房管集团离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '2891061226519415778') {//球会离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,18,19,20,21,22,25,24];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40];
        }
        var titleName ='球会离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '7567626790716852654') {//物业拓展业务奖金申请表
        if (parent_node[13].value == '顾问项目'){
            var titleArr = [1,2,3,4,5,6,7,11,12,13,16,17,18,19,8];
        }else if (parent_node[13].value == '全管项目'){
            var titleArr = [1,2,3,4,5,6,7,11,12,13,20,21,16,17,18,19,8];
        }
        var titleName ='物业拓展业务奖金申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,2,1];
        paixu(paixu_arr,packet_size);
    }else if (data.form_data.TEMPLETEID == '6065418671280574130') {//教育集团离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,60,61,2,4,5,9,8,7,6,10,11,12,13,15,14,16,59,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,30,31,32,3,33,50,51,52,53,54];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,60,61,2,4,5,9,8,7,6,10,11,12,13,15,14,16,59,17,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,30,31,32,3,33,50,51,52,53,54];
        }
        var titleName ='教育集团离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '4308213602450164581') {//环保集团离职审批表
        if (parent_node[15].value == '辞职' || parent_node[15].value == '解雇' || parent_node[15].value == '离调' || parent_node[15].value == '自动离职'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,65,18,19,20,21,22,25,24];
        }else if (parent_node[15].value == '合同终止' || parent_node[15].value == '协商解约' || parent_node[15].value == '劝退'){
            var titleArr = [1,2,4,5,9,8,7,6,10,11,12,13,15,14,16,63,17,65,18,19,20,21,22,25,24,27,29,34,35,36,37,38,39,40];
        }
        var titleName ='环保集团离职审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-1608705395936507690') {//建设集团合同续约审批表
        var titleArr = [1,2,4,5,6,7,8,9,10,11,12,13,47,14,15,16,17,20,21,22,23,24,25,26,27,28,29,30,31,19,32,33,34,35,38];
        var titleName ='建设集团合同续约审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-5930606762938905337') {//教育集团转正审批表
        var titleArr = [65,70,64,1,2,3,4,5,6,7,8,9,10,11,49,50,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46];
        var titleName ='教育集团转正审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8097361857290915446') {//项目公司注册变更注销申请表(资本集团适用)
        parent_node[23].name = '监事名单';
        var titleArr = [1,2,3,4,5,6,16,7,8,24,17,18,22,23,19,20,21,9 ,10,11];
        var titleName ='项目公司注册变更注销申请表(资本集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-2665907776892088680') {//刻制印章申请表(资本集团适用)
        var titleArr = [10, 8, 2, 1,3, 9, 4, 5, 6, 7, 15,16,17, 18];
        var titleName ='刻制印章申请表(资本集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2249359686391712670') {//出差申请表(房管集团适用)
        var titleArr = [1,2,3,12,5,8,9,10,13,11,26,27,28,29,30,15,16,33,18,21,19,20,22,17,25,35];
        var titleName ='出差申请表(房管集团适用)';
        var num;
        for (var i = 0; i < parent_node.length; i++) {
            if(parent_node[i].name == '经办人'){
                parent_node[i].name = '填单人';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '是'){
                parent_node[i].value = '紧急订票';
            }
            if(parent_node[i].name == '是否紧急订票' && parent_node[i].value == '否'){
                parent_node[i].value = '普通订票';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '否'){
                parent_node[i].value = '正常出差申请';
            }
            if(parent_node[i].name == '是否后补出差申请' && parent_node[i].value == '是'){
                parent_node[i].value = '后补出差申请';
            }
            else if(parent_node[i].name == '发票抬头top'){
                parent_node[i].name = '发票抬头';
            }else if(parent_node[i].value=='选择'){
                parent_node[i].value = parent_node[i].name;
                parent_node[i].name = '出差交通工具';
            }
            if(parent_node[i].value=='未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);
        html += '<div id="biaoti"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="出差明细"/></div>';
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,12,14,6,7,8,9,10,11,15];
        for (var i = 0; i <  child_nodes.length; i++) {
            if(child_nodes[i].name == '备注'){
                child_nodes[i].name = '时间段/航班号';
            }
        }
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-658714980725537040') {//2018年年中教育集团员工行为评估表（非管理人员）
        var titleArr = [1,2,3,4,5,6,41,42,44,43,7,22,8,23,9,24,10,25,11,26,12,27,13,28,14,29,15,30,16,31,17,32,18,33,19,34,20,35,21,36,37,38];
        var titleName ='2018年年中教育集团员工行为评估表（非管理人员）';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '' ||parent_node[i].value == undefined || parent_node[i].value == '未选择'){
                console.log(i + "------"+ parent_node[i].name );
                for (var j=0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                };
            }
            var str_before = parent_node[i].name.split("_")[0];
            parent_node[i].name = str_before;
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '3043417834255042747') {//并购园/新项目OA体系搭建流程
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
        parent_node[9].name = '【运营/学前】下达OA配置指令';
        parent_node[12].name = '【股东代表】OA审批人资料的提供【需提供附件】/【财务】财务建账';
        parent_node[15].name = '财务】导入预算及系统下放预算';
        parent_node[18].name = '【学前】确认园所类型';
        parent_node[21].name = '【财务】确认财务审核人';
        parent_node[24].name = '【行政】发起OA流程搭建申请';
        parent_node[27].name = '【财务】NC与OA预算规则同步邮件发送';
        parent_node[30].name = '【信息】ESB接口预算设置';
        parent_node[33].name = '【信息】OA系统流程设置';
        var titleName ='并购园/新项目OA体系搭建流程';
        for (var i=0; i < parent_node.length; i++) {
            var reg = new RegExp("^完成日期[0-9]{1}$");
            var reg2 = new RegExp("^备注[0-9]{1}$");
            if(reg.test(parent_node[i].name)){
                parent_node[i].name = '完成日期';
            }
            if(reg2.test(parent_node[i].name)){
                parent_node[i].name = '备注';
            }
        };

        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7985514291684554771') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(地产区域适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);

    }
    else if (data.form_data.TEMPLETEID == '-2902864919182753703') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(雅生活集团本部适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);

    }
    else if (data.form_data.TEMPLETEID == '6357993138212850373') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(雅生活下属单位适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-8936670152228911906') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(教育集团适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5930446063876066708') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(环保集团适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5725566704011856915') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(建设集团适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-8324255150530673992') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(酒店公司适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-3801827220675016577') {
        //个案 概 况
        var titleArr = [1];
        var titleName ='雅居乐互助会个案资助申请电子审批表(球会公司适用)';
        var titleArr = [1,60,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        var titleName ='个案概况';
        html = GrantApplicationForm(titleName,titleArr)
        var titleArr = [32, 33, 34, 35, 36, 37,38];

        var titleName ='会员本人大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [39, 40, 41, 42, 43, 44,45,46];
        var titleName ='近亲属大病手术或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [47,48,49];
        var titleName ='会员本人意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [50,51,52];
        var titleName ='近亲属意外伤残或死亡';
        html = caseDetail(titleName,titleArr);

        var titleArr = [53,54,56,56];
        var titleName ='自然灾害（家庭）';
        html = caseDetail(titleName,titleArr);

        var titleArr = [57,58,59];
        var titleName ='收款人姓名';
        html = caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-4144159433128721696') {//电脑资产申请、调配、调拨、核价、申购、入库单(雅生活板块适用)
        var titleArr = [16,0,1,2,3,4,5,6,7,8,9,11,12,10,13,14,17,18];
        var titleName ='电脑资产申请、调配、调拨、核价、申购、入库单(雅生活板块适用)';
        if(parent_node[11].name == '对应申请申购信息序号n6_n5'){
            parent_node[11].name= '对应申请申购信息序号';
        }
        if(parent_node[12].name == '调配详细信息_n5'){
            parent_node[12].name= '调配详细信息';
        }
        if(parent_node[13].name == '对应申请申购信息序号n8_n7'){
            parent_node[13].name= '对应申请申购信息序号';
        }
        if(parent_node[14].name == '调拨详细信息_n7'){
            parent_node[14].name= '调拨详细信息';
        }
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 32;
        paixu_arr = [1,2,3,17,18,19,20,21,22,23,24,25,26,27,28,29,4,5,6,7,8,9,10,11,12,13,14,15,16];
        var reg = new RegExp("^物品名称_.*$");
        for (var i=0; i < child_nodes.length; i++) {
            if(reg.test(child_nodes[i].name)){
                child_nodes[i].name = '物品名称';
                if(child_nodes[i].value == ''){
                    for (var j=0; j < paixu_arr.length; j++) {
                        if(paixu_arr[j]==i){
                            paixu_arr.splice(j,1);
                        }
                    }
                }
            }
        };
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '2402827834532842356') {//业务系统用户权限申请表
        var titleArr = [1,2,3,4,5,6,7,8,18,19,20,21,22,23,24,25,26,27,28,29,9,10];
        var titleName ='业务系统用户权限申请表';
        var reg = new RegExp("^角色类别_.*$");
        for (var i=0; i < parent_node.length; i++) {
            if(reg.test(parent_node[i].name)){
                parent_node[i].name = '角色类别';
                if(parent_node[i].value == ''){
                    for (var j=0; j < titleArr.length; j++) {
                        if(titleArr[j]==i){
                            titleArr.splice(j,1);
                        }
                    }
                }
            }
        };

        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        var reg = new RegExp("^申请人所需角色_.*$");
        for (var i=0; i < child_nodes.length; i++) {
            if(reg.test(child_nodes[i].name)){
                if(child_nodes[i].value == ''){
                    for (var j=0; j < paixu_arr.length; j++) {
                        if(paixu_arr[j]==i){
                            paixu_arr.splice(j,1);
                        }
                    }
                }
            }
            var str_before = child_nodes[i].name.split("_")[0];
            child_nodes[i].name = str_before;
        };
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '5521390291815648908') {//电脑资产维修单
        var titleArr = [0,1,2,3,4,5,6,7];
        var titleName ='电脑资产维修单 ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,1,2];
        paixu(paixu_arr,packet_size);

    }else if (data.form_data.TEMPLETEID == '1485871202118616080') {//租赁设备消费确认表
        var titleArr = [0,1];
        var titleName ='租赁设备消费确认表 ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 16;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        paixu(paixu_arr,packet_size);

    }
    else if (data.form_data.TEMPLETEID == '2402827834532842356') {//业务服务系统用户权限申请表 (资讯类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined) {
                continue;
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array4.length; i++) {
            if (arrayN1.indexOf(array4[i].name) != -1) {
                if (arrayN1.indexOf(array4[i].name) == 0) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="申请人" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">申请人</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 1) {
                    html += '<div class="border1 team' + m + '" name="姓名拼音" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">姓名拼音</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 2) {
                    html += '<div class="border1 team' + m + '" name="工号(如有)" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">工号(如有)</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 3) {
                    html += '<div class="border1 team' + m + '" name="是否正式员工" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">是否正式员工</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 4) {
                    html += '<div class="border1 team' + m + '" name="使用人岗位" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">使用人岗位</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 5) {
                    html += '<div class="border1 team' + m + '" name="使用人参与项目" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">使用人参与项目</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == 6) {
                    html += '<div class="border1 team' + m + '" name="申请类别" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">申请类别</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else {
                    if (array4[i].value != '') {
                        html += '<div class="border1 team' + m + '" name="申请人所需角色" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">申请人所需角色</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                        m++;
                    } else {
                        continue;
                    }
                }
            }
        };
    } else if (data.form_data.TEMPLETEID == '69356868501981685') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined || array[i].name == '是否一级部门' || array[i].name == '部门负责人' || array[i].name == '部门分管领导' || array[i].name == '是否批量预算追加') {
                continue;
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array4.length; i++) {
            if (arrayN1.indexOf(array4[i].name) != -1) {
                if (arrayN1.indexOf(array4[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="预算部门" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算部门</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == arrayN1.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].name == '预算公司1') {
                    html += '<div class="border1 team' + m + '" name="预算公司" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算公司</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].value == '' || array[i].value == undefined) {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                }
            }
        };
    } else if (data.form_data.TEMPLETEID == '2610833768477380209') {//通用信息服务申请单 (咨询类 )
        var arr1 = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined || array[i].name == '财务核对人员' || array[i].name == '发起者单位' || array[i].name == 'AD账号' || array[i].name == '中心部门' || array[i].name == '汇率' || array[i].name == '是否一级部门' || array[i].name == '是否有分管负责人' || array[i].name == '会计所属公司编码' || array[i].name == '是否区域公司负责人' || array[i].name == '报销人是否有财务审批权限  ' || array[i].name == '金额_原币合计' || array[i].name == '税金_原币合计' || array[i].name == '单据类型' || array[i].name == '是否超一个月' || array[i].name == '是否有财务负责人' || array[i].name == '财务负责人') {
                continue;
            } else if (i == 45) {
                var arr = array[i].value.split(" ");
                arr1 = uniq2(arr);
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < arr1.length; i++) {
            if (i % 28 == 0) {
                html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                html += '<div class="border1 team' + m + '" name="报销类型" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">报销类型</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 1) {
                html += '<div class="border1 team' + m + '" name="报销人/收款单位编号" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">报销人/收款单位编号</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 2) {
                html += '<div class="border1 team' + m + '" name="报销人/收款单位名称" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">报销人/收款单位名称</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 3) {
                html += '<div class="border1 team' + m + '" name="会计科目" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">会计科目</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 4) {
                html += '<div class="border1 team' + m + '" name="金额" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">金额</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 5) {
                html += '<div class="border1 team' + m + '" name="费用发生日期" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">费用发生日期</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 6) {
                html += '<div class="border1 team' + m + '" name="用途或原因" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">用途或原因</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 7) {
                html += '<div class="border1 team' + m + '" name="费用中心" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">费用中心</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 8) {
                html += '<div class="border1 team' + m + '" name="支付方式" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">支付方式</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 9) {
                html += '<div class="border1 team' + m + '" name="费用归属公司代码" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">费用归属公司代码</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 10) {
                html += '<div class="border1 team' + m + '" name="费用归属公司" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">费用归属公司</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 11) {
                html += '<div class="border1 team' + m + '" name="备注" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">备注</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 12) {
                html += '<div class="border1 team' + m + '" name="80102误餐费" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">80102误餐费</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 13) {
                html += '<div class="border1 team' + m + '" name="追加金额" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">追加金额</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 14) {
                html += '<div class="border1 team' + m + '" name="预算总金额" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">预算总金额</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 15) {
                html += '<div class="border1 team' + m + '" name="截至目前已使用金额" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">截至目前已使用金额</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 16) {
                html += '<div class="border1 team' + m + '" name="剩余金额" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">剩余金额</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 17) {
                html += '<div class="border1 team' + m + '" name="百分比" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">百分比</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 24) {
                html += '<div class="border1 team' + m + '" name="序号" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">序号</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 26) {
                html += '<div class="border1 team' + m + '" name="发票类型" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">发票类型</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
            } else if (i % 28 == 27) {
                html += '<div class="border1 team' + m + '" name="税率" value="' + arr1[i] + '"><div class="content-l" value="' + arr1[i] + '">税率</div><div class="content-r" value="' + arr1[i] + '">' + arr1[i] + '</div></div>';
                m++;
            } else {
                continue;
            }
        };
    } else if (data.form_data.TEMPLETEID == '-2481447930518813670') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined) {
                continue;
            } else if (array[i].name == '原币合计') {
                html += '<div class="border1" name="本币合计" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">本币合计</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                    m++;
                } else if (array2[i].value == '') {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                }
            }
        };
    } else if (data.form_data.TEMPLETEID == '-8526166933915351303') {// 预算解锁调整审批单(预算管控类)
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == '' || array[i].value == undefined) {
                continue;
            } else {
                html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
            }
        };
        for (var i = 0; i < array2.length; i++) {
            if (arrayN.indexOf(array2[i].name) != -1) {
                if (arrayN.indexOf(array2[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                } else if (arrayN.indexOf(array2[i].name) == arrayN.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                    m++;
                } else if (array2[i].value == '') {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array2[i].name + '" value="' + array2[i].value + '"><div class="content-l" value="' + array2[i].value + '">' + array2[i].name + '</div><div class="content-r" value="' + array2[i].value + '">' + array2[i].value + '</div></div>';
                }
            }
        };
        for (var i = 0; i < array4.length; i++) {
            if (arrayN1.indexOf(array4[i].name) != -1) {
                if (arrayN1.indexOf(array4[i].name) == 1) {
                    html += '<div class="border1" name="editTeam" count="1" value="' + m + '"><span class="munTeam">第' + m + '组</span><img src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></div>';
                    html += '<div class="border1 team' + m + '" name="预算部门" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">预算部门</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                } else if (arrayN1.indexOf(array4[i].name) == arrayN1.length - 1) {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                    m++;
                } else if (array4[i].value == '' || array[i].value == undefined) {
                    continue;
                } else {
                    html += '<div class="border1 team' + m + '" name="' + array4[i].name + '" value="' + array4[i].value + '"><div class="content-l" value="' + array4[i].value + '">' + array4[i].name + '</div><div class="content-r" value="' + array4[i].value + '">' + array4[i].value + '</div></div>';
                }
            }
        };
    }
    else if (data.form_data.TEMPLETEID == '-874234715885845643') {//二次开发工作量确认审批表
        var titleArr = [18,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,19,20,16,17];
        var titleName ='二次开发工作量确认审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '-1794858838503242751') {//香港业主客户拒收通知单
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        var titleName ='香港业主客户拒收通知单';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-3262929075556103983') {//电子业务流程搭建/变更申请单
        var titleArr = [0,22,1,3,4,5,2,8,7,6,17,18,19,20,9,10,11,12];
        var titleName ='电子业务流程搭建/变更申请单';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
            if(parent_node[i].value == '选择'){
                parent_node[i].value = parent_node[i].name;
                parent_node[i].name  = '需调整的IT系统';
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-7383628129068956204') {//控股公司电脑资产报废申请单
        var titleArr = [1,2,3,4,5,6,7,8,9,12,13,14,16,15];
        var titleName ='控股公司电脑资产报废申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 14;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        paixu(paixu_arr,packet_size);
    }else if (data.form_data.TEMPLETEID == '6783254089728410802') {//IT项目立项确认单
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
        var titleName ='IT项目立项确认单';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-656673282741353770') {//IT项目上线确认单
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
        var titleName ='IT项目上线确认单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '3524333937175606019') {//系统、网络、业务软件变更申请单
        var titleArr = [0,2,3,4,5,8,7,6,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
        var titleName ='系统、网络、业务软件变更申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-27706712005587791') {//办公室资讯相关弱电工程（布线、联网）数据采集单
        var titleArr = [0,21,1,3,4,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        var titleName ='办公室资讯相关弱电工程（布线、联网）数据采集单 ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '2402827834532842356') {//业务系统用户权限申请表
        var titleArr = [1,2,3,4,5,6,7,8,18,19,20,21,22,23,24,25,26,27,28,29,9,10];
        var titleName ='业务系统用户权限申请表';
        var reg = new RegExp("^角色类别_.*$");
        for (var i=0; i < parent_node.length; i++) {
            if(reg.test(parent_node[i].name)){
                parent_node[i].name = '角色类别';
                if(parent_node[i].value == ''){
                    for (var j=0; j < titleArr.length; j++) {
                        if(titleArr[j]==i){
                            titleArr.splice(j,1);
                        }
                    }
                }
            }
        };

        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 20;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        var reg = new RegExp("^申请人所需角色_.*$");
        for (var i=0; i < child_nodes.length; i++) {
            if(reg.test(child_nodes[i].name)){
                if(child_nodes[i].value == ''){
                    for (var j=0; j < paixu_arr.length; j++) {
                        if(paixu_arr[j]==i){
                            paixu_arr.splice(j,1);
                        }
                    }
                }
            }
            var str_before = child_nodes[i].name.split("_")[0];
            child_nodes[i].name = str_before;
        };
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-2309371973343755808') {//法律服务调查问卷
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var titleName ='法律服务调查问卷';
        html = xz_MainNodes_1(titleName , titleArr);
    }else if (data.form_data.TEMPLETEID == '-6534540451007414205') {//信息部信息系统帐户异动（变更、离调职）处理工作单 
        var titleArr = [22,24,25,26,29,28,27,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,5,4,3];
        var titleName ='信息部信息系统帐户异动（变更、离调职）处理工作单 ';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '3930131715878699830') {
        var titleArr = [1,3,4,5,6,7,8,9,10,11,12,13,14];
        var titleName ='费用补助申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-8496025580265519391') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,12];
        var titleName ='人员编制调整申请表（产业板块）';
        if(parent_node[12].value == '增' ){
            parent_node[5].value = '增'+parent_node[5].value+'人';
        }else{
            parent_node[5].value = '减'+parent_node[5].value+'人';
        }
        if(parent_node[13].value == '增' ){
            parent_node[6].value = '增'+parent_node[6].value+'元';
        }else{
            parent_node[6].value = '减'+parent_node[6].value+'元';
        }

        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-3870253333101327465') {
        var titleArr = [1,3,4,5,6,7,8,9,10,11,12];
        var titleName ='教育系统人事定编/增编审批流程';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-1127717546106011415') {
        var titleArr = [1,3,4,5,6,7];
        var titleName ='雅生活投委会审核意见表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8922205370062031803') {
        var titleArr = [1,2,9,10,11,12,13,14,15,16,17,5,18,19,20,21,22,23,24,25,26,6,27,28,29,30,31,32,33,34,35,36];
        var titleName ='招拍挂项目启动单(适用单项目)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7119516754335742861') {
        var titleArr = [1,2,9,10,11,13,14,15,16,12,5,17,18,19,20,21,22,6,24,25,23,26,27,7];
        var titleName ='收并购项目启动单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8084993790838589033') {//教育集团入职定薪审批表（下属办学机构适用）
        var titleArr = [1,2,91,92,90,5,11,6,95,7,9,10,61,8,55,12,13,14,59,60,15,16,17,18,19];
        var titleName ='教育集团入职定薪审批表（下属办学机构适用） ';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        if(child_nodes.length > 0){
            paixu_arr = [6,0,1,2,3,4,5];
            packet_size = 9;
            var titlt_name='学历情况';
            title_paixu(paixu_arr,packet_size,titlt_name);
        }
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        if(child_nodes.length >0){
            paixu_arr = [0,1,2,6,7,8,3];
            packet_size = 9;
            var titlt_name='职称情况 ';
            title_paixu(paixu_arr,packet_size,titlt_name);
        }
        var nodesName = '组6';
        xz_xml_2(data_xml_2,nodesName);
        if(child_nodes.length >0){
            paixu_arr = [0,1,2,3,4,5];
            packet_size = 8;
            var titlt_name='专业技术资格（资格证） ';
            title_paixu(paixu_arr,packet_size,titlt_name);
        }
        if(parent_node[91].value == '中小学' ||parent_node[91].value == '高等学院'){
            var titleName = '建议薪酬 （教师类）';
            var titleArr =[35,36,54,37,38,39,40];
            caseDetail(titleName,titleArr);
            var titleName = '建议薪酬（管理行政后勤类）';
            var titleArr = [41,42,43,44,45,46,47,48];
            caseDetail(titleName,titleArr);
        }
        if(parent_node[91].value == '幼儿园' || parent_node[91].value == '培训公司'){
            var titleName = '建议薪酬（保教保育类）';
            var titleArr =[77,78,79,80,81,82,83,84,85,86,87];
            caseDetail(titleName,titleArr);
            var titleName = '建议薪酬（后勤类）';
            var titleArr = [69,70,71,72,73,74,75,76];
            caseDetail(titleName,titleArr);
        }
    }
    else if (data.form_data.TEMPLETEID == '-5643615812530388789') {
        var titleArr = [1,36,2,3,4,5,6,8,9,10,11,19,13,21,15,23,17,25,39,41,45,46,43,44,27,28,29,30,31,32,33,34];
        var titleName ='员工内部异动审批表（下属办学机构适用）';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '1159662951455280498') {
        var titleArr = [1,2,4,158,5,125,6,7,8,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,66];
        var titleName ='雅居乐集团控股公司_'+parent_node[4].value+'_'+parent_node[5].value+'审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        if(parent_node[67].value == '一般晋升' || parent_node[67].value == '岗位代理'){
            var titleName = '晋升审批';
            var titleArr = [69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111];
            caseDetail(titleName,titleArr);
        }
        if(parent_node[68].value == '调薪'){
            var titleName = '调薪审批';
            var titleArr = [112,113,114,115,116,117,118,119,120,121];
            caseDetail(titleName,titleArr);
        }

    }
    else if (data.form_data.TEMPLETEID == '-4092482431612598656') {
        var titleArr = [1,3,55,5,58,13,6,107,59,2,4,108,8,10,12,113,14,15,16,17,18,104,19,20,118,22,106,7];
        var titleName ='酒店入职定薪单审批表';
        parent_node[108].name = '工作所在地';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '录入待遇';
        var titleArr = [76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,61];
        caseDetail(titleName,titleArr);
    }

    else if (data.form_data.TEMPLETEID == '-4092482431612598656') {
        var titleArr = [1,3,55,5,58,13,6,107,59,2,4,108,8,10,12,113,14,15,16,17,18,104,19,20,21,22,106,7];
        var titleName ='酒店入职定薪单审批表';
        parent_node[108].name = '工作所在地';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '录入待遇';
        var titleArr = [76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,61];
        caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5807601856324613213') {
        var titleArr = [1,3,55,5,58,13,6,109,107,59,2,4,108,8,10,12,113,14,15,16,17,18,104,19,20,21,22,106,7];
        var titleName ='球会入职定薪单审批表';
        parent_node[108].name = '工作所在地';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '录入待遇';
        var titleArr = [76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,61];
        caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7089512554951492122') {
        var titleArr = [1,3,55,5,58,13,6,107,59,2,4,115,108,8,10,12,113,14,15,16,17,18,104,19,20,21,22,106,7];
        var titleName ='环保集团入职定薪单审批表';
        parent_node[108].name = '工作所在地';
        parent_node[115].name = '流程类别';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '录入待遇';
        var titleArr = [76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,61];
        caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '855359473310387379') {
        var titleArr = [1,3,55,113,119,5,58,13,6,107,59,120,2,4,108,8,10,12,113,14,15,16,17,18,104,19,20,21,22,106,7];
        var titleName ='教育集团入职定薪审批表（集团本部适用）';
        parent_node[108].name = '工作所在地';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '录入待遇';
        var titleArr = [76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,61];
        caseDetail(titleName,titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-190870791779168803') {
        var titleArr = [1,3,55,5,58,13,6,107,59,2,4,109,108,8,10,12,14,15,16,17,18,104,19,20,21,22,106,7];
        var titleName ='建设集团入职定薪单审批表';
        parent_node[108].name = '工作所在地';
        html = xz_MainNodes_1(titleName , titleArr);
        var titleName = '薪酬';
        var titleArr = [90,91,93,94,97,98,100,101,48,47,39,45,50,36,42,92,99,49,95,102,96,103,61];
        caseDetail(titleName,titleArr);
    }

    else if (data.form_data.TEMPLETEID == '4179526454036679339') {
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（培训公司适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7624447151855483675') {
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（下属幼儿园适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '4567253281011942560') {
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（产业公司适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-2585185765854655041') {
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（下属高校适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8344139281869851936') {
        var titleArr = [1,2,3,4,5,6,7,8,10,14,11,12,13];
        var titleName ='教育集团招聘需求表（下属中小学适用）';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5376524854344791045' || data.form_data.TEMPLETEID == '7576500340886750966' || data.form_data.TEMPLETEID == '6995207945023931929' ||data.form_data.TEMPLETEID == '-4132318165625910616' || data.form_data.TEMPLETEID == '5799560426336701530') {
        if(data.form_data.TEMPLETEID == '6995207945023931929'){
            var titleName ='环保集团员工调动借调申请表(跨业务板块)';
        }
        if(data.form_data.TEMPLETEID == '-4132318165625910616'){
            var titleName ='教育集团员工调动借调申请表(跨业务板块)';
        }
        if(data.form_data.TEMPLETEID == '5799560426336701530'){
            var titleName ='房管集团员工调动借调申请表(跨业务板块)';
        }
        if(data.form_data.TEMPLETEID == '7576500340886750966'){
            var titleName ='球会员工调动借调申请表(跨业务板块)';
        }
        if(data.form_data.TEMPLETEID == '-5376524854344791045'){
            var titleName ='酒店员工调动借调申请表(跨业务板块)';
        }

        if(parent_node[2].value == '借调'){
            var titleArr = [1,2,3,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,38,40,41];
            html = xz_MainNodes_1(titleName , titleArr);
        }
        if(parent_node[2].value == '调动'){
            var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,38,40,41];
            html = xz_MainNodes_1(titleName , titleArr);
            if(parent_node[6].value == '是'){
                var titleName = '人岗匹配度评估';
                var titleArr = [42,43,44,46,47,48,49,50,52,54,55,56,58,59,60,61,62,63,64,45,51,57,63,65,68,66,67];
                caseDetail(titleName,titleArr);
            }
            if(parent_node[7].value == '是'){
                var titleName = '任职资格';
                var titleArr = [69,70,71,72,73,74,75,76,77];
                caseDetail(titleName,titleArr);

                var titleName = '历史绩效记录';
                var titleArr = [78,79,80,81,82,83];
                caseDetail(titleName,titleArr);

                var titleName = '转岗职位与薪酬建议';
                var titleArr = [84,85,86,87,88,89,90,91,131,132,133,134,135,136,137,138,139,92,93,94,95];
                caseDetail(titleName,titleArr);
            }
        }
    }
    else if (data.form_data.TEMPLETEID == '5511888274435096869' || data.form_data.TEMPLETEID == '-8504442201459374532' || data.form_data.TEMPLETEID == '-5499618933977234770' || data.form_data.TEMPLETEID == '1673335578676577715' || data.form_data.TEMPLETEID == '-1365219085078413042') {
        if(data.form_data.TEMPLETEID == '5511888274435096869'){
            var titleName ='环保集团员工调动借调申请表(同业务板块)';
        }
        if(data.form_data.TEMPLETEID == '-8504442201459374532'){
            var titleName ='建设集团员工调动借调申请表(同业务板块)';
        }
        if(data.form_data.TEMPLETEID == '-5499618933977234770'){
            var titleName ='球会员工调动借调申请表(同业务板块)';
        }
        if(data.form_data.TEMPLETEID == '1673335578676577715'){
            var titleName ='酒店员工调动借调申请表(同业务板块)';
        }
        if(data.form_data.TEMPLETEID == '-1365219085078413042'){
            var titleName ='房管集团员工调动借调申请表(同业务板块)';
        }
        if(parent_node[2].value == '借调'){
            var titleArr = [1,2,3,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,38,40,41];
            html = xz_MainNodes_1(titleName , titleArr);
        }
        if(parent_node[2].value == '调动'){
            var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,38,40,41];
            html = xz_MainNodes_1(titleName , titleArr);
            if(parent_node[6].value == '是'){
                var titleName = '人岗匹配度评估';
                var titleArr = [42,43,44,46,47,48,49,50,52,54,55,56,58,59,60,61,62,63,64,45,51,57,63,65,68,66,67,124];
                caseDetail(titleName,titleArr);
            }
            if(parent_node[7].value == '是'){
                var titleName = '任职资格';
                var titleArr = [69,70,71,72,73,74,75,76,77];
                caseDetail(titleName,titleArr);

                var titleName = '历史绩效记录';
                var titleArr = [78,79,80,81,82,83];
                caseDetail(titleName,titleArr);

                var titleName = '转岗职位与薪酬建议';
                var titleArr = [84,85,86,87,88,89,90,91,141,142,143,144,145,146,147,92,93,94];
                caseDetail(titleName,titleArr);
            }
        }
    }
    else if (data.form_data.TEMPLETEID == '403481686562849125') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        var titleName ='员工购房物业代理车位优惠审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7274475742455379208') {
        var titleArr = [1,2,3,9,4,10,5,6,7,8];
        var titleName ='微信号申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7319164953578849490') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        var titleName ='社会公益类捐款或活动参与审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5003935862750688344') {
        var titleArr = [1,4,5,2,3,6,7,8,9,10,11,12,13,14,15,16];
        var titleName ='员工外派审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '6638420307717212252') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12];
        var titleName ='内部快件派送单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0,1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '493304544306545058') {
        var titleArr = [12,13,15,7,8,10];
        var titleName ='投资类合同审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '7465900939312120462') {
        var titleArr = [1,10,11,14,13,4,7,8,12];
        var titleName ='投资类资金计划审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 7;
        paixu_arr = [0,1,2,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '2915412076924061890') {
        var titleArr = [1,10,11,14,13,4,7,8,12];
        var titleName ='投资类资金计划审批表（城市更新部）';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 7;
        paixu_arr = [0,1,2,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3752297750746478419') {
        var titleArr = [1,10,11,14,13,4,7,8,12];
        var titleName ='投资类资金计划审批表(房管集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 7;
        paixu_arr = [0,1,2,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '5371632642273263687') {
        var titleArr = [1,2,3,4,5,6,11,12,7,8,9,10];
        var titleName ='教育集团投资项目资金计划审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 7;
        paixu_arr = [0,1,2,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-4766244538045218402') {
        var titleArr = [1,10,11,14,13,4,7,8,12];
        var titleName ='投资类合同审批表（城市更新部）';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 1;
        paixu_arr = [0];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '1011286993045178651') {
        var titleArr = [12,13,15,7,8,10];
        var titleName ='投资类合同审批表(房管集团适用)';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 1;
        paixu_arr = [0];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5758999397150799411') {
        if(parent_node[35].value == "管理人员"){
            var titleArr = [1,2,3,4,5,6,7,8,9,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,28,29,30,31,32,33];
        }
        else{
            var titleArr = [1,2,3,4,5,6,7,8,9,35,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];
        }
        var titleName ='新员工回访问卷表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '1994671699505660597') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116];
        var titleName ='工伤保险待遇审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '392266959200144919') {
        if(parent_node[35].value == "建议调薪"){
            var titleArr = [1,2,3,6,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,27,28,29,30,31,32,33,34,35,47,48,36,37];
        }else{
            var titleArr = [1,2,3,6,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,27,28,29,30,31,32,33,34,35,36,37];
        }

        var titleName ='退休与退休返聘审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '4795206753081247147') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var titleName ='工程款抵扣物业内部自住资格审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2247600476079082875') {
        var titleArr = [0,1,5,2,6,8,9,3,4,7,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,28,26,27,29,31,34,36,37,38,32,35,39,40,41,33,42,43,44,45,30,46,47];
        var titleName ='商业汇票开票申请单';
        var reg = new RegExp("^票面金额[0-9]{1}$");
        var reg2 = new RegExp("^开票手续费率[0-9]{1}$");
        var reg3 = new RegExp("^预计贴现率[0-9]{1}$");
        var reg4 = new RegExp("^公司承担费率[0-9]{1}$");
        var reg5 = new RegExp("^公司承担贴现费[0-9]{1}$");
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].name == "保证金1"){
                parent_node[i].name = "保证金";
            }
            if(parent_node[i].name == "金额合计"){
                parent_node[i].name = "开票明细金额合计";
            }
            if(reg.test(parent_node[i].name)){
                parent_node[i].name = '票面金额';
            }
            if(reg2.test(parent_node[i].name)){
                parent_node[i].name = '开票手续费率';
            }
            if(reg3.test(parent_node[i].name)){
                parent_node[i].name = '预计贴现率';
            }
            if(reg4.test(parent_node[i].name)){
                parent_node[i].name = '公司承担费率';
            }
            if(reg5.test(parent_node[i].name)){
                parent_node[i].name = '公司承担贴现费';
            }
            if(parent_node[i].value == '未选择' && parent_node[i].name == '保证金'){
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==16){
                        titleArr.splice(j,4);
                    }
                }
            }
            if(parent_node[i].value == '未选择' && parent_node[i].name == '保证'){
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==20){
                        titleArr.splice(j,4);
                    }
                }
            }
            if(parent_node[i].value == '未选择' && parent_node[i].name == '抵押'){
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==24){
                        titleArr.splice(j,3);
                    }
                }
            }
            if(parent_node[i].value == '未选择' && parent_node[i].name == '质押'){
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==26){
                        titleArr.splice(j,3);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组14';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0,1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '4356633934334411165') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11];
        var titleName ='微信公众号信息发布审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-1192552355850794725') {
        var titleArr = [1,2,3,4,5,6,7,13,12,9,10,11];
        var titleName ='公司网站信息更新审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5470535563465440824') {
        var titleArr = [1,2,3,4,5,6,8,7,13,12,9,10,11,14,15,16];
        var titleName ='公司网站信息更新审批单(OA机器人)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '4526461095234913940') {
        if(parent_node[1].value == '收入证明'){
            var titleArr = [0,1,2,3,4,5,6,7,8,9,10,11,12];
        }else{
            var titleArr = [0,1,2,3,4,5,6,7,8,9];
        }
        var titleName ='开具在职收入证明申请单';
        parent_node[9].value=parent_node[16].value;
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5870995136758987530') {
        if(parent_node[10].value == '费用支出类(固定资产)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '费用支出类(非固定资产)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '费用支出类(行政及制度性)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,16,17,11,12,18];
        }
        if(parent_node[10].value == '非费用支出类'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '外管酒店奖励费用'){
            var titleArr = [1,2,3,4,6,7,9,5,10,17,11,12,18];
        }
        var titleName ='建筑科技集团请示审批单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '3217847529120155934') {
        if(parent_node[10].value == '费用支出类'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '非费用支出类'){
            console.log("kaishi '")
            var titleArr = [1,2,3,4,6,7,9,5,10,16,17,11,12,18];
        }
        if(parent_node[10].value == '费用支出类(固定资产)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '费用支出类(非固定资产)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,8,14,15,17,11,12,18];
        }
        if(parent_node[10].value == '费用支出类(行政及制度性)'){
            var titleArr = [1,2,3,4,6,7,9,5,10,16,17,11,12,18];
        }
        if(parent_node[10].value == '外管酒店奖励费用'){
            var titleArr = [1,2,3,4,6,7,9,5,10,17,11,12,18];
        }
        var titleName ='建筑科技集团请示审批单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
        var titleName ='地产/酒店/球会系统请示审单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5448538813086675387') {
        var titleArr = [1,2,3];
        var titleName ='部门服务满意度调查问卷2018版';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 13;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-4338238018367240136') {
        var titleArr = [1,2,3,21,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        var titleName ='按揭银行合作准入评估表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-8873639855762420487') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12];
        var titleName ='项目网站信息更新审批单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7893806335233537274') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        var titleName ='提前收楼申请单审批单';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-5122204389724372470') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,40,41,42,43,45,47];
        var titleName ='工程施工单位新引进状态变更申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-1289057161592355566') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        var titleName ='物业入伙时间调整申报表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 16;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3480404682906450621') {
        var titleArr = [1,2,3,4,5,6,7,8,9];
        var titleName ='物业入伙时间调整申报汇总表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '5627073824110497667') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,39,28,40,29,41,30,42,31,43,32,44,33,45,34,46,35,47,36,48,37,49,38];
        var titleName ='物业极致系统数据导出申请表';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6922812097573665408') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11];
        var titleName ='雅居乐智慧社区平台信息发布审批单';
        html = xz_MainNodes_1(titleName , titleArr);

    }
    else if (data.form_data.TEMPLETEID == '8630454728231108645') {
        var titleArr = [0,46,2,3,45,4];
        var titleName ='银行借款支取审批表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组6';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 13;
        paixu_arr = [0,12,1,2,3,4,5,6,7,8,9,10,11];
        for (var i=0; i < child_nodes.length; i++) {
            if(child_nodes[i].value == '未选择'){
                num = i;
                for (var j = 0; j < paixu_arr.length; j++) {
                    if(paixu_arr[j]==i){
                        paixu_arr.splice(j,1);
                    }
                }
            }
        };
        paixu(paixu_arr,packet_size);
        var titleArr = [6,7,8,9,10,11,12,13,14,15,16,17];
        html = xz_MainNodes_M(titleArr);
        var nodesName = '组14';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
        var titleArr = [18,19,22,20,21,23,24,38,39,40,26,25,41,42,43];
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_M(titleArr);
        var nodesName = '组18';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
        paixu(paixu_arr,packet_size);
        var titleArr = [28,29,30];
        html = xz_MainNodes_M(titleArr);

    }
    else if (data.form_data.TEMPLETEID == '-4652012989063344379') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,36,37,38,13,14,15,16,17,18,19,12,30,31,32,33,34,35,22,23,24,25,26,39,40];
        var titleName ='银行借款支取审批表(境外)';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组6';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
        var nodesName = '组8';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
        var titleArr = [27,28,29];
        html = xz_MainNodes_M(titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8260284939359111460') {
        var titleArr = [1,2,3,4];
        var titleName ='项目内部员工人力成本归属变动申请表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        for (var i=0; i < child_nodes.length; i++) {
            if(child_nodes[i].name == '原人力成本归属_人力成本占比'){
                child_nodes[i].value = child_nodes[i].value +"%";
            }
            if(child_nodes[i].name == '变动后人力成本归属_人力成本占比'){
                child_nodes[i].value = child_nodes[i].value +"%";
            }
        };
        packet_size = 9;
        paixu_arr = [0,1,2,3,4,5,6,7,8];
        paixu(paixu_arr,packet_size);
        var titleArr = [5,6];
        parent_node[5].value = parent_node[5].value+"%";
        parent_node[6].value = parent_node[6].value+"%";
        html = xz_MainNodes_M(titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-3650285579175769483') {
        var titleArr = [1,13,16,15,2,3,7,4,5,8,17,6];
        var titleName ='电商退款申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7619092590758480360') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,15,18,16,19,20];
        var titleName ='供货计划新增调整申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8906069632815809611') {
        var titleArr = [1,15,18,17,16,2,3,4,6,13,14,7,5,8,10,11,12,9];
        var titleName ='电商费用豁免申请表';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        };
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8486999027836994734') {
        var titleArr = [5,4,6,2,1,7,8,11,10,9,12,13,14,15,16,17,18,19,20,3];
        var titleName ='价单初始定价审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2813001447852166432') {
        var titleArr = [5,4,6,2,1,7,8,11,10,9,3];
        var titleName ='价单优惠政策审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '479845070585416761') {
        var titleArr = [5,4,6,2,1,7,8,11,10,9,12,13,14,15,16,17,3];
        var titleName ='价单调价审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5866499600456108036') {
        var titleArr = [1,2,3,4,5,6,7,8,9];
        var titleName ='雅居乐地产销售定价盈利预测需求单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 35;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];
        paixu(paixu_arr,packet_size);
        var titleArr = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
        html = xz_MainNodes_M(titleArr);

        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 21;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-8833425021841749599') {
        if(parent_node[25].value == '是'){
            var titleArr = [1,30,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
        }else{
            var titleArr = [1,30,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,29];
        }
        var titleName ='直管商业解约协议业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-8442466091553177478') {
        if(parent_node[25].value == '是'){
            var titleArr = [1,30,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
        }else{
            var titleArr = [1,30,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,29];
        }
        var titleName ='社区商业解约协议业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7204706028765334066') {
        if(parent_node[109].value == '场地租赁'){
            var titleArr =[1,4,2,107,108,109];
            titleArr = titleArr.concat(3,4,5,6,26,27,28,29);
            if(parent_node[4].value == '集中式商业' ||parent_node[4].value == '社区商业'){
                titleArr = titleArr.concat(30,31,32,33,34,35,36,37);
            }
            if(parent_node[4].value == '写字楼'){
                titleArr =  titleArr.concat(33,34,35,36,37);
            }
            titleArr.concat(38);
            if(parent_node[38].value == '有'){
                titleArr =  titleArr.concat(39,40,41,42,43);
            }
            if(parent_node[38].value == '无'){
                titleArr = titleArr.concat(43);
            }
            titleArr =  titleArr.concat(44);
            if(parent_node[44].value == '固定租金'){
                titleArr = titleArr.concat(45,46,49,50,51,52,53,54,55);
            }
            if(parent_node[44].value == '固定租金+扣点'){
                titleArr = titleArr.concat(45,46,47,48,49,50,51,52,53,54,55);
            }
            if(parent_node[44].value == '扣点纯'){
                titleArr =  titleArr.concat(47,48,49,50,51,52,53,54,55);
            }
            if(parent_node[55].value == '是'){
                titleArr = titleArr.concat(56,57,58,59,60,103,105);
            }
            if(parent_node[55].value == '否'){
                titleArr =  titleArr.concat(112,12,113);
                if(parent_node[113].value == '是'){
                    titleArr =   titleArr.concat(114);
                }
                titleArr = titleArr.concat(56,57,58,59,60,103,105);
            }

        }
        if(parent_node[109].value == '临时场地租赁'){
            var titleArr =[1,7,2,107,108,109];
            titleArr = titleArr.concat(8,9,10,11,61,62,63,64,65,66,67,68,69,70);
            if(parent_node[70].value == '固定租金'){
                titleArr = titleArr.concat(71,72,73,74,77,78,79);
            }
            if(parent_node[44].value == '固定租金+扣点'){
                titleArr = titleArr.concat(71,72,73,74,75,76,77,78,79);
            }
            if(parent_node[44].value == '扣点纯'){
                titleArr =  titleArr.concat(75,76,77,78,79);
            }
            if(parent_node[79].value == '否'){
                titleArr =  titleArr.concat(110);
            }
            titleArr =  titleArr.concat(80,81,82,83,103,104,105);
            if(parent_node[104].value == '非标准化合同'){
                titleArr = titleArr.concat(106);
            }
        }
        if(parent_node[109].value == '广告位租赁'){
            var titleArr =[1,7,2,107,108,109,13,14,15,18,19,20,21,22,23,24,16,17,25,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98];
            if(parent_node[98].value == '否'){
                titleArr =  titleArr.concat(111);
            }
            for (var i=0; i < parent_node.length; i++) {
                if(parent_node[i].value == '未选择'){
                    num = i;
                    for (var j = 0; j < titleArr.length; j++) {
                        if(titleArr[j]==i){
                            titleArr.splice(j,1);
                        }
                    }
                }
            };
            titleArr =  titleArr.concat(99,100,101,103,103,104,105);
            if(parent_node[104].value == '非标准化合同'){
                titleArr = titleArr.concat(106);
            }
        }
        var titleName ='直管商业解约协议业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);

    }
    else if (data.form_data.TEMPLETEID == '3621650583653466940') {
        var titleArr =[1,46,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,19];
        if(parent_node[19].value == '有'){
            titleArr =  titleArr.concat(23,24,25,26);
        }
        titleArr = titleArr.concat(27,28);
        if(parent_node[28].value == '固定租金'){
            titleArr = titleArr.concat(29,44,32,33,34,35,36);
        }
        if(parent_node[28].value == '固定租金+扣点'){
            titleArr = titleArr.concat(29,44,30,31,32,33,34,35,36);
        }
        if(parent_node[28].value == '扣点纯'){
            titleArr =  titleArr.concat(30,31,32,33,34,35,36);
        }
        titleArr = titleArr.concat(45);
        if(parent_node[36].value == '是'){
            titleArr = titleArr.concat(43);
        }
        titleArr = titleArr.concat(37,38,39,40,41,42);
        var titleName ='直管商业租赁意向书业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '7687521016149854190') {
        var titleArr =[1,15,5,2,3,4,6,7,8,9,10,11,12,13,14];
        var titleName ='直管商业租赁合同补充协议审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '6989258234991823232') {
        var titleArr =[1,15,5,2,3,4,6,7,8,9,10,11,12,13,14];
        var titleName ='社区商业租赁合同补充协议审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }

    else if (data.form_data.TEMPLETEID == '-587924617406492880') {
        if(parent_node[109].value == '场地租赁'){
            var titleArr =[1,4,2,107,108,109];
            titleArr = titleArr.concat(3,4,5,6,26,27,28,29);
            if(parent_node[4].value == '集中式商业' ||parent_node[4].value == '社区商业'){
                titleArr = titleArr.concat(30,31,32,33,34,35,36,37);
            }
            if(parent_node[4].value == '写字楼'){
                titleArr =  titleArr.concat(33,34,35,36,37);
            }
            titleArr.concat(38);
            if(parent_node[38].value == '有'){
                titleArr =  titleArr.concat(39,40,41,42,43);
            }
            if(parent_node[38].value == '无'){
                titleArr = titleArr.concat(43);
            }
            titleArr =  titleArr.concat(44);
            if(parent_node[44].value == '固定租金'){
                titleArr = titleArr.concat(45,46,49,50,51,52,53,54,55);
            }
            if(parent_node[44].value == '固定租金+扣点'){
                titleArr = titleArr.concat(45,46,47,48,49,50,51,52,53,54,55);
            }
            if(parent_node[44].value == '扣点纯'){
                titleArr =  titleArr.concat(47,48,49,50,51,52,53,54,55);
            }
            if(parent_node[55].value == '是'){
                titleArr = titleArr.concat(56,57,58,59,60,103,105);
            }
            if(parent_node[55].value == '否'){
                titleArr =  titleArr.concat(112,12,113);
                if(parent_node[113].value == '是'){
                    titleArr =   titleArr.concat(114);
                }
                titleArr = titleArr.concat(56,57,58,59,60,103,105);
            }

        }
        if(parent_node[109].value == '临时场地租赁'){
            var titleArr =[1,7,2,107,108,109];
            titleArr = titleArr.concat(8,9,10,11,61,62,63,64,65,66,67,68,69,70);
            if(parent_node[70].value == '固定租金'){
                titleArr = titleArr.concat(71,72,73,74,77,78,79);
            }
            if(parent_node[44].value == '固定租金+扣点'){
                titleArr = titleArr.concat(71,72,73,74,75,76,77,78,79);
            }
            if(parent_node[44].value == '扣点纯'){
                titleArr =  titleArr.concat(75,76,77,78,79);
            }
            if(parent_node[79].value == '否'){
                titleArr =  titleArr.concat(110);
            }
            titleArr =  titleArr.concat(80,81,82,83,103,104,105);
            if(parent_node[104].value == '非标准化合同'){
                titleArr = titleArr.concat(106);
            }
        }
        if(parent_node[109].value == '广告位租赁'){
            var titleArr =[1,7,2,107,108,109,13,14,15,18,19,20,21,22,23,24,16,17,25,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98];
            if(parent_node[98].value == '否'){
                titleArr =  titleArr.concat(111);
            }
            for (var i=0; i < parent_node.length; i++) {
                if(parent_node[i].value == '未选择'){
                    num = i;
                    for (var j = 0; j < titleArr.length; j++) {
                        if(titleArr[j]==i){
                            titleArr.splice(j,1);
                        }
                    }
                }
            };
            titleArr =  titleArr.concat(99,100,101,103,103,104,105);
            if(parent_node[104].value == '非标准化合同'){
                titleArr = titleArr.concat(106);
            }
        }
        var titleName ='社区商业新签租赁合同业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);

    }

    else if (data.form_data.TEMPLETEID == '574531466359033457') {
        var titleArr =[1,46,5,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,19];
        if(parent_node[19].value == '有'){
            titleArr =  titleArr.concat(23,24,25,26);
        }
        titleArr = titleArr.concat(27,28,29,44,30,31,32,33,34,35,36,45);
        if(parent_node[36].value == '是'){
            titleArr = titleArr.concat(43);
        }
        titleArr = titleArr.concat(37,38,39,40,41,42);
        var titleName ='社区商业租赁意向书业务审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '1048436077469124373') {
        var titleArr =[1,2,3,4,5,8,7,6,9,10,11,12,13,15,14];
        var titleName ='土建开工申请表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '6016057476270409943') {
        var titleArr = [1,2,3,24,4,25,5,6,7,8,9,10,11,17,18,20,12,21,13,14,15,16];
        var titleName ='启动会项目承诺审批表';
        if(parent_node[5].value== '是'){
            var titleArr = [1,2,3,24,4,25,5,7,8,9,10,11,17,18,20,12,21,13,14,15,16];
        }
        html = xz_MainNodes_1(titleName , titleArr);

        var nodesName = '组10';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,1,2];
        paixu(paixu_arr,packet_size);

        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);

        var nodesName = '组6';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,1,2];
        paixu(paixu_arr,packet_size);

        var nodesName = '组8';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '64482459403307992') {
        var titleArr =[1,2,3,4,5,6,7,8,9];
        var titleName ='环保集团章程审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '9022870456669915629') {
        var titleArr =[1,2,3,4,7,5];
        var titleName ='雅生活投资项目立项审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6123154393084834631') {
        var titleArr =[1,2,20,3,4,34];
        var titleName ='合同交付、确权时间审批单';
        if(parent_node[34].value == '是'){
            titleArr =  titleArr.concat(32);
        }
        titleArr =  titleArr.concat(5,7,6,12,8,10,9,31,14);
        if(parent_node[14].value == '是'){
            titleArr =  titleArr.concat(11);
        }
        titleArr =  titleArr.concat(16);
        if(parent_node[16].value == '是'){
            titleArr =  titleArr.concat(13);
        }
        titleArr =  titleArr.concat(18);
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-7013262023079080839') {
        var titleArr =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        var titleName ='环保集团董监高任免审批表';
        for (var i=0; i < parent_node.length; i++) {
            if(parent_node[i].value == '未选择'){
                num = i;
                for (var j = 0; j < titleArr.length; j++) {
                    if(titleArr[j]==i){
                        titleArr.splice(j,1);
                    }
                }
            }
        }
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '6753930265281712107') {
        var titleArr =[1,2,3,4,11,5,12,6,13,7,14,8,15,9,16,10,17,18,19];
        var titleName ='环保集团工商变更登记审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6843080432330653414') {
        var titleArr =[1,2,3,4,5,6,7,8,9,10];
        var titleName ='环保集团投资(合作)合同审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '7723801784374609097') {
        var titleArr =[1,2,3,4,5,6,7,8,9,10];
        var titleName ='环保集团战略合作(框架协议)审批表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-80673909723217257') {
        var titleArr = [1,2,3,5,4];
        var titleName ='环保集团投资(合作)协议调整备忘录';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 5;
        paixu_arr = [0,1,2,3,4];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '767573886514053883') {
        var titleArr =[1,2,3,4];
        var titleName ='招拍挂项目启动单';
        html = xz_MainNodes_1(titleName , titleArr);
        var name1 = '地块信息';
        var Arr =[10,11,12,13,14,15,16,17,6];
        caseDetail(name1,Arr)
        var name2 = '公告信息';
        var Arr =[22,18,19,20,21,22,23,24,25,26,27,7];
        caseDetail(name2,Arr)
        var name = '成交信息';
        var Arr =[5,28,32,33,34,29,30,35,31,8];
        caseDetail(name,Arr)
    }
    else if (data.form_data.TEMPLETEID == '4496462998706013211') {
        var titleArr =[1,2,3,4];
        var titleName ='非招拍挂项目启动单';
        html = xz_MainNodes_1(titleName , titleArr);
        var name1 = '地块信息';
        var Arr =[9,10,11,12,13,14,15,16,5];
        caseDetail(name1,Arr)
        var name2 = '公告信息';
        var Arr =[17,18,19,20,21,22,6];
        caseDetail(name2,Arr)
        var name = '成交信息';
        var Arr =[23,24,25,26,27,7];
        caseDetail(name,Arr)
    }
    else if (data.form_data.TEMPLETEID == '-8877815526964049242') {
        var titleArr =[1,2,8,3,4,5,6,7];
        var titleName =' 雅居乐ERP合同取消审核申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 13;
        paixu_arr = [0,1,2,3,4,5,6,7,10,11,12];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '4691403148126276910') {
        var titleArr =[1,2,3,8,4,5,6,7];
        var titleName =' 雅居乐ERP工程类合同条款修改申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 9;
        paixu_arr = [0,1,2,8,3,4,5,6,7];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5533800912476158625') {
        var titleArr =[1,2,3,4,5,6,7];
        var titleName ='雅居乐ERP工程资金计划审批流新增、修改申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 12;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '6672152443558774401') {
        var titleArr =[1,2,3,4,5,6,7];
        var titleName ='雅居乐ERP工程合同审批流新增修改申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 13;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '2366029571624289410') {
        var titleArr =[1,2,3,4,5,6,7];
        var titleName ='雅居乐ERP设计合同、资金计划审批流新增、修改申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 10;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '4096446517918190992') {
        var titleArr =[1,2,3,4,5,6,7];
        var titleName ='雅居乐ERP2代区域公司新增申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0,1,2,3];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '923639460913958452') {
        var titleArr =[1,2,3,4,5,6,7];
        var titleName ='雅居乐ERP工程类合同作废删除申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 8;
        paixu_arr = [0,1,2,7,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3590058167739595400') {
        var titleArr =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        var titleName ='ERP销售系统新增、修改报表申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-6879757324945047411') {
        var titleArr =[1,2,8,3,4,5,6,7];
        var titleName ='雅居乐ERP合同解锁申请单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 14;
        paixu_arr = [0,1,2,3,13,4,5,6,7,10,11,12];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-4116356814045557983') {
        var titleArr =[1,8,2,3,4,5,6,7];
        var titleName ='雅居乐ERP开发办证设计类合同解锁单';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 11;
        paixu_arr = [0,1,2,10,3,4,5,6,7,8,9];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-2425617109528458817') {
        var titleArr = [1,33,34,35,2,3,4,5,6,7,16,17,18,19,21,23,26,28,30,31];
        var titleName ='员工月度绩效目标卡_BZ01';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0,1,2,3];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-2818506171082585704') {
        var titleArr = [32,1,33,34,2,3,4,5,6,7,14,15,43,44,17,18,8,10,12,26,20,22,24,27,29,30];
        var titleName ='员工月度绩效目标卡_YX01';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 8;
        paixu_arr = [0,1,2,3,4,5,6,7];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-5098669842589988913') {
        var titleArr = [1,2,3,4,5,6,7,8,16,17,18,19,20,21];
        var titleName ='员工年度绩效成绩汇总表(双线人员二次评定)';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '2178281224798027923') {
        var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var titleName ='雅居乐ERP合同结算价(原录入错误)修改申请表【停用】';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '-3824706926358544255') {
        var titleArr = [1,2,3,8,5,6,7,4];
        var titleName ='雅居乐ERP(2代)项目/组团新增申请单';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '5486928883277710899') {
        var titleArr = [1,2,3,4,5,6,7,8,21,22,23,24,25];
        var titleName ='雅居乐地产集团ERP月度运维考核表';
        html = xz_MainNodes_1(titleName , titleArr);
    }
    else if (data.form_data.TEMPLETEID == '8827043710987749085') {
        var titleArr = [1,2,12,5,8,11,9,10,4,3];
        var titleName ='武汉区域事业部/部门月度组织绩效考核表';
        html = xz_MainNodes_1(titleName , titleArr);
        var nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 14;
        paixu_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-3182855604644986694') {
        var nodesName = '组11';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 2;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
    }
    else if (data.form_data.TEMPLETEID == '-2316727368673899047') {
            var titleArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,37,38,39,40,41,42,43];
            var titleName ='员工绩效面谈记录表(2018年度绩效适用)';
            html = xz_MainNodes_1(titleName , titleArr);
        }
        else {//其他单
            for (var i = 0; i < array.length; i++) {
                if (array[i].value == '' || array[i].value == undefined || array[i].name == '是否一级部门' || array[i].name == '印章管理人' || array[i].name == '是否集团' || array[i].name == '是否事业部' || array[i].name == '印章所属公司' || array[i].name == '是否项目公章' || array[i].name == '是否雅生活集团本部公章' || array[i].name == '印章所属板块' || array[i].name == '是否产业集团总部' || array[i].name == '是否有区域负责人') {
                    continue;
                } else {
                    html += '<div class="border1" name="' + array[i].name + '" value="' + array[i].value + '"><div class="content-l" value="' + array[i].value + '">' + array[i].name + '</div><div class="content-r" value="' + array[i].value + '">' + array[i].value + '</div></div>';
                }
            };
        }

    $('#new_content').html(html);

    //获取手机参数
    var obj=cmp.device.info().enbrand
    if (obj&&obj.indexOf('HUAWEI') != -1) {
        $('#biaoti').css('height', '4em');
        $('.inp1').addClass("inp1-huawei");
        $('.inp1-huawei').removeClass("inp1");
        $('.inp2').addClass("inp2-huawei");
        $('.inp2-huawei').removeClass("inp2");
        $('.xiangqing').addClass("xiangqing_huawei");
        $('.xiangqing_huawei').removeClass("xiangqing");

    }

    //重复数据斑马色
    for (var i = 0; i < m; i++) {
        var xm = '.tab' + i + ' input';
        $(xm).each(function(index, item) {
            switch(index%4) {
                case 1:
                    $(item).css("background-color", "#FFFFFF");
                    break;
                case 2:
                    $(item).css("background-color", "#FFFFFF");
                    break;
                case 3:
                    $(item).css("background-color", "rgb(231, 241, 255)");
                    break;
                case 0:
                    $(item).css("background-color", "rgb(231, 241, 255)");
                    break;
            }
        });

        var trb = '.tab' + i + ' tr';
        $(trb).each(function(index, item) {
            if (index % 2 == 0) {
                $(item).css("background-color", "rgb(231, 241, 255)");
            }
        });
    }

}
//控制开放单据
function kaifang(TEMPLETEID) {
    var oaArr = new Array();
    oaArr.push('7138298345902264060');   //刻制印章申请表(控股地产总部适用)
    oaArr.push('77298762289136847');     //集团本部证照、档案查阅借阅复制申请表(行政类)
    oaArr.push('-7812734632841228541');    //请假单
    oaArr.push('5181108400302475433');     //加班申请单
    oaArr.push('568995026641439267');      //签卡证明单
    oaArr.push('2600744919581803574');     //印章使用申请单
    oaArr.push('3207317117236234991');   //集团总部制度制定与修订审批单
    oaArr.push('5017440158153788979');   //控股公司行政车辆维修申请表
    oaArr.push('-6131764484774081912');  //机票订票、退票单-样式调整专用
    oaArr.push('1960292154601849020');   //社会公益类奖项参评审批表(行政类)
    oaArr.push('8765153999093777869');   //集团本部参加社会评奖公益活动申请表
    oaArr.push('-5461635084680933438');  //城市公司参加社会评奖公益活动申请表
    oaArr.push('-7575886243163911856');  //西安公司资产维修申请单
    oaArr.push('2781531993265291575');   //酒店印刷名片申请表
    oaArr.push('1027139718975671732');   //球会印刷名片申请表
    oaArr.push('-2296586595266639809');  //酒店行政车辆维修申请表
    oaArr.push('-241159187613791029');   //球会行政车辆维修申请表
    oaArr.push('3896864326085790690');    //集团本部机票订票、退票单
    oaArr.push('7296764394475571190');   // 区域机票订票、退票单
    oaArr.push('-3480261042881673583');  //雅生活集团综合请示审批表
    oaArr.push('-551529683811941910');   //集团本部印刷名片申请表
    oaArr.push('-6537712324195171070');  //刻制印章申请表(酒店适用)
    oaArr.push('-3250564978480560965'); //刻制印章申请表(球会适用)
    oaArr.push('2772328269487623878');  //出差申请表(境外公司适用)
    oaArr.push('3844567553221806368');   //行政车辆维修申请表(产业板块适用)
}
//测试开放单据
function kongzhi(TEMPLETEID) {
    var oaArr = new Array();
    /*oaArr.push('-3752297750746478419');//投资类资金计划审批表(房管集团适用)
    oaArr.push('8827043710987749085');//武汉区域事业部/部门月度组织绩效考核表
    oaArr.push('5486928883277710899');//雅居乐地产集团ERP月度运维考核表
    oaArr.push('-3824706926358544255');//雅居乐ERP(2代)项目/组团新增申请单
    oaArr.push('2178281224798027923');//雅居乐ERP合同结算价(原录入错误)修改申请表【停用】
    oaArr.push('-5098669842589988913');//员工年度绩效成绩汇总表(双线人员二次评定)
    oaArr.push('-2316727368673899047');//员工绩效面谈记录表(2018年度绩效适用)
    oaArr.push('-2818506171082585704');//员工月度绩效目标卡_YX01
    oaArr.push('-2425617109528458817');//员工月度绩效目标卡_BZ01
    oaArr.push('-3182855604644986694');//员工月度绩效目标卡_BZ03
    oaArr.push('-3752297750746478419');//投资类资金计划审批表(房管集团适用)
    oaArr.push('-4116356814045557983');//雅居乐ERP开发办证设计类合同解锁单
    oaArr.push('-6879757324945047411');//雅居乐ERP合同解锁申请单
    oaArr.push('-3590058167739595400');//ERP销售系统新增、修改报表申请单
    oaArr.push('923639460913958452');//雅居乐ERP工程类合同作废删除申请单
    oaArr.push('4096446517918190992');//雅居乐ERP2代区域公司新增申请单
    oaArr.push('2366029571624289410');//雅居乐ERP设计合同、资金计划审批流新增、修改申请单
    oaArr.push('6672152443558774401');//雅居乐ERP工程合同审批流新增修改申请单
    oaArr.push('-5533800912476158625');//雅居乐ERP工程资金计划审批流新增、修改申请单
    oaArr.push('4691403148126276910');//雅居乐ERP工程类合同条款修改申请单
    oaArr.push('-8877815526964049242');//雅居乐ERP合同取消审核申请单
    oaArr.push('4496462998706013211');//非招拍挂项目启动单
    oaArr.push('767573886514053883');//招拍挂项目启动单
    oaArr.push('-80673909723217257');//环保集团投资(合作)协议调整备忘录
    oaArr.push('7723801784374609097');//环保集团战略合作(框架协议)审批表
    oaArr.push('-6843080432330653414');//环保集团投资(合作)合同审批表
    oaArr.push('6753930265281712107');//环保集团工商变更登记审批表
    oaArr.push('-7013262023079080839');//环保集团董监高任免审批表
    oaArr.push('-6123154393084834631');//合同交付、确权时间审批单
    oaArr.push('9022870456669915629');//雅生活投资项目立项审批表
    oaArr.push('64482459403307992');//环保集团章程审批表
    oaArr.push('6016057476270409943');//启动会项目承诺审批表
    oaArr.push('1048436077469124373');//土建开工申请表
    oaArr.push('-3752297750746478419');//投资类资金计划审批表(房管集团适用)
    oaArr.push('1011286993045178651');//投资类合同审批表(房管集团适用)
    oaArr.push('2915412076924061890');//投资类资金计划审批表（城市更新部）
    oaArr.push('-4766244538045218402');//投资类合同审批表（城市更新部）
    oaArr.push('5371632642273263687');//教育集团投资项目资金计划审批表
    oaArr.push('7465900939312120462');//投资类资金计划审批表
    oaArr.push('493304544306545058');//投资类合同审批表
    oaArr.push('-7119516754335742861');//收并购项目启动单
    oaArr.push('8922205370062031803');//招拍挂项目启动单(适用单项目)
    oaArr.push('-1127717546106011415');//雅生活投委会审核意见表
    oaArr.push('574531466359033457');//社区商业租赁意向书业务审批表
    oaArr.push('-587924617406492880');//社区商业新签租赁合同业务审批表
    oaArr.push('6989258234991823232');//社区商业租赁合同补充协议审批表
    oaArr.push('7687521016149854190');//直管商业租赁合同补充协议审批表
    oaArr.push('3621650583653466940');//直管商业租赁意向书业务审批表
    oaArr.push('7204706028765334066');//直管商业新签租赁合同业务审批表
    oaArr.push('-8442466091553177478');//社区商业解约协议业务审批表
    oaArr.push('-8833425021841749599');//直管商业解约协议业务审批表
    oaArr.push('5866499600456108036');//房屋交付标准审批表
    oaArr.push('5866499600456108036');//雅居乐地产销售定价盈利预测需求单
    oaArr.push('479845070585416761');//价单调价审批表
    oaArr.push('2813001447852166432');//价单优惠政策审批表
    oaArr.push('8486999027836994734');//价单初始定价审批表
    oaArr.push('8906069632815809611');//电商费用豁免申请表
    oaArr.push('7619092590758480360');//供货计划新增调整申请表
    oaArr.push('-3650285579175769483');//电商退款申请单
    oaArr.push('8260284939359111460');//项目内部员工人力成本归属变动申请表
    oaArr.push('-4652012989063344379');//银行借款支取审批表(境外)
    oaArr.push('8630454728231108645');//银行借款支取审批表
    oaArr.push('-6922812097573665408');//雅居乐智慧社区平台信息发布审批单
    oaArr.push('5627073824110497667');//物业极致系统数据导出申请表
    oaArr.push('-3480404682906450621');//物业入伙时间调整申报汇总表
    oaArr.push('-1289057161592355566');//物业入伙时间调整申报表
    oaArr.push('-5122204389724372470');//工程施工单位新引进状态变更申请单
    oaArr.push('-7893806335233537274');//提前收楼申请单审批单
    oaArr.push('-8873639855762420487');//项目网站信息更新审批单
    oaArr.push('-4338238018367240136');//按揭银行合作准入评估表
    oaArr.push('-5448538813086675387');//部门服务满意度调查问卷2018版
    oaArr.push('3217847529120155934');//地产/酒店/球会系统请示审单
    oaArr.push('-5870995136758987530');//建筑科技集团请示审批单
    oaArr.push('4526461095234913940');//开具在职收入证明申请单
    oaArr.push('-5470535563465440824');//公司网站信息更新审批单(OA机器人)
    oaArr.push('-1192552355850794725');//公司网站信息更新审批单
    oaArr.push('4356633934334411165');//微信公众号信息发布审批单
    oaArr.push('2247600476079082875');//商业汇票开票申请单
    oaArr.push('4795206753081247147');//工程款抵扣物业内部自住资格审批表
    oaArr.push('392266959200144919');//退休与退休返聘审批表
    oaArr.push('1994671699505660597');//工伤保险待遇审批表
    oaArr.push('-5758999397150799411');//新员工回访问卷表
    oaArr.push('6638420307717212252');//内部快件派送单
    oaArr.push('-500393586275068834');//员工外派审批表
    oaArr.push('7319164953578849490');//社会公益类捐款或活动参与审批表
    oaArr.push('-7274475742455379208');//微信号申请单
    oaArr.push('403481686562849125');//员工购房物业代理车位优惠审批表
    oaArr.push('6403533832671547231');//奖罚单
    oaArr.push('1027577815176859086');//电话申请单
    oaArr.push('1737250438260345118');//设计制作申请单
    oaArr.push('-13501169223185569');//改建户外工程申请表
    oaArr.push('-3641074914828858405');//物业疑难问题汇报表
    oaArr.push('-610264067602232919');//物业拓展激励奖金申请表
    oaArr.push('-465454106832321650');//异常改建报备表
    oaArr.push('7567626790716852654');//物业拓展业务奖金申请表
    oaArr.push('-633230948592038601');//物业管理拓展项目转介申请表
    oaArr.push('5671067115414176720');//房管集团员工晋升评估审批表
    oaArr.push('5671067115414176720');//球会员工晋升评估审批表
    oaArr.push('2891061226519415778');//球会离职审批表
    oaArr.push('-9045320827570404155');//雅筑公司项目经理引入申报审批表
    oaArr.push('-7150569741368737014');//环保集团员工晋升评估审批表
    oaArr.push('4787935543631366744');//建设集团员工晋升评估审批表
    oaArr.push('3221904248626563426');//房管集团离职审批表
    oaArr.push('6065418671280574130');//教育集团离职审批表
    oaArr.push('7018452972352720404');//酒店离职审批表
    oaArr.push('4308213602450164581');//环保集团离职审批表
    oaArr.push('-6158724769201109990');//建设集团离职审批表
    oaArr.push('-1365219085078413042');//房管集团员工调动借调申请表(同业务板块)
    oaArr.push('1673335578676577715');//酒店员工调动借调申请表(同业务板块)
    oaArr.push('-5499618933977234770');//球会员工调动借调申请表(同业务板块)
    oaArr.push('-8504442201459374532');//建设集团员工调动借调申请表(同业务板块)
    oaArr.push('5511888274435096869');//环保集团员工调动借调申请表(同业务板块)
    oaArr.push('6995207945023931929');//环保集团员工调动借调申请表(跨业务板块)
    oaArr.push('-4132318165625910616');//教育集团员工调动借调申请表(跨业务板块)
    oaArr.push('5799560426336701530');//房管集团员工调动借调申请表(跨业务板块)
    oaArr.push('7576500340886750966');//球会员工调动借调申请表(跨业务板块)
    oaArr.push('-5376524854344791045');//酒店员工调动借调申请表(跨业务板块)
    oaArr.push('-2585185765854655041');//教育集团招聘需求表（下属高校适用）
    oaArr.push('8344139281869851936');//教育集团招聘需求表（下属中小学适用）
    oaArr.push('4567253281011942560');//教育集团招聘需求表（产业公司适用）
    oaArr.push('-7624447151855483675');//教育集团招聘需求表（下属幼儿园适用）
    oaArr.push('4179526454036679339');//教育集团招聘需求表（培训公司适用）
    oaArr.push('-190870791779168803');//建设集团入职定薪单审批表
    oaArr.push('855359473310387379');//教育集团入职定薪审批表（集团本部适用）
    oaArr.push('7089512554951492122');//环保集团入职定薪单审批表
    oaArr.push('-5807601856324613213');//球会入职定薪单审批表
    oaArr.push('-4092482431612598656');//酒店入职定薪单审批表
    oaArr.push('-9045320827570404155');//雅筑公司项目经理引入申报审批表
    oaArr.push('-7150569741368737014');//环保集团员工晋升评估审批表
    oaArr.push('4787935543631366744');//建设集团员工晋升评估审批表
    oaArr.push('3221904248626563426');//房管集团离职审批表
    oaArr.push('6065418671280574130');//教育集团离职审批表
    oaArr.push('7018452972352720404');//酒店离职审批表
    oaArr.push('4308213602450164581');//环保集团离职审批表
    oaArr.push('-6158724769201109990');//建设集团离职审批表
    oaArr.push('1159662951455280498');//员工调动晋升调薪审批表(新)
    oaArr.push('-5643615812530388789');// 员工内部异动审批表（下属办学机构适用）
    oaArr.push('8084993790838589033');// 教育集团入职定薪审批表（下属办学机构适用）
    oaArr.push('-1608705395936507690');//建设集团合同续约审批表
    oaArr.push('-8898173532091432813');//房管集团转正审批表
    oaArr.push('428353018133170462');//控股公司/地产集团转正审批表
    oaArr.push('3746099944750596287');//环保集团转正审批表
    oaArr.push('-5930606762938905337');//教育集团转正审批表
    oaArr.push('-4792577248352255299');//酒店转正审批表
    oaArr.push('5420151195026278632');//建设集团转正审批表
    oaArr.push('8965615263629198277');//教育集团招聘需求表（区域公司适用）
    oaArr.push('-5164607092120468978');//教育集团招聘需求表（集团本部适用）
    oaArr.push('6266852002179400398');//房管集团入职定薪审批表
    oaArr.push('-5108510239686375320');//员工代理晋升评估审批表
    oaArr.push('-3870253333101327465');//教育系统人事定编/增编审批流程
    oaArr.push('-8496025580265519391');//人员编制调整申请表（产业板块）
    oaArr.push('3930131715878699830');//费用补助申请表
    oaArr.push('2402827834532842356');//业务系统用户权限申请表
    oaArr.push('-4144159433128721696');//电脑资产申请、调配、调拨、核价、申购、入库单(雅生活板块适用)
    oaArr.push('-3801827220675016577');//雅居乐互助会个案资助申请电子审批表(球会公司适用)
    oaArr.push('-8324255150530673992');//雅居乐互助会个案资助申请电子审批表(酒店公司适用)
    oaArr.push('5725566704011856915');//雅居乐互助会个案资助申请电子审批表(建设集团适用)
    oaArr.push('5930446063876066708');//雅居乐互助会个案资助申请电子审批表(环保集团适用)
    oaArr.push('-8936670152228911906'); //雅居乐互助会个案资助申请电子审批表(教育集团适用)
    oaArr.push('6357993138212850373'); //雅居乐互助会个案资助申请电子审批表(雅生活下属单位适用)
    oaArr.push('-2902864919182753703');//雅居乐互助会个案资助申请电子审批表(雅生活集团本部适用)
    oaArr.push('-7985514291684554771');//雅居乐互助会个案资助申请电子审批表(地产区域适用)
    oaArr.push('3043417834255042747');//并购园/新项目OA体系搭建流程
    oaArr.push('-658714980725537040');//2018年年中教育集团员工行为评估表（非管理人员）
    oaArr.push('2249359686391712670');//出差申请表(房管集团适用)
    oaArr.push('-2665907776892088680');//刻制印章申请表(资本集团适用)
    oaArr.push('8097361857290915446');//项目公司注册变更注销申请表(资本集团适用)
    oaArr.push('2378321832167490783');// 证照、档案查阅借阅复制审批表(球会适用)
    oaArr.push('-2477597902101983450');//项目公司注册变更注销申请表(建设集团适用)
    oaArr.push('-4787472994505833395');//刻制印章申请表(环保集团适用)
    oaArr.push('-7127846378930418551');//印章使用申请单(环保集团适用)
    oaArr.push('1183073910720184757');//教育集团本部用车申请单
    oaArr.push('4477047349290027728');//地产集团本部印刷名片申请表
    oaArr.push('-2630831528790765999');//刻制印章申请表(环保集团适用)
    oaArr.push('788424823177561202');  //电脑资产申请、调配、调拨、核价、申购、入库单(地产公司适用)
    oaArr.push('-2481447930518813670');  //电脑资产申请、调配、调拨、核价、申购、入库单(环保集团适用)
    oaArr.push('-6534540451007414205');  //信息部信息系统帐户异动（变更、离调职）处理工作单 
    oaArr.push('-2309371973343755808');  //法律服务调查问卷
    oaArr.push('-656673282741353770');  //IT项目上线确认单
    oaArr.push('6783254089728410802');  //IT项目立项确认单
    oaArr.push('-7383628129068956204');  //控股公司电脑资产报废申请单
    oaArr.push('-3524333937175606019');  //系统、网络、业务软件变更申请单
    oaArr.push('-27706712005587791');  //办公室资讯相关弱电工程（布线、联网）数据采集单
    oaArr.push('-3262929075556103983');  //电子业务流程搭建/变更申请单
    oaArr.push('2402827834532842356');  //业务系统用户权限申请表
    oaArr.push('-874234715885845643');  //二次开发工作量确认审批表
    oaArr.push('-517030576051564970');  //电脑资产申请、调配、调拨、核价、申购、入库单(直管公司适用)
    oaArr.push('1485871202118616080');  //租赁设备消费确认表
    oaArr.push('-1794858838503242751');  //香港业主客户拒收通知单
    oaArr.push('5521390291815648908');  //电脑资产维修单
    oaArr.push('1048492752617819349');  //出差申请表(教育集团适用)
    oaArr.push('5520236027379927310');  //区域公司出差申请表(地产板块适用)
    oaArr.push('-4009124918176628592'); //教育集团项目公司注册变更注销申请表
    oaArr.push('-6529574094086059314'); //项目公司注册变更注销申请表(控股地产适用)
    oaArr.push('1716065264241035314');  //区域公司制度制定与修订审批单
    oaArr.push('-3900115189928996865'); //刻制印章申请表(地产公司适用)
    oaArr.push('-8822795880723821762');   //刻制印章申请表(建设集团适用)
    oaArr.push('6280743566215169764');   //证照、档案查阅借阅复制审批表(产业板块适用)
    oaArr.push('2035660100223779502');   //分公司、项目机票订票、退票单
    oaArr.push('3844567553221806368');   //行政车辆维修申请表(产业板块适用)
    oaArr.push('2772328269487623878');  //出差申请表(境外公司适用)
    oaArr.push('-3250564978480560965'); //刻制印章申请表(球会适用)
    oaArr.push('-4139124209889032790');  //区域公司行政车辆维修申请表
    oaArr.push('7660662768402909317');   //区域公司证照、档案查阅借阅复制审批表
    oaArr.push('8431699790663205206');     //电脑资产领用单 (资讯类)
    oaArr.push('3896864326085790690');    //集团本部机票订票、退票单
    oaArr.push('7296764394475571190');   // 区域机票订票、退票单
    oaArr.push('-6537712324195171070');  //刻制印章申请表(酒店适用)
    oaArr.push('-3480261042881673583');  //雅生活集团综合请示审批表
    oaArr.push('-551529683811941910');   //集团本部印刷名片申请表
    oaArr.push('8686396059014285706');//区域公司内部车辆出入信息登记单(地产板块适用)
    oaArr.push('-3735391380211350158');//雅居乐互助会个案资助申请电子审批表(控股公司适用)
    oaArr.push('920908986682198882');//项目公司注册变更注销申请表(酒店公司适用)
    oaArr.push('8838706116918265531');//内部车辆出入信息登记单(教育集团下属单位适用)
    oaArr.push('2608409883646444999');//内部车辆出入信息登记单(教育集团本部适用)
    oaArr.push('-6381262752882408630');//环保集团制度制定与修订审批单
    oaArr.push('-5262880614361182669');//刻制印章申请表(教育集团适用)
    oaArr.push('262446142804805212');//教育集团制度制定与修订审批单
    oaArr.push('-5728204707846733659');//区域公司内部车辆出入信息登记单(直管公司适用)
    oaArr.push('-1807943382927064355');//区域公司内部车辆出入信息登记单(雅生活集团适用)
    oaArr.push('9201374726088377563');//集团总部内部车辆出入信息登记单(雅生活集团适用)
    oaArr.push('-5392143497167224499'); //集团总部内部车辆出入信息登记单(直管公司适用)
    oaArr.push('-3783931503799153638'); //分公司印刷名片申请表
    oaArr.push('-241159187613791029');   //球会行政车辆维修申请表
    oaArr.push('-2296586595266639809');  //酒店行政车辆维修申请表
    oaArr.push('7787044277212693536');   //雅居乐互助会个案资助申请电子审批表(地产集团本部适用)
    oaArr.push('4920821981846389600');   //管理人员廉政关联信息申报表
    oaArr.push('-6131764484774081912');  //机票订票、退票单-样式调整专用
    oaArr.push('3846065355546574898');   //车辆维修申请表(雅生活适用)
    oaArr.push('1960292154601849020');   //社会公益类奖项参评审批表(行政类)
    oaArr.push('8765153999093777869');   //集团本部参加社会评奖公益活动申请表
    oaArr.push('-5461635084680933438');  //城市公司参加社会评奖公益活动申请表
    oaArr.push('-7575886243163911856');  //西安公司资产维修申请单
    oaArr.push('-6515677626749140212');  //集团本部行政车辆维修申请表
    oaArr.push('2781531993265291575');   //酒店印刷名片申请表
    oaArr.push('1027139718975671732');   //球会印刷名片申请表
    oaArr.push('5017440158153788979');   //控股公司行政车辆维修申请表
    oaArr.push('-3078021211368832386');  //集团总部内部车辆出入信息登记单(地产板块适用)
    oaArr.push('-5410812159219447474');  //集团总部出差申请表(地产板块适用)
    oaArr.push('5281784317832219510');   //雅居乐集团展厅参观申请表(行政类)
    oaArr.push('-6698228782637561199');  //控股公司印刷名片申请表
    oaArr.push('-7812734632841228541');    //请假单
    oaArr.push('77298762289136847');     //集团本部证照、档案查阅借阅复制申请表(行政类)
    oaArr.push('5181108400302475433');     //加班申请单
    oaArr.push('568995026641439267');      //签卡证明单
    oaArr.push('2600744919581803574');     //印章使用申请单
    oaArr.push('7138298345902264060');   //刻制印章申请表(控股地产总部适用)
    oaArr.push('3207317117236234991');   //集团总部制度制定与修订审批单
    oaArr.push('-3590058167739595400');  //ERP新增报表审批单 (EHR类)
    oaArr.push('417871520731187825');    //ERP系统用户权限申请表 (EHR类) 
    oaArr.push('937751255366059273');     //行政综合服务申请单
    oaArr.push('-8233977498163002399');  //文件会签表(行政类)*/



    for (var i = 0; i < oaArr.length; i++) {
        if (TEMPLETEID == oaArr[i]) {
            return true;
        } else {
            continue;
        }
    };
}

function xz_xml(data){
    var xml = data.form_data.XML.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    data_xml_2 = xml;
    console.log(xml);
    $(xml).children().each(function(index, element) {
        var  childrenName = element.children;
        if(childrenName.length < 1){
            var obj = new Object();
            obj.name = element.localName.replace('my:', '');
            obj.value = $(element).text();
            parent_node.push(obj);
        }
    });
    for (var i = 0; i < parent_node.length; i++) {
        console.log("parent_node------------"+i + ' ' + parent_node[i].name + ' ' + parent_node[i].value);
    };
}
function xz_xml_2(data_xml_2,nodesName){
    var  nodesNames = "my\\:"+ nodesName;
    child_nodes =[];
    $(data_xml_2).find(nodesNames).children().each(function(index2, element2) {
        var obj2 = new Object();
        obj2.name = element2.localName.replace('my:', '');
        obj2.value = $(element2).text();
        child_nodes.push(obj2);
    });
    for (var j = 0; j < child_nodes.length; j++) {
        console.log("child_nodes----"+j + ' ' + child_nodes[j].name + ' ' + child_nodes[j].value);
    };
}
function xz_MainNodes_1 (titleName , titleArr){
    html += '<div id="biaoti" style="width: 100%;height: 3em;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);margin-left: 0;line-height: 2em;text-align: center;" value="'+ titleName + '"/></div>';
    html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;">';
    for (var i = 0; i < titleArr.length; i++) {
        var j = titleArr[i];
        if (i < 1) {
            html += '<tr class="color2" style="width:100%;background-color:rgb(0, 166, 147);"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + parent_node[j].name + '"/></td><td style="width:40%;"><input readOnly="readOnly" class="inp1 right color2" style="color:white;background-color:rgb(0, 166, 147);" value="' + parent_node[j].value + '&nbsp&nbsp"/></td></tr>';
        } else {
            html += '<tr class="color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + parent_node[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + parent_node[j].value + '&nbsp&nbsp"/></td></tr>';
        }
    }
    html += '</table>';
    return html;
}
function xz_MainNodes_M (titleArr){
    html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;">';
    for (var i = 0; i < titleArr.length; i++) {
        var j = titleArr[i];
        html += '<tr class="color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + parent_node[j].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + parent_node[j].value + '&nbsp&nbsp"/></td></tr>';
    }
    html += '</table>';
    return html;
}

/*
 行政综合服务申请单
 */
function xz_ComprehensiveService(data,Service_type){
    if(Service_type == '设施维修'){
        var  nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 8;
        paixu_arr = [0,1,2,3,4,5,7,6];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '货梯申请'){
        var  nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 8;
        paixu_arr = [0,1,2,3,4,5,7,6];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '车辆月保'){
        var  nodesName = '组4';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 4;
        paixu_arr = [0,1,2,3];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '资产调动'){
        var  nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 8;
        paixu_arr = [0,1,2,3,4,5,7,6];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '加时空调'){
        var  nodesName = '组6';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 7;
        paixu_arr = [0,1,2,3,4,5,6];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '马来西亚_新加坡等签证办理'){
        var  nodesName = '组8';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,1,2];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '固定电话'){
        var  nodesName = '组14';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 6;
        paixu_arr = [0,1,2,3,4,5];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '其它'){
        var  nodesName = '组8';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 3;
        paixu_arr = [0,1,2];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '员工门禁申请'){
        var  nodesName = '组10';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 1;
        paixu_arr = [0,1];
        paixu(paixu_arr,packet_size);
    }
    else if(Service_type == '前台接待'){
        var  nodesName = '组2';
        xz_xml_2(data_xml_2,nodesName);
        packet_size = 1;
        paixu_arr = [0];
        paixu(paixu_arr,packet_size);
    }
    return html;
}
$("#close").on("tap",function(){
    $("#xiangqing").html(" ");
    $('#message').css('display', 'none');
});

function tAlerts() {
    $("#new_content td").each(function(index) {
            var len;
            if($(this).find("input").attr("value") !=null || $(this).find("input").attr("value")!=undefined) {
                len=$(this).find("input").attr("value").length;
            }
            if(len > 14) {
                var value=$(this).find("input").val();
                $(this).on("tap",function(){
                    $('#message').css('display', '');
                    $("#xiangqing").html(value);
                });
            }
        }
    )};


/*
 * 排序公共方法
 */
function paixu(paixu_arr , packet_size){
    var len = child_nodes.length / packet_size;
    for (var j = 0; j < len; j++) {
        //只需要制定排列顺序
        for (var i=0; i < paixu_arr.length; i++) {
            var paixu_i = paixu_arr[i] + j * packet_size;
            if(i == 0){
                html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
                html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="' + m + '" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r"  name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
            }
            else if(i == paixu_arr.length-1){
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
                html += '</table>';
                m++;
            }
            else{
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
            }
        }
    }
}

function title_paixu(paixu_arr , packet_size,titlt_name){
    var len = child_nodes.length / packet_size;
    for (var j = 0; j < len; j++) {
        //只需要制定排列顺序
        for (var i=0; i < paixu_arr.length; i++) {
            var paixu_i = paixu_arr[i] + j * packet_size;
            if(i == 0){
                html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
                html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value="' + titlt_name + m + '" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r"  name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
            }
            else if(i == paixu_arr.length-1){
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
                html += '</table>';
                m++;
            }
            else{
                html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + child_nodes[paixu_i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + child_nodes[paixu_i].value + '&nbsp&nbsp"/></td></tr>';
            }
        }
    }
}

/*
 * 雅居乐互助会个案资助申请电子审批表_个案详情 
 * titleName 标题名称
 * titleArr 排序数组
 */
function caseDetail(titleName,titleArr){
    for (var j = 0; j < titleArr.length; j++) {
        var i = titleArr[j];
        if (j == 0) {
            html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
            html += '<tr class="color3" style="width:100%;"><td style="width:60%;"><input value="'+ titleName +'" type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
        } else if (j == titleArr.length - 1) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
            html += '</table>';
            m++;
        } else {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
        }
    }
    return html;
}
function GrantApplicationForm(titleName,titleArr){
    for (var j = 0; j < titleArr.length; j++) {
        var i = titleArr[j];
        if (j == 0) {
            html += '<table class="tab' + m + '" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate; border-spacing:0px 0px;">';
            html += '<tr class="color3" style="width:100%;"><td style="width:40%;"><input value=" '+titleName+' " type="text" readOnly="readOnly" class="inp2 color3" style="border: none;"/></td><td class="td-r" name = "flexible" style="width:20%;"><img name="editTeam" count="1" value="' + m + '" src="./css/res/ygzz_grxx_sub.png" class="editTeam-r team-r' + m + '"></td></tr>';
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:65%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
        } else if (j == titleArr.length - 1) {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
            html += '<tr class="team' + m + ' color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="申请依据"/></td><td style="width:60%;"><input type="textarea"readOnly="readOnly" class="inp1 right color2" value="符合《雅居乐互助会章程》' + parent_node[21].value + '条' + parent_node[22].value + '款' + parent_node[23].value + '项规定，可申请资助标准为：资助金额' + parent_node[24].value + ' + 额外资助金额 ' + parent_node[61].value + ' "/></td></tr>';
            html += '<tr class="team' + m + ' color2" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp1 left color2" value="' + parent_node[26].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp1 right color2" value="' + parent_node[26].value + '&nbsp&nbsp"/></td></tr>';
            html += '</table>';
            m++;
        } else {
            html += '<tr class="team' + m + ' color4" style="width:100%;"><td style="width:40%;"><input type="text" readOnly="readOnly" class="inp2 inpborder left color4" value="' + parent_node[i].name + '"/></td><td style="width:60%;"><input readOnly="readOnly" class="inp2 inpborder right color4" value="' + parent_node[i].value + '&nbsp&nbsp"/></td></tr>';
        }
    }
    return html;
}



//去重
function uniq(array) {
    var temp = [];
    //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    console.log(temp);
    return temp;
}

//去空
function uniq2(array) {
    var temp = [];
    //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (array[i] != '') {
            temp.push(array[i]);
        }
    }
    console.log(temp);
    return temp;
}

//控制重复数据收缩
$("#new_content").on("click", "input", function() {
    if ($(this).attr('name') == "editTeam") {
        var num = $(this).attr('value');
        if ($(this).attr('count') == 1) {
            $('.team' + num).css('display', 'none');
            $(this).attr('count', '0');
            $('.team-r' + num).attr('src', './css/res/ygzz_grxx_add.png');
        } else {
            $('.team' + num).css('display', '');
            $(this).attr('count', '1');
            $('.team-r' + num).attr('src', './css/res/ygzz_grxx_sub.png');
        }
    }
})

/* $("#new_content").on("click", "img", function() {
 if ($(this).attr('name') == "editTeam") {
 var num = $(this).attr('value');
 console.log($(this).attr('count'));
 if ($(this).attr('count') == 1) {
 $('.team' + num).css('display', 'none');
 $(this).attr('count', '0');
 $('.team-r' + num).attr('src', './css/res/ygzz_grxx_add.png');
 } else {
 $('.team' + num).css('display', '');
 $(this).attr('count', '1');
 $('.team-r' + num).attr('src', './css/res/ygzz_grxx_sub.png');
 }
 }
 })
 */
$("#new_content").on("click", "td", function() {
    if ($(this).attr('name') == "flexible") {
        var num = $(this).find('img').attr('value');
        console.log($(this).find('img').attr('count'));
        if ($(this).find('img').attr('count') == 1) {
            $('.team' + num).css('display', 'none');
            $(this).find('img').attr('count', '0');
            $('.team-r' + num).attr('src', './css/res/ygzz_grxx_add.png');
            var height = document.body.offsetHeight;
            console.log("关---------"+height);
            ///waterMarkNotIe$(height);
        } else {
            $('.team' + num).css('display', '');
            $(this).find('img').attr('count', '1');
            $('.team-r' + num).attr('src', './css/res/ygzz_grxx_sub.png');
            var height = document.getElementById("new_content").offsetHeight;
            console.log("开----------"+height);
           // waterMarkNotIe$(height);

        }
    }
})
//初始化页面显示
function yincang() {
    $("#content").css('display', 'none');
    $("#new_content").css('display', '');
}

var L = 0;

//页面格式切换
function change_content() {
    if (L == 0) {
        $("#new_content").css('display', 'none');
        $("#content").css('display', '');
        $('meta[name="viewport"]').attr('content',"target-densitydpi=device-dpi, width=device-width, initial-scale=0.5, user-scalable=yes" );
        L = 1;
        var height = document.getElementById("content").offsetHeight;
        //waterMarkNotIe$(height);
    } else {
        $("#content").css('display', 'none');
        $("#new_content").css('display', '');
        $('meta[name="viewport"]').attr('content',"target-densitydpi=device-dpi, width=device-width, initial-scale=0.5, user-scalable=no" );
        L = 0;
        var height = document.getElementById("new_content").offsetHeight;
       // waterMarkNotIe$(height);

    }
}

function editcontent() {
    console.log('999');
    $('#my是否流程节点人员变更').val('0').selectedIndex = 1;
}

//新OA协同：xietongdetail_content.html
//表单是否允许在移动端编辑审批
function isCanEditForm(templeteId) {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var loginname = cmp.storage.get('ygzz_loginname');
    console.log(templeteId);
    //正式服不开启表单编辑
    var oaArr = new Array();
    var formArr = [];
    oaArr.push('A000305');
    oaArr.push('A000508');
    oaArr.push('A000543');
    oaArr.push('A000929');
    oaArr.push('A002320');
    oaArr.push('A002780');
    oaArr.push('A003737');
    oaArr.push('A006826');
    oaArr.push('A006897');
    oaArr.push('A008698');
    oaArr.push('A013198');
    oaArr.push('A013237');
    oaArr.push('A015354');
    oaArr.push('A018053');
    oaArr.push('A023652');
    oaArr.push('A036247');
    oaArr.push('A055057');
    oaArr.push('A065798');
    oaArr.push('A067565');
    oaArr.push('A076216');
    oaArr.push('liuzhengjun');
    oaArr.push('seeyon2');
    oaArr.push('A000485');
    oaArr.push('A064151');
    oaArr.push('linlidan');
    oaArr.push('A000652');
    oaArr.push('A000415');
    oaArr.push('A002188');
    oaArr.push('A089999');
    oaArr.push('A049356');
    oaArr.push('A034569');
    oaArr.push('A000641');

    if (oaArr.indexOf(loginname) != -1 || templeteId == "7842420384121704041") {
        formArr = ["-3262929075556103983", "-6534540451007414205", "-1682276082661768178", "5521390291815648908", "-656673282741353770", "6783254089728410802", "4915972576696422178", "-3524333937175606019", "-8526166933915351303", "6560620198130893179", "788424823177561202", "-2481447930518813670", "-517030576051564970", "-4098333848254069463",
            //"8922205370062031803",
            //"-7119516754335742861",
            //"1159662951455280498",
            "-1192552355850794725", "7842420384121704041"
            //"-4075340959497236759",
            //"-6113656700180872074",
            //"-3735391380211350158"
            //"5181108400302475433",
            //"4913029040738159614",
            //"7697658255577335036",
            //"-3328335427922278323",
            //"69356868501981685",
            //"8377028700636268812",
            //"-6928101050308345192",
            //"-1030900657859704135"
        ];
    }
    var checkR = formArr.indexOf(templeteId);
    if (-1 == checkR) {
        console.log("不允许编辑");
        return false;
    } else {
        console.log("允许编辑,当前允许表单编辑数量:" + formArr.length);
        return true;
    }
}

//对可编辑表单的页面进行处理
function getReplaceHTMLinfo(data) {
    console.log(data);
    if (data['form_data'].BODYTYPE == 'HTML') {
        $("#content").html(data['form_data'].HTMLCONTENTDIV + "</table>");
    } else {
		if(data['bodycontent']){
			$("#content").html(data['bodycontent'].HTML);
		}
        
    }
    cmp.zoom("#container",{
        zoomMin:0.2,
        initZoom:0.4,
        zoomMax:4,
        doubleTapZoom:true,
        onZoomStart:function(){},
        onZoom:function(){},
        onZoomEnd:function(){}
    })
    //类型：可能是表单流程或是公文
    var bodytype = data['form_data'].BODYTYPE;
    $("#tempContentData").attr("data-bodytype", bodytype);
    //当前节点名称
    var currentNodeName = data['form_data'].CURRENTNODENAME;
    cmp.storage.save('currentNodeName', currentNodeName);
    //模板id
    var templeteId = data['form_data'].TEMPLETEID;
    cmp.storage.save('templeteId', templeteId);
    var form_data = data['form_data'];
    var input_xml = form_data.INPUT_XML.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    var xml = form_data.XML.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    //调用隐藏页面上元素的方法
    hiddenHTMLUtil(data);
    if ('' != xml && '' != input_xml) {
        //存原始xml
        $("#tempContentData").attr("data-xml", xml);
        //存原始input_xml
        $("#tempContentData").attr("data-input_xml", input_xml);
    } else {
        return;
    }
    if (isCanEditForm(templeteId)) {
        var currentNodeName = cmp.storage.get('currentNodeName');
        var contentHTML = document.getElementById("content");
        $(input_xml).find("FieldInput").each(function(index1, element1) {
            if ($(element1).attr("access") == "edit") {
                var type = $(element1).attr("type");
                var fieldtype = $(element1).attr("fieldtype");
                var id = $(element1).attr("name");
                var fieldlength = $(element1).attr("length");
                var extendNameType = $(element1).attr("extendNameType");
                var dataReadonly = $(element1).attr("readonly");
                $(contentHTML).find("span[xd\\:binding='" + id + "']").each(function(index2, element2) {
                    if (('text' == type || 'relation' == type) && ('VARCHAR' == fieldtype || 'LONGTEXT' == fieldtype || 'DECIMAL' == fieldtype)) {
                        var value = ''
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        }
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<input';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != value && value.length > 0) {
                            newHTML += ' value=' + value;
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        newHTML += ' onblur=input_changeElement(this);';
                        if ('true' == dataReadonly) {
                            newHTML += ' style=\"font-size: 1em;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;white-space:normal;background-color: #EEEEEE;COLOR: #0000ff;word-wrap:break-word;border:1px; solid #555\"';
                            newHTML += ' readonly=readonly';
                        } else {
                            //方法：给页面添加样式和事件
                            newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        }
                        newHTML += ' >';
                        newHTML += '</input>';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('checkbox' == type && ('VARCHAR' == fieldtype || 'LONGTEXT' == fieldtype)) {
                        var value = ''
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        };
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<input';
                        newHTML += ' type="checkbox"';
                        newHTML += ' id=' + id;
                        newHTML += ' name="' + id + '"';
                        newHTML += ' value="123"';
                        if (value == '×' && undefined != value) {
                            // newHTML += 'checked="false"';
                        } else {
                            newHTML += 'checked="checked"';
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength="' + fieldlength + '"';
                        }
                        newHTML += 'onclick="dianji(this)"'
                        //方法：给页面添加样式和事件
                        // newHTML += HTML_addStyleEvent(element1,templeteId,currentNodeName);
                        newHTML += ' >';
                        // if(undefined!=value && value.length>0){
                        //  newHTML += value;
                        // }

                        newHTML += '</input>';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('textarea' == type && ('VARCHAR' == fieldtype || 'LONGTEXT' == fieldtype)) {
                        var value = ''
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        };
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<textarea';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        newHTML += ' >';
                        if (undefined != value && value.length > 0) {
                            newHTML += value;
                        }
                        newHTML += '</textarea>';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('select' == type && 'VARCHAR' == fieldtype) {
                        //已选中项,内容枚举
                        var selectedIndex = $($(element2)[0].children[0]).attr("default");
                        var sel_HTML = "<option value=''></option>";
                        id = id.replace(":", '');
                        //枚举值
                        $(input_xml).find("FieldInput").each(function(index3, element3) {
                            if ($(element3).attr("access") == "edit") {
                                if ('select' == type && 'VARCHAR' == fieldtype) {
                                    //枚举值
                                    var name = $(element3).attr("name").replace(":", '');
                                    if (id == name) {
                                        var option = $(element3).find("input").each(function(index4, element4) {
                                            selObj = new Object();
                                            var value = $(element4).attr("value");
                                            var text = $(element4).attr("display");
                                            var metadataid = $(element4).attr("metadataid");
                                            if (undefined == text || 'undefined' == text) {
                                                text = $(element4)[0].attributes[0].nodeValue;
                                            }
                                            if (selectedIndex == value) {
                                                sel_HTML += "<option value=" + value + "  metadataid=" + metadataid + " selected>" + text + "</option>";
                                            } else {
                                                sel_HTML += "<option value=" + value + " metadataid=" + metadataid + " >" + text + "</option>";
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        var newHTML = '';
                        newHTML += '<select';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        newHTML += ' onchange=\"opt_changeSelecte(this);\"';
                        newHTML += ' >';
                        newHTML += sel_HTML;
                        newHTML += '</select></br>';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('extend' == type && ('TIMESTAMP' == fieldtype || '日期选取器' == extendNameType || '日期时间选取器' == extendNameType)) {
                        var time = ''
                        try {
                            time = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            time = '';
                        };
                        id = id.replace(":", '');
                        var newHTML = '';
                        newHTML += '<input';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != time && time.length > 0) {
                            newHTML += ' value=' + time;
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        newHTML += ' readOnly=\"readOnly\"';
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        if ('日期时间选取器' == extendNameType) {
                            newHTML += ' onclick=\"jedateShowDatetime01(this);\"';
                        } else {
                            newHTML += ' onclick=\"jedateShowDate(this);\"';
                        }
                        newHTML += ' >';
                        newHTML += '</input>';
                        newHTML += '<img src="css/res/date.gif"/> ';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('extend' == type && '选择人员' == extendNameType) {
                        var value = ''
                        var default_v = '';
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        };
                        try {
                            default_v = $($(element2)[0].children[0]).attr("default");
                        } catch(e) {
                            default_v = '';
                        }
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<input';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != value && value.length > 0) {
                            newHTML += ' value=' + value;
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        if ('' != default_v) {
                            newHTML += ' default=' + default_v;
                        }
                        newHTML += ' readOnly=\"readOnly\"';
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        newHTML += ' onclick=\"selectPeople_danxuan(this);\"';
                        newHTML += ' >';
                        newHTML += '</input>';
                        newHTML += '<img src="css/res/selecetUser.gif"/> ';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('extend' == type && '选择关联表单...' == extendNameType) {
                        //电脑资产申请、调配、调拨、核价、申购、入库单(雅生活板块适用)的【汇率】
                        var value = ''
                        var default_v = '';
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        };
                        try {
                            default_v = $($(element2)[0].children[0]).attr("default");
                        } catch(e) {
                            default_v = '';
                        };
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<input';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != value && value.length > 0) {
                            newHTML += ' value=' + value;
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        if ('' != default_v) {
                            newHTML += ' default=' + default_v;
                        }
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        newHTML += ' >';
                        newHTML += '</input>';
                        $(element2).prop('outerHTML', newHTML);
                    } else if ('extend' == type && ('选择单位' == extendNameType || '选择部门' == extendNameType)) {
                        var value = ''
                        var default_v = '';
                        try {
                            value = $(element2)[0].children[0].innerHTML;
                        } catch(e) {
                            value = '';
                        };
                        try {
                            default_v = $($(element2)[0].children[0]).attr("default");
                        } catch(e) {
                            default_v = '';
                        }
                        var newHTML = '';
                        id = id.replace(":", '');
                        newHTML += '<input';
                        newHTML += ' id=' + id;
                        newHTML += ' name=' + id;
                        if (undefined != value && value.length > 0) {
                            newHTML += ' value=' + value;
                        }
                        if (undefined != fieldlength && fieldlength.length > 0) {
                            newHTML += ' fieldlength=' + fieldlength;
                        }
                        if ('' != default_v) {
                            newHTML += ' default=' + default_v;
                        }
                        newHTML += ' readOnly=\"readOnly\"';
                        //方法：给页面添加样式和事件
                        newHTML += HTML_addStyleEvent(element1, templeteId, currentNodeName);
                        if ('选择单位' == extendNameType) {
                            newHTML += ' onclick=\"selectProject_danxuan(this);\"';
                        } else if ('选择部门' == extendNameType) {
                            newHTML += ' onclick=\"selectDept_danxuan(this);\"';
                        }
                        newHTML += ' >';
                        newHTML += '</input>';
                        newHTML += '<img src="css/res/selecetUser.gif"/> ';
                        $(element2).prop('outerHTML', newHTML);
                    }
                });
            }
        });
        //处理特殊表单
        doFilter_after(xml, input_xml, templeteId);
        //显示增删按钮
        showRepeatingTableBtn(xml, input_xml);
    }
}

//隐藏页面上的元素
function hiddenHTMLUtil(data) {
    console.log(data);
    var currentNodeName = cmp.storage.get('currentNodeName');
    var templeteId = data['form_data'].TEMPLETEID;
    var form_data = data['form_data'];
    var xml = form_data.XML.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    var attachments = data['attachments'];
    //调用脚本更新
    cmp.storage.save('msg', '');
    cmp.storage.save('attachments', '');
    cmp.storage.save('fujiannum', attachments.count);
    // uexWindow.evaluateScript("", 0, "showNum(" + attachments.count + ")");
    try {
        if ($("span[xd\\:binding='my:电子表单编号']").text().indexOf("C-CW-017") < 0 || $("span[xd\\:binding='my:电子表单编号']").text().indexOf("C-CW-018") < 0) {
            $("table").each(function(index) {
                var ishidden = true;
                $(this).find("span").each(function() {
                    if ($(this).attr("xd:binding") != null) {
                        if ($(xml).find($(this).attr("xd:binding").replace(':', '\\:')).text() != '') {
                            ishidden = false;
                        }
                    }
                })
                if ($(this).attr("xd:widgetIndex") == null) {
                    ishidden = false;
                }
                if (ishidden) {
                    $(this).css("display", "none");
                }
            })
        }
        cmp.storage.save("formid", $("span[xd\\:binding='my:电子表单编号']").text());
        //电脑资产申请,调配,入库单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-IT/OA-012") {
            var divIndex = $("span[xd\\:binding='my:类别']").text();
            var value = 0;
            if ($.trim(divIndex) == "办公电脑") {
                value = 0;
            }
            if ($.trim(divIndex) == "打印扫描设备") {
                value = 1;
            }
            if ($.trim(divIndex) == "零配件及周边设备") {
                value = 2;
            }
            if ($.trim(divIndex) == "非标准软件申购申请") {
                value = 3;
            }
            if ($.trim(divIndex) == "设备维修") {
                value = 4;
            }
            if ($.trim(divIndex) == "投影设备") {
                value = 5;
            }
            if ($.trim(divIndex) == "视频会议设备") {
                value = 6;
            }
            if ($.trim(divIndex) == "服务器") {
                value = 7;
            }
            if ($.trim(divIndex) == "网络设备") {
                value = 8;
            }
            if ($.trim(divIndex) == "机房设备") {
                value = 9;
            }
            if ($.trim(divIndex) == "视频监控设备") {
                value = 10;
            }
            if ($.trim(divIndex) == "条码设备") {
                value = 11;
            }
            if ($.trim(divIndex) == "其它") {
                value = 12;
            }
            if ($.trim(divIndex) == "请示") {
                value = 13;
            }
            if (value > 0) {
                $("span[xd\\:binding='my:物品名称_办公电脑']").css("display", "none");
            }
            if (value != 1) {
                $("span[xd\\:binding='my:物品名称_打印扫描设备']").css("display", "none");
            }
            if (value != 2) {
                $("span[xd\\:binding='my:物品名称_零配件及周边设备']").css("display", "none");
            }
            if (value != 3) {
                $("span[xd\\:binding='my:物品名称_非标准软件申购申请']").css("display", "none");
            }
            if (value != 4) {
                $("span[xd\\:binding='my:物品名称_设备维修']").css("display", "none");
            }
            if (value != 5) {
                $("span[xd\\:binding='my:物品名称_投影设备']").css("display", "none");
            }
            if (value != 6) {
                $("span[xd\\:binding='my:物品名称_视频会议设备']").css("display", "none");
            }
            if (value != 7) {
                $("span[xd\\:binding='my:物品名称_服务器']").css("display", "none");
            }
            if (value != 8) {
                $("span[xd\\:binding='my:物品名称_网络设备']").css("display", "none");
            }
            if (value != 9) {
                $("span[xd\\:binding='my:物品名称_机房设备']").css("display", "none");
            }
            if (value != 10) {
                $("span[xd\\:binding='my:物品名称_视频监控设备']").css("display", "none");
            }
            if (value != 11) {
                $("span[xd\\:binding='my:物品名称_条码设备']").css("display", "none");
            }
            if (value != 12) {
                $("span[xd\\:binding='my:物品名称_其他']").css("display", "none");
            }
            if (value != 13) {
                $("span[xd\\:binding='my:物品名称_请示']").css("display", "none");
            }
            $("span[xd\\:binding='my:汇率']").css("display", "none");
            $("span[xd\\:binding='my:人民币小计']").css("display", "none");
        }
    } catch(e) {
        console.error("出错了:" + e);
    }

    //费用支出审批单（2016版）
    try {

        if ($("span[xd\\:binding='my:电子表单编号']").text().indexOf("C-CW-017") != -1) {
            try {
                if ($("span[xd\\:binding='my:中心部门']").text().indexOf("采购") == -1) {
                    $("span[xd\\:binding='my:采购订单号']").parents("tr").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding='my:预算分摊部门_区域']").text() == '') {
                    $("span[xd\\:binding='my:预算分摊部门_区域']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算分摊部门_区域']").parents("table").find("td").each(function() {
                        if ($(this).text().indexOf("预算部门") != -1)
                            $(this).css("display", "none");
                    })
                    $("span[xd\\:binding='my:在途金额']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding='my:预算分摊部门_集团']").text() == '') {
                    $("span[xd\\:binding='my:预算分摊部门_集团']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算分摊部门_集团']").parents("table").find("td").each(function() {
                        if ($(this).text().indexOf("预算部门") != -1)
                            $(this).css("display", "none");
                    })
                    $("span[xd\\:binding='my:在途金额']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding='my:预算分摊公司']").text() == '') {
                    $("span[xd\\:binding='my:预算分摊公司']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算分摊公司']").parents("table").find("td").each(function() {
                        if ($(this).text() == "预算公司")
                            $(this).css("display", "none");
                    })
                    $("span[xd\\:binding='my:当期可用预算']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding^='my:费用二级类别']").text() != "特殊事项(预算外)") {
                    $("span[xd\\:binding='my:是否免责']").css("display", "none");
                    $("span[xd\\:binding='my:是否免责']").parents("td").prev().children().css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }
            try {
                $("span[xd\\:binding^='my:中心部门']").css("display", "none");
                $("span[xd\\:binding='my:发起者单位']").css("display", "none");
                $("span[xd\\:binding='my:AD账号']").css("display", "none");
                $("span[xd\\:binding^='my:当期可用预算']").css("display", "none");
                $("span[xd\\:binding^='my:在途金额']").css("display", "none");
                $("span[xd\\:binding='my:控制额度']").css("display", "none");
                $("span[xd\\:binding='my:控制维度']").css("display", "none");
                $("span[xd\\:binding='my:是否控制预算']").css("display", "none");
                $("span[xd\\:binding='my:财务核对人员']").css("display", "none");
                $("span[xd\\:binding='my:会计所属公司编码']").css("display", "none");
                $("span[xd\\:binding='my:项目名称编码']").css("display", "none");
                $("span[xd\\:binding='my:汇率']").css("display", "none");
                $("span[xd\\:binding='my:金额合计']").css("display", "none");
                $("span[xd\\:binding='my:费用中心编码']").css("display", "none");
                $("span[xd\\:binding='my:采购订单号编码']").css("display", "none");
                $("span[xd\\:binding='my:是否已有合同']").css("display", "none");
                $("span[xd\\:binding='my:是否已有合同']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:是否已预提']").css("display", "none");
                $("span[xd\\:binding='my:是否已预提']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
                $("span[xd\\:binding='my:非执董所属单位_费用支出审批单']").css("display", "none");
                if ($("span[xd\\:binding='my:所属单位']").text() == '集团本部' || $("span[xd\\:binding='my:所属单位']").text() == "") {
                    $("span[xd\\:binding='my:是否区域公司负责人']").css("display", "none");
                    $("span[xd\\:binding='my:是否区域公司负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:集团是否有主管业务中心']").css("display", "none");
                    $("span[xd\\:binding='my:集团是否有主管业务中心']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:集团业务中心负责人']").css("display", "none");
                    $("span[xd\\:binding='my:集团业务中心负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:借款人是否包含单位负责人']").css("display", "none");
                    $("span[xd\\:binding='my:借款人是否包含单位负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否有业务主管副总']").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务主管副总']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:区域公司预算部门']").css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总']").css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:报销人是否包含单位负责人']").css("display", "none");
                    $("span[xd\\:binding='my:报销人是否包含单位负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总']").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总']").css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否负责人']").css("display", "none");
                }
                if ($("span[xd\\:binding='my:预算公司_统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算公司_统筹类']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算公司_统筹类']").parents("table").find("td").each(function() {
                        if ($(this).text() == "预算公司")
                            $(this).css("display", "none");
                    })
                    $("span[xd\\:binding='my:在途金额']").parents("td").css("display", "none");
                }
                if ($("span[xd\\:binding='my:预算部门_区域统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算部门_区域统筹类']").css("display", "none");
                    if ($("span[xd\\:binding='my:预算部门_集团统筹类']").text() == '') {
                        $("span[xd\\:binding='my:预算部门_区域统筹类']").parents("td").css("display", "none");
                        $("span[xd\\:binding='my:预算部门_区域统筹类']").parents("table").find("td").each(function() {
                            if ($(this).text().indexOf("预算部门") != -1)
                                $(this).css("display", "none");
                        })
                        $("span[xd\\:binding='my:当期可用预算']").parents("td").css("display", "none");
                    }
                }
                if ($("span[xd\\:binding='my:预算部门_集团统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算部门_集团统筹类']").css("display", "none");
                    if ($("span[xd\\:binding='my:预算部门_区域统筹类']").text() == '') {
                        $("span[xd\\:binding='my:预算部门_集团统筹类']").parents("td").css("display", "none");
                        $("span[xd\\:binding='my:预算部门_集团统筹类']").parents("table").find("td").each(function() {
                            if ($(this).text().indexOf("预算部门") != -1) {
                                $(this).css("display", "none");
                            }
                        })
                        $("span[xd\\:binding='my:当期可用预算']").parents("td").css("display", "none");
                    }
                }

            } catch(e) {
                console.log(e);
            }
            //隐藏表格
            $("tbody tr").each(function(index, element) {
                if ($(element).text().indexOf("以下表单项与审批流程相关，请务必谨慎填写，如有疑问请咨询系统管理员") != -1) {
                    $(element).parent().css("display", "none");
                }
            });

        }
    } catch(e) {
        console.error("出错了:" + e);
    }

    try {
        //非执董借款及费用支出审批单
        if ($("span[xd\\:binding='my:电子表单编号']").text().indexOf("C-CW-018") != -1) {
            try {
                $("span[xd\\:binding^='my:采购订单号编码']").css("display", "none");
                $("span[xd\\:binding^='my:表单模板编号']").css("display", "none");
                $("span[xd\\:binding^='my:中心部门']").css("display", "none");
                $("span[xd\\:binding='my:发起者单位']").css("display", "none");
                $("span[xd\\:binding^='my:会计所属部门编码']").css("display", "none");
                if ($("span[xd\\:binding='my:预算分摊部门_区域']").text() == '') {
                    $("span[xd\\:binding='my:预算分摊部门_区域']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算分摊部门_区域']").parents("table").find("td").each(function() {
                        if ($(this).text().indexOf("预算部门") != -1) {
                            $(this).css("display", "none");
                        }
                    })
                    $("span[xd\\:binding='my:当期可用预算']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding='my:预算分摊部门_集团']").text() == '') {
                    $("span[xd\\:binding='my:预算分摊部门_集团']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算分摊部门_集团']").parents("table").find("td").each(function() {
                        if ($(this).text().indexOf("预算部门") != -1) {
                            $(this).css("display", "none");
                        }
                    })
                    $("span[xd\\:binding='my:在途金额']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding^='my:中心部门']").text().indexOf("采购") == -1) {
                    $("span[xd\\:binding^='my:采购订单号']").parents("tr").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding^='my:费用二级类别']").text() != "特殊事项(预算外)") {
                    $("span[xd\\:binding='my:是否免责']").css("display", "none");
                    $("span[xd\\:binding='my:是否免责']").parents("td").prev().children().css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding^='my:所属单位']").text() == "集团本部" || $("span[xd\\:binding^='my:所属单位']").text() == "") {
                    $("span[xd\\:binding='my:是否区域公司负责人']").css("display", "none");
                    $("span[xd\\:binding='my:是否区域公司负责人']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否区域公司负责人_报销']").css("display", "none");
                    $("span[xd\\:binding='my:是否区域公司负责人_报销']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:借款人是否包含单位负责人_借款']").css("display", "none");
                    $("span[xd\\:binding^='my:是否区域公司负责人']").parents("tr").css("display", "none");
                    $("span[xd\\:binding='my:借款人是否包含单位负责人_借款']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding^='my:借款人是否包含单位负责人']").parents("tr").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总_借款']").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总_借款']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:是否有业务主管副总_借款']").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务主管副总_借款']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:区域公司预算部门']").css("display", "none");
                    // $("span[xd\\:binding='my:区域公司预算部门']").parents("td").prev().children().css("display","none");
                    $("span[xd\\:binding='my:业务分管副总_借款']").css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总_借款']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:报销人是否包含单位负责人_报销']").css("display", "none");
                    $("span[xd\\:binding='my:报销人是否包含单位负责人_报销']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:报销人是否包含单位负责人_报销']").parents("tr").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总_报销']").css("display", "none");
                    $("span[xd\\:binding='my:是否有业务分管副总_报销']").parents("td").prev().children().css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总_报销']").css("display", "none");
                    $("span[xd\\:binding='my:业务分管副总_报销']").parents("td").prev().children().css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                $("span[xd\\:binding='my:AD账号']").css("display", "none");
                $("span[xd\\:binding^='my:会计所属公司编码']").css("display", "none");
                $("span[xd\\:binding='my:费用中心编码']").css("display", "none");
                $("span[xd\\:binding='my:汇率_借款']").css("display", "none");
                $("span[xd\\:binding^='my:项目名称编码']").css("display", "none");
                $("span[xd\\:binding^='my:控制维度']").css("display", "none");
                $("span[xd\\:binding^='my:控制额度']").css("display", "none");
                $("span[xd\\:binding='my:报销合计_报销']").css("display", "none");
                $("span[xd\\:binding='my:汇率_报销']").css("display", "none");
                $("span[xd\\:binding='my:财务核对人员']").css("display", "none");
                $("span[xd\\:binding='my:借款财务核对']").css("display", "none");
                $("span[xd\\:binding='my:借款合计_借款']").css("display", "none");
                $("span[xd\\:binding^='my:当期可用预算']").css("display", "none");
                $("span[xd\\:binding^='my:在途金额']").css("display", "none");
                $("span[xd\\:binding='my:是否控制预算']").css("display", "none");
                $("span[xd\\:binding='my:是否已有合同_报销']").css("display", "none");
                $("span[xd\\:binding='my:是否已有合同_报销']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:是否已预提_报销']").css("display", "none");
                $("span[xd\\:binding='my:是否已预提_报销']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:集团是否有主管业务中心_借款']").css("display", "none");
                $("span[xd\\:binding='my:集团是否有主管业务中心_借款']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:集团是否有主管业务中心_报销']").css("display", "none");
                $("span[xd\\:binding='my:集团是否有主管业务中心_报销']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:集团业务中心负责人_借款']").css("display", "none");
                $("span[xd\\:binding='my:集团业务中心负责人_借款']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:集团业务中心负责人_报销']").css("display", "none");
                $("span[xd\\:binding='my:集团业务中心负责人_报销']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:是否一级部门_借款']").css("display", "none");
                $("span[xd\\:binding='my:非执董所属单位_借款及费用支出审批单']").css("display", "none");
                $("span[xd\\:binding='my:域1']").css("display", "none");
                $("span[xd\\:binding='my:域1']").parents("td").prev().children().css("display", "none");
                if ($("span[xd\\:binding='my:预算公司_统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算公司_统筹类']").parents("td").css("display", "none");
                    $("span[xd\\:binding='my:预算公司_统筹类']").parents("table").find("td").each(function() {
                        if ($(this).text() == "预算公司") {
                            $(this).css("display", "none");
                        }
                    })
                    $("span[xd\\:binding^='my:在途金额']").parents("td").css("display", "none");
                }
            } catch(e) {
                console.log(e);
            }

            try {
                if ($("span[xd\\:binding='my:预算部门_区域统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算部门_区域统筹类']").parents("td").css("display", "none");
                    if ($("span[xd\\:binding='my:预算部门_集团统筹类']").text() == '') {
                        $("span[xd\\:binding='my:预算部门_区域统筹类']").parents("table").find("td").each(function() {
                            if ($(this).text().indexOf("预算部门") != -1) {
                                $(this).css("display", "none");
                            }
                        })
                        $("span[xd\\:binding^='my:当期可用预算']").parents("td").css("display", "none");
                    }
                }
            } catch(e) {
                console.log(e);
            }
            try {
                if ($("span[xd\\:binding='my:预算部门_集团统筹类']").text() == '') {
                    $("span[xd\\:binding='my:预算部门_集团统筹类']").parents("td").css("display", "none");
                    if ($("span[xd\\:binding='my:预算部门_区域统筹类']").text() == '') {
                        $("span[xd\\:binding='my:预算部门_集团统筹类']").parents("table").find("td").each(function() {
                            if ($(this).text().indexOf("预算部门") != -1)
                                $(this).css("display", "none");
                        })
                        $("span[xd\\:binding^='my:当期可用预算']").parents("td").css("display", "none");
                    }
                }
            } catch(e) {
                console.log(e);
            }

            //隐藏表格
            $("tbody tr").each(function(index, element) {
                if ($(element).text().indexOf("以下表单项与审批流程相关，请务必谨慎填写，如有疑问请咨询系统管理员") != -1) {
                    $(element).parent().css("display", "none");
                }
            });

        }
    } catch(e) {
        console.error("出错了:" + e);
    }

    try {

        //电脑资产报废申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-IT/OA-048") {
            if ($("span[xd\\:binding='my:是否计划内']").text() == '') {
                $("span[xd\\:binding='my:是否计划内']").parents("tr").css("display", "none");
            }
        }
        //电子业务流程搭建变更申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-IT/OA-020") {
            $("span[xd\\:binding='my:所属单位类别']").css("display", "none");
        }
        //雅居乐ERP合同解锁申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-MY-022") {
            $("span[xd\\:binding='my:是否有分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否有事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //刻制印章申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-XZ-004") {
            $("span[xd\\:binding='my:是否有分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否有事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //印章使用申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-XZ036") {
            $("span[xd\\:binding='my:印章管理人']").css("display", "none");
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
            $("span[xd\\:binding='my:是否集团']").css("display", "none");
            $("span[xd\\:binding='my:是否产业集团总部']").css("display", "none");
            $("span[xd\\:binding='my:是否事业部']").css("display", "none");
            $("span[xd\\:binding='my:是否项目公章']").css("display", "none");
            $("span[xd\\:binding='my:是否雅生活集团本部公章']").css("display", "none");
            $("span[xd\\:binding='my:印章所属公司']").css("display", "none");
            $("span[xd\\:binding='my:印章所属板块']").css("display", "none");
            $("span[xd\\:binding='my:事业部行政人事负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //制度制定与修订审批单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AHC-XZ-033") {
            $("span[xd\\:binding='my:是否有分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否有事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
        }
        //项目公司注册/变更/注销申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-XZ-034") {
            $("span[xd\\:binding='my:是否有分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否有事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //预算解锁调整审批单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "C-CW-019") {
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
        }
        //会议室预订申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "C-XZ-035") {
            if ($("span[xd\\:binding='my:是否需行政人员协助']").text() != "是") {
                $("span[xd\\:binding='my:是否需行政人员协助']").css("display", "none");
                $("span[xd\\:binding='my:行政协助人员']").css("display", "none");
                $("span[xd\\:binding='my:行政协助人员']").parents("td").prev().children().css("display", "none");
                $("span[xd\\:binding='my:茶水']").parents("tr").css("display", "none");
            }
        }
        //车辆出入证申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "C-XZ-011") {
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
        }
        //出差申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "C-XZ-007") {
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
        }
        //环保集团请假单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-003HB") {
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            //隐藏流程表格
            if($("table.xdLayout").last().text().indexOf("以下信息为隐藏域，不在界面显示") != -1 ){
                $("table.xdLayout").last().css("display","none");
            }
            $("span[xd\\:binding='my:直接上司']").parent().parent().parent().parent().parent().css("display", "none");
        }
        //教育集团加班申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-002JY") {
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:直接上司']").parent().parent().parent().parent().parent().css("display", "none");
        }
        //酒店加班申请单,球会加班申请单,房管集团加班申请单,环保集团加班申请单,商业集团加班申请单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-002FG" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-SY-006" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-002HB" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-002JD" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-002QH") {
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:加班人所属单位']").css("display", "none");
            $("span[xd\\:binding='my:直接上司']").parent().parent().parent().parent().parent().css("display", "none");
        }
        //酒店签卡证明单，球会签卡证明单，教育集团签卡证明单，房管集团签卡证明单，商业集团签卡证明单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-001JD" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-SY-005" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-001" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-001FG" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-001JY" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-001QH") {
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:员工编码']").css("display", "none");
            $("span[xd\\:binding='my:签卡人所在单位']").css("display", "none");
            $("span[xd\\:binding='my:是否物业分公司']").css("display", "none");
            $("span[xd\\:binding='my:直接上司']").parent().parent().parent().parent().parent().css("display", "none");
        }
        //教育集团请假单,酒店请假单,建设集团请假单,商业集团请假单
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-003JY" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-003JD" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-SY-0031" || $("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-KQ-003JS"){
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:直接上司']").parent().parent().parent().parent().parent().css("display", "none");
        }
        //雅居乐NC系统用户权限申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == ("AH/C-CW-014")) {
            $("span[xd\\:binding='my:是否有报表']").css("display", "none");
        }
        //资金部特殊事宜请示
        if ($("span[xd\\:binding='my:电子表单编号']").text() == ("AH/C-CW-037")) {
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //资金付款拆单申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-ZJ-012") {
            $("span[xd\\:binding='my:所属单位']").css("display", "none");
        }
        //银行借款偿还审批表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-ZJ-007") {
            $("span[xd\\:binding='my:是否有分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:分管负责人']").css("display", "none");
            $("span[xd\\:binding='my:是否有事业部负责人']").css("display", "none");
            $("span[xd\\:binding='my:事业部负责人']").css("display", "none");
        }
        //业务系统用户权限申请表
        if ($("span[xd\\:binding='my:电子表单编号']").text() == "AH/C-IT/OA-044") {
            var divIndex = $("span[xd\\:binding='my:请选择业务系统']").text();
            var value = 0;
            if ($.trim(divIndex) == "极致物业管理系统") {
                value = 0;
            }
            if ($.trim(divIndex) == "凌志酒店管理系统") {
                value = 1;
            }
            if ($.trim(divIndex) == "远古高球管理系统") {
                value = 2;
            }
            if ($.trim(divIndex) == "用友人事管理系统") {
                value = 3;
            }
            if ($.trim(divIndex) == "OA系统") {
                value = 4;
            }
            if ($.trim(divIndex) == "OA查询统计平台") {
                value = 5;
            }
            if ($.trim(divIndex) == "招聘管理平台") {
                value = 6;
            }
            if ($.trim(divIndex) == "地标系统") {
                value = 7;
            }
            if ($.trim(divIndex) == "营销系统克尔瑞数据平台") {
                value = 8;
            }
            if ($.trim(divIndex) == "南京酒店成本管理系统") {
                value = 9;
            }
            if (value != 0 && value != 9) {
                $("span[xd\\:binding='my:角色类别_物业类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_物业类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_物业类角色2']").css("display", "none");
                $("span[xd\\:binding='my:角色类别_南京酒店']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_南京酒店成本管理系统']").css("display", "none");
            }
            if (value != 1) {
                $("span[xd\\:binding='my:角色类别_酒店类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_酒店类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_酒店类角色2']").css("display", "none");
            }
            if (value != 2) {
                $("span[xd\\:binding='my:角色类别_远古类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_远古类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_远古类角色2']").css("display", "none");
            }
            if (value != 3) {
                $("span[xd\\:binding='my:角色类别_用友类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_用友类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_用友类角色2']").css("display", "none");
            }
            if (value != 4) {
                $("span[xd\\:binding='my:角色类别_OA系统类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_OA系统类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_OA系统类角色2']").css("display", "none");
            }
            if (value != 5) {
                $("span[xd\\:binding='my:角色类别_OA查询类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_OA查询类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_OA查询类角色2']").css("display", "none");
            }
            if (value != 6) {
                $("span[xd\\:binding='my:角色类别_招聘类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_招聘类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_招聘类角色2']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_招聘类角色2_用人部门负责人']").css("display", "none");
            }
            if (value != 7) {
                $("span[xd\\:binding='my:角色类别_地标类']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_地标类角色']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_地标类角色2']").css("display", "none");
            }
            if (value != 8) {
                $("span[xd\\:binding='my:角色类别_营销系统']").css("display", "none");
                $("span[xd\\:binding='my:申请人所需角色_营销系统']").css("display", "none");
            }
        }
        if ("-4098333848254069463" == templeteId) {
            //会议管理申请单
            $("span[xd\\:binding='my:参会人员ID']").css("display", "none");
            $("span[xd\\:binding='my:实际到会人员ID']").css("display", "none");
            $("input[id='my实到参会人员ID']").css("display", "none");
        } else if ("-656673282741353770" == templeteId) {
            //IT项目上线确认单
            $("span[xd\\:binding='my:业务部门负责人ID']").css("display", "none");
            $("span[xd\\:binding='my:计算分数']").css("display", "none");
        } else if ("-8324961097964633173" == templeteId || "2683584011283613563" == templeteId) {
            //城市公司人员编制调整申请单
            //集团总部人员编制调整申请单
            $("span[xd\\:binding='my:业务部门总监']").css("display", "none");
            $("span[xd\\:binding='my:职能中心总经理']").css("display", "none");
            $("span[xd\\:binding='my:业务分管VP']").css("display", "none");
            $("span[xd\\:binding='my:是否包含董事副总裁']").css("display", "none");
            $("span[xd\\:binding='my:对应职能中心总经理']").css("display", "none");
            $("span[xd\\:binding='my:对应业务部门总监']").css("display", "none");
            $("span[xd\\:binding='my:对应业务分管VP']").css("display", "none");
        } else if ("7813593053130739131" == templeteId) {
            //时兴生产设备维修申请表
            $("span[xd\\:binding='my:发起者部门']").css("display", "none");
        } else if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
            //区域公司预算解锁调整审批单
            //集团本部预算解锁调整审批单
            $("span[xd\\:binding='my:是否一级部门']").css("display", "none");
            $("span[xd\\:binding='my:部门负责人']").css("display", "none");
            $("span[xd\\:binding='my:部门分管领导']").css("display", "none");
            $("span[xd\\:binding='my:预算公司']").css("display", "none");
            $("span[xd\\:binding='my:是否批量预算追加']").css("display", "none");
        } else if ("-7812734632841228541" == templeteId) {
            //请假单
            $("span[xd\\:binding='my:请假人所在单位']").parent().css("display", "none");
            $($("tbody[valign='top']")[1]).css("display", "none");
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:员工编码']").css("display", "none");
            //隐藏表头[事业部：]
            $("span[xd\\:binding='my:事业部'] pre").css("display", "none");
            $($($("tbody[valign='top'] tr")[5]).find("td")[2]).css("display", "none");
        } else if ("5181108400302475433" == templeteId) {
            //加班申请单
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:所属板块']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:岗位名称']").css("display", "none");
            var unitname1 = $("span[xd\\:binding='my:单位'] pre").attr("default");
            if (unitname1 == "雅居乐控股公司" || unitname1 == "雅居乐地产集团") {
                $("span[xd\\:binding='my:HR复核人员'] pre").css("display", "none");
                $("span[xd\\:binding='my:事业部'] pre").css("display", "none");
                $("span[xd\\:binding='my:加班人所属单位'] pre").css("display", "none");
                //隐藏表头[事业部：]
                $($($("tbody[valign='top'] tr")[4]).find("td")[2]).css("display", "none");
            }
        } else if ("568995026641439267" == templeteId) {
            //签卡单
            $("span[xd\\:binding='my:单位编码']").css("display", "none");
            $("span[xd\\:binding='my:部门编码']").css("display", "none");
            $("span[xd\\:binding='my:人员编码']").css("display", "none");
            $("span[xd\\:binding='my:员工编码']").css("display", "none");
            $("span[xd\\:binding='my:签卡人所在单位']").css("display", "none");
            $("span[xd\\:binding='my:是否物业分公司']").css("display", "none");
            //隐藏表头[事业部：]
            $($($($("tbody[valign='top']")[1]).find("tr")[0]).find("td")[2]).css("display", "none");
            $($($($("tbody[valign='top']")[1]).find("tr")[0]).find("td")[3]).css("display", "none");
            $($($($("tbody[valign='top']")[1]).find("tr")[0]).find("td")[4]).css("display", "none");
        } else if ("7556897391281589094" == templeteId) {
            //销假申请单
            $("span[xd\\:binding='my:填表人所在单位']").css("display", "none");
        } else if ("-4098333848254069463" == templeteId || $("span[xd\\:binding='my:电子表单编号']").text() == "AHC-CW-017") {
            //费用支出审批单
            $("span[xd\\:binding='my:发起者单位']").css("display", "none");
            $("span[xd\\:binding='my:部门负责人']").css("display", "none");
            $("span[xd\\:binding='my:AD账号']").css("display", "none");
            $("span[xd\\:binding='my:财务核对人员']").css("display", "none");
            $("span[xd\\:binding='my:控制额度']").css("display", "none");
            $("span[xd\\:binding='my:控制维度']").css("display", "none");
            $("span[xd\\:binding='my:当前可用预算']").css("display", "none");
            $("span[xd\\:binding='my:是否控制预算']").css("display", "none");
            $("span[xd\\:binding='my:汇率']").css("display", "none");
            $("span[xd\\:binding='my:金额合计']").css("display", "none");
        } else if ("-3967531589055198132" == templeteId || $("span[xd\\:binding='my:电子表单编号']").text() == "AHC-CW-018") {
            //借款及费用支出审批单
            $("span[xd\\:binding='my:会计所属公司编码']").css("display", "none");
            $("span[xd\\:binding='my:部门负责人']").css("display", "none");
            $("span[xd\\:binding='my:AD账号']").css("display", "none");
            $("span[xd\\:binding='my:借款财务核对']").css("display", "none");
            $("span[xd\\:binding='my:财务核对人员']").css("display", "none");
            $("span[xd\\:binding='my:汇率_借款']").css("display", "none");
            $("span[xd\\:binding='my:借款合计_借款']").css("display", "none");
        } else if ("2647723249379264866" == templeteId) {
            //建设集团借款及费用支出审批单包含中心部门等字段的表格须隐藏
            $("tbody tr").each(function(index, element) {
                if ($(element).find("td").eq(0).text().indexOf("中心部门") != -1 && $(element).find("td").eq(2).text().indexOf("发起者单位") != -1) {
                    $(element).parent().css("display", "none");
                }
            });
        } else if ("8377028700636268812" == templeteId || "4277185113058724461" == templeteId) {
            //区域公司和集团本部统筹类费用支出审批单修改预算部门为审批部门
            $("tbody tr").each(function(index, element) {
                if ($(element).find("td").eq(0).text().indexOf("会计所属公司") != -1 && $(element).find("td").eq(2).text().indexOf("预算部门(考核)") != -1) {
                    $(element).find("td").eq(2).text("审批部门");
                }
            });
        }

        else if ("-2316727368673899047" == templeteId && currentNodeName == "面谈员工") {
            //2018年员工绩效面谈记录表
            $("span[xd\\:binding='my:恢复力项评分']").parent().parent().parent().parent().css("display", "none");
        }
        else if ("1159662951455280498" == templeteId) {
            if (currentNodeName == "调出集团部门总监" || currentNodeName == "调出集团中心总经理") {
                //员工调动晋升调薪审批表隐藏xd:binding属性以'编码'结尾和等于my:员工主键编号的span
                $("tbody tr").each(function(index, element) {
                    if ($(element).text().indexOf("晋升/调薪申请") != -1 || $(element).text().indexOf("晋升审批") != -1 || $(element).text().indexOf("晋升推荐理由（由推荐部门负责人填写）") != -1 || $(element).text() == "调薪审批") {
                        $(element).parent().css("display", "none");
                    }
                });
            } else if (currentNodeName == "调入单位劳资人员") {
                $("tbody tr").each(function(index, element) {
                    if ($(element).text().indexOf("晋升审批") != -1 || $(element).text().indexOf("晋升推荐理由（由推荐部门负责人填写）") != -1 || $(element).text() == "调薪审批") {
                        $(element).parent().css("display", "none");
                    }
                });
            } else if (currentNodeName == "集团绩效负责人") {
                $("tbody tr").each(function(index, element) {
                    if ($(element).text() == "调薪审批") {
                        $(element).parent().css("display", "none");
                    }
                });
            }
            $("tbody tr").each(function(index, element) {
                $(element).find("td span[xd\\:binding$='编码']").css("display", "none");
                $(element).find("td span[xd\\:binding$='my:员工主键编号']").css("display", "none");
            });
            if ($("span[xd\\:binding='my:异动前对应新OA单位']") && $("span[xd\\:binding='my:异动后对应新OA单位']")) {
                $("span[xd\\:binding='my:异动前对应新OA单位']").parent().css("display", "none");
            }

            //隐藏流程表格
            $("tbody tr").each(function(index, element) {
                if ($(element).text().indexOf("以下表单项与审批流程相关，请务必谨慎填写，如有疑问请咨询系统管理员") != -1) {
                    $(element).parent().css("display", "none");
                }
            });

        } else if ("-1192552355850794725" == templeteId) {
            //隐藏流程表格
            $("tbody tr").each(function(index, element) {
                if ($(element).text() == "以下表单项与审批流程相关，请务必谨慎填写，如有疑问请咨询系统管理员。") {
                    $(element).parent().css("display", "none");
                }
            });
        } else if ("-7119516754335742861" == templeteId) {
            //收并购项目启动单
            if ($("span[xd\\:binding='my:所属单位']")) {
                $("span[xd\\:binding='my:所属单位']").parents("tr").css("display", "none")
            }

            $("tbody tr").each(function(index, element) {
                if ($(element).text() == "投资" || $(element).text() == "投资0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "营销" || $(element).text() == "营销0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "设计/开发" || $(element).text() == "设计/开发0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "成本" || $(element).text() == "成本0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "运营" || $(element).text() == "运营0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "资金部" || $(element).text() == "资金部0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "法务" || $(element).text() == "法务0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "商业" || $(element).text() == "商业0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "酒店" || $(element).text() == "酒店0") {
                    $(element).css("display", "none");
                } else if ($(element).text() == "教育" || $(element).text() == "教育0") {
                    $(element).css("display", "none");
                }

            });
        }
    } catch(e) {
        console.error("出错了:" + e);
    }
}

//给页面添加样式和事件:有些输入框需要特殊处理一下
function HTML_addStyleEvent(element1, templeteId, currentNodeName) {
    var id = $(element1).attr("name").replace(":", '');
    var newHTML = '';
    var normalHTML = ' class=\"inputconmom backgroundconmom1 widthpercent100\"';
    if ("-3262929075556103983" == templeteId) {//电子业务流程搭建/变更申请单
        //缩短【估计完成日期】的输入框
        if ("my估计完成日期" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent30\"';
        } else if ("my申请日期" == id || "my希望完成日期" == id || "my项目" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-1682276082661768178" == templeteId) {//通用信息服务申请单
        //缩短【估计完成日期】的输入框
        if (-1 != id.indexOf("完成日期")) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("5521390291815648908" == templeteId) {//电脑资产维修单
        if ("my处理人" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-656673282741353770" == templeteId) {//IT项目上线确认单
        if ("my分数" == id) {
            newHTML += ' type=\"tel\"';
            newHTML += ' maxlength=\"5\"';
            newHTML += normalHTML;
        } else if ("my综合评分" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom2 widthpercent100\"';
            newHTML += ' maxlength=\"5\"';
        } else if ("my权重" == id) {
            newHTML += ' type=\"tel\"';
            newHTML += ' maxlength=\"5\"';
            newHTML += normalHTML;
        } else {
            newHTML += normalHTML;
        }
    } else if ("6783254089728410802" == templeteId) {//IT项目立项确认单
        if ("my是否有预算" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent10\"';
        } else if ("my预计交互日期" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("788424823177561202" == templeteId || "-2481447930518813670" == templeteId || "-517030576051564970" == templeteId || "-4144159433128721696" == templeteId) {//电脑资产申请、调配、调拨、核价、申购、入库单
        if ("my预算文本" == id || "my人民币小计" == id || "my汇率" == id) {//隐藏和不可编辑
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent100 uhide\"';
            newHTML += ' readOnly=\"readOnly\"';
        } else if ("my小计" == id || "my原币合计" == id || "my合计" == id) {//不可编辑
            newHTML += normalHTML;
            newHTML += ' readOnly=\"readOnly\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("4913029040738159614" == templeteId) {//信息中心、区域项目绩效考核表
        if ("考核人员" == currentNodeName) {
            var cal_name = $(element1).attr("name");
            var cal_value1 = $($(element1).find("calculate Value")[0]).attr("value");
            var cal_value2 = $($(element1).find("calculate Value")[1]).attr("value");
            if (undefined != cal_name && (-1 != cal_name.indexOf("小计分数"))) {//不可编辑
                newHTML += normalHTML;
                newHTML += ' readOnly=\"readOnly\"';
                newHTML += ' maxlength=\"5\"';
            } else if (undefined != cal_name && (-1 != cal_name.indexOf("得分"))) {//缩短输入框
                newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent30\"';
                newHTML += ' readOnly=\"readOnly\"';
                newHTML += ' maxlength=\"5\"';
            } else if (-1 != id.indexOf("my评分")) {
                newHTML += ' type=\"tel\"';
                newHTML += ' maxlength=\"3\"';
                newHTML += normalHTML;
            } else {
                newHTML += normalHTML;
            }
            if (undefined != cal_value1 && 'undefined' != cal_value1) {
                newHTML += ' cal_value1=' + cal_value1;
                newHTML += ' cal_value2=' + cal_value2;
            }
        } else {
            newHTML += normalHTML;
        }
    } else if ("4915972576696422178" == templeteId || "6560620198130893179" == templeteId) {
        //酒店、球会电脑资产报废申请单
        //电脑资产报废申请单(雅生活适用)
        if ("my原值合计" == id || "my净值合计" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent20\"';
            newHTML += ' readOnly=\"readOnly\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-8526166933915351303" == templeteId) {
        //虚拟服务群集系统资源申请变更单
        if ("my处理人员" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-8324961097964633173" == templeteId) {
        //城市公司人员编制调整申请单
        if ("my申请编制数" == id) {
            newHTML += ' type=\"tel\"';
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent100\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("767573886514053883" == templeteId) {
        //招拍挂项目启动单
        if ("my成交信息_实际拿地成本" == id || "my成交信息_计容可售楼面价" == id) {
            //不可编辑
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent60\"';
            newHTML += ' readOnly=\"readOnly\"';
        } else if ("my成交信息_成交日期" == id || "my成交信息_竞配套面积" == id || "my成交信息_实际计容可售" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else if ("my成交信息_总地价" == id || "my成交信息_竞配建单方造价" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent60\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("4496462998706013211" == templeteId) {
        //非招拍挂项目启动单
        if ("my成交信息_框架协议日期" == id || "my成交信息_正式签约日期" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else if ("my成交信息_预期权益货值" == id || "my成交信息_权益页面" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent60\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-1192552355850794725" == templeteId) {
        //公司网站信息更新审批单
        if ("my申请日期" == id || "my期望完成日期" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else if ("my栏目" == id) {
            newHTML += ' style=\"display: none;\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-551529683811941910" == templeteId) {
        //集团本部印刷名片申请表
        if ("my填表日期" == id || "my入职日期1" == id || "my申请人" == id || "my单位" == id || "my部门" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("7697658255577335036" == templeteId) {
        //雅居乐NC系统用户权限申请表
        if ("my完成时间" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    } else if ("-3590058167739595400" == templeteId) {
        //ERP新增、修改报表申请单
        if ("my实际完成时间" == id || "my预计完成时间" == id) {
            newHTML += ' class=\"inputconmom backgroundconmom1 widthpercent80\"';
        } else {
            newHTML += normalHTML;
        }
    }
    if ('' == newHTML) {
        newHTML += normalHTML;
    }
    return newHTML;
}

//通用方法，有些表单需要去掉隐藏
function doFilter_after(xml, input_xml, templeteId) {
    var currentNodeName = cmp.storage.get('currentNodeName');
    try {
        //通用信息服务申请单
        if ('-1682276082661768178' == templeteId) {
            var temp_pathPrev = "";
            var repeatingTablePath = "";
            $("tbody[xd\\:xctname='RepeatingTable']").each(function(index01, element01) {
                var isShow = $(element01).parent().css("display");
                if ("none" != isShow) {
                    $(element01).find("tr").each(function(index02, element02) {
                        if (0 == index02) {
                            repeatingTablePath = $(element02).attr("path");
                            var pathArr = repeatingTablePath.split("/");
                            var pathPrev = pathArr[0];
                            temp_pathPrev = pathPrev.substring(0, pathPrev.length - 3);
                        }
                    })
                }
            })
            $("tbody[xd\\:xctname='RepeatingTable'] tr[path^='" + temp_pathPrev + "']").each(function(index001, element001) {
                var repeatingTablePath01 = $(element001).attr("path");
                if (repeatingTablePath != repeatingTablePath01) {
                    $(element001).parent().parent().css("display", "");
                }
            })
            if ("my:群发寄信" == temp_pathPrev) {
                $("span[xd\\:binding='my\\:时效_群发寄信权']").each(function(index3, element3) {
                    var time_type = $(element3).find("pre").attr("default");
                    if ("0" == time_type || 0 == time_type) {
                        //永久使用:隐藏开始时间与结束时间
                        var table = $(element3).parent().parent().parent().parent();
                        $(table[0].rows.item(index3).cells[1]).css("display", "none");
                        $(table[0].rows.item(index3).cells[2]).css("display", "none");
                        $(table[0].rows.item(index3).cells[4]).attr("colspan", "3");
                        $($(table).prev()[0].rows.item(index3).cells[1]).css("display", "none");
                        $($(table).prev()[0].rows.item(index3).cells[2]).css("display", "none");
                        $($(table).prev()[0].rows.item(index3).cells[4]).attr("colspan", "3");
                    }
                });
            }
        } else if ("-656673282741353770" == templeteId) {//IT项目上线确认单
            $("#my计算分数").addClass("uhide");
            $("#my综合评分").attr("readOnly", "readOnly");
            if ("信息部-部门负责人" == currentNodeName) {
                input_changeElement();
            }
        } else if ("4913029040738159614" == templeteId) {
            if ("考核人员" == currentNodeName) {
                input_changeElement();
            }
        } else if ("4915972576696422178" == templeteId || "6560620198130893179" == templeteId) {
            if ("电脑资产管理员" == currentNodeName) {
                input_changeElement();
            }
        } else if ("7813593053130739131" == templeteId) {
            //时兴生产设备维修申请表:需要将重复行展示出来,原本是隐藏的
            $("tbody[xd\\:xctname='RepeatingTable']").each(function(index1, element1) {
                $(element1).parent().css("display", "");
            })
        } else if ("7697658255577335036" == templeteId) {
            //雅居乐NC系统用户权限申请表:需要将重复行展示出来,原本是隐藏的
            $("tbody[xd\\:xctname='RepeatingTable']").each(function(index1, element1) {
                $(element1).parent().css("display", "");
            })
        } else if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
            //区域公司预算解锁调整审批单
            //集团本部预算解锁调整审批单
            //[本次批复金额合计]是自动计算的,不能让用户手动填写
            $("#my本次批复金额合计").attr("readOnly", "readOnly");
        } else if ("8922205370062031803" == templeteId || "-7119516754335742861" == templeteId) {
            var a = document.getElementById("my投资");
            var b = document.getElementById("my营销");
            var c = document.getElementById("my设计开发");
            var d = document.getElementById("my成本");
            var e = document.getElementById("my运营");
            var f = document.getElementById("my资金部");
            var g = document.getElementById("my税务部");
            var h = document.getElementById("my法务");
            var j = document.getElementById("my酒店");
            var k = document.getElementById("my教育");
            var l = document.getElementById("my商业");
            var tbody = $("tbody[vAlign=top]");
            tbody.each(function(index, element) {
                var tr = element.children;
                for (var i = 0; i < tr.length; i++) {
                    console.log(tr[i].children[0].children[0].children[0].innerText);
                    var text = tr[i].children[0].children[0].children[0].innerText;
                    if (text == "投资") {
                        if (a.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "营销") {
                        if (b.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "设计/开发") {
                        if (c.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "成本") {
                        if (d.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "运营") {
                        if (e.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "资金部") {
                        if (f.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "税务部") {
                        if (g.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "法务") {
                        if (h.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "商业") {
                        if (l.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "酒店") {
                        if (j.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                    if (text == "教育") {
                        if (k.checked) {
                            tr[i].style.display = '';
                        } else {
                            tr[i].style.display = 'none';
                        }
                    }
                }
            })
        } else if ("-3735391380211350158" == templeteId) {
            var a = $("tbody[xd\\:xctname='RepeatingTable']").parents("table");
            a.css("display", "");

        } else if ("-1192552355850794725" == templeteId) {//公司网站信息更新审批单
            var obj = document.getElementById("my一级栏目");
            console.log(obj)
            var index = obj.selectedIndex;

            var metadataid = $(obj.options[index]).attr("metadataid");

            console.log("metadataid----------------------");
            console.log(metadataid)
            getMetadataItem(metadataid);
        }
    } catch(e) {
        console.error("出错了:" + e);
    }
}

function dianji() {
    var a = document.getElementById("my投资");
    var b = document.getElementById("my营销");
    var c = document.getElementById("my设计开发");
    var d = document.getElementById("my成本");
    var e = document.getElementById("my运营");
    var f = document.getElementById("my资金部");
    var g = document.getElementById("my税务部");
    var h = document.getElementById("my法务");

    var j = document.getElementById("my酒店");
    var k = document.getElementById("my教育");
    var l = document.getElementById("my商业");

    var tbody = $("tbody[vAlign=top]");
    tbody.each(function(index, element) {
        try {
            var tr = element.children;
            for (var i = 0; i < tr.length; i++) {
                console.log(tr[i].children[0].children[0].children[0].innerText);
                var text = tr[i].children[0].children[0].children[0].innerText;
                if (text == "投资") {
                    if (a.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "营销") {
                    if (b.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "设计/开发") {
                    if (c.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "成本") {
                    if (d.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "运营") {
                    if (e.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "资金部") {
                    if (f.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "税务部") {
                    if (g.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "法务") {
                    if (h.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "商业") {
                    if (l.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "酒店") {
                    if (j.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }
                if (text == "教育") {
                    if (k.checked) {
                        tr[i].style.display = '';
                        if ($(tr[i].children[2]).find("input").val() == '') {
                            $(tr[i].children[2]).find("input").val(0);
                        }
                    } else {
                        tr[i].style.display = 'none';
                        var tempVal = $(tr[i].children[2]).find("input").val()
                        var tempTotalVal = $("#my权重总和").val() == "" ? 0 : $("#my权重总和").val()
                        $("#my权重总和").val(Number(tempTotalVal) - Number(tempVal))
                        $(tr[i].children[2]).find("input").val(0);
                    }
                }

            }
        } catch(e) {
            console.error("出错了:" + e);
        }
    })
}

//通用方法：时间控件
function jedateShowDate(obj) {
    var timeMark = String(Math.random()).substring(2, 7);
    $(obj).addClass("time" + timeMark);
    var dateCell = ".time" + timeMark;
    jeDate({
        dateCell : dateCell,
        format : "YYYY-MM-DD",
        isTime : true,
        insTrigger : false,
        choosefun : function(val) {
            obj.value = val;
        },
        okfun : function(val) {
            obj.value = val;
        },
    })
}

function jedateShowDatetime01(obj) {
    var timeMark = String(Math.random()).substring(2, 7);
    $(obj).addClass("time" + timeMark);
    var dateCell = ".time" + timeMark;
    jeDate({
        dateCell : dateCell,
        format : "YYYY-MM-DD hh:mm",
        isTime : true,
        insTrigger : false,
        choosefun : function(val) {
            obj.value = val;
        },
        okfun : function(val) {
            obj.value = val;
        },
    })
}

//通用：人员单选
function selectPeople_danxuan(obj) {
    var rum = String(Math.random()).substring(2, 7);
    $(obj).addClass("selPeopleMark" + rum);
    $("#tempContentData").attr("data-selPeople", "selPeopleMark" + rum);
    var selPeople = new Object();
    selPeople.rootName = 'xietongdetail';
    selPeople.popName = 'content';
    selPeople.funName = 'selectPeopleFun';
    cmp.storage.save('newoa_selPeople', selPeople);
    /*appcan.window.open({
        name : 'newoa_danxuan',
        data : 'newoa_danxuan.html',
        aniId : 10,
        type : 4
    });*/
}

//通用：人员多选
function selectPeople_duoxuan(obj) {
    var rum = String(Math.random()).substring(2, 7);
    $(obj).addClass("selPeopleMark" + rum);
    $("#tempContentData").attr("data-selPeople", "selPeopleMark" + rum);
    var selPeople = new Object();
    selPeople.rootName = 'xietongdetail';
    selPeople.popName = 'content';
    selPeople.funName = 'selectPeopleFun';
    cmp.storage.save('newoa_selPeople', selPeople);
    /*appcan.window.open({
        name : 'newoa_duoxuan',
        data : 'newoa_duoxuan.html',
        aniId : 10,
        type : 4
    });*/
}

//通用：选择项目
function selectProject_danxuan(obj) {
    var rum = String(Math.random()).substring(2, 7);
    $(obj).addClass("selPeopleMark" + rum);
    $("#tempContentData").attr("data-selPeople", "selPeopleMark" + rum);
    var selPeople = new Object();
    selPeople.rootName = 'xietongdetail';
    selPeople.popName = 'content';
    selPeople.funName = 'selectPeopleFun';
    cmp.storage.save('newoa_selPeople', selPeople);
    /*appcan.window.open({
        name : 'newoa_project',
        data : 'newoa_project.html',
        aniId : 10,
        type : 4
    });*/
}

//通用：选择部门
function selectDept_danxuan(obj) {
    var rum = String(Math.random()).substring(2, 7);
    $(obj).addClass("selPeopleMark" + rum);
    $("#tempContentData").attr("data-selPeople", "selPeopleMark" + rum);
    var selPeople = new Object();
    selPeople.rootName = 'xietongdetail';
    selPeople.popName = 'content';
    selPeople.funName = 'selectPeopleFun';
    cmp.storage.save('newoa_selPeople', selPeople);
    /*appcan.window.open({
        name : 'newoa_dept',
        data : 'newoa_dept.html',
        aniId : 10,
        type : 4
    });*/
}

//通用：[单选人员]、[多选人员]、[选择项目]完成之后的回调方法
function selectPeopleFun(data) {
    var selPeople = $("#tempContentData").attr("data-selPeople");
    var infoObj = JSON.parse(data);
    if (infoObj != null && infoObj.length > 0) {
        $("." + selPeople).attr("value", infoObj[0].name);
        $("." + selPeople).attr("default", infoObj[0].id);
    }
}

//通用方法，生成：增加一行和删除一行
function showRepeatingTableBtn(xml, input_xml) {
    $(input_xml).find("SlaveTable").each(function(index1, element1) {
        var slaveTableObj = new Object();
        var input_name = $(element1).attr("name");
        var input_allowadd = $(element1).attr("allowadd");
        var input_allowdelete = $(element1).attr("allowdelete");
        if ("true" == input_allowadd && "true" == input_allowdelete) {
            var html = '<div id="formPageBtn" style="margin-top: 0.2em;white-space:nowrap;overflow: hidden;text-overflow:ellipsis;">';
            html += '<button id="repeatiAddBtn" class="ub-ac bc-text-head ub-pc bc-btn" style="font-size: 1.2em;" onclick="repeatiAddBtn(this);">增加一行(+)</button>';
            html += '<button id="repeatiSubBtn" class="ub-ac bc-text-head ub-pc bc-btn" style="font-size: 1.2em;" onclick="repeatiSubBtn(this);">删除一行(-)</button>';
            html += '</div>';
            $("tbody[xd\\:xctname='RepeatingTable'] tr[path$='/" + input_name + "']").each(function(index7, element7) {
                if (0 == index7) {
                    $(element7).parent().after(html);
                }
            })
        }
    })
}

//增加一行
function repeatiAddBtn(obj) {
    //新增一行时将该新增行recordid的属性设置为-1作为标记,方便后边处理数据
    var html = $(obj).parent().parent().find("tbody[xd\\:xctname='RepeatingTable'] tr").last();
    var newHTML = html.clone();
    var textareaArr = new Array();
    var textarea = $(html).find("TEXTAREA");
    if (textarea.length > 0) {
        textarea.each(function(index, element) {
            var textareaValue = $(element).val();
            textareaArr.push(textareaValue);
        })
        for (var i = 0; i < textareaArr.length; i++) {
            $(newHTML).find("TEXTAREA").eq(i).val(textareaArr[i]);
        }
    }
    newHTML = $(newHTML).attr("recordid", "-1");
    $(html).after(newHTML);
}

//删除一行
function repeatiSubBtn(obj) {
    var html = $(obj).parent().parent().find("tbody[xd\\:xctname='RepeatingTable'] tr");
    var num = html.length;
    if (num >= 2) {
        $(html).last().remove();
    } else {
        appcan.window.alert({
            title : "提醒",
            content : "不能再删了",
            buttons : ['确定'],
            callback : function(err, data, dataType, optId) {
            }
        })
    }
}

//输入框的值改变
function input_changeElement(element) {
    var templeteId = cmp.storage.get('templeteId');
    if ("788424823177561202" == templeteId || "-2481447930518813670" == templeteId || "-517030576051564970" == templeteId || "-4144159433128721696" == templeteId) {
        //电脑资产申请、调配、调拨、核价、申购、入库单(地产公司适用)
        //电脑资产申请、调配、调拨、核价、申购、入库单(环保集团适用)
        //电脑资产申请、调配、调拨、核价、申购、入库单(直管公司适用)
        //电脑资产申请、调配、调拨、核价、申购、入库单(雅生活板块适用)
        var editObj_id = $(element).attr("id");
        //需申购数量
        if ("my需申购数量" == editObj_id || "my采购单价" == editObj_id) {
            var total_XJ = 0;
            var total_RMBXJ = 0;
            $("tbody[xd\\:xctname='RepeatingTable'] tr[path='my:组1/my:组2']").each(function(index, element) {
                var temp_XSGSL = $(element).find("#my需申购数量").val();
                var temp_CGDJ = $(element).find("#my采购单价").val();
                if (undefined == temp_XSGSL || 'undefined' == temp_XSGSL) {
                    var temp_XSGSL_default = $(element).find("span[xd\\:binding='my:需申购数量'] pre").attr("default");
                    var XSGSL_default = Number(temp_XSGSL_default);
                    if ('NaN' != String(temp_XSGSL_default)) {
                        temp_XSGSL = XSGSL_default;
                    }
                }
                if (undefined == temp_CGDJ || 'undefined' == temp_CGDJ) {
                    var temp_CGDJ_default = $(element).find("span[xd\\:binding='my:采购单价'] pre").attr("default");
                    var CGDJ_default = Number(temp_CGDJ_default);
                    if ('NaN' != String(temp_CGDJ_default)) {
                        temp_CGDJ = CGDJ_default;
                    }
                }
                var temp_HL = $(element).find("#my汇率").val();
                var XSGSL = Number(temp_XSGSL);
                var CGDJ = Number(temp_CGDJ);
                var HL = Number(temp_HL);
                if ('NaN' == String(XSGSL)) {
                    XSGSL = 0;
                    $(element).find("#my需申购数量").val(0);
                    $(element).find("#my需申购数量").attr("value", 0);
                }
                if ('NaN' == String(CGDJ)) {
                    CGDJ = 0;
                    $(element).find("#my采购单价").val(0);
                    $(element).find("#my采购单价").attr("value", 0);
                }
                if ('NaN' == String(HL)) {
                    HL = 1;
                    $(element).find("select[id='my币种'] option").eq(1).prop("selected", true);
                    //人民币
                    $(element).find("#my汇率").val("");
                    $(element).find("#my汇率").attr("value", "");
                }
                var XJ = XSGSL * CGDJ;
                var RMBXJ = XSGSL * CGDJ * HL;
                total_XJ += XJ;
                total_RMBXJ += RMBXJ;
                $(element).find("#my小计").val(XJ);
                $(element).find("#my小计").attr("value", XJ);
                $(element).find("#my人民币小计").val(RMBXJ);
                $(element).find("#my人民币小计").attr("value", RMBXJ);
            })
            if ('NaN' != String(total_XJ)) {
                $("#my原币合计").val(total_XJ);
                $("#my原币合计").attr("value", total_XJ);
            } else {
                $("#my原币合计").val(0);
                $("#my原币合计").attr("value", 0);
            }
            if ('NaN' != String(total_RMBXJ)) {
                $("#my合计").val(total_RMBXJ);
                $("#my合计").attr("value", total_RMBXJ);
            } else {
                $("#my合计").val(0);
                $("#my合计").attr("value", 0);
            }
        }
    } else if ("-656673282741353770" == templeteId) {
        //IT项目上线确认单，修改【权重】字段，自动计算【计算分数】和【总分】
        var total = 0;
        $("tr[path='my:组7/my:组8']").each(function(index, element) {
            var num1 = $($(element)[0].children[2]).find("pre").attr("default");
            var num2 = $($(element)[0].children[3]).find("#my权重").val();
            $($(element)[0].children[3]).find("#my权重").attr("value", num2);
            var sum12 = (Number(num1) * Number(num2)) / 100;
            total += sum12;
            $($(element)[0].children[3]).find("#my计算分数").val(sum12);
            $($(element)[0].children[3]).find("#my计算分数").attr("value", sum12);
        })
        $("#my综合评分").val(total.toFixed(2));
        $("#my综合评分").attr("value", total.toFixed(2));
    } else if ("4913029040738159614" == templeteId) {
        //信息中心、区域项目绩效考核表，修改【评分】，自动计算【小计分数】和【得分】
        if (element) {
            var editObj_id = $(element).attr("id");
            if (-1 != editObj_id.indexOf("my评分")) {
                var total = 0;
                //每行的分数
                var field_name = $(element).attr("name");
                var field_name2 = field_name.replace("评分", "小计分数");
                var field_value = $("#" + field_name).val().replace("%", "");
                $("#" + field_name).val(field_value);
                $("#" + field_name).attr("value", field_value);
                if (undefined == field_value || 'NaN' == String(Number(field_value))) {
                    field_value = 0;
                    $("#" + field_name).attr("value", 0);
                    $("#" + field_name).val(0);
                }
                field_value = $("#" + field_name).val();
                if (Number(field_value) >= 0 && Number(field_value) <= 100) {
                } else {
                    if (Number(field_value) < 0) {
                        field_value = 0;
                        $(element).attr("value", 0);
                        $(element).val(0);
                    } else if (Number(field_value) > 100) {
                        field_value = 100;
                        $(element).attr("value", 100);
                        $(element).val(100);
                    }
                    cmp.notification.alert("【评分】数值在0-100之间。",function(){
                        //do something after tap button
                    },"提示","确定","",false,false);
                }
                var cal_value1 = $("#" + field_name2).attr("cal_value1");
                var cal_value2 = $("#" + field_name2).attr("cal_value2");
                var cal_value = ((Number(field_value)) * (Number(cal_value1))) / (Number(cal_value2));
                if (undefined != cal_value && 'NaN' != String(cal_value)) {
                    $("#" + field_name2).attr("value", cal_value);
                    $("#" + field_name2).val(cal_value);
                } else {
                    $("#" + field_name2).attr("value", 0);
                    $("#" + field_name2).val(0);
                }
                //得分
                var tbody = $("tbody[vAlign=top] input[id^='my小计分数']");

                tbody.each(function(index, element) {
                    var temp_value = $(element).val();
                    var value = Number(temp_value);
                    if (undefined != value && 'NaN' != String(value)) {
                        total += value;
                    }
                })
                $("#my得分").attr("value", total.toFixed(2));
                $("#my得分").val(total.toFixed(2));
            }
        } else {
            //得分
            var total = 0;
            var tbody = $("tbody[vAlign=top] input[id^='my小计分数']");
            tbody.each(function(index, element) {
                var temp_value = $(element).val();
                value = Number(temp_value);
                if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                    $(element).attr("value", 0);
                } else {
                    total += value;
                }
            })
            $("#my得分").attr("value", total);
            $("#my得分").val(total);
        }
    } else if ("4915972576696422178" == templeteId || "6560620198130893179" == templeteId) {
        //酒店、球会电脑资产报废申请单
        //电脑资产报废申请单(雅生活适用)
        if (element) {
            var editObj_id = $(element).attr("id");
            if ("my原值" == editObj_id) {
                //酒店、球会电脑资产报废申请单:改变原值时合计改变
                //酒店、球会电脑资产报废申请单:改变净值时合计改变
                var total = 0;
                var field_value = $(element).val();
                var field_name = $(element).attr("id");
                if (undefined == field_value || 'NaN' == String(Number(field_value))) {
                    field_value = 0;
                    $("#" + field_name).attr("value", 0);
                    $("#" + field_name).val(0);
                }
                $("tbody[xd\\:xctname='RepeatingTable'] input[id^='my原值']").each(function(index, element) {
                    var temp_value = $(element).val();
                    var value = Number(temp_value);
                    if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                        $(element).attr("value", 0);
                        $(element).val(0);
                    } else {
                        total += value;
                    }
                })
                $("#my原值合计").attr("value", total);
                $("#my原值合计").val(total);
            } else if ("my净值" == editObj_id) {
                var total = 0;
                var field_value = $(element).val();
                var field_name = $(element).attr("id");
                if (undefined == field_value || 'NaN' == String(Number(field_value))) {
                    field_value = 0;
                    $("#" + field_name).attr("value", 0);
                    $("#" + field_name).val(0);
                }
                $("tbody[xd\\:xctname='RepeatingTable'] input[id^='my净值']").each(function(index, element) {
                    var temp_value = $(element).val();
                    var value = Number(temp_value);
                    if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                        $(element).attr("value", 0);
                        $(element).val(0);
                    } else {
                        total += value;
                    }
                })
                $("#my净值合计").attr("value", total);
                $("#my净值合计").val(total);
            }
        } else {
            var YZ_total = 0;
            $("tbody[xd\\:xctname='RepeatingTable'] input[id^='my原值']").each(function(index, element) {
                var temp_value = $(element).val();
                value = Number(temp_value);
                if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                    $(element).attr("value", 0);
                    $(element).val(0);
                } else {
                    YZ_total += value;
                }
            })
            $("#my原值合计").attr("value", YZ_total);
            $("#my原值合计").val(YZ_total);
            var JZ_total = 0;
            $("tbody[xd\\:xctname='RepeatingTable'] input[id^='my净值']").each(function(index, element) {
                var temp_value = $(element).val();
                var value = Number(temp_value);
                if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                    $(element).attr("value", 0);
                    $(element).val(0);
                } else {
                    JZ_total += value;
                }
            })
            $("#my净值合计").attr("value", JZ_total);
            $("#my净值合计").val(JZ_total);
        }
    } else if ("767573886514053883" == templeteId) {
        //招拍挂项目启动单
        //公式2条
        //{成交信息_总地价} + {成交信息_竞配套面积} * {成交信息_竞配建单方造价} / 10000
        //{成交信息_实际拿地成本} / {成交信息_实际计容可售} * 10000
        var editObj_id = $(element).attr("id");
        if ("my成交信息_总地价" == editObj_id || "my成交信息_竞配套面积" == editObj_id || "my成交信息_竞配建单方造价" == editObj_id || "my成交信息_实际计容可售" == editObj_id) {
            var curVal = $(element).val();
            if ("NaN" == String(Number(curVal))) {
                cmp.notification.alert("只能是数字",function(){
                    //do something after tap button
                },"提示","确定","",false,false);
            } else {
                var CJXX_ZDJ = $("#my成交信息_总地价").val();
                var CJXX_JPTMJ = $("#my成交信息_竞配套面积").val();
                var CJXX_JPJDFZJ = $("#my成交信息_竞配建单方造价").val();
                var CJXX_SJJRKS = $("#my成交信息_实际计容可售").val();
                //成交信息_实际拿地成本
                var CJXX_SJNDCB = (Number(CJXX_ZDJ) + Number(CJXX_JPJDFZJ) * Number(CJXX_JPJDFZJ) / 10000).toFixed(0);
                //成交信息_计容可售楼面价
                var CJXX_JSKSLMJ = (Number(CJXX_SJNDCB) / Number(CJXX_SJJRKS) * 10000).toFixed(0);
                $("#my成交信息_实际拿地成本").val(CJXX_SJNDCB);
                $("#my成交信息_计容可售楼面价").val(CJXX_JSKSLMJ);
            }
        }
    } else if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
        //区域公司预算解锁调整审批单
        //集团本部预算解锁调整审批单
        //改变[本次批复金额]时计算[本次批复金额合计]
        var YZ_total = 0;
        var editObj_id = $(element).attr("id");
        if ("my本次批复金额" == editObj_id) {
            $("input[id='my本次批复金额']").each(function(index, element) {
                var temp_value = $(element).val();
                value = Number(temp_value);
                if (undefined == value || 'NaN' == String(value) || 0 == value || '' == value) {
                    $(element).attr("value", 0);
                    $(element).val(0);
                } else {
                    YZ_total += value;
                }
            })
            $("#my本次批复金额合计").attr("value", YZ_total);
            $("#my本次批复金额合计").val(YZ_total);
        }
    } else if ("8922205370062031803" == templeteId || "-7119516754335742861" == templeteId) {
        //招拍挂项目启动单,收并购项目启动单
        //计算权重总和
        var qz_total = 0;
        var editObj_id = $(element).attr("id");
        if (editObj_id.indexOf("my权重_") != -1) {
            $("tbody[valign='top']").each(function(index, element1) {
                var tempTrArr = $(element1).find("tr")
                for (var i = 0; i < tempTrArr.length; i++) {
                    var tempTdText = $(tempTrArr[i]).find("td").eq(0).text()
                    if (tempTdText == '投资' || tempTdText == '营销' || tempTdText == '设计/开发' || tempTdText == '成本' || tempTdText == '运营' || tempTdText == '资金部') {
                        qz_total += Number($(tempTrArr[i]).find("td").eq(2).find("input").val());
                    } else if (tempTdText == '税务部' || tempTdText == '法务' || tempTdText == '商业' || tempTdText == '酒店' || tempTdText == '教育') {
                        qz_total += Number($(tempTrArr[i]).find("td").eq(2).find("input").val());
                    }
                }
            });
            $("#my权重总和").val(qz_total);
        }

    }
}

//下拉框改变
function opt_changeSelecte(element) {
    var templeteId = cmp.storage.get('templeteId');
    if ("788424823177561202" == templeteId || "-2481447930518813670" == templeteId || "-517030576051564970" == templeteId || "-4144159433128721696" == templeteId) {
        var editObj_id = $(element).attr("id");
        if ("my币种" == editObj_id) {
            var selectedValue = $(element).val();
            getExchangeRate(element, selectedValue);
        }
    } else if ("-1192552355850794725" == templeteId) {//网站栏目
        console.log(element);
        //  var metadataid= $(element).attr('metadataid');

        var index = element.selectedIndex;

        var metadataid = $(element.options[index]).attr("metadataid");
        console.log(metadataid);
        getMetadataItem(metadataid);

    }
}

//获取网站二级栏目

function getMetadataItem(id) {

    var serviceUrl = cmp.storage.get('ygzzserviceUrl');
    var username = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var metadataid = id;
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'newoa_wzlm',
        //  'branch' : '',
        'metadataid' : metadataid,
        'username' : username
        //'password' : password
    };
    obj.successFun = 'metadataid_success';
    ajaxJson_v1(obj);

}

function metadataid_success(data) {
    console.log(data);

    var div = $("#my二级栏目");
    var lanmu = $("#my二级栏目").val();
    console.log(div);
    var metadataItem = data.metadataItem.DATA;
    console.log(metadataItem);
    var html = '';
    html += '<select id ="my二级栏目" name="my二级栏目" class="inputconmom backgroundconmom1 widthpercent100">'

    $(metadataItem).each(function(index, metadataItem) {

        var metadataItemid = metadataItem.metadataItemId;
        var metadataItemName = metadataItem.metadataItemName;
        if (lanmu == metadataItemName) {
            html += "<option value=" + metadataItemid + "   selected>" + metadataItemName + "</option>";
        }
        html += "<option value=" + metadataItemid + ">" + metadataItemName + "</option>";

    })
    html += '</select>'

    console.log(html)

    $(div).prop('outerHTML', html);
}

//电脑资产申请、调配、调拨、核价、申购、入库单：查询汇率
function getExchangeRate(element, currency) {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'newoa_exchangeRate',
        'stype' : 'exchangeRate',
        'username' : loginname,
        //'password' : password,
        'currency' : currency
    };
    obj.successFun = 'cbExchangeRate';
    obj.ext = element;
    obj.async = false;
    ajaxJson_v1(obj);
}

//汇率查询成功的回调
function cbExchangeRate(data, ext) {
    var editObj_id = $(ext).attr("id");
    var er = data.exchangeRate.DATA;
    var erNum = Number(er);
    if ('NaN' == String(erNum)) {
        cmp.notification.alert("汇率转换出错，请联系OA管理员。",function(){
            //do something after tap button
            $(ext).find("select[id=" + editObj_id + "] option").eq(0).prop("selected", true);
            $(ext).next().attr("value", 1);
            $(ext).next().val(1);
            return false;
        },"提示","确定","",false,false);
        
    } else {
        //$(ext).next().attr("value",erNum);
        //$(ext).next().val(erNum);
        $(ext).parent().find("#my汇率").attr("value", erNum);
        $(ext).parent().find("#my汇率").val(erNum);
        $(ext).parent().find("#my汇率").val(erNum);
        $(ext).parent().find("span[xd\\:binding='my:汇率']").attr("default", erNum);
        //重复行的数据:重新计算每一个值
        var total_XJ = 0;
        var total_RMBXJ = 0;
        $("tbody[xd\\:xctname='RepeatingTable'] tr[path='my:组1/my:组2']").each(function(index, element) {
            var temp_XSGSL = $(element).find("#my需申购数量").val();
            var temp_CGDJ = $(element).find("#my采购单价").val();
            if (undefined == temp_XSGSL || 'undefined' == temp_XSGSL) {
                var temp_XSGSL_default = $(element).find("span[xd\\:binding='my:需申购数量'] pre").attr("default");
                var XSGSL_default = Number(temp_XSGSL_default);
                if ('NaN' != String(temp_XSGSL_default)) {
                    temp_XSGSL = XSGSL_default;
                }
            }
            if (undefined == temp_CGDJ || 'undefined' == temp_CGDJ) {
                var temp_CGDJ_default = $(element).find("span[xd\\:binding='my:采购单价'] pre").attr("default");
                var CGDJ_default = Number(temp_CGDJ_default);
                if ('NaN' != String(temp_CGDJ_default)) {
                    temp_CGDJ = CGDJ_default;
                }
            }
            var temp_HL = $(element).find("#my汇率").val();
            if (undefined == temp_HL) {
                temp_HL = $(element).find("span[xd\\:binding='my:汇率']").attr("default");
            }
            var XSGSL = Number(temp_XSGSL);
            var CGDJ = Number(temp_CGDJ);
            var HL = Number(temp_HL);
            if ('NaN' == String(XSGSL)) {
                XSGSL = 0;
                $(element).find("#my需申购数量").val(0);
                $(element).find("#my需申购数量").attr("value", 0);
            }
            if ('NaN' == String(CGDJ)) {
                CGDJ = 0;
                $(element).find("#my采购单价").val(0);
                $(element).find("#my采购单价").attr("value", 0);
            }
            var XJ = XSGSL * CGDJ;
            var RMBXJ = XSGSL * CGDJ * HL;
            total_XJ += XJ;
            $(element).find("#my小计").val(XJ);
            $(element).find("#my小计").attr("value", XJ);
            if ('NaN' != String(RMBXJ)) {
                total_RMBXJ += RMBXJ;
                $(element).find("#my人民币小计").val(RMBXJ);
                $(element).find("#my人民币小计").attr("value", RMBXJ);
            } else {
                $(element).find("#my人民币小计").val(0);
                $(element).find("#my人民币小计").attr("value", 0);
            }
        })
        if ('NaN' != String(total_XJ)) {
            $("#my原币合计").val(total_XJ);
            $("#my原币合计").attr("value", total_XJ);
        } else {
            $("#my原币合计").val(0);
            $("#my原币合计").attr("value", 0);
        }
        if ('NaN' != String(total_RMBXJ)) {
            $("#my合计").val(total_RMBXJ);
            $("#my合计").attr("value", total_RMBXJ);
        } else {
            $("#my合计").val(0);
            $("#my合计").attr("value", 0);
        }
    }
}

//这里是入口：提交表单数据,开始审批操作
//调用该方法,下面4个方法都会被会按照顺序的执行
//该方法的作用是将input_xml中的数据整理封装在xmlData中,方便后续使用
function submitFormData(title, templeteId) {
    //一般的流程或是公文
    var dataBodyType = $("#tempContentData").attr("data-bodytype");
    //原始的input_xml配置文件
    var inputXML = $("#tempContentData").attr("data-input_xml");
    //原始的xml配置文件
    var xml = $("#tempContentData").attr("data-xml");
    //表单是否允许在移动端编辑
    var CEF = isCanEditForm(templeteId);
    if ("FORM" == dataBodyType) {
        //一般的流程
        //xmlData:全部的数据都是封装在该对象中
        var xmlData = new Object();
        //repeatiArr：重复行的数据封装在该对象中
        var repeatiArr = new Array();
        //nonRepeatiArr:非重复行的数据封装在该对象中
        var nonRepeatiArr = new Array();
        //accessEditDetailArr:允许编辑的数据项非常详细的封装在该对象中
        var accessEditDetailArr = new Array();
        //accessEditArr:简单的记录可编辑项
        var accessEditArr = new Array();
        //fieldInputArr:一开始定义这个变量是为了解决[通用信息服务申请单]数据众多的问题
        var fieldInputArr = new Array();
        //fieldInputUpperCaseArr:一开始定义这个变量是为了方便解决一些兼容问题
        var fieldInputUpperCaseArr = new Array();
        //这个循环可以获取获取所有输入项,但是还没有分装详细的内容
        //一开始定义这个变量是为了解决[通用信息服务申请单]数据众多的问题
        $(inputXML).find("FieldInput[name^=my]").each(function(index0, element0) {
            var fildName = $(element0).attr("name");
            fieldInputArr.push(fildName);
            fieldInputUpperCaseArr.push(fildName.toUpperCase());
        })
        xmlData.fieldInputArr = fieldInputArr;
        xmlData.fieldInputUpperCaseArr = fieldInputUpperCaseArr;
        //这个循环可以获取重复行的相关属性,但是还不能知道重复行完整的结构
        $(inputXML).find("SlaveTable").each(function(index1, element1) {
            var slaveTableObj = new Object();
            var input_name = $(element1).attr("name");
            var input_allowadd = $(element1).attr("allowadd");
            var input_allowdelete = $(element1).attr("allowdelete");
            slaveTableObj.selfNodeName = input_name;
            slaveTableObj.allowadd = input_allowadd;
            slaveTableObj.allowdelete = input_allowdelete;
            repeatiArr.push(slaveTableObj);
        })
        xmlData.repeatiArr = repeatiArr;
        xmlData.title = title;
        xmlData.templeteId = templeteId;
        var repeatingTableArr = new Array();
        if ("-1682276082661768178" == templeteId) {
            //[通用信息服务申请单]存在较多的重复行,需要标记无关的可编辑项,方便后面数据处理
            //此处循环是得到页面上显示的重复行,并得到组重复行的结构,也就是下面定义的pathPrev
            $("tbody[xd\\:xctname='RepeatingTable']").each(function(index01, element01) {
                var isShow = $(element01).parent().css("display");
                if ("none" != isShow) {
                    $(element01).find("tr").each(function(index02, element02) {
                        if (0 == index02) {
                            var pathObj = new Object();
                            var repeatingTablePath = $(element02).attr("path");
                            var pathArr = repeatingTablePath.split("/");
                            pathObj.repeatingTablePath = repeatingTablePath;
                            pathObj.pathPrev = pathArr[0];
                            pathObj.pathNext = pathArr[1];
                            repeatingTableArr.push(pathObj);
                        }
                    })
                }
            })
        }
        //需要对传进来的xml去掉一些没用的部分和加上一些有用的部分
        xmlData.repeatingTableArr = repeatingTableArr;
        var reg01 = new RegExp('<my:myFields\\s+xmlns:my=".*?"\\s+recordid=".*?">\\s+(.*)');
        xml.replace(reg01, function() {
            xml = "<xml><my:myFields>" + arguments[1] + "</xml>";
        });
        //此处循环是封装重复行的详细信息
        for (var i = 0; i < repeatiArr.length; i++) {
            var repeatiBody = new Array();
            var selfNodeName = repeatiArr[i].selfNodeName;
            var slaveTableName = selfNodeName.replace(":", "\\:").replace(".", "\\.");
            $(xml).find(slaveTableName).each(function(index2, element2) {
                if (0 == index2) {
                    //对parentNodeName大小写处理不要轻易改动,可能影响[通用信息服务申请单]对重复行数据的发送
                    var parentNodeName = $(element2).parent()[0].nodeName;
                    if (null != parentNodeName && undefined != parentNodeName) {
                        parentNodeName = parentNodeName.replace("MY:", "my:");
                    }
                    repeatiArr[i].parentNodeName = parentNodeName;
                    $(element2).children().each(function(index3, element3) {
                        var inputObj = new Object();
                        //此处5行兼容代码，处理标签大小写问题：重要
                        var childNodeName = $(element3)[0].nodeName;
                        var indexUpperCase = fieldInputUpperCaseArr.indexOf(childNodeName);
                        if (-1 != indexUpperCase) {
                            childNodeName = fieldInputArr[indexUpperCase];
                        }
                        inputObj.childNodeName = childNodeName;
                        $(inputXML).find("FieldInput[name='" + childNodeName + "']").each(function(index4, element4) {
                            if (0 == index4) {
                                inputObj.type = $(element4).attr("type");
                                inputObj.fieldtype = $(element4).attr("fieldtype");
                                inputObj.name = $(element4).attr("name");
                                inputObj.id = $(element4).attr("name").replace(":", "");
                                inputObj.fieldlength = $(element4).attr("length");
                                inputObj.extendNameType = $(element4).attr("extendNameType");
                                inputObj.dataName = $(element4).attr("name");
                                inputObj.dataType = $(element4).attr("type");
                                inputObj.dataFieldtype = $(element4).attr("fieldtype");
                                inputObj.dataLength = $(element4).attr("length");
                                inputObj.dataAccess = $(element4).attr("access");
                                inputObj.extendExtendNameType = $(element4).attr("extendNameType");
                                inputObj.dataAllowprint = $(element4).attr("allowprint");
                                inputObj.dataAllowtransmit = $(element4).attr("allowtransmit");
                                inputObj.dataIsUnique = $(element4).attr("isUnique");
                                inputObj.dataIsNull = $(element4).attr("is_null");
                                inputObj.dataIsFile = $(element4).attr("is_file");
                                inputObj.dataIsImage = $(element4).attr("isImage");
                                inputObj.dataIsDisplayBaseForm = $(element4).attr("isDisplayBaseForm");
                                inputObj.dataAllowmodify = $(element4).attr("allowmodify");
                                inputObj.dataFormattype = $(element4).attr("formattype");
                                inputObj.dataFormAppId = $(element4).attr("formAppId");
                                inputObj.dataRelInputAtt = $(element4).attr("relInputAtt");
                                inputObj.dataSelectType = $(element4).attr("selectType");
                                inputObj.dataRelationConditionId = $(element4).attr("relationConditionId");
                                inputObj.dataIsDisplayRelated = $(element4).attr("isDisplayRelated");
                                inputObj.dataIsFinChild = $(element4).attr("isFinChild");
                            }
                        })
                        if ("edit" == inputObj.dataAccess && undefined != inputObj.type && "lable" != inputObj.type && "relation" != inputObj.type) {
                            if ("-1682276082661768178" == xmlData.templeteId) {
                                //reArr:在页面上能看到的重复发行
                                //此处有些复杂,定义isContent是为了解决[通用信息服务申请单]数据众多的问题
                                //[通用信息服务申请单]存在较多的重复行,需要标记无关的可编辑项,方便后面数据处理
                                var rtArr = xmlData.repeatingTableArr;
                                if (rtArr.length > 0) {
                                    var isContent = false;
                                    for (var i = 0; i < rtArr.length; i++) {
                                        if (rtArr[i].pathPrev == parentNodeName && rtArr[i].pathNext == selfNodeName) {
                                            isContent = true;
                                        }
                                    }
                                    if (isContent == true) {
                                        inputObj.dataBodyCanSend = 'true';
                                        accessEditDetailArr.push(inputObj);
                                        accessEditArr.push(childNodeName);
                                    } else {
                                        inputObj.dataBodyCanSend = 'false';
                                    }
                                } else {
                                    inputObj.dataBodyCanSend = 'false';
                                    accessEditDetailArr.push(inputObj);
                                    accessEditArr.push(childNodeName);
                                }
                            } else {
                                inputObj.dataBodyCanSend = 'true';
                                accessEditDetailArr.push(inputObj);
                                accessEditArr.push(childNodeName);
                            }
                        }
                        repeatiBody.push(inputObj);
                    })
                    repeatiArr[i].body = repeatiBody;
                }
            })
        }
        //此处循环是封装非重复行的详细信息
        $(xml).find("my\\:myFields").children().each(function(index5, element5) {
            var childLength = $(element5).children().length;
            if (0 == childLength) {
                var inputObj = new Object();
                //此处5行兼容代码，处理标签大小写问题：重要
                var childNodeName = $(element5)[0].nodeName;
                var indexUpperCase = fieldInputUpperCaseArr.indexOf(childNodeName);
                if (-1 != indexUpperCase) {
                    childNodeName = fieldInputArr[indexUpperCase];
                }
                inputObj.childNodeName = childNodeName;
                $(inputXML).find("FieldInput[name='" + childNodeName + "']").each(function(index6, element6) {
                    if (0 == index6) {
                        inputObj.type = $(element6).attr("type");
                        inputObj.fieldtype = $(element6).attr("fieldtype");
                        inputObj.name = $(element6).attr("name");
                        inputObj.id = $(element6).attr("name").replace(":", "");
                        inputObj.fieldlength = $(element6).attr("length");
                        inputObj.extendNameType = $(element6).attr("extendNameType");
                        inputObj.dataName = $(element6).attr("name");
                        inputObj.dataType = $(element6).attr("type");
                        inputObj.dataFieldtype = $(element6).attr("fieldtype");
                        inputObj.dataLength = $(element6).attr("length");
                        inputObj.dataAccess = $(element6).attr("access");
                        inputObj.extendExtendNameType = $(element6).attr("extendNameType");
                        inputObj.dataAllowprint = $(element6).attr("allowprint");
                        inputObj.dataAllowtransmit = $(element6).attr("allowtransmit");
                        inputObj.dataIsUnique = $(element6).attr("isUnique");
                        inputObj.dataIsNull = $(element6).attr("is_null");
                        inputObj.dataIsFile = $(element6).attr("is_file");
                        inputObj.dataIsImage = $(element6).attr("isImage");
                        inputObj.dataIsDisplayBaseForm = $(element6).attr("isDisplayBaseForm");
                        inputObj.dataAllowmodify = $(element6).attr("allowmodify");
                        inputObj.dataFormattype = $(element6).attr("formattype");
                        inputObj.dataFormAppId = $(element6).attr("formAppId");
                        inputObj.dataRelInputAtt = $(element6).attr("relInputAtt");
                        inputObj.dataSelectType = $(element6).attr("selectType");
                        inputObj.dataRelationConditionId = $(element6).attr("relationConditionId");
                        inputObj.dataIsDisplayRelated = $(element6).attr("isDisplayRelated");
                        inputObj.dataIsFinChild = $(element6).attr("isFinChild");
                    }
                })
                if ("edit" == inputObj.dataAccess && undefined != inputObj.type && "lable" != inputObj.type && "relation" != inputObj.type) {
                    accessEditDetailArr.push(inputObj);
                    accessEditArr.push(childNodeName);
                }
                nonRepeatiArr.push(inputObj);
                xmlData.nonRepeatiArr = nonRepeatiArr;
            }
        })
        xmlData.accessEditDetailArr = accessEditDetailArr;
        xmlData.accessEditArr = accessEditArr;
        //获取表单数据
        getFormData(xmlData, inputXML, xml, templeteId, CEF);
    } else if ("OfficeWord" == dataBodyType || "HTML" == dataBodyType) {
        //公文或新闻
        cmp.storage.save('newoa_formData', false);
        cmp.storage.save('newoa_fullData', false);

        cmp.webViewListener.fire({
            type:"banli_getbranch",  //此参数必须和webview1注册的事件名相同
            data:{}
        });
        //uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
    } else {
        //其它未知流程
        cmp.webViewListener.fire({
            type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
            data:{
                "type":"3",
                "content":"请重新尝试：未知的BODY_TYPE类型。"
            }
        });
        //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','请重新尝试：未知的BODY_TYPE类型。');");
    }
}

//获取表单数据:此方法最有可能出错
//该方法的作用是对可移动端编辑的表单进行formData和fullData参数的拼接
//如果表单不允许在移动端编辑则对输入项的判断或是直接提交表单
function getFormData(xmlData, inputXML, xml, templeteId, CEF) {

    console.log(xmlData);
    if (CEF == true) {

        //能进入这里代表已是允许在移动端编辑
        try {
            //开始拼接formData和fullData
            var formData = '';
            var fullData = '';
            formData += '<FormData type="seeyonfrom">';
            formData += '<Engine>infopath</Engine>';
            formData += '<SubmitData type="submit" state="">';
            formData += '<my:myFields>';
            fullData = formData;
            //非重复行可填项的拼接
            var nonRepeatiArr = xmlData.nonRepeatiArr;
            for (var i = 0; i < nonRepeatiArr.length; i++) {
                var editObj_id = nonRepeatiArr[i].id;
                var editObj_name = nonRepeatiArr[i].name;
                var editObj_type = nonRepeatiArr[i].type;
                var editObj_access = nonRepeatiArr[i].dataAccess;
                var editObj_ENT = nonRepeatiArr[i].extendNameType;
                if ("edit" == editObj_access) {
                    if (('text' == editObj_type || 'relation' == editObj_type || 'textarea' == editObj_type) || ('extend' == editObj_type && ('日期选取器' == editObj_ENT || '日期时间选取器' == editObj_ENT))) {
                        formData += '<' + editObj_name + '>';
                        if ($("#" + editObj_id).val() != '') {
                            formData += $("#" + editObj_id).val();
                        } else {
                            formData += 0;
                        }
                        formData += '</' + editObj_name + '>';
                        //---------
                        fullData += '<' + editObj_name + '>';
                        fullData += $("#" + editObj_id).val();
                        fullData += '</' + editObj_name + '>';
                    } else if ('checkbox' == editObj_type) {
                        var a = document.getElementById(editObj_id);
                        formData += '<' + editObj_name + '>';
                        if (a.checked) {

                            formData += 1;

                        } else {
                            formData += 0;
                        }
                        formData += '</' + editObj_name + '>';

                        //---------
                        fullData += '<' + editObj_name + '>';
                        if (a.checked) {
                            fullData += 1;
                        } else {
                            fullData += 0;
                        }
                        fullData += '</' + editObj_name + '>';

                    } else if ('select' == editObj_type) {
                        var selectedValue = $("#"+editObj_id)[0].value;
                        var selectedText = $("#"+editObj_id).find("option[value='"+selectedValue+"']")[0].text;
                        formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                        formData += selectedValue;
                        formData += '</' + editObj_name + '>';
                        //---------
                        fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                        fullData += selectedText;
                        fullData += '</' + editObj_name + '>';
                    } else if ('extend' == editObj_type && ('选择单位' == editObj_ENT || '选择部门' == editObj_ENT || '选择人员' == editObj_ENT)) {
                        var selectedValue = $("#" + editObj_id).attr("default");
                        var selectedText = $("#" + editObj_id).val();
                        if (selectedValue == null || selectedValue == 'null') {
                            formData += '<' + editObj_name + '>';
                            formData += '</' + editObj_name + '>';
                            //---------
                            fullData += '<' + editObj_name + ' >';
                            fullData += selectedText;
                            fullData += '</' + editObj_name + '>';
                        } else {
                            formData += '<' + editObj_name + ' value="' + selectedValue + '">';

                            formData += selectedValue;
                            formData += '</' + editObj_name + '>';
                            //---------
                            fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                            fullData += selectedText
                            fullData += '</' + editObj_name + '>';
                        }
                    }
                }
            }
            //重复行可填项的拼接
            var repeatiArr = xmlData.repeatiArr;
            for (var i = 0; i < repeatiArr.length; i++) {
                //dataBodyCanSend:该变量的定义一开始是为了解决[通用信息服务申请单]数据众多的问题
                var isBodyNeedEdit = false;
                var repeatiBody = repeatiArr[i].body;
                //此处[预算解锁调整审批单]有问题：input_xml有重复行的标记,但是xml与之对应的重复行数据不完整,其它单据未发现问题。
                //当repeatiBody为undefined是跳过重复行
                if (undefined != repeatiBody) {
                    for (var k = 0; k < repeatiBody.length; k++) {
                        var needEdit = repeatiBody[k].dataAccess;
                        var dataBodyCanSend = repeatiBody[k].dataBodyCanSend;
                        if ("edit" == needEdit && 'true' == dataBodyCanSend) {
                            isBodyNeedEdit = true;
                            break;
                        }
                    }
                }
                if (isBodyNeedEdit == true) {
                    //一张单据可能存在众多的重复行,只有允许编辑的重复行才会进入这里
                    var repeatiParentNodeName = repeatiArr[i].parentNodeName;
                    var repeatiSelfNodeName = repeatiArr[i].selfNodeName;
                    var repetiPath = repeatiArr[i].parentNodeName + "/" + repeatiArr[i].selfNodeName;
                    formData += '<' + repeatiParentNodeName + '>';
                    fullData += '<' + repeatiParentNodeName + '>';
                    var repeatingTableTbody = "tbody[xd\\:xctname='RepeatingTable'] tr[path='" + repetiPath + "']";
                    //此处：[区域公司预算解锁调整审批单]和[集团本部预算解锁调整审批单]两张的页面重复行标记的位置标签与其它表单不一样
                    if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
                        repeatingTableTbody = "div[path='" + repetiPath + "']";
                    }
                    //审计监察发现事项整改计划完成卡
                    if ("-4075340959497236759" == templeteId) {
                        repeatingTableTbody = "div[path='" + repetiPath + "']";
                    }
                    $(repeatingTableTbody).each(function(index7, element7) {
                        var pathRecordId = $(element7).attr("recordid");
                        if ("-1" == pathRecordId) {
                            //当前新增的行
                            formData += '<' + repeatiSelfNodeName + ' state="add" sort="' + index7 + '">';
                            fullData += '<' + repeatiSelfNodeName + ' state="add" sort="' + index7 + '">';
                        } else {
                            //本来存在的行
                            formData += '<' + repeatiSelfNodeName + ' recordid="' + pathRecordId + '" sort="' + index7 + '">';
                            fullData += '<' + repeatiSelfNodeName + ' recordid="' + pathRecordId + '" sort="' + index7 + '">';
                        }
                        for (var j = 0; j < repeatiBody.length; j++) {
                            var editObj_id = repeatiBody[j].id;
                            var editObj_name = repeatiBody[j].name;
                            var editObj_type = repeatiBody[j].type;
                            var editObj_access = repeatiBody[j].dataAccess;
                            var editObj_ENT = repeatiBody[j].extendNameType;
                            if ("edit" == editObj_access) {
                                if (('text' == editObj_type || 'relation' == editObj_type || 'textarea' == editObj_type) || ('extend' == editObj_type && ('日期选取器' == editObj_ENT || '日期时间选取器' == editObj_ENT))) {
                                    formData += '<' + editObj_name + '>';
                                    formData += $(element7).find("#" + editObj_id).val();
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + '>';
                                    fullData += $(element7).find("#" + editObj_id).val();
                                    fullData += '</' + editObj_name + '>';
                                } else if ('select' == editObj_type) {
                                    var selectedValue = $(element7).find("#"+editObj_id)[0].value;
                                    var selectedText = $(element7).find("#"+editObj_id).find("option[value='"+selectedValue+"']")[0].text;
                                    formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    formData += selectedValue;
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    fullData += selectedText;
                                    fullData += '</' + editObj_name + '>';
                                } else if ('extend' == editObj_type && ('选择单位' == editObj_ENT || '选择部门' == editObj_ENT || '选择人员' == editObj_ENT)) {
                                    var selectedValue = $(element7).find("#" + editObj_id).attr("default");
                                    var selectedText = $(element7).find("#" + editObj_id).val();
                                    formData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    formData += selectedValue;
                                    formData += '</' + editObj_name + '>';
                                    //------------
                                    fullData += '<' + editObj_name + ' value="' + selectedValue + '">';
                                    fullData += selectedText;
                                    fullData += '</' + editObj_name + '>';
                                }
                            }
                        }
                        formData += '</' + repeatiSelfNodeName + '>';
                        fullData += '</' + repeatiSelfNodeName + '>';
                    })
                    formData += '</' + repeatiParentNodeName + '>';
                    fullData += '</' + repeatiParentNodeName + '>';
                }
            }
            formData += '</my:myFields>';
            formData += '</SubmitData>';
            formData += '</FormData>';
            //------------
            fullData += '</my:myFields>';
            fullData += '</SubmitData>';
            fullData += '</FormData>';
            //提交前的数据校验
            beforSubmit(xmlData, inputXML, xml, templeteId, CEF, formData, fullData);
        } catch(e) {
            console.error("出错了:" + e);
            var accessEditArr = xmlData.accessEditArr
            if (accessEditArr.length > 0) {
                //存在可编辑项
                //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
                cmp.webViewListener.fire({
                    type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                    data:{
                        "type":"2",
                        "content":""
                    }
                });
                //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
            } else {
                //与服务器失去连接 ，请重新尝试
                cmp.webViewListener.fire({
                    type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                    data:{
                        "type":"3",
                        "content":"与服务器失去连接 ，请重新尝试。"
                    }
                });
                //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','与服务器失去连接 ，请重新尝试。');");
            }
        }
    } else {
        //这里代表还没有开放移动端编辑表单
        //如果xml的必填项没有值则提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
        //如果xml必填项都有值,则进行审批操作，但是不传formData和fullData参数
        //可编辑项的详细信息封装在此
        var accessEditDetailArr = xmlData.accessEditDetailArr;
        var alertStr = "";
        for (var i = 0; i < accessEditDetailArr.length; i++) {
            var displayName = accessEditDetailArr[i].dataName.replace("my:", "");
            var dataName = accessEditDetailArr[i].dataName.replace(":", "\\:");
            var dataAccess = accessEditDetailArr[i].dataAccess;
            var dataIsNull = accessEditDetailArr[i].dataIsNull;
            if ("edit" == dataAccess && "false" == dataIsNull) {
                $(xml).find(dataName).each(function(index8, element8) {
                    var editObj_text = $(element8).text();
                    if ("" == editObj_text) {
                        alertStr += "【" + displayName + "】不能为空\\n";
                    }
                })
            }
        }
        if ("" == alertStr) {
            //此处代表未实现在移动端编辑的表单,没有可编辑项或是可编辑项都已经有值了
            cmp.storage.save('newoa_formData', false);
            cmp.storage.save('newoa_fullData', false);
            console.log("此处代表未实现在移动端编辑的表单,没有可编辑项或是可编辑项都已经有值了");
            //全部校验通过,开始审批
            cmp.webViewListener.fire({
                type:"banli_getbranch",  //此参数必须和webview1注册的事件名相同
                data:{}
            });
            //uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
        } else {
            //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
            cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"2",
                    "content":""
                }
            });
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
        }
    }
}

//提交前的数据校验:能进入这里的都是允许在移动端编辑的表单,此处校验必填项是否为空以及数字类型的输入是否为数字
function beforSubmit(xmlData, inputXML, xml, templeteId, CEF, formData, fullData) {
    var accessEditArr = xmlData.accessEditArr;
    var accessEditDetailArr = xmlData.accessEditDetailArr;
    var nonRepeatiArr = xmlData.nonRepeatiArr;
    var repeatiArr = xmlData.repeatiArr;
    var alertStr = '';
    var checkResult = false;
    if (accessEditDetailArr.length > 0) {
        //有必填项,先校验非重复行
        if (nonRepeatiArr.length > 0) {
            for (var i = 0; i < nonRepeatiArr.length; i++) {
                var fieldtype = nonRepeatiArr[i].fieldtype;
                var id = nonRepeatiArr[i].id;
                var name = nonRepeatiArr[i].name;
                if (undefined != name) {
                    var displayName = nonRepeatiArr[i].name.replace("my:", "");
                    var showName = nonRepeatiArr[i].name.replace(":", "\\:");
                    if (-1 != accessEditArr.indexOf(name)) {
                        for (var k = 0; k < accessEditDetailArr.length; k++) {
                            var dataIsNull = accessEditDetailArr[k].dataIsNull;
                            var dataName = accessEditDetailArr[k].name;
                            if (name == dataName && 'false' == dataIsNull) {
                                $(formData).find(showName).each(function(index8, element8) {
                                    var editObj_text = $(element8).text();
                                    if ('' == editObj_text || undefined == editObj_text || null == editObj_text) {
                                        alertStr += "【" + displayName + "】不能为空\\n";
                                    } else {
                                        if ("DECIMAL" == fieldtype) {
                                            if ('NaN' == String(Number(editObj_text))) {
                                                alertStr += "【" + displayName + "】不为数字\\n";
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
        //再校验重复项
        if (repeatiArr.length > 0) {
            for (var i = 0; i < repeatiArr.length; i++) {
                var repeatiBody = repeatiArr[i].body;
                if (undefined != repeatiBody) {
                    if (repeatiBody.length > 0) {
                        for (var j = 0; j < repeatiBody.length; j++) {
                            var fieldtype = repeatiBody[j].fieldtype;
                            var id = repeatiBody[j].id;
                            var name = repeatiBody[j].name;
                            if (undefined != name) {
                                var displayName = repeatiBody[j].name.replace("my:", "");
                                var showName = repeatiBody[j].name.replace(":", "\\:");
                                if (-1 != accessEditArr.indexOf(name)) {
                                    for (var k = 0; k < accessEditDetailArr.length; k++) {
                                        var dataIsNull = accessEditDetailArr[k].dataIsNull;
                                        var dataName = accessEditDetailArr[k].name;
                                        if (name == dataName && 'false' == dataIsNull) {
                                            $(formData).find(showName).each(function(index9, element9) {
                                                var editObj_text = $(element9).text();
                                                if ('' == editObj_text || undefined == editObj_text || null == editObj_text) {
                                                    alertStr += "【" + displayName + "】不能为空\\n";
                                                } else {
                                                    if ("DECIMAL" == fieldtype) {
                                                        if ('NaN' == String(Number(editObj_text))) {
                                                            alertStr += "【" + displayName + "】不为数字\\n";
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ('' != alertStr) {//提醒有必填项
            checkResult = false;
            cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"3",
                    "content":alertStr
                }
            });
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','" + alertStr + "');");
        } else {
            checkResult = true;
        }
    } else {
        checkResult = true;
    }
    if (checkResult == true) {
        //存在可编辑项并且允许在移动端编辑的表单才传formData和fullData参数
        if (accessEditDetailArr.length > 0 && isCanEditForm(templeteId)) {
            cmp.storage.save('newoa_formData', formData);
            cmp.storage.save('newoa_fullData', fullData);
        } else {
            cmp.storage.save('newoa_formData', false);
            cmp.storage.save('newoa_fullData', false);
        }
        if (checkFormData(xmlData, inputXML, xml, templeteId, CEF, formData, fullData)) {
            //全部校验通过,开始审批
            cmp.webViewListener.fire({
                type:"banli_getbranch",  //此参数必须和webview1注册的事件名相同
                data:{}
            });
           // uexWindow.evaluatePopoverScript("banli", "content", "getbranch();");
        }
    }
    //console.log(formData);
    //console.log(fullData);
}

//检查FormData的数据：能进入这里的都是允许在移动端编辑的表单,此处校验一些特殊字段的值
function checkFormData(xmlData, inputXML, xml, templeteId, CEF, formData, fullData) {
    var alertStr = "";
    var checkResult = true;
    if ("-656673282741353770" == templeteId) {
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:分数")) {
            $(formData).find("my\\:分数").each(function(index1, element1) {
                var score = Number($(element1).text());
                if ('NaN' == String(score)) {
                    alertStr += "【分数】不为数字\\n";
                } else if (score <= 0) {
                    alertStr += "【分数】必须大于0\\n";
                } else if (score > 100) {
                    alertStr += "【分数】输入不能大于100\\n";
                }
            })
        }
        if (-1 != accessEditArr.indexOf("my:权重")) {
            var QZScore = 0;
            $(formData).find("my\\:权重").each(function(index2, element2) {
                QZScore += Number($(element2).text());
            })
            if ('NaN' == String(QZScore)) {
                alertStr += "【权重】不为数字\\n";
            } else if (100 != QZScore) {
                alertStr += "【权重】总和不等于100\\n";
            }
        }
    } else if ("4913029040738159614" == templeteId) {
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:得分")) {
            $(formData).find("my\\:myFields").children().each(function(index3, element3) {
                var nodeName = $(element3)[0].nodeName;
                var nodeText = $(element3).text();
                if (-1 != nodeName.indexOf("MY:评分")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\\n";
                    }
                }
                if (-1 != nodeName.indexOf("MY:小计分数")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\\n";
                    }
                }
                if (-1 != nodeName.indexOf("MY:得分")) {
                    var score = Number(nodeText);
                    if ('NaN' == String(score)) {
                        alertStr += "【" + nodeName + "】不为数字\\n";
                    } else if (score <= 0) {
                        alertStr += "【" + nodeName + "】必须大于0\\n";
                    } else if (score > 100) {
                        alertStr += "【" + nodeName + "】不能大于100\\n";
                    }
                }
            })
        }
    } else if ("-6113656700180872074" == templeteId || "69356868501981685" == templeteId) {
        //区域公司预算解锁调整审批单
        //集团本部预算解锁调整审批单
        var accessEditArr = xmlData.accessEditArr;
        if (-1 != accessEditArr.indexOf("my:本次批复金额") && -1 != accessEditArr.indexOf("my:本次批复金额合计")) {
            var scoreTotal = 0;
            $(formData).find("my\\:本次批复金额").each(function(index1, element1) {
                var score = Number($(element1).text());
                if ('NaN' == String(score)) {
                    alertStr += "【本次批复金额】不为数字\\n";
                } else {
                    scoreTotal += score;
                }
            })
            $(formData).find("my\\:本次批复金额合计").each(function(index2, element2) {
                var score2 = Number($(element2).text());
                if ('NaN' == String(score2)) {
                    alertStr += "【本次批复金额合计】不为数字\\n";
                } else {
                    if (scoreTotal != score2) {
                        //校验不通过
                        checkResult = false;
                        alertStr += "【本次批复金额】合计应等于【本次批复金额合计】\\n";
                    }
                }
            })
        }
    }
    if ('' != alertStr) {
        //进入此处代表数据校验不通过
        checkResult = false;
        if (CEF == true) {
            //提示具体的必填项内容
            cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"3",
                    "content":alertStr
                }
            });
            //uexWindow.evaluatePopoverScript("banli", "content", "alertMsg('3','" + alertStr + "');");
        } else {
            //提醒:此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。
            cmp.webViewListener.fire({
                type:"banli_alertMsg",  //此参数必须和webview1注册的事件名相同
                data:{
                    "type":"2",
                    "content":""
                }
            });
            uexWindow.evaluatePopoverScript("banli", "content", "alertMsg(2);");
        }
    }
    console.log("校验结果：" + checkResult);
    return checkResult;
}