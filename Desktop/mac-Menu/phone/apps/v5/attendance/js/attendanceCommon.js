var attendanceCommon = {
	/**
	 * 根据后台返回格式(yyyy-MM-dd HH:mm:ss或者当前秒数)初始化日期
	 * 返回 XXXX年XX月 XX日 星期X
	 * @param {Object} date
	 */
	getCurrentDate : function(date){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		var weekDay = [cmp.i18n("Attendance.label.sunday"), cmp.i18n("Attendance.label.monday"), cmp.i18n("Attendance.label.tuesday"), cmp.i18n("Attendance.label.wednesday"), cmp.i18n("Attendance.label.thursday"), cmp.i18n("Attendance.label.friday"), cmp.i18n("Attendance.label.saturday")];
		var week = weekDay[date.getDay()];
		return date.format(cmp.i18n("Attendance.label.date")) + " " + week;
	},
	/**
	 * 根据后台返回格式(yyyy-MM-dd HH:mm:ss或者当前秒数)初始化日期
	 * 返回 XX时XX分
	 * @param {Object} date
	 */
	getCurrentTime : function(date){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		return date.format("hh:mm");
	},
	/**
	 * 根据后台返回格式(yyyy-MM-dd HH:mm:ss或者当前秒数)初始化日期
	 * 返回 指定格式
	 * @param {Object} date
	 */
	getCurrentByPattern : function(date,pattern){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		return date.format(pattern);
	},
	/**
	 * 获取指定日期的当天开始时间
	 * @param {Object} date
	 */
	getFirstTimeOfDay : function(date){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		return date.format("yyyy-MM-dd") + " 00:00:00";
	},
	/**
	 * 获取指定日期的当天结束时间
	 * @param {Object} date
	 */
	getLastTimeOfDay : function(date){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		return date.format("yyyy-MM-dd") + " 23:59:59";
	},
	/**
	 * 获取日期信息
	 */
	getDataInfo : function(date){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		var weekDay = [cmp.i18n("Attendance.label.sunday"), cmp.i18n("Attendance.label.monday"), cmp.i18n("Attendance.label.tuesday"), cmp.i18n("Attendance.label.wednesday"), cmp.i18n("Attendance.label.thursday"), cmp.i18n("Attendance.label.friday"), cmp.i18n("Attendance.label.saturday")];
		var week = weekDay[date.getDay()];
		var dataObj = {
			year : date.getFullYear(),
			month : date.getMonth() + 1,
			day : date.getDate(),
			weekDay : week
		}
		return dataObj;
	},
	/**
	 * 根目録
	 */
	getCmpRoot : function(){
		return cmp.serverIp ? cmp.serverIp : "";
	},
	/*
	 * ajax请求error处理
	 */
	dealAjaxError : function(error){
		var cmpHandled = cmp.errorHandler(error);
		if(!cmpHandled){
			console.log(error);
			if(error.message){
				cmp.notification.alert(error.message);
			}else{
				cmp.notification.alert(error);
			}
		}
	},
	/**
	 * 规定时间间隔执行函数
	 */
	throttle : function(fun,scope){
		if(fun.state == 1){
			return;
		}
		fun.state = 1;
		fun.call(scope);
		setTimeout(function(){
			fun.state = 0;
		},500);
	},
	//添加webview监听
	addWebviewEvent : function(callback){
		cmp.webViewListener.addEvent("attendance_webview_event",function(e){
			if(typeof callback === 'function'){
				callback(e);
			}
	    });
	},
	//触发webview监听
	fireWebviewEvent : function(data){
		cmp.webViewListener.fire({
	        type:"attendance_webview_event",
	        data:data,
	        success:function(){
	        },
	        error:function(error){
				console.log(error);
	        }
	    });
	}
}
