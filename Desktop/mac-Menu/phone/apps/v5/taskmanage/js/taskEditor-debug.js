/*!
 * @description	任务H5新建页面js	
 * @file		taskEditor.js
 * @author 		shuqi 	at 2017-01-09
 * 
 * 任务编辑相关的方法
 * 	1、如果新建
 * 		1.1、缓存中存在数据（从附件上传页面返回的）
 * 			1.1.1、回填数据
 * 			1.1.2、绑定编辑事件（和编辑的事件一样）
 * 		1.2、缓存中不存在数据（新建页面）
 * 			1.2.1、回填数据（回填时间、回填负责人为当前登录人员）
 * 			1.2.1、绑定编辑事件（和编辑的事件一样）
 * 	2、如果是查看（编辑）
 * 		2.1、回填任务的基本数据
 * 		2.2、回填任务的汇报信息
 * 		2.3、如果有编辑权限绑定编辑事件
 * 		2.4、如果有汇报权限绑定汇报权限
 * 		2.5、根据汇报、催办、修改权限动态显示头部按钮
 */
var taskComment;
var taskEditor;
var taskHasten;
var windowH= window.innerHeight;
;~(function(cmp,window,$api,$){
	
	//======================================================================================//
	// 		任务评论部分事件
	//======================================================================================//
	var rootIp = cmp.serverIp ? cmp.serverIp : "";
	//全局变量
	var taskGlobal = {
		isAudit : false,
		needAudit:false,
		taskInfo : {},
		currentUser : {}
	};
	var CommentTpl = $("#task-comments-tpl").innerHTML;
	var shakecommentTpl = $("#task-shakecomment-tpl").innerHTML;
	function getCommentPath(){//获取评论的path
		if(cmp.platform.CMPShell === true ){
			if (/iphone|ipod/gi.test(navigator.userAgent)){
				return "iphone";
			}else if (/ipad/gi.test(navigator.userAgent)){
				return "ipad";
			}else{
				return "androidphone";
			}
		}
		return "weixin"
	}
	function trim(txt){
		if(txt == null || typeof txt === "undefined"){
			return "";
		}
		return txt.replace(/(^\s*)|(\s*$)/gi,"");
	}
	taskComment = {
			init:function(taskId){
				$(".task-comment-area").classList.remove("taskdetail-hide");
				//初始化列表
				$api.Tasks.taskComments(taskId,{pageNo:-1,pageSize:-1},{
					success : function(result){
				    	var table = $('#task_commit .task-comment-one');
				    	if(result["data"] && result["data"].length > 0){
				    		//格式化数据
				    	var data = taskComment.formartData(result["data"]);
				    		var html = cmp.tpl(CommentTpl, data);
				    		$('#task_commit .task-comment-one').innerHTML = html;
				    		//加载附件
				    		taskComment.initAttachment(data);
				    	}else{
				    		var html = "";
				    		html+= '<li style="text-align: center;color: #b7b7b7;padding-bottom: 20px;">';
				    		html+= '	<div class="tast-status-container">';
				    		html+= '		<div class="nocontent"></div>';  
			    			html+= '		<span class="text nocontent_text">' + cmp.i18n("Taskmanage.label.nocomment") + '</span></div>';
				    		html+= '	</div>';
				    		html+= '</li>';
				    		$('#task_commit .task-comment-one').innerHTML = html;
				    	}
				    	
					},
					error : function(error){
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							//console.log(error);
							if(error && error.message != ""){
								cmp.notification.toast(error.message, "center", notificationTimeout);							
							}else{
								cmp.notification.toast(cmp.i18n("Taskmanage.message.getdatafail"), "center", notificationTimeout);							
							}
						}
					}
				});
				taskComment.initEvent(taskId);
			},
			initEvent:function(taskId){
				//回复列表
				cmp("#task_commit").on("tap",".task-comment-one-content-detail-detail .task-comment-name.cmp-ellipsis,.task-comment-one-content-detail-detail .task-comment-content",function(){
					var liDom = this;
					while(liDom.tagName.toLowerCase() !== "li"){
						liDom = liDom.parentNode;
					}
					taskComment.replyCommentId = liDom.id;
					var oldTaskKey = oldCacheKey + "_" + taskEditor.oldTaskDetailCache.taskId;
					var editTaskKey = editCacheKey + "_" + taskEditor.oldTaskDetailCache.taskId;
					cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
					taskEditor.storageTaskDetail(editTaskKey,true);
					//与主回复用同一页面，跳转
					cmp.href.next(_taskmanagePath + "/html/taskReply.html",{
						taskId : taskId,
						replyCommentId:taskComment.replyCommentId,
						
					});
				}).on("tap",".praise-handle",function(){
					var praiseSpan = $("span",false,this);
					var commentId = this.getAttribute("data-id");
					$api.Tasks.taskPraise(commentId,{},{
						success : function(result){
							if(result.success){
								result = result.data;
							}else{
								cmp.notification.alert(result.msg,function(){
									cmp.href.go(_taskmanagePath + "/html/task_index.html");
								},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.backtohome"));
								return;
							}
							if(result.praiseToComment){
								praiseSpan.classList.add("active");
							}else{
								praiseSpan.classList.remove("active");
							}
							praiseSpan.nextElementSibling.innerHTML = result.praiseNumber;
						},
						error : function(error){
							var cmpHandled = cmp.errorHandler(error);
							if(!cmpHandled){
								cmp.notification.toast(cmp.i18n("Taskmanage.message.likefail"), "center", notificationTimeout);						
							}
						}
					});
				});
				
				function hideComment(){
					//返回
					$("#task-reply").classList.remove("cmp-active");
					$("#reply-area").value = "";
					$("#reply-remain").innerHTML = 500;
					cmp.backbutton.pop();
				}
				
        		
        		//防重复提交用
        		var submitting = false;
				cmp("#task-reply").on("tap",".task-save-btn", function(){
					if(submitting){
						return;
					}
					submitting = true;
					var content = trim($("#reply-area").value);
					if(!/\S+/.test(content)){
						submitting =false;
						cmp.notification.toast(cmp.i18n("Taskmanage.message.connotnull"), "center", notificationTimeout);
						return;
					}
					var params = {
						pid : taskComment.replyCommentId,
						content : content,
						path : getCommentPath(),
						attachList : cmp.toJSON(subAttComponent.getFileArray())
					};
					if(cmp.Emoji && params.content){
						var cemoji = cmp.Emoji();
						params.content = cemoji.EmojiToString(params.content);
					}
					$api.Task.taskComment(taskId,{},params,{
						success : function(result){
							if(result.success === "true"){
								cmp.notification.toast(cmp.i18n("Taskmanage.label.commentSuccess"), "center");
								hideComment();//恢复回复框到初始状态
								//手动添加震荡回复到DOM
								var html = cmp.tpl(shakecommentTpl,taskComment.formartData([result.data]));
								var currentReplyUl = document.getElementById(taskComment.replyCommentId).querySelector("ul.task-comment-two");
								currentReplyUl.insertAdjacentHTML("beforeEnd",html);
							}else{
								cmp.notification.alert(cmp.i18n("Taskmanage.message.bedeleted")),function(){
									cmp.href.go(_taskmanagePath + "/html/task_index.html");
								},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.backtohome");
							}
							submitting = false;
						},
						error : function(error){
							var cmpHandled = cmp.errorHandler(error);
							if(!cmpHandled){
								console.log(error);
								cmp.notification.alert(error);							
							}
							submitting = false;
						}
					});
				});
				//添加震荡回复文本框输入字数监听
				$("#reply-area").addEventListener("input", function(){
					var num = this.value.length;
					if(num > 500){
						this.value = this.value.substr(0,500);
						this.blur();
						$("#reply-remain").innerHTML = 0;
						cmp.notification.toast(cmp.i18n("Taskmanage.label.nomorethan500"), "center");
					}else{
						$("#reply-remain").innerHTML = 500 - num;
					}
				});
			},
			formartData:function(data){
				cmp.each(data,function(index,item){
					item.userImage = rootIp + item.userImage;
					item.createDate = new Date(parseInt(item.createDate)).taskformat("yyyy-MM-dd HH:mm");
					if(item.content != null){
						item.content = item.content.escapeHTML();
						item.content = item.content.replace(/\n/g,"<br>");
					}else{
						item.content = "";
					}
					if(item.children){
						cmp.each(item.children,function(subIndex,subItem){
							subItem.createDate = new Date(parseInt(subItem.createDate)).taskformat("yyyy-MM-dd HH:mm");
							if(subItem.content != null){
								subItem.content = subItem.content.escapeHTML();
								subItem.content = subItem.content.replace(/\n/g,"<br>");
							}else{
								subItem.content = "";
							}
						});
					}
				});
				return data;
			},
			initAttachment:function(attArray){
				if(!attArray) return;
				cmp.each(attArray,function(index,item){
					var loadParam = {
				   		selector : $("#attachment_" + item.id),
				   		atts : item.attachments,
				    };
				    new SeeyonAttachment({loadParam : loadParam});
				    //增加子回复附件列表展示
				    if(item.children.length>0){
				    	cmp.each(item.children,function(subindex,subitem){
				    		var loadParam = {
							   		selector : $("#attachment_" + subitem.id),
							   		atts : subitem.attachments,
							    };
							    new SeeyonAttachment({loadParam : loadParam});
				    	});
				    }
				    	
				});
			}
	};
	
	//======================================================================================//
	// 		任务编辑、查看、新建
	//======================================================================================//
	var CommintTasking = false;
	taskEditor = {
			/**
			 * 初始化任务编辑、查看页面
			 * 	1、初始化基本事件
			 * 	2、根据新建、查看（编辑）进行不同事件的绑定
			 */
			initTaskEditor : function(params) {
				cmp.dialog.loading();
				/**
				 * 展开和收起属于公用的，都需要初始化
				 */
				cmp("#body_content_div").on('tap', ".task-show", function(e) {
					if (this.children[1].classList.contains("task-common-arrow-top")) {
                        document.getElementById("body_content_div").scrollTop = 0;
						var _this = this;
						setTimeout(function() {
                            $(".task-detail").style.display = "none";
                            $(".task-attach").style.display = "none";
                            $(".task-account").style.display = "none";
                            var taskATime = $(".task-a-time");
                            if(taskATime.classList.contains("taskdetail-true")){
                                taskATime.classList.add("taskdetail-hide");
                            }
							_this.children[0].innerHTML = cmp.i18n("Taskmanage.label.unfold");
							_this.children[1].classList.remove("task-common-arrow-top");
							_this.children[1].classList.remove("see-icon-arrow-up");
							_this.children[1].classList.add("task-common-arrow-down");
							_this.children[1].classList.add("see-icon-arrow-down");
                        },10);
					} else {
						$(".task-detail").style.display = "block";
						$(".task-attach").style.display = "block";
						$(".task-account").style.display = "block";
						var taskATime = $(".task-a-time");
						if(taskATime.classList.contains("taskdetail-true")){
							taskATime.classList.remove("taskdetail-hide");
						}
						this.children[0].innerHTML = cmp.i18n("Taskmanage.label.fold");
						this.children[1].classList.add("task-common-arrow-top");
						this.children[1].classList.add("see-icon-arrow-up");
						this.children[1].classList.remove("task-common-arrow-down");
						this.children[1].classList.remove("see-icon-arrow-down");
					}

                    var task_description = $("#task-description");
                    var inputWrap = task_description.parentNode;
                    if(task_description.scrollHeight > task_description.clientHeight){
                        inputWrap.style.height = (task_description.scrollHeight + 10) + "px";
                        task_description.style.height = task_description.scrollHeight + "px";
                        task_description.style.overflowY = "hidden";
                    }else if(task_description.clientHeight > 32){
                        if((task_description.clientHeight - 20) < 32 || (task_description.clientHeight - 20) == 32){
                            inputWrap.style.height = "40px";
                            task_description.style.height = "34px";
                        }else{
                            inputWrap.style.height = ((task_description.clientHeight - 20) + 8) + "px";
                            task_description.style.height = (task_descriptione.clientHeight - 20) + "px";
                        }
                        task_description.style.overflowY = "hidden";
                    }
                    task_description.scrollTop = task_description.scrollHeight;
				});
				/**
				 * 返回函数
				 */
				var backPageFunc;
				if(params.weixinMessage || (params.form && params.form == "robot")){
					backPageFunc = cmp.href.closePage;
				}else{
					if(params.taskId){
						//查看
						backPageFunc = taskEditor.cmpBack;
					}else{
						//新建
						backPageFunc = function(){
							//放弃新建
							var taskStatus = [{key : "1",name : "<span style='color:red;'>" + cmp.i18n("Taskmanage.message.giveupnew") + "</span>"}];
							cmp.dialog.actionSheet(taskStatus, cmp.i18n("Taskmanage.label.cancel"), function(item) {
								taskEditor.cmpBack();
							});
						}
					}
				}
				cmp.backbutton();
        		cmp.backbutton.push(backPageFunc);
				/**
				 * 新建和查看（编辑）页面头部显示效果不一样
				 */
				if (params.taskId) {//查看（编辑）状态
					document.title=cmp.i18n("Taskmanage.label.taskdetail");

					
					//回复页面回来，提示回复成功（本不该放在这，但是考虑到加载数据的问题，先放到这里）
					var replyTag = cmp.storage.get("task_reply_tag",true);
					if(replyTag && replyTag === "reply"){
						cmp.storage.delete("task_reply_tag",true);
						cmp.notification.toast(cmp.i18n("Taskmanage.label.commentSuccess"), "center");
					}
				} else {// 新建状态
					document.title=cmp.i18n("Taskmanage.label.newtask");
					taskEditor.initTaskTypeSelect(true,'-1');//任务类型
					$(".task-save-wapper").classList.remove("taskdetail-hide");// 显示保存按钮
					cmp(".task-save-wapper").on("tap", ".save", function() {
						taskEditor.saveCreateTask();//完成
					});
				}
				
				// 回填数据
				taskEditor.initContent(params);

                $("#task-description").addEventListener("input",function () {
                    var inputWrap = this.parentNode;
                    var e = this;
                    if(e.scrollHeight > e.clientHeight){
                        inputWrap.style.height = (e.scrollHeight + 10) + "px";
                        e.style.height = e.scrollHeight + "px";
                        e.style.overflowY = "hidden";
                    }else if(e.clientHeight > 32){
                        if((e.clientHeight - 20) < 32 || (e.clientHeight - 20) == 32){
                            inputWrap.style.height = "40px";
                            e.style.height = "34px";
                        }else{
                            inputWrap.style.height = ((e.clientHeight - 20) + 8) + "px";
                            e.style.height = (e.clientHeight - 20) + "px";
                        }
                        e.style.overflowY = "hidden";
                    }
                    e.scrollTop = e.scrollHeight;
                })
			},
			/**
			 * 保存修改任务、汇报任务
			 * @param viewEditSave	保存按钮的dom
			 */
			saveEditTask : function(viewEditSave) {
				if(CommintTasking){
					return;
				}
				CommintTasking = true;
				cmp.dialog.loading();
				var canUpdate = viewEditSave.getAttribute("canupdate");
				var canFeedback = viewEditSave.getAttribute("canfeedback");
				//任务基本信息
				var task = {};
				if (canUpdate != "false") {
					task = taskEditor.validateAndGetTask(true);
					if (!task) {
						cmp.dialog.loading(false);
						CommintTasking = false;
						return;
					}
				}
				
				//调用API
				$api.Task.updateTask4M3(taskEditor.oldTaskDetailCache.taskId, {}, task, {
					success : function(ret) {
						cmp.dialog.loading(false);
						if (ret) {
							if(task.auditorId && task.auditorId != "" && task.auditorId != '-1' && task.auditorId != taskGlobal.currentUser.id){
								cmp.notification.toast(cmp.i18n("Taskmanage.label.waitForAudit"), "center", 1000);
							}else{
								cmp.notification.toast(cmp.i18n("Taskmanage.message.saveSuccess"), "center", 500,1);
							}
							setTimeout(function() {
								var pageParam = cmp.href.getParam() || {};
								if(pageParam.openType && pageParam.openType == "message"){
									taskEditor.cmpBack();
								}else if(pageParam.weixinMessage){
									cmp.href.closePage();
								}else{
									taskEditor.cmpBack();//go(_taskmanagePath + "/html/task_index.html?datetime=" + new Date().getTime());
								}
							}, notificationTimeout);
						} else {
							cmp.notification.toast(cmp.i18n("Taskmanage.message.savefailed"), "center", notificationTimeout);
							CommintTasking = false;
						}
					},
					error : function(error) {
						cmp.dialog.loading(false);
						CommintTasking = false;
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							cmp.notification.toast(cmp.i18n("Taskmanage.message.savefailed"), "center", notificationTimeout);
						}
					}
				});
			},
			/**
			 * 保存新建任务
			 */
			saveCreateTask : function() {
				if(CommintTasking){
					return;
				}
				CommintTasking = true;
				cmp.dialog.loading();
				// 保存操作
				var task = taskEditor.validateAndGetTask(false);
				if (!task) {
					cmp.dialog.loading(false);
					CommintTasking = false;
					return;
				}
				
				var pageParam = taskEditor.source;
				if(pageParam ){
					if(pageParam.sourceId){
						task.source_id = pageParam.sourceId;
					}
					if(pageParam.sourceType){
						task.source_type = pageParam.sourceType;
					}
				}
				
				$api.Task.createTask({}, task, {
					success : function(ret) {
						cmp.dialog.loading(false);
						if (ret) {
							if(task.auditorId && task.auditorId != taskGlobal.currentUser.id){
								cmp.notification.toast(cmp.i18n("Taskmanage.label.waitForAudit"), "center", 1000);
							}else{
								cmp.notification.toast(cmp.i18n("Taskmanage.message.saveSuccess"), "center", 500,1);
							}
							setTimeout(function() {
								taskEditor.cmpBack();
							}, notificationTimeout);
						} else {
							cmp.notification.toast(cmp.i18n("Taskmanage.message.savefailed"), "center", notificationTimeout);
							CommintTasking = false;
						}
					},
					error : function(error) {
						cmp.dialog.loading(false);
						CommintTasking = false;
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							cmp.notification.toast(cmp.i18n("Taskmanage.message.savefailed"), "center", notificationTimeout);
						}
					}
				});
			},
			/**
			 * 获取任务的汇报
			 */
			getTaskFeedbackInfo : function() {
				var status = $(".task-status-count .task-common-right-text").getAttribute("data-value");
				var finishRate = $(".task-status-per .task-common-right-text").getAttribute("data-value");
				return {
					"status" : status,
					"finishRate" : finishRate
				};
			},
			/**
			 * 表单验证如果不通过就返回false，通过返回task对象
			 * @param isEdit	是否为编辑任务
			 */
			validateAndGetTask : function(isEdit) {
				var task = {};
				task.subject = trim($("textarea.task-title-detail").value);
				if (task.subject.length == 0) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.titlenotnull"), "center", notificationTimeout);
					return false;
				}
				if (task.subject.length > 85) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.titlelimit"), "center", notificationTimeout);
					return false;
				}
				
				// 时间校验
				var plannedStartTime = $(".task-start-time .task-common-right-text").innerText;
				var plannedEndTime = $(".task-end-time .task-common-right-text").innerText;
				if (plannedStartTime.length == 0) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.selectstarttime"), "center", notificationTimeout);
					return false;
				}
				if (plannedEndTime.length == 0) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.selectovertime"), "center", notificationTimeout);
					return false;
				}
				task.fulltime = $(".task-p-time-type .cmp-switch").classList.contains("cmp-active") ? "1" : "0";
				var startTime = 1, endTime = 1;
				if (task.fulltime == "1") {
					startTime = Date.parseDateTime(plannedStartTime + " 00:00:00");
					endTime = Date.parseDateTime(plannedEndTime + " 23:59:00");
				} else {
					startTime = Date.parseDateTime(plannedStartTime + ":00");
					endTime = Date.parseDateTime(plannedEndTime + ":00");
				}
				if (startTime.getTime() > endTime.getTime()) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.overlaterthanstart"), "center", notificationTimeout);
					return false;
				}
				task.plannedStartTime = startTime.getTime() + "";
				task.plannedEndTime = endTime.getTime() + "";
				
				// 人员信息
				function getMembers(ids) {
					// Member|1089162192738468767
					if (ids.length > 0 && ids[0] != "") {// "".split(",") ==> [""]
						return "Member|" + ids.join(",Member|");
					}
					return "";
				}
				var managerIds = $("#managers").getAttribute("data-value").split(",");
				if (managerIds.length > 0 && managerIds[0] == "") {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.selectmanager"), "center", notificationTimeout);
					return false;
				}
				task.managers = getMembers(managerIds);
				var participatorIds = $("#participators").getAttribute("data-value").split(",");
				task.participators = getMembers(participatorIds);
				var inspectorIds = $("#inspectors").getAttribute("data-value").split(",");
				task.inspectors = getMembers(inspectorIds);
				
				//审核人
				var auditorIds = $("#auditor").getAttribute("data-value");
				task.auditorId = auditorIds;
				if(isEdit && auditorIds){
					task.auditor = getMembers(auditorIds.split(","));
				}else if(!isEdit){
					if(taskGlobal.isAudit && !auditorIds){
						cmp.notification.toast(cmp.i18n("Taskmanage.label.chooseAuditor"), "center", notificationTimeout);
						return false;
					}
					task.auditor = getMembers(auditorIds.split(","));
				}
				
				// 描述信息
				var content = $("textarea.task-detail-detail").value;
				if (content) {
					task.content = content;
				}
				
				//任务类型
				task.taskType = $("#taskType").getAttribute("data-value");
				if (task.taskType == -1) {
					cmp.notification.toast(cmp.i18n("Taskmanage.message.tasktype.cannotbenull"), "center", notificationTimeout);
					return false;
				}
				
				//处理附件
				var attachments = {attachmentInputs:taskEditor.attComponent.getFileArray()};
				task.attachments = cmp.toJSON(attachments);
				
				task.importantLevel = $("#importantLevel").getAttribute("data-value");
				task.milestone = $("#milestone").classList.contains("cmp-active") ? "1" : "0";
				task.remindstarttime = $(".task-account-remind-begin .task-common-right-text").getAttribute("data-value");
				task.remindendtime = $(".task-account-remind-end .task-common-right-text").getAttribute("data-value");
				
				
				//结束提醒时间验证
				var timeFrame = task.plannedEndTime - task.plannedStartTime;
				if(timeFrame <= 60000 * task.remindendtime ){
					cmp.notification.toast(cmp.i18n("Taskmanage.message.overtimelimit"), "center", notificationTimeout);
					return false;
				}
				
				// 实际开始、结束时间校验
				if(isEdit){
					var actualStartTime = $(".task-a-start-time .task-common-right-text").innerText;
					var actualEndTime = $(".task-a-end-time .task-common-right-text").innerText;
					if(actualStartTime.length != 0 && actualEndTime.length != 0){
						var afulltime = $(".task-a-time-type .cmp-switch").classList.contains("cmp-active") ? "1" : "0";
						var astartTime = 1, aendTime = 1;
						if (afulltime == "1") {
							astartTime = Date.parseDateTime(actualStartTime + " 00:00:00");
							aendTime = Date.parseDateTime(actualEndTime + " 00:00:00");
						} else {
							astartTime = Date.parseDateTime(actualStartTime + ":00");
							aendTime = Date.parseDateTime(actualEndTime + ":00");
						}
						if (astartTime.getTime() > aendTime.getTime()) {
							cmp.notification.toast(cmp.i18n("Taskmanage.message.actualoverlaterthanstart"), "center", notificationTimeout);
							return false;
						}
						task.actualStartTime = astartTime.getTime() + "";
						task.actualEndTime = aendTime.getTime() + "";
					}else if(actualStartTime.length != 0 || actualEndTime.length != 0){
						if (actualStartTime.length == 0) {
							cmp.notification.toast(cmp.i18n("Taskmanage.message.selectAstarttime"), "center", notificationTimeout);
							return false;
						}
						if (actualEndTime.length == 0) {
							cmp.notification.toast(cmp.i18n("Taskmanage.message.selectAovertime"), "center", notificationTimeout);
							return false;
						}
					}
				}
				
				if(cmp.Emoji){
					var cemoji = cmp.Emoji();
					if(task.subject){
						task.subject = cemoji.EmojiToString(task.subject);
					}
					if(task.content){
						task.content = cemoji.EmojiToString(task.content);
					}
				}
				
				return task;
			},
			/** 人员信息缓存 */
			memberCache : {},
			/** 任务详细信息缓存 */
			oldTaskDetailCache : false,
			/**
			 * 初始化数据
			 */
			initContent : function(params) {
				if (params.taskId) {
					// 附件返回 从sessionStorage
					var oldTaskKey = oldCacheKey + "_" + params.taskId;
					var editTaskKey = editCacheKey + "_" + params.taskId;
					var oldTaskCache = cmp.storage.get(oldTaskKey,true);
					cmp.storage.delete(oldTaskKey,true);
					var editTaskCache = cmp.storage.get(editTaskKey,true);
					cmp.storage.delete(editTaskKey,true);
					
					if (editTaskCache && oldTaskCache) {
						var oldtask = taskEditor.oldTaskDetailCache = JSON.parse(oldTaskCache);
						var editTask = JSON.parse(editTaskCache);
						editTask.taskAuthVO = oldtask.taskAuthVO;
						taskGlobal.taskInfo = oldtask;
						// 任务详情的cache
						taskEditor.processTaskView(editTask);
						//取消加载
						cmp.dialog.loading(false);
					} else {
						$api.Task.getTaskDetail(params.taskId, {}, {
							success : function(data) {
								//取消加载
								cmp.dialog.loading(false);
								
								if (data.success) {
									taskGlobal.taskInfo = data.taskDetail;
									// 任务详情的cache
									taskEditor.oldTaskDetailCache = data.taskDetail;
									taskEditor.processTaskView(data.taskDetail);
								} else {
									// 报错返回上一个页面
									cmp.notification.alert(data.msg,function(){
										cmp.href.back();
									},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.back"));
								}
							},
							error : function(error) {
								//取消加载
								cmp.dialog.loading(false);
								var cmpHandled = cmp.errorHandler(error);
								if(!cmpHandled){
									// 报错返回上一个页面
									cmp.notification.toast(cmp.i18n("Taskmanage.message.readinfofailed"), "center", notificationTimeout);
									setTimeout(function() {
										cmp.href.back();
									}, notificationTimeout);
								}
							}
						});
					}
				} else {
					// 新建任务回填(查看sessionStorage是否存在数据)
					var newTaskCache = cmp.storage.get(newCacheKey,true);
					cmp.storage.delete(newCacheKey,true);
					if (newTaskCache) {
						// 附件上传后回填数据
						taskEditor.fillbackData(JSON.parse(newTaskCache),false,false);
						//显示更多(附件回来展开)
						//cmp.trigger($("#body_content_div .task-show"),"tap");
					} else {
						//初次进来回填日志
						var now = new Date().taskformat("yyyy-MM-dd");
						var time = params.currentDate;
						if(time != null && time != undefined && time != ''){
					 	  now = time;
					    }
						$(".task-start-time .task-common-right-text").innerHTML = now + " 00:00";
						$(".task-end-time .task-common-right-text").innerHTML = now + " 23:59";
						// 回填数据
						if(params && params.createType == "newTaskWithParams"){
							taskEditor.fillbackData(params,false,false);
						}
						// 回填当前登录人为负责人
						if(cmp.platform.CMPShell){
							var member = cmp.member;
							var managers = $("#managers");
							managers.setAttribute("data-value", member.id);
							managers.innerText = member.name;
							taskEditor.memberCache[member.id] = member.name;
							taskGlobal.currentUser = member;
						}else{
							$api.Task.getCurrentUser({}, {}, {
								success : function(ret) {
									var managers = $("#managers");
									managers.setAttribute("data-value", ret.id);
									managers.innerText = ret.name;
									taskEditor.memberCache[ret.id] = ret.name;
									taskGlobal.currentUser = ret;
								},
								error : function(error) {
									var cmpHandled = cmp.errorHandler(error);
									if(!cmpHandled){
										console.log(error);
										cmp.notification.alert(error);
									}
								}
							});
						}
					}
					
					//渲染审核人
					$api.Task.initCondition({},{
						success : function(result){
							if(result && result.data && result.data.task_audit){
								taskGlobal.isAudit = true;
								$(".task-person .task-person-audit").classList.remove("taskdetail-hide")
							}
						},
						error : function(error){
							var cmpHandled = cmp.errorHandler(error);
							if(!cmpHandled){
								console.log(error);
								cmp.notification.alert(error);
							}
						}
					})
					
					// 初始化任务的编辑
					taskEditor.initEditEvent(false);
					taskEditor.initAttachment([],true);
					//点击上传附件，将任务的信息放在缓存
					document.addEventListener("beforepageredirect",function(){
						taskEditor.storageTaskDetail(newCacheKey,false,false);
						cmp.storage.save("new_task_back_from_upload_att",true,true);
					});
					cmp.dialog.loading(false);
				}
				var new_task_back_from_upload_att = cmp.storage.get("new_task_back_from_upload_att",true);
				if("true" == new_task_back_from_upload_att){
					//显示更多(附件回来展开)
					cmp.trigger($("#body_content_div .task-show"),"tap");
					cmp.storage.delete("new_task_back_from_upload_att",true);
				}
			},
			/**
			 *将页面的的任务信息保存在 sessionStorage
			 *@param	key				sessionStorage保存的key
			 *@param	isView			是否为查看或者编辑任务的状态
			 */
			storageTaskDetail:function(key,isView){
				var taskDetailCache = {};
				taskDetailCache.taskId = taskEditor.oldTaskDetailCache.taskId;
				taskDetailCache.subject = $("textarea.task-title-detail").value;
				// 计划时间
				var plannedStartTime = $(".task-start-time .task-common-right-text").innerText;
				var plannedEndTime = $(".task-end-time .task-common-right-text").innerText;
				taskDetailCache.fulltime = $(".task-p-time-type .cmp-switch").classList.contains("cmp-active") ? true : false;
				var startTime = 1, endTime = 1;
				if (taskDetailCache.fulltime) {
					startTime = Date.parseDateTime(plannedStartTime + " 00:00:00");
					endTime = Date.parseDateTime(plannedEndTime + " 23:59:00");
				} else {
					startTime = Date.parseDateTime(plannedStartTime + ":00");
					endTime = Date.parseDateTime(plannedEndTime + ":00");
				}
				taskDetailCache.plannedStartTime = startTime.getTime() + "";
				taskDetailCache.plannedEndTime = endTime.getTime() + "";
				
				//汇报信息
				if(isView){
					var status = $(".task-status-count .task-common-right-text");
					taskDetailCache.status = status.getAttribute("data-value");
					taskDetailCache.statusLabel = status.innerHTML;
					taskDetailCache.finishRate = $(".task-status-per .task-common-right-text").getAttribute("data-value");
				}
				
				// 人员信息
				function getMembers(ids) {
					// Member|1089162192738468767
					if (ids.length > 0 && ids[0] != "") {// "".split(",") ==> [""]
						return ids;
					}
					return [];
				}
				var managers = $("#managers");
				taskDetailCache.managers = getMembers(managers.getAttribute("data-value").split(","));
				taskDetailCache.managerNames = getMembers(managers.innerHTML.split("、"));
				var participators = $("#participators");
				taskDetailCache.participators = getMembers(participators.getAttribute("data-value").split(","));
				taskDetailCache.participatorNames = getMembers(participators.innerHTML.split("、"));
				var inspectors = $("#inspectors");
				taskDetailCache.inspectors = getMembers(inspectors.getAttribute("data-value").split(","));
				taskDetailCache.inspectorNames = getMembers(inspectors.innerHTML.split("、"));
				//审核人相关
				var auditorDom = $("#auditor"),auditStatusDom = $(".task-audit-status .task-common-right-text");
				taskDetailCache.auditors = getMembers(auditorDom.getAttribute("data-value").split(","));
				taskDetailCache.auditorNames = getMembers(auditorDom.innerHTML.split("、"));
				taskDetailCache.auditStatus = auditStatusDom.innerText;
				taskDetailCache.auditStatusCode = taskEditor.oldTaskDetailCache.auditStatusCode;
				
				// 来源
				var pageParam = taskEditor.source;
				if(pageParam ){
					if(pageParam.sourceId){
						taskDetailCache.sourceId = pageParam.sourceId;
					}
					if(pageParam.sourceType){
						taskDetailCache.sourceType = pageParam.sourceType;
					}
				}

				// 描述信息
				var content = $("textarea.task-detail-detail").value;
				if (content) {
					taskDetailCache.content = content;
				}else{
					taskDetailCache.content = "";
				}
				//附件
				if(taskEditor.attComponent){ //attObj.attObjArray
					taskDetailCache.attachments = taskEditor.attComponent.attObjArray;//getFileArray();
				}else if(isView && !taskEditor.oldTaskDetailCache.taskAuthVO.canUpdate){
					//查看状态时，没有编辑权限，附件缓存特殊处理
					taskDetailCache.attachments = taskEditor.oldTaskDetailCache.attachments;
				}
				taskDetailCache.importantLevel = $("#importantLevel").getAttribute("data-value");
				taskDetailCache.importantLevelLabel = $("#importantLevel").innerHTML;
				
				taskDetailCache.taskType = $("#taskType").getAttribute("data-value");
				taskDetailCache.taskTypeLabel = $("#taskType").innerText;
				
				if(isView){
					//创建人 createrName
					taskDetailCache.createrName = $("#task-creater").innerText;
					
					//实际开始结束时间
					var actualStartTime = $(".task-a-start-time .task-common-right-text").innerText;
					var actualEndTime = $(".task-a-end-time .task-common-right-text").innerText;
					taskDetailCache.afulltime = $(".task-a-time-type .cmp-switch").classList.contains("cmp-active") ? true : false;
					var astartTime = 1, aendTime = 1;
					if (taskDetailCache.afulltime) {
						astartTime = actualStartTime ? Date.parseDateTime(actualStartTime + " 00:00:00") : "";
						aendTime = actualEndTime ? Date.parseDateTime(actualEndTime + " 00:00:00") : "";
					} else {
						astartTime = actualStartTime ? Date.parseDateTime(actualStartTime + ":00") : "";
						aendTime = actualEndTime ? Date.parseDateTime(actualEndTime + ":00") : "";
					}
					if(astartTime){
						taskDetailCache.actualStartTime = astartTime.getTime() + "";
					}
					if(aendTime){
						taskDetailCache.actualEndTime = aendTime.getTime() + "";
					}
					//来源
					var taskSource = $("#task-source-name .task-common-right-text");
					var taskSourceName = taskSource.innerText;
					if(taskSourceName != ""){
						taskDetailCache.sourceName = taskSourceName;
						taskDetailCache.sourceAppType = taskSource.getAttribute("data-sourceAppType");
						taskDetailCache.sourceId = taskSource.getAttribute("data-sourceId");
						taskDetailCache.sourceAffairId = taskSource.getAttribute("data-sourceAffairId");
						taskDetailCache.sourceRightId = taskSource.getAttribute("data-sourceRightId");
						taskDetailCache.sourceFormId = taskSource.getAttribute("data-sourceFormId");
					}
				}
				
				taskDetailCache.milestone = $("#milestone").classList.contains("cmp-active") ? "1" : "0";
				taskDetailCache.remindStartTime = $(".task-account-remind-begin .task-common-right-text").getAttribute("data-value");
				taskDetailCache.remindStartTimeLabel = $(".task-account-remind-begin .task-common-right-text").innerHTML;
				taskDetailCache.remindEndTime = $(".task-account-remind-end .task-common-right-text").getAttribute("data-value");
				taskDetailCache.remindEndTimeLable = $(".task-account-remind-end .task-common-right-text").innerHTML;
				if(!(taskDetailCache.remindstarttime == -1 && taskDetailCache.remindendtime == -1)){
					taskDetailCache.isremindTime = true;
				}else{
					taskDetailCache.isremindTime = false;
				}
				cmp.storage.save(key,JSON.stringify(taskDetailCache),true);
			},
			/**
			 * 处理任务查看
			 * 	1、绑定下边的两个按钮的事件
			 * 	2、控制头部按钮的显示，绑定头部按钮事件
			 * 	3、回填任务的数据
			 * 	4、绑定编辑编辑事件（如果有权限）
			 *  5、绑定汇报事件（如果有权限）
			 * @param taskDetail	任务详情
			 */
			processTaskView : function(taskDetail) {
				var oldTaskKey = oldCacheKey + "_" + taskEditor.oldTaskDetailCache.taskId;
				var editTaskKey = editCacheKey + "_" + taskEditor.oldTaskDetailCache.taskId;
				// 注册事件先放到这里 这个要等到数据加载完成后再绑定事件
				cmp("#task-save").on("tap", "#duration", function(e) {
					cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
					taskEditor.storageTaskDetail(editTaskKey,true);
					cmp.href.next(_taskmanagePath + "/html/taskFeedbackList.html", {
						taskId : taskDetail.taskId
					});
				}).on("tap", "#commit", function(e) {
					cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
					taskEditor.storageTaskDetail(editTaskKey,true);
					cmp.href.next(_taskmanagePath + "/html/taskReply.html",{
						taskId : taskDetail.taskId
					});
				});
				
				
				// 判断是否有编辑权限
				var taskAuthVO = taskDetail.taskAuthVO;
				$(".task-view-actions").classList.remove("taskdetail-hide");// 显示底部评论和汇报按钮
				if(taskAuthVO.canUpdate){
					$(".task-save-wapper").classList.remove("taskdetail-hide");// 显示保存按钮
					cmp(".task-save-wapper").on("tap", ".save", function() {
						taskEditor.saveEditTask(this);//保存
					});
					$("#body_content_div").style.bottom = "100px";
					$("#task-save").style.height = "100px"
				}
				
				/**
				 * 初始化审核按钮
				 */
				taskEditor.initAuditEvents(taskDetail);
				//打开数据来源
				cmp("#task-source-name").on("tap",".task-common-right-text",function(){
					var appType = this.getAttribute("data-sourceAppType");
					var sourceId = this.getAttribute("data-sourceId");
					var sourceAffairId = this.getAttribute("data-sourceAffairId");
					var sourceFormId = this.getAttribute("data-sourceFormId");
					var sourceRightId = this.getAttribute("data-sourceRightId");
					var taskId = this.getAttribute("data-taskId");
					var name = this.innerText;
					switch (appType) {
						case "1"://协同
							if(sourceId == "undefined"){
								return;
							}
							var jses = [colPath + "/collaboration_m_api.s3js" + $buildversion];
							cmp.asyncLoad.js(jses,function(){
								cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
								taskEditor.storageTaskDetail(editTaskKey,true);
								collApi.openSummary({
									"summaryId":sourceId,
									"openFrom":"task",
									"taskId":taskId
								});
							});
							break;
						case "2"://无流程表单
							//unflowformPath
							if(sourceId == "undefined" || sourceRightId == "undefined"){
								return;
							}
							var jses = [unflowformPath + "/unflowform_m_api.s3js" + $buildversion];
							cmp.asyncLoad.js(jses,function(){
								cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
								taskEditor.storageTaskDetail(editTaskKey,true);
								cmp.openUnflowFormData({
									"moduleType":37,
									"moduleId":sourceId,
									"name":name,
									"rightId":sourceRightId,
									"viewState":2,
									"formId":sourceFormId,
									"needCheckRight":true//检查权限
								});
							});
							break;
						case "6"://会议
							if(sourceId == "undefined"){
								return;
							}
							var jses = [meetingPath + "/meeting_m_api.s3js" + $buildversion];
							cmp.asyncLoad.js(jses,function(){
								cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
								taskEditor.storageTaskDetail(editTaskKey,true);
								meetingApi.jumpToMeetingDetail(sourceId,"timeArrange");
							});
							break;
						default:
							break;
					}
				});
				//加载任务评论的数据
				taskComment.init(taskDetail.taskId);

				// 回填数据
				taskEditor.fillbackData(taskDetail, true,true);
				// 初始化任务编辑
				if(taskAuthVO.canUpdate){
					taskEditor.initEditEvent(true);
					taskEditor.initAttachment(taskDetail.attachments,true);
					//点击上传附件，将任务的信息放在缓存
					document.addEventListener("beforepageredirect",function(){
						cmp.storage.save(oldTaskKey,JSON.stringify(taskEditor.oldTaskDetailCache),true);
						taskEditor.storageTaskDetail(editTaskKey,true);
						cmp.storage.save("new_task_back_from_upload_att",true,true);
					});
					//可编辑状态时初始化任务类型下拉列表
					taskEditor.initTaskTypeSelect(false,taskDetail.taskId);//任务类型
				}else{
					//查看状态，如果没有内容，则显示标题
					if(taskDetail.content == null
							|| typeof taskDetail.content == "undefined"
							|| taskDetail.content == ""){
						$("div.task-detail-detail").innerText = taskDetail.subject;
					}
					taskEditor.initAttachment(taskDetail.attachments,false);
					//查看状态或者cmp壳时显示附件（查看状态在回调中显示）
					document.querySelector("#task-att-area").classList.remove("taskdetail-hide");
				}
				// 初始化任务汇报
				$(".task-status").classList.remove("taskdetail-hide");
				taskAuthVO.canFeedback && taskEditor.initFeedbackEvent(taskDetail);
				
				//初始化头部事件
				taskEditor.initEditHeadEvent(taskDetail);
			},
			/**
			 * 编辑（查看）状态的时候，初始化头部事件
			 * @param taskDetail	任务详情
			 */
			initEditHeadEvent : function(taskDetail) {
				var taskAuthVO = taskDetail.taskAuthVO;
				//显示更多按钮
				if (( taskAuthVO.canHasten && taskDetail.status < 4 ) || taskAuthVO.canDelete) {
					$("#topPopoverA").classList.remove("taskdetail-hide");
				}
				$("#topPopoverA").addEventListener("tap",function () {
					var statusItems = [];
					if(taskGlobal.needAudit){
						statusItems.push({
							key:"doAudit",
							name:cmp.i18n("Taskmanage.label.audit")
						});
					}
					//催办
					if (taskAuthVO.canHasten && taskDetail.status < 4 ) {
						statusItems.push({
							key:"dohasten",
							name:cmp.i18n("Taskmanage.label.hasten")
						});
						taskHasten.initHastenEvent(taskDetail.taskId);
					}
					//显示删除按钮
					if (taskAuthVO.canDelete ) {
						statusItems.push({
							key:"dodelete",
							name:"<span style='color:red'>" + cmp.i18n("Taskmanage.label.delete") + "</span>"
						});
					}
					cmp.dialog.actionSheet(statusItems, cmp.i18n("Taskmanage.label.cancel"), function(item) {
						if (item.key == "doAudit") {// 任务审核
							taskEditor.openAuditBox();
						}else if (item.key == "dohasten") {// 催办
							taskHasten.showHasten();
						} else {// 删除
							cmp.notification.confirm(cmp.i18n("Taskmanage.message.deletetask"),function(index){
								if(index == 0){//是
									$api.Task.removeTaskById(taskDetail.taskId, {}, {
										success : function(data) {
											if (data.success) {
												cmp.notification.toast(cmp.i18n("Taskmanage.message.deletetasksuccess"), "center", notificationTimeout , 1);
												setTimeout(function() {
													taskEditor.cmpBack();
													//cmp.href.go(_taskmanagePath + "/html/task_index.html?datetime=" + new Date().getTime());
												}, notificationTimeout);
											} else {
												// 报错返回上一个页面
												cmp.notification.toast(data.error_msg, "center", notificationTimeout);
											}
										},
										error : function(error) {
											var cmpHandled = cmp.errorHandler(error);
											if(!cmpHandled){
												// 报错返回上一个页面
												cmp.notification.toast(cmp.i18n("Taskmanage.message.deletetaskfailed"), "center", notificationTimeout);
											}
										}
									});
								}
							},cmp.i18n("Taskmanage.label.tips"),[cmp.i18n("Taskmanage.label.yes"),cmp.i18n("Taskmanage.label.no")]);
						}
					});
				});
				
				// 可以更新显示保存按钮
				if (taskAuthVO.canUpdate || taskAuthVO.canFeedback) {
					var viewEditSave = $(".task-save-wapper");
					viewEditSave.classList.remove("taskdetail-hide");
					viewEditSave.setAttribute("canupdate",taskAuthVO.canUpdate);
					viewEditSave.setAttribute("canfeedback",taskAuthVO.canFeedback);
				}
				
			},
			/**
			 * 初始化汇报事件
			 * @param taskDetail 任务详情
			 */
			initFeedbackEvent : function(taskDetail) {
				function getHtml(parent){
					var html = "";
					html += "<div>";
					html += "	<input class='finishrate_text' style='width: 85%;height: 34px;padding: 0px 10px;'  type='number' value='" + (parent ? parent : "") + "' placeholder='" + cmp.i18n("Taskmanage.message.inputnumber") + "'/>";
					html += "	<span style='font-size: 14px;color: #333;'>%</span>";
					html += "</div>";
					return html;
				}
				// 显示修改百分比的弹框
				function showDialog(parent) {
					cmp.notification.confirm(getHtml(parent), function (index,callbackObj) {
						$(".finishrate_text").blur();
						if (index == 1) {
							var val = $(".finishrate_text").value;
							if (/^\d+$/.test(val) && val >= 0 && val <= 100) {
								val = parseInt(val);
								var per = $(".task-status-per .task-common-right-text");
								var taskStatus = $(".task-status-count .task-common-right-text");
								per.innerHTML = val + "%";
								per.setAttribute("data-value", val);
								if(val == 100){ //100 就变为已完成
									if(!taskGlobal.finishBox){
										taskGlobal.finishBox = new InsBox({
											tag : "task_finish",
											title : cmp.i18n("Taskmanage.label.explain"),
											placeholder : cmp.i18n("Taskmanage.label.explainFinish"),
											buttons : [{
												id : 'submit',
												name : cmp.i18n("Taskmanage.label.submit"),
												fun : function(data){
													$(".task-status-per .task-common-arrow").classList.remove("taskdetail-hide");
													var per = $(".task-status-per .task-common-right-text");
													taskStatus.setAttribute("data-value", 4);
													taskStatus.innerHTML = cmp.i18n("Taskmanage.label.finished");
													//联动变颜色
													taskEditor.changeStatusColor(taskStatus,per,4,taskEditor.isOverDue);
													//保存汇报信息
													taskEditor.saveFeedback(data,function(result){
														taskEditor.renderAuditColor(result);
														if(result.auditor && result.auditor != "-1" && result.auditor != taskGlobal.currentUser.id){
															cmp.notification.toast(cmp.i18n("Taskmanage.label.waitForAudit"), "center",2000);
														}else{
															cmp.notification.toast(cmp.i18n("Taskmanage.label.modSuccess"), "center",2000);
														}
													});
												}
											}]
										});
									}else{
										taskGlobal.finishBox.open();
									}
								}else{
									$(".task-status-per .task-common-arrow").classList.remove("taskdetail-hide");
									taskStatus.setAttribute("data-value", 2);
									taskStatus.innerHTML = cmp.i18n("Taskmanage.label.inprogress");
									taskEditor.changeStatusColor(taskStatus,per,2,taskEditor.isOverDue);
									//保存汇报信息
									taskEditor.saveFeedback(undefined,function(result){
										$(".task-audit-status .task-common-right-text").innerHTML = result.auditStatus;
										cmp.notification.toast(cmp.i18n("Taskmanage.label.modSuccess"), "center",2000);
									});
								}
								//关输入框
								callbackObj.closeFunc();
							} else {
								cmp.notification.toast(cmp.i18n("Taskmanage.message.inputnumber"), "top");
							}
						}else{
							//关输入框
							callbackObj.closeFunc();
						}
					},cmp.i18n("Taskmanage.message.updatepercentage"),null,4,true);
				}
				
				// 状态
				$(".task-status-count .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-status-count").on("tap", ".task-box-right", function(e) {
					var label = this.children[0];
					var taskStatus = [{key : "1",name : cmp.i18n("Taskmanage.label.unstart")}, {key : "2",name : cmp.i18n("Taskmanage.label.inprogress")}, {key : "4",	name : cmp.i18n("Taskmanage.label.finished")}, {key : "5",	name : cmp.i18n("Taskmanage.label.canceled")}];
					cmp.dialog.actionSheet(taskStatus, cmp.i18n("Taskmanage.label.cancel"), function(item) {
						var per = $(".task-status-per .task-common-right-text");
						if (item.key == 2) {// 进行中
							var oldKey = label.getAttribute("data-value");
							if(oldKey != 2){
								setTimeout(function(){
									showDialog();
								},500);
							}else{
								setTimeout(function(){
									showDialog(per.getAttribute("data-value"));
								},500);
							}
						} else if (item.key == 5) {//已取消
							if(!taskGlobal.cancelBox){
								taskGlobal.cancelBox = new InsBox({
									tag : "task_cancel",
									title : cmp.i18n("Taskmanage.label.explain"),
									placeholder : cmp.i18n("Taskmanage.label.explainCancel"),
									buttons : [{
										id : 'submit',
										name : cmp.i18n("Taskmanage.label.submit"),
										validate : {
											message : cmp.i18n("Taskmanage.label.explainCancel")
										},
										fun : function(data){
											var oldKey = label.getAttribute("data-value");
											if(oldKey == 4){
												per.innerHTML = "0%";
												per.setAttribute("data-value", 0);
											}
											label.setAttribute("data-value", item.key);
											label.innerHTML = item.name;
											$(".task-status-per .task-common-arrow").classList.remove("taskdetail-hide");
											//联动变颜色
											taskEditor.changeStatusColor(label,per,item.key,taskEditor.isOverDue);
											taskEditor.saveFeedback(data,function(result){
												taskEditor.renderAuditColor(result);
												if(result.auditor && result.auditor != "-1" && result.auditor != taskGlobal.currentUser.id){
													cmp.notification.toast(cmp.i18n("Taskmanage.label.waitForAudit"), "center",2000);
												}else{
													cmp.notification.toast(cmp.i18n("Taskmanage.label.modSuccess"), "center",2000);
												}
											});
										}
									}]
								});
							}else{
								taskGlobal.cancelBox.open();
							}
						} else if (item.key == 1) {// 未开始
							label.setAttribute("data-value", item.key);
							label.innerHTML = item.name;
							$(".task-status-per .task-common-arrow").classList.add("taskdetail-hide");
							per.innerHTML = "0%";
							per.setAttribute("data-value", 0);
							//联动变颜色
							taskEditor.changeStatusColor(label,per,item.key,taskEditor.isOverDue);
							//保存汇报信息
							taskEditor.saveFeedback(undefined,function(result){
								taskEditor.renderAuditColor(result);
								cmp.notification.toast(cmp.i18n("Taskmanage.label.modSuccess"), "center",2000);
							});
						} else if (item.key == 4) {// 已完成
							if(!taskGlobal.finishBox){
								taskGlobal.finishBox = new InsBox({
									tag : "task_finish",
									title : cmp.i18n("Taskmanage.label.explain"),
									placeholder : cmp.i18n("Taskmanage.label.explainFinish"),
									buttons : [{
										id : 'submit',
										name : cmp.i18n("Taskmanage.label.submit"),
										fun : function(data){
											label.setAttribute("data-value", item.key);
											$(".task-status-per .task-common-arrow").classList.remove("taskdetail-hide");
											label.innerHTML = item.name;
											per.innerHTML = "100%";
											per.setAttribute("data-value", 100);
											//联动变颜色
											taskEditor.changeStatusColor(label,per,item.key,taskEditor.isOverDue);
											//保存汇报信息
											taskEditor.saveFeedback(data,function(result){
												taskEditor.renderAuditColor(result);
												if(result.auditor && result.auditor != "-1" && result.auditor != taskGlobal.currentUser.id){
													cmp.notification.toast(cmp.i18n("Taskmanage.label.waitForAudit"), "center",2000);
												}else{
													cmp.notification.toast(cmp.i18n("Taskmanage.label.modSuccess"), "center",2000);
												}
											});
										}
									}]
								});
							}else{
								taskGlobal.finishBox.open();
							}
						}
					}, function() {
						label = null
					});
				});
				
				//显示百分比的操作按钮
				if (taskDetail.status == 2 || taskDetail.status == 5 || taskDetail.status == 4) {
					$(".task-status-per .task-common-arrow").classList.remove("taskdetail-hide");
				}
				// 修改百分比
				cmp(".task-status-per").on("tap", ".task-box-right", function(e) {
					var status = $(".task-status-count .task-common-right-text").getAttribute("data-value");
					if (status == 2 || status == 5 || status == 4) {
						showDialog(this.children[0].getAttribute("data-value"));
					}
				});
			},
			attComponent:false,
			/**
			 * 初始化附件上传
			 * @param initData		初始化数据[]
			 * @param allowEdit		是否允许编辑
			 */
			initAttachment:function(initData,allowEdit){
				if(allowEdit){
					//附件需要处理
					taskEditor.attComponent = new SeeyonAttachment({
						initParam : {
							uploadId : "taskEditorId",
							continueUpload:true,
							handler : "#uploadAtt",
							initAttData :initData,
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
								$("#att-size").innerHTML = "(" + attSize + ")";
								$("#accdoc-size").innerHTML = "(" + accdocSize + ")";
							}
						}
					});
				}else{
					//cmp-icon-arrowup /cmp-icon-arrowdown
					var uploadAtt = $("#uploadAtt");
					uploadAtt.classList.remove("see-icon-accessory");
					uploadAtt.classList.add("cmp-icon-arrowdown");
					uploadAtt.addEventListener("click",function(){
						var taskEditorId = $("#taskEditorId");
						if(taskEditorId.classList.contains("taskdetail-hide")){
							taskEditorId.classList.remove("taskdetail-hide");
							this.classList.remove("cmp-icon-arrowdown");
							this.classList.add("cmp-icon-arrowup");
						}else{
							taskEditorId.classList.add("taskdetail-hide");
							this.classList.add("cmp-icon-arrowdown");
							this.classList.remove("cmp-icon-arrowup");
						}
					});
					//初始化查看附件
					new SeeyonAttachment({
						loadParam : {
							selector : $("#taskEditorId"),
							atts : initData
						}
					});
					
					//附件回填	 初始化事件的时候回填
					var attachmentSize = initData.length;
					var attSize = 0,accdocSize = 0;
					for(var i = 0; i < attachmentSize; i++){
						var type = initData[i].type;
						if(type == 0){
							attSize++;
						}else{
							accdocSize++;
						}
					}
					$("#att-size").innerHTML = "(" + attSize + ")";
					$("#accdoc-size").innerHTML = "(" + accdocSize + ")";
				}
			},
			/**
			 * 初始化详情页面，任务基本信息操作的事件（编辑和新建都是一样的）
			 * @param	isView
			 */
			initEditEvent : function(isView) {
				var textarea = $("textarea.task-title-detail");
				textarea.classList.remove("taskdetail-hide");
				$("div.task-title-detail").classList.add("taskdetail-hide");
				limitInput(textarea,85);//限制输入
				textarea.addEventListener("focus",function(){
					this.classList.remove("task-title-detail-blur");
				});
				textarea.addEventListener("blur",function(){
					this.classList.add("task-title-detail-blur");
					this.scrollTop = 0;
				});
				
				// 显示时间选择器
				var loadedTimePicker = false;
				function showTimePicker(t,type,callback) {
					if(loadedTimePicker){
						var currentDate = t.previousElementSibling.innerHTML;
						var options = {
								type : type
						};
						if (currentDate.length > 0) {
							options.value = currentDate;
						}
						var task_start_time = new cmp.DtPicker(options);
						task_start_time.show(function(rs) {
							t.previousElementSibling.innerHTML = rs.value;
							task_start_time.dispose();
							callback(rs.value);
						});
					}else{
						var jses = [commonPath + "/js/cmp-dtPicker.js" + $buildversion];
						cmp.asyncLoad.js(jses,function(){
							loadedTimePicker = true;
							var currentDate = t.previousElementSibling.innerHTML;
							var options = {
									type : type
							};
							if (currentDate.length > 0) {
								options.value = currentDate;
							}
							var task_start_time = new cmp.DtPicker(options);
							task_start_time.show(function(rs) {
								t.previousElementSibling.innerHTML = rs.value;
								task_start_time.dispose();
								callback(rs.value);
							});
						});
					}
				}
				
				// 计划开始时间
				$(".task-detail-start-time .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-detail-start-time").on('tap', ".task-box-right", function(e) {
					var type = "datetime";
					if($(".task-p-time-type .cmp-switch").classList.contains("cmp-active")){
						type = "date";
					}
					showTimePicker(this.children[1],type,function(value){});
				});
				
				// 计划结束时间
				$(".task-end-time .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-end-time").on('tap', ".task-box-right", function(e) {
					var type = "datetime";
					if($(".task-p-time-type .cmp-switch").classList.contains("cmp-active")){
						type = "date";
					}
					showTimePicker(this.children[1],type,function(value){
						//rs.value
						var endTime = new Date();
						if (value.length == 10) {
							endTime = Date.parseDateTime(value + " 00:00:00");
						} else if (value.length == 16) {
							endTime = Date.parseDateTime(value + ":00");
						}
						taskEditor.isOverDue = endTime < new Date().getTime();
						var statusLabel = $(".task-status-count .task-common-right-text");
						var finishRate = $(".task-status-per .task-common-right-text");
						taskEditor.changeStatusColor(statusLabel,finishRate,statusLabel.getAttribute("data-value"),taskEditor.isOverDue);
					});
				});
				
				// 是否全天
				$(".task-p-time-type .cmp-switch").classList.remove("cmp-disabled");
				cmp(".task-p-time-type").on('toggle', ".cmp-switch", function(e) {
					var start = $(".task-start-time .task-common-right-text");
					var end = $(".task-end-time .task-common-right-text");
					if (this.classList.contains("cmp-active")) {
						start.innerHTML = start.innerHTML.slice(0, 10);
						end.innerHTML = end.innerHTML.slice(0, 10);
					} else {
						start.innerHTML = start.innerHTML.slice(0, 10) + " 00:00";
						end.innerHTML = end.innerHTML.slice(0, 10) + " 23:59";
					}
				});
				
				//选人弹框
				var loadedSelectOrg = false;
				function selectPeople(options) {
					
					options = options ? options : {};
					var id = options.id;
					var initDatas = options.initDatas;
					var callback = options.callback;
					var maxSize = options.maxSize ? options.maxSize : -1;
					var seeExtAccount = options.seeExtAccount != undefined ? options.seeExtAccount : true;
					
					if(loadedSelectOrg){
						cmp.selectOrgDestory(id);
						var selectOrgObj = cmp.selectOrg(id, {
							type : 2,
							seeExtAccount : seeExtAccount,
							excludeData : initDatas.excludeData,
							fillBackData : initDatas.fillBackData,
							jump : false,
							maxSize : maxSize,
							minSize : -1,
							selectType : 'member',
							lightOptsChange : true,
							callback : callback
						});
					}else{
						var csses = [commonPath+ "/css/cmp-listView.css" + $buildversion,
						             commonPath + "/css/cmp-selectOrg.css" + $buildversion];
						var jses = [commonPath + "/js/cmp-listView.js" + $buildversion,
						            commonPath + "/js/cmp-imgCache.js" + $buildversion,
						            commonPath + "/js/cmp-selectOrg.js" + $buildversion];
						cmp.asyncLoad.css(csses);
						cmp.asyncLoad.js(jses,function(){
							loadedSelectOrg = true;
							cmp.selectOrgDestory(id);
							var selectOrgObj = cmp.selectOrg(id, {
								type : 2,
								seeExtAccount : seeExtAccount,
								excludeData : initDatas.excludeData,
								fillBackData : initDatas.fillBackData,
								jump : false,
								maxSize : maxSize,
								minSize : -1,
								selectType : 'member',
								lightOptsChange : true,
								callback : callback
							});
						});
					}
				}
				//初始化：排除数据 + 回填数据
				function initData(ids) {
					if (ids.length > 0 && ids[0] == "") {
						ids = [];
					}
					var excludeData = [], fillBackData = [];
					for ( var id in taskEditor.memberCache) {
						// {id:currentUser.id,name:currentUser.name,type:"member",disable:"表示过滤不可选择"}
						var mb = {
								"id" : id,
								"name" : taskEditor.memberCache[id],
								"type" : "member"
						};
						var disable = true;
						for (var int = 0; int < ids.length; int++) {
							if (ids[int] == id) {
								disable = false;
								break;
							}
						}
						if (disable) {
							mb.disable = true;
							excludeData.push(mb);
						} else {
							fillBackData.push(mb);
						}
					}
					return {
						"excludeData" : excludeData,
						"fillBackData" : fillBackData
					};
				}
				//选择完人后数据回填
				function fillPerson(targetDom, ids, resultData) {
					// 删除原来的
					for (var int = 0; int < ids.length; int++) {
						delete taskEditor.memberCache[ids[int]];
					}
					var newIds = [], newNames = [];
					if (resultData.length > 0) {
						for (var int = 0; int < resultData.length; int++) {
							var mem = resultData[int];
							taskEditor.memberCache[mem.id] = mem.name;
							newIds.push(mem.id);
							newNames.push(mem.name);
						}
					}
					targetDom.setAttribute("data-value", newIds.join(","));
					targetDom.innerText = newNames.join("、");
				}
				
				// 责任人
				$(".task-person-res .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-person-res").on("tap", ".task-box-view-right", function() {
					var targetDom = $(".task-common-right-text",false,this);
					var ids = targetDom.getAttribute("data-value").split(",");
					var initDatas = initData(ids);
					selectPeople({
						id : "task-resa",
						initDatas : initDatas,
						callback : function(result){
							var result = JSON.parse(result);
							fillPerson(targetDom, ids, result.orgResult);
						}
					});
				});
				
				// 审核人
				$(".task-person-audit .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-person-audit").on("tap", ".task-box-view-right", function() {
					var targetDom = $(".task-common-right-text",false,this);
					var id = targetDom.getAttribute("data-value");
					var name = targetDom.innerHTML;
					var fillBackData;
					if(id && name){
						fillBackData = {
							id : id,
							name : name,
							type : "member"
						}
					}
					selectPeople({
						id : "task-resa",
						maxSize : 1,
						seeExtAccount : false,
						initDatas : {
							fillBackData : fillBackData ? [fillBackData] : undefined
						},
						callback : function(result){
							var result = JSON.parse(result);
							result = result.orgResult[0];
							targetDom.setAttribute("data-value", result.id);
							targetDom.innerText = result.name;
						}
					});
				});
				
				// 参与人
				$(".task-person-dep .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-person-dep").on("tap", ".task-box-view-right", function() {
					var targetDom = $(".task-common-right-text",false,this);
					var ids = targetDom.getAttribute("data-value").split(",");
					var initDatas = initData(ids);
					selectPeople({
						id : "task-resa",
						initDatas : initDatas,
						callback : function(result){
							var result = JSON.parse(result);
							fillPerson(targetDom, ids, result.orgResult);
						}
					});
				});
				
				// 告知人
				$(".task-person-inform .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-person-inform").on("tap", ".task-box-view-right", function() {
					var targetDom = $(".task-common-right-text",false,this);
					var ids = targetDom.getAttribute("data-value").split(",");
					var initDatas = initData(ids);
					selectPeople({
						id : "task-resa",
						initDatas : initDatas,
						callback : function(result){
							var result = JSON.parse(result);
							fillPerson(targetDom, ids, result.orgResult);
						}
					});
				});
				
				// 任务描述设置为可以编辑
				$("div.task-detail-detail").classList.add("taskdetail-hide");
				$("textarea.task-detail-detail").classList.remove("taskdetail-hide");
				
				// 重要程度
				$(".task-attach-imp .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-attach-imp").on('tap', ".task-box-right", function(e) {
					var label = $(".task-common-right-text",false,this);//.children[0];
					var importantLevel = [{key : "1",name : cmp.i18n("Taskmanage.label.general")}, {key : "2",name : cmp.i18n("Taskmanage.label.important")}, {key : "3",name : cmp.i18n("Taskmanage.label.vimportant")} ];
					cmp.dialog.actionSheet(importantLevel, cmp.i18n("Taskmanage.label.cancel"), function(item) {
						label.setAttribute("data-value", item.key);
						label.innerHTML = item.name;
						label = null
					}, function() {
						label = null
					});
				});
				
				var oldremindStart = $(".task-account-remind-begin .task-common-right-text").getAttribute("data-value"),
				oldremindEnd = $(".task-account-remind-end .task-common-right-text").getAttribute("data-value");
				// 是否里程碑((1代表是，0代表否))|
				$(".task-account-imp .cmp-switch").classList.remove("cmp-disabled");
				cmp(".task-account-imp").on('toggle', "#milestone", function(e) {
					if (this.classList.contains("cmp-active")) {
						//选择为里程碑，联动任务提醒
						this.setAttribute("data-value", "1");
						$("#task-account-remind-detail").style.display = "block";
						if(!$(".task-account-remind .cmp-switch").classList.contains("cmp-active")){
							cmp(".task-account-remind .cmp-switch").switch().toggle();
						}
						var start = $(".task-account-remind-begin .task-common-right-text");
						var end = $(".task-account-remind-end .task-common-right-text");
						if(oldremindStart == -1 && oldremindEnd == -1){
							start.innerHTML = cmp.i18n("Taskmanage.label.10min");
							start.setAttribute("data-value", "10");
							end.innerHTML = cmp.i18n("Taskmanage.label.10min");
							end.setAttribute("data-value", "10");
						}
					} else {
						//选择为里程碑，联动任务提醒
						this.setAttribute("data-value", "0");
						if(oldremindStart == -1 && oldremindEnd == -1){
							$("#task-account-remind-detail").style.display = "none";
							if($(".task-account-remind .cmp-switch").classList.contains("cmp-active")){
								cmp(".task-account-remind .cmp-switch").switch().toggle();
							}
							var start = $(".task-account-remind-begin .task-common-right-text");
							var end = $(".task-account-remind-end .task-common-right-text");
							start.innerHTML = cmp.i18n("Taskmanage.label.none");
							start.setAttribute("data-value", "-1");
							end.innerHTML = cmp.i18n("Taskmanage.label.none");
							end.setAttribute("data-value", "-1");
						}
					}
				});
				
				// 任务提醒
				$(".task-account-remind .cmp-switch").classList.remove("cmp-disabled");
				cmp(".task-account-remind").on('toggle', ".cmp-switch", function(e) {
					if (this.classList.contains("cmp-active")) {
						$("#task-account-remind-detail").style.display = "block";
					} else {
						$("#task-account-remind-detail").style.display = "none";
					}
					var start = $(".task-account-remind-begin .task-common-right-text");
					var end = $(".task-account-remind-end .task-common-right-text");
					start.innerHTML = cmp.i18n("Taskmanage.label.none");
					start.setAttribute("data-value", "-1");
					end.innerHTML = cmp.i18n("Taskmanage.label.none");
					end.setAttribute("data-value", "-1");
					oldremindStart = "-1";
					oldremindEnd = "-1";
				});
				
				// 开始前提醒
				var taskremindPicker = false;
				$(".task-account-remind-begin .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-account-remind-begin").on('tap', ".task-box-right", function(e) {
					var start = $(".task-common-right-text",false,this);//.children[0];
					if(!taskremindPicker){
						taskremindPicker = new cmp.PopPicker();
						var taskremind = [{value:"-1",text:cmp.i18n("Taskmanage.label.none")},{value:"5",text:"5"+cmp.i18n("Taskmanage.message.minute")},{value:"10",text:"10"+cmp.i18n("Taskmanage.message.minute")},{value:"15",text:"15"+cmp.i18n("Taskmanage.message.minute")},{value:"30",text:"30"+cmp.i18n("Taskmanage.message.minute")},{value:"60",text:"1"+cmp.i18n("Taskmanage.message.hour")},{value:"120",text:"2"+cmp.i18n("Taskmanage.message.hour")},{value:"180",text:"3"+cmp.i18n("Taskmanage.message.hour")},{value:"240",text:"4"+cmp.i18n("Taskmanage.message.hour")},{value:"480",text:"8"+cmp.i18n("Taskmanage.message.hour")},{value:"720",text:"0.5"+cmp.i18n("Taskmanage.message.day")},{value:"1440",text:"1"+cmp.i18n("Taskmanage.message.day")},{value:"2880",text:"2"+cmp.i18n("Taskmanage.message.day")},{value:"4320",text:"3"+cmp.i18n("Taskmanage.message.day")},{value:"10080",text:"1"+cmp.i18n("Taskmanage.message.week")}];
						taskremindPicker.setData(taskremind);
					}
					taskremindPicker.defaultValue=start.getAttribute("data-value");
					taskremindPicker.setPickerDefalutValue();
					taskremindPicker.show(function(items) {
						start.innerHTML = items[0].text;
						start.setAttribute("data-value", items[0].value);
						oldremindStart = items[0].value;
					});
				});
				
				// 结束前提醒
				$(".task-account-remind-end .task-common-arrow").classList.remove("taskdetail-hide");
				cmp(".task-account-remind-end").on('tap', ".task-box-right", function(e) {
					var end = $(".task-common-right-text",false,this);
					if(!taskremindPicker){
						taskremindPicker = new cmp.PopPicker();
						var taskremind = [{value:"-1",text:cmp.i18n("Taskmanage.label.none")},{value:"5",text:"5"+cmp.i18n("Taskmanage.message.minute")},{value:"10",text:"10"+cmp.i18n("Taskmanage.message.minute")},{value:"15",text:"15"+cmp.i18n("Taskmanage.message.minute")},{value:"30",text:"30"+cmp.i18n("Taskmanage.message.minute")},{value:"60",text:"1"+cmp.i18n("Taskmanage.message.hour")},{value:"120",text:"2"+cmp.i18n("Taskmanage.message.hour")},{value:"180",text:"3"+cmp.i18n("Taskmanage.message.hour")},{value:"240",text:"4"+cmp.i18n("Taskmanage.message.hour")},{value:"480",text:"8"+cmp.i18n("Taskmanage.message.hour")},{value:"720",text:"0.5"+cmp.i18n("Taskmanage.message.day")},{value:"1440",text:"1"+cmp.i18n("Taskmanage.message.day")},{value:"2880",text:"2"+cmp.i18n("Taskmanage.message.day")},{value:"4320",text:"3"+cmp.i18n("Taskmanage.message.day")},{value:"10080",text:"1"+cmp.i18n("Taskmanage.message.week")}];
						taskremindPicker.setData(taskremind);
					}
					taskremindPicker.defaultValue=end.getAttribute("data-value");
					taskremindPicker.setPickerDefalutValue();
					taskremindPicker.show(function(items) {
						end.innerHTML = items[0].text;
						end.setAttribute("data-value", items[0].value);
						oldremindEnd = items[0].value;
					});
				});
				
				if(isView){
					// 实际开始时间
					$(".task-a-start-time .task-common-arrow").classList.remove("taskdetail-hide");
					cmp(".task-a-start-time").on('tap', ".task-box-right", function(e) {
						var type = "datetime";
						if($(".task-a-time-type .cmp-switch").classList.contains("cmp-active")){
							type = "date";
						}
						showTimePicker(this.children[1],type,function(value){});
					});
					
					// 实际结束时间
					$(".task-a-end-time .task-common-arrow").classList.remove("taskdetail-hide");
					cmp(".task-a-end-time").on('tap', ".task-box-right", function(e) {
						var type = "datetime";
						if($(".task-a-time-type .cmp-switch").classList.contains("cmp-active")){
							type = "date";
						}
						showTimePicker(this.children[1],type,function(value){});
					});
					
					// 是否全天
					$(".task-a-time-type .cmp-switch").classList.remove("cmp-disabled");
					cmp(".task-a-time-type").on('toggle', ".cmp-switch", function(e) {
						var start = $(".task-a-start-time .task-common-right-text");
						var end = $(".task-a-end-time .task-common-right-text");
						if (this.classList.contains("cmp-active")) {
							if(start.innerHTML.length > 0){
								start.innerHTML = start.innerHTML.slice(0, 10);
							}
							if(end.innerHTML.length > 0){
								end.innerHTML = end.innerHTML.slice(0, 10);
							}
						} else {
							if(start.innerHTML.length > 0){
								start.innerHTML = start.innerHTML.slice(0, 10) + " 00:00";
							}
							if(end.innerHTML.length > 0){
								end.innerHTML = end.innerHTML.slice(0, 10) + " 23:59";
							}
						}
					});
				}
			},
			isOverDue:false,
			changeStatusColor:function(statusLabel,finishRate,status,isOverDue){
				//#03b412 已完成、#999  已取消、#ff5900  已超期、正常 #3aadfb
				if(status == 1 || status == 2){
					if(isOverDue){
						statusLabel.style.color= "#ff5900";
						finishRate.style.color= "#ff5900";
					}else{
						statusLabel.style.color= "#3aadfb";
						finishRate.style.color= "#3aadfb";
					}
				}else if(status == 5){
					statusLabel.style.color= "#999";
					finishRate.style.color= "#999";
				}else if(status == 4){
					statusLabel.style.color= "#03b412";
					finishRate.style.color= "#03b412";
				}
			},
			renderAuditColor : function(result){
				var auditStatusDom = $(".task-audit-status .task-common-right-text");
				auditStatusDom.innerHTML = result.auditStatus;
				//渲染顏色
				if(result.auditStatusCode == "0"){
					auditStatusDom.style.color = "#3aadfb";
				}else if(result.auditStatusCode == "1"){
					auditStatusDom.style.color = "#61B109";
				}else{
					auditStatusDom.style.color = "#ff0000";
				}
			},
			/**
			 * 回填数据场景：查看、编辑、附件上传后返回本页面
			 * tips:这个方法只负责回填数据，不负责绑定事件
			 *
			 * @param taskDetail 	任务详情
			 * @param initFeedback 	是否初始化汇报
			 * @param isView 		是否为查看或者编辑任务
			 */
			fillbackData : function(taskDetail, initFeedback, isView) {
				//任务标题
				$("div.task-title-detail").innerText = taskDetail.subject;
				$("textarea.task-title-detail").value = taskDetail.subject;
				taskEditor.source = {};
				if(taskDetail.sourceId){
					taskEditor.source.sourceId = taskDetail.sourceId;
				}
				if(taskDetail.sourceType){
					taskEditor.source.sourceType = taskDetail.sourceType;
				}

				//任务的计划开始时间、计划结束时间回填
				var format = "yyyy-MM-dd HH:mm";
				if (taskDetail.fullTime) {
					format = "yyyy-MM-dd";
					if(!$(".task-p-time-type .cmp-switch").classList.contains("cmp-active")){
						cmp(".task-p-time-type .cmp-switch").switch().toggle();
					}
				}
				$(".task-start-time .task-common-right-text").innerText = new Date(parseInt(taskDetail.plannedStartTime)).taskformat(format);
				$(".task-end-time .task-common-right-text").innerText = new Date(parseInt(taskDetail.plannedEndTime)).taskformat(format);
				
				//任务的汇报信息回填
				var time = new Date().getTime();
				taskEditor.isOverDue = taskDetail.plannedEndTime < time;
				if (initFeedback) {
					var statusLabel = $(".task-status-count .task-common-right-text");
					statusLabel.innerText = taskDetail.statusLabel;
					statusLabel.setAttribute("data-value", taskDetail.status);
					var finishRate = $(".task-status-per .task-common-right-text");
					finishRate.innerText = parseInt(taskDetail.finishRate) + "%";
					finishRate.setAttribute("data-value", parseInt(taskDetail.finishRate));
					taskEditor.changeStatusColor(statusLabel,finishRate,taskDetail.status,taskEditor.isOverDue);
				}
				
				//人员信息回填；并将当前选择的人员放入缓存，便于选择人员的时候排除人员
				var managers = $("#managers");
				managers.setAttribute("data-value", taskDetail.managers.join(","));
				managers.innerText = taskDetail.managerNames.join("、");
				for (var i = 0; i < taskDetail.managers.length; i++) {
					taskEditor.memberCache[taskDetail.managers[i]] = taskDetail.managerNames[i];
				}
				
				var participators = $("#participators");
				participators.setAttribute("data-value", taskDetail.participators.join(","));
				participators.innerText = taskDetail.participatorNames.join("、");
				for (var i = 0; i < taskDetail.participators.length; i++) {
					taskEditor.memberCache[taskDetail.participators[i]] = taskDetail.participatorNames[i];
				}
				
				var inspectors = $("#inspectors");
				inspectors.setAttribute("data-value", taskDetail.inspectors.join(","));
				inspectors.innerText = taskDetail.inspectorNames.join("、");
				for (var i = 0; i < taskDetail.inspectors.length; i++) {
					taskEditor.memberCache[taskDetail.inspectors[i]] = taskDetail.inspectorNames[i];
				}
				
				//审核相关回填
				if(taskDetail.auditors && taskDetail.auditors[0] && taskDetail.auditors[0] != -1){
					$(".task-person-audit").classList.remove("taskdetail-hide");
					$(".task-audit-status").classList.remove("taskdetail-hide");
					var auditorDom = $("#auditor"),auditStatusDom = $(".task-audit-status .task-common-right-text");
					auditorDom.setAttribute("data-value", taskDetail.auditors.join(","));
					auditorDom.innerText = taskDetail.auditorNames.join("、");
					auditStatusDom.innerText = taskDetail.auditStatus;
					//渲染顏色
					if(taskDetail.auditStatusCode == "0"){
						auditStatusDom.style.color = "#3aadfb";
					}else if(taskDetail.auditStatusCode == "1"){
						auditStatusDom.style.color = "#61B109";
					}else{
						auditStatusDom.style.color = "#ff0000";
					}
				}
				
				//任务描述回填
				$("div.task-detail-detail").innerText = taskDetail.content;
				$("textarea.task-detail-detail").value = taskDetail.content;
				
				//重要程度回填
				var imp = $("#importantLevel");
				imp.setAttribute("data-value", taskDetail.importantLevel);
				imp.innerText = taskDetail.importantLevelLabel;
				
				//任务类型回填
				var taskType = $("#taskType");
				if(taskDetail.taskType != undefined){
					taskType.setAttribute("data-value", taskDetail.taskType);
					taskType.innerHTML = taskDetail.taskTypeLabel.escapeHTML();
				}
				
				//是否里程碑回填	cmp-active
				if (taskDetail.milestone == 1) {
					if(!$("#milestone").classList.contains("cmp-active")){
						cmp("#milestone").switch().toggle();
					}
				}
				
				//是否开启任务提醒回填   remindEndTime remindStartTime isremindTime
				if (taskDetail.isremindTime) {
					if(!$(".task-account-remind .cmp-switch").classList.contains("cmp-active")){
						cmp(".task-account-remind .cmp-switch").switch().toggle();
					}
					$("#task-account-remind-detail").style.display = "block";
					
					//任务开始前提醒
					var remindStartTime = $(".task-account-remind-begin .task-common-right-text");
					remindStartTime.setAttribute("data-value", taskDetail.remindStartTime);
					remindStartTime.innerText = taskDetail.remindStartTimeLabel;
					
					//任务结束前提醒
					var remindEndTime = $(".task-account-remind-end .task-common-right-text");
					remindEndTime.setAttribute("data-value", taskDetail.remindEndTime);
					remindEndTime.innerText = taskDetail.remindEndTimeLable;
				}
				
				//查看或者编辑任务时
				if(isView){
					//告知人有下划线
					$(".task-person-inform").classList.add("task-border-bottom");
					//任务的创建人
					$(".task-creater").classList.remove("taskdetail-hide");
					var creater = $("#task-creater");
					creater.innerText = taskDetail.createrName;
					
					//实际开始结束时间
					$(".task-a-time").classList.add("taskdetail-true");
					var actualStartTime = taskDetail.actualStartTime;
					var actualEndTime = taskDetail.actualEndTime;
					var dayFormat = "HH:mm";
					var format = "yyyy-MM-dd HH:mm";
					if(taskDetail.afulltime){
						format = "yyyy-MM-dd";
						if(!$(".task-a-time-type .cmp-switch").classList.contains("cmp-active")){
							cmp(".task-a-time-type .cmp-switch").switch().toggle();
						}
					}
					if(actualStartTime){
						actualStartTime = new Date(parseInt(actualStartTime));
						$(".task-a-start-time .task-common-right-text").innerText = actualStartTime.taskformat(format);
					}
					if(actualEndTime){
						actualEndTime = new Date(parseInt(actualEndTime));
						$(".task-a-end-time .task-common-right-text").innerText = actualEndTime.taskformat(format);
					}
					
					if(taskDetail.sourceName && taskDetail.sourceName != ""){
						$(".task-attach-imp").classList.add("task-border-bottom");
						var taskSourceName = $("#task-source-name");
						taskSourceName.classList.remove("taskdetail-hide");
						var taskSource = $(".task-common-right-text",false,taskSourceName);
						taskSource.innerText = taskDetail.sourceName;
						if(taskDetail.sourceAppType){
							taskSource.setAttribute("data-sourceAppType",taskDetail.sourceAppType);
							taskSource.setAttribute("data-sourceId",taskDetail.sourceId);
							taskSource.setAttribute("data-sourceAffairId",taskDetail.sourceAffairId);
							taskSource.setAttribute("data-sourceFormId",taskDetail.sourceFormId);
							taskSource.setAttribute("data-sourceRightId",taskDetail.sourceRightId);
							taskSource.setAttribute("data-taskId",taskDetail.taskId);
							if( (taskDetail.sourceAppType == 1 || taskDetail.sourceAppType == 6)
									&& typeof taskDetail.sourceId != "undefined" &&  taskDetail.sourceId != "undefined"){
								taskSource.style.color="#00B4FC";
							}else if(taskDetail.sourceAppType == 2
									&& typeof taskDetail.sourceId != "undefined" &&  taskDetail.sourceId != "undefined"
									&& typeof taskDetail.sourceRightId != "undefined" &&  taskDetail.sourceRightId != "undefined"){
								taskSource.style.color="#00B4FC";
								
							}
						}
					}
				}
			},
			/**
			 * 初始化审核相关事件
			 */
			initAuditEvents : function(taskDetail){
				
				/**
				 * 在这里判断审核按钮是否显示
				 */
				if(cmp.platform.CMPShell){
					var member = cmp.member;
					if(member.id == taskDetail.auditors[0] && taskDetail.auditStatusCode == 0){
						taskGlobal.needAudit = true;
						$("#topPopoverA").classList.remove("taskdetail-hide");
					}
					taskGlobal.currentUser = member;
				}else{
					$api.Task.getCurrentUser({}, {}, {
						success : function(ret) {
							if(ret.id == taskDetail.auditors[0] && taskDetail.auditStatusCode == 0){
								taskGlobal.needAudit = true;
								$("#topPopoverA").classList.remove("taskdetail-hide");
							}
							taskGlobal.currentUser = ret;
						},
						error : function(error) {
							var cmpHandled = cmp.errorHandler(error);
							if(!cmpHandled){
								console.log(error);
								cmp.notification.alert(error);
							}
						}
					});
				}
			},
			openAuditBox:function(){
				//审核按钮
				if(!taskGlobal.auditBox){
					taskGlobal.auditBox = new InsBox({
						tag : "task_audit",
						title : cmp.i18n("Taskmanage.label.audit"),
						placeholder : cmp.i18n("Taskmanage.label.auditComment"),
						buttons : [{
							id : "notAccess",
							name : cmp.i18n("Taskmanage.label.disAgree"),
							validate : {
								message : cmp.i18n("Taskmanage.label.auditComment")
							},
							html : '<div class="task-audit-btn-not-access">'+
                				   		'<span>' + cmp.i18n("Taskmanage.label.disAgree") + '</span>'+
            						'</div>',
							fun : function(data){
								var taskInfo = taskGlobal.taskInfo,submitParams = {};
								submitParams.taskId = taskInfo.taskId;
								submitParams.auditor = taskInfo.auditors[0];
								submitParams.auditComment = data.content;
								submitParams.auditStatus = "NotPass";
								$api.Task.audit({},submitParams,{
									success : function(result){
										if(result.data){
											cmp.notification.toast(cmp.i18n("Taskmanage.label.auditSuccess"), "center",2000,1);
											setTimeout(function(){
												taskEditor.cmpBack();
											},1000);
										}
									},
									error : function(error){
										cmp.dialog.loading(false);
										var cmpHandled = cmp.errorHandler(error);
										if(!cmpHandled){
											cmp.notification.toast(cmp.i18n("Taskmanage.message.getpersonfailed"), "center", notificationTimeout);
										}
									}
								});
							}
						},{
							id : "access",
							name : cmp.i18n("Taskmanage.label.agree"),
							html : '<div class="task-audit-btn-access">'+
                				   		'<span>' + cmp.i18n("Taskmanage.label.agree") + '</span>'+
            						'</div>',
							fun : function(data){
								var taskInfo = taskGlobal.taskInfo,submitParams = {};
								submitParams.taskId = taskInfo.taskId;
								submitParams.auditor = taskInfo.auditors[0];
								submitParams.auditComment = data.content;
								submitParams.auditStatus = "Pass";
								$api.Task.audit({},submitParams,{
									success : function(result){
										if(result.data){
											cmp.notification.toast(cmp.i18n("Taskmanage.label.auditSuccess"), "center",2000,1);
											setTimeout(function(){
												taskEditor.cmpBack();
											},1000);
										}
									},
									error : function(error){
										cmp.dialog.loading(false);
										var cmpHandled = cmp.errorHandler(error);
										if(!cmpHandled){
											cmp.notification.toast(cmp.i18n("Taskmanage.message.getpersonfailed"), "center", notificationTimeout);
										}
									}
								});
							}
						}]
					});
				}else{
					taskGlobal.auditBox.open();
				}
			},
			/**
			 * 保存汇报信息
			 */
			saveFeedback : function(data,backfun){
				var submitParams = {};
				var viewEditSave = $(".task-save-btn");
				var canFeedback = viewEditSave.getAttribute("canFeedback");
				if (canFeedback != "false") {
					var taskFeedback = taskEditor.getTaskFeedbackInfo();
					submitParams.status = taskFeedback.status;
					submitParams.finishRate = taskFeedback.finishRate;
					submitParams.taskId = taskGlobal.taskInfo.taskId;
					submitParams.content = data && data.content ? data.content : "";
				}
				$api.Task.saveFeedBack({},submitParams,{
					success : function(result){
						if(result.data){
							//这里统一处理一下修改汇报信息后审核按钮的变化
							if(result.data.auditor == taskGlobal.currentUser.id && result.data.auditStatusCode == 0){
								taskGlobal.needAudit = true;
							}else{
								taskGlobal.needAudit = false;
							}
							backfun(result.data);
						}
					},
					error : function(error){
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							cmp.notification.toast(cmp.i18n("Taskmanage.message.getpersonfailed"), "center", notificationTimeout);
						}
					}
				});
			},
			//返回事件
			cmpBack : function(){
				//触发任务作为底导航时的事件
				fireWebviewEvent({
					isRefresh : true
				});
				//触发从门户打开的事件
	            cmp.webViewListener.fire({
	                type: "refreshPortalData",
	                data: cmp.href.getParam() ? cmp.href.getParam().portalParam : undefined,
	                success: function() {},
	                error: function() {}
	            });
	            //触发从待办打开的事件
	            cmp.webViewListener.fire({
	            	type: "com.seeyon.m3.ListRefresh",
	            	data: {
	            		type: "update",
						appId: "30"
	            	}
	            });
	            cmp.href.back();
			},
			//初始化任务类型下拉列表
			initTaskTypeSelect : function(isNew,taskId){
				$(".task-type .task-common-arrow").classList.remove("taskdetail-hide");
				var dataArray = [];
				$api.Task.findTaskType(isNew,taskId,{}, {
					success : function(ret) {
						if (ret && ret.data && ret.data.taskTypeList) {
							for(var i = 0 ;i<ret.data.taskTypeList.length;i++){
								var p = new Object();
								p.key = ret.data.taskTypeList[i].id;
								p.name = ret.data.taskTypeList[i].typeName.escapeHTML();
								dataArray.push(p);
							}
						}
						if(isNew && dataArray.length>0){
							$("#taskType").setAttribute("data-value", dataArray[0].key);
							$("#taskType").innerHTML = dataArray[0].name;
						}
					},
					error : function(error) {
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							console.log(error);
							cmp.notification.alert(error);
						}
					}
				});
				cmp(".task-type").on('tap', ".task-box-view-right", function(e) {
					var label = $(".task-common-right-text",false,this);
					cmp.dialog.actionSheet(dataArray, cmp.i18n("Taskmanage.label.cancel"), function(item) {
						label.setAttribute("data-value", item.key);
						label.innerHTML = item.name.escapeHTML();
						label = null;
					}, function() {
						label = null;
					});
				});
			}
	};
	
	
	
	//======================================================================================//
	// 		任务催办
	//======================================================================================//
	taskHasten = {
			/**
			 * 催办人员列表模板缓存
			 */
			hastemTpl : "",
			/**
			 * 显示催办弹框
			 */
			showHasten : function() {
				cmp.dialog.loading();
				$("#task-pushing").classList.remove("taskdetail-hide");
				cmp.backbutton();
				cmp.backbutton.push(function(){
					taskHasten.closeHasten();
				});
				
				$(".pushing-list").innerHTML = "";
				$api.Tasks.taskHastenMembers(taskHasten.taskId, {}, {
					success : function(ret) {
						if (ret.data.length > 0) {
							var html = cmp.tpl(taskHasten.hastemTpl, ret.data);
							$(".pushing-list").innerHTML = html;
						}
						cmp.dialog.loading(false);
					},
					error : function(error) {
						cmp.dialog.loading(false);
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							cmp.notification.toast(cmp.i18n("Taskmanage.message.getpersonfailed"), "center", notificationTimeout);
						}
					}
				});
				
			},
			closeHasten:function(){
				$("#task-pushing").classList.add("taskdetail-hide");
				var alc = $("#select-all-check");
				alc.classList.remove("see-icon-success-circle-fill");
				alc.classList.add("see-icon-radio-unchecked");
				$("#hasten-message").value = "";
				cmp.backbutton.pop();
			},
			/**
			 * 当前任务的Id缓存
			 */
			taskId : "-1",
			/**
			 * 初始化催办页面的事件
			 */
			initHastenEvent : function(taskId) {
				//限制输入
				limitInput($("#hasten-message"),85);
				//$("#task-pushing .pushing-list").style.height = (window.innerHeight - $(".pushing-top").clientHeight - 60 ) + "px";
				$("#task-pushing .pushing-list").style.height = (window.innerHeight - 44 - 40 - 60 ) + "px";
				taskHasten.taskId = taskId;
				taskHasten.hastemTpl = $("#task-hasten-tpl").innerHTML;
				cmp("#task-pushing").off("tap", ".hasten-cancel").on("tap", ".hasten-cancel", function() {
					// 隐藏汇报
					taskHasten.closeHasten();
				}).off("tap", ".pushing-list-item").on("tap", ".pushing-list-item", function() {
					// 选人
					var targetdom = $(".task-role-item",false,this);
					if (targetdom.classList.contains("see-icon-success-circle-fill")) {
						targetdom.classList.remove("see-icon-success-circle-fill");
						targetdom.classList.add("see-icon-radio-unchecked");
					} else {
						targetdom.classList.remove("see-icon-radio-unchecked");
						targetdom.classList.add("see-icon-success-circle-fill");
					}
				}).off("tap", ".choose-all").on("tap", ".choose-all", function() {
					
					// 选择全部
					var targetdom = this.children[0];
					var users = $(".task-role-item", true);
					var checkAll = true;
					if (targetdom.classList.contains("see-icon-success-circle-fill")) {
						checkAll = false;
						targetdom.classList.remove("see-icon-success-circle-fill");
						targetdom.classList.add("see-icon-radio-unchecked");
					} else {
						targetdom.classList.remove("see-icon-radio-unchecked");
						targetdom.classList.add("see-icon-success-circle-fill");
					}
					for (var int = 0; int < users.length; int++) {
						var user = users[int];
						if (checkAll) {
							user.classList.remove("see-icon-radio-unchecked");
							user.classList.add("see-icon-success-circle-fill");
						} else {
							user.classList.remove("see-icon-success-circle-fill");
							user.classList.add("see-icon-radio-unchecked");
						}
					}
				}).off("tap", ".pushing-text").on("tap", ".pushing-text", function() {
					
					// 催办动作按钮
					var users = $(".task-role-item.see-icon-success-circle-fill", true);
					if (users.length == 0) {
						cmp.notification.toast(cmp.i18n("Taskmanage.message.leastone"), "center", notificationTimeout);
						return false;
					}
					var userIds = [];
					var userNames = [];
					for (var int = 0; int < users.length; int++) {
						userIds.push(users[int].getAttribute("userId"));
						var userName = $(".pushing-list-item-person-name span",false,users[int].parentElement.parentElement);
						userNames.push("@" + userName.innerText);
					}
					var params = {
							userIds : userIds
					};
					var message = trim($("#hasten-message").value);
					if (message != "") {
						if(message.length > 85){
							cmp.notification.toast(cmp.i18n("Taskmanage.message.hastenmsglimit"), "center", notificationTimeout);
							return false;
						}
						params.message = message;
					}
					if(cmp.Emoji){
						var cemoji = cmp.Emoji();
						if(params.message){
							params.message = cemoji.EmojiToString(params.message);
						}
					}
					params.path = getCommentPath();
					$api.Task.taskHasten(taskHasten.taskId, {}, params, {
						success : function(ret) {
							if (ret.success) {
								cmp.notification.toast(cmp.i18n("Taskmanage.message.hastensuccess"), "center", notificationTimeout, 1);
								taskHasten.closeHasten();
								var alc = $("#select-all-check");
								alc.classList.remove("see-icon-success-circle-fill");
								alc.classList.add("see-icon-radio-unchecked");
								$("#hasten-message").value = "";
								
								//添加评论信息
								var taskCommentVO =
								{
									id:ret.commentId,
									userId:ret.userId,
									userName:ret.userName,
									userImage: (rootIp + ret.userImage),
									enable:true,
									createDate:(new Date().taskformat("yyyy-MM-dd HH:mm")),
									content:(message + userNames.join(", ")).escapeHTML(),
									ctype:-1,
									path:params.path,
									praiseNumber:0,//点赞数
									praiseToComment:false,//是否点赞
									attachments:[],
									children:[]
								};
								var html = cmp.tpl(CommentTpl, [taskCommentVO]);
								var comments = $('#task_commit .task-comment-one-item',true);
								if(comments.length > 0){
									cmp.before(comments[0],html);
								}else{
									$('#task_commit .task-comment-one').innerHTML = html;
								}
							} else {
								cmp.notification.toast(ret.msg, "center", notificationTimeout);
							}
						},
						error : function(error) {
							var cmpHandled = cmp.errorHandler(error);
							if(!cmpHandled){
								cmp.notification.toast(cmp.i18n("Taskmanage.message.hastenfailed"), "center", notificationTimeout);							
							}
						}
					});
				});
			}
			
	};

	
	
	//======================================================================================//
	// 		任务编辑页面使用的常量
	//======================================================================================//
	var notificationTimeout = 1000;
	/** 页面初始化的任务PO缓存key */
	var oldCacheKey = "old_task_detail_cache";
	/** 新建页面缓存key */
	var newCacheKey = "new_task_detail";
	/** 编辑页面的缓存key */
	var editCacheKey = "edit_Task_Detail_Cache";
	/**
	 * 限制用户的输入
	 * @param $dom
	 * @param length
	 * @param isNoInput	是否为非input
	 */
	function limitInput($dom,length){
		$dom.addEventListener("input", function(event){
			var num = this.value.length;
			if(num > length){
				this.value = this.value.substr(0,length);
				this.blur();
				cmp.notification.toast(cmp.i18n("Taskmanage.message.notover",[length]), "center");
			}
		});
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
	Date.prototype.taskformat = function(fmt) {
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
	};
	/**
	 * 将日期字符串（yyyy-MM-dd）转换为Date对象，
	 * 
	 * @param source 字符串
	 */
	Date.parseDate = function(source) {
		var sdate = source.split("-");
		return new Date(sdate[0], sdate[1] - 1, sdate[2]);
	};
	/**
	 * 将日期时间字符串（yyyy-MM-dd HH:mm:ss）转换为Date对象
	 * 
	 * @param source 字符串
	 */
	Date.parseDateTime = function(source) {
		var sdatetime = source.split(" ");
		var sdate = sdatetime[0].split("-");
		var stime = sdatetime[1].split(":");
		return new Date(sdate[0], sdate[1] - 1, sdate[2], stime[0], stime[1], stime[2]);
	};
	
})(cmp,window,SeeyonApi,function(selector, queryAll , target ) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
});
