var urlParam;

/**
 * 接收参数描述
 * roomId      会议室ID
 */
cmp.ready(function () {
	urlParam = cmp.href.getParam();
	initPageBack();
	setPageTitle("meeting.meetingRoomDetail.detail");
	cmp.i18n.init(_meetingPath+"/i18n/", "MeetingResources", function() {
		initPageData();
	},meetingBuildVersion);
});

function initPageBack() {
	
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_isClearGoBack);
}

function _isClearGoBack() {
    setListViewRefresh("true");
    _goBack();
}

function _goBack() {

    if(MeetingUtils.getBackURL() == "weixin"){
        //返回到外层, 微信入口逻辑，因为微信没办法返回到首页，所以这样处理， 暂时不要和else分支合并
        cmp.href.closePage();
    }else {
        //返回到外层
        cmp.href.back();
    }
}

function initPageData(){
	var paramData = {roomId : urlParam.roomId};
	$s.Meeting.getMeetingRoom({}, paramData, {
		success : function(result) {
			if(result["errorMsg"] && result["errorMsg"]!="") {
        		cmp.notification.alert(result["errorMsg"], null, cmp.i18n("meeting.page.dialog.note"), cmp.i18n("meeting.page.dialog.OK"));
        		return;
        	}
			
			_$("#name").innerHTML = result.meetingRoom.name;
			_$("#seatCount").innerHTML = result.meetingRoom.seatCount;
			_$("#place").innerHTML = result.meetingRoom.place;
			_$("#description").innerHTML = result.meetingRoom.description;
			_$("#device").innerHTML = result.meetingRoom.eqdescription;
			_$("#adminNames").innerHTML = result.adminNames;
			if(result.image){
				_$("#meetingRoomImage").src = cmp.serverIp + "/seeyon/commonimage.do?method=showImage&id=" + result.image + "&size=custom&w=" + document.body.offsetWidth + "&h=200";
			}else{
				_$("#meetingRoomImage").src = cmp.serverIp + "/seeyon/m3/apps/v5" + MeetingUtils.getDefaultImage();
				_$("#meetingRoomImage").style.height = "200px";
			}
			cmp.listView("#scroller");
		},
		error : function(result){
        	//处理异常
        	MeetingUtils.dealError(result);
		}
	});
}