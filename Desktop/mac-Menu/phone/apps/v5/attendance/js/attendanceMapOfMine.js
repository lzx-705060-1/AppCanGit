(function(){
	//列表對象
	var listView;
	//地圖聯動列表
	var amapLinkList;
	//滑动组件
	var slideComponent;
	//计数器
	var attendCounter;
	
	cmp.ready(function(){
		//綁定返回事件
		bindBackEvent();
		//i18n
		initI18n();
		//加載頁面數據
		initPageData();
		//綁定頁面事件
		bindPageEvents();
	});
	var initI18n = function(){
		document.title = cmp.i18n("Attendance.label.attendMap");
	}
	var bindPageEvents = function(){
		//初始化滑动组件相关
		initSide();
		//详细页面跳转
		cmp(".amap-list-scroll").on("tap",".navigate",function(e){
			var liDom = this.parentNode;
			while(liDom.tagName.toLowerCase() !== "li"){
				liDom = liDom.parentNode;
			}
			var attendanceId = liDom.id;
			cmp.href.next(_attendancePath + "/html/attendanceDetail.html",{attendanceId : attendanceId});
		});
		
		cmp(".amap-list-scroll").on("tap",".modify",function(e){
			//签到时间
			var signTime = this.getAttribute("signTime");
			//签到人员
			var memberId = this.getAttribute("memberId");
			//最新签到id
			var attendanceId = this.parentNode.parentNode.parentNode.id;
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
	}
	var bindBackEvent = function(){
		var backfun = function(){
			var params = cmp.href.getParam();
			var signTime = params.signTime;
			cmp.href.back(undefined,{data : {signTime : signTime}});
		}
//		cmp("body").on("tap","#backBtn",function(){
//			backfun();
//		});
		cmp.backbutton();
        cmp.backbutton.push(backfun);
	}
	var initPageData = function(){
		var params = cmp.href.getParam(),
		startTime = attendanceCommon.getFirstTimeOfDay(params.signTime),
		endTime = attendanceCommon.getLastTimeOfDay(params.signTime);
		cmp.extend(params,{
			startTime : startTime,
			endTime : endTime
		});
		initListView(params);
	}
	var initListView = function(params){
		listView = cmp.listView(".amap-list-scroll", {
			config: {
	            pageSize: 20,
	            params:params || {},
	            dataFunc: getData,
	            renderFunc: renderData
	        },
	        up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: cmp.i18n("Attendance.message.noMore")
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
					//签到次数
					if(!attendCounter) attendCounter = result.total;
					options.success(result);
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					options.error();
				}
			});
		}
		function renderData(result,isRefresh){
	        var table = document.body.querySelector('.cmp-table-view');
	        var liTpl = document.getElementById("pending_li_tpl").innerHTML;
	        
	        //删除listview底部div
	    	var listViewFooter = document.querySelector(".amap-list-scroll .cmp-pull-bottom-pocket");
	    	if(listViewFooter) listViewFooter.parentNode.removeChild(listViewFooter);
	    	
	    	var tplData = {
	    		rowNum : attendCounter,
	    		data : result
	    	}
	        
	        var html = cmp.tpl(liTpl,tplData);
	        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
	            table.innerHTML = html;
	        } else {
	            table.innerHTML = table.innerHTML + html;
	        }
	        
	        //人員信息
	        var userImg = document.querySelector(".foot-container .user-container .user-logo .img");
	        userImg.src = attendanceCommon.getCmpRoot() + result[0].ownerImgPath;
	        var userName = document.querySelector(".foot-container .user-container .user-info .name");
	        userName.innerHTML = result[0].ownerName;
	        var userDate = document.querySelector(".foot-container .user-container .user-info .date"); 
	        userDate.innerHTML = attendanceCommon.getCurrentByPattern(result[0].signTime,"MM-dd");
	        
	        //地圖聯動列表
		    amapLinkList = new AmapComponent("amapListContainer",{
		    	type : "amapLinkList",
		    	amapLinkList : {
		    		listView : listView || this,
		    		data : result,
		    		counter : attendCounter,
		    		dataMapping : {
	    				id : "id",
						longitude : "longitude",
						latitude : "latitude"
		    		}
		    	}
		    });
		    
		    attendCounter = attendCounter - result.length;
		}
	}
	var initSide = function(){
		var userContainer = document.querySelector(".user-container");
		var listViewCtx = document.querySelector(".amap-list-scroll");
		var listViewH;
		//加载滑动组件
		slideComponent = new AttendanceSlide("#slide-container",{
			backFunc : function(){
				if(this.slidePosition == "top"){
					listViewH = this.windowH - this.handler.offsetHeight - userContainer.offsetHeight;
				}else if(this.slidePosition == "middle"){
					listViewH = this.windowH - this.topH - this.handler.offsetHeight - userContainer.offsetHeight;
				}
				listViewCtx.style.height = listViewH + "px";
				listView.refresh();
			}
		});
		//初始化listview高度，刷新listview
		listViewH = slideComponent.windowH - slideComponent.topH - slideComponent.handler.offsetHeight - userContainer.offsetHeight;
		listViewCtx.style.height = listViewH + "px";
		listView.refresh();
	}
})();
