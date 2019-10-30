var urlParam;

var summaryId = "";
var affairId = "";
var orgAccountId = "";
var userId = "";
var userName="";
var docMark = "";
var docMark2 = "";
var serialNo = "";
var opinionPolicy = "";
var cancelOpinionPolicy = "";
var disAgreeOpinionPolicy = "";
var attribute = "";
var nowNodeOpinion = "";
var actions = "";
var _isTrack = 0;
var _subState = "";
var isNewImg=false;
var showOpinion = false;
/** 定义全局变量 **/
var pageX = {};
pageX.hasOptArea = false;//意见附件区域是否有内容
var topHeight = "";
var opinionHeight = 0;  //意见头部高度
var summaryBO = {};

var openFrom;
var listType = "";
var finished = false;
var nodePolicy = "";

var formContentConfig; //正文组件需要参数
var initEdoc = true;//是否初始化正文组件
var _storge_key = document.location.href;
var canHtmlSign = false;
var isProcessTemplate = false;

//工作流相关参数
pageX.workflowParam = {}
pageX.drawWfParam = {};
pageX.drawWfData = null;
pageX.isFocuseWf = false;

/****************************     页面初始化 start ****************************/


/**
 * 获取初始化参数，兼容url传参和和CMP方式传参
 */
function _initParamData() {
	
    urlParam = cmp.href.getParam() || {};
	
	if(cmp.isEmptyObject(urlParam)) {
		urlParam = EdocUtils.getHrefQuery();
	}
	
}

cmp.ready(function() {
	
	cmp.backbutton();
	cmp.backbutton.push(_goBack);
	
	_initParamData();
	
	//注册懒加载
    _registLazy();
	
    cmp.dialog.loading();

	/** 1 国际化 */
    cmp.i18n.init(_edocPath + "/i18n/", "EdocResources", function() {
	    
    	if(cmp.isEmptyObject(urlParam)) {
    		_alert(cmp.i18n("Edoc.error.code._1"), function() {
    			_goBack();
    		});
    		return;
    	}
    	
    	/** 3 ajax请求获取内容 */
    	openFrom = urlParam["openFrom"];
        
        var storageObj = cmp.storage.get(_storge_key, true);
    	if(storageObj && storageObj!=null) {
    		var _json = JSON.parse(storageObj);
    		pageX.isDefaultWorkflow = _json.isDefaultWorkflow;
    		if(_json.openFrom){
    			openFrom = _json.openFrom;
    		}
    		_M3_Remove_Storage();
    	}
        
    	//添加缓存
        document.addEventListener('beforepageredirect', function(e){ 
        	cmp.storage.save("v5_m3_edoc_summaryBO", cmp.toJSON(window.summaryBO), true);
        });
        var cacheSumamryBO = cmp.storage.get("v5_m3_edoc_summaryBO", true);
        if(cacheSumamryBO && cacheSumamryBO != null){
        	summaryBO = JSON.parse(cacheSumamryBO);
        	cmp.storage["delete"]("v5_m3_edoc_summaryBO", true);
        }
        
    	$s.EdocResource.edocSummary({},  
	    	{
	            "affairId" : urlParam["affairId"] || -1,
	            "summaryId" : urlParam["summaryId"] || -1,
	            "openFrom": openFrom,
	            "docResId" : urlParam["docResId"] || "",
                "baseObjectId" : urlParam["baseObjectId"] || "",
                "baseApp" : urlParam["baseApp"] || "",
                'isTODO' : urlParam['isTODO'] || ""
	        }, 
	        {
	        	success : function(result) {
	                if (result) {
	                	
	                	/** 4 当前Affair状态校验 */
	                	if(result["error_msg"] && result["error_msg"]!="") {
	                		_alert(result["error_msg"], function() {
	                			_goBack();
	                		});
	                		return;
	                	}
	                	
	                	if(!result.edocSummary) {
	                		_alert(cmp.i18n("Edoc.error.code._1"), function() {
	                			_goBack();
	                		});
	                		return;
	                	}
	                	if(openFrom=="glwd" && (result.ctpAffair.state == "5" || (result.ctpAffair.state == "1" && result.ctpAffair.subState == "3"))){
	                		_alert(cmp.i18n("Edoc.to.glwd.no.pass.alert",[result.edocSummary.subject]),function(){
	                			_goBack();
	                		});
	                		return;
	                	}
	                	/** 5 后台返回值赋值给全局变量 */
	                	listType = result.listType;
	                	if(result.ctpAffair.isDelete) {
	                		listType = "onlyView";
	                	}
	                	finished = result.edocSummary.finished;
	                	state = result.edocSummary.state;
	                    summaryId = result.edocSummary.id;
	                    orgAccountId = result.edocSummary.orgAccountId;
	                    userId = result.currentUser.currentUserId;
	                    userName = result.currentUser.currentUserName;
	                    docMark = result.edocSummary.docMark;
	                    docMark2 = result.edocSummary.docMark2;
	                    serialNo = result.edocSummary.serialNo;
	                    opinionPolicy = result.opinionPolicy;
	                    cancelOpinionPolicy = result.cancelOpinionPolicy;
	                    disAgreeOpinionPolicy = result.disAgreeOpinionPolicy;
	                    pageX.flowPermAccout = result.flowPermAccout;
	                    attribute = result.attribute;
	                    nowNodeOpinion = result.nowNodeOpinion;
	                    actions = result.actions;
	                    affairId = result.ctpAffair.id;
	                    _isTrack = result.ctpAffair.track;
	                    _subState = result.ctpAffair.subState;
	                    disPosition = result.disPosition;
	                    isProcessTemplate = result.processTemplate;
	                    nodePolicy = result.nodePolicy;
	                    
	                    pageX.isFlowBack = !result.ctpAffair.backFromId ? "" : result.ctpAffair.backFromId;
	                    pageX.optionType = !result.optionType ? "" : result.optionType;
	                    pageX.specialStepBack = result.specialStepBack;
	                    pageX.edocSummary = result.edocSummary;
	                    pageX.isQuickSend = result.edocSummary.isQuickSend;
	                    pageX.moduleType = result.moduleType;

	                    //是否是保存待发状态，除去指定回退到待发的状态
	                    var isWaitSendState = openFrom == "listWaitSend";
	                   
	                    
	                    pageX.validationStepback = true;
	                    pageX.validationStepback1 = true;
	                    pageX.validationStepback2 = true;
	                    if(pageX.specialStepBack==false) {
	                        
	                        isWaitSendState = false;
	                        
	                		if(_subState=='15' || _subState=='17' || _subState=='19') {
	                			pageX.validationStepback = false;
	                		} 
	                		if(_subState =='16') {
	                			pageX.validationStepback1 = false;
	                		}
	                		if(_subState !='16' && _subState !='17') {
	                			pageX.validationStepback2 = false;
	                		}
	                	}

	                 // 获取流程图
                        pageX.drawWfParam = {};
                        if (typeof (result.edocSummary.processId) == "undefined" || result.edocSummary.processId == ""
                                || result.edocSummary.processId == null) {
                            pageX.drawWfParam.processId = result.templateProcessId;
                            pageX.drawWfParam.isRunning = false;
                        } else {
                            pageX.drawWfParam.processId = result.edocSummary.processId;
                            pageX.drawWfParam.caseId = (isWaitSendState || !result.edocSummary.caseId) ? "" : result.edocSummary.caseId;
                            pageX.drawWfParam.isRunning = true;
                            pageX.drawWfParam.activityId = result.ctpAffair.activityId;
                        }
                        pageX.workflowParam["processId"] = pageX.drawWfParam.processId;
                        // 发起人id
                        pageX.drawWfParam.startMemberId = result.edocSummary.startMember.id;
                        // 发起人name
                        pageX.drawWfParam.startMemberName = result.edocSummary.startMember.name;
                        
	                    
	                    //此方法需要再loadData前执行
		                if(pageX.isDefaultWorkflow==true) {
		                	toWorkflow();
		                	loadWorkFlow(pageX.drawWfParam, result.edocSummary.isQuickSend);
		                }
					    
	                    /** 6 显示公文单 */
	                    loadData(result);
	                    
	                    /** 8 界面调整 */
	                    if(listType=="onlyView") {
	                        $(".cmp-bar-footer").hide();
	                    }
	    
	                    /** 9 初始化流程图 */
	                    pageX.workflowParam["moduleType"] = result["moduleType"];
	                    pageX.workflowParam["processId"] = result["edocSummary"]["processId"];
	                    pageX.workflowParam["caseId"] = !result["edocSummary"]["caseId"] ? "" : result["edocSummary"]["caseId"];
	                    pageX.workflowParam["bodyType"] = result["edocSummary"]["bodyType"];
	                    pageX.workflowParam["edocTypeName"] = result["edocSummary"]["edocTypeName"];
	                    pageX.workflowParam["currentNodeId"] = result["ctpAffair"]["activityId"];
	                    pageX.workflowParam["subObjectId"] = result["ctpAffair"]["subObjectId"];
	                    pageX.workflowParam["defaultPolicyId"] = result["defaultNode"]["defaultNodeName"];
	                    pageX.workflowParam["defaultPolicyName"] = result["defaultNode"]["defaultNodeLable"];
	                    pageX.workflowParam["currentAccountId"] = result["currentUser"]["currentAccountId"];
	                    pageX.workflowParam["currentAccountName"] = result["currentUser"]["currentAccountName"];
	                    pageX.workflowParam["currentUserId"] = result["currentUser"]["currentUserId"];
	                    pageX.workflowParam["currentUserName"] = result["currentUser"]["currentUserName"];
	                    pageX.workflowParam["submitStyleCfg"] = result["submitStyleCfg"];
	                    
	                    /**文单签批 只有CMP可以进行文单签批*/
	                    if(cmp.platform.CMPShell && isInArray(actions, 'HtmlSign')){
//	                    	_wenDanqianpi(result.disPosition,result.filedValue);
	                    	pageX._disPosition = result.disPosition;
	                    	pageX._filedValue  = result.filedValue;
	                    	canHtmlSign = true;
	                    }
	                    
	                } else {
	                    _alert(cmp.i18n("Edoc.alert.openError"));
	                    _goBack(true);
	                }
	                
	                /** 12 添加各种事件 */
	                bindClick();

	            	//文单中有签批，需要更新图片
	            	cmp.listView("#edoc_form_wrapper", {
	            		imgCache:true,
	            		config:{
	            			customScrollMoveEvent: function (scrollY) {  //启用自定义时，其他参数不要传
	                            if(scrollY > 30){
	                            	showOrHide(false);
	                            }
	                        }
	            		}
	            	});
	            	
	            	_stopSubmitting();
	            	
	            	//启动懒加载
	                LazyUtil.startLazy();
	        	},
	        	error : function(e) {
	        		_stopSubmitting();
	        		EdocUtils.ajaxErrorHander(e);
	        	}
	        });
    	//国际化title标签
    	document.querySelector("title").innerText=cmp.i18n("Edoc.label.edocDetail");
	},$verstion);
	orientationUI();
});

