/**
*
*公共js 封装  （map，Arraylsit）
*/
function ArrayList(){
    this.instance = new Array();
}

ArrayList.prototype.size = function(){
    return this.instance.length;
}
/**
 * 在末尾追加一个
 */
ArrayList.prototype.add = function(o){
    this.instance[this.instance.length] = o;
}
/**
 * 当list中不存在该对象时才添加
 */
ArrayList.prototype.addSingle = function(o){
    if(!this.contains(o)){
        this.instance[this.instance.length] = o;
    }
}
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
}

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
}

/**
 * 追加一个List在队尾
 */
ArrayList.prototype.addList = function(list){
    if(list && list instanceof ArrayList && !list.isEmpty()){
        this.instance = this.instance.concat(list.instance);
    }
}

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
}

/**
 * 最后一个
 */
ArrayList.prototype.getLast = function(){
    if(this.size() < 1){
        return null;
    }

    return this.instance[this.size() - 1];
}

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
}

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
}
/**
 * Removes the element in this list.
 */
ArrayList.prototype.remove = function(o){
    var index = this.indexOf(o);
    this.removeElementAt(index);
}
/**
 * @return <tt>true</tt> if this list contains the specified element.
 */
ArrayList.prototype.contains = function(o, comparatorProperies){
    return this.indexOf(o, comparatorProperies) > -1;
}
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
}
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
}

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
}
/**
 * Returns an array containing all of the elements in this list in the correct order;
 *
 * @return Array
 */
ArrayList.prototype.toArray = function(){
    return this.instance;
}

/**
 * Tests if this list has no elements.
 *
 * @return <tt>true</tt> if this list has no elements;
 */
ArrayList.prototype.isEmpty = function(){
    return this.size() == 0;
}
/**
 * Removes all of the elements from this list.  The list will
 * be empty after this call returns.
 */
ArrayList.prototype.clear = function(){
    this.instance = new Array();
}
/** 
 * show all elements
 */
ArrayList.prototype.toString = function(sep){
    sep = sep || ", ";
    return this.instance.join(sep);
}
function Properties(jsProps){
    this.instanceKeys = new ArrayList();
    this.instance = {};
    
    if(jsProps){
        this.instance = jsProps;
        for(var i in jsProps){
            this.instanceKeys.add(i);
        }
    }
}
/**
 * Returns the number of keys in this Properties.
 * @return int
 */
Properties.prototype.size = function(){
  return this.instanceKeys.size();
}

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
}
/**
 * Removes the key (and its corresponding value) from this 
 * Properties. This method does nothing if the key is not in the Properties.
 */
Properties.prototype.remove = function(key){
    if(key == null){
        return null;
    }
    this.instanceKeys.remove(key);
    delete this.instance[key]
}
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
}


/**
 * Tests if the specified object is a key in this Properties.
 * @return boolean
 */
Properties.prototype.containsKey = function(key){
    if(key == null){
        return false;
    }
    
    return this.instance[key] != null;
}

/**
 * Returns an ArrayList of the keys in this Properties.
 * @return ArrayList
 */
Properties.prototype.keys = function(){
     return this.instanceKeys;
}

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
}

/**
 * Tests if this Properties maps no keys to values.
 * @return boolean
 */
Properties.prototype.isEmpty = function(){
    return this.instanceKeys.isEmpty();
}

/**
 * Clears this Properties so that it contains no keys. 
 */
Properties.prototype.clear = function(){
    this.instanceKeys.clear();
    this.instance = {};
}

/**
 * 对ArrayList快速排序
 * ty
 * @param list 要排序的ArrayList
 * @param comparatorProperies 对数据中元素的某个属性值作为排序依据
 */
function QuickSortArrayList(list, comparatorProperies) {
	QuickSortArray(list.toArray(), comparatorProperies);
}

function QuickSortArrayListAsc(list, comparatorProperies) {
	QuickSortArrayAsc(list.toArray(), comparatorProperies);
}

function QuickSortArrayAscArray(list, comparatorProperies) {
	QuickSortArrayByAsc(list, comparatorProperies);
}

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
}

