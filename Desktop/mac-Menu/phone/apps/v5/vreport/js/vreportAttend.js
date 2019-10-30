(function(){
	var reportQuery;
	var scroller;
	var pageState;
	
	cmp.ready(function(){
		//返回事件
		initBack();
		//初始化参数
		initParam();
		//初始化dom
		initDom();
		//初始化数据
		initData();
		//事件
		events();
	});
	
	var initBack = function(){
		cmp.backbutton();
        cmp.backbutton.push(function(){
        	cmp.storage.delete("VREPORT_PAGE_STATE",true);
        	cmp.href.back();
        });
	}
	
	var initParam = function(){
		pageState = cmp.storage.get("VREPORT_PAGE_STATE",true);
		if(pageState){
			cmp.storage.delete("VREPORT_PAGE_STATE",true);
			pageState = cmp.parseJSON(pageState);
		}
	}	
	
	var initDom = function(){
		var vreportHeader = document.querySelector(".vreport-header");
		var windowH= window.innerHeight;
		var vreportHeaderH = vreportHeader ? vreportHeader.offsetHeight : 0;
		
		var listContainer = document.querySelector(".list-container");
		var vreportReadList = document.querySelector("#vreportAttendList");
		vreportReadList.style.height = (windowH - vreportHeaderH) + "px";
		listContainer.style.height = (windowH - vreportHeaderH) + "px";
	}
	
	var initData = function(){
		//渲染列表
		renderList(vreportCommon.getAttendList());
		//渲染上一次的页面状态
		renderPageState();
	}
	var renderList = function(data){
		if(!data || data.length == 0){
			document.querySelector(".common-list-empty").classList.remove("cmp-hidden");
		}else{
			document.querySelector(".common-list-empty").classList.add("cmp-hidden");
		}
		var tpl = vreportCommon.getListTemplate(data);
		var listContainer = document.querySelector("#vreportAttendList ul");
		listContainer.innerHTML = tpl;
		if(!scroller){
			scroller = new cmp.iScroll('#vreportAttendList', {hScroll: false, vScroll: true,useTransition:true});	
		}else{
			scroller.refresh();
		}
	}
	var renderPageState = function(){
		//加载查询状态
		if(pageState && pageState.isQuery){
			reportQuery = new ReportQuery({
				data : vreportCommon.getAllList(),
				initValue : pageState.queryInput,
				scrollerY : pageState.queryCrumbY,
				callback : function(result){
					if(result.type == 'click'){
						//保存页面状态
						saveStorage();
					}
					renderList(vreportCommon.getAttendList());
				}
			});
		}
		//加载listView位置
		if(pageState && pageState.listCrumbY){
			scroller.scrollTo(0,pageState.listCrumbY,0);
		}
	}	
	var events = function(){
		/**
		 * 所有报表的关注
		 */
		cmp("#vreportAttendList").on("tap",".btn-favour",function(){
			var self = this;
			var currentLi = self.parentNode.parentNode;
			var reportId = currentLi.getAttribute("data-id");
			//更新数据
			vreportCommon.toggleFavour(reportId,true,function(){
				//更新dom
				var btn_favour = self;
				btn_favour.classList.remove("btn-favour");
				btn_favour.classList.add("btn-cancel-favour");
				btn_favour.innerHTML = cmp.i18n("vreport.page.label.unfollow");
				var icon_favour = currentLi.querySelector(".report-favour-icon")
				icon_favour.classList.remove("cmp-hidden");
				var handler_favour = currentLi.querySelector(".cmp-slider-handle");
				btn_favour.style.webkitTransform = "translate3d(0, 0, 0)";
				handler_favour.style.webkitTransform = "translate3d(0, 0, 0)";
			});
		});
		/**
		 * 所有报表的取消关注
		 */
		cmp("#vreportAttendList").on("tap",".btn-cancel-favour",function(){
			var self = this;
			cmp.notification.confirm(cmp.i18n("vreport.page.message.unfollowReport"),function(p){
				if(p === 1){
					var currentLi = self.parentNode.parentNode;
					var reportId = currentLi.getAttribute("data-id");
					//更新数据
					vreportCommon.toggleFavour(reportId,false,function(){
						//更新dom
						currentLi.parentNode.removeChild(currentLi);
						var attendList = vreportCommon.getAttendList();
						if(attendList.length == 0)
							document.querySelector(".common-list-empty").classList.remove("cmp-hidden");
					});
				}
			},cmp.i18n("vreport.page.label.tips"),[cmp.i18n("vreport.page.label.cancel"),cmp.i18n("vreport.page.label.confirm")]);
		});
		//查询
		cmp.event.click(document.querySelector(".cmp-segmented_title_content"),function(){
			if(!reportQuery){
				reportQuery = new ReportQuery({
					data : vreportCommon.getAllList(),
					callback : function(result){
						if(result.type == 'click'){
							//保存页面状态
							saveStorage();
						}
						renderList(vreportCommon.getAttendList());
					}
				});
			}else{
				reportQuery.open();
			}
		});
		//点击穿透
		cmp("#vreportAttendList").on("click","li.cmp-table-view-cell",function(){
			var reportId = this.getAttribute("data-id");
			var commonTile = this.querySelector(".common-title-container .common-title");
			commonTile.classList.remove("common-unread");
			vreportCommon.detailView(reportId,function(){
				//保存页面状态
				saveStorage();
			});
		});
	}
	/**
	 * 跳转时保存页面状态
	 */
	var saveStorage = function(){
		//listview滚动Y值
		var listCrumbY = scroller.y;
		//是否是查询
		var isQuery = reportQuery ? reportQuery.queryContainer.classList.contains("cmp-active") : false;
		//查询listview滚动Y值
		var queryCrumbY = reportQuery ? reportQuery.scroller.y : 0;
		//查询条件
		var queryInput = reportQuery ? reportQuery.inputValue : "";
		//保存到sessionStorage中
		var pageState = {
			listCrumbY : listCrumbY,
			isQuery : isQuery,
			queryCrumbY : queryCrumbY,
			queryInput : queryInput
		}
		cmp.storage.save("VREPORT_PAGE_STATE",cmp.toJSON(pageState),true);
	}	
})();
