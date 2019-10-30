/**
 * 协同H5处理js
 * @author xuqw
 * @since V5-A8 6.1
 */

/**
 * 初始化处理页面
 */
function __initDeal__(callback){
    
    if (!summaryBO["summary"].finished){
        //指定回退中间节点
        if(summaryBO["summary"].affairState == 3 
            && summaryBO["summary"].affairSubState == 17 ) {
        
            summaryBO.pageConfig.canDeal = false;
        }
    }else {
        //流程结束，非知会打开
        if(!(summaryBO["currentPolicy"].id  == 'inform' 
            && summaryBO["summary"].listType == 'listPending')){
            summaryBO.pageConfig.canDeal = false;
        }
    }
    
    //加锁处理
    _lockForm(function(lockRet){
        _initDealDom(lockRet);
        callback && callback();
    });
    
  //添加缓存
    document.addEventListener('beforepageredirect', function(e){ 
        if(!pageX.isMoreComment){
            window.summaryBO.signatureId = window.signatureId;
            window.summaryBO.isLightForm = pageX.cache.isLightForm;
        }
        cmp.storage.save(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, cmp.toJSON(window.summaryBO), true);
    });
    
    document.addEventListener('deletesessioncache', function(e){
        //批量删除这类的全部数据
        CollCacheKey.delCacheKeys(CollCacheKey.summary, pageX.winParams.cache_subfix);
    });
}


/**
 * 表单加锁
 */
function _lockForm(callback){
    
    if(typeof summaryBO.formIsLock == "undefined"){
        
      //目前不支持新闻审批、公告审批。所以可以不加锁
        if (summaryBO["summary"].bodyType == '20' 
                && summaryBO.pageConfig.canDeal) {
            
            lockCollForm(function(ret) {
                
                //增加属性，表明表单锁
                summaryBO.formIsLock = !ret;
                callback && callback(ret);
            });
        }else{
            summaryBO.formIsLock = false;
            callback && callback(true);
        }
    }else{
        if(summaryBO.formIsLock && summaryBO.formLockMsg){
            _alert(summaryBO.formLockMsg);
            delete summaryBO.formLockMsg;//清空消息
        }
        callback && callback(!summaryBO.formIsLock);
    }
}

//协同表单上锁
function lockCollForm(callback) {
    var collObj = {
            "formAppId" : summaryBO["summary"].formAppId,
            "formRecordId" : summaryBO["summary"].formRecordId,
            "rightId" : summaryBO["summary"].rightId,
            "affairId" : summaryBO["summary"].affairId,
            "affairState" : summaryBO["summary"].affairState,
            "nodePolicy" : summaryBO["summary"].nodePolicy,
            "affairReadOnly" : summaryBO["summary"].affairReadOnly
        };
    
    $s.Coll.lockCollForm({}, collObj, errorBuilder({
        success : function(result) {
            var ret = true;
            if(result && result.canSubmit=="0") {
                _alert(cmp.i18n("collaboration.common.flag.editingForm", [result.loginName, result.from]));
                ret = false;
            }
            callback(ret);
        }
    }));
}

/**
 * 处理按钮相关DOM操作
 */
function _initDealDom(lockRet){
    
    if(summaryBO["summary"].listType != "onlyView" && !summaryBO["isHistory"]) {
        var ps = summaryBO.pageConfig.nodeActions;
        
        if(!summaryBO["summary"].finished) {
            if(!lockRet){
                if(CollUtils.isInArray(ps, "Forward")){
                    _showDealBtns(summaryBO.pageConfig.canDeal && summaryBO.formIsLock !== true, ["Forward"]);
                }
            }else{
                _showDealBtns(summaryBO.pageConfig.canDeal && summaryBO.formIsLock !== true, ps);
            }
        } else {
            var isInfoDeal = false;
            if(!(summaryBO["currentPolicy"].id  == 'inform' && summaryBO["summary"].listType == 'listPending')){
                summaryBO.pageConfig.canDeal = false;
            }else{
                //知会的时候
                if(summaryBO["summary"].affairState == 3){
                    isInfoDeal = true;
                }
            }

            if(CollUtils.isInArray(ps, "Forward") || isInfoDeal){
                _showDealBtns(summaryBO.pageConfig.canDeal && summaryBO.formIsLock !== true, ["Forward"]);
            }
        }
    }else{
        //把所有按钮干掉
        _$("#footer_btns").remove();
    }
    
    //轮循加锁机制
    if (summaryBO.pageConfig.canDeal && summaryBO.formIsLock !== true) {
        pageX.lockFormInt = setInterval("updateLockTime()", 180*1000);
    }
    
    _initDetailWfDesigner();
   
}

/**
 * 初始化流程编辑
 */
function _initDetailWfDesigner(){
    LazyUtil.addLoadedFn("lazy_wf", function(){
        _initWfDesigner(null, {
            model : "silent",//采用静默模式
            useTemplateId : true,
            onTriggerEdit : function(){
                var c = _$("#workflow_dot");
                if(c && c.classList.contains("display_none"))
                    c.classList.remove("display_none");
                
                pageX.editWorkflow = true;
            }
        });
    });
}

/**
 * 更新锁时间
 */
function updateLockTime(){

    
    var formRecordId ="";
    if(summaryBO["summary"].bodyType == '20' && summaryBO.pageConfig.canDeal){
        formRecordId = summaryBO["summary"].formRecordId;
    }
    processId = summaryBO["summary"].processId;
    
    $s.Coll.updateLockTime({"formRecordId":formRecordId,"processId":processId},errorBuilder({
        error : function(){
            clearInterval(pageX.lockFormInt);
        },
        exeSelfError : true
    }));
    
}

//处理协同
function _dealSummary(){
    
    //表单校验判断
    if(!pageX.isMoreComment && summaryBO["summary"].bodyType == "20"){
        if(cmp.sui.isPreventSubmit()){
            //表单失去焦点校验失败,阻止跳转
            return;
        }
    }
    if(_summaryRepeatClk){
        return;
    }
    _summaryRepeatClk = true;
    var pageParams = {
        "cache_subfix" : pageX.winParams.cache_subfix,
        "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
        "action" : CopyWorkFlowLock.SUBMIT//提交操作
    }
    summaryBO.backIndex = summaryBO.backIndex + 1;
    _cacheSignet(false);
    cmp.event.trigger("beforepageredirect", document);
    cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, pageParams, {openWebview : true});
}

//回退
function _returnSummary() {
    //协同流程回退加锁
    var _sbCall = function(){
        WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.STEP_BACK, function(ret) {
            if(ret) {
                
                var nextPageData = {
                        "cache_subfix" : pageX.winParams.cache_subfix,
                        "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                        "title" : cmp.i18n("collaboration.page.lable.button.return"),//回退
                        "placeholder" : cmp.i18n("collaboration.page.info.whencancel", [cmp.i18n("collaboration.page.lable.button.return")]),//回退流程不可恢复，若确认回退流程，请在这里输入回退附言。
                        "action" : CopyWorkFlowLock.STEP_BACK
                }
                summaryBO.backIndex = summaryBO.backIndex + 1;
                cmp.event.trigger("beforepageredirect", document);
                cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, nextPageData, {openWebview : true});
            }
        });
    }
    var params = {"affairId":summaryBO["summary"].affairId};
    $s.Coll.transStepBackValid({},params, errorBuilder({
        success : function(result) {
            if(result["error_msg"]){
                _alert(result["error_msg"]);
                return;
            }else {
                _sbCall();
            }
        }
    }));
    
}

//处理人撤销
function _repealSummary(){
    //协同流程撤销加锁
    var repelaCall = function(){
        WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.REPEAL_ITEM, function(ret) {
            if(ret) {

                var nextPageData = {
                    "action" : CopyWorkFlowLock.REPEAL_ITEM,
                    "cache_subfix" : pageX.winParams.cache_subfix,
                    "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                    "title" : cmp.i18n("collaboration.page.lable.button.cancel1"),//撤销
                    "placeholder" : cmp.i18n("collaboration.page.info.whencancel", [cmp.i18n("collaboration.page.lable.button.cancel1")])//撤销流程不可恢复, 若确认撤销流程, 请在这里输入撤销附言。
                }
                summaryBO.backIndex = summaryBO.backIndex + 1;
                cmp.event.trigger("beforepageredirect", document);
                cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, nextPageData, {openWebview : true});
            }
        });
    }
    var params = {"summaryId":summaryBO["summary"].id,"affairId":summaryBO["summary"].affairId};
     // 撤销协同
    $s.Coll.transRepalValid({},params,errorBuilder({
      success : function(result) {
          if(result.error_msg || result["error_msg"]){
              _alert(result.error_msg || result["error_msg"],null,"");
              return;
          }else {
            repelaCall();
          }
      }
    }));
}

