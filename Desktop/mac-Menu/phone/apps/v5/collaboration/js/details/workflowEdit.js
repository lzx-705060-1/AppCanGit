/**
 * 协同工作流定制化展现
 */

var pageX = {
        actions : [],
        hasInitEdit : false,
        wfState : "view",
        showToast : true,//只拉一次横幅
        wfDesigner : null,
        cache : {},
        popCount : 0,//弹层次数
        backLock : false
}


cmp.ready(function() {// 缓存详情页面数据
    
    
    _initBackEvent();
    
  //注册懒加载
    _registLazy();
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        //加载数据
        _initPageData(function(){
            
            _fillPage();
            
            //启动懒加载
            setTimeout(function(){
                LazyUtil.startLazy();
            }, 0);
            
            document.addEventListener('beforepageredirect', function(e){ 
                _storagePageData();
            });
            
            /*
            cmp.event.orientationChange(function(res){
                if(res == "landscape"){ //横屏
                
                }else if(res == "portrait"){ //竖屏
                    
                }
                _orientationChange();
            });*/
        });
    },$verstion);
});

/**
 * 横竖屏切换
 * 
 * @param res
 */
function _orientationChange(){
    
}

/**
 * 注册缓加载
 */
function _registLazy(){
    
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "css" : [
                 ],
        "js" : [
                _cmpPath + "/js/cmp-flowV5.js" + $verstion,
                _cmpPath + "/js/cmp-imgCache.js" + $verstion,
                _cmpPath + "/js/cmp-listView.js" + $verstion
                ]
    });
    
  //添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "depend" : "lazy_cmp",
        "dependModel" : "strong",
        "css" : [_wfPath + "/css/wf.css" + $verstion],
        "js" : [ workflow_jssdk,
                 _wfPath + "/js/wf.js" + $verstion,
                _cmpPath + "/js/cmp-zoom.js" + $verstion]
    });
    
  //注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp_left",
        "depend" : "lazy_wf",
        "dependModel" : "strong",
        "css" : [
                 _cmpPath + "/css/cmp-listView.css" + $verstion,
                 _cmpPath + "/css/cmp-selectOrg.css" + $verstion,
                 _cmpPath + "/css/cmp-audio.css" + $verstion,
                 _cmpPath + "/css/cmp-search.css" + $verstion,
                 _cmpPath + "/css/cmp-picker.css" + $verstion,
                 _cmpPath + "/css/cmp-sliders.css" + $verstion,
                 _cmpPath + "/css/cmp-tab.css" + $verstion,
                 _cmpPath + "/css/cmp-list.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-app.js" + $verstion,
                _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                _cmpPath + "/js/cmp-picker.js" + $verstion,
                _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                _cmpPath + "/js/cmp-push.js" + $verstion,
                _cmpPath + "/js/cmp-server.js" + $verstion,
                _cmpPath + "/js/cmp-headerFixed.js" + $verstion,
                _cmpPath + "/js/cmp-search.js" + $verstion,
                _cmpPath + "/js/cmp-popPicker.js" + $verstion,
                _cmpPath + "/js/cmp-sliders.js" + $verstion,
                _cmpPath + "/js/cmp-tabChange.js" + $verstion,
                _cmpPath + "/js/cmp-visitingCard.js" + $verstion,
                ]
    });
    
  //jssdk其他
    LazyUtil.addLazyStack({
        "code" : "lazy_jssdk",
        "css" : [],
        "js" : [user_jssdk, cmporgnization_jssdk]
    });
}


//存储状态数据
function _storagePageData(){
    //这个页面没有缓存
}

/**
 * 加载数据
 */
function _initPageData(onDataReady){
        
        pageX.winParams = {
           "canEditWorkflow" : true,
           "cache_subfix" : "",//缓存后缀
           "WebviewEvent" : "",//多webview事件
           "edit" : false,//初始化状态
           "action" : "",//CopyWorkFlowLock.SUBMIT,// 提交操作
           "canBack" : true//是否可执行返回操作， === false表示不能执行返回
        }
        pageX.winParams = cmp.extend(true, pageX.winParams, cmp.href.getParam());
        
        //缓存加载
        window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
        
        //校验节点权限
        if(pageX.winParams.canEditWorkflow){
            _checkActionBtn();
        }
        
        if(onDataReady){
            onDataReady();
        }
};

/**
 * 校验节点权限
 */
