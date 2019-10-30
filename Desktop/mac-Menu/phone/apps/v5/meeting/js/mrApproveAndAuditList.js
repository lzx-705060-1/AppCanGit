/*
 * 会议室已申请和待审核列表
 */
var urlParam;
var page = {
	loadAll : false, //是否刷新之前的所有数据
};
var $fillArea = ""; //当前列表容器，用于页面加载
var refreshListview = false;
var _currentListDiv = ""; //当前列表
/**
 * 是否清除当前列表缓存
 */
var isClearCacheList = true;

var mrlistKey = "m3_v5_meeting_room_list_type";
cmp.ready(function () {
	
	urlParam = cmp.href.getParam() || {};
	initPageBack();
	
	cmp.i18n.init(_meetingPath+"/i18n/", "MeetingResources", function() {
		
		//管理员权限判断
		$s.Meeting.meetingUserPeivMenu({},{
			success : function(result) {
			    page.haveMeetingRoomApp = result.haveMeetingRoomApp;
			    if (!result.data) {//只有会议室申请页签
			    	document.title = cmp.i18n("meeting.meetingRoomCommon.alreadyApplied");
					_$("#segmentedControl").style.display ="none";
			    } else if(urlParam.openFrom && urlParam.openFrom == "meetingCreate"){//没有页签
					_$("#segmentedControl").style.display ="none";
					_$("#headerDiv").style.display ="none";
					_$("#dataCommonDiv").style.top ="0";
					_$("#mrApprovesContainDiv").classList.add("border_t");
					document.title = cmp.i18n("meeting.meetingRoomCommon.alreadyApplied");
				}else{//管理员页签
					_$("#segmentedControl").style.display ="block";
					_$("#mrApprovesContainDiv").classList.remove("border_t");
					document.title = cmp.i18n("meeting.meetingRoomCommon.meetingRoom");
				}
				if (result.haveMeetingRoomPerm && "meetingCreate" != urlParam.openFrom) {//有会议室审核
				    _$("#listMRAudit").style.display = "";
				    var listTypeValue = cmp.storage.get(mrlistKey, true);
				    if(!listTypeValue){
				    	cmp.storage.save(mrlistKey, "mrAuditList", true);
				    }
				}
				if (result.haveMeetingRoomApp) {//有会议室申请
				    _$("#listMRApprove").style.display = "";
				    _$("#goMeetingRooBtn").style.display = "";
                }
				//显示下方会议页签
				var meetingRole = result.haveMeetingPendingRole || result.haveMeetingDoneRole || result.haveMeetingArrangeRole;
				page.meetingRole = meetingRole;
				if(meetingRole) {
				    _$("#meetingEntrance").style.display = "";
				}
				//初始化列表及数据
				initPageData();
				//初始化会议点击事件
				initEvent();
			},
			error : function(result){
				//处理异常
	        	MeetingUtils.dealError(result);
			}
		});
		
	},meetingBuildVersion);
	
});

function initPageBack() {
    //cmp控制返回
    cmp.backbutton();
    if(MeetingUtils.isFromM3NavBar()){
    	cmp.backbutton.push(cmp.closeM3App);
    }else{
    	cmp.backbutton.push(_goBack);
    }
}

function _goBack() {
	
	var backCount = 0;
	
	var openFrom = urlParam.openFrom;
    if(typeof(openFrom) == "undefined" || "meetingCreate" != openFrom){
    	var historyURL = cmp.parseJSON(cmp.storage.get("cmp-href-history",true));
    	
    	var historyURLCount = historyURL.length -1 ;
    	if(historyURLCount > 0) {
    		for(var i=historyURL.length;i>=0;i--) {
    			if(historyURL[i] != undefined && historyURL[i].url.indexOf("meeting_list_pending") != -1) {
    				backCount = historyURL.length - i;
    			}
    		}
    	}
    }
    if(!page.meetingRole) {
        if (backCount==0 || backCount==1) {
            backCount = 2;
        } else{
            backCount++;
        }
    }
	
	if(MeetingUtils.getBackURL() == "weixin"){
        //返回到外层, 微信入口逻辑，因为微信没办法返回到首页，所以这样处理， 暂时不要和else分支合并
        cmp.href.closePage();
    }else {
        //返回到外层
        cmp.href.back(backCount);
    }
}

