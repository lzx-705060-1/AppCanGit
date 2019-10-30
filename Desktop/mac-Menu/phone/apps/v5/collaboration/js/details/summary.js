
/** 初始化设置等都在 summary-req.js 中**/

//重写cmp的loading组件, 解决到处loading的问题
var cmpLoading = cmp.dialog.loading;
cmp.dialog.loading = function(status){
    
    if(status === false){
        pageX.isLoading= false;
        //console.log("取消loading...");
        cmpLoading.apply(cmp.dialog, arguments);
    }else{
        if(pageX.isLoading !== true){
            //console.log("执行loading...");
            cmpLoading.apply(cmp.dialog, arguments);
        }else{
            //console.log("无效的重复loading...");
        }
        pageX.isLoading= true;
    }
}
/* 
 cmp没有提供接口， 这里写的调试代码
cmp.connection.getNetworkStatus = function(config){
    
    config.success({serverStatus : "connect"});
}*/

cmp.ready(function(){

    _initBackEvent();
    cmp.dialog.loading();
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){

        //通过壳提供的方法校验网络情况
        cmp.connection.getNetworkStatus({
            success:function(ret){
                //能连接服务器，走在线流程
                if ( ret.serverStatus === 'connect' ) {
                  //国际化title标签
                    _$("title").innerText = cmp.i18n("collaboration.affairs.details");

                    //触发h1加载缓慢的触发器         --搞不明白为什要这么写，搞不懂，就抽一下变量
                    var $showTitle = _$("#showTitle");
                    $showTitle.style.bottom = '0px';
                    $showTitle.style.display = 'block';

                    //初始化数据检测
                    if(!paramCheck){
                        _alert(cmp.i18n("collaboration.exception.paramsException"), _goBack);
                        return;
                    }
                    
                  //加载数据
                    FastUtil.call("fast_summary", {
                        "success" : function(result, isCache){
                            var toRend = true;
                            if(!isCache){
                                toRend = _handReqData(result);
                            }
                            if(toRend){
                                _renderMainPage();
                            }
                            orientationUI();
                        },
                        "error" : function(error, isCache){
                            
                            function handErrorFn(e, c){
                                
                                pageX.isInitError = true;
                                var cmpHandled = cmp.errorHandler(e);
                                if(cmpHandled){
                                    
                                }else {
                                     var errMsg = "";
                                     if(typeof e === "object"){
                                         errMsg = cmp.toJSON(e);
                                     }else{
                                         errMsg = e;
                                     }
                                     _alert(cmp.i18n("collaboration.exception.loadDataException") + errMsg, _goBack);
                                }
                            }
                            
                            //
                            if(error && error.code == 401 && !isCache){
                                //fastajax 第一次开webview 可能没有注入session， 会有异常，兼容重试一下
                                $s.Coll.summary(pageX.winParams["openFrom"], 
                                                pageX.winParams["affairId"], 
                                                pageX.winParams["summaryId"],pageX.requestParam, 
                                                errorBuilder({
                                                    success : function(result) {
                                                        var toRend = true;
                                                            _handReqData(result);
                                                            _renderMainPage();
                                                    },
                                                    error : function(e){
                                                        handErrorFn()
                                                    },
                                                    exeSelfError : true
                                                }));
                                
                            }else{
                                handErrorFn(error, isCache);
                            }
                        }
                    })
                } else {
                    /*var res = {};
                    res.code = '-1001';
                    if ( ret.networkType === 'none' ) {
                        res.code = '-1009';
                    }*/
                  //网络不可用
                    _alert(cmp.i18n("collaboration.network.notconnect"), _goBack, cmp.i18n("collaboration.page.dialog.note"));
                }
            },
            error:function(){
                //网络不可用
                _alert(cmp.i18n("collaboration.network.notconnect"), _goBack, cmp.i18n("collaboration.page.dialog.note"));
            }
        });
    },$verstion);
});

function closePromoteBacked(){
	_$("#promoteBackedDiv").style.display='none';
	// 关闭后本次不不再显示
	summaryBO.needPromptedBeBacked = "0";
}
function orientationUI(){
    cmp.event.orientationChange(function(res){

        //设置正文区域高度
        var $title = _$("#summary_titile_container"),
            bodyHeight = window.innerHeight,
            formViewHeight = pageX.viewsLenth > 0 ? 36 : 0,//_$("#form_views")
            lHeight = pageX.toggleLableCount != 0 ? 50 : 0,
            titleHeight = res == "portrait" ? 75 : 0,
            contentAndWfTagsH = _$("#contentAndWfTags").offsetHeight,

            footer_btnsH = _$("#footer_btns").offsetHeight,
            headerH = 0;
        var $bodyContent = _$("#body_content_div");
        $bodyContent.style.height = bodyHeight +"px";
        var $contentView = _$("#contentView");
        if(res == "portrait"){ //竖屏
            $contentView.style.height = (bodyHeight - footer_btnsH - contentAndWfTagsH - formViewHeight + 10) + "px";
            $contentView.setAttribute("data-mintop", contentAndWfTagsH + formViewHeight - 1);
            $contentView.setAttribute("data-maxtop", bodyHeight - footer_btnsH - lHeight);
        }else if(res == "landscape"){  //横屏
            $contentView.style.height = (bodyHeight - footer_btnsH - contentAndWfTagsH - formViewHeight + 20) + "px";
            $contentView.setAttribute("data-mintop", contentAndWfTagsH + formViewHeight - 11);
            $contentView.setAttribute("data-maxtop", bodyHeight - footer_btnsH - lHeight);
        }

        _toggleContent(false);
        var contentViewH = $contentView.offsetHeight;
        var cHeight;
        if(res == "portrait"){ //竖屏
            cHeight = bodyHeight - titleHeight - contentAndWfTagsH - formViewHeight - lHeight - footer_btnsH;
        
        }else if(res == "landscape"){  //横屏
            cHeight = bodyHeight - titleHeight - contentAndWfTagsH - formViewHeight - lHeight - footer_btnsH;
        
        }
        _$("#summary_info").style.height = cHeight + "px";
    });
}

/**
 * 处理请求返回的数据
 */
function _handReqData(result){

    
    /** 前Affair状态校验 */
    if(result["error_msg"] && result["error_msg"]!="") {
        _alert(result["error_msg"], _goBack, cmp.i18n("collaboration.page.dialog.note"));
        return false;
    }else{
        //注册summaryBO
        window.summaryBO = result;
        
        //数据补填
        summaryBO.openFrom = pageX.winParams["openFrom"];
        summaryBO.draftComment = summaryBO.draftComment || {};
        summaryBO.pageConfig = summaryBO.pageConfig || {};
        
        var nodeActions = summaryBO.pageConfig.nodeActions || [];
        var commonActions = summaryBO.pageConfig.commonActions || [];
        var advanceActions = summaryBO.pageConfig.advanceActions || [];
        //权限合并
        nodeActions = nodeActions.concat(commonActions, advanceActions);
        summaryBO.pageConfig.nodeActions = nodeActions;
        summaryBO.pageConfig.commonActions = commonActions;
        summaryBO.pageConfig.advanceActions = advanceActions;
        
        summaryBO.backIndex = pageX.winParams.backIndex || 0;
      
        //系统时间和本地时间的差异
        summaryBO.server2LocalTime = summaryBO["SystemCurrentTimeMillis"] - new Date().getTime();
        
        //意见草稿
        if(summaryBO.draftComment["attachments"]){
            //附件转换成json格式
            summaryBO.draftComment["attachments"] = cmp.parseJSON(summaryBO.draftComment["attachments"]);
        }
        summaryBO.workflowCheckParam = summaryBO.workflowCheckParam || {};
        
        return true;
    }
}

/**
 * 首屏数据加载完成后，渲染主入口
 */