function orientationUI(){
    cmp.event.orientationChange(function(res){
        
         //设置正文区域高度
		var titleH = _$("#summary_titile_container").offsetHeight,
		edocSummaryH=_$("#edocSummary").offsetHeight,//页签
		edocFrom =_$("#edocFrom"), //content
		content_div=_$("#content_div"), //正文
		footer_btnsH = _$("#footer_btns").offsetHeight,
		bodyHeight = window.innerHeight,
		edoc_form_wrapper = _$("#edoc_form_wrapper"), //意见区域
		edocBody = _$("#edocBody"), //页签2 正文
		edocWorkFlow =_$("#edocWorkFlow"), //流程
        headerH = 0;
		
		var refreshH = bodyHeight - titleH - edocSummaryH - footer_btnsH;
		edocFrom.style.height = refreshH +"px";
		content_div.style.height = refreshH +"px";
		edocBody.style.height = refreshH +"px";
		edocWorkFlow.style.height = refreshH +"px";
		edoc_form_wrapper.style.height = refreshH +"px";
		// cmp.listView("#edoc_form_wrapper").refreshHeight(refreshH); //如果是用了listView的话，用此方法刷新
		SeeyonContent.refresh("content_div");
    });
}
/**
 * 注册缓加载
 */
function _registLazy(){
  //注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "css" : [
                 _cmpPath + "/css/cmp-audio.css" + $verstion,
                 _cmpPath + "/css/cmp-selectOrg.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-flowV5.js" + $verstion,
                _cmpPath + "/js/cmp-push.js" + $verstion,
                _cmpPath + "/js/cmp-app.js" + $verstion,
                _cmpPath + "/js/cmp-audio.js" + $verstion,
                _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                _cmpPath + "/js/cmp-handWriteSignature.js" + $verstion,
                _cmpPath + "/js/cmp-contentEdit.js" + $verstion,
                _common_v5_path + "/widget/ContentEdit-debug.js" + $verstion
                ]
    });
    
    //工作流
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "depend" : "lazy_cmp",
        "dependModel" : "strong",
        "css" : [],
        "js" : [
                _wfPath + "/js/wf.js" + $verstion,
                _cmpPath + "/js/cmp-zoom.js" + $verstion
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_content",
        "depend" : "lazy_cmp",
        "dependModel" : "strong",
        "css" : [
                 _common_v5_path + "/cmp-resources/content.css" + $verstion
                 ],
        "js" : [
                _common_v5_path + "/widget/SeeyonContent.js" + $verstion
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_jssdk",
        "css" : [],
        "js" : [
                editContent_jssdk, doc_jssdk, commonPhrase_jssdk, last_jssdk, collaboration_jssdk
        ]
    });
}


function toWorkflow() {
    
    pageX.isFocuseWf = true;
    document.querySelector("#edocBody").classList.add("display_none");
    
	var workflowTabClassList = _$("#workflog_tab").classList;
    if(!workflowTabClassList.contains("cmp-active")){
    	workflowTabClassList.add("cmp-active");
    }
    var workflowClassList = _$("#edocWorkFlow").classList;
    if(!workflowClassList.contains("cmp-active")){
    	workflowClassList.add("cmp-active");
    }
    var formTabClassList = _$("#formTab").classList;
    if(formTabClassList.contains("cmp-active")){
    	formTabClassList.remove("cmp-active");
    }
    var edocFromClassList = _$("#edocFrom").classList;
    if(edocFromClassList.contains("cmp-active")){
    	edocFromClassList.remove("cmp-active");
    }
}

