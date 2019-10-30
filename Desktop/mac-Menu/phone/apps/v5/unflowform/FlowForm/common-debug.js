$.ctx = {};
var isFormSubmit = true;
$.extend(Function.prototype, {
  defer : function(delay) {
    var timer, callback = this, fn = function() {
      var that = this, args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        callback.apply(that, args);
      }, delay);
    };
    fn();
    return 0;
  }
});
$.extendParam = function(tpl, para) {
  for ( var v in para) {
    if (!(para[v] instanceof Array)) {
      tpl[v] = para[v];
    }
  }
  return tpl;
};
$.ctx.isOfficeEnabled = function(officeType) {
	  var mt = officeType, f = true;
	  try{
	    if(!$.ctx._mainbodyOcxObj && (mt == ".doc" || mt == ".xls" || mt == ".wps" || mt == ".et" || (mt > 40 && mt < 45)))
	      $.ctx._mainbodyOcxObj = new ActiveXObject("HandWrite.HandWriteCtrl");
	    if(mt == ".doc" || mt == 41)
	      f = $.ctx._mainbodyOcxObj.WebApplication(".doc");
	      if(!f){//安装了wps也能编辑doc文件
	 	     f = $.ctx._mainbodyOcxObj.WebApplication(".wps");
		  }
	    else if(mt == ".xls" || mt == 42)
	      f = $.ctx._mainbodyOcxObj.WebApplication(".xls");
		  if(!f){//安装了wps也能编辑xls文件
		  	f = $.ctx._mainbodyOcxObj.WebApplication(".et");
		  }
	    else if(mt == ".wps" || mt == 43)
	      f = $.ctx._mainbodyOcxObj.WebApplication(".wps");
	    else if(mt == ".et" || mt == 44)
	      f = $.ctx._mainbodyOcxObj.WebApplication(".et");
	    else if(mt == ".pdf" || mt == 45)
	      new ActiveXObject("iWebPDF.PDFReader");
	  }catch(e) {
	    f = false;
	  }
	  return f;
	};
$.ctx._hasPrivJudge = function(pc, isPlugin) {
    var flag = false, pcs;
    if(pc && (isPlugin ? $.ctx.plugins : $.ctx.resources)) {
      if(pc.indexOf("&") != -1) {
        flag = true;
        pcs = pc.split("&");
        for(var i = 0; i < pcs.length; i++) {
          if(isPlugin ? !$.ctx.plugins.contains(pcs[i].trim()) : !$.ctx.resources.contains(pcs[i].trim())) {
            flag = false;
            break;
          }
        }
      }else if(pc.indexOf("|") != -1) {
        pcs = pc.split("|");
        for(var i = 0; i < pcs.length; i++) {
          if(isPlugin ? $.ctx.plugins.contains(pcs[i].trim()) : $.ctx.resources.contains(pcs[i].trim())) {
            flag = true;
            break;
          }
        }
      }else
        flag = isPlugin ? $.ctx.plugins.contains(pc.trim()) : $.ctx.resources.contains(pc.trim());
    }
    return flag;
  };
