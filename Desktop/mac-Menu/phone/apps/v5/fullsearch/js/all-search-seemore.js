/**
 * Created by 伟 on 2017/2/16.
 */
(function() {

    var m3, m3Error,m3i18n,m3Ajax,search,webchat,appMap,hrefParam;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        m3 = require('m3');
        require("commons");
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        webchat = cmp.platform.wechat;
        initPage();
    });
    
    //页面初始化
    function initPage() {
        
        cmp.ready(function() {
            hrefParam = cmp.href.getParam();
            search = initGolbal();
            initEvent();
            initPath();
            // initStyle();
            initDataByParam();
        });
    }

    function initPath(){
        var seeyon = '/'; // /seeyon/
        appMap = {
            '1': seeyon +'m3/apps/v5/collaboration/html/details/summary.html',
            '2': seeyon +"m3/apps/v5/form/html/content.html",

            '3': seeyon +'m3/apps/v5/doc/html/docView.html',  //文档
            '4': seeyon +'m3/apps/v5/edoc/html/edocSummary.html', //公文
            '6': seeyon +'m3/apps/v5/meeting/html/meetingDetail.html', //会议
            '11': seeyon +'m3/apps/v5/calendar/html/newCalEvent.html',
            '30': seeyon +'m3/apps/v5/taskmanage/html/taskEditor.html',//任务
            '8': seeyon +'m3/apps/v5/news/html/newsView.html', //新闻
            '10': seeyon +'m3/apps/v5/inquiry/html/inquiryView.html',
            '7': seeyon +'m3/apps/v5/bulletin/html/bulView.html',
            '47':seeyon +'m3/apps/v5/collaboration/html/newCollaboration.html',
            '9': seeyon +'m3/apps/v5/bbs/html/bbsView.html'
        };
    };

    //事件初始化
    function initEvent() {
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            // cmp.storage.delete("searchType", true);
            // if(cmp.storage.get("searchModelActive", true)){
            //     cmp.storage.delete("searchModel", true);
            //     cmp.storage.delete("searchModelActive", true);
            // }
            // cmp.storage.delete("filted", true);
            cmp.href.back();
        });


        search.cancel.on("tap", function() {
            // cmp.storage.delete("searchType", true);
            // if(cmp.storage.get("searchModelActive", true)){
            //     cmp.storage.delete("searchModel", true);
            //     cmp.storage.delete("searchModelActive", true);
            // }
            // cmp.storage.delete("filted", true);
            cmp.href.back();
        });

        //点击返回
        $("header div.cmp-pull-left").on("tap", function() {
            // cmp.storage.delete("searchType", true);
            // if(cmp.storage.get("searchModelActive", true)){
            //     cmp.storage.delete("searchModel", true);
            //     cmp.storage.delete("searchModelActive", true);
            // }
            // cmp.storage.delete("filted", true);
            setTimeout(function() {
                cmp.href.back();
            }, 300);
        });


        // $(document).keydown(function(e) {
        //     // 回车键事件
        //     e.stopPropagation();
        //     if (e.which == 13) {
        //         cmp.storage.delete("filted", true);
        //         cmp.storage.save("searchData", search.input.val(), true);
        //         cmp.href.back();
        //         return false;
        //     }
        // });

        //点击搜索出来的人员
        // $(".search-people.link").on("tap", "li", function() {
        //     var id = $(this).attr("data-i");
        //     m3.checkLevelScope(id, function() {
        //         m3.state.go(m3.href.map.my_personInfo + "?page=todo-search-all&id=" + id + "&from=m3&enableChat=true", "", m3.href.animated.none, true);
        //     });
        // });

        //穿透
        $("#content").on("tap", "li", function() {
            var appId = $(this).attr('data-type') || search.model;
            var type = "todo";
            if (appId == 7 || (appId == 8) || (appId == 30)) {
                type = "message";
            }
            if (appId == 62) { //通讯录
                var id = $(this).attr("data-i");
                m3.checkLevelScope(id, function() {
                    m3.state.go(m3.href.map.my_personInfo + "?page=all-search&id=" + id + "&from=m3&enableChat=true", "", m3.href.animated.none, true);
                });
            } else if (appId == 39) { //第三方代办
                var appInfo = JSON.parse($(this).attr("data-gotoParams"));
                appInfo.appId = $(this).attr("data-thirdId");
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
            } else { //其他
                var gotoParams = $(this).attr("data-gotoParams");
                var sendParms = JSON.parse(gotoParams);
                appId == 1 && (sendParms.id = sendParms.summaryId);
                if (appId == 2) { //有流程表单
                    if(webchat){
                        appId = 1;
                        sendParms.openFrom = "listPending";
                    }else{
                        appId = "47";//无流程表单 unflowform
                        sendParms.openForm = "search";
                        sendParms.openFrom = "search";
                        sendParms.moduleId = sendParms.summaryId;//模块ID
                    }
                }else if(appId == 47){
                    if(webchat){
                        sendParms.moduleId = sendParms.summaryId;//模块ID
                        sendParms.moduleType = ""; //模块类型
                        sendParms.rightId = "";//权限ID
                        sendParms.name = "";//表单名称
                        sendParms.sendState = 0;//显示状态
                    }
                }else if(appId == 3 || appId == 6 || appId == 7 || appId == 8 || appId == 9 || appId == 10){
                    if(sendParms.summaryId){
                        sendParms.id = sendParms.summaryId;
                    }
                }
                if(webchat){
                    if(appId == 7){  //公告
                        sendParms.comeFrom = 0;
                        sendParms.affairId = sendParms.summaryId;
                        sendParms.bulId = sendParms.summaryId;
                    }else if(appId == 8){   //新闻
                        sendParms.comeFrom = "0";
                        sendParms.newsId = sendParms.summaryId;
                    }else if(appId == 9){   //讨论
                        sendParms.bbsid = sendParms.summaryId;
                        sendParms.bbsId = sendParms.summaryId;
                    }else if(appId == 3){
                        sendParms.drId = sendParms.summaryId;
                        sendParms.isForm = false;
                        sendParms.isFormCol = false;
                        sendParms.source_fr_type = "101";
                    }else if(appId == 4){ //公文
                        sendParms.openFrom = "listPending";
                        sendParms.affairId =sendParms.summaryId;
                    }else if(appId == 6){ //会议
                        sendParms.appId = appId;
                        sendParms.openFrom = "glwd";
                        sendParms.id = sendParms.summaryId;
                    }else if(appId == 10){ //调查
                        sendParms.comeFrom = 0;
                        sendParms.affairState = 0;
                        sendParms.inquiryId = sendParms.summaryId;
                        sendParms.inquiryid = sendParms.summaryId;
                    }else if(appId == 11 ){
                        sendParms.id = sendParms.summaryId+"";
                    }else if(appId == 30){
                        sendParms.taskId = sendParms.summaryId;
                    };
                }
                if(webchat){
                    cmp.href.next(cmp.seeyonbasepath + appMap[appId],sendParms);
                }else{
                    m3.penetrated({
                        appId: appId,
                        type: type,
                        returnUrl: m3.href.map.all_search,
                        sendParms: sendParms,
                        returnParms: { appId: appId },
                        openNewPage: 1
                    });
                }
            }
        });

        $(".cmp-icon-clear").on("tap", function() {
            // cmp.storage.delete("searchData", true);
            // cmp.storage.delete("searchModel", true);
            // cmp.storage.delete("filted", true);
            cmp.href.back();
        });
    }

    //国际化初始化
    function initGolbal() {
        var search = {};
        search.data = {};
        search.input = $("header").find("input");
        search.num = 1;
        search.cancel = $("header span.cancel");
        search.model = hrefParam.model;
        search.globalization = {
            "1": [m3i18n[cmp.language].coordination, "see-icon-m3-coordination-fill"],
            "2": [m3i18n[cmp.language].form, "see-icon-m3-form-fill"],
            "3": [m3i18n[cmp.language].documentation, "see-icon-m3-file"],
            "4": [m3i18n[cmp.language].document, "see-icon-m3-document"],
            "5": [m3i18n[cmp.language].plan, "see-icon-m3-plan"],
            "6": [m3i18n[cmp.language].meeting, "see-icon-m3-meeting-fill"],
            "7": [m3i18n[cmp.language].bulletin, "see-icon-m3-notice-fill"],
            "8": [m3i18n[cmp.language].news, "see-icon-m3-new-fill"],
            "9": [m3i18n[cmp.language].discuss, "see-icon-m3-talk"],
            "10": [m3i18n[cmp.language].inquiry, "see-icon-m3-research"],
            "11": [m3i18n[cmp.language].schedule, "see-icon-m3-schedule"],
            "30": [m3i18n[cmp.language].task, "see-icon-m3-mission-fill"],
            "39": [m3i18n[cmp.language].thirdTodo, "see-icon-m3-third"],
            "62": [m3i18n[cmp.language].contact, "see-icon-m3-searchperson"]
        };
        return search;
    }

    function initDataByParam() {
        //根据上一页面输入信息搜索
        // search.data.condition = cmp.storage.get("searchType", true);
        $(".cmp-search").addClass("cmp-active");
        // search.input.val(search.data.condition);
        // search.data.condition = hrefParam.condition;
        // search.model = hrefParam.model;
        $(".cmp-icon-clear").removeClass("cmp-hidden");
        // if(webchat){
        //     search.model = cmp.storage.get("searchModel", true);
        // }
        $("#model").html(search.globalization[hrefParam.model][0]);
        loadDOM({
            pageSize: 20,
            dataFunc: function(params, option) {
                getData(params, option);
            },
            renderFunc: loadData,
            onePageMaxNum: 100,
            params: [{}],
            isClear: false,
            crumbsID: "S" + Math.random()
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
            contentdown: m3i18n[cmp.language].pulldownTipDown, //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: m3i18n[cmp.language].pulldownTipOver, //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: m3i18n[cmp.language].pulldownTipRefresh, //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            contentprepage: m3i18n[cmp.language].pulldownTipPrepage
        };
        cmp.listView("#pullrefresh", {
            config: config,
            //imgCache: true,
            //imgCacheType: 1,
            up: pullupTip,
            down: pulldownTip
        });
    }

    //渲染数据
    function loadData(data, isRefresh) {
        var html = "";
        if (search.model == 39) {
            for (var i = 0; i < data.length; i++) {
                data[i].createDate && (data[i].createDate = m3.showTime(data[i].createDate));
                var gotoParams = webchat? '{"openForm":"glwd","summaryId":"'+ data[i].linkId +'"}':data[i].gotoParams;
                html += "<li data-thirdId='" + data[i].thirdAppId + "' data-id='" + data[i].id + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>";
                if (data[i].thirdIcon && (data[i].thirdIcon == "" || data[i].thirdIcon == null)) {
                    html += "<div class='cmp-pull-left search-" + search.model + "'><span class='iconfont " + search.globalization[search.model][1] + "'></span></div> ";
                } else if (data[i].thirdIcon) {
                    html += '<div class="cmp-pull-left" style="background-image: url(\'' + data[i].thirdIcon + '\');background-size: cover;background-position: 50% 50%"></div> ';
                } else {
                    html += "<div class='cmp-pull-left search-" + search.model + "'><span class='iconfont " + search.globalization[search.model][1] + "'></span></div> ";
                }
                html += "<p class='cmp-ellipsis'>" + data[i].title.escapeHTML() + "</p><p class='message_list_title'>" + (data[i].startMember.length > 10 ? (data[i].startMember.slice(0, 10) + '...') : data[i].startMember) + " <span class='cmp-pull-right'>" + data[i].createDate + "</span> </p>  </li>";
            }
        } else if (search.model == 62) {
            for (var k = 0; k < data.length; k++) {
                html += '<li data-i="' + data[k].i + '" class="cmp-table-view-cell cmp-media list-top">' +
                    '<div class="cmp-pull-left"><img src="' + m3.curServerInfo.url + "/mobile_portal" + data[k].img + '" alt=""></div>' +
                    '<p class="message_list_title">' + (data[k].n.length > 10 ? (data[k].n.slice(0, 10) + "...") : data[k].n) + ' </p>' +
                    '<p class="cmp-ellipsis">' + data[k].pn + '</p> </li>'
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                data[i].createDate && (data[i].createDate = m3.showTime(data[i].createDate));
                var gotoParams = webchat? '{"openForm":"glwd","summaryId":"'+ data[i].linkId +'"}':data[i].gotoParams;
                html += "<li data-type='" + data[i].appType + "' data-id='" + data[i].id + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>" +
                    "<div class='cmp-pull-left search-" + search.model + "'><span class='iconfont " + search.globalization[search.model][1] + "'></span></div><p class='cmp-ellipsis'>" + data[i].title.escapeHTML() + "</p> <p class='message_list_title'>" + (data[i].startMember.length > 10 ? (data[i].startMember.slice(0, 10) + '...') : data[i].startMember) + " <span class='cmp-pull-right'>" + data[i].createDate + "</span> </p>  </li>";
            }
        }
        !isRefresh ? $(".search-people").append(html) : $(".search-people").html(html);
    }

    //加载数据
    function getData(param, options) {
        search.num = param["pageNo"];
        var pageSize = 10;
        var pageNo = 1;
        var url= !webchat ? m3.curServerInfo.url + "/mobile_portal/seeyon/rest/index/search/"+ search.num +"/20?option.n_a_s=1" : cmp.seeyonbasepath + "/rest/index/search/"+ pageSize +"/"+ pageNo +"?option.n_a_s=1";;
        var data = JSON.stringify({ "keyword": hrefParam.condition, "appId": hrefParam.model });
         
        if(webchat){
            m3Ajax({
                url: url,
                data: data,
                headers:!webchat ? "" :{ "token":cmp.token},
                success: function(res) {
                    var datas = JSON.parse(res.data);
                    if ( datas && datas[hrefParam.model]) {
                        options.success({total:hrefParam.condition ,data:datas[hrefParam.model]});
                    } else {
                        options.success({ total: 0, data: [] });
                    }
                },
                error: function(res) {
                    //console.log(res);
                    if (res.code == -110) {
                        cmp.dialog.loading({
                            status: "nonetwork",
                            callback: function() {
                                window.location.reload();
                            }
                        });
                    } else if (res.code !== 401 && res.code !== 1001 && res.code !== 1002 && res.code !== 1003 && res.code !== 1004) {
                        cmp.dialog.loading({
                            status: "systembusy",
                            text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
                            callback: function() {
                                window.location.reload();
                            }
                        });
                    }
                }
            });
        }else{
          var getDataUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/search/" + search.num + "/20?option.n_a_s=1";
          m3Ajax({
            url: getDataUrl,
            data: data,
            success: function(res) {
                if ("200" == res.code && res.data && res.data[hrefParam.model]) {
                    options.success(res.data[hrefParam.model]);
                } else {
                    options.success({ total: 0, data: [] });
                }
            },
            error: function(res) {
                //console.log(res);
                if (res.code == -110) {
                    cmp.dialog.loading({
                        status: "nonetwork",
                        callback: function() {
                            window.location.reload();
                        }
                    });
                } else if (res.code !== 401 && res.code !== 1001 && res.code !== 1002 && res.code !== 1003 && res.code !== 1004) {
                    cmp.dialog.loading({
                        status: "systembusy",
                        text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
                        callback: function() {
                            window.location.reload();
                        }
                    });
                }
            }
        });
        }
    }

    //初始化
    //initPage();
})();
