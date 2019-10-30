var id;
var isForm;
var page = {};
//是否从底导航打开
var isFromM3NavBar = window.location.href.match('m3from=navbar');
cmp.ready(function() {
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cancelFav();
    headerShowOrNot();

    //搜索结果进入详情返回，搜索结果回显
    initListView('');
    document.querySelector('#search').addEventListener("click", function() {
        pageSearch(8967);
    });
    prevPage();
    searchDo();
    initOpen();
    //addCloseButton();
    document.title = cmp.i18n("mycollection.h5.mycollection");

    setInterval(function(){
        if (cmp.storage.get("docRefreshList", false) && cmp.storage.get("docRefreshList", true) == "1") {
            window.location.reload();
        }
    },500);
    if(cmp.webViewListener && cmp.webViewListener.addEvent){
        cmp.webViewListener.addEvent("myDocReload",function(e){
            window.location.reload();
        });
    }

});

//搜索后重置
function searchDo() {
    // 取消重新加载页面
    _$("#cancelSearch").addEventListener("click", function() {
        // 重置搜索条件
        initListView('');
        //清空page
        page = {};
        reloadPage();
    });

    _$("#toSearch").addEventListener("click", function() {
        var params = {};
        params.type = page.type;
        params.text = page.text;
        params.condition = page.condition;
        var id = page.id;
        params.value = page.dataSoure;
        pageSearch(8967, params);
    });
}

function reloadPage() {
    // 搜索条件
    var searchDiv = document.getElementById("search");
    var reSearchDiv = document.getElementById("reSearch");
    if (page.condition != undefined) {
        searchDiv.style.display = "none";
        reSearchDiv.style.display = "block";
        if (page.condition != "createTime") {
            _$("#searchText").style.display = "block";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchTextValue").value = page.dataSoure;
        }
    } else {
        searchDiv.style.display = "block";
        reSearchDiv.style.display = "none";
    }
}

function pageSearch(modelId, params) {
    var searchObj = [{
        type: "text",
        condition: "frName",
        text: cmp.i18n("mycollection.h5.title")
    }];

    cmp.search.init({
        id: "#search",
        model: { //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name: "doc", //模块名，如："协同"，名称开发者自定义
            id: modelId //模块的唯一标识：
        },
        parameter: params,
        items: searchObj,
        callback: function(result) { //回调函数：会将输入的搜索条件和结果返回给开发者
            var data = result.item; //返回的搜索相关的数据
            var condition = data.condition; //返回的搜索条件
            var dataSoure = ""; //搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
            var type = data.type; //搜索输入的数据类型有text和date两种
            var renderArea = data.search_result_render_area_ID; //提供一个该搜索页面上的可渲染的区域（可使用其作为滚动的容器）
            page["type"] = type;
            page["text"] = data.text;
            page["condition"] = condition;
            dataSoure = result.searchKey[0];
            page["dataSoure"] = result.searchKey[0];
            initListView(dataSoure);
            reloadPage();
        }
    });
    _$("#cmp_item_piker").style.display = "block";
    _$("#cmp_item_text").style.width = "55%";
}

function prevPage() {
    // if(isFromM3NavBar){
    //     document.getElementById("prev").style.display = "none";
    // }else{
    //     cmp("header").on('tap', "#prev", function(e) {
    //         backFrom();
    //     });
    // }
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}


function backFrom() {
    if (isFromM3NavBar){
        cmp.closeM3App();
        return;
    }
    if (_getQueryString("backURL") == "weixin") {
        cmp.href.closePage();
        return;
    }
    cmp.href.back();
}

//渲染函数
function renderData(data, isRefresh) {
    var liTPL = document.getElementById("pageContent_tpl").innerHTML;
    var html = cmp.tpl(liTPL, data);
    var content_dom = document.getElementById("list_content");
    if (isRefresh) {
        content_dom.innerHTML = html;
    } else {
        content_dom.innerHTML = content_dom.innerHTML + html;
    }
    cmp.i18n.detect();
}

var obj = {};

