/*==================================附件样式调整start=========================*/
//渲染附件显示
function renderAttachmentDisplayBox(eventArea,type) {

    var compDiv = eventArea.parents("span[id$=_span]").find("div.comp");
    var attachmentAreaFeature = (type == C_iChooseFileType_AssociateDocument)? "attachment2Area" : "attachmentArea";
    var attachmentArea = eventArea.parents("div[id^="+attachmentAreaFeature+"]");
    var attachmentDiv = eventArea.parents("div[id^=attachmentDiv_]");
    var oldDeleteIcon = attachmentDiv.find("span[onclick^=deleteAttachment]");//原来的删除按钮
    if(oldDeleteIcon && oldDeleteIcon.length > 0) oldDeleteIcon.remove();
    var fileUrl2 = attachmentDiv.attr("id").replace("attachmentDiv_","");
    var compObj = $.parseJSON("{"+compDiv.attr("comp")+"}");
    var canDelete = (compObj.canDeleteOriginalAtts == null)?true : compObj.canDeleteOriginalAtts;
    var displayBox = '';
    if(type == C_iChooseFileType_File || type == C_iChooseFileType_AssociateDocument) {
        attachmentDiv.css("line-height","3px");
        var fileName;
        var isFile = (type == C_iChooseFileType_File) ? true : false;
        var title = "";
        var iconStr = "";
        var sizeStrIndex = -1;
        var fileSizeStr = "";
        displayBox += '<div class="attachment_display_box_up '+(isFile ? "" : "attachment_display_box_up_assoc")+'" >';
        if(isFile) {
            fileName = eventArea.attr("title");
            title = eventArea.attr("title");
            if(title.indexOf(".") > -1) {
                var suffix = title.substring(title.lastIndexOf(".") + 1);
                suffix = suffix.toLocaleLowerCase();
                if(suffix != "ann" && suffix != "col" && suffix != "discuss" && suffix != "doc" && suffix != "et" && suffix != "forder"
                    && suffix != "form" && suffix != "htm" && suffix != "html" && suffix != "mail" && suffix != "metting" && suffix != "mov"
                    && suffix != "mp3" && suffix != "mp4" && suffix != "news" && suffix != "off_doc" && suffix != "pdf" && suffix != "picture"
                    && suffix != "plan" && suffix != "ppt" && suffix != "rar" && suffix != "survey" && suffix != "tif" && suffix != "txt"
                    && suffix != "video" && suffix != "vsd" && suffix != "wps" && suffix != "xls" && suffix != "zip" && suffix != "file"
                    && suffix != "jpg" && suffix != "jpeg" && suffix != "gif" && suffix != "png"){
                    iconStr = "ic_unkown_16";
                }else {
                    iconStr = "ic_"+suffix+"_16";
                }
            }else {
                iconStr = "ic_unkown_16";
            }
            sizeStrIndex = fileName.lastIndexOf("(");
            if(sizeStrIndex > -1) {
                fileSizeStr = fileName.substring(sizeStrIndex);
                fileName = fileName.substring(0,sizeStrIndex);
            }
            displayBox += '<span class="'+iconStr+'" style="display:inline-block;margin-top:3px;"></span>' +
                '<span  class="attachment_name_area" style="font-size: 10px;display:inline-block;">'+fileName+'</span>';
        }else {
            fileName = eventArea.html();
            displayBox += '<span  class="attachment_name_area" style="font-size: 10px;display:inline-block;">'+fileName+'</span>';
        }

        if(canDelete) {
            displayBox += '<span class="iconfont icon-chahao" style="display: inline-block;margin-left:3px;color:#48a0de;font-size:16px;" onclick="event.stopPropagation();delCurrentAtt(\''+fileUrl2+'\');"></span>';
        }
        if(isFile) {
            displayBox +='</div><div class="attachment_display_box_down" style="font-size: 10px;padding-left: 17px;">'+fileSizeStr+'</div>';
        }
        eventArea.html(displayBox);
        var attachmentDisplayBoxUp = $(".attachment_display_box_up",eventArea);
        var attachmentNameArea = $(".attachment_name_area",eventArea);
        var widthProportion = parseFloat(attachmentNameArea.width() / attachmentDisplayBoxUp.width());
        if(widthProportion > 0.9) {
            attachmentNameArea.css("width","80%").addClass("text_ellipsis");
        }
    }else if(type == C_iChooseFileType_Pic) {
        displayBox += '<div class="attachment_block image_display_box"></div>';
        var imgDelDiv = "";
        if(canDelete) {
            imgDelDiv = '<div style="position: absolute;z-index: 150;top: -8px;right: -10px;">' +
                '<span class="iconfont icon-chahao" style="color:#48a0de;font-size:16px;" onclick="delCurrentAtt(\''+fileUrl2+'\');"></span>' +
                '</div>';

        }else {
            imgDelDiv = '<span></span>';
        }
        displayBox = $(displayBox);
        attachmentDiv.append(displayBox);
        displayBox.append(eventArea);
        displayBox.append(imgDelDiv);
        eventArea.css("width","100%").css("height","100%");
        attachmentDiv.css("height","auto");
    }

}
//设置附件区域位置
function setAttachmentAreaPosition(attachmentArea,uploadSpan){
    if(uploadSpan && uploadSpan.length > 0) {
        var fieldSpan = uploadSpan.parents("span[id$=_span]");
        var uploadSpanBox = fieldSpan.find("div.uploadSpanBox");
        if(uploadSpanBox && uploadSpanBox.length > 0) return;
        fieldSpan.css("display","inherit");
        uploadSpanBox = $('<div class="layout_flex_typesetting_sub uploadSpanBox position_veri_center" style="width: 10%;"></div>');
        uploadSpan.removeClass("left");
        if(uploadSpan.hasClass("icon-mobanwendang")) uploadSpan.css("margin-left",-8);//适配关联文档按钮位置
        uploadSpanBox.append(uploadSpan);
        attachmentArea.css("width","90%");
        attachmentArea.after(uploadSpanBox);
        fieldSpan.addClass("layout_flex_typesetting_parent");
        attachmentArea.addClass("layout_flex_typesetting_sub");
    }
}


