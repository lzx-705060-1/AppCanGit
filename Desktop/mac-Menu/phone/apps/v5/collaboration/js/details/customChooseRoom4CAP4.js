/**
 * 协同H5 CAP4表单自定义控件js
 * @author wxju
 * @since V5-A8 7.0
 */
(function() {
	//命名空间，后端自定义实现类FormMeetingroomCtrl的getMBInjectionInfo和getPCInjectionInfo分别定义
	var privateNamespace = 'feild_4731554986879239095';  
	var _self = {};

	var _room_storge_key = "m3_v5_collaboration_newCol_room_cache_key_";
	
	//自定义控件渲染初始化方法
	_self.init = function(res) {
		var privateId = res.privateId;
		var adaptation = res.adaptation;
		var messageObj = res.adaptation.childrenGetData(privateId);//获取自定义控件值对象
		var showValue = messageObj.showValue;
		var value = messageObj.value;
		
		//初始化组件，替换表单中对应的dom
		var cacheKey = _room_storge_key + privateId;//缓存的Key值
		var cacheValue = JSON.parse(cmp.storage.get(cacheKey, true));
		//清空会议室缓存
		cmp.storage["delete"](cacheKey, true);
			
		if (cacheValue!=null) {
			showValue = cacheValue.display;
			value = cacheValue.value;
			//保存值
			messageObj.showValue = showValue;
		    messageObj.value = value;
		    messageObj.valueId = value;
		    adaptation.childrenSetData(messageObj, privateId);
		}
		_self._initShowHTML(privateId,adaptation,showValue);
		
		_self.initShow(privateId, adaptation, showValue);
	  
		_self._initEvent(privateId, adaptation, cacheKey);
		//改变时触发事件
		adaptation.ObserverEvent.listen('Event' + privateId, function(data) {
			_self._initShowHTML(privateId, adaptation, data.showValue);
			_self.initShow(privateId, adaptation, data.showValue);
			_self._initEvent(privateId, adaptation, cacheKey);
		});
		  
		
	}
	
	_self._initEvent = function (privateId, adaptation, cacheKey) {
		var idEle = document.getElementById("id_" + privateId);
		if (idEle!=null) {
			idEle.addEventListener('tap', function() {
				_self._goToChooseMeetingRoom(adaptation,privateId,cacheKey);
			});
		}
		var rightEle = document.getElementById("right_"+privateId);
		if (rightEle!=null) {
			rightEle.addEventListener('tap', function() {
				_self._goToChooseMeetingRoom(adaptation,privateId,cacheKey);
			});
		}
		var clearEle = document.getElementById("clear_"+privateId);
		if (clearEle!=null) {
			clearEle.addEventListener('tap', function() {
				_self._clearRoomValue(adaptation,privateId);
			});
		}
	}
	_self._initShowHTML = function(privateId,adaptation,showValue) {
		var messageObj = adaptation.childrenGetData(privateId);
		var isLightForm = false;
		if(messageObj.formdata.rawData.viewInfo.viewContent.skin) {
			isLightForm = true;
		}
		
		var rightDivClass=rightClass=rightHTML=idClass=idColor=isNotNullClass=isNotNullHTML="";
		
		if (messageObj.isNotNull == "1") {
			if (isLightForm) {
				isNotNullClass = ' is-must ';//必填*
			} else {
				//必填背景色
				messageObj.extra.isNotNullBg = '#fef0d0';
			}
		} else {
			messageObj.extra.isNotNullBg = '';
		}
		if (!isLightForm && messageObj.auth == "edit") {
			rightDivClass = "cap4-people__cnt";
		} else {
			rightDivClass = "cap4-depart__real";
		}
		
		if (!isLightForm) {
			idClass = "cap4-people__text";
			rightHTML = 'm3-icon-meetingRoom-fill" style="display:none; color:#3AADFB; float:right;padding-right: 5px;"';
			rightClass = " cap4-depart__picker ";
		} else {
			isNotNullHTML = '<div class="cap4-depart__star"><i class="icon CAP cap-icon-bitian"></i></div>';
			idClass = "cap4-depart__real--ret";
			rightHTML = 'icon CAP cap-icon-youjiantou" style="display:none;"';
			rightClass = " cap4-depart__real--arrow ";
		}
		if (showValue == "" && messageObj.auth == "edit") {
			idColor = messageObj.extra.placeholderColor;
			if (isLightForm) {
				showValue = cmp.i18n("collaboration.pighole.click");
			}
		} else {
			idColor = messageObj.extra.fieldValueDefaultColor;
			messageObj.extra.isNotNullBg = '';//填写值之后，必填背景色消失
		}
		
		var showHTML = '<section id="chooseRoomSection_'+privateId+'" class="cap4-depart is-one'+isNotNullClass+'" style="background:'+ messageObj.extra.fieldBg +'">';
		showHTML += isNotNullHTML;
		showHTML += '<div class="cap4-depart__content">';
		
		var display= messageObj.display.escapeHTML();
		if (display != "") {
			showHTML += '<div class="cap4-depart__left" style="color:'+ messageObj.extra.fieldTitleDefaultColor +';">'+display+'</div>';
			showHTML += '<div class="cap4-depart__right" >';
		} else {
			showHTML += '<div >';
		}
		
		showHTML += '<div class="'+rightDivClass+'" id="rightDiv_'+privateId+'" style="background:'+messageObj.extra.isNotNullBg+'"><div class="cap4-depart__real--edit">';
		
		showHTML += '<div id="id_'+privateId+'" class=" '+ idClass+'" style="color:'+idColor+'; width: 100%;" >'+showValue+'</div>';
		
		showHTML += ' <div class="'+rightClass+'"><i id="right_'+privateId+'" class="'+rightHTML+'></i>';
		
		showHTML += '<i id="clear_'+privateId+'" class="icon CAP cap-icon-shanchu-X" style="display:none; float:right;"></i>'
		
		showHTML += '</div>';

		showHTML += '</div></div></div>';
		showHTML += '</div>';
		showHTML += '</section>';
		
		var div = document.getElementById(privateId);
		if(div) {
			div.innerHTML = showHTML;
		}
	}
	
	_self.initShow = function(privateId, adaptation, showValue) {
		//重新获取,计算后值可能有变化
		var messageObj = adaptation.childrenGetData(privateId);
		
		var rightButton = document.getElementById("right_"+privateId);
		var clearButton = document.getElementById("clear_"+privateId);
		var roomInput = document.getElementById("id_" + privateId);
		if (rightButton==null || clearButton==null || roomInput==null) {
			return;
		}
		if (typeof(showValue)=="undefined") {
			showValue = messageObj.showValue;
		}
		//轻表单隐藏权限时直接隐藏该控件
		if (messageObj.auth == "hide" && messageObj.formdata.rawData.viewInfo.viewContent.skin) {
			document.getElementById("chooseRoomSection_"+privateId).style.display = "none";
			return ;
		} else {
			document.getElementById("chooseRoomSection_"+privateId).style.display = "";
		}
		if(messageObj.auth == "edit") {//编辑状态
			if (showValue == "" || showValue == cmp.i18n("collaboration.pighole.click")) {
				rightButton.style.display = "";
			} else {//显示叉
				clearButton.style.display = "";
				roomInput.style.color = messageObj.extra.fieldValueDefaultColor;
			}
		} else {
			roomInput.innerHTML = messageObj.showValue;
			rightButton.style.display = "none";
			clearButton.style.display = "none";
		}
		
	  }
	
	_self._goToChooseMeetingRoom = function(adaptation,privateId,cacheKey) {
		var params = {
				formChooseKey : cacheKey,
				action : "formChoose"
		};
		// 如果以后这里是支持多webview， 需要触发的是 beforeviewleave 事件
		//cmp.event.trigger("beforeviewleave",document);
	    
		cmp.event.trigger("beforepageredirect",document);
	
		if(!window._meetingPath){
		    if(cmp.platform.CMPShell){
		        window._meetingPath = "http://meeting.v5.cmp/v";
		        window.colBuildVersion = "";
		    }else{
		        window.colBuildVersion = "?buildversion=" + (new Date().getTime());
	            window._meetingPath = "/seeyon/m3/apps/v5/meeting";
		    }
		}
		
	    cmp.href.next(_meetingPath + "/html/meetingRoomList.html" + colBuildVersion, params);
	}
	
	_self._clearRoomValue = function(adaptation,privateId) {
		var messageObj = adaptation.childrenGetData(privateId);
		var str = '';
		
		var idEle = document.getElementById("id_" + privateId);
		var rightDivEle = document.getElementById("rightDiv_" + privateId);
		var rightEle = document.getElementById("right_"+privateId);
		var clearEle = document.getElementById("clear_"+privateId);
		
		if (idEle==null || rightDivEle==null || rightEle==null || clearEle==null) {
			return;
		}
		if(messageObj.formdata.rawData.viewInfo.viewContent.skin) {//轻表单
			idEle.innerHTML = cmp.i18n("collaboration.pighole.click");
		} else {
			idEle.innerHTML = "";
		}
		
		if(messageObj.isNotNull == "1") { //必填
			if (messageObj.formdata.rawData.viewInfo.viewContent.skin) {//轻表单
				rightDivEle.style.background = messageObj.extra.isNotNullBg;
			} else{
				rightDivEle.style.background = "#fef0d0";
			}
		}
		
		
		//保存值
		messageObj.showValue = str;
	    messageObj.value = str;
	    messageObj.valueId = str;
	    adaptation.childrenSetData(messageObj, privateId);
		
	    clearEle.style.display = "none";
		rightEle.style.display = "";
		idEle.style.color = messageObj.extra.placeholderColor;
	}
	
	  window[privateNamespace] = _self;
})();