/**
 * 模板数据加载
 * @param data
 */
function loadData(data){
	try{
	    
	    //加载标题区域
	    var titleTpl = document.querySelector("#summary_title_tpl").innerHTML;
	    document.querySelector("#title_div").innerHTML = cmp.tpl(titleTpl, data);
	    
	    //页签显示
	    if(!data.edocSummary.isQuickSend){
	        document.querySelector("#workflog_tab").classList.remove("display_none");
	    }else{
	    	document.querySelector("#workflog_tab").remove();
	    }
	    
	    //意见
	    if(data.opinions.sendOpinionStr.length !=0 ||  data.opinions.opinions.length != 0){
	        var opinionsTpl = document.querySelector("#summary_opinions_tpl").innerHTML;
	        var beforeDiv = document.querySelector("#attachment_container") == null ? document.querySelector("#edoc_form") : document.querySelector("#attachment_container");
	        beforeDiv.insertAdjacentHTML("afterEnd",cmp.tpl(opinionsTpl, data));
	        //替换后台生成的意见HTML中的附件展示部分
	        replaceAttArea(data.opinions.opAtts);
	        opinionHeight = 35;
	        pageX.hasOptArea = true;
	    }
	    
        if(!data.ctpAffair.finish && data.listType!="onlyView" && (data.ctpAffair.state != 2 || data.ctpAffair.memberId == userId)) {
            var sfooter = document.querySelector("#footer_btns");
            sfooter.classList.remove("display_none");
            var footerTpl = document.querySelector("#summary_footer_tpl").innerHTML;
            sfooter.innerHTML = cmp.tpl(footerTpl, data);
            var footerLength = sfooter.innerHTML.replace(/\s+/g,'');
            //如果footbtns为空那么就隐藏掉
            if(footerLength.length<1){
            	sfooter.style.height = 0;
            }
        }
	    
        /** 9 附件显示 */
	    if(data.attachmentList.length > 0){
	        var loadParam = {
           		selector : "#attchemntFileList",
           		atts : data.attachmentList
       		}
        	new SeeyonAttachment({loadParam : loadParam});
	        _addToggleEvent("attachment_container");
	        
	      	//设置数量
	        var attContainer = document.querySelector("#attachment_container");
	        attContainer.classList.remove("display_none");
	        attContainer.querySelector("#att_file_count").innerText = data.attachmentSize;
	        attContainer.querySelector("#att_ass_count").innerText = data.relatedDocSize;
	        
	        opinionHeight = 35;
	        pageX.hasOptArea = true;
	    }else{
	        //没有附件直接移除容器
	        document.querySelector("#attachment_container").remove();
	    }
        
        //公文单展示
	    //计算文档展示高度
	    var bodyHeight = document.body.clientHeight;
	    var hearderHeight = 0;//document.getElementById("edocSummaryHearder").offsetHeight;
	    var titleHeight = document.getElementById("summary_titile_container").offsetHeight;
	    var edocSummaryHeight = document.getElementById("edocSummary").offsetHeight;
	    var footer_btnsHeight = document.getElementById("footer_btns").offsetHeight;
	    topHeight = bodyHeight - hearderHeight - titleHeight - edocSummaryHeight - footer_btnsHeight - opinionHeight;

	    var cHeight = topHeight + 35;
	    document.getElementById("content_div").style.height = topHeight + "px";
	    
	    
	    var $edocFWrapper =  document.getElementById("edoc_form_wrapper");
	    $edocFWrapper.style.top = topHeight - 10 + "px";
	    $edocFWrapper.style.height = cHeight + "px";
	    document.getElementById("edocBody").style.height = cHeight + 'px';
	    document.getElementById("edocWorkFlow").style.height = cHeight + 'px';
	    
	    //初始化正文
	    formContentConfig = {
            "target" : "content_div",
            "bodyType" : "99",
            "content" : _replaceImgSrc(data.edocFormContent) || "",
            "momentum" : true,
            "moduleType" : "4",
            "onload" : function(){
            	if(canHtmlSign){
            		_wenDanqianpi(pageX._disPosition,pageX._filedValue);
            	}
            	_fixFieldHeightAndWidth();
            },
            "onScrollBottom" : function(){
            	showOrHide();
            }
        }
	    
	    LazyUtil.addLoadedFn("lazy_content", function(){
	      //当前页签不是文单则不初始化组件
	        var v1 = _$("#formTab");
	        if(v1.classList.contains("cmp-active")){
	          //初始化正文
	            SeeyonContent.init(formContentConfig);
	            initEdoc = true;
	        }
	        
	        //正文区域
	        var edocBodies = data.edocSummary.edocBodies;
	        var edocBody = edocBodies[0];
	        if(edocBodies && edocBodies.length > 1){
	        	for(var i=0; i<edocBodies.length;i++){
	        		if(edocBodies[i].contentType != "Pdf"){
	        			edocBody = edocBodies[i];
	        		}
	        	}
	        }
	        var contentConfig = {
	                "target" : "edocBody",
	                "bodyType" : SeeyonContent.getBodyCode(edocBody.contentType),
	                "lastModified" : edocBody.lastModified,
	                "content" : edocBody.content || "",
	                "momentum" : true,
	                "moduleType" : "4",
	                "onload" : null,
	                "ext" : {
	                    reference : summaryId
	                }
	            }
	        //初始化正文
	        SeeyonContent.init(contentConfig);
	        data = null;
	    });
        
	}catch(e){
		alert(e.message);
	}
	cmp.IMG.detect();
}

function replaceAttArea(data){
	for(var item in data){
		var opfiles = data[item];
		if(opfiles && opfiles.length > 0){
			//删除意见下所有附件div
			for(var i = 0;i < opfiles.length;i++){
				var fileNode = document.querySelector("#attachmentDiv_" + opfiles[i].fileUrl);
				if(fileNode){
					fileNode.parentNode.removeChild(fileNode);
				}
			}
			//创建附件容器		
			var container = "<div id = 'opAttDiv" +item+ "' style='background-color:white;'></div>";
			var beforeDom = document.getElementById("attLabel"+item);
			if(beforeDom){
				beforeDom.insertAdjacentHTML("afterEnd",container);
				//初始化附件组件
				var loadParam = {
					selector : "#opAttDiv" + item,
					atts : opfiles
				}
				new SeeyonAttachment({loadParam : loadParam});
			}

		}
	}
	_addToggleEvent("sender_comment_container");
	_addToggleEvent("comments_container");
}

function _fixFieldHeightAndWidth() {
	var fieldNodes = _getFieldNodes("span");
	fieldNodes = fieldNodes.concat(_getFieldNodes("div"));
	if (fieldNodes.length > 0) {
		for (var i = 0; i < fieldNodes.length; i++) {
			var fieldNode = fieldNodes[i];
			/*
			 * var filedHeight =
			 * fieldNode.style.height; if
			 * (filedHeight) { filedHeight =
			 * parseInt(filedHeight, 10); } else {
			 * filedHeight = 0; }
			 */
			var filedScoreHeight = Math.max(fieldNode.scrollHeight,
					fieldNode.offsetHeight, fieldNode.clientHeight);
			var fieldWidth = _getContentAreaWidth(fieldNode);
			var fieldW = fieldWidth - _getAttWidth(fieldNode);
			if ("my:logoimg" == fieldNode.getAttribute("id")) {
				var imgObj = document.getElementById("logoimg_img");
				if (imgObj) {
					imgObj.style.width = fieldW + "px";
					imgObj.style.height = filedScoreHeight + "px";
					fieldNode.style.display = "none";
					imgObj.style.display = "";
				}
			} else {
				if (fieldW > 0) {
					fieldNode.style.width = fieldW + "px";
				} /*
					 * if (filedScoreHeight > filedHeight) {
					 * fieldNode.style.height = filedScoreHeight + "px"; }
					 */
			}
		}
	}
}

