var $CreateShowpost = {};
var _ = {};

/**绑定基本事件*/
_.bindBasicEvent = function(){
	document.documentElement.style.fontSize = 20 * (document.documentElement.clientWidth / 375) + 'px';
	
	//Android手机返回按钮监听
    cmp.backbutton();
    cmp.backbutton.push(_.cancelPublish);
	
	//绑定发布按钮
	cmp.event.click(document.querySelector(".csp-button-save"),_.doPublish);
	
	//绑定新建图片事件
	var loadedAddImg = false;
	cmp("body").on("tap",".sc_img_container .add",function(){
		if(loadedAddImg){
			var allImgs = document.querySelectorAll(".sc_img_container img").length;
			var pictureNumber = PictureUtil.PICTURE_DEFAULT_NUM - allImgs;
			PictureUtil.addPictureControl(pictureNumber, _.createImgs);
		}else{
			var csses = [cmpPath + "/css/cmp-att.css" + $buildversion];
			cmp.asyncLoad.css(csses);
			var jses = [cmpPath + "/js/cmp-sliders.js" + $buildversion,
			            cmpPath + "/js/cmp-att.js" + $buildversion,
			            cmpPath + "/js/cmp-camera.js" + $buildversion];
			cmp.asyncLoad.js(jses,function(){
				loadedAddImg = true;
				var allImgs = document.querySelectorAll(".sc_img_container img").length;
				var pictureNumber = PictureUtil.PICTURE_DEFAULT_NUM - allImgs;
				PictureUtil.addPictureControl(pictureNumber, _.createImgs);
			});
		}
	});
	
	//点击主题
	var loadedSHowbarList = false;
	var queryParams = cmp.href.getParam();
	if(!(queryParams && queryParams.back == "showbarDetail")){
		cmp("body").on("tap","#publish_source_area", function(){
			if(loadedSHowbarList){
				$ShowbarNameList.open({
					selectedId : document.querySelector("#showbar_id").value,
					selectCallback : function(showbarId,showbarName){
						document.querySelector("#showbar_id").value = showbarId;
						document.querySelector("#publish_source").innerHTML = showbarName;
					}
				});
			}else{
				var csses = [cmpPath + "/css/cmp-search.css" + $buildversion,
				             cmpPath + "/css/cmp-picker.css" + $buildversion];
				cmp.asyncLoad.css(csses);
				var jses = [
							{"url":cmpPath + "/js/cmp-imgCache.js" + $buildversion,id:"cmpimgCache"},
							{"url":cmpPath + "/js/cmp-listView.js" + $buildversion,id:"cmplistView"},
				            cmpPath + "/js/cmp-search.js" + $buildversion,
				            cmpPath + "/js/cmp-picker.js" + $buildversion,
				            cmpPath + "/js/cmp-dtPicker.js" + $buildversion,
				            showPath + "/js/showbar-name-list-debug.js" + $buildversion];
				cmp.asyncLoad.js(jses,function(){
					loadedSHowbarList = true;
					$ShowbarNameList.open({
						selectedId : document.querySelector("#showbar_id").value,
						selectCallback : function(showbarId,showbarName){
							document.querySelector("#showbar_id").value = showbarId;
							document.querySelector("#publish_source").innerHTML = showbarName;
						}
					});
				});
			}
		});
	}
	
	//点击表情事件
	var contentText = document.querySelector("#cs_content_text");
	var KittyContainer = document.querySelector('.HelloKittyContainer');
	var Praise = document.querySelector('.Praise');
	Praise.addEventListener('tap',function(){
		if(KittyContainer.classList.contains('display_none')){
			if(_.emoji == null){
				var jses = [showPath + "/js/show-emoji-util-debug.js" + $buildversion ];
				cmp.asyncLoad.js(jses,function(){
					/**初始化表情对象*/
					_.emoji = new $emoji();
					_.emoji.init_emoji_ontainer("cs_content_text","cs_face_area",function(){
						contentText.value = contentText.value + "[" + this.getAttribute("_title") + "]";
					});
					KittyContainer.classList.remove('display_none');   //显示表情包
					//cmp.listView('.cs_scroll').refresh();
				});
			}else{
				KittyContainer.classList.remove('display_none');   //显示表情包
				//cmp.listView('.cs_scroll').refresh();
			}
		}else{
			KittyContainer.classList.add('display_none');     //隐藏表情包
			//cmp.listView('.cs_scroll').refresh();
		}
	});
	
	//绑定打开地理位置列表页面事件
	var loadedLocaltion = false;
	cmp("body").on("tap","#location_area",function(){
		if(loadedLocaltion){
			_.openLocationList();
		}else{
			cmp.dialog.loading(); 
			var jses = [{"url":cmpPath + "/js/cmp-imgCache.js" + $buildversion,id:"cmpimgCache"},
	            		{"url":cmpPath + "/js/cmp-listView.js" + $buildversion,id:"cmplistView"},
	            		cmpPath + "/js/cmp-lbs.js" + $buildversion,
			            showPath + "/js/show-lbs-debug.js" + $buildversion ];
			cmp.asyncLoad.js(jses,function(){
				loadedLocaltion = true;
				cmp.dialog.loading(false); 
				_.openLocationList();
			});
		}
	});
	
	/**
	 * @事件
	 */
	if(cmp.selectOrg){
		$CreateShowpost.atComponent = new AtComponent({
			handlerId : 'openAt',
			containerId : 'cs_content_text'
		});
	}else{
		cmp.asyncLoad.css([cmpPath+"/css/cmp-selectOrg.css" + $buildversion,
						   cmpPath+"/css/cmp-listView.css" + $buildversion]);
		cmp.asyncLoad.js([cmpPath+"/js/cmp-selectOrg.js" + $buildversion,
						  cmpPath+"/js/cmp-listView.js" + $buildversion,
						  cmpPath+"/js/cmp-imgCache.js" + $buildversion],function(){
			$CreateShowpost.atComponent = new AtComponent({
				handlerId : 'openAt',
				containerId : 'cs_content_text'
			});
		});
	}
	//处理andriod软键盘事件
	var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
	window.onresize = function(){
		var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
	    if (clientHeight - nowClientHeight > 50) {
	        document.querySelector('.csp-button-wapper').style.display = 'none';
	    }
	    else {
	        document.querySelector('.csp-button-wapper').style.display = 'block';
	    }
	}
}

