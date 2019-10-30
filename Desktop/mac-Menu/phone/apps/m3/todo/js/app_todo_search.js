/**
 * description 代办列表
 * author 易成
 * createDate 2017-01-10
 */

(function() {
    var m3, m3Error,m3i18n,m3Ajax,nativeApi,search,imgObj,imgCanLoaded = true,imgIdArr=[];
    var MailEvent = false;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        m3 = require('m3');
        require("commons");
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        nativeApi = require("native");
        initPage();
    });
    
    //页面初始化
    function initPage() {
        search = initGolbal();
        imgObj = {};
        cmp.ready(function() {
            initI18n();
            initStyle();
            initEvent();
            initSearchFromLastPage();
            //设置搜索框为允许输入
            document.getElementById("btn_a").readOnly = false;
        });
    }
    function getGoPersonUrl(uid) {
        /*获取跳转人员信息地址*/
        var isSelf = uid == m3.userInfo.getCurrentMember().id;
        if (!arguments.length || !uid) return m3.href.map.my_personInfo;
        // var isSelf = false;
        return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
    }
    //初始化全局变量
    function initGolbal() {
        var search = {};
        search.accoundId = cmp.storage.get("companyId", true);
        search.data = {};
        search.members = [];
        search.input = $("header input");
        search.send = true;
        search.model = m3.curServerInfo.model;
        search.address = m3.curServerInfo.ip;
        search.port = m3.curServerInfo.port;
        search.parent = cmp.href.getParam();
        search.cancel = $("header span.cancel");
        search.getData = function() {
            initData();
        };
        search.loadData = function() {
            renderData();
        };
        search.loadTodo = function() {
            loadTodo();
        };
        search.loadThird = function() {
            loadThird();
        };
        return search;
    }

    //国际化初始化
    function initI18n() {
        $(".cmp-placeholder").children().last().html(cmp.i18n("todo.m3.h5.searchPrompt"));
    }

    //事件初始化
    function initEvent() {
        //搜索轮播
        cmp('#slider').slider();

        if (cmp.os.android) {
            //物理返回
            document.addEventListener("backbutton", function() {
                cmp.href.back();
            });
        }

        //取消搜索
        search.cancel.on("tap", function() {
            cmp.storage.delete("searchData", true);
            cmp.href.back();
        });

        //监听回车
        $(document).keydown(function(e) {
            // 回车键事件
            e.stopPropagation();
            if (search.send) {
                if (e.which == 13) {
                    search.data.condition = search.input.val();
                    search.send = false;
                    cmp.storage.save("searchData", search.input.val(), true);
                    search.getData();
                    search.input.blur();
                    $("div.cansearch").addClass("display_none");
                    return false;
                }
            }
        });

        //点击搜索出来的人员
        $(".search-people.link").on("tap", "li", function() {
            var id = $(this).attr("data-i");
            m3.checkLevelScope(id, function() {
                m3.state.go(getGoPersonUrl(id) + "&page=todo-search&id=" + id + "&from=m3&enableChat=true", "", m3.href.animated.none, true);
            });
        });

        // 代办穿透
        $(".search-people.todo").on("tap", "li", function() {
            if ($(this).attr("data-read") == "none") {

                var appId = $(this).attr("data-id");
                var gotoParams = $(this).attr("data-gotoParams");
                cmp.storage.save("toDoTitle", $(".toDo_title .float_l").html());

                m3.penetrated({
                    appId: appId,
                    type: "todo",
                    returnUrl: m3.href.map.todo_search_all,
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
        })

        //待办点击查看更多
        $("ul.todo").next(".more").on("tap", function() {
            cmp.storage.save("searchModel", "todo", true);
            m3.state.go(m3.href.map.todo_search_all, search.parent, m3.href.animated.left, false);
        });

        //联系人点击查看更多
        $("ul.link").next(".more").on("tap", function() {
            cmp.storage.save("searchModel", "link", true);
            m3.state.go(m3.href.map.todo_search_all, search.parent, m3.href.animated.left, false);
        });

        //第三方待办点击查看更多
        $("ul.third").next(".more").on("tap", function() {
            cmp.storage.save("searchModel", "todoThird", true);
            m3.state.go(m3.href.map.todo_search_all, search.parent, m3.href.animated.left, false);
        });

    }

    //样式初始化
    function initStyle() {
        nativeApi.getConfigInfo(function(res){
            var config = JSON.parse(res);
                console.log("返回通讯录权限：" + config.hasAddressBook);
            if(!config.hasAddressBook){
                $('#searchPeople').addClass('display_none');
            }
        },function(error){
            console.log(error);
        });
        if (cmp.os.ios) {
            $("div.search").height($(window).height() - $("header").height() + 10);
        } else {
            $("div.search").height($(window).height() - $("header").height());
        }
    }

    //通过上一个页面的数据进行搜索初始化
    function initSearchFromLastPage() {
        //根据上一页面输入信息搜索
        if (cmp.storage.get("searchData", true)) {
            search.data.condition = cmp.storage.get("searchData", true);
            search.input.val(search.data.condition);
            $("div.cansearch").addClass("display_none");
            $(".cmp-search").addClass("cmp-active");
            search.getData();
        } else if (cmp.href.getParam() == "todo-list" || cmp.href.getParam() == "message") {
            search.data.condition = cmp.href.getParam();
        }
    }

    //数据初始化
    function initData() {
        var getDataUrl = m3.curServerInfo.url + "/mobile_portal/api/contacts2/account/search/" + m3.userInfo.getCurrentMember().accountId + "/1/3";
        m3Ajax({
            url: getDataUrl,
            data: JSON.stringify({ "condition": search.data.condition }),
            // contentType: "application/json",
            success: function(res) {
                if ("200" == res.code) {
                    search.send = true;
                    if (res.data.data.length != 0) {
                        $(".search,p.link-people,ul.link").removeClass("display_none");
                        //$(".none").addClass("display_none");
                        cmp.dialog.loading(false);
                        search.getMore = res.data;
                        res.data.total > 3 ? $("ul.link").next(".more").removeClass("display_none") : $("ul.link").next(".more").addClass("display_none");
                        search.members = res.data.data;
                        search.loadData();
                    } else {
                        search.members = res.data;
                        search.loadData();
                        $("ul.link,p.link-people").addClass("display_none");
                        $("ul.link").next(".more").addClass("display_none");
                    }
                    getTodo();
                }
            },
            error: function(res) {
                search.send = true;
            }
        });
    }

    //x获取待办数据
    function getTodo() {
        var getTodoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/pending/search/subject/1/3";
        m3Ajax({
            url: getTodoUrl,
            data: JSON.stringify({ "condition": search.data.condition.replace(/\+/g, '%2B') }),
            success: function(res) {
                search.send = true;
                if ("200" == res.code) {
                    if (res.data.data.length != 0) {
                        $(".search,ul.todo,p.link-todo").removeClass("display_none");
                        search.todo = res.data.data;
                        for (var i = 0; i < search.todo.length; i++) {
                            search.todo[i].createTime = m3.showTime(search.todo[i].createTime);
                        }
                        res.data.total > 3 && res.data.data.length >= 3 && $("ul.todo").next(".more").removeClass("display_none");
                        search.loadTodo();
                    } else {
                        search.todo = res.data.data;
                        $("ul.todo,p.link-todo").addClass("display_none");
                        $("ul.todo").next(".more").addClass("display_none");
                        // }
                    }
                    getThirdTodo();
                }
            },
            error: function(res) {
                search.send = true;
            }
        });
    }

    //获取第三方待办数据
    function getThirdTodo() {
        var getTodoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/pending/searchThird/1/3";
        m3Ajax({
            url: getTodoUrl,
            data: JSON.stringify({ "condition": search.data.condition.replace(/\+/g, '%2B') }),
            success: function(res) {
                if ("200" == res.code) {
                    search.send = true;
                    if (res.data.data.length != 0) {
                        $(".search,ul.third,p.link-third").removeClass("display_none");
                        search.thirdTodo = res.data.data;
                        for (var i = 0; i < search.thirdTodo.length; i++) {
                            search.thirdTodo[i].createTime = m3.showTime(search.thirdTodo[i].createTime);
                        }
                        res.data.total > 3 && res.data.data.length >= 3 && $("ul.third").next(".more").removeClass("display_none");
                        search.loadThird();
                    } else {
                        if (search.members.total == 0 && (search.todo.length == 0)) {
                            //$(".none").removeClass("display_none");
                            cmp.dialog.loading({
                                status: "nocontent",
                                text: m3i18n[cmp.language].noContent
                            });
                            $(".search").addClass("display_none")
                        } else {
                            $("ul.third,p.link-third").addClass("display_none");
                            $("ul.third").next(".more").addClass("display_none");
                        }
                    }
                }
            },
            error: function(res) {
                search.send = true;
            }
        });
    }
    
    //渲染数据
    function renderData() {
        var html = "";
        imgIdArr=[];
        for (var i = 0; i < search.members.length; i++) {
            var iconUrl = search.members[i].iconUrl;
            html += '<li id="' + search.members[i].id + '" data-i="' + search.members[i].id + '" class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left" style="background: url(' + iconUrl + ');background-position: center center;background-size: cover;">';
            
            html += '</div> <p class="message_list_title">' + (search.members[i].name.length > 10 ? (search.members[i].name.slice(0, 10) + "...") : search.members[i].name) + ' </p> <p class="cmp-ellipsis">' + search.members[i].postName + '</p> </li>';
            imgIdArr.push(search.members[i].id);
        }
        $(".search-people.link").html(html);
        if (imgIdArr.length > 0) {
            checkLoaded(loadHeader);
        }
    };
    //渲染代办数据
    function loadTodo() {
        var html = "";
        for (var i = 0; i < search.todo.length; i++) {
            html += "<li data-read = '" + search.todo[i].readonly + "' data-id='" + search.todo[i].appId + "' data-gotoParams = '" + search.todo[i].gotoParams + "' class='cmp-table-view-cell cmp-media list-top'><div class='cmp-pull-left'><img src='" + search.todo[i].senderFaceUrl + "' alt=''></div> <p class='message_list_title'>" + (search.todo[i].senderName.length > 10 ? (search.todo[i].senderName.slice(0, 10) + '...') : search.todo[i].senderName) + " <span class='cmp-pull-right'>" + search.todo[i].createTime + "</span> </p> <p class='cmp-ellipsis'>" + search.todo[i].content.escapeHTML() + "</p> </li>";
        }
        $(".search-people.todo").html(html);
    }

    //第三方数据
    function loadThird() {
        var html = "";
        for (var i = 0; i < search.thirdTodo.length; i++) {
            html += "<li data-read = '" + search.thirdTodo[i].readonly + "' data-id='" + search.thirdTodo[i].appId + "' data-gotoParams = '" + search.thirdTodo[i].gotoParams + "' class='cmp-table-view-cell cmp-media list-top'><div class='cmp-pull-left'><span class='iconfont see-icon-m3-third'></span></div> <p class='message_list_title'>" + (search.thirdTodo[i].senderName.length > 10 ? (search.thirdTodo[i].senderName.slice(0, 10) + '...') : search.thirdTodo[i].senderName) + " <span class='cmp-pull-right'>" + search.thirdTodo[i].createTime + "</span> </p> <p class='cmp-ellipsis'>" + search.thirdTodo[i].content.escapeHTML() + "</p> </li>";
        }
        $(".search-people.third").html(html);
    }
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
