var pageX = {};
var page = {};

cmp.ready(function(){
	
	pageX.winParams = cmp.href.getParam();

	//返回事件
	initPageBack();
	
	cmp.i18n.init(_edocPath+"/i18n/", "EdocResources", function() {
		//初始化页面数据
		initPageData();
		
		//初始化事件
	    initEvent();
	},$verstion);
	
});

function initPageData() {
    
    //上下拖动
    cmp.listView("#edocNodeContain",{
        imgCache:true,
        config: {
            params: {"summaryId" : pageX.winParams["summaryId"], "nodeId" : pageX.winParams["nodeId"]},
            dataFunc: showNodeMembers,
            renderFunc: _renderListData
        },
        down: {
            contentprepage:cmp.i18n("Edoc.page.lable.prePage"),//上一页
            contentdown: cmp.i18n("Edoc.action.pullDownRefresh"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("Edoc.action.loseRefresh"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("Edoc.state.refreshing")//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//            callback:pulldownRefresh
        },
        up: {
            contentnextpage:cmp.i18n("Edoc.page.lable.nextPage"),//下一页
            contentdown: cmp.i18n("Edoc.action.loadMore"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("Edoc.state.loading"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("Edoc.state.noMore") //可选，请求完毕若没有更多数据时显示的提醒内容；
            //callBack:pullupRefresh
        }
    });
    
  //初始化页面
    initHtml();
}

function showNodeMembers(params, options){
    
    $s.Coll.showNodeMembers(params,{
        success : function(result) {
            var successFn = options.success;
            successFn(result);
        },
        error: function(result){
        	EdocUtils.ajaxErrorHander(result);
        }
    });
}


function _renderListData(result, isRefresh){
    
    var pendingTPL = $("#list_li_tpl").html();
    for(var i=0;i<result.length;i++) {
        initAffairState(result[i], result[i].readSwitch);
    }
    var html = cmp.tpl(pendingTPL, result);
    if(isRefresh){
        $("#edocNodeUserList").html(html);
    }else{
        $("#edocNodeUserList")[0].insertAdjacentHTML("beforeEnd", html);
    }
    
    //刷新页面
    setTimeout(function(){
        cmp.listView("#edocNodeContain").refresh();
    }, 500);
}


function initHtml() {
	
	//国际化title标签
    document.querySelector("title").innerText=cmp.i18n("Edoc.default.nodeDispos");
	
    //加载数据
    if(pageX.winParams["listType"]=="listSent" && !pageX.winParams["finished"]) {//已发时有催办
		document.querySelector("#hastenDiv").style.display = "block";
	}
}

//事项状态（待办，已办..）
function initAffairState(data,readSwitch) {
	var nowState,bgcolor,stateIcon,isHasten;
    if(data.state == 1) {
    	nowState = cmp.i18n("Edoc.default.tempToDo");
		bgcolor = "other";
		stateIcon = "see-icon-v5-common-more-circle-fill";
    } else if(data.state == 3) {
    	if(data.subState == 13) {
    		//暂存待办
    		nowState = cmp.i18n("Edoc.default.tempToDo");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-more-circle-fill";
    	} else if(data.subState == 15 || data.subState == 17) {
    		//指定回退
    		nowState = cmp.i18n("Edoc.default.stepBack");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-rollback-fill";
    	} else if(data.subState != 13 && data.subState != 15 && data.subState != 17 && data.backFromId != null) {      	
    		//被回退
    		nowState = cmp.i18n("Edoc.default.beBack");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-beback";
    	} else if(data.subState == 11) {
    		//未读
    		nowState = cmp.i18n("Edoc.default.unread");
    		bgcolor = "other";
    		stateIcon = "see-icon-v5-common-unview-circle-fill";
    	} else {
			//已读
    		if(readSwitch != "disable") {
    			nowState = cmp.i18n("Edoc.default.read");
    			bgcolor = "has-read";
        		stateIcon = "see-icon-v5-common-view-circle-fill";
    		} else {
    			nowState = cmp.i18n("Edoc.default.unread");
    			bgcolor = "other";
        		stateIcon = "see-icon-v5-common-unview-circle-fill";
    		}
    	}
        
    } else if(data.state == 4) {
		if(data.subState == 21) {//终止
    		nowState = cmp.i18n("Edoc.action.terminate");
    		stateIcon = "see-icon-v5-common-stop-circle-fill";
    		/*if(page.zzmember==data.memberId) {
    			bgcolor = "has-stop-node";
    		} else {*/
    			bgcolor = "has-stop";
    		/*}*/
    	} else {//已办
    		nowState = cmp.i18n("Edoc.default.done");
    		stateIcon = "see-icon-success-circle-fill";
    		bgcolor = "has-haddle";
    	}
    } else {
    	//暂存待办
    	nowState = cmp.i18n("Edoc.default.tempToDo");
		bgcolor = "other";
		stateIcon = "see-icon-v5-common-more-circle-fill";
    }
    
    //已发非终止状态添加催办功能
    if(pageX.winParams["listType"]=="listSent") {
    	if(data.state != 4) {
    		isHasten = "urge-state-span";
    		nowState = cmp.i18n("Edoc.page.lable.button.hasten");
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
	
    _$("#akeyHasten").addEventListener("tap", function(){
    	hastenMember("true", "");
    });
    
    //催办一个人
    cmp("#edocNodeContain").on("tap", ".urge-state-span", function(){
    	hastenMember("false", this.getAttribute("id")); 
    });
    
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
}

//返回
function _goBack(){
    cmp.href.back();
}

function hastenMember(isAllHasten, memberId){
	//催办
    var hastenParam = {};
    
    hastenParam["app"] = 4;
    hastenParam["isAllHasten"] = isAllHasten;
    hastenParam["memberIds"] = memberId;
    hastenParam["affairId"] = pageX.winParams["affairId"];
    hastenParam["activityId"] = pageX.winParams["nodeId"];
    
    cmp.href.next(_collPath + "/html/details/remind.html?r="+Math.random(), hastenParam);
}
