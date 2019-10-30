var vreportCommon = {
	/**
	 * 获取所有的报表
	 * @param {Object} opt
	 */
	getAllReportData : function(opt){
		var self = this;
		$s.Vreport.getReportTreeAndData({},{
			success : function(result){
				//组织各个类型的报表数据
				self.globalList = result.data;
				self.groupReportData();
				//特殊情况：我关注的列表要单独处理
				self.groupReportAttend();
				if(opt && typeof opt.callback == 'function')
					opt.callback();
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
	 * 分组报表数据（未读，报表空间...）
	 * @param {Object} data
	 */
	groupReportData : function(){
		var self = this;
		self.globalMap = {};
		self.allReportList = [],self.unReadList = [],self.readList = [],self.reportSpace = [];
		for(var i = 0;i < self.globalList.length;i++){
			var item = self.globalList[i];
			self.globalMap[item.id] = item;
			if(item.category)
				continue;
			//所有报表	
			self.allReportList.push(item);
			//未读报表
			if(!item.properties.readLog)
				self.unReadList.push(item);
			//已读报表
			if(item.properties.readLog)
				self.readList.push(item);
			//报表空间
			if(item.properties.module == '5')
				self.reportSpace.push(item);
			//我关注的单独处理
//			if(item.properties.attention)
//				self.attendList.push(item);
		}
		//保存到sessionStorage中
		cmp.storage.save("VREPORT_LIST_GLOBAL",cmp.toJSON(self.globalList),true);
	},
	/**
	 * 单独处理我关注的列表
	 */
	groupReportAttend : function(){
		var self = this;
		self.attendList = [];
		for(var i = 0;i < self.globalList.length;i++){
			var item = self.globalList[i];
			if(item.category)
				continue;
			if(item.properties.attention)
				self.attendList.push(item);
		}
		self.attendList.sort(function(a,b){
			return a.properties.attentionSort - b.properties.attentionSort;
		});
		//保存到sessionStorage中
		cmp.storage.save("VREPORT_LIST_ATTEND",cmp.toJSON(self.attendList),true);
	},
	/**
	 * 更新关注列表
	 * @param {Object} reportId
	 * @param {Object} isFavour
	 */
	updateReportAttend : function(reportId,isFavour){
		var self = this;
		var report = self.globalMap[reportId];
		report.properties.attention = isFavour;
		
		if(isFavour){
			self.attendList.unshift(report);
		}else{
			for(var i = 0;i < self.attendList.length;i++){
				if(self.attendList[i].id == reportId){
					self.attendList.splice(i,1);
					break;
				}
			}
		}
		//保存到sessionStorage中
		cmp.storage.save("VREPORT_LIST_ATTEND",cmp.toJSON(self.attendList),true);
	},
	/**
	 * 获取反续的关注列表
	 */
	getAttendListReverse : function(){
		var list = cmp.storage.get("VREPORT_LIST_ATTEND",true) ? cmp.parseJSON(cmp.storage.get("VREPORT_LIST_ATTEND",true)) : [];
		return list.reverse();
	},
	/**
	 * 获取所有报表
	 * @param {Object} backfun
	 */
	queryAllList : function(backfun){
		var self = this;
		self.getAllReportData({
			callback : function(){
				if(backfun && typeof backfun == 'function')
					backfun(self.allReportList); 
			}
		});
	},
	/**
	 * 初始化所有列表
	 */
	initAllList : function(){
		var self = this;
		//从sessionStorage中获取数据
		self.globalList = cmp.storage.get("VREPORT_LIST_GLOBAL",true) ? cmp.parseJSON(cmp.storage.get("VREPORT_LIST_GLOBAL",true)) : [];
		self.attendList = cmp.storage.get("VREPORT_LIST_ATTEND",true) ? cmp.parseJSON(cmp.storage.get("VREPORT_LIST_ATTEND",true)) : [];
		//组织各个类型的报表数据
		self.groupReportData();
	},
	/**
	 * 获取所有数据 
	 */
	getGlobalData : function(){
		if(!this.globalList)
			this.initAllList();
		return this.globalList;
	},
	/**
	 * 获取所有报表列表
	 */
	getAllList : function(){
		if(!this.allReportList)
			this.initAllList();
		return this.allReportList;
	},
	/**
	 * 获取已读报表
	 */
	getReadList : function(){
		if(!this.readList)
			this.initAllList();
		return this.readList;
	},
	/**
	 * 获取未读报表
	 */
	getUnreadList : function(){
		if(!this.unReadList)
			this.initAllList();
		return this.unReadList;
	},
	/**
	 * 获取报表空间
	 */
	getSpceList : function(){
		if(!this.reportSpace)
			this.initAllList();
		return this.reportSpace;
	},
	/**
	 * 获取关注的报表
	 */
	getAttendList : function(){
		if(!this.attendList)
			this.initAllList();
		return this.attendList;
	},
	/**
	 * 获取各种报表数量
	 */
	getReportNumber : function(){
		return {
			attend : this.attendList.length > 99 ? '99+' : this.attendList.length,
			space : this.reportSpace.length > 99 ? '99+' : this.reportSpace.length,
			unread : this.unReadList.length > 99 ? '99+' : this.unReadList.length,
			all : this.allReportList.length > 99 ? '99+' : this.allReportList.length
		}
	},
	/**
	 * 关注或取消关注
	 */
	toggleFavour : function(reportId,isFavour,callback){
		var self = this;
		$s.Vreport.favour({},{reportId : reportId,isFavour : isFavour},{
			success : function(){
				//更新globalMap数据
				self.updateReportAttend(reportId,isFavour);
				if(callback && typeof callback == 'function')
					callback();
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
	 * 阅读报表
	 * @param {Object} opt
	 */
	readReport : function(opt){
		$s.Vreport.saveReportRecordRead(opt.id,{},{
			success : function(result){
				if(typeof opt.callback === 'function')
					opt.callback.apply(this,[result]);
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
	 * 报表穿透
	 * @param {Object} reportId
	 */
	detailView : function(reportId,backFun){
		var self = this;
		
		var record = this.globalMap[reportId];
		var rptInfo = record.properties;
		var isFromM3NavBar = window.location.href.match('m3from=navbar');
		//阅读
		self.readReport({
			id : reportId,
			callback : function(result){
				//更新globalMap
				self.globalMap[reportId].properties.readLog = result.data;
				self.groupReportData();
				backFun(result.data);
			}
		});
		switch(rptInfo.module){
			//文件报表
			case "0" :  
				var options = {};
				options.openWebViewCatch = 1;
				cmp.href.next(vreportPath + "/html/fileReportView.html",{reportId : record.id},options);
			    break;						   
			//cap3报表
			case "1" :  
				var args = {
					listType : rptInfo.type,
					itemType : "dostatistics",
					id : rptInfo.relatedId
			    }
			    formqApi.jumpToFormqueryreport(args,'dashboard');
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
				if (cmp.platform.CMPShell) {//M3:依然走以前方式
					var url = cmp.seeyonbasepath + "/seeyonReport/seeyonReportController.do?method=redirectSeeyonReportH5&templateId=" + rptInfo.relatedId;
					cmp.href.open(url+"&cmp_orientation=auto", record.name);
				} else {//微协同
					cmp.href.next(vreportPath + "/html/seeyonreportView.html",{reportId : record.id}, {openWebViewCatch  : 1});
				}
			    break;
			//报表门户
			case "5" :  
				vPortalApi.openPortalIndex({
					'portalId' : rptInfo.portalId,
					'spaceId' : rptInfo.relatedId,
					'portalName' : record.name,
					'm3from': 'vreport',
					'spaceBar':false
				});
				break;
			default : 
				//打开第三方报表
				$s.Vreport.getExternalURL(record.id,{},{
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
	 *	列表模版 
	 */
	getListTemplate : function(data){
		var html = "";
		for(var i = 0;i < data.length;i++){
			var item = data[i];
			var isRead = !!item.properties.readLog;
			var isAttend = !!item.properties.attention;
			var remindNew = !!item.properties.remindNew;
			if(item.category){
				html += '<li class="cmp-list-cell list-content-li cmp-table-view-cell common-folder" data-id="' + item.id + '" folder="true">'+
							'<div class="cmp-list-cell-img cmp-left doc-yesFolder">'+
								'<div class="cmp-icon see-icon-v5-common-document-other icon-doc"></div>'+
							'</div>'+
							'<div class="cmp-list-cell-info">'+
								'<span class="cmp-ellipsis cmp-pull-left">' + item.name + '</span>'+
								'<span class="cmp-ellipsis cmp-pull-right cmp-h5 list_count">' + (item.subNum ? item.subNum : 0) +'</span>'+         
							'</div>'+
							'<div class="cmp-list-navigate">'+
								'<a href="javascript:void(0);" class="cmp-icon cmp-icon-arrowright"></a>'+
							'</div>'+
						'</li>';
			}else{
				html += '<li class="cmp-table-view-cell" data-id="' + item.id + '">'+
							'<div class="cmp-slider-right cmp-disabled">'+
								'<a class="cmp-btn ' + (isAttend ? "btn-cancel-favour" : "btn-favour") + '">' + (isAttend ? cmp.i18n("vreport.page.label.unfollow") : cmp.i18n("vreport.page.label.follow")) + '</a>'+
							'</div>'+
							'<div class="cmp-slider-handle">'+
					    		'<div class="common-list-container">'+
					    			'<div class="common-list-left">'+
					    				'<span class="cmp-icon see-icon-v5-common-report"></span>'+
					    			'</div>'+
					    			'<div class="common-list-right">'+
					    				'<div class="common-title-container">'+
					    					'<div class="common-title cmp-ellipsis '+ (!isRead ? "common-unread" : "")  +'">' + item.name + '</div>'+
					    					'<div class="common-circle">'+
					    						'<div class="circle ' + (!remindNew ? "cmp-hidden" : "") + '"></div>'+
					    					'</div>'+
					    				'</div>'+
					    				'<div class="common-detail">'+
					    					'<span>' + item.properties.createMemberName + '</span>'+
					    					'<span> 创建时间: </span>'+
					    					'<span>' + this.formatDate(item.properties.createDate) + '</span>'+
					    				'</div>'+
					    			'</div>'+
					    			'<div class="common-list-navigate">'+
					    				'<span class="cmp-icon see-icon-v5-common-collect-fill report-favour-icon ' + (!isAttend ? "cmp-hidden" : "") + '"></span>'+
					    			'</div>'+
					    		'</div>'+
					    	'</div>'+
				    	'</li>';
			}

		}
		return html;
	},
	/**
	 * 格式日期格式
	 * @param {Object} sec
	 */
	formatDate : function(sec){
		var date = new Date(parseInt(sec));
		return date.format("yyyy-MM-dd hh:mm:ss");
	}
};

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
		me.queryContainer.querySelector(".search-title-cancel").addEventListener("click",function(){
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
		queryContainer.innerHTML = ReportQuery.queryDom;
		document.getElementsByTagName('body')[0].appendChild(queryContainer);
		cmp('.cmp-search input.query-input').input();
		queryContainer.classList.add("cmp-active");
		
		var edit_content = queryContainer.querySelector('.vreport-content');
		var edit_header =  queryContainer.querySelector('.vreport-header');
		var wrapper = queryContainer.querySelector('.vreport-content .cmp-scroll-wrapper');
		edit_content.style.height = window.innerHeight +"px";
		wrapper.style.height = window.innerHeight - edit_header.offsetHeight +"px";
		
		me.queryContainer = queryContainer;
		me.queryInput = me.queryContainer.querySelector(".query-input");
		me.dataContainer = edit_content.querySelector("ul");
		
		me.queryInput.focus();
		//scroller
		me.scroller = new cmp.iScroll(wrapper, {hScroll: false, vScroll: true, useTransition:true});
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
		/**
		 * 所有报表的关注
		 */
		cmp("#report_query_container").on("tap",".btn-favour",function(){
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
				//回调
				if(me.options.callback && typeof me.options.callback == 'function'){
					me.options.callback({type : 'toggleFavour'});
				}
			});
		});
		//点击穿透
		cmp("#report_query_container").on("click","li.cmp-table-view-cell",function(){
			var reportId = this.getAttribute("data-id");
			var commonTile = this.querySelector(".common-title-container .common-title");
			commonTile.classList.remove("common-unread");
			vreportCommon.detailView(reportId,function(){
				//回调
				if(me.options.callback && typeof me.options.callback == 'function'){
					me.options.callback({type : 'click'});
				}
			});
		});
		/**
		 * 所有报表的取消关注
		 */
		cmp("#report_query_container").on("tap",".btn-cancel-favour",function(){
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
						//回调
						if(me.options.callback && typeof me.options.callback == 'function'){
							me.options.callback();
						}
					});
				}
			},cmp.i18n("vreport.page.label.tips"),[cmp.i18n("vreport.page.label.cancel"),cmp.i18n("vreport.page.label.confirm")]);
		});
		//查询框清空事件
		cmp(".cmp-search").on("tap",".cmp-icon-clear",function(){
			me.dataContainer.innerHTML = "";
		});
	},
	renderData : function(result){
		var me = this;
		var html = vreportCommon.getListTemplate(result);
		me.dataContainer.innerHTML = html;
		me.scroller.refresh();
	},
	lookup : function(key){
		var me = this;
		var data = me.options.data;
		var result = [];
		var attendList = vreportCommon.getAttendListReverse();
		for(var i = 0;i < data.length;i++){
			if(data[i].name.indexOf(key) != -1){
				//循环关注的列表
				var attentionSort = (function(){
					for(var j = 0;j < attendList.length;j++){
						if(data[i].id == attendList[j].id){
							return j;
						}
					}
					return -1;
				})();
				
				result.push({
					id : data[i].id,
					name : data[i].name.replace(key,'<span class="text-strong">' + key + "</span>"),
					attentionSort : attentionSort,
					properties : data[i].properties
				});
			}
		}
		//排序：关注的报表排前面
		result.sort(function(a,b){
			return b.attentionSort - a.attentionSort;
		});
		return result;
	},
	initQuery : function(){
		var me = this;
		if(me.options.initValue){
			me.queryInput.value = me.options.initValue;
			me.inputValue = me.options.initValue;
			me.renderData(me.lookup(me.options.initValue));
			me.queryInput.focus();
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
ReportQuery.queryDom = '<div class="vreport-content">'+
							'<div class="vreport-header">'+
								'<div class="cmp-segmented_title_content">'+
									'<form action="#" onsubmit="return false;">'+
										'<div class="cmp-content-title-search cmp-content-search-add">'+
											'<div class="cmp-input-row cmp-search">'+
												'<input type="search" class="cmp-input-clear query-input" placeholder="' + cmp.i18n("vreport.page.label.queryPlaceholder") + '">'+
											'</div>'+
											'<div class="search-title-cancel"><span>' + cmp.i18n("vreport.page.label.cancel") + '</span></div>'+
										'</div>'+
									'</form>'+
								'</div>'+
							'</div>'+
							'<div class="list-container">'+
								'<div class="cmp-scroll-wrapper">'+
							   		'<div class="cmp-scroll">'+
							   			'<ul class="cmp-table-view"><ul>'+
							   		'</div>'+
						   		'</div>'+
					   		'</div>'+
					    '</div>';
					    