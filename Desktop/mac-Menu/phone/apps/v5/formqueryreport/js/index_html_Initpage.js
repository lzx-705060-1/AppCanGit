/**
 * Created by Administrator on 2017-1-25.
 * 2017-1-25:when I wrote these code,Only the God and me understood What does it do;
 * 2017-2-17:Now , Only God knows;
 */
var dateControlList = [];
var fCurrentScorll = null;
isShowPcForm = false;
var M1FormUtils = {
    his: [],
    //是否是从M3导航条点击进入的
    isFromM3Navbar:false,
//是否是从M3导航条点击进入打开的新页面
    isFromM3NavbarOpenWebview:false,
    //当前是否是从看板跳过来的
    isFromBoard:false,
    //当前是否是DataRelation跳转过来的
    isFromDataRelation:false,
    //DataRelation跳转过来的传的条件参数
    dataRelationCdtn:[],
    history: [],
    //防止连续点击列表或返回按钮，出现页面混乱
    jumpLocked:true,
    fromMode:"",
	//如果是看板或业务菜单跳转
    hashUrl:"",
    hasMobileViewKey:"seeyon_m3_app_v5_formqueryreport_hasMobileViewKey",
    isVertical:null,
    searchConditons:[],
    userOrderBy:[],
    filterArrKey :"seeyon_m3_app_v5_formqueryreport_filterArrKey",
	userOrderBystorage:[],
    sortItem:{},
	sortContent:{},
    isReportChart: false,
    HISKEY: "seeyon_m3_app_v5_formqueryreport_his",
    listResultKey: "seeyon_m3_app_v5_formqueryreport_listResultKey",
    searchResultKey: "seeyon_m3_app_v5_formqueryreport_searchResultKey",
    ConditionAndSortDataKey: "seeyon_m3_app_v5_formqueryreport_ConditionAndSortDataKey",
    isJumpToFormqueryreport: false,
    KEY: "seeyon_m3_app_v5_formqueryreport",
    isSearch: false,
    //判断是否没有查询条件直接就有data
    haveNotCondition: false,
    isJumpToFormqueryreportKEY: "seeyon_m3_app_v5_formqueryreport_isJumpToFormqueryreport",
    C_iResultColunmCount: 3,
    C_iFormType_State: 0,
    C_iFormType_Search: 1,
    C_iFormType_Apply: 2,
    C_iListType_Dir: 0,
    C_iListType_Sreach: 1,
    C_iListType_Statistics: 2,
    C_iConditionType_Input: 0, // 文本框                input            text
    C_iConditionType_Checkbox: 1, // 复选框             select           checkbox
    C_iConditionType_Select: 2,// 下拉框                select           select
    C_iConditionType_Persion: 3,//单选人员               organization    person
    C_iConditionType_Textarea: 4,// 文本域               input           textArea
    C_iConditionType_Radio: 5, // 单选按钮               select           radio
    C_iConditionType_Date: 6, // 日期控件                timeSpan         date
    C_iConditionType_Datetime: 7, // 日期时间控件         timeSpan         dateTime
    C_iConditionType_Account: 8, // 选择单位             organization     account
    C_iConditionType_Department: 9, // 选择部门          organization     department
    C_iConditionType_Post: 10, // 选择岗位               organization     post
    C_iConditionType_Level: 11, // 选择职务级别           organization     level
    C_iConditionType_Multipersion: 12, // 选择多人       organization     multiperson
    C_iConditionType_Multiaccount: 13, // 选择多单位     organization     multiaccount
    C_iConditionType_Multidepartment: 14, // 选择多部门  organization     multidepartment
    C_iConditionType_Multipost: 15, // 选择多岗位        organization     multipost
    C_iConditionType_Multilevel: 16, // 选择多职务级别    organization     multilevel
    C_iConditionType_Project: 17, // 选择关联项目        project           project
    C_iConditionType_Relationform: 18, // 选择关联表单
    C_iConditionType_DEETask: 19, //选择数据交换任务
    C_iConditionType_DEEControlTask: 20, //查询控件交换引擎任务
    C_iAlign_Left: 0,
    C_iAlign_Center: 1,
    C_iAlign_Right: 2,
    isSearchList: false,
    total: 1
};

M1FormUtils.isHome = function (aType) {
    return aType == M1FormUtils.C_iFormType_State;
};

M1FormUtils.getWindowsHeight = function () {
    return CMPFULLSREENHEIGHT;
};

M1FormUtils.isDir = function (aType) {
    return aType == M1FormUtils.C_iListType_Dir;
};
M1FormUtils.isStatistics = function (aType) {
    if (aType == null)
        return true;
    return aType == M1FormUtils.C_iListType_Statistics;
};

M1FormUtils.canSupportConditionName = function (aConditionType) {
    switch (aConditionType) {
        case M1FormUtils.C_iConditionType_Input:
        case M1FormUtils.C_iConditionType_Checkbox:
        case M1FormUtils.C_iConditionType_Select:
        case M1FormUtils.C_iConditionType_Radio:
        case M1FormUtils.C_iConditionType_Textarea:

        case M1FormUtils.C_iConditionType_Persion:
        case M1FormUtils.C_iConditionType_Account:
        case M1FormUtils.C_iConditionType_Department:
        case M1FormUtils.C_iConditionType_Post:
        case M1FormUtils.C_iConditionType_Level:
        case M1FormUtils.C_iConditionType_Multipersion:
        case M1FormUtils.C_iConditionType_Multiaccount:
        case M1FormUtils.C_iConditionType_Multidepartment:
        case M1FormUtils.C_iConditionType_Multipost:
        case M1FormUtils.C_iConditionType_Multilevel:
        case M1FormUtils.C_iConditionType_Date:
        case M1FormUtils.C_iConditionType_Datetime:
        case M1FormUtils.C_iConditionType_Relationform:
        case M1FormUtils.C_iConditionType_Project:
            return true;

        case M1FormUtils.C_iConditionType_DEETask:
        case M1FormUtils.C_iConditionType_DEEControlTask:
        default:
            return false;

    }
};
M1FormUtils.getFilterArray = function (condition) {
    var resultArr = [],
        ctype;
    for (var i = 0; i < condition.length; i++) {
        if (typeof condition[i].ctype == 'string') {
            ctype = Number(condition[i].ctype);
        } else {
            ctype = condition[i].ctype;
        }
        switch (ctype) {
            case 0:
            case 4:
                resultArr[i] = {
                    filterType: 'input',
                    fieldName: condition[i].fieldName,
                    title: condition[i].ctitle,
                    name:condition[i].cname,
                    inputType: condition[i].inputType,
                    value: condition[i].cvalue,
					display:condition[i].display||""
                };
                break;
            case 1:
            case 2:
            case 5:
                if (!condition[i].datalist.list[0].name && !condition[i].datalist.list[0].value) {
                    condition[i].datalist.list.splice(0, 1)
                }
                resultArr[i] = {
                    filterType: 'select',
                    fieldName: condition[i].fieldName,
                    title: condition[i].ctitle,
                    name:condition[i].cname,
                    inputType: condition[i].inputType,
                    value: condition[i].cvalue,
                    items: ctype!==1?condition[i].datalist.list:[{'value':'1','name':cmp.i18n('formqueryreport.selected')},{'value':'0','name':cmp.i18n('formqueryreport.unselected')}],
                    display:condition[i].display||""
                };

                break;
            case 3:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
                resultArr[i] = {
                    filterType: 'organization',
                    fieldName: condition[i].fieldName,
                    title: condition[i].ctitle,
                    name:condition[i].cname,
                    inputType: condition[i].inputType,
                    externalType: condition[i].externalType, 
                    value: condition[i].cvalue,
					display:condition[i].display||""
                };
                break;
            case 6:
            case 7:
                resultArr[i] = {
                    filterType: 'time',
                    fieldName: condition[i].fieldName,
                    title: condition[i].ctitle,
                    name:condition[i].cname,
                    inputType: condition[i].inputType,
                    value: condition[i].cvalue,
					display:condition[i].display||""
                };
                break;
            case 17:
                resultArr[i] = {
                    filterType: 'project',
                    fieldName: condition[i].fieldName,
                    title: condition[i].ctitle,
                    name:condition[i].cname,
                    inputType: 'project',
                    value: condition[i].cvalue,
					display:condition[i].display||""
                };
                break;
        }
    }
    return resultArr;
};

