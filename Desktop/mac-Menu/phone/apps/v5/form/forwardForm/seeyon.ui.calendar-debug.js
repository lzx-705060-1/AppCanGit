/*
 * jQuery Calendar Plugin @requires jQuery v1.1 or later, json plugin and form
 * plugin @author Andy
 */
(function($) {

/**
 *  This function "patches" an input field (or other element) to use a calendar
 *  widget for date selection.
 *
 *  The "params" is a single object that can have the following properties:
 *
 *    prop. name   | description
 *  -------------------------------------------------------------------------------------------------
 *   inputField    | the ID of an input field to store the date
 *   displayArea   | the ID of a DIV or other element to show the date
 *   button        | ID of a button or other element that will trigger the calendar
 *   eventName     | event that will trigger the calendar, without the "on" prefix (default: "click")
 *   ifFormat      | date format that will be stored in the input field
 *   daFormat      | the date format that will be used to display the date in displayArea
 *   singleClick   | (true/false) wether the calendar is in single click mode or not (default: true)
 *   firstDay      | numeric: 0 to 6.  "0" means display Sunday first, "1" means display Monday first, etc.
 *   align         | alignment (default: "Br"); if you don't know what's this see the calendar documentation
 *   range         | array with 2 elements.  Default: [1900, 2999] -- the range of years available
 *   weekNumbers   | (true/false) if it's true (default) the calendar will display week numbers
 *   flat          | null or element ID; if not null the calendar will be a flat calendar having the parent with the given ID
 *   flatCallback  | function that receives a JS Date object and returns an URL to point the browser to (for flat calendar)
 *   disableFunc   | function that receives a JS Date object and should return true if that date has to be disabled in the calendar
 *   onSelect      | function that gets called when a date is selected.  You don't _have_ to supply this (the default is generally okay)
 *   onClose       | function that gets called when the calendar is closed.  [default]
 *   onUpdate      | function that gets called after the date is updated in the input field.  Receives a reference to the calendar.
 *   date          | the date that the calendar will be initially displayed to
 *   showsTime     | default: false; if true the calendar will include a time selector
 *   timeFormat    | the time format; can be "12" or "24", default is "12"
 *   electric      | if true (default) then given fields/date areas are updated for each move; otherwise they're updated only on close
 *   step          | configures the step of the years in drop-down boxes; default: 2
 *   position      | configures the calendar absolute position; default: null
 *   cache         | if "true" (but default: "false") it will reuse the same calendar object, where possible
 *   showOthers    | if "true" (but default: "false") it will show days from other months too
 *
 *  None of them is required, they all have default values.  However, if you
 *  pass none of "inputField", "displayArea" or "button" you'll get a warning
 *  saying "nothing to setup".
 */
    
  $.fn.calendar = function(options) {
	
    //if (this[0].readOnly)
    //  return false;
    var settings = {
      firstDay : 0,
      eventName : "click",
      ifFormat : "%Y-%m-%d",
      autoFill : true,
      align : "Bl",
      range : [ 1900, 2999 ],
      singleClick : true,
      weekNumbers : false,
      showsTime : false,
      timeFormat : "24",
      electric : true,
      cache : true,
      showOthers : false,
      defer : 100,
      minuteStep : 5,
      isClear: true,
      clearBlank:true,
      isOutShow: false,
      autoPopup:false,
      isJustShowIcon:false,//只显示图标不绑定事件
	  isShowIcon:true//是否显示图标【不显示图标则事件绑定在输入框上】
    };
    if (options && options.ifFormat && options.ifFormat != settings.ifFormat)
      settings.autoFill = false;
    if(options && options.minuteStep){
      settings.minuteStep = options.minuteStep;
    }
    var t = this[0], tn = t.tagName.toLowerCase(), p = t.type;
    if (tn == "input") {
      if (p == "text")
        settings.inputField = t;
      else if (p == "button")
        settings.button = t;
    } else
      settings.displayArea = t;
      var params = $.extend(settings, options);
      if(this.attr('_inited') == 1) {
        this.next().remove();
        this.removeAttr('_icoed');
      }else {
        this.attr('_inited', 1);
      }
        
      var vi = params.inputField;
      if (vi && !vi._icoed) {
          var di = $(vi);
          var _left = -20;
          if (di.parent().hasClass("common_txtbox_wrap")) {
              _left = -14;
          }
          var _top = -1;
          if (!$.browser.msie) {
              _top = 1;
            //if (!$.browser.mozilla) {
              //di.addClass("left");
              //}
          }
          if($.browser.msie){
              if ($.browser.version < 8) {
                  _top = 3;
              } ;
          }
          var ei = $("<span class='calendar_icon_area'><span class='calendar_icon'><img src=\"ic_form_date.png\"/></span></span>");
          //IE6 7特殊显示方式
          if ($.browser.msie) {
              if ($.browser.version < 8) {
                //if (!$(t).parent().hasClass("condition_text")) {//对“搜索框”过滤
                  //    di.addClass("left");
                  //}
                  ei = $("<span class='calendar_icon hand' style='margin-left:-20px;'></span>");
              }
          }
          if(!settings.isShowIcon){ei = $("")}
          //>>>判断：图标外部显示？减少input宽度
          if (settings.isOutShow) {
		  // TODO  轻表单 不设置宽度 author  hejianliang
              if (t.tagName.toLowerCase() == "input" && ( typeof(style) =='undefined'  || style =='1')) {
                  if (t.type.toLowerCase() == "text") {
                      var pc = $(t).parents(".common_txtbox_wrap");
                      if(pc.length > 0) {
                          if(($(t).width() == 0 || $(t).width() == 100) && $(t).attr('_widthed') != 'true' )
                            $(t).width('90%');
                        } else{
							$(t).width($(t).width() - 20);
							$(t).parent().find("input[id='"+$(t).attr("id")+"_txt']").each(function(){
								$(this).width($(this).width() - 20);

							});

						}
                  }
              } 
              ei = $("<span class='calendar_icon hand' style='margin-left:5px;'><img src=\"ic_form_date.png\"/></span>");
          }
          //<<<判断：图标外部显示？减少input宽度
        params.button = ei[0];
        // 避免IE8下计算位置错误
        var btn = ei.find('.calendar_icon');
        if(btn.length>0){
          params.button = btn[0];
        }
        //ei.attr("src", "../../skin/default/images/calender/calendar.gif");
        ei.css("cursor", "hand");
        ei.addClass('_autoBtn');
		if(typeof(style)!= "undefined" && style=="4"){
			$(this).addClass("triangle");
		} else {
			di.after(ei);
		}
        di.attrObj("_rel",ei);
        vi._icoed = true;
        vi._autoFill = params.autoFill;
        // bind autofill listener
        /**
         * $(t).keypress(function(e){ var c=e.keyCode; var v=$(this).val();
         * if(vi._autoFill && c!=8){ var l=v.length; if((c==45 || (c>47 && c<58)) &&
         * l<10){ switch(l){ case 4: if(c>49) $(this).val(v+"-0"); else
         * if(c!=45) $(this).val(v+"-"); break; case 5: if(c>49 &&
         * v.charAt(l-1)=="-") $(this).val(v+"0"); break; case 6: if(c>50 &&
         * v.charAt(l-1)=="1") event.returnValue=false; break; case 7: if(c>51)
         * $(this).val(v+"-0"); else if(c!=45) $(this).val(v+"-"); break; case
         * 8: if(c>51 && v.charAt(l-1)=="-") $(this).val(v+"0"); break; case 9:
         * if(c>49 && v.charAt(l-1)=="3") event.returnValue=false; break; }
         * }else{ event.returnValue=false; } } });
         */
      }
      //只显示图标，不绑定事件
      if (settings.isJustShowIcon) {
          return false;
      }
      var tmp = [ "inputField", "displayArea", "button" ];
      for ( var i in tmp) {
        if (typeof params[tmp[i]] == "string") {
          params[tmp[i]] = document.getElementById(params[tmp[i]]);
        }
      }
      if (!(params.flat || params.multiple || params.inputField
          || params.displayArea || params.button)) {
        alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");
        return false;
      }

      function onSelect(cal) {
        var p = cal.params;
        var update = (cal.dateClicked || p.electric);
        if (update && p.inputField) {
          p.inputField.value = cal.date.print(p.ifFormat);
          if (typeof p.inputField.onchange == "function"){
            p.inputField.onchange();
          }
          $(p.inputField).change();
        }
        if (update && p.displayArea)
          p.displayArea.innerHTML = cal.date.print(p.daFormat);
        if (update && typeof p.onUpdate == "function")
          p.onUpdate(cal);
        if (update && p.flat) {
          if (typeof p.flatCallback == "function")
            p.flatCallback(cal);
        }
        if (update && p.singleClick && cal.dateClicked){
          cal.callCloseHandler();
        }
          
          
      	}
      ;

      if (params.flat != null) {
        if (typeof params.flat == "string")
          params.flat = document.getElementById(params.flat);
        if (!params.flat) {
          alert("Calendar.setup:\n  Flat specified but can't find parent.");
          return false;
        }
        var cal = new Calendar(params.firstDay, params.date, params.onSelect
            || onSelect);
        cal.showsOtherMonths = params.showOthers;
        cal.showsTime = params.showsTime;
        cal.time24 = (params.timeFormat == "24");
        cal.params = params;
        cal.weekNumbers = params.weekNumbers;
        cal.setRange(params.range[0], params.range[1]);
        cal.setDateStatusHandler(params.dateStatusFunc);
        cal.getDateText = params.dateText;
		cal.setClear(params.isClear);
		 cal.setClearBlank(params.clearBlank);
        if (params.ifFormat) {
          cal.setDateFormat(params.ifFormat);
        }
        if (params.inputField && typeof params.inputField.value == "string") {
          cal.parseDate(params.inputField.value);
        }
        cal.create(params.flat);
        cal.show();
      }

      this.attr("readonly","readonly").bind("click",function(){chooseDateFromClient(params);});
      var triggerEl = params.button || params.displayArea || params.inputField;
      if(params.autoPopup){
          $(params.inputField).focus(function(){
                triggerEl.click();
          });
        };
        $(params.inputField).bind('popup',function(){
              triggerEl.click();
        });      
      triggerEl["on" + params.eventName] = function() {
    	  //adjust:调用M1的日期选择控件
          chooseDateFromClient(params);
      };
  };

})(jQuery);

