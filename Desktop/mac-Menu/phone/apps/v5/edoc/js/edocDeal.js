var _isTrackType = 0;
var _attribute = 1;
var oldTrackValue = 0;
var totalUrl = "";
var actions = "";
var actionName = "";

var opinionPolicy = "";
var cancelOpinionPolicy = "";
var disAgreeOpinionPolicy = "";

var edocPolicyList = [];

/** 全局变量 **/
var pageX = {}
pageX.wfDesigner = null;
pageX.edocTypeName = "";
pageX.postData = {};
pageX.fileComponent = null;//附件组件
pageX.affairSubState = null;
pageX.MAX_INPUT_LENGTH = 2000;
var edocDealCacheKey ="";



/****************************     页面初始化 start ****************************/

/**
 * 页面初始化
 */
cmp.ready(function () {
    initPageBack();
    
	/** 1 国际化 */
	initi18n();
	
	_$("title").innerText=cmp.i18n("Edoc.action.deal");
	
	//注册懒加载
	_registLazy();
	
	/** 2 */
	totalUrl = cmp.storage.get("online-debug-url");
	if(totalUrl == null) {
		totalUrl = "";
	}
	
	/** 3 获取参数 */
	pageX.winParams = cmp.href.getParam();
	edocDealCacheKey = "edocDealCacheKey"+pageX.winParams.affairId;
	pageX.isSubmitting = cmp.storage.get("m3_v5_edoc_summary_submit_", true) || pageX.isSubmitting;
	if(pageX.isSubmitting){
		_$("#footerBtns").style.display="none";
        cmp.notification.toast(cmp.i18n("Edoc.action.alreadySubmit"),"center");
    }
	var _storageEditParam = cmp.storage.get("m3_v5_edoc_summary_BO_", true);
	window.editParam = JSON.parse(_storageEditParam);
	
	actions = cmp.href.getParam("actions");
	actionName = cmp.href.getParam("actionName");
	
	LazyUtil.addLoadedFn("lazy_wf", function(){
	  //这里有顺序，需要放在前面执行
	    if(pageX.winParams["action"]) {
	        pageX.action = pageX.winParams["action"];
	    } else {
	        if(actionName == "fallback") {//回退
	            pageX.action = WorkFlowLock.STEP_BACK;
	        } else if(actionName == "terminate") {//终止s
	            pageX.action = WorkFlowLock.STEP_STOP;
	        } else if(actionName == "revoke") {//撤销
	            pageX.action = WorkFlowLock.REPEAL_ITEM;
	        }   
	    }
    });
	
	pageX.processId = pageX.winParams["processId"];
	pageX.disPosition = pageX.winParams["disPosition"];
	opinionPolicy = pageX.winParams["opinionPolicy"];
	cancelOpinionPolicy = pageX.winParams["cancelOpinionPolicy"];
	disAgreeOpinionPolicy = pageX.winParams["disAgreeOpinionPolicy"];
	pageX.affairSubState = pageX.winParams["subState"];
	pageX.isFlowBack = !pageX.winParams["isFlowBack"] ? "" : pageX.winParams["isFlowBack"];
	pageX.optionType = !pageX.winParams["optionType"] ? "" : pageX.winParams["optionType"];	
	pageX.validationStepback = pageX.winParams["validationStepback"];
	pageX.validationStepback1 = pageX.winParams["validationStepback1"];
	pageX.validationStepback2 = pageX.winParams["validationStepback2"];
	
	/** 4 根据节点权限显示相应内容 */
	if(isInArray(actions, "Opinion")){
		$("#commonPhraseDiv").show();
		$("#btns").show();
		$("#opinionDiv").show();
		$("#edoc_deal_count").show();
	}
	
	/** 5 初始化常用语 */
	if(isInArray(actions, "Opinion") && isInArray(actions, "CommonPhrase")){
		
		$("#btns").show();
		_$("#phrasesBtn").style.display="";
		
		$s.CommonPhrase.phrases({}, {
            success : function(result) {
                if(result && result.length > 0){
                    var phraseTpl = _$("#phrases_template").innerHTML;
                    _$("#phrases_ul").innerHTML = cmp.tpl(phraseTpl, result);
                }
            },
            error: function(err){
            	EdocUtils.ajaxErrorHander(err);
            }
        });
		
		cmp("#phrases_ul").on("tap", "li", function(){
            _$("#edoc_deal_content").value = _$("#edoc_deal_content").value + this.innerHTML;
            _SwitchActive();
            fnFontCount();
        });
		
		var useful = _$('#phrasesBtn');
        var phrases_container = _$('#phrases_container');
        var phrases_div = _$('#phrases_div');
        
        phrases_div.style.height = phrases_container.offsetHeight+"px";
        
        //点击常用语
        useful.addEventListener('tap',function(e){
            e.stopPropagation();
            _SwitchActive();
        });
       
	}
	
	if(isInArray(actions, "UploadAttachment")){
		$("#btns").show();
		$("#commonPhraseDiv").show();
		$("#attchmentFile").show();
	}
	if (actionName == "submit") {
		
		if(isInArray(actions, "Comment")) {//暂存待办
			if(pageX.validationStepback && pageX.validationStepback1) {
				$("#zcdb").show();
			}
		}
		//若操作都没有，则不显示更多
		if(!isInArray(actions, "AddNode") && !isInArray(actions, "Infom") && 
				!isInArray(actions, "PassRead") && !isInArray(actions, "JointSign") && !isInArray(actions, "moreSign")) {
			$("#more").hide();
		}
		if($("#zcdb").css('display')=="none" && $("#submit").css('display')=="none") {
			document.getElementById("footerBtns").style.display="none";
		}
	} else {
		$("#zcdb").hide();
	    $("#submit").hide();
	    $("#more").hide();
	    $("#actionSubmit").show();
	    var _lable;
		if (actionName == "fallback") { //回退
		    _lable = cmp.i18n("Edoc.action.fallback");
		} else if (actionName == "terminate") { //终止
		    _lable = cmp.i18n("Edoc.action.terminate");
		} else if (actionName == "revoke") { //撤销
		    _lable = cmp.i18n("Edoc.action.revoke");
		}
		
		$("#title").html(_lable);
        //国际化title标签
        _$("title").innerText=_lable;
        $("#actionName").html(_lable);
        document.getElementById('edoc_deal_content').setAttribute('placeholder',cmp.i18n(("Edoc.action.comment.placeholder"), [_lable]));
		
        LazyUtil.addLoadedFn("lazy_wf", function(){
            //这里有顺序
            transActionFun(actionName, pageX.action);
        });
	}
	
	LazyUtil.addLoadedFn("lazy_cmp", function(){
	    cmp.listView('#topScroll');
    });
	
	/** 6 初始化工作流 */
	if (actionName == "submit") {
	    LazyUtil.addLoadedFn("lazy_wf", function(){
	        _initWfDesigner();
	    });
		pageX.edocTypeName = pageX.winParams["workflowParam"]["edocTypeName"];
	}
	
	/** 7 初始化跟踪内容 */
	$s.EdocResource.trackValue({"affairId":cmp.href.getParam('affairId')},{
        success : function(result){
            _isTrackType = result;
            oldTrackValue = _isTrackType;
            if(_isTrackType==1 || _isTrackType==2){
                $("#edoc_deal_follow_opinion").addClass("cmp-active");
            }
        },
        error: function(err){
        	EdocUtils.ajaxErrorHander(err);
        }
    });
	
	/** 8 添加意见框输入文字监听事件 */
	contentAddEventListener();
	
	/** 9 添加处理按钮事件 */
	dealButton(actionName);
	
	/** 10 添加常用语事件 */
	addPhraseEvent();
	
	var showAuth;
	var continueUpload = true;
	var nowNodeOpinion = cmp.href.getParam("nowNodeOpinion");
	var initAtt = nowNodeOpinion.opinionAttachments;
    
	/** 初始化附件 **/
	if(isInArray(actions, "UploadAttachment") && isInArray(actions, "UploadRelDoc")){
		if(!(pageX.disPosition=="report")){//节点权限是意见汇报时，屏蔽掉关联文档
			showAuth = -1;
    	}else{
    		showAuth = 1;
    	}
    } else if(isInArray(actions, "UploadAttachment")){
    	showAuth = 1;
    } else if(isInArray(actions, "UploadRelDoc")){
    	if(!(pageX.disPosition=="report")){//节点权限是意见汇报时，屏蔽掉关联文档
    		showAuth = 2;
    	}else{
    		if(actionName == "submit" && initAtt && initAtt.length > 0){//没有上传附件和关联文档的权限，但是已经有附件了，可以查看，但是不能上传
    			//showAuth = 0;
    			continueUpload = false;
    		}else{
    			_$("#attchmentFile").style.display="none";
    		}
    	}
    }else{
    	if(actionName == "submit" && initAtt && initAtt.length > 0){
			//showAuth = 0;
			continueUpload = false;
		}else{
			_$("#attchmentFile").style.display="none";
		}
    }
	
	if(initAtt && initAtt.length > 0){
		var tempCount = initAtt.length;
	    var tempText = "";
	    if(tempCount > 0){
	        tempText = tempCount;
	    }
	    document.getElementById("attCount").innerHTML = tempText;
	    
	    //附件图标有附件时显示蓝色
	    var attDom = document.querySelector("#attchmentFile");
	    if(!attDom.classList.contains("cmp-active")){
	    	attDom.classList.add("cmp-active");
	    }
	}
	var initParam = {
		showAuth : showAuth,
		uploadId : "picture",
		handler : "#attchmentFile",
		initAttData : initAtt,
		continueUpload: continueUpload,
		selectFunc : function(fileArray){
			//展示附件数量
		    var tempCount = fileArray.length;
		    var tempText = "";
		    if(tempCount > 0){
		        tempText = tempCount;
		    }
		    document.getElementById("attCount").innerHTML = tempText;
		    
		    //附件图标有附件时显示蓝色
		    var attDom = document.querySelector("#attchmentFile");
		    if(!attDom.classList.contains("cmp-active")){
		    	attDom.classList.add("cmp-active");
		    }
		}
	}
	LazyUtil.addLoadedFn("lazy_att", function(){
	    pageX.fileComponent = new SeeyonAttachment({"initParam" : initParam});
	    initParam = null;
    });
	
	
	setButtonState(pageX.affairSubState);
	
//	if(!cmp.platform.CMPShell){
//    	_$("#attchmentFile").style.display="none";
//    	_$("#attCount").style.display="none";
//    }
	
	//判断附件、常用语
	var phrasesDisplay = document.getElementById("phrasesBtn").style.display;
	var attDisplay = document.getElementById("attchmentFile").style.display;
	if(phrasesDisplay == "none" && attDisplay == "none"){
    	_$("#btns").style.display="none";
	}
	
	cmp('.cmp-switch')['switch']();
	
	//启动懒加载
    LazyUtil.startLazy();
    
  //添加缓存
    document.addEventListener('beforepageredirect', function(e){ 
    	pageX.content = document.querySelector("#edoc_deal_content").value;
        cmp.storage.save(edocDealCacheKey, cmp.toJSON(pageX), true);
    });
    initInStorage();
}); 

