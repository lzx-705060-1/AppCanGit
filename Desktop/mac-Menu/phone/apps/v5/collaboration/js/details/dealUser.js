
var pageX = {};
var page = {};
var isBatch = false; // 是否处于批量操作状态
var noAllSelect = true; //是否处于全选状态
var containHeight;
var listType;

cmp.ready(function(){
    
	pageX.winParams = cmp.href.getParam();
	listType = pageX.winParams["listType"];
	
	cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function() {
		//初始化当前页面数据
		initHtml();
		
		//初始化事件
	    initEvent();
	},$verstion);
	
});

function _handMembers(){
    for(var i=0;i<page.resultData.length;i++) {
        initAffairState(page.resultData[i]);
    }
    //初始化页面
    initHtml();
}


function initHtml() {
	//国际化title
    _$("title").innerText=cmp.i18n("collaboration.default.nodeDisposition");
    
    //上下拖动
    cmp.listView("#colNodeContain",{
        imgCache:true,
        config: {
            params: {},
            dataFunc: showNodeMembers,
            renderFunc: _renderListData
        },
        down: {
	    	contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
	        contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	        contentover: cmp.i18n("collaboration.page.lable.refresh_release"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing")//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	    },
        up: {
            contentdown: cmp.i18n("collaboration.page.lable.load_more"),//加载更多
            contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//加载中...
            contentnomore: cmp.i18n("collaboration.page.lable.load_nodata")//没有更多
        }
    });
    
}

//出于性能等原因，增加此参数控制是否查询下一页数据
var queryNext = false;

function showNodeMembers(pDatas, options){
	
	if(!queryNext){
		queryNext = true;
		nodeMembers = pageX.winParams["nodeMembers"];
		var successFn = options.success;
        successFn(nodeMembers);
		return;
	}
	
	summaryId = pageX.winParams["summaryId"];
    nodeId = pageX.winParams["nodeId"];
    pDatas.summaryId = summaryId;
    pDatas.nodeId = nodeId;
    
	$s.Coll.showNodeMembers(pDatas,errorBuilder({
        success : function(result) {
        	var successFn = options.success;
            successFn(result);
        }
    }));
}

function _renderListData(result, isRefresh){
	for(var i=0;i<result.length;i++) {
        initAffairState(result[i], "read_state_enable");
    }
	
    var pendingTPL = _$("#list_li_tpl").innerHTML;
    var affairHTML = cmp.tpl(pendingTPL, result);
    
    if(isRefresh){
        _$("#nodeUserList").innerHTML = affairHTML;
        if(isBatch){//处于批量操作时
			noAllSelect = true;
			_$(".count").innerText = _$(".img_click",true).length;
			_$(".lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
			_$(".lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
			batchSet();
			var allDatas = _$(".img_click",true);
			for(var i=0;i<allDatas.length;i++){
				allDatas[i].style.display="";
			}
		}
    }else{
        var beforHTML =  _$("#nodeUserList").innerHTML;
        _$("#nodeUserList").innerHTML = beforHTML + affairHTML;
    }
    //刷新页面
    setTimeout(function(){
        cmp.listView("#colNodeContain").refresh();
    }, 500);
}

//事项状态（待办，已办..）
function initAffairState(data) {
	var nowState,bgcolor,stateIcon,isHasten;
    if(data.state == 1) {
    	nowState = cmp.i18n("collaboration.default.tempToDo");
		bgcolor = "other";
		stateIcon = "see-icon-v5-common-more-circle-fill";
		isHasten = "noHasten";
    } else if(data.state == 3) {
    	if(data.subState == 13) {
    		//暂存待办
		    nowState = cmp.i18n("collaboration.default.tempToDo");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-more-circle-fill";
    		isHasten = "noHasten";
    	} else if(data.subState == 15 || data.subState == 17) {
    		//指定回退
    		nowState = cmp.i18n("collaboration.default.stepBack");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-rollback-fill";
    		isHasten = "noHasten";
    	} else if(data.subState != 13 && data.subState != 15 && data.subState != 17 && data.backFromId != null) {      
    		//被回退
    		nowState = cmp.i18n("collaboration.default.beBack");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-beback";
    		isHasten = "noHasten";
    	} else if(data.subState == 11) {
    		//未读
    		nowState = cmp.i18n("collaboration.default.unread");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-unview-circle-fill";
    		isHasten = "noHasten";
    	} else {
			//已读
    		if(data.readSwitch != "disable") {
    			nowState = cmp.i18n("collaboration.default.read");
    			bgcolor = "has-read";
        		stateIcon = "see-icon-v5-common-view-circle-fill";
    		} else {
    			nowState = cmp.i18n("collaboration.default.unread");
    			bgcolor = "other";
        		stateIcon = "see-icon-v5-common-unview-circle-fill";
    		}
    		isHasten = "noHasten";
    	}
        
    } else if(data.state == 4) {
    	if(data.subState == 21) {//终止
    		nowState = cmp.i18n("collaboration.page.lable.button.terminate");
    		stateIcon = "see-icon-v5-common-stop-circle-fill";
    		bgcolor = "has-stop";
    	}else if(data.subState == 25){
    		nowState = cmp.i18n("collaboration.page.lable.button.terminate");
            stateIcon = "see-icon-v5-common-stop-circle-fill";
            bgcolor = "has-stop-node";
    	}else {//已办
    		nowState = cmp.i18n("collaboration.default.done");
    		stateIcon = "see-icon-success-circle-fill";
    		bgcolor = "has-haddle";
    	}
    	isHasten = "noHasten";
    } else {
    	//暂存待办
    	nowState = cmp.i18n("collaboration.default.tempToDo");
		bgcolor = "other";
		stateIcon = "see-icon-v5-common-more-circle-fill";
		isHasten = "noHasten";
    }
    
    //已发非终止状态添加催办功能
    if(pageX.winParams["listType"]=="listSent") {
    	if(data.state != 4) {
    		isHasten = "urge-state-span hasten_span ager";
    		nowState = cmp.i18n("collaboration.page.lable.button.hasten");
    	}
	}
    
    //将事项状态写到data里面
    data["nowState"]=nowState;
    data["bgcolor"]=bgcolor;
    data["stateIcon"]=stateIcon;
    data["isHasten"]=isHasten;
    return data;
}

//绑定事件
function initEvent() {

    initPageBack();
    if(pageX.winParams.listType=="listSent"){
    	//催办所有
    	_$("#akeyHasten").addEventListener("tap", batchKeyHasten);
    	
    	//催办一个人
    	cmp("#colNodeContain").on("tap", ".urge-state-span", function(){
    		hastenMember("false", this.getAttribute("id")); 
    	}); 
    }else{
    	//_$(".cmp-pull-widget").remove();
    }
    
    _$("#colNodeContain").addEventListener("tap", function(e){
        e.stopPropagation();//阻止冒泡
        
        var target = e.target;
        
        if(isBatch){
            if(target.classList.contains("img_click")){//选择与取消选择
                selectedBatchDataFn(target);
                
            }else if(target.classList.contains("all_click")){//全选
                _AllSelectFn();
                
            }else if(target.classList.contains("cancel_click")){//退出批量操作状态
                batchCancel();
                
            }else if(target.classList.contains("batch_click")){//批量操作事件
                
                batchHasten();
            }
        }else{
            //人员卡片
            if(target.classList.contains("img_setting")){
                var memberId = target.getAttribute("menberid");
                if(/^-?\d+$/.test(memberId)){
                    cmp.visitingCard(memberId);
                }
            }
        }
        
    });
}

//返回
function _goBack(){
	cmp.href.back();
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    document.querySelector("#goBackBtn").addEventListener("tap", _goBack);
}


function hastenMember(isAllHasten, memberId){
	//催办
    var hastenParam = {};
    
    hastenParam["app"] = 1;
    hastenParam["isAllHasten"] = isAllHasten;
    hastenParam["memberIds"] = memberId;
    hastenParam["affairId"] = pageX.winParams["affairId"];
    hastenParam["activityId"] = pageX.winParams["nodeId"];
    
    cmp.href.next(_collPath + "/html/details/remind.html"+colBuildVersion, hastenParam);
}

/**********************************批量催办开始*****************************************/
function batchHasten(){
	  isBatch = true;
	  containHeight = _$("#colNodeContain").offsetHeight;
	  _$("footer").style.display="";
	  batchSet();
	  cmp.listView("#colNodeContain").updateAdditionalParts(true);//更新额外部件
	  cmp.listView("#colNodeContain").refreshHeight(containHeight-50);
	  var allSelects = _$(".img_click",true);
	  if(allSelects.length){
		  for(var i=0;i<allSelects.length;i++){
			  allSelects[i].style.display="";
		  }
	  }else{
		  allSelects.style.display="";
	  }
}

function batchSet(){
	var handState = _$(".handler-states",true);
	  //屏蔽调单个催办按钮
	  for(var i = 0;i<handState.length;i++){
		handState[i].style.display = "none";
		handState[i].parentElement.getElementsByClassName("read-states")[0].style.display = "none";
	  }
	  //屏蔽掉非催办状态数据
	  var noHasten = _$(".noHasten",true);
	  for(var i = 0;i<noHasten.length;i++){
		  noHasten[i].parentNode.parentNode.parentNode.style.display = "none";
	  }
}

function batchCancel(){
	var allSelects = _$(".img_click",true);
	for(var i = 0;i<allSelects.length;i++){
		allSelects[i].style.display="none";
		batchSelectState(allSelects[i],false);
	}
	_$("footer").style.display="none";
	var handState = _$(".handler-states",true);
	for(var i = 0;i<handState.length;i++){
		handState[i].style.display = "";
		handState[i].parentElement.getElementsByClassName("read-states")[0].style.display = "";
	}
	//屏蔽掉非催办状态数据
	var noHasten = _$(".noHasten",true);
	for(var i = 0;i<noHasten.length;i++){
		noHasten[i].parentNode.parentNode.parentNode.style.display = "";
	}
	cmp.listView("#colNodeContain").refreshHeight(containHeight+50);
    cmp.listView("#colNodeContain").updateAdditionalParts(false);
    _$("#colNodeContain .lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
    _$("#colNodeContain .lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
    _$("#colNodeContain .count").innerHTML = 0;
    isBatch = false;
    noAllSelect = true;
}

//全选
function _AllSelectFn(){
	
	var allSelects = _$(".urge-state-span",true);
	
	if(noAllSelect){
		for(var i = 0;i<allSelects.length;i++){
			batchSelectState(allSelects[i].parentElement.previousElementSibling.previousElementSibling,true);
		}
		
		_$(".lableBtn span").classList.add("see-icon-v5-common-select-fill-color");
		_$(".lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+allSelects.length+")";
		noAllSelect = false;
		_$(".count").innerHTML = allSelects.length;
	}else{//取消全选
		
		for(var i = 0;i<allSelects.length;i++){
			affairIds = "";
			batchSelectState(allSelects[i].parentElement.previousElementSibling.previousElementSibling,false);
		}
		
		_$(".lableBtn span").classList.remove("see-icon-v5-common-select-fill-color");
		_$(".lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect");
		noAllSelect = true;
		_$(".count").innerHTML = 0;
	}
}
//选择与取消选择
function selectedBatchDataFn(target){
	var _count = _$(".count").innerText*1;
	if(target.classList.contains("see-icon-v5-common-select-fill-color")){
		batchSelectState(target,false);
		if(!noAllSelect){
			_count = _count-1;
			_$(".count").innerHTML= _count;
			_$(".lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
		}
	}else{
		if(!noAllSelect){
			_count = _count+1;
			_$(".count").innerHTML= _count;
			_$(".lab_all_select").innerHTML = cmp.i18n("collaboration.page.lable.button.allSelect")+"("+_count+")";
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
	var allSelects = _$(".img_click",true);
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
		hastenMember("true", data); 
	}
}
/**********************************批量催办结束*****************************************/