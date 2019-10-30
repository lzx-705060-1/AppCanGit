function init() {
}
// 保存或修改成模板参数设置
function setTemplateParam(moduleId, title) {
    if (title == null || title == "") {
        $.alert("未传入正确的参数title");
        return;
    }
    if (moduleId == null || moduleId == "") {
        $.alert("未传入正确的参数moduleId");
        return;
    }
    var contentDiv = getMainBodyDataDiv$();
    $("#moduleId", contentDiv).val(moduleId);
    $("#moduleTemplateId", contentDiv).val(-1);
    $("#title", contentDiv).val(title);
}
// 保存或修改模板(带数据库保存)
function saveTemplate(moduleId, title, successCallBack, failedCallBack) {
    setTemplateParam(moduleId, title);
    saveOrUpdate({
        "mainbodyDomains" : null,
        "needSubmit" : true,
        "success" : successCallBack,
        "failed" : failedCallBack
    });
}
// 万能方法，推荐使用,各种新建修改场景均能使用
// 对外接口，保存正文,不修改模块类型,指定moduleId,外面应用功能已经申请了自己的UUID，使用这个方法后，不用在保存完成后更新正文组件表的关系
function setSaveContentParam(moduleId, title) {
    //if (title == null || title == "") {
    //    cmp.notification.alert("未传入正确的参数title",null,"提示","确定");
    //    return;
    //}
    if (moduleId == null || moduleId == "") {
        cmp.notification.alert("未传入正确的参数moduleId",null,"提示","确定");
        return;
    }
    var contentDiv = getMainBodyDataDiv$();
    var moduleTemplateId = $("#moduleTemplateId", contentDiv).val();
    if (moduleTemplateId == "-1") {// 调用模板新建
        $("#moduleTemplateId", contentDiv).val($("#id", contentDiv).val());
        $("#id", contentDiv).val(-1);
        $("#createId", contentDiv).val(0);
    } else if (moduleTemplateId == "0") {// 没有调用模板的业务数据新建或者修改
        // $("#id",contentDiv).val(-1);
    } else {// 调用模板后发起的业务数据修改
    }
    $("#moduleId", contentDiv).val(moduleId);
    $("#title", contentDiv).val(title);
}
// 正文保存方法（带数据库保存）
function saveContent(moduleId, title, successCallBack, failedCallBack) {
    setSaveContentParam(moduleId, title);
    saveOrUpdate({
        "mainbodyDomains" : null,
        "needSubmit" : true,
        "success" : successCallBack,
        "failed" : failedCallBack
    });
}
// 另存为同类型的新业务数据
function setSaveAsContentParam(title) {
    if (title == null || title == "") {
        $.alert("未传入正确的参数title");
        return;
    }
    var contentDiv = getMainBodyDataDiv$();
    $("#id", contentDiv).val(-1);
    $("#moduleId", contentDiv).val(-1);
    $("#title", contentDiv).val(title);
}
// 另存为同类型的新业务数据(带数据库保存)
function saveAsContent(title, successCallBack, failedCallBack) {
    setSaveAsContentParam(title);
    saveOrUpdate({
        "mainbodyDomains" : null,
        "needSubmit" : true,
        "success" : successCallBack,
        "failed" : failedCallBack
    });
}
// 数据预提交，不入库，会更新缓存对象
function preSubmitData(option,callBack, failedCallback) {
    if ($("#contentType", getMainBodyDataDiv$()).val() == "20") {// 表单才预提交
	//TODO  span不做验证
    	$("span").removeClass("validate");
        saveOrUpdate({
            "mainbodyDomains" : null,
            "success" : callBack,
            "failed" : failedCallback,
            "needSubmit" : true,
            "saveDB" : option.saveDB?true:false,
            "needCheckRule" :option.needCheckRule?true:false,
            "checkNull" : option.checkNull?true:false,
        });
    } else {
        if (typeof callBack == 'function') {
            callBack();
        }
    }
}
// 新建或者更新正文,内部方法，不允许调用，调用后果自负
function saveOrUpdate(mainbodyArgs) {
    var contentDiv = getMainBodyDataDiv$();// 当前选项卡的DIV,多正文时区分当前正文
    var mainbody_callBack_success = mainbodyArgs.success; // 执行成功后的回调函数
    var mainbody_callBack_failed = mainbodyArgs.failed;// 执行失败后的回调函数
    var mainbodyDomains = mainbodyArgs.mainbodyDomains;// 传入的正文数据
    var needSubmit = mainbodyArgs.needSubmit == null ? true : mainbodyArgs.needSubmit;// 是否需要提交数据(有些业务模块正文不单独提交，随着业务整体入库)
    var saveDB = mainbodyArgs.saveDB == null ? true : mainbodyArgs.saveDB;// 提交后是否要保存数据到数据库
    var checkNull = mainbodyArgs.checkNull == null ? true : mainbodyArgs.checkNull;// 是否需要校验必填
    var needCheckRule = mainbodyArgs.needCheckRule==null?true:mainbodyArgs.needCheckRule;//是否需要校验表单业务规则
    var optType = mainbodyArgs.optType;


    //var contentData = [];// 正文数据
    //if (mainbodyDomains) {// 如果传入了正文数据，就使用传入的
    //    contentData = mainbodyDomains;
    //}
    //contentData.push("_currentDiv");
    //contentData.push(getMainBodyDataDiv());
    var contentType = $("#contentType", contentDiv).val();// 正文类型
    if (contentType == 10) {// HTML正文
        var val = $.content.getContent();
        $("#content", contentDiv).val(val);
    } else if (contentType == 20) {// 表单正文
        var validateOpt = new Object();// 表单验证参数
        validateOpt['errorAlert'] = true;
        validateOpt['errorBg'] = true;
        validateOpt['errorIcon'] = false;
        validateOpt['validateHidden'] = true;
        validateOpt['checkNull'] = checkNull;
        if (!getMainBodyHTMLDiv$().validate) {
            var err={message:"表单正在加载!"}
            mainbody_callBack_failed(err);
            return;
        }
        var errorArray=getMainBodyHTMLDiv$().validate(validateOpt);

        if (errorArray.length > 0) {// 验证失败调用 ，执行失败的回调函数
            var err={message:errorArray[0][0].errorMsg}
            mainbody_callBack_failed(err);
            return;
        } else {// 验证通过，组装表单数据到正文数据中
            if (checkNull && !checkHW(getMainBodyHTMLDiv$())) {
                var err="";
                mainbody_callBack_failed(err);
                return;
            }
            var contentData=getFormJson();
            //下面的参数预提交传false
            contentData["needCheckRule"]=needCheckRule;//是否校验
            contentData["notSaveDB"]=!saveDB;//是否保存到数据库

        }
    } else if (contentType > 40 && contentType < 50) {// OFFICE正文
    }
    if (needSubmit) {// 是否需要提交数据
      submitContentData(saveDB,needCheckRule,contentData, mainbody_callBack_success,
          mainbody_callBack_failed,false,optType);
    } else {// 不保存数据库
      mainbody_callBack_success(contentData);
    }
}

