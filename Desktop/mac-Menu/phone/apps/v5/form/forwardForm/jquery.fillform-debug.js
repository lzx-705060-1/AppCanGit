/*
 * jQuery Auto Fill Form Plugin @requires jQuery v1.1 or later @author Andy
 */
(function($) {
  /**
   * $.autofillform() provides a mechanism for fill form automatically, no more
   * script or code, very convenient.
   * 
   * $.autofillform() accepts a single option object argument, the following
   * attributes are supported:
   * 
   * fillformobj: Identifies the data to fill form.
   */
  $._autofill = new Object();

  $.autofillform = function(options) {
    var settings = {};
    options = $.extend(settings, options);

    var fillmaps = options.fillmaps ? options.fillmaps : new Object();
    $._autofill.filllists = fillmaps;

    for ( var f in fillmaps) {
      $("#" + f).fillform(fillmaps[f]);
    }
  }

  $.fn.clearform = function(options) {
    var settings = {
      clearHidden : false
    };
    this.resetValidate();
    options = $.extend(settings, options);
    this.find(':input').each(function() {
      switch (this.type) {
        case 'passsword':
        case 'select-multiple':
        case 'select-one':
        case 'text':
        case 'textarea':
          $(this).val('');
        case 'hidden':
          if (options.clearHidden)
            $(this).val('');
          break;
        case 'checkbox':
        case 'radio':
          this.checked = false;
      }
    });
  }

  $.fn.fillform = function(fillData) {
    if (this[0] == null)
      return;
    this.each(function(i) {
      var frm = $(this);
      frm.resetValidate();
      for ( var fi in fillData) {
        $("#" + fi, frm).each(function(i) {
          $(this).fill(fillData[fi], fi, frm);
        });
      }
      frm = null;
    });
  }

  $.fn.fill = function(v, fi, frm) {
    var el = this[0], eq = $(el), tag = el.tagName.toLowerCase();
    if (v && typeof v == "string")
      v = v.replace(/<\/\/script>/gi, "</script>");
    var t = el.type, val = el.value;
    switch (tag) {
      case "input":
        switch (t) {
          case "text":
            eq.val(v);
            break;
          case "hidden":
            var cp = eq.attrObj("_comp"), ctp;
            if (cp) {
              ctp = cp.attr("compType");
              if (ctp === "selectPeople") {
                var pv = "", pt = "";
                if (v && v.startsWith("{")) {
                  v = $.parseJSON(v);
                  cp.comp(v);
                  pv = v.value;
                  pt = v.text;
                }
                cp.val(pt);
                eq.val(pv);
                break;
              }
            }
            eq.val(v);
            break;
          case "checkbox":
            if (v == val)
              el.checked = true;
            else
              el.checked = false;
            break;
          case "radio":
            if (frm) {
              $("input[type=radio]", frm).each(
                  function() {
                    if ((this.id == fi || this.name == fi) && v == this.value
                        && !this.checked)
                      this.checked = true;
                  });
            } else if (v == el.value && !el.checked) {
              el.checked = true;
            }
        }
        break;
      case "textarea":
        eq.val(v);
        break;
      case "select":
        switch (t) {
          case "select-one":
            eq.val(v);
            break;
          case "select-multiple":
            var ops = el.options;
            var sv = v.split(",");
            for ( var i = 0; i < ops.length; i++) {
              var op = ops[i];
              // extra pain for IE...
              var opv = $.browser.msie && !(op.attributes['value'].specified) ? op.text
                  : op.value;
              for ( var j = 0; j < sv.length; j++) {
                if (opv == sv[j]) {
                  op.selected = true;
                }
              }
            }
        }
        break;
      default:
        if (!((!v || v == '') && $(this)[0].innerHTML.indexOf('&nbsp;') != -1)) {
            if(v && eq.parent('.text_overflow').length == 1) {
                eq.attr('title', v);
              }
          if (v && typeof v == "string")
            v = v.replace(/\n/g, '<br/>');
          el.innerHTML = v;
        }
    }
    if (this.attr('validate')) {
      this.validate();
    }
  };

  $.fn.fillgrid = function(d) {
    this.each(function(i) {
      var t = this.tagName.toLowerCase(), e = $(this);
      switch (t) {
        case "table":
          elem.grid.addData(d);
          break;
      }
    });
  };
})(jQuery);