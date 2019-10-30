var C_sTips_FileNotExist = "\u5bf9\u4e0d\u8d77\uff0c\u60a8\u8981\u627e\u7684\u6e90\u6587\u4ef6\u4e0d\u5b58\u5728.";
var C_sTips_NotSupport = "\u6682\u4e0d\u652f\u6301\u67e5\u770b.";

var _ctxPath = "";
var proxyServerAddr = "";
var memberKey = "";
var canSignatuer = true;
var photoValidateCache = new Array();
var mSignatureDataCache = [];
var calcFieldDataCache = null;
/**
 * 页面是否加载完成
 */
var formInitedFlag = true;
/**
 * 重复行添加时 不复制图片 
 */
var repeatPhotoLocationImgShow = true;
$.ctx = new Object();
function V3X() {
}
var _locale = cmp.language.replace("-","_");

/*
 * ===========================================
 * 模块常量===========================================
 */
/**
 * 特殊对象，不用记模块ID
 */
var C_iModuleType_Unkunow = -1;

/**
 * 全局
 */
var C_iModuleType_global = 0;
/**
 * 协同
 */
var C_iModuleType_Collaboration = 1;
/**
 * 表单
 */
var C_iContentType_FORM = 2;
/**
 * 文档中心
 */
var C_iModuleType_Archive = 3;
/**
 * 公文
 */
var C_iModuleType_EDoc = 4;
/**
 * 计划
 */
var C_iModuleType_Plan = 5;
/**
 * 会议
 */
var C_iModuleType_Meeting = 6;
/**
 * 公告
 */
var C_iModuleType_Bulletin = 7;
/**
 * 新闻
 */
var C_iModuleType_News = 8;
/**
 * 讨论
 */
var C_iModuleType_BBS = 9;
/**
 * 调查
 */
var C_iModuleType_Inquiry = 10;
/**
 * 日程
 */
var C_iModuleType_Calendar = 11;

/**
 * 邮件
 */
var C_iModuleType_Mail = 12;

/**
 * 组织模型
 */
var C_iModuleType_Orgniaztion = 13;

/**
 * 项目
 */
var C_iModuleType_Project = 14;

/**
 * 关联人员
 */
var C_iModuleType_RelateMember = 15;

/**
 * 交换
 */
var C_iModuleType_Exchange = 16;

/**
 * 人力资源
 */
var C_iModuleType_HR = 17;

/**
 * 博客
 */
var C_iModuleType_Blog = 18;

/**
 * 发文
 */
var C_iModuleType_EdocSend = 19;

/**
 * 收文
 */
var C_iModuleType_EdocRec = 20;

/**
 * 签报
 */
var C_iModuleType_EdocSign = 21;

/**
 * 待发送公文
 */
var C_iModuleType_ExSend = 22;

/**
 * 待签收公文
 */
var C_iModuleType_ExSign = 23;

/**
 * 待登记公文
 */
var C_iModuleType_EdocRegister = 24;

/**
 * 在线交流
 */
var C_iModuleType_Communication = 25;

/**
 * 综合办公
 */
var C_iModuleType_Office = 26;

/**
 * 代理设置
 */
var C_iModuleType_Agent = 27;

/**
 * 修改密码
 */
var C_iModuleType_ModifyPassword = 28;

/**
 * 会议室
 */
var C_iModuleType_MeetingRoom = 29;

/**
 * 任务管理
 */
var C_iModuleType_TaskManager = 30;

/**
 * 留言板
 */
var C_iModuleType_GuestBook = 31;

/**
 * 信息报送
 */
var C_iModuleType_Info = 32;

/**
 * 信息报送统计
 */
var C_iModuleType_InfoStat = 33;

/**
 * 收文分发
 */
var C_iModuleType_EdocRecDistribute = 34;

/**
 * 上传附件
 */
var C_iModuleType_AttachmentMgr = 2121212121;

/*
 * ===========================================
 * 调用本地控件命令编号定义===========================================
 */
/**
 * 选择人员、部门、单位、岗位、职务级别的命令编号
 */
var C_iInvokeNativeCtrlCommand_ChoosePerson = 1;

/**
 * 选择日期或日期时间命令编号
 */
var C_iInvokeNativeCtrlCommand_ChooseDate = 2;

/**
 * 选择附件或图片命令编号
 */
var C_iInvokeNativeCtrlCommand_ChooseFile = 3;

/**
 * 获取表单数据的命令编号
 */
var C_iInvokeNativeCtrlCommand_Result = 4;

/**
 * 追加内容控件命令编号
 */
var C_iInvokeNativeCtrlCommand_AppendText = 5;

/**
 * 表单错误信息命令编号
 */
var C_iInvokeNativeCtrlCommand_VerifyForm = 6;

/**
 * 表单对话框消息
 */
var C_iInvokeNativeCtrlCommand_Diaglog = 7;

/**
 * 选择关联表单
 */
var C_iInvokeNativeCtrlCommand_ChooseRelationForm = 8;

/**
 * 选择关联项目
 */
var C_iInvokeNativeCtrlCommand_ChooseRelationProject = 9;

/**
 * 获取关联表单选择结果，主要用于关联表单在选择表单重复项时使用
 */
var C_iInvokeNativeCtrlCommand_GetRelationFormResult = 10;

/**
 * 追溯查看关联表单
 */
var C_iInvokeNativeCtrlCommand_ShowRelationFormRecord = 11;

/**
 * 显示附件
 */
var C_iInvokeNativeCtrlCommand_ShowAttachment = 12;

/**
 * 显示关联文档
 */
var C_iInvokeNativeCtrlCommand_ShowAssoc = 13;

/**
 * 进度条
 */
var C_iInvokeNativeCtrlCommand_ProgressBar = 14;

/**
 * 初始化签章数据名称
 */
var C_iInvokeNativeCtrlCommand_InitSignatureData = 15;

/**
 * 手写签章
 */
var C_iInvokeNativeCtrlCommand_HandWrite = 16;

/**
 * 流程处理意见扩展功能
 */
var C_iInvokeNativeCtrlCommand_FlowDealOpinion = 17;

/**
 * 系统错误消息
 */
var C_iInvokeNativeCtrlCommand_SysError = 18;

/**
 * 打开外部URL
 */
var C_iInvokeNativeCtrlCommand_OpenURL = 19;

/**
 * 是否需要进行预提交
 */
