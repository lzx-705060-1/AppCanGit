var page = {};
//是否从底导航打开
var isFromM3NavBar = window.location.href.match('m3from=navbar');

cmp.ready(function() {
    if (document.getElementById("shadow")) {
        document.body.removeChild(document.getElementById("shadow"));
    }

    var pageCondition = cmp.storage.get("page", true);
    if (pageCondition) {
        page = JSON.parse(pageCondition);
        cmp.storage.delete("page", true);
    }
    loadType();
    reloadPage();
    addbbsDetailsHref();
    bbsCreate();
    searchEvent();

    // <title>显示
    document.getElementById("title").innerHTML = cmp.i18n("bbs.h5.bbs");
    window.setTimeout(function() {
        cmp.listView("#all_bbs").refresh();
    }, 500);
    document.getElementById("cmp-control").style.height = window.innerHeight + "px";
});

//版块讨论（有版块时，获取版块id）
function loadType() {
    var urlParam = cmp.href.getParam();
    if (urlParam) {
        page["typeId"] = urlParam["typeId"] || "-1";
    }

    $s.BbsList.bbsBoardList({}, {
        success: function(result) {
            if(!result.isV5Member){
                _$(".bbsBoardNav").classList.add("display_none");
                _$("#all_bbs").style.top="48px";
                return;
            }
            var data = result.typeListMap.all;
            var str = '';
            str += '<span  id="-1" >' + cmp.i18n("bbs.h5.type.all") + ' </span>';
            for (i = 0; i < data.length; i++) {
                str += '<span  id="' + data[i].id + '" >' + (data[i].name + '') + '</span>';
            }
            document.getElementById("option").innerHTML = str;
            var tpl = document.getElementById("bbsBoardList").innerHTML;
            var html = cmp.tpl(tpl, result.typeListMap);
            document.getElementById("bbsBoardDiv").innerHTML = html;
            cmp.i18n.detect();
            //点击浮层的分类时加载
            cmp(".item").on('tap', ".name", function(e) {
                page["typeId"] = this.id;
                activeTab();
                reloadPage();
                var obj = _$("#option .active");
                var objThis = _$("#showBoardBtn");
                setTimeout(function() {
                    filterLists(objThis);
                    scrollMid(obj);
                }, 250);
            });

            var timer;
            cmp(".bbsBoardNav").on('tap', '#showBoardBtn', function() {
                var objThis = this;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    filterLists(objThis);
                }, 250);


            });
            //点击列表类型，切换激活样式，将其他的样式改为未激活
            cmp("#option").on('tap', "span", function(e) {
                page["typeId"] = this.id;
                reloadPage();
            });
        }
    });
}
//筛选滚动条居中定位
function scrollMid(objThis) {
    var actObj = objThis,
        left = _$("#option").offsetLeft,
        //激活的dom相对于窗口的左边距离
        actOffX = actObj.offsetLeft,
        //当前激活的dom宽度
        actW = actObj.clientWidth,
        //窗口的宽度
        winW = document.documentElement.clientWidth,
        //父级滚动条的滚动left值
        scrollX = _$("#option").scrollLeft;
    if (actOffX > scrollX) {
        if (winW / 2 > (actOffX - scrollX)) {
            _$("#option").scrollLeft = scrollX;
        } else {
            _$("#option").scrollLeft = actOffX - winW / 2;
        }
    } else {
        _$("#option").scrollLeft = actOffX - winW / 2
    }
}
//过滤器
function filterLists(selector) {
    if (!selector.firstElementChild.classList.contains("icon-active")) {
        selector.firstElementChild.classList.add("icon-active");
        _$("#bbsBoardDiv").classList.remove("display_none");
        _$("#bbsBoardDiv").style.zIndex = "5";
        _$(".bbsBoardNav").style.zIndex = "10";
        _$("#bbsBoardDiv").classList.add('fade-down');
        setTimeout(function() {
            _$("#bbsBoardDiv").classList.remove('fade-down');
        }, 200);
        activeChoose();
        _$("#option").classList.add("display_none");
        _$('.sort-btn').classList.remove('display_none');
        _$(".createFilter").classList.remove("display_none");
        _$(".createFilter").style.zIndex = "2";
        _$("#bbs_listAll").classList.add("blur");
        _$("#bbs_listAll").style.zIndex = "1";
        _$("#bbs_list_search").style.display = "none";
    } else {
        selector.firstElementChild.classList.remove("icon-active");
        _$("#bbsBoardDiv").classList.add("display_none");
        _$("#bbsBoardDiv").classList.add('fade-up');
        setTimeout(function() {
            _$("#bbsBoardDiv").classList.remove('fade-up');
        }, 200);
        _$("#option").classList.remove("display_none");
        _$('.sort-btn').classList.add('display_none');
        _$(".createFilter").classList.add("display_none");
        _$(".createFilter").style.zIndex = "96";
        _$("#bbs_listAll").classList.remove("blur");
        _$("#bbs_list_search").style.display = "";
    }
}
/**
 * 设置选择版块页对应样式为选中状态
 */
