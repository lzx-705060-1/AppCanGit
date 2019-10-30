var urlParam;
var page = {};
var _currentListDiv= "#page011"; //当前列表
var $fillArea = _$("#joinUserDiv");
var listType = "join";

/********************************** 初发化方法  ***********************************/

cmp.ready(function () {
	
	urlParam = cmp.href.getParam();
	
	initPageBack();
	
	cmp.i18n.init(_meetingPath+"/i18n/", "MeetingResources", function() {
		page = urlParam;
		initHtml();
		
		//初始化页面数据
		initPageData(_currentListDiv);
		
		//初始化列表切换事件
		initEvent();
	},meetingBuildVersion);
});

/****************************** 监听返回事件(放到最前头)  ******************************/
function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
}


function _goBack() {
    cmp.href.back();
}

function initEvent() {
    
    //跳转到参加
    _$("#join").addEventListener("tap",fnGoJoinList);
    //跳转到待定
    _$("#pending").addEventListener("tap",fnGoPendingList);
    //跳转到不参加
    _$("#noJoin").addEventListener("tap",fnGoNoJoinList);
    //跳转到未回执
    _$("#noFeedback").addEventListener("tap",fnGoNoFeedbackList);
    
}
/********************************** 页面布局  ***********************************/

/**
 * 页面样式设置
 */
function initHtml() {
    if(page.operate == "conferee" || page.operate == "leader"){
      //国际化title标签
        var titleI18n;
        var memberNumber;
        if(page.operate == "conferee"){
        	titleI18n = "meeting.page.lable.conferees";
            _$("#joinNumber").innerHTML = page.con_attend;
            _$("#pendingNumber").innerHTML = page.con_pending;
            _$("#noJoinNumber").innerHTML = page.con_noAttend;
            _$("#noFeedbackNumber").innerHTML = page.con_noReply;
        }else if(page.operate == "leader"){
            titleI18n = "meeting.meetingDetail.leader";
            _$("#joinNumber").innerHTML = page.lea_attend;
            _$("#pendingNumber").innerHTML = page.lea_pending;
            _$("#noJoinNumber").innerHTML = page.lea_noAttend;
            _$("#noFeedbackNumber").innerHTML = page.lea_noReply;
        }
        
    }else if(page.operate == "impart"){
    	titleI18n = "meeting.meetingCreate.notify";
        _$("#join").innerHTML=cmp.i18n("meeting.meetingDetail.replyOk") + "<div class=\"userNumber\" id=\"joinNumber\"></div>";
        _$("#pending").style.display = "none";
        _$("#noJoin").style.display = "none";
        _$("#joinNumber").innerHTML = page.imp_reply;
        _$("#noFeedbackNumber").innerHTML = page.imp_noReply;
    }
    _$("title").innerText=cmp.i18n(titleI18n);
}
/**
 * 页面数据装载 
 */
function initPageData(currentListDiv) {
    
    cmp.listView(currentListDiv,{
        offset:{x:0,y:0},
        imgCache:true,
        config: {
            params: {
                "affairId" : page.affairId,
                "meetingId" : page.meetingId,
                "operate" :  page.operate,
                "listType" : listType
            },
            dataFunc: function(params, options){
            	if(typeof(params.affairId) == "undefined"){
            		params.affairId = -1;
            	}
            	$s.Meeting.showMeetingMembers(params, {
		    		success : function(result) {
		    			if(options.success) {
		            		options.success(result);
		            	}
						if(result.total>0){
                            var divkey="";
                            var isReminders=true;
                            if(listType=='pending'){
                                divkey="#remindersPendingUserDiv";
                            }else if(listType=='noFeedback'){
                                divkey="#remindersNoFeedbackUserDiv";
                            }else{
                                isReminders=false;
                            }
                            /*if(isReminders){
                            	var currentUserId=page.currentUserId;
            					var createUserId=page.meeting.createUser;
            					var proxyId=page.meeting.proxyId;
                                if((currentUserId==createUserId||(page.meeting.proxy&&currentUserId==proxyId))&&(page.meeting.state!=30&&page.meeting.state!=31)){
                                   // _$(divkey).style.display='';
                                }
                            }*/
                        }
		            },
		            error : function(result){
		            	//处理异常
		            	MeetingUtils.dealError(result);
		            }
		        })
	        },
            isClear: false,
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

function remindersPending(){
	var currentUser=page.currentUser;
	var pendingUsers=page.replyList;
	var receiverIds="";
	for(var i=0;i<pendingUsers.length;i++){
		if(pendingUsers[i].feedbackFlag=="-1"){/*只添加待定状态的(-1：待定；0：不参加；1：参加)*/
			receiverIds+=pendingUsers[i].userId+",";
		}
	}
	var meetingId=page.meetingId;
	var senderId=page.currentUserId;
	var paramData={"meetingId":meetingId,"senderId":senderId,"receiverIds":receiverIds};
	sendRemindersMeetingReceiptMessage(paramData);
}

function remindersNoFeedback(){
	var receiverIds=page.noFeedBackMemberIds;
	var meetingId=page.meetingId;
	var senderId=page.currentUserId;
	var paramData={"meetingId":meetingId,"senderId":senderId,"receiverIds":receiverIds};
	sendRemindersMeetingReceiptMessage(paramData);
}

function sendRemindersMeetingReceiptMessage(paramData){
	$s.Meeting.sendRemindersMeetingReceiptMessage(paramData,{
		success:function(result){
			// cmp.notification.alert(msg, callback, title, btnName);
			if(result["success"] && result["success"]!=""){
				cmp.notification.alert(cmp.i18n("meeting.page.lable.reminders.success"),null,"",cmp.i18n("meeting.page.dialog.OK"));
			}else {
				cmp.notification.alert(cmp.i18n("meeting.page.lable.reminders.failer"),null,"",cmp.i18n("meeting.page.dialog.OK"));
			}
		}
	});
}

function renderData(result, isRefresh){
    
    var pendingTPL = _$("#replyMemberTpl").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
        $fillArea.innerHTML = html;
        
    } else {
        cmp.append($fillArea,html);
    }
}
/********************************************列表切换*********************************/
function fnGoJoinList() {
    _currentListDiv = "#page011";
    listType = "join";
    $fillArea = _$("#joinUserDiv");
    initPageData(_currentListDiv);
}

function fnGoPendingList() {
    _currentListDiv = "#page022";
    listType = "pending";
    $fillArea = _$("#pendingUserDiv");
    initPageData(_currentListDiv);
}

function fnGoNoJoinList() {
    _currentListDiv = "#page033";
    listType = "noJoin";
    $fillArea = _$("#noJoinUserDiv");
    initPageData(_currentListDiv);
}

function fnGoNoFeedbackList() {
    _currentListDiv = "#page044";
    listType = "noFeedback";
    $fillArea = _$("#noFeedbackUserDiv");
    initPageData(_currentListDiv);
}