function initInStorage() {
    
    var cacheData = cmp.storage.get(edocDealCacheKey, true);
    if(cacheData){
    	var cacheObj = JSON.parse(cacheData);
    	document.querySelector("#edoc_deal_content").value =   cacheObj.content;
        cmp.storage["delete"](edocDealCacheKey, true);
    }
}

/**
 * 注册缓加载
 */
function _registLazy(){
  //注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "css" : [
                 _cmpPath + "/css/cmp-att.css" + $verstion,
                 _cmpPath + "/css/cmp-selectOrg.css" + $verstion,
                 _cmpPath + "/css/cmp-audio.css" + $verstion,
                 _cmpPath + "/css/cmp-listView.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-att.js" + $verstion,
                _cmpPath + "/js/cmp-flowV5.js" + $verstion,
                _cmpPath + "/js/cmp-audio.js" + $verstion,
                _cmpPath + "/js/cmp-push.js" + $verstion,
                _cmpPath + "/js/cmp-imgCache.js" + $verstion,
                _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                _cmpPath + "/js/cmp-listView.js" + $verstion,
                _cmpPath + "/js/cmp-emoji.js" + $verstion,
                _common_v5_path + "/widget/SeeyonAttachment.s3js" + $verstion,
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_att",
        "depend" : "lazy_cmp",
        "css" : [],
        "js" : [
                _common_v5_path + "/widget/SeeyonAttachment.s3js" + $verstion,
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_contentEdit",
        "depend" : "lazy_cmp",
        "css" : [],
        "js" : [
                _common_v5_path + "/widget/ContentEdit-debug.js" + $verstion,
                ]
    });
    
    //工作流
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "depend" : "lazy_cmp",
        "dependModel" : "strong",
        "css" : [
                 _wfPath + "/css/wf.css" + $verstion
                 ],
        "js" : [
                _wfPath + "/js/wf.js" + $verstion,
                _cmpPath + "/js/cmp-zoom.js" + $verstion
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_jssdk",
        "css" : [],
        "js" : [
                editContent_jssdk, doc_jssdk, commonPhrase_jssdk, workflow_jssdk, last_jssdk, collaboration_jssdk
        ]
    });
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
}

