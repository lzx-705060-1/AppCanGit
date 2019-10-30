/*!
 * @description	日程安排	
 * @file		timeArrange.js
 * @author 		shuqi 	at 2017-01-10
 */
;~(function(cmp,window,$api,$){
	
	
	//======================================================================================//
	// 		页面常量
	//======================================================================================//
	var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	// 列表模板
	var timeArrangrTpl;
	// 视图数据缓存
	var sDataCache = {};//月份数据缓存{"20170201-20171012":[{获取数据的原始数据}]}
	var fDataCache = {};//月份标红点数据缓存{"20170201-20171012":["2017-02-12","2017-02-21"]}
	var fDayDataCache   = {};//月份-天数据格式化后缓存{"20170212":[{获取数据的原始数据}]}
	// 弹出框超时关闭
	var notificationTimeout = 1000;
	//是否从底导航打开
	var isFromM3NavBar = window.location.href.match('m3from=navbar');
	//门户这边 判断是否需要初始化事件的标识
	var isNeedInitEvent = true;
	//======================================================================================//
	// 		日程安排
	//======================================================================================//
	window.timeArrangeCalender = new Object();
	window.timeArrange = {
		init : function(module,currentColumnData,timeArrangrTplInnerHTML,_parameter) {
			
			//日程类栏目
			if(module == "portal"){
			timeArrangrTpl = timeArrangrTplInnerHTML;
			var columnId = currentColumnData._id;

				timeArrange.initEvent(module,columnId,_parameter);

				// 日程选项
				var op = getCalendarOptions();
				timeArrangeCalender[columnId] = new cmp.DateCalender("#calender"+columnId, {
					y : op.y,
					m : op.m,
					d : op.d,
					dateSwitch : false,
					type : op.type,
					callback : function(ret) {

						//第一次初始化
						if(timeArrangeCalender[columnId] == null){
							
							timeArrangeCalender[columnId] = this;
							var _parameter0 = [];
							for(var x in currentColumnData.Data.calendarMap){
								if(currentColumnData.Data.calendarMap[x] == "yes"){
									_parameter0.push(x);
								}
							}
							//标记有日程的点
							processRangePoint(null,null,_parameter0,columnId);

							var processDayData = currentColumnData.Data.data;
							var _parameter1 = {module : module,columnId : columnId,processDayData : processDayData};
							// 显示选中的天的数据
							processDayDataList(null,null,_parameter1);
							
							myScroll.refresh();
						}else{
							//点击切换数据
							var _parameter = {};
							_parameter.orgId = currentColumnData.Data.pageOrgId;
							_parameter.source = currentColumnData.Data.source;
							_parameter.state = currentColumnData.Data.state;
							_parameter.showRows = currentColumnData.Data.showRows;
							_parameter.time = ret.value?ret.value:ret.y+"-"+ret.m+"-"+ret.d;
							//后续的操作从后台取数据
							timeArrange.loadData(null,null,function(data){
								var newcurrentColumnData = data;

								var _parameter0 = [];
								for(var x in newcurrentColumnData.calendarMap){
									if(newcurrentColumnData.calendarMap[x] == "yes"){
										_parameter0.push(x);
									}
								}
								//标记有日程的点
								processRangePoint(null,null,_parameter0,columnId);

								var processDayData = newcurrentColumnData.data;
								var _parameter1 = {module : module,columnId : columnId,processDayData : processDayData};
								// 显示选中的天的数据
								processDayDataList(null,null,_parameter1);
								myScroll.refresh();

							},_parameter);
						}

						//移除切换日历的按钮
						if($("#calender"+columnId).querySelector(".show")){
							$("#calender"+columnId).querySelector(".show").remove();
						}
					}
				});
				
			}else{
				timeArrangrTpl = $("#time-arrangr-tpl").innerHTML;
				//日程应用模块
				cmp.dialog.loading();
				
				if(isFromM3NavBar){
					//document.querySelector("#goBackBtn").style.display = "none";
					cmp.backbutton();
					cmp.backbutton.push(cmp.closeM3App);
				}else{
					/* 返回按钮 */
					/*document.querySelector("#goBackBtn").addEventListener("click",function(){
						cmp.href.back();
					});*/
					cmp.backbutton();
		    		cmp.backbutton.push(cmp.href.back);
				}


				// 初始化事件
				timeArrange.initEvent();
				// 设置内容区域的高度
				resizeContent();
				//判断是否显示同步
				setTimeout(function(){
					if(cmp.platform.CMPShell === true){
						$(".time-arrange-sync").classList.remove("time-arrange-hide");
					}
				},200);
				// 日程选项
				var op = getCalendarOptions();
				timeArrangeCalender['calender'] = new cmp.DateCalender("#calender", {
					y : op.y,
					m : op.m,
					d : op.d,
					type : op.type,
					callback : function(ret) {
						if(timeArrangeCalender['calender'] == null){
							timeArrangeCalender['calender'] =this;
						}
						cmp.dialog.loading();
						// console.log("返回数据！",ret);
						// 1、改变了视图类型，改变列表高宽
						//if(calendarOptions.type != ret.type){//改变了视图类型
							resizeContent();
						//}else if(calendarOptions.type == "month" && ret.bm != calendarOptions.m){//切换月份
						//	resizeContent();
						//}
						
						// 2、基本数据缓存
						var cacheKey = getFormartDate(ret.by,ret.bm,ret.bd,"") + "-" + getFormartDate(ret.ey,ret.em,ret.ed,"");
						var oldCacheKey = getFormartDate(calendarOptions.by,calendarOptions.bm,calendarOptions.bd,"") + "-" + getFormartDate(calendarOptions.ey,calendarOptions.em,calendarOptions.ed,"") ;
						calendarOptions.by = ret.by;
						calendarOptions.bm = ret.bm;
						calendarOptions.bd = ret.bd;
						calendarOptions.ey = ret.ey;
						calendarOptions.em = ret.em;
						calendarOptions.ed = ret.ed;
						calendarOptions.type = ret.type;
						if( ret.y != null ){
							calendarOptions.y = ret.y;
							calendarOptions.m = ret.m;
							calendarOptions.d = ret.d;
						}
						
						// 3、获取数据
						if(oldCacheKey == cacheKey && sDataCache[cacheKey] != null){
							// 显示选中的天的数据
							processDayDataList(ret,cacheKey);
							cmp.dialog.loading(false);
						}else if(sDataCache[cacheKey] != null){
							// 已经存在原始
							processRangePoint(ret,cacheKey);
							// 显示选中的天的数据
							processDayDataList(ret,cacheKey);
							cmp.dialog.loading(false);
						}else{
							// 从后台获取数据
							var startDate = Date.calParseDateTime(getFormartDate(ret.by,ret.bm,ret.bd,"-") + " 00:00:00").getTime();
							var endDate = Date.calParseDateTime(getFormartDate(ret.ey,ret.em,ret.ed,"-")+ " 23:59:59").getTime();
							timeArrange.loadData(startDate,endDate,function(data){
								//缓存数据
								sDataCache[cacheKey] = data;
								// 已经存在原始
								processRangePoint(ret,cacheKey);
								// 显示选中的天的数据
								processDayDataList(ret,cacheKey);
								cmp.dialog.loading(false);
							});
						}
					}
				});
			}
		},
		/** 读取数据 */
		loadData:function(startDate,endDate,callback,parameter){
			//首页栏目，只是取当天的数据
			if(parameter != null){
				//我的日程
				if(parameter.orgId == "my"){
					$api.Events.findMyCalendarByPortal({},parameter,{
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
								//CMP处理
							} else {
								cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
							}
						}
					});
				}else{
				//他人日程、部门日程
					$api.Events.findOtherCalendarByPortal({},parameter,{
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
								//CMP处理
							} else {
								cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
							}
						}
					});
				}
			}else{
				var params = getFilterConfig();
				//什么数据都不取
				if(params.apps.length == 0 ||params.status.length == 0  ){
					callback([]);
					return;
				}
				params.startTime = startDate;
				params.endTime = endDate;
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
							//CMP处理
						} else {
							cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
						}
					}
				});
			}
		},
		/* 初始化事件 */
		initEvent : function(module,columnId,_parameter) {
			//如果是首页的话，只需要初始化列表的数据穿透即可
			if(module == "portal"){
				
				var arrangeauths = null;
				cmp("#calenderAdd"+columnId).off("tap","#timeArrange"+columnId+"Add").on("tap", "#timeArrange"+columnId+"Add", function() {
					if(arrangeauths == null){
						cmp.dialog.loading();	
						arrangeauths = $api.Events.findArrangeAuths({},{
							repeat: true,
							success:function(data){
								arrangeauths = data;
								arrangeauths.hasCalEventAuth && $(".shortcut .calEventCreate").classList.remove("time-arrange-hide");
								arrangeauths.hasTaskAuth && $(".shortcut .taskCreate").classList.remove("time-arrange-hide");
								arrangeauths.hasMeetingAuth && $(".shortcut .meetingCreate").classList.remove("time-arrange-hide");
								$(".shortcut").classList.remove("time-arrange-hide");
								$("#scroller").classList.add("blur");
								myScroll.disable();
								cmp.dialog.loading(false);	
							},
							error:function(err){
								cmp.dialog.loading(false);
								if (cmp.errorHandler(err)) {
									//CMP处理
								} else {
									cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
								}
							}
						});
					}else{
						arrangeauths.hasCalEventAuth && $(".shortcut .calEventCreate").classList.remove("time-arrange-hide");
						arrangeauths.hasTaskAuth && $(".shortcut .taskCreate").classList.remove("time-arrange-hide");
						arrangeauths.hasMeetingAuth && $(".shortcut .meetingCreate").classList.remove("time-arrange-hide");
						$(".shortcut").classList.remove("time-arrange-hide");
						$("#scroller").classList.add("blur");
						myScroll.disable();
					}
				});

				bindTimeArrangrPopEvent(_parameter);
				bindTimeArrangrListEvent(columnId,_parameter);  
				//不需要再次初始化事件的标识
			    isNeedInitEvent = false;
			    return;
				
			}


			
			//列表数据穿透
			cmp(".time-arrange-list").on("tap",".arrange-item",function(){
				var sid = this.getAttribute("sid");
				var stype = this.getAttribute("stype");
				var summaryId = this.getAttribute("summaryId");
				if(stype != "plan"){//计划没有穿透
					saveCalendarOptions();
				}
				//plan/task/meeting/event/collaboration/edoc
				if(stype == "calendar"){
					// 日程
					var options = {};
					if(isFromM3NavBar){
						options.openWebViewCatch = 1;
					}
					cmp.href.next(_calendarPath + "/html/newCalEvent.html?datetime=" + new Date().getTime(),{id:sid + ""},options);
				}else if(stype == "plan"){
					//计划没有穿透
				}else if(stype == "meeting"){
					// 会议
					meetingApi.jumpToMeetingDetail(sid,"timeArrange");
				}else if(stype == "taskManage"){
					// 任务 _taskmanagePath
					var options = {portalParam : _parameter};
		            if(isFromM3NavBar){
		               options.openWebViewCatch = 1;
		            }
		            
		        	cmp.href.next(_taskmanagePath + "/html/taskEditor.html",{taskId : sid},options);
				}
			});


			
			// 顶部三个按钮
			var plugins = null;
			var arrangeauths = null;
			cmp("#head_btn_div").on("tap", ".time-arrange-sync", function() {
				if(plugins == null){
					cmp.dialog.loading();	
					$api.Events.findPlugins({},{
						repeat: true,
						success:function(data){
							plugins = data;
							plugins.plan && $(".synchronous .plan").classList.remove("time-arrange-hide");
							plugins.meeting && $(".synchronous .meeting").classList.remove("time-arrange-hide");
							plugins.calendar && $(".synchronous .calendar").classList.remove("time-arrange-hide");
							plugins.taskmanage && $(".synchronous .taskmanage").classList.remove("time-arrange-hide");
							initSyncConfig();
							cmp.dialog.loading(false);
						},
						error:function(err){
							cmp.dialog.loading(false);
							if (cmp.errorHandler(err)) {
								//CMP平台处理
							} else {
								cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
							}
						}
					});
				}else{
					plugins.plan && $(".synchronous .plan").classList.remove("time-arrange-hide");
					plugins.meeting && $(".synchronous .meeting").classList.remove("time-arrange-hide");
					plugins.calendar && $(".synchronous .calendar").classList.remove("time-arrange-hide");
					plugins.taskmanage && $(".synchronous .taskmanage").classList.remove("time-arrange-hide");
					initSyncConfig();
				}
			}).on("tap", ".time-arrange-filter", function() {
				if(plugins == null){
					cmp.dialog.loading();	
					plugins = $api.Events.findPlugins({},{
						repeat: true,
						success:function(data){
							plugins = data;
							plugins.plan && $(".filter_wrap .plan").classList.remove("time-arrange-hide");
							plugins.meeting && $(".filter_wrap .meeting").classList.remove("time-arrange-hide");
							plugins.calendar && $(".filter_wrap .calendar").classList.remove("time-arrange-hide");
							plugins.taskmanage && $(".filter_wrap .taskmanage").classList.remove("time-arrange-hide");
							initFilterConfig();
							cmp.dialog.loading(false);
						},
						error:function(err){
							cmp.dialog.loading(false);
							if (cmp.errorHandler(err)) {
								//CMP处理
							} else {
								cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
							}
						}
					});
				}else{
					plugins.plan && $(".filter_wrap .plan").classList.remove("time-arrange-hide");
					plugins.meeting && $(".filter_wrap .meeting").classList.remove("time-arrange-hide");
					plugins.calendar && $(".filter_wrap .calendar").classList.remove("time-arrange-hide");
					plugins.taskmanage && $(".filter_wrap .taskmanage").classList.remove("time-arrange-hide");
					initFilterConfig();
				}
			}).on("tap", ".time-arrange-addcalevent", function() {
				if(isFromTodoList){//待办进入直接新建日程安排
					newCalendar();
					return;
				}
				if(arrangeauths == null){
					cmp.dialog.loading();	
					arrangeauths = $api.Events.findArrangeAuths({},{
						repeat: true,
						success:function(data){
							arrangeauths = data;
							arrangeauths.hasCalEventAuth && $(".shortcut .calEventCreate").classList.remove("time-arrange-hide");
							arrangeauths.hasTaskAuth && $(".shortcut .taskCreate").classList.remove("time-arrange-hide");
							arrangeauths.hasMeetingAuth && $(".shortcut .meetingCreate").classList.remove("time-arrange-hide");
							$(".shortcut").classList.remove("time-arrange-hide");
							$(".sche-content").classList.add("blur");
							cmp.dialog.loading(false);	
						},
						error:function(err){
							cmp.dialog.loading(false);
							if (cmp.errorHandler(err)) {
								//CMP处理
							} else {
								cmp.notification.toast(cmp.i18n("calendar.label.getdatafail"), "center", notificationTimeout);
							}
						}
					});
				}else{
					arrangeauths.hasCalEventAuth && $(".shortcut .calEventCreate").classList.remove("time-arrange-hide");
					arrangeauths.hasTaskAuth && $(".shortcut .taskCreate").classList.remove("time-arrange-hide");
					arrangeauths.hasMeetingAuth && $(".shortcut .meetingCreate").classList.remove("time-arrange-hide");
					$(".shortcut").classList.remove("time-arrange-hide");
					$(".sche-content").classList.add("blur");
				}
			});
			
			// 新增页面
			cmp(".shortcut").on("tap",".close",function(){
				//关闭
				$(".shortcut").classList.add("time-arrange-hide");
				$(".sche-content").classList.remove("blur");
			}).on("tap",".calEventCreate",function(){
				newCalendar();
			}).on("tap",".meetingCreate",function(){
				// 新建会议
				saveCalendarOptions();
				meetingApi.openApp("timeArrange",null,{"openFrom":"meetingCreate"},{"currentDate":  getCurrentTime()});//type,backUrl,option,obj
			}).on("tap",".taskCreate",function(){
				// 新建任务
				saveCalendarOptions();
				var options = {};
	            if(isFromM3NavBar){
	               options.openWebViewCatch = 1;
	            }
	            var currentDate =  getFormartDate(calendarOptions.y,calendarOptions.m,calendarOptions.d,"-");
	        	cmp.href.next(_taskmanagePath + "/html/taskEditor.html",{"currentDate":currentDate},options);
			})
			
			// 过滤页面
			cmp(".filter_wrap").on("tap", ".item", function() {
				if (this.classList.contains("active")) {
					this.classList.remove("active");
				} else {
					this.classList.add("active");
				}
			}).on("tap", ".ok", function() {
				saveFilterConfig()
			}).on("tap", ".reset", function() {
				resetFilterConfig();
			});
			
			// 同步设置页面
			cmp(".synchronous").on("tap", ".sync", function() {
				saveSyncConfig();
			}).on("tap", ".cancel", function() {
				closeSyncConfig();
			});
		}
	}
	
	function newCalendar(){
		// 新建日程
		saveCalendarOptions();
		var options = {};
		if(isFromM3NavBar){
			options.openWebViewCatch = 1;
		}
		cmp.href.next(_calendarPath + "/html/newCalEvent.html?datetime=" + new Date().getTime(),{"currentDate":getCurrentTime()},options);
		
	}
	
	//初始化Portal日程类栏目的新建浮层的事件
	function bindTimeArrangrPopEvent(_parameter){
		

		// 新建日程浮层的关闭
		cmp(".shortcut").off("tap",".close").on("tap",".close",function(){
			//关闭
			$(".shortcut").classList.add("time-arrange-hide");
			$("#scroller").classList.remove("blur");
			myScroll.enable();
		}).off("tap",".calEventCreate").on("tap",".calEventCreate",function(){
			//关闭
			$(".shortcut").classList.add("time-arrange-hide");
			$("#scroller").classList.remove("blur");
			myScroll.enable();
			
			// 新建日程
			saveCalendarOptions();
			var options = {};
			if(cmp.platform.CMPShell){
				options.openWebViewCatch = 1;
			}
			options.currentDate = getCurrentTime();
			document.querySelector(".close").click();
			cmp.href.next(_calendarPath + "/html/newCalEvent.html?cmp_orientation=auto&datetime=" + new Date().getTime(),{portalParam:_parameter},options);
		}).off("tap",".meetingCreate").on("tap",".meetingCreate",function(){
			//关闭
			$(".shortcut").classList.add("time-arrange-hide");
			$("#scroller").classList.remove("blur");
			myScroll.enable();
			
			// 新建会议
			saveCalendarOptions();
			var options = {};
			if(cmp.platform.CMPShell){
				options.openWebViewCatch = 1;
			}
			options.currentDate = getCurrentTime();
			document.querySelector(".close").click();
			cmp.href.next(_meetingPath + "/html/meetingCreate.html?cmp_orientation=auto&r="+new Date().getTime(),{portalParam:_parameter},options);
		}).off("tap",".taskCreate").on("tap",".taskCreate",function(){
			//关闭
			$(".shortcut").classList.add("time-arrange-hide");
			$("#scroller").classList.remove("blur");
			myScroll.enable();
			
			// 新建任务
			saveCalendarOptions();
			document.querySelector(".close").click();
			var params = {
				openWebview : cmp.platform.CMPShell,
				portalParam : _parameter
			}
			var options = new Object();
	    	if(params.openWebview){
	    		options.openWebViewCatch = 1;
	    	}
	    	cmp.href.next(_taskmanagePath + "/html/taskEditor.html",params,options);
		})
	}
	
	//初始化Portal日程类栏目的列表数据穿透
	function bindTimeArrangrListEvent(columnId,_parameter){
		cmp("#arrangeList"+columnId).off("tap",".arrange-item").on("tap",".arrange-item",function(){
			var sid = this.getAttribute("sid");
			var stype = this.getAttribute("stype");
			var summaryId = this.getAttribute("summaryId");
			if(stype != "plan"){//计划没有穿透
				saveCalendarOptions();
			}
			//plan/task/meeting/event/collaboration/edoc
			if(stype == "calendar"){
				// 日程
				var options = {};
				if(cmp.platform.CMPShell){
					options.openWebViewCatch = 1;
				}
				cmp.href.next(_calendarPath + "/html/newCalEvent.html?datetime=" + new Date().getTime(),{id:sid + "",portalParam:_parameter},options);
			}else if(stype == "plan"){
				//计划没有穿透
			}else if(stype == "meeting"){
				if(this.getAttribute("canView") == "true"){
					// 会议
					var options = {};
					if(cmp.platform.CMPShell){
						options.openWebViewCatch = 1;
					}
					cmp.href.next(_meetingPath + "/html/meetingDetail.html?r="+new Date().getTime(), {meetingId:sid + "",openFrom:"timeArrange", portalParam : _parameter},options);
				}
			}else if(stype == "taskManage"){
				// 任务
				var params = {
					taskId : sid,
					openWebview : cmp.platform.CMPShell,
					portalParam : _parameter
				}
				var options = new Object();
		    	if(params.openWebview){
		    		options.openWebViewCatch = 1;
		    	}
		    	cmp.href.next(_taskmanagePath + "/html/taskEditor.html",params,options);
			}
		})
	}




	//======================================================================================//
	// 		过滤参数设置
	//======================================================================================//
	function processRangePoint(retConfig,cacheKey,_parameter,columnId){
		//首页栏目
		if(_parameter){
			//有日程的时候才去标注
			if(_parameter.length != 0){
				timeArrangeCalender[columnId].setOrderD(_parameter); //[ "2017-02-12", "2017-02-14" ], // 哪些天被预定
			}
			return;
		}

		var thisMonthCache = [];
		if(fDataCache[cacheKey] != null){
			thisMonthCache = fDataCache[cacheKey];
		}else{
			var thisMonthData = sDataCache[cacheKey];
			if(!thisMonthData){
				return;
			}
			var mstart = Date.calParseDateTime(retConfig.by+"-"+retConfig.bm+"-" + retConfig.bd + " 00:00:00");
			var mend =   Date.calParseDateTime(retConfig.ey+"-"+retConfig.em+"-" + retConfig.ed + " 23:59:59");
			outerloop:
			for(var v = 0; v < thisMonthData.length; v++){
				var thisdata = thisMonthData[v];
				//公文和协同DeadLineDateTime，算是待办的天
				var datastart = new Date(parseInt(thisdata["beginDate"]));
				var dataend = new Date(parseInt(thisdata["endDate"]));
				if(thisdata.type == "edoc" || thisdata.type == "collaboration"){
					thisMonthCache.push(dataend.calformat("yyyy-MM-dd"));
				}else{
					if(mstart > datastart && mend < dataend){
						//本月全部都是
						var start = new Date(mstart.getTime());
						var end = new Date(mend.getTime());
						while(true){
							thisMonthCache.push(start.calformat("yyyy-MM-dd"));
							if(Date.calequalsDate(start,end)){
								break;
							}
							start = start.addDay(1);
						}
						break outerloop;
					}else if(mstart <= datastart && mend >= dataend){
						//在本月月之间
						var start = new Date(datastart.getTime());
						var end = new Date(dataend.getTime());
						while(true){
							thisMonthCache.push(start.calformat("yyyy-MM-dd"));
							if(Date.calequalsDate(start,end)){
								break;
							}
							start = start.addDay(1);
						}
					}else if(mstart <= datastart && mend <= dataend){
						// 开始在本月，结束在本月后
						var start = new Date(datastart.getTime());
						var end = new Date(mend.getTime());
						while(true){
							thisMonthCache.push(start.calformat("yyyy-MM-dd"));
							if(Date.calequalsDate(start,end)){
								break;
							}
							start = start.addDay(1);
						}
					}else if(mstart >= datastart && mend >= dataend){
						// 开始在本月前，结束在本月
						var start = new Date(mstart.getTime());
						var end = new Date(dataend.getTime());
						while(true){
							thisMonthCache.push(start.calformat("yyyy-MM-dd"));
							if(Date.calequalsDate(start,end)){
								break;
							}
							start = start.addDay(1);
						}
					}
				}
			}
			fDataCache[cacheKey] = thisMonthCache;
		}
		var year = retConfig.y != null ? retConfig.y : retConfig.by;
		var month = retConfig.m != null ? retConfig.m : retConfig.bm;
		var day = retConfig.d != null ? retConfig.d : retConfig.bd;
		timeArrangeCalender['calender'].setOrderD(thisMonthCache); //[ "2017-02-12", "2017-02-14" ], // 哪些天被预定
	}
	function processDayDataList(retConfig,cacheKey,_parameter){

		//首页栏目 retConfig和cacheKey  都是传入的null
		if(!retConfig && !cacheKey){
			if(_parameter){
				if(_parameter.processDayData == null){
					var html = '<div class="column_noData">';
					html+= '<div class="noDataIcon">';
					html+= '<i class="icon iconfont icon-noData"></i>';
					html+= '</div>';
					html+= '<div class="noDataText">' + cmp.i18n("portal.label.no_data") + '</div>';
					html+= '</div>';

					$("#arrangeList"+_parameter.columnId).innerHTML = html;
				}else{
					$("#arrangeList"+_parameter.columnId).innerHTML = cmp.tpl(timeArrangrTpl, _parameter.processDayData);
				}
			}else{
				$("#arrangeList"+_parameter.columnId).innerHTML = cmp.tpl(timeArrangrTpl, _parameter.processDayData);
			}
			return;
		}

		var dayData = [];
		var year = retConfig.y,month = retConfig.m,day = retConfig.d;
		if(year != null && month != null && day != null){
			var dayCache = getFormartDate(year,month,day,"");
			if(fDayDataCache[dayCache] != null){
				dayData = fDayDataCache[dayCache];
			}else{
				var start = Date.calParseDateTime(year+"-"+month+"-"+day+" 00:00:00");
				var end = Date.calParseDateTime(year+"-"+month+"-"+day+" 23:59:59");
				var datas = sDataCache[cacheKey];
				for(var i = 0; i < datas.length ; i++ ){
					var d = datas[i];
					// d.endDate|d.beginDate
					if(  (d.beginDate <= start.getTime() && d.endDate >= start.getTime() ) 
							|| (d.beginDate <= end.getTime() && d.endDate >= end.getTime() ) 
							|| (d.beginDate >= start.getTime() && d.endDate <=end.getTime() ) ){
						dayData.push(d);
					}
				}
				fDayDataCache[dayCache] = dayData;
			}
		}
		if(dayData.length == 0 ){
			var html = '<li class="time-nodata">';
			//html 	+= '	<span class="m3-icon-page-nodata" style="font-size: 46px;color: #b6b6b6;"></span>';
			//html 	+= '	<p class="empty">' + cmp.i18n("calendar.label.noevent") + '</p>';
    		html+= '	<div class="StatusContainer">';
    		html+= '		<div class="nocontent"></div>';  
			html+= '		<span class="text nocontent_text">' + cmp.i18n("calendar.label.noevent") + '</span></div>';
    		html+= '	</div>';
			html 	+= '</li>';
			$(".time-arrange-list").innerHTML = html;
		}else{
			$(".time-arrange-list").innerHTML = cmp.tpl(timeArrangrTpl, dayData);
		}
	} 
	
	//======================================================================================//
	// 		过滤参数设置
	//======================================================================================//
	var calenderFilterKey = "Calender_Filter_Key";
	function getFilterConfig(){
		var calenderFilterConfig = cmp.storage.get(calenderFilterKey);
		if(!calenderFilterConfig){
			calenderFilterConfig = '{"apps":[1,2,3,4],"status":[0,1]}'
		}
		return JSON.parse(calenderFilterConfig);
	}
	function closeFilterConfig(){
		$(".filter_wrap").classList.add("time-arrange-hide");
		$(".mask").classList.add("time-arrange-hide");
		$("#time-arrange-mask").removeEventListener("click",closeFilterConfig);
		cmp.backbutton.pop();
	}
	function initFilterConfig(){
		cmp.dialog.loading();
		$("#time-arrange-mask").addEventListener("click",closeFilterConfig);
		var filter = getFilterConfig();
		var apps = $(".filter_wrap .apps .item",true);
		for(var i = 0; i < apps.length; i++){
			var selected = false;
			var appId = apps[i].getAttribute("appId");
			for(var j = 0; j < filter.apps.length; j++){
				if(filter.apps[j] == appId){
					selected = true;
					break;
				}
			}
			if(selected){
				apps[i].classList.add("active");
			}else{
				apps[i].classList.remove("active");
			}
		}
		var statuss = $(".filter_wrap .status .item",true);
		for(var i = 0; i < statuss.length; i++){
			var ss = statuss[i].getAttribute("status");
			var selected = false;
			for(var j = 0; j < filter.status.length; j++){
				if(filter.status[j] == ss){
					selected = true;
					break;
				}
			}
			if(selected){
				statuss[i].classList.add("active");
			}else{
				statuss[i].classList.remove("active");
			}
		}
		//android 返回
		$(".filter_wrap").classList.remove("time-arrange-hide");
		$(".mask").classList.remove("time-arrange-hide");
		cmp.backbutton();
		cmp.backbutton.push(function(){
			closeFilterConfig();
		});
		
		cmp.dialog.loading(false);
	}
	function saveFilterConfig(){
		cmp.dialog.loading();
		var calenderFilterConfig = {apps:[],status:[]}
		var apps = $(".filter_wrap .apps .item",true);
		for(var i = 0; i < apps.length; i++){
			if(apps[i].classList.contains("active")){
				calenderFilterConfig.apps.push(parseInt(apps[i].getAttribute("appId")));
			}
		}
		var statuss = $(".filter_wrap .status .item",true);
		for(var i = 0; i < statuss.length; i++){
			if(statuss[i].classList.contains("active")){
				calenderFilterConfig.status.push(parseInt(statuss[i].getAttribute("status")));
			}
		}
		// 保存到localStorage
		cmp.storage.save(calenderFilterKey,JSON.stringify(calenderFilterConfig));
		closeFilterConfig();
		
		sDataCache = {};
		fDataCache = {};
		fDayDataCache= {};
		// 重新获取数据
		var cacheKey = getFormartDate(calendarOptions.by,calendarOptions.bm,calendarOptions.bd,"") + "-" + getFormartDate(calendarOptions.ey,calendarOptions.em,calendarOptions.ed,"");
		var startDate = Date.calParseDateTime(calendarOptions.by + "-" + calendarOptions.bm + "-" + calendarOptions.bd + " 00:00:00").getTime();
		var endDate = Date.calParseDateTime(calendarOptions.ey + "-" + calendarOptions.em + "-" + calendarOptions.ed + " 23:59:59").getTime();
		timeArrange.loadData(startDate,endDate,function(data){
			//缓存数据
			sDataCache[cacheKey] = data;
			// 已经存在原始
			processRangePoint(calendarOptions,cacheKey);
			// 显示选中的天的数据
			processDayDataList(calendarOptions,cacheKey);
			cmp.dialog.loading(false);
		});
	}
	function resetFilterConfig(){
		var items = $(".filter_wrap .item", true);
		for (var i = 0; i < items.length; i++) {
			items[i].classList.add("active");
		}
	}
	
	//======================================================================================//
	// 		当前页面的基本信息（选中的日期、日程类型）
	//======================================================================================//
	var calendarOptions = {};
	var calendarOptionsKey = "Calendar_Options_Key";
	function getCalendarOptions(){
		var oldTaskCache = cmp.storage.get(calendarOptionsKey,true);
		cmp.storage.delete(calendarOptionsKey,true);
		if(oldTaskCache){
			return JSON.parse(oldTaskCache);
		}else{
			var today = new Date();
			return {y:today.getFullYear(),m:today.getMonth()+1,d:today.getDate(),type:"week"};
		}
	}
	
	function getCurrentTime(){
		var now = new Date();
		var currentDate = getFormartDate(calendarOptions.y,calendarOptions.m,calendarOptions.d,"/") + " " + getFormartDate(now.getHours(),now.getMinutes(),now.getSeconds(),":");
        return currentDate;
	}
	
	function saveCalendarOptions(){
		cmp.storage.save(calendarOptionsKey,JSON.stringify(calendarOptions),true);
	}
	
	
	
	
	//======================================================================================//
	// 		同步参数设置
	//======================================================================================//
	function closeSyncConfig(){
		$(".synchronous").classList.add("time-arrange-hide");
		$(".mask").classList.add("time-arrange-hide");
		$("#time-arrange-mask").removeEventListener("click",closeSyncConfig);
		cmp.backbutton.pop();
	}
	var loadedSyncJs = false;
	function initSyncConfig(){
		cmp.dialog.loading();
		if(loadedSyncJs){
			doInitSyncConfig();
		}else{
			var jses = [cmpPath + "/js/cmp-schedule.js" + $buildversion,
			            cmpPath + "/js/cmp-connection.js" + $buildversion];
			cmp.asyncLoad.js(jses,function(){
				loadedSyncJs = true;
				doInitSyncConfig();
			});
		}
	}
	function doInitSyncConfig(){
		cmp.schedule.readConfig({
			success:function (data) {
				if(data == null || data == ""){//IOS null/android ""
					syncConfig = {"autoSync":false,"apps":[2,3,4]};//默认勾选任务、会议、日程，默认不自动同步
				}else{
					try{
						syncConfig = JSON.parse(data);
					}catch (e) {
						syncConfig = data;
					}
				}
				//回填数据
				var autoSync = $(".synchronous .cmp-switch").classList.contains("cmp-active") ? true : false;
				if(autoSync != syncConfig.autoSync){
					cmp(".synchronous .cmp-switch").switch().toggle();
				}
				var chboxs = $(".synchronous input",true);
				for(var i = 0 ; i < chboxs.length ; i++ ){
					var checked = false;
					var appId = chboxs[i].getAttribute("appId");
					for(var j =0 ; j < syncConfig.apps.length ; j++ ){
						if(syncConfig.apps[j] == appId){
							checked = true;
							break;
						}
					}
					chboxs[i].checked = checked;
				}
				
				cmp.dialog.loading(false);
				$(".synchronous").classList.remove("time-arrange-hide");
				$(".mask").classList.remove("time-arrange-hide");
				$("#time-arrange-mask").addEventListener("click",closeSyncConfig);
				//android 返回
				cmp.backbutton();
				cmp.backbutton.push(function(){
					closeSyncConfig();
				});
			},
			error:function(){
				cmp.notification.toast(cmp.i18n("calendar.message.syncFail"), "center", notificationTimeout);
				cmp.dialog.loading(false);
			}
		});
	}
	
	function saveSyncConfig(){
		cmp.connection.getNetworkType({
			success:function(networkState){
				if(networkState === "wifi"){
					doSaveSyncConfig(true);
				}else{
					var syncNow = false;
					cmp.notification.confirm(cmp.i18n("calendar.message.comfirmSync"),function(index){
						if(index == 0){
							syncNow = true;
						}
						doSaveSyncConfig(syncNow);
					},cmp.i18n("calendar.label.tips"),[cmp.i18n("calendar.label.yes"),cmp.i18n("calendar.label.no")]);
				}
			}
		});
	}
	function doSaveSyncConfig(syncNow){
		/**
		 * M3接口接收配置参数
		 * {
		 * 		immediateSync:是否立即同步
		 * 		apps：同步数据的模块
		 * 		autoSync：是否自动同步
		 * }
		 */
		var config = {"apps":[],"immediateSync":syncNow};
		cmp.dialog.loading();
		var chboxs = $(".synchronous input",true);
		for(var i = 0 ; i < chboxs.length ; i++ ){
			if(chboxs[i].checked){
				config.apps.push(parseInt(chboxs[i].getAttribute("appId")));
			}
		}
		config.autoSync = $(".synchronous .cmp-switch").classList.contains("cmp-active") ? true : false;
		config.interval = 60 * 5;// 5分钟
		cmp.schedule.writeConfig({
			data:config,
			success:function(data){
				closeSyncConfig();
				if(syncNow){
					cmp.notification.toast(cmp.i18n("calendar.message.syncSuccess"), "center", notificationTimeout);
				}
				cmp.dialog.loading(false);
			},
			error:function(data){
				if(syncNow){
					//58001 日历组件加载错误 （iOS） 
					//58002 无权访问日历
					if(data.code == 58002){
						cmp.notification.toast(cmp.i18n("calendar.message.noPermission.view"), "center", notificationTimeout);
					}else if(data.code == 58001){
						cmp.notification.toast(cmp.i18n("calendar.message.loadingError"), "center", notificationTimeout);
					}else{
						cmp.notification.toast(cmp.i18n("calendar.message.syncError"), "center", notificationTimeout);
					}
				}
				cmp.dialog.loading(false);
			}
		});
	}
	
	/* 设置内容区域的高度 */
	var $scheContent	= $(".sche-content");
	function resizeContent(){
		setTimeout(function(){
			if(isFromTodoList){
				$(".schedule_list").style.height = ($scheContent.offsetHeight - $("#calender").offsetHeight - 50) + "px";
			}else{
				$(".schedule_list").style.height = ($scheContent.offsetHeight - $("#calender").offsetHeight) + "px";
			}
		},0);
    }
	/** 获取2012-01-02 */
	function getFormartDate(year,month,day,split){
		var months = month < 10 ? "0" + month : month + "";
		var days = day < 10 ? "0" + day : day + "";
		return year + split +  months + split + days;
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