function _renderMainPage(){
    
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "css" : [
                _cmpPath + "/css/cmp-selectOrg.css" + $verstion,
                _cmpPath + "/css/cmp-picker.css" + $verstion,
                _cmpPath + "/css/cmp-search.css" + $verstion,
                _cmpPath + "/css/cmp-accDoc.css" + $verstion,
                _cmpPath + "/css/cmp-audio.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-flowV5.js" + $verstion,
                _cmpPath + "/js/cmp-accDoc.js" + $verstion,
                _cmpPath + "/js/cmp-push.js" + $verstion,
                _cmpPath + "/js/cmp-audio.js" + $verstion,
                _cmpPath + "/js/cmp-server.js" + $verstion,
                _cmpPath + "/js/cmp-lbs.js" + $verstion,
                _cmpPath + "/js/cmp-selectOrg.js" + $verstion,
                _cmpPath + "/js/cmp-picker.js" + $verstion,
                _cmpPath + "/js/cmp-dtPicker.js" + $verstion,
                _cmpPath + "/js/cmp-search.js" + $verstion,
                _cmpPath + "/js/cmp-popPicker.js" + $verstion,
                _cmpPath + "/js/cmp-camera.js" + $verstion,
                _cmpPath + "/js/cmp-v5.js" + $verstion,
                _cmpPath + "/js/cmp-barcode.js" + $verstion,
                _cmpPath + "/js/cmp-visitingCard.js" + $verstion
                ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_thispage",
        "css" : [],
        "js" : [
                _collPath + "/collaboration_m_api.s3js" + $verstion
            ]
    });
    
  //意见相关
    LazyUtil.addLazyStack({
        "code" : "lazy_listView",
        "css" : [
                 _cmpPath + "/css/cmp-listView.css" + $verstion,
                 _cmpPath + "/css/cmp-att.css" + $verstion
                 ],
        "js" : [
                _cmpPath + "/js/cmp-imgCache.js" + $verstion,
                _cmpPath + "/js/cmp-listView.js" + $verstion,
                _cmpPath + "/js/cmp-att.js" + $verstion,
                _collPath + "/js/mplus_apps_collaboration.s3js" + $verstion,
                _cmpPath + "/js/cmp-emoji.js" + $verstion
                ]
    });
    
  //添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "depend" : "lazy_listView",
        "dependModel" : "strong",
        "css" : [_wfPath + "/css/wf.css" + $verstion],
        "js" : [_cmpPath + "/js/cmp-zoom.js" + $verstion,
                _wfPath + "/js/wf.js" + $verstion]
    });

    LazyUtil.addLazyStack({
    	"code" : "lazy_dee",
    	"js" : [ _deePath + "/js/formDevelopmentOfadv.js" + $verstion]
    });
    
  //jssdk其他
    LazyUtil.addLazyStack({
        "code" : "lazy_jssdk",
        "css" : [],
        "js" : [user_jssdk, doc_jssdk, cmporgnization_jssdk, dee_jssdk, workflow_jssdk]
    });
    
    //签章
    LazyUtil.addLazyStack({
        "code" : "lazy_signature_1",
        "groups" : "lazy_signature",
        "css" : [],
        "js" : [
                signet_jssdk,
                _common_v5_path + "/jquery/jquery-2.1.4.min.js" + $verstion
                ]
    });
    LazyUtil.addLazyStack({
        "code" : "lazy_signature_2",
        "depend" : "lazy_signature_1",
        "dependModel" : "strong",
        "groups" : "lazy_signature",
        "css" : [],
        "js" : [
                _common_v5_path + "/widget/signaturePhone/iSignaturePhone.js?temp=1&" + $version_and + "&skin=blue",
                _common_v5_path + "/widget/signaturePhone/m3iSignature-debug.js" + $verstion,
                ]
    });

    if(summaryBO.summary.bodyType =='20' 
        || (summaryBO.content 
                && summaryBO.content["contentType"] == SeeyonContent.getBodyCode("HTML")
                && (summaryBO.content.isForwardForm ||summaryBO.content.isCAP4))){
        
        if(summaryBO.content && summaryBO.content.isCAP4 === true){
            
            var _vendor_cap4_js_, 
                _app_cap4_js_, 
                _widget_cap4_js_, 
                _app_cap4_origin_js_,
                _app_cap4_css_,
                path;
            var _cap4_iconfont_1_, _cap4_iconfont_2_;
            
            if(pageX.cache.isLightForm == null){
            	pageX.cache.isLightForm = summaryBO.content["isLightForm"];
            }
            
            if( pageX.cache.isLightForm ===false ){
                // CAP4展现原表单
                path = "origin";
                
                _app_cap4_origin_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/out-config.js" + $verstion;
                
            }else{
                path = "native";
            }

            // 拼装CAP4 的资源地址
            _vendor_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/vendor.cap4Form.js" + $verstion;
            _app_cap4_css_  = _cap4Path + "/htmls/" + path + "/form/static/css/app.cap4Form.css" + $verstion;
            
            _widget_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/widget.cap4Form.js" + $verstion;
            _app_cap4_js_ = _cap4Path + "/htmls/" + path + "/form/static/js/app.cap4Form.js" + $verstion;
            
            _cap4_iconfont_1_ = _cap4Path + "/css/iconfont.css" + $verstion;
            _cap4_iconfont_2_ = _cap4Path + "/css/file/iconfont.css" + $verstion;
            
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
                "css" : [_app_cap4_css_, _cap4_iconfont_1_, _cap4_iconfont_2_],
                "js" : [unflowform_jssdk,
                        _app_cap4_js_,
                        _unflowform + "/unflowform_m_api.s3js" + $verstion,
                        _unflowform + "/js/deeFieldInit.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion,
                        _cmpPath + "/js/cmp-headerFixed.js" + $verstion],
            });
            
            LazyUtil.addLazyStack({
                "code" : "lazy_sliders",
                "depend" : "lazy_listView",
                "css" : [
                         _cmpPath + "/css/cmp-sliders.css" + $verstion
                         ],
                "js" : [
                        _cmpPath + "/js/cmp-sliders.js" + $verstion
                        ]
            });
            
        }else{
            
            LazyUtil.addLazyStack({
                "code" : "lazy_vue",
                "groups" : "seeyon_form",
                "js" : [
                        _formPath + "/js/lib/vue/vue.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion
                        ],
            });
            LazyUtil.addLazyStack({
                "code" : "lazy_form",
                "depend" : "lazy_vue",
                "dependModel" : "strong",
                "groups" : "seeyon_form",
                "css" : [
                           _formPath + "/css/index.css" + $verstion
                         ],
                "js" : [
                        _formPath + "/js/dataService.js" + $verstion,
                        _formPath + "/js/sui.js" + $verstion,
                        _unflowform + "/unflowform_m_api.s3js" + $verstion,
                        _cmpPath + "/js/cmp-headerFixed.js" + $verstion,
                        _cmpPath + "/js/cmp-webviewListener.js" + $verstion,
                        unflowform_jssdk
                        ],
            });
        }
        
    }else{
        LazyUtil.addLazyStack({
            "code" : "lazy_form",
            "css" : [],
            "js" : [
                    unflowform_jssdk,
                    _unflowform + "/unflowform_m_api.s3js" + $verstion,
                    _cmpPath + "/js/cmp-webviewListener.js" + $verstion
                    ],
        });
        LazyUtil.addLazyStack({
            "code" : "lazy_sliders",
            "depend" : "lazy_listView",
            "css" : [
                     _cmpPath + "/css/cmp-sliders.css" + $verstion
                     ],
            "js" : [
                    _cmpPath + "/js/cmp-sliders.js" + $verstion
                    ]
        });
    }
    
    LazyUtil.addLazyStack({
        "code" : "lazy_edit",
        "js" : [editContent_jssdk,
				_cmpPath + "/js/cmp-contentEdit.js" + $verstion,
                _common_v5_path + "/widget/ContentEdit-debug.js" + $verstion
                ],
    });
    
    //电话会议
    LazyUtil.addLazyStack({
        "code" : "lazy_multicall",
        "js" : [_collPath + "/js/multicall.js" + $verstion],
    });

    
    //渲染一部分页面
    _fillTitle();
    
    LazyUtil.startLazy("lazy_signature");
    LazyUtil.addLoadedFn("lazy_signature_2", function(){
        
        //初始化处理相关
        __initDeal__(function(){
            
            //装载页面
            _fillPage();
            
            var sc = summaryBO.content;
            //开始懒加载, 轻表单需要提前加载js
            if(sc && 
            		(summaryBO.summary.bodyType =='20' || pageX.cache.isFormForward === true || summaryBO.content.isCAP4)){
                LazyUtil.startLazy("seeyon_form");
            }
            
            _bindEvent();//绑定事件
        });
    });
    
    //更新listView缓存中本条记录为已读
    updateListCache(summaryBO.summary.affairId, "read");
    
    //添加缓存
    document.addEventListener('beforepageredirect', function(e){ 
        _storagePageData();
    });
    
    //重新渲染
    document.addEventListener('refreshWebView', function(e){ 
        
        //清空防止重复点击的变量
        _violenceClickFlag = false;
        _summaryRepeatClk = false;
        //更新删除一下缓存
        _loadSummaryCache();
    });
    
    if(summaryBO.needPromptedBeBacked == '1'){
		_$("#promoteBackedDiv").style.display='block';
	}
    
    //多webview事件监听
    LazyUtil.addLoadedFn("lazy_form", function(){
        cmp.webViewListener.addEvent(WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,function(){//注册监听，用于改变点击的那一列数据样式和内容的改变
            //多webview事件触发
            cmp.event.trigger("refreshWebView", document);
        });
    });
}


