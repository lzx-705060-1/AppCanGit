var currentAppId;
cmp.ready(function() {
	currentAppId = _getQueryString("appCode");
	prevPage();
    initListView (currentAppId);
    initEvent();
});


function initListView (currentAppId) {
	cmp.listView("#allPending", {
        config: {
            pageSize: 20,
            params: {},
            crumbsID: Math.random(),
            dataFunc: function(params, options) {
            	getThirdPendingData(currentAppId, params,options );
            },
            renderFunc: renderData,
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("doc.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("doc.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("doc.page.lable.refresh_ing") //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("doc.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("doc.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("doc.page.lable.load_nodata") //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
} 

//渲染函数
function renderData(data, isRefresh) {
    var liTPL = document.querySelector("#tpl-list").innerHTML;
    var html = cmp.tpl(liTPL, data.data);
    var content_dom = document.querySelector("#list_content");
    if (isRefresh) {
        content_dom.innerHTML = html;
    } else {
		var saveh = content_dom.innerHTML;
        content_dom.innerHTML = saveh + html;
    }
}

function getThirdPendingData (currentAppId, params,options ) {
    var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
	var _spaceUrl = replaceAjaxUrl("/seeyon/rest/m3/pending/thirdPending?appId=" + currentAppId + "&pageSize=20&pageNo="+params["pageNo"]);
	cmp.ajax({
        type: "GET",
        data: null,
        url: _spaceUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success:function(result){
        	options.success(result);
        },
        error:function(error){
            console.log(error);
        }
    });
}

/*-M3壳下ajax请求url替换-*/
var replaceAjaxUrl = function(_ajaxUrl) {
    if(cmp.platform.CMPShell){
        _ajaxUrl = cmp.serverIp +_ajaxUrl;
    }
    return _ajaxUrl;
}

//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function prevPage() {
    cmp("header").on('tap', "#goAheadBtn", function(e) {
        cmp.href.back();
    });
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(function() {
        cmp.href.back();
    });
}

function initEvent(){
    cmp(".cmp-list-content").on("tap",".list-cell",function(){
        var gotoParams = JSON.parse(cmp.parseJSON(this.getAttribute("gotoParams")));
//        entryDetail(gotoParams, currentAppId);
        goToEntryUrl(gotoParams.entry, gotoParams.parameters)
    });
}

//function entryDetail (appInfo, currentAppId) {
//    cmp.app.loadApp({
//        "appId": currentAppId,
//        "bundle_identifier": appInfo.bundle_identifier,
//        "bundle_name": appInfo.bundle_name,
//        "team": appInfo.team,
//        "version": appInfo.version,
//        "appType": appInfo.appType,
//        "downloadUrl": appInfo.downloadUrl,
//        "entry": appInfo.entry,
//        "parameters": "",
//        success: function(res) {
//            console.log(res);
//        },
//        error: function(res) { 
//            console.log(res);
//        }
//    });
//}

var goToEntryUrl = function(url, params) {
    if (typeof url == 'function') {
        url();
        return;
    }
    if (Object.prototype.toString.call(url) !== "[object String]")
        return;
    (params == "" || params == undefined) ? params = null: params;

    cmp.href.next(url, params,{"openWebViewCatch":1});
}