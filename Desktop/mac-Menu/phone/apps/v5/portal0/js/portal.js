"use strict";
/*--一些全局变量--*/
//定义path
if(cmp.platform.CMPShell){
    var _v5Path = cmp.seeyonbasepath;
    window.parent._v5Path = _v5Path;
} else {
    var _v5Path = "/seeyon"
}
//是否开启调试
var debugModule = false;
//栏目概要的json数据
var allColumnSummary = {};

//已经加载完栏目的数量
var colLoadedNum = 0;
//需要加载的栏目数量
var _needGetColumnlen = 0;
//是否append过tplCodesJs的script标签
var hastplCodesJs = false;
//空间信息数据
var _spaceId = "";
var _spaceType = "";
//首屏加载的栏目数量
var firstScreenNum = 10;
//每次请求加载的栏目数量
var eachScreenNum = 5;
//已加载栏目的序号
var loadedColumnIndex = [];
//栏目总数
var columnSum = 0;
//大事记数据
var memorabilia_data;
//框架下的元素
var vPortalMainFrameElements = {};
//是否为designer状态
var isMobileDesigner = false;
//是否从底导航打开    是否打开新的webview提供cmp.platform.CMPShell来判断

//缓存当前的平台
var currentPlatform = "";
//vportal
var vPortal = {};
// 移动空间是否可以自定义
var _isAllowdefined = false;
vPortal.sectionHandler = {};
//把空间信息缓存起来
vPortal.spacesSummary= [];
vPortal.moduleCodeSet= {};
var currentPortalId ;
var workbench = GetRequest().ParamHrefMark;
var Urlparam = cmp.href.getParam();
 //是否为工作台进入
 if ( window.location.href.match('ParamHrefMark=workbench') ) {
    //字符串截取获取portalid
    var portalId = GetRequest().portalId;;
    window.parent.currentPortalId = portalId;
    currentPortalId = portalId;
} else {
    //是否为底部导航进入
    if ( Urlparam && Urlparam.m3from === 'navbar' ) {
        //获取portalId
        currentPortalId = GetRequest().reload !=0 ?Urlparam.portalId:localStorage.getItem("tempPortalId");
    }else if( Urlparam && Urlparam.m3from === 'vreport'){//报表空间
        currentPortalId = getUrlParam().portalId;
        //清空localStorage里面的spaceId，报表门户是跳转到指定门户的指定空间
        localStorage.removeItem("spaceId");
    }else if(GetRequest().reload == "0"){//切换门户
        currentPortalId = localStorage.getItem("tempPortalId");
        currentPlatform = GetRequest().currentPlatform;
    }else{//其他
        currentPortalId = localStorage.getItem("portalId") ? localStorage.getItem("portalId"):GetRequest() && GetRequest().portalId;
        currentPlatform = GetRequest().currentPlatform?GetRequest().currentPlatform:'';
    }
}
var currentSpaceId = (localStorage.getItem("spaceId")) || (getUrlParam() && getUrlParam().spaceId || "");

//cmp token
var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
//缓存当前框架的热点数据
var currentThemeHotspot = {};
//字体图标(包含个性化)
var iconFontPath = [];


var webViewListenerNavbar = function(){
    //v-portal门户自定义webview事件
    cmp.webViewListener.add({type: 'initSection'});
    document.addEventListener('initSection', function(e) {
        window.m3ToPortalFireEvent('initSection', e.data);
    });
    cmp.webViewListener.add({type: 'saveSectionCustomizeCallBack'});
    document.addEventListener('saveSectionCustomizeCallBack', function(e) {
        window.m3ToPortalFireEvent('saveSectionCustomizeCallBack', e.data);
    });

    cmp.webViewListener.add({type: 'refreshPortalData'});
    document.addEventListener('refreshPortalData', function(e) {
        window.m3ToPortalFireEvent('refreshPortalData', e.data);
    });
}


//父级webview监听触发的方法map
var handleMap = {
    'initSection': function(_newSpaceId) {//M3里面自定义快捷菜单的回调
        currentSpaceId = _newSpaceId || currentSpaceId;
        getAllColumnSummary();
    },
    'saveSectionCustomizeCallBack':function(path){//M3里面个性化空间栏目的回调 -- 刷新当前空间
        var _element = {
            id:"portalSpaceBar",
            tpl:"tpl-spaceBar",
            vPortalMainFrameElementsId:"spaceBar"
        }
        getElementDataAndInit(_element,path.data);
        initSection(path.data);
    },
    'refreshPortalData':function(_parameter){//M3新建后返回刷新栏目
    	if(_parameter){
    		refreshData(_parameter);
    		myScroll.refresh();
    	}
    }
}
/**
 * 父级webview监听触发的方法
 * @param eventName 事件名称
 * @param params 参数
 */
window.m3ToPortalFireEvent = function(eventName, params) {
    handleMap[eventName](params);
}

//激活工作台页签点击的方法，避免多次点击导致的各种问题
var enableWorkbenchTabs = function(){
    //此方法已废弃，现在已经改为强制禁用3秒，之后才可以点击其他页签了
    return;
    //工作台的时候调用cmp的方法，去激活页签
    if(workbench == "workbench"){
        top.cmp.event.trigger("com.seeyon.m3.portalLoaded",top.document);
    }
}

//cmp window.onerror里面自定义的方法，报错了之后激活页签，要不然影响工作台的页签切换了
var pageErrorCatch = function(){
    //激活工作台切换的页签
    enableWorkbenchTabs();
}

/*-scroll相关-*/
var myScroll;
var loadingStep = 0; //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新
var pullDownEl, pullUpEl;

function GetRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
       var str = url.substr(1);
       var strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
       }
    }
    return theRequest;
 }




//横竖屏切换的时候
cmp.event.orientationChange(function(){
    setWrapperHeight();
    refreshPage(true);
})


/*-- CMP Ready，页面加载完后执行的内容(由于使用iframe,外层已经引用cmp.ready,此处必须放在js底部)--*/
if(workbench == "workbench"){
    window.onload = function(){
        initCMPReady();
    }
}else{
    cmp.ready(function() {
        initCMPReady();
    });
}


//非应用进来的返回事件
function bindBackbutton(){
    var backfunc = function(){
        //记录关闭事件
        wechatStastics.close();
        //从报表中心来的直接返回，而不是closePage  OA-153775
        if (typeof (Urlparam) !== "undefined" && Urlparam.m3from === 'vreport'){
            cmp.href.back();
            return;
        }
        cmp.href.closePage();
    }

    if (!cmp.platform.CMPShell) {
        //微协同
        cmp.backbutton();
        cmp.backbutton.push(backfunc);
    }else if(Urlparam && Urlparam.m3from === 'navbar'){
        //底导航
        cmp.backbutton();
        cmp.backbutton.push(cmp.closeM3App);
    }
}

function initCMPReady(){
    //根据path，加载css和js，然后初始化页面
	var mainFrameElementCss = _v5Path+"/portal/pagelayout/element_mobile/elements.css"+$verstion;
	var sectiontplsCssUrl = _v5Path+"/portal/sections/tpl_mobile/sectiontpls_mobile.css"+$verstion;
	cmp.asyncLoad.css([mainFrameElementCss,sectiontplsCssUrl]);
	var mainFrameElementJsUrl = _v5Path+"/portal/pagelayout/element_mobile/elements.js"+$verstion;
	var sectiontplsJsUrl = _v5Path+"/portal/sections/tpl_mobile/sectiontpls_mobile.js"+$verstion;
	cmp.asyncLoad.js([mainFrameElementJsUrl,sectiontplsJsUrl],function(){
		//初始化页面
		initPage();
	});

    //避免绑定多个
    if(!cmp.platform.CMPShell || (Urlparam && Urlparam.m3from != 'vreport') ){
        bindBackbutton();
    }

    //当门户配置在M3底导航的时候，需要绑定webViewListener的callback
    if(cmp.platform.CMPShell && Urlparam && Urlparam.m3from === 'navbar'){
        webViewListenerNavbar();
    }

    if (!cmp.platform.CMPShell) {
    	//微协同行为监测
    	wechatStastics.login();
    	wechatStastics.open();
    }
}

