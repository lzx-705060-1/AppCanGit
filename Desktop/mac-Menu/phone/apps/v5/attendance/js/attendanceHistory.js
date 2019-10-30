(function(global){
	/*
	 * 全局变量
	 */
	var currentUser;//当前用户
	var attendCounter;//计数器
	
	
	cmp.ready(function(){
		//绑定返回事件
		bindBackEvent();
		//國際化
		initI18n();
		//初始化页面布局(高度计算)
		initPageLayout();
		//初始化数据(日期，打卡记录等)
		initPageData();
	});
	var initI18n = function(){
		document.title = cmp.i18n("Attendance.modify.title");
	}
	var initPageData = function(){
		//加载打卡记录，签到次数
		loadAttendanceHistoryList();
		//绑定事件
		bindEventDom();
	}
	
	var bindEventDom = function(){
		cmp("body").on("tap",".index-clockin-content .newAttendance",function(e){
			var attendanceId = this.id;
			cmp.href.next(_attendancePath + "/html/attendanceDetail.html",{attendanceId : attendanceId});
		});
	}
	
	var loadAttendanceHistoryList = function(){
		var param = cmp.href.getParam();
		document.querySelector(".user-head img").src = attendanceCommon.getCmpRoot() + param.imgPath;
//		var d = new Date(param.signTime);
		document.querySelector(".user-name label").innerHTML = attendanceCommon.getCurrentByPattern(param.signTime,'MM-dd');
		document.querySelector(".user-name p").innerHTML = param.ownerName;
		
		cmp.listView("#scroll",{
            config: {
                pageSize: 20,
                params: cmp.href.getParam(),
                dataFunc: getData,
                renderFunc: renderData
            },
            up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: ''
            }
       });
	}
    var getData = function(param,options){
		$s.Attendance.findAttendanceHistory({},param,{
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
    var renderData = function(result, isRefresh){
    	var tpl = document.getElementById("pending_li_tpl").innerHTML;
    	var table = document.body.querySelector('.cmp-table-view');
    	//删除listview底部div
    	var listViewFooter = document.querySelector("#scroll .cmp-pull-bottom-pocket");
    	if(listViewFooter) listViewFooter.parentNode.removeChild(listViewFooter);
    	
		var tplData = {
    		rowNum : attendCounter,
    		data : result
    	}
    	attendCounter = attendCounter - result.length;
    	
        var html = cmp.tpl(tpl, tplData);
        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
            table.innerHTML = html;
        } else {
            table.innerHTML = table.innerHTML + html;
        }
        cmp.i18n.detect();
    }
    
	var bindBackEvent = function(){
//		cmp("body").on("tap","#backBtn",function(){
//			cmp.href.back();
//		});
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	
	var initPageLayout = function(){
	    //中间大主容器计算高度
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
	    //首页listView容器高度
	    var index_container=document.querySelector('#index-container');
	    if(index_container){
	        var index_action_container=document.querySelector('.index-action-container');
	        var index_listView=index_action_container.querySelector('.index-listView');
	        var index_listView_content=index_listView.querySelector('.index-listView-content');
	        var user_date = index_container.querySelector('.user-date');
			
			var contentHeight = (windowH - headerH - footerH) * 0.7;
	        //中间按钮主容器计算高度
	        index_action_container.style.height= contentHeight + "px";
			index_listView.style.height = contentHeight - 10 + "px";
			index_listView_content.style.height = index_listView.offsetHeight +"px";
	    }
	}
})(this);
