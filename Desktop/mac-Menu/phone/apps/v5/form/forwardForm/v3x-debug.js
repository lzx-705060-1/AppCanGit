var messageRegEx_0 = /\{0\}/g;
var messageRegEx_1 = /\{1\}/g;
var messageRegEx_2 = /\{2\}/g;
var messageRegEx_3 = /\{3\}/g;
var messageRegEx_4 = /\{4\}/g;
var messageRegEx_5 = /\{5\}/g;
var messageRegEx_6 = /\{6\}/g;
var messageRegEx_7 = /\{7\}/g;
var messageRegEx_8 = /\{8\}/g;
var messageRegEx_9 = /\{9\}/g;
var messageRegEx_10 = /\{10\}/g;
var messageRegEx_11 = /\{11\}/g;
var messageRegEx_12 = /\{12\}/g;
var messageRegEx_13 = /\{13\}/g;
var messageRegEx_14 = /\{14\}/g;
var messageRegEx_15 = /\{15\}/g;

var portalOfA8IframeStr = "top.frames['frame_A8']";

/**
 * 扩展其它浏览器DOM元素的outerHTML属性
 */
if(!window.ActiveXObject){
	if (typeof(HTMLElement) != "undefined") {
		HTMLElement.prototype.__defineSetter__("outerHTML", function(s) {
			var r = this.ownerDocument.createRange();
			r.setStartBefore(this);
			var df = r.createContextualFragment(s);
			this.parentNode.replaceChild(df, this);
			return s;
		});
		HTMLElement.prototype.__defineGetter__("outerHTML", function(){
			var a = this.attributes, str = "<" + this.tagName, i = 0;
			for (; i < a.length; i++)
				if (a[i].specified)
					str += " " + a[i].name + '="' + a[i].value + '"';
			if (!this.canHaveChildren)
				return str + " />";
			return str + ">" + this.innerHTML + "</" + this.tagName + ">";
		});

		HTMLElement.prototype.__defineGetter__("canHaveChildren", function(){
			return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
		});
		//insertAdjacentElement
		/**
    HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
        switch (where) {
            case "beforeBegin":
                this.parentNode.insertBefore(parsedNode, this);
                break;
            case "afterBegin":
                this.insertBefore(parsedNode, this.firstChild);
                break;
            case "beforeEnd":
                this.appendChild(parsedNode);
                break;
            case "afterEnd":
                if (this.nextSibling)
                    this.parentNode.insertBefore(parsedNode, this.nextSibling);
                else
                    this.parentNode.appendChild(parsedNode);
                break;
        }
    }
    HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
        var r = this.ownerDocument.createRange();
        r.setStartBefore(this);
        var parsedHTML = r.createContextualFragment(htmlStr);
        this.insertAdjacentElement(where, parsedHTML);
    }
    HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
        var parsedText = document.createTextNode(txtStr);
        this.insertAdjacentElement(where, parsedText);
    }
		 **/
	}
}

if(!window.ActiveXObject){
/**
 * 扩展其它浏览器DOM元素的innerText属性
 */
	if (!!document.getBoxObjectFor || window.mozInnerScreenX != null) {
	    HTMLElement.prototype.__defineSetter__("innerText", function(sText) {
	        var parsedText = document.createTextNode(sText);
	        this.innerHTML = "";
	        this.appendChild(parsedText);
	        return parsedText;
	    });
	    HTMLElement.prototype.__defineGetter__("innerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	    });
	}
	
	/**
	 * 扩展其它浏览器DOM元素的outerText属性
	 */
	if (!!document.getBoxObjectFor || window.mozInnerScreenX != null) {
	    HTMLElement.prototype.__defineSetter__("outerText", function(sText) {
	        var parsedText = document.createTextNode(sText);
	        this.parentNode.replaceChild(parsedText, this);
	        return parsedText;
	    });
	    HTMLElement.prototype.__defineGetter__("outerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	    });
	}
}

String.prototype.getBytesLength = function() {
	var cArr = this.match(/[^\x00-\xff]/ig);
	return this.length + (cArr == null ? 0 : cArr.length);
};

String.prototype.getLimitLength = function(maxlengh, symbol) {
	if(!maxlengh || maxlengh < 0){
		return this;
	}
	var len = this.getBytesLength();

	if(len <= maxlengh){
		return this;
	}
	
	symbol = symbol == null ? ".." : symbol;
	maxlengh = maxlengh - symbol.length;

    var a = 0; 
    var temp = ''; 

    for (var i = 0; i < this.length; i++)    { 
        if (this.charCodeAt(i) > 255) a += 2; 

        else a++; 

        temp += this.charAt(i);  

        if(a >= maxlengh) {
			return temp + symbol;
		}
    } 

    return this; 
};

String.prototype.escapeHTML = function(isEscapeSpace, isEscapeBr){
    try{
            return escapeStringToHTML(this, isEscapeSpace, isEscapeBr);
    }
    catch(e){}
    
    return this;
};
String.prototype.escapeUrl = function(isEscapeSpace){
  try {
      return escapeStringToHTML(this.replace(/\n/g, ''), isEscapeSpace);
  } 
  catch (e) {
  }
  
  return this;
};
String.prototype.escapeJavascript = function(){
	return escapeStringToJavascript(this);
};

String.prototype.escapeSpace = function(){	
	return this.replace(/ /g, "&nbsp;");
};

String.prototype.escapeSameWidthSpace = function(){	
	return this.replace(/ /g, "&nbsp;&nbsp;");
};

String.prototype.escapeXML = function(){	
	return this.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;");
};
String.prototype.escapeQuot = function(){
	return this.replace(/\'/g,"&#039;").replace(/"/g,"&#034;");
};
String.prototype.startsWith = function(prefix){	
	return this.indexOf(prefix) == 0;
};
String.prototype.endsWith = function(subfix){	
	var pos = this.indexOf(subfix);
	return pos > -1 && pos == this.length - subfix.length;
};

/**
 * 去掉空格
 */
String.prototype.trim = function(){
	var chs = this.toCharArray();
	
	var st = 0;
	var off = chs.length;
	
	for(var i = 0; i < chs.length; i++){
		var c = chs[i];
		if(c == ' '){
			st++;
		}
		else{
			break;
		}
	}
	
	if(st == this.length){
		return "";
	}
	
	for(var i = chs.length; i > 0; i--){
		var c = chs[i-1];
		if(c == ' '){
			off--;
		}
		else{
			break;
		}
	}
		
	return this.substring(st, off);
};

/**
 * 将字符串转成数组
 */
String.prototype.toCharArray = function(){
	var array = [];
	
	for(var i = 0; i < this.length; i++){
		array[i] = this.charAt(i);
	}		
	
	return array;
};

/**
 * 
 */
Array.prototype.indexOf = function(object){
	for(var i = 0; i < this.length; i++) {
		if(this[i] == object){
			return i;
		}
	}
	
	return -1;
};

/**
 * 日志
 */
var log = {
	rootLogger : "info",
	
	debugLevel : {debug : true , info : true , warn : true , error : true },
	infoLevel  : {debug : false, info : true , warn : true , error : true },
	warnLevel  : {debug : false, info : false, warn : true , error : true },
	errorLevel : {debug : false, info : false, warn : false, error : true },
	
	debug : function(message){
		if(this.isDebugEnabled())
			alert("Debug : " + message);
	},	
	info : function(message){
		if(this.isInfoEnabled())
			alert("Info : " + message);
	},	
	warn : function(message){
		if(this.isWarnEnabled())
			alert("Warn : " + message);
	},
	error : function(message, exception){
		if(this.isErrorEnabled())
			alert("Error : " + message + "\n\n" + exception.message);
	},
	
	isDebugEnabled : function(){
		return eval("this." + this.rootLogger + "Level.debug");
	},	
	isInfoEnabled : function(){
		return eval("this." + this.rootLogger + "Level.info");
	},	
	isWarnEnabled : function(){
		return eval("this." + this.rootLogger + "Level.warn");
	},	
	isErrorEnabled : function(){
		return eval("this." + this.rootLogger + "Level.error");
	}	
};

var UUID_seqence = 0;

/**
 * 产生UUID，返回类型是String
 */
function getUUID(){
	var UUIDConstants_Time = new Date().getTime() + "" + (UUID_seqence++);
	if(UUID_seqence >= 100000){
		UUID_seqence = 0;
	}
	
	return UUIDConstants_Time;
};


var EmptyArrayList = new ArrayList();

/**
 * ArrayList like java.util.ArrayList
 */
function ArrayList(){
	this.instance = new Array();
}

ArrayList.prototype.size = function(){
	return this.instance.length;
};
/**
 * 在末尾追加一个
 */
ArrayList.prototype.add = function(o){
	this.instance[this.instance.length] = o;
};
/**
 * 当list中不存在该对象时才添加
 */
ArrayList.prototype.addSingle = function(o){
	if(!this.contains(o)){
		this.instance[this.instance.length] = o;
	}
};
/**
 * 在指定位置增加元素
 * @param posation 位置， 从0开始
 * @param o 要增加的元素
 */
ArrayList.prototype.addAt = function(position, o){
	if(position >= this.size() || position < 0 || this.isEmpty()){
		this.add(o);
		return;
	}
	
	this.instance.splice(position, 0, o);
};

/**
 * Appends all of the elements in the specified Collection to the end of
 * this list, in the order that they are returned by the
 * specified Collection's Iterator.  The behavior of this operation is
 * undefined if the specified Collection is modified while the operation
 * is in progress.  (This implies that the behavior of this call is
 * undefined if the specified Collection is this list, and this
 * list is nonempty.)
 */
ArrayList.prototype.addAll = function(array){
	if(!array || array.length < 1){
		return;
	}
	
	this.instance = this.instance.concat(array);
};

/**
 * 追加一个List在队尾
 */
ArrayList.prototype.addList = function(list){
	if(list && list instanceof ArrayList && !list.isEmpty()){
		this.instance = this.instance.concat(list.instance);
	}
};

/**
 * @return the element at the specified position in this list.
 */
ArrayList.prototype.get = function(index){
	if(this.isEmpty()){
		return null;
	}

	if(index > this.size()){
		return null;
	}

	return this.instance[index];
};

/**
 * 最后一个
 */
ArrayList.prototype.getLast = function(){
	if(this.size() < 1){
		return null;
	}

	return this.instance[this.size() - 1];
};

/**
 * Replace the element at the specified position in the list with the specified element
 * @param index int index of element to replace
 * @param obj Object element to be stored at the specified posotion
 * @return Object the element previously at the specified posotion
 * @throws IndexOutOfBoundException if index out of range
 */
ArrayList.prototype.set = function(index, obj){
	if(index >= this.size()){
		throw "IndexOutOfBoundException : Index " + index + ", Size "+this.size();
	}
	
	var oldValue = this.instance[index];
	this.instance[index] = obj;
	
	return oldValue;
};

/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 */
ArrayList.prototype.removeElementAt = function(index){
	if(index > this.size() || index < 0){
		return;
	}

	this.instance.splice(index, 1);
};
/**
 * Removes the element in this list.
 */
ArrayList.prototype.remove = function(o){
	var index = this.indexOf(o);
	this.removeElementAt(index);
};
/**
 * @return <tt>true</tt> if this list contains the specified element.
 */
ArrayList.prototype.contains = function(o, comparatorProperies){
	return this.indexOf(o, comparatorProperies) > -1;
};
/**
 * Searches for the first occurence of the given argument, testing 
 * for equality using the <tt>==</tt> method. 
 */
ArrayList.prototype.indexOf = function(o, comparatorProperies){
	for(var i = 0; i < this.size(); i++){
		var s = this.instance[i];
		if(s == o){
			return i;
		}
		else if(comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]){
			return i;
		}
	}

	return -1;
};
/**
 * Returns the index of the last occurrence of the specified object in this list. 
 * @return the index of the last occurrence of the specified object in this list;
 *         returns -1 if the object is not found. 
 */
ArrayList.prototype.lastIndexOf = function(o, comparatorProperies){
	for(var i = this.size() - 1; i >= 0; i--){
		var s = this.instance[i];
		if(s == o){
			return i;
		}
		else if(comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]){
			return i;
		}
	}

	return -1;
};

/**
 * Returns a view of the portion of this list between 
 * fromIndex, inclusive, and toIndex, exclusive.
 * @return a view of the specified range within this list. 
 */
ArrayList.prototype.subList = function(fromIndex, toIndex){
	if(fromIndex < 0){
		fromIndex = 0;
	}
	
	if(toIndex > this.size()){
		toIndex = this.size();
	}
	
	var tempArray = this.instance.slice(fromIndex, toIndex);
	
	var temp = new ArrayList();
	temp.addAll(tempArray);
	
	return temp;
};
/**
 * Returns an array containing all of the elements in this list in the correct order;
 *
 * @return Array
 */
ArrayList.prototype.toArray = function(){
	return this.instance;
};

/**
 * Tests if this list has no elements.
 *
 * @return <tt>true</tt> if this list has no elements;
 */
ArrayList.prototype.isEmpty = function(){
	return this.size() == 0;
};
/**
 * Removes all of the elements from this list.  The list will
 * be empty after this call returns.
 */
ArrayList.prototype.clear = function(){
	this.instance = new Array();
};
/** 
 * show all elements
 */
ArrayList.prototype.toString = function(sep){
	sep = sep || ", ";
	return this.instance.join(sep);
};


/**
 * 对ArrayList快速排序
 * 
 * @param list 要排序的ArrayList
 * @param comparatorProperies 对数据中元素的某个属性值作为排序依据
 */
function QuickSortArrayList(list, comparatorProperies) {
	QuickSortArray(list.toArray(), comparatorProperies);
};

/**
 * 对数组快速排序
 * 
 * @param arr 要排序的数组
 * @param comparatorProperies 对数据中元素的某个属性值作为排序依据
 */
function QuickSortArray(arr, comparatorProperies) {
	if(comparatorProperies){
		arr.sort(function(o1, o2){
			return o1[comparatorProperies] < o2[comparatorProperies] ? -1 : (o1[comparatorProperies] == o2[comparatorProperies] ? 0 : 1);
		});
	}
	else{
		arr.sort();
	}
};


var EmptyProperties = new Properties();

/**
 *
 */
function Properties(jsProps){
	this.instanceKeys = new ArrayList();
	this.instance = {};
	
	if(jsProps){
		this.instance = jsProps;
		for(var i in jsProps){
			this.instanceKeys.add(i);
		}
	}
};

/**
 * Returns the number of keys in this Properties.
 * @return int
 */
Properties.prototype.size = function(){
  return this.instanceKeys.size();
};

/**
 * Returns the value to which the specified key is mapped in this Properties.
 * @return value
 */
Properties.prototype.get = function(key, defaultValue){
	if(key == null){
		return null;
	}
	
	var returnValue = this.instance[key];
  
	if(returnValue == null && defaultValue != null){
		return defaultValue;
	}

	return returnValue;
};
/**
 * Removes the key (and its corresponding value) from this 
 * Properties. This method does nothing if the key is not in the Properties.
 */
Properties.prototype.remove = function(key){
	if(key == null){
		return null;
	}
	this.instanceKeys.remove(key);
	delete this.instance[key];
};
/**
 * Maps the specified <code>key</code> to the specified 
 * <code>value</code> in this Properties. Neither the key nor the 
 * value can be <code>null</code>. <p>
 *
 * The value can be retrieved by calling the <code>get</code> method 
 * with a key that is equal to the original key. 
 */
Properties.prototype.put = function(key,value){
	if(key == null){
		return null;
	}
	
	if(this.instance[key] == null){
		this.instanceKeys.add(key);
	}

	this.instance[key] = value;
};

/**
 * 直接追加，不考虑重复key
 */
Properties.prototype.putRef = function(key,value){
	if(key == null){
		return null;
	}

	this.instanceKeys.add(key);
	this.instance[key] = value;
};

/**
 * Returns the value to which the specified value is mapped in this Properties.
 * e.g:
 * userinfo.getMultilevel("department.name")  the same sa :  userinfo.get("department").get("name")
 * @return string
 */
Properties.prototype.getMultilevel = function(key, defaultValue){
	if(key == null){
		return null;
	}
	
	var _keys = key.split(".");
  
	function getObject(obj, keys, i){
		try{
			if(obj == null || (typeof obj != "object")){
				return null;
			}
	
			var obj1 = obj.get(keys[i]);
	
			if(i < keys.length - 1){
				obj1 = getObject(obj1, keys, i + 1);
			}
	
			return obj1;
		}
		catch(e){
		}

		return null;
	}

	var returnValue = getObject(this, _keys, 0);

	return returnValue == null ? defaultValue : returnValue;
};

/**
 * Tests if the specified object is a key in this Properties.
 * @return boolean
 */
Properties.prototype.containsKey = function(key){
	if(key == null){
		return false;
	}
	
	return this.instance[key] != null;
};

/**
 * Returns an ArrayList of the keys in this Properties.
 * @return ArrayList
 */
Properties.prototype.keys = function(){
	 return this.instanceKeys;
};

/**
 * Returns an ArrayList of the values in this Properties.
 * @return ArrayList
 */
Properties.prototype.values = function(){
	var vs = new ArrayList();
	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		
		if(key){
			var value = this.instance[key];
			vs.add(value);
		}
	}

	return vs;
};

/**
 * Tests if this Properties maps no keys to values.
 * @return boolean
 */
Properties.prototype.isEmpty = function(){
	return this.instanceKeys.isEmpty();
};

/**
 * Clears this Properties so that it contains no keys. 
 */
Properties.prototype.clear = function(){
	this.instanceKeys.clear();
	this.instance = {};
};
/**
 * exchange entry1(key1-value1) with entry2(key2-value2)
 */
Properties.prototype.swap = function(key1, key2){
	if(!key1 || !key2 || key1 == key2){
		return;
	}
	
	var index1 = -1;
	var index2 = -1;
	
	for(var i = 0; i < this.instanceKeys.instance.length; i++) {
		if(this.instanceKeys.instance[i] == key1){
			index1 = i;
		}
		else if(this.instanceKeys.instance[i] == key2){
			index2 = i;
		}		
	}
	
	this.instanceKeys.instance[index1] = key2;
	this.instanceKeys.instance[index2] = key1;
};

Properties.prototype.entrySet = function(){
	var result = [];
	
	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		var value = this.instance[key];
		
		if(!key){
			continue;
		}
		
		var o = new Object();
		o.key = key;
		o.value = value;
		
		result[result.length] = o;
	}
	
	return result;
};

/**
 *
 */
Properties.prototype.toString = function(){
	var str = "";

	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		str += key + "=" + this.instance[key] + "\n";
	}

	return str;
};
/**
 * 转换成key1=value1;key2=value2;的形式
 * token1 -- 对应第一层分隔符  如上式的";"
 * token2 -- 对应第二层分隔符  如上式的"="
 */
Properties.prototype.toStringTokenizer = function(token1, token2){
	token1 = token1 == null ? ";" : token1;
	token2 = token2 == null ? "=" : token2;
	var str = "";

	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		var value = this.instance[key];
		
		if(!key){
			continue;
		}
		
		if(i > 0){
			str += token1;
		}
		str += key + token2 + value;
	}

	return str;
};

Properties.prototype.toQueryString = function(){
	if(this.size() < 1){
		return "";
	}
	
	var str = "";
	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		var value = this.instance[key];
		
		if(!key){
			continue;
		}
		
		if(i > 0){
			str += "&";
		}

		if(typeof value == "object"){
			
	    }
		else{
			str += key + "=" + encodeURIat(value);
		}
	}

	return str;
};

/**
 * Ajax进行提交的时候，将其转换成ASCLL码，encodeURI不会对某个特殊字符进行转码，需要另外单独出来。
 */
//function encodeURIat(str)
//{
//	var strTemp=encodeURI(str);
//	strTemp=strTemp.replace(/&/g,"%26");  
//	strTemp=strTemp.replace(/\+/g,"%2B");
//	strTemp=strTemp.replace(/\+/g,"%2B");
//	strTemp=strTemp.replace(/(#)/g, "%23");
//
//	
//	return strTemp;
//}
/**

* 将传入的字符串中包含的特殊字符串转为url编码，以使它能正确传输

*/

function encodeURIat(inputStr) {
    if( (typeof inputStr) !=="string" ) {
         return "";
    }
    inputStr = encodeURI(inputStr);
    var reg = /&|\/|\+|\?|\s|%|#|=/g;
    if( reg.test(inputStr) ) {
       // inputStr = inputStr.replace( /(%)/g, "%25");
        inputStr = inputStr.replace( /(\/)/g, "%2F");
        inputStr = inputStr.replace( /(&)/g, "%26");
        inputStr = inputStr.replace( /(\+)/g, "%2B");
        inputStr = inputStr.replace( /(\?)/g, "%3F");
        inputStr = inputStr.replace( /(#)/g, "%23");
       // inputStr = inputStr.replace( /(\s)/g, "%20");
        inputStr = inputStr.replace( /(=)/g, "%3D");
    }
    return inputStr;
};


Properties.prototype.toInputString = function(){
	if(this.size() < 1){
		return "";
	}
	
	var str = "";
	for(var i=0; i<this.instanceKeys.size(); i++){
		var key = this.instanceKeys.get(i);
		var value = this.instance[key];
		
		if(!key){
			continue;
		}

		if(typeof value == "object"){
			
	    }
		else{
			str += "<input type='hidden' name=\"" + key + "\" value=\"" + encodeURI(value) + ">";
		}
	}

	return str;
};

function Set(){
	this.instance = new Array();
	this.key = {};
};

/**
 * var a = new Set();
 * a.add(1);
 * a.add(2);
 * a.add(3);
 * a.add(4);
 * a.add(5, 6, 7, 8, 9);
 */
Set.prototype.add = function(){
	if(arguments == null || arguments.length < 1){
		throw "arguments is null";
	}
	
	for(var i = 0; i < arguments.length; i++) {
		var a = arguments[i];
		if(!this.contains(a)){ //存在
			this.instance[this.size()] = a;
			this.key[a] = "A8"; //随便给个值
		}
	}
};

Set.prototype.size = function(){
	return this.instance.length;
};

Set.prototype.contains = function(o){
	return this.key[o] != null;
};

Set.prototype.isEmpty = function(){
	return this.size() == 0;
};

Set.prototype.clear = function(){
	this.instance = new Array();
	this.key = {
		
	};
};

Set.prototype.get = function(index){
	if(this.isEmpty()){
		return null;
	}

	if(index > this.size()){
		return null;
	}

	return this.instance[index];
};

Set.prototype.toArray = function(){
	return this.instance;
};
Set.prototype.toString = function(){
	return this.instance.join(', ');
};

/**
 * StringStringBuffer对象
 */
function StringBuffer(){
	this._strings_ = new Array();
}
StringBuffer.prototype.append = function(str){
	if(str){
		if(str instanceof Array){
			this._strings_ = this._strings_.concat(str);
		}
		else{
			this._strings_[this._strings_.length] = str;
		}
	}
	
	return this;
};
StringBuffer.prototype.reset = function(newStr){
	this.clear();
	this.append(newStr);
};
StringBuffer.prototype.clear = function(){
	this._strings_ = new Array();
};
StringBuffer.prototype.isBlank = function(){
	return this._strings_.length == 0;
};

StringBuffer.prototype.toString = function(sp){
	sp = sp == null ? "" : sp;
	if (this._strings_.length == 0)
		return "";
	return this._strings_.join(sp);
};

function V3X(){
	this.windowArgs = new Array();
	this.lastWindow = null;
	// Browser check
	var ua = navigator.userAgent;
	this.isMSIE = (navigator.appName == "Microsoft Internet Explorer")||ua.indexOf('Trident')!=-1;
	this.isMSIE5 = this.isMSIE && (ua.indexOf('MSIE 5') != -1);
	this.isMSIE5_0 = this.isMSIE && (ua.indexOf('MSIE 5.0') != -1);
	this.isMSIE6 = this.isMSIE && (ua.indexOf('MSIE 6') != -1);
	this.isMSIE7 = this.isMSIE && (ua.indexOf('MSIE 7') != -1);
	this.isMSIE8 = this.isMSIE && (ua.indexOf('MSIE 8') != -1);
	this.isMSIE9 = this.isMSIE && (ua.indexOf('MSIE 9') != -1);
	this.isMSIE10 = this.isMSIE && (ua.indexOf('MSIE 10') != -1);
	this.isMSIE11 = this.isMSIE && (ua.indexOf('rv:11') != -1);
	this.isGecko = ua.indexOf('Gecko') != -1;
	this.isGecko18 = ua.indexOf('Gecko') != -1 && ua.indexOf('rv:1.8') != -1;
	this.isSafari = ua.indexOf('Safari') != -1;
	this.isOpera = ua.indexOf('Opera') != -1;
	this.isFirefox = ua.indexOf('Firefox') != -1;
	this.isMac = ua.indexOf('Mac') != -1;
	this.isNS7 = ua.indexOf('Netscape/7') != -1;
	this.isNS71 = ua.indexOf('Netscape/7.1') != -1;
	this.isIpad = ua.indexOf('iPad') != -1;
	this.isChrome = ua.indexOf('Chrome') != -1;
	//IE6/7/8、IE9、FireFox、iPad、Chrome、Safari、Opera   
	this.currentBrowser = "";
	//引用if(v3x.getBrowserFlag('selectPeople')){}
	this.browserFlag = {
			//弹出模态窗口还是正常窗口,true:模态对话框 ；false：正常窗口 -- 首页打开、处理协同
			openWindow:[true,true,true,false,false,false,false],
			//首页栏目是否用模态对话框打开，只有ipad用open window
			sectionOpenDetail:[true,true,true,false,true,true,false],
			//选人界面 true pc false ipad -- 选人界面内部
			selectPeople:[true,true,true,false,true,true,false],
			//不支持富文本，只提供纯文本编辑框,true:支持富文本，false不支持 -- 问本编辑器
			htmlEditer:[true,true,true,false,true,true,false],
			//菜单 -- 系统内部toolbar
			hideMenu:[true,true,true,false,true,true,false],
			//使用flash 新建流程图
			newFlash:[true,true,true,false,true,false,false],
			//签章,true支持 false不支持 -- 签章
			signature:[true,true,false,false,false,false,false],
			//新建流程 true pc模式 false 只新建一次 -- 
			createProcess:[true,true,true,false,true,true,false],
			//flash  pc模式 false html5 -- 
			flash:[true,true,true,false,true,true,false],
			//是否允许下载 true 允许下载 false 屏蔽下载  -- 系统内部toolbar
			downLoad:[true,true,true,false,true,true,false],
			//打印 true pc false ipad -- 系统内部toolbar/功能
			print:[true,true,true,false,true,true,false],
			//导出Excel  true pc false ipad -- 隐藏导出功能
			exportExcel:[true,true,true,false,true,true,false],
			//是否显示上下结构,true:显示上下结构;false:纯列表显示 -- 上下结构
			pageBreak:[true,true,true,false,true,true,false],
			//菜单定位只准对ipad -- 空间栏目下拉菜单
			menuPosition:[false,false,false,true,false,false,false],
			//office插件 --
			officeMenu:[true,true,false,false,false,false,false],
			//选人界面内部div改造 -- 选人界面select list ipad 不能展开
			selectPeopleShowType:[true,true,true,false,true,true,false],
			//div实现模态窗口 -- div实现模态
			OpenDivWindow:[true,true,true,false,true,true,false],
			//select div改造
			selectDivType:[true,true,true,false,true,true,false],
			//ipad不支持双击事件
			onDbClick:[true,true,true,false,true,true,true],
			//safari 下需要模态
			needModalWindow:[true,true,true,false,true,true,false],
			//只有ie
			onlyIe:[true,true,false,false,false,false,false]
	};
	
	this.dialogCounter = 0;
	
	this.defaultLanguage = "en";
	this.currentLanguage = "";
	this.baseURL = "";
	this.loadedFiles = new Array();
	this.workSpaceTop = 130;
	if(this.isMSIE8){
		this.workSpaceTop = 140;
	}
	if(!this.isMSIE7 && !this.isMSIE8){
		this.workSpaceTop = 130;
	}
	this.workSpaceLeft = 0;
	this.workSpaceWidth = screen.width - this.workSpaceLeft;
	this.workSpaceheight = screen.height - this.workSpaceTop - 20 - (this.isMSIE7 ? 35 : 0);

	// Fake MSIE on Opera and if Opera fakes IE, Gecko or Safari cancel those
	if (this.isOpera) {
		this.isMSIE = true;
		this.isGecko = false;
		this.isSafari =  false;
	}
	
	this.settings = {
		dialog_type : "modal",
		resizable : "yes",
		scrollbars : "yes"
	};
}

V3X.prototype.init = function(contextPath, language){	
	if(contextPath){
		this.baseURL = contextPath;
	}
	
	this.currentLanguage = language;		
	//this.loadLanguage("/common/js/i18n");
	

	this.getCurrentBrowser();
};


V3X.prototype.getCurrentBrowser = function(){
	
	////IE6/7/8、IE9、FireFox、iPad、Chrome、Safari、Opera   
	
	if(this.isMSIE || this.isMSIE5 || this.isMSIE5_0 || this.isMSIE7 || this.isMSIE8) this.currentBrowser = 'MSIE';
	
	if(this.isMSIE9) this.currentBrowser = 'MSIE9';
	
	if(this.isFirefox) this.currentBrowser = 'FIREFOX';
	
	if(this.isSafari) this.currentBrowser = 'SAFARI';
	
	if(this.isChrome) this.currentBrowser = 'CHROME';
	
	if(this.isIpad) this.currentBrowser = 'IPAD';
	
	if(this.isOpera) this.currentBrowser = 'OPERA';
		
	
};

V3X.prototype.getBrowserFlag = function(name){
	
	////IE6/7/8、IE9、FireFox、iPad、Chrome、Safari、Opera   
	if(name != null && name!=''){
	
		var i =0;
		
		if(this.currentBrowser == 'MSIE')  i = 0;
		
		if(this.currentBrowser == 'MSIE9')  i = 1;
		
		if(this.currentBrowser == 'FIREFOX')  i = 2;
		
		if(this.currentBrowser == 'IPAD')  i = 3;
		
		if(this.currentBrowser == 'CHROME')  i = 4;
		
		if(this.currentBrowser == 'SAFARI')  i = 5;
		
		if(this.currentBrowser == 'OPERA')  i = 6;
		
		return this.browserFlag[name][i];
		
	}
	
};
//div窗口
V3X.prototype.openDialog = function(json) {
	return new MxtWindow(json);
};
//获得event,兼容多浏览器
V3X.prototype.getEvent = function(){   
    if(this.isMSIE){
        return window.event;//如果是ie
    }
    func=v3x.getEvent.caller;
    while(func!=null){
        var arg0=func.arguments[0];
        if(arg0){
            if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){
                return arg0;
             }
         }
         func=func.caller;
     }
    return null;
} ;  
/**
 * 
	var args = new Array();
	
	args['file']   = 'about.htm';
	args['width']  = 480;
	args['height'] = 380;
	
	v3x.openWindow(args});
 */
V3X.prototype.openWindow = function(args) {
	var html, width, height, x, y, resizable, scrollbars, url;

	this.windowArgs = args;

	html = args['html'];
		
	if(args["FullScrean"]){
		width = this.workSpaceWidth;
		height = this.workSpaceheight + this.workSpaceTop;
		
		x = 0;
		y = 0; 
	}
	else if(args["workSpace"]){
	    width = this.workSpaceWidth;
            height = this.workSpaceheight;
            
            width=width-30;
            x = this.workSpaceLeft;
            y = this.workSpaceTop; 
            //if(this.isSafari){
                    //所有浏览器，减去任务栏高度
                    y = y-40;
            //}
	}
	else if(args["workSpaceRight"]){
		width = this.workSpaceWidth - 155;
		height = this.workSpaceheight;
		if(this.isMSIE8){
			height = this.workSpaceheight-48;
		}
		if(!this.isMSIE7 && !this.isMSIE8){
			width = this.workSpaceWidth - 165;
			height = this.workSpaceheight-35;
		}
		x = 140;
		y = this.workSpaceTop;
	}
	else{
		width = args['width'] || 320;
		height = args['height'] || 200;
		
		width = parseInt(width);
		height = parseInt(height);
		
		if (this.isMSIE){
			if(this.isMSIE7||this.isMSIE8){
				height -= 6;
			}
			else{
				height += 20;
			}
		}
		
		x = args["left"] || parseInt(screen.width / 2.0) - (width / 2.0);
		y = args["top"] || parseInt(screen.height / 2.0) - (height / 2.0);		
	}

	resizable = args['resizable'] || this.settings["resizable"];
	scrollbars = args['scrollbars'] || this.settings["scrollbars"];

	url = args['url'];

	if (html) {
		var win = window.open("", "v3xPopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,minimizable=" + resizable + ",modal=yes,width=" + width + ",height=" + height + ",resizable=" + resizable);
		if (win == null) {
			return;
		}

		win.document.write(html);
		win.document.close();
		win.resizeTo(width, height);
		win.focus();
		
		return win;
	}
	else {
		var dialog_type = args["dialogType"] || this.settings["dialog_type"];
		
		if (dialog_type == "modal") {
			var features = "resizable:" + resizable 
            + ";scroll:"
            + scrollbars + ";status:no;help:no;dialogWidth:"
            + width + "px;dialogHeight:" + height + "px;";
            
			if(args["workSpace"] || args["workSpaceRight"] || (args["left"] && args["top"])){
				features += "dialogTop:" + y + "px;dialogLeft:" + x + "px;";				
			}
			else{
				var cw = (parseInt(getA8Top().document.body.offsetWidth)-width)/2;
				var ch = (parseInt(getA8Top().document.body.offsetHeight)-height)/2;
				if(cw==null || ch==null || cw <0 || ch<0){cw=200;ch=200;}
				features += this.isMSIE ? "center:yes;" : "dialogTop:"+ch+"px;dialogLeft:"+cw+"px;";
			}
			if(url.indexOf('?') != -1)
	                   url += '&';
	                 else
	                   url += '?';
	                url += '_isModalDialog=true';
			var rv = window.showModalDialog(url, window, features);
			var temp = null;
			if(this.ModalDialogResultValue == undefined){
				temp = rv;
			}
			else{
				temp = this.ModalDialogResultValue;
				this.ModalDialogResultValue = undefined;
			}
			return temp;
		}
		else {
			var modal = (resizable == "yes") ? "no" : "yes";

			if (this.isGecko && this.isMac)
				modal = "no";

			if (args['closePrevious'] != "no")
				try {this.lastWindow.close();} catch (ex) {}
			if(window.dialogArguments && args["workSpace"]){
				y -=5;
				height -=25;
			}
			var win = window.open(url, "v3xPopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=" + modal + ",minimizable=" + resizable + ",modal=" + modal + ",width=" + width + ",height=" + height + ",resizable=" + resizable);
			if (win == null) {
				return;
			}

			if (args['closePrevious'] != "no")
				this.lastWindow = win;

//			eval('try { win.resizeTo(width, height); } catch(e) { }');

			// Make it bigger if statusbar is forced
			if (this.isGecko && !this.isMSIE) {
				if (win.document.defaultView.statusbar.visible)
					win.resizeBy(0, this.isMac ? 10 : 24);
			}

			win.focus();
			
			return win;
		}
	}
};

V3X.prototype.setResultValue = function(obj) {
	this.getParentWindow().v3x.ModalDialogResultValue = obj;
};

V3X.prototype.closeWindow = function(win) {
	win.close();
};

/**
 * 得到弹出当前窗口的直接父窗口
 */
V3X.prototype.getParentWindow = function(win){
	win = win || window;
	if(win.dialogArguments){
		return win.dialogArguments;
	}
	else{
		return win.opener || win;
	}
};

V3X.prototype.loadLanguage = function(url){
	this.loadScriptFile(this.baseURL + url + "/" + this.currentLanguage + ".js?V=3_50_2_29");
};

/**
 * JS的国际化
 */
V3X.prototype.getMessage = function(key){
	try{
		var msg = eval("" + key);
		if(msg && arguments.length > 1){
			for(var i = 0; i < arguments.length - 1; i++) {
				var regEx = eval("messageRegEx_" + i);
				var repMe = "" + arguments[i + 1];
				if(repMe.indexOf("$_") != -1){
					repMe = repMe.replace("$_", "$$_");
				}
				msg = msg.replace(regEx, repMe);
			}
		}
		
		return msg;
	}
	catch(e){
	}
	
	return "";
};



/**
 * 
 */
V3X.prototype.loadScriptFile = function(url) {
	for (var i=0; i<this.loadedFiles.length; i++) {
		if (this.loadedFiles[i] == url)
			return;
	}

	document.write('<script language="javascript" type="text/javascript" charset="UTF-8" src="' + url + '"></script>');

	this.loadedFiles[this.loadedFiles.length] = url;
};
V3X.prototype.getElementPosition = function(el){
	var ua = navigator.userAgent.toLowerCase();
	// not opera spoof
	if(el.parentNode === null || el.style.display == 'none'){
		return false;
	}
	var parent = null;
	var pos = new Array(); 
	var box;   
	if(el.getBoundingClientRect){//IE 
		box = el.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		return {x:box.left + scrollLeft, y:box.top + scrollTop}; 
	}else if(document.getBoxObjectFor){ // gecko 
		box = document.getBoxObjectFor(el); 
		var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0;
		var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0; 
		pos = [box.x - borderLeft, box.y - borderTop];  
	}else{// safari & opera   
		pos = [el.offsetLeft, el.offsetTop];        
		parent = el.offsetParent;        
		if (parent != el) {             
			while (parent) {               
				pos[0] += parent.offsetLeft;               
				pos[1] += parent.offsetTop;              
				parent = parent.offsetParent;
			}
		}
		if (ua.indexOf('opera') != -1|| ( ua.indexOf('safari') != -1 && el.style.position == 'absolute')){                
			pos[0] -= document.body.offsetLeft;                
			pos[1] -= document.body.offsetTop;
		}
	}   
	if (el.parentNode){
		parent = el.parentNode;
	}else{
		parent = null;
	}
	while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML'){ // account for any scrolled ancestors      
		pos[0] -= parent.scrollLeft;         pos[1] -= parent.scrollTop;           
		if (parent.parentNode) {
			parent = parent.parentNode;
		}else {
			parent = null;
		}
	}
	return {x:pos[0], y:pos[1]}; 
};