function _checkActionBtn(){
    
    var subState = summaryBO["summary"].affairSubState;
    if(subState == "15" || subState == "16" || subState == "17" || summaryBO["summary"].canModify != 'true'){
        return;
    }
    
    var nodeActions = summaryBO.pageConfig.nodeActions;
    
    if (_hasWFAction(nodeActions, "AddNode")) {
        pageX.actions.push({
            "code" : "AddNode",
            "class":"see-icon-v5-common-adlot icon",
            "lable" : cmp.i18n("collaboration.page.lable.button.insertPeople")// 加签
        });
    }
    
    if (_hasWFAction(nodeActions, "JointSign")) {
        pageX.actions.push({
            "code" : "JointSign",
            "class":"see-icon-v5-common-that-countersign icon small",
            "lable" : cmp.i18n("collaboration.page.lable.button.assign")// 当前会签
        });
    }
    
    if (_hasWFAction(nodeActions, "RemoveNode")) {
        pageX.actions.push({
            "code" : "RemoveNode",
            "class":"see-icon-v5-common-sublot icon",
            "lable" : cmp.i18n("collaboration.page.lable.button.RemoveNode")// 减签
        });
    }
    
    if (_hasWFAction(nodeActions, "Infom")) {
        pageX.actions.push({
            "code" : "Infom",
            "class":"see-icon-v5-common-notify icon",
            "lable" : cmp.i18n("collaboration.page.lable.button.addInform")// 知会
        });
    }
}


function _initBackEvent(){
    
    cmp.backbutton();
    cmp.backbutton.push(_exeBack);
    
    //_$("#goBackBtn").addEventListener("tap", _exeBack);
}

function _exeBack(){
    
    if(pageX.wfState == "edit"){
        cmp.event.trigger("beforepageredirect", document);
    }
    
    if(pageX.winParams.edit && pageX.winParams.canBack !== false){
        //处理页面入口进入
        _goBack(true);
    }else{
        //普通页面
        _goBack("btnToBack");
    }
}

//返回
function _goBack(backNoCheck) {

    if(pageX.backLock){
        return;
    }
    pageX.backLock = true;
    
    var $hearderContainer = _$("#hearderContainer");
    if((backNoCheck===true) || !$hearderContainer || pageX.wfState == "view" || backNoCheck === "btnToBack"){
        
        var backEventName;
        if(backNoCheck !== true){
            
            backEventName = WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix
            summaryBO.backIndex = summaryBO.backIndex - 1;
            cmp.storage.save(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, cmp.toJSON(window.summaryBO), true);
        }else{
           //点完成执行返回
        }
        cmp.href.back(1, null, backEventName);
    }else{
        //这个分支暂时不走了
        //不能返回了，这个是用来屏蔽android返回按钮的
    }
}


// 页面布局
function _fillPage() {

     //国际化title
    _$("title").innerText = cmp.i18n("collaboration.page.lable.button.flow");
    
    var $hearderContainer = _$("#hearderContainer");
    if(pageX.winParams.canEditWorkflow && summaryBO.pageConfig.canDeal && pageX.actions.length > 0){
        
        if(pageX.winParams.edit){
            _createDealbtns();
        }
        
      //执行点击事件
        cmp("#footBtns").on("tap", "button", _exeAction);
    }else{
        $hearderContainer.remove();
        _$("#footBtns").remove();
    }
    
  //初始化流程
    var wfParams = {
            model : "customer",
            wfSelectorId : "colEditWfMainBody", //流程图容器ID
            canEdit : function(){
                return pageX.wfState == "edit";
            },
            beforDrawWf : function(jsonData){
                if(summaryBO["summary"].listType != "listSent") {
                    if(jsonData && jsonData.nodes) {
                        for(var i=0; i< jsonData.nodes.length; i++) {
                            jsonData.nodes[i].isHasten = false;
                        }
                    }
                }
                return jsonData;
            },
            onTriggerEdit : function(){
                if(pageX.showToast){
                    
                    //触发编辑
                    _createDealbtns();
                    
                    var $hearderContainer = _$("#hearderContainer");
                    if(hearderContainer.classList.contains("display_none")){
                        //显示完成按钮
                        hearderContainer.classList.remove("display_none");
                        _$("#editBtn", false, hearderContainer).addEventListener("tap", _editBtn);
                        _$("#colEditWfMainBody").style.top = "40px";
                    }
                    
                    LazyUtil.addLoadedFn("lazy_wf", function(){
                        pageX.wfDesigner.setInfoAtt("customerTap", void 0);
                    });
                    
                    pageX.showToast = false;
                  //拉横幅
                    var hHeight = 40;//_$("#hid").offsetHeight;
                    var toast = _$("#workflow_toast");
                    toast.style.top = hHeight + "px";
                    toast.classList.remove("display_none");
                    
                    setTimeout(function(){
                        function a(){
                            this.removeEventListener("webkitAnimationEnd", a);
                            this.remove();//自杀移除
                            a = null;
                        }
                        toast.addEventListener("webkitAnimationEnd", a, false); 
                        toast.classList.add("disappear");
                        toast = null;
                    }, 3000);
                }
            }
        }
    
        
    //催办等点击事件
    wfParams.customerTap = function(nodeInfo, typeName){
        
        if(nodeInfo.nodeID == 'end' || nodeInfo.nodeID == 'start'){
            return;
        }
        
        /*生成流程图时判断是否有复合节点*/
        if(typeName=="remindes") {
            _hastenNode(nodeInfo);
        } else {
            _nodeDetail(nodeInfo);
        }
    }
    
    _initWfDesigner(null, wfParams);
}