var C_iInvokeNativeCtrlCommand_NeedPreSubmit = 20;

/**
 * 表单计算
 */
var C_iInvokeNativeCtrlCommand_Calculate = 21;

/**
 * 显示会议
 */
var C_iInvokeNativeCtrlCommand_ShowMeeting = 22;

/**
 * DEE选择
 */
var C_iInvokeNativeCtrlCommand_exchangeDee = 23;

/**
 * DEE查询
 */
var C_iInvokeNativeCtrlCommand_queryDee = 24;
/**
* 1:地图标注
*/
var C_iInvokeNativeCtrlCommand_Marker = 25;
/**
* 2:签到记录 
*/
var C_iInvokeNativeCtrlCommand_Sign = 26;
/**
* 3:位置定位 
*/
var C_iInvokeNativeCtrlCommand_PositionLocation = 27;
/**
* 4:拍照定位  
*/
var C_iInvokeNativeCtrlCommand_PhotoLocation = 28;
/**
 * 表单错误信息提示，与 C_iInvokeNativeCtrlCommand_VerifyForm 区分在于不用做表单验证 ，仅仅是提示语
 */
var C_iInvokeNativeCtrlCommand_ErrorMsg = 29;
/**
 * HtmlSignature 通过后台获取表单的签章数据
 */
var C_iInvokeNativeCtrlCommand_getHtmlSignatureData = 30;
/**
* 判断页面是否加载完成比如说表单回填操作是否完成
*/
var C_iInvokeNativeCtrlCommand_getFormFinishInited = 31;
/**
 *  根据URL打开网页地址
 */
var C_iInvokeNativeCtrlCommand_openUrlPage = 32;
/**
 * 操作权限  控制命令
 */
var C_iInvokeNativeCtrlCommand_flowDealOpinion = 33;
/**
	iphone  展开重复表是需要向后台传事件监听过去

*/
var C_iInvokeNativeCtrlCommand_repeatTableHandle = 34;
/**
 * 表单显示扫一扫按钮
 */
var C_iInvokeNativeCtrlCommand_formShowScanBtn = 35;//xinpei

/**
 * iphone 设备窗口改变-----显示
 */
var C_iInvokeNativeCtrlCommand_iosWindowChange_show = 36;//xinpei
/**
 * iphone 设备窗口改变-----隐藏
 */
var C_iInvokeNativeCtrlCommand_iosWindowChange_hidden = 37;//xinpei
/**
 * 意见隐藏控制命令
 */
var C_iInvokeNativeCtrlCommand_flowDealOpinion_OpinionHide = 101;




/*
 * =========================================== 客户端类型定义
 * ===========================================
 */
/**
 * android phone client
 */
var C_sClientType_AndroidPhone = "androidphone";

/**
 * android pad client
 */
var C_sClientType_AndroidPad = "androidpad";

/**
 * iphone client
 */
var C_sClientType_Iphone = "iphone";

/**
 * ipad client
 */
var C_sClientType_Ipad = "ipad";


/*
 * =========================================== 选人相关
 * ===========================================
 */
/**
 * 选人数据类型——人员
 */
var C_sChoosePersonDataType_Person = "Member";

/**
 * 选人数据类型——部门
 */
var C_sChoosePersonDataType_Department = "Department";

/**
 * 选人数据类型——单位
 */
var C_sChoosePersonDataType_Account = "Account";

/**
 * 选人数据类型——岗位
 */
var C_sChoosePersonDataType_Post = "Post";

/**
 * 选人数据类型——职务级别
 */
var C_sChoosePersonDataType_Level = "Level";

/*
 * =========================================== 选日期/时间
 * ===========================================
 */

/**
 * 日期时间选择类型——选择日期
 */
var C_iChooseDateType_Date = 1;

/**
 * 日期时间选择类型——选择日期时间
 */
var C_iChooseDateType_Time = 2;

/*
 * =========================================== 附件/图片方法
 * ===========================================
 */

/**
 * 选择文件
 */
var C_iChooseFileType_File = 1;

/**
 * 选择附件
 */
var C_iChooseFileType_Pic = 2;

/**
 * 选择关联文档
 */
var C_iChooseFileType_AssociateDocument = 3;

/**
 * 关联文档是协同
 */
var C_sAssociateMimeType_Collaboration = "collaboration";

/**
 * 关联文档是来自文档中心
 */
var C_sAssociateMimeType_Archive = "km";

/**
 * 公文的mimeType
 */
var C_sAssociateMimeType_Edoc = "edoc";
/**
 * 会议的mimeType
 */
var C_sAssociateMimeType_Meeting = "meeting";

/* =========================================================== */
/* ========== ========== */
/* ==========文档类型 ========== */
/* ========== ========== */
/* ================ =========================================== */
/**
 * 文档类型——文件不存在(映射文件对应的真实文件已删除)
 */
var C_iArchiveType_NotFound = 0;
/**
 * 文档类型——文件夹
 */
var C_iArchiveType_Folder = 1;

/**
 * 文档类型——一般文件
 */
var C_iArchiveType_File = 2;

/**
 * 文档类型——协同
 */
var C_iArchiveType_Flow = 3;

/**
 * 文档类型——公文
 */
var C_iArchiveType_Document = 4;

/**
 * 文档类型——计划
 */
var C_iArchiveType_Plan = 5;

/**
 * 文档类型——会议
 */
var C_iArchiveType_Conference = 6;

/**
 * 文档类型——讨论
 */
var C_iArchiveType_Discussion = 7;

/**
 * 文档类型——调查
 */
var C_iArchiveType_Survey = 8;

/**
 * 文档类型——公告
 */
var C_iArchiveType_Bulletin = 9;

/**
 * 文档类型——新闻
 */
var C_iArchiveType_News = 10;

/**
 * 文档类型——链接
 */
var C_iArchiveType_Link = 11;
/**
 * 文档类型——在线html
 */
var C_iArchiveType_Html = 12;
/**
 * 文档类型——在线word
 */
var C_iArchiveType_Word = 13;
/**
 * 文档类型——在线excel
 */
var C_iArchiveType_Excel = 14;
/**
 * 文档类型——在线wps文档
 */
var C_iArchiveType_Wps = 15;
/**
 * 文档类型——在线et文档
 */
var C_iArchiveType_Et = 16;
/**
 * 文档类型——系统模板
 */