function activeChoose(){
  var objArray = _$("#option .active",true);
  //默认全部
  var tag = "-1";
   if(objArray != null && objArray.length == 1){
     tag = objArray[0].id;
   }
   var allOperations = _$(".operateArea .name",true)
   for(j=0;j<allOperations.length;j++){
     if(tag == allOperations[j].id){
       allOperations[j].classList.add("choose");
     }else{
       allOperations[j].classList.remove("choose");
     }
   }
}

function reloadPage() {
    // 搜索条件
    var searchDiv = document.getElementById("search");
    var searchDivTop = document.getElementById("searchDivTop");
    var reSearchDiv = document.getElementById("reSearch");
    if (page.condition != undefined) {
        searchDiv.style.display = "none";
        searchDivTop.style.display = "none";
        reSearchDiv.style.display = "block";
        if (page.condition != "publishDate") {
            _$("#searchText").style.display = "block";
            _$("#searchDate").style.display = "none";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchResultSpan").innerHTML = page.textHTML;
            _$("#searchTextValue").value = _$("#searchResultSpan").innerText;
            page.textfield1 = _$("#searchResultSpan").innerText;
        } else {
            _$("#searchText").style.display = "none";
            _$("#searchDate").style.display = "block";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchDateBeg").value = page.textfield1;
            _$("#searchDateEnd").value = page.textfield2;
        }
        cmp.backbutton.pop();
    } else {
        searchDiv.style.display = "block";
        searchDivTop.style.display = "block";
        reSearchDiv.style.display = "none";
    }

    var result = $s.BbsList.getBbsList;
    loadData(result, page);

    window.setTimeout(function() {
      activeTab();
    }, 200);
}
function activeTab(){
  var curTabId = page["typeId"] || "-1";
  var objArray = _$("#option .active",true);
   if(objArray != null){
       for(i=0;i<objArray.length;i++){
         objArray[i].classList.remove("active");
       }
   }
   var allOption = _$("#option span",true);
   for(j=0;j<allOption.length;j++){
     if(curTabId == allOption[j].id){
       allOption[j].classList.add("active");
       break;
     }
   }
}

function pageSearch(modelId, params) {
    var searchObj = [{
        type: "text",
        condition: "title",
        text: cmp.i18n("bbs.h5.title")
    }, {
        type: "text",
        condition: "publishUser",
        text: cmp.i18n("bbs.h5.creater")
    }, {
        type: "date",
        condition: "publishDate",
        text: cmp.i18n("bbs.h5.dateTime")
    }];
    cmp.search.init({
        id: "#search",
        model: {
            name: "bbs",
            id: modelId
        },
        parameter: params,
        items: searchObj,
        callback: function(result) { // 回调函数：会将输入的搜索条件和结果返回给开发者
            if (!result.item) {
                page = {};
            }
            //$("#CMP_SearchContent").hide();
            var data = result.item; // 返回的搜索相关的数据
            var condition = data.condition; // 返回的搜索条件
            var dataSoure = ""; // 搜索输入的数据 如果type="text",为普通文本，如果type="date"
            var type = data.type; // 搜索输入的数据类型有text和date两种
            page["type"] = type;
            page["text"] = data.text;
            if (type == "date") {
                page["textfield1"] = result.searchKey[0];
                page["textfield2"] = result.searchKey[1];
            } else {
                page["textfield1"] = result.searchKey[0];
                page["textHTML"] = result.searchKey[0];
            }
            page["condition"] = condition;

            reloadPage();
        }
    });
}