$.ctx.hasPlugin = function(pi) {
  return $.ctx._hasPrivJudge(pi, true);
};
$.ctx.hasResource = function(rc) {
  return $.ctx._hasPrivJudge(rc, false);
};
$.privCheck = function(rc, pi, passCallback, failCallback) {
  if (!passCallback)
    passCallback = function() {
    };
  if (!failCallback)
    failCallback = function() {
    };
  if (_isDevelop) {
    passCallback();
  } else {
    if (pi && $.ctx.hasPlugin(pi)) {
      if (rc && $.ctx.hasResource(rc))
        passCallback();
      else if (!rc)
        passCallback();
      else
        failCallback();
    } else if (!pi && rc) {
      if ($.ctx.hasResource(rc))
        passCallback();
      else
        failCallback();
    } else if (!pi && !rc)
      passCallback();
    else
      failCallback();
  }
};
var _safriDoubleKeyIgnoreKeys = [32,192,186,187,188,189,190,191,219,220,221,222,13];
$.handleModalDialogInputKeyEvent = function() {
    var ua = navigator.vendor,pf = navigator.platform;
    if(ua && ua.indexOf('Apple') != -1 && pf && pf.indexOf('Win') != -1) {
        var ime = false;
        $(":input").keyup(function(evt){
          handleSafriDoubleKey(this, evt);
        }).keydown(function(evt){
          if(evt.keyCode == 229) 
            ime = true;
          else
            ime = false;
      });
      function handleSafriDoubleKey(obj,evt) {
          if(ime)
              return;
        var kc = evt.keyCode;
        if(((kc < 48 || kc > 111) && !_safriDoubleKeyIgnoreKeys.contains(kc)) || evt.ctrlKey || evt.altKey) {
          return;
        }
        if(kc == 13 && obj.type !== 'textarea')
          return;
        var st = obj.selectionStart,vl = obj.value,v;
        if(st > 0) {
          v = vl.substring(0, st-1);
          if(st < vl.length) {
            v += vl.substring(st);
          }
        }
        obj.value = v;
        obj.setSelectionRange(st-1,st-1);
      }
  }
};
// disable mouse context menu
// document.oncontextmenu=new Function("event.returnValue=false;");
$()
    .ready(
        function() {
          $(".comp").each(function(i) {
            $(this).compThis();
          });
          $.codeoption();
          $.autofillform({
            fillmaps : $.ctx.fillmaps
          });
          $.codetext();
          $(".resCode").each(function(i) {
            var t = $(this), rc = t.attr("resCode"), pi = t.attr("pluginId");
            $.privCheck(rc, pi, function() {
              t.show();
            }, function() {
                t.hide();
            });
          });
          CallerResponder.prototype = {
            error : function(request, settings, e) {
              try {
                var eo = $.parseJSON(request.responseText);
                if (!eo.details) {
// $.messageBox({
// title : 'Message',
// msg : eo.message
// });
                    $.alert({
                      'msg':eo.message,
                      'close_fn':function(){
                        try{if(getCtpTop() && getCtpTop().endProc)getCtpTop().endProc();}catch(e){}
                      },
                      'ok_fn':function(){
                        try{if(getCtpTop() && getCtpTop().endProc)getCtpTop().endProc();}catch(e){}
                      }
                    });
                } else {
                  $("body")
                      .append(
                          '<div id="errorDiv" style="display: none" width="600"><div id="errMsg"></div><br><textarea id="errDetails" rows="15" style="width: 500; font-size: 10pt" readonly="readonly"></textarea></div>');
                  $("#errMsg").text(
                      'Error message(' + eo.code + '):' + eo.message);
                  $("#errDetails").text(eo.details);
                  var dialog = $.dialog({
                    title : 'Error!',
                    htmlId : 'errorDiv',
                    width : 520,
                    height : 300,
                    targetWindow:getCtpTop(),
                    buttons : [ {
                      text : "Close",
                      handler : function() {
                        $("#errorDiv").remove();
                        var el = dialog.getObjectById('errorDiv');
                        if(el)
                          el.remove();
                        dialog.close();
                        hideMask();
                      }
                    } ]
                  });
                }
              } catch (ee) {
              }
            }
          };
          (function() {
              try{
                  if(_isModalDialog) {
                    $.handleModalDialogInputKeyEvent();
                 // fix session invalid problem caused by modal dialog block
                    var hangup_interval = setInterval(function(){
                      $.ajax({
                        url : _ctxPath + "/main.do?method=hangup",
                        async : true
                      });
                    },30000);
                  }
                }catch(e){} 
            // change the default action of reset button
            $("input:reset").each(
                function() {
                  $("input:text,select,input:checkbox,input:password",
                      $(this).parents("form")).each(function() {
                    if (this.type == 'checkbox') {
                      $(this).attr("coriginValue", this.checked);
                    }
                    $(this).attr("originValue", $(this).val());
                  });
                  var t = $(this);
                  var c = $("<input type='button' />");
                  c.attr("id", t.attr("id"));
                  c.attr("className", t.attr("className") + " button_3");
                  c.attr("style", t.attr("style"));
                  c.attr("name", t.attr("name"));
                  c.onmuseover = this["onmuseover"];
                  c.val(t.val());
                  t.after(c);
                  t.remove();
                  c.click(function() {
                    $("input:text,select,input:checkbox,input:password",
                        $(this).parents("form")).each(
                        function() {
                          if ($(this).attr("originValue"))
                            $(this).val($(this).attr("originValue"));
                          else
                            $(this).val("");
                          if (this.tagName.toUpperCase() == 'SELECT') {
                            for ( var i = 0; i < this.options.length; i++) {
                              if (this.options[i].value == $(this).attr(
                                  "originValue")) {
                                this.options[i].selected = true;
                              }
                            }
                          }
                          if (this.type == 'checkbox') {
                            if ($(this).attr("coriginValue") != 'true') {
                              this.checked = false;
                            } else {
                              this.checked = true;
                            }
                          }
                        });
                  });

                });

            function parseDate(str) {
              if (typeof str == 'string' && str.length > 10) {
                return str.substring(0, 10);
              }
              return str;
            }
            /*
             * $("#savebtn").attr("alt", "\u5feb\u6377\u952e:(alt+s)");
             * $("#returnbtn").attr("alt", "\u5feb\u6377\u952e:(alt+c)");
             * $("#resetbtn").attr("alt", "\u5feb\u6377\u952e:(alt+r)");
             * $("#findbtn").attr("alt", "\u5feb\u6377\u952e:(alt+w)");
             * $("#calbtn").attr("alt", "\u5feb\u6377\u952e:(alt+z)");
             * $("#addbtn").attr("alt", "\u5feb\u6377\u952e:(alt+x)");
             * $("#deletebtn").attr("alt", "\u5feb\u6377\u952e:(alt+q)");
             * $("#printbtn").attr("alt", "\u5feb\u6377\u952e:(alt+p)");
             * $("#readicbtn").attr("alt", "\u5feb\u6377\u952e:(alt+b)");
             * $("#choosebtn").attr("alt", "\u5feb\u6377\u952e:(alt+g)");
             */
            if(document.all){
              $("a[href='javascript:void(0)']").live("click",function (e){
                e.preventDefault();
              });
            }

          }).defer(0, this);
          /*
           * $.hotkeys.add(keyObj.savebtn, function() { $('#savebtn').click();
           * }); $.hotkeys.add(keyObj.returnbtn, function() {
           * $('#returnbtn').click(); }); $.hotkeys.add(keyObj.resetbtn,
           * function() { $('#resetbtn').click(); });
           * $.hotkeys.add(keyObj.findbtn, function() { $('#findbtn').click();
           * }); $.hotkeys.add(keyObj.calbtn, function() { $('#calbtn').click();
           * }); $.hotkeys.add(keyObj.addbtn, function() { $('#addbtn').click();
           * }); $.hotkeys.add(keyObj.deletebtn, function() {
           * $('#deletebtn').click(); }); $.hotkeys.add(keyObj.printbtn,
           * function() { $('#printbtn').click(); });
           * $.hotkeys.add(keyObj.readicbtn, function() {
           * $('#readicbtn').click(); }); $.hotkeys.add(keyObj.choosebtn,
           * function() { $('#choosebtn').click(); });
           */
		   contentScroll(); //放大缩小
        });
