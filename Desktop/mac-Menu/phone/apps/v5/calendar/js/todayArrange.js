/*!
 * @description	日程安排	
 * @file		timeArrange.js
 * @author 		shuqi 	at 2017-01-10
 */
;~(function(cmp,window,$api,$){
	//======================================================================================//
	// 		页面常量
	//======================================================================================//
	// 列表模板
	var timeArrangrTpl = $("#time-arrangr-tpl").innerHTML;
	// 弹出框超时关闭
	var notificationTimeout = 1000;
	
	//======================================================================================//
	// 		日程安排
	//======================================================================================//
	var timeArrangeCalender;
	window.timeArrange = {
		init : function() {
			cmp.dialog.loading();
			
			cmp.backbutton();
    		cmp.backbutton.push(cmp.href.back);
			// 初始化事件
			timeArrange.initEvent();
			// 设置内容区域的高度
			var $scheContent	= $(".sche-content");
			$(".schedule_list").style.height = $scheContent.offsetHeight  + "px";
			// 从后台获取数据
			var today = new Date().calformat("yyyy-MM-dd");
			var startDate = Date.calParseDateTime(today + " 00:00:00").getTime();
			var endDate = Date.calParseDateTime(today+ " 23:59:59").getTime();
			timeArrange.loadData(startDate,endDate,function(data){
				// 显示选中的天的数据
				if(data.length == 0 ){
					var html = "";
					html+= '<li class="time-nodata">';
		    		html+= '	<div class="StatusContainer">';
		    		html+= '		<div class="nocontent"></div>';  
					html+= '		<span class="text nocontent_text">' + cmp.i18n("calendar.label.noevent") + '</span></div>';
		    		html+= '	</div>';
					html+= '</li>';
					$(".time-arrange-list").innerHTML = html; //"<li><p class='empty'>" + cmp.i18n("calendar.label.noevent") + "</p></li>"
				}else{
					$(".time-arrange-list").innerHTML = cmp.tpl(timeArrangrTpl, data);
				}
				cmp.dialog.loading(false);
			});
		},
		/** 读取数据 */
		loadData:function(startDate,endDate,callback){
			var params = {};
			params.startTime = startDate;
			params.endTime = endDate;
			params.from = "robot";
			params.apps = [5,6];
			$api.Events.findTimeArrange({},params,{
				repeat: true,
				success:function(data){
					if(data.success){
						callback(data.datas);
					}else{
						cmp.notification.toast(data.msg, "center", notificationTimeout);
						cmp.dialog.loading(false);
					}
				},
				error:function(err){
					cmp.dialog.loading(false);
					if (cmp.errorHandler(err)) {
						
					} else {
						cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
					}
				}
			});
		},
		/* 初始化事件 */
		initEvent : function() {
			// 列表数据穿透
			cmp(".time-arrange-list").on("tap",".arrange-item",function(){
				var sid = this.getAttribute("sid");
				var stype = this.getAttribute("stype");
				var summaryId = this.getAttribute("summaryId");
				//plan/task/meeting/event/collaboration/edoc
				if(stype == "calendar"){
					// 日程
					cmp.href.next(_calendarPath + "/html/newCalEvent.html?datetime=" + new Date().getTime(),{id:sid + ""});
				}else if(stype == "plan"){
					//计划没有穿透
				}else if(stype == "meeting"){
					// 会议
					//cmp.href.next(_meetingPath + "/html/meetingDetail.html?datetime=" + new Date().getTime(),{meetingId:sid + ""});
					meetingApi.jumpToMeetingDetail(sid,"timeArrange");
				}else if(stype == "collaboration"){
					// 协同
					//cmp.href.next(_collaborationPath + "/html/details/summary.html?datetime=" + new Date().getTime(),{"affairId":sid,"summaryId":summaryId,"openFrom":"listPending"});
					collApi.openSummary({"affairId":sid,"summaryId":summaryId,"openFrom":"listPending"});
				}else if(stype == "edoc"){
					// 公文
					//cmp.href.next(_edocPath + "/html/edocSummary.html?datetime=" + new Date().getTime(), {affairId:sid});
					edocApi.openSummary({"affairId":sid});
				}else if(stype == "taskManage"){
					// 任务
					cmp.href.next(_taskmanagePath + "/html/taskEditor.html?datetime=" + new Date().getTime(),{taskId:sid + ""});
				}
			});
		}
	}
	//======================================================================================//
	// 		原生的Date对象增强
	//======================================================================================//
	/**
	 * 日期格式化：data.format("yyyy-MM-dd HH:mm:ss") q:季度(h也表示24小时制)
	 * 
	 * @param fmt 日期格式
	 * @returns 返回格式化后的字符串
	 */
	Date.prototype.calformat = function(fmt) {
		var regexs = {
				"M+" : this.getMonth() + 1, // 月份
				"d+" : this.getDate(), // 日
				"H+" : this.getHours(), // 小时
				"m+" : this.getMinutes(), // 分
				"s+" : this.getSeconds(), // 秒
				"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
				"S" : this.getMilliseconds()
				// 毫秒
		};
		// 年
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		// 其他的格式化
		for ( var k in regexs) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (regexs[k]) : (("00" + regexs[k]).substr(("" + regexs[k]).length)));
			}
		}
		return fmt;
	}
	/**
	 * 日期加天
	 */
	Date.prototype.addDay = function(day){
	    return new Date(this.getTime() + 24*60*60*1000*day);
	}
	/**
	 * 将日期字符串（yyyy-MM-dd）转换为Date对象，
	 * 
	 * @param source 字符串
	 */
	Date.calParseDate = function(source) {
		var sdate = source.split("-")
		return new Date(sdate[0], sdate[1] - 1, sdate[2])
	}
	Date.calequalsDate = function(a,b) {
		return a.getFullYear() == b.getFullYear() &&a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
	}
	/**
	 * 将日期时间字符串（yyyy-MM-dd HH:mm:ss）转换为Date对象
	 * 
	 * @param source 字符串
	 */
	Date.calParseDateTime = function(source) {
		var sdatetime = source.split(" ")
		var sdate = sdatetime[0].split("-")
		var stime = sdatetime[1].split(":")
		return new Date(sdate[0], sdate[1] - 1, sdate[2], stime[0], stime[1], stime[2]);
	}
})(cmp,window,SeeyonApi,function(selector, queryAll , target ) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
});