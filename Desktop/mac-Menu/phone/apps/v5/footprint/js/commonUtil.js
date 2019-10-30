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
function _$(selector) {
	return querySelector(selector);
}

function getCmpRoot(){
	return cmp.storage.get("online-debug-url") == null ? "" : cmp.storage.get("online-debug-url");
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