function _getContentAreaWidth(domObj) {
	var spanClientWidth = domObj.clientWidth;
	var paddingWidth = 0;
	var paddingLeft = _getRuntimeStyle(domObj, "paddingLeft")
			|| _getRuntimeStyle(domObj, "padding-left");
	if (paddingLeft) {
		if (paddingLeft.indexOf("px") != -1) {
			paddingWidth += parseInt(paddingLeft.replace("px", ""));
		} else if (paddingLeft.indexOf("pt") != -1) {
			paddingWidth += parseInt(paddingLeft.replace("pt", "")) * (4 / 3);
		}
	}
	var paddingRight = _getRuntimeStyle(domObj, "paddingRight")
			|| _getRuntimeStyle(domObj, "padding-right");
	if (paddingRight) {
		if (paddingRight.indexOf("px") != -1) {
			paddingWidth += parseInt(paddingRight.replace("px", ""));
		} else if (paddingRight.indexOf("pt") != -1) {
			paddingWidth += parseInt(paddingRight.replace("pt", "")) * (4 / 3);
		}
	}
	return (spanClientWidth - paddingWidth);
}
function _getRuntimeStyle(obj, k) {
	var v = null;
	if (obj.currentStyle) {
		v = obj.currentStyle[k];
	} else {
		v = window.getComputedStyle(obj, null).getPropertyValue(k);
	}
	return v;
}
function _getAttWidth(eNode, type) {
	var totalValue = 0;
	if (type) {
		var tValue = _getRuntimeStyle(eNode, type);
		totalValue = parseInt(tValue, 10);
		if (!totalValue) {
			totalValue = 0;
		}
	} else {
		var fBorderL = _getRuntimeStyle(eNode, "borderLeftWidth")
				|| _getRuntimeStyle(eNode, "border-left-width");
		var fBorderR = _getRuntimeStyle(eNode, "borderRightWidth")
				|| _getRuntimeStyle(eNode, "border-right-width");
		var fPaddingL = _getRuntimeStyle(eNode, "paddingLeft")
				|| _getRuntimeStyle(eNode, "padding-left");
		var fPaddingR = _getRuntimeStyle(eNode, "paddingRight")
				|| _getRuntimeStyle(eNode, "padding-right");
		var fMarginL = _getRuntimeStyle(eNode, "marginLeft")
				|| _getRuntimeStyle(eNode, "margin-left");
		var fMarginR = _getRuntimeStyle(eNode, "marginRight")
				|| _getRuntimeStyle(eNode, "margin-right");
		var bLValue = parseInt(fBorderL, 10);
		var bRValue = parseInt(fBorderR, 10);
		var pLValue = parseInt(fPaddingL, 10);
		var pRValue = parseInt(fPaddingR, 10);
		var mLValue = parseInt(fMarginL, 10);
		var mRValue = parseInt(fMarginR, 10);
		if (bLValue) {
			totalValue += bLValue;
		}
		if (bRValue) {
			totalValue += bRValue;
		}
		if (pLValue) {
			totalValue += pLValue;
		}
		if (pRValue) {
			totalValue += pRValue;
		}
		if (mLValue) {
			totalValue += mLValue;
		}
		if (mRValue) {
			totalValue += mRValue;
		}
	}
	return totalValue;
}
function _getFieldNodes(tageName) {
	var ret = [];
	var fieldNodes = document.getElementsByTagName(tageName);
	if (fieldNodes && fieldNodes.length > 0) {
		for (var i = 0; i < fieldNodes.length; i++) {
			var fieldNode = fieldNodes[i];
			var _nodeType = fieldNode.getAttribute("_nodeType");
			if ("_formFieldNode_" == _nodeType) {
				ret.push(fieldNode);
			}
		}
	}
	return ret;
}

function loadWorkFlow(params,isQuickSend){
	if(isQuickSend){
		return;
	}
	
	var wfTab = document.querySelector("#edocWorkFlow");
	var loadState = wfTab.getAttribute("_loadStatus");
	if(loadState == "3" || loadState == "1"){
	  //加载数据中，或者已经初始化完成流程
	    return;
	}else if(loadState == "2"){//数据已经加载完成
	    initWorkFlow(pageX.drawWfData,"edocWorkFlow");
	}else{
	    wfTab.setAttribute("_loadStatus", "1");
	    document.querySelector("#edocWorkFlow").innerText = "loading...";
	    if(typeof(params.processId)=='undefined' || params.processId=='' || params.processId==null){
	        var workFlowData = {};
	        workFlowData.nodes = [{
	            "id" : "start",
	            "name" : params.startMemberName,
	            "type" : "start",
	            "accountName" : "",
	            "partyType" : "user",
	            "x" : 80,
	            "y" : 50,
	            "cids" : [ "end" ]
	        }, {
	            "id" : "end",
	            "name" : "end",
	            "type" : "end",
	            "accountName" : "",
	            "x" : 190,
	            "y" : 50,
	            "pids" : [ "start" ]
	        }];
	        workFlowData.currentUserId = params.startMemberId;
	        workFlowData.currentUserName = params.startMemberName;
	        pageX.drawWfData = workFlowData;
	        wfTab.setAttribute("_loadStatus", "2");
	        if(pageX.isFocuseWf){
                initWorkFlow(pageX.drawWfData,"edocWorkFlow");
            }
	    }else{
	        $s.Workflow.getWorkflowDiagramData(params,{
	            success : function(result) {
	                wfTab.setAttribute("_loadStatus", "2");
	                result.activityId = params.activityId;
	                pageX.drawWfData = result;
	                if(pageX.isFocuseWf){
	                    initWorkFlow(pageX.drawWfData,"edocWorkFlow");
	                }
	                wfTab = null;
	            },
	            error: function(err){
	            	EdocUtils.ajaxErrorHander(err);
	            }
	        });
	    }
	}
}

//生成流程图
function initWorkFlow(workFlowData,workFlowId) {
	if(listType != "listSent") {
		if(workFlowData && workFlowData.nodes) {
			for(var i=0; i<workFlowData.nodes.length; i++) {
				workFlowData.nodes[i].isHasten = false;
			}
		}
	}
	var wfTab = document.querySelector("#edocWorkFlow");
	wfTab.setAttribute("_loadStatus", "3");
	wfTab.innerHTML = "";
	LazyUtil.addLoadedFn("lazy_wf", function(){
	    cmp.flowV5(workFlowData,{  //流程数据
	        id:workFlowId,//容器id
	        callback:function(nodeInfo, typeName){ //回调函数
	            
	            if(nodeInfo.nodeID == 'end' || nodeInfo.nodeID == 'start'){
	                return;
	            }
	            
//	            alert(cmp.toJSON(nodeInfo));
	            if(state == 1) {//如果公文被终止了
	                if(nodeInfo && nodeInfo.nodeMembers) {
	                    for(var i=0; i<nodeInfo.nodeMembers.length; i++) {
	                        if(nodeInfo.nodeMembers[i].handleState=="24") {//如果复合节点有终止人
	                            nodeInfo.zzmember = nodeInfo.nodeMembers[i].memberID;
	                            break;
	                        }
	                    }
	                }   
	            }
	            
	            if(typeName=="remindes") {
	                _hastenNode(nodeInfo);
	            } else {
	                _nodeDetail(nodeInfo);
	            }
	        }
	    });
	    workFlowData = null;
	    workFlowId = null;
    });
}

