/*本页面不要使用Jquery*/

var pageX = {
        MAX_INPUT_LENGTH : 2000,
        actionType : "",//记录当前提交类型
        wfDesigner : null,
        currentAction : null,
        isLoading : false,
        attObj : null,
        cache : {
            "postData" : {
                "fileUrlIds":[], "fileJson" : "[]"
            },
            "tempAtt" : null,
            "isSubmitting" : false,//防止重复提交
            "noteList" : []//提交成功后，的提示信息
        },
        exeLock : false,
        isSpecifiesReturn : false,
        isFormDataLoaded : true,//校验表单数据是否加载成功， CAP4表单加载比较慢
        winHeight : 0,// 窗体的高度
        footerHeight : 50,// footer 高度
        otherContentHeight : 80// 整个页面布局， 除开正文其他区域的高度
}

var _pageObj = {};
var _storge_key = "";
var dataArea = "#mainBodyArea";

//操作和流程锁映射关系
var ACTION_LOCK_CODE = {
    "Return" : CopyWorkFlowLock.STEP_BACK,//回退
    "Terminate" : CopyWorkFlowLock.STEP_STOP,//终止
    "Cancel" : CopyWorkFlowLock.REPEAL_ITEM,//撤销
    "SpecifiesReturn" : CopyWorkFlowLock.SPECIFIES_RETURN,// 指定回退
    "Transfer" : CopyWorkFlowLock.TRANSFER,// 移交
    "Edit" :CopyWorkFlowLock.EDIT_CONTENT //修改正文
}

var actionI18n = {};


//重写cmp的loading组件
var cmpLoading = cmp.dialog.loading;
cmp.dialog.loading = function(status){
    
    if(status === false){
        pageX.isLoading= false;
        cmpLoading.apply(cmp.dialog, arguments);
    }else{
        if(pageX.isLoading !== true){
            cmpLoading.apply(cmp.dialog, arguments);
        }
        pageX.isLoading= true;
    }
}

//重写addEventListener



cmp.ready(function() {// 缓存详情页面数据
    
    _storge_key = CollCacheKey.summary.comment;
    _initBackEvent();
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        
        actionI18n = {
                "Forward" : cmp.i18n("collaboration.page.lable.button.forward"),//转发协同
                "Return" : cmp.i18n("collaboration.page.lable.button.return"),//回退
                "Terminate" : cmp.i18n("collaboration.page.lable.button.terminate"),//终止
                "Cancel" : cmp.i18n("collaboration.page.lable.button.cancel1"),//撤销
                "SpecifiesReturn" : cmp.i18n("collaboration.default.stepBack"),// 指定回退
                "Transfer" : cmp.i18n("collaboration.page.lable.button.transfer"),// 移交
                "Edit" : cmp.i18n("collaboration.page.lable.button.modifyContent")//修改正文
        }
        
        // 窗口的高度
        pageX.winHeight = window.innerHeight;
        
        _initPageData(function(){
            
            //注册缓加载
            _registLazy();
            
          //装载表单数据
            if("20" == summaryBO["summary"].bodyType){
                LazyUtil.addLoadedFn("lazy_form", function() {
                    
                    var optionsCache = {
                            moduleId : summaryBO["summary"].id,
                            rightId : summaryBO["summary"].rightId,
                            viewState: summaryBO._viewState,
                            operateType : summaryBO._viewState,
                            callback : function(ret){
                                if(ret){
                                    pageX.isFormDataLoaded = true;
                                }else{
                                    _alert("fail to load form data, please go back and try again.");
                                }
                            }
                    }
                   if(summaryBO.content.isCAP4){
                       cmp.sui.ready(function(){
                           cmp.sui.loadFormDataFromCache(optionsCache);
                           optionsCache = null;
                       });
                   }else{
                       cmp.sui.loadFormDataFromCache(optionsCache);
                   }
                });
            }
            
            _fillPage();
            
            // 启动缓加载
            LazyUtil.startLazy();
            
            document.addEventListener('beforepageredirect', function(e){ 
                _storePageObj();
            });
            
            //清空缓存
            document.addEventListener('deletesessioncache', function(e){
               try{
                    //删除协同缓存
                   CollCacheKey.delCacheKeys(CollCacheKey.summary, pageX.winParams.cache_subfix);
                    
                    var options = { 
                            moduleId:summaryBO["summary"].id,
                            rightId:summaryBO["summary"].rightId,
                            viewState: summaryBO._viewState,
                            operateType : summaryBO._viewState
                    }
                    cmp.sui.clearCache(options);
                    
                    //刷新协同列表
                    setListViewRefresh("true");
                    
                    if(cmp.platform.CMPShell){
                        
                        //触发刷新壳数据
                        cmp.webViewListener.fire({ 
                            type: 'com.seeyon.m3.ListRefresh', 
                            data: {affairid: summaryBO["summary"].affairId}
                        });
                    }
                }catch(e){}
            });
            
            LazyUtil.addLoadedFn("lazy_cmp", function() {
                // cmp.HeaderFixed("#hid", document.querySelector("#content"));
                cmp.description.init(document.querySelector("#content"));
            });
            
            cmp.event.orientationChange(function(res){
                /*if(res == "landscape"){ //横屏
                
                }else if(res == "portrait"){ //竖屏
                    
                }*/
                pageX.winHeight = window.innerHeight;
                _setCommentDivHeight();
            });
            
            showContentCount();
            
        });
    },$verstion);
});


// 设置输入区域的高度
function _setCommentDivHeight(){
    
    // 7 为微调参数
    _$("#comment_div").style.height = (pageX.winHeight - pageX.otherContentHeight + 7) + "px";
}

/** 注册缓存 **/
function _registLazy(){
    
    //附件
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp_attachment",
        "js" : [
            _cmpPath + "/js/cmp-att.js" + $verstion
         ]
    });
    LazyUtil.addLazyStack({
        "code" : "lazy_attachment",
        "depend" : "lazy_cmp_attachment",
        "dependModel" : "strong",
        "js" : [
             _common_v5_path + "/widget/SeeyonAttachment.s3js" + $verstion
         ]
    });
    
     //流程
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "js" : [ _wfPath + "/js/wf.js" + $verstion]
    });
    
    
    if(summaryBO["summary"].bodyType == "20"){
      //表单
        if(summaryBO.content.isCAP4){
            
            //标记CAP4表单数据未加载成功
            pageX.isFormDataLoaded = false;
            
            var _vendor_cap4_js_, 
                _app_cap4_js_, 
                _widget_cap4_js_, 
                _app_cap4_origin_js_,
                path;
            
            if(summaryBO.isLightForm === false){
                
                // CAP4展现原表单
                path = "origin";
                
                _app_cap4_origin_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/out-config.js" + $verstion;
                
            }else{
                path = "native";
            }

            // 拼装CAP4 的资源地址
            _vendor_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/vendor.cap4Form.js" + $verstion;
            
            _widget_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/widget.cap4Form.js" + $verstion;
            _app_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/app.cap4Form.js" + $verstion;
            
            var _firstLoadJs = [];
            _firstLoadJs.push(_vendor_cap4_js_);
            _firstLoadJs.push(_cmpPath + "/js/cmp-webviewListener.js" + $verstion);
            
            if(_app_cap4_origin_js_){
                _firstLoadJs.push(_app_cap4_origin_js_);
            }
            
            // CAP4表单
            LazyUtil.addLazyStack({
                "code" : "lazy_vue",
                "groups" : "seeyon_form",
                "js" : _firstLoadJs
            });
            LazyUtil.addLazyStack({
                "code" : "lazy_cap4_widget",
                "depend" : "lazy_vue",
                "dependModel" : "strong",
                "groups" : "seeyon_form",
                "js" : [_widget_cap4_js_]
            });
            
            LazyUtil.addLazyStack({
                "code" : "lazy_form",
                "depend" : "lazy_cap4_widget",
                "dependModel" : "strong",
                "groups" : "seeyon_form",
                "css" : [],
                "js" : [
                        _app_cap4_js_,
                        _unflowform + "/unflowform_m_api.s3js" + $verstion,
                        _unflowform + "/js/deeFieldInit.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion],
            });
            
        }else{
            
            LazyUtil.addLazyStack({
                "code" : "lazy_vue",
                "groups" : "seeyon_form",
                "js" : [
                        _formPath + "/js/lib/vue/vue.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion,
                        _cmpPath + "/js/cmp-webviewListener.js" + $verstion
                        ]
            });
            LazyUtil.addLazyStack({
                "code" : "lazy_form",
                "depend" : "lazy_vue",
                "dependModel" : "strong",
                "groups" : "seeyon_form",
                "css" : [],
                "js" : [ 
                         _unflowform + "/unflowform_m_api.s3js" + $verstion,
                         _formPath + "/js/dataService.js" + $verstion, 
                         _formPath + "/js/sui.js" + $verstion
                        ]
            });
        }
        
        // 启动加载表单
        LazyUtil.startLazy("seeyon_form");
        
    } else{
        LazyUtil.addLazyStack({
            "code" : "lazy_content_other",
            "js" : [ 
                     _unflowform + "/unflowform_m_api.s3js" + $verstion, 
                     _cmpPath + "/js/cmp-webviewListener.js" + $verstion,
                     _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion 
                    ]
        });
    }
    
    // 添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_other_css",
        "css" : [
                  _wfPath + "/css/wf.css" + $verstion,
                  _newsPath + "/css/newsIssue.css" + $verstion,
                  _bulletinPath + "/css/bulIssue.css" + $verstion,
                  _docPath + "/css/doc.css" + $verstion,
                  _docPath + "/css/docNewPigeonhole.css" + $verstion,
                  
                  _cmpPath + "/css/cmp-listView.css" + $verstion, 
                  _cmpPath + "/css/cmp-accDoc.css" + $verstion, 
                  _cmpPath + "/css/cmp-selectOrg.css" + $verstion, 
                  _cmpPath + "/css/cmp-att.css" + $verstion, 
                  _cmpPath + "/css/cmp-audio.css" + $verstion, 
                  _cmpPath + "/css/cmp-search.css" + $verstion, 
                  _cmpPath + "/css/cmp-picker.css" + $verstion, 
                  _cmpPath + "/css/cmp-sliders.css" + $verstion, 
                  _cmpPath + "/css/cmp-list.css" + $verstion
                  ],
        "js" : []
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_main",
        "css" : [],
        "js" : [
                _cmpPath + "/js/cmp-flowV5.js" + $verstion,
                _cmpPath + "/js/cmp-listView.js" + $verstion
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "depend" : "lazy_main",
        "dependModel" : "strong",
        "css" : [],
        "js" : [
                 _cmpPath + "/js/cmp-zoom.js" + $verstion,
                 _cmpPath + "/js/cmp-accDoc.js" + $verstion,
                 _cmpPath + "/js/cmp-app.js" + $verstion,
                 _cmpPath + "/js/cmp-lbs.js" + $verstion,
                 _cmpPath + "/js/cmp-imgCache.js" + $verstion,
                 _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                 _cmpPath + "/js/cmp-picker.js" + $verstion,
                 _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                 _cmpPath + "/js/cmp-push.js" + $verstion,
                 _cmpPath + "/js/cmp-audio.js" + $verstion,
                 _cmpPath + "/js/cmp-server.js" + $verstion,
                 _cmpPath + "/js/cmp-headerFixed.js" + $verstion,
                 _cmpPath + "/js/cmp-description.js" + $verstion,
                 _cmpPath + "/js/cmp-search.js" + $verstion,
                 _cmpPath + "/js/cmp-popPicker.js" + $verstion,
                 _cmpPath + "/js/cmp-handWriteSignature.js" + $verstion,
                 _cmpPath + "/js/cmp-camera.js" + $verstion,
                 _cmpPath + "/js/cmp-sliders.js" + $verstion,
                 _cmpPath + "/js/cmp-tabChange.js" + $verstion,
                 _cmpPath + "/js/cmp-contentEdit.js" + $verstion,
                 _cmpPath + "/js/cmp-flexible.js" + $verstion,
                 _cmpPath + "/js/cmp-emoji.js" + $verstion,
                 
                 _deePath + "/js/formDevelopmentOfadv.js" + $verstion,
                 
                 _newsPath + "/js/newsIssue.js" + $verstion,
                 _bulletinPath + "/js/bulIssue.js" + $verstion,
                 _docPath + "/js/docNewPigeonhole.js" + $verstion,
                 _common_v5_path + "/widget/ContentEdit-debug.js" + $verstion
                 
           ]
    });
}

