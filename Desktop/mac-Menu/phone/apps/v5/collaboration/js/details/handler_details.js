/*本页面不要使用 Jquery*/
var pageX = {}
pageX.allHanders = [];
pageX.pendingHanders = [];
pageX.cache = {}
pageX.loadedList = {}
var _storge_key = "";
var isBatch = false; // 是否处于批量操作状态
var noAllSelect = true; //是否处于全选状态
var containHeight;
var activeTab = "runTab";
cmp.ready( function () { //缓存详情页面数据
    
    initPageBack();
    _storge_key = CollCacheKey.summary.dealer;
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        //装载数据
        _initPageData(function(){
            _initPage();//页面展现
            
            document.addEventListener('beforepageredirect', function(e){ 
                cmp.storage.save(_storge_key, cmp.toJSON(pageX.cache), true);
            });
        });
    },$verstion);
});

//页面布局
function _initPage(){
    
  //国际化title标签
    _$("title").innerText=cmp.i18n("collaboration.page.lable.handlerList");
    
    
  //加载数量
    var $tabs = _$("#segmentedControl");
    for(var key in pageX.cache.list){
        _updateCount(key, pageX.cache.list[key]["count"], $tabs);
    }
    
    //加载默认的页签
    _$("#" + pageX.cache.currentTab + "_tab", false, $tabs).classList.add("cmp-active");
    _$("#" + pageX.cache.currentTab + "_container").classList.add("cmp-active");
    if(!pageX.winParams["canHasten"]){
    	_$(".cmp-pull-widget").classList.add("cmp-init-display-none");
    }
    //加载默认列表
    _initListView(pageX.cache.currentTab);
    
    
    //切换tab时催办按钮
    cmp("#segmentedControl").on("tap", ".cmp-control-item", function(){
        var tHref = this.getAttribute("href");
        var tagType = tHref.substring(1).replace("_container", "");
        pageX.cache.currentTab = tagType;
        _initListView(tagType);
    });
    
    if(pageX.winParams["canHasten"]){

    	//催办所有
        _$("#akeyHasten").addEventListener("tap", batchKeyHasten);
           //催办一个人
        	_$("#all_container").addEventListener("tap", function(e){
        		e.stopPropagation();//阻止冒泡
               	var target = e.target;
               	if(target.classList.contains("hasten_span")){
               		_hasten("false", target.getAttribute("memberId")); 
               	}
        	});
           _$("#running_scroller").addEventListener("tap", function(e){
           	e.stopPropagation();//阻止冒泡
           	
           	var target = e.target;
           	if(target.classList.contains("img_click")){//选择与取消选择
           		selectedBatchDataFn(target);
           		
           	}else if(target.classList.contains("all_click")){//全选
           		_AllSelectFn();
           		
           	}else if(target.classList.contains("cancel_click")){//退出批量操作状态
           		batchCancel();
           		
           	}else if(target.classList.contains("batch_click")){//批量操作事件
           		
           		batchHasten();
           	}else if(target.classList.contains("hasten_span")){
           		_hasten("false", target.getAttribute("memberId")); 
           	}
           });
           _$("#all_tab").addEventListener("tap",function(){
        	   activeTab = "allTab";
        	   if(isBatch){
        		   _$("footer").style.display = "none";
        	   }
           });
           _$("#running_tab").addEventListener("tap",function(){
        	   activeTab = "runTab";
        	   if(isBatch){
        		   _$("footer").style.display = "block"; 
        	   }
           });
      }else{
    	  cmp.listView("#running_scroller").updateWidget(false);
      }
}

/**
 * 初始化列表
 * @param type
 */
