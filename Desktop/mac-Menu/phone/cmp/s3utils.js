var s3utils = {
	c2vs : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for (var i = 0; i < fStr.length; i++) {
			switch (fStr.charCodeAt(i)) {
			case 10:
				result.push("\\\\n");
				break;
			case 13:
				result.push("\\\\r");
				break;
			case 34:
				result.push("\\&quot;");
				break;
			case 38:
				result.push("\\&amp;");
				break;
			case 39:
				result.push("\\&apos;");
				break;
			case 92:
				result.push("\\&#92");
				break;
			default:
				result.push(fStr.charAt(i));
				break;
			}
		}

		return result.join("");
	},
	c2vb : function(aStr) {
	  if (aStr==null) return "";
	  return this.c2v(aStr);	
	},
	c2v : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for (var i = 0; i < fStr.length; i++) {
			switch (fStr.charCodeAt(i)) {
			case 10:
				result.push("\\n");
				break;
			case 13:
				result.push("\\r");
				break;
			case 34:
				result.push("&quot;");
				break;
			case 38:
				result.push("&amp;");
				break;
			case 39:
				result.push("&apos;");
				break;
			case 92:
				result.push("&#92");
				break;
			default:
				result.push(fStr.charAt(i));
				break;
			}
		}

		return result.join("");
	},
	c2hb : function(aStr) {
	  if (aStr==null) return "";
	  return this.c2h(aStr);	
	},
	c2h : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for (var i = 0; i < fStr.length; i++) {
			switch (fStr.charCodeAt(i)) {
			case 34:
				result.push("&quot;");
				break;
			case 38:
				result.push("&amp;");
				break;
			case 39:
				result.push("&apos;");
				break;
			case 92:
				result.push("&#92");
				break;
			case 60:// <
				result.push("&lt;");
				break;
			case 62:
				result.push("&gt;");
				break;
			default:
				result.push(fStr.charAt(i));
				break;
			}
		}

		return result.join("");
	},
	isNull : function(aValue) {
		return aValue == null;
	},
	getBooleanValue : function(aValue, aDefault) {
		if (aValue == undefined)
			return aDefault;
		if (aValue == null)
			return aDefault;
		if ((typeof aValue) == "boolean")
			return aValue;
		return aDefault;
	},
	isNumber : function(aValue) {
		if (aValue == undefined)
			return false;
		if (aValue == null)
			return false;
		if (typeof (aValue) == "number")
			return true;
	},
	isString : function(aValue) {
		if (aValue == undefined)
			return false;
		if (aValue == null)
			return false;
		if (typeof (aValue) == "string")
			return true;
	},
	isBoolean : function(aValue) {
		if (aValue == undefined)
			return false;
		if (aValue == null)
			return false;
		return (typeof aValue) == "boolean";
	},
	isObject : function(aValue) {
		if (aValue == undefined)
			return false;
		if (aValue == null)
			return false;
		return (typeof aValue) == "object";
	},
	C_iRefresh_None : 0,
	C_iRefresh_Refresh : 1,
	C_iRefresh_Append : 2,
	C_iRefresh_Remove : 3,
	/**
	 * 检查是否要刷新对应的页面的元素
	 * 
	 * @param aRefreshInfo
	 *            Html Element的id数组
	 * @param aId
	 *            检测是否要刷新的页面元素
	 * @returns {Boolean}
	 */
	isRefreshOrAppend : function(aRefreshInfo, aId) {
		// 没有定义时,全部刷新
		if (aRefreshInfo == null)
			return s3utils.C_iRefresh_Refresh;
		// 总的类型为bool值时,根据值的类型来刷新
		if (s3utils.isBoolean(aRefreshInfo))
			return s3utils.getBooleanValue(aRefreshInfo, true) ? s3utils.C_iRefresh_Refresh : s3utils.C_iRefresh_None;

		var fItemInfo;

		// 如果是对象时,根据每个属性来刷新
		if (s3utils.isObject(aRefreshInfo)) {
			fItemInfo = aRefreshInfo[aId];
			// 属性为整数时,返回整数的值
			if (s3utils.isNumber(fItemInfo))
				return fItemInfo;

			// 属性为字符串时,
			if (s3utils.isString(fItemInfo)) {
				switch (fItemInfo) {
				case "refresh":
					return s3utils.C_iRefresh_Refresh;
				case "append":
					return s3utils.C_iRefresh_Append;
				case "remove":
					return s3utils.C_iRefresh_Remove;
				case "none":
				default:
					return s3utils.C_iRefresh_None;
				}
			}
			return this.C_iRefresh_None;
		} else
			return this.C_iRefresh_None;

	},
	isRefreshOrAppend_old : function(aRefreshInfo, aId) {
		// 没有定义时,全部刷新
		if (aRefreshInfo == null)
			return s3utils.C_iRefresh_Refresh;
		// 总的类型为bool值时,根据值的类型来刷新
		if (s3utils.isBoolean(aRefreshInfo))
			return s3utils.getBooleanValue(aRefreshInfo, true) ? s3utils.C_iRefresh_Refresh : s3utils.C_iRefresh_None;

		var fItemInfo, fValueInfo;

		// 如果是对象时,根据每个属性来刷新
		if (s3utils.isObject(aRefreshInfo)) {
			fItemInfo = aRefreshInfo[aId];
			// 属性为bool值时,直接刷新
			if (s3utils.isBoolean(fItemInfo))
				return s3utils.getBooleanValue(fItemInfo, false) ? s3utils.C_iRefresh_Refresh : s3utils.C_iRefresh_None;

			// 属性为对象时,检查append子属性和refresh子属性
			if (s3utils.isObject(fItemInfo)) {

				fValueInfo = fItemInfo["remove"];
				if (fValueInfo != null)
					if (this.getBooleanValue(fValueInfo, false))
						return s3utils.C_iRefresh_Remove;

				fValueInfo = fItemInfo["append"];
				if (fValueInfo != null)
					if (this.getBooleanValue(fValueInfo, false))
						return s3utils.C_iRefresh_Append;

				fValueInfo = fItemInfo["refresh"];
				return this.getBooleanValue(fValueInfo, false) ? s3utils.C_iRefresh_Refresh : s3utils.C_iRefresh_None;
			}
			return this.C_iRefresh_None;
		} else
			return this.C_iRefresh_None;
	},
	/**
	 * 刷新Dom的数据
	 * 
	 * @param aDom
	 *            要刷新的页面对象
	 * @param aRefresh
	 *            刷新方式
	 * @param aHtmlStr
	 *            刷新的内容
	 */
	refreshElement : function(aDom, aRefresh, aHtmlStr, aIsInner) {
		if (aDom == null)
			return;
		switch (aRefresh) {
		case this.C_iRefresh_Refresh:
			if (aIsInner)
				aDom.innerHTML = aHtmlStr;
			else
				aDom.outerHTML = aHtmlStr;
			break;
		case this.C_iRefresh_Append:
			if (aIsInner)
				aDom.innerHTML += aHtmlStr;
			else
				aDom.outerHTML += aHtmlStr;
			break;
		case this.C_iRefresh_Remove:
			if (aIsInner)
				aDom.innerHTML = "";
			else
				aDom.outerHTML = "";
			break;

		}
		s3utils.bindListener();

	}

};

