/**
 * @author:nigel
 * @date 3/24/2011
 */

/**
 * master from define mapping,key is field id,value is form define object
 */
var mffdMap = null;

/**
 * master form vlaue mapping,key is field id,vlaue is form value object
 */
var mffvMap = null;

/**
 * subordinate form define mapping,key is field id of all subordinate form,vlaue
 * is form define object
 */
var sffdMap = null;

/**
 * subordinate form id to field id array mapping,key is form id,value is
 * corresponding form field array
 */
var sffListMap = null;

/**
 * subordinate form id to row id mapping,key is form id,value is row id
 */
var sfrMap = null;

/**
 * subordinate form vlaue mapping,key is field id of all subordinate form,value
 * is form vaule object array
 */
var sffvListMap = null;

/**
 * 
 */
var ffWHMap = null;

/**
 * save edit state for every suborindate form.key is subordinate form id,value
 * is edit state of correponding form.
 * 
 * C_sFormEditState_None: not edit all field,so subordinate form rows can't add
 * or delete
 * 
 * C_sFormEditState_Requirement: can edit some fields,but another fields of the
 * corresponding form can't edited is requirement,so subordinate form rows can't
 * add or delete
 * 
 * C_sFormEditState_Unrequirement: can edit some fields and another fields of
 * the corresponding form can't edited isn't requirement,so subordinate form
 * rows can add or delete,but the rows come from can't be delete
 * 
 * C_sFormEditState_All: can edit all fields,so subordinate form rows can add or
 * delete,but the rows come from can't be delete
 */
var sfesMap = null;

/**
 * if the subordinate form id is empty string,then subordinate form id is
 * C_sForm_DefaultID
 */
var C_sForm_DefaultID = "defaultID";

/**
 * can't not edit all field,so subordinate form rows can't add or delete
 */
var C_iFormEditState_None = 0;

/**
 * can edit some fields,but another fields of the corresponding form can't
 * edited is requirement,so subordinate form rows can't add or delete
 */
var C_iFormEditState_Requirement = 1;

/**
 * can edit some fields and another fields of the corresponding form can't
 * edited isn't requirement,so subordinate form rows can add or delete,but the
 * rows come from can't be delete
 * 
 */
var C_iFormEditState_UnRequirement = 2;

/**
 * handle state
 */
var C_iFormWorkFlag_ToDo = 0;

/**
 * handle state
 */
var C_iFormWorkFlag_Done = 1;

/**
 * handle state
 */
var C_iFormWorkFlag_DoException = 2;

/**
 * handle state
 */
var C_iFormWorkFlag_Doing = 3;

/**
 * field of form state,the field is invisible to user
 */
var C_iFieldAccess_Invisible = 0;

/**
 * field of form state,the field is read only to user
 */
var C_iFieldAccess_Readonly = 1;

/**
 * field of form state,the field is editable to user
 */
var C_iFieldAccess_Editable = 2;

/**
 * field of form state,the field is append to user
 */
var C_iFieldAccess_Append = 3;

/**
 * form control display ways——html text,without any event callback
 */
var C_iFieldCtrlDisplay_HTML = 0;

/**
 * form control display ways——form control but not editable
 */
var C_iFieldCtrlDisplay_CtrlReadonly = 1;

/**
 * form control display ways——form control and editable
 */
var C_iFieldCtrlDisplay_CtrlEditable = 2;

/**
 * string of data type of field
 */
var C_iFieldDataType_String = 0;

/**
 * integer of data type of field
 */
var C_iFieldDataType_Integer = 1;

/**
 * decimal of data type of field
 */
var C_iFieldDataType_Decimal = 2;

/**
 * date of data type of field
 */
var C_iFieldDataType_Date = 3;

/**
 * date time of data type of field
 */
var C_iFieldDataType_DateTime = 4;

/**
 * bool of data type of field
 */
var C_iFieldDataType_Boolean = 5;

/**
 * enum of data type of field
 */
var C_iFieldDataType_Enumeration = 6;

/**
 * running number of data type of field
 */
var C_iFieldDataType_RunningNumber = 7;

/**
 * picture of data type of field
 */
var C_iFieldDataType_Picture = 8;

/**
 * attachment of data type of field
 */
var C_iFieldDataType_Attatchment = 9;

var C_iFieldDataType_Signature = 10;

/**
 * text of input control
 */
var C_iFieldControlType_Text = 1;

/**
 * textarea of control
 */
var C_iFieldControlType_TextArea = 2;

/**
 * radio of input control
 */
var C_iFieldControlType_Radio = 3;

/**
 * checkbox of control
 */
var C_iFieldControlType_CheckBox = 4;

/**
 * select of control for single
 */
var C_iFieldControlType_SelectSingle = 5;

/**
 * select of control for multiple
 */
var C_iFieldControlType_SelectMulti = 6;

/**
 * exend of control
 */
var C_iFieldControlType_ExtendControl = 100;

var C_iFieldExtendControlType_ChoosePerson = 1;

var C_iFieldExtendControlType_ChooseDepartment = 2;

var C_iFieldExtendControlType_ChooseOtype = 3;

var C_iFieldExtendControlType_ChooseOccupation = 4;

var C_iFieldExtendControlType_ChooseDate = 5;

var C_iFieldExtendControlType_ChooseDateTime = 6;

var C_iFieldExtendControlType_ChoosePicture = 7;

var C_iFieldExtendControlType_ChooseAttachment = 8;

var C_iFieldExtendControlType_ChooseCompany = 9;

var C_iFieldExtendControlType_ChooseHRArchive = 10;

var C_iFieldExtendControlType_Append = 11;

var C_iFieldExtendControlType_Signature = 12;

var C_sCommonFieldValue_Invisible = "<font color=#000099 size=2></font>";

/**
 * subordinate form edit state——Uneditable
 */
var C_iSubFormEditState_None = 1;

/**
 * subordinate form edit state——Can add rows only
 */
var C_iSubFormEditState_AddOnly = 2;

/**
 * subordinate form edit state——Can delete rows only
 */
var C_iSubFormEditState_DeleteOnly = 3;

/**
 * subordinate form edit state——Editable
 */
var C_iSubFormEditState_All = 4;

/**
 * use to add assistance attribute to field of subordinate form, key is form
 * id,value is assistance index of correponding form.
 */
var sffIndexMap = null;

/**
 * current selected row of subordinate form
 */
var sfCRow = null;

/**
 * prefix of assistance id for field of subordinate form.
 */
var C_sSubFF_AssistIDPrefix = "assist";

var C_sSubFF_AsssitIDAttr = "assistID";

var C_sSubFR_AssistID = "aFormID";

var C_sSubFR_ExistID = "aExistID";

var C_sSubFF_RecordID = "recordID";

var C_sSubFF_State = "aState";

var C_sSubFFState_Add = "add";

var C_sSubFFState_Update = "update";

var C_sSubFFState_Delete = "delete";

var sfrOB = null;

/**
 * hidden input for image or attachment control,this value as a auto generate
 * assistance id for add or delete attachment
 */
var fEHAIndex = 0;

/**
 * 附件控件辅助属性的值前缀
 */
var C_sFormAttachment_AssistPrefix = "att";

/**
 * 附件控件的辅助属性
 */
var C_sFormAttachment_AssistAttr = "attgroup";

/**
 * 是附件的标志
 */
var C_sFormAttachment_Sign = "attValue";

/**
 * 附件的关联ID
 */
var C_sFormAttachment_AssociateIDAttr = "associateID";

/**
 * 附件的关联类型
 */
var C_sFormAttachment_AssociateTypeAttr = "associateType";

var C_sFormAttachmentSignValue_UploadIcon = 0;

var C_sFormAttachmentSignValue_HiddenInput = 1;

var C_sFormAttachmentSignValue_ImgList = 2;

var C_sFormAttachmentSignValue_DelIcon = 3;

var C_sFormAttachmentSignValue_TextArea = 4;

var C_sSystemAutoSign = "{{{auto}}}";

var isSupportHandle = true;

var isLoadComplete = false;

var attEventBindMap = null;

var toParseSignatureMap = null;

/**
 * android手机客户端
 */
var C_sClientType_AndroidPhone = "androidphone";

/**
 * android平板客户端
 */
var C_sClientType_AndroidPad = "androidpad";

/**
 * iphone客户端
 */
var C_sClientType_Iphone = "iphone";

/**
 * ipad客户端
 */
var C_sClientType_Ipad = "ipad";
var  m_documentType_ = "";
$(function() {
    initAajxGobalAttr();
    ffWHMap = new Map();
    attEventBindMap = new Map();
    toParseSignatureMap = new Map();
    createMffdMapping();
    createMffvMapping();
    fillData2MasterForm();
    bindOpinionAttEvent();
    removeContentLinkBtn();
    htmlSignatureM1();
    initIsignature();
    isLoadComplete = true;
});

