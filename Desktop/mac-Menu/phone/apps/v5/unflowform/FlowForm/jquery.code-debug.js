/*
 * jQuery Code Option Plugin @requires jQuery v1.1 or later, jquery.json,
 * jquery.jsongateway @author Andy
 */
(function($) {
  var coi = 1;
  $.fn.codeoption = function(options) {
    var settings = {};
    options = $.extend(settings, options);
    var arr = new Array;
    $(".codecfg", this).add(this).each(
        function(i) {
          var tag = this.tagName;
          if (!tag)
            return;
          tag = tag.toLowerCase();
          var codecfg = options.codecfg ? options.codecfg : $(this).attr(
              "codecfg");
          if (codecfg) {
            var cfgObj = $.codecfgobj(this, codecfg);
            if (options.tags && !options.tags.contains(tag) && !cfgObj.render)
              return;
            arr.push(cfgObj);
          }
        });
    $.genoption(arr, options);
  };

  $.codeoption = function(options) {
    var settings = {
      tags : [ 'select' ]
    };
    options = $.extend(settings, options);
    $(document).codeoption(options);
  };

  $.fn.codetext = function(options) {
    var settings = {};
    options = $.extend(settings, options);
    var arr = new Array;
    $(".codecfg", this).add(this).each(
        function(i) {
          if (!$(this).attr("codecfg"))
            return;
          var tag = this.tagName.toLowerCase();
          if (tag != "select") {
            var codecfg = options.codecfg ? options.codecfg : $(this).attr(
                "codecfg");
            if (codecfg) {
              var cfgObj = $.codecfgobj(this, codecfg);
              if (cfgObj.render)
                return;
              var text = tag == "input" ? $(this).val() : $(this).text();
              if (text) {
                /*
                 * var valueField = cfgObj["valueField"] ? cfgObj["valueField"] :
                 * "code_value"; var w = valueField + "='" + text + "'";
                 */
                arr.push(cfgObj);
              }
            }
          }
        });
    $.genoption(arr, options);
  };

  $.codetext = function(options) {
    $(document).codetext(options);
  };

  $.codecfgobj = function(ele, codecfg) {
    if (codecfg) {
      var idx = codecfg.indexOf('{');
      var cfgObj = $.parseJSON(idx == 0 ? codecfg : ('{' + codecfg + '}'));
      var eid = ele.id ? ele.id : ele.name;
      if (!eid || eid.indexOf("coi_") == 0) {
        eid = "coi_" + coi;
        $(ele).attr("id", eid);
        coi++;
      }
      cfgObj["eleid"] = eid;
      return cfgObj;
    } else
      return {};
  };

  $.genoption = function(arr, options) {
    if (arr.length > 0) {
      var codeBS = new ctpCodeManager();
      var jsonStr = $.toJSON(arr);
      $.fillOption(codeBS.selectCode(jsonStr));
    }
  };

  $.fillOption = function(codeOpt) {
    if (codeOpt) {
      for ( var i = 0; i < codeOpt.length; i++) {
        var ele = $.findTag(codeOpt[i]);
        var codeOptions = codeOpt[i].options;
        var def = codeOpt[i]["defaultValue"];
        if (ele) {
          ele.each(function() {
            var tag = this.tagName.toLowerCase(), t = $(this);
            var ren = codeOpt[i].render;
            if (ren == "radioh") {
              renderRadio(t, codeOptions);
            } else if (ren == "radiov") {
              renderRadio(t, codeOptions, true);
            } else {
              if (tag == "select") {
                $("option[tmp]", t).remove();
                for ( var opt in codeOptions) {
                  var option = new Option(codeOptions[opt], opt);
                  option.tmp = 'tmp';
                  this.options[this.options.length] = option;
                  if (def && def == opt)
                    option.selected = true;
                }
                //节点期限，交换 半个月 和 3周的位置
                if(codeOpt[i].codeId=="collaboration_deadline"){
                 	try{
                 		var optionsObj=this.options;
                 		if(optionsObj[16]&&optionsObj[17]){
                 			var optTemp16=optionsObj[16];
                       		optionsObj.insertBefore(optionsObj[16],optionsObj[17]);
                       		optionsObj.insertBefore(optionsObj[17],optTemp16);
                 		}
                 	}catch(e){}
                 }
                if (ren == 'new') {
                  var dr = $.dropdown({
                    id : this.id
                  });
                  if (def)
                    dr.setValue(def);
                }
              } else if (tag == "input") {
                $(this).val(codeOptions[$(this).val()]);
              } else {
                var val = codeOptions[$(this).text()];
                $(this).text(val);
                if ($(this).attr("title"))
                  $(this).attr("title", val);
              }
            }
            function renderRadio(t, codeOptions, f) {
              var id = t.attr("id"), at = t;
              t.attr("id", id + "_hid");
              for ( var opt in codeOptions) {
                var rlb = $('<label class="margin_r_10 hand"></label>');
                rlb.text(codeOptions[opt]);
                if (f)
                  rlb.addClass('display_block');
                //OA-27642 修复html方式弹出dialog时生成的radio没有name的问题
                var rd = $('<input class="radio_com" type="radio" name="' + id + '">');
                rd.attr("id", id);
                //rd.attr("name", id);
                rd.val(opt);
                rlb.prepend(rd);
                at.after(rlb);
                at = rlb;
                if (def && def == opt)
                  rd.attr("checked", true);
              }
              t.remove();
            }
          });
        }
      }
    }
  };

  $.findTag = function(obj) {
    var ele;
    if (obj.eleid) {
      ele = $("#" + obj.eleid).length == 0 ? $("[name='" + obj.eleid + "']")
          : $("#" + obj.eleid);
    }
    if (!ele) {
      $(".codecfg").each(
          function(i) {
            var varCodecfg = this.codecfg;
            if (varCodecfg) {
              if (varCodecfg.indexOf("codeType") != -1
                  && varCodecfg.indexOf(obj.codeType) != -1) {
                ele = $(this);
              }
              if (varCodecfg.indexOf("codeType") == -1
                  && varCodecfg.indexOf(obj.tableName) != -1) {
                ele = $(this);
              }
            }
          });
    }
    return ele;
  };
})(jQuery);