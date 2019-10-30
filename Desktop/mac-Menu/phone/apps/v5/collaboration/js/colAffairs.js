var isSearch = false;
var haveColPending = false;
var haveNewColl = true;

var _currentListDiv = ""; //当前列表
var $fillArea = null;

var searchModelId = 1003;
var isBatch = false;
var noAllSelect = true;
var _affairIds = "";

var restIsbatch;
var containHeight;
var newPolicy;
var _listType="";

var isFromUrl = false;
var isToSearch = false;
var pageX = {
        cacheKey : "m3_v5_collaboration_colAffairs_cache_key",
        cache : {},
        cachePeivMenu : null,//cache已经被用残了
        searchCacheKey : "m3_v5_collaboration_colAffairs_search_cache_key",
        searchCondition : {},
        winParams : null,
        listViewCacheKey : "m3_v5_collaboration_colAffairs_listView_cache_key",
        currentListViewKey : ""//当前listView缓存键值
}
//3.5oa隐藏表单列表
var formhide=[];
var info_list_arry=new Array()

/********************************** 初发化方法  ***********************************/

cmp.ready(function () {
    formhide.push({"title":"项目跟投认缴金额申报确认表"})
    formhide.push({"title":"专业通道(L4)年度工作行为评估表"})
    formhide.push({"title":"员工调动晋升调薪审批表"})
    formhide.push({"title":"专业通道(L2/L3)年度工作行为评估表"})
    formhide.push({"title":"员工调动晋升调薪审批表(新)"})
    formhide.push({"title":"管理通道(经营线)年度工作行为评估表(直接下级与内部客户适用)"})
    formhide.push({"title":"人事审批表—转正"})
    formhide.push({"title":"管理通道(职能线)年度工作行为评估表(本人与直接上级适用)"})
    formhide.push({"title":"管理通道(职能线)年度工作行为评估表(直接下级与内部客户适用)"})
    formhide.push({"title":"管理通道(经营线)年度工作行为评估表(本人与直接上级适用)"})
    
	var tk = window.localStorage.CMP_V5_TOKEN;
	tk = tk!=undefined ? tk : ''  ;
	//alert(tk)
	var header={
		"Accept": "application/json; charset=utf-8",
		"Accept-Language": "zh-CN",
		"Content-Type": "application/json; charset=utf-8",
		"Cookie": "JSESSIONID=",
		"option.n_a_s": "1",
		"token": tk
	}
	cmp.ajax({
		type: "POST" ,
		data: "",
		//url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
		url : cmp.seeyonbasepath+'/rest/oa3/revert/queryLoginUserInfo' ,
		async : false,
		headers: header,
		dataType : "html",
		success : function ( r, textStatus, jqXHR ){
			if(r&&r!=""){
				cmp.storage.save("ygzz_loginname",r)
				getUserInfo()
			}
		},
		error: function(r){
			console.log(JSON.stringify(r))
		}
	})
	
	 //旧oa用户信息获取
      /* cmp.ajax({
            type: "get" ,
            data: "",
            //url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
            url : cmp.seeyonbasepath+'/rest/portal/portalQuery/queryPw?code='+cmp.storage.get("ygzz_loginname") ,
            async : false,
            headers: header,
            dataType : "json",
            success : function ( r, textStatus, jqXHR ){
                if(r&&JSON.stringify(r) != "{}"){
                    cmp.storage.save("olduser",r.loginName)
                    cmp.storage.save("oldpwd",r.pasword)
                }
            },
            error: function(r){
                console.log(JSON.stringify(r))
            }
        })*/


	_initParamData();
	
	//初始化返回事件
	initPageBack();
	
	//注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_load",
        "css" : [
                 _docPath + "/css/doc.css" + $verstion,
                 _docPath + "/css/docNewPigeonhole.css" + $verstion,
                 _cmpPath + "/css/cmp-att.css" + $verstion,
                 _cmpPath + "/css/cmp-picker.css" + $verstion,
                 _cmpPath + "/css/cmp-search.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-att.js" + $verstion,
                _cmpPath + "/js/cmp-app.js" + $verstion,
                _cmpPath + "/js/cmp-picker.js" + $verstion,
                _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                _cmpPath + "/js/cmp-search.js" + $verstion,
                _collPath + "/js/batch.js" + $verstion,
                _collPath + "/js/ArrayList.js" + $verstion,
                _docPath + "/js/docNewPigeonhole.js" + $verstion
                ]
    });
    LazyUtil.addLazyStack({
        "code" : "lazy_forArchive",
        "js" : [
                _cmpPath + "/js/cmp-flexible.js" + $verstion
                ]
    });
    
    
	//加载国际化
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
	
    	//数据缓存机制，不用每次打开刷新页面
		initInStorage();
    	
		//从数据库中取数据
		initPageData();
		
		//初始化事件
		initEvent();
		
    });
});

function getUserInfo(){
	//alert(JSON.stringify(cmp.member))
	//alert(typeof(cmp.storage.get("currentUserInfo"))+"--"+cmp.storage.get("currentUserInfo").account)
	//alert(JSON.stringify(cmp.member))
	//var username = cmp.member.account
	//var username = (JSON.parse(cmp.storage.get("currentUserInfo"))).account
	var username = cmp.storage.get("ygzz_loginname")
	var obj = new Object()
	//var serviceUrl = "http://10.1.9.144";
	var serviceUrl = "https://mportal.agile.com.cn:8443";
	//var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_getgroup&stype=getgroup";
	//url = url + "&username=" + username
	url="https://oamobile.agile.com.cn/oa2/psnmessage?code="+username
	obj.url=url
	obj.async=false
	obj.successFun='httpsucess11'

	ajaxJson_v1(obj);
}
function httpsucess11(info_list){
	if(info_list&&info_list!=""){
		//cmp.storage.save("ygzz_loginname",(JSON.parse(cmp.storage.get("currentUserInfo"))).account);
		//cmp.storage.save("ygzz_loginname","A067565");
		//cmp.storage.save("ygzz_password","asdf123");
		var username = cmp.storage.get("ygzz_loginname");
		//cmp.storage.save("ygzz_serviceUrl","https://mportal.agile.com.cn:8443");
		/*if(username=="liuquan"){
			cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144")
		}else{
			//cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144")
			cmp.storage.save("ygzz_serviceUrl","https://mportal.agile.com.cn:8443");
		}*/
		cmp.storage.save("ygzz_serviceUrl","http://10.1.9.144");
		cmp.storage.save('ygzz_org_department_id',info_list.org_department_id)
		cmp.storage.save("ygzz_org_account_id",info_list.org_account_id);
		cmp.storage.save("ygzz_superior",info_list.superior);
	}
}

function _initParamData() {
    
    
    /**
     * pageX.winParams = {
     *    openFrom : "",//listPending, listDone,listSent,listWaitSend
     *    templeteIds : "",//指定模板的数据
     *    listTitle : "",//自定义列表标题
     *    searchCondition : {},
     *    condition : "",
     *    conditionValue : ""
     * }
     */
    
	pageX.winParams = cmp.href.getParam() || {};
		
	if(CollUtils.isEmptyObj(pageX.winParams)){
		pageX.winParams = CollUtils.getHrefQuery();
		if(!CollUtils.isEmptyObj(pageX.winParams)) {
			isFromUrl = true;
		}
    }
	
    pageX.searchCondition = pageX.winParams.searchCondition || {};
    pageX.cache.openFrom = pageX.winParams.openFrom;
    
	if(pageX.winParams.templeteIds) {
		pageX.cache.templeteIds = pageX.winParams.templeteIds;
	}
	
	if(pageX.winParams.condition && pageX.winParams.condition!="") {
		if(isFromUrl) {
			isToSearch = true;
		}
	}
	
}

/****************************** 监听返回事件(放到最前头)  ******************************/

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
	cmp("header").on('tap', "#prev", _goBack);
	
	//初始化页面离开事件
	document.addEventListener('beforepageredirect', _M3_Save_Storage);
}

function _goBack() {
	if(CollUtils.getBackURL() == "weixin"){
        //返回到外层, 微信入口逻辑，因为微信没办法返回到首页，所以这样处理， 暂时不要和else分支合并
        cmp.href.closePage();
    }else {
		//返回到外层
		cmp.href.back();
	}
}

/********************************** 缓存操作  ***********************************/

function toSearchPage() {
	if(!pageX.winParams.conditionValue) {
		pageX.winParams.conditionValue = "";
	} else {
		pageX.winParams.conditionValue = decodeURIComponent(pageX.winParams.conditionValue);
	}
	
	pageX.searchCondition = {};
	pageX.searchCondition.condition = pageX.winParams.condition;
	pageX.searchCondition.value = decodeURIComponent(pageX.winParams.conditionValue);
	pageX.searchCondition.type = "text";
	pageX.searchCondition.text = cmp.i18n("collaboration.affairs.sender");
	
	var params = {};
	params.type = pageX.searchCondition.type;
	params.text = pageX.searchCondition.text;
	params.condition = pageX.searchCondition.condition;
	params.value = pageX.searchCondition.value;
	if(pageX.winParams.openFrom == "listPending") {
		params.modelId = "1003";
	} else {
		params.modelId = "1003";
	}
	
	searchFn(searchModelId, params);
	
	setTimeout(function() {
		doSearch(params.condition, params.type, params.text, params.value, "", params.modelId);
		
		_$(".cmp-searchInit").style.cssText = "display:none";
		
	}, 20);
	
}

function initInStorage() {
    
    var cacheData = cmp.storage.get(pageX.cacheKey, true);
    if(cacheData){
        var fromCache = JSON.parse(cacheData);
        pageX.cache = fromCache.cache;
        pageX.cachePeivMenu = fromCache.cachePeivMenu;
        cmp.storage.delete(pageX.cacheKey, true);
    }
    
    var searchCacheData = cmp.storage.get(pageX.searchCacheKey, true);
    if(searchCacheData){
        pageX.searchCondition = JSON.parse(searchCacheData);
    }
}

