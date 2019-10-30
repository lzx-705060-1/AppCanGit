/**
 * DOM选择器封装
 * @param selector 选择对象
 * @returns
 */
function querySelector(selector){
    return document.querySelector(selector);
}
/**
 * DOM选择器封装
 * @param selector 选择对象
 * @returns
 */
function querySelectorAll(selector){
	return document.querySelectorAll(selector);
}

/**
 * DOM选择器封装
 * @param selector 选择对象
 * @returns
 */
function _$(selector) {
	return querySelector(selector);
}

function getCmpRoot(){
	return cmp.serverIp ? cmp.serverIp : "";
}

/**
 * js获取项目根路径，如： http://localhost:8080/seeyon
 * 
 */
function getRootPath(){
	var cmpRoot = getCmpRoot();
    return cmpRoot + "/seeyon";
}
/**
 * js获取主机地址，如： http://localhost:8080
 * 
 */
function getLocalhostPath(){
    return getCmpRoot();
}
/**
 * js项目名称，如：/seeyon
 * 
 */
function getProjectName(){
	var cmpRoot = getCmpRoot();
    return cmpRoot + "/seeyon";
}

/**
 * 操作DOM的方法类
 * 
 */
var DOMUtil = {
	
	/**
	 * 创建DOM元素
	 * 
	 * @param elementName DOM元素名称
	 * @param elementParam DOM元素属性参数
	 */		
	createElement : function(elementName, elementParam) {
		var element = null;
		if (elementName && elementName != null && elementName.length > 0) {
			element = document.createElement(elementName);
		}
		if (element != null && elementParam && elementParam != null) {
			if (elementParam.id && elementParam.id != null) {
				element.id = elementParam.id;
			}
			if (elementParam.name && elementParam.name != null) {
				element.name = elementParam.name;
			}
			if (elementParam.classNames && elementParam.classNames != null) {
				for (var i = 0; i < elementParam.classNames.length; i++) {
					element.classList.add(elementParam.classNames[i]);
				}
			}
			if (elementParam.src && elementParam.src != null) {
				element.src = elementParam.src;
			}
		}
		return element;
	},
	/**
	 * 添加DOM元素到指定元素之前
	 * 
	 * @param insertElement 要添加的DOM元素
	 * @param targatElement 指定的DOM元素
	 * @param parentElement 父级DOM元素
	 */
	addElementBefore : function(insertElement, targatElement, parentElement) {
		if (parentElement && parentElement != null) {
			parentElement.insertBefore(insertElement, targatElement);
		}
	},
	/**
	 * 删除DOM元素的操作
	 * 
	 * @param removeObj DOM元素对象
	 */
	removeDomElement : function(removeObj) {
		if (removeObj && removeObj != null) {
			removeObj.parentNode.removeChild(removeObj); 
		}
	}
}

/**
 * 日期处理相关工具方法
 * 
 */
var DateUtil = {
	
	YEAR_MONTH_DAY_PATTERN : "yyyy-MM-dd",
	YMDHMS_PATTERN : "yyyy-MM-dd HH:mm",

	/**
	 * 根据传入日期和日期格式化规则，将日期处理成格式对应的日期字符串
	 * 
	 * @param dateTime 要处理的时间
	 * @param pattern  处理的时间格式
	 */
	format : function (dateTime, pattern) {
		var dateStr = "";
		var separator = "-"
		if (pattern.length >= this.YEAR_MONTH_DAY_PATTERN.length) {
			separator = pattern.substring(pattern.lastIndexOf("y") + 1, pattern.indexOf("M"));
			var year = dateTime.getFullYear();
			var month = dateTime.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			var date = dateTime.getDate();
			date = date < 10 ? ('0' + date) : date;
			dateStr = year + separator + month + separator + date;
		}
		if (pattern.length == this.YMDHMS_PATTERN.length) {
			separator = pattern.substring(pattern.lastIndexOf("H") + 1, pattern.indexOf("m"));
			var hour = date.getHours();
		    var minute = date.getMinutes();
		    minute = minute < 10 ? ('0' + minute) : minute;
		    dateStr = dateStr + hour + minute;
		}
		return dateStr;
	},
	/**
	 * 根据传入日期，将日期处理成年月日格式的日期字符串
	 * 
	 * @param dateTime 要处理的时间
	 */
	formatDate : function (dateTime) {
		return this.format(dateTime, this.YEAR_MONTH_DAY_PATTERN);
	},
	/**
	 * 根据传入日期，将日期处理成年月日时分格式的日期字符串
	 * 
	 * @param dateTime 要处理的时间
	 */
	formatDateTime : function(dateTime) {
		return this.format(dateTime, this.YMDHMS_PATTERN);
	}
}

