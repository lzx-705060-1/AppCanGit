var designClass = "design_class",hideClass = "hide_class",browseClass = "browse_class",addClass = "add_class",editClass = "edit_class";
var nullColor = "#FCDD8B";
var notNullColor = "#FFFFFF";
//定义一个全局变量保存上一次联动对象,用于方法designLinkageList
var designLinkObj;
var needCalWidthFields = new Properties();//优化单元格设置width的时候的中间变量，用于存储要设置width的单元格
var hasDelBPMFieldMap = new Properties();//已经减去过border padding margin的字段缓存
var bpmCacheMap = new Properties();//getBPMWidth已经计算过的样式缓存
var styleCacheMap = new Properties();//样式计算缓存
var fieldWidthCacheMap = new Properties();
var autoTextAreaCacheMap = new Properties();
var _mainBodyDiv;
var calculating = false;
var isChromeIe11 = true;
var showStyleType = "1";
//表单正文初始化方法
function initFormContent(isPrint,isForward,style){
$("span[id^='field']").eq(0).parent().append("<span id='newInputPosition' style='width: 0px; height: 0px;display:inline-block;'></span>");
	if(typeof(style)!=undefined&&style!=""){
		showStyleType = style;
	}
	
	_mainBodyDiv = $("#mainbodyDiv");
    $("#mainbodyHtmlDiv_0").find("div[id^=formmain_]").css("padding-left",16).css("padding-right",16);
	if(isForward){//OA-50732
		$(".documents_penetration_16",_mainBodyDiv).css("display","none");
		$("img",_mainBodyDiv).each(function(){
			var lowerSrcAtt = $(this).attr("src").toLowerCase();
			if(lowerSrcAtt.indexOf("uploadfile.gif")!=-1
					||lowerSrcAtt.indexOf("selecetuser.gif")!=-1
					||lowerSrcAtt.indexOf("date.gif")!=-1
					||lowerSrcAtt.indexOf("uploadimage.gif")!=-1
					||lowerSrcAtt.indexOf("delete.gif")!=-1
					||lowerSrcAtt.indexOf("handwrite.gif")!=-1){
				$(this).remove();
			}
		});
	}
	if(showStyleType=="1"){
		if(_mainBodyDiv.find(".common_tabs").length>0){
			$("div[id^='mainbodyHtmlDiv_']").css("padding-top","27px");
		}
		$("div[id^='mainbodyHtmlDiv_']").removeClass("hidden");
		//附件，图片，关联文档，必填项背景色
		setBGColor(_mainBodyDiv);
	}
    //添加参数isPrint。表单打印页面公用此方法，如果是从打印页面调用的话 isPrint == true
    var sps;
    if(isPrint){
        sps = $("span[id$='_span']",$("#context"));
        if($("#img")){$("#img").remove();}//打印移除添加删除重复行按钮
        if($("#attachmentArea")){$("#attachmentArea").addClass("display_none");} //打印页面不存在下载，所以附件下载隐藏的Iframe没用但是也要占高度
        $(".xdPageBreak").each(function(){
            var breakDiv = $(this).parent("div");
            if(breakDiv!=undefined){
                //汗，打印分页符样式在标准文档模式下需要这样设置才能达到分页的效果
                breakDiv.css("page-break-before","always").css("page-break-after","");
            }
        });
      //将重复节点高度设置给清空
        $(".xdRepeatingSection",$("#context")).css("height","auto");
    }else{
        var sps = $("span[id$='_span']");
	        //将重复节点高度设置给清空
	        $(".xdRepeatingSection").css("height","auto");
        
    }
    for(var i=0;i<sps.length;i++){
        var jqField = $(sps[i]);
        if(showStyleType=="1"){
	        if(jqField.hasClass(hideClass)){
	        	var hideSpan = jqField.find("span").eq(0);
	        	hideSpan.width(2*hideSpan.width()-hideSpan.outerWidth(true)-1);
	            continue;
	        };
    	}
        initFieldDisplay(jqField,isPrint,isForward);
    }
    if(showStyleType=="1"){//表单样式使用infopath样式的时候
	    //ie浏览器
	    if(document.all){
	        if(isIe7()){
	        	$(".xdFormLayout").each(function(){
	            	var subTables = $(this).find("table.xdRepeatingTable");
	            	var maxSubTableSize = $(this).width();
	            	for(var i=0;i<subTables.length;i++){
	            		if(subTables[i].clientWidth>maxSubTableSize){
	            			maxSubTableSize = subTables[i].clientWidth;
	            		}
	            	}
	            	$(this).width(maxSubTableSize+4);
	            });
	            $(".xdLayout").each(function(){
	            	var subTables = $(this).find("table.xdRepeatingTable");
	            	var maxSubTableSize = $(this).width();
	            	for(var i=0;i<subTables.length;i++){
	            		if(subTables[i].clientWidth>maxSubTableSize){
	            			maxSubTableSize = subTables[i].clientWidth;
	            		}
	            	}
	            	$(this).width(maxSubTableSize+4);
	            });
	            //IE7下table元素的table-layout:fixed;样式导致重复项表比定义的宽度还要宽，内容显示不完。原型201300174。
	            //只处理重复表。
	            $("table.xdRepeatingTable").each(function(){
	        		$(this).css("table-layout","auto");
	        		$(this).css("word-wrap","normal");//OA-51096
	        	});
				//IE7 下不识别表单中设置的min-height属性，需要根据min-height设置height样式.
	            $("tr").each(function(){
					var minHeight = $(this).css("min-height");
					var height = $(this).height();
					if(minHeight != null && minHeight != undefined&&minHeight.length > 2){
						var minHeightNum = parseInt(minHeight.substring(0,minHeight.length-2));
						if(minHeightNum > height){
							$(this).css("height",minHeight);
						}
					}
	            });
	        }
	        if(isChromeIe11){
	        	$(".xdLayout").each(function(){
	            	if("none"==$(this).css("border-style")||""==$(this).css("border-style")){
	                	$(this).css({"border":"medium none white"});
	            	}
	        	});
	    	}
	        $(".msoUcTable").each(function(){
	            if("none"==$(this).css("border-style")||""==$(this).css("border-style")){
	                $(this).css({"border":"medium none white"});
	            }
	        });
	        //重要A8-V5BUG_V5.0sp2_中建材能源有限公司 _大部分表单导入后格式出现异常_20140430024809
	        //ie下如果没有设置align，则将text-align设置为left
	        $("td>div").each(function(){
	        	var tempDiv = $(this);
	        	if(tempDiv.children("font").length>0){
	        		var divalign = tempDiv.attr("align");
	            	if(divalign==undefined||divalign==""){
	            		tempDiv.css("text-align","left")
	            	}
	        	}
	        });
	    }
    }
    //advanceAuthType不为空即说明是有流程表单，不为1说明没有分开设置(有流程且无分开设置时，有重复表导入导出功能)
    //先判断变量是否有值，再做值判断
    if(typeof(advanceAuthType)!="undefined" && advanceAuthType && advanceAuthType != "1" && advanceAuthType != 1){
        $("table.xdRepeatingTable").each(function(){
    	    var path="";
    	    var trs=$(this).children().children("tr");
    	    for(var i=0;i<trs.length;i++){
    	    	path=$(trs[i]).attr("path");
    	    	if(path!=undefined && path!=""){break;}
    	    }
    	    if(path==undefined || path==""){return;}
    	    if(path.indexOf("/")!=-1){
    	        path = path.split("/")[1];
    	    }
            getFormTableAuth(path,$("#rightId").val(),function(tableOperation){
                if(tableOperation == undefined || !tableOperation.allowAdd){
                    return;
                }
                //校验结束，到这里说明需要添加导入导出
                var importDiv = $("<DIV style=\"position:relative;width:0;height:0\" id=\"importimg\" name=\"importimg\"></DIV>");
                var inImg = $("<DIV id=\"inDiv\" style=\"position:absolute;\"><span id=\"inImg\" class=\"ico16 formExport_16\"></span></DIV>");
                var outImg = $("<DIV id=\"outDiv\" style=\"position:absolute;margin-top:16px;\"><span id=\"outImg\" class=\"ico16 formImport_16\"></span></DIV>");
                importDiv.append(inImg).append(outImg);
                var pos = getElementPos(this);
                pos.left = pos.left + $(this).width();
                pos.top = pos.top + $(this).height()-32;//importDiv.height();
                $(this).after(importDiv);
                importDiv.offset(pos);
                var tableName=$(this).attr("id");
                inImg[0].title = $.i18n("form.base.import.label"); //"导入数据";
                outImg[0].title = $.i18n("form.base.export.label"); //"导出excel";
                inImg.bind("click", { table : tableName }, importRepeatData);
                outImg.bind("click", { table : tableName }, exportRepeatData);
            });
		});
    }
    if(showStyleType=="1"){//表单样式使用infopath样式的时候
	    $("div[id^='mainbodyHtmlDiv_']").addClass("hidden");
	    $("div[id='mainbodyHtmlDiv_"+$("#_currentDiv").val()+"']").removeClass("hidden");
	    /************************优化单元格宽度设置开始*******************************/
	    //原理是先隐藏表单区域，再设置单元格宽度，这样避免浏览器重绘或者重排所带来的性能开销
	    _mainBodyDiv.hide();
	    setFormFieldWidth(isPrint);
	    _mainBodyDiv.show();
	    /************************优化单元格宽度设置end******************************/
	    //表单样式初始化完全之后才显示mainBodyDiv
	    _mainBodyDiv.css("visibility","visible");
    }
    /** 二维码假数据测试
    var textCodeBarObj = {
        codeType:"form",
        content:'/1.0/{\"field0003\":\"妈妈\",\"field0004\":\"\",\"formId\":\"6385548528474211040\",\"current_date\":\"2016-01-27 11:24:25\"}'
    };
    var urlCodeBarObj = {
        codeType:"form",
        content:'/1.0/{\"moduleId\":7098164228750196771,\"formId\":-1557773888915356659,\"dataId\":\"6385548528474211040\",\"rightId\":-490696366960720,\"contentType\":20,\"viewState\":1,\"formType\":2}'
    }
    var textCodeBarStr = $.toJSON(textCodeBarObj);
    var urlCodeBarStr = $.toJSON(urlCodeBarObj);
    var commonCodeBarStr = '{"type":234}';
    var errorBarStr = "dasdasd";
    var action = 1;
    var scanBtn = $('<button id="scanBtn">测试</button>');
    $("body").append(scanBtn);
    scanBtn.bind("click",function(){
        var codeBar = textCodeBarStr;
        if(action%2 == 0) {
            codeBar = urlCodeBarStr
        }else if(action%3 == 0) {
            codeBar = commonCodeBarStr;
        }else if(action % 5 == 0) {
            codeBar = errorBarStr;
        }
        action ++;
        barCodeFillBack(codeBar);

    });
     */
	setTableOperation();
	//TODO OA-108860微协同：待办编辑原表单，项目进度字段可以输入非数字，点击完成后显示为NaN%
	$("input[onkeyup ^='formFieldPercentFunctionKeyUp']").removeAttr('onkeyup').bind("input",function(){
			formFieldPercentFunctionKeyUp(this);
	});
}

function setFormFieldWidth(isPrint){
	var _needCalWidthFields = needCalWidthFields.values();
	//非打印态不是杂项模式，需要计算单元格宽度
	//打印态+ie浏览器因为是杂项模式，所以不用计算单元格宽度
	//打印态+chrome浏览器，需要计算单元格宽度
	if((!isPrint)||(isPrint&&v3x.currentBrowser.toUpperCase()=="CHROME")){
		var calFieldSize = _needCalWidthFields.size();
		var isIe7tag = isIe7();
		for(var i=0;i<calFieldSize;i++){
	    	var calWidthField = _needCalWidthFields.get(i);
	    	var fieldValObj = calWidthField.data("fieldValObj");
	    	if(fieldValObj==undefined){
	    		continue;
	    	}
	    	if(fieldValObj.isMasterFiled=="true"){
    			calWidthField.css("width",calWidthField.attr("finalWidth")+"px");
    			if(fieldValObj.autoHeightTextera){//自动换行的文本域
    				calWidthField.css({"overflow":"scroll","overflow-y":"hidden","overflow-x":"hidden"});
    				calWidthField.height(calWidthField[0].scrollHeight);
    			}
    			if(fieldValObj.inputType=="textarea"){
    				if(isIe7tag){
    					calWidthField.css("white-space","pre");
        			}else{
        				calWidthField.css("white-space","pre-wrap");
        			}
    			}
	    	}else{
	    		var fid = calWidthField.attr("id");
	    		if(hasDelBPMFieldMap.get(fid)==undefined){//还没减bpm的重复表字段
	    			hasDelBPMFieldMap.put(fid, calWidthField);
	    			var tempFields = $("[id='"+fid+"']");
	    			tempFields.css("width",calWidthField.attr("finalWidth")+"px");//获取一列，一次性设置宽度
    				if(fieldValObj.autoHeightTextera){//自动换行的文本域
    					tempFields.css({"overflow":"scroll","overflow-y":"hidden","overflow-x":"hidden"});
    					tempFields.each(function(){
    						this.style.height=this.scrollHeight+'px';
    					});
    				}
    				if(fieldValObj.inputType=="textarea"){
        				if(isIe7tag){
        					tempFields.css("white-space","pre");
            			}else{
            				tempFields.css("white-space","pre-wrap");
            			}
        			}
	    		}
	    	}
	    }
	}
	needCalWidthFields.clear();
	_needCalWidthFields.clear();
	hasDelBPMFieldMap.clear();
	bpmCacheMap.clear();
	styleCacheMap.clear();
	fieldWidthCacheMap.clear();
	autoTextAreaCacheMap.clear();
}

/**
 * 获取dom对象的对应styleName名称的样式
 * @param myObj
 * @param styleName
 * @returns
 */
function returnStyle(myObj,styleName){
	var objId = myObj.id?myObj.id:myObj.name;
	var tempKey = objId+"_" + styleName;
	var retStyle = styleCacheMap.get(tempKey);
	if(retStyle==undefined&&myObj!=null&&myObj!=undefined){
    	if(document.all){
			retStyle = eval("myObj.currentStyle." + styleName);
    	} else {
    		retStyle =  eval("document.defaultView.getComputedStyle(myObj,null)." + styleName);
    	}
    	styleCacheMap.put(tempKey, retStyle);
	}
	return retStyle;
}
/**
 * 从样式文件获取input 宽度，如果为百分比或为空 取DIV或TD宽度
 * @param jqField
 */
function getInput4AttWidth(jqField){
	//获取原始CSS中的宽度
	var dbInputWidth="";
	var inputid=jqField.attr("id").split("_")[0];
	for(var s=0;s<document.styleSheets.length;s++){
		if(document.styleSheets[s].href==null || document.styleSheets[s].href==""){
			var cssrules=document.styleSheets[s].cssRules||document.styleSheets[s].rules;
			for(var c=0;c<cssrules.length;c++){
				if(cssrules[c].selectorText=="#"+inputid){
					dbInputWidth=cssrules[c].style.width;
					if(dbInputWidth.indexOf("px")!=-1){
						dbInputWidth=parseInt(dbInputWidth.replace("px",""));
					}else if(dbInputWidth.indexOf("pt")!=-1){
						dbInputWidth= parseInt(dbInputWidth.replace("pt",""))*(pipxUnit);
					}
					//alert(dbInputWidth);
					break;
				}
			}
		}
	}
	//如果百比分或者为空则取TD或DIV的值
	if(dbInputWidth.toString().indexOf("%")>0 || dbInputWidth==""){
		//如果为100%以下 则总宽度*百分比
		var percent=100;
		if(dbInputWidth.toString().indexOf("%")>0) {
			percent=parseInt(dbInputWidth.replace("%",""));
		}

		var parentDiv=jqField.parent().closest("div");
		var parentTd= jqField.closest("td");
		if(parentTd.length>0){ //td优先
			dbInputWidth = parentTd.width();
		}else if(parentDiv.length>0){
			dbInputWidth = parentDiv.width();
		}else{
			dbInputWidth = jqField[0].scrollWidth;
		}

		dbInputWidth=dbInputWidth*percent/100;
	}
	return dbInputWidth;
}
function adjustImageSize(jqField) {
	var _fieldVal = jqField.attr("fieldVal");
	var _inputType = $.parseJSON(_fieldVal).inputType;
	var tempImg = $("img",jqField);
	if(tempImg!=undefined&&tempImg.length>0){
		var newImg = new Image();
		newImg.onload=function(){
			var tempThis = jqField;
			var spanWidth = getInput4AttWidth(jqField);
			var dispDiv = $("div[id^='attachmentArea']",jqField);
			var dispblock = $(".attachment_block",dispDiv);
			var dbInput4Att = $("input[id='"+jqField.attr("id").split("_")[0]+"']",jqField);
			dbInput4Att.css("display","block");
			var img = $(this);
			//如果超出宽度就用最顶层的DIV或TD宽度减去图标宽度
			var delWidth=0;
			$(".icon16,.correlation_form_16",jqField).each(function(){
				delWidth+=$(this).outerWidth(true);
			});

			if(spanWidth>$(dispDiv).parent().closest("div").width()){
				spanWidth = $(dispDiv).parent().closest("div").width();
			}
			if(jqField.parents("td").length>0 && spanWidth>jqField.parents("td").width()){
				spanWidth = jqField.parents("td").width();
			}
			spanWidth = spanWidth -delWidth;

			//jqField.width(spanWidth);
			dbInput4Att.width(spanWidth);
			jqField.css("display","inline-block");
			var clkSpanWidth = 0;
			$(this).css("cursor","pointer");
			if(jqField.hasClass(editClass)){
				clkSpanWidth = jqField.children("span").width();
				dispDiv.addClass("border_all").addClass("left").width(spanWidth-clkSpanWidth-4).css("min-height",dbInput4Att.height());
				if(dispblock.length>0){
					dispblock.width(dispDiv.width()-2).css("padding","2px 0px 2px 0px");
					dispblock.height(dbInput4Att.height());
				}
				var delSpan = $(".affix_del_16",dispblock);
				var delSpanwidth = 0;
				if(delSpan.length>0){
					delSpanwidth = delSpan.width();
					$(this).css({"max-width":dispblock.width()-delSpanwidth,"max-height":dbInput4Att.height()});
				}
			}else{
				dispDiv.removeClass("hidden").width(spanWidth-4).css("min-height",dbInput4Att.height());
				if(dispblock.length>0){
					dispblock.width(dispDiv.width()-18);
					dispblock.height(dbInput4Att.height()-2)
				}
				var tempAttrStyle = tempThis.attr("style");
				//关联回填的图片字段comp方法中无法获取宽度和高度，此处为IMG标签添加宽度和高度
				if(tempAttrStyle==undefined||(tempAttrStyle.indexOf("width")<0
						|| tempAttrStyle.indexOf("height")<0) || tempThis.height() != dbInput4Att.height()){
					tempThis.width(spanWidth-6).height(dbInput4Att.height());
				}
				$(this).css({"max-width":"100%","max-height":"auto","cursor":"pointer"});
			}

			if(jqField.find(".correlation_form_16").length>0){
				dispDiv.removeClass("left").css("display","inline-block");
				jqField.width(spanWidth+40);
				dispDiv.find("span").css("line-height","16px");
				jqField.find(".correlation_form_16").css("margin-top"," -10px");
			}
			dbInput4Att.css("display","none");
		}
		tempImg.replaceWith(newImg);
		newImg.src = tempImg.attr("src")+"&showType=big";//表单中显示缩略图
		if(tempImg.attr("onclick")){
			newImg.setAttribute("onclick",tempImg.attr("onclick"));
		}
	}else{
		jqField.css("display","inline-block");
		var spanWidth =getInput4AttWidth(jqField);
		var dbInput4Att = jqField.find("input[id='"+jqField.attr("id").split("_")[0]+"']");
		dbInput4Att.css("display","block");
		dbInput4Att.width(spanWidth)
		spanWidth = spanWidth-jqField.children("span").width();
		var dispDiv = jqField.find("div[id^='attachmentArea']");
		dispDiv.css({"width":spanWidth-4,"min-height":dbInput4Att.height(),"visiblity":"visible"}).addClass("border_all").addClass("right").removeClass("hidden");
		if(jqField.find(".correlation_form_16").length>0){
			dispDiv.removeClass("left").css("display","inline-block");
			jqField.find(".correlation_form_16").css("margin-top"," -10px");
		}
		dbInput4Att.css("display","none");
	}
}
    

    

/**
 * 获取dom对象的对应styleName名称的样式
 * @param myObj
 * @param styleName
 * @returns
 */
function returnStyle(myObj,styleName){
	if(myObj!=null&&myObj!=undefined){
    	if(document.all){
    		return eval("myObj.currentStyle." + styleName);
    	} else {
    		return eval("document.defaultView.getComputedStyle(myObj,null)." + styleName);
    	}
	}
}

/**
 *表单单元格必填颜色设置
 */
function changBackGroundColor(jqField){
    //可编辑态的单元格如果为必填需要改变背景颜色
    var changeColorFiled,valueInput,validateNullValue;
	var idStr=jqField.attr("id").replace("_span","");
    if(jqField.hasClass("editableSpan")){
        if(jqField.find(".comp").length>0){
            var compParm = $.parseJSON("{"+jqField.find(".comp").attr("comp")+"}");
            validateNullValue = compParm.notNull;
            changeColorFiled = jqField.parents("td");
            valueInput = jqField.find("input[id="+idStr+"]");
        }else {
            valueInput = jqField.find("input[id="+idStr+"]");
            validateNullValue = $.parseJSON("{"+valueInput.attr("validate")+"}").notNull;
            changeColorFiled = valueInput;
        }
        valueInput.unbind("change").bind("change",function(){
            if(validateNullValue){
                if($(this).val() == "") {
                    changeColorFiled.css("background-color",nullColor);
                }else {
                    changeColorFiled.css("background-color",notNullColor);
                }
            }
        });
        valueInput.trigger("change");
    }
    if(jqField.find("span[relation]").length>0){
        var xdr = jqField.find(".xdRichTextBox");
        if(xdr.length>0){
			for(var x=0;x<xdr.length;x++){
				var currXdr=xdr[x];
				var validateParm = currXdr.attr("validate");
				if(validateParm!=undefined){
					validateParm = $.parseJSON("{"+validateParm+"}");
					if(validateParm.notNull=="true"||validateParm.notNull==true){
						currXdr.css("background-color","#FCDD8B");
					}
				}
			}

        }
    }

}

/**
 * 选组织机构控件change事件相应函数
 */
function orgFieldOnChange(orgHiddenInput){
	var jqField = orgHiddenInput.parent("span");
	var editAndNotNull = false;
	if(jqField.hasClass("editableSpan")){
		editAndNotNull = true;
	}
	if(editAndNotNull){
		var inputField = jqField.find("input");
		var textAreaField = jqField.find("textarea");
		if(orgHiddenInput.val()==""){
			inputField.css("background-color",nullColor);//如果编辑态+非空，并且单元格值是空值，则设置背景颜色
			textAreaField.css("background-color",nullColor);
		}else{
			inputField.css("background-color",notNullColor);
			textAreaField.css("background-color",notNullColor);
		}
	}
}