/*--一些函数--*/
/*-页面初始化-*/
var initPage = function() {
    //页面初始化时，把vjoin标识放入localStorage中，供其它模块适配使用
    cmp.storage.save("V-Join-Flag", "true", true);
    //M3会传portalId过来，微协同和vjoin通过ajax获取portalId

    if(typeof(currentPortalId) !== "undefined"){
        //m3：取传过来的门户portalId、渲染这个门户的主框架（包含门户列表）、渲染第一个空间的栏目
        //所有端 - 切换门户也走这里
        initMainFrameElement(currentPortalId);

        //第一次未定义的时候标识一下即可，避免把切换门户带过来的currentPlatform覆盖掉
        if(currentPlatform==""){
            currentPlatform = "m3";
        }
    }else{
        //微协同、vjoin
        var _url = _v5Path + "/rest/mobilePortal/portals/mobile";
        cmp.ajax({
            type: "GET",
            url: _url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language': "zh-CN",
                "token": CMP_V5_TOKEN || ""
            },
            dataType: "json",
            success: function(result) {
                if(result.code == "200") {
                    var _portals = result.data;
                    if(_portals && _portals.length > 0) {
                        var firstPortal = _portals[0];
                        currentPortalId = firstPortal.portalId;
                        if(firstPortal.portalType == "vjoin") {
                            //vj
                            currentPlatform = "vjoin";
                            initMainFrameElement(firstPortal.portalId,"isVjoin");
                        }else{
                            //微协同：渲染第一个门户的主框架（包含门户列表）、渲染第一个门户的空间列表、渲染第一个空间的栏目
                            currentPlatform = "wxt";
                            initMainFrameElement(currentPortalId);
                        }
                    }else{
                        //无权限的时候提示并返回，只有微协同会有这种情况
                        cmp.notification.alert(cmp.i18n("portal.label.noPortal"), function(){ cmp.href.back(); }, null, cmp.i18n("portal.label.confirm"),function(){ cmp.href.back(); });
                    }
                }
            },
            error: function(result) {
                //激活工作台切换的页签
                enableWorkbenchTabs();

                var cmpHandled = cmp.errorHandler(result);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    console.log(result);
                }
            }
        });
    }
};

//因为主框架采用渲染的，所以之前的有些渲染逻辑需要同步搬进异步中
var initPageAsync = function(_isVjoin){
    setWrapperHeight();

    if(typeof(wrapper) === "undefined"){
        wrapper = document.getElementById("wrapper");
    }

    //创建“下拉”“上拉”的dom
    var scroller = wrapper.querySelector("#scrollBack");
    //创建“下拉刷新”的dom
    var pullDown = document.createElement("div");
    pullDown.id = "pullDown";
    pullDown.innerHTML = scrollText.pullDownLable;
    scroller.insertBefore(pullDown, scroller.childNodes[0]);
    pullDownEl = document.getElementById("pullDown");
    //创建“上拉加载更多”的dom
    var pullUp = document.createElement("div");
    pullUp.id = "pullUp";
    pullUp.innerHTML = scrollText.pullUpLable;
    scroller.appendChild(pullUp);
    pullUpEl = document.getElementById("pullUp");

    //vjoin直接渲染空间 按常规走一波
    if(_isVjoin == "vjoinmobile" && false){
        initSection("vjoinmobile");
    }else{
        //获取spacePath
        //获取所有栏目的概要，并渲染第一屏的栏目
        getAllColumnSummary();
    }


    //为"上拉加载更多、下拉刷新"功能初始化iscroll组件
    var _iscrollWrapper = document.getElementById("containerWrapper");
    myScroll = new IScroll(_iscrollWrapper, {
        useTransition: true,
        probeType: 2,
        click: true
    });
    //滚动时
    myScroll.on('scroll', function() {
        if (loadingStep == 0 && !pullDownEl.className.match('loading') && !pullUpEl.className.match('loading')) {
            if (this.y > 20) {
                //下拉刷新效果
                pullDownEl.style.display = "block";
                myScroll.refresh();
                pullDownEl.classList.add("loading");
                pullDownEl.innerHTML = scrollText.pullingDownLable;
                loadingStep = 1;
            } else if (this.y < (this.maxScrollY - 20) && !pullUpEl.className.match("nomore")) {
                //上拉刷新效果
                pullUpEl.style.display = "block";
                myScroll.refresh();
                pullUpEl.classList.add("loading");
                pullUpEl.innerHTML = scrollText.pullingUpLable;
                loadingStep = 1;
            }
        }
        if((this.y < this.maxScrollY) && (this.pointY < 1)){
            this.scrollTo(0, this.maxScrollY, 400);
            return;
        } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
            this.scrollTo(0, 0, 400);
            return;
        }
    });
    //滚动完毕
    myScroll.on('scrollEnd', function() {
        if (loadingStep == 1) {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.innerHTML = scrollText.loadingLable;
                loadingStep = 2;
                loadMoreColumn();
            } else if (pullDownEl.className.match('loading')) {
                pullDownEl.innerHTML = scrollText.loadingLable;
                loadingStep = 2;
                refreshPage();
            }
        }
    });

    cmp("#pullUp").on("tap",".showOperateArea",function () {
            //空间栏目个性化改为页面跳转
            var options = {};
            if(cmp.platform.CMPShell){
                options.openWebViewCatch = 1;

            }
            //这里为了空间栏目个性化页面获取数据
            localStorage.setItem("currentPortalId",currentPortalId);
            localStorage.setItem("currentSpaceId",_spaceId);
            cmp.href.next(_portalPath + "/html/sectionSelectionSort.html?cmp_orientation=auto&datetime=" + new Date().getTime(),null,options);

        });
}

