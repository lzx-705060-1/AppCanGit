cmp.ready(function(){
    platform=cmp.device.info().platform;
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    var backParamObj = cmp.href.getBackParam()
    if(!backParamObj){
        cmp.storage.save("branch_from_banli",cmp.storage.get("branch"));
    }else{
        cmp.storage.save("branch",cmp.storage.get("branch_from_banli"))
    }
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
    //webview交互，由多人选择页面跳转过来执行
    
    if(cmp.storage.get("bmryid")&&cmp.storage.get("bmryid")!=""){
        setInputValue2();
    }else if(cmp.storage.get("dbmryid")&&cmp.storage.get("dbmryid")!=""){
        setInputValue()
    }
	
    cmp.webViewListener.add({type: 'choosemembers_branch_setvalue2'});
    document.addEventListener('choosemembers_branch_setvalue2', function(event) {
        
    })
	 
    //webview交互，由单人选择页面跳转过来执行
    cmp.webViewListener.add({type: 'choosemembers_branch_setvalue'});
    document.addEventListener('choosemembers_branch_setvalue', function(event) {
       
    })
});

function intiPage(){
    showBranch()
}
var nodecount=0;
var platform = ""
var allnodes='';
var allselectnodes='';
var allNotSelectNodes='';
var selectnodes='';
var popNodeCondition='{"condition":[';
var popNodeSelected='';
var paramObj = cmp.href.getParam()
var submit_button = false

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/