function _hastenNode(_nodeInfo) {
	//催办
    var hastenParam = {};

    hastenParam["app"] = 4;
    hastenParam["isAllHasten"] = "true";
    hastenParam["memberIds"] = "";
    hastenParam["affairId"] = affairId;
    if(_nodeInfo){
        hastenParam["activityId"] = _nodeInfo.nodeID || "";
    } 
    
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/details/remind.html?r="+Math.random(), hastenParam);
}

function _nodeDetail(_nodeInfo){
	//判断复合节点
	if(_nodeInfo.partyType != 'user'){
		var param = {"summaryId" : summaryId,"nodeId" : _nodeInfo.nodeID};
		 //节点是否激活
		 $s.Coll.showNodeMembers(param,{
			success : function(result) {
	            if(result.data.length>0){
	            	_nodeActive(result,_nodeInfo);
	            } else {
	            	_alert(cmp.i18n("Edoc.default.nodeActive"));
	            }
	        },
	        error: function(err){
	        	EdocUtils.ajaxErrorHander(err);
	        }
		});
	}
}

function _nodeActive(result,_nodeInfo){
	var paramData = {
		"listType" : listType,
		"summaryId" : summaryId,
		"affairId" : affairId,
		"nodeId" : _nodeInfo.nodeID,
		"finished": finished
	}
	pageX.isDefaultWorkflow = true;
	cmp.storage.save(_storge_key, JSON.stringify(pageX), true);
	cmp.event.trigger("beforepageredirect",document);
	cmp.href.next(_edocPath + "/html/edocDealUser.html?r="+Math.random(), paramData);
}

/****************************       页面初始化 end ****************************/


/****************************         添加事件 start ****************************/



/**
 * 绑定点击事件
 */
function bindClick(){
	addAttchmentFileClick();
	bindTrackEvent();
	bindDealEvent();
	bindMoreEvent();
    //_documentBack();
    
	cmp("#edocSummary").on("tap", "a", function(){
	     var _thisId = this.getAttribute("id");
	     if(_thisId === "edocBody_Tab"){
	         LazyUtil.addLoadedFn("lazy_content", function(){
	             SeeyonContent.refresh("edocBody");
            });
	         pageX.isFocuseWf = false;
	         document.querySelector("#edocBody").classList.remove("display_none");
	     }else if(_thisId === "workflog_tab"){
	         pageX.isFocuseWf = true;
	         loadWorkFlow(pageX.drawWfParam, pageX.isQuickSend);
	         document.querySelector("#edocBody").classList.add("display_none");
	     }else{
	         pageX.isFocuseWf = false;
	     }
    });
    
    //头部附件图标点击事件
    document.querySelector(".href_show").addEventListener("tap",function(){
    	showOrHide();
    },false);

    
    //点击公文单时初始化组件
    document.querySelector("#formTab").addEventListener("tap",function(){
    	if(!initEdoc){
    		return;
    	}
    	initEdoc = false;
    	//延迟，在跳转页签后执行
    	setTimeout(function(){
    	    LazyUtil.addLoadedFn("lazy_content", function(){
    	        SeeyonContent.init(formContentConfig);
    	    });
    	},100);
    });
}

/**
 * 附件图标点击事件
 */
function addAttchmentFileClick(){
	if(document.getElementById("attchmentFile")!=null){
		document.getElementById("attchmentFile").addEventListener("tap",function(){
			if($("#attchemntFileList").css("display")!="none"){
				$("#attchemntFileList").css("display","none");
			}else{
				$("#attchemntFileList").css("display","");
			}
		});
	}
}

function bindTrackEvent(){
	cmp(".cmp-bar-footer").on("tap","#trackButton",function(e){
		var button = document.getElementById("trackSpan");
		$s.EdocResource.setTrack({affairId : affairId}, {
	        success: function(result) {
				if("1" == result){
					button.innerHTML = cmp.i18n("Edoc.info.cancleTrack");
					document.getElementById("trackClass").className = "see-icon-v5-common-tracking-cancel";
				}else if("0" == result){
					button.innerHTML = cmp.i18n("Edoc.info.track");
					document.getElementById("trackClass").className = "see-icon-v5-common-tracking";
				}
	        },
	        error: function(err){
	        	EdocUtils.ajaxErrorHander(err);
	        }
	    });
	});	
}

//判断元素是否属于数组
function isInArray(arrs, obj){
	arr = arrs.split(',');
	var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;
}
/**
 * 更多操作
 */
function bindMoreEvent() {
	cmp(".cmp-bar-footer").on('tap', "#more", function (e) {
		var items = [];
		if(isInArray(actions, 'Return')) {
			if(pageX.validationStepback && pageX.validationStepback1 && pageX.validationStepback2) {
				items.push({key: "fallback", name: cmp.i18n("Edoc.action.fallback")});
			}
		}
		if(isInArray(actions, 'Terminate')){
			items.push({key: "terminate", name: cmp.i18n("Edoc.action.terminate")});
		}
		if(isInArray(actions, 'Cancel')){
			items.push({key: "revoke", name: cmp.i18n("Edoc.action.revoke")});
		}
		if(isInArray(actions, 'Edit')){//修改正文(还需要其他判断条件)
			if(pageX.edocSummary.edocBodies[0].content != "" && pageX.edocSummary.edocBodies[0].contentType != "HTML" && pageX.edocSummary.edocBodies[0].contentType != "Pdf"
				&& EdocUtils.isCMPShell()){//office格式正文 
				items.push({key: "edit", name: cmp.i18n("Edoc.page.lable.button.modifyContent")});
			}
		}
        cmp.dialog.actionSheet(items, cmp.i18n("Edoc.dialog.cancle"), function (item) {
        	if(summaryBO.editParam && !summaryBO.editParam.save && "edit" != item.key){
		    	cmp.notification.confirm(cmp.i18n("commons.note.saveOffice"),function(e){ //e==1是/e==0 否
		    		if(e==1){
		    			_editContent(false);
			        }else{
			        	dealFn(item);
			        }
			    },cmp.i18n("Edoc.page.dialog.note"), [cmp.i18n("Edoc.page.lable.no"), cmp.i18n("Edoc.page.lable.yes")],null,null,0);
		    }else{
		    	dealFn(item);
		    }
        }, function () {
            console.log("您点击了取消按钮!");
        });
    });
}