//获取主框架元素，并调用渲染函数
var initMainFrameElement = function(_portalId,_isVjoin) {
    if(_isVjoin === "isVjoin" && false) {//vjoin 多空间改造 ，暂时传false
        //vjoin 默认模板1的样式
        cmp.asyncLoad.css(["/seeyon/portal/pagelayout/skin_mobile/01.css","/seeyon/portal/icons/default/fonts/plane/iconfont.css"+$verstion]);
        //vjoin，无框架信息，创建一个栏目区，开始渲染栏目
        renderVJFrameElement();
        initPageAsync("vjoinmobile");
    }else{
        //_portalId为空的时候防护下
        if (!_portalId){
            cmp.notification.alert("接口调用参数错误");
            return;
        }

        //不是vjoin，需要请求框架数据，并渲染框架
        var _url = _v5Path + "/rest/mobilePortal/getVPortalFrameInfo?portalId=" + _portalId;
        cmp.ajax({
            type: "GET",
            url: _url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language': "zh-CN",
                "token": CMP_V5_TOKEN || ""
            },
            dataType: "json",
            success: function(result) {
                if(result.data && result.data.portalElementTpls && result.data.portalHtml){
                    currentThemeHotspot = cmp.parseJSON(result.data.themeHotspot);
                    //异步加载皮肤
                    var _themeCss = _v5Path + result.data.msPath + $verstion;
                    cmp.asyncLoad.css([_themeCss]);
                    //异步加载字体图标
                    var _iconCss = _v5Path + result.data.iconPath + $verstion;
                    iconFontPath.push(_iconCss);
                    cmp.asyncLoad.css([_iconCss]);

                    //如果在样式库替换了图标，需要加载新的css去覆盖
                    if(result.data.iconCustomPath!=""){
                        //异步加载自定义的图标
                        var _iconCustomCss = _v5Path + result.data.iconCustomPath + (cmp.platform.CMPShell ? "&from=m3mobile" : "") + $verstion;
                        iconFontPath.push(_iconCustomCss);
                        cmp.asyncLoad.css([_iconCustomCss]);
                    }

                    var _layoutJs = _v5Path + result.data.jsPath + $verstion;
                    cmp.asyncLoad.js([_layoutJs],function(){
                        renderMainWrapper2Body(result.data.portalHtml);
                        renderMainFrameElement(result.data.portalElementTpls);
                    });
                }
            },
            error: function(result) {
                //激活工作台切换的页签
                enableWorkbenchTabs();

                console.log("getVPortalFrameInfo error!")
                var cmpHandled = cmp.errorHandler(result);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    console.log(result);
                }
            }
        });
    }
}

//将主框架的HTML渲染至内容区
var renderMainWrapper2Body = function(result) {
    document.getElementById("portalBody").innerHTML = result;
	setTimeout(function(){  //这里实在找不到dom加载入口暂时加上延迟
		//增加返回按钮业务逻辑  --马山
		var param = cmp.href.getParam();
        if(typeof(param) == "undefined") return;
        var backBtnDom = document.querySelector('#backBtn');
        var hrefMark = GetRequest().ParamHrefMark;
        var m3from = param.m3from || "";
        if(!m3from || m3from == "vreport"){
            if((param || hrefMark) && backBtnDom){
                backBtnDom.innerHTML = '<span class="see-icon-v5-common-arrow-back" style="margin-right:5px;"></span><span class="left_word nav-text">'+cmp.i18n("portal.label.back")+'</span>';
                backBtnDom.addEventListener('click',function(){
                    goBack();
                },false);
                //安卓自带返回键
                document.addEventListener("backbutton", function() {
                    goBack();
                });
		    }
        }
    },500);


}
function goBack(){
    if(localStorage.getItem("portalId")){
        localStorage.removeItem("portalId");
    }

    if (cmp.platform.CMPShell) {
        cmp.webViewListener.fire({
            type:"initSection",
            data:"",
            success:function(){
                cmp.href.back();
            },
            error:function(){
                cmp.href.back();
            }
        })
    } else {
        cmp.href.back();
    }
}
//渲染主框架元素
var renderMainFrameElement = function(result) {
    var portalElementTplsList = cmp.parseJSON(result);
    for (var i = 0, len = portalElementTplsList.length; i < len; i++) {
        //获取第i个元素
        var currentElement = portalElementTplsList[i];
        currentElement.vPortalMainFrameElementsId = currentElement.tpl.split("-")[1];
        //获取并执行元素的beforeInit
        getElementBeforeInitFunction(currentElement);
    }
}

//渲染适合vjoin的框架，仅有栏目区
var renderVJFrameElement = function() {
    var vjoinFrameHtml = "<div id=\"wrapper\" class=\"wrapper\"><div id=\"containerWrapper\" class=\"wrapper\"><div id=\"scroller\" class=\"scroller\"><div id=\"scrollBack\"><div id=\"columnArea\"></div></div></div></div></div>";
    document.getElementById("portalBody").innerHTML = vjoinFrameHtml;
}

//处理滚动区的高度
var setWrapperHeight = function() {
    //因未使用cmp listView，需要为内容区设置高度
    var _pageH = _pageH = window.innerHeight;

    var _topH = document.getElementById("portalTopArea") ? document.getElementById("portalTopArea").clientHeight : 0;
    var _footerH = document.getElementById("portalFooterArea") ? document.getElementById("portalFooterArea").clientHeight : 0;
    if(document.getElementById("containerWrapper")){
        document.getElementById("containerWrapper").style.height = _pageH - _topH - _footerH + "px";
        document.getElementById("containerWrapper").style.top = _topH + "px";
    }
}

//获取并执行元素的beforeInit
var getElementBeforeInitFunction = function(_thisElement){
    var vPortalMainFrameElementsId = _thisElement.vPortalMainFrameElementsId;
    //如果有beforeInit，就执行
    if (vPortalMainFrameElements[vPortalMainFrameElementsId].beforeInit) {
        vPortalMainFrameElements[vPortalMainFrameElementsId].beforeInit(_thisElement);
    }
    //获取元素的数据并初始化
    getElementDataAndInit(_thisElement);
}

//获取元素的数据(getData)并初始化(init)
var getElementDataAndInit = function(_thisElement, spacePath){
    //缓存两个变量
    var elementId = _thisElement["id"];
    //获取元素的数据
    var _thisElementObject = vPortalMainFrameElements[_thisElement.vPortalMainFrameElementsId];
    var _tempData = (_thisElementObject !== undefined && _thisElementObject.getData !== undefined && _thisElementObject.getData() !== undefined) ? _thisElementObject.getData() : null;
    //渲染元素
    //如果有返回的动态数据，请求模板并渲染
    if (_tempData !== null) {
        //如果_tempData为数字，转换为string
        var __tempData = isNaN(_tempData) ? _tempData : _tempData.toString();
        var _tplurl = _v5Path + "/portal/pagelayout/element_mobile/" + _thisElement.tpl + "-mobile.html" + $verstion;//移动端框架元素的模板文件
        //因cmp ajax不支持将参加传进success，封装一个newAjax，并调用
        var _getTplAjax = new newAjax({
            type: "GET",
            dataType: 'html',
            url: _tplurl,
            thisElement: _thisElement,
            elementData: __tempData,
            success: function(tplData, ret) {
                if(ret.elementData !== "false"){
                    //返回的数据不为false，表示需要渲染，并执行对应的afterInit
                    renderThisElement(ret.elementData, tplData, ret.thisElement);
                    getElementAfterInitFunction(ret.thisElement);
                }else{
                    //返回的数据为false，表示无需渲染，仅执行对应的afterInit
                    getElementAfterInitFunction(ret.thisElement,tplData,spacePath);
                }

            },
            error: function(error, ret) {
                 console.log(ret.thisElement.elementId + "模板出错了:" + error);
            }
        });
    }
}

//封装一个newAjax供传参数进success
function newAjax(options) {
    var _e = options.success;
    options.success = this.succesCb(options, _e);
    options.error = this.errorCb(options, _e);
    cmp.ajax(options);
}
newAjax.prototype.succesCb = function(options, _e) {
    return function(res) {
        _e(res, options)
    }
}
newAjax.prototype.errorCb = function(options, _e) {
    return function(res) {
        _e(res, options)
    }
}

//渲染当前的元素
var renderThisElement = function(elementData,tplData,thisElement) {
    renderTpl(elementData, tplData, thisElement.id);
    //初始元素的相关事件（如果有）
    var elementId = thisElement.id;
    var vPortalMainFrameElementsId = thisElement.vPortalMainFrameElementsId;
    vPortalMainFrameElements[elementId] !== undefined && vPortalMainFrameElements[elementId].init !== undefined && vPortalMainFrameElements[elementId].init(vPortalMainFrameElementsId) !== undefined && vPortalMainFrameElements[elementId].init(vPortalMainFrameElementsId);
}