//指定回退
function _specifiesReturn(){
    
    pageX.wfDesigner.specifiesReturn(function(returnInfo, submitStyleName){
        
        var pageParams = {
                "cache_subfix" : pageX.winParams.cache_subfix,
                "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                "action" : CopyWorkFlowLock.SPECIFIES_RETURN,//提交操作
                "title" : submitStyleName,//回退
                "placeholder" : cmp.i18n("collaboration.page.info.whencancel", [cmp.i18n("collaboration.page.lable.button.return")]),//回退流程不可恢复，若确认回退流程，请在这里输入回退附言。
                "returnInfo" : returnInfo
            }
        summaryBO.backIndex = summaryBO.backIndex + 1;
        cmp.event.trigger("beforepageredirect", document);
        cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, pageParams, {openWebview : true});
    });
}


//终止
function _terminateSummary() {
    //协同流程终止加锁
    WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.STEP_STOP, function(ret) {
        if(ret) {
            _formLoadCheck({
                checkCallback : function(ret){
                    if(ret == true){
                         if(_summaryRepeatClk){
        					  return;
    					 }
    					_summaryRepeatClk = true;
                        var nextPageData = {
                            "action" : CopyWorkFlowLock.STEP_STOP,
                            "cache_subfix" : pageX.winParams.cache_subfix,
                            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                            "title" : cmp.i18n("collaboration.page.lable.button.terminate"),//终止
                            "placeholder" : cmp.i18n("collaboration.page.info.whencancel",[cmp.i18n("collaboration.page.lable.button.terminate")])//终止流程不可恢复，若确认回退流程，请在这里输入终止附言。
                        }
                        summaryBO.backIndex = summaryBO.backIndex + 1;
                        cmp.event.trigger("beforepageredirect",document);
                        cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, nextPageData, {openWebview : true});
                    }
                }
            });
        }
    });
}
var isFavoriteOrCancelSuccess = true;
function switchFavoriteName(btnName){
	if(btnName instanceof Array){
		for(var i = 0 ; i < btnName.length ; i++){
			var temp = btnName[i];
			if(temp.key == "FavoriteKey"){
				var temName = temp.name;
				temp.name = temp.name2;
				temp.name2 = temName;
				isFavoriteOrCancelSuccess = true;
			}
		}
	}
}
var hasFavorite="";
function _favoriteSummary(btnObj){
	isFavoriteOrCancelSuccess = false;
	var affairId = summaryBO.summary.affairId;
	var paramData = {"affairId" : affairId,"from":""};
	if(hasFavorite == "1"){
		 $s.Coll.cancelFavoriteAffair(paramData, errorBuilder({
				success : function(result) {
					if (result.success == "true") {
						//reloadPage();
						hasFavorite = "0";
						summaryBO.summary.hasFavorite = "0";
						switchFavoriteName(btnObj);
					} else {
						cmp.dialog.failure(result.message);
					}
				}
	    }));
	}else{
		 $s.Coll.favoriteAffair(paramData, errorBuilder({
			success : function(result) {
				if (result.success == "true") {
					hasFavorite = "1";
					summaryBO.summary.hasFavorite = "1";
					switchFavoriteName(btnObj);
				} else {
					cmp.dialog.failure(cmp.i18n("collaboration.takeBackErr.msg11"));
				}
			}
		}));
	}
}


//移交
function _transferSummary() {
    //协同流程终止加锁
    WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.TRANSFER, function(ret) {
        if(ret) {
            _formLoadCheck({
                checkCallback : function(ret){
                    if(ret == true){
                        if(_summaryRepeatClk){
                            return;
                        }
                        _summaryRepeatClk = true;
                        var nextPageData = {
                            "action" : CopyWorkFlowLock.TRANSFER,
                            "cache_subfix" : pageX.winParams.cache_subfix,
                            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                            "title" : cmp.i18n("collaboration.page.lable.button.transfer")
                            //"placeholder" : cmp.i18n("collaboration.page.info.whencancel",[cmp.i18n("collaboration.page.lable.button.terminate")])//终止流程不可恢复，若确认回退流程，请在这里输入终止附言。
                        }
                        summaryBO.backIndex = summaryBO.backIndex + 1;
                        cmp.event.trigger("beforepageredirect",document);
                        cmp.href.next(_collPath + "/html/details/comment.html"+colBuildVersion, nextPageData, {openWebview : true});
                    }
                }
            });
        }
    });
}


//撤销
function _transRepal(){
    //协同流程撤销加锁
    WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.REPEAL_ITEM, function(ret) {
        if(ret) {
            var nextPageData = {
                    "cache_subfix" : pageX.winParams.cache_subfix,
                    "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
            };
            
            summaryBO.backIndex = summaryBO.backIndex + 1;
            
            cmp.event.trigger("beforepageredirect",document);
            cmp.href.next(_collPath + "/html/cancel.html"+colBuildVersion, nextPageData, {openWebview : true});
        }
    });    
}

//支持原样表单，多一层验证
function _dealSummaryCheck(){
	_formLoadCheck({
		checkCallback : function(ret){
			if(ret == true){
				_dealSummary();
			}
		}
	});
}

//原表单预提交处理
var _violenceClickFlag = false;
function _formLoadCheck(xParams){
    
    if(_violenceClickFlag){
        //暴力点击
        return;
    }
    
    _violenceClickFlag = true;
    
    var checkCallback;
    
    checkCallback = function(ckRet){
        xParams.checkCallback(ckRet);
        _violenceClickFlag = false;
    }
    
    //意见更多处理
    if(pageX.isMoreComment){
        checkCallback(true);
        return;
    }
    
    if(summaryBO["summary"].bodyType == '20' && !_isContentInit){
        _alert(cmp.i18n("collaboration.action.alert.contentinit"));
        checkCallback(false);
        return;
    }
    
    //直接提交
    checkCallback(true);
}


function _transRepalValid(){
    var params = {"summaryId":summaryBO["summary"].id,"affairId":summaryBO["summary"].affairId};
     // 撤销协同
    $s.Coll.transRepalValid({},params,errorBuilder({
        success : function(result) {
            if(result["msg"]){
                _alert(result["msg"],null,"");
            }else if(result.error_msg || result["error_msg"]){
                _alert(result.error_msg || result["error_msg"],null,"");
                return;
            }else {
                _transRepal();
            }
        }
    }));
}


//跟踪切换
function _taggleTrack(){
    var trackBtn = _$("#trackBtn");
    var trackFlag = trackBtn.getAttribute("trackFlag");
    var trackLable = _$("#trackBtnLable");
    var trackImg = _$("#trackBtnImg");
    if(trackFlag == "1"){
        trackBtn.setAttribute("trackFlag", "0");
        trackImg.className="see-icon-v5-common-tracking";
        trackLable.innerText = cmp.i18n("collaboration.page.lable.button.track");//跟踪
    }else{
        trackBtn.setAttribute("trackFlag", "1");
        trackImg.className="see-icon-v5-common-tracking-cancel";
        trackLable.innerText = cmp.i18n("collaboration.page.lable.button.track_cancel");//取消跟踪
    }
}

