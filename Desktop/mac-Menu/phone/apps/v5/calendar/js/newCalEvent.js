/*!
 * @description 事件新增&编辑&查看
 * 
 * @author ouyp
 * @date 2017-02-13
 */
var windowH= window.innerHeight;
;(function(cmp, window, $api, $){
	//============================================================================//
	//                          日程事件（新增&编辑&查看）
	//============================================================================//
	window.calEditor = {
		/**
		 * 当前用户信息
		 */
		CurrentUser: {},
		/**
		 * 持久状事件对象
		 */
		dbCalEvent: {},
		/**
		 * 附件对象
		 */
		attComponent: false,
		/**
		 * 事件新增&修改当前事件&修改当前及以后事件标志位，0：新增，1：当前事件，2：当前及以后事件
		 */
		updateTip: "0",
		/**
		 * 页面初始化入口
		 */
		initEditor: function(params){
			cmp.dialog.loading();
			
			//周期性事件处理
			var periodicEvents = function(options){
				/**××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
				 * 周期性事件进入后会给出一个提示框：
				 * 1. 修改所选事件： 
				 * 	用户只能修改非重复周期以外的所有的字段；
				 * 2. 修改所选事件及后续所有事件
				 * 	用户可以修改所有字段，需要将重复开始日期设置为开始事件
				 * 3. 取消
				 * 	用户进入事件查看状态页面，点击“编辑”按钮给出同样提示框让用户确定“修改方式”
				 * ××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
				 */
				//修改所选事件
				cmp("#updateWrap").on("tap", ".tp1", function(e){
					calEditor.updateTip = "1";
					
					//重置#saveBtn对应的事件
					cmp("#calendar-oper").off("tap", "#saveBtn").on("tap", "#saveBtn", function(e){
						calEditor.saveUpdateCalEvent();
					});
					$("#saveBtn").innerText = cmp.i18n("calendar.label.finish");
					
					if(typeof options.updateCurrent === 'function'){
						options.updateCurrent();
					}
					
					hidenRepeatDialog();
				});
				//修改所选事件及后续所有事件
				cmp("#updateWrap").on("tap", ".tp2", function(e){
					calEditor.updateTip = "2";
					
					//重置#saveBtn对应的事件
					cmp("#calendar-oper").off("tap", "#saveBtn").on("tap", "#saveBtn", function(e){
						calEditor.saveUpdateCalEvent();
					});
					$("#saveBtn").innerText = cmp.i18n("calendar.label.finish");
					
					//如果用户选择的修改所选事件及其之后的事件，重新初始化重复的时间
					$(".repeat-start").innerText = $(".start-date").innerText.substr(0, 10);
					
					if(typeof options.updateAll === 'function'){
						options.updateAll();
					}
					
					hidenRepeatDialog();
				});
				//取消
				cmp("#updateWrap").on("tap", ".cancel", function(e){
					$("#saveBtn").innerText = cmp.i18n("calendar.label.edit");
					cmp("#calendar-oper").off("tap", "#saveBtn").on("tap", "#saveBtn", function(e){
						showRepeatDialog();
					});
					/**
					 * 事件查看状态tap标题上可以查看标题全文
					 */
					var $subject = $("#subject"), $subjectDiv = $("#subjectDiv");
					$subject.parentElement.addEventListener("tap", function(){
						if ($subjectDiv.style.visibility == "visible") {
							$subjectDiv.style.visibility = "hidden";
							$subjectDiv.setAttribute('class','');
							$subject.style.height = $subjectDiv.offsetHeight + 'px';
							$subject.setAttribute("disabled", "disabled");
							$subject.style.display = "block";
			            }
					});
					
					if(typeof options.cancel === 'function'){
						options.cancel();
					}
					
					hidenRepeatDialog();
				});
				
				showRepeatDialog();
				
				/**
				 * 弹出周期事件对话框
				 */
				function showRepeatDialog() {
					$(".mask").classList.remove("hidden");
					$(".alert_wrap").classList.remove("hidden");
				}
				/**
				 * 隐藏周期事件对话框
				 */
				function hidenRepeatDialog() {
					$(".mask").classList.add("hidden");
					$(".alert_wrap").classList.add("hidden");
				}
			}
			
			/**
			 * 初始化页面头部
			 */
			/*$("#page_content").style.height = (window.innerHeight - $("#page_header").clientHeight) + "px";*/
			if(params.id){//事件详情
				//$("#editEventTitle").classList.remove("hidden");
				document.title = cmp.i18n("calendar.label.eventdetail");
			}else{//新建事件
				//$("#newEventTitle").classList.remove("hidden");
				document.title = cmp.i18n("calendar.label.neweventsa");
			}
			//返回键
			cmp.backbutton();
			cmp.backbutton.push(cmp.href.back);
			//////////////////////////////////核心部分/////////////////////////////////////////////////
			if (params.id) {
				//--------------------------------------------------------------------------------//
				// 事件编辑&安排编辑&委托编辑&查看
				//--------------------------------------------------------------------------------//
				var newCalCache = sessionStorage.getItem(newCalCacheKey);
				sessionStorage.removeItem(newCalCacheKey);
				var editCalCache = sessionStorage.getItem(editCalCacheKey);
				sessionStorage.removeItem(editCalCacheKey);
				
				if (newCalCache && editCalCache) {//点击附件上传后返回
					var pageCal = JSON.parse(newCalCache);
					calEditor.updateTip = pageCal.updateTip;
					calEditor.dbCalEvent = JSON.parse(editCalCache);
					
					cmp("#calendar-oper").on("tap", "#saveBtn", function(e){
						calEditor.saveUpdateCalEvent();
					});
					
					/**
					 * 回填内容
					 */
					calEditor.fillform(pageCal);
					
					if (calEditor.updateTip == "1") {//编辑当前事件
						calEditor.bindBasictEvent();
						calEditor.bindRemindEvent(true);
						calEditor.bindStateEvent();
						calEditor.bindAttachmentEvent(pageCal.attachments, 1);
						calEditor.bindOtherMemberEvent();
						
						//不可改变周期性
						var forwards = document.querySelectorAll(".repeat .cmp-list .cmp-icon-forward");
						for (var int = 0; int < forwards.length; int++) {
							forwards[int].classList.add("hidden");
						}
					} else if (calEditor.updateTip == "2") {//编辑当前事件其以后事件
						calEditor.bindAllEditEvent(pageCal.attachments, 1 ,false);
					} else { //取消 | 普通事件
						if (calEditor.dbCalEvent.periodicalStyle != "0") {
							calEditor.bindRemindEvent(false);
							calEditor.bindAttachmentEvent(ret.attachments, 2);
						}else{
							calEditor.bindAllEditEvent(pageCal.attachments, 1,false);
						}
						//不可改变周期性
						var forwards = document.querySelectorAll(".repeat .cmp-list .cmp-icon-forward");
						for (var int = 0; int < forwards.length; int++) {
							forwards[int].classList.add("hidden");
						}
					}
					/**
					 * 事件删除
					 */
					calEditor.removeCalEvent();
					
					cmp.dialog.loading(false);
				} else {//点事件第一次进入
					$api.Event.getCalEventDetailById(params.id, {}, {
						repeat: true,
						success: function(ret) {
							calEditor.dbCalEvent = ret;
							/**
							 * 绑定“完成”按钮默认事件
							 */
							cmp("#calendar-oper").on("tap", "#saveBtn", function(e) {
								calEditor.saveUpdateCalEvent();
							});
							
							calEditor.fillform(ret); //回填内容
							
							if (ret.eventAuth == 1) {//[全编辑模式]
								if (ret.periodicalStyle != "0") {
									periodicEvents({
										updateCurrent : function(){
											calEditor.bindBasictEvent();
											calEditor.bindRemindEvent(true);
											calEditor.bindStateEvent();
											calEditor.bindAttachmentEvent(ret.attachments, 1);
											calEditor.bindOtherMemberEvent();
											
											//不可改变周期性
											var forwards = document.querySelectorAll(".repeat .cmp-list .cmp-icon-forward");
											for (var int = 0; int < forwards.length; int++) {
												forwards[int].classList.add("hidden");
											}
										},
										updateAll : function(){
											calEditor.bindAllEditEvent(ret.attachments, 1);
										},
										cancel : function(){
											calEditor.bindRemindEvent(false);
											calEditor.bindAttachmentEvent(ret.attachments, 2);
											
											//不可改变周期性
											var forwards = document.querySelectorAll(".repeat .cmp-list .cmp-icon-forward");
											for (var int = 0; int < forwards.length; int++) {
												forwards[int].classList.add("hidden");
											}
										}
									});
								} else {//非周期性事件
									calEditor.bindAllEditEvent(ret.attachments, 1,false);
									
									//不可改变周期性
									var forwards = document.querySelectorAll(".repeat .cmp-list .cmp-icon-forward");
									for (var int = 0; int < forwards.length; int++) {
										forwards[int].classList.add("hidden");
									}
									
								}
								/**
								 * 事件删除
								 */
								calEditor.removeCalEvent();
							} else if (ret.eventAuth == 2) {//[安排&委托编辑模式]
								if(ret.periodicalStyle != "0"){
									periodicEvents({
										updateCurrent : function(){
											calEditor.bindStateEvent();
											calEditor.bindRemindEvent(true);
											calEditor.bindAttachmentEvent(ret.attachments, 2);
										},
										updateAll : function(){
											calEditor.bindStateEvent();
											calEditor.bindRemindEvent(true);
											calEditor.bindAttachmentEvent(ret.attachments, 2);
										},
										cancel : function(){
											calEditor.bindRemindEvent(false);
											calEditor.bindAttachmentEvent(ret.attachments, 2);
										}
									});
								}else{
									calEditor.bindStateEvent();
									calEditor.bindRemindEvent(true);
									calEditor.bindAttachmentEvent(ret.attachments, 2);
								}
							} else {//共享给当前用户的方式：只能查看
								$("#saveBtn").classList.add("hidden");
								calEditor.bindRemindEvent(false);
								calEditor.bindAttachmentEvent(ret.attachments, 2);
							}
							cmp.dialog.loading(false);
						},
						error: function(err) {
							cmp.dialog.loading(false);
							console.info(err);
							if (cmp.errorHandler(err)) {
								//CMP平台处理
							} else {
								var msg = cmp.i18n("calendar.label.notfind");
								if(typeof err != "undefined"){
									if (typeof err.message != "undefined") {
										msg = err.message;
									} else if(typeof err.responseText != "undefined") {
										try{
											msg = JSON.parse(err.responseText).message;
										}catch(e){}
									}
								}
								cmp.notification.toast(msg, "center", notificationTimeout);
							}
							setTimeout(function(){cmp.href.back();}, notificationTimeout2);
						}
					});
				}
			} else {
				//--------------------------------------------------------------------------------//
				// 事件新增
				//--------------------------------------------------------------------------------//
				cmp("#calendar-oper").on("tap", "#saveBtn", function(e){
					calEditor.saveCreateNewCal();
				});
				
				var newCalCache = sessionStorage.getItem(newCalCacheKey);
				sessionStorage.removeItem(newCalCacheKey);
				if (newCalCache) {//点击附件上传后返回
					var newCalEvent = JSON.parse(newCalCache);
					calEditor.CurrentUser = newCalEvent.CurrentUser;
					calEditor.fillform(newCalEvent);
				} else {
					/**
					 * 第一次进入初始化默认的开始时间&结束时间
					 */
					var currentDate = params.currentDate;
					if(currentDate != null && currentDate != undefined && currentDate != ''){
						var time  = new Date(currentDate);
						now = time;
					}
					var m = now.getMinutes(), start = 15 * Math.ceil(m/15);
					var startDate = now.addMinus((start - m));
					var endDate = startDate.addHour(1);
					
					// ---小智进入默认回填数据
					if(typeof params.from != "undefined" && "xiaozhiSpeechInput" == params.from){
						if(typeof params.subject != "undefined"){
							var $subjectDiv = $("#subjectDiv"), $subject = $("#subject");
							$subjectDiv.innerText = params.subject;
							$subject.value = params.subject;
							$subject.style.display = "none";
						}
						
						if(typeof params.content != "undefined"){
							var $content = $("#content");
							$content.value = params.content;
						}
						if(typeof params.beginDate != "undefined"){
							startDate = new Date(parseInt(params.beginDate));
						}
						if(typeof params.endDate != "undefined"){
							endDate = new Date(parseInt(params.endDate));
						}
						if( (typeof params.beforendAlarm != "undefined" && params.alarmDate > 0)
								|| (typeof params.alarmDate != "undefined" && params.alarmDate > 0) ){
							$(".remind-type-box .cmp-switch").classList.add("cmp-active");
							$(".remind-start-time-box").classList.remove("hidden");
							$(".remind-end-time-box").classList.remove("hidden");
						}
						if(typeof params.alarmDate != "undefined" && params.alarmDate > 0){
							setValue($(".remind-start-time"), params.alarmDate, cmp.i18n(remindTimeMapper[params.alarmDate]));
						}
						if(typeof params.beforendAlarm != "undefined" && params.alarmDate > 0){
							setValue($(".remind-end-time"), params.beforendAlarm, cmp.i18n(remindTimeMapper[params.beforendAlarm]));
						}
					}
					
					
					$(".start-date").innerText = startDate.dateTimeStr();
			    	$(".end-date").innerText = endDate.dateTimeStr();
			    	/**
			    	 * 获取当前用户信息
			    	 */
			    	$api.Event.getCurrentUser({}, {}, {
			    		repeat: true,
			    		success: function(ret){
			    			calEditor.CurrentUser = ret;
			    		},
			    		error: function(err){
			    			console.info(err);
			    		}
			    	});
				}
				
				/**
				 * 全编辑模式下事件绑定
				 */
				calEditor.bindAllEditEvent([], 0);
				
				cmp.dialog.loading(false);
			}
			///////////////////////////////////////////////////////////////////////////////////////
			
			/**
			 * 高级设置&收起
			 */
			$(".show_more").addEventListener("tap",function(e){
				var children = this.children, t0 = children[0], t1 = children[1];
				if (t1.classList.contains("see-icon-v5-common-pull-arrow-down")) {
					$("#advanced-options").classList.remove("hidden");
					t1.classList.remove("see-icon-v5-common-pull-arrow-down");
					t1.classList.add("see-icon-v5-common-pull-arrow-top");
					t0.innerText = cmp.i18n("calendar.label.fold");
					document.getElementById("end").scrollIntoView();
				} else {
					$("#advanced-options").classList.add("hidden");
					t1.classList.remove("see-icon-v5-common-pull-arrow-top");
					t1.classList.add("see-icon-v5-common-pull-arrow-down");
					t0.innerText = cmp.i18n("calendar.label.advancedsetting");
				}
			});
		},
		/**
		 * 绑定全编辑事件
		 * @param attachments 附件JSON对象
		 * @param type 0：表示新增, 1:表示编辑
		 */
		bindAllEditEvent: function(attachments, type,repeatEvent) {
			/**
			 * 标题&开始时间&结束时间&事件内容
			 */
			calEditor.bindBasictEvent();
			/**
			 * 提醒&开始前提醒&结束前提醒
			 */
			calEditor.bindRemindEvent(true);
			/**
			 * 重复周期&重复选项&重复开始日期&重复结束日期
			 */
			if(repeatEvent == undefined || repeatEvent){
				calEditor.bindRepeatEvent();
			}
			/**
			 * 事件完成状态
			 */
			calEditor.bindStateEvent();
			/**
			 * 本地&关联文档
			 */
			calEditor.bindAttachmentEvent(attachments, type);
			/**
			 * 公开给他人
			 */
			calEditor.bindOtherMemberEvent();
		},
		
		/**
		 * 数据回填
		 */
		fillform: function(params) {
			/**
			 * 标题
			 */
			var $subjectDiv = $("#subjectDiv"), $subject = $("#subject");
			if (params.subject) {
				$subjectDiv.innerText = params.subject;
				$subject.value = params.subject;
				$subject.style.display = "none";
			}
			/**
			 * 开始时间&结束时间
			 */
			$(".start-date").innerText = params.beginDate;
			$(".end-date").innerText = params.endDate;
			/**
			 * 事件内容
			 */
			$("#content").innerText = params.content;
			/**
			 * 提醒&开始前提醒&结束前提醒
			 */
			if (params.alarmFlag) {
				$(".remind-type-box .cmp-switch").classList.add("cmp-active");
				setValue($(".remind-start-time"), params.alarmDate, params.alarmDateName);
				setValue($(".remind-end-time"), params.beforendAlarm, params.beforendAlarmName);
				$(".remind-start-time-box").classList.remove("hidden");
				$(".remind-end-time-box").classList.remove("hidden");
			}
			/**
			 * 重复周期&重复选项&重复开始日期&重复结束日期
			 */
			if (params.periodicalStyle != "0") {//周期不为“无”
				var value, text;
				if (params.periodicalStyle == "1") {//按天
					value = params.dayDate;
					text = cmp.i18n("calendar.label.every") + params.dayDate + cmp.i18n("calendar.label.day");
				} else if (params.periodicalStyle == "2") {//按周
					value = params.weeks;
					var weeks = value.split(",");
					if (weeks.length == 7) {
						text = cmp.i18n("calendar.label.all");
					} else {
						text = weeks.map(function(w){
							return getWeekDay(w);
						}).join(",");
					}
				} else if (params.periodicalStyle == "3") {//按月
					if (params.swithMonth == "1") {
						value = params.swithMonth + "," + params.dayDate;
						text = cmp.i18n("calendar.label.everymonthd") + cmp.i18n("calendar.label.num") + params.dayDate + cmp.i18n("calendar.label.day");
					} else {
						value = params.swithMonth + "," + params.week + "," + params.dayWeek;
						text = cmp.i18n("calendar.label.everymonthd") + getN2Label(params.week) + getWeekDay(params.dayWeek);
					}
				} else if (params.periodicalStyle == "4") {//按年
					var value, text;
					if (params.swithYear == 1) {
						value = params.swithYear + "," + params.month + "," + params.dayDate;
						text = cmp.i18n("calendar.label.everyyear") + params.month + cmp.i18n("calendar.label.month") + params.dayDate + cmp.i18n("calendar.label.day");
					} else {
						value = params.swithYear + "," + params.month + "," + params.week + "," + params.dayWeek;
						text = cmp.i18n("calendar.label.everyyear") + params.month + cmp.i18n("calendar.label.monthd") + getN2Label(params.week) + getWeekDay(params.dayWeek);
					}
				}
				setValue($(".repeat-option"), value, text);
				$(".repeat-start").innerText = params.beginTime;
				$(".repeat-end").innerText = params.endTime;
				$(".repeat-option-box").classList.remove("hidden");
				$(".repeat-start-box").classList.remove("hidden");
				$(".repeat-end-box").classList.remove("hidden");
			}
			setValue($(".repeat-type"), params.periodicalStyle, params.periodicalStyleName);
			/**
			 * 事件完成状态
			 */
			setValue($(".event-state"), params.states, params.statesName);
			/**
			 * 公开给他人
			 */
			if (params.shareType == 4) {//公开给他人
				setValue($(".other-member"), params.tranMemberIds, params.tranMemberNames);
			}
			/**
			 * 收起&高级设置
			 */
			if (params.showMore) {//高级设置
				var $upDown = $("#up_down");
				document.getElementById("advanced-options").classList.remove("hidden");
				$upDown.classList.add("see-icon-v5-common-pull-arrow-top");
				$upDown.classList.remove("see-icon-v5-common-pull-arrow-down");
				document.getElementById("show_toggle").innerText = cmp.i18n("calendar.label.fold");
				document.getElementById("end").scrollIntoView();
			}
		},
		/**
		 * 标题&开始时间&结束时间&事件内容
		 */
		bindBasictEvent: function() {
			/**
			 * 标题: 标题不能超过50字
			 */
			var $subject = $("#subject"), $subjectDiv = $("#subjectDiv");
			$subject.removeAttribute("disabled");
			$subject.addEventListener("input", function(){
				var num = this.value.length;
				if(num > 50){
					this.value = this.value.substr(0, 50);
					cmp.notification.toast(cmp.i18n("calendar.tip.nomore50"), "center");
				}
				$subjectDiv.textContent = $subject.value;
				$subject.style.height = $subjectDiv.offsetHeight + 'px';
			});
			$subject.parentElement.addEventListener("tap", function(){
				if ($subjectDiv.style.visibility == "visible") {
					$subjectDiv.style.visibility = "hidden";
					$subjectDiv.setAttribute('class','');
					$subject.style.height = $subjectDiv.offsetHeight + 'px';
					$subject.style.display = "block";
					$subjectDiv.style.width = $subject.parentNode.offsetWidth + "px";
	            }
			});
			$subject.addEventListener("blur", function(){
				$subjectDiv.style.visibility = "visible";
				$subjectDiv.setAttribute('class','eclips');
				$subject.style.display = "none";
			});
			/**
			 * 开始时间&结束时间
			 */
			cmp(".start-date-box").on("tap", ".right", function(e){
				var $endDate = $(".end-date"), $startDate = this.children[0];
		    	
		    	var picker = new cmp.DtPicker({
					value: $startDate.innerText,
					type: 'datetime'
				});
		    	picker.show(function(rs){
		    		var s = Date.parseDateTime(rs.value), e = Date.parseDateTime($endDate.innerText);
		    		if (s >= e) {//开始时间>=结束时间时候，结束时间=开始时间+1小时
		    			$endDate.innerText = s.addHour(1).dateTimeStr();
		    		}
		    		$startDate.innerText = rs.value;
					picker.dispose();
				}); 
		    });
			cmp(".end-date-box").on("tap", ".right", function(e){
				var $startDate = $(".start-date"), $endDate = this.children[0];
		    	
		    	var picker = new cmp.DtPicker({
					value: $endDate.innerText,
					type: 'datetime'
				});
		    	picker.show(function(rs){
		    		var s = Date.parseDateTime($startDate.innerText), e = Date.parseDateTime(rs.value);
		    		if (s >= e) {//开始时间<=结束时间时候，结束时间=开始时间+1小时
		    			$startDate.innerText = e.addHour(-1).dateTimeStr();
		    		}
		    		$endDate.innerText = rs.value;
					picker.dispose();
				}); 
		    });
			/**
			 * 事件内容
			 */
			var $content = $("#content");
			$content.removeAttribute("disabled");
			$content.addEventListener("input", function(e){
				if (this.value.length > 300) {
					this.value = this.value.substr(0, 300);
					cmp.notification.toast(cmp.i18n("calendar.tip.nomore300"), "center");
				}
			});
		},
		/**
		 * 提醒&开始前提醒&结束前提醒事件绑定
		 */
		bindRemindEvent: function(isEdit) {
			if (!isEdit) {//查看状态
				cmp(".remind-type-box .cmp-switch")[0].classList.add("cmp-disabled");
				return;
			}
			
			cmp(".remind-type-box .cmp-switch")[0].classList.remove("cmp-disabled");
			cmp(".remind-type-box").on('toggle', ".cmp-switch", function(e) {
				if (this.classList.contains("cmp-active")) {
					$(".remind-start-time-box").classList.remove("hidden");
					$(".remind-end-time-box").classList.remove("hidden");
				} else {
					$(".remind-start-time-box").classList.add("hidden");
					$(".remind-end-time-box").classList.add("hidden");
				}
			});
			cmp(".remind-start-time-box").on("tap", ".right", function(e){
				remindDialog(this.children[0]);
			});
			cmp(".remind-end-time-box").on("tap", ".right", function(e){
				remindDialog(this.children[0]);
			});
			/**
			 * 开始前提醒&结束前提醒对话框
			 */
			function remindDialog(dom){
				var picker = new cmp.PopPicker();
				picker.setData((function(){
					var map = [];
					for ( var mkey in remindTimeMapper) {
						map.push({
							value:mkey,
							text:cmp.i18n(remindTimeMapper[mkey])
						});
					}
					return map;
				})());
				picker.defaultValue = getValue(dom);
				picker.setPickerDefalutValue();
				picker.show(function(items){
					var i = items[0];
					setValue(dom, i.value, i.text);
				});
			}
		},
		/**
		 * 重复周期&重复选项&重复开始日期&重复结束日期
		 */
		bindRepeatEvent: function() {
			/**
			 * 重复周期&重复选项&重复开始日期&重复结束日期
			 */
			cmp(".repeat-type-box").on("tap",".right", function(e){
				var $type = this.children[0];
				/**
				 * 如果是跨日事件时，不可选“按天”和“按周”
				 */
				var startDate = $(".start-date").innerText, endDate = $(".end-date").innerText;
				var sd = startDate.substr(8, 2), ed = endDate.substr(8, 2);
				
				var array = [];
				if (typeof calEditor.dbCalEvent.id == "undefined" ||  calEditor.dbCalEvent.periodicalStyle == "0") {
					array.push({value: '0', text: cmp.i18n("calendar.label.none")});
				}
				if (sd == ed) {
					array.push({value: '1', text: cmp.i18n("calendar.label.byday")});
					array.push({value: '2', text: cmp.i18n("calendar.label.byweek")});
				}
				array.push({value: '3', text: cmp.i18n("calendar.label.bymonth")});
				array.push({value: '4', text: cmp.i18n("calendar.label.byyear")});
				
				var picker = new cmp.PopPicker();
				picker.setData(array);
				picker.defaultValue = getValue($type);
				picker.setPickerDefalutValue();
				picker.show(function(items){
					var item = items[0];
					if (item.value == '0') {//无
						/**
						 * 清空重复开始日期&结束日期
						 */
						$(".repeat-start").innerText = "";
						$(".repeat-end").innerText = "";
						
						$(".repeat-option-box").classList.add("hidden");
						$(".repeat-start-box").classList.add("hidden");
						$(".repeat-end-box").classList.add("hidden");
					} else {
						var value = item.value, $option = $(".repeat-option");
						if (value != picker.defaultValue) {
							var val, txt;
							if (value == '1') {//按天
								val = "1";
								txt = cmp.i18n("calendar.label.everyday");
							} else if (value == '2') {//按星期
								var day = (now.getDay() + 1);
								val = day;
								txt = getWeekDay(val);
							} else if (value == '3') {//按月
								var date = now.getDate();
								val = '1,' + now.getDate();
								txt = cmp.i18n("calendar.label.everymonthd") + cmp.i18n("calendar.label.num") + date + cmp.i18n("calendar.label.day");
							} else if (value == '4') {//按年
								var month = (now.getMonth() + 1), date = now.getDate();
								val = "1," + month + "," + date;
								txt = cmp.i18n("calendar.label.everyyear") + month + cmp.i18n("calendar.label.month") + date + cmp.i18n("calendar.label.day");
							}
							setValue($option, val, txt);
						}
						if (getValue($type) == "0") {//上一次是“无”
							$(".repeat-start").innerText = startDate.substr(0, 10);
							$(".repeat-end").innerText = endDate.substr(0, 10);
						}
						$(".repeat-option-box").classList.remove("hidden");
						$(".repeat-start-box").classList.remove("hidden");
						$(".repeat-end-box").classList.remove("hidden");
					}
					setValue($type, item.value, item.text);
				});
			});
			cmp(".repeat-option-box").on("tap", ".right", function(e){
				/**
				 * 不同的周期类型弹出的窗口都不一样
				 */
				var repeatType = getValue($(".repeat-type")), $repeatOption = this.children[0], dv = getValue($repeatOption);
				if (repeatType == "1") {//按天
					/**
					 * 此处的customData为模拟出效果采用了日期选择组件
					 * 具体参考：http://open.seeyon.com/seeyon/cmp2.0/demo/demo/pagings/ui/cmp-dtpicker.html
					 */
					var picker = new cmp.DtPicker({
						type: 'datetime',
						customData: {
							y: [],
							m: [{value: '02', text: cmp.i18n("calendar.label.every")}],
							d: (function(){
								var a = [];
								for(var i = 1; i <= 31; i++) {
									a.push({text: i, value: i});
								}
								return a;
							})(),
							h: [{value: '', text: cmp.i18n("calendar.label.dayremind")}],
							i: []
						},
						value: '2017-02-' + dv
					});
					picker.show(function(items){
						var value = items.d.value, text = cmp.i18n("calendar.label.every") + value + cmp.i18n("calendar.label.day");
						setValue($repeatOption, value, text);
					});
				} else if (repeatType == "2") {//按周
					var $weekchoice = $(".weekchoice"), $items = $weekchoice.querySelectorAll(".see-icon-succeed");
					dv.split(",").forEach(function(idx){
						$items[idx - 1].classList.remove("hidden");
					});
					//兼容andriod返回键
					cmp.backbutton();
					cmp.backbutton.push(function(){
						$weekchoice.classList.add("hidden");
						cmp.backbutton.pop();
					});
					document.title = cmp.i18n("calendar.tip.cycleoptions");//周期选项
					$weekchoice.classList.remove("hidden");
				} else if (repeatType == "3") {//按月
					var picker = new cmp.PopPicker();
					picker.setData((function(){
						var a = [];
						//每月第16日提醒
						a.push({
							value: "1," + now.getDate(),
							text: cmp.i18n("calendar.label.everymonthd") + cmp.i18n("calendar.label.num") + now.getDate() + cmp.i18n("calendar.label.dayremind")
						});
						//每月第三个星期四提醒
						var weekOfMonth = now.getWeekOfMonth(), day = now.getDay() + 1;
						a.push({
							value: "2," + weekOfMonth + "," + day,
							text: cmp.i18n("calendar.label.everymonthd") + getN2Label(weekOfMonth) + cmp.i18n("calendar.label.number") + getWeekDay(day) + cmp.i18n("calendar.label.remind") //每月第三个星期四提醒
						});
						return a;
					})());
					picker.defaultValue = dv;
					picker.setPickerDefalutValue();
					picker.show(function(items){
						var value = items[0].value, configs = value.split(",");
						var text;
						if (configs[0] == "1") {
							text = cmp.i18n("calendar.label.everymonthd") + cmp.i18n("calendar.label.num") + configs[1] + cmp.i18n("calendar.label.day");
						} else {
							text = cmp.i18n("calendar.label.everymonthd") + getN2Label(configs[1]) + cmp.i18n("calendar.label.number") + getWeekDay(configs[2]);
						}
						setValue($repeatOption, value, text);
					});
				} else if (repeatType == "4") {//按年
					var picker = new cmp.PopPicker();
					picker.setData((function(){
						var a = [], m = now.getMonth() + 1, d = now.getDate();
						//每年2月16日提醒
						a.push({
							value: "1," + m + "," + d,
							text: cmp.i18n("calendar.label.everyyear") + m + cmp.i18n("calendar.label.monthd") + now.getDate() + cmp.i18n("calendar.label.dayremind")
						});
						//每年2月第三个星期四提醒
						var weekOfMonth = now.getWeekOfMonth(), day = now.getDay() + 1;
						a.push({
							value: "2," + m + "," + weekOfMonth + "," + day,
							text: cmp.i18n("calendar.label.everyyear") + m + cmp.i18n("calendar.label.monthd") + getN2Label(weekOfMonth) + getWeekDay(day) + cmp.i18n("calendar.label.remind") //每月第三个星期四提醒
						});
						return a;
					})());
					picker.defaultValue = dv;
					picker.setPickerDefalutValue();
					picker.show(function(items){
						var value = items[0].value, configs = value.split(",");
						var text;
						if (configs[0] == "1") {
							text = cmp.i18n("calendar.label.everyyear") + configs[1] + cmp.i18n("calendar.label.monthd") + configs[2] + cmp.i18n("calendar.label.day");
						} else {
							text = cmp.i18n("calendar.label.everyyear") + configs[1] + cmp.i18n("calendar.label.monthd") + getN2Label(configs[2]) + getWeekDay(configs[3]);
						}
						setValue($repeatOption, value, text);
					});
				}
			});
			//每周“周期选项”
			cmp(".weekchoice").on("tap", "#goBackBtn", function(){//返回
				document.title = cmp.i18n("calendar.label.newevent");//标题重建为新建日程
				$(".weekchoice").classList.add("hidden");
			}).on("tap", "#week-right-btn", function(){
				var $items = $(".weekchoice").querySelectorAll(".see-icon-succeed");
				var value = [], text = [];
				[].forEach.call($items, function($dom){
					if (!$dom.classList.contains("hidden")) {
						var v = getValue($dom);
						value.push(v);
						text.push(getWeekDay(v));
					}
				});
				if (value.length == 0) {
					cmp.notification.toast(cmp.i18n("calendar.tip.oneday"), "center", notificationTimeout, 1);
				} else {
					if (value.length == 7) {//全部
						setValue($(".repeat-option"), value.join(","), cmp.i18n("calendar.label.all"));
					} else {
						setValue($(".repeat-option"), value.join(","), text.join(","));
					}
					$(".weekchoice").classList.add("hidden");
				}
			}).on("tap", "li", function(){
				var $item = this.children[1];
				if ($item.classList.contains("hidden")) {
					$item.classList.remove("hidden");
				} else {
					$item.classList.add("hidden");
				}
			});
			cmp(".repeat-start-box").on("tap", ".right", function(e) {
				var $dom = this.children[0];
				var pick = new cmp.DtPicker({
					value: $dom.innerText,
					type: 'date'
				});
				pick.show(function(rs){
					var $repeatEnd = $(".repeat-end"), nv = rs.value;
					if (Date.parseDate(nv) > Date.parseDate($repeatEnd.innerText)) {
						$repeatEnd.innerText = nv;
					}
					$dom.innerText = rs.value;
					pick.dispose();
				});
			});
			cmp(".repeat-end-box").on("tap", ".right", function(e) {
				var $dom = this.children[0];
				var pick = new cmp.DtPicker({
					value: $dom.innerText,
					type: 'date'
				});
				pick.show(function(rs){
					var $repeatStart = $(".repeat-start"), nv = rs.value;
					if (Date.parseDate(nv) < Date.parseDate($repeatStart.innerText)) {
						$repeatStart.innerText = nv;
					}
					$dom.innerText = nv;
					pick.dispose();
				});
			});
		},
		/**
		 * 事件状态
		 */
		bindStateEvent: function(e) {
			cmp(".event-state-box").on("tap", ".right", function(e) {
				var $state = this.children[0];
				var picker = new cmp.PopPicker();
				picker.setData([
							    {value: '1', text: cmp.i18n("calendar.label.tobearranged")},
						        {value: '2', text: cmp.i18n("calendar.label.hasbeenarranged")},
						        {value: '3', text: cmp.i18n("calendar.label.processing")},
						        {value: '4', text: cmp.i18n("calendar.label.finished")}
			    ]);
				picker.defaultValue = getValue($state);
				picker.setPickerDefalutValue();
				picker.show(function(items){
					var i = items[0];
					setValue($state, i.value, i.text);
				});
			});
		},
		/**
		 * 附件&关联文档
		 * @params attachments 附件列表
		 * @params type 0:新增; 1:编辑：2:查看
		 */
		bindAttachmentEvent: function(attachments, type) {
			/**
			 * 附件上传操作只有在CMP壳中才可以,其他壳只能查看
			 */
			if (type == 2) {
				document.getElementsByClassName("attach-box")[0].classList.remove("hidden");
			} else {
				//微协同支持上传附件了
				document.getElementsByClassName("attach-box")[0].classList.remove("hidden");
			}
			var csses = [_cmpPath+ "/css/cmp-att.css"  + $buildversion,
			             _cmpPath + "/css/cmp-audio.css"  + $buildversion];
			var jses = [_cmpPath + "/js/cmp-att.js" + $buildversion, 
			            _cmpPath + "/js/cmp-audio.js" + $buildversion, 
			            _commonsPath + "/widget/SeeyonAttachment.s3js" + $buildversion];
			cmp.asyncLoad.css(csses);
			cmp.asyncLoad.js(jses, function(){
				if (type == 0 || type == 1) {//新增&编辑
					calEditor.attComponent = new SeeyonAttachment({
						initParam : {
							uploadId : "calEditorId",
							continueUpload: true,
							handler : "#uploadAtt",
							initAttData: attachments,
							selectFunc : function(attachments){
								var attachmentSize = attachments.length;
								var attSize = 0,accdocSize = 0;
								for(var i = 0; i < attachmentSize; i++){
									var type = attachments[i].attachment_type;
									if(type == 0){
										attSize++;
									}else{
										accdocSize++;
									}
								}
								$(".attach").innerText = attSize;
								$(".documents").innerText = accdocSize;
							}
						}
					});
					var $uploadAtt = $("#uploadAtt");
					$uploadAtt.classList.remove("hidden");
					$uploadAtt.classList.remove("cmp-icon");
					$uploadAtt.classList.remove("cmp-icon-arrowdown");
					$uploadAtt.classList.remove("cmp-icon-arrowup");
					$uploadAtt.classList.add("m3-icon-attachment");
					$("#calEditorId").classList.add("hidden");
					
					//点击上传附件，将任务的信息放在缓存
					document.addEventListener("beforepageredirect",function(){
						var calEventCache = {};
						calEventCache.subject = $("#subject").value;
						calEventCache.beginDate = $(".start-date").innerText;
						calEventCache.endDate = $(".end-date").innerText;
						calEventCache.content = $("#content").value;
						calEventCache.alarmFlag = $(".remind-type-box .cmp-switch").classList.contains("cmp-active");
						if (calEventCache.alarmFlag) {
							var $remindStartTime = $(".remind-start-time"), $remindEndTime = $(".remind-end-time");
							calEventCache.alarmDate = getValue($remindStartTime);
							calEventCache.alarmDateName = $remindStartTime.innerText;
							calEventCache.beforendAlarm = getValue($remindEndTime);
							calEventCache.beforendAlarmName = $remindEndTime.innerText;
						}
						//重复周期&重复选项&重复开始日期&重复结束日期
						var $repeatType = $(".repeat-type");
						calEventCache.periodicalStyle = getValue($repeatType);
						calEventCache.periodicalStyleName = $repeatType.innerText;
						if (calEventCache.periodicalStyle != 0) {//周期性事件
							var ro = getValue($(".repeat-option")), pt = calEventCache.periodicalStyle;
							if (pt == "1") {//按天
								calEventCache.dayDate = ro;
							} else if (pt == "2") {//按周
								calEventCache.weeks = ro;
							} else if (pt == "3") {//按月
								var a = ro.split(",");
								if (a[0] == "1") {
									calEventCache.dayDate = a[1];
								} else {
									calEventCache.week = a[1];
									calEventCache.dayWeek = [2];
								}
								calEventCache.swithMonth = a[0];
							} else if (pt == "4") {//按年
								var a = ro.split(",");
								if (a[0] == "1") {
									calEventCache.dayDate = a[2];
								} else {
									calEventCache.week = a[2];
									calEventCache.dayWeek = [3];
								}
								calEventCache.swithYear = a[0];
								calEventCache.month = a[1];
							}
							calEventCache.beginTime = $(".repeat-start").innerText;
							calEventCache.endTime = $(".repeat-end").innerText;
						}
						//事件状态
						var $eventState = $(".event-state");
						calEventCache.states = getValue($eventState);
						calEventCache.statesName = $eventState.innerText;
						//公开给他人
						var $otherMember = $(".other-member");
						if (type == 1) {//编辑&查看
							var tranMemberIds = getValue($otherMember), oldShareType = calEditor.dbCalEvent.shareType;
							if (oldShareType !== "4") {//共享类型!="公开给他人"
								if (tranMemberIds) {
									calEventCache.shareType = 4;
									calEventCache.tranMemberIds = tranMemberIds;
									calEventCache.tranMemberNames = $otherMember.innerText;
								} else {
									calEventCache.shareType = oldShareType;
								}
							} else {
								if (tranMemberIds) {
									calEventCache.shareType = 4;
									calEventCache.tranMemberIds = tranMemberIds;
									calEventCache.tranMemberNames = $otherMember.innerText;
								} else {
									calEventCache.shareType = 1;
								}
							}
						} else {//新增
							calEventCache.tranMemberIds = getValue($otherMember);
							calEventCache.tranMemberNames = $otherMember.innerText;
							if (calEventCache.tranMemberIds) {
								calEventCache.shareType = "4"
							} else {
								calEventCache.shareType = "1"
							}
						}
						/**
						 * 收起&高级设置
						 */
						calEventCache.showMore = $("#up_down").classList.contains("see-icon-v5-common-pull-arrow-top");
						
						/**
						 * 保存updateTip
						 */
						calEventCache.updateTip = calEditor.updateTip;
						
						/**
						 * 保存到缓存中
						 */
						if (type == 0) {//新增
							calEventCache.CurrentUser = calEditor.CurrentUser;
						}
						sessionStorage.setItem(newCalCacheKey, JSON.stringify(calEventCache));
						if (type == 1) {//编辑
							sessionStorage.setItem(editCalCacheKey, JSON.stringify(calEditor.dbCalEvent));
						}
					});
				} else {//查看
					attachments = attachments || [];
					var $uploadAtt = $("#uploadAtt");
					
					$uploadAtt.classList.remove("m3-icon-attachment");
					$uploadAtt.classList.add("cmp-icon");
					if (!$uploadAtt.classList.contains("cmp-icon-arrowdown") && !$uploadAtt.classList.contains("cmp-icon-arrowup")) {
						$uploadAtt.classList.add("cmp-icon-arrowdown");
					}
					cmp(".attach-box").off("tap", "#uploadAtt").on("tap", "#uploadAtt", function(e){
						if (this.classList.contains("cmp-icon-arrowdown")) {
							this.classList.remove("cmp-icon-arrowdown");
							this.classList.add("cmp-icon-arrowup");
							$("#calEditorId").classList.remove("hidden");
						} else {
							this.classList.remove("cmp-icon-arrowup");
							this.classList.add("cmp-icon-arrowdown");
							$("#calEditorId").classList.add("hidden");
						}
					});
					attachments.length == 0 && $uploadAtt.classList.add("hidden");
					var attSize, accdocSize, attSize = accdocSize = 0; 
					attachments.forEach(function(a){
						if (a.type == 0) {
							attSize++;
						} else {
							accdocSize++;
						}
					});
					$(".attach").innerText = attSize;
					$(".documents").innerText = accdocSize;
					calEditor.attComponent = new SeeyonAttachment({
						loadParam : {
							selector : $("#calEditorId"),
							atts : attachments
						}
					});
				}
			});
		},
		/**
		 * 公开给他人
		 */
		bindOtherMemberEvent: function() {
			var isLoadOrg = false;
			cmp(".other-member-box").on("tap", ".text, .more", function(e){
				var t = this;
				if (this.classList.contains("more")) {
					t = this.previousElementSibling;
				}
				if (isLoadOrg) {
					selectOrg(t);
				} else {
					var csses = [_cmpPath+ "/css/cmp-listView.css" + $buildversion, 
					             _cmpPath + "/css/cmp-selectOrg.css" + $buildversion];
					var jses = [_cmpPath + "/js/cmp-listView.js" + $buildversion, 
					            _cmpPath + "/js/cmp-imgCache.js" + $buildversion, 
					            _cmpPath + "/js/cmp-selectOrg.js" + $buildversion];
					cmp.asyncLoad.css(csses);
					cmp.asyncLoad.js(jses, function(){
						isLoadOrg = true;
						selectOrg(t);
					});
				}
			});
			//选人实际处理方法
			function selectOrg(t) {
				cmp.selectOrgDestory("other-member");
				cmp.selectOrg("other-member", {
					type : 2,
					excludeData : (function(){
						var exclude, dbCalEvent = calEditor.dbCalEvent; 
						if (dbCalEvent.id) {//编辑&委托编辑
							exclude = {id: dbCalEvent.createUserId, name: dbCalEvent.createUserName};
						} else {
							exclude = {id: calEditor.CurrentUser.id, name: calEditor.CurrentUser.name};
						}
						exclude.type = "member";
						exclude.disable = true;
						return [exclude];
					})(),
					fillBackData : (function(){
						var fill = [], data = t.getAttribute("data-option"), text = t.innerText;
						if (data) {
							var ids = data.split(","), vals = text.split("、");
							for (var i = 0; i < ids.length; i ++) {
								fill.push({id: ids[i].split("|")[1], name: vals[i], type: "member", disable: false});
							}
						}
						return fill;
					})(),
					jump : false,
					maxSize : -1,
					minSize : 1,
					selectType : 'member',
					lightOptsChange : true,
					callback : function(ret){
						var selectOrgs = JSON.parse(ret).orgResult;
						var ids = [], names = [];
						selectOrgs.forEach(function(e){
							ids.push('Member|' + e.id);
							names.push(e.name);
						});
						setValue(t, ids.join(","), names.join("、"));
					}
				});
			}
		},
		/**
		 * 删除事件绑定
		 */
		removeCalEvent: function() {
			$("#deleteBtn").classList.remove("hidden");
			var calEvent = this.dbCalEvent
			cmp("#calendar-oper").on("tap","#deleteBtn", function(){
				if (calEvent.periodicalStyle != "0") {//周期性事件
					showDeleteDialog();
				} else {//非周期性事件
					cmp.notification.confirm(cmp.i18n("calendar.tip.deleteconfirm"), function(idx){
						if (idx == 0) {
							deleCalEvent(0);
						}
					}, "",[cmp.i18n("calendar.label.ok"), cmp.i18n("calendar.label.cancel")]);
				}
			});
			cmp("#deleteWrap").on("tap", ".tp1", function(){
				hideDeleteDialog();
				deleCalEvent(1);
			}).on("tap", ".tp2", function(){
				hideDeleteDialog();
				deleCalEvent(2);
			}).on("tap", ".cancel", function(){
				hideDeleteDialog();
			});
			/**
			 * 删除事件核心操作方法
			 * @param type 1：删除当前事件, 2:删除当前事件及后续事件
			 */
			function deleCalEvent(type) {
				cmp.dialog.loading(cmp.i18n("calendar.tip.deleting"));
				$api.Event.delCalEventById(calEvent.id, {type: type}, {}, {
					repeat: true,
					success: function(ret){
						cmp.dialog.loading(false);
						if (ret) {
							cmp.notification.toast(cmp.i18n("calendar.tip.deletesuc"), "center", notificationTimeout, 1);
							
							//触发从门户打开事件
							cmp.webViewListener.fire({
				                type: "refreshPortalData",
				                data: cmp.href.getParam() ? cmp.href.getParam().portalParam : undefined,
				                success: function(){},
				                error: function(){}
				            });
				            
				            //触发从待办打开事件
				            cmp.webViewListener.fire({ 
						    	type: 'com.seeyon.m3.ListRefresh', 
						    	data: {
						    		type: "update",
						    		appId: "11"
						    	}
							});
							
				            setTimeout(function(){
				            	cmp.href.back();
				            },notificationTimeout2);
						} else {
							cmp.notification.toast(cmp.i18n("calendar.tip.deletefal"), "center", notificationTimeout);
						}
					},
					error: function(err){
						cmp.dialog.loading(false);
						console.info(err);
						if (cmp.errorHandler(err)) {
							//CMP
						} else {
							cmp.notification.toast(cmp.i18n("calendar.tip.deletefal"), "center", notificationTimeout);
						}
					}
				});
			}
			//隐藏删除选择弹出框
			function hideDeleteDialog(){
				$(".mask").classList.add("hidden");
				$("#deleteWrap").classList.add("hidden");
			}
			//显示删除选择弹出框
			function showDeleteDialog(){
				$(".mask").classList.remove("hidden");
				$("#deleteWrap").classList.remove("hidden");
			}
		},
		/**
		 * 新增事件
		 */
		saveCreateNewCal: (function() {
			var valid = true; //防重复标志位
			
			return function() {
				if (!valid) {return;}
				
				cmp.dialog.loading(cmp.i18n("calendar.tip.saving"));
				var calEvent = calEditor.validateEventAndGet();
				if (calEvent == false) {
					cmp.dialog.loading(false);
					return;
				}
				if (!calEditor.validateRepeatTime(calEvent)){
					cmp.dialog.loading(false);
					return;
				}
				/**
				 * 默认属性
				 * 事件类型默认为为“个人”类型；
				 * 重要程度默认为“重要紧急”；
				 * 工作类型默认为“自办”；
				 */
				calEvent.calEventType = 2;
				calEvent.signifyType = 0;
				calEvent.workType = 1;
				calEvent.completeRate = calEvent.states == '4' ? 100 : 0;
				calEvent.shareType = calEvent.tranMemberIdsOther ? "4" : "1";
				if(params.from == 'xiaozhiSpeechInput'){
					calEvent.from = "robot_cal_envent";//日程机器人新建页面
				}
				/**
				 * 调用后台新增事件
				 */
				valid = false;
				$api.Event.newCalevent({}, calEvent, {
					repeat: true,
					success: function(ret){
						cmp.dialog.loading(false);
						if (ret) {
							cmp.notification.toast(cmp.i18n("calendar.label.eventsaves"), "center", notificationTimeout, 1);
							
							//触发从门户打开事件
							cmp.webViewListener.fire({
				                type: "refreshPortalData",
				                data: cmp.href.getParam() ? cmp.href.getParam().portalParam : undefined,
				                success: function(){},
				                error: function(){}
				            });
				            
				            //触发从待办打开事件
				            cmp.webViewListener.fire({ 
						    	type: 'com.seeyon.m3.ListRefresh', 
						    	data: {
						    		type: "update",
						    		appId: "11"
						    	}
							});
							
				            setTimeout(function(){
				            	cmp.href.back();
				            },notificationTimeout2);
						} else {
							cmp.notification.toast(cmp.i18n("calendar.label.eventsavef"), "center", notificationTimeout);
							valid = true; //回置状态
						}
					},
					error: function(err){
						cmp.dialog.loading(false);
						console.info(err);
						if (cmp.errorHandler(err)) {
							//CMP平台处理
						} else {
							var msg = cmp.i18n("calendar.label.eventsavef");
							if (cmp.platform.CMPShell) {
								msg = err.message;
							} else if (cmp.platform.browser) {
								msg = JSON.parse(err.responseText).message;
							}
							cmp.notification.toast(msg, "center", notificationTimeout);
						}
						valid = true; //回置状态
					}
				});
			}
		})(),
		/**
		 * 更新事件
		 */
		saveUpdateCalEvent: (function() {
			var valid = true;
			
			return function(){
				if (!valid) {return;}
				
				cmp.dialog.loading(cmp.i18n("calendar.tip.saving"));
				
				var dbCalEvent = calEditor.dbCalEvent;
				var calEvent = calEditor.validateEventAndGet();
				if (calEvent == false) {//校验不通过
					cmp.dialog.loading(false);
					return;
				}
				if (calEditor.updateTip == 2) {/*修改当前事件&及以后事件*/
					if (!calEditor.validateRepeatTime(calEvent)){
						cmp.dialog.loading(false);
						return;
					}
				}
				/**
				 * 补充其他信息
				 */
				calEvent.updateTip = calEditor.updateTip;
				calEvent.completeRate = calEvent.states == '4' ? 100 : dbCalEvent.completeRate;
				var tranMemberIds = getValue($(".other-member")), oldShareType = calEditor.dbCalEvent.shareType;
				if (oldShareType !== "4") {//共享类型!="公开给他人"
					if (tranMemberIds) {
						calEvent.shareType = 4;
						calEvent.tranMemberIds = tranMemberIds;
					} else {
						calEvent.shareType = oldShareType;
					}
				} else {
					if (tranMemberIds) {
						calEvent.shareType = 4;
						calEvent.tranMemberIds = tranMemberIds;
					} else {
						calEventCache.shareType = 1;
					}
				}
				
				calEvent.shareType = calEvent.tranMemberIdsOther ? "4" : dbCalEvent.shareType;
				calEvent.calEventID = dbCalEvent.id;
				/**
				 * 调用后台保存事件
				 */
				valid = false;
				$api.Event.updateCalEvent({}, calEvent, {
					repeat: true,
					success: function(ret){
						cmp.dialog.loading(false);
						if (ret) {
							cmp.notification.toast(cmp.i18n("calendar.label.eventsaves"), "center", notificationTimeout, 1);
							 cmp.webViewListener.fire({
					                type: "refreshPortalData",
					                data: cmp.href.getParam() ? cmp.href.getParam().portalParam : undefined,
					                success: function(){},
					                error: function(){}
					            });
					            setTimeout(function(){
					            	cmp.href.back();
					            },notificationTimeout2);
						} else {
							cmp.notification.toast(cmp.i18n("calendar.label.eventsavef"), "center", notificationTimeout);
							valid = true; //回置状态
						}
					},
					error: function(err){
						cmp.dialog.loading(false);
						if (cmp.errorHandler(err)) {
							//CMP平台处理错误
						} else {
							var msg = cmp.i18n("calendar.label.eventsavef");
							if (cmp.platform.CMPShell) {
								msg = err.message;
							} else if (cmp.platform.browser) {
								msg = JSON.parse(err.responseText).message;
							}
							cmp.notification.toast(msg, "center", notificationTimeout);
						}
						console.info(err);
						valid = true; //回置状态
					}
				});
			}
		})(),
		/**
		 * 校验并获取日程事件信息
		 */
		validateEventAndGet: function() {
			var calEvent = {};
			/**
			 * 标题
			 * 1. 不可以为空字符串；
			 * 2. 字符串长度不可以大于50个字
			 */
			calEvent.subject = $("#subject").value.trim();
			if (calEvent.subject.length == 0) {
				cmp.notification.toast(cmp.i18n("calendar.tip.titlenotnull"), "center", notificationTimeout);
				return false;
			}
			if (calEvent.subject.length > 50) {
				cmp.notification.toast(cmp.i18n("calendar.word.title50"), "center", notificationTimeout);
				return false;
			}
			/**
			 * 开始时间&结束时间
			 * 1. 结束时间必须大于开始时间
			 */
			calEvent.beginDate = Date.parseDateTime($(".start-date").innerText).getTime();
			calEvent.endDate = Date.parseDateTime($(".end-date").innerText).getTime();
			if (calEvent.beginDate >= calEvent.endDate) {
				cmp.notification.toast(cmp.i18n("calendar.word.endoverstart"), "center", notificationTimeout);
				return false;
			}
			/**
			 * 事件内容
			 */
			calEvent.content = $("#content").value;
			if (calEvent.content.length > 300) {
				cmp.notification.toast(cmp.i18n("calendar.tip.nomore300"), "center", notificationTimeout);
				return false;
			}
			/**
			 * 提醒&开始前提醒&结束前提醒
			 */
			calEvent.alarmFlag = $(".remind-type-box .cmp-switch").classList.contains("cmp-active");
			if (calEvent.alarmFlag) {
				calEvent.alarmDate = getValue($(".remind-start-time"));
				calEvent.beforendAlarm = getValue($(".remind-end-time"));
			} else {
				calEvent.alarmDate = 0;
				calEvent.beforendAlarm = 0;
			}
			/**
			 * 重复周期&重复选项&重复开始日期&重复结束日期
			 * 1. 重复结束日期不能早于当前时间;
			 * 2. 跨日事件不可按天或按周重复
			 */
			calEvent.periodicalType = getValue($(".repeat-type"));
			if (calEvent.periodicalType == "1" || calEvent.periodicalType == "2") {
				var startTime = $(".start-date").innerText, endDate = $(".end-date").innerText;
				if (startTime.substr(8,2) != endDate.substr(8,2)) {//跨日
					var label = calEvent.periodicalType == "1" ? cmp.i18n("calendar.label.byday") : cmp.i18n("calendar.label.byweek");
					cmp.notification.toast(cmp.i18n("calendar.label.notrepeat") + label + cmp.i18n("calendar.word.repeat"), "center", notificationTimeout);
					return false;
				}
			}
			if (calEvent.periodicalType != "0") {//重复周期不为“无”
				var rp = getValue($(".repeat-option"));
				if (calEvent.periodicalType == 1) {//按天
					calEvent.dayDate = rp;
				} else if (calEvent.periodicalType == 2) {//按周
					calEvent.weeks = rp;
				} else if (calEvent.periodicalType == 3) {//按月
					var a = rp.split(",");
					if (a[0] == "1") {//每月第15日提醒
						calEvent.dayDate = a[1];
					} else {//每月第三个星期四提醒
						calEvent.week = a[1];
						calEvent.dayWeek = a[2];
					}
					calEvent.swithMonth = a[0];
				} else if (calEvent.periodicalType == 4) {
					var a = rp.split(",");
					if (a[0] == "1") {//每年2月15日提醒
						calEvent.dayDate = a[2];
					} else {//每年2月第三个星期三提醒
						calEvent.week = a[2];
						calEvent.dayWeek = a[3];
					}
					calEvent.swithYear = a[0];
					calEvent.month = a[1];
				}
				calEvent.beginTime = Date.parseDate($(".repeat-start").innerText).getTime();
				calEvent.endTime = Date.parseDate($(".repeat-end").innerText).getTime();
			}
			/**
			 * 事件完成状态&完成率
			 */
			calEvent.states = $(".event-state").getAttribute("data-option");
			/**
			 * 附件&关联文档
			 */
			var attachments = {attachmentInputs: calEditor.attComponent.getFileArray()};
			calEvent.attachments = cmp.toJSON(attachments);
			/**
			 * 公开给他人
			 */
			calEvent.tranMemberIdsOther = $(".other-member").getAttribute("data-option");
			
			/**
			 * 表情转换
			 */
			var cemoji = cmp.Emoji();
			calEvent.subject = cemoji.EmojiToString(calEvent.subject);
			calEvent.content = cemoji.EmojiToString(calEvent.content);
			
			return calEvent;
		},
		/**
		 * 对事件的重复周期进行校验
		 * 此处为附加的校验：只有在新增&全编辑时候才要执行
		 */
		validateRepeatTime: function(calEvent) {
			if (calEvent.periodicalType == "0") {
				return true;
			}
			if (calEvent.beginTime > calEvent.endTime) {
				cmp.notification.toast(cmp.i18n("calendar.word.repeatoversys"), "center", notificationTimeout);
				return false;
			}
			if (calEvent.endTime < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
				cmp.notification.toast(cmp.i18n("calendar.word.repeatoversys"), "center", notificationTimeout);
				return false;
			}
			if (calEvent.endTime - calEvent.beginTime > 1000*60*60*24*365) {
				if (calEvent.periodicalType == 1) {
					cmp.notification.toast(cmp.i18n("calendar.word.repaetbyday"), "center", notificationTimeout);
					return false;
				}
				if (calEvent.periodicalType == 2) {
					cmp.notification.toast(cmp.i18n("calendar.word.repaetbyweek"), "center", notificationTimeout);
					return false;
				}
			}
			/**
			 * 重复周期的开始日期不能早于事件开始日期
			 */
			var bd = new Date(calEvent.beginDate), 
				beginDate = new Date(bd.getFullYear(), bd.getMonth(), bd.getDate()).getTime();//获取时间的yyyy-MM-dd
			if (calEvent.beginTime < beginDate) {
				cmp.notification.toast(cmp.i18n("calendar.word.repaetdatef"), "center", 2*notificationTimeout);
				return false;
			}
			return true;
		}
	};
	/**
	 * 设置DOM的data-option & innerText
	 * 
	 * @param dom
	 * @param value
	 * @param text
	 * @returns
	 */
	function setValue(dom, value, text) {
		dom.setAttribute("data-option", value);
		dom.innerText = text;
	}
	/**
	 * 获取DOM的data-option属性值
	 * 
	 * @param dom
	 * @returns
	 */
	function getValue(dom) {
		return dom.getAttribute("data-option");
	}
	//============================================================================//
	//                          常量区
	//============================================================================//
	var notificationTimeout = 1000;
	var notificationTimeout2 = 2000;
	var now = new Date(); //当前时间
	var newCalCacheKey = "NEW_CAL_CACHE_KEY";//新增事件缓存KEY值
	var editCalCacheKey = "EDIT_CAL_CACHE_KEY";//编辑事件缓存KEY值
	
	//{"1" : "星期日", "2" : "星期一", "3" : "星期二", "4" : "星期三", "5" : "星期四", "6" : "星期五", "7" : "星期六"};
	function getWeekDay(key) {
		var weekDayMap = {"1" : cmp.i18n("calendar.date.sunday"), "2" : cmp.i18n("calendar.date.monday"), "3" : cmp.i18n("calendar.date.tuesday"), "4" : cmp.i18n("calendar.date.wednesday"), "5" : cmp.i18n("calendar.date.thursday"), "6" : cmp.i18n("calendar.date.friday"), "7" : cmp.i18n("calendar.date.saturday")};
		return weekDayMap[key];
	}
	//{"1" : "一", "2" : "二", "3" : "三", "4" : "四"}
	function getN2Label(key) {
		var n2Labels = {"1" : cmp.i18n("calendar.number.one"),
				"2" : cmp.i18n("calendar.number.two"), 
				"3" : cmp.i18n("calendar.number.three"),
				"4" : cmp.i18n("calendar.number.four"),
				"5" : cmp.i18n("calendar.number.five"),
				};
		return n2Labels[key];
	}
	
	//===========================================================================//
	//                          Date扩展
	//============================================================================//
	/**
	 * 获取日期的yyyy-MM-dd hh:mm格式字符串
	 */
	Date.prototype.dateTimeStr = function(){
		var y = this.getFullYear(),
			M = this.getMonth() + 1,
			d = this.getDate(),
			h = this.getHours(),
			m = this.getMinutes();
		
		return y + '-' + 
			( M >= 10 ? (''+M) : ('0'+M) ) + '-' + 
			( d >= 10 ? (''+d) : ('0'+d) ) + ' ' + 
			( h >= 10 ? (''+h) : ('0'+h) ) + ':' +
			( m >= 10 ? (''+m) : ('0'+m) );
	}
	/**
	 * Date加上小时数返回新的实例
	 * 
	 * @param diff 整数
	 */
	Date.prototype.addHour = function(diff) {
		return new Date(this.getTime() + diff * 60 * 60 * 1000);
	}
	/**
	 * Date加上分钟数返回新的实例
	 * 
	 * @param diff 整数
	 */
	Date.prototype.addMinus = function(diff) {
		return new Date(this.getTime() + diff * 60 * 1000);
	}
	/**
	 * 获取日期为这个月的第几周
	 */
	Date.prototype.getWeekOfMonth = function() {
		var monthOfStart = new Date(this.getTime());
		monthOfStart.setDate(1);
		var startDay = monthOfStart.getDay();
		startDay = (startDay == 0 ?  7 : startDay);
		
		var dayOfWeek  = this.getDay();
		dayOfWeek = (dayOfWeek == 0 ?  7 : dayOfWeek);
		if(dayOfWeek < startDay ){
			return Math.ceil( (this.getDate() -  (7  - startDay + 1) ) / 7);
		}else{
			return Math.ceil((this.getDate() + (startDay - 1) ) / 7);
		}
	}
	/**
	 * 将日期时间字符串（yyyy-MM-dd HH:mm）转换为Date对象
	 * 
	 * @param source 字符串
	 */
	Date.parseDateTime = function(source) {
		var sdatetime = source.split(" ")
		var sdate = sdatetime[0].split("-")
		var stime = sdatetime[1].split(":")
		return new Date(sdate[0], parseInt(sdate[1]) - 1, parseInt(sdate[2]), stime[0], stime[1], 0);
	}
	/**
	 * 将日期字符串（yyyy-MM-dd）转换为Date对象，
	 * 
	 * @param source 字符串
	 */
	Date.parseDate = function(source) {
		var sdate = source.split("-")
		return new Date(sdate[0], sdate[1] - 1, sdate[2])
	}
})(cmp, window, SeeyonApi, function(selector, target){
	target = target || document;
	return target.querySelector(selector);
});