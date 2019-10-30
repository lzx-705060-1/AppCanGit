
var pageX = {}
pageX.cacheKey = "m3_v5_collaboration_searchTemplage_cache_key";
pageX.tplIndexCacheKey = "m3_v5_collaboration_tpl_level_cache_key";
pageX.cachData = {}
pageX.cacheIndex = 1;

cmp.ready(function(){
	initPage();
});
/**
 * 初始化页面信息
 */
function initPage(){
    
    initPageBack();
    
    _$("#dataCommonDiv").style.height = (_$("#mainContent").offsetHeight - _$("#searchContent").offsetHeight) + "px";
    _$("#subject").disabled = false;
    
	cmp.i18n.init(_collPath + "/i18n/", "Collaboration",function(){
	    
	   /* _$("#search").addEventListener("tap",function(){
			initSearch();
		});*/
	    
		_$("#subject").addEventListener("keyup",function(e){
			if(e.keyCode == 13){
				_$("#subject").blur();
				initSearch();
			}
		});
		_$("#subject").addEventListener("focus",function(e){
		    
		    var searchIcon = _$("#searchClear");
		    if(!searchIcon.classList.contains("display_none")){
		        searchIcon.classList.add("display_none");
		    }
        });
		_$("#subject").addEventListener("blur",function(e){
		    if(this.value != ""){
		        if(!this.classList.contains("text-left")){
		            this.classList.add("text-left");
		        }
		    }else{
		        _$("#searchClear").classList.remove("display_none");
		        if(this.classList.contains("text-left")){
                    this.classList.remove("text-left");
                }
		    }
        });
		
		 document.addEventListener('beforepageredirect', function(e){ 
             _saveCache();
         });
		
		 //国际化title标签
	    _$("title").innerText=cmp.i18n("collaboration.template.templateSearch");
	    
	    var cacheIndex = cmp.storage.get(pageX.tplIndexCacheKey, true) || "1";
        pageX.cacheIndex = parseInt(cacheIndex, 10);
        
	    _initCacheData();
	    if(pageX.cachData.subject){
	        _$("#subject").value = pageX.cachData.subject;
	        setTimeout(initSearch, 50);
	        _$("#subject").focus();
	    }
	},$verstion);
	templateListTap();
	
	document.getElementById("subject").setAttribute("placeholder", cmp.i18n("collaboration.page.lable.search"));
}

function _saveCache(){
    var subject = _$("#subject").value;
    if(subject){
        pageX.cachData.subject = subject; 
    }
    
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

function _initCacheData(){
    
    var c = cmp.storage.get(pageX.cacheKey, true);
    if(c){
        pageX.cachData = cmp.parseJSON(c);
        cmp.storage.delete(pageX.cacheKey, true);
    }
}

/**
 * 初始化搜索组件
 */
function initSearch(){
	var subject = _$("#subject").value;
	var param = {};
	if (subject != "" && subject.trim() != "") {
		param.subject = subject;
		loadTemplates(param);
	}
}

/**
 * 读取所有模板
 */
function loadTemplates(param){
	$s.Template.searchTemplates({},param,errorBuilder({
		success : function(result) {
			initTPL(result,'templateTpl','templateList');
		}
	}));
}

/**
 * 模板数据加载
 * @param data
 */
function initTPL(data,tplId,listViewId){
	try{
		var liTpl = document.getElementById(tplId).innerHTML;
		var table = document.getElementById(listViewId);
		var html = cmp.tpl(liTpl, data);
		table.innerHTML = html;
		if(table && table.innerHTML.trim() == ""){
			// table.style.textAlign='center';
			// table.style.marginTop='30%';
			var msg = '<div class="StatusContainer"><div class="nocontent"></div><span class="text nocontent_text">'+cmp.i18n("collaboration.search.nodata")+'</span></div>';
			table.innerHTML = msg;
		}
	}catch(e){
		console.log(e.message);
	}
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    document.querySelector("#prev").addEventListener('tap', _goBack);
}

function _goBack(){
    
    _saveTplIndex(-1);
    
    cmp.href.back();
}

function templateListTap(){
	//所有表单列表点击跳转至新建页面
	cmp("#templateList").on("tap", ".templateList", function() {
	    
	    /*var hasOfficeTemp = this.getAttribute("hasOfficeTemp");
	    if(hasOfficeTemp == "true"){
	      //该表单暂不支持在移动端使用， 请在电脑端使用
	        cmp.notification.alert(cmp.i18n("collaboration.template.alert.hasRedTpl"),
	                null, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
	    }else{*/
	        var paramData = {
	                "templateId" : this.getAttribute("data"),
	                "backIndex" : pageX.cacheIndex,
	                "preCaches" : [pageX.cacheKey, pageX.tplIndexCacheKey]
	            }
	        cmp.event.trigger("beforepageredirect", document);
            cmp.href.next(_collPath + "/html/newCollaboration.html"+colBuildVersion, paramData);
//	    }
	});
}