M1FormUtils.getConditionName = function (aConditionType) {
    switch (aConditionType) {
        case M1FormUtils.C_iConditionType_Input:
            return cmp.i18n("formqueryreport.condition_input");
        case M1FormUtils.C_iConditionType_Checkbox:
            return cmp.i18n("formqueryreport.condition_checkbox");
        case M1FormUtils.C_iConditionType_Select:
            return cmp.i18n("formqueryreport.condition_select");
        case M1FormUtils.C_iConditionType_Persion:
            return cmp.i18n("formqueryreport.condition_persion");
        case M1FormUtils.C_iConditionType_Textarea:
            return cmp.i18n("formqueryreport.condition_textarea");
        case M1FormUtils.C_iConditionType_Radio:
            return cmp.i18n("formqueryreport.condition_radio");
        case M1FormUtils.C_iConditionType_Date:
            return cmp.i18n("formqueryreport.condition_date");
        case M1FormUtils.C_iConditionType_Datetime:
            return cmp.i18n("formqueryreport.condition_datetime");
        case M1FormUtils.C_iConditionType_Account:
            return cmp.i18n("formqueryreport.condition_account");
        case M1FormUtils.C_iConditionType_Department:
            return cmp.i18n("formqueryreport.condition_department");
        case M1FormUtils.C_iConditionType_Post:
            return cmp.i18n("formqueryreport.condition_post");
        case M1FormUtils.C_iConditionType_Level:
            return cmp.i18n("formqueryreport.condition_level");
        case M1FormUtils.C_iConditionType_Multipersion:
            return cmp.i18n("formqueryreport.condition_multipersion");
        case M1FormUtils.C_iConditionType_Multiaccount:
            return cmp.i18n("formqueryreport.condition_multiaccount");
        case M1FormUtils.C_iConditionType_Multidepartment:
            return cmp.i18n("formqueryreport.condition_multidepartment");
        case M1FormUtils.C_iConditionType_Multipost:
            return cmp.i18n("formqueryreport.condition_multipost");
        case M1FormUtils.C_iConditionType_Multilevel:
            return cmp.i18n("formqueryreport.condition_multilevel");
        case M1FormUtils.C_iConditionType_Project:
            return cmp.i18n("formqueryreport.condition_project");
        case M1FormUtils.C_iConditionType_Relationform:
            return cmp.i18n("formqueryreport.condition_relationform");
        case M1FormUtils.C_iConditionType_DEETask:
            return cmp.i18n("formqueryreport.condition_deetask");
        case M1FormUtils.C_iConditionType_DEEControlTask:
            return cmp.i18n("formqueryreport.condition_deecontroltask");

    }
};

function parseStorageData() {
    if (cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)) {
        return JSON.parse(cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true));
    }
    return "";
}


function dataLength(fData) {
    var result = 0;
    if (fData == null) return result;
    if (fData.length == undefined) return result;
    for (var i = 0; i < fData.length; i++) {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)) {
            result += 2;
        } else {
            result += 1;
        }
    }
    return result;
};

function getDataTDHeight(aLength) {
    //td行高60px,每行9个字节
    var line_height = 60;
    if (aLength > 18 && aLength < 35)
        return line_height / 2;
    else if (aLength > 35)
        return line_height / 3;
    return line_height;
};

function NativePersion2JSonPersion(aData) {
    var result;
    result = [];
    for (var i = 0; i < aData.length; i++) {
        result.push(
            {
                orgID: aData[i].orgID,
                name: aData[i].name,
                type: aData[i].type
            }
        );
    }
    return result;
}
function decodePersonInfo(aStr) {
    if (aStr == null)
        return [];
    if (isBlank(aStr))
        return [];
    try {
        JSON.parse(aStr);
    } catch (e) {
        return [];
    }
    return JSON.parse(aStr);
};
function ecodePersonInfo(aData) {
    if (aData == null) return "[]";
    return JSON.stringify(aData);
};
function isCheckedValue(aArray, aValue) {
    if (aArray == null) return false;
    if (!isArray(aArray)) return false;
    if (aArray.length <= 0) return false;
    var fItem;
    for (var i = 0; i < aArray.length; i++) {
        fItem = aArray[i];
        if (fItem == aValue)
            return true;
    }
    return false;
}
function startWith(aSource, aStart) {
    //var reg = new RegExp("^" + aStart);
    var reg = new RegExp(aStart);
    return reg.test(aSource);
};

function regWith(aSource, aStart) {
    var reg = new RegExp(aStart);
    return reg.test(aSource);
};

function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
};
function trim(aStr) {
    return aStr.replace(/(^\s+)|(\s+$)/g, '');
};
function outerror(aMsg) {
    if (console == null) return;
    console.error(aMsg);
};
function outdebug(aMsg) {
    if (console == null) return;
    //console.debug(aMsg);
};
function isBlank(aStr) {
    if (aStr == null)
        return true;
    if (trim(aStr) == "")
        return true;
    return false;
};
function isString(aStr) {
    if (aStr == null)
        return true;
    if (typeof aStr == "string")
        return true;
    return false;
};

// 页面初始化方法
function initReprotPage() {
    // 设置地址路由分发
    Router.set_routes([
        ["^#*$", home],
        ["#state(?:\/*)([^\/]*)(?:\/*)(.*)", home],
        ["#dosearch(?:\/*)([^\/]*)(?:\/*)(.*)", search],
        ["#dostatistics(?:\/*)([^\/]*)(?:\/*)(.*)", statistics],
//		    [ "#formReport(?:\/*)([^\/]*)(?:\/*)(.*)", getFormReport ],
        ["#reportChart(?:\/*)([^\/]*)(?:\/*)(.*)", getReportChart]]);
    Router.set_ignore("^#http(:?%3A|\:)");
    // 检测当前地址 并加载数据
    if(M1FormUtils.hashUrl){
        Router.check_url(M1FormUtils.hashUrl);
    }else {
        Router.check_url();
    }
};

function getElementoffsetHeight(aId) {
    var fItem;
    fItem = document.querySelector(aId);
    if (fItem == null)
        return 0;
    return fItem.offsetHeight;
};
function getHeadArrayHeight(aHeadArray) {
    var result;
    result = 0;
    if (aHeadArray != null) {
        if (typeof aHeadArray == "string")
            result = getElementoffsetHeight(aHeadArray);
        else {
            for (i = 0; i < aHeadArray.length; i++) {
                result += getElementoffsetHeight(aHeadArray[i]);
            }
        }
    }
    return result;
};
function setHeaddArrayHeight(aWarpName, aHeightArray) {
    var fWrapper;
    fWrapper = document.querySelector(aWarpName);
    if (fWrapper == null)
        return;
    var fHeight = getHeadArrayHeight(aHeightArray);
    fWrapper.style.height = (window.innerHeight - fHeight) + "px";
};

function setHeaddArrayTop(aWarpName, aTopArray, aHeightArray) {
    var fWrapper;
    fWrapper = document.querySelector(aWarpName);
    if (fWrapper == null)
        return;
    var fTop = getHeadArrayHeight(aTopArray);
    fWrapper.style.top = fTop + "px";
};
function newiScroll(aWarpName, aParam) {
    var fWrapper;
    fWrapper = document.querySelector(aWarpName);
    if (fWrapper == null)
        return null;

    var myScroll;
    if (aParam == null)
        myScroll = new cmp.iScroll(aWarpName, {
            hScroll: false,
            vScroll: true,
            bounce: false
        });
    else
        myScroll = new cmp.iScroll(aWarpName, aParam);
    myScroll.refresh();
    return myScroll;
};

function newiScroll5(aWarpName, aParam) {
    var fWrapper;
    fWrapper = document.querySelector(aWarpName);
    if (fWrapper == null)
        return null;

    var myScroll;
    if (aParam == null)
        myScroll = new IScroll(aWarpName, {
            mouseWheel: true,
            tap: hasTouch,
            click: hasClick,
            scrollbars: false,
            eventPassthrough: true,
            scrollX: false,
            scrollY: true
        });
    else
        myScroll = new IScroll(aWarpName, aParam);
    myScroll.refresh();
    return myScroll;
};