function initIsignature(){
	var reg=new RegExp("\\.","g");
	var versionNum = parseInt(version.replace(reg,""));
	if(typeof m_documentType != "undefined" && versionNum >=560 ) {
		m_documentType_ = "|" + m_documentType;
	}
	var  moveable1 = true;
	if(typeof pendingFlag != "undefined" && pendingFlag =="false"){
		moveable1 = false;
	}
	
	if(typeof iSP != "undefined" && typeof summaryID  !="undefined") {
				var protecteData = getFieldVals4hw();
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
	
}
//执行签章功能
function showSignatureButton(keySn,summaryID){
	if(typeof iSP == "undefined" || typeof summaryID == "undefined") {
		   return;
	   }
	var id;
	var trs = $("body").find("span");
	for(var i= 0 ;i<trs.length;i++){
		var temp  =$(trs[i]);
		var length = temp.find("div[id ^= 'signDiv']").length;
		if(length == 0) {
			id = temp.attr("id");
			if(id){
				break;
			} else {
				continue;
			}
		} else {
			continue;
		}
	}
	
	//签章必须的参数
	var runSignatureParams={
		keySN:keySn,//签章服务的keysn,获取key文件名称,不包括后缀名,所有key文件存放在WEB-INF/key文件
		documentId:summaryID+ m_documentType_,//文档ID
		documentName:"",//不是必须参数
		elemId:id,//指定定位的页面元素的id,不仅限div元素,所有html元素都可以.
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
}
//移除签章功能
function showRemoveSignatureButton(){
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
}

function removeContentLinkBtn() {
    if (isA8Server()) {

    } else {
        $("#titleLink").remove();
    }
}

/**
 * 
 * @param {Number}
 *                aHeight
 * @param {Number}
 *                aWidth
 * @memberOf {TypeName}
 */
var FieldStyle = function(aHeight, aWidth, aStyle, aClass) {
    this.height = aHeight;
    this.width = aWidth;
    this.style = aStyle;
    this.sClass = aClass;
};

/**
 * create master form mapping,key is field's id, vaule is field's define
 */
function createMffdMapping() {
    var locMfd = sourceData.docFormDefine;
    var locMffdList = locMfd.fieldDefine;
    mffdMap = new Map();

    var locMffdLen = locMffdList.length;
    for ( var i = 0; i < locMffdLen; i++) {
        var locMffd = locMffdList[i];
        adaterA8FieldDefine(locMffd);
        mffdMap.put(locMffd.fieldID, locMffd);
    }
}

function adaterA8FieldDefine(aFieldDefine) {
    if (isA8Server()) {
        var locDataType = aFieldDefine.dataType;
        var locCtrlType = aFieldDefine.controlType;
        var locExtendFieldDefine = null;
        if (locDataType == C_iFieldDataType_Date) {
            locExtendFieldDefine = new ExtendFieldDefine(C_iFieldExtendControlType_ChooseDate, null, null, true);
        } else if (locDataType == C_iFieldDataType_DateTime) {
            locExtendFieldDefine = new ExtendFieldDefine(C_iFieldExtendControlType_ChooseDateTime, null, null, true);
        } else if (locDataType == C_iFieldDataType_Signature) {
            locExtendFieldDefine = new ExtendFieldDefine(C_iFieldExtendControlType_Signature, null, null, true);
        }

        if (locCtrlType == -1) {
            aFieldDefine.controlType = 1;
        }
        if (locExtendFieldDefine != null) {
            aFieldDefine.controlType = C_iFieldControlType_ExtendControl;
            aFieldDefine.extendFieldDefine = locExtendFieldDefine;
        }
    }
    return aFieldDefine;
}

/**
 * 表单扩展控件对象
 * 
 * @param aID
 * @param aIconURL
 * @param aDataURL
 * @param aIsSupport
 * @returns
 */
var ExtendFieldDefine = function(aID, aIconURL, aDataURL, aIsSupport) {
    this.id = aID;
    this.iconURL = aIconURL;
    this.dataURL = aDataURL;
    this.isSupport = aIsSupport;
};

function createMffvMapping() {
    mffvMap = new Map();
    var locMfv = sourceData.docFormRecords;
    if (locMfv != null) {
        var locMffvList = locMfv.fieldValueList;

        var locMffvLen = locMffvList.length;
        for ( var i = 0; i < locMffvLen; i++) {
            var locMffv = locMffvList[i];
            mffvMap.put(locMffv.fieldID, locMffv);
        }
    }
}

/**
 * fill data to field of master form,if master no data then need to generate
 * dummy data for control initializing
 */
function fillData2MasterForm() {
    var locMffIDList = mffdMap.keyArray();
    var locMffIDLen = locMffIDList.length;
    if (!mffvMap.isEmpty()) {
        for ( var i = 0; i < locMffIDLen; i++) {
            var locMffd = mffdMap.get(locMffIDList[i]);
            var locMffv = mffvMap.get(locMffIDList[i]);
            var locMffID = locMffd.fieldID;
            if (!ffWHMap.containsKey(locMffID)) {
                var locOldSffObj = $(getJQuerySelectorByAttr("id", locMffID));
                var locHeight = locOldSffObj.attr("offsetHeight");
                var locWidth = locOldSffObj.attr("offsetWidth");
                var locFieldStyle = new FieldStyle(locHeight, locWidth);
                ffWHMap.put(locMffID, locFieldStyle);
            }
            var locMffo = $(getJQuerySelectorByID(locMffID));
            fillData2Field(locMffd, locMffv, locMffo);
        }
    } else {
        /*
         * if master form hasn't any data,in order to init control here need
         * generate dummy data
         */
        for ( var i = 0; i < locMffIDLen; i++) {
            var locMffd = mffdMap.get(locMffIDList[i]);
            var locMffID = locMffd.id;
            if (!ffWHMap.containsKey(locMffID)) {
                var locOldSffObj = $(getJQuerySelectorByAttr("id", locMffID));
                var locHeight = locOldSffObj.attr("offsetHeight");
                var locWidth = locOldSffObj.attr("offsetWidth");
                var locFieldStyle = new FieldStyle(locHeight, locWidth);
                ffWHMap.put(locMffID, locFieldStyle);
            }
            var locMffv = new FormFieldValue(locMffID, "", "", "", "", "", "");
            var locMffo = $(getJQuerySelectorByID(locMffID));
            fillData2Field(locMffd, locMffv, locMffo);
        }
    }
}

var C_sHTMLTag_Font = "<font/>";
var C_sHTMLTag_Input = "<input/>";
var C_sHTMLTag_Select = "<select/>";
var C_sHTMLTag_TextArea = "<textarea/>";
var C_sHTMLTag_Img = "<img/>";
var C_sHTMLTag_Link = "<a/>";
var C_sHTMLTag_NewLine = "<br/>";
var C_sHTMLTag_Div = "<div/>";

var C_sInputTypeAttr_Text = "text";
var C_sInputTypeAttr_CheckBox = "checkbox";
var C_sInputTypeAttr_Radio = "radio";

var C_sSelectOption_Option = "<option/>";

var C_sCheckBoxOrRadioValue_Checked = "\u221a";
var C_sCheckBoxOrRadioValue_Unchecked = "\u00d7";

var C_sDefaultStyle_Color = "#000099";
var C_sAlertStyle_Color = "red";
var C_iDefaultStyle_FontSize = 12;

// 表单附件常量定义
/**
 * 关联文档状态——协同已发
 */
var C_iAssociateSate_Flow_Send = 101;

/**
 * 关联文档状态——协同已办
 */
var C_iAssociateSate_Flow_Done = 102;

/**
 * 关联文档状态——协同待办
 */
var C_iAssociateSate_Flow_Todo = 103;

/**
 * 关联文档状态——文档中的上传文件/对应协同一般文件
 */
var C_iAssociateSate_Archive_UploadFile = 201;

/**
 * 关联文档状态——文档中的协同即归档协同
 */
var C_iAssociateSate_Archive_Flow = 202;

/**
 * 关联文档状态——文档中的在线创建的HTML
 */
var C_iAssociateSate_Archive_OnlineHTML = 203;

/**
 * 关联文档状态——文档中的在线创建的Word
 */
var C_iAssociateSate_Archive_OnlineWord = 204;

/**
 * 关联文档状态——文档中的在线创建的Excel
 */
var C_iAssociateSate_Archive_OnlineExcel = 205;

/**
 * 关联文档状态——文档中的在线创建的WPS
 */
var C_iAssociateSate_Archive_OnlineWPS = 206;

/**
 * 关联文档状态——文档中的在线创建的ET
 */
var C_iAssociateSate_Archive_OnlineET = 207;
/**
 * 关联文档状态——文档中的公文
 */
var C_iAssociateSate_Archive_Document = 208;
/**
 * 关联文档状态——文档中的计划
 */
var C_iAssociateSate_Archive_Plan = 209;
/**
 * 关联文档状态——文档中的会议
 */
var C_iAssociateSate_Archive_Conference = 210;
/**
 * 关联文档状态——文档中的讨论
 */
var C_iAssociateSate_Archive_Discussion = 211;
/**
 * 关联文档状态——文档中的调查
 */
var C_iAssociateSate_Archive_Survey = 212;
/**
 * 关联文档状态——文档中的公告
 */
var C_iAssociateSate_Archive_Bulletin = 213;
/**
 * 关联文档状态——文档中的新闻
 */
var C_iAssociateSate_Archive_News = 214;
/**
 * 关联项目状态——创建
 */
var C_iAssociateSate_Project_Create = 301;
/**
 * 关联项目状态——开始
 */
var C_iAssociateSate_Project_Begin = 302;
/**
 * 关联项目状态——进行中
 */
var C_iAssociateSate_Project_Option = 303;
/**
 * 关联项目状态——完成
 */
var C_iAssociateSate_Project_Close = 304;
/**
 * 关联项目状态——终止
 */
var C_iAssociateSate_Project_Stop = 305;
/**
 * 关联项目状态——删除
 */
var C_iAssociateSate_Project_Delete = 306;

/**
 * 获取普通字段的显示值和返回值
 * 
 * @param aFieldValue
 * @returns 返回一个长度为2的数组，第一个元素是field的显示值，第二个字段是field的返回值
 */
function getCommonFieldValue(aFieldDefine, aFieldValue) {
    var locTmpValue = aFieldValue.value;
    var result = null;

    var locRVList = locTmpValue.returnValueList;
    if (!isNullValue(locRVList) && !isUndefinedValue(locRVList)) {
        var locLen = locRVList.length;
        var locRSDVList = new Array();
        var locRSRVList = new Array();
        var locAssistIDList = new Array();
        var locAssistTypeList = new Array();
        var locLastModifyList = new Array();
        var locArchiveList = new Array();
        for ( var i = 0; i < locLen; i++) {
            var locCrtFV = locRVList[i];
            var locTmpDV = locCrtFV.displayName;
            var locTmpRV = locCrtFV.returnValue;
            var locTmpAssistID = locCrtFV.assistValue;
            var locTmpAssistType = locCrtFV.assistType;
            var locTmpLastModify = locCrtFV.modifyTime;
            var locTmpArchiveID = locCrtFV.archiveID;
            
            locTmpDV = locTmpDV.replace(new RegExp("\r\n", "g"), "<br/>").replace(new RegExp("\n", "g"), "<br/>");

            locRSDVList.push(locTmpDV);
            locRSRVList.push(locTmpRV);
            locAssistIDList.push(locTmpAssistID);
            locAssistTypeList.push(locTmpAssistType);
            locLastModifyList.push(locTmpLastModify);
            locArchiveList.push(locTmpArchiveID);
        }
        result = new Array();
        var locRSDVStr = joinStrBySpecSeparator(locRSDVList, "\u3001");
        var locRSRVStr = joinStrBySpecSeparator(locRSRVList);
        var locAssistIDStr = joinStrBySpecSeparator(locAssistIDList);
        var locAssistTypeStr = joinStrBySpecSeparator(locAssistTypeList);
        var locLastModifyStr = joinStrBySpecSeparator(locLastModifyList);
        var locArchiveStr = joinStrBySpecSeparator(locArchiveList);
        result.push(locRSDVStr);
        result.push(locRSRVStr);
        result.push(locAssistIDStr);
        result.push(locAssistTypeStr);
        result.push(locLastModifyStr);
        result.push(locArchiveStr);
    }

    return result;
}

/**
 * 文档字段值类型——普通
 */
var C_iDocFieldType_Common = 1;

/**
 * 文档字段值类型——意见
 */
var C_iDocFieldType_Opinion = 2;
/**
 * 不隐藏
 */
var C_iOpinionReplyState_NoHidden = 0;

/**
 * 对其他人隐藏
 */
var C_iOpinionReplyState_HiddenForOthers = 1;

/**
 * 对其他人及发起者隐藏
 */
var C_iOpinionReplyState_HiddenForOthersAndIssuer = 2;

/**
 * 意见隐藏显示的字符串
 */
var C_sOpinionReplyState_Hidden = "\u610f\u89c1\u9690\u85cf";

/**
 * 态度--无态度
 */
var C_iDealAttitude_Null = -1;

/**
 * 态度--同意
 */
var C_iDealAttitude_Agree = 0;
var C_sDealAttitude_Agree = "\u540c\u610f";

/**
 * 态度--不同意
 */
var C_iDealAttitude_Disagree = 1;
var C_sDealAttitude_Disagree = "\u4e0d\u540c\u610f";

/**
 * 态度--撤销流程
 */
var C_iDealAttitude_Cancel = 2;
var C_sDealAttitude_Cancel = "\u64a4\u9500";

/**
 * 态度--已阅
 */
var C_iDealAttitude_HaveRead = 3;
var C_sDealAttitude_HaveRead = "\u5df2\u9605";

/**
 * 态度--回退
 */
var C_iDealAttitude_StepBack = 4;
var C_sDealAttitude_StepBack = "\u56de\u9000";

/**
 * 态度--暂存待办
 */
var C_iDealAttitude_ZCDB = 5;
var C_sDealAttitude_ZCDB = "\u6682\u5b58\u5f85\u529e";

/**
 * 态度--终止
 */
var C_iDealAttitude_StepStop = 6;
var C_sDealAttitude_StepStop = "\u7ec8\u6b62";

/**
 * 审核通过
 */
var C_iFlowHandleAttitude_Pass = 6;
var C_sFlowHandleAttitude_Pass = "\u5ba1\u6838\u901a\u8fc7";
/**
 * 审核不通过
 */
var C_iFlowHandleAttitude_Choke = 7;
var C_sFlowHandleAttitude_Choke = "\u5ba1\u6838\u4e0d\u901a\u8fc7";

/**
 * 根据态度类型返回相应的显示字符串
 * 
 * @param aAttitudeType
 * @returns {String} 返回相应态度类型的显示字符串
 */
function getAttitudeStrByType(aAttitudeType) {
    var result = "";
    switch (parseInt(aAttitudeType)) {
    case C_iDealAttitude_Null:
        result = "";
        break;
    case C_iDealAttitude_Agree:
        result =getDealAttitude("C_sDealAttitude_Agree");
        break;
    case C_iDealAttitude_Disagree:
        result = getDealAttitude("C_sDealAttitude_Disagree");
        break;
    case C_iDealAttitude_Cancel:
        result = getDealAttitude("C_sDealAttitude_Cancel");
        break;
    case C_iDealAttitude_HaveRead:
        result = getDealAttitude("C_sDealAttitude_HaveRead");
        break;
    case C_iDealAttitude_ZCDB:
        result = getDealAttitude("C_sDealAttitude_ZCDB");
        break;
    case C_iDealAttitude_StepBack:
        result = getDealAttitude("C_sDealAttitude_StepBack");
        break;
    case C_iDealAttitude_StepStop:
        result = getDealAttitude("C_sDealAttitude_StepStop");
        break;
    }
    return result;
}
//公文获取意见 国际化处理方式
function getDealAttitude(key){
	var CTPLang = [];CTPLang['zh_CN']={
			"C_sDealAttitude_Agree":"同意",
			"C_sDealAttitude_Disagree":"不同意",
			"C_sDealAttitude_Cancel":"撤销流程",
			"C_sDealAttitude_HaveRead":"已阅",
			"C_sDealAttitude_ZCDB":"暂存待办",
			"C_sDealAttitude_StepBack":"回退",
			"C_sDealAttitude_StepStop":"终止",
			};
	CTPLang['zh_TW']={
			"C_sDealAttitude_Agree":"同意",
			"C_sDealAttitude_Disagree":"不同意",
			"C_sDealAttitude_Cancel":"撤銷流程",
			"C_sDealAttitude_HaveRead":"已閱",
			"C_sDealAttitude_ZCDB":"暫存待辦",
			"C_sDealAttitude_StepBack":"回退",
			"C_sDealAttitude_StepStop":"終止",
			};
	CTPLang['en']={
			"C_sDealAttitude_Agree":"Agree",
			"C_sDealAttitude_Disagree":"Disagree",
			"C_sDealAttitude_Cancel":"Cancel",
			"C_sDealAttitude_HaveRead":"HaveRead",
			"C_sDealAttitude_ZCDB":"Temporary abeyance",
			"C_sDealAttitude_StepBack":"StepBack",
			"C_sDealAttitude_StepStop":"StepStop",
			};
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
var C_sSignatureAssist_ID = "signature";
var C_sOpinion_Sign = "{{{opinionSign}}}";
var C_sSignatureAssist_PicName = "picSignatureName";

/**
 * 获取意见字段的显示值和返回值
 * 
 * @param aFieldValue
 * @returns 返回一个长度为2的数组，第一个元素是field的显示值，第二个字段是field的返回值
 */
/*function getOpinionFieldValue(aFieldDefine, aFieldValue) {
    var locFieldID = aFieldValue.fieldID;
    var locFieldObj = $("#" + locFieldID);
    var locTmpValue = aFieldValue.value;
    var locEdf = aFieldDefine.extendFieldDefine;
    var locET = null;
    
    if(locEdf != null && typeof locEdf != "undefined") {
        locET = locEdf.extendFieID;
    }
    
    var result = null;
    
    var locFat = parseInt(aFieldDefine.accessType);
    var enabled = 0;
    if(locFat == C_iFieldAccess_Editable) {
        enabled = 1;
    }

    var locRVList = locTmpValue.returnValueList;
    var locSourceSignatureData = locTmpValue.signatureData;
    var locRSDVList = null;
    if (!isNullValue(locRVList) && !isUndefinedValue(locRVList)) {
        var locLen = locRVList.length;
        locRSDVList = new Array();
        for ( var i = 0; i < locLen; i++) {
            var locCrtFV = locRVList[i];
            if (!isNullValue(locCrtFV) || !isUndefinedValue(locCrtFV) || !isEmptyValue(locCrtFV)) {
                var locRSDV = getOpinionDisplayStr(locCrtFV, locFieldID);
                locRSDVList.push(locRSDV);
            }
        }
    }

    var locRSDVStr = "";
    if(locRSDVList != null && locRSDVList.length > 0) {
        locRSDVStr = "<div style='color:black;font-size:12px;'>" + joinStrBySpecSeparator(locRSDVList, "<br>")
                + "</div>";
    }
    var locRSRVStr = null;

    if (locET != null && locET == C_iFieldExtendControlType_Signature) {
        var t = locFieldObj;
        var tj = new Object();
        tj.enabled = enabled;
        tj.objName = locFieldID;
        tj.recordId = summaryID;
        tj.type = "htmlSignature";
        tj.userName = currentUser.orgName;
        tj.signObj = locFieldObj[0];
        tj.signatureData = locSourceSignatureData;
        addSignatureCtrl(t,tj);
    }

    result = new Array();
    result.push(locRSDVStr);
    result.push(locRSRVStr);

    return result;
}*/
 
var preLeaveOpinionSign = "-9999";
var currentSignatureAreaID = null;
var signatureAreaIDMapping = null;
 
function getOpinionFieldValue(aFieldDefine, aFieldValue) {
	if(signatureAreaIDMapping == null) {
		signatureAreaIDMapping = new Map();
	}
    var locFieldID = aFieldValue.fieldID;
    var locFieldObj = $("#" + locFieldID);
    var locTmpValue = aFieldValue.value;
    var locEdf = aFieldDefine.extendFieldDefine;
    var locET = null;
    var support =true;
    if(locEdf != null && typeof locEdf != "undefined") {
        locET = locEdf.extendFieID;
		support =  locEdf.support;
    }
    
    var result = null;
    
    var locFat = parseInt(aFieldDefine.accessType);
    var enabled = 0;
    if(locFat == C_iFieldAccess_Editable) {
        enabled = 1;
    }

    var locRVList = locTmpValue.returnValueList;
    currentSignatureData = locTmpValue.signatureData;
    var locRSDVList = null;
    if (!isNullValue(locRVList) && !isUndefinedValue(locRVList)) {
        var locLen = locRVList.length;
        locRSDVList = new Array();
        for ( var i = 0; i < locLen; i++) {
            var locCrtFV = locRVList[i];
            
            
            
            if (!isNullValue(locCrtFV) || !isUndefinedValue(locCrtFV) || !isEmptyValue(locCrtFV)) {
            	//拼接一件，并且给签章预留显示区域
            	var locAffairID = locCrtFV.affairID;
            	var locSignatureAreaID = getEdocSignatureAreaID(locFieldID, locAffairID);
            	
            	var locSignatureArea = "";
            	var locRSDV = null;
            	
            	if(!signatureAreaIDMapping.containsKey(locSignatureAreaID) && support ) {
            		locSignatureArea = "<div><img id='" + locSignatureAreaID + "'/></div>";

            		signatureAreaIDMapping.put(locSignatureAreaID, "");
            	}
                if(locCrtFV.opinionID != preLeaveOpinionSign) {
                	locRSDV = getOpinionDisplayStr(locCrtFV, locFieldID);
                } else {
                	locRSDV = "";
                	currentSignatureAreaID = locSignatureAreaID;
                }
                
                locRSDV = locSignatureArea + locRSDV; 
				
                locRSDVList.push(locRSDV);
                
                //将签章加入到解析列表中
                var locSourceSignatureData = locCrtFV.signatureData;
            	var t = locFieldObj;
                var tj = new Object();
                tj.enabled = enabled;
                tj.objName = locSignatureAreaID;
                tj.recordId = summaryID;
                tj.type = "htmlSignature";
                tj.userName = currentUser.orgName;
                tj.signObj = locFieldObj[0];
                tj.signatureData = locSourceSignatureData;
				tj.support = support;
					addSignatureCtrl(t,tj);
            }
        }
    }

    var locRSDVStr = "";
    if(locRSDVList != null && locRSDVList.length > 0) {
        locRSDVStr = "<div style='color:black;font-size:12px;'>" + joinStrBySpecSeparator(locRSDVList, "<br>")
                + "</div>";
    }
    var locRSRVStr = null;

    /*if (locET != null && locET == C_iFieldExtendControlType_Signature) {
        var t = locFieldObj;
        var tj = new Object();
        tj.enabled = enabled;
        tj.objName = locFieldID;
        tj.recordId = summaryID;
        tj.type = "htmlSignature";
        tj.userName = currentUser.orgName;
        tj.signObj = locFieldObj[0];
        tj.signatureData = locSourceSignatureData;
        addSignatureCtrl(t,tj);
    }*/

    result = new Array();
    result.push(locRSDVStr);
   // result.push(locRSRVStr);

    return result;
}


function renderSignature() {
    if (toParseSignatureMap.size() > 0) {
        var locIDList = toParseSignatureMap.keyArray();
        var locIDLen = locIDList.length;
        for ( var i = 0; i < locIDLen; i++) {
            var locTmpID = locIDList[i];
            var locTmpData = toParseSignatureMap.get(locTmpID);
            var locTmpPic = getSignatureData(locTmpData);
            $(getJQuerySelectorByID(locTmpID)).html(locTmpPic);
        }
        toParseSignatureMap.clear();
    }
}

// 当在iOS平台上运行时，需要将renderSignature拆分成两个方法，1、向本地程序发送解析的数据请求，2提供一个方法供本地程序调用将解析的结果显示出来
/**
 * 请求命令格式如下：
 * [{"field":"shenpisignature","type":1,"assistID":"xxx","initValue":"signaturedata","command":3},{...}]
 * 
 */
function requestParseSignature() {
    if (toParseSignatureMap.size() > 0) {
        var locIDList = toParseSignatureMap.keyArray();
        var locIDLen = locIDList.length;
        var locSignatureList = new Array();
        for ( var i = 0; i < locIDLen; i++) {
            var locTmpID = locIDList[i];
            var locTmpData = toParseSignatureMap.get(locTmpID);
            var locSignature = new SignatureInfo(locTmpID, C_iSignatureHandleType_Parse, null, locTmpData);
            locSignatureList.push(locSignature);
        }

        var locSignatureObj = new Object();
        locSignatureObj.command = C_iInvokeNativeCtrl_Signature;
        locSignatureObj.signatureData = locSignatureList;

        var result = JSON.stringify(locSignatureObj);
        toParseSignatureMap.clear();
        location.href = ".?parameters_0123=" + result;
    }
}

var signatureData = null;
var timerID = null;

// 太bt了，靠
function bt() {
    if (signatureData != null) {
        sendSignaturePicListToWebView(signatureData);
        window.setTimeout("window.clearInterval(" + timerID + ")", 500);
    }
}

function assignSignatureDdata(aSignatureData) {
    signatureData = aSignatureData;
}

$(function() {
    if (toParseSignatureMap.size() > 0) {
        timerID = window.setInterval(bt, 500);
    }
})

function sendSignaturePicListToWebView(aResult) {
    if (!isUndefinedValue(aResult) && !isNullValue(aResult) && !isEmptyValue(aResult)) {
        var len = aResult.length;
        for ( var i = 0; i < len; i++) {
            var locTmpSignaturePicData = aResult[i];
            var locTmpID = locTmpSignaturePicData.field;
            if (locTmpID.indexOf(C_sSignatureAssist_ID) == -1) {
                locTmpID += C_sSignatureAssist_ID;
            }
            var locTmpPic = getSignatureDataDisplayStrEDoc(locTmpSignaturePicData);
            $(getJQuerySelectorByID(locTmpID)).html(locTmpPic);
        }
    }
}

function getSignatureData(aSourceData) {
    var result = null;
    if (!isNullValue(aSourceData) && !isEmptyValue(aSourceData) && !isUndefinedValue(aSourceData)) {
        var locSignature = parseSignatureData(aSourceData);
        result = getSignatureDataDisplayStrEDoc(locSignature);
    }
    return result;
}

var C_iPicDataType_Path = 1;
var C_iPicDataType_EncodingData = 2;

var C_iPicDataFormat_Gif = 1;
var C_sPicDataFormat_Gif = "data:image/gif;base64,";
var C_iPicDataFormat_Png = 2;
var C_sPicDataFormat_Png = "data:image/png;base64,";
var C_iPicDataFormat_Jpeg = 3;
var C_sPicDataFormat_Jpeg = "data:image/jpeg;base64,";
// TODO
var C_sPicErrorPath = "delete.gif";

/**
 * 根据返回的签章对象，生成签章的显示字符串，返回结果形如：
 * [{"field":"xxx","type":2,"picData":"xxx","picFormat":3,"errorPath":"xxxx"},{...}]
 * 
 * @param aSignature
 * @returns
 */
function getSignatureDataDisplayStrEDoc(aSignature) {
    var result = null;
    if (!isUndefinedValue(aSignature) && !isNullValue(aSignature) && !isEmptyValue(aSignature)) {
        var locSignature = null;
        try {
            locSignature = JSON.parse(aSignature);
        } catch (e) {
            locSignature = aSignature;
        }
        var locPicDataType = locSignature.type;
        var locPicData = locSignature.picData;
        var locPicFormat = locSignature.picFormat;
        var locerrorPicPath = locSignature.errorPath;

        result = "<IMG src=\"";
        if (locPicDataType == C_iPicDataType_EncodingData) {
            switch (locPicFormat) {
            case C_iPicDataFormat_Gif:
                result += C_sPicDataFormat_Gif;
                break;
            case C_iPicDataFormat_Png:
                result += C_sPicDataFormat_Png;
                break;
            case C_iPicDataFormat_Jpeg:
                result += C_sPicDataFormat_Jpeg;
                break;
            default:
                result += C_sPicDataFormat_Gif;
                break;
            }

            result += locPicData + "\"";
            if (!isUndefinedValue(locerrorPicPath) && !isEmptyValue(locerrorPicPath) && !isNullValue(locerrorPicPath)) {
                result += " onerror=\"src='" + locerrorPicPath + "';\"";
            } else {
                result += " onerror=\"src='" + C_sPicErrorPath + "';\"";
            }
        } else {
            result += locPicData + "\"";
        }
        result += "/>";
    }
    return result;
}

function getOpinionDisplayStr(aValue, aFieldID) {
    var locAttitude = getAttitudeStrByType(aValue.attitude);
    var locContent = nullToString(aValue.content, "");
    var locSignatureData = aValue.signatureData;
    /**
     * TODO  5.6 真人签章
     */
    var newline = aValue.newLine;
    var showTheRealSignature = aValue.showTheRealSignature;
    var proxy = aValue.proxy;
    if( typeof proxy == "undefined" ||proxy == null ) {
    	proxy = "&nbsp;&nbsp;";
    } else {
    	proxy = "&nbsp;&nbsp;"+proxy+"&nbsp;&nbsp;";
    }
    
    /**
	 * TODO  先判断是否存在  ，低版本兼容
	 */
    var locSignatureArea56 = "";
	if(showTheRealSignature != null && typeof showTheRealSignature != "undefined"){ 
    	if(showTheRealSignature == true || showTheRealSignature=='true') {
    		var theRealSignature = aValue.theRealSignature;
    		if(theRealSignature.indexOf("iVBO") == 0) {
    			/**
    			 * TODO  png
    			 * 
    			 */
        		locSignatureArea56 = "<img src='"+C_sPicDataFormat_Png+ theRealSignature + "'/>";
    		} else if (theRealSignature.indexOf("R0lG") == 0){
    			/**
    			 * TODO gif
    			 */

    			locSignatureArea56 = "<img src='"+C_sPicDataFormat_Gif+ theRealSignature + "'/>";
    		} else {

    			locSignatureArea56 = "<img src='"+C_sPicDataFormat_Jpeg+ theRealSignature + "'/>";
    		}
    		
    	} 
	} 
    
    var locHandlerName = aValue.handler.orgName;
    if (!isNullValue(locSignatureData) && isShowOpinionSignature(aFieldID)) {
        locHandlerName = locSignatureData;
    }
    var locTime = aValue.time;

    var locSep = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var result = null;
    if (isEmptyValue(locAttitude)) {	
		result = locContent + locSep + locHandlerName  + locSep +locSignatureArea56 + locSep + locTime;
    } else {
    	if(_locale =="en"){
    		if(newline != null && typeof newline != "undefined" &&(newline ==true || newline =='true')) {
    			result = "[" + locAttitude + "]" + locSep + locContent  + "<br/>" + locHandlerName  + locSep 
				+ locSignatureArea56 + locSep + proxy + locSep + locTime;
    		} else {
    			result = "[" + locAttitude + "]" + locSep + locContent  + locHandlerName  + locSep 
				+ locSignatureArea56 + locSep + proxy + locSep + locTime;
    		}
    	} else {
    		if(newline != null && typeof newline != "undefined" &&(newline ==true || newline =='true')) {
    			result = "\u3010" + locAttitude + "\u3011" + locSep + locContent  +  "<br/>"  + locHandlerName  + locSep +locSignatureArea56 + locSep + proxy + locSep + locTime;
    		} else {
    			result = "\u3010" + locAttitude + "\u3011" + locSep + locContent  +   locHandlerName  + locSep +locSignatureArea56 + locSep + proxy + locSep + locTime;
    		}
    		
    }
    }
    

    var att = getAttachmentDisplayStr(aValue);
    if (att != null) {
        result = result + "<br>" + att + "<br>";
    }
    return result;
}

function isShowOpinionSignature(aFieldID) {
    var locResult = false;
    if (!isA8Server()) {
        var locHWDivID = aFieldID + "DIV";
        var locObj = $(getJQuerySelectorByID(locHWDivID));
        if (locObj.length > 0) {
            var locHW = locObj.attr("hw");
            if ("true" == locHW) {
                locResult = true;
            }
        }
    }
    return locResult;
}

function getAttachmentDisplayStr(aValue) {
    var locAttList = aValue.attachments;
    var result = null;
    if (!isUndefinedValue(locAttList) && !isNullValue(locAttList) && !isEmptyValue(locAttList)) {
        var locLen = locAttList.length;
        var locRSDVList = new Array();
        for ( var i = 0; i < locLen; i++) {
            var locCrtAtt = locAttList[i];
            if (!isUndefinedValue(locCrtAtt) || !isNullValue(locCrtAtt) || !isEmptyValue(locCrtAtt)) {
                var locID = locCrtAtt.identifier;
                var locName = locCrtAtt.name;
                
                var locIconSignPath = getFormICONPathByAttObj(locCrtAtt);
                var locRSDV = "<br><img src='" + locIconSignPath + "' id='" + locID
                        + "'/><a style='color:#005599' id='" + locID + "'>" + locName + "</a>";
                locRSDVList.push(locRSDV);
                attEventBindMap.put(locID, locCrtAtt);
            }
        }

        if (locRSDVList.length > 0) {
            result = joinStrBySpecSeparator(locRSDVList, "<br>");
        }
    }
    return result;
}

function bindOpinionAttEvent() {
    if (attEventBindMap.size() > 0) {
        var locIDList = attEventBindMap.keyArray();
        var locIDLen = locIDList.length;
        for ( var i = 0; i < locIDLen; i++) {
            var locID = locIDList[i];
            var locAtt = attEventBindMap.get(locID);
            var locModuleType = locAtt.moduleType;
            var locCtrl = $(getJQuerySelectorByAttr("id", locID));
            if(locModuleType == C_iModuleType_AttachmentMgr) {
                var commandValue = new MAttOpenParameter(locAtt.sourceID, locAtt.name, locAtt.createDate, "", locAtt.modifyDate, C_iChooseFileType_File, locAtt.verifyCode);
                locCtrl.bind("click", {
                    param : commandValue
                }, function(event) {
                    var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAttachment, event.data.param);
                    requestClientWithParameter(commandStr);
                });
            } else {
                var commandValue = new MAssocOpenParameter(locAtt.archiveID,locAtt.name,locAtt.sourceID,locAtt.affairID,
                        locAtt.moduleType,locAtt.type,locAtt.createDate,locAtt.modifyDate,locAtt.size,locAtt.baseObjectID,true, locAtt.verifyCode);
                locCtrl.bind("click", {
                    param : commandValue
                }, function(event) {
                    var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_ShowAssoc, event.data.param);
                    requestClientWithParameter(commandStr);
                });
            }
        }
        attEventBindMap.clear();
    }
}

function getSpecColorStr(aColor, aStr) {
    return "<font color='" + aColor + "'>" + aStr + "</font>";
}

/**
 * 
 * 获取意见字段的显示值和返回值
 * 
 * @param aFieldValue
 * @returns 返回一个长度为2的数组，第一个元素是field的显示值，第二个字段是field的返回值
 */
function getFieldValue(aFieldDefine,aFieldValue) {
    var locTmpValue = aFieldValue.value;
    var result = null;
    if (!isNullValue(locTmpValue) && !isUndefinedValue(locTmpValue)) {
        var locValueType = locTmpValue.fieldValueType;
        if (locValueType == C_iDocFieldType_Common) {
            result = getCommonFieldValue(aFieldDefine, aFieldValue);
        } else if (locValueType == C_iDocFieldType_Opinion) {
            result = getOpinionFieldValue(aFieldDefine, aFieldValue);
        }
    }
    if (result == null) {
        result = new Array();
    }

    return result;
}

// TODO this method need opitimize
function fillData2Field(aFieldDefine, aFieldValue, aFieldObj) {
    var locFct = parseInt(aFieldDefine.controlType);
    var locFat = parseInt(aFieldDefine.accessType);
    var locFdt = parseInt(aFieldDefine.dataType);
    var locFID = aFieldDefine.fieldID;
    var locFdv = aFieldDefine.defaultValue;
    var locDRV = getFieldValue(aFieldDefine, aFieldValue);
    var locDv = nullToString(locDRV[0]);
    var locRv = nullToString(locDRV[1]);
    var locAssociateID = nullToString(locDRV[2]);
    var locAssocateType = nullToString(locDRV[3]);
    var locLastModify = nullToString(locDRV[4]);
    var locArchiveID = nullToString(locDRV[5]);
    if (locFdt != C_iFieldDataType_Signature) {
        locFat = 1;
    }
  

    if (isNullValue(locDv) && isNullValue(locRv)) {
        locRv = locFdv;
    }

    var locWorkFlag = sourceData.workFlag;
    if (locFat != C_iFieldAccess_Invisible && locWorkFlag == C_iFormWorkFlag_Done) {
        locFat = C_iFieldAccess_Readonly;
    }

    var locNctrl = null;
    var locOclass = transformUndefined(aFieldObj.attr("class"));
    var locOcstyle = transformUndefined(aFieldObj.attr("style"));
    
    var width = aFieldObj.attr("width");
    var height = aFieldObj.attr("height");
    if(typeof width == "undefined") {
        width = aFieldObj.css("width");
    }
    
    if(typeof height == "undefined") {
        height = aFieldObj.css("height");
    }
    switch (locFat) {
    case C_iFieldAccess_Invisible:
        locNctrl = $(C_sHTMLTag_Input).attr("type", "hidden").attr("value", getReturnValue(locDv, locRv, locFct)).attr(
                C_sFormAttachment_AssociateIDAttr, locAssociateID).attr(C_sFormAttachment_AssociateTypeAttr,
                locAssocateType).attr("id", locFID).attr("width",width).attr("height",height);
        if (isA8Server()) {
            var locDisplay = $(C_sHTMLTag_Font).css("color", C_sDefaultStyle_Color).css("font-size",
                    C_iDefaultStyle_FontSize).css("width", "120px").html("******");
            locNctrl = locNctrl.after(locDisplay);
        }
        break;
    case C_iFieldAccess_Readonly:
        var locNctrl = $(C_sHTMLTag_Input).attr("type", "hidden").attr("value", getReturnValue(locDv, locRv, locFct))
                .attr(C_sFormAttachment_AssociateIDAttr, locAssociateID).attr(C_sFormAttachment_AssociateTypeAttr,
                        locAssocateType).attr("id", locFID).attr("width",width).attr("height",height);
        var locValueObj = null;
        if (locFdt == C_iFieldDataType_Picture) {
            var height = aFieldObj.attr("offsetHeight");
            var width = aFieldObj.attr("offsetWidth");
            if (height == 0 || width == 0) {
                var locFFStyle = ffWHMap.get(locFID);
                width = locFFStyle.width;
                height = locFFStyle.height;
            }
            if (isNullValue(locRv) || isEmptyValue(locRv)) {
                locValueObj = $(C_sHTMLTag_Font);
            } else {
                locValueObj = $(C_sHTMLTag_Img).css("height", height).css("width", width).attr("src", locDv);
                if (locRv.indexOf("http") == -1) {
                    locValueObj.bind("click", function() {
                        showAttInNative(locRv, null, "", C_iAssociateSate_Archive_UploadFile, "");
                    });
                }
            }
        } else if (locFdt == C_iFieldDataType_Attatchment) {
            if (isNullValue(locRv) || isEmptyValue(locRv)) {
                locValueObj = $(C_sHTMLTag_Font);
            } else {
                var locDvList = locDv.split("\|");
                var locRvList = locRv.split("\|");
                var locAssocateTypeList = locAssocateType.split("\|");
                var locAssocateIDList = locAssociateID.split("\|");
                var locLastModifyList = locLastModify.split("\|");
                var locArchiveList = locArchiveID.split("\|");
                var locDvLen = locDvList.length;
                for ( var i = 0; i < locDvLen; i++) {
                    var locTmpDv = locDvList[i];
                    var locTmpRv = locRvList[i];
                    var locTmpType = C_iAssociateSate_Archive_UploadFile;
                    var locTmpID = null;
                    var locTmpLastModify = null;
                    var locTmpArchiveID = null;

                    if (!isUndefinedValue(locAssocateType) && !isNullValue(locAssocateType)
                            && !isEmptyValue(locAssocateType)) {
                        locTmpType = nullToString(locAssocateTypeList[i]);
                    }

                    if (!isUndefinedValue(locAssociateID) && !isNullValue(locAssociateID)
                            && !isEmptyValue(locAssociateID)) {
                        locTmpID = nullToString(locAssocateIDList[i]);
                    }

                    if (!isUndefinedValue(locLastModify) && !isNullValue(locLastModify) && !isEmptyValue(locLastModify)) {
                        locTmpLastModify = nullToString(locLastModifyList[i]);
                    }

                    if (!isUndefinedValue(locArchiveID) && !isNullValue(locArchiveID) && !isEmptyValue(locArchiveID)) {
                        locTmpArchiveID = nullToString(locArchiveList[i]);
                    }

                    var locLink = $(C_sHTMLTag_Link).css("color", "red").css("font-size", C_iDefaultStyle_FontSize)
                            .bind(
                                    "click",
                                    {
                                        dvKey : locTmpDv,
                                        rvKey : locTmpRv,
                                        assistIDKey : locTmpID,
                                        typeKey : locTmpType,
                                        lastModifyKey : locTmpLastModify,
                                        archiveIDKey : locTmpArchiveID
                                    },
                                    function(event) {
                                        showAttInNative(event.data.rvKey, event.data.assistIDKey, event.data.dvKey,
                                                event.data.typeKey, event.data.lastModifyKey, event.data.archiveIDKey);
                                    });

                    if (!isNullValue(locTmpDv) && !isEmptyValue(locTmpDv)) {
                        if (i != locDvLen - 1) {
                            locLink.html(locTmpDv + "<font color=\"black\" size=4>,</font><br/>");
                        } else {
                            locLink.html(locTmpDv + "<br/>");
                        }
                    }
                    if (isNullValue(locValueObj)) {
                        locValueObj = locLink;
                    } else {
                        locValueObj = locValueObj.after(locLink);
                    }
                }
            }
        } else {
            var locDisplayValue = getDisplayValue(locDv, locRv, aFieldDefine);
            if (locDisplayValue.indexOf("\n") == 0 || locDisplayValue.indexOf("\r\n") == 0) {
                locDisplayValue = locDisplayValue.substring(1);
            }
            locDisplayValue = locDisplayValue.replace(new RegExp("\r\n", "g"), "<br/>").replace(new RegExp("\n", "g"), "<br/>");
            locValueObj = $("<span/>").css("color", "#000000").css("font-size", C_iDefaultStyle_FontSize);
			//TODO  暂时这样修改bug   OA-95145M1：打开特殊字符名称的公文，报错
			if(locDisplayValue.indexOf("<script>") > 0){
				locValueObj .text(locDisplayValue);
			} else {
				locValueObj .html(locDisplayValue);
			}
        }
        locNctrl = locNctrl.after(locValueObj);
        break;
    case C_iFieldAccess_Editable:
    case C_iFieldAccess_Append:
        if ((locFct == C_iFieldControlType_Text || isText(aFieldObj)) && locFct != C_iFieldControlType_ExtendControl) {
            locNctrl = $(C_sHTMLTag_Input).attr("type", "text").attr("value",
                    getDisplayValue(locDv, locRv, aFieldDefine)).attr("class", locOclass).attr("style", locOcstyle)
                    .attr("id", locFID);
            if (locFdt == C_iFieldDataType_RunningNumber) {
                locNctrl.attr("readonly", "readonly");
            }
        } else if (locFct == C_iFieldControlType_Radio) {
            var locEtID = aFieldDefine.enumTypeID;
            var locEvList = sourceData.enumList[locEtID];

            var locEvLen = locEvList.length;
            for ( var i = 0; i < locEvLen; i++) {
                var locState = locEvList[i].state;
                if (locState) {
                    var locTmpNctrl = $(C_sHTMLTag_Input).attr("type", "radio").attr("value", locEvList[i].value).attr(
                            "id", locFID).attr("name", locFID);
                    if (!isEmptyValue(locRv) && !isNullValue(locRv) && locEvList[i].value == locRv) {
                        locTmpNctrl.attr("checked", "checked");
                    }
                    locTmpNctrl = locTmpNctrl.after($("<span>" + locEvList[i].name + "</span>"));
                    if (i == 0 || isNullValue(locNctrl)) {
                        locNctrl = locTmpNctrl;
                    } else {
                        locNctrl = locNctrl.after(locTmpNctrl);
                    }
                }
            }
        } else if (locFct == C_iFieldControlType_SelectSingle) {
            locNctrl = $(C_sHTMLTag_Select).attr("class", locOclass).attr("style", locOcstyle).attr("id", locFID);

            var locEtID = aFieldDefine.enumTypeID;
            var locEvList = sourceData.enumList[locEtID];

            if (isEmptyValue(locFdv) || isNullValue(locFdv)) {
                var locdo = $(C_sSelectOption_Option).attr("value", "").html("");
                if (isEmptyValue(locRv) || isNullValue(locRv)) {
                    locdo.attr("selected", "selected");
                }
                locNctrl.append(locdo);
            }

            var locEvLen = locEvList.length;
            for ( var i = 0; i < locEvLen; i++) {
                var locState = locEvList[i].state;
                if (locState) {
                    var locso = $(C_sSelectOption_Option).attr("value", locEvList[i].value).html(locEvList[i].name);
                    if (!isEmptyValue(locRv) && !isNullValue(locRv) && locEvList[i].value == locRv) {
                        locso.attr("selected", "selected");
                    }
                    locNctrl.append(locso);
                }
            }
        } else if (locFct == C_iFieldControlType_ExtendControl) {
            var locEfd = aFieldDefine.extendFieldDefine;
            var locEt = parseInt(locEfd.extendFieID);
            var locECV = getExtendCtrlValue(locDv, locRv, aFieldDefine);
            locRv = nullToString(locECV.returnValue);
            locDv = nullToString(locECV.displayValue);

            if (locEt == C_iFieldExtendControlType_ChooseDate) {
                locNctrl = $(C_sHTMLTag_Input).attr("type", C_sInputTypeAttr_Text).attr("class", locOclass).attr(
                        "style", locOcstyle).attr("id", locFID).attr("value", locRv);
                locNctrl.bind("click", {
                    aField : locFID,
                    aType : locEt
                }, function(event) {
                    invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
                }).attr("readonly", "readonly");
            } else if (locEt == C_iFieldExtendControlType_ChooseDateTime) {
                locNctrl = $(C_sHTMLTag_Input).attr("type", C_sInputTypeAttr_Text).attr("class", locOclass).attr(
                        "style", locOcstyle).attr("id", locFID).attr("value", locRv);
                locNctrl.bind("click", {
                    aField : locFID,
                    aType : locEt
                }, function(event) {
                    invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
                }).attr("readonly", "readonly");
            } else if (locEt == C_iFieldExtendControlType_ChoosePerson
                    || locEt == C_iFieldExtendControlType_ChooseDepartment
                    || locEt == C_iFieldExtendControlType_ChooseOccupation
                    || locEt == C_iFieldExtendControlType_ChooseOtype
                    || locEt == C_iFieldExtendControlType_ChooseCompany) {
                locNctrl = $(C_sHTMLTag_Input).attr("type", C_sInputTypeAttr_Text).attr("value", locDv).attr("class",
                        locOclass).attr("style", locOcstyle).attr("id", locFID).attr("result", locRv);
                locNctrl.bind("click", {
                    aField : locFID,
                    aType : locEt
                }, function(event) {
                    invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
                }).attr("readonly", "readonly");
            } else if (locEt == C_iFieldExtendControlType_Append) {
                locNctrl = $(C_sHTMLTag_TextArea).attr("class", locOclass).attr("style", locOcstyle).attr("id", locFID)
                        .attr("value", locRv);
                locNctrl.bind("click", {
                    aField : locFID,
                    aType : locEt
                }, function(event) {
                    invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
                    bindAssistDisplayLayer(event.data.aField);
                }).attr("readonly", "readonly");
            } else if (locEt == C_iFieldExtendControlType_ChoosePicture) {
                locNctrl = renderPicCtrl(aFieldDefine, aFieldValue, aFieldObj);
            } else if (locEt == C_iFieldExtendControlType_ChooseAttachment) {
                locNctrl = renderAttCtrl(aFieldDefine, aFieldValue, aFieldObj);
            } else if (locEt == C_iFieldExtendControlType_Signature) {
                /*var locSrcObj = $(getJQuerySelectorByID(locFID));
                var locWidth = locSrcObj.attr("width");
                var locHeight = locSrcObj.attr("height");

                if (isUndefinedValue(locWidth)) {
                    locWidth = locSrcObj.css("width");
                    if (isUndefinedValue(locWidth)) {
                        locWidth = "default";
                    }
                }

                if (isUndefinedValue(locHeight)) {
                    locHeight = locSrcObj.css("height");
                    if (isUndefinedValue(locHeight)) {
                        locHeight = "default";
                    }
                }

                var locNctrl = $(C_sHTMLTag_Img).attr("src", "signature.gif").attr("result", locRv).attr(
                        C_sFormAttachment_AssociateIDAttr, locAssociateID).attr(C_sSignatureAssist_PicName, "").attr(
                        "id", locFID).bind("click", {
                    aField : locFID,
                    aType : locEt,
                    aWidth : locWidth,
                    aHeight : locHeight
                }, function(event) {
                    var locSelf = $(this);
                    locSelf.attr("aWidth", event.data.aWidth);
                    locSelf.attr("aHeight", event.data.aHeight);
                    invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, locSelf);
                });
                var locSignID = locFID + C_sSignatureAssist_ID;*/
                locNctrl = $("<span/>").attr("id",locFID + "_opinion").attr("width",width).attr("height",height).html(locDv);
                /*if (!isUndefinedValue(locRv) && !isEmptyValue(locRv) && !isNullValue(locRv)) {
                    toParseSignatureMap.put(locSignID, locRv);
                }
                locNctrl = locNctrl.after(locValueObj);*/
            }
        } else if (locFct == C_iFieldControlType_CheckBox) {
            locNctrl = $(C_sHTMLTag_Input).attr("type", C_sInputTypeAttr_CheckBox).attr("class", locOclass).attr(
                    "style", locOcstyle).attr("id", locFID).attr("checked",
                    getBooleanValueForRenderCtrl(locDv, locRv, locFct));
        } else if (locFct == C_iFieldControlType_TextArea) {
            locNctrl = $(C_sHTMLTag_TextArea).attr("class", locOclass).attr("style", locOcstyle).attr("id", locFID)
                    .attr("value", locRv);
        }
        break;
    }

    if(typeof locNctrl != "undefined" && locNctrl != null) {
        var locCtrlHeightStyle = locNctrl.css("height");
        if (!isUndefinedValue(locCtrlHeightStyle)) {
            var locCtrlHeight = parseInt(locCtrlHeightStyle.replace("px", ""));
            if (locCtrlHeight < 20 && locCtrlHeight > 10) {
                locNctrl.css("height", "30px");
            }
        }
    
        if (!isNullValue(locNctrl)) {
            if (locFat >= C_iFieldAccess_Editable) {
                bindVerifyEvent(locNctrl, aFieldDefine);
            }
            aFieldObj.replaceWith(locNctrl);
        }
    }
}

function transformUndefined(aValue) {
    var result = aValue;
    if (isUndefinedValue(aValue)) {
        result = "";
    }
    return result;
}

function setAssistID(aAssistID, aObj) {
    if (!isUndefinedValue(aAssistID)) {
        aObj.each(function() {
            this[C_sSubFF_AsssitIDAttr] = aAssistID;
        });
    }
}

function renderPicCtrl(aFieldDefine, aFieldValue, aFieldObj) {
    var locFct = parseInt(aFieldDefine.controlType);
    var locFat = parseInt(aFieldDefine.accessType);
    var locFdt = parseInt(aFieldDefine.dataType);
    var locFID = aFieldDefine.id;
    var locFdv = aFieldDefine.defaultValue;
    var locDRV = getFieldValue(aFieldDefine, aFieldValue);
    var locDv = nullToString(locDRV[0]);
    var locRv = nullToString(locDRV[1]);
    var locAssociateID = nullToString(locDRV[2]);
    var locAssocateType = nullToString(locDRV[3]);
    var locEfd = aFieldDefine.extendFieldDefine;
    var locEt = parseInt(locEfd.extendFieID);
    var locOclass = nullToString(aFieldObj.attr("class"));
    var locOcstyle = nullToString(aFieldObj.attr("style"));
    /* get default height of current control */
    var height = aFieldObj.attr("offsetHeight");
    /* get default width of current control */
    var width = aFieldObj.attr("offsetWidth");
    var locAssistID = aFieldObj.attr(C_sSubFF_AsssitIDAttr);

    if (height == 0 || width == 0) {
        var locFFStyle = ffWHMap.get(locFID);
        width = locFFStyle.width;
        height = locFFStyle.height;
    }

    /* create hidden control for submitting data to server */
    var locHiddenInput = $(C_sHTMLTag_Input).attr("type", "hidden").attr("id", locFID).attr(C_sFormAttachment_Sign,
            C_sFormAttachmentSignValue_HiddenInput);
    setAssistID(locAssistID, locHiddenInput);

    var isNew = true;
    var locAttAssistID = aFieldObj.attr(C_sFormAttachment_AssistAttr);
    if (!isUndefinedValue(locAttAssistID)) {
        var locOldHiddenInput = $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_HiddenInput));
        height = locOldHiddenInput.attr("aheight");
        width = locOldHiddenInput.attr("awidth");
        locOclass = locOldHiddenInput.attr("aclass");
        locOcstyle = locOldHiddenInput.attr("astyle");
        isNew = false;
    } else {
        locAttAssistID = C_sFormAttachment_AssistPrefix + fEHAIndex++;
    }
    locHiddenInput.attr("aheight", height).attr("awidth", width).attr("aclass", locOclass).attr("astyle", locOcstyle)
            .attr(C_sFormAttachment_AssistAttr, locAttAssistID);
    locHiddenInput.each(function() {
        this[C_sFormAttachment_AssistAttr] = locAttAssistID;
    });

    if (!isNew) {
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_ImgList)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_HiddenInput)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_DelIcon)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_TextArea)).remove();
    }

    /* create upload image control for upload image */
    var locNctrl = $(C_sHTMLTag_Img).attr("src", "upload.gif").attr(C_sFormAttachment_Sign,
            C_sFormAttachmentSignValue_UploadIcon).bind("click", {
        aField : locFID,
        aType : locEt
    }, function(event) {
        invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
    }).attr("readonly", "readonly").attr(C_sFormAttachment_AssistAttr, locAttAssistID);
    setAssistID(locAssistID, locNctrl);

    if (isEmptyValue(locDv)) {
        var locTextArea = $(C_sHTMLTag_TextArea).attr("class", locOclass).attr("style", locOcstyle).attr("readonly",
                "readonly").bind("click", {
            aField : locFID,
            aType : locEt
        }, function(event) {
            invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
        }).attr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_TextArea).attr(C_sFormAttachment_AssistAttr,
                locAttAssistID);
        setAssistID(locAssistID, locTextArea);
        locNctrl = locNctrl.after(locTextArea);
    } else {
        var locImg = $(C_sHTMLTag_Img).css("height", height).css("width", width).attr("src", locDv).attr(
                C_sFormAttachment_Sign, C_sFormAttachmentSignValue_ImgList).attr(C_sFormAttachment_AssistAttr,
                locAttAssistID).bind("click", function() {
            showAttInNative(locRv, null, "", C_iAssociateSate_Archive_UploadFile, "");
        });
        setAssistID(locAssistID, locImg);

        locNctrl = locNctrl.after(locImg);
        var locDel = $(C_sHTMLTag_Img).attr("src", "delete.gif").attr(C_sFormAttachment_AssistAttr, locAttAssistID)
                .attr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_DelIcon).bind("click", {
                    aField : locFID,
                    aType : locEt
                }, function(event) {
                    deleteAttByID(locRv, $(this), event.data.aField, event.data.aType);
                });
        setAssistID(locAssistID, locDel);
        locNctrl = locNctrl.after(locDel);
        locHiddenInput.attr("value", locRv).attr(C_sFormAttachment_AssociateIDAttr, locAssociateID).attr(
                C_sFormAttachment_AssociateTypeAttr, locAssocateType);
    }
    locNctrl = locNctrl.after(locHiddenInput);

    return locNctrl;
}