//添加缓存
function intListCache() {
	//当前列表显示的缓存
	cmp.storage.save(mrlistKey, page.listType, true);
}

function initEvent(){
	//跳转到已申请列表
    _$("#listMRApprove").addEventListener("tap",fnGoMRApproveList);
    //跳转到审核列表
    _$("#listMRAudit").addEventListener("tap",fnGoMRAuditList);
    
    //切换到会议列表界面
    _$("#meetingEntrance").addEventListener("tap", function(){
    	var historyURL = cmp.parseJSON(cmp.storage.get("cmp-href-history",true));
    	if(historyURL.length == 1 && historyURL[0] != undefined && historyURL[0].url.indexOf("meeting_list_pending") != -1) {
    		cmp.storage["delete"]("cmp-href-history", true);
    	}
    	
        cmp.href.go(_meetingPath + "/html/meeting_list_pending.html"+meetingBuildVersion,{},{animated:false});
    });
    
    var openFrom = urlParam.openFrom;
    if(openFrom && "meetingCreate" == openFrom){
    	//返回
    	cmp("#dataCommonDiv").on("tap", ".detail_wrap", function() {
    		var meetingCreateCache = {
				roomName : this.getAttribute("roomName"),
				roomId : this.getAttribute("roomId"),
				roomappId : this.getAttribute("roomappId"),
				startDate : this.getAttribute("startDatetime"),
				endDate : this.getAttribute("endDatetime"),
				meetingPlace_type : "applied"
			};
			cmp.storage.save(urlParam.cacheKey_mcBackDatas, cmp.toJSON(meetingCreateCache), true);
    		
    		cmp.href.back();
    	});
    	
    	_$("#goMeetingRooBtn").style.display = "none";
    }else{
    	//点击展开详细页面
    	cmp("#dataCommonDiv").on("tap", ".detail_wrap", function() {
    		var paramData = {
				"openFrom" : getOpenFrom(),
				"roomAppId" : this.getAttribute("roomappId")
    		}
    		//存人缓存
    		intListCache();
    		cmp.event.trigger("beforepageredirect",document);

			var option = {};
    		if(MeetingUtils.isFromM3NavBar()){
				option.openWebViewCatch = true;
				paramData.isFromM3NavBar = "true";
			}
    		
    		cmp.href.next(_meetingPath + "/html/meetingRoomApprove.html"+meetingBuildVersion, paramData,option);
    	});
    	
    	//点击进入会议室列表
    	_$("#goMeetingRooBtn").addEventListener("tap", function(){
    		var paramData = {
				"action" : "applyMeetingRoom"
    		}

			var option = {};
    		if(MeetingUtils.isFromM3NavBar()){
				option.openWebViewCatch = true;
				paramData.isFromM3NavBar = "true";
			}
    		
    		cmp.href.next(_meetingPath + "/html/meetingRoomList.html"+meetingBuildVersion,paramData,option);
    	});
    }
    
    cmp.webViewListener.add({
	    type: 'meeting.ListRefresh'
	});
	document.addEventListener("meeting.ListRefresh", function(ret){
    	var refreshList = ret.data.refreshList;//刷新列表数据
    	
    	if(refreshList && refreshList == "true"){
        	page.loadAll = true;
    		refreshListview = true;
    		cmp.listView(_currentListDiv).pullupLoading(page[_currentListDiv]['pageNo']);
    	}
	});
}

/**
 * retrun mrApproveList、mrAuditList （会议室已申请列表、会议室审核列表）
 */
function getOpenFrom(){
	return page.listType;
}

/**
 * 跳转到会议室已申请列表
 */
function fnGoMRApproveList() {
	if (!_$("#listMRApprove").classList.contains("cmp-active")) {
		page.listType = "mrApproveList";
		loadData("#mrApprovesContainDiv",$s.Meeting.getApplyMeemtingRooms,[{},{}]);
	}
}