//显示分支
function showBranch(){
    var branch = cmp.storage.get('branch');
    branch = JSON.parse(branch)
    console.log(branch);
    nodecount=branch.length;
    allnodes='';
    //allNotSelectNodes='';
    //allselectnodes='';
    popNodeSelected='{"nodeAdditon":[';
    //  popNodeCondition='{"condition":[';
    branch_list = new Array();
    for(i=0;i<branch.length;i++){
        var branch_mode = new Object();
        allnodes+=branch[i].nodeid+":";
        if(branch[i].isshow=='true'){
            branch_mode.nodeid = branch[i].nodeid;
            branch_mode.title = branch[i].uname + "(" + branch[i].zxgz + ")";

            branch_mode.mode = branch[i].mode;
            branch_mode.nodenum =  (i+1);
            branch_mode.userids = branch[i].userids;
            branch_mode.nodeTypeId =branch[i].nodeTypeId;
            if (branch[i].nodeTypeId=="inform")
            {
                branch_mode.title ="抄送:"+branch_mode.title;
            }
            branch_mode.checked = branch[i].checked;;
            //根据不同的类型，分别显示单选、多选
            if(branch[i].mode=="single"){
                var describe = '<select class="infoName" id="branch'+branch[i].nodeid+'">'
                var user = branch[i].users ;
                describe += "<option value=''>选择人员</option>"
                for(var j=0;j<user.length;j++){
                    describe += "<option value='"+user[j].id+"'>"+user[j].name+"</option>" ;
                }
                describe += '</select>' ;
                branch_mode.describe = describe ;
            }else if(branch[i].mode=="only"){
                console.log(branch[i].userids);
                if(branch[i].nodeName&&branch[i].nodeName.indexOf('选择人员')<0){
                    //如果节点名称是“点击此处选择人员” 则是选择人员
                    console.log(branch[i].nodeName);
                    branch_mode.describe = '<input placeholder="'+branch[i].nodeName+'" type="text" class="infoName" />';
                }else if(branch[i].uname=='空节点'){
                    branch_mode.describe = '' ;
                }else if(branch[i].nodeName&&branch[i].nodeName.indexOf('选择人员')>-1){
                    describe = '<div class="uinn sc-text"><input type="text"  placeholder="请选择人员" class="ub-f1 infoName" id="text'+branch[i].nodeid+'"/><div class="btn ub ub-ac bc-text-head ub-pc sc-btn xzry"  id="'+branch[i].nodeid+'">选择人员 </div></div>';
                    branch_mode.describe = describe ;
                }else{
                    branch_mode.describe = '' ;
                }
            }else if(branch[i].mode=="multiple"){
                if(typeof(branch[i].userids)!="undefined"){
                    describe = '<div class="uinn sc-text"><input type="text"  placeholder="请选择人员" class="ub-f1 infoName" id="text'+branch[i].nodeid+'"/><div class="btn ub ub-ac bc-text-head ub-pc sc-btn xzrymany" userids="'+branch[i].userids+'" id="'+branch[i].nodeid+'">选择人员 </div></div>';
                    branch_mode.describe = describe ;
                }
            }else if(branch[i].mode=="all"&&branch[i].nodeid==""){
                describe = '<div class="uinn sc-text"><input type="text"  placeholder="请选择人员" class="ub-f1 infoName" id="text'+branch[i].nodeid+'"/><div class="btn ub ub-ac bc-text-head ub-pc sc-btn xzrymany" userids="'+branch[i].userids+'" id="'+branch[i].nodeid+'">选择人员 </div></div>';
                branch_mode.describe = describe ;
            }
            else{
                branch_mode.describe = '<input placeholder="'+branch[i].nodeName+'" type="text" class="infoName" />';
            }
            branch_list.push(branch_mode);
        }

        else
        {
            allNotSelectNodes+=branch[i].nodeid+",";
            popNodeCondition+='{"nodeId":"'+branch[i].nodeid+'","isDelete":"true"}'+',';

        }

    }
    console.log(branch_list);
    if(branch_list.length==0){
        $("#submit").addClass("uhide");
        cmp.notification.alert("请选择流程，否则本分支流程将不能流转下去。",function(){
            //do something after tap button
            cmp.href.back()
        },"提示","确定","",false,false);

        return;
    }
    console.log(allNotSelectNodes);
    console.log(allnodes);
    console.log(nodecount);
    console.log(branch_list.length);
    console.log(branch_list);
    console.log(branch_list[0].title.indexOf('空节点'));
    //lv.set(branch_list);
    var html=""
    html+="<ul>"
    for(var j=0;j<branch_list.length;j++){
        html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+j+'">'
        html+='<div class="checkbox umar-r">'
        html+='<input type="checkbox" class="uabs ub-con">'
        html+='</div>'
        html+='<ul class="ub-f1 ub ub-pj ub-ac">'
        html+='<ul class="ub-f1 ub ub-ver marg-l">'
        html+='<li class="bc-text ub ub-ver ut-m line1">'
        html+=branch_list[j].title
        html+='</li>'
        html+='<li class="bc-text ub ub-ver ut-m line1" style="font">'
        html+=branch_list[j].describe
        html+='</li>'
        html+='</ul>'
        html+='</ul>'
        html+='</li>'

    }
    html+="</ul>"
    $("#mayList").html(html)
    //默认遍历
    for(j=0;j<branch_list.length;j++){
        if(branch_list[j].checked=='true'){
            $("input[type='checkbox']").eq(j).prop('checked',true);
            $("input[type='checkbox']").eq(j).prop('disabled',true);
            $("input[type='checkbox']").eq(j).prop('readonly',true);
            $("input[type='text']").eq(j).prop('disabled',true);
            $("input[type='checkbox']").eq(j).prop('hidden',true);
        }
    }
    if(branch_list.length==1&&branch_list[0].title.indexOf('空节点')>-1)
    {
        //隐藏同意按钮
        $("#submit").addClass("uhide");
        //隐藏列表
        $("#mayList").addClass("uhide");
        //如果是空节点，则继续执行下一步
        submitprocess();
    }else{
        //如果不是空节点，显示同意按钮
        submit_button=false
        $("#submit").removeClass("uhide");
        //展示列表
        $("#mayList").removeClass("uhide");
    }
    
    $(".xzry").off("tap");
    $(".xzry").on("tap", function() {
        console.log($(this).attr('id'));
        cmp.storage.save('dbmrytype','nocommit');
        cmp.storage.save('inputtext','text'+$(this).attr('id'));
        cmp.href.next('/seeyon/m3/apps/v5/portal/todo/html/newoa_dbmry.html?cmp_orientation=auto', {},  {openWebViewCatch: true});

    });

    $(".xzrymany").off("tap")
    $(".xzrymany").on("tap", function() {
        console.log($(this).attr('id'));
        cmp.storage.save('newBLtype','xzrymany');
        //cmp.storage.save('dbmrytype','nocommit');
        cmp.storage.save('userids',$(this).attr('userids'));
        cmp.storage.save('inputtext','text'+$(this).attr('id'));
        cmp.href.next('/seeyon/m3/apps/v5/portal/todo/html/newoa_bmry.html?cmp_orientation=auto', {},  {openWebViewCatch: true});

    });
}


$("#submit").on("tap", function() {
    if(submit_button){
        return
    }
    submit_button=true
    submitprocess();

});