/**
 * 是按钮失效，参数button支持id，和object
 * 
 */
function disableButton(button, height){
	height = height || "100%";
	if(!button){
		return false;
	}
	
	var el = null;
	if(typeof button == "string"){
		el = document.getElementById(button);
	}
	else{
		el = button;
	}
	
	if(!el){
		return false;
	}
	
	if(document.readyState != "complete")	{
		if(typeof button == "string"){
			window.setTimeout("disableButton('"+button+"')", 2500);
		}else{
			window.setTimeout("disableButton("+button+")", 2500);
		}
		
		return;
	}
	
	var cDisabled = el.cDisabled;
	cDisabled=(cDisabled!=null);
	if(!cDisabled){
		el.cDisabled = true;
		
		if(document.getElementsByTagName){
			var str  = "<span style='background: buttonshadow; filter: chroma(color=white) dropshadow(color=buttonhighlight, offx=1, offy=1); height: " + height + ";'>";
				str += "  <span style='filter: mask(color=white); height: " + height + "'>";
				str += el.innerHTML;
				str += "  </span>";
				str += "</span>";
				
			el.innerHTML = str;
		}
		else{
			el.innerHTML='<span style="background: buttonshadow; width: 100%; height: 100%; text-align: center;">'+'<span style="filter:Mask(Color=buttonface) DropShadow(Color=buttonhighlight, OffX=1, OffY=1, Positive=0); height: 100%; width: 100%; text-align: center;">'+el.innerHTML+'</span>'+'</span>';
		}
	
		if(el.onclick!=null){
			el.cDisabled_onclick = el.onclick;
			el.onclick = null;
		}
		
		if(el.onmouseover!=null){
			el.cDisabled_onmouseover = el.onmouseover;
			el.onmouseover = null;
		}
		
		if(el.onmouseout!=null){
			el.cDisabled_onmouseout = el.onmouseout;
			el.onmouseout = null;
		}
	}
}

/**
 * 使按钮生效
 */
function enableButton(button){
	if(!button){
		return false;
	}
	
	var el = null;
	if(typeof button == "string"){
		el = document.getElementById(button);
	}
	else{
		el = button;
	}
	
	if(!el){
		return false;
	}

	var cDisabled=el.cDisabled;
	cDisabled=(cDisabled!=null);
	
	if(cDisabled){
		el.cDisabled=null;
		el.innerHTML=el.children[0].children[0].innerHTML;
		
		if(el.cDisabled_onclick!=null){
			el.onclick=el.cDisabled_onclick;
			el.cDisabled_onclick=null;
		}
		
		if(el.cDisabled_onmouseover!=null){
			el.onmouseover=el.cDisabled_onmouseover;
			el.cDisabled_onmouseover=null;
		}
		
		if(el.cDisabled_onmouseout!=null){
			el.onmouseout=el.cDisabled_onmouseout;
			el.cDisabled_onmouseout=null;
		}
		
	}	
}



/*************************************   附件  **********************************************************/

var attachmentConstants = {
	height : 26
};

function downloadAttachment(fileId, createDate, filename){
//	var contextPath = v3x.baseURL;
/*	var contextPath = _ctxPath;
	var f = document.forms['downloadFileForm'];
	if(!f){
		var form = document.createElement("<form name='downloadFileForm' action='" + contextPath + "/fileUpload.do' method='get' target='downloadFileFrame' style='margin:0px;padding:0px'></form>");
		document.body.appendChild(form);
		form.appendChild(document.createElement("<input type='hidden' name='method' value='download'>"));
		form.appendChild(document.createElement("<input type='hidden' name='viewMode' value='download'>"));
		form.appendChild(document.createElement("<input type='hidden' name='fileId' value=''>"));
		form.appendChild(document.createElement("<input type='hidden' name='createDate' value=''>"));
		form.appendChild(document.createElement("<input type='hidden' name='filename' value=''>"));

		f = document.forms['downloadFileForm'];
	}
	
	f.fileId.value = fileId;
	f.createDate.value = createDate;
	f.filename.value = filename;
	
	f.submit();*/
}

/**
 * 附件对象
 * 特别说明：needClone 是指，该附件需要复制，如：转发协同的原有附件需要复制一份
 */
function Attachment(id, reference, subReference, category, type, filename, mimeType, createDate, size, fileUrl, description, needClone,extension,icon,onlineView,isCanTransform,v){
	this.id = id;
	this.reference = reference;
	this.subReference = subReference;
	this.category = category;
	this.type = type;
	this.filename = filename;
	this.mimeType = mimeType;
	this.createDate = createDate;
	this.size = size;
	this.fileUrl = fileUrl;
	this.description = description || "";
	this.needClone = needClone;
	  this.extension = extension;
	
	this.icon = icon;
	
	//office永中转换开关判断参数
	this.isCanTransform = isCanTransform == 'enable' ? true : false; 
	
	this.onlineView = onlineView == null ? true : onlineView;
	
	this.extReference = ""; //扩展Reference，在保存附件表的时候，Reference字段以这个值为准（前提是不空），否则以接口传来的参数为准
	this.extSubReference = ""; //扩展subReference，在保存附件表的时候，subReference字段以这个值为准（前提是不空），否则以接口传来的参数为准
	this.showArea="";
	this.embedInput=""; //内嵌inputid值
	this.hasSaved=false;
	this.v=v;
	this.canFavourite=true;
	this.isShowImg=false;
	this.fileUrl2 = fileUrl;//fileUrl2 用于备份旧的fileUrl，当编辑office时，会产生一个新的fileUrl，此时将旧的fileUrl备份，fileUrl变量中始终存储的是最新值
}



var pw = new Object();
function loadInit(){
	try{
		var ocxObj=new ActiveXObject("HandWrite.HandWriteCtrl");
		pw.installDoc= ocxObj.WebApplication(".doc");
		pw.installXls=ocxObj.WebApplication(".xls");
		pw.installWps=ocxObj.WebApplication(".wps");
		pw.installEt=ocxObj.WebApplication(".et");		
	}catch(e)
	{
		pw.installDoc=false;
		pw.installXls=false;
		pw.installWps=false;
		pw.installEt=false;
	}
	if(pw.installDoc){
		attFileType.put("application/msword","OfficeWord");
		attFileType.put("application/vnd.openxmlformats-officedocument.wordprocessingml.document","OfficeWord");
		attFileType.put(".doc","OfficeWord");
		attFileType.put(".docx","OfficeWord");
		attFileType.put("application/kswps","OfficeWord");
		attFileType.put(".wps","OfficeWord");
	}
	if(pw.installXls){
		attFileType.put("application/vnd.ms-excel","OfficeExcel");
		attFileType.put("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","OfficeExcel");
		attFileType.put(".xls","OfficeExcel");
		attFileType.put(".xlsx","OfficeExcel");
		attFileType.put("application/kset","OfficeExcel");
		attFileType.put(".et","OfficeExcel");
	}
	if(pw.installWps){
		attFileType.put("application/kswps","OfficeWord");
		attFileType.put(".wps","OfficeWord");
		attFileType.put("application/msword","OfficeWord");
		attFileType.put("application/vnd.openxmlformats-officedocument.wordprocessingml.document","OfficeWord");
		attFileType.put(".doc","OfficeWord");
		attFileType.put(".docx","OfficeWord");
	}
	if(pw.installEt){
		attFileType.put("application/kset","OfficeExcel");
		attFileType.put(".et","OfficeExcel");
		attFileType.put("application/vnd.ms-excel","OfficeExcel");
		attFileType.put("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","OfficeExcel");
		attFileType.put(".xls","OfficeExcel");
		attFileType.put(".xlsx","OfficeExcel");
	}
}

function getMimeType(mimeType,name){
	var filename = name.toLocaleLowerCase();
	var point = filename.lastIndexOf(".");
	if(point != -1){
		filename = filename.substring(point);
	}
	if(attFileType){
		if(attFileType.get(mimeType)){
			return attFileType.get(mimeType);
		}
		if(attFileType.get(filename)){
			return attFileType.get(filename);
		}
	}
	return null;
}


/**
 * 在附件区显示附件
 */
Attachment.prototype.show = function(isShowLink, isShowClose,onlineEdit){
	document.write(this.toString(isShowLink, isShowClose,onlineEdit));
};

var allowTransType = [ "doc", "docx", "xls", "xlsx", "ppt", "pptx", "rtf", "eio" ];

Attachment.prototype.allowTrans = function(){
	if(this.type != 0 && this.type != 3){
		return false;
	}
	
	if(parseInt(this.size) > 5242880){
		return false;
	}
	
	var filename = this.filename.toLowerCase();
	for ( var i = 0; i < allowTransType.length; i++) {
		if(filename.endsWith("." + allowTransType[i])){
			return true;
		}
	}
	
	return false;
};

/**
 * 金格插件只能编辑如下格式的文件
 */
Attachment.prototype.canEditOnline = function(){
	if(this.type !=0){
		return false;
	}
	var mimetype =  getMimeType(this.mimeType,this.filename);
	if(mimetype){
		return true;
	}
	return false;
};

/**
 * @param isShowLink
 * @param isShowDelete
 * @param onlineEdit
 */
Attachment.prototype.toString = function(isShowLink, isShowDelete, onlineEdit, width){
    var contextPath = _ctxPath;
    loadInit();
//  var contextPath = v3x.baseURL;
    var str = "";
    //换行
        var t=null;
        if(this.type!=2){
            t=$("#attachmentArea"+this.showArea).prev();
        }else{
            t=$("#attachment2Area"+this.showArea).prev();
        }
            var df="left";
            var formVisible= ";height: " + attachmentConstants.height + "px; ";
            var noWrapStr = "noWrap";
            var whiteSpaceStr = "";
            if(t && t.attr("comp")!= undefined){
                var tj = $.parseJSON('{' + t.attr("comp") + '}');
                df=((tj.isBR == undefined) ? false : tj.isBR) ? "none" : "left";
                formVisible=((tj.displayMode == undefined) ? formVisible : ";") ;
                noWrapStr = ((tj.displayMode == undefined) ? noWrapStr : "");
				whiteSpaceStr = ((tj.displayMode == undefined) ? whiteSpaceStr : "white-space:pre-wrap");
    		    
            }
            
    str += "<div id='attachmentDiv_" + this.fileUrl2 + "' class='attachment_block' style='line-height: 14px;' "+
	
	noWrapStr+">";
    if(this.type != 1 && !this.isShowImg){
            str += '<span ></span>'  ;
//str += "<img src='" + contextPath + "/common/images/attachmentICON/" + this.icon + "' border='0' height='16' width='16' align='absmiddle' style='margin-right: 3px;'>";

    }
    if(this.isShowImg){
    	str += "<img style=\"CURSOR: pointer\" onclick=\"window.showModalDialog($(this).attr('src'),window,'dialogHeight:768px;dialogWidth:1024px;center:yes;resizable:yes;')\" src=\""+ serverPath +"/fileUpload.do?method=showRTE&fileId="+this.fileUrl2+"&createDate=" + this.createDate.substring(0, 10) + "&type=image\">";
    }else if(isShowLink && (this.type == 0 || this.type == 3 || this.type == 5)){//downloadURL
        if(this.type == 3){
            str += "<a onclick=\'downloadAttachment(\""+this.fileUrl2+"\",\""+this.createDate.substring(0, 10)+"\",\""+escapeStringToHTML(this.filename)+"\")\' title=\"" + escapeStringToHTML(this.filename) + "\" target='downloadFileFrame' style='font-size:12px;color:#007CD2;' class='like-a'>";
        }
        else{
          str += "<a href=\"" + contextPath + "/file" + (this.v?"Download":"Upload") + ".do?method=download&fileId=" + this.fileUrl2 + (this.v?("&v=" + this.v):"") + "&createDate=" + this.createDate.substring(0, 10) + "&filename=" + encodeURIComponent(this.filename) + "\" title=\"" + escapeStringToHTML(this.filename) + "\" target='downloadFileFrame' style='font-size:12px;color:#007CD2;'>";
        }
    }
    if(onlineEdit && this.category != 2){
            str += "<a onclick=\"editOfficeOnline(\'"+this.id+"\')\" title=\"" + escapeStringToHTML(this.filename) + "\" target='downloadFileFrame' style='font-size:12px;color:#007CD2;' class='like-a'>";
            isShowLink = true;
    }
    if((this.type == 2 || this.type == 4) && this.description && (onlineEdit != false)){    //文档
            var click = "";
            var suffix = ""; //表单子流程中的关联文档 关联的是主流程id，需要在此传入子流程id，用于判断权限.
            if(this.type == 4){
                    try{
                            if(parent.parent.openerSummaryId && parent.parent.openerSummaryId != this.reference){
                                    suffix = "&openerSummaryId=" + parent.parent.openerSummaryId;
                            } else {
                                    if(noFlowRecordId) {
                                            suffix = "&noFlowRecordId=" + noFlowRecordId;
                                    }
                            }
                    }
                    catch(e){
                    }
            }

            if(this.mimeType == "collaboration"){
                    click = "openDetailURL('"+contextPath+"/collaboration/collaboration.do?method=summary&openFrom=glwd&type=&affairId="+ this.description+ "&baseObjectId=" + this.reference +"&baseApp="+ this.category +"')";
            }
            if(this.mimeType == "edoc"){
                    click = "openDetailURL('"+contextPath+"/edocController.do?method=detailIFrame&from=Done&openFrom=glwd&affairId=" + this.description + "&isQuote=true&baseObjectId=" + this.reference +"&baseApp="+ this.category +"')";
            }
            else if(this.mimeType == "km"){
                    click = "openDetailURL('" + contextPath + "/doc.do?method=docOpenIframeOnlyId&openFrom=glwd&docResId=" + this.description + "&baseObjectId=" + this.reference +"&baseApp="+ this.category + suffix + "')";
            }
            else if(this.mimeType == "meeting") {
                click = "openDetailURL('" + contextPath + "/mtMeeting.do?method=myDetailFrame&id=" + this.description + "&isQuote=true&baseObjectId=" + this.reference +"&baseApp="+ this.category + "&state=10');";
            }else if(this.mimeType == "info"){
		         click = "openDetailURL('" + contextPath + "/info/infoDetail.do?method=summary&baseObjectId=" + this.reference + "&refAffairId=" + this.description + "')";
            }
            
            str += "<a class=\"hand\" onclick=\"" + click + "\" title=\"" + escapeStringToHTML(this.filename) + "\" style='cursor: hand;font-size:12px;color:#007CD2;'>";
            isShowLink = true;
    }	
    if(this.type != 1 && (this.embedInput==null || this.embedInput=='' || this.category !=2 )){
            var len = 30;
            if(width){
                    len = parseInt(width/8);
            }
            if(!this.isShowImg){
                str += this.filename.getLimitLength(len).escapeHTML();
            }
    }else{
	 var len = 30;
        if(width){
             len = parseInt(width/8);
         }
         if(!this.isShowImg){
            str += this.filename.getLimitLength(len).escapeHTML();
          }
    }       
    
    if(this.size && this.type == 0){
        if(!this.isShowImg){
            str += "(" + (parseInt(this.size/1024) + 1) + "KB)";
        }
    }
    
    //显示链接
    if(isShowLink && !this.isShowImg){
            str += "</a><br/>";
    }
    //if(isShowLink && this.isCanTransform &&  this.allowTrans() && this.hasSaved){
    //        str += "[<a href=\"" + contextPath + "/officeTrans.do?method=view&fileId=" + this.fileUrl + "&createDate=" + this.createDate.substring(0, 10) + "&filename=" + encodeURIComponent(this.filename) + "\" target='downloadFileFrame' style='font-size:12px;color:#007CD2;'>" +$.i18n("officeTrans.view.label") + "</a>]";
    //}
    
    //显示删除
    if(isShowDelete){
           //  str += '<span   onclick="deleteAttachment(\''+ this.fileUrl2 + '\')" ><img id="m1DelSpan" src=\"ic_form_delete.png\"/></span>';
    }
     //因和5.0的doamin提交冲突，先屏蔽，
	//str += "&nbsp;<input type=\"hidden\" name=\"input_file_id\"   value=\""+ this.fileUrl +"\" / >&nbsp;";
	//显示附件收藏
	/*if(seeyonProductId>0 && this.hasSaved && this.canFavourite && this.type != 2&&!this.isShowImg){
	    var docManager = new knowledgeFavoriteManager();
        var oReturn =  docManager.hasFavorite(this.fileUrl2);
        var sHide = 'style="display: none;"',sShow ='';
        if(oReturn){
            sShow = sHide;
            sHide = '';
        }
        str +=  '<span id="favoriteSpan'+this.fileUrl2+'" class="ico16 unstore_16" '+sShow+' title="'+$.i18n("doc.jsp.knowledge.collection")+'" onclick="favorite(\''+ this.category + '\', \''+ this.fileUrl2 + '\',false,4)" ></span>'; 
        str +=  '<span id="cancelFavorite'+this.fileUrl2+'" class="ico16 stored_16" '+sHide+' title="'+$.i18n("doc.jsp.cancel.collection.js")+'" onclick="cancelFavorite(\''+ this.category + '\', \''+ this.fileUrl2 + '\',false,4)" ></span>';
	}*/
	//在线编辑office文档
    /*if((isShowDelete && this.canEditOnline() && this.id != undefined) && this.category == 2){
    	 str += "<iframe id='officeEditorIframe' name='officeEditorIframe' frameborder=\"0\" height=\"0\" width=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"></iframe>";
    	 str += "<span id=\"editOnline_"+this.id+"\" > <a class=\"hand\" onclick=\"editOfficeOnline4Form(\'"+this.id+"\',\'"+this.fileUrl+"\',\'"+this.filename+"\',\'"+this.mimeType+"\',\'"+this.category+"\',\'"+this.createDate+"')\"><span class=\"ico16 editor_16\"></span></a></span>";
    	 
	}*/
	str += "&nbsp;</div>";
	    
	return str;
};

$(function () {
    $(".attachment_block").each(function () {
        $(this).mouseenter(function() {
            $(this).find(".attachment_operate").show();
        }).mouseleave(function() {
            $(this).find(".attachment_operate").hide();
        });

        var _this = $(this);
        var n = _this.find(".attachment_operate_btn td").size();
        _this.find("td").width(_this.width()/n);

        _this.find(".attachment_operate_btn td").mouseenter(function() {
            _this.find(".attachment_operate_btn_bg div").eq($(this).index()).show();
        }).mouseleave(function(event) {
            _this.find(".attachment_operate_btn_bg div").hide();
        });
    });
});

//编辑 Office的附件
function editOfficeOnline4Form(id,fileUrl,filename,mimeType,category,createDate){
	var bodyType = getMimeType(mimeType,filename);
	var url = _ctxServer+"/genericController.do?ViewPage=ctp/common/fileUpload/officeEdit&id="+id+"&content="+fileUrl+"&bodyType="+bodyType+"&createDate="+createDate+"&category="+category;
	
	if(filename.indexOf(".docx")!=-1 || filename.indexOf(".DOCX")!=-1
		|| filename.indexOf(".xlsx")!=-1 || filename.indexOf(".XLSX")!=-1
		|| filename.indexOf(".pptx")!=-1 || filename.indexOf(".PPTX")!=-1){
		var confirm = $.confirm({
            'msg': $.i18n('collaboration.attEdit.officeSaveTo2003'),
            ok_fn: function () {
				officeEditorIframe.location.href=url;
            },
            cancel_fn:function(){
            	return;
	    }
        });
	}else{
		officeEditorIframe.location.href=url;
	}
}

function deleteAtt4Form(obj){
	var fileUrl = obj.getAttribute?obj.getAttribute("fileUrl"):obj.fileUrl;
	var fileName = obj.getAttribute?obj.getAttribute("fileName"):obj.fileName;
	deleteAttachmentForForm(fileUrl,fileName);
}
function openDetailURL(_url) {
	var dialogType_temp = "modal";
	if(!v3x.getBrowserFlag('openWindow')){
		dialogType_temp = "open;";
	}
    var rv = v3x.openWindow({
	     url: _url,
	     dialogType:dialogType_temp,
	     workSpace: 'yes'
	});
	
}

/**
 * 将附件对象转换成数据框
 */
Attachment.prototype.toInput = function(){
	var str = "";
	str += "<input type='hidden' name='attachment_id' value='" + this.id + "'>";
	str += "<input type='hidden' name='attachment_reference' value='" + this.reference + "'>";
	str += "<input type='hidden' name='attachment_subReference' value='" + this.subReference + "'>";
	str += "<input type='hidden' name='attachment_category' value='" + this.category + "'>";
	str += "<input type='hidden' name='attachment_type' value='" + this.type + "'>";
	str += "<input type='hidden' name='attachment_filename' value='" + escapeStringToHTML(this.filename) + "'>";
	str += "<input type='hidden' name='attachment_mimeType' value='" + this.mimeType + "'>";
	str += "<input type='hidden' name='attachment_createDate' value='" + this.createDate + "'>";
	str += "<input type='hidden' name='attachment_size' value='" + this.size + "'>";
	str += "<input type='hidden' name='attachment_fileUrl' value='" + this.fileUrl + "'>";
	str += "<input type='hidden' name='attachment_description' value='" + this.description + "'>";
	str += "<input type='hidden' name='attachment_needClone' value='" + this.needClone + "'>";
	str += "<input type='hidden' name='attachment_extReference' value='" + this.extReference + "'>";
	str += "<input type='hidden' name='attachment_extSubReference' value='" + this.extSubReference + "'>";
	
	return str;
}
/**
 * 将附件对象转换成数据框(正文附件)
 */
Attachment.prototype.toContentInput = function(){
	var str = "";
	str += "<input type='hidden' name='content_attachment_id' value='" + this.id + "'>";
	str += "<input type='hidden' name='content_attachment_reference' value='" + this.reference + "'>";
	str += "<input type='hidden' name='content_attachment_subReference' value='" + this.subReference + "'>";
	str += "<input type='hidden' name='content_attachment_category' value='" + this.category + "'>";
	str += "<input type='hidden' name='content_attachment_type' value='" + this.type + "'>";
	str += "<input type='hidden' name='content_attachment_filename' value='" + escapeStringToHTML(this.filename) + "'>";
	str += "<input type='hidden' name='content_attachment_mimeType' value='" + this.mimeType + "'>";
	str += "<input type='hidden' name='content_attachment_createDate' value='" + this.createDate + "'>";
	str += "<input type='hidden' name='content_attachment_size' value='" + this.size + "'>";
	str += "<input type='hidden' name='content_attachment_fileUrl' value='" + this.fileUrl + "'>";
	str += "<input type='hidden' name='content_attachment_description' value='" + this.description + "'>";
	str += "<input type='hidden' name='content_attachment_needClone' value='" + this.needClone + "'>";
	
	return str;
};
/**
 * 将附件转化为json数据
 */
Attachment.prototype.toJson = function(){
	return "{id:\""+this.id+"\", reference:\""+this.reference+"\", subReference:\""+this.subReference+"\", category:\""+this.category+"\", type:\""+this.type+"\", filename:\""+escapeStringToHTML(this.filename)+"\", mimeType:\""+this.mimeType+"\", createDate:\""+this.createDate+"\", size:\""+this.size+"\", fileUrl:\""+this.fileUrl+"\", description:\""+this.description+"\", needClone:\""+this.needClone+"\",extension:\""+this.extension+"\",icon:\""+this.icon+"\",extReference:\""+this.extReference+"\",extSubReference:\""+this.extSubReference+"\"}";
};
/**
 * 显示附件
 */
function showAttachment(subRef, type, attachmentTrId, numberDivId,showAttachmentArea){
	try{
		if(!theToShowAttachments){
			return;
		}
		var attachmentNumber = 0;
		var str = "";
		for(var i = 0; i < theToShowAttachments.size(); i++) {
			var att  = theToShowAttachments.get(i);
			
			if(att.subReference == subRef && att.type == type){
				str += att.toString(true, false);
				
				attachmentNumber++;
			}
		}
		if(!showAttachmentArea){
			document.write(str);
			document.close();
		}else{
			var inAtt = document.getElementById(showAttachmentArea);
			inAtt.innerHTML = str;
		}
		
		if(attachmentNumber > 0){
			if(attachmentTrId){
				var attachmentTr = document.getElementById(attachmentTrId);
				
				if(attachmentTr){
					attachmentTr.style.display = "";
				}
			}
			if(numberDivId){
				var attachmentNumberDiv = document.getElementById(numberDivId);
				if(attachmentNumberDiv){
					attachmentNumberDiv.innerHTML = "" + attachmentNumber;
				}
			}
		}else{
			if(attachmentTrId){
				var attachmentTr = document.getElementById(attachmentTrId);
				if(attachmentTr){
					attachmentTr.style.display = "none";
				}
			}
		}
		if(numberDivId){
			var attachmentNumberDiv = document.getElementById(numberDivId);
			if(attachmentNumberDiv){
				attachmentNumberDiv.innerHTML = "" + attachmentNumber;
			}
		}
	}
	catch(e){
	}
}
/**
 * 展开附件区域
 */
function exportAttachment(obj){
	if(obj.getAttribute('expand')){
		return;
	}
	
	var originalClassName = obj.className;
	obj.className = 'div-float';
	
	var h = obj.scrollHeight;
	if(h >= (attachmentConstants.height * 2)){
		obj.className = 'attachment-all-80';
	}
	else{
		obj.className = originalClassName;
	}
	
	obj.setAttribute('expand', "yes");
}

/**********************************************/
/* 一下方法用在上传
/**********************************************/
var fileUploadAttachments = new Properties();
//即时上传 不用长期保留的附件
var fileUploadAttachment = null;
// 上传数量
var fileUploadQuantity = 5;
//显示附件的区域
var attachObject = '';
//显示附件的类型
var atttachTr = '';
//是否显示附件 删除按钮
var attachDelete ;
//显示附件的个数的区域
var attachCount = true;
//表单正文中的已经删除的附件
var theHasDeleteAtt = new Properties() ;
//附件mineType对应a8文件类型
var attFileType = new Properties();
/**
 * 是否上传了附件
 */
function isUploadAttachment(){
	return !fileUploadAttachments.isEmpty();
}
/**
 * attObj 附件显示的区域
 * attachTr 附件类型显示的区域
 * attachDe 是否显示删除按钮
 * attachC  是否显示附件个数
 */
function resetAttachment(attObj,attachTr,attachDe,attachC){
	attachObject = attObj;
	atttachTr = attachTr;
	attachDelete = attachDe;
	attachCount = attachC;
	fileUploadAttachment = new Properties();
}
function clearUploadAttachments(){
	attachObject = '';
	atttachTr = '';
	attachDelete = null;
	attachCount = true;
	fileUploadAttachment.clear();
	fileUploadAttachment = null;
}
/**
 * 将附件转成input
 */
function saveAttachment(inputObj,saveEditLog){
	var atts = null;
	if(fileUploadAttachment != null){
		atts = fileUploadAttachment.values();
	}else{
		atts = fileUploadAttachments.values();
	}
	
	var attachmentInputsObj = inputObj || document.getElementById("attachmentInputs") || document.getElementById("attachmentEditInputs");
/*	if(!saveEditLog || saveEditLog != 'false'){
		if(!atts || atts.size()<=0){
			if(attachmentInputsObj && attActionLog){
				attachmentInputsObj.innerHTML = attActionLog.toInput();
			}
			return true;
		}
	}*/

	
	var attInputStr = "";
	for(var i=0; i<atts.size(); i++) {
		attInputStr += atts.get(i).toInput();
	}
	if(attachmentInputsObj){
		attachmentInputsObj.innerHTML = attInputStr;
		//保存编辑后的附件
		if(!saveEditLog || saveEditLog != 'false'){
			if(attActionLog &&  !fileUploadAttachments.isEmpty()){
//				attachmentInputsObj.innerHTML += attActionLog.toInput();
				attachmentInputsObj.innerHTML +="<input type='hidden' name='isEditAttachment' value='1'/>";
			}
		}
	}
	else{
		alert("Warn: Save attachments unsuccessful");
		return false;
	}
	
	return true;
}

/**
 * 获取当前组件提交的附件数据。对于一页存在多个上传组件，每个组件所在区域单独处理附件时（即只处理本区域附件，其他区域附件不处理），
 * 使用该方法，可以把该组件上传的附件数据，存放到以组件ID为domainid的区域内。
 * inputDomainId 上传组件id
 */
function saveAttachmentPart(inputDomainId ){
	var atts = null;
	if(fileUploadAttachment != null){
		atts = fileUploadAttachment.values();
	}else{
		atts = fileUploadAttachments.values();
	}
	if(inputDomainId){
	    var t=$("#"+inputDomainId);
	    var tj = $.parseJSON('{' + t.attr("comp") + '}');
	    var attachmentTrId=tj.attachmentTrId;
	    var attInputStr = "";

	    for(var i=0; i<atts.size(); i++) {
		if(attachmentTrId == atts.get(i).showArea){
		    attInputStr += atts.get(i).toInput();
		}
	    }
	    t.append($(attInputStr));

	}else{
		alert("ERROR: 传入参数错误！");
		return false;
	}
	return true;
}

function saveContentAttachment(inputObj){
	var atts = null;
	if(fileUploadAttachment != null){
		atts = fileUploadAttachment.values();
	}else{
		atts = fileUploadAttachments.values();
	}
	
	//删除附件的时候也要能够保存，所以将下面的注释掉
	//if(!atts || atts.size()<=0){
	//return true;
	//}
	
	var attInputStr = "";
	for(var i=0; i<atts.size(); i++) {
		attInputStr += atts.get(i).toContentInput();
	}
	
	var attachmentInputsObj = inputObj || parent.detailRightFrame.document.getElementById("contentAttachmentInputs");
	if(attachmentInputsObj){
		attachmentInputsObj.innerHTML = attInputStr;
		attachmentInputsObj.innerHTML+="<input type='hidden' name='isContentAttchmentChanged' value='1'>";
	}
	else{
		alert("Warn: Save attachments unsuccessful");
		return false;
	}
	
	return true;
}

/**
 * 将附件转成input返回
 */
function getAttachmentsToMap(){
	var atts = fileUploadAttachments.values();
	
	if(!atts || atts.isEmpty()){
		return true;
	}
	
	var attInputStr = "";
	for(var i=0; i<atts.size(); i++) {
		attInputStr += atts.get(i).toMap();
	}
	if(attInputStr!=null)
	{
		return attInputStr;
	}
	
}
/**
 * 将附件对象转换成数据框
 */
Attachment.prototype.toMap = function(){
	var str = "#attachment_id="+this.id+";";
	str += "attachment_reference" + this.reference + ";";
	str += "attachment_subReference=" + this.subReference + ";";
	str += "attachment_category=" + this.category + ";";
	str += "attachment_type=" + this.type + ";";
	str += "attachment_filename=" + escapeStringToHTML(this.filename) + ";";
	str += "attachment_mimeType=" + this.mimeType + ";";
	str += "attachment_createDate=" + this.createDate + ";";
	str += "attachment_size=" + this.size + ";";
	str += "attachment_fileUrl=" + this.fileUrl + ";";
	str += "attachment_description=" + this.description + ";";
	str += "attachment_needClone=" + this.needClone + ";";
	
	return str;
};
/**
 * 设置附件的是否复制属性
 */
function cloneAllAttachments(){
	var atts = fileUploadAttachments.values();

	for(var i = 0; i < atts.size(); i++) {
		atts.get(i).needClone = true;
	}
}

/**
 * 删除附件
 */
function deleteAttachment(fileUrl, showAlert){
	var file = fileUploadAttachments.get(fileUrl);
	showAlert = false;
	if(file == null){
		return;
	}
	if(showAlert != false ){
	    if(file.type==2){
        	    if(!confirm($.i18n("assdoc.isdeletesomeone.mesg").format(file.filename))){
        		return 1;
        	    }		
	    }else{
        	    if(!confirm($.i18n("common.isdeletesomeone.label").format(file.filename))){
        			return 1;
        		}
	    }
	}
	
//	editAttachments();
	 attActionLog = new AttActionLog();
	
	fileUploadAttachments.remove(fileUrl);
	document.getElementById("attachmentDiv_" + fileUrl).parentNode.removeChild(document.getElementById("attachmentDiv_" + fileUrl));
	//更新关联文档隐藏域
	//因为只记录位置信息，非业务信息，可以不清除
	/*       if( $("#"+file.embedInput).size()>0){
	             
	             var  assArray=$("#attachmentArea"+file.showArea).prev().children("#"+file.embedInput).attr("value").split(",");
	             var n=assArray.indexOf(file.fileUrl);
	             assArray=assArray.slice(0,n).concat(assArray.slice(n+1,assArray.length));
	             $("#attachmentArea"+file.showArea).prev().children("#"+file.embedInput).attr("value",assArray);
	         }*/
	showAttachmentNumber(file.type,file);
	
	var num = getFileAttachmentNumber(file.type,file.showArea);
	if(num < 1){
		if(!(typeof(_updateAttachmentState)!="undefined" && _updateAttachmentState))
		showAtachmentTR(file.type, "none",file.showArea);
	}
	//只有是已发送中递过来的才马上提交。
	var attachmentInputsObj=document.getElementById("attachmentInputs");
	var canUpdateAttachmentFromSended= document.getElementById("canUpdateAttachmentFromSended");
	if(canUpdateAttachmentFromSended && canUpdateAttachmentFromSended.value=="submit") 
		updateAttachment('del',attachmentInputsObj);
	//是否执行了删除操作。
	if(typeof(removeChanged)!= 'undefined') removeChanged=true;
	///
	try{
	    quoteDocumentFrame.window.deselectItem(fileUrl);
	}catch(e){   
	}
	//在删除时回调
        try{
            var attdiv="attachment2Area";
            if(file.showArea !=null)
                attdiv +=file.showArea;
                eval($("#"+attdiv).attr("callMethod"))();
        }catch(e){
        }
	  if(typeof(addScrollForDocument) =="function"){
	    addScrollForDocument();
	  }
	  try{
		    var attdiv="attachmentArea";
		    if(file.showArea !=null)
			attdiv +=file.showArea;
		    eval($("#"+attdiv).attr("delCallMethod"))();
		}catch(e){}
}
//删除附件并重置其他数据 -- 用于新闻图片的添加
function deleteAttachmentForImage(fileUrl, showAlert){
	deleteAttachment(fileUrl, showAlert);
	var imageId = document.getElementById("imageId");
	if(imageId){
		imageId.value = "";
	}
}