/*** 开始 ***/
function _fillPage(){
    
    var pageTitle = pageX.winParams.title || cmp.i18n("collaboration.page.lable.button.deal");
    _$("title").innerText = pageTitle;
    
    // _$("#title").innerText = pageTitle;
    _$("#content").setAttribute("placeholder", pageX.winParams.placeholder 
                                              || summaryBO.nodeDesc 
                                              || cmp.i18n("collaboration.page.info.inputOpinion"));

    //创建动态dom
    _creatDoms();
    
    //装载点赞
    _initLike();
    
    //处理按钮展现
    _initDealBtns();
    
  //加载附件相关信息
    loadAttachment();
    
    //装载常用语
    _initCommonPhrase();
    
    
  //操作按钮显示
    var $allBtns = _$("#allBtns"), 
        btns = ["#attachment_btn", "#likeBtn", "#phrasesBtn", "#atBtn"];
    for(var i = 0; i < btns.length; i++){
        var btn = _$(btns[i], false, $allBtns);
        if(btn && !btn.classList.contains("display_none")){
            $allBtns.classList.remove("display_none");
            pageX.otherContentHeight += 50;
            break;
        }
    }
    
    // 设置处理区域高度
    _setCommentDivHeight();
    
    
  //加载意见框
    _initContent();
    
    
    //装载数据
    CollUtils.fillDom(dataArea, pageX.cache.datas);
    
    //初始化开关
    LazyUtil.addLoadedFn("lazy_form", function() {
        var swContainer = _$("#switch_container");
        _initSwitch("hide", pageX.cache.postData.hide, swContainer);
        _initSwitch("tracking", pageX.cache.postData.tracking, swContainer);
        _initSwitch("Archive", pageX.cache.postData.Archive, swContainer);

        //增加事件 处理 开关按钮样式
        var liarr= _$(".iconRadioContainer li",true);
        for(var i = 0,len=liarr.length;i<len;i++){
            if(len == 2){//针对只有2个情况下的样式修改
                liarr[i].style.width = "calc(50% - 10px)";
            }
            cmp.event.click(liarr[i],function(e){
                var liarr1= _$(".iconRadioContainer li",true);
                var c = e.target.classList;
                for(var i1=0,len1=liarr1.length;i1<len1;i1++){
                    var c1 = liarr1[i1].classList;
                    if(c1.contains("iconRadioContainerlichecked")){
                        c1.remove("iconRadioContainerlichecked");
                    }

                }
                c.add("iconRadioContainerlichecked");
                _$("input",false,e.target).click();
            });

        }
    });
    
    
    _initWfDesigner({
        stepBackToTargetNode:function(theStepBackNodeId, submitStyle, isCircleBack, isWFTrace){
        	var param = new Object();
        	param["toNodeId"] = theStepBackNodeId;
        	param["submitStyle"] = submitStyle;
        	param["isCircleBack"] = isCircleBack;
        	param["isWFTrace"] = isWFTrace;
        	pageX.winParams.circleBackParam = param;
            exeSubmitData("actionStepBackToTargetNode", theStepBackNodeId, submitStyle, isCircleBack, isWFTrace);
        }
    },{
        model : "silent",//采用静默模式
        onTriggerEdit : function(){
            var c = _$("#workflow_dot").classList;
            if(c.contains("display_none"))
                c.remove("display_none");
        }
    });//加载流程数据
    
    if(pageX.cache.isSubmitting){
        cmp.notification.toast(cmp.i18n("collaboration.action.alreadySubmit"),"center");
    }
}

/**
 * 动态创建元素
 */
function _creatDoms(){
    
    
    if(pageX.isSpecifiesReturn){
        
        pageX.otherContentHeight += 40;
        
        var $specialDiv = _$("#specifiesReturn_div"); 
        //指定回退已选择:{0}
        $specialDiv.innerText =  cmp.i18n("collaboration.page.lable.specialSelected", [pageX.winParams.returnInfo.toNodeName]);
        $specialDiv.classList.remove("display_none");
        $specialDiv.addEventListener("tap", function(){
            pageX.wfDesigner.specifiesReturn(function(returnInfo, submitStyleName){
                pageX.winParams.returnInfo = returnInfo;
                _$("#specifiesReturn_div").innerText = cmp.i18n("collaboration.page.lable.specialSelected", [returnInfo.toNodeName]);
                _$("title").innerText = submitStyleName
                // _$("#title").innerText = submitStyleName;
            }, pageX.winParams.returnInfo);
        });
    }
    
    // 不等表单加载了
    _initActions();
    
    //加载态度
    _initAttitude();
}

/**
 * 初始化处理按钮
 */
function _initDealBtns(){

    var subState = summaryBO["summary"].affairSubState;
    
    if(pageX.cache.isSubmitting){
        return;
    }
    
    if(pageX.winParams.action == CopyWorkFlowLock.SUBMIT){
        
        var btnSize = 0;//按钮数量
        
        //指定回退状态
        if(subState != "17" && subState != "15"){
            
            var $zcdbBtn;
            
            if(summaryBO["currentPolicy"].id == "newsaudit"  
                || summaryBO["currentPolicy"].id == "bulletionaudit"){
                
                _$("#news_submitBtn").classList.remove("display_none");
                _$("#news_noPassBtn").classList.remove("display_none");
                btnSize += 2;
                
                LazyUtil.addLoadedFn("lazy_form", function() {
                    cmp.event.click(_$("#news_submitBtn"), function(){
                        exeSubmitData("actionSubmit")
                    });
                    cmp.event.click(_$("#news_noPassBtn"), function(){
                        exeSubmitData("actionTerminateSummary");
                    });
                });
                
                $zcdbBtn = _$("#news_zcdbBtn");
                
                _$("#submitBtn").remove();
                _$("#zcdbBtn").remove();
            }else{
                
                _$("#news_zcdbBtn").remove();
                _$("#news_submitBtn").remove();
                _$("#news_noPassBtn").remove();
                
                $zcdbBtn = _$("#zcdbBtn");
                
                var submitLable = "";
              //审核节点 ||核定节点
                if(summaryBO["currentPolicy"].id=="formaudit" || summaryBO["currentPolicy"].id=="vouch"){
                    if (summaryBO["currentPolicy"].id=="formaudit") {
                        _$("#auditNoBtn").innerText = cmp.i18n("collaboration.page.lable.button.formaudit")+cmp.i18n("collaboration.page.lable.button.nopass");//审核不通过
                        _$("#auditPassBtn").innerText = cmp.i18n("collaboration.page.lable.button.formaudit")+cmp.i18n("collaboration.page.lable.pass");//审核通过
                    }
                    var $auditNoBtn = _$("#auditNoBtn"),
                        $auditPassBtn = _$("#auditPassBtn");
                    
                    LazyUtil.addLoadedFn("lazy_form", function() {
                        cmp.event.click($auditNoBtn, function(){
                            if(summaryBO.inInSpecialSB){
                                _alert(cmp.i18n("collaboration.inSb.cannotsb"));
                                return;
                            }
                            //加锁
                            pageX.currentAction = CopyWorkFlowLock.STEP_BACK;
                            exeSubmitData("actionReturnSummary"); //不通过走回退逻辑
                        });
                        cmp.event.click($auditPassBtn, function(){
                            exeSubmitData("actionSubmit"); //通过走提交逻辑
                        });
                    });
                    
                    $auditNoBtn.classList.remove("display_none");
                    $auditPassBtn.classList.remove("display_none");
                    btnSize += 2;
                    
                }else {
                    if(_hasPermissions(summaryBO.pageConfig.nodeActions, "ContinueSubmit")){
                        LazyUtil.addLoadedFn("lazy_form", function() {
                            _$("#submitBtn").addEventListener("tap", _doSubmit);
                        });
                        _$("#submitBtn").classList.remove("display_none");
                    }
                }
            }
            
            //暂存待办
            if(_hasPermissions(summaryBO.pageConfig.nodeActions, "Comment") && subState != "16"){
                
                $zcdbBtn.classList.remove("display_none");
                btnSize += 1;
                
                //延迟绑定事件
                LazyUtil.lazyBindEven("lazy_form", $zcdbBtn, "tap", _doZcdb);
                //$zcdbBtn.addEventListener("tap", _doZcdb);
            }else{
                $zcdbBtn.remove();
            }
        }
        
        if(btnSize > 2){
            var $pageFooter = _$("#pageFooter");
            $pageFooter.classList.remove("btn_margin_r_20");
            $pageFooter.classList.add("btn_margin_r_5");
            $pageFooter.classList.add("more_btn");
        }
        
    }else{
        
      //重置按钮名称
        _$("#submitBtn").innerText = cmp.i18n("collaboration.page.lable.button.submit");
        
        //TODO 根据实际情况绑定不同的事件
        var actionName = "";
        if(pageX.winParams.action == CopyWorkFlowLock.STEP_BACK)
            actionName = "actionReturnSummary";
        else if(pageX.winParams.action == CopyWorkFlowLock.REPEAL_ITEM)
            actionName = "actionRepealSummary";
        else if(pageX.winParams.action == CopyWorkFlowLock.STEP_STOP)
            actionName = "actionTerminateSummary";
        else if(pageX.isSpecifiesReturn)
            actionName = "actionStepBackToTargetNode";
        else if(pageX.winParams.action == CopyWorkFlowLock.TRANSFER)
            actionName = "actionTransferSummary";
            
        //等表单加载完成后再绑定事件
        LazyUtil.addLoadedFn("lazy_form", function() {
            cmp.event.click(_$("#submitBtn"), function(){
                exeSubmitData(actionName);
            });
        });
        
        _$("#submitBtn").classList.remove("display_none");
        
    }
}

function showContentCount(){
    CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
}

/**
 * 加载意见框
 */
function _initContent(){
    
    var $content = _$('#content');
    
  //是否有意见框
    if(_hasPermissions(summaryBO.pageConfig.nodeActions, "Opinion")){
        $content.addEventListener('input', showContentCount);
        showContentCount();
        
        //TODO 是否根据情况加载at功能
        _initAtWho();
        
        _$("#comment_div").classList.remove("display_none");
        _$("#fontCount").classList.remove("display_none");
        
    }else{
        $content.value = "";
    }
}

/**
 * 加载常用语
 */
function _initCommonPhrase(){
    
  //常用语
    if(_hasPermissions(summaryBO.pageConfig.nodeActions, "Opinion") 
            && _hasPermissions(summaryBO.pageConfig.nodeActions, "CommonPhrase")){
        
        var $phrasesBtn = _$("#phrasesBtn"); 
        $phrasesBtn.classList.remove("display_none");
        
        $s.CommonPhrase.phrases({}, errorBuilder({
            success : function(result) {
                if(result && result.length > 0){
                    _$("#phrases_ul").innerHTML = cmp.tpl(_$("#phrases_template").innerHTML, result);
                    var clickMark = true;
                    cmp("#phrases_ul").on("tap", "li", function(){
                    	//防止暴力点击
                    	if(clickMark){
                            clickMark = false;
                            setTimeout(function(){
                                clickMark = true;
                            },700);
                            _$("#content").value = CollUtils.getTextDealComment("#content") + this.innerHTML;
                            _switchPhrases();
                            CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH); 
                        }
                    });
                }
            }
        }));
        
        var phrases_container = _$('#phrases_container');
        var header = phrases_container.querySelector('header');
        var navLeft = phrases_container.querySelector('#phrase_goback');
        var phrases_div = _$('#phrases_div');
        
        phrases_div.style.height = phrases_container.offsetHeight-header.offsetHeight+"px";
        
        //点击常用语
        $phrasesBtn.addEventListener('tap',function(){
            _switchPhrases();
        });
       
        //点击常用语弹出容器的回退按钮
        navLeft.addEventListener('tap',function(){
            _switchPhrases();
        });
    }
}