function _exeAction(e){
    
    var tCode = this.getAttribute("id");
    if(tCode == "AddNode"){
    	//协同加签前事件
    	var idMap = {
    		"summaryID" : summaryBO.summary.id,
    		"affairID" : summaryBO.summary.affairId
    	}
        var eventParams={
        	funName : "beforeDealaddnode",
        	data : idMap,
        	success : function(){
        		//加签
                pageX.wfDesigner.addNode();
        	},
        	error : function(){
        		
        	}
        }
        cmp.funProxy.getter(eventParams);
    }else if(tCode == "JointSign"){
        //会签
        pageX.wfDesigner.jointSign({
            "policyId" : summaryBO["currentPolicy"].id,
            "policyName" : summaryBO["currentPolicy"].name
        });
    }else if(tCode == "Infom"){
        //知会
        pageX.wfDesigner.inform();
    }else if(tCode == "RemoveNode"){
    	//协同减签前事件
    	var idMap = {
    		"summaryID" : summaryBO.summary.id,
    		"affairID" : summaryBO.summary.affairId
    	}
        var eventParams={
        	funName : "beforeDealdeletenode",
        	data : idMap,
        	success : function(){
        		//加签
        		pageX.wfDesigner.deleteNode();
        	},
        	error : function(){
        		
        	}
        }
        cmp.funProxy.getter(eventParams);
    }
}

/**
 * 点击编辑或完成
 */
function _editBtn(e){
    if(pageX.wfState == "view"){
        _createDealbtns();
        LazyUtil.addLoadedFn("lazy_wf", function(){
            pageX.wfDesigner.setInfoAtt("customerTap", void 0);
        });
    }else{
        
        cmp.event.trigger("beforepageredirect", document);
        
        //如果是编辑进来的直接返回
        if(pageX.winParams.edit && pageX.winParams.canBack !== false){
            _goBack(true);
        }else{
        	__toComment();
        }
    }
}

function __toComment(){
	//保留数据
	var pageParams = {
			"cache_subfix" : pageX.winParams.cache_subfix,
			"WebviewEvent" : pageX.winParams.WebviewEvent,
			"action" : CopyWorkFlowLock.SUBMIT//提交操作
	}
	cmp.href.go(_collPath + "/html/details/comment.html"+colBuildVersion, pageParams);
}

/**
 * @param _nodeInfo
 */
function _hastenNode(_nodeInfo) {
    //催办
    var hastenParam = {};
    
    hastenParam["app"] = 1;
    hastenParam["isAllHasten"] = "true";
    hastenParam["memberIds"] = "";
    hastenParam["affairId"] = summaryBO["summary"].affairId;
    hastenParam["activityId"] = _nodeInfo.nodeID;
    
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/details/remind.html"+colBuildVersion, hastenParam);
}

/**
 * @param _nodeInfo
 */
function _nodeDetail(_nodeInfo){
    
    var nodeMembers = _nodeInfo.nodeMembers;
    //判断复合节点
    if(_nodeInfo.partyType != 'user'){
        var param = {"summaryId" : summaryBO["summary"].id,"nodeId" : _nodeInfo.nodeID};
         //节点是否激活
        cmp.dialog.loading();
         $s.Coll.showNodeMembers(param,errorBuilder({
            success : function(result) {
                cmp.dialog.loading(false);
                if(result.data.length>0){
                	_nodeActive(result, _nodeInfo);
                } else {
                    _alert(cmp.i18n("collaboration.default.nodeActive"),null,cmp.i18n("collaboration.page.dialog.note"));
                }
            }
        }));
    } else if(_nodeInfo.partyType == 'user') {//人员卡片
		cmp.visitingCard(_nodeInfo.partyId);
    }
}

/**
 * @param result
 * @param _nodeInfo
 */
function _nodeActive(result,_nodeInfo){
    
    var paramData = {
        "summaryId" : summaryBO["summary"].id,
        "nodeId" : _nodeInfo.nodeID,
        "nodeMembers" : result,
        "affairId": summaryBO["summary"].affairId,
        "listType": summaryBO.openFrom,
        "finished": summaryBO["summary"].finished
    }
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/details/dealUser.html"+colBuildVersion, paramData);
}

/**
 * 动态创建dom
 */
function _createDealbtns(){
    
    if(pageX.hasInitEdit){
        return;
    }
    
    pageX.hasInitEdit = true;
    
    if(pageX.actions.length > 0){
        
        var btnHtml, $footer = _$("#footBtns");
        
        _$("#colEditWfMainBody").style.bottom = "44px";
        
        btnHtml = cmp.tpl(_$("#edit_btn_template").innerHTML, pageX.actions);
        $footer.innerHTML = btnHtml;
        $footer.classList.remove("display_none");
        
        pageX.wfState = "edit";
        _$("title").innerHTML = cmp.i18n("collaboration.page.lable.button.editwf");
    }
}

//是否显示某个权限
function _hasWFAction(ps, p){
  return CollUtils.isInArray(ps, p);
}/**
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
}