/**
 * locationElementid, 位置id，放置上传组件的位置，比如div的id（"dyncid"）：<div id="dyncid"> </div>
 * applicationCategory, 应用模块id
 * extensions, 文件扩展名，逗号分隔的字符串
 * quantity, 最多上传的文件数
 * isEncrypt, 是否加密
 * callMethod, 回调方法名
 *  attachmentTrId, 同一页多个上传组件的区分id
 *  firstSave，是否先保存附件表信息，默认false：后保存。
 *  atts 附件数据
 *  canDeleteOriginalAtts 是否可删除附件
 *  originalAttsNeedClone 是否需要克隆
 *  takeOver 回调方法是否接管后续逻辑，默认值（null）为接管。
 */
function dymcCreateFileUpload(locationElementid,applicationCategory,extensions,quantity,isEncrypt,callMethod, attachmentTrId,firstSave,canDeleteOriginalAtts,atts,originalAttsNeedClone,takeOver,maxSize,canFavourite){
  var downloadURL = _ctxPath + "/fileUpload.do?type="
   + ((firstSave == null) ? '' : ("&firstSave=" + firstSave))
  + "&applicationCategory=" + applicationCategory + "&extensions="
  + ((extensions == null) ? '' : extensions)
  + ((quantity == null) ? '' : ("&quantity=" + quantity))
  + ((isEncrypt == null) ? '' : ("&isEncrypt=" + isEncrypt))
  //+ "&popupTitleKey=&isA8geniusAdded=" + isA8geniusAdded
  + ((attachmentTrId == null) ? '' : ("&attachmentTrId=" + attachmentTrId))
   + ((callMethod == null) ? '' : ("&callMethod=" +callMethod))
   + ((maxSize == null) ? '' : ("&maxSize=" +maxSize))
   + ((takeOver == null) ? '' : ("&takeOver=" +takeOver));
  
//精灵上传附件
  var isA8geniusAdded=false;
  try{
	  var ufa = new ActiveXObject('UFIDA_Upload.A8Upload.2');
	  ufa.SetLimitFileSize(1024);
    isA8geniusAdded = true;
  }catch(e){
    isA8geniusAdded = false;
  }
  downloadURL += ((!isA8geniusAdded) ? '' : ("&isA8geniusAdded=" + isA8geniusAdded));
  
  
  var showAreaDiv="<div id='attachmentArea"+ ((attachmentTrId == null) ? '' :  attachmentTrId)+"' style=\"overflow: auto;\" requrl='"+downloadURL+"'></div>" ;
  
  if($("#downloadFileFrame").length==0){
  showAreaDiv=showAreaDiv+  
  "<div style=\"display:none;\"><iframe name=\"downloadFileFrame\" id=\"downloadFileFrame\" frameborder=\"0\" width=\"0\" height=\"0\"></iframe></div>";
  }
  $("#"+locationElementid).replaceWith(showAreaDiv);
  
  parseAttData(atts, attachmentTrId, true,canDeleteOriginalAtts, originalAttsNeedClone, canFavourite);
}

function parseAttData(atts, attachmentTrId, isAtt,canDeleteOriginalAtts, originalAttsNeedClone, canFavourite) {
    if (atts != null && atts != '') {
        atts = $.parseJSON(atts);
    }

    if (atts && atts instanceof Array) {
        var att;
        for ( var i = 0; i < atts.length; i++) {
            att = atts[i];
            if (isAtt) {
                if (att.type == 2)
                    continue;
            } else {
                if (att.type != 2)
                    continue;
            }
            if(canFavourite==null)
                      canFavourite=true;
            
            if (attachmentTrId){
                addAttachmentPoi(att.type, att.filename, att.mimeType,
                        att.createdate ? att.createdate.toString() : null, att.size,
                                att.fileUrl, canDeleteOriginalAtts, originalAttsNeedClone,
                                att.description, att.extension, att.icon, attachmentTrId,
                                att.reference, att.category, false,null,'',true,att.officeTransformEnable, att.v,canFavourite);
            }else{
                addAttachment(att.type, att.filename, att.mimeType,
                        att.createdate ? att.createdate.toString() : null, att.size,
                                att.fileUrl, canDeleteOriginalAtts, originalAttsNeedClone,
                                att.description, att.extension, att.icon, att.reference,
                                att.category, false,null,true, att.officeTransformEnable, att.v, canFavourite);
            }
        }
    }
}

/**
 * locationElementid, 位置id，放置关联组件的位置，比如div的id（"dyncid"）：<div id="dyncid"> </div>
 *  attachmentTrId, 同一页多个关联组件的区分id
 *  atts 关联文档数据
 *  referenceId 只当前页面正在编辑的业务ID,例如，当前正在编辑协同页面，在该页面需要引入关联文档，  此时的referenceId 为正在编辑的协同Id
 *  applicationCategory 当前应用id
 *  modids 应用id字符串为逗号（,）分隔，id值为全系统统一编号
 */
function dymcCreateAssdoc(locationElementid, attachmentTrId,modids,atts, referenceId,applicationCategory){
    var showAreaDiv='<div id="attachment2Area'
	        + (attachmentTrId ? attachmentTrId : '') + '" poi="'
	        + (attachmentTrId ? attachmentTrId : '') + '" requestUrl="'
	        + _ctxPath + '/ctp/common/associateddoc/assdocFrame.do?isBind='
	        + (modids ? modids : '') 
	        +'&referenceId='+(referenceId ? referenceId : '') 
	        +'&applicationCategory='+(applicationCategory ? applicationCategory : '') 
	        + '&poi='
	        + (attachmentTrId ? attachmentTrId : '')
	        + '" style="overflow: auto;"></div>';
	        
    $("#"+locationElementid).replaceWith(showAreaDiv);
    parseAttData(atts, attachmentTrId, false);
}

/**
 * 按钮事件
 */
function insertAttachment(targetAction){
//	var url = downloadURL + "&quantity=" + fileUploadQuantity;
//  改成由程序员控制
 
//从组件中获取此区域的是上传url
  var url =  $("#attachmentArea").attr("requrl");
  
	/*   在应用模块中实现，不能修改标准过程
	 *  if(arguments && arguments[0]){
	      url += "&selectRepeatSkipOrCover=" + arguments[0];
	    }*/
	 if(targetAction!=null && targetAction!=''){
	    url +="&targetAction="+targetAction;
	  }
	/*
	  v3x.openWindow({
		url		: url,
		width	: 400,
		height	: 250,
		resizable	: "yes"
	});
	*/
	  getCtpTop().addattachDialog = null;
	  getCtpTop().addattachDialog = getCtpTop().$.dialog({
	      title: $.i18n("fileupload.page.title"),
	  transParams:{'parentWin':window},
	  url   : url,
	  width : 400,
	  height  : 250
  });
}

/**
 * 打开特定的上传组件
 */
function insertAttachmentPoi(divid){
	//从组件中获取此区域的是上传url
	  var attdiv="attachmentArea"+divid;
	  var url =  $("#"+attdiv).attr("requrl");
	  getCtpTop().addattachDialog = null;
	  getCtpTop().addattachDialog = getCtpTop().$.dialog({
	      	title: $.i18n("fileupload.page.title"),
		  transParams:{'parentWin':window},
		  url   : url,
		  width : 400,
		  height  : 250
	  });
	  /*
	v3x.openWindow({
	  url   : url,
	  width : 400,
	  height  : 250,
	  resizable : "yes"
	});*/
}



/**
 * 打开关联文档对话框
 */
function quoteDocument(divid) {
  if(v3x.getBrowserFlag('OpenDivWindow')==true){
/*    if(isBind !="isBind"){
      isBind="";//流程表单绑定界面不显示协同
    }*/
      var attdiv="attachment2Area";
      if(divid !=undefined)
	  attdiv +=divid;
      var url =  $("#"+attdiv).attr("requestUrl");
      /*
      var atts = v3x.openWindow({
          url:  url,
          height: 500,
          width: 800
      });
	*/
      getCtpTop().addassDialog = null;
      getCtpTop().addassDialog = getCtpTop().$.dialog({
          title: $.i18n("common.mydocument.label"),
    	  transParams:{'parentWin':window,'divid':divid },
    	  url   : url,
    	  width : 1000,
    	  height  : 800
      });

      }
    }
  function quoteDocumentCallback(atts,divid){
      var attdiv="attachment2Area";
      if(divid !=undefined)
	  attdiv +=divid;
      if(atts){
        deleteAllAttachment(2,$("#"+attdiv).attr("poi"));
        for (var i = 0; i < atts.length; i++) {
            var att = atts[i]
            //addAttachment(type, filename, mimeType, createDate, size, fileUrl, canDelete, needClone, description)
            if($("#"+attdiv).attr("poi") == att.showArea){
        	addAttachmentPoi(att.type, att.filename, att.mimeType, att.createDate, att.size, att.fileUrl, true, false, att.description, null, att.mimeType + ".gif", $("#"+attdiv).attr("poi"), att.reference, att.category,  null,null,$("#"+attdiv).attr("embedInput") )
            }
        }
        if($("#"+attdiv).attr("callMethod")){
            try{
                eval($("#"+attdiv).attr("callMethod"))();
            }catch(e){
            }
        }
    }
      /*
  }else{
    var win = v3x.openDialog({
        id:"documentIpad",
        title:v3x.getMessage("collaborationLang.collaboration_alertQuoteItem"),
        url :  _ctxPath +"/ctp/common/associateddoc/assdocFrame.do",
        width: 650,
          height: 500,
          //isDrag:false,
          //targetWindow:getA8Top(),
          //fromWindow:window,
          type:'window',
          //relativeElement:obj,
          buttons:[{
              id:'btn12',
              text: v3x.getMessage("collaborationLang.submit"),
              handler: function(){
              var atts = win.getReturnValue();
              if(atts){
                  deleteAllAttachment(2,$("#"+attdiv).attr("poi"));
                  for (var i = 0; i < atts.length; i++) {
                      var att = atts[i]
                      //addAttachment(type, filename, mimeType, createDate, size, fileUrl, canDelete, needClone, description)
                      addAttachment(att.type, att.filename, att.mimeType, att.createDate, att.size, att.fileUrl, true, false, att.description, null, att.mimeType + ".gif", att.reference, att.category)
                  }
              }
              win.close();
            }

          }, {
        id:'btn21',
              text: v3x.getMessage("collaborationLang.cancel"),
              handler: function(){
            win.close();
              }
          }]
      });
  }
  if(typeof(addScrollForDocument) =="function"){
    addScrollForDocument();
  }
  */
}

/**
 * 收藏
 */
function favorite(appName,id,hasAtts,type,index){
    getA8Top().dialog = $.dialog({
        id:"docFavoriteDialog",
       url: _ctxPath+"/doc/knowledgeController.do?method=toFavorite&sourceId="+id+"&appName=" + appName + "&hasAtts=" + hasAtts + "&favoriteType="+type+"&t="+new Date(),
       isClear:false,
       targetWindow: getA8Top(),
       width: 300,
       height: 95,
       closeParam:{'show':true,handler:function(){
    	   try{hideMask();}catch(e){}
           if(typeof(getA8Top().main) == "undefined"){
               getA8Top().dialog.close();
           }else{
               if(getA8Top().main.window.fnPageDataLoad){//刷新广场
                   getA8Top().main.window.fnPageDataLoad();
               }
               if(getA8Top().main.window.fnReload){
                   getA8Top().main.window.fnReload();
               }
           }
       }}, 
       title: $.i18n('doc.collect')
   });
   favoriteTip(true,id,index);
}

/**
 * 取消收藏
 */
function cancelFavorite(appName, sourceId,hasAtts,type,index) {
    if(typeof(index)=== 'undefined' ){
        index = '';
    }
    var cancelFavorite = $("#cancelFavorite"+String(sourceId)+String(index));
    cancelFavorite.attr("disabled","disabled");
    cancelFavorite.jsonSubmit({
        action : _ctxPath+"/doc/knowledgeController.do?method=favoriteCancel",
        paramObj:{'docId':-1,'sourceId':sourceId},
        callback : function(oReturn) {
            favoriteTip(false,sourceId,index);
        }
    }); 
}

/**
 * 收藏的tip
 */
function favoriteTip(isFavorite,id,index,msg,offsetTop){
    if(typeof(id)=== 'undefined' ){
        id='';
    }
    
    if(typeof(index)!== 'undefined'){
         id = String(id) + String(index);
    }
    
    if(!msg){
        msg = $.i18n('doc.cancel.collect.success.js');
    }
    
    if(typeof(offsetTop)=== 'undefined'){
        offsetTop = -30;
    }
    
    if(isFavorite){
        $("#favoriteSpan"+id).hide();
        $("#cancelFavorite"+id).show();
    }else{
        new MxtTip({
            targetId: "cancelFavorite"+ id,
            content:msg,
            offsetTop:offsetTop,
            targetWindow:getA8Top(),
            beforeShowCallBack:function(){
                $("#favoriteSpan"+id).show();
                $("#cancelFavorite"+id).hide();
                $("#cancelFavorite"+id).removeAttr("disabled");
            }
        });
    }
    return;
}
  
/**
 * 添加附件
 */	
function addAttachment(type, filename, mimeType, createDate, size, fileUrl, canDelete, needClone, description, extension, icon, reference, category, onlineView, width,hasSaved,isCanTransform,v) {
	canDelete = canDelete == null ? true : canDelete;
	needClone = needClone == null ? false : needClone;
	description = description ==null ? "" : description;
	if(attachDelete != null) canDelete = attachDelete;
	if(!reference){
		reference = "";
	}
	if(!category){
		category = "";
	}
	if(fileUrl == null){
	    fileUrl=filename;
	}
	var attachment = new Attachment('', reference, '', category, type, filename, mimeType, createDate, size, fileUrl, description, needClone,extension,icon, onlineView,isCanTransform,v);
	attachment.hasSaved =hasSaved;
	
	if(fileUploadAttachment != null){
		if(fileUploadAttachment.containsKey(fileUrl)){
			return;
		}
		fileUploadAttachment.put(fileUrl, attachment);
	}else{
		if(fileUploadAttachments.containsKey(fileUrl)){
			return;
		}
		fileUploadAttachments.put(fileUrl, attachment);
	}
	showAtachmentObject(attachment, canDelete, width);
	showAtachmentTR(type,'','');
	if(attachCount)
		showAttachmentNumber(type,attachment);
  if(typeof(addScrollForDocument) =="function"){
		addScrollForDocument();
	}
}

/**
 * 向具体位置中增加附件
 */
function addAttachmentPoi(type, filename, mimeType, createDate, size, fileUrl, canDelete, needClone, 
		description, extension, icon, poi, reference, category, onlineView, width, embedInput,hasSaved,
		isCanTransform,v,canFavourite, isShowImg,id) {
    canDelete = canDelete == null ? true : canDelete;
    needClone = needClone == null ? false : needClone;
    description = description ==null ? "" : description;
    if(attachDelete != null) canDelete = attachDelete;
  /*  if(!reference){
      reference = "";
    }
    if(!category){
      category = "";
    }*/
    if(fileUrl == null){
            fileUrl=filename;
    }
    var attachment = new Attachment(id,reference, poi, category, type, filename, mimeType, createDate, size, fileUrl, description, needClone,extension,icon, false,isCanTransform,v);
  attachment.showArea=poi;
  attachment.embedInput=embedInput;
  attachment.hasSaved =hasSaved;
  if(canFavourite != null) attachment.canFavourite=canFavourite;
  if(isShowImg != null) attachment.isShowImg=isShowImg;
  if(fileUploadAttachment != null){
    if(fileUploadAttachment.containsKey(fileUrl)){
      return;
    }
    fileUploadAttachment.put(fileUrl, attachment);
  }else{
    if(fileUploadAttachments.containsKey(fileUrl)){
	 fileUrl+=poi; 
/*	if(!fileUploadAttachments.containsKey(fileUrl+poi)){ // 允许添加重复的关联文档这种需求有待商榷，目前尚未定论，暂时按测试的要求进行修改
	    fileUrl+=poi;  
	}else{
	    return;
	}*/
    }
    fileUploadAttachments.put(fileUrl, attachment);
  }
  showAtachmentObject(attachment, canDelete, width);
    if(attachment.isShowImg){
        //自适应图片的宽度和高度
        var hiddenInput = $("#"+attachment.embedInput).eq(0);
        hiddenInput.parent("div").css("display","block");
        hiddenInput.css("display","block");
        var inpHeight = hiddenInput.height();
        var inpWidth = hiddenInput.width();
        inpHeight=(inpHeight==0?100:inpHeight);
        inpWidth=(inpWidth==0?100:inpWidth);
        var displayDiv = $('#attachmentDiv_' + attachment.fileUrl);
        var delSpanWidth=displayDiv.find(".ico16").width() + 6;
        if(delSpanWidth <= 6) {
            delSpanWidth = 16;
        }
        if(inpHeight <= 100){
			inpHeight = 100;
		}
		
			
		//displayDiv.find("img[id!='m1DelSpan']").width(inpWidth-delSpanWidth).height(inpHeight - 45);
		setTimeout(function(){
			if(typeof adjustImageSize=="function"){
				adjustImageSize(displayDiv.closest("#"+attachment.embedInput+"_span"));
			}
		},1000);
        displayDiv.width(inpWidth).height(inpHeight);
        hiddenInput.css("display","none");
        hiddenInput.parent("div").css("display","none");
    }
    //更新附件、关联文档隐藏域
    var file=attachment;
    if($("#"+file.embedInput).size()>0){
  /*     表单提交关联文档事采用的老方式
   *  var assArray =new Array();     
        if($("#"+file.embedInput).attr("value")){
            assArray=$("#"+file.embedInput).attr("value").split(",");
        }
       
        if(!assArray.contains(file.fileUrl)){
            assArray.push(attachment.fileUrl);
        }
        $("#"+file.embedInput).attr("value", assArray);*/
        
        $("#attachmentArea"+file.showArea).prev().children("#"+file.embedInput).attr("value", poi);//附件
        $("#attachment2Area"+file.showArea).prev().children("#"+file.embedInput).attr("value", poi);//关联文档
    }
    showAtachmentTR(type,'',poi);
    
    if(attachCount)
      showAttachmentNumber(type,attachment);
    if(typeof(addScrollForDocument) =="function"){
      addScrollForDocument();
    }
  }

//start by dongyj --附件编辑
//action 0.添加 1.修改 2.删除
function AttActionLog(reference,subReference,logs,editAtt){
	this.reference = reference;
	this.subReference = subReference;
	this.logs = logs;
	this.editAtt = editAtt;
}
AttActionLog.prototype.toInput = function(){
	var result = "";
	if(this.logs && !this.logs.isEmpty()){
		result +="<input type='hidden' name='reference' value='"+this.reference+"'>";
		result +="<input type='hidden' name='subReference' value='"+this.subReference+"'>";
		result +="<input type='hidden' name='isEditAttachment' value='1'/>";
		result +="<input type='hidden' name='editAttachmentSize' value='"+this.editAtt.size()+"'/>";
		//记录log attachment
		for(var i = 0 ; i< this.logs.size();i++){
			result +=this.logs.get(i).toInput();
		}
		for(var i = 0 ; i< this.editAtt.size();i++){
			result +=this.editAtt.get(i).toInput();
		}
	}
	return result;
};
function ActionLog(action,createDate,description){
	this.action = action;
	this.createDate = createDate;
	this.des = description;
};
ActionLog.prototype.toInput = function(){
	var str = "";
	str +="<input type='hidden' name='logAction' value='"+this.action+"'>";
	str +="<input type='hidden' name='logCreateDate' value='"+this.createDate+"'>";
	str +="<input type='hidden' name='logDesc' value='"+this.des+"'>";
	return str;
}
function copyActionLog(actionLog){
	var result = new ActionLog(actionLog.action,actionLog.createDate,actionLog.des);
	return result;
}
function copyAttachment(attachment){
	var result = new Attachment(attachment.id, attachment.reference, attachment.subReference, attachment.category, attachment.type, attachment.filename, attachment.mimeType, attachment.createDate, attachment.size, attachment.fileUrl, attachment.description, attachment.needClone,attachment.extension,attachment.icon);
	result.onlineView = attachment.onlineView;
	result.extReference = attachment.extReference;
	result.extSubReference = attachment.extSubReference;
	return result;
}
var attActionLog = null;
/**
 * 显示修改附件页面 编辑成功，返回受过编辑的页面。不成功，返回null
 * @param atts 需要编辑的附件 
 * @param reference 关联id  not null
 * @param subReference 次关联id not null
 * @param category 所属应用;关联文档协同1，公文4
 */
function editAttachments(atts,reference,subReference,category){
	if(attActionLog == null){
		attActionLog = new AttActionLog(reference,subReference,null,atts);
	}
	reference = reference || "";
	subReference = subReference || "";
	var result = v3x.openWindow({
		url		: getA8Top().v3x.baseURL + "/genericController.do?ViewPage=apps/collaboration/fileUpload/attEdit&category="+category+"&reference="+reference+"&subReference="+subReference,
		width	: 550,
		height	: 430,
		resizable	: "yes"
	});
	if(result){
		var attachmentList = new ArrayList();
		var inst = result[0].instance;
		for(var i = 0 ;i < inst.length;i++){
			var att = copyAttachment(inst[i]);
			att.onlineView = false;
			attachmentList.add(att);
		}
		var logList = new ArrayList();
		inst = result[1].instance;
		if(inst.length ==0) return false;
		for(var i = 0 ;i < inst.length;i++){
			var att = copyActionLog(inst[i]);
			logList.add(att);
		}
		var save = saveEditAttachments(logList,attachmentList);
		if(!save){
			return null;
		}
		return attActionLog.editAtt;
	}
	return null;
}
function saveEditAttachments(logs,attList){
	if(!attActionLog || logs.size() ==0){
		return false;
	}
	if(attActionLog.logs){
		attActionLog.logs.addList(logs);
	}else{
		attActionLog.logs = logs;
	}
	attActionLog.editAtt = attList;
	return true;
}
/**
 * 根据4个参数得到本地存放的附件
 * @param category所属应用
 * @param reference 关联id 不指定为不限制
 * @param subReference 次关联id 不指定为不限制
 * @param type 类型（本地文档、关联文档）;多种有","隔开，不指定为不限制
 */
function getAttachment(reference,subReference,type){
	var result = new ArrayList();
	for(var i = 0 ; i < theToShowAttachments.size();i++){
		var att = theToShowAttachments.get(i);
		if(((reference && att.reference == reference) || !reference) && ((subReference && att.subReference == subReference) || !subReference) && ((type && att.type == type) || !type)){
			result.add(att);
		}
	}
	return result;
}
/**
 * 更新本地的附件
 * @param attList 更新后附件List<Attachment>
 * @param reference 关联id
 * @param subReference 次关联id
 * @param type 类型（本地文档、关联文档）;
 */
function updateAttachmentMemory(attList,reference,subReference,type){
	//本地删除 clinetAttList
	var clinetAttList = getAttachment(reference,subReference,type);
	for(var i = 0; i < clinetAttList.size(); i++) {
		var att  = clinetAttList.get(i);
		theToShowAttachments.remove(att);
	}
	//内存保存修改后的附件列表 attList
	for(var i = 0 ; i < attList.size();i++){
		theToShowAttachments.add(attList.get(i));
	}
}
//end by dongyj 附件编辑
//type:操作类型，添加(add)/删除(del)
//attachmentInputsObj:插入的区域
function updateAttachment(type,attachmentInputsObj){
	//1.保存附件
	saveContentAttachment(attachmentInputsObj);
	updateAttachmentOnly(type);
}
//公文发起人修改附件
//type:操作类型，增加或者删除
function updateAttachmentOnly(type){
	//2.向后台更新附件的变化情况
	 $('#attchmentForm').ajaxSubmit({
	        url : genericURL + "?method=updateAttachment&edocSummaryId="+edocSummaryId+"&affairId="+affairId,
	        type : 'POST',
	        success : function(data) {
	        	//在已发中修改附件给出提示，是否成功或者失败。
//	        	if(_form=="sended"){
//		        	if(data=="SUCCESS"){//成功
//		        		if(type=="add"){
//		        			alert(_("V3XLang.attachment_prompt_add_success"));
//		        		}else if(type=="del"){
//		        			alert(_("V3XLang.attachment_prompt_delete_success"));
//		        		}
//		        	}else{//失败
//	        			if(type=="add"){
//	        				alert(_("V3XLang.attachment_prompt_add_error"));
//	        			}else if(type=="del"){
//	        				alert(_("V3XLang.attachment_prompt_delete_error"));
//	        			}
//		        	}
//	        	}
	 		}
	 })         	
                	
}

function deleteAllAttachment(uploadNum,poi)
{
	var keys = fileUploadAttachments.keys();
	for(var i = 0; i < keys.size(); i++) {
		var att = fileUploadAttachments.get(keys.get(i));
		if(att.type == uploadNum){
		    if(poi != undefined && poi != att.showArea){
			continue;
		    }
			fileUploadAttachments.remove(keys.get(i));
			i -= 1;
		}
	}
	
	var id = "attachmentArea";
	if(uploadNum != 0){
		id = "attachment" + uploadNum + "Area";
	}
	if(poi!=undefined)
	    id=id+poi;
	
	var attachmentAreaObj = document.getElementById(id);
	if(attachmentAreaObj){
		attachmentAreaObj.style.display = "";
		attachmentAreaObj.innerHTML ="";
	}
	
	var id = "attachmentTR";
	if(uploadNum != 0){
		id = "attachment" + uploadNum + "TR";
	}
	if(poi!=undefined)
	    id=id+poi;
	
	var attachmentTRObj = document.getElementById(id);
	if(attachmentTRObj){
		//_display = _display || "";
		attachmentTRObj.style.display = "none";
		//attachmentTRObj.innerHTML="";
	}
}

//显示增加附件的按钮和删除附件的按钮。
function showUpdateAttachment(type){
	//已经处于附件修改状态不需要执行此操作
	if(_updateAttachmentState)return;
	
	//1.显示“插入附件”的行
	var attachmentTr=document.getElementById("attachmentTr");
	if(attachmentTr)attachmentTr.style.display="";
	var normalText=document.getElementById("normalText");
	if(normalText)normalText.style.display="none";
	var uploadAttachmentTR=document.getElementById("uploadAttachmentTR");
	if(uploadAttachmentTR)uploadAttachmentTR.style.display="";
	
	if(!theToShowAttachments)return;
	
	var attachmentAreaObj = document.getElementById("attachmentArea");
	var attachmentArea2Obj = document.getElementById("attachment2Area");
//	var contextPath = v3x.baseURL;
	var contextPath = _ctxPath;
	for(var i = 0; i < theToShowAttachments.size(); i++) {
		var att  = theToShowAttachments.get(i);
		if(att.type==0 && att.type==type){
			//本地附件
			var attDiv=document.getElementById("attachmentDiv_"+att.fileUrl);
			if(attDiv){
				var a=attDiv.getElementsByTagName("a");
				if(a){
//					var delImg = "<img src='" + contextPath + "/common/images/attachmentICON/delete.gif' onclick='deleteAttachment(\"" + att.fileUrl + "\")' class='cursor-hand' title='" +$.i18n('common.toolbar.delete.label') + "' height='11' align='absmiddle'>";
					var delImg ='<span   onclick="deleteAttachment(\''+ att.fileUrl + '\')" ></span>';  
					a[0].insertAdjacentHTML("afterEnd",delImg);	
				}
			}
		}else if(att.type==2 && att.type==type){
			//关联文档
			var attDiv=document.getElementById("attachmentDiv_"+att.fileUrl);
			if(attDiv){
				var a=attDiv.getElementsByTagName("a");
				if(a){
//					var delImg = "<img src='" + contextPath + "/common/images/attachmentICON/delete.gif' onclick='deleteAttachment(\"" + att.fileUrl + "\")' class='cursor-hand' title='" +$.i18n('common.toolbar.delete.label') + "' height='11' align='absmiddle'>";
				  var delImg ='<span   onclick="deleteAttachment(\''+ att.filename + '\')" ></span>';  
					a[0].insertAdjacentHTML("afterEnd",delImg);	
				}
			}
		}
	}	
	_updateAttachmentState=true;	
}
/**
 * 显示附件对象
 */
function showAtachmentObject(attachment, canDelete, width){
	if(!attachment){
		return
	}
	var id = "attachmentArea";
	if(attachment.type != 0){
		id = "attachment" + attachment.type + "Area";
	}
	if(attachment.showArea!=''){
		  id = id+attachment.showArea;
	}
	if(attachObject){
		id = attachObject;
	}
	var attachmentAreaObj = document.getElementById(id);
	var attAreas = $("div[id='"+id+"']");
	if(attAreas.length>1){
		
	    attAreas[attAreas.length-1].style.display = "";
	    attAreas[attAreas.length-1].innerHTML += attachment.toString(true, canDelete, undefined, width);
	}else{
	    if(attachmentAreaObj){
	        attachmentAreaObj.style.display = "";
	        attachmentAreaObj.innerHTML += attachment.toString(true, canDelete, undefined, width);
	        //ie8下上传附件之后被回填的附件html会被外面的标签遮盖了，很奇怪
	        if($(attachmentAreaObj).parent(".edit_class").length>0 && $.browser.msie  && (parseInt($.browser.version, 10)<9)){
	        	setTimeout(function(){
		        	$(attachmentAreaObj).css("display","inline-block");
		        },300);
	        }
	    }
	}
}

/**
 * 显示附件行
 * @type 附件类型
 * @param _display style.display值，默认显示
 */
function showAtachmentTR(type, _display,poi){
	var id = "attachmentTR";
	if(type != 0){
		id = "attachment" + type + "TR";
	}
	if(atttachTr){
		id = atttachTr;
	}
	if(poi!='')
	    id+=poi;
	
	var attachmentTRObj = document.getElementById(id);
	if(attachmentTRObj){
		_display = _display || "";
		attachmentTRObj.style.display = _display;
	}
}

/**
 * 显示文件附件的数量
 */
function showAttachmentNumber(type,file){
	var id = "attachmentNumberDiv";
	if(type != 0){
		id = "attachment" + type + "NumberDiv";
	}
	if(file.showArea!=''){
		  id = id+file.showArea;
	}		
	var attachmentNumberDivObj = document.getElementById(id);
	if(attachmentNumberDivObj){
		try{
			attachmentNumberDivObj.innerText = getFileAttachmentNumber(type,file.showArea);
		}catch(e){}
	}
}

/**
 * 文件附件的数量
 */
function getFileAttachmentNumber(type,showArea){
	var number = 0;
	var files = fileUploadAttachments.values();
	if(!files){
		return number;
	}
	
	for(var i = 0; i < files.size(); i++) {
		if(files.get(i).type == type &&  files.get(i).showArea==showArea ){
			number++;
		}
	}
	return number;
}

/**
 * 文件附件的名称
 */
function getFileAttachmentName(type){
    var atts = fileUploadAttachments.values();	
	if(!atts){
		return "";
	}
	var str = "";
	for(var i = 0; i < atts.size(); i++) {
			var att  = atts.get(i);			
			if(att.type == type){
			    	//str += "<div id='attachmentDiv_" + att.fileUrl + "' style='float: left;height: " +  attachmentConstants.height + 
				str += "<div id='attachmentDiv_" + att.fileUrl + "' style=' line-height: 14px;' noWrap>";   //支持超长文件名显示，原先使用上面值
	                        str += "<img src='" + v3x.baseURL + "/common/images/attachmentICON/" + att.icon + "' border='0' height='16' width='16'                                                    align='absmiddle' style='margin-right: 3px;'/>";
                            str += att.filename;
                            str += "&nbsp;</div>";
                           
			}
	}
        
            
	return str;		
}
/**
 * 发送协同用文件附件的名称
 */
function getSenderAttachmentName(subRef,type){
       var atts = parent.theToShowAttachments;
       if(!atts){
		return "";
	}
	var str = "";
	for(var i = 0; i < atts.size(); i++) {
			var att  = atts.get(i);			
			if(att.type == type&&att.subReference ==subRef){
				str += "<div id='attachmentDiv_" + att.fileUrl + "' style='float: left;height: " + 
                                                   attachmentConstants.height + "px; line-height: 14px;' noWrap>";
	                        str += "<img src='" + v3x.baseURL + "/common/images/attachmentICON/" + att.icon + "' border='0' height='16' width='16'                                                    align='absmiddle' style='margin-right: 3px;'/>";
                            str += att.filename;
                            str += "&nbsp;</div>";
                           
			}
	}
        
            
	return str;	
}



/********************************************  选人界面实体 **************************************************
 * @param type 实体类型：Member/Department/Post/Level
 * @param id 对应的实体InternalId
 * @param name 实体名称
 * @param typeName 实体类型名称：人员/部门/岗位/职务级别
 * @param acountId 所属单位id
 * @param accountShortname 所属单位别名
 * @param excludeChildDepartment 是否不包含子部门，true：不包含
 * @author tanmf 
 * Select People Element
 */
function Element(type, id, name, typeName, accountId, accountShortname, description){
	this.type = type;
	this.id = id;
	this.name = name;
	this.typeName = typeName;
	this.accountId = accountId || "";
	this.accountShortname = accountShortname || "";
	this.description = description;
	this.entity = null;
	this.isEnabled = true;
	this.excludeChildDepartment = false;
}

Element.prototype.copy = function(anth){
	this.type = anth.type;
	this.id = anth.id;
	this.name = anth.name;
	this.typeName = anth.typeName;
	this.accountId = anth.accountId;
	this.accountShortname = anth.accountShortname;
	this.description = anth.description;
	this.isEnabled = anth.isEnabled;
	this.excludeChildDepartment = anth.excludeChildDepartment;
};

Element.prototype.toString = function(){
	return this.type + "\t" + this.id + "\t" + this.name + "\t" + this.typeName + "\t" + this.accountId + "\t" + this.accountShortname;
};

/**
 * 得到Element[] 的所有名称，格式为: 谭敏锋,李立,开发部
 */
function getNamesString(elements, _sp){
    if(!elements){
        return "";
    }
    
    var sp = v3x.getMessage("V3XLang.common_separator_label") || _sp;
    
    var names = [];
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i];
        var _name = null;
        
        if(e.accountShortname){
            _name = e.name + "(" + e.accountShortname + ")";
        }
        else{
            _name = e.name;
        }
        
        names[names.length] = _name;
    }
    
    return names.join(sp);
}

/**
 * 得到Element[] 的所有名称，格式为: 谭敏锋,李立,开发部
 */
function getFullNamesString(elements){
	if(!elements){
		return "";
	}
	
	var sp = v3x.getMessage("V3XLang.common_separator_label");
	
	var deptNames = [];
	var str = "";
	for(var i=0; i<elements.length; i++) {
		if(elements[i].type == "Department") {
			str += elements[i].id+",";
		}
	}
	if(str!="") {
		str = str.substring(0, str.length-1);
		var orgAccountId=document.getElementById("orgAccountId");
		var requestCaller = new XMLHttpRequestCaller(this, "ajaxOrgManager", "getParentDepartmentFullName", false);
		requestCaller.addParameter(1, "String", str);
		requestCaller.addParameter(2, "long", orgAccountId.value);
		var rs = requestCaller.serviceRequest();
		if(rs!=null) {
			deptNames = rs.split(",");
		}
	}
	var k = 0;
	var names = [];
	for(var i = 0; i < elements.length; i++) {
		var e = elements[i];
		var _name = null;
		if(e.type == "Department") {
			_name = deptNames[k];
			k++;
		} else {
			if(e.accountShortname){
				var appName=document.getElementById("appName");
			    if(appName && appName.value=="4"){
			        if(e.type=="Account"||(orgAccountId && orgAccountId.value==e.accountId)){
			            _name = e.name;
			        }else{
			          _name=e.accountShortname+e.name;
			        }
			    }else{
			        _name = e.name + "(" + e.accountShortname + ")";
			    }
			}
			else{
				_name = e.name;
			}
		}
		names[names.length] = _name;
	}
	
	return names.join(sp);
}