/**
 * 字符串处理相关工具方法
 * 
 */
var StringUtil = {
	/**
	 * 生成一个随机数ID
	 */
	getRandomNuber : function () {
			var data = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
			var result = "";
			var tempRandom = "";
			for (var i = 0; i < 6; i++) {
				r = Math.floor(Math.random() * 10);
				tempRandom += data[r];
			}
			var firstResult = (new Date()).getTime() + parseInt(Math.random()*100000);
			result = "" + firstResult + tempRandom;
			return result;
	},
    
	/**
	 * 检测是否是空字符串, 允许空格
	 * 
	 * @param Str 检测的字符串
	 * @returns true或false
	 */ 
	isEmpty : function (Str) {
		return typeof Str == "undefined" || Str == null || Str.length == 0;
	},
	/**
	 * 检测是否非空字符串, 允许空格
	 * 
	 * @param Str 检测的字符串
	 * @returns true或false
	 */
	isNotEmpty : function(Str) {
		return !this.isEmpty(Str);
	},
	/**
	 * 截取字符串 包含中文处理
	 * 
	 * @param str 字符串
	 * @param len 长度
	 * @param hasDot 是否要省略号
	 * @returns {String} 截取后的字符串
	 */
	cutString : function(str, len, hasDot) {
	  var newLength = 0;
	  var newStr = "";
	  var chineseRegex = /[^\x00-\xff]/g;
	  var singleChar = "";
	  var strLength = str.replace(chineseRegex, "**").length;
	  for (var i = 0; i < strLength; i++) {
	    singleChar = str.charAt(i).toString();
	    if (singleChar.match(chineseRegex) != null) {
	      newLength += 2;
	    } else {
	      newLength++;
	    }
	    if (newLength > len) {
	      break;
	    }
	    newStr += singleChar;
	  }

	  if (hasDot && strLength > len) {
	    newStr += "...";
	  }
	  return newStr;
	}
}

/**
 * 变量参数处理相关工具方法
 * 
 */
var ParamUtil = {
	
    /**
	 * 检测是否是空参数
	 * 
	 * @param obj 检测的参数
	 * @returns true或false
	 */ 
	isEmpty : function (obj) {
		return typeof obj == "undefined" || obj == null;
	},
	/**
	 * 检测是否非空参数
	 * 
	 * @param obj 检测的参数
	 * @returns true或false
	 */
	isNotEmpty : function(obj) {
		return !this.isEmpty(obj);
	}
}

var showbarCommonFunc = {
	/**
	 * 判断主题是否存在
	 * 
	 * @param showbarId
	 */
	hasShowbarExist : function(showbarId) {
		var bool = false;
		if (StringUtil.isNotEmpty(showbarId)) {
			bool = $s.Show.hasShowBarExist(showbarId);
		}
		return bool;
	},
	/**
	 * 计算秀圈中图片的尺寸
	 * 
	 * @param htmlStr
	 */
	computeShowpostIconSize : function(htmlStr) {
		var domObj = document.createElement("div");
		domObj.innerHTML = htmlStr;
		var imgSize = -1;
		var oneImgSize = -1;
		var imageContents = domObj.querySelectorAll(".big_img_content");
		for (var i = 0; i < imageContents.length; i++) {
			var imageContentId = imageContents[i].getAttribute("id");
			if (imageContents[i].children.length > 0) {
				if(imgSize == -1){//计算每张图的宽度
					imgSize = Math.ceil((_$("#" + imageContentId).clientWidth - 15) / 3);
					oneImgSize = imgSize*2 + 10;
				}
				var imgCount = _$("#" + imageContentId).children.length;
				for (j = 0; j < imgCount; j++) {
					var imageObj = _$("#" + imageContentId).children[j];
					if(imgCount == 1){//只有1张图的时候放大一倍显示图片
						imageObj.setAttribute("style", "height:" + oneImgSize + "px;width:" + oneImgSize + "px;");
					}else{
						imageObj.setAttribute("style", "height:" + imgSize + "px;width:" + imgSize + "px;");
					}
					
				}
			}
		}
	}
}


/**
 * 操作图片的方法
 * 
 */