/**
 * 下拉框值变化之后的相应函数
 */
function selectValueChangeCallBack(displayInput){
	var jqField = displayInput.parent("span");
	var editAndNotNull = false;
	if(jqField.hasClass("editableSpan")){
		editAndNotNull = true;
	}
	if(editAndNotNull){
		if(displayInput.val()==""){
			jqField.find("input").css("background-color",nullColor);
		}else{
			jqField.find("input").css("background-color",notNullColor);
		}
	}
}    
/**
 *计算表单单元格宽度方法，各类表单控件的样式问题都在此方法中做处理
 *使用场景：
 *        1、表单正文打开的时候；
 *        2、表单计算、增加重复行等导致单元格回填之后会调用此方法来初始化回填的单元格样式；
 */
function initFieldDisplay(jqField,isPrint,isForward){
	if(typeof(style)!="undefined" && style != "1"){
		return;
	}
	var editTag=jqField.hasClass(editClass);
	var browseTag=jqField.hasClass(browseClass);
	var designTag=jqField.hasClass(designClass);
	var editAndNotNull = jqField.hasClass("editableSpan");
    var defaultWidth=70;
    var fieldVal =jqField.attr("fieldVal");
    var idStr = jqField.attr("id").split("_")[0];
    if(fieldVal==undefined){
    	if(jqField.hasClass(hideClass)){
    		var hideField = $("#"+idStr,jqField);
    		hideField.width(hideField.width()-getPMBWidth(hideField));
    	}
        return true;
    }else{
        fieldVal = $.parseJSON(fieldVal);
        $.extend(fieldVal,{"editTag":editTag});
    }
    //TODO  解决转发时  ios7 IPhone 不换行的情况
    var inputType = fieldVal.inputType;
    if(typeof collForward != "undefined"){
    	if(inputType =="textarea"&& collForward == "true" &&clientType==C_sClientType_Iphone) {
    		inputType = "text";
    	}
    	
    }
  //关键样式代码，处理SPAN自适应高度的问题 by wangfeng
    //只要文本区域高度小于内部文本高度就设置为auto
    if(fieldVal.inputType!="attachment"&&fieldVal.inputType!="document"&&fieldVal.inputType!="image"&&fieldVal.inputType!="handwrite"){
	    if(browseTag&&jqField[0].children[0]!=null&&(jqField[0].children[0].clientHeight<jqField[0].children[0].scrollHeight||(isChromeIe11&&jqField[0].children[0].clientHeight<=jqField[0].children[0].scrollHeight))){
	    	if(jqField.find("img").length<=0){//数据关联外部写入-图片类型的有可能是图片，此时不应该加height auto
		    	if(!isChromeIe11){
					jqField.find(":first-child").css({"height":"auto","white-space":"pre-wrap"});
				}else{
					jqField.find(":first-child").css({"height":"auto","white-space":"pre-wrap","min-height":jqField[0].children[0].scrollHeight});
				}
	    	}
		}else if(editTag||jqField.hasClass(addClass)){
			var s = jqField.find("span.xdRichTextBox");
			if(s.length>0&&s[0]!=null&&s[0].clientHeight<s[0].scrollHeight){
				jqField[0].children[0].style.height="auto";
			}
		}
    }
    var hasExecute = true;

    switch(inputType){
    	case "member":
    	case "account":
    	case "department":
    	case "post":
    	case "level":
            if(designTag){
                var dbInput = jqField.find("input[id='"+idStr+"']");
                delSomePxWidth(dbInput,dbInput.outerWidth(true)-dbInput.width()+jqField.find(".ico16").outerWidth(true)+1);
                jqField.find("a").attr("href","#");
            }else if(browseTag){
                var fieldSpan = jqField.find("span[id='"+idStr+"']");
            	delSomePxWidth(fieldSpan,null,fieldVal);
             	fieldSpan.css({"min-height":"12px","overflow-y":"hidden"});
            }else if(editTag){
            	jqField.find("input[id='"+idStr+"_txt']").css("text-overflow","clip");
            }
            break;
    	case "multimember":
    	case "multiaccount":
    	case "multidepartment":
    	case "multipost":
    	case "multilevel":
    		if(designTag){//设计态
    			var dbInput = jqField.find("textarea[id='"+idStr+"']");
    			delSomePxWidth(dbInput,dbInput.outerWidth(true)-dbInput.width()+jqField.find(".ico16").outerWidth(true)+1);
    			jqField.find("a").attr("href","#");
    		}else if(browseTag){
                var fieldSpan = jqField.find("span[id='"+idStr+"']");
                delSomePxWidth(fieldSpan,null,fieldVal);
            }else if(editTag){
            	jqField.find("input[id='"+idStr+"_txt']").css("text-overflow","clip");
            }
    		break;
    	case "customplan":
    		if(editTag){//编辑态
                var disinput = jqField.find("textarea[id='"+idStr+"']");
                delSomePxWidth(disinput,disinput.outerWidth(true)-disinput.width()+jqField.find(".ico16").outerWidth(true)+1,fieldVal);
            }else if(browseTag){
            	var jqspan = jqField.find(".ico16");
                var disinput = jqField.find("span[id='"+idStr+"']");
                if(jqspan.css("display")=="none"){
                	delSomePxWidth(disinput,null,fieldVal);
                }else{
                	delSomePxWidth(disinput,disinput.outerWidth(true)-disinput.width()+jqspan.outerWidth(true)+1,fieldVal);
                }
            }else if(designTag){
            	var dbInput = jqField.find("input[id='"+idStr+"']");
            	delSomePxWidth(dbInput,dbInput.outerWidth(true)-dbInput.width()+jqField.find(".ico16").outerWidth(true)+1,fieldVal);
       
            }
    		break;
    	case "attachment":
    	case "document":
    		if(editTag||browseTag){//编辑态
                var spanWidth = getInput4AttWidth(jqField);
                var dbInput4Att = jqField.find("input[id='"+idStr+"']");
                //if(spanWidth<=16){
                //	if(dbInput4Att.css("width")=="100%"){
                //		var p = jqField.parent();
                //		var tempTagName = p[0].tagName.toLowerCase();
                //		while(tempTagName!="td"&&tempTagName!="div"){
                //			p = p.parent();
                //			tempTagName = p[0].tagName.toLowerCase();
                //		}
                //		spanWidth = p.width()-getPMBWidth(p);
                //	}else{
                //		spanWidth = spanWidth<dbInput4Att.width()?dbInput4Att.width():spanWidth;
                //	}
                //}else if(dbInput4Att.css("width")=="100%"){
                //	spanWidth=spanWidth;
                //}else{
                //	if(spanWidth>500){
                //		spanWidth = spanWidth>dbInput4Att.width()?dbInput4Att.width():spanWidth;
                //	}else{
                //		spanWidth = spanWidth<dbInput4Att.width()?dbInput4Att.width():spanWidth;
                //	}
                //}
                var clkSpanWidth = 0;
                if(editTag){
                    clkSpanWidth = jqField.children("span").width();
                }
                dbInput4Att.width(spanWidth);
				jqField.width(spanWidth);
                jqField.css("display","inline-block");
                dbInput4Att.css("display","block");
                var dispDiv;
                if(fieldVal.inputType=='attachment'){
                    dispDiv = jqField.find("div[id^='attachmentArea']");
                }else{
                    dispDiv = jqField.find("div[id^='attachment2Area']");
                }
				//IE7 下该属性导致附件信息都不换行，收藏按钮都显示不出来。
                if(isIe7()){
                	dispDiv.find(".attachment_block").removeAttr("noWrap").css({"white-space":"pre-wrap"});
                }
                if(browseTag){
				//TODO  m1修改bug  OA-79545
                    dispDiv.addClass("xdRichTextBox").addClass("left").width(dbInput4Att.width()-clkSpanWidth-4).css("min-height",(dbInput4Att.height()==0?20:dbInput4Att.height()));
                    if(isIe7()&&dispDiv.find(".attachment_block").length<=0){
                    	jqField.width(jqField.width()-4);
                    }
                }else{
					//TODO   轻表单去掉边框
					/*var width  = dbInput4Att.width()-clkSpanWidth-4;
					if(width >0){
						dispDiv.width(width);
					} */
                    dispDiv.addClass("left").css("min-height",(dbInput4Att.height()==0?20:dbInput4Att.height()));
					dispDiv.css("height:100%");
                }
                dbInput4Att.css("display","none");
                if(jqField.find(".comp").length>1){//兼容老A8中既有关联文档又有附件的情况
					//第二个comp控件是放的关联文档
					jqField.find("div[id^='attachment2Area']").find(".attachment_block ").css("white-space","normal");
				}
            }else if(designTag){//设计态
                var displayInput = jqField.find("input");
                delSomePxWidth(displayInput,displayInput.outerWidth(true)-displayInput.width()+jqField.find(".ico16").outerWidth(true)+1);
            }
    		break;
    	case "image":
    		if(isForward||isPrint || showStyleType!="1"){
        		return;
        	}
            if(editTag||browseTag){//编辑态   不可覆盖
            	adjustImageSize(jqField);
            }else if(designTag){//设计态
                var displayInput = jqField.find("input");
                delSomePxWidth(displayInput,displayInput.outerWidth(true)-displayInput.width()+jqField.find(".ico16").outerWidth(true)+1);
            }
            break;
    	case "project":
			var dbInput = $("#"+idStr,jqField);
			if(editTag){//编辑态
				delSomePxWidth(dbInput,null,fieldVal);
				if(editAndNotNull){
                    var defaultVal =  fieldVal.value;
                    dbInput.unbind("change").bind("change",function(){
                        if($(this).val()==""){
                            $("input",jqField).css("background-color",nullColor);
                        }else {
                            $("input",jqField).css("background-color",notNullColor);
                        }
                    });
                    dbInput.trigger("change");
                    if(defaultVal && defaultVal != ""){
                        $("input",jqField).css("background-color",notNullColor);
                    }else {
                        $("input",jqField).css("background-color",nullColor);
                    }

				}
			}else if(browseTag){
				delSomePxWidth(dbInput,null,fieldVal);
			}else if(designTag){//设计态
				delSomePxWidth(dbInput,getPMBWidth(dbInput)+$(".ico16",jqField).outerWidth(true)+1,fieldVal);
			}
			break;
    	case "lable":
    		var labelField = jqField.find("#"+idStr);
            if(labelField!=undefined){
            	delSomePxWidth(labelField,null,fieldVal);
            }
            break;
    	case "externalwrite-ahead":
    		jqField.find("input[readonly]").css("color","blue");
    		delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
            break;
    	case "relation":
    		if("data_relation_member"==fieldVal.toRelationType){
                if(designTag||browseTag){
                	  delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }
            }else if("form_relation_field"==fieldVal.toRelationType){
                if(designTag||browseTag){
                	 delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }
            }else if("data_relation_multiEnum"==fieldVal.toRelationType){
                if(editTag){
                    var hiddenSelect = jqField.find("#"+idStr);
                    hiddenSelect.css("display","block");
                    var oldWidth = hiddenSelect.width();
                    jqField.find("input").eq(0).width(oldWidth-jqField.find("input").eq(1).width()-4);
//                    hiddenSelect.css("display","none");
                }else if(browseTag){
                	  delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }else if(designTag){
                	delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }
            }else if("data_relation_field"==fieldVal.toRelationType){
                if(designTag||browseTag){
                	 delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }
            }else if("form_relation_flow"==fieldVal.toRelationType){
                if(designTag||browseTag){
                	 delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
                }
            }
    		break;
    	case "checkbox":
    		
    	case "radio":
    		jqField.find("label").css({"width":"auto","display":"inline-block"});
			var radiocom = jqField.find(".radio_com");
			radiocom.css("width","14px").css("vertical-align","middle");
			if(editAndNotNull){
				if(jqField.find("input:radio:checked").length==0){
					jqField.find("label").css("background-color",nullColor);
					radiocom.css({"margin-top":"0px","background-color":nullColor});
				}else{
					jqField.find("label").css("background-color",notNullColor);
					radiocom.css({"margin-top":"0px","background-color":notNullColor});
				}
				radiocom.unbind("click").bind("click",function(){
					jqField.find("label").css("background-color",notNullColor);
					radiocom.css({"margin-top":"0px","background-color":notNullColor});
				});
			}
    		break;
    	case "date":
    	case "datetime":
    		var textInput = jqField.find("#"+idStr);
            var textInputTxtField = jqField.find("#"+idStr+"_txt");
    		var temptag = false;
    		if(editTag){
                textInput.attr("disabled",true);
                if(textInputTxtField.length > 0) {
                    textInputTxtField.attr("disabled",true);
                    textInputTxtField.css("width","96%");
                }
    			//--------------------------------------------------------m3上日期控件不支持，但是非空颜色要显示
    			if(editAndNotNull){
					textInput.change(function(){
						if(textInput.val()==""){
							textInput.css("background-color",nullColor);
                            if(textInputTxtField.length > 0){
                                textInputTxtField.css("background-color",nullColor);
                            }
						}else{
							textInput.css("background-color",notNullColor);
                            if(textInputTxtField.length > 0){
                                textInputTxtField.css("background-color",notNullColor);
                            }
						}
					});

					textInput.trigger("change");
				}
				if(textInput.width()<=0){
					textInput.css("width","100%");
					temptag = true;
				}
				if(textInput.width()<=0){
					textInput.css("width","100");
					temptag = true;
				}
				if(temptag){
					textInput.width(textInput.width()-18);
				}
            }
    		delSomePxWidth(textInput,null,fieldVal);
        	break;
    	case "handwrite":
    		var pdiv = jqField.find("div");
            pdiv.attr("id",idStr).css({"height":"auto"});
            var fieldBorderColor = pdiv.css("border-color");
            //非设计态下，如果签章单元格没设置边框，那么使用黑色边框1像素
            if(fieldBorderColor==null||fieldBorderColor==''||fieldBorderColor!="#000000"){
            	if(editTag){
            		pdiv.css("border","1px solid #000000");
            	}
            }
			//TODO   ios 显示签章控件为一条黑线， 原因是高度太小
            if(editTag){
				var pdivheight = pdiv.height();
				if(pdivheight < 10){
					pdivheight = 10;
				}
				if(editAndNotNull){
					jqField.closest("td").css("background-color",nullColor);
				}
                jqField.find("object[id^="+idStr+"]").attr("width",pdiv.width()-20).attr("height",pdivheight);
            }else{
                jqField.find("object[id^="+idStr+"]");
            }
            if(isPrint){
            	if(!$.browser.msie){
            		//OA-62592 如果不是IE 则显示提示语句，删除重新生成
            		jqField.find("center").remove();
            	}
            	jqField.find(".comp").comp();
            }
            break;
    	case "querytask":
    	case "exchangetask":
    		if(designTag||editTag){
            	var tempInp = jqField.find("#"+idStr);
				tempInp.attr("readonly","true");
                delSomePxWidth(tempInp,getPMBWidth(tempInp)+jqField.find(".ico16").outerWidth(true));
            }else if(browseTag){
            	 delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
            }
    		break;
    	case "flowdealoption":
    		var tarea = jqField.find("#"+idStr);
    		if(browseTag){
    			//bug chrome浏览器和搜狗浏览器下文本域不换行显示，一行显示不全，省略号代替_20140410024367
    			tarea.css("height","auto");
    			tarea.css("white-space","pre-wrap");
    			
    		}
    		//表单边框样式乱了_20140514025159 边框超出表格边线，多减去2px
			delSomePxWidth(tarea,getPMBWidth(tarea)+2,fieldVal);
    		break;
    	case "text":
			var changeField = jqField.find("#"+idStr);
			if(changeField!=null&&changeField!=undefined){
				changeField.css("white-space","pre-wrap");
			}
    		if(editTag){
				jqField.find("input[type='text']").each(function(){
					var textInput = $(this);
					if(editAndNotNull){
						textInput.change(function(){
							if(textInput.val()==""){
								textInput.css("background-color",nullColor);
							}else{
								textInput.css("background-color",notNullColor);
							}
						});
						textInput.trigger("change");
					}
                    if($(this).attr("id")==idStr+'_txt'){
                        var hiddenInput4display = jqField.find("#"+idStr);
                        delSomePxWidth(textInput,getPMBWidth(hiddenInput4display),fieldVal);
                    }else{
                    	delSomePxWidth(textInput,null,fieldVal);
						if(textInput.attr("id")==idStr){
							textInput.bind("focus",function(){
                                setTimeout(function(){
                                    textInput.attr("oldVal",textInput.val());
                                },300);

							});
						}
                    }
                });
    		}else if(browseTag ){
    			//if(needCalWidthFields.get(idStr, null)==null || (fieldVal.isMasterFiled =='false' && fieldVal.formatType=="urlPage")){
    				var browseSpan = jqField.find("span[id='"+idStr+"']");
    				if(browseSpan!=undefined){
                    	var delWidth = 0;
                    	jqField.find(".ico16").each(function(){
                    		delWidth+=$(this).outerWidth(true);
							//TODO OA-108700M3端，流程表单转发协同，查看协同正文，关联流程表单控件显示了3个错误图标；关联无流程表单还显示穿透图标。
							$(this).removeClass('ico16');
							//TODO  end
                    	});
                    	if(returnStyle(browseSpan[0],"width")!="auto"){
                    		delSomePxWidth(browseSpan,getPMBWidth(browseSpan)+delWidth,fieldVal);
                    	}
                   }
				//}
    			
              //bug chrome浏览器和搜狗浏览器下文本域不换行显示，一行显示不全，省略号代替_20140410024367
               // browseSpan.css({"min-height":"14px","overflow-y":"hidden","white-space":"pre-wrap"});
    		}else if(designTag){
    			var designInput = jqField.find("#"+idStr);
                if(designInput.length>0&&jqField.find(".comp").length<=0){
                	delSomePxWidth(designInput,null,fieldVal);
                }
    		}
    		break;
    	case "outwrite":
    		delSomePxWidth(jqField.find("#"+idStr),null,fieldVal);
    		break;
    	case "textarea":
    		//文本域特殊处理：如果是追加字段，先进行追加操作，之后再触发计算方法，否则原文本框被替换，无法追加
			var changeField = jqField.find("#"+idStr);
			if(changeField!=null&&changeField!=undefined){
				changeField.css("white-space","pre-wrap");
			}
    		if(jqField.hasClass(addClass)){
    			jqField.find("textarea").each(function(){
					var textAreaField = $(this);
    				if($(this).attr("onclick")!=null&&$(this).attr("onclick").indexOf("addarea")>=0){
    					$(this).removeAttr("onblur");
    				}
    				if(editAndNotNull){
    					textAreaField.change(function(){
							if(textAreaField.val()==""){
								textAreaField.css("background-color",nullColor);
							}else{
								textAreaField.css("background-color",notNullColor);
							}
						});
    					textAreaField.trigger("change");
					}
    			});
    		}else if(editTag){
    			if(editAndNotNull){
    				var textAreaField = jqField.find("textarea");
					textAreaField.change(function(){
						if(textAreaField.val()==""){
							textAreaField.css("background-color",nullColor);
						}else{
							textAreaField.css("background-color",notNullColor);
						}
					});
					textAreaField.trigger("change");
    			}
    		}
    		hasExecute = false;
    		break;
    	case "linenumber":
    		if(editTag){
				jqField.find("input[type='text']").each(function(){
            		delSomePxWidth($(this),null,fieldVal);
                });
    		}else if(browseTag){
    			var browseSpan = jqField.find("span[id='"+idStr+"']");
                if(browseSpan!=undefined){
                   	delSomePxWidth(browseSpan,null,fieldVal);
                }
    		}else if(designTag){
    			var designInput = jqField.find("#"+idStr);
               	delSomePxWidth(designInput,null,fieldVal);
    		}
    		break;
    	case "mapphoto":
    		if(browseTag){
    			var browseSpan = jqField.find("span[id='"+idStr+"']");
                if(browseSpan!=undefined){
                	var delWidth = getPMBWidth(browseSpan);
                	if(jqField.find(".ico16").length>0){
                		delWidth += jqField.find(".ico16").width();
                	}
                	browseSpan.css("overflow","visible");
                	delSomePxWidth(browseSpan,delWidth,fieldVal);
                	var tempImg = jqField.find("img");
                	if(tempImg.length>0){
                		var newImg = new Image();
                		newImg.onload=function(){
                			$(this).width(browseSpan.width()-delWidth).height(browseSpan.height()).css("cursor","pointer");
                			//如果是打印页面的话，就不需要绑定事件了OA-63698
//                			if(!isPrint){
//	                			$(this).unbind("click").bind("click",function(){
//	                            	window.showModalDialog($(this).attr('src'),window,'dialogHeight:768px;dialogWidth:1024px;center:yes;resizable:yes;');
//	                            });
//                			}
                		};
                		tempImg.replaceWith(newImg);
                		newImg.src = tempImg.attr("src");
                	}
                }
    		}else if(designTag){
    			var tempField = jqField.find("#"+idStr);
    			var delWidth = 8;
            	if(jqField.find(".ico16").length>0){
            		delWidth += jqField.find(".ico16").width();
            	}
            	delSomePxWidth(tempField,getPMBWidth(tempField)+delWidth,fieldVal);
    		}else {
                setBGColor_LBS("mapphoto",jqField);
            }
    		break;
    	case "mapmarked":
    		if(browseTag){
    			jqField.find("span[id='"+idStr+"']").css("color","blue");
				jqField.find("input[id='"+idStr+"']").css({"padding-left":"0px","padding-right":"0px","width":"97%"});
    		}else if(designTag){
    			var tempField = jqField.find("#"+idStr);
    			var delWidth = 8;
            	if(jqField.find(".ico16").length>0){
            		delWidth += jqField.find(".ico16").width();
            	}
            	delSomePxWidth(tempField,getPMBWidth(tempField)+delWidth,fieldVal);
    		}else {
                setBGColor_LBS("mapmarked",jqField);
            }
    		if(isPrint){
    			//input会在comp()之前被打印代码替换自定义属性值，导致无法comp
    			jqField.find(".comp").comp();
    			jqField.find("span.ico16").remove();
    		}
    		break;
    	case "maplocate":
    		if(isPrint){
    			//input会在comp()之前被打印代码替换自定义属性值，导致无法comp
    			jqField.find(".comp").comp();
				jqField.find("span.ico16").remove();
    		}else{
    			if(designTag){
    				var tempField = jqField.find("#"+idStr);
        			var delWidth = 8;
                	if(jqField.find(".ico16").length>0){
                		delWidth += jqField.find(".ico16").width();
                	}
                	delSomePxWidth(tempField,getPMBWidth(tempField)+delWidth,fieldVal);
    			}else if(editTag){
    				jqField.find("#"+idStr+"_txt").css("background-color","#F8F8F8");
                    setBGColor_LBS("maplocate",jqField);
    			}
				jqField.find("input[id='"+idStr+"']").css({"padding-left":"0px","padding-right":"0px","width":"97%"});
    		}
    		break;
        case "select":
            var parentTd = jqField.parent("td");
            var parentTdH = parentTd.height();
            var selectField = jqField.find("#"+idStr);
            if(editTag){
                if(editAndNotNull){
                    selectField.css("height",parentTdH);
                    if(selectField.val()==""){
                        selectField.css("background-color",nullColor);
                    }else{
                        selectField.css("background-color",notNullColor);
                    }
                    selectField.change(function(){
                        if($(this).val() == ""){
                            selectField.css("background-color",nullColor);
                        }else {
                            selectField.css("background-color",notNullColor);
                        }
                    });
                }
            }
			 if (browseTag) {
                var browseSpan = $("span[id='" + idStr + "']",jqField);
                if(fieldVal.formatType == "name4image" || fieldVal.formatType == "image4image"
                    || fieldVal.formatType == "disimage" || fieldVal.formatType == "disname"){
                    var _objHeight = browseSpan.height();
                    var _bImage = $("img",browseSpan);
                    var r = _bImage.width() / _bImage.height();
                    _bImage.height(_objHeight);
                    if(!isNaN(r) && r != 0){
                        _bImage.width(_objHeight * r);
                    }
                }
                if (browseSpan != undefined) {
                    delSomePxWidth(browseSpan, null, fieldVal);
                }
            }
            break;
    	default :
    		hasExecute = false;
    }
    if(!hasExecute){
		if(browseTag){
            var browseSpan = jqField.find("span[id='"+idStr+"']");
            if(browseSpan!=undefined){
            	delSomePxWidth(browseSpan,null,fieldVal);
            }
        }else if(designTag){
            var designInput = jqField.find("#"+idStr);
            if(designInput.length<=0){
                return true;
            }
            if(jqField.find(".comp").length<=0&&(fieldVal.inputType=='text'||fieldVal.inputType=='relation'||fieldVal.inputType=='externalwrite-ahead'||fieldVal.inputType=="outwrite")){
            	delSomePxWidth(designInput,null,fieldVal);
            }else if(fieldVal.inputType=='select'){
            	delSomePxWidth(designInput,null,fieldVal);
            }
            jqField.find("textarea[id]").each(function(){
            	delSomePxWidth(designInput,null,fieldVal);
            })
        }else{
            //表单中input超出边线，所以减去一部分宽度//编辑态
            if(editTag&&(jqField.find(".comp").length<=0||(jqField.find(".comp").attr("comp")!=undefined&&jqField.find(".comp").attr("comp").indexOf("onlyNumber")>0))){//不存在comp组件或者组件为onlyNumber的text
                jqField.find("input[type='text']").each(function(){
                    if($(this).attr("id")==idStr+'_txt'){
                        var hiddenInput4display = jqField.find("#"+idStr);
                        hiddenInput4display.css("display","block");
						$(this).width(hiddenInput4display.width());
						delSomePxWidth($(this),getPMBWidth($(this)));
                        hiddenInput4display.css("display","none");
                    }else{
                    	delSomePxWidth($(this),getPMBWidth($(this)));
                    }
                });
                jqField.find("textarea[id]").each(function(){
                	var tempJqTextArea = $(this);
                	var tempTextAreaId = tempJqTextArea.attr("id");
					delSomePxWidth(tempJqTextArea,null,fieldVal);
					if(autoTextAreaCacheMap.get(tempTextAreaId)==undefined){
						var msheets = document.styleSheets;
						for(var q=0;q<msheets.length;q++){
							/**
							 * TODO  M1修改 
							 */
							var mrules = "";
							if(msheets[q].rules != undefined ){
								mrules = msheets[q].rules;
							}
							for(var p=0;p<mrules.length;p++){
								var mrule = mrules[p];
								if(mrule.selectorText=="#"+tempTextAreaId){
									//判断infopath中是否在  “文本框属性->显示” 中设置了  “多行-自动换行-展开以显示所有文本”
									if(mrule.style.overflowX=="visible"&&mrule.style.overflowY=="visible"){
										autoTextAreaCacheMap.put(tempTextAreaId,tempJqTextArea);
										$.extend(fieldVal,{"autoHeightTextera":"true"});
										autoTextArea(this);
										break;
									}
								}
							}
						}
					}else{
						autoTextArea(this);
					}
                });

            }else if(jqField.hasClass(addClass)){
                jqField.find("textarea[id]").each(function(){
                	delSomePxWidth($(this),null,fieldVal);
                });
            }
        }
    }
    //为关联表单控件计算宽度
    if(jqField.find(".correlation_form_16").length>0){
        if(browseTag){
            var display = jqField.find("#"+idStr);
            var btm = jqField.find(".correlation_form_16");
            if(btm.length>0){
            	var delWidth = 0;
            	jqField.find(".ico16").each(function(){
            		delWidth+=$(this).outerWidth(true);
            	});
            	delWidth+=10;
            	if(display.width()>delWidth){
            		delSomePxWidth(display,delWidth,fieldVal);
            	}
            }
            if(isPrint){ //打印页面把所有的关联表单图标去掉。
                btm.each(function(){
                    $(this).hide();
                });
            }
        }else if(designTag){//设计态
        	if("relationform"==fieldVal.inputType){
        		var display = jqField.find("#"+idStr);
                delSomePxWidth(display,getPMBWidth(display)+jqField.find(".ico16").outerWidth(true),fieldVal);
        	}
        }
  
		var xdr = jqField.find(".xdRichTextBox");
		if(xdr.length>0){
			var validateParm = xdr.attr("validate");
			if(validateParm!=undefined){
				validateParm = $.parseJSON("{"+validateParm+"}");
				if(validateParm.notNull=="true"||validateParm.notNull==true){
					if(jqField.find("span").eq(0)[0] == undefined){
						//if(jqField.find("span").eq(0).innerHTML){
						//}
						//xdr.css("background-color",nullColor);
					}else{
						if ((jqField.find("span").eq(0)[0].innerHTML) == ""|| "&nbsp;" == $.trim(jqField.find("span").eq(0)[0].innerHTML)){//没关联
							xdr.css("background-color",nullColor);
						}else{
							xdr.css("background-color",notNullColor);
						}
					}
				}
			}
		}
	  }
    if(jqField.find(".documents_penetration_16").length>0){
    	if(browseTag){
            var display = jqField.find("#"+idStr);
            if(display.length<=0){
            	display = jqField.find("#"+idStr+"_txt");
            }
            var btm = jqField.find(".documents_penetration_16");
            if(display.length>0){
            	var fwidth = display.width()-getPMBWidth(display)-btm.outerWidth(true);
            	display.width(fwidth);
            	display.attr("finalWidth",fwidth);
            }
            if(isPrint) { //打印页面把所有的关联表单图标去掉。
                btm.each(function(){
                    $(this).hide();
                });
            }        
        }
    }
    if(isPrint){//打印的时候需要单独处理textArae 不能显示滚动条，把文字全部显示出来
    	if(fieldVal.inputType=='textarea'){
    		jqField.find("#"+idStr).each(function (){
				var textareaField = $(this);
				if(textareaField.clientHeight<textareaField.scrollHeight){
					textareaField.css("height","auto");
				}
				var height = $(this).height();
				textareaField.css({"overflow-y":"visible","overflow-x":"visible","min-height":height+"px"});
            });
       }
    }
}
/**
 * 自动高度的textarea初始化方法
 * @param elem
 */