Date.prototype.isBefore = function(odate) {
  var t1 = parseInt(this.format('Ymd')), t2 = parseInt(odate.format('Ymd'));
  return t1 > t2 ? -1 : (t1 < t2 ? 1 : 0);
};
Date.prototype.before = function(interval, odate) {
  if (!interval || !odate)
    return 0;
  var before = 0, d, positive = true, bdate = this, adate = odate;
  if (this.isBefore(odate) == -1) {
    positive = false;
    bdate = odate;
    adate = this;
  }
  d = bdate.clone();
  switch (interval.toLowerCase()) {
    case Date.MONTH:
      while (true) {
        if (d.getYear() == adate.getYear() && d.getMonth() == adate.getMonth()) {
          break;
        } else {
          before++;
          d = d.add(Date.MONTH, 1);
        }
      }
      break;
    case Date.YEAR:
      while (true) {
        if (d.getYear() == adate.getYear()) {
          break;
        } else {
          before++;
          d = d.add(Date.YEAR, 1);
        }
      }
      break;
  }
  if (!positive)
    before *= -1;
  return before;
};
Date.prototype.roundBefore = function(interval, odate) {
  var before, bDate = this, aDate = odate, positive = true;
  if (this.isBefore(odate) == -1) {
    positive = false;
    bdate = odate;
    adate = this;
  }

  before = bDate.before(interval, aDate);

  var bDay = bDate.getDate(), aDay = aDate.getDate();
  switch (interval.toLowerCase()) {
    case Date.MONTH:
      if (aDay < bDay) {
        before--;
      }
      break;
    case Date.YEAR:
      var bMonth = bDate.getMonth(), aMonth = aDate.getMonth();
      if (aMonth < bMonth) {
        before--;
      } else if (aMonth == bMonth) {
        if (aDay < bDay) {
          before--;
        }
      }
      break;
  }

  if (!positive)
    before *= -1;
  return before;
};
function isBefore(bDateStr, aDateStr) {
  var bDate = Date.parseDate(bDateStr, 'Y-m-d');
  var aDate = Date.parseDate(aDateStr, 'Y-m-d');
  return bDate.isBefore(aDate);
}
function before(interval, bDateStr, aDateStr) {
  var bDate = Date.parseDate(bDateStr, 'Y-m-d');
  var aDate = Date.parseDate(aDateStr, 'Y-m-d');
  return bDate.before(interval, aDate);
}
function roundBefore(interval, bDateStr, aDateStr) {
  var bDate = Date.parseDate(bDateStr, 'Y-m-d');
  var aDate = Date.parseDate(aDateStr, 'Y-m-d');
  return bDate.roundBefore(interval, aDate);
}
/*
 * var keyObj = new Object(); keyObj.savebtn = "alt+s"; keyObj.returnbtn =
 * "alt+c"; keyObj.resetbtn = "alt+r"; keyObj.findbtn = "alt+w"; keyObj.calbtn =
 * "alt+z"; keyObj.addbtn = "alt+x"; keyObj.deletebtn = "alt+q"; keyObj.printbtn =
 * "alt+p"; keyObj.readicbtn = "alt+b"; keyObj.choosebtn = "alt+g";
 */