//删除当前附件
function delCurrentAtt(attachmentFileUrl) {
    var currentAttDisplayBox = $("#attachmentDiv_" + attachmentFileUrl);
    if(currentAttDisplayBox.length > 0 ) {
        var attachmentArea = currentAttDisplayBox.parents("div[id^=attachmentArea]");
        var uploadSpan = attachmentArea.next("div.uploadSpanBox");
        if(fileUploadAttachment != null) {
            if(fileUploadAttachment.containsKey(attachmentFileUrl)) {
                fileUploadAttachment.clear();
            }
        }else if(fileUploadAttachments != null) {
            if(fileUploadAttachments.containsKey(attachmentFileUrl)) {
                fileUploadAttachments.remove(attachmentFileUrl);
            }
        }
        currentAttDisplayBox.remove();
    }
}
/*==================================附件样式调整 end=========================*/
/*============================日历样式调整start=============================*/
//调用新日历组件
function getNewCalendar(ctrl,options) {
    ctrl.removeAttr("onblur").addClass("triangle");
    var initVal = ctrl.val();
    ctrl.attr("oldVal",initVal);
    var id = ctrl.attr("id");   
    var fieldSpan = ctrl.parent("span[id$=_span]");
    var fieldVal = $.parseJSON(fieldSpan.attr("fieldval"));
    var inputType = fieldVal.inputType;
    var title = fieldVal.displayName;
    var formatType = fieldVal.formatType;
    var dateWidgetCtrl = ctrl;
    if(formatType&&formatType.length > 0){
        var dateTextInput = fieldSpan.find("input[id="+id+"_txt]");
        if(dateTextInput && dateTextInput.length > 0) {
            dateTextInput.addClass("triangle");
            dateWidgetCtrl = dateTextInput;
        }
    }
    var dateConfig = {
        date : {
            preset : 'date',
            minDate: new Date(1900,3,10,9,22),
            maxDate: new Date(2050,7,30,15,44)
        },
        datetime : {
            preset : 'datetime',
            minDate: new Date(1900,3,10,9,22),
            maxDate: new Date(2050,7,30,15,44)
        }
    };
    var calendarOptions = $.extend(
        dateConfig[inputType],
        {
            theme : 'android-ics light',//直接用该主题
            mode : 'scroller',//直接选用日期滚动的模式
            display : 'bottom',//直接选用从底部弹出的方式
            lang : getLanguage(),
            title : title,
            initVal:initVal,
            zoomPage : (typeof style && style == "4") ? false : true,//如果是4则不是可缩放页面，其余的就是可缩放页面
            openCallback:function(){
                if(os() == "iPhone"){
                    var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_hidden, "");
                    returnResultToClient(result);
                }
            },
            okCallback : function(formatDate) {
                var oldVal = ctrl.attr("oldVal");
                ctrl.val(formatDate);
                if(oldVal != formatDate) {
                    calc(ctrl);
                }
                ctrl.attr("oldVal",formatDate);
                if(formatType&&formatType.length > 0){
                    valueDateInputOnclose(ctrl); //适配中文格式日期-----xinpei
                }
                if(os() == "iPhone"){
                    setTimeout(function(){
                        var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_show, "");
                        returnResultToClient(result);
                    },300);
                }
            },
            clearCallback : function() {
                ctrl.val("");
                ctrl.trigger("change");
                ctrl.attr("oldVal","");
                calc(ctrl);
                if(formatType&&formatType.length > 0){
                    valueDateInputOnclose(ctrl);
                }
                if(os() == "iPhone"){
                    setTimeout(function(){
                        var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_show, "");
                        returnResultToClient(result);
                    },300);
                }
            },
            cancelCallback:function(){
                if(os() == "iPhone"){
                    setTimeout(function(){
                        var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_show, "");
                        returnResultToClient(result);
                    },300);
                }
            }
        }
    );
    setTimeout(function(){
        dateWidgetCtrl.mobiscroll(calendarOptions);
    },300);
}
/*============================日历样式调整 end=============================*/
/*=======================调整拍照定位样式start=============================*/
/**
 * 重新设置图标按钮的位置和显示图片的位置
 * @param spanArea:id$=_span的div
 * @param span:包含图标和input
 */
