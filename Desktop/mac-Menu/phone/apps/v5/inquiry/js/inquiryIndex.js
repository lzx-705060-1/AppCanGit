var initParam = {};
//是否从底导航打开
var isFromM3NavBar = window.location.href.match('m3from=navbar');
cmp.ready(function() {
    //headerShow();
    loadType();
    initTab();
    prevPage();
    addInquiryDetailsHref();
});

//版块调查（有版块时，获取版块id）
function loadType() {
    var urlParam = cmp.href.getParam();
    if (urlParam && urlParam["typeId"]) {
        initParam['typeId'] = urlParam["typeId"];
    } else if (cmp.storage.get("Inquiry_List_typeId", true)) {
        initParam['typeId'] = cmp.storage.get("Inquiry_List_typeId", true);
    } else {
        initParam['typeId'] = '';
    }
}

function loadData(listType) {
    var listDomXpath = "#";
    var ajaxFunc;
    var callbackFunc;
    if(listType === "joined"){//我参加的
        listDomXpath += "all_inq";
        ajaxFunc = $s.Inquiries.inquiriesList;
        callbackFunc = renderData;
    }else if(listType === "started"){//我发起的
        listDomXpath += "startedListDiv";
        ajaxFunc = $s.Inquiries.startInquiryList;
        callbackFunc = renderData1;
    }else{
        return null;
    }
    var param = {
        'typeId': initParam['typeId']
    };
    cmp.listView(listDomXpath, {
        imgCache: true,
        config: {
            //captionType:1,
            //height: 50,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            dataFunc: function(params, options) {
                param.pageNo = params["pageNo"];
                param.pageSize = params["pageSize"];
                ajaxFunc({} ,param, {
                    success: function(result) {
                        options.success(result);
                        if(listType === "joined"){//我参加的
                            document.getElementById("tab1").setAttribute("isInit","false");
                        }else if(listType === "started"){//我发起的
                            document.getElementById("tab2").setAttribute("isInit","false");
                        }
                    },
                    error: function(error) {
                        var cmpHandled = cmp.errorHandler(error);
                        if (cmpHandled) {
                            //cmp处理了这个错误
                        } else {
                            //customHandle(error) ;//走自己的处理错误的逻辑
                        }
                    }
                });
            },
            renderFunc: callbackFunc,
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("inquiry.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("inquiry.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("inquiry.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("inquiry.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("inquiry.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("inquiry.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
}

/**
 * 加载模板数据
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
    var data = {
        list : result,
        listType : "joined"
    };
    var pendingTPL = document.getElementById("bul_list_li").innerHTML;
    var html = cmp.tpl(pendingTPL, data);
    if (!document.getElementById("bul_list")) {
        document.getElementById("bul_listAll").innerHTML =
            '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="bul_list"></ul>';
    }
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        document.getElementById("bul_list").innerHTML = html;
    } else {
        var table = document.getElementById("bul_list").innerHTML;
        document.getElementById("bul_list").innerHTML = table + html;
    }
}

/**
 * 加载我发起的模板数据
 * @param result
 * @param isRefresh
 */
function renderData1(result, isRefresh) {
    var data = {
        list : result,
        listType : "started"
    };
    var pendingTPL = document.getElementById("bul_list_li").innerHTML;
    var html = cmp.tpl(pendingTPL, data);
    if (!document.getElementById("bul_list")) {
        document.getElementById("startedList").innerHTML =
            '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="bul_list"></ul>';
    }
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        document.getElementById("startedListUl").innerHTML = html;
    } else {
        var table = document.getElementById("startedListUl").innerHTML;
        document.getElementById("startedListUl").innerHTML = table + html;
    }
}
/**
 * 列表添加点击事件
 */
function addInquiryDetailsHref() {
    cmp("#bul_list").on('tap', ".cmp-table-view-cell", function(e) {
        if (initParam['typeId']) {
            cmp.storage.save("Inquiry_List_typeId", initParam['typeId'], true);
        }
        var param = {
            "inquiryId": this.getAttribute("inquiryId"),
            "comeFrom": 0
        };
        var option = {};
        if(isFromM3NavBar){
            option.openWebViewCatch = true;
        }
        cmp.href.next(_inquiryPath + "/html/inquiryView.html" + "?r=" + Math.random(), param , option);
    });
    cmp("#startedList").on('tap', ".cmp-table-view-cell", function(e) {
        if (initParam['typeId']) {
            cmp.storage.save("Inquiry_List_typeId", initParam['typeId'], true);
        }
        var param = {
            "inquiryId": this.getAttribute("inquiryId"),
            "comeFrom": 4
        };
        var option = {};
        if(isFromM3NavBar){
            option.openWebViewCatch = true;
        }
        cmp.href.next(_inquiryPath + "/html/inquiryView.html" + "?r=" + Math.random(), param,option);
    })
}

function prevPage() {
    /*if(isFromM3NavBar){
        document.getElementById("goAheadBtn").style.display = "none";
    }else{
        cmp("header").on('tap', "#goAheadBtn", function(e) {
            cmp.storage.delete("Inquiry_List_typeId", true);
            cmp.href.back();
        });
    }*/
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(function() {
        cmp.storage.delete("Inquiry_List_typeId", true);
        if(isFromM3NavBar){
            cmp.closeM3App();
            return;
        }else{
            cmp.href.back();
        }
    });
}

function headerShow() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        // document.getElementsByTagName("header")[0].style.display = "none";
        document.getElementsByClassName("position_relative")[0].setAttribute("class", "position_relative");
        document.getElementsByClassName("position_relative")[0].style.top = "0";
        document.getElementsByClassName("cmp-control-content")[0].style.height = window.screen.height + "px";
    } else {
        // document.getElementsByTagName("header")[0].style.display = "block";
        document.getElementsByClassName("position_relative")[0].setAttribute("class", "cmp-content position_relative");
    }
}

function initTab(){
    new cmp.TabChange({
        nav:".cmp-tab-doState .li",  //自定义nav
        section:".cmp-tab-content", //自定义nav对应的section
        fn:function(nav,section){  //回调函数
            var listType = nav.getAttribute("list-type");
            if(listType === "joined"){//我参加的
                if(document.getElementById("tab1").getAttribute("isInit") === "true"){
                    loadData(listType);
                }else{
                    //console.log("跳过c1");
                }
            }
            if(listType === "started"){//我发起的
                if(document.getElementById("tab2").getAttribute("isInit") === "true"){
                    loadData(listType);
                }else{
                    //console.log("跳过c2");
                }
            }
        }
    });

    var listType = cmp.storage.get("listType",true);
    cmp.storage.delete("listType",true);
    if(listType && listType == 4){
        document.getElementById("tab1").classList.toggle("selected");
        document.getElementById("tab2").classList.toggle("selected");
        document.getElementsByClassName("cmp-tab-content")[0].classList.toggle("selected");
        document.getElementsByClassName("cmp-tab-content")[1].classList.toggle("selected");
        loadData("started");
    } else {
        loadData("joined");
    }
}