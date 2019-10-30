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
		var vreportMenu = document.querySelector(".vreport-menu");
		var listTitle = document.querySelector(".bottom-container .list-title");
		
		var windowH= window.innerHeight;
		var vreportHeaderH = vreportHeader ? vreportHeader.offsetHeight : 0;
		var vreportMenuH = vreportMenu ? vreportMenu.offsetHeight : 0;
		var listTitleH = listTitle ? listTitle.offsetHeight : 0;
		
		var listContainer = document.querySelector(".list-container");
		var vreportReadList = document.querySelector("#vreportReadList");
		vreportReadList.style.height = (windowH - vreportHeaderH - vreportMenuH - listTitleH - 10) + "px";
		listContainer.style.height = (windowH - vreportHeaderH - vreportMenuH - listTitleH - 10) + "px";
	}
	
	var initData = function(){
		//获取所有报表数据
		vreportCommon.queryAllList(function(data){
			//没有数据的情况显示示例
			if(!data || data.length == 0)
				showExample();
			//渲染数量
			renderReportNum(vreportCommon.getReportNumber());
			//渲染已读列表
			renderReadList(vreportCommon.getReadList());
			//渲染上一次的页面状态
			renderPageState();
		});
	}
	var showExample = function(){
		document.querySelector(".vreport-example").classList.remove("cmp-hidden");
		$s.Vreport.getReportViewtip({},{
			success : function(result){
				var showTip = result.data.showTip;
				if(showTip)
					document.querySelector(".vreport-example .favour-demo-tip").classList.remove("cmp-hidden");
			},
			error : function(error){
				var cmpHandled = cmp.errorHandler(error);
				if(!cmpHandled){
					console.log(error);
					if(error.message){
						cmp.notification.alert(error.message);
					}else{
						cmp.notification.alert(cmp.toJSON(error));
					}
				}
			}
		});
	}
	var renderReadList = function(data){
		if(!data || data.length == 0){
			document.querySelector(".common-list-empty").classList.remove("cmp-hidden");
		}else{
			document.querySelector(".common-list-empty").classList.add("cmp-hidden");
		}
		//按阅读时间排序
		data.sort(function(a,b){
			return b.properties.readLog.readDate - a.properties.readLog.readDate;
		});
		//取前10条
		var _data = [];
		for(var i = 0;i < data.length;i++){
			if(i > 9)
				break;
			_data.push(data[i]);
		}
		var tpl = vreportCommon.getListTemplate(_data);
		var listContainer = document.querySelector("#vreportReadList ul");
		listContainer.innerHTML = tpl;
		if(!scroller){
			scroller = new cmp.iScroll('#vreportReadList', {hScroll: false, vScroll: true,useTransition:true});	
		}else{
			scroller.refresh();
		}
	}
	var renderReportNum = function(data){
		document.querySelector(".vreport-num-attend").innerHTML = data.attend;
		document.querySelector(".vreport-num-space").innerHTML = data.space;
		document.querySelector(".vreport-num-unread").innerHTML = data.unread;
		document.querySelector(".vreport-num-all").innerHTML = data.all;
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
					//渲染数量
					renderReportNum(vreportCommon.getReportNumber());
					//渲染已读列表
					renderReadList(vreportCommon.getReadList());
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
		cmp("#vreportReadList").on("tap",".btn-favour",function(){
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
				//更新数量
				renderReportNum(vreportCommon.getReportNumber());
			});
		});
		/**
		 * 所有报表的取消关注
		 */
		cmp("#vreportReadList").on("tap",".btn-cancel-favour",function(){
			var self = this;
			cmp.notification.confirm(cmp.i18n("vreport.page.message.unfollowReport"),function(p){
				if(p === 1){
					var currentLi = self.parentNode.parentNode;
					var reportId = currentLi.getAttribute("data-id");
					//更新数据
					vreportCommon.toggleFavour(reportId,false,function(){
						//更新dom
						var btn_favour = self;
						btn_favour.classList.remove("btn-cancel-favour");
						btn_favour.classList.add("btn-favour");
						btn_favour.innerHTML = cmp.i18n("vreport.page.label.follow");
						var icon_favour = currentLi.querySelector(".report-favour-icon")
						icon_favour.classList.add("cmp-hidden");
						var handler_favour = currentLi.querySelector(".cmp-slider-handle");
						btn_favour.style.webkitTransform = "translate3d(0, 0, 0)";
						handler_favour.style.webkitTransform = "translate3d(0, 0, 0)";
						//更新数量
						renderReportNum(vreportCommon.getReportNumber());
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
						//渲染数量
						renderReportNum(vreportCommon.getReportNumber());
						//渲染已读列表
						renderReadList(vreportCommon.getReadList());
					}
				});
			}else{
				reportQuery.open();
			}
		});
		//点击穿透
		cmp("#vreportReadList").on("click","li.cmp-table-view-cell",function(){
			var reportId = this.getAttribute("data-id");
			var commonTile = this.querySelector(".common-title-container .common-title");
			commonTile.classList.remove("common-unread");
			vreportCommon.detailView(reportId,function(){
				//保存页面状态
				saveStorage();
				//渲染数量
				renderReportNum(vreportCommon.getReportNumber());
				//渲染已读列表
				renderReadList(vreportCommon.getReadList());
			});
		});
		//实例点击事件
		cmp(".vreport-example").on("tap",".favour-demo-tip-btn",function(){
			$s.Vreport.hideReportViewtip({},{
				success : function(result){
					if(result.data){
						document.querySelector(".vreport-example .favour-demo-tip").classList.add("cmp-hidden");
					}
				},
				error : function(error){
					var cmpHandled = cmp.errorHandler(error);
					if(!cmpHandled){
						console.log(error);
						if(error.message){
							cmp.notification.alert(error.message);
						}else{
							cmp.notification.alert(cmp.toJSON(error));
						}
					}
				}
			})
		});
		//我关注的
		cmp.event.click(document.querySelector("#vreport-list-attend"),function(){
			cmp.href.next(vreportPath + "/html/vreportAttend.html");
		});
		//报表空间
		cmp.event.click(document.querySelector("#vreport-list-space"),function(){
			cmp.href.next(vreportPath + "/html/vreportSpace.html");
		});
		//未读报表
		cmp.event.click(document.querySelector("#vreport-list-unread"),function(){
			cmp.href.next(vreportPath + "/html/vreportUnread.html");
		});
		//我的报表
		cmp.event.click(document.querySelector("#vreport-list-all"),function(){
			cmp.href.next(vreportPath + "/html/vreportAll.html");
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