var C_iArchiveType_SystemTemplate = 17;
/**
 * 文档类型——表单
 */
var C_iArchiveType_Form = 18;
/**
 * 文档类型——邮件
 */
var C_iArchiveType_Email = 19;

/*
 * =========================================== 表单类型
 * ===========================================
 */

/**
 * 流程表单
 */
var C_iFormType_ProcessesForm = 1;

/**
 * 信息管理
 */
var C_iFormType_ManageInfo = 2;

/**
 * 基础数据
 */
var C_iFormType_BaseInfo = 3;

/**
 * 计划表单
 */
var C_iFormType_PlanForm = 4;

/**
 * ===========================================二维码扫描出的数据类型
 * ===========================================
 */

/**
 * 二维码数据类型是表单
 */
var C_sScanCodeType_form = "form";

/*
 * =========================================== 客户端适配相关
 * ===========================================
 */
returnResultToClient = function(result) {
	if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
		return result;
	} else if (clientType == C_sClientType_AndroidPad
			|| clientType == C_sClientType_AndroidPhone) {
		window.m1.runOnAndroidJavaScript(result);
	} else {
		return;
	}
};

requestClientWithParameter = function(parameter) {

	if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
		//location.href = ".?parameters_0123=" + parameter;
	} else if (clientType == C_sClientType_AndroidPad
			|| clientType == C_sClientType_AndroidPhone) {
		//window.m1.runOnAndroidJavaScript(parameter);
//        window.m1.log("xinpei-dddddddddd");
	} else {
		return;
	}
	console.log(parameter);
	if(cmp==undefined) return;

	var command=cmp.parseJSON(parameter).value;
	command.document=top.document;
    if(command.classType=="MAttOpenParameter") { //附件
		if(command.type==1){
			command.att={
				fileUrl:command.fileID || command.fileUrl,
				filename:command.fileName || command.filename
			}
				//cmp.event.trigger("beforepageredirect", top.document);
				top.SeeyonAttachment.openRelatedDoc(command);
		}else{
			if(cmp.platform.CMPShell) {
				cmp.dialog.loading(true);
				cmp.att.read({
					filename: (command.fileName|| command.filename),
					path: cmp.origin + "/rest/attachment/file/" + (command.fileID || command.fileUrl),
					extData: {
						fileId: (command.fileID || command.fileUrl),
						lastModified: "1"
					},
					success: function (res) {
						cmp.dialog.loading(false);
					},
					error: function (err) {
						cmp.dialog.loading(false);
					}
				});
			}else{
				cmp.notification.toast("微信端暂不支持图片查看","center");
			}
		}

	}else if(command.classType=="MLbsObject" && cmp.platform.CMPShell) {//lbs标注
		//cmp.event.trigger("beforepageredirect",top.document);
		cmp.dialog.loading(true);
        cmp.lbs.showLocationInfo({
			lbsUrl:  serverPath+ "/rest/cmplbs/"+command.lbsId,
			userName:"", // 用户名（可以不传）
			memberIconUrl:"", // 用户头像url地址 （可以不传）
			success: function(){
				cmp.dialog.loading(false);
			},
			error:function(err){
				cmp.dialog.loading(false);
			}
		});

	}else if(command.classType=="MAssocOpenParameter") {
		if(cmp.platform.CMPShell) {
			cmp.dialog.loading(true);
			//cmp.event.trigger("beforepageredirect", top.document);
			top.SeeyonAttachment.openRelatedDoc(command);
		}else{
			cmp.notification.toast("微信端暂不支持关联文档的下载和查看","center");
		}
	}else if(command.classType=="ShowRelationFormParam"){
		cmp.dialog.loading(true);
		if(command.moduleType=="1"){//有流程
			cmp.event.trigger("beforepageredirect",top.document);
            top.collApi.jumpToColSummary(command.dataID,"formRelation");
		}else{
			var option={};
			option.moduleId=command.dataID;
			option.moduleType=command.moduleType;
			option.rightId=command.rightID;
			option.name=command.name;
			cmp.event.trigger("beforepageredirect",top.document);
			cmp.openUnflowFormData(option);
		}

	}

};

getCommandStr = function(command, value) {
	var resultObj = new Object();
	resultObj.command = command;
	resultObj.value = value;

	var result = $.toJSON(resultObj);
	return result;
};

MAttOpenParameter = function(fileID, fileName, createDate, localPath,
		modifyDate, type, verifyCode) {
	this.fileID = fileID;
	this.fileName = fileName;
	this.createDate = createDate;
	this.localPath = localPath;
	this.modifyDate = modifyDate;
	this.type = type;
	this.verifyCode = verifyCode || "";
	this.classType = "MAttOpenParameter";
};
MAssocOpenParameter = function(archiveID, name, sourceID, affairID, moduleType,
		type, createDate, modifyDate, size, baseObjectID, support, verifyCode) {
	this.archiveID = archiveID;
	this.name = name;
	this.sourceID = sourceID;
	this.affairID = affairID;
	this.moduleType = moduleType;
	this.type = type;
	this.createDate = createDate;
	this.modifyDate = modifyDate;
	this.size = size;
	this.baseObjectID = baseObjectID;
	this.support = support;
	this.verifyCode = verifyCode || "";
	this.classType = "MAssocOpenParameter";
};

var Map = function() {
	this.container = {};
};

/*
 * =========================================== 定义一个Map
 * ===========================================
 */

Map.prototype = {
	put : function(key, value) {
		try {
			if (key != null && key != "") {
				this.container[key] = value;
			}
		} catch (e) {
			return e;
		}
	},

	get : function(key) {
		try {
			return this.container[key];
		} catch (e) {
			return e;
		}
	},

	containsKey : function(key) {
		try {
			for ( var p in this.container) {
				if (p == key) {
					return true;
				}
			}
			return false;
		} catch (e) {
			return e;
		}
	},

	containsValue : function(value) {
		try {
			for ( var p in this.container) {
				if (this.container[p] === value) {
					return true;
				}
			}
			return false;
		} catch (e) {
			return e;
		}
	},

	remove : function(key) {
		try {
			delete this.container[key];
		} catch (e) {
			return e;
		}
	},

	clear : function() {
		try {
			delete this.container;
			this.container = {};
		} catch (e) {
			return e;
		}
	},

	isEmpty : function() {
		if (this.keyArray().length == 0) {
			return true;
		} else {
			return false;
		}
	},

	size : function() {
		return this.keyArray().length;
	},

	keyArray : function() {
		var keys = new Array();
		for ( var p in this.container) {
			keys.push(p);
		}
		return keys;
	},

	valueArray : function() {
		var values = new Array();
		var keys = this.keyArray();
		for ( var i = 0; i < keys.length; i++) {
			values.push(this.container[keys[i]]);
		}
		return values;
	}
};