function autoTextArea(elem){
	var jqField = $(elem);
	jqField.bind("focus",function(){
		window.activeobj=this;
		this.clock=setInterval(function(){
			var rangeHeight = parseInt(activeobj.scrollHeight)-parseInt(activeobj.clientHeight);
			//OA-63483公司协同升级：新建协同，调用表单模板，鼠标单击备注准备进行输入时，然后整行就一直往大里撑
			if((rangeHeight)>4||rangeHeight<0){
				activeobj.style.height=activeobj.scrollHeight+'px';
			}
		},200);
	});
	jqField.bind("blur",function(){
		clearInterval(this.clock);
	});
	var oldactiveobj = window.activeobj;
	window.activeobj=elem;
	window.activeobj =  oldactiveobj;
}
//获取单元格的边框、padding、margin的宽度和，IE7、8不支持outerWidth，所以要做单独处理。
function getPMBWidth(browseSpan){
	var dw = 0;
	if(browseSpan==undefined||browseSpan==null||browseSpan.length<=0){
		return dw;
	}
	var fid = browseSpan.attr("id");
	if(bpmCacheMap.get(fid)==undefined){
		if($.browser.msie&&parseInt($.browser.version,10)<=8){
			var borderLeftWidth = returnStyle(browseSpan[0],"borderLeftWidth");
			var borderLeftStyle = returnStyle(browseSpan[0],"borderLeftStyle");
			if(borderLeftWidth!=undefined&&borderLeftWidth!=null&&"none"!=borderLeftStyle){
				if(borderLeftWidth.indexOf("px")!=-1){
					dw += parseInt(borderLeftWidth.replace("px",""));
				}else if(borderLeftWidth.indexOf("pt")!=-1){
					dw += parseInt(borderLeftWidth.replace("pt",""))*(4/3);
				}
			}
			var borderRightWidth = returnStyle(browseSpan[0],"borderRightWidth");
			var borderRightStyle = returnStyle(browseSpan[0],"borderRightStyle");
			if(borderRightWidth!=undefined&&borderRightWidth!=null&&"none"!=borderRightStyle){
				if(borderRightWidth.indexOf("px")!=-1){
					dw += parseInt(borderRightWidth.replace("px",""));
				}else if(borderRightWidth.indexOf("pt")!=-1){
					dw += parseInt(borderRightWidth.replace("pt",""))*(4/3);
				}
			}
			var paddingLeft = returnStyle(browseSpan[0],"paddingLeft");
			if(paddingLeft!=undefined&&paddingLeft!=null){
				if(paddingLeft.indexOf("px")!=-1){
					dw += parseInt(paddingLeft.replace("px",""));
				}else if(paddingLeft.indexOf("pt")!=-1){
					dw += parseInt(paddingLeft.replace("pt",""))*(4/3);
				}
			}
			var paddingRight = returnStyle(browseSpan[0],"paddingRight");
			if(paddingRight!=undefined&&paddingRight!=null){
				if(paddingRight.indexOf("px")!=-1){
					dw += parseInt(paddingRight.replace("px",""));
				}else if(paddingRight.indexOf("pt")!=-1){
					dw += parseInt(paddingRight.replace("pt",""))*(4/3);
				}
			}
			var marginLeft = returnStyle(browseSpan[0],"marginLeft");
			if(marginLeft!=undefined&&marginLeft!=null){
				if(marginLeft.indexOf("px")!=-1){
					dw += parseInt(marginLeft.replace("px",""));
				}else if(marginLeft.indexOf("pt")!=-1){
					dw += parseInt(marginLeft.replace("pt",""))*(4/3);
				}
			}
			var marginRight = returnStyle(browseSpan[0],"marginRight");
			if(marginRight!=undefined&&marginRight!=null){
				if(marginRight.indexOf("px")!=-1){
					dw += parseInt(marginRight.replace("px",""));
				}else if(marginRight.indexOf("pt")!=-1){
					dw += parseInt(marginRight.replace("pt",""))*(4/3);
				}
			}
		}else{
			dw = browseSpan.outerWidth(true)-browseSpan.width();
		}
		bpmCacheMap.put(fid, dw);
	}else{
		dw = bpmCacheMap.get(fid,0);
	}
	return dw;
}
/**
 * jquery对象减去somePx宽度，因为在正常模式下html的input标签等会超出显示
 * jqInput 需要减去宽度的jquery对象
 * somePx 需要减去的像素，如果为null标示需要使用缓存技术来进行优化的字段
 */
function delSomePxWidth(jqInput,somePx,fieldValObj){
	if(jqInput.css("display")!="none"){
		var idkey = jqInput.attr("id");
		if((somePx==null)&&(needCalWidthFields.get(idkey, null)==null)){//somePx传递空表示为需要优化的字段
			somePx = getPMBWidth(jqInput);
		}
		if(somePx==0||somePx==null){
			return;
		}
		var jqWidth = fieldWidthCacheMap.get(idkey);
		if(jqWidth==null||jqWidth==undefined){
			jqWidth = jqInput.width();
			fieldWidthCacheMap.put(idkey,jqWidth);
		}
		if(jqWidth!=0&&jqWidth>somePx){
	    	if(jqInput[0].tagName.toLowerCase()=='input'&&returnStyle(jqInput[0],"width")=="auto"){
	    		jqInput.css("width","100%");
	        }
	    	//jqInput.css("width",jqInput.width()-somePx+"px");
        	//先缓存计算出来的宽度，最后一次性设置width，优化性能
        	//jqInput.attr("finalWidth",(jqWidth-somePx));
			var inputWidth = jqWidth-somePx;
			//if(inputWidth < 35){
			//	inputWidth = 35;
			//}

			jqInput.css("width",inputWidth);
			setTimeout(function(){
				$("span[name="+jqInput.attr("id")+"],input[name="+jqInput.attr("id")+"]").each(function(){
					$(this).css("width",inputWidth);
				});
			},200);

        	jqInput.data("fieldValObj",fieldValObj);
        	needCalWidthFields.put(idkey,jqInput);
	    }
	}
}
    
/**
 *获取表单html
 */
function getFormContentHtml(){
    return $("body").html();
}
    
/*单元格赋值方法，只供计划使用，只支持选人 选部门 选岗位三种控件赋值
 *参数targetDom：需要被赋值的控件dom
 *obj形如：
 *        var testObj = {};
 *        testObj.id='Member|8651084924486960543';
 *        testObj.text='黄涛';
 */
 function setFormFieldVal(targetDom,obj){
     var targetSpId = targetDom.attr("id");
     var targetId = targetSpId.split("_")[0];
     if(targetSpId!=undefined&&targetId!=undefined){
         var idInp = targetDom.find("input[id="+targetId+"]");
         var txtInp = targetDom.find("input[id="+targetId+"_txt"+"]");
         if(idInp.size()>0&&txtInp.size()>0){
             idInp.val(obj.id);
             var tempcompStr = txtInp.attr("comp");
             var tempCompObj = $.parseJSON("{"+tempcompStr+"}");
             tempCompObj.value = obj.id;
             tempCompObj.text = obj.text;
             txtInp.val(obj.text);
             txtInp.attr("comp",$.toJSON(tempCompObj).replace("{","").replace("}",""));
         }
     }
 }
    
/**对外接口JS方法
 *返回表单定义对象
 **/
 function getFormObj(){
     return form;
 }
 //获取表单是否加锁
 function getLocker(){
     return (formDataLocker==null||formDataLocker==undefined?null:formDataLocker);
 }
   /**重复项前追加定制开发的按钮功能
*defineButton 完整的HTML按钮
*img对象中的data("currentRow")可以得到当前选中重复项行对象
*当前行的recordId属性可以得到当前重复项在数据库中的ID
*/
function initButton(defineButton){
    $("#img").append(defineButton);
}
/****
**计划参照功能，选择关联计划
**/
function selectPlan(obj){
    var fieldObj = $(obj).parent();
    try{
        parent.window.relationPlan(obj);            
    }catch(e){
        relationPlan(obj);
    }
}
/**
 * 根据行号和表名获取子表数据，（从页面中获取，有可能获取的值不全）
 */
function getRowDataById(recordId,tableName){
    var repeatTable = $("#"+tableName);
    if(repeatTable.length>0){
        var tagName = repeatTable[0].nodeName.toLowerCase();
        var rowData;
        if(tagName==="table"){//重复表
            rowData = $("tr[recordid='"+recordId+"']",repeatTable);
        }else{//重复节
            rowData = $("div[recordid='"+recordId+"']",repeatTable);
        }
        return getRowData(rowData[0]);
    }else{
        return null;
    }
}

/**
 * 发送ajax请求移除Session中当前表单数据缓存对象
 */
function removeSessionMasterData(){
    var tempFormManager = new formManager();
    var dataId = $("#contentDataId").val();
    tempFormManager.removeSessionMasterData({"masterDataId":dataId});
}
/**
 * 该方法用于删除dee缓存数据
 */
function removeDeeSessionData(){
	var tempFormManager = new formManager();
    var dataId = $("#contentDataId").val();
    tempFormManager.removeDeeSessionData({"masterDataId":dataId});
}
        
/**
 * 选择关联表单的时候，页面中重复行前面添加选择框
 */
function initRelationSubTable(initParam){
    var checkBoxDom = $("<input class=\"radio_com\" value=\"0\" type=\"checkbox\">");
    var addTdWidth = 20;
    for(var i=0;i<form.tableList.length;i++){
        var tempTable = form.tableList[i];
        if(tempTable.tableType.toLowerCase()==="slave"){
            var subDom = $("[id='"+tempTable.tableName+"']");
            if(subDom&&subDom.length>0){
                /***************************重复表*******************************/
                if(subDom[0].nodeName.toLowerCase()==="table"){
                    var tableLayout=subDom.css("table-layout");
                    subDom.css("table-layout","auto");
                    subDom.find("colgroup").each(function(){
                        var tempCol = $("<col style='width:"+addTdWidth+"px;'/>");
                        var oldCols = $(this).find("col");
                        var eachColDiff = addTdWidth/oldCols.length;
                        oldCols.each(function(){
                           $(this).width($(this).width()-eachColDiff);
                        });
                        $(this).children("col:first-child").before(tempCol);
                    });
                    subDom.find("tbody").each(function(){
                        var tempTbody = $(this);
                        if(!tempTbody.hasClass("xdTableHeader")&&tempTbody.find("input[id='id']").length==0&&tempTbody.find("input[name='id']").length==0){
                        	return;
                        }
                        var cname = tempTbody.attr("class");
                        if(cname!=undefined&&cname.toLowerCase()==="xdtableheader"){//行头
                        	var theadtrs = $(this).find("tr");
                        	theadtrs.each(function(trindex){
                        		var tempTd = $("<td style='width:"+addTdWidth+"px;border:none;'></td>");
                                tempTd.prependTo($(this));
                    		});
                        } else {
                            $(this).find("tr[recordid]").each(function(trindex){
                            	//正头
                            	if(trindex==0){
                            		var selectAllTr = $(this).clone();
                            		selectAllTr.find("td").each(function(tdindex){
                            			$(this).empty();
                            			if(tdindex==0){
                            				var ckClone = checkBoxDom.clone();
                                            ckClone.attr("title",$.i18n("guestbook.leaveword.banch.select.all"));
                                            ckClone.data("tableName",tempTable.tableName);
                                            var tempTd = $("<td style='width:"+addTdWidth+"px;border:none;'></td>");
                                            tempTd.append(ckClone);
                                            tempTd.prependTo(selectAllTr);
                                            ckClone.unbind("click").bind("click",function(){
                                                var c = this.checked;
                                                var allCheckBox = $(":checkbox[tableName='"+$(this).data("tableName")+"']");
                                                allCheckBox.each(function(){
                                                    this.checked = c;
                                                    $(this).trigger("click");
                                                    this.checked = c;
                                                });
                                            });
                            			}
                            		});
                            		selectAllTr.removeAttr("path").removeAttr("recordid").removeAttr("onclick").unbind("click");
                            		$(this).before(selectAllTr);
                            	}
                            	//正文行
                                var oldTds = $(this).find("td");
                                var eachTdDiff = addTdWidth/oldTds.length;
                                oldTds.each(function(){
                                    $(this).width($(this).width()-eachTdDiff).css("overflow","hidden");
                                 });
                                //var trpos = getElementPos(this);
                                var ckClone = checkBoxDom.clone();
                                ckClone.attr("tableName",tempTable.tableName);
                                ckClone.attr("masterId",$("#contentDataId").val());
                                ckClone.attr("formId",$("#contentTemplateId").val());
                                if(initParam!=undefined && (typeof initParam == "object" )){
                                    if(initParam.type==undefined||initParam.type==null){
                                        ckClone.unbind("click").bind("click",function(){
                                            initParam.onclick(this);
                                        });
                                    }else if(initParam.type=="relationForm"){
                                        $(this).removeAttr("onclick");
                                        $(this).unbind("click");
                                    }
                                }
                                var tempTd = $("<td style='width:20px;border:none;'></td>");
                                var tableLayout=subDom.css("table-layout");
                                subDom.css("table-layout","auto");
                                tempTd.append(ckClone);
                                $(this).children("td:first-child").before(tempTd);
                                ckClone.val($(this).attr("recordid"));
                                //ckClone.offset(trpos);
                            });
                        }
                    });
                    if(tableLayout=="fixed"){
                        subDom.css("table-layout","fixed");
                    }
                /***************************重复节*******************************/
                }else if(subDom[0].nodeName.toLowerCase()==="div"){
                    var isMobileForm = subDom.hasClass("light-form-repeatTable");
                    var childrens = subDom.children();
                    //重复节无表头，全选就放在重复节最外层div前
                    var headPos = getElementPos(subDom[0]);
                    var divHeadCheckBoxClone = checkBoxDom.clone();
                    divHeadCheckBoxClone.attr("title",$.i18n("guestbook.leaveword.banch.select.all"));
                    divHeadCheckBoxClone.data("tableName",tempTable.tableName);
                    subDom.append(divHeadCheckBoxClone);
                    headPos.top = headPos.top-15;
                    divHeadCheckBoxClone.unbind("click").bind("click",function(){
                        var c = this.checked;
                        var allCheckBox = $(":checkbox[tableName='"+$(this).data("tableName")+"']");
                        allCheckBox.each(function(){
                            this.checked = c;
                            $(this).trigger("click");
                            this.checked = c;
                        });
                    });
                    childrens.each(function(){
                        var divpos = getElementPos(this);
						if(this.nodeName.toLowerCase()!="div"){
                        	return;
                        }
                        divpos.top = divpos.top+3;
                        if(isMobileForm){
                            divpos.top = divpos.top+11;
                            $(this).find("dd").eq(0).css("margin-left","5px");
                        }
                        var ckClone = checkBoxDom.clone();
                        ckClone.attr("tableName",tempTable.tableName);
                        ckClone.attr("masterId",$("#contentDataId").val());
                        ckClone.attr("formId",$("#contentTemplateId").val());
                        $(this).append(ckClone);
                        if(initParam!=undefined && (typeof initParam == "object" )){
                            if(initParam.type==undefined||initParam.type==null){
                                ckClone.unbind("click").bind("click",function(){
                                  initParam.onclick(this);
                                });
                            }else if(initParam.type=="relationForm"){
                              $(this).removeAttr("onclick");
                              $(this).unbind("click");
                            }
                        }
                        ckClone.val($(this).attr("recordid"));
                        ckClone.offset(divpos);
                    });
                    if(isMobileForm){
                        headPos.top=headPos.top+27;
                    }
                    divHeadCheckBoxClone.offset(headPos);
                }

            }
        }
    }
}

   
/**
 * 获取被选中子表行数据（表名和id）
 */