/**
 * 搜索绑定事件
 */
function searchEvent() {
    cmp.event.click(_$('#search'), function() {
        setTimeout(function() {
            if (_$("#search_container")) {
                return;
            } else {
                pageSearch(9);
                cmp.event.click(_$("#cancel").parentNode, function() {
                    page = {};
                    window.setTimeout(function() {
                        reloadPage();
                    }, 200);
                    
                });
                if (cmp.platform.wechat) {
                    document.getElementsByClassName("cmp-content")[document.getElementsByClassName("cmp-content").length - 1].style.top = "0";
                }
            }
        }, 400);
    });

    // 取消重新加载页面
    cmp.event.click(_$("#cancelSearch"), function() {
        // 重置搜索条件
        page = {};
        window.setTimeout(function() {
            reloadPage();
        }, 200);
        window.setTimeout(function() {
            cmp.listView("#all_bbs").refresh();
        }, 500);
    });

    cmp.event.click(_$("#toSearch"), function() {
        var params = {};
        params.type = page.type;
        params.text = page.text;
        params.condition = page.condition;
        if (page.type == "date") {
            params.value = [page.textfield1, page.textfield2];
        } else {
            params.value = _$("#searchResultSpan").innerText;
        }
        pageSearch(9, params);
        cmp.event.click(_$("#cancel").parentNode, function() {
            page = {};
            reloadPage();
            window.setTimeout(function() {
                cmp.listView("#all_bbs").refresh();
            }, 500);
        });
    });
}