//常用语切换
function _SwitchActive(){
  var phrases_container = _$('#phrases_container');
  if(phrases_container.classList.contains('cmp-active')){
  	phrases_container.classList.remove('cmp-active');
  	cmp.backbutton.pop();
  }else{
  	cmp.backbutton.push(_SwitchActive);
  	phrases_container.classList.add('cmp-active');
  }
  
}

function fnFontCount() {
    var feedback = _$("#edoc_deal_content");
    var content = feedback.value;
    if (content.length > pageX.MAX_INPUT_LENGTH) {
        feedback.value = content.substr(0, pageX.MAX_INPUT_LENGTH);
        content = feedback.value;
    }
    // 剩余可以输入的字数
    _$("#edoc_deal_count").innerHTML = pageX.MAX_INPUT_LENGTH - content.length;
}

function setButtonState(subState){
	if(subState == '17' || subState == '15'){
		_$("#zcdb").style.display ='none';
		_$("#submit").style.display ='none';
	}else if(subState == '16'){
		
	}

}

//判断元素是否属于数组
function isInArray(arrs, obj) {
	if(arrs && arrs!="") {
		arr = arrs.split(',');
		var i = arr.length;
		while (i--) {
			if (arr[i] == obj) {
	          return true;
			}
		}	
	}
	return false;
}

function initi18n() {
    cmp.i18n.init(_edocPath+"/i18n/", "EdocResources", function() {
        document.getElementById('edoc_deal_content').setAttribute('placeholder',cmp.i18n("Edoc.action.advice"));
    },$verstion);
}

/**
 * 移动端添加事件
 * @param items
 */
function loadData(items){
	var pharseTPL = $("#edoc_pharse_tpl").html();
    var html = cmp.tpl(pharseTPL, items);
	var table = $("#phraseCmpTable").html();
	$("#phraseCmpTable").html(table+html);
	cmp.listView('#phraseWrapper');
	cmp.IMG.detect();
}

/**
 * 计算意见框输入文字
 */
function changeDealCount(focusFlag){
	var length =  2000 - $("#edoc_deal_content").val().length;
	if(length > 0){//如大于0，下方显示剩余可输入字符数
		$("#edoc_deal_count").text(length);
	}else{//小于0，禁止文本框继续输入内容
		$("#edoc_deal_count").text(cmp.i18n("Edoc.info.reachLimit"));
		$("#edoc_deal_count").css("color","red");
	}
	if(focusFlag === true){
        $("#edoc_deal_content").scrollTop($("#edoc_deal_content")[0].scrollHeight);
        $("#edoc_deal_content").focus();
    }
}

//初始化流程
function _initWfDesigner(){
    
    if(pageX.wfDesigner == null){
        
        var workflowParam = pageX.winParams["workflowParam"];
        pageX.wfDesigner = new WorkFlowDesigner({
        	    
            workflow : {
                moduleType : workflowParam["moduleType"],
                processId : workflowParam["processId"],
                caseId : workflowParam["caseId"],
                currentNodeId : workflowParam["currentNodeId"],
                subObjectId : workflowParam["subObjectId"]
            },
            info : {
                state : "edit_current",
                defaultPolicyId : workflowParam["defaultPolicyId"],
                defaultPolicyName : workflowParam["defaultPolicyName"],
                currentAccountId : workflowParam["currentAccountId"],
                currentAccountName : workflowParam["currentAccountName"],
                currentUserId : workflowParam["currentUserId"],
                currentUserName : workflowParam["currentUserName"],
                category : "edoc",//只能传edoc， 预提交会有特殊判断
                subCategory : pageX.edocTypeName,
                workItemId : workflowParam["subObjectId"],
                affairId : pageX.winParams["affairId"],
                summaryId : pageX.winParams["summaryId"],
                bodyType : workflowParam["bodyType"],
                activityId : workflowParam["currentNodeId"],
                formData : "-1",//只能传-1， 预提交会有特殊判断
                processTemplateId : "",
                submitStyleCfg: workflowParam["submitStyleCfg"],
                currentWorkItemIsInSpecial : !pageX.validationStepback1,
                beforDrawWf : function(jsonData){
                    if(jsonData && jsonData.nodes) {
                        for(var i=0; i< jsonData.nodes.length; i++) {
                            jsonData.nodes[i].isHasten = false;
                        }
                    }
                    return jsonData;
                },
                isProcessTemplate : pageX.winParams["isProcessTemplate"]
            },
            style : {
                zIndex : 11
            },
            getPermissions : function(callback){
                
                _queryEdocPolicy(function(){
                    callback(edocPolicyList);
                });
            }
        });
    }
}

/** 获取公文节点权限列表 **/
function _queryEdocPolicy(callback){
    
    if(edocPolicyList && edocPolicyList.length > 0){
        callback();
    }else{
        var workflowParam = pageX.winParams["workflowParam"];
        //获取节点权限
        $s.EdocResource.permissions({"type":pageX.edocTypeName,"policyName" : workflowParam["defaultPolicyId"],"orgAccountId" : pageX.winParams["flowPermAccout"]}, {
            success : function(ret){
                edocPolicyList = ret;
                callback();
            },
            error: function(err){
                EdocUtils.ajaxErrorHander(err);
                callback();
            }
        })
    }
    
}

//处理按钮
function dealButton(id){
	if(id == 'revoke' && cmp.href.getParam("from") == "revoke"){ //撤销 已发界面过来的，不显示附件、常用语
		_$("#attchmentFile").style.display = 'none';
		_$("#phrasesBtn").style.display = 'none';
	}else{
		if(!(pageX.disPosition=="report")) {
			showAttribute();
		}
		addEvent();
	}
}