function QuickSortArrayAsc(arr, comparatorProperies) {
	if(comparatorProperies){
		arr.sort(function(o1, o2){
			return o1[comparatorProperies] > o2[comparatorProperies] ? -1 : (o1[comparatorProperies] == o2[comparatorProperies] ? 0 : 1);
		});
	}
	else{
		arr.sort();
	}
}
//IP排序方法
function QuickSortArrayByAsc(arr, comparatorProperies) {
		arr.sort(function(o1, o2){
			if(!o1.toptime){
				if(o1[comparatorProperies] > o2[comparatorProperies]){
					return 1;
				}else{
					return 0;
				}
			}else{
				if(o1[comparatorProperies] < o2[comparatorProperies]){
					return 1;
				}
				return -1;
			}
		});
	
}
/**
 * 显示错误提示
 * 
 * @param obj 需要提示的表单控件 jquery对象
 * @param title 需要提示的语言
 */
function showErrorTitle (obj,title) {
	var titleDiv = $("#" +obj.attr("id")+"_poptip");
	if (titleDiv.length > 0) { 
		titleDiv.text(title);
		if (title != '' && title.length > 0) { 
			obj.css("border","1px solid red");
			titleDiv.parent().show();
		} else {
			obj.css("border","1px solid #b9c4c9");
			titleDiv.parent().hide();
		}
	}
}

String.prototype.getLimitLength = function(maxlengh, symbol) {
    if(!maxlengh || maxlengh < 0){
        return this;
    }
    var len = this.getBytesLength();
    if(len <= maxlengh){
        return this;
    }
    
    symbol = symbol == null ? ".." : symbol;

    var a = 0; 
    var temp = ''; 

    for (var i = 0; i < this.length; i++)    { 
/*        if (this.charCodeAt(i) > 255) a += 2; 
        else a++; */
     a++;
     	
        temp += this.charAt(i);
        if(a >= maxlengh) {
            return temp + symbol;
        }
    } 

    return this; 
};

String.prototype.escapeHTML = function(isEscapeSpace){
    try{
        return escapeStringToHTML(this, isEscapeSpace);
    }
    catch(e){}
    
    return this;
};

String.prototype.escapeJavascript = function(){
    return escapeStringToJavascript(this);
};

/**
 * 去掉空格
 */
// String.prototype.trim = function(){
//     var chs = this.toCharArray();
    
//     var st = 0;
//     var off = chs.length;
    
//     for(var i = 0; i < chs.length; i++){
//         var c = chs[i];
//         if(c == ' '){
//             st++;
//         }
//         else{
//             break;
//         }
//     }
    
//     if(st == this.length){
//         return "";
//     }
    
//     for(var i = chs.length; i > 0; i--){
//         var c = chs[i-1];
//         if(c == ' '){
//             off--;
//         }
//         else{
//             break;
//         }
//     }
        
//     return this.substring(st, off);
// };

String.prototype.getBytesLength = function() {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
};

function escapeStringToHTML(str, isEscapeSpace){
    if(!str){
        return "";
    }
    
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/\r/g, ""); 
    str = str.replace(/\n/g, "<br/>"); 
    str = str.replace(/\'/g, "&#039;");
    str = str.replace(/"/g, "&#034;");
    
    if(typeof(isEscapeSpace) != 'undefined' && (isEscapeSpace == true || isEscapeSpace == "true")){
        str = str.replace(/ /g, "&nbsp;");
    }
    
    return str;
}
/****************request***************************/
var theRequest = new Object();

theRequest.getParameter = function (key) {
   		return this[key];
}
theRequest.getOsVersion = function () { 
	return window.navigator.userAgent;
}
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}



function UrlDecode(zipStr){  
     var uzipStr="";  
     for(var i=0;i<zipStr.length;i++){  
         var chr = zipStr.charAt(i);  
         if(chr == "+"){  
             uzipStr+=" ";  
         }else if(chr=="%"){  
             var asc = zipStr.substring(i+1,i+3);  
             if(parseInt("0x"+asc)>0x7f){  
                 uzipStr+=decodeURI("%"+asc.toString()+zipStr.substring(i+3,i+9).toString());  
                 i+=8;  
             }else{  
                 uzipStr+=AsciiToString(parseInt("0x"+asc));  
                 i+=2;  
             }  
         }else{  
             uzipStr+= chr;  
         }  
     }  
   
     return uzipStr;  
 }  
   
 function StringToAscii(str){  
     return str.charCodeAt(0).toString(16);  
 }  
 function AsciiToString(asccode){  
     return String.fromCharCode(asccode);  
 }
 
function parseDateTime(date) {
    if (!date) {
        date = new Date();
    }

	var str = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
	str += ":";
	str += (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
	str += ":";
	str += (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    
    return str;
}
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