$.calendar = function (params) {
	function param_default(pname, def) { if (typeof params[pname] == "undefined") { params[pname] = def; } };
	param_default("inputField",      null);
	param_default("displayArea",     null);
	param_default("button",          null);
	param_default("eventName",       "click");
	param_default("ifFormat",        "%Y-%m-%d");
	param_default("daFormat",        "%Y-%m-%d");
	param_default("singleClick",     true);
	param_default("disableFunc",     null);
	param_default("dateStatusFunc",  params["disableFunc"]);	// takes precedence if both are defined
	param_default("dateTooltipFunc", null);
	param_default("dateText",        null);
	param_default("firstDay",        null);
	param_default("align",           "Br");
	param_default("range",           [1900, 2999]);
	param_default("weekNumbers",     false);
	param_default("flat",            null);
	param_default("flatCallback",    null);
	param_default("onSelect",        null);
	param_default("onClose",         null);
	param_default("onUpdate",        null);
	param_default("date",            null);
	param_default("showsTime",       false);
	param_default("timeFormat",      "24");
	param_default("electric",        true);
	param_default("step",            2);
	param_default("position",        null);
	param_default("cache",           false);
	param_default("showOthers",      false);
	param_default("multiple",        null);
	param_default("returnValue",     false);
	param_default("autoShow",     false);
	param_default("dateString",     false);
	param_default("isClear",     true);
	param_default("clearBlank", true);

	var tmp = ["inputField", "displayArea", "button"];
	for (var i in tmp) {
		if (typeof params[tmp[i]] == "string") {
			params[tmp[i]] = document.getElementById(params[tmp[i]]);
		}
	}
	if (!(params.flat || params.multiple || params.inputField || params.displayArea || params.button)) {
		alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");
		return false;
	}

	function onSelect(cal) {
		var p = cal.params;
		var update = (cal.dateClicked || p.electric);
		if (update && p.inputField) {
			p.inputField.value = cal.date.print(p.ifFormat);
			if (typeof p.inputField.onchange == "function")
				p.inputField.onchange();
		}
		if (update && p.displayArea){
			if (!p.returnValue) {
				p.displayArea.innerHTML = cal.date.print(p.daFormat);
			}else{
				p.displayArea.setAttribute('valueStr',cal.date.print(p.daFormat));
			}			
		}
		if (update && typeof p.onUpdate == "function")
			if(p.returnValue){
		        var date = cal.date;
		        var time = date.getTime()
		        var date2 = new Date(time);
				p.onUpdate(date2.print(p.ifFormat));
			}else{
				p.onUpdate(cal);
			}
		if (update && p.flat) {
			if (typeof p.flatCallback == "function")
				p.flatCallback(cal);
		}
		if (update && p.singleClick && cal.dateClicked)
			cal.callCloseHandler();
	};
	if (params.flat != null) {
		if (typeof params.flat == "string")
			params.flat = document.getElementById(params.flat);
		if (!params.flat) {
			alert("Calendar.setup:\n  Flat specified but can't find parent.");
			return false;
		}
		var cal = new Calendar(params.firstDay, params.date, params.onSelect || onSelect);
		cal.setDateToolTipHandler(params.dateTooltipFunc);
		cal.showsOtherMonths = params.showOthers;
		cal.showsTime = params.showsTime;
		cal.time24 = (params.timeFormat == "24");
		cal.params = params;
		cal.weekNumbers = params.weekNumbers;
		cal.setRange(params.range[0], params.range[1]);
		cal.setDateStatusHandler(params.dateStatusFunc);
		cal.getDateText = params.dateText;
		cal.setClear(params.isClear);
		cal.setClearBlank(params.clearBlank);
		if (params.ifFormat) {
			cal.setDateFormat(params.ifFormat);
		}
		if (params.inputField && typeof params.inputField.value == "string") {
			cal.parseDate(params.inputField.value);
		}
		cal.create(params.flat);
		cal.show();
		return cal;
	}


	if (params.autoShow) {
		var dateEl = params.inputField || params.displayArea;
		var dateFmt = params.inputField ? params.ifFormat : params.daFormat;
		var mustCreate = false;
		var cal = window.calendar;
		if (dateEl){
			var attrStr = dateEl.value  || params.dateString || dateEl.innerHTML;
			params.date = Date.parseDate(attrStr, dateFmt);
		}
		if (!(cal && params.cache)) {
			window.calendar = cal = new Calendar(params.firstDay,
							     params.date,
							     params.onSelect || onSelect,
							     params.onClose || function(cal) { cal.hide(); });
			cal.setDateToolTipHandler(params.dateTooltipFunc);
			cal.showsTime = params.showsTime;
			cal.time24 = (params.timeFormat == "24");
			cal.weekNumbers = params.weekNumbers;
			mustCreate = true;
		} else {
			if (params.date)
				cal.setDate(params.date);
			cal.hide();
		}
		if (params.multiple) {
			cal.multiple = {};
			for (var i = params.multiple.length; --i >= 0;) {
				var d = params.multiple[i];
				var ds = d.print("%Y%m%d");
				cal.multiple[ds] = d;
			}
		}
		cal.showsOtherMonths = params.showOthers;
		cal.yearStep = params.step;
		cal.setRange(params.range[0], params.range[1]);
		cal.params = params;
		cal.setDateStatusHandler(params.dateStatusFunc);
		cal.getDateText = params.dateText;
		cal.setDateFormat(dateFmt);
		cal.setClear(params.isClear);
		cal.setClearBlank(params.clearBlank);
		if (mustCreate)
			cal.create();
		cal.refresh();
		if (!params.position)
			cal.showAtElement(params.button || params.displayArea || params.inputField, params.align);
		else
			cal.showAt(params.position[0], params.position[1]);
			
		return cal;
	}else{
		var triggerEl = params.button || params.displayArea || params.inputField;
		triggerEl["on" + params.eventName] = function() {
			var dateEl = params.inputField || params.displayArea;
			var dateFmt = params.inputField ? params.ifFormat : params.daFormat;
			var mustCreate = false;
			var cal = window.calendar;
			if (dateEl){
				var attrStr = dateEl.value  || dateEl.innerHTML;
				params.date = Date.parseDate(attrStr, dateFmt);
			}
			if (!(cal && params.cache)) {
				window.calendar = cal = new Calendar(params.firstDay,
								     params.date,
								     params.onSelect || onSelect,
								     params.onClose || function(cal) { cal.hide(); });
				cal.setDateToolTipHandler(params.dateTooltipFunc);
				cal.showsTime = params.showsTime;
				cal.time24 = (params.timeFormat == "24");
				cal.weekNumbers = params.weekNumbers;
				mustCreate = true;
			} else {
				if (params.date)
					cal.setDate(params.date);
				cal.hide();
			}
			if (params.multiple) {
				cal.multiple = {};
				for (var i = params.multiple.length; --i >= 0;) {
					var d = params.multiple[i];
					var ds = d.print("%Y%m%d");
					cal.multiple[ds] = d;
				}
			}
			cal.showsOtherMonths = params.showOthers;
			cal.yearStep = params.step;
			cal.setRange(params.range[0], params.range[1]);
			cal.params = params;
			cal.setDateStatusHandler(params.dateStatusFunc);
			cal.getDateText = params.dateText;
			cal.setDateFormat(dateFmt);
			cal.setClear(params.isClear);
			cal.setClearBlank(params.clearBlank);
			if (mustCreate)
				cal.create();
			cal.refresh();
			if (!params.position)
				cal.showAtElement(params.button || params.displayArea || params.inputField, params.align);
			else
				cal.showAt(params.position[0], params.position[1]);
			return false;
		};
	}

	return cal;
};
