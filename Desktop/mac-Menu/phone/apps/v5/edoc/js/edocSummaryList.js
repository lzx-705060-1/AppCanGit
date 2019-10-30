var theRequestUrl = null;
var page = {};
var isSearch = false;
var listType;
var edocType;
var _storge_key = document.location.href;
var searchCondition = {};
var pageX = {};
pageX.searchCondition = {};//查询条件

cmp.ready(function () {
    
    theRequestUrl = cmp.href.getParam() || {};
    initPageBack();
    
	cmp.i18n.init(_edocPath+"/i18n/", "EdocResources", function() {
		
	    var storageObj = cmp.storage.get(_storge_key, true);
    	if(storageObj && storageObj!=null) {//从别的页面跳回来，先从缓存里取数据
    		var _json = JSON.parse(storageObj);
    		listType = _json.listType;
    		edocType = _json.edocType;
    		_M3_Remove_Storage();
    	} else {//第一次跳转该页面
    		listType = theRequestUrl['listType'] || "listPending";
    		edocType = theRequestUrl['edocType'] || "0";	
    	}
    	page.edocType = edocType;
        page.listType = listType;
	    
    	var params = {"edocType":edocType,"listType":listType};
    	
    	//注册懒加载
        _registLazy();
	    loadData([{}, params]);
	    pageSearch();
	
	    var edocTypes = [cmp.i18n("Edoc.action.Send"),cmp.i18n("Edoc.action.receive"),cmp.i18n("Edoc.action.signandreport")];
	    var title = edocTypes[edocType];
	    
	    if(listType=='listPending'){
	    	title += cmp.i18n("Edoc.state.pending");
	    }
	    if(listType=='listZcdb'){
	    	title += cmp.i18n("Edoc.state.processing");
	    }
	    if(listType=='listDoneAll'){
	    	title += cmp.i18n("Edoc.state.done");
	    }
	    if(listType=='listSent'){
	    	title += cmp.i18n("Edoc.state.sent");
	    }
	    if(listType=='listWaitSend'){
	    	title += cmp.i18n("Edoc.state.waitSent");
	    }
	    $("#title").html(title.replace(/\s+/g,""));
	    addEdocListHref();
	    //国际化title标签
    	document.querySelector("title").innerText=title;
	},$verstion);
});