function transForward() {
	
	var page = {
            "summaryId" : summaryBO["summary"].id,
            "rightId":summaryBO["summary"].rightId,
            "affairId" : summaryBO["summary"].affairId,
            "defPolicy" : summaryBO["defPolicy"],
            'accountId':summaryBO["summary"].accountId,
            "cache_subfix" : pageX.winParams.cache_subfix,
            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
            //"backIndex" : summaryBO.backIndex + 1,
            "parentX":{
                "openFrom": "summary"
            }
    };
	
	if(summaryBO && summaryBO.openFrom =="listWaitSend"
		&& summaryBO["summary"].templateId){
		
	    var templateId = summaryBO["summary"].templateId;
    	$s.Coll.isTemplateDeleted({
            "templateIds" : templateId
        }, errorBuilder({
            success : function(result) {

                if (result && result.code == "0") {

                    var delTemplateIds = result["data"]["delTemplateIds"];
                    if (delTemplateIds.length > 0) {

                        _alert(cmp.i18n('collaboration.forword.errorTemplate',[summaryBO["summary"]["subject"]]));
                        forwardCount = 0;
                        return;
                    }

                    // 待发的时候转发协同该属性引起报错 跳转回来的时候重新加载页面加载上该属性。
                    cmp.event.trigger("beforepageredirect", document);
                    cmp.href.next(_collPath + "/html/colForward.html" + colBuildVersion, page, {
                        openWebview : true
                    });
                }
                else {
                    _alert(result.message);
                    return;
                }
            },

            error : function(result) {
                _alert(result.message);
                return;
            }
        }));
	}else{
		//待发的时候转发协同该属性引起报错 跳转回来的时候重新加载页面加载上该属性。
		cmp.event.trigger("beforepageredirect",document);
		cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion,page, {openWebview : true});
	}
    

}

/**
 * 协同取回公用方法
 * @param workitemId 
 * @param processId
 * @param activityId
 * @param performer
 * @param caseId
 * @param appName
 * @param isForm
 * @param affairId 
 * @param trackBackCall 
 */