function showAttribute(){
	var attribute = cmp.href.getParam("attribute");
	var nowNodeOpinion = cmp.href.getParam("nowNodeOpinion");
	if(nowNodeOpinion){
		$("#edoc_deal_content").val(nowNodeOpinion.content);
		changeDealCount();
	}
	if(attribute == 1){
		$("#read").show();
		$("#disagree").show();
		$("#agree").show();
		
		if(nowNodeOpinion && nowNodeOpinion.attribute == 3){
			$("#disagree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#read button").removeClass('cmp-active');
			$("#disagree button").addClass('cmp-active');
			_attribute = 3;
		}else if(nowNodeOpinion && nowNodeOpinion.attribute == 2){
			$("#agree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#read button").removeClass('cmp-active');
			$("#agree button").addClass('cmp-active');
			_attribute = 2;
		} else {
			$("#read").removeClass('cmp-btn-outlined').addClass('dispose_backcolor');
		}
		_$("#attribute").style.display = "";
		_$("#commonPhraseDiv").style.top = "46px";
	}else if(attribute == 2){
		$("#disagree").show();
		$("#agree").show();
		
		if(nowNodeOpinion && nowNodeOpinion.attribute == 3){
			$("#disagree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#disagree button").addClass('cmp-active');
			_attribute = 3;
		}else{
			$("#agree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#agree button").addClass('cmp-active');
			_attribute = 2;
		}
		
		_$("#attribute").style.display = "";
		_$("#commonPhraseDiv").style.top = "46px";
	}else if(nowNodeOpinion && attribute!=3){
		$("#disagree").show();
		$("#agree").show();
		if(nowNodeOpinion.attribute == 3){
			$("#disagree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#disagree button").addClass('cmp-active');
			_attribute = 3;
		}else if(nowNodeOpinion.attribute == 2){
			$("#agree").removeClass('cmp-btn-outlined').addClass("dispose_backcolor");
			$("#agree button").addClass('cmp-active');
			_attribute = 2;
		}
		_$("#attribute").style.display = "";
		_$("#commonPhraseDiv").style.top = "46px";
	}
	cmp('#attribute').on('tap','button',function(){
		$('#attribute button').addClass('cmp-btn-outlined ').removeClass('dispose_backcolor').removeClass('cmp-active');
		$(this).removeClass('cmp-btn-outlined').addClass('cmp-active');
		_attribute = $(this).val();//获取处理态度的值
	});
}
/****************************       页面初始化 end ****************************/


/****************************         添加事件 start ****************************/

function addEvent(){
	addMoreEvent();
	addZCDBEvent();
	addSubmitEvent();
	isTrackAddEventListener();
}

function addPhraseEvent(){
	cmp("#phraseCmpTable").on('tap', "a", function (e) {
		var content = this.innerHTML;
		var contentLength = $("#edoc_deal_content").val().length + content.length
		if(contentLength<=2000){
			$("#edoc_deal_content").val($("#edoc_deal_content").val()+content);
		}
		cmp("#phrasePopover").popover('toggle');
		changeDealCount(true);
	});
}

function transActionFun(actionName, _action) {
	cmp("body").on('tap', "#actionSubmit", function (e) {
		transAction(actionName, _action);
	});
}

function addMoreEvent(){
	
	var htmlCode = "";
	var topPopoverHight = 0;//计算操作按钮的高度
	if(isInArray(actions, "AddNode")) {//加签
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="AddNode" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.addAssign")+'</li>';
			topPopoverHight += 50;
		} 
	}
	if(isInArray(actions, "Infom")) {//知会
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="Infom" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.zhihui")+'</li>';
			topPopoverHight += 50;
		}
	}
	if(isInArray(actions, "PassRead")) {//传阅
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="PassRead" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.passRead")+'</li>';
			topPopoverHight += 50;
		}
	}
	if(isInArray(actions, "JointSign")) {//当前会签
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="JointSign" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.curCountersign")+'</li>';
			topPopoverHight += 50;
		}
	}
	if(isInArray(actions, "moreSign")) {//多级会签
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="moreSign" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.multistageSign")+'</li>';
			topPopoverHight += 50;
		}
	}
	if(isInArray(actions, "Transfer")) {//移交
		if(pageX.validationStepback && pageX.validationStepback1) {
			htmlCode += '<li data-code="transfer" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.transfer")+'</li>';
			topPopoverHight += 50;
		}
	}
	if(isInArray(actions, "SpecifiesReturn")) {//指定回退
		if(pageX.validationStepback && pageX.validationStepback2) {
			htmlCode += '<li data-code="SpecifiesReturn" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.action.specifiesReturn")+'</li>';
			topPopoverHight += 50;
		}
	}
	
	//处理的时候才有跟踪。
	if(isInArray(actions, "Track") && actionName == "submit") {
		if(pageX.validationStepback) {
			htmlCode += '<li data-code="track" class="cmp-table-view-cell edocPop">'+cmp.i18n("Edoc.info.track") +
					'</li><div id="edoc_deal_follow_opinion" class="cmp-switch " style="position:absolute;right:0;bottom:5px;"><span class="cmp-switch-handle"></span></div>';
			topPopoverHight += 50;
		}
	}
	
	if(htmlCode != "") {
		document.getElementById("switchs_ul").innerHTML = htmlCode;
		document.getElementById("topPopover").style.height = topPopoverHight+"px";
	} else {
		$("#more").hide();
	}
	
	
	cmp("#switchs_ul").on("click", ".cmp-table-view-cell", function(e){
		var topPop = _$("#topPopover");
		topPop.classList.remove("cmp-active");
	    topPop.style.display = "none";
	    _$(".cmp-backdrop").remove();
	    
	    var tCode = this.getAttribute("data-code");
	    
	    if(tCode == "AddNode"){//加签
	    	pageX.wfDesigner.addNode();
	    }else if(tCode == "Infom"){//只会
	    	pageX.wfDesigner.inform();
	    }else if(tCode == "PassRead"){//传阅
	    	pageX.wfDesigner.passRead();
	    }else if(tCode == "JointSign"){//当前会签
	        _queryEdocPolicy(function(){
	            
                var jointSignParam = {}
                
                if(edocPolicyList && edocPolicyList.length > 0){
                    
                    for(var k = 0; k < edocPolicyList.length; k++){
                        if(edocPolicyList[k].value == "huiqian"){
                            jointSignParam = {
                                    "policyId" : "huiqian",
                                    "policyName" : cmp.i18n("Edoc.page.lable.button.assign")
                                }
                            break;
                        }
                    }
                }
                
                pageX.wfDesigner.jointSign(jointSignParam);
            });
	    }else if(tCode == "moreSign"){//多级会签
	    	pageX.wfDesigner.multistageSign();
	    }else if(tCode == "transfer"){//移交
	    	actionTransferEdoc();
	    }else if(tCode == "SpecifiesReturn"){//指定回退
	    	_checkAffairValid(function(checkRet) {
	   		 if(checkRet) {
	   			pageX.wfDesigner.specifiesReturn(function(returnInfo){
		    		actionSpecifiesReturn(returnInfo.toNodeId, returnInfo.submitStyle);
		    	});
	   		 } else {
	   			 return;
	   		}
	   	});
	    }
	});
}

/**
 * 流程指定回退
 */