$CreateShowpost.bindBasicEvent = _.bindBasicEvent;

/**取消发布*/
_.cancelPublish = function(){
	cmp.notification.confirm(cmp.i18n("Show.interactive.cancelEdit"), function(e) {
		if (e == 1) {
			_.backPage();
		}
	}, null, [ cmp.i18n("Show.cancel"), cmp.i18n("Show.page.label.quit") ]);
}

/**回到上一页*/
_.backPage = function(){
	//从哪里来  会哪里去，back即可
	var queryParams = cmp.href.getParam();
	if(queryParams){
		var showbarId = queryParams.showbarId;
		var back = queryParams.back;
		if(back == "showbarDetail" && showbarId){
			cmp.href.back(1,{data:{id:showbarId}});
		}else{
			cmp.href.back();
		}
	}else{
		cmp.href.back();
	}
}

/**执行发布*/
_.doPublish = function() {
	//输入框失去焦点
	if(document.querySelector(":focus")) document.querySelector(":focus").blur();
	
	var error = _.validateInput();
	if (error.length > 0) {
		cmp.notification.toast(error, "center");
		return;
	}
	startProgress();
	var paramObj = _.getShowpostData();
	if(paramObj.allImgs){
		_.uploadImgs(paramObj, function(imageIds) {
			paramObj.imageIds = imageIds;
			_.saveShowpostData(paramObj);
		});
	}else{
		_.saveShowpostData(paramObj);
	}
}

/**执行保存秀的Rest请求*/
_.saveShowpostData = function(paramObj) {
	if(cmp.Emoji){
		var cemoji = cmp.Emoji();
		if(paramObj.content){
			paramObj.content = cemoji.EmojiToString(paramObj.content);
		}
	}
	 $s.Show.saveShowpostInfo({}, paramObj, {
		success : function(ret) {
			if (ret.success == true || ret.success == "true") {
				updateProgress(cmp.i18n("Show.tips.success"));
				setTimeout(function(){
					closeProgress();
					fireWebviewEvent({
						isRefresh : true,
						listView : "showpost"
					});
					_.backPage();
				},1000);
			}else{
				closeProgress();
				cmp.notification.toast(cmp.i18n("Show.showpost.edit.save.error"), "center");
			}
		},
		error :function(e){
			var cmpHandled = cmp.errorHandler(e);
			if(!cmpHandled){
				cmp.notification.alert(cmp.i18n("Show.showpost.edit.save.error"),function(){
					cmp.href.back();//_showPath + "/html/showIndex.html");
				},cmp.i18n("Show.page.button.tip"), cmp.i18n("Show.info.home.back"));						
			}
			closeProgress();
		}
	});
}