function getSelectedSubData(){
    var subData = new Array();
    for(var i=0;i<form.tableList.length;i++){
        var tempTable = form.tableList[i];
        if(tempTable.tableType.toLowerCase()==="slave"){
            var tempSubData = new Object();
            tempSubData.tableName = tempTable.tableName;
            var subDom = $("#"+tempTable.tableName);
            var tempSubArray = new Array();
            if(subDom){
                var allCheckedBox = $(":checkbox[checked][tableName='"+tempTable.tableName+"']");
                allCheckedBox.each(function(){
                    tempSubArray.push($(this).val());
                });
            }
            tempSubData.dataIds = tempSubArray;
            subData.push(tempSubData);
        }
    }
    var paramObj = new Object();
    paramObj.formId = $("#contentTemplateId").val();
    paramObj.datas = subData;
    paramObj.masterDataId = $("#contentDataId").val();
    return $.toJSON(paramObj);
}

/**
 * 延时0.1s执行，避免和增减行函数冲突
 */
function calc(field) {
	setTimeout(function(a){
		calc_source(field);}, 100);
}
    
/**
 * 表单计算响应函数，组装表单数据提交到系统后台进行计算，计算完成之后调用回调函数将计算结果回填到表单那计算结果字段中。
 * @param field 当前单元格对象
 */
	
function calc_source(field) {
	return;
	if(!allowCalc) return;
	if(calcFieldDataCache == null) {
		calcFieldDataCache = new Map();
	} 
    if(field&&field.params&&field.params.inputField){//日期控件选择后触发计算
        field.hide();//隐藏日历选择器
        field = field.params.inputField;
    }
    var jqueryField = $(field);
    var inCalculate = jqueryField.attr("inCalculate");
    var inCondition = jqueryField.attr("inCondition");
	//TODO  android和e本，编辑表单的控件类型（人员、部门、日期时间...）的单元格时，直接点击输入框选择值后，返回表单详情界面一直闪烁"加载中"
	if (clientType == C_sClientType_AndroidPad|| clientType == C_sClientType_AndroidPhone){
		var value = jqueryField.val();
		var id = jqueryField.attr("id");
		var oldVal = calcFieldDataCache.get(id);
		
		if(oldVal == value){
			return;
		} else {
			calcFieldDataCache.put(id,value);
		} 
	}
	
  //普通输入框计算优化，如果值没有改变就不触发计算了
    if(jqueryField[0].tagName.toLowerCase()=='input'){
    	var jpSpan = jqueryField.parent("span");
    	var fieldValStr = jpSpan.attr("fieldVal");
        if(fieldValStr!=null && fieldValStr!=undefined){
            if($.parseJSON(fieldValStr).inputType==='text'){
            	var oldVal = jqueryField.attr("oldVal");
            	if(oldVal === jqueryField.val()){
            		return;
            	}
            } else if ($.parseJSON(fieldValStr).inputType==='member' || $.parseJSON(fieldValStr).inputType==='datetime'){
				
				
			}
            if($.parseJSON(fieldValStr).fieldType==='DECIMAL'){
              if("-" === jqueryField.val()){
                return;
              }
            }
        }
    }
    var needValidate = true;
    if(jqueryField.attr("type")=='radio'&&jqueryField[0].tagName.toLowerCase()=='input'){
        jqueryField[0].checked=true;
        needValidate = false;
        jqueryField = jqueryField.parents("span[id='"+jqueryField.attr("name")+"_span']");
    }
    //校验数据唯一
    var isUnique = jqueryField.attr("unique");
    if(isUnique == true || isUnique == "true"){
  	  if(validateUnique(jqueryField)){
  		return false;
  	  }
    }
    if(inCalculate=="true" || inCondition=="true"){
        var recordId = getRecordIdByJqueryField(jqueryField);
        if(needValidate){
            var validateOpt = new Object();
            validateOpt['errorAlert'] = true;
            validateOpt['errorBg'] = true;
            validateOpt['errorIcon'] = false;
            validateOpt['validateHidden'] = true;
            validateOpt['checkNull'] = false;
            if (!jqueryField.validate(validateOpt)) {
                return false;
            }
        }
        var tableName = "";
        var fieldName = jqueryField.attr("id");
        fieldName = fieldName.split("_")[0];
        //提交表单主表数据和重表数据到系统后台进行计算。
        var url = _ctxPath + '/form/formData.do?method=calculate&formMasterId=' + $("#contentDataId").val() + '&formId=' + $("#contentTemplateId").val() + "&tableName=" + tableName + "&fieldName=" + fieldName + "&recordId=" + recordId + "&tag=" + (new Date()).getTime()+"&rightId="+$("#rightId").val();
        var formData = [];
        for ( var i = 0; i < form.tableList.length; i++) {
            var tName = form.tableList[i].tableName;
            var tempTable = $("#" + tName);
            if (tempTable.length > 0) {
                formData.push(tName);
            }
        }
        
        var calcValidate = new Object();
        calcValidate['errorAlert'] = true;
        calcValidate['errorBg'] = true;
        calcValidate['errorIcon'] = false;
        calcValidate['validateHidden'] = true;
        calcValidate['checkNull'] = false;
        if (!$("body").validate(calcValidate)) {
            return false;
        }
        //触发
        var ss = $.ctp.trigger('fieldValueChange');
        if(!ss){
            calculating = false;
            return false;
        }
        //进度条
        var processBar;
        var paramObj = new Object();
        paramObj.formMasterId = $("#contentDataId").val();
        paramObj.formId = $("#contentTemplateId").val();
        paramObj.tableName = tableName;
        paramObj.fieldName = fieldName;
        paramObj.recordId = recordId;
        paramObj.rightId = $("#rightId").val();
        paramObj.moduleId= $("#moduleId").eq(0).val();
		var contentData=getFormJson();
        paramObj.needCheckRule=false;//是否校验
        paramObj.notSaveDB=true;//是否保存到数据库
        paramObj.data =contentData.data;// $.toJSON(jsonObj);
		paramObj.viewType='pcForm';

		//preSubmitData(function(){
			top.$s.CapForm.calculate ({},paramObj,{
				repeat:false,   //当网络掉线时是否自动重新连接
				success:function(_obj){
					var resultObj = _obj;
					if(resultObj.success =="true" ||resultObj.success==true){
					   changeAuth(resultObj.viewRight);
					   formCalcResultsBackFill(resultObj.results);
					   disableEditInput();
					}else{
						$.alert(resultObj.errorMsg);
					}
				},
				error:function(e){
					var cmpHandled = parent.cmp.errorHandler(e);
					if(cmpHandled) {
					}else{
						$.alert(e.message);
					}
				}
			});

	//	});



       // var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_Calculate, paramObj);
       // requestClientWithParameter(commandStr);
        /*var calculateFormManager = new mFormAjaxManager();
        calculateFormManager.calculate1(paramObj, {
            success : function(objs) {
                var _objs = objs;// $.parseJSON(objs);
                if (_objs.success == "true" || _objs.success == true) {
                    _objs = _objs.results;
                    formCalcResultsBackFill(_objs);
                }else{
                    $.alert(_objs.errorMsg);
                }
                if(processBar!=undefined){
                    processBar.close();
                }
            }
        });*/
    }
    /* if(event==null){
        event=window.event;
    }
    if(event.stopPropagation!=null){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    } */
}
/**
 * 后台权限变化之后回填页面
 * @param viewRight
 */
function changeAuth(viewRight){
	var rightIdField = $("#rightId");
	if(viewRight!=null&&viewRight!=undefined&&rightIdField.val()!=viewRight){
		rightIdField.val(viewRight);
    	$("#img").removeClass("hidden").addClass("hidden");
    }
}  
    
/**
 *校验数据唯一
 */
function validateUnique(field){
	var isUnique = false;
	var isNew = window.parent.window.isNew == "false" ? false : true;
    var fieldName = field.attr("id");
    fieldName = fieldName.split("_")[0];
	var url = _ctxPath + '/form/formData.do?method=validateFieldUnique&formMasterId=' + $("#contentDataId").val() + '&formId=' + $("#contentTemplateId").val() + "&fieldData=" + field.val() + "&isNew=" + isNew + "&fieldName=" + fieldName + "&tag=" + (new Date()).getTime();
	//判断当前重复项列是否唯一
	var isSlaveUnique = false;
	//如果id相同的大于一个，说明是重复项，重复项先过滤当前列，再去数据库中比较
	if($("span[id$='"+field.attr("id")+"_span']").length > 1){
		var count = 0;
    	$("span[id$='"+field.attr("id")+"_span']").each(function(){
            var fieldValStr = $(this).attr("fieldVal");
            if(fieldValStr != null && fieldValStr != undefined){
                var fieldValObj = $.parseJSON(fieldValStr);
                if(fieldValObj.value != null && fieldValObj.value == field.val()){
                	count = count + 1;
                }
            }
        });
    	if(count > 1){
    		isSlaveUnique = true;
    	}
	}
	if(isSlaveUnique == true){
		$.alert({
    		'msg':"该字段设置了数据唯一,数据不能重复！请重新输入！",
			ok_fn:function(){
				field.focus();
		}});
		isUnique = true;
	}
	if(!isUnique){
        //$("body").jsonSubmit({
        //    action : encodeURI(url),
        //    debug : false,
        //    validate : false,
        //    ajax:true,
        //    callback : function(objs) {
        //        var _objs = $.parseJSON(objs);
        //        if(_objs.success=="true"||_objs.success==true){
        //        	$.alert({
        //        		'msg':"该字段设置了数据唯一,数据不能重复！请重新输入！",
        //				ok_fn:function(){
        //					field.focus();
        //					isUnique = true;
        //			}});
        //        }
        //    }
        //});
	}
	return isUnique;
}
    
/**
 *关联项目选择或者重置之后的回调函数
 */
//TODO 需要对ajax进行新的实现
function chooseProjectCallBack(projectDom){
    if(projectDom){
        var pSpan = projectDom.parent("span[id]");
        var idStr = pSpan.attr("id").split("_")[0];
        var displayInput = pSpan.find("#"+idStr+"_txt");
        var submitInput = pSpan.find("#"+idStr);
        if(pSpan.hasClass("editableSpan")){
        	if(submitInput.val()==""){
        		displayInput.css("background-color",nullColor);
        	}else{
        		displayInput.css("background-color",notNullColor);
        	}
        }
        submitInput.attr("inCalculate",displayInput.attr("inCalculate")).attr("inCondition",displayInput.attr("inCondition"));
        //先处理数据关联-关联项目
        var params = new Object();
        //获取项目id
        var projectId = pSpan.find("#"+idStr).val();
        if(projectId==undefined||projectId==""){
        	projectId = "0";
        }
        params.projectId = projectId;
        var fieldval = pSpan.attr("fieldVal");
        if(fieldval!=null&&fieldval!=undefined){
            fieldval = $.parseJSON(fieldval);
        }
        //非主表字段需要传递recordId
        if(fieldval.isMasterFiled==true||fieldval.isMasterFiled=="true"){
            params['recordId'] = '0';
        }else{
        	params['recordId'] = getRecordIdByJqueryField(projectDom);
        }
        //当前选人单元格fieldName
        params['fieldName'] = idStr;
        params['rightId'] = $("#rightId").val();
        params['formId'] = form.id;
        params['formDataId'] = $("#contentDataId").val();
        var tempFormManager = new mFormAjaxManager();
        tempFormManager.dealProjectFieldRelation(params,{
            success:function(_obj){
                var returnObj = $.parseJSON(_obj);
                if(returnObj.success == "true"||returnObj.success==true){
                	changeAuth(returnObj.viewRight);
                    formCalcResultsBackFill(returnObj.results);
                }else{
                    $.alert(returnObj.errorMsg);
                }
                calc(submitInput[0]);
                return;
            }
        });
    }
}
/**
 *根据fieldName查询当前
 */
function getRecordIdByJqueryField(jqueryField){
    var recordId = 0;
    if(jqueryField.parents("table[id^=formson_]").length>0){
    	recordId = jqueryField.parents("tr[recordid]").find("input[name=id]").val();
    }else if(jqueryField.parents("div[id^=formson_]").length>0){
    	recordId = jqueryField.parents("div[recordid]").attr("recordid");
    }
    //防护一下，上面有的时候会undefined
    if(!recordId){
        recordId = 0;
    }
    return recordId;
}

function setAllowCalc(isCalc) {
	allowCalc = isCalc;
}

/**
 * 添加或者删除重复项响应函数
 */
function addOrDelTr(targetTr) {
    dealRepeatTable(targetTr);
}
/**
 * 添加或者删除重复节响应函数
 */
function addOrDelDiv(targetDiv) {
    dealRepeatTable(targetDiv);
}

/**
 * 根据某行的dom对象获取本行的数据
 * param line：某行的dom对象
 */
function getRowData(row){
    var tempRow = $(row);
    var planParamObj = new Object();
    planParamObj.id=tempRow.attr("id");
    var dataArray = [];
    $("span[id$='_span']",tempRow).each(function(){
        var fieldValStr = $(this).attr("fieldVal");
        if(fieldValStr!=null&&fieldValStr!=undefined){
            var fieldValObj = $.parseJSON(fieldValStr);
            dataArray.push(fieldValObj);
        }
    });
    planParamObj.datas=dataArray;
    return planParamObj; 
}

/**
 *  点击某行重复表或者重复节之后，处理添加行和删除行按钮的显示和赋予事件
 */
function dealRepeatTable(target){
	// m1 报错  因此注释掉
	/*var ss = $.ctp.trigger('dealRepeatChange');
    if(!ss){
       return ; 
    }*/
	 var path = $(target).attr("path");
	 if(path==undefined){
	    	return;
	    }
   
    if(path.indexOf("/")!=-1){
        path = path.split("/")[1];
    }
    getFormTableAuth(path,$("#rightId").val(),function(tableOperation){
        var imgDiv = $("#img");
        if(imgDiv.length<=0){
            return;
        }
        imgDiv.removeClass("hidden").css("visibility","visible");
        imgDiv.css("display", "block");
        imgDiv.data("currentRow",getRowData(target));
        var addImg = $("#addImg");
        var addEmptyImg = $("#addEmptyImg");
        var delImg = $("#delImg");
        if(addImg.hasClass("ico16") && addImg.find("img").length == 0){
            addImg.removeClass("ico16");
            addImg.append('<img src="ic_form_copy.png">');
        }
        if(addEmptyImg.hasClass("ico16") && addImg.find("img").length == 0){
            addEmptyImg.removeClass("ico16");
            addEmptyImg.append('<img src="ic_form_new.png">');
        }
        if(delImg.hasClass("ico16") && addImg.find("img").length == 0){
            delImg.removeClass("ico16");
            delImg.append('<img src="ic_form_delete_row.png">');
        }
        var pos = getElementPos(target);
		var left=pos.left - imgDiv.width();
        pos.left = (left>0?left:0);
        imgDiv.offset(pos);
        //允许添加
        if(tableOperation!=undefined&&tableOperation.allowAdd){
            addImg.css("display", "block");
            addEmptyImg.css("display", "block");
            addImg[0].title = $.i18n("form.base.copyRow.label");
            addEmptyImg[0].title = $.i18n("form.base.addRow.label");
            addImg.unbind("click").bind("click",{ currentNode : target }, copyRepeat);
            addEmptyImg.unbind("click").bind("click", { currentNode : target }, addEmpty);
        }else{
            addImg.css("display", "none");
            addEmptyImg.css("display", "none");
        }
        //允许删除
        if(tableOperation!=undefined&&tableOperation.allowDelete){
            delImg.css("display", "block");
            delImg[0].title = $.i18n("form.base.delRow.label");
            delImg.unbind("click").bind("click",{ currentNode : target }, delCurrentRepeat);
        }else{
            delImg.css("display", "none");
        }
    });
}
/**
 *获取位置,返回位置对象，如：{left:23,top:32}
 */
function getElementPos(el) {
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera') != -1);
    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    if (el.parentNode === null || el.style.display == 'none') {
        return false;
    }
    var parent = null;
    var pos = [];
    var box;
    if (el.getBoundingClientRect) {//IE，google
        box = el.getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft;
        if(navigator.appName.toLowerCase()=="netscape"){//google
        	scrollTop = Math.max(scrollTop, document.body.scrollTop);
        	scrollLeft = Math.max(scrollLeft, document.body.scrollLeft);
        }
        return { left : box.left + scrollLeft, top : box.top + scrollTop };
    } else if (document.getBoxObjectFor) {// gecko
        box = document.getBoxObjectFor(el);
        var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
        var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
        pos = [ box.x - borderLeft, box.y - borderTop ];
    } else {// safari & opera
        pos = [ el.offsetLeft, el.offsetTop ];
        parent = el.offsetParent;
        if (parent != el) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }
        if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;
        }
    }
    if (el.parentNode) {
        parent = el.parentNode;
    } else {
        parent = null;
    }
    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
        pos[0] -= parent.scrollLeft;
        pos[1] -= parent.scrollTop;
        if (parent.parentNode) {
            parent = parent.parentNode;
        } else {
            parent = null;
        }
    }
    return {
        left : pos[0],
        top : pos[1]
    };
}
    
//M1 add
function adjustRepeatHeight(target) {
    var divArray = target.children("div");
    if(divArray.length > 0) {
        var adjustHeight = 0;
        for(var i = 0; i < divArray.length; i++) {
            var tmpObj = $(divArray[i]);
            var tmpHeight = tmpObj.height();
            adjustHeight += tmpHeight;
        }
        target.css("height", adjustHeight);
    }
}

function adjustRepeatWidth(target){
    target.find("input[id^=field],textarea[id^=field]").each(function(index,tagetInput){
        var tagetInputW = $(tagetInput).width();
        if(tagetInputW && $(tagetInput).attr("type")!="checkbox"){
            tagetInput.style.width = (tagetInputW -5) + "px";
        }
    })
}

function validateRepeatRow(tempNode){
  	if(tempNode==null||tempNode==undefined){
  		return fasle;
  	}
  	var validateOpt = new Object();
	  validateOpt['errorAlert'] = true;
	  validateOpt['errorBg'] = true;
	  validateOpt['errorIcon'] = false;
	  validateOpt['validateHidden'] = true;
	  validateOpt['checkNull'] = false;
	  if (!tempNode.validate(validateOpt)) {
	      return false;
	  }else{
	  	return true;
	  }
 }

/**
 * 增删减重复行的时候获取子表表名
 * @param tagNode 当前行jquery对象
 * @returns
 */
function getSubTableNameByRow(tagNode){
	var htmlRepeat = tagNode.parents("table[id^='formson']");
    if(htmlRepeat.length<=0){
    	htmlRepeat = tagNode.parents("div[id^='formson']");
    }
    if(htmlRepeat.length<=0){
    	return "";
    }else{
    	return htmlRepeat.attr("id");
    }
}	 
var importRepeatTb="";
function importRepeatData(e){
	importRepeatTb=e.data.table;//标记当前导入的是哪个重复表
	insertAttachmentPoi("excelImport");
}
function exportRepeatData(e){
    $("#downloadFileFrame").attr("src",_ctxPath+"/form/formData.do?method=exportRepeatTableTemplate&rightId="+$("#rightId").val()+"&formId="+form.id+"&tableName="+e.data.table);
}
function dataImportCall(fileId){
	//对重复表预操作
	var trs=$("#"+importRepeatTb+">tbody[class!='xdTableHeader'][class!='xdTableFooter']").children("tr");
	var lastTr=trs.last();
	//新增加一空行(为了不影响现有的行)，协助添加数据，最后删除该空行
	var emptyTr=addEmpty({data:{currentNode:lastTr}});
	//进度条
    var processBar;
	var url = _ctxPath + '/form/formData.do?method=dealExcel&tableName='+ importRepeatTb 
    + '&fileUrl=' + fileId.instance[0].fileUrl + '&formId=' + form.id + "&rightId=" + $("#rightId").val()
    + "&formMasterId=" + $("#contentDataId").val() + "&recordId=" + emptyTr.attr("recordid");
	emptyTr.jsonSubmit({
        action : url,
        debug : false,
        validate : false,
        ajax:true,
        async:true,
        beforeSubmit:function(){
			changeTableLayout4ie7("fixed");
            processBar =  new MxtProgressBar({text: $.i18n("form.base.calc.alert"),isMode:false});
        },
        callback : function(objs) {
        	try{
        	var resultObj =$.parseJSON(objs);
        	var isError=false;
    		if(resultObj.length == 1){
    			var err=resultObj[0].ERROR;
    			if(err && err != ""){
    				$.alert(err);
    				isError=true;
    			}
    		}
    		//如果重复表只有一行，判断是否为空行，来决定是否删除
    		var isFirstTrNull=false;
    		var isExcelHasData=false;
    		if(!isError){
	    		var trCount=trs.length;
	    		if(trCount == 1){//多行时默认都有值
	    			isFirstTrNull=isRepeatTbFirstTrNull($("#"+importRepeatTb));
	    		}
	    		isExcelHasData=resultObj.length > 0;
	    		for(var i=resultObj.length-1;i>=0;i--){
	    			createRepeatRecord(emptyTr,resultObj[i]);
	    		}
	    		if(isExcelHasData){
	    			changeAuth(resultObj[0].viewRight);
	    		}
    		}
    		//收尾
    	    delCurrentRepeat({data:{currentNode:emptyTr[0]}});
    		//第一行是空的，且导入数据不为空，则删掉第一行
    		if(isFirstTrNull && isExcelHasData){
    			delCurrentRepeat({data:{currentNode:lastTr}});
    		}
    		changeTableLayout4ie7("auto");
        	}catch(e){}
        	if(processBar!=undefined){
                processBar.close();
            }
        }
    });
}
/**
 * 导入重复表数据时根据返回数据，生成一行
 */
function createRepeatRecord(emptyTr,data) {
    var currentClone = formClone(emptyTr);
    var recordId = currentClone.attr("recordid");
    if(recordId==""){
        recordId = 0;
    }
    //清空子表数据的id
    currentClone.find("input[type='hidden'][name='id']").val("");
    currentClone.find("span[id$='_span']").each(function(){
        $(this).html("");
    });
    currentClone.insertAfter(emptyTr);
    importRepeatFillBack(currentClone,data);
}
function importRepeatFillBack(currentNode,objs) {
    //兼容google浏览器
    objs = objs.replace("<pre style=\"word-wrap: break-word; white-space: pre-wrap;\">","").replace("</pre>", "").replace("<pre>", "");
    var _objs = $.parseJSON(objs);
    if(_objs.success=="true"||_objs.success==true){
        var datas = _objs.datas;
        if(currentNode!=null&&currentNode!=undefined){
             for(var i=0;i<datas.length;i++){
                  repeatLineFillBack(datas[i],currentNode);
             }
        }
        formCalcResultsBackFill(_objs.results);
    }else{
        $.alert(_objs.errorMsg);
    }
}
/**
 * 处理重复表的path名称
 * @param path
 * @returns {*}
 */
