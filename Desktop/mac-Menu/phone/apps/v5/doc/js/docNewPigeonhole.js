var docLoadCount = 0;
function docPigehole4Col(batchData,callback){
	cmp.i18n.load(_docPath + "/i18n/", "Doc",function(){
		var is_scroll;
		var all;
		var add;
		var edit;
		var docLibId;
		var parentFrId;
		var commentEnabled;
		var recommendEnable;
		var versionEnabled;
		var cmpData4Create;
		var flag = false;
		//静态页面
		var static_html = '<div id="addDivFilter" style="display: none;"></div>'
						+ '<div id="addDiv" style="display: none;">'
						+ '<div id="addPlatformAndroid" style="display: none;">'
						+ '<div class="add-upload">'
						+ '<div class="add-upload-folder">'
						+ '<div class="add-upload-folder-back">'
						+ '<span class="cmp-icon see-icon-v5-common-newfolder"></span>'
						+ '</div>'
						+ '<div class="add-upload-folder-type">'
						+ '<span><i18n key="doc.h5.folder"></i18n></span>'
						+ '</div>'
						+ '</div>'
						+ '<div style="clear: both;"></div>'
						+ '</div>'
						+ '</div>'
						+ '<div id="addPlatformIOS" style="display: none;">'
						+ '<div class="add-upload">'
						+ '<div class="add-upload-folder" style="width: 50%;">'
						+ '<div class="add-upload-folder-back">'
						+ '<span class="cmp-icon see-icon-v5-common-close"></span>'
						+ '</div>'
						+ '<div class="add-upload-folder-type">'
						+ '<span><i18n key="doc.h5.folder"></i18n></span>'
						+ '</div>'
						+ '</div>'
						+ '<div style="clear: both;"></div>'
						+ '</div>'
						+ '</div>'
						+ '<div id="custom"></div>'
						+ '<div class="add-remain" id="mySpace">'
						+ '</div>'
						+ '<div class="add-close">'
						+ '<span class="cmp-icon see-icon-v5-common-close"></span>'
						+ '</div>'
						+ '</div>'
						+ '<div class="cmp-content position_relative" id="list">'
						+ '<div class="cmp-segmented_title_content">'
						+ '<div class="cmp-crumbs-content">'
						+ '<div class="cmp-scroll-wrapper" id="boxscrolll">'
						+ '<div class="cmp-scroll" id="breadTop">'
						+ '<a href="javascript:void(0)" class="local"><i18n key="doc.h5.doc"></i18n></a>'
						+ '<a class="cmp-icon cmp-icon-arrowright right-icon"></a>'
						+ '<div id="breadcrumb" style="display:inline-block"></div>'
						+ '</div>'
						+ '<a id="add" class="cmp-icon see-icon-v5-common-newfolder cmp-pull-right" style="display:none;padding-right: 15px;"></a>'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="cmp-control-content cmp-active" style="margin-top: -1px;">'
						+ '<div id="allPending" class="  cmp-scroll-wrapper">'
						+ '<div class="cmp-scroll">'
						+ '<ul class="cmp-list-content cmp-table-view file-index-content" id="list_content">'
						+ '</ul>'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<footer id="pigeonholeFooter" class="cmp-bar cmp-bar-footer footer-style">'
						+ '<input type="button" class="footer-button-style" id="cancel">'
						+ '<input type="button" class="footer-button-style" id="ok"></footer>';
		//动态页面
		var dynamic_html = '<% for(var i = 0,len = this.length;i < len; i++){ %>'
						+ '<% var obj = this[i];'
						+ 'var folder = "cmp-icon-document folder";'
						+ '%>'
						+ '<li class="cmp-list-cell" cmp-data=\'<%=cmp.toJSON(obj).escapeHTML() %>\'>'
						+ '<div class="cmp-list-cell-img cmp-left">'
						+ '<div class="<%=folder%>"></div>'
						+ '</div>'
						+ '<div class="cmp-list-cell-info">'
						+ '<span class="cmp-ellipsis cmp-pull-left list_title_name"><%=escapeStringToHTML(obj.fr_name)%></span>'
						+ '</div>'
						+ '<div class="cmp-list-navigate">'
						+ '<a href="javascript:void(0)" id="<%=obj.fr_id%>" class="cmp-icon cmp-icon-arrowright"></a>'
						+ '</div>'
						+ '</li>'
						+ '<%}%>';

		//添加涂层
		_$("#docPigeonhole").classList.add('cmp-active');
		_$("#docPigeonhole").style.display="";
		cmp.backbutton();
		cmp.backbutton.push(backClick4pige);
		//只有第一次进行加载listview
		if(docLoadCount==0){
			_$("#docPigeonhole").innerHTML = static_html;
            _$("#docPigeonhole").firstElementChild.setAttribute("style","height: 64px; padding-top: 20px;");
            _$("#list").style.top = "64px";
            cmp.i18n.detect();
			initListView4pige(true,null);
			initPigeonhole();
			initEvent4pige();
			prevPage4pige();
			goHome4pige();
			docLoadCount++;
		}else{
			_$("#boxscrolll").style.display = "";
			_$("#allPending").style.display = "";
			initListView4pige(true,null);
			_$("#breadcrumb").innerHTML="";
		}
		is_scroll = new cmp.iScroll('#boxscrolll', {
			hScroll: true,
			vScroll: false
		});
	    
		//显示button值
		_$("#cancel").value = cmp.i18n("doc.h5.cancel");
		_$("#ok").value = cmp.i18n("doc.h5.OK");
		
		/**************************内部方法****************************************/
		function initEvent4pige() {
	    //给面包屑添加点击事件
			cmp("#breadTop").on("tap", ".on-text", function() {
				var _id = this.getAttribute("id");
				var cmpData = cmp.parseJSON(this.getAttribute("cmp-data"))[0];
				var _frype = this.getAttribute("fr-type");
				cmp.dialog.loading();
				$s.Doc.isExist({
					"drId": _id,
					"frType": _frype
				}, {repeat:true,
					success: function(result) {
						if (!result) {
							cmp.notification.alert(cmp.i18n("doc.notExist"), function() {
								location.reload(true);
							}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
							return;
						} else {
							initListView4pige(false,cmpData);
							getPath4pige(cmpData);
						}
						cmp.dialog.loading(false);
					},
			        error: function(error){
			        	var cmpHandled = cmp.errorHandler(error);
		                if(cmpHandled){
		                	
		                }else{
		                }
		                cmp.dialog.loading(false);
			        }
				});
			});
			
			_$("#add").addEventListener("tap", function() {
                _$("#addDivFilter").style.display = "none";
                _$("#addDiv").style.display = "none";
                cmp.notification.prompt(cmp.i18n("doc.h5.create.foleder"),function (index,title,callbackObj) {
                    if (index == 0) {
                        _$("#docDrop").remove();
                        cmp.notification.close();
                    } else if (index == 1) {
                    	if(flag){
        					return;
        				}
        				flag = true;
                        var params = {
                            "title":title,
                            "docLibId":docLibId,
                            "parentFrId":parentFrId,
                            "commentEnabled":commentEnabled,
                            "recommendEnable":recommendEnable,
                            "versionEnabled":versionEnabled,
                            "isEdocFolder":false
                        };
                        createFolder4pige(params,false,callbackObj);
                    }
                },[cmp.i18n("doc.h5.cancel"),cmp.i18n("doc.h5.OK")],cmp.i18n("doc.h5.create.foleder.name"),"",1,1);
                createBgDiv();
			});
			cmp(".add-close").on("tap", "span", function() {
				_$("#addDivFilter").style.display = "none";
				_$("#addDiv").style.display = "none";
			});
			// cmp(".add-upload-folder").on("tap", ".add-upload-folder-back", function() {
			// 	_$("#addDivFilter").style.display = "none";
			// 	_$("#addDiv").style.display = "none";
			// 	cmp.notification.prompt(cmp.i18n("doc.h5.create.foleder"),function (index,title,callbackObj) {
			// 		if (index == 0) {
			// 			cmp.notification.close();
			// 		} else if (index == 1) {
			// 			var params = {
			// 				"title":title,
			// 				"docLibId":docLibId,
			// 				"parentFrId":parentFrId,
			// 				"commentEnabled":commentEnabled,
			// 				"recommendEnable":recommendEnable,
			// 				"versionEnabled":versionEnabled,
			// 				"isEdocFolder":false
			// 			};
			// 			createFolder4pige(params,false,callbackObj);
			// 		}
			// 	},[cmp.i18n("doc.h5.cancel"),cmp.i18n("doc.h5.OK")],cmp.i18n("doc.h5.create.foleder.name"),"",1,1);
            //
			// });
			initOpen4pige();
		}

		//初始化归档事件
		function initPigeonhole(){
			//确定点击事件
			cmp(".footer-style").on("tap", "#ok", function() {
				var parentNode = document.getElementById("breadcrumb");
				var cmpData = cmp.parseJSON(parentNode.getElementsByClassName("no-text")[0].getAttribute("cmp-data"))[0];
				var tagA = document.getElementById("breadcrumb").getElementsByTagName("a");
				var fullPath = "";
				for(var i=0;i<tagA.length;i=i+2){
					fullPath = fullPath + "/"+ tagA[i].innerHTML;
				}
				fullPath = fullPath.substring(1,fullPath.length);
				if(cmpData["all"] == true || cmpData["edit"] == true || cmpData["add"] == true){
					cmp.notification.confirm(cmp.i18n("doc.h5.pigeonhole.be.sure"),function(index){
						if (index == 0) {
							cmp.notification.toastExtend(cmp.i18n("doc.h5.cancel"),"center",1000);
							_$(".content-typical2").style.width = "200px";
							_$(".content-typical2").style.textAlign = "center";
							document.querySelector(".cmp-backdrop").style.zIndex = 90;
							cmp.notification.close();
						} else if (index == 1) {
							//_$("#docPigeonhole").classList.remove('cmp-active');
							_$("#docPigeonhole").style.display="none";
							if(callback && typeof callback == "function"){
								var params={
									   "id":cmpData["fr_id"],
									   "name":cmpData["fr_name"],
									   "fullPath":fullPath,
									   "msg":"OK"
							   };
							   callback(params);
							}
							document.querySelector(".cmp-backdrop").style.zIndex = 90;
							cmp.notification.close();
						}
					},cmp.i18n("doc.h5.remind"),[cmp.i18n("doc.h5.cancel"),cmp.i18n("doc.h5.OK")],-1,1);
				}else{
					cmp.notification.toastExtend(cmp.i18n("doc.h5.no.right","center"),1000);
					_$(".content-typical2").style.width = "200px";
					_$(".content-typical2").style.textAlign = "center";
				}
			});
			//取消点击事件
			cmp(".footer-style").on("tap", "#cancel", function() {
//				cmp.notification.toastExtend(cmp.i18n("doc.h5.cancel"),"center",1000);
//				_$(".content-typical2").style.width = "200px";
//				_$(".content-typical2").style.textAlign = "center";
				cmp.notification.close();
				//_$("#docPigeonhole").classList.remove('cmp-active');
				_$("#docPigeonhole").style.display="none";
				if(callback && typeof callback == "function"){
				   var params={
						   "msg":"cancel"
				   };
				   callback(params);
				}
			});
		}
		//初始化面包屑事件
		function prevPage4pige() {
			cmp("header").on('tap', "#prev", function(e) {
				backClick4pige();
			});
		}

		function backClick4pige(){
			var parentNode = document.getElementById("breadcrumb");
			if (parentNode.getElementsByClassName("on-text").length > 0) {
				var a_size = _$("#breadcrumb").getElementsByTagName("a").length;
		        var index = a_size - 3;
		        for(var i = a_size - 1; i > index; i--){
		        	_$("#breadcrumb").removeChild(_$("#breadcrumb").getElementsByTagName("a")[i]);
		        }
		        var newIndex = _$("#breadcrumb").getElementsByTagName("a").length-1;
		        var lastATag = _$("#breadcrumb").getElementsByTagName("a")[newIndex];
		        lastATag.className = "no-text";
		        var _id = lastATag.getAttribute("id");
				var cmpData = cmp.parseJSON(lastATag.getAttribute("cmp-data"))[0];
				initListView4pige(false,cmpData);
			} else if(parentNode.getElementsByClassName("on-text").length == 0 && parentNode.getElementsByClassName("no-text").length==1){
				_$("#breadcrumb").innerHTML="";
				initListView4pige(true,null);
			} else {
				//_$("#docPigeonhole").classList.remove('cmp-active');
				_$("#docPigeonhole").style.display="none";
				cmp.backbutton.pop();
				if(batchData != ""){
					unLockH5Workflow(batchData);
				}
			}
		}
		//返回的根-文档库列表
		function goHome4pige() {
			cmp("#breadTop").on("tap", ".local", function() {
				initListView4pige(true,null);
				_$("#breadcrumb").innerHTML="";
			});
		}

		//渲染函数
		function renderData(data, isRefresh) {
			var html = cmp.tpl(dynamic_html, data);
			var content_dom = document.getElementById("list_content");
			if (isRefresh) {
				content_dom.innerHTML = html;
			} else {
				content_dom.innerHTML = content_dom.innerHTML + html;
			}
		}

		var obj = {};
		function initOpen4pige() {
			cmp("#list_content").on("tap", ".cmp-list-cell",
				function() {
					var cmpData = cmp.parseJSON(this.getAttribute("cmp-data"));
					var frId = cmpData["fr_id"];
					obj = {};
					obj.cmpData = cmpData;
					cmp.dialog.loading();
					$s.Doc.isExist({
						"drId": frId,
						"frType": cmpData["fr_type"]
					}, {repeat:true,
						success: function(result) {
							if (!result) {
								cmp.notification.alert(cmp.i18n("doc.notExist"), function() {
									location.reload(true);
								}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
								return;
							} else {
								initListView4pige(false,cmpData);
								getPath4pige(cmpData);
							}
							cmp.dialog.loading(false);
						},
				        error: function(error){
				        	var cmpHandled = cmp.errorHandler(error);
			                if(cmpHandled){
			                	
			                }else{
			                }
			                cmp.dialog.loading(false);
				        }
					});
				}, false);
		}

		function initListView4pige(isRoot,cmpData) {
			var param = {};
			var _id = 0;
			if(null == cmpData){
				document.getElementById("add").style.display = "none";
			}
			if (!isRoot) {
				isShowUpload4pige(cmpData);
				_$(".footer-style").style.display="block";
				param = {
					"resId":cmpData["fr_id"],
					"frType":cmpData["fr_type"],
					"docLibId":cmpData["doc_lib_id"],
					"docLibType":cmpData["doc_lib_type"],
					"isShareAndBorrowRoot":cmpData["isshare_and_borrowroot"],
					"logicalPath":cmpData["logical_path"],
					"all":cmpData["all"],
					"edit":cmpData["edit"],
					"add":cmpData["add"],
					"projectTypeId":cmpData["project_type_id"],
					"commentEnabled":cmpData["commentEnabled"]
				};
				_id = cmpData["fr_id"];
			}else{
				_$(".footer-style").style.display="none";
			}
			cmp.dialog.loading();
			cmp.listView("#allPending", {
				config: {
					pageSize: 20,
					params: param,
					crumbsID: _id,
					dataFunc: function(params,options){
						if(isRoot){
							$s.Docs.pigeonholeList(params,{
								success:function(result){
									options.success(result);
								},
						        error: function(error){
						        	var cmpHandled = cmp.errorHandler(error);
					                if(cmpHandled){
					                	
					                }else{
					                }
						        }
							})
						}else{
							$s.Docs.pigeonholeFolder(params,{
								success:function(result){
									options.success(result);
								},
						        error: function(error){
						        	var cmpHandled = cmp.errorHandler(error);
					                if(cmpHandled){
					                	
					                }else{
					                }
						        }
							});
						}
					},
					renderFunc: renderData,
					isClear: true
				},
				down: {
					contentdown: cmp.i18n("doc.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					contentover: cmp.i18n("doc.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					contentrefresh: cmp.i18n("doc.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				},
				up: {
					contentdown: cmp.i18n("doc.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
					contentrefresh: cmp.i18n("doc.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: cmp.i18n("doc.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
				}
			});
			cmp.dialog.loading(false);
		}

		//生成当前面包屑
		function getPath4pige(cmpData) {
			cmp.dialog.loading();
			$s.Docs.getPath(cmpData["fr_id"],cmpData["isShareAndBorrowRoot"],cmpData["fr_type"],true, "", {
				repeat:true,
				success: function(result) {
					if(!result.getPathNull){
						_$("#breadcrumb").innerHTML = result.docNames;
		            	var index = _$("#breadcrumb").getElementsByTagName("a").length-1;
		                _$("#breadcrumb").getElementsByTagName("a")[index].className = "no-text";
					}
					breadLength();
					cmp.dialog.loading(false);
				},
		        error: function(error){
		        	var cmpHandled = cmp.errorHandler(error);
	                if(cmpHandled){
	                	
	                }else{
	                }
	                cmp.dialog.loading(false);
		        }
			});
		}

		/*是否显示上传按钮*/
		function isShowUpload4pige(cmpData){
			var upload = document.getElementById("add");
			cmpData4Create = cmpData;
			all = cmpData["all"];
			add = cmpData["add"];
			edit = cmpData["edit"];
			commentEnabled = cmpData["commentEnabled"];
			recommendEnable = cmpData["recommendEnable"];
			versionEnabled = cmpData["versionEnabled"];
			docLibId = cmpData["doc_lib_id"];
			parentFrId = cmpData["fr_id"];
			if(all == true || add == true || edit == true){
				upload.style.display = "block";
			}else{
				upload.style.display = "none";
			}
		}

		//创建文件夹
		function createFolder4pige(params,isEdocFolder,callbackObj){
			var msg = checkForm4pige(params);
			if(msg !="" ){
				if(isEdocFolder){
					document.getElementById("resultMsg").innerHTML = msg;
				}else{
					document.querySelector(".error").style.marginTop = "-15px";
					document.querySelector(".error").style.width = "84%";
					callbackObj.error(msg);
				}
				flag = false;
			}else{
			    cmp.dialog.loading();
				$s.Docs.createFoleder({},params,{
					success:function(result){
					    cmp.dialog.loading(false);
						if(result.code != '0'){
							if(isEdocFolder){
								if(result.message == "same name" || result.message == "doc_upload_dupli_name_folder_failure_alert"){
									result.message = cmp.i18n("doc.h5.same.folder.name");
								}
								document.getElementById("resultMsg").innerHTML = result.message;
							}else{
								var info = "";
								if(result.message == "no folder"){
									info = cmp.i18n("doc.h5.no.exist.folder");
								}else if(result.message == "too deep"){
									info = cmp.i18n("doc.h5.too.deep");
								}else if(result.message == "same name" || result.message == "doc_upload_dupli_name_folder_failure_alert"){
									info = cmp.i18n("doc.h5.same.folder.name");
								}
								_$(".error").style.marginTop = "-15px";
								_$(".error").style.width = "84%";
								callbackObj.error(info);
							}
							
						}else{
						    _$("#docDrop").remove();
							reloadList4pige();
							cmp.notification.close();
						}
						flag = false;
					},
			        error: function(error){
			        	var cmpHandled = cmp.errorHandler(error);
		                if(cmpHandled){
		                	
		                }else{
		                }
		                cmp.dialog.loading(false);
			        }
				});
			}
		}
		//校验
		function checkForm4pige(params){
			var msg = "";
			var title = params["title"];
			if(title==""||title==null){
				return cmp.i18n("doc.h5.name.null");
			}
			if(title.length>80){
				return cmp.i18n("doc.h5.name.length");
			}
			return msg;
		}
		//重新加载List
		function reloadList4pige(){
			if(_$(".no-text")){
				initListView4pige(false,cmpData4Create);
			}else{
				location.reload(true);
			}
		}

		/**
		 * 简化选择器
		 * @param selector 选择器
		 * @param queryAll 是否选择全部
		 * @param 父节点
		 * @returns
		 */
		function _$(selector, queryAll, pEl) {
			var p = pEl ? pEl : document;
			if (queryAll) {
				return p.querySelectorAll(selector);
			} else {
				return p.querySelector(selector);
			}
		}

		/**
		 * 获取面包屑的宽度
		 */
		function breadLength() {
			var len = document.getElementById("breadcrumb").clientWidth + 120;
			bread(len);
		}

		/**
		 * 面包屑滚动
		 * @param b_width 面包屑宽度
		 */

		function bread(b_width) {
			var boxscrolll = document.getElementById('boxscrolll');
			var scroll = boxscrolll.querySelector('.cmp-scroll');
			scroll.style.width = (b_width + 15) + "px"; // 这里宽度需要动态计算
			is_scroll.refresh();
			is_scroll.scrollTo(-(is_scroll.scrollerW),0);
		}
		
		function createBgDiv() {
		    var dialogBgDiv = document.createElement("div");
            dialogBgDiv.className = "backdrop cmp_bomb_box_backdrop";
            dialogBgDiv.id = "docDrop";
            document.body.appendChild(dialogBgDiv);
		}
		
		/****************************************************************************************/
    }); 
	
}