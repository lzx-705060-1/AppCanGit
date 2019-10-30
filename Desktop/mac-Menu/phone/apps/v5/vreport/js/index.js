(function(){
	//全局变量
	var vreport = {};
	vreport.storageKey = "VREPORT_PAGE_STATE";
	var $breadcrumb = document.querySelector("#breadcrumb");
	var $boxscrolll = document.querySelector("#boxscrolll");
	var	$scroll = document.querySelector('#breadTop');
	var contentTpl 	= document.querySelector("#content-tpl").innerHTML;
	var myFavourTpl = document.querySelector("#myFavour-tpl").innerHTML;
	//是否从底导航打开
	var isFromM3NavBar = window.location.href.match('m3from=navbar');
	
	cmp.ready(function(){
		//返回
		initBackfun();
		//初始化参数
		initParam();
		//页面高度计算
		initLayout();
		//数据加载
		initData();
		//事件绑定
		events();
	});
	var initBackfun = function(){
		var backFun = function(){
			var bread = $breadcrumb.querySelectorAll(".no-text,.on-click");
			if(bread.length <= 1){
				if(isFromM3NavBar){
					cmp.closeM3App();
				}else{
					cmp.href.back();
				}
				return;
			}
			//删除最后一个节点和箭头
			var lastChild = $breadcrumb.lastElementChild;
			$breadcrumb.removeChild(lastChild);
			lastChild = $breadcrumb.lastElementChild;
			$breadcrumb.removeChild(lastChild);
			lastChild = $breadcrumb.lastElementChild;
			
			var nodeId = lastChild.getAttribute("data-id");
			var treeNode = vreport.tree.getNode(nodeId);
			$breadcrumb.removeChild(lastChild);
			helpers.loadTreeData(treeNode);
		}
//		cmp("body").on("tap","#goBackBtn",function(){
//			backFun();
//		});
		cmp.backbutton();
        cmp.backbutton.push(backFun);
	}
	var initLayout = function(){
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var cmp_content=document.querySelector('.cmp-content');
	    var list_all = document.querySelector("#allPending");
	    var list_favour = document.querySelector("#myFavourList");
	    var query_header = document.querySelector(".report-query-container");
	    var windowH= window.innerHeight;
	    var headerH,footerH,crumbH;
	    headerH = 0;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    crumbH = 50;
	    queryHeaderH = !query_header ? 0 : query_header.offsetHeight;
		
		cmp_content.style.height = windowH - headerH - footerH - queryHeaderH + "px";
		list_all.style.height = windowH - headerH - footerH - crumbH - queryHeaderH + "px";
		list_favour.style.height = windowH - headerH - footerH - queryHeaderH + "px";
		
		//初始化tab（这个暂时放这里吧）
		if(vreport.pageState && vreport.pageState.pageTab == "all"){
			document.querySelector("#report-tab-all").classList.add("cmp-active");
			document.querySelector("#report-tab-favour").classList.remove("cmp-active");
			
			document.querySelector("#report-all").classList.add("cmp-active");
			document.querySelector("#report-mine").classList.remove("cmp-active");
		}else{
			document.querySelector("#report-tab-favour").classList.add("cmp-active");
			document.querySelector("#report-tab-all").classList.remove("cmp-active");
			
			document.querySelector("#report-mine").classList.add("cmp-active");
			document.querySelector("#report-all").classList.remove("cmp-active");
		}
	}
	var initParam = function(){
		var pageState = cmp.storage.get(vreport.storageKey,true);
		if(!pageState) return;
		cmp.storage.delete(vreport.storageKey,true);
		vreport.pageState = cmp.parseJSON(pageState);
	}
	var initData = function(){
		
		//所有报表tab
		$s.Vreport.getReportTreeAndData({},{
			success : function(result){
				vreport.tree_data_list = result.data;
				var hasReport = false;//是否存在报表
				for(var i = 0;i < result.data.length;i++){
					if(!result.data[i].category){
						hasReport = true;
						break;
					}
				}
				if(hasReport){//存在报表,走甘爷的逻辑
					//我关注的列表
					var favourParam = vreport.pageState && vreport.pageState.favourCrumbY ? {y : vreport.pageState.favourCrumbY} : undefined;
					helpers.renderFavourListView(favourParam);
					
					if(vreport.pageState){
						loadTreeAndQuery(vreport.pageState);
					}else{
						//初始化树
						vreport.tree = new VreportTree({data : vreport.tree_data_list});
						//初始化面包屑
						vreport.crumbScroll = new cmp.iScroll('#boxscrolll', {hScroll: true, vScroll: false});
						//初始化树形结构
						helpers.loadTreeData(vreport.tree.getRoot());
					}
				}else{//不存在报表,展示报表示例,去掉导航条
					$s.Vreport.getReportViewtip({},{
						success : function(result){
							var showTip = result.data.showTip;
							var noContent = '<div class="StatusContainer favour-no-content-container" style="top:0px">'+
							'<div class="favour-demo"><div class="favour-demobg"><img src=" '+vreportPath +'/img/demo.png" width="100%" />';
							if(showTip){
								noContent += '<div class="favour-demo-tip">'+
								'<div class="favour-demo-tip-content">'+cmp.i18n("vreport.page.demo")+'</div>'+
								'<div class="favour-demo-tip-btn"><u style="text-decoration:none">'+cmp.i18n("vreport.page.demo.iknow")+'</u></div>'+
								'</div>';
							}
							noContent += '</div></div></div>';
							var cmp_scroll = document.querySelector("#report-mine");
							cmp.append(cmp_scroll,noContent);
							document.querySelector("title").innerHTML = cmp.i18n("vreport.head.demoTitle");
							document.querySelector(".report-query-container").style.display = 'none';
//							var ua = navigator.userAgent.toLowerCase();
//						    if(/ipad/i.test(ua)){//适配ipad
//						    	// OA-150268 M3报表中心---查看报表示例时，Pad上未进行缩放，右侧一块空白且右下角出现一片灰色
//						    	cmp.event.orientationChange(function(res){
//						    		if(res == "landscape"){ //竖屏
//						    			document.querySelector(".favour-demo");
//						    		}else if(res == "portrait"){ //横屏
//						    			document.querySelector(".favour-demo");
//						    		}
//						    	});
//						    }
							var tipbtn = document.querySelector(".favour-demo-tip-btn");
							if(tipbtn){
								tipbtn.addEventListener("click",function(){
									helpers.hideReportViewtip();
								});
							}
							document.querySelector("#myFavourList").style.display = "none";
							document.querySelector('footer').style.display = "none";//隐藏导航条
							document.querySelector('#report-query').style.display = "none";//隐藏搜索按钮
							document.querySelector('.cmp-title').innerHTML = cmp.i18n("vreport.page.demo.report");
							document.querySelector('.cmp-title').style = "margin-right:75px";
							initLayout();//重新计算高度
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
		/**
		 * 从缓存中加载树和查询状态
		 * @param {Object} pageState
		 */
		function loadTreeAndQuery(pageState){
			//初始化树
			vreport.tree = new VreportTree({data : vreport.tree_data_list});
			//初始化面包屑
			vreport.crumbScroll = new cmp.iScroll('#boxscrolll', {hScroll: true, vScroll: false});
			
			//从缓存中加载树形结构
			var parentList = vreport.tree.getParentList(pageState.currentNodeId);
			cmp.each(parentList,function(i,v){
				helpers.fillCrumb(v.id,v.name);					
			});
			helpers.loadTreeData(vreport.tree.getNode(pageState.currentNodeId));
			if(pageState.allCrumbY){
				vreport.allCrumb.scrollTo(0,pageState.allCrumbY,0);
			}
			
			//从缓存中加载查询状态
			if(pageState.isQuery){
				vreport.reportQuery = new ReportQuery({
					data : vreport.tree.getReportNodes() || [],
					initValue : pageState.inputValue,
					scrollerY : pageState.queryCrumbY,
					callback : function(data){
						var treeNode = vreport.tree.getNode(data.id);
						helpers.detailView(treeNode);
					}
				});
			}
		}
	}
	var events = function(){
		/**
		 * 树节点点击事件
		 */
		cmp("#list_content").on("tap","li",function(){
			var isFolder = this.getAttribute("folder");
			var nodeId = this.getAttribute("data-id");
			var treeNode = vreport.tree.getNode(nodeId);
			if(isFolder === "true"){
				helpers.loadTreeData(treeNode);
			}else{
				helpers.detailView(treeNode);
			}
		});
		/**
		 * 面包屑点击事件
		 */
		cmp("#breadTop").on("tap",".local,.on-click",function(){
			if (this.classList.contains("local")) {
				$breadcrumb.innerHTML = "";
				//加载树根节点
				helpers.loadTreeData(vreport.tree.getRoot());
			}else{
				var nodeId = this.getAttribute("data-id");
				var treeNode = vreport.tree.getNode(nodeId);
				
				var sibing = this.nextElementSibling;
				var tempNode;
				while(sibing){
					tempNode = sibing.nextElementSibling; 
					sibing.parentNode.removeChild(sibing);
					sibing = tempNode;
				}
				this.parentNode.removeChild(this);
				
				helpers.loadTreeData(treeNode);
			}
		});
		/**
		 * 查询
		 */
		document.querySelector("#report-query").addEventListener("click",function(){
			if(!vreport.reportQuery){
				vreport.reportQuery = new ReportQuery({
					data : vreport.tree.getReportNodes() || [],
					callback : function(data){
						var treeNode = vreport.tree.getNode(data.id);
						helpers.detailView(treeNode);
					}
				});
			}else{
				vreport.reportQuery.open();
			}
		});
		/**
		 * 我关注列表点击事件
		 */
		cmp("#myFavourList").on("tap",".my-favour-li",function(){
			var self = this;
			var currentLi = self.parentNode.parentNode;
			var reportId = currentLi.getAttribute("data-id");
			var treeNode = vreport.tree.getNode(reportId);
			helpers.detailView(treeNode);
		});
		/**
		 * 我关注的列表取消关注
		 */
		cmp("#myFavourList").on("tap",".favour-slide-right",function(){
			var self = this;
			cmp.notification.confirm(cmp.i18n("vreport.page.message.unfollowReport"),function(p){
				if(p === 1){
					var currentLi = self.parentNode.parentNode.parentNode;
					var reportId = currentLi.getAttribute("data-id");
					helpers.toggleFavour(reportId,false);
				}
			},cmp.i18n("vreport.page.label.tips"),[cmp.i18n("vreport.page.label.cancel"),cmp.i18n("vreport.page.label.confirm")]);
		});
		/**
		 * 所有报表的关注
		 */
		cmp("#allPending").on("tap",".btn-favour",function(){
			var self = this;
			var currentLi = self.parentNode.parentNode;
			var reportId = currentLi.getAttribute("data-id");
			helpers.toggleFavour(reportId,true);
		});
		/**
		 * 所有报表的取消关注
		 */
		cmp("#allPending").on("tap",".btn-cancel-favour",function(){
			var self = this;
			var currentLi = self.parentNode.parentNode;
			var reportId = currentLi.getAttribute("data-id");
			helpers.toggleFavour(reportId,false);
		});
	}
	var helpers = {
		/**
		 * 加载树节点
		 * @param {Object} node
		 */
		loadTreeData : function(node){
			if(!node || node.subTree.length == 0){
				var noContent = '<div class="StatusContainer favour-no-content-container">'+
					'<div class="favour-no-content-cell">'+
						'<div class="favour-no-data"></div>'+
						'<span class="text nocontent_text">' + cmp.i18n("vreport.page.message.noData") + '</span>'+
					'</div>'+
				'</div>';
				var report_all = document.querySelector("#report-all");
				report_all.innerHTML = noContent;
				return;
			}
			helpers.fillCrumb(node.instance.id,node.instance.name);
			helpers.renderListView(node);
		},
		/**
		 * 回填面包屑
		 */
		fillCrumb: function(id, name) {
			var last = $breadcrumb.querySelector(".no-text"), crumbHTML = "";
			if (last != null) {
				crumbHTML += '<a class="cmp-icon cmp-icon-arrowright right-icon"></a>';
				last.classList.remove("no-text");
				last.classList.add("on-click");
			}
			crumbHTML += '<a href="javascript:void(0);" class="no-text" data-id="' + id + '">' + name.escapeHTML() + '</a>';
			cmp.append($breadcrumb, crumbHTML);
			helpers.fitCrumb();
		},
		fitCrumb: function() {
			$scroll.style.width = ($breadcrumb.clientWidth + 120) + "px"; // 这里宽度需要动态计算
		    vreport.crumbScroll.refresh();
		    vreport.crumbScroll.scrollTo(-(vreport.crumbScroll.scrollerW), 0);
		},
		/**
		 * 渲染listview
		 * @param {Object} node
		 */
		renderListView : function(node){
			var html = cmp.tpl(contentTpl, node.subTree);
			var container = document.querySelector("#list_content");
			container.innerHTML = html;
			cmp.i18n.detect();
			if(vreport.allCrumb){
				vreport.allCrumb.refresh();
			}else{
				vreport.allCrumb = new cmp.iScroll('#allPending', {hScroll: false, vScroll: true,useTransition:true});
			}
		},
		detailView : function(node){
			var rptInfo = node.instance.properties;
			helpers.savePageState();
			//标识为已读
			vreportCommon.read({id : node.instance.id});
			
			switch(rptInfo.module){
				//文件报表
				case "0" :  
					var options = {};
					if(isFromM3NavBar){
						options.openWebViewCatch = 1;
					}
					cmp.href.next(vreportPath + "/html/fileReportView.html",{reportId : node.instance.id},options);
				    break;						   
				//cap3报表
				case "1" :  
					var from = 'veport';
					if(isFromM3NavBar){
						from = 'dashboard'
					}
					var args = {
						listType : rptInfo.type,
						itemType : "dostatistics",
						id : rptInfo.relatedId
				    }
				    formqApi.jumpToFormqueryreport(args,from);
				    break;
				//cap4报表
				case "2" :  
				case "4" :  
					cap4Api.openFormQueryReport({
						type : rptInfo.type == "0" ? 4 : 3,
						appId : rptInfo.relatedId
					});
				    break;
				//帆软报表
				case "3" :  
					var url = cmp.seeyonbasepath + "/seeyonReport/seeyonReportController.do?method=redirectSeeyonReportH5&templateId=" + rptInfo.relatedId;
					cmp.href.open(url+"&cmp_orientation=auto", node.instance.name);
				    break;
				//报表门户
				case "5" :  
					vPortalApi.openPortalIndex({
						'portalId' : rptInfo.portalId,
						'spaceId' : rptInfo.relatedId,
						'portalName' : node.instance.name,
						'm3from': 'vreport',
						'spaceBar':false
					});
					break;
				default : 
					//打开第三方报表
					$s.Vreport.getExternalURL(node.instance.id,{},{
						success : function(result){
							//以原生webview打开第三方报表
							var url = result.data.url;
							if(url.indexOf("https://") > -1 || url.indexOf("http://") > -1){
								cmp.href.next(url + "&cmp_orientation=auto",null,{openWebViewCatch:true});
							}else{
								var serverIp = cmp.serverIp ? cmp.serverIp : "";
								cmp.href.next(serverIp + url + "&cmp_orientation=auto",null,{openWebViewCatch:true});
							}
						},error : function(error){
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
					break;
			}
		},
		/**
		 * 渲染我关注的列表
		 */
		renderFavourListView : function(params){
			$s.Vreport.getMyFavour({},{
				success : function(result){
					result = result.data;
					vreport.favourMap = helpers.favourMap4Sort(result);

					var html = cmp.tpl(myFavourTpl, result);
					var container = document.querySelector("#myFavourList ul.cmp-table-view");
					container.innerHTML = html;
					cmp.i18n.detect();
					
					if(result.length == 0){
						helpers.renderNoContent();
						return;
					}
					var no_content = document.querySelector("#myFavourList .favour-no-content-container");
					if(no_content){
						no_content.parentNode.removeChild(no_content);
					}
					
					//初始化iScroller
					if(vreport.favourCrumb){
						vreport.favourCrumb.refresh();
					}else{
						vreport.favourCrumb = new cmp.iScroll('#myFavourList', {hScroll: false, vScroll: true});
					}
					if(params && params.y){
						vreport.favourCrumb.scrollTo(0,params.y,0);
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
			});
		},
		/**
		 * 关注或取消关注
		 */
		toggleFavour : function(reportId,isFavour){
			$s.Vreport.favour({},{reportId : reportId,isFavour : isFavour},{
				success : function(){
					helpers.updateFavour(reportId,isFavour);
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
		},
		/**
		 * 渲染没有数据的情况
		 */
		renderNoContent : function(){
			var noContent = '<div class="StatusContainer favour-no-content-container">'+
								'<div class="favour-no-content"></div>'+
								'<span class="text nocontent_text">' + cmp.i18n("vreport.page.message.noContent") + '</span>'+
							'</div>';
			var cmp_scroll = document.querySelector("#myFavourList");
			cmp.append(cmp_scroll,noContent);
		},
		/**
		 * 隐藏报表示例提示框
		 */
		hideReportViewtip:function(){
			$s.Vreport.hideReportViewtip({},{
				success : function(result){
					if(result.data){
						document.querySelector(".favour-demo-tip").style.display = "none";
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
		},
		/**
		 * 关注或取消关注后更新
		 */
		updateFavour : function(reportId,isFavour){
			//更新树记录
			vreport.tree.toggleFavour(reportId,isFavour);
			
			var item,btn_favour,icon_favour;
			//更新我关注列表
			var favour_li_list = document.querySelectorAll("#myFavourList li.cmp-table-view-cell");
			helpers.renderFavourListView();
			/*
			if(isFavour){
				helpers.renderFavourListView();
			}else{
				for(var i = 0;i < favour_li_list.length;i++){
					item = favour_li_list[i];
					if(item.getAttribute("data-id") === reportId){
						item.parentNode.removeChild(item);
						vreport.favourCrumb.refresh();
						if(document.querySelectorAll("#myFavourList li.cmp-table-view-cell").length == 0){
							helpers.renderNoContent();
						}
						break;
					}
				}
			}
			*/
			//更新所有报表列表
			var all_li_list = document.querySelectorAll("#allPending li.cmp-table-view-cell");
			for(var j = 0;j < all_li_list.length;j++){
				item = all_li_list[j];
				if(item.getAttribute("data-id") === reportId){
					btn_favour = item.querySelector(".cmp-slider-right .cmp-btn");
					if(isFavour){
						btn_favour.classList.remove("btn-favour");
						btn_favour.classList.add("btn-cancel-favour");
						btn_favour.innerHTML = cmp.i18n("vreport.page.label.unfollow");
					}else{
						btn_favour.classList.remove("btn-cancel-favour");
						btn_favour.classList.add("btn-favour");
						btn_favour.innerHTML = cmp.i18n("vreport.page.label.follow");
					}
					icon_favour = item.querySelector(".report-favour-icon");
					if(isFavour){
						icon_favour.classList.remove("cmp-hidden");
					}else{
						icon_favour.classList.add("cmp-hidden");
					}
					var handler_favour = item.querySelector(".cmp-slider-handle");
					btn_favour.style.webkitTransform = "translate3d(0, 0, 0)";
					handler_favour.style.webkitTransform = "translate3d(0, 0, 0)";
					break;
				}
			}
		},
		/**
		 * 保存页面状态
		 */
		savePageState : function(){
			var pageState = {};
			
			//页面tab（关注，所有）
			if(document.querySelector("#report-mine").classList.contains("cmp-active")){
				pageState.pageTab = "favour";
			}else{
				pageState.pageTab = "all";
			}
			
			//是否查询
			var queryContainer = document.querySelector("#report_query_container");
			if(queryContainer && queryContainer.classList.contains("cmp-active")){
				pageState.isQuery = true;
				pageState.inputValue = vreport.reportQuery.inputValue || "";
			}else{
				pageState.isQuery = false;
			}
			
			//面包屑当前节点
			var currentCrumb = document.querySelector("#breadcrumb").lastChild;
			var nodeId = currentCrumb.getAttribute("data-id");
			pageState.currentNodeId = nodeId;
			
			//3个scroller的y值
			if(vreport.favourCrumb){
				pageState.favourCrumbY = vreport.favourCrumb.y;
			}
			if(vreport.allCrumb){
				pageState.allCrumbY = vreport.allCrumb.y;
			}
			if(vreport.reportQuery){
				pageState.queryCrumbY = vreport.reportQuery.scroller.y;
			}
			
			//保存到sessionStorage
			cmp.storage.save(vreport.storageKey,cmp.toJSON(pageState),true);
		},
		/**
		 * 关注列表map排序
		 */
		favourMap4Sort : function(data){
			var favourMap = {};
			for(var i = 0;i < data.length;i++){
				data[i].sort = i;
				favourMap[data[i].id] = data[i];
			}
			return favourMap;
		}
	}
	/**
	 * 树对象（只是格式化数据用）
	 * @param {Object} options
	 */
	function VreportTree(options){
		this.opt = options;
		this.initTree();
	}
	VreportTree.prototype = {
		initTree : function(){
			var me = this;
			var tree_data_array = me.opt.data;
			me.tree_data_map = {};
			for(var i = 0;i < tree_data_array.length;i++){
				var item = tree_data_array[i];
				//报表节点
				if(!item.category){
					if(!me.tree_report_arr){
						me.tree_report_arr = [];
						me.tree_report_arr.push(item);
					}else{
						me.tree_report_arr.push(item);
					}
				}
				//根节点
				if(!item.parentId){
					me.tree_data_root = item;
				}
				//节点信息
				if(!me.tree_data_map[item.id]){
					me.tree_data_map[item.id] = {};
					me.tree_data_map[item.id].instance = {};
					me.tree_data_map[item.id].subTree = []
				}
				me.tree_data_map[item.id].instance = item;
				//子节点信息
				if(item.parentId && !me.tree_data_map[item.parentId]){
					me.tree_data_map[item.parentId] = {};
					me.tree_data_map[item.parentId].instance = {};
					me.tree_data_map[item.parentId].subTree = [];
				}
				if(me.tree_data_map[item.parentId]) me.tree_data_map[item.parentId].subTree.push(item);
			}
			var subReportNum = function(node){
				var item = node.instance;
				var parentNode = me.tree_data_map[item.parentId];
				if(parentNode){
					if(!parentNode.instance.subNum){
						parentNode.instance.subNum = 0;
					}
					parentNode.instance.subNum++;
					subReportNum(parentNode);
				}
			}
			//计算报表数量
			cmp.each(me.tree_data_map,function(i,v){
				if(!v.instance.category){
					subReportNum(v);
				}
			});
		},
		getRoot : function(){
			return this.tree_data_root ? this.getNode(this.tree_data_root.id) :  undefined;
		},
		getNode : function(nodeId){
			return this.tree_data_map[nodeId];
		},
		getReportNodes : function(){
			return this.tree_report_arr;
		},
		toggleFavour : function(nodeId,isFavour){
			var node = this.getNode(nodeId);
			if(isFavour){
				node.instance.properties.attention = true;
			}else{
				node.instance.properties.attention = false;
			}
		},
		getParentList : function(nodeId){
			var me = this,result = [];
			var item = me.getNode(nodeId).instance;
			var parent = me.getNode(item.parentId);
			while(parent){
				result.push({
					id : parent.instance.id,
					name : parent.instance.name
				});
				parent = me.getNode(parent.instance.parentId);
			}
			return result.reverse();
		}
	}
	/**
	 * 报表查询
	 * @param {Object} options
	 */
	function ReportQuery(options){
		var me = this;
		me.options = options;
		me.initDom();
		me.backButton();
		me.bindEvent();
		me.initQuery();
	}
	ReportQuery.prototype = {
		backButton : function(){
			var me = this;
			me.queryContainer.querySelector(".cancel").addEventListener("click",function(){
				me.close();
			});
			cmp.backbutton();
        	cmp.backbutton.push(function(){
        		me.close();
        	});
		},
		initDom : function(){
			//初始化容器
			var me = this;
			var queryContainer = document.createElement("div");
			queryContainer.classList.add("Animated-Container");
			queryContainer.classList.add("right-go");
			queryContainer.classList.add("animated");
			queryContainer.setAttribute("id","report_query_container");
			queryContainer.innerHTML = queryHeader + queryContent;
			var Edit_content = queryContainer.querySelector('.create-edit-content');
			var Edit_header =  queryContainer.querySelector('.create-edit-header');
			Edit_content.style.height = window.innerHeight - Edit_header.offsetHeight - 50 +"px";
			document.getElementsByTagName('body')[0].appendChild(queryContainer);
			cmp('.cmp-search input.address-query-input').input();
			queryContainer.classList.add("cmp-active");
			
			me.queryContainer = queryContainer;
			me.queryInput = me.queryContainer.querySelector(".address-query-input");
			me.dataContainer = me.queryContainer.querySelector(".list-contaner-ul");
			
			me.queryInput.focus();
			//i18n
			me.queryInput.setAttribute("placeholder",cmp.i18n("vreport.page.label.queryPlaceholder"));
			cmp.i18n.detect();
			//scroller
			me.scroller = new cmp.iScroll(Edit_content, {hScroll: false, vScroll: true});
		},
		bindEvent : function(){
			var me = this;
			//查询框事件			
			me.queryInput.addEventListener("input",function(){
				var inputValue = this.value;
				if(!inputValue){
					me.dataContainer.innerHTML = "";
					return;
				}
				me.inputValue = inputValue;
				me.renderData(me.lookup(inputValue));
			});
			//列表选中事件
			cmp(".list-contaner-ul").on("tap","li",function(){
				var info = this.attributes["data-info"].nodeValue;
				info = cmp.parseJSON(info);
				if(me.options.callback && typeof me.options.callback == 'function'){
					me.options.callback(info);
				}
			});
			//查询框清空事件
			cmp(".cmp-search").on("tap",".cmp-icon-clear",function(){
				me.dataContainer.innerHTML = "";
			});
		},
		renderData : function(result){
			var me = this;
			var html = cmp.tpl(addressTpl,result);
			me.dataContainer.innerHTML = html;
			me.scroller.refresh();
		},
		lookup : function(key){
			var me = this;
			var data = me.options.data;
			var result = [];
			for(var i = 0;i < data.length;i++){
				if(data[i].name.indexOf(key) != -1){
					result.push({
						id : data[i].id,
						name : data[i].name.replace(key,'<span class="text-strong">' + key + "</span>"),
						properties : data[i].properties
					});
				}
			}
			//排序
			result.sort(function(a,b){
				if(vreport.favourMap[a.id] && !vreport.favourMap[b.id]){
					return -1;
				}else if(!vreport.favourMap[a.id] && vreport.favourMap[b.id]){
					return 1;
				}else if(vreport.favourMap[a.id] && vreport.favourMap[b.id]){
					return vreport.favourMap[a.id].sort - vreport.favourMap[b.id].sort;
				}else{
					return 0;
				}
			});
			return result;
		},
		initQuery : function(){
			var me = this;
			if(me.options.initValue){
				me.queryInput.value = me.options.initValue;
				me.inputValue = me.options.initValue;
				me.renderData(me.lookup(me.options.initValue));
				me.queryContainer.querySelector(".cmp-icon-clear").classList.remove("cmp-hidden");
				if(me.options.scrollerY){
					me.scroller.scrollTo(0,me.options.scrollerY,0);
				}
			}
		},
		open : function(){
			var me = this;
			me.queryContainer.classList.add("cmp-active");
			me.queryInput.focus();
			
			cmp.backbutton();
        	cmp.backbutton.push(function(){
        		me.close();
        	});
		},
		close : function(){
			var me = this;
			me.queryContainer.classList.remove("cmp-active");
			cmp.backbutton.pop();
		}
	}
	var queryHeader = '<header class="cmp-bar cmp-bar-nav cmp-after-line set-Edit-header create-edit-header">'+
						'<div class="">'+
							'<div class="cmp-content-title-search create-edit-search">'+
								'<div class="cmp-input-row cmp-search " style="width: 100%;">'+
									'<form id="cmp-search-input" onsubmit="return false;"></form>'+
									'<input placeholder="" type="search" name="search" form="cmp-search-input" class="btn cmp-input-clear cmp-v5-search-textBtn address-query-input" >'+
								'</div>'+
							'</div>' +
							'<div class="cancel"><span><i18n key="vreport.page.label.cancel"></i18n></span></div>'+
						'</div>'+
					'</header>';
	
	var queryContent = '<div class="cmp-content position_relative create-edit-content" style="top:48px;">'+
					   		'<div class="list-container cmp-scroll">'+
					   			'<ul class="list-contaner-ul edit-search-ul"><ul>'+
					   		'</div>'+
					   '</div>';
	
	var addressTpl = '<% for(var i = 0,len = this.length;i < len; i++){ %>'+
	        		 '<% var obj = this[i];%>'+
					 '<li data-info=\'<%=cmp.toJSON(obj)%>\' class="cmp-table-view-cell">'+
						'<div class="cmp-table">'+
							'<div class="cmp-table-cell cmp-col-xs-10">' +
								'<div class="report-query-list-left">'+
									'<span class="cmp-icon see-icon-v5-common-report"></span>'+
								'</div>'+
								'<div class="report-query-list-right cmp-ellipsis">'+
									'<span><%=obj.name%></span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					 '</li>'+
					 '<%}%>';
})();