function renderAttCtrl(aFieldDefine, aFieldValue, aFieldObj) {
    var locFct = parseInt(aFieldDefine.controlType);
    var locFat = parseInt(aFieldDefine.accessType);
    var locFdt = parseInt(aFieldDefine.dataType);
    var locFID = aFieldDefine.id;
    var locFdv = aFieldDefine.defaultValue;
    var locDRV = getFieldValue(aFieldDefine, aFieldValue);
    var locDv = nullToString(locDRV[0]);
    var locRv = nullToString(locDRV[1]);
    var locAssociateID = nullToString(locDRV[2]);
    var locAssocateType = nullToString(locDRV[3]);
    var locLastModify = nullToString(locDRV[4]);
    var locArchiveID = nullToString(locDRV[5]);
    var locEfd = aFieldDefine.extendFieldDefine;
    var locEt = parseInt(locEfd.extendFieID);
    var locOclass = nullToString(aFieldObj.attr("class"));
    var locOcstyle = nullToString(aFieldObj.attr("style"));
    /* get default height of current control */
    var height = aFieldObj.attr("offsetHeight");
    /* get default width of current control */
    var width = aFieldObj.attr("offsetWidth");
    var locAssistID = aFieldObj.attr(C_sSubFF_AsssitIDAttr);

    /* create hidden control for submitting data to server */
    var locHiddenInput = $(C_sHTMLTag_Input).attr("type", "hidden").attr("id", locFID).attr(C_sFormAttachment_Sign,
            C_sFormAttachmentSignValue_HiddenInput);
    setAssistID(locAssistID, locHiddenInput);

    var isNew = true;
    var locAttAssistID = aFieldObj.attr(C_sFormAttachment_AssistAttr);
    if (!isUndefinedValue(locAttAssistID)) {
        var locOldHiddenInput = $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_HiddenInput));
        height = locOldHiddenInput.attr("aheight");
        width = locOldHiddenInput.attr("awidth");
        locOclass = locOldHiddenInput.attr("aclass");
        locOcstyle = locOldHiddenInput.attr("astyle");
        isNew = false;
    } else {
        locAttAssistID = C_sFormAttachment_AssistPrefix + fEHAIndex++;
    }
    locHiddenInput.attr("aheight", height).attr("awidth", width).attr("aclass", locOclass).attr("astyle", locOcstyle)
            .attr(C_sFormAttachment_AssistAttr, locAttAssistID);
    locHiddenInput.each(function() {
        this[C_sFormAttachment_AssistAttr] = locAttAssistID;
    });

    if (!isNew) {
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_ImgList)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_HiddenInput)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_DelIcon)).remove();
        $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_TextArea)).remove();
    }
    /* create upload image control for upload image */
    var locNctrl = $(C_sHTMLTag_Img).attr("src", "upload.gif").attr(C_sFormAttachment_Sign,
            C_sFormAttachmentSignValue_UploadIcon).bind("click", {
        aField : locFID,
        aType : locEt
    }, function(event) {
        invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
    }).attr("readonly", "readonly").attr(C_sFormAttachment_AssistAttr, locAttAssistID);
    setAssistID(locAssistID, locNctrl);
    if (isEmptyValue(locDv)) {
        var locTextArea = $(C_sHTMLTag_TextArea).attr("class", locOclass).attr("style", locOcstyle).attr("readonly",
                "readonly").bind("click", {
            aField : locFID,
            aType : locEt
        }, function(event) {
            invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
        }).attr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_TextArea).attr(C_sFormAttachment_AssistAttr,
                locAttAssistID);
        setAssistID(locAssistID, locTextArea);
        locNctrl = locNctrl.after(locTextArea);
    } else {
        var locDvList = locDv.split("\|");
        var locRvList = locRv.split("\|");
        var locAssocateTypeList = locAssocateType.split("\|");
        var locAssocateIDList = locAssociateID.split("\|");
        var locLastModifyList = locLastModify.split("\|");
        var locArchiveList = locArchiveID.split("\|");
        var locDvLen = locDvList.length;
        for ( var i = 0; i < locDvLen; i++) {
            var locTmpDv = locDvList[i];
            var locTmpRv = locRvList[i];
            var locTmpType = C_iAssociateSate_Archive_UploadFile;
            var locTmpID = null;
            var locTmpLastModify = null;
            var locTmpArchiveID = null;

            if (!isUndefinedValue(locAssocateType) && !isNullValue(locAssocateType) && !isEmptyValue(locAssocateType)) {
                locTmpType = locAssocateTypeList[i];
            }

            if (!isUndefinedValue(locAssociateID) && !isNullValue(locAssociateID) && !isEmptyValue(locAssociateID)) {
                locTmpID = locAssocateIDList[i];
            }

            if (!isUndefinedValue(locLastModify) && !isNullValue(locLastModify) && !isEmptyValue(locLastModify)) {
                locTmpLastModify = nullToString(locLastModifyList[i]);
            }

            if (!isUndefinedValue(locArchiveID) && !isNullValue(locArchiveID) && !isEmptyValue(locArchiveID)) {
                locTmpArchiveID = nullToString(locArchiveList[i]);
            }

            var locImg = $(C_sHTMLTag_Link).html(locTmpDv).attr(C_sFormAttachment_Sign,
                    C_sFormAttachmentSignValue_ImgList).attr(C_sFormAttachment_AssistAttr, locAttAssistID).bind(
                    "click",
                    {
                        dvKey : locTmpDv,
                        rvKey : locTmpRv,
                        assistIDKey : locTmpID,
                        typeKey : locTmpType,
                        lastModifyKey : locTmpLastModify,
                        archiveIDKey : locTmpArchiveID
                    },
                    function(event) {
                        showAttInNative(event.data.rvKey, event.data.assistIDKey, event.data.dvKey, event.data.typeKey,
                                event.data.lastModifyKey, event.data.archiveIDKey);
                    });
            setAssistID(locAssistID, locImg);

            locNctrl = locNctrl.after(locImg);
            var locDel = $(C_sHTMLTag_Img).attr("src", "delete.gif").attr(C_sFormAttachment_AssistAttr, locAttAssistID)
                    .attr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_DelIcon).bind("click", {
                        rvKey : locTmpRv,
                        aField : locFID,
                        aType : locEt
                    }, function(event) {
                        deleteAttByID(event.data.rvKey, $(this), event.data.aField, event.data.aType);
                    });
            setAssistID(locAssistID, locDel);
            locNctrl = locNctrl.after(locDel);
        }
        locHiddenInput.attr("value", locRv).attr("aValue", locDv).attr(C_sFormAttachment_AssociateIDAttr,
                locAssociateID).attr(C_sFormAttachment_AssociateTypeAttr, locAssocateType);
    }
    locNctrl = locNctrl.after(locHiddenInput);
    return locNctrl;
}

