var urlParam;

var page = {};
var refreshListview = false;

var searchCondition = {};
var pageX = {};
pageX.cacheKey = "m3_v5_edocList_cache_key";
pageX.cacheData = {
        peivMenu : null
}
pageX.loadAll = false; //是否刷新之前的所有数据
pageX.searchCondition = {};//查询条件

/********************************** 初发化方法  ***********************************/

cmp.ready(function(){
	
	urlParam = cmp.href.getParam() || {};
	pageX.cacheData.edocType = urlParam.edocType || "";

	var urlListType = EdocUtils.getHrefParam("listType");
	if(urlListType){
		if(urlListType == "send"){
			pageX.cacheData.edocType = "0";
		}else if(urlListType == "receive"){
			pageX.cacheData.edocType = "1";
		}else if(urlListType == "report"){
			pageX.cacheData.edocType = "2";
		}
	}

	//初始化返回事件
	initPageBack();
	
	cmp.i18n.init(_edocPath+"/i18n/", "EdocResources", function() {
		
		//数据缓存机制，不用每次打开刷新页面
		initInStorage();
    	
		//从数据库中取数据
		initPageData();
		
		//初始化事件
		initEvent();
		
	},$verstion);
	
	cmp.event.orientationChange(function(orientation){ 
	    if(orientation == "portrait"){ 
	        //此时为竖屏 
	        cmp.listView("#allPending").refreshHeight($("#allPending").height()); 
	   }else { 
		   //此时为横屏 
		   cmp.listView("#allPending").refreshHeight($("#allPending").height()); 
	   } 
	}) 
	
});

/****************************** 监听返回事件(放到最前头)  ******************************/

function initPageBack() {
    
	//监听点击设备的回退事件
    cmp.backbutton();
    if(EdocUtils.isFromM3NavBar()){
    	cmp.backbutton.push(cmp.closeM3App);
    }else{
    	cmp.backbutton.push(_goBack);
    }
}

function _goBack() {
    
    if(EdocUtils.getBackURL() == "weixin"){
        //返回到外层, 微信入口逻辑，因为微信没办法返回到首页，所以这样处理， 暂时不要和else分支合并
        cmp.href.closePage();
    }else {
        //返回到外层
        cmp.href.back();
    }
}

/********************************** 缓存操作  ***********************************/

function initInStorage() {
    
    
    var cacheData = cmp.storage.get(pageX.cacheKey, true);
    if(cacheData) {
        pageX.cacheData = JSON.parse(cacheData); 
        cmp.storage.delete(pageX.cacheKey, true);
    }
}

//存储状态数据
function _M3_Save_Storage() {
	cmp.storage.save(pageX.cacheKey, JSON.stringify(pageX.cacheData), true);
}

/********************************** 页面数据初始化  ***********************************/

function initPageData() {
    
    //注册缓加载
    _registLazy();
    
    if(!pageX.cacheData.peivMenu){
        
        cmp.dialog.loading();
        $s.EdocResource.edocUserPeivMenu({}, {
            success : function(result) {
                cmp.dialog.loading(false);
                pageX.cacheData.peivMenu = result;
                _initPervMenu(pageX.cacheData.peivMenu);
            },
            error: function(result){
                cmp.dialog.loading(false);
                EdocUtils.ajaxErrorHander(result);
            }
        });	
    }else{
        _initPervMenu(pageX.cacheData.peivMenu);
    }
}