//常用语切换
function _switchPhrases(phrases_container){
    phrases_container = phrases_container || _$('#phrases_container');
    if(phrases_container.classList.contains('cmp-active')){
        phrases_container.classList.remove('cmp-active');
        cmp.backbutton.pop();
    }else{
        cmp.backbutton.push(_switchPhrases);
        phrases_container.classList.add('cmp-active');
        _$('#phraser').style.display = 'block';
    }
}

/**
 * 加载点赞
 */
function _initLike(){
    
    if(summaryBO["summary"].canPraise && _hasPermissions(summaryBO.pageConfig.nodeActions, "Opinion")){
        
        var likeBtn = _$("#likeBtn");
        
        if(pageX.cache.postData.likeSummary){
            likeBtn.classList.add("blue-color");
        }
        likeBtn.classList.remove("display_none");
        
        likeBtn.addEventListener('tap',function(){
            
            var thisClass = this.classList, method;
            
            if(pageX.cache.postData.likeSummary){
                method = "remove";
            }else{
                method = "add";
            }
            thisClass[method]("blue-color");
            
            pageX.cache.postData.likeSummary = !pageX.cache.postData.likeSummary;
         });
    }
}

/**
 * 初始化附件
 */
function loadAttachment(){
    
    var nodeActions = summaryBO.pageConfig.nodeActions;
    
    var showAuth = "";
    if(CollUtils.isInArray(nodeActions, "UploadAttachment") && CollUtils.isInArray(nodeActions, "UploadRelDoc")){
        showAuth = -1;
    }else if(CollUtils.isInArray(nodeActions, "UploadAttachment")){
        showAuth = 1;
    }else if(CollUtils.isInArray(nodeActions, "UploadRelDoc")){
        showAuth = 2;
    }
    
    var $attBtn = _$("#attachment_btn");
    if(showAuth !=""){
        $attBtn.classList.remove("display_none");
    }
    
  //需要等附件模块加载完成
    LazyUtil.addLoadedFn("lazy_attachment", function() {
        //附件组件
        var initParam = {
            showAuth : showAuth,
            uploadId : "picture",
            handler : "#attachment_btn",
            initAttData : pageX.cache.tempAtt,
            selectFunc : function(result){
                
                pageX.cache.postData.fileJson = cmp.toJSON(result);
                
                //展示附件数量
                _showAttNum(result.length);
            }
        }
        pageX.attObj = new SeeyonAttachment({initParam : initParam});
    });
}

/**
 * 展示附件数量
 */
function _showAttNum(num, $attBtn){
    
    $attBtn = $attBtn || _$("#attachment_btn");
    
    var text = "", color = "#A2ACC7";
    if(num > 0){
        text = num;
        color = "#3aadfb";
    }
    $attBtn.style.color = color;
    _$("#attCount").innerHTML = text;
}


/**
 * 初始化态度
 */
function _initAttitude(){
    var attitudeBtns = [];
    if(summaryBO.pageConfig.attitudeBtns != 3){
        if(summaryBO.pageConfig.attitudeBtns == 1){
            var att_readed = {
                    "lable" : cmp.i18n("collaboration.page.lable.att_readed"),//已阅
                    "value" : "collaboration.dealAttitude.haveRead"
                }
            att_readed.state = pageX.cache.postData["attitude"] == att_readed.value ? "on" : "off";
            attitudeBtns.push(att_readed);
        }
        var att_agree = {
                "lable" : cmp.i18n("collaboration.page.lable.att_agree"),//同意
                "value" : "collaboration.dealAttitude.agree"
            }
        att_agree.state = pageX.cache.postData["attitude"] == att_agree.value ? "on" : "off";
        attitudeBtns.push(att_agree);
        
        var att_disagree = {
                "lable" : cmp.i18n("collaboration.page.lable.att_disagree"),//不同意
                "value" : "collaboration.dealAttitude.disagree"
            }
        att_disagree.state = pageX.cache.postData["attitude"] == att_disagree.value ? "on" : "off";
        attitudeBtns.push(att_disagree);
    }
    
    if(attitudeBtns.length > 0){
        
        var $buttonList = _$("#button_list_nav");
        $buttonList.innerHTML = cmp.tpl(_$("#attitude_templage").innerHTML, attitudeBtns);
        $buttonList.style.display = "block";
        
        pageX.otherContentHeight += 70;

        //顶部按钮的切换点击
        cmp("#button_list_nav").on("tap", "li", function(){
            var $input = _$("input", false, this);
            pageX.cache.postData["attitude"] = $input.value;
        });
    }
}

//获取节点权限
function _initActions() {

    if(pageX.cache.isSubmitting){
        return;
    }
    
  var nodeActions = summaryBO.pageConfig.nodeActions;
  var affairSubState = summaryBO["summary"].affairSubState;
  
  var switchs = [], buttons = [];
  
  //处理的时候才有更多选项
  if(pageX.winParams.action == CopyWorkFlowLock.SUBMIT){
      
      if(!summaryBO.isHaveNewColl){
          delete actionI18n["Forward"];
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
      
    //只有office格式的正文才能修改正文且只有CMP壳才能修改正文
      if(!summaryBO.content 
              || !summaryBO.canEditContent
              || summaryBO["summary"].bodyType == "20"
              || summaryBO["summary"].bodyType == "45"
              || !summaryBO.content.fileId 
              || !CollUtils.isCMPShell()){
      	delete actionI18n["Edit"];
      }
      
      for(var i = 0, len = summaryBO.pageConfig.advanceActions.length; i < len; i++){
          var action = summaryBO.pageConfig.advanceActions[i];
          if(actionI18n[action]){
              buttons.push({
                  "code" : action,
                  "lable" : actionI18n[action],
                  "type" : "button"
              });
          }
      }
      
      
      if(affairSubState != "15" 
          && affairSubState != "16" 
              && affairSubState != "17" 
                  && summaryBO["summary"].canModify == 'true'){
          
          //权限校验
          if ( _hasPermissions(nodeActions, "AddNode") 
                  || _hasPermissions(nodeActions, "JointSign")
                  || _hasPermissions(nodeActions, "RemoveNode")
                  || _hasPermissions(nodeActions, "Infom")) {
              
              //工作流相关
              var $wfBtn = _$("#workflow_btn");
              var settingBar = _$("#settingBar");
              if(settingBar.classList.length == 1){
                  settingBar.classList.remove("display_none");
              }
              $wfBtn.classList.remove("display_none");

              $wfBtn.addEventListener("tap", function(e){
                  
                  var pageParams = {
                          "cache_subfix" : pageX.winParams.cache_subfix,
                          "WebviewEvent" : WebEvents.M3_EVENT_COMMENT + pageX.winParams.cache_subfix,
                          "edit" : true
                      }
                      
                  cmp.event.trigger("beforepageredirect", document);
                  cmp.href.next(_collPath + "/html/details/workflowEdit.html"+colBuildVersion, pageParams);
              });
          }
      }
  }
  
  //指定回退
  if(!pageX.isSpecifiesReturn){
      
      //保证这三个按钮的顺序
      if (pageX.winParams.action == CopyWorkFlowLock.SUBMIT 
              && _hasPermissions(nodeActions, "Archive") 
              && summaryBO["summary"].canArchive == "1") {
          
          switchs.push({
              "code" : "Archive",
              "lable" : cmp.i18n("collaboration.page.lable.button.archive1"),//归档
              "type" : "switch",
              "lable1" :cmp.i18n("collaboration.pighole.click"),//归档
          });
      }
      
      if (_hasPermissions(nodeActions, "Track")) {
          switchs.push({
              "code" : "tracking",
              "lable" : cmp.i18n("collaboration.page.lable.button.track"),//跟踪
              "type" : "switch"
          });
      }
      
      if(summaryBO["summary"].bodyType != "20"
          && _hasPermissions(nodeActions, "Opinion")){
          switchs.push({
              "code" : "hide",
              "lable" : cmp.i18n("collaboration.page.lable.hideComment"),// 隐藏意见
              "type" : "switch"
          });
      }
  }
  var state1 =false;
  var state2 =false;
  
  pageX.cache.postData.group=[];
  
  for(var i = 0 ,len = switchs.length;i<len;i++){
    if(switchs[i].type == "switch"){
        state1 = true;
        if(switchs[i].code == "Archive"){
            pageX.cache.postData.group.push({
             groupName:"",
             type:"text",
                items:[{
                         key:switchs[i].code,
                         name:switchs[i].lable,
                         name2:'<span style="color:#3aadfb">'+(pageX.cache.postData.archiveFullPath?pageX.cache.postData.archiveFullPath:switchs[i].lable1)+'</span>'
                 }]
            });
        }else{
            pageX.cache.postData.group.push({
             groupName:"",
             type:"switch",
            items:[{
                    key:switchs[i].code,
                    status:pageX.cache.postData[switchs[i].code]!=undefined?pageX.cache.postData[switchs[i].code]:0,
                    name:switchs[i].lable
                 }]
            });
        }
    }
  }
  
  pageX.otherContentHeight += 70;// margin高度
  
  // 意见影藏开关做特殊处理
  var hasOpinion = _hasPermissions(nodeActions, "Opinion");
  if(state1 || hasOpinion){
      
      var settings_btn = _$("#settings_btn");
      if(state1){
          // 按钮显示， 加快页面渲染
          var settingBar = _$("#settingBar");
          if(settingBar.classList.length == 1){
              settingBar.classList.remove("display_none");
          }
          settings_btn.classList.remove("display_none");
          pageX.otherContentHeight += 40;
      }
      
   // 意见要等表单加载完成后才能判断
      if(summaryBO["summary"].bodyType == "20" && hasOpinion){
          
          LazyUtil.addLoadedFn("lazy_form", function() {
              
              function _hasEditRightOfFlowDealOption(){
                  
                  var isFormFieldOption = cmp.sui.hasEditRightOfFlowDealOption();
                  if(!isFormFieldOption){
                      var btnBarClass = _$("#settings_btn").classList;
                      if(btnBarClass.contains("display_none")){
                          btnBarClass.remove("display_none");
                          pageX.otherContentHeight += 40;
                          
                       // 设置处理区域高度
                          _setCommentDivHeight();
                      }
                      pageX.cache.postData.group.push({
                          groupName:"",
                          type:"switch",
                         items:[{
                                 key: "hide",
                                 status : pageX.cache.postData["hide"] != undefined ? pageX.cache.postData["hide"] : 0,
                                 name: cmp.i18n("collaboration.page.lable.hideComment")// 隐藏意见
                              }]
                         });
                  }
              }
              
              if(summaryBO.content.isCAP4){
                  cmp.sui.ready(_hasEditRightOfFlowDealOption);
              }else{
                  _hasEditRightOfFlowDealOption();
              }
          });
      }
      
       cmp.event.click(settings_btn, function(){
          cmp.dialog.groupSheet(pageX.cache.postData.group, cmp.i18n("collaboration.button.close.label"),function(item){
              // console.log(item);
              for(var i1 = 0 ,len1= pageX.cache.postData.group.length;i1<len1 ;i1++){
                  if(item.key == "Archive" ){
                      if(pageX.cache.postData.group[i1].items[0].key == item.key){
                          selectArchive(i1);
                          break;
                      }
                  }else{
                      if(pageX.cache.postData.group[i1].items[0].key == item.key){
                          pageX.cache.postData.group[i1].items[0].status = item.status;
                          pageX.cache.postData[item.key] = item.status;
                          break;
                      }
                  }
              }
          },function(){
              
          })
       });
    }
  
  var btns=[];
  for(var i = 0 ,len = buttons.length; i<len; i++){
      if(buttons[i].type == "button"){
          state2=true;
          btns.push({
              key:buttons[i].code,
              name:buttons[i].lable
          });
      }
  }
  
  if(state2){
      //开关显示
      var $switcheBtn = _$("#switch_pop_btn"); 
      $switcheBtn.classList.remove("display_none");
      pageX.otherContentHeight += 40;
      // $switcheBtn.addEventListener('tap',switcheBtnAddListener);
      cmp.event.click($switcheBtn, function(){
            cmp.dialog.actionSheet(btns, cmp.i18n("collaboration.page.lable.button.cancel"), function(item) {
                _clickMenuBtnNew(item.key);
            });          
      });
  }else{
	  if(_$("#pageFooter")){
		  _$("#pageFooter").classList.add("only_btn");
	  }
  }
}

function switcheBtnAddListener(){
	  this.removeEventListener('tap',switcheBtnAddListener);
  }


//单击菜单
function _clickMenuBtnNew(tCode){
    pageX.currentAction = ACTION_LOCK_CODE[tCode];
    switch (tCode) {
    case "Forward":
        exeSubmitData("actionForward");
        break;
    case "Return":
        exeSubmitData("actionReturnSummary");
        break;
    case "Terminate":
        exeSubmitData("actionTerminateSummary");
        break;
    case "Cancel":
        exeSubmitData("actionRepealSummary");
        break;
    case "SpecifiesReturn":
        exeSubmitData("actionSpecifiesReturn");
        break;
    case "Transfer":
        exeSubmitData("actionTransferSummary");
        break;
    case "Edit":
        _editContent();
        break;
    default:
        break;
    }
}


/**
 * 切换开关
 */
function _initSwitch(code, value, container){
    
    var $switchs = container || _$("#switchs_ul"),
        sw = _$(".cmp-switch[switchcode='" + code + "']", false, $switchs);
    
    if(sw){
        var method, isActive = sw.classList.contains("cmp-active");
        if(isActive != value){
            if(value === true){
                method = "add";
            }else{
                method = "remove";
            }
            sw.classList[method]("cmp-active");
        }
    }
}

//装载数据
function _initPageData(onDataReady) {
    
    pageX.winParams = cmp.href.getParam();
    
    //缓存加载
    window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
    
    _storge_key = _storge_key + pageX.winParams.cache_subfix;
    var cacheData = CollUtils.loadCache(_storge_key, true);
    pageX.cache = cacheData || pageX.cache;
    
    //缓存不存在
    if(!cacheData){
        
        var nodeActions = summaryBO.pageConfig.nodeActions;
        
        if(_hasPermissions(nodeActions, "Opinion")){
            pageX.cache.postData.hide = !!summaryBO.draftComment.hide;
        }
        if(_hasPermissions(nodeActions, "Track")){
            pageX.cache.postData.tracking = !(summaryBO["trackProcess"] == "false");
        }
        if(_hasPermissions(nodeActions, "Archive") && summaryBO["summary"].canArchive == "1"){
            pageX.cache.postData.Archive = false;
        }
        
        //点赞
        pageX.cache.postData.likeSummary = !!summaryBO.draftComment.likeSummary;
        
        //初始化附件
        pageX.cache.tempAtt = summaryBO.draftComment.attachments;
        
        if(summaryBO.pageConfig.attitudeBtns != 3){
            if(summaryBO.pageConfig.attitudeBtns == 1 && summaryBO.pageConfig.defaultAttitude == 1){
                pageX.cache.postData.attitude = "collaboration.dealAttitude.haveRead";
            }else{
                pageX.cache.postData.attitude = "collaboration.dealAttitude.agree";
            }
        }
        
        pageX.cache.postData.attitude = summaryBO.draftComment.attitude || pageX.cache.postData.attitude;
        pageX.cache.postData.commentId = summaryBO.draftComment.commentId || void 0;
        //初始化进行缓存合并
        pageX.cache.datas = {
                content : summaryBO.draftComment.content || ""
        }
    }
    
    pageX.isSpecifiesReturn = (pageX.winParams.action == CopyWorkFlowLock.SPECIFIES_RETURN);
    
    if(onDataReady){
        onDataReady();
    }
}

//是否显示某个权限
function _hasPermissions(ps, p){
  return CollUtils.isInArray(ps, p);
}

function _initBackEvent(){
	
	cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    // _$("#goBackBtn").addEventListener("tap", _goBack);
}

//返回协同详细页面
function _goBackToSummary(){
    var backN = 1;
    if(window.summaryBO && summaryBO.backIndex){
        backN = summaryBO.backIndex;
    }
    _goBack(backN);
}

//返回
function _goBack(n) {
    
  //防止爆点
    if(pageX.exeLock){
        return;
    }
    pageX.exeLock = true;
    
    var backN = 1;
    if(typeof(n)!= 'undefined' && typeof(n) != 'object'){
        backN = n;
    }
    
    if(pageX.winParams.action != CopyWorkFlowLock.SUBMIT){
        WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, pageX.winParams["action"]);
    }

    summaryBO.backIndex = summaryBO.backIndex - backN;
    cmp.storage.save(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, cmp.toJSON(window.summaryBO), true);
    
    //保留数据
    cmp.event.trigger("beforepageredirect", document);
    cmp.href.back(backN, null,  pageX.winParams.WebviewEvent);
}