function dealRepeatPath (path){
    if(path.indexOf("/")!=-1){
        path = path.split("/")[1];
    }
    return path;
}
/**
 * 拷贝当前选中的重复项或者重复节 移动端模式使用
 * @param currentLine
 */
function copyRepeat4phone(currentLine){
	//首先判断权限是否是允许复制
	var param = {};
	param.data={};
	param.data.currentNode=currentLine;
    var path = dealRepeatPath(currentLine.attr("path"));
    getFormTableAuth(path,$("#rightId").val(),function(auth){
        if(auth.allowAdd){
            copyRepeat(param);
        }else{
            dialogMsg("","不允许复制。",1);
        }
    });
}

 /**
 * 拷贝当前选中的重复项或者重复节
 */
function copyRepeat(e) {
     var tagNode = $(e.data.currentNode);
     var tagTable = tagNode.parents("table");
     if(tagTable.attr("allowAddDelete") == false || tagTable.attr("allowAddDelete") == "false"){   //todo m3暂定功能
         dialogMsg("提示","当前表单不支持处理，请切换到轻表单或者电脑端处理！");
         return;
     }
	setAllowCalc(false);
    adjustRepeatHeight(tagNode);//M1
    if(!validateRepeatRow(tagNode)){
    	return false;
    }
    var tagName = tagNode[0].nodeName.toUpperCase();
    var currentClone = formClone(tagNode);
    var recordId = currentClone.attr("recordid");
    if(recordId==""){
        recordId = 0;
    }
    if(repeatPhotoLocationImgShow) {
    	repeatPhotoLocationImgShow = false;
    }
    //发送ajax请求获取添加重复表数据的recordId并回填因为添加此列数据所引发的计算结果
    var formData = new Object();
    formData.type = "copy";
    formData.tableName = getSubTableNameByRow(tagNode);
    if(formData.tableName===""){
    	return;
    }
    formData.recordId = recordId;
    formData.rightId = $("#rightId").val();
    //清空子表数据的id
    currentClone.find("input[type='hidden'][name='id']").val("");
    currentClone.find("span[id$='_span']").each(function(){
        $(this).html("");
    });
    currentClone.insertAfter(tagNode);
    sendReq4AddOrDel(tagNode, formData,currentClone);
    var imgDiv = $("#img");
    var pos = getElementPos(tagNode[0]);
    pos.left = pos.left - imgDiv.width();
    imgDiv.offset(pos);
     refreshScroll4AddOrDelRepeateTable(tagNode,true);
}
/**
 * 添加空的重复项或者重复节 移动端模式使用
 * @param currentLine
 */
function addEmpty4phone(currentLine) {
	var param = {};
	param.data={};
	param.data.currentNode=currentLine;
    var path = dealRepeatPath(currentLine.attr("path"));
    getFormTableAuth(path,$("#rightId").val(),function(auth){
        if(auth.allowAdd){
            addEmpty(param);
        }else{
            dialogMsg("","不允许增加。",1);
        }
    });
}

/**
 * 添加空的重复项或者重复节
 */
function addEmpty(e) {
    var tagNode = $(e.data.currentNode);
    var tagTable = tagNode.parents("table");
    if(tagTable.attr("allowAddDelete") == false || tagTable.attr("allowAddDelete") == "false"){   //todo m3暂定功能
        dialogMsg("提示","当前表单不支持处理，请切换到轻表单或者电脑端处理！");
        return;
    }
	setAllowCalc(false);
    if(!validateRepeatRow(tagNode)){
    	return false;
    }
    var tagName = tagNode[0].nodeName.toUpperCase();
    var currentClone = formClone(tagNode);
    var recordId = currentClone.attr("recordid");
    var formData = new Object();
    formData.type = "empty";
    formData.tableName = getSubTableNameByRow(tagNode);
    if(formData.tableName===""){
    	return;
    }
    formData.recordId = recordId;
    formData.rightId = $("#rightId").val();
    //清空子表数据的id
    currentClone.find("input[type='hidden'][name='id']").val("");
    currentClone.find("span[id$='_span']").each(function(){
        $(this).html("");
    });
    currentClone.insertAfter(tagNode);
    sendReq4AddOrDel(tagNode, formData,currentClone);
    var imgDiv = $("#img");
    var pos = getElementPos(tagNode[0]);
    pos.left = pos.left-imgDiv.width();
    imgDiv.offset(pos);
    refreshScroll4AddOrDelRepeateTable(tagNode,true);
    return currentClone;
}
/**
 * 删除当前行重复项或者重复节 移动端模式使用
 * @param currentLine
 */
function delCurrentRepeat4phone(currentLine) {
	var param = {};
	param.data={};
	param.data.currentNode=currentLine;
    var path = dealRepeatPath(currentLine.attr("path"));
    getFormTableAuth(path,$("#rightId").val(),function(auth){
        if(auth.allowDelete){
            delCurrentRepeat(param);
        }else{
            dialogMsg("提示","不允许删除。",1);
        }
    });

}

/**
 * 删除当前行重复项或者重复节
 */
function delCurrentRepeat(e) {
    var tagNode = $(e.data.currentNode);
    var tagTable = tagNode.parents("table");
    if(tagTable.attr("allowAddDelete") == false || tagTable.attr("allowAddDelete") == "false"){   //todo m3暂定功能
        dialogMsg("提示","当前表单不支持处理，请切换到轻表单或者电脑端处理！");
        return;
    }
	setAllowCalc(false);
	var formData = new Object();
    formData.tableName = getSubTableNameByRow(tagNode);
    var tagName = tagNode[0].nodeName.toUpperCase();
    if (tagName == "TR") {
        //如果当前是最后一条重复项，则不予以删除，否则可以删除
        var repeadSize = tagNode.parent("tbody").children("tr").length;
        if (repeadSize > 1) {
            tagNode.remove();
            $("#img").css("visibility", "hidden");
        } else {
            dialogMsg($.i18n("common.prompt"),$.i18n("form.base.delRow.alert"));
            return;
        }
    } else if (tagName == "DIV") {
        //如果当前是最后一条重复节，则不予以删除，否则可以删除
        var repeadSize = tagNode.parent("div").children("div[recordid]").length;
        if (repeadSize > 1) {
            tagNode.remove();
            $("#img").css("visibility", "hidden");
        } else {
            dialogMsg($.i18n("common.prompt"),$.i18n("form.base.delRow.alert"));
            return;
        }
    }
    var calculate = null;
    formData.type = "del";
    if(formData.tableName===""){
    	return;
    }
    formData.recordId = tagNode.attr("recordid");
    formData.rightId = $("#rightId").val();
    sendReq4AddOrDel(tagNode, formData,null);
    try{parent.afterDelRow(formData.recordId);}catch(e){
    	try{afterDelRow(formData.recordId);}catch(e){}
    }//提供删除重复项后的回调方法
    refreshScroll4AddOrDelRepeateTable(tagNode,false);
}
//重复表增减行后，下面增加的行数被隐藏了
function refreshScroll4AddOrDelRepeateTable(currentTr,isAdd){
    if(typeof myscroll != "undefined"){
        var currentTrHeight = currentTr.height();
        var scroller = myscroll.scroller;
        var scrollerH = scroller.offsetHeight;
        if(isAdd){
            scroller.style.height = (scrollerH + currentTrHeight) + "px";
        }else {
            scroller.style.height = (scrollerH - currentTrHeight) + "px";
        }
        myscroll.refresh();
    }


}
/**
 * 后台权限变化之后回填页面
 * @param viewRight
 */
function changeAuth(viewRight){
	var rightIdField = $("#rightId");
	if(viewRight!=null&&viewRight!=undefined&&rightIdField.val()!=viewRight){
		rightIdField.val(viewRight);
    	$("#img").removeClass("hidden").addClass("hidden");
    }
}
/**
 * 下拉框change时间响应函数，发送ajax请求处理关联枚举
 */
function changeReflocation(targetSelect) {
    var jquerySelect = $(targetSelect);
    var fieldName = jquerySelect.attr("id");

    //如果是重复项或者重复节中的单元格，则需要带recordId
    var recordId = getRecordIdByJqueryField(jquerySelect);
    var paramObj = new Object();
    paramObj.recordId = recordId;
    paramObj.fieldName = fieldName;
    paramObj.formId = form.id;
    paramObj.formMasterId = $("#contentDataId").val();
    paramObj.currentEnumItemValue = jquerySelect.val();
    paramObj.level = jquerySelect.attr("level");
    paramObj.rightId = $("#rightId").val();
	paramObj.viewType ="pcForm";

    //var relationEnumFormManager = new mFormAjaxManager();
	top.$s.CapForm.dealMultiEnumRelation({},paramObj,{
		repeat:false,   //当网络掉线时是否自动重新连接
        success:function(_obj){
            var resultObj = _obj;
			if(resultObj.success =="true" ||resultObj.success==true){
			   changeAuth(resultObj.viewRight);
			   formCalcResultsBackFill(resultObj.results);
            }else{
                $.alert(resultObj.errorMsg);
            }
        },
		error:function(e){
			var cmpHandled = parent.cmp.errorHandler(e);
			if(cmpHandled) {
			}else{
				$.alert(e.message);
			}
		}
    });
}

/**
 * 检查是否是唯一
 */
function checkIsUnique(targetField) {

}

/**
 * 单选按钮 Radio选中事件响应函数
 */
function setRadioChecked(targetRadio) {

}
/**
 * 文本域添加权限，添加响应函数
 */
function addarea(targetArea) {
	appendTextFromClient(targetArea);
    /*var dialog = $.dialog({
        html : $.i18n("form.base.addArea.label")+'<br><textarea id=\"area\" style=\"width:360px;height:150px;\"></textarea><br>'+$.i18n("form.base.example.label")+'<br>'+$.i18n("form.base.inputContent.label")+'abc<br>'+$.i18n("form.base.displayAs.label")+'<br>',
        title : $.i18n("form.base.addAreaTitle.label"),
        height : 260,
        width : 400,
        targetWindow:window,
        isClear:false,
        buttons : [
                {
                    text : $.i18n("guestbook.leaveword.ok"),
                    handler : function() {
                        var addedText = $("#area").val();
                        var currentDate = new Date();
                        var dateStr = currentDate.getFullYear() + "-";
                        var formatMon = currentDate.getMonth() + 1,formatDay = currentDate.getDate();
                        var formatHour = currentDate.getHours(),formartMin = currentDate.getMinutes();
                        dateStr = dateStr + (formatMon<10?"0"+formatMon:formatMon) + "-";
                        dateStr = dateStr + (formatDay<10?"0"+formatDay:formatDay) + " ";
                        dateStr = dateStr + (formatHour<10?"0"+formatHour:formatHour) + ":";
                        dateStr = dateStr + (formartMin<10?"0"+formartMin:formartMin);
                        //dateStr = dateStr + currentDate.getMinutes()+":";
                        //dateStr = dateStr + currentDate.getSeconds()+"";
                        var ps = "[" + $.ctx.CurrentUser.name+" " + dateStr + "]";
                        var validateObj;
                        var maxLen = null;
                        try{
                        	validateObj = $.parseJSON("{"+$(targetArea).attr("validate")+"}");
                        	maxLen = parseInt(validateObj.maxLength);
                        }catch(e){}
                        if(maxLen!=null&&maxLen-getTextLength(targetArea.value)-getTextLength(ps)<getTextLength(addedText)){
                        	if(maxLen-getTextLength(targetArea.value)-getTextLength(ps)<=0){
                        		$.alert($.i18n("form.base.addArea.cantAppendAlert"));//無法繼續追加文字
                        	}else{
                        		$.alert($.i18n("form.base.addArea.mostCharNum",maxLen-getTextLength(targetArea.value)-getTextLength(ps)));//最多還能追加N個文字
                        	}
                        	return;
                        	$("#area").focus();
                        }else{
                            addedText = addedText + ps;
                            if($.trim(targetArea.value) == ""){
                                targetArea.value = addedText;
                            }else{
                                targetArea.value = targetArea.value + "\n" + addedText;
                            }
                            dialog.close();
                        }
                    }
                }, {
                    text : $.i18n("systemswitch.cancel.lable"),
                    handler : function() {
                        dialog.close();
                    }
                } ]
    });
	$("#area").focus();*/
}
//获取字符串长度；中文算3个字符
function getTextLength(value){
  	if(value==null||value==""){
  		return 0;
  	}else{
  		var result = 0;
  		for(var i=0, len=value.length; i<len; i++){
  			var ch = value.charCodeAt(i);
  			if(ch<256){
  				result++;
  			}else{
  				result +=3;
  			}
  		}
  		return result;
  	}
}
/**
 * 修改表单校验不通过字段的背景颜色
 */
function changeColor(fieldName){
    var targetSpan = $("span[id='"+fieldName+"_span']");
    targetSpan.find(":input").css({"background-color":"#FCDD8B","border-color":"#000000"});
    targetSpan.find("label").css({"background-color":"#FCDD8B","border-color":"#000000"});
    targetSpan.find("#"+fieldName).css({"background-color":"#FCDD8B","border-color":"#000000"});
}
/**
 * 校验规则不通过字段的背景颜色
 */
function changeValidateColor(fieldName){
    var targetSpan = $("span[id='"+fieldName+"_span']");
    targetSpan.find(":input").css({"background-color":"#FFA597","border-color":"#000000"});
    targetSpan.find("label").css({"background-color":"#FFA597","border-color":"#000000"});
    targetSpan.find("#"+fieldName).css({"background-color":"#FFA597","border-color":"#000000"});
}
/**
 *
 * 扩展控件onclick响应函数
 */
function extendEvent(extendField) {
	var inputField = $(extendField);
	var fieldJSON = inputField.parent().attr("fieldVal");
	if(fieldJSON!=null&&fieldJSON!="undefined"&&fieldJSON!=""){
		var fieldVal = $.parseJSON(fieldJSON);
       	if(fieldVal.toRelationType === "data_relation_dee"){
       		return;
       	}
       	var inputType = fieldVal.inputType;
       	if(inputType==="exchangetask"){
       		selectDeeTaskResult(false,fieldVal,extendField);
       	}else if(inputType==="querytask"){
       		selectDeeTaskResult(true,fieldVal,extendField);
       	}
	}
}

/*
 * 数据交换中对表单单元格进行回填数据
 */
function callBackWithtoRelFormField(toRelFormField,fieldValue,recordId,inputField){
	if(toRelFormField != "" && toRelFormField!="undefined"){
		//数据关联中，关联了dee任务字段的表单字段名称数组
		var relationFieldNameArr = toRelFormField.split(",");
		for(var j=0; j<relationFieldNameArr.length; j++){
			var fields = document.getElementsByName(relationFieldNameArr[j]);
			if(fields.length>1){
				if(recordId==="undefined"||recordId == undefined){
					for(var k=0; k<fields.length; k++){
						fields[k].value = fieldValue;
					}
				}else{
					inputField.parent().parent().parent().find("input[name="+relationFieldNameArr[j]+"]").val(fieldValue);
				}
			}else
				document.getElementById(relationFieldNameArr[j]).value = fieldValue;
		}
	}
}

/*
 * 弹出选择dee任务数据的对话框
 */
var dialog;
function selectDeeTaskResult(isSearch,fieldVal,extendField){
	var params = "";
	params += "&formId="+form.id;
	params += "&fieldName="+fieldVal.name;
	params += "&contentDataId="+$("#contentDataId").val();
	var recordId = getRecordIdByJqueryField($(extendField));
	params += "&recordId="+recordId;
	var dialogUrl = _ctxPath+"/dee/deeDataDesign.do?method=selectDeeDeeDataList" + params + "&tag="+(new Date()).getTime();
	dialogUrl = encodeURI(dialogUrl);
	preSubmitData(function(){
		if(isSearch == false){
			 dialog = $.dialog({
		        url:dialogUrl,
		        title : "数据交换引擎任务列表 ",
		        targetWindow : getCtpTop(),
		        width:$(getCtpTop()).width()-100,
		        height:$(getCtpTop()).height()-100,
		        isClear:false,
		        closeParam:{show:true,handler:function(){
		        	removeDeeSessionData();
		        }},
		        buttons : [
		                {
		                    text : $.i18n("guestbook.leaveword.ok"),
		                    handler : function() {
		                    	var returnObj = dialog.getReturnValue();
		                    	if(returnObj.success == false){
		                    		$.alert("请选择数据！");
		                    		return;
		                    	}
		                    	var url = _ctxPath + '/dee/deeDataDesign.do?method=deeDataFill4Form&contentDataId=' + $("#contentDataId").val()
		                    	+ "&formId=" + form.id + "&fieldName=" + fieldVal.name + "&tag=" + (new Date()).getTime()
		                    	+"&rightId="+$("#rightId").val()+"&masterId="+returnObj.selectMasterId+"&recordId="+recordId;
//		                    	+ "&masterIds="+ returnObj.deeMasterIds;
		                    	//进度条
	                            var processBar;
	                            $("body").jsonSubmit({
	                                action : url,
	                                domains : null,
	                                debug : false,
	                                validate : false,
	                                ajax:true,
	                                beforeSubmit:function(){
	                                    processBar =  new MxtProgressBar({text: "dee数据回填表单中...",isMode:false});
	                                },
	                                callback : function(objs) {
	                                    //兼容google浏览器需要下面这一句替换掉google浏览器添加的pre
	                                    objs = objs.replace("<pre style=\"word-wrap: break-word; white-space: pre-wrap;\">","").replace("</pre>", "").replace("<pre>", "");
	                                    var _objs = $.parseJSON(objs);
	                                    if(_objs.success=="true"||_objs.success==true){
	                                    	changeAuth(_objs.viewRight);
	                                        _objs = _objs.results;
	                                        formCalcResultsBackFill(_objs);
	                                    }else{
	                                        $.alert(_objs.errorMsg);
	                                    }
	                                    if(processBar!=undefined){
	                                        processBar.close();
	                                    }
	                                }
	                            });
		                        dialog.close();
		                    }
		                }, {
		                    text : $.i18n("systemswitch.cancel.lable"),
		                    handler : function() {
		                    	//移除缓存
		                    	removeDeeSessionData();
		                        dialog.close();
		                    }
		                } ]
		    });
		}else{
			 dialog = $.dialog({
		        url:dialogUrl,
		        title : "数据交换引擎任务列表 ",
		        targetWindow : getCtpTop(),
		        width:$(getCtpTop()).width()-100,
		        height:$(getCtpTop()).height()-100,
		        isClear:false,
		        closeParam:{show:true,handler:function(){
		        	removeDeeSessionData();
		        }},
		        buttons : [{
		                    text : $.i18n("common.button.close.label"),
		                    handler : function() {
		                    	//移除缓存
		                    	removeDeeSessionData();
		                        dialog.close();
		                    }
		                  }]
		    });
		}
	},function (){
		$.alert("预提交数据失败！");
	},false);
}

/**
 *关联表单关联数据
 */
function showRelationList_M1Dec(field){
    var inputField = $(field);
    //判断被关联表单是否已经被删除
    if(inputField.attr("toFormDel")==="true"){
        $.alert('${ctp:i18n("form.create.input.relation.label")}'+'${ctp:i18n("form.flowiddel.label")}');
        return;
    }
    //判断被关联表单是否建立了模板
    var templateSize = inputField.attr("templateSize");
    if(templateSize!=undefined&&templateSize<=0){
        var formName = inputField.attr("formName");
        $.alert('${ctp:i18n("form.app.form.label")}'+":"+formName+'${ctp:i18n("form.app.nobind.label")}');
        return;
    }
    var recordId = getRecordIdByJqueryField(inputField);
    var relation = $.parseJSON(inputField.attr("relation"));
    var dialogUrl = ""
    var title = "";
    if(inputField.attr("formType")==1){//流程表单
        title = '${ctp:i18n("form.base.formCollebration.title")}';
        dialogUrl = window._ctxServer+"/form/formData.do?method=colFormRelationList&formId="+relation.toRelationObj+"&fromFormId=" + relation.fromRelationObj + "&fromRelationAttr=" + relation.fromRelationAttr + "&toRelationAttr=" + relation.toRelationAttr +"&tag="+(new Date()).getTime();
    }else{//无流程表单
        title = '${ctp:i18n("form.base.relationForm.title")}';
        dialogUrl = window._ctxServer+"/form/formData.do?method=getFormMasterDataList&formId="+relation.toRelationObj+"&fromFormId=" + relation.fromRelationObj + "&fromRelationAttr=" + relation.fromRelationAttr + "&toRelationAttr=" + relation.toRelationAttr +"&type=formRelation"+"&tag="+(new Date()).getTime();
    }
    var dialog = $.dialog({
        url:dialogUrl,
        title : title,
        targetWindow : top,
        width:$(top).width()-100,
        height:$(top).height()-100,
        buttons : [
                {
                    text : '${ctp:i18n("guestbook.leaveword.ok")}',
                    handler : function() {
                        /**返回数据格式
                         {toFormId:yyyy,
                          selectArray:[{masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]},
                                       {masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]}]
                         }
                         */
                        //1、获取到所选数据
                        var retObj = dialog.getReturnValue();
                        retObj = $.parseJSON(retObj);
                        if(retObj!=null&&retObj.toFormId!=null){
                            var dataId = retObj.dataId;
                            var toFormId = retObj.toFormId;
                            //2、根据获取到的表单数据dataId,fieldName,formId,rightId发送ajax请求，返回的是回填数据
                            var tempFormManager = new formManager();
                            var params = new Object();
                            params['selectArray'] = retObj.selectArray;
                            params['fieldName'] = inputField.attr("name");
                            params['rightId'] = $("#rightId").val();
                            params['toFormId'] = toFormId;
                            params['fromFormId'] = form.id;
                            params['recordId'] = recordId;
							var  moduleID  = $("#moduleId").val();
							
							if(moduleID != '-1'){
								params['moduleId'] = moduleID;
							} else {
								params['moduleId'] = summaryID;
							
							}
 							
                            params['fromDataId'] = $("#contentDataId").val();
                            tempFormManager.dealFormRelation(params,{
                                success:function(_obj){
                                  fillBackRowData(_obj);
                                }
                            });
                        }
                        dialog.close();
                    }
                }, {
                    text : '${ctp:i18n("systemswitch.cancel.lable")}',
                    handler : function() {
                        dialog.close();
                    }
                } ]
    });
}

/**
 * 表单关联页面数据回填函数
 */
function fillBackRowData(_obj){
  var returnObj = _obj;//$.parseJSON(_obj);
  if(returnObj.success=="true"||returnObj.success==true){
      var datas = returnObj.datas;
      fillBackSubRow(datas);
      formCalcResultsBackFill(returnObj.results);
  }else{
      $.alert(returnObj.errorMsg);
  }
}

/**
 * 改href方式为onclick事件,处理栏目单页面冒泡
 * @param url
 */
