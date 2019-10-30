var tableContentListView;
function doHome(aListType, aId, aSearchValue, aDoSlide) {
    var data, fSearch, fCaption, dataVal;
    fSearch = !M1FormUtils.isStatistics(aListType);
    var fParams;
    if (fSearch || M1FormUtils.isSearchList) {
        aListType = M1FormUtils.C_iListType_Sreach;
        M1FormUtils.isSearchList = false;
        if (aSearchValue) {
            dataVal = encodeURIComponent(aSearchValue);
        }
        fParams = {
            "aId": aId,
            "aListType": aListType,
            "aSearchValue": dataVal
        };

        cmp.dialog.loading(true);
        $s.CapForm.getFormQueryTree({}, fParams, {
            success: function (ret) {
                cmp.dialog.loading(false);
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].itemtype = parseInt(ret.list[i].itemtype);
                }
                if (aSearchValue != null) {
                    var fitem;
                    for (var j = ret.list.length - 1; j >= 0; j--) {
                        fitem = ret.list[j];
                        if (!startWith(fitem.title, aSearchValue))
                            ret.list.splice(j, 1);
                    }
                }
                data = {
                    "id": ret.id,
                    "caption": ret.caption,
                    "list": ret.list
                };
                if (aDoSlide == null)
                    aDoSlide = true;
                M1FormUtils.isSearchList = false;
                //M1FormUtils.jumpLocked=true;
                update_homeUI(aDoSlide, data, aListType, aSearchValue);
            },
            error: function (ret) {
                cmp.dialog.loading(false);
                console.log(ret);
            }
        });
    }
    else {

        aListType = M1FormUtils.C_iListType_Statistics;
        fParams = {
            "aId": aId,
            "aListType": aListType,
            "aSearchValue": aSearchValue
        };

        cmp.dialog.loading(true);
        $s.CapForm.getFormQueryTree({}, fParams, {
            success: function (ret) {
                cmp.dialog.loading(false);
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].itemtype = parseInt(ret.list[i].itemtype);
                }
                if (aSearchValue != null) {
                    var fitem;
                    for (var j = ret.list.length - 1; j >= 0; j--) {
                        fitem = ret.list[j];
                        if (!startWith(fitem.title, aSearchValue))
                            ret.list.splice(j, 1);
                    }
                }
                data = {
                    "id": ret.id,
                    "caption": ret.caption,
                    "list": ret.list
                };
                if (aDoSlide == null){
                    aDoSlide = true;
                }
                //M1FormUtils.jumpLocked=true;
                update_homeUI(aDoSlide, data, aListType, aSearchValue);
            },
            error: function (ret) {
                cmp.dialog.loading(false);
                console.log(ret);
                if(ret.message&&(ret.message=="您无权限操作，请联系表单管理员"||ret.message=="You do not have permission to operate, contact form administrator"||ret.message=="您無權限操作，請聯繫表單管理員")){
                    cmp.notification.toast(cmp.i18n('formqueryreport.no_permission'), 'bottom', 5000);
                }
            }
        });
    }
}
function doSearch(aDoSlide, searchParams, aLeftReturnType, callback) {
    var fdata;
    var fParams = {
        "aId": searchParams.id,
        "aListType": searchParams.listtype,
        "aSearchConditons": searchParams.searchConditons,
        "userOrderBy": searchParams.userOrderBy,
        "isMobile": searchParams.isMobile,
        "pageSize": 20,
        "pageNo": M1FormUtils.total||1
    };
    if(tableContentListView) tableContentListView = undefined;
    $s.CapForm.searchForm({}, fParams, {
        success: function (ret) {
            M1FormUtils.jumpLocked=true;
            console.log(ret);
			if(searchParams.searchConditons&&searchParams.searchConditons.length>0){
				for(var u=0;u<searchParams.searchConditons.length;u++){
					ret.condition[u].display=searchParams.searchConditons[u].display||"";  
				}	
			}
			if(ret.data&&ret.data.crossMetadata){
                cmp.notification.toast(cmp.i18n('formqueryreport.not_support_cross_summary'), 'center', 2000);
            }
            if(ret.data&&ret.data.cutData){
                cmp.notification.toast(cmp.i18n('formqueryreport.only_show_hundred_rows'), 'center', 3000);
            }
            if(M1FormUtils.userOrderBy.length>0&&ret.sortFields){
                for(var h=0;h<M1FormUtils.userOrderBy.length;h++){
                    for(var g=0;g<ret.sortFields.length;g++){
                        if(ret.sortFields[g].fieldName==M1FormUtils.userOrderBy[h].fieldName){
                            ret.sortFields[g].type=M1FormUtils.userOrderBy[h].orderType;
                            break;
                        }
                    }
                }
            }
            if (typeof ret.id == "number") {
                ret.id = searchParams.id;
            }
            if (typeof ret.listtype == "number") {
                ret.listtype = searchParams.listtype;
            }

            fdata = ret;
            if (!searchParams.sortContent) {
                fdata.sortContent = "";
            } else {
                fdata.sortContent = searchParams.sortContent;
            }
            if (!searchParams.isRefreshPart) {
                fdata.isRefreshPart = false;
            } else {
                fdata.isRefreshPart = true;
            }
            if (!searchParams.isRefreshsortStatistics) {
                fdata.isRefreshsortStatistics = false;
            } else {
                fdata.isRefreshsortStatistics = true;
            }
            ret.userOrderBy = searchParams.userOrderBy;

            var homeContent=document.querySelector('.content');
            if(fdata.data&&homeContent){
                var searchStuff=document.querySelector("#cmp-segmented_title_content");
                if(searchStuff){
                    searchStuff.remove();
                }
                M1FormUtils.haveNotCondition=true;
                homeContent.remove();
                var refreshPart=document.createElement("div");
                refreshPart.setAttribute('id',"refreshPart");
                refreshPart.innerHTML='<div id="sortStatistics"></div><div  id="table-content" class="table-content cmp-scroll-wrapper"><div id="wrapper" class="wrapper cmp-scroll" ></div></div>';
                var homeFrameContent=document.querySelector('.FrameContent');
                homeFrameContent.appendChild(refreshPart);
                //不行就删
                fdata.isRefreshList=false;
                fdata.isRefreshPart=false;
            }
            var arr,obj,data=[],listResult={};
            if(fdata.data){
                for (var i = 0; i < ret.data.result.length; i++) {
                    if(ret.data.result[i] instanceof Array){
                        obj = {};
                        for (var j = 0; j < ret.data.metadata.length; j++) {
                            obj[j] = ret.data.result[i][j+1];
                        }
                        data.push(obj);

                    }else if(typeof ret.data.result[i]=="string"){
                        arr = ret.data.result[i].split(" ");
                        obj = {};
                        for (var j = 0; j < ret.data.metadata.length; j++) {
                            obj[j] = arr[j+1];
                        }
                        data.push(obj);
                    }
                }
                listResult.data=data;
                listResult.fields={};
                for(var n=0;n< ret.data.metadata.length;n++){
                    listResult.fields[n]=ret.data.metadata[n].title;
                }
            }
            if(searchParams.pullToRefresh){
                var pullResult = {};
                pullResult.aDoSlide = aDoSlide;
                pullResult.fdata = fdata;
                pullResult.aLeftReturnType = aLeftReturnType;
                pullResult.listResult=listResult;
                callback && callback(pullResult);
                return;
            }
            if(fdata.data) {
                M1FormUtils.isVertical = fdata.data.vertical;
            }
            if(fdata.data&&!searchParams.pullToRefresh){
                var result,table_content;
                table_content=document.querySelector('#table-content');
                if(!table_content){
                    M1FormUtils.isCrossBack=true;
                }else {
                    if(fdata.data.vertical){
                        if( cmp.storage.get(M1FormUtils.hasMobileViewKey, true)){
                            cmp.storage.delete(M1FormUtils.hasMobileViewKey, true);
                        }
                        var hasMobileView={HasMobileView:true};
                        cmp.storage.save(M1FormUtils.hasMobileViewKey, JSON.stringify(hasMobileView), true);
                        result = {};
                        result.aDoSlide = aDoSlide;
                        result.fdata = fdata;
                        result.aLeftReturnType = aLeftReturnType;
                        cmp.storage.save(M1FormUtils.searchResultKey, JSON.stringify(result), true);
                        if(cmp.tableList){
                            tableContentListView =createListview(result);
                        }else{
                            cmp.asyncLoad.js([listViewJSUrl + buildversion,tableListJSUrl + buildversion], function () {
                                tableContentListView =createListview(result);
                            });
                        }
                        return;
                    }else {
                        result = {};
                        result.aDoSlide = aDoSlide;
                        result.fdata = fdata;
                        result.aLeftReturnType = aLeftReturnType;
                        result.listResult=listResult;
                        cmp.storage.save(M1FormUtils.listResultKey, JSON.stringify(result), true);
                        fdata.isRefreshList = false;
                        fdata.isTableList=true;
                        if(cmp.tableList){
                            createTableList(result);
                        }else{
                            cmp.asyncLoad.js([listViewJSUrl + buildversion,tableListJSUrl + buildversion], function () {
                                createTableList(result);
                            });
                        }

                        return;
                    }
                }
            }
            update_searchUI(aDoSlide, fdata, aLeftReturnType);
        },
        error: function (ret) {
            console.log(ret);
            if(ret.message&&(ret.message=="您无权限操作，请联系表单管理员"||ret.message=="You do not have permission to operate, contact form administrator"||ret.message=="您無權限操作，請聯繫表單管理員")){
                cmp.notification.toast(cmp.i18n('formqueryreport.no_permission'), 'center', 5000);
            }
        }
    });
}
function createListview(result){
   return cmp.listView("#table-content", {
        config: {
            params: [{searchParams:result.fdata}, {ticket: "luodx"}],
            pageSize: 20,
            clearUI:true,
            onePageMaxNum: 20,
            crumbsID:(Math.floor(Math.random()*Math.pow(10,10)))+"",
            dataFunc: getListData,
            renderFunc: renderData,
            isClear: false
        },
        up: {contentdown:cmp.i18n('formqueryreport.Pull_up_shows_more'), contentrefresh:cmp.i18n('formqueryreport.loading'), contentnomore:cmp.i18n('formqueryreport.no_more_data')}
    });
}
function createTableList(result){
    cmp.tableList("#table-content", {
        fields: result.listResult.fields,
        params: [{searchParams:result.fdata}],
        theme:{
            headerStyle:"background:#dfe8ef;font-family: STHeitiSC-Medium;font-size: 16px;color: #718eaf;letter-spacing: 0.45px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap !important",//列表头部样式，以css字符串的形式
            //rowClass:"background: #FFFFFF;font-family: STHeitiSC-Light;font-size: 14px;color: #333333;letter-spacing: 0.4px;line-height: 18px"
            rowClass:"cmp-ellipsis-center-3 ellipsis-box"
        },
        //down: {contentdown: '下拉可以刷新', contentover: '释放立即刷新', contentrefresh: '正在刷新...'},
        up: {contentdown: cmp.i18n('formqueryreport.loading_more'), contentrefresh: cmp.i18n('formqueryreport.loading'), contentnomore: cmp.i18n('formqueryreport.no_more')},
        sidebarW: 0,
        headerH: 40,
        rowH: 60,
        dataFunc: dataFunc2,
        callback: function (result) {}
    });
}