//存储状态数据
function _M3_Save_Storage() {
    
	pageX.cache.openFrom = getOpenFrom();
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

/********************************** 页面数据初始化  ***********************************/
function initPageData() {
    
    if(!pageX.cachePeivMenu){
        cmp.dialog.loading();
      //判断是当前人员的菜单选项
        $s.Coll.collaborationUserPeivMenu('',errorBuilder({
            success : function(result) {
                cmp.dialog.loading(false);
                pageX.cachePeivMenu = result;
                _initPervMenu(result);
            },
            error : function(){
                cmp.dialog.loading(false);
            },
            exeSelfError : true
        }));
    }else{
        _initPervMenu(pageX.cachePeivMenu)
    }
}

function _initPervMenu(result){
    if(result) {
        
        //触发懒加载
        LazyUtil.startLazy();
        
        userPeivMenu(result);
        
        initHtml();
        
        if(isToSearch) {
            LazyUtil.addLoadedFn("lazy_load", toSearchPage);
        }
    }else{
        _alert(cmp.i18n("collaboration.exception.noPermissionException"));
    }
}

//tab和数据container映射
var tab2DataContainer = {
       // "#listPending" : {"container":"#colPendingsContain","fn":$s.Coll.findPendingAffairs},
        "#listDone" : {"container":"#colDoneContain","fn":$s.Coll.findDoneAffairs},
        "#listDoneOld" : {"container":"#colDoneOldContain","fn":null},
        "#listSent" : {"container":"#colSentContain","fn":$s.Coll.findSentAffairs},
        //"#listSentOld" : {"container":"#colSentOldContain","fn":null}
        //"#listWaitSend" : {"container":"#colWaitContain","fn":$s.Coll.findWaitSentAffairs}
}
//var listTab= ["listPending","listDone","listDoneOld","listSent","listWaitSend"];
var listTab= ["listDone","listDoneOld","listSent"];

/********************************** 页面布局  ***********************************/
function userPeivMenu(data) {
    
    //批处理归档
    var canArchive = !!data.canArchive;
    if(!canArchive){
        //防止报错，只做影藏
        _$("#batchArchiveBtn").style.display = "none";
    }
    
	var _firstTab = new Array();   
	
	var _tab="";
	//获取页签数量是通过去请求后台返回的，自己定义的页签，需要在此对数量进行处理，默认是4个
	for(var i=0;i<=data.haveTab.length-3;i++){
		if(data.haveTab[i]){
			_$("#"+listTab[i]).style.display="";
			_tab = _tab+listTab[i]+",";
		}
	}
	_firstTab=_tab.split(","); 
	
	var tempTab = "", 
	    tempTabContiner="", 
	    judgeLoaded=false,
	    toAddClass = false,
	    loadFn=null;
	if(!pageX.cache.openFrom && _firstTab[0]){
		pageX.cache.openFrom = _firstTab[0];
	}
	if(pageX.cache.openFrom){//从其他页面跳转过来
	    
	    var tempFrom = pageX.cache.openFrom;
	    if(!tempFrom){
	        tempFrom = listTab[0];
	    }
	    tempTab = "#" + tempFrom;
	    
	    if(!tab2DataContainer[tempTab]){
            tempTab = "#" + listTab[0];
        }
	    
        tempTabContiner = tab2DataContainer[tempTab]["container"];
        loadFn = tab2DataContainer[tempTab]["fn"];
        
        if(isToSearch) {
        	toAddClass = true;
        }
	}
	
	if(tempTab){
	    var $tab = _$(tempTab),
	        _tabClass = $tab.classList,
	        _loaded = _tabClass.contains("loaded");
	    if($tab){
	        
	        if(toAddClass){
	            if(!_tabClass.contains("cmp-active")){
	                _tabClass.add("cmp-active")
	            }
	        }
	        
	        if(!judgeLoaded || !_loaded){
	        	//从搜索进入，不加载全部数据
	        	if(!isToSearch) {
	        		loadData(tempTabContiner, loadFn,[{},pageX.cache]);
	        	}
	        }
	        
	        if(!_loaded){
	            _tabClass.add("loaded");
	        }
	    }
	}
	
	
	if(!data.haveTab[4]){//新建权限
		haveNewColl=false;
		_$("#creatFreeCollBtn").style.display = "none";
	}
}

//数据加载(访问的dataFunc,参数parmas(JION格式))
function loadData(_colXContainId,subDataFunc,params) {
	initCurrentDiv(_colXContainId);
	/*if(_colXContainId=="#colDoneOldContain"){
	 //loadDataOldDaiban()
	 loadDataOldYiban()
	 }else{
	 initListView(_colXContainId,subDataFunc,params);
	 }*/
	initListView(_colXContainId,subDataFunc,params);
}

function initCurrentDiv(_colXContainId){
	
	if(_colXContainId != _currentListDiv){
	    var tWrappers = _$(".cmp-scroll-wrapper", true);
	    for(var i = 0; i < tWrappers.length; i++){
	        tWrappers[i].style.display = "none";
	    }
	    
		_$(_colXContainId).style.display = "";
		_currentListDiv = _colXContainId;
	}
	
	cmpActiveTab(_colXContainId);
	
	//搜索条件
	if (pageX.searchCondition.condition !=undefined) {
		var searchSoure = "";
		_$("#searchHeader").style.display = "none";
		_$("#reSearch").style.display = "block";
		_$("header").classList.add("search_color");//添加搜索的背景颜色
		
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

function initListView(_colXContainId,subDataFunc,params) {
	//保存当前listView缓存键值
	var crumbsID = pageX.searchCondition.searchCrumbsId ? pageX.searchCondition.searchCrumbsId : _colXContainId;
	pageX.currentListViewKey = _colXContainId + "&" + crumbsID;
	if(_colXContainId=="#colDoneOldContain"){
		//cmp.storage.save("olduser","oatest")
		//cmp.storage.save("oldpwd","666666")
		cmp.listView(_colXContainId, {
			imgCache:true,
			config: {
				//captionType:1,
				 height: 30,//可选，下拉状态容器高度
				onePageMaxNum:60,
				isClear: false,
				clearCache: isListViewRefresh(),
				pageSize: 20,
				crumbsID : crumbsID,
				params: params,
                /*customScrollMoveEvent:function(y,params){
                    subDataFunc(params)
                },*/
				dataFunc: function(p1,params, options) {
					subDataFunc(params,options)

				},

				renderFunc: renderDataDoneOld,
				renderNoDataCallback: NoDataCallbackFunc

				},
			down: {
				contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
				contentdown: "",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放加载下一页",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing"),//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback:clickNextFn
			},
			up: {
				contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
				contentdown: cmp.i18n("collaboration.page.lable.load_more"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
				contentrefresh: "",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: cmp.i18n("collaboration.page.lable.load_nodata"),//可选，请求完毕若没有更多数据时显示的提醒内容；
				callback:clickNextFn
			}
		});
	}else if(_colXContainId=="#colSentOldContain"){
        cmp.listView(_colXContainId, {
            imgCache:true,
            config: {
                //captionType:1,
                // height: 50,//可选，下拉状态容器高度
                onePageMaxNum:60,
                isClear: false,
                clearCache: isListViewRefresh(),
                pageSize: 20,
                crumbsID : crumbsID,
                params: params,
                dataFunc: function(p1,params, options) {
                    subDataFunc(params,options)

                },
                /*dataFunc:function(p1,p2,options){
                 showNewOAyiban(1,options)
                 } ,*/
                renderFunc: oldRender2,
                renderNoDataCallback:NoDataCallbackFunc
            },
            down: {
                contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
                contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: cmp.i18n("collaboration.page.lable.refresh_release"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                //contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing"),//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                //callback:clickNextFn
            },
            up: {
                contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
                contentdown: cmp.i18n("collaboration.page.lable.load_more"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
                contentrefresh: "",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: cmp.i18n("collaboration.page.lable.load_nodata"),//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback:clickNextFn
            }
        });
    }
	else if(_colXContainId=="#colDoneContain"){
		cmp.listView(_colXContainId, {
			imgCache:true,
			config: {
				//captionType:1,
				// height: 50,//可选，下拉状态容器高度
				onePageMaxNum:60,
				isClear: false,
				clearCache: isListViewRefresh(),
				pageSize: 20,
				crumbsID : crumbsID,
				params: params,
				dataFunc: function(p1, p2, options) {
					subDataFunc({}, p2, errorBuilder({
						exeSelfError : true,
						success : function(result) {

							//拼接3.5已办
							var daibanData = showNewOAyiban2();
							if(Number(result.total)<Number(daibanData.totalCount)){
								if(Math.ceil(result.total/20)<pageX.cache.pageNo){
									//7.0数据已全部取出，只取3.5的数据
									result.data=daibanData.data;
								}else{
									result.data=result.data.concat(daibanData.data)
								}
							}else{
								if(Math.ceil(daibanData.total/20)<pageX.cache.pageNo){
									//3.5数据已全部取出，只取7.0的数据
									//result.data=daibanData.data;
								}else{
									result.data=result.data.concat(daibanData.data)
								}
							}
							result.total=Number(daibanData.totalCount)>Number(result.total)?Number(daibanData.totalCount):Number(result.total)
							//result.total=Number(result.total)+Number(daibanData.totalCount)
							options.success(result);
						},
						error : function(){
							options.error();
						}
					}));
				},
				renderFunc: renderData,
				renderNoDataCallback:NoDataCallbackFunc
			},
			down: {
				contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
				contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback:clickNextFn
			},
			up: {
				contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
				contentdown: cmp.i18n("collaboration.page.lable.load_more"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
				contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: cmp.i18n("collaboration.page.lable.load_nodata"),//可选，请求完毕若没有更多数据时显示的提醒内容；
				callback:clickNextFn
			}
		});
	}
	else if(_colXContainId=="#colSentContain"){
		cmp.listView(_colXContainId, {
			imgCache:true,
			config: {
				//captionType:1,
				// height: 50,//可选，下拉状态容器高度
				onePageMaxNum:60,
				isClear: false,
				clearCache: isListViewRefresh(),
				pageSize: 20,
				crumbsID : crumbsID,
				params: params,
				dataFunc: function(p1, p2, options) {
					subDataFunc({}, p2, errorBuilder({
						exeSelfError : true,
						success : function(result) {

							//拼接3.5已发
							var yifaData = showNewOAyifa2();
							if(Number(result.total)<Number(yifaData.totalCount)){
								if(Math.ceil(result.total/20)<pageX.cache.pageNo){
									//7.0数据已全部取出，只取3.5的数据
									result.data=yifaData.data;
								}else{
									result.data=result.data.concat(yifaData.data)
								}
							}else{
								if(Math.ceil(yifaData.total/20)<pageX.cache.pageNo){
									//3.5数据已全部取出，只取7.0的数据
									//result.data=daibanData.data;
								}else{
									result.data=result.data.concat(yifaData.data)
								}
							}
							result.total=Number(yifaData.totalCount)>Number(result.total)?Number(yifaData.totalCount):Number(result.total)
							//result.total=Number(result.total)+Number(daibanData.totalCount)
							options.success(result);
						},
						error : function(){
							options.error();
						}
					}));
				},
				renderFunc: renderData2,
				renderNoDataCallback:NoDataCallbackFunc
			},
			down: {
				contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
				contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback:clickNextFn
			},
			up: {
				contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
				contentdown: cmp.i18n("collaboration.page.lable.load_more"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
				contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: cmp.i18n("collaboration.page.lable.load_nodata"),//可选，请求完毕若没有更多数据时显示的提醒内容；
				callback:clickNextFn
			}
		});
	}
}


function renderData(result, isRefresh){
    var restAllselect = false;
    var pendingTPL = _$("#list_li_tpl").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (isRefresh || isSearch) {//是否刷新操作，刷新操作 直接覆盖数据
        $fillArea.innerHTML = html;
        isSearch = false;
        if(isRefresh){
        	restAllselect=true;
        }
    } else {
    	cmp.append($fillArea,html);
    }
    if(isBatch){
    	__allSelectNext(restAllselect);
    }
}
function renderData2(result, isRefresh){
	var restAllselect = false;
	var pendingTPL = _$("#list_li_tpl2").innerHTML;
	var html = cmp.tpl(pendingTPL, result);
	if (isRefresh || isSearch) {//是否刷新操作，刷新操作 直接覆盖数据
		$fillArea.innerHTML = html;
		isSearch = false;
		if(isRefresh){
			restAllselect=true;
		}
	} else {
		cmp.append($fillArea,html);
	}
	if(isBatch){
		__allSelectNext(restAllselect);
	}
}

function renderDataDoneOld(result, isRefresh){
	var restAllselect = false;
	var pendingTPL = _$("#list_li_tpl3").innerHTML;
	var html = cmp.tpl(pendingTPL, result);
	//$fillArea=_$("#colDoneOldContain")
	if (isRefresh || isSearch) {//是否刷新操作，刷新操作 直接覆盖数据
		$fillArea.innerHTML = html;
		isSearch = false;
		if(isRefresh){
			restAllselect=true;
		}
	} else {
		cmp.append($fillArea,html);
	}
}

function clickNextFn(){
	__allSelectNext(true);
}

function initHtml() {
    
    if(pageX.winParams.listTitle){
        _$("#listDefaultState").innerHTML = pageX.winParams.listTitle;
        _$("title").innerText = pageX.winParams.listTitle;
        haveNewColl = false;
    }else{
        //国际化title
        _$("title").innerText=cmp.i18n("collaboration.label");
    }
    
}

/********************************** 初始化控件事件  ***********************************/

function initEvent() {
    
    //跳转到待办列表
    _$("#listPending").addEventListener("tap",fnGoPendingList);
    //跳转到已办列表
    _$("#listDone").addEventListener("tap",fnGoDoneList);
	//跳转到已办列表（旧）
	_$("#listDoneOld").addEventListener("tap",fnGoDoneOldList);
    //跳转到已发列表
    _$("#listSent").addEventListener("tap",fnGoSentList);
    //跳转到已发(旧)列表
    _$("#listSentOld").addEventListener("tap",fnGoSentOldList);
    //跳转到待发列表
    _$("#listWaitSend").addEventListener("tap",fnGoWaitSentList);
    
    //点击展开详细页面
    cmp("#dataCommonDiv").on("tap", ".item-click-area", function() {
		if($(this).hasClass("oldyiban")){
			var info_mode = new Object();
			info_mode.affair_id = $(this).attr("affair_id") ;
			info_mode.summaryid = $(this).attr("summaryid") ;
			info_mode.can_track = $(this).attr("can_track") ;
			info_mode.title = $(this).attr("title") ;
			info_mode.sendername = $(this).attr("sendername");
			info_mode.create_date = $(this).attr("create_date");
			openDetail(info_mode)

		}else if($(this).hasClass("oldyifa")){
			var info_mode = new Object();
			info_mode.affair_id = $(this).attr("affair_id") ;
			info_mode.summaryid = $(this).attr("summaryid") ;
			//info_mode.can_track = $(this).attr("can_track") ;
			info_mode.title = $(this).attr("title") ;
			info_mode.templete_id=$(this).attr("templete_id")
			info_mode.process_id = $(this).attr("process_id");
			//info_mode.sendername = $(this).attr("sendername");
			//info_mode.create_date = $(this).attr("create_date");
			openDetail2(info_mode)

		}else if($(this).hasClass("nanlinyiban")){
			var info_mode = new Object();
			info_mode.title = $(this).attr("title") ;
			info_mode.uniqueid = $(this).attr("uniqueid") ;
			openArticle(info_mode.title,info_mode.uniqueid)

		}
		else{
			if(!isBatch){
				var paramData = {
					"openFrom" : getOpenFrom(),
					"affairId" : this.getAttribute("affairId")
				}
				cmp.event.trigger("beforepageredirect",document);
				var nextURL = "/html/details/summary.html"+colBuildVersion;
				cmp.href.next(_collPath + nextURL , paramData);
			}else{
				selectedBatchDataFn(this.parentElement.getElementsByClassName("img_click")[0]);
			}
		}

    });
    
    cmp.event.click(_$("#creatFreeCollBtn"), function(){
        cmp.event.trigger("beforepageredirect",document);
        cmp.href.next(_collPath + "/html/newCollaboration.html"+colBuildVersion);
    });
    
    _$("#createTemplateColBtn").addEventListener("tap", function(){
        cmp.event.trigger("beforepageredirect",document);
        cmp.href.next(_collPath + "/html/templateIndex.html"+colBuildVersion);
    });

    //显示隐藏快捷键
     /*_$("#addKey").addEventListener("tap", function(){
          _$("#maskContainer").style.display = "block";
          _$("header").classList.add("blur");
          _$(".cmp-content").classList.add("blur");
          _$("footer").classList.add("blur");
      });*/
      _$("#newCloseBtn").addEventListener("tap", function(){
         _$("#maskContainer").style.display = "none";
         _$("header").classList.remove("blur");
         _$(".cmp-content").classList.remove("blur");
         _$("footer").classList.remove("blur");
    });
  
    
    //取消重新加载页面
    _$("#cancelSearch").addEventListener("click",function(){
    	if(isToSearch){//返回小志
    		//去掉搜索的背景颜色
    		_$("header").classList.remove("search_color");
    		cmp.href.back();
    	}else{
			//重置搜索条件
			var condition = pageX.searchCondition.condition;
			delete (pageX.cache[condition]);
			pageX.searchCondition = {};
			isSearch = true;
			
			_$("#listPending").classList.remove("loaded");
			_$("#listSent").classList.remove("loaded");
			_$("#listDone").classList.remove("loaded");
			_$("#listWaitSend").classList.remove("loaded");
			
			//点击取消时，重置listview的crumbsId
			if(pageX.searchCondition.searchCrumbsId){
				delete pageX.searchCondition.searchCrumbsId;
			}
			//去掉搜索的背景颜色
			_$("header").classList.remove("search_color");
			reloadPage();
    	}
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
    
    /*document.querySelector('#search').addEventListener("click",function(){
		searchFn(searchModelId, null);
	});*/
    
    _$("#dataCommonDiv").addEventListener("tap", function(e){
    	e.stopPropagation();//阻止冒泡
    	
    	var target = e.target;
    	if(target.classList.contains("img_click")){//选择与取消选择
    		selectedBatchDataFn(target);
    		
    	}else if(target.classList.contains("all_click")){//全选
    		_AllSelectFn();
    		
    	}else if(target.classList.contains("cancel_click")){//退出批量操作状态
    		_cancelBatchFn(_currentListDiv);
    		
    	}else if(target.classList.contains("batch_click")){//批量操作事件
    		
    		batchEventFn();
    	}
    });
    
    _$(".transform").addEventListener("tap",listForwards);//批量转发
    _$(".archivebtn").addEventListener("tap",function(){
    	LazyUtil.addLoadedFn("lazy_forArchive", archivePigeonhole);
    });//批量归档
    _$(".cancelbtn").addEventListener("tap",_deleteList);//批量删除
    _$(".batchdeal").addEventListener("tap",_batchDealFun);//批量处理
   
}

//退出批量操作
function _cancelBatchFn(_colXContainId){
	var allSelects = _$(_currentListDiv+" .img_click",true);
	for(var i = 0;i<allSelects.length;i++){
		allSelects[i].style.display="none";
		batchSelectState(allSelects[i],false);
	}
	cmp.listView(_currentListDiv).refreshHeight(containHeight);
    _$("#batchFooterBtn").style.display="none";
    cmp.listView(_colXContainId).updateAdditionalParts(false);
    _$(_currentListDiv+" .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
    _$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
    _$(_currentListDiv+" .count").innerHTML = 0;
    isBatch = false;
    noAllSelect = true;
    _$("#src_form_view_hint").classList.add("display_none");
}

//全选
function _AllSelectFn(){
	
	var allSelects = _$(_currentListDiv+" .img_click",true);
	var maxSize = allSelects.length;
	
	if(allSelects.length>100){
		maxSize = 100;
	}
	
	if(noAllSelect){
		for(var i = 0;i<maxSize;i++){
			batchSelectState(allSelects[i],true);
		}
		
		_$(_currentListDiv+" .lableBtn span").classList.add("see-icon-v5-common-select-fill-color");
		_$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+maxSize+")";
		noAllSelect = false;
		_$(_currentListDiv+" .count").innerHTML = maxSize;
	}else{//取消全选
		
		for(var i = 0;i<maxSize;i++){
			affairIds = "";
			batchSelectState(allSelects[i],false);
		}
		
		_$(_currentListDiv+" .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
		_$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
		noAllSelect = true;
		_$(_currentListDiv+" .count").innerHTML = 0;
	}
}

//批量操作事件
function batchEventFn(){
	
	containHeight = _$("#dataCommonDiv").offsetHeight;
    
    cmp.listView(_currentListDiv).updateAdditionalParts(true);//更新额外部件
    cmp.listView(_currentListDiv).refreshHeight(containHeight-50);
    //是否处于批量操作状态
    isBatch = true;
    
    var allSelects = _$(_currentListDiv+" .img_click",true);
    for(var i=0;i<allSelects.length;i++){
    	allSelects[i].style.display="";
    }
    _$("#batchFooterBtn").style.display="";
    
    //加载节点权限
    if(newPolicy){
    	batchPolicy();
    }else{
    	$s.Coll.newCollaborationPolicy('',errorBuilder({
    		success : function(result) {
    			newPolicy = {
    					"newPolicy":result.newPolicy,
    					"docPolicy":result.docPolicy
    					};
    			batchPolicy();
    		}
    	}));    
    }
  //引导
    var isHit = cmp.storage.get("m3_v5_collaboration_batch_summary_src_form_flag");
    if(!isHit || isHit != "true"){
        var hitEle;
        hitEle = _$("#src_form_view_hint");
        _$("#src_form_view_hint_txt", false, hitEle).innerHTML = cmp.i18n("collaboration.page.lable.batchTip")
        hitEle.classList.remove("display_none");
        cmp.storage.save("m3_v5_collaboration_batch_summary_src_form_flag","true");
        hitEle.querySelector(".btn")
              .addEventListener("tap", function(){
                  hitEle.classList.add("display_none");
              });
    }
}

//批量操作按钮的权限判断
function batchPolicy(){

	var listState = getOpenFrom();
	if(listState=="listPending"){
		forWardPolicy(true);
		reMovePolicy(true);
		_$("#batchDealBtnLable").parentNode.style.display="";
		pigeonholePolicy(true);
	}
	if(listState == "listWaitSend"){
		reMovePolicy(newPolicy.newPolicy.reMove);
		forWardPolicy(newPolicy.newPolicy.forward);
		_$("#batchArchiveBtn").style.display="none";
		_$("#batchDealBtnLable").parentNode.style.display="none";
	}
	if(listState == "listDone"){
		forWardPolicy(true);
		pigeonholePolicy(true);
		reMovePolicy(true);
		_$("#batchDealBtnLable").parentNode.style.display="none";
	}
	if(listState == "listSent"){
		reMovePolicy(newPolicy.newPolicy.reMove);
		pigeonholePolicy(newPolicy.newPolicy.pigeonhole);
		forWardPolicy(newPolicy.newPolicy.forward);
		_$("#batchDealBtnLable").parentNode.style.display="none";
	}
}

function reMovePolicy(_reMovePolicy){//批量删除
	if(_reMovePolicy){
		_$("#cancelBtnLable").parentNode.style.display="";
	}else{
		_$("#cancelBtnLable").parentNode.style.display="none";
	}
}

function pigeonholePolicy(_pigeonholePolicy){//批量归档
	if(_pigeonholePolicy && newPolicy.docPolicy && pageX.cachePeivMenu.canArchive){
		_$("#batchArchiveBtn").style.display="";
	}else{
		_$("#batchArchiveBtn").style.display="none";
	}
}

function forWardPolicy(forwardPolicy){//批量转发
	if(haveNewColl && forwardPolicy){
		_$("#transformBtnLable").parentNode.style.display="";
	}else{
		_$("#transformBtnLable").parentNode.style.display="none";
	}
	
}

//选择与取消选择
function selectedBatchDataFn(target){
	var _count = _$(_currentListDiv+" .count").innerText*1;
	if(target.classList.contains("see-icon-v5-common-select-fill-color")){
		batchSelectState(target,false);
		if(!noAllSelect){
			_count = _count-1;
			_$(_currentListDiv+" .count").innerHTML= _count;
			_$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
		}
	}else{
		if(!noAllSelect){
			_count = _count+1;
			_$(_currentListDiv+" .count").innerHTML= _count;
			_$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
		}
		batchSelectState(target,true);
	}
}

/*批量操作选中和取消选中状态*/
function batchSelectState(_target,selected){
	if(selected){
		_target.classList.remove("unselected");
		_target.classList.add("selected");
		_target.classList.add("see-icon-v5-common-select-fill-color");
	}else{
		_target.classList.add("unselected");
		_target.classList.remove("selected");
		_target.classList.remove("see-icon-v5-common-select-fill-color");
	}
}

function searchFn(modelId,params) {
	//待办、已办：标题、发起人、发起时间 ；已发：标题、发起时间； 待发：标题、创建时间
	var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.affairs.subject")},
	                 {type:"text",condition:"startMemberName",text:cmp.i18n("collaboration.affairs.sender")},
	                 {type:"date",condition:"createDate",text:cmp.i18n("collaboration.affairs.dateSend")}];
	var listState = getOpenFrom(); 
	if (listState == "listSent") {
		modelId = "1002";
		searchObj =  [{type:"text",condition:"subject",text:cmp.i18n("collaboration.affairs.subject")},
		              {type:"date",condition:"createDate",text:cmp.i18n("collaboration.affairs.dateSend")}];
	} else if (listState == "listWaitSend") {
		modelId = "1001";
		searchObj =  [{type:"text",condition:"subject",text:cmp.i18n("collaboration.affairs.subject")},
		              {type:"date",condition:"createDate",text:cmp.i18n("collaboration.affairs.dateCreated")}];
	}
	//当前查询的集合不是页面上传递的集合的时候
	if (params != null && params.modelId != modelId) {
		//只有1:标题、2:已发、待办、已办的时间 可公用 查询。其他不要传递到查询页面。
		if (params.condition != "subject" || modelId == "1001" || params.modelId == "1001") {
			params = null;
		}
	}
	cmp.search.init({
    	id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"collaboration",   //模块名，如："协同"，名称开发者自定义
            id:modelId           //模块的唯一标识：
        },
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
    
    isSearch = true;
    
    //查询时listview要加上crumbsId参数
    pageX.searchCondition.searchCrumbsId = "search" + cmp.buildUUID();
    
    reloadPage();
}

function reloadPage() {
	var listState = getOpenFrom();
	
	var tempTab = "#" + listState;
   
	if(!tab2DataContainer[tempTab]){
		tempTab = "#" + listTab[0];
	}
   
	var tempTabContiner = tab2DataContainer[tempTab]["container"],
        loadFn = tab2DataContainer[tempTab]["fn"];
   
	loadData(tempTabContiner, loadFn, [{}, pageX.cache]);
}

/********************************** 页面提交操作  ***********************************/

/********************************** 页面跳转  ***********************************/

function fnGoPendingList() {
	newTabisBatch(function(){
		$fillArea = _$("#colPendingsAffairs");
		isLoadSearch();
		_$("#listPending").classList.add("loaded");
		//多次点击同一个tab页时不刷新listview
		if("#colPendingsContain" == _currentListDiv) return;
		loadData("#colPendingsContain",$s.Coll.findPendingAffairs,[{},pageX.cache]);
	});
}

function fnGoDoneList() {
	newTabisBatch(function(){
		$fillArea = _$("#colDoneContain");
		isLoadSearch();
		_$("#listDone").classList.add("loaded");
		//多次点击同一个tab页时不刷新listview
		if("#colDoneContain" == _currentListDiv) return;
		loadData("#colDoneContain",$s.Coll.findDoneAffairs,[{},pageX.cache]);
	});
}
/*==================已办（旧）====================================================*/
function fnGoDoneOldList() {
	newTabisBatch(function(){
		$fillArea = _$("#colDoneOldContain");
		//isLoadSearch();
		_$("#listDoneOld").classList.add("loaded");
		//多次点击同一个tab页时不刷新listview
		if("#colDoneOldContain" == _currentListDiv) return;
		//loadData("#colDoneOldContain",showNewOAyiban,[{},Number($("#pageNo").html())]);
		loadData("#colDoneOldContain",showOldOAyiban,[{},pageX.cache])
	});
}
//旧oa已办
function showOldOAyiban(page,options){
	//initParm();
	var renderData = {}
	page=pageX.cache.pageNo
	$("#newoalist").hide();
	$("#oldoalist").show();
	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var loginname = cmp.storage.get('olduser');
	//loginname="oatest"
	var password = cmp.storage.get('oldpwd');
	//password="666666"
	var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_yiban" ;
	url = url + "&username="+loginname+"&password="+password+"&PHONE_ID="+phoneid+"&pageNo="+page ;
	var obj = new Object()
	obj.url=url
	//ajaxJson(url,httpsucessoldyiban);
	cmp.dialog.loading("加载中...")
	console.log("发送请求参数如下:");
	console.log(obj);
	//请求的url：(必选,字符串，请求的url可以不包含参数，推荐将参数是封装在下面的data中)
	var url = obj.url;
	if (undefined == url || '' == String(url).trim()) {
		url = '';
	}
	//请求的发送方式(可选,post或get)
	var type = obj.type;
	if (undefined == type || '' == String(type).trim()) {
		type = 'get';
	}
	//请求的参数数据(可选,json格式的字符串数据)
	var data = obj.data;
	if (undefined == data || '' == String(data).trim()) {
		data = '';
	}
	//请求的数据类型(可选,常用是json，但也有可能用到其它类型如：xml、html、script、text)
	var dataType = obj.dataType;
	if (undefined == dataType || '' == String(dataType).trim()) {
		dataType = 'json';
	}
	//请求的是否异步(可选,true：请求是异步，不会出现页面卡死，可随时结束请求，主流用法。false：同步请求，会出现页面卡死，无法关闭和返回，特殊情况使用。)
	var async = obj.async;
	if (undefined == async || '' == String(async).trim()) {
		async = true;
	}
	//出错时返回的执行方法(可选,这个是出错时的回调方法，方法名可自定义)
	var errorFun = obj.errorFun;
	if (undefined == errorFun || '' == String(errorFun).trim()) {
		errorFun = '';
	}
	//出错时是否弹出框提醒(可选,传入true，出错时将使用默认的弹出框提醒。传入false，出错时不提醒，只返回出错时的回调方法，可以在回调方法中自定义提醒的内容，可以是Alert或Toast等。)
	var errorAlert = obj.errorAlert;
	if (undefined == errorAlert || '' == String(errorAlert).trim()) {
		errorAlert = true;
	}
	//成功时返回的执行方法(可选,这个是成功时的回调方法，方法名可自定义)
	var successFun = obj.successFun;
	if (undefined == successFun || '' == String(successFun).trim()) {
		successFun = '';
	}
	//超时时间(可选,当请求超出时间时将停止执行)
	var timeout = obj.timeout;
	if (undefined == timeout || '' == String(timeout).trim()) {
		timeout = 30000;
	}
	//扩展内容，(可选,不参与请求，主要用于标记,数据会原样返回。常用于在上一个方法中定义的变量会在下一个方法中继续使用或是页面中有多个标签有着相同id值的情况(加班单发起、请假单发起、签卡单发起中'增加一行'执行之后的页面就会出现这样的情况)。)
	var ext = obj.ext;
	if (undefined == ext || '' == String(ext).trim()) {
		ext = '';
	}
	if ('' != String(url).trim()) {

		$.ajax({
			url : url,
			type : type,
			data : data,
			dataType : dataType,
			contentType : 'application/json;charset=utf-8',
			async : async,
			error : function(cbData) {
				cmp.dialog.loading(false)
				console.log("请求失败，失败原因如下:");
				console.log(cbData);
				if (true == errorAlert || 'true' == errorAlert) {
					if (type == 'error') {
						cmp.notification.alert("数据加载失败",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					} else {
						cmp.notification.alert("网络请求失败，请重试。",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					}
				} else {
					if (undefined != errorFun && '' != errorFun.trim()) {
						var errorFunction = eval(errorFun);
						new errorFunction(cbData, ext);
					}
				}
			},
			success : function(info_list) {
				cmp.dialog.loading(false)
				console.log("请求成功，获取数据如下:");
				console.log(info_list);
				renderData.data = info_list.donelist.LIST; //按规则渲染对象的属性data为渲染数据
				//renderData.total = info_list.donelist.LIST.length; //按规则渲染对象的属性total为该系列数据的总数
				renderData.total = info_list.donelist.LIST.length>0?info_list.donelist.TOTAL:0
				options.success(renderData)
				//formhide = info_list['formhide'];
			},
			timeout : timeout,
		});
	}
	return renderData;
}

/*function loadDataOldYiban(){
	cmp.storage.save("ygzz_serviceUrl",'http://10.1.9.144')
	cmp.storage.save("ygzz_loginname",'A008087')
	cmp.storage.save("ygzz_password",'asdf123')
	$("#newOAList").hide();
	$("#oldOAList").hide();
	showNewOAyiban(1)
}*/
//新oa已办
function showNewOAyiban(page,options){
	//initParm();
	var pageno = Number($("#pageNo").html());
	page=pageno
	var obj = new Object()
	$("#oldoalist").hide();
	$("#newoalist").show();
	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var loginname = cmp.storage.get('ygzz_loginname');
	var password = cmp.storage.get('ygzz_password');
	var url = serviceUrl + "/servlet/PublicServiceServlet?stype=donelist&message_id=nhoa_col" ;
	url = url + "&username="+loginname+"&PHONE_ID="+phoneid+"&pageNo="+page ;
	obj.url=url
	obj.successFun = 'httpsucessyiban';
	obj.ext=options
	ajaxJson_v1(obj);
}
function showNewOAyiban2(page,options){
	//initParm();
	var renderData = {}
	page=pageX.cache.pageNo
	var obj = new Object()
	$("#oldoalist").hide();
	$("#newoalist").show();
	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var loginname = cmp.storage.get('ygzz_loginname');
	//var password = cmp.storage.get('ygzz_password');
	var url = serviceUrl + "/servlet/PublicServiceServlet?stype=donelist&message_id=nhoa_col" ;
	url = url + "&username="+loginname+"&PHONE_ID="+phoneid+"&pageNo="+page ;
	obj.url=url
	obj.async=false
	obj.successFun = 'httpsucessyiban2';
	obj.ext=options
	 //ajaxJson_v1(obj);
	cmp.dialog.loading("加载中...")
	console.log("发送请求参数如下:");
	console.log(obj);
	//请求的url：(必选,字符串，请求的url可以不包含参数，推荐将参数是封装在下面的data中)
	var url = obj.url;
	if (undefined == url || '' == String(url).trim()) {
		url = '';
	}
	//请求的发送方式(可选,post或get)
	var type = obj.type;
	if (undefined == type || '' == String(type).trim()) {
		type = 'get';
	}
	//请求的参数数据(可选,json格式的字符串数据)
	var data = obj.data;
	if (undefined == data || '' == String(data).trim()) {
		data = '';
	}
	//请求的数据类型(可选,常用是json，但也有可能用到其它类型如：xml、html、script、text)
	var dataType = obj.dataType;
	if (undefined == dataType || '' == String(dataType).trim()) {
		dataType = 'json';
	}
	//请求的是否异步(可选,true：请求是异步，不会出现页面卡死，可随时结束请求，主流用法。false：同步请求，会出现页面卡死，无法关闭和返回，特殊情况使用。)
	var async = obj.async;
	if (undefined == async || '' == String(async).trim()) {
		async = true;
	}
	//出错时返回的执行方法(可选,这个是出错时的回调方法，方法名可自定义)
	var errorFun = obj.errorFun;
	if (undefined == errorFun || '' == String(errorFun).trim()) {
		errorFun = '';
	}
	//出错时是否弹出框提醒(可选,传入true，出错时将使用默认的弹出框提醒。传入false，出错时不提醒，只返回出错时的回调方法，可以在回调方法中自定义提醒的内容，可以是Alert或Toast等。)
	var errorAlert = obj.errorAlert;
	if (undefined == errorAlert || '' == String(errorAlert).trim()) {
		errorAlert = true;
	}
	//成功时返回的执行方法(可选,这个是成功时的回调方法，方法名可自定义)
	var successFun = obj.successFun;
	if (undefined == successFun || '' == String(successFun).trim()) {
		successFun = '';
	}
	//超时时间(可选,当请求超出时间时将停止执行)
	var timeout = obj.timeout;
	if (undefined == timeout || '' == String(timeout).trim()) {
		timeout = 30000;
	}
	//扩展内容，(可选,不参与请求，主要用于标记,数据会原样返回。常用于在上一个方法中定义的变量会在下一个方法中继续使用或是页面中有多个标签有着相同id值的情况(加班单发起、请假单发起、签卡单发起中'增加一行'执行之后的页面就会出现这样的情况)。)
	var ext = obj.ext;
	if (undefined == ext || '' == String(ext).trim()) {
		ext = '';
	}
	if ('' != String(url).trim()) {

		$.ajax({
			url : url,
			type : type,
			data : data,
			dataType : dataType,
			contentType : 'application/json;charset=utf-8',
			async : async,
			error : function(cbData) {
				cmp.dialog.loading(false)
				console.log("请求失败，失败原因如下:");
				console.log(cbData);
				if (true == errorAlert || 'true' == errorAlert) {
					if (type == 'error') {
						cmp.notification.alert("数据加载失败",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					} else {
						cmp.notification.alert("网络请求失败，请重试。",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					}
				} else {
					if (undefined != errorFun && '' != errorFun.trim()) {
						var errorFunction = eval(errorFun);
						new errorFunction(cbData, ext);
					}
				}
			},
			success : function(info_list) {
				cmp.dialog.loading(false)
				console.log("请求成功，获取数据如下:");
				console.log(info_list);
				renderData.data = JSON.parse(info_list.donelist.DATA); //按规则渲染对象的属性data为渲染数据
				renderData.total = JSON.parse(info_list.donelist.DATA).length; //按规则渲染对象的属性total为该系列数据的总数
				renderData.totalCount = JSON.parse(info_list.donelist.DATA).length>0?JSON.parse(info_list.donelist.DATA)[0].total:0
				//formhide = info_list['formhide'];
			},
			timeout : timeout,
		});
	}
	return renderData;
}
function httpsucessyiban2(info_list){
	var renderData = {}
	renderData.data = JSON.parse(info_list.donelist.DATA); //按规则渲染对象的属性data为渲染数据
	renderData.total = JSON.parse(info_list.donelist.DATA).length; //按规则渲染对象的属性total为该系列数据的总数
	renderData.totalCount = JSON.parse(info_list.donelist.DATA).length>0?JSON.parse(info_list.donelist.DATA)[0].total:0
	//formhide = info_list['formhide'];
	return renderData
}
//新oa已办搜索
function showNewOAyibanSuoSo(key){
	//initParm();
	var obj = new Object()
	$("#oldoalist").hide();
	$("#newoalist").show();
	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var loginname = cmp.storage.get('ygzz_loginname');
	var password = cmp.storage.get('ygzz_password');
	var url = serviceUrl + "/servlet/PublicServiceServlet?stype=donelist&message_id=nhoa_col" ;
	url = url + "&username="+loginname+"&PHONE_ID="+phoneid+"&key="+key ;
	obj.url=url
	obj.successFun = 'httpsucessyiban1';
	ajaxJson_v1(obj);
}
function oldRender(info_list){
	$("#oldOAList").hide();
	$("#jzList").hide();
	$("#newOAList").show();
	//var dblist = data['donelist'];


	var info_list_mode = new Array(info_list.length)
	for ( i = 0; i < info_list.length; i++) {
		var info_mode = new Object();
		info_mode.affair_id = info_list[i].affair_id ;
		info_mode.summaryid = info_list[i].id ;
		info_mode.can_track = info_list[i].can_track ;
		info_mode.title = info_list[i].subject ;
		info_mode.sendername = info_list[i].sendername;
		info_mode.create_date = info_list[i].create_date;
		info_list_mode.push(info_mode);
	}
	var html=""
	html+='<ul class="cmp-table-view">'
	info_list_arry=info_list_mode.concat(info_list_arry)
	info_list_mode=info_list_arry
	for ( i = 0; i < info_list_mode.length; i++) {
		if(info_list_mode[i]==null){
			continue;
		}
		html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+i+'">'
		html+='<ul class="ub-f1 ub ub-pj ub-ac">'
		html+='<ul class="ub-f1 ub list-item ub-ver marg-l">'
		html+='<li class="bc-text collabo-title ub ub-ver ut-m line3">'
		html+=info_list_mode[i].title
		html+='</li>'
		html+='</ul>'
		html+='<li class="fa fa-angle-right ulev2">'
		html+='</li>'
		html+='</ul>'
		html+='</li>'
	}
	html+='</ul>'
	$("#content").css("margin-top",$(".search").eq(0).css("height"))
	$("#newOAList").html(html)
	//此处颜色斑马线
	/*$('#newOAList>ul>li').each(function(index, item) {
	 if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
	 $(item).css("background-color", "#77CFAD");
	 } else {

	 }
	 });*/
	$("#newOAList>ul>li").on('tap',function(event){
		openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
	})
}
function httpsucessyiban1(info_list){
	var pageno = 1;
	$("#pageNo").html(pageno);
    $("#oldOAList").hide();
    $("#jzList").hide();
    $("#newOAList").show();
    //var dblist = data['donelist'];
    //formhide = info_list['formhide'];


    var info_list_mode = new Array(JSON.parse(info_list['donelist'].DATA).length)
    for ( i = 0; i < JSON.parse(info_list['donelist'].DATA).length; i++) {
        var info_mode = new Object();
        info_mode.affair_id = JSON.parse(info_list['donelist'].DATA)[i].affair_id ;
        info_mode.summaryid = JSON.parse(info_list['donelist'].DATA)[i].id ;
        info_mode.can_track = JSON.parse(info_list['donelist'].DATA)[i].can_track ;
        info_mode.title = JSON.parse(info_list['donelist'].DATA)[i].subject ;
        info_mode.sendername = JSON.parse(info_list['donelist'].DATA)[i].sendername;
        info_mode.create_date = JSON.parse(info_list['donelist'].DATA)[i].create_date;
        info_list_mode.push(info_mode);
    }
    var html=""
    html+='<ul>'
    for ( i = 0; i < info_list_mode.length; i++) {
        if(info_list_mode[i]==null){
            continue;
        }
        html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+i+'">'
        html+='<ul class="ub-f1 ub ub-pj ub-ac">'
        html+='<ul class="ub-f1 ub list-item ub-ver marg-l">'
        html+='<li class="bc-text collabo-title ub ub-ver ut-m line3">'
        html+=info_list_mode[i].title
        html+='</li>'
        html+='</ul>'
        html+='<li class="fa fa-angle-right ulev2">'
        html+='</li>'
        html+='</ul>'
        html+='</li>'
    }
    html+='</ul>'
    $("#content").css("margin-top",$(".search").eq(0).css("height"))
    $("#newOAList").html(html)
    //此处颜色斑马线
    /*$('#newOAList>ul>li').each(function(index, item) {
     if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
     $(item).css("background-color", "#77CFAD");
     } else {

     }
     });*/
    $("#newOAList>ul>li").on('tap',function(event){
        openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })
}
function httpsucessyiban(info_list,options) {
	var pageno = Number($("#pageNo").html());
	pageno += 1;
	$("#pageNo").html(pageno);
	var renderData = {}
	renderData.data = JSON.parse(info_list.donelist.DATA); //按规则渲染对象的属性data为渲染数据
	renderData.total = JSON.parse(info_list.donelist.DATA).length; //按规则渲染对象的属性total为该系列数据的总数
    //formhide = info_list['formhide'];
	if(options!=null&options!=""){
		options.success(renderData)
	}


}
function openDetail(obj) {
	var hideflag = false;
	for ( i = 0; i < formhide.length; i++) {

		if (obj.title.indexOf(formhide[i].title) > -1 || obj.title.indexOf("工作行为评估") > -1) {
			hideflag = true;
			cmp.notification.alert("该事项暂不支持在移动端查看，请到电脑端查看。",function(){
				//do something after tap button
			},"提示","确定","",false,false);
			break;
		}
	}
	if (hideflag == false) {
		var extData={
			'affairid': encodeURI(obj.affair_id),
			'summaryid':obj.summaryid,
			'title':obj.title,
			'node_policy':obj.node_policy,
			'processid':obj.processid,
			'sendername':obj.sendername,
			'create_date':obj.create_date,

		}

		cmp.href.next(_collPath+"/html/xietongdetail.html",extData,{openWebViewCatch: true,nativeBanner: false})

	}
}

$("#search2").on( "tap", function() {
	var infoName = $('#infoName').val();
	if (infoName == "" || infoName == null) {
		cmp.notification.alert("输入条件不能为空",function(){
			//do something after tap button
		},"提示","确定","",false,false);
	} else {
		//查找内容
		showNewOAyibanSuoSo(infoName);
	}
})
/*======================================================================*/
/*====================已发（旧）=================================================================*/
function fnGoSentOldList() {
    newTabisBatch(function(){
        $fillArea = _$("#colSentOldContain");
        //isLoadSearch();
        _$("#listSentOld").classList.add("loaded");
        //多次点击同一个tab页时不刷新listview
        if("#colSentOldContain" == _currentListDiv) return;
        loadData("#colSentOldContain",showNewOAyifa,[{},Number($("#pageNo2").html())]);
    });
}
//新3.5a已发
function showNewOAyifa(page,options) {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');

    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.errorAlert = false;
    obj.data = {
        'message_id' : "newoa_send",
        'branch' : "getlist",
        'username' : loginname,
        //'password' : password,
        'PHONE_ID' : phoneid,
        'pageNo' : page
    };
    obj.ext=options
    obj.successFun = 'httpsucessyifa';
    ajaxJson_v1(obj);
}
function showNewOAyifa2(page,options) {
	var renderData = {}
	page=pageX.cache.pageNo
	var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
	var phoneid = cmp.storage.get('ygzz_phoneid');
	var loginname = cmp.storage.get('ygzz_loginname');
	var password = cmp.storage.get('ygzz_password');

	var obj = new Object();
	obj.url = serviceUrl + "/servlet/PublicServiceServlet";
	obj.errorAlert = false;
	obj.data = {
		'message_id' : "newoa_send",
		'branch' : "getlist",
		'username' : loginname,
		//'password' : password,
		'PHONE_ID' : phoneid,
		'pageNo' : page
	};
	obj.ext=options
	obj.async=false
	obj.successFun = 'httpsucessyifa';
	//ajaxJson_v1(obj);
	cmp.dialog.loading("加载中...")
	console.log("发送请求参数如下:");
	console.log(obj);
	//请求的url：(必选,字符串，请求的url可以不包含参数，推荐将参数是封装在下面的data中)
	var url = obj.url;
	if (undefined == url || '' == String(url).trim()) {
		url = '';
	}
	//请求的发送方式(可选,post或get)
	var type = obj.type;
	if (undefined == type || '' == String(type).trim()) {
		type = 'get';
	}
	//请求的参数数据(可选,json格式的字符串数据)
	var data = obj.data;
	if (undefined == data || '' == String(data).trim()) {
		data = '';
	}
	//请求的数据类型(可选,常用是json，但也有可能用到其它类型如：xml、html、script、text)
	var dataType = obj.dataType;
	if (undefined == dataType || '' == String(dataType).trim()) {
		dataType = 'json';
	}
	//请求的是否异步(可选,true：请求是异步，不会出现页面卡死，可随时结束请求，主流用法。false：同步请求，会出现页面卡死，无法关闭和返回，特殊情况使用。)
	var async = obj.async;
	if (undefined == async || '' == String(async).trim()) {
		async = true;
	}
	//出错时返回的执行方法(可选,这个是出错时的回调方法，方法名可自定义)
	var errorFun = obj.errorFun;
	if (undefined == errorFun || '' == String(errorFun).trim()) {
		errorFun = '';
	}
	//出错时是否弹出框提醒(可选,传入true，出错时将使用默认的弹出框提醒。传入false，出错时不提醒，只返回出错时的回调方法，可以在回调方法中自定义提醒的内容，可以是Alert或Toast等。)
	var errorAlert = obj.errorAlert;
	if (undefined == errorAlert || '' == String(errorAlert).trim()) {
		errorAlert = true;
	}
	//成功时返回的执行方法(可选,这个是成功时的回调方法，方法名可自定义)
	var successFun = obj.successFun;
	if (undefined == successFun || '' == String(successFun).trim()) {
		successFun = '';
	}
	//超时时间(可选,当请求超出时间时将停止执行)
	var timeout = obj.timeout;
	if (undefined == timeout || '' == String(timeout).trim()) {
		timeout = 30000;
	}
	//扩展内容，(可选,不参与请求，主要用于标记,数据会原样返回。常用于在上一个方法中定义的变量会在下一个方法中继续使用或是页面中有多个标签有着相同id值的情况(加班单发起、请假单发起、签卡单发起中'增加一行'执行之后的页面就会出现这样的情况)。)
	var ext = obj.ext;
	if (undefined == ext || '' == String(ext).trim()) {
		ext = '';
	}
	if ('' != String(url).trim()) {

		$.ajax({
			url : url,
			type : type,
			data : data,
			dataType : dataType,
			contentType : 'application/json;charset=utf-8',
			async : async,
			error : function(cbData) {
				cmp.dialog.loading(false)
				console.log("请求失败，失败原因如下:");
				console.log(cbData);
				if (true == errorAlert || 'true' == errorAlert) {
					if (type == 'error') {
						cmp.notification.alert("数据加载失败",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					} else {
						cmp.notification.alert("网络请求失败，请重试。",function(){
							//do something after tap button
						},"提示","确定","",false,false);

					}
				} else {
					if (undefined != errorFun && '' != errorFun.trim()) {
						var errorFunction = eval(errorFun);
						new errorFunction(cbData, ext);
					}
				}
			},
			success : function(info_list) {
				cmp.dialog.loading(false)
				console.log("请求成功，获取数据如下:");
				console.log(info_list);

				renderData.data = info_list.listSent.DATA; //按规则渲染对象的属性data为渲染数据
				renderData.total = info_list.listSent.DATA.length; //按规则渲染对象的属性total为该系列数据的总数
				renderData.totalCount = info_list.listSent.TOTAL?info_list.listSent.TOTAL:0
			},
			timeout : timeout,
		});
	}
	return renderData;
}

//新oa已办搜索
function showNewOAyifaSuoSo(key) {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var loginname = cmp.storage.get('ygzz_loginname');
    var password = cmp.storage.get('ygzz_password');

    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.errorAlert = false;
    obj.data = {
        'message_id' : "newoa_send",
        'branch' : "sousuolist",
        'username' : loginname,
        //'password' : password,
        'PHONE_ID' : phoneid,
        'key' : key
    };
    obj.successFun = 'httpsucessyifa1';
    ajaxJson_v1(obj);
}

function httpsucessyifa(info_list,options) {
    //formhide = info_list['formhide'];
    var renderData = {}
    renderData.data = info_list.listSent.DATA; //按规则渲染对象的属性data为渲染数据
    renderData.total = info_list.listSent.DATA.length; //按规则渲染对象的属性total为该系列数据的总数
    //formhide = info_list['formhide'];
    if(options!=null&options!=""){
        options.success(renderData)
    }

}
function httpsucessyifa1(info_list) {
    console.log(info_list);
    //formhide = info_list['formhide'];
    var info_list_mode = new Array(info_list['sendlist'].length);
    console.log(info_list['sendlist'].length);
    for ( i = 0; i < info_list['sendlist'].length; i++) {
        var info_mode = new Object();
        info_mode.affair_id = info_list['sendlist'][i].affair_id;
        info_mode.summaryid = info_list['sendlist'][i].id;
        info_mode.title = info_list['sendlist'][i].subject;
        //info_mode.templete_id = info_list['sendlist'][i].templeteId;
        //info_mode.process_id = info_list['sendlist'][i].processId;
        info_list_mode.push(info_mode);
    }

    var html=""
    html+='<ul>'
    for ( i = 0; i < info_list_mode.length; i++) {
        if(info_list_mode[i]==null){
            continue;
        }
        html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+i+'">'
        html+='<ul class="ub-f1 ub ub-pj ub-ac">'
        html+='<ul class="ub-f1 ub list-item ub-ver marg-l">'
        html+='<li class="bc-text collabo-title ub ub-ver ut-m line3">'
        html+=info_list_mode[i].title
        html+='</li>'
        html+='</ul>'
        html+='<li class="fa fa-angle-right ulev2">'
        html+='</li>'
        html+='</ul>'
        html+='</li>'
    }
    html+='</ul>'
    //$("#content2").css("margin-top",$(".search").css("height"))
    $("#newOAList2").html(html)
    //此处颜色斑马线
    /*$('#newOAList>ul>li').each(function(index, item) {
     if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
     $(item).css("background-color", "#77CFAD");
     } else {

     }
     });*/
    $("#newOAList2>ul>li").on('tap',function(event){
        openDetail2(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })

}
$("#search22").on( "tap", function() {
    var infoName = $('#infoName2').val();
    if (infoName == "" || infoName == null) {
        cmp.notification.alert("输入条件不能为空",function(){
            //do something after tap button
        },"提示","确定","",false,false);
    } else {
        //查找内容
        showNewOAyifaSuoSo(infoName);
    }
})
function oldRender2(info_list){
    //var dblist = data['donelist'];


    var info_list_mode = new Array(info_list.length)
    for ( i = 0; i < info_list.length; i++) {
        var info_mode = new Object();
        info_mode.affair_id = info_list[i].affairId ;
        info_mode.summaryid = info_list[i].value ;
        // info_mode.can_track = info_list[i].can_track ;
        info_mode.title = info_list[i].title ;
        info_mode.templete_id = info_list[i].templeteId;
        info_mode.process_id = info_list[i].processId;
        info_list_mode.push(info_mode);
    }
    var html=""
    html+='<ul>'
    for ( i = 0; i < info_list_mode.length; i++) {
        if(info_list_mode[i]==null){
            continue;
        }
        html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+i+'">'
        html+='<ul class="ub-f1 ub ub-pj ub-ac">'
        html+='<ul class="ub-f1 ub list-item ub-ver marg-l">'
        html+='<li class="bc-text collabo-title ub ub-ver ut-m line3">'
        html+=info_list_mode[i].title
        html+='</li>'
        html+='</ul>'
        html+='<li class="fa fa-angle-right ulev2">'
        html+='</li>'
        html+='</ul>'
        html+='</li>'
    }
    html+='</ul>'
    $("#content2").css("margin-top",$(".search").eq(1).css("height"))
    $("#newOAList2").append(html)
    //此处颜色斑马线
    /*$('#newOAList>ul>li').each(function(index, item) {
     if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
     $(item).css("background-color", "#77CFAD");
     } else {

     }
     });*/
    $("#newOAList2>ul>li").on('tap',function(event){
        openDetail2(info_list_mode[event.currentTarget.attributes["data-index"].value])
    })
}
function openDetail2(obj) {
    var hideflag = false;
    if (hideflag == false) {
        var extData={
            'affairid': encodeURI(obj.affair_id),
            'summaryid':obj.summaryid,
            'title':obj.title,
            'templete_id':obj.templete_id,
            'processid':obj.process_id,
            'create_date':obj.create_date,

        }

        cmp.href.next(_collPath+"/html/xietongdetail.html",extData,{openWebViewCatch: true,nativeBanner: false})

    }
}

function openArticle(title, uniqueid) {
	var extData={
		'uniqueid': uniqueid,
		'title':title
	}
	cmp.href.next(_collPath+"/html/old_xietong.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
/*================================================================================================*/
function fnGoSentList() {
	newTabisBatch(function(){
		$fillArea = _$("#colSentContain");
		isLoadSearch();
		//检查是否已加载数据
		_$("#listSent").classList.add("loaded");
		//多次点击同一个tab页时不刷新listview
		if("#colSentContain" == _currentListDiv) return;
		loadData("#colSentContain",$s.Coll.findSentAffairs,[{},pageX.cache]);
	});
}

function fnGoWaitSentList() {
	newTabisBatch(function(){
		$fillArea = _$("#colWaitContain");
		isLoadSearch();
		_$("#listWaitSend").classList.add("loaded");
		//多次点击同一个tab页时不刷新listview
		if("#colWaitContain" == _currentListDiv) return;
		loadData("#colWaitContain",$s.Coll.findWaitSentAffairs,[{},pageX.cache]);
	});
}

/********************************** 页面使用工具  ***********************************/

function getOpenFrom() {

	var isActive = _$("#listSent").classList.contains("cmp-active");
	if(isActive){
		return "listSent";
	}
	
	isActive = _$("#listWaitSend").classList.contains("cmp-active");
	if(isActive){
		return "listWaitSend";
	}
	
	isActive = _$("#listPending").classList.contains("cmp-active");
	if(isActive){
		return "listPending";
	}
	
	isActive = _$("#listDone").classList.contains("cmp-active");
	if(isActive){
		return "listDone";
	}
	
	//若有待办列表资源，默认打开为待办，总比打开页面为空白的要好
	if(_$("#colPendingsContain").style.display != "none") {
		return "listPending";
	}
	
	return "listPending";
}

function isLoadSearch() {
	if (pageX.searchCondition.condition !=undefined ){
		isSearch = true;
	} else {
		isSearch = false;
	}
}

function newTabisBatch(exitNowList){
	if(isBatch){
		cmp.notification.confirm(cmp.i18n("collaboration.pighole.alert.exitBatch"),function(e){ //e==1是/e==0 否
	        if(e==1){ //是
	            _cancelBatchFn(_currentListDiv);
	            exitNowList();
	        }else{
	        	cmpActiveTab(_currentListDiv);
	        	return;  
	        }
	    },null, [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
	}else{
		exitNowList();
	}
}

function cmpActiveTab(_colXContainId){
	if(_colXContainId == '#colPendingsContain'){
		$fillArea = _$("#colPendingsAffairs");
		_$("#listPending").classList.add("cmp-active");
		_$("#listDone").classList.remove("cmp-active");
		_$("#listSent").classList.remove("cmp-active");
		_$("#listWaitSend").classList.remove("cmp-active");
		_$("#listDoneOld").classList.remove("cmp-active");
        _$("#listSentOld").classList.remove("cmp-active");
	}
	else if(_colXContainId == '#colDoneContain'){
		$fillArea = _$("#colDoneAffairs");
		_$("#listDone").classList.add("cmp-active");
		_$("#listSent").classList.remove("cmp-active");
		_$("#listWaitSend").classList.remove("cmp-active");
		_$("#listPending").classList.remove("cmp-active");
		_$("#listDoneOld").classList.remove("cmp-active");
        _$("#listSentOld").classList.remove("cmp-active");
	}
	else if(_colXContainId == '#colSentContain'){
		$fillArea = _$("#colSentAffairs");
		_$("#listSent").classList.add("cmp-active");
		_$("#listPending").classList.remove("cmp-active");
		_$("#listDone").classList.remove("cmp-active");
		_$("#listWaitSend").classList.remove("cmp-active");
		_$("#listDoneOld").classList.remove("cmp-active");
        _$("#listSentOld").classList.remove("cmp-active");
	}
	else if(_colXContainId == '#colWaitContain'){
		$fillArea = _$("#colWaitAffairs");
		_$("#listWaitSend").classList.add("cmp-active");
		_$("#listPending").classList.remove("cmp-active");
		_$("#listDone").classList.remove("cmp-active");
		_$("#listSent").classList.remove("cmp-active");
		_$("#listDoneOld").classList.remove("cmp-active");
        _$("#listSentOld").classList.remove("cmp-active");
	}else if(_colXContainId == '#colDoneOldContain'){
		$fillArea = _$("#colDoneOldAffairs");
		_$("#listDoneOld").classList.add("cmp-active");
		_$("#listWaitSend").classList.remove("cmp-active");
		_$("#listPending").classList.remove("cmp-active");
		_$("#listDone").classList.remove("cmp-active");
		_$("#listSent").classList.remove("cmp-active");
        _$("#listSentOld").classList.remove("cmp-active");
	}else if(_colXContainId == '#colSentOldContain'){
        $fillArea = _$("#colSentOldAffairs");
        _$("#listSentOld").classList.add("cmp-active");
        _$("#listDoneOld").classList.remove("cmp-active");
        _$("#listWaitSend").classList.remove("cmp-active");
        _$("#listPending").classList.remove("cmp-active");
        _$("#listDone").classList.remove("cmp-active");
        _$("#listSent").classList.remove("cmp-active");
    }
}

//获取选择的数据
function _getSelectedData(){
	var data = [];
	var allSelects = _$(_currentListDiv+" .img_click",true);
	var n = 0;
	for(var i=0;i<allSelects.length;i++){
		if(allSelects[i].classList.contains("selected")){
			 data[n] = {"summaryId": allSelects[i].previousElementSibling.getAttribute("summaryId"), 
					 	"affairId": allSelects[i].previousElementSibling.getAttribute("affairId"),
					 	"templateId":allSelects[i].previousElementSibling.getAttribute("templateId"),
					 	"subject":allSelects[i].previousElementSibling.getAttribute("subject"),
					 	"canDeleteORarchive":allSelects[i].previousElementSibling.getAttribute("canDeleteORarchive"),
					 	"workitemId":allSelects[i].previousElementSibling.getAttribute("workitemId"),
					 	"subState":allSelects[i].previousElementSibling.getAttribute("subState"),
					 	"processId":allSelects[i].previousElementSibling.getAttribute("processId"),
					 	"disAgreeOpinionPolicy":allSelects[i].previousElementSibling.getAttribute("disAgreeOpinionPolicy")};
			 n++;
		}
	}
	return data;
}


var forwardCount = 0;
function addOneSub(n){
    return parseInt(n)+1;
}
//列表转发
function listForwards(){
	
	forwardCount = addOneSub(forwardCount);
	//不能重复提交，
	if(parseInt(forwardCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
	    return;
	}

	var summaryIds = "";
	var affairIds = "";
	var dataStr = "";
	var temDataStr ="";
	var data = _getSelectedData();
	var nMap = new Object();
	var needCheck = false;
	if(data.length<1){
		_alert(cmp.i18n("collaboration.forward.alert.select"));
		forwardCount = 0;
		return;
	}
	var _list = getOpenFrom();
	for(var i = 0; i < data.length; i++){
        dataStr += data[i]["summaryId"] + "_" + data[i]["affairId"] + ",";
        summaryIds += data[i]["summaryId"]+"_";
        affairIds += data[i]["affairId"]+"_";
        if(_list =="listWaitSend" &&  (data[i].templateId && data[i].templateId !="null" )){
        	nMap[data[i]["affairId"]+"_"+data[i].templateId] = data[i].subject;
        	if(temDataStr != ""){
        	    temDataStr += ",";
        	}
        	temDataStr += data[i]["templateId"];
        	needCheck = true;
        }
    }
	if(needCheck){
    	$s.Coll.isTemplateDeleted({"templateIds":temDataStr},errorBuilder({
        	 success: function(ret){
        	     var delTemplateIds = ret["data"]["delTemplateIds"];
        	     
        	     if(ret &&  ret.code=="0"){
        	         if(delTemplateIds.length>0){
        	             for(var i = 0; i < data.length; i++){
                             for(var j = 0; j < delTemplateIds.length; ji++){
                                 if(data[i]["templateId"] == delTemplateIds[j]){
                                     _alert(cmp.i18n('collaboration.forword.errorTemplate',[data[i]["subject"]]));
                                     forwardCount =0;
                                     return;
                                 }
                             }
                         }
        	         }
                     var _forwardParam = {
                             summaryId : summaryIds,
                             affairId : affairIds
                     };
                     var selectedData = {
                             "data":dataStr
                     }
                     // 校验能否转发
                     $s.Coll.checkForwardPermission({},selectedData,errorBuilder({
                         success: function(result){
                              if(result.code == 1){ 
                                   // 以下协同不能转发，请重新选择
                                  _alert(cmp.i18n("collaboration.pighole.alert.noCanForward")+"<br><br>" + result.message);
                                  forwardCount =0;
                                  return;
                               }else{
                                   cmp.event.trigger("beforepageredirect",document);
                                   cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion, _forwardParam);
                               }
                         }
                     }));
               
           	      }
        	     else{
        	         _alert(result.message);
                     forwardCount =0;
                     return;
        	     }
           },
           error : function (result){
               _alert(result.message);
               forwardCount =0;
               return;
           }
       }));
    	
    
    
	}else{
		var _forwardParam = {
	    		summaryId : summaryIds,
	    		affairId : affairIds
	    };
	    var selectedData = {
	    		"data":dataStr
	    }
	    //校验能否转发
	    $s.Coll.checkForwardPermission({},selectedData,errorBuilder({
	    	success: function(result){
	    		 if(result.code == 1){
	    	          //以下协同不能转发，请重新选择
	    			 _alert(cmp.i18n("collaboration.pighole.alert.noCanForward")+"<br><br>" +result.message);
	    			 forwardCount =0;
	    	         return;
	    	      }else{
	    	    	  cmp.event.trigger("beforepageredirect",document);
	    	    	  cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion, _forwardParam);
	    	      }
	        }
	    }));
	}
    
}

var archivePigeonholeCount = 0;
//归档
function archivePigeonhole(){
	
	archivePigeonholeCount = addOneSub(archivePigeonholeCount);
	//不能重复提交，
	if(parseInt(archivePigeonholeCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
	    return;
	}
	//获取归档数据
	_affairIds = "";
	var archiveSubject = "";
	var opinionSubject = "";
	var isCanarchive = false;
	var para = [];
	var _map = {};
	var isCanSubmitWorkFlowRe = false;
	var workflowSubject = "";
	var data = _getSelectedData();
	if(data.length<1){
		_alert(cmp.i18n("collaboration.pighole.alert.select"));
		archivePigeonholeCount = 0;
		return;
	}
	_listType = getOpenFrom();
	if("listPending"==_listType){
		_listType = "pending";
	}
	for(var i = 0; i < data.length; i++){
		_affairIds += data[i]["affairId"] + ",";
		if("pending"==_listType){
			if(data[i]["templateId"] && data[i]["templateId"]!="null"){
				// 未办理的模板协同不允许直接归档!
				archiveSubject += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
			}
			if("true" == data[i]["canDeleteORarchive"]){
				opinionSubject += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
				isCanarchive = true;
			}
			var map = {};
			map["workitemId"] = data[i]["workitemId"];
	        map["processId"] = data[i]["processId"];
	        para.push(map);
		}
	}
	if("pending"==_listType){
		//待办时模板不能归档
		if(archiveSubject.length > 1){
			_alert(cmp.i18n("collaboration.pighole.alert.noCanArchive") + "<br>" +archiveSubject);
			archivePigeonholeCount = 0;
			return;
		}
		//待办时判断意见是否能为空
		if(opinionSubject.length > 1){
			_alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol2") + "<br>" +opinionSubject);
			archivePigeonholeCount = 0;
			return;
		}
		_map["_DEL_KEYS_"] = para;
		$s.Workflow.canBatchDelete({}, _map, errorBuilder({//并发节点归档时判断锁
            success:function(result){
                for(var i = 0; i < data.length; i++){
                    if (result[i][0] == "false") {
                        isCanSubmitWorkFlowRe = true;
                        workflowSubject += result[i][1]+"<br>&lt;"+ escapeStringToHTML(data[i]["subject"]) + "&gt;";
                    }
                }
                if(isCanSubmitWorkFlowRe) { 
                    _alert(workflowSubject);
                    archivePigeonholeCount = 0;
                    return;
                }else{
                	pigeonhole(_listType,data);
                }
              
            }
        }));
	}else{
		pigeonhole(_listType,data);
	}
	
}

function pigeonhole(_listType,data){

	//归档前判断是否满足归档条件
	var params = {"affairIds":_affairIds};
	$s.Coll.getPigeonholeRight({},params,errorBuilder({
		success: function(result){
			if(result.success && result.success !=""){
				_alert(result.success,null,cmp.i18n("collaboration.pigeonhole.alert.note"),null);
				archivePigeonholeCount = 0;
				unLockH5Workflow(data);
				return;
			}
			archivePigeonholeCount = 0;
			//调文档中心接口获取归档目录的ID
			_getDestFolderId(data,function (destFolderId,folderName){
				if(destFolderId=="-1"){
					archivePigeonholeCount = 0;
					return;
				}else{
					//归档
					var _params = {
							"affairIds":_affairIds,
							"destFolderId":destFolderId,
							"listType":_listType
					};
					$s.Coll.transPigeonhole({},_params,errorBuilder({
						success:function(ret){//归档成功以后
							cmp.listView(_currentListDiv).refreshInitData();
							_alert(cmp.i18n("collaboration.grid.alert.archiveSuccess", [folderName]));
							_cancelBatchFn(_currentListDiv);
							unLockH5Workflow(data);
						}
					}));
				}
			});
		}
	}));
}

function _getDestFolderId(data,calback){
	docPigehole4Col(data,function (_result){
		if(_result && _result.msg=="OK"){
			var params = {
					affairId : _affairIds,
		            destFolderId : _result.id
		    }
			//校验同一个人是否将协同归档到同一个目录
			$s.Coll.getIsSamePigeonhole({},params,errorBuilder({
				success: function(result){
		            if(result["retMsg"]){
		                cmp.notification.confirm(result["retMsg"],function(e){ //e==1是/e==0 否
		        	        if(e==1){ //是
		        	        	calback(_result.id,_result.fullPath);
		        	        }else{
		        	        	calback("-1","");  
		        	        }
		        	    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
		            }else{
		            	calback(_result.id,_result.fullPath);
		            }
		        }
			}));
		}else{//点取消
			unLockH5Workflow(data);
			_$("#docPigeonhole").classList.remove('cmp-active');
			calback("-1","");
		}
	});
}


var isDeleteCount = 0;
// 列表删除
function _deleteList(){
	isDeleteCount = addOneSub(isDeleteCount);
	//不能重复提交，
	if(parseInt(isDeleteCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
		//alert("请不要重复点击！");
	    return;
	}
	
    var affairIds = "";
    var deleteSubject1 = "";// 未处理的协同模板
    var deleteSubject2 = "";// 意见不能为空
    var deleteSubject3 = "";
    var deleteSubject4 = "";//指定回退到发起人
    var isCanDeleteORarchive = false;
    var params = [];
    var _map = {};
    var isCanSubmitWorkFlowRe = false;
    var data = _getSelectedData();
    if(data.length<1){
        _alert(cmp.i18n("collaboration.grid.alert.selectOneDelete"));//请选择要删除的协同！
        isDeleteCount = 0;
        return;
    }
    var _listTab = getOpenFrom();
    if("listPending"==_listTab){
        _listTab = "pending";
    }
    
    var objSummarys = [];
	var objAffairs =[];
	  
    for(var i = 0; i < data.length; i++){
    	objSummarys.push(data.summaryId);
    	objAffairs.push(data.affairId);
    	
        affairIds += data[i]["affairId"] + ",";
        // 指定回退状态状态不能删除
        if("listWaitSend" == _listTab){
             if(data[i].subState == '16' ){
                 deleteSubject4 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
              }
         }
        if("pending" == _listTab){
            if(data[i]["templateId"] && data[i]["templateId"]!="null"){
                // 未办理的模板协同不允许直接删除!
                deleteSubject1 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
            }
            if ("true" == data[i]["canDeleteORarchive"]) {
                isCanDeleteORarchive = true;
                deleteSubject2 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
            }
          //封装判断指定回退与锁的变量
            var map = {};
            map["workitemId"] = data[i]["workitemId"];
            map["processId"] = data[i]["processId"];
            params.push(map);
        }
       
    }
    _map["_DEL_KEYS_"] = params;
    if ("listWaitSend" == _listTab) {
        if (deleteSubject4.length > 1) {
            //当前流程处于指定回退状态,你不能进行此操作!
            _alert(cmp.i18n("collaboration.grid.alert.CantModifyBecauseOfAppointStepBack") + "<br/>" + deleteSubject4);
            isDeleteCount = 0;
            return;
        }
    }
    if ("pending" == _listTab) {
        // 判断事项是待办还是其它
        if(deleteSubject1.length > 1){
            // "未办理的模板协同不允许直接归档或删除!"
            _alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol1") + "<br>" + deleteSubject1);
            isDeleteCount = 0;
            return;
        }
        // 以下事项要求意见不能为空，不能直接归档或删除:
        if(isCanDeleteORarchive){ 
            _alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol2") + "<br>" + deleteSubject2);
            isDeleteCount = 0;
            return;
        }
        // 指定回退与锁
        $s.Workflow.canBatchDelete({}, _map, errorBuilder({
            success:function(result){
                for(var i = 0; i < data.length; i++){
                    if (result[i][0] == "false") {
                        isCanSubmitWorkFlowRe = true;
                        deleteSubject3 += "<br><"+ data[i]["subject"] + ">" + result[i][1];
                    }
                }
                if(isCanSubmitWorkFlowRe) { 
                    _alert(deleteSubject3);
                    isDeleteCount = 0;
                } else {
                    _doDelete(affairIds, _listTab, data);
                }
            }
        }));
    } else {
    	var idMap = {
    		"summaryID" : objSummarys,
    		"affairID" : objAffairs
    	}
    	//协同待发列表删除前事件
        var eventParams={
        	funName : "beforeWaitSendDelete",
        	data : idMap,
        	success : function(){
        		_doDelete(affairIds, _listTab, data);
        	},
        	error : function(){
        		
        	}
        }
        cmp.funProxy.getter(eventParams);
    }
    
}

//批处理
function _batchDealFun() {
	var rows = _getSelectedData();
    if(rows.length < 1) {
        _alert(cmp.i18n("collaboration.batch.alert.select"));
        return;
    }
    
    var process = new BatchProcess();
    for(var i = 0 ; i < rows.length; i++) {
        var affairId = rows[i].affairId;
        var subject = rows[i].subject;
        var category =  rows[i].category||"1";
        var summaryId =  rows[i].summaryId;
        if(process.batchOpinion == "0" || process.batchOpinion == null) {
        	process.batchOpinion = rows[i].disAgreeOpinionPolicy == null ? "0": rows[i].disAgreeOpinionPolicy=="1" ? "3":"0";//意见是否必填，3,不同意时，意见必填
        }
        process.addData(affairId,summaryId,category,subject);
    }
    
    if(!process.isEmpty()){
        var r = process.doBatch();
    }
    
}

function _doDelete(affairIds, _listTab, data) {

    //"该操作不能恢复，是否进行删除操作?"
    cmp.notification.confirm(cmp.i18n("collaboration.grid.alert.sureToDelete"),function(e){ // e==1是/e==0 否
        if(e==1){ // 是
        	isDeleteCount = 0;
            // 判断是否能够删除
            $s.Coll.checkCanDelete({"affairIds" : affairIds, "from" : _listTab}, errorBuilder({
                success:function(ret){
                    if (!ret["success"]) {
                        _alert(ret["error_msg"]);
                    } else {
                        $s.Coll.deleteAffairs(_listTab,affairIds,{},errorBuilder({ //{"from":_listTab,"affairIds":affairIds}, {// 执行删除
                            success:function(result){// 删除成功以后
                                if (result["success"]){
                                    _alert(cmp.i18n("collaboration.grid.alert.Deletesuccess"));//"删除成功！"
                                    _cancelBatchFn(_currentListDiv);
                                    cmp.listView(_currentListDiv).refreshInitData();
                                }
                            }
                        }));
                     }
                 }
            }));
        } else {
            //取消时解锁
        	unLockH5Workflow(data);
        	isDeleteCount = 0;
        }
    },null, [cmp.i18n("collaboration.page.lable.button.cancel") , cmp.i18n("collaboration.page.dialog.OK")],null,null,0);

}

function unLockH5Workflow(data){
	//取消时解锁
    for (var i = 0; i < data.length; i++) {
        try {
            $s.Workflow.unLockH5Workflow({"processId":data[i]["processId"], "action":14}, errorBuilder());
        } catch(e) {}
    }
}

function __allSelectNext(clickNext){
	noAllSelect = true;
	if(clickNext){
		_$(_currentListDiv+" .count").innerText = _$(_currentListDiv+" .img_click",true).length;
		_$(_currentListDiv+" .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
		_$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
	}
    var allDatas = _$(_currentListDiv+" .img_click",true);
    for(var i=0;i<allDatas.length;i++){
        allDatas[i].style.display="";
    }
}

//没有数据的时候，平台已做了退出批量操作动作
function NoDataCallbackFunc() {
    if (isBatch) {
        cmp.listView(_currentListDiv).refreshHeight(containHeight);
        _$("#batchFooterBtn").style.display="none";
        _$(_currentListDiv+" .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
        _$(_currentListDiv+" .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
        _$(_currentListDiv+" .count").innerHTML = 0;
        isBatch = false;
        noAllSelect = true;
        _$("#src_form_view_hint").classList.add("display_none");
    }
}
   