/**进度条对象*/
_.progressObj;
/**
 * 启动进度条
 */
var startProgress = function(text) {
	if(text == undefined || text == null){
		text = cmp.i18n("Show.tips.publishing");
	}
	_.progressObj = new ProgressBar({
	    text: text
	});
}

/**
 * 更新进度条提示
 */
var updateProgress = function(text){
	_.progressObj.updateText(text);
}

/**
 * 关闭进度条
 */
var closeProgress = function() {
    if (_.progressObj && _.progressObj != null) {
    	_.progressObj.close();
    	_.progressObj = null;
    }
}

/** 校验输入有效性 */
_.validateInput = function() {
	var error = "";
	var contentText = document.querySelector("#cs_content_text").value;
	var allImgsNum = document.querySelectorAll(".sc_img_container img").length;
	if (contentText.length === 0 && allImgsNum === 0) {
		error = cmp.i18n("Show.interactive.contentNotNone");
		return error;
	}
	if (contentText.length > 2000) {
		error = cmp.i18n("Show.interactive.contentNotOver");
		return error;
	}
	var showbar_id = document.querySelector("#showbar_id").value;
	if(showbar_id == "-1" || showbar_id == ""){
		error = cmp.i18n("Show.showpost.edit.validate.showbarempty");
		return error;
	}
	
	return error;
}

/**获取秀吧的基本信息*/
_.getShowpostData = function() {
	var paramObj = new Object();
	if(cmp.href.getParam() && cmp.href.getParam().from){
		paramObj.from = cmp.href.getParam().from;
	}
	
	paramObj.id = document.querySelector("#showpost_id").value;
	paramObj.showbarId = document.querySelector("#showbar_id").value;
	paramObj.showbarName = document.querySelector("#publish_source").innerHTML  ;
	paramObj.content = document.querySelector("#cs_content_text").value;
	paramObj.createFrom = (cmp.platform.CMPShell ? 3 /* M3 */ : 2 /* WeiXin */);
	if (document.querySelector("#publish_location").innerHTML.replace(/(^\s*)|(\s*$)/g,"") == cmp.i18n("Show.page.label.location").replace(/(^\s*)|(\s*$)/g,"")) {
		paramObj.publishLocation = "";
	} else {
		paramObj.publishLocation = document.querySelector("#publish_location").innerHTML;
	}
	var allImgs = document.querySelectorAll(".sc_img_container img");
	paramObj.imgNum = allImgs.length;
	if(paramObj.imgNum > 0){
		var imagesObj = {};
		imagesObj.success = true;
		imagesObj.files = [];
		for(var i=0;i<allImgs.length;i++){
			var img = allImgs[i];
			var imgSrc = img.src;
			var base64= imgSrc.substring(imgSrc.indexOf("base64,")+7);
			var fileId = img.getAttribute("fileId");
			imagesObj.files[i] = {
				filepath : img.getAttribute("filepath"),
				fileId : fileId,
				fileData : _.imgMap[fileId].fileData
			};
		}
		paramObj.allImgs = imagesObj;
	}
	
	if($CreateShowpost.atComponent){
		var atMembers = $CreateShowpost.atComponent.getResult();
		paramObj.atInfo = cmp.toJSON(atMembers);
	}
	
	return paramObj;
}


/**
 * 上传图片操作
 * @param filePath 图片路径
 */
_.uploadImgs = function(paramsObj, successCallBack) {
	var picSize = paramsObj.allImgs.files.length;
	var successSize = 0;
	var imageIds = "";
    cmp.att.upload({
        url: getRootPath() + "/rest/show/uploadImages?thumb=false&option.n_a_s=1",
        fileList: paramsObj.allImgs.files,
        imgIndex:"sortNum",
        success: function (res) {
        	// 特殊说明：M1和M3上传照片的代码不一致，有差异
        	successSize++;
        	//返回的图片追加到imgArr中
        	var response = cmp.parseJSON(res.response);
        	if(!response || !response.data){
        	    cmp.notification.alert(res,"",cmp.i18n("Show.message.pictureUploadError"));
        		return;
        	}
			var imgObj = typeof response.data === 'string' ? cmp.parseJSON(response.data) : response.data;

        	imageIds = imageIds + imgObj.id + ",";
        	if(successSize >=  picSize && typeof successCallBack == "function"){
        		successCallBack(imageIds);
        	}else{
        		updateProgress(cmp.i18n("Show.page.label.upload")+Math.floor(100*successSize/picSize)+"%");
        	}
        },
        progress:function(result){
            var fileId = result.fileId;//文件id
            var pos = result.pos;//进度值
        },
        error: function (res) {
        	//cmp.notification.alert(res,"","图片上传失败");
        	cmp.notification.alert(res,"",cmp.i18n("Show.alert.error.imageuploaderror"));
        	_.backPage();
        }
    });
}