function setPhotoLocationIconPosition(spanArea,span) {
    var photoArea = $('<div style="width:100%;height:100%;" class="layout_flex_typesetting_parent"></div>');
    var flexHtml = '<div class="layout_flex_typesetting_sub"></div>';
    var iconArea = $(flexHtml);
    var imgArea = $(flexHtml);
    iconArea.addClass('position_veri_center').css("width","15%");
    imgArea.addClass("imgArea").css("width","85%");
    iconArea.append(span);
    iconArea.find("span.map_position_48").css("display","null");
    photoArea.append(imgArea).append(iconArea);
    spanArea.html(photoArea);
    spanArea.css("padding-top","15px");
}
//渲染拍照定位图片的新样式
function renderPhotoDisplayBox(target,photo,delImg){
    photo.css("width","100%").css("height","100%");
    var photoDisplayArea = target.parents("div.layout_flex_typesetting_parent").find("div.imgArea");
    var photoDisplayBox = $('<div class="image_display_box" style="margin-bottom: 10px;" ></div>');
    var delImgBox = $('<div style="position: absolute;z-index: 150;top: -8px;right: -10px;"></div>');
    delImgBox.append(delImg);
    photoDisplayBox.append(photo).append(delImgBox);
    photoDisplayArea.html(photoDisplayBox);
}
/*=======================调整拍照定位样式 end=============================*/
//=====================select组件新样式start===================================//
//渲染select
function renderSelect(t){
    var select = t;
    var selectSpan = select.parents("span[id$=_span]");
    var accountWay = t.attr("onchange").replace("(this);","");//获取值改变后的计算方法
    var title = $.parseJSON(selectSpan.attr("fieldval")).displayName;
    var height = select.height();
    var containerDiv = $("<div style='width:100%;height:"+height+"px;position: relative;'></div>");
    var selectDiv = $("<div style='width: 100%;height:"+height+"px;left:0px;top:0px;position: absolute;'></div>");
    select.attr("disabled",true);
    containerDiv.append(select).append(selectDiv);
    selectSpan.append(containerDiv);
    select.css("width","100%");
    selectDiv.unbind("click").bind("click",function(){
        select.blur();
        var beforeChangeVal = select.children(":selected").val();
        if(os() == "iPhone"){ //iphone的情况，需要将webview的界面进行调整
            var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_hidden, "");
            returnResultToClient(result);
            setTimeout(function(){
                createSelectBox(title,select,function(selectedValue){
                    if(beforeChangeVal != selectedValue) {
                        if(accountWay == "calc") {
                            calc(select);//调用pc接口
                        }else if(accountWay == "changeReflocation") {//枚举关联计算
                            changeReflocation(select);//调用PC接口
                        }
                    }
                    setTimeout(function(){
                        var result = getCommandStr(C_iInvokeNativeCtrlCommand_iosWindowChange_show, "");
                        returnResultToClient(result);
                    },300);
                });
            },50);
        } else {
            createSelectBox(title,select,function(selectedValue){
                if(beforeChangeVal != selectedValue) {
                    if(accountWay == "calc") {
                        calc(select);//调用pc接口
                    }else if(accountWay == "changeReflocation") {//枚举关联计算
                        changeReflocation(select);//调用PC接口
                    }
                }
            });
        }


    });
}
//select选择面板html
var selectPanelHtml = '<div class="select_ui">'+
    '<div class="select_panel panel_hidden_state">' +
    '   <div class="select_header">' +
    '       <div class="header_title">' +
    '           <span class="title"></span>' +
    '       </div>' +
    '   </div>' +
    '   <div class="select_body">' +
    '       <div  class="select_listpicker" id="optionPicker">' +
    '           <div class="select_scroller">' +
    '               <ul class="optionsList"></ul>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>' +
    '</div>';