function loadData(params){
    
	initSearchHTML();
	
	 cmp.listView("#edocSummaryListContain", {
	     imgCache:true,
         config: {
             onePageMaxNum:50,
             isClear: true,
             height: 50,//可选，下拉状态容器高度
             pageSize: 50,
             crumbsID : searchCondition.searchCrumbsId ? searchCondition.searchCrumbsId : "#edocSummaryListContain",
             params: params,
             dataFunc: function(fn, params, options){
            	 $s.EdocResource.getSummaryListByEdocTypeAndListType({}, params, {
		    		success : function(result) {
		    			if(options.success) {
		            		options.success(result);
		            	}
		            },
		            error : function(result){
		            	options.error();
		            	//处理异常
		            	EdocUtils.ajaxErrorHander(result);
		            }
		        })
             },
             renderFunc: renderData
         },
         down: {
         	 contentprepage:cmp.i18n("Edoc.page.lable.prePage"),//上一页
             contentdown: cmp.i18n("Edoc.action.pullDownRefresh"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
             contentover: cmp.i18n("Edoc.action.loseRefresh"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
             contentrefresh: cmp.i18n("Edoc.state.refreshing")//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//             callback:pulldownRefresh
         },
         up: {
         	 contentnextpage:cmp.i18n("Edoc.page.lable.nextPage"),//下一页
             contentdown: cmp.i18n("Edoc.action.loadMore"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
             contentrefresh: cmp.i18n("Edoc.state.loading"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
             contentnomore: cmp.i18n("Edoc.state.noMore")//可选，请求完毕若没有更多数据时显示的提醒内容；
             //callBack:pullupRefresh
         }
     });
	 
	 
}

function initSearchHTML(){
	if (pageX.searchCondition.condition != undefined) {
		_$("#searchHeader").style.display = "none";
		_$("#reSearch").style.display = "block";
		_$("#dataCommonDiv").style.top = "44px";
		
		_$('#search').removeEventListener("tap", searchFn);
		
		if (pageX.searchCondition.condition != "createDate") {
	      	_$("#searchText").style.display = "block";
	      	_$("#searchDate").style.display = "none";
	      	_$("#cmp_search_title").innerHTML = pageX.searchCondition.text;
	      	_$("#searchTextValue").value = pageX.searchCondition.value;
	    } else {
	      	_$("#searchText").style.display = "none";
	      	_$("#searchDate").style.display = "block";
	      	_$("#cmp_search_title").innerHTML = pageX.searchCondition.text;
	      	_$("#searchDateBeg").value = pageX.searchCondition.dateBegin;
	      	_$("#searchDateEnd").value = pageX.searchCondition.dateEnd;
	    }
	} else {
		_$('#search').removeEventListener("tap", searchFn);
		_$('#search').addEventListener("tap",searchFn);
		_$("#searchHeader").style.display = "block";
		_$("#reSearch").style.display = "none";
		_$("#dataCommonDiv").style.top = "0";
	}
}

/**
 * 注册缓加载
 */
function _registLazy(){
  //注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_load",
        "css" : [
                 _cmpPath + "/css/cmp-picker.css" + $verstion,
                 _cmpPath + "/css/cmp-search.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-picker.js" + $verstion,
                _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                _cmpPath + "/js/cmp-search.js" + $verstion
                ]
    });
}


function renderData(result, isRefresh) {
	
    //启动懒加载
    LazyUtil.startLazy();
    
    var pendingTPL = $("#list_li_tpl").html();
    var html = cmp.tpl(pendingTPL, result);
    if (isRefresh || isSearch) {//是否刷新操作，刷新操作 直接覆盖数据
        $("#edocSummaryList").html(html);
        isSearch = false;
    } else {
    	var table = $("#edocSummaryList").html();
    	$("#edocSummaryList").html(table+html);
    }
    cmp.IMG.detect();
}


function pageSearch() {
	_$('#search').addEventListener("tap",searchFn);
	
	_$("#toSearch").addEventListener("tap",function(){
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
    	searchFn(params);
    });
	 //取消重新加载页面
	_$("#cancelSearch").addEventListener("tap",function(){
    	//重置搜索条件
    	pageX.searchCondition = {};
    	page.textfield = null;
    	page.textfield1 = null;
    	page.conditionKey = null;
    	_$("#dataCommonDiv").style.top = "0";
    	loadData([{},page]);
    });
}
function searchFn(searchParams) {
	if(typeof(searchParams.condition)=="undefined") {
		searchParams=null;
	} 
	//标题、发起人、发起时间 
	var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("Edoc.title.title")},
	                 {type:"text",condition:"startMemberName",text:cmp.i18n("Edoc.title.sender")},
	                 {type:"date",condition:"createDate",text:cmp.i18n("Edoc.title.createTime")}];
    if(listType=='listSent' || listType=='listWaitSend'){
    	searchObj = [{type:"text",condition:"subject",text:cmp.i18n("Edoc.title.title")},
	                 {type:"date",condition:"createDate",text:cmp.i18n("Edoc.title.createTime")}];
    }
	cmp.search.init({
    	id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"edoc",   //模块名，如："协同"，名称开发者自定义
            id:"10041"           //模块的唯一标识：
        },
        items : searchObj,
        parameter : searchParams,
        callback:function(result){ //回调函数：会将输入的搜索条件和结果返回给开发者
        	page = {};
            var data = result.item;   //返回的搜索相关的数据
            var condition = data.condition;  //返回的搜索条件
            var dataSoure = "";        //搜索输入的数据  
            
            var type  = data.type;       //搜索输入的数据类型有text和date两种
            //var renderArea = data.search_result_render_area_ID;  //提供一个该搜索页面上的可渲染的区域（可使用其作为滚动的容器）
            $("#CMP_SearchContent").hide();
            
            if (type == "date") {
            	page.textfield = result.searchKey[0];
            	page.textfield1 = result.searchKey[1]
            } else {
            	page.textfield  = result.searchKey[0];
            }
            page.conditionKey =  condition;
            page.edocType = edocType;
            page.listType = listType;
            
            isSearch = true;
            var params = [{},page];
            
            //查询时listview要加上crumbsId参数
        	searchCondition.searchCrumbsId = "search" + cmp.buildUUID();
        	
        	if (type == "date") {
            	pageX.searchCondition.dateBegin = result.searchKey[0];
            	pageX.searchCondition.dateEnd = result.searchKey[1];
            } else {
            	dataSoure = result.searchKey[0];
            }
        	//查询条件返回
            pageX.searchCondition.type = type;
            pageX.searchCondition.condition = condition;
            pageX.searchCondition.text = data.text;
            pageX.searchCondition.value = dataSoure;
            
            loadData(params);
        }
    });
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
}

function _goBack(){
	
    cmp.webViewListener.fire({
        type: 'edoc.ListRefresh'
    });
    
    cmp.href.back();
}

/**
 * 列表添加点击事件
 */
function addEdocListHref(){
	cmp("#edocSummaryList").on('tap', ".col-list-cell-info", function (e) {
		cmp.storage.save(_storge_key, JSON.stringify(page), true);
		var param = {
				"affairId":this.getAttribute("affairId"),
				"openFrom":page.listType
		};
		cmp.href.next(_edocPath + "/html/edocSummary.html?r="+Math.random()+"&cmp_orientation=auto",param);
	})
}

//删除缓存数据
function _M3_Remove_Storage(){
	cmp.storage.delete(_storge_key, true);
}