/**
 * 使用私有变量,fEventList
 */
s3utils = function(aUtils) {
	var fEventList = [];
	var fBindItem = function(aItem) {
		var fElement;
		fElement = document.querySelector(aItem.dombind);
		if (fElement == null)
			return;
		fElement.addEventListener(aItem.eventname, aItem.eventfunc, aItem.usecapture);
	};
	var fBindAll = function(aItem) {
		var fList;
		fList = document.querySelectorAll(aItem.dombind);
		if (fList == null)
			return;
		if (fList.length == null)
			return;
		var fElement;
		for (var i = 0; i < fList.length; i++) {
			fElement = fList[i];
			fElement.addEventListener(aItem.eventname, aItem.eventfunc, aItem.usecapture);
		}
	};
	/**
	 * 清除待绑定的Listener
	 */
	aUtils.clearListener = function() {
		fEventList = [];
	};
	/**
	 * 压入待绑定的信息
	 * 
	 * @param aDomBind
	 *            Dom的绑定信息,使用 document.querySelector进行查找
	 * @param aEventName
	 *            事件的名称
	 * @param aEventFunc
	 *            事件的处理函数
	 * @param aUseCapture
	 *            事件的捕获方式,捕获还是冒泡
	 */
	aUtils.pushListener = function(aDomBind, aEventName, aEventFunc, aUseCapture) {
		var fItem;
		fItem = {
			dombind : aDomBind,
			eventname : aEventName,
			eventfunc : aEventFunc,
			usecapture : aUseCapture,
			selectall : false
		};
		fEventList.push(fItem);
	};
	/**
	 * 压入待绑定的信息
	 * 
	 * @param aDomBind
	 *            Dom的绑定信息,使用 document.querySelectorAll进行查找
	 * @param aEventName
	 *            事件的名称
	 * @param aEventFunc
	 *            事件的处理函数
	 * @param aUseCapture
	 *            事件的捕获方式,捕获还是冒泡
	 */
	aUtils.pushListener_selectAll = function(aDomBind, aEventName, aEventFunc, aUseCapture) {
		var fItem;
		fItem = {
			dombind : aDomBind,
			eventname : aEventName,
			eventfunc : aEventFunc,
			usecapture : aUseCapture,
			selectall : true
		};
		fEventList.push(fItem);
	};
	aUtils.bindListener = function() {
		var fItem;
		for (var i = 0; i < fEventList.length; i++) {
			fItem = fEventList[i];
			if (fItem == null)
				continue;
			if (fItem.selectall)
				fBindItem(fItem);
			else
				fBindAll(fItem);
		}
		aUtils.clearListener();
	};
	return aUtils;
}(s3utils);

/**
 * 数据绑定方法
 */