/**
 * 创建新的select组件
 * @param title：下拉选择框的标题
 * @param select：原生的select
 * @param language：语言环境
 * @param changeCallback：改变后的回调函数
 * @param zoomPage:是否是可缩放页面
 */
function createSelectBox(title,select,changeCallback) {
    var options = select.children("option");

    var name = select.attr("name");
    var selectUi = $(selectPanelHtml);
    var selectPanel = $(".select_panel",selectUi);
    var scrollArea = $('.select_listpicker',selectPanel);
    var titleArea = $('.title',selectPanel);
    var ul = $('.optionsList',selectPanel);
    titleArea.text(title);
    var lisHtml = '';
    for(var i = 0; i < options.length ; i ++) {
        lisHtml += '<li index="'+i+'" optionVal="'+options[i].value+'" ';

        lisHtml +='><span class="select_text">'+((options[i].text == "" || options[i].text.length == 0) ? "&nbsp;" : options[i].text)+'</span><span class="select_radio"><div class="mui-table-view-cell mui-radio mui-left" style="height: 100%;">' +
            '<input type="radio" class="select_radio_green newStyle_select_radio" name="'+name+'"';
        if(options[i].selected == true) {
            lisHtml += 'checked="true"';
        }
         lisHtml += '></div></span></span></li>';
    }
    ul.html(lisHtml);
    var scrollAreaId = scrollArea.attr("id") +"_"+select.attr("id");
    scrollArea.attr("id",scrollAreaId);
    var height = (os() == "iPhone")?window.innerHeight : $(window).height();
    selectUi.appendTo($(document.body));
    selectUi.css("height", height);
    selectUi.bind("touchmove",function(event) {
        event.preventDefault();
    });

    setTimeout(function() {
        var top = $(document).scrollTop();
        selectUi.css("top",top);
        selectPanel.removeClass("panel_hidden_state").addClass("panel_show_state");
    },300);
    createSelectScroller(scrollAreaId,ul,selectUi,selectPanel,select,changeCallback);

}
//创建select的滚动对象
function createSelectScroller(id,ul,ui,panel,select,changeCallback) {
    var selectScroller = new iScroll(id,{
        bounce :  true,
        hScroll : false,
        vScroll : true,
        hScrollbar: false,
        vScrollbar: false,
        snap : "li"
    });
    selectScroller.refresh();
    ul.children("li").each(function() {
        var li = $(this);
        if(li.find(":checked").length > 0) {
            li.attr("selected") == "selected";
        }
        var radio = li.find("input[type=radio]");
        radio.unbind("click").bind("click",function() {
            ul.find("li").each(function(){
                $(this).removeAttr("selected");
            });
            li.attr("selected","selected");
            var value = li.attr("optionVal");
//            var index = li.attr("index");
            var selectedOption = select.find("option[value="+value+"]");
            selectedOption[0].selected = true;
            if(changeCallback) {
                changeCallback(value);
            }
            selectClose(ui,panel,selectScroller);
        });
    });

}

