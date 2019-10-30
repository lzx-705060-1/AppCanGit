var pageX = {};
pageX.winParam = {};
pageX.cacheKey = "m3_v5_collaboration_templateindex_cache_key";
pageX.tplIndexCacheKey = "m3_v5_collaboration_tpl_level_cache_key";
pageX.cacheIndex = 1;
pageX.cachData = {}

cmp.ready(function(){
    
      initPageBack();
    
	 cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
		 //国际化title标签
         document.querySelector("title").innerText=cmp.i18n("collaboration.page.lable.formTemplate");
         
         pageX.cachData = cmp.storage.get(pageX.cacheKey, true);
         if(pageX.cachData){
             pageX.cachData = cmp.parseJSON(pageX.cachData);
             _removeCache();
         }
         pageX.cachData = pageX.cachData || {};
         
         var cacheIndex = cmp.storage.get(pageX.tplIndexCacheKey, true) || "1";
         pageX.cacheIndex = parseInt(cacheIndex, 10);
         
         initPageInfo();
	
         addEvent();
	
         document.addEventListener('beforepageredirect', function(e){ 
        	 _saveCache();
         });
	  },$verstion);
});

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    // document.querySelector("#goBackBtn").addEventListener('tap', _goBack);
}

//删除缓存数据
function _removeCache(){
    cmp.storage.delete(pageX.cacheKey, true);
}

function _saveCache(){
    cmp.storage.save(pageX.cacheKey, cmp.toJSON(pageX.cachData), true);
}

function _saveTplIndex(change){
    pageX.cacheIndex = pageX.cacheIndex + change;
    if(pageX.cacheIndex > 0){
        cmp.storage.save(pageX.tplIndexCacheKey, pageX.cacheIndex, true);
    }else{
        cmp.storage.delete(pageX.tplIndexCacheKey, true);
    }
}

/**
 * 初始化页面信息
 */
function initPageInfo() {
    
	pageX.winParam = cmp.href.getParam() || {};

	if(pageX.winParam && pageX.winParam["categoryId"]){ //返回首页
		//返回子分类
		hide("sliderSegmentedControl");
	    show("childCategory");
		initChildPage();
		categoryListTap("#childCategoryList",".categoryList");
		
	}else{
		
		show("sliderSegmentedControl");
	    hide("childCategory");
		initRootCategoryPage();
		categoryListTap("#rootCategoryList",".categoryList");
		
		if(pageX.cachData.indexAllTab){
			switch2AllTemplate();
		}
	}
	
	//最近使用表单列表点击跳转至新建页面
	cmp("#rencentTemplateList").on("tap", ".templateList", recentTemplateClickFunc);
	//所有表单列表点击跳转至新建页面
	cmp("#childCategoryList").on("tap", ".templateList", categoryClickFunc);
	 //国际化title标签
	document.querySelector("title").innerText=cmp.i18n("collaboration.page.lable.formTemplate");
}


function switch2AllTemplate(){
    
    var cateTab = _$("#rootCategory_tab");
    var recentTab = _$("#rencentUseTemplate_tab");
    
    if(recentTab.classList.contains("cmp-active")){
        recentTab.classList.remove("cmp-active");
        var rc = recentTab.getAttribute("href");
        _$(rc).classList.remove("cmp-active");
    }
    
    if(!cateTab.classList.contains("cmp-active")){
        cateTab.classList.add("cmp-active");
        var rc = cateTab.getAttribute("href");
        _$(rc).classList.add("cmp-active");
    }
    
    /*cmp.event.trigger("touchstart", tapE)
    cmp.event.trigger("tap", tapE);*/
}
function recentTemplateClickFunc() {
//    var hasOfficeTemp = this.getAttribute("hasOfficeTemp");
//    if(hasOfficeTemp == "true"){
//      //该表单暂不支持在移动端使用， 请在电脑端使用
//        cmp.notification.alert(cmp.i18n("collaboration.template.alert.hasRedTpl"),
//                null, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
//    }else{
        var paramData = {
                "templateId" : this.getAttribute("data"),
                "backIndex" : pageX.cacheIndex,
                "preCaches" : [pageX.tplIndexCacheKey, pageX.cacheKey]
        }
        cmp.event.trigger("beforepageredirect",document);
        cmp.href.next(_collPath + "/html/newCollaboration.html"+colBuildVersion, paramData);
//    }
}

function categoryClickFunc() {
//    var hasOfficeTemp = this.getAttribute("hasOfficeTemp");
    /*if(hasOfficeTemp == "true"){
        //该表单暂不支持在移动端使用， 请在电脑端使用
        cmp.notification.alert(cmp.i18n("collaboration.template.alert.hasRedTpl"),
                null, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
    }else{*/
        var paramData = {
                "templateId" : this.getAttribute("data"),
                "backIndex" : pageX.cacheIndex,
                "preCaches" : [pageX.tplIndexCacheKey, pageX.cacheKey]
        }
        cmp.event.trigger("beforepageredirect",document);
		cmp.href.next(_collPath + "/html/newCollaboration.html"+colBuildVersion, paramData);
//    }
}

function _goBack() {

    cmp.webViewListener.fire({
        type: "coll.ListRefresh",
        data: {closePage: 'true'}
    });
    
    if(pageX.cachData.indexAllTab){
        _saveCache();
    }

    _saveTplIndex(-1);
    
    var bURL = CollUtils.getBackURL();
    if(bURL == "weixin"){
      //返回到外层
        cmp.href.closePage();
    }else{
        cmp.href.back();
    }
}