//渲染某个DOM，可渲染框架元素、框架、everything
var renderTpl = function(_data, _tpl, _domId) { //_data：json数据，_tpl：模板的html，_dom：被渲染的DOM
    //如果_data为""，赋值为{}，避免laytpl报错
    var _htmlTemp = cmp.tpl(_tpl, _data);
    document.getElementById(_domId).innerHTML = _htmlTemp;
    _htmlTemp = null;
}

//获取元素的afterInit，并执行
var getElementAfterInitFunction = function(thisElement,tplData,spacePath) {
    var vPortalMainFrameElementsId = thisElement.vPortalMainFrameElementsId;
    vPortalMainFrameElements[vPortalMainFrameElementsId].afterInit && vPortalMainFrameElements[vPortalMainFrameElementsId].afterInit(thisElement.id,thisElement,tplData,spacePath);
}


/*-刷新页面，for下拉动作、切换门户-*/
var refreshPage = function(_pageLoad) {
    //重置一下已经加载完的栏目标记
    colLoadedNum = 0;

    loadedColumnIndex = [];
    //清空页面，并重新创建栏目占位
    createColumnPostion();
    //获取第一屏的栏目数据，并渲染
    getAndDrawFirstScreen();
    //重新设置pullUpEl区的文字及样式
    var _loadedColumnNum = loadedColumnIndex.length;
    if (_loadedColumnNum < columnSum) {
        pullUpEl.innerHTML = scrollText.pullUpLable;
        pullUpEl.setAttribute("class", "");
    }
    //设置pullDownEl区的文字及样式
    myScroll.refresh();
    loadingStep = 0;
    pullDownEl.innerHTML = scrollText.pullDownSuccess;
    if(!_pageLoad){
        setTimeout(function() {
            pullDownEl.innerHTML = "";
            pullDownEl.setAttribute("class", "");
            pullDownEl.style.display = "none";
            myScroll.refresh();
        }, 1000);
    }
};


/*--请求栏目并渲染的相关函数--*/

/*-加载更多栏目，for上拉动作-*/
var loadMoreColumn = function() {
    //已加载的栏目数量
    var _loadedColumnNum = loadedColumnIndex.length;
    //如果已加载数量>=栏目总数，停止加载操作
    if (_loadedColumnNum >= columnSum) {
        return;
    }
    //本次加载的起始index
    var _startColumnIndex = _loadedColumnNum;
    //本次加载的截止index
    if (_loadedColumnNum + eachScreenNum >= columnSum) {
        var _endColumnIndex = columnSum - 1;
    } else {
        var _endColumnIndex = _startColumnIndex + eachScreenNum - 1;
    }
    //更新一下标记的最后一个值
    _needGetColumnlen = _endColumnIndex+1;

    //开始请求及渲染，本轮请求eachScreenNum个栏目
    for (var i = _startColumnIndex; i <= _endColumnIndex; i++) {

        var _parameter = {
            //栏目的X坐标
            "x": allColumnSummary[i].x,
            //栏目的y坐标
            "y": allColumnSummary[i].y,
            //当前栏目下第一个页签的sectionId，section是A8后台用的，用于区别栏目类别
            "sectionBeanId": allColumnSummary[i].items[0].sectionId,
            //当前栏目块的ID
            "entityId": allColumnSummary[i].id,
            //是多页签的第几个
            "ordinal": "0",
            //空间类型
            "spaceType": _spaceType,
            //空间id
            "spaceId": _spaceId,
            //受限于A8的机制，需要给后台传width，但实际没啥用，遗憾的是不传会报错
            "width": "10",
            //一路往下传栏目的_index，供后续使用
            "_index": allColumnSummary[i]._index
        };
        getDataAndRenderSection(_parameter);

        loadedColumnIndex.push(i);
        if (loadedColumnIndex.length == columnSum) {
            pullUpEl.setAttribute("class", "");
            pullUpEl.classList.add("nomore");
            pullUpEl.innerHTML = scrollText.nomore;
            myScroll.refresh();
            loadingStep = 0;
            return;
        }
    }

    pullUpEl.classList.remove("loading");
    pullUpEl.innerHTML = scrollText.pullUpLable;
    pullUpEl.setAttribute("class", "");
    myScroll.refresh();
    loadingStep = 0;
};

function initSection(spacePath) {
    var _spaceUrl = replaceAjaxUrl("/seeyon/rest/mobilePortal/space");
    var body = {
        "path": spacePath,
        "showSp": "hide"
    };
    cmp.ajax({
        type: "POST",
        data: JSON.stringify(body),
        url: _spaceUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {
            if (typeof(result) === 'string') {
                try {
                    var allColumnData = cmp.parseJSON(result);
                    allColumnSummary = allColumnData.portlets;
                    _spaceId = allColumnData.spaceId;
                    _spaceType = allColumnData.spaceType;
                    _isAllowdefined = allColumnData.isAllowdefined;
                    // 非json格式的数字串会错误解析
                    if (typeof allColumnSummary === 'number') {
                        allColumnSummary = result;
                    }
                } catch (e) {
                    allColumnSummary = result;
                }
            } else {
                allColumnSummary = result.portlets;
                _spaceId = result.spaceId;
                _spaceType = result.spaceType;
                _isAllowdefined = result.isAllowdefined;
            }
            if(spacePath.indexOf("vjoinmobile") != -1){
                document.querySelector("title").innerHTML = result.accountName;
            }
            //将人员信息存入缓存中，cmp组件需要
            // var currentMember = "{\"name\":\"" + result.currentMember + "\"}";
            // window.localStorage.setItem("currentMember", currentMember);

            //更新栏目总数
            columnSum = allColumnSummary.length;

            //获取第三方js的列表  改造完之后走这里
            if(result.tplCodes){
                //把tplCodes缓存到空间摘要信息里面去
                vPortal.tplCodes = result.tplCodes;
                var _currentSpaceObject = vPortal.spacesSummary[_spaceId];
                LoadSectionThirdJsFiles(_currentSpaceObject);
            }else{
                refreshPage(true);
            }

            result = null;
            // console.log(allColumnSummary);
        },
        error: function(error) {
            //激活工作台切换的页签
            enableWorkbenchTabs();

            //do something with error
            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
                //cmp处理了这个错误
            }else {
                console.log(error);
            }
        }
    });
}