//渲染页面拆分
function _fillTitle(){
    
    if(pageX.winParams["openFrom"]=='listWaitSend' && summaryBO.summary.bodyType !='20'){
        var titleTip = cmp.i18n("collaboration.page.lable.useComputerOper");
        _$("#showTitle").innerHTML = titleTip;
    }
    
  //点赞
    if (!summaryBO.summary.canPraise) {
        _$("#canPraise1").style.display="none";
        _$("#canPraise2").style.display="none";
        _$("#canPraise3").style.display="none";
        _$("#canPraise4").style.display="none";
        _$("#comment_like_count").style.display="none";
    }
    
    //标题区域
    var titleTemplate = _$("#title_template").innerHTML;
    var titleHtml = cmp.tpl(titleTemplate, summaryBO.summary);
    _$("#title_div").innerHTML = titleHtml;
    
    //处理数量统计
    _$("#all_num").innerText = summaryBO.affairCount.running+"/"+summaryBO.affairCount.all;
    
    //表单多视图， 这里是CAP3的视图切换方式，还托管在协同这边
    var cInfo = summaryBO.content, tabHtml ="";
    if(cInfo && cInfo.contentList && cInfo.contentList.length > 1){
        
        var count = cInfo.contentList.length;
        if(count > pageX.viewMax){
            //显示3.5个
            pageX.viewCtWidth = window.innerWidth;
            pageX.viewItemWidth = Math.floor(pageX.viewCtWidth / 3.5);
            pageX.viewWidth = pageX.viewItemWidth * count;
        }
        pageX.viewsLenth = count;
        
        var tpl = _$("#more_view_item_tpl").innerHTML;
        for(var i = 0; i < count; i++){
            var item = cInfo.contentList[i];
            item.layIndex = i;
            if(pageX.cache.formIndex == item.index){
                item.active = true;
            }else{
                //没有做拷贝， 这里是直接操作对象，所以要赋值false
                item.active = false;
            }
            if(item.isOffice == "true"){
                pageX.officeIdex = item.index;
            }
            if(pageX.viewItemWidth != 0){
                item.width = pageX.viewItemWidth + "px";
            }
            if(typeof pageX.cache.viewLight["" + item.index] === "undefined"){
                pageX.cache.viewLight["" + item.index] = item.isLightForm === "true";
            }
            tabHtml += cmp.tpl(tpl, item);
        }
        
        if(tabHtml){
            var c = _$("#form_views");
            c.innerHTML = tabHtml;
            if(count > pageX.viewMax){
                //显示3.5个
                c.style.width = pageX.viewWidth + "px"; 
            }
            c.classList.remove("display_none");
        }
    }
    
    
    //1. 附件展示
      if(summaryBO.summary.attachmentCount > 0){
          var attachments = summaryBO.summary.attachments;
          
        //延迟加载意见
          LazyUtil.addLoadedFn("lazy_listView", function(){
              CollUtils.initAttStyle("#attachments_ul", attachments);
              attachments = null;
          });
          _addToggleEvent("attachment_container");
          
        //设置数量
          var attContainer = _$("#attachment_container");
          attContainer.classList.remove("display_none");
          attContainer.querySelector("#att_file_count").innerText = summaryBO.summary.fileAttachmentCount;
          attContainer.querySelector("#att_ass_count").innerText = summaryBO.summary.assAttachmentCount;
          
      }else{
          //没有附件直接移除容器
          _$("#attachment_container").remove();
      }
      
    //2. 转发意见
      if(summaryBO.forwordCommentList && summaryBO.forwordCommentList.length > 0){
          
          var forwordComs = summaryBO.forwordCommentList;
          
          var fSenderTpl = _$("#sender_comment_template").innerHTML;
          var fCommentTpl = _$("#forword_comment_tpl").innerHTML;
          var fLocation = _$("#forwordCommentLocaltion");
          
          for(var i = 0; i < forwordComs.length; i++){
              
              var row = forwordComs[i];
              //转发发起者附言
              var senderLabel = cmp.i18n("collaboration.summary.forword.time",[row.forwardCount,row.noteList.length]);
              cmp.tpl(fSenderTpl, row.noteList);
              var sendDatas = {
                      "id" : "forword_sender_container" + i,
                      "senderLabel" : senderLabel,
                      "titleClass" : "dropdown",
                      "bodyClass" : "white",
                      "conmentsId" : "forword_sender_list_" + i,
                      "noteList" : row.noteList
              }
              
              fLocation.insertAdjacentHTML("beforeBegin",cmp.tpl(fCommentTpl, sendDatas));
              
              (function(rList){
                //延迟加载意见
                  LazyUtil.addLoadedFn("lazy_listView", function(){
                      //意见附件
                      _rendSendCommentAttr(rList);
                      rList = null;
                  });
              })(row.noteList);
              
              _addToggleEvent(sendDatas.id);
              
              //转发意见
              var cLabel = cmp.i18n("collaboration.summary.forword2zan.time",[row.forwardCount,row.replysList.length,row.zanCount]);
              var listDatas = {
                      "id" : "forword_comments_container" + i,
                      "senderLabel" : cLabel,
                      "titleClass" : "",
                      "bodyClass" : "",
                      "conmentsId" : "forword_comments_list_" + i,
                      "noteList" : {}
              }
              fLocation.insertAdjacentHTML("beforeBegin",cmp.tpl(fCommentTpl, listDatas));
              (function(replysList, conmentsId, id, index){
                  //延迟加载意见
                    LazyUtil.addLoadedFn("lazy_listView", function(){
                        var newStyle = (index === 0 && pageX.cache.isFormForward === true);
                        __rendList(replysList, conmentsId, false, true, id, newStyle);
                        replysList = null;
                        conmentsId = null;
                        id = null;
                    });
                })(row.replysList, listDatas.conmentsId, listDatas.id, i);
              
              _addToggleEvent(listDatas.id);

              if(row.noteList == 0){
                  _$("#"+sendDatas.id).remove();
              }
          }
      }
      
    //3. 发起人附言
      var senderComments = summaryBO.senderCommonts;
      if(senderComments && senderComments.length > 0){
          
          var senderCommentHtml = cmp.tpl(_$("#sender_comment_template").innerHTML, senderComments);
          
          _$("#sender_comment_ul").insertAdjacentHTML("beforeEnd",senderCommentHtml);
          _$("#sender_comment_count").innerText = senderComments.length;
          
        //延迟加载意见
          LazyUtil.addLoadedFn("lazy_listView", function(){
            //意见附件
              _rendSendCommentAttr(senderComments);
              senderComments = null;
          });
          
          _$("#sender_comment_container").classList.remove("display_none");
          _addToggleEvent("sender_comment_container");
          
          //新增附言
          _showSenderComment(summaryBO.pageConfig.canAddSenderComment);
      }else{
          if(!summaryBO.pageConfig.canAddSenderComment){
              _$("#sender_comment_container").remove();
          }else{
              
              pageX.toggleLableCount += 1;
              
              var sc = _$("#sender_comment_container");
              sc.querySelector('[class*="see-icon-v5-common-arrow"]').remove();
              sc.classList.remove("display_none");
              //新增附言
              _showSenderComment(summaryBO.pageConfig.canAddSenderComment);
          }
      }
      
      if(summaryBO.allCommentCount > 0){
          
          var $comentContainer,$Container,cClassList;
          
          $comentContainer = _$("#comments_container");
          $Container = _$("#comments_container");
          cClassList = $Container.classList;
          
         /* 
          * 意见更多页面屏蔽，但是先别删代码，产品经理可能会后悔
          * 
          * $comentContainer.querySelector("#more_comment_btn").addEventListener("tap", function(e){
		    e.stopPropagation();
			_formLoadCheck({
        		        checkCallback : function(ret){
        		            if(ret == true){
        		            	//TODO 如果是非编辑状态下就不需要这个判断了
        		            	//表单校验判断
        		                if(summaryBO.pageConfig.canDeal 
        		                        && summaryBO["summary"].bodyType == "20"){
        		                    if(cmp.sui.isPreventSubmit()){
        		                        //表单失去焦点校验失败,阻止跳转
        		                        return;
        		                    }
        		                }
        		                
        		                var pageParams = {
        		                        "cache_subfix" : pageX.winParams.cache_subfix,
        		                        "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
        		                    }
        		                summaryBO.backIndex = summaryBO.backIndex + 1;
        		                cmp.event.trigger("beforepageredirect", document);
        		                cmp.href.next(_collPath + "/html/details/moreComment.html"+colBuildVersion, pageParams, {openWebview : true});
        		            }
        		        }
        		    });

        	  
              
          });*/
          
          
          $comentContainer.querySelector("#comment_like_count").innerText = summaryBO.likeCommentCount;
          
          $Container.querySelector("#comment_count").innerText = summaryBO.allCommentCount;
          
          //显示意见
          cClassList.remove("display_none");
          
          pageX.toggleLableCount++;
          _addToggleEvent("comments_container");
          
        //延迟加载意见
          LazyUtil.addLoadedFn("lazy_listView", function(){
            //加载全部意见
              _initListView(true);
          });
          
          //回复和点赞设置
          if(summaryBO.pageConfig.canReply){
              _showReplyBtns("#comments_container");
          } else if(summaryBO.openFrom!='listWaitSend'|| (summaryBO.openFrom=='listWaitSend' && summaryBO.subState=='16')){
        	//任何地方都能回复意见(待发除指定回退——直接提交给我和新建不能回复)
        	cmp("#comments_container").on("tap", ".replay_btn", function(){
        	    _replyComment(this.getAttribute("commentId"));
        	});
          }
      }else{
        //延迟加载意见
          LazyUtil.addLoadedFn("lazy_listView", function(){
            //加载全部意见
              _initListView(false);
          });
      }
}

//装载页面
function _fillPage() {
    
  //多视图展现
    if(summaryBO["summary"].bodyType == '20'){
        _initFormViews();
    }
    
  //初始化正文区域
    _initLayout(false);
    _toggleContent(false);
    
    //尝试加载正文
    _initContent();

    //判断是否展示相关数据
    var isSelfColSent = summaryBO.summary.templateId == null && (summaryBO.openFrom == "listSent" || summaryBO.openFrom == "listWaitSend" || summaryBO.affairState == "2");
    var openFromParam = ["formRelation", "subFlow", "glwd", "docLib", "supervise", "formQuery", "formStatistical", "F8Reprot", "repealRecord", "stepBackRecord","capQuery"];
    var showDataRelationBtn = !isSelfColSent && summaryBO.summary.hasWorkFlowAdvance;
    if(showDataRelationBtn){
        for(var i = 0 ; i < openFromParam.length ; i++){
            if(summaryBO.openFrom == openFromParam[i]){
                showDataRelationBtn = false;
                break;
            }
        }
        if(showDataRelationBtn){
        
	        var $dBtn;
            $dBtn = _$("#dataRelationBtn");
            if($dBtn){
                $dBtn.style.display = "";
            }
        }
    }
}


//存储状态数据
function _storagePageData(){
    
    if(pageX.viewScroll && pageX.viewsLenth > pageX.viewMax){
        pageX.cache.scollLeft = pageX.viewScroll.x;
    }
    
	cmp.storage.save(_storge_key, cmp.toJSON(pageX.cache), true);
}