function trackBack(workitemId, processId, activityId, performer, caseId, appName, isForm,affairId,trackBackCall){
    var trackBackParam = {};
    trackBackParam.affairId = affairId;
    
    //调用工作流的是否能取回方法
    canTakeBack(workitemId, processId, activityId, null, caseId, appName, isForm,function(msg){
        //判断是否能够取回
        if (msg != null && !msg.canTakeBack) {
            
            var err_msg = "";
            if(msg.state == "10"){
                //超级节点
                err_msg = msg.err_msg;
            }else{
                err_msg = cmp.i18n('collaboration.takeBackErr.msg' + msg.state)
            }
            clickCount = false;
            _alert(err_msg, null, cmp.i18n("collaboration.page.dialog.note"),[cmp.i18n("collaboration.button.close.label")]);
            return;
        }else{
            //协同流程取回加锁
            WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.TAKE_BACK, function(ret) {
                if(ret) {
                	var workflowCheckParam = {
              			event : "BeforeTakeBack",
              			callback : function(flag){
              				if(flag){
              					var updateComment = cmp.i18n("collaboration.page.lable.updateComment");
              					var notUpdateComment = cmp.i18n("collaboration.page.lable.notUpdateComment");
              					var items=[updateComment,
              					           notUpdateComment,
              					           cmp.i18n("collaboration.page.cancelFavorite"),
              					           cmp.i18n("collaboration.page.lable.sureUpdateComment")]; 
              					cmp.notification.judge(items[3],function(index){
              						if (index != 2) {
              							if (index == 0) {//修改原意见
              								trackBackParam.isSaveOpinion = false;
              							} else if (index == 1) {//重新处理
              								trackBackParam.isSaveOpinion = true;
              							}
              							//dee表单开发高级
              							var deeSuccessFn = function(){
              								$s.Coll.takeBack(trackBackParam,errorBuilder({
              									success : function(result) {
              										if (result.message != undefined) {
              											_alert(result.message);
              											
              											clickCount = false;
              											WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.TAKE_BACK);
              										}else{
              										    if(typeof(trackBackCall)=='function'){
              										        trackBackCall();
              										    }
              										}
              									}
              								}));
              							}
              							
                  						//表单开发高级
                  	   					formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,summaryBO["summary"].affairId,"takeback","",null,deeSuccessFn);
              						} else {
              							clickCount = false;
              							WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.TAKE_BACK);
              						}
              					},cmp.i18n("collaboration.page.lable.button.tackback"),[items[0],items[1],items[2]],null,2); 
              				}else{
              					clickCount = false;
              					WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.TAKE_BACK);
              				}
              			},
                        formAppId : summaryBO.workflowCheckParam.formAppId,
                        formViewOperation : summaryBO.workflowCheckParam.formViewOperation
                    };
                	pageX.wfDesigner.executeWorkflowBeforeEvent(workflowCheckParam);
                }else{
                	clickCount = false;
                }
            });
        }
    });
}
var btns = [];
var clickCount = false;//防止重复点击
//处理按钮设置 TODO 本期改造点
function _showDealBtns(canDeal, nodeActions){
    
    //页面显示
    var footerBar = _$("#footer_btns");
    var affairSubState = summaryBO["summary"].affairSubState;
    var summaryState = summaryBO["summary"].state;
    if(canDeal){
        
        _$("#otherBtns").remove();
        _$("#deal_summary_btn").addEventListener("tap", _dealSummaryCheck);
        
        
        function initMorBtns(hasSign){
            
            var actionI18n = {
                    "Forward" : cmp.i18n("collaboration.page.lable.button.forward"),//转发协同
                    "Return" : cmp.i18n("collaboration.page.lable.button.return"),//回退
                    "Terminate" : cmp.i18n("collaboration.page.lable.button.terminate"),//终止
                    "Cancel" : cmp.i18n("collaboration.page.lable.button.cancel1"),//撤销
                    "SpecifiesReturn" : cmp.i18n("collaboration.default.stepBack"),// 指定回退
                    "Transfer" : cmp.i18n("collaboration.page.lable.button.transfer"),// 移交
                    "Edit" : cmp.i18n("collaboration.page.lable.button.modifyContent")//修改正文
                }

            if(!summaryBO.isHaveNewColl){
                delete actionI18n["Forward"];
            }
            
            //只有office格式的正文才能修改正文且只有CMP壳才能修改正文
            if(!summaryBO.content 
                    || !summaryBO.canEditContent
                    || summaryBO.content.contentType=="20"
                    || summaryBO.content.contentType=="45" 
                    || !summaryBO.content.fileId 
                    || !CollUtils.isCMPShell() ){
            	delete actionI18n["Edit"];
            }
            
          //非当前指定回退状态，整个流程处于指定回退状态
            if(summaryBO.inInSpecialSB){
                delete actionI18n["SpecifiesReturn"];
                delete actionI18n["Return"];
            }else if(affairSubState == '15'){
                
                delete actionI18n["Transfer"];
                delete actionI18n["Return"];
                delete actionI18n["SpecifiesReturn"];
                
            }else if(affairSubState == '16'){
                
                delete actionI18n["Transfer"];
                delete actionI18n["Return"];
                
            }else if(affairSubState == '17'){
                
                delete actionI18n["Transfer"];
                delete actionI18n["Return"];
                delete actionI18n["SpecifiesReturn"];
            }
            
            if(actionI18n["SpecifiesReturn"]){
              //尝试初始化流程
                _initDetailWfDesigner();
            }
            
            for(var i = 0, len = summaryBO.pageConfig.commonActions.length; i < len; i++){
                var action = summaryBO.pageConfig.commonActions[i];
                if(actionI18n[action]){
                    btns.push({
                        key : action,
                        name : actionI18n[action]
                    });
                }
            }
          
          
          //收藏 addby lib
           if(summaryBO.pageConfig.canFavorite){
        	   hasFavorite = summaryBO.summary.hasFavorite;
        	   if(hasFavorite == '1' && summaryBO.isFavorite){
        		   var labelName1 = cmp.i18n("collaboration.page.cancelfavorite2");
            	   var labelName2= cmp.i18n("collaboration.page.favorite");
            	   hasFavorite = "1";
        	   }else{
        		   var labelName1 = cmp.i18n("collaboration.page.favorite");
            	   var labelName2= cmp.i18n("collaboration.page.cancelfavorite2");
            	   hasFavorite = "0";
        	   }
        	   
        	   btns.push({
                   key : "FavoriteKey",
                   name : labelName1,
                   name2 : labelName2
               });
           }
           //电话会议
           if(summaryBO.showMeetingBtn){
        	   btns.push({
        		   key : "Meeting",
        		   name : cmp.i18n("collaboration.page.lable.button.meeting")
        	   });
           }
           //顺序[微信专版]签章显示在最后
           if(hasSign && summaryBO["summary"].bodyType == "20"){
             btns.push({
                 key : "Sign",
                 name : cmp.i18n("collaboration.page.lable.button.signature")//签章
             });
            }
           var dMoreBtn = _$("#deal_more_btn");
           if(dMoreBtn){
               if(btns.length > 0){
                   cmp.event.click(dMoreBtn,function(e) {
                	   if(isFavoriteOrCancelSuccess){//收藏和取消收藏切换时，按钮显示有延迟
                		   cmp.dialog.actionSheet(btns, cmp.i18n("collaboration.page.lable.button.cancel"), function(item) {
                			   if(summaryBO.editParam && !summaryBO.editParam.save && "Edit" != item.key){
                			    	cmp.notification.confirm(cmp.i18n("collaboration.content.modify.save"),function(e){ //e==1是/e==0 否
                			    		if(e==1){
                			    			_editContent(false);
                				        }else{
                				        	dealFn(item);
                				        }
                				    },null, [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
                			    }else{
                			    	dealFn(item);
                			    }
                		   });
                	   }
                   });
                   
               }else{
                   _$("#deal_more_btn").remove();
               }
           }
        }
        
        //先判断签章 TODO 可以优化，等点签章的时候再判断权限
        if((affairSubState != '15' && affairSubState != '17') 
                && !pageX.isMoreComment && CollUtils.isInArray(nodeActions, "Sign") 
                && ((summaryBO["summary"].bodyType == "10" && !summaryBO.content.isForwardForm)
                        || summaryBO["summary"].bodyType == "20")){
            
            LazyUtil.addLoadedFn("lazy_iSignaturePhone", function(){
                if(typeof summaryBO.hasSignFlag == "undefined"){
                    hasSignaturepolicy(function(_keySn){
                        summaryBO.hasSignFlag = false;
                        if(_keySn){
                            summaryBO.hasSignFlag = true;
                            summaryBO.hasKeySn = _keySn;
                        }
                        initMorBtns(summaryBO.hasSignFlag);
                   });
                }else{
                    initMorBtns(summaryBO.hasSignFlag);
                }
            });
        }else{
            initMorBtns(false);
        }
        
        footerBar.style.display = "";
        
    }else{
        _$("#handleBtns").remove();
        var otherBtn = _$("#otherBtns");
        var otherBtns = [];
        //流程未结束，常规的操作按钮
        if(!summaryBO["summary"].finished) {
            
            //已办
            if(summaryBO["summary"].affairState == 4){
                
                otherBtns.push({
                    "attrs" : "",
                    "id" : "takeBackBtn",
                    "class" : "see-icon-v5-common-getback",
                    "lable" : cmp.i18n("collaboration.page.lable.button.tackback")//取回
                });
            } 

            //已发
            else if((summaryBO["summary"].affairState == 2 
                        || (summaryBO["summary"].affairState == 3 
                                && (affairSubState == 15 
                                        || affairSubState == 17))
                    ) && CollUtils.isInArray(nodeActions, "Cancel")) {
                otherBtns.push({
                    "attrs" : "",
                    "id" : "cancelBtn",
                    "class" : "see-icon-v5-common-rollback",
                    "lable" : cmp.i18n("collaboration.page.lable.button.cancel1")//撤销
                });
            } 
            
            //待发
            else if(summaryBO["summary"].affairState == 1) {
                if(summaryBO["summary"].bodyType != '20' && (summaryBO.isHaveNewColl || summaryBO["summary"].templateId)) {
                    //待发-发送
                    otherBtns.push({
                        "attrs" : "",
                        "id" : "sendImmediateBtn",
                        "class" : "see-icon-v5-common-send",
                        "lable" : cmp.i18n("collaboration.page.lable.button.send")//发送
                    });
                }else if(summaryBO["summary"].bodyType=='20') {
                    //待发-编辑
                    otherBtns.push({
                        "attrs" : "",
                        "id" : "editBtn",
                        "class" : "see-icon-v5-common-doc-edit",
                        "lable" : cmp.i18n("collaboration.page.lable.button.edit")//编辑
                    });
                }
            }
        }
        var canfowardColl = summaryBO && summaryBO.summary && summaryBO.summary.canForward != '0';
        if(CollUtils.isInArray(nodeActions, "Forward") && summaryBO.isHaveNewColl && canfowardColl){
            otherBtns.push({
                "attrs" : "",
                "id" : "transformBtn",
                "class" : "see-icon-v5-common-transmit",
                "lable" : cmp.i18n("collaboration.page.lable.button.forward")//转发协同
            });
        }
        
        //流程未结束，常规的操作按钮
        if(!summaryBO["summary"].finished) {
            if(CollUtils.isInArray(nodeActions, "Track")) {
                if((summaryBO["summary"].listType != "listWaitSend" 
                        && affairSubState != 15 
                        && affairSubState != 17)
                        && summaryState == 0) {
                  //跟踪设置
                    /*var affairTrack = summaryBO["trackProcess"];
                    if(affairTrack == "0" || affairTrack == null){
                        _taggleTrack();
                    }*/
                    
                    //公告审批和新闻审批待办时不能有跟踪按钮
                    var isTrack=cmp.i18n("collaboration.page.lable.button.track_cancel");
                    var trackClass = "see-icon-v5-common-tracking-cancel";
                    var _tf= "trackFlag=\"1\"";
                    if(summaryBO.summary.affairTrack == "0" || summaryBO.summary.affairTrack == null){
                        _tf="trackFlag=\"0\""
                        isTrack=cmp.i18n("collaboration.page.lable.button.track");
                        trackClass = "see-icon-v5-common-tracking";
                    }
                    otherBtns.push({
                        "attrs" : _tf,
                        "id" : "trackBtn",
                        "class" : trackClass,
                        "lable" : isTrack//取消跟踪
                    });
                }
            }
            
            if(CollUtils.isInArray(nodeActions, "Terminate")) {
                if(summaryBO["summary"].listType!="listDone" 
                    && (affairSubState != 15 
                            || affairSubState != 17)) {
                    otherBtns.push({
                        "attrs" : "",
                        "id" : "terminateBtn",
                        "class" : "see-icon-v5-common-stop-circle-fill",
                        "lable" : cmp.i18n("collaboration.page.lable.button.terminate")//终止
                    });
                }
            }
        }
        
        if(otherBtns.length > 0){
            var otherBtnTemplate = _$("#other_btn_template").innerHTML;
            var btnHTML = cmp.tpl(otherBtnTemplate, otherBtns);
            otherBtn.innerHTML = btnHTML;
            
            //添加事件
            cmp("#otherBtns").on("tap", "a", function(){
                
                var aId = this.getAttribute("id");
                switch (aId) {
                case "takeBackBtn":
                	var idMap = {
                		"summaryID" : summaryBO.summary.id,
                		"affairID" : summaryBO.summary.affairId
                	}
                	
                	if(!LazyUtil.isLoad("lazy_dee") 
                	        || !LazyUtil.isLoad("lazy_wf")
                	        || (!pageX.wfDesigner || !pageX.wfDesigner.isInit())){
                	    //等懒加载的js加载完成
                	    return;
                	}
                	
                	//协同已办列表取回前事件
                    var eventParams={
                    	funName : "beforeDoneTakeBack",
                    	data : idMap,
                    	success : function(){
                    		//取回
                    		if(!clickCount){
                    			clickCount=true;
                    			var isForm = summaryBO["summary"].bodyType == '20';
                    			trackBack(summaryBO["summary"].affairWorkitemId, summaryBO["summary"].processId, 
                    					summaryBO["summary"].activityId, null, summaryBO["summary"].caseId, 
                    					"collaboration", isForm,summaryBO["summary"].affairId,function(){
                    				//wxj 协同取回后，直接进入该协同的处理页面
                    				var paramData = {
                    						"affairId" : summaryBO["summary"].affairId,
                    						"backIndex" : summaryBO.backIndex + 1
                    				}
                    				setListViewRefresh("true");
                    				var nextUrl = "/html/details/summary.html"+colBuildVersion;
                    				cmp.href.next(_collPath + nextUrl, paramData);
                    			});
                    		}
                    	},
                    	error : function(){
                    		
                    	}
                    }
                    cmp.funProxy.getter(eventParams);
                	break;
                case "cancelBtn" :
                    if(summaryBO["summary"].affairState == 2){
                    	var idMap = {
                    		"summaryID" : summaryBO.summary.id,
                    		"affairID" : summaryBO.summary.affairId
                    	}
                    	//协同已发撤销前事件
                        var eventParams={
                        	funName : "beforeDealCancel",
                        	data : idMap,
                        	success : function(){
                        		_transRepalValid();
                        	},
                        	error : function(){
                        		
                        	}
                        }
                        cmp.funProxy.getter(eventParams);
                    }else{
                        //处理时撤销
                        _repealSummary();
                    }
                    break;
                case "sendImmediateBtn":
                    _sendImmediate();
                    break;
                case "editBtn":
                    
                    var paramData = {
                        "summaryId" : summaryBO["summary"].id,
                        "openFrom" : "listWaitSend",//summaryBO.openFrom
                        "backIndex" : summaryBO.backIndex + 1,
                        "preCaches" : CollCacheKey.getCacheKeys(CollCacheKey.summary, pageX.winParams.cache_subfix)
                    }
                    //更多页面编辑，删除表单缓存
                    /*if(pageX.isMoreComment){
                        if(window.summaryBO && summaryBO["summary"].bodyType == "20"){
                            if(cmp.sui){
                                var options = { 
                                        moduleId:summaryBO["summary"].id,
                                        rightId:summaryBO["summary"].rightId,
                                        viewState: summaryBO._viewState
                                }
                                cmp.sui.clearCache(options);
                            }
                        }
                    }*/
                    cmp.href.next(_collPath + "/html/newCollaboration.html"+colBuildVersion, paramData);
                    break;
                case "trackBtn":
                  //跟踪 TODO 好像默认显示的不对
                    $s.Coll.getTrackInfo(summaryBO["summary"].affairId, {},errorBuilder({
                        success : function(result) {
                            if(result && result["error_msg"]){
                                _alert(result["error_msg"]);
                            }else{
                                _taggleTrack();
                            }
                        }
                    }));
                    break;
                case "terminateBtn":
                    _terminateSummary();
                    break;
                case "transformBtn":
                    transForward();
                    break;
                default:
                    break;
                }
            });
            
            footerBar.style.display = "";
        }else{
            footerBar.remove();
        }
    }
}

function dealFn(item){
	//点击操作
   switch (item.key) {
   case "Forward":
	   transForward();
	   break;
   case "Return":
	   _returnSummary();
	   break;
   case "Terminate":
	   _terminateSummary();
	   break;
   case "Sign":
	   //如果当前页签不是正文页签切换到正文页签
	   if(summaryBO["summary"].bodyType == "20"){
		   //切换到表单页签
		   _switche2View(pageX.cache.formIndex, false);
	   }
	   showSignatureButton(summaryBO.hasKeySn, summaryBO["summary"].id);
	   break;
   case "Cancel":
	   _repealSummary();
	   break;
   case "SpecifiesReturn":
	   _specifiesReturn();
	   break;
   case "Transfer":
	   _transferSummary();
	   break;
   case "FavoriteKey":
	   _favoriteSummary(btns);
	   break;
   case "Edit":
	   _editContent(false);
	   break;
   case "Meeting":
	   _goMeeting();
	   break;
   default:
	   break;
   }
}

/**
 * 添加流程相关数据
 * 
 * @param param
 * @returns
 */
function _addWorflowData(param) {
    // 删除无用的参数
    delete param["opinionPolicy"];
    delete param["attribute"];
    delete param["nowNodeOpinion"];
    delete param["actions"];
    delete param["filedsIsNull"];
    delete param["actionName"];
    delete param["workflowParam"];
    
    //流程相关参数
    param = cmp.extend(param, pageX.wfDesigner.getDatas());
    return param;
}

var sendCount = 0;
function _sendImmediate() {
	if(sendCount > 0){
		return;
	}
	sendCount++;
	
    //1 开启进度条
    _startSubmitting();
    
    //2 验证流程超期时间是否已过
    var deadlineDatetime = summaryBO["summary"].processDeadLineName;
    if(deadlineDatetime) {
        var nowDatetime = new Date();
        if(deadlineDatetime && (nowDatetime.getTime()+summaryBO.server2LocalTime) > new Date(deadlineDatetime.replace(/-/g,"/")).getTime()){
            _alert(cmp.i18n("collaboration.deadline.sysAlert"), function(){sendCount--;});
            _stopSubmitting();
            return;
        }
    }
    
    //3 验证是否调用模板
    var templateId = null;
    if(summaryBO["summary"].affairSubState != "16") {//指定回退被回退的不再校验模板
        templateId = summaryBO["summary"].templateId;
    }
    if(templateId && templateId!=null && templateId!="") {//有模板
        
        //4 调用模板的状态校验
        $s.Coll.checkCollTemplate({templateId : templateId}, errorBuilder({
            success: function(ret) {
                //4-1 模板删除状态验证
                if(ret.result =='cannot') {
                    _alert(cmp.i18n('collaboration.send.fromSend.templeteDelete'), function(){sendCount--;});//模板已经被删除，或者您已经没有该模板的使用权限三
                    _stopSubmitting();
                    return;
                } 
                //5 是否有流程的验证
                else if(ret.result =='noworkflow') {
                     //协同没有流程,不能发送
                    _alert(cmp.i18n('collaboration.send.fromSend.noWrokFlow'), function(){sendCount--;});
                     _stopSubmitting();
                     return;
                }
                if(ret.result =='isTextTemplate') {
                    if(!summaryBO["summary"].processId) {
                        _alert(cmp.i18n('collaboration.send.fromSend.noWrokFlow'), function(){sendCount--;});
                        _stopSubmitting();
                        return;
                    }
                    _sendImmediateCallback();
                } else {
                    summaryBO["summary"].processId = ret.result;
                    //6 公文发送预提交及提交
                    _sendImmediateCallback();
                }
            }
        }));
    } else {//无模板
        //5 流程的验证
        if(!summaryBO["summary"].processId) {//无模板，有流程
            _alert(cmp.i18n('collaboration.send.fromSend.noWrokFlow'), function(){sendCount--;});
            _stopSubmitting();
            return;
        }
        //TODO 流程id是否为空验证
        //TODO 是否有发起权限验证
        
        //6 公文发送预提交及提交
        _sendImmediateCallback();
    }
}

function _sendImmediateCallback() {
    pageX.wfDesigner.preSubmit({
        contentData : [],
        onPop : function() {
            //组件层级管理，需要把这个影藏
            _stopSubmitting();
        },
        callback : function(preSubmitResult) {
            if(preSubmitResult["result"] == "true") {
                var param = {};
                //处理协同
                $s.Coll.sendImmediate(summaryBO["summary"].affairId, {}, _addWorflowData(param), errorBuilder({
                    success : function(result) {
                        _stopSubmitting();
                        if(result["error_msg"]) {
                            _alert(result["error_msg"], function() {
                                if(window._gotoList){
                                    //意见更多
                                    window._gotoList();
                                }else{
                                    _goBack();
                                }
                            });
                        } else {
                            if(window._gotoList){
                                //意见更多
                                window._gotoList();
                            }else{
                                _goBack();
                            }
                        }
                    }
                }));
            } else {
            	sendCount--;
                _stopSubmitting();
            }
        }
    });
}

//电话会议
function _goMeeting(){
	$s.Coll.multiCall({}, errorBuilder({
        success : function(result) {
        	var obj = result.data.meetingParams;
        	summaryBO.meetingParams = obj;
        	if(obj.meeting_url!=null && obj.meeting_url!=''){
        		obj.openFrom = "openWin";
                cmp.event.trigger("beforepageredirect",document);
                if(CollUtils.isCMPShell()){
                	cmp.href.next(_collPath + "/html/multicallPerson_next.html"+colBuildVersion,obj,{nativeBanner:true,openWebViewCatch:1});
                }else{
                	cmp.href.go(_collPath + "/html/multicallPerson_next.html"+colBuildVersion,obj);
                }
        	}else{
        		var options = {
        			title : cmp.i18n("collaboration.meeting.choosePerson"),
        			showAll : false,
        			showState : false,
        			showMeetingInfo : true,
        			showNoDataImage : true,
        			callback : function(result){
        				var obj = summaryBO.meetingParams;
        				obj.parties = result;
        				obj.openFrom = "CollSummary";
        	            cmp.event.trigger("beforepageredirect",document);
        	            if(CollUtils.isCMPShell()){
        	            	cmp.href.next(_collPath + "/html/multicallPerson_next.html"+colBuildVersion,obj,{nativeBanner:true,openWebViewCatch:1});
        	            }else{
        	            	cmp.href.go(_collPath + "/html/multicallPerson_next.html"+colBuildVersion,obj);
        	            }
        			}
        		};
        		_exeAtWho(options);
        	}
        },
        error : function(result){
        	//抛出的异常需要反馈到界面上
        	_alert(result.message);
        }
    }));
}

//开始提交
function _startSubmitting(){
    cmp.dialog.loading();
}

//结束提交
function _stopSubmitting(){
	clickCount = false;
    cmp.dialog.loading(false);
}

function _setCommentValue(){
}
/**
 * 协同工作流参数设置， 多个地方调用，一个地方初始化
 */

/**
 * 属性扩展
 * @param paramExt
 * @param infoExt
 */
function _initWfDesigner(paramExt, infoExt){
    
    LazyUtil.addLoadedFn("lazy_wf", function(){
        
        if(pageX.wfDesigner == null){
            
            var wfParams = {
                    workflow : {
                        moduleType : "1",
                        processId : summaryBO["summary"].processId,
                        caseId : summaryBO["summary"].caseId,
                        currentNodeId : summaryBO["summary"].activityId,
                        subObjectId : summaryBO["summary"].affairWorkitemId
                    },
                    info : {
                        //model : "",
                        //wfSelectorId : "",
                        state : "edit_current",
                        dataCacheKey : CollCacheKey.summary.workflow + pageX.winParams.cache_subfix,//数据缓存key
                        //canEdit : null,
                        //beforDrawWf : null,
                        //customerTap : null,
                        //onTriggerEdit : null,
                        defaultPolicyId : summaryBO["defPolicy"]["value"],
                        defaultPolicyName : summaryBO["defPolicy"]["name"],
                        currentAccountId : summaryBO["currentUser"]["loginAccount"],
                        currentAccountName : summaryBO["currentUser"]["loginAccountName"],
                        currentUserId : summaryBO["currentUser"]["id"],
                        currentUserName : summaryBO["currentUser"]["name"],
                        category : "collaboration",
                        workItemId : summaryBO["summary"].affairWorkitemId,
                        affairId : summaryBO["summary"].affairId,
                        summaryId : summaryBO["summary"].id,
                        bodyType : summaryBO["summary"].bodyType,
                        activityId : summaryBO["summary"].activityId,
                        formData : summaryBO["summary"].formRecordId,
                        processTemplateId : summaryBO["summary"].templateProcessId,
                        canTrackWorkflow : summaryBO["canTrackWorkflow"],
                        currentWorkItemIsInSpecial : (summaryBO["summary"].affairSubState == '15' 
                            || summaryBO["summary"].affairSubState == '16' 
                                || summaryBO["summary"].affairSubState == '17'),
                        submitStyleCfg : summaryBO.pageConfig["submitStyleCfg"],
                        isProcessTemplate : summaryBO["summary"].processTemplate
                       
                    },
                    style : {
                        zIndex : 11
                    },
                    getPermissions : function(callback){
                        var params = {"appName":"collaboration",
                                      "summaryId":summaryBO["summary"].id,
                                      "bodyType":summaryBO["summary"].bodyType,
                                      "defaultPolicyId":summaryBO["defPolicy"].value,
                                      "accountId":summaryBO["summary"].accountId,
                                      "isSystemTemplate":summaryBO["summary"].systemTemplate};
                        //获取节点权限
                        $s.Coll.permissions({},params, errorBuilder({
                            success : function(ret){
                                callback(ret);
                            }
                        }))
                    }
                }
            
            //扩展属性
            if(paramExt){
                wfParams = cmp.extend(true, wfParams, paramExt);
            }
            
            if(infoExt){
                wfParams.info = cmp.extend(true, wfParams.info, infoExt);
            }
            
            pageX.wfDesigner = new WorkFlowDesigner(wfParams);
        }
        
        //清空配置
        paramExt = null; 
        infoExt = null;
    });
}/**
 * 
 */

//office格式的正文修改
function _editContent(readOnly){
	//判断是否移动授权(获取序列号)
	$s.EditContent.getOfficeAuthKey({},{},errorBuilder({
		success : function(result) {
			if(result && result.authKey){
				summaryBO.copyRight = result.authKey;
				summaryBO.type = "collaboration";
				summaryBO.readOnly = readOnly;
				summaryBO.isClearTrace = true;
				if(!readOnly){
					//修改正文时加锁
					WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].id, CopyWorkFlowLock.EDIT_CONTENT, function(ret) {
						if(ret) {
							LazyUtil.addLoadedFn("lazy_edit", function(){
								ContentEdit.init(summaryBO);
							});
						}
					});
				}else{
					LazyUtil.addLoadedFn("lazy_edit", function(){
						ContentEdit.init(summaryBO);
					});
				}
			}else{
				_alert(cmp.i18n("collaboration.edit.office.content.authorization"));
			}
        }
	}));
}