function isText(aFieldObj) {
    var locTag = aFieldObj.attr("tagName");
    var locType = aFieldObj.attr("type");
    var formType = sourceData.formType;
    var result = false;
    if (formType == "A6" && locTag == "INPUT" && locType == "text") {
        result = true;
    }
    return result;
}

function getEnumValueObj(aEnumTypeID, aEnumVlaue) {
    var locEvList = sourceData.enumList[aEnumTypeID];
    if (!isUndefinedValue(locEvList) && !isNullValue(locEvList)) {
        var locEvLen = locEvList.length;
        for ( var i = 0; i < locEvLen; i++) {
            var locEnumValue = locEvList[i].value;
            if (aEnumVlaue == locEnumValue) {
                return locEvList[i];
            }
        }
    }
}

function getDisplayValue(aDisplayValue, aReturnValue, aFieldDefine) {
    var locFct = parseInt(aFieldDefine.controlType);
    var result = "";
    if (locFct == C_iFieldControlType_CheckBox) {
        if (aReturnValue == "false" || !aReturnValue || aReturnValue == 0) {
            result = C_sCheckBoxOrRadioValue_Unchecked;
        } else {
            result = C_sCheckBoxOrRadioValue_Checked;
        }
    } else if (locFct == C_iFieldControlType_Radio) {
        if (!isA8Server()) {
            if (aReturnValue == "false" || !aReturnValue) {
                result = C_sCheckBoxOrRadioValue_Unchecked;
            } else {
                result = C_sCheckBoxOrRadioValue_Checked;
            }
        } else {
            if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue)) {
                result = aDisplayValue;
            } else {
                result = nullToString(aReturnValue);
            }
        }
    } else if (locFct == C_iFieldControlType_SelectSingle) {
        var locEnumTypeID = aFieldDefine.enumTypeID;
        var locEnumValueObj = getEnumValueObj(locEnumTypeID, aReturnValue);
        var locEnumValueState;
        if (isUndefinedValue(locEnumValueObj)) {
            locEnumValueState = true;
        } else {
            locEnumValueState = locEnumValueObj.state;
        }
        if (locEnumValueState) {
            if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue)) {
                result = aDisplayValue;
            } else {
                result = nullToString(aReturnValue);
            }
        }
    } else if (locFct == C_iFieldControlType_ExtendControl) {
        var locEfd = aFieldDefine.extendFieldDefine;
        var locEt = parseInt(locEfd.extendFieID);

        if (locEt == C_iFieldExtendControlType_ChoosePerson || locEt == C_iFieldExtendControlType_ChooseDepartment
                || locEt == C_iFieldExtendControlType_ChooseOccupation
                || locEt == C_iFieldExtendControlType_ChooseOtype || locEt == C_iFieldExtendControlType_ChooseCompany
                || locEt == C_iFieldExtendControlType_ChooseDate || locEt == C_iFieldExtendControlType_ChooseDateTime) {
            var locDefValue = aFieldDefine.defaultValue;
            if (aReturnValue != locDefValue) {
                if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue)) {
                    result = aDisplayValue;
                } else {
				//TODO  hejianliang  bug OA-82529all：手动删除了收文的来文单位，M1显示出了单位id
                   // result = nullToString(aReturnValue);
                }
            }
        } else {
            if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue)) {
                result = aDisplayValue;
            } else {
                result = nullToString(aReturnValue);
            }
        }
    } else {
        if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue)) {
            result = aDisplayValue;
        } else {
            result = nullToString(aReturnValue);
        }
    }
    return result;
}