var PictureUtil = {
	
	//图片默认数量
	PICTURE_DEFAULT_NUM : 9,
	//允许选择的图片类型
	ALLOW_PICTURE_TYPE : "gif,jpg,jpeg,png",
	
	/**
	 * 通过相机和相册中添加图片的控件
	 * 
	 * @param 操作参数
	 */
	addPictureControl : function(pictureNum, successCallBack) {
		/*
		cmp.camera.getPicturesBadVersion({
			target:target,
			//sourceType: type,
            //quality: 60,
            //destinationType: 1,
            //pictureNum: pictureNum,
            success: successCallBack,
            error:function(res){
            }
        });*/
		var items = [ {
			key : "1",
			name : cmp.i18n("Show.info.update.photos")
		}, {
			key : "2",
			name : cmp.i18n("Show.info.update.album")
		} ];
		cmp.dialog.actionSheet(items, cmp.i18n("Show.cancel"), function(item) {
			if(item.key == "1" || item.key == "2"){
				var type = item.key == "2" ? 0 : 1;
					cmp.camera.getPictures({
						compress:true,  //是否生成缩略图
			            sourceType: type,
			            quality: 60,
			            destinationType: 1,
			            url:getRootPath()+"/show/show.do?method=uploadImages",
			            pictureNum: pictureNum,
			            success: successCallBack,
			            error:function(res){
			            	//TODO 取消拍照走的error路线，这个后续一定要让他们改
//			            	if(res){
//			            		cmp.notification.alert("error:"+cmp.toJSON(res));
//			            	}
			            }
			        });
				
	        }	
		}, function() {
			console.log("您点击了取消按钮!");
		});
	},
	getPictureType : function(picturePath) {
		var pictureType = "";
		if (StringUtil.isNotEmpty(picturePath)) {
			if (picturePath.indexOf("://") > 0) {
				pictureType = picturePath.substring(picturePath.lastIndexOf(".") + 1, picturePath.length);
			} else {
				pictureType = picturePath.substring(picturePath.indexOf("/") + 1, picturePath.indexOf(";"));				
			}
		}
		return pictureType;
	},
	/**
	 * 验证选择图片的类型
	 * 
	 * @param picturePath 图片地址
	 */
	validatePictureType : function(picturePath) {
		var isAllow = false;
		if (StringUtil.isNotEmpty(this.ALLOW_PICTURE_TYPE) && StringUtil.isNotEmpty(picturePath)) {
			var pictureType = this.getPictureType(picturePath);
			if (this.ALLOW_PICTURE_TYPE.indexOf(pictureType) > 0) {
				isAllow = true;
			}

		}
		return isAllow;
	}
}
/*
 * ajax请求error处理
 */
var dealAjaxError = function(error){
	var cmpHandled = cmp.errorHandler(error);
	if(!cmpHandled){
		console.log(error);
		if(error.message){
			cmp.notification.alert(error.message);	
		}else{
			cmp.notification.alert(error);
		}
	}
}
/**
 * 页面js报错时弹出错误信息
 */
var pageErrorCatch = function(sMsg,sUrl,sLine){
	//cmp.notification.alert("发生错误的信息：" + sMsg+ "、发生错误的文件：" +sUrl+ "、发生错误的行数：" + sLine);
	cmp.notification.alert(cmp.i18n("Show.alert.error.oops") + sMsg+ "、" + cmp.i18n("Show.alert.error.file") +sUrl+ "、" + cmp.i18n("Show.alert.error.fileline") + sLine);
}
/**
 * 后台返回的image对象的文件后缀转换
 */
var convertImageType = function(typeEnom){
	var imageType = "";
	switch(typeEnom){
		case '0' : imageType = "png";
				break;
		case '1' : imageType = "jpg";
				break;
		case '2': imageType = "gif";
				break;
		case '3' : imageType = "jpeg";
				break;
		case '4' : imageType = "bmp";
				break;
		default : imageType = "png";
	}
	return imageType;
}

/**
 * 遮罩
 */
function ProgressBar(options){
	if(options == undefined){options = {}}
	this.id = options.id ? options.id : Math.floor(Math.random() * 100000000);
    this.text = options.text ? options.text : '';
	this.isMode = options.isMode == undefined ? true : options.isMode;
	this.init();
}

/**
 * @组件(暂只支持input和textare)
 * @param {Object} options
 * options.containerId:input或textarea容器id
 * options.selFunc:选择了人员后的回调函数
 */
function AtComponent(options){
	var me = this;
	me.selArray = [];
	me.options = options;
	me.container = document.querySelector("#" + options.containerId);
	me.handler = document.querySelector("#" + options.handlerId);
	me.bindEvent();
}

