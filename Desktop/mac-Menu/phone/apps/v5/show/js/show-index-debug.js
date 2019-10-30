var $ShowIndex = {};
var imageWidth = false;
var maxTitleWidth = 165;
cmp.ready(function() {
	//========================================================================//
	//					页面基础操作
	//========================================================================//
	var dw = document.documentElement.clientWidth;
	document.documentElement.style.fontSize = 20 * (document.documentElement.clientWidth / 375) + 'px';
	maxTitleWidth = dw - 210;
	//是否从底导航打开
	var isFromM3NavBar = window.location.href.match('m3from=navbar');
	$ShowIndex.isFromM3NavBar = isFromM3NavBar;
	if($ShowIndex.isFromM3NavBar){
		addWebviewEvent(function(data){
			if(data.isRefresh){
				if(data.listView === "showpost"){
					//刷新大秀listview
					cmp.listView("#si_showpost_scroll").refreshInitData();
				}else{
					//刷新主题listview
					cmp.listView("#si_showbar_scroll").refreshInitData();	
				}
			}
		});
	}
	
	$ShowIndex.Constants = {
		"showpost_h5_tpl" : document.getElementById("showpost_h5_tpl").innerHTML,
		"projectName" : getProjectName(),
		"localhostPaht" : getLocalhostPath(),
		"isLoadShowpost" : false,
		"isLoadShowbar" : false
	};
	
	/**绑定页面上的常规按钮事件*/
	$ShowIndex.bindBasicEvent = function(){
		if($ShowIndex.isFromM3NavBar){
			cmp.backbutton();
	    	cmp.backbutton.push(cmp.closeM3App);
		}else{
			//Android手机返回按钮监听
	        cmp.backbutton();
	        cmp.backbutton.push(cmp.href.back);
		}
		
		//切换首页和主题页签
		cmp('.show-index-footer').on('tap','.item',function() {
	    	var tagertArea = this.getAttribute("tagert-area");
	    	this.classList.add("pIconChoose");
	    	if (tagertArea == "showbar") {
	    		document.querySelector("#showpost-list").classList.remove("cmp-active");
	    		document.querySelector(".show-index-footer .showpost").classList.remove("pIconChoose");
	    		document.querySelector("#showbar-list").classList.add("cmp-active");
	    		if($ShowIndex.Constants.isLoadShowbar === true){
	    			cmp.listView('#si_showbar_scroll').refresh();
	    		}else{
	    			$ShowIndex.loadAndBindShowbar();
	    		}
	    	} else if(tagertArea == "showpost") {
	    		document.querySelector(".show-index-footer .showbar").classList.remove("pIconChoose");
	    		document.querySelector("#showpost-list").classList.add("cmp-active");
	    		document.querySelector("#showbar-list").classList.remove("cmp-active");
	    		if($ShowIndex.Constants.isLoadShowpost === true){
	    			cmp.listView('#si_showpost_scroll').refresh();
	    		}else{
	    			$ShowIndex.loadAndBindShowpost();
	    		}
	    	}
	    	show_index_target = cmp.storage.save("show_index_target",tagertArea,true);
	    });
		/**顶部+号，发照片*/
		cmp('.show-index-footer').on('tap','.add',function(){
			$ShowIndex.getShowauth(function(auth){
				document.querySelector(".shortcut .addPicture").classList.remove("show-shortcut-hide");
				if(auth["CreateShowbar"] == true){
					document.querySelector(".shortcut .createTheme").classList.remove("show-shortcut-hide");
				}
				document.querySelector(".shortcut").classList.remove("show-shortcut-hide");
				document.querySelector(".content_details").classList.add("blur");
			});
		});
		
		// 新建页面弹出蒙层
		cmp(".shortcut").on("tap",".close",function(){
			//关闭
			document.querySelector(".shortcut").classList.add("show-shortcut-hide");
			document.querySelector(".content_details").classList.remove("blur");
		}).on("tap",".addPicture",function(){
			var options = {};
			if($ShowIndex.isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
			cmp.href.next(_showPath + "/html/createShowpost.html?date="+(new Date().getTime()), {"back":"index"},options);
		}).on("tap",".createTheme",function(){
			var options = {};
			if($ShowIndex.isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
			cmp.href.next(_showPath + "/html/createShowbar.html?date="+(new Date().getTime()), {"operaType":"new"},options);
		});
	}
	$ShowIndex.showauth;
	$ShowIndex.getShowauth = function(callBack){
		if($ShowIndex.showauth == undefined){
			$s.Show.getShowauth("",{
				success : function(result){
					$ShowIndex.showauth = result;
					callBack(result);
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		}else{
			callBack($ShowIndex.showauth);
		}		
	}//end of $ShowIndex.getShowauth
	/**获取URL请求参数*/
	$ShowIndex.getParam = (function(){
		return cmp.href.getParam();
	})();
	/**跳转到秀吧页面*/
	$ShowIndex.goToShowbarDetail = function(showbarId) {
		var options = {};
		if($ShowIndex.isFromM3NavBar){
			options.openWebViewCatch = 1;
		}
		if (showbarId && showbarId != null) {
			cmp.href.next(_showPath + "/html/showbarDetail.html?date="+(new Date().getTime()), {"id":showbarId},options);
		}
	}
	
	
	
	//========================================================================//
	//					秀相关的操作
	//========================================================================//
	/**加载大秀列表+绑定大秀列表事件*/
	$ShowIndex.loadAndBindShowpost = function(){
		$ShowIndex.loadShowpostList();
		$ShowIndex.bindShowpostListEvent();
		$ShowIndex.Constants.isLoadShowpost = true;
	}
	
	/**从后台获取秀列表数据*/
	$ShowIndex.getShowpostListData = function(param,options) {
    	param["needTotal"] = false;
		//rest获取最新秀列表数据
	    $s.Shows.showposts(param["pageNo"],20,{},{
	    	success : function(rs){
	    		result = rs.data;
	    		if(result.data == null || result.data.length < param["pageSize"]){
	    			result.total = param["pageSize"] * param["pageNo"];
	    		}else{
	    			result.total = param["pageSize"]*param["pageNo"] + 1;
	    		}
			    //表情解析对象
			    var _emoji = new $emoji();
			    cmp.each(result.data, function(i, obj){
			    	//cmp上头像路径要加上 使用全路径(http://172.20.2.20/seeyon/.....)
			    	obj.createUserPicUrl = getCmpRoot() + obj.createUserPicUrl;
			    	var cont = "";
			    	if(null != obj.content){
			    		cont = _emoji.covert_to_emoji(escapeStringToHTML(obj.content,true));
					}
					obj.content = cont;
					//TODO 人员名称考虑用css控制 
					obj.createUserName = StringUtil.cutString(escapeStringToHTML(obj.createUserName, true), 10, true);
					cmp.each(obj.images, function(j, image){
						//移动端下载需要后缀
						var suffix = convertImageType(image.imagePostfix);
						image.showpostPicUrl = $ShowIndex.Constants.projectName + "/commonimage.do?method=showImage&id="+image.id +"&size=custom&q=0.5&h=250&w=250&handler=show&suffix=png";
						image.showpostPicOriginal = $ShowIndex.Constants.projectName + "/commonimage.do?method=showImage&from=mobile&id="+image.id+"&size=auto&handler=show&suffix=" + suffix;
						image.showpostPicSource = $ShowIndex.Constants.projectName + "/commonimage.do?method=showImage&id="+image.id+"&size=source&handler=show&suffix=" + suffix;
					});
					//判断文字是否太长，将全部按钮显示出来   TODO 这种坑爹的写法绝对要死
					var timer = setTimeout(function(){
						var sobj = cmp("#s"+obj.id)[0];
						if(sobj == undefined){
							return;
						}
						var containnerH = sobj.offsetHeight;
						var contentH = cmp("#content_"+obj.id)[0].offsetHeight;
						if(contentH > containnerH){
							cmp("#put_"+obj.id)[0].classList.remove("cmp-hidden");
						}
					}, 100);
					obj.showpostPubAddress = escapeStringToHTML(obj.showpostPubAddress, true);
					obj.showbarName = escapeStringToHTML(obj.showbarName, true);
				});
			    //动态回调执行CMP Listview的renderFunc
			    options.success(rs);
		    },
		    error :function(e){
		    	options.error();
		    	dealAjaxError(e);
		    }
	    });
	}
	/**前台渲染显示结果数据*/
	$ShowIndex.renderShowpostData = function(rs, isRefresh) {
	    var list = document.querySelector('#si_showpost_list');
	    result = rs.data;
	    if (result.length > 0) {
	    	 if(!imageWidth){
	    		 var domWidth = (document.querySelector("body").clientWidth -68 ) -10 -18;//图片区域宽度为 95%
	    		 imageWidth =  Math.ceil((domWidth - 15) / 3);
	    	 }
	    	
	    	var html = cmp.tpl($ShowIndex.Constants.showpost_h5_tpl, result);
		    if (isRefresh) {
		    	//是否刷新操作，刷新操作 直接覆盖数据
		    	list.innerHTML = html;
		    } else {
		    	//不刷新则追加数据
		    	cmp.append(list,html);
		    }
	    } else if (isRefresh){
	    	list.innerHTML = "<div class=\"Up_Cover null\" style='margin-top:0px;'><img class=\"up_img\" src=\"" + cmpPath + "/img/nocontent2.png\"/><p><span class=\"text\">"+ cmp.i18n("Show.page.label.noShow") +"</span></p></div>";
	    }
	    //国际化
	    cmp.i18n.detect();
	};
	
	/**加载大秀列表*/
	$ShowIndex.loadShowpostList = function() {
		cmp.listView("#si_showpost_scroll", {
			imgCache:true,
            imgCacheType:1,
	        config: {
	        	isClear:true, //每次重新调用cmp.listView时清空上一次listView的常量
	        	purpose : -1,
	            pageSize: 10,
	            params: {},
	            dataFunc: $ShowIndex.getShowpostListData,
	            renderFunc: $ShowIndex.renderShowpostData
	        },
	        down: {
	            contentdown: cmp.i18n("Show.page.label.refresh_down"),
	            contentover: cmp.i18n("Show.page.label.refresh_release"),
	            contentrefresh: cmp.i18n("Show.page.label.refresh_ing")
	        },
	        up: {
	            contentdown: cmp.i18n("Show.page.label.load_more"),
	            contentrefresh: cmp.i18n("Show.page.label.load_ing"),
	            contentnomore: cmp.i18n("Show.page.label.load_nodata")
	        }
	    });
	}
	/**
	 * 刷新秀列表样式
	 */
	$ShowIndex.refreshShowpostList = function(){
		cmp.listView("#si_showpost_scroll").refresh();
	}
	/**绑定大秀列表上的事件*/
	$ShowIndex.bindShowpostListEvent = function(){
		//秀相关的操作
		cmp("body").on('tap', ".BigContent .mark", function(e) {
			var showpostId = this.getAttribute("cmp-data");
			var oldShowbarId = this.getAttribute("showbarId");
			
			var canDelete = this.getAttribute("canDelete");
			var canTransfer = this.getAttribute("canTransfer");
			
			var items = [];
			if(canTransfer == "true"){
				items.push({key : "transfer",name : cmp.i18n("Show.page.button.transfer")});
			}
			if(canDelete == "true"){
				items.push({key : "delete",name : "<span style='color:red'>"+ cmp.i18n("Show.page.button.delete") +"</span>"});
			}
			
			//下方弹出选项卡选择
			cmp.dialog.actionSheet(items, cmp.i18n("Show.cancel"), function(item) {//点击删除item操作
				if(item.key == "delete"){
					setTimeout(function(){
						cmp.notification.confirm(cmp.i18n("Show.interactive.deleteShow"), function(action) {
							if (action == 1) {
								$s.Show.removeShowpost(showpostId,"","",{
								success : function(ret){
									if(ret.success == "true") {
										//删除dom
										var showpostDom = document.querySelector("#showpost"+showpostId)
										if(showpostDom){
											showpostDom.remove();
											cmp.listView("#si_showpost_scroll").refresh();
										}
										//检查剩下多少dom，小于3个则刷新一下，取最新数据
										var showpostList = document.querySelectorAll(".BigContent");
										if (showpostList && showpostList.length < 3) {
											$ShowIndex.loadShowpostList();
										}
									}else{
										//异常之后刷新一下页面
										cmp.notification.alert(ret.error_msg, function() {
											$ShowIndex.loadShowpostList();
										}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
									}
								},
								error :function(e){
									dealAjaxError(e);
								}
								});					
							}
						}, null, [ cmp.i18n("Show.cancel"), cmp.i18n("Show.page.button.confirm") ]);
					},500);
				}else if(item.key == "transfer"){
					if(loadShowbarNames){
						setTimeout(function(){
							transferShow(oldShowbarId,showpostId);
						},500);
					}else{
						cmp.dialog.loading(); 
						var csses = [cmpPath + "/css/cmp-search.css" + $buildversion,
						             cmpPath + "/css/cmp-picker.css" + $buildversion,
						             cmpPath + "/css/cmp-tab.css" + $buildversion ];
						cmp.asyncLoad.css(csses);
						var jses = [cmpPath + "/js/cmp-search.js" + $buildversion,
						            cmpPath + "/js/cmp-picker.js" + $buildversion,
						            cmpPath + "/js/cmp-dtPicker.js" + $buildversion,
						            showPath + "/js/showbar-name-list-debug.js" + $buildversion ];
						cmp.asyncLoad.js(jses,function(){
							setTimeout(function(){
								cmp.dialog.loading(false); 
								loadShowbarNames = true;
								transferShow(oldShowbarId,showpostId);
							},500);
						});
					}
				}
			});//end of cmp.dialog.actionSheet
			
		});
		
		//秀迁移
		var loadShowbarNames = false;
		function transferShow(oldShowbarId,showpostId){
			$ShowbarNameList.open({
				selectedId:oldShowbarId,
				selectCallback : function(showbarId,showbarName){
					if(oldShowbarId != showbarId){
						$s.Show.transferShow(showpostId,showbarId,"","",{
							success:function(){
								cmp.notification.toast(cmp.i18n("Show.info.move.success")+showbarName,"center");
								$ShowIndex.loadShowpostList();
							},
							error :function(e){
								var cmpHandled = cmp.errorHandler(e);
								if(!cmpHandled){
									cmp.notification.alert(cmp.i18n("Show.page.transfer.fail"), function() {
										$ShowIndex.loadShowpostList();
									},cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);						
								}
							}
						});
					}else{
						cmp.notification.toast(cmp.i18n("Show.info.move.same") + showbarName);
						return false;
					}
				}
			});
		}
		
		//点赞
		cmp("body").on('tap', ".doPraise", function(e) {
			var showpostId = this.getAttribute("showpostId");
			var self = this;
			$s.Show.showpostLike(showpostId,"",{
				success : function(ret){
					if(ret.success == "true"){
						var label = self.querySelector(".label");
						if(ret.operate === "add"){
							label.innerText = cmp.i18n("Show.comment.cancel");
						}else if(ret.operate === "remove" ){
							label.innerText = cmp.i18n("Show.comment.like");
						}
						var praises = document.getElementById("praises" + showpostId);
						if(ret.praiseNames == ""){
							praises.style.display = "none";
						}else{
							document.getElementById("likes" + showpostId).innerText = ret.praiseNames;
							praises.style.display = "block";
						}
					}else{
						//异常刷新页面
						cmp.notification.alert(ret.error_msg, function() {
							$ShowIndex.loadShowpostList();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		});
		//评论按钮
		var showMoreActions = false;
		var limitWidth = document.documentElement.clientWidth * 0.5;
		var startPostions = false;
		cmp("body").on('tap', ".showMoreActions", function(e) {
			var event = e || window.event;
			if(event.stopPropagation){
				event.stopPropagation();
			}
			event.cancelBubble = true;
			if(showMoreActions){//隐藏
				showMoreActions.style.display = "none";
			}
			
			var showpostId = this.getAttribute("showpostId");
			showMoreActions = document.getElementById("postActions" + showpostId);
			if(showMoreActions != undefined){
				showMoreActions.style.display = "block";
			}
		}).on('tap', ".content_details", function(e) {
			if(showMoreActions){
				showMoreActions.style.display = "none";
				showMoreActions = false;
			}
		}).on('touchmove', ".content_details", function(e) {
			if(showMoreActions){
				showMoreActions.style.display = "none";
				showMoreActions = false;
			}
		}).on('touchend', ".content_details", function(e) {
			try{
				if(startPostions){
					var start = e.changedTouches[0];
					endPostions = {x:start.pageX,y:start.pageY};
					if(startPostions.y - endPostions.y < 100 
							&& endPostions.x - startPostions.x >= limitWidth ){
						if($ShowIndex.isFromM3NavBar){
							cmp.closeM3App();
						}else{
							//Android手机返回按钮监听
							cmp.href.back();
						}
					}
				}
			}catch(e){}
	}).on('touchstart', ".content_details", function(e) {
		try{
			var start = e.changedTouches[0];
			startPostions = {x:start.pageX,y:start.pageY};
		}catch(e){}
	});;
		
		//展开查看
		cmp("body").on('tap', ".big_info_content .put", function(e) {
			var cont=this.previousSibling.previousSibling;
			if (cont.classList.contains('cmp-ellipsis-5')) {
				cont.classList.remove('cmp-ellipsis-5');
				this.innerHTML = cmp.i18n("Show.page.label.retract");
			} else {
				cont.classList.add('cmp-ellipsis-5');
				this.innerHTML = cmp.i18n("Show.page.label.all");
			}
			cmp.listView('#si_showpost_scroll').refresh();
		});
		
		
		//秀吧名称
		cmp("body").on('tap', ".BigContent .fromshowbar", function(e) {
			var showbarId = this.getAttribute("cmp-data");
			$ShowIndex.goToShowbarDetail(showbarId);
		});
		//大图查看
		var loadedSiders = false;
		cmp("body").on('tap', ".BigContent .big_img_content .img", function(e) {
			//所有的大图URL
			var imgs = this.parentElement.getElementsByClassName("img");
			var imgArray = [];
		    for(var i = 0,len = imgs.length;i < len; i ++) {
		    	imgArray.push({
		        	small:imgs[i].getAttribute("src-data"),
		        	big:imgs[i].getAttribute("src-data-source")
		        });
		    }
		    //默认查看第几张图
			var index = parseInt(this.getAttribute("index-data"));
		    //调用大图查看
			if(loadedSiders){
				cmp.sliders.addNew(imgArray);
				cmp.sliders.detect(index);
			}else{
				cmp.asyncLoad.css([cmpPath + "/css/cmp-sliders.css" + $buildversion]);
				var jses = [cmpPath + "/js/cmp-att.js" + $buildversion,
				            cmpPath + "/js/cmp-sliders.js" + $buildversion ];
				cmp.asyncLoad.js(jses,function(){
					loadedSiders = true;
					cmp.sliders.addNew(imgArray);
					cmp.sliders.detect(index);
				});
			}
		});
	}//end of $ShowIndex.bindShowpostListEvent = function(){
	
	
	
	
	//========================================================================//
	//					秀吧相关的操作
	//========================================================================//
	$ShowIndex.loadAndBindShowbar = function(){
		$ShowIndex.loadShowbarList();
		$ShowIndex.bindShowbarListEvent();
		$ShowIndex.Constants.isLoadShowbar = true;
	}
	$ShowIndex.showBarLists = function(param,option){
	    var showBarLists_success = option.success;
		$s.Shows.getShowbarList("",param,{
			success : function(result){
				showBarLists_success(result);
			},
			error : function(e){
				option.error();
				dealAjaxError(e);
			}
		});
	}
	/**加载秀主题列表*/
	$ShowIndex.loadShowbarList = function(){
		cmp.listView("#si_showbar_scroll", {
			imgCache:true,
            imgCacheType:1,
			config: {
				purpose : -1,
				isClear: true,
	            pageSize: 10,
	            params: {"searchType":"NewHot"},
	            dataFunc: $ShowIndex.showBarLists,
	            renderFunc: function(result, isRefresh) {
	                var table = document.querySelector('#si_showbar_list');
	                if (result.length > 0) {
	                	var listTpl = _$("#showbars_tpl").innerHTML;
	                	//手机宽度
	            		var width = document.body.offsetWidth;
	            		//封面高度动态计算：
	            		var height = 0.5*width;
	            	    cmp.each(result, function(i, obj){
	            	    	obj.coverPictureUrl = $ShowIndex.Constants.projectName + "/commonimage.do?method=showImage&id="+obj.coverPicture +"&q=0.5&size=custom&h=250&w=500&handler=show&suffix=png";
	            	    	obj.imgHeight = height;
	            	    	cmp.each(obj.imageList, function(j, imageId){
	            				//处理秀圈图片路径
		            			var showpostPicUrl = $ShowIndex.Constants.projectName + "/commonimage.do?method=showImage&id="+imageId +"&q=0.5&size=custom&h=250&w=500&handler=show&suffix=png";
		            			//obj.imageList[j] = {height : window.screen.width * 0.313333333 , showpostPicUrl : showpostPicUrl};
		            			obj.imageList[j] = {showpostPicUrl : showpostPicUrl};
	            			});
	            			obj.createUserName = StringUtil.cutString(_escapeStringToJavascript(obj.createUserName, true), 10, true);
	            			obj.showbarName = _escapeStringToJavascript(obj.showbarName, true);
	            		});
	            		cmp.each(result, function(i,v) {
	            			v.createUserPicUrl = getCmpRoot() + v.createUserPicUrl;
	            		});
	            	    var html = cmp.tpl(listTpl, result);
	            	    //是否刷新操作，刷新操作直接覆盖数据
	            	    if (isRefresh) {
	            	        table.innerHTML = html;
	            	    } else {
	            	        cmp.append(table,html);
	            	    }
	                } else if (isRefresh){
	                	table.innerHTML = "<div class=\"Up_Cover null\"><img class=\"up_img\" src=\"" + cmpPath + "/img/nocontent2.png\"/><p><span class=\"text\">" + cmp.i18n("Show.page.label.noThemes"); + "</span></p></div>";
	                }
	            }//end of renderFunc:
	        },//end of config
	        down: {
	            contentdown: cmp.i18n("Show.page.label.refresh_down"),
	            contentover: cmp.i18n("Show.page.label.refresh_release"),
	            contentrefresh: cmp.i18n("Show.page.label.refresh_ing")
	        },
	        up: {
	            contentdown: cmp.i18n("Show.page.label.load_more"),
	            contentrefresh: cmp.i18n("Show.page.label.load_ing"),
	            contentnomore: cmp.i18n("Show.page.label.load_nodata")
	        }
	    });
	}
	
	/**绑定秀主题点击事件*/
	$ShowIndex.bindShowbarListEvent = function(){
		/**进入秀主题页面*/
		cmp('#si_showbar_list').on("tap", ".showbar_user_content", function() {
			$ShowIndex.goToShowbarDetail(this.getAttribute("showbar_id"));
		});
		/**绑定长按秀吧的操作事件*/
		var runTime = null;
		cmp('#si_showbar_list').on("touchstart", ".showbar_user_content", function(e) {
			var thisObj = this;
			runTime = setTimeout(function() {
				var showbarObj = new Object();
				showbarObj.id = thisObj.getAttribute("showbar_id");
				showbarObj.canSetTop = thisObj.getAttribute("can_settop");
				showbarObj.canEdit = thisObj.getAttribute("can_edit");
				showbarObj.canDelete = thisObj.getAttribute("can_delete");
				showbarObj.isTop = thisObj.getAttribute("is_top");	
				showbarObj.coverPicture = thisObj.getAttribute("coverPicture");	
				
				var items = $ShowIndex.getShowbarAuth(showbarObj);
				if (items.length == 0) {
					return;
				}
				cmp.dialog.actionSheet(items, cmp.i18n("Show.cancel"), function(item) {
					if (item.key == "setTop") {
						$ShowIndex.setTopShowbar(showbarObj.id,true);
					} else if (item.key == "cancelTop") {
						$ShowIndex.setTopShowbar(showbarObj.id,false);
					} else if (item.key == "modify") {
						$ShowIndex.modifyShowbar(showbarObj.id,showbarObj.coverPicture);
					} else if (item.key == "delete") {
						setTimeout(function(){
							$ShowIndex.removeShowbar(showbarObj.id);
						},500);
					} else {
						cmp.notification.alert(cmp.i18n("Show.info.errortype"));
					}
				}, function() {
					console.log("您点击了取消按钮!");
				});
			}, 1000);
		});
		cmp('#si_showbar_list').on("touchend", ".showbar_user_content", function() {
			if (runTime != null) {
				clearTimeout(runTime);
			}
		});
	}
	/**
	 * 根据秀吧信息筛选操作秀吧的权限
	 * @param showbarObj 秀吧信息
	 */
	$ShowIndex.getShowbarAuth = function(showbarObj) {
		var items = [];
		if (showbarObj != undefined && showbarObj != null) {
			var itemObj = null;
			if (showbarObj.canSetTop != undefined && (showbarObj.canSetTop == true || showbarObj.canSetTop == "true")) {
				if (showbarObj.isTop != undefined && (showbarObj.isTop == true || showbarObj.isTop == "true")) {
					itemObj = new Object();
					itemObj.key = "cancelTop";
					itemObj.name = cmp.i18n("Show.page.button.cancelTop");
					items.push(itemObj);
				} else {
					itemObj = new Object();
					itemObj.key = "setTop";
					itemObj.name = cmp.i18n("Show.page.button.setTop");
					items.push(itemObj);
				}
			}
			if (showbarObj.canEdit != undefined && (showbarObj.canEdit == true || showbarObj.canEdit == "true")) {
				itemObj = new Object();
				itemObj.key = "modify";
				itemObj.name = cmp.i18n("Show.page.button.modify");
				items.push(itemObj);
			}
			if (showbarObj.canDelete != undefined && (showbarObj.canDelete == true || showbarObj.canDelete == "true")) {
				itemObj = new Object();
				itemObj.key = "delete";
				itemObj.name = cmp.i18n("Show.page.button.delete");
				items.push(itemObj);
			}
		}
		return items;
	}
	/**
	 * 刷新秀列表样式
	 */
	$ShowIndex.refreshShowbarList = function(){
		cmp.listView("#si_showbar_scroll").refresh();
	}
	/**
	 * 删除秀吧
	 * @param showbarId 秀吧id
	 */
	$ShowIndex.removeShowbar = function(showbarId) {
		cmp.notification.confirm(cmp.i18n("Show.interactive.comfirmDelete"), function(e) {
			if (e == 1) {
				$s.Show.removeShowbar(showbarId,"","",{
					success : function(ret){
						if(ret.success || ret.success == "true"){
							DOMUtil.removeDomElement(_$("#showbar_" + showbarId));
							$ShowIndex.refreshShowbarList();
							var showbarContents = document.querySelectorAll(".showbar_user_content");
							if (showbarContents.length < 4) {
								$ShowIndex.loadShowbarList();
							}
						}else{
							cmp.notification.alert(ret.error_msg, function() {
								$ShowIndex.loadShowbarList();
							}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
						}
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			}
		}, null, [ cmp.i18n("Show.cancel"), cmp.i18n("Show.page.button.confirm") ]);
	}
	/**
	 * 修改秀吧
	 * @param showbarId 秀吧id
	 */
	$ShowIndex.modifyShowbar = function(showbarId,coverPicture) {
		if (StringUtil.isNotEmpty(showbarId)) {
			$s.Show.hasShowBarExist(showbarId,"",{
				success : function(isExist){
					if (isExist == false || isExist == "false") {
						cmp.notification.alert(cmp.i18n("Show.interactive.themeNotExist"), function() {
							$ShowIndex.loadShowbarList();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					} else {
						var params = new Object();
						params.showbarId = showbarId;
						params.operaType = "modify";
						params.coverPicture = coverPicture;
						cmp.href.next(_showPath + "/html/createShowbar.html?date="+(new Date().getTime()), params,options);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});

		}
	}
	/**
	 * 置顶秀吧
	 * @param showbarId 秀吧id
	 */
	$ShowIndex.setTopShowbar = function(showbarId,isSetTop) {
		if(isSetTop === true || isSetTop === "true"){
			var eleParams = new Object();
			eleParams.src = "../img/ding.png";
			var elementObj = DOMUtil.createElement("img", eleParams);
			DOMUtil.addElementBefore(elementObj, _$("#title_" + showbarId).querySelector(".showIndex_name span"),  _$("#title_" + showbarId).querySelector(".showIndex_name"));
			_$("#showbar_" + showbarId).setAttribute("is_top", "true");
			$s.Show.setShowbarTop(showbarId,"","",{
				success : function(ret){
					if(ret.success || ret.success == "true") {
						
					} else {
						cmp.notification.alert(ret.msg, function() {
							$ShowIndex.loadShowbarList();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		}else{
			if (_$("#showbar_" + showbarId) != null) {
				DOMUtil.removeDomElement(_$("#title_" + showbarId).querySelector(".showIndex_name img"));
				_$("#showbar_" + showbarId).setAttribute("is_top", "false");		
			}
			$s.Show.cancelShowbarTop(showbarId,"","",{
				success : function(ret){
					if(ret.success || ret.success == "true") {
						
					} else {
						cmp.notification.alert(ret.msg, function() {
							$ShowIndex.loadShowbarList();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		}
	}
	
	ShowComment.listInit();
	$ShowIndex.bindBasicEvent();
	
	var show_index_target = cmp.storage.get("show_index_target",true);
	if(show_index_target == undefined || show_index_target == null || show_index_target == ''){
		show_index_target = "showpost";
	}else{
		cmp.storage.delete("show_index_target",true);
	}
	if(show_index_target == "showbar"){
		cmp.event.trigger("tap",document.querySelector(".show-index-footer .showbar"));
	}else{
		$ShowIndex.loadAndBindShowpost();
	}
	
});//end of cmp.ready(function() {