function _backPage(callBack){
	var btns = [{
        key : "giveuptip",
        name : cmp.i18n("collaboration.edit.office.content.confirm.save")//放棄修改正文
    },{
        key : "giveup",
        name : cmp.i18n("collaboration.page.lable.yes")//是
    }];
	
	cmp.dialog.actionSheet(btns,cmp.i18n("collaboration.page.lable.no"), function(item) {
        //点击操作
        if("giveup" == item.key){
        	callBack();
        }
    }, function() {
    	return;
    });
}/*
 * 表单开发高级 : 表单开发高级
 * @param bodyType ：正文类型
 * @param affairId :affairId
 * @param attitude :态度
 * @param opinionContent ：意见内容
 * @param currentDialogWindowObj ：当前Dialog对象
*/
function formDevelopAdance4ThirdParty(bodyType,affairId,attitude,opinionContent,currentDialogWindowObj,succesCallBack,currentNodeLast) {
  try{
      function failedCallBack(){
    	  _stopSubmitting();
      }
      function saveContentCallBack(message) {
    	  if(message != undefined && message != "") {
    	      _setCommentValue(message, true);
    	  }
      }
      if(bodyType != '20' ){
          succesCallBack();
      }else {
          var tAttitude = attitude || "",
              tOpinionContent = opinionContent || "";
          
          beforeSubmit(affairId, tAttitude.trim(), tOpinionContent.trim(),currentDialogWindowObj,succesCallBack,failedCallBack,saveContentCallBack,currentNodeLast);
      }
   }catch(e){
       _stopSubmitting();
       _alert(cmp.i18n("collaboration.exception.formException"));
       logToServer(e.stack);
       console.error(e);
   } 
}/**
 * 
 */