//判断本空间下的栏目是否有第三方JS，如果有，就加载它们(第一次是append script的方式、第二次是去重发ajax请求)
var LoadSectionThirdJsFiles = function(_currentSpaceObject) {
    var _templeteList = vPortal.tplCodes;
    if(_templeteList){
        var _templeteListArray = _templeteList.split(',');
        var _newList = "";
        for (var i = 0, len = _templeteListArray.length; i < len; i++) {
            var _this = _templeteListArray[i];
            if(vPortal.moduleCodeSet[_this] === undefined){
                vPortal.moduleCodeSet[_this] = _this;
                _newList += "," +_this;
            }
        }
        if(_newList.indexOf(",") === 0){
            _newList = _newList.substring(1);
        }

        var _urlEndString = $verstion.replace("?","&");
        var _url = _v5Path + "/portal/portalController.do?method=getModuleJs&tplCodes=" + _newList + "&fd=1&"+$verstion;
        //第一次加载有 tplCodesJs 的空间，第三方js采用 append script的方式
        if(_newList != "" && !hastplCodesJs){
            cmp.asyncLoad.js([_url],function(){
                hastplCodesJs = true;
                refreshPage(true);
            });
        }else if(_newList === ""){//如果本空间下栏目的第三方JS文件已缓存过了，就直接渲染栏目
            refreshPage(true);
        }else{
            //如果本空间下栏目有第三方JS未加载过，就异步加载它们
            cmp.ajax({
                type: 'GET',
                url: _url,
                dataType: 'script',
                ifModified: true,
                cache: true,
                headers: {
                    'Content-Type': 'text/javascript, application/x-javascript; charset=utf-8',
                    'Accept-Language': "zh-CN",
                    'token': CMP_V5_TOKEN || ""
                },
                success: function() {
                    refreshPage(true);
                },
                error:function(error) {
                    //激活工作台切换的页签
                    enableWorkbenchTabs();

                    var cmpHandled = cmp.errorHandler(error);
                    if(cmpHandled){
                        //cmp处理了这个错误
                    }else {
                        console.log(error);
                    }
                }
            });
        }
        _url = null ;
    }else{
        refreshPage(true);
    }
}


/*-获取所有的栏目摘要json-*/
var getAllColumnSummary = function() {

    //M3 发的ajax  请求
    //https://x.x.x.x:xxxx/mobile_portal/seeyon/rest/mobilePortal/spaces/-8951346736506188025

    // 微协同发的请求  这种情况请求不到数据
    // /seeyon/rest/mobilePortal/spaces/-8951346736506188025

    var _url = _v5Path + "/rest/mobilePortal/spaces/" + currentPortalId;
    cmp.ajax({
        type: "GET",
        url: _url,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {
            if(result.code == "200" && result.data.data.length > 0){
                var spacePath0 = result.data.data[0].spacePath;
                var spacePath0Name = result.data.data[0].spaceName;
                for (var i = 0; i < result.data.data.length; i++) {
                    //把全部空间摘要信息缓存起来
                    vPortal.spacesSummary[result.data.data[i].spaceId] = result.data.data[i];
                    if(result.data.data[i].spaceId == currentSpaceId){
                        localStorage.removeItem("spaceId");
                        spacePath0 = result.data.data[i].spacePath;
                        spacePath0Name = result.data.data[i].spaceName;
                        // break;
                    }
                }
                initSection(spacePath0);
                if(spacePath0Name!=='') document.title = spacePath0Name;
            }else {
                pullUpEl.style.display = 'none';
                myScroll.refresh();

                //激活工作台切换的页签
                enableWorkbenchTabs();
                cmp.notification.toast(cmp.i18n("portal.label.emptyColumnData"), "center");
            }
        },
        error: function(error) {
            //激活工作台切换的页签
            enableWorkbenchTabs();

            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
                //cmp处理了这个错误
            }else {
                console.log(error);
            }
        }
    });
};

/*-为每个栏目创建占位div，并渲染header、body-*/
var createColumnPostion = function() {
    //栏目被渲染至#columnArea中
    var _columnArea = document.getElementById("columnArea");
    _columnArea.innerHTML = "";
    //按序创建栏目占位div
    for (var i = 0, len = allColumnSummary.length; i < len; i++) {
        var _thisId = allColumnSummary[i].id;
        var _currentColumn = allColumnSummary[i];
        //拎出栏目的index，供后续使用
        allColumnSummary[i]._index = i;
        //创建占位div
        var _columnTempDiv = document.createElement("div");
        _columnTempDiv.id = "columnDom_" + _thisId;
        _columnTempDiv.className = "columnDom " + _currentColumn.items[0].sectionId;
        _columnArea.appendChild(_columnTempDiv, _columnArea.childNodes[0]);
        //将header、body渲染至占位div中
        var columnTpl = document.getElementById('columnTpl').innerHTML;
        var _htmlTemp = cmp.tpl(columnTpl, _currentColumn);
        document.getElementById("columnDom_" + _thisId).innerHTML = _htmlTemp;
        _htmlTemp = null;
    }
    _columnArea = null;
};

/*-根据栏目总数，判断第一屏应该请求哪些栏目-*/
var getAndDrawFirstScreen = function() {
    var columnSum = allColumnSummary.length;
    //如果栏目总数<首屏加载的栏目数，则请求并渲染全部栏目，否则请求并渲染第一屏的栏目
    if (columnSum < firstScreenNum) {
        _needGetColumnlen = columnSum;
    } else {
        _needGetColumnlen = firstScreenNum;
    }
    //循环出第一屏的栏目摘要
    for (var i = 0; i < _needGetColumnlen; i++) {
        var _currentColumn = allColumnSummary[i];
        //定义相关参数，A8 PC端有多页签的概念，所以这里的x、y、entityId、ordinal、width虽然移动端用不到，但也需要传给后台，否则请求不到数据（PC和移动端后台逻辑用的一套）
        var _parameter = {
            //栏目的X坐标
            "x": _currentColumn.x,
            //栏目的y坐标
            "y": _currentColumn.y,
            //当前栏目下第一个页签的sectionId，section是A8后台用的，用于区别栏目类别
            "sectionBeanId": _currentColumn.items[0].sectionId,
            //当前栏目块的ID
            "entityId": _currentColumn.id,
            //是多页签的第几个
            "ordinal": "0",
            //空间类型
            "spaceType": _spaceType,
            //空间id
            "spaceId": _spaceId,
            //受限于A8的机制，需要给后台传width，但实际没啥用，遗憾的是不传会报错
            "width": "10",
            //一路往下传栏目的_index，供后续使用
            "_index": _currentColumn._index
        };
        // 某些sectionBeanId有自己的JS需要在请求数据前执行，如天气栏目等，do it
        getSectionBeanIdInitFunction(_parameter);
        //请求栏目数据
        //getDataAndRenderSection(allColumnSummary[i]);
        //已请求过的栏目存入数组中，供分页功能使用
        loadedColumnIndex.push(i);
    }
    if(_needGetColumnlen == 0){
    	//激活工作台切换的页签
        enableWorkbenchTabs();
        setTimeout(function () {
            if (_isAllowdefined){
                pullUpEl.style.display = 'block';
                myScroll.refresh();
            }else{
                pullUpEl.style.display = 'none';
            }
        },1000);
    }
    if (loadedColumnIndex.length >= columnSum) {
        pullUpEl.setAttribute("class", "");
        pullUpEl.classList.add("nomore");
        pullUpEl.innerHTML = scrollText.nomore;
        pullUpEl.style.display = 'none';
        myScroll.refresh();
    }
};

// 某些sectionBeanId有自己的JS需要在请求数据前执行，如天气栏目，有些栏目的init又在resolveFunction中，所以需要判断
var getSectionBeanIdInitFunction = function(_parameter) {
    var _sectionBeanId = _parameter.sectionBeanId;
    var _rf = _parameter.rf;
    var _hasResolveFunctionInit = false;
    //有返回resolveFunction
    if(_rf != undefined && _rf != ""){
        //有resolveFunction对应的JS事件需要执行
        if (vPortal.sectionHandler[_rf] !== undefined && vPortal.sectionHandler[_rf].init !== undefined) {
            vPortal.sectionHandler[_rf].init(_parameter);
            _hasResolveFunctionInit = true;
        }
    }
    //没执行过resolveFunction对应的JS事件，看看有没有sectionBeanId对应的事件
    if(!_hasResolveFunctionInit){
        if (vPortal.sectionHandler[_sectionBeanId] !== undefined && vPortal.sectionHandler[_sectionBeanId].init !== undefined) {
            vPortal.sectionHandler[_sectionBeanId].init(_parameter);
        } else {
            selectRenderData(_parameter);
        }
    }
}