(function($) {
  $.fn.switchClone = function(da, hc) {
    var t = this;
    if (!t.attr("_isclone")) {
      var tc = t.attrObj("tmpclone");
      if (!tc) {
        tc = t.clone();
        if (hc) {
          hc(t[0].tagName.toLowerCase(), tc);
        }
        tc.attr("_isclone", 1);
        t.attrObj("tmpclone", tc);
        t.after(tc);
      }
      if (t.attr("_hide") == 1) {
        if (!da) {
          t.show();
          t.attr("_hide", 0);
          tc.hide();
        }
      } else {
        if (da) {
          t.hide();
          t.attr("_hide", 1);
          tc.show();
        }
      }
    }
  };
  $.fn.disable = function() {
    this.each(function(i) {
      $(this).find(':input,a.common_button').add(this).each(function() {
        var id = this.id, t = $(this), c = t.attrObj("_rel");
        /*
         * if (keyObj[id]) $.hotkeys.remove(keyObj[id]);
         */
        switch (this.tagName.toLowerCase()) {
          case 'textarea':
          case 'select':
            var dd = t.attrObj("_dropdown");
            if (dd) {
              dd.disabled = "true";
            }
          case 'input':
            t.attr("disabled", "yes");
            t.attr("_da", true);
            if (c) {
              c.switchClone(true, function(tn, sc) {
                if (tn == 'a')
                  sc.addClass("common_button_disable");
                else
                  sc.attr("disabled", "yes");
              });
            }
            break;
          case 'a':
            if (!t.attr("_isrel")) {
              t.switchClone(true, function(tn, sc) {
                sc.addClass("common_button_disable");
              });
              t.attr("_da", true);
            }
            break;
        }
      });
    });
  };
  $.fn.enable = function() {
    this.each(function(i) {
      $(this).find(':input,a.common_button').add(this).each(function() {
        var id = this.id, t = $(this), c = t.attrObj("_rel");
        if (t.attr("_da")) {
          /*
           * if (keyObj[id]) $.hotkeys.add(keyObj[id], function() { t.click();
           * });
           */
          switch (this.tagName.toLowerCase()) {
            case 'textarea':
            case 'select':
              var dd = t.attrObj("_dropdown");
              if (dd) {
                dd.disabled = null;
              }
            case 'input':
              t.removeAttr("disabled");
              t.attr("_da", false);
              if (c) {
                c.switchClone(false);
              }
              break;
            case 'a':
              if (!t.attr("_isrel")) {
                t.switchClone(false);
                t.attr("_da", false);
              }
              break;
          }
        }
      });
    });
  };
  var attrObjs = [];
  $.fn.attrObj = function(name, value) {
    var obj;
    for ( var i = 0; i < attrObjs.length; i++) {
      if (attrObjs[i].o == this[0]) {
        obj = attrObjs[i];
        break;
      }
    }
    if (!obj) {
      obj = new Object();
      obj.o = this[0];
      obj.v = new Object();
      attrObjs.push(obj);
    }
    if (value) {
      obj.v[name] = value;
    } else {
      return obj.v[name];
    }
  };
  $.fn.removeAttrObj = function(name) {
    for ( var i = 0; i < attrObjs.length; i++) {
      if (attrObjs[i].o == this[0]) {
        var obj = attrObjs[i];
        obj.v[name] = null;
        break;
      }
    }
  };
  $.confirmClose = function(){
	    var mute = arguments.length > 0;
		var ua = navigator.userAgent;
		var isMSIE = (navigator.appName == "Microsoft Internet Explorer")||ua.indexOf('Trident')!=-1;
		if(isMSIE){
		    document.body.onbeforeunload = function(){
		        // submit时屏蔽提示
		        if(!mute && isFormSubmit){
		          window.event.returnValue = "";
		        }
		    };
		}else{
			if(navigator.userAgent.indexOf('Firefox')!=-1){
				window.onbeforeunload=function (e){
			      // submit时屏蔽提示
				  if(removeCtpWindow)removeCtpWindow(null,2);
			      if(!mute && isFormSubmit){
			    	  return "";
			      }
				}
			}else if(navigator.userAgent.indexOf('Safari')!=-1){
				window.addEventListener("onbeforeunload",function(){
				      // submit时屏蔽提示
						if(removeCtpWindow)removeCtpWindow(null,2);
				      if(!mute && isFormSubmit){
				    	  return "";
				      }
					},false);
			}else{
				window.addEventListener("beforeunload",function(){
			      // submit时屏蔽提示
			      if(!mute && isFormSubmit){
			    	  return "";
			      }
				},false);
			}
		}
	  };
})(jQuery);