pageX.atDialog = null;
pageX.hasAtWhoMembers = true;
pageX.cache.atWhoSelected = [];
pageX.atWhoPage = {"pageNo":1, "pageSize":50}
pageX.atWhoIsLast = false;
pageX.atWhoIsSearching = false;
pageX.pushMessageMembersList = [];
pageX.searchValue = "";
pageX.options = {
	showAll : true,
	showState : true,
	showMeetingInfo : false,
	showNoDataImage : false
};

function _initAtWho(){
    //at功能
    var $content = _$('#content');
    var $atBtn =  _$("#atBtn");
    
    if($atBtn.classList.contains("display_none")){
        $atBtn.classList.remove("display_none") 
    }
    
    $content.addEventListener('keyup', _atWho);
    $atBtn.addEventListener('tap', _exeAtWho);
}

function _atWho(e){
    
    if(e.keyCode == KEY_CODE.BACKSPACE){
        //删除
        return;
    }
    
    var c = CollUtils.getCharacter(this);
    if(c === "@"){
        this.blur();
        setTimeout(_exeAtWho, 10);
    }
}

function _mergeConfig(options){
    var newOptions = pageX.options
    newOptions.title = cmp.i18n("collaboration.page.lable.msgPushTitle");
    for(var key in options){
        if(options && typeof(options[key]) != "undefined"){
        	newOptions[key] = options[key];
        }
    }
    return newOptions;
}