//如果栏目有假数据，调用假数据进行渲染，否则向后台发起ajax请求，获取真实的数据
var selectRenderData = function(_parameter) {
    var _sectionBeanId = _parameter.sectionBeanId;
    if (vPortal.sectionTestData != undefined && vPortal.sectionTestData[_sectionBeanId] != undefined) {
        //有假数据
        var _result = vPortal.sectionTestData[_sectionBeanId]();
        var _drawColumnData = new getSectionTplJsAndBeforeInit(_result, _parameter);
        _drawColumnData = null;
    } else {
        //没有假数据
        var _getDataAndRenderSection = new getDataAndRenderSection(_parameter);
    }
}

//是否终止栏目渲染
var breakRenderData = false;

/*-请求1个栏目的数据，并调用渲染函数-*/
var getDataAndRenderSection = function(_parameter) {
    var _projectionUrl = replaceAjaxUrl("/seeyon/rest/mobilePortal/projection");

    cmp.ajax({
        type: "POST",
        data: cmp.toJSON(_parameter),
        url: _projectionUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            "token": CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {

            //当栏目被调整过之后，不再继续渲染栏目，直接reload重新渲染即可
            if(breakRenderData) return;
            if(result.error=="not_exists"){
                breakRenderData = true;
                window.location.reload();
                return;
            }

            //console.log(result);
            var _drawColumnData = new getSectionTplJsAndBeforeInit(result, _parameter);
            result = null;
            _drawColumnData = null;
        },
        error: function(error) {
            //do something with error
        }
    });
};

//获取tpl对应的js，并执行相应的beforeInit
var getSectionTplJsAndBeforeInit = function(_result, _parameter) {
    if(_result.Data == null || typeof(_result.Data) == "undefined") {
        //如果Data为空
        _result.Data = new Object();
        _result.Data.resolveFunction = "nodata";
        var _drawColumnData = new drawColumnData(_result, _parameter);
        _drawColumnData = null;
    }else{
        //Data不为空
        var _resolveFunction = _result.Data.resolveFunction;
        if (vPortal.sectionHandler[_resolveFunction] !== undefined && vPortal.sectionHandler[_resolveFunction].beforeInit !== undefined) {
            vPortal.sectionHandler[_resolveFunction].beforeInit(_result, _parameter);
            //根据模板，渲染栏目
            var _drawColumnData = new drawColumnData(_result, _parameter);
            _drawColumnData = null;
        } else {
            //根据模板，渲染栏目
            var _drawColumnData = new drawColumnData(_result, _parameter);
            _drawColumnData = null;
        }
    }

}

/*-根据数据，渲染1个栏目-*/
var drawColumnData = function(_currentColumnData, _parameter) {
    //出现栏目被管理员干掉的情况时
    if(_currentColumnData.error=="not_exists"){
        var _panelBodyDom = document.getElementById("columnBody_" + _parameter.entityId).innerHTML = "栏目被管理员调整了，请重新登录。";
        return;
    }
    var _thisId = _parameter.entityId;
    //获取被渲染的区域：内容区
    var _drawArea = "columnBody_" + _thisId;
    //定义currentColumnData，供renderTpl使用
    this.currentColumnData = _currentColumnData;
    //当前栏目在页面中占的宽度
    this.currentColumnData._columnWidth = document.querySelector("#columnSection_" + _thisId).offsetWidth;
    //将当前栏目id，传进栏目数据中，供页面中使用
    this.currentColumnData._id = _thisId;
    //将当前栏目的sectionId(栏目类型)，传进栏目数据中，供页面中使用
    this.currentColumnData._sectionId = _parameter.sectionBeanId;
    //获取当前栏目的index，磁贴栏目有个奇葩的需求：第一个栏目为磁贴时需要特殊处理
    this.currentColumnData._index = _parameter._index;
    this.currentColumnData.spaceType = _spaceType;
    //如果Data为空
    if (_currentColumnData.Data == null) {
        var columnTypeTpl = document.getElementById("columnTpl_noData").innerHTML;
        this.renderTpl(columnTypeTpl, _drawArea);
        return;
    }
    //根据resolveFunction，查找对应的tpl并渲染
    var _resolveFunction = _currentColumnData.Data.resolveFunction;
    var _tplurl = _v5Path + "/portal/sections/tpl_mobile/tpl-" + _resolveFunction + ".html"+$verstion;//移动端栏目模板文件
    //获取模板html文件
    var _this = this;
	cmp.ajax({
        type: "GET",
        dataType: 'html',
        url: _tplurl,
        success: function(columnTypeTpl) {
        	_this.renderTpl(columnTypeTpl, _drawArea);
            ///执行栏目的afterInit
            getSectionTplJsAndAfterInit(_currentColumnData, _parameter);
            //刷新myScroll
            myScroll.refresh();
        },
        error: function(error) {
            //请求模板失败，采用columnTpl_other进行渲染
            var columnTypeTpl = document.getElementById('columnTpl_other').innerHTML;
            _this.renderTpl(columnTypeTpl, _drawArea);
            //并提示
    	    var cmpHandled = cmp.errorHandler(error);
            if(!cmpHandled){
                console.log(error);
                if(error.message){
                    cmp.notification.alert(error.message);
                }else{
                    cmp.notification.alert(error);
                }
            }
        }
    },_this);
};

/*--渲染栏目数据--*/
drawColumnData.prototype.renderTpl = function(_tpl, _drawArea) {
    var _htmlTemp = cmp.tpl(_tpl, this.currentColumnData);
    document.getElementById(_drawArea).innerHTML = _htmlTemp;
    _htmlTemp = null;
    var _showHeader = false;
    if (document.getElementById("columnHeader_" + this.currentColumnData._id) != null) {
        document.getElementById("columnHeader_" + this.currentColumnData._id).style.display = "block";
        _showHeader = true;
    }
    //为“更多”按钮绑定穿透事件
    var _thisData = this.currentColumnData.Data;
    if (typeof(_thisData) != "undefined" && _thisData != null) {
        var _moreLink = _thisData.moreLink;
    }
    if (_showHeader && _thisData != undefined && _moreLink != undefined && _moreLink != null) {
        var _columnMoreDom = document.getElementById("columnMore_" + this.currentColumnData._id);
        if (_moreLink != null && _moreLink != "false") {
            _columnMoreDom.style.display = "block";
            var _moreLinkParam = this.currentColumnData.Data.moreLinkParam;
            if (_moreLinkParam == null) {
                bindHref4Dom(_columnMoreDom, _moreLink);
            } else {
                bindHref4Dom(_columnMoreDom, _moreLink, JSON.parse(_moreLinkParam));
            }

        } else {
            var _columnTitleDom = document.getElementById("columnTitle_" + this.currentColumnData._id);
            if (_columnTitleDom != null) {
                _columnTitleDom.style.marginRight = "0";
                _columnMoreDom.style.display = "none";
            }
        }
    }
    _moreLink = null;
};