function actionSpecifiesReturn(theStepBackNodeId, submitStyle) {
	//重复提交校验
	if(pageX.isSubmitting){
		console.warn("重复执行:指定回退操作");
		return;
	}
    _startSubmitting();
    //执行流程指定回退操作
    function exeSpecifiesReturnSubmit(){
        if(theStepBackNodeId && submitStyle){
        	//1 组装提交参数
        	if($("#attribute").css("display")=="none"){
        		_attribute = -1;
        	}
        	var contentParam = {"opinionContent":converEmoji($("#edoc_deal_content").val()), "opinionAttibute":_attribute};
        	var urlParam = cmp.href.getParam();
        	var param = $.extend({}, urlParam, contentParam);
        	//附件json字符串
			
        	param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
        	_addWorflowData(param);

        	param["submitStyle"] = submitStyle;
        	param["theStepBackNodeId"] = theStepBackNodeId;
        	
            saveContentConfirm(function(){
            	$s.EdocResource.specifiesReturn({}, param, {
        			success : function(result) {
        				if(result && result.returnValue == "true") {
        					_stopSubmitting();
        					_gotoList();
        				} else {
        					if(result && result.errMsg != ""){
        						_alert(result.errMsg);
        					}else{
        						_alert(cmp.i18n("Edoc.alert.submissionFailed"));
        					}
        					_stopSubmitting();
        				    WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.SPECIFIES_RETURN);
        				}
        			},
        			error : function(err){
        				_stopSubmitting();
        				EdocUtils.ajaxErrorHander(err);
        				 WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.SPECIFIES_RETURN);
        			}
        		});
			});
			
        }else{
            _stopSubmitting();
            WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.SPECIFIES_RETURN);
        }
    }
    
    /*'该操作不能恢复，是否进行指定回退操作？*/
    var _cofirmTranferHtml  = cmp.i18n("Edoc.page.notrollback.confirm.label");
        
    cmp.notification.confirm(_cofirmTranferHtml,function(e){ //e==1是/e==0 否
        if(e==1){ //是
            setTimeout(exeSpecifiesReturnSubmit, 50);
        }else{
            _stopSubmitting();
            WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.SPECIFIES_RETURN);
        }
    },null, [ cmp.i18n("Edoc.dialog.cancle"), cmp.i18n("Edoc.page.dialog.OK") ],null,null,0);
}

/**
 * 意见框输入文字监听
 */
function contentAddEventListener(){
	//文本框限制只能输入2000个字符
	document.getElementById("edoc_deal_content").addEventListener("input",function(){
		changeDealCount();
	});
}

function isTrackAddEventListener(){
	//判断是否设置跟踪
	if(document.querySelector("#edoc_deal_follow_opinion")){
		document.getElementById("edoc_deal_follow_opinion").addEventListener("toggle",function(event){
			if(event.detail.isActive){
				  _isTrackType = "1";
			}else{
				_isTrackType = "0";
			}
		});
	}
} 
/****************************          添加事件 end ****************************/


/**************************** 公文提交等操作 start ****************************/

/** 按钮事件：提交 */
function addSubmitEvent() {
	_$("#submit").addEventListener("tap", fn_submit);
}

function fn_submit(){
	//意见不同意的时候，弹出回退等操作列表
	if (_attribute == "3") {
		var isdealStepBackShow= false;
		var isdealStepStopShow= false;
		var isdealCancelShow= false;
		
		var items = [];
		
		var actions = cmp.href.getParam("actions");
		//继续
		if (actions) {
			items.push({key:"Continue",name:cmp.i18n("Edoc.lable.button.continue")});
		}
		
		if (actions && isInArray(actions, "Return")) {
			if(pageX.validationStepback && pageX.validationStepback1 && pageX.validationStepback2) {
				isdealStepBackShow = true;
				items.push({key:"Return",name:cmp.i18n("Edoc.action.fallback")});
			}
		}
		
		//终止
		if (actions && isInArray(actions, "Terminate")) {
			isdealStepStopShow = true;
			items.push({key:"Terminate",name:cmp.i18n("Edoc.action.terminate")});
		}
		//撤销
		if (actions && isInArray(actions, "Cancel")) {
			isdealCancelShow = true;
			items.push({key:"Cancel",name:cmp.i18n("Edoc.action.revoke")});
		}
		//节点权限没有回退、撤销、终止,系统不会弹出确认框，直接可以提交成功
		if (isdealStepBackShow||isdealStepStopShow||isdealCancelShow) {
			//弹出不同意操作按钮列表
			cmp.dialog.actionSheet(items, cmp.i18n("Edoc.dialog.cancle"),function (data){
				if (data.key == "Continue") {
					submit();
				} else {
					cmp.notification.confirm(cmp.i18n("Edoc.alert."+data.key), function(e) {
						if (e == 1) {
							if (data.key == "Return") { //回退
								transAction("fallback", WorkFlowLock.STEP_BACK);
							} else if (data.key == "Terminate") { //终止
								transAction("terminate", WorkFlowLock.STEP_STOP);
							} else if (data.key == "Cancel") { //撤销
								transAction("revoke", WorkFlowLock.REPEAL_ITEM);
							}
						} else {
							return;
						}
					}, cmp.i18n("Edoc.page.dialog.note"), [cmp.i18n("Edoc.page.lable.no"), cmp.i18n("Edoc.page.lable.yes")],null,null,0);	        			
				}
			});
		} else {
			submit();
		}
	} else {
		submit();
	}
}