function dealFn(item){
	if(item.key == "fallback") {//回退
		item.action = WorkFlowLock.STEP_BACK;
	} else if(item.key == "terminate") {//终止s
		item.action = WorkFlowLock.STEP_STOP;
	} else if(item.key == "revoke") {//撤销
		item.action = WorkFlowLock.REPEAL_ITEM;
	} else if(item.key == "edit"){//修改正文
		item.action = WorkFlowLock.EDIT_CONTENT;
	}
	if(item.action != WorkFlowLock.EDIT_CONTENT){//不是修改正文
		if(item.action == WorkFlowLock.STEP_BACK){
			var param = new Object();
    		param["affairId"] = affairId;
			$s.EdocResource.canStepBack({},param, {
    	        success: function(result) {
    	            if(result["error_msg"]) {
    	                _alert(result["error_msg"], function() {
    	                	callback(false);
    	                });//提示
    	            } else {
    	            	lockWorkflowAndSkipDeal(item.key,item.action);
    	            }
    	        },
    	        error : function(err){
    	        	EdocUtils.ajaxErrorHander(err);
    	        }
    	    });
		}else{
			lockWorkflowAndSkipDeal(item.key,item.action);
		}
		
		
	}else{
		if(item.key == "edit"){
			_editContent(false);
		}
	}
}

var dealFlag = true;
/**
 * 跳转到处理界面
 */
function bindDealEvent() {
	cmp(".cmp-bar-footer").on("tap","#deal",function(e){
		if(dealFlag){
            dealFlag = false;
            var param = {"affairId":affairId,
                "summaryId":summaryId,
                "openFrom":openFrom,
                "orgAccountId":orgAccountId,
                "docMark":docMark,
                "docMark2":docMark2,
                "serialNo":serialNo,
                "processId":pageX.workflowParam["processId"],
                "opinionPolicy":opinionPolicy,
                "cancelOpinionPolicy":cancelOpinionPolicy,
                "disAgreeOpinionPolicy":disAgreeOpinionPolicy,
                "attribute":attribute,
                "nowNodeOpinion":nowNodeOpinion,
                "actions":actions,
                "isTrack":_isTrack,
                "filedsIsNull":checkFieldsIsNull(),
                "actionName":"submit",
                "workflowParam" : pageX.workflowParam,
                "subState":_subState,
                "qianpiData":qianpiData,
                "disPosition":disPosition,
                "isNewImg":isNewImg,
                "isFlowBack":pageX.isFlowBack,
                "optionType":pageX.optionType,
                "validationStepback":pageX.validationStepback,
                "validationStepback1":pageX.validationStepback1,
                "validationStepback2":pageX.validationStepback2,
                "weixinMessage":urlParam.weixinMessage,
                "flowPermAccout": pageX.flowPermAccout,
                "moduleType" : pageX.moduleType,
                "editParam":summaryBO.editParam,
                "isProcessTemplate":isProcessTemplate,
                "nodePolicy":nodePolicy
            };
            cmp.handWriteSignature.clear();//清除签批控件的缓存
            cmp.event.trigger("beforepageredirect",document);
            cmp.href.next(_edocPath + "/html/edocDeal.html?r="+Math.random() + EdocUtils.getQueryString(),param);

            setTimeout(function(){
                dealFlag = true;
            },700);
		}

	});
	
	//取回
	cmp(".cmp-bar-footer").on("tap","#takeBack",function(e){
		takeback(urlParam);
	});
	
	//撤销
	cmp(".cmp-bar-footer").on("tap","#revoke",function(e){
		var param = {"affairId":affairId,
					 "summaryId":summaryId,
					 "openFrom":openFrom,
					 "orgAccountId":orgAccountId,
					 "docMark":docMark,
					 "docMark2":docMark2,
					 "serialNo":serialNo,
					 "processId":pageX.workflowParam["processId"],
					 "opinionPolicy":opinionPolicy,
					 "cancelOpinionPolicy":cancelOpinionPolicy,
					 "disAgreeOpinionPolicy":disAgreeOpinionPolicy,
					 "attribute":attribute,
					 "nowNodeOpinion":nowNodeOpinion,
					 "actions":actions,
					 "isTrack":_isTrack,
					 "filedsIsNull":checkFieldsIsNull(),
					 "actionName":"revoke",
					 "title":cmp.i18n("Edoc.page.lable.button.cancel1"), // 撤销
					 "from":"revoke",
					 "qianpiData":qianpiData,
					 "disPosition":disPosition,
					 "isNewImg":isNewImg,
					 "validationStepback":pageX.validationStepback,
					 "validationStepback1":pageX.validationStepback1,
					 "validationStepback2":pageX.validationStepback2,
					 "weixinMessage":urlParam.weixinMessage,
					 "moduleType" : pageX.moduleType,
					 "editParam":summaryBO.editParam,
					 "nodePolicy":nodePolicy
					};
		cmp.event.trigger("beforepageredirect",document);
		cmp.href.next(_edocPath + "/html/edocDeal.html?r="+Math.random() + EdocUtils.getQueryString(),param);
	});
}


function takeback(urlParam) {
	//1 开启进度条
	_startSubmitting();
	
	//2 公文处理状态校验
	_checkAffairValid(function(checkRet) {
		if(checkRet) {
			
			//3 校验公文能否取回
			_checkTakeBack(function(checkTakeRet) {
				if(checkTakeRet) {
				
					//4 验证公文是否已交换
					_checkIsExchanged(function(result) {
						if(result) {
							
							// 5提示是
							var btnArray = [cmp.i18n("Edoc.page.lable.no"),cmp.i18n("Edoc.page.lable.yes")];
							cmp.notification.confirm(cmp.i18n("Edoc.alert.takeBack"), function(index) {
								//选择取消直接返回不执行之后代码
								if(index == '0') {
									_stopSubmitting();
									return;
								}
								
								//6 加锁
								WorkFlowDesignerUtil.lockH5Workflow(pageX.workflowParam["processId"], WorkFlowLock.TAKE_BACK, function(ret) {
									if(ret) {
										
										//7 取回
										try {
											var param = {"affairId":affairId,"summaryId":summaryId};
											$s.EdocResource.takeBack({}, param,{
												success : function(state) {
													_stopSubmitting();
													if(state == "0"){
														_goBack(true);;
													} else if(state== "-1"){
														_alert(cmp.i18n("Edoc.back.retrieve0"));
														return ;
													}else{
														var eLabel = "Edoc.back.retrieve" + state;
														_alert(cmp.i18n(eLabel));
													}
													//TODO 由主流程自动触发的新流程不可撤销
												},
												error: function(e) {
													_stopSubmitting();
													EdocUtils.ajaxErrorHander(e);
												}
											});
										} catch(e) {
											_alert(e.message);
											_stopSubmitting();
										}
									} else {
										_stopSubmitting();
										_goBack(true);;
									}
								});//6
							}, '', btnArray,null,null,0);//5
						} else {
							_stopSubmitting();
						}
					});//4
				} else {
					_stopSubmitting();
				}
			});//3
			
		} else {
			if(!affairValid){
				_goBack(true);;
			}
		}
	});
}

/****************************          添加事件 end ****************************/


/*****************************  公文校验方法 start ****************************/

function checkFieldsIsNull() {
	var fileIdIsNull = false;
	if(actions.indexOf("UpdateForm") >= 0) {
		$("span[id^='my:']").each(function() {
			if(this.getAttribute("required") == "true" && this.getAttribute("access") == "edit" && this.innerText=="") {
				if(this.getAttribute("id")=="my:signing_date" && this.innerHTML!=""){
					fileIdIsNull = false;
				}else{
					fileIdIsNull = true;
					return;
				}
			}
		 });
		$("div[id^='my:']").each(function() {
			if(this.getAttribute("required") == "true" && this.getAttribute("access") == "edit" && this.innerText=="") {
				if(this.getAttribute("id")=="my:signing_date" && this.innerHTML!=""){
					fileIdIsNull = false;
				}else{
					fileIdIsNull = true;
					return;
				}
			}
		});
	}	
	return fileIdIsNull;
}