//删
function refreshHeader(aPageData) {
    var fRightIcon, fSearchvertical, fHasData, aListType, aAllowFlip, insertText, header, aChartNameList, header_right;
    fHasData = (aPageData.data != null);
    if (!fHasData) return;
    insertText = "";
    aAllowFlip = aPageData.vertical;
    aListType = aPageData.listtype;
    fSearchvertical = aPageData.searchvertical == null ? aPageData.vertical : aPageData.searchvertical;
    fRightIcon = fSearchvertical ? "see-icon-v5-common-switch-light-form" : "see-icon-v5-common-transverse-switch";
    header = document.querySelector('#header');
    header_right = document.querySelectorAll('.header_right.right_list_link');

    if (aPageData.reportdata != null) {
        aChartNameList = aPageData.reportdata.chartNameList;
    } else {
        aChartNameList = null;
    }

    if (aListType == M1FormUtils.C_iListType_Sreach) {
        if (aAllowFlip||cmp.storage.get(M1FormUtils.hasMobileViewKey, true)){
            if (header_right) {
                for(var g=0;g<header_right.length;g++){
                    header_right[g].remove();
                }
            }
            insertText = '<div class="header_right right_list_link cmp-header-right nav-icon-one" onclick="showsearchFlip();"> ' +
                '<span class="icon cmp-icon iconfont_blue ' + fRightIcon + '"></span> ' +
                '</div>';
        }
    } else {
        if (header_right) {
            //header_right.remove();
            for(var h=0;h<header_right.length;h++){
                header_right[h].remove();
            }
        }
        insertText = '<div class="header_right right_list_link cmp-header-right nav-icon-one">';
        if (aChartNameList != null && aChartNameList.length > 0) {
            insertText += '<span class="cmp-icon iconfont_blue see-icon-v5-common-summaryGraph"></span> ' +
                '<div class="chart_select" style="width:150px;">';
            for (var i = 0; i < aChartNameList.length; i++) {
                insertText += '<div class="chart_select_item" rel="reportChart/' + i + '">' + aChartNameList[i] + '</div>'
            }
            insertText += '</div>';
        }
        insertText += '</div>';
    }
    header.innerHTML += insertText;
}

function getRelParam(u, aIndex) {
    if (u == null)
        return null;
    if (!isArray(u))
        return null;
    var fArray;
    fArray = u.input.split("/");
    if (fArray.length <= aIndex)
        return null;
    return fArray[aIndex];
};

function renderData(result, isRefresh) {
    var aDoSlide, aData, aLeftReturnType;
    console.log(result);
    //var table = document.getElementsByTagName('ul')[0];
    var aResult;
    if (JSON.parse(cmp.storage.get("searchResult", true))) {
        aResult = JSON.parse(cmp.storage.get("searchResult", true));
        cmp.storage.delete("searchResult", true);
    } else if (JSON.parse(cmp.storage.get("pullResult", true))) {
        aResult = JSON.parse(cmp.storage.get("pullResult", true));
        cmp.storage.delete("pullResult", true);
    } else {
        return;
    }
    if (aResult) {
        aDoSlide = aResult.aDoSlide;
        aData = aResult.fdata;
        aLeftReturnType = aResult.aLeftReturnType;
        aData.isTableList = false;
        aData.renderList = true;
        aData.isListView = true;
    }
    update_searchUI(aDoSlide, aData, aLeftReturnType);
}
function getListData(_body, param, obj) {
    var pageNo = param["pageNo"];
    var pageSize = param["pageSize"];
    var ticket = param["ticket"];
    var searchParams;
    var success = obj.success;
    var result = {};
    var moreData;
    result.data = [];
    M1FormUtils.total=param.pageNo;

    //首次调用
    if (cmp.storage.get(M1FormUtils.searchResultKey, true)) {
        searchParams = JSON.parse(cmp.storage.get(M1FormUtils.searchResultKey, true));
        cmp.storage.delete(M1FormUtils.searchResultKey, true);
        result.data = searchParams.fdata.data.result;
        result.userData = searchParams;
        moreData = searchParams.fdata.data.moredata || 0;
        if(typeof moreData=="string"){
            moreData=Number(moreData);
        }
        result.total = searchParams.fdata.data.result.length + moreData;
        cmp.storage.save("searchResult", JSON.stringify(result.userData), true);
        if(pageNo==1&&searchParams.fdata.data.result&&searchParams.fdata.data.result.length==0){
            renderData(result.data)
        }
        success(result);
    } else {//刷新调用
        searchParams = _body;
        var aSearchParams = {};
        aSearchParams.id = searchParams.searchParams.id;
        aSearchParams.listtype = searchParams.searchParams.listtype;
        aSearchParams.searchConditons = searchParams.searchParams.condition;
        aSearchParams.isMobile = searchParams.searchParams.data.vertical;
        aSearchParams.isRefreshPart = true;
        aSearchParams.isRefreshsortStatistics = true;
        aSearchParams.userOrderBy = [];
        aSearchParams.pullToRefresh = true;
        doSearch(false, aSearchParams, "", function (res) {
            result.data = res.fdata.data.result;
            result.userData = res.fdata;
            moreData = 0 || res.fdata.data.moredata;
            if(typeof moreData=="string"){
                moreData=Number(moreData);
            }
            result.total = res.fdata.data.result.length + moreData;
            cmp.storage.save("pullResult", JSON.stringify(res), true);
            success(result);
        });
    }
}
function dataFunc2(param, options) { //获取数据的方法
    var aDoSlide, aData, aLeftReturnType;

    var result = cmp.storage.get(M1FormUtils.listResultKey, true);
    M1FormUtils.total = param.pageNo;
    if (result) {
        //M1FormUtils.total=1;
        result = JSON.parse(cmp.storage.get(M1FormUtils.listResultKey, true));
        cmp.storage.delete(M1FormUtils.listResultKey, true);
        aDoSlide = result.aDoSlide;
        aData = result.fdata;
        aLeftReturnType = result.aLeftReturnType;
        aData.isTableList = true;
        aData.renderList = true;
        var aResult = result.listResult;
        var moredata = result.fdata.data.moredata || 0;
        if(typeof moredata=="string"){
            moredata=Number(moredata);
        }
        aResult.total = result.fdata.data.result.length + moredata;
        var success = options.success; //将options中的success取出来（该success是组件内部的方法）
        success(aResult);//执行组件内部的success方法
        update_searchUI(aDoSlide, aData, aLeftReturnType, function () {});

    } else {
        var aSearchParams = {};
        aSearchParams.id = param.searchParams.id;
        aSearchParams.listtype = param.searchParams.listtype;
        aSearchParams.searchConditons = param.searchParams.condition;
        aSearchParams.isMobile = param.searchParams.data.vertical;
        aSearchParams.isRefreshPart = true;
        aSearchParams.isRefreshsortStatistics = true;
        aSearchParams.userOrderBy = [];
        aSearchParams.pullToRefresh = true;
        doSearch(false, aSearchParams, "", function (res) {
            aDoSlide = res.aDoSlide;
            aData = res.fdata;
            aLeftReturnType = res.aLeftReturnType;
            aData.isTableList = true;
            aData.renderList = true;
            aData.isListView = false;
            var aResult = res.listResult;
            var moredata = res.fdata.data.moredata || 0;
            if(typeof moredata=="string"){
                moredata=Number(moredata);
            }
            aResult.total = res.fdata.data.result.length + moredata;
            var success = options.success; //将options中的success取出来（该success是组件内部的方法）
            success(aResult);
            update_searchUI(aDoSlide, aData, aLeftReturnType, function () {
            });
        });
    }
}
function M3NavBack() {
    cmp.href.closePage();
}
function home(u) {
    if(M1FormUtils.isFromM3Navbar&&u[0]!=='#'){
        M1FormUtils.jumpLocked=true;
        cmp.href.open('http://formqueryreport.v5.cmp/v/html/index.html'+u[0]+'?from="m3Navbar"');
        return;
    }
    if(M1FormUtils.isFromM3NavbarOpenWebview){
        cmp.backbutton.pop();
        cmp.backbutton();
        cmp.backbutton.push(M3NavBack);
       // cmp.backbutton.push(cmp.href.back);
    }else {
        if(M1FormUtils.isFromM3Navbar){
            cmp.backbutton.push(cmp.closeM3App)
        }else {
            if (!getRelParam(u, 1)) {
                //OA-157117
                cmp.backbutton.pop();
                cmp.backbutton();
                //OA-157117
                cmp.backbutton.push(cmp.href.back)
            } else {
                cmp.backbutton.push(backHashHistory);
            }
        }

    }

    var fSearch, fId, fSearchValue;
    fSearch = getRelParam(u, 1)||window.location.hash.split('/')[1];
    fId = getRelParam(u, 2);
    if (fId == "")
        fId = null;
    fSearchValue = getRelParam(u, 3);
    if (fSearchValue == "") {
        fSearchValue = null;
    }
    doHome(fSearch, fId, fSearchValue);
};
function search(u) {
    cmp.backbutton.pop();
    if(M1FormUtils.isFromM3NavbarOpenWebview){
        cmp.backbutton.push(function () {
            $('.sui-filter-wrapper').remove();
            document.getElementById("title-more").style.display="none";
            backHashHistory();
        });
    }else {
        if(M1FormUtils.isFromBoard){
            if(M1FormUtils.fromMode){
                if(M1FormUtils.fromMode.indexOf('dashboard')!= -1||M1FormUtils.fromMode === "dataRelation&cmphistoryuuid"||M1FormUtils.fromMode==="dataRelation"||M1FormUtils.fromMode.indexOf('veport')!==-1||M1FormUtils.fromMode.indexOf('biz')!==-1){
                    cmp.backbutton.push(cmp.href.back);
                }else {
                    cmp.backbutton.push(cmp.href.closePage);
                }
            }else{
                cmp.backbutton.push(cmp.href.closePage);
            }
        }else {
            cmp.backbutton.push(function () {
                $('.sui-filter-wrapper').remove();
                document.getElementById("title-more").style.display="none";
                backHashHistory();
            });
        }
    }

    $('.sui-filter-wrapper').remove();
    var fId, fListType, fCondition, fLeftReturnType, aStorageData, searchParams = {};
    fListType = getRelParam(u, 1);
    fId = getRelParam(u, 2);
    fCondition = getRelParam(u, 3);
    fLeftReturnType = getRelParam(u, 4);
    if (fCondition != null) {
        try {
            fCondition = decodeURI(fCondition);
            fCondition = JSON.parse(fCondition);
        } catch (e) {
            fCondition = null;
        }
    }
    if (isBlank(fId))
        alert("not found Id!");
    if (isBlank(fListType))
        alert("not found listtype!");
    if(fId.indexOf('?')>0)
        fId=fId.split("?")[0];
    aStorageData = parseStorageData();
        searchParams.id = fId;
        searchParams.listtype = fListType;
        searchParams.searchConditons = aStorageData ? aStorageData.conditon : fCondition;

        searchParams.userOrderBy = aStorageData ? aStorageData.userOrderBy : [];

        if(aStorageData){
            M1FormUtils.userOrderBystorage=searchParams.userOrderBy;
            M1FormUtils.sortContent=aStorageData.sortContent;
            searchParams.isMobile = aStorageData.data.vertical?true:false;
        }
        searchParams.isRefreshPart = false;
        searchParams.isRefreshsortStatistics = true;
        searchParams.sortContent = aStorageData ? aStorageData.sortContent : "";

    doSearch(true, searchParams, fLeftReturnType);
};
function statistics(u) {
    search(u);
};
function tapInputEvent() {
    document.querySelector('#cmpinputrow').classList.add('cmp-active');
    document.querySelector('.cmp-content-title-search').style.paddingLeft = "10px";
    document.querySelector('.cmp-content-title-search').style.paddingRight = "0px";
    document.querySelector('.search-title-cancel').style.display = "inline-block";
}
/**
 * 主页加载显示
 */