/*
 * =========================================== 签章
 * ===========================================
 */
var C_sPicDataFormat_Gif = "data:image/gif;base64,";
getSignatureDataDisplayStr = function(picData) {
	var result = "";
	if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
		result = C_sPicDataFormat_Gif + picData;
	} else if (clientType == C_sClientType_AndroidPad
			|| clientType == C_sClientType_AndroidPhone) {
		result = C_sPicDataFormat_Gif + picData;
	}
	return result;
};
getDialogMsg = function(key) {
	var CTPLang = [];
	CTPLang['zh_CN']={
			"m.doc.prompt.inexistence":"对不起,您要找的源文件不存在!"
	}
	CTPLang['zh_TW']={
			"m.doc.prompt.inexistence":"對不起,您要找的源文件不存在!"
	}
	CTPLang['en']={
		"m.doc.prompt.inexistence":"I'm sorry, you're looking for the source file does not exist!"
	}
	var lang = CTPLang[_locale];
	try{
	if (!lang)
        return key;
      var msg = lang[key];

      if (msg && arguments.length > 1) {
        var messageRegEx_0 = /\{0\}/g;
        var messageRegEx_1 = /\{1\}/g;
        var messageRegEx_2 = /\{2\}/g;
        var messageRegEx_3 = /\{3\}/g;
        var messageRegEx_4 = /\{4\}/g;
        var messageRegEx_5 = /\{5\}/g;
        var messageRegEx_6 = /\{6\}/g;
        var messageRegEx_7 = /\{7\}/g;
        var messageRegEx_8 = /\{8\}/g;
        var messageRegEx_9 = /\{9\}/g;
        var messageRegEx_10 = /\{10\}/g;
        var messageRegEx_11 = /\{11\}/g;
        var messageRegEx_12 = /\{12\}/g;
        var messageRegEx_13 = /\{13\}/g;
        var messageRegEx_14 = /\{14\}/g;
        var messageRegEx_15 = /\{15\}/g;
        for ( var i = 0; i < arguments.length - 1; i++) {
          var regEx = eval("messageRegEx_" + i);
          var repMe = "" + arguments[i + 1];
          if (repMe.indexOf("$_") != -1) {
            repMe = repMe.replace("$_", "$$_");
          }
          msg = msg.replace(regEx, repMe);
        }
      }

      return msg;
    } catch (e) {
    }

    return "";
}
var signatureInitCache = [];
var signatureFieldIDMapper = null;
addSignatureCtrl = function(t, tj) {
	if (signatureFieldIDMapper == null) {
		signatureFieldIDMapper = new Map();
	}
	var signatureObj = new Object();
	signatureObj.t = t;
	signatureObj.tj = tj;
	signatureInitCache.push(signatureObj);
	signatureFieldIDMapper.put(t.attr("id"));
};

var C_sSignatureParamKey_RecordID = "RECORDID";
var C_sSignatureParamKey_FieldName = "FIELDNAME";
var C_sSignatureParamKey_UserName = "USERNAME";
var C_sSignatureParamKey_FieldValue = "FIELDVALUE";
var C_sSignatureParamKey_Status = "STATUS";
var C_sSignatureParamKey_RowID = "ROWID";
var C_sSignatureParamKey_Width = "WIDTH";
var C_sSignatureParamKey_Height = "HEIGHT";
var C_sSignatureParamKey_SummaryID = "SUMMARYID";

