/**
 * description 代办列表
 * author 易成
 * createDate 2017-01-06
 */
function pageErrorCatch(sMsg, sUrl, sLine) {
    console.error(sMsg);
    console.error(sUrl);
    console.error(sLine);
}

(function() {
    //全局变量（全局变量有点多）
    //数据空对象
    var totalData = {
            data: [],
            total: 0
        },
        btnState = false,
        imgObj,
        thirdId,
        objScroll,
        refreshTip,
        sortState = false,
        sortData = [],
        unActive = [],
        //历史记录的数组
        hisSortData = [],
        hisUnActive = [],
        currentTabObj,
        sortObj,
        startTime,
        preScrollLeft = 0, // 上次滚动条到左边的距离
        shortcutApps,//快捷菜单应用
        searchParams = {};//搜索的参数

    //初始化页面
    function initPage() {
        cmp.ready(function() {
            var title = cmp.i18n("todo.m3.h5.todoTitle");
            if(title){
                document.title = title;
            }else {
                setTimeout(function(){
                    document.title = title;
                },50);
            }
        	//记录行为统计
        	stasticAction();
            bindNavbarEvent();


            if (cmp.language == "en") {
                $('html').addClass('class-en');
            }
            //获取协同权限
            getPermissions();

            initI18n();
            initEvent();

            initData();
        });
    }
    
    //微协同行为统计
    var stasticAction = function(){
    	//记录登录微协同行为统计
        stastices.login();
        //记录进入全部应用
        stastices.openApp(stastices.customizeApp.toDoList);
    }
    //绑定下导航事件
    function bindNavbarEvent(){
        //微协同
        document.querySelector(".navTodo").addEventListener("tap",function () {
            cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?weixinFrom=home&VJoinOpen=VJoin");
        });
        document.querySelector(".navPortal").addEventListener("tap",function () {
            cmp.href.next("/seeyon/m3/apps/v5/portal/html/portalIndex.html?weixinFrom=home");
        });
        document.querySelector(".navApp").addEventListener("tap",function () {
            cmp.href.next("/seeyon/H5/wechat/html/allApps.html?weixinFrom=home");
        });
        document.querySelector(".navUser").addEventListener("tap",function () {
            cmp.href.next("/seeyon/H5/wechat/html/userCenter.html?weixinFrom=home");
        });
        //企业微信专版
        document.querySelector(".navPending").addEventListener("tap",function () {
            cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/todo-list.html?weixinFrom=app&VJoinOpen=VJoin");
        });
        document.querySelector(".navWorktask").addEventListener("tap",function () {
            cmp.href.next("/seeyon/m3/apps/v5/taskmanage/html/task_index.html?weixinFrom=todo&VJoinOpen=VJoin");
        });
        document.querySelector(".navSchedule").addEventListener("tap",function () {
            cmp.href.next("/seeyon/m3/apps/v5/calendar/html/timeArrange.html?weixinFrom=todo&VJoinOpen=VJoin");
        });
    }

    //获取协同权限
    function getPermissions() {
        var obj = $('.top-bar');
        m3.ajax({
            type:"GET",
            url:cmp.seeyonbasepath + "/rest/m3/common/getConfigInfo",
            success:function(result){
                var permissObj = result.data.config;//后台返回的接口数据变了，修改OA-146118
                if(!permissObj.hasDoneList){
                    obj.find('[data-target="listDone"]').remove();
                }
                if (!permissObj.hasSentList) {
                    obj.find('[data-target="listSent"]').remove();
                }
                if (!permissObj.hasWaitSendList) {
                    obj.find('[data-target="listWaitSend"]').remove();
                }
                if (!permissObj.hasDoneList && !permissObj.hasSentList && !permissObj.hasWaitSendList) {
                    $('.more-action').addClass("display_none");
                }
                if (!permissObj.hasAIPlugin) {
                    $('.ai_sort_btn').addClass("display_none");
                }
            },
            error:function(err){
                handleRequestError(err,1);
            }
        });
    }

    //数据初始化
    function initData(tip) {
        if (tip) {
            refreshTip = true;
            getListData(tip);
            return;
        }
        cmp.dialog.loading(true);
        //先做获取服务端数据，
        getSortData(function(resp) {
            cmp.dialog.loading(false);
            var data = resp.data;
            for(var i = 0;i < data.length;i++) {
                data[i].id = i;
            }
            var curAppId = cmp.storage.get('curAppId', true) || "todo";
            if (!tip) {
                //缓存历史记录
                hisSortData = hisSortData.concat(data);
                sortData = data;
                //数据绑定
                $('#option').html(showTab(sortData));
            }
            activeTab();
            scrollMid($("#option").find(".active"));
            if (!tip) {
                var pullrefreshTop = $(".toDo_title").height();
                var searchH = $(".cmp-segmented_title_content").height();
                // $("#pullrefresh").css({ "top": pullrefreshTop, "bottom": "50px" });
                $("#pullrefresh").css({ "top": searchH +pullrefreshTop });
                checkHasApp();
            }
        });
    }
    //国际化初始化
    function initI18n() {
        //        m3.initPage();
    }

    //事件初始化
    function initEvent() {
    	var backfunc = function(){
	        //记录关闭事件
	        stastices.close();
	        cmp.href.closePage();
	    }
        //回退
        cmp.backbutton();
        cmp.backbutton.push(backfunc);
        
        //点击左上角按钮 跳转到我的页面
        $("#backBtn").on("tap", function() {
            backfunc();
        });

        var timer2;
        //头部点击
        $('.more-action').on('tap', function() {
            var objThis = $(this);
            clearTimeout(timer2);
            timer2 = setTimeout(function() {
                //没有协同权限，return
                if(objThis.hasClass("close-status")){
                    topBarAnimation('open');
                }else {
                    topBarAnimation('close');
                }


            }, 250);
        });

        $('.top-opacity').on('tap', function() {
            topBarAnimation('close');
        });

        $('.top-bar').find('div').on('tap', function() {
            var tgt = $(this).attr('data-target');
            //判断是否有协同包信息
            var appInfo = m3.appMap["app_1"];
            appInfo.sendParms = {
                openFrom: tgt
            };
            appInfo.type = "shortcut";
            m3.penetratedByUrl(appInfo);
            topBarAnimation('close');
        });

        var tapTimer;
        //筛选列表 分类显示
        $("#option").on("tap", "span", function() {
            //显示加载处理
            for(var k in searchParams){
                delete searchParams[k];
            }
            $('.toDo_listes').html('');
            $('.StatusContainer').remove();
            $('.cmp-pull-top-pocket').css('opacity', '0');
            $('.cmp-pull-bottom-pocket').css('opacity', '1');
            $('.cmp-pull-loading').removeClass().addClass('cmp-pull-loading cmp-spinner active cmp-visibility');
            $('.cmp-pull-caption').html(m3.i18n[cmp.language].pullupTipRefresh);
            //添加激活样式
            $('.active-app').find('li').removeClass('tab-active');
            $('.active-app').find('li[data-appid="' + $(this).attr('data-thirdid') + '"]').addClass('tab-active');
            //函数节流，避免用户暴力点击
            clearTimeout(tapTimer);
            var appId = $(this).attr("data-appId"),
                objThis = $(this),
                isThird = false;
            tapTimer = setTimeout(function() {
                currentTabObj = objThis;
                if (appId === 'third') {
                    thirdId = objThis.attr('data-thirdid');
                    appId = thirdId;
                }
                if (objThis.attr('data-isportlet') === '0' && objThis.attr('data-isthird') === '1') {
                    isThird = true;
                    searchParams.isThird = true;
                    searchParams.appId = thirdId;
                    
                }
                //滚动条定位
                scrollMid(objThis);
                setlistView(appId, isThird);
                //设置智能排序的按钮状态
                var curAppId = cmp.storage.get('curAppId', true);//取当前列表的id
                var openAISort = cmp.storage.get('curAppId_ai_sort_' + curAppId, true);//保存点击状态
                var sortBtn = document.querySelector("#ai_sort_ok");
                var sortCancelBtn = document.querySelector("#ai_sort_cancel");

                sortCancelBtn.classList.add("cmp-hidden");
                sortBtn.classList.remove("cmp-hidden");
                if(openAISort && openAISort == "true"){
                    // cmp.listView("#pullrefresh").updateAdditionalParts(true);//将额外部件true即为显示
                    sortBtn.classList.add("cmp-hidden");
                    sortCancelBtn.classList.remove("cmp-hidden");
                }else{
                    // cmp.listView("#pullrefresh").updateAdditionalParts(false);
                    sortBtn.classList.remove("cmp-hidden");
                    sortCancelBtn.classList.add("cmp-hidden");
                }
            }, 400);
            $(".toDo_title .active").removeClass("active");
            objThis.addClass("active");
        });

        //待办穿透（除第三方待办）
        $(".toDo_listes").on("tap", "li", function() {
            if ($(this)[0].id === 'thirdList' || $(this).hasClass('thirdList') || $(this).hasClass('readonly')) return;
            $(this).find('.unread').removeClass('unread').addClass('read');
            $(this).removeClass('unread');
            var appId = $(this).attr("data-appId");
            var gotoParams = $(this).attr("data-gotoParams");
            var toDoTitle = {
                "kind": $(".toDo_title .float_l span.active").html(),
                "appId": $(".toDo_title .float_l span.active").attr("data-appId")
            };
            cmp.storage.save('toDoTitle', JSON.stringify(toDoTitle), true)
                //            $(".toDo_title .float_l span.active").removeClass("active");
            cmp.storage.save('isDealV5', 'true');
            var appInfo = m3.appMap[("app_" + appId)];
            appInfo.sendParms = cmp.parseJSON(gotoParams);
            appInfo.type = "todo";
            m3.penetratedByUrl(appInfo);
        });

        //获取第三方待办二级列表
        $(".toDo_listes").on("tap", "li#thirdList", function() {
            setlistView();
        });

        //第三方待办二级列表穿透
        $(".toDo_listes").on("tap", "li.thirdList", function() {
            if ($(this).hasClass('readonly')) return;
            $(this).find('.unread').removeClass('unread').addClass('read');
            $(this).removeClass('unread');
            var appInfo = JSON.parse($(this).attr("data-gotoParams"));
            appInfo.appId = $(this).attr("data-appid");
            if (appInfo.appType != "default") {
                cmp.storage.save('isDealV5', 'true');
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

        //只读待办
        $(".toDo_listes").on("tap", "li.readonly", function() {
            cmp.notification.toast(m3.i18n[cmp.language].notSupport, "center");
        });

        //绑定开启智能排序按钮点击事件
        var button = document.querySelector("#ai_sort_ok");
        var sortCancelBtn = document.querySelector("#ai_sort_cancel");
        button.addEventListener("tap",function(){ //给第一个额外部件添加一个事件，用于额外部件的替换
            // cmp.listView("#pullrefresh").updateAdditionalParts(true);//将额外部件true即为显示,修改OA-151355  保持和M3的交互一致
            button.classList.add("cmp-hidden");
            sortCancelBtn.classList.remove("cmp-hidden");
            var curAppId = cmp.storage.get('curAppId', true);//取当前列表的id
            cmp.storage.save('curAppId_ai_sort_' + curAppId, "true", true);//保存点击状态
            //刷新列表
            setlistView(curAppId, null);
        });
        
        //绑定关闭智能排序点击事件
        sortCancelBtn.addEventListener("tap",function(){
            // cmp.listView("#pullrefresh").updateAdditionalParts(false);//将额外部件true即为显示
            sortCancelBtn.classList.add("cmp-hidden");
            button.classList.remove("cmp-hidden");
            var curAppId = cmp.storage.get('curAppId', true);//取当前列表的id
            cmp.storage.delete('curAppId_ai_sort_' + curAppId, true);//移除智能排序开关打开状态
            //刷新列表
            setlistView(curAppId, null);
        });

        //显示快捷操作界面
        $(".cmp-icon-plus").on("tap", function() {
            if(typeof shortcutApps == "undefined"){
                getShortcutAppsAndRender();
                bindShortcutEvent();
            }
            showAdd();
        });
        //搜索事件
        $("#searchDom").on("tap",function(){
            cmp.href.next(cmp.seeyonbasepath+"/m3/apps/v5/portal/todo/html/todo-search.html",searchParams)
        })

    }

    //消失动画效果
    function hide(objThis) {
        objThis.addClass('icon-remove');
        setTimeout(function() {
            objThis.remove();
        }, 400);
    }
    //显示快捷菜单界面
    function showAdd() {
        //防止关闭排序与新建按钮重复同事点击
        if ($(".toDo_list").hasClass('fade-up')) return;
        topBarAnimation('close');
        var cmpLoading = $(".cmp-loading");
        var create = $(".create");
        var createFilter = $(".createFilter");
        create.removeClass("display_none");
        create.addClass("show");
        $("header,footer,.cmp-content").addClass("blur");
        createFilter.removeClass("display_none");
        if (cmpLoading.length != 0) { //有无网络或系统繁忙样式
            cmpLoading.addClass("blur");
        }
        setTimeout(function() {
            create.removeClass("show");
            //                createFilter.removeClass("show1");
        }, 200);
        cmp.backbutton.push(closePage);
    }
    //关闭快捷界面
    function closePage() {
        var cmpLoading = $(".cmp-loading");
        if(cmpLoading.length != 0){//有无网络或系统繁忙样式
            cmpLoading.removeClass("blur");
        }
        var create = $(".create");
        var createFilter = $(".createFilter");
        $("header,footer,.cmp-content").removeClass("blur");
        create.addClass("hidden");
        createFilter.addClass("display_none");
        if ($('.toDo_listes').hasClass('blur')) createFilter.removeClass('display_none');
        setTimeout(function() {
            create.addClass("display_none").removeClass("hidden");
        }, 200);
        cmp.backbutton.pop();
    }
    //获取快捷菜单并渲染图标
    function getShortcutAppsAndRender(){
        m3.ajax({
            type: "GET",
            url: cmp.seeyonbasepath + "/rest/m3/appManager/getCurrentUserAppList",
            success: function(res) {
                var data = res.data;
                var i = 0,len = data.length;
                for(;i<len;i++){
                    var oneTypeApp = data[i];
                    var appType = oneTypeApp.appType;
                    if("20001" == (appType.key + "")){
                        var thisApps = oneTypeApp.appList;
                        if(thisApps.length){
                            shortcutApps = filterShortcutApps(thisApps);
                        }
                        break;
                    }
                }
                if(typeof shortcutApps != "undefined" && shortcutApps.length){
                    for(var i=0;i<shortcutApps.length;i++){
                        if(shortcutApps[i].appId == "6"){ //会议的isShow参数为0的话应该是隐藏掉。
                            if(shortcutApps[i].isShow == "0"){
                                shortcutApps.splice(i,1);
                            }
                        }
                    }
                    var liTPL = $("#shortcut").html();
                    var html = cmp.tpl(liTPL, shortcutApps);
                    $(".cmp-slider").html("").append(html);
                }


            },
            error: function(err) {
                handleRequestError(err,1);
            }
        });
    }
    //绑定快捷按钮事件
    function bindShortcutEvent(){
        $(".create").on("tap", "div.msgsCommon", function() {
            if ($(this).hasClass('talk') || $(this).hasClass('scan')) return;
            $(".createFilter").css("opacity", "1");
            var appId = $(this).parent().attr("data-appId");
            var appInfo = m3.appMap["app_" + appId];
            var gotoParam = $(this).parent().attr('gotoParam');
            appInfo.sendParms = JSON.parse(gotoParam);
            appInfo.type = "shortcut";
            m3.penetratedByUrl(appInfo);

        });
        $(".close").on("tap", closePage);

        $("#slider").on("tap", closePage);
    }

    //过滤掉扫一扫、新建任务和致信
    function filterShortcutApps(shortcutApps){
        var wechatShortcutApps = [];
        for(var i =0;i<shortcutApps.length;i++){
            if(shortcutApps[i].bundleName == "newcoll"
                || shortcutApps[i].bundleName == "newpage"
                || shortcutApps[i].bundleName == "createMeeting") {
                wechatShortcutApps.push(shortcutApps[i]);
            }
        }
        return wechatShortcutApps;
    }

    //选中状态
    function activeTab() {
        var curAppId = cmp.storage.get('curAppId', true) || 'todo',
            objNode;
        //分类Id,默认全部
        if (curAppId === 'todo' || curAppId === 'all') {
            $('#option').children().eq(0).trigger('tap');
        } else {
            objNode = $('#option').find('#nav-' + curAppId);
            if (objNode.length > 0) {
                $('#option').find('#nav-' + curAppId).trigger('tap');
            } else {
                $('#option').children().eq(0).trigger('tap');
            }
        }

    }

    //topbar的动画函数
    function topBarAnimation(state) {
        var topBarNode = $('.top-bar'),
            opacNode = $('.top-opacity'),
            moreAction = $('.more-action'),
            timer;
        clearTimeout(timer);
        if (state === 'open') {
            // iconNode.addClass('rotate-180');
            topBarNode.removeClass('display_none').addClass('tb-slidedown');
            opacNode.removeClass('display_none').addClass('show');
            moreAction.addClass("open-status");
            moreAction.removeClass("close-status");
        } else {
            // iconNode.removeClass('rotate-180');
            topBarNode.removeClass('tb-slidedown').addClass('tb-slideup');
            opacNode.removeClass('show').addClass('hidden');
            timer = setTimeout(function() {
                topBarNode.removeClass('tb-slideup').addClass('display_none');
                opacNode.removeClass('hidden').addClass('display_none');
                moreAction.removeClass("open-status");
                moreAction.addClass("close-status");
            }, 400);
        }
    }

   
    

    //初始化listView
    function initListView(config, pulldownTip, pullupTip) {
        if (objScroll) {
            //objScroll.destroyListviewButParts();
        }
        objScroll = cmp.listView("#pullrefresh", {
            config: config,
            down: pulldownTip,
            up: pullupTip
        });
    }

    //设置listview
    function setlistView(appId, isThird) {
        var config = {
            pageSize: 20,
            onePageMaxNum: 140,
            params: [{}],
            dataFunc: function(param, option) {
                getTodoData(param, option, appId, isThird)
            },
            renderFunc: renderData,
            crumbsID: Math.random()
        };
        if (appId === 'third') {
            cmp.storage.save('curAppId', thirdId, true);
        } else {
            cmp.storage.save('curAppId', appId, true);
        }
        var pulldownTip = {
            contentdown: m3.i18n[cmp.language].pulldownTipDown, //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: m3.i18n[cmp.language].pulldownTipOver, //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: m3.i18n[cmp.language].pulldownTipRefresh, //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            contentprepage: m3.i18n[cmp.language].pulldownTipPrepage
        };
        var pullupTip = {
            contentdown: m3.i18n[cmp.language].pullupTipDown, //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: m3.i18n[cmp.language].pullupTipRefresh, //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: m3.i18n[cmp.language].pullupTipNomore, //可选，请求完毕若没有更多数据时显示的提醒内容；
            contentnextpage: m3.i18n[cmp.language].pullupTipNextpage
        };
        initListView(config, pulldownTip, pullupTip);
    }

    //渲染数据
    function renderData(res, isRefresh) {
        var imgObj;
        var liTPL = $("#pending_li_tpl").html(),
            table = $('.toDo_listes'),
            html = cmp.tpl(liTPL, res);
        if (isRefresh) {
            $(table).html(html);
        } else {
            $(table).append(html);
        }
    }

    //获取代办数据
    function getTodoData(param, option, currentAppId, isThird) {
        //最新
        startTime = new Date().getTime();
        var index,
            id = currentTabObj.attr('data-elid'),
            dataParam,
            type = 'POST',
            getOtherDataUrl = cmp.seeyonbasepath + "/rest/m3/pending/portlet/" + param["pageNo"] + "/20";
        index = getIndex(id, sortData);
        dataParam = sortData[index].portletParams;
        if (isThird) {
            getOtherDataUrl = cmp.seeyonbasepath + "/rest/m3/pending/thirdPending?appId=" + currentAppId + "&pageSize=20&pageNo=" + param["pageNo"];
            dataParam = null;
            type = 'GET';
        }
        //增加智能排序参数
        var openAISort = cmp.storage.get('curAppId_ai_sort_' + currentAppId, true);//保存点击状态
        if(openAISort && openAISort == "true"){
            var paramObj = $.parseJSON(dataParam);
            paramObj["aiSort"] = "true";
            dataParam = JSON.stringify(paramObj);
        }
        if(dataParam){
            var dataParamTemp = $.parseJSON(dataParam);
            searchParams = cmp.extend(dataParamTemp,searchParams);
        }
        m3.ajax({
            type: type,
            url: getOtherDataUrl,
            data: dataParam,
            success: function(res) {
                // m3.getUnreadCount();todo xp
                $("#pullrefresh").removeClass("display_none");
                if ("200" == res.code) {
                    //跟新缓存total数
                    for (var i = 0; i < sortData.length; i++) {
                        if (sortData[i].id == id) {
                            sortData[i].total = res.data.total;
                            break;
                        }
                    }
                    if (res.data.total === 0) {
                        currentTabObj.find('i').text('');
                    } else if (res.data.total > 99) {
                        currentTabObj.find('i').text('(99+)');
                    } else {
                        currentTabObj.find('i').text('(' + res.data.total + ')');
                    }
                    $('.cmp-prev-page').remove();
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].createTime = m3.showTime(res.data.data[i].createTime);
                    }
                    if(res.data.total == 0){
                        cmp.listView("#pullrefresh").updateAdditionalParts(false);
                    }
                    option.success(res.data);
                    if (res.data.total === 0) {
                        if ($('.blur').length > 0) {
                            $('.StatusContainer').addClass('blur');
                        }
                    }
                }

            },
            error: function(err) {
                handleRequestError(err,1);
            }
        });
    }
    


    //获取服务端页签数据
    function getSortData(callback) {
        m3.ajax({
            type: "GET",
            url: cmp.seeyonbasepath + "/rest/m3/pending/classificationAll",
            showLoading: false,
            success: function(ret) {
                callback(ret);
            },
            error: function(err) {
                handleRequestError(err,2);
            }
        });
    }

    //过滤器
    function filterLists(selector) {
        unActive = [].concat(hisUnActive);
        sortData = [].concat(hisSortData);
        //var currentKind = $("#nav-all").hasClass("active");
        if (!selector.find(".iconfont").hasClass("icon-active")) {
            btnState = false;
            selector.find(".iconfont").addClass("icon-active");
            $(".toDo_list").removeClass("display_none");
            $(".toDo_list").addClass('fade-down');
            setTimeout(function() {
                $(".toDo_list").removeClass('fade-down');
            }, 200);
            $("footer,.toDo_listes,.StatusContainer").addClass("blur");
            $(".createFilter").css("z-index", "2");
            $(".createFilter").removeClass("display_none");
            $("#option").addClass("display_none");
            $("#toggleColumns").removeClass("display_none");
            $('.sort-btn').removeClass('display_none');
            $('.cmp-pull').addClass('display_none');
            if (sortData.length <= 1) {
                $('.sort').addClass('display_none');
            }
        } else {
            btnState = true;
            var obj = $('#option').find('.active');
            if (obj.length === 0) {
                activeTab();
            } else if (!obj.hasClass('active')) {
                obj.trigger('tap');
            }
            if (!selector.find(".see-icon-m3-close").hasClass("display_none")) {
                selector.find(".see-icon-m3-close").addClass("display_none");
                $(".see-icon-m3-spread").removeClass("display_none");
            }
            $(".toDo_list").addClass("fade-up");
            setTimeout(function() {
                $(".toDo_list").addClass('display_none').removeClass("fade-up");
                $(".createFilter").addClass("display_none").css("z-index", "96");
                $("footer,.toDo_listes,.StatusContainer").removeClass("blur");
                $('.cmp-pull').removeClass('display_none');
                selector.find(".iconfont").removeClass("icon-active");
                $("#option").removeClass("display_none");
                $("#toggleColumns").addClass("display_none");
                $('.sort-btn').addClass('display_none');
                $('.active-app').html(showSort(hisSortData));
                $('.unactive-app').html(showSort(hisUnActive, 'display-none')).removeClass('display_none');
                $('.active-app').find('li[data-appid="' + $('#option').find('.active').attr('data-thirdid') + '"]').addClass('tab-active');
                unActiveSort();
            }, 200);
            //            selector.find(".iconfont").removeClass("icon-active");
            //            $("#option").removeClass("display_none");
            //            $("#toggleColumns").addClass("display_none");
            //            $('.sort-btn').addClass('display_none');
            //            $('.active-app').html(showSort(hisSortData));
            //            $('.unactive-app').html(showSort(hisUnActive, 'display-none')).removeClass('display_none');
            //            unActiveSort();
        }
        sortObj.options.disabled = true;
        checkHasApp();
    }

    //页签数据绑定
    function showTab(data) {
        var str = '',
            totalNum;
        if (Object.prototype.toString.call(data) === '[object Array]') {

            for (var i = 0; i < data.length; i++) {
                if (data[i].total > 100) {
                    totalNum = '(99+)';
                } else if (data[i].total === 0) {
                    totalNum = '';
                } else if (data[i].total) {
                    totalNum = '(' + (data[i].total || '') + ')'
                } else {
                    totalNum = '';
                }
                //第三方与通用应用
                str += '<span data-elid="' + data[i].id + '" data-isthird="' + data[i].isThird + '" id="nav-' + data[i].appId + '" data-appId="third" data-id="third" data-thirdid="' + data[i].appId + '" data-isPortlet="' + (data[i].isPortlet || 0) + '">' + (data[i].classificationName + '<i>' + totalNum + '</i>') + '</span>';
            }
        } else {
            console.log('数据错误')
        }
        return str;
    }

    //获取当前appid所在的数据源的序列号
    function getIndex(appId, data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == appId) return i;
        }
        return -1;
    }

    //展示排序的数据
    function showSort(data, type) {
        var str = '',
            className = '';
        if (type === 'display-none') str = '';
        if (Object.prototype.toString.call(data) === '[object Array]') {

            for (var i = 0; i < data.length; i++) {
                //                if(data[i].canDrug === 0) {
                //                    className = 'sort-unactive'
                //                } else {
                //                    className = '';
                //                }
                str += '<li class="font_size14 ' + className + '" data-elid="' + data[i].id + '" data-appid="' + data[i].appId + '">\
                                    <span class="list_name">' + data[i].classificationName + '</span>\
                                    <span class="iconfont see-icon-m3-hide-fill display_none"></span>\
                                </li>';
            }
        } else {
            console.log('数据错误')
        }
        return str;
    }

    //判断是否有全文检索插件
    function havePlugin(pageFrom) {
        if (m3.userInfo.getCurrentMember().hasIndexPlugin) {
            m3.state.go(m3.href.map.all_search, pageFrom, m3.href.animated.none, true);
        } else {
            m3.state.go(m3.href.map.todo_search, pageFrom, m3.href.animated.none, true);
        }
    }

    //筛选滚动条居中定位
    function scrollMid(objThis) {
        var actObj = objThis,
            scrObj = $("#option"),
            //激活的dom相对于窗口的左边距离
            actOffX = actObj.offset().left,
            //当前激活的dom宽度
            actW = actObj.width(),
            //窗口的宽度
            winW = document.documentElement.clientWidth,
            //父级滚动条的滚动left值
            scrollX = scrObj.scrollLeft(),
            //位移差
            X;
        if (winW / 2 > actOffX) {
            X = ((winW - actW) / 2 - actOffX);
            scrObj.scrollLeft(scrollX - X);
        } else {
            X = (actOffX - (winW - actW) / 2);
            scrObj.scrollLeft(scrollX + X);
        }
    }

    function checkHasApp() {
        if (hisUnActive.length === 0) {
            $('.more').addClass('display_none');
        } else {
            $('.more').removeClass('display_none');
        }
    }
    function handleRequestError(err,type){
        if (err.code == -110) {
            if (refreshTip === true && type ==1) {
                cmp.notification.toast(m3.i18n[cmp.language].noNetwork, "center");
            } else {
                cmp.dialog.loading({
                    status: "nonetwork",
                    callback: function() {
                        window.location.reload();
                    }
                });
            }
        } else if (err.code !== 401 && err.code !== 1001 && err.code !== 1002 && err.code !== 1003 && err.code !== 1004) {
            cmp.dialog.loading({
                status: "systembusy",
                text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3.i18n[cmp.language].systemBusy + "</span>",
                callback: function() {
                    window.location.reload();
                }
            });
        }
        $("#pullrefresh").addClass("display_none");
    }

    initPage();
})()