//关闭select
function selectClose(ui,panel,scroller){

    setTimeout(function(){
        panel.removeClass("panel_show_state").addClass("panel_disappear_state");
        scroller = null;
        panel.remove();
        panel = null;
        ui.css("display","none");
        ui.remove();
    },200);
}


//=====================select组件新样式 end===================================//
//====================地图标注+位置定位新样式start=============================//

function renderLbsInput(targetParent,tj,text,filedName) {

    if(text.indexOf("<br") > -1){
        text = text.substring(0,text.indexOf("<")) + text.substring(text.indexOf(">")+1);
    }
    var textarea = targetParent.find("textarea[id="+filedName+"_txt]");
    var textareaDefaultHeight = 26;
    if(textarea.length == 0) {
        textarea = $("<textarea/>");
        textarea.attr("id",filedName+"_txt").attr("name",filedName+"_txt").css("text-align","left").css("color","blue").css("font-size","14px").addClass("triangle");
        if(text.length > 0) {
            setLBSTextAreaHeight(textarea,text,textareaDefaultHeight,targetParent);
        }
    }else {
        setLBSTextAreaHeight(textarea,text,textareaDefaultHeight);
    }
    if(!text) text = "";
    textarea.text(text);
    return textarea;
}
function setLBSTextAreaHeight(textarea,text,defaultHeight,textareaSpan) {
    var textNum = text.length;
    var textFontSize = parseInt(textarea.css("font-size").replace("px",""));
    var textareaWid = -1;
    if(textareaSpan) {
        textareaWid = textareaSpan.width();
    }else {
        textareaWid = textarea.width();
    }
    if((textNum*textFontSize) > textareaWid) {
        var num = 1;
        var temp = textNum*textFontSize;
        while(temp / textareaWid > 1){
            temp = temp / textareaWid;
            num ++;
        }
        textarea.css("height",defaultHeight + (textFontSize * (num + 1)));
    }else {
        textarea.css("height",defaultHeight);
    }
}
//====================地图标注+位置定位新样式end=============================//
//渲染复选框
function renderCheckbox(checkbox){
    var checkboxParent = checkbox.parents("span[id$=_span]");
    var checkboxParentH = checkboxParent.height();
    checkboxParent.css("height",(checkboxParentH + 2));//调整复选框容器的高度
    var checkedSpan = $('<div class="iconfont icon-gou checkbox_selected" style="font-size: 24px;color: #007aff"></div>');
    var noCheckedSpan = $('<span class="checkbox_no_selected"></span>');
    var checkArea = $('<div class="checkbox_area"></div>');
    checkArea.append(noCheckedSpan);
    checkbox.after(checkArea);
    checkbox.css("opacity","0").css("width",20).css("height",20).css("position","absolute").css("zIndex",10000).addClass("haveInitialized");
	
    var value = checkbox.val();
    if(value == 1) {
        checkbox[0].checked == true;
        if(checkbox[0].disabled){
            checkedSpan.css("color","#48a0de");
        }
        checkArea.append(checkedSpan);
    }
    if(checkbox[0].disabled) {
        checkArea.unbind("click");
        checkArea.unbind("touchend");
    }else {
		checkbox.unbind("click").bind("click",function(){
			if(checkbox[0].checked != true) {
				checkbox[0].value = 0;
                checkArea.html(noCheckedSpan);
            }else {
			checkArea.append(checkedSpan);
                checkbox[0].value = 1;
            }
		});
        
    }

}
//初始化渲染非空输入域底色
function initRenderNotNullFields4LightForm() {
    var notNullColor = "#FCDD8B";
    var defaultColor = "#FFFFFF";
    $("span[id$=_span]").each(function() {
        var fieldSpan = $(this);
        var editAndNotNull = fieldSpan.hasClass("editableSpan");
        if(editAndNotNull) {
            var fieldId = fieldSpan.attr("id").replace("_span","");
            var inputField = fieldSpan.find("input[type=text]");
            var radioField = fieldSpan.find("input[type=radio]");
            var textAreaField = fieldSpan.find("textarea");
            if(inputField.length > 0) {
                if(fieldSpan.find("input[id="+fieldId+"]").val() == "" || fieldSpan.find("input[id="+fieldId+"]").val().length == 0) {
                    inputField.css("background-color",notNullColor);
                }
                if(editAndNotNull){
                    inputField.change(function(){
                        if(inputField.val()==""){
                            inputField.css("background-color",notNullColor);
                        }else{
                            inputField.css("background-color",defaultColor);
                        }
                    });
                }
            }else if(radioField.length > 0) {
                if(fieldSpan.find(":checked").length == 0) {
                    fieldSpan.css("background-color",notNullColor);
                }
            }else if(textAreaField.length > 0) {
                if(textAreaField.text() == "" || textAreaField.text().length == 0){
                    textAreaField.css("background-color",notNullColor);
                }

            }
        }
        bindFiledNotNullColor(fieldSpan);
    });
}