var ctpCodeManager = RemoteJsonService.extend({
  jsonGateway : _ctxPath
      + "/ajax.do?method=ajaxAction&managerName=ctpCodeManager",
  selectCode : function() {
    return this.ajaxCall(arguments, "selectCode");
  }
});

var ctpUserPreferenceManager = RemoteJsonService.extend({
  jsonGateway : _ctxPath
      + "/ajax.do?method=ajaxAction&managerName=ctpUserPreferenceManager",
  saveGridPreference : function() {
    return this.ajaxCall(arguments, "saveGridPreference");
  }
});

// 用于AJAX方式载入页面等使用
var AjaxDataLoader = {
  load : function(url, data, callback) {
    jQuery.ajax({
      type : "POST",
      url : url,
      data : data,
      async : true,
      success : function(dataStr) {
        if ($.isFunction(callback)) {
          callback(dataStr);
        }
      }
    });
  }
}

Array.prototype.contains = function(element) {
  for ( var i = 0; i < this.length; i++) {
    if (this[i] == element) {
      return true;
    }
  }
  return false;
}

String.prototype.format = function() {
  var args = arguments;

  return this.replace(/\{(\d+)\}/g, function() {
    return args[arguments[1]];
  });
}
function showMask(){
	// 开始遮罩
	try{if(getCtpTop() && getCtpTop().startProc)getCtpTop().startProc();}catch(e){}
}
function hideMask(){
	// 取消遮罩
	try{if(getCtpTop() && getCtpTop().endProc)getCtpTop().endProc();}catch(e){}
}