function showUrlPage(url){
	 var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_openUrlPage, url);
     requestClientWithParameter(commandStr);
}
function fillBackSubRow(datas){
	if(datas!=null){
		var dataLen = datas.length;
		for(var i=0;i<dataLen;i++){
			var data = datas[i];
			var subArea = $("#"+data.tableName);
			if(subArea!=null&&subArea!=undefined&&subArea.length>0){
				var currentNode;
				var modelNode;
				if(subArea[0].tagName.toLowerCase()==="div"){
					modelNode = subArea.children("div").eq(0);
					currentNode = $(modelNode[0].tagName+"[recordid='"+data.recordId+"']",subArea);
					if(currentNode==null||currentNode==undefined||currentNode.length==0){
						currentNode = formClone(modelNode);
						currentNode.find(".radio_com").remove();
						currentNode.attr("recordid",data.recordId);
						if(i!=0&&$(modelNode[0].tagName+"[recordid='"+datas[i-1].recordId+"']",subArea).length>0){
							currentNode.insertAfter($(modelNode[0].tagName+"[recordid='"+datas[i-1].recordId+"']",subArea));
							//addRelationCbox(false,currentNode,data.tableName);
						}else{
							var showMoreBtn = subArea.find("div[id^='showMore_']");
							if(showMoreBtn.length>0){//有更多
								showMoreBtn.parent().before(currentNode);
								var  spans = showMoreBtn.find(".ico16");
								if(spans.length > 0) {
									spans.removeClass("ico16");
								}

							}else{
								subArea.append(currentNode);
							}
							//addRelationCbox(false,currentNode,data.tableName);
						}
					}
				}else if(subArea[0].tagName.toLowerCase()==="table"){
					modelNode = subArea.find("tr[recordid]").eq(0);
					currentNode = $("tr[recordid='"+data.recordId+"']",subArea);
					if(currentNode==null||currentNode==undefined||currentNode.length==0){
						currentNode = formClone(modelNode);
						currentNode.find(".radio_com").remove();
						currentNode.attr("recordid",data.recordId);
						if(i!=0&&$(modelNode[0].tagName+"[recordid='"+datas[i-1].recordId+"']",subArea).length>0){
							currentNode.insertAfter($(modelNode[0].tagName+"[recordid='"+datas[i-1].recordId+"']",subArea));
							//addRelationCbox(true,currentNode,data.tableName);
						}else{
							var subTbody = subArea.find("tbody[class!='xdTableHeader']");
							//附件组件增加了table布局，导致重复行中有其他table!tbody
							if(subTbody.length==0){
								subArea.find("tbody[class!='xdTableHeader']").append(currentNode);
							}else{
								subTbody.each(function(){
									var tempBody = $(this);
									if(tempBody.find("input[name='id']").length>0){
										var showMoreBtn = tempBody.find("div[id^='showMore_']");
										if(showMoreBtn.length>0){//有更多
											showMoreBtn.parent().parent().before(currentNode);
											var  spans = showMoreBtn.find(".ico16");
											if(spans.length > 0) {
												spans.removeClass("ico16");
											}
										}else{
											tempBody.append(currentNode);
										}
										//	addRelationCbox(true,currentNode,data.tableName);
									}
								});
							}
						}
					}
				}
				repeatLineFillBack(data,currentNode);
			}
		}
	}
}
/**
 * 关联视图中往行前面添加复选框
 * @param isTable
 * @param currentNode
 */
function addRelationCbox(isTable,currentNode,tableName){
	if(formViewInitParam!=null){//关联查看需要在行的前面增加一行用于放checkbox
		var checkBoxDom = $("<input class=\"radio_com\" value=\"0\" type=\"checkbox\">");
		checkBoxDom.attr("tableName",tableName);
		checkBoxDom.attr("masterId",$("#contentDataId",_mainBodyDiv).val());
		checkBoxDom.attr("formId",form.id);
		checkBoxDom.val(currentNode.attr("recordid"));
		if(isTable){//重复表
			currentNode.children("td:first-child").append(checkBoxDom);
		}else{//重复节
			var divpos = getElementPos(currentNode[0]);
            divpos.top = divpos.top+3;
            currentNode.append(checkBoxDom);
            checkBoxDom.offset(divpos);
		}
	}
}
/**
 *查看表单关联来源
 */
function showFormRelationRecord(tempSpan){
    var tempUrl = "";
    var recordId = "0";
    var tempField = $(tempSpan);
    var oldId = tempField.attr("name");
    tempField.attr("name",tempField.attr("fname"));
    recordId = getRecordIdByJqueryField(tempField);
    tempField.attr("name",oldId);
    var showType = tempField.attr("showType");
    var params = new Object();
    params['fieldName'] = tempField.attr("fname");
    params['formId'] = form.contentTemplateId;
	params['formMasterDataId'] =form.contentDataId;
	params['moduleId'] =form.moduleId;
    params['recordId'] = recordId;
	params['rightId'] =form.rightId;
    if(showType==1){
    	params['text']=tempField.text();
    }else{
        params['text']="";
    }
    top.$s.CapForm.showFormRelationRecord ({}, params, {
		repeat:false,   //当网络掉线时是否自动重新连接
        success:function(_obj){
            var result = _obj;
            if(result.success=="true"){
                result.showType = showType;
                showRelationFormRecord(result);
            }else{
				cmp.notification.toast(_obj.errorMsg,"center");
			}
            return;
        },
		error:function(e){
			var cmpHandled = parent.cmp.errorHandler(e);
			if(cmpHandled) {
			}else{
				$.alert(e.message);
			}
		}
    });

}
//表单自定义控件实现函数
function showCustomControlWindow(tempSpan){
	var tempField = $(tempSpan);
	var clickUrl = tempField.attr("clickUrl");
	var winWidth = tempField.attr("winWidth");
	var winHeight = tempField.attr("winHeight");
	var valueType = tempField.attr("valueType");
	var fieldName = tempField.attr("fname");
	window.fillField = tempSpan;
	//这里后面需要考虑回填多个单元格
	var dataValue = window.showModalDialog(clickUrl,window,'dialogWidth:'+ winWidth+'px;dialogHeight:'+winHeight+'px;center:yes;');
	if(valueType == "text"){//回填文本
		$(tempSpan).parent().find("#"+fieldName).attr("value",dataValue);
		//参与计算
		calc($(tempSpan).parent().find("#"+fieldName)[0]);
	}else if(valueType == "handwrite"){//签章 暂时不实现
	}else if(valueType == "image"){}//图片暂时不实现
}
//回填值方法
function customFillData(fillObj,dataValue){
	var fieldName = $(fillObj).attr("fname");
	$(fillObj).parent().find("#"+fieldName).attr("value",dataValue);
}
//对回填值进行一个校验,主要是要满足，日期，日期时间，数字这几种类型的单元格回填值
function customFillDataCheck(fillObj,dataValue){
	var checkPass = true;
	var fieldType = $(fillObj).attr("ftype");
	if(fieldType == "TIMESTAMP"){
		var regDate = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/;
		if(!regDate.test(dataValue)){
			checkPass = false;
		}
	}else if(fieldType == "DATETIME"){
		var regDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
		if(!regDateTime.test(dataValue)){
			checkPass = false;
		}
	}else if(fieldType == "DECIMAL"){
		var regDecimal = /^([0-9])+$/;
		if(!regDecimal.test(dataValue)){
			checkPass = false;
		}
	}
	return checkPass;
}
//全局零时选人控件变量
var currentMemberInput;
/**
 *选人、选部门等选择组织机构之前回调函数
 */
function selectOrgPreCallBack(e){
    currentMemberInput = $(e.srcElement).parent("span").find("input[id='"+e.fieldName+"']");
}


//TODO
/**
 *选人、选部门等组织机构之后回调函数，处理选择人员、选部门等组织机构之后的关联关系
 */
function selectOrgCallBack(e,options){
	//选择部门控件在弹出框中的选项会显示用括号括起来的外部单位名称，但是需求要求回填可编辑单元格的时候不显示这个括号内的外部单位名称，所以需要自己再次循环回填下
	if("Department"==options.panels&&e.obj.value!=""){
		var showText = "";
		for(var i=0;i<e.obj.length;i++){
			if(i!=e.obj.length-1){
				showText+=e.obj[i].name+"、";
			}else{
				showText+=e.obj[i].name;
			}
		}
		options.srcElement.val(showText);
	}
	if(options&&options.hasRelationField){//有其他字段关联此字段
		if(form==undefined||form==null){
	        return;
	    }
	    //查询到人员id之后调用后台manager方法获取关联人员、选部门等组织机构单元格的值
	    //这里的orgId表示人员id,部门id等组织机构id值
	    var params = new Object();
	    if(e&&e.obj&&e.obj.length>0){
	        params['orgId'] = e.obj[0].id;
	    }else{
	        params['orgId'] = 0;
	    }
	    //selectType表示组织机构类型,member人员department部门等
	    params['selectType'] = options.selectType;
	    //非主表字段需要传递recordId
	    if(!options.isMasterFiled){
	        params['recordId'] = getRecordIdByJqueryField(currentMemberInput);
	    }else{
	        params['recordId'] = '0';
	    }
	    //当前选人单元格fieldName
	    params['fieldName'] = currentMemberInput.attr("id");
	    params['rightId'] = $("#rightId").val();
	    params['formId'] = form.id;
	    params['formDataId'] = $("#contentDataId").val();
	    var tempFormManager = new formManager();
	    tempFormManager.dealOrgFieldRelation(params,{
	        success:function(_obj){
	            var returnObj = $.parseJSON(_obj);
	            if(returnObj.success == "true"||returnObj.success==true){
	            	changeAuth(returnObj.viewRight);
	                formCalcResultsBackFill(returnObj.results);
	            }else{
	                $.alert(returnObj.errorMsg);
	            }
	            return;
	        }
	    });
	    return;
	}
}

/**
 * 获取表单FormBean中对应单元格名字的FormFieldBean
 */
function getFormFieldBeanByName(formBean, fieldName) {
    var formFieldBean;
    var table;
    for ( var j = 0; j < formBean.tableList.length; j++) {
        table = formBean.tableList[j];
        for ( var i = 0; i < table.fields.length; i++) {
            if (table.fields[i].name == fieldName) {
                formFieldBean = table.fields[i];
                break;
            }
        }
        if (formFieldBean != null && formFieldBean != undefined) {
            break;
        }
    }
    return formFieldBean;
}

/**
 *获取重复表权限
 */
function getFormTableAuth(groupTableName,rightId,callback){

    getOperationById(rightId,function(operations){
        var formTableAuth = null;
        if(operations==undefined||operations==null){
            formTableAuth = null;
        }else{
            for(var k=0;k<operations.formAuthorizationTables.length;k++){
                if(groupTableName==operations.formAuthorizationTables[k].tableName){
                    formTableAuth = operations.formAuthorizationTables[k];
                    break;
                }
            }
            callback(formTableAuth);
        }
    });
}

/**
 *更加rightId查询权限
 */
function getOperationById(rightId,callback){

    if(typeof form == "undefined") return null;
    top.$s.CapForm.getOperationById({rightId:rightId},{
		repeat:true,   //当网络掉线时是否自动重新连接
        success:function(result){
            var operationVal = result.results;
			if(operationVal){
				operationVal = JSON.parse(operationVal);
			}else{
				operationVal =null;
			}
            callback(operationVal);
        },
		error:function(e){
			var cmpHandled = parent.cmp.errorHandler(e);
			if(cmpHandled) {
			}else{
				$.alert(e.message);
			}
		}
    });
}

var allowCalc = true;
function sendReq4AddOrDel(targetNode, formData,currentNode) {
    if(currentNode!=null){//复制一行和增加空行的时候避免点击过快产生线程同步问题，所以隐藏增加删除按钮
        $("#img").css("visibility","hidden");
        currentNode.css("visibility","hidden");
    }
    //进度条
    var processBar;
    //判断当前行是否有字段参与计算，如果有才使用进度条
    var tableName = formData.tableName,recordId = formData.recordId;
    var paramObj = new Object();
    paramObj.formMasterId = $("#contentDataId").val();
    paramObj.formId = $("#contentTemplateId").val();
    paramObj.type = formData.type;
    paramObj.tableName = tableName;
    paramObj.recordId = recordId;
    paramObj.rightId = formData.rightId;
    paramObj.viewType ="pcForm";
    var contentData=getFormJson();
    paramObj.data = getCurrentLineRequestContentData(contentData,tableName,recordId);
    contentData["needCheckRule"]=false;//是否校验
    contentData["notSaveDB"]=false;//是否保存到数据库
    //下面的参数预提交传false


    top.$s.CapForm.addOrDelDataSubBean({},paramObj,{
		repeat:false,   //当网络掉线时是否自动重新连接
        success:function(objs){
            setAllowCalc(true);
            var objstr = $.toJSON(objs);
            objs = objstr.replace("<pre style=\"word-wrap: break-word; white-space: pre-wrap;\">","").replace("</pre>", "").replace("<pre>", "");
            var _objs = $.parseJSON(objs);

            if (_objs.success == "true" || _objs.success == true) {
                var datas = _objs.datas;
                if(typeof datas != "undefined") {
                    for ( var i = 0; i < datas.length; i++) {
                        repeatLineFillBack(datas[i], currentNode);
                    }
                }
                formCalcResultsBackFill(_objs.results);
            } else {
                dialogMsg("提示",_objs.errorMsg,1);
            }

            //复制一行和增加空行的时候避免点击过快产生线程同步问题
            if(currentNode!=null){
                currentNode.css("visibility","visible");
                var imgDiv = $("#img");
                imgDiv.css("visibility","visible");
                var pos = getElementPos(targetNode[0]);
                pos.left = pos.left - imgDiv.width();//辛裴改OA-93178
                imgDiv.offset(pos);
            }
            renderExtendEvent();
            renderReadOnlyRelationForm();
            disableEditInput();
            if(currentNode){
                adjustRepeatWidth(currentNode);
            }
        },
		error:function(e){
			var cmpHandled = parent.cmp.errorHandler(e);
			if(cmpHandled) {
			}else{
				$.alert(e.message);
			}
		}
    });
}

function getCurrentLineRequestContentData(contentData,tableName,recodeId){
    var data = contentData.data;
    var children = data.children;
    var formson = children[tableName];
    var tablesData = formson.data;
    var currentLineData,i = 0,len = tablesData.length;
    for(;i<len;i++){
        if(tablesData[i].__id == recodeId){
            currentLineData = tablesData[i];
            break;
        }
    }
    currentLineData = convertCurrentLineRequestContentData(currentLineData);
    return currentLineData;
}

function convertCurrentLineRequestContentData(currentLineData){
    var result = {};
    for(key in currentLineData){
        if(key == "__id") continue;
        result[key] = currentLineData[key].value;
    }
    return result;
}

function repeatLineFillBack(data,currentNode){
	currentNode.find("input[type='hidden'][name='id']").val(data.recordId);
	currentNode.attr("recordid", data.recordId);
	for(var j = 0; j < data.data.length; j++) {
		var deleteField = currentNode.find("#"+ data.data[j].fieldName+"_span");
		if (deleteField.length > 0) {
			replaceField(deleteField,data.data[j].value);
		}
	}
	repeatLineFillBackM1(currentNode);
	setFormFieldWidth();

}
/**
 * 表单字段后台计算结果回填，应用情况有二：
 * 1、字段数据变化触发计算结果的回填；
 * 2、增加删除重复项或者重复节之后计算结果的回填。
 */
function formCalcResultsBackFill(_objs) {
    for (var name in _objs) {
        var fieldName, recordId;
        if(name=="datas"){
        	fillBackSubRow(_objs[name]);
        }
        var onlyValue = false;
        if(name.indexOf("v_")==0){//只用回填value "v_field0001" "v_field0002_12334556666666
        	name = name.replace("v_","");
        	onlyValue = true;
        }
    	var delFieldDom;
    	if (name.indexOf("_") != -1) {//重复表数据回填
            fieldName = name.split("_")[0];
            recordId = name.split("_")[1];
            var hiddenInput = $("input[name='id'][value='" + recordId+ "']");
            if (hiddenInput.length == 0) {//计算结果有可能不在当前视图
                continue;
            }
            var repeatTag = hiddenInput.parents("tr[recordid='" + recordId+ "']");
            //不是重复项就是重复节
            if (repeatTag.length == 0) {
                repeatTag = hiddenInput.parents("div[recordid='" + recordId+ "']");
            }
            if(onlyValue){//只回填value
            	delFieldDom = repeatTag.find("#" + fieldName);
            	if(delFieldDom.length>0){
            		delFieldDom[0].innerHTML=_objs["v_"+name];
            	}
            	continue;
            }else{
            	delFieldDom = repeatTag.find("#" + fieldName+"_span");
            }
        } else {//主表数据回填
            fieldName = name;
            if(onlyValue){//只回填value
            	delFieldDom = $("#" + fieldName);
            	if(delFieldDom.length>0){
            		delFieldDom[0].innerHTML=_objs["v_"+name];
            	}
            	continue;
            }else{
            	delFieldDom = $("#" + fieldName+"_span");
            }
        }
    	if (delFieldDom.length == 0) {//计算结果有可能不在当前视图
            continue;
        }
        replaceField(delFieldDom,_objs[name]);
    }
    setFormFieldWidth();
    return;
}
function replaceField(delField,newHtml){
	if(delField==undefined||newHtml==undefined){
        return;
    }
    var insertValue = $(newHtml);
    //继承原来表格的样式，OA-50460
    var width = $("input",delField).width();
    $("input",delField).width(width);
    insertValue.insertBefore(delField);
    delField.remove();
    var comps = insertValue.find(".comp");
    var fieldVal =insertValue.attr("fieldVal");
    if(fieldVal!=undefined){
        fieldVal = $.parseJSON(fieldVal);
    }
    if(comps.length>0&&(fieldVal!=undefined)){
    	var compParam = $.parseJSON("{"+$(comps[0]).attr("comp")+"}");
    	if(compParam.type=="fileupload"||compParam.type=="assdoc"){
    		var oldAtts = fileUploadAttachments.values().toArray();
    		for(var i=0;i<oldAtts.length;i++){
    			if(oldAtts[i].subReference==fieldVal.value){
    				fileUploadAttachments.remove(oldAtts[i].fileUrl);
    				fileUploadAttachments.remove(oldAtts[i].fileUrl+""+fieldVal.value);
    			}
    		}
    	}
    	if(fieldVal.inputType=='text'&&compParam.type=="onlyNumber"){
    		insertValue.comp();
    	}else if(fieldVal.inputType!='text'){
    		insertValue.comp();
    	}
    }
    initFieldDisplay(insertValue,false,false);
    changBackGroundColor(insertValue);
    renderFieldByParentSpan(insertValue);
}

/**
 *根据tablename查询表信息
 */
function getFormTableByName(tableName) {
    var table;
    for ( var j = 0; j < form.tableList.length; j++) {
        table = form.tableList[j];
        if (table.tableName === tableName) {
            break;
        } else {
            table = null;
        }
    }
    return table;
}

//获取千分位或者百分号显示值
function getDisplayValue(value,formatType,digNum){
    if((digNum==""||digNum==0)&&(value.indexOf(".")!=-1&&value.indexOf(".0")!=value.length-2)){
        $.alert("整数字段包含的小数位将自动四舍五入");
    }
    if(value==""){
        value = "0.0";
    }
    if(formatType=='##,###,###0'){
        var index = value.indexOf(".");
        if(index >-1){
			var zhengshu  = value.substring(0,index);
			var xiaoshu = value.substring(index);
        } else {
        	zhengshu = value;
        	xiaoshu = "";
        }
        var re=/(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
        return zhengshu.replace(re,"$1,")+xiaoshu;
    } else if(formatType=='%'){
        var hundredNum =0;
		if(value.indexOf("%")!=-1){
			hundredNum=(value.replace("%","")).toFixed(digNum-2>0?digNum-2:0);
		}else{
			hundredNum=(value.toFixed(digNum)*100).toFixed(digNum-2>0?digNum-2:0);
		}
        if(hundredNum==0){
            var zeroStr = "";
            for(var i=0;i<digNum;i++){
                zeroStr+="0";
            }
            return "0"+(zeroStr==""?"":".")+zeroStr+"%";
        }
        return hundredNum+"%";
    }
    return value;
}
/**
 *百分号keyup事件
 */
function formFieldPercentFunctionKeyUp(obj){
    var tempThis = $(obj);
    var value = tempThis.val();
    if(value.length>0 && value!="-"){
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
        }else if(numberValue!="0"&&numberValue.indexOf(".")!=1&&numberValue.indexOf("0")==0){//02323这种数字的处理
        	while(numberValue.indexOf("0")==0){
        		numberValue = numberValue.substring(1);
        	}
        	tempThis.val(numberValue);
        }
    }
    tempThis = null;
}
/**
 *百分号blur事件
 */
function formFieldPercentFunctionBlur(obj){
    var tempThis = $(obj);
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
            tempThis.val(numberValue+"%");
        }
    }
    tempThis = null;
}
/**
 *千分位keyup事件
 */
function formFieldThousandthFunctionKeyUp(obj){
	var tempThis = $(obj);
    var value = tempThis.val();
    if(value.length>0 && value!="-"){
        var numberValue = value;
        if(isNaN(numberValue) || !/^[-+]?\d+(.\d*)?$/.test(value)){
            if(!$.isANumber(numberValue)){
                numberValue = numberValue.replace(/[^\d.]+/g,"");
            }
            tempThis.val(numberValue);
        }else if(numberValue!="0"&&numberValue.indexOf(".")!=1&&numberValue.indexOf("0")==0){//02323这种数字的处理
        	while(numberValue.indexOf("0")==0){
        		numberValue = numberValue.substring(1);
        	}
        	tempThis.val(numberValue);
        }
    }
    tempThis = null;
}
/**
 *千分位blur事件
 */
function formFieldThousandthFunctionBlur(obj){
    var tempThis = $(obj);
    var value = tempThis.val();
    if(value.length>0){
        var numberValue = value;
        if(isNaN(numberValue) || !/^[-+]?\d+(.\d+)?$/.test(value)){
            if(!$.isANumber(numberValue)){
                numberValue = numberValue.replace(/[^\d.]+/g,"");
            }
            tempThis.val(numberValue);
        }
    }
    tempThis = null;
}
//给onlyNumber控件添加监听输入事件-------辛裴 20150925
function onlyNumChangeEvent(obj) {
    var tempThis = $(obj);
    var id = tempThis.attr('id');
    var parent = tempThis.parents('#'+id+'_span');
    var txtInput = tempThis.next('#'+id+'_txt');
    var fieldValObj = $.parseJSON(parent.attr("fieldval"));
    var formatType = fieldValObj.formatType;
    if(txtInput.length > 0) {
        txtInput.unbind('input').bind('input',function(){
            var value = txtInput.val();
            if(formatType == '##,###,###0') {
                if(value.length>0 && value!="-"){
                    var numberValue = value;
                    if(isNaN(numberValue) || !/^[-+]?\d+(.\d*)?$/.test(value)){
                        if(!$.isANumber(numberValue)){
                            numberValue = numberValue.replace(/[^\d.]+/g,"");
                        }
                    }else if(numberValue!="0"&&numberValue.indexOf(".")!=1&&numberValue.indexOf("0")==0){//02323这种数字的处理
                        while(numberValue.indexOf("0")==0){
                            numberValue = numberValue.substring(1);
                        }
                    }
                    tempThis.val(numberValue);
                }

            }else if(formatType == '%') {
                if(value.length>0 && value!="-"){
                    var index = value.lastIndexOf("%");
                    var numberValue = value;
                    if(index>-1){
                        numberValue = value.sub(0, index);
                    }
                    if(isNaN(numberValue) || !/^[-+]?\d+(\.\d*)?$/.test(value)){
                        if(!$.isANumber(numberValue)){
                            numberValue = numberValue.replace(/[^\d]+/g,"");
                        }
                    }else if(numberValue!="0"&&numberValue.indexOf(".")!=1&&numberValue.indexOf("0")==0){//02323这种数字的处理
                        while(numberValue.indexOf("0")==0){
                            numberValue = numberValue.substring(1);
                        }

                    }
                    tempThis.val(numberValue);
                }
            }
        });
    }

}