/** 初始化页面布局 */
_.initLayout = function(){
	document.querySelector('#add-image-area').style.display = "";
}

$CreateShowpost.initLayout = _.initLayout;

/** 初始化页面数据 */
_.initPageData = function() {
	var hrefParam = cmp.href.getParam();
	// 处理图片
	if (hrefParam && hrefParam.allImgs) {
		_.createImgs(hrefParam.allImgs);
	}
	// 回填秀吧等基础数据
	var showbarId, showbarName;
	if (hrefParam && hrefParam.showbarId && hrefParam.showbarName) {
		showbarId = hrefParam.showbarId;
		showbarName = hrefParam.showbarName;
	} else {
		$s.Show.getFirstCreateShowbar("",{
			success : function(firstShowbar){
				if (firstShowbar && firstShowbar != null) {
					showbarId = firstShowbar.id;
					showbarName = escapeStringToHTML(firstShowbar.showbarName, true);
					if (showbarId) {
						document.querySelector("#showbar_id").value = showbarId;
					}
					if (showbarName) {
						document.querySelector("#publish_source").innerHTML = showbarName;
					}
				} else {
					// TODO 没有任何主题
				}
			},
			error :function(e){
				dealAjaxError(e);
			}
		});
	}
	if (showbarId) {
		document.querySelector("#showbar_id").value = showbarId;
	}
	if (showbarName) {
		document.querySelector("#publish_source").innerHTML = showbarName;
	}
	// 回填正文内容
	if (hrefParam && hrefParam.content) {
		document.querySelector("#cs_content_text").value = hrefParam.content;
	}
	// 判定来自主题的时候，发布按钮置灰
	if (hrefParam && hrefParam.back == "showbarDetail" ) {
		document.querySelector("#publish_source").style.color = "#bbb";
	}
	// 发布位置
	if (hrefParam && hrefParam.publishLocation) {
		if (hrefParam.publishLocation == cmp.i18n("Show.page.label.location")) {// TODO 这样玩完蛋了
			document.querySelector(".icon-locationfill").classList
					.remove("cmp-active");
		} else {
			document.querySelector(".icon-locationfill").classList
					.add("cmp-active");
		}
		document.querySelector("#publish_location").innerHTML = params.publishLocation;
	}
	// 现改为从后台生成ID了
	//document.querySelector("#showpost_id").value = StringUtil.getRandomNuber();
}

$CreateShowpost.initPageData = _.initPageData;

//选择的图片对象
_.imgMap = {};

/**多图创建*/
_.createImgs = function(pictures){
	if (pictures.success) {
		if(pictures.files && pictures.files.length > 0){
			for(var i=0;i<pictures.files.length;i++){
				var fileItem = pictures.files[i];
				fileItem.fileId = cmp.buildUUID();
				_.createImg(fileItem);
				_.imgMap[fileItem.fileId] = fileItem;
			}
		}
	}else{
		cmp.notification.toast(pictures.msg);
	}
}