/** 提交到后台方法 */
function submit() {
	//pageX.isSubmitting = cmp.storage.get("m3_v5_edoc_summary_submit_", true) || pageX.isSubmitting;
    if(pageX.isSubmitting){
        return;
    }
    
	//1 开启进度条
	_startSubmitting();
	
	//2 意见为空校验
	var opinionPolicy = cmp.href.getParam("opinionPolicy");
	if(!_checkCommentIsNullByPolicy(WorkFlowLock.SUBMIT)) {
		_stopSubmitting();
		_alert(cmp.i18n("Edoc.alert.requiredComments"));
		return;
	}
	
	//3 校验公文单元素
	if(!_checkFiledIsNull()) {
		_stopSubmitting();
		_alert(cmp.i18n("Edoc.alert.element.required"));
		return;
	}

	//4 公文处理状态校验
	_checkAffairValid(function(checkRet) {
		if(checkRet) {
					
			//5 校验公文文号
			_checkEdocMarkIsUsed(function(cRet) {
				if(cRet) {
					
					//6预提交
		        	pageX.wfDesigner.preSubmit({
		                contentData : [],
		                onPop : function() {
		                    //组件层级管理，需要把这个影藏
		                    //cmp.dialog.loading(false);
		                	_stopSubmitting();
		                },
		                callback : function(preSubmitResult) {
		                    if(preSubmitResult["result"] == "true") {
		                    	
		                    	//8 组装提交参数
		                    	var isLastConfirm = false;
		                    	var _wLastInput = document.querySelector('#workflow_last_input');
		                    	if(_wLastInput.value == "true" && pageX.winParams.moduleType == "19") {
		                    		cmp.notification.confirm(cmp.i18n("Edoc.deal.finish.note"), function(e) {
		                    			if (e == 1) {//是
		                    				submitLast();
		                    			} else {
		                    				_stopSubmitting();
		                    			}
		                    		}, cmp.i18n("Edoc.page.dialog.note"), [cmp.i18n("Edoc.page.lable.no"), cmp.i18n("Edoc.page.lable.yes")],null,null,1);
		                    	} else {
		                    		if(pageX.isFlowBack!="" && pageX.optionType=="4") {
                    					selectRetainOpinionWay(submitLast);
                    				} else {
                    					submitLast();
                    				}
		                    	}
		            			
		                    } else {
		                        _stopSubmitting();
		                    }
		                }
		            });
		        } else {
		        	_stopSubmitting();
		        	_gotoList();
		        }
		    });
		} else {
			_stopSubmitting();
		}
	});
}

function selectRetainOpinionWay(callback) {
	_stopSubmitting();
	var items = [];
	items.push({key:"lastOpinionWay", name:cmp.i18n("Edoc.opinion.saveLast")});
	items.push({key:"allOpinionWay", name:cmp.i18n("Edoc.opinion.saveAll")});
	//弹出不同意操作按钮列表
	cmp.dialog.actionSheet(items, cmp.i18n("Edoc.page.lable.no"),function (data){
		if (data.key == "lastOpinionWay") {
			callback("4_1");
		} else if (data.key == "allOpinionWay") {
			callback("4_2");
		} else {
			return;	        			
		}
	});
}

function submitLast(optionWay) {
	optionWay = !optionWay ? "" : optionWay;
	if(oldTrackValue == 2 && _isTrackType==1){
		_isTrackType = 2;
	}
	if($("#attribute").css("display")=="none"){
		_attribute = -1;
	}
	var edoc_deal_content = converEmoji($("#edoc_deal_content").val());
	var contentParam = {"opinionContent":edoc_deal_content,"opinionAttibute":_attribute,"isTrack":_isTrackType, "optionWay":optionWay};
	var urlParam = cmp.href.getParam();
	var param = cmp.extend({}, urlParam, contentParam);
    param = _addWorflowData(param);//添加流程数据
    //附件json字符串
    param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
    //暂存意见id
    if(cmp.href.getParam("nowNodeOpinion") && cmp.href.getParam("nowNodeOpinion").id){
    	param.oldOpinionIdStr = cmp.href.getParam("nowNodeOpinion").id;
    }
    param.disPosition = pageX.disPosition;
    //8提交
	try {
		saveContentConfirm(function(){
			$s.EdocResource.submit({}, param, {
				success : function(result) {
					if(result) {
						//9关闭进度条
						_stopSubmitting();
						//10跳转到公文列表页面
						_gotoList();
					} else {
						_alert(cmp.i18n("Edoc.alert.submissionFailed"));
						_stopSubmitting();
					}
				},
				error : function(err) {
					_stopSubmitting();
		            EdocUtils.ajaxErrorHander(err);
				}
			});
		});
	} catch(e) {
		_alert(e.message);
        _stopSubmitting();
	}
}

/** 回退、终止、撤销到后台方法 */
function transAction(actionName, action) {
	//重复提交校验
	if(pageX.isSubmitting){
		console.warn("重复执行:" + actionName);
		return;
	}
	
	//1 开启进度条
	_startSubmitting();
	
	//2 意见为空校验
	if(!_checkCommentIsNullByPolicy(action)) {
		_stopSubmitting();
		_alert(cmp.i18n("Edoc.alert.requiredComments"));
		return;
	}
	
	//3 撤销意见不能为空
	if (actionName == "revoke" && pageX.winParams && pageX.winParams.openFrom =="listSent") {
		if(!_checkCommentIsEmpty()) {
	        return;
	    }
	}
	
	//4 公文处理状态校验
	_checkAffairValid(function(checkRet) {
		if(checkRet) {
			
			//5 流程加锁
			WorkFlowDesignerUtil.lockH5Workflow(pageX.processId, action, function(ret) {
				if(ret) {
				
					//6 回退/撤销/终止
					try {
						if (actionName == "fallback") { //回退
							addStepbackEvent();
						} else if (actionName == "revoke") { //撤销
							addCancelEvent();
						} else if (actionName == "terminate") { //终止
							addStepstopEvent();
						}
					} catch(exception) {
						_alert(exception.message);
						_stopSubmitting();
					}
					
				} else {
					_stopSubmitting();
				}
			});
		} else {
			_stopSubmitting();
			_gotoList();
		}
	});
}

/** 按钮事件：暂存待办 */
function addZCDBEvent() {
	cmp("body").on('tap', "#zcdb", function (e) {
		_checkAffairValid(function(checkRet) {
	        if(checkRet) {
	        	//重复提交校验
	        	if(pageX.isSubmitting){
	        		console.warn("重复执行:" + actionName);
	        		return;
	        	}
	        	
	        	//开启进度条
	        	_startSubmitting();
	        	//组装form参数
	    		var edoc_deal_content = converEmoji($("#edoc_deal_content").val());
	    		var urlParam = cmp.href.getParam();
	    		if(oldTrackValue == 2 && _isTrackType==1){
	    			_isTrackType = 2;
	    		}
	    		var contentParam = {"opinionContent":edoc_deal_content,
	    		                    "opinionAttibute":_attribute,
	    		                    "isTrack":_isTrackType};
	    		
	    		var param = $.extend({}, urlParam,contentParam);
	    		//添加流程数据
	    		param = _addWorflowData(param);
		        //附件json字符串
                param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
		        //暂存意见id
                if(cmp.href.getParam("nowNodeOpinion") && cmp.href.getParam("nowNodeOpinion").id){
                	param.oldOpinionIdStr = cmp.href.getParam("nowNodeOpinion").id;
                }
				try {
					saveContentConfirm(function(){
						//暂存待办
						$s.EdocResource.zcdb({}, param, {
							success : function(result) {
								//关闭进度条
								_stopSubmitting();
								if(result) {
									_gotoList(false);
								}else{
									_alert(cmp.i18n("Edoc.alert.submissionFailed"));
								}
							},error:function(err) {
								_stopSubmitting();
								EdocUtils.ajaxErrorHander(err);
							}
						});
					});
				} catch(e) {
					_alert(e.message);
                    _stopSubmitting();
				}
	        } else {
	        	_stopSubmitting();
	        	_gotoList();
	        }
	    });
	})
}