/*-为dom绑定点击事件，_linkDomClassName为需要绑定点击事件的dom的className，_linkUrlArray为链接数组(仅链接不存在于this.Data.rows[i].link中的栏目使用)，_linkUrlParm为链接跳转的相关参数(信息管理、基础数据两栏目)-*/
var bindListHrefFromClassName = function(_linkDomClassName, _currentColumnData, _linkUrlArray ,_linkUrlParam) {
    //查找要绑定的元素，如果找不着，return
    var _linkDoms = document.getElementById("columnBody_" + _currentColumnData._id).querySelectorAll("." + _linkDomClassName);
    //判断是否为第三方待办栏目
    var _isThirdSection = (_currentColumnData._sectionId == "thirdPendingSection"||_currentColumnData._sectionId == "thirdHasPendingSection");

    if (!_linkDoms) {
        return;
    }
    var _thisData = _currentColumnData.Data;
    var _sectionId = _currentColumnData._sectionId;
    if (typeof(_thisData) == "undefined" || _thisData == null || isEmptyObject(_thisData)) {
        console.error("《" + _currentColumnData.Name + "》栏目未获取到Data对象，请检查json源");
        return;
    }
    var _thisDataRows = _thisData.rows;
    if (typeof(_linkUrlArray) == "undefined") { //未传_linkUrlArray时，跳转的url默认为this.Data.rows[i].link
        if (_thisData != null && _thisData != undefined && _thisDataRows != null && _thisDataRows != undefined && _thisDataRows != "false") {
            for (var i = 0, len = _thisDataRows.length; i < len; i++) {
                var _resultListParam = _thisData.resultListParam;
                if (_sectionId == "thirdPendingSection"||_sectionId == "thirdHasPendingSection") {
                    bindThirdPending(_linkDoms[i], _thisDataRows[i]);
                    continue;
                }
                if(_resultListParam && _resultListParam[i] != ""){
                    bindHref4Dom(_linkDoms[i], _thisDataRows[i].link, JSON.parse(_resultListParam[i]));
                } else {
                    bindHref4Dom(_linkDoms[i], _thisDataRows[i].link);

                }
            }
        }
    } else { //传了_linkUrlArray时，跳转url为_linkUrlArray
        if (_thisData != null && _thisData != undefined) {
            //有_linkUrlParam时
            if (typeof(_linkUrlParam) == "undefined") {
                for (var i = 0, len = _linkUrlArray.length; i < len; i++) {
                    bindHref4Dom(_linkDoms[i], _linkUrlArray[i], _linkUrlParam, _isThirdSection);
                }
            } else {
                for (var i = 0, len = _linkUrlArray.length; i < len; i++) {
                    bindHref4Dom(_linkDoms[i], _linkUrlArray[i], _linkUrlParam[i]);
                }
            }

        }
    }
    _linkDoms = _thisData = _thisDataRows = null;
}

//获取tpl对应的js，并执行相应的afterinit
var getSectionTplJsAndAfterInit = function(_result, _parameter) {
    var _resolveFunction = _result.Data.resolveFunction;
    if (vPortal.sectionHandler[_resolveFunction] !== undefined && vPortal.sectionHandler[_resolveFunction].afterInit !== undefined) {
        vPortal.sectionHandler[_resolveFunction].afterInit(_result, _parameter);
    }
    colLoadedNum ++;
     //当全部加载完之后，刷新一下滚动条,fix一下滚动区的高度
    if (colLoadedNum == _needGetColumnlen) {
        //是否可以自定义空间
        if (_isAllowdefined){
            pullUpEl.style.display = 'block';
            //当前空间是否允许个性化设置
        }else{
            pullUpEl.style.display = 'none';
        }
        if(document.querySelector("#scrollBack").clientHeight <= document.querySelector("#containerWrapper").clientHeight){
            document.querySelector("#scrollBack").style.height = document.querySelector("#containerWrapper").clientHeight + 1 + "px";
        }else{
            document.querySelector("#scrollBack").style.height = "auto";
        }
        myScroll.refresh();
        //解析国际化
        cmp.i18n.detect();
        console.log("load all column success");
        //激活工作台切换的页签
        enableWorkbenchTabs();
    }

}

//刷新栏目
var refreshData = function (argument) {
    var _parameter = {
        //栏目的X坐标
        "x": argument.x,
        //栏目的y坐标
        "y": argument.y,
        //当前栏目下第一个页签的sectionId，section是A8后台用的，用于区别栏目类别
        "sectionBeanId": argument.sectionBeanId,
        //当前栏目块的ID
        "entityId": argument.entityId,
        //是多页签的第几个
        "ordinal": "0",
        //空间类型
        "spaceType": _spaceType,
        //空间id
        "spaceId": _spaceId,
        //受限于A8的机制，需要给后台传width，但实际没啥用，遗憾的是不传会报错
        "width": "10",
        //一路往下传栏目的_index，供后续使用
        "_index": argument._index
    };
    // 某些sectionBeanId有自己的JS需要在请求数据前执行，如天气栏目等，do it
    getSectionBeanIdInitFunction(_parameter);
}

/*-大多数情况下，跳转链接都在this.Data.rows[i].link中，但有一些栏目的链接不这里，需要单独查找链接并返回一个数组，供绑定跳转事件时使用-*/
var getLinkFromColumnObject = function(_obj) {
    if(!_obj) return;
    var _tempArray = [];
    if (_obj[0] instanceof Array) { //如果_obj[0]是数组，取_obj[i][0]
        for (var i = 0, len = _obj.length; i < len; i++) {
            _tempArray.push(_obj[i][0]);
        }
    } else { //如果_obj是Object，取每一个中的link
        for (var i = 0, len = _obj.length; i < len; i++) {
            if (typeof(_obj[i].link) == "undefined") {
                console.error("link获取失败，请检查json");
                return;
            }
            _tempArray.push(_obj[i].link);
        }
    }
    return _tempArray;
}
//获取跳转链接的参数
var getParamFromColumnObject = function(_obj) {
    if(_obj == null || _obj == ""){
        return null;
    }
    var _tempArray = [];
    for (var i = 0, len = _obj.length; i < len; i++) {
        if(_obj[i] != ""){
            _tempArray[i] = JSON.parse(_obj[i]);
        }
    }
    return _tempArray == [] ? null : _tempArray;
}

/*-绑定link-*/
var canClick = true;
var bindHref4Dom = function(_currentDom, _linkUrl, _linkUrlParam, _isNeedParseUrl) {
    if(cmp.platform.CMPShell && _isNeedParseUrl){
        cmp.event.click(_currentDom, function() {
            var urlObj = JSON.parse(_linkUrl);
            goToEntryUrl(urlObj.entry, urlObj.parameters);
        });
    }else if (_linkUrl == "noSupport") {
    	cmp.event.click(_currentDom, function() {
    		cmp.notification.toast(cmp.i18n("portal.pending.no.support"), "center");
    	});
    }else if (_linkUrl != "false" && _linkUrl != "") {
        cmp.event.click(_currentDom, function() {
            if (canClick) {
                canClick = false;
                try {
                    cmp.event.trigger("beforepageredirect", document);
                    var _finalLinkUrl = replaceUrl4M3(_linkUrl);
                    //cmp壳下使用多webview方式打开
                    if(cmp.platform.CMPShell){
                        //图面横幅m3穿透
                        if (_currentDom.className === 'sliderItem' || _currentDom.className === 'duplicateFirst') {
                            cmp.openWebView({
                                url: _finalLinkUrl,
                                header: _linkUrl,
                                useNativebanner: true
                            });
                            setTimeout(function() {
                                canClick = true;
                            }, 300);
                            return;
                        }
                        cmp.href.openWebViewCatch = function() {return 1;}
                    }
                    if (typeof(_linkUrlParam) == "undefined") {
                        cmp.href.next(_finalLinkUrl, null, { notuuid : true });
                    } else {
                        cmp.href.next(_finalLinkUrl, _linkUrlParam, { notuuid : true });
                    }
                    setTimeout(function() {
                        canClick = true;
                    }, 300);
                } catch(e) {
                    console.log(e);
                    setTimeout(function() {
                        canClick = true;
                    }, 300);
                }
            }
        });
    }
};

