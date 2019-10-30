/*!
 * @description	秀吧新建页面js	
 * @file		createShowbar.js
 * @author 		shuqi 	
 * @date		2017-03-01
 */
;~(function(cmp,window,$api,$){
	var params = {};//上个页面传递的参数
	var serverIp = "";//服务器的URL
	var defaultImages = [//预制封面
	     {id:"-7378617585173706080",url:showPath + "/img/default_image/-7378617585173706080_custom_w550_h150_q100.png"},
	     {id:"-2313702924338770333",url:showPath + "/img/default_image/-2313702924338770333_custom_w550_h150_q100.png"},
	     {id:"966281017460146438",  url:showPath + "/img/default_image/966281017460146438_custom_w550_h150_q100.png"},
	     {id:"3860273615415034170", url:showPath + "/img/default_image/3860273615415034170_custom_w550_h150_q100.png"},
	     {id:"7498696614584405552", url:showPath + "/img/default_image/7498696614584405552_custom_w550_h150_q100.png"}
	     ];
	var $sliderIndex = $("#slider_index");//缓存当前位置的dom
	var $coverPictrue = $("#cover_pictrue_id");//封面
	var $showbarName = $("#showbar_name");//秀吧名
	var $isA8Group = $("#isA8Group");
	var $operaType = $("#opera_type");
	var $startDate = $("#startDate");
	var $endDate = $("#endDate");
	var $showbarId = $("#showbar_id");
	var $rangeValue = $("#range_value");
	var $showbarSummary = $("#showbar_summary");
	var $summaryLi = $("#summary_li");
	var $locationIcon = $("#location_icon");
	var $location = $("#location");
	var $showbarLocation = $("#showbar_location");
	function trim(text){
		return text == null ? "" : ( text + "" ).replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g , "" );
	}
	//取消退出新建主题页面
	function cancelCreateShowbar() {
		cmp.notification.confirm(cmp.i18n("Show.interactive.cancelEdit"), function(e) {
			if (e == 1) {
				cmp.href.back();
			}
		}, null, [ cmp.i18n("Show.cancel"), cmp.i18n("Show.page.label.quit") ]);
	}
	
	
	cmp.ready(function() {
		serverIp = cmp.serverIp ? cmp.serverIp : ""
		params = cmp.href.getParam();
		//返回事件
	    cmp.backbutton();
	    cmp.backbutton.push(cancelCreateShowbar);
		//初始化页面基本数据
		showbarEditor.init();
	});
	
	//=========================================================================================
	//		输入主题简介
	//=========================================================================================
	var showbarSummary = 
	{
			init:false,
			open:function(summary,callback){
				var $summaryContent=$('#summary_content');
				$summaryContent.classList.add('cmp-active');
				if(!showbarSummary.init){
					if(summary){
						$("#textarea").value = summary;
					}
					$("#show-summary-send").addEventListener('tap', function(){
						var summary = trim($("#textarea").value);
						if (summary.length > 300) {
							cmp.notification.toast(cmp.i18n("Show.interactive.summaryNotOver"));
							return false;
						}
						showbarSummary.close();
						$("#textarea").value = summary;
						callback(summary);
					});
					
					cmp.backbutton();
					cmp.backbutton.push(function(){
						showbarSummary.close();
					});
					showbarSummary.init = true;
				}
			},
			close:function(){
				var location_content=document.querySelector('#summary_content');
				location_content.classList.remove('cmp-active');
				cmp.backbutton.pop();
			}
	};
	
	//=========================================================================================
	//		选择范围子页面页面
	//=========================================================================================
	var showbarScope = 
	{
		init:false,
		open:function(initDate,callback){
			$("#showbar-scope").classList.add('cmp-active');
			if(!showbarScope.init){
				//回填数据
				var fillBackData = [];
				if(initDate.showbarAuthScope == "Part"){
					$("#select-member").classList.add("active");
					var memberIds = initDate.showbarAuth.split(",");
					var memberNames = initDate.showbarAuthString.split("、");//这个地方要是人员名称有、号就悲剧了
					for(var i = 0 ; i < memberIds.length ; i++){
						if(memberIds[i] === ""){
							continue;
						}
						var id = memberIds[i].split("|");
						var mem = {
							"id" : id[1],
							"name" : memberNames[i],
							"type" : id[0]	
						}
						fillBackData.push(mem);
					}
				}else{
					$("#" + initDate.showbarAuthScope).classList.add('cmp-selected');
				}
				//注册事件
				cmp("#showbar-scope").on("tap","li.cmp-table-view-cell",function(){
					var backData = {};
					backData.showbarAuthScope = this.getAttribute("id");
					backData.showbarAuth = "";
					backData.showbarAuthString = this.querySelector("span").innerHTML;
					showbarScope.close();
					callback(backData);
				}).on("tap","#select-member",function(){
					showbarScope.close();
				});
				
				//加载选人
				var csses = [cmpPath + "/css/cmp-selectOrg.css" + $buildversion];
				var jses = [cmpPath + "/js/cmp-selectOrg.js" + $buildversion];
				if(!cmp.listView){//顺序很重要
					jses.unshift(cmpPath + "/js/cmp-imgCache.js" + $buildversion);
					jses.unshift(cmpPath + "/js/cmp-listView.js" + $buildversion);
					cmp.asyncLoad.css([cmpPath + "/css/cmp-listView.css" + $buildversion])
				}
				cmp.asyncLoad.css(csses);
				cmp.asyncLoad.js(jses,function(){
					cmp.selectOrg("select-member", {
						type:1,
						flowType:2,
						permission : false,//OA-102650
						fillBackData : fillBackData,
						jump : false,
						maxSize:-1,
						minSize:1,
						seeExtAccount:false,
						selectType : 'member',
						callback : function(result){
							if ($(".cmp-selected") != null) {
								$(".cmp-selected").classList.remove("cmp-selected");
							}
							var resultObj = JSON.parse(result);
							var orgResult = resultObj.orgResult;
							if (orgResult.length > 0) {
								var selectStr = "";
								var selectName = "";
								for (var i = 0; i < orgResult.length; i++) {
									var orgResultObj = orgResult[i];
									if (i > 0) {
										selectStr += ",";
										selectName += "、";
									}
									selectStr += orgResultObj.type + "|" + orgResultObj.id;
									selectName += orgResultObj.name;
								}
								//选人
								var backData = {};
								backData.showbarAuthScope = "Part";
								backData.showbarAuth = selectStr;
								backData.showbarAuthString = selectName;
								callback(backData);
							}
						}
					});
				});
				if($isA8Group.value == "true"){
					$("#All_group").style.display = "";
				}
				showbarScope.init = true;
			}
			//Android手机返回按钮监听
	        cmp.backbutton();
	        cmp.backbutton.push(showbarScope.close);
		},
		//关闭页面
		close:function(){
			$("#showbar-scope").classList.remove('cmp-active');
			cmp.backbutton.pop();
		}
	};
	
	//=========================================================================================
	//		定位子页面页面
	//=========================================================================================
	var showbarLocation = 
	{
		openLocationList : function() {
			var location_content = $('#location_content');
			location_content.classList.add('cmp-active');
			var locationName = document.querySelector("#location").innerHTML;
			if (locationName.indexOf("·") > -1) {// 如果带有点，表示会有城市的前缀
				locationName = locationName.split("·")[1];
			} else if (locationName === cmp.i18n("Show.page.label.place")){
				locationName = "";
			}
			$ShowLbs.init({
				selectedLocation : locationName,
				selectedCallback : function(selectedLocationName, currentCity) {
					if (selectedLocationName === cmp.i18n("Show.page.label.noLocation")) {
						showbarEditor.setLocation(cmp.i18n("Show.page.label.place"));
					} else if (selectedLocationName === currentCity) {// 选择的就是城市
						showbarEditor.setLocation(selectedLocationName);
					} else {// 选择的是地名，在地名前加城市前缀
						showbarEditor.setLocation(currentCity + "·" + selectedLocationName);
					}
				}
			});
		}
	};
	
	// =========================================================================================
	//		秀吧基本操作
	//=========================================================================================
	var showbarEditor = 
	{
		init:function() {
			params = (params ? params : {});
			if (params.operaType == "modify") {
				$("#create_btn").innerHTML = cmp.i18n("Show.page.button.finish");
				document.title = cmp.i18n("Show.page.label.modifyTopic");
			} else {
				params.operaType = "new";
				$("#create_btn").innerHTML = cmp.i18n("Show.page.button.create");
				document.title = cmp.i18n("Show.page.button.createTheme");
			}
			
			//初始化封面
			{
				var toIndex = 0;//使用预制封面情况，跳转到对应封面下
				if(params.coverPicture != null){
					//没有使用预制封面的情况下，将上传的封面放在第一位
					var isDefaultImage = false;
					for(var i = 0; i < defaultImages.length; i++){
						if(params.coverPicture == defaultImages[i].id){
							isDefaultImage = true;
							toIndex = i;
						}
					}
					if(!isDefaultImage){
						var coverPicture = {
								id : params.coverPicture,
								url : serverIp + "/seeyon/commonimage.do?method=showImage&q=0.2&id="+ params.coverPicture +"&size=custom&h=150&w=550&handler=show"
						};
						defaultImages.unshift(coverPicture)
					}
				}
				//生成轮播
				var silder = showbarEditor.createSlider(defaultImages);
				if(toIndex != 0){
					silder.gotoItem(toIndex);
				}
			}
			
			//回填秀详情的数据
			if (params.operaType == "modify") {
				$api.Show.getShowbarDetail(params.showbarId,"",{
					success : function(showbarInfo){
						showbarEditor.filterShowbarData(showbarInfo, params);
						showbarEditor.fillShowbarDetail(showbarInfo);
						$operaType.value = params.operaType;
						//初始化页面事件
						showbarEditor.initPageEvent(showbarInfo);
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			} else {
				showbarEditor.fillShowbarDetail(params);
				$api.Show.hasGroupAuth("",{
					success : function(result){
						$isA8Group.value = result;
						var showAuth = {};
						showAuth.showbarAuthScope = "All";
						showAuth.showbarAuth = "";
						showAuth.showbarAuthString = cmp.i18n("Show.page.label.unitLabel");
						//初始化页面事件
						showbarEditor.initPageEvent(showAuth);
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			}
		},
		// 生成轮播图
		createSlider : function(imageList){
			var $slider = $("#slider");
			var sliderGroup = '<div class="cmp-slider-group">';
			if (imageList.length > 0) {
				sliderGroup += '<div class="cmp-slider-item cmp-slider-item-duplicate cmp-hidden">';
				sliderGroup += '	<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC">                            ';
				sliderGroup += '</div>                                                            ';
				//封面高度动态计算：
				for (var i = 0; i < imageList.length; i++) {
					var imageId = imageList[i].id;
					var index = i + 1;
					sliderGroup += '<div class="cmp-slider-item show-cmp-slider-item" imageId="' + imageId + '" id="slider_item_' + index + '" slider-index="' + index + '"  style="height:' + showCoverHeight + 'px;">';
					sliderGroup += '	<img src="' + imageList[i].url + '" alt="" style="height:' + showCoverHeight + 'px;"/>';
					sliderGroup += '</div>';
				}
				sliderGroup += '<div class="cmp-slider-item cmp-slider-item-duplicate cmp-hidden">';
				sliderGroup += '	<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC">                            ';
				sliderGroup += '</div>                                                            ';
				
				$sliderIndex.innerHTML = 1;
				$("#slider_total").innerHTML = imageList.length;
				$coverPictrue.value = imageList[0].id;
			}
			sliderGroup += "</div>";
			var getSlider = $slider.innerHTML;
			$slider.innerHTML= sliderGroup + getSlider;
			var sid = cmp("#slider").slider();
			
			// slide 滚动事件回调
			$slider.addEventListener('slide', function(event){
				var currentIndex =  $("#slider_index").innerText;
				var currentSliderItem = $("#slider_item_" + currentIndex);
				//改变页面的index
				$coverPictrue.value = currentSliderItem.getAttribute("imageId");
			});
			return sid;
		},
		initPageEvent:function(showbarAuth){
			$startDate.addEventListener('tap', showbarEditor.openDtpicker);
			$endDate.addEventListener('tap', showbarEditor.openDtpicker);
			//授权范围
			$("#public_range").addEventListener('tap', function() {
				showbarScope.open(showbarAuth,function(showAuth){
					showbarEditor.setShowbarAuth(showAuth);
				});
			});
			//主题简介
			$("#summary_btn").addEventListener('tap', function() {
				showbarSummary.open(showbarAuth.summary,function(summary){
					showbarEditor.setSummary(summary);
				});
			});
			//新建按钮
			$("#create_btn").addEventListener('tap', createShowbar);
			
			//地点
			var loadedLocaltion = false;
			$("#location_btn").addEventListener('tap', function() {
				if(loadedLocaltion){
					showbarLocation.showbarLocation();
				}else{
					cmp.dialog.loading(); 
					var jses = [cmpPath + "/js/cmp-lbs.js" + $buildversion,
					            showPath + "/js/show-lbs-debug.js" + $buildversion ];
					if(!cmp.listView){//顺序很重要
						jses.unshift(cmpPath + "/js/cmp-imgCache.js" + $buildversion);
						jses.unshift(cmpPath + "/js/cmp-listView.js" + $buildversion);
						cmp.asyncLoad.css([cmpPath + "/css/cmp-listView.css" + $buildversion])
					}
					cmp.asyncLoad.js(jses,function(){
						cmp.dialog.loading(false); 
						showbarLocation.openLocationList();
					});
				}
			});
		},
		setShowbarAuth:function(showbarInfo){
			//授权范围
			var scope = StringUtil.isEmpty(showbarInfo.showbarAuthScope) ? "All" : showbarInfo.showbarAuthScope;
			if("All_group" == scope){
				authtxt = cmp.i18n("Show.page.label.group");
			}else if("All" == scope){
				authtxt = cmp.i18n("Show.page.label.unit");
			}else if("All_extend_externalStaff" == scope){
				authtxt = cmp.i18n("Show.page.label.externalPartners");
			}else if("Part" == scope){
				authtxt = showbarInfo.showbarAuthString;
			}
			$rangeValue.value = scope;
			$("#range_text").innerHTML = StringUtil.cutString(authtxt, 30, true);
			$("#showbar_auth_str").value = authtxt;
			$("#showbar_auth").value = StringUtil.isEmpty(showbarInfo.showbarAuth) ? "" : showbarInfo.showbarAuth;
			if("Part" === scope){
				$(".public_range_li").classList.add("active");
			}
		},
		setLocation:function(locationText) {
			if (StringUtil.isEmpty(locationText) || locationText == cmp.i18n("Show.page.label.place")) {
				$location.innerHTML = cmp.i18n("Show.page.label.place");
				$locationIcon.classList.remove("cmp-active");
				$showbarLocation.value = "";
			} else {
				$locationIcon.classList.add("cmp-active");
				$location.innerHTML = StringUtil.cutString(locationText, 20, true);
				$showbarLocation.value = locationText;
			}
		},
		setSummary:function(summary){
			if (StringUtil.isNotEmpty(summary)) {
				$showbarSummary.value = summary;
				$summaryLi.classList.add("active");
			} else {
				$showbarSummary.value = "";
				$summaryLi.classList.remove("active");
			}
		},
		fillShowbarDetail:function(showbarInfo) {
			if (showbarInfo) {
				$showbarId.value = StringUtil.isEmpty(showbarInfo.id) ? "" : showbarInfo.id;
				$showbarName.value = StringUtil.isEmpty(showbarInfo.showbarName) ? "" : showbarInfo.showbarName;
				$startDate.value = StringUtil.isEmpty(showbarInfo.startDate) ? "" : showbarInfo.startDate;
				$endDate.value = StringUtil.isEmpty(showbarInfo.endDate) ? "" : showbarInfo.endDate;
				showbarEditor.setShowbarAuth(showbarInfo);
				$("#isA8Group").value = showbarInfo.isA8Group ;
				//简介
				showbarEditor.setSummary(showbarInfo.summary);
				//定位
				showbarEditor.setLocation(showbarInfo.address);
			}
		},
		filterShowbarData:function(showbarInfo, paramsObj) {
			showbarInfo.showbarId = StringUtil.isEmpty(paramsObj.showbarId) ? showbarInfo.id : paramsObj.showbarId;
			showbarInfo.showbarName = StringUtil.isEmpty(paramsObj.showbarName) ? showbarInfo.showbarName : paramsObj.showbarName;
			showbarInfo.summary = StringUtil.isEmpty(paramsObj.summary) ? showbarInfo.summary : paramsObj.summary;
			showbarInfo.address = StringUtil.isEmpty(paramsObj.address) ? showbarInfo.address : paramsObj.address;
			showbarInfo.startDate =StringUtil.isEmpty(paramsObj.startDate) ? showbarInfo.startDate : paramsObj.startDate;
			showbarInfo.endDate = StringUtil.isEmpty(paramsObj.endDate) ? showbarInfo.endDate : paramsObj.endDate;
			showbarInfo.showbarAuthScope = StringUtil.isEmpty(paramsObj.showbarAuthScope) ? showbarInfo.showbarAuthScope : paramsObj.showbarAuthScope;
			showbarInfo.showbarAuth =  StringUtil.isEmpty(paramsObj.showbarAuth) ? showbarInfo.showbarAuth : paramsObj.showbarAuth;
			showbarInfo.showbarAuthString = StringUtil.isEmpty(paramsObj.showbarAuthString) ? showbarInfo.showbarAuthString : paramsObj.showbarAuthString;
			showbarInfo.operaType = StringUtil.isEmpty(paramsObj.operaType) ? showbarInfo.operaType : paramsObj.operaType;
		},
		loadedTimePicker: false,
		openDtpicker:function() {
			var optionsJson = this.getAttribute("data-options") || "{}";
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute("id");
			if(showbarEditor.loadedTimePicker){
				var picker = new cmp.DtPicker(options);
				var selectedValue = $("#" + id).value;
				if(isDate(selectedValue)){
					picker.setSelectedValue(selectedValue);
				}
				picker.show(function(rs) {
					$("#" + id).value = rs.value;
					picker.dispose();
				});
			}else{
				cmp.dialog.loading(); 
				var csses = [cmpPath+ "/css/cmp-picker.css" + $buildversion];
				var jses = [cmpPath + "/js/cmp-picker.js" + $buildversion,
				            cmpPath + "/js/cmp-dtPicker.js" + $buildversion];
				cmp.asyncLoad.css(csses);
				cmp.asyncLoad.js(jses,function(){
					cmp.dialog.loading(false); 
					showbarEditor.loadedTimePicker = true;
					var picker = new cmp.DtPicker(options);
					var selectedValue = $("#" + id).value;
					if(isDate(selectedValue)){
						picker.setSelectedValue(selectedValue);
					}
					picker.show(function(rs) {
						$("#" + id).value = rs.value;
						picker.dispose();
					});
				});
			}
		}
	};
	
})(cmp,window,SeeyonApi,function(selector, queryAll , target ) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
});


// =========================================================================================
//		心累不想清理了
//=========================================================================================
function getShowbarData() {
	var paramObj = new Object();
	paramObj.showbarId = _$("#showbar_id").value;
	paramObj.coverPicture = _$("#cover_pictrue_id").value;
	paramObj.showbarName = _$("#showbar_name").value;
	paramObj.summary = _$("#showbar_summary").value;
	paramObj.address = _$("#showbar_location").value;
	paramObj.startDate = _$("#startDate").value;
	paramObj.endDate = _$("#endDate").value;
	paramObj.showbarAuthScope = _$("#range_value").value;
	paramObj.showbarAuth = _$("#showbar_auth").value;
	paramObj.showbarAuthString = _$("#showbar_auth_str").value;
	return paramObj;
}

/**
 * 验证主题名称
 * 
 * @param showbarName 主题名称
 * @returns {Boolean} true或false
 */
function validateShowbarName(showbarName) {
	if (StringUtil.isEmpty(showbarName.trim())) {
		cmp.notification.toast(cmp.i18n("Show.interactive.themeNotNone"),"center");
		return false;
	}
	if (showbarName.trim().length > 30) {
		cmp.notification.toast(cmp.i18n("Show.interactive.themeNotOver"),"center");
		return false;
	}
	var showbarId = _$("#showbar_id").value;
	if (StringUtil.isEmpty(showbarId)) {
		showbarId = -1;
	}
	return true;
}
/**
 * 验证主题的发布地址
 * 
 * @param showbarAddress 主题地址
 * @returns {Boolean} true或false
 */
function validateAddress(showbarAddress) {
	if (showbarAddress.trim().length > 30) {
		cmp.notification.toast(cmp.i18n("Show.interactive.locationNotOver"),"center");
		return false;
	}
	return true;
}
/**
 * 验证主题封面
 * 
 * @param coverPicture 主题封面图片
 * @returns {Boolean} true或false
 */
function validateCoverPicture(coverPicture) {
	if (coverPicture == "-1" ) {
//		if (isUploadCover == false) {
		cmp.notification.toast(cmp.i18n("Show.interactive.uploadCover"),"center");
		return false;
//		}
	}
	return true;
}
/**
 * 验证主题开始时间和结束时间
 * 
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns {Boolean} true或false
 */
function validateDate(startDate, endDate) {
	if (StringUtil.isNotEmpty(startDate) && !isDate(startDate)){
		cmp.notification.toast(cmp.i18n("Show.interactive.startTime.notdate"),"center");
		return false;
	}
	if (StringUtil.isNotEmpty(endDate) && !isDate(endDate)){
		cmp.notification.toast(cmp.i18n("Show.interactive.endTime.notdate"),"center");
		return false;
	}
	
	if (StringUtil.isNotEmpty(startDate) && StringUtil.isNotEmpty(endDate)) {
		if (compareDate(startDate, endDate) > 0) {
			cmp.notification.toast(cmp.i18n("Show.interactive.startTimeEndTime"),"center");
			return false;
		}
	} else {
		if (StringUtil.isEmpty(startDate) && StringUtil.isNotEmpty(endDate)) {
			cmp.notification.toast(cmp.i18n("Show.interactive.enterStartTime"),"center");
			return false;
		}
	}
	return true;
}
function isDate(str) {
	var DATE_FORMAT = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
	if (DATE_FORMAT.test(str)) {
		return true;
	} else {
		return false;
	}
}
function validateShowbar(showbarInfo,fn) {
	if (ParamUtil.isNotEmpty(showbarInfo) 
			&& validateCoverPicture(showbarInfo.coverPicture) 
			&& validateAddress(showbarInfo.address) 
			&& validateShowbarName(showbarInfo.showbarName) 
			&& validateDate(showbarInfo.startDate, showbarInfo.endDate)) {
				$s.Show.checkRepeatName("",{
						showbarName : showbarInfo.showbarName,
						showbarId : _$("#showbar_id").value == ""?"new":_$("#showbar_id").value
					},{
						success : function(isRepeat){
							if (isRepeat == false || isRepeat == "false") {
								cmp.notification.toast(cmp.i18n("Show.interactive.sameTheme"),"center");
								submitting = false;
								closeProgress();
								return false;
							}
							fn();
						},
						error :function(e){
							submitting = false;
							closeProgress();
							dealAjaxError(e);
						}
				});
		}else{
			submitting = false;
			closeProgress();
		}
}
/**
 * 将日期字符转换成日期类型
 * 
 * @param dateStr 日期字符串
 * @return 转换后日期
 */
function parseDate(dateStr) {
    return Date.parse(dateStr.replace(/\-/g, '/'));
}
/**
 * 比较两个字符串日期的前后，不比较时间
 * 
 * @param dateStr1 日期1 字符串
 * @param dateStr2 日期2 字符串
 * @return 负整数、零或正整数，根据此对象是小于、等于还是大于
 */
function compareDate(dateStr1, dateStr2) {
    return parseDate(dateStr1) - parseDate(dateStr2);
}
/**
 * 启动进度条
 */
function startProgress() {
	progressObj = new ProgressBar({
	    text: cmp.i18n("Show.interactive.saving")
	});
}
/**
 * 关闭进度条
 */
function closeProgress() {
    if (progressObj && progressObj != null) {
    	progressObj.close();
    	progressObj = null;
    }
}
/**
 * 上传图片
 * 
 * @param filePath
 */
function uploadImages(filePath, successCallBack) {
	//FixMe /show/show.do?method=uploadImages 未登录都能上传，安全漏洞
	var rootPath = getRootPath();
    cmp.att.upload({
        url: rootPath + "/show/show.do?method=uploadImages",
        fileName: filePath,
        success: function (res) {
        	if (typeof successCallBack == "function" && ParamUtil.isNotEmpty(res.response)) {
				var result = JSON.parse(res.response);
				var pictrueFlies = result.files;
				if (pictrueFlies.length > 0) {
					successCallBack(pictrueFlies[0]);
				}
			}
        },
        error: function (res) {
        	cmp.notification.alert("error:"+res);
        }
    });
}
/**
 * 提交保存主题信息数据
 * 
 * @param paramObj 主题信息参数
 */
function submitShowbarData(paramObj) {
	//特殊表情转换
	if(cmp.Emoji){
		var cemoji = cmp.Emoji();
		if(paramObj.showbarName){
			paramObj.showbarName = cemoji.EmojiToString(paramObj.showbarName);
		}
		if(paramObj.summary){
			paramObj.summary = cemoji.EmojiToString(paramObj.summary);
		}
	}
	$s.Show.saveShowbarInfo({}, paramObj, {
		success : function(ret) {
			if (ret.success == true || ret.success == "true") {
				var showbarInfo = ret.showbar;
				closeProgress();
				fireWebviewEvent({
					isRefresh : true,
					listView : "showbar"
				});
				if (ParamUtil.isNotEmpty(showbarInfo)) {
					setTimeout(function(){
						cmp.href.go(_showPath + "/html/showbarDetail.html?date=" + (new Date().getTime()), {"id" : showbarInfo.id});
					},100);
				}
			}else{
				submitting = false;
				closeProgress();
				cmp.notification.toast(ret.error_msg, "center");
			}
		},
		error :function(e){
			submitting = false;
			var cmpHandled = cmp.errorHandler(e);
			if(!cmpHandled){
				cmp.notification.alert(cmp.i18n("Show.fails.save.showbar"),function(){
					cmp.href.go(_showPath + "/html/showIndex.html");
				},cmp.i18n("Show.page.button.tip"), cmp.i18n("Show.info.home.back"));
			}
		}
	});
}
function saveShowbarInfo(showbarInfo) {
	if (ParamUtil.isNotEmpty(showbarInfo)) {
		if (StringUtil.isNotEmpty(showbarInfo.picturePath)) {
			var picturePath = new Array();
			picturePath.push(showbarInfo.picturePath);
			uploadImages(picturePath, function(pictureFile) {
				showbarInfo.coverPicture = pictureFile.id;
				submitShowbarData(showbarInfo);
			});
		} else {
			submitShowbarData(showbarInfo);
		}
	}
}
var submitting = false;//标示是否正在提交
function createShowbar() {
	if(submitting){
		return;
	}
	submitting = true;
	startProgress();
	var showbarInfo = getShowbarData();
	validateShowbar(showbarInfo,function(){
		showbarInfo.createFrom = (cmp.platform.CMPShell ? 3 /* M3 */ : 2 /* WeiXin */);
		saveShowbarInfo(showbarInfo);
	});
}
