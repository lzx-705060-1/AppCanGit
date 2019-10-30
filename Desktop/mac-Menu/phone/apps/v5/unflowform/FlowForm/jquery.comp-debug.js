// 为支持动态加载ckeditor依赖的js，需定义此变量，否则ckeditor无法定位
var CKEDITOR_BASEPATH =  _ctxPath + "/common/ckeditor/";
function FCKeditor_OnComplete( editorInstance ){
    $('#' + editorInstance.Name ).attr('editorReadyState','complete');
    $('#' + editorInstance.Name ).trigger('editorReady');
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
//前端事件拦截机制
var ctpEventIntercept = {};
$.ctp={
  bind : function(eventName, func) {
      var listeners = ctpEventIntercept.eventName;
      if (!Boolean(listeners)) {
          listeners = [];
          listeners.push(func);
          ctpEventIntercept.eventName = listeners;
      } else {
          listeners.push(func);
      }
  },
  trigger : function(eventName) {
      var listeners = ctpEventIntercept.eventName;
      if (Boolean(listeners)) {
          for (var i = 0; i < listeners.length; i++) {
              if (!listeners[i]) {
                  return false;
              }
          }
      } else {
          return true;
      }
  }
};

(function($) {
  // 根据浏览器版本确定使用FckEditor还是CkEditor
  var useFckEditor = $.browser.msie  && (parseInt($.browser.version, 10)<7);

  $.messageBox = function(options) {
    return new MxtMsgBox(options);
  };

  $.alert = function(msg) {
    var options = null;
    if(typeof(msg) == "object"){
        options = msg;
    }
    options = options == null ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = options.type ? options.type : 0;
    options.imgType = options.imgType ? options.imgType : 2;
    options.close_fn = options.close_fn ? options.close_fn : null;
    if (typeof(msg) != "object") {
      top.cmp.notification.alert(msg,null,"","确定");
    }else{
      top.cmp.notification.alert(msg.msg,null,"","确定");
    }
    //return new MxtMsgBox(options);
  };
  $.infor = function(msg) {
    var options = null;
    if(typeof(msg) == "object"){
        options = msg;
    }
    var options = options == undefined ? {} : options;
    options.title = $.i18n('system.prompt.js');
    options.type = 0;
    if (typeof(msg) != "object") {
        options.msg = msg;
    }
    options.imgType = options.imgType ? options.imgType : 0;
    options.close_fn = options.close_fn ? options.close_fn : null;
    return new MxtMsgBox(options);
  };
  $.confirm = function(options) {
    var options = options == undefined ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = 1;
    options.imgType = options.imgType ? options.imgType : 4;
    options.close_fn = options.close_fn ? options.close_fn : null;
    return new MxtMsgBox(options);
  };
  /**
   * $.success = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "成功"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 0; options.msg = msg; return new MxtMsgBox(options); };
   * $.warning = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "警告"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 2; options.msg = msg; return new MxtMsgBox(options); };
   */
  $.error = function(msg) {
	    var options = null;
	    if(typeof(msg) == "object"){
        options = msg;
    }
    var options = options == undefined ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = options.type ? options.type : 0;
    options.imgType = options.imgType ? options.imgType : 1;
    options.close_fn = options.close_fn ? options.close_fn : null;
    if (typeof(msg) != "object") {
        options.msg = msg;
    }
    return new MxtMsgBox(options);
  };
  $.gc = function(){
	if (typeof(CollectGarbage) == "function") {
		CollectGarbage();//适用于IE
	}
  };
  $.progressBar = function(options) {
    if (options == undefined) {
      options = {}
    }
    return new MxtProgressBar(options)
  }
  $.dialog = function(options) {
  //  return new MxtDialog(options);
  };
  $.PeopleCard = function (options) {
      insertScriptP();
      return PeopleCard(options);
  }
  $.PeopleCardMini = function (options) {
    //flash people card
      var _options = insertScript(options);
      return new PeopleCardMini_flash(_options);
  }
  $.fn.PeopleCardMini = function (options) {
      var _options = insertScript(options);
      return new PeopleCardMini(_options, this);
  }
  $.metadata = function(data) {
    function Metadata(data) {
      this.data = data;
      function getColumnByProperty(tableName, columnName, propertyName) {
        var table = data[tableName];
        var columns = table['columns'];
        if (columns != null) {
          for ( var i = 0; i < columns.length; i++) {
            if (columns[i][propertyName] == columnName)
              return columns[i];
          }
        }
        return null;
      }
      /**
       * 按表名称和字段名称取字段实体。
       */
      this.getColumn = function(tableName, columnName) {
        return getColumnByProperty(tableName, columnName, 'name');
      };
      this.getColumnByAlias = function(tableName, columnName) {
        return getColumnByProperty(tableName, columnName, 'alias');
      };
      this.getColumns = function(tableName) {
        var table = data[tableName];
        return table['columns'];
      };
    }
    ;
    return new Metadata(data);
  };
  $.renderMetadata = function() {

  }
  /**
   * 按metadata数据渲染组件。
   */
  $.metadataForm = function(container, tableName, options) {
    // var manager = new metadataManager();
    // var data = manager.toJSON();
    var data = serverMetadata;

    var html = [];

    function buildControl(column) {
      var component = column.component;
      if (component == 'codecfg') {
        return buildCodeCfg(column);
      }
      var compHtml = '';
      var validation = '';
      var rule = column.rule;
      if (component != null) {
        rule = rule == null ? '' : ',' + rule;
        compHtml = ' class="comp" comp="type:' + "'" + component + "'" + rule
            + '"';
      } else if (rule != null) {
        // component的rule是comp的补充，否则为校验规则
        validation = ' class="validate" validate="' + rule + '"';
      }
      return '<input type="text" ' + buildIdNameHtml(column.name) + compHtml
          + validation + '/>';
    }
    function buildIdNameHtml(name) {
      var nameHtml = 'name="' + name + '"';
      var idHtml = ' id="' + name + '"';
      return idHtml + nameHtml;
    }
    function buildCodeCfg(column) {
      var compHtml = '';
      var rule = column.rule;

      rule = rule == null ? '' : rule;
      compHtml = ' class="codecfg" codecfg="' + rule + '"';

      return '<select ' + buildIdNameHtml(column.name) + compHtml
          + '><option value="">' + $.i18n('pleaseSelect')
          + '...</option></select>';
    }
    ;
    var columns = options ? options.columns : null;

    var position = options ? options.position : 'in';
    var metadata = $.metadata(data);
    var allColumns = [];
    if (columns) {
      $.each(columns, function(i, name) {
        var column = metadata.getColumnByAlias(tableName, name);
        if (column) {
          allColumns.push(column);
        } else {
          column = metadata.getColumn(tableName, name);
          if (column)
            allColumns.push(column);
        }
      });
    } else {
      allColumns = metadata.getColumns(tableName);
    }
    $.each(allColumns, function(i, column) {
      var label = column.label;
      var input = buildControl(column);
      html
          .push('<tr><th nowrap="nowrap"><label class="margin_r_10" for="'
              + column.name + '">' + label + ':</label></th>'
              + '<td><div class="common_txtbox_wrap">' + input
              + '</div></td></tr>');
    });
    if (position == 'after') {
      $(container).after(html.join(''));
    } else if (position == 'before') {
      $(container).before(html.join(''));
    } else {
      $(container).html(html.join(''));
    }
  };
  /**
   * 面包屑：当前位置
   */
  function showBreadcrumb(div, options) {
    var code = options.code;
    var type = options.type;
    var suffix = options.suffix;
    function showLocation(html){
      var top = getA8Top();
      if(top){
        //首页显示当前位置
        top.showLocation(html);
      }else{
        div.addClass('common_crumbs');
        div.html(html);
      }
    }
    if(options.html){
        showLocation(html);
    }
    function buildResourceMenuMap(menus, parentMenu, map) {
      for ( var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        menu.parentMenu = parentMenu;
        var resourceCode = menu.resourceCode;
        if (resourceCode != null) {
          map[resourceCode] = menu;
        }
        if (menu.items) {
          buildResourceMenuMap(menu.items, menu, map);
        }
      }
      ;
    }
    ;
    function findMenu(code) {
        var ctpTop = getCtpTop ? getCtpTop() : parent ;
        if (ctpTop) {
          var allmenu = $(ctpTop.memberMenus);
          if (allmenu) {
            var cacheKey = 'resourceMenuCache';
            var cache = ctpTop.$.data(ctpTop.document.body, cacheKey);
            if (cache == undefined) {
              cache = new Array();
              buildResourceMenuMap(allmenu, null, cache);
              ctpTop.$.data(ctpTop.document.body, cacheKey, cache);
            }
            ;
            var result = [];
            var menu = cache[code];
            if (menu != undefined) {
              while (menu != null) {
                result.push(menu);
                menu = menu.parentMenu;
              }
              ;
            }
            ;
            return result.reverse();
          }
          ;
        }
        ;
        return [];
      }
      ;
      var menus = findMenu(code);
      if (menus.length > 0) {
      	//$.i18n('seeyon.top.nowLocation.label')
      	var icon = getCtpTop().currentSpaceType || "personal";
      	var skinPathKey = getCtpTop().skinPathKey || "defaultV51";
          var html = '<span class="nowLocation_ico"><img src="'+_ctxPath+'/main/skin/frame/'+skinPathKey+'/menuIcon/'+icon+'.png"></span>';
          html += '<span class="nowLocation_content">';
          var items = [];
          for ( var i = 0; i < menus.length; i++) {
        	if(menus[i].url){
              items.push('<a class="hand" onclick="showMenu(\'' + _ctxPath+menus[i].url + '\')">' + escapeStringToHTML(menus[i].name,false) + '</a>');
            }else{
              items.push('<a>' + escapeStringToHTML(menus[i].name,false) + '</a>');
            }
          }
          ;
          html += items
              .join(' > ');
          if(suffix){
              html += ' > ' + suffix;
          }
          html += '</span>';
        showLocation(html);
      }
    }
    ;
  $.fn.tooltip = function(options) {
    return ___tooltip(options, 1, $(this));
  };
  $.tooltip = function(options) {
    return ___tooltip(options, 0);
  };
  function ___tooltip(options, n, obj) {
    // n用来区分不同方法,1:$.fn.tooltip 和 0: $.tooltip
    var options = options;
    var mtt;
    if (n == 1) {
        var _targetId = obj.attr("id").replace("#", "");
        $.extend(options, { event: true, targetId: _targetId });
        mtt = new MxtToolTip(options);
        obj.mouseenter(function () {
            mtt.setPoint(null,null);
            mtt.show();
        }).mouseleave(function() {
            mtt.hide();
        });
    } else {
        mtt = new MxtToolTip(options);
    }
    return mtt;
  }
  var layoutIdx = 1;
  $.fn.layout = function() {
    var t = $(this), lo = t.attrObj("_layout");
    if (lo)
      return lo;
    var i = layoutIdx, id = t[0].id, nor = $("#" + id + " > .layout_north"), ea = $("#"
        + id + " > .layout_east"), we = $("#" + id + " > .layout_west"), sou = $("#"
        + id + " > .layout_south"), cen = $("#" + id + " > .layout_center"), cfg = {
      id : id
    }, co, cs, cl;

    nor.each(function() {
      this.id = this.id ? this.id : ("north" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.northArea = co;
    });

    ea.each(function() {
      this.id = this.id ? this.id : ("east" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.eastArea = co;
    });

    we.each(function() {
      this.id = this.id ? this.id : ("west" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.westArea = co;
    });

    sou.each(function() {
      this.id = this.id ? this.id : ("south" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.southArea = co;
    });

    cen.each(function() {
      this.id = this.id ? this.id : ("center" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.centerArea = co;
    });
    t.attrObj("_layout", new MxtLayout(cfg));
    layoutIdx++;
  };
  $.fn.compThis = function(options) {
    var t = this;
    if (t.attrObj("_comp"))
      t = t.attrObj("_comp");
    var tc = t.attr("comp"), tj, tp;
    if (tc) {
      tj = $.parseJSON('{' + tc + '}');
      if (options) {
        tj = $.extend(tj, options);
        var com = $.toJSON(tj);
        t.attr("comp", com.substring(1, com.length - 1));
      }
      tp = tj.type;
      t.attr('compType', tp);
      switch (tp) {
        case 'onlyNumber':{
            t.onlyNumber(tj);
            break;
        }
        case 'calendar':
            if(style == '4') {
                getNewCalendar(t,tj);//TODO 轻表单启用新日历组件
            }else {
                break;//todo  m3暂时不支持日期控件的选择
//                t.calendar(tj);
            }

		/* if(typeof(style)!= "undefined" && style=="4"){
			t.addClass("triangle");
			var recordID = getRecordIdByJqueryField(t);
			var returnValue = {};
			returnValue.value = formatDate;
			returnValue.fieldID = t.attr("id");
			returnValue.recordID = recordID;
			
			var currYear = (new Date()).getFullYear();	
			var opt={};
			opt.date = {preset : 'date'};
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};
			opt.default = {
				theme: 'android-ics', //皮肤样式
		        display: 'bottom', //显示方式 
		        mode: 'clickpick', //日期选择模式
				lang:'zh',
		        startYear:currYear - 20, //开始年份
		        endYear:currYear + 20, //结束年份
				okCallback : function(formatDate) {
				  returnValue.value = formatDate;
				  sendChooseDateResultFromClient(returnValue);
                },
				clearCallback : function() {
				  returnValue.value = "";
				  sendChooseDateResultFromClient(returnValue);
				}
			};
			if(tj.showsTime){
			
					var optDateTime = $.extend(opt['datetime'], opt['default']);
					setTimeout(function(){
						t .mobiscroll(optDateTime).datetime(optDateTime);
					},200);
					
				} else {
					setTimeout(function(){
						t.scroller($.extend(opt['date'], opt['default']));
					},200);
				} 
			} else { */
//
		// }
          break;
        case 'layout':
          t.layout();
          break;
        case 'tab':
          t.tab(tj);
          break;
        case 'fileupload':
        	   // TODO 新框架转旧框架附件解析出错，无法处理
      	  try{
      		  initFileUpload(t, tj);
      	  }catch(e){
      	  }
          break;
        case 'attachlist':
          fileList(t);
          break;
        case 'showattachlist':
          showFileList(t, tj);
          break;
        case 'assdoc':
          assdoc(t, tj);
          break;
        case 'selectPeople':
            tj.srcElement = t;
          t.selectPeople(tj);
          break;
        case 'editor':
          t.showEditor(tj);
          break;
        case 'tooltip':
          t.tooltip(tj);
          break;
        case 'slider':
          var _temp = $("<div id='"+t.attr('id')+"'></div>");
          t.replaceWith(_temp);
          t = _temp;
          t.slider(tj);
          break;
        case 'workflowEdit':
          var cu = $.ctx.CurrentUser;
          if (tj.isTemplate) {//模板流程：协同、表单、公文等
            if (tj.isView) {
              t.click(function() {
                showWFTDiagram(window.top, tj.workflowId, window,cu.name,cu.loginAccountName);
              });
            } else {
              t.click(function() {
                createWFTemplate(
                    window.top,
                    tj.moduleType, 
                    tj.formApp, //非表单模板，请传-1
                    tj.formId,//非表单模板，请传-1
                    tj.workflowId, 
                    window,
                    tj.defaultPolicyId,//默认节点权限
                    cu.id, 
                    cu.name, 
                    cu.loginAccountName,
                    tj.flowPermAccountId,
                    tj.operationName,//非表单模板，请传-1
                    tj.startOperationName,//非表单模板，请传-1
                    tj.defaultPolicyName
                );
              });
            }
          } else {//非模板流程
            if (tj.isView) {
              t.click(function() {
                showWFCDiagram(window.top,tj.caseId,tj.workflowId,false,false,null,null,"collaboration");
              });
            }else{
              t.click(function() {
                createWFPersonal(
                    window.top,
                    tj.moduleType,
                    cu.id, 
                    cu.name,
                    cu.loginAccountName,
                    tj.workflowId,
                    window,
                    tj.defaultPolicyId,
                    cu.loginAccount,
                    tj.defaultPolicyName
                 );
              }
              );
            }
          }
          break;
        case 'correlation_form':
          showInput(t, tp, tj);
          break;
        case 'affix':
          showInput(t, tp, tj);
          break;
        case 'associated_document':
          showInput(t, tp, tj);
          break;
        case 'insert_pic':
          showInput(t, tp, tj);
          break;
        case 'correlation_project':
          showInput(t, tp, tj);
          break;
        case 'data_task':
          showInput(t, tp, tj);
          break;
        case 'search':
          showInput(t, tp, tj);
          break;
        case 'breadcrumb':
          if(!tj.code) {
            tj.code = _resourceCode;
          }
          showBreadcrumb(t, tj);
          break;
        case 'autocomplete':
        	  var heigth = t.height();
			  if(heigth < 40){
				t.css("height", "40px");
			  }
            if(style == '4') {
                renderSelect(t);//TODO 在轻表单中开启select组件的样式 辛裴2015-08-18 18:21
            }

        	 
          break;  
          // 封装一切的List选择  
        case 'select':
          // 下拉方式选择
          if(tj.mode == 'dropdown'){
            if(t.imageDropdown){
              return t.imageDropdown(tj);
            }
          }
          break;           
        case 'office':
          t.showOffice(tj);
          break;
        case 'PeopleCardMini':
          t.PeopleCardMini(tj);
          break;
        case 'htmlSignature':
          t.htmlSignature(t,tj);
          break;
        case 'chooseProject':
            t.chooseProject(tj);
            break;
        case 'map':
        	var t = $(this);
			 var tempextendsparent=t.parent();
	        	var tempimg = "";
	        	var recordID = getRecordIdByJqueryField(t);
	        	tj.recordId  = recordID;
	        	var commanType = lbsInputTypeCheck(tj);
	        	if (commanType == C_iInvokeNativeCtrlCommand_PhotoLocation){
	    			lbsPhotoLocationCheck(tempextendsparent,tj,t);
	    		} else {
					if(commanType == C_iInvokeNativeCtrlCommand_Marker){
	            		tempimg = $("<img/>").attr("src","ic_form_callout.png");
	            	//	t.removeAttr("readonly");
	        		}else if (commanType == C_iInvokeNativeCtrlCommand_Sign){
	        			tempimg = $("<img/>").attr("src","ic_form_sign.png");
	        		}else if (commanType == C_iInvokeNativeCtrlCommand_PositionLocation){
					//	t.removeAttr("readonly");
	        			tempimg = $("<img/>").attr("src","ic_form_location.png");
	        		}
					if(tj.value && tj.value!="-1" ) {
                        var spanRe;
                        if(typeof(style) !='undefined'  && style == '4') {
                            spanRe = renderLbsInput(tempextendsparent,tj,tj.text,tj.fieldName);//TODO 轻表单启用新样式展现 辛裴2015-08-19 11:20
                            if(tj.canEdit == true ||tj.canEdit =='true') {//因为都是用同一个textarea来展示和点击事件所以，避免在待办情况下两次绑定点击事件的情况
                                spanRe.unbind("click");
                            }else {
                                spanRe.bind("click",{param:tj}, function(event){
                                    spanRe.blur();
                                    var data = event.data.param;
                                    mLbsFromClient(data);
                                });
                            }
                        }else {
                            spanRe = repleaceLbsInput(tj,tj.text,tj.fieldName);
                            spanRe.bind("click",{param:tj}, function(event){
                                spanRe.blur();
                                var data = event.data.param;
                                mLbsFromClient(data);
                            });
                        }
	    				t.val(tj.value);
						t.after(spanRe);
						var width = t.width();
						spanRe.css("width",(width -16)+"px").css("display","block").css("white-space","pre-wrap");
	    				t.hide();

	    			}
	    			if(tj.canEdit == true ||tj.canEdit =='true' ){
	    				
						//TODO  轻表单   不修改宽度
						if( typeof(style) !='undefined'  && style =='4') {
//							tempimg = $("<span class = 'map_position_48'>");//TODO 轻表单样式注释掉使用图标来操作定位改用textarea来代替 辛裴2015-08-19 11:32
                            if(tempextendsparent.find("textarea[id="+tj.fieldName+"_txt]").length == 0) {
                                tempimg = $("<textarea/>");
                                tempimg.attr("id",tj.fieldName+"_txt").attr("name",tj.fieldName+"_txt").css("text-align","left").css("color","blue").addClass("triangle");
                            }else {
                                tempimg = tempextendsparent.find("textarea[id="+tj.fieldName+"_txt]");
                            }
                            t.css("display","none");
						} else {
							var width = t.width();
							t.css("width",(width -16)+"px");
						}
						tempextendsparent.append(tempimg);
						tempimg.bind("click",{param:tj}, function(event){
                            $(this).blur();
							var data = event.data.param;
//                            renderLbsInput(tempextendsparent,tj,"2015-08-19 四川省成都市武侯区萃华路靠近航兴国际广场",tj.fieldName);
//                            var obj = {
//                                lbsId : 123456,
//                                lbsAddr : "2015-08-19<br/> 四川省成都市武侯区萃华路靠近航兴国际广场",
//                                filedId : tj.fieldName,
//                                recordId : 0
//
//                            }
//                            sendMapMarkerFromClient(obj);
							mLbsFromClient(data);
						});
	    			}
	        		tempimg ="";
	    			
	    		}
			break;
          case "barCode":   //二维码按钮
              t.barCode(tj,t);
              break;

      }
    }
  };
  $.fn.comp = function(options) {
    $(".comp", this).add(this).each(function(i) {
      $(this).compThis(options);
    });
  };
  $.fn.chooseProject = function(jsonObj) {
	  var input = $(this);
      var width = input.width();
      var id = input.attr("id");
      input.attr("id",id+"_txt");
      input.attr("name",id+"_txt");
      var htmlStr = $("<input id='"+id+"' name='"+id+"' type='hidden'/>");
      if(typeof(jsonObj.text)!='undefined'){
          input.val(jsonObj.text);
          input.attr("title",jsonObj.text);
      }
      if(typeof(jsonObj.value)!='undefined'){
          htmlStr.val(jsonObj.value);
      }
      input.before(htmlStr);
      var spanStr=$("<span></span>");
      isEmphasize:true,
      input.after(spanStr);
      if(jsonObj.okCallback!=undefined){
    	  input.blur(function(){
    		  jsonObj.okCallback(spanStr);
    	  })
      }
      if(htmlStr.height()!=0){
          input.height(htmlStr.height());
      }
	  //TODO  轻表单 不设置宽度 author hejianliang
	  if( typeof(style) =='undefined'  || style =='1') {
		  width = width-spanStr.outerWidth(true)-8;
		  if(width>0){
			  input.width(width);
		  }else{
			  //IE7 下input.width()可能为0,只能延时后再获取。
			  setTimeout(function(){
				  width=input.width()-spanStr.outerWidth(true)-8;
				  input.width(width);
			  },300);
		  }
	  } 
      spanStr.unbind("click").bind("click",function(){
          var selectId = input.prev().val();
          var resetCallback = jsonObj.resetCallback;
          var OkCallback = jsonObj.okCallback;
          var chooseProjectdialog = $.dialog({
             url : _ctxPath+'/project.do?method=getAllProjectList&isFormRel=true&selectId='+selectId,
             title : $.i18n('form.base.relationProject.title'),
             width : 700,
             height : 450,
             targetWindow : getCtpTop(),
             buttons : [ {
               text : $.i18n('common.button.reset.label'),
               handler : function() {
                   input.val("");
                   input.prev().val("");
                   if(resetCallback!=undefined){
                       resetCallback(spanStr);
                   }
                   chooseProjectdialog.close();
               }
             }, {
               text : $.i18n('common.button.ok.label'),
               handler : function() {
                   var retObj = chooseProjectdialog.getReturnValue();
                   if(retObj.value==''){
                       $.alert($.i18n('form.base.relationProject.chooseItem'));
                       return;
                   }else{
                       input.val(retObj.name);
                       input.attr("title",retObj.name);
                       input.prev().val(retObj.value);
                       if(OkCallback!=undefined){
                           OkCallback(spanStr);
                       }
                       chooseProjectdialog.close();
                   }
               }
             }, {
                 text : $.i18n('common.button.cancel.label'),
                 handler : function() {
                   chooseProjectdialog.close();
                 }
               }]
           });
      });
      
      renderRelationProject(id);
  }; 
  $.fn.showEditor = function(options) {
      var input = $(this);
      if (options.contentType == 'html') {
        var contextPath = _ctxPath;
        var settings = $.extend({}, {
          toolbarSet : 'Basic',
          category : '1',
          maxSize : 1048576
        }, options);
        input.attr('editorReadyState','loading');
        if(useFckEditor){
            $.getScript(contextPath + "/common/RTE/fckeditor.js", function() {
              var sBasePath = contextPath + "/common/RTE/";
      
              var oFCKeditor = new FCKeditor(input[0].id);
              oFCKeditor.BasePath = sBasePath;
              oFCKeditor.Config["DefaultLanguage"] = _locale.replace('_', '-')
                  .toLowerCase();
              oFCKeditor.ToolbarSet = settings.toolbarSet;
      
              oFCKeditor.Config["ImageUploadURL"] = contextPath
                  + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                  + settings.category + '&extensions=jpg,gif,jpeg,png&maxSize='
                  + settings.maxSize;
              oFCKeditor.Config["FlashUploadURL"] = contextPath
                  + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                  + settings.category + '&extensions=swf,fla&maxSize='
                  + settings.maxSize;
              oFCKeditor.Config["ImageUploadMaxFileSize"] = "1M";
              oFCKeditor.ReplaceTextarea();
            });
        }else{
            $.getScript(contextPath + '/common/ckeditor/ckeditor.js', function() {
              CKEDITOR.basePath = contextPath + "/common/ckeditor/";
              CKEDITOR.baseHref = CKEDITOR.basePath;
              if (CKEDITOR.instances[input[0].id]) {
                  CKEDITOR.instances[input[0].id].destroy();
              }
              // 页面定义了editorStartupFocus变量，则以之控制编辑器是否设置焦点
              var f = (typeof(editorStartupFocus) == 'undefined') ? false : editorStartupFocus;
              CKEDITOR.replace(input[0].id,{
                  height : '100%',
                  startupFocus : f,
                  on : {
                      instanceReady : function( ev ) { 
                          input.attr('editorReadyState','complete');
                          input.trigger('editorReady',ev);
                          function resizeEditor(){
                        	  var editor = CKEDITOR.instances[input.attr('id')];
                              //OA-22421 修复正文由html切换到office时的resize事件空值异常
                              var cts = editor.ui.space( 'contents' );
                              if(cts) {
                            	  var height = document.body.clientHeight - $(cts.$).offset().top - 5;
                                height = height<0 ? 0 : height;
                                try {
                                  if(_fckEditorDecentHeight) {
                                    height -= 20;
                                  }
                                }catch(e){}
                                cts.setStyle( 'height', height +'px' );
                                // 解决chrome resize时正文区域变宽问题
                                var iframe = editor.window.getFrame();
                                if(iframe.$.style.width != '786px'){
                                	iframe.$.style.width = '786px';
                                }
                            }
                          }
                          resizeEditor();
                          window.onresize = function(event) {
                              resizeEditor();
                          }
                          $(input[0]).parent().resize(function(){
                              resizeEditor();
                          });
                          // 为了避免onbeforeunload弹出提示，必须对a作特殊处理
                          if(v3x && v3x.isMSIE){
                            ev.editor.on('dialogShow', 
                                function(dialogShowEvent){
                                  var allHref = dialogShowEvent.data._.element.$.getElementsByTagName('a');
                                  for (var i = 0; i < allHref.length; i++) {
                                    var href = allHref[i].getAttribute('href');
                                    if(href && href.indexOf('void(0)')>-1){
                                      allHref[i].removeAttribute('href');
                                    }
                                  };

                            });      
                          }   
                      }
                  }
              });
            });      
        }

      }
    };
  /**
   * 取得编辑器的内容。
   */
  $.fn.getEditorContent = function(options) {
    var input = $(this);
    var tc = input.attr('comp');
    if (tc) {
      var tj = $.parseJSON('{' + tc + '}')
      if (tj.type == 'editor' && tj.contentType == 'html') {
        if(useFckEditor){
          return FCKeditorAPI.GetInstance(this.attr('id')).GetHTML();
        }else{
          return CKEDITOR.instances[this.attr('id')].getData();
        }
      }
    }
    return null;
  }
  function setCkEditorData(name,value){
    if(this.CKEDITOR){
      var editor = CKEDITOR.instances[name];
      editor.setData(value);  
    }
    $('#'+name).bind('editorReady',function(){
      var editor = CKEDITOR.instances[name];
      editor.setData(value);      
    });
  }
  $.fn.setEditorContent = function(value) {
    var input = $(this);
    var tc = input.attr('comp');
    if (tc) {
      var tj = $.parseJSON('{' + tc + '}')
      if (tj.type == 'editor' && tj.contentType == 'html') {
        if(useFckEditor){
          FCKeditorAPI.GetInstance(this.attr('id')).SetHTML(value);
        }else{
            setCkEditorData(this.attr('id'),value);
        }        
        return null;
      }
    }
    if (input.val)
      input.val(value);
    return null;
  }
  $.fn.selectPeople = function(options) {
      var input = $(this), id = input.attr('id'), inited = input.attr('_inited'), delSize = 28;
    var valueInputName = id, valueInput, btp, btcl, bth, btn, showbtn = false;
    if (inited) {
      valueInput = input.next();
      valueInputName = valueInput.attr("id");
      btp = valueInput.next(), btcl = btp.attrObj("tmpclone"), bth = btp
          .attr("_hide");
      btp.remove();
      valueInput.remove();
    } else {
      input.attr('id', id + '_txt');
      input.attr('name', id + '_txt');
      input.attr('readonly', 'readonly');
      if (showbtn&&!options.extendWidth&&input.width()!=0)
          input.width(input.width() - delSize);
      input.attr('_inited', 1);
    }
    if(options.text){
      input.val(options.text);
      input.attr('title',options.text);
    }
    valueInput = $('<input type="hidden" />');
    valueInput.attr('id', valueInputName);
    valueInput.attr('name', valueInputName);
    valueInput.attrObj('_comp', input);
    if(options.value){
      valueInput.val(options.value);
    }
    input.after(valueInput);
    if(options.valueChange){
    	valueInput.change(options.valueChange(valueInput));
    }
    if (showbtn) {
      var multiSelect = !(options.maxSize===1);
      var selectTypes = {'Account' : 'account',
        'Department' : 'dept',
        'Team' : 'team',
        'Post' : 'post',
        'Level' : 'level',    
        'Member' : 'people'     
      };
      var selectType = selectTypes[options.selectType];
      selectType = selectType ? selectType : 'people';
      btn = $('<img src="ic_form_people.png"/>');
      input.attrObj("_rel", btn);// for enable/disable using
      btn.attr('_isrel', 1);
      btn.addClass('_autoBtn');

      if (btcl)
        btn.attrObj('tmpclone', btcl);
      if (bth == 1){
		btn.hide();
	  }
	  if(typeof(style)== "undefined" || style!="4"){
		valueInput.after(btn);
	  } else {
		input.addClass("triangle");
	  }
    } else {
      btn = input;
      btn.css({padding:"0",margin:"0"});
    }
    //继承原有input的宽度
    if(options.extendWidth){
        var oldDisp = valueInput.css("display");
		var currentWidth = input.width();
		if(typeof(style)!="undefined" && style != "4"){
			//if(currentWidth > 24) {
			//	input.css("width",(currentWidth - 24) +"px" );
			//}
		}
		
        valueInput.css("display",oldDisp);
    }else{
		var temptag = false;
		if(input.width()<=0){
			input.css("width","98%");
			temptag = true;
		}
		if(input.width()<=0){
			input.css("width","98");
			temptag = true;
		}
        if (showbtn){
			var w = 0;
			if($.browser.msie && $.browser.version=='7.0'){
				w = input.width()*2-input.outerWidth(true)-btn.outerWidth(true)-15;
			}else{
				w = input.width()*2-input.outerWidth(true)-btn.outerWidth(true)-2;
			}
			if(w>0){
    			input.width(w);
    		}
        }
    }
    function setValue(ret){
        input.val(ret.text);
        input.attr('title',ret.text);
        // 缓存以解决returnValueNeedType为false时的值传递问题
        if(ret.obj && (options.returnValueNeedType===false)){
          input.data('obj',ret.obj);
        }
        valueInput.val(ret.value);  
        if(options.valueChange){
        	valueInput.change(options.valueChange(valueInput));
        }
        // 将中间选择的结果记录到comp中，避免再次调用.comp方法回到初始状态
        var tc = input.attr("comp");
        if (tc) {
          var tj = $.parseJSON('{' + tc + '}');
          tj.value = ret.value;
          tj.text = ret.text;
          var com = $.toJSON(tj);
          input.attr("comp",com.substring(1, com.length - 1));
        }           
    }
    if(options.excludeElements){
        
    }
    options.id = input.attr('id');
    if (options.mode != 'modal') {
      options.callbk = function(ret) {
        setValue(ret);
        input.focus(); // for trigger validate component
      };
    }
    if (!options.params)
      options.params = {};
    var optionsHasElements = options.elements;
	btn.unbind("click").click(function() {
        options.params.value = valueInput.val();
        options.params.text = input.val();
        if(!options.elements){
          var obj = input.data('obj');
          // 如果没有在options中显式传入elements，取缓存的obj对象传入
          if(obj){
            options.elements = obj;
          }
        }      
        var ret = $.selectPeople(options,valueInput);
        if (ret) {
          setValue(ret);
        }
      });
    input.unbind("click").click(function() {
        input.blur();
        options.params.value = valueInput.val();
        options.params.text = input.val();
        if(!options.elements){
          var obj = input.data('obj');
          // 如果没有在options中显式传入elements，取缓存的obj对象传入
          if(obj){
            options.elements = obj;
          }
        }      
        var ret = $.selectPeople(options,valueInput);
        if (ret) {
          setValue(ret);
        }
      });
  };
  $.selectPeople = function(options,eventObj) {
      choosePersonFromClient(options,eventObj);
  };
  $.selectFunction = function(options) {
	    var settings = $.extend({}, {
	      templateCode : '',
	      category : '*'
	    }, options);
	    var url = _ctxPath+'/custom/function.do?category=' + settings.category + '&templateCode=' +settings.templateCode;
	var dialog = $.dialog({
  	id : "SelectFunctionDialog",
  	url : url,
  	width : 708,
  	height : 530,
  	title : $.i18n("functionmod.title.info"),
  	checkMax:true,
  	transParams : options,
  	targetWindow : getCtpTop(),
  	buttons : [{
	              text : $.i18n('common.button.ok.label'),
	              handler : function() {
	                var retv = dialog.getReturnValue();
	                if (typeof(retv) == undefined||retv===null) {
	                   alert($.i18n('functionmod.select.isnul'));
	                  return;
	                }
	                settings.methodName = retv;

              if(options.onOk){
                options.onOk(retv);
                __setFunctionParams(settings);
              }

	            	  dialog.close();
	            }}, {
	              text : $.i18n('common.button.cancel.label'),
	              handler : function() {
	                dialog.close();
	              }
	            }]
	});
};
	  function __setFunctionParams(options){
		  	var url = _ctxPath+'/custom/function.do?method=setParams&category=' + options.category +
		  	     '&templateCode=' +options.templateCode +
		  	     '&methodName=' + options.methodName + 
		  	     '&formApp=' + options.formApp;
		  	var dialog = $.dialog({
		        id : "SetParamsFunctionDialog",
		        url : url,
		        width : 708,
		        height : 530,
		        title : $.i18n("functionmod.title.info"),
		        checkMax:true,
		        transParams : options,
		        targetWindow : getCtpTop(),
		        buttons : [{
		            text : $.i18n('common.button.ok.label'),
		            handler : function() {
			            var retv = dialog.getReturnValue();
			            if(retv!=null && retv!=""){
					        if(options.onOk){
					          options.onOk(retv);
					        }
			                dialog.close();
			            }
		        }}, {
		            text : $.i18n('common.button.cancel.label'),
		            handler : function() {
		                dialog.close();
		            }
		        }]
		    });
		  }
  $.fn.showOffice = function(options) {
      var settings = {
        webRoot : _ctxServer
      };
      options = $.extend(settings, options);
      //如果指定类型无法打开，则尝试使用另一种类型打开 如果都不支持的话对office控件类型进行提示
      var typeReplace = [];
      typeReplace['.doc'] = '.wps';
      typeReplace['.wps'] = '.doc';
      typeReplace['.et'] = '.xls';
      typeReplace['.xls'] = '.et';
      typeReplace['.pdf'] = '.pdf';
      var f = $.ctx.isOfficeEnabled(options.fileType);
      if(!f && typeReplace[options.fileType]){
          f = $.ctx.isOfficeEnabled(typeReplace[options.fileType]);
          /*if(f){
              options.fileType = typeReplace[options.fileType];
          }*/
      }
      if(f) {
        var od = $('<div id="officeFrameDiv" style="display:none;height:100%"><iframe src="" name="officeEditorFrame" id="officeEditorFrame" frameborder="0" width="100%" height="100%"></iframe></div>');
        this.replaceWith(od);
        if(options.fileType == '.pdf'){
      	  createPdfOcx(options)
        }else{
      	  createOCX(options);
        }
        createOCX(options);
        if(typeof officeSupportCallback != "undefined") {
          officeSupportCallback();
        }
      }else {
        this.replaceWith($('<center><font color="red" style="font-weight:bold">' + $.i18n('common.body.type.officeNotSupported') + '</font></center>'));
        if(typeof officeNotSupportCallback != "undefined") {
          officeNotSupportCallback();
        }
      }
    };
  $.fn.tab = function(tj) {
    var tb = this.attrObj("tabObj");
    if (tb)
      return tb;
    tj.id = this.attr('id');
    tb = new MxtTab(tj);
    this.attrObj("tabObj", tb);
    if (tj.mode && 'mouseOver' === tj.mode)
      tb.setMouseOver();
  };
  $.fn.tabEnable = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.enable(tgt);
  };

  $.fn.tabDisable = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.disabled(tgt);
  };

  $.fn.tabCurrent = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.setCurrent(tgt);
  };

  $.fn.toolbar = function(options) {
    var par = {
      contextPath : _ctxPath,
      render : this[0].id
    };
    par = $.extendParam(par, options);
    var myBar = new WebFXMenuBar(par), toolbarOpt = options.toolbar;
    this.attrObj("toolbarObj", myBar);
    if (toolbarOpt) {
      if (!_isDevelop) {
        var toolbarOptTmp = [];
        $.each(toolbarOpt, function(n, val) {
          var rc = val.resCode, pi = val.pluginId, ps = false;
          $.privCheck(rc, pi, function() {
            toolbarOptTmp.push(val);
            ps = true;
          });
          if (ps && val.subMenu) {
            var smOpt = [];
            $.each(val.subMenu, function(ns, sm) {
              rc = sm.resCode, pi = sm.pluginId;
              $.privCheck(rc, pi, function() {
                smOpt.push(sm);
              });
            });
            val.subMenu = smOpt;
          }
        });
        toolbarOpt = toolbarOptTmp;
      }
      $.each(toolbarOpt, function(n, val) {
        var pm = $.extendParam({}, val);
        if (val.items)
          pm.items = val.items; // select的option
        if (val.subMenu)
          pm.subMenu = initSubMenu(val.subMenu);
        pm.id = pm.id ? pm.id : ("mb_" + n);
        myBar.add(new WebFXMenuButton(pm));
      });
    }
    function initSubMenu(sm) {
      var tm = new WebFXMenu();
      $.each(sm, function(n, val) {
        var pm = $.extendParam({}, val), mi;
        pm.id = pm.id ? pm.id : ("mi_" + n);
        mi = new WebFXMenuItem(pm);
        tm.add(mi);
        // doesn't support hirachy menu currently
        // if (val.subMenu)
        // mi.add(initSubMenu(val.subMenu));
      });
      return tm;
    }

    myBar.show();
    return myBar;
  };

  $.fn.toolbarEnable = function(tgt) {
    var tb = this.attrObj("toolbarObj");
    if (tb)
      tb.enabled(tgt);
  };

  $.fn.toolbarDisable = function(tgt) {
    var tb = this.attrObj("toolbarObj");
    if (tb)
      tb.disabled(tgt);
  };

  $.fn.menu = function(options) {
    var par = $.extendParam({
      render : this[0].id
    }, options);
    var menubar = new MxtMenuBar(par);

    if (options.menus) {
      $.each(options.menus, function(n, val) {
        var pm = $.extendParam({}, val);
        var menu = new MxtMenu(pm);
        if (val.items) {
          $.each(val.items, function(m, it) {
            menu.add(initMenuItem(it));
          });
        }
        menubar.add(menu);
      });
    }
    function initMenuItem(mi) {
      var pm = $.extendParam({}, mi);
      var mit = new MxtMenuItem(pm);
      if (mi.items) {
        var sm = new MxtSubMenu({});
        mit.add(sm);
        $.each(mi.items, function(n, is) {
          sm.add(initMenuItem(is));
        });
      }
      return mit;
    }

    menubar.show();

  };
  
  $.fn.htmlSignature = function(t,tj) {
      if(t.length>0&&t[0].tagName.toLowerCase()==="input"){
          var twidth = 0;
		  //TODO  OA-109556M3Android端-签章字段目前有2个问题，请一一解决
		  t.parent().css("border","");
		  //TODO end
          if(t.css("width")==="100%"||t.width()==0){
              twidth = t.parent("div").parent("span").parent().width();
          }else{
              twidth = t.width();
          }
          
          var theight = t.height()+"";
          if(twidth=="0"){
              twidth = "100";
          }
          if(theight=="0"){
              theight = "20";
          }
          t[0].initWidth = twidth;
          t[0].initHeight = theight;
          t.attr("initWidth",twidth);
          t.attr("initHeight",theight);
      }
      tj.signObj = t[0];
      //adjust:添加M1自己处理逻辑
      addSignatureCtrl(t,tj);
  };
  
  function initFileUpload(t, tj) {
    t.attrObj("_attachShow") ? t.attrObj("_attachShow").remove() : null;
    downloadURL = _ctxPath
        + "/fileUpload.do?type="
        + ((tj.customType == undefined) ? 0 : tj.customType)
        + ((tj.firstSave == undefined) ? '' : ("&firstSave=" + tj.firstSave))
        + "&applicationCategory="
        + tj.applicationCategory
        + "&extensions="
        + ((tj.extensions == undefined) ? '' : tj.extensions)
        + ((tj.quantity == undefined) ? '' : ("&quantity=" + tj.quantity))
        + "&maxSize="
        + ((tj.maxSize == undefined) ? '' : tj.maxSize)
        + "&isEncrypt="
        + ((tj.isEncrypt == undefined) ? '' : tj.isEncrypt)
        + "&popupTitleKey="
        + ((tj.attachmentTrId == undefined) ? ''
                : ("&attachmentTrId=" + tj.attachmentTrId))
            + ((tj.embedInput == undefined) ? ''
                : ("&embedInput=" + tj.embedInput))
        + ((tj.showReplaceOrAppend == undefined) ? ''
            : ("&selectRepeatSkipOrCover=" + tj.showReplaceOrAppend))
        + ((tj.callMethod == undefined) ? '' : ("&callMethod=" + tj.callMethod))
        + ((tj.isShowImg == undefined) ? '' : ("&isShowImg=" + tj.isShowImg))
        + ((tj.takeOver == undefined) ? '' : ("&takeOver=" + tj.takeOver));
    
    //精灵上传附件
    var isA8geniusAdded = false;
    try{
      var ufa = new ActiveXObject('UFIDA_IE_Addin.Assistance');
      ufa.SetLimitFileSize(1024);
      isA8geniusAdded = true;
    }catch(e){
      isA8geniusAdded = false;
    }
    downloadURL += ((!isA8geniusAdded == undefined) ? '' : ("&isA8geniusAdded=" + isA8geniusAdded));

    var  formVisible=((tj.displayMode == undefined) ? "auto;max-height: 36px" :  tj.displayMode) ;
    var styleStr = "";
    if(tj.autoHeight!=undefined&&tj.autoHeight==true  || tj.canDeleteOriginalAtts == true){
    	styleStr = "style=\"overflow: "+formVisible+";\"";
    }else{
    	styleStr = "style=\"overflow: "+formVisible+"; max-height:55px; _height:27px;overflow-x:hidden;\"";
    }
    if(tj.isShowImg){
        styleStr = " ";
    }
    var showAreaDiv = "<div id='attachmentArea"+ (tj.attachmentTrId ? tj.attachmentTrId : '') + "' "+styleStr+" requrl='" + downloadURL + "' "+ ((tj.delCallMethod == undefined) ? '' : ("delCallMethod=" + tj.delCallMethod))+"></div>";
    
    if ($("#downloadFileFrame").length == 0) {
      showAreaDiv = showAreaDiv
          + "<div style=\"display:none;\"><iframe name=\"downloadFileFrame\" id=\"downloadFileFrame\" frameborder=\"0\" width=\"0\" height=\"0\"></iframe></div>";
    }
    if(tj.embedInput){
        t.append('<input type="text" style="display:none" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
    }
    
    showAreaDiv = $(showAreaDiv);
	
    t.after(showAreaDiv);
	showAreaDiv.attr("style",{"border":"none"});
    t.hide();
    t.attrObj("_attachShow", showAreaDiv);
    initAttData(t, tj, true,  (tj.embedInput ? tj.embedInput : ''));
    if(t.attr("attsdata")!=""){
        var tempAtts = $.parseJSON(t.attr("attsdata"));
        //自适应图片的宽度和高度
        if(tempAtts!=null&&tj.isShowImg&&tempAtts.length>0){
            for(var i=0;i<tempAtts.length;i++){
                if(tempAtts[i].subReference==tj.attachmentTrId){
                	var displayDiv = $('#attachmentDiv_' + tempAtts[i].fileUrl);
                	
            		var hiddenInput = $("#"+tj.embedInput);
                    hiddenInput.parent("div").css("display","block");
                    hiddenInput.css("display","block");
                    var delSpanWidth=displayDiv.find(".ico16").width()+2;
                    //TODO  M1修改bug  
                    displayDiv.width(hiddenInput.width());
                    $(this).width(displayDiv.width()).height(hiddenInput.height());
                    hiddenInput.css("display","none");
                    hiddenInput.parent("div").css("display","none");
                	
                	break;
                }
            }
        }
    }
    renderAttachmentField(t.parent(),tj);
  }
  
  function initAttData(t, tj, isAtt, embedInput) {
    var atts = tj.attsdata ? tj.attsdata : t.attr("attsdata") ? $.parseJSON(t
        .attr("attsdata")) : null;
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
        var canFavourite=true;
        var  isShowImg=false;
        if(tj.canFavourite  != undefined) canFavourite=tj.canFavourite;
        if(tj.isShowImg  != undefined) isShowImg=tj.isShowImg;
        if (tj.attachmentTrId){
            if(att.reference !=att.subReference && tj.attachmentTrId!=att.subReference)
            continue;
          addAttachmentPoi(att.type, att.filename, att.mimeType,
              att.createdate ? att.createdate.toString() : null, att.size,
              att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
              att.description, att.extension, att.icon, tj.attachmentTrId,
              att.reference, att.category, false,null,embedInput,true, att.officeTransformEnable, att.v, canFavourite,isShowImg,att.id,att.hasFavorite);
        }else
          addAttachment(att.type, att.filename, att.mimeType,
              att.createdate ? att.createdate.toString() : null, att.size,
              att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
              att.description, att.extension, att.icon, att.reference,
              att.category, false,null,true, att.officeTransformEnable, att.v,canFavourite,att.hasFavorite);
      }
    }
  }

  function fileList(t) {
    theToShowAttachments = new ArrayList();
    var downloadURL = _ctxPath + "/fileUpload.do";
    var atts = t.attr("attsdata");
    if (atts != null && atts != '') {
      atts = $.parseJSON(atts);
    }
    var att;
    for ( var i = 0; i < atts.length; i++) {
      att = atts[i];
      theToShowAttachments.add(new Attachment(att.id, att.reference,
          att.subReference, att.category, att.type, att.filename, att.mimeType,
          att.createdate.toString(), att.size, att.fileUrl, '', null,
          att.extension, att.icon, true, 'true'));
    }
  }
  function showFileList(t, tj) {
    showAttachment(tj.subRef, tj.atttype, tj.attachmentTrId, tj.numberDivId);
  }

  function assdoc(t, tj) {
    var spanheight= t.parent().closest("div").height();
    if(spanheight>22){spanheight=22};
    t.after($('<div id="attachment2Area'
        + (tj.attachmentTrId ? tj.attachmentTrId : '') + '" poi="'
        + (tj.attachmentTrId ? tj.attachmentTrId : '') + '"  ' +(tj.embedInput ? ' embedInput="'+tj.embedInput+'"' : '')+(tj.callMethod ? ' callMethod="'+tj.callMethod+'"' : '')+' requestUrl="'
        + _ctxPath + '/ctp/common/associateddoc/assdocFrame.do?isBind='
        + (tj.modids ? tj.modids : '') 
        +'&referenceId='+(tj.referenceId ? tj.referenceId : '') 
        +'&applicationCategory='+(tj.applicationCategory ? tj.applicationCategory : '') 
        + '&poi='
        + (tj.attachmentTrId ? tj.attachmentTrId : '')
        + ('" style="overflow: '+((tj.displayMode == undefined) ? "auto;max-height: 36px":  tj.displayMode)+';min-height: '+spanheight+'px;background:#EDEDED;"></div>')));
    if(tj.embedInput){
    t.append('<input type="hidden" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
    }
    initAttData(t, tj, false, (tj.embedInput ? tj.embedInput : ''));
    renderAssocField(t.parent(), tj);
  }
  // 替换页面input
  function showInput(t, cls, tj) {
    var obj = $(t[0]);
    obj.width(obj.width() - 21);
    var html = "<span class=\"margin_l_5 ico16 " + cls + "_16\"";
    tj.fun ? html += " onclick='" + tj.fun + "()'" : null;
    tj.fun ? html += " title='" + tj.title + "'" : null;
    html += "></span> ";
    obj.after(html);
  }
//var onlyNumber = {
//start : /^[.]|[^0123456789.-]+|[.-]{2,}|[-]$/g,
//end : /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g,
//type :/^[-+\d]+$/, 
//nonNumber : /[.-]+/g
//}
//限制输入框只能输入小数
  /**
   * 自己的clone方法jquery is so bad
   */
  $.fn.ctpClone = function(){
      if(this){
              return $.ctpClone($(this));
      }
}
  $.batchExport = function(total,callback){
	  var pageSize = 10000;
	  if(total<=pageSize){
	    callback(1,total);
	    return;
	  }
	  var pageCount = Math.ceil(total/pageSize);
	  var options = '';
	  for(var i=1; i<=pageCount;i++){
	    options+='<option value="'+i+'">'+i+'</option>';
	  }
	  var html ='<table class="popupTitleRight bg_color_white margin_5">'
	  +'<tr><td height="30">'+$.i18n('export.batch.desc.1.js')+'</td></tr>'
	  +'<tr><td height="30">'+$.i18n('export.batch.desc.2.js',pageSize,total,pageCount)+'</td></tr>'
	  +'<tr><td height="30">'+$.i18n('export.batch.desc.3.js','<select id="exportPageNo" style="width:60px" >'+options+'</select>')+'</td></tr>'
	  +'</table>';
	  var dialog = $.dialog({
	      id: 'dlgExport',
	      html : html,
	      title: $.i18n('export.batch.title.js'),
	      width : 300,
	      height : 120,
	      buttons: [{
	          id : 'btnExport',
	          text : $.i18n('export.batch.title.js'),
	          handler : function () {
	              var idExportButton = 'btnExport';
	              var cur = parseInt($('#exportPageNo').val());
	              dialog.disabledBtn(idExportButton);         
	              var btn = dialog.getBtn(idExportButton);
	              var text = btn.html();
	              var times = 5;
	              btn.html('&#160;' + times + '&#160;');     
	              callback(cur,pageSize);              
	              if(cur < pageCount){
	                // 转到下一批
	                $('#exportPageNo').val(cur+1);
	                // 5秒以后才允许下一次导出  
	                var interval1 = setInterval(function(){
	                  btn.html('&#160;' + (--times) + '&#160;');
	                }             
	                ,1000);
	                setTimeout(function(){
	                  window.clearInterval(interval1);
	                  dialog.enabledBtn(idExportButton);  
	                  btn.html(text);
	                },5000);
	              }else{
	                dialog.close();
	              }
	          }
	      }, {
	          text : $.i18n('collaboration.button.cancel.label'),
	          handler : function () {
	              dialog.close();
	          }
	      }]
	  });
	}
$.ctpClone = function(jqObj){
      if(jqObj && jqObj.size()>0){
          var cloneObj;
          if(jqObj[0].outerHTML){
              //****ie7下jquery的clone方法复制出来的对象有问题，因为如果对复制出来的对象设置attr自定义属性的时候会将老对象的attr给修改了,jquery is so bad！
              cloneObj = $(jqObj[0].outerHTML.replace(/jQuery\d+="\d+"/g,""));
          }else{
              cloneObj = jqObj.clone();
          }
          return cloneObj;
      }
}
function onlyInputNumber(e){
    var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
        var onlyNumber = e.data;
        if(isNaN(value) || !onlyNumber.type.test(value)){
            value = value.replace(onlyNumber.start,"");
            if(value!="-" && value!="+" && isNaN(value)){
                value = value.replace(onlyNumber.nonNumber,"");
            }
        }
        if(onlyNumber.decimalDigit!=null){
        	var dotIndex = value.indexOf("."), allLength = value.length;
        	if(dotIndex>-1){
        		if(onlyNumber.decimalDigit<=0){
        			value = value.substr(0,dotIndex);
        		}else{
        			value = value.substr(0,dotIndex+onlyNumber.decimalDigit+1);
        		}
        	}
        }
        if(tempThis.val()!=value){
        	tempThis.val(value);
        }
    }
    tempThis = null;
}
  function deleteNonNumber(e){
      var tempThis = $(this);
      var value = tempThis.val();
      if(value.length>0){
          var onlyNumber = e.data;
          if(isNaN(value) || !onlyNumber.type.test(value)){
              //焦点移开时，将非法字符全部转换
              value = value.replace(onlyNumber.end,"");
              if(value!="-" && value!="+" && isNaN(value)){
                  value = value.replace(onlyNumber.nonNumber,"");
              }
              tempThis.val(value);
          }
      }
      tempThis = null;
  }
  function percentFunctionKeyUp(e){
      var tempThis = $(this);
      var value = tempThis.val();
      if(value.length>0){
          var index = value.lastIndexOf("%");
          var numberValue = value;
          if(index>-1){
              numberValue = value.sub(0, index);
          }
          if(isNaN(numberValue) || !/^[-+]?\d+(\.\d*)?$/.test(value)){
              if(!$.isANumber(numberValue)){
                  numberValue = numberValue.replace(/[^\d]+/g,"");
              }
              tempThis.val(numberValue);
          }
      }
      tempThis = null;
  }
  function percentFunctionBlur(e){
      var tempThis = $(this);
      var value = tempThis.val();
      if(value.length>0){
          var index = value.lastIndexOf("%");
          var numberValue = value;
          if(index>-1){
              numberValue = value.sub(0, index);
          }
          if(isNaN(numberValue) || !/^\d+(\.\d+)?$/.test(value)){
              if(!$.isANumber(numberValue)){
                  numberValue = numberValue.replace(/[^\d]+/g,"");
              }
              tempThis.val(numberValue+"%");
          }
      }
      tempThis = null;
  }
  function thousandthFunctionKeyUp(e){
      var tempThis = $(this);
  var value = tempThis.val();
  if(value.length>0){
              var numberValue = value;
      if(value.length<=3){
              if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
                  if(!$.isANumber(numberValue)){
                      numberValue = numberValue.replace(/[^\d]+/g,"");
                  }
                  tempThis.val(numberValue);
              }
      } else {
              var tempReg = /^\d\d\d(,\d\d\d)*,\d{0,3}$/;
              if(!tempReg.test(value)){
                      numberValue = numberValue.match(/\d\d\d(,\d\d\d)*(,\d{0,3})?/);
                      if(numberValue==null){
                              numberValue = "";
                      }else{
                              numberValue = numberValue[0];
                      }
                      tempThis.val(numberValue);
              }
      }
  }
  tempThis = null;
}
function thousandthFunctionBlur(e){
      var tempThis = $(this);
  var value = tempThis.val();
  if(value.length>0){
              var numberValue = value;
      if(value.length<=3){
              if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
                  if(!$.isANumber(numberValue)){
                      numberValue = numberValue.replace(/[^\d]+/g,"").substr(0,3);
                  }
                  tempThis.val(numberValue);
              }
      } else {
              var tempReg = /^\d\d\d(,\d\d\d)*$/;
              if(!tempReg.test(value)){
                      numberValue = numberValue.match(/\d\d\d(,\d\d\d)*/);
                      if(numberValue==null){
                              numberValue = "";
                      }else{
                              numberValue = numberValue[0];
                      }
                      tempThis.val(numberValue);
              }
      }
  }
  tempThis = null;
}
$.fn.extend({
    onlyNumber : function (obj){
        //限制为只给输入框绑定事件。
        if(this[0] && this[0].nodeName  && this[0].nodeName.toUpperCase() == "INPUT"){
            if(this.prop("type")=="text"){
                var type = obj.numberType, decimalDigit = obj.decimalDigit;
                if(isNaN(decimalDigit)){
                	decimalDigit = null;
                }
                if(type=="delete"){
                    this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                }else{
                    if(type=='percent'){
                        this.unbind("keyup",percentFunctionKeyUp).unbind("blur",percentFunctionBlur);
                        this.bind("keyup",percentFunctionKeyUp).bind("blur",percentFunctionBlur);
                    }else if(type=="thousandth"){
                        this.unbind("keyup",thousandthFunctionKeyUp).unbind("blur",thousandthFunctionBlur);
                        this.bind("keyup",thousandthFunctionKeyUp).bind("blur",thousandthFunctionBlur);
                    }else{
                        var onlyNumber = {};
                        switch(type){
                            case "int" : {
                                onlyNumber.start = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                onlyNumber.end = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                onlyNumber.nonNumber = /[-]+/g;
                                onlyNumber.type = /^[-+]?\d+$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                            case "float" : {
                                onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                onlyNumber.nonNumber = /[.-]+/g;
                                onlyNumber.type = /^[-+]?\d+(\.\d+)?$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                            default : {
                                onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                onlyNumber.nonNumber = /[.-]+/g;
                                onlyNumber.type = /^[-+]?\d+$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                        }
                        this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                        this.bind("keyup",onlyNumber,onlyInputNumber)
                            .bind("blur",onlyNumber,deleteNonNumber);
                    }
                }
                onlyNumChangeEvent(this);//TODO 适配android4.4.1以上有输入验证，点webview壳不能及时失去焦点的问题 辛裴20150925
            }
        }
    }

});
    $.fn.barCode = function (options,t) {
        var barCodeManager = new mFormAjaxManager();
        var width = t.width()-25 || 34, height =(t.height()<34?34:t.height()) || 34;
        var input = $(this), id = input.attr('id');
        var inputSpan = input.parent("span[id="+id+"_span]");
        var fieldVal = $.parseJSON(inputSpan.attr("fieldval"));
        var editTag = inputSpan.hasClass("edit_class")?true:false;
        var editAndNotNull = inputSpan.hasClass("editableSpan")?true:false;
        var designTag = editTag?false:inputSpan.hasClass(designClass);
        var imgId = id+"_img";
        var originalClearfixDiv = $(".clearfix",inputSpan);
        if(originalClearfixDiv)originalClearfixDiv.remove();
        var baseDiv = $("<div class='clearfix'></div>");
        var imgDiv = $("<div id='" + imgId + "' class='left border_all' style='width: " + width + "px;height: " + height + "px;'></div>");
        var margin = height > 40 ? height - 40 : 0;
        var btnDiv = $("<div class='left' style='vertical-align:bottom;width: 20px;height: "+height+"px;'></div>");
        var delBtn = $("<img src='ic_form_delete.png'>");
        var addBtn = $("<img src='ic_form_erweima.png'>");
        var loadingBtn = $("<div class='cmp-pull-loading cmp-icon cmp-spinner' style='display: none;'>");
        var showAddBtn = options.showBtnAdd;
        var showDelBtn = options.showBtnDel;

        delBtn.unbind("click").bind("click",function(){
            delValue();
            changeBarcodeFieldColor(imgDiv,editAndNotNull,true);
        });
        addBtn.unbind("click").bind("click",function(){
            $(this).hide();
            loadingBtn.show();
            var barOption = $.extend({},options);
            barOption.preCallback = "";
            barOption.callback = "";
            var customOption = {};
            if (options.preCallback) {
                options.preCallback(input, options, setValue);
            }
        });

        baseDiv.append(imgDiv).append(btnDiv);
        btnDiv.append(delBtn).append(addBtn).append(loadingBtn);
        input.parent().append(baseDiv);
        input.hide();
        if(input.attr("attr")){
            var attr = input.attr("attr");
            attr = $.parseJSON(attr);
            if(!attr.attID) {
                attr.attID = attr.fileUrl;
            }
            setValue(attr);
        } else {
//            imgDiv.hide();//OA-106744M3Android端-二维码图片没有生成时切换原样表单，显示白框，不太好
            showButton(true);
        }
        if(editTag){
            adjustBarCodeSize(inputSpan);
            if(editAndNotNull){
                input.addClass("validate").attr("validate","name:\""+fieldVal.displayName+"\",notNull:true");
                if(!imgDiv.html()){
                    imgDiv.css("background-color",nullColor);
                }else {
                    imgDiv.css("background-color",notNullColor);
                }
            }
        }else if(designTag){
            var displayInput = $("input",inputSpan);
            delSomePxWidth(displayInput,displayInput.outerWidth(true)-displayInput.width()+$(".ico16",inputSpan).outerWidth(true)+1,fieldVal);
        }
        function setValue(att){
            if(att){
                delValue();
                input.val(att.subReference);
                input.attr("reference", att.reference);
                var url =serverPath+  "/fileUpload.do?method=showRTE&fileId=" + att.attID + "&type=image";
                url = adapterPicUrl(url);
                var fileId = att.attID,filename = getFileName(att),createDate = att.createDate || att.createdate,verifyCode = att.verifyCode || att.v;
                var attOpenData = new MAttOpenParameter(fileId, filename, createDate, "", "", C_iChooseFileType_Pic, verifyCode);
                var imgWid = imgDiv.width(),imgHeight = imgDiv.height();
                if(imgWid > imgHeight){
                    imgHeight = imgHeight + "px";
                    imgWid = imgHeight;
                }else {
                    imgHeight = imgHeight + "px";
                    imgWid = "100%";
                }
                imgDiv.append("<img style='width: "+imgWid+";height: "+imgHeight+"' onclick=\'attOpenEvent("+ $.toJSON(attOpenData)+")\' src='" + url + "'>");//todo 暂时打开webview和发送都要报错
                showButton(false);
                changeBarcodeFieldColor(imgDiv,editAndNotNull,false);
            }else {
                showButton(true);
            }

        }
        function delValue() {
//            var reference = input.attr("reference");
//            var subReference = input.val();
//            if (reference && subReference) {
//                barCodeManager.deleteBarCode(reference, subReference);
//            }
            input.val("");
            imgDiv.html("");
            showButton(true);
        }

        function showButton(isAdd) {
            addBtn.hide();
            delBtn.hide();
            if (showAddBtn) {
                addBtn.show();
            }
            if(showDelBtn && !isAdd){
                delBtn.show();
            }
            if(loadingBtn){
                loadingBtn.hide();
            }
        }
        function getFileName(att){
            var filename = "";
            if(att.suffix){
                filename = att.name + "." + att.suffix.toLocaleLowerCase();
            }else {
                filename = att.filename;
            }
            return filename;
        }
    };



    /**
     * 调整二维码图片大小
     */
    function adjustBarCodeSize(jqField){
        var idStr = jqField.attr("id").split("_")[0];
        var imgDiv = $("div[id="+idStr+"_img]",jqField);
        var tempImg = $("img",imgDiv);
        if(tempImg!=undefined&&tempImg.length>0){
            var newImg = new Image();
            newImg.onload=function(){
                var tempThis = jqField;
                var spanWidth = jqField[0].scrollWidth;
                var displayDiv = $("div[id='"+idStr+"_img']",jqField);
                var dbInput4Att = $("input[id='"+jqField.attr("id").split("_")[0]+"']",jqField);
                dbInput4Att.css("display","block");
                if(spanWidth<=16){
                    if(dbInput4Att.css("width")=="100%"){
                        var p = jqField.parent();
                        var tempTagName = p[0].tagName.toLowerCase();
                        while(tempTagName!="td"&&tempTagName!="div"){
                            p = p.parent();
                            tempTagName = p[0].tagName.toLowerCase();
                        }
                        spanWidth = p.width()-getPMBWidth(p);
                    }else{
                        spanWidth = spanWidth<dbInput4Att.width()?dbInput4Att.width():spanWidth;
                    }
                }else{
                    if(dbInput4Att[0].currentStyle) {
                        spanWidth = spanWidth>dbInput4Att.width()&&dbInput4Att[0].currentStyle.width!="100%"?dbInput4Att.width():spanWidth;
                    } else{
                        spanWidth = spanWidth>dbInput4Att.width()&&dbInput4Att[0].style.width!="100%"?dbInput4Att.width():spanWidth;
                    }
                }
                if(isIe7()){
                    spanWidth = dbInput4Att.width();
                }
                jqField.width(spanWidth);
                dbInput4Att.width(spanWidth);
                jqField.css("display","inline-block");
                var btnDivWidth = $(displayDiv).next().width();
                if(jqField.hasClass(editClass)){
                    displayDiv.addClass("border_all").width(spanWidth-btnDivWidth-4).css("min-height",dbInput4Att.height());
                }else{
                    displayDiv.removeClass("hidden").width(spanWidth-4).css("min-height",dbInput4Att.height());
                }
                var imgWidth = $(this).width();
                var imgHeight = $(this).height();
                var divWidth = $(displayDiv).width();
                var divHeight = $(displayDiv).height();
                if(imgWidth > divWidth && imgHeight > divHeight){
                    //如果宽度高度同时超出，按照超出比例的大的缩放
                    var wScale = parseFloat(imgWidth/divWidth);
                    var hScale = parseFloat(imgHeight/divHeight);
                    if(wScale >= hScale){
                        imgWidth = divWidth;
                        imgHeight = parseFloat(imgHeight/wScale);
                    }else{
                        imgWidth = parseFloat(imgWidth/hScale);
                        imgHeight = divHeight;
                    }
                } else if(imgWidth > divWidth){
                    imgWidth = divWidth;
                    imgHeight = parseFloat((imgHeight*divWidth)/imgWidth)
                }else if(imgHeight > divHeight){
                    imgWidth = parseFloat((imgWidth*divHeight)/imgHeight);
                    imgHeight = divHeight;
                }
                $(this).css({"max-width":imgWidth,"max-height":imgHeight});
                dbInput4Att.css("display","none");
            };
            tempImg.replaceWith(newImg);
            newImg.src = tempImg.attr("src");//表单中显示缩略图
            var clickFun = tempImg.attr("onclick");
            if(clickFun) newImg.setAttribute("onclick",clickFun);
        }else{
            var spanWidth = jqField[0].scrollWidth;
            if(jqField.parent().children().length==1){
                spanWidth = jqField.parents("td").width();
            }
            var dbInput4Att = jqField.find("input[id='"+jqField.attr("id").split("_")[0]+"']");
            dbInput4Att.css("display","block");
            if(spanWidth<=16) {
                spanWidth = spanWidth < dbInput4Att.width() ? dbInput4Att.width() : spanWidth;
            }
            var displayDiv = $("div[id='"+idStr+"_img']",jqField);
            if(jqField.hasClass(editClass)){
                spanWidth = spanWidth-$(displayDiv).next().width();
            }
            var browseTag = $(jqField).hasClass("browse_class");
            displayDiv.css({"width":spanWidth-4,"min-height":dbInput4Att.height()}).removeClass("hidden");
            if(browseTag){//因为用span.browse_class>div.left 样式没有填充背景色，所以手动加一个。
                displayDiv.css("background-color","#F8F8F8");
            }
            dbInput4Att.css("display","none");
        }
    }
    function changeBarcodeFieldColor(barcodeDiv,notNull,del){
        if(notNull){
            if(del){
                barcodeDiv.css("background-color","#FCDD8B");
            }else {
                barcodeDiv.css("background-color","#FFFFFF");
            }
        }
    }
})(jQuery);