function _exeAtWho(options){
	pageX.options = _mergeConfig(options);
    if(pageX.atDialog == null){
        
        var dialogConfig = {
                initHeader : false,
                title : pageX.options.title,//选择消息推送的人
                dir : "bottom-go",
                hideType : 'hide',
                show : true,
                initHTML : function() {
                    
                    var dialogHtml = '<div class="cmp-search-content" style="position:absolute;padding: 5px;width:100%;">'
                        + '<form action="javascript:void(0)">'
                        
                        + '<div class="cmp-input-row cmp-search">'
                        + '  <input id="at-who-input" type="search" autocomplete="off" class="cmp-input-clear" placeholder="">'
                        + '  <span id="at-who-delete" class="cmp-icon cmp-icon-clear cmp-hidden"></span>'
                        + '  <span id="at-who-placeholder" class="cmp-placeholder" style="height:34px!important; font-size:16px!important; line-height:34px!important; border-radius:6px!important; background:none!important;">'
                        + '      <span class="cmp-icon cmp-icon-search"></span>'
                        + '      <span>'+ cmp.i18n("collaboration.page.lable.msgPlaceholder") +'</span>'
                        + '  </span>'
                        + '</div>'
                    
                        +'</form>'
                        +'</div>'
                        
                        + '<div class="back_white search_box" style="height: 100%;padding-top: 44px">'
                        + '<ul id="at-who-ul" class="cmp-list-content cmp-list-opinion-reply" style="width: 100%;height: 100%;overflow: auto;">'
                        + '</ul>'
                        +'</div>';
                    return dialogHtml;
                },
                onInit : function() {
                    
                        
                  //加载数据, 加载第一页数据
                    _searchAtWhoItem("", true);
                    
                    pageX.atDialog.mainDiv.querySelector("#at-who-ul").addEventListener("scroll", function(e){

                        //检测向上向下滚动
                        var sTop = this.scrollTop, viewHeight = this.clientHeight;
                        var hideHeight = this.scrollHeight - (sTop + viewHeight);
                        if(hideHeight < 300 && pageX.atWhoIsSearching === false){
                            //请求下一页
                            _searchAtWhoItem(pageX.searchValue, false);
                        }
                    });
                    
                    var atWhoInput = pageX.atDialog.mainDiv.querySelector("#at-who-input");
                    var atWhoDelete = pageX.atDialog.mainDiv.querySelector("#at-who-delete");
                    var atWhoPlaceholder = pageX.atDialog.mainDiv.querySelector("#at-who-placeholder");
                    
                    atWhoInput.addEventListener("keyup", function(e){
                        if(e.keyCode == 13 || e.which == 13) {
                        	pageX.searchValue = this.value;
                        	pageX.pushMessageMembersList = [];
                            _searchAtWhoItem(pageX.searchValue, true);
                        }
                    });
                    atWhoInput.addEventListener("focus", function(e){
                        var pNode = this.parentNode;
                        var pNodeCL = pNode.classList;
                        if(!pNodeCL.contains("cmp-active")){
                            pNodeCL.add("cmp-active");
                        }
                        pNode.querySelector("#at-who-delete").classList.remove("cmp-hidden");
                    });
                    atWhoInput.addEventListener("blur", function(e){
                        var pNode = this.parentNode;
                        if(this.value == ""){
                            var pNodeCL = pNode.classList;
                            if(pNodeCL.contains("cmp-active")){
                                pNodeCL.remove("cmp-active");
                            }
                        }
                        pNode.querySelector("#at-who-delete").classList.add("cmp-hidden");
                    });
                    atWhoDelete.addEventListener("tap", function(e){
                        var atInput = this.parentNode.querySelector("#at-who-input");
                        var oldValue = atInput.value;
                        if(oldValue != ""){
                            atInput.value = "";
                            _searchAtWhoItem("", true);
                        }
                    });
                    atWhoPlaceholder.addEventListener("tap", function(e){
                        this.parentNode.querySelector("#at-who-input").focus();
                    });
                    
                    //
                    cmp("#at-who-ul").on("tap", "li", function(e){
                        var srcEle = e.target, tagName = srcEle.tagName.toLocaleLowerCase();
                        if(tagName !== "input"){
                            e.stopPropagation();
                            var liInput = this.querySelector("input");
                            if(liInput){
                                if(liInput.checked){
                                    liInput.checked = false;
                                }else{
                                    liInput.checked = true;
                                }
                            }
                        }
                    });
                },
                bottonConfig : {
                    buttons :[
                        {
                            type : 1,
                            isPopBtn : true,
                            label : cmp.i18n("collaboration.page.cancelFavorite"),
                            hander : function(){
                                _$("#at-who-input").blur();
                                pageX.atDialog.hide();
                            }
                        },
                        { 
                            label : cmp.i18n("collaboration.page.dialog.OK"),
                            hander : function(){
                                //
                                var inputs = _$("input", true, pageX.atDialog.mainDiv);
                                if(inputs){
                                    var selecteds = [];
                                    for(var i = 0; i < inputs.length; i++){
                                        var input = inputs[i];
                                        if(input.checked){
                                        	if(pageX.options.showMeetingInfo){
                                        		selecteds.push({
                                        			"name" : input.getAttribute("data-name"), 
                                        			"phone" : input.getAttribute("data-phone")
                                        		});
                                        	}else{
                                        		selecteds.push({
                                        			"affairId" : input.getAttribute("data-affairid"),
                                        			"memberId" : input.value,
                                        			"name" : input.getAttribute("data-name") 
                                        		});
                                        		
                                        	}
                                            input.checked = false;
                                        }
                                    }
                                    if(typeof(pageX.options.callback) == "function"){
                                    	pageX.options.callback(cmp.toJSON(selecteds));
                                    }else{
                                    	_pushAtWhoItem(selecteds);
                                    }
                                }
                                pageX.atDialog.hide();
                            }
                        }
                    ]
                 }
            }
        
        //弹出框
        pageX.atDialog = CollUtils.openDialog(dialogConfig);
    }else {//OA-117955 M3端处理协同点击@按钮后，关闭弹出框再次点击@按钮无反应
        pageX.atDialog.show();
    }
}

function _mergeAtWho(content){
    
    var ret = [];
    if(pageX.cache.atWhoSelected && pageX.cache.atWhoSelected.length > 0){
        for(var i = 0, len = pageX.cache.atWhoSelected.length; i < len; i++){
            var atItem = pageX.cache.atWhoSelected[i];
            if(content.indexOf("@" + atItem.name) != -1){
                ret.push(atItem);
            }
        }
    }
    return cmp.toJSON(ret);
}

function _pushAtWhoItem(datas){
    
    if(datas && datas.length > 0){
        
        var $content, pos, startStr, endStr, source;
        
        $content = _$("#content");
        //$content.focus();
        source = $content.value;
        
        pos = CollUtils.getPos($content);
        startStr = source.slice(0, pos);
        endStr = source.slice(pos || 0);
        
        var c = CollUtils.getCharacter($content, pos);
        c = c != "@" ? "@" : "";
        
        var atStr = "";
        
        for(var i = 0; i < datas.length; i++){
            var data = datas[i], atAffairId, atMemberId, atName;
            
            atAffairId = data.affairId;
            atMemberId = data.memberId;
            atName = data.name;
            
            if(i != 0){
                atStr += "@";
            }
            atStr += atName + " "
            
            pageX.cache.atWhoSelected.push({
                "affairId" : atAffairId,
                "memberId" : atMemberId,
                "name" : atName
            });
        }
        
        $content.value = startStr + c + atStr + endStr;
        //CollUtils.setPos($content, pos + atStr.length + 1);
        //$content.blur();
        
        CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
        //$content.selectionStart = $content.selectionEnd = pos + atName.length + 1;
    }
}

