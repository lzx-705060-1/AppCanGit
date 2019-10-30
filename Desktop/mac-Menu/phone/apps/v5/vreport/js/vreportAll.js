(function(){
	var $breadcrumb = document.querySelector("#breadcrumb");
	var $boxscrolll = document.querySelector("#boxscrolll");
	var	$scroll = document.querySelector('#breadTop');
	var vreport = {};
	var pageState;
	
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
		/*
		var backFun = function(){
			var bread = $breadcrumb.querySelectorAll(".no-text,.on-click");
			if(bread.length <= 1){
				cmp.storage.delete("VREPORT_PAGE_STATE",true);
				cmp.href.back();
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
		*/
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
	
	var initLayout = function(){
	    var vreportContent=document.querySelector('.vreport-content');
	    var vreportHeader = document.querySelector(".vreport-header");
	    var crumb = document.querySelector(".cmp-crumbs-content");
	    var windowH= window.innerHeight;
	   	var crumbH = !crumb ? 0 : crumb.offsetHeight;
	    var vreportHeaderH = !vreportHeader ? 0 : vreportHeader.offsetHeight;
		
		var listAll = document.querySelector("#allPending");
		vreportContent.style.height = (windowH - vreportHeaderH) + "px";
		listAll.style.height = (windowH - crumbH - vreportHeaderH) + "px";
	}
	var initData = function(){
		//初始化树
		vreport.tree = new VreportTree({data : vreportCommon.getGlobalData()});
		//初始化面包屑
		vreport.crumbScroll = new cmp.iScroll('#boxscrolll', {hScroll: true, vScroll: false});
		//初始化树形结构
		helpers.loadTreeData(vreport.tree.getRoot());
		//渲染上一次的页面状态
		renderPageState();
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
				var commonTile = this.querySelector(".common-title-container .common-title");
				commonTile.classList.remove("common-unread");
				vreportCommon.detailView(nodeId,function(){
					//保存页面状态
					saveStorage();
					helpers.refreshCurrent();
				});
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
		cmp.event.click(document.querySelector(".cmp-segmented_title_content"),function(){
			if(!vreport.reportQuery){
				vreport.reportQuery = new ReportQuery({
					data : vreportCommon.getAllList(),
					callback : function(result){
						if(result.type == 'click'){
							//保存页面状态
							saveStorage();
						}
						helpers.refreshCurrent();
					}
				});
			}else{
				vreport.reportQuery.open();
			}
		});
		/**
		 * 所有报表的关注
		 */
		cmp("#allPending").on("tap",".btn-favour",function(){
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
				var icon_favour = currentLi.querySelector(".report-favour-icon");
				icon_favour.classList.remove("cmp-hidden");
				var handler_favour = currentLi.querySelector(".cmp-slider-handle");
				btn_favour.style.webkitTransform = "translate3d(0, 0, 0)";
				handler_favour.style.webkitTransform = "translate3d(0, 0, 0)";
			});
		});
		/**
		 * 所有报表的取消关注
		 */
		cmp("#allPending").on("tap",".btn-cancel-favour",function(){
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
					});
				}
			},cmp.i18n("vreport.page.label.tips"),[cmp.i18n("vreport.page.label.cancel"),cmp.i18n("vreport.page.label.confirm")]);
		});
	}
	
	var renderPageState = function(){
		//加载查询状态
		if(pageState && pageState.isQuery){
			vreport.reportQuery = new ReportQuery({
				data : vreportCommon.getAllList(),
				initValue : pageState.queryInput,
				scrollerY : pageState.queryCrumbY,
				callback : function(result){
					if(result.type == 'click'){
						//保存页面状态
						saveStorage();
					}
					helpers.refreshCurrent();
				}
			});
		}
		//加载listView位置
		if(pageState && pageState.currentNodeId){
			var parentList = vreport.tree.getParentList(pageState.currentNodeId);
			$breadcrumb.innerHTML = "";
			cmp.each(parentList,function(i,v){
				helpers.fillCrumb(v.id,v.name);					
			});
			helpers.loadTreeData(vreport.tree.getNode(pageState.currentNodeId));
			if(pageState.listCrumbY){
				vreport.allCrumb.scrollTo(0,pageState.listCrumbY,0);
			}
		}
	}	
	
	/**
	 * 跳转时保存页面状态
	 */
	var saveStorage = function(){
		//listview滚动Y值
		var listCrumbY = vreport.allCrumb.y;
		//是否是查询
		var isQuery = vreport.reportQuery ? vreport.reportQuery.queryContainer.classList.contains("cmp-active") : false;
		//查询listview滚动Y值
		var queryCrumbY = vreport.reportQuery ? vreport.reportQuery.scroller.y : 0;
		//查询条件
		var queryInput = vreport.reportQuery ? vreport.reportQuery.inputValue : "";
		
		//面包屑当前节点
		var currentCrumb = document.querySelector("#breadcrumb").lastChild;
		var nodeId = currentCrumb.getAttribute("data-id");
		
		//保存到sessionStorage中
		var pageState = {
			listCrumbY : listCrumbY,
			isQuery : isQuery,
			queryCrumbY : queryCrumbY,
			queryInput : queryInput,
			currentNodeId : nodeId
		}
		cmp.storage.save("VREPORT_PAGE_STATE",cmp.toJSON(pageState),true);
	}
	var helpers = {
		/**
		 * 加载树节点
		 * @param {Object} node
		 */
		loadTreeData : function(node){
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
			var html = vreportCommon.getListTemplate(node.subTree)
			var container = document.querySelector("#list_content");
			container.innerHTML = html;
			if(vreport.allCrumb){
				vreport.allCrumb.refresh();
			}else{
				vreport.allCrumb = new cmp.iScroll('#allPending', {hScroll: false, vScroll: true,useTransition:true});
			}
		},
		/**
		 * 重新加载当前节点
		 */
		refreshCurrent : function(){
			var lastChild = $breadcrumb.lastElementChild;
			var nodeId = lastChild.getAttribute("data-id");
			var treeNode = vreport.tree.getNode(nodeId);
			$breadcrumb.removeChild(lastChild);
			helpers.loadTreeData(treeNode);
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
				//删除子节点数量信息
				if(item.subNum)
					delete item.subNum;
				
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
})();
