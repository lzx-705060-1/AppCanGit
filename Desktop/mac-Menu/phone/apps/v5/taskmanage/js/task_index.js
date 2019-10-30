var items=[{key:"1",name:cmp.i18n("Taskmanage.label.unstart"),color:"#3aadfb"},{key:"2",name:cmp.i18n("Taskmanage.label.inprogress"),color:"#3aadfb"},{key:"4",name:cmp.i18n("Taskmanage.label.finished"),color:"#03b412"},{key:"5",name:cmp.i18n("Taskmanage.label.canceled"),color:"#a0a0a0"},{key:"6",name:cmp.i18n("Taskmanage.label.overdue"),color:"#ff5900"}];
var perHtml = "<div><input class='finishrate_text' style='width: 85%;height: 24px;' type='text' placeholder='" + cmp.i18n("Taskmanage.label.inputpercent") + "'/><span style='font-size: 18px;color: #333;margin-left: 10px;'>%</span></div>";
;~(function($){
	var taskListTpl = $("#task_index_tpl").innerHTML;
	var taskListArea = $('.cmp-table-view');
	var taskAuditListView;
	var insBox = {};
	var empty = {weekunfinished:"-",unfinished:"-",overdue:"-",all:"-"};
	//是否从底导航打开
	var isFromM3NavBar = window.location.href.match('m3from=navbar');
	/**
	 *从后端读取数据
	 */
	function refreshStastic(callback){
		$s.Tasks.countTasks({}, queryParams, {
            success : function(result){
            	cmp.dialog.loading(false); 
                if(result){
                	changeCount(result);
                }else{
                	cmp.notification.toast(result.msg, "center");
                    return;
                }
            },
            error : function(e){
            	cmp.dialog.loading(false); 
            	taskCommon.dealAjaxError(e);
            }
        });
	}
	function changeCount(result){
		$("#weekunfinished-num").innerHTML = result.weekunfinished;
    	$("#unfinished-num").innerHTML = result.unfinished;
    	$("#overdue-num").innerHTML = result.overdue;
    	$("#all-num").innerHTML = result.all;
	}
	/**
	 * 初始化litView
	 */
	function initListView(){
		cmp.listView("#taskList", {
			config: {
	            pageSize: 10,
	            params: queryParams,
	            dataFunc: getTaskData,
	            isClear: true,
	            renderFunc: function(result,isRefresh){
	        		var html = cmp.tpl(taskListTpl, result);
	        		if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
	        			taskListArea.innerHTML = html;
	                } else {
	                	cmp.append(taskListArea,html);
	                }
	        	}
	        },
	        down: {
	            contentdown: cmp.i18n("Taskmanage.label.pulltorefresh"),
	            contentover: cmp.i18n("Taskmanage.label.loosentorefresh"),
	            contentrefresh: cmp.i18n("Taskmanage.label.refreshing")
	        },
	        up: {
                contentdown: cmp.i18n("Taskmanage.label.uptomore"),
                contentrefresh: cmp.i18n("Taskmanage.label.refreshing"),
                contentnomore: ''
	        }
	    }); 
	}
	
	/**
	 * 初始化我审核的列表listview
	 */
	var initAuditListView = function(){
		if(taskAuditListView){
			taskAuditListView.refreshInitData(false);
			return;
		}
		taskAuditListView = cmp.listView("#taskAuditList", {
			config: {
	            pageSize: 10,
	            params: queryParams,
	            dataFunc: getTaskData,
	            isClear: true,
	            renderFunc: function(result,isRefresh){
					var html = cmp.tpl(document.querySelector("#task_audit_tpl").innerHTML, result);
	        		if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
	        			document.querySelector("#taskAuditList .cmp-table-view").innerHTML = html;
	                } else {
	                	cmp.append(document.querySelector("#taskAuditList .cmp-table-view"),html);
	                }
	        	}
	        },
	        down: {
	            contentdown: cmp.i18n("Taskmanage.label.pulltorefresh"),
	            contentover: cmp.i18n("Taskmanage.label.loosentorefresh"),
	            contentrefresh: cmp.i18n("Taskmanage.label.refreshing")
	        },
	        up: {
                contentdown: cmp.i18n("Taskmanage.label.uptomore"),
                contentrefresh: cmp.i18n("Taskmanage.label.refreshing"),
                contentnomore: ''
	        }
	    });
	}
	
	var refreshAuditStastic = function(){
		$s.Tasks.countTasks({}, queryParams, {
            success : function(result){
				$("#auditing-num").innerHTML = result.auditingCount;
				$("#auiting-all-num").innerHTML = result.auditAllCount;
				cmp.dialog.loading(false);
            },
            error : function(e){
            	cmp.dialog.loading(false); 
            	taskCommon.dealAjaxError(e);
            }
        });
	}
	
	/**
	 * 加载获取任务列表数据
	 */
	var getTaskData = function(params,options){
		$s.Tasks.findTasks({},params,{
            success : function(result){
            	//手动计算是否分页,如果当前获取的数据小于每页数量,表示已到最后一页
            	if(result.fipInfo.data == null || result.fipInfo.data.length < params["pageSize"]){
    				result.fipInfo.total = params["pageSize"]*params["pageNo"];
    			}else{
    				result.fipInfo.total = params["pageSize"]*params["pageNo"] + 1;
    			}
            	if(!result.canCreate){
            		$("#task_new").style.display = "none";
            	}
                if(result.success){
                	result = result.fipInfo;
                }else{
                	cmp.notification.toast(result.msg, "center");
                    return;
                }
                options.success(result);
            },
            error : function(e){
                options.error(e);
                taskCommon.dealAjaxError(e);
            }
        });
	}
	/**
	 * 任务进度操作列
	 */
	var getStatus = function(){
		var statusItems = [];
		var itemObj = {};
		itemObj.key = "unstart";
		itemObj.name = cmp.i18n("Taskmanage.label.unstart");
		statusItems.push(itemObj);
		
		itemObj = {};
		itemObj.key = "starting";
		itemObj.name = cmp.i18n("Taskmanage.label.inprogress");
		statusItems.push(itemObj);
		
		itemObj = {};
		itemObj.key = "finished";
		itemObj.name = cmp.i18n("Taskmanage.label.finished");
		statusItems.push(itemObj);
		
		itemObj = {};
		itemObj.key = "cancle";
		itemObj.name = cmp.i18n("Taskmanage.label.canceled");
		statusItems.push(itemObj);
		
		return statusItems;
	}
	/**
	 * 新增任务汇报
	 */
	var saveTaskfeedback = function(taskId,params,callback){
		$s.Task.taskFeedback(taskId,{},params,{
	        success : function(result){
	            if(!result.success || result.success == "false"){
	            	cmp.notification.toast(result.msg, "center");
	                return;
	            }else if(typeof callback == 'function'){
            		//回调
            		callback(result.data);
	            }
	        },
	        error : function(e){
	        	taskCommon.dealAjaxError(e);
	        }
	    })
	};
	/**
	 * 绑定事件
	 */
	function bindTabEvent(){
		
		//切换状态
		cmp("#my_task").on('tap', ".task-status-tab", function(e) {
			if(!this.classList.contains("task-top-content-choose")){
				cmp.dialog.loading();
				changeCount(empty);
	        	var children = this.parentNode.children;
	            for(var i = 0;i < children.length;i++){
	                var temp = children[i];
	                if(temp.classList.contains("task-top-content-choose")){
	                    temp.classList.remove("task-top-content-choose");
	                }
	            }
	            this.classList.add("task-top-content-choose");           
	            queryParams.status = this.getAttribute("id");
	            refreshStastic();
	            cmp.listView("#taskList").refreshInitData(false);
	        }
	    });
	    
	    //审核tab页面切换
	    cmp("#auditing-container").on("tap",".task-status-tab",function(){
	    	if(!this.classList.contains("task-top-content-choose")){
	    		cmp.dialog.loading();
	    		document.querySelector("#auditing-container .task-status-tab.task-top-content-choose").classList.remove("task-top-content-choose");
	    		this.classList.add("task-top-content-choose");
	    		queryParams.auditStatus = this.getAttribute("data-status");
	    		
	    		refreshAuditStastic();
	    		initAuditListView();
	    	}
	    })
		
		//切换listtype
	    cmp("#contentAndWfTags").on('tap',".cmp-control-item",function(){
	    	if(this.classList.contains("cmp-active")) return;
	    	if(this.id == "TaskAudit"){
	    		/**
	    		 * 审核数据加载
	    		 */
	    		cmp.dialog.loading();
	            queryParams.listType = this.getAttribute("id");
	            queryParams.auditStatus = 0;
	            refreshAuditStastic();
	    		initAuditListView();
	    		/**
	    		 * 手动控制dom样式
	    		 */
				document.querySelector("#contentAndWfTags a.cmp-active").classList.remove("cmp-active");
	            this.classList.add("cmp-active");
	            
	            document.querySelector("#my_task").classList.remove("cmp-active");
	            document.querySelector("#auditing-container").classList.add("cmp-active");
	            
	            document.querySelector("#auditing-container-pending").classList.add("task-top-content-choose");
	            document.querySelector("#auditing-container-all").classList.remove("task-top-content-choose");
	    	}else{
	    		document.querySelector("#my_task").classList.add("cmp-active");
	            document.querySelector("#auditing-container").classList.remove("cmp-active");
	    		
	    		cmp.dialog.loading();
	    		changeCount(empty);
	    		var children = this.parentNode.children;
	            for(var i = 0;i < children.length;i++){
	                var temp = children[i];
	                if(temp.classList.contains("cmp-active")){
	                    temp.classList.remove("cmp-active");
	                }
	            }
	            this.classList.add("cmp-active");
	            if($("#my_task .task-top-content-choose")) $("#my_task .task-top-content-choose").classList.remove("task-top-content-choose");
	            $("#weekunfinished").classList.add("task-top-content-choose");
	            queryParams.listType = this.getAttribute("id");
	            queryParams.status = "weekunfinished";
	            refreshStastic();
	            cmp.listView("#taskList").refreshInitData(false);
	        }
	    });
	    
	    //新建任务
	    cmp(".th-wapper").on('tap', "#task_new", function(e) {
	    	var options = {};
			if(isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
	    	saveTabIndexCache();
	    	cmp.storage.delete(taskSearchConCacheKey,true);//删除搜索
	        cmp.href.next(_taskmanagePath+"/html/taskEditor.html?date="+(new Date().getTime()),queryParams,options);
	    });
	    
	    //搜索
        document.querySelector('#task-search').addEventListener('click',function(e){
            e.stopPropagation();
            e.preventDefault();
            showSearch();
        },false);
	    
	    cmp("header").off("tap", "#cancelSearch").on("tap", "#cancelSearch", function(){
	    	document.querySelector("#reSearch").style.display = "none";
	    	document.querySelector("header").classList.remove("search-header");
	    	
	    	if(getActiveTabId() == 'TaskAudit'){
			    cmp.dialog.loading();
			    queryParams.searchParams = {};
	    		queryCondition = null;
	            refreshAuditStastic();
	    		initAuditListView();
	    		return;
	    	}
	    	queryParams.searchParams = {};
	    	queryCondition = null;
	    	cmp.dialog.loading();
			changeCount(empty);
			refreshStastic();
			cmp.listView("#taskList").refreshInitData(false);
	    	
	    }).off("tap", "#toSearch").on("tap", "#toSearch", function() {
	    	document.querySelector("#reSearch").style.display = "none";
	    	document.querySelector("header").classList.remove("search-header");
	    	showSearch();
	    });
	    
	    /**
	     * 打开搜索页面
	     */
	    function showSearch() {	    	
	    	cmp.search.init({
	    		id : '#task-search',
	    		model : {
	    			name : 'taskmanage', 
	    			id : '30'
	    		},
	    		parameter: queryCondition,
	    		TimeNow : true,
	    		items : (function(){
	    			var items;
    				items = [{
	    				type : 'text', condition : 'subject', text : cmp.i18n('Taskmanage.label.title')
	    			}, {
	    				type : 'date', condition : 'timeParagraph', text : cmp.i18n('Taskmanage.label.timeParagraph')
	    			}, {
	    				type : 'text', condition : 'roleType_1', text : cmp.i18n('Taskmanage.label.manager')
	    			}];
	    			return items;
	    		})(),
	    		closeCallback: function(){
	    	    	if (queryCondition) {
	    	    		queryParams.searchParams = {};
	    	    		queryCondition = null;
	    	    		cmp.dialog.loading();
	    				changeCount(empty);
	    				refreshStastic();
	    				cmp.listView("#taskList").refreshInitData(false);
	    				//回填查询框
	    				renderQueryHeader();
	    	    	}
	    		},
	    		callback : function(result) {
	    			var searchItem = result.item, searchKey = result.searchKey, searchParams = {};
	    			// 记录查询值用于下次查询回填
	    			queryCondition = {
    	        		condition : searchItem.condition,
    	        		text : searchItem.text,
    	        		type : searchItem.type,
    	        		value : searchItem.type == 'text' ? result.searchKey[0] : result.searchKey
	    	        }
	    			// 获取查询参数
	    			if (result.item.condition == 'subject') {
	    				searchParams.queryType = 'subject';
	    				searchParams.value = searchKey[0];
	    			} else if (result.item.condition == 'timeParagraph') {
	    				searchParams.queryType = 'timeParagraph';
	    				searchParams.startDate = searchKey[0];
	    				searchParams.endDate = searchKey[1];
	    			} else if (result.item.condition == 'roleType_1') {
	    				searchParams.queryType = 'roleType';
	    				searchParams.roleType = '1';
	    				searchParams.value = searchKey[0];
	    			}
	    			queryParams.searchParams = searchParams;
	    			
	    			if(getActiveTabId() == 'TaskAudit'){
	    				cmp.dialog.loading();
			            refreshAuditStastic();
			    		initAuditListView();
	    			}else{
	    				// 重新获取统计及列表数据
		    			cmp.dialog.loading();
	    				changeCount(empty);
	    				refreshStastic();
	    				cmp.listView("#taskList").refreshInitData(false);
	    			}
	    			//回填查询框
	    			renderQueryHeader();
	    		}
	    	});
	    }
	    
	    //listView上的事件
	    cmp("#taskList").on("tap",".task-doing",function(e){//任务穿透
	    	if(e.target == this.querySelector(".task-checkbox") 
	    			|| e.target == this.querySelector(".task-checkbox .see-icon-v5-common-pull-down")){
	    		return false;
	    	}
	    			
	    	if(this.classList.contains('task-disable'))
	    		return;
	    
	    	var options = {};
			if(isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
	    	saveTabIndexCache();
	    	var taskId = this.getAttribute("taskId");
	    	cmp.href.next(_taskmanagePath+"/html/taskEditor.html?date="+(new Date().getTime()),{"taskId":taskId},options);
	    }).on("tap",".task-checkbox",function(e){
	    	var statusItems = getStatus();
	    	var _this = this;
	    	cmp.dialog.actionSheet(statusItems, cmp.i18n("Taskmanage.label.cancel"), function(item) {
	    		var parentNode = _this.parentNode.parentNode;
	    		var taskId = parentNode.getAttribute("taskId");
	    		var rateNode = parentNode.querySelector(".task-detail-content-per");
	    		var textNode = parentNode.querySelector(".task-detail-content-duration");
	    		var timeNode = parentNode.querySelector(".task-detail-content-time");
	    		var topItem = parentNode.parentNode.querySelector(".task-item div");
	    		var overtime = textNode.getAttribute("overtime");
	    		//是否所有任务Tab
	    		var isAll = document.querySelector("#all").classList.contains("task-top-content-choose");
	    		var params = {};
				if (item.key == "unstart") {
					params.status = items[0].key;
					saveTaskfeedback(taskId,params,function(){
						/**
						 * 1.当前已超期状态修改成未开始,依然是已超期
						 * 2.非超期状态,判断结束时间,如果是超期,改变颜色和显示状态
						 */
						parentNode.querySelector(".task-detail-content-per").innerHTML = "0%";
						textNode.innerHTML = items[0].name;
						rateNode.style.color = items[0].color;
						topItem.classList.remove(topItem.classList);
						topItem.classList.add("task-item-doing");
						if(overtime == 'true'){
							//已超期
							rateNode.style.color = items[4].color;
							timeNode.style.background = items[4].color;
							timeNode.style.color = "white";
							topItem.classList.remove(topItem.classList);
							topItem.classList.add("task-item-limit");
						}
						
					    /**
						 * 所有列表更新了任务状态后要更新任务数量和列表信息
						 */
						if(isAll){
							TaskList.refreshStastic();
							TaskList.initListView();
						}
					});
				} else if (item.key == "starting") {
					var perHtml = "<div><input class='finishrate_text' style='width: 85%;height: 24px;' type='text' placeholder='" + cmp.i18n("Taskmanage.message.inputnumber") + "'/><span style='font-size: 18px;color: #333;margin-left: 10px;'>%</span></div>";
					setTimeout(function(){
						cmp.notification.confirm(perHtml, function (index,callbackObj) {
		                    if (index == 1) {
		                    	var finishrate_text = $(".finishrate_text").value;
		                    	var text = parseInt(finishrate_text);
		                    	if(text != finishrate_text || (text == finishrate_text && (text < 0 || text > 100))){
		                    		//完成率检测
		                    		cmp.notification.toast(cmp.i18n("Taskmanage.message.inputnumber"),"top");
		                    		return;
		                    	}
		                    	params.status = items[1].key;
		                    	if(text == "100"){
		                    		//完成率为100,状态变为已完成
		                    		params.status = items[2].key;
		                    		if(insBox.finishBox)
		        						insBox.finishBox.destroy();
		                    		
									insBox.finishBox = new InsBox({
										tag : "task_finish",
										title : cmp.i18n("Taskmanage.label.explain"),
										placeholder : cmp.i18n("Taskmanage.label.explainFinish"),
										buttons : [{
											id : 'submit',
											name : cmp.i18n("Taskmanage.label.submit"),
											fun : function(data){
												params.status = items[2].key;
												params.finishrate_text = "100";
												params.content = data.content;
												saveTaskfeedback(taskId,params,function(result){
													/**
													 * 显示已完成状态,修改颜色
													 */
							                		parentNode.querySelector(".task-detail-content-per").innerHTML = "100%";
							                		timeNode.style.background = "";
							                		timeNode.style.color = "#999";
							                		rateNode.style.color = items[2].color;
							                		textNode.innerHTML = result.taskProgressDisplay;
							                		topItem.classList.remove(topItem.classList);
							                		topItem.classList.add("task-item-done");
							                		
							                		TaskList.refreshStastic();
													TaskList.initListView();
							                	});
											}
										}]
									});
									callbackObj.closeFunc();
									return;
	                    		}else if(text == "0"){
	                    			//完成率为0,状态变为未开始
	                    			params.status = items[0].key;
	                    		}else{
	                    			params.finishrate_text = text;
	                    		}
		                    	saveTaskfeedback(taskId,params,function(result){
		                    		/**
		    						 * 1.当前已超期状态修改成未开始,依然是已超期
		    						 * 2.非超期状态,判断结束时间,如果是超期,改变颜色和显示状态
		    						 * 3.完成率为100%,则是已完成
		    						 * 4.完成率为0%,则是未开始
		    						 */
		                    		parentNode.querySelector(".task-detail-content-per").innerHTML = text + "%";
		                    		if(text == "100"){
		                    			rateNode.style.color = items[2].color;
		                    			timeNode.style.background = "";
		                    			timeNode.style.color = "#999";
		    							textNode.innerHTML = result.taskProgressDisplay;
		    							topItem.classList.remove(topItem.classList);
		    							topItem.classList.add("task-item-done");
		                    		}else if(text == "0"){
	    								textNode.innerHTML = result.taskProgressDisplay;
		    							timeNode.style.background = "";
		    							timeNode.style.color = "#999";
		    							rateNode.style.color = items[0].color;
		    							topItem.classList.remove(topItem.classList);
		    							topItem.classList.add("task-item-doing");
		    							if(overtime == 'true'){
			    							//已超期
			                    			rateNode.style.color = items[4].color;
			    							//结束时间
			    							timeNode.style.background = items[4].color;
			    							timeNode.style.color = "white";
			    							topItem.classList.remove(topItem.classList);
			    							topItem.classList.add("task-item-limit");
		    							}
		    						}else{
		    							textNode.innerHTML = result.taskProgressDisplay;
		    							timeNode.style.background = "";
		    							timeNode.style.color = "#999";
		    							rateNode.style.color = items[1].color;
		    							topItem.classList.remove(topItem.classList);
		    							topItem.classList.add("task-item-doing");
		    							if(overtime == 'true'){
			    							//已超期
			                    			rateNode.style.color = items[4].color;
			    							//结束时间
			    							timeNode.style.background = items[4].color;
			    							timeNode.style.color = "white";
			    							topItem.classList.remove(topItem.classList);
			    							topItem.classList.add("task-item-limit");
		    							}
		    						}
		    						/**
		    						 * 所有列表更新了任务状态后要更新任务数量和列表信息
		    						 */
		    						if(isAll){
		    							TaskList.refreshStastic();
										TaskList.initListView();
		    						}
		                    	});
		                    }
							callbackObj.closeFunc();
		                },cmp.i18n("Taskmanage.message.updatepercentage"),null,4,true);
		                //头部固定
					},500);
				} else if (item.key == "finished") {
					if(insBox.finishBox)
						insBox.finishBox.destroy();
					
					insBox.finishBox = new InsBox({
						tag : "task_finish",
						title : cmp.i18n("Taskmanage.label.explain"),
						placeholder : cmp.i18n("Taskmanage.label.explainFinish"),
						buttons : [{
							id : 'submit',
							name : cmp.i18n("Taskmanage.label.submit"),
							fun : function(data){
								params.status = items[2].key;
								params.finishrate_text = "100";
								params.content = data.content;
								saveTaskfeedback(taskId,params,function(result){
									/**
									 * 显示已完成状态,修改颜色
									 */
			                		parentNode.querySelector(".task-detail-content-per").innerHTML = "100%";
			                		timeNode.style.background = "";
			                		timeNode.style.color = "#999";
			                		rateNode.style.color = items[2].color;
			                		textNode.innerHTML = result.taskProgressDisplay;
			                		topItem.classList.remove(topItem.classList);
			                		topItem.classList.add("task-item-done");
			                		
			                		TaskList.refreshStastic();
									TaskList.initListView();
			                	});
							}
						}]
					});
				} else if (item.key == "cancle") {
					if(insBox.cancelBox)
						insBox.cancelBox.destroy();
					
					insBox.cancelBox = new InsBox({
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
								params.status = items[3].key;
								params.content = data.content;
								saveTaskfeedback(taskId,params,function(result){
									/**
									 * 显示已取消状态,修改颜色
									 */
			                		textNode.innerHTML = result.taskProgressDisplay;
			                		timeNode.style.background = "";
			                		timeNode.style.color = "#999";
			                		rateNode.style.color = items[3].color;
			                		topItem.classList.remove(topItem.classList);
			                		topItem.classList.add("task-item-aborded");
			                		
			                		TaskList.refreshStastic();
									TaskList.initListView();
			                	});
							}
						}]
					});
				}
			});
	    });
	    //审核列表
	    cmp("#taskAuditList").on("tap",".task-doing",function(e){//任务穿透
	    	if(e.target == this.querySelector(".task-checkbox") 
	    			|| e.target == this.querySelector(".task-checkbox .see-icon-v5-common-pull-down")){
	    		return false;
	    	}
	    	var options = {};
			if(isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
	    	saveTabIndexCache();
	    	var taskId = this.getAttribute("taskId");
	    	cmp.href.next(_taskmanagePath+"/html/taskEditor.html?date="+(new Date().getTime()),{"taskId":taskId},options);
	    }).on("tap",".task-checkbox",function(e){
	    	var paramNode = this.parentNode.parentNode,taskId = paramNode.getAttribute("taskid"),auditor = paramNode.getAttribute("auditor");
	    	var statusItems = [{
	    		key : "pass",
	    		name : cmp.i18n("Taskmanage.label.agree")
	    	},
	    	{
	    		key : "notPass",
	    		name : "<span style='color:red;'>" + cmp.i18n("Taskmanage.label.disAgree") + "</div>"
	    	}];
			cmp.dialog.actionSheet(statusItems,cmp.i18n("Taskmanage.label.cancel"), function(item){
				if(item.key == "pass"){
					if(!insBox.accessBox){
						insBox.accessBox = new InsBox({
							tag : "access",
							title : cmp.i18n("Taskmanage.label.audit"),
							placeholder : cmp.i18n("Taskmanage.label.agreeComment"),
							buttons :[{
								id : "access",
								name : cmp.i18n("Taskmanage.label.submit"),
								fun : function(data){
									var submitParams = {};
									submitParams.taskId = taskId;
									submitParams.auditor = auditor;
									submitParams.auditComment = data.content;
									submitParams.auditStatus = "Pass";
									
									$s.Task.audit({},submitParams,{
										success : function(result){
											if(result.data){
												refreshAuditStastic();
								    			initAuditListView();
												cmp.notification.toast(cmp.i18n("Taskmanage.label.auditSuccess"), "center",2000,1);
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
						insBox.accessBox.open();
					}
				}else if(item.key == "notPass"){
					if(!insBox.notAccessBos){
						insBox.notAccessBos = new InsBox({
							tag : "notAccess",
							title : cmp.i18n("Taskmanage.label.audit"),
							placeholder : cmp.i18n("Taskmanage.label.disagreeComment"),
							buttons :[{
								id : "notAccess",
								name : cmp.i18n("Taskmanage.label.submit"),
								validate : {
									message : cmp.i18n("Taskmanage.label.disagreeComment")
								},
								fun : function(data){
									var submitParams = {};
									submitParams.taskId = taskId;
									submitParams.auditor = auditor;
									submitParams.auditComment = data.content;
									submitParams.auditStatus = "NotPass";
									
									$s.Task.audit({},submitParams,{
										success : function(result){
											if(result.data){
												refreshAuditStastic();
								    			initAuditListView();
												cmp.notification.toast(cmp.i18n("Taskmanage.label.auditSuccess"), "center",2000,1);
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
						insBox.notAccessBos.open();
					}
				}
			});
	    });
	}
	
	var getActiveTabId = function(){
		var activeTab = document.querySelector("#contentAndWfTags a.cmp-active");
		return activeTab.id;
	}
	
	var renderQueryHeader = function(){
		if (queryCondition) {
			$("#searchDom").style.display = 'none';
            if (queryCondition.type == "text") {
                $("#searchPlus input").value = queryCondition.value || "";
            } else {
                $("#searchPlus input").value = (queryCondition.value[0] || "") + " - " + (queryCondition.value[1] || "");
            }
		}else{
			$("#searchPlus input").value = '';
			$("#searchDom").style.display = 'block';
		}
	}
	
	window.TaskList = {
		initListView : initListView,
		bindTabEvent : bindTabEvent,
		refreshStastic : refreshStastic,
		refreshAuditStastic : refreshAuditStastic,
		initAuditListView : initAuditListView,
		renderQueryHeader : renderQueryHeader
	};
})(function(selector, queryAll , target ) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
});


function $(selector, queryAll , target) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
}