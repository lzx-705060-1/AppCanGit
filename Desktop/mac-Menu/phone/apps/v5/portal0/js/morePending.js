var searchModelId = 3003;
var refreshListview = false;
var pageX = {
        cacheKey : "m3_v5_portal_morePending_cache_key",
        cache : {},
        cachePeivMenu : null,//cache已经被用残了
        searchCacheKey : "m3_v5_portal_morePending_search_cache_key",
        searchCondition : {},
        winParams : null,
        listViewCacheKey : "m3_v5_portal_morePending_listView_cache_key",
        currentListViewKey : "",//当前listView缓存键值
        loadAll : false //是否刷新之前的所有数据
}

/********************************** 初发化方法  ***********************************/

cmp.ready(function () {
	
	pageX.winParams = cmp.href.getParam() || getHrefQuery() || {};
	
	//初始化返回事件
	initPageBack();
	
	initHtml();
	
	initPageMenu();
	
	//数据缓存机制，不用每次打开刷新页面
	initInStorage();
	
	//从数据库中取数据
	loadData();
	
	//初始化事件
	initEvent();
});

/****************************** 监听返回事件(放到最前头)  ******************************/

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
	//初始化页面离开事件
	document.addEventListener('beforepageredirect', _M3_Save_Storage);
}

function _goBack() {
	//删除页面缓存
	_M3_Delete_Storage();
	//返回到外层
	cmp.href.back();
}

/********************************** 缓存操作  ***********************************/
function initInStorage() {
    
    var cacheData = cmp.storage.get(pageX.cacheKey, true);
    if(cacheData){
        var fromCache = JSON.parse(cacheData);
        pageX.cache = fromCache.cache;
        pageX.cachePeivMenu = fromCache.cachePeivMenu;
        cmp.storage["delete"](pageX.cacheKey, true);
    }
    
    var searchCacheData = cmp.storage.get(pageX.searchCacheKey, true);
    if(searchCacheData){
        pageX.searchCondition = JSON.parse(searchCacheData);
    }
}

//存储状态数据
function _M3_Save_Storage() {
    
	pageX.cache.openFrom = pageX.winParams.openFrom;
	var toCache = {
	        cache : pageX.cache,
	        cachePeivMenu : pageX.cachePeivMenu
	}
	cmp.storage.save(pageX.cacheKey, JSON.stringify(toCache), true);
	
	//使用local storage
	cmp.storage.save(pageX.searchCacheKey, JSON.stringify(pageX.searchCondition), true);
	
	//当前listview缓存数据的键值
	cmp.storage.save(pageX.listViewCacheKey,pageX.currentListViewKey,true);
}

function _M3_Delete_Storage() {
	cmp.storage["delete"](pageX.cacheKey, true);
	cmp.storage["delete"](pageX.searchCacheKey, true);
	cmp.storage["delete"](pageX.listViewCacheKey, true);
}

/********************************** 页面数据初始化  ***********************************/
function initPageMenu() {
    
    if(!pageX.cachePeivMenu){
        cmp.dialog.loading();
        //判断是当前人员的菜单选项
        // $s.Affair.userPeivMenu({},{}, 
        SeeyonApi.Rest.post('affair/userPeivMenu',{},{},{
            success : function(result) {
                cmp.dialog.loading(false);
                pageX.cachePeivMenu = result;
                userPeivMenu(result);
            },
            error : function(result){
    			var cmpHandled = cmp.errorHandler(result);
    	    	if(!cmpHandled){
    	    		cmp.notification.alert(cmp.i18n("portal.exception.reqException"),_goBack,"",cmp.i18n("portal.label.confirm"));
    	    	}
    		}
        });
    }else{
    	userPeivMenu(pageX.cachePeivMenu)
    }
}

function loadData() {
	initSearchDiv();
	initListView();
}

/********************************** 页面布局  ***********************************/
function userPeivMenu(data) {
	if(!data.isHaveNewColl){//新建权限
		haveNewColl=false;
		_$("#creatFreeCollBtn").style.display = "none";
	}
}


function initSearchDiv(){
	//搜索条件
	if (pageX.searchCondition.condition !=undefined) {
		var searchSoure = "";
		_$("#searchHeader").style.display = "none";
		_$("#reSearch").style.display = "block";
		
		if (pageX.searchCondition.condition != "createDate") {
	      	_$("#searchText").style.display = "block";
	      	_$("#searchDate").style.display = "none";
	      	_$("#cmp_search_title").innerHTML = pageX.searchCondition.text;
	      	_$("#searchTextValue").value = pageX.searchCondition.value;
	      	searchSoure = pageX.searchCondition.value;
	    } else {
	      	_$("#searchText").style.display = "none";
	      	_$("#searchDate").style.display = "block";
	      	_$("#cmp_search_title").innerHTML = pageX.searchCondition.text;
	      	_$("#searchDateBeg").value = pageX.searchCondition.dateBegin;
	      	_$("#searchDateEnd").value = pageX.searchCondition.dateEnd;
	      	searchSoure = pageX.searchCondition.dateBegin + "#" + pageX.searchCondition.dateEnd;
	    }
		pageX.cache[pageX.searchCondition.condition]=searchSoure;
	} else {
		_$("#searchHeader").style.display = "block";
		_$("#reSearch").style.display = "none";
	}	
}