/*-M3壳下ajax请求url替换-*/
var replaceAjaxUrl = function(_ajaxUrl) {
    if(cmp.platform.CMPShell){
        _ajaxUrl = cmp.serverIp +_ajaxUrl;
    }
    return _ajaxUrl;
}

/*-M3壳下跳转替换url-*/
var replaceUrl4M3 = function(_linkUrl) {
    if(cmp.platform.CMPShell){
        var _finalUrl = _linkUrl;
        if(_linkUrl.indexOf("/seeyon/m3/apps/v5/collaboration") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/collaboration",_colPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/bulletin") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/bulletin",_bulPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/news") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/news",_newsPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/doc") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/doc",_docPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/mycollection") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/mycollection",_mycollectionPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/unflowform") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/unflowform",_unflowformPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/workflow") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/workflow",_workflowPath);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/formqueryreport") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/formqueryreport",_formqueryreportPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/edoc") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/edoc",_edocPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/meeting") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/meeting",_meetingPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/bbs") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/bbs",_bbsPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/inquiry") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/inquiry",_inquiryPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/taskmanage") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/taskmanage",_taskmanagePath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/calendar") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/calendar",_calendarPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/addressbook") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/addressbook",_addressbookPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/attendance") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/attendance",_attendancePath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/hr") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/hr",_hrPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/footprint") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/footprint",_footprintPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/show") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/show",_showPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/portal") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/portal",_portalPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/vreport") != -1){
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/vreport",_vreportPath);
        }
        else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/fullsearch") != -1){
          _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/fullsearch",_fullsearch);
        }else if(_linkUrl.indexOf("/seeyon/m3/apps/v5/cap4") != -1){
          _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/cap4",_cap4Path);
        }
        return _finalUrl;
    } else {
        return _linkUrl;
    }
}

/*-- 动态加载JS --*/
var loadScript = function(url, callback, cache) {
    cmp.ajax({
        type: 'GET',
        url: url,
        success: callback,
        error :function(e) {
            console.log(e);
        },
        dataType: 'script',
        ifModified: true,
        cache: true
    });
};

/*-判断Object就否为空-*/
var isEmptyObject = function(_obj) {
    var t;
    for (t in _obj)
        return !1;
    return !0
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return cmp.href.getParam();
}



var wechatStastics = {
	login : function(){
		//已经打开了微协同只是切换则不记录
		if(cmp.storage.get("wechat_stastic_id",true)){
			return;
		}
		var param = {};
		//设置调用类型是微信
		param.fromClientType = "wechat";
		//手机类型
		param.client = cmp.os.android ? 'android' : cmp.os.ios ? 'iphone' : 'other';
		//登录ajax请求
		cmp.ajax({
			type: "POST",
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Language': "zh-CN",
				'token': cmp.token || "",
				'option.n_a_s' : '1'
			},
			data: JSON.stringify(param),
			url: cmp.serverIp + "/seeyon/rest/m3/statistics/wakeUp",
			dataType: "json",
			success: function(result) {
				console.log("wechat login successful");
				if(result && result.data){
					cmp.storage.save("wechat_stastic_id",result.data.statisticId,true);
				}
			},
			error: function(error) {
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(error);
					}
				}
			}
		});

		//判断是不是新用户
		cmp.ajax({
			type: "POST",
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Language': "zh-CN",
				'token': cmp.token || "",
				'option.n_a_s' : '1'
			},
			data: {},
			url: cmp.serverIp + "/seeyon/rest/m3/statistics/login/wechat",
			dataType: "json",
			success: function() {
				console.log("wechat loginCheck successful");
			},
			error: function(error) {
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(error);
					}
				}
			}
		});
	},
	open : function(){
		//打开应用ajax请求
		cmp.ajax({
			type: "POST",
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Language': "zh-CN",
				'token': cmp.token || "",
				'option.n_a_s' : '1'
			},
			data: JSON.stringify({
				fromClientType : 'wechat',
				appName : '信息门户',
				appId : '1002'
			}),
			url: cmp.serverIp + "/seeyon/rest/m3/statistics/appClick",
			dataType: "json",
			success: function() {
				console.log("wechat open app successful");
			},
			error: function(error) {
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(error);
					}
				}
			}
		});
	},
	close : function(){
		//退出微协同
		var param = {};
		if(cmp.storage.get("wechat_stastic_id",true)){
			param.statisticId = cmp.storage.get("wechat_stastic_id",true);
		}

		cmp.ajax({
			type: "POST",
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Language': "zh-CN",
				'token': cmp.token || "",
				'option.n_a_s' : '1'
			},
			data: JSON.stringify(param),
			url: cmp.serverIp + "/seeyon/rest/m3/statistics/hide",
			dataType: "json",
			success: function() {
				console.log("wechat close successful");
			},
			error: function(error) {
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(error);
					}
				}
			}
		});
	}
};

function bindThirdPending(dom, rowData){
    cmp.event.click(dom, function() {
        var link = rowData.link;
        var currentAppId = rowData.category;
        var gotoParams = cmp.parseJSON(link);
        entryDetail (gotoParams, currentAppId);
    });
}

function entryDetail (appInfo, currentAppId) {
    cmp.app.loadApp({
        "appId": currentAppId,
        "bundle_identifier": appInfo.bundle_identifier,
        "bundle_name": appInfo.bundle_name,
        "team": appInfo.team,
        "version": appInfo.version,
        "appType": appInfo.appType,
        "downloadUrl": appInfo.downloadUrl,
        "entry": appInfo.entry,
        "parameters": "",
        success: function(res) {
            console.log(res);
        },
        error: function(res) {
            console.log(res);
        }
    });
}

/**
 * 通过空间ID查找对应门户ID
 */
function getPortalIdBySpaceId(_spaceId, callfunc) {
    cmp.ajax({
        type: "GET",
        url: _v5Path + "/rest/mobilePortal/getPortalId/" + _spaceId,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {
            if(result.code == "200" && result.data){
                if (callfunc) {
                    callfunc(result.data + "");
                }
                return result.data + "";
            }
        },
        error: function(error) {
            return -1;
        }
    });
}


/**
 * StringStringBuffer对象
 */
function StringBuffer() {
    this._strings_ = new Array();
}
StringBuffer.prototype.append = function(str) {
    if (str) {
        if (str instanceof Array) {
            this._strings_ = this._strings_.concat(str);
        } else {
            this._strings_[this._strings_.length] = str;
        }
    }

    return this;
}
StringBuffer.prototype.reset = function(newStr) {
    this.clear();
    this.append(newStr);
}
StringBuffer.prototype.clear = function() {
    this._strings_ = new Array();
}
StringBuffer.prototype.isBlank = function() {
    return this._strings_.length == 0;
}

StringBuffer.prototype.toString = function(sp) {
    sp = sp == null ? "" : sp;
    if (this._strings_.length == 0)
        return "";
    return this._strings_.join(sp);
}


/**
 *
 * @param url          跳转地址
 * @param params       跳转参数,没有默认传""
 * @param animate      跳转动画 m3.route.animated: left,right,none
 * openPage   是否新开webView
 */
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