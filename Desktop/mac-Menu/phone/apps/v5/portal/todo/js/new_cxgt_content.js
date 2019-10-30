cmp.ready(function(){

    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    getList();
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
var paramObj = cmp.href.getParam();
function getList(){
    var affairid = paramObj.affairid;
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_gt&stype=list";
    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&affairid=" + affairid;
    //console.log(url);
    ajaxJson(url, function(data){
        console.log(data);
        console.log($("table"));
        var gtList = data.gtList.LIST ;
        for(var i=0;i<gtList.length;i++){
            var tr = '<tr><td class="ub-ac">'+gtList[i].name+'</td><td>'+gtList[i].createtime+'</td><td>'+gtList[i].is_do+'</td><td>'+gtList[i].dotime+'</td><td><div class="btn ub ub-ac bc-text-head ub-pc bc-btn" onclick="cx(this,'+gtList[i].code+')">撤销</div></td></tr>'
            console.log(tr);
            $("table").append(tr);
        }
    });
}
var targetObj = "";
function cx(div,code){
    console.log(code);
    targetObj = div
    var content = cmp.storage.get('content');
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var obj = new Object();
    var dataObj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    dataObj.message_id = 'newoa_gt';
    dataObj.stype = 'cxsubmit';
    dataObj.username = loginname;
    //dataObj.password = password;
    dataObj.PHONE_ID = phoneid;
    dataObj.id = code;
    dataObj.content = content;
    obj.data = dataObj;
    obj.successFun = 'sucessSubmit';
    ajaxJson_v1(obj);
    //$(div).parents("tr").remove();
    /*console.log(code);
     var content = cmp.storage.get('content');
     var serviceUrl = cmp.storage.get('serviceUrl');
     var phoneid = cmp.storage.get('phoneid');
     var loginname = cmp.storage.get('loginname');
     var password = cmp.storage.get('password');
     var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_gt&stype=cxsubmit";
     url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&id=" + code;
     url = url + "&content="+content ;
     ajaxJson(url, function(data){
     $(div).parents("tr").remove();
     });*/
}
function sucessSubmit(data){
    $(targetObj).parents("tr").remove()
}
$("#cancel").on("tap", function() {
    cmp.href.back();
});