var FormExtendCtrl = function(aDisplayValue, aReturnValue) {
    this.displayValue = aDisplayValue;
    this.returnValue = aReturnValue;
};

function getExtendCtrlValue(aDisplayValue, aReturnValue, aFieldDefine) {
    var locFdv = aFieldDefine.defaultValue;
    var locFct = parseInt(aFieldDefine.controlType);

    var result = new FormExtendCtrl(aDisplayValue, aReturnValue);
    if (locFct == C_iFieldControlType_ExtendControl && locFdv == C_sSystemAutoSign
            && (isNullValue(aReturnValue) || isEmptyValue(aReturnValue) || aReturnValue == C_sSystemAutoSign)) {
        var locEfd = aFieldDefine.extendFieldDefine;
        var locEt = parseInt(locEfd.extendFieID);
        if (locEt == C_iFieldExtendControlType_ChooseDate) {
            var locNow = DateUtil.toString(new Date(), "yyyy-MM-dd");
            result = new FormExtendCtrl(locNow, locNow);
        } else if (locEt == C_iFieldExtendControlType_ChooseDateTime) {
            var locNow = DateUtil.toString(new Date(), "yyyy-MM-dd HH:mm:ss");
            result = new FormExtendCtrl(locNow, locNow);
        } else if (locEt == C_iFieldExtendControlType_ChoosePerson) {
            var locPer = sourceData.currentPerson;
            var locPerID = locPer.id;
            var locPerName = locPer.name;
            result = new FormExtendCtrl(locPerName, locPerID);
        } else if (locEt == C_iFieldExtendControlType_ChooseDepartment) {
            var locPer = sourceData.currentPerson;
            var locDep = locPer.department;
            var locDepID = locDep.id;
            var locDepName = locDep.name;
            result = new FormExtendCtrl(locDepName, locDepID);
        } else if (locEt == C_iFieldExtendControlType_ChooseOccupation) {
            var locPer = sourceData.currentPerson;
            var locOccu = locPer.occupation;
            var locOccuID = locOccu.id;
            var locOccuName = locOccu.name;
            result = new FormExtendCtrl(locOccuName, locOccuID);
        } else if (locEt == C_iFieldExtendControlType_ChooseOtype) {
            var locPer = sourceData.currentPerson;
            var locOty = locPer.otype;
            var locOtyID = locOty.id;
            var locOtyName = locOty.name;
            result = new FormExtendCtrl(locOtyName, locOtyID);
        }
    }
    return result;
}

function getReturnValue(aDisplayValue, aReturnValue, aCtrlType) {
    var result = "";
    if (aCtrlType == C_iFieldControlType_CheckBox) {
        if (aReturnValue == "false" || !aReturnValue || aReturnValue == 0) {
            result = false;
        } else {
            result = true;
        }
    } else {
        if (!isNullValue(aReturnValue) && !isEmptyValue(aReturnValue) && !isUndefinedValue(aReturnValue)) {
            result = aReturnValue;
        } else if (!isNullValue(aDisplayValue) && !isEmptyValue(aDisplayValue) && !isUndefinedValue(aDisplayValue)) {
            result = aDisplayValue;
        }
    }
    return result;
}

function getBooleanValueForRenderCtrl(aDisplayValue, aReturnValue, aCtrlType) {
    var result = true;
    if (aReturnValue == "false" || !aReturnValue || aReturnValue == 0) {
        result = false;
    }
    return result;
}

