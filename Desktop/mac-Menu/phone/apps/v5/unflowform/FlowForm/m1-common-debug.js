
(function($) {

	getFormFinishInitedFlag = function(){
		var result = getCommandStr(C_iInvokeNativeCtrlCommand_getFormFinishInited, formInitedFlag);
        return returnResultToClient(result);

	};

    /*
     * =========================================== 获取表单数据相关
     * ===========================================
     */
    /**
     * 供M1客户端调用，获取表单数据
     */


    getFormResultFromWebView = function(checkResult) {
        var options = new Object();
        options.domains = getContentArea();
        var data = $("body").formobj(options);
        var signatureResultList = getSignatureResult();
        var len = signatureResultList.length;
        if(len > 0) {
        	for(var i = 0; i < len; i++) {
        		var signatureResult = signatureResultList[i];
        		var fieldName = signatureResult.FIELDNAME;

				var index = fieldName.indexOf("_");
				if (index != -1 && fieldName.indexOf("my:") != -1) {
					fieldName = fieldName.substring(index + 1);
					signatureResult.FIELDNAME = fieldName;
				}
				signatureResultList[i] = signatureResult;
        	}
            data.signatureResultList = signatureResultList;
        }
        var msignatureIds = $.toJSON(mSignatureDataCache);
        data.msignatureIds = msignatureIds;
		if(checkResult == false || checkResult =='false'){
			data.checkResult = false;
		} else {
			data.checkResult = true;
		}
        if(formWeakCheck&& formWeakCheck == true){
            data.formWeakCheck = true; //xinpei
            formWeakCheck = false;//将标识重置,避免重复提交时,标识还没有被重置
        }
        var result = getCommandStr(C_iInvokeNativeCtrlCommand_Result, data);
        return returnResultToClient(result);
    };

    getContentArea = function() {
        var contentData = [];
        contentData.push("_currentDiv");
        contentData.push(getMainBodyDataDiv());

        for ( var i = 0; i < form.tableList.length; i++) {
            var tempTable = $("#" + form.tableList[i].tableName);
            if (tempTable.length > 0) {
                contentData.push(form.tableList[i].tableName);
            }
        }

        return contentData;
    };

    /*
     * =========================================== 选人相关
     * ===========================================
     */
    /**
     * 选人命令实体
     *
     * @param fieldID
     *                控件ID
     * @param fieldName
     *                控件名称
     * @param recordID
     *                重复表行ID，如果不是重复表，该字段值为空字符串""
     * @param selectType
     *                选择类型
     *                <ul>
     *                <li>"Member"=选择人</li>
     *                <li>"Department"=选择部门</li>
     *                <li>"Account"=选择单位</li>
     *                <li>"Post"=选择岗位</li>
     *                <li>"Level"=选择职务级别</li>
     *                </ul>
     * @param isMulti
     *                是否多选
     * @param value
     *                初始化数据，保存了表单中已经选中的数据，如果没有初始化数据则返回空数组
     * @returns {MChoosePersonResult}
     */
    MChoosePersonCommandObject = function(fieldID, fieldName, recordID, selectType, isMulti, value,maxSize) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.selectType = selectType;
        this.isMulti = isMulti;
        this.value = value;
        this.maxSize = maxSize;
        this.classType = "MChoosePersonCommandObject";
    };
    /**
     * 选人结果对象
     *
     * @param orgID
     *                对象ID
     * @param name
     *                对象名称
     * @param type
     *                对象类型
     *                <ul>
     *                <li>"Member"=人</li>
     *                <li>"Department"=部门</li>
     *                <li>"Account"=单位</li>
     *                <li>"Post"=岗位</li>
     *                <li>"Level"=职务级别</li>
     *                </ul>
     * @returns {MChoosePersonResult}
     */
    MChoosePersonResult = function(orgID, name, type) {
        this.orgID = orgID;
        this.name = name;
        this.type = type;
        this.classType = "MChoosePersonResult";
    };

    /**
     * 解析PC端选人结果传值字符串并转换成M1的对象，PC端选人结果传值如：Department|100021212012218,Department|100021212012218
     *
     * @param resultStr
     *                PC端选人结果传值
     */
    parseChoosePersonResult = function(options) {
        var valueStr = options.params.value;
        var textStr = options.params.text;

        var result = new Array();
        if (valueStr != "") {
            var typeAndIDStrArray = valueStr.split(",");
            var nameArray = textStr.split("、");
            for ( var i = 0; i < typeAndIDStrArray.length; i++) {
                var typeAndIDStr = typeAndIDStrArray[i];
                var typeAndIDArray = typeAndIDStr.split("\|");
                var orgID = typeAndIDArray[1];
                var name = nameArray[i];
                var type = typeAndIDArray[0];
                var p = new MChoosePersonResult(orgID, name, type);
                result.push(p);
            }
        }
        return result;
    };

    /**
     * 调用M1本地控件进行选人
     *
     * @param options
     *                PC端传入的选人相关参数
     */
    choosePersonFromClient = function(options, eventObj) {
        var fieldID = options.id;
        var fieldName = fieldID.replace("_txt", "");
        var recordID = getRecordIdByJqueryField(eventObj);
        var selectType = options.selectType;
        var maxSize = options.maxSize || 1;
        var isMulti = maxSize > 1 ? true : false;
        var initValue = parseChoosePersonResult(options);

        var commandValue = new MChoosePersonCommandObject(fieldID, fieldName, recordID, selectType, isMulti, initValue, maxSize);

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChoosePerson, commandValue);
        requestClientWithParameter(commandStr);
    };
    sendChoosePersonResultFromClient = function(returnValue) {
        var choosePersonResult = returnValue.value;
        var fieldID = returnValue.fieldID;
        var recordID = returnValue.recordID;
        var fieldName = returnValue.fieldName;
        var value = "";
        var text = "";
        var len = choosePersonResult.length;
        if (len > 0) {
            for ( var i = 0; i < len; i++) {
                text += choosePersonResult[i].name;
                value += choosePersonResult[i].type + "|" + choosePersonResult[i].orgID;
                if (i != len - 1) {
                    text += "、";
                    value += ",";
                }
            }
        }

        var input = null;
        if (recordID == 0) {
            input = $("[id=" + fieldID + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            input = tr.find("[id=" + fieldID + "]");
        }

        var valueInput = input.next();
        input.val(text);
        valueInput.val(value);

        // 将中间选择的结果记录到comp中，避免再次调用.comp方法回到初始状态
        var tc = input.attr("comp");
        if (tc) {
            var tj = $.parseJSON('{' + tc + '}');
            tj.value = value;
            tj.text = text;
            var com = $.toJSON(tj);
            input.attr("comp", com.substring(1, com.length - 1));

            if (tj.callback && tj.callback.name == "selectOrgCallBack") {
                if(len >0 && len <= 1) {
                    fileMemberFieldRelation(tj, choosePersonResult[0].orgID, recordID, fieldName);
                } else if(len > 1){
					fileMemberFieldRelation(tj, value, recordID, fieldName); 
                }else{
					fileMemberFieldRelation(tj, "0", recordID, fieldName);
				}
            }
        }

        if(input.attr("onblur") == "calc(this);") {
            calc(input);
        }
    };

    fileMemberFieldRelation = function(options, value, recordID, fieldName) {
        var params = new Object();
        if (value != "") {
            params['orgId'] = value;
        } else {
            return;
        }
        // 非主表字段需要传递recordId
        if (!options.isMasterField) {
            params['recordId'] = recordID;
        } else {
            params['recordId'] = '0';
        }
        // 当前选人单元格fieldName
        params['fieldName'] = fieldName;
        params['rightId'] = $("#rightId").val();
        params['formId'] = form.id;
        params['formDataId'] = $("#contentDataId").val();
        var tempFormManager = new mFormAjaxManager();
        params['selectType']= options.selectType;
        tempFormManager.dealMemberFieldRelation(params, {
            success : function(_obj) {
                var returnObj = _obj;// $.parseJSON(_obj);
                if (returnObj.success == "true" || returnObj.success == true) {
                    formCalcResultsBackFill(returnObj.results);
                } else {
                    $.alert(returnObj.errorMsg);
                }
                return;
            }
        });
    };

    /*
     * =========================================== 追加控件
     * ===========================================
     */
    MAppendTextCommandObject = function(fieldID, fieldName, recordID, value, maxLen, initValue) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.value = value;
        this.maxLen = maxLen;
        this.initValue = initValue;
        this.classType = "MAppendTextCommandObject";
    };

    appendTextFromClient = function(targetArea) {
        var jqObj = $(targetArea);
        var fieldID = jqObj.attr("id");
        var recordID = getRecordIdByJqueryField(jqObj);

		var validateObj;
		var maxLen = null;
		try{
			validateObj = $.parseJSON("{"+jqObj.attr("validate")+"}");
			maxLen = parseInt(validateObj.maxLength);
		}catch(e){}

        var commandValue = new MAppendTextCommandObject(fieldID, fieldID, recordID, "", maxLen, jqObj.val());

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_AppendText, commandValue);
        requestClientWithParameter(commandStr);
    };

    sendAppendTextResultFromClient = function(returnValue) {
        var value = returnValue.value;
        var fieldID = value.fieldID;
        var recordID = value.recordID;

        var input = null;
        if (recordID == 0) {
            input = $("[id=" + fieldID + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            input = tr.find("[id=" + fieldID + "]");
        }

        var currentDate = new Date();
        var dateStr = currentDate.getFullYear() + "-";
        dateStr = dateStr + (currentDate.getMonth() + 1) + "-";
        dateStr = dateStr + currentDate.getDate() + " ";
        dateStr = dateStr + currentDate.getHours() + ":";
        dateStr = dateStr + currentDate.getMinutes();

        addedText = value.value + "[" + currentUser.orgName + " " + dateStr + "]";
        var result = "";
        if($.trim(input.val()) == "") {
            result = addedText;
        } else {
            result = input.val() + "\n" + addedText;
        }

        input.val(result);
		calc(input);
    };

    /*
     * =========================================== 选日期/时间
     * ===========================================
     */

    /**
     * @param fieldID
     *                控件ID
     * @param fieldName
     *                控件名称
     * @param recordID
     *                重复表行ID，如果不是重复表，该字段值为空字符串""
     * @param type
     *                日期时间选择类型,1表示选择日期，2表示选择时间
     */
    MChooseDateCommandObject = function(fieldID, fieldName, recordID, type, value, format) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.type = type;
        this.value = value;
        this.format = format;
        this.classType = "MChooseDateCommandObject";
    };

    chooseDateFromClient = function(options) {
        var input = $(options.inputField);
        var config = $.parseJSON('{' + input.attr("comp") + '}');
        var fieldID = input.attr("id");
        var fieldName = input.attr("name");
        var recordID = getRecordIdByJqueryField(input);
        var isTime = config.showsTime ? C_iChooseDateType_Time : C_iChooseDateType_Date;
        var initValue = input.val();
        var format = config.ifFormat;

        var commandValue = new MChooseDateCommandObject(fieldID, fieldName, recordID, isTime, initValue, format);

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChooseDate, commandValue);
        requestClientWithParameter(commandStr);
    };

    sendChooseDateResultFromClient = function(returnValue) {
        var value = returnValue.value;
        var fieldID = returnValue.fieldID;
        var recordID = returnValue.recordID;

        var input = null;
        if (recordID == 0) {
            input = $("[id=" + fieldID + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            input = tr.find("[id=" + fieldID + "]");
        }

        input.val(value);
        if(input.attr("incalculate") == "true" || input.attr("incondition")=="true") {
            calc(input);
        }
        var inputSpan = input.parent("span[id$=_span]");
        var fieldVal = $.parseJSON(inputSpan.attr("fieldval"));
        var formatType = fieldVal.formatType;
        if(formatType&&formatType.length > 0){ //适配中文格式-----辛裴
            valueDateInputOnclose(input);
        }
    };

    /*
     * =========================================== 附件/图片方法
     * ===========================================
     */
    var attResultMapper = null;
    /**
     * 表单文件对象
     *
     * @param id
     *                文件上传以后的ID
     * @param name
     *                文件的名称
     * @param localPath
     *                文件的本地路径，该属性只有的本地上传时有效
     */
    MFormAttachment = function(attID, name, localPath, mimeType, moduleType, type, size, createDate) {
        this.attID = attID;
        this.name = name;
        this.localPath = localPath;
        this.mimeType = mimeType;
        this.moduleType = moduleType;
        this.type = type;
        this.size = size;
        this.createDate = createDate;
        this.classType = "MFormAttachment";
    };

    /**
     * @param id
     *                控件ID
     * @param fieldName
     *                控件名称
     * @param recordID
     *                重复表行ID，如果不是重复表，该字段值为空字符串""
     * @param type
     *                文件上传类型，1表示选择文件，2表示选择图片
     * @param value
     *                文件选择的结果属性，该属性是一个数组，可以存放一个或多个MFormFile对象
     * @param attachmentAreaID
     *                附件的区域ID，没有就是空字符串
     */
    MChooseAttachmentCommandObject = function(fieldID, fieldName, recordID, type, value, attachmentAreaID) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.type = type;
        this.value = value;
        this.attachmentAreaID = attachmentAreaID || "";
        this.classType = "MChooseAttachmentCommandObject";
    };

    sendChooseFileResultFromClient = function(returnValue) {
        var type = returnValue.type;
        if (type == C_iChooseFileType_File || type == C_iChooseFileType_Pic) {
            handleAttUploadResult(returnValue);
        } else if (type == C_iChooseFileType_AssociateDocument) {
            handleAssocResult(returnValue);
        }
    };

    handleAttUploadResult = function(returnValue) {
        if(attResultMapper == null) {
            attResultMapper = new Map();
        }
        var value = returnValue.value;
        var attachmentAreaID = returnValue.attachmentAreaID;
        var fieldID = returnValue.fieldID;
        var type = returnValue.type;
        var recordID = returnValue.recordID;

        var len = value.length;
        var showImage = "";
        if(type == C_iChooseFileType_Pic) {
            showImage = "true";
        }

        if(len && len > 0) {
            for(var i = 0; i < len; i++) {
                var att = value[i];
                addAttachmentPoi("0", att.name, att.mimeType, att.createDate, att.size, att.attID, true, false,
                        "", null,"", attachmentAreaID, null, null, null, null, fieldID, null, null,null, null, showImage);
                var attData = getLocalPathAttData(att, type);
                attResultMapper.put(att.attID, attData);
            }
        }

        var spanID = fieldID + "_span";
        var spanArea = null;
        if (recordID == 0) {
            spanArea = $("[id=" + spanID + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            spanArea = tr.find("[id=" + spanID + "]");
        }

        var compDiv = spanArea.find(".comp");
        var tc = compDiv.attr("comp"), tj;
        if (tc) {
          tj = $.parseJSON('{' + tc + '}');
          renderAttachmentField(spanArea, tj, attResultMapper);
          attResultMapper = null;
        }
    };

    function checkImgNumForM1(fieldObj){
        var dispDiv = fieldObj.find("div[id^='attachmentArea']");
        var dispblock = dispDiv.find(".attachment_block");
                var imgNum = dispblock.length;
                if(imgNum>0){
                        return false;
                }
                return true;
    }

    renderAttachmentField = function(spanArea, tj, attResultMapper) {
		if(spanArea) {

            var showImage = tj.isShowImg;
            var uploadSpan = null;
            if(showImage) {
                uploadSpan = spanArea.find("span[onclick^=insertImage]");
            } else {
                uploadSpan = spanArea.find("span[onclick^=insertAttachmentPoi]");
            }
            var classStr = uploadSpan.attr("class");
            var hiddenEditInput = uploadSpan.find("input");
            var fieldName = tj.embedInput;
            if(typeof fieldName != "undefined") {
                var attachemntArea = tj.attachmentTrId;

                var operateICON = "ic_form_attach.png";
                var type = C_iChooseFileType_File;
                var findKeyWord = "a[href*='/fileDownload.do'],a[href*='/fileUpload.do?method=download']";
                if(showImage) {
                    type = C_iChooseFileType_Pic;
                    operateICON = "ic_form_picture.png";
                    findKeyWord = "img[src*='/fileUpload.do?method=showRTE']";
                }
			
				 if(typeof(style)!= "undefined" && style=="4"){
				 uploadSpan.removeAttr("onclick");
                 var attachmentAreaDiv = spanArea.find("div[id^=attachmentArea]");
                 setAttachmentAreaPosition(attachmentAreaDiv,uploadSpan);//TODO 添加调整按钮和显示区域的位置的方法 辛裴2015-08-07 16:27
				 $(uploadSpan).unbind("click").bind("click", function(){
                          chooseFileButtonEvent($(this),fieldName, fieldName,type, attachemntArea,showImage);
                       });
				 } else {
					var uploadSpanM1 = $("<span><a><img src=\"" + operateICON + "\"/></a></span>").bind(
                        "click",
                        function(){
                           chooseFileButtonEvent($(this),fieldName, fieldName,type, attachemntArea,showImage);
                        }).attr("class", classStr).removeClass("ico16");
					uploadSpanM1.append(hiddenEditInput);
					uploadSpan.replaceWith(uploadSpanM1);
				 }


                //初始化点击事件
                var attArea = spanArea.find("div[id^='attachmentArea']");
                var initAttDivList = attArea.children();
                var initAttDivLen = initAttDivList.length;
                for ( var i = 0; i < initAttDivLen; i++) {
                    var tmpAttDiv = $(initAttDivList[i]);
                    var eventA = tmpAttDiv.find(findKeyWord);
                    if(eventA.length > 0) {
                        addAttOpenEvent(eventA,showImage, attResultMapper);
                    }
                }
            }

            changBackGroundColor(spanArea);

        }
    };
    chooseFileButtonEvent = function(t,fieldName, fieldName,
				type, attachemntArea,showImage){
		var tmpParentSpan = getParentSpanByElement(t);//.parent("span");
		var tmpHiddenAttInput = tmpParentSpan.find("input[id='" + fieldName + "']");
		var recordID = getRecordIdByJqueryField(tmpHiddenAttInput);

		var initValue = [];
		if(showImage){
			var b = checkImgNumForM1(tmpParentSpan);
			if(!b) {
				initValue = [{}];
			}
		}
		var commandValue = new MChooseAttachmentCommandObject(fieldName, fieldName, recordID,
				type, initValue, attachemntArea);

		var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChooseFile, commandValue);
		requestClientWithParameter(commandStr);
	}
    addAttOpenEvent = function(eventArea, showImage, attResultMapper) {
        var hrefStr = eventArea.attr("href");
        eventArea.attr("href", "javascript:void(0);");
        if(showImage) {
            hrefStr = eventArea.attr("src");
            var newURL = adapterPicUrl(hrefStr);
            eventArea.attr("src", newURL);

        }

        var type = showImage ? C_iChooseFileType_Pic : C_iChooseFileType_File;

        var attData = getAttOpenData(hrefStr, type);
        if(typeof attResultMapper != "undefined") {
            attData = attResultMapper.get(attData.fileID);
            eventArea.attr("src", attData.localPath);
        }
        if(typeof style != "undefined" && style == "4") {
            renderAttachmentDisplayBox(eventArea,type);//TODO 用于附件和图片轻表单新样式的展现----辛裴 2015-08-12 19:37
        }else {
            if(!showImage) {
                var fileName = attData.fileName;
                var path = getFormICONPathByFileName(fileName);
                var icon = $("<img/>").attr("src",path);
                icon.insertBefore(eventArea);
            }
        }
        eventArea.attr("onclick","attOpenEvent("+ $.toJSON(attData) +")");
    };

    attOpenEvent = function(attDataStr) {
        var commandValue = attDataStr;
        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAttachment, commandValue);
        requestClientWithParameter(commandStr);
    };

    getAttOpenData = function(dataStr, type) {
        var fileID = "";
        var fileName = "";
        var createDate = "";
        var verifyCode = "";
        if (dataStr.length > 0) {
            var index = dataStr.indexOf("?");
            var paramStr = dataStr.substring(index + 1);
            var paramPairStrArray = paramStr.split("&");
            var len = paramPairStrArray.length;
            for ( var i = 0; i < len; i++) {
                var paramPair = paramPairStrArray[i].split("=");
                if (paramPair[0] == "fileId") {
                    fileID = paramPair[1];
                } else if (paramPair[0] == "filename") {
                    fileName = paramPair[1];
                } else if (paramPair[0] == "createDate") {
                    createDate = paramPair[1];
                } else if(paramPair[0] == "v") {
                	verifyCode = paramPair[1];
                }
            }
        }

        var file = fileUploadAttachments.get(fileID);
        if(file) {
	        if(fileName == "") {
	            fileName = file.filename;
	        }
	        if(verifyCode == "") {
	        	verifyCode = file.v || "";
	        }
        }
        var result = new MAttOpenParameter(fileID, fileName, createDate, "", "", type, verifyCode);
        return result;
    };

    getLocalPathAttData = function(att, type) {
        var result = new MAttOpenParameter(att.attID, att.name, "", att.localPath, "", type);
        return result;
    };

    renderFieldByParentSpan = function(parentSpan) {
        var fieldName = parentSpan.attr("id").replace("_span", "");
        var fieldValueStr = parentSpan.attr("fieldVal");
        if(fieldValueStr == undefined) return;
        var fieldValueObj = $.parseJSON(fieldValueStr);
        var inputType = fieldValueObj.inputType;

        var tmpInputType = fieldInputTypeMapper.get(fieldName);
        if (typeof tmpInputType != "undefined") {
            inputType = tmpInputType;
        }

        if (inputType == C_sFieldInputType_RelationForm) {
            renderRelationForm(fieldName);
        } else if (inputType == C_sFieldInputType_RelationProject) {
            renderRelationProject(fieldName);
        }
		if(typeof(style)!="undefined" && style == "4"){

			initGeneralControl();
		}

    };

    repeatLineFillBackM1 = function(currentNode) {
        var parentSpanArray = currentNode.find("span[fieldval]");
        var len = parentSpanArray.length;
        for ( var i = 0; i < len; i++) {
            renderFieldByParentSpan($(parentSpanArray[i]));
        }
    };

    adapterPicUrl = function(oldUrl) {
        var oldKey1 = "/fileUpload.do?method=showRTE&";
        var oldKey2 = "type=image";

        var newStr1 = m1FileDownloadURL;
        var newStr2 = "type=2";

        var result = oldUrl.replace(oldKey1,newStr1);
        result = result.replace(oldKey2,newStr2);
        // return result;
        if(oldUrl.indexOf("http")==-1){
            oldUrl=serverPath+oldUrl.replace("/seeyon","");
        }
        return oldUrl;
       // return oldUrl.replace("/fileUpload","/seeyon/fileUpload");
    };

    adapterAllNoBizPic = function() {
        var imgList = $("img[src*='/seeyon/fileUpload.do?method=showRTE&']");
        var len = imgList.length;
        for(var i = 0; i < len; i++) {
            var tmp = $(imgList[i]);
			var   imgParent = tmp;
			var height = imgParent.height();//TODO 表单模板logo图片显示问题---黄智翔
            if(height==0){
                height= imgParent.parent().height();
            }
			var width = imgParent.width();
            if(width==0){
                width= imgParent.parent().width();
            }
//			if(width<tmp.width()){
//				width=tmp.width();
//			}
//			if(height<tmp.height()){
//				height=tmp.height();
//			}
            if(tmp.closest("span[id^=field]").length>0){
                lbsclickImg(tmp);
            }
            var oldURL = tmp.attr("src");
			// TODO OA-109106微协同端，表单中拍照定位控件，在原样表单模式下查看，严重变形。
			tmp.width(width);//.height(height);
            oldURL = oldURL.replace("/seeyon", "");
            var newURL = adapterPicUrl(oldURL);
            tmp.attr("src", newURL);
			//TODO OA-109122微协同端，表单中图片枚举字段，点击还提示不允许穿透查看图片（图片枚举是枚举字段，正常应该没有穿透链接）。
			var siblings = tmp.siblings("input[type='radio']");
			if(siblings.length > 0){
				tmp.removeAttr('onclick');
			}

        }
    };

    renderAssocField = function(spanArea, tj) {
        if (spanArea) {
            var uploadSpan = spanArea.find("span[onclick^='quoteDocument']");
            var hiddenEditInput = uploadSpan.find("input");
            var fieldName = tj.embedInput;
            var attachemntArea = tj.attachmentTrId;
			if(typeof(style)!= "undefined" && style=="4"){
				uploadSpan.removeAttr("onclick");
				uploadSpan.removeClass("associated_document_16").removeClass("ico16").addClass("iconfont icon-mobanwendang").css("font-size","30px").css("color","#878787");
				var inputS = $("<input type='text' readonly='readonly' class='triangle'>");
			//	uploadSpan.append(inputS);
                var assocAreaDiv = spanArea.find("div[id^=attachment2Area]");
                setAttachmentAreaPosition(assocAreaDiv,uploadSpan);//TODO 用于调整关联文档选择按钮和关联文档显示区域的位置 辛裴2015-08-11 16:44
				uploadSpan.bind( "click",function() {
                       assocFieldButtonEvent($(this),fieldName,attachemntArea);
                    });

			 } else  {
				var uploadSpanM1 = $("<span><a><img src=\"ic_form_ass_doc.png\"/></a></span>").bind(
                    "click",
                    function() {
                       assocFieldButtonEvent($(this),fieldName,attachemntArea);
                    });
				 uploadSpanM1.append(hiddenEditInput);
				uploadSpan.replaceWith(uploadSpanM1);
			 }


            addAssocOpenEvent(spanArea);
            changBackGroundColor(spanArea);
        }
    };
	assocFieldButtonEvent = function(t,fieldName,attachemntArea){
	 var tmpParentSpan = getParentSpanByElement(t);//.parent("span");
	 var tmpHiddenAttInput = tmpParentSpan.find("input[id='" + fieldName + "']");
	 var recordID = getRecordIdByJqueryField(tmpHiddenAttInput);
	 var initValue = getAssocInitValue(fieldName, recordID);
	 var commandValue = new MChooseAttachmentCommandObject(fieldName, fieldName, recordID,
			C_iChooseFileType_AssociateDocument, initValue, attachemntArea);
	 var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChooseFile, commandValue);
	 requestClientWithParameter(commandStr);

	}
    addAssocOpenEvent = function(spanArea) {
        var attsData = spanArea.find("div[class='comp']").attr("attsdata");
        if (typeof attsData != "undefined") {
            var attList = $.parseJSON(attsData);
            if(attList != null && typeof attList != "undefined") {
                var len = attList.length;
                var assocDivMapper = getAssocDivMapper4AttList(spanArea);
                for ( var i = 0; i < len; i++) {
					  var att = attList[i];
                    var eventA = null;
                    if(att.fileUrl == null) {
	                    eventA = spanArea.find("a[onclick^='openDetailURL']");
                    } else {
                    	var attDivAreaID = "attachmentDiv_" + att.fileUrl;
                        var attDiv = spanArea.find("div[id='" + attDivAreaID + "']");
                        eventA = attDiv.find("a[onclick^='openDetailURL']");
                    }
                    bindAssocEvent(att, eventA);

                }
            }
        }
    };
    //spanArea.find("div[class='comp']").attr("attsdata");将此对象转换成Map
    getAssocDivMapper4AttList = function(attList){
    	var map = new Map();
    	for(var i = 0;i <attList.length;i++){
    		var att = attList[i];
    		var docResID = att.description;
            if(docResID == "") {
            	docResID = att.fileUrl;
            }
            map.put(docResID,att);
    	}
    	return map;
    };
    getAssocDivList = function(spanArea) {
    	var eventAList = spanArea.find("a[onclick^='openDetailURL']");
    	var eventALen = eventAList.length;
    	var result = new Array();
    	for(var i = 0; i < eventALen; i++) {
    		var eventA = $(eventAList[i]);
    		var dataStr = eventA.attr("onclick");
    		var keyID = getAssocKeyID(dataStr);
    		result.push(eventA);
    	};
    	return result;
    }

	getAssocKeyID = function(dataStr) {
	    var keyID = null;
	    if (dataStr.length > 0) {
	        var index = dataStr.indexOf("?");
	        var paramStr = dataStr.substring(index + 1);
	        var paramPairStrArray = paramStr.split("&");
	        var len = paramPairStrArray.length;
	        for ( var i = 0; i < len; i++) {
	            var paramPair = paramPairStrArray[i].split("=");
	            if (paramPair[0] == "docResId") {
	            	keyID = paramPair[1];
	            } else if(paramPair[0] == "affairId") {
	            	keyID = paramPair[1];
	            } else if (paramPair[0] == "id") {
	            	keyID = paramPair[1];
	            }
	        }
	    }
	    return keyID;
	};

    bindAssocEvent = function(att, eventA) {
        var commandValue = null;
        var mimeType = att.mimeType;
        //huangzhixiang-修改客户bug表单关联文档为文档中心关联协同时打不开-start
       // var affairID = att.fileUrl;//这里的affairID同时作为关联文档的文档ID，因为都是从同一个属性中取出来的
        //if(affairID == null) {
		//	affairID = att.description;
       // }
		var affairID = att.description;
		//huangzhixiang-修改客户bug表单关联文档为文档中心关联协同时打不开-end
        if (mimeType == C_sAssociateMimeType_Collaboration) {
            commandValue = new MAssocOpenParameter("-1", att.filename, "-1", affairID, C_iModuleType_Collaboration,
                    -1, att.createdate, "", att.size, att.reference, true);
        } else if (mimeType == C_sAssociateMimeType_Archive) {
			affairID = att.fileUrl;//huangzhixiang-修改客户bug表单关联文档为文档中心关联协同时打不开
            commandValue = new MAssocOpenParameter(affairID, att.filename, "-1", "-1", C_iModuleType_Archive, -1,
                    att.createdate, "", att.size, att.reference, true);
        } else if (mimeType == C_sAssociateMimeType_Edoc) {
            commandValue = new MAssocOpenParameter("-1", att.filename, "-1", affairID, C_iModuleType_EDoc, -1,
                    att.createdate, "", att.size, att.reference, true);
        } else if (mimeType == C_sAssociateMimeType_Meeting){
        	  commandValue = new MAssocOpenParameter("-1", att.filename,affairID, affairID, C_iModuleType_Meeting, -1,
                      att.createdate, "", att.size, att.reference, true);
    	}else {
            commandValue = new MAssocOpenParameter("-1", att.filename, "-1", "-1", -1, -1, att.createdate, "",
                    att.size, att.reference, false);
        }


        if (typeof eventA.attr("ready") == "undefined") {

			eventA.each(function(){
				var eventTmp = $(this);
				var newEventA = $("<a class=\"hand\" style=\"cursor: hand;font-size:12px;color:#007CD2;\"></a>");
				 newEventA.attr("onclick","assocOpenEvent("+ $.toJSON(commandValue) +","+$.toJSON(att)+")");
				newEventA.attr("ready", "ready").html(eventTmp.html());
				  eventTmp.replaceWith(newEventA);
                if(typeof style != "undefined" && style == "4") {//TODO 关联文档轻表单新样式的展现  辛裴2015-08-12 19:02
                    renderAttachmentDisplayBox(newEventA,C_iChooseFileType_AssociateDocument);
                }
			});



        }
    };

    assocOpenEvent = function(assocDataStr,att) {
        var commandValue = assocDataStr;
        if (commandValue.moduleType == C_iModuleType_Archive) {
            var archiveManager = new mFormAjaxManager();
            //archiveManager.getMArchiveByIDForForm(commandValue.archiveID, {
            //    success : function(objs) {
            //	    if(objs.createTime == null && objs.content == null) {
            //	    	dialogMsg("",getDialogMsg("m.doc.prompt.inexistence"), C_iDialogType_Top);
            //	    } else {
	         //       	if(objs.content.attContent != null) {
	         //       		commandValue.name = objs.content.attContent.title;
	         //       	} else {
	         //       		commandValue.name = objs.title;
	         //       	}
	         //           commandValue.sourceID = objs.sourceID;
	         //           commandValue.affairID = objs.affairID;
	         //           commandValue.type = objs.type;
	         //           commandValue.verifyCode = objs.verifyCode;
	         //           commandValue.createDate = parseDateForM1(objs.createTime);
	         //           var modifyDate = objs.modifyTime;
	         //           if(modifyDate == null) {
	         //               commandValue.modifyDate = commandValue.createDate;
	         //           } else {
	         //               commandValue.modifyDate = modifyDate;
	         //           }
            //            commandValue.att=att;
	         //           var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, commandValue);
	         //           requestClientWithParameter(commandStr);
	         //           }
            //    }
            //});
               commandValue.att=att;
               var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, commandValue);
               requestClientWithParameter(commandStr);
        } else {
            commandValue.att=att;
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, commandValue);
            requestClientWithParameter(commandStr);
        }
    };

    initRelationFormFields = function() {
    	var fieldList = getRelationFormFieldList();
    	var len = fieldList.length;
    	for(var i = 0; i < len; i++) {
    		var fieldName = fieldList[i];
    		fieldInputTypeMapper.put(fieldName, C_sFieldInputType_RelationForm);
    		renderRelationForm(fieldName);
    	}
    };
    getRelationFormFieldList = function() {
    	var result = [];
    	var tmpList = $("[onclick='showRelationList(this);']");
    	var len = tmpList.length;
    	for(var i = 0; i < len; i++) {
    		var tmp = $(tmpList[i]);
    		var fieldID = tmp.attr("name");
    		if(tmp.attr("relation") != undefined && fieldID != undefined) {
    			result.push(fieldID);
    		}
    		 //修改bug ios 客户端  选择关联表单的关联属性为复选按钮时，复选按钮单元格显示为小圆点
            if(clientType !='androidphone') {
            	var parentSpan = tmp.parent();
            	var t = parentSpan.find(":checkbox");
            	t.each(function(){
            		var width = $(this).width();
            		if(width < 13){
            			$(this).css("width","24px");
            		}
            	});

            }
    	}
    	return result;
    };

    renderRelationForm = function(fieldName) {
        var spanID = fieldName + "_span";
        var spanArea = $("[id=" + spanID + "]");
        rebindRelationFormEvent(spanArea);
    };

    renderReadOnlyRelationForm = function() {
        $("span[onclick^='showFormRelationRecord(this)']").each(function() {
            var currentObj = $(this);
		
			if(typeof(style)!= "undefined" && style=="4"){
				currentObj.removeClass();
				var parent= currentObj.parent();
				var id = parent.attr("id").replace("_span","");
				 parent.find("[id ='"+id+"']").unbind("click").bind("click",function(){
					showFormRelationRecord(currentObj);
				 });
			} else  {

				var showType = currentObj.attr("showtype");
				if (showType != "1") {
					currentObj.html("<a><img src=\"ic_form_ass_form.png\"/></a>");
				}
			}
			//TODO  OA-109186微协同端，协同待发列表中点击查看某一个表单流程，切换到原样表单模式，单据字段显示不全（模板如附件截图所示）。
			currentObj.removeClass("ico16");
			//TODO  end

			//TODO OA-109467M3Android端-M3Android端-关联表单流程名称字段图标显示了2个
			currentObj.children("span").removeClass("ico16")
			//TODO end

        });
    };

    renderOuterWriteFormEvent = function() {
    	var fieldList = getOuterWriteFieldList();
    	var len = fieldList.length;
    	for(var i = 0; i < len; i++) {
    		var tmp = fieldList[i];
    		var clickStr = tmp.attr("onclick");
    		var param1 = parseOuterWriteParam(clickStr);
    		param1.showType = "3";
    		param1.moduleType = 1;
    		param1.classType = "ShowRelationFormParam";

    		tmp.attr("onclick", "");
    		tmp.bind("click",{param:param1}, function(event){
    			var paramss = event.data.param;
    			var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowRelationFormRecord, paramss);
    	        requestClientWithParameter(commandStr);
    		});
    	}
    };

    parseOuterWriteParam = function(str) {
    	var result = new Object();
    	var param = parseMethodParam(str);
    	result.dataID = param[1].replace(/\'/g,"");
    	result.rightID = param[4].replace(/\'/g,"");
    	return result;
    };

    parseMethodParam = function(str) {
    	var result = new Array();
    	var start = str.indexOf('(');
    	var end = str.lastIndexOf (')');

    	if(start < end) {
    		var tmp = str.substring(start + 1, end);
    		result = tmp.split(",");
    	}

    	return result;
    };

    getOuterWriteFieldList = function() {
    	var obj = $("span[onclick^='showSummayDialog']");
    	var len = obj.length;
    	var result = [];
    	for(var i = 0; i < len; i++) {
    		var tmp = $(obj[i]);
    		var aClass = tmp.attr("class");
    		var feildVal = $.parseJSON(tmp.attr("fieldval"));
    		if(feildVal == undefined) {
    			continue;
    		}
    		var inputType = feildVal.inputType;
    		if(aClass == "browse_class" && inputType == "outwrite") {
    			result.push(tmp);
    		}
    	}
    	return result;
    };
    getOuterWriteFieldListBySpan = function(SpanArea) {
    	var obj = SpanArea.find("span[onclick^='showSummayDialog']");

    	return obj;
    };
    rebindRelationFormEvent = function(spanArea) {
        var eventSpan = spanArea.find("span[onclick^='showRelationList']");
        if (eventSpan.length > 0) {
			
			if(typeof(style)== "undefined" || style!="4"){
				var imagSpan = $("<img/>");
				imagSpan.attr("src","ic_form_ass_form.png");
				eventSpan.removeClass("ico16");
				imagSpan.css("height","16px");
				imagSpan.css("width","16px");
				//TODO OA-109530M3端，待办列表中查看如图所示的流程表单，切换到原样表单模式，关联流程表单名称字段显示了无流程的穿透图标。
				//eventSpan.html(imagSpan);
				//TODO  END
				eventSpan.attr("onclick","showRelationFormListM1(this);");
				 
			} else {
                //TODO   将关联表单的图标换成向右的箭头  辛裴2105-08-25 16:43
                var id = spanArea.attr("id").replace("_span","");
                var valueSpan = spanArea.find("span[id="+id+"]");
                valueSpan.css("width","85%").css("float","left").css("margin-top","3px").addClass("position_veri_center");
                eventSpan.removeClass().addClass("triangle").addClass("position_veri_center")
                    .css("float","left").css("width","15%").removeAttr("onclick").bind("click",function(){
                        showRelationFormListM1(this);
                    });

//				eventSpan.removeClass().addClass("accessory_show").removeAttr("onclick").bind("click", function() {
//					showRelationFormListM1(this);
//				});


			}
        }
        //TODO 何建良修改bug 61551 all,关联表单时设置了"显示已关联表单流程"，调用表单时，不能点击查看其他关联了同一数据的表单详情
        rebindRelationFormEventBySpan(spanArea);


    };
    // TODO  在span中替换 事件   author hejianliang
    rebindRelationFormEventBySpan = function(spanArea){
    	var showSummaryDialogEvent= getOuterWriteFieldListBySpan(spanArea);
    	var len = showSummaryDialogEvent.length;
    	for(var i = 0; i < len; i++) {
    		var tmp = showSummaryDialogEvent[i];
    		var clickStr = $(tmp).attr("onclick");
    		var param = parseOuterWriteParam(clickStr);
    		param.showType = "3";
    		param.moduleType = 1;
    		param.classType = "ShowRelationFormParam";
    		$(tmp).attr("onclick", "");
    		$(tmp).bind("click",{param:param}, function(event){
    			var paramss = event.data.param;
    			var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowRelationFormRecord, paramss);
    	        requestClientWithParameter(commandStr);
    		});
    	}
    	/*if(len >0) {
    		spanArea.children().css("height","auto");
    	}*/
    }
    getModuleTypeByMimeType = function(mimeType) {
        var result = C_iModuleType_Archive;
        if (mimeType == C_sAssociateMimeType_Collaboration) {
            result = C_iModuleType_Collaboration;
        } else if (mimeType == C_sAssociateMimeType_Archive) {
            result = C_iModuleType_EDoc;
        }
        return result;
    };

    getAssocInitValue = function(fieldName, recordID) {
        var assArray = new Array();
        var result = new Array;

        var inputField = null;
        if (recordID == 0) {
            inputField = $("[id=" + fieldName + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            inputField = tr.find("[id=" + fieldName + "]");
        }

        var attachmentAreaID = inputField.attr("value");
        var values = fileUploadAttachments.values().instance;
        var len = values.length;
        for ( var i = 0; i < len; i++) {
            var tmpAttObj = values[i];
            if(attachmentAreaID == tmpAttObj.showArea) {
                var attID = tmpAttObj.fileUrl;
                var name = tmpAttObj.filename;
                var localPath = "";
                var mimeType = tmpAttObj.mimeType;

                var moduleType = getModuleTypeByMimeType(mimeType);

                var attObj = new MFormAttachment(attID, name, localPath, mimeType, moduleType, -1, tmpAttObj.size,
                        tmpAttObj.createDate);
                result.push(attObj);
            }
        }
        return result;
    };

    handleAssocResult = function(returnValue) {
        var value = returnValue.value;
        var attachmentAreaID = returnValue.attachmentAreaID;

        var attdiv = "attachment2Area" + attachmentAreaID;
		var widthS = null;
        var len = value.length;
        if (len && len > 0) {
            deleteAllAttachment(2, $("#" + attdiv).attr("poi"));
            for ( var i = 0; i < len; i++) {
                var att = value[i];
				 var att2Area = $("#attachment2Area" + attachmentAreaID);
				if(typeof(style)!="undefined" && style == "4"){
					widthS = att2Area.width() ;
				}

                addAttachmentPoi(2, att.name, att.mimeType, att.createDate, att.size, att.attID, true, false,
                        att.attID, null, "", $("#" + attdiv).attr("poi"), "", "", null,widthS , $("#" + attdiv).attr(
                                "embedInput"));

                //添加事件

                var attDivAreaID = "attachmentDiv_" + att.attID;
                var attDiv = att2Area.find("div[id='" + attDivAreaID + "']");
                var eventA = attDiv.find("a[onclick^='openDetailURL']");
                if(eventA.length == 0) {
                    eventA = attDiv.find("a[class^='hand']");
                }

                var tmpAtt = new Object();
                tmpAtt.mimeType = att.mimeType;
                tmpAtt.filename = att.name;
                tmpAtt.fileUrl = att.attID;
                tmpAtt.createdate = att.createDate;
                tmpAtt.size = att.size;
                tmpAtt.reference = $("#contentDataId").val();
                bindAssocEvent(tmpAtt, eventA);
            }
        }
    };

    /*
     * =========================================== 渲染表单方法
     * ===========================================
     */

    /**
     * 文本
     */
    var C_sFieldInputType_Text = "text";

    /**
     * 附件
     */
    var C_sFieldInputType_Attachment = "attachment";

    /**
     * 图片
     */
    var C_sFieldInputType_Image = "image";

    /**
     * 关联表单
     */
    var C_sFieldInputType_RelationForm = "relationform";

    /**
     * 关联项目
     */
    var C_sFieldInputType_RelationProject = "project";

    /**
     * 流程处理意见
     */
    var C_sFieldInputType_Flowdealoption = "flowdealoption";


    var fieldInputTypeMapper = null;
	var m_documentType_ = "";


    renderFieldList = function() {
        if(typeof(style)!="undefined" && style == "4") {
            initRenderNotNullFields4LightForm()//TODO 初始化渲染必填项输入域的非空底色 辛裴2015-09-17 11:05
        }
    	initRelationFormFields();
    	initFlowdealFields();
    	renderOuterWriteFormEvent();
    	renderPenetrateRelationFormRecord();
    	renderExtendEvent();
		var reg=new RegExp("\\.","g");
		var versionNum = parseInt(version.replace(reg,""));
    	if(typeof m_documentType != "undefined" && versionNum >=560 ) {
			if(typeof m_contentType !="undefined" && m_contentType != m_documentType){
				m_documentType_ = "|" + m_contentType;
			} else {
				m_documentType_ = "|" + m_documentType;
			}
		}
		var  moveable1 = true;
		if(typeof pendingFlag != "undefined" && pendingFlag =="false"){
			moveable1 = false;
		}
		var protecteData = getFieldVals4hw();
    	if(typeof iSP != "undefined" && typeof summaryID  !="undefined") {
				if(typeof memberIsignaturKey != "undefined") {
					iSP.init(
						{
							fixed:false,
							isGet:true,
							crossDomain:proxyServerAddr + "/seeyon",
							encode:false,
							currentKeysn:memberIsignaturKey,
							//protectedData:protecteData,
							documentId:summaryID  + m_documentType_, //必须指定文档ID
							moveable:moveable1//是否可以移动签章

						}
					);
			} else   {
				iSP.init(
						{
							fixed:false,
							isGet:true,
							crossDomain:proxyServerAddr + "/seeyon",
							encode:false,
							//protectedData:protecteData,
							documentId:summaryID  + m_documentType_, //必须指定文档ID
							moveable:moveable1//是否可以移动签章

						}
					);
			
			}

    	}
    	enhanceThousandthEvent();
		//handleUrlPageForM1();
		if(typeof(style)!="undefined" && style == "4"){
			$("body>:first-child").removeAttr("style");
			handleLightFormForM1();
			initGeneralControl();
		}
		showInscribeSignetPic();

    };
	showInscribeSignetPic = function(){
	 var mFormAjax = new mFormAjaxManager();
		$("img[src ^='/seeyon/form/formData.do?method=showInscribeSignetPic']").each(function(){
			var currentImg = $(this);
			var imgStr = currentImg.attr("src");
			var parent = $(currentImg.parent()[0]);
			var height =parent.height();
			var width = parent.width();

			var  id = imgStr.split("&")[1].split("=")[1].trim();
			var params1 = {};
			params1.pid = id;
			//mFormAjax.showInscribeSignetPic(params1, {
            //success : function(_obj) {
			//		currentImg.attr("src",$(_obj)[0].value);
			//		return;
			//	}
			//});
            currentImg.attr("src",serverPath+ imgStr.replace("/seeyon",""));
			setTimeout(function(){
				var  imgWidth = currentImg.width();
				var  imgHeight = currentImg.height();
				if(imgWidth > width){
					currentImg.width(width);
				}
				if(imgHeight > height){
					currentImg.height(height);
				}

			},200);
		});
	}
	initGeneralControl = function(){
		$("input[ type ='checkbox']").each(function(){
			var cThis = $(this);
            //TODO 注释掉原来的复选框样式，添加复选框新样式 辛裴2015-08-18 23:40
//			if(cThis.parent('.mui-checkbox').length == 0){
//				if(cThis.attr('checked')){
//				   cThis.attr('checked',true);
//				}
//				var parent =$("<div class='mui-input-row mui-checkbox mui-left'/>")
//				cThis.attr("style","");
//				parent.height(30);
//				cThis.wrap(parent);
//				cThis.before($("<label></label>"));
//			}
            if(!cThis.hasClass("haveInitialized")) {
                renderCheckbox(cThis);//启用复选框新样式
            }

		});
		$("input[ type = 'radio']").each(function(){
			var cThis = $(this);
			if(cThis.hasClass("newStyle_select_radio")) return; //不初始化下拉组件中的radio
			if(cThis.parent('.mui-radio').length == 0){
				if(cThis.attr('checked')){
				   cThis.attr('checked',true);
				}
				cThis.attr("style","");
				var t = 	cThis.parent();
				var text = t[0].innerHTML;
				var parent =$("<div class='mui-table-view-cell mui-radio mui-left light_form_radio'/>");
				parent.append(text);
				t.replaceWith(parent);
			}
		});
		$("input [type ='text']").hasClass(".xdTextBox")
	}
    /*
     * =========================================== isignature
     * ===========================================
     */
    setMemberKey = function(obj) {
    	memberKey = obj;
    };
	 handleLightFormForM1 = function(){
		$("div[id = 'fixMemu_box']").remove();
		$("img[id ^= 'logo']").attr("src","logo.png");

		//默认展开重复表
    	 $(".light-form-repeatTableTitle").removeClass("light-form-repeatTableTitle-on").siblings("div.light-form-lines").show();
		 //折叠菜单
		$(".light-form-repeatTableTitle").toggle(
			function(){
				var offset = $(this).offset();
				$(this).addClass("light-form-repeatTableTitle-on").siblings("div.light-form-lines").hide();
				$(".light-form-toolbar").removeAttr("style");
				if ( clientType == C_sClientType_Iphone) {
					var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_repeatTableHandle, "false");
					requestClientWithParameter(commandStr);
				}
			},
			function(){
				var offset = $(this).offset();
				$(this).removeClass("light-form-repeatTableTitle-on").siblings("div.light-form-lines").show();
				if ( clientType == C_sClientType_Iphone) {
					var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_repeatTableHandle, "true");
					requestClientWithParameter(commandStr);
				}
			}
		);

    };
    //执行签章功能
    showSignatureButton = function(keySn,summaryID){
    	if(typeof iSP == "undefined") {
 		   return;
 	   }
    	var id;
    	var signDiv = $("body").find("div[id  ^= 'signDiv']");
		if(signDiv.length == 0){
			id = $("body").find("[id ^= 'field']").eq(0).attr("id");
		}  else {
			var trs = $("body").find("tr");
			for(var i= 0 ;i<trs.length;i++){
				var temp  =$(trs[i]);
				var length = temp.find("div[id ^= 'signDiv']").length;
				if(length == 0){
					id =temp.find("[id ^= 'field']").eq(0).attr("id");
					if(id){
						break;
					}
				}
			}

		}


 	   	//签章必须的参数
		var runSignatureParams={
			keySN:keySn,//签章服务的keysn,获取key文件名称,不包括后缀名,所有key文件存放在WEB-INF/key文件
			documentId:summaryID + m_documentType_,//文档ID
			documentName:"",//不是必须参数
			elemId:"newInputPosition",//指定定位的页面元素的id,不仅限div元素,所有html元素都可以.
			//autoCert:true,
			enableMove:true
			};
		var params={
			backGetPwd:true,//是否后台获取印章密码,跨域不支持
			protectedData:[],//跨域方式保护项不能过多
			runSignatureParams:runSignatureParams,//运行签章的参数
			callback:function(data){
				var signatureId = data.properties.signatureId;
				mSignatureDataCache.push(signatureId);
			}
			};
		//显示选择印章列表div窗口
		iSP.showGetSignatureByKey(params);

    };
    /**
     * 解决单选按钮 ios过大的问题
     */
    checkRadioHeight = function(){
    	if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
    		$("input[type = 'radio']").css("height","20px");
    	}
    };
    handleUrlPageForM1 = function(){
	    	$("iframe").each(function(){
	    		var frame = $(this);
	    		var src = frame.attr("src");
				if(typeof src == "undefined"){
					return;
				}
	    		var parent = frame.parent();
	    		var spanUrl = $("<span >"+ src +"</span>");
	    		spanUrl.attr("title",src);
	    		spanUrl.bind("click",function(){
	    			showUrlPage(src);
	    		});
	    		frame.replaceWith(spanUrl);


	    	});
    };
    //移除签章功能
    showRemoveSignatureButton  =function(){
    	if(typeof iSP == "undefined") {
			   return;
		   }
		var _signature =[];
		_signature.push(iSP.signatures[iSP.signatures.length-1]);//获取最后一个签章,放在数组里面
		//alert(jsonToString(_signature));//json转化成字符串
		var removeSignatureParam={
				"signatures":_signature//获取签章数据,指定获取那些印章,
				//,"callback":testFunction//删除签章回调方法,该参数不是必须,客户可以通过设置该属性和方法,接受验证结果,做自己的业务流程.
		};
		iSP.removeSignature(removeSignatureParam);
    };


    repleaceLbsInput = function(input,text,filedName) {
    	if (input.recordId == 0 || input.recordId == -1 ||input.recordId == '-1') {
            $("[id=" + input.filedId + "_txt]").remove();
        } else {
            var tr = $("[recordid=" + input.recordId + "]");
            tr.find("[id=" + input.filedId + "_txt]").remove();
        }
    	var spanRe = $("<span/>");
		spanRe.attr("id",filedName+"_txt");
		spanRe.addClass($(input).attr("class")).css("height","auto");
		var imgIcon = $("<img src ="+"'ic_form_location_l.png'" +"></img>");
		spanRe.append(imgIcon);
		spanRe.append(text +"    ");
		return spanRe;
    };
    addPhotoImg =function(tj,uploadSpanM1,input){
    	var attData = tj.attData;
    	if(attData){
    		var len = attData.length;
    		for(var i = 0;i<len;i++){
    			var data = attData[i];
                data.classType = "MAttOpenParameter";
    			var fileUrl = data.fileUrl;
    			var createdate = data.createdate;
    			var matches = createdate.match(/\d+/g);
    			var year = matches[0];
    			var month = matches[1];
    			var date = matches[2];
    			var img = $("<img/>");
                var deleteimg;
				//TODO OA-109331M3Android端-拍照定位在轻表单拍照后切换原样表单，加载非常慢  &showType=small&smallPX=100
    			var src=serverPath +  "/fileUpload.do?method=showRTE&fileId="+fileUrl+"&createDate="+year+"-"+month +"-"+date+"&type=image&showType=small&smallPX=100";
				//TODO end
    			img.attr("src",src);
                img.attr("onclick","attOpenEvent("+ $.toJSON(data) +")");
                input.val(tj.value);
                if(style == '4') {
                    deleteimg = $('<span class="iconfont icon-chahao" style="color:#48a0de;font-size:16px;"></span>');
                    renderPhotoDisplayBox(input,img,deleteimg);
                }else {
//                    deleteimg= $("<img/>");
					//TODO OA-109458M3端，表单中拍照定位控件，在新建或修改时，切换到原样表单中查看，显示超出单元格边线。
                    //img.attr("style","width: 85px;height:40px");
					//TOD  end
                    input.after(img);
//                    deleteimg.attr("src","ic_form_delete.png");
//                    img.after(deleteimg);
                }

//    			deleteimg.bind("click",function(){  //todo m3上原样表单不支持拍照定位控件，暂时屏蔽掉删除按钮
//    				img.remove();
//    				deleteimg.remove();
//    				input.val("");
//    				 var options = {};
//    				 options.lbsId = 0;
//    				 var tc = input.attr("comp");
//    				 if (tc) {
//    				 var tj = $.parseJSON('{' + tc + '}');
//    				 	options.isMasterField = tj.isMasterField;
//    				 	options.recordId = tj.referenceRecordId;
//    				 	options.filedId = tj.fieldName;
//    				 }
//    				 mapPointCallBack(options);
//    			});


    		}
    	}

    };
    lbsclickImg = function(img){
    	 var showImage= true;
    	//addAttOpenEvent(img,showImage);
    	  var hrefStr = img.attr("src");
    	  var type = C_iChooseFileType_Pic ;
    	  var attData = getAttOpenData(hrefStr, type);
    	  var fileName = attData.fileName;
    	  if(!fileName) {
    		  attData.fileName = "JPG.JPG";
    	  }
    	  img.attr("onclick","attOpenEvent("+ $.toJSON(attData) +")");

    }
    lbsPhotoLocationCheck = function(spanArea,tj,input) {

    	 var hiddenEditInput = spanArea.find("input");
    	 hiddenEditInput.hide();
    	 if(photoValidateCache){
     		photoValidateCache.push($(hiddenEditInput.eq(0)));
     	}
	    var img = "ic_form_photo.png";
        var fieldName = tj.fieldName;
        if(typeof fieldName != "undefined") {
            var attachemntArea = tj.value;
            var operateICON = "ic_form_photo.png";
            var type = C_iChooseFileType_Pic;
			var uploadSpanM1 ;
			if( typeof(style) =='undefined'  || style =='1') {
				uploadSpanM1 = $("<img src=\"" + operateICON + "\"/>").bind(
                    "click",
                    function(){
                        var tmpParentSpan = getParentSpanByElement($(this));//.parent("span");
                        var tmpHiddenAttInput = tmpParentSpan.find("input[id='" + fieldName + "']");
                        var recordID = getRecordIdByJqueryField(tmpHiddenAttInput);
                        repeatPhotoLocationImgShow =true;
                        var initValue = [];
                            var b = checkImgNumForM1(tmpParentSpan);
                            if(!b) {
                                initValue = [{}];
                            }
                        var commandValue = new MChooseAttachmentCommandObject(fieldName, fieldName, recordID,
                                type, initValue, attachemntArea);

                        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_PhotoLocation, commandValue);
                        requestClientWithParameter(commandStr);
                    });
				} else {
					uploadSpanM1 = $("<span  class='ic_photo_location_32' />").bind(
						"click",
						function(){
							var tmpParentSpan = getParentSpanByElement($(this));//.parent("span");
							var tmpHiddenAttInput = tmpParentSpan.find("input[id='" + fieldName + "']");
							var recordID = getRecordIdByJqueryField(tmpHiddenAttInput);
							repeatPhotoLocationImgShow =true;
							var initValue = [];
								var b = checkImgNumForM1(tmpParentSpan);
								if(!b) {
									initValue = [{}];
								}
							var commandValue = new MChooseAttachmentCommandObject(fieldName, fieldName, recordID,
									type, initValue, attachemntArea);

							var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_PhotoLocation, commandValue);
							requestClientWithParameter(commandStr);


//                            var img = $("<img>");
//                            var delImg = $("<span class='iconfont icon-chahao' style='color:#48a0de;font-size:16px;'></span>");
//                            img.attr("src","dddddd");
//                            renderPhotoDisplayBox(hiddenEditInput,img,delImg);
//                            delImg.bind("click",function(){
//                                delImg.parents("div.image_display_box").remove();
//                            });

						});
				}
            var hiddenSpan = $("<span/>");
            var span = uploadSpanM1.after(hiddenEditInput);
            if(style == '4') {
                setPhotoLocationIconPosition(spanArea,span);//TODO  开启图标按钮位置设置接口 辛裴2015-08-17 15:55
            }else {
                spanArea.append(span);
            }

         if(repeatPhotoLocationImgShow == true) {
        	 addPhotoImg(tj,uploadSpanM1,input);
         }


        }
    }
    lbsInputTypeCheck = function(jsonObj) {
    	var miniType = jsonObj.miniType;
    	/**
    	* 1:地图标注
    	* 2:签到记录
    	* 3:位置定位
    	* 4:拍照定位
    	*/
    	if(miniType == 1 || miniType =='1' ) {
    		return C_iInvokeNativeCtrlCommand_Marker;
    	} else if (miniType == 2 || miniType =='2') {
    		return C_iInvokeNativeCtrlCommand_Sign;
    	} else if (miniType == 3 || miniType =='3') {
    		return C_iInvokeNativeCtrlCommand_PositionLocation;
    	}  else if (miniType == 4 || miniType =='4') {
    		return C_iInvokeNativeCtrlCommand_PhotoLocation;
    	}
    }

    /*
     * =========================================== DEE
     * ===========================================
     */
    renderExtendEvent = function(){
    	var extend = $("[onclick^='extendEvent(']");
    	var len = extend.length;
    	for(var i = 0 ;i<len;i++){
    		var tempextendObj = extend[i];
			$(tempextendObj).removeClass();
    		var tempextendsparent=$(tempextendObj).parent();
    		var fieldval = tempextendsparent.attr("fieldVal");
        	var jsonObj = $.parseJSON(fieldval);
        	var tempimg = "";
        	 var recordId = getRecordIdByJqueryField($(tempextendObj));
        	 jsonObj.recordId =recordId;
        	var deeCommandType = extendInputTypeCheck(jsonObj);
        	var imglength = 0;
        	if(deeCommandType == C_iInvokeNativeCtrlCommand_exchangeDee){
        		tempimg = $("<img/>").attr("src","ic_form_exchange.png");
        		 imglength = tempextendsparent.find("img[src='ic_form_exchange.png']").length;
    		}else if (deeCommandType == C_iInvokeNativeCtrlCommand_queryDee){
    			tempimg = $("<img/>").attr("src","ic_form_search.png");
    			imglength = tempextendsparent.find("img[src='ic_form_search.png']").length;
    		}
        	if(imglength <1 && ( typeof(style) =='undefined'  || style =='1') ){
        		tempextendsparent.append(tempimg);
				tempimg.bind("click",{param:jsonObj}, function(event){
					var data = event.data.param;
					MDeeExchangeAndQueryFromClient(data);
				});
        	} else {
				$(tempextendObj).addClass("triangle").unbind("click").bind("click",{param:jsonObj}, function(event){
					var data = event.data.param;
					MDeeExchangeAndQueryFromClient(data);
				});


			}



    		tempimg ="";
    	}

    }
    /**
     * 判断DEE控件是查询控件还是选择控件
     */
   extendInputTypeCheck = function(jsonObj){
	   var inputType = jsonObj.inputType;
   	if(inputType!=""&&inputType!=null && inputType!=undefined){
   		if("exchangetask" == inputType){
   			return C_iInvokeNativeCtrlCommand_exchangeDee;
   		}else if ("querytask" ==inputType){
   			return C_iInvokeNativeCtrlCommand_queryDee;
   		}
   	}
   }
   /**
    * DEE控件消息体对象
    */
    MDeeExchangeAndQueryObject = function(formID,formFieldName,contentDataId,templateID,rightId,recordId,value){
    	this.formID = formID;
    	this.formFieldName=formFieldName;
    	this.contentDataId = contentDataId;
    	this.templateID = templateID;
    	this.rightId =rightId;
    	this.recordId =recordId;
    	this.value = value;
    	this.formFieldName =formFieldName;
    	this.classType = "MDeeExchangeAndQueryObject";

    }
    MLbsObject = function(formID,rightID,lbsId,miniType,canEdit,referenceRecordId,referenceFormId,
    		referenceFormMasterDataId,filedId,recordId){
    	this.formID = formID;
    	this.rightID=rightID;
    	this.lbsId = lbsId;
    	this.miniType = miniType;
    	this.canEdit = canEdit;
    	this.referenceRecordId =referenceRecordId;
    	this.referenceFormId = referenceFormId;
    	this.referenceFormMasterDataId =referenceFormMasterDataId;
    	this.filedId =filedId;
    	this.recordId = recordId;
    	this.classType= "MLbsObject";
    }
    mLbsResultObj = function(lbsId,canEdit,miniType,lbsLongitude,lbsLatitude,lbsAddr,lbsContinent,
    		lbsCountry,lbsProvince,lbsCity,lbsTown,lbsStreet,lbsNearAddress,lbsAddressCode,lbsAddressType
    		,referenceRecordId,referenceFormId,filedId,
    		referenceFormMasterDataId,recordId){

    	this.lbsId = lbsId;
    	this.canEdit = canEdit;
    	this.miniType = miniType ;
    	this.lbsLongitude=lbsLongitude;
    	this.lbsLatitude=lbsLatitude;
    	this.lbsAddr=lbsAddr;
    	this.lbsContinent=lbsContinent;
    	this.lbsCountry=lbsCountry;
    	this.lbsProvince=lbsProvince;
    	this.lbsCity=lbsCity;
    	this.lbsTown=lbsTown;
    	this.lbsStreet=lbsStreet;
    	this.lbsNearAddress=lbsNearAddress;
    	this.lbsAddressCode=lbsAddressCode;
    	this.lbsAddressType=lbsAddressType;
    	this.referenceRecordId =referenceRecordId;
    	this.referenceFormId = referenceFormId;
    	this.referenceFormMasterDataId =referenceFormMasterDataId;
    	this.filedId =filedId;
    	this.recordId = recordId;
    	this.classType="mLbsResultObj";


    }
    mLbsFromClient = function(obj) {
    	var formID =$("#contentTemplateId").val();
    	var id  =obj.value;
    	if(!id) {
    		id = -1;
    	}
    	var rightId = $("#rightId").val();
    	var commandType = lbsInputTypeCheck(obj);
    	var commandValue = new MLbsObject(formID,rightId,id,obj.miniType,obj.canEdit,
    			obj.referenceRecordId,obj.referenceFormId,obj.referenceFormMasterDataId,obj.fieldName,obj.recordId);
    	var commandStr = getCommandStr(commandType, commandValue);
    	requestClientWithParameter(commandStr);


    }
    /**
     * 生成DEE消息实体
     */
    MDeeExchangeAndQueryFromClient = function(obj){
    	var result = getCommandStr(C_iInvokeNativeCtrlCommand_NeedPreSubmit, true);
		requestClientWithParameter(result);
		setTimeout(function(){
			var formID =$("#contentTemplateId").val();
			var contentDataId = $("#contentDataId").val();
			var formFieldName = obj.name;
			var value = obj.value;
			var templateID = $("#moduleTemplateId").val();
			var rightId = $("#rightId").val();
			var deeCommandType = extendInputTypeCheck(obj);
			var recordId = obj.recordId;
			var commandValue = new MDeeExchangeAndQueryObject(formID,formFieldName,contentDataId,templateID,rightId,recordId,value);
			var commandStr = getCommandStr(deeCommandType, commandValue);
			requestClientWithParameter(commandStr);
		},500);

    };
    /**
     * 将数据选择结果填写在dee文本框中;
     */
    sendDeeDataFromClient = function(value){
    	if(value != undefined && value != null) {
    		var objsStr = value.value;
    		var fieldName = value.formFieldName;
    		var objs = $.parseJSON(objsStr);
    		calCallbck(objs);
    		/*tempimg = $("<img/>").attr("src","ic_form_exchange.png");
    		var  inputField = $("[id=" + fieldName + "]");
    		var tempextendsparent=$(inputField).parent();
    		var fieldval = tempextendsparent.attr("fieldVal");
        	var jsonObj = $.parseJSON(fieldval);
			var  imglength = tempextendsparent.find("img[src='ic_form_exchange.png']").length;
			if(imglength < 1){
				tempimg.bind("click",{param:jsonObj}, function(event){
					var data = event.data.param;
					MDeeExchangeAndQueryFromClient(data);
				})
				tempextendsparent.append(tempimg);
			} */
			renderExtendEvent();
    	}
    };
    enhanceThousandthEvent = function() {
    	var eventSourceObjList = $("[onblur*=formFieldThousandthFunctionBlur]");
    	var len = eventSourceObjList.length;
    	for(var i = 0; i < len; i++) {
    		var eventSourceObj = $(eventSourceObjList[i]);
    		var eventStr = eventSourceObj.attr("onKeyUp");
    		eventStr += ";displayInputOnblurM1(this,'##,###,###0',0)";
    		eventSourceObj.attr("onKeyUp", eventStr);
    	}
    };

    displayInputOnblurM1 = function(inp,formatType,digitNum){
        var jqInp = $(inp);
        jqInp.prev('input').val(parseFloat(jqInp.val()==''?'0.0':jqInp.val()).toFixed(digitNum));
    };

    /*
     * =========================================== 表单数据校验以及预提交，预提交包含在表单验证中
     * ===========================================
     */
    /**
     * 暂存待办
     */
    var C_iOperateType_ZCDB = 1;

    /**
     * 提交
     */
    var C_iOperateType_Submit = 2;

    /**
     * 暂存待办的表单校验错误
     */
    var C_iErrorType_ZCDB = 1;

    /**
     * 表单提交的校验错误
     */
    var C_iErrorType_Submit = 2;

    /**
     * 其他表单错误
     */
    var C_iErrorType_Other = 100;

    var formErrorCache = [];

    var verifyOK = [ 0, 0 ];

    /**
     * 客户端是否调用标志
     */
    var clientSign = false;
    /**
     * 表单弱校验（涉及到表单中的非空校验和强弱校验的混合，主要增加以下三个标识进行判断）
     */
    var formWeakCheck;//弱校验标识
    var errorForceCheckType;//表单校验类型
    var notNullCheck;//非空校验标识

    MFormError = function(errorMsg, errorType) {
        this.errorMsg = errorMsg;
        this.errorType = errorType;
    };

    cleanError = function() {
    	formErrorCache = [];
    };

    putError = function(error) {
        formErrorCache.push(error);
    };

    putErrorArray = function(errorArray) {
        var len = errorArray.length;
        for ( var i = 0; i < len; i++) {
            var cfeArray = errorArray[i];
            var clen = cfeArray.length;
            for ( var n = 0; n < clen; n++) {
                formErrorCache.push(cfeArray[n]);
                if(cfeArray[n].errorType == 2){
                    notNullCheck = false;
                }
            }
        }
    };

    isVerifyOK = function() {
        var ok = false;
        if (verifyOK[0] == 1 && verifyOK[1] == 1 && clientSign) {
            ok = true;
        }
        return ok;
    };

    setVerifyOK = function(index, status) {
        verifyOK[index] = 1;
        if (isVerifyOK()) {
            clientSign = false;
            var commandValue = getVerifyResult();
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_VerifyForm, commandValue);
            requestClientWithParameter(commandStr);
        }
    };

    getVerifyResult = function() {
        var errors = sortError();
        formErrorCache = [];
        verifyOK = [ 0, 0 ];
        return errors;
    };

    sortError = function() {
        var len = formErrorCache.length;
        var submitErrorArray = [];
        var zcdbErrorArray = [];
        var exsistErrorMapper = new Map();
        notNullCheck = checkNotNullCheck();
        for ( var i = 0; i < len; i++) {
            var error = formErrorCache[i];
            var errorMsg = error.errorMsg;
            if(errorMsg == null) {
                errorMsg = "";
            }
            errorMsg = errorMsg.replace("<br>","\r\n");
            if(!exsistErrorMapper.containsKey(errorMsg)) {
                //根据条件过滤非空校验或者弱校验的提示语-----xinpei
                if((error.errorType == 2 && !notNullCheck) || (error.errorType == 3 && notNullCheck)){
                    submitErrorArray.push(errorMsg);
//                    zcdbErrorArray.push(errorMsg);
                }else if(error.errorType == 1){  //校验为1的情况才将错误提交到暂存待办的错误里面
                    submitErrorArray.push(errorMsg);
                    zcdbErrorArray.push(errorMsg);
                }


                //根据条件过滤非空校验或者弱校验的提示语-----end
                exsistErrorMapper.put(errorMsg, "");
            }
        }

        var zcdbErrorMsg = "";
        var submitErrorMsg = "";
        if (zcdbErrorArray.length > 0) {
            zcdbErrorMsg = zcdbErrorArray.join("\r\n");
        }

        if (submitErrorArray.length > 0) {
            submitErrorMsg = submitErrorArray.join("\r\n");
        }

        var result = [];
        var submitError = new MFormError(submitErrorMsg, 2);
        var zcdbError = new MFormError(zcdbErrorMsg, 1);
        result.push(submitError);
        result.push(zcdbError);
        return result;
    };
    /**
     * 验证非空校验是否成功-----xinpei
     * @returns {boolean}
     */
    checkNotNullCheck = function(){
        var i = 0,j = 0, len = formErrorCache.length;
        var notNullResult = true;
        for(;i<len;i++){
            var error = formErrorCache[i];
            if(error.errorType == 2){
                notNullResult = false;
                break;
            }
        }
        for(;j<len;j++){
            var error = formErrorCache[j];
            if(notNullResult){
                if(error.errorType == 3 && errorForceCheckType == 2){
                    formWeakCheck = true;
                    break;
                }
            }
        }
        return notNullResult;
    };
    /**
     * 表单校验，校验包含了处理分支表单时候的表单数据预提交
     *
     * @param type
     *                表单处理类型
     * @param templateID
     *                模版ID，用于新建发送时检查模版是否可用
     */
    verifyForm = function(params) {
    	cleanError();
        templateID = params.templateID;
        setVerifyOK(1, 1);
		checkTemplateCanUse(templateID);
        var needPreSubmit = false;
        preSubmitData(verifyCallbck);
        if(form.formType == C_iFormType_ProcessesForm && $("input[id = 'viewState']").val() =="1") {
            needPreSubmit = true;
        } else {
            clientSign = true;
            setVerifyOK(0, 1);
        }

        var result = getCommandStr(C_iInvokeNativeCtrlCommand_NeedPreSubmit, needPreSubmit);
        return returnResultToClient(result);
    };

    verifyCallbck = function(objs) {
        if(typeof objs != "undefined") {
            if(objs.success == "false") {
                var errorMessageStr = objs.errorMsg;
                var errorMessage = $.parseJSON(errorMessageStr);
                if (errorMessage && errorMessage.ruleError) {
                    var formError = new MFormError(errorMessage.ruleError, 3);
                    putError(formError);
                    var fields = errorMessage.fields;
                    errorForceCheckType = parseInt(errorMessage.forceCheck);
                    if(errorForceCheckType == 2 && notNullCheck == true) formWeakCheck = true; //xinpei
                    for ( var i = 0; i < fields.length; i++) {
                        changeColor(fields[i]);
                    }
                } else {
                    var formError = new MFormError(errorMessage, 3);
                    putError(formError);
                }
            }
        }
        clientSign = true;
        setVerifyOK(0,1);
    };

    calCallbck = function(objs) {
    	var _objs = objs;
        if (_objs.success == "true" || _objs.success == true) {
        	//如果当前权限因为高级权限改变，则将改变后的权限id记录在页面中
            if(_objs.viewRight!=undefined&&$("#rightId").val()!=_objs.viewRight){
            	$("#rightId").val(_objs.viewRight);
            	$("#img").css("display", "none");
            }
            _objs = _objs.results;
            formCalcResultsBackFill(_objs);
        }else{
            $.alert(_objs.errorMsg);
        }
		//TODO  修改客户bug   当下拉菜单有计算事件时，回填后会将表单中的签章图标覆盖掉。
		htmlSignatureM1();
        renderFieldList();
		//handleUrlPageForM1();
    };

    /*
     * =========================================== 关联表单
     * ===========================================
     */
    /**
     * 流程表单
     */
    var C_iRelationFormType_Flow = 1;

    /**
     * 无流程表弟那
     */
    var C_iRelationFormType_InfoMgr = 2;

    /**
     * 基础信息
     */
    var C_iRelationFormType_BasicInfo = 3;

    MChooseRelationFormListCommandObj = function(fieldID, fieldName, recordID, type, params, initValue, toFormID) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.type = type;
        this.params = params;
        this.value = initValue;
        this.toFormID = toFormID;
        this.classType = "MChooseRelationFormListCommandObj";
    };

    showRelationFormListM1 = function(field) {

		 var inputField = $(field);
		//判断被关联表单是否已经被删除
		if(inputField.attr("toFormDel")==="true"){
			var msg = $.i18n("form.create.input.relation.label")+$.i18n("form.flowiddel.label");
			dialogMsg("",msg,1);
			return;
		}
        var fieldName = inputField.attr("name");
        var fieldID = fieldName;
        var type = inputField.attr("formType");
        var recordID = getRecordIdByJqueryField(inputField);
        var params = $.parseJSON(inputField.attr("relation"));
        params.recordID = recordID;
        params.contentDataId = $("#contentDataId").val();
        var initValue = "";

        var commandValue = new MChooseRelationFormListCommandObj(fieldID, fieldName, recordID, type, params, initValue,
                params.toRelationObj);

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChooseRelationForm, commandValue);
		//TODO  修改bug OA-92979android客户端，新建无流程表单添加关联表单后选择复制并新建，报错
		//var result = getCommandStr(C_iInvokeNativeCtrlCommand_NeedPreSubmit, true);
		//requestClientWithParameter(result);
		setTimeout(function(){
			requestClientWithParameter(commandStr);
		},300);

    };

    sendRelationFormResult = function(returnValue) {
        var value = returnValue.value;
        var fieldName = returnValue.fieldName;
        var recordID = returnValue.recordID || 0;
        var toFormId = value.toFormId;

        var inputField = null;
        if (recordID == 0) {
            inputField = $("[id=" + fieldName + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            inputField = tr.find("[id=" + fieldName + "]");
        }

        var tempFormManager = new mFormAjaxManager();
        var params = new Object();
        params['selectArray'] = value.selectArray;
        params['fieldName'] = fieldName;
        params['rightId'] = $("#rightId").val();
        params['toFormId'] = toFormId;
        params['fromFormId'] = form.id;
        params['recordId'] = recordID;
        params['fromDataId'] = $("#contentDataId").val();
        params['moduleId'] = summaryID;

        tempFormManager.dealFormRelation(params, {
            success : function(_obj) {
                var fp = inputField.parent("span").parent();

                fillBackRowData(_obj);
                fp.find("#"+inputField.attr("name")+"_span").find(".correlation_form_16").attr("hasRelatied",true);
				fp.find(".ico16").removeClass("ico16");
                //修改bug ios 客户端  选择关联表单的关联属性为复选按钮时，复选按钮单元格显示为小圆点
                if(clientType !='androidphone') {
                	var t = fp.find(":checkbox");
                	t.each(function(){
                		var width = $(this).width();
                		if(width < 20){
                			$(this).css("width","24px");
                		}
                	});
                }
            }
        });
    };

    showRelationFormRecord = function(data) {
        var commandValue = new Object();
        commandValue.showType = data.showType;
        commandValue.dataID = data.dataId;
        commandValue.rightID = data.rightId;
        commandValue.name = data.title;
        var moduleType = 1;
        var formType = data.formType;
        if (formType == 2) {
            moduleType = 37;
        } else if (formType == 3) {
            moduleType = 36;
        }
        commandValue.moduleType = moduleType;
        commandValue.classType = "ShowRelationFormParam";

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowRelationFormRecord, commandValue);
        requestClientWithParameter(commandStr);
    };

    renderPenetrateRelationFormRecord = function() {
    	var tmpList = $("[onclick^='showSummayDialog(']");
    	var len = tmpList.length;
    	for(var i = 0; i < len; i++) {
    		var tmpObj = $(tmpList[i]);
    		var tmpStr = tmpObj.attr("onclick");
    		var urlStr = getShowSummayDialogURLStr(tmpStr);
    		var paramArray = urlStr.split(",");
    		var summaryID = paramArray[1];
    		var rightID = paramArray[4];

    		var params = new Object();
    		params.dataID = summaryID.replace(/\'/g,"");
    		params.rightID = rightID.replace(/\'/g,"");
    		params.showType = "4";
    		params.moduleType = 1;
    		params.classType = "ShowRelationFormParam";

			tmpObj.attr("onclick", "");
			tmpObj.bind("click", {param:params},function(event){
				var params = event.data.param;
    			var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowRelationFormRecord, params);
    	        requestClientWithParameter(commandStr);
    		});
    	}
    };

	var C_sShowSummayDialog_Start = "showSummayDialog(";
	var C_sShowSummayDialog_End = "')";
	getShowSummayDialogURLStr = function(str) {
	    var result = null;
	    if(typeof str != "undefined" && str != "" && str != null) {
	        var start = str.indexOf(C_sShowSummayDialog_Start);
	        var end = str.lastIndexOf(C_sShowSummayDialog_End);
	        if(start != -1 && end != -1) {
	            start += C_sShowSummayDialog_Start.length;
	            result = str.substring(start,end);
	        } else {
	            result = str;
	        }
	    }
	    return result;
	};

    /*
     * =========================================== 关联项目
     * ===========================================
     */
    MChooseProjectCommandObj = function(fieldID, fieldName, recordID, initValue) {
        this.fieldID = fieldID;
        this.fieldName = fieldName;
        this.recordID = recordID;
        this.value = initValue;
        this.classType = "MChooseProjectCommandObj";
    };

    MChooseProjectResult = function(proID, proName) {
        this.proID = proID;
        this.proName = proName;
        this.classType = "MChooseProjectResult";
    };

    renderRelationProject = function(fieldName) {
        var spanID = fieldName + "_span";
        var spanArea = $("[id=" + spanID + "]");
        if(spanArea.length > 0) {
        	rebindRelationProjectEvent(spanArea);
        }
    };

    rebindRelationProjectEvent = function(spanArea) {
        var spanAreaID = spanArea.attr("id");
        var displayInputID = spanAreaID.replace("span", "txt");
        var eventSpan = spanArea.find("span");
        var displayInput = spanArea.find("input[id=" + displayInputID + "]");
        if (eventSpan.length > 0 && displayInput.length > 0) {
			 if(typeof(style)== "undefined" || style!="4"){
				eventSpan.html("<a><img src=\"ic_form_ass_project.png\"/></a>");
                 //------原样表单不支持关联项目选择--------
				//eventSpan.unbind("click").bind("click", function() {
				//	showRelationProjectListM1(this);
				//});
                //
				//displayInput.unbind("click").bind("click", function() {
				//	showRelationProjectListM1(this);
				//});
                 eventSpan.unbind("click");
                 displayInput.unbind("click");
			} else  {
				//spanArea.find("input").addClass("triangle").unbind("click").bind("click", function() {
				//	showRelationProjectListM1(this);
				//});
                 spanArea.find("input").unbind("click");
			}
        }
    };

    showRelationProjectListM1 = function(field) {
        var inputField = getParentSpanByElement($(field));//.parent("span");
        var fieldID = inputField.attr("id").replace("_span", "").replace("_txt", "");
        var fieldName = fieldID;
        var tmpHiddenAttInput = inputField.find("input[id='" + fieldName + "']");
        var recordID = getRecordIdByJqueryField(tmpHiddenAttInput);

        var inputField;
        var inputFieldDisplay;
        if (recordID == 0) {
            inputField = $("[id=" + fieldID + "]");
            inputFieldDisplay = $("input[id='" + fieldID + "_txt']");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            inputField = tr.find("[id=" + fieldID + "]");
            inputFieldDisplay = tr.find("input[id='" + fieldID + "_txt']");
        }

        var initProID = inputField.val();
        var initProName = inputFieldDisplay.val();
        var value = new MChooseProjectResult(initProID, initProName);

        var commandValue = new MChooseProjectCommandObj(fieldID, fieldName, recordID, value);

        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ChooseRelationProject, commandValue);
        requestClientWithParameter(commandStr);
    };

    sendRelationProjectResult = function(returnValue) {
        var value = returnValue.value;
        var fieldID = returnValue.fieldID;
        var recordID = returnValue.recordID;

        var inputField;
        var inputFieldDisplay;
        if (recordID == 0) {
            inputField = $("[id=" + fieldID + "]");
            inputFieldDisplay = $("input[id='" + fieldID + "_txt']");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            inputField = tr.find("[id=" + fieldID + "]");
            inputFieldDisplay = tr.find("input[id='" + fieldID + "_txt']");
        }

        inputField.val(value.proID);
        inputFieldDisplay.val(value.proName);
        chooseProjectCallBack(inputField);

    };

    /**
     * 由本地程序传入，对于有流程表单，moduleID表示summaryID，无流程表单选择时，moduleID表示dataID
     */
    getRelationResult = function(moduleID) {
        var formID = form.id;
        var selectResult = new Object();
        selectResult.masterDataId = formID;
        selectResult.subData = getRelationSubFormResult();

        var relationResult = new Object();
        relationResult.moduleID = moduleID;
        relationResult.selectResult = selectResult;
        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_GetRelationFormResult, relationResult);
        requestClientWithParameter(commandStr);
    };

    getRelationSubFormResult = function() {
        var subData = new Array();
        for ( var i = 0; i < form.tableList.length; i++) {
            var tempTable = form.tableList[i];
            if (tempTable.tableType.toLowerCase() === "slave") {
                var tempSubData = new Object();
                tempSubData.tableName = tempTable.tableName;
                var subDom = $("#" + tempTable.tableName);
                var tempSubArray = new Array();
                if (subDom) {
                    var allCheckedBox = $(":checkbox[checked][tableName='" + tempTable.tableName + "']");
                    if (allCheckedBox.length == 0) {
                        allCheckedBox = $(":checkbox[tableName='" + tempTable.tableName + "']:eq(0)");
                    }
                    allCheckedBox.each(function() {
                        tempSubArray.push($(this).val());
                    });
                }
                tempSubData.dataIds = tempSubArray;
                subData.push(tempSubData);
            }
        }
        return subData;
    };

    /*
     * =========================================== 流程节点意见控件
     * ===========================================
     */

    var isNeedDisableHiddenFunction = false;
    var C_sClassType_Add = "add_class";
    var C_sClassType_Edit = "edit_class";

    initFlowdealFields = function() {
    	var fieldList = getFlowdealFieldList();
    	var len = fieldList.length;
    	for(var i = 0; i < len; i++) {
    		var fieldName = fieldList[i];
    		renderFlowdealoption(fieldName);
    	}
    };
    getFlowdealFieldList = function() {
    	var result = [];
    	var tmpList = $("[fieldval*='inputType:\"flowdealoption\"']");
    	var len = tmpList.length;
    	for(var i = 0; i < len; i++) {
    		var tmp = $(tmpList[0]);
    		var fieldSpan = tmp.attr("id");
    		var fieldID = fieldSpan.replace("_span", "");
    		result.push(fieldID);
    	}
    	return result;
    };

    renderFlowdealoption = function(fieldName) {
        var inputArea = $("[id=" + fieldName + "]");
        inputArea.attr("readonly","readonly");

        var parentSpanID = fieldName + "_span";
        var parentSpan = $("[id=" + parentSpanID + "]");
        var classType = parentSpan.attr("class");

        if(C_sClassType_Add == classType || C_sClassType_Edit == classType) {
            isNeedDisableHiddenFunction = true;
        }
    };

    sendDisableHiddenFunction = function(){
        if(isNeedDisableHiddenFunction) {
            var commandValue = new Object();
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_FlowDealOpinion, isNeedDisableHiddenFunction);
            requestClientWithParameter(commandStr);
        }
    };

    /*
     * =========================================== 加载错误消息
     * ===========================================
     */
    sendSystError = function(options){
        //TODO
    };

    /*
     * =========================================== 工具方法
     * ===========================================
     */
    sendResult2WebView = function(returnValue) {
        var command = returnValue.command;
        if (command == C_iInvokeNativeCtrlCommand_ChoosePerson) {
            sendChoosePersonResultFromClient(returnValue.value);
        } else if (command == C_iInvokeNativeCtrlCommand_ChooseDate) {
            sendChooseDateResultFromClient(returnValue.value);
        } else if (command == C_iInvokeNativeCtrlCommand_ChooseFile) {
            sendChooseFileResultFromClient(returnValue.value);
        } else if (command == C_iInvokeNativeCtrlCommand_AppendText) {
            sendAppendTextResultFromClient(returnValue);
        } else if (command == C_iInvokeNativeCtrlCommand_ChooseRelationForm) {
            sendRelationFormResult(returnValue.value);
        } else if (command == C_iInvokeNativeCtrlCommand_ChooseRelationProject) {
            sendRelationProjectResult(returnValue.value);
        } else if (command == C_iInvokeNativeCtrlCommand_InitSignatureData || command == C_iInvokeNativeCtrlCommand_HandWrite) {
            sendSignatureResult(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_exchangeDee){
        	sendDeeDataFromClient(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_Marker) {
        	sendMapMarkerFromClient(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_PositionLocation) {
        	sendMapMarkerFromClient(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_Sign) {
        	sendMapSignFromClient(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_PhotoLocation) {
        	sendMapphotoFromClient(returnValue.value);
        } else if (command ==C_iInvokeNativeCtrlCommand_getHtmlSignatureData) {
        	initHtmlSignatureByClientReuslt(returnValue.value);

        }
    };
    sendMapMarkerFromClient = function(obj){
    	var id = obj.lbsId;
    	var addr = obj.lbsAddr;
        var tr;

    	if (obj.recordId == 0 || obj.recordId == -1 ||obj.recordId == '-1') {
            input = $("[id=" + obj.filedId + "]");
        } else {
            tr = $("[recordid=" + obj.recordId + "]");
            input = tr.find("[id=" + obj.filedId + "]");
        }

    	if(input) {
            var spanRe;
            if(typeof(style) !='undefined'  && style =='4'){//TODO  轻表单样式 辛裴2105-08-19
                var targetParent;
                if(tr){                       //TODO 修改轻表单重复表选择后的问题
                    targetParent = tr.find("[id=" + obj.filedId + "_span]");
                }else {
                    targetParent = $("[id=" + obj.filedId + "_span]");
                }
                spanRe = renderLbsInput(targetParent,obj,addr,obj.filedId);
            }else {
                spanRe = repleaceLbsInput(obj,addr,obj.filedId);
				spanRe.css("display","block").css("white-space","pre-wrap");
            }

			if(true){
				spanRe.bind("click",{param:input}, function(event){
                    $(this).blur();
					var data = event.data.param;
					mLbsFromClient(data);
				});

			}
			
			
			input.replaceWith(spanRe);
			input = spanRe;
    	}
    	hiddenInput = $('<input type="hidden" />');
		hiddenInput.attr("id",obj.filedId);
		hiddenInput.attr("name",obj.filedId);

		if(id) {
			hiddenInput.val(id);
		}
		input.after(hiddenInput);
    	mapPointCallBack(obj);

    };
    sendMapLocationFromClient = function(obj) {

    }
    sendMapSignFromClient = function(obj) {

    }
    sendMapphotoFromClient = function(obj) {
    	 if(attResultMapper == null) {
             attResultMapper = new Map();
         }
         var value = obj.value;
         var attachmentAreaID = obj.attachmentAreaID;
         var fieldID = obj.fieldID;
         var type = obj.type;
         var recordID = obj.recordID;
        var att = obj.value[0];
        var span;
        if (recordID == 0||recordID == -1 ||recordID=='-1') {
        	span = $("[id=" + fieldID + "]");
        } else {
            var tr = $("[recordid=" + recordID + "]");
            span = tr.find("[id=" + fieldID + "]");
        }

        var div =$("<div/>");
        var img =  $("<img/>").attr("src",att.localPath);
        var deleteimg;
        if(style == '4') {//TODO 添加新样式渲染接口 辛裴2015-08-17 19:36
            deleteimg = $('<span class="iconfont icon-chahao" style="color:#48a0de;font-size:16px;"></span>');
            renderPhotoDisplayBox(span,img,deleteimg);
        }else {
            var deleteimg= $("<img/>");
            deleteimg.attr("src","ic_form_delete.png");
            img.attr("style","width: 85px;height:40px");
        }
        span.val(att.attID);
        span.parent().find("img").each(function(){
            var src = $(this).attr("src");
            if(src != "ic_form_photo.png"){
                $(this).remove();
            }
        });
        img.attr("id",fieldID +"img");
		span.parent().find("img").each(function(){
			var src = $(this).attr("src");
			if(src != "ic_form_photo.png"){
				$(this).remove();
			}
		});

		img.bind("click",{param:att},function(event){
			var data = event.data.param;
			commandValue = getLocalPathAttData(data, type);
			   var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAttachment, commandValue);
		        requestClientWithParameter(commandStr);
		});
		deleteimg.bind("click",{param:obj}, function(event){
            event.stopPropagation(); //添加此，避免事件冒泡----辛裴 2015-08-17 19:45
			var data = event.data.param;
            var imgArea = deleteimg.parents("div.image_display_box");
			img.remove();
			deleteimg.remove();
            if(imgArea && imgArea.length > 0) {
                imgArea.remove();
            }
			var options = {};
			options.lbsId = 0;
			var tc = span.attr("comp");
		    if (tc) {
		    	var tj = $.parseJSON('{' + tc + '}');
		    	options.isMasterField = tj.isMasterField;
		    }
		    options.recordId = obj.recordID;
			options.filedId = data.fieldID;
			mapPointCallBack(options);
			var recordID = data.recordID;
			var fieldID = data.fieldID;
			 if (recordID == 0||recordID == -1 ||recordID=='-1') {
		        	var input = $("[id=" + fieldID + "]");
		        	input.val("");
		     } else {
		            var tr = $("[recordid=" + recordID + "]");
		          var  input = tr.find("[id=" + fieldID + "]");
		            input.val("");
		     }

		});
        if(style != '4') {//如果不是轻表单，则老样式显示
            span.after(img);
            img.after(deleteimg);
        }




		var options = {};
		options.lbsId = att.attID;
		var tc = span.attr("comp");
	    if (tc) {
	    	var tj = $.parseJSON('{' + tc + '}');
	    	options.isMasterField = tj.isMasterField;
	    }
	    options.recordId = obj.recordID;
		options.filedId = obj.fieldID;
		mapPointCallBack(options);

    }

    /*
     * =========================================== 模版检查
     * ===========================================
     */
    function checkTemplateCanUse(templateId) {
        if (templateId != "undefined") {
            var checkTemplateCanUseManager = new mFormAjaxManager();
            checkTemplateCanUseManager.checkTemplateCanUse(templateId, flowForm, {
                success : function(objs) {
                    var _objs = objs;
                    if (_objs.flag == 'cannot') {
                        var formError = new MFormError(_objs.message, 3);
                        putError(formError);
                    }
                    setVerifyOK(1, 1);
                }
            });
        } else {
            setVerifyOK(1, 1);
        }
    }

    /*
     * =========================================== 签章
     * C_iInvokeNativeCtrlCommand_InitSignatureData
     * ===========================================
     */
    htmlSignatureM1 = function() {
        if(needCheckNullField == null) {
            needCheckNullField = new Map();
        }
        var  signatureKey ="";
        if(typeof(params)=="undefined"){
            signatureKey ='m3_v5_cmp_form_signature_' + parent.params.moduleId + '_' + parent.params.rightId;
        }else{
            signatureKey ='m3_v5_cmp_form_signature_' + params.moduleId + '_' + params.rightId;
        }

        if(cmp.storage.get(signatureKey,true)!=null){
            signatureInitCache=[];
            var signcache=JSON.parse(cmp.storage.get(signatureKey,true));
            //var signcache=JSON.parse('{"field0047_9107586949531346386":{"summaryID":"9107586949531346386","picData":"iVBORw0KGgoAAAANSUhEUgAAAMgAAABhCAYAAACTS+64AAAABHNCSVQICAgIfAhkiAAABGJJREFUeJzt3fFR40YUgPHvMilAJaiDuAO2g6ODUyoIHeBUkKSCcweBCuKrAKgApwKcCi5/rPZkiAPYPu9qpe8343nAmNGT7KfVrlYSSJIkSZIkSZIkSZIkSZIkSSrjQ+kEzqQBLoDFzt/+ALZl0pHG4SPwGfi657Usl5Zq9WPpBL6DBvgF6IB25+8PwA2x1WiA33MnJpXUANfAE0MrsQGueF4o0ux8Ah4ZCmMNhIL55LTked9K+qYB/mSehQFxXdN6S88sGFqNLbHPMTdLHHDI6ofSCbxTB/xF7Fs8EItlVS6dYpo+OlytbzqGQ6oVw5dkjtbE7RDKpnGShjgUHwrnMQkdnsfYtSFui7ZsGifpiOtwUziP6nUMxdEVzWQ80vao2Yq4DleF86hah8XxUiBuj/vCeZzqnvoPE4vqsDj2uWQaQ7xTaAWL6bA4/s+S+vtiCyprBcc0zBuIoxsAPzPPYdzXtH2seYg3zQDYlEziEGMpkAXxDDnEaemrcqmMVtvHava+e6QCqXkdsmuAO4bzHNpvS/1DvGvsoB8sXb9xz7xPAr5lCp3bKRR5VmlkZoszVF8TqKxzu0fL8FlXo2QfpAF+639eUveHf25TmIPV9rGqz7lkgSyJG+0LXu33ltS6rksmcaLQRwvkHdJlsuCUg/eYUguyKZjDwUoVSCqKWyrboxQyheHRto81r0M26TryUDiPWkxh/tIURuGy6Kh/RCa32r9cLcNNNapS4hDrso+rAstWGW0fNwVzqELDsDf0pOD7tFS6991xRVyH6kYrc7cgqfW4pe4RmZzaPm4K5nCqakfhShWIl1vOS+jjumAOR8ldIB/7aIHMS7WH0zkLJLUeD1TY1BYU+rgumMOpfurjumQSx8hZIKGPth6qRs4CmcJ8Ih2u7ePfJZM4Vs4CuejjWE4Qdgx3a9T5tH3cFMzhaCWeDzKG/keaat9QcQdS55erBQl9fMi0vLdcEQvjC+Np0TRCuYd5x9B6BOKDd6DuW+gog7Hc1SSX9HwRgF9xwCCHdAhbZUs9pwJpiJ3ydGi1LJrNfGxfxKrMpUBScSyI/aDL198uRbkKJDWvF6++6zxanhdHoNK9WeWqHC3MVSBb4J/+5zbTMiEWwx0WxxhUeVunnIdY6z6GTMu7Zuhz3FJvcWz6WOUXTO/XES+aeTzzcgLDrUxrvxs61P9k20Dd+We1IW6sz2+87xgtw21M0xV44QzLyS1Q9xcsUHf+WS0Y7s/6veZBNcTDqXSnlNRqVNkp3CNdpvxUOpEjBSyQg+wWyRPDWe1Dtfy3MFZMc/LhDfXe5CJggRysIX7o6YudCqV9x/99Ip4N/7rzWjONw6kpClggRwsMz4xIr0diX+KaeN7kuv/97sX7Uovh6M74rfCReicJxI2YDr1ee90QZ+O2+dPU3HwoncAeC2LBNH28J45I3WMzLUmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmT8S/KhQ8ebBKvewAAAABJRU5ErkJggg==","height":"200","recordID":"0","fieldValue":"bnVsbE1vZGlmaWVkPS0xClVzZXJDb3VudD0xCm51bGxIYXNDQVNpZ249MApVc2VyTGlzdD1udWxsLApudWxsUG9zaXRpb249MCwyMDAsMCw5NywKQWxsUG9zaXRpb249MCwyMDAsMCw5NywKVmVyc2lvbj02LjAuMC5pY29uX2xhdW5jaGVyCm51bGw9aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQmhDQVlBQUFDVFMrNjRBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFCR0pKUkVGVWVKenQzZkZSNDBZVWdQSHZNaWxBSmFpRHVBTzJnNk9EVXlvSUhlQlVrS1NDY3dlQkN1S3JBS2dBcHdLY0NpNS9yUFpraUFQWVB1OXFwZTgzNDNuQW1OR1Q3S2ZWcmxZU1NKSWtTWklrU1pJa1NaSWtTWklrU1NyalEra0V6cVFCTG9ERnp0LytBTFpsMHBIRzRTUHdHZmk2NTdVc2w1WnE5V1BwQkw2REJ2Z0Y2SUIyNSs4UHdBMngxV2lBMzNNbkpwWFVBTmZBRTBNcnNRR3VlRjRvMHV4OEFoNFpDbU1OaElMNTVMVGtlZDlLK3FZQi9tU2VoUUZ4WGRONlM4OHNHRnFOTGJIUE1UZExISERJNm9mU0NieFRCL3hGN0ZzOEVJdGxWUzZkWXBvK09seXRienFHUTZvVnc1ZGtqdGJFN1JES3BuR1NoamdVSHdybk1Ra2Ruc2ZZdFNGdWk3WnNHaWZwaU90d1V6aVA2blVNeGRFVnpXUTgwdmFvMllxNERsZUY4NmhhaDhYeFVpQnVqL3ZDZVp6cW52b1BFNHZxc0RqMnVXUWFRN3hUYUFXTDZiQTQvcytTK3Z0aUN5cHJCY2MwekJ1SW94c0FQelBQWWR6WHRIMnNlWWczelFEWWxFemlFR01wa0FYeEREbkVhZW1yY3FtTVZ0dkhhdmErZTZRQ3FYa2RzbXVBTzRiekhOcHZTLzFEdkd2c29COHNYYjl4ejd4UEFyNWxDcDNiS1JSNVZtbGtab3N6VkY4VHFLeHp1MGZMOEZsWG8yUWZwQUYrNjM5ZVV2ZUhmMjVUbUlQVjlyR3F6N2xrZ1N5SkcrMExYdTMzbHRTNnJrc21jYUxRUnd2a0hkSmxzdUNVZy9lWVVndXlLWmpEd1VvVlNDcUtXeXJib3hReWhlSFJ0bzgxcjBNMjZUcnlVRGlQV2t4aC90SVVSdUd5NktoL1JDYTMycjljTGNOTk5hcFM0aERyc28rckFzdFdHVzBmTndWenFFTERzRGYwcE9EN3RGUzY5OTF4UlZ5SDZrWXJjN2NncWZXNHBlNFJtWnphUG00SzVuQ3Fha2ZoU2hXSWwxdk9TK2pqdW1BT1I4bGRJQi83YUlITVM3V0gwemtMSkxVZUQxVFkxQllVK3JndW1NT3BmdXJqdW1RU3g4aFpJS0dQdGg2cVJzNENtY0o4SWgydTdlUGZKWk00VnM0Q3VlampXRTRRZGd4M2E5VDV0SDNjRk16aGFDV2VEektHL2tlYWF0OVFjUWRTNTVlckJRbDlmTWkwdkxkY0VRdmpDK05wMFRSQ3VZZDV4OUI2Qk9LRGQ2RHVXK2dvZzdIYzFTU1g5SHdSZ0Y5eHdDQ0hkQWhiWlVzOXB3SnBpSjN5ZEdpMUxKck5mR3hmeEtyTXBVQlNjU3lJL2FETDE5OHVSYmtLSkRXdkY2Kys2enhhbmhkSG9OSzlXZVdxSEMzTVZTQmI0Si8rNXpiVE1pRVd3eDBXeHhoVWVWdW5uSWRZNno2R1RNdTdadWh6M0ZKdmNXejZXT1VYVE8vWEVTK2FlVHp6Y2dMRHJVeHJ2eHM2MVA5azIwRGQrV2UxSVc2c3oyKzg3eGd0dzIxTTB4VjQ0UXpMeVMxUTl4Y3NVSGYrV1MwWTdzLzZ2ZVpCTmNURHFYU25sTlJxVk5rcDNDTmRwdnhVT3BFakJTeVFnK3dXeVJQRFdlMUR0ZnkzTUZaTWMvTGhEZlhlNUNKZ2dSeXNJWDdvNll1ZENxVjl4Lzk5SXA0Ti83cnpXak9OdzZrcENsZ2dSd3NNejR4SXIwZGlYK0thZU43a3V2Lzk3c1g3VW92aDZNNzRyZkNSZWljSnhJMllEcjFlZTkwUVorTzIrZFBVM0h3b25jQWVDMkxCTkgyOEo0NUkzV016TFVtU0pFbVNKRW1TSkVtU0pFbVNKRW1TSkVtU0pFbVNKRW1TSkVtU0pFbVNKRW1TSkVtVDhTL0toUThlYkJLdmV3QUFBQUJKUlU1RXJrSmdnZz09Cg==","width":"200","classType":"MJINGESignature","fieldName":"field0047_9107586949531346386"}}');
            for (key in signcache){
                signatureInitCache.push( signcache[key]);
            }
        }

        var len = signatureInitCache.length;
		//TODO  OA-109347发起人在m3上调用表单模板，在表单控件-签章中盖章后切换到原表单不显示；且发送后在已发中查看，默认的表单视图也不显示签章
		if(len == 0  && signatureKey != null  && formData.results.data && formData.results.data.master){
			//TODO  如果signatureKey不为空并且 len ==0
			var master = formData.results.data.master;
			 for (key in master){
				 var datas = master[key];
				 if(datas != null && datas.signature ){
					 var  fieldValue = datas.signature;
						  cmp.handWriteSignature.initSignatureData({
                            value: [fieldValue],
                            success: function (decodeSignatures) {
                                console.log(decodeSignatures);
                                if (typeof(decodeSignatures)=="object" && decodeSignatures.length > 0) {

                                    if (decodeSignatures[0].picData) {
										//TODO  OA-109646M3Android端-签章字段值在原样表单下显示错乱
                                         $("input[value='"+decodeSignatures[0].fieldName +"']").each(function(){
											 var imgs  ="data:image/png;base64,"+decodeSignatures[0].picData;
											var imgArea = $("<img/>").attr("height", "auto").attr("src", imgs).width($("#"+this.id+"_span").width()-5);
											$(this).after(imgArea);
                                            $(this).closest("td").css("background-color","");
										 });
										 //TODO  end
                                    }
                                }
                            },
                            error: function (err) {
								console.log(err);
                            }
                        });
				 }
			 }
			return ;
		}
		//TODO  end
        var paramList = [];
        for ( var i = 0; i < len; i++) {
            var tj = signatureInitCache[i].tj;
            if(tj==undefined){
                tj={};
                tj.objName=signatureInitCache[i].fieldName;
                tj.userName="";
                tj.recordId=signatureInitCache[i].summaryID;
            }
            var t = signatureInitCache[i].t;

            var fieldName = tj.objName;
            var userName = tj.userName;
            var recordID = tj.recordId;

            if(isNaN(recordID)) {
            	recordID = 0;
            }
            var index = fieldName.indexOf("_");
            var fieldID = fieldName.substring(0, index);
            if(fieldID == null || fieldID == "") {
            	fieldID = $(tj.signObj).attr("id");
            	fieldName = fieldID + "_" + fieldName;
            }

            var imgID = fieldID + "_" + "img";
            var rowID = "0";
            if(t==undefined){
                t=$("#"+fieldID).find(".comp");
            }
            if(typeof form != "undefined") {
                rowID = getRecordIdByJqueryField(t);
            } else {
                rowID = t.getRecordIDForRepeatForm();
            }
            var parentDiv = getParentByElement(t, "div");
		//	parentDiv.attr("style",{"border":"none"});

            var imgPath=serverPath+ "/signatPicController.do?method=writeGIF&RECORDID="+
                recordID+"&FIELDNAME="+fieldName;
            //base64 图片
            if(signatureInitCache[i].picData){
                imgPath="data:image/png;base64,"+signatureInitCache[i].picData;
            }
			//TODO OA-109554无流程表单--原样表单设置了电子签章和手写标注，签章超出了边框
            var imgArea = $("<img/>").attr("height", "auto").attr("id",
                    imgID).attr("src", imgPath).width(parentDiv.width()-10);
			//TODO  end

            //TODO 调整签章图片显示区域  辛裴2015-08-19 22:13
            var imgContainer = $("<div class='layout_flex_typesetting_sub' style='width: 90%;'></div>");
            t.parent().addClass("layout_flex_typesetting_parent");
            imgContainer.append(imgArea);
            t.parent().append(imgContainer);

//            t.parent().append(imgArea);

            var eventBtnID = null;
            if(fieldName.indexOf(":") == -1) {
            	eventBtnID = fieldName + "_" + "eventBtn";
            } else {
            	eventBtnID = fieldID + "_" + "eventBtn";
            }
			var height = 100;
			var width = 100;
			if (typeof (t.attr("initheight")) != "undefined" && t.attr("initheight")) {
				height = t.attr("initheight").replace("px", "");
			} else {
				height = parentDiv.height();

			}

			if(typeof(t.attr("initwidth"))!="undefined"&& t.attr("initwidth")&&t.attr("initwidth").indexOf("%")==-1){
				width = t.attr("initwidth").replace("px", "");
			} else  {
				width = parentDiv.width();

			}
            if(width < 100) {
				width =100;
			}
			if(height <100) {
				height= 100;
			}
            //添加签章按钮事件
            if(tj.enabled == 1) {
                needCheckNullField.put(fieldName,fieldID);
                var param = new Object();
                param.fieldName = fieldName;
                param.version = "";
                param.recordID = rowID;
                param.picData = "";
                param.height = height + "";
				param.width = width + "";
                param.summaryID = recordID;
				if(typeof(style)== "undefined" || style!="4"){
					var signatureEventArea = $("<img/>").attr("id", eventBtnID).attr("src","ic_form_signature.png")
						.bind("click",{param:param}, function(event){
							var commandValue = event.data.param;
							htmlSignatureButtonEvent(commandValue);
						});
					t.parent().append(signatureEventArea);
				} else {

                    //TODO 注释掉原签章图标调整签章图标区域  辛裴2015-08-19 22:13
                var signatureContainer = $('<div class="layout_flex_typesetting_sub position_veri_center" style="width: 10%;"></div>');
                var buttonS = $("<span class='triangle'></span>");
                signatureContainer.append(buttonS);
                t.parent().append(signatureContainer);
                    t.parent().removeAttr("style");
                    t.parent().unbind("click").bind("click",{param:param},function(event){
                        var commandValue = event.data.param;
                        htmlSignatureButtonEvent(commandValue);
                    });


//				var  buttonS = $("<span class = 'handwrite_48'/>").bind("click",{param:param}, function(event){
//							var commandValue = event.data.param;
//							htmlSignatureButtonEvent(commandValue);
//						});
//				t.parent().append(buttonS);
				}

            }


            var item = new Object();
            item[C_sSignatureParamKey_RecordID] = recordID;
            item[C_sSignatureParamKey_FieldName] = encodeURIComponent(fieldName);//toUnicode(fieldName);
            item[C_sSignatureParamKey_UserName] = encodeURIComponent(userName);
            item[C_sSignatureParamKey_RowID] = rowID;
            item[C_sSignatureParamKey_Width] = width;
            item[C_sSignatureParamKey_Height] = height;
            paramList.push(item);
        }
        signatureInitCache = [];

        var signatureManager = new mFormAjaxManager();
        var paramStr = $.toJSON(paramList);
        var reg=new RegExp("\\.","g");
		var versionNum = parseInt(version.replace(reg,""));
        if(versionNum >= 510) {

        	//TODO 修改bug  协同V5.0 OA-66170android，表单设置了高级权限时，当切换条件为满足高级条件时，签章控件的内容没有清空
        	if(signatureResultCache !=null){
        		signatureResultCache.remove(fieldName);
        	}


        	var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_getHtmlSignatureData, paramStr);
        	formInitedFlag = false;
        	requestClientWithParameter(commandStr);
        } else {
            var signatureManager = new mFormAjaxManager();
            signatureManager.getSignatureListForForm(paramStr, {
                success : function(objs) {
                    var result = [];
                    var len = objs.length;
                    for(var i = 0; i < len; i++) {
                        var item = objs[i];
                        var fieldValue = item.fieldValue;

                        if(fieldValue != null && fieldValue != "") {
                            result.push(item);
                        } else {//由于这里不需要客户端初始化，所以需要将签章按钮置为显示状态
                            var recordID = item.recordID;
                            var fieldName = item.fieldName;
                            displaySignatureEventBtn(fieldName,recordID);
                        }
                    }

                    if(result.length > 0) {
                        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_InitSignatureData, result);
                        requestClientWithParameter(commandStr);
                    }
                }
            });


        }
    };
	htmlSignatureButtonEvent = function (obj){
	  var fieldName = obj.fieldName;
	  var index = fieldName.indexOf("_");
	  if (index != -1 && fieldName.indexOf("my:") != -1) {
		 fieldName = fieldName.substring(0, index);
	 }


	 if(signatureResultCache == null || signatureResultCache.get(fieldName) == null) {
		obj.fieldValue = "";
	 } else {
		var data = signatureResultCache.get(fieldName);
		obj.fieldValue = data.fieldValue;
	 }
	 var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_HandWrite, obj);
	 requestClientWithParameter(commandStr);

	}
    initHtmlSignatureByClientReuslt = function(objs){
        var result = [];
       var obj = $.parseJSON(objs);
        var len = obj.length;
        for(var i = 0; i < len; i++) {
            var item = obj[i];
            var fieldValue = item.fieldValue;

            if(fieldValue != null && fieldValue != "") {
                result.push(item);
            } else {//由于这里不需要客户端初始化，所以需要将签章按钮置为显示状态
                var recordID = item.recordID;
                var fieldName = item.fieldName;
                displaySignatureEventBtn(fieldName,recordID);
            }
        }

        if(result.length > 0) {
            var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_InitSignatureData, result);
            requestClientWithParameter(commandStr);
        } else {
        	formInitedFlag =true;
        }
    }
    /*
     * ===========================================
     * 获取父span元素
     * ===========================================
     */
    getParentSpanByElement = function(element) {
        return getParentByElement(element, "span");
    };

    getParentByElement = function(element, specialLabel) {
        var result = null;
        if(typeof element != "undefined") {
            result = element.parent();
            while(result.length > 0 && !result.is(specialLabel)) {
                result = result.parent();
            }
        } else {
            result = $();
        }
        return result;
    };

    $.fn.getRecordIDForRepeatForm = function() {
        var ctrlObj = this.parents("tr[recordid]");
        var recordID = ctrlObj.attr("recordid") || '0';
        return recordID;
    };

    /**
     * 截取中英文字符串
     * @param str 字符串
     * @param len 截取长途
     * @param hasDot 是否增加 ...
     * @returns {string}
     */
    subStr4Filed = function (str, len, hasDot) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {//中文加2
                newLength += 2;
            } else {//英文加1
                newLength++;
            }
            if (newLength > len) {//如果新长度超过截取长度则跳出循环
                break;
            }
            newStr += singleChar;//将当前字符加到新的字符串中
        }
        if (hasDot && strLength > len) {//添加 "..."
            newStr += "...";
        }
        return newStr;
    };
    $(function() {
        initFormContent(false);
        fieldInputTypeMapper = new Map();
        renderFieldList();
        renderReadOnlyRelationForm();
        var addImg = $("<img src=\"ic_form_copy.png\"/>");
        var addEImg = $("<img src=\"ic_form_new.png\"/>");
        var delImg = $("<img src=\"ic_form_delete_row.png\"/>");
        $("[id=addImg]").html(addImg).css("display","none");
        $("[id=addEmptyImg]").html(addEImg).css("display","none");
        $("[id=delImg]").html(delImg).css("display","none");


        $("[id=delAllImg]").removeClass("ico16");
        if (typeof relationInitParam != "undefined") {
            initRelationSubTable(relationInitParam);
        }

        adapterAllNoBizPic();
        sendDisableHiddenFunction();
        checkRadioHeight();

//        setTimeout(function(){
            htmlSignatureM1();

//        },2000);
        var label = $("label");
        if(label.length > 0){
            label.css("word-break","");
        }
        var showMoreBtn = $("div[id^='showMore_']");
        if(showMoreBtn.length >0) {
            var  spans = showMoreBtn.find(".ico16");
            if(spans.length > 0) {
                spans.removeClass("ico16");
            }
        }

        initAdjustRepeatFieldWidth();


    });

})(jQuery);
function initAdjustRepeatFieldWidth(){
    $("table[id^=formson]").each(function(index,tagetTable){
        $(tagetTable).find("input[id^=field],textarea[id^=field]").each(function(index,tagetInput){
            var tagetInputW = $(tagetInput).width();
            if(tagetInputW){
                tagetInput.style.width = (tagetInputW -5) + "px";
            }
        })
    });
}
//适配ios点击完成按钮不失去焦点，导致表单中一些计算不能进行的bug
$(document).ready(function(){
    var _cmp_focusTarget = false,
        _cmp_touchStartTime = 0;//点击开始时间
    var ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var parentDocument = window.document;
    var topDocument = top.window.document;
    var touchStartEvent = function(e){
        _cmp_touchStartTime = e.timeStamp;
        //适配ios点击页面其他地方的时候input/textarea不能失去焦点end
        var touchTarget = e.targetTouches.length; //获得触控点数
        if(touchTarget > 1) {
            blurFields();
        }
        //适配软键盘弹出后把输入框挡住的问题star
        if(ios){  //只适配ios设备
            if(e.target.tagName.toLocaleLowerCase() == "input"
                || e.target.tagName.toLocaleLowerCase() == "textarea"
                || e.target.tagName.toLocaleLowerCase() == "select" ) {
                if(!e.target.classList.contains("cmp-not-trans")) _cmp_focusTarget = true;
            }else {
                _cmp_focusTarget = false;
            }
        }

        //适配软键盘弹出后把输入框挡住的问题end
    };
    var touchEndEvent = function(e){
        var teTime = e.timeStamp;
        if(teTime - _cmp_touchStartTime < 400 && !_cmp_focusTarget){
            blurFields();
        }
    };
    var blurFields = function(){
        var focusInput = document.querySelector("input:focus");
        var focusTextArea = document.querySelector("textarea:focus");
        var focusSelect = document.querySelector("select:focus");
        if(focusInput) focusInput.blur();
        if(focusTextArea) focusTextArea.blur();
        if(focusSelect) focusSelect.blur();
    };
    document.addEventListener("touchstart",touchStartEvent,false);
    document.addEventListener("touchend",touchEndEvent,false);
//===================================================================================================

    parentDocument.addEventListener("touchstart",touchStartEvent,false);

    parentDocument.addEventListener("touchend",touchEndEvent,false);

//===========================================================================
    topDocument.addEventListener("touchstart",touchStartEvent,false);
    topDocument.addEventListener("touchend",touchEndEvent,false);
});