function getShowFromData(aId, aQueryId, aCallBackFunc, headText) {
    var fParams = {
        "aId": aId,
        "aQueryId": aQueryId
    };
    var backPageInfo = {};
    backPageInfo.data = "";
    backPageInfo.url = "";
    $s.CapForm.getFormQueryViewParams({}, fParams, {
        success: function (ret) {
            console.log(ret);
            cmp.storage.save(M1FormUtils.HISKEY, JSON.stringify(Router.get_his()), true);
            if (1 == ret.moduleType) {
                var backPageInfo = {};
                var his = Router.get_his();
                backPageInfo.url = "";
                backPageInfo.data = his;
                collApi.jumpToColSummary(ret.summaryID, "formQuery", ret.operationID);
            } else {
                var options = {
                    name: headText,
                    moduleId: ret.moduleID,
                    moduleType: ret.moduleType,
                    rightId: ret.rightID,
                    viewState: '1'

                };
                cmp.openUnflowFormData(options);
            }
        },
        error: function (ret) {
            if ("string" == typeof ret) {
                if ("object" == typeof(JSON.parse(ret)) && (ret.message=='表单设置了不允许穿透！'||ret.message=='表單設置了不允許穿透！'||ret.message=='Form settings are not allowed to penetrate!')) {
                    cmp.notification.toast(cmp.i18n('formqueryreport.no_penetrate'), 'bottom', 1500);
                }
            } else if ("object" == typeof ret) {
                if (ret.message=='表单设置了不允许穿透！'||ret.message=='表單設置了不允許穿透！'||ret.message=='Form settings are not allowed to penetrate!') {
                    cmp.notification.toast(cmp.i18n('formqueryreport.no_penetrate'), 'bottom', 1500);
                }
            }
        }
    });
};
function showFromDetail(aData) {
    alert(JSON.stringify(aData));
};