function submitprocess()
{
    var affairid = paramObj.affairid;
    var summaryid = paramObj.summaryid;
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var formData = cmp.storage.get('newoa_formData');
    var fullData = cmp.storage.get('newoa_fullData');
    var url = serviceUrl + "/servlet/PublicServiceServlet?attitude=&stype=submit&message_id=nhoa_col&isHidden=false&inputed=true";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid + "&content=" + cmp.storage.get('content');
    url = url + "&platform=" + platform;
    if(formData!=false && formData!='false'){
        url = url + "&formData=" + formData;
    }
    if(fullData!=false && fullData!='false'){
        url = url + "&fullData=" + fullData;
    }
    var issubmit = true;
    var isnextbrach = true ;
    var nodeid = '';
    var informNodes='';
    var isnull = true;
    //每一个分支为一个node 选出所有选中的分支
    console.log(branch_list);
    for(i=0;i<branch_list.length;i++){

        if($("#branch"+branch_list[i].nodeid).val()==""||($("#text"+branch_list[i].nodeid).attr("uid")==null&&branch_list[i].describe.indexOf('请选择人员')>-1)&&branch_list[i].checked=='true'){

            cmp.notification.alert("请选择人员",function(){
                //do something after tap button
                //cmp.href.back()
            },"提示","确定","",false,false);

            return;
        }
    }

    $("input[type='checkbox']").each(function(index,item){
        console.log(index,item);
        console.log($(item).attr("checked"));
        console.log($(item).attr("uid"));
        console.log($("#branch"+index).val());
        var tempids='';
        console.log(branch_list[index].checked);
        if($(item).attr("checked")||(branch_list[index].checked=='true')){
            //console.log(branch_list.length);

            console.log(branch_list[index].checked);
            console.log(branch_list[index].nodeid);
            console.log(branch_list[index]);
            if(branch_list[index].nodeTypeId!='inform'){
                isnextbrach = false;
            }else{
                nodeid += branch_list[index].nodeid + ',';
                informNodes += branch_list[index].nodeid + ',';
            }
            console.log(isnextbrach);
            //根据类型来取值
            if(branch_list[index].mode=="single"){
                tempids=$("#branch"+branch_list[index].nodeid).val();
            }else if(branch_list[index].mode=="only"){
                console.log(branch_list[index].userids);
                console.log(branch_list[index].title.indexOf('空节点'));
                //重写，1、默认节点，2，多人中选一个，3，部门中选一个
                if(typeof(branch_list[index].userids)!="undefined"&&branch_list[index].title.indexOf('空节点')<0){
                    //userids 为需选择的人，此处可能不对

                    tempids=$("#text"+branch_list[index].nodeid).attr("uid");
                }else if(typeof(branch_list[index].userids)=="undefined"&&branch_list[index].title.indexOf('空节点')<0){
                    //根据nodename判断是否为选人
                    if(branch_list[index].describe.indexOf('请选择人员')>-1){

                        tempids=$("#text"+branch_list[index].nodeid).attr("uid");
                    }else{
                        tempids=branch_list[index].nodeid;
                    }
                }else if(branch_list.length==1&&branch_list[index].title.indexOf('空节点')>-1){
                    //单个空节点需要跳转
                    issubmit = false ;
                    //url = url.replace('&stype=submit','');
                    tempids=branch_list[index].nodeid;
                    //appcan.locStorage.setVal('nodeurl','&isnull=ture&nodeid='+branch_list[index].nodeid);
                    url +='&stype=summary&isnull=true&nodeid='+branch_list[index].nodeid;
                }else if(branch_list.length>1&&branch_list[index].title.indexOf('空节点')>-1){
                    //单个空节点需要跳转
                    //url = url.replace('&stype=submit','');
                    //url += '&stype=summary&isnull=ture&nodeid='+branch_list[index].nodeid;
                    tempids=branch_list[index].nodeid;
                    console.log(url);
                    //ajaxJson(url, httpsucess);
                }
            }else if(branch_list[index].mode=="multiple"){
                tempids=$("#text"+branch_list[index].nodeid).attr("uid");
                //url += '&node'+branch_list[index].nodenum+'=true&node'+branch_list[index].nodenum+'Ids='+$("#"+cmp.storage.get('inputtext')).attr("uid");
            }else if(branch_list[index].mode=="all"){
                tempids=$("#text"+branch_list[index].nodeid).attr("uid");
            }
            popNodeSelected+='{"nodeId":"'+branch_list[index].nodeid+'","pepole":["'+tempids+'"]}'+',';
            popNodeCondition+='{"nodeId":"'+branch_list[index].nodeid+'","isDelete":"false"}'+',';
            allselectnodes+=branch_list[index].nodeid+',';
        }



    });
    if(isnextbrach){
        issubmit = false ;
        // var nodeurl = '&isnull=true&nodeid='+nodeid.substr(0,nodeid.length-3);
        var nodeurl = '&isnull=true&nodecount='+nodecount+'&allnodes='+allnodes+'&nots='+allNotSelectNodes+'&allselectnodes='+allselectnodes+"&informNodes="+informNodes;
        console.log(url);
        url = url.replace(/&stype=submit/g,'');
        url += '&stype=summary';
        console.log(nodeid);
        url += nodeurl ;
        console.log(url);
        cmp.storage.save('nodeurl',nodeurl);
        console.log(nodeurl);
        ajaxJson(url, function(data){
            console.log(data);
            var branch = data.condition.DATA.branch ;

            cmp.storage.save('branch',JSON.stringify(branch));
            if (branch.length>0)
            {
                showBranch();
            }
            
            else if(data.preParams&&data.preParams.DATA&&(data.preParams.DATA.isPop=='false'||data.conditionPage.ISGUIDANG=='true'))
            {
                issubmit=true;
                isnull=false;
                url = url.replace(/&stype=summary/g,'');
                url=url+'&stype=submit';

            }
            else {
                cmp.notification.alert("网络异常，请重试",function(){
                    cmp.href.back();

                },"提示","确定","",false,false);
            }
        });
    }

    if(issubmit){
        var nodeurl =cmp.storage.get('nodeurl');
        if(nodeurl&&nodeurl!='null'){
            url += nodeurl ;
        }
        if (!isnull){
            url = url.replace(/&isnull=true/g,'');
        }

        var csids = cmp.storage.get('csids');
        var csnames = cmp.storage.get('csnames');
        if(csids&&typeof(csids)!="undefined"){
            url = url +'&ids='+csids ;
            url = url +'&names='+ csnames ;
        }
        if (popNodeCondition!=''&&popNodeCondition!='{"condition":[')
        {
            popNodeCondition=popNodeCondition.substring(0,popNodeCondition.length-1);
            popNodeCondition+=']}';
            url = url + "&popnodecondition=" + popNodeCondition;
        }
        if (popNodeSelected!=''&&popNodeSelected!='{"nodeAdditon":[')
        {
            popNodeSelected=popNodeSelected.substring(0,popNodeSelected.length-1)
            popNodeSelected+=']}';
            url = url + "&popnodeselected=" + popNodeSelected;
        }
        console.log(url);
        var obj = new Object()
        obj.url = url;
        obj.successFun='httpsucess'
        ajaxJson_v1(obj);
    }

}
function httpsucess(data) {
    console.log(data);
    cmp.storage.delete("dbmryid")
    cmp.storage.delete("bmryid")
    submit_button=false
    if (data['submit']&&(data['submit'].RETURN=='true' || data['submit'].RETURN==true)) {

        cmp.notification.alert("办理成功",function(){
            //do something after tap button
            cmp.webViewListener.fire({
                type:"close_banli_page",  //此参数必须和webview1注册的事件名相同
                data:"close"
            });
            if(paramObj.isfromwx=="true"){
                cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?from=wxdaiban")
            }else{
                cmp.href.back(3)
            }
            //cmp.href.back(3)
        },"提示","确定","",false,false);

        return false;
    }else if(!data['submit']&&(data['preParams']==''||!(data['preParams'].DATA)||(data['preParams'].DATA.isPop=='true'&&!(data['input'].popnodecondition)))){
        cmp.notification.alert("网络异常，请重试",function(){
            cmp.href.back();

        },"提示","确定","",false,false);
    } 
    else{
        cmp.notification.alert("该事项暂不支持在移动端审批,请到电脑端审批。",function(){
            //do something after tap button
        },"提示","确定","",false,false);

    }
}
//赋值方法
function setInputValue(){
    //alert(22);
    var uid =  cmp.storage.get('dbmryid');
    var uname = cmp.storage.get('dbmryname');
    var ipId = cmp.storage.get('inputtext');
    $("#"+ipId).attr("uid",uid);
    $("#"+ipId).val(uname);
    console.log(ipId);
    cmp.storage.delete("dbmryid")
}

function setInputValue2(){
    //alert(22);
    var uid =  cmp.storage.get('bmryid');
    var uname = cmp.storage.get('bmryname');
    var ipId = cmp.storage.get('inputtext');
    $("#"+ipId).attr("uid",uid);
    $("#"+ipId).val(uname);
    console.log($("#"+ipId));
    cmp.storage.delete("bmryid")
}