function bindFiledNotNullColor(jqField){
    var nullColor = "#FCDD8B";
    var notNullColor = "#FFFFFF";
    var editAndNotNull = jqField.hasClass("editableSpan");
    var fieldVal =jqField.attr("fieldVal");
    if(fieldVal) fieldVal = $.parseJSON(fieldVal);
	//黄治翔-修改客户bug，轻表单重复表添加有错
	if(fieldVal == null || fieldVal == undefined || fieldVal==""){
		return true;
	}
    var inputType = fieldVal.inputType;
    var idStr = jqField.attr("id").split("_")[0];
    var editTag=jqField.hasClass("edit_class");
    if(editAndNotNull){
        switch(inputType){
            case "radio":
                var radiocom = jqField.find(".radio_com");
                radiocom.unbind("click").bind("click",function(){
                    jqField.find("label").css("background-color",notNullColor);
                    radiocom.css({"background-color":notNullColor});
                });
                break;
            case "date":
            case "datetime":
                var textInput = jqField.find("#"+idStr);
                if(editTag){
                    textInput.change(function(){
                        if(textInput.val()==""){
                            textInput.css("background-color",nullColor);
                        }else{
                            textInput.css("background-color",notNullColor);
                        }
                    });
                }
                break;
            case "text":
                var changeField = jqField.find("#"+idStr);
                if(editTag){
                    jqField.find("input[type='text']").each(function(){
                        var textInput = $(this);
                        textInput.change(function(){
                            if(textInput.val()==""){
                                textInput.css("background-color",nullColor);
                            }else{
                                textInput.css("background-color",notNullColor);
                            }
                        });
                    });
                }
                break;
            case "textarea":
                var changeField = jqField.find("#"+idStr);
                if(jqField.hasClass("add_class")){
                    jqField.find("textarea").each(function(){
                        var textAreaField = $(this);
                        textAreaField.change(function(){
                            if(textAreaField.val()==""){
                                textAreaField.css("background-color",nullColor);
                            }else{
                                textAreaField.css("background-color",notNullColor);
                            }
                        });
                    });
                }else if(editTag){
                    var textAreaField = jqField.find("textarea");
                    textAreaField.change(function(){
                        if(textAreaField.val()==""){
                            textAreaField.css("background-color",nullColor);
                        }else{
                            textAreaField.css("background-color",notNullColor);
                        }
                    });
                }
                break;
            default :
                break;
        }

    }
}
//获取当前语言环境
function getLanguage () {
    var lang;
    var enRegex = /en/g;
    var chiRegex = /zh/g;
    if(navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))){
        lang = lang[1];
    }
    if(!lang && navigator) {
        if (navigator.language) {
            lang = navigator.language;
        } else if (navigator.browserLanguage) {
            lang = navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
            lang = navigator.systemLanguage;
        } else if (navigator.userLanguage) {
            lang = navigator.userLanguage;
        }
    }
    if(enRegex.test(lang)) {
        lang = "en";
    }else if(chiRegex.test(lang)) {
        lang = "zh";
    }
    return lang;
}
function os(){
    if(navigator.userAgent.indexOf("iPhone") > -1) {
        return "iPhone";
    }else if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1){
        return "android";
    }else if(navigator.userAgent.indexOf('iPad') > -1) {
        return "iPad";
    }
}