//一个单元格中最多只能上传一张图片
function checkImgNum(fieldObj){
    var dispDiv = fieldObj.find("div[id^='attachmentArea']");
    var dispblock = dispDiv.find(".attachment_block");
	var imgNum = dispblock.length;
	if(imgNum>0){
		$.alert("最多只能上传一张图片！");
		return false;
	}
	return true;
}
//插入图片方法
function insertImage(filedObj,fieldId){
	if(checkImgNum(filedObj)){
		insertAttachmentPoi(fieldId);
		if(filedObj.find("img").length>0){
			initFieldDisplay(filedObj,false,false);
			setFormFieldWidth();
		}
	}
}

//对外接口，返回当前表单的定义信息，如果非表单正文，则返回null
function getFormDefinition(){
    if(form!=null&&form!=undefined){
        return form;
    }else{
        return null;
    }
}


/**
 *获取流程处理意见控件数组，没有则返回null
*/
function getFlowDealOpinion(){
    var result = new Array();
    $("span[fieldval*='flowdealoption']").each(function(){
    	var fieldval = $(this).attr("fieldval");
    	fieldval = $.parseJSON(fieldval);
    	if (fieldval.inputType == 'flowdealoption' && ($(this).hasClass("add_class") || $(this).hasClass("add_class"))){
    		result.push(this);
    	}
    });
    return result;
}

/**
 *日期时间校验
 */
function validateDataTime(obj,param){
    var datetimeReg = ""
    var value = "" + obj.val();
    var validateObj = $.parseJSON("{"+obj.attr("validate")+"}");
    if(validateObj.fieldType=='TIMESTAMP'){//日期
        datetimeReg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
    }else{//日期时间
        datetimeReg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29)) (20|21|22|23|[0-1]?\d):[0-5]?\d$/;
    }
    if(validateObj.notNull&&param.checkNull){
        if(value===""){
            return false;
        }
    }else{
        if(value===""){
            return true;
        }
        if (datetimeReg.test(value) != true) {
            return false;
        }
    }
    if (datetimeReg.test(value) != true) {
        return false;
    }
    return true;
}
function validateSelect(obj,param){
    var value = "" + obj.val();
    var validateObj = $.parseJSON("{"+obj.attr("validate")+"}");
    if(validateObj.notNull&&param.checkNull){
        if(value===""||value==="0"){
            return false;
        }
    }
    return true;
}
function validateUrl(obj,param){
    var _defaultValue = "" + obj.val();
    var validateObj = $.parseJSON("{"+obj.attr("validate")+"}");
    var  Regex =/^(https|http|ftp|rtsp|mms)?:\/\/([0-9A-Za-z_-]+\.?)+(\/[0-9A-Za-z_-]+)*(\.[0-9a-zA-Z-_]*)?(:?[0-9]{1,4})?(\/[\u4E00-\u9FA50-9A-Za-z_-]+\.?[\u4E00-\u9FA50-9A-Za-z_-]+)*(\?([\u4E00-\u9FA50-9a-zA-Z-_]+=[\u4E00-\u9FA50-9a-zA-Z-_%]*(&|&amp;)?)*)?\/?$/;
	if (_defaultValue!="" && !Regex.test(_defaultValue)){
          return false;
	}
      return true;
}
/**
 *自己的clone方法
 */
function formClone(jqObj){
    var cloneObj;
    if(jqObj[0].outerHTML){
        //****ie7下jquery的clone方法复制出来的对象有问题，因为如果对复制出来的对象设置attr自定义属性的时候会将老对象的attr给修改了
        cloneObj = $(jqObj[0].outerHTML.replace(/jQuery\d+="\d+"/g,""));
    }else{
        cloneObj = jqObj.clone();
    }
    if(cloneObj[0].tagName.toLowerCase()=="input"){
        cloneObj.val(jqObj.val());
    }else{
        var temp = jqObj.find("input");
        cloneObj.find("input").each(function(i){
            $(this).val(temp.eq(i).val());
        });
        temp = null;
    }
    return cloneObj;
}

//百分号，千分位显示input离开光标之后的事件相应
function displayInputOnblur(inp,formatType,digitNum){
    var jqInp = $(inp);
    var prevInp = jqInp.prev('input');
    if($.trim(jqInp.val())!=''){
    	var v = $.trim(jqInp.val()).toFixed(digitNum);
    	prevInp.val(v);
        jqInp.val(getDisplayValue(v,formatType,digitNum));
    }else{
    	prevInp.val("");
    }
    calc(prevInp[0]);
}

//点击表单显示联动列表控件
function designLinkageList(obj){
	if(designLinkObj){
    	var beforeId = designLinkObj.id.replace("_span","");
    	var index = $("#"+beforeId+"tr",parent.document.body).attr("index");
    	var inputType = $("#inputType"+index,parent.document.body).val();
    	$("#"+beforeId+"tr td", parent.document.body).css("background-color","");
    	$("#"+id+"tr td",parent.document.body).removeClass("designClick");
    	if($("#"+beforeId).attr("type") == "radio"){
             $(designLinkObj).css("border","");
        }else if($("#"+beforeId).attr("type") == "checkbox"){
             $(designLinkObj).css("border","");
        }else{
             $("#"+beforeId).css("border-color","");
             if($("#"+beforeId).attr("disabled") || $("#"+beforeId).attr("readOnly")){
            	 $("#"+beforeId).css("border","");
             }
             if(inputType == "handwrite"){
                 $(designLinkObj).find("#signButton").css("border","");
         		 $(designLinkObj).find("#signButton").width( $(designLinkObj).find("#signButton").width() +2);
         	}
        }
	} else {
	  $(".designClick",parent.document.body).each(function(){
      $(this).css("background-color","");
    });
	}
    var id = obj.id.replace("_span","");
    var index = $("#"+id+"tr",parent.document.body).attr("index");
	var inputType = $("#inputType"+index,parent.document.body).val();
	if(inputType){
        $("#"+id+"tr td",parent.document.body).css("background-color","#ccc");
        $("#"+id+"tr td",parent.document.body).addClass("designClick");
        if($("#"+id).attr("type") == "radio"){
            $(obj).css("border","1px solid red");
        }else if($("#"+id).attr("type") == "checkbox"){
        	$(obj).css("border","1px solid red");
        }else{
        	if(inputType == "handwrite"){
        		$(obj).find("#signButton").width( $(obj).find("#signButton").width() -2);
        		$(obj).find("#signButton").css("border","1px solid red");
        	}else{
            	$("#"+id).css("border","1px solid red");
        	}
        }
        try{
        	parent.document.getElementById("inputType"+index).focus();
        }catch(e){
        	parent.document.getElementById("linkInput"+index).focus();
        }
	}
    var url = $("#url",parent.document);
    if(url!=null && url.val() == ""){
        url.val(parent.window.location.href);
    }
    if(url.val()){
        parent.window.location.href=url.val()+"#"+id;
    }
    designLinkObj = obj;
    parent.designLinkId = id;
}

    /**ajax更新表单缓存数据状态，用于协同处理节点点击提交按钮时，在保存正文和入库数据前
     * 如果审核，核定为流程最后一个节点，且都是通过状态，则需要调用两次本方法
     * 第一次type参数为审核或者核定，第二次为flow
     * @param type 更新状态分类，审核：audit；核定：vouch；流程结束：flow
     * @param state 需要更新到的状态，审核：3-不过，2-过；核定：2-不过，1-过；流程：0-未结束，1-已结束，3-终止
     */
  function updateDataState(type,state){
    var tempFormManager = new formManager();
    tempFormManager.updateDataState(form.id,$("#contentDataId").val(),type,state);
  }

//获取当前页面里具有的所有字段
function getFields(){
	var fields = new Array();
	var fieldSpans = $("span[id^='field']");
	for(var i=0;i<fieldSpans.length;i++){
		var field = $(fieldSpans[i]).attr("fieldVal");
		if(field!=null && typeof(field)!= 'undefined'){
			fieldJson = $.parseJSON(field);
			fields.push(fieldJson);
		}
	}
return fields;
}
/**
 * 获取表单盖章保护数据
 */