/** 按钮事件：回退 */
function addStepbackEvent() {
	//1 组装提交参数
	if($("#attribute").css("display")=="none"){
		_attribute = -1;
	}
	var contentParam = {"opinionContent":converEmoji($("#edoc_deal_content").val()), "opinionAttibute":_attribute};
	var urlParam = cmp.href.getParam();
	var param = $.extend({}, urlParam, contentParam);
	//附件json字符串
	param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
	
	saveContentConfirm(function(){
		//2 回退
		$s.EdocResource.stepback({}, param, {
			success : function(result) {
				if(result && result.returnValue == "true") {
					_stopSubmitting();
					_gotoList();
				} else {
					if(result && result.errMsg != ""){
						_alert(result.errMsg);
					}else{
						_alert(cmp.i18n("Edoc.alert.submissionFailed"));
					}
					_stopSubmitting();
				}
			},
			error : function(err){
				_stopSubmitting();
				EdocUtils.ajaxErrorHander(err);
			}
		});
	});
    
}

/** 按钮事件：撤销 */
function addCancelEvent() {
	//1 组装提交参数
	if($("#attribute").css("display")=="none"){
		_attribute = -1;
	}
	var contentParam = {"opinionContent":converEmoji($("#edoc_deal_content").val()), "opinionAttibute":_attribute};
	var urlParam = cmp.href.getParam();
	var param = $.extend({}, urlParam, contentParam);
	//附件json字符串
	param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
	saveContentConfirm(function(){
		//2 撤销
		$s.EdocResource.cancel({}, param, {
			success : function(result) {
				if(result && result.returnValue == "true") {
					_stopSubmitting();
					_gotoList();
				} else {
					if(result && result.errMsg && result.errMsg != ""){
						_alert(result.errMsg);
					}else{
						_alert(cmp.i18n("Edoc.alert.submissionFailed"));
					}
					_stopSubmitting();
				}
			}, 
			error : function(err) {
				_stopSubmitting();
				EdocUtils.ajaxErrorHander(err);
			}
		});
	});
    
}

/** 按钮事件：终止 */
function addStepstopEvent() {
	//1 组装提交参数
	var contentParam = {"opinionContent":converEmoji($("#edoc_deal_content").val())};
	var urlParam = cmp.href.getParam();
	var param = $.extend({}, urlParam,contentParam);
	//附件json字符串
	param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
	
	saveContentConfirm(function(){
		//2 终止
		$s.EdocResource.stepStop({}, param, {
			success : function(result) {
				if(result) {
					_stopSubmitting();
					_gotoList();
				} else {
					_alert(cmp.i18n("Edoc.alert.submissionFailed"));
					_stopSubmitting();
				}
			},
			error : function(err) {
				_stopSubmitting();
				EdocUtils.ajaxErrorHander(err);
			}
		});
	});
}

/***************************** 公文提交等操作 end ****************************/


/*****************************  公文校验方法 start ****************************/

/** 检查意见是否允许为空 使用场景：已发中撤销 */
function _checkCommentIsEmpty() {    
    var tempContent = converEmoji(_$("#edoc_deal_content").value);
    var isCommentBlank = (tempContent == 0);
    if(isCommentBlank) {
        //{0}内容不能为空
        _alert(cmp.i18n(("Edoc.action.alert.comment_null"), [pageX.winParams["title"]]), function(){
        	_stopSubmitting();
        });
        return false;
    }
    return true;
}

/** 检查意见是否允许为空 使用场景：待办中提交、回退、撤销 */
function _checkCommentIsNullByPolicy(action) {
	var ret = true;
	var edoc_deal_content = converEmoji($("#edoc_deal_content").val());
	if(edoc_deal_content=="") {
		if(opinionPolicy == "1" && action == WorkFlowLock.SUBMIT) {//提交
			ret = false;
		} else if(cancelOpinionPolicy=="1" && action != WorkFlowLock.SUBMIT) {//非提交
			ret = false;
		} else if(disAgreeOpinionPolicy=="1" && _attribute==3) {
			ret = false;
		}
	}
	
	return ret;
}

/** 检查公文单元素是否为空 */
function _checkFiledIsNull() {
	var urlParam = cmp.href.getParam();
	if(urlParam['filedsIsNull']) {
		return false;
	}
	return true;
}
var affairValid = true;
//检查affair状态是否正常
function _checkAffairValid(callback) {
	$s.EdocResource.checkAffairValid({affairId : pageX.winParams["affairId"],"pageNodePolicy":pageX.winParams["nodePolicy"]}, {
        success: function(result) {
            if(result["error_msg"]) {
            	affairValid = false;
                _alert(result["error_msg"], function() {
                	callback(false);
                });//提示
            } else {
            	callback(true);
            }
        },
        error : function(err){
        	_stopSubmitting();
        	EdocUtils.ajaxErrorHander(err);
        }
    });
}