function initListView() {
	var params = {
			"entityId" : pageX.winParams.entityId,
			"ordinal" : pageX.winParams.ordinal
	};
	if (pageX.searchCondition.condition) {
		params.condition = pageX.searchCondition.condition;
		params.conditionValue = pageX.searchCondition.value;
	}
	cmp.listView("#colPendingsContain", {
		imgCache:true,
	    config: {
	        onePageMaxNum:60,
	        isClear: false,
	        clearCache: false,
	        pageSize: 20,
	        crumbsID : "",
	        params: params,
	        dataFunc: function(params, options) {
	        	//$s.Affair.getPendingMore({}, params, {
	        	SeeyonApi.Rest.post('affair/getPendingMore',{},params,{
	        		success : function(result) {
	        			if (result.errorMsg) {
	        				cmp.notification.alert(result.errorMsg,_goBack,"",cmp.i18n("portal.label.confirm"));
	        			} else {
	        				if(options.success) {
	        					options.success(result);
	        				}
	        			}
	        		},
	        		error : function(result){
	        			var cmpHandled = cmp.errorHandler(result);
	        	    	if(!cmpHandled){
	        	    		cmp.notification.alert(cmp.i18n("portal.exception.reqException"),_goBack,"",cmp.i18n("portal.label.confirm"));
	        	    	}
	        		}
	        	 });
	        },
	        renderFunc: renderData
	    },
	    down: {
	    	contentprepage:cmp.i18n("portal.page.lable.prePage"),//上一页
	        contentdown: cmp.i18n("portal.page.down_fresh"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	        contentover: cmp.i18n("portal.page.release_fresh"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("portal.page.loading"),//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	    },
	    up: {
	    	contentnextpage:cmp.i18n("portal.page.lable.nextPage"),//下一页
	        contentdown: cmp.i18n("portal.page.release_load"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("portal.page.release_fresh"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
	        contentnomore: cmp.i18n("portal.page.lable.load_nodata"),//可选，请求完毕若没有更多数据时显示的提醒内容；
	    }
	});
}

function renderData(result, isRefresh){
    
	isInitListView = true;
    
    var restAllselect = false;
    var pendingTPL = _$("#list_li_tpl").innerHTML;
    var $fillArea = _$("#listPending");
    
    _updateData4ListView(result);
    var html = cmp.tpl(pendingTPL, result);
    if (isRefresh || refreshListview) {//是否刷新操作，刷新操作 直接覆盖数据
        $fillArea.innerHTML = html;
        refreshListview = false;
        if(isRefresh){
        	restAllselect=true;
        }
    } else {
    	cmp.append($fillArea,html);
    }
}

function initHtml() {
    if(pageX.winParams.columnsName){
        _$("title").innerText = decodeURI(pageX.winParams.columnsName);
    }else{
        //国际化title
        _$("title").innerText=cmp.i18n("portal.bottom.todo");
    }
    
}

/********************************** 初始化控件事件  ***********************************/

function initEvent() {
    //点击展开详细页面
    cmp("#dataCommonDiv").on("tap", ".item-click-area", function() {
    	var nextURL = "";
    	var paramData = {
				"openFrom" : pageX.winParams.openFrom,
				"affairId" : this.getAttribute("affairId")
		};
    	var app = this.getAttribute("applicationCategoryKey");
    	if ("1"===app) {//协同
    		nextURL = _collPath + "/html/details/summary.html?cmp_orientation=auto"+buildVersion;
    	} else if ("19"===app || "20"===app || "21"==app) {//公文
    		nextURL = _edocPath + "/html/edocSummary.html?cmp_orientation=auto"+buildVersion;
    	}
    	if (nextURL != "") {
    		cmp.event.trigger("beforepageredirect",document);
    		
    		cmp.href.next(nextURL , paramData, {});
    	} else {
    		cmp.notification.toast(cmp.i18n("portal.pending.no.support"), "center");
    	}
    });
    
    cmp.event.click(_$("#creatFreeCollBtn"), function(){
        cmp.event.trigger("beforepageredirect",document);

        cmp.href.next(_collPath + "/html/newCollaboration.html"+buildVersion, {}, {});
    });
    
    _$("#createTemplateColBtn").addEventListener("tap", function(){
        cmp.event.trigger("beforepageredirect",document);

        cmp.href.next(_collPath + "/html/templateIndex.html"+buildVersion, {}, {});
    });

    //显示隐藏快捷键
     _$("#addKey").addEventListener("tap", function(){
          _$("#maskContainer").style.display = "block";
          _$(".cmp-content").classList.add("blur");
      });
      _$("#newCloseBtn").addEventListener("tap", fnClose);
    
    //取消重新加载页面
    _$("#cancelSearch").addEventListener("click",function(){
    	//重置搜索条件
    	var condition = pageX.searchCondition.condition;
    	delete (pageX.cache[condition]);
    	pageX.searchCondition = {};
    	refreshListview = true;
    	
    	//点击取消时，重置listview的crumbsId
    	if(pageX.searchCondition.searchCrumbsId){
    		delete pageX.searchCondition.searchCrumbsId;
    	}
    	loadData();
    });
    
    _$("#toSearch").addEventListener("click",function(){
    	var params = {};
    	params.type = pageX.searchCondition.type;
    	params.text = pageX.searchCondition.text;
    	params.condition = pageX.searchCondition.condition;
    	if(pageX.searchCondition.type == "date") {
    		params.value = [pageX.searchCondition.dateBegin,pageX.searchCondition.dateEnd];
    	} else {
    		params.value = pageX.searchCondition.value;
    	}
    	params.modelId = pageX.searchCondition.modelId;
    	searchFn(searchModelId, params);
    });
    
    document.querySelector('#search').addEventListener("click",function(){
		searchFn(searchModelId, null);
	});
    
}
    
/**
 * @param onlyPage 只是初始化展现头部搜索
 */
function searchFn(modelId,params, onlyPage) {
	var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("portal.pending.affairs.subject")},
	                 {type:"text",condition:"sender",text:cmp.i18n("portal.pending.affairs.sender")},
	                 {type:"date",condition:"createDate",text:cmp.i18n("portal.pending.affairs.dateSend")}];
	cmp.search.init({
    	id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"portal",   //模块名，如："协同"，名称开发者自定义
            id:modelId           //模块的唯一标识：
        },
        initShow : (onlyPage === true),//是否只在列表头部展现搜索
        parameter:params,
        items : searchObj,
        callback : function(result){ //回调函数：会将输入的搜索条件和结果返回给开发者
        	//返回的搜索相关的数据
        	doSearch(result.item.condition, result.item.type, result.item.text, result.searchKey[0], result.searchKey[1], modelId);
        }
    });
}

function doSearch(searchCondition, conditionType, conditionValue, textfeild, textfeild1, modelId) {
	if (pageX.searchCondition.condition != undefined) {
		delete (pageX.cache[pageX.searchCondition.condition]);
	}
	
    var condition = searchCondition;  //返回的搜索条件
    var dataSoure = "";        //搜索输入的数据  如果type="text",为普通文本，如果type="date"
    var type  = conditionType;       //搜索输入的数据类型有text和date两种
    //var renderArea = data.search_result_render_area_ID;  //提供一个该搜索页面上的可渲染的区域（可使用其作为滚动的容器）
    
    var tSearhContent = _$("#CMP_SearchContent");
    if(tSearhContent){
        tSearhContent.style.display = "none";
    }
    if (type == "date") {
    	dataSoure = textfeild + "#" + textfeild1;
    	pageX.searchCondition.dateBegin = textfeild;
    	pageX.searchCondition.dateEnd = textfeild1;
    } else {
    	dataSoure = textfeild;
    }
    pageX.cache[condition]=dataSoure;
    
    //查询条件返回
    pageX.searchCondition.type = type;
    pageX.searchCondition.condition = condition;
    pageX.searchCondition.text = conditionValue;
    pageX.searchCondition.value = dataSoure;
    pageX.searchCondition.modelId = modelId;
    
    refreshListview = true;
    
    //查询时listview要加上crumbsId参数
    pageX.searchCondition.searchCrumbsId = "search" + cmp.buildUUID();
    
    loadData();
}


/********************************** 页面使用工具  ***********************************/
function fnClose(){
	_$("#maskContainer").style.display = "none";
	_$(".cmp-content").classList.remove("blur");
}

function _updateData4ListView(result) {
	//暂存待办和处理后,对数据进行处理,不刷新数据,回到当前页面
    var returnDatas = getListViewDateUpdate();
    if (returnDatas) {
    	var type = returnDatas.type;
    	var affairId = returnDatas.data.affairId;
    	for (var i = 0;i<result.length;i++) {
    		if (result[i].id == affairId) {
    			if (type == "delete") {
    				result.splice(i,1);//删除该数据
    			} else if (type == "zcdb") {
    				result[i].state = "3";
    				result[i].subState = "13";
    			}
    		}
    	}
    }
}
/**
 * 获取跳转回协同首页listView操作数据
 */
function getListViewDateUpdate() {
	var datas = cmp.storage.get("isListViewDataUpdate",true);
	if(datas){
		datas = cmp.parseJSON(datas);
	    cmp.storage["delete"]("isListViewDataUpdate",true);
	}
	return datas;
}

function getHrefQuery()  {
    
    var url = window.location.search,
        reg_url = /^\?([\w\W]+)$/, 
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g, 
        arr_url = reg_url.exec(url), 
        ret = {};
    if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = result[2];
        }
    }
    return ret;
}

//简化选择器
function _$(selector, queryAll, pEl){
    
    var p = pEl ? pEl : document;
    
    if(queryAll){
        return p.querySelectorAll(selector);
    }else{
        return p.querySelector(selector);
    }
}