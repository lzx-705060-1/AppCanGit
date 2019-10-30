/**
 * description 代办列表
 * author 易成
 * createDate 2017-01-10
 */

(function() {

    var m3, m3Error,m3i18n,m3Ajax,search,imgCanLoaded = true,imgIdArr=[];;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        m3 = require('m3');
        require("commons");
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        initPage();
    });

    //页面初始化
    function initPage() {
        search = golbalInit();
        cmp.ready(function() {
            initEvent();
            initStyle();
            initDataByParam();
        });
    }
    function getGoPersonUrl(uid) {
        /*获取跳转人员信息地址*/
        var isSelf = uid == m3.userInfo.getCurrentMember().id;
        if (!arguments.length || !uid) return m3.href.map.my_personInfo;
        // var isSelf = false;
        return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
    }
    //事件初始化
    function initEvent() {
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });

        search.cancel.on("tap", function() {
            cmp.storage.delete("searchData", true);
            cmp.href.back();
        });

        //点击返回
        $("header div.cmp-pull-left").on("tap", function() {
            cmp.storage.delete("searchData", true);
            cmp.href.back();
        });


        $(document).keydown(function(e) {
            // 回车键事件
            e.stopPropagation();
            if (e.which == 13) {
                cmp.storage.save("searchData", search.input.val(), true);
                initDataByParam();
                // m3.state.go(m3.href.map.todo_search, search.parent, m3.href.animated.left, true);
                // return false;
            }
        });


        //点击搜索出来的人员
        $(".search-people.link").on("tap", "li", function() {
            var id = $(this).attr("data-i");
            m3.checkLevelScope(id, function() {
                m3.state.go(getGoPersonUrl(id) + "&page=todo-search-all&id=" + id + "&from=m3&enableChat=true", "", m3.href.animated.none, true);
            });
        });

        // 穿透
        $(".search-people.todo").on("tap", "li", function() {
            if ($(this).attr("data-read") == "none") {
                var appId = $(this).attr("data-id");
                var gotoParams = $(this).attr("data-gotoParams");
                cmp.storage.save("toDoTitle", $(".toDo_title .float_l").html());

                m3.penetrated({
                    appId: appId,
                    type: "todo",
                    returnUrl: "http://todo.m3.cmp/v/layout/todo-search.html?cmp_orientation=auto",
                    sendParms: JSON.parse(gotoParams),
                    returnParms: { appId: appId },
                    openNewPage: 1
                });
            } else {
                cmp.notification.toast(m3i18n[cmp.language].notSupport);
            }

        });

        //第三方代办穿透
        $(".search-people.third").on("tap", "li", function() {
            var appInfo = JSON.parse($(this).attr("data-gotoParams"));
            if (appInfo.appType != "default") {
                m3.loadApp({
                    "appId": appInfo.appId,
                    "bundle_identifier": appInfo.bundle_identifier,
                    "bundle_name": appInfo.bundle_name,
                    "team": appInfo.team,
                    "version": appInfo.version,
                    "appType": appInfo.appType,
                    "downloadUrl": appInfo.downloadUrl,
                    "entry": appInfo.entry,
                    "parameters": ""
                }, "todo");
            }
        });
    }

    //样式初始化
    function initStyle() {
        var ipPlaceholderStr = cmp.i18n("todo.m3.h5.searchPrompt"),
            input = $("header input")[0];
        input.setAttribute('placeholder', ipPlaceholderStr);

        var formWidth = $("body").width() - $(".cancel").width() - $("header .cmp-pull-left").width() - 7;
        $("form").width(formWidth);
    }

    //国际化初始化
    function golbalInit() {
        var search = {};
        search.accoundId = cmp.storage.get("companyId", true);
        search.data = {};
        search.members = [];
        search.input = $("header input");
        search.model = m3.curServerInfo.model;
        search.address = m3.curServerInfo.ip;
        search.port = m3.curServerInfo.port;
        search.parent = cmp.href.getParam();
        search.num = 0;
        search.isAjax = true;
        search.isAppend = true;
        search.cancel = $("header span.cancel");
        search.loadData = function(data, isRefresh) {
            loadData(data, isRefresh);
        }
        search.loadTodo = function(data, isRefresh) {
            loadTodo(data, isRefresh);
        }
        search.loadThird = function(data, isRefresh) {
            loadThird(data, isRefresh);
        }
        return search;
    }

    function initDataByParam() {
        //根据上一页面输入信息搜索
        search.data.condition = cmp.storage.get("searchData", true);
        search.input.prop("placeholder", search.data.condition);
        $(".cmp-search").addClass("cmp-active");
        if (cmp.storage.get("searchModel", true) == "link") {
            loadDOM({
                pageSize: 20,
                dataFunc: function(params, option) {
                    getData(params, option);
                },
                renderFunc: search.loadData,
                onePageMaxNum: 100,
                params: [{}],
                isClear: true,
                crumbsID: "E"
            });
        } else if (cmp.storage.get("searchModel", true) == "todo") {
            loadDOM({
                pageSize: 20,
                dataFunc: function(params, option) {
                    getTodo(params, option);
                },
                renderFunc: search.loadTodo,
                onePageMaxNum: 100,
                params: [{}],
                isClear: true,
                crumbsID: "B"
            });
        } else {
            loadDOM({
                pageSize: 20,
                dataFunc: function(params, option) {
                    getThirdTodo(params, option);
                },
                renderFunc: search.loadThird,
                onePageMaxNum: 100,
                params: [{}],
                isClear: true,
                crumbsID: "C"
            });
        }
    }

    //  获取第三方待办数据
    function getThirdTodo(param, options) {
        search.num = param["pageNo"];
        var getTodoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/pending/searchThird/" + search.num + "/20";
        m3Ajax({
            url: getTodoUrl,
            data: JSON.stringify({ "condition": search.data.condition.replace(/\+/g, '%2B') }),
            success: function(res) {
                if ("200" == res.code) {
                    if (res.data.data.length != 0) {
                        search.thirdTodo = res.data;
                        for (var i = 0; i < search.thirdTodo.length; i++) {
                            search.thirdTodo.data[i].createTime = m3.showTime(search.thirdTodo.data[i].createTime);
                        }
                        options.success(search.thirdTodo);
                    }else{
                        cmp.dialog.loading({
                            status:"nocontent"
                        });
                    }
                }
            },
            error: function(res) {
                search.send = true;
            }
        });
    }

    //  x获取待办数据
    function getTodo(param, options) {
        search.num = param["pageNo"];
        var getTodoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/pending/search/subject/" + search.num + "/20";
        m3Ajax({
            url: getTodoUrl,
            data: JSON.stringify({ "condition": search.data.condition.replace(/\+/g, '%2B') }),
            success: function(res) {
                search.send = true;
                if ("200" == res.code) {
                    if (res.data.data.length != 0) {
                        search.todo = res.data;
                        for (var i = 0; i < search.todo.data.length; i++) {
                            search.todo.data[i].createTime = m3.showTime(search.todo.data[i].createTime);
                        }
                        options.success(search.todo);
                    }else{
                        cmp.dialog.loading({
                            status:"nocontent"
                        });
                    }

                }
            },
            error: function(res) {}
        });
    }

    function loadDOM(config) {
        var pullupTip = {
            contentdown: m3i18n[cmp.language].pullupTipDown, //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: m3i18n[cmp.language].pullupTipRefresh, //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: m3i18n[cmp.language].pullupTipNomore, //可选，请求完毕若没有更多数据时显示的提醒内容；
            contentnextpage: m3i18n[cmp.language].pullupTipNextpage
        };
        var pulldownTip = {
            contentdown: "", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            contentprepage: "上一页"
        };
        cmp.listView("#pullrefresh", {
            config: config,
            up: pullupTip,
            down: pulldownTip
        });
    }

    //渲染数据
    function loadData(data, isRefresh) {
        var html = "";
        imgIdArr = [];
        for (var i = 0; i < data.length; i++) {
            html += '<li id="'+data[i].id+'" data-i="' + data[i].id + '" class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left" style="background: url(' + data[i].iconUrl + ');background-position: center center;background-size: cover;"></div> <p class="message_list_title">' + (data[i].name.length > 10 ? (data[i].name.slice(0, 10) + "...") : data[i].name) + ' </p> <p class="cmp-ellipsis">' + data[i].postName + '</p> </li>';
            imgIdArr.push(data[i].id);
        }!isRefresh ? $(".search-people.link").append(html) : $(".search-people.link").html(html);
        if (imgIdArr.length > 0) {
            checkLoaded(loadHeader);
        }
    };

    //渲染代办数据
    function loadTodo(data, isRefresh) {
        var html = "";
        imgIdArr = [];
        for (var i = 0; i < data.length; i++) {
            html += "<li id='"+data[i].appId+"' data-read = '" + data[i].readonly + "' data-id='" + data[i].appId + "' data-gotoParams = '" + data[i].gotoParams + "' class='cmp-table-view-cell cmp-media list-top'><div class='cmp-pull-left' style='background: url(" + data[i].senderFaceUrl + ");background-position: center center;background-size: cover;'></div> <p class='message_list_title'>" + (data[i].senderName.length > 10 ? (data[i].senderName.slice(0, 10) + '...') : data[i].senderName) + " <span class='cmp-pull-right'>" + data[i].createTime + "</span> </p> <p class='cmp-ellipsis'>" + data[i].content.escapeHTML() + "</p> </li>";
            // imgIdArr.push(data[i].appId);
        }!isRefresh ? $(".search-people.todo").append(html) : $(".search-people.todo").html(html);
        // if (imgIdArr.length > 0) {
        //     checkLoaded(loadHeader);
        // }
    }

    //渲染第三方代办数据
    function loadThird(data, isRefresh) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += "<li data-read = '" + data[i].readonly + "' data-id='" + data[i].appId + "' data-gotoParams = '" + data[i].gotoParams + "' class='cmp-table-view-cell cmp-media list-top'><div class='cmp-pull-left'><span class='iconfont see-icon-m3-third'></span></div> <p class='message_list_title'>" + (data[i].senderName.length > 10 ? (data[i].senderName.slice(0, 10) + '...') : data[i].senderName) + " <span class='cmp-pull-right'>" + data[i].createTime + "</span> </p> <p class='cmp-ellipsis'>" + data[i].content.escapeHTML() + "</p> </li>";
        }!isRefresh ? $(".search-people.third").append(html) : $(".search-people.third").html(html);
    }

    //加载数据
    function getData(param, options) {
        search.num = param["pageNo"];
        var getDataUrl = m3.curServerInfo.url + "/mobile_portal/api/contacts2/account/search/" + m3.userInfo.getCurrentMember().accountId + "/" + search.num + "/20";
        m3Ajax({
            url: getDataUrl,
            data: JSON.stringify({ "condition": search.data.condition }),
            success: function(res) {
                if ("200" == res.code) {
                    if (res.data.total > search.num * 20) {
                        /*setTimeout(function() {
                         $(".cmp-pull-bottom-pocket .cmp-pull-caption").text(m3i18n[cmp.language].pullupTipDown);
                         }, 1000)*/
                    }
                    search.getMore = res.data;
                    options.success(search.getMore);
                }
            },
            error: function(res) {}
        });
    };
    var index = 0;
    function loadHeader() {
        imgCanLoaded = false;
        var imgObj = new Image(),
            url = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + imgIdArr[index] + '?maxWidth=200';
        imgObj.src = url;
        imgObj.onerror = function() {
            $('#' + imgIdArr[index]).find('.cmp-pull-left').css('backgroundImage','url(http://commons.m3.cmp/v/imgs/header.png)');
            if (index == imgIdArr.length - 1) {
                imgCanLoaded = true;
                index = 0;
            } else {
                index++;
                loadHeader();
            }
        }
        imgObj.onload = function() {
            $('#' + imgIdArr[index]).find('.cmp-pull-left').css('backgroundImage','url(' + url + ')');
            if (index == imgIdArr.length - 1) {
                imgCanLoaded = true;
                index = 0;
            } else {
                index++;
                loadHeader();
            }
        }
    }
    
    function checkLoaded(callback) {
        var time = setInterval(function() {
            if (imgCanLoaded) {
                callback();
                clearInterval(time);
            }
        }, 50)
    }
    //初始化
    //initPage();
})()