//设置元素布高度等
function _initLayout(isRefresh, tHeight, setTitle){
    
  //设置正文区域高度
    var $title = _$("#summary_titile_container"),
        bodyHeight = 0,
        tagHeight = 55,//_$("#contentAndWfTags").offsetHeight
        formViewHeight = pageX.viewsLenth > 0 ? 36 : 0,//_$("#form_views")
        lHeight = pageX.toggleLableCount != 0 ? 50 : 0,
        titleHeight = 0,
        headerH = 0;

    //优化渲染数度
     var headerDom = _$("#page_header");
    var hStyleHeight = headerDom.style.height;
    if(hStyleHeight){
        headerH = parseInt(hStyleHeight, 10);
    }else{
        //offsetHeight 优化渲染
        headerH =  headerDom.offsetHeight;
        headerDom.style.height = headerH + "px";
    }
        
    var $bodyContent = _$("#body_content_div");
    var bStyleHeight = $bodyContent.style.height;
    if(bStyleHeight){
        bodyHeight = parseInt(bStyleHeight, 10);
    }else{
        //offsetHeight 优化渲染
        bodyHeight =  $bodyContent.offsetHeight;
        $bodyContent.style.height = bodyHeight + "px";
    }
    
    if(typeof tHeight != "undefined" && tHeight != null){
        titleHeight = tHeight;
    }else{
        var tStyleHeight = $title.style.height;
        if(tStyleHeight){
            titleHeight = parseInt(tStyleHeight, 10);
        }else{
            //offsetHeight 优化渲染
            titleHeight =  $title.offsetHeight;
        }
    }
    
    var fHeight = 0;
    var foot = _$("#footer_btns");
    if(foot){
        fHeight += foot.offsetHeight;
    }
    var cHeight;
    if(window.orientation == 90 || window.orientation == -90){//临时这样判断，后期cmp提供统一判断方法
        cHeight = bodyHeight - titleHeight - formViewHeight - fHeight;
    }else{
        cHeight = bodyHeight - titleHeight - tagHeight - formViewHeight - lHeight - fHeight;
    }
   /* _$("#newInputPosition").style.height = cHeight + "px";
    _$("#form_body").style.height = cHeight + "px";*/
    _$("#summary_info").style.height = cHeight + "px";
    pageX.contentHeight = cHeight;
    
    if(!isRefresh){
        
        if(setTitle !== false){
            $title.style.height = titleHeight + "px";
            $title.setAttribute("data-orgheight", titleHeight);
        }
        
        var $contentView = _$("#contentView"); 
        if(cmp.device.orientation && cmp.device.orientation() =="landscape"){//横屏
        	$contentView.style.height = (bodyHeight - fHeight - tagHeight - formViewHeight + 20) + "px";
        }else{
        	$contentView.style.height = (bodyHeight - fHeight - tagHeight - formViewHeight + 10) + "px";
        }
        $contentView.setAttribute("data-mintop", tagHeight + headerH + formViewHeight - 11);
        $contentView.setAttribute("data-maxtop", bodyHeight - fHeight - lHeight + headerH);
    }
}


//附件区域显示和影藏
function _toggleContent(show){
    
	var tContentViewEl = _$("#contentView");
    if(pageX.toggleLableCount == 0){
        //没有意见
    	tContentViewEl.style.display = "none";
        return;
    }else{
    	tContentViewEl.style.display = "";
    }
    
    var cHeight = 0,
        tClass = tContentViewEl.classList;
    
    if(show){
        if(!tClass.contains("comment_animation")){
            tClass.add("comment_animation");
        }
        cHeight = tContentViewEl.getAttribute("data-mintop");
        pageX.isComentShow = true;
        _toggleTitle(false, "byContent");
    }else{
        if(tClass.contains("comment_animation") && !pageX.isComentShow){
            tClass.add("comment_animation");
        }
        cHeight = tContentViewEl.getAttribute("data-maxtop");
        pageX.isComentShow  = false;
        _toggleTitle(true, "byContent");
    }
    tContentViewEl.style.top = parseInt(cHeight) + "px";
}

/**
 * 影藏标题区域
 */
function _toggleTitle(show, tFrom){

    var $title = _$("#summary_titile_container"),
        tHeight = 0,
        nowHeight = $title.style.height,
        formCode = tFrom + "-show";
    
    if(show){
        tHeight = parseInt($title.getAttribute("data-orgheight"), 10);
    }
    
    if(nowHeight != (tHeight + "px")){
        
        var toLayout = true;
        if(tFrom){
            if(!show){
                $title.setAttribute(formCode, "1");
            }else{
                if("1" != $title.getAttribute(formCode)){
                    toLayout = false;
                }
                $title.setAttribute(formCode, "0");
            }
        }
        if(toLayout){
            if(!$title.classList.contains("title_animation")){
                $title.classList.add("title_animation");
            }
            $title.style.height = tHeight + "px";
            _initLayout(true, tHeight);
            if(tFrom != "byContent"){
                _toggleContent(false);
            }
            if(summaryBO["summary"].bodyType == "20"){

                setTimeout(function(){
                    SeeyonContent.reLayout("newInputPosition", pageX.contentHeight);
                }, 10);
            }
        }
    }
}


//加载意见列表
function _initListView(pageLoad){
    
    var listParam = {
            imgCache:true,
            offset:{ 
                x:0, 
                y:window.innerHeight - 150
            },
            config : {
                purpose:-1,//list为空的时候，组件会清空容器，设置不清空
                customScrollMoveEvent: function (scrollY) {  //启用自定义时，其他参数不要传
                    if(scrollY > 30){
                        _toggleContent(false);
                    }
                }
            },
            onBeforeScrollMove : function(){
                if(!pageX.isComentShow){
                    _toggleContent(true);
                }
            }
        }
    
    //需要加载数据
    if(pageLoad){
        listParam = cmp.extend(true, listParam, {
            up: {
                contentdown: cmp.i18n("collaboration.page.lable.load_more"),//加载更多
                contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//加载中...
                contentnomore: cmp.i18n("collaboration.page.lable.load_nodata")//没有更多
            },
            down: {
                contentdown: cmp.i18n("collaboration.page.lable.load_more"),//加载更多
                contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//加载中...
                contentnomore: cmp.i18n("collaboration.page.lable.load_nodata")//没有更多
            }
        });
        listParam.config = cmp.extend(true, listParam.config, {
            pageSize : 20,
            params : {
                "type" : "all",
                "summaryId" :  summaryBO.summary.id,
                "affairId" : summaryBO.summary.affairId,
                "openFrom" : pageX.winParams["openFrom"]
            },
            dataFunc : _getCommentDataList,
            renderFunc : _renderCommentData
        });
    }
    
	cmp.listView("#contentView", listParam);
	
	if(!pageLoad){
	   setTimeout(fnRefreshPage, 500); 
	}
}

//分页获取所有意见
function _getCommentDataList(pDatas, options) {

    $s.Coll.summaryComment(pDatas["type"], pDatas["summaryId"], pDatas, errorBuilder({
        success : function(result) {
            var successFn = options.success;
            successFn(result);
        }
    }));
}

//数据展现
function _renderCommentData(result, isRefresh) {
    
    var newStyle = (summaryBO.summary.bodyType == '20');
    
    var replyFlag = summaryBO.pageConfig.canReply;
    
    replyFlag = replyFlag && (summaryBO.openFrom !='listWaitSend' || (summaryBO.openFrom=='listWaitSend' && summaryBO.subState=='16'));
    __rendList(result, "summary_comment_ul", replyFlag, isRefresh, "", newStyle);
    
    //刷新页面
    setTimeout(fnRefreshPage, 500);
}

/**
 * 发起者附言，或者转发附言附件初始化
 */
function _rendSendCommentAttr(comments){
  //意见附件
    for(var i = 0; i < comments.length; i++){
        var comment = comments[i];
        var attrsArray = comment["attachments"] || "[]";
        var attrs = cmp.parseJSON(attrsArray);
        if(attrs.length > 0){
            CollUtils.initAttStyle("#senderCommentAttr" + comment.id, attrs);
        }else{
            _$("#senderCommentAttr" + comment.id).remove();
        }
    }
}



/**
 * 为附件等添加切换事件
 */
function _addToggleEvent(itemId){
    
    var el = _$("#" + itemId);
    if(el){
        
        pageX.toggleLableCount += 1;
        
        el.querySelector(".attach-title").addEventListener("tap", function(){
            
            if(!pageX.isComentShow){
                _toggleContent(true);
                return;
            }
            
            var eBody = this.nextElementSibling;
            var eClass = eBody.classList;
            if (eClass.contains('display_none')) {
                eClass.remove('display_none');
            }else{
                eClass.add('display_none');
            }
            
            var icon = this.querySelector('[class*="see-icon-v5-common-arrow"]');
            var iClass = icon.classList;
            if(!iClass.contains("see-icon-v5-common-arrow-right")){
                
                var iRClass = 'see-icon-v5-common-arrow-top';
                var iAClass = 'see-icon-v5-common-arrow-down';
                if (iClass.contains(iAClass)) {
                    var tAClass = iRClass;
                    iRClass = iAClass;
                    iAClass = tAClass;
                }
                
                iClass.remove(iRClass);
                iClass.add(iAClass);
            }
            
            fnRefreshPage();
        });
    }
}

//绑定事件
function _bindEvent(){
    
    //处理人列表
    _$("#allAffairBtn").addEventListener("tap", function(){
        _initHandlerList("all");
    });
    
    var $dBtn = _$("#dataRelationBtn");
    if($dBtn){
        $dBtn.addEventListener("tap", function(){
            openDataRelationWin();
        });
    }
    
    //工作流展现
    _$("#workflowBtn").addEventListener("tap", _editWorkflow);
    
    //此处监听sui_form_customcontrol_render事件，当表单中自定义控件发生渲染时，会触发此事件
    document.addEventListener('sui_form_customcontrol_render', function(e){
    	_customcontrol_meetingroom_init(e);
    });
}