var needCheckNullField = null;
checkHWM1 = function(contentDomain) {
	if(needCheckNullField == null) return true;
	var ret = true;
	var errorMsg = "";
	var fieldNameArray = needCheckNullField.keyArray();
	var len = fieldNameArray.length;
	for ( var i = 0; i < len; i++) {
		var fieldName = fieldNameArray[i];
		var fieldID = needCheckNullField.get(fieldName);
		var input = contentDomain.find("input[id='" + fieldID + "']")[0];
		var validateStr = $(input).attr("validate");
		if (typeof validateStr != "undefined") {
			var validate = $.parseJSON("{" + validateStr + "}");
			if (validate.notNull) {
				if (signatureResultCache == null
						|| signatureResultCache.get(fieldName) == null) {
					errorMsg += validate.name +  $.i18n("validate.notNull.js") +"\n";
					ret = false;
				}
			}
		}
	}

	// 关联表单
	contentDomain
	.find("span[relation]")
	.each(
			function() {
				var curField = $(this).parent("span");
				var id = curField.attr("id").split("_")[0];
				if (curField.find("#" + id).attr("validate") != undefined) {
					var validate = $.parseJSON("{"
							+ curField.find("#" + id).attr(
									"validate") + "}");
					// 获取校验规则，是否有为空校验
					if (validate.notNull) {
						if ($.trim($(this).parent("span").find("span")
								.eq(0)[0].innerHTML) == ""
								|| "&nbsp;" == $
										.trim($(this).parent("span")
												.find("span").eq(0)[0].innerHTML)) {
							errorMsg = errorMsg + validate.name + $.i18n("form.base.notnull.label") +"！";
							ret = false;
						}
					}
				}else if(curField.find("div[id^='attachment']").length>0){
					if($(this).attr("isNull")=='true'&&$(this).attr("hasRelatied")=='false'){
						var fieldVal = curField.attr("fieldVal");
						if (fieldVal != undefined) {
							fieldVal = $.parseJSON(fieldVal);
							errorMsg = errorMsg + fieldVal.displayName+$.i18n("form.base.notnull.label")+"！";
							ret = false;
						}
					}
				}
			});
	// 附件 图片 关联文档
	contentDomain.find(".comp").each(
			function() {
				if ($(this).parent("span").hasClass("edit_class")) {// 首先判断编辑态
					var compParm = $
							.parseJSON("{" + $(this).attr("comp") + "}");
					if (compParm.notNull == "true") {
						var jqField = $(this).parent("span");
						var fieldVal = jqField.attr("fieldVal");
						if (fieldVal != undefined) {
							fieldVal = $.parseJSON(fieldVal);
							if (fieldVal.inputType == "attachment") {
								if (jqField.find("div[id^=attachmentArea]")
										.children().length <= 0) {
									errorMsg += fieldVal.displayName;
									errorMsg += $.i18n("validate.notNull.js") +"\n";
									ret = false;
								}
							} else if (fieldVal.inputType == "document") {
								if (jqField.find("div[id^=attachment2Area]")
										.children().length <= 0) {
									errorMsg += fieldVal.displayName;
									errorMsg +=  $.i18n("validate.notNull.js") +"\n";
									ret = false;
								}
							} else if (fieldVal.inputType == "image") {
								if (jqField.find("div[id^=attachmentArea]")
										.children().length <= 0) {
									errorMsg += fieldVal.displayName;
									errorMsg +=  $.i18n("validate.notNull.js") +"\n";
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
						errorMsg +=  $.i18n("validate.notNull.js") +"\n";
						ret = false;
					}
				}
			}
		}
	});
	//关联部门属性-部门成员数量选择上线判断
	contentDomain.find("span[fieldVal]").each(function(){
		var currfield = $(this);
		if(currfield.attr("fieldVal").indexOf('data_relation_department')==-1){
			return;
		}
		if(currfield.hasClass("browse_class")){
			var fieldVal = currfield.attr("fieldVal");
			if (fieldVal != undefined) {
				fieldVal = $.parseJSON(fieldVal);
			}
			if(fieldVal.inputType=="multimember"){
				var dispInpSpan = currfield.find("#"+fieldVal.name);
				if (dispInpSpan.attr("validate") != undefined) {
					var validate = $.parseJSON("{"+ dispInpSpan.attr("validate") + "}");
					var maxSize = validate.maxLength/21;
					if(dispInpSpan.text().split("、").length>maxSize){
						errorMsg += fieldVal.displayName;
						errorMsg += "超过最大数目！";
						ret = false;
					}
				}
			}
		}else if(currfield.hasClass("edit_class")){
			var compStr = currfield.find(".comp").attr("comp");
			if (compStr != undefined) { 
				var compParm = $.parseJSON("{" +compStr + "}");
				if(compParm.type=="selectPeople"){
					var fieldVal = currfield.attr("fieldVal");
					if (fieldVal != undefined) {
						fieldVal = $.parseJSON(fieldVal);
					}
					if(fieldVal.inputType == "multimember"&&"data_relation_department"==fieldVal.toRelationType){
						var hidinp = currfield.find("#"+fieldVal.name);
						if(hidinp.length>0){
							var curSize = hidinp.val().split(",").length;
							if(curSize>compParm.maxSize){
								errorMsg += fieldVal.displayName;
								errorMsg += "超过最大数目！";
								ret = false;
							}
						}
					}
				}
			}
		}
	});
	if (!ret) {
		var formError = new MFormError(errorMsg, 2);
		putError(formError);
	}
	return ret;
};

var sepSignature = "_";

getEdocSignatureAreaID = function(fieldID,affairID) {
	return "moneedoc" + sepSignature + fieldID + sepSignature + affairID;
};

getEdocFieldIDFromSignatureAreaID = function(signatureAreaID) {
	if(signatureAreaID.indexOf(sepSignature) != -1) {
		var tmp = signatureAreaID.split(sepSignature);
		return tmp[1];
	} else {
		return signatureAreaID;
	}
};

isEdocSignature = function(signatureAreaID) {
	if(signatureAreaID.indexOf(sepSignature) == -1) return false;
	var tmp = signatureAreaID.split(sepSignature);
	if(tmp[0] == 'moneedoc') {
		return true;
	} else {
	    return false;
	}
};

getEventBtnID = function(fieldName) {
	return fieldName + "_" + "eventBtn";
};

var signatureResultCache = null;
sendSignatureResult = function(returnValue) {
	if (signatureResultCache == null) {
		signatureResultCache = new Map();
	}

	var len = returnValue.length;
	for ( var i = 0; i < len; i++) {
		var data = returnValue[i];
		var picData = data.picData;
		var recordID = data.recordID;
		var fieldName = data.fieldName;
		var index = fieldName.indexOf("_");
		var fieldID = fieldName;
		var height = data.height;
		if (index != -1 && !isEdocSignature(fieldName)) {
			fieldID = fieldName.substring(0, index);
		}
		
		if(fieldName.indexOf("my:") != -1) {
			fieldName = fieldID;
		}
		
		var imgID = fieldID + "_" + "img";
		
		if(isEdocSignature(fieldName)) {
			imgID = fieldName;
		}
		
		var eventBtnID = getEventBtnID(fieldName);
		var imgArea = null;
		var eventBtn = null;
		if (recordID == "0" || recordID == 0) {
			imgArea = $("[id=" + imgID + "]");
			eventBtn = $("[id=" + eventBtnID + "]");
		} else {
			var tr = $("[recordid=" + recordID + "]");
			imgArea = tr.find("[id=" + imgID + "]");
			eventBtn = tr.find("[id=" + eventBtnID + "]");
		}

		var picDisplayStr = getSignatureDataDisplayStr(picData);
		imgArea.attr("src", picDisplayStr).css("display", "block");
		var    tempinput = $(imgArea.parent("div").find("input")[0]);
		var width=0;
		if(typeof(tempinput.attr("initwidth"))!="undefined"&& tempinput.attr("initwidth")&&tempinput.attr("initwidth").indexOf("%")==-1){
				width = tempinput.attr("initwidth").replace("px", "");
			} else  {
				width = tempinput.width();
				
			}
		//TODO  黄志翔修改的客户bug
		if(width >0 && width < 100 ) {
			width =100;
		}
		//imgArea.height(height);
		//TODO  huangzhixiang 修改
		//imgArea.width(width);
		imgArea.width(data.width);
		eventBtn.show();
		
		signatureResultCache.put(fieldName, data);
	}
	formInitedFlag = true;
};

displaySignatureEventBtn = function(fieldName, recordID) {
	var index = fieldName.indexOf("_");
	if (index != -1 && !isEdocSignature(fieldName) && fieldName.indexOf("my:") != -1) {
		fieldName = fieldName.substring(0, index);
	}
	
	var eventBtnID = fieldName + "_" + "eventBtn";
	var eventBtn = null;
	if (recordID == "0" || recordID == 0) {
		eventBtn = $("[id=" + eventBtnID + "]");
	} else {
		var tr = $("[recordid=" + recordID + "]");
		eventBtn = tr.find("[id=" + eventBtnID + "]");
	}
	eventBtn.css("display", "block");
};

getSignatureResult = function() {
	var result = [];
	if (signatureResultCache != null && signatureResultCache.size() > 0) {
		var signatureDataList = signatureResultCache.valueArray();
		var len = signatureDataList.length;
		for ( var i = 0; i < len; i++) {
			var data = signatureDataList[i];
			var signatureResult = new Object();
			signatureResult[C_sSignatureParamKey_SummaryID] = data.summaryID;
			signatureResult[C_sSignatureParamKey_FieldName] = data.fieldName;
			
			
			
			signatureResult[C_sSignatureParamKey_UserName] = currentUser.orgName;
			signatureResult[C_sSignatureParamKey_FieldValue] = data.fieldValue;
			if($("input[value = '"+data.fieldName+"']").length >0) {
				result.push(signatureResult);
			}
		}
	}
	return result;
};

/*
 * =========================================== 签章
 * ===========================================
 */

var AttTypeConstant = {
	C_iAttType_DEFAULT : 1,
	C_iAttType_AMR : 2,
	C_iAttType_CAF : 3,
	C_iAttType_DOCX : 4,
	C_iAttType_ET : 5,
	C_iAttType_PIC : 6,
	C_iAttType_HTML : 7,
	C_iAttType_MP3 : 8,
	C_iAttType_MP4 : 9,
	C_iAttType_PDF : 10,
	C_iAttType_PPTX : 11,
	C_iAttType_TXT : 12,
	C_iAttType_WPS : 13,
	C_iAttType_XLSX : 14,
	C_iAttType_FLOW : 15,
	C_iAttType_DOCUMENT : 16,
	C_iAttType_BULLETIN : 17,
	C_iAttType_NEWS : 18,
	C_iAttType_PLAN : 19,
	C_iAttType_CONFERENCE : 20,
	C_iAttType_DISCUSSION : 21,
	C_iAttType_SURVEY : 22,
	C_iAttType_VISIO : 23,
	C_iAttType_RAR : 24,
	C_iAttType_ZIP : 25,
	C_iAttType_TIF : 26,
	C_iAttType_FORM : 27,
	C_iAttType_EMAIL : 28,
	C_iAttType_FOLDER : 29,
	C_iAttType_MOV : 30,

	C_sAttType_AMR : "AMR",
	C_sAttType_CAF : "CAF",
	C_sAttType_DOCX : "DOC",
	C_sAttType_ET : "ET",
	C_sAttType_GIF : "GIF",
	C_sAttType_HTML : "HTM",
	C_sAttType_JPEG : "JPG",
	C_sAttType_MP3 : "MP3",
	C_sAttType_MP4 : "MP4",
	C_sAttType_PDF : "PDF",
	C_sAttType_PNG : "PNG",
	C_sAttType_BMP : "BMP",
	C_sAttType_PPTX : "PPT",
	C_sAttType_TXT : "TXT",
	C_sAttType_WPS : "WPS",
	C_sAttType_XLSX : "XLS",
	C_sAttType_VISIO : "VSD",
	C_sAttType_RAR : "RAR",
	C_sAttType_ZIP : "ZIP",
	C_sAttType_TIF : "TIF",
	C_sAttType_MOV : "MOV"
};

function getFileType(aFilename) {
	var result = AttTypeConstant.C_iAttType_DEFAULT;
	if (typeof aFilename != "undefined" && aFilename != null && aFilename != "") {
		var locTmpIndex = aFilename.lastIndexOf(".") + 1;
		var locSuffix = aFilename.substring(locTmpIndex).toUpperCase();

		if (locSuffix.indexOf(AttTypeConstant.C_sAttType_AMR) != -1) {
			result = AttTypeConstant.C_iAttType_AMR;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_CAF) != -1) {
			result = AttTypeConstant.C_iAttType_CAF;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_DOCX) != -1) {
			result = AttTypeConstant.C_iAttType_DOCX;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_ET) != -1) {
			result = AttTypeConstant.C_iAttType_ET;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_GIF) != -1) {
			result = AttTypeConstant.C_iAttType_PIC;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_HTML) != -1) {
			result = AttTypeConstant.C_iAttType_HTML;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_JPEG) != -1) {
			result = AttTypeConstant.C_iAttType_PIC;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_MP3) != -1) {
			result = AttTypeConstant.C_iAttType_MP3;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_MP4) != -1) {
			result = AttTypeConstant.C_iAttType_MP4;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_PDF) != -1) {
			result = AttTypeConstant.C_iAttType_PDF;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_PNG) != -1) {
			result = AttTypeConstant.C_iAttType_PIC;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_PPTX) != -1) {
			result = AttTypeConstant.C_iAttType_PPTX;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_TXT) != -1) {
			result = AttTypeConstant.C_iAttType_TXT;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_WPS) != -1) {
			result = AttTypeConstant.C_iAttType_WPS;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_XLSX) != -1) {
			result = AttTypeConstant.C_iAttType_XLSX;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_VISIO) != -1) {
			result = AttTypeConstant.C_iAttType_VISIO;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_RAR) != -1) {
			result = AttTypeConstant.C_iAttType_RAR;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_ZIP) != -1) {
			result = AttTypeConstant.C_iAttType_ZIP;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_TIF) != -1) {
			result = AttTypeConstant.C_iAttType_TIF;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_BMP) != -1) {
			result = AttTypeConstant.C_iAttType_PIC;
		} else if (locSuffix.indexOf(AttTypeConstant.C_sAttType_MOV) != -1) {
			result = AttTypeConstant.C_iAttType_MOV;
		}
	}
	return result;
}