function _initPervMenu(result){
    if(result) {
        _edocUserPeivMenu(result);
        
        loadData([{},page]);
        
        initHtml();
        
        initEdocTypeCount();
        
        //启动懒加载
       LazyUtil.startLazy();
    }else{
        _alert(cmp.i18n("Edoc.exception.noPermissionException"));
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

function _edocUserPeivMenu(data) {
	if(data.haveEdocSend){//发文管理
		document.querySelector("#sendTab").style.display="";
	}
	if(data.haveEdocSignReport){//签报管理
		document.querySelector("#reportTab").style.display="";
	}
	if(data.haveEdocRec){//收文管理
		document.querySelector("#receiveTab").style.display="";
	}
}

function initEdocTypeCount() {
	$s.EdocResource.getListSizeByEdocType({}, {
	     success : function(result) {
	         renderEdocTypeData(result[0], "send");
	         renderEdocTypeData(result[1], "receive");
	         renderEdocTypeData(result[2], "report");
	         
	         initEvent_subList();
	     },
	     error: function(result){
	    	 EdocUtils.ajaxErrorHander(result);
	     }
	});
}

/**
 * 填充发文、收文、签报的数量列表
 * @param result
 * @param replaceDiv
 */
function renderEdocTypeData(result,replaceDiv) {
    var pendingTPL = $("#doc_type_tpl").html();
    var html = cmp.tpl(pendingTPL, result);
    $("#"+replaceDiv).html(html);
    cmp.IMG.detect();
}

function loadData(parmas){
	
	initSearchHTML();
	
	 cmp.listView("#allPending", {
	     imgCache:true,
         config: {
        	 //captionType:1,
             //height: 50,//可选，下拉状态容器高度
             onePageMaxNum:60,
             isClear: true,
             pageSize: 20,
             crumbsID : searchCondition.searchCrumbsId ? searchCondition.searchCrumbsId : "#allPending",
             params: parmas,
             dataFunc: function(fn,parmas,options){
            	 pageX.pageNo = parmas.pageNo;
            	 
            	 if(pageX.loadAll){
            		 parmas.pageNo = 1;
            		 parmas.pageSize = pageX.pageNo * parmas.pageSize;
 	        		 pageX.loadAll = false;
 	        	}
            	 
            	 $s.EdocResource.getAllPending({}, parmas, {
		    		success : function(result) {
		    			if(options.success) {
		            		options.success(result);
		            	}
		            },
		            error : function(result){
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
             contentnomore: cmp.i18n("Edoc.state.noMore") //可选，请求完毕若没有更多数据时显示的提醒内容；
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
 * 加载模板数据
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
    var pendingTPL = $("#list_li_tpl").html();
    var html = cmp.tpl(pendingTPL, result);
    if (isRefresh || refreshListview) {//是否刷新操作，刷新操作 直接覆盖数据
        $("#allPendingList").html(html);
        refreshListview = false;
    } else {
    	var table = $("#allPendingList").html();
    	$("#allPendingList").html(table+html);
    }
    cmp.IMG.detect();
    
    setTimeout(function(){
    	cmp.listView("#allPending").refresh();
    }, 1000);
}

/********************************** 页面布局  ***********************************/

function initHtml() {
	//国际化title标签
	document.querySelector("title").innerText=cmp.i18n("Edoc.title.edoc");
	if(pageX.cacheData.edocType) {
		toList();	
		pageX.cacheData.edocType = null;
	}
}

function toList() {
	var edocType = pageX.cacheData.edocType;
	
	if(edocType=="0" || edocType=="1" || edocType=="2") {
		$("#searchHeader").css("display", 'none');
	}
	
	var tabs = _$("#listTabs").querySelectorAll(".cmp-control-item");
	for(var i = 0; i < tabs.length; i++){
		if(tabs[i].getAttribute("edocType") == edocType) {
			var classA = tabs[i].classList;
			if(!classA.contains("cmp-active")){
				classA.add("cmp-active");
			}
			var classList = _$(tabs[i].getAttribute("href")).classList;
			if(!classList.contains("cmp-active")){
				classList.add("cmp-active");
			}
		} else {
			var classA = tabs[i].classList;
			if(classA.contains("cmp-active")){
				classA.remove("cmp-active");
			}
			var classList = _$(tabs[i].getAttribute("href")).classList;
			if(classList.contains("cmp-active")){
				classList.remove("cmp-active");
			}
		}
	}
}

/********************************** 初始化控件事件  ***********************************/

function initEvent() {
	
	document.getElementById("sendTab").addEventListener("tap",function(){
		$("#searchHeader").css("display",'none');
		$("#reSearch").css("display",'none');
		_$("#dataCommonDiv").style.top = "0";
	});
	document.getElementById("receiveTab").addEventListener('tap', function () {
		$("#searchHeader").css("display",'none');
		$("#reSearch").css("display",'none');
		_$("#dataCommonDiv").style.top = "0";
	});
	document.getElementById("reportTab").addEventListener('tap',function () {
		$("#searchHeader").css("display",'none');
		$("#reSearch").css("display",'none');
		_$("#dataCommonDiv").style.top = "0";
	});
	document.getElementById("allPendingTab").addEventListener('tap',function (e) {
		initSearchHTML();
		//清空查询条件
		urlParam.edocType = "-1";
	});
	
	cmp("#allPendingList").on('tap', ".col-list-cell-info", function(e) {
		var openFrom = "";
		if(this.getAttribute("affairState")=="3") {
			if(this.getAttribute("subState")=="13" || this.getAttribute("subState")=="19") {
				openFrom = "listZcdb";	
			} else {
				openFrom = "listPending";	
			}
		} else if(this.getAttribute("affairState")=="2") {
			openFrom = "listSent";
		} else if(this.getAttribute("affairState")=="1") {
			openFrom = "listWaitSend";
		} else {
			openFrom = "listDoneAll";
		}
		var param = {
			"affairId" : this.getAttribute("affairId"),
			"openFrom" : openFrom
		};
		
		//保存缓存
		_M3_Save_Storage();
		
		var option = {};
		if(EdocUtils.isFromM3NavBar()){
			option.openWebViewCatch = true;
		}
		
		cmp.href.next(_edocPath + "/html/edocSummary.html?cmp_orientation=auto", param, option);
	});
	
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
	

    cmp.webViewListener.add({
        type: 'edoc.ListRefresh'
    });
    document.addEventListener("edoc.ListRefresh", function(ret){
    	pageX.loadAll = true;
    	refreshListview = true;
    	cmp.listView("#allPending").pullupLoading(pageX.pageNo);
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
            //var id = result.id;       //返回模块的唯一标识
        	
            //var name = result.name;   //返回模块的名称
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
            
            refreshListview = true;
            
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

function initEvent_subList() {
	cmp(".doc-list-wrap").on('tap', ".selectNoCss", function (e) {
		
		pageX.cacheData.edocType = this.getAttribute("edocType");
		_M3_Save_Storage();
		
		var params ={listType: this.getAttribute("listType"), edocType:this.getAttribute("edocType")};

		var option = {};
		if(EdocUtils.isFromM3NavBar()){
			option.openWebViewCatch = true;
		}
		
		cmp.href.next(_edocPath + "/html/edocSummaryList.html", params, option);
	});
}