//获取要执行rest提交的json数据
function getFormJson(){
    var contentData = [];// 正文数据
    //if (mainbodyDomains) {// 如果传入了正文数据，就使用传入的
    //    contentData = mainbodyDomains;
    //}
    contentData.push("_currentDiv");
    contentData.push(getMainBodyDataDiv());
    for ( var i = 0; i < form.tableList.length; i++) {
        var tempTable = $("#" + form.tableList[i].tableName);
        if (tempTable.length > 0) {
            contentData.push(form.tableList[i].tableName);
        }
    }
    var options = new Object();
    options.domains = contentData;
    var jsonObj = $("body").formobj(options);

    //------------------rest--------------
    var data=formData.results.data;
    var submitData={
        "moduleId":content.moduleId,
        "needSn":false
    };
    submitData.content=content;
    if(submitData.content.moduleTemplateId=="-1"){
        if (submitData.templateId) {
            submitData.content.moduleTemplateId = submitData.templateId;
        } else {
            submitData.content.moduleTemplateId = submitData.content.id;
        }
        submitData.content.id="-1";
    }
    submitData.attachmentInputs =top.cmp.sui.s3scopeDataConverter().attachmentInputs;

    //签章
    submitData.signatures=[];
    if (cmp.platform.CMPShell) {
        //判断缓存中是否有签章数据
        var signatureKey = cmp.sui.getSignatureKey();
        var signatureData = {};
        try {
            signatureData = JSON.parse(cmp.storage.get(signatureKey, true)) || {};
        } catch (e) {
            signatureData = {};
        }
        if (signatureData ) {
            for (sign in signatureData) {
                if (sign.indexOf(content.moduleId) != -1) {
                    var signatures={"isNewImg":false,
                        "affairId":content.moduleId
                    };
                    signatures.qianpiData=JSON.stringify([signatureData[sign]]);
                    submitData.signatures.push(signatures);
                }
            }
        }
    }


    //遍历修改值
    for(key in jsonObj){
        if(key.indexOf("formmain_")!=-1){
            var fields=jsonObj[key];
            for(field in fields){
                if(field.length==9){
                    if(data['master'][field]){
                        data['master'][field].value=fields[field];
                    }
                }
            }
        }else if(key.indexOf("formson_")!=-1){
            var  rows=jsonObj[key];
            if(data['children']  && data['children'][key] && data['children'][key]["data"]) {
                var data_currformson=[];
                $.extend(true,data_currformson,data['children'][key]["data"]);;
                if(data_currformson.length!=rows.length){//如果重复表行进行了添加删除
                    if(rows.length>data_currformson.length){//添加了行
                        var addLength=rows.length-data_currformson.length;
                        for (var l = 0; l < addLength; l++) {
                            var s={};
                            $.extend(true,s,data_currformson[0]);
                            data_currformson.push(s);
                        }
                    }else{ //删除了行
                        data_currformson=data_currformson.slice(0, rows.length);
                    }
                }
                for (var r = 0; r < rows.length; r++) {
                    data_currformson[r]['__id']= rows[r]['id'];
                    var fields = rows[r];
                    for (field in fields) {
                        if (field.length == 9) {
                            if (data_currformson[r] && data_currformson[r][field]) {
                                data_currformson[r][field].value = fields[field];
                            }

                        }
                    }
                }
                data['children'][key]["data"]=data_currformson;
            }
        }
    }

    //附件
    for(var fields in data['master']){
        if(data['master'][fields] && data['master'][fields].attData){
            data['master'][fields]["__state"]="modified";
        }
    }
    for(var key in data['children']){
        if(data['children'][key]["data"]){
            var  rows=data['children'][key]["data"];
            for (var r = 0; r < rows.length; r++) {
                var fields = rows[r];
                for (field in fields) {
                    console.log(field);
                    if (field.length == 9) {
                        if (fields[field].attData) {
                            fields[field]["__state"]="modified";
                        }

                    }
                }
            }
        }

    }

    //存储字段信息给轻表单验证
    var fieldList={};
    $("span[id$='_span']").each(function(){
        var vieldval;
        try{
            vieldval=$.parseJSON($(this).attr("fieldval"));
        }catch(e) {

        }
        if(vieldval){
            vieldval.finalInputType=vieldval.inputType;
            fieldList[this.id.replace("_span","")]=vieldval;
        }

    });
    parent.cmp.storage.save("pcform_fieldlist_"+form.moduleId+"_"+params.rightId,JSON.stringify(fieldList),true);

    submitData.data=data;

    return submitData;
}
// 提交正文数据
function submitContentData(saveDB, needCheckRule, contentData, mainbody_callBack_success,
                           mainbody_callBack_failed,onlyGenerateSn,optType) {
    if (contentData == null) {
        $.alert("contentData传入为空!");
        return;
    }
    contentData["needCheckRule"]=needCheckRule;//是否校验
    contentData["notSaveDB"]=!saveDB;//是否保存到数据库
     if(typeof(mainbody_callBack_success)!="function"){$.alert("成功时回调函数为空!");return;}
     //提交数据

    top.$s.CapForm.saveOrUpdate ({}, contentData, {
        success : function(ret) {
            if (ret.success == "true") {
                var snMsg = "";
                if (ret.sn != null) {// 如果产生了流水号需要给出提示
                    var snObj = ret.sn;
                    for ( var snField in snObj) {
                        snMsg += "已在{" + snField
                            + "}项上生成流水号:"
                            + snObj[snField] + "\n";
                    }
                    cmp.notification.alert(snMsg, function() {
                        mainbody_callBack_success(ret, snMsg);
                    }, " ","确定");
                }else{
                    mainbody_callBack_success(ret, snMsg);
                }
            }else{
                if(ret.errorMsg.indexOf("ruleError")!=-1){
                    var rule=JSON.parse(ret.errorMsg);
                    rule.ruleError=rule.ruleError;
					//TODO OA-109205M3端，无流程表单字段设置了数据唯一或唯一标示，在原样表单模式下，不满足时没有颜色背景标注对应字段。
					 var fields =rule.fields;
                    for ( var i = 0; i < fields.length; i++) {
                        changeValidateColor(fields[i]);
                    }
					//TODO   end
                    if(rule.forceCheck==1){
                        mainbody_callBack_failed(rule.ruleError);
                    }else{
                        cmp.notification.confirm(rule.ruleError, function(index){
                            if (index == 0) {
                                needCheckRule = false;
                                return submitContentData(saveDB,false,contentData, mainbody_callBack_success,
                                    mainbody_callBack_failed,false,optType);
                            } else {
                                mainbody_callBack_failed('');
                            }
                        }, '', ['继续', '取消']);
                    }
                }else{
                    mainbody_callBack_failed(ret.errorMsg);
                }
            }
            return;
        },
        error:function(err){
            mainbody_callBack_failed(err.errorMsg);
            return;
        }
    });


}