var FormFieldValue = function(aFieldID, aFieldName, aDisplayValue, aReturnValue, aAssociateType, aAssociateID,
        aAssistID) {
    this.fieldID = aFieldID;
    this.fieldName = aFieldName;
    this.displayValue = aDisplayValue;
    this.returnValue = aReturnValue;
    this.associateType = aAssociateType;
    this.associateID = aAssociateID;
    this.assistID = aAssistID;
};

// ========================================extend
// control===============================================
var C_iInvokeNativeCtrl_ChooseOP = 1;
var C_iInvokeNativeCtrl_ShowAtt = 2;
var C_iInvokeNativeCtrl_Signature = 3;
/* 主要用于android辨识消息的类型——表单结果 */
var C_iInvokeNativeCtrl_Result = 4;
/* 主要用于android辨识消息的类型——表单校验结果 */
var C_iInvokeNativeCtrl_ErrorInfo = 5;

var C_iSignatureHandleType_Parse = 1;
var C_iSignatureHandleType_Do = 2;

/**
 * 签章返回对象
 */
var SignatureReturn = function(aField, aType, aPicData, aPicFormat, aErrorPath) {
    this.field = aField;
    this.type = aType;
    this.picData = aPicData;
    this.picFormat = aPicFormat;
    this.errorPath = aErrorPath;
}

/**
 * 
 * @param aFieldID
 *                字段的ID
 * @param aType
 *                1=parse,2=operate
 * @param aAssistID
 *                从表的辅助ID
 * @param aInitValue
 *                当解析时，该属性将签章的原始数据传到本地程序，进行签章操作，该属性将初始化数据传到本地程序
 */
var SignatureInfo = function(aFieldID, aType, aAssistID, aInitValue) {
    this.field = aFieldID;
    this.type = aType;
    this.assistID = aAssistID;
    this.initValue = aInitValue;
    this.command = C_iInvokeNativeCtrl_Signature;
}

var SignatureInfoList = function() {
    this.signatureList = new Array();
    this.command = C_iInvokeNativeCtrl_Signature;
}

SignatureInfoList.prototype = {
    addSignature : function(aSignature) {
        this.signatureList.push(aSignature);
    }
}

function parseSignatureData(aSourceData) {
    var locSignature = new SignatureInfo(null, C_iSignatureHandleType_Parse, null, aSourceData);
    var result = JSON.stringify(locSignature);
    var locSignaturePicData = window.m1.runOnAndroidJavaScript(result);

    if (isNullValue(locSignaturePicData) || isEmptyValue(locSignaturePicData) || isUndefinedValue(locSignaturePicData)) {
        locSignaturePicData = null;
    } else {
        locSignaturePicData = locSignaturePicData + "";
    }
    return locSignaturePicData;
}

var ChooseOPInfo = function(aFieldID, aType, aAssistID, aInitValue) {
    this.field = aFieldID;
    this.type = aType;
    this.assistID = aAssistID;
    this.initValue = aInitValue;
    this.command = C_iInvokeNativeCtrl_ChooseOP;
};

function invokeNativeCtrlFromWebView(field, type, obj) {
    var aID = obj.attr("assistID");
    var aInitValue = getInitValue(field, aID, obj);
    var locCOP = new ChooseOPInfo(field, type, aID, aInitValue);

    if (type == C_iFieldExtendControlType_Signature) {
        var locWidth = obj.attr("aWidth");
        var locHeight = obj.attr("aHeight");
        locCOP.width = locWidth;
        locCOP.height = locHeight;
    }
    var result = JSON.stringify(locCOP);

    if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
        location.href = ".?parameters_0123=" + result;
    } else if (clientType == C_sClientType_AndroidPad || clientType == C_sClientType_AndroidPhone) {
        window.m1.runOnAndroidJavaScript(result);
    } else {
        return;
    }
}

function getInitValue(aFieldID, aAssistID, obj) {
    var locFFD = getFieldDefineByFieldID(aFieldID);
    var locFdt = parseInt(locFFD.dataType);

    var result = "";
    if (locFdt == C_iFieldDataType_Attatchment) {
        result = getAttCtrlInitValue(aFieldID, aAssistID);
    } else if (locFdt == C_iFieldDataType_Signature) {
        result = obj.attr("result");
    } else {
        result = getEditableExtendCtrlValue(obj);
    }
    return result;
}

function getEditableExtendCtrlValue(obj) {
    if (obj.attr("tagName") == "INPUT") {
        var locTypeName = obj.attr("type");
        var locRS = obj.attr("result");
        var locFID = obj.attr("id");
        var locMffd = getFieldDefineByFieldID(locFID);
        var locValue = getCtrlResult(locMffd, obj[0], locTypeName);

        if (!isUndefinedValue(locRS)) {
            return nullToString(locRS);
        } else {
            return nullToString(locValue);
        }
    } else {
        return "";
    }
}

function getFieldDefineByFieldID(aFieldID) {
    return mffdMap.get(aFieldID);
}

var ShowAttInfo = function(aID, aAssistID, aDisplayName, aType, aLastModify, aArchiveID) {
    this.ID = aID;
    this.assistID = aAssistID;
    this.displayName = aDisplayName;
    this.type = aType + "";
    this.lastModify = aLastModify;
    this.archiveID = aArchiveID;
    this.command = C_iInvokeNativeCtrl_ShowAtt;
};

/**
 * invoke native control to show attachment content
 * 
 * @param {Object}
 *                aID attachment's ID
 * @param {Object}
 *                aDisplayName attachment's name
 * @return {TypeName}
 */
function showAttInNative(aID, aAssistID, aDisplayName, aType, aLastModify, aArchiveID) {
    if (isUndefinedValue(aType) || isNullValue(aType) || isEmptyValue(aType)) {
        aType = C_iAssociateSate_Archive_UploadFile;
    }
    var locSA = new ShowAttInfo(aID, aAssistID, aDisplayName, aType, aLastModify, aArchiveID);
    var result = JSON.stringify(locSA);

    if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
        location.href = ".?parameters_0123=" + result;
    } else if (clientType == C_sClientType_AndroidPad || clientType == C_sClientType_AndroidPhone) {
        window.m1.runOnAndroidJavaScript(result);
    } else {
        return;
    }
}

function joinStrBySpecSeparator(aValueList, aSeparator) {
    if (aValueList == null)
        return "";
    if (isNullValue(aSeparator) || isUndefinedValue(aSeparator)) {
        aSeparator = "|";
    }
    var locSepLen = aSeparator.length;
    var locValueLen = aValueList.length;
    var result = "";
    for ( var i = 0; i < locValueLen; i++) {
        if (aValueList[i] != "") {
            result += aValueList[i] + aSeparator;
        }
    }
    result = result.substring(0, result.length - locSepLen);
    return result;
}

function getDelIndex(aOldValue, aDelValue) {
    var locOldValueList = aOldValue.split("\|");
    var locOldValueLen = locOldValueList.length;
    for ( var i = 0; i < locOldValueLen; i++) {
        if (isEmptyValue(locOldValueList[i]) || locOldValueList[i] == aDelValue) {
            return i;
        }
    }
}

function getNewAttValue(aValueList, aDelIndex) {
    var locVLen = aValueList.length;
    for ( var i = 0; i < locVLen; i++) {
        var locTmpValue = aValueList[i];
        var locTmpValueList = locTmpValue.split("\|");
        locTmpValueList.splice(aDelIndex, 1);
        aValueList[i] = joinStrBySpecSeparator(locTmpValueList, "|");
    }
    return aValueList;
}

function deleteAttByID(aID, aObj, aField, aType) {
    var locAttAssistID = aObj.attr(C_sFormAttachment_AssistAttr);
    var locAssistID = aObj.attr(C_sSubFF_AsssitIDAttr);
    var locLeaveImg = $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
            getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_ImgList));
    var locHiddenInput = $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
            getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_HiddenInput));
    var locOldValue = nullToString(locHiddenInput.attr("value"));
    var locOldDisplayValue = nullToString(locHiddenInput.attr("aValue"));
    var locOldAssociateType = nullToString(locHiddenInput.attr(C_sFormAttachment_AssociateTypeAttr));
    var locDelIndex = getDelIndex(locOldValue, aID);
    var locNewValueList = getNewAttValue([ locOldValue, locOldDisplayValue, locOldAssociateType ], locDelIndex);
    locHiddenInput.attr("value", locNewValueList[0]).attr("aValue", locNewValueList[1]).attr(
            C_sFormAttachment_AssociateTypeAttr, locNewValueList[2]);
    var locOclass = transformUndefined(locLeaveImg.attr("class"));
    var locOcstyle = transformUndefined(locLeaveImg.attr("style"));
    var locLeaveLen = locLeaveImg.length;

    var locDelObj = aObj.prev();
    locDelObj.remove();
    aObj.remove();
    if (locLeaveLen == 1) {
        var locUploadImg = $(getJQuerySelectorByAttr(C_sFormAttachment_AssistAttr, locAttAssistID)).filter(
                getJQuerySelectorByAttr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_UploadIcon));

        var locTextArea = $(C_sHTMLTag_TextArea).attr("class", locOclass).attr("style", locOcstyle).attr("readonly",
                "readonly").bind("click", {
            aField : aField,
            aType : aType
        }, function(event) {
            invokeNativeCtrlFromWebView(event.data.aField, event.data.aType, $(this));
        }).attr(C_sFormAttachment_Sign, C_sFormAttachmentSignValue_TextArea).attr(C_sFormAttachment_AssistAttr,
                locAttAssistID);
        setAssistID(locAssistID, locTextArea);
        locUploadImg.after(locTextArea);
    }
}

function isAppendField(aFieldID, aIsSubForm) {
    var locFFD = null;
    /* if field belong to subordinate form */
    if (aIsSubForm) {
        locFFD = sffdMap.get(aFieldID);
    } else {
        locFFD = mffdMap.get(aFieldID);
    }
    /* get field's extend define */
    var locEfd = locFFD.extendFieldDefine;
    /* get extend control type */
    var locEt = parseInt(locEfd.extendFieID);
    /* get feild's access type */
    var locFat = parseInt(locFFD.accessType);
    if (locFat == C_iFieldAccess_Append && locEt == C_iFieldExtendControlType_Append) {
        return true;
    } else {
        return false;
    }
}

var C_sTextFormat_Newline = "\r\n";

function getCtrlObjByFilter(aMainSelector, aFilter) {
    var result = $(aMainSelector);
    if (result.length > 1) {
        result = result.filter(aFilter);
    }
    return result;
}

// TODO 需要优化改方法
function sendResult2WebView(returnValue) {
    var command = returnValue.command;
    if (command == C_iInvokeNativeCtrlCommand_InitSignatureData || command == C_iInvokeNativeCtrlCommand_HandWrite) {
        sendSignatureResult(returnValue.value);
    }
}

function generateSignatureReturn(aField, aSignatureData) {
    var result = null;
    if (!isUndefinedValue(aSignatureData) && !isEmptyValue(aSignatureData) && !isNullValue(aSignatureData)) {
        var locPNGPrefix = "PNG";
        var locGIFPrefix = "GIF";
        var locJPGPrefix = "JPG";

        var locPrefix = aSignatureData.substring(0, 3);
        var locSignatureData = aSignatureData.substring(3);
        if (locPrefix == locPNGPrefix) {
            result = new SignatureReturn(aField, C_iPicDataType_EncodingData, locSignatureData, C_iPicDataFormat_Png,
                    "");
        } else if (locPrefix == locGIFPrefix) {
            result = new SignatureReturn(aField, C_iPicDataType_EncodingData, locSignatureData, C_iPicDataFormat_Gif,
                    "");
        } else if (locPrefix == locJPGPrefix) {
            result = new SignatureReturn(aField, C_iPicDataType_EncodingData, locSignatureData, C_iPicDataFormat_Jpeg,
                    "");
        } else {
            result = new SignatureReturn(aField, C_iPicDataType_Path, aSignatureData, C_iPicDataFormat_Png, "");
        }
    }
    return result;
}

function getAppendFormatStr() {
    var locCurrentPersonName = sourceData.currentPerson.name;
    var locCurrentTime = DateUtil.toString(new Date(), "yyyy-MM-dd HH:mm");
    var locSign = "追加";

    var result = "[" + locCurrentPersonName + " " + locCurrentTime + " " + locSign + "]";
    return result;
}

function isSetResultAttr(aFieldID, aIsSubForm) {
    var locFFD = null;
    if (!aIsSubForm) {
        locFFD = mffdMap.get(aFieldID);
    } else {
        locFFD = sffdMap.get(aFieldID);
    }
    var locEDObj = locFFD.extendFieldDefine;
    if (locEDObj != null && locEDObj != "null") {
        var locET = parseInt(locEDObj.extendFieID);
        if (locET == C_iFieldExtendControlType_ChooseDate || locET == C_iFieldExtendControlType_ChooseDateTime) {
            return true;
        } else {
            return false;
            ;
        }
    } else {
        return true;
    }
}

function getETByFieldID(aFieldID, aIsSubForm) {
    var locFFD = null;
    if (!aIsSubForm) {
        locFFD = mffdMap.get(aFieldID);
    } else {
        locFFD = sffdMap.get(aFieldID);
    }
    var locEDObj = locFFD.extendFieldDefine;
    if (locEDObj != null && locEDObj != "null") {
        var locET = parseInt(locEDObj.extendFieID);
        return locET;
    } else {
        return -1;
    }
}
// ========================================extend control
// end===========================================

// ========================================input
// verification============================
function bindVerifyEvent(aFCtrlObj, aFieldDefine) {
    var locFFID = aFieldDefine.id;
    var locDT = aFieldDefine.dataType;
    var locCE = aFieldDefine.calculateExpression;
    var locAT = aFieldDefine.accessType;

    if ((isNullValue(locCE) || isEmptyValue(locCE))
            && (locAT != C_iFieldAccess_Invisible || locAT != C_iFieldAccess_Readonly)) {
        if (locDT == C_iFieldDataType_String) {
            bindLengthLimit(aFCtrlObj, aFieldDefine);
        } else if (locDT == C_iFieldDataType_Integer) {
            bindNumericOnly(aFCtrlObj, aFieldDefine);
        } else if (locDT == C_iFieldDataType_Decimal) {
            bindDecimal(aFCtrlObj, aFieldDefine);
        } else {
            return;
        }
    }
}

function bindLengthLimit(aFieldObj, aFieldDefine) {
    aFieldObj.bind("focusout", function() {
        var locCheckRS = checkLen(this, aFieldDefine);
        if (locCheckRS < 0) {
            setErrorBackground(this);
        } else {
            setRightBackground(this);
        }
    });
}

function bindNumericOnly(aFieldObj, aFieldDefine) {
    aFieldObj.bind("focusout", function(event) {
        var locCheckRS = checkNumberAndLen(this, aFieldDefine, 0);
        if (locCheckRS < 0) {
            setErrorBackground(this);
        } else {
            setRightBackground(this);
        }
    });
}

function bindDecimal(aFieldObj, aFieldDefine) {
    aFieldObj.bind("focusout", function(event) {
        var locCheckRS = checkDecimalAndLen(this, aFieldDefine);
        if (locCheckRS < 0) {
            setErrorBackground(this);
        } else {
            setRightBackground(this);
        }
    });
}

var C_iErrorCode_OverLength = -1;
var C_iErrorCode_OverLengthOfIntegerPart = -2;
var C_iErrorCode_OverLengthOfDecimalPart = -3;
var C_iErrorCode_Null = -4;
var C_iErrorCode_IsNaN = -5;
var C_iErrorCode_DecimalFormat = -6;
var C_iErrorCode_Correct = 1;