/**单图创建*/
_.createImg = function(imageObj){
	var imgContainer = document.querySelector(".sc_img_container");
	
	var imgAdd = document.querySelector(".add");
	//base64用于显示
	var divDom = document.createElement("div");
	divDom.classList.add("img");
	divDom.style.overflow = "hidden";
	var imgDom = document.createElement("img");
	imgDom.src =  imageObj.base64;
	imgDom.setAttribute("filepath",imageObj.filepath);
	imgDom.setAttribute("fileId",imageObj.fileId);
	imgContainer.insertBefore(divDom,imgAdd);
	
	imgDom.onload = function(){
		var allImgsNum = document.querySelectorAll(".sc_img_container img").length ;
		if(allImgsNum >= PictureUtil.PICTURE_DEFAULT_NUM){//超出指定数量的图片之后不再创建
			return;
		}
		
		var imgH = imgDom.height;
		var imgW = imgDom.width;
		var defaultHW= 70;//图片显示的默认 高宽
		if(imgH < imgW){
			imgDom.style.height = defaultHW + "px";
			imgDom.style.marginLeft = Math.round((imgH - imgW)/2 * (defaultHW/imgH) ) + "px";
		}else{
			imgDom.style.width = defaultHW + "px";
			imgDom.style.marginTop = Math.round((imgW - imgH)/2 * (defaultHW/imgW) ) + "px";
		}
		divDom.appendChild(imgDom);
		
		//1.刷新下listview；2.更新下+号
		_.refreshImgs(allImgsNum + 1);
		
		//绑定点击大图事件
		imgDom.addEventListener("tap", function(){
			var allImgs = imgContainer.querySelectorAll(".sc_img_container img");
			var imgArray = [];
			for(var i = 0,len = allImgs.length;i < len; i ++) {
				imgArray.push(allImgs[i].src);
				allImgs[i].setAttribute("img-index", i);
			}
			//调度大图查看
			cmp.sliders.addNew(imgArray);
			var img_index = parseInt(this.getAttribute("img-index"));
			cmp.sliders.detect(img_index);
		});
		
		var timeout = null;
		divDom.addEventListener("touchstart", function(e) {
			timeout = setTimeout(function() {
				cmp.dialog.actionSheet([{"key":"1","name":cmp.i18n("Show.page.button.delete")}], cmp.i18n("Show.cancel"), function(item) {
					if (item.key == "1") {
						//删除图片对象
						divDom.remove();
						//重建下标索引
						var allImgs = imgContainer.querySelectorAll(".sc_img_container img");
						for(var i = 0,len = allImgs.length;i < len; i ++) {
							allImgs[i].setAttribute("img-index", i+1);
						}
						_.refreshImgs(allImgs.length);
					}
				}, function() {
					//console.log("您点击了取消按钮!");
				});
			}, 1000);
		});//end of imgDom.addEventListener("touchstart"
		imgDom.addEventListener("touchend", function() {
			if (timeout != null) {
				clearTimeout(timeout);
				timeout = null;
			}
		});
	}
}

/**刷新图片，执行一些图片变化后的操作*/
_.refreshImgs = function(allImgsNum){
	if(allImgsNum === undefined || allImgsNum === null){
		allImgsNum = document.querySelectorAll(".sc_img_container img").length;
	}
	//图片超出最大范围时隐藏
	if (allImgsNum >= PictureUtil.PICTURE_DEFAULT_NUM) {
		document.querySelector(".add").style.display = "none";
	}else{
		document.querySelector(".add").style.display = "";
	}
	//刷新下listView
	//cmp.listView(".cs_scroll").refresh();
}


/**打开秀定位列表*/
_.openLocationList = function() {
	var location_content = document.querySelector('#location_content');
	/*var headerH = location_content.querySelector('.cmp-bar-nav').offsetHeight;
	var info_content = document.querySelector('#location_content').querySelector('.cmp-content');
	if (/iphone/i.test(navigator.userAgent)) {
		info_content.style.top = headerH + "px";
	}*/
	location_content.classList.add('cmp-active');
	var locationName = document.querySelector("#publish_location").innerHTML;
	if(locationName.indexOf("·")){//如果带有点，表示会有城市的前缀
		locationName = locationName.split("·")[1];
	}
	$ShowLbs.init({
		selectedLocation : locationName,
		selectedCallback : function(selectedLocationName,currentCity){
			if(selectedLocationName === cmp.i18n("Show.page.label.noLocation")){
				document.querySelector("#publish_location").innerHTML = cmp.i18n("Show.page.label.location");
			}else if(selectedLocationName === currentCity){//选择的就是城市
				document.querySelector("#publish_location").innerHTML = selectedLocationName;
			}else{//选择的是地名，在地名前加城市前缀
				document.querySelector("#publish_location").innerHTML = currentCity+"·"+selectedLocationName;
			}
		}
	});
}
cmp.ready(function(){
	document.querySelector("#cs_content_text").placeholder = cmp.i18n("Show.interactive.thought");
	document.title = cmp.i18n("Show.page.label.createShow");
	$CreateShowpost.initLayout();
	$CreateShowpost.initPageData();
	$CreateShowpost.bindBasicEvent();
});