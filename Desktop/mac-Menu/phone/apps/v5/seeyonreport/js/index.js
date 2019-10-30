/*!
 * @title 第三方报表集成 ，现OA支持帆软报表
 * @description 
 * 	1. 只展示有权限的报表模板;
 * 	2. 如果模板分类下无报表模板，则此模板分类不做展示;
 *  3. 点击“报表模板”节点的时候使用原生方式打开webview
 *  
 * @author ouyp
 * @date 2017/03/07
 */
;(function(cmp, window, $api, $){
	//局部变量
	var notificationTimeout = 2000, //消息提示时间
		contentTpl 	= $("#content-tpl").innerHTML, //列表模板
		$breadcrumb = $("#breadcrumb"),
		$boxscrolll = $("#boxscrolll"), 
		$scroll 	= $('#breadTop');
	
	//页面初始化工具类
	window.reportIndex = {
		current: 1, //当前目录层次
		crumbScroll: null,
		/**
		 * 容器初始化
		 */
		init: function() {
			cmp.dialog.loading();
			/**
			 * 返回事件
			 */
			$("#goBackBtn").addEventListener("tap", function(){
				reportIndex.back();
			});
			document.addEventListener("backbutton", function() {
				reportIndex.back();
	        });
			/**
			 * listview容器高度
			 */
		    var cmpContent = document.querySelector('.cmp-control-content'),
		    	boxscrolll = document.querySelector('#boxscrolll'),
		    	boxscrolllH = boxscrolll.offsetHeight;
		    cmpContent && (cmpContent.style.height = window.innerHeight - boxscrolllH + "px");
			/**
			 * 页面结构初始化
			 */
			$api.Report.getSeeyonreportTree({categoryId: reportIndex.current}, {
				repeat: true,
				success: function(ret) {
					//初始化面包屑
					reportIndex.fillCrumb(reportIndex.current, ret.name);
					//初始化列表
					cmp.listView("#allPending", {
						config: {
							pageSize: 10,
							params: {},
							crumbsID: reportIndex.current,
							isClear: false,
							dataFunc: function(params, options){
								options.success(ret.fi);
							},
							renderFunc: function(result, isRefresh) {
								 var html = cmp.tpl(contentTpl, result);
								 var container = $("#list_content");
								 if (isRefresh) {
									 container.innerHTML = html;
								 } else {
									 cmp.append(container, html);
								 }
								 cmp.dialog.loading(false);
							}
						},
						down: {
							contentdown: cmp.i18n("seeyonreport.label.pulltorefresh"),
				            contentover: cmp.i18n("seeyonreport.label.loosentorefresh"),
				            contentrefresh: cmp.i18n("seeyonreport.label.refreshing")
						},
						up: {
				            contentdown: cmp.i18n("seeyonreport.label.uptomore"),
				            contentrefresh: cmp.i18n("seeyonreport.label.refreshing"),
				            contentnomore: ""
				        }
					});
				},
				error: function(err) {
					cmp.dialog.loading(false);
					console.info(err);
					if (cmp.errorHandler(err)) {
						//CMP处理
					} else {
						cmp.notification.toast(cmp.i18("seeyonreport.msg.error"), "center", notificationTimeout);
					}
				}
			});
			/**
			 * 初始化面包屑滚动条
			 */
			reportIndex.crumbScroll = new cmp.iScroll('#boxscrolll', {hScroll: true, vScroll: false});
			/**
			 * 事件绑定
			 */
			cmp(".cmp-crumbs-content").on("tap", ".local, .on-click", function(){
				if (this.classList.contains("local")) {//报表分析,切换到层级:报表模板
					reportIndex.current = 1;
					var name = $breadcrumb.childNodes[0].innerText;
					$breadcrumb.innerHTML = "";
					reportIndex.fillCrumb(reportIndex.current, name);
					reportIndex.fillListview();
				} else {
					reportIndex.current = this.id;
					/**
					 * 删除指定分类以后的节点
					 */
					var children = $breadcrumb.querySelectorAll(".no-text, .on-click");
					var liIndex;
					for (var i = 0; i < children.length; i++) {
						if (children[i].id == this.id) {
							liIndex = i;
							break;
						}
					}
					for(var j = liIndex + 1; j < children.length; j++) {
						var c = children[j], ico = c.previousElementSibling;
						$breadcrumb.removeChild(c);
						$breadcrumb.removeChild(ico);
					}
					this.classList.remove("on-click");
					this.classList.add("no-text");
					
					reportIndex.fitCrumb();
					reportIndex.fillListview();
				}
			});
			cmp("#list_content").on("tap", ".cmp-list-cell", function(){
				var folder = this.getAttribute("folder"), folder = folder.toLocaleLowerCase() == "true";
				if (folder) {//模板分类
					reportIndex.current = this.id;
					reportIndex.fillCrumb(reportIndex.current, this.getAttribute("name"));
					reportIndex.fillListview();
				} else {
					var templateId = this.id, templateName = this.getAttribute("name");
					var url = cmp.seeyonbasepath + "/seeyonReport/seeyonReportController.do?method=redirectSeeyonReportH5&templateId=" + templateId;
					cmp.href.open(url, templateName);
				}
			});
		},
		/**
		 * 处理返回逻辑
		 */
		back: function() {
			var children = $breadcrumb.querySelectorAll(".no-text, .on-click"), len = children.length;
			if (len <= 1) {
				cmp.href.back();
				return;
			}
			/**
			 * 已经进入大于1层的目录中
			 * 1. 删除最后一个节点
			 * 2. 根据倒数第二个节点做初始化面包屑&listview
			 */
			var last = children[len - 1], prev = last.previousElementSibling;
			$breadcrumb.removeChild(last);
			$breadcrumb.removeChild(prev);
			
			var current = children[len - 2];
			current.classList.remove("on-click");
			current.classList.add("no-text");
			reportIndex.current = current.id;
			
			reportIndex.fitCrumb();
			reportIndex.fillListview();
		},
		/**
		 * 回填面包屑
		 */
		fillCrumb: function(id, name) {
			var last = $(".no-text", $breadcrumb), crumbHTML = "";
			if (last != null) {
				crumbHTML += '<a class="cmp-icon cmp-icon-arrowright right-icon"></a>';
				last.classList.remove("no-text");
				last.classList.add("on-click");
			}
			crumbHTML += '<a href="javascript:void(0);" class="no-text" id="' + id + '">' + name.escapeHTML() + '</a>';
			cmp.append($breadcrumb, crumbHTML);
			reportIndex.fitCrumb();
		},
		fitCrumb: function() {
			$scroll.style.width = ($breadcrumb.clientWidth + 120) + "px"; // 这里宽度需要动态计算
		    reportIndex.crumbScroll.refresh();
		    reportIndex.crumbScroll.scrollTo(-(reportIndex.crumbScroll.scrollerW), 0);
		},
		/**
		 * 回填listview
		 */
		fillListview: function(){
			cmp.dialog.loading();
			cmp.listView("#allPending", {
				config: {
					pageSize: 10,
					params: {categoryId: this.current},
					crumbsID: this.current,
					isClear: false,
					dataFunc: function(params, options){
						$api.Report.getSeeyonreportTree(params, {
							repeat: true,
							success: function(ret){
								options.success(ret.fi);
							},
							error: function(err){
								cmp.dialog.loading(false);
								console.info(err);
								if (cmp.errorHandler(err)) {
									//CMP处理
								} else {
									cmp.notification.toast(cmp.i18n("seeyonreport.msg.error"), "center", notificationTimeout);
								}
							}
						});
					},
					renderFunc: function(result, isRefresh) {
						 var html = cmp.tpl(contentTpl, result);
						 var container = $("#list_content");
						 if (isRefresh) {
							 container.innerHTML = html;
						 } else {
							 cmp.append(container, html);
						 }
						 cmp.dialog.loading(false);
					}
				},
				down: {
					contentdown: cmp.i18n("seeyonreport.label.pulltorefresh"),
		            contentover: cmp.i18n("seeyonreport.label.loosentorefresh"),
		            contentrefresh: cmp.i18n("seeyonreport.label.refreshing")
				},
				up: {
		            contentdown: cmp.i18n("seeyonreport.label.uptomore"),
		            contentrefresh: cmp.i18n("seeyonreport.label.refreshing"),
		            contentnomore: ""
		        }
			});
		}
	};
})(cmp, window, SeeyonApi, function(selector, target){
	target = target || document;
	return target.querySelector(selector);
});