//检查affair状态是否正常
function _checkTakeBack(callback) {
	$s.EdocResource.checkTakeBack({affairId : affairId}, {
		success: function(result) {
			if(result && result!="0") {
				if(result== "-1") {
					_alert(cmp.i18n("Edoc.back.retrieve0"));
				} else {
					_alert(cmp.i18n("Edoc.back.retrieve" + result));
				}
              	callback(false);
			} else {
          		callback(true);
			}
		},
		error: function(err){
			EdocUtils.ajaxErrorHander(err);
		}
	});
}

var affairValid = true;
//检查affair状态是否正常
function _checkAffairValid(callback) {
    $s.EdocResource.checkAffairValid({affairId : affairId}, {
        success: function(result) {
            if(result["error_msg"]) {
            	_alert(result["error_msg"], function() {
            		affairValid = false;
                	callback(false);
                });
            } else {
            	callback(true);
            }
        },
        error: function(err){
        	EdocUtils.ajaxErrorHander(err);
        }
    });
}

//检查affair状态是否正常
function _checkIsExchanged(callback) {
    $s.EdocResource.checkIsExchanged({summaryId : summaryId}, {
        success: function(result) {
        	if(result) {
        		callback(true);
        	} else {
        		_alert(cmp.i18n("Edoc.takeback.isExchanged"), function() {
            		callback(false);
            	});
        	}
        },
        error: function(err){
        	EdocUtils.ajaxErrorHander(err);
        }
    });
}

/*****************************   公文校验方法 end ****************************/


/***************************** 	  工具方法 start ****************************/
//返回
function _goBack(onlyBack) {
    
	_stopSubmitting();
	
    if(!onlyBack){
        unlockEdocAll();
    }
    if(cmp.handWriteSignature){
        cmp.handWriteSignature.clear();//返回时清除签章控件缓存
    }
    if(cmp.storage.get("m3_v5_edoc_summary_submit_", true)){
    	cmp.storage["delete"]("m3_v5_edoc_summary_submit_", true);//重复提交的缓存
    }
    
    cmp.webViewListener.fire({
        type: 'edoc.ListRefresh'
    });
    
	if(EdocUtils.getBackURL() == "weixin"){
        //返回到外层, 微信入口逻辑，因为微信没办法返回到首页，所以这样处理， 暂时不要和else分支合并
        cmp.href.closePage();
    }else {
    	//如果修改过正文，离开时会给出判断
    	if(summaryBO.editParam){
    		cmp.notification.confirm(cmp.i18n("Edoc.edit.office.content.confirm.save"),function(e){ //e==1是/e==0 否
        		if(e==1){
        			ContentEdit.clear(summaryBO.editParam);//离开时清除之前修改的文档
        			cmp.storage.delete("m3_v5_edoc_summary_BO_", true);//修改正文的缓存
    				//返回到外层
    		        if(urlParam && urlParam.fromXz && urlParam.fromXz != ""){
    					cmp.href.closePage();
    				}else{
    					cmp.href.back();
    				}
    	        }
    	    },cmp.i18n("Edoc.page.dialog.note"), [cmp.i18n("Edoc.page.lable.no"), cmp.i18n("Edoc.page.lable.yes")],null,null,0);
    	}else{
            if(urlParam && urlParam.fromXz && urlParam.fromXz != ""){
				cmp.href.closePage();
			}else{
				cmp.href.back();
			}
    	}
        
    }
}

function _alert(message, completeCallback, title, buttonLabel) {
	if(!title) {
		title = cmp.i18n("Edoc.page.dialog.note");
	}
	if(!buttonLabel) {
		buttonLabel = cmp.i18n("Edoc.page.dialog.OK");
	}
	cmp.notification.alert(message, completeCallback, title, buttonLabel);
}

//开始提交
function _startSubmitting(){
	cmp.dialog.loading();
}

//结束提交
function _stopSubmitting(){
	cmp.dialog.loading(false);
	//$("#loading").hide();
}

//协同解所有锁
function unlockEdocAll() {
	try {
		$s.EdocResource.unlockEdocAll({"summaryId":summaryId},{
	        success: function(result) {
	        },
	        error: function(err){
	        	EdocUtils.ajaxErrorHander(err);
	        }
	    });
	} catch(e) {}
}

/**
 * 替换文单里面的图片地址
 */
