cmp.ready(function () {
    //var username = (JSON.parse(cmp.storage.get("currentUserInfo"))).account;
   // console.log(username);
   // cmp.storage.save("loginname", username);
    if (!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop = document.getElementsByClassName("search")[0].offsetHeight + "px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage() {
    getNewList(1);
}

function bindEvent() {
	   //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
    document.getElementById("search").addEventListener("tap", function () {
        var infoName = $('#infoName').val();
        if (infoName == "" || infoName == null) {
            cmp.notification.alert("输入条件不能为空！", function () {
            }, "提示", "确定", "", false, false);
        } else {
            getNewListSuoSo(infoName);
        }
    });
}


/***********************************************分割线***************************************************/
function getList(page) {
    var obj = new Object();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var typeid = cmp.storage.get('typeid');
    var memberid = cmp.storage.get('userid');
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_bul";
    url = url + "&PHONE_ID=" + phoneid + "&memberid=" + memberid + "&typeid=" + typeid + "&pageNo=" + page;
    obj.url = url;
    obj.successFun = "httpsucess"
    ajaxJson_v1(obj);
}

//从页面取的
function getNewList(page) {
    var paramObj = cmp.href.getParam();
    var id = paramObj.id;
    var title = paramObj.title;
    console.log("title     " + title);
    $(".cmp-title").html(title);
    var obj = new Object();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var typeid = id;
    console.log(" typeid  " + typeid);
    var loginname = cmp.storage.get('loginname');
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=bullist" + "&PHONE_ID=" + phoneid + "&typeid=" + typeid + "&pageNo=" + page + "&username=" + loginname;

    obj.url = url;
    obj.successFun = "httpnewsucess"
    ajaxJson_v1(obj);

}

//字符串转日期格式，strDate要转为日期格式的字符串
function getDate(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function (a) {
        return parseInt(a, 10) - 1;
    }).match(/\d+/g) + ')');
    return date;
}

function httpnewsucess(data) {
    console.log(data);
    var date = new Date();
    var platform = cmp.storage.get('platform');
    console.log("platform   " + platform);
    var bullist = data.bullist.LIST;
    var info_list_mode = new Array(bullist.length);
    console.log(bullist.length);
    for (i = 0; i < bullist.length; i++) {
        var info_mode = new Object();
        info_mode.id = bullist[i].id;
        info_mode.title = bullist[i].title;
        info_mode.name = bullist[i].name;
        info_mode.publish_date = bullist[i].publish_date
        info_mode.describe = "<div>" + bullist[i].name + bullist[i].publish_date + "</div>";

        var services_date = new Date(bullist[i].publish_date);

        var iDays = (date.getTime() - services_date.getTime()) / 1000 / 60 / 60 / 24;
        //把相差的毫秒数转换为天数
        if (iDays <= 3) {
            info_mode.title = "<div >" + bullist[i].title + "</div>";
            info_mode.describe = "<div>" + bullist[i].name + bullist[i].publish_date + "</div>";
        }
        info_list_mode.push(info_mode);
    }
    console.log(info_list_mode);

    console.log("开始你的表演")
    var html = ""
    html += '<ul>'
    for (i = 0; i < info_list_mode.length; i++) {
        if (info_list_mode[i] == null) {
            continue;
        }
        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
        html += '<ul class="ub-f1 ub ub-ver marg-l">'
        html += '<li class="bc-text ub ub-ver ut-m line3">'
        html += info_list_mode[i].title
        html += '<div>'
        html += info_list_mode[i].name;
        html += info_list_mode[i].publish_date;
        html += '</div>'
        html += '</li>'
        html += '</ul>'
        html += '<li class="fa fa-angle-right ulev2">'
        html += '</li>'
        html += '</ul>'
        html += '</li>'
    }
    html += '</ul>'
    $("#goodsList").html(html);
    $('#goodsList>ul>li').each(function (index, item) {
        if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
            $(item).css("background-color", "#77CFAD");
        } else {

        }
    });

    $("#goodsList>ul>li").on('tap', function (event) {
        openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })
}

