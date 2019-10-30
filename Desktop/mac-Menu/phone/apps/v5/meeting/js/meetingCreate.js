var cacheKey_mcStorageDatas = "m3_v5_meeting_meetingCreate_datas"; //缓存当前已经录入的数据，离开页面返回后回现
var cacheKey_mcBackDatas = "m3_v5_meeting_meetingCreate_backDatas"; //其他页面返回时，需要带回的数据


cmp.ready(function () {
	initPageBack();
	setPageTitle("meeting.meetingCreate.createNewMeeting");
	//注册懒加载
    _registLazy();
    
	cmp.i18n.init(_meetingPath+"/i18n/", "MeetingResources", function() {
		initPageData();
		initEvent();
	},meetingBuildVersion);

	pageX.action = "create";
});

//注册缓加载
function _registLazy(){
    
      LazyUtil.addLazyStack({
          "code" : "lazy_cmp",
          "css" : [
                   _cmpPath + "/css/cmp-picker.css" + $verstion,
                   _cmpPath + "/css/cmp-accDoc.css" + $verstion,
                   _cmpPath + "/css/cmp-att.css" + $verstion,
                   _cmpPath + "/css/cmp-search.css" + $verstion,
                   _cmpPath + "/css/cmp-selectOrg.css" + $verstion,
                   _cmpPath + "/css/cmp-listView.css" + $verstion
                   ],
          "js" : [
                  _cmpPath + "/js/cmp-picker.js" + $verstion,
                  _cmpPath + "/js/cmp-popPicker.js" + $verstion,
                  _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                  _cmpPath + "/js/cmp-accDoc.js" + $verstion,
                  _cmpPath + "/js/cmp-att.js" + $verstion,
                  _cmpPath + "/js/cmp-search.js" + $verstion,
                  _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                  _cmpPath + "/js/cmp-emoji.js" + $verstion,
                  _cmpPath + "/js/cmp-listView.js" + $verstion,
                  _common_v5_path + "/widget/SeeyonAttachment.s3js" + $verstion
                  ]
      });
  }

function initPageData(){
	//初始化人员人员信息
	setDefaultMemberInfo();
	
	//初始化时间
	var params = cmp.href.getParam();
	var currentDate = null;
	if (typeof(params) != "undefined") {
		currentDate = params.currentDate;
	}
	var initDate = getInitDate_30(currentDate);
	_$("#startDate").value = initDate.startDatetime.substr(0, 10);
	_$("#startDatetimeLabel").value = initDate.startDatetime.substr(11, 5);
	_$("#endDate").value = initDate.endDatetime.substr(0, 10);
	_$("#endDatetimeLabel").value = initDate.endDatetime.substr(11, 5);
	
	//初始化默认显示值
	setDefaultShowData();
	
	setAttValue("reminder_value", "value", "0");
	setAttValue("meetingNature_value", "value", "1");
	
	//设置缓存数据
	setCacheDatas();
	//根据状态设置是否显示更多
	showOrHideMore();
	//展示或隐藏会议方式
	showNature();
	//根据会议方式控制是否展示密码输入框
	showPassword();
	//设置会议正文高度
	setContentHight();
	//微协同屏蔽附件区域
    if (!MeetingUtils.isCMPShell()) {
       // _$("#attBtn").style.display = "none";
        //_$("#middleArea").style.bottom = "55px";
    }else{
        _$("#middleArea").style.bottom = "95px";
    }
	
	//if(MeetingUtils.isCMPShell()){
    	//设置附件区域数量
    	showAttCount(0, 0);
    	//调用附件组件
    	callSeeyonAttachment();
	//}
	
	//头部适配
	//_$("#meetCreate").style.display = "block";

	//启动懒加载, 性能要求, 延迟是为了指标
    setTimeout(function(){
        LazyUtil.startLazy();
    }, 0);
}