//处理人列表
function _initHandlerList(type){
    var nextPageData = {
            "tab" : type,
            "allCount" : summaryBO.affairCount.all,
            "runningCount" : summaryBO.affairCount.running,
            "affairId" : summaryBO.summary.affairId,
            "summaryId" : summaryBO.summary.id,
            "canHasten" : summaryBO.pageConfig.canHasten,
            "cache_subfix" : pageX.winParams.cache_subfix,
            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
        };
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/details/handler_details.html"+colBuildVersion, nextPageData, {openWebview : true});
}


/** 编辑流程 **/
function _editWorkflow(){
    
    _formLoadCheck({
           checkCallback : function(ret){
               if(ret == true){
                   //TODO 如果是非编辑状态下就不需要这个判断了
                   //表单校验判断
                   if(summaryBO.pageConfig.canDeal 
                           && summaryBO["summary"].bodyType == "20"){
                       if(cmp.sui.isPreventSubmit()){
                           //表单失去焦点校验失败,阻止跳转
                           return;
                       }
                   }
                   if(_summaryRepeatClk){
                       return;
                   }
                   _summaryRepeatClk = true;
                   
                   //这里传参要和点击处理一致, 表单有office正文不允许处理
                   var pageParams = {
                       "canEditWorkflow" : summaryBO.formIsLock === true ? false : pageX.viewCanEdit,
                       "action" : CopyWorkFlowLock.SUBMIT,// 提交操作
                       "cache_subfix" : pageX.winParams.cache_subfix,
                       "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
                       "edit" : true,
                       "canBack" : false
                   }
                   summaryBO.backIndex = summaryBO.backIndex + 1;
                   cmp.event.trigger("beforepageredirect", document);
                   cmp.href.next(_collPath + "/html/details/workflowEdit.html?cmp_orientation=auto" + $version_and, pageParams, {openWebview : true});
               }
           }
       });
}


//表单视图切换时页面布局
function _layout4formView(tValue, reLayout){
    var foot = _$("#footer_btns");
    if(foot && summaryBO["summary"].listType != "onlyView" && summaryBO.pageConfig.canDeal){
        /** 意见更多页面屏蔽，但是先别删代码，产品经理可能会后悔 **/
    	/*var mcb = _$("#more_comment_btn");*/
        var oldDisplay = foot.style.display
        if(tValue != "0"){
            pageX.viewCanEdit = false;
            //只有第一个视图可以处理
            foot.style.display = "none";
            /*if(mcb){
            	mcb.style.display = "none";
            }*/
        }else{
            foot.style.display = "";
            pageX.viewCanEdit = true;
            /*if(mcb){
            	mcb.style.display = "";
            }*/
        }
        if(reLayout !== false && oldDisplay != foot.style.display){
            _initLayout(false, null, false);
            _toggleContent(false);
        }
    }
}

/**
 * 表单多视图进行切换
 */
function _switche2View(index, toConfirm){
    
    if(pageX.viewsLenth < 1){
        return;
    }
    
    var tabIndex, _this, isoffice, leaveOffice, classname, tabsContainer;
    
    tabsContainer = _$("#form_views");
    if(typeof index == "object"){
        _this = index;
    }else{
        _this = _$("li[index='" + index + "']", false, tabsContainer);
    }
    
    tabIndex = _this.getAttribute("index");
    isoffice = _this.getAttribute("isOffice") == "true";
    leaveOffice = pageX.cache.focusOffice && !isoffice;
    classname = "selected";
    
    if(tabIndex != pageX.cache.formIndex || leaveOffice){
        
        function callback(){

            //切换tab 
            var tabs = tabsContainer.querySelectorAll("li");
            for(var k = 0, len = tabs.length; k < len; k++){
                var t = tabs[k];
                if(t.classList.contains(classname)){
                    t.classList.remove(classname);
                }
            }
            _this.classList.add(classname);
            //滚动页签到可视区域
            if(pageX.viewScroll){
                var minX, maxX,begin,layIndex, toX;
                
                layIndex = parseInt(_this.getAttribute("layIndex"), 10);
                minX = Math.abs(pageX.viewScroll.x);
                maxX = minX + pageX.viewCtWidth;
                begin = layIndex * pageX.viewItemWidth;
                end = begin + pageX.viewItemWidth;
                if(minX > end || end > maxX){
                    toX = -Math.min(begin, pageX.viewWidth - pageX.viewCtWidth);
                    pageX.viewScroll.scrollTo(toX, 0);
                }
            }
            
            if(isoffice){
                if(!pageX.cache.focusOffice){
                    pageX.cache.focusOffice = true;
                    _$("#newInputPosition").style.display = "none";
                    _$("#form_body").style.display = "";
                }
            }else{
                if(pageX.cache.focusOffice){
                    pageX.cache.focusOffice = false;
                    _$("#newInputPosition").style.display = "";
                    _$("#form_body").style.display = "none";
                }
            }
            
            if(isoffice){
                //初始化正文
                SeeyonContent.init({
                    "target" : "form_body",
                    "bodyType" : SeeyonContent.getBodyCode(_this.getAttribute("extension")),
                    "content" : _this.getAttribute("fileId"),
                    "moduleType" : "1",
                    "lastModified" : _this.getAttribute("lastModified")
                });
            }else if(tabIndex != pageX.cache.formIndex){
                
                _cacheSignet(true);//缓存签章
                
                var  _tIsLightForm = pageX.cache.viewLight["" + tabIndex];//_this.getAttribute("isLightForm") === "true";
                //加载表单数据
                SeeyonContent.instance("newInputPosition").loadForm(tabIndex,{
                    isLightForm : _tIsLightForm,
                    loadCallback : function(){
                        
                        _layout4formView(tabIndex);
                        pageX.cache.formIndex = tabIndex;
                        pageX.cache.isLightForm = _tIsLightForm;
                        
                        //if(pageX.cache.isLightForm){//轻表单切换视图
                            initSignet();
                        //}
                    }
                });
            }
        }
        
        if(toConfirm === true){
            //切换表单视图移除新盖的印章
            LazyUtil.addLoadedFn("lazy_iSignaturePhone", function(){
                deleteSignatureButton(callback);
            });
        }else{
            callback();
        }
    }
}

//表单多视图展示
function _initFormViews(){
    
    if(pageX.cache.formIndex != "0") {
        _layout4formView(pageX.cache.formIndex, false);
    }
    
  //切换视图, CAP3视图切换还托管在协同这边
    if(pageX.viewsLenth > 0){
        LazyUtil.addLoadedFn("lazy_listView", function(){
            cmp("#form_views").on("tap", "li", function(){
                _switche2View(this, true);
            });
        })
    }
    
    if(pageX.viewsLenth > pageX.viewMax){
        LazyUtil.addLoadedFn("lazy_listView", function(){
          //滚动
            pageX.viewScroll = new cmp.iScroll(_$("#form_view_container"), {
                hScroll: true,
                vScroll: false,
                x: pageX.cache.scollLeft,
                y: 0,
                bounce: false,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: true,
                handleClick: true
            });
        });
    }
    
    //Office正文
    if(summaryBO.pageConfig.canDeal){
        var $handleBtns = _$("#handleBtns") || _$("#otherBtns");
        if($handleBtns){
            $handleBtns.style.display = "";
        }
    }
}