//处理成功后返回列表
function _gotoList(type){
    
    //触发删除缓存
    cmp.event.trigger("deletesessioncache", document);
    
    if(cmp.platform.CMPShell){
      //触发平台事件，用于刷新列表数据
        cmp.webViewListener.fire({
            type: "com.seeyon.m3.ListRefresh",
            data: {type: 'update'}
        });
        cmp.webViewListener.fire({
            type: "coll.ListRefresh",
            data: {refreshList: 'true'}
        });
    }
    
    _doSaveData4ListView(type);
    
    var backN = 1;
    if(window.summaryBO && summaryBO.backIndex){
        backN += summaryBO.backIndex;
    }
    cmp.href.back(backN);
}


function _storePageObj(){
    
    //临时附件
    if(pageX.attObj){
        pageX.cache.tempAtt = pageX.attObj.attObjArray;
    }
    
    pageX.cache.datas = CollUtils.formPostData(_$(dataArea));
    cmp.storage.save(_storge_key, cmp.toJSON(pageX.cache), true);
}

function _close(result, formSnMsg){
    
    if(typeof(result)!= 'undefined' && result["error_msg"]){
        _stopSubmitting();
        _alert(result["error_msg"]);
    }else {
        
        var len = pageX.cache.noteList.length, note, title;
        if(len > 0){
            note = pageX.cache.noteList.shift();
            if(note.code == "archiveNote"){
                title = cmp.i18n("collaboration.pighole.alert.archiveTitle");
            }
            _alert(note.msg, _close, title);
        }else{
            _gotoList(formSnMsg);
        }
    }
}


/**
 * 设置意见内容
 */
function _setCommentValue(v, setDom){
    
    if(setDom === true){
        _$("#content").value = v;
    }
    
  //发送请求之前
    var _commentold = CollUtils.getTextDealComment("#content");
    try{
    	var paramData = {};
    	var emojiUtil = cmp.Emoji();
    	pageX.cache.postData.content = emojiUtil.EmojiToString(_commentold);
    }catch(e){
    	pageX.cache.postData.content = _commentold;
    }
    
    //at信息
    pageX.cache.postData.atWhoSelected = _mergeAtWho(pageX.cache.postData.content)
}


/**
 * 执行数据提交
 * @param type
 */