function initOpen() {
    cmp(".cmp-list-content").on("tap", ".cmp-list-cell",
        function() {
            var cmpData = cmp.parseJSON(this.getAttribute("cmp-data"));
            var frId = cmpData["fr_id"];
            var entranceType = cmpData["entranceType"];
            var fr_type = cmpData["fr_mine_type"];
            var isShareAndBorrowRoot = cmpData["isShareAndBorrowRoot"];
            obj = {};
            obj.cmpData = cmpData;
            cmp.dialog.loading();
            //判断文档是否存在
            $s.Doc.canOppen({
                "drId": frId,
                "frType": cmpData["fr_type"],
                "entranceType": entranceType
            }, {
                repeat: true,
                success: function(result) {
                    if (result == "1") {
                        //当前文档不存在
                        cmp.notification.alert(cmp.i18n("mycollection.h5.noExist"), function() {
                            cmp.listView("#allPending").pullupLoading(1);
                            cmp.dialog.loading(false);
                        }, cmp.i18n("mycollection.h5.alert"), cmp.i18n("mycollection.h5.OK"));
                        return;
                    } else if (result == "2") {
                        //没有打开文档的权限
                        cmp.notification.alert(cmp.i18n("mycollection.h5.noAuthoir"), function() {
                            cmp.dialog.loading(false);
                        }, cmp.i18n("mycollection.h5.alert"), cmp.i18n("mycollection.h5.OK"));
                        return;
                    } else if (result == "0") {
                        if (fr_type == 51) { //映射文件
                            $s.Docs.getDosBySourceId(cmpData["source_id"], "", {
                                repeat: true,
                                success: function(docsData) {
                                    fr_type = docsData.frType;
                                    var doc_id = docsData.id;
                                    var isPig = docsData.isPig;
                                    if (isPig == 'true') {
                                        cmpData["source_id"] = docsData.sourceId;
                                    }
                                    docCanOpen(fr_type, doc_id, cmpData);
                                },
                                error: function(error) {
                                    var cmpHandled = cmp.errorHandler(error);
                                    if (cmpHandled) {

                                    } else {}
                                }
                            });
                        } else {
                            docCanOpen(fr_type, frId, cmpData);
                        }
                    }
                    cmp.dialog.loading(false);
                },
                error: function(error) {
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {

                    } else {}
                    cmp.dialog.loading(false);
                }
            });
        }, false);
}
/**
 *
 */