function update_homeUI(aDoSlide, aData, aListType, aInputValue) {

    if (aData == null) {
        document.querySelector("#loading").style.display = "none";
        return;
    }
    var ftemp;
    ftemp = aData;
    if (aData.caption == null){
        aData.caption = cmp.i18n("formqueryreport.string_formtitle");
    }else {
        setTitle(aData.caption);
    }
    //var fFieldWidth;
    M1FormUtils.searchleftreturntypeid = null;
    M1FormUtils.searchvertical = null;
    var aPageData = {
        id: aData.id,
        pagetype: M1FormUtils.C_iFormType_State,
        headtext: aData.caption,
        listtype: aListType,
        inputvalue: aInputValue,
        formlist: aData.list,
        isM3Navbar:M1FormUtils.isFromM3Navbar
    };
    ftemp = trim(formqueryreport.HomePageContainer(aPageData));
    var fNowFunc = function () {
        if (M1FormUtils.isSearch) {
            tapInputEvent();
            M1FormUtils.isSearch = false;
        }

        if (0 < M1FormUtils.his.length) {
            Router.set_his(M1FormUtils.his);
            M1FormUtils.his = [];
        }
        setHeaddArrayTop('#home_wrapper', ['#cmp-segmented-control', '#cmp-segmented_title_content']);
        var search = document.querySelector('#searchvalueinput');
        if (search != null) {
            if (search.value && !document.querySelector('#cmpinputrow').classList.contains('cmp-active')) {
                tapInputEvent();
            }
            search.addEventListener('search', onSearchInputSubmit, false);
        }
        M1FormUtils.jumpLocked=true;
    };
    if (!aDoSlide) {
        Frame_From = 'center';
    }
    slide_in(ftemp, Frame_From, ".frame", fNowFunc, false);
    document.querySelector("#loading").style.display = "none";
    homeUiAddTapListener(aPageData);
};
function homeUiAddTapListener(aPageData) {
    if(null!==document.querySelector('.left_menu_back')){
        if(M1FormUtils.isFromM3Navbar){
            var menuBack=document.querySelector('.left_menu_back');
            menuBack.classList.remove('left_menu_back');
        }
    }

    if (null != document.getElementById("formControlSearch")) {
        cmp.event.click(document.getElementById("formControlSearch"), function () {
            doHome_table(M1FormUtils.C_iListType_Statistics, null, false);
        });
    }
    if (null != document.getElementById("formControlStatistics")) {
        cmp.event.click(document.getElementById("formControlStatistics"), function () {
            doHome_table(M1FormUtils.C_iListType_Sreach, null, false);
        });
    }

    if (null != document.querySelector('.clear')) {
        cmp.event.click(document.querySelector('.clear'), function () {
            clearSearchInput();
        });
    }
    if (null != document.querySelector('#searchvalueinput') && null != document.querySelector('#cmpinputrow')) {
        document.querySelector('#cmpinputrow').addEventListener('tap', function () {
            tapInputEvent();
            document.querySelector('#searchvalueinput').focus();
            if(document.querySelector('#searchvalueinput')&&document.querySelector('#searchvalueinput').value){
                document.querySelector('.cmp-icon-clear').style.cssText = "display:block";
            }
        });
    }

    if (null != document.querySelector('.search-title-cancel') && null != document.querySelector('#cmpinputrow')) {
        document.querySelector('.search-title-cancel').addEventListener('tap', function () {
            document.querySelector('#cmpinputrow').classList.remove('cmp-active');
            if (document.querySelector('#searchvalueinput')) {
                document.querySelector('.cmp-content-title-search').style.padding = "0 10px";
                document.querySelector('#searchvalueinput').blur();
                document.querySelector('#searchvalueinput').value = "";
                document.querySelector('.cmp-icon-clear').style.cssText = "display:none";
                document.querySelector('.search-title-cancel').style.display = "none";
            }
            Frame_From = 'center';
            doHome(aPageData.listtype, aPageData.id, null);
        })
    }
    if (document.querySelector('#searchvalueinput')) {
        document.querySelector('#searchvalueinput').addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                M1FormUtils.isSearch = true;
            }
        }, false);
    }
    if (null != document.querySelector('#searchvalueinput')) {
        document.querySelector('#searchvalueinput').addEventListener('input', function () {
            document.querySelector('.cmp-icon-clear').style.cssText = "display:block";
        });
    }
}
function showsearchFlip() {
    var fData, isAcross, searchParams = {}, switcher,shutter;
    shutter=document.querySelector('.cmp-backdrop.cmp_bomb_box_backdrop');
    switcher = document.querySelector(".header_right .icon.cmp-icon");
    isAcross = switcher.classList.contains('see-icon-v5-common-transverse-switch');
    fData = M1FormUtils.searchdata;
    if (fData == null) {
        alert("not push search data!");
        exit;
    }
    if(shutter){
        shutter.remove();
    }
    var pveContent=document.querySelector('#table-content');
    if(pveContent){
        pveContent.remove();
        var newContent=document.createElement("div");
        newContent.setAttribute('id',"table-content");
        if(fData.data.vertical==true){
            newContent.innerHTML='<div id="wrapper" class="wrapper cmp-scroll" ></div>';
        }else if(fData.data.vertical==false){
        newContent.innerHTML='<div id="wrapper" class="wrapper cmp-scroll" ><div class="FlowForm_view  user_select"><ul></ul></div></div>';
        }
        var refreshPart=document.querySelector('#refreshPart');
        refreshPart.appendChild(newContent);
    }
	
    searchParams.id = fData.id;
    searchParams.listtype = fData.listtype;
    searchParams.searchConditons =fData.condition.length==0?null:M1FormUtils.searchConditons.length!=0?M1FormUtils.searchConditons:fData.condition;
    searchParams.userOrderBy = M1FormUtils.userOrderBystorage||[];
    searchParams.sortContent = M1FormUtils.sortContent.sort?M1FormUtils.sortContent:"";
    searchParams.isRefreshPart = true;
    searchParams.isRefreshsortStatistics = true;
    if (isAcross) {
        searchParams.isMobile = true;
        switcher.className = "icon cmp-icon iconfont_blue see-icon-v5-common-switch-light-form"
    } else {
        searchParams.isMobile = false;
        switcher.className = "icon cmp-icon iconfont_blue see-icon-v5-common-transverse-switch"
    }

    if (fData.data.searchvertical == null) {
        M1FormUtils.searchvertical = !fData.data.vertical;
    } else {
        M1FormUtils.searchvertical = !fData.data.searchvertical;
    }
    M1FormUtils.searchverticalid = fData.id;
    M1FormUtils.total=1;
    doSearch(false, searchParams, M1FormUtils.searchleftreturntype);
};
/**
 * 查询结果加载显示
 */
