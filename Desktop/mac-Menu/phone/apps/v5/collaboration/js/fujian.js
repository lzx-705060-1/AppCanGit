cmp.ready(function(){

    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
    var attachments = cmp.storage.get('attachments');
    console.log(attachments);
    if (attachments) {
        var att = new Object();
        att['attachments'] = JSON.parse(attachments);
        httpsucess(att)
    } else {
        getFujian();
    }
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
function getFujian() {
    var obj = new Object()
    var paramObj = cmp.href.getParam()
    var affairid = paramObj['affairid'];
    var summaryid = paramObj['summaryid'];
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?stype=attachments&message_id=nhoa_edoc";
    url = url + "&username=" + loginname + "&password=" + password + "&pageNo=1&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid;
    console.log(url);
    obj.url=url;
    obj.successFun="httpsucess";
    ajaxJson_v1(obj);
}

function httpsucess(info_list) {
    console.log(info_list['attachments']);
    var info_list_mode = new Array(info_list['attachments'].length);
    console.log(info_list['attachments'].length);
    if (info_list['attachments'].length == 0) {
        cmp.notification.alert("该事项没有附件", function () {
            //do something after tap button
            cmp.href.back()
        }, "提示", "确定", "", false, false);
    }
    for (i = 0; i < info_list['attachments'].length; i++) {
        var info_mode = new Object();
        info_mode.fileid = info_list['attachments'][i].file_url;
        info_mode.filename = info_list['attachments'][i].filename;
        info_mode.title = info_list['attachments'][i].filename;
        info_list_mode.push(info_mode);
    }

    var html = ""
    html += '<ul>'
    for (i = 0; i < info_list_mode.length; i++) {
        if (info_list_mode[i] == null) {
            continue;
        }

        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
        html += '<ul class="ub-f1 ub ub-ver marg-l">'
        html += '<li class="bc-text ub ub-ver ut-m line2">'
        html += info_list_mode[i].title
        html += '</li>'
        html += '</ul>'
        html += '</ul>'
        html += '</li>'
    }
    html += '</ul>'
    $("#listview").html(html)


    $("#listview>ul>li").on('tap', function (event) {
        var obj = info_list_mode[event.currentTarget.attributes["data-index"].value]
        openfujian(obj.fileid, obj.filename);
    })
}

    function openfujian(fileid, filename)
    {
        var obj = new Object()
        var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
        var phoneid = cmp.storage.get('ygzz_phoneid');
        //var fileid = cmp.storage.get('fileid');
        var loginname = cmp.storage.get('ygzz_loginname');
        var password =  cmp.storage.get('ygzz_password');
        var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_file" ;
        url = url + "&username="+loginname+"&password="+password+"&PHONE_ID="+phoneid+"&fileid="+fileid;
        obj.url=url
        obj.successFun='httpopensucess'
        ajaxJson_v1(obj);
    }
    function httpopensucess(data){
        alert(data)
        var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
        var filedownloadpath = serviceUrl+data.xzurl.URL;
        cmp.att.read({
            path:filedownloadpath,//文件的服务器地址
            filename:data.fileinfo.filename,//附件名称
            edit:false,  //是否可以进行修改编辑
            extData:{

            },
            success:function(result){
                //返回的数据格式如下：
                //result = "/storage/emulated/0/m3/files/图片.jpeg";
                console.log(result)

            },
            error:function(error){
                //do something
                console.log(error)
            }
        });
}


