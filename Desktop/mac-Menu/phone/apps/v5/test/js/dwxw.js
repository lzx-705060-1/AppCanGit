cmp.ready(function () {
    //var username = (JSON.parse(cmp.storage.get("currentUserInfo"))).account;
   // console.log(username);
    //cmp.storage.save("loginname", username);
    if (!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    document.getElementById("content").style.marginTop = document.getElementsByClassName("search")[0].offsetHeight + "px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage() {
    getList(1);
}

function bindEvent() {
    document.getElementById("search").addEventListener("tap", function () {
        var infoName = $('#infoName').val();
        if (infoName == "" || infoName == null) {
            cmp.notification.alert("输入条件不能为空！", function () {
            }, "提示", "确定", "", false, false);
        } else {
            getListSuoSo(infoName, 1);
        }
    });
}


/***********************************************分割线***************************************************/
function getList(page) {
    var paramObj = cmp.href.getParam();
    var typeid = paramObj.typeid;
    console.log(typeid);
    var title = paramObj.title;
    console.log(title);
    $(".cmp-title").html(title);
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var loginname = cmp.storage.get('loginname');
    //var password = cmp.storage.get('password');
    var obj = new Object();
    // var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_news";
    // url = url + "&PHONE_ID=" + phoneid+"&memberid="+memberid+"&typeid="+typeid+"&pageNo="+page;
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=newslist";
    url = url + "&username=" + loginname +  "&PHONE_ID=" + phoneid + "&typeid=" + typeid + "&pageno=" + page;
    console.log(url);
    obj.url = url;
    obj.successFun = "httpsucess";
    ajaxJson_v1(obj);
}


//字符串转日期格式，strDate要转为日期格式的字符串
function getDate(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function (a) {
        return parseInt(a, 10) - 1;
    }).match(/\d+/g) + ')');
    return date;
}

function httpsucess(info_list) {
    console.log(info_list);
    var date = new Date();
    var info_list_mode = new Array(info_list['newslist'].LIST.length);
    var platform = cmp.storage.get('platform');

    console.log(info_list['newslist'].LIST.length);
    for (i = 0; i < info_list['newslist'].LIST.length; i++) {
        var info_mode = new Object();
        info_mode.id = info_list['newslist'].LIST[i].id;
        info_mode.title = info_list['newslist'].LIST[i].title;
        info_mode.publish_user = info_list['newslist'].LIST[i].publish_user;
        info_mode.publish_date = info_list['newslist'].LIST[i].publish_date;
        console.log("开始你的表演" + info_list['newslist'].LIST[i].title);
        info_mode.describe = "<div >" + info_list['newslist'].LIST[i].publish_user + info_list['newslist'].LIST[i].publish_date + "</div>";

        var services_date = new Date(info_list['newslist'].LIST[i].publish_date);
        /* if (platform.toLowerCase() == 'ios') {
             services_date = getDate(info_list['newslist'].LIST[i].publish_date);
         }*/
        var iDays = (date.getTime() - services_date.getTime()) / 1000 / 60 / 60 / 24;
        //把相差的毫秒数转换为天数
        if (iDays <= 3) {
            info_mode.title = "<div style='font-weight:bold;'>" + info_list['newslist'].LIST[i].title + "</div>";
            info_mode.describe = "<div style='font-weight:bold;'>" + info_mode.describe + "</div>";
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
        html += info_list_mode[i].publish_user;
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

    function openDetail(obj) {
        console.log("list");
        console.log(obj.id);
        console.log(obj.id);
        console.log(obj.title);
        var extData = {
            'newsid': obj.id,
            'title': obj.title
        }
        cmp.href.next(testBasePath + "/html/newsdetail.html?useNativebanner=1", extData, {
            openWebViewCatch: true,
            nativeBanner: true
        });
    }

}
//搜索
function getListSuoSo(title, page) {
    var paramObj = cmp.href.getParam();
    var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var typeid = paramObj.typeid;
    var memberid = cmp.storage.get('userid');
    var loginname = cmp.storage.get('loginname');
    //var password = cmp.storage.get('password');
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=newsqry";
    url = url + "&username=" + loginname +  "&PHONE_ID=" + phoneid + "&newstypeid=" + typeid + "&typeid=" + typeid + "&pageno=" + page + "&key=" + title;
    var obj = new Object();
    obj.url = url;
    obj.successFun = "httpsucess1";
    ajaxJson_v1(obj);
}

function httpsucess1(info_list) {
    console.log(info_list);
    var info_list_mode = new Array(info_list['newsqry'].LIST.length);
    console.log(info_list['newsqry'].LIST.length);
    for (i = 0; i < info_list['newsqry'].LIST.length; i++) {
        var info_mode = new Object();
        info_mode.id = info_list['newsqry'].LIST[i].id;
        info_mode.title = info_list['newsqry'].LIST[i].title;
        info_mode.publish_user = info_list['newsqry'].LIST[i].publish_user;
        info_mode.publish_date = info_list['newsqry'].LIST[i].publish_date;
        info_mode.describe = "<div>" + info_list['newsqry'].LIST[i].publish_user + info_list['newsqry'].LIST[i].publish_date + "</div>";
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
        html += info_list_mode[i].publish_user;
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
        openDetail2(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })

    function openDetail2(obj) {
        console.log("sertv");
        console.log(obj.id);
        console.log(obj.title);
        var extData = {
            'newsid': obj.id,
            'title': obj.title
        }
         cmp.href.next(testBasePath+ "/html/newsdetail.html?useNativebanner=1", extData, {openWebViewCatch: true,nativeBanner: true});
    }
}