function getAssociateType(aAssociateType) {
	var result = AttTypeConstant.C_iAttType_DEFAULT;
	if (aAssociateType == C_iArchiveType_Flow) {
		result = AttTypeConstant.C_iAttType_FLOW;
	} else if (aAssociateType == C_iArchiveType_Html) {
		result = AttTypeConstant.C_iAttType_HTML;
	} else if (aAssociateType == C_iArchiveType_Word) {
		result = AttTypeConstant.C_iAttType_DOCX;
	} else if (aAssociateType == C_iArchiveType_Excel) {
		result = AttTypeConstant.C_iAttType_XLSX;
	} else if (aAssociateType == C_iArchiveType_Wps) {
		result = AttTypeConstant.C_iAttType_WPS;
	} else if (aAssociateType == C_iArchiveType_Et) {
		result = AttTypeConstant.C_iAttType_ET;
	} else if (aAssociateType == C_iArchiveType_Document) {
		result = AttTypeConstant.C_iAttType_DOCUMENT;
	} else if (aAssociateType == C_iArchiveType_Plan) {
		result = AttTypeConstant.C_iAttType_PLAN;
	} else if (aAssociateType == C_iArchiveType_Conference) {
		result = AttTypeConstant.C_iAttType_CONFERENCE;
	} else if (aAssociateType == C_iArchiveType_Discussion) {
		result = AttTypeConstant.C_iAttType_DISCUSSION;
	} else if (aAssociateType == C_iArchiveType_Survey) {
		result = AttTypeConstant.C_iAttType_SURVEY;
	} else if (aAssociateType == C_iArchiveType_Bulletin) {
		result = AttTypeConstant.C_iAttType_BULLETIN;
	} else if (aAssociateType == C_iArchiveType_News) {
		result = AttTypeConstant.C_iAttType_NEWS;
	}else if(aAssociateType = C_iArchiveType_Form){
		result = AttTypeConstant.C_iArchiveType_Form;
	}
	return result;
}