function _initListView(type){
    
    if(pageX.loadedList[type] == type){
        return;
    }
    
    pageX.loadedList[type] = type
    
  //必要函数 滚动列表
    cmp.listView("#" + type + "_scroller", {
        imgCache:true,
        config: {
        	onePageMaxNum:60,
            height: 50,
            pageSize: 20,
            params: {
                "type" : type
            },
            dataFunc: _loadListData,
            renderFunc: function(result, isRefresh){
                _renderList(type, result, isRefresh);
            }
        },
        down: {
	    	contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
	        contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	        contentover: cmp.i18n("collaboration.page.lable.refresh_release"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing"),//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	        callback:_calClickFn
	    },
        up: {
        	contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
            contentdown: cmp.i18n("collaboration.page.lable.load_more"),//加载更多
            contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//加载中...
            contentnomore: cmp.i18n("collaboration.page.lable.load_nodata"),//没有更多
            callback:_calClickFn
        }
    });
}
function _calClickFn(){//上一页，下一页点击事件回调
	_cancelBatchAllSelect();
}
/**
 * 加载列表数据
 * @param type
 */
function _loadListData(pDatas, options) {
    
//    var type = pDatas["type"];
//    if(pageX.cache.list[type].datas.length > 0){
//        var bacDatas = _sliceData(pageX.cache.list[type].datas, pDatas.pageNo, pDatas.pageSize);
//        options.success(bacDatas);
//    }else{
        $s.Coll.handlers(pDatas["type"], pageX.winParams["summaryId"], pDatas, errorBuilder({
            success : function(result) {
//                if(pDatas.pageNo == 1){
//                    //更新数量
//                    pageX.cache.list[pDatas["type"]].count = result.total;
//                    _updateCount(pDatas["type"], result.total);
//                }
//                
//                pageX.cache.list[pDatas["type"]].datas = result.data || [];
                
                //后台没有分页
                //var bacDatas = _sliceData(result.data, pDatas.pageNo, pDatas.pageSize);
                options.success(result);
            }
        }));
   // }
}

/**
 * 渲染列表
 * @param result
 * @param isRefresh
 */
function _renderList(type, result, isRefresh){
    for(var i=0; i<result.length; i++){
        affairSate(result[i], pageX.winParams["canHasten"]);
    }
    var renderParam = {"canHasten":pageX.winParams["canHasten"],"datas":result}
    //var affairHTML = cmp.tpl(_$("#" + type + "_tpl").innerHTML, renderParam);
    var affairHTML = cmp.tpl(_$("#list_tpl").innerHTML, renderParam);
    
    if(isRefresh){
    	
        if(isBatch){//处于批量操作时
        	//if(activeTab=="allTab"){
        		_$("#" + type + "_affair_ul").innerHTML = affairHTML;
        	//}
			noAllSelect = true;
			_cancelBatchAllSelect();
			//batchSet();
		}else{
			_$("#" + type + "_affair_ul").innerHTML = affairHTML;
		}
    }else{
        _$("#" + type + "_affair_ul").insertAdjacentHTML("beforeEnd", affairHTML); 
    }
    if(isBatch){
    	batchSet();
    	batchHeadImgBlock();
    }
    //刷新页面
//    setTimeout(function(){
//        cmp.listView("#" + type + "_scroller").refresh();
//    }, 500);
}


//更新数量
function _updateCount(type, count, container){
    _$("#" + type + "_count", false, container).innerHTML = count;
}

function _sliceData(array, pageNo, pageSize){
   
    var len, ret;
    
    len = array.length;
    ret ={
            "total" : array.length,
            "pages" : 1,
            "data" : [],
            "size" : pageSize,
            "page" : pageNo
        }
    
    if(len > 0){
        var start = 0, end = 0;
        start = (pageNo - 1) * pageSize;
        end = Math.min(start + pageSize, len);
        ret.data = array.slice(start, end);
    }
    
    return ret;
}

//装载数据
function _initPageData(onDataReady){
    
    pageX.winParams = {
       "tab" : "",//定位到那个一个页签
       "allCount" : "0",
       "runningCount" : "0",
       "canHasten" : false
    }
    
    pageX.winParams = cmp.href.getParam() || pageX.winParams;
  
    //合并数据 
    pageX.cache = {
        list : {
            "all" : {
                "count" : pageX.winParams.allCount || "0",
                "datas" : []
            },
            "running" : {
                "count" : pageX.winParams.runningCount || "0",
                "datas" : []
            }
        },
        currentTab : pageX.winParams.tab || "all"
     }
    
    //读取缓存
    pageX.cache = CollUtils.loadCache(_storge_key, true) || pageX.cache;
    
    onDataReady && onDataReady();
}

//事项状态（待办，已办..）
function affairSate(data, canHetan){
    
	var nowState,bgcolor,stateIcon;
	
	var stateInfo = CollUtils.showAffairState(data.state, data.subState, data.backFromId);
	
	nowState = stateInfo.label;
	bgcolor = stateInfo.color;
	stateIcon = stateInfo.icon;
    
    var toHetan = false;
    if(data.state != 4 && canHetan){
        nowState = cmp.i18n("collaboration.page.lable.button.hasten");
        toHetan = true;
    }
    
    //将事项状态写到data里面
    data["toHetan"] = toHetan;
    data["nowState"]=nowState;
    data["bgcolor"]=bgcolor;
    data["stateIcon"]=stateIcon;
    if(!data.postName){//当没有部门时
    	data["postName"]="";
    }
    return data;
}

//催办
function _hasten(isAllHasten, memberId){
    var hastenParam = {};
    
    hastenParam["isAllHasten"] = isAllHasten;
    hastenParam["memberIds"] = memberId;
    hastenParam["affairId"] = pageX.winParams["affairId"];
    
    cmp.event.trigger("beforepageredirect", document);
    cmp.href.next(_collPath + "/html/details/remind.html"+colBuildVersion, hastenParam);
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    _$("#go_back_btn").addEventListener("tap", _goBack);
}

//回退
function _goBack(){
    cmp.href.back(1, null,  pageX.winParams.WebviewEvent);
}

/**********************************批量催办开始*****************************************/
function batchHasten(){
	  isBatch = true;
	  containHeight = _$("#running_scroller").offsetHeight;
	  _$("footer").style.display="";
	  //屏蔽调单个催办按钮
	  batchSet();
	  cmp.listView("#running_scroller").updateAdditionalParts(true);//更新额外部件
	  cmp.listView("#running_scroller").refreshHeight(containHeight-50);
	  batchHeadImgBlock();
	//引导
      //新建引导 获取本地缓存
      var isHit = cmp.storage.get("m3_v5_collaboration_batch_summary_src_form_flag");
      if(!isHit || isHit != "true"){
          var hitEle;
          hitEle = _$("#src_form_view_hint");
          _$("#src_form_view_hint_txt", false, hitEle).innerHTML = cmp.i18n("collaboration.page.lable.batchTip")
          hitEle.classList.remove("display_none");
          hitEle.querySelector(".btn")
                .addEventListener("tap", function(){
                    cmp.storage.save("m3_v5_collaboration_batch_summary_src_form_flag","true");
                    hitEle.classList.add("display_none");
                });
      }
}

function batchHeadImgBlock(){
	var allSelects = _$("#running_scroller .img_click",true);
	  if(allSelects.length){
		  for(var i=0;i<allSelects.length;i++){
			  allSelects[i].style.display="";
		  }
	  }else{
		  allSelects.style.display="";
	  }
}

function batchSet(){
	var handState = _$("#running_scroller .handler-states",true);
	  //屏蔽调单个催办按钮
	  for(var i = 0;i<handState.length;i++){
		handState[i].style.display = "none";
		handState[i].parentElement.getElementsByClassName("read-states")[0].style.display = "none";
	  }
}

function batchCancel(){
	var allSelects = _$("#running_scroller .img_click",true);
	for(var i = 0;i<allSelects.length;i++){
		allSelects[i].style.display="none";
		batchSelectState(allSelects[i],false);
	}
	_$("footer").style.display="none";
	var handState = _$("#running_scroller .handler-states",true);
	for(var i = 0;i<handState.length;i++){
		handState[i].style.display = "";
		handState[i].parentElement.getElementsByClassName("read-states")[0].style.display = "";
	}
	//屏蔽掉非催办状态数据
	var noHasten = _$("#running_scroller .noHasten",true);
	for(var i = 0;i<noHasten.length;i++){
		noHasten[i].parentNode.parentNode.parentNode.style.display = "";
	}
	cmp.listView("#running_scroller").refreshHeight(containHeight+50);
    cmp.listView("#running_scroller").updateAdditionalParts(false);
    _$("#running_scroller .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
    _$("#running_scroller .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
    _$("#running_scroller .count").innerHTML = 0;
    isBatch = false;
    noAllSelect = true;
    _$("#src_form_view_hint").classList.add("display_none");
}

//全选
function _AllSelectFn(){
	
	if(noAllSelect){
		var allSelects = _$("#running_scroller .img_click",true);
		var maxSize = allSelects.length;
		
		if(allSelects.length>100){
			maxSize = 100;
		}
		for(var i = 0;i<maxSize;i++){
			batchSelectState(allSelects[i],true);
		}
		
		_$("#running_scroller .lableBtn span").classList.add("see-icon-v5-common-select-fill-color");
		_$("#running_scroller .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+maxSize+")";
		noAllSelect = false;
		_$("#running_scroller .count").innerHTML = maxSize;
	}else{//取消全选
		_cancelBatchAllSelect();
		
	}
}
//清空全选
function _cancelBatchAllSelect(){
	var allSelects = _$("#running_scroller .img_click",true);
	var maxSize = allSelects.length;
	
	if(allSelects.length>100){
		maxSize = 100;
	}
	for(var i = 0;i<maxSize;i++){
		//affairIds = "";
		batchSelectState(allSelects[i],false);
	}
	
	_$("#running_scroller .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
	_$("#running_scroller .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
	noAllSelect = true;
	_$("#running_scroller .count").innerHTML = 0;
}
//选择与取消选择
function selectedBatchDataFn(target){
	var _count = _$("#running_scroller .count").innerText*1;
	if(target.classList.contains("see-icon-v5-common-select-fill-color")){
		batchSelectState(target,false);
		if(!noAllSelect){
			_count = _count-1;
			_$("#running_scroller .count").innerHTML= _count;
			_$("#running_scroller .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
		}
	}else{
		if(!noAllSelect){
			_count = _count+1;
			_$("#running_scroller .count").innerHTML= _count;
			_$("#running_scroller .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
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

function getData(){
	var allSelects = _$("#running_scroller .img_click",true);
	var data = "";
	for(var i=0;i<allSelects.length;i++){
		if(allSelects[i].classList.contains("selected")){
			data += allSelects[i].previousElementSibling.getAttribute("menberId")+",";
		}
	}
	return data;
}

function batchKeyHasten(){
	var data = getData();
	if(data==""){
		_alert(cmp.i18n("collaboration.select.alert.hasten.data"));
	}else{
		_hasten("true", data); 
	}
}
//tab切换的时候给提示
function activeTab(){
	
}
/**********************************批量催办结束*****************************************/