function getColunmWidth(aData) {
    var fColunmWidth;
    var fColunmMaxCount = M1FormUtils.C_iResultColunmCount;
    if (aData.data && aData.data.metadata && aData.data.metadata.length)
        if (aData.data.metadata.length < fColunmMaxCount)
            fColunmMaxCount = aData.data.metadata.length;
    fColunmWidth = Math.round(window.innerWidth / fColunmMaxCount);
    return fColunmWidth;
}
function setTitle(str) {
    document.title = str;
}
function update_searchUI(aDoSlide, aData, aLeftReturnType, callback) {
    if (aData == null) {
        document.querySelector("#loading").style.display = "none";
        return;
    }
    var ftemp, filterArr = [];
    ftemp = aData;
    setTitle(aData.caption);
    filterArr = M1FormUtils.getFilterArray(aData.condition);
    if (aData.caption == null)
        aData.caption = cmp.i18n("formqueryreport.string_formtitle");
    var fColunmWidth = getColunmWidth(aData);

    M1FormUtils.searchdata = null;
    M1FormUtils.searchleftreturntype = isBlank(aLeftReturnType) ? M1FormUtils.searchleftreturntype : aLeftReturnType;
    if (aData.listtype == M1FormUtils.C_iListType_Sreach) {
        //将现有数据压入内存,在查询结果做横向和纵向显示时使用
        M1FormUtils.searchdata = aData;
        if (aData.data != null)
            if (M1FormUtils.searchverticalid == aData.id)
                if (M1FormUtils.searchvertical != null) {
                    aData.data.searchvertical = M1FormUtils.searchvertical;
                }
    }
    var currentListCount;
    if(aData.data){
        var moredata=aData.data.moredata||0;
        if(typeof moredata == "string"){
            moredata=Number(moredata);
        }
        if(M1FormUtils.total>1&&aData.data.result.length<20){
            currentListCount=20+moredata;
        }else{
            currentListCount=aData.data.result.length+moredata;
        }
    }
    var aPageData = {
        id: aData.id,
        listtype: aData.listtype,
        colunmwidth: fColunmWidth,
        scrollerwidth: window.innerWidth,
        headtext: aData.caption,
        conditon: aData.condition,
        reportdata: aData.reportdata,
        leftreturntype: M1FormUtils.searchleftreturntype,
        data: aData.data,
        sortFields: aData.sortFields,
        sortContent: aData.sortContent,
        isRefreshPart: aData.isRefreshPart,
        isRefreshsortStatistics: aData.isRefreshsortStatistics,
        filterArr: filterArr,
        userOrderBy: aData.userOrderBy,
        isRefreshList: aData.isRefreshList,
        isTableList: aData.isTableList,
        renderList: aData.renderList,
        isListView: aData.isListView,
        currentListCount:currentListCount,
        isCrossBack:M1FormUtils.isCrossBack
    };
    if (aData.data != null) {
        aPageData.vertical = aData.data.vertical;
        aPageData.searchvertical = aData.data.searchvertical;
    }
    else {
        aPageData.searchvertical = null;
        aPageData.vertical = false;
        M1FormUtils.isVertical=null;
    }
    dateControlList = [];
    if (!aPageData.renderList) {
        ftemp = trim(formqueryreport.SearchPageContainer(aPageData));
    } else {
        if (aPageData.reportdata!=null){
            fChartNameList=aPageData.reportdata.chartNameList;
        } else{
            fChartNameList=null;
        }
        fSearchvertical=aPageData.searchvertical==null?aPageData.vertical:aPageData.searchvertical;
        if(M1FormUtils.haveNotCondition){
            var fHasData,fHeaderTemp,fChartNameList,fIsHome,fSearchvertical;
            fHasData=(aPageData.data!=null);

            fIsHome=aPageData.leftreturntype=="business";

            fHeaderTemp=trim(formqueryreport.SearchResultPageHead(aPageData.headtext,aPageData.listtype,fHasData,fChartNameList,fIsHome,aPageData.vertical,fSearchvertical));
        }
        var fListTemp = trim(formqueryreport.SearchResultData_Vertical(aPageData.id, aPageData.data.result, aPageData.data.metadata, aPageData.colunmwidth, aPageData.data.moredata, aPageData.isTableList,M1FormUtils.haveNotCondition));
        var fSortStatisticsTemp="";
        //if(aPageData.sortFields.length>0&&aPageData.listtype!="2"){
            //fChartNameList=null;
           // fSearchvertical = aPageData.searchvertical==null?aPageData.vertical:aPageData.searchvertical;
            fSortStatisticsTemp = trim(formqueryreport.SortStatistics(fChartNameList,fSearchvertical,aPageData.data, aPageData.sortFields, aPageData.sortContent, aPageData.listtype, aPageData.isTableList,aPageData.currentListCount));
        //}
    }
    var fNowFunc = function () {

        if (cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)) {
            aStorageData = JSON.parse(cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true));
        }
        var aSortOption = document.querySelector('#sortOption'),
            userOrderByArrEle = {},
            filterarr=JSON.parse(cmp.storage.get(M1FormUtils.filterArrKey, true))||filterArr;
            options = {
                containerId: 'formqueryreport-filter',
                data: filterarr,
                success: function (results) {
                    console.log(results);
                    if(cmp.storage.get(M1FormUtils.filterArrKey, true)){
                        cmp.storage.delete(M1FormUtils.KEY, true);
                    }
                    cmp.storage.save(M1FormUtils.filterArrKey, JSON.stringify(results),true);
                    M1FormUtils.filterArr=results;
                    M1FormUtils.sortItem={};
                    M1FormUtils.sortContent={};
                    M1FormUtils.userOrderBystorage=[];
                    for(var c=0;c<results.length;c++){
                        if(results[c].filterType=="select"&&results[c].value.split(',').length==results[c].items.length){
                            results[c].value="";
                        }
                    }
                    var  searchParams = {};
                    searchParams.userOrderBy = [];
                    if (aSortOption) {
                        userOrderByArrEle.fieldName = aSortOption.getAttribute("sAfieldname");
                        userOrderByArrEle.orderType = aSortOption.getAttribute("sOrdertype");
                        if(userOrderByArrEle.fieldName&&userOrderByArrEle.orderType){
                            searchParams.userOrderBy.push(userOrderByArrEle);
                        }
                    }
                    searchParams.id = aPageData.id;
                    searchParams.listtype = aPageData.listtype;
                    searchParams.searchConditons = UEComponentCondition(results);
                    M1FormUtils.searchConditons=searchParams.searchConditons;
                    if(M1FormUtils.isVertical!=null){
                        searchParams.isMobile = M1FormUtils.isVertical ?true:false;
                    }
                    searchParams.isRefreshPart = true;
                    searchParams.isRefreshsortStatistics = true;
                    M1FormUtils.total = 1;
                    doSearch(false, searchParams, "");
                }
            };
        if (!aPageData.isRefreshPart&&!M1FormUtils.isCrossBack) {
            if(typeof SuiFilter!="undefined"){
                new SuiFilter(options);
            }else {
                cmp.asyncLoad.js([vueJSUrl + buildversion], function () {
                    cmp.asyncLoad.js([sui_filterJSUrl + buildversion], function () {
                        new SuiFilter(options);
                    });
                });
            }
        }
        //refreshHeader(aPageData);//删
        localStorage.setItem(CacheKey.FORM_REPORT_DATA, "{}");
        setHeaddArrayHeight('#table-content', [ '#formqueryreport-filter', '.sortStatisticsBar']);
        if (false) {
            setHeaddArrayTop('#table-content', [ '#formqueryreport-filter', '#sortStatistics']);
        }
        if(document.querySelector('.table_body.link-content.bgw')){
            document.querySelector('.table_body.link-content.bgw').style.height=document.querySelector('#table-content').offsetHeight+"px";
        }
        //如果是穿透返回的，再请求一次（权宜之计，暂时想不到更好的办法了）
        if(M1FormUtils.isCrossBack){
            var aStorageData,searchParams={};
            aStorageData = parseStorageData();
            if($('.sui-filter-wrapper').length>0){
                $('.sui-filter-wrapper').remove();
            }
            if(aStorageData){
                searchParams.id = aStorageData.id;
                searchParams.listtype = aStorageData.listtype;
                searchParams.searchConditons = aStorageData ? aStorageData.conditon : fCondition;
                searchParams.userOrderBy = aStorageData ? aStorageData.userOrderBy : [];
                if(aStorageData.data){
                    searchParams.isMobile = aStorageData.data.vertical?true:false;
                }
                searchParams.isRefreshPart = false;
                searchParams.isRefreshsortStatistics = true;
                searchParams.sortContent = aStorageData ? aStorageData.sortContent : "";
                searchParams.vertical=aPageData.data.vertical;
                cmp.storage.delete(M1FormUtils.ConditionAndSortDataKey, true);
            }else {
                searchParams.id = aPageData.id;
                searchParams.listtype = aPageData.listtype;
                searchParams.searchConditons = aPageData.conditon;
                searchParams.userOrderBy = aPageData.userOrderBy;
                searchParams.isRefreshPart = false;
                searchParams.isRefreshsortStatistics = true;
                searchParams.sortContent = aPageData.sortContent||"";
                searchParams.vertical=aPageData.data?aPageData.data.vertical:"";
            }
            doSearch(true, searchParams,"");
            M1FormUtils.isCrossBack=false;
            return;
        }
        callback && callback();
        /*var appTitle = document.querySelector(".frame .header_text");
        if(appTitle.offsetWidth < appTitle.scrollWidth ){
            appTitle.addEventListener("tap", function(){
                document.querySelector('.title-info').style.marginTop=cmp.os.ios?"64px":"44px";
                document.getElementById("title-more").style.display=(document.getElementById("title-more").style.display=="block"?"none":"block");
                document.getElementById("title-info-txt").innerText=appTitle.innerText;
            });
        }*/
        document.querySelector(".title-info-bg").addEventListener("tap", function(){
            document.getElementById("title-more").style.display="none";
        });
        if (aPageData.data == null) {
            return;
        }
        $(".right_list_link").on('tap', function (e) {
            if($('.sui-filter-wrapper').length>0){
                $('.sui-filter-wrapper').remove();
            }
            if ($('.chart_select').is(':hidden')) {
                $(".chart_select").fadeIn();
            } else {
                $(".chart_select").fadeOut();
            }
        });
        var fReportdataStr;
        if (aPageData.reportdata == null)
            fReportdataStr = "{}";
        else
            fReportdataStr = JSON.stringify(aPageData.reportdata);
        localStorage.setItem(CacheKey.FORM_REPORT_DATA, fReportdataStr);
        $(document).on("tap", '.chart_select_item', function (e) {
            var sui_filter_wrapper = document.querySelector('.sui-filter-wrapper');
            if (sui_filter_wrapper) {
                sui_filter_wrapper.remove();
            }
            var chartName = $(this).attr('rel');
            if (cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)) {
                cmp.storage.delete(M1FormUtils.ConditionAndSortDataKey, true);
            }
            cmp.storage.save(M1FormUtils.ConditionAndSortDataKey, JSON.stringify(aPageData), true);
			cmp.event.trigger('formqueryreport_nextpage',document,chartName);
       
        });
        searchUiAddTapListener(aPageData);
        var width=document.documentElement.clientWidth-1;
        $('#pageframe').css('transform','translate3d('+width+'px, 0px, 0px)');
        setTimeout(function(){
            $('#pageframe').css('transform',document.querySelector('#pageframe').style.transform);
            $('#pageframe').css('left','-'+document.documentElement.clientWidth+'px');
        },100)
    };
    if (!aDoSlide) {
        Frame_From = 'center';
    }
    if (aPageData.renderList) {
        if (!aData.isTableList) {
            if (M1FormUtils.haveNotCondition) {
                slide_in({
                    sortStatisticsTemp: fSortStatisticsTemp,
                    listTemp: fListTemp,
                    headerTemp:fHeaderTemp
                }, Frame_From, {
                    sortContainer: "#refreshPart",
                    listContainer: "#wrapper"
                }, fNowFunc, false, {isTable: 0});
            } else {
                slide_in({
                    sortStatisticsTemp: fSortStatisticsTemp,
                    listTemp: fListTemp
                }, Frame_From, {
                    sortContainer: "#refreshPart",
                    listContainer: "#wrapper"
                }, fNowFunc, false, {isTable: 0});
            }
        } else {
            if(M1FormUtils.haveNotCondition){
                slide_in({sortStatisticsTemp:fSortStatisticsTemp,headerTemp:fHeaderTemp}, Frame_From, "#refreshPart", fNowFunc, false, {isTable: 1});
            }else {
                slide_in({sortStatisticsTemp:fSortStatisticsTemp}, Frame_From, "#refreshPart", fNowFunc, false, {isTable: 1});
            }
        }
    } else {
        if (aData.isRefreshPart) {
            slide_in(ftemp, Frame_From, "#refreshPart", fNowFunc, false);
        } else {
            slide_in(ftemp, Frame_From, ".frame", fNowFunc, false);
        }
    }
    document.querySelector("#loading").style.display = "none";
};
function searchUiAddTapListener(aPageData) {
    var fConditionError = "";

    if (null != aPageData.data) {
        var fItem = aPageData.data.result;
        var trAll= document.querySelectorAll('.body-tr');
        var FlowForm_view = document.querySelector('.FlowForm_view');
        if (trAll&&trAll.length>0) {
            for (var k = 0; k < trAll.length; k++) {
                (function (k) {
                    count=true;
                    cmp.event.click(trAll[k], function () {
                        setTimeout(function () {
                            count=true;
                        },1500);
                        if(count){
                            count=false;
                            if(!(fItem[k%20] instanceof Array)){
                                showFromData(fItem[k%20].split(' ')[0], aPageData);
                            }else{
                                showFromData(fItem[k%20][0], aPageData);
                            }

                        }
                    });
                })(k);
            }
        } else if (null != FlowForm_view) {
            var FlowForm_Cont_All = FlowForm_view.querySelectorAll('.FlowForm_Cont');
            var more_all = FlowForm_view.querySelectorAll('.more');
            for (var k = 0; k < FlowForm_Cont_All.length; k++) {
                (function (k) {
                    /*if (FlowForm_Cont_All[k]) {
                        cmp.event.click(FlowForm_Cont_All[k], function () {
                            if(!(fItem[k%20] instanceof Array)){
                                showFromData(fItem[k%20].split(' ')[0], aPageData);
                            }else{
                                showFromData(fItem[k%20][0], aPageData);
                            }

                        });
                    }*/
                    if (more_all[k]) {
                        cmp.event.click(more_all[k], function () {
                            SearchResultData_VerticalOnClick('record_' + k);
                        });
                    }
                })(k);
            }
        }
    }
	
	$('.FlowForm_Cont').off('tap').on('tap',function(){
        var pId=this.getAttribute('pId');
        showFromData(pId, aPageData);
    });
	
    if (null != aPageData.conditon) {
        for (var i = 0; i < aPageData.conditon.length; i++) {
            if (!M1FormUtils.canSupportConditionName(aPageData.conditon[i].ctype)) {
                fConditionError += M1FormUtils.getConditionName(aPageData.conditon[i].ctype);
            }
        }
    }
    if (null != document.querySelector('#sortOption')) {
        document.getElementById('sortOption').addEventListener('click', function () {
            var shutterHeight,
                sortList = document.querySelector('.sortList'),
                sortListSpan = document.querySelectorAll('.sortListSpan'),
                searchParams = {},
                sortFieldList = document.querySelectorAll('.sortFieldList'),
                sortArrows = document.querySelector('#sortOption .arrows'),
                sortListArrows = document.querySelectorAll('.sortList .arrows'),
                //header = document.querySelector('#header'),
                sort = document.querySelector('.sort'),
                sortStatistics = document.querySelector('#sortStatistics'),
                formqueryreport_filter = document.querySelector('#formqueryreport-filter'),
                filterHeight;
            if (formqueryreport_filter) {
                filterHeight = formqueryreport_filter.offsetHeight
            } else {
                filterHeight = 0;
            }

            shutterHeight = M1FormUtils.getWindowsHeight() - filterHeight - sortStatistics.offsetHeight;
            if(sortList){
                if ( sortList.style.display == "none") {
                    sortList.style.display = "block";
                    if(sortList.offsetHeight>=shutterHeight){
                        sortList.style.height= shutterHeight+"px";
                        shutterHeight=0;
                    }else {
                        shutterHeight = shutterHeight - sortList.offsetHeight;
                    }

                    var sortListContent,
                        sortContent = sort.innerHTML;
                    //sortContent = sort.innerHTML + sortArrows.innerHTML;
                    for (var i = 0; i < sortListSpan.length; i++) {
                        sortListSpan[i].style.color = "#333";
                        sortListArrows[i].style.color = "#333";
                        //sortListContent = sortListSpan[i].innerHTML + sortListArrows[i].innerHTML;
                        sortListContent = sortListSpan[i].innerHTML;
                        if (sortListContent == sortContent) {
                            if(sortArrows.innerHTML!=sortListArrows[i].innerHTML){
                                //sortListArrows[i].innerHTML=sortArrows.innerHTML;
                                var sortType=sortListArrows[i].getAttribute('ordertype');
                                sortListArrows[i].setAttribute('ordertype',sortType);
                            }
                            sortListSpan[i].style.color = "#1C5DAB";
                            sortListArrows[i].style.color = "#1C5DAB";
                        }
                    }
                    var shutter = document.createElement('div');
                    shutter.className = "cmp-backdrop cmp_bomb_box_backdrop";
                    shutter.style.height = shutterHeight + "px";
                    shutter.style.top = "initial";
                    document.body.appendChild(shutter);
                    shutter.addEventListener('click', function () {
                        shutter.remove();
                        sortList.style.display = "none";
                    });
                } else if (sortList.style.display != "none") {
                    if(document.querySelector('.cmp-backdrop.cmp_bomb_box_backdrop')){
                        document.querySelector('.cmp-backdrop.cmp_bomb_box_backdrop').remove();
                    }
                    sortList.style.display = "none";
                }
            }else {
                sortArrows.innerHTML=sortArrows.innerHTML=="↑"?"↓":"↑";
                searchParams.id = aPageData.id;
                searchParams.listtype = aPageData.listtype;
                searchParams.searchConditons=UEComponentCondition(aPageData.conditon);
                searchParams.userOrderBy = [];
                var newType=aPageData.sortFields[0].type=="asc"?"desc":"asc";
                searchParams.userOrderBy[0]={fieldName:aPageData.sortFields[0].fieldName,orderType:newType};
                M1FormUtils.userOrderBy.push(searchParams.userOrderBy[0]);
                searchParams.isMobile = M1FormUtils.isVertical?true:false;
                searchParams.isRefreshPart = true;
                searchParams.isRefreshsortStatistics = true;
                doSearch(false, searchParams, "");
            }

        });
    }
    //$('.sortFieldList').click(function () {
    $('.sortFieldList').off('tap').on('tap',function(){
        var shutter = document.querySelectorAll('.cmp_bomb_box_backdrop'),
            sort = document.querySelector('.sort'),
            sortArrows = document.querySelector('#sortOption .arrows'),
            sortList = document.querySelector('.sortList'),
            aSortOption = document.querySelector('#sortOption'),
            searchParams = {},
            userOrderByArrEle = {};
        //shutter.remove();
        searchParams.id = aPageData.id;
        searchParams.listtype = aPageData.listtype;
        searchParams.searchConditons=UEComponentCondition(aPageData.conditon);
        searchParams.userOrderBy = [];
        if (this.classList.contains('defaultSort')) {
			M1FormUtils.userOrderBystorage=[];
        } else {
            userOrderByArrEle.fieldName = this.querySelector('.sortListSpan').getAttribute('afieldname');
            userOrderByArrEle.orderType = this.querySelector('.arrows').getAttribute('ordertype');

            //比较是否是上次点击的统计条目
            if(userOrderByArrEle.fieldName==M1FormUtils.sortItem.name){
                if(userOrderByArrEle.orderType=="desc"){
                    userOrderByArrEle.orderType="asc";
                    //this.querySelector('.arrows').innerHTML="↑";
                }else {
                    userOrderByArrEle.orderType="desc";
                    //this.querySelector('.arrows').innerHTML="↓";
                }
                for(var i=0;i<M1FormUtils.userOrderBy.length;i++){
                    if(userOrderByArrEle.fieldName==M1FormUtils.userOrderBy[i].fieldName){
                        M1FormUtils.userOrderBy.splice(i,1);
                    }
                }
                M1FormUtils.userOrderBy.push(userOrderByArrEle);
            }
			M1FormUtils.userOrderBystorage=[];
			M1FormUtils.userOrderBystorage.push(userOrderByArrEle);

            searchParams.userOrderBy.push(userOrderByArrEle);
            aSortOption.setAttribute("sAfieldname", userOrderByArrEle.fieldName);
            aSortOption.setAttribute("sOrdertype", userOrderByArrEle.orderType);

        }
        searchParams.sortContent = {};
        searchParams.sortContent.sort = this.querySelector('.sortListSpan').innerHTML;
        if(!this.classList.contains('defaultSort')){
            searchParams.sortContent.sortArrows = aSortOption.getAttribute("sordertype")=="asc"?"↑":"↓";
            sortArrows.remove();
        }else {
              sortArrows.remove();
            sortArrows.innerHTML='';
        }

        //searchParams.sortContent.sortArrows = aSortOption.getAttribute("sordertype")=="asc"?"↑":"↓";
		M1FormUtils.sortContent=searchParams.sortContent;
        searchParams.isMobile = M1FormUtils.isVertical?true:false;
        searchParams.isRefreshPart = true;
        searchParams.isRefreshsortStatistics = true;

        for(var b=0;b<shutter.length;b++){
            shutter[b].remove();
        }
        doSearch(false, searchParams, "");
        M1FormUtils.sortItem.name=userOrderByArrEle.fieldName||"";
        M1FormUtils.sortItem.type=userOrderByArrEle.orderType||"";
        sort.innerHTML = this.querySelector('.sortListSpan').innerHTML;
        sortArrows.innerHTML = aSortOption.getAttribute("sordertype")=="asc"?"↑":"↓";
        sortList.style.display = "none";
    });
    $('.sui-filter-ctrl-item-3').on('click', function () {	
        var shutter = document.querySelector('.cmp_bomb_box_backdrop'),
            sortList = document.querySelector('.sortList');
        if ($('.chart_select').is(':hidden')) {

        } else {
            $(".chart_select").fadeOut();
        }
        if (sortList) {
            sortList.style.display = "none";
            if (shutter) {
                shutter.remove();
            }
        }
    });
}
function clearSearchInput() {
    var fSearch = document.querySelector('#searchvalueinput');
    if (fSearch == null)
        return;
    fSearch.value = "";
    M1FormUtils.isSearch = true;
    onSearchInputSubmit();
};
function getCurrentSelectTab() {
    var fTab = document.querySelector('#cmp-segmented-control');
    if (fTab != null)
        return fTab.getAttribute("tabsel");
    return M1FormUtils.C_iListType_Statistics;
};
function onSearchInputSubmit() {
    var fSearch = document.querySelector('#searchvalueinput');
    fSearch.blur();
    if (fSearch == null) {
        return;
    }
    var fListType;
    fListType = getCurrentSelectTab();
    doHome(fListType, null, fSearch.value, false);
};
function doHome_table(aListType, aId, aDoSlide) {
    var fSearch = document.querySelector('#searchvalueinput');
    if (fSearch == null) {
        return;
    }
    doHome(aListType, null, fSearch.value, false);
}
function makeConditionValueCheckBox_all(aElement, aLastValue, aResult) {
    //没有勾选的,不返回
    if (!aElement.checked) {
        aResult.cname = null;
        return aResult;
    }
    if (aLastValue == null || aLastValue.cname != aElement.name) {
        aResult.ovalue = [aElement.getAttribute("cvalue")];
        return aResult;
    }
    aLastValue.ovalue.push(aElement.getAttribute("cvalue"));
    return aLastValue;
};
function makeConditionValue(aElement, aLastValue) {
    var result = {
        cname: null,
        cvalue: null
    };
    if (aElement == null)
        return null;
    if (aElement.nodeName == "INPUT") {
        result.cname = aElement.name;
        if (aElement.type == "text")
            result.cvalue = aElement.value;
        else if (aElement.type == "radio") {
            if (aElement.checked)
                result.cvalue = aElement.getAttribute("cvalue");
            else
                result.cname = null;//不添加
        }
        else if (aElement.type == "checkbox") {
            return makeConditionValueCheckBox(aElement, aLastValue, result);
        }
    } else if (aElement.nodeName == "SELECT") {
        var ctype;
        ctype = aElement.getAttribute("ctype");
        if (ctype == M1FormUtils.C_iConditionType_Radio) {
            result.cname = aElement.name;
            result.cvalue = "[" + aElement.options[aElement.selectedIndex].value + "]";
        } else {
            result.cname = aElement.name;
            result.cvalue = aElement.options[aElement.selectedIndex].value;
        }
    } else if (aElement.nodeName == "SPAN") {//目前只有选人组件使用Span
        result.cname = aElement.getAttribute("name");

        result.cvalue = aElement.getAttribute("cvalue");

        var fShowtitle;
        fShowtitle = aElement.getAttribute("showtitle");
        if (!isBlank(fShowtitle))
            result.showtitle = fShowtitle;
        else
            result.showtitle = "";
    } else if (aElement.nodeName == "TEXTAREA") {
        result.cname = aElement.name;
        result.cvalue = aElement.value;
    }
    return result;
};
function UEComponentCondition(aData) {
    if (!aData) {
        return;
    }
    var nData = [];
    for (var i = 0; i < aData.length; i++) {
        nData[i] = {};
        if(aData[i].title){
            nData[i].ctitle = aData[i].title;
            nData[i].cname = aData[i].name;
            nData[i].cvalue = aData[i].value;
			nData[i].display = aData[i].display||"";
        }else if(aData[i].cname){
            nData[i].cname = aData[i].cname;
            nData[i].cvalue = aData[i].cvalue
			nData[i].display = aData[i].display||"";
        }
    }
    return nData;
}
function readInputCondition() {
    var fCList, fData, fItem;
    fCList = document.querySelector('#conditionarray');
    if (fCList == null) {
        alert("not found conditionarray element");
        return;
    }
    fCList = fCList.querySelectorAll('.SearchCondition');
    fData = [];
    if (fCList == null) {

        alert("not found condition");
        return;
    }
    if (fCList.length === undefined) {
        alert("not found condition array");
        return;
    }
    var ftempValue, fLastValue = null;
    for (var i = 0; i < fCList.length; i++) {
        ftempValue = makeConditionValue(fCList[i], fLastValue);
        //返回的变量有值,或者不是重复的上一个变量,才提交
        if (ftempValue.cname != null)
            if (fLastValue != ftempValue) {
                convertOValue(fLastValue);
                fLastValue = ftempValue;
                fData.push(fLastValue);
            }
    }
    //避免最后一个变量没有转换
    convertOValue(fLastValue);
    outdebug(JSON.stringify(fData));
    return fData;
};
function convertOValue(aLastValue) {
    if (aLastValue == null) return;
    if (aLastValue.ovalue === undefined) return;
    aLastValue.cvalue = ecodePersonInfo(aLastValue.ovalue);
    aLastValue.ovalue = undefined;
}
function getPeopleShowValue(aData) {
    var result = "";
    if (aData == null) return result;
    for (var i = 0; i < aData.length; i++) {
        if (!isBlank(result))
            result += ",";
        result += aData[i].name;
    }
    return result;
}
function selectPeople_Success(aResultvalue, aDom) {
    var fCValue;
    fCValue = ecodePersonInfo(aResultvalue);
    outdebug(fCValue);
    aDom.setAttribute("cvalue", fCValue);
    var fTitle;
    fTitle = getPeopleShowValue(aResultvalue);
    if (isBlank(fTitle))
        aDom.innerHTML = "&nbsp";
    else
        aDom.innerText = fTitle;
};

