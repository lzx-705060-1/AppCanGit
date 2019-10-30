(function(){
	/**
	 * 全局变量
	 */
	var myAttendance_Iterator = "";//我的签到日期迭代器
	var mentioned_Iterator = "";//at我的签到日期迭代
	var isSearch = false;
	var amapList;
	var pageParam = {};
	var queryCondition;
	var myAtt_ListView,mentioned_listView,authorize_listView;
	
	cmp.ready(function(){
		//返回按钮
		bindBackEvent();
		//i18n
		initI18n();
		//初始页面参数
		initParam();
		//初始化dom
		initPageDom();
		//加载页面数据
		initPageData(undefined,queryCondition?queryCondition.searchParams:undefined);
		//初始化查询头部
		initStorageQuery();
		//绑定页面事件
		bindDomEvent();
	});
	var initStorageQuery = function(){
		//初始加载查询头部
		if(queryCondition){
			isSearch = true;
        	holdQueryHeader({
        		title : queryCondition.text,
        		type : queryCondition.type,
        		value : queryCondition.value
        	});
		}
	}
	var initI18n = function(){
		document.title = cmp.i18n("Attendance.label.distribution");
	}
	var initParam = function(){
		var currentTab = cmp.storage.get("currentTab",true);
		if(currentTab){
			pageParam.currentTab = currentTab;
			cmp.storage.delete("currentTab",true);
		}
		queryCondition = cmp.storage.get("queryCondition",true);
		if(queryCondition){
			queryCondition = cmp.parseJSON(queryCondition);
			cmp.storage.delete("queryCondition",true);
		}
	}
	var initPageDom = function(){
		var cmp_content=document.querySelector('.cmp-content');
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var windowH= window.innerHeight;
	    var headerH,footerH;
	    headerH = 0;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    if(cmp_content){
	        cmp_content.style.height = windowH - headerH - footerH + "px";
	    }
	    
	    //是否显示授权我的tab页
	    $s.Attendance.checkAuthScope({},{
			success : function(result){
				if(result.code == 0){
					result = result.data;
				}else{
					cmp.notification.alert(result.msg,function(){
						cmp.href.back();
					},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					return;
				}
				if(result && result.hasAuthScope){
					document.querySelector("#authorizeAttendanceLink").style.display = "table-cell";
				}
			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
			}
		});
	}
	var bindBackEvent = function(){
		var backFunc = function(){
			if(isSearch){
				isSearch = false;
				hideQueryHeader();
				initPageData(getCurrentTab());
				return;
			}
//			cmp.href.go(_attendancePath + "/html/attendanceIndex.html",{},{ animated: true, direction: "right" });
			cmp.href.back();
		}
//		cmp("body").on("tap","#backBtn",function(){
//			backFunc();
//		});
		cmp.backbutton();
        cmp.backbutton.push(backFunc);
	}
	var bindDomEvent = function(){
		/**
		 * 我的签到-签到地图点击事件
		 */
		cmp("#myAttendance").on("tap",".attendance-map-handler",function(e){
			var signTime = this.attributes["signTime"].nodeValue;
			cmp.href.next(_attendancePath + "/html/attendanceMapOfMine.html",{signTime : signTime});
		});
		
		/**
		 * 授权我的分布地图点击
		 */
		cmp("#authorizeAttendance").on("tap",".attendance-map-handler",function(){
			var signTime = this.attributes["signTime"].nodeValue;
			//保存当前页面参数（当前tab页）
			saveParam();
			cmp.href.next(_attendancePath + "/html/attendanceMapOfAuth.html",{signTime : signTime});
		});
		
		/**
		 * 查询
		 */
		cmp.event.click(document.querySelector("#myAttendanceSearch"),function(){
			initSearch();
		});
		cmp.event.click(document.querySelector("#authorizeSearch"),function(){
			initSearch();
		});
		cmp.event.click(document.querySelector("#mentionedSearch"),function(){
			initSearch();
		});
		/**
		 * 列表点击跳转到签到详情页面
		 */
		cmp("body").on("tap","a.cmp-navigate-right,.cmp-table-view-cell .content",function(e){
			if(e.target.className != 'modify'){
				var attendanceId = this.id;
				//保存当前页面参数（当前tab页）
				saveParam();
				cmp.href.next(_attendancePath + "/html/attendanceDetail.html",{attendanceId : attendanceId});
			}
		});
		/**
		 * 授权我的列表跳转
		 */
		cmp("#authorizeAttendance").on("tap",".cmp-table-view-cell .auth-content",function(){
			var memberId = this.attributes["item-id"].nodeValue;
			var signTime = this.attributes["item-date"].nodeValue;
			//保存当前页面参数（当前tab页）
			saveParam();
			cmp.href.next(_attendancePath + "/html/attendanceMapOfMine.html",{memberId : memberId,signTime : signTime});
		});
		/**
		 * 更新次数穿透
		 */
		cmp("body").on("tap","a.cmp-navigate-right .modify",function(e){
			e.stopPropagation();
			//签到时间
			var signTime = this.getAttribute("signTime");
			//签到人员
			var memberId = this.getAttribute("memberId");
			//最新签到id
			var attendanceId = this.parentNode.parentNode.id;
			//头像路径
			var imgPath = this.getAttribute("imgPath");
			//所属人名称
			var ownerName = this.getAttribute("ownerName");
			//签到类型
			var type = this.getAttribute("type");
			var param = {
				memberId : memberId,
				signTime : signTime,
				attendanceId : attendanceId,
				imgPath : imgPath,
				ownerName : ownerName,
				type : type
			}
			cmp.href.next(_attendancePath + "/html/attendanceHistory.html",param);
		});
		/**
		 * 底部tab切换
		 * TODO
		 */
		cmp("body").on("tap","#myAttendanceLink",function(){
			hideQueryHeader();
			initMyAttendanceListView();
		});
		cmp("body").on("tap","#authorizeAttendanceLink",function(){
			hideQueryHeader();
			initAuthorizeAttendance();
		});
		cmp("body").on("tap","#mentionedAttendanceLink",function(){
			hideQueryHeader();
			initMentionedAttendance();
		});
		
		/**
		 * 查询头部点击事件
		 */
		cmp.event.click(document.querySelector("#toSearch"),function(){
			hideQueryHeader();
			initSearch(queryCondition);
		});
		
		/**
		 * 查询头部取消按钮
		 */
		cmp.event.click(document.querySelector("#cancelSearch"),function(){
			isSearch = false;
			hideQueryHeader();
			initPageData(getCurrentTab());
		});
	}
	var initSearch = function(initParam){
		var currentTab = getCurrentTab();
		var items;
		if(currentTab == "myAttendance") {
			items = [{
				type: "date",
				condition: "signTime",
				text: cmp.i18n("Attendance.label.attendTime")
			}];
		}else if(currentTab == "authorizeAttendance"){
			items = [{
				type: "text",
				condition: "memberName",
				text: cmp.i18n("Attendance.label.attender")
			},{
				type: "date_day",
				condition: "signDate",
				text: cmp.i18n("Attendance.label.attendDate")
			}];
		} else {
			items = [{
				type: "text",
				condition: "memberName",
				text: cmp.i18n("Attendance.label.attender")
			},{
				type: "date",
				condition: "signTime",
				text: cmp.i18n("Attendance.label.attendTime")
			}];
		}
		cmp.search.init({
			id:currentTab,
	        model:{
	            name:currentTab,
	            id:"36"
	        },
	        param : null,
	        items : items,
	        parameter : initParam,
	        TimeQueryControl : true,
	        closeCallback : function(){
	        },
	        callback : function(result){
	        	var searchItem = result.item;
	        	var searchKey = result.searchKey;
	        	queryCondition = {
	        		condition : searchItem.condition,
	        		text : searchItem.text,
	        		type : searchItem.type,
	        		value : result.searchKey
	        	}
	        	var searchParams = {};
	        	if(searchItem.condition == "signTime"){
	        		if(searchKey[0]){
	        			searchParams.startTime = attendanceCommon.getFirstTimeOfDay(searchKey[0]);
	        		}
	        		if(searchKey[1]){
	        			searchParams.endTime = attendanceCommon.getLastTimeOfDay(searchKey[1]);
	        		}
	        	}else if(searchItem.condition == "memberName"){
	        		searchParams = {
	        			memberName : searchKey[0]
	        		}
	        	}else if(searchItem.condition == "signDate"){
	        		searchParams = {
	        			signDate : searchKey[0]
	        		}
	        	}
	        	queryCondition.searchParams = searchParams;
	        	initPageData(currentTab,searchParams);
	        	isSearch = true;
	        	holdQueryHeader({
	        		title : searchItem.text,
	        		type : searchItem.type,
	        		value : searchKey
	        	});
	        }
		});
	}
	
	/**
	 * 隐藏底部tab页签
	 */
	var hideFooterTab = function(){
		var footer = document.querySelector("#attFooterTab");
		var cmp_content=document.querySelector('.cmp-content');
		var contentH = cmp_content.clientHeight;
		
		footer.classList.add("slide-down");
		footer.classList.remove("slide-up");
		document.querySelector("#myAttendanceTab").style.height = contentH + 50 + "px";
		document.querySelector("#authorizeAttendanceTab").style.height = contentH + 50 + "px";
		document.querySelector("#mentionedAttendanceTab").style.height = contentH + 50 + "px";
		
		if(myAtt_ListView) myAtt_ListView.refresh();
		if(mentioned_listView) mentioned_listView.refresh();
	}
	
	/**
	 * 显示底部tab页签
	 */
	var showFooterTab = function(){
		var footer = document.querySelector("#attFooterTab");
		var cmp_content=document.querySelector('.cmp-content');
		var contentH = cmp_content.clientHeight;
		
		footer.classList.add("slide-up");
		footer.classList.remove("slide-down");
		document.querySelector("#myAttendanceTab").style.height = contentH + "px";
		document.querySelector("#authorizeAttendanceTab").style.height = contentH + "px";
		document.querySelector("#mentionedAttendanceTab").style.height = contentH + "px";
		
		if(myAtt_ListView) myAtt_ListView.refresh();
		if(mentioned_listView) mentioned_listView.refresh();
	}
	
	/**
	 * 保留查询头部
	 */
	var holdQueryHeader = function(param){
		//1.显示查询头部容器
		document.querySelector("#reSearch").style.display = "block";
		document.querySelector("#myAttendance .foot-search-container").style.display = "none";
		document.querySelector("#authorizeAttendance .foot-search-container").style.display = "none";
		document.querySelector("#mentionedAttendance .foot-search-container").style.display = "none";
		document.querySelector("#reSearch").classList.add("search-header");
		//2.回填查询条件
		document.querySelector("#reSearchTile").innerHTML = param.title;
		if(param.type == "text" || param.type == "date_day"){
			document.querySelector("#searchText").style.display = "block";
			document.querySelector("#searchDate").style.display = "none";
			
			document.querySelector("#searchTextValue").value = param.value[0] || "";
		}else{
			document.querySelector("#searchDate").style.display = "block";
			document.querySelector("#searchText").style.display = "none";
			
			document.querySelector("#searchDateBeg").value = param.value[0] || "";
			document.querySelector("#searchDateEnd").value = param.value[1] || "";
		}
	}
	/**
	 * 隐藏查询头部
	 */
	var hideQueryHeader = function(){
		document.querySelector("#reSearch").style.display = "none";
		document.querySelector("#myAttendance .foot-search-container").style.display = "block";
		document.querySelector("#authorizeAttendance .foot-search-container").style.display = "block";
		document.querySelector("#mentionedAttendance .foot-search-container").style.display = "block";
		document.querySelector("#reSearch").classList.remove("search-header");
	}
	
	var initPageData = function(currentTab,params){
		if(!currentTab) currentTab = pageParam.currentTab;
		//加载当前listview
		switch(currentTab) {
			case "myAttendance":
				activeTab("myAttendanceTab");
				activeTab("myAttendanceLink");
				initMyAttendanceListView(params);
				break;
			case "authorizeAttendance":
				activeTab("authorizeAttendanceTab");
				activeTab("authorizeAttendanceLink");
				initAuthorizeAttendance(params);
				break;
			case "mentionedAttendance":
				activeTab("mentionedAttendanceTab");
				activeTab("mentionedAttendanceLink");
				initMentionedAttendance(params);
				break;
			default:
				activeTab("myAttendanceTab");
				activeTab("myAttendanceLink");
				initMyAttendanceListView(params);
				break;
		}
	}
	/**
	 * 加载我的签到listview
	 * @param {Object} params
	 */
	var initMyAttendanceListView = function(params){
		myAtt_ListView = cmp.listView("#myAttendance", {
			config: {
	            pageSize: 20,
	            params: params || {},
	            dataFunc: getData,
	            isClear: true,
	            crumbsID: params ? cmp.buildUUID() : null,
	            renderFunc: renderData
	        },
	        down: {
	            contentdown: cmp.i18n("Attendance.label.pullDown"),
	            contentover: cmp.i18n("Attendance.label.undo"),
	            contentrefresh: cmp.i18n("Attendance.label.refresh")
	        },
	        up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: ''
	        }
	    });
		function getData(param,options){
			$s.Attendance.myAttendance({},param,{
				success : function(result){
					if(result.success){
						result = result.data;
					}else{
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						return;
					}
					options.success(result);
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					options.error();
				}
			});
		}
		function renderData(result,isRefresh){
	    	var table = document.querySelector("#myAttendance .cmp-table-view");
	    	if(!table){
	    		var ulTpl = '<div class="foot-container">'+
			                    '<div class="foot-table-cell cmp-generating">'+
			                        '<ul class="cmp-table-view"></ul>'+
			                    '</div>'+
			                '</div>';
			    document.querySelector("#myAttendance .cmp-scroll").innerHTML = ulTpl;
			    table = document.querySelector("#myAttendance .cmp-table-view");
	    	}
	    	if(isRefresh){
	    		myAttendance_Iterator = "";
	    	}
			var html = sortData4MyAttendance(result);
	        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
	            table.innerHTML = html;
	        } else {
	            table.innerHTML = table.innerHTML + html;
	        }
	        //渲染完成后更新样式
	        updateDom();
	        //只有pc端签到的情况不显示签到地图
			var typeDoms = document.querySelectorAll("#myAttendance li.time-map");
			cmp.each(typeDoms,function(index,element){
				var sibling = element;
				var showMap = false;
				while(sibling){
					if(!sibling.querySelector(".icon-checkin-computer")){
						showMap = true;
						break;
					}
					sibling = sibling.nextSibling;
					if(sibling && sibling.classList.contains("time-map")){
						break;
					}
				}
				if(!showMap) element.querySelector(".attendance-map-handler").style.display = "none";
			});
		}
	}
	/**
	 * 加载授权我的列表
	 * @param {Object} params
	 */
	var initAuthorizeAttendance = function(params){
		authorize_listView = cmp.listView("#authorizeAttendance", {
			config: {
	            pageSize: 20,
	            params: params || {},
	            dataFunc: getData,
	            isClear:true,
	            crumbsID: params ? cmp.buildUUID() : null,
	            renderFunc: renderData
	        },
	        down: {
	            contentdown: cmp.i18n("Attendance.label.pullDown"),
	            contentover: cmp.i18n("Attendance.label.undo"),
	            contentrefresh: cmp.i18n("Attendance.label.refresh")
	        },
	        up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: cmp.i18n("Attendance.message.noMore")
	        }
	    });
	    function getData(param,options){
		    $s.Attendance.getAuthorize({},param,{
				success : function(result){
					if(result.success){
						result = result.data;
					}else{
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						return;
					}
					options.success(result);
					
					var table = document.querySelector("#authorizeAttendance .cmp-table-view");
					if(table.querySelectorAll("li").length == 0){
						document.querySelector("#authorizeAttendance .title").style.display = "none";
					}
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					options.error();
				}
			});
	    }
	    function renderData(result,isRefresh){
	    	var table = document.querySelector("#authorizeAttendance .cmp-table-view");
	    	if(!table){
	    		var ulTpl = '<div class="foot-container">'+
			                    '<div class="foot-table-cell cmp-generating">'+
			                        '<ul class="cmp-table-view"></ul>'+
			                    '</div>'+
			                '</div>';
			    document.querySelector("#authorizeAttendance .cmp-scroll").innerHTML = ulTpl;
			    table = document.querySelector("#authorizeAttendance .cmp-table-view");
	    	}
	    	
	    	//回填头部信息
	    	document.querySelector("#authorizeAttendance .title").style.display = "block";
	    	document.querySelector("#authorizeAttendance .auth-list-title").innerHTML = attendanceCommon.getCurrentDate(result[0].sign_time);
	    	document.querySelector("#authorizeAttendance .attendance-map-handler").attributes["signtime"].nodeValue = result[0].sign_time;
	    	
	    	var tpl = document.querySelector("#authorizeList").innerHTML;
	    	var html = cmp.tpl(tpl,result);
	    	if (isRefresh) {
	            table.innerHTML = html;
	        } else {
	            table.innerHTML = table.innerHTML + html;
	        }
	    }
	}
	/**
	 * 加载at我的列表
	 * @param {Object} params
	 */
	var initMentionedAttendance = function(params){
		mentioned_listView = cmp.listView("#mentionedAttendance", {
			config: {
	            pageSize: 20,
	            params: params || {},
	            dataFunc: getData,
	            isClear:true,
	            crumbsID: params ? cmp.buildUUID() : null,
	            renderFunc: renderData
	        },
	        down: {
	            contentdown: cmp.i18n("Attendance.label.pullDown"),
	            contentover: cmp.i18n("Attendance.label.undo"),
	            contentrefresh: cmp.i18n("Attendance.label.refresh")
	        },
	        up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: cmp.i18n("Attendance.message.noMore")
	        }
	    });
		function getData(param,options){
			$s.Attendance.mentionedAttendance({},param,{
				success : function(result){
					if(result.success){
						result = result.data;
					}else{
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						return;
					}
					options.success(result);
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					options.error();
				}
			});
		}
		function renderData(result,isRefresh){
	    	var table = document.querySelector("#mentionedAttendance .cmp-table-view");
	    	if(!table){
	    		var ulTpl = '<div class="foot-table-cell">'+
			                    '<ul class="cmp-table-view cmp-generating"></ul>'+
			                '</div>';
			    document.querySelector("#mentionedAttendance .cmp-scroll").innerHTML = ulTpl;
			    table = document.querySelector("#mentionedAttendance .cmp-table-view");
	    	}
	    	if(isRefresh) mentioned_Iterator = "";
			var html = sortData4MentionedAttendance(result);
	        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
	            table.innerHTML = html;
	        } else {
	            table.innerHTML = table.innerHTML + html;
	        }
	        //渲染完成后更新样式
	        updateDom();
	        document.querySelector("#mentionedAttendance ul").lastChild.classList.add("after-hidden");
		}
	}
	/**
	 * 我的签到列表模板加载函数
	 * @param {Object} data
	 */
	var sortData4MyAttendance = function(data){
		var tpl = "";
		for(var i = 0;i<data.length;i++){
			var item = data[i];
			var pattern = item.signTime.substring(0,10);
			//签到类型相关
			var attendanceType = item.type != 3 ? item.type == 1 ? cmp.i18n("Attendance.label.attendance") : cmp.i18n("Attendance.label.offWork") : cmp.i18n("Attendance.label.businessTrip");
			var attendanceType_class = item.type != 3 ? "signin" : "legwork";
			//图片和语音
			var mediaHtml = "";
			if(item.recordNum && parseInt(item.recordNum) > 0){
				mediaHtml += '<span class="checkinicon icon-checkin-voice"></span>';
			}
			if(item.imgNum && parseInt(item.imgNum) > 0){
				mediaHtml += '<span class="checkinicon icon-checkin-img"></span>';
			}
			if(item.remark){
				mediaHtml += '<span class="checkinicon icon-checkin-text-file"></span>';
			}
			
			item.sign = item.sign ? item.sign : "";
			
			//签到图标
			var attendIcon = item.source == "1" ? "icon-checkin-computer" : "icon-checkin-adress";
			if(pattern != myAttendance_Iterator){
				myAttendance_Iterator = pattern;
	            tpl +=	'<li class="cmp-table-view-cell cmp-collapse-content time-map">'+
		            		'<div class="title">'+
	                            '<span class="">' + attendanceCommon.getCurrentDate(item.signTime) + '</span>'+
	                            '<span class="cmp-pull-right attendance-map-handler" signTime=' + myAttendance_Iterator + '>' + cmp.i18n("Attendance.label.attendMap") + '</span>'+
	                        '</div>'+
		                    '<a id=' + item.id + ' class="cmp-navigate-right">'+
		                        '<div class="time cmp-pull-left">'+
		                            '<span>' + attendanceCommon.getCurrentTime(item.signTime) + '</span>'+
		                        '</div>'+
		                        '<div class="address">'+
		                            '<div class="mark"></div>'+
		                            '<div class="info cmp-ellipsis">'+
		                                '<div class="sign-label ' + attendanceType_class + '"><span>' + attendanceType + '</span></div>'+
		                                '<span class="checkinicon ' + attendIcon + '"></span>'+
		                                '<span>' + item.sign + '</span>'+
		                            '</div>'+
		                            '<p class="file-icon left">' + mediaHtml + '</p>';
		                            if(item.modifyNum && item.modifyNum > 0 ){
		                            	tpl += '<span class="modify" signTime="'+item.signTime+'" ownerName="'+item.ownerName+'" type="'+item.type+'" memberId="'+item.ownerId+'" imgPath = "'+item.ownerImgPath+'">'+cmp.i18n('Attendance.label.modifyNum',item.modifyNum)+'</span>';
		                            }
		                       tpl += '</div>'+
		                    '</a>'+
		                '</li>';
			}else{
        		tpl +=  '<li class="cmp-table-view-cell">'+
                            '<a id=' + item.id + ' class="cmp-navigate-right">'+
                                '<div class="time cmp-pull-left">'+
                                    '<span>' + attendanceCommon.getCurrentTime(item.signTime) + '</span>'+
                                '</div>'+
                                '<div class="address">'+
                                    '<div class="mark"></div>'+
                                    '<div class="info cmp-ellipsis">'+
                                        '<div class="sign-label ' + attendanceType_class + '"><span>' + attendanceType + '</span></div>'+
                                        '<span class="checkinicon ' + attendIcon + '"></span>'+
                                        '<span>' + item.sign + '</span>'+
                                    '</div>'+
                                    '<p class="file-icon left">' + mediaHtml + '</p>';
                                    if(item.modifyNum && item.modifyNum > 0 ){
                                    	tpl += '<span class="modify" signTime="'+item.signTime+'" ownerName="'+item.ownerName+'" type="'+item.type+'" ownerId="'+item.ownerId+'" imgPath = "'+item.ownerImgPath+'">'+cmp.i18n('Attendance.label.modifyNum',item.modifyNum)+'</span>';
                                    }
                                    tpl += '</div>'+
                            '</a>'+
                        '</li>';
			}
		}
		return tpl;
	}
	/**
	 * at我的签到列表模板加载函数
	 * @param {Object} data
	 */
	var sortData4MentionedAttendance = function(data){
		var tpl = "";
		for(var i = 0;i<data.length;i++){
			var item = data[i];
			var pattern = item.signTime.substring(0,10);
			//签到类型相关
			var attendanceType = item.type != 3 ? item.type == 1 ? cmp.i18n("Attendance.label.attendance") : cmp.i18n("Attendance.label.offWork") : cmp.i18n("Attendance.label.businessTrip");
			var attendanceType_class = item.type != 3 ? "signin" : "legwork";
			//图片和语音
			var mediaHtml = "";
			if(item.recordNum && parseInt(item.recordNum) > 0){
				mediaHtml += '<span class="checkinicon icon-checkin-voice"></span>';
			}
			if(item.imgNum && parseInt(item.imgNum) > 0){
				mediaHtml += '<span class="checkinicon icon-checkin-img"></span>';
			}
			if(item.remark){
				mediaHtml += '<span class="checkinicon icon-checkin-text-file"></span>';
			}
			//签到图标
			var attendIcon = item.source == "1" ? "icon-checkin-computer" : "icon-checkin-adress";
			
			item.sign = item.sign ? item.sign : "";
			
			if(pattern != mentioned_Iterator){
				mentioned_Iterator = pattern;
	            tpl +=	'<li class="cmp-table-view-cell cmp-media">'+
		            		'<div class="title">'+
	                            '<span class="">' + attendanceCommon.getCurrentDate(item.signTime) + '</span>'+
	                        '</div>'+
		                    '<div id=' + item.id + ' class="content">'+
		                        '<div class="cmp-media-object cmp-pull-left">'+
		                        	'<img class="" src="' + attendanceCommon.getCmpRoot() + item.ownerImgPath + '">'+
		                            '<p class="name cmp-ellipsis">' + item.ownerName + '</p>'+
		                        '</div>'+
		                        '<div class="cmp-media-body cmp-after-line">'+
		                            '<span class="time">' + attendanceCommon.getCurrentTime(item.signTime) + '</span>'+
		                            '<small class="sign-label ' + attendanceType_class + '">' + attendanceType + '</small>'+
		                            '<div class="info cmp-ellipsis">'+
		                                '<span class="checkinicon ' + attendIcon + '"></span>'+
		                                '<span>' + item.sign + '</span>'+
		                            '</div>' + 
		                            '<p class="file-icon">' + mediaHtml + '</p>'+
		                        '</div>'+
		                    '</div>'+
		                '</li>';
			}else{
        		tpl +=  '<li class="cmp-table-view-cell">'+
		                    '<div id=' + item.id + ' class="content">'+
		                        '<div class="cmp-media-object cmp-pull-left">'+
		                        	'<img class="" src="' + attendanceCommon.getCmpRoot() + item.ownerImgPath + '">'+
		                            '<p class="name cmp-ellipsis">' + item.ownerName + '</p>'+
		                        '</div>'+
		                        '<div class="cmp-media-body cmp-after-line">'+
		                            '<span class="time">' + attendanceCommon.getCurrentTime(item.signTime) + '</span>'+
		                            '<small class="sign-label ' + attendanceType_class + '">' + attendanceType + '</small>'+
		                            '<div class="info cmp-ellipsis">'+
		                                '<span class="checkinicon ' + attendIcon + '"></span>'+
		                                '<span>' + item.sign + '</span>'+
		                            '</div>' +
		                            '<p class="file-icon">' + mediaHtml + '</p>'+
		                        '</div>'+
		                    '</div>'+
                        '</li>';
			}
		}
		return tpl;
	}
	var updateDom = function(){
		//清除listView前面线条
		var time_map_list =  document.querySelectorAll(".cmp-table-view-cell.time-map");
		cmp.each(time_map_list,function(index,element){
			var prev = element.previousSibling;
			if(prev && !prev.classList.contains("hide-line")) prev.classList.add("hide-line");
		});
	}
	/**
	 * 获取当前tab页面
	 * 返回listviewId
	 */
	var getCurrentTab = function(){
		var currentTab;
		if(document.getElementById("myAttendanceTab").classList.contains("cmp-active")){
			currentTab = "myAttendance";
		}else if(document.getElementById("authorizeAttendanceTab").classList.contains("cmp-active")){
			currentTab = "authorizeAttendance";
		}else{
			currentTab = "mentionedAttendance";
		}
		return currentTab;
	}
	/**
	 * 保存页面参数到sessionStorage
	 */
	var saveParam = function(){
		cmp.storage.save("currentTab",getCurrentTab(),true);
		if(queryCondition){
			cmp.storage.save("queryCondition",cmp.toJSON(queryCondition),true);
		}
	}
	/**
	 * 选择tab样式变化
	 */
	var activeTab = function(tabId){
		var self = document.getElementById(tabId);
		var siblings = self.parentNode.children;
		cmp.each(siblings,function(index,item){
			if(item === self){
				item.classList.add("cmp-active");
			}else{
				item.classList.remove("cmp-active");
			}
		});
	}
})()