function getIPadFormICONPath(aAttType) {
	var path = "";
	switch (aAttType) {
	case AttTypeConstant.C_iAttType_DEFAULT:
		path = "ic_unkown_16.png";
		break;
	case AttTypeConstant.C_iAttType_AMR:
		path = "ic_video_16.png";
		break;
	case AttTypeConstant.C_iAttType_CAF:
		path = "ic_video_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCX:
		path = "ic_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_ET:
		path = "ic_et_16.png";
		break;
	case AttTypeConstant.C_iAttType_PIC:
		path = "ic_picture_16.png";
		break;
	case AttTypeConstant.C_iAttType_HTML:
		path = "ic_htm_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP3:
		path = "ic_mp3_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP4:
		path = "ic_mp4_16.png";
		break;
	case AttTypeConstant.C_iAttType_PDF:
		path = "ic_pdf_16.png";
		break;
	case AttTypeConstant.C_iAttType_PPTX:
		path = "ic_ppt_16.png";
		break;
	case AttTypeConstant.C_iAttType_TXT:
		path = "ic_txt_16.png";
		break;
	case AttTypeConstant.C_iAttType_WPS:
		path = "ic_wps_16.png";
		break;
	case AttTypeConstant.C_iAttType_XLSX:
		path = "ic_xls_16.png";
		break;
	case AttTypeConstant.C_iAttType_FLOW:
		path = "ic_col_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCUMENT:
		path = "ic_off_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_BULLETIN:
		path = "ic_ann_16.png";
		break;
	case AttTypeConstant.C_iAttType_NEWS:
		path = "ic_news_16.png";
		break;
	case AttTypeConstant.C_iAttType_PLAN:
		path = "ic_plan_16.png";
		break;
	case AttTypeConstant.C_iAttType_CONFERENCE:
		path = "ic_metting_16.png";
		break;
	case AttTypeConstant.C_iAttType_DISCUSSION:
		path = "ic_discuss_16.png";
		break;
	case AttTypeConstant.C_iAttType_SURVEY:
		path = "ic_survey_16.png";
		break;
	case AttTypeConstant.C_iAttType_VISIO:
		path = "ic_vsd_16.png";
		break;
	case AttTypeConstant.C_iAttType_RAR:
		path = "ic_rar_16.png";
		break;
	case AttTypeConstant.C_iAttType_ZIP:
		path = "ic_zip_16.png";
		break;
	case AttTypeConstant.C_iAttType_TIF:
		path = "ic_tif_16.png";
		break;
	case AttTypeConstant.C_iAttType_MOV:
		path = "ic_mov_16.png";
		break;
	case AttTypeConstant.C_iArchiveType_Form:
		path = "ic_form_16.png";
		break;
	}
	return path;
}

function getIPhoneFormICONPath(aAttType) {
	var path = "";
	switch (aAttType) {
	case AttTypeConstant.C_iAttType_DEFAULT:
		path = "ic_unkown_16.png";
		break;
	case AttTypeConstant.C_iAttType_AMR:
		path = "ic_video_16.png";
		break;
	case AttTypeConstant.C_iAttType_CAF:
		path = "ic_video_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCX:
		path = "ic_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_ET:
		path = "ic_et_16.png";
		break;
	case AttTypeConstant.C_iAttType_PIC:
		path = "ic_picture_16.png";
		break;
	case AttTypeConstant.C_iAttType_HTML:
		path = "ic_htm_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP3:
		path = "ic_mp3_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP4:
		path = "ic_mp4_16.png";
		break;
	case AttTypeConstant.C_iAttType_PDF:
		path = "ic_pdf_16.png";
		break;
	case AttTypeConstant.C_iAttType_PPTX:
		path = "ic_ppt_16.png";
		break;
	case AttTypeConstant.C_iAttType_TXT:
		path = "ic_txt_16.png";
		break;
	case AttTypeConstant.C_iAttType_WPS:
		path = "ic_wps_16.png";
		break;
	case AttTypeConstant.C_iAttType_XLSX:
		path = "ic_xls_16.png";
		break;
	case AttTypeConstant.C_iAttType_FLOW:
		path = "ic_col_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCUMENT:
		path = "ic_off_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_BULLETIN:
		path = "ic_ann_16.png";
		break;
	case AttTypeConstant.C_iAttType_NEWS:
		path = "ic_news_16.png";
		break;
	case AttTypeConstant.C_iAttType_PLAN:
		path = "ic_plan_16.png";
		break;
	case AttTypeConstant.C_iAttType_CONFERENCE:
		path = "ic_metting_16.png";
		break;
	case AttTypeConstant.C_iAttType_DISCUSSION:
		path = "ic_discuss_16.png";
		break;
	case AttTypeConstant.C_iAttType_SURVEY:
		path = "ic_survey_16.png";
		break;
	case AttTypeConstant.C_iAttType_VISIO:
		path = "ic_vsd_16.png";
		break;
	case AttTypeConstant.C_iAttType_RAR:
		path = "ic_rar_16.png";
		break;
	case AttTypeConstant.C_iAttType_ZIP:
		path = "ic_zip_16.png";
		break;
	case AttTypeConstant.C_iAttType_TIF:
		path = "ic_tif_16.png";
		break;
	case AttTypeConstant.C_iAttType_MOV:
		path = "ic_mov_16.png";
		break;
	case AttTypeConstant.C_iArchiveType_Form:
		path = "ic_form_16.png";
		break;
	}
	return path;
}

