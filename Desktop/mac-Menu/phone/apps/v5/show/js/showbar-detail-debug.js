/*!
 * showbar-detail-debug.js 
 * @author	het
 * @modify by shuqi at 2016-09-06
 */
var showbarDetail = {};
var imageWidth = false;
(function(cmp,window,$,$$){
	//标示是否已经加载组件
	var loadShowNameList = false;//迁移秀吧列表
	var loadShowComment = false;//秀评论
	var loadCmpSiders = false;//大图查看器
	//模块名称:seeyon
	var projectName = getProjectName();
	//根目录：http://localhost
	var rootPath = getLocalhostPath();
	var params = {};
	var showbarinfo = {};
	var authParams= {};
	
	
	//秀吧详情页面  私有方法
	showbarDetail = 
	{
		/**
		 * 获取秀圈ID
		 * @param idStr 秀圈ID
		 * @returns 秀圈ID
		 */
		getShowpostId:function(idStr) {
			var showpostId = null;
			if (StringUtil.isNotEmpty(idStr)) {
				if (idStr.indexOf("_") > 0) {
					showpostId = idStr.substring(idStr.indexOf("_") + 1, idStr.length);
				}
			}
			return showpostId;
		},
		/**
		 * 返回秀吧首页
		 */
		backHomePage:function () {
			cmp.href.back();
		},
		/**
		 *置顶秀圈
		 *@param showbarId 主题Id
		 *@param showpostId	秀Id
		 */
		setShowpostTop:function(showbarId, showpostId) {
			$s.Show.setShowpostTop(showbarId, showpostId,"","",{
				success : function(ret){
					if(ret.success || ret.success == "true") {
						showbarDetail.initShowpostList();
						fireWebviewEvent({
							isRefresh : true,
							listView : "showpost"
						});
					} else {
						cmp.notification.alert(ret.errorMsg, function() {
							showbarDetail.backHomePage();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		},
		/**
		 * 取消秀圈置顶
		 * @param showbarId	秀吧的Id
		 * @param showpostId 秀圈的Id
		 */
		cancelShowpostTop:function(showbarId, showpostId) {
			$s.Show.cancelShowpostTop(showbarId, showpostId,"","",{
				success : function(ret){
					if(ret.success || ret.success == "true") {
						showbarDetail.initShowpostList();
						fireWebviewEvent({
							isRefresh : true,
							listView : "showpost"
						});
					} else {
						cmp.notification.alert(ret.errorMsg, function() {
							showbarDetail.backHomePage();
						}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		},
		/**
		 * 删除秀圈信息
		 * @param showpostId 秀圈id
		 */
		deleteShowpost : function (showpostId) {
			cmp.notification.confirm(cmp.i18n("Show.interactive.deleteShow"), function(e) {
				if (e == 1) {
					$s.Show.removeShowpost(showpostId,"","",{
						success : function(ret){
							if(ret.success || ret.success == "true"){
								DOMUtil.removeDomElement($("#showpost" + showpostId));
								var showpostContent = $$(".BigContent");
								if (showpostContent.length < 3) {
									showbarDetail.initShowpostList();
								}else{
									cmp.listView("#scroll").refresh();
								}
								fireWebviewEvent({
									isRefresh : true,
									listView : "showpost"
								});
							}else{
								cmp.notification.alert(ret.error_msg, function() {
									showbarDetail.initShowpostList();
								}, cmp.i18n("Show.page.button.tip"), [ cmp.i18n("Show.page.button.confirm") ]);
							}
						},
						error :function(e){
							dealAjaxError(e);
						}
					});
				}
			}, null, [ cmp.i18n("Show.cancel"), cmp.i18n("Show.page.button.confirm") ]);
		},
		transferShow:function(oldShowbarId,showpostId){
			$ShowbarNameList.open({
				selectedId:oldShowbarId,
				selectCallback : function(showbarId,showbarName){
					if(oldShowbarId != showbarId){
						$s.Show.transferShow(showpostId,showbarId,"","",{
							success:function(){
								cmp.notification.toast(cmp.i18n("Show.info.move.success") + showbarName,"center");
								showbarDetail.initShowpostList();
							},
							error :function(e){
								dealAjaxError(e);
							}
						});
					}else{
						cmp.notification.toast(cmp.i18n("Show.info.move.same")+showbarName);
						return false;
					}
				}
			});
		},
		/**
		 * 操作秀圈的按钮事件
		 * @param e
		 */
		operaShowpostEvent : function(e) {
			var oldShowbarId = params.id;
			var showpostId = this.getAttribute("cmp-data");
			var items = [];
			
			var isSetTop = this.getAttribute("settop");
			var canSetTop = this.getAttribute("canSetTop");
			var canDelete = this.getAttribute("canDelete");
			var canTransfer = this.getAttribute("canTransfer");
			
			if (canSetTop == true || canSetTop == "true") {
				if (isSetTop == true || isSetTop == "true") {
					items.push({key:"cancelTop",name:cmp.i18n("Show.page.button.cancelTop")});
				} else {
					items.push({key:"top",name:cmp.i18n("Show.page.button.setTop")});
				}
			}
			if(canTransfer == true || canTransfer == "true"){
				items.push({key:"transfer",name:cmp.i18n("Show.page.button.transfer")});
			}
			if(canDelete == true || canDelete == "true"){
				items.push({
					key:"delete",
					name:("<span style='color:red'>"+ cmp.i18n("Show.page.button.delete") +"</span>")
				});
			}
			if(items.length == 0){
				return;
			}
			
			var that = this;
			cmp.dialog.actionSheet(items, cmp.i18n("Show.cancel"), function(item) {
				if (item.key == "top") {
					that.setAttribute("settop",true);
					showbarDetail.setShowpostTop(params.id, showpostId);
				} else if (item.key == "cancelTop") {
					that.setAttribute("settop",false);
					showbarDetail.cancelShowpostTop(params.id, showpostId);
				} else if (item.key == "delete") {
					setTimeout(function(){
						showbarDetail.deleteShowpost(showpostId);
					},500);
				} else if(item.key = "transfer"){
					if(loadShowNameList){
						showbarDetail.transferShow(oldShowbarId,showpostId);
					}else{
						cmp.dialog.loading(); 
						var csses = [cmpPath + "/css/cmp-search.css" + $buildversion,
						             cmpPath + "/css/cmp-picker.css" + $buildversion ];
						cmp.asyncLoad.css(csses);
						var jses = [cmpPath + "/js/cmp-search.js" + $buildversion,
						            cmpPath + "/js/cmp-picker.js" + $buildversion,
						            cmpPath + "/js/cmp-dtPicker.js" + $buildversion,
						            showPath + "/js/showbar-name-list-debug.js" + $buildversion ];
						cmp.asyncLoad.js(jses,function(){
							setTimeout(function(){
								cmp.dialog.loading(false); 
								loadShowNameList = true;
								showbarDetail.transferShow(oldShowbarId,showpostId);
							},500);
						});
					}
				}//end of } else if(item.key = "transfer"){
			}, function() {
				console.log("您点击了取消按钮!");
			});
		},
		/**
		 * 填充秀吧详情的信息
		 * @param showbarInfo 秀吧详情
		 */
		fillShowbarDetail : function(showbarInfo) {
			if (showbarInfo && showbarInfo != null) {
				$("#showbar_cover").setAttribute("src",projectName + "/commonimage.do?method=showImage&showbarId="+showbarInfo.id+"&id="+showbarInfo.coverPicture +"&size=custom&h=150&w=550&handler=show&suffix=png");
				$("#showbar_title").innerText = showbarInfo.showbarName;
				var dateStr = "";
				if (StringUtil.isNotEmpty(showbarInfo.startDate)) {
					dateStr += showbarInfo.startDate.replace(/-/g, ".");
				}
				if (StringUtil.isNotEmpty(showbarInfo.startDate)) {
					dateStr += "-"
				}
				if (StringUtil.isNotEmpty(showbarInfo.endDate)) {
					dateStr += showbarInfo.endDate.replace(/-/g, ".");
				} else {
					if (StringUtil.isNotEmpty(dateStr)) {
						dateStr += cmp.i18n("Show.page.label.null");
					}
				}
				
				if(StringUtil.isEmpty(dateStr) && StringUtil.isEmpty(showbarInfo.address)){
					var showbar_date_location_h5 = $('#showbar_date_location_h5');
					$('.huge_title_info').removeChild(showbar_date_location_h5);
				}else{
					$("#showbar_date").innerText = dateStr;
					if (StringUtil.isEmpty(showbarInfo.address)) {
						$("#location").remove();
					} else {
						$("#location").innerText = showbarInfo.address;
					}
				}
				
				$("#view_number").innerText = showbarInfo.viewNum;
				$("#picture_number").innerText = showbarInfo.imgNum;
				$("#praise_number").innerText = showbarInfo.likeNum;
				$("#comment_number").innerText = showbarInfo.commentNum;
				var createUserName = cmp.i18n("Show.page.label.creater") + showbarInfo.createUserName;
				var showbarAuthScope = cmp.i18n("Show.page.label.range") + ":";
				if(showbarInfo.showbarAuthScope === "All"){
					showbarAuthScope = showbarAuthScope + cmp.i18n("Show.page.label.unit");
				}else if(showbarInfo.showbarAuthScope === "All_extend_externalStaff"){
					showbarAuthScope = showbarAuthScope + cmp.i18n("Show.page.label.externalPartners");
				}else if(showbarInfo.showbarAuthScope === "Part"){
					showbarAuthScope = showbarAuthScope + showbarInfo.showbarAuthString;
				}else if(showbarInfo.showbarAuthScope === "All_group"){
					showbarAuthScope += cmp.i18n("Show.page.label.group");
				}
				$("#showbar_content").innerHTML = escapeStringToHTML(createUserName, true) + "<br>"+ escapeStringToHTML(showbarAuthScope, true) + "<br>"+ escapeStringToHTML(showbarInfo.summary, true);
			}
		},
		/**
		 * 对获取的秀圈列表数据，进行渲染
		 * @param result
		 * @param isRefresh
		 */
		renderShowpostListData : function(rs, isRefresh) {
		    var table = $('#showpost_list');
		    var result = rs.data;
		    if (result.length > 0) {
		    	var listTpl = $("#showpost_list_tpl").innerHTML;
			    var _emoji = new $emoji();
			    cmp.each(result, function(i, obj){
			    	var cont = "";
			    	if(null != obj.content) {
			    		cont = _emoji.covert_to_emoji(escapeStringToHTML(obj.content,true));
					}
					obj.content = cont;
					cmp.each(obj.images, function(j, image){
						//缩略图用于九格呈现
						//当只有一张图片时，将剪切的尺寸变为500*500
						var mimeType = convertImageType(image.imagePostfix);
						image.showpostPicUrl = projectName + "/commonimage.do?method=showImage&showbarId="+obj.showbarId+"&id="+image.id +"&size=custom&q=0.5&h=250&w=250&handler=show&suffix=png";
						//原图用于大图查看器呈现
						image.showpostPicOriginal = projectName + "/commonimage.do?method=showImage&from=mobile&showbarId="+obj.showbarId+"&id="+image.id+"&size=auto&handler=show&suffix=" + mimeType;
						//原图
						image.showpostPicSource = projectName + "/commonimage.do?method=showImage&id="+image.id+"&size=source&handler=show&suffix=" + mimeType;
					});
					//判断文字是否太长，将全部按钮显示出来
					var timer = setTimeout(function() {
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
					obj.createUserName = StringUtil.cutString(escapeStringToHTML(obj.createUserName, true), 10, true);
					obj.showpostPubAddress = escapeStringToHTML(obj.showpostPubAddress, true);
					obj.createUserPicUrl = getCmpRoot() + obj.createUserPicUrl;
				});
			    
			    if(!imageWidth){
			    	var domWidth = (document.querySelector("body").clientWidth -68 ) -10 -18;//图片区域宽度为 95%
			    	imageWidth =  Math.ceil((domWidth - 15) / 3);
			    }
			    var html = cmp.tpl(listTpl, result);
			    //是否刷新操作，刷新操作直接覆盖数据
			    if (isRefresh) {
			        table.innerHTML = html;
			    } else {
			        cmp.append(table,html);
			    }
			    //showbarCommonFunc.computeShowpostIconSize(html);
		    } else if (isRefresh){
		    	table.innerHTML = "<div class=\"Up_Cover null\"><img class=\"up_img\" src=\"" + cmpPath + "/img/nocontent2.png\"/><p><span class=\"text\">"+ cmp.i18n("Show.page.label.noShow") +"</span></p></div>";
		    	var listViewMore = $('#scroll .cmp-pull .cmp-pull-caption-nomore');
		    	if(listViewMore ){
		    		//这代码可能出问题，当listView改都没结构的时候
		    		var listViewMorep = listViewMore.parentNode.parentNode;
		    		if(listViewMorep.classList.contains("cmp-pull-bottom-pocket")){
		    			listViewMorep.style.opacity = 0;
		    		}
		    	}
		    }
		    //异步国际化
		    cmp.i18n.detect();
		},
		onlyOneHeight:false,//单图宽度
		multiHeight:false,//多图图片的宽度
		/**
		 * 折叠容器动画操作
		 */
		flod_Container_transform : function () {
			var flod_container = $('.showbar_about_flod'); // 获得折叠容器
			var flod_switch = flod_container.querySelector('.flod_switch'); // 获得开关
			var flod_height = flod_container.offsetHeight;
			flod_container.style.marginTop = -flod_height + "px";
			var markTwo=0;
			flod_switch.addEventListener('tap',function(){
				if(markTwo%2==0){
					flod_container.style.marginTop="0px";
					cmp.listView('#scroll').refresh();
					markTwo++;
				} else{  //往上滑动
					flod_container.style.marginTop= -flod_height + "px";
					cmp.listView('#scroll').refresh();
					markTwo--;
				}
			},false);
		},
		/**
		 * 加载秀圈数据
		 * @param param	查询参数
		 * @param option {success:function(){}}//回调
		 */
		showPostList4ListView : function(param,option){
			$s.Shows.showposts(param["pageNo"],20,{"showbarId":param.showbarId},{
		    	success : function(result){
		    		option.success(result);
		    	},
				error :function(e){
					dealAjaxError(e);
				}
			});
		},
		//-----------------------------初始化-----------------------------//
		/**
		 * 初始化秀圈瀑布流列表
		 */
		initShowpostList : function() {
			var showpostParams = new Object();
			showpostParams.showbarId = params.id;
			cmp.listView("#scroll", {
				imgCache:true,
		        imgCacheType:1,
				config: {
					isClear: true,
		            pageSize: 10,
		            params: {
		            	showbarId:params.id
		            },
		            purpose: -1,
		            clearUI:true,
		            dataFunc: showbarDetail.showPostList4ListView,
		            renderFunc: showbarDetail.renderShowpostListData
		        },
		        down: {
		            contentdown: cmp.i18n("Show.page.label.refresh_down"),
		            contentover: cmp.i18n("Show.page.label.refresh_release"),
		            contentrefresh: cmp.i18n("Show.page.label.refresh_ing")
		        },
		        up: {
		            contentdown: "",//cmp.i18n("Show.page.label.load_more"),
		            contentrefresh: cmp.i18n("Show.page.label.load_ing"),
		            contentnomore: cmp.i18n("Show.page.label.load_nodata")
		        }
		    });
		},
		/**
		 * 初始化页面数据
		 */
		initData:function () {

			if (_getQueryString("VJoinOpen") == "VJoin") {
		        //对VJoin穿透过来的新闻进行处理
		        params['id'] = _getQueryString("id");
		    } else {
		        params = cmp.href.getParam();
		    }
			
			//OA-120860 用于记录是否已经点击了查看全部
			var hasClickViewAll = false;
			//秀新建页面会返回Id
			var backParam = cmp.href.getBackParam();
			if(backParam){
				for(var a in backParam){
					params[a] = backParam[a];
				}
			}
			try{
				hasClickViewAll = ( "true" === cmp.storage.get("hasClickViewAll",true) );
				cmp.storage.delete("hasClickViewAll",true);
			}catch(e){}
			
			if(params && params.openType && params.openType === "message"){
				for(var a in params.options){
					params[a] = params.options[a];
					if(a == "showpostId"){//后端判断的moduleId
						authParams["moduleId"] = params.options[a];
					}else{
						authParams[a] = params.options[a];
					}
				}
			}else if(params && params.openType && params.openType === "wechat"){
				 if(params.from){
					 authParams.from = params.from;
				 } 
				 if(params.showpostId){
					 authParams.showpostId = params.showpostId;
				 } 
				 if(params.commentId){
					 authParams.commentId = params.commentId;
				 } 
			}
			
			//showbarId=7887074920282279749&showpostId=-3245664377985282462&from=showpostAt&_isModalDialog=true
//			params = {}
//			params.id = "7887074920282279749";
//			params.showpostId = "-3245664377985282462";
//			params.from = "showpostAt";
			
			$s.Show.getShowbarDetail(params.id,params,{
				success : function(res){
					showbarinfo = res;
					if(res.hasViewAuth){
						params.id = res.showbarId;//有可能秀被迁移了，重新赋值一下主题Id
						//调用rest接口添加一次浏览量
						$s.Show.addViewTimes(params.id,"","",{
							success: function(data){},
							error :function(e){
								dealAjaxError(e);
							}
						});
						showbarDetail.fillShowbarDetail(res);
						//详情的折叠动画
						showbarDetail.flod_Container_transform();
						
						//列表数据
						if(!res.isFromShowpost || ( hasClickViewAll && res.isFromShowpost && res.viewAll)){
							$("#sd_add_btn").classList.remove("hide");
							showbarDetail.initShowpostList();
							ShowComment.authParams = false;
						}else{
							//定位一个特定的秀
							if(res.canSee){//这一个秀能查看
								res.showpostVo.nolazyLoad = true;
								showbarDetail.renderShowpostListData({"data":[res.showpostVo]},true);
							}else{//这一个秀能不能查看|删除
								var showpostHtml = "";
								showpostHtml += '<div class="Up_Cover null">';
								showpostHtml += '	<img class="up_img" src="' + cmpPath + '/img/nocontent2.png"/>';
								showpostHtml += '	<p><span class="text">'+ res.showpostMsg; +'</span></p>';
								showpostHtml += '</div>';
								$('#showpost_list').innerHTML = showpostHtml;
							}
							if(res.viewAll){
								$("#sd_add_btn").classList.remove("hide");
								//绑定事件
								var html = "<div id='viewAllShow' class='viewAllShow'>" + cmp.i18n("Show.click.viewAllShow") +"</div>"
								cmp.append($('#showpost_list'),html);
								$("#viewAllShow").addEventListener("tap",function(){
									$('#showpost_list').innerHTML = "";
									showbarDetail.initShowpostList();
								});
							}
							cmp.listView("#scroll");
						}
					}else{
						//如果没权限，隐藏秀内容，显示个鲸鱼
						$(".showContentArea").style.display = "none";
						$("#sd_add_btn").style.display = "none";
						$(".hasNoViewAuth").classList.remove('hide');
						var noAuth = "";
						noAuth += '<div class="Up_Cover null">';
						noAuth += '		<img class="up_img" src="' + cmpPath + '/img/nocontent2.png"/>';
						noAuth += '		<p><span class="text">' + res.msg + '</span></p>';
						noAuth += '</div>';
						$(".hasNoViewAuth").innerHTML = noAuth;
					}
				},
				error :function(e){
					dealAjaxError(e);
				}
			});
		},
		/**
		 * 初始化页面事件
		 */
		initEvent:function() {
		    
		    //+号操作
		    $("#sd_add_btn").addEventListener("tap", function(){
		    	try{
		    		if($("#viewAllShow") == null){
		    			cmp.storage.save("hasClickViewAll","true",true);
		    		}
		    	}catch(e){}
		    	$s.Show.getShowbarDetail(params.id,params,{
		    		success : function(showbarInfo){
		    			cmp.href.next(_showPath + "/html/createShowpost.html", {
		    				"back":"showbarDetail",
		    				"showbarName":escapeStringToHTML(showbarInfo.showbarName),
		    				"showbarId":showbarInfo.id
		    			});
		    		},
					error :function(e){
						dealAjaxError(e);
					}
		    	});
		    });
		    // 绑定操作秀圈的按钮事件
		    cmp("body").on('tap', ".BigContent .mark", showbarDetail.operaShowpostEvent).on('tap', ".big_info_content .put",function(e) {
				//绑定展开秀圈内容的事件
				var contentArea = this.parentNode.getElementsByTagName("h5")[0];
				if(contentArea.classList.contains("cmp-ellipsis-5")){
					contentArea.classList.remove('cmp-ellipsis-5');
					this.innerText = cmp.i18n("Show.page.label.retract");
				}else{
					contentArea.classList.add('cmp-ellipsis-5');
					this.innerText = cmp.i18n("Show.page.label.all");
				}
				cmp.listView('#scroll').refresh();
			}).on('tap', ".BigContent .big_img_content .img", function(e) {
				//绑定查看查看大图事件
				var index = parseInt(this.getAttribute("index-data"));
				var _src = this.getAttribute("src-data");
				var imgs = this.parentElement.getElementsByClassName("img");
				var imgArray = [];
			    for(var i = 0,len = imgs.length;i < len; i ++) {
			    	imgArray.push({
			        	small:imgs[i].getAttribute("src-data"),
			        	big:imgs[i].getAttribute("src-data-source")
			        });
			    }
			    if(loadCmpSiders){
			    	//调度大图查看
			    	cmp.sliders.addNew(imgArray);
			    	cmp.sliders.detect(index);
			    }else{
			    	cmp.dialog.loading(); 
			    	cmp.asyncLoad.css([cmpPath + "/css/cmp-sliders.css" + $buildversion]);
			    	var jses = [cmpPath + "/js/cmp-att.js" + $buildversion,
			    	            cmpPath + "/js/cmp-sliders.js" + $buildversion];
			    	cmp.asyncLoad.js(jses,function(){
			    		cmp.dialog.loading(false); 
			    		loadCmpSiders = true;
			    		cmp.sliders.addNew(imgArray);
			    		cmp.sliders.detect(index);
			    	});
			    	
			    }
			});
			
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
								showbarDetail.backHomePage();
							}
						}
					}catch(e){}
			}).on('touchstart', ".content_details", function(e) {
				try{
					var start = e.changedTouches[0];
					startPostions = {x:start.pageX,y:start.pageY};
				}catch(e){}
			});
		}
	};
	
	//解析url方法
	function _getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]);
	    return null;
	}
	//cmp 渲染完后执行
	cmp.ready(function() {
		document.documentElement.style.fontSize = 20 * (document.documentElement.clientWidth / 375) + 'px';
		//返回
	    cmp.backbutton();
	    cmp.backbutton.push(showbarDetail.backHomePage);
	    
	    ShowComment.listInit();
		showbarDetail.initData();
		showbarDetail.initEvent();
		//穿透相关的权限
		ShowComment.authParams = authParams;
	});
})(cmp,window,querySelector,querySelectorAll);