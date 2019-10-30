(function(){
	cmp.ready(function(){
		//返回按钮
		backBtnFun();
		//页面计算
		initDom();
		//加载数据
		initData();
		//绑定事件
		bindEvents();
	});
	var backBtnFun = function(){
//		cmp("body").on("tap","#backBtn",function(){
//			cmp.href.back();
//		});
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	var initDom = function(){
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
	}
	var initData = function(){
		//初始化listView
		cmp.listView("#listContainer", {
			config: {
	            pageSize: 20,
	            params: {},
	            dataFunc: getData,
	            isClear: true,
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
			$s.Attendance.findSettings(-1,param,{
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
	    	var table = document.querySelector("#listContainer .cmp-table-view");
	    	var tpl = document.getElementById("pending_li_tpl").innerHTML;
	    	var html = cmp.tpl(tpl, result);
	        if (isRefresh) {
	            table.innerHTML = html;
	        } else {
	            table.innerHTML = table.innerHTML + html;
	        }
	        cmp.i18n.detect();
		}
	}
	var bindEvents = function(){
		//新建按钮
		document.querySelector("#newBtn").addEventListener("click",function(){
			cmp.href.next(attendancePath + "/html/attendanceSettingEdit.html");
		});
		//列表点击
		cmp("#listContainer").on("tap",".cmp-table-view-cell",function(){
			cmp.href.next(attendancePath + "/html/attendanceSettingEdit.html",{id : this.id});
		});
		
		//删除
		cmp("#listContainer").on("tap",".list-delete",function(){
			var id = this.parentNode.parentNode.id;
			cmp.notification.confirm(cmp.i18n("Attendance.message.comfirmDelete"),function(index){
				if(index == 1){
			        $s.Attendance.removeSetting(id,{},{
		        		success : function(result){
			                if(result.success){
			                	cmp.notification.toast(cmp.i18n("Attendance.message.deleteSuccess"), "center",1000,1);
			                	initData();
							}else{
								cmp.notification.alert(result.msg,function(){
									cmp.href.back();
								},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
								return;
							}
		            	},
			            error : function(e){
							attendanceCommon.dealAjaxError(e);
						}
		        	});
				}
			});
		});
	}
})();