/**
 * 得到Element[] 的所有Id，格式为: <br>
 * 1、如果：needType 为 true
 * Member|0977614325432,Member|23456754365745,Department|3451234132<br>
 * 2、如果：needType 为 false
 * 0977614325432,23456754365745,3451234132<br>
 * 3、如果部门不包含子部门，后面多一个1： Member|0977614325432,Department|23456754365745,Department|3451234132|1或者123412341234|1,3451234123|1,1234123
 * 
 * @needType 是否要类型标示 默认为true
 */
function getIdsString(elements, needType){
	if(!elements){
		return "";
	}
	
	if(needType == null){
		needType = true;
	}
	
	var names = [];
	for(var i = 0; i < elements.length; i++) {
		var a = null;
		if(needType){
			a = elements[i].type + "|" + elements[i].id;
		}
		else{
			a = elements[i].id;
		}
		
		names[names.length] = a + (elements[i].excludeChildDepartment ? "|1" : "");
	}
	
	return names.join(",");
}

/**
 * 将Member|0977614325432|谭敏锋|123412,Department|3451234132|开发部|1234123格式的人员数据转换成Element[]
 * 该方法只用在回显选人界面数据
 * 
 * e.g
 * String people = "Member|0977614325432|谭敏锋|123412,Department|3451234132|开发部|1234123";
 * <script>
 * elements_${选人组件id} = parseElements(people);
 * </script>
 * 
 * @param idsString 格式为 EntityType|EntityId|EntityName|AccountId
 * @param type 数据类型
 * @return Element[]，但不解释现实的名称，
 */
function parseElements(idsString){
	if(!idsString || idsString == "null"){
		return null;
	}
	
	var elements = [];
	
	var enteries = idsString.split(",");
	for(var i = 0; i < enteries.length; i++) {
		if(!enteries[i]){
			continue;
		}
		
		var e = enteries[i].split("|");
		if(e.length > 3){
			var element = new Element(e[0], e[1], e[2], null, e[3], null, '');
			
			if(e.length > 4){
				element.isEnabled = (e[4] == "true");
			}
			
			elements[elements.length] = element;
		}
		
	}

	return elements;
}

/**
 * parseElements4Exclude("Member|0977614325432,Department|3451234132");
 * parseElements4Exclude("0977614325432,3451234132", "Member");
 * 
 * @param idsString Member|0977614325432,Department|3451234132
 * @param type 指定类型
 */
function parseElements4Exclude(idsString, type){
	if(!idsString || idsString == "null"){
		return null;
	}
	
	var elements = [];
	
	var enteries = idsString.split(",");
	for(var i = 0; i < enteries.length; i++) {
		if(!enteries[i]){
			continue;
		}
		
		if(type){
			elements[elements.length] = new Element(type, enteries[i]);
		}
		else{
			var e = enteries[i].split("|");
			if(e.length == 2){
				var element = new Element(e[0], e[1]);
				
				elements[elements.length] = element;
			}
		}
	}

	return elements;
}

/**
 * 得到Element[] 的所有Id专程input，如：
 * 1、如果：needType 为 true
 * <input type='hidden' name='person' value="Member|43265345643564356">
 * <input type='hidden' name='person' value="Member|56732452435345234">
 * <input type='hidden' name='person' value="Department|-445652435345234">
 * 2、如果：needType 为 false
 * <input type='hidden' name='person' value="43265345643564356">
 * <input type='hidden' name='person' value="56732452435345234">
 * <input type='hidden' name='person' value="-445652435345234">
 * 
 * @needType 是否要类型标示 默认为true
 */
function getIdsInput(elements, inputName, needType){
	if(!elements){
		return "";
	}
	
	if(needType == null){
		needType = true;
	}
	
	var str = "";
	for(var i=0; i<elements.length; i++) {
		if(needType){
			str += "<input type='hidden' name='"+inputName+"' value=\"" + elements[i].type + "|" + elements[i].id + "\">";
		}
		else{
			str += "<input type='hidden' name='"+inputName+"' value=\"" + elements[i].id+"\">";
		}
	}
	
	return str;
}

/***************************************************  AJAX ******************************************************/

var AJAX_XMLHttpRequest_DEFAULT_METHOD = "POST";

var AJAX_XMLHttpRequest_DEFAULT_async = true; //默认异步

var AJAX_RESPONSE_XML_TAG_BEAN = "B";
var AJAX_RESPONSE_XML_TAG_LIST = "L";
var AJAX_RESPONSE_XML_TAG_Value = "V";
var AJAX_RESPONSE_XML_TAG_Property = "P";
var AJAX_RESPONSE_XML_TAG_Name = "n";


/**
 * AJAX Service Parameter
 */
function AjaxParameter(){
	this.instance =[];
};

AjaxParameter.prototype.put = function(index, type, value){
	var isArray = type.indexOf("[]") > -1;
	
	this.instance[this.instance.length] = {
		index : index,
		type  : isArray ? type.substring(0, type.length - 2) : type,
		value : value,
		isArray : isArray
	};
};

/**
 *
 */
AjaxParameter.prototype.toAjaxParameter = function(serviceName, methodName, needCheckLogin, returnValueType){
	needCheckLogin = needCheckLogin == null ? "false" : needCheckLogin;
	if(!serviceName || !methodName){
		return null;
	}
	
	var str = "";
		str += "S=" + serviceName;
		str += "&M=" + methodName; 
		str += "&CL=" + needCheckLogin; 
		str += "&RVT=" + returnValueType; 

	if(this.instance != null && this.instance.length > 0){
		for(var i = 0; i < this.instance.length; i++){
			var obj = this.instance[i];
			
			var paramterName = "P_" + obj.index + "_" + obj.type;
			
			if(obj.isArray){//数组
				if(obj.value == null || obj.value.length == 0){
					str += "&" + paramterName + "_A_N=";
				}
				else if(obj.value instanceof Array){
					for(var k = 0; k < obj.value.length; k++) {
						str += "&" + paramterName + "_A=" + encodeURIComponent(obj.value[k]);
					}
				}
			}
			else{
				var v = obj.value == null ? "" : obj.value;
				str += "&" + paramterName + "=" + encodeURIComponent(v);
			}
		}
	}
		
	return str;
};

/**
 * Browser independent XMLHttpRequestLoader
 * 
 * @param _caller d
 */
function XMLHttpRequestCaller(_caller, serviceName, methodName, async, method, needCheckLogin, actionUrl) {
	if((!serviceName || !methodName) && !actionUrl){
		alert("AJAX Service name or method, actionUrl is not null.");
		throw new Error(3, "AJAX Service name or method is not null.");
	}
	
	this.params = new AjaxParameter();
	this.serviceName = serviceName;
	this.methodName = methodName;
	this.needCheckLogin = needCheckLogin == null ? "true" : needCheckLogin;
	this.returnValueType = "XML"; //XML TEXT

	this.method = method || AJAX_XMLHttpRequest_DEFAULT_METHOD;
	this.async = (async == null ? AJAX_XMLHttpRequest_DEFAULT_async : async);
	this._caller = _caller;
	this.actionUrl = actionUrl;
	
	this.filterLogoutMessage = true;
	this.closeConnection = false;
};

/**
 * 
 * caller.addParameter(1, "String", "a8");
 * caller.addParameter(2, "Long", 2345234);
 * caller.addParameter(3, "String[]", ["tanmf", "jicnm", "maok", ""]);
 * caller.addParameter(4, "date", "2007-01-01 12:25:23");
 * 
 * @param index 参数顺序，从1开始
 * @param type 参数类型 当前支持byte Byte short Short int Integer long Long double Double float Float boolean Boolean char character String date datetime
 * @param value 参数值 可以是数组
 */
XMLHttpRequestCaller.prototype.addParameter = function(index, type, value) {
	this.params.put(index, type, value);
};

/**
 * 发出请求
 */
XMLHttpRequestCaller.prototype.serviceRequest = function() {    
	var url = null;
	var sendContent = null;
	if(this.actionUrl){
		url = getBaseURL() + this.actionUrl;
		sendContent = this.sendData;
	}
	else{
		var _url = getBaseURL() + "/getAjaxDataServlet"
		var _queryString = this.params.toAjaxParameter(this.serviceName, this.methodName, this.needCheckLogin, this.returnValueType);
		if(!_queryString){
			throw new Error(5, "没有任何参数");
		}
		
		if(_queryString.length < 500){
			this.method = "GET";
		}
		
		if(this.method.toUpperCase() == "POST" ){
			url = _url;
			sendContent = _queryString;
		}
		else if(this.method.toUpperCase() == "GET" ){
			url = _url + "?" + _queryString;
		}
	}
	
	var xmlRequest = getHTTPObject();
	var c = this._caller;
	var flm = this.filterLogoutMessage;
	
	if(!xmlRequest){
		throw new Error(2, "当前浏览器不支持XMLHttpRequest");
	}

	if(this.async){	//异步
		xmlRequest.onreadystatechange = function() {
			if (xmlRequest.readyState == 4){
				if (xmlRequest.status == 200){
					var returnValue = getXMLHttpRequestData(xmlRequest, flm);
					c.invoke(returnValue);	//回调主函数
				}
				else{
					if(c && c.showAjaxError){
						c.showAjaxError(xmlRequest.status);
					}
					else{
						c.invoke(null);
					}
				}
			}
		};
	}
	
	xmlRequest.open(this.method, url, this.async);
	xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlRequest.setRequestHeader("RequestType", "AJAX");
	if(this.closeConnection){
		xmlRequest.setRequestHeader("Connection", "close");
	}
	xmlRequest.send(sendContent);

	if(!this.async) { //同步
		if (xmlRequest.readyState == 4){
			if (xmlRequest.status == 200){
				return getXMLHttpRequestData(xmlRequest, flm);
			}
			else{
//				throw "There was a problem retrieving the XML data:\n" + xmlRequest.statusText + " for AjAX Service: \n" + this.serviceName + "." + this.methodName;
			}
		}
	}
};

function getXMLHttpRequestData(xmlRequest, filterLogoutMessage){
	var ct = xmlRequest.getResponseHeader("content-type");
	var isXML = ct && ct.indexOf("xml") >= 0;
	var data = isXML ? xmlRequest.responseXML : xmlRequest.responseText;
	
	//window.clipboardData.setData("text", data);
	if(isXML){
		data = xmlHandle(data) || xmlRequest.responseText;
	}
	
	//不需要过滤[logout]，默认都要过滤
	if(filterLogoutMessage == true && data != null && data.toString().indexOf("[LOGOUT]") == 0){
		return null;
	}

	return data;
}

/**
 * 解析XML
 */
function xmlHandle(xmlDom){
	if(!xmlDom){
		return null;
	}
  
	try{
		var root = xmlDom.documentElement;
		if(null != root) {
			var type = root.nodeName;

			if(type == AJAX_RESPONSE_XML_TAG_BEAN){
				return  beanXmlHandle(root);//bean xml
			}
			else if(type == AJAX_RESPONSE_XML_TAG_LIST){
				return  listXmlHandle(root);//bean xml
			}
			else if(type == AJAX_RESPONSE_XML_TAG_Value){
				return root.firstChild.nodeValue;
			}
		}
	}
	catch (e) {
		throw e.message;
	}
  
	return null;
};

/**
 * 解析
 * @return Properties
 */
function beanXmlHandle(_node){
	if(!_node){
		return null;
	}

	var properties = new Properties();
	properties.type = "";

	var propertys = _node.childNodes;

	if(propertys != null && propertys.length > 0){
		for (var i = 0; i < propertys.length; i++) {
			var key = propertys[i].attributes.getNamedItem(AJAX_RESPONSE_XML_TAG_Name).nodeValue;
			var value = "";

			var fChild = propertys[i].firstChild;

			if(fChild != null){
				if(fChild.childNodes != null && fChild.childNodes.length > 0){ //有子节点
					var type = fChild.nodeName;
					
					if(type == AJAX_RESPONSE_XML_TAG_BEAN){
				    	value = beanXmlHandle(fChild);
				    }
				    else if(type == AJAX_RESPONSE_XML_TAG_LIST){
				    	value = listXmlHandle(fChild);
				    }
				    else if(type == AJAX_RESPONSE_XML_TAG_Value){
				    	value = fChild.firstChild.nodeValue;
				    }
				}
				else{
					value = fChild.nodeValue;
				}
			}

			properties.putRef(key, (value));
		}
	}

	return properties;
};

/**
 *
 * @return Array Properties[]
 */
function listXmlHandle(_node){
	var list = new Array();

	if(_node != null){
		var properties = new Properties();
		var beans = _node.childNodes;

		if(beans != null && beans.length > 0){
			for (var i = 0; i < beans.length; i++) {
				var type = beans[i].nodeName;
				var returnVal = "";	
	        
				if(type == AJAX_RESPONSE_XML_TAG_BEAN){
					returnVal = beanXmlHandle(beans[i]);
				}
				else if(type == AJAX_RESPONSE_XML_TAG_LIST){
					returnVal =  listXmlHandle(beans[i]);
				}
				else if(type == AJAX_RESPONSE_XML_TAG_Value){
					returnVal = beans[i].firstChild.nodeValue;
				}
	        
				list[i] = returnVal;
			}
		}
	}

	return list;
};


/** Cross browser XMLHttpObject creator */
function getHTTPObject() 
{
  var xmlhttp;
  /*@cc_on
  @if (@_jscript_version >= 5)
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } 
      catch (E) {
        xmlhttp = false;
      }
    }
  @else
  xmlhttp = false;
  @end @*/
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } 
    catch (e) {
      xmlhttp = false;
    }
  }
  return xmlhttp;
};


function getBaseURL(){
	try{
		if(v3x){
			return v3x.baseURL;
		}
		else if(parent.v3x){
			return parent.v3x.baseURL;
		}
		else if(getA8Top().v3x){
			return getA8Top().v3x.baseURL;
		}
		else if(getA8Top().conextPath){
			return getA8Top().conextPath;
		}else{
		    return  _ctxPath;
		}
	}
	catch(e){
	}
	
	return "/seeyon";
};
//////*************zhangh add 以ajax方式提交form数据，采用post方式，提交url从form的action中读取,返回数据为Properties对象或者对象数组*********************************////////
function ajaxFormSubmit(formObj)
{
  var AjaxParams=new AjaxParameter();
  var xmlRequest=getHTTPObject();
  var _queryString=AjaxParams.FormToAjaxParameter(formObj); 
  xmlRequest.open("post",formObj.action,false);
  xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
  xmlRequest.send(_queryString);
  if (xmlRequest.readyState == 4)
  {
	if (xmlRequest.status == 200)
	{
		var returnValue = xmlHandle(xmlRequest.responseXML);
		if(returnValue==null)
		{
			returnValue=xmlRequest["responseText"];
			if(returnValue.search("<")>0)
			{
				returnValue=returnValue.substr(returnValue.search("<"));
				returnValue=getXMLDoc(returnValue);	
				returnValue = xmlHandle(returnValue);				
			}
			else
			{
				return returnValue;
			}
		}		
		if(!returnValue)
		{			
			returnValue = xmlRequest.responseTEXT;	
		}		
		return returnValue;
	}
	else
	{
		return false;
	}
  }
  return false;
};

/**
 * 创建XML文档
 */
function getXMLDoc(xml){
	var xmlDoc = null;
	if(window.ActiveXObject){
		xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
		xmlDoc.async=false;
		if(xml != null){
			xmlDoc.loadXML(xml);
		}
	}else{
		if(document.implementation && document.implementation.createDocument){
			xmlDoc = document.implementation.createDocument("","",null);
			var oParser = new DOMParser();
			xmlDoc.async=false;
			if(xml != null){
				xmlDoc = oParser.parseFromString(xml, "text/xml");
			}
		}
	}
	return xmlDoc;
}

/**
 * 转换XSL样式
 */
function getXSLDoc(xmlDoc, xslDoc){
	if(window.ActiveXObject){
		return xmlDoc.transformNode(xslDoc);
	}
	else{
		var xsltProc=new XSLTProcessor();
		xsltProc.importStylesheet(xslDoc);
		var fragment=xsltProc.transformToFragment(xmlDoc,document);
		return new XMLSerializer().serializeToString(fragment);//串行化对象
	}
}

/**
 * 用于创建空的xml文档后,得到节点下所有内容
 */
function getXmlString(sNode){
	if(window.ActiveXObject){
		return sNode.xml;
	}else{
		var div = document.createElement("div");
		div.appendChild(sNode.cloneNode(true));
		return div.innerHTML;
	}
}

////////////**************************Ajax 方式 直接提交Form数据时，把form中的数据转换成request 格式的ajax参数  zhangh add************************////////////////////
//formObj:form对象
AjaxParameter.prototype.FormToAjaxParameter = function(formObj)
{  
  var submitData="";
  var ds=new Properties();
  var i;
  var obj,objValue;
  var tempValue;
  var access;
  for(i=0;i<formObj.elements.length;i++)
  {
    obj=formObj.elements[i];
    //公文元素是否可编辑，如果可编辑就要提交数据
    access = obj.getAttribute("canSubmit");
    if(obj.disabled || (obj.readOnly && access != "true")){continue;}
    if(obj.type=="select-one" || obj.type=="hidden" || obj.type=="password" || obj.type=="text" || obj.type=="textarea")
    {
    	ds.put(obj.name,obj.value);
    }
    else if(obj.type=="select-multiple" || obj.type=="checkbox" || obj.type=="radio")
    {
      objValue=ds.get(obj.name);
      tempValue=getFormInputValue(obj);
      if(tempValue!="")
      {
        if(objValue!=null && objValue!="")
        {
          objValue+=",";          
        }
        else
        {
          objValue=tempValue;
        }
      }
      if(objValue==null){objValue="";}
      ds.put(obj.name,objValue);
    }
    submitData=ds.toQueryString();
  }
  return submitData;
};

function getFormInputValue(inputObj)
{
  var tempValue="";
  var i;
  var objs;
  if(inputObj.type=="select-multiple")
  {
    for(i=0;i<inputObj.options.length;i++)
    {
      if(inputObj.options[i].selected==true)
      {
        if(tempValue!=""){tempValue+=",";}
        tempValue+=inputObj.options[i].value;
      }
    }
  }
  else if(inputObj.type=="checkbox" || inputObj.type=="radio")
  {
    objs=document.getElementsByName(inputObj.name);
    for(i=0;i<objs.length;i++)
    {
      if(objs[i].checked==true)
      {
        if(tempValue!=""){tempValue+=",";}
        tempValue+=objs[i].value;
      }
    }    
  }
  return tempValue;
};
///////////***************************Ajax 方式 直接提交Form数据时，把form中的数据转换成ajax参数 结束***********************************************/////////////////
/**********************************************  表格排序  *****************************************************/

var dom = (document.getElementsByTagName) ? true : false;
var ie5 = (document.getElementsByTagName && document.all) ? true : false;

var arrowUp, arrowDown;

if (ie5 || dom)
	initSortTable();

function initSortTable() {
//	arrowUp = document.createElement("SPAN");
//	var tn = document.createTextNode("5");
//	arrowUp.appendChild(tn);
//	arrowUp.className = "arrow";
//
//	arrowDown = document.createElement("SPAN");
//	var tn = document.createTextNode("6");
//	arrowDown.appendChild(tn);
//	arrowDown.className = "arrow";
//	arrowUp = document.createElement("img");
//	arrowUp.style.width='9px';
//	arrowUp.style.height='4px';
//	arrowUp.src=this.baseURL+"/common/images/asc.gif";	
//	
//	arrowDown = document.createElement("img");
//	arrowDown.style.width='9px';
//	arrowDown.style.height='4px';
//	arrowDown.src=this.baseURL+"/common/images/desc.gif";	
	
	
	arrowUp = document.createElement("SPAN");
	arrowUp.className = "arrowAsc";
	arrowUp.innerHTML="&nbsp;&nbsp;"

	arrowDown = document.createElement("SPAN");
	arrowDown.className = "arrowDesc";
	arrowDown.innerHTML="&nbsp;&nbsp;"
};

function getNextSibByClass(el, className) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.className == className)
		return el;
	else
		return getNextSibByClass(el.nextSibling, className);
};
function getParentByClass(el, className) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.className == className)
		return el;
	else
		return getParentByClass(el.parentNode, className);
};
function sortTable(tableNode, nCol, bDesc, sType,dragable) {
	var tBody; 
	//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
	if(dragable){
		var divHead = getParentByClass(tableNode,'hDiv');
		var divBody = getNextSibByClass(divHead,'bDiv');
		tBody = divBody.childNodes[0].childNodes[0];
	}else{
		tBody = tableNode.tBodies[0];
	}
	var trs = tBody.rows;
	var a = new Array();
	
	//供WEBIM显示离线人员时排序使用
	var b = new Array();

	for (var i=0; i<trs.length; i++) {
		var col = trs[i];
		if(col.id.indexOf("off")!=-1){
			b[b.length] = trs[i];
		}else{
			a[a.length] = trs[i];
		}
	}
	a.sort(compareByColumn(nCol,bDesc,sType));
	b.sort(compareByColumn(nCol,bDesc,sType));

	for (var i=0; i<a.length; i++) {
		if(i%2==0){
			a[i].className="erow";
		}else{
			a[i].className="";
		}
		tBody.appendChild(a[i]);
	}
	for (var i=0; i<b.length; i++) {
		tBody.appendChild(b[i]);
	}
};

function CaseInsensitiveString(s) {
	return String(s).toLocaleString();
};

function parseDate(s) {
	return Date.parse(s.replace(/\-/g, '/'));
}

function toNumber(s) {
    return Number(s.replace(/[^0-9\.]/g, ""));
};

