/*本页面不要使用Jquery*/

var pageX = {}

pageX.MAX_INPUT_LENGTH = 100;
pageX.postData = {};
pageX.isSubmitting = false;//重复提交防护
cmp.ready(function() {// 缓存详情页面数据
    _initPage();
});

// 页面布局
function _initPage() {
    
    initPageBack();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        pageX.winParams = cmp.href.getParam();
        
      //缓存加载
        window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
        
        _$("title").innerText=cmp.i18n("collaboration.page.lable.button.cancel1");
        
        _$("#content").setAttribute("placeholder", cmp.i18n("collaboration.page.info.whencancel", [cmp.i18n("collaboration.page.lable.button.cancel1")]));
        
        
        // 注册懒加载
        _registLazy();
        
        // 启动加载表单
        LazyUtil.startLazy("seeyon_form");
        
        // 将表单数据拉近内存
        LazyUtil.addLoadedFn("lazy_form", function() {
            
            function _loadFormDataFromCache(){
                if(cmp.sui && cmp.sui.loadFormDataFromCache){
                    var optionsCache = {
                            moduleId : summaryBO["summary"].id,
                            rightId : summaryBO["summary"].rightId,
                            viewState: summaryBO._viewState,
                            operateType : summaryBO._viewState,
                            callback : function(ret){
                                if(ret){
                                    // 加载成功
                                }else{
                                    _alert("fail to load form data, please go back and try again.");
                                }
                            }
                    }
                    cmp.sui.loadFormDataFromCache(optionsCache);
                }
            }
            
            if(summaryBO.content.isCAP4){
                cmp.sui.ready(_loadFormDataFromCache);
            }else{
                _loadFormDataFromCache();
            }
        });
        
        // js加载完成后才进行事件绑定
        LazyUtil.addLoadedFn("seeyon_form", _bindEvent);
        
        //清空缓存
        document.addEventListener('deletesessioncache', function(e){
           try{
                //删除协同缓存
               CollCacheKey.delCacheKeys(CollCacheKey.summary, pageX.winParams.cache_subfix);
                
               //触发刷新壳数据
               cmp.webViewListener.fire({ 
                   type: 'com.seeyon.m3.ListRefresh', 
                   data: {affairid: summaryBO["summary"].affairId} 
               });

               if(cmp.sui && cmp.sui.clearCache){
                   
                   var options = {
                           moduleId:summaryBO["summary"].id,
                           rightId:summaryBO["summary"].rightId,
                           viewState: summaryBO._viewState,
                           operateType : summaryBO._viewState
                   }
                   cmp.sui.clearCache(options);
               }
              
            }catch(e){
                console.error(e);
            }
        });
    },$verstion);
}

/**
 * 注册懒加载
 */
function _registLazy(){
    
    if(summaryBO["summary"].bodyType == "20"){
        
        //表单
          if(summaryBO.content.isCAP4){
              
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
                          _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion 
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
      } 
}

// 事件绑定
function _bindEvent() {
    
    _$("#sendBtn").addEventListener("tap", _submit);
    
    //剩余文字显示
    var $content = _$('#content');
    function showContentCount(){
        CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
    }
    $content.addEventListener('input', showContentCount);
    showContentCount();
}


function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    //_$("#goBackBtn").addEventListener("tap", _goBack);
}

//返回
function _goBack() {
	
	summaryBO.backIndex = summaryBO.backIndex - 1;
    cmp.storage.save(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, cmp.toJSON(window.summaryBO), true);
    
	WorkFlowDesignerUtil.unLockH5Workflow(summaryBO["summary"].processId, CopyWorkFlowLock.REPEAL_ITEM);
    cmp.href.back(1, null, pageX.winParams.WebviewEvent);
}

//处理成功后返回列表
function _gotoList(){
  //触发删除缓存
    cmp.event.trigger("deletesessioncache", document);
    
    var backN = 1;
    if(window.summaryBO && summaryBO.backIndex){
        backN = backN + summaryBO.backIndex;
    }
    
    cmp.href.back(backN);
}

//提交
function _submit(){
    
    if(_checkCommentIsEmpty()){
        return;
    }
    
    _initDetailWfDesigner();
    
    pageX.postData.content =  CollUtils.getTextDealComment("#content");
    
    if(pageX.isSubmitting){
        return;
    }
    
    pageX.isSubmitting = true;
    
    var workflowCheckParam = {
		event : "BeforeCancel",
		callback : function(flag){
			if(flag){
				confirmOptAndWFTrace(function(){
					var doRepealBack = function() {
						cmp.dialog.loading();
						//撤销协同
						$s.Coll.transRepal(summaryBO["summary"].affairId, {}, pageX.postData, errorBuilder({
							success : function(result) {
								cmp.dialog.loading(false);
								pageX.isSubmitting = false;
								
								if(result["error_msg"]){
									_alert(result["error_msg"]);
								}else {
									_gotoList();
								}
							}
						}));
					}
					if(summaryBO.deeReadOnly == "1") {
   					   doRepealBack();
   				   } else {
   					   //表单开发高级
   					   formDevelopAdance4ThirdParty(summaryBO["summary"].bodyType,summaryBO["summary"].affairId,"repeal",CollUtils.getTextDealComment("#content"),null,doRepealBack);
   				   }
				});
			}else{
				pageX.isSubmitting = false;
			}
		},
        formAppId : summaryBO.workflowCheckParam.formAppId,
        formViewOperation : summaryBO.workflowCheckParam.formViewOperation
    };
    pageX.wfDesigner.executeWorkflowBeforeEvent(workflowCheckParam);
}

/**
 * 弹出确认操作和流程追述的对话框
 * @param callBackFn
 */

function confirmOptAndWFTrace(callBackFn){
    
        
    /*'该操作不能恢复，是否进行回退操作？<br>流程追溯';*/
    var _cofirmHtml  = cmp.i18n("collaboration.page.notrollback.confirm.label", [cmp.i18n("collaboration.page.lable.button.cancel1")])
                          +"<br><span class='trace_span'>"+cmp.i18n("collaboration.page.wftrace.label");
    _cofirmHtml+='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" class="select-put cmp-checkbox2"></span>'
        
    cmp.notification.confirm(_cofirmHtml,function(e,closeObj){ //e==1是/e==0 否
    	
    	var closeConfirm = closeObj.closeFunc;
        var isWfTrace = document.querySelector("#isWFTrace");
        pageX.postData["isWFTrace"] = isWfTrace && isWfTrace.checked  ? "1" : "0";
        
        if(e==1){ //是
        	closeConfirm();
            callBackFn();
        }else{
        	closeConfirm();
            pageX.isSubmitting = false;
        }
    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,true,0);
}

//检查意见是否允许为空
function _checkCommentIsEmpty(){
    
    var ret = false;
    
    if(CollUtils.getTextDealComment("#content").length == 0){
        //{0}附言不能为空
    	_alert(cmp.i18n(("collaboration.action.alert.repalCommon"), [cmp.i18n("collaboration.page.lable.button.cancel1")]));
        ret = true;
    }
    
    return ret;
}

/**
 * 初始化流程编辑
 */
function _initDetailWfDesigner(){
    _initWfDesigner(null, {
        model : "silent"//采用静默模式
    });
}

//结束提交
function _stopSubmitting(){
	pageX.isSubmitting = false;
    return;
}

function _setCommentValue(message, flag){
	if(flag){
		_$("#content").value = message;
	}
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