//返回上一个页面
function _goBack(){

    //异常删除点击了返回的情况, 解决微协同打开office查看，返回时页面跳转问题
    if(cmp.href.backAbnormal()){
        return;
    }
    
    //防止爆点
    if(pageX.exeLock){
        return;
    }
    pageX.exeLock = true;
    
    if(window.summaryBO && summaryBO.editParam){
    	cmp.notification.confirm(cmp.i18n("collaboration.edit.office.content.confirm.save"),function(e){ //e==1是/e==0 否
    		if(e==1){
    			cmp.contentEdit.clear({
    				fileId : summaryBO.content.fileId,
    				lastModified : summaryBO.content.lastModified
    			});
				__goBack();
	        }else{
				pageX.exeLock = false;
	        }
	    },null, [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
    }else{
    	__goBack();
    }
}

function __goBack(){
	//触发删除缓存
    cmp.event.trigger("deletesessioncache", document);
    if(window.summaryBO && summaryBO["summary"].bodyType == "20"){
    	if(cmp.sui && typeof cmp.sui.clearCache == "function"){
    	    var options = { 
                    moduleId:summaryBO["summary"].id,
                    rightId:summaryBO["summary"].rightId,
                    viewState: summaryBO._viewState,
                    operateType : summaryBO._viewState
            }
    	    try{
    	        //CAP4会报错， 这里做容错处理
    	        cmp.sui.clearCache(options);
    	    }catch (e) {
    	        //
            }
    	}
    }
    
    if(cmp.webViewListener){
        cmp.webViewListener.fire({
            type: "coll.ListRefresh",
            data: {refreshList: 'true'}
        });
    }
    
    //解锁
    unlockCollAll(function(){
        var backN = 1;
        if(window.summaryBO && summaryBO.backIndex){
            backN += summaryBO.backIndex;
        }

        if(backN > 1){
            setListViewRefresh("true");
            cmp.href.back(backN);
        }else{
        	if(pageX.winParams && pageX.winParams.fromXz && pageX.winParams.fromXz != ""){
				cmp.href.closePage();
			}else{
				cmp.href.back();
			}
        }
    });
}

function _initBackEvent(){
	
	var isFromM3NavBar = window.location.href.match('m3from=navbar');

	if( isFromM3NavBar ) {
	    //移除返回UI
	    _$('#goAheadBtn').classList.add("display_none");

	    //处理安卓物理返回事件 
	    cmp.backbutton();
	    cmp.backbutton.push(cmp.closeM3App);
	   
	} else {
		cmp.backbutton();
	    cmp.backbutton.push(_initContinueFinish);
	    _$("#goAheadBtn").addEventListener("tap", _initContinueFinish);
	    
	    //监听微协同的关闭窗口不太稳定， 暂时先不调用了， 引起的问题最多就是 3分钟内表单不解锁
	    //cmp.event.listenClosePage(_initContinueFinish);
	}
}

function _initContinueFinish() {
    
    //校验是否做了编辑
	if(pageX.editWorkflow === true ||
	        CollUtils.loadCache(CollCacheKey.summary.comment + pageX.winParams.cache_subfix, false) != null) {
		//是否放弃处理
		var items = [{key:"yesFinish",
		              name:"<span style='color:#ff0000'>" + cmp.i18n("collaboration.page.lable.abandonDeal") + "</span>"
		              }]; //放弃处理
	    cmp.dialog.actionSheet(items, cmp.i18n("collaboration.page.lable.button.cancel"),function (data){
	    	if(data.key=="yesFinish") {
	    		setListViewRefresh("false");
	    		_goBack();
	    	}
	    });
	} else {
		setListViewRefresh("false");
		_goBack();
	}
}

//协同解所有锁
function unlockCollAll(callback) {
    
    var lockAffairId = pageX.winParams.affairId;
    
    if (window.summaryBO) {
        if(summaryBO.pageConfig && summaryBO.pageConfig.canDeal){
            lockAffairId = summaryBO["summary"].affairId;
        }else{
            lockAffairId = null;
        }
    }
    
    if(!pageX.isInitError && pageX.winParams.openFrom == "listPending" && lockAffairId && lockAffairId != "-1"){
        cmp.dialog.loading(true);
        $s.Coll.unlockCollAll({
            "affairId" : lockAffairId
        }, errorBuilder({
            success : function(result) {
                callback();
            },
            error : function(e){
                callback();
            },
            exeSelfError : true
        }));
    }else{
        callback();
    }
}

/**
 * 缓存签章dom
 */
function _cacheSignet(isClearSignet){
    var signets, signetHTML = "";
    signets = _$(".signatureImgDiv", true, _$("#newInputPosition"));
    var __signets = [];
    var ids = signatureId.split(',');
    if(signets && signets.length > 0){
    	//当前操作签的章，切换视图时会清除，轻原表单切换时不会清除
    	if(ids && ids.length>1 && isClearSignet){
    		for(var i = 0; i < signets.length; i++){
    			var isNewSignet = false;
    			for(var j = 0; j<ids.length-1;j++){
		        	if(signets[i].id.indexOf(ids[j])!="-1"){
		        		isNewSignet = true;
		        	}
    			}
    			if(!isNewSignet){
    				__signets.push(signets[i]);
    			}
    		}
    		if(__signets && __signets.length > 0){
    			for(var i = 0; i<__signets.length;i++){
    				signetHTML += __signets[i].outerHTML;
    			}
    		}
    	}else{
    		if(signets && signets.length > 0){
    			for(var i = 0; i<signets.length;i++){
    				signetHTML += signets[i].outerHTML;
    			}
    		}
    	}
    }
    pageX.cache.signets = iSP.signatures;
    pageX.cache.thatObj = iSP.getThisObj();
    pageX.cache.signetDom = signetHTML;
    pageX.cache.signetFieldDom = _$("#protectData").innerHTML;
}

function initSignet(){//初始化签章控件
    
    LazyUtil.addLoadedFn("lazy_iSignaturePhone", function(){
        if(pageX.cache.signetDom){
            
           // _$("#newInputPosition").insertAdjacentHTML("beforeEnd", pageX.cache.signetDom);
            if(summaryBO.content.isCAP4 && _$(".cap4-formBody__container")){
				_$(".cap4-formBody__container").insertAdjacentHTML("beforeEnd",pageX.cache.signetDom);
			}else{
				_$(".sui-form-content").insertAdjacentHTML("beforeEnd",pageX.cache.signetDom);
			}
            _$("#protectData").innerHTML = pageX.cache.signetFieldDom;
            if(pageX.cache.signets){
            	var _isignatureIds = _$(".signatureImgDiv",true);
            	for(var i = 0; i<_isignatureIds.length;i++){
            		iSP.reBindEvent(_isignatureIds[i].getAttribute("signatureId"),pageX.cache.signets,pageX.cache.thatObj);
            	}
            }
        }else{
            
            
            function _doShowSign(formData){
                var protectData = $("#protectData");
                var _data = "";
                if(protectData.text() == ""){//如果已经生成了dom
                    if(formData){
                        for(var key in formData ){
                            _data = formData[key].data;
                            if(formData[key].fieldType=="select" && formData[key].data==""){
                                _data = ["0"];
                            }
                            protectData.append($("<span id = 'my:"+key+"' style='display: none'></span>").text(_data.join(";")));
                        }
                    }
                }
                var _canDeal = false;
                if(_$("#handleBtns") && pageX.winParams["openFrom"] !="glwd" && pageX.winParams["openFrom"] !="docLib"){
                    _canDeal = true;
                }
                initIsignature(summaryBO.summary.id, _canDeal);
            }
            
            
            function protectDomIsLoad(){
            	var protectData = $("#protectData");
            	if(protectData.text() != "" || !summaryBO.content.isForwardForm){
            		var tFormData = null;
            		_doShowSign(tFormData);
            	}else{
            		setTimeout(function(){
            			protectDomIsLoad();
            		}, 10);
            	}
            }
            
            if(summaryBO["summary"].bodyType == "20"){
                LazyUtil.addLoadedFn("lazy_form", function(){
                    try{
                    	cmp.sui.getFormProtectedData('',function(msg,tFormData){
                        	_doShowSign(tFormData);
                        });
                        
                    }catch (e) {
                        console.error("cmp.sui.getFormProtectedData, e=" + e);//加载签章数据报错
                    }
                });
            }else{
                protectDomIsLoad();
                
            }
        }
    });
}

//注册成全局的，原表单也会调用
function onContentScollButton(){
  
    //正文未加载后才执行
    if(_isContentInit){
        if(pageX.toggleLableCount != 0){
            _toggleContent(true);//展示意见区域
        }
    }
}

//注册成全局的，原表单也会调用
function onContentScollTop(top, directionY){
 
    //正文未加载后才执行
    if(_isContentInit){
        
        if(!arguments || arguments.length == 0){
            _toggleTitle(true);
        }else{
            //-1下拉， 1上拉
            if(directionY == -1 && top < 10){
                _toggleTitle(true);
            }else if(directionY == 1 && top > 10){
                _toggleTitle(false);
            }
        }
    }
}

//正文加载完成后方法
function _contentInit(){
   
    cmp.dialog.loading(false);
    
    if(window.summaryBO.info_msg){
        _alert(window.summaryBO.info_msg);
        delete window.summaryBO.info_msg;
    }
    
    _isContentInit = true;
    
    if(pageX.cache.focusOffice){
        //正文初始化时，不是在正文页签
        pageX.cache.focusOffice = false;
        _switche2View(pageX.officeIdex, false);
    }
    
  //启动正文后面的问价
    LazyUtil.startLazy();
    setTimeout(function(){
        initSignet();
     }, 10);
}

//加载正文
function _initContent(){
    
    //重复加载正文判定
    if(pageX.initContent){
        return;
    }
    pageX.initContent = true;
    
    
    var bodyType, content;
    
    content = summaryBO.content;
    
    if(content != null){
        
        if(typeof pageX.cache.isLightForm != "boolean"){
            pageX.cache.isLightForm = content["isLightForm"];
        }
        
        bodyType = content["contentType"];
        
        
        var contentConfig = {
                "target" : "newInputPosition",
                "bodyType" : bodyType,
                "content" : "",
                "moduleType" : "1",
                "momentum" : true,
                "onload" : _contentInit,
                //"onScrollBottom" : onContentScollButton, 屏蔽这个方法， 不自动拉起意见了
                "onScroll" : onContentScollTop
            }
        
        if(summaryBO.content.isCAP4 !== true){
            //CAP4需要占位符号，  其他正文只需要容器
            _$("#newInputPosition").innerHTML = "";
        }
        
        //正文
        if(bodyType == SeeyonContent.getBodyCode("FORM")
        	||(bodyType == SeeyonContent.getBodyCode("HTML") && summaryBO.content.isCAP4) ){
	            if(bodyType == SeeyonContent.getBodyCode("HTML") && summaryBO.content.isCAP4){
	            	//pageX.cache.isFormForward = true;
	                contentConfig.bodyType = "cap4-Forward";
	            }
             contentConfig.content = content["moduleId"];
             contentConfig.ext = {
                 "isLightForm" : pageX.cache.isLightForm,
                 rightId : content["formRightId"],
                 viewState : summaryBO._viewState,
                 allowQRScan : summaryBO.summary.canScanCode =="1"?  true :false ,
                 //原样表单参数
                 "openFrom" : pageX.winParams["openFrom"],
                 "isNew" : false,
                 "templateId" : summaryBO.summary.templateId,
                 "indexParam" : pageX.cache.formIndex || "0",
                 "contentDataId" : content["contentDataId"],
                 "affairId" : summaryBO.summary.affairId,
                 "isCAP4" : summaryBO.content.isCAP4,
                 "onChangeViewEvent" : function(event){
                     
                     var index = event.index;
                     var continueFn = event.continueFn;
                     
                     _layout4formView(index);
                     pageX.cache.formIndex = index;
                     
                     //回调继续切换视图
                     if(continueFn){
                         continueFn();
                     }
                     //返回true， 告诉表单可以切换
                     return true;
                 }
             }
             
             
            if(summaryBO.content.isCAP4 !== true){
                
                //CAP4没有切换轻表单原表单
                // CAP4新增轻原表单切换， 默认为轻表单
            }
            
            if(!(bodyType == SeeyonContent.getBodyCode("HTML") && summaryBO.content.isCAP4)){
            	
            	var tsBtn = _$("#handler_switch_btn"),
                __moduleId = content["moduleId"],
                __right = content["formRightId"];
                
            	if(!(summaryBO.content.isCAP4 && !(summaryBO.content["hasPCForm"] && summaryBO.content["isLightForm"]))){
            		tsBtn.classList.remove("display_none");
                    _dragThis('handler_switch_btn');
                    //新建引导 获取本地缓存, 微信端保存不了localstorage，改用DB
                    cmp.storageDB.get("m3_v5_collaboration_summary_src_form_flag", function(val) {
                        var isHit = val.data;
                        if (!isHit || isHit != "true") {
                            var hitEle, hitType;
                            hitEle = _$("#src_form_view_hint");
                            hitType = pageX.cache.isLightForm ? cmp.i18n("collaboration.page.lable.srcForm") : cmp
                                    .i18n("collaboration.page.lable.lightForm");
                            _$("#src_form_view_hint_txt", false, hitEle).innerHTML = cmp.i18n("collaboration.page.lable.srcFormHit", [ hitType ])
                            
                            hitEle.classList.remove("display_none");
                            
                         // 这里要用click， tap要被穿透
                            hitEle.querySelector(".btn").addEventListener("click", function(e) {
                                
                             // 事件被点穿了
                                e.stopPropagation();
                                
                                cmp.storageDB.save("m3_v5_collaboration_summary_src_form_flag", "true", null, true);
                                _$("#src_form_view_hint").classList.add("display_none");
                            });
                        }
                    }, true);
                    
                    
                  //原表单切换
                    tsBtn.addEventListener("tap", function(e){
                        
                        var _hitType = !pageX.cache.isLightForm ? cmp.i18n("collaboration.page.lable.srcForm") : cmp.i18n("collaboration.page.lable.lightForm");
                        _$("#src_form_view_hint_txt", false, _$("#src_form_view_hint")).innerHTML = cmp.i18n("collaboration.page.lable.srcFormHit", [_hitType]);
                        
                        // 标记正文没有加载完成
                        _isContentInit = false;
                        
                        
                        if(summaryBO.content.isCAP4 === true){
                            
                            //
                            //  CAP4 切换轻原表单的原理是使用 go 方法进行整个页面刷新
                            //
                            
                            cmp.sui.switchForm(function(args){
                                
                                // 触发数据保存
                                // {switchFrom: 'light'}
                            	 _cacheSignet(false);//缓存签章
                                var fromFormType, fromFormIndex, formMasterId;
                                
                                fromFormType = args.switchFrom;
                                formMasterId = args.formMasterId;
                                fromFormIndex = args.indexParam;
                                
                                // 这里逻辑是相反的
                                pageX.cache.isLightForm = fromFormType === "origin";
                                //pageX.cache.formIndex = fromFormIndex || 0;
                                // CAP4的视图切换始终保持在第一个, CAP限制是这样的 CAPF-14484
                                pageX.cache.formIndex = "0";
                                
                                // 触发页面数据缓存
                                cmp.event.trigger('beforepageredirect', document, {changeFormType: true});
                                
                                var nextUrl = _collPath + "/html/details/summary.html?_r=1" + $version_and;
                                
                                pageX.winParams.formMasterId = formMasterId;
                                pageX.winParams.switchFrom = fromFormType;
                                
                                if(pageX.isFromURLData){
                                    nextUrl += CollUtils.transObj2Url(pageX.winParams, "&", true, "");
                                }
                                
                                cmp.href.go(nextUrl, pageX.winParams);
                            });
                            
                        }else{
                            
                            //切换到表单页签
                            _switche2View(pageX.cache.formIndex, false);
                            
                            _cacheSignet(false);//缓存签章
                            SeeyonContent.instance("newInputPosition").loadForm(pageX.cache.formIndex, {
                                isLightForm : !pageX.cache.isLightForm,
                                loadCallback : function(){
                                    _isContentInit = true;
                                    pageX.cache.isLightForm = !pageX.cache.isLightForm;
                                    
                                    pageX.cache.viewLight["" + pageX.cache.formIndex] = pageX.cache.isLightForm;
                                    
                                    initSignet();
                                }
                            });
                        }
                    });
            		
            		
            	}
            	
        	
            } 
            
            
       }else if(bodyType == SeeyonContent.getBodyCode("HTML") && !content.isForwardForm){
           //HTML正文
           contentConfig.content = content["contentHtml"];
           contentConfig.ext = {
                   reference : summaryBO.summary.id
           }
       }else if(bodyType == SeeyonContent.getBodyCode("HTML") && content.isForwardForm){
           
           pageX.cache.isFormForward = true;
           contentConfig.bodyType = "20-Forward";
           contentConfig.content = content["moduleId"];
           contentConfig.ext = {
                   
                   isNew : false,
                   viewState : summaryBO._viewState,
                   "openFrom" : pageX.winParams["openFrom"],
                   templateId : summaryBO.summary.templateId,
                   
                   
                   rightId : content["formRightId"],
                   allowQRScan : false,
                   "indexParam" : "0",
                   "contentDataId" : content["contentDataId"],
                   "affairId" : summaryBO.summary.affairId,
                   "isLightForm" : false,
               }
       }else{
            contentConfig.content = content["fileId"];
            contentConfig.lastModified = content["lastModified"]; 
        }

        //初始化正文
        SeeyonContent.init(contentConfig);
        contentConfig = null;
    }else{
        cmp.dialog.loading(false);
        _alert(cmp.i18n("collaboration.nodata.content"), _goBack);
    }
}


//附言按钮
function _showSenderComment(canAdd){
    var tempBtn = _$("#add_sender_comment");
    if(!canAdd){
        tempBtn.remove();
    }else{
        tempBtn.addEventListener("tap", function(e) {
            
            e.stopPropagation();//阻止冒泡
            
            var nextPageData = {
                "cache_subfix" : pageX.winParams.cache_subfix,
                "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
            };
            cmp.event.trigger("beforepageredirect",document);
            cmp.href.next(_collPath + "/html/details/addSenderComment.html"+colBuildVersion, nextPageData);
        });
        tempBtn.classList.remove("display_none");
    }
}


//刷新页面布局
function fnRefreshPage() {
  //延迟加载意见
    LazyUtil.addLoadedFn("lazy_listView", function(){
        cmp.listView("#contentView").refresh();
    });
}

//打开相关数据页面
function openDataRelationWin(){
    var templateId = summaryBO.summary.templateId;

    var formMasterId = -1;
    var formData = {};

    //取表单数据，报错的话则传递默认值
    try{
        formMasterId = window.s3scope.formMasterId;
        formData = window.s3scope.data.master;
    }catch(e){
    	formMasterId = -1;
    	formData = {};
    }
    var activityId = summaryBO.summary.activityId;
    if(summaryBO.openFrom == "listWaitSend" || summaryBO.openFrom == "listSent"){
    	activityId = "start";
    }
    var params = {
        templateId : summaryBO.summary.templateId,
        activityId : activityId,
        DR : summaryBO.summary.dr,
        affairId : summaryBO.summary.affairId,
        projectId : summaryBO.summary.projectId,
        summaryId : summaryBO.summary.id,
        memberId : summaryBO.affairMemberId,
        senderId : summaryBO.summary.startMemberId,
        affairState : summaryBO.summary.affairState,
        formMasterId : formMasterId,
        nodePolicy : summaryBO.currentPolicy.id,
        formData : formData  //表单内容
    };
    cmp.event.trigger("beforepageredirect",document);
    cmp.href.next(_collPath + "/html/dataRelation.html"+colBuildVersion, params);
}
var moveFuc;
function _dragThis(obj,parentNode){
    var dragObj = document.getElementById(obj);
    if(parentNode){
        var parentNode = document.getElementById(parentNode);
        var pWidth = parentNode.clientWidth,pHeight = parentNode.clientHeight;
    }else{
        var pWidth = window.screen.width;
        var pHeight = window.screen.height;
    }
    dragObj.addEventListener('touchstart',function(event){
        
        //当只有一个手指时              .
        if(event.touches.length == 1){
            //禁止浏览器默认事
            event.preventDefault();
        };
        var touch = event.targetTouches[0];
        var disX = touch.clientX - dragObj.offsetLeft,disY = touch.clientY - dragObj.offsetTop;
        var oWidth = dragObj.offsetWidth,oHeight = dragObj.offsetHeight;
        moveFuc = function (event){
            
          //拖动的时候就隐藏提示的那个区域
            var $formViewChangeHitClass = _$("#src_form_view_hint").classList;
            if(!$formViewChangeHitClass.contains("display_none")){
                $formViewChangeHitClass.add("display_none");
            }
            
            var touch = event.targetTouches[0];
            dragObj.style.left = touch.clientX - disX  + 'px';
            dragObj.style.top = touch.clientY - disY + 'px';
            //控制上下左右不溢出父级区域
            if(dragObj.offsetTop <= 0){
                dragObj.style.top = 0;
            };
            if(dragObj.offsetTop >= pHeight - oHeight){
                dragObj.style.top =  pHeight - oHeight + 'px';
            };
            if(dragObj.offsetLeft <=0){
                dragObj.style.left = 0;
            };
            if(dragObj.offsetLeft >= pWidth -oWidth){
                dragObj.style.left =  pWidth - oWidth + 'px';
            };
        }
        dragObj.removeEventListener('touchmove',moveFuc,false);
        dragObj.addEventListener('touchmove',moveFuc,false);
    });
}/**
 * 意见显示公共函数，只是做合并使用
 */

/**
 * 渲染意见列表
 */
function __rendList(comments, containerId, replyFlag, isRefresh, _containerId, newStyle){
    
	//表情转换
	var emojiUtil = cmp.Emoji();
    for (var i = 0; i < comments.length; i++) {
    	comments[i].content = emojiUtil.StringToEmoji(comments[i].content);
    }
    var tplParams = {"comments" : comments, 
            "replyFlag": replyFlag,
            "containerId" : containerId,
            "canPraise" : summaryBO.summary.canPraise,
            "subState" : summaryBO.subState,
            "openFrom" :summaryBO.openFrom,
            "width" : "100%"
           }
    
    var commentHTML = "";
    var $commentContainer = _$("#" + containerId);
    
    //容器宽度
    var containerWidth = $commentContainer.clientWidth;
    if(containerWidth > 0){
        tplParams.width = containerWidth;
    }
    
    if(newStyle === true){
        commentHTML = mplus_apps_collaboration.form_comment_template(tplParams);
    }else {
        commentHTML = mplus_apps_collaboration.comment_template(tplParams); 
    }
    
    
    if(isRefresh){
        $commentContainer.innerHTML = commentHTML;
    }else{
        $commentContainer.insertAdjacentHTML("beforeEnd",commentHTML); 
    }
    
    if(comments.length == 0 && _$("#"+ _containerId)){
        _$("#" + _containerId).remove();
    }
    
    // 人员头像
    for(var t = 0; t < comments.length; t++){
        (function(){
            var createId=comments[t].createId;
            var _replyColUser="#replyColUser_"+t;
            if(_containerId){ // 处理转发
                _$(_replyColUser).id="replyColUser_"+t+_containerId;
                _replyColUser="#replyColUser_"+t+_containerId;
            }
            _$(_replyColUser).addEventListener("tap", function(){
                if(/^-?\d+$/.test(createId)){
                    cmp.visitingCard(createId);
                }
            });
        }(t));
    }
    
    //意见附件
    for(var i = 0; i < comments.length; i++){
        var comment = comments[i];
        var attrs = cmp.parseJSON(comment["attachments"]);
        if(attrs.length > 0 && comment.canView){
            CollUtils.initAttStyle("#" + containerId + "_commentAttr" + comment["id"],attrs);
        }else{
            _$("#" + containerId + "_commentAttr" + comment["id"]).remove();
        }
        //回复
        var subReplys = comment["subReplys"];
        if(subReplys && subReplys.length > 0){
            for(var j = 0; j < subReplys.length; j++){
                var subComment = subReplys[j];
                var subAttrsArray = subComment["attachments"] || "[]";
                var subAttrs = cmp.parseJSON(subAttrsArray);
                if(subAttrs.length > 0 && subComment.canView){
                    CollUtils.initAttStyle("#" + containerId + "_subCommentAttr" + subComment["id"], subAttrs);
                }else{
                    _$("#" + containerId + "_subCommentAttr" + subComment["id"]).remove();
                }
            }
        }
    }
}


/**
 * 意见点赞
 */
function _doLikeComment(){
    
    var commentId = this.getAttribute("commentId");
    var likeNum =parseInt(this.getAttribute("likeNum"), 10);
    var isAdd = true;
    if(this.classList.contains('cmp-active')){
        likeNum = likeNum - 1;
        isAdd = false;
    }else{
        //增加赞
        likeNum = likeNum + 1;
    }
    var likeBtns = document.querySelectorAll('.comment_like_btn_' + commentId);
    var likeNums = document.querySelectorAll('.comment_like_num_' + commentId);
    for(var i = 0, len = likeBtns.length;i<len;i++){
        likeNums[i].innerText = likeNum;
        likeBtns[i].setAttribute("likeNum", likeNum);
        if(isAdd){
            likeBtns[i].classList.add('cmp-active');
            likeNums[i].style.color = "#3AADFB";
        }else{
            likeBtns[i].classList.remove('cmp-active');
            likeNums[i].style.color = "#C7C7CC";
        }
    }
    $s.Coll.likeComment(commentId, {}, errorBuilder({
        success : function(result) {
            //
        }
    }));
}

//意见回复
function _showReplyBtns(container){
    
    //回复意见
    cmp(container).on("tap", ".replay_btn", function(){
        _replyComment(this.getAttribute("commentId"));
    });
    //点赞
    cmp(container).on("tap", ".comment_like_btn", _doLikeComment);
}

//回复意见
function _replyComment(commentId){
    
    var nextPageData = {
            "cache_subfix" : pageX.winParams.cache_subfix,
            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
            "commentId" : commentId
    }
    cmp.event.trigger("beforepageredirect", document);
    cmp.href.next(_collPath + "/html/details/replyComment.html"+colBuildVersion, nextPageData);
}/**
 * 协同H5表单自定义控件js
 * @author wxju
 * @since V5-A8 7.0
 */


var _room_storge_key = "m3_v5_collaboration_newCol_room_cache_key_";

/**
 * 初始化表单自定义控件
 */
function _customcontrol_meetingroom_init(e) {
	var fieldMessage = e.detail.data.model;
	var fieldInfoMessage = e.detail.data.fieldInfo;
	
	if (fieldMessage!=null && fieldMessage.fieldName!=null) {
		if (null != e.detail.data.model.extMap.extendParam) {
			var extendParam = JSON.parse(e.detail.data.model.extMap.extendParam);
			var str = 'customcontrol_' + extendParam.key;
			if (typeof window[str] === 'function') {
				window[str].call(this, e);
			}
		}
	}
}
//会议室选择自定义控件实现方法
function customcontrol_351000(param) {
	if (param.detail.data.model.auth === 'browse') {
		//如果是浏览态就不做组件的替换了，直接返回，当然客户也可以根据需要自己替换html代码片段，实现浏览态时的效果
		return;
	}

	//根据传进来的组件类型以及字段的表名，字段名，记录id等生成组件唯一的标识符
	var uuid = 'customcontrol_351000_'
			+ param.detail.data.fieldInfo.ownerTableName + '_'
			+ param.detail.data.recordId + '_'
			+ param.detail.data.fieldInfo.name;
	//根据标识符查询页面中是否已经渲染了自定义组件
	var myComponent = document.getElementById(uuid);

	//如果当前组件已经被初始化，则直接更新数据，否则
	if (myComponent) {
		myComponent.value = param.detail.data.model.value;
	} else {
		//初始化组件，替换表单中对应的dom
		var display = param.detail.data.model.display;
		var value = param.detail.data.model.value;
		var cacheKey = _room_storge_key + param.detail.data.fieldInfo.name;//缓存的Key值
		var cacheValue = JSON.parse(cmp.storage.get(cacheKey, true));
		//清空会议室缓存
		cmp.storage["delete"](cacheKey, true);
		
		if (cacheValue!=null) {
			display = cacheValue.display;
			value = cacheValue.value;
		}
		
		var html = '<div id="'+uuid+'" class="sui-form-ctrl-value" style="width: 100%;" />'+ display + '</div>'
		html += '<i id="right_'+uuid+'" class="see-icon-v5-form-pull-right" style="display:none"></i>';
		html += '<i id="clear_'+ uuid +'" class="see-icon-v5-form-close-circle-fill" style="display:none"></i>';
		
		param.detail.data.target.innerHTML = html;
		
		//向表单数据中赋值（保存的值）
	    param.detail.data.handler.set(value);
	    param.detail.data.model.display = display;
	    
		var rightButton = document.getElementById("right_"+uuid);
		var clearButton = document.getElementById("clear_"+uuid);
		var roomInput = document.getElementById(uuid);
		
		if (display == "") {
			rightButton.style.display = "";
		} else {//显示叉
			clearButton.style.display = "";
		}

		roomInput.addEventListener('tap', function() {
			_goToChooseMeetingRoom(param,uuid,cacheKey);
		});
		rightButton.addEventListener('tap', function() {
			_goToChooseMeetingRoom(param,uuid,cacheKey);
		});
		clearButton.addEventListener('tap', function() {
			_clearRoomValue(param,uuid);
		});

	}
}

function _goToChooseMeetingRoom(param,uuid,cacheKey) {
	var params = {
			formChooseKey : cacheKey,
			action : "formChoose"
	};
	cmp.event.trigger("beforepageredirect",document);

	if(!window._meetingPath){
        if(cmp.platform.CMPShell){
            window._meetingPath = "http://meeting.v5.cmp/v";
            window.colBuildVersion = "";
        }else{
            window.colBuildVersion = "?buildversion=" + (new Date().getTime());
            window._meetingPath = "/seeyon/m3/apps/v5/meeting";
        }
    }
	
    cmp.href.next(_meetingPath + "/html/meetingRoomList.html" + colBuildVersion, params);
}

function _clearRoomValue(param,uuid) {
	var str = '';
	
	document.getElementById(uuid).innerHTML = str;
	
	param.detail.data.handler.set(str);
	param.detail.data.model.display = "";
	
	document.getElementById("clear_"+uuid).style.display = "none";
	document.getElementById("right_"+uuid).style.display = "";
}