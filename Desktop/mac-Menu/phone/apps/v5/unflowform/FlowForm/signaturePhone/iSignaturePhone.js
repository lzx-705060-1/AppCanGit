;(function ($, window, undefined) {
window.kgId = function(id){
	return document.getElementById(id);
};
window.kgNames = function(name){
	return document.getElementsByName(name);
};


var k64 = "ABCDEFGHIJKLMNOPQRSTUVWXYzabcdefghijklmnopqrstuvwxyZ0123456789+/=";

window._encode = function(ori , ba64){
	if(ba64){
		var oribase = CryptoJS.enc.Base64._map;
		CryptoJS.enc.Base64._map = ba64;
		var str=CryptoJS.enc.Utf8.parse(ori);
		var rstr = CryptoJS.enc.Base64.stringify(str);
		CryptoJS.enc.Base64._map = oribase;
		return rstr;
	}else{
		var str=CryptoJS.enc.Utf8.parse(ori);
		return CryptoJS.enc.Base64.stringify(str);
	}
	
};
window._decode = function(ori){
	var words  = CryptoJS.enc.Base64.parse(ori);
	return words.toString(CryptoJS.enc.Utf8);
};

var $window = $(window);
var $document = $(document);
var isTouch = 'createTouch' in document;
var html = document.documentElement;
var isIE6 = !('minWidth' in html.style);
var isLosecapture = !isIE6 && 'onlosecapture' in html;
var isSetCapture = 'setCapture' in html;
var _IE = (!!window.ActiveXObject)?true:false;
var isMobile = 'createTouch' in document && !('onmousemove' in html)|| /(iPhone|iPad|iPod)/i.test(navigator.userAgent);

$.noop = $.noop || function () {};
var _path,_thisScript = null;

_hp = true ,
isArtAlert = true;
_path = window['signaturePhone'] || (function (script, i, me) {
	for (i in script) {
		if (script[i].src && script[i].src.indexOf('signaturePhone') !== -1 &&script[i].src.indexOf("dialog")==-1) {
			me = script[i];
			break;
		}
	};
	_thisScript = me || script[script.length - 1];
	me = _thisScript.src.replace(/\\/g, '/');
	return me.lastIndexOf('/') < 0 ? '.' : me.substring(0, me.lastIndexOf('/'));
}(document.getElementsByTagName('script')));
var _skin = _thisScript.src.split('skin=')[1];
_skin =(_skin && _skin!== 'null')?_skin: (_skin='default');

Array.prototype.sm_remove = function(dx) { 
    if(isNaN(dx)||dx>this.length){return false;} 
    this.splice(dx,1); 
};


var types = {
	click: isTouch ? 'touchend':'click',
    start: isTouch ? 'touchstart' : 'mousedown',
    over: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup'
};


var getEvent = isTouch ? function (event) {
    if (!event.touches) {
        event = event.originalEvent.touches.item(0);
    }
    return event;
} : function (event) {
    return event;
};


var DragEvent = function () {
    this.start = $.proxy(this.start, this);
    this.over = $.proxy(this.over, this);
    this.end = $.proxy(this.end, this);
    this.onstart = this.onover = this.onend = $.noop;
};

DragEvent.types = types;

DragEvent.prototype = {
    start: function (event) {
    	this.onstartbefore();
        event = this.startFix(event);
        $document
        .on(types.over, this.over)
        .on(types.end, this.end);
        this.onstart(event);
        return false;
    },

    over: function (event) {
        event = this.overFix(event);
        this.onover(event);
        return false;
    },

    end: function (event) {
        event = this.endFix(event);
        $document
        .off(types.over, this.over)
        .off(types.end, this.end);
        this.onend(event);
        return false;
    },

    startFix: function (event) {
        event = getEvent(event);
        this.target = $(event.target);
        this.selectstart = function () {
            return false;
        };
        $document
        .on('selectstart', this.selectstart)
        .on('dblclick', this.end);

        if (isLosecapture) {
            this.target.on('losecapture', this.end);
        } else {
            $window.on('blur', this.end);
        }

        if (isSetCapture) {
            this.target[0].setCapture();
        }
        return event;
    },

    overFix: function (event) {
        event = getEvent(event);
        return event;
    },

    endFix: function (event) {
        event = getEvent(event);

        $document
        .off('selectstart', this.selectstart)
        .off('dblclick', this.end);

        if (isLosecapture) {
            this.target.off('losecapture', this.end);
        } else {
            $window.off('blur', this.end);
        }

        if (isSetCapture) {
            this.target[0].releaseCapture();
        }

        return event;
    }
    
};


/**
 * 启动拖拽
 * @param   {HTMLElement}   被拖拽的元素
 * @param   {Event} 触发拖拽的事件对象。可选，若无则监听 elem 的按下事件启动
 */
DragEvent.create = function (elem, event) {
    var $elem = $(elem);
    var dragEvent = new DragEvent();
    var startType = DragEvent.types.start;
    var noop = function () {};
    var className = elem.className
        .replace(/^\s|\s.*/g, '') + '-drag-start';

    var minX;
    var minY;
    var maxX;
    var maxY;

    var api = {
        onstart: noop,
        onover: noop,
        onstartbefore:noop,
        ontap: noop,
        onend: noop,
        off: function () {
            $elem.off(startType, dragEvent.start);
        }
    };
    
    dragEvent.onstartbefore = function(){
		var elemid = $elem.attr('elemid');
		if(elemid && elem){
			
			var offset = $elem.offset();
			var parent = $elem.parent();

			if(!parent.is('body')){
				$elem.appendTo('body');
				$elem.offset(offset);
				parent.remove();
			}
			$elem.removeAttr('elemid');
			$elem.attr('temp_elemid',elemid);
		}
    };
    
    dragEvent.onstart = function (event) {
        var isFixed = $elem.css('position') === 'fixed';
        var dl = $document.scrollLeft();
        var dt = $document.scrollTop();
        var w = $elem.width();
        var h = $elem.height();

        minX = 0;
        minY = 0;
        maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
        maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

        var offset = $elem.offset();
        var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
        var top = this.startTop = isFixed ? offset.top - dt  : offset.top;

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        $elem.addClass(className);
        api.onstart.call(elem, event, left, top);
        this.moved = false;
    };
    

    dragEvent.onover = function (event) {
        var left = event.clientX - this.clientX + this.startLeft;
        var top = event.clientY - this.clientY + this.startTop;
        var style = $elem[0].style;
        
        if((Math.abs(event.clientX - this.startLeft)>6 || Math.abs(event.clientY-this.startTop)>6)){
        	this.moved  = true;
        }
        
        left = Math.max(minX, Math.min(maxX, left));
        top = Math.max(minY, Math.min(maxY, top));

        style.left = left + 'px';
        style.top = top + 'px';
        api.onover.call(elem, event, left, top);
    };
    

    dragEvent.onend = function (event) {
        var position = $elem.position();
        var left = position.left;
        var top = position.top;
        $elem.removeClass(className);
        api.onend.call(elem, event, left, top,this.moved);
        if(!this.moved){
        	api.ontap.call(elem, event);
        }
    };


    dragEvent.off = function () {
        $elem.off(startType, dragEvent.start);
    };


    if (event) {
        dragEvent.start(event);
    } else {
        $elem.on(startType, dragEvent.start);
    }

    return api;
};

var SignaturePhone = function(){
	this.defaults = {
		scale:100,
		display:undefined,
		backgroundImage : true,
		isGet : false,
		certDetail : true,
		zindex : 10,
		detail : true,
		crossDomain : undefined,
		encode:false,
		lock:true,
		fixed:true,
		drag:false,
		moveable:false,
		movecall:undefined,
		skin:'default',
		zoom:1,
		forceScale:false,
		skin:_skin
	},
	this.urls = {
		checkUrl : "m-signature/CheckSignature",//\u9a8c\u8bc1\u8bf7\u6c42\u5730\u5740
		getImgUrl : "m-signature/GetSignImg",//\u83b7\u53d6\u7b7e\u7ae0\u56fe\u7247\u8bf7\u6c42\u5730\u5740
		runSignatureUrl : "m-signature/RunSignature",//\u6267\u884c\u7b7e\u7ae0\u8bf7\u6c42\u5730\u5740
		getSignatureByKeyUrl : "m-signature/GetSignatureByKey",//\u83b7\u53d6\u5370\u7ae0\u5217\u8868\u5730\u5740
		removeSignatureUrl : "m-signature/RemoveSignature",//\u5220\u9664\u7b7e\u7ae0
		delSignatureUrl : "m-signature/DelSignature",//\u5220\u9664\u7b7e\u7ae0
		
		getSignInfoUrl : "m-signature/GetSignInfo",//\u83b7\u53d6\u7b7e\u7ae0\u4fe1\u606f(\u5305\u62ec\u8bc1\u4e66\u4fe1\u606f)\u5730\u5740
		getSignaturesByDocument : "m-signature/GetSignaturesByDocument",//\u83b7\u53d6\u7b7e\u7ae0\u4fe1\u606f\u8bf7\u6c42\u5730\u5740
		runCertUrl : "m-signature/RunCert",//\u6570\u5b57\u7b7e\u540d\u8bf7\u6c42\u5730\u5740
		verifyCertUrl : "m-signature/VerifyCert",//\u9a8c\u8bc1\u8bc1\u4e66\u8bf7\u6c42\u5730\u5740
		verifySignUrl : "m-signature/VerifySign",//\u9a8c\u8bc1\u7b7e\u540d\u6570\u636e\u8bf7\u6c42\u5730\u5740
		changePwdUrl : "m-signature/ChangePwd",//\u4fee\u6539\u5bc6\u7801
		updateUrl : "m-signature/UpdateProp"
	};
	this._init();
};

SignaturePhone.fn = SignaturePhone.prototype = {
	loadjs:[],
	currentKeysn : undefined,
	spPATH : _path,
	isComplate : false,
	initComplate:false,
	signatures : [],
	geographyLocation  : [],
	signType : null ,
	dialog : [],
	base64:false,
	init : function(config){
		var that = this;
		var _default = that.defaults;
		for ( var key in _default) {
			if(config[key] !== undefined){_default[key] = config[key];}
		}
		if(_default.crossDomain && _default.crossDomain.substring(_default.crossDomain.length-1, _default.crossDomain.length)!="/"){
			_default.crossDomain += "/";
		}
		that._setUrl();
		
		var j_param = {
			documentId : config.documentId,
			xmlValue : config.xmlValue
		};
		if(config.signatureIds){
			j_param.signatureIds = config.signatureIds;
		}
		
		var loadJs = that._addRes(config);
		var _getSignature  = function (){
			if(that._checkJsObj(loadJs)){
				that._getSignaturesByDocument(j_param,config);
				
			}else{
				setTimeout(function(){_getSignature();},40);
			}
		};
		_getSignature();
		
	},
	
	_checkJsObj : function(js){
		for(var i=0;i<js.length;i++){
			try{
				eval(js[i]);
			}catch(e){
				return false;
			}
		}
		return true;
	},
	
	_$addRes:function(id,respath,type,name){
		if(!kgId(id)){
			var __script = document.createElement('script');
			__script.type = type;
			__script.id=id;
			__script.src = _path + respath;
			_thisScript.parentNode.insertBefore(__script, _thisScript);
		}
		return name;
	},
	
	_addRes: function(config){
		var that = this;
		isArtAlert = false === config.aAlert?false:true;
		isArtAlert &&(that.loadjs.push(that._$addRes("isp_dialog_plugin", '/dialog/dialog.plugin.js', 'text/javascript' ,'artDialog.tips')));
		that.loadjs.push(that._$addRes("isp_Base64", '/base64.js', 'text/javascript','CryptoJS'));
		return that.loadjs;
	},
	
	_getSignaturesByDocument : function (j_param,config){
		var that = this;
		that.ajax(that.urls.getSignaturesByDocument,j_param,function(data){
			if(data.error){
				that._alertX(data.errorMsg);return ;
			}
			that.signType = data.signType || data.properties.signType;
			config.currentKeysn?(that.currentKeysn = config.currentKeysn):(that.currentKeysn = data.currentKeySn ||data.properties.currentKeySn);
			if(data.properties.signatures&&data.properties.signatures.length>0){
				for ( var k = 0; k < data.properties.signatures.length; k++) {
					that._pushSignature(data.properties.signatures[k]);
				}
				var checkSignatureParams = {"signatures":data.properties.signatures};
				var siganture = data.properties.signatures[0];
				siganture.xmlValue?(checkSignatureParams.xmlValue=siganture.xmlValue):(checkSignatureParams.protectedData = siganture.protectedData);
				config.callback&&(checkSignatureParams.callback=config.callback);
				that.checkSignature(checkSignatureParams);
			}
		}
	);
	},
	
	_getDialog : function(action){
		var dialogId = action.getAttribute("winId");
		return art.dialog.list[dialogId];
	},
	
	_bind : function(){
		var that = this;


		
		$(document).on(types.click,".kg_signVerify",function(){
			
			that.signVerify(this);
			return false;
		});
		$(document).on(types.click,".kg_certVerify",function(){
			that.certVerify(this);
			return false;
		});


		
		$(document).on(types.click,".kg_removeSignature",function(){
			that._delSignatureWin(this);
			return false;
		});
		$(document).on(types.click,".kg_delSignature",function(){
			that._delSignature(this);
			return false;
		});
		
		$(document).on(types.click,".kg_runCert",function(){
			that.runCert(this);
			return false;
		});
		$(document).on(types.click,".kg_close", function(){
			var dialog = art.dialog.list[this.getAttribute("winId")];
			if(dialog){
				that.winClose(dialog);
			}
		});
		
		var a = function(b, c) {
			c.preventDefault();
			var b_parent =b.parent("li");
			b_parent.siblings("li").removeClass("kg_current");
			b_parent.addClass("kg_current");
			var d = $("#"+b.parent("li").attr("id")+"Detail").removeClass("kg_none");
			d.siblings().addClass("kg_none");
			var height = $(".kg_content").height();
			//alert(that.dialog.config.width);
			that.dialog.size(that.dialog.config.width,height);
		};
		$(document).on(types.click,".kg_tab_a", function(c) {
				var b = $(this);
				a(b, c);
			}
		);

		
		$(document).on(types.click,".kg_runSignature", function() {
				var dialog = that._getDialog(this);
				that._runSignature(dialog);
			}
		);
		$(document).on(types.click,".kg_changePwd", function() {
				var newPwd = kgId("kg_newpwdInput").value;
				if(newPwd == ''){
					that._alertX("\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a\uff01");
					return false;
				}
				if(newPwd.length<4){
					that._alertX("\u65b0\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c0f\u4e8e4\u4f4d\u6570\uff01");
					return false;
				}
				if(newPwd !== kgId("kg_confirmPwdInput").value){
					that._alertX("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d\uff01");
					return false;
				}
		    	that._changePwdCallBack(this);
			}
		);
	},
	
	_tipX:function(id,msg){
		this._alertX(msg);
	},
	
	_getProtectedData: function(old_pd,needDesc){
		var that = this;
		var protectedDatas = [];
		for(var i = 0; i<old_pd.length;i++){
			var pd={};
			
			pd.fieldName = old_pd[i].fieldName;
			var element = kgId(pd.fieldName) || kgNames(pd.fieldName)[0];
			if(element){
				if(needDesc){
					var desc = old_pd[i].fieldDesc;
					if(typeof(desc) === 'string'){
						pd.fieldDesc = desc;
					}else{
						var e = element.getAttribute('desc');
						e?(pd.fieldDesc = e):(that._tipX(pd.fieldName,'\u4fdd\u62a4\u9879{'+pd.fieldName+'}\u63cf\u8ff0\u4fe1\u606f\u672a\u8bbe\u7f6e'));
					}
				}
				var $e = $(element);
				var val = '';
				if($e.is('input') || $e.is('textarea')){
					val = element.value;
				}else{
					val = $e.text();
				}
				pd.fieldValue = val;
				//pd.encodeValue = _encode(val);
			}else{
				that._tipX(pd.fieldName,'\u4fdd\u62a4\u9879{'+pd.fieldName+'}\u4e0d\u5b58\u5728');
				pd.fieldValue = '';
			}
			protectedDatas.push(pd);
	   }
	   return protectedDatas;
	},	

	checkSignature : function (_params){
		var that = this;
		var signatures_tmp=_params.signatures;
		signatures_tmp || (signatures_tmp = that.signatures);
		if(signatures_tmp.length>0){
			//var _hasModified = false;
			for ( var i = 0; i < signatures_tmp.length; i++) {
				var signatureDiv="signDiv"+signatures_tmp[i].signatureId+";"+signatures_tmp[i].documentId+";"+signatures_tmp[i].signatureId;
				var submit_params={"signatures":signatureDiv};
				if(_params.xmlValue && 'undefined' === _params.xmlValue){
					submit_params.xmlValue=_params.xmlValue;
				}else{
					var protectedDatas = that._getProtectedData(signatures_tmp[i].signature.protectedData);
					submit_params.protectedData = that.jsonToString(protectedDatas);
				}
				that.ajax(that.urls.checkUrl,submit_params,
						function(data){
							that._checkSignatureCallback(data,_params.callback);
							//if(!_hasModified){
							  // _hasModified = _mark;
							//}
						},true
					);
			}
			//if(_params.isAlertMsg){
				//_hasModified?(that._alertX("\u5b58\u5728\u65e0\u6548\u7b7e\u7ae0\uff01")):(that._alertX("\u7b7e\u7ae0\u9a8c\u8bc1\u6709\u6548\uff01"));
			//}
		}
		
	},
	
	_init : function(config){
		var that = this;
		that._ready();
		that._addTemplate();
		that._addEventPos();
		that._bind();
		return that;
	},
	
	_addTemplate :function (){
		var that = this;
		var kt = null;
		if(that.templates === undefined){
			kt = setTimeout(function(){
				that._addTemplate();
			},40);
		}else{
			that.isComplate = true;
			if(that.defaults.detail){
				that._addDetail();
			}
			clearTimeout(kt);
		}
	},
	_addDetail : function(){
		var that = this;
	},
	
	_getDOM : function (html,hideEl){
		var id = new Date().getTime();
		var that  = this;
		var wrap = document.createElement('div');
		wrap.id=id;
		wrap.innerHTML = html;
		var name, i = 0,
			DOM = {wrap: $(wrap)},
			els = wrap.getElementsByTagName('*'),
			elsLen = els.length;
		for (; i < elsLen; i ++) {
			var elsId = els[i].id;
			name = elsId.indexOf("kg_");
			var key = elsId.substring(name+3);
			var $el = $(els[i]);
			if(hideEl&&hideEl.length>0){
				var z = jQuery.inArray( key, hideEl );
				if(z!=-1){
					$el.hide();
				}
			}
			if (name>-1) {
				DOM[key] = $el;
			}
		};
		that.dialog.content(wrap); 
		return DOM;
	},

	getSignInfo : function (ps){
		var that = this;
		if(!ps.signatures){
			ps.signatures = that.signatures;
		}
		if(ps.signatures.length>0){
			var _signatures=ps.signatures;
			var signatureDivs=[];
			for ( var i = 0; i < _signatures.length; i++) {
				var signatureDiv = "signDiv"+_signatures[i].signatureId+";"+_signatures[i].documentId+";"+_signatures[i].signatureId+";"+_signatures[i].signature.divId;
				signatureDivs.push(signatureDiv);
			}
			var submit_params={"signatures":signatureDivs.join(",")};
			that.ajax(that.urls.getSignInfoUrl,
				submit_params,
				function(_data){
					if(ps.callback){
						ps.callback(_data,ps,that);
					}else{
						if(!_data.error) {
							var _signatures=(_data.properties.signatures);
							var alertMsg="";
								for ( var i=0; i< _signatures.length;i++) {
									if(_signatures!="null"){
										if(i!=0){
											alertMsg+="\r\n\r\n";
										}
										alertMsg+="\u7b7e\u7ae0\uff1a"+_signatures[i].signName+"\r\n";
										alertMsg+="\u7b7e\u7ae0IP\uff1a"+_signatures[i].signatureIp+"\r\n";
										alertMsg+="\u7528\u6237\u540d\uff1a"+_signatures[i].userName+"\r\n";
										alertMsg+="\u5355\u4f4d\u540d\u79f0\uff1a"+_signatures[i].signName+"\r\n";
										alertMsg+="\u7b7e\u7ae0\u5e8f\u53f7\uff1a"+_signatures[i].signSn+"\r\n";
										alertMsg+="\u7b7e\u7ae0\u65f6\u95f4\uff1a"+_signatures[i].datetime+"\r\n";
									}
								}
								that._alertX(alertMsg);
						}else{
							that._alertX(_data.errorMsg); 
						}
					}
				}
			);
		}
	},
	
	_removeSignaturesBySignatureId : function(signatureId){
		var that =this;
		if(that.signatures.length>0){
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId == signatureId){
					that.signatures.sm_remove(i);
					return true;
				}
			}
		}
		return false;
	},
	
	_getSigngaturesBySignatureId : function(signatureId){
		var that =this;
		var _signatureA = [] ;
		if(that.signatures.length>0){
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId == signatureId){
					_signatureA.push(_signature);
					break;
				}
			}
		}
		return _signatureA;
	},

	_addEventPos : function (){
		var resizeTimer = null;
		var that =this;
		that._winResize = function () {
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				that._position();
			}, 40);
		};
		$window.bind('resize', this._winResize);
	},
	
	_position: function () {
		jQuery(".signatureKeysnDiv").each(
			function(i){
				var that = $(this);
				var divId = that.attr("divId");
				if(divId!=null && divId!='null'&&divId!=''&&that.css("float")!=='left'){
					var $div = $("#"+divId).offset();
					that.css({"left":$div.left,"top" : $div.top});
				}
			}
		);
	},
	
	addEvent : function(signaturedata,signDiv){
		var that = this;
		var movecall = that.defaults.movecall;
		if(that.defaults.moveable && signaturedata.enableMove !== '0'){
 			var api = DragEvent.create(signDiv);
	 		if(that.defaults.detail){
		 		api.ontap = function(event){
		 			that._showDetail($(this));
		 		};
 			}
	 		
	 		api.onend = function(event,left ,top , moved){
	 			if(moved){
	 				var elem = $(this);
	 				var l = left;
	 				var t = top;
		 			if(movecall && movecall.onsavebefore){
		 				movecall.onsavebefore.call(elem,event,left ,top);
			 		}
		 			var ele = elem.attr('temp_elemid');
		 			var removeprop = "";
		 			if(ele){
		 				ele = $('#'+ele);
		 				var el = ele.offset().left;
		 				var et = ele.offset().top;
		 				l = left-el;
		 				t = top-et;
		 			}else{
		 				removeprop = 'DivId';
		 			}
		 			
		 			var prop = 'StyleLeft='+l+',StyleTop='+t;
		 			prop = encodeURI(_encode(prop));
		 			
		 			 var _param = {
		 					'documentId':elem.attr("documentId"),
		 					'signatureId':elem.attr("signatureId"),
		 					'prop':prop,
		 					'removeprop':removeprop
		 			};
		 			that.ajax(that.urls.updateUrl, _param, function(data){
		 				if(movecall && movecall.onsaveafter){
			 				movecall.onsaveafter.call(elem,data);
				 		}
		 			});
	 			}
	 		};
 		}else{
 			if(that.defaults.detail){
 				$(signDiv).click(function(){
 					that._showDetail($(this));
 				});
 			}
 		}
	},
	
	_checkSignatureCallback : function (_data,callback){
		var that = this;
		if(!_data.error) { 
			var _propeties=_data.properties;
			for ( var signDivId in _propeties) {
				that._pushSignature(_propeties[signDivId]);
				var signaturedata = _propeties[signDivId];
				var signdiv = that._showImg(signaturedata);
				//if(!_propeties[signDivId].isModified){
					
				//}
				that.addEvent(signaturedata,signdiv);
			}
	 		if(callback){
	 			callback(_data);
	 		}
	 	}else{
	 		that._alertX("\u7b7e\u7ae0\u9a8c\u8bc1\u51fa\u73b0\u5f02\u5e38:"+_data.errorMsg); 
	 	}
	 },
	 
	 signVerify : function (action){
		 var that = this;
		 var dialog = that._getDialog(action);
		 var $signatureDiv = dialog.config.signatureDiv;
		 var signatureId = $signatureDiv.attr("signatureId");
		 var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		 var __xmlValue=signature.xmlValue;
		 if(__xmlValue ||__xmlValue === null){
			 __xmlValue = "";
		 }
		 var pd =that._getProtectedData(signature.signature.protectedData);
		 var _param = {
			documentId:signature.documentId,
			signatureId:signature.signatureId,
			protectedData:that.jsonToString(pd),
			xmlValue:__xmlValue
		};
		that.ajax(that.urls.verifySignUrl,_param,
			function(data){
				if(_param.callback){
					_param.callback(data);
				}else{
					that._signVerifyCall(data,dialog,signature);
				}
			},true
		);
	 },

	 runCert : function (action){
		var that = this;
		var dialog = that._getDialog(action);
		var $signatureDiv = dialog.config.signatureDiv;
		var signatureId = $signatureDiv.attr("signatureId");
		var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		var _param = {
			documentId:signature.documentId,
			keySN:signature.signature.keySn,
			signSN:signature.signature.signSn,
			signVal:signature.signature.signName,
			signatureId:signature.signatureId
		};
		that.ajax(that.urls.runCertUrl,_param,
			function(data){
				if(_param.callback){
					_param.callback(data);
				}else{
					that._alertX(data.errorMsg);
				}
				if(!data.error && dialog){
					that.winClose();
				}
			},true
		);
	 },

	 certVerify : function (action){
		 var that = this;
		 var dialog = that._getDialog(action);
		 var $signatureDiv = dialog.config.signatureDiv;
		 var signatureId = $signatureDiv.attr("signatureId");
		 var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		 var _param = {
			documentId:signature.documentId,
			signatureId:signature.signatureId
		};
		that.ajax(that.urls.verifyCertUrl,_param,
			function(data){
				if(_param.callback){
					_param.callback(data);
				}else{
					that._verifyCertCall(data,dialog,signature);
				}
			},true
		);
	 },
	 
	 _showImg : function (data){
		var that = this;
		var _data = data.signature;
		var bgObjDiv;
		var unique = data.signatureId;
		if(_data.divId){
			unique = data.signatureId+"_"+_data.divId;
		}
		_data.imgWidth = parseInt(_data.imgWidth)*(that.defaults.scale/100);
		_data.imgHeight = parseInt(_data.imgHeight)*(that.defaults.scale/100);
		bgObjDiv = kgId('signDiv'+unique);
		if(!bgObjDiv){
			bgObjDiv = document.createElement("div"); 
			var $bgObjDiv = $(bgObjDiv);
			$bgObjDiv.attr({
				'id':'signDiv'+unique ,
				'keysn':data.signature.keySn ,
				'documentid' : data.documentId,
				'signatureid': data.signatureId,
				'signname': data.signature.signName,
				'styleZindex': that.defaults.zindex + parseInt(_data.signatureOrder),
				'styleTop': _data.styleTop,
				'styleLeft': _data.styleLeft
				});
			$bgObjDiv.css({
				'display':'none',
				'position' : "absolute",
				'cursor': "pointer",
				'divId': _data.elemId,
				'width': _data.imgWidth,
				'height': _data.imgHeight
				});
			
			if(_data.elemId != null&&_data.elemId != '' && kgId(_data.elemId)){
				$bgObjDiv.addClass("signatureImgDiv").attr('elemid',_data.elemId);
				var $keySNDiv = $("#"+_data.elemId);
				if(($keySNDiv.css("display") === "inline-block")){
					$bgObjDiv.css({
							"top" : $keySNDiv.offset().top+parseInt(_data.styleTop, 10),
							"left" : $keySNDiv.offset().left+parseInt(_data.styleLeft, 10),
							"zIndex":$bgObjDiv.attr("styleZindex")}
					);
					$('body').append($bgObjDiv);
				}else{
					if(_IE){
						$("body").append('<div id="p_signature_div' + unique + '" ></div>');
						var $signatureDiv = $("#p_signature_div"+unique);
						$signatureDiv.append($bgObjDiv);
						$signatureDiv.attr("divId", _data.elemId).addClass("signatureKeysnDiv").attr("signatureid",data.signatureId).css({
							"top" : $keySNDiv.offset().top,
							"left" : $keySNDiv.offset().left,
							"zIndex" : $bgObjDiv.attr("styleZindex"),
							"marginLeft" : _data.styleLeft,
							"marginTop" : _data.styleTop,
							"position" : "absolute",
							"width" : _data.imgWidth,
							"height" : _data.imgHeight
						});
					}else{
						$keySNDiv.append('<div id="p_signature_div' + unique + '" signatureid="'+data.signatureId+'" ></div>');
						var $signatureDiv = $("#p_signature_div" + unique);
						$signatureDiv.append($bgObjDiv);
						$signatureDiv.attr("divId", _data.elemId).addClass("signatureKeysnDiv").css({
							"zIndex" : $bgObjDiv.attr("styleZindex"),
							"width" : _data.imgWidth + "px",
							"height" : _data.imgHeight + "px"
						});
						if(that.defaults.display == "float"){
							var childs =$keySNDiv.children(".signatureKeysnDiv");
							var maxHeight = $signatureDiv.height();
							childs.each(function(){
								var that = jQuery(this);
								maxHeight = that.height()>maxHeight?that.height():maxHeight;
							});
							childs.height(maxHeight);

							$keySNDiv.height("auto");
							$signatureDiv.css({"float" : "left"});
						}else{
							var $offset = that._offsetParent($keySNDiv);
							if($offset){
								$signatureDiv.css({"top" : $offset.top,"left" : $offset.left});
							}else{
								$signatureDiv.css({"top" : $keySNDiv.offset().top,"left" : $keySNDiv.offset().left});
							}
							$signatureDiv.css({
								"marginLeft" : _data.styleLeft + "px",
								"marginTop" : _data.styleTop + "px",
								"position" : "absolute"});
						}
					}
				}
				
			}else{
				
				$bgObjDiv.addClass("signatureImgDiv").css({"zIndex":$bgObjDiv.attr("styleZindex"),"top":_data.styleTop+"px","left":_data.styleLeft+"px"});
				$('body').append(bgObjDiv);
			}
		}
		var $bgObjDiv = $(bgObjDiv);
		$bgObjDiv.attr({'ismodified': data.isModified, "modifiedData" : data.modifiedData});
		that._showImage($bgObjDiv , data,_data.imgWidth , _data.imgHeight);
		bgObjDiv.style.display = 'block';
		return bgObjDiv;
	 },
	 
	 _showImage : function ($bgObjDiv, data , width , height) { 
		 var that = this;
		 var id = "img"+$bgObjDiv.attr("id");
		 $("#"+id).remove();
		 var src = null;
		 if(data.signatureTime){
			 data.signatureTime = data.signatureTime.replace(/\+/g,'%2B');
			 src = that.urls.getImgUrl+"?signatureTime="+data.signatureTime+"&documentId="+data.documentId+"&signatureId="+data.signatureId+"&time="+new Date().getTime();
		 }else{
			 src = "data:image/png;base64,"+data.signatureImgData;
		 }
		 var canvas = document.createElement('canvas');
		 if(false){
			 canvas.setAttribute("id",id);
			 canvas.height = height;
			 canvas.width = width;
			 var ctx = canvas.getContext('2d');
			 var img = new Image();
			 img.src = src;
			 img.onload = function(){
				ctx.drawImage(img, 0, 0, canvas.width,canvas.height);
	         };
			 $bgObjDiv.append(canvas);
		 }else{
			 var zzcHTML;
			 if(isIE6){
				 zzcHTML = "<span id='zzc_"+id+"' style=\"width:" + width + "px; height:" + height + "px;display:inline-block;"  
					+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"  
					+ _path + "/dialog/skins/blank.png', sizingMethod='crop');\"></span>";
			   var strNewHTML = "<span id='"+id+"' style=\"width:" + width + "px; height:" + height + "px;display:inline-block;"  
								+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"  
								+ src + "', sizingMethod='crop');\"></span>";
			   $bgObjDiv.append(strNewHTML);
			}else{
				zzcHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAADAFBMVEUAAAAAADMAAGYAAJkAAMwAAP8AMwAAMzMAM2YAM5kAM8wAM/8AZgAAZjMAZmYAZpkAZswAZv8AmQAAmTMAmWYAmZkAmcwAmf8AzAAAzDMAzGYAzJkAzMwAzP8A/wAA/zMA/2YA/5kA/8wA//8zAAAzADMzAGYzAJkzAMwzAP8zMwAzMzMzM2YzM5kzM8wzM/8zZgAzZjMzZmYzZpkzZswzZv8zmQAzmTMzmWYzmZkzmcwzmf8zzAAzzDMzzGYzzJkzzMwzzP8z/wAz/zMz/2Yz/5kz/8wz//9mAABmADNmAGZmAJlmAMxmAP9mMwBmMzNmM2ZmM5lmM8xmM/9mZgBmZjNmZmZmZplmZsxmZv9mmQBmmTNmmWZmmZlmmcxmmf9mzABmzDNmzGZmzJlmzMxmzP9m/wBm/zNm/2Zm/5lm/8xm//+ZAACZADOZAGaZAJmZAMyZAP+ZMwCZMzOZM2aZM5mZM8yZM/+ZZgCZZjOZZmaZZpmZZsyZZv+ZmQCZmTOZmWaZmZmZmcyZmf+ZzACZzDOZzGaZzJmZzMyZzP+Z/wCZ/zOZ/2aZ/5mZ/8yZ///MAADMADPMAGbMAJnMAMzMAP/MMwDMMzPMM2bMM5nMM8zMM//MZgDMZjPMZmbMZpnMZszMZv/MmQDMmTPMmWbMmZnMmczMmf/MzADMzDPMzGbMzJnMzMzMzP/M/wDM/zPM/2bM/5nM/8zM////AAD/ADP/AGb/AJn/AMz/AP//MwD/MzP/M2b/M5n/M8z/M///ZgD/ZjP/Zmb/Zpn/Zsz/Zv//mQD/mTP/mWb/mZn/mcz/mf//zAD/zDP/zGb/zJn/zMz/zP///wD//zP//2b//5n//8z///8SEhIYGBgeHh4kJCQqKiowMDA2NjY8PDxCQkJISEhOTk5UVFRaWlpgYGBmZmZsbGxycnJ4eHh+fn6EhISKioqQkJCWlpacnJyioqKoqKiurq60tLS6urrAwMDGxsbMzMzS0tLY2Nje3t7k5OTq6urw8PD29vb8/PwgKWLDAAAAAXRSTlMAQObYZgAAAApJREFUeNpjYAAAAAIAAeUn3vwAAAAASUVORK5CYII=" width="'+width+'px" height="'+height+'px" ></img>';
				$bgObjDiv.append("<img id='"+id+"'  src='"+src+"' width='"+width+"px' height='"+height+"' style='width:"+width+";height:"+height+"' ></img>");
		    }
			$bgObjDiv.append('<div style="position:absolute;left:0px;top:0px;">'+zzcHTML+'</div>');
		}
	},
	 
	_offsetParent : function ($obj){
		var offsetParent = $obj.offsetParent();
		if(!offsetParent.is("body")){
			var $obj_offset = $obj.offset();
			var offsetParent_offset = offsetParent.offset();
			return {top:$obj_offset.top-offsetParent_offset.top,left:$obj_offset.left-offsetParent_offset.left};
		}
	},

	_pushSignature : function (signature){
		var that =this;
		if(that.signatures.length>0){
			var mark = true;
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId === signature.signatureId){
					that.signatures[i] = signature;
					mark =false;
					break;
				}
			}
			if(mark){
				that.signatures.push(signature);
			}
		}else{
			that.signatures.push(signature);
		}
	},
	
	
	jsonToString : function (obj){
		var THIS = this;   
        switch(typeof(obj)){  
            case 'string':  
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';  
            case 'array':  
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';  
            case 'object':  
                if(obj instanceof Array){  
                    var strArr = [];  
                    var len = obj.length;  
                    for(var i=0; i<len; i++){  
                        strArr.push(THIS.jsonToString(obj[i]));  
                    }  
                    return '[' + strArr.join(',') + ']';  
                }else if(obj==null){  
                    return '""';  
                }else{  
                    var string = [];  
                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));  
                    return '{' + string.join(',') + '}';  
                }
            case 'number':  
                return obj;  
            case "boolean" :  
                return obj;  
        }  
	},
	
	
	ajax : function(the_url,the_param,succ_callback,_async){
		the_param.appName = this._getAppName();
		var temp = {};
		if(this.defaults.isGet || this.defaults.encode){
			the_url += "?ie6="+_encode(""+isIE6 , k64);
			temp.encode = true;
			for ( var key in the_param) {
				var _val = the_param[key];
				if(_val === undefined || 'undefined' === _val){
					_val = '';	
				}
				var v = encodeURI(_encode(_val.toString() , k64));
				temp[key] = v;
			}
		}else{
			the_url += "?ie6="+isIE6;
			temp = the_param;
		}
		temp.traditional = true;
		$.ajax({
			cache:false,
	        type:(this.defaults.isGet?"GET":"POST"),
	        url:the_url+"&"+(this.defaults.isGet?"jsoncallback=?":""),
	        data:temp,
	        dataType:"json",
	        async:!_async,
	        success:succ_callback,
	        error:function(html){
				
	        }
	    });
		
	},
	
	_alertX : function(msg,call){
		if(isArtAlert === true){
			//alert(call);
			artDialog.alertX('<div class="kg_alert">'+msg+'</div>',call); 
		}else{
			alert(msg);
			call();
		}
	},
	
	_getAppName : function(){
		var _ua = navigator.userAgent;
		var _ua_arr =_ua.split(";");
		var appName = [];
		if(isMobile){
			appName.push(_ua.substring(0, _ua.indexOf("/")));
			var _m = _ua.substring(_ua.indexOf("(")+1, _ua.indexOf(")")).split(";");
			appName.push(_m);
		}else {
			appName.push(navigator.appName);
			for ( var i = 0; i < _ua_arr.length; i++) {
				if(i==2||i==4){
					_ua_arr[i] = _ua_arr[i].replace(")","");
					appName.push(_ua_arr[i]);
				}
			}
		}
		return appName.join(" ");
	},
	_setUrl : function(){
		var that = this;
		if(that.defaults.isGet && that.urls.getSignaturesByDocument.indexOf(that.defaults.crossDomain) == -1){
			for ( var key in that.urls) {
				that.urls[key] = that.defaults.crossDomain + that.urls[key];
			}
		}
	},
	
	_delLocal : function(key){
		try{
			if('localStorage' in window){
				localStorage.removeItem(key);
			}else{
				jQuery.cookie(key,null);
			}
		}catch(e){
			//alert(e);
		}
		
	},
	_putLocal : function(key , val){
		try{
		if('localStorage' in window){
			localStorage.setItem(key,val);
		}else{
			jQuery.cookie(key,val);
		}
		}catch(e){
			//alert(e);
		}
	},
	_getLocal : function(key){
		if('localStorage' in window){
			return localStorage.getItem(key);
		}else{
			return jQuery.cookie(key);
		}
	},

	_ready : function (){
		var that  = this;
		that.loadjs.push(that._$addRes('kg_artDialog', '/dialog/dialog.js?skin='+_skin, 'text/javascript', 'artDialog'));
		that.loadjs.push(that._$addRes('kg_template', _hp?'/iSignaturePhone.template.hd.js':'/iSignaturePhone.template.js', 'text/javascript', 'iSP._showDetail'));
	},
	
	_runSignatureCallBack : function(_data,ps,dialog){
		var that  = this;
		var mark = _data.error ;
		if(ps.callback){
			ps.callback(_data);
		}
		
		if(!_data.error) {
		 	if(ps.xmlValue){
		 		_data.properties.xmlValue=ps.xmlValue;
			}
		 	_data.properties.isModified = false;
			that._pushSignature(_data.properties);
			var signdiv = that._showImg(_data.properties);
			that.addEvent(_data.properties,signdiv);
			
			
		}else{
			that._alertX(_data.errorMsg,function(){//100002
				//alert(_data.errorCode);
				if(ps.resetSelect){
					if((_data.errorCode === '10' || _data.errorCode === '100002' )){
						if(_data.errorCode === '100002'){
							ps.backGetPwd  = false;
						}
						
						ps.resetSelect = false;
						that.showGetSignatureByKey(ps);
					}
				}else if(dialog){
					dialog.show();
				}
				
			}); 
		}
		return mark;
	},
	
	_runSignature : function (dialog){
		var that = this;
		var ps = dialog.config.kgparam;
		var dom = dialog.config.kgdom;
		if(!ps.backGetPwd){
			if(dom.signnameSelect.val() === ''){
				that._alertX("\u8bf7\u9009\u62e9\u7b7e\u7ae0\uff01");
				return false;
			}
			if(dom.pwdInput.val() === ''){
				that._alertX("\u8bf7\u8f93\u5165\u5bc6\u7801\uff01");
				return false;
			}
		}
		
		ps.runSignatureParams.signSN=dom.signnameSelect.val();
		ps.runSignatureParams.signVal = kgId(ps.runSignatureParams.signSN).getAttribute("signname");
		ps.runSignatureParams.keyPassword=dom.pwdInput.val();
		ps.xmlValue?(ps.runSignatureParams.xmlValue = ps.xmlValue):(ps.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(ps.protectedData,true)));
		dialog.hide();
		that.loadingwin();
		that.ajax(that.urls.runSignatureUrl,ps.runSignatureParams,
				function(data){
					that.winClose();
					var iserr = that._runSignatureCallBack(data,ps,dialog);
					if(!iserr){
						var $sign = dom.memory_sign_input;
				    	if($sign.attr("checked") === true){
				    		var $kg_signName = $("#kg_signnameSelect option:selected");
							that._putLocal('kg_memory_sign_text',$kg_signName.attr("id"));
				    	}else{
				    		that._delLocal('kg_memory_sign_text');
				    	}
				    	var $pwd = dom.memory_pwd_input;
				    	if($pwd.attr("checked") === true){
							that._putLocal('kg_memory_pwd_text',dom.pwdInput.val());
				    	}else{
				    		that._delLocal('kg_memory_pwd_text');
				    	}
					}
				},false
			);
	},
	
	_boolean: function(i){
		return i === true?true:false;
	},
	
	showGetSignatureByKey : function (config){
		var that = this;
		that.loadingwin();
		config.runSignatureParams.backGetPwd = that._boolean(config.backGetPwd);
		that.ajax(that.urls.getSignatureByKeyUrl,config.runSignatureParams,
			function(data){
				that.winClose();
				if(data.error){
					that._alertX(data.errorMsg);
				}else{
					that._showSignatureDiv(config, data.properties);
					if(config.getSignatureCallback){
						config.getSignatureCallback(data.properties);
					}
		        }
			}
		);
	},
	
	runSignatureNoSurface : function (ps){
		var that = this;
		var mark =false;
		ps.runSignatureParams.keyPassword = ps.runSignatureParams.password;
		ps.runSignatureParams.signValue = ps.runSignatureParams.signValue;
		ps.resetSelect = true;
		ps.backGetPwd = true;
		if(ps.xmlValue){
			ps.runSignatureParams.xmlValue=ps.xmlValue;
		}else{
			ps.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(ps.protectedData,true));
		}
		ps.runSignatureParams.backGetPwd = ps.backGetPwd;
		that.loadingwin();
		that.ajax(that.urls.runSignatureUrl,ps.runSignatureParams,
				function(data){
					that.winClose();
					mark = that._runSignatureCallBack(data,ps);
				},false
			);
		return mark;
		
	},

	_noSignMsg : function(){
		var that = this;
		that._alertX("\u5f53\u524d\u6587\u6863\u672a\u7b7e\u7ae0\uff01");
	},


	delSignature : function (_ps){
		var that = this;
		that.ajax(that.urls.delSignatureUrl,_ps,
			function(_data){
				if(!_data.error) {
	 				var _propeties=_data.properties;
	 				if(_propeties.signatureId){
	 					that._removeSignaturesBySignatureId(_propeties.signatureId);
	 					$("div[signatureid='"+_propeties.signatureId+"']").remove();
	 				}
				}
		 		if(!_ps.callback){
		 			if(_data.error) {
		 				that._alertX(_data.errorMsg); 
					}
		 		}else {
		 			_ps.callback(_data);
		 		}
			},true
		);
	},
	
	removeSignature : function (_param){
		var that = this;
		var _documentId="", _signatureIds="";
		 if(iSP.signatures.length==0){
			 that._noSignMsg();
			 return false;
		 }
		 var signatureDivs=[];
		 for ( var i = 0; i < _param.signatures.length; i++) {
				var signatureDiv=_param.signatures[i].signatureId;
				_documentId = _param.signatures[i].documentId;
				signatureDivs.push(signatureDiv);
			}
		 _signatureIds=signatureDivs.join(",");
		 that.ajax(that.urls.removeSignatureUrl,{documentId:_documentId,signatureIds:_signatureIds},
			function(_data){
				 if(!_data.error) {
	 				var _propeties=(_data.properties);
	 				var _signatureIds = _propeties.signatureIds.split(",");
 					for ( var i = 0; i < _signatureIds.length; i++) {
 						$("div[signatureid='"+_signatureIds[i]+"']").remove();
 						that._removeSignaturesBySignatureId(_signatureIds[i]);
					}
				 }
		 		if(!_param.callback){
		 			if(_data.error) {
		 				that._alertX(_data.errorMsg); 
					}
		 		}else {
		 			_param.callback(_data);
		 		}
			}
		);
	}
};
window.iSP = $.iSP = $.signaturePhone  = signaturePhone = new SignaturePhone();


}(window.jQuery, this));