function openDetail(obj) {
    var extData = {
        'id': obj.id,
        'title': obj.title,
        'bulid': obj.id,
        'bulqry': obj.id
    }

   // cmp.href.next(noticeBasePath + "/html/mtbddetail.html", extData, {openWebViewCatch: true, nativeBanner: false});
    cmp.href.next(noticeBasePath+ "/html/mtbddetail.html", extData, {openWebViewCatch: true, nativeBanner: true})
}

//页面取搜索
function getNewListSuoSo(key) {
    var obj = new Object();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var typeid = cmp.storage.get('typeid');
    var loginname = cmp.storage.get('loginname');

    //var memberid = cmp.storage.get('userid');
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=bulqry";
    url = url + "&PHONE_ID=" + phoneid + "&typeid=" + typeid + "&searchtext=" + key;
    url = url + "&username=" + loginname;
    obj.url = url;
    obj.successFun = "httpnewsucess1";
    ajaxJson_v1(obj);
}

function httpnewsucess1(data) {
    console.log(data);
    var bulqry = data.bulqry.LIST;
    var info_list_mode = new Array(bulqry.length);
    console.log(bulqry.length);
    for (i = 0; i < bulqry.length; i++) {
        var info_mode = new Object();
        info_mode.id = bulqry[i].id;
        info_mode.title = bulqry[i].title;
        info_mode.name = bulqry[i].name;
        info_mode.publish_date = bulqry[i].publish_date
        info_mode.describe = "<div>" + bulqry[i].name + bulqry[i].publish_date + "</div>";
        info_list_mode.push(info_mode);
    }
    console.log(info_list_mode);
    console.log("开始你的表演")
    var html = ""
    html += '<ul>'
    for (i = 0; i < info_list_mode.length; i++) {
        if (info_list_mode[i] == null) {
            continue;
        }
        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
        html += '<ul class="ub-f1 ub ub-ver marg-l">'
        html += '<li class="bc-text ub ub-ver ut-m line3">'
        html += info_list_mode[i].title
        html += '<div>'
        html += info_list_mode[i].name;
        html += info_list_mode[i].publish_date;
        html += '</div>'
        html += '</li>'
        html += '</ul>'
        html += '<li class="fa fa-angle-right ulev2">'
        html += '</li>'
        html += '</ul>'
    }
    html += '</ul>'
    $("#goodsList").html(html);
    $('#goodsList>ul>li').each(function (index, item) {
        if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
            $(item).css("background-color", "#77CFAD");
        } else {

        }
    });
    $("#goodsList>ul>li").on('tap', function (event) {
        openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })

    function httpsucess(info_list) {
        console.log(info_list);
        var info_list_mode = new Array(info_list['bullist'].length);
        console.log(info_list['bullist'].length);
        for (i = 0; i < info_list['bullist'].length; i++) {
            var info_mode = new Object();
            info_mode.id = info_list['bullist'][i].id;
            info_mode.title = info_list['bullist'][i].title;
            info_mode.describe = "<div>" + info_list['bullist'][i].name + "</div><div>" + info_list['bullist'][i].publish_date + "</div>";
            info_list_mode.push(info_mode);
        }
        console.log(info_list_mode);
        console.log("开始你的表演")
        var html = ""
        html += '<ul>'
        for (i = 0; i < info_list_mode.length; i++) {
            if (info_list_mode[i] == null) {
                continue;
            }
            html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
            html += '<ul class="ub-f1 ub ub-pj ub-ac">'
            html += '<ul class="ub-f1 ub ub-ver marg-l">'
            html += '<li class="bc-text ub ub-ver ut-m line3">'
            html += info_list_mode[i].title
            html += '</li>'
            html += '</ul>'
            html += '<li class="fa fa-angle-right ulev2">'
            html += '</li>'
            html += '</ul>'
            html += '</li>'
        }
        html += '</ul>'
        $("#goodsList").html(html);

        $("#goodsList>ul>li").on('tap', function (event) {
            openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
        })
    }
}

