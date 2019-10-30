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
    var type = cmp.storage.get('newBLtype');
    console.log(cmp.storage.get('userids'));
    if(type=='xzrymany'){
        deptsucess({deptlist:[{title : "全体人员",id : "-1"}]});
        getMemberList('','',cmp.storage.get('userids'))
    }else{
        getDeptlist();
        getMemberList(cmp.storage.get('ygzz_org_department_id'));
    }
    
    
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
var paramObj = cmp.href.getParam()

function qcRepet(obj){
    console.log(obj.checked);
    if(obj.checked==false){
        members.splice(isRept(obj),1);
    }else{
        console.log(isRept(obj));
        if(isRept(obj)<0){
            members.splice(0,0,obj);
            //members.push(obj);
        }
    }

}

function isRept(obj){
    var result = -1;
    for(var i=0;i<members.length;i++){
        if(members[i].id==obj.id){
            result = i;
        }
    }
    return result ;
}

function getDeptlist(){
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password =  cmp.storage.get('ygzz_password');
    //2019270092824660923
    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=nhoa_org&stype=deptlist&accountid="+cmp.storage.get('ygzz_org_account_id');
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid;
    ajaxJson(url,deptsucess);
}

function deptsucess(data){
    console.log(data);
    var first = [{title : "<div style='font-weight:bold;color:#00A1EA;'>已选人员</div>",id : "0"}];
    if(data){
        var types = data.deptlist ;
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

function getMemberList(deptid,key,userids){
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password =  cmp.storage.get('ygzz_password');
    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=nhoa_org&stype=userlist";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid;
    if(deptid){
        url = url + "&deptid="+deptid ;
    }
    if(key){
        url = url + "&key="+key ;
    }
    if(userids){
        url = url + "&ids="+userids ;
    }

    ajaxJson(url,membersucess);
}

function membersucess(data){
    var users = data.userlist;
    //lv1.set(users);
    setMembers(users)
    $("#listview ul li").on('tap', function(obj) {
        qcRepet(users[obj.currentTarget.attributes["data-index"].value]);
    });
    //将原本已选中的展示出来
    var listView =  document.getElementById("listview");
    console.log(listView);
    for (var i=0; i < users.length; i++) {
        var id_s1 = users[i].id;
        for (var j=0; j < members.length; j++) {
            var id_s2 = members[j].id;
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
        html+='<li class="ubb ub bc-border bc-text ub-ac lis" id="'+arrs[i].id+'" data-index="'+i+'">'
        html+='<div class="lv_title ub-f1 marg-l ub ub-ver ut-m line3">'
        html+=arrs[i].title
        html+='</div>'
        html+='<div class="checkbox  umar-l">'
        html+='<input type="checkbox" class="uabs ub-con" name="">'
        html+='</div>'
        html+='</li>'
    }
    html+='</ul>'
    $("#listview").html(html)
}
//展示信息



function submitok() {
    //提交根据不同的类型发送到不同的请求
    var newBLtype = cmp.storage.get('newBLtype');
    var affairid = paramObj.affairid
    var summaryid = paramObj.summaryid
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var content = cmp.storage.get('content');
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
    for(var i=0;i<members.length;i++){
        //ids += ","+members[i].id ;
        //names += ","+members[i].name ;
        // if(i==0){
        //  ids += members[i].id ;
        //  names += members[i].name ;

        // }else{
        ids += ","+members[i].id ;
        names += ","+members[i].name ;

        //  }
        codes.push(members[i].code);
        groupnames.push(members[i].name);
    }
    console.log(ids);
    console.log(names);
    console.log(codes);

    if(newBLtype=='chaosong'){
        //url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_cs&attitude=2";
        //url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
        //url = url + "&ids="+ids.substring(1) ;
        //url = url + "&names="+names.substring(1) ;
        cmp.storage.save('csids',ids.substring(1));
        cmp.storage.save('csnames',names.substring(1).replace(/\,/g,'、'));
        //调用设置方法
        //调用窗口赋值方法
        cmp.webViewListener.fire({
            type:"choosemembers_chaosong",  //此参数必须和webview1注册的事件名相同
            data:{}
        });
        cmp.href.back()

    }else if(newBLtype=='goutong'){
        /*url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_gt";
         url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + content;
         url = url + "&ids="+ids.substring(1) ;
         url = url + "&names="+names.substring(1).replace(/\,/g,'、') ;
         //console.log(url);
         ajaxJson(url, sucessSubmit);*/
        var obj = new Object();
        var dataObj = new Object();
        obj.url = serviceUrl + "/servlet/PublicServiceServlet";
        dataObj.message_id = 'newoa_gt';
        dataObj.username = loginname;
        //dataObj.password = password;
        dataObj.PHONE_ID = phoneid;
        dataObj.affairid = affairid;
        dataObj.summaryid = summaryid;
        dataObj.content = content;
        dataObj.ids = ids.substring(1);
        dataObj.names = names.substring(1).replace(/\,/g,'、');
        obj.data = dataObj;
        obj.successFun = 'sucessSubmit';
        ajaxJson_v1(obj);
    }else if(newBLtype=='xzrymany'){
        //如果是不用提交类型，则直接保存选人数据
        var uid = ids.substring(1) ;
        var uname = names.substring(1).replace(/\,/g,'、') ;
        cmp.storage.save('bmryid',uid);
        cmp.storage.save('bmryname',uname);
        cmp.storage.save('newBLtype','');

        cmp.webViewListener.fire({
            type:"choosemembers_branch_setvalue2",  //此参数必须和webview1注册的事件名相同
            data:{}
        });
        cmp.href.back()
        /*appcan.window.evaluateScript({
            name : 'newoa_bmry',
            scriptContent : 'appcan.window.close(-1)'
        });
        //调用窗口赋值方法
        appcan.window.evaluatePopoverScript({
            name:'branch',
            popName:'content',
            scriptContent:'setInputValue2();'
        });*/
    }else if (newBLtype=='group')
    {
        cmp.storage.save('codeArray',codes);
        cmp.storage.save('names',groupnames);
    }



    var markId = cmp.storage.get("markId");

    if(1==markId||"1"==markId){
        // uexWindow.evaluateScript("creategroup", 0, "setGroupmembers()");
        /*appcan.window.open('creategroup', 'creategroup.html', 10,4);
        appcan.window.evaluateScript({
            name : 'newoa_bmry',
            scriptContent : 'appcan.window.close(-1)'
        });*/
    }else if(2==markId||"2"==markId){
        /*cmp.storage.save("markId","3");
        appcan.window.open('AddGroupMember', 'AddGroupMember.html', 10,4);
        cmp.storage.save('codeArray',codes);
        cmp.storage.save('names',groupnames);
        //uexWindow.evaluateScript("AddGroupMember", 0, "SetUsername()");
        appcan.window.evaluateScript({
            name : 'newoa_bmry',
            scriptContent : 'appcan.window.close(-1)'
        });*/
    }

}
function sucessSubmit(data){
    console.log(data);
    //cmp.storage.save('affairid','');
    //cmp.storage.save('summaryid','');
    cmp.storage.save('dbtabindex',0);
    cmp.notification.alert("办理成功",function(){
        cmp.webViewListener.fire({
            type:"close_banli_page",  //此参数必须和webview1注册的事件名相同
            data:"close"
        });
        cmp.href.back()

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
        getMemberList(null,infoName);
    }
})