function _searchAtWhoItem(val, refresh){
    
    if(pageX.hasAtWhoMembers === false || (pageX.atWhoIsLast === true && !refresh)){
        return;
    }
    
    pageX.atWhoIsLast = false;
    val = val || "";
    
    //加载数据
    cmp.dialog.loading();
    pageX.atWhoIsSearching = true;
    if(refresh === true){
        pageX.atWhoPage.pageNo = 1;
    }else{
        pageX.atWhoPage.pageNo += 1;
    }
    
    pageX.atWhoPage.summaryId = summaryBO.summary.id;
    pageX.atWhoPage.name = val;
    $s.Coll.pushMessageToMembersList(pageX.atWhoPage, errorBuilder({
        success : function(ret){
            cmp.dialog.loading(false);
            pageX.atWhoIsSearching = false;
            ret = ret || [];
            if(refresh){
            	var assignNodeMember  = _findAssignNodeMember(val);
            	ret = assignNodeMember.concat(ret);
            }
            if((!val || pageX.options.showMeetingInfo) && ret.length == 0 && pageX.atWhoPage.pageNo == 1){
                pageX.hasAtWhoMembers = false;
                var msg = '<div class="StatusContainer"><div class="nocontent"></div><span class="text nocontent_text">'+cmp.i18n("collaboration.page.lable.msgNoMembers")+'</span></div>';
                pageX.atDialog.mainDiv.querySelector("#at-who-ul").innerHTML = msg;//没有消息推送的人
            }
            
            if(pageX.hasAtWhoMembers){
                
                if(ret.length < pageX.atWhoPage.pageSize){
                    pageX.atWhoIsLast = true;
                }
                var searchResults = null;
                if(refresh && pageX.options.showAll){
                    searchResults = [{
                        "name" : "All",
                        "id" : "All",
                        "i18n" : cmp.i18n("collaboration.page.lable.msgAllMember"),//所有人
                        "memberId" : "All"
                    }].concat(ret);
                }else{
                    searchResults = ret;
                }
                //取当前登录人
                $s.User.getUserId({}, errorBuilder({
                    success : function(ret){
                    	searchResults = _removeRepeatMember(searchResults,ret);
                        _renderAtWhoList(searchResults, refresh);
                    },
                    error : function(){
                        cmp.dialog.loading(false);
                        pageX.atWhoIsSearching = false;
                    }
                }))
                
            }
        },
        error : function(){
            cmp.dialog.loading(false);
            pageX.atWhoIsSearching = false;
        }
    }))
}

function _renderAtWhoList(memberList, refresh){
    
    var h = "";
    
    if(memberList && memberList.length > 0){
        
        var htmlTemplate = '<%for(var i = 0, len = this.length; i < len; i++){'
            +'  var item = this[i];'
            +'%>'
            +'<li class="cmp-list-cell ">'
            +' <div class="cmp-list-cell-img cmp-checkbox cmp-left">'
            +'     <input class="select-put" type="checkbox" value="<%=item.memberId%>" data-affairid="<%=item.id%>" data-phone="<%=item.phone%>" data-name="<%=item.name%>"/>'
            +'<%if(item.id != "All"){%>'
            +'     <img class="cmp-pull-left img_setting" width="40px" height="40px" src="<%=item.headshotURL%>"/>'
            +'<%if(item.id.indexOf("activity")==-1){%>'
            +'<%    var affairInfo = CollUtils.showAffairState(item.state, item.subState, item.backFromId); item.i18n=affairInfo.label;%>';
        if(pageX.options.showState){
        	htmlTemplate += '<%if(affairInfo.color != "sent"){%>'
                +'     <div style="left:52px;top:28px" class="read-states <%=affairInfo.color%>">'
                +'        <div class="state-bg">'
                +'           <span class="<%=affairInfo.icon%> state-color"></span>'
                +'        </div>'
                +'     </div>'
                +'<%}%>';
        }
        htmlTemplate += '<%}%>';
        htmlTemplate += '<%}%>'
            +' </div>';
        if(pageX.options.showMeetingInfo){
        	htmlTemplate += ' <div class="cmp-list-cell-info" >';
        }else{
        	htmlTemplate += ' <div class="cmp-list-cell-info" style="width:50%">';
        }
        htmlTemplate += '<%if(item.postName){%>'
            +'     <span class="cmp-ellipsis cmp-pull-left list_title_name width_69"><%=item.name%></span>';
        if(pageX.options.showMeetingInfo){
        	htmlTemplate += '     <span class="cmp-ellipsis cmp-pull-left list_title_name width_69">('
        	+'<%if(item.phone){%>'
        		+'<%=item.phone%>'
        	+'<%}else{%>'
        		+ cmp.i18n("collaboration.multicall.none")
        	+'<%}%>)'
        }
        htmlTemplate += '     <h6 class="cmp-ellipsis list_cont_info"><%=item.postName%></h6>'
            +'<%}else{%>'
            +'     <span style="margin-top:10px;" class="cmp-ellipsis cmp-pull-left list_title_name width_69"><%=item.name%></span>'
            +'<%}%>'
            +' </div>';
        if(pageX.options.showState){
        	htmlTemplate += '        <div class="handler-states common-state right" style="width:20%;"><span style="width:100%;margin-top:6px;"><%=item.i18n%></span></div>';
        }
        htmlTemplate += ' </li>'
            +'<%}%>';
        
        //设置头像
        for(var k = 0; k < memberList.length; k++){
            memberList[k]["headshotURL"] = cmp.origin + "/rest/orgMember/avatar/" + memberList[k]["memberId"] + "?maxWidth=200";
        }
        
        h = cmp.tpl(htmlTemplate, memberList);
    }
    
    if(refresh){
        pageX.atDialog.mainDiv.querySelector("#at-who-ul").innerHTML = h;
    }else if(h != ""){
        pageX.atDialog.mainDiv.querySelector("#at-who-ul").insertAdjacentHTML("beforeEnd", h);
    }
}

/**
 * 获取流程当前会签的人员
 * @returns {Array}
 */
function _findAssignNodeMember(searchName){
	var assignNodeMember = new Array();
	var wfDesigner = pageX.wfDesigner;
	if(!wfDesigner){
		return assignNodeMember;
	}
	var jsonFileds = wfDesigner.jsonFileds;
	if(!jsonFileds){
		return assignNodeMember;
	}
	var processChangeMessage = jsonFileds.processChangeMessage;
	if(processChangeMessage){
		var processChangeMessageJson = cmp.parseJSON(processChangeMessage);
		var addNodeInfos = processChangeMessageJson["nodes"];
		if(addNodeInfos){
			for(var i = 0;i<addNodeInfos.length;i++){
				var addNodeInfo  = addNodeInfos[i];
				//当前会签的是人员时才进行解析
				if(addNodeInfo["fromType"]=="3" && addNodeInfo["eleType"]=="user" 
					&& addNodeInfo["eleName"] && addNodeInfo["eleName"].indexOf(searchName)!=-1){
					var memeber = {};
					memeber["memberId"] = addNodeInfo["eleId"];
					memeber["name"] = addNodeInfo["eleName"];
					memeber["state"] = "";
					memeber["subState"] = "";
					memeber["id"] = "activity|"+addNodeInfo["id"];
					memeber["i18n"] = "";
					assignNodeMember.push(memeber);
				}
			}
		}
	}
	return assignNodeMember;
}

/**
 * 去除重复的人员
 * @param memberList
 * @param currentUserId
 * @returns {Array}
 */
function _removeRepeatMember(memberList,currentUserId){
	var returnMemebrList = new Array();
	for(i=0;i<memberList.length;i++){
		var member = memberList[i];
		var memberId = member["memberId"];
		if(!CollUtils.isInArray(pageX.pushMessageMembersList,memberId) && memberId != currentUserId){
			returnMemebrList.push(member);
			pageX.pushMessageMembersList.push(memberId);
		}
	}
	return returnMemebrList;
}