function getCtrlObjValue(aFieldObj) {
    var locFieldObj = $(aFieldObj);
    var locFieldID = locFieldObj.attr("id");
    var locFieldDefine = getFieldDefineByFieldID(locFieldID);
    var locFdt = -1;
    if (!isUndefinedValue(locFieldDefine)) {
        locFdt = parseInt(locFieldDefine.dataType);
    }
    var result;
    if (locFdt == C_iFieldDataType_Signature) {
        result = locFieldObj.attr("result");
    } else if (locFieldObj.attr("tagName") == "INPUT" || locFieldObj.attr("tagName") == "SELECT"
            || locFieldObj.attr("tagName") == "TEXTAREA") {
        result = locFieldObj.val();
    } else {
        result = locFieldObj.html();
    }

    return nullToString(result);
}

function checkNull(aFieldObj, aFieldDefine, aVerifyType) {
    aVerifyType = handleFormVerifyType(aVerifyType);
    if (aVerifyType != C_iFormVerifyType_NoCheckNull) {
        var locEnableNull = aFieldDefine["null"];
        var locValue = getCtrlObjValue(aFieldObj);
        if (isEmptyValue(locValue) && !locEnableNull) {
            return C_iErrorCode_Null;
        } else {
            return C_iErrorCode_Correct;
        }
    } else {
        return C_iErrorCode_Correct;
    }
}

/**
 * 匹配双字节的字符
 */
var C_sCommonReg_DoubleByte = /[^\x00-\xff]/g;
function checkLen(aFieldObj, aFieldDefine, aVerifyType) {
    var locCNRS = checkNull(aFieldObj, aFieldDefine, aVerifyType);
    if (locCNRS == C_iErrorCode_Correct) {
        var locLenLimit = parseInt(aFieldDefine.length);
        var locValue = getCtrlObjValue(aFieldObj);
        var locDoubleByteArray = null;
        if (isA8Server()) {
            locDoubleByteArray = locValue.match(C_sCommonReg_DoubleByte);
        }
        if (isNullValue(locDoubleByteArray)) {
            if (locValue.length > locLenLimit && locLenLimit != 0) {
                return C_iErrorCode_OverLength;
            } else {
                return C_iErrorCode_Correct;
            }
        } else {
            var locDoubleByteCount = locDoubleByteArray.length;
            var locByteLen = locDoubleByteCount * 3;
            var locSingleByteCount = locValue.length - locDoubleByteCount;
            var locActuallyLen = locByteLen + locSingleByteCount;
            if (locActuallyLen > locLenLimit && locLenLimit != 0) {
                return C_iErrorCode_OverLength;
            } else {
                return C_iErrorCode_Correct;
            }
        }
    } else {
        return locCNRS;
    }
}

function checkNumberAndLen(aFieldObj, aFieldDefine, aVerifyType) {
    var locCLRS = checkLen(aFieldObj, aFieldDefine, aVerifyType);
    if (locCLRS == C_iErrorCode_Correct) {
        var locValue = getCtrlObjValue(aFieldObj);
        if (isNaN(locValue) && locValue != "") {
            return C_iErrorCode_IsNaN;
        } else {
            return C_iErrorCode_Correct;
        }
    } else {
        return locCLRS;
    }
}

function checkDecimalAndLen(aFieldObj, aFieldDefine, aVerifyType) {
    var locDcimalLimit = parseInt(aFieldDefine.decimalCount);
    var locCNRS = checkNull(aFieldObj, aFieldDefine, aVerifyType);
    if (locCNRS == C_iErrorCode_Correct) {
        var locFV = getCtrlObjValue(aFieldObj);
        if (isNaN(locFV) && locFV != "") {
            return C_iErrorCode_IsNaN;
        } else if (locFV != "") {
            var locLenLimit = parseInt(aFieldDefine.length);
            var locFVList = locFV.split("\.");

            if (isA8Server()) {
                locLenLimit -= locDcimalLimit;
            }

            if (locFVList[0].length > locLenLimit) {
                return C_iErrorCode_OverLengthOfIntegerPart;
            } else if (!isUndefinedValue(locFVList[1]) && isEmptyValue(locFVList[1])) {
                return C_iErrorCode_DecimalFormat;
            } else if (!isUndefinedValue(locFVList[1]) && locFVList[1].length > locDcimalLimit) {
                return C_iErrorCode_OverLengthOfDecimalPart;
            } else {
                return C_iErrorCode_Correct;
            }
        }
    } else {
        return locCNRS;
    }
}

var C_iFormVerifyType_CheckAll = 1;
var C_iFormVerifyType_NoCheckNull = 2;

function handleFormVerifyType(aVerifyType) {
    var locVFTRS = null;
    if ((isNullValue(aVerifyType) || isUndefinedValue(aVerifyType))
            || (aVerifyType != C_iFormVerifyType_CheckAll && aVerifyType != C_iFormVerifyType_NoCheckNull)) {
        return C_iFormVerifyType_CheckAll;
    } else {
        return aVerifyType;
    }
}

function verifyForm(aVerifyType) {
    aVerifyType = handleFormVerifyType(aVerifyType);
    var locErrorInfoList = new Array();
    // verify master form
    if (!isNullValue(mffdMap) && !isUndefinedValue(mffdMap)) {
        var locMFFDList = mffdMap.valueArray();
        verifyFieldDefineList(locMFFDList, locErrorInfoList, aVerifyType);
    }
    // verify subordinate form
    if (!isNullValue(sffdMap) && !isUndefinedValue(sffdMap)) {
        var locSFFDList = sffdMap.valueArray();
        verifyFieldDefineList(locSFFDList, locErrorInfoList, aVerifyType);
    }

    if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
        return JSON.stringify(locErrorInfoList);
    } else if (clientType == C_sClientType_AndroidPad || clientType == C_sClientType_AndroidPhone) {
        var locErrorObjForAndroid = new Object();
        locErrorObjForAndroid.command = C_iInvokeNativeCtrl_ErrorInfo;
        locErrorObjForAndroid.errorInfoList = locErrorInfoList;
        window.m1.runOnAndroidJavaScript(JSON.stringify(locErrorObjForAndroid));
    } else {
        return;
    }
}

function verifyFieldDefineList(aFieldDefineList, aErrorInfoList, aVerifyType) {
    if (!isNullValue(aFieldDefineList) && !isUndefinedValue(aFieldDefineList)) {
        var locMFFDLen = aFieldDefineList.length;
        for ( var i = 0; i < locMFFDLen; i++) {
            var locMFFD = aFieldDefineList[i];
            var locMFFID = locMFFD.id;
            $(getJQuerySelectorByAttr("id", locMFFID)).each(function() {
                if ($(this).attr(C_sSubFF_State) != C_sSubFFState_Delete) {
                    verifyField(this, locMFFD, aErrorInfoList, aVerifyType);
                }
            });
        }
    }
}

var ErrorInfo = function(aFieldID, aAssistID, aDisplayName, aErrorInfo) {
    if (isUndefinedValue(aAssistID)) {
        aAssistID = "undefined";
    }
    this.field = aFieldID;
    this.assistID = aAssistID;
    this.displayName = aDisplayName;
    this.errorInfo = aErrorInfo;
};

function changeErrorState(aFieldObj, aErrorCode) {
    if (aErrorCode < 0) {
        setErrorBackground(aFieldObj);
    } else {
        setRightBackground(aFieldObj);
    }
}

function verifyField(aFieldObj, aFieldDefine, aErrorInfoList, aVerifyType) {
    var locFFID = aFieldDefine.id;
    var locDT = aFieldDefine.dataType;
    var locCE = aFieldDefine.calculateExpression;
    var locAT = aFieldDefine.accessType;
    var locFct = aFieldDefine.controlType;
    var locCFRS;
    if (locAT == C_iFieldAccess_Invisible || locAT == C_iFieldAccess_Readonly || locDT != C_iFieldDataType_Signature) {
        return aErrorInfoList;
    } else {
        if (locFct == C_iFieldControlType_ExtendControl) {
            locCFRS = checkNull(aFieldObj, aFieldDefine, aVerifyType);
        } else if (locFct == C_iFieldControlType_Radio) {
            locCFRS = checkNullForRadio(aFieldObj, aFieldDefine, aVerifyType);
            aFieldObj = aFieldObj[0];
        } else if (locDT == C_iFieldDataType_String || locDT == C_iFieldDataType_Enumeration
                || locDT == C_iFieldDataType_Attatchment || locDT == C_iFieldDataType_Picture) {
            locCFRS = checkLen(aFieldObj, aFieldDefine, aVerifyType);
        } else if (locDT == C_iFieldDataType_Integer) {
            locCFRS = checkNumberAndLen(aFieldObj, aFieldDefine, aVerifyType);
        } else if (locDT == C_iFieldDataType_Decimal) {
            locCFRS = checkDecimalAndLen(aFieldObj, aFieldDefine, aVerifyType);
        } else if (locDT == C_iFieldDataType_Date) {
            locCFRS = checkLen(aFieldObj, aFieldDefine, aVerifyType);
        } else if (locDT == C_iFieldDataType_DateTime) {
            locCFRS = checkLen(aFieldObj, aFieldDefine, aVerifyType);
        } else {
            locCFRS = C_iErrorCode_Correct;
        }

        changeErrorState(aFieldObj, locCFRS);

        var locFieldID = aFieldObj.id;
        var locAssistID = aFieldObj[C_sSubFF_AsssitIDAttr];
        var locDisplayName = aFieldDefine.displayName;
        var locErrorMsg = null;
        var locErrorInfo = null;
        switch (locCFRS) {
        case C_iErrorCode_DecimalFormat:
            locErrorMsg = "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u5c0f\u6570\u683c\u5f0f\u3002";
            locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
            aErrorInfoList.push(locErrorInfo);
            break;
        case C_iErrorCode_IsNaN:
            locErrorMsg = "\u8f93\u5165\u9519\u8bef\uff0c\u8bf7\u8f93\u5165\u6570\u5b57\u3002";
            locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
            aErrorInfoList.push(locErrorInfo);
            break;
        case C_iErrorCode_Null:
            locErrorMsg = "\u5fc5\u987b\u586b\u5199\u3002";
            locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
            aErrorInfoList.push(locErrorInfo);
            break;
        case C_iErrorCode_OverLength:
            if (isA8Server()) {
                locErrorMsg = "\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7" + parseInt(aFieldDefine.length / 3)
                        + "\u4e2a\u4e2d\u6587\u5b57\u7b26\u3002";
                locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
                aErrorInfoList.push(locErrorInfo);
            } else {
                locErrorMsg = "\u8f93\u5165\u8d85\u8fc7\u6307\u5b9a\u957f\u5ea6" + aFieldDefine.length + "\u3002";
                locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
                aErrorInfoList.push(locErrorInfo);
            }
            break;
        case C_iErrorCode_OverLengthOfDecimalPart:
            locErrorMsg = "\u5c0f\u6570\u4f4d\u8d85\u8fc7\u6307\u5b9a\u957f\u5ea6" + aFieldDefine.decimalCount
                    + "\u3002";
            locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
            aErrorInfoList.push(locErrorInfo);
            break;
        case C_iErrorCode_OverLengthOfIntegerPart:
            var locLenLimit = parseInt(aFieldDefine.length);
            if (isA8Server()) {
                var locDcimalLimit = parseInt(aFieldDefine.decimalCount);
                locLenLimit -= locDcimalLimit;
            }
            locErrorMsg = "\u6574\u6570\u4f4d\u8d85\u8fc7\u6307\u5b9a\u957f\u5ea6" + locLenLimit + "\u3002";
            locErrorInfo = new ErrorInfo(locFieldID, locAssistID, locDisplayName, locErrorMsg);
            aErrorInfoList.push(locErrorInfo);
            break;
        }
        return aErrorInfoList;
    }
}

function setErrorBackground(obj) {
    obj.style.background = "#ffcc99";
}

function setRightBackground(obj) {
    obj.style.background = "#ffffff";
}
// ========================================input verification
// end==========================================

// =======================================get form
// result==================================================
MEdocFormItem = function(displayValue, returnValue, dataType) {
    this.displayValue = displayValue;
    this.returnValue = returnValue;
    this.dataType = dataType;
    this.classType = "MEdocFormItem";
};

function getFormResultForBranch() {
    if (clientType == C_sClientType_Ipad || clientType == C_sClientType_Iphone) {
        return getFormResultFromWebView();
    } else if (clientType == C_sClientType_AndroidPad || clientType == C_sClientType_AndroidPhone) {
        getFormResultFromWebView();
    } else {
        return;
    }
}

var C_sAssociateID_New = "NEW";

function getFormResultFromWebView() {
    var formResult = new Object();
    if (!isNullValue(mffdMap) && !isUndefinedValue(mffdMap)) {
        var mffdList = mffdMap.valueArray();
        var mffdLen = mffdList.length;
        for ( var i = 0; i < mffdLen; i++) {
            var locMMFD = mffdList[i];
            var locFDT = parseInt(locMMFD.dataType);
            var locFFID = locMMFD.fieldID;
            var locMMFV = mffvMap.get(locFFID);
            
            var returnValueList = [];
            var displayValueList = [];
            if(locMMFV != null && typeof locMMFV != "undefined" && locMMFV.value != null) {
                var locValueList = locMMFV.value.returnValueList;
                if(locValueList != null) {
                    var locValueLen = locValueList.length;
                    for(var n = 0; n < locValueLen; n++) {
                        var locTmpValue = locValueList[n];
                        returnValueList.push(locTmpValue.returnValue);
                        displayValueList.push(locTmpValue.displayName);
                    }
                }
            }
            var returnValueStr = joinStrBySpecSeparator(returnValueList, ",");
            var displayValueStr = joinStrBySpecSeparator(displayValueList, ",");
            var valueItem = new MEdocFormItem(displayValueStr,returnValueStr,locFDT);
            formResult[locFFID] = valueItem;
        }
        
        //处理签章数据
        if (signatureResultCache != null && signatureResultCache.size() > 0) {
            var signatureDataList = signatureResultCache.valueArray();
            var len = signatureDataList.length;
            for ( var i = 0; i < len; i++) {
                var data = signatureDataList[i];
                var fieldName = data.fieldName;
                var fieldValue = data.fieldValue;
                
                var valueItem = new MEdocFormItem("",fieldValue,C_iFieldDataType_Signature);
                formResult[fieldName] = valueItem;
            }
        } else {
            if(signatureFieldIDMapper != null && signatureFieldIDMapper.size() > 0){
                var signatureFieldIDList = signatureFieldIDMapper.keyArray();
                var len = signatureFieldIDList.length;
                for ( var i = 0; i < len; i++) {
                    var fieldName = signatureFieldIDList[i];
                    var valueItem = new MEdocFormItem("","",C_iFieldDataType_Signature);
                    formResult[fieldName] = valueItem;
                }
            }
        }
    }
    var msignatureIds = $.toJSON(mSignatureDataCache);
    formResult["msignatureIds"] = msignatureIds;
    var result = getCommandStr(C_iInvokeNativeCtrlCommand_Result, formResult);
    return returnResultToClient(result);
}

function getCtrlResult(aFieldDefine, aFieldCtrl, aTypeName) {
    var locCT = aFieldDefine.controlType;
    var locFV = null;
    if (locCT == C_iFieldControlType_CheckBox && aTypeName == "checkbox") {
        locFV = aFieldCtrl.checked;
    } else {
        locFV = aFieldCtrl.value;
    }
    return locFV;
}

var FormResult = function() {
    this.masterResult = new Array();
    this.subordinateResult = new Array();
};

FormResult.prototype = {
    addMFResult : function(mfResult) {
        this.masterResult.push(mfResult);
    },
    addSFResult : function(sfResult) {
        this.subordinateResult.push(sfResult);
    }
};

var MFieldResult = function(aFieldID, aValue, aAssociateID, aDataType, aDisplayValue) {
    this.field = aFieldID;
    this.value = aValue;
    this.associateID = aAssociateID;
    this.dataType = aDataType;
    this.displayValue = aDisplayValue;
};

var SFormResult = function(aFormID, aRowID) {
    this.formID = aFormID;
    this.rowID = aRowID;
    this.fieldValuesList = new Array();
    this.recordIDAndStateList = new Array();
};