//设置默认的人员信息
function setDefaultMemberInfo(){
	var cache = cmp.storage.get(cacheKey_mcStorageDatas, true);
	if(cache == null){
		$s.Meeting.create({}, {}, {
			success : function(result) {
				var userInfo = new Array();
				userInfo.push({
					id : result.userId,
					name : result.userName,
					type : "Member"
				});
				cmp.storage.save("m3_v5_meeting_selectOrg_bachCache_host", cmp.toJSON(userInfo), true);
				cmp.storage.save("m3_v5_meeting_selectOrg_bachCache_recoder", cmp.toJSON(userInfo), true);
				var meetingType = new Array();
				meetingType.push({
					success:result.meetingType
				});
				cmp.storage.save("m3_v5_meeting_meetingType",cmp.toJSON(meetingType),true);
				//默认选中第一个会议分类
				if (result.meetingType && result.meetingType.length > 0) {
					_$("#meetingType").value = result.meetingType[0].showName;
					_$("#meetingType_value").value = result.meetingType[0].id;
				}
				
				_$("#host").value = result.userName;
				_$("#host_value").value = result.userId;
				_$("#recoder").value = result.userName;
				_$("#recoder_value").value = result.userId;
				
				//不显示的人员
				var hideUserInfo = userInfo;
				hideUserInfo[0].display = "none";
				
				cmp.storage.save("m3_v5_meeting_selectOrg_bachCache_except_conferees", cmp.toJSON(hideUserInfo), true);
				cmp.storage.save("m3_v5_meeting_selectOrg_bachCache_except_notify", cmp.toJSON(hideUserInfo), true);
				
				pageX.cache.showMeetingVideoArea = result.isShowMeetingNature;
				pageX.cache.showVideoRoomArea = result.isShowVideoRoom;
				//展示或隐藏会议方式\视频会议地点
				showNature();
			},
            error : function(result){
            	//处理异常
            	MeetingUtils.dealError(result);
            }
		});
	}
}

function submit(paramData){
	$s.Meeting.send({}, paramData, {
		success : function(result) {
			if(result["errorMsg"] && result["errorMsg"]!="") {
				createAlter(result["errorMsg"], null);
				isSubmit = false;
				return;
			}
			if(result["type"] == "send"){
				if(result["roomAppState"] && result["roomAppState"] == 0){ //待审核
					createAlter(cmp.i18n("meeting.meetingCreate.publish1"), function(){
						cmp.storage.save(meeting_list_type_cache_key, "listSent", true);
						_dealGoBack(1, "listSent");
					});
				}else{
					createAlter(cmp.i18n("meeting.meetingCreate.publish"), function(){
						cmp.storage.save(meeting_list_type_cache_key, "listPending", true);
						_dealGoBack(1, "listPending");
					});
				}
			}else if(result["type"] == "save"){
				createAlter(cmp.i18n("meeting.meetingCreate.publish2"), function(){
					cmp.storage.save(meeting_list_type_cache_key, "listWaitSent", true);
					_dealGoBack(1, "listWaitSent");
				});
			}
		},
        error : function(result){
        	isSubmit = false;
        	//处理异常
        	MeetingUtils.dealError(result);
        }
	});
}

//获取初始化的时间  开始时间是当前时间后接近的半点或整点
function getInitDate_30(data){
	var nowDate = new Date();
	if(data != null ){
      nowDate  = new Date(data);
	}
	var startDatetime, endDatetime, minutes;
	var nowMinutes = nowDate.getMinutes();
	if(nowMinutes == 30 || nowMinutes == 0){
		startDatetime = nowDate;
	}else{
		minutes = nowMinutes - 30 > 0 ? 60 - nowMinutes : 30 - nowMinutes;
		startDatetime = new Date(Date.parse(nowDate) + (60000 * minutes));
	}
	
	endDatetime = new Date(Date.parse(startDatetime) + (60000 * 60));
	
	var dateTime = {
		startDatetime : formatDate(startDatetime),
		endDatetime : formatDate(endDatetime)
	};
	return dateTime;
}

//格式化时间
function formatDate(time){
	var year = time.getFullYear(),
	month = time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1,
	date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(),
	hours = time.getHours() == 0 ? "00" : time.getHours() < 10 ? "0" + time.getHours() : time.getHours(),
	minutes = time.getMinutes() == 0 ? "00" : time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();

	return year + "-" + month + "-" + date + " " + hours + ":" + minutes;
}