/**
 * 设置content的值
 */
function setContent(contentHtmlStr) {
    var contentDiv = getMainBodyDataDiv$();
    $("#content", contentDiv).val(contentHtmlStr);
    $("#fckedit").setEditorContent(contentHtmlStr);
}

// 返回正文组件数据的DOMAIN
function getMainBodyDataDiv() {
    var mainBodyDataDiv = "mainbodyDataDiv_" + $("#_currentDiv").val();
    return mainBodyDataDiv;
}
function getMainBodyDataDiv$() {
    return $("#" + getMainBodyDataDiv());
}
// 返回HTML区域的DOMAIN
function getMainBodyHTMLDiv() {
    var curDiv = "mainbodyHtmlDiv_" + $("#_currentDiv").val();
    return curDiv;
}
function getMainBodyHTMLDiv$() {
    return $("#" + getMainBodyHTMLDiv());
}

//返回渲染过后的HTML代码
function getHTML(){
	return getMainBodyHTMLDiv$().html();
}

// 查看第几个正文
function viewContent(count) {
    var url = window.location + "";
    if (url.indexOf("&count") >= 0) {
        url = url.replace(/&count=\d*/g, "&count=" + count);
    } else {
        url = url + "&count=" + count;
    }
    window.location.href = url;
}

// 校验contentDomain中签章字段 是否为空
function checkHW(contentDomain) {
    var ret = true;
    var errorMsg = "";
    // 签章
    contentDomain.find("span[fieldval*='handwrite']").each(function() {
        // 找到表单中签章字段对应的input元素
        var id = $(this).attr("id").split("_")[0];
        var input = contentDomain.find("input[id='" + id + "']")[0];
        // 获取校验规则，是否有为空校验
        var validate = $.parseJSON("{" + $(input).attr("validate") + "}");
        if (validate.notNull) {
            if ($(this).find(".layout_flex_typesetting_sub").length==0) {
                errorMsg += validate.name+"不能为空";
                errorMsg += " ";
                ret = false;
            }
        }
    });
    // 关联表单
    contentDomain.find("span[relation]").each(function() {
        var curField = $(this).parent("span");
        var id = curField.attr("id").split("_")[0];
        var validate = $.parseJSON("{" + $(curField).find("#" + id).attr("validate") + "}");
        // 获取校验规则，是否有为空校验
        if (validate.notNull) {
        	if($.trim($(this).parent("span").find("span").eq(0)[0].innerHTML) == ""||"&nbsp;"==$.trim($(this).parent("span").find("span").eq(0)[0].innerHTML)){
                errorMsg += validate.name + $.i18n("validate.notNull.js") + "<br/>";
                ret = false;
            }
        }
    });
    // 附件 图片 关联文档
    contentDomain.find(".comp").each(function() {
        if ($(this).parent("span").hasClass("edit_class")) {// 首先判断编辑态
            var compParm = $.parseJSON("{" + $(this).attr("comp") + "}");
            if (compParm.notNull == "true") {
                var jqField = $(this).parent("span");
                var fieldVal = jqField.attr("fieldVal");
                if (fieldVal != undefined) {
                    fieldVal = $.parseJSON(fieldVal);
                    if (fieldVal.inputType == "attachment") {
                    	// 3.5 时附件和关联文档在一个控件，升级上来后，两种类型都有的单元格必填校验做兼容，不然流程提交不了
                        if(jqField.find("div[id^=attachmentArea]").children().length<=0 && jqField.find("div[id^=attachment2Area]").children().length<=0){
                            errorMsg+=fieldVal.displayName;
                            errorMsg += $.i18n("validate.notNull.js")+"<br/>";
                            ret = false;
                        }
                    } else if (fieldVal.inputType == "document") {
                        if (jqField.find("div[id^=attachment2Area]").children().length <= 0) {
                            errorMsg += fieldVal.displayName;
                            errorMsg += $.i18n("validate.notNull.js")+"<br/>";
                            ret = false;
                        }
                    } else if (fieldVal.inputType == "image") {
                        if (jqField.find("div[id^=attachmentArea]").children().length <= 0) {
                            errorMsg += fieldVal.displayName;
                            errorMsg += $.i18n("validate.notNull.js")+"<br/>";
                            ret = false;
                        }
                    }
                }
            }
        }
    });
    contentDomain.find(".editableSpan").each(function() {
        if ($(this).hasClass("edit_class")) {// 首先判断编辑态
            var fieldVal = $(this).attr("fieldVal");
            if (fieldVal != undefined) {
                fieldVal = $.parseJSON(fieldVal);
                if (fieldVal.inputType == "radio") {
                    if ($(this).find("input:radio[checked]").length <= 0) {
                        errorMsg += fieldVal.displayName;
                        errorMsg += $.i18n("validate.notNull.js") +"<br/>";
                        ret = false;
                    }
                }
            }
        }
    });

    //urlPage合法验证
    contentDomain.find("span[fieldval*='urlPage']").each(function() {
        var id = $(this).attr("id").split("_")[0];
        var input = contentDomain.find("#" + id)[0];
        var validate = $.parseJSON("{" + $(input).attr("validate") + "}");
        if (validate.func) {
            if (!validate.func($(input),validate)) {
                errorMsg +=validate.errorMsg;
                errorMsg += " ";
                ret = false;
            }
        }
    });

    if (!ret) {
        cmp.notification.alert(errorMsg,null,"提示","确定");
    }
    return ret;
}