function exeSubmitData(type){
    
    //校验表单数据是否加载成功
    if(!pageX.isFormDataLoaded){
        window.console && console.warn("the form data is not init");
        return;
    }
    
    
    // 点击太快，流程js还没有初始化完
    if(!pageX.wfDesigner || !pageX.wfDesigner.isInit()){
        return;
    }
    
    //重复提交校验
    if(pageX.cache.isSubmitting && pageX.actionType == type){
        console.warn("重复执行:" + type);
        return;
    }
    
    //其他参数
    var paramArgs = Array.prototype.slice.call(arguments, 1);
    
    var fnExecAction = function(){
    	//不同意时， 会有操作类型切换， 进行记录
        pageX.actionType = type;
        
        var actions = ["actionSubmit", "actionZcdb", "actionReturnSummary", 
                           "actionTerminateSummary", "actionRepealSummary", 
                           "actionStepBackToTargetNode", "actionSpecifiesReturn", 
                           "actionForward", "actionTransferSummary"];
        
        var backActions = ["actionReturnSummary", "actionTerminateSummary",
                             "actionRepealSummary", "actionStepBackToTargetNode", "actionSpecifiesReturn"];
        
        //需要确认态度的操作
        var confirmAttrActions = ["actionStepBackToTargetNode", "actionTerminateSummary", "actionReturnSummary"];
        
        if(CollUtils.isInArray(actions, type)){
            
            if(window[type]){
                
                if("actionZcdb" != type && "actionForward" != type){
                    
                    //处理时必须填写意见 
                    if(!!summaryBO.pageConfig.forceComment 
                            || (pageX.cache.postData.attitude == "collaboration.dealAttitude.disagree"
                                   && summaryBO.pageConfig.forceCommentWhenDisagree)
                            || (summaryBO.pageConfig.forceCommentWhenCancel && CollUtils.isInArray(backActions, type))) {
                        
                        if(_isCommentBlank()){
                            return;
                        }
                    }
                }
                
                
                
                //启动提交, 统一设置有问题， 比如核定选择后重新执行
                //_startSubmitting();
                
                //获取意见数据
                _setCommentValue();
                
               
                
                if(type == "actionSubmit"){
                	if(summaryBO.content && summaryBO.content.hasOffice && summaryBO.content.needSkipMainBody=="true"){
                		cmp.notification.confirm(cmp.i18n("collaboration.page.lable.hasOffice.dealTip"),function(e){ //e==1是/e==0 否
                	        if(e==1){ //是
                	            setTimeout(function(){
                	                window[type].apply(window, paramArgs);
                	                paramArgs = null;
                	            }, 50);
                	        }else{
                	        	return;  
                	        }
                	    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.lable.button.continue")], null, null, 0);
                	}else{
                		window[type].apply(window, Array.prototype.slice.call(arguments, 1));
                	}
                } else{
                	window[type].apply(window, paramArgs);
                }

            }else{
                _alert(cmp.i18n("collaboration.tip.noFunction") + type);
            }
        }else{
            _alert(cmp.i18n("collaboration.tip.unknownOperation") + type);
        }
    }
    
    if(summaryBO.editParam && !summaryBO.editParam.save){
    	cmp.notification.confirm(cmp.i18n("collaboration.content.modify.save"),function(e){ //e==1是/e==0 否
    		if(e==1){
    			_editContent(false);
	        }else{
	        	fnExecAction();
	        }
	    },null, [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
    }else{
    	fnExecAction();
    }
}

/**
 * 移交
 */
function actionTransferSummary(){
    
    CollUtils.mask(true);//添加蒙层
    
    _lockAction(function(lockRet){
        
        CollUtils.mask(false);//移除蒙层
        
        if(lockRet){
        	_checkAffairValid(function(checkRet) {
            	
            	if(!checkRet){
                    return;
                }
            	var user = summaryBO.currentUser;
            	
            	//选人界面调用
            	cmp.selectOrg("select_org_1_" + (new Date()).getTime(), {
            		"type":1,
            		"flowType" : 1,
            		"label" : ["dept","org","extP", "vjOrg"],
            		"directDepartment" : false,
            		"flowOptsChange" : true,
            		lightOptsChange : false,//轻表单模式选人
            		fillBackData:[],//初始化数据
            		jump:false,
            		excludeData:[{"id":user.id,"name":user.name,"type":"Member","disable":true}],
            		closeCallback: function(){
            			_stopSubmitting();
            		},
            		maxSize:1,
            		minSize:1,
            		accountID:"",
            		selectType:'member',
            		choosableType:["member"],
                    notSelectAccount:true,
                    notSelectSelfDepartment:true,
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
            });
        }
    });
}

/**
 * 执行移交
 * @param id 人员ID
 */
//移交回调 addby libing
function _exeTransfer(userId){
    _startSubmitting();
    function exeTransferSubmit(){
        if(userId){
			pageX.cache.postData.content = CollUtils.getTextDealComment("#content");
			pageX.cache.postData.affairId = summaryBO["summary"].affairId;
			pageX.cache.postData.transferMemberId = userId;
			
			//at信息
			pageX.cache.postData.atWhoSelected = _mergeAtWho(pageX.cache.postData.content)
			
			saveContentConfirm(function(modifyFlag){
				pageX.cache.postData.modifyFlag = modifyFlag;
    			$s.Coll.transfer({},pageX.cache.postData,errorBuilder({
    				success : function(result) {
    					_close(result);
    				},
    				error : function(){
    					_stopSubmitting();
    				}
    			}));
			},false);
        }else{
            _stopSubmitting();
        }
    }
    
    /*'该操作不能恢复，是否进行移交操作？*/
    var _cofirmHtml  = cmp.i18n("collaboration.page.notrollback.confirm.label", [cmp.i18n("collaboration.page.lable.button.transfer")]);
        
    cmp.notification.confirm(_cofirmHtml,function(e){ //e==1是/e==0 否
        if(e==1){ //是
            setTimeout(exeTransferSubmit, 50);
        }else{
            _stopSubmitting();
        }
    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,null,0);
    
}

/**
 * 转发
 */
function actionForward(){
    var pageParams = {
        "summaryId" : summaryBO["summary"].id,
        "affairId" : summaryBO["summary"].affairId,
        "defPolicy" : summaryBO["defPolicy"],
        'accountId':summaryBO["summary"].accountId,
        "cache_subfix" : pageX.winParams.cache_subfix,
        "WebviewEvent" : WebEvents.M3_EVENT_COMMENT + pageX.winParams.cache_subfix,
        //"backIndex" : summaryBO.backIndex + 1,
        "parentX":{
            "openFrom": "summary"
        }};

    //待发的时候转发协同该属性引起报错 跳转回来的时候重新加载页面加载上该属性。
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion, pageParams);
}

/**
 * 手动调用指定回退
 */
function actionSpecifiesReturn(){
	var idMap = {
		"summaryID" : summaryBO.summary.id,
		"affairID" : summaryBO.summary.affairId
	}
   	
	//校验ctp_affair
    _checkAffairValid(function(checkRet) {
    	
    	if(!checkRet){
            _stopSubmitting();
            return;
        }
    	
    	 //指定回退前事件
        var eventParams={
            funName : "beforeDealspecifiesReturn",
            data : idMap,
            success : function(){
                pageX.wfDesigner.specifiesReturn(function(returnInfo, submitStyleName){
                    exeSubmitData("actionStepBackToTargetNode",returnInfo.toNodeId, returnInfo.submitStyle, returnInfo.isCircleBack);
                });
            },
            error : function(){
                
            }
        }
    	cmp.funProxy.getter(eventParams);
    });
}

/**
 * 环形流程指定回退
 */
function actionStepBackToTargetNode(theStepBackNodeId, submitStyle, isCircleBack, isWFTrace) {

    //在常用设置的
    if(!theStepBackNodeId && pageX.isSpecifiesReturn){
        
        var returnInfo = pageX.winParams.returnInfo;
        
        theStepBackNodeId = returnInfo.toNodeId;
        submitStyle = returnInfo.submitStyle;
        isCircleBack = returnInfo.isCircleBack;
    }
    
    if(pageX.winParams.circleBackParam){
    	var circleBackParam = pageX.winParams.circleBackParam;
        
        theStepBackNodeId = circleBackParam.toNodeId;
        submitStyle = circleBackParam.submitStyle;
        isCircleBack = circleBackParam.isCircleBack;
    }
     //设定状态
    _startSubmitting();
    
    var jsonSubmitCallBack = function() {
    	saveContentConfirm(function(modifyFlag){
    		var params = {};
    		pageX.cache.postData["workitemId"] = summaryBO["summary"].affairWorkitemId;
    		pageX.cache.postData["processId"] = summaryBO["summary"].processId;
    		pageX.cache.postData["caseId"] = summaryBO["summary"].caseId;
    		pageX.cache.postData["activityId"] = summaryBO["summary"].activityId;
    		pageX.cache.postData["affairId"] = summaryBO["summary"].affairId;
    		pageX.cache.postData["summaryId"] = summaryBO["summary"].id;
    		pageX.cache.postData["submitStyle"] = submitStyle;
    		pageX.cache.postData["theStepBackNodeId"] = theStepBackNodeId;
    		pageX.cache.postData["isCircleBack"] = isCircleBack;
    		
    		pageX.cache.postData["modifyFlag"] = modifyFlag;
    		$s.Coll.updateAppointStepBack({},pageX.cache.postData,errorBuilder({
    		    success: function(result){
    	            if(result["error_msg"]){
    	                //设置解锁
    	                pageX.currentAction = ACTION_LOCK_CODE["SpecifiesReturn"]
    	                _stopSubmitting();
    	                _alert(result["error_msg"], _gotoList);//提示
    	            }else{
    	            
    	                //环形回退的时候删除归档的提示，因为真正的归档
        	            var len = pageX.cache.noteList.length;
        	            for(var n = len-1 ; n >=0; n--){
                    		var note = pageX.cache.noteList[n];
                    		if(note.code == "archiveNote"){
                        		pageX.cache.noteList.splice(n, 1);
                        		break;
                    		}
                		}
    	                _close();
    	            }
    	        }
    		}))
    	},false);
    };
    
   
    var _sub = function (){
    	if("20" == summaryBO["summary"].bodyType){
            var fromSubmitBack = function () {
                var options = {
                        moduleId:summaryBO["summary"].id,
                        needCheckRule:false,
                        checkNull : false,
                        notSaveDB:false,
                        rightId:summaryBO["summary"].rightId,
                        needSn : false
                }
                _formSubmit(options,jsonSubmitCallBack);
            }
            //先表单高级开发数，再预提交
            if(summaryBO.deeReadOnly == "1") {
                fromSubmitBack();
            } else {
                //表单开发高级
                formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,summaryBO["summary"].affairId,"stepstop",CollUtils.getTextDealComment("#content"),null,fromSubmitBack);
            }
        }else{
            jsonSubmitCallBack();
        }     
    }
    
    if(submitStyle == "0"){
        if(isWFTrace == null || typeof isWFTrace === "undefined"){
            //流程重走
            confirmOptAndWFTrace(_sub, "SpecifiesReturn");
        }else{
            pageX.cache.postData["isWFTrace"] = isWFTrace;
            confirmOptAndWFTrace(_sub, "SpecifiesReturn");
        }
    }else{
        pageX.cache.postData["isWFTrace"] = "0";
        ifConfirmOptAndWFTrace(_sub, "SpecifiesReturn",false);
    }
 }
//弹出确认操作和流程追述的对话框 -是否弹出追溯框
 function ifConfirmOptAndWFTrace(callBackFn, action,receiptFlag){
     var actionLable = actionI18n[action];
     var _cofirmHtml = "";
     var attitude = pageX.cache.postData.attitude;
     var haveReadCheck ;
     var agreeCheck ;
     var disagreeCheck;
     _cofirmHtml = cmp.i18n("collaboration.page.again.confirm.attitude.label")+"</br>";
     if("Cancel" != action && attitude != "collaboration.dealAttitude.disagree" && summaryBO.pageConfig.attitudeBtns != 3){
         if(attitude == "collaboration.dealAttitude.haveRead"){
             haveReadCheck = 'checked="checked"';
         }else if(attitude == "collaboration.dealAttitude.agree"){
             agreeCheck = 'checked="checked"';
         }else{
             disagreeCheck =  'checked="checked"';
         }

         /*请再次确认处理方式:</br>已阅 同意 不同意*/
         if(attitude != "collaboration.dealAttitude.disagree"){ //当态度为"不同意"不进行态度确认

             _cofirmHtml += "<span id='attitudeSpan' class='trace_span' style='color:#3aadfb;margin: 5px 0px 10px 0px;' >";
             if(summaryBO.pageConfig.attitudeBtns == 1){
                 _cofirmHtml+='<input id="haveRead" name="confirm_attitude" style="color:#3aadfb" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.haveRead" '+haveReadCheck+' >'+cmp.i18n("collaboration.page.lable.att_readed");
             }
             _cofirmHtml+='<input id="agree" name="confirm_attitude" style="color:#3aadfb" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.agree" '+agreeCheck+'>' +cmp.i18n("collaboration.page.lable.att_agree");
             _cofirmHtml+='<input id="disagree" name="confirm_attitude" style="color:#3aadfb" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.disagree" '+disagreeCheck+' >' +cmp.i18n("collaboration.page.lable.att_disagree") + '</span></br>';
         }
     }


     /*'该操作不能恢复，是否进行回退\撤销操作？*/
     _cofirmHtml += cmp.i18n("collaboration.page.notrollback.confirm.label", [actionLable])+"<br>";
     if(receiptFlag){
         //添加追溯流程判断
         var canTrackWorkflow = summaryBO.canTrackWorkflow;
         if(canTrackWorkflow == "1"){
             //模板设置成跟踪
             /*'该操作不能恢复，是否进行回退操作？<br>流程追溯';*/
             _cofirmHtml += "<span class='trace_span'>" +cmp.i18n("collaboration.page.wftrace.label");
             _cofirmHtml +='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" checked disabled class="select-put cmp-checkbox2">' + '</span>';
         }else if(canTrackWorkflow == "2"){
             /*'该操作不能恢复，是否进行回退操作？<br>流程追溯';*/
             _cofirmHtml +=  "<span class='trace_span'>" +cmp.i18n("collaboration.page.wftrace.label");
             _cofirmHtml+='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" disabled class="select-put cmp-checkbox2">' + '</span>';
         }else{
             /*'该操作不能恢复，是否进行回退操作？<br>流程追溯';*/
             _cofirmHtml +=   "<span class='trace_span'>" +cmp.i18n("collaboration.page.wftrace.label");
             _cofirmHtml+='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" class="select-put cmp-checkbox2">' + '</span>';
         }
     }
     cmp.dialog.loading(false);
     cmp.notification.confirm(_cofirmHtml,function(e,closeObj){ //e==1是/e==0 否

         var closeConfirm = closeObj.closeFunc;
         var isWfTrace = document.querySelector("#isWFTrace");
         pageX.cache.postData["isWFTrace"] = isWfTrace && isWfTrace.checked  ? "1" : "0";
         if(e==1){ //是
             if(receiptFlag && "Cancel" != action && attitude != "collaboration.dealAttitude.disagree" && summaryBO.pageConfig.attitudeBtns != 3){
                 var rv = _$("input[name='confirm_attitude']:checked").value;
                 pageX.cache.postData.attitude = rv;
             }
             var attInputs = _$("input", true, _$("#button_list_nav"));
             for(var i = 0, len = attInputs.length; i < len; i++){
                 if(attInputs[i].value == rv){
                     attInputs[i].checked = true;
                 }
             }
             //后续如果还有confirm框，比如修改正文后确认，会有问题
             closeConfirm();
             setTimeout(callBackFn, 50);
             cmp.dialog.loading();
         } else{
             closeConfirm();
             _stopSubmitting();
         }
     }, cmp.i18n("collaboration.page.dialog.note2"), [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,true,0);
 }
/**
 * 弹出确认操作和流程追述的对话框
 * @param callBackFn
 */

function confirmOptAndWFTrace(callBackFn, action){
    ifConfirmOptAndWFTrace(callBackFn,action,true);
}



//提交回调函数
function actionSubmit() {
    _dealSubmitFunc();
}


//暂存
function actionZcdb(){
    //设定状态
    _startSubmitting();
    
	//暂存待办前事件
	var idMap = {
		"summaryID" : summaryBO.summary.id,
		"affairID" : summaryBO.summary.affairId
	}
    var eventParams={
    	funName : "beforeDealSaveWait",
    	data : idMap,
    	success : function(){
    		_checkAffairValid(function(checkRet){
    	        if(!checkRet){
    	            _stopSubmitting();
    	            return;
    	        }
	            var doZCDB = function(){
                    saveContentConfirm(function(modifyFlag){
                        var str_params = pageX.wfDesigner.getDatas();
                        str_params.colSummaryData = {"modifyFlag":modifyFlag};
                        pageX.cache.postData._json_params = cmp.toJSON(str_params);
                        $s.Coll.doZCDB(summaryBO["summary"].affairId, {}, pageX.cache.postData, errorBuilder({
                            success : function(result) {
                                if(result["error_msg"]){
                                    _stopSubmitting();
                                    _alert(result["error_msg"]);
                                }else {
                                    if(window.summaryBO.signatureId){
                                        var params={"signatureId":window.summaryBO.signatureId,
                                                "documentId":summaryBO["summary"].id};
                                        $s.Signet.updateIsignatureDocumentId({},params, errorBuilder({
                                            success : function(ret){
                                                _gotoList("actionZcdb");
                                            }
                                        }));
                                    }else{
                                        _gotoList("actionZcdb");
                                    }
                                }
                            }
                        }));
                    },true);
                }
	            
	            if("20" == summaryBO["summary"].bodyType){
	                
	                var fromSubmitBack = function () {
	                    var options = {
	                        moduleId:summaryBO["summary"].id,
	                        checkNull : false,
	                        needCheckRule:false,
	                        needCheckRepeatedRecord : true,
	                        notSaveDB:false,
	                        rightId:summaryBO["summary"].rightId,
	                        needSn : false
	                    }
	                    _formSubmit(options,doZCDB, function(){
	                        _stopSubmitting();
	                    });
	                }
	                
	                //先表单高级开发数，再预提交
	                if(summaryBO.deeReadOnly == "1") {
	                    fromSubmitBack();
	                } else {
	                    //表单开发高级
	                    formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,summaryBO["summary"].affairId,"collaboration.dealAttitude.dealSaveWait",CollUtils.getTextDealComment("#content"),null,fromSubmitBack);
	                }
	            }else{
	                doZCDB();
	            }
    	            
    	    });
    	},
    	error : function(){
    		_stopSubmitting();
    	}
    }
    cmp.funProxy.getter(eventParams);
}

/**
 * 执行撤销
 */
function actionRepealSummary(){
    //设定状态
    _startSubmitting();
    
    var idMap = {
		"summaryID" : summaryBO.summary.id,
		"affairID" : summaryBO.summary.affairId
	}
    //协同撤销前事件
    var eventParams={
    	funName : "beforeDealCancel",
    	data : idMap,
    	success : function(){
    		_lockAction(function(lockRet){
    	        if(lockRet){
    	        	//校验ctp_affair
                    _checkAffairValid(function(checkRet) {
                    	
                    	if(!checkRet){
            	            _stopSubmitting();
            	            return;
            	        }
    	        	
                    	confirmOptAndWFTrace(function(){
                    	    
                    	    function _beforeRepeal(){
                                
                                var workflowCheckParam = {
                                    event : "BeforeCancel",
                                    callback : function(flag) {
                                        if (flag) {
                                            
                                            // 撤销
                                            saveContentConfirm(function(modifyFlag) {
                                                var executeRepeal = function() {
                                                    pageX.cache.postData.modifyFlag = modifyFlag;
                                                    $s.Coll.repeal(summaryBO["summary"].affairId, {},
                                                            pageX.cache.postData, errorBuilder({
                                                                success : function(result) {
                                                                    if (result["error_msg"]) {
                                                                        _stopSubmitting();
                                                                        _alert(result["error_msg"]);
                                                                    } else {
                                                                        _gotoList();
                                                                    }
                                                                }
                                                            }));
                                                }

                                                if (summaryBO.deeReadOnly == "1") {
                                                    executeRepeal();
                                                } else {
                                                    // 表单开发高级
                                                    formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,
                                                            summaryBO["summary"].affairId, "repeal", CollUtils
                                                                    .getTextDealComment("#content"), null,
                                                            executeRepeal);
                                                }

                                            }, false);

                                        } else {
                                            _stopSubmitting_workflow();
                                        }
                                    },
                                    formAppId : summaryBO.workflowCheckParam.formAppId,
                                    formViewOperation : summaryBO.workflowCheckParam.formViewOperation
                                };
                                 pageX.wfDesigner.executeWorkflowBeforeEvent(workflowCheckParam);
                            }
                            
                            //表单预提交
                            if ("20" == summaryBO["summary"].bodyType) {// 表单回退前保存数据
                                var options = {
                                    moduleId : summaryBO["summary"].id,
                                    needCheckRule : false,
                                    checkNull : false,
                                    needCheckRepeatedRecord : true,
                                    notSaveDB : true,
                                    rightId : summaryBO["summary"].rightId,
                                    needSn : false
                                }
                                _formSubmit(options, _beforeRepeal);
                            } else {
                                _beforeRepeal();
                            }
                            
                    	}, "Cancel");
                   });
    	        }
    	    });
    	},
    	error : function(){
    		_stopSubmitting();
    	}
    }
    cmp.funProxy.getter(eventParams);
}

/**
 * 执行终止
 */
function actionTerminateSummary(){
     //设定状态
	 _startSubmitting();
	var idMap = {
		"summaryID" : summaryBO.summary.id,
		"affairID" : summaryBO.summary.affairId
	}
	//协同终止前事件
    var eventParams={
    	funName : "beforeDealstepstop",
    	data : idMap,
    	success : function(){
    	    
            _lockAction(function(lockRet){
                if(lockRet){
                	
                	//校验ctp_affair
                    _checkAffairValid(function(checkRet) {
                    	
                    	if(!checkRet){
            	            _stopSubmitting();
            	            return;
            	        }

                        ifConfirmOptAndWFTrace(function() {
                            
                            function _beforeTerminate(){
                                var workflowCheckParam = {
                                    event : "BeforeStop",
                                    callback : function(flag){
                                        if(flag){
                                            //终止协同
                                            var doTerminate = function(){
                                                saveContentConfirm(function(modifyFlag){
                                                    var pObj =  pageX.cache.postData;
                                                    pObj.caseId = summaryBO["summary"].caseId;
                                                    pObj.modifyFlag = modifyFlag;
                                                    $s.Coll.stepStop(summaryBO["summary"].affairId, {}, pObj, errorBuilder({
                                                        success : function(result) {
                                                            
                                                            if(result["error_msg"]){
                                                                _stopSubmitting();
                                                                _alert(result["error_msg"]);
                                                            }else {
                                                                _gotoList(); 
                                                            }
                                                        }
                                                    }));
                                                },false);
                                            }
                                            if("20" == summaryBO["summary"].bodyType){
                                                var fromSubmitBack = function () {
                                                    var options = {
                                                            moduleId:summaryBO["summary"].id,
                                                            needCheckRule:false,
                                                            checkNull : false,
                                                            notSaveDB:false,
                                                            rightId:summaryBO["summary"].rightId,
                                                            needSn : false
                                                    }
                                                    _formSubmit(options,doTerminate);
                                                }
                                                //先表单高级开发数，再预提交
                                                if(summaryBO.deeReadOnly == "1") {
                                                    fromSubmitBack();
                                                } else {
                                                    //表单开发高级
                                                    formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,summaryBO["summary"].affairId,"stepstop",CollUtils.getTextDealComment("#content"),null,fromSubmitBack);
                                                }
                                            }else{
                                                doTerminate();
                                            }
                                        }else{
                                            _stopSubmitting_workflow();
                                        }
                                    },
                                    formAppId : summaryBO.workflowCheckParam.formAppId,
                                    formViewOperation : summaryBO.workflowCheckParam.formViewOperation
                                };
                                pageX.wfDesigner.executeWorkflowBeforeEvent(workflowCheckParam);
                            }
                            
                          //表单预提交
                            if ("20" == summaryBO["summary"].bodyType) {// 表单回退前保存数据
                                var options = {
                                    moduleId : summaryBO["summary"].id,
                                    needCheckRule : false,
                                    needCheckRepeatedRecord : true,
                                    notSaveDB : true,
                                    checkNull : false,
                                    rightId : summaryBO["summary"].rightId,
                                    needSn : false
                                }
                                _formSubmit(options, _beforeTerminate);
                            } else {
                                _beforeTerminate();
                            }
                            
                        }, "Terminate",false);
                    });
                }
            });
    	},
    	error : function(){
    		_stopSubmitting();
    	}
    }
    cmp.funProxy.getter(eventParams);
}

/**
 * 回退协同
 */
function actionReturnSummary(){
    //设定状态
    _startSubmitting();
    
	var idMap = {
		"summaryID" : summaryBO.summary.id,
		"affairID" : summaryBO.summary.affairId
	}
	//协同回退前事件
    var eventParams={
    	funName : "beforeDealstepback",
    	data : idMap,
    	success : function(){
    		//加锁
    	    _lockAction(function(lockRet) {
                if (lockRet) {
                    //校验ctp_affair
                    _checkAffairValid(function(checkRet) {
                        
                        if(!checkRet){
                            //校验不通过
                            _stopSubmitting();
                            return;
                        }
                        
                        //校验流程是否能回退
                        transStepBackValid(function(checkRet) {
                            
                            if(!checkRet){
                              //流程校验不通过
                                _stopSubmitting();
                                return;
                            }
                            
                            confirmOptAndWFTrace(function(){
                                
                                setTimeout(function(){
                                    
                                  //流程高级事件
                                    function _beforeStepBack(){
                                        pageX.wfDesigner.executeWorkflowBeforeEvent({
                                            event : "BeforeStepBack",
                                            formAppId : summaryBO.workflowCheckParam.formAppId,
                                            formViewOperation : summaryBO.workflowCheckParam.formViewOperation,
                                            callback : function(flag) {
                                                
                                                if(!flag){
                                                    //高级事件不通过
                                                    _stopSubmitting();
                                                    return;
                                                }
                                                
                                                //DEE执行回调
                                                function _doStepBack(){
                                                    // 回退协同
                                                    saveContentConfirm(function(modifyFlag) {
                                                        
                                                        //真正执行回退事件了, 保存表单数据后执行
                                                        function _finalStepBack(){
                                                            pageX.cache.postData.modifyFlag = modifyFlag;
                                                            $s.Coll.stepBack(summaryBO["summary"].affairId, {},
                                                                    pageX.cache.postData, errorBuilder({
                                                                        success : function(result) {
                                                                            if (result["error_msg"]) {
                                                                                _stopSubmitting();
                                                                                _alert(result["error_msg"]);
                                                                            } else {
                                                                                _gotoList();
                                                                            }
                                                                        }
                                                                    }));
                                                        }
                                                        
                                                        //保存表单数据
                                                        if ("20" == summaryBO["summary"].bodyType) {// 表单回退前保存数据
                                                            var options = {
                                                                moduleId : summaryBO["summary"].id,
                                                                needCheckRule : false,
                                                                checkNull :false,
                                                                needCheckRepeatedRecord : true,
                                                                notSaveDB : false,
                                                                rightId : summaryBO["summary"].rightId,
                                                                needSn : false
                                                            }
                                                            _formSubmit(options, _finalStepBack);
                                                        } else {
                                                            _finalStepBack();
                                                        }
                                                        
                                                    }, false);
                                                }
                                                
                                                //执行DEE事件
                                                if (summaryBO.deeReadOnly == "1") {
                                                    _doStepBack();
                                                } else {
                                                    // 表单开发高级
                                                    formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType, summaryBO["summary"].affairId,
                                                            "stepBack", CollUtils.getTextDealComment("#content"), null, _doStepBack);
                                                }
                                            }
                                        });
                                    }
                                    
                                    //表单预提交
                                    if ("20" == summaryBO["summary"].bodyType) {// 表单回退前保存数据
                                        var options = {
                                            moduleId : summaryBO["summary"].id,
                                            needCheckRule : false,
                                            checkNull : false,
                                            needCheckRepeatedRecord : true,
                                            notSaveDB : true,
                                            rightId : summaryBO["summary"].rightId,
                                            needSn : false
                                        }
                                        _formSubmit(options, _beforeStepBack);
                                    } else {
                                        _beforeStepBack();
                                    }
                                    
                                },50);
                            }, "Return") ;
                        });
                    });
                }
    	    });
    	},
    	error : function(){
    		_stopSubmitting();
    	}
    }
    cmp.funProxy.getter(eventParams);
}

function _dealSubmitFunc(){
	//是否弹出 不同意的
    if(pageX.cache.postData.attitude == "collaboration.dealAttitude.disagree"){ //当态度为"不同意"时做的一些判断
        
    	if(summaryBO["currentPolicy"].id != "newsaudit" && summaryBO["currentPolicy"].id != "bulletionaudit"){
    		var optionalActions = summaryBO.pageConfig.customAction.optionalAction || "";
    		var defaultAction = summaryBO.pageConfig.customAction.defaultAction || "";
    		var subState = summaryBO["summary"].affairSubState;
        	
    		var actionLable = {
    		        "Continue" : cmp.i18n("collaboration.page.lable.button.continue"),
    		        "Return" : cmp.i18n("collaboration.page.lable.button.return"),
    		        "Terminate" : cmp.i18n("collaboration.page.lable.button.terminate"),
    		        "Cancel" : cmp.i18n("collaboration.page.lable.button.cancel1"),
    		        "SpecifiesReturn" : cmp.i18n("collaboration.workflow.operation.specialback")
    		}
    		var actionSort = ["Continue"];
    		if(subState != '15' && subState != '16' && subState !='17' && !summaryBO.inInSpecialSB) {
                actionSort.push("Return");
            }
    		actionSort = actionSort.concat(["Terminate","Cancel","SpecifiesReturn"])
    		
    		
    		var items = [];
    		var ops = optionalActions.split(",");
    		for(var i = 0; i < actionSort.length; i++){
    		    
    		    if(CollUtils.isInArray(ops, actionSort[i]) || actionSort[i] == defaultAction){
    		        var toAdd = false;
    		        if("Continue" == actionSort[i]){
    		            toAdd = true;
    		        }else if(_hasPermissions(summaryBO.pageConfig.nodeActions, actionSort[i])){
	                    toAdd = true;
    		        }
    		        if(toAdd){
    		            items.push({key:actionSort[i], name : actionLable[actionSort[i]]});
    		        }
    		    }
    		}
            
            //节点权限没有继续、回退、撤销、终止,系统不会弹出确认框，直接可以提交成功
            if (items.length > 0){ 
            	cmp.dialog.actionSheet(items, cmp.i18n("collaboration.page.lable.button.cancel"),function (data){
            		//from为： dealSummary 提交  returnSummary 回退 terminateSummary 终止 repealSummary 撤销
              		if (data.key== "Continue") {
              		  archivePigeonholeFn();
              		} else {
              		    pageX.currentAction = ACTION_LOCK_CODE[data.key];
              		    if (data.key == "Return") { //回退
              		        exeSubmitData("actionReturnSummary");
              		    } else if (data.key == "Terminate") { //终止
              		        exeSubmitData("actionTerminateSummary");
              		    } else if (data.key == "Cancel") { //撤销
              		        exeSubmitData("actionRepealSummary");
              		    }else if(data.key == "SpecifiesReturn"){//指定回退
              		    	exeSubmitData("actionSpecifiesReturn");
              		    }
              		} 
            	});
            } else {
                archivePigeonholeFn();
            }
    	}else{
    	    archivePigeonholeFn();
    	}
		
    } else {
        archivePigeonholeFn();
    }
}

/**
 * 提交协同
 */
function submitFunc() {
    // 设定状态
    _startSubmitting();

  
            // 发起人提交附言
            _checkAffairValid(function(checkRet) {
                if (checkRet) {

                    var doColfinish = function() {

                        pageX.cache.postData._json_params = cmp.toJSON(pageX.wfDesigner.getDatas());

                        saveContentConfirm(function(modifyFlag) {
                            var str_params = pageX.wfDesigner.getDatas();
                            str_params.colSummaryData = {
                                "modifyFlag" : modifyFlag
                            };
                            pageX.cache.postData._json_params = cmp.toJSON(str_params);
                            // 处理协同
                            $s.Coll.finishWorkItem(summaryBO["summary"].affairId, {}, pageX.cache.postData, errorBuilder({
                                success : function(result) {
                                    _close(result,"actionSubmit");
                                }
                            }));
                        }, true);
                    }

                    var saveContent2DB = function() {

                        // 继续调用转圈
                        cmp.dialog.loading();

                        var isFormReadOnly = summaryBO["currentPolicy"].id == 'inform' 
                                                   || summaryBO.deeReadOnly == "1"
                                                   || summaryBO.pageConfig.isSuperNode === true;

                        if ("20" == summaryBO["summary"].bodyType && !isFormReadOnly) {
                            // 3：表单正式入库
                            var options = {
                                moduleId : summaryBO["summary"].id,
                                needCheckRule : false,
                                notSaveDB : false,
                                checkNull : true,
                                allowQRScan : summaryBO["summary"].canScanCode == '1',
                                needSn : true,
                                submitSource : _getFormType()
                            }
                            cmp.sui.submit(options, function(err, data) {
                                
                                var capData = CAPUtil.mergeSubmitResult(err, data);
                                err = capData.err;
                                data = capData.data;
                                
                                if (err || data.success == "false") {
                                    // 1：:停止提交
                                    _stopSubmitting();
                                    // 2: 缓存页面数据并返回详细界面
                                    // cmp.event.trigger("beforepageredirect",document);
                                } else {
                                    // 4：协同的finish逻辑
                                    if (data.snMsg) {
                                        pageX.cache.noteList.push({
                                            "code" : "formSnMsg",
                                            "msg" : data.snMsg
                                        });
                                    }
                                    newsAndbulletinIssueCallBack();
                                }
                            }, function(){
                                
                                //CAP4的error处理
                                
                                // 1：:停止提交
                                _stopSubmitting();
                                // 2: 缓存页面数据并返回详细界面
                                // cmp.event.trigger("beforepageredirect",document);
                            });
                        }
                        else {
                            newsAndbulletinIssueCallBack();
                        }
                    }
                    var saveSignatureCallBack = function() {
                        if (window.summaryBO.signatureId) {// 保存签章数据
                            var params = {
                                "signatureId" : window.summaryBO.signatureId,
                                "documentId" : summaryBO["summary"].id
                            };
                            $s.Signet.updateIsignatureDocumentId({}, params, errorBuilder({
                                success : function(ret) {
                                    saveContent2DB();
                                }
                            }));
                        }
                        else {
                            saveContent2DB();
                        }
                    }
                    var newsAndbulletinIssueCallBack = function newsAndbulletinIssueCallBack() {

                        if (summaryBO["currentPolicy"].id == "newsaudit" || summaryBO["currentPolicy"].id == "bulletionaudit") {

                            newsAndbulletinIssue(doColfinish);
                        }
                        else {
                            doColfinish();
                        }
                    }
                    var wfEventAndPreSubmitCallBack = function() {
                        

                        var tempId = summaryBO.summary.templateId;
                        var tempIsTemplate = !(!tempId || tempId == '' || tempId == "0" || tempId == "-1");
                        if (!tempIsTemplate) { // 自由协同

                            WorkFlowDesignerUtil.lockH5Workflow(summaryBO.summary.processId, 14, function(ret) {
                                if (ret) {
                                    saveSignatureCallBack();
                                }
                                else {
                                    _stopSubmitting();
                                }
                            });

                        }
                        else {
                            var currentWorkItemIsInSpecial = (summaryBO["summary"].affairSubState == '15' || summaryBO["summary"].affairSubState == '16' || summaryBO["summary"].affairSubState == '17');

                            // 2：工作流预提交
                            pageX.wfDesigner.preSubmit({
                                contentData : [],
                                onPop : function() {
                                    // 组件层级管理，需要把这个影藏
                                    cmp.dialog.loading(false);
                                },
                                callback : function(preSubmitResult,isLast,currentNodeLast) {
                                    if (preSubmitResult["result"] == "true") {
                                        
                                        var formAdfunc= function(){
                                            if (summaryBO.deeReadOnly != "1") {
                                                // V50_SP2_NC业务集成插件_001_表单开发高级
                                                var __attitudeArray = pageX.cache.postData.attitude || "collaboration.dealAttitude.haveRead";
                                                // 表单开发高级
                                                formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType, summaryBO["summary"].affairId, __attitudeArray, CollUtils.getTextDealComment("#content"), null, saveSignatureCallBack,currentNodeLast);
                                            }else{
                                                saveSignatureCallBack();
                                            }
                                        }
                                        
                                       var workflowEventFunc = function (eventId,successCallBack){
                                            var workflowEventParams = {
                                                    event : eventId,//,
                                                    callback : function(flag) {
                                                        if (flag) {
                                                            successCallBack();
                                                        }
                                                        else {
                                                            _stopSubmitting();
                                                        }
                                                    },
                                                    formAppId : summaryBO.workflowCheckParam.formAppId,
                                                    formId : summaryBO.workflowCheckParam.formId,
                                                    formViewOperation : summaryBO.workflowCheckParam.formViewOperation,
                                                    formOperationId : summaryBO.workflowCheckParam.formOperationId
                                              };
                                              pageX.wfDesigner.executeWorkflowBeforeEvent(workflowEventParams);
                                       }
                                        
                                        
                                       var beforeProcessFinishedFunc = function (){
                                           if (isLast) {
                                               workflowEventFunc("BeforeProcessFinished",formAdfunc)
                                           }
                                           else{
                                               formAdfunc();
                                           }
                                       }
                                       
                                     
                                       
                                       var idMap = {
                                               "summaryID" : summaryBO.summary.id,
                                               "affairID" : summaryBO.summary.affairId
                                           }
                                       // 协同提交前事件
                                       var eventParams = {
                                           funName : "beforeDealSubmit",
                                           data : idMap,
                                           success : function() {
                                               workflowEventFunc("BeforeFinishWorkitem",beforeProcessFinishedFunc);
                                           },
                                           error : function(e) {
                                               
                                               var errorMsg = "";
                                               if (e) {
                                                   errorMsg = e.message + ",e.stack:" + e.stack;
                                               }
                                               _stopSubmitting();
                                           }
                                       }
                                       cmp.funProxy.getter(eventParams);
                                       
                                       
                                    }
                                    else {
                                        _stopSubmitting();
                                    }
                                },
                                "currentWorkItemIsInSpecial" : currentWorkItemIsInSpecial,
                            });
                        }
                    }

                    if ("20" == summaryBO["summary"].bodyType) {
                        // 1：表单预提交
                        var options = {
                            moduleId : summaryBO["summary"].id,
                            needCheckRule : true,
                            notSaveDB : true,
                            needSn : false
                        }
                        try{
                            _formSubmit(options, wfEventAndPreSubmitCallBack, function(){
                                //特殊错误进行容错处理， 主要是CAP4那边
                                _stopSubmitting();
                            });
                        }catch(e){
                            _alert("an error on this page,message:" + e.message, function(){
                                _stopSubmitting();
                            });
                        }
                    }else {
                        wfEventAndPreSubmitCallBack();
                    }
                }
                else {
                    _stopSubmitting();
                }
            });
      
}

/**
 * @param faultTolerantFn 特殊错误进行容错处理回调
 */
function _formSubmit(options,successCallBack, faultTolerantFn){
	
	if(summaryBO["formCanSubmit"] == "0"){
	    
		successCallBack(); 
		return;
	}
	
	 // 组装参数
	var options = { 
			moduleId:summaryBO["summary"].id,
			needCheckRule:options.needCheckRule === false ? false : true,
			notSaveDB:options.notSaveDB === false ? false : true,
			checkNull : options.checkNull === false ? false : true,
			rightId:summaryBO["summary"].rightId,
			allowQRScan : summaryBO["summary"].canScanCode =='1',
            needSn : options.needSn || false,
            submitSource : _getFormType()
	}
	cmp.sui.submit(options,function(err,data){
	    
	    var capData = CAPUtil.mergeSubmitResult(err, data);
        err = capData.err;
        data = capData.data;
	    
		if(err || data.success =="false"){
			//1：:停止提交
			_stopSubmitting();
			_goBackToSummary();
		}else{
			successCallBack();
		}
	}, function(e){
        
	    //特殊错误进行容错处理
	    if(e && faultTolerantFn){
	        if(e.code == "-1001"){
	            //CAP4 isMerge提示错误容错
	            window.console && console.warn("CAP4 isMerge 错误, 允许重新点击处理尝试.");
	            faultTolerantFn();
	            return;
	        }
	    }
	    
        //CAP4的error处理
        
	    //1：:停止提交
        _stopSubmitting();
        _goBackToSummary();
    });
}

//归档
function selectArchive(index) {
    docPigehole4Col("", function(_result) {
        var colArchiveName = cmp.i18n("collaboration.pighole.click");
        
        if (_result && _result.msg == "OK") {
            colArchiveName = _result.name;

            pageX.cache.postData.Archive = true;
            pageX.cache.postData.archiveValue = _result.id;
            pageX.cache.postData.archiveFullPath = _result.fullPath;
        }else{
            pageX.cache.postData.Archive = false;
            pageX.cache.postData.archiveValue = undefined;
            pageX.cache.postData.archiveFullPath = undefined;
            for(var n=0,len = pageX.cache.noteList.length; n < len; n++){
                var note = pageX.cache.noteList[n];
                if(note.code == "archiveNote"){
                    pageX.cache.noteList.splice(n, 1);
                    break;
                }
            }
        }
        try { 
            var lidom = document.getElementById("actionSheet-scroll").getElementsByClassName("cmp-table-view-cell");
            for(var i1 = 0 ,len1 =lidom.length;i1<len1;i1++){
                if(lidom[i1].getAttribute('sel_data') == "Archive"){
                    lidom[i1].getElementsByClassName('cmp-pull-right')[0].innerHTML='<span style="color:#3aadfb">'+colArchiveName+'</span>';
                }
            }
        } catch(e) {
        }
        pageX.cache.postData.group[index].items[0].name2 ='<span style="color:#3aadfb">'+colArchiveName+'</span>';
    });
}

//处理后归档
function archivePigeonholeFn(){
    if(pageX.cache.postData.Archive){
        var params = {
                affairId : summaryBO["summary"].affairId,
                destFolderId : pageX.cache.postData.archiveValue 
        }
        $s.Coll.getIsSamePigeonhole({},params,errorBuilder({
            success: function(result){
                if(result["retMsg"]){
                    cmp.notification.confirm(result["retMsg"],function(e){ //e==1是/e==0 否
                        if(e==1){ //是
                            pageX.cache.noteList.push({
                                "code" : "archiveNote",
                                "msg" : cmp.i18n("collaboration.pighole.alert.archiveNote", [pageX.cache.postData.archiveFullPath])
                            });
                            submitFunc();
                        }else{
                            return;  
                        }
                    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
                }else{
                    pageX.cache.noteList.push({
                        "code" : "archiveNote",
                        "msg" : cmp.i18n("collaboration.pighole.alert.archiveNote", [pageX.cache.postData.archiveFullPath])
                    });
                    submitFunc();
                }
            }
        }));
    }else{
        submitFunc();
    }
	/*if(pageX.cache.postData.Archive){
	    
		//选择了归档。回调获取归档的目录
		docPigehole4Col("",function (_result){
			if(_result && _result.msg=="OK"){
				pageX.cache.postData.archiveValue = _result.id;
				
				var params = {
						affairId : summaryBO["summary"].affairId,
			            destFolderId : _result.id
			    }
				//校验同一个人是否将协同归档到同一个目录
				$s.Coll.getIsSamePigeonhole({},params,errorBuilder({
					success: function(result){
			            if(result["retMsg"]){
			                cmp.notification.confirm(result["retMsg"],function(e){ //e==1是/e==0 否
			        	        if(e==1){ //是
			        	            pageX.cache.noteList.push({
                                        "code" : "archiveNote",
                                        "msg" : cmp.i18n("collaboration.pighole.alert.archiveNote", [_result.fullPath])
                                    });
			        	            submitFunc();
			        	        }else{
			        	        	return;  
			        	        }
			        	    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
			            }else{
			                pageX.cache.noteList.push({
                                "code" : "archiveNote",
                                "msg" : cmp.i18n("collaboration.pighole.alert.archiveNote", [_result.fullPath])
                            });
			                submitFunc();
			            }
			        }
				}));
			}else{//点取消
				pageX.cache.postData.archiveValue = "";
				_$("#docPigeonhole").classList.remove('cmp-active');
				for(var n=0,len = pageX.cache.noteList.length; n < len; n++){
				    var note = pageX.cache.noteList[n];
				    if(note.code == "archiveNote"){
				        pageX.cache.noteList.splice(n, 1);
				        break;
				    }
				}
				return;
			}
		});
	}else{
	    submitFunc();
	}*/
}

//是否是转新闻或转公告
function newsAndbulletinIssue(callbackFn){
    var _type = "";
	if(summaryBO["currentPolicy"].id == "newsaudit"){//新闻审批发布并通过
	    _type = "newsIssue";
	}else if(summaryBO["currentPolicy"].id == "bulletionaudit"){//公告审批发布并通过
	    _type = "bulIssue";
	}
	
	if(_type != ""){
	    var _params = {
                "affairId":summaryBO["summary"].affairId,
                "summaryId":summaryBO["summary"].id,
                "bodyType":summaryBO["summary"].bodyType,
                "rightId":summaryBO["summary"].rightId}
	    
        window[_type].issue.init("issueCol",_params,function (ret){
            if(ret === true){
                callbackFn();
            }else{
                _stopSubmitting();
            }
        });
	}else{
	    callbackFn();
	}
	
}

/*
 * 校验意见是否为空
 */
function _isCommentBlank(){
    
    var ret = false;
    if((CollUtils.getTextDealComment("#content")).trim() == ""){
        _alert(cmp.i18n(("collaboration.action.alert.comment_null_2")));
        ret = true;
    }
    return ret;
}

//检查affair状态是否正常
function _checkAffairValid(callback){
    var params = {
            affairId : summaryBO["summary"].affairId,
            pageNodePolicy:summaryBO["summary"].nodePolicy
    }
    $s.Coll.checkAffairValid(params, errorBuilder({
        success: function(result){
            if(result["error_msg"]){
                callback(false);
                _alert(result["error_msg"], _gotoList);//提示
            }else{
                callback(true);
            }
        },
        error : function(result){
        	//网络问题
        	if(result.code == "-1001"){
        	  	//解除各按钮的绑定
        	  	_removeEvent();
        	}
        }
    }))
}

//开始提交
function _startSubmitting(){
    cmp.dialog.loading();
    pageX.cache.isSubmitting = true;
}

//结束提交
function _stopSubmitting(){
    if(pageX.currentAction){
        WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, pageX.currentAction);
        pageX.currentAction = null;
    }
    cmp.dialog.loading(false);
    pageX.cache.isSubmitting = false;
    pageX.cache.noteList = [];
    //工作流重复提交判断重置
    pageX.wfDesigner.isPresubmit = false;
}

function _lockAction(callback){
    if(pageX.currentAction){
        WorkFlowDesignerUtil.lockH5Workflow(summaryBO["summary"].processId, pageX.currentAction, function(ret) {
            if(ret) {
                callback(true);
            }else{
                callback(false);
                _stopSubmitting_workflow();
            }
        });
    }else{
        callback(true);
    }
}

function _unLockAction(callback){
    if(pageX.currentAction){
        WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, pageX.currentAction);
        pageX.currentAction = null;
    }
}

/**
 * 流程校验接口所需撤销方法
 */
function _stopSubmitting_workflow(){
	pageX.currentAction = null;
    _stopSubmitting();
}

/**
 * 表单需要知道当前是什么状态
 * @returns {String}
 */
function _getFormType(){
    
    if(summaryBO.isLightForm){
        return "mobile";
    }else{
        return "pc";
    }
}

/**
 * 修改正文提示
 */
function saveContentConfirm(saveCallback,isSave){
	var editFlag = window.summaryBO.editParam ? window.summaryBO.editParam.hasEditContent : false;
	if(editFlag){
		if(isSave){//暂存和提交默认保存正文，不提示
			ContentEdit.uploadToServer(function(){
				saveCallback("1");
			});
		}else{
			cmp.notification.confirm(cmp.i18n("collaboration.edit.office.content.issave"),function(e){ //e==1是/e==0 否
				if(e==1){ //是
					ContentEdit.uploadToServer(function(){
						saveCallback("1");
					});
				}else{
	    			cmp.contentEdit.clear({
	    				fileId : summaryBO.content.fileId,
	    				lastModified : summaryBO.content.lastModified
	    			});
					saveCallback("0");
				}
			},null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
		}
	}else{
		saveCallback("0");
	}
}
function _doZcdb(){
	if(pageX.cache.postData.Archive){
		_alert(cmp.i18n("collaboration.zcdb.archive"),function(){
			exeSubmitData("actionZcdb");
		});
	}else{
		exeSubmitData("actionZcdb");
	}
}
function _doSubmit(){
	exeSubmitData("actionSubmit");
}

function _removeEvent(){
	_$("#zcdbBtn").removeEventListener("tap", _send);
	_$("#submitBtn").removeEventListener("tap", _doSubmit);
}


function transStepBackValid(callback){
	var params = {
			affairId : summaryBO["summary"].affairId
	}
	$s.Coll.transStepBackValid({},params, errorBuilder({
		success: function(result){
			if(result["error_msg"]){
				callback(false);
				_alert(result["error_msg"]);//提示
			}else{
				callback(true);
			}
		}
	}))
}

function _doSaveData4ListView (type) {
	if (typeof(type)!="undefined") {
    	//不刷新协同列表
        setListViewRefresh("false");
        //处理该数据
        var operationType = "";
        if ("actionZcdb"==type) {
        	operationType = "zcdb";
        } else if ("actionSubmit"==type) {
        	operationType = "delete";
        }
        setListViewDateUpdate({
    		type : operationType,
    		data : {affairId : summaryBO.summary.affairId}
    	});
    }
}

/**
 * 确认选择态度
 */
function attituedeAlert(continuFn){
    _lockAction(function(lockRet){
    	
    	if(lockRet){
    		/*节点态度</br>已阅 同意 不同意*/
            var _cofirmHtml  = "<span id='attitudeSpan' class='trace_span'>";
            if(summaryBO.pageConfig.attitudeBtns == 1){
                _cofirmHtml+='<input id="haveRead" name="confirm_attitude" style="color:#2EAEF7" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.haveRead">'+cmp.i18n("collaboration.page.lable.att_readed");
            }
            _cofirmHtml+='<input id="agree" name="confirm_attitude" style="color:#2EAEF7" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.agree">' +cmp.i18n("collaboration.page.lable.att_agree");
            _cofirmHtml+='<input id="disagree" name="confirm_attitude" style="color:#2EAEF7" type="radio" class="select-put cmp-radio2" value="collaboration.dealAttitude.disagree" checked="checked">' +cmp.i18n("collaboration.page.lable.att_disagree") + '</span>';
            var attitude = pageX.cache.postData.attitude;
            
            cmp.notification.confirm(_cofirmHtml, function(e,closeObj){ //e==1是/e==0 否
            	
                var closeConfirm = closeObj.closeFunc;
            	if(e==1){ //是
                    var rv = _$("input[name='confirm_attitude']:checked").value;
                    pageX.cache.postData.attitude = rv;
                    
                    var attInputs = _$("input", true, _$("#button_list_nav"));
                    for(var i = 0, len = attInputs.length; i < len; i++){
                        if(attInputs[i].value == rv){
                            attInputs[i].checked = true;
                        }
                    }           
                    //手动调用关闭提示框
                    closeConfirm();
                    
                    //继续下面的事件
                    continuFn();
                }else{
                	//手动调用关闭提示框
                    closeConfirm();
                    _unLockAction();
                }
            }, cmp.i18n("collaboration.page.dialog.note3"), [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,true,0);
    	}
    	
    });
    
}

/*******为别人提供的接口 begin*******/
/*	获取意见类型
 return String
	collaboration.dealAttitude.haveRead   已阅
	collaboration.dealAttitude.agree      同意
	collaboration.dealAttitude.disagree   不同意
*/
function getOpinion(){
	return pageX.cache.postData.attitude;
}
/*	获取意见内容
	return String
 */
function getOpinionContent(){
	var content = CollUtils.getTextDealComment("#content");
	var emojiUtil = cmp.Emoji();
	return emojiUtil.EmojiToString(content);
}
/*	获取节点类型
	return Object
	id:key
	name:描述
*/
function getCurrentPolicy(){
	return summaryBO.currentPolicy;
}
/*******为别人提供的接口 end*******//**
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
}