SFormResult.prototype = {
    addSFieldValues : function(aSFieldValues) {
        this.fieldValuesList.push(aSFieldValues);
    },

    addSFormRecordIDAndState : function(aSFormRecordAndState) {
        this.recordIDAndStateList.push(aSFormRecordAndState);
    }
};

var SFieldValues = function(aFieldID, aDataType, aDisplayValueList) {
    this.field = aFieldID;
    this.value = new Array();
    this.displayValueList = new Array();
    this.associateIDList = new Array();
    this.dataType = aDataType;
};

SFieldValues.prototype = {
    addValue : function(aValue, aAssociateID, aDisplayValue) {
        this.value.push(aValue);
        this.associateIDList.push(aAssociateID);
        this.displayValueList.push(aDisplayValue);
    }
};

var SRecordIDAndState = function(aRecordID, aState) {
    this.name = aRecordID;
    this.value = aState;
};
// =======================================get form result
// end==============================================

// ========================================fix Number's toFixed method's
// bug===============================

Number.prototype.toFixed = function(d) {
    var s = this + "";
    if (!d)
        d = 0;
    if (s.indexOf(".") == -1)
        s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for ( var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
        }
        if (b) {
            s = s.substr(1);
        }
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};

// =======================================date asssitance
// functions================================================
var C_lTotalMilliSecOfDay = 1000 * 60 * 60 * 24;
var C_lTotalMilliSecOfHour = 1000 * 60 * 60;

function getTimeMS(value) {
    var date = DateUtil.getTheDateTimeByStr(value);
    if (date != null) {
        return Date.parse(value.replace(/\-/g, '/'));
    } else
        return 0;
}

$(function() {
    // alert(DateUtil.toString(new Date(), "yyyy-MM-dd"));
});

var DateUtil = {};
DateUtil.toString = function(dateTime, format) {
    if (dateTime == null) {
        dateTime = new Date();
    }
    if (format == null) {
        format = "yyyy-MM-dd HH:mm:ss";
    }
    return dateTime.pattern(format);
};

// 传递进来的是日期类型（2010-2-3）或日期时间类型（2010-2-3 2:3:3）的字符，返回一个日期对象，前提是符合日期表达式
DateUtil.checkDateFormat = function(str) {
    // 日期型
    var onlydate = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
    return onlydate.test(str);
};
DateUtil.checkDateTimeFormat = function(str) {
    // 日期时间型
    var datet = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))\s+(20|21|22|23|[0-1]?\d):[0-5]?\d:?[0-5]?\d$/;
    return datet.test(str);
};
// 字符返回日期时间类型对象
DateUtil.getTheDateTimeByStr = function(str) {
    var te = new RegExp("([0-9]+)", "g");
    var result;
    if (DateUtil.checkDateTimeFormat(str)) {
        result = str.match(te);
        return new Date(result[0], result[1], result[2], result[3], result[4], result[5]);
    } else {
        if (DateUtil.checkDateFormat(str)) {
            result = str.match(te);
            return new Date(result[0], result[1], result[2], "0", "0", "0");
        } else {
            return null;
        }
    }
};
DateUtil.getDate = function() {
    var now = new Date();
    return this.toString(now);
};

Date.prototype.pattern = function(fmt) {
    var o = {
        "M+" : this.getMonth() + 1, // 月份
        "d+" : this.getDate(), // 日
        "h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
        "H+" : this.getHours(), // 小时
        "m+" : this.getMinutes(), // 分
        "s+" : this.getSeconds(), // 秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
        "S" : this.getMilliseconds()
    // 毫秒
    };
    var week = {
        "0" : "\u65e5",
        "1" : "\u4e00",
        "2" : "\u4e8c",
        "3" : "\u4e09",
        "4" : "\u56db",
        "5" : "\u4e94",
        "6" : "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "")
                + week[this.getDay() + ""]);
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// -----------------------------------for readonly control can't display whole
// content to pop a div layer
function bindAssistDisplayLayer(aFieldID) {
    $(getJQuerySelectorByAttr("id", aFieldID)).each(function() {
        $(this).bind("click", function() {
            showTips("", this);
        });
    });
}

var C_sTipsLayer_ID = "tipslayer";
var C_sBGLayer_ID = "bglayer";
function insertBgLayer(aTargetObj) {
    var locBodyWidth = aTargetObj.attr("offsetWidth") + aTargetObj.attr("scrollLeft");
    var locBodyHeight = aTargetObj.attr("offsetHeight") + aTargetObj.attr("scrollTop");
    var locBgLayer = $("<div>");
    locBgLayer.attr("id", C_sBGLayer_ID);
    locBgLayer.css({
        position : "absolute",
        display : "block",
        background : "#777",
        top : 0,
        left : 0,
        opacity : 0.6,
        width : locBodyWidth + "px",
        height : locBodyHeight + "px",
        zIndex : 10000
    });
    aTargetObj.append(locBgLayer);
}

function deleteLayer(aID) {
    var targetObj = $(getJQuerySelectorByID(aID));
    if (targetObj.length > 0) {
        targetObj.remove();
    }
}

function getAbsoluteLocationEx(element) {
    if (arguments.length != 1 || isNullValue(element)) {
        return null;
    }
    var elmt = element;
    var offsetTop = elmt.offsetTop;
    var offsetLeft = elmt.offsetLeft;
    var offsetWidth = elmt.offsetWidth;
    var offsetHeight = elmt.offsetHeight;
    while (elmt = elmt.offsetParent) {
        // add this judge
        if (elmt.style.position == 'absolute' || elmt.style.position == 'relative'
                || (elmt.style.overflow != 'visible' && elmt.style.overflow != '')) {
            break;
        }
        offsetTop += elmt.offsetTop;
        offsetLeft += elmt.offsetLeft;
    }
    return {
        top : offsetTop + offsetHeight,
        left : offsetLeft + (offsetWidth / 4),
        offsetWidth : offsetWidth,
        offsetHeight : offsetHeight
    };
}

function showTips(aTitle, aObj) {
    deleteLayer(C_sTipsLayer_ID);
    var locTipsWidth = 180;
    var locTipsHeight = 80;
    var locTitleheight = 25;
    var locTitlecolor = "#99CCFF";// 提示窗口的标题颜色

    var locRootObj = $("body");

    // insertBgLayer(locRootObj);
    var locContent = aObj.value;
    if (locContent.indexOf("\n") == 0 || locContent.indexOf("\r\n") == 0) {
        locContent = locContent.substring(1);
    }
    locContent = locContent.replace(new RegExp("\r\n", "g"), "<br/>").replace(new RegExp("\n", "g"), "<br/>");
    var locContentArray = locContent.split("<br>");
    var locContentArrayLen = locContentArray.length;
    if (locContentArrayLen > 1) {
        var locTmpContent = null;
        for ( var i = 0; i < locContentArrayLen; i++) {
            var locTmp = $("<p/>").append(locContentArray[i]);
            if (i == 0) {
                locTmpContent = locTmp;
            } else {
                locTmpContent = locTmpContent.append(locTmp);
            }
        }
        locContent = locTmpContent;
    }

    var locTipsLayer = $("<div>");
    locTipsLayer.attr("id", C_sTipsLayer_ID);
    locTipsLayer.css({
        position : "absolute",
        background : "white",
        width : locTipsWidth,
        height : locTipsHeight,
        height : "auto",
        border : "2px #aaa solid",
        wordWrap : "break-word",
        wordBreak : "normal",
        zIndex : 10001
    });
    locTipsLayer.css(getAbsoluteLocationEx(aObj));

    var locAngleLayer = $("<em>");
    locAngleLayer.css({
        display : "block",
        overflow : "hidden",
        width : "0px",
        height : "0px",
        border : "6px solid #336699",
        borderColor : "#999 #fff",
        borderWidth : "0 8px 8px 8px",
        position : "absolute",
        left : "30px",
        top : "0",
        marginTop : "-10px"
    });
    locTipsLayer.append(locAngleLayer);

    var locTitleLayer = $("<h4>");
    locTitleLayer.attr("align", "right");
    locTitleLayer.css({
        margin : "0px",
        padding : "8px",
        background : "#cacaca",
        opacity : 0.75,
        border : "1px #aaa solid",
        height : "12px",
        font : "12px Verdana, Geneva, Arial, Helvetica, sans-serif",
        color : "black"
    });
    locTitleLayer.append("关闭");
    locTitleLayer.bind("click", function() {
        deleteLayer(C_sTipsLayer_ID);
    });
    locTipsLayer.append(locTitleLayer);

    var locContentLayer = $("<p>");
    locContentLayer.css({
        margin : "2px 4px",
        font : "10px Verdana, Geneva, Arial, Helvetica, sans-serif"
    });
    locContentLayer.append(locContent);
    locTipsLayer.append(locContentLayer);

    locRootObj.append(locTipsLayer);
}

// ------------------------A8 adapter assistance------------
function isA8Server() {
    var locServerType = sourceData.formType;
    if (locServerType == "A8") {
        return true;
    } else {
        return false;
    }
}

// --------------------ajax tools class---------------------
function initAajxGobalAttr() {
    if (isA8Server()) {
        if (typeof actionURL == "undefined") {
            actionURL = "";
        }
        actionURL += "/getAjaxDataServlet?callback=?";
        $.ajaxSetup({
            cache : false,
            dataType : 'jsonp',
            url : actionURL,
            type : 'GET',
            timeout : 30000
        });
    }
}
function AjaxParameter() {
    this.instance = [];
};

AjaxParameter.prototype.put = function(index, type, value) {
    var isArray = type.indexOf("[]") > -1;

    this.instance[this.instance.length] = {
        index : index,
        type : isArray ? type.substring(0, type.length - 2) : type,
        value : value,
        isArray : isArray
    };
};

AjaxParameter.prototype.toAjaxParameter = function(serviceName, methodName, needCheckLogin, returnValueType) {
    needCheckLogin = isNullValue(needCheckLogin) ? "false" : needCheckLogin;
    if (!serviceName || !methodName) {
        return null;
    }

    var str = "";
    str += "S=" + serviceName;
    str += "&M=" + methodName;
    str += "&CL=" + needCheckLogin;
    str += "&RVT=" + returnValueType;

    if (this.instance != null && this.instance.length > 0) {
        for ( var i = 0; i < this.instance.length; i++) {
            var obj = this.instance[i];

            var paramterName = "P_" + obj.index + "_" + obj.type;

            if (obj.isArray) {// 数组
                if (isNullValue(obj.value) || obj.value.length == 0) {
                    str += "&" + paramterName + "_A_N=";
                } else if (obj.value instanceof Array) {
                    for ( var k = 0; k < obj.value.length; k++) {
                        str += "&" + paramterName + "_A=" + encodeURIComponent(obj.value[k]);
                    }
                }
            } else {
                var v = nullToString(obj.value);
                str += "&" + paramterName + "=" + encodeURIComponent(v);
            }
        }
    }
    return str;
};

function nullToString(aSourceStr, aToStr) {
    if (isUndefinedValue(aToStr)) {
        aToStr = "";
    }
    if (isNullValue(aSourceStr) || isUndefinedValue(aSourceStr)) {
        return aToStr;
    } else {
        return aSourceStr + "";
    }
}

function getJQuerySelectorByID(aID) {
    var result = "#" + aID;
    return result;
}

/**
 * 获取JQuery选择器表达式
 * 
 * @param aAttrName
 *                属性名称
 * @param aAttrValue
 *                属性值
 * @param aEqualOrNot
 *                等于或不等于
 * @param aTag
 *                标签名
 * @returns {String}
 */
function getJQuerySelectorByAttr(aAttrName, aAttrValue, aEqualOrNot, aTag) {
    var result = "";
    aTag = nullToString(aTag);
    if (!isUndefinedValue(aAttrValue)) {
        aEqualOrNot = (isUndefinedValue(aEqualOrNot) ? true : false);
        if (aEqualOrNot) {
            result = aTag + "[" + aAttrName + "=\"" + aAttrValue + "\"]";
        } else {
            result = aTag + "[" + aAttrName + "!=\"" + aAttrValue + "\"]";
        }
    } else {
        result = aTag + "[" + aAttrName + "]";
    }
    return result;
}

function isUndefinedValue(aValue) {
    if (typeof aValue == "undefined" || aValue == "undefined") {
        return true;
    } else {
        return false;
    }
}

function isNullValue(aValue) {
    if (aValue == null) {
        return true;
    } else {
        return false;
    }
}

function isEmptyValue(aValue) {
    if (aValue == "") {
        return true;
    } else {
        return false;
    }
}

function handleURLEscapte(aValue, aEscapeStr, aResultStr) {
    if (aValue == null)
        return "";
    while (aValue.indexOf(aKey) != -1) {
        aValue.replace(aEscapeStr, aResultStr);
    }
    return aValue;
}

/*
 * =========================================== 签章
 * C_iInvokeNativeCtrlCommand_InitSignatureData
 * ===========================================
 */
htmlSignatureM1 = function() {
    var len = signatureInitCache.length;
    var paramList = [];
    var fieldEventAlreadyExsitMapping = new Map();
    for ( var i = 0; i < len; i++) {
        var tj = signatureInitCache[i].tj;
        var signatureAreaName = tj.objName;
        var fieldName = getEdocFieldIDFromSignatureAreaID(signatureAreaName);
        var t = $("#" + fieldName + "_opinion");
        var recordID = tj.recordId;

        var rowID = 0;
        var width = 0;
        var height = 0;
        
        if(t.length == 1) {
            width = t.attr("width");
            height = t.attr("height");
        } else {
            t = $("#" + fieldName);
            width = t.attr("width");
            height = t.attr("height");
        }
        
        var imgSpan = null;
        //添加签章按钮事件
        if(tj.enabled == 1 && !fieldEventAlreadyExsitMapping.containsKey(fieldName)) {
            var param = new Object();
            param.fieldName = currentSignatureAreaID;
            param.version = "";
            param.recordID = rowID;
            param.picData = "";
            param.height = height + "";
            param.width = width + "";
            param.summaryID = recordID;
            var eventBtnID = getEventBtnID(currentSignatureAreaID);
            imgSpan = $("<div/>").attr("id", eventBtnID);
            var signatureEventArea = $("<img/>").attr("src","ic_form_signature.png").bind("click",{param:param}, function(event){
                var commandValue = event.data.param;
                
				if(signatureResultCache == null || signatureResultCache.get(currentSignatureAreaID) == null) {
				    var tmpSignatureData = currentSignatureData;
				    if(tmpSignatureData == null) {
				        tmpSignatureData = "";
				    }
				    commandValue.fieldValue = tmpSignatureData;
				} else {
				    var data = signatureResultCache.get(currentSignatureAreaID);
				    var tmpSignatureData = data.fieldValue;
				    if(tmpSignatureData == null) {
				        tmpSignatureData = "";
				    }
				    commandValue.fieldValue = tmpSignatureData;
				}
                
                var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_HandWrite, commandValue);
                requestClientWithParameter(commandStr);
            });
			if(tj.support == true ){
				imgSpan.append(signatureEventArea);
			}
            imgSpan.insertBefore(t);
        }
        

        if(tj.signatureData != null) {
        	/*if(imgSpan != null) {
        		imgSpan.hide();
        	}*/
            var item = new Object();
            item.summaryID = recordID;
            item.fieldName = tj.objName;
            item.fieldValue = tj.signatureData;
            item.recordID = rowID;
            item.width = width;
            item.height = height;
            item.picData = "";
            item.classType = "MJINGESignature";
            paramList.push(item);
        }
        fieldEventAlreadyExsitMapping.put(fieldName, "");
    }
    signatureInitCache = [];

    if(paramList.length > 0) {
        var commandStr = getCommandStr(C_iInvokeNativeCtrlCommand_InitSignatureData, paramList);
        requestClientWithParameter(commandStr);
    }
};
