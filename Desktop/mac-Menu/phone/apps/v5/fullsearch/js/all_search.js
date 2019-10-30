/**
 * Created by 伟 on 2017/2/15.
 */

(function() {
    var m3, m3Error,m3i18n,m3Ajax,search,imgObj,webchat,hisDataGlobal = [],imgCanLoaded = true,
    seeyonPath,CMPShell,
    appMap,imgIdArr=[],//NameArr=[],
    screenEvent=true;;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        m3 = require('m3');
        require("commons");
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        webchat = cmp.platform.wechatOrDD;
        seeyonPath = cmp.seeyonbasepath;
        CMPShell = cmp.platform.CMPShell;
        initPage();
        initPath();
    });
    
    //页面初始化
    function initPage() {
        //全局变量
        search = initGolbal();
        imgObj = {};
        cmp.ready(function() {
            initStyle();
            initHtml();
            initEvent();
            if(!CMPShell)initSearchFromLastPage();
            //设置搜索框为允许输入
            document.getElementById("btn_a").readOnly = false;
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
                setTimeout(function(){
                    refreshListViewScroll();
                },0);
            });
            //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
            if ( cmp.os.ios ) {
                document.addEventListener("resume",function(){
                    refreshListViewScroll();
                },false);
            }
            cmp.event.orientationChange(function(res){
                refreshListViewScroll();
            });
        });
    }
    function refreshListViewScroll(){
        var scrollContent = document.querySelector('#scroll-content');
        var searchContentAll = scrollContent.querySelector('.search');
        var sliderH = 77;
        var windowH = window.innerHeight;
        var headerH = document.querySelector('header.cmp-bar').offsetHeight;
        var pullrefresh = scrollContent.querySelector('#pullrefresh');
        var resultH = windowH - sliderH - headerH;
        searchContentAll.style.height = resultH +"px";
        // pullrefresh.style.height = resultH +"px";
        cmp.listView(pullrefresh).refreshHeight(resultH);
    }
    // 初始化微协同路径
    function initPath(){
        var seeyon = '/'; // /seeyon/
        appMap = {
            '1': seeyon +'m3/apps/v5/collaboration/html/details/summary.html',
            // '2': seeyon +'m3/apps/v5/collaboration/html/details/summary.html',
            // '2': seeyon +"m3/apps/v5/form/html/content.html",
            
            '3': seeyon +'m3/apps/v5/doc/html/docView.html',  //文档
            '4': seeyon +'m3/apps/v5/edoc/html/edocSummary.html', //公文
            '6': seeyon +'m3/apps/v5/meeting/html/meetingDetail.html',
            '11': seeyon +'m3/apps/v5/calendar/html/newCalEvent.html',
            '30': seeyon +'m3/apps/v5/taskmanage/html/taskEditor.html',
            '8': seeyon +'m3/apps/v5/news/html/newsView.html',
            '10': seeyon +'m3/apps/v5/inquiry/html/inquiryView.html',//调查
            '7': seeyon +'m3/apps/v5/bulletin/html/bulView.html',//公告
            // '47':seeyon +'m3/apps/v5/collaboration/html/newCollaboration.html',
            '47':seeyon +'m3/apps/v5/unflowform/html/info.html',
            
            '9': seeyon +'m3/apps/v5/bbs/html/bbsView.html'
        };
    };

    //初始化全局变量
    function initGolbal() {
        var search = {};
        search.data = {};
        search.input = $("header input");
        search.send = true;
        search.cancel = $("header span.cancel.level1");
        search.useVoice = true;
        search.isRefresh = true;
        var userId = CMPShell?m3.userInfo.getId():"";
        search.key = 'searchData_key'+ userId;//获取用户ID 拼接成独立缓冲Key
        search.keyData = 'searchData';
        search.searchModel = "searchModel";
        search.model = "";
        search.filterId = "All";
        search.listArray = [];
        search.globalization = {
            "1": [m3i18n[cmp.language].coordination, "see-icon-m3-coordination-fill", "coordination"],
            "2": [m3i18n[cmp.language].form, "see-icon-m3-form-fill", "form"],
            "3": [m3i18n[cmp.language].documentation, "see-icon-m3-file", "file"],
            "4": [m3i18n[cmp.language].document, "see-icon-m3-document", "document"],
            "5": [m3i18n[cmp.language].plan, "see-icon-m3-plan"],
            "6": [m3i18n[cmp.language].meeting, "see-icon-m3-meeting-fill", "meeting"],
            "7": [m3i18n[cmp.language].bulletin, "see-icon-m3-notice-fill", "notice"],
            "8": [m3i18n[cmp.language].news, "see-icon-m3-new-fill", "news"],
            "9": [m3i18n[cmp.language].discuss, "see-icon-m3-talk", "talk"],
            "10": [m3i18n[cmp.language].inquiry, "see-icon-m3-research", "research"],
            "11": [m3i18n[cmp.language].schedule, "see-icon-m3-schedule", "project"],
            "30": [m3i18n[cmp.language].task, "see-icon-m3-mission-fill", "mission"],
            "39": [m3i18n[cmp.language].thirdTodo, "see-icon-m3-third", "thirdTodo"],
            "62": [m3i18n[cmp.language].contact, "see-icon-m3-searchperson", "addressBook"],
            "All": [m3i18n[cmp.language].all, "see-icon-m3-app-fill"]
        };
        return search;
    }

    //渲染可查询类别结构
    function initHtml() {
        if(!CMPShell){
            var selectItems = "1,2,4,6,11,30,8,7,10,9,3";
            search.listArray = selectItems.split(',');
            loadPlug(selectItems.split(','));
        }else{
            var url = seeyonPath + "/rest/m3/search/classification";
            
            m3Ajax({
                url: url,
                type: "get",
                success: function(res) {
                    if ("200" == res.code) {
                        if (res.data) {
                            search.listArray = res.data.split(",");
                            loadPlug(res.data.split(","));
                        }
                    }
                },
                error: function(res) {
                    console.log(res);
                    if(res.code == "-1004"){
                        cmp.dialog.loading({
                            status: "nonetwork",
                            callback: function() {
                                window.location.reload();
                            }
                        });
                    }else{
                        if (res.code != '-1009') {
                            cmp.dialog.loading({
                                status: "systembusy",
                                text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
                                callback: function() {
                                    window.location.reload();
                                }
                            });
                        } 
                    }
                   
                }
            });
        }
        getSearchCache();
    }

    //slider轮播
    function loadPlug(list) {
        var html = "";
        //渲染类别
        for (var i = 0; i < list.length; i++) {
            html += ' <div class="plug-item" appid="'+ list[i] +'" id="' + search.globalization[list[i]][2] + '">' + '<span class="iconfont ' + search.globalization[list[i]][1] + '"></span>'+
                '<p>' + search.globalization[list[i]][0] + '</i18n></p>' + '</div>';
        }
        $(".candetail").removeClass("display-none").html(html);
        // var modelId = cmp.storage.get("searchModel",true) || "";
        // if(modelId != ""){
        //     $($('.candetail .plug-item')[JSON.parse(modelId)]).addClass('active');
        // }
        var markItem = true;
        $(".candetail").find('.plug-item').each(function(index,element){
            var self = $(".candetail").find('.plug-item');
            $(self[index]).on('tap',function(e,index){
                for(var i=0,len=$(self).length;i<len;i++){
                    if($(this)[0].getAttribute('appid') == $(self)[i].getAttribute('appid')){
                        continue;
                    }
                    $(self[i]).removeClass('active');
                }
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    search.model = "";
                    search.filterId = "All";
                    cmp.storage.delete("sliderItem", true);
                    screenEvent = false;
                }else{
                    $(this).addClass('active');
                    search.model = this.getAttribute('appid');
                    search.filterId = search.model;
                    cmp.storage.save("sliderItem", $(this).index(), true);
                    // cmp.storage.save("searchModel", search.model, true);
                    screenEvent = true;
                }
            });
        });

        //轮播组件
        var tabHtml = "";
        list.unshift("All");
        var len = list.length;
        var num = Math.ceil(len / 5);
        var arr = [];
        for (var j = 0; j < num; j++) {
            arr[j] = list.slice(5 * j, 5 * j + 5);
        }
        tabHtml += jointHTML(arr[arr.length - 1]);
        tabHtml += jointHTML(arr, 1);
        tabHtml += jointHTML(arr[0]);
        $("#slider").find(".cmp-slider-group").html(tabHtml);
        cmp('#slider').slider();
    }
    //拼接slider轮播html
    function jointHTML(data, isTwo) {
        var html;
        !isTwo && (html = '<div class="cmp-slider-item cmp-slider-item-duplicate"><div class="flex flex-vc">');
        for (var i = 0; i < data.length; i++) {
            if (isTwo) {
                html += '<div class="cmp-slider-item"><div class="flex flex-vc">'
                for (var j = 0; j < data[i].length; j++) {
                    var searchAll = (data[i][j] == "All" ? "searchAll" : "");
                    html += '<div class="flex_item dataTypeItem" data-type="type' + data[i][j] + '" id="' + searchAll + '">' + '<span class="iconfont ' + search.globalization[data[i][j]][1] + '"></span>' + '<p>' + search.globalization[data[i][j]][0] + '</p>' + '</div>';
                }
            } else {
                html += '<div class="flex_item" data-type="type' + data[i] + '">' + '<span class="iconfont ' + search.globalization[data[i]][1] + '"></span>' + '<p>' + search.globalization[data[i]][0] + '</p>' + '</div>';
            }
            isTwo && (html += '</div></div>');
        }!isTwo && (html += '</div></div>');
        return html;
    }

    
    function backbutton(){
        if(!$('.cancel.level1').hasClass('display_none')){
            $('.cancel.level1').trigger('tap');
        }
        if(!$('.cancel.level2').hasClass('display_none')){
            $('.cancel.level2').trigger('tap');
        }
        // cmp.href.back();
    }

    //事件初始化
    function initEvent() {
        if (cmp.os.android) {
            //物理返回
            document.addEventListener("backbutton", function() {
                if(!$('.cancel.level1').hasClass('display_none')){
                    $('.cancel.level1').trigger('click');
                }
                if(!$('.cancel.level2').hasClass('display_none')){
                    $('.cancel.level2').trigger('click');
                }
            });
        }
        cmp.backbutton();
        cmp.backbutton.push(backbutton);
        cmp.footerAuto('#footer','#btn_a');
        var height = window.innerHeight - $('header').height() - 58;
        $('.searchCache-scroll').height(height);
        
        document.querySelector('.searchCache-scroll').addEventListener('touchmove',function(){
            $('#btn_a').blur();
        },false);
        
        //取消搜索
        search.cancel.on("tap", function() {
            cmp.storage.delete(search.key);
            cmp.storage.delete("searchModel", true);
            cmp.storage.delete("filterId", true);
            cmp.storage.delete(search.keyData, true);
            cmp.storage.delete("sliderItem",true);
            if(CMPShell){
                cmp.iat.close();
                cmp.speechRobot.toggleShowAssistiveTouchOnPageSwitch(true); //控制语音小致是否显示
            }
            $('#searchCacheItems').html('');
            cmp.href.back();
        });

        //监听回车
        $(document).keydown(function(e) {
            // 回车键事件
            e.stopPropagation();
            if (search.send) {
                if (search.input.val() != "" && e.which == 13) {
                    cmp.storage.delete("filterId", true);
                    search.data.condition = search.input.val();
                    search.send = false;
                    // cmp.storage.save(search.key, search.input.val(), true);
                    if(hisDataGlobal.indexOf(search.input.val()) < 0 ){
                        saveHistory(search.key,search.input.val());
                    }
                    initCondition();
                    search.useVoice = false;
                    search.isRefresh = true;
                    // initData();
                    if(search.model ==""){
                        search.filterId = "All";
                    }
                    if(search.filterId == "All" ){
                        initData();
                    }else{
                        $('.searchCache-content').hide();
                        $("#slider,div.search").removeClass("display_none");
                        $('.dataTypeItem').each(function(index,element){
                            var self = $('.dataTypeItem'); 
                            if($(self[index]).attr('data-type') == "type"+ search.filterId){
                                $(self[index]).trigger('tap');
                                search.send = true;
                            };
                        });
                    }
                    $("input").trigger("blur");
                    $(".cmp-icon-clear").removeClass("cmp-hidden");

                    

                    return false;
                }
            }
        });
        var timer,clickMark = true;
        // 全文检索穿透
        $("div.search,#content").on("tap", "li.cmp-table-view-cell", function() {
            if(clickMark){
                clearTimeout(timer);
                clickMark = false;
                timer = setTimeout(function(){
                       clickMark = true;
                },300);
                cmp.storage.save(search.keyData,search.data.condition , true);
                // cmp.backbutton.push(backbutton2);
                var appId = $(this).attr("data-id");
                !appId && (appId = 62);
                var type = "todo";
                if (appId == 7 || (appId == 8) || (appId == 10) || (appId == 30)) {
                    type = "message";
                }
                if (appId == 62) { //通讯录
                    var id = $(this).attr("data-i");
                    m3.checkLevelScope(id, function() {
                        var options = {
                            animated:true,nativeBanner:false
                        }
                        m3.state.go(
                            m3.href.map.my_personInfo + "?page=all-search&id=" + id + "&from=m3&enableChat=true", "",
                        options, true);
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
                    if(appId == 1){  //有流程表单
                        sendParms.openFrom = "listPending";
                    }
                    if (appId == 2) { 
                        if(!CMPShell){
                            appId = 1;
                            
                            if(sendParms.formType == "unFlow"){ //无流程
                                appId = 47;
                                sendParms.contentAllId = sendParms.moduleId;
                                sendParms.viewState = "2";//显示状态 2：预览 1：修改
                                sendParms.showType="browse";
                                sendParms.formType = null;
                            }else{
                                sendParms.openFrom = "listPending";
                            }
                        }else{
                            appId = "47";//无流程表单 unflowform
                            sendParms.openFrom = "search";
                            sendParms.moduleId = sendParms.summaryId;
                        }
                    }else if(appId == 3 || appId == 6 || appId == 7 || appId == 8 || appId == 9 || appId == 10){
                        if(sendParms.summaryId){
                            sendParms.id = sendParms.summaryId;
                        }
                    }else if(appId == 66){ //CAP4穿透
                        var url = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/cap4/form/findQueryParam4Index";
                        cmp.dialog.loading(true);
                        m3Ajax({
                            type:"POST",
                            url:url,
                            data:JSON.stringify({"moduleId":sendParms.summaryId}),
                            success:function(res){
                                cmp.dialog.loading(false);
                                var data = res.data;
                                var pageUrl=""
                                if(cmp.platform.CMPShell){
                                    pageUrl="http://cap4.v5.cmp/v1.0.0/htmls/native/form/index.html";
                                }else{
                                    pageUrl="/seeyon/m3/apps/v5/cap4/htmls/native/form/index.html";
                                }
                                var obj={formType: "main",
                                    params: { rightId: data.rightId,
                                            moduleId: data.moduleId,
                                            moduleType: data.moduleType,
                                            operateType: data.operateType},
                                    title: "required",
                                    type: "browse"};
                                cmp.href.next(pageUrl, obj,{openWebViewCatch:1});
                            },
                            error:function(res){
                                console.log(res);
                                cmp.dialog.loading(false);
                                cmp.notification.alert(fI18nData["fullsearch.v5.h5.dataNull"]);
                            }
                        });
                        return;
                    }
                    if(!CMPShell){
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
                            if (docApi) {
                                docApi.openApp("message", "", {'id': sendParms.summaryId}, {});
                                return;
                            }
                        }else if(appId == 4){ //公文
                            sendParms.isTODO="todo";
                            sendParms.openFrom = null;
                        }else if(appId == 6){ //会议
                            sendParms.openFrom = null;
                            sendParms.meetingId = sendParms.summaryId;
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
                    if(!CMPShell){
                        cmp.href.next(cmp.seeyonbasepath + appMap[appId],sendParms);
                    }else{
                        m3.penetrated({
                            appId: appId,
                            type: type,
                            returnUrl: m3.href.map.all_search,
                            sendParms: sendParms,
                            returnParms: { appId: appId },
                            // nativeBanner:false,
                            openNewPage: 1
                        });
                    }
                }
            }
        });

        //查看更多
        $("div.search").on("tap", "p.more", function() {
            cmp.storage.save(search.keyData,search.data.condition , true);
            var dataId = $(this).prev().attr('data-id');
            if($(this).parent().parent().attr('id') == "type2"){
                dataId = 2;
            }
            // cmp.storage.save(search.searchModel,dataId , true); //appID
            $('.dataTypeItem').each(function(index,element){
                var self = $('.dataTypeItem'); 
                if($(self[index]).attr('data-type') == "type"+ dataId){
                    $(self[index]).trigger('tap');
                    var modelIndex = search.listArray.indexOf(dataId);
                    var indexGo = 0;
                    if(modelIndex >=4 && modelIndex<=8){
                        indexGo = 1;
                    }else if(modelIndex>8){
                        indexGo = 2;
                    }else{
                        indexGo = 0;
                    }
                    var goto = cmp('#slider').slider();
                    goto.gotoItem(indexGo);
                };
            });


            // var seemoreUrl = '';
            // if(webchat){
            //     seemoreUrl = "/seeyon/m3/apps/v5/fullsearch/layout/all-search-seemore.html";
            //     cmp.href.next(seemoreUrl,{condition:search.data.condition,model:dataId});
            // }else{
            //     seemoreUrl = "http://fullsearch.v5.cmp/v1.0.0/layout/all-search-seemore.html";
            //     m3.state.go(seemoreUrl, {condition:search.data.condition,model:dataId}, m3.href.animated.left, true);
            // }


        });

        //筛选
        var timer,clickMark = true;
        
            
        $("#slider").on("tap", "div.flex_item", function() {

            if(clickMark){
                clearTimeout(timer);
                clickMark = false;
                timer = setTimeout(function(){
                    clickMark = true;
                },700);

                $(".cmp-prev-page").remove();
                cmp.dialog.loading(false);
                search.filterId = $(this).attr("data-type").slice(4);
                cmp.storage.save("filterId", search.filterId, true);
                $("div.flex_item").children().removeClass("selected").addClass("no-selected");
                $(this).children().addClass("selected").removeClass("no-selected");
                screenEvent = false;
                if (search.filterId == "All") {
                    cmp.storage.save("sliderItem", -1, true);
                    search.isRefresh = false;
                    initData();
                } else {
                    console.log(1)
                    $("div.search").addClass("display_none");
                    $("#pullrefresh").removeClass("display_none");
                    cmp.dialog.loading(true);
                    var pageSize = CMPShell?20:10;
                    loadDOM({
                        pageSize: pageSize,
                        dataFunc: function(params, option) {
                            console.log(2)
                            filterData(params, option);
                        },
                        renderFunc: loadData,
                        onePageMaxNum: 100,
                        params: [{}],
                        isClear: true,
                        crumbsID: "V" + search.filterId
                    });
                }

            }
            
           
            

        });
        //语音搜索
        // $("#voice").on("touchstart", function() {
        //     voiceSearch();
        // });

        //清空输入框
        $(".cmp-icon-clear").on("tap", function() {
            temporaryhistory();
            cmp.storage.save("sliderItem",-1,true);
            $("div.cansearch").removeClass("display_none");
            $("#slider,div.search,#filterNone,#voice,#pullrefresh,div.none").addClass("display_none");
            cmp.dialog.loading(false);
            $("#slider").find("div.flex_item").children().addClass("no-selected").removeClass("selected");
            $("input").trigger("blur");
        });

        //监听input里面没有值之后
        $("#btn_a")[0].oninput = function() {
            if (this.value.length == 0) {
                temporaryhistory();
                $("div.cansearch").removeClass("display_none");
                $("#slider,div.search,#filterNone,#voice,#pullrefresh,div.none").addClass("display_none");
                cmp.dialog.loading(false);
                $("#slider").find("div.flex_item").children().addClass("no-selected").removeClass("selected");
            }
        }

        //监听input获取焦点后
        document.querySelector('#btn_a').addEventListener('focus',function(e){
            e.stopPropagation();
            e.preventDefault();
            cmp.dialog.loading(false);
            $('.searchCache-content').show();
            $('.level1').addClass('display_none');
            $('.level2').removeClass('display_none');
            temporaryhistory();
        },false);
        //二级取消按钮
        $('.level2').on('tap',function(){
            search.filterId = "All";
            $('.level1').removeClass('display_none');
            $('.level2').addClass('display_none');
            $('.searchCache-content').hide();
            temporaryhistory();
            $("div.cansearch").removeClass("display_none");
            $("#slider,div.search,#filterNone,#voice,#pullrefresh,div.none").addClass("display_none");
            $('#btn_a').val("");
            $('#btn_a').blur();
            $('.cmp-search').removeClass('cmp-active');
            $('.cmp-icon-clear').addClass('cmp-hidden');
            cmp.dialog.loading(false);
            $("#slider").find("div.flex_item").children().addClass("no-selected").removeClass("selected");
            cmp.storage.save("sliderItem",-1,true);
            cmp.storage.delete("filterId", true);
            cmp.storage.delete(search.keyData, true);
            cmp.backbutton.push(backbutton);
            $(".candetail").find('.plug-item').each(function(index,element){
                var self = $(".candetail").find('.plug-item');
                $(self[index]).removeClass('active');
                search.model = "";
            });
        });

        //点击清空搜索记录按钮
        $('#clearSearchCache').on('tap',function(){
            var clearUrl = seeyonPath + "/rest/index/clearSearchHis?option.n_a_s=1";
            m3Ajax({
                type:"GET",
                url:clearUrl,
                headers:CMPShell?"":{ "token":cmp.token},
                success:function(res){
                    cmp.storage.delete(search.key);
                    $('#searchCacheItems').html('');
                }
            }); 
            hisDataGlobal = [];
            $('#searchCacheItems').html('');
            $('.searchCache-content').hide();
            $('.level1').removeClass('display_none');
            $('.level2').addClass('display_none');
        });

        //点击返回搜索
        $('#searchBack').on('tap',function(){
            $('.level2').trigger('tap');
            // $('#slider').addClass('display_none');
            // $('.cansearch').removeClass('display_none');
            // $('.searchCache-content').hide();
            // $('.level1').removeClass('display_none');
            // $('.level2').addClass('display_none');
            // $(".candetail").find('.plug-item').each(function(index,element){
            //     var self = $(".candetail").find('.plug-item');
            //     $(self[index]).removeClass('active');
            //     search.model = "";
            // });

        });

    }
    
    //定位条件选择
    function initCondition(){
        if(search.model){
            if(search.listArray){
                var indexof = search.listArray.indexOf(search.model);
                var goto = cmp('#slider').slider();
                var index;
                var sliderItem = JSON.parse(cmp.storage.get("sliderItem",true));
                if(!sliderItem){
                    sliderItem = sliderItem == 0? 0:-1;
                }
                
                if(sliderItem >=4 && sliderItem<=8){
                    index = 1;
                }else if(sliderItem>8){
                    index = 2;
                }else{
                    index = 0;
                }
                if(screenEvent){
                    var itemContent = document.querySelectorAll(".dataTypeItem");
                    $(itemContent[0]).children().addClass("no-selected").removeClass("selected");
                    $(itemContent[sliderItem+1]).children().addClass("selected").removeClass("no-selected");
                }
                
                goto.gotoItem(index);
                var groupSlider = document.querySelector('.cmp-slider-group');
                var sliderWidth  = window.innerWidth;
                if(index == 1){
                    groupSlider.style.webkitTransform = "translate3d(-"+sliderWidth+"px, 0px, 0px)";
                }else if(index == 2){
                    groupSlider.style.webkitTransform = "translate3d(-"+sliderWidth*2+"px, 0px, 0px)";
                }
                
                
            }
        }
    }

    //临时缓存
    function temporaryhistory(){
        var hisData = getHistory(search.key)[0];
        if(hisData && hisDataGlobal.indexOf(hisData) < 0 ){
            hisDataGlobal.unshift(hisData);
            if(hisDataGlobal.length > 8){
                hisDataGlobal.pop();
            }
            var liDom = document.createElement('li');
            liDom.className = "cmp-table-view-cell history-item";
            liDom.setAttribute('text',hisData);
            var str = '<div><div class="cmp-icon see-icon-searchhistory icon-time"></div> <span class="history-text cmp-ellipsis">'+hisData.escapeHTML()+'</span> </div>';
            liDom.innerHTML = str;
            var searchCacheItems = document.getElementById("searchCacheItems");
            liDom.addEventListener('click',function(){
                InitHistoryClick(this);
            },false);
            searchCacheItems.insertBefore(liDom,searchCacheItems.childNodes[0]);
            if($('#searchCacheItems .history-item').length > 8){
                $('#searchCacheItems .history-item').last().remove();
            }
        }
    }
    //初始化历史纪录点击事件
    function InitHistoryClick(event){
        var value = event.getAttribute('text');
        search.data.condition = value;
        search.input.val(value);
        search.input.focus();
        search.send = false;
        if(search.model ==""){
            search.filterId = "All";
        }
        // cmp.backbutton.push(backbutton);
        saveHistory(search.key,value);
        search.useVoice = false;
        search.isRefresh = true;
        initCondition();
        if(search.filterId == "All" ){
            initData();
        }else{
            $('.searchCache-content').hide();
            $("#slider,div.search").removeClass("display_none");
            $('.dataTypeItem').each(function(index,element){
                var self = $('.dataTypeItem'); 
                if($(self[index]).attr('data-type') == "type"+ search.filterId){
                    $(self[index]).trigger('tap');
                    search.send = true;
                };
            });
        }
        
        $("input").trigger("blur");
        $(".cmp-icon-clear").removeClass("cmp-hidden");
    }
    //获取搜索历史记录
    function getSearchCache(){
        // var searchData =  getHistory(search.key);
        // var searchModel = cmp.storage.get("searchModel", true);
        // if(!searchData || searchData.length == 0)return;
        var del = fI18nData["fullsearch.v5.h5.delete"];
        //热门搜索
        if(CMPShell){  //M3  获取热门搜索和历史记录
            var url = seeyonPath + "/rest/m3/search/hotAndHis?option.n_a_s=1";
            m3Ajax({
                type:"GET",
                url:url,
                success:function(res){
                    console.log(res)
                    if(res.code == "200"){
                        var his = res.data.his;//历史记录
                        var hot = res.data.hot;//热门搜索
                        if(hot.length != 0){
                            $('#hosSearch').removeClass('display_none');
                            hotDataFun(hot);
                        }
                        if(his.length !=0){
                            for(var i=0,len=his.length;i<len;i++){
                                if(his[i][0].indexOf("*") > -1){
                                    his[i][0] = his[i][0].replace("*","").replace("*","");
                                }
                            }
                            if(his.length != 0){
                                hisDataFun(his)
                            }else{
                                hisDataGlobal = [];
                                $('#searchCacheItems').html('');
                                cmp.storage.delete(search.key);
                            };
                        }
                    }
                },
                error:function(res){
                    console.log(res);
                }
            });
        }else{  //微协同
            //微协同热词
            var hotUrl = seeyonPath + "/rest/index/hotKeys?option.n_a_s=1" ; 
            m3Ajax({
                type:"GET",
                url:hotUrl,
                headers:{ "token":cmp.token},
                success:function(res){
                    console.log(res)
                    // if(res.code == "200"){
                        var data = JSON.parse(res.data);
                        if(data.length != 0){
                            $('#hosSearch').removeClass('display_none');
                            hotDataFun(data);
                        }
                    // }
                },
                error:function(res){
                    console.log(res);
                }
            });
            //历史记录
            var hisUrl= seeyonPath + "/rest/index/searchHis?option.n_a_s=1";
            m3Ajax({
                type:"GET",
                url:hisUrl,
                headers:{ "token":cmp.token},
                success:function(res){
                    console.log(res)
                    var data = JSON.parse(res.data);
                    for(var i=0,len=data.length;i<len;i++){
                        if(data[i][0].indexOf("*") > -1){
                            data[i][0] = data[i][0].replace("*","").replace("*","");
                        }
                    }
                    if(data.length != 0){
                        hisDataFun(data)
                    }else{
                        hisDataGlobal = [];
                        $('#searchCacheItems').html('');
                        cmp.storage.delete(search.key);
                    };
                },
                error:function(res){
                    console.log(res);
                }
            });
        }
    }
    //历史记录数据渲染
    function hisDataFun(hisData){
        var str = "";
        var i=0,hisLen=hisData.length;
        for(i;i<hisLen;i++){
            str += '<li text="'+hisData[i][0].escapeHTML()+'" class="cmp-table-view-cell history-item">\
            <div class="">\
                <div class="cmp-icon see-icon-searchhistory icon-time"></div>\
                <span class="history-text cmp-ellipsis">'+ hisData[i][0].escapeHTML() +'</span>\
            </div>\
            </li>';
            hisDataGlobal.push(hisData[i][0]);
        }
        $('#searchCacheItems').html(str); //填充历史记录
        // 点击历史记录
        var historyItems = $('.history-item');
        var i=0,len=historyItems.length;
        for(i;i<len;i++){
            historyItems[i].addEventListener('click',function(){
                InitHistoryClick(this);
            },false);
        };
    }
    //热门搜索数据渲染
    function hotDataFun(hotData){
        if(hotData.length == 0){
            $('#topsearch').html('<li class="hotdataitem" text='+ hotData[i][0] +'><span>'+ hotData[i][0] +'</span></li>');
        }else{
            var hasStr = "";
            var i=0,len=hotData.length;
            for(i;i<len;i++){
                if(i>4){
                    break;
                }
                var text = hotData[i];
                hasStr += '<li class="hotdataitem" text='+ text +'><span>'+ text +'</span></li>';
                // hasStr += '<li class="hotdataitem" text='+ hotData[i] +'><span>'+ hotData[i] +'</span></li>';
            }
            $('#topsearch').html(hasStr);  //填充热门搜索
        }
        //点击热门搜索
        if(!$('#hosSearch').hasClass('display_none')){
            $('.hotdataitem').each(function(index){
                var self = $('.hotdataitem');
                $(self[index]).on('tap',function(){
                    if(!cmp.storage.get("sliderItem", true)){
                        search.filterId = "All";
                    }
                    if (search.send) {
                        InitHistoryClick(this);
                    }
                });
            });
        }
        
    }

    //样式初始化
    function initStyle() {
        var formWidth = $("body").width() - $(".cancel").width() - 15;
        $("form").width(formWidth);
        $("input").trigger("blur");
        $(".cmp-placeholder").children().last().html(cmp.i18n("fullsearch.v5.h5.searchPrompt"));
        $("#pullrefresh").css("top", $("#slider").css("height"));
        $("#pullrefresh").css("background-color", "#fff");
        if (cmp.os.ios) {
            $("#pullrefresh").css("bottom", "60px");
        }else{
            $("#pullrefresh").css("bottom", "40px");
        }
        $("div.search").height($(window).height() - $("header").height() - parseInt($("#slider").css("height")));
    }

    //通过上一个页面的数据进行搜索初始化
    function initSearchFromLastPage() {
        //根据上一页面输入信息搜索
        if (cmp.storage.get(search.keyData, true)) {
            // search.data.condition = cmp.storage.get(search.key, true);
            var storyValue = cmp.storage.get(search.keyData, true);
            search.data.condition =  storyValue ? storyValue : "";
            var filterDataId = cmp.storage.get('filterId',true);
            if(!search.filterId && !filterDataId){
                search.filterId = "All";
            }
            if(filterDataId){
                search.filterId = filterDataId;
            }
            $(".cmp-search").addClass("cmp-active");
            search.input.val(search.data.condition);
            $(".cmp-icon-clear").removeClass("cmp-hidden");
            $('.level1').addClass('display_none');
            $('.level2').removeClass('display_none');
            $("input").trigger("blur");
            cmp.storage.get("filterId", true) ? initData(autoTap) : initData();
        }
    }

    //数据初始化
    function initData(fn) {
        var pageSize = 10;
        var pageNo = 1;
        var urlObj;
        var url= seeyonPath + "/rest/index/search/"+ pageSize +"/"+ pageNo +"?option.n_a_s=1";;
        
        if(!CMPShell){
            urlObj = url;
        }else{
            var pageSizeModel;
            if(search.filterId == "All"){
                pageSizeModel = 3;
            }else{
                pageSizeModel = search.model?10:3;
            }
            urlObj = seeyonPath + "/rest/m3/search/1/"+pageSizeModel+"?option.n_a_s=1";
        }
        var dataParameter;
        if(search.model.length > 0 ){
            if(search.filterId == "All" && cmp.storage.get("filterId", true)){
                dataParameter =  JSON.stringify({ "keyword": search.data.condition });
            }else{
                dataParameter = JSON.stringify({ "keyword": search.data.condition,"appId": search.model });
            }
        }else{
            dataParameter = JSON.stringify({ "keyword": search.data.condition });
        }
        cmp.dialog.loading(true);
        m3Ajax({
            type:"POST",
            url: urlObj,
            headers:CMPShell?"":{ "token":cmp.token},
            data:dataParameter,
            success: function(res) {
                cmp.dialog.loading(false);
                initDataResult(res,fn);
                // if(cmp.storage.get(search.keyData, true)){
                //     search.isRefresh = true;
                //     initCondition();
                // }
            },
            error: function(res) {
                cmp.dialog.loading(false);
                cmp.notification.alert("ajax请求错误码："+res.code,function(){
                    cmp.href.back();
                },'提示','确定');
                search.send = true;
                if (res.code != '-1009') {
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

    function initDataResult(res,fn){
        search.send = true;
        if (decideNull(res.data) || res.data=="{}") {
            $("div.cansearch,#slider,div.search,#filterNone,#loading,#pullrefresh").addClass("display_none");
            
            $("#voice-icon").removeClass("display_none");
            cmp.dialog.loading({
                status: "nocontent",
                text: m3i18n[cmp.language].noContent
            });
            search.useVoice ? $("#voice").removeClass("display_none") : $("#voice").addClass("display_none")
        } else {
            $('.searchCache-content').hide();
            $("#slider,div.search").removeClass("display_none");
            if(search.model == ""){
                cmp("#slider").slider().gotoItem(0);
                search.isRefresh && $("#slider").find(".flex_item").children().addClass("no-selected").removeClass("selected");
                $("#searchAll").children().addClass("selected").removeClass("no-selected");
                search.filterId = "All";
            }
            $("div.cansearch,#filterNone,#voice,#pullrefresh").addClass("display_none");
            if(!CMPShell){
                var datas = JSON.parse(res.data);
                wechatRenderData(datas, fn);
            }else{
                m3RenderData(res.data, fn);
            }
            search.model = "";
            $('.search').scrollTop(0);
        }
    }
    //判断是否是英文
    function funcChina(obj){    
        if(/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {  
            return false;   
        }   
        return true;   
    }   
    //渲染数据 ==》原来的数据结构
    function m3RenderData(data, fn) {
        var html = "";
        for (var i in data) {
            if (data[i].total > 0) {
                html += "<div id='type" + i + "'>";
                if (i != 62) {
                    html += "<p class='margin_top10'>" + search.globalization[i][0] + "</p>" +
                        "<ul class='cmp-table-view search-people'>";
                } else {
                    html += "<p class='margin_top10'>" + search.globalization[62][0] + "</p>" +
                        "<ul class='cmp-table-view search-people'>";
                }
                if (i == 39) { //如果不是联系人
                    for (var j = 0; j < data[i].data.length; j++) {
                        var nowData = data[i].data[j];
                        nowData.createDate && (nowData.createDate = m3.showTime(nowData.createDate));
                        html += "<li data-thirdId='" + nowData.thirdAppId + "' data-id='" + nowData.appType + "' data-gotoParams = '" + nowData.gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>";
                        if (nowData.thirdIcon && (nowData.thirdIcon == "" || nowData.thirdIcon == null)) {
                            html += "<div class='cmp-pull-left search-39'><span class='iconfont " + search.globalization[i][1] + "'></span></div> ";
                        } else if (nowData.thirdIcon) {
                            html += '<div class="cmp-pull-left" style="background-image: url(\'' + nowData.thirdIcon + '\');background-size: cover;background-position: 50% 50%"></div> ';
                        } else {
                            html += "<div class='cmp-pull-left search-39'><span class='iconfont " + search.globalization[i][1] + "'></span></div> ";
                        }
                        var nowDataStartMember = nowData.startMember && nowData.startMember.length > 10 ? (nowData.startMember.slice(0, 10) + '...') : nowData.startMember||"";
                        html += "<p class='cmp-ellipsis'>" + nowData.title.escapeHTML() + "</p><p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + nowData.createDate + "</span>" +
                            " </p></li>";
                    }
                } else if (i == 62) { //联系人
                    imgIdArr = [];
                    // NameArr = [];
                    for (var k = 0; k < data[i].data.length; k++) {
                        nowData = data[i].data[k];
                        var url = ''+m3.curServerInfo.url+'/mobile_portal'+ nowData.img+'';
                        var id = nowData.i;
                        if (url.match(/\?/)) {
                            url += '&ranid=' + id;
                        } else {
                            url += '?ranid=' + id;
                        }
                        html += '<li id="' + id + '" data-id="' + i + '" data-i="' + id + '" class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left"><img src="'+url+'">';
                        
                        // html +='<img src="'+url+'" alt="">'; 
                         
                        html += '</div><p class="message_list_title">' + (nowData.n.length > 10 ? (nowData.n.slice(0, 10) + "...") : nowData.n) + ' </p>' +
                            '<p class="cmp-ellipsis">' + nowData.pn.escapeHTML() + '</p> </li>';
                        imgIdArr.push(id);
                        // NameArr.push(nowData.n);
                        imgObj[id] = new Image();
                        imgObj[id].src = url;
                        imgObj[id].onerror = function(e) {
                            var id = e.target.currentSrc.split('ranid=')[1];
                            $('#' + id).find('.cmp-pull-left').find('img')[0].src ='http://commons.m3.cmp/v/imgs/header.png';
                            //  ('backgroundImage','url(http://commons.m3.cmp/v/imgs/header.png)');
                            $('#' + id).find('.cmp-pull-left').css('background-color','#fff');
                        };
                    }
                    // if (imgIdArr.length > 0) {
                    //     checkLoaded(loadHeader,url);
                    // }
                } else { //其他
                    for (var j = 0; j < data[i].data.length; j++) {
                        var nowData = data[i].data[j];
                        var nowDataStartMember = nowData.startMember && nowData.startMember.length > 10 ? (nowData.startMember.slice(0, 10) + '...') : nowData.startMember||"";
                        nowData.createDate && (nowData.createDate = m3.showTime(nowData.createDate));
                        html += "<li data-id='" + nowData.appType + "' data-gotoParams = '" + nowData.gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>" +
                            "<div class='cmp-pull-left search-" + i + "'>" +
                            "<span class='iconfont " + search.globalization[i][1] + "'></span>" +
                            "</div><p class='cmp-ellipsis'>" + nowData.title.escapeHTML() + "</p><p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + nowData.createDate + "</span>" +
                            " </p>  </li>";
                    }
                }
                if(search.filterId == "All"){
                    if (data[i].total > 3) {
                        html += '<p class="more">' + m3i18n[cmp.language].seeMore + '</p></div>';
                    } else {
                        html += '</div>';
                    }
                }else{
                    if(search.model){
                        html += '</div>';
                    }
                }
                
            }
        }

        $("div.search").html(html);
        var newHtml = $("div.search").find('div#type62')[0];
        if(newHtml){
            var searchContent = document.querySelector('.search');
            searchContent.insertBefore(newHtml,searchContent.childNodes[0]);
        }
        
        fn && fn();
    }

    //渲染数据 ==》兼容微信
    function wechatRenderData(data, fn) {
        var html = "";
        for (var i in data) {
            if(i.indexOf('totalCount') > 0){
                continue;
            }
            if ( data[i].indexOf('totalCount') < 0 ) {
                if(i == 5){
                    continue;
                }
                html += "<div id='type" + i + "'>";
                if (i != 62) {
                    html += "<p class='margin_top10'>" + search.globalization[i][0] + "</p>" +
                        "<ul class='cmp-table-view search-people'>";
                } else {
                    html += "<p class='margin_top10'>" + search.globalization[62][0] + "</p>" +
                        "<ul class='cmp-table-view search-people'>";
                }
                if (i == 39) { //如果不是联系人
                    for (var j = 0; j < data[i].length; j++) {
                        var nowData = data[i][j];
                        var gotoParams = '{"openFrom":"glwd","summaryId":"'+nowData.linkId+'"}';
                        nowData.createDate && (nowData.createDate = m3.showTime(nowData.createDate));
                        html += "<li data-thirdId='" + nowData.typeId + "' data-id='" + nowData.appType + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>";
                        if (nowData.docType && (nowData.docType == "" || nowData.docType == null)) {
                            html += "<div class='cmp-pull-left search-39'><span class='iconfont " + search.globalization[i][1] + "'></span></div> ";
                        } else if (nowData.docType) {
                            html += '<div class="cmp-pull-left" style="background-image: url(\'' + nowData.docType + '\');background-size: cover;background-position: 50% 50%"></div> ';
                        } else {
                            html += "<div class='cmp-pull-left search-39'><span class='iconfont " + search.globalization[i][1] + "'></span></div> ";
                        }
                        var nowDataStartMember = nowData.startMember && nowData.startMember.length > 10 ? (nowData.startMember.slice(0, 10) + '...') : nowData.startMember||"";
                        html += "<p class='cmp-ellipsis'>" + nowData.title.escapeHTML() + "</p><p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + nowData.createDate + "</span>" +
                            " </p></li>";
                    }
                } else if (i == 62) { //联系人
                    for (var k = 0; k < data[i].data.length; k++) {
                        nowData = data[i].data[k];
                        html += '<li data-id="' + i + '" data-i="' + nowData.i + '" class="cmp-table-view-cell cmp-media list-top">' +
                            '<div class="cmp-pull-left"><img src="' + m3.curServerInfo.url + "/mobile_portal" + nowData.img + '" alt=""></div>' +
                            '<p class="message_list_title">' + (nowData.n.length > 10 ? (nowData.n.slice(0, 10) + "...") : nowData.n) + ' </p>' +
                            '<p class="cmp-ellipsis">' + nowData.pn.escapeHTML() + '</p> </li>'
                    }
                } else { //其他
                    for (var j = 0; j < data[i].length; j++) {
                        if(j == 3){
                            break;
                        }
                        var nowData = data[i][j];
                        var openFrom = nowData.openFrom?nowData.openFrom:'glwd';
                        var gotoParams;
                        if(nowData.extendProperties.formType == "unFlow"){
                            gotoParams = '{"formType":"'+ nowData.extendProperties.formType +'","moduleType":"'+ nowData.extendProperties.moduleType +'","rightId":"'+ nowData.extendProperties.rightId +'","name":"'+ nowData.extendProperties.name +'","moduleId":"'+ nowData.extendProperties.moduleId +'"}';
                        }else{
                            gotoParams = '{"openFrom":"'+ openFrom +'","summaryId":"'+ nowData.linkId +'"}';
                        }
                        var nowDataStartMember = nowData.startMember && nowData.startMember.length > 10 ? (nowData.startMember.slice(0, 10) + '...') : nowData.startMember||"";
                        nowData.createDate && (nowData.createDate = m3.showTime(nowData.createDate));
                        html += "<li data-id='" + nowData.appType + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>" +
                            "<div class='cmp-pull-left search-" + i + "'>" +
                            "<span class='iconfont " + search.globalization[i][1] + "'></span>" +
                            "</div><p class='cmp-ellipsis'>" + nowData.title.escapeHTML() + "</p><p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + nowData.createDate + "</span>" +
                            " </p>  </li>";
                    }
                }
                if(search.model == ""){
                    search.filterId = "All";
                }
                if(search.filterId == "All"){
                    if (data[i].length > 3) {
                        html += '<p class="more">' + m3i18n[cmp.language].seeMore + '</p></div>';
                    } else {
                        html += '</div>';
                    }
                }else{
                    if(search.model){
                        html += '</div>';
                    }
                }

                // if ( data[i].length > 3 ) {
                //     html += '<p class="more">' + m3i18n[cmp.language].seeMore + '</p></div>';
                // } else {
                //     html += '</div>';
                // }
            }
        }
        $("div.search").html(html);
        var newHtml = $("div.search").find('div#type62')[0];
        if(newHtml){
            var searchContent = document.querySelector('.search');
            searchContent.insertBefore(newHtml,searchContent.childNodes[0]);
        }
        fn && fn();
    }

    

    //筛选条件请求数据
    function filterData(param, options) {
        search.num = param["pageNo"];
        search.pageSize = param["pageSize"];
        var getDataUrl = CMPShell ? seeyonPath + "/rest/m3/search/" + search.num + "/20?option.n_a_s=1" : seeyonPath + "/rest/index/search/"+search.pageSize+"/" + search.num + "?option.n_a_s=1";
        
        m3Ajax({
            type:'POST',
            url: getDataUrl,
            data: JSON.stringify({ "keyword": search.data.condition, "appId":!CMPShell?cmp.storage.get('filterId',true): search.filterId }),
            headers:CMPShell?"":{ "token":cmp.token},
            success: function(res) {
                cmp.dialog.loading(false);
                console.log(res);
                $('.search').html('');
                if(!CMPShell){
                    if(res.data == "{}"){
                        options.success({ total: 0, data: [] });
                    }else{
                        var datas = JSON.parse(res.data);
                        var totalMunber = "";
                        for(var i in datas){
                            if(i.toString().indexOf("totalCount")>-1){
                                totalMunber = i.toString();
                                break;
                            }
                        }
                        options.success({ total: datas[totalMunber], data: datas[cmp.storage.get('filterId',true)] });
                    
                    }
                }else{
                    if (res.data && res.data[search.filterId]) {
                        options.success(res.data[search.filterId]);
                    } else {
                        options.success({ total: 0, data: [] })
                    } 
                }
                search.model = "";
            },
            error: function(res) {
                if (res.code != '-1009') {
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
    //筛选条件渲染数据
    function loadData(data, isRefresh) {
        var html = "";
        if (search.filterId == 39) {
            for (var i = 0; i < data.length; i++) {
                data[i].createDate && (data[i].createDate = m3.showTime(data[i].createDate));
                var gotoParams = !CMPShell? '{"openFrom":"glwd","summaryId":"'+ data[i].linkId +'"}':data[i].gotoParams;
                html += "<li data-thirdId='" + data[i].thirdAppId + "' data-id='" + search.filterId + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>";
                if (data[i].thirdIcon && (data[i].thirdIcon == "" || data[i].thirdIcon == null)) {
                    html += "<div class='cmp-pull-left search-" + search.filterId + "'><span class='iconfont " + search.globalization[search.filterId][1] + "'></span></div> ";
                } else if (data[i].thirdIcon) {
                    html += '<div class="cmp-pull-left" style="background-image: url(\'' + data[i].thirdIcon + '\');background-size: cover;background-position: 50% 50%"></div> ';
                } else {
                    html += "<div class='cmp-pull-left search-" + search.filterId + "'><span class='iconfont " + search.globalization[search.filterId][1] + "'></span></div> ";
                }
                var nowDataStartMember = data[i].startMember && data[i].startMember.length > 10 ? (data[i].startMember.slice(0, 10) + '...') : data[i].startMember||"";
                html += "<p class='cmp-ellipsis'>" + data[i].title.escapeHTML() + "</p> <p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + data[i].createDate + "</span> </p> </li>";
            }
        } else if (search.filterId == 62) {
            imgIdArr = [];
            // NameArr = [];
            for (var k = 0; k < data.length; k++) {
                var ranId = Math.floor(Math.random(1) * 1000000),
                    url = m3.curServerInfo.url + "/mobile_portal" + data[k].img;
                
                var id = data[k].i;
                if (url.match(/\?/)) {
                    url += '&ranid=' + id;
                } else {
                    url += '?ranid=' + id;
                }
                html += '<li id="' + id + '" data-i="' + id + '" class="cmp-table-view-cell cmp-media list-top">';
                html +='<div class="cmp-pull-left ' + ranId + '"><img src="'+url+'"></div>' ;

                html+=  '<p class="cmp-ellipsis">' + (data[k].n.length > 10 ? (data[k].n.slice(0, 10) + "...") : data[k].n) + ' </p>' +
                    '<p class="message_list_title">' + data[k].pn.escapeHTML() + '</p> </li>';
                imgIdArr.push(id);
                // NameArr.push(data[k].n);
                imgObj[id] = new Image();
                imgObj[id].src = url;
                imgObj[id].onerror = function(e) {
                    var id = e.target.currentSrc.split('ranid=')[1];
                    $('#' + id).find('.cmp-pull-left').find('img')[0].src ='http://commons.m3.cmp/v/imgs/header.png';
                    // $('#' + id).find('.cmp-pull-left').css('backgroundImage','url(http://commons.m3.cmp/v/imgs/header.png)');
                    $('#' + id).find('.cmp-pull-left').css('background-color','#fff');
                };
            }
            // if (imgIdArr.length > 0) {
            //     checkLoaded(loadHeader,url);
            // }
        } else {
            for (var i = 0; i < data.length; i++) {
                if(data[i].appType == 5){
                    continue;
                }
                var openFrom =  data[i].openFrom?data[i].openFrom:'glwd';
                var gotoParams;
                if(!CMPShell){
                    if(data[i].extendProperties.formType == "unFlow"){
                        gotoParams =  '{"formType":"'+ data[i].extendProperties.formType +'","moduleType":"'+ data[i].extendProperties.moduleType +'","rightId":"'+ data[i].extendProperties.rightId +'","name":"'+ data[i].extendProperties.name +'","moduleId":"'+ data[i].extendProperties.moduleId +'"}';
                    }else{
                        gotoParams =  '{"openFrom":"'+ openFrom +'","summaryId":"'+ data[i].linkId +'"}';
                    }
                }else{
                    gotoParams = data[i].gotoParams;
                }
                var nowDataStartMember = data[i].startMember && data[i].startMember.length > 10 ? (data[i].startMember.slice(0, 10) + '...') : data[i].startMember||"";
                data[i].createDate && (data[i].createDate = m3.showTime(data[i].createDate));
                html += "<li data-id='" + data[i].appType + "' data-gotoParams = '" + gotoParams + "' class='cmp-table-view-cell cmp-media list-top'>" +
                    "<div class='cmp-pull-left search-" + search.filterId + "'><span class='iconfont " + search.globalization[search.filterId][1] + "'></span></div>"+
                     "<p class='cmp-ellipsis'>" + data[i].title.escapeHTML() + "</p> <p class='message_list_title'>" + nowDataStartMember + " <span class='cmp-pull-right'>" + data[i].createDate + "</span> </p> </li>";
            }
        }!isRefresh ? $("#content").append(html) : $("#content").html(html);
    }
    var index = 0;
    function loadHeader(url) {
        imgCanLoaded = false;
        var imgObj = new Image();
        if(!url){
          var url = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + imgIdArr[index] + '?maxWidth=200';
        }
        imgObj.src = url;
        imgObj.onerror = function() {
            // var cliceName;
            // if(funcChina(NameArr[index])){
            //     cliceName = NameArr[index].substr(0,2);//截取前两位字符
            // }else{//不是英文
            //     cliceName = NameArr[index].substr(1);//截取后两位字符
            // }
            // var str = '<span class="cliceName">'+cliceName+'</span>';
            // $('#'+imgIdArr[index]).find('.cmp-pull-left').html(str);
            $('#' + imgIdArr[index]).find('.cmp-pull-left').css('backgroundImage','url(http://commons.m3.cmp/v/imgs/header.png)');
            $('#' + imgIdArr[index]).find('.cmp-pull-left').css('background-color','#fff');
            if (index == imgIdArr.length - 1) {
                imgCanLoaded = true;
                index = 0;
            } else {
                index++;
                loadHeader();
            }
        }
        imgObj.onload = function() {
            // $('#' + imgIdArr[index]).find('.cmp-pull-left').css('backgroundImage','url(' + url + ')');
            if (index == imgIdArr.length - 1) {
                imgCanLoaded = true;
                index = 0;
            } else {
                index++;
                loadHeader();
            }
        }
    }
    
    function checkLoaded(callback,url) {
        var time = setInterval(function() {
            if (imgCanLoaded) {
                callback(url);
                clearInterval(time);
            }
        }, 50)
    }
    //-------------公共区域---------------
    //判断数据是否为空
    function decideNull(obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    }

    // 查找自定义属性值的元素
    function findElement(key, value) {
        var list = $("#slider").find(".cmp-slider-item").not(".cmp-slider-item-duplicate").find("div.flex_item");
        for (var i = 0, len = list.length; i < len; i++) {
            if ($(list[i]).attr(key) == value) {
                return $(list[i]);
            }
        }

    };

    //定位到之前slider的状态
    function jumpSlider() {
        // var sliderItem = JSON.parse(cmp.storage.get("filterId", true));
        var sliderItem = search.listArray.indexOf(cmp.storage.get("filterId", true));
        if(!sliderItem){
            sliderItem = sliderItem == 0? 0:-1;
        }
        
        if(sliderItem >=4 && sliderItem<=8){
            index = 1;
        }else if(sliderItem>8){
            index = 2;
        }else{
            index = 0;
        }
        cmp("#slider").slider().gotoItem(index);
        var groupSlider = document.querySelector('.cmp-slider-group');
        var sliderWidth  = window.innerWidth;
        if(index == 1){
            groupSlider.style.webkitTransform = "translate3d(-"+sliderWidth+"px, 0px, 0px)";
        }else if(index == 2){
            groupSlider.style.webkitTransform = "translate3d(-"+sliderWidth*2+"px, 0px, 0px)";
        }
        // var list = $(".flex_item");
        // for (var i = 5, len = list.length; i < len; i++) {
        //     if ($(list[i]).attr("data-type").slice(4) == cmp.storage.get("sliderItem",true) ) {
        //         return parseInt((i - 4) / 5);
        //     }
        // }
    }

    function autoTap() {
        jumpSlider();
        // cmp("#slider").slider().gotoItem(jumpSlider());
        findElement("data-type", "type" + cmp.storage.get("filterId", true)).trigger("tap");
    }

    //获取缓存
    function getHistory(key) {
        var historys = [];
        var historyVal = cmp.storage.get(key);
        if (historyVal) {
            historys = (historyVal instanceof Array)?historyVal:cmp.parseJSON(historyVal);
        }
        return historys;
    };
    function saveHistory(key, value) {
        var self = this;
        var historys = getHistory(key);
        if (historys && historys.length > 0) {
            if (!historys.inArray(value)) {   //如果包含
                historys.unshift(value);
                if (historys.length > 20) {
                    historys.pop();
                }
                historys = cmp.toJSON(historys);
                cmp.storage.save(key, historys);
            }
        } else {
            historys.push(value);
            historys = cmp.toJSON(historys);
            cmp.storage.save(key, historys);
        }
    };

    //语音搜索----已暂时屏蔽
    // function voiceSearch() {
    //     search.isRefresh = true;
    //     $("#voice").find(".record-button").addClass("active");
    //     cmp.speechRobot.toggleShowAssistiveTouchOnPageSwitch(false); //控制语音小致是否显示
    //     cmp.iat.input({
    //         success: function(res) {
    //             $("#voice").find(".record-button").removeClass("active");
    //             if (res && res.result && (res.result.value != "")) {
    //                 var data = res.result.value.slice(0, res.result.value.length - 1);
    //                 $(".cmp-search").addClass("cmp-active");
    //                 document.getElementById("btn_a").value = data;
    //                 $(".cmp-icon-clear").removeClass("cmp-hidden");
    //                 search.data.condition = data;
    //                 // cmp.storage.save(search.key, data, true);
    //                 // saveHistory(search.key,data);
    //                 search.useVoice = true;
    //                 initData();
    //                 $("div.cansearch,#voice-icon").addClass("display_none");
    //                 $("#loading").removeClass("display_none");
    //             }
    //         },
    //         error: function(res) {
    //             $("#voice").find(".record-button").removeClass("active");
    //             if (res.code == "39003") { //如果没有录音权限,弹出
    //                 cmp.app.setPermission({
    //                     permissionTips: res.message,
    //                     cancelText: m3i18n[cmp.language].cancel,
    //                     toSetText: m3i18n[cmp.language].toSet
    //                 });
    //             } else {
    //                 cmp.notification.toast(res.message, "center");
    //             }
    //             console.log(res);
    //         }
    //     });
    // }
})();