function _checkEdocMarkIsUsed(callback) {
    if(isInArray(actions, "EdocExchangeType")) {
    	if(pageX.winParams["docMark"]) {
    		if(pageX.winParams["docMark"]=="") {
        		_alert(cmp.i18n("Edoc.docMark.isNull"));
        		callback(false);
        	} else {
        		var param = {
        			summaryId : pageX.winParams["summaryId"] ,
        			docMark : pageX.winParams["docMark"],
        			orgAccountId : pageX.winParams["orgAccountId"]
        		};
    			$s.EdocResource.checkEdocMarkIsUsed(param, {
    		        success: function(result) {
    		            if(result && result==true) {
    		            	_alert(cmp.i18n("Edoc.docMark.isUsed"), function() {
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
    	} else {
    		callback(true);
    	}
    } else {
    	callback(true);
    }
}

/*****************************   公文校验方法 end ****************************/


/***************************** 	  工具方法 start ****************************/

/** 返回按钮 */
function _goBack() {
	WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, pageX.action);	
	cmp.href.back(1,{data:{"backFrom":"edocDeal"}});//加个参数回去清除签批数据缓存
}

/** 跳转到公文列表页面 */
function _gotoList(refreshM3) {
    
	//触发平台事件，用于刷新列表数据
    cmp.webViewListener.fire({
        type: "com.seeyon.m3.ListRefresh",
        data: {type: 'update'}
    });
    cmp.webViewListener.fire({
        type: 'edoc.ListRefresh'
    });
    
	//微协同的返回
	var bURL = EdocUtils.getBackURL();
    if(bURL == "weixin") {
    	//返回到外层
        cmp.href.closePage();
    } else {
        if(refreshM3 !== false){
            //触发刷新壳数据
            cmp.webViewListener.fire({ 
                type: 'com.seeyon.m3.ListRefresh', 
                data: {affairid: pageX.winParams["affairId"]} 
            })
        }
		cmp.href.back(2);	
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
    //pageX.isSubmitting = cmp.storage.get("m3_v5_edoc_summary_submit_", true) || pageX.isSubmitting;
    if(pageX.isSubmitting){
		return;
	}
	//$("#loading").show();
    pageX.isSubmitting = true;
    cmp.storage.save("m3_v5_edoc_summary_submit_", pageX.isSubmitting, true);
}

//结束提交
function _stopSubmitting(fromParam){
    cmp.dialog.loading(false);
	//$("#loading").hide();
    pageX.isSubmitting = false;
    cmp.storage["delete"]("m3_v5_edoc_summary_submit_", true);//干掉缓存
    if(!fromParam) {
    	fromParam = "dealSummary";
    }
	pageX.winParams["from"] = fromParam;
	if(!affairValid){
		cmp.href.next(_edocPath + "/html/edocList.html?r="+Math.random());
	}
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
	return urlParam = cmp.href.getParam();
}

/**
 * 添加流程相关数据
 * @param param
 * @returns
 */
function _addWorflowData(param) {
	//删除无用的参数
    delete param["opinionPolicy"];
    delete param["attribute"];
    delete param["nowNodeOpinion"];
    delete param["actions"];
    delete param["filedsIsNull"];
    delete param["actionName"];
    delete param["workflowParam"];
    
    if(pageX.wfDesigner){
        //流程相关参数
        param = cmp.extend(param, pageX.wfDesigner.getDatas());
    }
    return param;
}

//简化选择器
function _$(selector) {
    return document.querySelector(selector)
}
/**
 * 移交
 */
function actionTransferEdoc(){
	_lockTransferAction(function(lockRet){
        if(lockRet){
            //选人界面调用
            cmp.selectOrg("select_org_1_" + (new Date()).getTime(), {
                "type":2,
                "flowType" : 2,
                "label" : ["dept","org"],
                "directDepartment" : false,
                "flowOptsChange" : true,
                lightOptsChange : false,//轻表单模式选人
                fillBackData:[],//初始化数据
                jump:false,
                excludeData:[{"id": pageX.winParams.workflowParam["currentUserId"],"name":pageX.winParams.workflowParam["currentUserName"],"type":"Member","disable":true}],
                closeCallback: function(){
                    _stopSubmitting();
                    WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
                },
                maxSize:1,
                minSize:1,
                accountID:"",
                selectType:'member',
                permission : true,
                callback: function(datas){
                    var result = cmp.parseJSON(datas);
                    var type = result.orgResultType;
                    
                    var orgMembers, userId;
                    
                    if(orgMembers = result.orgResult){
                        for(var i = 0, len = orgMembers.length; i < len; i++){
                            //返回数据是字符串
                            var d = null;
                            if(typeof orgMembers[i] === "string"){
                                d = cmp.parseJSON(orgMembers[i]);
                            }else{
                                d = orgMembers[i];
                            }
                            userId = d.id;
                        }
                    }
                    _exeTransfer(userId);
                }
            });
        }
    });
}

/**
 * 执行移交
 * @param id 人员ID
 */
function _exeTransfer(userId){
	//重复提交校验
	if(pageX.isSubmitting){
		console.warn("重复执行:" + actionName);
		return;
	}
    _startSubmitting();
    function exeTransferSubmit(){
        if(userId){
        	//1 组装提交参数
        	if($("#attribute").css("display")=="none"){
        		_attribute = -1;
        	}
        	var contentParam = {"opinionContent":converEmoji($("#edoc_deal_content").val()), "opinionAttibute":_attribute};
        	var urlParam = cmp.href.getParam();
        	var param = $.extend({}, urlParam, contentParam);
        	//附件json字符串
        	param.fileJson = cmp.toJSON(pageX.fileComponent.getFileArray());
        	var urlParam = cmp.href.getParam();
            param.transferMemberId = userId;
            saveContentConfirm(function(){
            	$s.EdocResource.transfer({}, param, {
        			success : function(result) {
        				if(result && result.returnValue == "true") {
        					_stopSubmitting();
        					_gotoList();
        				} else {
        					if(result && result.errMsg != ""){
        						_alert(result.errMsg);
        					}else{
        						_alert(cmp.i18n("Edoc.alert.submissionFailed"));
        					}
        					_stopSubmitting();
        				    WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
        				}
        			},
        			error : function(err){
        				_stopSubmitting();
        				EdocUtils.ajaxErrorHander(err);
        				 WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
        			}
        		});
			});
			
        }else{
            _stopSubmitting();
            WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
        }
    }
    
    /*'该操作不能恢复，是否进行移交操作？*/
    var _cofirmTranferHtml  = cmp.i18n("Edoc.alert.confirm.transfer");
        
    cmp.notification.confirm(_cofirmTranferHtml,function(e){ //e==1是/e==0 否
        if(e==1){ //是
            setTimeout(exeTransferSubmit, 50);
        }else{
            _stopSubmitting();
            WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
        }
    },null, [ cmp.i18n("Edoc.dialog.cancle"), cmp.i18n("Edoc.page.dialog.OK") ],null,null,0);
    
}
/**
 * 公文移交加锁
 */
function _lockTransferAction(callback){
        WorkFlowDesignerUtil.lockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER, function(ret) {
            if(ret) {
                callback(true);
            }else{
            	WorkFlowDesignerUtil.unLockH5Workflow(pageX.processId, WorkFlowLock.TRANSFER);
                callback(false);
                _stopSubmitting();
            }
        });
    
}
/**
 * 修改正文提示
 */
function saveContentConfirm(saveCallback){
	var editFlag = pageX.winParams.editParam? pageX.winParams.editParam.hasEditContent : false;
    window.editParam = pageX.winParams.editParam;
    cmp.storage["delete"]("m3_v5_edoc_summary_BO_", true);//干掉缓存
    cmp.storage["delete"]("v5_m3_edoc_summaryBO", true);
	if(editFlag){
		ContentEdit.uploadToServer(function(){
			saveCallback();
		});
	}else{
		saveCallback();
	}
}

function converEmoji(srcVal){
    var emojiUtil = cmp.Emoji();
    return emojiUtil.EmojiToString(srcVal);
}

/***************************** 	   工具方法 end ****************************/