AtComponent.prototype = {
	init : function(){
		var me = this;
		//第二次点击的时候清空之前选择的数据
		if(me.selComp){
			cmp.selectOrgDestory(me.selComp.id);
		}
		/**
		 * 初始化选人组件
		 */
		me.selComp = cmp.selectOrg(me.options.containerId + 'cmp_selOrg', {
			type: 2,
			jump: false,
			maxSize: -1,
			minSize: 1,
			selectType: 'member',
			callback: function (result) {
				var resultObj = JSON.parse(result);
				var orgResult = resultObj.orgResult;
				if (orgResult.length > 0) {
					var selected = [];
					var showMembers = "";
					for (var i = 0; i < orgResult.length; i++) {
						var orgResultObj = orgResult[i];
						showMembers += "@" + orgResultObj.name + " ";
						selected.push({
							id : orgResultObj.id,
							name : orgResultObj.name
						})
					}
					if(me.options.selFunc && typeof me.options.selFunc == 'function'){
						me.options.selFunc({
							showMembers : showMembers
						});
					}
					/**
					 * 将结果插入到内容中
					 */
					var content,preContent,nextContent,pos;
					content = me.container.value;
					pos = me.container.selectionStart;
					preContent = content.substring(0,pos);
					if(/@$/.test(preContent)){
						preContent = preContent.replace(/@$/,"");
					}
					nextContent = content.substring(pos);
					me.container.value = preContent + showMembers + nextContent;
					
					me.container.setSelectionRange(pos + showMembers.length,pos + showMembers.length);

					me.selArray = me.selArray.concat(selected);
				}
			}
		});
	},
	/**
	 * 绑定事件
	 */
	bindEvent : function(){
		var me = this;
		/**
		 * 点击@按钮
		 */
		if(me.handler){
			me.handler.addEventListener("click",function(){
				throttle(me.init,me);
			});
		}
		/**
		 * 手动输入@
		 */
		me.container.addEventListener("keyup",function(){
			var content,caretPos,preContent;
			content = this.value;
			caretPos = this.selectionStart;
			preContent = content.substring(caretPos-1,caretPos);
			
			if(preContent == '@'){
				throttle(me.init,me);
				this.blur();
			}
		});
	},
	/**
	 * 获取最终的结果
	 */
	getResult : function(){
		var me = this;
		
		//去重复
		var selected = me.selArray;
		var hash = {},result = [];
		for (var i = 0, elem; (elem = selected[i]) != null; i++) {
	        if (!hash[elem.id]) {
	            result.push(elem);
	            hash[elem.id] = true;
	        }
	    }
		
		var backResults = [];
		var content = this.container.value;
		for(var j = 0;j < result.length;j++){
			if(content.indexOf('@' + result[j].name) >= 0){
				backResults.push(result[j]);
			}
		}
		return backResults;
	}
}

/**
 * 规定时间间隔执行函数
 */
function throttle(fun,scope){
	if(fun.state == 1){
		return;
	}
	fun.state = 1;
	fun.call(scope);
	setTimeout(function(){
		fun.state = 0;
	},500);
}


ProgressBar.prototype.init = function (){
	//遮罩id
    var maskId = this.id + "_mask";
    //遮罩
    if (this.isMode ==  true) {
    	cmp.append(_$("body"), "<div id=\"" + maskId + "\" class=\"cmp-backdrop background_RGBFFF cmp-active\"></div>");
    }
    //进度条HTML内容
    var htmlStr = "<div id=\"" + this.id + "\" class=\"cmp-alert-typical\"><div class=\"content-typical cmp-text-center\"><div class=\"showbar_loading\"><span class=\"cmp-spinner\"></span>";
    if(this.text!='' && this.text!=undefined){
    	htmlStr +="<p id=\"" + this.id + "_text\" class=\"text\">"+ this.text +"</p>";
    }
    htmlStr += "</div></div></div>";
    
    cmp.append(_$("body"), htmlStr);
}
ProgressBar.prototype.updateText = function(text){
	var textId = this.id + "_text";
	document.getElementById(textId).innerHTML = text;
}
ProgressBar.prototype.close = function () {
	DOMUtil.removeDomElement(document.getElementById(this.id + "_mask"));
	DOMUtil.removeDomElement(document.getElementById(this.id));
}
//添加webview监听
var addWebviewEvent = function(callback){
	cmp.webViewListener.addEvent("show_webview_event",function(e){
		if(typeof callback === 'function'){
			callback(e);
		}
    });
}
//触发webview监听
var fireWebviewEvent = function(data){
	cmp.webViewListener.fire({
        type:"show_webview_event",
        data:data,
        success:function(){
        },
        error:function(error){
			console.log(error);
        }
    });
}
