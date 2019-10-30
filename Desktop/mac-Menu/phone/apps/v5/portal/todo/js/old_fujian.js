cmp.ready(function() {
    if (!cmp.platform.CMPShell)
        cmp.platform.wechatOrDD = true;

    cmp.backbutton();
    //将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);
    //向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();
    //初始化页面，对页面中的显示进行初始化
    bindEvent();
    //给页面中的按钮绑定事件
});

function intiPage() {
    var attachments = cmp.storage.get('oldfujian');
    if (attachments != '[]' && attachments != null && attachments != '') {
        var att = new Object();
        att = JSON.parse(attachments);
        httpsucess(att);
    } else {
        cmp.notification.alert("该事项没有附件", function() {
            cmp.href.back();
        }, "提醒", "确定", "", false, false);
    }
}

function bindEvent() {
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap", function() {
        cmp.href.back();
        //返回上一页面
    });
}

/***********************************************分割线***************************************************/
function getFujian() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    //var olduser = cmp.storage.get('olduser');
    //var oldpwd = cmp.storage.get('oldpwd');
    var olduser = "huanghaobin1";
    var oldpwd = "84695103";
    var processGUID = cmp.storage.get("processGUID");
    var oid = cmp.storage.get("link_uniqueid");
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=fujian";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID + "&oid=" + oid;
    ajaxJson(url, httpsucess);
}

function httpsucess(info_list) {

    var info_list_mode = new Array(info_list.length);
    console.log(info_list.length);
    if (info_list.length == 0) {
        cmp.notification.alert("该事项没有附件", function() {
            //do something after tap button
            cmp.href.back()
        }, "提示", "确定", "", false, false);
    }
    for ( i = 0; i < info_list.length; i++) {
        var info_mode = new Object();
        info_mode.fileid = info_list[i].code;
        info_mode.filename = info_list.title;
        info_mode.title = info_list[i].title;
        info_list_mode.push(info_mode);
    }

    var html = ""
    html += '<ul>'
    for ( i = 0; i < info_list_mode.length; i++) {
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

    $("#listview>ul>li").on('tap', function(event) {
        var obj = info_list_mode[event.currentTarget.attributes["data-index"].value]
        openfujian(obj.fileid, obj.filename);
    })
}

function openfujian(fileid,filename) {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var title = filename;
    var fileid = fileid;
    var phoneid = cmp.storage.get('phoneid');
    var olduser = cmp.storage.get('olduser');
    var oldpwd = cmp.storage.get('oldpwd');
    //根据名字得到类型
    // var ext = title.substring(title.indexOf('.')+1)+'text';
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
    url = url + "&code=" + fileid + "&title=" + title;
    //console.log(url);
    ajaxJson(url, function(data) {
        var serviceUrl = cmp.storage.get('serviceUrl');
        var filedownloadpath = serviceUrl+data.xzurl.RESULT;
        cmp.att.read({
            path:filedownloadpath,//文件的服务器地址
            filename:"",//附件名称
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
        
    });
}