function fnGoMRAuditList() {
	if (!_$("#listMRAudit").classList.contains("cmp-active")) {
		page.listType = "mrAuditList";
		
		loadData("#mrAuditsContainDiv",$s.Meeting.getMeetingRoomAudits,[{},{}]);
	}
}


function initPageData() {
	var openFrom = urlParam.openFrom;
    if(!openFrom || "meetingCreate" != openFrom){
        if (page.haveMeetingRoomApp) {
            _$("#goMeetingRooBtn").style.display = "";
        }
    	_$("#footerArea").style.display = "";
    }
	
	//从缓存从读取当前显示的页签。默认为已申请列表
	var listTypeValue = cmp.storage.get(mrlistKey, true);
    if(listTypeValue){
    	page.listType = listTypeValue;
    	cmp.storage["delete"](mrlistKey, true);
    } else {
    	page.listType = "mrApproveList";
    }
	
	//已申请列表
	if(page.listType == "mrApproveList") {
		loadData("#mrApprovesContainDiv",$s.Meeting.getApplyMeemtingRooms,[{},{openFrom:urlParam.openFrom}]);
	} else{ //管理员审核列表
		page.listType = "mrAuditList";
		loadData("#mrAuditsContainDiv",$s.Meeting.getMeetingRoomAudits,[{},{}]);
	}
}

function loadData(currentList,subDataFunc,params) {
	initCurrentDiv(currentList);
	initListView(currentList,subDataFunc,params);
}

function initCurrentDiv(currentList) {
	if(currentList == '#mrApprovesContainDiv'){
		$fillArea = _$("#mrApproves");
		_$("#listMRApprove").classList.add("cmp-active");
		_$("#listMRAudit").classList.remove("cmp-active");
		_$("#mrApprovesContain").classList.add("cmp-active");
		_$("#mrAuditsContain").classList.remove("cmp-active");
	}
	else if(currentList == '#mrAuditsContainDiv'){
		$fillArea = _$("#mrAudits");
		_$("#listMRAudit").classList.add("cmp-active");
		_$("#listMRApprove").classList.remove("cmp-active");
		_$("#mrAuditsContain").classList.add("cmp-active");
		_$("#mrApprovesContain").classList.remove("cmp-active");
		
	}
}

function initListView(currentList,subDataFunc,params) {
	_currentListDiv = currentList;
	cmp.listView(currentList, {
		imgCache:true,
	    config: {
	        onePageMaxNum:60,
	        isClear: false,
	        clearCache: isListViewRefresh(),
	        pageSize: 20,
	        crumbsID : currentList,
	        params: params,
	        dataFunc: function(p1, p2, options) {
	        	page[_currentListDiv] = {};
	        	page[_currentListDiv]['pageNo'] = p2.pageNo;
	        	
	        	if(page.loadAll){
	        		p2.pageNo = 1;
	        		p2.pageSize = page[_currentListDiv]['pageNo'] * p2.pageSize;
	        		page.loadAll = false;
	        	}
	        	subDataFunc({}, p2, options);
	        },
	        renderFunc: renderData
	    },
	    down: {
  	  		contentprepage:cmp.i18n("meeting.page.lable.prePage"),//上一页
  	  		contentdown:cmp.i18n("meeting.page.action.pullDownRefresh"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
  	  		contentover: cmp.i18n("meeting.page.action.loseRefresh"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
  	  		contentrefresh: cmp.i18n("meeting.page.state.refreshing")//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
  	  	},
  	  	up: {
	  	  	contentnextpage:cmp.i18n("meeting.page.lable.nextPage"),//下一页
	        contentdown: cmp.i18n("meeting.page.action.loadMore"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("meeting.page.state.loading"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
	        contentnomore: cmp.i18n("meeting.page.state.noMore")//可选，请求完毕若没有更多数据时显示的提醒内容；
  	  	}
	});
}

function renderData(result, isRefresh){
	var rmListTPL = _$("#list_li_tpl").innerHTML;
	var html = cmp.tpl(rmListTPL, result);
	if (isRefresh || refreshListview) {//是否刷新操作，刷新操作 直接覆盖数据
		$fillArea.innerHTML = html;
		refreshListview = false;
	} else {
		cmp.append($fillArea,html);
	}
}