function getFieldVals4hw(protectVal){
	var retVal = new Properties();
	var fields = new Array();
	var browseFields = $("."+browseClass);
	for(var i=0;i<browseFields.length;i++){
		fields.push(browseFields[i]);
	}
	var addFields = $("."+addClass);
	for(var i=0;i<addFields.length;i++){
		fields.push(addFields[i]);
	}
	var editFields = $("."+editClass);
	for(var i=0;i<editFields.length;i++){
		fields.push(editFields[i]);
	}
	var field;
	for(var i=0;i<fields.length;i++){
		field = $(fields[i]);
		var fieldVal = field.attr("fieldVal");
		var editTag=field.hasClass(editClass);
		var browseTag=field.hasClass(browseClass);
		var addTag = field.hasClass(addClass);
		if(fieldVal!=null && typeof(fieldVal)!= 'undefined'){
			fieldVal = $.parseJSON(fieldVal);
		}else{
			continue;
		}
		var obj = new Object();
		obj.displayName = fieldVal.displayName;
		obj.name = fieldVal.name;
		var tag = true;
		switch(fieldVal.inputType){
			case "text":
			case "textarea":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}else if(browseTag){
					obj.value = fieldVal.value;
				}else if(addTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}
				break;
			case "checkbox":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}else if(browseTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}
				break;
			case "radio":
				if(editTag){
					obj.value = field.find(":radio:checked").attr("val4cal");
				}else if(browseTag){
					obj.value = field.find(":radio:checked").attr("val4cal");
				}
				break;
			case "select":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name + " option:selected").attr("val4cal");
				}else if(browseTag){
					obj.value = field.find("#"+fieldVal.name).attr("val4cal");
				}
				break;
			case "date":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name).val();
					if(obj.value!=""){
						obj.value = obj.value + " 00:00";
					}
				}else if(browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "datetime":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}else if(browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "flowdealoption":
				if(editTag){
					obj.value = fieldVal.value;
				}else if(browseTag){
					obj.value = fieldVal.value;
				}else if(addTag){
					obj.value = fieldVal.value;
				}
				break;
			case "lable":
				if(editTag){
					obj.value = fieldVal.value;
				}else if(browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "relationform":
				if(editTag){
					obj.value = fieldVal.value;
				}else if(browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "relation":
				if(editTag||browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "project":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name).val();
				}else if(browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "member":
			case "multimember":
			case "account":
			case "multiaccount":
			case "department":
			case "multidepartment":
			case "post":
			case "multipost":
			case "level":
			case "multilevel":
				if(editTag){
					obj.value = field.find("#"+fieldVal.name+"_txt").val();
				}else if(browseTag){
					obj.value = field.find("#"+fieldVal.name).text();
				}
				break;
			case "attachment":
			case "image":
			case "document":
				if(editTag||browseTag){
					var attNames = "";
					var atts = getAttBySubreference(field.find("#"+fieldVal.name).val());
					for(var j=0;j<atts.length;j++){
						attNames+=atts[j].filename+",";
					}
					if(attNames!=""){
						attNames = attNames.substr(0,attNames.length-1);
					}
					obj.value = attNames;
				}
				break;
			case "outwrite":
				if(editTag||browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "externalwrite-ahead":
				if(editTag||browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "exchangetask":
				if(editTag||browseTag){
					obj.value = fieldVal.value;
				}
				break;
			case "querytask":
				if(editTag||browseTag){
					obj.value = fieldVal.value;
				}
				break;
			default:
				tag = false;
		}
		if(obj.value!=undefined){
			obj.value = obj.value.replace("\r\n",";");
			obj.value = obj.value.replace("\n",";");
			obj.value = obj.value.replace("\u000a",";");
		}
		if(tag){
			if(field.parents("table[id^='formson']").length>0||field.parents("div[id^='formson']").length>0){
				if(retVal.get(obj.name)==null){
					retVal.put(obj.name,new Array());
				}
				retVal.get(obj.name).push(obj);
			}else{
				obj.isMaster = true;
				retVal.put(obj.name,obj);
			}
		}
		
		
	}
	
	var keys = retVal.keys().toArray();
	var v = new Object();
	v.displayStr = "";
	v.valueStr = {};
	var protectData =  $("#protectData",top.document);
	for(var i=0;i<keys.length;i++){
		var key = keys[i];
		var o = retVal.get(key);
		var tempStr ="";
		if(o.value){
		    tempStr=o.value;
		}
		if(o.isMaster!=undefined&&o.isMaster==true){
			//v.valueStr.put("my:"+o.displayName,o.value);
		}else{
			
			for(var j=0;j<o.length;j++){
				tempStr+=o[j].value+";";
			}
			if(tempStr!=""){
				tempStr = tempStr.substr(0,tempStr.length-1);
			}
			//v.valueStr.put("my:"+o[0].displayName,tempStr);
			//v.displayStr+="my:"+o[0].displayName+"="+"my:"+o[0].displayName+";";
		}
	
		//TODO   M1适配PC签章保护域的问题  不可覆盖   hejianliang 
		var displayName="";
		if(o.displayName){
			displayName=o.displayName;
		}else{
			displayName=o[0].displayName;
		}
			protectData.append($("<span id = 'my:"+displayName+"' style='display: none' ></span>").text(tempStr));
		
	}
	
	return v;
}
function getAttBySubreference(subRefreence){
	var atts = fileUploadAttachments.values().toArray();
	var retVal = new Array();
	for(var i=0;i<atts.length;i++){
		var att = atts[i];
		if(att.subReference === subRefreence){
			retVal.push(att);
		}
	}
	return retVal;
}

/**
 * 在线编辑office文档之后关闭编辑窗口的回调函数
 * @param id
 * @param fileUrl
 * @param createDate
 * @param fileSize
 */
function updateAttachmentInfo(id,fileUrl,createDate,fileSize){
	var atts = fileUploadAttachments.values().toArray()
	for(var i=0;i<atts.length;i++){
		var att = atts[i];
		if(att.id===id){
			var fieldAtt = document.getElementById("attachmentDiv_"+att.fileUrl2);
			att.createDate = createDate;
			if(fileSize){
				att.size=fileSize;
			}
			att.fileUrl = fileUrl;
			fieldAtt.innerHTML = att.toString(true,true,true,null);
			break;
		}
	}
}
/**
 * 更新后缀名，主要是为了兼容office版本
 * @param filename
 * @returns {String}
 */
function renameToOffice2003(filename){
    var retname = "";
	if(filename!=""){
		var suffix = filename.split(".");
		if(suffix!=null && suffix.length==2){
			if("docx" == suffix[1] || "DOCX" == suffix[1]){
				retname = suffix[0]+".doc";
			}else if("xlsx" == suffix[1] || "XLSX" == suffix[1]){
				retname = suffix[0]+".xls";
			}else if("pptx" == suffix[1] || "PPTX" == suffix[1]){
				retname = suffix[0]+".ppt";
			}else{
				retname=filename;
			}
		}else{
			retname = filename;
		}
	}else{
		retname = filename;
	}
	return retname ;
}
/**
 * 盖章保护表单数据之后调用使表单单元格不可用
 */
function unbindOrgBtn(){
	$("."+editClass).each(function(){
	var fieldVal =$(this).attr("fieldVal");
    if(fieldVal!=undefined){
        fieldVal = $.parseJSON(fieldVal);
        switch(fieldVal.inputType){
			case "text":
				$(this).find("input").attr("disabled", true);
				break;
			case "textarea":
				$(this).find("textarea").attr("disabled", true);
				break;
			case "checkbox":
				$(this).find("input").attr("disabled", true);
				break;
			case "radio":
				$(this).find("input").attr("disabled", true);
				break;
			case "select":
				$(this).find("input").attr("disabled", true);
				break;
			case "date":
			case "datetime":
				$(this).find("input").attr("disabled", true);
				$(this).find(".calendar_icon")[0].onclick = null;
				break;
			case "flowdealoption":
				break;
			case "lable":
				break;
			case "relationform":
				break;
			case "relation":
				break;
			case "project":
				$(this).find(".ico16").unbind("click");
				$(this).find("input").attr("disabled", true);
				break;
			case "member":
			case "multimember":
			case "account":
			case "multiaccount":
			case "department":
			case "multidepartment":
			case "post":
			case "multipost":
			case "level":
			case "multilevel":
				$(this).find(".ico16").unbind("click");
				break;
			case "attachment":
			case "image":
			case "document":
				$(this).find(".ico16").unbind("click");
				$(this).find(".ico16").each(function(){
					this.onclick = null;
				})
				break;
			case "outwrite":
				break;
			case "externalwrite-ahead":
				break;
			case "exchangetask":
				break;
			case "querytask":
				break;
        }
    }
});
$(".correlation_form_16").each(function(){
	this.onclick = null;
});
}
/**
 * 地图标注回调方法，用于地图标注关联
 * @param retv
 * @param params
 */
function mapPointCallBack(options){
    var params = new Object();
    params['lbsId'] = options.lbsId;
    if(!options.isMasterField){
        params['recordId'] =options.recordId;
    }else{
        params['recordId'] = '0';
    }
    params['fieldName'] = options.filedId;
    params['rightId'] = $("#rightId").val();
    params['formId'] = form.id;
    params['formDataId'] = $("#contentDataId").val();
    var tempFormManager = new mFormAjaxManager();

    tempFormManager.dealLbsFieldRelation(params,{
        success:function(_obj){
            var returnObj = _obj;
            if(returnObj.success == "true"||returnObj.success==true){
            	changeAuth(returnObj.viewRight);
            	formCalcResultsBackFill(returnObj.results);
            }else{
                $.alert(returnObj.errorMsg);
            }
            return;
        }
    });
    return;
}
/**
 * 地图标注控件值变化之后的回调函数
 */
function mapPointValueChangeCallBack(mapHiddenInput){
	var jqField = mapHiddenInput.parent("span");
	if(jqField.hasClass("editableSpan")){
		if(mapHiddenInput.val()==""){
			jqField.find("input").css("background-color",nullColor);
		}else{
			jqField.find("input").css("background-color",notNullColor);
		}
	}
}
/**
 * 附件,图片控件值变化之后的回调函数
 */
function fileValueChangeCallBack(fileHiddenInput){
	setBGColor(_mainBodyDiv);
}
/**
 * 关联文档控件值变化之后的回调函数
 */
function assdocValueChangeCallBack(assdocHiddenInput){
	setBGColor(_mainBodyDiv);
}
/**
 * 附件,图片控件值删除之后的回调函数
 */
function fileDelCallBack(){
	setBGColor(_mainBodyDiv);
}
/**
 * 关联文档控件值删除之后的回调函数
 */
function assdocDelCallBack(){
	setBGColor(_mainBodyDiv);
}
/**
 * 四舍五入
 */
String.prototype.toFixed = function(scale){
    var s = this + "";
    if (!scale) scale = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(scale + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s))
    {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == scale + 2)
        {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4)
            {
                for (var i = a.length - 2; i >= 0; i--)
                {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10)
                    {
                        a[i] = 0;
                        b = i != 1;
                    }
                    else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");
        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
}
/**
 * 表单检查是否安装了签章控件，如果当前表单中有签章控件，并且没有安装office控件，则弹出提示，并执行回调函数
 * @param failedCallBack 回调函数，在检查到表单中有签章字段并且当前客户端没有安装office控件的时候各应用所需做的一些步骤，比如禁用提交按钮。
 */
function checkInstallHw(failedCallBack){
	var fields = $("input[comp*='htmlSignature']");
	if($.browser.msie&&fields.length>0){//当前表单样式中有签章控件
		try{
			new ActiveXObject("DBstep.WebSignature");
		}catch(e){
			$.alert("没有安装office控件，请在登陆页面进行安装。");//提示
			if((failedCallBack!=undefined) && (typeof failedCallBack == 'function')){
				failedCallBack();//执行回调
			}
		}
	}
}
function isIe7(){
	if(document.all){
		var browser=navigator.appName;
		var b_version=navigator.appVersion;
		var version=b_version.split(";");
		var trim_Version=version[1].replace(/[ ]/g,"");
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){
			return true;
		}else{
			return false;
		}
	}
	return false;
}

function changeTableLayout4ie7(tableLayout){
	if(isIe7()){
		$("table.xdRepeatingTable").each(function(){
			$(this).css("table-layout",tableLayout);
		});
	}
}

/**
 * 判断重复表中是否有重复的数据（除了行序号之外）
 * @param jqObj 重复表所在区域的juery对象
 * @returns {Boolean}
 */
function isLegalDataOfRepeatingTable(jqObj){
	var _result = false;
	//一个单子中多个重复表，分别处理每个重复表
	jqObj.find("div[id^='formmain_']").find("table[id^='formson_']").each(function(){
		var _tr = $(this).find("tbody tr[recordid]");
		//每个重复表中所有数据的集合
	    var dataArray = new Array();
	    if(_tr.size() > 0){
	    	//循环每行对象
	    	_tr.each(function(){
	    		var trArray = new Array();
	    		//循环行中没列对象
	    		$(this).find("td").each(function(){
	    			//循环列中元素，例如日期控件有可能在同一列中有2个元素
	    			$(this).find("span[fieldVal]").each(function(){
	    				var _fieldValObj = $(this).attr("fieldVal");
	            		var dataObj = eval("(" + _fieldValObj + ")");
	            		//行序号、签章、图片不判断
	            		if(dataObj.inputType == "linenumber" || dataObj.inputType == "handwrite"
	            			|| dataObj.inputType == "image"){
	            			return true;
	            		}
	            		var fieldName = dataObj.name;
	            		var _fieldObj = $(this).find("#" + fieldName);
	            		var _val = "";
	            		//判断是不是span标签，如果是span时，更换取值方式
	            		if(_fieldObj.is('span')){
	            			_val = _fieldObj.html();
	            		}else if(_fieldObj.is('select')){
	            			_val = _fieldObj.find("option:selected").val();
	            		}else{
	            			_val = _fieldObj.val();
	            		}
	            		var _id = _val;
	            		//判断附件时，用名称判断
	            		if(dataObj.inputType == "attachment"){
	            			_val = $("#attachmentArea" + _id).find("div[class*='attachment_operate']").find("table[title]").attr("title");
	            			if($.trim(_val) == ""){
	            				_val = $("#attachmentArea" + _id).find("a").attr("title");
	            			}
	            		}else if(dataObj.inputType == "document"){
	            			//关联文档
	            			_val = $("#attachment2Area" + _id).find("div[class*='attachment_block']").find("a").attr("title");
	            		}
	            		trArray.push(_val);
	    			});
	    		});
	    		dataArray.push(trArray);
	    	});
	    }
	    //默认重复表中不包含重复数据
	    var isRepeatData = false;
	    if(dataArray.length > 0){
	    	for(var i = 0;i < dataArray.length;i++){
	    		var _dataObj = dataArray[i];
	    		if(checkRepeatData(_dataObj,dataArray,i)){
	    			isRepeatData = true;
	    			break;
	    		}
	    	}
	    }
	    if(isRepeatData){
	    	_result = true;
	    	return false;
	    }
	});
    return _result;
}
/**
 * 判断重复表中只有一行时，该行是否为空（除了行序号之外）
 * @param jqObj 重复表juery对象
 * @returns {Boolean}
 */
function isRepeatTbFirstTrNull(jqObj){
	var _tr = jqObj.find("tbody tr[recordid]");
	//重复表中所有数据的集合
	var dataArray = new Array();
	if(_tr.size() == 2){
		//循环每行对象
	    _tr.each(function(){
	    	var trArray = new Array();
	    	//循环行中没列对象
	    	$(this).find("td").each(function(){
	    		//循环列中元素，例如日期控件有可能在同一列中有2个元素
	    		$(this).find("span[fieldVal]").each(function(){
	    			var _fieldValObj = $(this).attr("fieldVal");
	            	var dataObj = eval("(" + _fieldValObj + ")");
	            	if(dataObj.inputType == "linenumber" || dataObj.inputType == "handwrite"
            			|| dataObj.inputType == "image"){
	            		return true;
	            	}
	            	var fieldName = dataObj.name;
	            	var _fieldObj = $(this).find("#" + fieldName);
	            	var _val = "";
	            	//判断是不是span标签，如果是span时，更换取值方式
	            	if(_fieldObj.is('span')){
	            		_val = _fieldObj.html();
	            	}else if(_fieldObj.is('select')){
	            		_val = _fieldObj.find("option:selected").val();
	            	}else{
	            		_val = _fieldObj.val();
	            	}
	            	var _id = _val;
            		//判断附件时，用名称判断
            		if(dataObj.inputType == "attachment"){
            			_val = $("#attachmentArea" + _id).find("div[class*='attachment_operate']").find("table[title]").attr("title");
            			if($.trim(_val) == ""){
            				_val = $("#attachmentArea" + _id).find("a").attr("title");
            			}
            		}else if(dataObj.inputType == "document"){
            			//关联文档
            			_val = $("#attachment2Area" + _id).find("div[class*='attachment_block']").find("a").attr("title");
            		}
	            	trArray.push(_val);
	    		});
	    	});
	    	dataArray.push(trArray);
	    });
	 }
	 //默认重复表中不包含重复数据
	 var isRepeatData = false;
	 if(dataArray.length > 0){
		 for(var i = 0;i < dataArray.length;i++){
	    	var _dataObj = dataArray[i];
	    	if(checkRepeatData(_dataObj,dataArray,i)){
	    		isRepeatData = true;
	    		break;
	    	}
	    }
	 }
    return isRepeatData;
}
/**
 * 判断一行数据列是否在集合数据中存在相同的一行
 * @param _data 一行数据的列的集合
 * @param _dataArray 多行数据集合
 * @param _index _data在_dataArray中的位置
 * @returns {Boolean}
 */
function checkRepeatData(_data,_dataArray,_index){
	var _result = false;
	for(var i = 0; i < _dataArray.length; i++){
		if(i != _index){
			var dataObj = _dataArray[i];
			var isSame = true;
			for(var j = 0; j < dataObj.length; j++){
				if(dataObj[j] != _data[j]){
					isSame = false;
					break;
				}
			}
			if(isSame){
				_result = true;
				break;
			}
		}
	}
	return _result;
}
function setBGColor(_mainBodyDiv){
	_mainBodyDiv.find("div[id^='attachmentArea'],div[id^='attachment2Area']").each(function(){
	var jqField = $(this).parent("span");
	if(jqField.hasClass("editableSpan")){
		if($(this).children().length>0){
			$(this).css("background-color",notNullColor);
		}else{
			$(this).css("background-color",nullColor);
		}
	}
	});
}
//设置lbs类控件的背景色
function setBGColor_LBS(lbsType,jqFiled){
    var input = jqFiled.find("input[id^=field]");
    var validate = input.attr("validate");
    var fieldVal = $.parseJSON(jqFiled.attr("fieldVal"));
    var notNull = false;
    if(validate) {
        validate = $.parseJSON("{"+validate+"}");
        notNull = validate.notNull;
    }
    switch (lbsType) {
        case "mapmarked":
        case "maplocate":
            if(notNull){
                input.unbind("change").bind("change",function(e){
                    if($(this).val() == ""){
                        $(this).css("background-color",nullColor);
                    }else {
                        $(this).css("background-color",notNullColor);
                    }
                });
                input.trigger("change");
            }
            break;
        case "mapphoto":
            if(notNull){
                input.unbind("change").bind("change",function(e){
                    if($(this).val() == ""){
                        jqFiled.parents("td").css("background-color",nullColor);
                    }else {
                        jqFiled.parents("td").css("background-color",notNullColor);
                    }
                });
                input.trigger("change");

                var defaultValue = fieldVal.value;
                if(defaultValue && defaultValue != "") {
                    jqFiled.parents("td").css("background-color",notNullColor);
                }else {
                    jqFiled.parents("td").css("background-color",nullColor);
                }
            }
            break;

    }
}

/**
 * 重复表导入导出
 */
function setTableOperation() {
    //advanceAuthType不为空即说明是有流程表单
	var isFlowForm = (typeof(advanceAuthType) != "undefined" && advanceAuthType);
    $("table.xdRepeatingTable").each(function() {
        var path = "";
        var currentTable = $(this);
        var trs = currentTable.children().children("tr");
        for (var i = 0; i < trs.length; i++) {
            path = $(trs[i]).attr("path");
            if (path != undefined && path != "") {
                break;
            }
        }
        if (path == undefined || path == "") {
            return;
        }
        if (path.indexOf("/") != -1) {
            path = path.split("/")[1];
        }
        //先删除以前的
        $(this).next("#importimg").remove();
        getFormTableAuth(path, $("#rightId").val(),function(tableOperation){
            var showImportTag = isFlowForm;
            if (tableOperation == undefined || !tableOperation.allowAdd || !tableOperation.allowImport) { //允许添加，没有分开设置条件
                showImportTag = false;
            }
            var tableName = currentTable.attr("id");
            var tableBean = getFormTableByName(tableName);
            if(showImportTag||tableBean.isCollectTable){
                //校验结束，到这里说明需要添加导入导出
                var importDiv = $("<DIV style=\"position:relative;width:0;height:0\" id=\"importimg\" name=\"importimg\"></DIV>");
                //为防止计算等产生脏数据，重复表间关系不支持
                //if(tableBean.isCollectTable){
                //    var createDataDiv = $("<DIV id=\"createDataDiv\" style=\"position:absolute;\"><img id=\"createDataImg\" src=\"./ic_form_refresh.png\" /></DIV>");
                //    importDiv.append(createDataDiv);
                //    var pos = getElementPos(this);
                //    pos.left = pos.left + currentTable.width();
                //    pos.top = pos.top + currentTable.height() - 32;
                //    if(!showImportTag){
                //        currentTable.after(importDiv);
                //    }
                //    importDiv.offset(pos);
                //    createDataDiv[0].title = $.i18n("form.base.generate.label");//生成汇总
                //    createDataDiv.bind("click", {
                //        table: tableName
                //    },generateSubTableVal );
                //}
            }
        });
    });
}
function generateSubTableVal(e){
	var tableName = e.data.table;
	//提交表单主表数据和重表数据到系统后台进行计算。
    var url = _ctxPath + '/form/formData.do?method=generageSubData&formMasterId=' + $("#contentDataId",_mainBodyDiv).val() + '&formId=' + $("#contentTemplateId",_mainBodyDiv).val() + "&tableName=" + tableName + "&rightId="+$("#rightId",_mainBodyDiv).val() + "&moduleId="+$("#moduleId",_mainBodyDiv).eq(0).val()+"&tag=" + (new Date()).getTime();
    var formData = [];
	if(form == undefined){//OA-86279 批量修改带格式的数字提示报错
		return false;
	}
    for ( var i = 0; i < form.tableList.length; i++) {
        var tName = form.tableList[i].tableName;
        if(tName==tableName){//当前重复表因为要重新生成，所以不提交当前重复表值
        	continue;
        }
        var tempTable = $("#" + tName);
        if (tempTable.length > 0) {
            formData.push(tName);
        }
    }
	var tempFormManager = new mFormAjaxManager();
	var params={};
	params.formMasterId =  $("#contentDataId").val();
	params.formId =  $("#contentTemplateId").val();
	params.tableName =  tableName;
	params.rightId = $("#rightId").val();
	params.moduleId = $("#moduleId").val();
    tempFormManager.generageSubData(params,{
        success:function(obj){
            var objs = obj;
            if(objs.success=="true"||objs.success==true){
            	var first;
            	$("tr[recordid]",$("#"+tableName)).each(function(i){
            		if(i!=0){
            			$(this).remove();
            		}else{
            			first = $(this);
            		}
            	});
                changeAuth(objs.viewRight);
                objs = objs.results;
                formCalcResultsBackFill(objs);
                first.remove();
                rebuildLineNumber();
                //resizeContentIframeHeightForform();
            }else{
                $.alert(_objs.errorMsg);
            }
			 calculating = false;
           // changeTableLayout4ie7("auto");
		//	setBGColor(_mainBodyDiv);
			setTableOperation();//重复表导入导出
			
			
        }
    });
	
    calculating = false;
}

/**
 * 重新计算重复表中的行序号
 */
function rebuildLineNumber(){
	var subTables = $(".xdRepeatingTable",_mainBodyDiv);
    subTables.each(function(){
    	var currentSubTable = $(this);
    	if($("span[fieldval*='linenumber']",currentSubTable)){//有重复表行
    		$("tr[recordid]",currentSubTable).each(function(i){
    			$("span[fieldval*='linenumber'] > span",$(this)).each(function(){
    				$(this).text(i+1);
    			})
    		})
    	}
    });
    var subDivs = $("div[id^='formson_']");
    subDivs.each(function(){
    	var currentSubDiv = $(this);
    	if($("span[fieldval*='linenumber']",currentSubDiv)){//有重复表行
    		$("div[recordid]",currentSubDiv).each(function(i){
    			$("span[fieldval*='linenumber'] > span",$(this)).each(function(){
    				$(this).text(i+1);
    			})
    		})
    	}
    })
}

/**
 * 后台权限变化之后回填页面
 * @param viewRight
 */
function changeAuth(viewRight){
	var rightIdField = $("#rightId",_mainBodyDiv);
	if(viewRight!=null&&viewRight!=undefined&&rightIdField.val()!=viewRight){
		rightIdField.val(viewRight);
    	$("#img").removeClass("hidden").addClass("hidden");
    }
}

/**
 * 为生成二维码拼装参数
 * @param obj
 * @returns {{barOption: *}}
 */
function preToBarcode(input,options,callback){
//    var barCodeManager = new mFormAjaxManager();
    var preSubmitParam = getCommandStr(C_iInvokeNativeCtrlCommand_NeedPreSubmit, true);
    requestClientWithParameter(preSubmitParam);
    var formId = $("#contentTemplateId").val();
    var fieldName = $(input).attr("id");
    var dataId = $("#contentDataId").val();
    var rightId = $("#rightId").val();
    var moduleId = $("#moduleId").val();
    var contentType = $("#contentType").val();
    var viewState = $("#viewState").val();
    var recordId = getRecordIdByJqueryField(input);
    var paramObj = {
        formId:formId,
        fieldName:fieldName,
        dataId:dataId,
        rightId:rightId,
        recordId:recordId,
        moduleId:moduleId,
        contentType:contentType,
        viewState:"2"
    };
    setTimeout(function(){
		top.$s.CapForm.generateBarCode({},paramObj,{
			repeat:false,   //当网络掉线时是否自动重新连接
            success:function(result){
                //var barOption,customOption;
                //if (result && result.paramMap) {
                //    var optsParam = {
                //        category:options.category,
                //        type:options.type
                //    }
                //    barOption = $.extend( result.paramMap,optsParam);
                //}
                //if (result && result.customMap) {
                //    customOption = result.customMap;
                //}
                //var getBarCodeAttachmentParam = {
                //    barOption:barOption,
                //    customOption:customOption
                //};
                //barCodeManager.getBarCodeAttachment(getBarCodeAttachmentParam,{
                //    success:function(data){
                //        if (!data.success) {
                //            var errorObj =new MFormError(data.errorMsg, 100);
                //            var a = new Array();
                //            a.push(errorObj);
                //            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
                //            requestClientWithParameter(commandStr);
                //            return;
                //        }
                //        var att = data.attachment;
                //        if (options.callback) {
                //            options.callback(att);
                //        }
                //        callback(att);
                //    }
                //});
				if (!result.success) {
					cmp.notification.toast(result.msg,"center");
                    callback(null);
					return;
				}
				var att = result.attr;
				att.attID=att.fileUrl;
				if (options.callback) {
					options.callback(att);
				}
				callback(att);
            },
			error:function(e){
				var cmpHandled = parent.cmp.errorHandler(e);
				if(cmpHandled) {
				}else{
					$.alert(e.message);
				}
			}
        });
    },500);

}
var iosFocusField;//记录获取焦点的输入域（主要适配于ios的扫一扫按钮时焦点消失的情况）
$(document).ready(function(){
    recodeFocusField4IOS();
});

function newBarcodeBack(){
}
/**
 * 扫描结果进行回填
 * @param result
 */
function barCodeFillBack(result){  //不通过后台来判断是否是系统产生的二维码,因为后台校验的方式和这里写的差不多----xinpei
//    var focusField = $(":focus") || iosFocusField;
    var focusField = iosFocusField;
    var a = new Array();
    var errorObj;
    if(typeof result == "object") {
        var codeStr = $.toJSON(result);
        if(result.hasOwnProperty("codeType") && result.hasOwnProperty("content")) { //暂时以这两个属性值判断是否是本系统产生的二维码
            var codeType = result.codeType,content = result.content;
            switch (codeType.toLocaleLowerCase()){
                case C_sScanCodeType_form:  //如果codeType是表单,暂时是这样,估计以后要扩展
                    if(content.indexOf("moduleId") > -1){ //如果是url二维码
                        if(!focusField){
                            errorObj =new MFormError("该二维码数据是url格式不支持扫描输入,请定位到对应的输入框进行输入！", 100);
                            a.push(errorObj);
                            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
                            requestClientWithParameter(commandStr);
                        }else{
                            fillInputField(focusField,codeStr);
                        }

                    }else { //如果是文本二维码
                        var barCodeManager = new mFormAjaxManager();
                        var preSubmitParam = getCommandStr(C_iInvokeNativeCtrlCommand_NeedPreSubmit, true);
                        requestClientWithParameter(preSubmitParam);
                        var formId = $("#contentTemplateId").val();
                        var dataId = $("#contentDataId").val();
                        var rightId = $("#rightId").val();
                        var recordId = (focusField) ?getRecordIdByJqueryField(focusField):0;
                        var tableName = "";
                        if(recordId != 0) {
                            var table = focusField.parents("table[id^='formson']");
                            if(table.length<=0){
                                table = focusField.parents("div[id^='formson']");
                            }
                            tableName = table.attr("id");
                        }
                        var barCodeOptions = {
                            formId:formId,
                            dataId:dataId,
                            rightId:rightId,
                            recordId:recordId,
                            tableName:tableName
                        };
                        setTimeout(function(){
                            barCodeManager.decodeBarCode({
                                codeType:"form",   //tood pc端暂时写死是form
                                codeStr:codeStr,
                                barCodeOptions:barCodeOptions
                            },{
                                success:function(objs){
                                    if(objs.success=="true"||objs.success==true){
                                        var data = objs.results;
                                        var tips = objs.tips;
                                        formCalcResultsBackFill(data);
                                        if(tips){  //todo 增加有tips属性的情况（组织机构中如果有部门或者人员重名，则会有此tips）
                                            errorObj =new MFormError(tips, 100);
                                            a.push(errorObj);
                                            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
                                            requestClientWithParameter(commandStr);
                                        }
                                    }else{
                                        var msg = objs.msg?objs.msg:"解析二维码数据错误";
                                        errorObj =new MFormError(msg, 100);
                                        a.push(errorObj);
                                        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
                                        requestClientWithParameter(commandStr);
                                    }
                                }
                            });
                        },500);
                    }
                    break;
                default :
                    break;
            }
        }else {  //是其他系统的数据
            if(!focusField){
                errorObj =new MFormError("其他系统的二维码数据，请定位到对应的输入框进行输入", 100);
                a.push(errorObj);
                var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
                requestClientWithParameter(commandStr);
            } else {
                fillInputField(focusField,codeStr);
            }

        }
    }else if(Object.prototype.toString.call(result) === "[object String]" || typeof result == "number"){
        if(!focusField){
            errorObj =new MFormError("其他系统的二维码数据，请定位到对应的输入框进行输入", 100);
            a.push(errorObj);
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ErrorMsg, a);
            requestClientWithParameter(commandStr);
        }else {
            fillInputField(focusField,result);
        }
    }
    function fillInputField(field,result){
        var fieldType = field.prop("tagName").toLocaleLowerCase();
        var validate = field.attr("validate");
        var maxLength =  -1 ;
        if(validate){
            validate = $.parseJSON("{"+validate+"}");
            maxLength = parseInt(validate.maxLength);
        }
        if(maxLength != -1){
            result = subStr4Filed(result,maxLength);
        }
        if(!handleOnlyNum(field,result)){
            if(fieldType == "textarea") {
                field.text(result);
            }else if(fieldType == "input"){
                field.val(result);
            }
        }
    }
    function handleOnlyNum(field,value){
        var id = field.attr("id");
        var fieldSpan = field.parent("span[id$=_span]");
        var inputId = fieldSpan.attr("id").replace("_span","");
        var input = fieldSpan.find("#" + inputId);
        var comp = input.attr("comp");
        var onlyNumHandle = false;
        if(comp){
            var compObj = $.parseJSON("{"+comp+"}");
            var type = compObj.type;
            if(type == "onlyNumber"){
                if(isNaN(value)){
                    value = parseFloat(value);
                    if(isNaN(value)) value = 0;
                }
                if(id.indexOf("_txt") != -1){
                    input.attr("oldval",value);
                    input.val(value);
                    field.val(value);
                    field.focus();
                }else {
                    field.val(value);
                }
                onlyNumHandle = true;
            }
        }
        return onlyNumHandle;
    }
}
//记录获取焦点的输入域（用于二维码扫描内容进相应的焦点输入域，ios点击扫描按钮后，焦点会丢失）
function recodeFocusField4IOS(){
//    if(clientType == C_sClientType_Iphone || clientType == C_sClientType_Ipad){
        $("body").unbind("click").bind("click",function(e){
            var filed = $(e.srcElement);
			if(filed.length == 0){
			return;
			}
            var nodeType = filed.prop("tagName").toLocaleLowerCase();
            if(filed.hasClass("comp")){
                var compObj = $.parseJSON("{"+filed.attr("comp")+"}");
                if(compObj.type != "onlyNumber"){
                    iosFocusField = null;
                }else {
                    iosFocusField = $(filed);
                }

            }else {
                if(nodeType == "input" || nodeType == "textarea"){
                    iosFocusField = $(filed);
                }else {
                    iosFocusField = null;
                }
            }

        });
//    }
}

/*适配日期组件的显示格式*/
function valueDateInputOnclose(valueInput){
    //TODO 适配pc端自定义日期显示格式(估计430后做)
    getFormatDate(valueInput);
}
function valueDateInputOnblur(){
    //TODO 适配pc端自定义日期显示格式(估计430后做)
}
function dispDateInputOnfocus(){
    //TODO 适配pc端自定义日期显示格式(估计430后做)
}
//获取指定格式的日期格式
function getFormatDate(valueInput){
    var jqValueInput = $(valueInput);
    if(jqValueInput.val()!=""){
        var formManager = new mFormAjaxManager();
        formManager.getFormatDateValStr({"formId":$("#contentTemplateId").val(),"fieldName":jqValueInput.attr("id"),"value":jqValueInput.val()},{
            success:function(_obj){
                var retVal = $.parseJSON(_obj);
                jqValueInput.prev('input').val(retVal.result);
                return;
            }
        });
    }else {
        jqValueInput.prev('input').val("");
    }
}

/**
 * 查看更多重复表数据
 * @param tableName
 */
function showMore(tableName,clickArea){
	var showMoreBtn = $(clickArea);
	var dataId = $("#contentDataId").val();
	var viewState = $("#viewState").val();
	var rightId = $("#rightId").val();
	//var tempFormManager = new formManager();
	var params = new Object();
	params.tableName = tableName;
	params.dataId = dataId;
	params.viewState = viewState;
	params.rightId = rightId;
	params.nextPage = "";
	params.formId = form.id;
	params.viewType="pcForm";
	var unShowSubDataId = form.unShowSubDataIdMap[tableName];
	if(unShowSubDataId.length>0){//还有没有加载的重复表数据
		params.nextPage = unShowSubDataId.splice(0,form.pageSize).join(",");
	}
	if(params.nextPage!=""){//有更多
		//setTimeout(function(){
			progressBar(true,'loading...');
		//},10);
		top.$s.CapForm.showMore ({}, params,{
			repeat:true,   //当网络掉线时是否自动重新连接
	        success:function(_obj){
	        	var returnObj =_obj;// JSON.parse(_obj);
	        	if(returnObj.results=="noMore"){
	        		showMoreBtn.remove();
	        	}else{
	        		fillBackSubRow(JSON.parse(returnObj.results).datas);
					setTimeout(function(){
						myscroll.refresh();
					},500);

	        		if(unShowSubDataId.length==0){
	        			showMoreBtn.remove();
	        		}
	        	}
	        	progressBar(false,'success');
	        },
			error:function(e){
				var cmpHandled = parent.cmp.errorHandler(e);
				if(cmpHandled) {
				}else{
					$.alert(e.message);
				}
			}
		});
	//	setTimeout(function(){
			
	//	},200);
		
	}else{//没有更多
		showMoreBtn.remove();
	}
}