//自定义点击事件（解决点透问题）
(function($){
    $.fn.$click = function(fn) {
        if(typeof fn !== "function") {
            throw "must defined call back function";
        }

        var defaultEvent = "click";
        if (typeof window.ontouchstart === 'undefined') {  //对于没有touch事件的直接执行事件后return
            this[0].addEventListener(defaultEvent,fn,false);
            return true;
        }
        var trackingClick = false;
        var multipleSpotClick = false;//是否是多点点击
        var trackingClickStart = 0;
        var targetElement = null;
        var lastTouchIdentifier = 0;
        var tapDelay = 200;//点击延迟阀值
        var tapFast = 200;//快速点击时间间隔阀值
        var tapTimeout = 700;//点击hold住的时间阀值
        var lastClickTime = 0;//最后一次点击的时间戳
        var canNextClick = false;
        var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
        var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
        var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
        var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
        if(deviceIsAndroid) {
            this[0].addEventListener("mouseover",onMouse,true);
            this[0].addEventListener("mousedown",onMouse,true);
            this[0].addEventListener("mouseup",onMouse,true);
        }
        this[0].addEventListener("click",onClick,true);
        this[0].addEventListener("touchstart",onTouchStart,false);
        this[0].addEventListener("touchend",onTouchEnd,false);
        this[0].addEventListener("touchcancel",onTouchCancel,false);

        function onMouse(event) {
            if (!targetElement) {
                return true;
            }
            if (event.forwardedTouchEvent) {
                return true;
            }
            if (!event.cancelable) {
                return true;
            }
            if(!needsClick(targetElement) || canNextClick) {
                if(event.stopImmediatePropagation){
                    event.stopImmediatePropagation();
                }else {
                    event.propagationStopped = true;
                }
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
            return true;
        }
        function onClick(event){
            var permitted;
            if (trackingClick) {
                targetElement = null;
                trackingClick = false;
                return true;
            }
            permitted = onMouse(event);
            if (event.target.type === 'submit' && event.detail === 0) {
                return true;
            }
            if (!permitted) {
                targetElement = null;
            }
            return permitted;
        }
        function onTouchStart(event){
            var targetDom;
            var touch;
            var selection;//括选
            if (event.targetTouches.length > 1) {//如果点击的点多于一个
                multipleSpotClick = true;//多点点击设置为true
                return true;
            }
            targetDom = getTargetElementFromEventTarget(event.target);
            touch = event.targetTouches[0];
            if (deviceIsIOS) {
                selection = window.getSelection();
                if (selection.rangeCount && !selection.isCollapsed) {//是否是方块框选择
                    event.preventDefault();
                    return true;
                }
                if (!deviceIsIOS4) {
                    if (touch.identifier && touch.identifier === lastTouchIdentifier) {
                        event.preventDefault();
                        return false;
                    }

                    lastTouchIdentifier = touch.identifier;
                }
            }
            trackingClick = true;
            trackingClickStart = event.timeStamp;//点击开始的时间戳
            targetElement = targetDom;
            if ((event.timeStamp - lastClickTime) < tapDelay) {
                event.preventDefault();
            }
            return true;
        }
        function onTouchEnd(event) {
            var targetDom = targetElement;
            if(!trackingClick){
                event.preventDefault();
                return true;
            }
            if ((event.timeStamp - trackingClickStart) > tapDelay) {//如果touchend时间戳减touchstart时间戳小于200
                canNextClick = true;
                event.preventDefault();
                return true;
            }
            if((event.timeStamp - lastClickTime) < tapFast){
                event.preventDefault();
                return true;
            }
            if ((event.timeStamp - trackingClickStart) > tapTimeout) {
                event.preventDefault();
                return true;
            }
            canNextClick = false;
            lastClickTime = event.timeStamp;
            trackingClick = false;
            trackingClickStart = 0;

            if (!needsClick(targetDom)) {
                event.preventDefault();
                if(!multipleSpotClick) {
                    fn();
                }

            }
            multipleSpotClick =false;
        }
        function onTouchCancel(event){
            trackingClick = false;
            targetElement = null;
        }
        function getTargetElementFromEventTarget (eventTarget) {
            if (eventTarget.nodeType === Node.TEXT_NODE) {
                return eventTarget.parentNode;
            }

            return eventTarget;
        };

        function needsClick(target){
            switch (target.nodeName.toLowerCase()) {
                case 'button':
                case 'select':
                case 'textarea':
                    if (target.disabled) {
                        return true;
                    }

                    break;
                case 'input':
                    if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                        return true;
                    }

                    break;
                case 'label':
                case 'video':
                    return true;
            }

            return (/\bneedsclick\b/).test(target.className); 
        }
    }

})(jQuery);


