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
/**
 * 字符串转dom对象
 * @param arg
 * @returns {NodeList}
 */
function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    var obj = [];
    for(var i = 0;i < objE.childNodes.length;i++){
    	if(objE.childNodes[i].nodeType == 1){
    		obj.push(objE.childNodes[i]);
    	}
    }
    return obj;
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
	}
}

// 返回上一页
function back(id) {
	_$(id).addEventListener("tap", function(){
		cmp.href.back();
	});
}
//获取url中"?"符后的参数
function GetParams() { 
	var url = location.search; 
	var params = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); 
		} 
	} 
	return params; 
} 
/**
 * 批量取人员name
 *
 */
function getPeopleNameList(memberIdList,successFuc) {
    $s.Addressbook.getAvatarImage("", memberIdList, {
        success: function (personInfo) {
            successFuc(personInfo);
        },
        error: function (error) {
        	console.log(error);
        }
    });
}
function showPeoName(memberIdList, callback){
	getPeopleNameList(memberIdList,function (imgMap) {
		var listArr = [];
	    for(var imgKey in imgMap){
	        for(var headId in imgMap[imgKey]){
	            var nameDom = document.getElementById("n_" + headId);
	            if(nameDom){
                    nameDom.innerHTML = imgMap[imgKey][headId].name;
                }
                listArr.push({'id':headId,'name':imgMap[imgKey][headId].name});
	        }
	    }
	    callback && callback(listArr);
	});
}
// 根据文件类型，展现文档图标
function showDocIcon(docType){
	switch(docType){
		case "doc":
		  	return "doc";
		case "docx":
		  	return "doc";
		case "xls":
		  	return "xls";
		case "xlsx":
		  	return "xls";
		case "ppt":
		  	return "ppt";
		case "pptx":
		  	return "ppt";
		case "ppsx":
		  	return "ppt";
		case "pdf":
			return "pdf";
		case "cvs":
			return "cvs";
		case "et":
			return "et";
		case "bmp":
			return "img";
		case "gif":
			return "img";
		case "jpeg":
			return "img";
		case "jpg":
			return "img";
		case "tiff":
			return "img";
		case "png":
			return "img";
		case "mp3":
			return "music";
		case "wav":
			return "music";
		case "wma":
			return "music";
		case "ape":
			return "music";
		case "avi":
			return "video";
		case "rmvb":
			return "video";
		case "rm":
			return "video";
		case "mkv":
			return "video";
		case "mp4":
			return "video";
		case "mov":
			return "video";
		case "mpeg":
			return "video";
		case "mpg":
			return "video";
		case "zip":
			return "rar";
		case "rar":
			return "rar";
		case "7z":
			return "rar";
		case "wps":
			return "wps";
		case "html":
			return "html";
		case "htm":
			return "html";
		case "txt":
			return "txt";
		case "folder":
			return "folder";
		default:
			return "emptyfile";
	}
}
// 传值类型：2017-03-02T13:33:08.000000+08:00
// 去年时间，显示年月日，今年时间，如果是当天，显示小时和分钟，否则显示月份和日期
function returnTime(time){
	var date = new Date();
 	var currentYear = date.getFullYear();
 	var year = time.split("-")[0];
 	var dateStap = time.split("T")[0];//2017-03-02
 	var m = dateStap.split("-")[1];
 	var d = dateStap.split("-")[2];
 	var timeStap = time.split("T")[1].split(".")[0];//13:33:08
 	var h = timeStap.split(":")[0];
 	var min = timeStap.split(":")[1];
 	if(currentYear == year){
 		if(isToday(dateStap)){//当天 12:02
 			return h + ":" + min;
 		}else{//12-03
 			return m + "-" + d;
 		}
 	}else{
 		return dateStap;
 	}
}
// 传值类型：2017-03-02 13:33:08
// 去年时间，显示年月日，今年时间，如果是当天，显示小时和分钟，否则显示月份和日期
function returnTime2(time){
	var date = new Date();
 	var currentYear = date.getFullYear();
 	var year = time.split("-")[0];
 	var dateStap = time.split(" ")[0];//2017-03-02
 	var m = dateStap.split("-")[1];
 	var d = dateStap.split("-")[2];
 	var timeStap = time.split(" ")[1];//13:33:08
 	var h = timeStap.split(":")[0];
 	var min = timeStap.split(":")[1];
 	if(currentYear == year){
 		if(isToday(dateStap)){//当天 12:02
 			return h + ":" + min;
 		}else{//12-03
 			return m + "-" + d;
 		}
 	}else{
 		return dateStap;
 	}
}
function isToday(str){
    var d = new Date(str.replace(/-/g,"/"));
    var todaysDate = new Date();
    if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        return true;
    } else {
        return false;
    }
}
// 计算文件大小
function bytesToSize(bytes){
    if (bytes === 0)
        return "0 KB";
    var k = 1024,
        sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseInt((bytes / Math.pow(k, i)).toPrecision(3)) + sizes[i];
    // if (bytes === 0)
    //     return "0 B";
    // var k = 1024,
    //     sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    //     i = Math.floor(Math.log(bytes) / Math.log(k));
    // return parseInt((bytes / Math.pow(k, i)).toPrecision(3)) + sizes[i];
}
//判断字符串是否存在数组中
Array.prototype.inArray = function(e){
    for(i = 0;i < this.length && this[i] != e;i ++);
    return !(i == this.length); 
}

function getIqXml (data) {
	var domParser = new DOMParser();
	var xmlDoc = domParser.parseFromString(data, 'text/xml');
	var iq = xmlDoc.getElementsByTagName("iq")[0];
	var xmlDom = {
		xmlDoc : xmlDoc,
		xmlIq : iq
	};
	return xmlDom;
}
function getMessageXml (data) {
	var domParser = new DOMParser();
	var xmlDoc = domParser.parseFromString(data, 'text/xml');
	var msg = xmlDoc.getElementsByTagName("message");
	var xmlDom = {
		xmlDoc : xmlDoc,
		xmlMsg : msg
	};
	return xmlDom;
}
function getIqXml (data) {
	var domParser = new DOMParser();
	var xmlDoc = domParser.parseFromString(data, 'text/xml');
	var iq = xmlDoc.getElementsByTagName("iq")[0];
	var xmlDom = {
		xmlDoc : xmlDoc,
		xmlIq : iq
	};
	return xmlDom;
}
function getMessageXml (data) {
	var domParser = new DOMParser();
	var xmlDoc = domParser.parseFromString(data, 'text/xml');
	var msg = xmlDoc.getElementsByTagName("message");
	var xmlDom = {
		xmlDoc : xmlDoc,
		xmlMsg : msg
	};
	return xmlDom;
}
function getImgPath (xmlDoc,ucIp) {
	var url = uc.getElementsByTagName(xmlDoc,"downloadurl");
	url = url.replace(/\d+\.\d+\.\d+\.\d+/, ucIp);
	url = url.replace(/amp;/g, "");
	return url;
}
function getImgDownLoadPath (xmlDoc,id,ucIp) {
	var url = uc.getElementsByTagName(xmlDoc,"uploadurl");
	url = url.replace(/\d+\.\d+\.\d+\.\d+/, ucIp);
	url += id;
	url = url.replace(/amp;/g, "");
	return url;
}
