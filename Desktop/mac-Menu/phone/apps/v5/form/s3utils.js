var s3utils = {
	c2vs : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for ( var i = 0; i < fStr.length; i++) {
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
	c2v : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for ( var i = 0; i < fStr.length; i++) {
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
	c2h : function(aStr) {
		if (aStr == null)
			return null;
		var fStr, result;
		fStr = "" + aStr;
		result = new Array(fStr.length);
		for ( var i = 0; i < fStr.length; i++) {
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
	getBooleanValue : function(aValue, aDefault) {
		if (aValue == undefined)
			return aDefault;
		if (aValue == null)
			return aDefault;
		if ((typeof aValue) == "boolean")
			return aValue;
		return aDefault;
	},
	isNumber: function(aValue) {
		if (aValue == undefined)
			return false;
		if (aValue == null)
			return false;
		if (typeof (aValue) == "number")
			return true;
	},
	isString: function(aValue) {
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
	 * @param aDom 要刷新的页面对象
	 * @param aRefresh 刷新方式
	 * @param aHtmlStr 刷新的内容
	 */
	refreshElement : function(aDom, aRefresh, aHtmlStr, aIsInner) {
		if (aDom==null) return ;
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

	}

};