function _replaceImgSrc(edocFormContent) {
    //只有cmp壳才进行替换
    if(cmp.platform.CMPShell){
        edocFormContent = edocFormContent.replace(/(<img[^<]*?src=)(["'])\/seeyon([^<]*?)\2/ig, "$1$2" + cmp.origin + "$3$2")
    }
    return edocFormContent;
}

/**
 * 为附件等添加切换事件
 */
function _addToggleEvent(itemId){
    var el = document.querySelector("#" + itemId);
    if(el){
        el.querySelector(".attach-title").addEventListener("tap", function(){

        	var _id = this.parentElement.id;
        	
            var eBody = this.nextElementSibling;
            if(eBody){
                var eClass = eBody.classList;
                if (eClass.contains('display_none')) {
                    eClass.remove('display_none');
                }else{
                    eClass.add('display_none');
                }
                changeJiantouClass(this);
            }
            
            setTimeout(function(){
                cmp.listView("#edoc_form_wrapper").refresh();
            }, 50);
        });
    }
}

function changeJiantouClass(_this) {
	var icon = _this.querySelector('[class*="see-icon-v5-common-arrow"]');
    var iClass = icon.classList;
    if(!iClass.contains("see-icon-v5-common-arrow-right")){
        
        var iRClass = 'see-icon-v5-common-arrow-top';
        var iAClass = 'see-icon-v5-common-arrow-down';
        if (iClass.contains(iAClass)) {
            var tAClass = iRClass;
            iRClass = iAClass;
            iAClass = tAClass;
        } else if (iClass.contains(iRClass)) {
            var tAClass = iAClass;
            iRClass = iRClass;
            iAClass = tAClass;
        }
        
        iClass.remove(iRClass);
        iClass.add(iAClass);
    }
}

//删除缓存数据
function _M3_Remove_Storage(){
	cmp.storage.delete(_storge_key, true);
}

/***************************** 	   工具方法 end ****************************/

/***************************** 	   文单签批 start ****************************/
var haveLocation="";
var qianpiData="";
var disPosition="";//签批单元格名称
function _wenDanqianpi(_disPosition,_filedValue){
	if(_disPosition!="report"){//文单含有意见汇报元素，不能进行文单签批操作
		haveLocation = document.getElementById("my:"+_disPosition);
		disPosition=_disPosition;
		if(haveLocation && listType!="listDone"){//有签批权限和签批位置，以及不是已办才能签批
			var signData= cmp.storage.get("qianpiData", true);
			var _backFrom = cmp.href.getBackParam("backFrom");
			if(_backFrom == "edocDeal"){
				if(signData){
					signPic(signData);
				}
			}else{
				cmp.storage.delete("qianpiData", true);
			}
			var html = haveLocation.innerHTML;
			haveLocation.innerHTML="<lable id='qianpiLocation' class='see-icon-v5-common-doc-edit' style='margin-left:10px;width:20px;height:20px;color:blue;'></lable></br>"+html;
			document.querySelector("#qianpiLocation").addEventListener("tap", function(){
				_checkQianpiLock(_filedValue);
			});
		}
	}
}

function _checkQianpiLock(_filedValue){
	//判断是否加锁
	try {
		$s.EdocResource.qianpiLock({"summaryId":summaryId}, {
	        success: function(result) {
	        	if(result.curEditState) {//待验证
	        		_alert(cmp.i18n("Edoc.note.modifyForm"));
	        	} else {
	        		qianpipage(_filedValue);
	        	}
	        },
	        error: function(err){
	        	EdocUtils.ajaxErrorHander(err);
	        }
	    });
	} catch(e) {}
}
function qianpipage(_filedValue){
	var hasSignetures = false;
	if(isInArray(actions, 'Sign')){//是否有签章权限
		hasSignetures = true;
	}
	var param = {
			success: qianpiCallback,
            error: errorCallback,
           "fieldName":"hw"+disPosition,
           "fieldValue":_filedValue, // 需要提交到服务前端的base64数据
           "height":haveLocation.offsetHeight+"px", // 签章控件高
           "width":haveLocation.style.width,   // 签章控件宽
           "picData":"", // 可以显示在当前表单的签章图片base64
           "recordID":"0",
           "summaryID":summaryId,
           "currentOrgID":userId,
           "affairId":affairId,
           "currentOrgName":userName,
           "signatureListUrl": cmp.seeyonbasepath + '/rest/signet/signets/'+affairId, //签章列表url地址,http//10.5.6.240:88/seeyon/rest/signet/signets
           "signaturePicUrl": cmp.seeyonbasepath + '/rest/signet/signetPic',//获取签章数据url地址,http//10.5.6.240:88/seeyon/rest/signet/signetPic
           "hasSignetures": hasSignetures // 是否有签章权限
		}
	cmp.handWriteSignature.show(param);
}

function qianpiCallback(result){//签批后返回的数据
	qianpiData=window.JSON.stringify(result);
	signPic(result[0].picData)   
	isNewImg = true;
	cmp.storage.delete("qianpiData", true);
	cmp.storage.save("qianpiData", result[0].picData, true);
}

function signPic(picData){
	var hasQianpied = false;
	var imgs = haveLocation.getElementsByTagName("img");
	for(i=0; i<imgs.length; i++){
		if(imgs[i].id==affairId){
			//将base64位的数据转换成图片
			imgs[i].src="data:image/png;base64,"+picData;
			hasQianpied = true;
		}
	}
	if(!hasQianpied){
		var childNode=document.createElement("img");
		childNode.setAttribute("id", affairId);
		//将签批返回的base64位数据解析成图片
		childNode.src="data:image/png;base64,"+picData;
		haveLocation.appendChild(childNode);
	} 
}

function errorCallback(result){
	//alert("签批失败");
}
window.onbeforeunload = function () {//离开时清除签章控件缓存
    cmp.handWriteSignature.clear();
}
/***************************** 	   文单签批 end ****************************/
//传入当前希望显示与否
function showOrHide(flag){
    
    if(!pageX.hasOptArea){
        return;//没有意见区域
    }

    //希望隐藏而且当前是隐藏状态
    if(typeof(flag) != "undefined" && !flag && !showOpinion){
    	return;
    }
    
	if(showOpinion){
    	document.getElementById("edoc_form_wrapper").style.top = topHeight - 10 + "px";
    	document.getElementById("content_div").style.display = "";
		document.getElementById("hideArea").style.top = "0px";
    	showOpinion = false;
	}else{
		document.getElementById("content_div").style.display = "none";
		document.getElementById("edoc_form_wrapper").style.top = "0px";
		document.getElementById("hideArea").style.top = "10px";
		showOpinion = true;
	}
}

//修改office格式的正文
function _editContent(readOnly){
	$s.EditContent.getOfficeAuthKey({},{},{
		success : function(result) {
			if(result && result.authKey){
				var edocSummary = pageX.edocSummary.edocBodies[0];
				edocSummary.affairId = affairId;
				edocSummary.processId = pageX.drawWfParam.processId;
				edocSummary.copyRight = result.authKey;
				edocSummary.type = "edoc";
				edocSummary.readOnly = readOnly;
				edocSummary.createDate = pageX.edocSummary.createDate;
				edocSummary.isClearTrace = true;
				if(!readOnly){
					//修改正文时加锁
					WorkFlowDesignerUtil.lockH5Workflow(pageX.edocSummary.id, WorkFlowLock.EDIT_CONTENT, function(ret) {
				        if(ret) {
				        	LazyUtil.addLoadedFn("lazy_cmp", function(){
				        		if(!summaryBO.editParam){
				        			summaryBO.editParam = {};
				        		}
				        		summaryBO.editParam.save = false;//是否保存了正文
				        		
								ContentEdit.init(edocSummary);
							});
				        }
					});
				}else{
					LazyUtil.addLoadedFn("lazy_cmp", function(){
		        		if(!summaryBO.editParam){
		        			summaryBO.editParam = {};
		        		}
		        		summaryBO.editParam.save = false;//是否保存了正文
		        		
						ContentEdit.init(edocSummary);
					});
				}
			}else{
				_alert(cmp.i18n("Edoc.edit.office.content.authorization"));
			}
        },
        error: function(err){
        	EdocUtils.ajaxErrorHander(err);
        }
	});
}

function lockWorkflowAndSkipDeal(actionName,action){
	WorkFlowDesignerUtil.lockH5Workflow(pageX.workflowParam["processId"], action, function(ret) {
		if(ret) {
			
			var param = {"affairId":affairId,
					"summaryId":summaryId,
					"openFrom":openFrom,
					"orgAccountId":orgAccountId,
					"docMark":docMark,
					"docMark2":docMark2,
					"serialNo":serialNo,
					"processId":pageX.workflowParam["processId"],
					"opinionPolicy":opinionPolicy,
					"cancelOpinionPolicy":cancelOpinionPolicy,
					"disAgreeOpinionPolicy":disAgreeOpinionPolicy,
					"attribute":attribute,
					"nowNodeOpinion":nowNodeOpinion,
					"actions":actions,
					"isTrack":_isTrack,
					"filedsIsNull":checkFieldsIsNull(),
					"actionName":actionName,
					"action":action,
					"from":"moreRevoke",
					"qianpiData":qianpiData,
					"disPosition":disPosition,
					"isNewImg":isNewImg,
					"isFlowBack":pageX.isFlowBack,
					"optionType":pageX.optionType,
					"validationStepback":pageX.validationStepback,
					"validationStepback1":pageX.validationStepback1,
					"validationStepback2":pageX.validationStepback2,
					"weixinMessage":urlParam.weixinMessage,
					"moduleType" : pageX.moduleType,
					"nodePolicy" : nodePolicy
			};
			cmp.event.trigger("beforepageredirect",document);
			cmp.href.next(_edocPath + "/html/edocDeal.html?_r=1" + EdocUtils.getQueryString(),param);
		}
	});
}