function loadData(subDataFunc, params) {
    //新建讨论后，用于更新listView不取缓存数据
    var _isListRefresh = cmp.storage.get("BBS_Create_Success_Refresh", true) == "true" ? true : false;
    cmp.storage.delete("BBS_Create_Success_Refresh", true);
    var bbs_crumbsID = params.condition || page.length==0 || page["typeId"] ? "#all_bbs&search" + Math.random() : "#all_bbs";
    if (_isListRefresh) {
        bbs_crumbsID = bbs_crumbsID + Math.random();
        cmp.storage.save("BBS_Create_Success_Refresh_continue", bbs_crumbsID, true);
    }
    if (bbs_crumbsID == "#all_bbs" && cmp.storage.get("BBS_Create_Success_Refresh_continue", true) != null) {
        //用于取新建讨论后，新的bbs_crumbsID，并对listView缓存
        bbs_crumbsID = cmp.storage.get("BBS_Create_Success_Refresh_continue", true);
    }
    cmp.listView("#all_bbs", {
        imgCache: true,
        config: {
            // captionType:1,
            // height: 50,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            crumbsID: bbs_crumbsID,
            dataFunc: function(param, options) {
                params.pageNo = param["pageNo"];
                params.pageSize = param["pageSize"];
                params.typeId = page["typeId"];
                subDataFunc({}, params, {
                    success: function(result) {
                        options.success(result);
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
            renderFunc: renderData,
            isClear: _isListRefresh
        },
        down: {
            contentdown: cmp.i18n("bbs.page.lable.refresh_down"), // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("bbs.page.lable.refresh_release"), // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bbs.page.lable.refresh_ing"), // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("bbs.page.lable.load_more"), // 可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bbs.page.lable.load_ing"), // 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("bbs.page.lable.load_nodata"), // 可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
    prevPage();
}

/**
 * 加载模板数据
 *
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
    var pendingTPL = document.getElementById("bbs_list_li").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (!document.getElementById("bbs_list")) {
        document.getElementById("bbs_listAll").innerHTML = '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="bbs_list"></ul>';
    }
    if (isRefresh) { // 是否刷新操作，刷新操作 直接覆盖数据
        _$("#bbs_list").innerHTML = html;
    } else {
        var table = _$("#bbs_list").innerHTML;
        _$("#bbs_list").innerHTML = table + html;
    }
    cmp.i18n.detect();
    setView();

    setTimeout(function(){
    document.getElementById("cmp-control").style.height = window.innerHeight  + "px";
  },300);
    cmp.listView("#all_bbs").refresh();
}
/**
 * 搜索内容标蓝
 */
function txtRemind(remindTxt, content) {
    if (!remindTxt) {
        return escapeStringToHTML(content);
    }
    var newContent = "";
    var log = escapeStringToHTML(remindTxt);
    var list = content.split(remindTxt);
    for (var i = 0; i < list.length; i++) {
        newContent = newContent + escapeStringToHTML(list[i]);
        if (i != list.length - 1) {
            newContent += "<span style='color: #4A8FE3;'>" + log + "</span>";
        }
    }
    return newContent;
}
/**
 * 列表添加点击事件
 */
function addbbsDetailsHref() {
    cmp("#bbs_list").on('tap', ".cmp-table-view-cell", function(e) {
        var param = {
            "bbsId": this.getAttribute("bbsId"),
            "from": "bbs"
        };

        var options = {
            animated: true,
            direction: "left"
        };
        if(isFromM3NavBar){
            options.openWebViewCatch = 1;
        }
        cmp.href.next(bbsPath + "/html/bbsView.html" + "?r=" + Math.random(), param, options);
        cmp.storage.save("bbsId", this.getAttribute("bbsId"));
        cmp.storage.save("page", cmp.toJSON(page), true);
    })
}

/**
 * 发起讨论
 */
function bbsCreate() {
    var options = {
        animated: true,
        direction: "left"
    };
    if(isFromM3NavBar){
        options.openWebViewCatch = 1;
    }
    /*cmp("header").on('tap', "#bbsCreate", function(e) {
        cmp.href.next(bbsPath + "/html/bbsCreate.html" + "?r=" + Math.random(), {}, options);
    });*/
    cmp("#bbs_list_search").on('tap', "#bbs_wechat_add", function(e) {
        cmp.href.next(bbsPath + "/html/bbsCreate.html" + "?r=" + Math.random(), {}, options);
        e.stopPropagation();
    });
}

/**
 * 返回方法
 */
function prevPage() {
    /*if(isFromM3NavBar){
        document.getElementById("goAheadBtn").style.display = "none";
    }else{
        cmp("header").on('tap', "#goAheadBtn", function(e) {
            cmp.storage.delete("BBS_Create_Success_Refresh_continue", true);
            backFrom();
        });
    }*/
    cmp.backbutton();
    cmp.backbutton.push(backFrom);

}
function backFrom(){
    if (_getQueryString("backURL") == "weixin") {
        cmp.href.closePage();
        return;
    }
    if (page.condition != undefined) {
        page = {};
        reloadPage();
    } else {
        if(isFromM3NavBar){
            cmp.closeM3App();
            return;
        }else{
            cmp.storage.delete("BBS_Create_Success_Refresh_continue", true);
            cmp.href.back();
        }
    }
}
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
    return null; //返回参数值
}
function setView() {
    for (var i = 0; i < document.getElementsByClassName("setView").length; i++) {
        if (document.getElementsByClassName("setView")[i].clientHeight > document.getElementsByClassName("setView")[i].parentNode.clientHeight) {
            document.getElementsByClassName("setView")[i].style.width = document.getElementsByClassName("setView")[i].clientWidth + 60 + "px";
        }
        document.getElementsByClassName("setView")[i].previousElementSibling.style.width = document.getElementsByClassName("setView")[i].parentNode.clientWidth -
            document.getElementsByClassName("setView")[i].clientWidth + "px";
    }
}

function _$(selector, queryAll, pEl) {
    var p = pEl ? pEl : document;
    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}