/**
 * 获取表单正文中非隐藏的附件数据
 */
function getContentAttrs() {
    var atts = [];
    $("span[id$='_span']", $("#mainbodyDiv")).each(function() {
        var sp = $(this);
        if (sp.hasClass("browse_class") || sp.hasClass("edit_class")) {
            var fieldVal = sp.attr("fieldVal");
            var idStr = sp.attr("id").split("_")[0];
            if (fieldVal != undefined) {
                fieldVal = $.parseJSON(fieldVal);
                if (fieldVal.inputType == 'attachment') {
                    var attCompDiv = sp.find(".comp");
                    if (attCompDiv.length > 0) {
                        var subReferenceId = attCompDiv.find("#" + idStr).val();
                        var fieldAttsData = attCompDiv.attr("attsData");
                        if (fieldAttsData != null) {
                            fieldAttsData = $.parseJSON(fieldAttsData);
                            if (fieldAttsData != null && fieldAttsData.length > 0) {
                                for ( var i = 0; i < fieldAttsData.length; i++) {
                                    if (fieldAttsData[i].subReference == subReferenceId) {
                                        atts.push(fieldAttsData[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return atts;
}

/**
 * 正文组件打印接口实现。
 * 
 * @param {String}
 *                preBodyFragArr 正文前PrintFragment列表。
 * @param {String}
 *                afterBodyFragArr 正文后PrintFragment列表。
 * @param {String}
 *                printType office或表单格式时打印类型:mainpp 正文/colPrint 意见。
 * @param {String}
 *                printFrom 打印来自于哪： newCol 新建 、summary 协同详细页面。
 */
/*
 * $.content.print =
 * function(preBodyFragArr,afterBodyFragArr,printType,printFrom) { var curDiv =
 * getMainBodyHTMLDiv$(); var contentDiv = getMainBodyDataDiv$(); var
 * contentType = $("#contentType",contentDiv).val(); var printContent = '<div
 * id="inputPosition" style="width: 1px; height: 0px; border:0px solid;" ></div>';
 * var printComment = ''; var printCommentFragment = ''; var printFragment = '';
 * if(contentType == 10 && $("#viewState", contentDiv).val() == "1") { if
 * ($("#fckedit").attr("comp")) { printContent +=
 * $("#fckedit").getEditorContent(); } else { printContent +=
 * getMainBodyHTMLDiv$().html(); } }else if(contentType > 40 && contentType < 50 &&
 * printType=="mainpp") { officePrint(); return; }else { printContent +=
 * curDiv.html(); } printContent = cleanA(printContent);
 * 
 * var printFragmentList = new ArrayList(); for(var i=0;i<preBodyFragArr.size();i++){
 * if (preBodyFragArr.get(i) != "undefined" && preBodyFragArr.get(i) !=
 * undefined) { printFragmentList.add(preBodyFragArr.get(i)); } } var i = 0; if
 * (printFrom == "template") { if (afterBodyFragArr.get(i) != "undefined" &&
 * afterBodyFragArr.get(i) != undefined) {
 * printFragmentList.add(afterBodyFragArr.get(i)); } i = 1; }
 * 
 * if(printType != "colPrint"){//office格式时不打印正文 if(printFrom === "summary" &&
 * (contentType == 20 || contentType == '20')){ printFragment = new
 * PrintFragment("${ctp:i18n('collaboration.colPrint.mainBody')}",
 * printContent); }else if(printFrom == "template"){ printFragment = new
 * PrintFragment("${ctp:i18n('collaboration.colPrint.mainBody')}",
 * printContent); }else{ printFragment = new PrintFragment("", printContent); }
 * printFragment.dataHtml = printFragment.dataHtml.replace("undefined","");
 * printFragmentList.add(printFragment); }
 * 
 * for(i;i<afterBodyFragArr.size();i++){ if (afterBodyFragArr.get(i) !=
 * "undefined" && afterBodyFragArr.get(i) != undefined) {
 * printFragmentList.add(afterBodyFragArr.get(i)); } } if($("#viewState",
 * contentDiv).val() != "1" || printFrom === "summary"){ //原意见（转发） var forwards =
 * $("#comment_forward_region"); var forwardsNum = forwards.length;
 * if(typeof(forwardsNum) !== "undefined" && forwardsNum>0){ var
 * printForward=""; for(var i=0;i<forwardsNum;i++){
 * printForward+=forwards[i].outerHTML; } printForwardFragment = new
 * PrintFragment("${ctp:i18n('collaboration.colPrint.oldOpinion')}",
 * printForward); printFragmentList.add(printForwardFragment); } //附言 var
 * printColOpinion = "${ctp:i18n('collaboration.forward.postscript')}"; //附言 var
 * colOpinion = ''; var sendOpinionFrag = ""; if(printFrom !== "template"){
 * colOpinion = ($("#replyContent_sender .title").html()); colOpinion
 * +=($("#replyContent_sender #replyContent_sender_content").html());
 * sendOpinionFrag =new PrintFragment(printColOpinion, colOpinion);
 * printFragmentList.add(sendOpinionFrag); }
 * 
 * //处理意见 if(printFrom!=="template"){ printComment +=
 * cleanA($("#currentComment").html()); printCommentFragment = new
 * PrintFragment("${ctp:i18n('collaboration.colPrint.handleOpinion')}",
 * printComment); printFragmentList.add(printCommentFragment); }
 *  } var styleDatas = new ArrayList(); printList(printFragmentList,
 * styleDatas); };
 */
var ctpMainbodyManager ={};
/*
 * $.content.switchContentType = function(mainbodyType,successCallback) { var
 * confirm = ""; var contentDiv = getMainBodyDataDiv$(); var alreadyId ="";
 * alreadyId = $("#id",contentDiv).val(); confirm = $.confirm({ 'msg':
 * $.i18n('content.switchtype.message'), ok_fn: function () { var curDiv =
 * getMainBodyHTMLDiv$(); var contentDiv = getMainBodyDataDiv$();
 * if($("#contentType",contentDiv).val() == mainbodyType) { return; } var mgr =
 * new ctpMainbodyManager();
 * mgr.transContentNewResponse($("#moduleType",contentDiv).val(),$("#moduleId",contentDiv).val(),mainbodyType,"1",{
 * success: function(ret){ curDiv.html(ret.contentHtml);
 * contentDiv.fillform(ret); curDiv.comp(); if(alreadyId && alreadyId != ''){
 * $("#id",contentDiv).val(alreadyId); } } }); if(successCallback)
 * successCallback(); } }); };
 */

function cleanA(str) {
    var position = str.indexOf("<a>");
    if (position == -1) {
        return str;
    }
    var leftstr = str.substr(0, position - 1);
    var rightstr = str.substr(position);
    var nextposition = rightstr.indexOf("</a>");
    var laststr = rightstr.substr(nextposition + 4);
    return cleanSpecial(cleanA(leftstr + laststr));
}

/*
 * function _viewContentSwitch(id) {
 * $(event.srcElement).parent("li").parent("ul").find(".current").removeClass("current");
 * $(event.srcElement).parent("li").addClass("current");
 * getMainBodyHTMLDiv$().hide(); $("#mainbodyHtmlDiv_" + id).show();
 * $("#_currentDiv").val(id); }
 * 
 * $.content.getMainbodyChooser = function(toolbarId,defaultType,callBack) {
 * if(!toolbarId) toolbarId = "toolbar"; _mt_toolbar_id = toolbarId; var mtCfg =
 * []; if(contentCfg == null) { mtCfg = contentCfg.mainbodyTypeListJSONStr; }
 * var r = []; for(var i = 0;i < mtCfg.length;i++) { var mt =
 * mtCfg[i].mainbodyType; mtCfg[i].value = mt; mtCfg[i].id = "_mt_" + mt;
 * if(defaultType!=undefined&&defaultType!=""){ if(mt == defaultType){
 * mtCfg[i].disabled = true; _lastMainbodyType = mt; } }else if(i == 0) {
 * mtCfg[i].disabled = true; _lastMainbodyType = mt; } mtCfg[i].click =
 * function(){ var cmt = $(this).attr("value"); _clickMainbodyType = cmt;
 * if(callBack){ callBack(); }else{ $.content.switchContentType(cmt, function(){
 * if(_lastMainbodyType) $("#" + _mt_toolbar_id).toolbarEnable("_mt_" +
 * _lastMainbodyType); $("#" + _mt_toolbar_id).toolbarDisable("_mt_" + cmt);
 * _lastMainbodyType = cmt; }); } }; try{ if($.ctx.isOfficeEnabled(mt))
 * r.push(mtCfg[i]); }catch(e){} } return r; }; $.content.getContent =
 * function() { var contentDiv = getMainBodyDataDiv$(); var contentType =
 * $("#contentType", contentDiv).val(); if($("#viewState", contentDiv).val() ==
 * "1" && contentType == 10) { if($("#fckedit").attr("comp")){ return
 * $("#fckedit").getEditorContent(); }else{ return getMainBodyHTMLDiv$().html(); } }
 * return ""; }; $.content.setContent = function(content) { var contentDiv =
 * getMainBodyDataDiv$(); var contentType = $("#contentType", contentDiv).val();
 * if(contentType == 10) { if($("#viewState", contentDiv).val() == '1'){
 * if($("#fckedit").size()>0){ $("#fckedit").setEditorContent(content); }else{
 * getMainBodyHTMLDiv$().html(content); } }else{
 * getMainBodyHTMLDiv$().html(content); } } }
 */