function docCanOpen(fr_type, frId, cmpData) {
    var backPageInfo = _mycollectionPath + "/html/mycollectionIndex.html";
    var isNav = isFromM3NavBar && isFromM3NavBar.length>0;
    //搜索状态放入缓存方法
    if ((fr_type >= 101 && fr_type <= 122) || (fr_type >= 21 && fr_type <= 26)) {
        openDocNew(frId);
    } else {
        var source_id = cmpData["source_id"];
        $s.Doc.insertOpLog4Doc({
            "drId": frId
        }, {
            success: function() {
                if (fr_type == 8) { //讨论
                    bbsApi.jumpToBbs(source_id, "pigeonhole", backPageInfo,null,isNav);
                } else if (fr_type == 7) { //调查
                    inquiryApi.jumpToInquiry(source_id, "1", backPageInfo,null,isNav);
                } else if (fr_type == 6) { //公告
                    bulletinApi.jumpToBulletin(source_id, "1", backPageInfo,null,isNav);
                } else if (fr_type == 5) { //新闻
                    newsApi.jumpToNews(source_id, "1", backPageInfo,null,isNav);
                } else if (fr_type == 1 || fr_type == 9) { //协同、流程表单
                    collApi.openSummary({
                        summaryId: source_id,
                        openFrom: "docLib",
                        operationId: "1",
                        docResId: cmpData["fr_id"],
                        newWebView: isNav
                    });
                } else if (fr_type == 2) { //公文
                    edocApi.openSummary({
                        summaryId: source_id,
                        openFrom: "lenPotent",
                        docResId: cmpData["fr_id"]
                    });
                } else if (fr_type == 4) { //会议
                    meetingApi.jumpToMeetingSummary(source_id, "docLib", backPageInfo);
                } else { //暂时其他的类型
                    cmp.notification.alert(cmp.i18n("doc.h5.docTypeError"), null, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {

                } else {}
            }
        });
    }
}

/**
 * 打开html页面
 */
function openDocNew(doc_id) {
    var docParam = {
        "drId": doc_id,
        "isForm": isForm,
        "isFromCol": true,
        "pageInfo": _getCurrentPageInfo()
    };
    var option = {};
    if(isFromM3NavBar){
        option.openWebViewCatch = 1;
    }
    $s.Doc.insertOpLog4Doc({
        "drId": doc_id
    }, {
        success: function() {
            cmp.href.next(_docPath + "/html/docView.html", docParam, option);
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
        }
    });

}

//获取当前页面信息,用于页面返回使用
function _getCurrentPageInfo() {
    var _thisPage = {
        "url": _mycollectionPath + "/html/mycollectionIndex.html",
        "data": {
            "id": id
        }
    }
    return _thisPage;
}

function initListView(title) {
    var param = {
        "title": title
    };
    cmp.dialog.loading();
    var _crumbsID = "#allPending";
    if (cmp.storage.get("docRefreshList", false) && cmp.storage.get("docRefreshList", false) == "1") {
        _crumbsID += Math.random();
        cmp.storage.delete("docRefreshList", false);
    }
    cmp.listView("#allPending", {
        config: {
            pageSize: 20,
            params: param,
            crumbsID: _crumbsID,
            dataFunc: function(param, options) {
                param.pageSize = 20;
                $s.Docs.myFavorityList(param, {
                    success: function(result) {
                        options.success(result);
                        cmp.dialog.loading(false);
                    },
                    error: function(error) {
                        var cmpHandled = cmp.errorHandler(error);
                        if (cmpHandled) {

                        } else {}
                        cmp.dialog.loading(false);
                    }
                });
            },
            renderFunc: renderData,
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("mycollection.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("mycollection.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("mycollection.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("mycollection.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("mycollection.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("mycollection.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
}

//根据平台判断header是否隐藏
function headerShowOrNot() {
    document.body.removeChild(document.getElementById("shadow"));
}


/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl) {

    var p = pEl ? pEl : document;

    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}

//取消收藏
function cancelFav() {
    cmp('.cmp-list-content').on('tap', '.cmp-btn', function() {
        cmp.notification.confirm(cmp.i18n("mycollection.h5.sure.cancel"), function(index) {
            if (index == 0) {
                cmp.notification.close();
            } else if (index == 1) {
                var selectedNode = document.getElementsByClassName("cmp-slider-right cmp-disabled")[0];
                var selectedTag = selectedNode.getElementsByTagName("a")[0];

                var id = selectedTag.getAttribute("id");
                var source_id = selectedTag.getAttribute("source_id");
                var params = {
                    "docId": id,
                    "sourceId": source_id
                }
                cmp.dialog.loading();
                $s.Doc.cancelFavorite(params, {
                    success: function() {
                        cmp.notification.close();
                        location.reload(true);
                        cmp.dialog.loading(false);
                    },
                    error: function(error) {
                        var cmpHandled = cmp.errorHandler(error);
                        if (cmpHandled) {

                        } else {}
                        cmp.dialog.loading(false);
                    }
                });
            }
        }, "", [cmp.i18n("mycollection.h5.cancel"), cmp.i18n("mycollection.h5.OK")], -1, 1);
    }, false);
}

/**
 * 根据文件后缀判断是否可以打开
 * @param fr_name
 */
function canOpen(fr_name, flag) {
    var suffix = "";
    if (fr_name.lastIndexOf(".mp3") > 0) {
        if (flag) {
            suffix = ".mp3"
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".mp4") > 0) {
        if (flag) {
            suffix = ".mp4";
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".amr") > 0) {
        if (flag) {
            suffix = ".amr";
            return suffix;
        } else {
            return true;
        }
    } else {
        if (flag) {
            return suffix;
        } else {
            return false;
        }
    }
}

function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
    return null; //返回参数值
}

//添加头部的关闭按钮
function addCloseButton() {
    cmp.navigation.setCloseButtonHidden({
        hidden:false,
        success:function(){
        },
        error:function(error){
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
        }
    })
}