function selectPeople_Error(aError) {
    outerror(aError);
};
//显示表单详细信息
function showFromData(aIdStr, aPageData) {
    if (isBlank(aIdStr)||isBlank(aPageData.id)||M1FormUtils.C_iListType_Statistics == aPageData.listtype) {
        return;
    }

    if (cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)) {
        cmp.storage.delete(M1FormUtils.ConditionAndSortDataKey, true);
    }
    cmp.storage.save(M1FormUtils.ConditionAndSortDataKey, JSON.stringify(aPageData), true);
    getShowFromData(aIdStr, aPageData.id, showFromDetail, aPageData.headtext);
};

function SearchResultData_VerticalOnClick(aId) {
    var fElement;
    fElement = document.getElementById(aId);
    if (fElement == null) return;
    var factive;
    factive = fElement.classList.contains('active');
    var scroller = document.querySelector("#scroller");
    if (factive)
        fElement.classList.remove('active');
    else
        fElement.classList.add('active');
    if (factive) {
        fElement.previousSibling.previousSibling.style.height = "100%";
        fElement.previousSibling.previousSibling.previousSibling.previousSibling.style.height = "100%";
        setTimeout(function () {
            //scroller.style.position = "relative";
        }, 200);
    } else {
        fElement.previousSibling.previousSibling.style.height = "100px";
        fElement.previousSibling.previousSibling.previousSibling.previousSibling.style.height = "100px";
        setTimeout(function () {
            //scroller.style.position = "static";
        }, 200);
    }
    if (fCurrentScorll != null) {
        fCurrentScorll.refresh();
    }
};
function selectProject_Error(aError) {
    outerror(aError);
};
function selectProject_Success(result, aDom) {
    aDom.setAttribute("cvalue", result.id);
    var fTitle;
    fTitle = result.name;
    if (isBlank(fTitle))
        aDom.innerHTML = "&nbsp";
    else
        aDom.innerText = fTitle;
    aDom.setAttribute("showtitle", fTitle);
};
function getArrayFirstChild(aData, aSkipString) {
    if (aData == null) return null;
    if (aData.length == null) return null;
    if (aData.length <= 0) return null;
    if (typeof aData == "string")
        if (aSkipString) return null;
    return aData[0];
}