s3utils = function(aUtils) {
	var fdoSelectElement = function(aOwner, aCheckQuerySelector) {
		if (s3utils.isNull(aOwner))
			return null;
		var fElement;
		if (s3utils.isString(aOwner))
			fElement = document.querySelector(aOwner);
		else
			fElement = aOwner;
		if (s3utils.isNull(fElement))
			return null;
		if (aCheckQuerySelector)
			if (fElement.querySelector == null)
				return null;
		return fElement;
	};
	var fdoGetAttrib = function(aElement, aAtt) {
		if (aElement == null)
			return null;
		if (aElement.getAttribute == null)
			return null;
		return aElement.getAttribute(aAtt);
	}
	var fdoGetAllAttrib = function(aElement, aSel, aAtt) {
		var fList;
		fList = aElement.querySelectorAll(aSel);
		if (fList == null)
			return;
		if (fList.length == null)
			return null;
		var fElement;
		var result;
		result = [];
		for (var i = 0; i < fList.length; i++) {
			fElement = fList[i];
			if (fElement == null)
				continue;
			result.push(fElement.getAttribute(aAtt));
		}
		return result;
	};

	var fIsBindInfo = function(aItem) {
		if (aItem == null)
			return false;
		if (aItem.element == null)
			return false;
		if (aItem.att == null && aItem.callback == null)
			return false;
		return true;
	};
	var fCopyObj = function(aValue) {
		if (aValue == null)
			return null;
		return JSON.parse(JSON.stringify(aValue));
	};
	var fDoGetValue = function(aBindInfo) {
		var flage;
		flage = 0;
		if (aBindInfo.callback != null)
			flage = flage + 1;

		if (aBindInfo.owner != null)
			flage = flage + 2;

		if (aBindInfo.all == true)
			flage = flage + 4;
		var fOwnerEle, fSubEles;
		fOwnerEle = null;

		switch (flage) {
		case 0: // att
			return aUtils.getExtractValue(aBindInfo.element, aBindInfo.att);
		case 1: // callback;
			fSubEles = fdoSelectElement(aBindInfo.element, false);
			return aBindInfo.callback(aBindInfo, fOwnerEle, fSubEles);
		case 2: // owner
			return aUtils.getExtractValueSub(aBindInfo.owner, aBindInfo.element, aBindInfo.att);
		case 3: // callback owner
			fOwnerEle = fdoSelectElement(aBindInfo.owner, true);
			if (!s3utils.isNull(fOwnerEle))
				fSubEles = fOwnerEle.querySelector(aBindInfo.element);
			return aBindInfo.callback(aBindInfo, fOwnerEle, fSubEles);
		case 4: // all
			return aUtils.getExtractValueAll(aBindInfo.element, aBindInfo.att);
		case 5: // callback all
			fSubEles = fOwnerEle.querySelectorAll(aBindInfo.element);
			return aBindInfo.callback(aBindInfo, fOwnerEle, fSubEles);
		case 6: // owner all
			return aUtils.getExtractValueSubAll(aBindInfo.owner, aBindInfo.element, aBindInfo.att);
		case 7: // callback owner all
			fOwnerEle = fdoSelectElement(aBindInfo.owner, true);
			if (!s3utils.isNull(fOwnerEle))
				fSubEles = fOwnerEle.querySelectorAll(aBindInfo.element);
			return aBindInfo.callback(aBindInfo, fOwnerEle, fSubEles);
		default:
			return alert("error");
		}
	};

	aUtils.getExtractValue = function(aElementSel, aAtt) {
		var fElement;
		fElement = fdoSelectElement(aElementSel, false);
		if (fElement == null)
			return null;
		return fdoGetAttrib(fElement, aAtt);
	};
	aUtils.getExtractValueSub = function(aOwnerSel, aElementSel, aAtt) {
		var fElement;
		fElement = fdoSelectElement(aOwnerSel, true);
		if (s3utils.isNull(fElement))
			return null;
		return fdoGetAttrib(fElement.querySelector(aElementSel), aAtt);
	};

	aUtils.getExtractValueSubAll = function(aOwnerSel, aElementSel, aAtt) {
		var fElement;
		fElement = fdoSelectElement(aOwnerSel, true);
		if (s3utils.isNull(fElement))
			return null;
		return fdoGetAllAttrib(fElement, aElementSel, aAtt);
	};

	aUtils.getExtractValueAll = function(aElementSel, aAtt) {
		if (s3utils.isNull(aElementSel))
			return null;
		return fdoGetAllAttrib(document, aElementSel, aAtt);
	};

	aUtils.getExtractDataByMap = function(aMap) {
		var fItem;
		var result;
		result = {};
		for ( var fKey in aMap) {
			fItem = aMap[fKey];

			if (fItem == null) {
				result[fKey] = null;
				continue;
			}

			if (fIsBindInfo(fItem)) {
				result[fKey] = fDoGetValue(fItem);
				continue;
			}

			if (s3utils.isObject(fItem)) {
				result[fKey] = getExtractDataByMap(fItem);
				continue;
			}
			result[fKey] = fCopyObj(fItem);
			continue;

		}
		return result;
	};

	return aUtils;
}(s3utils);