/**
 * 初始化根节点信息
 * @returns
 */
function initRootCategoryPage(){
	//cmp.i18n.init(_collPath + "/i18n/", "Collaboration",null,,$verstion);
	loadRencentTemplate();
	loadFormTemplates({});
    cmp.listView("#rencentUseTemplateScroll"); //最近使用模板滚动容器
    cmp.listView("#rootCategoryScroll"); //全部模板滚动容器
}

/**
 * 初始化子节点
 * @returns
 */
function initChildPage(){
	loadChildCategoryData();
    cmp.listView("#childCategoryScroll"); //全部模板滚动容器
}
/**
 * 读取最近使用的模板
 */
function loadRencentTemplate(){
	$s.Template.rencentTemplates({},errorBuilder({
		success : function(result) {
			initTPL(result,'templateTpl','rencentTemplateList');
			
			if(result.length ==0) {
				switch2AllTemplate();
			}
		}
	}));
}

/**
 * 读取所有模板
 */
function loadFormTemplates(param){
	$s.Template.formTemplates(param,errorBuilder({
		success : function(result) {
			if(typeof(param)!='undefined' && param.parentId){
				// document.querySelector(".cmp-title").innerHTML= result.parentName;
				//国际化title标签
			    document.querySelector("title").innerText = result.parentName;

				initTPL(result.categorys,'templateCategoryTpl','childCategoryList');
				initTPL(result.templates,'templateTpl','childCategoryList');
			}else{
				initTPL(result.categorys,'templateCategoryTpl','rootCategoryList');
			}
		}
	}));
}

//加载数据
function loadChildCategoryData(){
    var categoryId = pageX.winParam["categoryId"];
    var param = {};
    param.parentId = categoryId;
    loadFormTemplates(param);
};

/**
 * 模板数据加载
 * @param data
 */
function initTPL(data,tplId,listViewId){
	try{
		if(data==null){
			var tableX = document.getElementById(listViewId);
			if(tplId=='templateTpl' && tableX.innerHTML.trim() == ""){
				tableX.style.textAlign='center';
				tableX.style.marginTop='30%';
				tableX.innerHTML =  '<div class="StatusContainer"><div class="nocontent"></div>    <span class="text nocontent_text">'+cmp.i18n("collaboration.search.nodata")+'</span></div>';
			}
			return;
		}
		var liTpl = document.getElementById(tplId).innerHTML;
		var table = document.getElementById(listViewId);
		var html = cmp.tpl(liTpl, data);
		table.innerHTML = table.innerHTML + html;
		if(tplId=='templateTpl' && table.innerHTML.trim() == ""){
			table.style.textAlign='center';
			table.style.marginTop='30%';
			table.innerHTML = '<div class="StatusContainer"><div class="nocontent"></div>    <span class="text nocontent_text">'+cmp.i18n("collaboration.search.nodata")+'</span></div>';
		}
		//跟新scoll
		setTimeout(function(){
		    var _scollId = "";
	        if(listViewId == "rencentTemplateList"){
	            _scollId = "#rencentUseTemplateScroll"; //最近使用模板滚动容器
	        }else if(listViewId == "childCategoryList"){
	            _scollId = "#childCategoryScroll"; //最近使用模板滚动容器
	        }else if(listViewId == "rootCategoryList"){
	            _scollId = "#rootCategoryScroll"; //最近使用模板滚动容器
	        }
	        if(_scollId){
	            cmp.listView(_scollId).refresh(); //最近使用模板滚动容器
	        }
		}, 300);
		
	}catch(e){
		console.log(e.message);
	}
}
/**
 * 添加所有事件
 */
function addEvent(){
	pullRightTap();
	
	cmp("#sliderSegmentedControl").on("tap", ".cmp-control-item", function(){
	       var tabId = this.getAttribute("href");
           if("#rencentUseTemplate" == tabId){
               pageX.cachData.indexAllTab = false;
               setTimeout(function(){
                   cmp.listView("#rencentUseTemplateScroll").refresh();
               }, 300);
           }else{
               pageX.cachData.indexAllTab = true;
               setTimeout(function(){
                   cmp.listView("#rootCategoryScroll").refresh();
               }, 300);
           }
	   });
}

//右边点击事件
function pullRightTap(){
		_$(".cmp-placeholder").addEventListener("tap",function(e){
			cmp.event.trigger("beforepageredirect",document);
			_saveTplIndex(1);
			cmp.href.next(_collPath + "/html/searchTemplate.html"+colBuildVersion);
		});
}


//模板分类点击事件
function categoryListTap(parentNode,tapNode){
	cmp(parentNode).on('tap', tapNode, function(e){
		var paramData = {
			"categoryId" : this.getAttribute("data")
		};
		cmp.event.trigger("beforepageredirect",document);
		_saveTplIndex(1);
		cmp.href.next(_collPath + "/html/templateIndex.html"+colBuildVersion, paramData);
	});
}

/***
 * 隐藏
 * @param node
 * @returns
 */
function hide(nodeId){
	var content= document.getElementById(nodeId);
	if(!content.classList.contains('display_none'))
	    content.classList.add('display_none');
}

/***
 * 隐藏
 * @param node
 * @returns
 */
function show(nodeId){
	var content= document.getElementById(nodeId);
	if(content.classList.contains('display_none'))
	    content.classList.remove('display_none');
}