function getAndroidPhoneFormICONPath(aAttType) {
	var path = "";
	switch (aAttType) {
	case AttTypeConstant.C_iAttType_DEFAULT:
		path = "ic_unkown_16.png";
		break;
	case AttTypeConstant.C_iAttType_AMR:
		path = "ic_video_16.png";
		break;C_iAttType_DEFAULT
	case AttTypeConstant.C_iAttType_CAF:
		path = "ic_video_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCX:
		path = "ic_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_ET:
		path = "ic_et_16.png";
		break;
	case AttTypeConstant.C_iAttType_PIC:
		path = "ic_picture_16.png";
		break;
	case AttTypeConstant.C_iAttType_HTML:
		path = "ic_htm_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP3:
		path = "ic_mp3_16.png";
		break;
	case AttTypeConstant.C_iAttType_MP4:
		path = "ic_mp4_16.png";
		break;
	case AttTypeConstant.C_iAttType_PDF:
		path = "ic_pdf_16.png";
		break;
	case AttTypeConstant.C_iAttType_PPTX:
		path = "ic_ppt_16.png";
		break;
	case AttTypeConstant.C_iAttType_TXT:
		path = "ic_txt_16.png";
		break;
	case AttTypeConstant.C_iAttType_WPS:
		path = "ic_wps_16.png";
		break;
	case AttTypeConstant.C_iAttType_XLSX:
		path = "ic_xls_16.png";
		break;
	case AttTypeConstant.C_iAttType_FLOW:
		path = "ic_col_16.png";
		break;
	case AttTypeConstant.C_iAttType_DOCUMENT:
		path = "ic_off_doc_16.png";
		break;
	case AttTypeConstant.C_iAttType_BULLETIN:
		path = "ic_ann_16.png";
		break;
	case AttTypeConstant.C_iAttType_NEWS:
		path = "ic_news_16.png";
		break;
	case AttTypeConstant.C_iAttType_PLAN:
		path = "ic_plan_16.png";
		break;
	case AttTypeConstant.C_iAttType_CONFERENCE:
		path = "ic_metting_16.png";
		break;
	case AttTypeConstant.C_iAttType_DISCUSSION:
		path = "ic_discuss_16.png";
		break;
	case AttTypeConstant.C_iAttType_SURVEY:
		path = "ic_survey_16.png";
		break;
	case AttTypeConstant.C_iAttType_VISIO:
		path = "ic_vsd_16.png";
		break;
	case AttTypeConstant.C_iAttType_RAR:
		path = "ic_rar_16.png";
		break;
	case AttTypeConstant.C_iAttType_ZIP:
		path = "ic_zip_16.png";
		break;
	case AttTypeConstant.C_iAttType_TIF:
		path = "ic_tif_16.png";
		break;
	case AttTypeConstant.C_iAttType_MOV:
		path = "ic_mov_16.png";
		break;
	case AttTypeConstant.C_iArchiveType_Form:
		path = "ic_form_16.png";
		break;
	}
	return path;
}

function getAndroidPadFormICONPath(aAttType) {
	// TODO there is not client of android pad,so this method needn't implement
	// in this version.
	return getAndroidPhoneFormICONPath(aAttType);
}

function getFormICONPathByAttObj(att) {
	var type = null;
	var aFilename = att.name;
	if (att.moduleType == C_iModuleType_Archive
			&& att.type != C_iArchiveType_File) {
		type = getAssociateType(att.type);
	} else if (att.moduleType == C_iModuleType_Collaboration) {
		type = AttTypeConstant.C_iAttType_FLOW;
	} else if (att.moduleType == C_iModuleType_EDoc) {
		type = AttTypeConstant.C_iAttType_DOCUMENT;
	} else if (att.moduleType == C_iArchiveType_Conference) {
		type = AttTypeConstant.C_iAttType_CONFERENCE;
	} else {
		type = getFileType(aFilename);
	}

	return getFormICONPathByType(type);
}

function getFormICONPathByFileName(fileName) {
	var type = getFileType(fileName);
	return getFormICONPathByType(type);
}

function getFormICONPathByType(type) {
	var path = "";
	if (clientType == C_sClientType_Ipad) {
		path = getIPadFormICONPath(type);
	} else if (clientType == C_sClientType_Iphone) {
		path = getIPhoneFormICONPath(type);
	} else if (clientType == C_sClientType_AndroidPhone) {
		path = getAndroidPhoneFormICONPath(type);
	} else if (clientType == C_sClientType_AndroidPad) {
		path = getAndroidPadFormICONPath(type);
	}
	return path;
}

// ========字符串处理工具===========
/**
 * 去掉字符串中的HTML标签
 */
String.prototype.stripHTML = function() {
	var reTag = /<(?:.|\s)*?>/g;
	return this.replace(reTag, "");
};

function parseDateForM1(str) {
	if (typeof str == 'string' && str.length > 10) {
        return str.substring(0, 10);
      }
      return str;
}

/*
 * =========================================== 表单对话框，进度条消息
 * ===========================================
 */
	var C_iDialogType_Top = 1;//顶部提示
	var C_iDialogType_Pop = 2;//弹出框提示
    dialogMsg = function(title, msg, type) {
        var commandValue = new Object();
        commandValue.title = title;
        commandValue.msg = msg;
        commandValue.type = type;
        top.cmp.notification.alert(msg,null,title);
    };

    progressBar = function(open, msg) {
//        var commandValue = new Object();
//        commandValue.open = open;
//        commandValue.msg = msg;
//        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ProgressBar, commandValue);
//        requestClientWithParameter(commandStr);
        top.cmp.dialog.loading(open);
    };
    
	toUnicode = function(str) { 
        return escape(str).replace(/%/g,"\\").toLowerCase(); 
	}