function compareByColumn(nCol, bDescending, sType) {
	var c = nCol;
	var d = bDescending;

	var fTypeCast = String;

	if (sType == "Number")
		fTypeCast = parseInt;
	else if (sType == "Date")
		fTypeCast = compareMyDate; //显作为字符串
	else if (sType == "CaseInsensitiveString")
		fTypeCast = CaseInsensitiveString;
	else if (sType == "Size")
		fTypeCast = compareSize;
	else if (sType == "Percent")
		fTypeCast = comparePercent;
	else if(sType == "Month")
	    fTypeCast = compareMonth
	else if(sType == "Number")
	    fTypeCast = compareNumber    
	return function (n1, n2) {
	    if(fTypeCast == String || fTypeCast == CaseInsensitiveString){
	    	var f = fTypeCast(getInnerText(n1.cells[c])).localeCompare(fTypeCast(getInnerText(n2.cells[c])));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else if(fTypeCast==compareMyDate){
	    	var f = fTypeCast(getInnerText(n1.cells[c]),getInnerText(n2.cells[c]));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else if(fTypeCast==compareSize){
	    	var f = fTypeCast(getInnerText(n1.cells[c]),getInnerText(n2.cells[c]));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else if(fTypeCast==comparePercent){
	    	var f = fTypeCast(getInnerText(n1.cells[c]),getInnerText(n2.cells[c]));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else if(fTypeCast==compareMonth){
	    	var f = fTypeCast(getInnerText(n1.cells[c]),getInnerText(n2.cells[c]));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else if(fTypeCast==compareNumber){
	    	var f = fTypeCast(getInnerText(n1.cells[c]),getInnerText(n2.cells[c]));
	    	if(d){
	    		return f * -1;
	    	}else{
	    		return f;
	    	}
	    }else{
			if (fTypeCast(getInnerText(n1.cells[c])) > fTypeCast(getInnerText(n2.cells[c])))
				return d ? -1 : +1;
			if (fTypeCast(getInnerText(n1.cells[c])) < fTypeCast(getInnerText(n2.cells[c])))
				return d ? +1 : -1;
			return 0;
	    }
	};
};
function compareNumber(n1,n2){
	if((n1==null || n1=='  ')&&(n2!=null && n2!='  ' ) ){return -1;}
	if((n2==null || n2=='  ')&&(n1!=null && n1!='  ' ) ){return 1;}
	if((n1==null || n1=='  ')&&(n2==null || n2=='  ' ) ){return 0;}
	
	var N1 = parseFloat(n1);
	var N2 = parseFloat(n2);
	if(N1>N2){
		return 1;
	}else if(N1<N2){
		return -1;
	}else{
		return 0;
	}
}
function compareMonth(m1,m2){
	//2009-08
	if((m1==null || m1=='  ')&&(m2!=null && m2!='  ' ) ){return -1;}
	if((m2==null || m2=='  ')&&(m1!=null && m1!='  ' ) ){return 1;}
	if((m1==null || m1=='  ')&&(m2==null || m2=='  ' ) ){return 0;}
	var a1 = m1.split('-');
	var a2 = m2.split('-');
	var y1 = a1[0];
	var y2 = a2[0];
	var M1 = parseInt(parseFloat(a1[1]));
	var M2 = parseInt(parseFloat(a2[1]));
	if(y1>y2){return 1;}
	if(y1<y2){return -1;}
	if(y1==y2){
		if(M1>M2){
			return 1;
		}else if(M1<M2){
			return -1;
		}else{
			return 0;
		}
	}
	
	
}
function compareSize(s1,s2){
	if((s1==null || s1=='  ')&&(s2!=null && s2!='  ' ) ){return -1;}
	if((s2==null || s2=='  ')&&(s1!=null && s1!='  ' ) ){return 1;}
	if((s1==null || s1=='  ')&&(s2==null || s2=='  ' ) ){return 0;}
	var size1 = initSize(s1);
	var size2 = initSize(s2);
    if (size1 - size2 > 0) {
        return 1;
    } else if (size1 - size2 < 0) {
        return -1;
    } else {
        return 0;
    }
	function initSize(s){
		if (s.indexOf('MB') > -1){
			return parseFloat(s)*1000;
		}else if(s.indexOf('KB')> -1){
			return parseFloat(s);
		}
	}
}

function comparePercent(s1, s2){
	if((s1==null || s1=='  ')&&(s2!=null && s2!='  ' ) ){return -1;}
	if((s2==null || s2=='  ')&&(s1!=null && s1!='  ' ) ){return 1;}
	if((s1==null || s1=='  ')&&(s2==null || s2=='  ' ) ){return 0;}
	var size1 = initPercent(s1);
	var size2 = initPercent(s2);
    if (size1 - size2 > 0) {
        return 1;
    } else if (size1 - size2 < 0) {
        return -1;
    } else {
        return 0;
    }
	function initPercent(s){
		if (s.indexOf('%') > -1){
			return parseFloat(s) * 10000;
		}
		
		return 0;
	}
}

//日期排序
 function compareMyDate(d1, d2){
 	//没日期的是两个空格郁闷
	if((d1==null || d1=='  ' || d1==' ')&&(d2!=null && d2!='  ' && d2!=' ') ){return -1;}
	if((d2==null || d2=='  ' || d2==' ')&&(d1!=null && d1!='  ' && d1!=' ') ){return 1;}
	if((d1==null || d1=='  ' || d1==' ')&&(d2==null || d2=='  ' || d2==' ') ){return 0;}
    var date1 = initDate(d1);
    var date2 = initDate(d2);
    
    if (date1 - date2 > 0) {
        return 1;
    } else if (date1 - date2 < 0) {
        return -1;
    } else {
        return 0;
    }
}
    //初始化日期
    function initDate(d){
    	// 09/08/28 12:54
    	if (d.indexOf('/') > -1 && d.indexOf(':') > -1) {
			var sYear = parseFloat(d.substr(0, 2));
			var sMounth = parseFloat(d.substr(3, 2));
			var sDay = parseFloat(d.substr(6, 2));
			var oHH = parseFloat(d.substr(9, 2));
			var oMIN = parseFloat(d.substr(12, 2));
			var oSS = 0;
            return new Date(sYear, sMounth, sDay, oHH, oMIN, oSS);
            
    	}else if (d.indexOf('-') > -1 && d.indexOf(':') > -1) {//yyyy-mm-dd hh:mm:ss
    		d = d.trim();
			var oDateArry = d.split(' ');
			var oYMDArry = oDateArry[0].split('-');
			var oHMSArry = oDateArry[1].split(':');
			var oMM = parseInt(oYMDArry[1]);
			if(oYMDArry[1].length==2 && oYMDArry[1].substr(0,1)=='0'){
				oMM = parseInt(oYMDArry[1].substr(1,1));
			}
			var oDD = parseInt(oYMDArry[2]);
			if(oYMDArry[2].length==2 && oYMDArry[2].substr(0,1)=='0'){
				oDD = parseInt(oYMDArry[2].substr(1,1));
			}
			var oHH = parseInt(oHMSArry[0]);
			if(oHMSArry[0].length==2 && oHMSArry[0].substr(0,1)=='0'){
				oHH = parseInt(oHMSArry[0].substr(1,1));
			}
			var oMin = parseInt(oHMSArry[1]);
			if(oHMSArry[1].length==2 && oHMSArry[1].substr(0,1)=='0'){
				oMin = parseInt(oHMSArry[1].substr(1,1));
			}
			var oSS = 0;
			if (oHMSArry.length == 3  &&  oHMSArry[2].length>0) {
				oSS = parseInt(oHMSArry[2]);
				if(oHMSArry[2].length==2 && oHMSArry[2].substr(0,1)=='0'){
					oSS = parseInt(oHMSArry[2].substr(1,1));
				}
			}
			return new Date(parseInt(oYMDArry[0]), oMM - 1, oDD, oHH, oMin, oSS);
    } else if(d.indexOf('-') > -1 && d.indexOf(':') == -1) {
            //yyyy-mm-dd
            var oDateArry = d.split('-');
            var oMM = parseInt(oDateArry[1]);
			if(oDateArry[1].length==2 && oDateArry[1].substr(0,1)=='0'){
				oMM = parseInt(oDateArry[1].substr(1,1));
			}
			var oDD = parseInt(oDateArry[2]);
			if(oDateArry[2].length==2 && oDateArry[2].substr(0,1)=='0'){
				oDD = parseInt(oDateArry[2].substr(1,1));
			}
            return new Date(parseInt(oDateArry[0]), oMM - 1, oDD, 0, 0, 0);
        } else if(isChina(d)) {
            var sYear = d.substr(0, 4);
            var sMounth = null;
            var sDay = null;
            //yyyy年m月d日
            if (isChina(d.substr(6, 1)) && isChina(d.substr(8, 1))) {
                sMounth = d.substr(5, 1);
                sDay = d.substr(7, 1);
            } else if(isChina(d.substr(6, 1)) && isChina(d.substr(9, 1))) {
                sMounth = d.substr(5, 1);//yyyy年m月dd日
                sDay = d.substr(7, 2);
             }else if(isChina(d.substr(7, 1)) && isChina(d.substr(9, 1))){
                sMounth = d.substr(5, 2);//yyyy年mm月d日
                sDay = d.substr(8, 1);
             } else if(isChina(d.substr(7, 1)) && isChina(d.substr(10, 1))) {
                    sMounth = d.substr(5, 2);//yyyy年mm月dd日
                    sDay = d.substr(8, 2);
             }
            return new Date(parseInt(sYear), parseInt(sMounth) - 1, parseInt(sDay), 0, 0, 0);
         }
    
	}
	function isChina(str){var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; if (!patrn.exec(str)) {return false;}else {return true;}}

	//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
	function sortColumn(e, isChangeTRColor,dragable) {
		try{
		var tmp, el;

		if (ie5)
			tmp = e.srcElement;
		else if (dom)
			tmp = e.target;
		//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
		if(dragable){
			el = getParent(tmp, "TH");
		}else{
			el = getParent(tmp, "TD");
		}
		
		
		var orderByColumn = el.orderBy;
		
		if(el == null || orderByColumn == null || orderByColumn == ""){
			sortColumnCurrentPage(e, isChangeTRColor,dragable);
		}
		else{
			sortColumnAll(el, orderByColumn,dragable);
		}
		}catch(e){}
	}

	function sortColumnAll(el, orderByColumn,dragable){
		if(!pageQueryMap) {
			var pageQueryMap = new Properties();
		}
		var oldOrderByColumn = pageQueryMap.get("orderByColumn");
		var orderByDESC = pageQueryMap.get("orderByDESC");
		
		if(orderByDESC == null){
			orderByDESC = "ASC";
		}
		else if(orderByColumn != oldOrderByColumn){
			orderByDESC = "ASC";
			pageQueryMap.put("page", 1);
		}
		else{
			orderByDESC = orderByDESC == "DESC" ? "ASC" : "DESC";
		}
		
		pageQueryMap.put("orderByColumn", orderByColumn);
		pageQueryMap.put("orderByDESC", orderByDESC);
		getPageAction(el);	
	}

	function sortColumnCurrentPage(e, isChangeTRColor,dragable) {
		var tmp, el, tHeadParent,dragable,tTable;

		if (ie5)
			tmp = e.srcElement;
		else if (dom)
			tmp = e.target;
			
		tTable = getParent(tmp, "TABLE");
		tHeadParent = getParent(tmp, "THEAD");
		
		//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
		if(dragable){
			//可拖动列表点击选中(背景更改)在后台设置，直接调用selectRow(tmp);
			//list.table.body.td.html.true= <td onclick="selectRow(this)"><div {0} style="text-align:{2}; width: 229px;">{1}</div></td>
			el = getParent(tmp, "TH");
		}else{
			var tFooterParent = getParent(tmp, "TFOOT");
			if(tmp.tagName == "TD" && tFooterParent == null && tHeadParent == null && isChangeTRColor == true){	//如果点击的是表格中的数据单元格，则选择该行
				selectRow(tmp);
			}
			el = getParent(tmp, "TD");
		}
		
		if(el == null || el.getAttribute('type') == null || el.getAttribute('type') == ""){
			return;
		}

		if (tHeadParent == null)
			return;
		
		if(!pageQueryMap) {
			var pageQueryMap = new Properties();
		}
			
		var orderByColumn = pageQueryMap.get("orderByColumn");
		if(orderByColumn){
			var orderByColumnSpanObj = document.getElementById("OrderByColumn_" + orderByColumn);
			if(orderByColumnSpanObj){
				orderByColumnSpanObj.parentNode.removeChild(orderByColumnSpanObj);
			}
		}

		if (el != null) {
			var p = el.parentNode;
			var i;

			if (el._descending)	// catch the null
				el._descending = false;
			else
				el._descending = true;

			if (tHeadParent.arrow != null) {
				//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
				if(dragable){
					tHeadParent.arrow.className='';
				}else{
					if(tHeadParent.arrow.parentNode == null){
						tHeadParent.arrow = null;
					}
					else{
						if (tHeadParent.arrow.parentNode != el) {
							tHeadParent.arrow.parentNode._descending = null;	//reset sort order
						}
						tHeadParent.arrow.parentNode.removeChild(tHeadParent.arrow);
					}
				}
			}
			
			var oDiv = el.firstChild;
			//v3x:table有两种属性1：表头固定+列宽拖动（div）2:表格(table)	
			if(dragable){
				if (el._descending){
					oDiv.className='sdesc';
				}
				else{
					oDiv.className='sasc';
				}
				tHeadParent.arrow=oDiv;
			}else{
				if (el._descending){
					tHeadParent.arrow = arrowDown.cloneNode(true);
				}
				else{
					tHeadParent.arrow = arrowUp.cloneNode(true);
				}
				el.appendChild(tHeadParent.arrow);
			}

			// get the index of the td
			for (i=0; i<p.cells.length; i++) {
				if (p.cells[i] == el) break;
			}

			var table = getParent(el, "TABLE");
			// can't fail

			sortTable(table,i,el._descending, el.getAttribute("type"),dragable);
		}
	};


function getInnerText(el) {
	if (ie5) return el.innerText;	//Not needed but it is faster

	var str = "";

	for (var i=0; i<el.childNodes.length; i++) {
		switch (el.childNodes.item(i).nodeType) {
			case 1: //ELEMENT_NODE
				str += getInnerText(el.childNodes.item(i));
				break;
			case 3:	//TEXT_NODE
				str += el.childNodes.item(i).nodeValue;
				break;
		}
	}

	return str;
};

function getParent(el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return getParent(el.parentNode, pTagName);
};

var currentSelectTr = null;

function clearSiblingStyle(objTr){
	var siblings = objTr.parentNode.childNodes;
	
	if(siblings != null){
		for(var i = 0; i < siblings.length; i++){
			var o = siblings[i];
			redoStyle(o);
		}
	}
};
/**
 * 把行的颜色还原为原始颜色
 */
function redoStyle(){
	var obj = currentSelectTr;
	if(!obj){
		return;
	}
	
	var nowClassName = obj.className;
	var oldClassName = obj.className2;
	
	if(oldClassName != null && nowClassName != oldClassName){
		obj.className = oldClassName;
	}
	
	var thisCheckbox = getCheckboxFromTr(obj);
		
	if(thisCheckbox && thisCheckbox.disabled != true){
		thisCheckbox.checked = false;
	}
	
	var children = obj.cells;
	
	for(var i = 0; i < children.length; i++) {
		var td = children.item(i);
		var cn = td.className;
		var cns = cn.split(" ");
		
		var cnnew = "";
		
		for(var j = 0; j < cns.length; j++) {
			if(cns[j] != "no-read"){
				cnnew += cns[j] + " ";
			}
		}
		
		td.className = cnnew;
	}
};

/**
 * 把行的颜色改为被选的颜色，样式名为sort-select
 */
function changeSelectedStyle(obj){
	if(obj == null){
		return;
	}
	
	var nowClassName = obj.className;
	var oldClassName = obj.className2;
		
	if(oldClassName == null){ //第一次点击
		obj.className2 = nowClassName; //创建新的标签属性
		if(obj.id.indexOf("off")!=-1){
			obj.className = "tr-select-offline";
		}else{
			obj.className = "sort-select";
		}
	}
	else if(nowClassName == oldClassName){ //当前样式为老样式
		if(obj.id.indexOf("off")!=-1){
			obj.className = "tr-select-offline";
		}else{
			obj.className = "sort-select";
		}
	}
	else{ //还原为老样式
		obj.className = oldClassName;
	}
};

/**
 *
 */
function selectRow(currentTd){
	if(currentTd.tagName == "INPUT"){
		unselectAll();
		return;
	}
	var currentTr = getParent(currentTd, "TR");
	var currentTbody = getParent(currentTr, "tbody");
	
	var e = v3x.getEvent();
	var tmp;
	if (ie5){
		tmp = e.srcElement;
	}else if (dom){
		tmp = e.target;
	}
	if(tmp.tagName == 'INPUT'){
		return;
	}
	
	if(currentTr != null && currentTbody != null){
//		clearSiblingStyle(currentTr);
		redoStyle();
		changeSelectedStyle(currentTr);
		
		currentSelectTr = currentTr;
				
		var thisCheckbox = getCheckboxFromTr(currentTr);
		if(thisCheckbox != undefined && thisCheckbox != null) {
			noSelected(thisCheckbox.name);
			
			if(thisCheckbox.disabled != true){
				thisCheckbox.checked = true;
			}
			
			unselectAll();
		}
	}
};

/**
 * 从TR中找chechbox以及radio
 * @param thisTr - TR object
 * @return chechbox object
 */
function getCheckboxFromTr(thisTr) {
	if(thisTr == null || thisTr.childNodes.length == 0) {
		return null;
	}
	else {
		for(var i=0; i<thisTr.childNodes.length; i++) {
			var thisChild = thisTr.childNodes[i];
			if(thisChild.type == "checkbox" || thisChild.type == "radio") {
				return thisChild;
			}
			else {
				var tempResult = getCheckboxFromTr(thisChild);
				if(tempResult != null) {
					return tempResult;
				}
			}
		}
	}
}

function selectAll(allButton, targetName){
	var objcts = document.getElementsByName(targetName);
	
	if(objcts != null){
		for(var i = 0; i < objcts.length; i++){
			if(objcts[i].disabled == true){
				continue;
			}
			objcts[i].checked = allButton.checked;
		}
	}
};

function noSelected(checkboxName){
	var checkboxes = document.getElementsByName(checkboxName);
	if(checkboxes){
		for(var i = 0; i < checkboxes.length; i++) {
			if(checkboxes[i].disabled == true){
				continue;
			}
			checkboxes[i].checked = false;
		}
	}
};

function unselectAll(){
	var objcts = document.getElementById("allCheckbox");
	if(objcts && objcts.disabled != true){
		if(objcts.checked){
			objcts.click();
			objcts.checked = false;
		}
	}
};


/****************** 分页 ************************/
var canDoAction = true; //避免重复提交-锁

function getPageAction(obj){
	var _pageFormMethod = pageFormMethod || "get";
	var oldForm = getForm(obj);
	var action = oldForm.attributes.getNamedItem("ACTION");
	var oldAction = action ? (action.nodeValue) : "" || "";
	//var form1 = document.createElement("<form action='" + oldAction + "' target='_self' method='" + _pageFormMethod + "'>");
	var form1 = document.createElement("form");
	form1.setAttribute("action",oldAction);
	form1.setAttribute("target","_self");
	form1.setAttribute("method",_pageFormMethod);
	if(!canDoAction){
		return;
	}

	var keys = pageQueryMap.keys();
	for(var i=0; i<keys.size(); i++){
		var key = keys.get(i);
		var value = pageQueryMap.get(key);
		if(!key || key == "pageSize"){
			continue;
		}

		if(value instanceof Array){
			for(var v = 0; v < value.length; v++) {
				//var e = document.createElement("<input type='hidden' name=\"" + key + "\">");
				var e = document.createElement("input");
				e.setAttribute("type","hidden");
				e.setAttribute("name",key);
				e.value = value[v];
				form1.appendChild(e);
			}
	    }
		else{
			//var e = document.createElement("<input type='hidden' name=\"" + key + "\">");
			var e = document.createElement("input");
			e.setAttribute("type","hidden");
			e.setAttribute("name",key);
			e.value = value;
			form1.appendChild(e);
		}
	}
	
	var v = oldForm.pageSize.value || 20;
	//var e = document.createElement("<input type='hidden' name='pageSize' value='" + v + "'>");
	var e = document.createElement("input");
	e.setAttribute("type","hidden");
	e.setAttribute("name","pageSize");
	e.setAttribute("value",v);
	form1.appendChild(e);
	
	if(!new RegExp("^-?[0-9]*$").test(v) || parseInt(v, 10) < 1){
//		form1.pageSize.value = 20;
//		form1.page.value = 1;
	}
	//window.clipboardData.setData("text", form1.outerHTML)
	document.body.appendChild(form1);
	form1.submit();
	
	canDoAction = false;
};

function enterSubmit(obj, type){
	if(v3x.getEvent().keyCode == 13){
		if(type == "pageSize"){
			pagesizeChange(obj);
		}
		else if(type == "intpage"){
			pageChange(obj);
		}
	}
};

function getForm(obj){
	return document.getElementsByName("pageSize")[0].form;
};
function pageGo(obj){
	getPageAction(obj);
};
function first(obj){
	pageQueryMap.put("page", 1);
	getPageAction(obj);
};
function pageChange(obj){
	if(!new RegExp("^-?[0-9]*$").test(obj.value)){
		return;
	}
	
	var pageCount = obj.getAttribute("pageCount");
	if(obj.value > parseInt(pageCount, 10)){
		obj.value = pageCount;
	}
	
	pageQueryMap.put("page", obj.value);
	getPageAction(obj);
};
function last(obj, lastPage){
	pageQueryMap.put("page", lastPage);
	getPageAction(obj);
};
function next(obj){
	var page = parseInt(pageQueryMap.get("page"));
	pageQueryMap.put("page", page + 1);
	
	getPageAction(obj);
};
function pagesizeChange(obj){
	var v = obj.value;
	if(!new RegExp("^-?[0-9]*$").test(v) || parseInt(v, 10) < 1){
		return;
	}

	pageQueryMap.put("pageSize", v);
	pageQueryMap.put("page", 1);
	getPageAction(obj);
};
function prev(obj){
	var page = parseInt(pageQueryMap.get("page"));
	pageQueryMap.put("page", page - 1);
	getPageAction(obj);
};

/********************************** 表单验证 *****************************************/
/**
 * 常量定义
 */
var formValidate = {
	unCharactor		: "\"\\/|><:*?'&%$",
	integerDigits	:	"10",
	decimalDigits	:	"0"
};

/**
 * 表单验证
 */
V3X.prototype.checkFormAdvanceAttribute="";
function checkForm(formObj){	
	var elements = formObj.elements;
	
	var clearValueElements = [];

	if(elements != null){
		for(var i = 0; i < elements.length; i++){
			var e = elements[i];
			var clearValue = e.getAttribute("clearValue");
			
			if(clearValue == "true"){
				clearValueElements[clearValueElements.length] = e;
				continue;
			}
			V3X.checkFormAdvanceAttribute = e.getAttribute("advance");
			var validateAtt = e.getAttribute("validate");
			if(validateAtt != null && validateAtt != "" && validateAtt != "undefined"){
				var validateFuns = validateAtt.split(",");
				
				for(var f = 0; f < validateFuns.length; f++){
					var fun = validateFuns[f];
					
					if(fun){
						var result = eval(fun + "(e)");
					
						if(!result){return false;}
					}
				}
			}
		}
	}
	
	for(var j = 0; j < clearValueElements.length; j++) {
		clearDefaultValueWhenSubmit(clearValueElements[j]);
	}
	
	return true;
};

/**
 * 执行正则表达式
 */
function testRegExp(text, re) {
	return new RegExp(re).test(text);
};

/**
 * 在提交的时候，清除掉默认值
 */
function clearDefaultValueWhenSubmit(element){
	var defaultValue = getDefaultValue(element);
	
	var v = element.value;
	
	if(v == defaultValue){
		element.value = "";
	}
};

/**
 * 打印出提示消息，并聚焦
 */
function writeValidateInfo(element, message){
	alert(message);

	var onAfterAlert = element.getAttribute("onAfterAlert");
	if(onAfterAlert){
		try{
			eval(onAfterAlert);
		}
		catch(e){
		}
	}
	else{
		try{
			element.focus();
			element.select();
        }
		catch(e){
		}
	}
};

function notSpecChar(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	//修改[]之间的内容，其它部分不许修改
	if(/^[^\|\\"'<>]*$/.test(value)){
		return true;
	}else{
		writeValidateInfo(element, $.i18n("formValidate_specialCharacter", inputName));
		return false;
	}
} 

function notSpecCharWithoutApos(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	//修改[]之间的内容，其它部分不许修改
	if(/^[^\|\\\/"<>]*$/.test(value)){
		return true;
	}else{
		writeValidateInfo(element, $.i18n("formValidate_specialCharacter_withoutApos", inputName));
		return false;
	}
} 
/**
 * 验证是否为空，不允许空格
 */
function notNull(element){
	var value = element.value;
	value = value.replace(/[\r\n]/g, "");
	var inputName = element.getAttribute("inputName");
	
	if(value == null || value == "" || value.trim() == ""){
		writeValidateInfo(element, $.i18n("formValidate_notNull", inputName));
		return false;
	}
	
	var maxLength = element.getAttribute("maxSize");
	
	if(maxLength && value.length > maxLength){
		writeValidateInfo(element, $.i18n("formValidate_maxLength", inputName, maxLength, value.length));
		return false;
	}
	
	return true;
};

/**
 * 检测长度
 */
function maxLength(element){
	var value = element.value;
	if(!value){
		return true;
	}
	
	var inputName = element.getAttribute("inputName");
	
	var maxLength = element.getAttribute("maxSize");
	
	if(maxLength && value.length > maxLength){
		writeValidateInfo(element, $.i18n("formValidate_maxLength", inputName, maxLength, value.length));
		return false;
	}
	
	return true;
};
/**
 *  检测最小长度
 */
function minLength(element){
	var value = element.value;
	if(!value){
		return true;
	}
	
	var inputName = element.getAttribute("inputName");
	
	var minLength = element.getAttribute("minLength");
	
	if(minLength && value.length < minLength){
		writeValidateInfo(element, $.i18n("formValidate_minLength", inputName, minLength, value.length));
		return false;
	}
	
	return true;
};

/**
 * 是否为数字
 */
function isNumber(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var integerDigits = element.getAttribute("integerDigits") || formValidate.integerDigits;
	var decimalDigits = element.getAttribute("decimalDigits") || formValidate.decimalDigits;
	var integerMax = element.getAttribute("integerMax");
	var integerMin = element.getAttribute("integerMin");
	
	if(value == "0"){
		return true;
	}
		
	if(!testRegExp(value, "^-?[0-9]{0,"+integerDigits+"}\\.?[0-9]{0,"+decimalDigits+"}$")){
		writeValidateInfo(element, $.i18n("formValidate_isNumber", inputName));
		return false;
	}

	if(integerMax && parseInt(value) > integerMax) {
		writeValidateInfo(element, $.i18n("formValidate_too_max", inputName, integerMax, value));
		return false;
	}
	
	if(integerMin && parseInt(value) < integerMin) {
		writeValidateInfo(element, $.i18n("formValidate_too_min", inputName, integerMin, value));
		return false;
	}
	
	return true;
};
/**
 * 校验输入的数字是否为正数，必须大于0
 */
function positive(element) {
	var str = element.value.trim();
	if(str != '') {
		var value = parseFloat(element.value.trim());
		var inputName = element.getAttribute("inputName");
		if(value <= 0) {
			writeValidateInfo(element, $.i18n("formValidate_positive", inputName));
			return false;
		}
	}
	return true;
}
/**
 * 校验输入的百分比，必须在0~100之间
 */
function percent(element) {
	var str = element.value.trim();
	if(str != '') {
		var value = parseFloat(element.value.trim());
		var inputName = element.getAttribute("inputName");
		if(value < 0 || value > 100) {
			writeValidateInfo(element, $.i18n("formValidate_percent", inputName, str));
			return false;
		}
	}
	return true;
}
/**
 * 
 */
function notNum(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var integerDigits = element.getAttribute("integerDigits") || formValidate.integerDigits;
	var decimalDigits = element.getAttribute("decimalDigits") || formValidate.decimalDigits;
	
	if(value == "0"){
		return true;
	}
	if(testRegExp(value, "^-?[0-9]{0,"+integerDigits+"}\\.?[0-9]{0,"+decimalDigits+"}$")){
		writeValidateInfo(element, $.i18n("formValidate_isNotNumber", inputName));
		return false;
	}
	
	return true;
	
	
}
/**
 * 检测是否是邮箱
 */
function isEmail(element){
	var value = element.value;
	if(!value){
		return true;
	}
	
	var inputName = element.getAttribute("inputName");
	
	if(value.indexOf("@") == -1 || value.indexOf(".") == -1){
		writeValidateInfo(element, $.i18n("formValidate_isEmail", inputName));
		return false;
	}
	
	return true;
};

/**
 * 验证是否为空，允许空格
 */
function notNullWithoutTrim(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	if(value == null || value == ""){
		writeValidateInfo(element, $.i18n("formValidate_notNull", inputName));
		return false;
	}
	
	var maxLength = element.getAttribute("maxLength");
	if(maxLength && value.length > maxLength){
		writeValidateInfo(element, $.i18n("formValidate_maxLength", inputName, maxLength));
		return false;
	}
	
	return true;
};

/**
 * 验证是否为整数，并验证max和min
 */
function isInteger(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var max = element.getAttribute("max");
	var min = element.getAttribute("min");
		
	if(value != "0" && (isNaN(value) || value.indexOf("0") == 0 || !testRegExp(value, "^-?[0-9]*$"))){
		writeValidateInfo(element, $.i18n("formValidate_isInteger", inputName));
		return false;
	}
	
	if(max != null && max != "" && parseInt(value) > parseInt(max)){
		writeValidateInfo(element, $.i18n("formValidate_isInteger_max", inputName, max));
		return false;
	}
	
	if(min != null && min != "" && parseInt(value) < parseInt(min)){
		writeValidateInfo(element, $.i18n("formValidate_isInteger_min", inputName, min));
		return false;
	}

	return true;
};

/**
 * 是否为正常的字符串，不允许特殊字符，如：/ character
 */
function isWord(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var character = element.getAttribute("character") || formValidate.unCharactor;

	var _c = "";
	for(var i = 0; i < character.length; i++){
		if(value.indexOf(character.charAt(i)) > -1){
			_c += character.charAt(i);
		}
	}
	
	if(_c.length > 0) {
		writeValidateInfo(element, $.i18n("formValidate_isWord", inputName, _c, character));
		return false;
	}
	
	return true;
};

/**
 * 是否是数字、字母、下划线
 */
function isCriterionWord(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	if(!testRegExp(value, '^[\\w-]+$')){
		writeValidateInfo(element, $.i18n("formValidate_isCriterionWord", inputName));
		return false;
	}
	
	return true;
};
/**
 * 判断是否符合url格式
 */
function isUrl(element)
{
	var value = element.value;
	if(!value){
		return true;
	}
	var inputName = element.getAttribute("inputName");
	//之前：^http://{1}([\w-]+\.)+[\w-]+     匹配http://www.********
	//     ^http://{1}([\\w-]+\.)+[\\w-]+   匹配http://***********
	if(!testRegExp(value, "^http://{1}([\\w-]+\.)+[\\w-]+")){
		writeValidateInfo(element, $.i18n("formValidate_isUrl", inputName));
		return false;
	}
	return true;
}
/**
 * 以指定文本开头
 */
function startsWith(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var prefix = element.getAttribute("prefix");
	
    if(value.indexOf(prefix) != 0){ // prefix是扩展的属性
    	writeValidateInfo(element, $.i18n("formValidate_startsWith", inputName, prefix));
        return false;
    }
        
    return true;
};

/**
 * 历史原因,拼写错误,废弃,但能正常运行,请用isDefaultValue
 */
function isDeaultValue(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var deaultValue = getDefaultValue(element);
	
	if(value == deaultValue){
    	writeValidateInfo(element, $.i18n("formValidate_notNull", inputName));
        return false;
	}
	
	return true;
};

function isDefaultValue(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	
	var defaultValue = getDefaultValue(element);
	
	if(value == defaultValue){
    	writeValidateInfo(element, $.i18n("formValidate_notNull", inputName));
        return false;
	}
	
	return true;
};

/*********************************  日期选择器 *********************************************/
var __addDataEventObject = null;

/**
 * e.g whenstart('${pageContext.request.contextPath}', this, 575, 140);
 * 
 * @param contextPath 跟路径 ${pageContext.request.contextPath}
 * @param whoClick 要赋值的Object，如果为null，则返回日期数据
 * @param myLeft 距屏幕左面距离(废弃，去鼠标点击的位置) 
 * @param myTop 距屏幕上面距离(废弃，去鼠标点击的位置) 
 * @param type 选择类型 date datetime 默认 date
 * @param allowEmpty 是否允许空
 * @param
 */
function whenstart(contextPath, whoClick, myLeft, myTop, type, allowEmpty, width, height){
	type = type || "date";
	if(allowEmpty == null){
		allowEmpty = true;
	}
	__addDataEventObject = whoClick;
	var evt = v3x.getEvent();
	if (v3x.getBrowserFlag('openWindow') == false) {
		var clickTarget = evt.currentTarget;
		var date_win = new MxtWindow({
	        id: 'date_win',
	        title: v3x.getMessage("V3XLang.calendar_page_title"),
	        url: contextPath + "/common/js/addDate/date.jsp?type=" + type + "&allowEmpty=" + allowEmpty + "&showButton=false",
	        height: height+5 || 320,
	        width: width+5 || 320,
	        relativeElement:whoClick,
	        targetWindow:getA8Top(),
			type:'window',//类型window和panel为panel的时候title不显示
			isDrag:false,//是否允许拖动
	        buttons: [{
				id:'btn1',
	            text: '确定',
	            handler: function(){
	        		var rv = date_win.getReturnValue();
	        		if(rv){
	        			clickTarget.value = rv;
	        		}
	    			date_win.close();
	        	}
	        }, {
				id:'btn2',
	            text: '清空',
	            handler: function(){
	            	clickTarget.value = "";
	        		date_win.close();
	            }
	        }]
		});
	} else {
		var rv = v3x.openWindow({
	        url: contextPath + "/common/js/addDate/date.jsp?type=" + type + "&allowEmpty=" + allowEmpty + "&showButton=true",
	        height: 230,
	        width: 250,
	        'top': evt.screenY + 20,
	        left: evt.screenX - 50
		});
		if (rv==null)
			rv="";
		if(!whoClick && rv){
			return rv;
		}
		return rv;
	}
}

//功能:判断是否为合法的日期字符串
//参数:必须是年月日格式，年要求四位，月日可以是长类型或者短类型，必须以'-'或者'/'作为分隔符
//     isSave为true时合法日期保存到当前日期对象
Date.prototype.isDate=function(szDate,isSave)
{
    var re,regu;
    var splitChar,Year,Month,Day;
    var szArry;
    var strObj=new String(szDate);
	if(strObj.length<8 || strObj.length>10) return false;//判断日期的长度，完整的年，长短日期格式
	regu="^([0-9]){4}(-|/)([0-9]){1,2}(-|/)([0-9]){1,2}$";//日期模板校验(以‘－’或者‘/’分割的日期)
	re=new RegExp(regu);
	if(strObj.search(re)==-1) return false;
	splitChar=strObj.charAt(4);//年必须输入四位数字
	szArry=strObj.split(splitChar);
	if(szArry.length!=3) return false;
	Year=parseInt(szArry[0],10);
	Month=parseInt(szArry[1],10);
	Day=parseInt(szArry[2],10);
	if(Year<1900 || Year>2500) return false;
	if(Month<1 || Month>12) return false;//月必须在１－－１２之间
	if(Day<1 || Day>31) return false;//日必须在１－３１之间
	switch(Month)
	{
		case 4:
		case 6:
		case 9:
		case 11:
			if(Day>30) return false;
			break;
		case 2:
			if((Year%4==0 && Year%100!=0) || Year%400==0)//润年2月份29天
			{
				if(Day>29) return false;
			}
			else
			{
				if(Day>28) return false;
			}
			break;
		default: break;
	}
	if(isSave)
	{
	  /**
	   * 设值顺序改为：先设定日、再设定月、再设定年，避免出现如下Bug：
	   * 日期变量2010-01-30调用此方法，参数为('2010-02-01', true)后日期变量会变为2010-03-01(应该为2010-02-01)
	   * 因为先设定月，再设定日，此时该值为2010-02-30，超出2月天数，此时系统自动将其月份改为3月
	   */
	  this.setDate(Day);
	  this.setMonth(Month-1);
	  this.setYear(Year);
	}
	return true;
}

/**
 * 将日期字符串转换成日期对象
 */
function parseDate(dateStr){
	var ds = dateStr.split("-");
	var y = parseInt(ds[0], 10);
	var m = parseInt(ds[1], 10) - 1;
	var d = parseInt(ds[2], 10);
	
	return new Date(y, m, d);
}
//功能:得到输入日期前几天或者后几天的日期

Date.prototype.dateAdd=function(curDateStr,iPassNum)
{
  var dateObj;
  var sNewDate=curDateStr;
  var y,m,d;
  var sDate;
  var bUpChange=false;
  var splitChar;
  var szArry;
  var strObj;
  if(this.isDate(curDateStr,true)==false)
  {
    //alert("当前日期错误!");
    return curDateStr;
  }
  strObj=new String(curDateStr);
  splitChar=strObj.charAt(4);//年必须输入四位数字
  szArry=strObj.split(splitChar);
  y=parseInt(szArry[0],10);
  m=parseInt(szArry[1],10);
  d=parseInt(szArry[2],10);

  while(iPassNum!=0)
  {
    //设置日期
    if(iPassNum>0) d++;
    else d--;
    if(d<=0 || d>31)
    {
       bUpChange=true;
       if(d<=0) d=31;
       else d=1;
    }
    else
    {
      bUpChange=false;
    }
    //设置月
    if(bUpChange)
    {
      if(iPassNum>0) m++;
      else m--;
      if(m<=0 || m>12)
      {
        bUpChange=true;
        if(m<=0) m=12;
        else m=1;
      }
      else
      {
        bUpChange=false;
      }
    }
    //设置年
    if(bUpChange)
    {
      if(iPassNum>0) y++;
      else y--;
    }
    sNewDate=y+"-"+m+"-"+d;
    if(this.isDate(sNewDate,false))
    {
      if(iPassNum>0) iPassNum--;
      else iPassNum++;
    }
  }
  return sNewDate;
}
//功能:得到输入日期所在的星期的开始日期(星期一)和结束日期(星期五)
Date.prototype.getWeekStart=function(dateStr)
{
  this.isDate(dateStr,true);
  var iWeek=this.getDay();

  //一周的第一天这里定为周日
  var iPassNum=iWeek;
  if(iPassNum!=0) iPassNum=-iPassNum;
  return formatDate(this.dateAdd(dateStr,iPassNum));
}

Date.prototype.getWeekEnd=function(dateStr)
{
  this.isDate(dateStr,true);
  var iWeek=this.getDay();
  //alert(dateStr+"|||"+this.getYear()+"-"+m+"-"+this.getDate());
  //alert("iWeek:"+iWeek);
  //if(iWeek==0) iWeek=7;
  var iPassNum=6-iWeek;
  return formatDate(this.dateAdd(dateStr,iPassNum));
}

//功能:得到输入日期所在的月份的开始日期和结束日期
Date.prototype.getMonthStart=function(dateStr)
{
  this.isDate(dateStr,true);
	dateStr=this.getFullYear()+"-"+(this.getMonth()+1)+"-1";
  return formatDate(dateStr);
}
Date.prototype.getMonthEnd=function(dateStr)
{
  this.isDate(dateStr,true);
	var months=[31,28,31,30,31,30,31,31,30,31,30,31];
  //this.isDate(dateStr,true);
	var iYear=this.getFullYear();
  var iMonth=this.getMonth()+1;

  var iDay=months[this.getMonth()];

	if(iYear%4==0 && iMonth==2){
		iDay++;
	}
	dateStr=iYear+"-"+iMonth+"-"+iDay;
  return formatDate(dateStr);
}
//功能:得到输入日期所在的季度的开始日期和结束日期
Date.prototype.getSeasonStart=function(dateStr)
{
	var a=[1,1,1,4,4,4,7,7,7,10,10,10];
  this.isDate(dateStr,true);
	dateStr=this.getFullYear()+"-"+a[this.getMonth()]+"-1";
  return formatDate(dateStr);
}
Date.prototype.getSeasonEnd=function(dateStr)
{
  this.isDate(dateStr,true);
	var a=[3,3,3,6,6,6,9,9,9,12,12,12];
	var m=[31,31,31,30,30,30,30,30,30,31,31,31];
  this.isDate(dateStr,true);
	dateStr=this.getFullYear()+"-"+a[this.getMonth()]+"-"+m[this.getMonth()];
  return formatDate(dateStr);
}
//得到这个月的第几周
Date.prototype.getWeekOfMonth = function(){
	var w = this.getDay();
    var d = this.getDate(); 
	return Math.ceil((d + 6 - w)/7 );
}
function formatDate(dateStr){
	var d = dateStr.split("-");
	var month = parseInt(d[1], 10);
	var date = parseInt(d[2], 10);
	
	return d[0] + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
}

/**
 * 日期格式化
 */
Date.prototype.format = function(pattern) {
	var hour = this.getHours();
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(),    //day
		"H+" : hour,   //hour
		"h+" : (hour > 12 ? hour - 12 : hour),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	
	if(/(y+)/.test(pattern)){
		pattern = pattern.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	
	for(var k in o)if(new RegExp("("+ k +")").test(pattern)){
		pattern = pattern.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	}
  
	return pattern;
}

/**
 * 比较两个字符串日期的前后，不比较时间
 * 
 * @param dateStr1 日期1 字符串
 * @param dateStr2 日期2 字符串
 * @return 负整数、零或正整数，根据此对象是小于、等于还是大于
 */
function compareDate(dateStr1, dateStr2){
	return Date.parse(dateStr1.replace(/\-/g, '/')) - Date.parse(dateStr2.replace(/\-/g, '/'));
}

/*************************************以下为日期格式转换函数*******************************/

/*
功能:YYYY-MM-DD 数字日期转化为汉字
例:2008-3-7 -> 二零零八年三月七日
调用:date2chinese1("2008-3-7") 

date2chinese0("2008-5-8"); －－》 二〇〇八年三月七日

date2chinese("2008-05-8"); －－》 2008年5月8日


*/
var chinese=["零","一","二","三","四","五","六","七","八","九"];
var len = ["十"];
var ydm =["年","月","日"];
function num2chinese(s)
{

//将单个数字转成中文.
s=""+s;
slen = s.length;
var result="";
for(var i=0;i<slen;i++)
{
result+=chinese[s.charAt(i)];
}
return result;
}


function n2c(s)
{ 
//对特殊情况进行处理.
s=""+s;
var result="";
if(s.length==2)
{
if(s.charAt(0)=="1")
{
if(s.charAt(1)=="0")return len[0];
return len[0]+chinese[s.charAt(1)];
}
if(s.charAt(1)=="0")return chinese[s.charAt(0)]+len[0];
return chinese[s.charAt(0)]+len[0]+chinese[s.charAt(1)];
}
return num2chinese(s)
}

function date2chinese0(s)
{
  var ns=date2chinese(s);
  ns=ns.replace(/零/g, "〇");
  return ns;
}

function date2chinese1(s)
{
  var str;
  var ns=s.split("-");  
  if(ns.length!=3){ns=s.split("/");}
  if(ns.length!=3){return s;}
  if(ns[1].charAt(0)=="0"){ns[1]=ns[1].substr(1);}
  if(ns[2].charAt(0)=="0"){ns[2]=ns[2].substr(1);}
  str=ns[0]+"年"+ns[1]+"月"+ns[2]+"日";
  return str;
}

function date2chinese(s)
{
//验证输入的日期格式.并提取相关数字.
var datePat = /^(\d{2}|\d{4})(\/|-)(\d{1,2})(\2)(\d{1,2})$/; 
var matchArray = s.match(datePat); 
var ok="";
if (matchArray == null) return false;
for(var i=1;i<matchArray.length;i=i+2)
{
ok+=n2c(matchArray[i]-0)+ydm[(i-1)/2];
}
return ok;
}
 


/****************************************/
/************** 正文类型切换 **************/
/****************************************/
/**
 * 选择类型事件
 */
function chanageBodyType(bodyType, isRevertContent) {
	
	
    var bodyTypeObj = document.getElementById("bodyType");
    if (bodyTypeObj && bodyTypeObj.value == bodyType) {
        return true;
    }
        //【公文】清空office的id.先保存Office,然后切换到HTML，content这个Div中会保存OFFICE 正文的ID
    var appName=document.getElementById("appName");
    if(appName && appName.value=='4' && bodyType=='HTML'){
		var contentObj=document.getElementById("content");
		if(contentObj)
		{
			contentObj.value="";
		}
    }
    
    if (confirm(v3x.getMessage("V3XLang.common_confirmChangBodyType"))) {
    	var changePdf = document.getElementById("changePdf");
    	if(changePdf){
	    	if(bodyType == "OfficeWord" || bodyType == "WpsWord"){
	    		changePdf.style.display = "";
	    	}else{
	    		changePdf.style.display = "none";
	    	}
    	}
        showEditor(bodyType, true);
        return true;
    }

    return false;
}

function getA8Top(){
    try {
      var A8TopWindow =  getA8ParentWindow(window);
      if(A8TopWindow){
        return A8TopWindow;
      }else{
        return top;
      }
    }
    catch (e) {
      return top;
    }
  }
  function getA8ParentWindow(win){
	  var currentWin = win;
		for(var i = 0; i < 20; i++){
			if(typeof currentWin.isCtpTop != 'undefined' && currentWin.isCtpTop){
				return currentWin;
			}
			else{
				currentWin = currentWin.parent;
			}
		}
  }

/**
 * 显示编辑器
 */
function showEditor(flag, isRevertContent) {
	//是否还原正文，默认为true
	isRevertContent = (isRevertContent == null) ? true : false;
		
    if (flag == 'HTML') {
        removeOfficeDiv(isRevertContent);

        oFCKeditor.ReplaceTextarea();
    }
    else if (flag == 'OfficeWord') {
        oFCKeditor.remove();

        showOfficeDiv("doc");
    }
    else if (flag == 'OfficeExcel') {
        oFCKeditor.remove();

        showOfficeDiv("xls");
    }
    else if (flag == 'WpsWord') {
        oFCKeditor.remove();

        showOfficeDiv("wps");
    }
    else if (flag == 'WpsExcel') {
        oFCKeditor.remove();

        showOfficeDiv("et");
    }
    else if(flag == 'Pdf'){
        oFCKeditor.remove();
        showPdfDiv("pdf");
    }
    var bodyTypeObj = document.getElementById("bodyType");
    if (bodyTypeObj) {
    	setContentTypeState(bodyTypeObj.value,flag);
        bodyTypeObj.value = flag;
    }
    //公告新闻预览屏蔽（如果是WORD或者EXCEL）
    try{
	    var bulBottPre = document.getElementById("bulBottPre").value;
	    if (bulBottPre && bulBottPre=='1' ) {
	    	if(flag == 'HTML'){
	    		myBar.enabled('preview');
	    	}else{
	    		myBar.disabled('preview');
	    	}
	    }
    }catch (e) {
	}
}
function initContentTypeState(){
	try{
		bodyType=document.getElementById("bodyType").value;
		bodyTypeSelector.disabled("menu_bodytype_"+bodyType);					
	}
	catch(e){		
	}	
}

function setContentTypeState(bodyTypeFrom,bodyTypeTo){
	try{
		if(bodyTypeFrom==bodyTypeTo)		{
			bodyTypeSelector.disabled("menu_bodytype_"+bodyTypeTo);			
		}
		else		{
			bodyTypeSelector.disabled("menu_bodytype_"+bodyTypeTo);	
			bodyTypeSelector.enabled("menu_bodytype_"+bodyTypeFrom);		
		}		
	}
	catch(e){		
	}
}

/****************************************/
/************ 列表页面的精确查找 ***********/
/****************************************/
function showNextCondition(conditionObject) {
	if(!conditionObject)
		return;
    var options = conditionObject.options;
	
    for (var i = 0; i < options.length; i++) {
        var d = document.getElementById(options[i].value + "Div");
        if (d) {
            d.style.display = "none";
        }
    }
if(!document.getElementById(conditionObject.value + "Div")) return;
    document.getElementById(conditionObject.value + "Div").style.display = "block";
}

/**
 * 当使用到搜索时，显示前端
 */
function showCondition(conditionValue, textfieldValue, textfield1Value) {
	
    if (!conditionValue) {
        return;
    }
    var conditionObj = document.getElementById("condition")

    selectUtil(conditionObj, conditionValue); //选择条件
    showNextCondition(conditionObj); //显示条件值区�?

    var theDiv = document.getElementById(conditionValue + "Div");

    if (theDiv) {
        var nodes = theDiv.childNodes;

        if (nodes) {
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes.item(j);
                if (node.tagName == "INPUT") {
                    eval("node.value = " + node.name + "Value;")
                }
                else if (node.tagName == "SELECT") {
                    eval("selectUtil(node, " + node.name + "Value)")
                }
            }
        }
    }
}


/**
 * 根据后端的值，将下拉按钮对应的项置于选中状�?
 */
function selectUtil(selectObj, selectedValue) {
    if (!selectObj) {
        return false;
    }

    var ops = selectObj.options;

    for (var i = ops.length - 1; i >= 0; i--) {
        if (ops[i].value == selectedValue) {
            selectObj.selectedIndex = i;
            return true;
        }
    }

    return false;
}

/**
 * 调用该方法之前,请先把当前页面的开始时间和结束时间的选择框命名为startdate和enddate
 * @return {Boolean}
 */
function dateCheck()
{
	var startdate=document.getElementById('startdate').value;
	var enddate=document.getElementById('enddate').value;
	if(compareDate(startdate,enddate)>0)
	{
		window.alert($.i18n("calendar_endTime_startTime"));
		return false;	
	}
	doSearch();
}
var SearchEnter = {
	submitCount : 0
}
/**
 * 搜索按钮事件
 */
function doSearch() {
    var theForm = document.getElementsByName("searchForm")[0];
    var searchDate = document.getElementById('createDateDiv');
    
    if (theForm) {
    	//FIXME 防止在选择条件时候按住回车，狂发请求。
	    if(SearchEnter.submitCount > 2){
	    	return;
	    }
	    var options = theForm.condition.options;
		
	    for (var i = 0; i < options.length; i++) {
	        if (theForm.condition.value == options[i].value){
				var passCheck = true;
				if('createDate'==theForm.condition.value){
					var searchDateDiv = document.getElementById(options[i].value + "Div");
					//加入对搜索时，时间的check
				    var seachDateChildNods ;
				    if(searchDateDiv!=null){
				    	seachDateChildNods = searchDateDiv.childNodes;
				    }
				    var timeChildNodes = new Array();
					if(seachDateChildNods!=null){
						seachDateChildNods = searchDate.childNodes;
						for(var j=0;j<seachDateChildNods.length;j++){
							var tempChildNode = seachDateChildNods[j];
							if(tempChildNode.type=="text"){
								timeChildNodes.push(tempChildNode);
							}
						}
					}
					if((timeChildNodes.length>0)&&(timeChildNodes.length<3)){
						var beginTimeStr = timeChildNodes[0].value;
						var beginTimeStrs = beginTimeStr.split("-");
						var beginTimeDate = new Date();
						beginTimeDate.setFullYear(beginTimeStrs[0],beginTimeStrs[1]-1,beginTimeStrs[2]);
						var endTimeStr = timeChildNodes[1].value;
						var endTimeStrs = endTimeStr.split("-");
						var endTimeDate = new Date();
						endTimeDate.setFullYear(endTimeStrs[0],endTimeStrs[1]-1,endTimeStrs[2]);
						if(endTimeDate<beginTimeDate){
							passCheck = false;
						}
					}
				}
				if(passCheck){
					continue;
				}else{
					//window.alert($.i18n("calendar_endTime_startTime"));
					return;
				}
			} 
	
	        var d = document.getElementById(options[i].value + "Div");
	        if (d) {
	            d.innerHTML = "";
	        }
	    }
	    theForm.target = theForm.target || "_self";
	    SearchEnter.submitCount ++;
        theForm.submit();
    }
}

function doSearchEnter(){
	var evt = v3x.getEvent();
    if(evt.keyCode == 13){
    	doSearch();
    }
}

/**
 * 弹出窗口的关闭时间
 * <body onkeypress="listenerKeyESC()">
 */
function listenerKeyESC(){
	var evt = v3x.getEvent();
	if(evt.keyCode == 27){
		window.close();
	}
}

/**
 * 检测checkbox是否被选择
 * @return 0 - 表示选择  否则返回选择的个数
 */
function validateCheckbox(checkboxName){
	checkboxName = checkboxName || "id";
	var id_checkbox = document.getElementsByName(checkboxName);
    if (!id_checkbox) {
        return 0;
    }

    var selectedCount = 0;
    var len = id_checkbox.length;
    for (var i = 0; i < len; i++) {
        if (id_checkbox[i].checked) {
            selectedCount++;
        }
    }
    
    return selectedCount;
}

/**
 * 取checkbox的第一个选择值
 */
function getCheckboxSingleValue(checkboxName){
	var o = getCheckboxSingleObject(checkboxName);
    
    return o == null ? null : o.value;
}

/**
 * 取checkbox的第一个选择对象
 */
function getCheckboxSingleObject(checkboxName){
	checkboxName = checkboxName || "id";
	var id_checkbox = document.getElementsByName(checkboxName);
    if (!id_checkbox) {
        return 0;
    }

    var selectedCount = 0;
    var len = id_checkbox.length;
    for (var i = 0; i < len; i++) {
        if (id_checkbox[i].checked) {
            return id_checkbox[i];
        }
    }
    
    return null;
}

/*****************************************
 * 振荡回复
 */
var currentOpinionId = "";

function hiddenReplyDiv(){
	var obj_ = document.getElementById("replyDiv" + currentOpinionId);
	if(obj_){
		obj_.innerHTML = "";
		obj_.style.display = "none";
	}
	fileUploadAttachments.clear();
}
function reply(opinionId, writeMemberId, isUploadAtt, isUploadDoc,isHidden,writeMemberName,affairId,writeMemberId1){
//添加附言或回复意见时输入内容后再次点回复,此时不做任何操作
	var obj_ = document.getElementById("replyDiv" + currentOpinionId);
	if(obj_ && obj_.innerHTML != ""){
		return;
	}
	hiddenReplyDiv();
	opinionId5 = opinionId;
	var uploadAttachmentSpan = document.getElementById("uploadAttachmentSpan");
	if(uploadAttachmentSpan!=null){
		uploadAttachmentSpan.style.display = (isUploadAtt == true ? "" : "none");
	}
	//会议里没关联文档
	var myDocumentSpanObj = document.getElementById("myDocumentSpan");
	if(myDocumentSpanObj){
		myDocumentSpanObj.style.display = (isUploadDoc == true ? "" : "none");
	}
	var obj = document.getElementById("replyDiv" + opinionId);
	if(obj){
		obj.innerHTML = document.getElementById("replyCommentHTML").innerHTML;
		obj.style.display = "";
		var replyObj = document.getElementById("reply-table");
		if(replyObj!=null){
		 	replyObj.style.display='';//打印的时候将这里设置为不可见了。
		}
		var theForm = document.getElementsByName("repform")[0];
		theForm.isHidden.id = "isHidden";
		try{
			theForm.isSendMessage.id = "isSendMessage";
		}
		catch(e){
		}
		if(isHidden){
			 document.getElementById("isHiddenDiv").style.display = "none";
		}
		//焦点下移显示出回复按钮
		if(theForm.b11) {
			theForm.b11.focus();
		}
		theForm.content.focus();
		theForm.opinionId.value = opinionId;
		if(writeMemberId){
			theForm.memberId.value = writeMemberId;
		}
		// 自己回复自己时过滤自己名字         affairMemberId.value 事项所属人id 	writeMemberId被回复人id
		var affairMemberId = document.getElementById("affairMemberId");
		var sendMessagePeopleSpan = document.getElementById("sendMessagePeopleSpan");
//		if (affairMemberId && affairMemberId.value != writeMemberId) {
		if (affairMemberId) {
			if(writeMemberName){
				var sendMessagePeopleInput  = document.getElementById("pushMessageMemberNames");
				if(sendMessagePeopleInput && currentUserId != writeMemberId){
					sendMessagePeopleInput.value = writeMemberName;
				} 
				if (sendMessagePeopleInput && currentUserId == writeMemberId) {
					theForm.isSendMessage.checked=false;
					sendMessagePeopleSpan.style.display="none";
				}
			}
			if(affairId){
				//设置消息推送的默认值
				var pushMessageMemberIds = document.getElementById("pushMessageMemberIds");
				if(pushMessageMemberIds){
					pushMessageMemberIds.value = affairId+","+writeMemberId;
				}
				//被回复意见的AFFAIRID
				var replyedAffairId = document.getElementById("replyedAffairId");
				if(replyedAffairId){
					replyedAffairId.value = affairId;
				}
			}
		} else {
			if(theForm.isSendMessage)
			    theForm.isSendMessage.checked=false;
			if(sendMessagePeopleSpan)
				sendMessagePeopleSpan.style.display="none";
		}
	}
	currentOpinionId = opinionId;
}

function checkReplyForm(f){
//	f.opinionId.value = currentOpinionId;
	if(checkForm(f)){
		return true;
	}
	
	return false;
}

/**
 * 对标题默认值的切换
 * @param isShowBlack 去掉为默认值，显示空白，用在onFocus
 */
function checkDefSubject(obj, isShowBlack) {
	var dv = getDefaultValue(obj);
    if (isShowBlack && obj.value == dv) {
            obj.value = "";
    }
    else if (!obj.value) {
            obj.value = dv;
    }
}

/**
 * 从input中读取属性为defaultValue的值
 */
function getDefaultValue(obj){
	if(!obj){
		return null;
	}
    var def = obj.attributes.getNamedItem("defaultValue");
    if(!def){
    	def = obj.attributes.getNamedItem("deaultValue"); //兼容以前错误的写法
    }
    
    if(def){
    	return def.nodeValue;
    }
    
    return null;
}

/***********************************************
 * 处理界面的按钮切换
 */
function Panel(id, label, onclick) {
    this.id = id;
    this.label = label;
    this.onclick = onclick || "";
}

Panel.prototype.toString = function() {
    //return "<div id='button" + this.id + "' onClick=\"changeLocation('" + this.id + "');" + this.onclick + "\" class=\"sign-button\">" + this.label + "</div>" +
    //       "<div class=\"sign-button-line\"></div>";
    return "<div id='button-L" + this.id + "' class=\"sign-button-L\"></div><div id='button" + this.id + "' onClick=\"changeLocation('" + this.id + "');" + this.onclick + "\" class=\"sign-button-M\">" + this.label + "</div>" +
    		"<div id='button-R" + this.id + "' class=\"sign-button-R\"></div><div class=\"sign-button-line\"></div>";
}

Panel.prototype.toMinString = function(){
	return "<div class=\"sign-min-label\" onclick=\"changeLocation('" + this.id + "');"+this.onclick+"\" title=\"" + this.label + "\">" + this.label + "</div><div class=\"separatorDIV\"></div>"
};

function showPanels(isShowHiddenButton) {
	if(isShowHiddenButton != false){
		document.write('<div id="hiddenPrecessAreaDiv" onclick="hiddenPrecessArea()" title="' + v3x.getMessage("V3XLang.common_hiddenPrecessArea") + '"></div>');
	}
	
    for (var i = 0; i < panels.size(); i++) {
        document.write(panels.get(i).toString());
    }
    document.close();
}

function showMinPanels(){
    for (var i = 0; i < panels.size(); i++) {
        document.write(panels.get(i).toMinString());
    }
    document.close();
	setNoOrResize(true);
}
function setNoOrResize(state){
	try{
    var oNoResize = parent.document.getElementById('detailRightFrame');
    if(oNoResize){
    	oNoResize.noResize = state;
    }else{
    	return;
    }
	}catch(e){}
}
function changeLocation(id) {
	
    for (var i = 0; i < panels.size(); i++) {
        var id_ = panels.get(i).id;
        if (id_ == id) continue;
        document.getElementById('button-L' + id_).className = "sign-button-L";
        document.getElementById('button' + id_).className = "sign-button-M";
        document.getElementById('button-R' + id_).className = "sign-button-R";
        var o = document.getElementById(id_ + "TR");
        if (o) {
            o.style.display = "none";
        }
    }

    var bObj = document.getElementById("button" + id);
    if(bObj){
    	document.getElementById('button-L' + id).className = "sign-button-L-sel";
    	bObj.className = "sign-button-M-sel";
    	document.getElementById('button-R' + id).className = "sign-button-R-sel";
    }
    
    var trObj = document.getElementById(id + "TR");
    if(trObj){
    	trObj.style.display = "";
    }
    setNoOrResize(false);
}

function showPrecessArea(width) {
	try{
		parent.detailMainFrame.contentIframe.SeeyonForm_HideArrow();
	}catch(e){}
	width = width || "32%";
	try{
	    parent.document.getElementById("zy").cols = "*," + width;
	}	
	catch(e){		
	}
	var obj = document.getElementById('signAreaTable');
	if(obj){
	    obj.style.display = "";
	}
    var _signMinDiv = document.getElementById('signMinDiv');
    if(_signMinDiv){
    	_signMinDiv.style.display = "none";
    	_signMinDiv.style.height = "0px";
    }
}

function hiddenPrecessArea() {
	try{
		parent.detailMainFrame.contentIframe.SeeyonForm_HideArrow();
	}catch(e){}	
	
	try{
    	parent.document.getElementById("zy").cols = "*,45";
	}
	catch(e){
	}
    var obj = document.getElementById('signAreaTable');
    if(obj){
    	obj.style.display = "none";
    }
    
    var _signMinDiv = document.getElementById('signMinDiv');
    if(_signMinDiv){
    	_signMinDiv.style.display = "";
    	_signMinDiv.style.height = "100%";
    }
    setNoOrResize(true);
}
/**
 * 刷新当前页面
 */
function refreshIt() {
    location.reload(true);
}

/**
 * 刷新当前工作区
 */
function refreshWorkSpace() {
	var _nowSelectId = getA8Top().reFlesh();
}

/**
 * 页面回退
 */
function locationBack() {
    history.back();
}
/**
 * 将字符串转换成HTML代码
 */
function escapeStringToHTML(str, isEscapeSpace, isEscapeBr){
    if(!str){
            return "";
    }
    
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/\r/g, ""); 
    if(typeof(isEscapeBr) == 'undefined' || (isEscapeBr == true || isEscapeBr == "true")){
      str = str.replace(/\n/g, "<br/>");
}
    str = str.replace(/\'/g, "&#039;");
    str = str.replace(/"/g, "&#034;");
    
    if(typeof(isEscapeSpace) != 'undefined' && (isEscapeSpace == true || isEscapeSpace == "true")){
            str = str.replace(/ /g, "&nbsp;");
    }
    
    return str;
}

function escapeStringToJavascript(str){
	if(!str){
		return str;
	}
	
	str = str.replace(/\\/g, "\\\\");
	str = str.replace(/\r/g, "");
	str = str.replace(/\n/g, "");
	str = str.replace(/\'/g, "\\\'");
	str = str.replace(/"/g, "\\\"");
	
	return str;
}

/**
 * 获取QueryString参数
 */
function getParameter(name1){
	var queryString = document.location.search;
	
	if(queryString){
		queryString = queryString.substring(1);
		
		var params = queryString.split("&");
		
		for(var i = 0; i < params.length; i++) {
			var items = params[i].split("=");
			
			if(name1 == items[0]){
				return items[1];
			}
		}
	}
}

/**
 * 给选择列表设置选择项
 * @param selectId 选择列表的Id
 * @param value 选择的值
 */
function setSelectValue(selectId, value){
	var object = document.getElementById(selectId);
	if(!object){
		return;
	}
	
	var os = object.options;
	if(!os){
		return;
	}
	
	for(var i = 0; i < os.length; i++){
		var o = os[i];
		if(o.value == value){
			o.selected = true;				
			break;
		}
	}
}

var sxUpConstants = {
	status_0 : "0,*",
	status_1 : "35%,*"
};
var sxDownConstants = {
	status_0 : "*,9",
	status_1 : "35%,*"
};
var sxMiddleConstants = {
	status_0 : "35%,*",
	status_1 : "35%,*"
};
var indexFlag = 0;
function previewFrame(direction){
	if(!direction) return;
	var obj = parent.parent.document.getElementById('sx');
	if(obj == null){
		obj = parent.document.getElementById('sx');;
	}
	
	if(obj == null){
		return;
	}
	
	if(indexFlag > 1){
		indexFlag = 0;
	}
		
	var status = eval("sx" + direction + "Constants.status_" + indexFlag);
	obj.rows = status;
	
	if(direction != "Middle"){
		indexFlag++;
	}
}

function checkImageSize(img){
	if(img.width > 540){ img.width = 540;}
}

/**
 * 得到上下框架的中间横条
 * @param isShowButton 是否显示中间的按钮
 */
function getDetailPageBreak(isShowButton,direction){
	var showButtonFlag = true; 
	if(isShowButton != true && (getA8Top().window.dialogArguments || window.opener)){
		showButtonFlag = false;
	}
	var contentP = "";
	try{
		contentP = v3x == null ? "" : v3x.baseURL + "/common/";
	}catch(e){}
	
	document.write("<table id='pagebreakspare' border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"  height=\"10\" align=\"center\">");
	document.write("<tr align=\"center\">");
	document.write("<td style='height:10px; overflow:hidden;' class=\"detail-top\">");
	if(showButtonFlag){
		//document.write("<img src=\"" + contentP + "images/button.preview.up.gif\" border='0' height=\"10\" onclick=\"previewFrame('Up')\" class=\"cursor-hand\">");
		//document.write("<img src=\"" + contentP + "images/button.preview.down.gif\" border='0' height=\"10\" onclick=\"previewFrame('Down')\" class=\"cursor-hand\">");
		
		document.write("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"  height=\"10\">");
		document.write("<tr>");
		document.write("<td>");
			document.write("<div class='break-up' onclick=\"previewFrame('Up')\"></div>");
		document.write("</td>");
		document.write("<td>");
			document.write("<div class='break-down' onclick=\"previewFrame('Down')\"></div>");
		document.write("</td>");
		document.write("</tr>");
		document.write("</table>");
		
	}else{
		document.write("&nbsp;");
	}
	document.write("</td>");
	document.write("</tr>");
	document.write("</table>");
	document.close();
	if(direction == 'Down'){
		previewFrame('Down');
	}else{
		previewFrame('Middle');
	}
	
}

function getLimitLength (text, maxlengh, symbol) {
    return text.getLimitLength(maxlengh, symbol); 
}

function changeMenuTab(clickDiv)
{
  var menuDiv=document.getElementById("menuTabDiv");
  var clickDivStyle=clickDiv.className;
  if(clickDivStyle=="tab-tag-middel-sel"){return;}
  var divs=menuDiv.getElementsByTagName("div");
  var i;
  for(i=0;i<divs.length;i++)
  {    
  	clickDivStyle=divs[i].className;  	
  	if(clickDivStyle.substr(clickDivStyle.length-4)=="-sel")
  	{  		
  		divs[i].className=clickDivStyle.substr(0,clickDivStyle.length-4);
  	}  	    
  }
  for(i=0;i<divs.length;i++)
  {
        if(clickDiv==divs[i])
  	    {
  	      divs[i-1].className=divs[i-1].className+"-sel";
  	      divs[i].className=divs[i].className+"-sel";
  	      divs[i+1].className=divs[i+1].className+"-sel";
  	    }    
  }
  var detailIframe=document.getElementById('detailIframe').contentWindow;
  detailIframe.location.href=clickDiv.getAttribute('url');
}
function setDefaultTab(pos)
{
  var menuDiv=document.getElementById("menuTabDiv");
  var divs=menuDiv.getElementsByTagName("div");
  divs[pos*4].className=divs[pos*4].className+"-sel";
  divs[pos*4+1].className=divs[pos*4+1].className+"-sel";
  divs[pos*4+2].className=divs[pos*4+2].className+"-sel";
  var detailIframe=document.getElementById('detailIframe').contentWindow;
  detailIframe.location.href=divs[pos*4+1].getAttribute('url');
}

function getRadioValue(radioName){
	var radios = document.getElementsByName(radioName);
	if(!radios){
		return null;
	}
	
	for(var i = 0; i < radios.length; i++) {
		if(radios[i].checked){
			return radios[i].value;
		}
	}
	
	return null;
}

var sx_variable = {
	detailFrameName : "",
	title : "", 
	imgSrc : "", 
	count : 0, 
	description: "",
	
	isShow : false
};

/**
 * 上下结构的页面，显示下面的图片、总数、描述
 * 
 * @param detailFrameName 下面页面的frame的名称
 * @param title 显示的标题 要国际化哦
 * @param imgSrc 显示的图标名称，统一放在/common/images/detailBannner下，比如：/common/images/detailBannner/101.gif
 * @param count 显示的总数，如果为null或者为负数，表示不显示总数
 * @param description 显示的描述
 */
function showDetailPageBaseInfo(detailFrameName, title, imgSrc, count, description){
	parent.sx_variable.detailFrameName = detailFrameName;
	parent.sx_variable.title = title;
	parent.sx_variable.imgSrc = imgSrc;
	parent.sx_variable.count = count;
	parent.sx_variable.description = description;
	
	parent.doDetailPageBaseInfo();
}

function doDetailPageBaseInfo(){
	if(!sx_variable.detailFrameName){
		return;
	}
	
	var detailDocument = null;
	try{
		detailDocument = eval(sx_variable.detailFrameName)
	}
	catch(e){
	}
	
	if(detailDocument && detailDocument.document.readyState == "complete"){ //下面的页面已经加载完了
		var flag = eval("detailDocument.detailPageBaseInfoFlag");
		if(!flag){
			detailDocument.location.href = v3x.baseURL + "/common/detail.jsp";
			window.setTimeout("doDetailPageBaseInfo()", 500);
			return;
		}
		
		detailDocument.document.getElementById("titlePlace").innerHTML = sx_variable.title;
//		//icon坐标
//		if(typeof(sx_variable.imgSrc) == 'object'){
//	        var y = parseInt(sx_variable.imgSrc[0],10)-1;
//	        var x = parseInt(sx_variable.imgSrc[1],10)-1;
//			detailDocument.document.getElementById("imgDiv").innerHTML="<img id=\"img\" alt=\"\" src=\""+v3x.baseURL+"/common/images/space.gif\" class=\"detail-images\" style=\" background-position:-"+ (x*160) +' -' + (y*70) +"\">";
//		}
//		else{
//			detailDocument.document.getElementById("imgDiv").innerHTML="<img id=\"img\" alt=\"\" src=\""+v3x.baseURL + sx_variable.imgSrc+"\" height=\"70\" width=\"160\">";
//		}
		
		if(sx_variable.count != null && sx_variable.count >= 0){
			detailDocument.document.getElementById("countPlace").innerHTML = v3x.getMessage("V3XLang.common_detailPage_count_label", "<span class='countNumber'>" + sx_variable.count + "</span>");
		}
		
		detailDocument.document.getElementById("descriptionPlace").innerHTML = sx_variable.description || "";
		
		detailDocument.document.getElementById("allDiv").style.display = "";
	}
	else{
		window.setTimeout("doDetailPageBaseInfo()", 500);
	}
}

function reloadDetailPageBaseInfo(){
	try{
		parent.doDetailPageBaseInfo();
	}
	catch(e){}
}

/******************************************  页签切换  *************************************************/
function changeTabUnSelected(id){
	if(id){
		document.getElementById("l-" + id).className = "tab-tag-left";
		document.getElementById("m-" + id).className = "tab-tag-middel cursor-hand";
		document.getElementById("r-" + id).className = "tab-tag-right";
	}
}

function changeTabSelected(id){
	if(id){
		document.getElementById("l-" + id).className = "tab-tag-left-sel";
		document.getElementById("m-" + id).className = "tab-tag-middel-sel";
		document.getElementById("r-" + id).className = "tab-tag-right-sel";
	}
}


/*************************************** 归档 ******************************************************
 * appName:应用 枚举key; 
 * ids:要归档的源数据id串，以逗号分割          如 12345,98754
 * atts：逗号分割的是否有附件标记串，和ids顺序一致，默认false     如  true,false
 * validAcl: 是否验证写入权限（一般管理员调用进行预归档），true或false，默认true（验证）
 * type: 归档类型。暂时公文使用，用来区别是部门归档，还是公文归档，还是模板预归档
 */
 var newIdes;
 var pigeonholeItem = {};
 function pigeonhole(appName, ids, atts, validAcl,type,collBackFuns){
		pigeonholeItem.collBackFuns = collBackFuns;
		newIdes=ids;
		if(typeof(type) == 'undefined') type = "";//没有传递这个参数的时候设置为空，否则向后台传递的参数为undefined
		if (typeof(collBackFuns) != 'undefined') {
			getA8Top().pigeonholeWin = getA8Top().$.dialog({
		        title:" ",
		        transParams:{'parentWin':window},
		        closeParam:{'show':true,handler:function(){
		        	pigeonholeChromeCollBack("cancel");
		        }},
		        url: v3x.baseURL + "/doc.do?method=docPigeonhole&appName=" + appName + "&atts=" + atts + "&validAcl=" + validAcl+"&pigeonholeType="+type,
		        width: 500,
		        height: 500,
		        isDrag:false
		    });
		} else {
			var returnval = v3x.openWindow({
				url : v3x.baseURL + "/doc.do?method=docPigeonhole&appName=" + appName + "&atts=" + atts + "&validAcl=" + validAcl+"&pigeonholeType="+type,
				width : "500",
				height : "500",
				resizable : "true",
				scrollbars : "true"			
			});
			if (returnval == undefined)
			 	returnval = "cancel";
			return returnval;
		}
}
 function pigeonholeChromeCollBack (returnValue) {
		getA8Top().pigeonholeWin.close();
		var func = new Function(pigeonholeItem.collBackFuns+"('"+returnValue+"');");
		func();
}
function projectPigeonhole(appName, ids, projectId, atts) {
	var returnval = v3x.openWindow({
		url : _ctxPath + "/doc.do?method=docTreeProjectIframe&appName=" + appName + "&ids=" + ids + "&projectId=" + projectId + "&atts=" + atts,
		width : "500",
		height : "500",
		resizable : "true",
		scrollbars : "true"			
	});

	if (returnval == undefined)
	 	returnval = "cancel";
	 	
	return returnval;
}
function  isPhoneNumber(element){
var value = element.value;
var inputName = element.getAttribute("inputName");
var cellphone=/^([\d-]*)$/;
if(!cellphone.test(value)){
writeValidateInfo(element, $.i18n("formValidate_isNumber", inputName));
return false;
}
return true;
}
/*
*综合办公申请数量与可申请数量的判断
*avacountValue：可申请数量
*/
function Avacount(element){
    var value = element.value;
	var avacountValue=document.getElementById("Avacount").value;
	if(parseInt(value)>parseInt(avacountValue)){
       alertAvacount();
	   return false;
	}
	return true;		
}
/**
 * 将滚动条定位到左、上
 * 
 */
function setScrollPosition (x,y,id){
	var oElement = (id!=null)?document.getElementById(id):document.body;
	oElement.scrollLeft = x;
	oElement.scrollTop = y;
}
/**
 * 限制fram拖动宽度
 * width:宽度
 * layoutId父级frameset id
 * minMax最大还是最小
 * direction左边还是右边
 * macj--09--05--06
 */
function resizeBody(width,layoutId,minMax,direction){
	try{
		minMax = (minMax=='min')?'min':'max';
		direction = (direction=='left')?'left':'right';
		var obj = parent.document.getElementById(layoutId);
		if(obj==null){
		    obj = parent.parent.document.getElementById(layoutId);
		}
		if(minMax=='max'){
		  if(document.body.clientWidth>width) {
		  	if(direction=='left'){
		  		obj.cols=""+width+",*";
		  	}else{
		  		obj.cols="*,"+width+"";
		  	}
		  	
		  }
		}else{
		  if(document.body.clientWidth<width){
		  	if(direction=='left'){
		  		obj.cols=""+width+",*";
		  	}else{
		  		obj.cols="*,"+width+"";
		  	}
		  }
		}
	}catch(e){
		
	}
}
/**
 * 限制frame拖动宽度
 * width:宽度
 * layoutId父级frameset id
 * end调整后百分比
 */
function resizeRightBody(width,layoutId,end){
	try{
		var obj = parent.document.getElementById(layoutId);
		if(obj==null){
		    obj = parent.parent.document.getElementById(layoutId);
		}
		if(document.body.clientWidth<width){
	  		obj.cols="*,"+end+"";
		}
	}catch(e){
		
	}
}
/**
 * 新建，修改取消按钮返回公用函数
 * 参数可以为空，返回说明页面
 * cancelOk({'page':'edit','hidden':['hideObj'],'enable':['itemName','commonOperation']})
 * page:是新建还是修改,不能为空,取值'new','edit'
 * hidden:隐藏的控件id数组.如果page为new(新建),hidden和enable无作用
 * enable:可用的控件id数组.如果page为new(新建),hidden和enable无作用
 * macj--09-05-07
 * */
function cancelOk(){
	try{
		var json = arguments[0];//传入的json格式参数
		if(json!=null){//不为空
			if(json.page!=null&&json.page=='new'){
				window.location.href=v3x.baseURL + "/common/detail.jsp";
			}else if(json.page!=null&&json.page=='edit'){
				var oForms = document.forms;//页面form
				for(var i=0;i<oForms.length;i++)
				{//循环form   
					for(var j=0;j<oForms[i].length;j++){//循环form元素
						if(json.enable!=null){//是否有可用id,有循环，跳出
							for(var t = 0;t<json.enable.length;t++){
								if(oForms[i][j].id==json.enable[t]){
									break;
								}else{
									oForms[i][j].disabled=true;//其他不可用
								}			
							}
						}else{
							oForms[i][j].disabled=true;
						}
					}   
				} 
				if(json.hidden!=null){//隐藏id
					for(var g = 0;g<json.hidden.length;g++){
						document.getElementById(json.hidden[g]).style.display="none";  
					}
				}
			}else{
				window.close();
			}
		}else{//json为空跳转到说明页面
			window.location.href=v3x.baseURL + "/common/detail.jsp";
		}
	}catch(e){
		
	}
}

/**
 * 显示人员信息
 */
function showV3XMemberCard(memberId){
	if(v3x.getBrowserFlag('needModalWindow')){
		v3x.openWindow({
			url : "/seeyon/genericController.do?ViewPage=collaboration/memberCard&memberId=" + memberId,
			width : 680,
			height: 400,
			dialogType: "modal"
		});
	}else{
		var member_view_win = new MxtWindow({
	        id: 'member_view_win',
	        title: '',
	        url: "/seeyon/genericController.do?ViewPage=collaboration/memberCard&memberId=" + memberId,
	        width: 640,
	        height: 400,
			type:'window',
			isDrag:false
		});
	}
}
/**
*ajax判断某用户是否有待发送和待签收的事项 true(有待办事项) false (无待办事项)
*userId :要删除的公文收发员的ID
*username : a.收发员名字  b.当username为空的时候表示没有指定的用户名，删除全部，用新的提示语
*/
function ajaxCheckAccountExchangePendingAffair(userId,userName){
	try {
		var requestCaller = new XMLHttpRequestCaller(this, "ajaxEdocExchangeManager", "checkEdocExchangeHasPendingAffair", false);
		requestCaller.addParameter(1, "Long", userId);
		var rs = requestCaller.serviceRequest();
		if(rs!="0"){
			
			if(userName!=''){
				//{0}尚有待发送或待签收公文未处理，请先处理.
				alert(v3x.getMessage("MainLang.edoc_alert_hasExchangePendingAffair", userName));
			}else{
				//有待发送或待签收公文未处理，不能取消所有的公文收发员，请先处理.
				alert(v3x.getMessage("MainLang.edoc_alert_notdelteAllExchanger"));
			}
			return true;
		}
		return false;
	}
	catch (ex1) {
		alert("Exception : " + ex1);
		return false;
	}	
}

// 判断当前窗口是否是从精灵打开
function isOpenFromGenius(){
    var fromGenius = false;
    try{
        fromGenius = getA8Top().location.href.indexOf('a8genius.do')>-1;
    }catch(e){alert(e);}	
    return fromGenius;
}
//ipad窗口高度过高
if(navigator.userAgent.indexOf('iPad') != -1){
	window.addEventListener('load', function(){
		getA8Top().document.body.style.height= "690px";
	});
}
//设置ff下grid没有滚动条
function setFFGrid(htmlID,dragable){
	//ipad隐藏上下结构下部
	if(htmlID == '' || dragable == false){return;}
	if(document.all){
		window.attachEvent('onload', function(){mxtgrid(htmlID);});
		window.attachEvent("onresize",function(){resizeGrid(htmlID,dragable);});
	}else{
		mxtgrid(htmlID);
		window.addEventListener("resize",function(){resizeGrid(htmlID,dragable);},false);
	}
}
function mxtgrid(id){
    var g = {
        id: '',
        srollLeft: 0,//存储拖动滚动条左侧距离
        _srollLeft: 0,
        dragLeft: 0,//存储拖动滚动条左侧距离
        xStart: 0,
        xEnd: 0,
        eStart: 0,//鼠标开始拖动
        oMove: null,//拖动对象
        iIndex: 0,
        _drag: 0,
        stopDrag: false,
        dragFlag: false,//鼠标开始拖动
        scroll: function(){//拖动滚动条设置内容区和表头一直
            g.hDiv.scrollLeft = g.bDiv.scrollLeft;
        },
        setPosition: function(){//拖动滚动条设置拖动区域和表头一直
            var hscrollLeft = parseInt(g.hDiv.scrollLeft);//表头左侧距离
            var cdleft = g.srollLeft - hscrollLeft;//每次移动距离
            g.cDrag.style.display = 'none';
            var splits = g.cDrag.childNodes;
            for (var i = 0; i < splits.length; i++) {
                var objTemp = splits[i];
                if (typeof objTemp == 'object' && objTemp.nodeType != 3) {//ff google浏览器空格算作节点，过滤文字节点
                    var _l = parseInt(objTemp.style.left) + cdleft;
                    objTemp.style.left = _l + "px";
                }
                
            }
            g.srollLeft = hscrollLeft;
            g.cDrag.style.display = '';
        },
        setDragPosition: function(){//拖动分割条设置分隔条位置
            var hscrollLeft = parseInt(g.hDiv.scrollLeft);//表头左侧距离
            var cdleft = g.srollLeft - hscrollLeft;//每次移动距离
            g.cDrag.style.display = 'none';
            var splits = g.cDrag.childNodes;
            for (var i = 0; i < splits.length; i++) {
                var objTemp = splits[i];
                if (typeof objTemp == 'object' && objTemp.nodeType != 3) {//ff google浏览器空格算作节点，过滤文字节点
                    var sss = parseInt(objTemp.style.left) + cdleft;
                    objTemp.style.left = sss + "px";
                }
                
            }
            g.srollLeft = hscrollLeft;
            g.cDrag.style.display = '';
        },
        attEvt: function(){
            var splits = g.cDrag.childNodes;
            for (var i = 0; i < splits.length; i++) {
                var objTemp = splits[i];
                if (typeof objTemp == 'object' && objTemp.nodeType != 3) {//ff google浏览器空格算作节点，过滤文字节点
                    objTemp.onmousedown = g.dragStart;//绑定
                }
            }
        },
        getIndex: function(){
            if (g.oMove != null && g.cDrag != null) {
                var splits = g.cDrag.childNodes;
                for (var i = 0; i < splits.length; i++) {
                    if (splits[i] == g.oMove) {
                        g.iIndex = i;
                    }
                }
            }
        },
        dragStart: function(){
            g.oMove = this;
            g.moveOrigintLeft = parseInt(g.oMove.style.left);
            g.getIndex();
            document.onmousedown = g.mousedown;
            document.onmousemove = g.mousemove;
            document.onmouseup = g.mouseup;
            document.onselectstart = function(){
                return false;
            };
            document.onselect = function(){
                document.selection.empty()
            };
            
        },
        mousedown: function(obj){
        	g.bDiv.style.overflowY="auto";
        	g.bDiv.style.overflowX="auto";
            g.dragFlag = true;
            var e = g.getEvent();
            g.eStart = g.xStart = document.all ? e.x : e.pageX;
            document.body.style.cursor = "col-resize";
            
        },
        mousemove: function(obj){
            if (!g.dragFlag) {
                return;
            }
            var e = g.getEvent();
            var x = document.all ? e.x : e.pageX;
            var m = x - g.eStart;
            var _pren = g.oMove.previousSibling;
            
            var _d = parseInt(g.oMove.style.left) + m;
            //bug拖动鼠标到浏览器窗口外释放鼠标
            if(_d>g.clientWidth || _d<50){
            	g.xEnd = g.eStart;
            	g.oMove.style.left = g.moveOrigintLeft + "px"; 
                document.body.style.cursor = "default";
                
                g.dragFlag = false;
                g.stopDrag = false;
                g.oMove = null;
                
                document.onmousedown = null;
                document.onmousemove = null;
                document.onmouseup = null;
                document.onselectstart = null;
                document.onselect = null;
            }else{
	        	if (_pren != null) {
	        		if (_d > (parseInt(_pren.style.left) + 50)) {
	        			g.oMove.style.left = _d + "px";
	        			g.eStart = x;
	        		}else {
	        			g.stopDrag = true;
	        		}
	        	}else {
	        		if (_d > 50) {
	        			g.oMove.style.left = _d + "px";
	        			g.eStart = x;
	        		}else {
	        			g.stopDrag = true;
	        		}
	        	}
            }
        },
        mouseup: function(obj){
            if (!g.dragFlag) {
                return;
            }
            var e = g.getEvent();
            g.xEnd = document.all ? e.x : e.pageX;
            if (g.stopDrag) {
                g.xEnd = g.eStart;
            }
            g.setDragPosition();
            g.setHeadWidth();
            g.setListWidth();
            if(g._drag<0 && g.hDiv.scrollLeft==0){
            	g.bDiv.scrollLeft = 0;
            }else{
            	g.hDiv.scrollLeft = g.bDiv.scrollLeft;
            }
            g.setPosition();
            
            document.body.style.cursor = "default";
            
            g.dragFlag = false;
            g.stopDrag = false;
            g.oMove = null;
            
            document.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            document.onselectstart = null;
            document.onselect = null;
            
            
            if (!document.all) {
                //document.getElementById('sd').focus();
                //g.htable_s.focus();//firefox失去拖动的焦点，要不然不能连续拖动!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            }
            
        },
        setHeadWidth: function(){
            var _th = g.oHead.childNodes[g.iIndex];
            var _o = _th.childNodes[0];
            var _l = parseInt(_o.style.width) + g._drag;
            _o.style.width = _l + "px";
            _th.setAttribute('width', _l);
            g.globalWidth = g.bTable.clientWidth;
            g.hTable.setAttribute('width', g.globalWidth + g._drag);
            if(g.noBody == true){
            	g.bDiv.innerHTML = "<div style='width:"+(g.holeWidth + g._drag)+"px'>&nbsp;</div>"
            }
        },
        setListWidth: function(){
            var _os = g.oBody.childNodes;
            for (var i = 0; i < _os.length; i++) {
                var _td = _os[i].childNodes[g.iIndex];
                var _o = _td.childNodes[0]
                var _l = parseInt(_o.style.width) + g._drag;
                _o.style.width = _l + "px";
                _td.setAttribute('width', _l);
            }
            g.bTable.setAttribute('width', g.globalWidth + g._drag);
        },
        setDragPosition: function(){
            g._srollLeft = parseInt(g.hDiv.scrollLeft);
            g._drag = g.xEnd - g.xStart;
            var splits = g.cDrag.childNodes;
            for (var i = (g.iIndex + 1); i < splits.length; i++) {
                var objTemp = splits[i];
                if (typeof objTemp == 'object' && objTemp.nodeType != 3) {//ff google浏览器空格算作节点，过滤文字节点
                    var _l = parseInt(objTemp.style.left) + g._drag;
                    objTemp.style.left = _l + "px";
                }
                
            }
        },
        getEvent: function(){
            if (document.all) {
                return window.event;
            }
            func = g.getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        removeTextNode: function(obj){
            var c = obj.childNodes;
            for (var i = 0; i < c.length; ++i) {
				var o = c[i];
                if (o.nodeType != 1) {
                    o.parentNode.removeChild(o);
                }
            }
        },
		setWidth:function(){
        	var _wA = new ArrayList();
			var c = g.oHead.childNodes;
			var sW = g.subHeight==0 ? Math.floor(g.clientWidth-c.length*12-2) :  Math.floor(g.clientWidth-c.length*12-20);//总宽度//table布局设置,拖动会把外层table撑开，设置宽度
			
			var _dragHeight = 27;
			//var _dragHeight = g.clientHeight-35;
			//var dd = Math.floor(g.bTable.clientHeight);
			//if(dd<g.clientHeight){
			//	_dragHeight = dd+29;
			//}
			g.cDrag.style.display='none';
			var _left = 0;//拖动div left值
			var holeWidth = 0;
			for (var i = 0; i < c.length; ++i) {
				var o = c[i];
				if(o.nodeType!=1){
					continue;
				}
				var o_div = o.childNodes[0];
				var _d = g.cDrag.childNodes[i];
				var _width=null;
					
				_width = o.getAttribute('width');
				
				if(_width==null || _width==undefined || _width==''){
					_width = "5%";
				}
				var _w;
				if(_width.indexOf('%')!=-1){
					_w = Math.floor(sW*(parseInt(_width))/100);
				}else{
					_w = Math.floor(_width);
				}
				
				//0 2 3 5 7 
				//0 1 2 3 4
				
				_left+=_w+10;//padding：10px，边框1px
				_wA.add(_w);
				holeWidth+=_w;
			
				o.setAttribute('width','')
				
				o_div.style.width=_w+"px";
				_d.style.left = (_left+i*2-1)+"px";
				_d.style.height = _dragHeight+'px';
				
			}
			g.holeWidth = holeWidth+c.length*12+2;
			g.cDrag.style.display='';
			var b = g.oBody.childNodes;
			if(b.length!=0){
				for (var j = 0; j < b.length; ++j) {
					var a = b[j].childNodes;
					for (var n = 0; n < a.length; ++n) {
						var f = a[n];
						if(f.childNodes.length==0){
							continue;
						}
						
						f.childNodes[0].style.width=_wA.get(n)+"px";	
						//ie7下td宽度不能自动收缩
						if(v3x.isMSIE7 && !v3x.isMSIE8 &&!v3x.isMSIE9){
							f.setAttribute('width',(_wA.get(n)+10));
						}
					}
				}
			}else{
				//如果列表为空产生一个div撑开bDiv，拖动显示隐藏的列
				g.noBody = true;
				g.bDiv.innerHTML = "<div style='width:"+g.holeWidth+"px'>&nbsp;</div>"
			}
		},
		setTitle:function(){
			var c = g.oHead.childNodes;
			for (var i = 0; i < c.length; ++i) {
				var o = c[i];
				var o_div = o.childNodes[0];
				if(o_div){
					var titleStr = o_div.innerHTML;
					if(titleStr.indexOf('<INPUT')!=-1 || titleStr.indexOf('<IMG')!=-1 || titleStr.indexOf('<FONT')!=-1 || titleStr.indexOf('<SPAN')!=-1){
						titleStr = '';
					}
					o_div.setAttribute("title",titleStr);
				}
			}	
		}
        
    }
    g.id = id;
    g.layoutdiv = document.getElementById('scrollListDiv');
    if(g.layoutdiv == null){
    	g.layoutdiv = document.body;
    }else{
    	g.layoutdiv.style.overflow="hidden";
    }
    g.clientWidth = parseInt(g.layoutdiv.clientWidth);
    g.clientHeight = parseInt(g.layoutdiv.clientHeight);
    if(g.clientHeight<=0 || g.clientWidth<=0) {
    	//如果页面加载缓慢，计算出来的高宽不足以初始化页面
    	setTimeout(function(){mxtgrid(g.id)},100);
    }    
    
    g.mxtgrid = document.getElementById('mxtgrid_'+id);
    g.mxtgrid.style.display="none";
    g.hTable = document.getElementById('hTable' + id);
    g.bTable = document.getElementById('bTable' + id);
    
    g.bDiv = document.getElementById('bDiv' + id);//body
    g.hDiv = document.getElementById('hDiv' + id);//head
    g.cDrag = document.getElementById('cDrag' + id);//drag
    g.oHead = document.getElementById('headID' + id);
    g.oBody = document.getElementById('bodyID' + id);
    g.subHeight = parseInt(g.mxtgrid.getAttribute('subHeight'));//固定高度需要减去的高度(一般是去掉toolbar的高度):为table布局设置
    if(g.subHeight!=0){g.mxtgrid.style.width = g.clientWidth+"px";}//table布局设置,拖动会把外层table撑开，设置宽度
    if(g.clientHeight-63-g.subHeight <= 0) {//63是头部和翻页高度
    	return;
    }
    var isIe6 = v3x.isMSIE6 && !v3x.isMSIE7 && !v3x.isMSIE8 &&!v3x.isMSIE9;
    if((g.oBody.childNodes.length*28+63)>g.clientHeight){//有滚动条,宽度减去垂直滚动条的宽度
    	g.clientWidth = g.clientWidth-17;
    }   
    g.bDivHeight = g.clientHeight-63-g.subHeight;
    g.bDiv.style.height = g.bDivHeight+'px';
    //ie6
    if(isIe6){
    	g.layoutdivParent = g.layoutdiv.parentNode;
    	g.bDiv.style.height = (g.bDivHeight-parseInt(g.layoutdivParent.currentStyle.paddingTop))+'px';
    }
	//if(!document.all){
		//非ie浏览器把换行当做一个对象(文本对象)，剔除文本对象
		g.removeTextNode(g.cDrag);
		g.removeTextNode(g.oHead);
		g.removeTextNode(g.oBody);
		var ss = g.oBody.childNodes;
	    for (var i = 0; i < ss.length; ++i) {
			g.removeTextNode(ss[i]);
	    }
	//}
	g.setTitle();
	g.setWidth();
    g.attEvt();
    g.bDiv.onscroll = function(){
        g.scroll();
        g.setPosition();
    }
    //ie7下默认有水平滚动条 在拖动列宽时 再吧scroll职位auto
    if(g.bTable.clientWidth<g.bDiv.clientWidth){
    	g.bDiv.style.overflowY="auto";
    	g.bDiv.style.overflowX="hidden";
    }
    g.mxtgrid.style.display="";
}
//自动定位点击列表行
function setTablePosition(parentObj,target){
	if(target==null){
		if(parentObj!=null && parentObj.document!=null && parentObj.document.rowPositionObj){
			parentObj.document.rowPositionObj.focus();
		}else{
			return;
		}
	}else{
		parentObj.target.focus();
	}
}
function setPositionObj(obj){
	document.rowPositionObj = obj;
}
/**
 * @author macj
 */
function resizeGrid(htmlID,dragable){
	try{
		var id = htmlID;

		var layoutdiv = document.getElementById('scrollListDiv');
		if(layoutdiv == null || layoutdiv.clientHeight<=0){
			layoutdiv = document.body;
		}
		var clientWidth = Math.floor(layoutdiv.clientWidth);
		var clientHeight = Math.floor(layoutdiv.clientHeight);
		if(clientHeight<=0) {
			return;
		}    

		var mxtgrid = document.getElementById('mxtgrid_'+id);
		var hTable = document.getElementById('hTable' + id);
		var bTable = document.getElementById('bTable' + id);

		mxtgrid.style.display="none";
		var bDiv = document.getElementById('bDiv' + id);//body
		var hDiv = document.getElementById('hDiv' + id);//head
		var cDrag = document.getElementById('cDrag' + id);//drag
		var oHead = document.getElementById('headID' + id);
		var oBody = document.getElementById('bodyID' + id);

		var subHeight = parseInt(mxtgrid.getAttribute('subHeight'));//固定高度需要减去的高度(一般是去掉toolbar的高度):为table布局设置
		if(subHeight!=0){mxtgrid.style.width = clientWidth+"px";}//table布局设置,拖动会把外层table撑开，设置宽度
		if(clientHeight-63-subHeight <= 0) {
			return;
		}    
	    var isIe6 = v3x.isMSIE6 && !v3x.isMSIE7 && !v3x.isMSIE8 &&!v3x.isMSIE9;
	    if(isIe6){//ie6判断是否有滚动条
	    	clientWidth = clientWidth-15;
	    }
		var bDivHeight = clientHeight-63-subHeight;
		bDiv.style.height = bDivHeight+'px';
		if(isIe6){
			layoutdivParent = layoutdiv.parentNode;
			bDiv.style.height = (bDivHeight-parseInt(layoutdivParent.currentStyle.paddingTop))+'px';
		}
		var _dragHeight = clientHeight-35;
		var dd = Math.floor(bTable.clientHeight);
		if(dd<clientHeight){
			_dragHeight = dd+29;
		}
		if(_dragHeight<=0) {
			return;
		}    
		cDrag.style.display='none';
		var c = cDrag.childNodes;
		for (var i = 0; i < c.length; ++i) {
			var _d = c[i];
			_d.style.height = _dragHeight+'px';
		}
		cDrag.style.display='';
		mxtgrid.style.display="";
	}catch(e){
		
	}
}
/**
 * @author macj
 * 2010-12-14
 *  id      :唯一
    title   :标题
    url     :的路径对应iframe的src
    height  :高度
    width   :宽度
    top     :顶部距离
    left    :左边距离
    className :自定义样式
    relativeElement :相对对象--相对定位
    buttons :按钮及回调函数
    html
	type    :类型window和panel
	isDrag  :是否允许拖动
	targetWindow :指定显示的窗口
	
    demo:
    
    var window = new MxtWindow({
        id: '1',
        title: 'My Window',
        url: 'http://www.baidu.com',//注销url显示html
        width: 400,
        height: 300,
		type:'panel',//类型window和panel为panel的时候title不显示
		isDrag:false,//是否允许拖动
        html: "ccccccccccccccccc",
        buttons: [{
			id:'btn1',
            text: 'Submit',
            disabled: true
        }, {
			id:'btn2',
            text: 'Close',
            handler: function(){
                window.close();
            }
        }]
    
    });
    
  var win = new MxtWindow({
    id: '2',
    title: 'Fix Window',
    url: 'http://www.126.com',
    width: 400,
    height: 300,
	type:'window',
	isDrag:false,
	relativeElement:obj,//固定的目标对象,左边下方(左下或右下)
	discription:"dfdfd",
    buttons: [{
		id:'btn1',
        text: 'Submit',
        disabled: true
    }, {
		id:'btn2',
        text: 'Close',
        handler: function(){
            win.close();
        }
    }]

});
 *
 */

function MxtWindow(json){
    //为空既返回
    if (json == null) {
        return;
    }
    //id唯一
    this.id = json.id ? json.id : Math.floor(Math.random() * 100000000);
    //标题
    this.title = json.title;
    //url的路径对应iframe的src
    this.url = json.url;
    //高度
    this.height = json.height == null ? 250 : json.height;
    //宽度
    this.width = json.width == null ? 300 : json.width;
    //标题的高度
    this.titleHeight = 29;
    //按钮区域的高度
    this.footerHeight = 30;
    //top
    this.top = json.top;
    //left
    this.left = json.left;
    //是否要灰色背景true要，false不要
    this.model = json.model== null ? true : false;
    //自定义样式
    this.className = json.calssName == null ? 'mxt-window' : json.classNam;
    //窗口对象
    this.element = json.obj;
    //相对对象--相对定位
    this.relativeElement = json.relativeElement;
    //是否创建还是实例化--暂时没扩展
    this.isCeate = true;
    //按钮及回调函数
    this.buttons = json.buttons;
    //是否允许弹出多个
    this.isSynchronization = json.isSynchronization == null ? false : true;
    // 浏览器检测
    this.userAgent = navigator.userAgent.toLowerCase();
    this.isOpera = this.userAgent.indexOf('opera') > -1;
    this.isIE = this.userAgent.indexOf('msie') > -1 && !this.isOpera;
    this.isNS = this.userAgent.indexOf("netscape") > -1;
    this.dragDiv = null;
    this.isIframe = false;
    this.iframe = null;
    this.iframeId = null;
    this.html = json.html;
    this.offsetTop = 0;
    this.offsetLeft = 0;
    this.discription=json.discription == undefined?'':json.discription;
    this.closeParam = json.closeParam;
    this.closeHidden = json.closeHidden == undefined?false:json.closeHidden;
    this.maskIndex = 1000;
    this.transParams = json.transParams == undefined?null:json.transParams;
    //指定显示的窗口
    this.targetWindow = json.targetWindow == undefined ? window : json.targetWindow;
    
    this.setIndex();

    var _wwww = parseInt(this.targetWindow.document.documentElement.clientWidth);
    var _wwww2 = parseInt(this.targetWindow.document.body.clientWidth);
    if(_wwww2>_wwww){_wwww = _wwww2}
    if(_wwww<this.width){
      this.width = _wwww;
    }
    
    var _hhhh = parseInt(this.targetWindow.document.documentElement.clientHeight);
    var _hhhh2 = parseInt(this.targetWindow.document.body.clientHeight);
    if(_hhhh2>_hhhh){_hhhh = _hhhh2}
    if(_hhhh<this.height){
      this.height = _hhhh;
    }
	
	//类型window和panel
    this.type = json.type == null ? 'window' : json.type;
	//是否允许拖动
    this.isDrag = json.isDrag == null ? true : json.isDrag;
    //初始化
    this.initWindow();
    //显示透明背景
    this.isModel();
    //显示window
    this.showWindow();
    //添加效果(阴影和拖拽)
    this.addEffect();
    //显示window
    this.showWindow();
}
//    title.id = this.id+"-mxtwindow-title";
MxtWindow.prototype.setTitle = function(text){
  var _ttttt = this.targetWindow.document.getElementById(this.id+"-mxtwindow-title");
  if(_ttttt){
    _ttttt.innerHTML = text;
  }
}
MxtWindow.prototype.setIndex = function(){
  var _cccc = this.getClass('div','shield');
  if(_cccc && _cccc.length>0){
    if(_cccc.length == 1){
      this.maskIndex = 1002;
    }
    if(_cccc.length > 1){
      for(var i = 0 ; i<_cccc.length; i++){
        var _ele = _cccc[i];
        var _index = parseInt(_ele.style.zIndex);
        if(_index>this.maskIndex){
          this.maskIndex = _index;
        }
      }
      this.maskIndex = this.maskIndex+2;
    }
  }
}
MxtWindow.prototype.getClass = function(tagname, className){
  //tagname指元素，className指class的值
  //判断浏览器是否支持getElementsByClassName，如果支持就直接的用
  if (this.targetWindow.document.getElementsByClassName) {   
    return this.targetWindow.document.getElementsByClassName(className);
  }else {    //当浏览器不支持getElementsByClassName的时候用下面的方法
    var tagname = this.targetWindow.document.getElementsByTagName(tagname);  //获取指定元素
    var tagnameAll = [];     //这个数组用于存储所有符合条件的元素
    for (var i = 0; i < tagname.length; i++) {     //遍历获得的元素
      if (tagname[i].className == className) {     //如果获得的元素中的class的值等于指定的类名，就赋值给tagnameAll
        tagnameAll[tagnameAll.length] = tagname[i];
      }
    }
    return tagnameAll;
  }
}
MxtWindow.prototype.getReturnValue = function(){
	
	var index = null;
	var topWindow = this.targetWindow;
	var win = null;
	if (this.isIE) {
	    try {
	        win = topWindow.document.frames(this.iframeId);
	    } catch (e) {
	        win = topWindow.frames[this.iframeId];
	    }
	    
	}else{
		win = topWindow.frames[this.iframeId];
	}
	if(win == null){
	  try{
	    for(var i = 0; i<topWindow.frames.length; i++){
	      if(topWindow.frames[i].name == this.iframeId){ 
	        index = i;
	        break;
	      }
	    }
	    if(index!=null){
	      win = topWindow.frames[index];
	    }
	  }catch(e){
	    win = topWindow.document.getElementById(this.iframeId);
	  }
	}
	if(win == null ){
		win = document.getElementById(this.iframeId);
	}
	if(win!=null){
		var returnValues = null;
		if(win.contentWindow){
			returnValues =win.contentWindow.OK(); 
		}else{
			returnValues =win.OK(); 
		}
		return returnValues;
	}else{
		return null;
	}
}
//初始化
MxtWindow.prototype.initWindow = function(){
    var ele = this.getElement(this.id);
    if (ele != null) {
        this.removeElement(ele);
    }
    if (this.url == null) {
        this.isIframe = false;
    }
    else {
        this.isIframe = true;
    }
    
    if (this.relativeElement != null) {
    
        var posX = this.relativeElement.offsetLeft;
        
        var posY = this.relativeElement.offsetTop;
        
        var aBox = this.relativeElement;//需要获得位置的对象
        do {
        
            aBox = aBox.offsetParent;
            
            posX += aBox.offsetLeft;
            
            posY += aBox.offsetTop;
            
        }
        while (aBox.tagName != "BODY");
        
        this.offsetLeft = posX;
        this.offsetTop = posY;
        
    }
    if (this.buttons == null || this.buttons == undefined) {
    	this.footerHeight = 0;
    }
    
    
    
    if (this.type == 'window') {
        this.getWindow();
    }
    else {
        this.getPanel();
    }
    

}
//添加效果
MxtWindow.prototype.addEffect = function(){
    //this.addShadow();
	if (this.isDrag) {
		new this.targetWindow.MxtWindow.divDrag([this.dragDiv, this.element]);
		//new MxtWindow.divDrag([this.dragDiv, this.element]);
	}
}
//显示window
MxtWindow.prototype.showWindow = function(){
	if(this.targetWindow.document.getElementById(this.id)!=null){
		return;
	}
	if(this.isSynchronization){
		if(this.targetWindow.document.getElementById("_isSynchronization")!=null){
			return;
		}
	}
	this.targetWindow.document.body.appendChild(this.element);
	if(this.transParams!=null){
		try{
			this.iframe.contentWindow.transParams = this.transParams;
		}catch(e){
			this.iframe.contentWindow.transParams = this.transParams;
		}
    }
}
//显示透明背景
MxtWindow.prototype.isModel = function(){
	if(this.model){
		if(this.targetWindow.document.getElementById(this.id+"_oMxtMask")!=null){
			return;			
		}
		var oMxtMask = this.targetWindow.document.createElement("div");
		oMxtMask.id = this.id+"_oMxtMask";
		oMxtMask.className = "shield";
		
		var bWidth = parseInt(this.targetWindow.document.body.scrollWidth);
		var bHeight = parseInt(this.targetWindow.document.body.scrollHeight);
		var styleStr = "top:0px;left:0px;position:absolute;z-index:"+this.maskIndex+";background:#000000;width:"
				+ bWidth + "px;height:" + bHeight + "px;filter: alpha(opacity=25);-moz-opacity: 0.25;opacity: 0.25;";
		oMxtMask.style.cssText = styleStr;
		this.targetWindow.document.body.appendChild(oMxtMask);
	}else{
		return;
	}
}
MxtWindow.prototype.close = function(e){
	try{
		this.targetWindow.document.getElementById(this.iframeId).contentWindow.document.getElementById('docOpenBodyFrame').contentWindow.document.getElementById('officeEditorFrame').contentWindow.pdfOcxUnLoad();
	}catch(e){}
	try{
		this.targetWindow.document.getElementById(this.iframeId).contentWindow.document.getElementById('docOpenBodyFrame').contentWindow.document.getElementById('officeEditorFrame').contentWindow.OcxUnLoad();
	}catch(e){}
	this.targetWindow.document.getElementById(this.iframeId).src="";
    this.removeElement(this.targetWindow.document.getElementById(this.id));
    if(this.model){
		if(this.targetWindow.document.getElementById(this.id+"_oMxtMask")!=null){
			this.removeElement(this.targetWindow.document.getElementById(this.id+"_oMxtMask"));	
		}
    }	
}
//创建panel
MxtWindow.prototype.getPanel = function(){
    //最外层
    this.element = this.createObj('div');
    this.element.className = this.className;
    this.element.id = this.id;
    
    //不用dtd样式出问题了
    if (this.isIE) {
        this.element.style.width = this.width + 2 + "px";
        this.element.style.height = this.height - 8 + "px";
    }
    else {
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height -5+ "px";
    }
    //设置top和left属性值要不拖动不了
    
    if (this.relativeElement != null) {
        this.top = parseInt(this.offsetTop) + parseInt(this.relativeElement.offsetHeight) + "px";
        this.left = parseInt(this.offsetLeft)  + "px";
        
        //右上角对准对象中间
        if (parseInt(this.offsetLeft) + parseInt(this.relativeElement.offsetWidth)  + parseInt(this.width) > parseInt(this.targetWindow.document.body.clientWidth)) {
            this.left = parseInt(this.offsetLeft)   - this.width + "px";
        }
        
    }
    if (this.top == null) {
        this.top = (parseInt(this.targetWindow.document.body.clientHeight) - this.height) / 2 + "px";
        this.left = (parseInt(this.targetWindow.document.body.clientWidth) - this.width) / 2 + "px";
    }
    this.element.style.top = this.top;
    this.element.style.left = this.left;
    
    //head
    var head = this.createObj('div');
    head.className = 'mxt-panel-head';
    head.style.height = "20px";
    head.onselectstart = function(){
        return false;
    }
    
    //拖动的区域
    this.dragDiv = head;
    
    //标题
    //    var title = this.createObj('span');
    //    title.className = 'mxt-panel-head-title';
    //    title.innerHTML = this.title;
    
    
    //关闭按钮
    var close = this.createObj('span');
    close.className = 'mxt-panel-head-close';
    //添加关闭事件
    var self = this;
    MxtWindow.addEvent(close, "click", function(e){
        return self.close(e);
    }, false);
    
    //添加title和close
    //head.appendChild(title);
    head.appendChild(close);
    
    //body
    var body = this.createObj('div');
    body.className = 'mxt-panel-body';
    body.style.height = this.height - this.footerHeight - 10 + "px";
    
    body.appendChild(head);
    
    //mxt-window-body-iframe
    if (this.isIframe) {
    	this.iframeId = parseInt(Math.random()*10000)+"-iframe";
    	var ifram = this.targetWindow.document.createElement('iframe'); 
        //var ifram = this.createObj('iframe');
        ifram.setAttribute("src", this.url);
        ifram.id = this.iframeId;
        ifram.name = this.iframeId;
        ifram.setAttribute("frameborder", "0");
        ifram.className = "mxt-window-body-iframe";
        ifram.style.height = parseInt(body.style.height)-20 + "px";
        ifram.style.width = this.width - 10 + "px";
        this.iframe = ifram;
        body.appendChild(this.iframe);
    }
    else {
        //内容区域
        var content = this.createObj('div');
        content.className = 'mxt-panel-body-content';
        content.style.height = parseInt(body.style.height) - 10 + "px";
        if (this.html) {
            content.innerHTML = this.html;
        }
        body.appendChild(content);
    }
    this.element.appendChild(body);
    
    //footer
    var footer = this.createObj('div');
    footer.className = 'mxt-panel-footer';
    footer.style.height = this.footerHeight + "px";
    
    if(this.discription!=null){
    	 var discriptionDiv = this.createObj('div');
    	 discriptionDiv.className="discriptionDiv";
    	 discriptionDiv.innerHTML = this.discription;
    	 footer.appendChild(discriptionDiv); 
    }
    
	if (this.buttons != null && this.buttons.length > 0) {
		var buttonsDiv = this.createObj('div');
		buttonsDiv.className = "buttonsDiv";
		for (var i = 0; i < this.buttons.length; i++) {
			var jsonTemp = this.buttons[i];
			var botton = this.createObj('input');
			botton.setAttribute("type", "button");
			botton.className="button-default-2"
			if (jsonTemp.text) {
				botton.setAttribute("value", jsonTemp.text);
			}
			if (jsonTemp.id) {
				botton.setAttribute("id", jsonTemp.id);
			}
			if (jsonTemp.disabled) {
				botton.setAttribute("disabled", jsonTemp.disabled);
			}
			if (jsonTemp.handler) {
				MxtWindow.addEvent(botton, "click", jsonTemp.handler, false);
			}
			buttonsDiv.appendChild(botton);
		};
		footer.appendChild(buttonsDiv);
	}
    this.element.appendChild(footer);
    
    if(this.isSynchronization){
    	var isSynchronization_hidden = this.createObj('input');
    	isSynchronization_hidden.setAttribute('type','hidden');
    	isSynchronization_hidden.setAttribute('id',"_isSynchronization");
    	this.element.appendChild(isSynchronization_hidden);
    }
}
//创建window
MxtWindow.prototype.getWindow = function(){
    //最外层
    this.element = this.createObj('div');
    this.element.className = this.className;
    this.element.id = this.id;
    
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.zIndex = this.maskIndex+1;
    
    
    this.elementContent = this.createObj('div');
    this.elementContent.style.position = "absolute";
    this.elementContent.style.zIndex = "10";
    this.element.appendChild(this.elementContent);
    
	this.iframeMask = this.targetWindow.document.createElement("iframe"); 
	this.iframeMask.style.position = "absolute";
	this.iframeMask.style.zIndex = "1";
	this.iframeMask.id = this.iframeId+"_iframeMask";
	this.iframeMask.setAttribute("frameBorder", "0");
    this.iframeMask.style.width = (this.width+3) + "px";
    this.iframeMask.style.height = this.height + "px";
	this.element.appendChild(this.iframeMask);
    
    
    
    //设置top和left属性值要不拖动不了
    
    if (this.relativeElement != null) {
        this.top = parseInt(this.offsetTop) + parseInt(this.relativeElement.offsetHeight) + "px";
        this.left = parseInt(this.offsetLeft) + "px";
        
        //右上角对准对象中间
        if (parseInt(this.offsetLeft) + parseInt(this.relativeElement.offsetWidth) / 2 + parseInt(this.width) > parseInt(this.targetWindow.document.body.clientWidth)) {
            this.left = parseInt(this.offsetLeft)  - this.width + "px";
        }
        
    }
    if (this.top == null) {
        this.top = (parseInt(this.targetWindow.document.body.clientHeight) - this.height) / 2 + "px";
        this.left = (parseInt(this.targetWindow.document.body.clientWidth) - this.width) / 2 + "px";
    }
    this.element.style.top = this.top;
    this.element.style.left = this.left;
    
    //head
    var head = this.createObj('div');
    head.className = 'mxt-window-head';
    head.style.height = this.titleHeight + "px";
    head.onselectstart = function(){
        return false;
    }
    
    //拖动的区域
    this.dragDiv = head;
    
    //标题
    var title = this.createObj('span');
    title.id = this.id+"-mxtwindow-title";
    title.className = 'mxt-window-head-title';
    title.innerHTML = this.title;
    
    
    //关闭按钮
    var close = this.createObj('span');
    close.className = 'mxt-window-head-close';
    //添加关闭事件
    var self = this;
    if(this.closeParam && this.closeParam.handler){
      MxtWindow.addEvent(close, "click", this.closeParam.handler, false);
    }else{
      MxtWindow.addEvent(close, "click", function(e){
        return self.close(e);
      }, false);
    }
    if(this.closeHidden){
    	close.style.display = 'none';
    }
    
    
    //添加title和close
    head.appendChild(title);
    head.appendChild(close);
    
    //body
    var body = this.createObj('div');
    body.className = 'mxt-window-body';
    body.style.height = this.height - this.titleHeight - this.footerHeight - 20 + "px";
    
    
    //mxt-window-body-iframe
    if (this.isIframe) {
    	this.iframeId = parseInt(Math.random()*10000)+"-iframe";
    	var ifram = this.targetWindow.document.createElement("iframe"); 
    	ifram.setAttribute("src", this.url);
    	ifram.id = this.iframeId;
    	ifram.name = this.iframeId;
    	ifram.setAttribute("frameBorder", "0");
    	ifram.className = "mxt-window-body-iframe";
    	ifram.style.height = parseInt(body.style.height)-5 + "px";
    	ifram.style.width = this.width - 10 + "px";
        this.iframe = ifram;
        body.appendChild(this.iframe);
    }
    else {
        //内容区域
        var content = this.createObj('div');
        content.className = 'mxt-window-body-content';
        content.style.height = parseInt(body.style.height) - 10 + "px";
        if (this.html) {
            content.innerHTML = this.html;
        }
        body.appendChild(content);
    }
    
    this.elementContent.appendChild(head);
    this.elementContent.appendChild(body);
    
    //footer
    var footer = this.createObj('div');
    footer.className = 'mxt-window-footer';
    footer.style.height = this.footerHeight + "px";
    if(this.discription!=null || this.discription!=''){
    	var discriptionDiv = this.createObj('div');
    	discriptionDiv.className="discriptionDiv";
    	discriptionDiv.innerHTML = this.discription;
    	footer.appendChild(discriptionDiv);
	}
    if (this.buttons != null && this.buttons.length > 0) {
    	var buttonsDiv = this.createObj('div');
		buttonsDiv.className = "buttonsDiv";
        for (var i = 0; i < this.buttons.length; i++) {
            var jsonTemp = this.buttons[i];
            var botton = this.createObj('input');
            botton.setAttribute("type", "button");
            
            if (jsonTemp.text) {
                botton.setAttribute("value", jsonTemp.text);
            }
            if (jsonTemp.id) {
                botton.setAttribute("id", jsonTemp.id);
            }
            if (jsonTemp.disabled) {
                botton.setAttribute("disabled", jsonTemp.disabled);
            }
            if (jsonTemp.handler) {
                MxtWindow.addEvent(botton, "click", jsonTemp.handler, false);
            }
            
            buttonsDiv.appendChild(botton);
        };
        footer.appendChild(buttonsDiv);
     }
    this.elementContent.appendChild(footer);
    if(this.isSynchronization){
    	var isSynchronization_hidden = this.createObj('input');
    	isSynchronization_hidden.setAttribute('type','hidden');
    	isSynchronization_hidden.setAttribute('id',"_isSynchronization");
    	this.element.appendChild(isSynchronization_hidden);
    }
    
}
MxtWindow.prototype.reloadUrl = function (url) {
  var _url = url;
  _url ? null : _url = this.url;
  var ifram = this.targetWindow.document.getElementById(this.iframeId); 
  ifram.setAttribute("src", _url);
}
//绑定事件
MxtWindow.addEvent = function(element, eventType, handler, capture){
    try {
        if (element.addEventListener) 
            element.addEventListener(eventType, handler, capture);
        else 
            if (element.attachEvent) 
                element.attachEvent("on" + eventType, handler);
    } 
    catch (e) {
    }
};
//删除对象
MxtWindow.prototype.removeElement = function(ele){
    ele.parentNode.removeChild(ele);
};
//创建对象元素
MxtWindow.prototype.createObj = function(type, id){
    var ele = this.targetWindow.document.createElement(type);
    ele.id = id == null ? '' : id;
    return ele;
}
//获取对象
MxtWindow.prototype.getElement = function(id){
    if (id == null) {
        return null;
    }
    else {
        return document.getElementById(id);
    }
}
Array.prototype.extend = function(C){
    for (var B = 0, A = C.length; B < A; B++) {
        this.push(C[B]);
    }
    return this;
}
// 拖拽效果
MxtWindow.divDrag = function(){
    var A, B, $cn;
    var zIndex = 2000;
    this.dragStart = function(e){
        e = e || window.event;
        if ((e.which && (e.which != 1)) || (e.button && (e.button != 1))) 
            return;
        var pos = this.$pos;
        $cn = this.parent || this;
        if (document.defaultView) {
            _top = document.defaultView.getComputedStyle($cn, null).getPropertyValue("top");
            _left = document.defaultView.getComputedStyle($cn, null).getPropertyValue("left");
        }
        else {
            if ($cn.currentStyle) {
                _top = $cn.currentStyle["top"];
                _left = $cn.currentStyle["left"];
            }
        }
        pos.ox = (e.pageX || (e.clientX + document.documentElement.scrollLeft)) -
        parseInt(_left);
        pos.oy = (e.pageY || (e.clientY + document.documentElement.scrollTop)) -
        parseInt(_top);
        if (!!A) {
            if (document.removeEventListener) {
                document.removeEventListener("mousemove", A, false);
                document.removeEventListener("mouseup", B, false);
                document.onselectstart = function(){return true;}
            }
            else {
                document.detachEvent("onmousemove", A);
                document.detachEvent("onmouseup", B);
            }
        }
        A = this.dragMove.create(this);
        B = this.dragEnd.create(this);
        if (document.addEventListener) {
            document.addEventListener("mousemove", A, false);
            document.addEventListener("mouseup", B, false);
        }
        else {
            document.attachEvent("onmousemove", A);
            document.attachEvent("onmouseup", B);
        }
        //$cn.style.zIndex = (++zIndex);
        this.stop(e);
    }
    this.dragMove = function(e){
        e = e || window.event;
        var pos = this.$pos;
        $cn = this.parent || this;
        $cn.style.top = (e.pageY || (e.clientY + document.documentElement.scrollTop)) -
        parseInt(pos.oy) +
        'px';
        $cn.style.left = (e.pageX || (e.clientX + document.documentElement.scrollLeft)) -
        parseInt(pos.ox) +
        'px';
        this.stop(e);
        
    }
    this.dragEnd = function(e){
        var pos = this.$pos;
        e = e || window.event;
        if ((e.which && (e.which != 1)) || (e.button && (e.button != 1))) 
            return;
        $cn = this.parent || this;
        if (!!(this.parent)) {
            this.style.backgroundColor = pos.color
        }
        if (document.removeEventListener) {
            document.removeEventListener("mousemove", A, false);
            document.removeEventListener("mouseup", B, false);
        }
        else {
            document.detachEvent("onmousemove", A);
            document.detachEvent("onmouseup", B);
        }
        A = null;
        B = null;
        //$cn.style.zIndex = (++zIndex);
        this.stop(e);
    }
    this.shiftColor = function(){
        //this.style.backgroundColor = "#EEEEEE";
    }
    this.position = function(e){
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        return {
            x: l,
            y: t,
            ox: 0,
            oy: 0,
            color: null
        }
    }
    this.stop = function(e){
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        else {
            e.returnValue = false;
        }
    }
    this.stop1 = function(e){
        e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        }
    }
    this.create = function(bind){
        var B = this;
        var A = bind;
        return function(e){
            return B.apply(A, [e]);
        }
    }
    this.dragStart.create = this.create;
    this.dragMove.create = this.create;
    this.dragEnd.create = this.create;
    this.shiftColor.create = this.create;
    this.initialize = function(){
        for (var A = 0, B = arguments.length; A < B; A++) {
            C = arguments[A];
            if (!(C.push)) {
                C = [C];
            }
            
            $C = (typeof(C[0]) == 'object') ? C[0] : (typeof(C[0]) == 'string' ? $(C[0]) : null);
            if (!$C) 
                continue;
            $C.$pos = this.position($C);
            $C.dragMove = this.dragMove;
            $C.dragEnd = this.dragEnd;
            $C.stop = this.stop;
            if (!!C[1]) {
                $C.parent = C[1];
                $C.$pos.color = $C.style.backgroundColor;
            }
            if ($C.addEventListener) {
                $C.addEventListener("mousedown", this.dragStart.create($C), false);
                if (!!C[1]) {
                    $C.addEventListener("mousedown", this.shiftColor.create($C), false);
                }
            }
            else {
                $C.attachEvent("onmousedown", this.dragStart.create($C));
                if (!!C[1]) {
                    $C.attachEvent("onmousedown", this.shiftColor.create($C));
                }
            }
        }
    }
    this.initialize.apply(this, arguments);
}

MxtWindow.prototype.addShadow = function(){
    obj = this.element;
    if (!obj) 
        return false;
    //浏览器检测  
    var userAgent = navigator.userAgent.toLowerCase();
    var isOpera = userAgent.indexOf('opera') > -1;
    var isIE = userAgent.indexOf('msie') > -1 && !isOpera;
    //var isKHTML=userAgent.indexOf('khtml')>-1||userAgent.indexOf('konqueror')>-1||userAgent.indexOf('AppleWebKit')>-1;  
    //var isMoz=userAgent.indexOf('gecko')>-1&&!isKHTML;  // FF||Netscape  
    var isNS = userAgent.indexOf("netscape") > -1;
    
    //获取对象的所占的总宽和高（包括边框）  
    var objWidth = obj.offsetWidth;
    var objHeight = obj.offsetHeight;
    //对象的绝对位置（元素相对浏览器的像素值）  
    var objL = 0;
    var objT = 0;
    //获取元素的Left和Top值的函数  
    var getLT = function(tempObj){
        if (!tempObj) 
            return false;
        var LL = 0, TT = 0;
        if (isIE || isOpera) { // IE||Opera  
            while (tempObj != null && tempObj.nodeName != "#document") {
                LL += tempObj.offsetLeft;
                TT += tempObj.offsetTop;
                tempObj = tempObj.parentNode;
            }
        }
        else { // FF||Netscape  
            TT = tempObj.offsetTop;
            LL = tempObj.offsetLeft;
        }
        return {
            T: TT,
            L: LL
        };
    }
    //读取元素的Top和Left值  
    var temp = getLT(obj);
    objL = temp.L;
    objT = temp.T;
    
    //创建三个阴影层及内部一个与元素大小相同的白色背景层 （从外层到内层）  
    var div1 = this.targetWindow.document.createElement("div");
    var div2 = this.targetWindow.document.createElement("div");
    var div3 = this.targetWindow.document.createElement("div");
    var div4 = this.targetWindow.document.createElement("div");
    var addCssText = function(obj, cssText, append){ //append:0覆盖原来的style值(默认)，1追加到原style值后  
        if (!obj) 
            return false;
        if (!isOpera) { //Opear不支持cssText属性设置  
            if (!append) {
                obj.style.cssText = cssText;
            }
            else {
                obj.style.cssText += cssText
            }
        }
        else {
            if (!append) {
                obj.setAttribute("style", cssText);
            }
            else {
                obj.setAttribute("style", obj.getAttribute("style") + ";" + cssText);
            }
        }
    }
    //定义阴影部分通用样式  
    var sCssText = "width:100%;height:100%;position:absolute;margin:0px;padding:0px;top:-1px;left:-1px";
    //定义三个阴影层的颜色及最外层位置（因为阴影向坐上偏移3个像素，所以要加上3）和高宽  
    addCssText(div1, "position:absolute;left:" + (objL + 3) + "px;top:" + (objT + 3) + "px;width:" + objWidth + "px;height:" + objHeight + "px;background:#eee");
    addCssText(div2, sCssText + ";background:#ddd");
    addCssText(div3, sCssText + ";background:#ccc");
    addCssText(div4, sCssText + ";background:#fff"); //白色背景层  
    if (isIE || isNS) { //IE||NS  
        addCssText(div1, ";z-index:-1", 1);
    }
    else { //FF||Netscape  
        /**
         //创建一个与原对象内容完全相同的对象并写入原位置
         var newNode=obj.cloneNode(true);
         newNode.removeAttribute("id");  //删除id属性，防止id冲突
         addCssText(newNode,"visibility:hidden",1);
         obj.parentNode.insertBefore(newNode,obj);
         //在非IE/NS中的Bug的解决办法（P标记默认在body范围内偏移，而body有时有margin）
         if(newNode.tagName=="P"){
         var BodyMargin=(document.documentElement.offsetHeight-document.body.offsetHeight)/2;
         objT=objT-BodyMargin;
         }
         **/
        //设定层的索引大于层默认值0  
        addCssText(obj, "position:absolute;z-index:2;left:+" + objL + "px;top:" + objT + "px", 1);
    }
    //创建阴影及内容  
    div1.appendChild(div2);
    div2.appendChild(div3);
    div3.appendChild(div4);
    
    var dd = this.targetWindow.document.createElement("div");
    dd.className = "mxt-window";
    dd.appendChild(div1);
    dd.appendChild(obj);
    this.element = dd;
}
//ipad滚动条问题
function initIpadScroll(id,height,width){
	if(v3x.isIpad){
		var oHtml = document.getElementById(id); 
		if(oHtml){
			if(height){
				oHtml.style.height = height+"px";
			}
			if(width){
				oHtml.style.width = width+"px";
			}
			oHtml.style.overflow = "auto";	
			touchScroll(id);
		}
	}
}
function initIe10AutoScroll(id, sub) {
  var mainObj=window.top.document.getElementById("main");
  var oHeight = mainObj!=null?mainObj.offsetHeight-sub: parseInt(window.top.document.body.offsetHeight) - sub;
  if (oHeight < 0) {
      return;
  }
  initIe10Scroll(id, oHeight);
  
}
//ie10滚动条问题
function initIe10Scroll(id, height, width) {
 // if (v3x.isMSIE10) {
      var oHtml = document.getElementById(id);
      if (oHtml) {
          if (height) {
              oHtml.style.height = height + "px";
          }
          if (width) {
              oHtml.style.width = width + "px";
          }
      }
 // }
}
//ff滚动条问题
function initFFScroll(id,height,width){
	if(v3x.isFirefox){
		var oHtml = document.getElementById(id); 
		if(oHtml){
			if(height){
				oHtml.style.height = height+"px";
			}
			if(width){
				oHtml.style.width = width+"px";
			}
			oHtml.style.overflow = "auto";	
		}
	}
}
//safaria滚动条问题
function initSafariScroll(id,height,width){
	if(v3x.isSafari){
		var oHtml = document.getElementById(id); 
		if(oHtml){
			if(height){
				oHtml.style.height = height+"px";
			}
			if(width){
				oHtml.style.width = width+"px";
			}
			oHtml.style.overflow = "auto";	
		}
	}
}
//chrome滚动条问题
function initChromeScroll(id,height,width){
	if(v3x.isChrome){
		var oHtml = document.getElementById(id); 
		if(oHtml){
			if(height){
				oHtml.style.height = height+"px";
			}
			if(width){
				oHtml.style.width = width+"px";
			}
			oHtml.style.overflow = "auto";	
		}
	}
}
function isTouchDevice(){
    try{
        document.createEvent("TouchEvent");
        return true;
    }catch(e){
        return false;
    }
}
function touchScroll(id){
    if(isTouchDevice()){ //if touch events exist...
        var el=document.getElementById(id);
        var scrollStartPos=0;
        var scrollStartPosX=0;
 
        el.addEventListener("touchstart", function(event) {
            scrollStartPos=this.scrollTop+event.touches[0].pageY;
            scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
            //event.preventDefault();
        },false);
 
        el.addEventListener("touchmove", function(event) {
        	this.scrollTop=scrollStartPos-event.touches[0].pageY;
        	this.scrollLeft=scrollStartPosX-event.touches[0].pageX;
            event.preventDefault();
        },false);
    }
}

/**
 * 是否为数字，不能以.结尾
 */
function isDecimal(value,inputName,integerDigits,decimalDigits){
	if(!testRegExp(value, "^-?[0-9]{0,"+(integerDigits?integerDigits:"")+"}\\.?[0-9]{1,"+(decimalDigits?decimalDigits:"")+"}$")){
		if(inputName)
			alert($.i18n("formValidate_isNumber", inputName));
		return false;
	}
	
	return true;
}
/**
 * 意见推送窗口
 * @param summaryId ：正文ID
 * @param isReplayedMemberId ： 被回复意见的人员ID
 */
function showPushWindow(summaryId){
	var edocType ="";
	var obj = document.getElementById("edocType");
	var pushMessageMemberIds = document.getElementById("pushMessageMemberIds");
	if(obj){
		edocType = obj.value;
	}
	var selected  =  document.getElementById("pushMessageMemberIds").value;
	var url = colWorkFlowURL + "?method=showPushWindow"
							 +"&summaryId="+summaryId
							 +"&edocType="+edocType
							 +"&sel="+encodeURIat(selected);
	var replyedAffairId = document.getElementById("replyedAffairId");
	
	if(replyedAffairId!=null && typeof(replyedAffairId)!='undefined'){
		url+="&replyedAffairId="+replyedAffairId.value;
	}
	var ret = v3x.openWindow({
	        url: url,
	        height:350,
	        width:300
	    });
	if(typeof(ret) != 'undefined' && ret != null){ 
	  //直接取消的时候返回undefined。没有选择点确定的时候返回为空
	  var memberIds = ret[0];
	  var memberNames = ret[1];
	  document.getElementById("pushMessageMemberIds").value = memberIds;
	  var pushMessageMemberNames  = document.getElementById("pushMessageMemberNames");
	  if(pushMessageMemberNames && replyedAffairId != replyedAffairId.value){
		  pushMessageMemberNames.value = memberNames;
		  pushMessageMemberNames.title = memberNames;
	  }
	}
}

/**
 * 旧的发送消息窗口, 用于人员卡片上的发送消息等(弹出式窗口)
 */
function sendMessageForCard(getData, ids){
	var url;
	if(getData){
		url = "/seeyon/message.do?method=showSendDlg&getData=fromParent";
	}else{
		url = "/seeyon/message.do?method=showSendDlg&receiverIds=" + ids;
	}
	
	v3x.openWindow({
		url: url,
		width : "440",
		height : "300"
	});
}

/**
 * 发送消息, 弹出IM聊天窗口
 */
function sendMessageForIMTab(id, name) {
	if(!getA8Top().contentFrame.topFrame.onlineWin){
		var left = 50;
		var top = (window.screen.availHeight - 600) / 2;
		
		getA8Top().contentFrame.topFrame.onlineWin = getA8Top().contentFrame.topFrame.open("/seeyon/message.do?method=showOnlineUser&id=" + id + "&name=" + name, "", 
			"left=" + left + ",top=" + top + ",width=600,height=600,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no");
	}else{
		getA8Top().contentFrame.topFrame.onlineWin.focus();
		getA8Top().contentFrame.topFrame.onlineWin.showIMTab("1", id, name, "false");
	}
}

/**
 * 其它模块转发协同操作：公用接口
 */
function forwardColV3X(summaryId, affairId, forwardType){
	var rv = v3x.openWindow({
        url : "/seeyon/collaboration.do?method=showForward&showType=model&data=" + summaryId + "_" + affairId,
        width : 360,
	    height : 420
	});
	
	if(forwardType == "self"){//后边按钮直接转发协同
		if(rv == "true"){
			document.location.reload(true);
		}
	}else if(forwardType == "list"){//列表下菜单中转发协同
		if(rv && rv == "true" && (getParameter("method") == "listSent")){
    		document.location.reload(true);
   		}
	}
}

/**
 * 查看处理明细及流程日志
 */
function showDetailAndLog(summaryId, processId, defaultTab, _appEnumStr){
	var queryParamsAboutApp = "";
	if (_appEnumStr && (_appEnumStr == 'recEdoc' || _appEnumStr == 'sendEdoc'|| _appEnumStr == 'signReport' || 
			_appEnumStr == 'edocSend' || _appEnumStr == 'edocRec' || _appEnumStr == 'edocSign' 
		)) {
		queryParamsAboutApp = "&appName=4&appTypeName="+_appEnumStr;
	}
	getA8Top().v3x.openWindow({
        url: colWorkFlowURL + "?method=showFlowNodeDetailFrame&summaryId=" + summaryId + "&processId=" + processId + "&defaultTab=" + defaultTab + queryParamsAboutApp,
        dialogType : v3x.getBrowserFlag('openWindow') == true ? "modal" : "1",
        width: "750",
        height: "500"
    });
}
function confirmToOffice2003(){
	if(confirm(_("V3XLang.OfficeSaveTo2003"))){
		return true;
	}else{
		return false;
	}
}
function isOffice2007(filename){
	if(typeof(filename) == 'undefined' || filename == null) return false;
	if(filename.indexOf(".docx")!=-1
		|| filename.indexOf(".xlsx")!=-1 
		|| filename.indexOf(".pptx")!=-1){
		return true;
	}else{
		return false;
	}
}
function V3XAutocomplete(){
	this._disableEvent = false;
	this._onchange = function (options,val,inputName,view){
		if(v3xautocomplete._disableEvent){
			return;
		}
		if(options){
			if(options.select){
				var item = {label:val.value,value:val.id};
				options.select(item,inputName);
			}
			if(options.bindSelect){
				var e = jQuery.Event("change");
				if(jQuery.isFunction(options.bindSelect)){
					e.target = options.bindSelect(jQuery( view ));
				}else{
					e.target = jQuery(options.bindSelect);
				}
				try{
					jQuery(e.target).val(val.id).trigger(e,jQuery(e.target));
					jQuery(e.target).blur();
				}catch(e){
				}
			}
		}
	};
	// 取得用于展现的Input对象，同时支持传入名称和对象。
	this._getViewElement = function (inputName){
		var view;
		if(typeof inputName == 'string'){
			// 为了绕过jquery的: selector,必须使用getElementById
			view = jQuery( document.getElementById(inputName + '_autocomplete') );
		}else{
			view = jQuery(inputName);
		}
		return view;
	}
};
var v3xautocomplete = new V3XAutocomplete();
/**
 * 为指定的input生成autocomplete自动下拉搜索。
 * inputName为type为hidden的input，如果传入的inputName为String，必须存在一个名称为inputName+'_autocomplete'的type为text的input。
 * 如果传入值为对象，则直接将传入的Input渲染为autocomplete。
 * 输入数据格式为[ { value:"010", label:"Beijing北京"}, { value:"020", label:"guangzhou广州" }, { value:"021",label:"shanghai上海"} ];
 * 用户录入根据label值进行匹配。选择后对应项目的value值设置到id为inputName的input的value域。
 * 支持事件，可以这样调用：v3xautocomplete.autocomplete('myinput',data,{select:function(item,inputName){alert(item.label +':' + item.value);},value:'010',appendBlank:false});
 * 参数说明:
 * select：		可以自定义选项改变以后的动作。
 * button：		是否显示Dropdown button,缺省为false。
 * maxHeight:	下拉列表框最大高度，超过此高度显示滚动条，缺省为300。
 * width:		下拉列表框宽度，如未设置，则自动适应文本框宽度。
 * autoSize:	根据数据项的字数,自适应下拉宽度,缺省为false,根据文本框宽度适应
 * appendBlank:	追加空选项数据,缺省为true,追加。
 * bindSelect：	可以绑定联动的select，当autocomplete改变时自动根据选择更新联动select的值。
 * 该参数可以直接传入所绑定的select对象,也可以传入根据当前autocomplete查找select对象的算法。
 * 支持绑定input，可以这样调用：v3xautocomplete.autocomplete('myinput',data,{bindSelect:function(ac){return jQuery(ac).parent().find('select')[0];// 当前autocomplete的容器中第一个select}});
 **/
V3XAutocomplete.prototype.autocomplete = function(inputName,data,options){
	var view = this._getViewElement(inputName);
	if (typeof(view) == 'undefined' || view == null || view[0] == null)
		return ;
	if(!view){
		return false;
	}
	// 追加空选项
	var appendBlank = true;
	// 显示下拉Button
	var showButton = true;
	// 下拉高度
	var maxHeight = 240;
	// 下拉宽度,不设置则自适应
	var width = 0;
	// 自动根据字数设置下拉宽度
	var autosize = false;
	// 记录所有数据项文本的字数
	var maxLen = 0;
	var nullItem = {id:'',value:''};
	var buttonWidth = 17;
	var isNull = data.length==0;
	if(!isNull && data.length ==1 && data[0].value=='') isNull = true;
	if(options){
		// 缓存,4 select
		jQuery(view).data('options',options);
		if(options.button !== undefined) showButton = true;
		if(options.maxHeight !== undefined) maxHeight = options.maxHeight;
		if(options.width !== undefined) width = options.width;
		if(options.autoSize !== undefined) autosize = options.autosize;
		if(options.appendBlank !== undefined) appendBlank = options.appendBlank;
	}

	// 转换数组 为适应jquery,将value改为id,label改为value
	var src = new Array();
	var l = data == null ? src : data;
	if(l.length>0){
		if(appendBlank){
			src.push(nullItem);
		}
		jQuery.each(l,function(i,val){
			var item = {id:val.value,value:val.label};
			if(item.value){
				src.push(item);
				var len = item.value.length;
				if(len>maxLen) maxLen = len; 
			}
		});
	}
	var isExist = function (val){
		for(var i in src){
			var item = src[i];
			// 完全匹配才判为存在,避免同id不同value不清除
			if(item.id == val.id && item.value == val.value ){
				return true;
			}
		}
		return false;
	}

	var lastSelected = jQuery(view).data('current');
	jQuery(view).data('current',null);

	var onSelectItem = function( event, ui ) {
		if(!ui.item) return false;

		jQuery( document.getElementById(inputName) ).val( ui.item.id );
		jQuery(view).val( ui.item.value );
		// 缓存当前选中项
		jQuery(view).data('current',ui.item);
		onchange(options,ui.item,inputName,view);
		return false;
	};
	var clearValue = function(){
		// 清空值,并触发onchange
		onSelectItem(null,{item:nullItem});
		jQuery(view).data('current',null);
	};
	if(showButton){
		var hasButton = view.next('button[name="acToggle"]').length>0;
		if(!hasButton){
			var style = "background-image:url('common/images/desc.gif');background-repeat:no-repeat;background-color: #ececec;background-position:center;width:"+buttonWidth+"px;height:21px;border:1px #d1d1d1 solid;";
			view.after('<button name="acToggle" tabindex="-1" onclick="v3xautocomplete.toggle(this.previousSibling);this.blur();" style="'+style+'"/>');
		}
	}
	var onchange = this._onchange;
	// 无匹配项恢复当前选中项
	jQuery(view).bind('blur',function(){
		var current = jQuery(view).data('current');
		if(current){
			if(jQuery(view).val()!= current.value ){
				jQuery(view).val(current.value);
			}
		}else{
			clearValue();
		}
	});
	// 鼠标点击获得焦点选中文本
	jQuery(view).bind('click',function(){
		this.select();
	});
	view.autocomplete({
		minLength: 0,
		source:src,
		autoFocus: true,
		delay: 0,
		focus: function( event, ui ) {
			//this.select();
			return false;
		},
		position: { collision:'flip'},
		//change: onSelectItem,
		select: onSelectItem,
		search: function(){
			var ui = jQuery(this).autocomplete("widget");
			ui.css('height','auto');
		},
		beforePosition: function(){
			var ui = jQuery(this).autocomplete("widget");
			// 调整高度
			if(ui.outerHeight() > maxHeight){
				// scroll
				ui.css('overflow-y', 'auto');
				ui.css('overflow-x', 'hidden');
				ui.css('height',maxHeight+'px');
			}
		},
		open: function() { 
			var ui = jQuery(this).autocomplete("widget");
			// 调整宽度
			var w;
			if(autosize){
				// 根据数据项自适应宽度
				w = maxLen * 8 + 20;
			}else{
				if(width){
					w = width;
				}else{
					w = jQuery(this).outerWidth();
					if(showButton){ 
						var buttonTop = view.next('button[name="acToggle"]').position().top;
						var buttonWrap = (buttonTop >= (view.position().top + view.outerHeight()));
						if(!buttonWrap) w += buttonWidth;
					}
				}
			}
			// 避免太极端的值
			var viewWidth = view.outerWidth();
			if(w < 120) w = 120;
			if(w<0 || (w > 500 && w > (viewWidth + buttonWidth))) w = 300;
			ui.width(w);

			// 不换行,超出宽度隐藏
			ui.find('.ui-menu-item').css('overflow','hidden').css('white-space','nowrap');
			ui.find("li").each(function(i,item){
				item.title = item.innerText;
			});
			// 滚动则隐藏,避免父容器height:100% + overflow:auto 时下拉面板不跟随滚动
			jQuery(view.parents()).scroll(function() {
				ui.css('display','none');
			});
			// jQuery ui flip模式top校正
			var uiTop = ui.position().top;
			var uiHeight = ui.outerHeight();
			var inputTop = view.position().top;
			var viewHeight = view.outerHeight();
			if(uiTop<0){
				uiTop = 0;
				if(uiHeight<inputTop){
					uiTop = inputTop - uiHeight;
				}
				uiHeight = inputTop-uiTop;
				ui.css('top',uiTop +'px');
				ui.css('height',uiHeight +'px');
			}
			// 飘在上方
			if(uiTop+uiHeight<inputTop){
				uiTop = inputTop - uiHeight;
				ui.css('top',uiTop +'px');
			}
			// 遮住了Input
			if(uiTop+uiHeight>inputTop+viewHeight){
				uiTop = inputTop + viewHeight;
				ui.css('top',uiTop +'px');
			}
			ui.css('left',view.position().left + 'px');
		}
	});
	var isLastExist = false;
	// 检查上一个autocomplete是否有选中值
	if(lastSelected!=null){
		//上一次选择为当前数据中的值不清除
		isLastExist = isExist(lastSelected);
		if(!isLastExist)clearValue();
	}

	// 无数据项则清空并停用
	if(isNull){
		clearValue();
		view[0].disabled = true;
		if(showButton) view.next('button[name="acToggle"]').attr('disabled', true).css('opacity', '0.4');
	}else{
		view[0].disabled = false;
		if(showButton) view.next('button[name="acToggle"]').attr('disabled', false).css('opacity', '1');
		if(options && (options.value||options.value==null)){
			var value = options.value;
			var isExist = false;
			if(value!=null){
				jQuery.each(src,function(i,val){
					if(val.id==value ){
						isExist = true;
						return ;
					}				
				});
			}
			// 初始化设置的值不存在则清空值
			if(isExist){
				if(typeof inputName == 'string'){
					this.select(inputName,value);
				}else{
					this.select(view,value);
				}
			}else{
				if(!isLastExist){
					clearValue();
				}else{
					// 恢复last
					jQuery(view).data('current',lastSelected);
				}
			}
		}else{
			if(jQuery(view).val()){
				clearValue();
			}
		}
	}
}		
/**
 * 选中指定值，如果值未找到则无动作
 **/
V3XAutocomplete.prototype.select = function(inputName,value){
	var view = this._getViewElement(inputName);
	var source = view.autocomplete("option",'source');
	if(!source) return false;

	var options = jQuery(view).data('options');
	var onchange = this._onchange;
	jQuery.each(source, function(i, val) {
		if(val.id==value){
			jQuery(document.getElementById(inputName)).val(val.id);
			view.val(val.value);
			// 缓存当前选中项
			jQuery(view).data('current',val);
			onchange(options,val,inputName,view);
			return true;
		}
	});
}
/**
 * 刷新Autocomplete,触发相应的事件.
 **/
V3XAutocomplete.prototype.refresh = function(inputName){
	var view = this._getViewElement(inputName);
	var current = jQuery(view).data('current');
	if(current){
		this._disableEvent = true;
		this.select(view,current.id);
		this._disableEvent = false;
	}
}
V3XAutocomplete.prototype.disableEvent = function (v){
	this._disableEvent = v;
}
V3XAutocomplete.prototype.getData = function(inputName){
	var view = this._getViewElement(inputName);
	var src = view.autocomplete('option','source');
	// 转换数组 为适应jquery,将value改为id,label改为value
	var data = new Array();;
	jQuery.each(src,function(i,val){
		var item = {value:val.id,label:val.value};
		if(item.value)data.push(item);
	});
	return data;
}
/**
 * 复制src Autocomplete到target,复制范围包括数据和绑定事件等参数.
 **/
V3XAutocomplete.prototype.copy = function(src,target){
	var view = this._getViewElement(src);
	var source = view.autocomplete('option','source');
	// 转换数组 为适应jquery,将value改为id,label改为value
	var data = new Array();;
	jQuery.each(source,function(i,val){
		var item = {value:val.id,label:val.value};
		if(item.value)data.push(item);
	});
	
	var options = jQuery(view).data('options');
	try{
		if(jQuery.expando){
			jQuery(target).removeAttr( jQuery.expando );
		}
	}catch(e){
	}
	var value = jQuery(view).data('current');
	if(value){
		options.value = value.id;
	}
	this.autocomplete(target,data,options);

}
/**
 * 切换autocomplete的下拉状态。
 **/
V3XAutocomplete.prototype.toggle = function(inputName){
	var view = this._getViewElement(inputName);
    if ( view.autocomplete( 'widget' ).is( ':visible' ) ) {
        view.autocomplete( 'close' );
        return;
    }
    //jQuery( 'btn_' + inputName + '_autocomplete').blur();
    view.autocomplete( 'search', '' );
    view.focus();
}
/**
 * 生成autocomplete所需的input html代码。
 */
V3XAutocomplete.prototype.build = function(inputName,data){
    function buildHtmlAttributes( attributes){
    	var html = new Array();; 
		jQuery.each(attributes,function(i,entry){
			if(entry.key)
			html.push(entry.key,'="',entry.value,'" ');
		});
    	return html.join('');
    }
	var html = new Array();
	// 生成两个input和一个dropdown button
	var inputDisplayName = inputName + '_autocomplete';
	html.push("<input ",buildHtmlAttributes([{key:"name", value:inputName},{key:"id", value:inputName},{key:"type", value:"hidden"}])," />");
	html.push("<input ",buildHtmlAttributes([{key:"name", value:inputDisplayName},
	                                         {key:"id", value:inputDisplayName},
	                                         {key:"type", value:"text"},
	                                         {key:"class", value:"input_autocomplete"},
	                                         {key:"onclick",value:"v3xautocomplete.toggle('" + inputName + "');"}]),
	                                         " />\n");

	// 生成脚本，调用js autocomplete组件，初始化input。
	html.push("<script>\n");

	html.push("v3xautocomplete.autocomplete(","'",inputName,"',",data,");\n");
	html.push('</script>');

	return( html.join('') );

}


//////以下为首页做查询统计穿透功能//////////
var postUrl ='';
function getQueryCondition(row, col ,len){
	var reportTable = document.getElementById("ftable");//取得统计表
	var firstTr = reportTable.rows[0];//取得统计表的第一行
	var rowHeadCount = len;
	var bCrossTable = isCrossTable();
	//如果是交叉报表需要得到行头和列头的值
	if(bCrossTable){
		rowHeadCount = 0;
		var colSpan; 
		var firstTrCellsLength = firstTr.cells.length//第一行单元格个数
		for(var i = 0; i < firstTrCellsLength; i++){
			var ftd = firstTr.cells[i];
			if(ftd.getAttribute("rowspan") == "2")
				rowHeadCount++;//行头数+1
			
			if(ftd.getAttribute("colspan") != null)
			 	colSpan = parseInt(ftd.getAttribute("colspan"));
			
		}
	}
	if(col > (rowHeadCount - 1)){
		var str = "";
		for(var i = 0; i < rowHeadCount; i++){
			str += getRowHead(i, row) + ",";
		}
		
		if(bCrossTable){
			str += getColHead(rowHeadCount, colSpan, col) + ",";
			str += getCrossDataCol(rowHeadCount, col) + ",";
		}else{
			str += getDataCol(col) + ",";
		}
		var showdetail = document.all("showdetail").value;
		postUrl ="/seeyon/formreport.do?method=showReportQuery&str=" + encodeURIComponent(str);
		
		
		var width = screen.width - 155;
		var height = screen.height - 300;
		
		v3x.openWindow({
        url: "/seeyon/formreport.do?method=openShowReportQuery",
        workSpace: 'yes',
        dialogType: "modal",
        resizable: false
		});
		return;
	}
}
function getSummaryId(url){
	var requestCaller = new XMLHttpRequestCaller(null, "", "", false, "GET", "false", url);
	var rs = requestCaller.serviceRequest();
	return rs;
}
function showQueryTable(selrownumber){
 var showdetail = document.getElementById("showdetail").value;
 var formname = document.getElementById("formname").value;
 var formid = document.getElementById("formid").value;
 var queryname = document.getElementById("queryname").value;
 var isFlow = document.getElementById("isFlow").value;
 if(isFlow == "true"){
	 var url="/seeyon/formquery.do?method=hasSummaryId&id="+selrownumber+"&showdetail="+encodeURIComponent(showdetail)+"&formid="+formid+"&formname="+formname;
	 var strSummaryId = getSummaryId(url);
	 if(strSummaryId.trim() == "null"){
	 	alert(v3x.getMessage("formLang.formquery__selectnone"));
	 }else{
	    if(strSummaryId.indexOf("|") >-1){
	        url = "/seeyon/formquery.do?method=collFrameViewRelate&summaryId="+strSummaryId+"&showdetail="+encodeURIComponent(showdetail)+"&appid="+formid+"&queryname="+encodeURIComponent(queryname);
	 	    v3x.openWindow({url: url, workSpace: 'yes',dialogType:v3x.getBrowserFlag('pageBreak')?'modal':'open'});
	    }else{
	    	url = "/seeyon/formquery.do?method=showRecordDetail&summaryId="+strSummaryId+"&showdetail="+encodeURIComponent(showdetail)+"&appid="+formid+"&queryname="+encodeURIComponent(queryname);
	 	    v3x.openWindow({url: url, workSpace: 'yes',dialogType:v3x.getBrowserFlag('pageBreak')?'modal':'open'});
	    }
	 }
 }
 else if(isFlow == "false"){
	 var appShowDetail = document.getElementById("appShowDetail").value;
	 v3x.openWindow({
		url :"/seeyon/appFormController.do?method=viewFormData&isOpenWin=true&appformId="+formid+"&masterId="+selrownumber+"&showDetail="+encodeURIComponent(appShowDetail),
		dialogType: "modal",
		workSpace: 'yes',
		resizable : "true"
	});
 }
 
}

function isCrossTable(){//是否是交叉报表
	var reportTable = document.getElementById("ftable");//取得统计表
	var firstTr = reportTable.rows[0];//取得统计表的第一行
	var firstTrCellsLength = firstTr.cells.length;//第一行单元格个数
	for(var i = 0; i < firstTrCellsLength; i++){
		var ftd = firstTr.cells[i];
		if(ftd.getAttribute("rowspan") == "2"){
			 return true;//是交叉报表
		}
	}
	return false;
}

/*
	rowHeadCount 行头数
	colspan      数据列列数
	col          当前点中的数据的列数
*/
function getColHead(rowHeadCount, colSpan, col){
	var reportTable = document.getElementById("ftable");//取得统计表
	var firstTr = reportTable.rows[0];//取得统计表的第一行
	return firstTr.cells[Math.floor((col - rowHeadCount) / colSpan) + rowHeadCount].getAttribute("value");  
}

/*
	得到交叉统计报表数据列
	rowHeadCount 行头数
	col          当前点中的数据的列数
*/
function getCrossDataCol(rowHeadCount, col){
	//var secondTr = reportTable.rows[1];
	var reportTable = document.getElementById("ftable");//取得统计表
	return reportTable.rows[1].cells[col - rowHeadCount].getAttribute("value");
}

/*
	得到普通报表的数据列
*/
function getDataCol(col){
	var reportTable = document.getElementById("ftable");//取得统计表
	return reportTable.rows[0].cells[col].getAttribute("value");
}

function getRowHead(rowHeadCount, row){
	var reportTable = document.getElementById("ftable");//取得统计表
	return reportTable.rows[row].cells[rowHeadCount].getAttribute("value");
}

/**
 * 新建计划
 */
function newPlan(url, type, time){
	getA8Top().contentFrame.mainFrame.location.href = url + "?method=initAdd&type=" + type + "&time=" + time;
}

/**
 * 新建任务
 */
function newTask(url, time) {
	var ret = v3x.openWindow({
		url     	: url + "?method=addTaskPageFrame&from=timing&time=" + time,
		width   	: 530,
		height  	: 480,
		resizable	: false
	});
	
	if(ret || ret == 'true') {
		window.location.href = window.location.href;
	}
}

/**
 * 新建日程
 */
function newCal(url, time){
	var ret = v3x.openWindow({
		url			: url + "?method=createEvent&time=" + time,
		width		: 530,
		height		: 480,
        resizable	: false
	});
	
	if(ret && ret=='true'){
		window.location.href = window.location.href;
	}
}

/**
 * 新建会议
 */
function newMeeting(url, time){
	getA8Top().contentFrame.mainFrame.location.href = url + "?method=create&formOper=new&time=" + time;
}
/**
 * 判断左侧面板是否关闭
 */
function isLeftClose(){
	return  getA8Top().contentFrame.document.getElementById("LeftRightFrameSet").cols == "142,*";
}

/**
 * 清除当前位置。
 */
function resetCtpLocation(){
  var top = getA8Top();
  if(top){
    top.showLocation('');
  }
}

//打开正文编辑器插入的关联
function openEditorAssociate(id,mimeType,description,reference,category,createDate,filename,v){
	function getContextPath(){
	    if(v3x){
	      return v3x.baseURL ? v3x.baseURL: parent._ctxPath;
	    }
	    return '/seeyon';       
	}		
    var url;
    var isDownload = false;
    var moduleId = document.getElementById('moduleId');
    if(moduleId!=null){
    	reference =  moduleId.value;
    }else if(typeof(summary_id)!==undefined  &&  (typeof(summary_id)!=='undefined')){
		reference = summary_id;
    }if(typeof(_baseObjectId)!==undefined  &&  (typeof(_baseObjectId)!=='undefined')){
		reference = _baseObjectId;
    }
    var moduleType = document.getElementById('moduleType');
    if(moduleType!=null){
    	category = moduleType.value;
    }else if(typeof(_baseApp)!==undefined  &&  (typeof(_baseApp)!=='undefined')){
		category = _baseApp;
    }
    if(mimeType == "collaboration"){
        url = "collaboration/collaboration.do?method=summary&openFrom=glwd&type=&affairId="+ description +"&baseObjectId=" + reference +"&baseApp="+ category;
    }
    else if(mimeType == "edoc"){
        url = "/edocController.do?method=detailIFrame&from=Done&openFrom=glwd&affairId=" + description + "&isQuote=true&baseObjectId=" + reference +"&baseApp=4";//+ category;
    }
    else if(mimeType == "km"){
        url = "doc.do?method=docOpenIframeOnlyId&openFrom=glwd&docResId=" + description + "&baseObjectId=" + reference +"&baseApp="+ category ;
    }
    else if(mimeType == "meeting") {
        url = "mtMeeting.do?method=myDetailFrame&id=" + description + "&isQuote=true&baseObjectId=" + reference +"&baseApp="+ category + "&state=10";
    }else{
    	isDownload = true;
        url = 'fileUpload.do?method=download&fileId='+id+'&createDate='+createDate.substring(0, 10)+'&filename='+encodeURI(filename)+'&v='+v;
    }
    url = url + '&fromEditor=1';
    url = getContextPath() + '/' + url;
    if(isDownload){
   		var downloadFileFrame = document.getElementById('downloadFileFrame');
   		if(downloadFileFrame){
   			downloadFileFrame.src = url;
   		}else{
   			window.open(url,'_blank');
   		}
    }else{
 		openDetailURL(url);
	}
}
function closeAllDialog(tw){
  var targetWindow = window; 
  if(tw){
    targetWindow = tw;
  }
  targetWindow.$('.mask').remove();
  targetWindow.$('.dialog_box').remove();
  targetWindow.$('.shield').remove();
  targetWindow.$('.mxt-window').remove();
}