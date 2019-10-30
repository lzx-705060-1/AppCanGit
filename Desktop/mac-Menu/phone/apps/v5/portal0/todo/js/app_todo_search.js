/**
 * Created by xp on 2018-7-10.
 */
(function(){
    var listviewObj,searchCondition = {};
    function initPage() {
        cmp.ready(function() {
            var title = cmp.i18n("todo.m3.h5.todoSearchTitle");
            if(title){
                document.title = title;
            }else {
                setTimeout(function(){
                    document.title = title;
                },50);
            }
            cmp.backbutton();
            cmp.backbutton.push(cmp.href.back);
            var searchParams = cmp.href.getParam();
            var m3TodoPenetrateSearchCondition = cmp.storage.get("m3TodoPenetrateSearchCondition",true);
            if(m3TodoPenetrateSearchCondition){
                searchCondition = JSON.parse(m3TodoPenetrateSearchCondition);
                var value = searchCondition.value;
                if(cmp.isArray(value)){
                    searchParams.textfield = value[0];
                    searchParams.textfield1 = value[1];
                }else {
                    searchParams.textfield = value;
                    searchParams.textfield1 = "";
                }
                searchParams.condition = searchCondition.condition;
                cmp.storage.delete("m3TodoPenetrateSearchCondition",true)
            };
            initSearchWidget(searchParams,m3TodoPenetrateSearchCondition);
        });
    }
    function initSearchWidget(searchParams,m3TodoPenetrateSearchCondition){
        //搜索事件
        var searchItems = [{
            type:"text",
            text:cmp.i18n("todo.m3.h5.subject"),
            condition:"subject"
        }];
        if(!searchParams.isThird){
            searchItems.push({
                type:"text",
                text:cmp.i18n("todo.m3.h5.sender"),
                condition:"sender"
            });
            searchItems.push({
                type:"date",
                text:cmp.i18n("todo.m3.h5.createDate"),
                condition:"createDate"
            })
        }

        var searchHistoryStorageKey = searchParams.appId;
        if(!searchHistoryStorageKey){
            searchHistoryStorageKey = searchParams.columnsName;
        }
        var searchModel = {
            name:"wxTodoSearch",
            id: searchHistoryStorageKey
        };
        cmp.search.init( {
            items: searchItems,
            model:searchModel,
            closeCallback:cmp.href.back,
            initShow:true,
            showSearchRecord:m3TodoPenetrateSearchCondition?false:true,
            holdShow:true,
            parameter:m3TodoPenetrateSearchCondition?JSON.parse(m3TodoPenetrateSearchCondition):null,
            completeCallback:m3TodoPenetrateSearchCondition?function(){
                setlistView(searchParams);
            }:null,
            callback:function(result){
                var item = result.item;
                searchCondition = item;
                var textfield=result.searchKey[0],textfield1="";
                searchCondition.value = result.searchKey[0];
                if(item.type == "date"){
                    textfield1 = result.searchKey[1];
                    searchCondition.value = [textfield,textfield1];
                }


                searchParams.textfield = textfield;
                searchParams.textfield1 = textfield1;
                searchParams.condition = result.item.condition;
                setlistView(searchParams);
            }
        });
    }

    function getSearchData(param, option, searchParams){
        var getOtherDataUrl = cmp.seeyonbasepath + "/rest/m3/pending/searchPendingByCondition/"+searchParams.condition + "/"+param["pageNo"] + "/20";
        if (searchParams.hasOwnProperty("isThird") && searchParams.isThird == true) {
            getOtherDataUrl = cmp.seeyonbasepath + "/rest/m3/pending/searchThirdPendingByCondition/" + param["pageNo"]+ "/20";
        }
        m3.ajax({
            type: "POST",
            url: getOtherDataUrl,
            data: JSON.stringify(searchParams),
            success: function(res) {
                if ("200" == res.code) {
                    $(".cmp-search-clear-history").css("display","none");
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].createTime = m3.showTime(res.data.data[i].createTime);
                    }
                    option.success(res.data);
                }

            },
            error: function(err) {
                handleRequestError(err,1);
            }
        });
    }

    function setlistView(searchParams) {
        var config = {
            pageSize: 20,
            onePageMaxNum: 140,
            isClear:true,//将搜索数据进行缓存，页面有穿透又跳回了的情况
            params: [{}],
            dataFunc: function(param, option) {
                getSearchData(param, option, searchParams);
            },
            renderFunc: renderData
        };
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
        if(typeof listviewObj == "undefined"){
            listviewObj = cmp.listView("#historyScroll", {
                config: config,
                down: pulldownTip,
                up: pullupTip
            });
            bindPenetrateEvent();
        }else {
            listviewObj.refreshInitData();
        }
        
    }
    function renderData(res, isRefresh) {
        var imgObj;
        var liTPL = $("#pending_li_tpl").html(),
            table = $('#table-view'),
            html = cmp.tpl(liTPL, res);
        table.addClass("toDo_listes");
        if (isRefresh) {
            $(table).html(html);
        } else {
            $(table).append(html);
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
    function bindPenetrateEvent(){
        //待办穿透（除第三方待办）
        $("#table-view").on("tap", "li", function() {
            if ($(this)[0].id === 'thirdList' || $(this).hasClass('thirdList') || $(this).hasClass('readonly')) return;
            $(this).find('.unread').removeClass('unread').addClass('read');
            $(this).removeClass('unread');
            var appId = $(this).attr("data-appId");
            var gotoParams = $(this).attr("data-gotoParams");
            var appInfo = m3.appMap[("app_" + appId)];
            appInfo.sendParms = cmp.parseJSON(gotoParams);
            appInfo.type = "todo";
            m3.penetratedByUrl(appInfo,function(error){
                if(!error){
                    cmp.storage.save("m3TodoPenetrateSearchCondition",JSON.stringify(searchCondition),true);
                }
            });
        });
    }

    initPage();
})();