function getCtpTop(){
    try {
      var A8TopWindow =  getCtpParentWindow(window);
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
  function getCtpParentWindow(win){
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
  
  function getCtpTopFromOpener(win){
		var currentWin = win.getCtpTop();
		for(var i = 0; i < 10; i++){
			if(typeof currentWin.isCtpTop != 'undefined' && currentWin.isCtpTop){
				return currentWin;
			}
			else{
				currentWin = currentWin.opener.getCtpTop();
			}
		}
	}
	function closeOpenMultyWindow(_id){
		if(_id == undefined){
			_id = window.location+"";
			var _ss = _id.indexOf('/seeyon/');
			if(_ss!=-1){
				_id = _id.substring(_ss)
			}
		}
		var _wmp = getCtpTop()._windowsMap;
		if(_wmp){
			var exitWin = _wmp.get(_id);
			exitWin.close();
			_wmp.remove(_id);
		}
	}
	function getMultyWindowId(idName,url){
		if(url == undefined || idName == undefined){
			return;
		}
		var idStr;
		var _idIndex = url.indexOf(idName);
		var _idEndIndex = url.indexOf("&",_idIndex);
		if(_idEndIndex == -1){
			idStr = url.substring(_idIndex+idName.length+1);
		}else{
			idStr = url.substring(_idIndex+idName.length+1,_idEndIndex);
		}
		return idStr;
	}
	function removeCtpWindow(id,type){
		var _top = getCtpTop();
		if(id== null || id==undefined){
			id = _top.location+"";
			var _ss = id.indexOf('/seeyon/');
			if(_ss!=-1){
				id = id.substring(_ss)
			}
		}
		if(type == 2){
			if(getCtpTop().opener){
				_top = getCtpTop().opener.getCtpTop();
			}
		}
		var _wmp = _top._windowsMap;
		//alert(_wmp.size())
		if(_wmp){
			_wmp.remove(id);
		}
		//alert(_wmp.size())
	}
	/**
	 * 
		var args = new Array();
		
		args['file']   = 'about.htm';
		args['width']  = 480;
		args['height'] = 380;
		
		v3x.openWindow(args});
		
		openCtpWindow({
		id:
		url:
		})
	 */
	function openCtpWindow(args) {
		var html, width, height, x, y, resizable, scrollbars, url,dialog_type;
		this.windowArgs = args;
		this.workSpaceTop = 130;
		this.workSpaceLeft = 0;
		this.workSpaceWidth = parseInt(getCtpTop().document.documentElement.clientWidth) - this.workSpaceLeft;
		this.workSpaceheight =  parseInt(getCtpTop().document.documentElement.clientHeight) - this.workSpaceTop;
		this.settings = {
			dialog_type : "open",
			resizable : "yes",
			scrollbars : "yes"
		};
		html = args['html'];
		url = args['url'];
		if(url.indexOf('seeyon') == 0){
			url = _ctxPath + url;
		}
		dialog_type = args["dialogType"] || this.settings["dialog_type"];
		//alert(url)
		//args["FullScrean"]	
		if(dialog_type == 'modal'){
			width = args['width'] || 320;
			height = args['height'] || 200;
			
			width = parseInt(width);
			height = parseInt(height);
			
			x = args["left"] || parseInt(screen.width / 2.0) - (width / 2.0);
			y = args["top"] || parseInt(screen.height / 2.0) - (height / 2.0);	
		}else if(args["workSpace"]){
			width = this.workSpaceWidth;
			height = this.workSpaceheight;
			
			x = this.workSpaceLeft;
			y = this.workSpaceTop; 
		}else if(args["workSpaceRight"]){
			width = this.workSpaceWidth - 130;
			height = this.workSpaceheight;
			x = 140;
			y = this.workSpaceTop;
		}else{
			width = args['width'] || (this.workSpaceWidth-20);
			height = args['height'] || (this.workSpaceheight + this.workSpaceTop);
			
			x =  args["left"] || 0;
			y = args["top"] || 80; 	
		}

		resizable = args['resizable'] || this.settings["resizable"];
		scrollbars = args['scrollbars'] || this.settings["scrollbars"];


		if (html) {
			var win = window.open("", "ctpPopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,minimizable=" + resizable + ",modal=yes,width=" + width + ",height=" + height + ",resizable=" + resizable);
			if (win == null) {
				return;
			}

			win.document.write(html);
			win.document.close();
			win.resizeTo(width, height);
			win.focus();
			
			return win;
		}else if(dialog_type == 'modal'){
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
		} else{
			var rv = null;
			var modal = (resizable == "yes") ? "no" : "yes";
			var _id = args["id"];
			//alert(_id)
			if(_id == undefined){
				_id = url;
			}
			var _wmp = getCtpTop()._windowsMap;
			if(_wmp){
				for(var p = 0;p<_wmp.keys().size();p++){
					var _kkk = _wmp.keys().get(p);
					try{
						var _fff = _wmp.get(_kkk);
						var _dd = _fff.document;
					}catch(e){
						_wmp.remove(_kkk);
					}
				}
				if(_wmp.size()==10){
					alert($.i18n("window.max.length.js"));
					return;
				}
				var exitWin = _wmp.get(_id);
				//alert(exitWin)
				if(exitWin){
					try{
						var _dd = exitWin.document;
						alert($.i18n("window.already.exit.js"));
						exitWin.focus();
						return;
					}catch(e){
						_wmp.remove(_id);
					}

				}
			}
			if(window.dialogArguments && args["workSpace"]){
				y -=5;
				height -=25;
			}
			var win = window.open(url, "ctpPopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=" + modal + ",minimizable=" + resizable + ",modal=" + modal + ",width=" + width + ",height=" + height + ",resizable=" + resizable);
			if (win == null) {
				return;
			}
			win.focus();
			
			if(_wmp){
				_wmp.putRef(_id,win);
			}
			return win;
		}
	}
