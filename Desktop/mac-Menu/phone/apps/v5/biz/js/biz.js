

cmp.ready(function(){
    scroll();
    getMenu();
    bindSelectedEvent();
});

function getMenu(){
    var result;

    $s.Biz.list({}, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            result=ret;
            renderData(result,true);
        },
        error : function(e){
            var cmpHandled = cmp.errorHandler(e);
            if(cmpHandled) {
                cmp.href.back();
            }else {
                cmp.notification.alert(msg, function () {
                });
            }
        }
    });

    cmp.listView('#scroll');
}

//更新列表数据
function renderData(result, isRefresh) {
    var listTpl = _$("#bizlist_li_tpl").innerHTML;
    var bizlist=_$("#bizlist");
    //console.log(result);
    cmp.each(result, function(i, obj){
        obj.name = escapeStringToHTML(obj.name, true);
        if(obj.icon=="common.png"){
            obj.icon="common.svg";
        }else{
            fileId=obj.icon.substring(obj.icon.indexOf("fileId")+7);
            fileId=fileId.substring(0,fileId.indexOf("&"));
            var ip = cmp.origin;
            obj.icon= ip + "/commonimage.do?method=showImage&size=custom&q=0.8&w=" + 55 + "&h=" + 55 + "&id=" + fileId;
        }
    });
    var html = cmp.tpl(listTpl, result);
    //console.log(isRefresh);
    //是否刷新操作，刷新操作直接覆盖数据
    if (result.length == 0 || isRefresh) {
        bizlist.innerHTML = html;
    } else {
        cmp.append(bizlist,html);
    }
    cmp.listView('#scroll').refresh();
}

//绑定图标事件
function bindSelectedEvent() {
    var backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("tap", function(){
            cmp.href.closePage();
        });

    cmp(".cmp-table-view").on("tap", ".cmp-table-view-cell", function() {
        var params = getPageParam();
        params.menuId = this.getAttribute("id");
        params.name = this.querySelector("div").innerHTML;
       // cmp.href.next("bizInfo.html?date="+(new Date().getTime()), params);
        bizApi.openBizInfo("default.html",params);
    });
}
function parseUrl(){
    var ip =  window.location.origin,
        search = window.location.search;
    search = search.replace("?","");
    var params = search.split("&");
    var i = 0,len = params.length;
    var jsessionid = "";
    if(params.length > 0) {
        for(;i<len;i++){
            if(params[i].indexOf("jsessionid") != -1){
                jsessionid = params[i];
                break;
            }
        }
    }
    return {
        ip :ip ,  //测试IP
        jsessionid:jsessionid
    }
}
/**
 * 获取页面条件参数
 *
 */
function getPageParam() {
    var params = cmp.href.getParam();
    if (params == undefined) {
        params = {};
    }
    return params;
}

//scroll
function scroll(){
    var scroll=document.getElementById('scroll');
    if(scroll==null || scroll==undefined)return;


    var header=document.querySelector('header');
    var content=document.querySelector('.cmp-content');
    var scroll_wrapper=document.querySelector('.cmp-scroll-wrapper');
    // 苹果手机
    if(cmp.os.ios){
        if(header==null)return false;
        header.style.height=64+"px";
        header.style.paddingTop=20+"px";
        if(content==null)return false;
        //content.style.paddingTop=64+"px";
        content.style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight+'px';
        if(scroll_wrapper==null)return false;
        scroll_wrapper.style.top=0;
        scroll_wrapper.style.height= content.style.height;
    }
    // 安卓手机
    if(cmp.os.android){
        if(header==null)return false;
        header.style.height=44+"px";
        header.style.paddingTop=0+"px";
        if(content==null)return false;
        //content.style.paddingTop=44+"px";
        content.style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight+'px';
        if(scroll_wrapper==null)return false;
        scroll_wrapper.style.top=0;
        scroll_wrapper.style.height= content.style.height;
    }
}

//简化选择器
function _$(selector){
    return document.querySelector(selector)
}