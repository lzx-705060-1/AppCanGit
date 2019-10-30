/** 不要使用JQuery * */

var _storge_key = "m3_v5_collaboration_newCol_cache_key";
var _formHitCacheKey = "m3_v5_collaboration_new_summary_src_form_flag";
var hasloadingbar = true;
var _isContentInit = false;

var pageX = {
    cache : {
        // 下面是固定参数
        currentUser : {},
        importLevelEnum : "",
        needClone : true,
        isFromCache : false,//是否是重缓存中加载的

        // 下面是页面状态
        isLightForm : false,// 是否为轻表单

        // 下面是需要传到后台的数据
        attList : [],
        content : ""
    },
    isForm : false,
    isInitData : false,// 标记是否完成数据加载
    isSubmitting : false,
    winParams : null, // 初始化参数
    fileComponent : null,
    contentHeight : 0,
    windowHeight : window.innerHeight,
    postData : {
        attFileDomain : []
    },
    wfDesigner : null,
    inputUsers : {}
};

cmp.ready(function() {
    cmp.dialog.loading();

    // 返回事件
    _initBackEvent();

    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function() {

        // 获取传入参数
        _initParamData();
        
        pageX.isForm = !!(pageX.winParams.templateId || pageX.winParams.summaryId);

        _initLayout(function(){
            
             // 注册缓加载
            _registLazy();

            _initPageData();

            dealHeader();
        });
    },$verstion);

    document.addEventListener('beforepageredirect', function(e) {

        // 值域缓存
        pageX.cache.colMainData = CollUtils.formPostData("colMainData");
        pageX.cache.mainbodyData = CollUtils.formPostData("mainbodyDataDiv_0");

        // 缓存附件
        pageX.cache.attList = pageX.fileComponent.attObjArray;
        cmp.storage.save(_storge_key, JSON.stringify(pageX.cache), true);
    });
    
    cmp.event.orientationChange(function(res){
        /*if(res == "landscape"){ //横屏
        
        }else if(res == "portrait"){ //竖屏
            
        }*/
        _relayoutPage();
    });
});

// 数据加载
function _initPageData() {

    // 请求数据
    var summaryId = pageX.winParams["summaryId"] || "";
    var templateId = pageX.winParams["templateId"] || "";
    var subject = pageX.winParams["subject"] || "";
    var members = pageX.winParams.members || "";
    var openFrom = pageX.winParams["openFrom"] || "";

    // 缓存加载
    var cacheData = CollUtils.loadCache(_storge_key, true);
    if (cacheData) {
        
        pageX.cache = cacheData;
        pageX.isInitData = true;
        pageX.cache.isFromCache = true;
        
        _fillPage(pageX.cache);

    } else {

        var paramData = {
            "summaryId" : summaryId,
            "templateId" : templateId,
            "openFrom" : openFrom,
            "subject" : subject,
            "members" : members
        };

        $s.Coll.newColl({}, paramData, errorBuilder({
            success : function(result) {

                pageX.isInitData = true;
                _transReqData2Cache(result);
                _fillPage(pageX.cache);
            },
            alertFn : function() {
                cmp.dialog.loading(false);
                _$("#sendBtn").style.display = "none";
            }
        }));
    }
}

/** 将请求数据转换成缓存格式 * */
function _transReqData2Cache(data) {

    pageX.cache.isCAP4 = !!data.isCAP4;
    pageX.cache.currentUser = data["currentUser"];
    pageX.cache.isLightForm = data["isLightForm"] === true;
    pageX.cache.hasPhoneForm = data["isLightForm"]=== true;
    pageX.cache.hasPCForm = data["hasPCForm"]=== true;
    pageX.cache.importLevelEnum = data["importEnum"];
    pageX.cache.needClone = !!data.needClone;
    pageX.cache.newPolicy = data["newPolicy"] || {};
    pageX.cache.templateId = data["templateId"] || "";
    pageX.cache.formRightId = data["formRightId"] || "";
    pageX.cache.bodyType = data["bodyType"] || "10";
    pageX.cache.formTitle = data["formTitle"];
    pageX.cache.hasColSubject = !!data["formTitle"];
    pageX.cache.isNew = data["isNew"] !== false;
    pageX.cache.workflowNodeNames = data.workflowNodeNames || "";
    pageX.cache.receivers = data.receivers || "";
    pageX.cache.hasDocPlug = !!data.hasDocPlug;
    pageX.cache.defPolicy = data["defPolicy"];

    var summary = data["summary"];
    var delKeys = [];
    for ( var key in summary) {
        if (summary[key] == null) {
            delKeys.push(key);
        }
    }
    // 减少缓存量
    for (var i = 0; i < delKeys.length; i++) {
        delete summary[delKeys[i]];
    }
    summary.templateId = summary.templateId || pageX.cache.templateId;
    pageX.cache.summary = summary;
    
    
    pageX.cache.attList = data["attList"];
    pageX.cache.colMainData = {
        id : summary["id"],
        subject : summary["subject"] || "",
        DR : summary["dr"],
        tId : summary.templateId,
        newBusiness : (pageX.cache.isNew ? "1" : "0"),
        bodyType : pageX.cache.bodyType,
        contentRightId : pageX.cache.formRightId,
        canForward : summary.canForward || "1",
        canModify : summary.canModify || "1",
        canEdit : summary.canEdit || "1",
        processTermType : summary.processTermType || "",
        mergeDealType : summary.mergeDealType || "",
        remindInterval : summary.remindInterval || "",
        canEditAttachment : summary.canEditAttachment || "1",
        canArchive : summary.canArchive || "1",
        canScanCode : summary.canScanCode || "0",
        canSetSupervise : summary.canSetSupervise || "1",
        projectId : summary.projectId || "",
        advancePigeonhole : summary.advancePigeonhole || "",
        advanceRemind : summary.advanceRemind || "",
        archiveId : summary.archiveId || "",
        archiveName : summary.archiveName || "",
        archiveAllName : summary.archiveAllName || "",
        deadline : summary.deadline || "",
        advanceRemind : summary.advanceRemind || "",
        deadlineDatetime : summary.deadlineDatetime || "",
        formParentid : summary.formParentid || "",
        formViewOperation : summary.formViewOperation || "",
        formAppid : summary.formAppid || "",
        oldProcessId : summary.processId || "",
        attachmentArchiveId : summary.attachmentArchiveId || "",
        caseId : summary.caseId || "",
        trackType : data["trackType"] || "",
        zdgzry : data["zdgzry"] || "",
        canTrack : (data["trackSend"] == "false" ? "0" : "1")
    }

    pageX.cache.mainbodyData = {
        id : data["cttId"] || "",
        createId : pageX.cache.currentUser["id"],
        moduleId : summary["id"],
        content : pageX.winParams.content || "",
        contentType : pageX.cache.bodyType,
        moduleTemplateId : pageX.cache.templateId
    }
    
    pageX.cache.colArchiveName = pageX.cache.colMainData.archiveName;
}

// 初始化页面数据
function _fillPage() {

    // 填充隐藏值域
    CollUtils.fillDom("#colMainData", pageX.cache.colMainData);
    CollUtils.fillDom("#mainbodyDataDiv_0", pageX.cache.mainbodyData);
    
    
    // 表单模板有初始化附件
    var hasAtt = true;
    var initAtt = pageX.cache.attList;
    if (initAtt && initAtt.length > 0) {
        var tempCount = initAtt.length;
        var tempText = "";
        if (tempCount > 0) {
            tempText = tempCount;
        }
        document.getElementById("attCount").innerHTML = tempText;
        // 附件图标有附件时显示蓝色
        var attDom = document.querySelector("#attBtn span");
        if (tempCount > 0 && attDom && !attDom.classList.contains("cmp-active")) {
            attDom.classList.add("cmp-active");
        }
    }
    if (pageX.cache.newPolicy.uploadAttachment || pageX.cache.newPolicy.uploadRelDoc) {

        var showAuth;
        if (pageX.cache.newPolicy.uploadAttachment && pageX.cache.newPolicy.uploadRelDoc) {
            showAuth = -1;
        } else if (pageX.cache.newPolicy.uploadAttachment) {
            showAuth = 1;
        } else if (pageX.cache.newPolicy.uploadRelDoc) {
            showAuth = 2;
        }
        // 初始化附件组件
        var initParam = {
            showAuth : showAuth,
            uploadId : "picture",
            handler : "#attachment",
            initAttData : initAtt,
            needClone : pageX.cache.needClone,
            continueUpload : true,
            selectFunc : function(fileArray) {
                var attArray = new Array();
                var assArray = new Array();
                for (var i = 0; i < fileArray.length; i++) {
                    if (fileArray[i].attachment_fileType == "associated") {
                        assArray.push(fileArray[i]);
                    } else if (fileArray[i].attachment_fileType == "file") {
                        attArray.push(fileArray[i]);
                    }
                }
                var $attCount, $assCount;
                $attCount = _$("#attCount");
                $assCount = _$("#assCount");
                if(attArray.length !=0 || assArray.length != 0){
                    document.querySelector("#attachment_title").children[0].classList.add('display_none');
                    document.querySelector("#attachment_title").children[1].classList.remove('display_none');
                }
                if ($attCount) {
                    $attCount.innerHTML = attArray.length;
                }
                if ($assCount) {
                    $assCount.innerHTML = assArray.length;
                }
                // 附件图标有附件时显示蓝色
                var attDom = document.querySelector("#attBtn span");
                if (fileArray.length > 0 && attDom && !attDom.classList.contains("cmp-active")) {
                    attDom.classList.add("cmp-active");
                }
            }
        }
        pageX.fileComponent = new SeeyonAttachment({
            initParam : initParam
        });
    } else {
        if (tempCount > 0) {
            _$("#attBtn").remove();
        } else {
            hasAtt = false;
            var tempAttLi = document.getElementById("attachment");
            if (tempAttLi) {
                tempAttLi.remove();
            }
        }
    }

    //根据配置进行页面布局
    var mainContainerBottom = 51;//底部按钮高度
    if(hasAtt){
        _$("#attachment_wrap").style.display = "";
        //附件高度
        mainContainerBottom += 40;
    }

    if(pageX.isForm){
        // 是否展示相关数据按钮
        _$("#dataRelationBtn").style.display = "";
        mainContainerBottom += 100;
        _$("#colContentDiv").style.bottom = mainContainerBottom + "px";

        _$("title").innerHTML = pageX.cache.colMainData.subject;
        // _$("#headerHeader").innerText = pageX.cache.colMainData.subject;

        var $formMoreSubject = _$("#form_more_subject");
        $formMoreSubject.value = pageX.cache.colMainData.subject;
        //表单正文不允许修改标题
        if (pageX.cache.hasColSubject) {
            $formMoreSubject.disabled = "disabled";
        }else{
            $formMoreSubject.setAttribute("placeholder", cmp.i18n("collaboration.page.lable.fileSubject"));
            //标题自增长
            $formMoreSubject.addEventListener("input", function(){

                _$("title").innerHTML = this.value || this.getAttribute("placeholder");
                // _$("#headerHeader").innerText = this.value.replace(/[\r\n]/g, "") || this.getAttribute("placeholder");

                var colMainDataDomain = _$("#colMainData");
                CollUtils.fillDom(colMainDataDomain, {
                    subject : this.value
                });
                
                _autoSetHeight(this);
            });
        }
        // _$("#form_more_container").style.top = _$("#hid").offsetHeight + "px";
        
        /*_$("#headerHeader").addEventListener("tap", function() {
            _$("#form_more_container").classList.toggle("display_none");
            setTimeout(function(){
                var $moreSubject = _$("#form_more_subject");
                _autoSetHeight($moreSubject);
            }, 0);
        });*/

        // 影藏标题更多
        _$("#form_more_container").addEventListener('tap', function(e) {
            if (e.target == this) {
                this.classList.toggle("display_none");
            }
        });
        

        //查看流程
        _$("#viewWfMenu").addEventListener("tap", function() {

            pageX.wfDesigner.edit({
                initMembers : []
            });


        })
      
    }else {
        _$("#colContentDiv").style.bottom = mainContainerBottom + "px";
        _subjectBlurEvent.call(_$("#subject"))
        
        // textarea高度
        _setContentAreaHeight();
    }

    // 调用表单接口渲染
    if (pageX.isForm) {

        if(pageX.cache.isCAP4){
            
            var _vendor_cap4_js_, 
                _app_cap4_js_, 
                _widget_cap4_js_, 
                _app_cap4_origin_js_,
                _app_cap4_css_, 
                path;
            var _cap4_iconfont_1_, _cap4_iconfont_2_;
            
            if(pageX.cache.isLightForm === false){
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
                        _common_v5_path + "/widget/SeeyonContent.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion],
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
                "js" : [ _formPath + "/js/lib/vue/vue.js" + $verstion,
                        _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion ],
            });
            LazyUtil.addLazyStack({
                "code" : "lazy_form",
                "depend" : "lazy_vue",
                "dependModel" : "strong",
                "groups" : "seeyon_form",
                "css" : [ _formPath + "/css/index.css" + $verstion ],
                "js" : [ unflowform_jssdk,
                         _formPath + "/js/dataService.js" + $verstion, _formPath + "/js/sui.js" + $verstion,
                        _unflowform + "/unflowform_m_api.s3js" + $verstion,
                        _unflowform + "/js/deeFieldInit.js" + $verstion,
                        _common_v5_path + "/widget/SeeyonContent.js" + $verstion ],
            });
        }
        
     // 切换原样表单
        LazyUtil.addLoadedFn("lazy_form", function() {
            var srcFormBtn = _$("#src_form_btn");
            // var dragFixdIcon = _$("#dragFixdIcon");
            _dragThis('dragFixdIcon','colContentDiv');
            /*dragFixdIcon.addEventListener('touchmove', function(event) {
                event.preventDefault();阻止其他事件
                如果这个元素的位置内只有一个手指的话
                if (event.targetTouches.length == 1) {
                    var touch = event.targetTouches[0];  // 把元素放在手指所在的位置
                    dragFixdIcon.style.left = touch.pageX + 'px';
                    dragFixdIcon.style.top = touch.pageY + 'px';
                    dragFixdIcon.style.background = "green";
                }
              },false);*/
			 
            if(pageX.cache.hasPhoneForm && pageX.cache.hasPCForm){
            	document.getElementById("dragFixdIcon").classList.remove("display_none");
                srcFormBtn.classList.remove("display_none");
            	srcFormBtn.addEventListener("tap", function() {
            		var _hitType = !pageX.cache.isLightForm ? cmp.i18n("collaboration.page.lable.srcForm") : cmp
            				.i18n("collaboration.page.lable.lightForm");
            		_$("#src_form_view_hint_txt", false, _$("#src_form_view_hint")).innerHTML = cmp.i18n(
            				"collaboration.page.lable.srcFormHit", [ _hitType ]);
            		
            		if (pageX.isSubmitting) {
            			return;
            		}
            		
            		_isContentInit = false;
            		
            		if(pageX.cache.isCAP4 === true){
            			
            			//
            			//  CAP4 切换轻原表单的原理是使用 go 方法进行整个页面刷新
            			//
            			
            			cmp.sui.switchForm(function(args){
            				
            				// 触发数据保存
            				// {switchFrom: 'light'}
            				
            				var fromFormType, fromFormIndex, formMasterId;
            				
            				fromFormType = args.switchFrom;
            				formMasterId = args.formMasterId;
            				//fromFormIndex = args.indexParam;
            				
            				// 这里逻辑是相反的
            				pageX.cache.isLightForm = fromFormType === "origin";
            				//pageX.cache.formIndex = fromFormIndex || 0;
            				
            				// 触发页面数据缓存
            				cmp.event.trigger('beforepageredirect', document, {changeFormType: true});
            				
            				var nextUrl = _collPath + "/html/newCollaboration.html" + colBuildVersion;
            				
            				pageX.winParams.formMasterId = formMasterId;
            				pageX.winParams.switchFrom = fromFormType;
            				
            				cmp.href.go(nextUrl, pageX.winParams);
            			});
            			
            		}else{
            			
            			var $contentDiv = _$("#contentDiv");
            			if (pageX.cache.isLightForm) {
            				// 切换成原表单
            				$contentDiv.style.overflow = "hidden";
							
            			} else {
            				// 切换成轻表单
							
            				$contentDiv.style.overflow = "auto";
            			}
            			
            			SeeyonContent.instance("contentDiv").loadForm("0", {
            				isLightForm : !pageX.cache.isLightForm,
            				loadCallback : function() {
            					_isContentInit = true;
            					pageX.cache.isLightForm = !pageX.cache.isLightForm;
                                //**************************************************************************

                                //**************************************************************************
								/*if(pageX.cache.isLightForm == true){
									$(".sub-table-title").html("详细信息");
								}*/
								
            				}
            			});
            		}
            	});
            	
            	
            	// 新建引导 获取本地缓存
                var isHit = cmp.storage.get(_formHitCacheKey);
                if (!isHit || isHit != "true") {
                    var hitEle, hitType;
                    hitEle = _$("#src_form_view_hint");
                    hitType = pageX.cache.isLightForm ? cmp.i18n("collaboration.page.lable.srcForm") : cmp
                            .i18n("collaboration.page.lable.lightForm");
                    _$("#src_form_view_hint_txt", false, hitEle).innerHTML = cmp.i18n("collaboration.page.lable.srcFormHit",
                            [ hitType ])
                    if(pageX.cache.hasPhoneForm && pageX.cache.hasPCForm){
                        hitEle.classList.remove("display_none");
                        // 这里要用click， tap要被穿透
                        hitEle.querySelector(".btn").addEventListener("click", function(e) {
                            
                            // 事件被点穿了
                            e.stopPropagation();
                            
                            cmp.storage.save(_formHitCacheKey, "true");
                            hitEle.classList.add("display_none");
                        });
                    }        
                }
            	
            }
        });
        
        
        // 启动加载表单
        LazyUtil.startLazy("seeyon_form");

        var _moduleId = pageX.cache.templateId;
        if (!pageX.cache.isNew) {
            _moduleId = pageX.cache.colMainData.id;
        }

        var contentConfig = {
            "target" : "contentDiv",
            "bodyType" : "20",
            "content" : _moduleId,
            "onload" : function() {
                dealHeader();
                _isContentInit = true;
                cmp.dialog.loading(false);
                
                setTimeout(_fillFormData, 10);
            },
            "moduleType" : "1",
            "ext" : {
                "isLightForm" : pageX.cache.isLightForm,
                "rightId" : pageX.cache.formRightId,
                "viewState" : '1',
                "allowQRScan" : pageX.cache.colMainData.canScanCode == '1' ? true : false,
                "summaryId" : pageX.cache.colMainData.id,
                "isCAP4" : pageX.cache.isCAP4
            }
			
        }
        
        // CAP4 需求要求这么传
        if(pageX.cache.isCAP4){
            if(pageX.cache.isNew){
                contentConfig.ext.viewState = "0";
            }else{
                contentConfig.ext.viewState = "1";
            }
        }

        // 初始化正文
        LazyUtil.addLoadedFn("lazy_form", function() {
            // 表单加载完成后再进行回调
            SeeyonContent.init(contentConfig);
            contentConfig = null;
        });

        if (!pageX.cache.isLightForm) {
            // 切换成原表单
            _$("#contentDiv").style.overflow = "hidden";
        }

        // OA-113003微协同调用没设置预归档的表单模板，在新建页面上无法设置预归档。
        /*if (pageX.cache.newPolicy.pigeonhole) {
            _$("#archive_li").style.display = "";
            if (!pageX.cache.colMainData.archiveAllName) {
                if (pageX.cache.colArchiveName) {
                    _$("#colArchiveName").innerHTML = pageX.cache.colArchiveName;
                }
                _$("#colArchiveName").addEventListener("tap", selectArchive);
            }else{
                _$("#colArchiveName").innerHTML = pageX.cache.colArchiveName;
            }
        }*/
    } else {

        LazyUtil.addLazyStack({
            "code" : "lazy_form",
            "js" : [ unflowform_jssdk,
                     _unflowform + "/unflowform_m_api.s3js" + $verstion,
                    _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + $verstion ]
        });

        /*if (pageX.cache.newPolicy.pigeonhole) {
            _$("#archive_li").style.display = "";
            if (pageX.cache.colArchiveName) {
                OA-113007微协同：待发编辑模板没设置预归档但是发起人设置了预归档的协同，预归档显示为空
                _$("#colArchiveName").innerHTML = pageX.cache.colArchiveName;
            }
            _$("#colArchiveName").addEventListener("tap", selectArchive);
        }*/

        cmp.dialog.loading(false);
        _isContentInit = true;
    }

    // 更多操作设置
    _setImportValue({
        key : pageX.cache.importLevelEnum["defVal"]["key"],
        name : pageX.cache.importLevelEnum["defVal"]["label"]
    });
    if (pageX.cache.colMainData.canTrack == '0') {// 跟踪
        // _$("#trackingBtn").classList.remove('cmp-active');
        _setTracking(false);
    }

    if(!pageX.isForm){
     // 快速选人
        var tokenInputConfig = {
            target : "receiver_container",
            editable : false,
            names : null,
            layout : "auto",
            onChange : function() {
                _setContentAreaHeight();
            },
            onBlur : function() {
                _toggleReceiver("hide");
            },
            correntAccountId : pageX.cache.currentUser["loginAccount"]
        }
        var wfNames = pageX.cache.workflowNodeNames;
        if (wfNames) {
            var c = "、";
            if (wfNames.indexOf(",") != -1) {
                c = ",";
            }
            tokenInputConfig.names = wfNames.split(c);
        }
        if (!pageX.cache.templateId) {
            tokenInputConfig.editable = true;
            tokenInputConfig.onChoose = function(u) {
                pageX.inputUsers[u.id] = u;
            }
            tokenInputConfig.onDelete = function(id) {
                // 删除项
                if (id) {
                    delete pageX.inputUsers[id];
                }
            }
            tokenInputConfig.onDestroy = function() {
                delete pageX.inputUsers;
            }
        }

        // 初始化数据
        if (pageX.cache.receivers) {
            tokenInputConfig.datas = pageX.cache.receivers;
        }
        // 需要在加载流程前初始化快速选人
        SeeyonTokeninput.init(tokenInputConfig);

        // 切换显示
        _toggleReceiver(true);
        _$("#receiver_container_text").addEventListener("tap", function(e) {
            e.stopPropagation();// 不冒泡
            // 展开接收人
            _toggleReceiver("show");
        });
    }

    // 启动缓加载
    LazyUtil.startLazy();
    _initPage();
    setTimeout(function() {
        _bindEvent();
    }, 50);

}

/** 自动填充表单数据 **/
function _fillFormData(){
    if(!pageX.cache.isFromCache && pageX.winParams.initFormData){
        var tempData = decodeURIComponent(pageX.winParams.initFormData);
        var datas = cmp.parseJSON(tempData);
        
        cmp.sui.refreshFormData("", datas, function(){
            if(pageX.winParams.sendOnload === "true"){
                //直接发送
                _send();
            }
        });
    }
    var btn =document.getElementsByClassName('see-icon-v5-form-arrow-down')[0];
    var event = document.createEvent('Events');
    event.initEvent('tap', true, true);
    btn.dispatchEvent(event)
}


/**
 * 刷新页面布局方法
 */
function _relayoutPage(){
    
    setTimeout(function(){
        // 页面变动从新布局
        var $titleName, $titleContainer, $receiverFlexName, $receiverFlexItem, liWidth;
        
        $titleName = _$("#title_name");
        $titleContainer = _$("#title_container");
        $receiverFlexName = _$("#receiver_flex_name");
        $receiverFlexItem = _$("#receiver_flex_item");
        
        liWidth = $titleName.parentNode.clientWidth - 30;
        
        $titleContainer.style.width = (liWidth - $titleName.offsetWidth) + "px";
        
        // 
        var receiverWidth = (liWidth - $receiverFlexName.offsetWidth - 40);
        $receiverFlexItem.style.width =  receiverWidth + "px";
        
        SeeyonTokeninput.relayout(receiverWidth);
        
    }, 300);
}


/** 页面 * */
function _initLayout(layoutCallback) {

    var $switchPopBtn = _$("#switch_pop_btn");
    
    if(!pageX.isForm){
        
        _$("#colMainData").style.display = "";
        _$("#mainbodyDataDiv_0").style.display = "";
        _$("#content").style.display = "";
        _$("title").innerHTML = cmp.i18n("collaboration.page.lable.newCol");
        // _$("#headerHeader").innerText = cmp.i18n("collaboration.page.lable.newCol");
        
        //????涉及到业务逻辑，待验证
        // $switchPopBtn.classList.remove("see-icon-v5-common-lookflow")
        // $switchPopBtn.classList.add("see-icon-more");
        
        setTimeout(function(){
            
            // 将值填充到页面
            _$("#content").setAttribute("placeholder", cmp.i18n("collaboration.page.lable.pleaseInputContent"));// 请输入正文
            _$("#subject").setAttribute("placeholder", cmp.i18n("collaboration.affairs.subject.maxLength"));
            
            var flexItem = _$("#receiver_flex_item");
            flexItem.style.width = flexItem.offsetWidth + "px";
            
            var titleContainer = _$("#title_container");
            titleContainer.style.width = titleContainer.offsetWidth + "px";
            
            if(layoutCallback){
                layoutCallback();
                layoutCallback = null;
            }
        }, 0);
    }else {
        document.body.classList.add("newCol-form");
        _$("#contentDiv").style.display = "";
        // _$("#switch_pop_btn_i").style.display = "";
        _$("#viewWfMenu").classList.remove("display_none");
        
        setTimeout(function(){

            if(layoutCallback){
                layoutCallback();
                layoutCallback = null;
            }
        }, 0);
    }
    $switchPopBtn.style.display = "";
}

/** 初始化传入参数 * */
function _initParamData() {

    /**
     * 
     * pageX.winParams = { 
     *     subject : "", 
     *     content : "", 
     *     members : "", 
     *     summaryId : "",//协同ID 
     *     templateId : "",//模板ID 
     *     openFrom ： "", 
     *     preCaches : [], 
     *     backIndex :0,
     *     sendOnload : "true"//进入页面后立马执行发送事件
     *     initFormData : ""//表单数据json串
     * }
     * 
     */
    /*var header={
        "Accept": "application/json; charset=utf-8",
        "Accept-Language": "zh-CN",
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": "JSESSIONID=",
        "option.n_a_s": "1",
        "token": ""
    }


    cmp.ajax({
        type: "POST" ,
        data: "",
        url : 'http://10.20.19.209/seeyon/cost/formNCController.do?method=userInfo' ,
        async : false,
        headers: header,
        dataType : "html",
        success : function ( r, textStatus, jqXHR ){
            alert(r)
        },
        error: function(){
            alert("error")
        }
    });*/
    //集成企业微信需要进行改造
    var url = location.search; //获取url中"?"符后的字串
    var isFromQXWX=false
    var kaoqintype=""
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i].indexOf("from=qywx")>-1){
                kaoqintype=strs[i].split("=")[1]
                isFromQXWX=true
                //break;
            }
			if(strs[i].indexOf("token=")>-1){
				window.localStorage.CMP_V5_TOKEN=strs[i].split("=")[1]
			}
            /*if(strs[i]=="from=qywxqkd"){
                var param = {
                    "parentId": "3532548464963436784"//考勤类模板
                }
                $s.Template.formTemplates(param,errorBuilder({
                    success : function(result) {
                        if(typeof(param)!='undefined' && param.parentId){
                            var templates = result.templates
                            for(var j=0 ; j < templates.length ; j++){
                                if(templates[j].subject.indexOf("签卡")!=-1){
                                    pageX.winParams={
                                        "templateId": templates[j].id
                                    }
                                    break;
                                }
                            }

                        }else{

                        }
                    }
                }));
                isFromQXWX=true
                break;
            }else if(strs[i]=="from=qywxqjd"){
                var param = {
                    "parentId": "3532548464963436784"//考勤类模板
                }
                $s.Template.formTemplates(param,errorBuilder({
                    success : function(result) {
                        if(typeof(param)!='undefined' && param.parentId){
                            var templates = result.templates
                            for(var j=0 ; j < templates.length ; j++){
                                if(templates[j].subject.indexOf("请假单")!=-1){
                                    pageX.winParams={
                                        "templateId": templates[j].id
                                    }
                                    break;
                                }
                            }

                        }else{

                        }
                    }
                }));
                isFromQXWX=true
                break;
            }else if(strs[i]=="from=qywxjbd"){
                var param = {
                    "parentId": "3532548464963436784"//考勤类模板
                }
                $s.Template.formTemplates(param,errorBuilder({
                    success : function(result) {
                        if(typeof(param)!='undefined' && param.parentId){
                            var templates = result.templates
                            for(var j=0 ; j < templates.length ; j++){
                                if(templates[j].subject.indexOf("加班")!=-1){
                                    pageX.winParams={
                                        "templateId": templates[j].id
                                    }
                                    break;
                                }
                            }

                        }else{

                        }
                    }
                }));
                isFromQXWX=true
                break;
            }else{
               /!* cmp.notification.alert("模板已删除或您没有相关权限！",function(){
                    //do something after tap button
                    cmp.href.back()
                },"提示","确定","",false,false);*!/
            }*/
        }
        if(isFromQXWX){
            //获取用户名
            var tk = window.localStorage.CMP_V5_TOKEN;
            tk = tk!=undefined ? tk : ''  ;
            var header={
                "Accept": "application/json; charset=utf-8",
                "Accept-Language": "zh-CN",
                "Content-Type": "application/json; charset=utf-8",
                "Cookie": "JSESSIONID=",
                "option.n_a_s": "1",
                "token": tk
            }
            cmp.ajax({
                type: "POST" ,
                data: "",
                //url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
                url : cmp.seeyonbasepath+'/rest/oa3/revert/queryLoginUserInfo' ,
                async : false,
                headers: header,
                dataType : "html",
                success : function ( r, textStatus, jqXHR ){
                    if(r&&r!=""){
                        cmp.storage.save("ygzz_loginname",r)
                        cmp.storage.save("loginname",r)
                    }
                },
                error: function(r){
                    console.log(JSON.stringify(r))
                }
            })
            //获取模板权限
            var quanxianArr=[]
            cmp.ajax({
                type: "get" ,
                data: "",
               // url : 'http://10.20.19.131/seeyon/rest/attendance/ssoSentForm/getTemplateInfo?code='+cmp.storage.get("loginname") ,
                url : cmp.seeyonbasepath+'/rest/attendance/ssoSentForm/getTemplateInfo?code='+cmp.storage.get("loginname") ,
                async : false,
                headers: header,
                dataType : "json",
                success : function ( r, textStatus, jqXHR ){
                    if(r&&r!=""&&JSON.stringify(r) != "{}"){
                        quanxianArr = r.data
                    }
                },
                error: function(r){
                    console.log(JSON.stringify(r))
                }
            })
            if(quanxianArr.length>0){
                for(var q=0;q<quanxianArr.length;q++){
                    if(kaoqintype.indexOf("qywxqjd")>-1){
                        if(quanxianArr[q].templateName&&quanxianArr[q].templateName.indexOf("请假")>-1){
                            pageX.winParams={
                                "templateId": quanxianArr[q].templateId
                            }
                            break;
                        }

                    }else if(kaoqintype.indexOf("qywxjbd")>-1){
                        if(quanxianArr[q].templateName&&quanxianArr[q].templateName.indexOf("加班")>-1){
                            pageX.winParams={
                                "templateId": quanxianArr[q].templateId
                            }
                            break;
                        }

                    }else if(kaoqintype.indexOf("qywxqkd")>-1){
                        if(quanxianArr[q].templateName&&quanxianArr[q].templateName.indexOf("签卡")>-1){
                            pageX.winParams={
                                "templateId": quanxianArr[q].templateId
                            }
                            break;
                        }

                    }else if(kaoqintype.indexOf("qywxxjd")>-1){
                        if(quanxianArr[q].templateName&&quanxianArr[q].templateName.indexOf("销假")>-1){
                            pageX.winParams={
                                "templateId": quanxianArr[q].templateId
                            }
                            break;
                        }

                    }
                }

            }


        }
    }
    if(isFromQXWX&&pageX.winParams==null&&cmp.href.getParam()==null){
        cmp.notification.alert("模板已删除或您没有相关权限！",function(){
            //do something after tap button
            cmp.href.back()
        },"提示","确定","",false,false);
        return false
    }
    if(!isFromQXWX){
        pageX.winParams = cmp.href.getParam() || {};
    }

    if (CollUtils.isEmptyObj(pageX.winParams)) {

        pageX.winParams = CollUtils.getHrefQuery();

        if (pageX.winParams.subject) {
            pageX.winParams.subject = decodeURIComponent(pageX.winParams.subject);
        }
        if (pageX.winParams.content) {
            pageX.winParams.content = decodeURIComponent(pageX.winParams.content);
        }
        if (pageX.winParams.members) {
            pageX.winParams.members = decodeURIComponent(pageX.winParams.members);
        }
    }

    // 关联表单要用的全局变量
    window.params = pageX.winParams;
}

/** 初始化返回事件 * */
function _initBackEvent() {

    cmp.backbutton();
    cmp.backbutton.push(_closePage);
    // _$("#closeBtn").addEventListener("tap", _closePage);

}

// 点击关闭
function _closePage() {

    if (!pageX.isInitData) {
        // 网络异常情况下，允许用户直接返回
        cmp.href.back();

    } else {
        if (!pageX.isSubmitting) {// 发送的时候不能保存待发和放弃新建
            
            cmp.notification.confirm(cmp.i18n("collaboration.alert.confirm.leave"),function(e){ //e==1是/e==0 否
                if(e==1){ //是
                 // 放弃新建的时候删除表单缓存
                    try {

                        SeeyonContent.clearCache();
                        if (pageX.isForm && pageX.cache.summary["formRecordId"]) {
                            // 清除后台缓存
                            $s.CapForm.removeSessionMasterDataBean(pageX.cache.summary["formRecordId"], {},
                                    errorBuilder({
                                        success : function(ret) {
                                        }
                                    }));
                        }
                    } catch (e) {
                    	
                    }

                    cmp.webViewListener.fire({
                        type: "coll.ListRefresh",
                        data: {closePage: 'true'}
                    });
                    cmp.href.back();
                }
            },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
            

        }
    }
}

// 注册懒加载
function _registLazy() {

    // 注册缓加载
    LazyUtil.addLazyStack({
        "code" : "lazy_cmp_form",
        "css" : [ _cmpPath + "/css/cmp-accDoc.css" + $verstion, _cmpPath + "/css/cmp-selectOrg.css" + $verstion,
                _cmpPath + "/css/cmp-att.css" + $verstion, _cmpPath + "/css/cmp-picker.css" + $verstion,
                _cmpPath + "/css/cmp-list.css" + $verstion ],
        "js" : [ _cmpPath + "/js/cmp-accDoc.js" + $verstion, _cmpPath + "/js/cmp-att.js" + $verstion,
                _cmpPath + "/js/cmp-lbs.js" + $verstion ]
    });

    LazyUtil.addLazyStack({
        "code" : "lazy_cmp",
        "css" : [ _cmpPath + "/css/cmp-listView.css" + $verstion, _cmpPath + "/css/cmp-audio.css" + $verstion,
                _cmpPath + "/css/cmp-search.css" + $verstion ],
        "js" : [ _cmpPath + "/js/cmp-flowV5.js" + $verstion, _cmpPath + "/js/cmp-listView.js" + $verstion,
                _cmpPath + "/js/cmp-imgCache.js" + $verstion, _cmpPath + "/js/cmp-app.js" + $verstion,
                _cmpPath + "/js/cmp-selectOrg.js" + $verstion, _cmpPath + "/js/cmp-picker.js" + $verstion,
                _cmpPath + "/js/cmp-dtPicker.js" + $verstion, _cmpPath + "/js/cmp-push.js" + $verstion,
                _cmpPath + "/js/cmp-audio.js" + $verstion, _cmpPath + "/js/cmp-server.js" + $verstion,
                _cmpPath + "/js/cmp-search.js" + $verstion, _cmpPath + "/js/cmp-popPicker.js" + $verstion,
                _cmpPath + "/js/cmp-handWriteSignature.js" + $verstion, _cmpPath + "/js/cmp-barcode.js" + $verstion,
                _cmpPath + "/js/cmp-camera.js" + $verstion ]
    });

    // 添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_wf",
        "depend" : "lazy_cmp",
        "dependModel" : "strong",
        "css" : [ _wfPath + "/css/wf.css" + $verstion ],
        "js" : [ workflow_jssdk,
                 _wfPath + "/js/wf.js" + $verstion, 
                 _cmpPath + "/js/cmp-zoom.js" + $verstion ]
    });

    // 添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_doc",
        "css" : [ _docPath + "/css/doc.css" + $verstion, _docPath + "/css/docNewPigeonhole.css" + $verstion ],
        "js" : [ doc_jssdk,
                 _docPath + "/js/docNewPigeonhole.js" + $verstion,
                 _docPath + "/js/flexible.js" + $verstion ]
    });

    // 添加懒加载数组
    LazyUtil.addLazyStack({
        "code" : "lazy_dee",
        "css" : [],
        "js" : [ dee_jssdk,
                 _deePath + "/js/formDevelopmentOfadv.js" + $verstion ]
    });
    
    LazyUtil.addLazyStack({
        "code" : "lazy_jssdk",
        "css" : [],
        "js" : [ editContent_jssdk, signet_jssdk, template_jssdk, user_jssdk, commonPhrase_jssdk]
    });
}

/**
 * 接收人效果切换
 */
function _toggleReceiver(p) {

    var rText = _$("#receiver_container_text"), textDisplay, inputDisplay, showText = false;
    var DISPLAY_BLOCK = "", DISPLAY_NONE = "none";
    var text = SeeyonTokeninput.getNames();

    if (p == "hide") {
        showText = true;
    } else if (p == "show") {
        showText = false;
    } else {
        showText = rText.style.display == "none";
    }

    if (showText) {
        textDisplay = DISPLAY_BLOCK;
        inputDisplay = DISPLAY_NONE;

        if (text) {
            rText.innerText = text;
        } else {
            rText.innerHTML = "&nbsp;";
        }
    } else {
        textDisplay = DISPLAY_NONE;
        inputDisplay = DISPLAY_BLOCK;
    }

    if (rText.style.display == DISPLAY_BLOCK && textDisplay == DISPLAY_BLOCK) {
        // 没做变动
        _$("#receiver_container").style.display = inputDisplay;
    } else {
        rText.style.display = textDisplay;
        _$("#receiver_container").style.display = inputDisplay;
        if (!showText) {
            setTimeout(function() {
                SeeyonTokeninput.focus();
            }, 50);
        }

        // 计算高度
        if (p !== true) {
            _setContentAreaHeight();
        }
    }
}

function _setContentAreaHeight() {

    // 设置正文内容高度
    var perp = document.getElementById("colMainData").offsetHeight;
    document.getElementById("content").style.top = perp + "px";

    // 优化渲染数度
    var headerH = 0, headerDom = _$("#hid"), $attContenter = _$("#attachment_wrap");

    pageX.contentHeight = pageX.windowHeight - headerH - perp - ($attContenter ? 40 : 0) - 50 - 10;
}

// 页面展示
function _initPage() {

    var wfState = pageX.cache.templateId ? "view" : "edit";
    var wfDesignerParam = {

        workflow : {
            moduleType : "1"
        },
        info : {
            state : wfState,
            defaultPolicyId : pageX.cache.defPolicy["value"],
            defaultPolicyName : pageX.cache.defPolicy["name"],
            currentAccountId : pageX.cache.currentUser["loginAccount"],
            currentAccountName : pageX.cache.currentUser["loginAccountName"],
            currentUserId : pageX.cache.currentUser["id"],
            currentUserName : pageX.cache.currentUser["name"],
            category : "collaboration",// 分类 协同 collaboration
            workItemId : pageX.cache.summary["affairWorkitemId"],
            affairId : pageX.cache.summary["affairId"],
            bodyType : pageX.cache.summary["bodyType"],
            activityId : pageX.cache.summary["activityId"],
            formData : pageX.cache.summary["formRecordId"],
            processTemplateId : pageX.cache.summary["templateProcessId"],
            maxNameLength : -1,
            useTemplateId : true
        },
        onNodeChange : function(names) {

            if(!pageX.isForm){
                
                // 清空已经选择的人
                SeeyonTokeninput.destroy();
                
                var rDom = _$("#receiver_container");
                
                rDom.style.display = "";
                // 展示选择人
                SeeyonTokeninput.showNames(names.split(","));
                
                // 更新接收人
                _toggleReceiver("hide");
            }
        },
        getPermissions : function(callback) {
            var params = {
                "appName" : "collaboration",
                "defaultPolicyId" : pageX.cache.defPolicy.value
            };
            // 获取节点权限
            $s.Coll.permissions({}, params, errorBuilder({
                success : function(ret) {
                    callback(ret);
                }
            }))
        }
    };

    if (pageX.cache.summary["processId"]
            && (!pageX.cache.summary["templateId"] || pageX.cache.summary["specialStepback"] === true)) {
        wfDesignerParam.workflow.processId = pageX.cache.summary["processId"];
    }
    if (pageX.cache.summary["caseId"]) {
        wfDesignerParam.workflow.caseId = pageX.cache.summary["caseId"];
    }

    // 流程
    LazyUtil.addLoadedFn("lazy_wf", function() {
        pageX.wfDesigner = new WorkFlowDesigner(wfDesignerParam);
        wfDesignerParam = null;
    });
}

// 绑定事件
function _bindEvent() {

    _$("#sendBtn").addEventListener("tap", _send);
    _$("#saveDraftBtn").addEventListener("tap", _saveDraft);

    // 开关设置
    _$("#switch_pop_btn").addEventListener("tap", function() {
        // var $formMoreContainer = _$("#form_more_container");
        // if($formMoreContainer && !$formMoreContainer.classList.contains("display_none")){
        //     $formMoreContainer.classList.add("display_none");
        // }
        // _$("#setting_container").classList.toggle("display_none");

        var _btns = [];
        var _items = pageX.cache.importLevelEnum["items"];
        for (var i = 0, len = _items.length; i < len; i++) {
            _btns.push({
                key : _items[i]["key"],
                name : _items[i]["label"],
                status:_items[i]["label"] == pageX.cache.importLevelEnum["defVal"].label?1:0
            // 非常重要
            });
        }




        var group = [
            {
                groupName:cmp.i18n("collaboration.page.lable.importantLevel"),
                type:"radio",
                items:_btns
            },{
                groupName:"",
                type:"switch",
                items:[{
                    key:"31",
                    status:pageX.cache.colMainData.canTrack == '0'?0:1,
                    name:cmp.i18n("collaboration.page.lable.button.track")

                }]
            }
        ];

        var _colArchiveName = {
                groupName:"",
                type:"text",
                items:[{
                    key:"41",
                    name:cmp.i18n("collaboration.page.lable.archive"),
                    name2:'<span style="color: #3AADFB;" id="colArchiveName">'+(pageX.cache.colArchiveName==''?cmp.i18n("collaboration.pighole.click"):pageX.cache.colArchiveName)+'</span>'
                }]
            }

        if (pageX.cache.hasDocPlug && pageX.cache.newPolicy.pigeonhole) {
            group.push(_colArchiveName);
        }

        if(pageX.isForm){//表单

            var _colTitleItem;
            _colTitleItem = {
                groupName:"",
                type:"text",
                items:[{
                    key:"42",
                    name:cmp.i18n("collaboration.view.form")+cmp.i18n("collaboration.affairs.subject"),
                    name2:'<span style="color: #3AADFB;">'+(pageX.cache.hasColSubject?cmp.i18n("collaboration.page.lable.view"):cmp.i18n("collaboration.page.lable.edit"))+'</span>'
                }]
            }
            group.push(_colTitleItem);
        }

        cmp.dialog.groupSheet(group, cmp.i18n("collaboration.batch.title.label.close"), function (item) {
            if(item.key == "31"){//跟踪
                _switch("tracking",item.status == 1);
            }else if(item.key == "41"){//归档
                if (!pageX.cache.colMainData.archiveAllName) {
                    selectArchive();
                }
            }else if(item.key == "42"){//表单标题
                _$("#form_more_container").classList.toggle("display_none");
                setTimeout(function(){
                    var $moreSubject = _$("#form_more_subject");
                    _autoSetHeight($moreSubject);
                }, 0);
            }else{//重要程度
                _setImportValue(item);
            }
            // console.log(item);
            // cmp.notification.toast("你选择的结果为：" + JSON.stringify(item))
        }, function () {
            // do nothing
            // cmp.notification.toast("你点击了关闭按钮")
        });

    });

    // 影藏开关
    /*_$("#setting_container").addEventListener('tap', function(e) {
        if (e.target == this) {
            this.classList.toggle("display_none");
        }
    });*/

    // cmp("#switchs_ul").on("tap", ".menu_btn", _clickMenuBtn);

    // 开关按钮
    /*cmp("#switchs_ul .cmp-switch").each(function() { // 循环所有toggle
        this.addEventListener('toggle', function(event) {
            var tCode = this.getAttribute("switchcode");
            _switch(tCode, this.classList.contains('cmp-active'));
        });
    });*/


    if(!pageX.isForm){

      //工作流事件
        _bindWfEvent();

        // 标题区两个事件
        _$("#subject_text").addEventListener("tap", function(){
            this.style.display = "none";
            _$("#subject").style.display = "";
            _setContentAreaHeight();
            setTimeout(function() {
                _$("#subject").focus();
            }, 50);
        });
        _$("#subject").addEventListener("input", _subjectInputEvent);
        _$("#subject").addEventListener("blur", _subjectBlurEvent);

    }else {

        _$("#dataRelationBtn").addEventListener("tap", function() {
            var params = {
                templateId : pageX.cache.summary.templateId,
                activityId : "start",
                DR : pageX.cache.summary.dr,
                affairId : pageX.cache.summary.affairId == null ? -1 : pageX.cache.summary.affairId,
                projectId : pageX.cache.summary.projectId,
                summaryId : pageX.cache.summary.id,
                memberId : pageX.cache.currentUser.id,
                senderId : "-1",
                formMasterId : window.s3scope ? window.s3scope.formMasterId : -1
            };
            cmp.event.trigger("beforepageredirect", document);
            cmp.href.next(_collPath + "/html/dataRelation.html" + colBuildVersion, params);
        });

        // 此处监听sui_form_customcontrol_render事件，当表单中自定义控件发生渲染时，会触发此事件
        document.addEventListener('sui_form_customcontrol_render', function(e) {
            _customcontrol_meetingroom_init(e);
        });
    }
}

// subject 相关事件
function _subjectBlurEvent(){
    var $subjectText = _$("#subject_text");
    if(this.value){
        $subjectText.innerText = this.value;
        $subjectText.style.display = "";
        this.style.display = "none";
        _setContentAreaHeight();
    }else{
        if(this.style.display = "none"){
            this.style.display = "";
            $subjectText.style.display = "none";
        }
    }
}
function _subjectInputEvent(){
    _autoSetHeight(this);
    _setContentAreaHeight();
}

function _autoSetHeight(obj){

    //高度自适应
      var srcHeight = obj.getAttribute("_srcHeight");
      if (srcHeight) {
          srcHeight = parseInt(srcHeight, 10);
      } else {
          srcHeight = 0;
      }
      var cHeight = Math.max(obj.scrollHeight, obj.offsetHeight, obj.clientHeight);
      var finalHeight = Math.max(cHeight, srcHeight);
      obj.style.height = finalHeight + "px";
  }


// 开关事件
function _switch(code, isActive) {
    if (code == "tracking") {// 跟踪
        _setTracking(isActive);
    }
}

// 单击菜单
/*function _clickMenuBtn() {

    _$("#setting_container").classList.toggle("display_none");

    var tCode = this.getAttribute("data-code");

    if (tCode == "ImportantLevel") {
        _setImportantLevel()
}}*/

// 返回上一个页面
function _goBackAndRefresh() {

    // 删除上个页面的缓存数据
    var deleCaches = pageX.winParams.preCaches || [];
    if (deleCaches.length > 0) {
        for (var i = 0; i < deleCaches.length; i++) {
            cmp.storage["delete"](deleCaches[i], true);
        }
    }
    
    // 清除正文区域缓存
    if(typeof(SeeyonContent)!="undefined"){
    	SeeyonContent.clearCache();
    }

    cmp.webViewListener.fire({
        type: "coll.ListRefresh",
        data: {
        	closePage: 'true',
        	refreshList: "true"
        }
    });

    var backIndex = pageX.winParams.backIndex;
    if (backIndex && backIndex > 0) {
        cmp.href.back(backIndex + 1);
    } else {
        cmp.href.back();
    }

}

// 提交逻辑 开始  ===>>> 

// 检查流程
function _creatWorkflow(callback, drawWf) {

    // 流程
    if (pageX.inputUsers && !cmp.isEmptyObject(pageX.inputUsers)) {

        var datas = [];
        for ( var k in pageX.inputUsers) {
            datas.push(pageX.inputUsers[k]);
        }

        // 快速选人创建流程
        pageX.wfDesigner.createXML({
            jsonData : cmp.toJSON(datas),
            currentNodeId : "",
            drawWf : (drawWf === true),
            type : pageX.wfDesigner.FLOW_TYPE["concurrent"],
            callback : function(names, jsonData) {
                callback();
            },
            errorCallback : function(result) {
                _stopSubmit();
            }
        });
    } else {
        callback();
    }
}

// 发送 step-1
function _send() {
    if (!_isContentInit) {
        _alert(cmp.i18n("collaboration.action.alert.contentinit"));
        return;
    }
	
	//合计加班时间、签卡时间校验
	var retime = pageX.cache.formTitle;
	if(retime.search("加班申请单") != -1){
		var overtimeval = document.getElementById("field0022").value.trim();
		if(overtimeval.length != 0){
			reg = /^[0-9]+([.]{1}[0-9]{1})?$/;
			if(!reg.test(overtimeval)){
				cmp.notification.alert("您输入的合计加班时间格式不正确！",function(){
				},"提示","确定","",false,false);
				return false
		    }
		}
		//加班申请单时间冲突检验
		var userCode = document.getElementById("field0006").value.trim();
		var startTime = document.getElementById("field0016").value.trim();
		var endTime = document.getElementById("field0017").value.trim();
		$.ajax({
			url: "../formBase/formBase.do?method=repeatCheck",
			async: false,
			data: {
				"type": "0",
				"userPk": pageX.cache.summary.pk_psnbasdoc,
				"startTime": startTime,
				"endTime": endTime,
				"summaryId" : pageX.cache.summary.id,
				"templateId" : pageX.cache.summary.templateId,
			},
			dataType:"text",
			type: "post",
			success: function (data) {
				if (data != "") {
					cmp.notification.alert("加班时间与已发起流程【" + data + "】有冲突!",function(){
					},"提示","确定","",false,false);
					return false
				}
			}
		});
		
	}else if(retime.search("请假单") != -1){
		//请假单时间冲突检验
		var userCode = document.getElementById("field0008").value.trim();//人员编码
		var startTime = document.getElementById("field0031").value.trim();
		var endTime = document.getElementById("field0032").value.trim();
		$.ajax({
			url: "http://10.20.19.209/seeyon/formBase/formBase.do?method=repeatCheck",
			async: false,
			data: {
				"type": "0",
				"userPk": userCode,
				"startTime": startTime,
				"endTime": endTime,
				"summaryId" : pageX.cache.summary.id,
				"templateId" : pageX.cache.summary.templateId,
			},
			dataType:"text",
			type: "post",
			success: function (data) {
				if (data != "") {
					cmp.notification.alert("请假时间与已发起流程【" + data + "】有冲突!",function(){
					},"提示","确定","",false,false);
					return false
				}
			},
			error: function (err) {
			    console.log(err)
			},
		});
	}else if(retime.search("签卡证明单") != -1){
		var cardval = document.getElementById("field0020").value.trim();
		var cardval1 = document.getElementById("field0021").value.trim();
		var cardval2 = document.getElementById("field0022").value.trim();
		var cardval3 = document.getElementById("field0023").value.trim();
		var cardval4 = document.getElementById("field0024").value.trim();
		var cardval5 = document.getElementById("field0025").value.trim();
		var cardval6 = document.getElementById("field0026").value.trim();
		var cardval7 = document.getElementById("field0027").value.trim();
		if(cardval.length != 0){
			reg = /^(20|21|22|23|1\d|\d|0[0-9])$/;
			if(!reg.test(cardval)){
				cmp.notification.alert("正常上班签卡时间_时格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval1.length == 0){
				cmp.notification.alert("正常上班签卡时间_分不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval1.length != 0){
			pot = /^(\d|1\d|2\d|3\d|4\d|5\d|0[0-9])$/;
			if(!pot.test(cardval1)){
				cmp.notification.alert("正常上班签卡时间_分格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval.length == 0){
				cmp.notification.alert("正常上班签卡时间_时不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval2.length != 0){
			reg2 = /^(20|21|22|23|1\d|\d|0[0-9])$/;
			if(!reg2.test(cardval2)){
				cmp.notification.alert("正常下班签卡时间_时格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval3.length == 0){
				cmp.notification.alert("正常下班签卡时间_分不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval3.length != 0){
			pot2 = /^(\d|1\d|2\d|3\d|4\d|5\d|0[0-9])$/;
			if(!pot2.test(cardval3)){
				cmp.notification.alert("正常下班签卡时间_分格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval2.length == 0){
				cmp.notification.alert("正常下班签卡时间_时不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval4.length != 0){
			reg3 = /^(20|21|22|23|1\d|\d|0[0-9])$/;
			if(!reg3.test(cardval4)){
				cmp.notification.alert("加班上班签卡时间_时格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval5.length == 0){
				cmp.notification.alert("加班上班签卡时间_分不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval5.length != 0){
			pot3 = /^(\d|1\d|2\d|3\d|4\d|5\d|0[0-9])$/;
			if(!pot3.test(cardval5)){
				cmp.notification.alert("加班上班签卡时间_分格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval4.length == 0){
				cmp.notification.alert("加班上班签卡时间_时不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval6.length != 0){
			reg4 = /^(20|21|22|23|1\d|\d|0[0-9])$/;
			if(!reg4.test(cardval6)){
				cmp.notification.alert("加班上班签卡时间_时格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval7.length == 0){
				cmp.notification.alert("加班上班签卡时间_分不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
		if(cardval7.length != 0){
			pot4 = /^(\d|1\d|2\d|3\d|4\d|5\d|0[0-9])$/;
			if(!pot4.test(cardval7)){
				cmp.notification.alert("加班下班签卡时间_分格式不正确!",function(){
				},"提示","确定","",false,false);
				return false
			}
			if(cardval6.length == 0){
				cmp.notification.alert("加班下班签卡时间_时不能为空!",function(){
				},"提示","确定","",false,false);
				return false
			}
		}
	}


    if (pageX.isSubmitting) {
        return;
    }

    _startSubmit();


    var p = {};
    p.summaryId = pageX.cache.summary["id"];
    var newBusiness = _$("#newBusiness").value;
    p.isNeedCheckAffair = newBusiness == "1" ? "false" : "true";
    var templateId = pageX.cache.summary.templateId;
    
    checkTemplateCanUse(templateId, function() {
        $s.Coll.checkAffairAndLock4NewCol(p, errorBuilder({
            success : function(result) {
                if (result.success != 'true') {
                    _stopSubmit();
                    _alert(result["error_msg"]);
                    return;
                } else {
                    // 验证页面数据
                    var checkRet = checkFields();

                    if (checkRet) {
                        _creatWorkflow(function() {
                            //正文预提交
                            _preSubmitContent();
                        });
                    }
                }
            },
            error : function(req) {
                _stopSubmit();
            },
            exeSelfError : true
        }));
    }, function() {
        _stopSubmit();
        return;
    })
}

/*
 * 表单开发高级 : NC业务集成插件_001_表单开发高级 
 * @param bodyType ：正文类型 
 * @param affairId :affairId
 * @param attitude :态度 
 * @param opinionContent ：意见内容 
 * @param currentDialogWindowObj
 * 
 * ：当前Dialog对象
 */
function formDevelopAdance4ThirdParty(bodyType, affairId, attitude, opinionContent, currentDialogWindowObj,
        succesCallBack) {
    try {
        function failedCallBack() {
            _stopSubmit();
        }
        if (!pageX.isForm) {
            succesCallBack();
        } else {
            beforeSubmit(affairId, CollUtils.trim(attitude), CollUtils.trim(opinionContent), currentDialogWindowObj,
                    succesCallBack, failedCallBack, null);
        }
    } catch (e) {
        _stopSubmit();
        _alert(cmp.i18n("collaboration.exception.formException"));
        logToServer(e.stack);
        console.error(e);
    }
}
// 正文验证及值域获取step-2
function _preSubmitContent() {

    // 检查结果
    var retrunObj = {
        "result" : true,
        "errorMsg" : "",
        "contentData" : []
    }

    var mainbodyArgs = {
        "needSubmit" : true,
        "checkNull" : true,
        "needCheckRule" : true,
        "needCheckRepeatData" : false,
        "errorAlert" : true
    }

    // 是否需要提交数据(有些业务模块正文不单独提交，随着业务整体入库)
    var needSubmit = mainbodyArgs.needSubmit;

    // 是否校验重复表存在重复数据
    var isCheckRepeatData = mainbodyArgs.needCheckRepeatData;

    var contentData = [];// 正文数据

    contentData.push("_currentDiv");
    contentData.push("mainbodyDataDiv_0");

    var contentType = pageX.cache.bodyType;// 正文类型

    if (contentType == "10") {// HTML正文
        // 表单的单独在上面逻辑中处理，因为考虑到confirm组件是异步的，所以把这点逻辑提到表单逻辑分支里
        if (needSubmit) {
            // 是否需要提交数据
            retrunObj["contentData"] = contentData;
        }
        __preSubmitContentCallback(retrunObj);
        
    } else if (pageX.isForm) {

        var options = {
            moduleId : pageX.cache.summary.id,
            needCheckRule : true,
            notSaveDB : true,
            checkNull : true,
            rightId : pageX.cache.formRightId,
            allowQRScan : pageX.cache.summary.canScanCode == '1' ? true : false,
            summaryId : pageX.cache.summary.id,
            templateId : pageX.cache.summary.templateId,
            needSn : false
        }
        cmp.sui.submit(options, function(err, data) {
            
            var capData = CAPUtil.mergeSubmitResult(err, data);
            err = capData.err;
            data = capData.data;
            
            if (err || data.success == "false") {
                retrunObj["result"] = false;
                if (data) {
                    try {
                        retrunObj["errorMsg"] = cmp.parseJSON(data.errorMsg).ruleError;
                    } catch (e) {
                        retrunObj["errorMsg"] = data.errorMsg;
                    }
                } else if (!data && err.message) {
                    retrunObj["errorMsg"] = err.message;
                }
                // 回掉工作流预提交方法
            } else {
                retrunObj["result"] = true;
                retrunObj["data"] = data;
                // 回掉工作流预提交方法
            }
            
            __preSubmitContentCallback(retrunObj);
        }, function(){
            
            //CAP4的error处理
            retrunObj["result"] = false;
            retrunObj["errorMsg"] = "";
            __preSubmitContentCallback(retrunObj);
        });
    }
}

function __preSubmitContentCallback(backData){
    
    if (backData["result"] === true) {
        _preSubmitWorkflow(backData);
    } else {
        _stopSubmit();
    }
}

// 流程预提交step-3
function _preSubmitWorkflow(backData) {
	var preDomains = backData["contentData"];
	var data = backData['data'];
    var domains = preDomains || [];
    
    var _preSubmitCallBackFunc = function(preSubmitResult) {
        if (preSubmitResult["result"] == "true") {

            // 继续调用转圈
            if (!hasloadingbar) {
                cmp.dialog.loading();
            }
		    
    
            var workflowBeforeEventFunc = function() {
		        var workflowCheckParam = {
		            event : "BeforeStart",
		            formAppId : pageX.cache.colMainData.formAppid,
		            formViewOperation : pageX.cache.colMainData.formViewOperation,
		            callback : function(flag) {
		                if (flag) {
		                    // 执行流程预提交
		                    formDevFunc();
		                } else {
		                    _stopSubmit();
		                }
		            }
		        };
		        // 为了在工作流高级开发中能取到表单数据，所以这个地方需要将表单数据ID设置进流程参数。
		        if (!pageX.wfDesigner.info.formData && pageX.isForm) {
		            pageX.wfDesigner.info.formData = backData["data"]["contentAll"]["contentDataId"];
		        }
		
		        pageX.wfDesigner.executeWorkflowBeforeEvent(workflowCheckParam);
		    }
             
             
            var formDevFunc = function(){
            	if(_$("#bodyType").value == "20") {
	        		formDevelopAdance4ThirdParty(_$("#bodyType").value,data.contentAll["contentDataId"],"start",_$("#contentRightId").value,null,submitContent);
	        	} else {
	        		submitContent();
	        	}
            }
           // 协同发送前事件
		    var eventParams = {
		        funName : "beforSendColl",
		        data : null,
		        success : function() {
		        	workflowBeforeEventFunc();
		        },
		        error : function() {
		            _stopSubmit();
		        }
		    }
		    cmp.funProxy.getter(eventParams);
        } else {
            _stopSubmit();
        }
    }

    
  //正式提交保存正文数据
    var submitContent = function(){
    	// 分逻辑
        if (pageX.isForm) {// 表单
            _submitFormContent(function(formSnMsg) {
                // 保存正文后提交
                _submitSummary(formSnMsg, "submit");
            });
        } else {
            // 预提交成功
            _submitContent(function() {
                // 保存正文后提交
                _submitSummary("", "submit");
            });
        }
    }
    // 性能优化，表单需要执行预提交，自由协同不需要，协同模板不能在M3上发送
    if (pageX.isForm) {// 表单
        var options = {
            "contentData" : domains,
            "onPop" : function() {
                // 组件层级管理，需要把这个影藏
                cmp.dialog.loading(false);
                hasloadingbar = false;
            },
            "callback" : _preSubmitCallBackFunc,
            "currentWorkItemIsInSpecial" : null,
            "formInfos" : data && data.contentAll// 表单相关信息
        };
        pageX.wfDesigner.preSubmit(options);
    } else {
        
        var _paramObj = {};
        _paramObj["result"] = 'true';
        _preSubmitCallBackFunc(_paramObj);
    }

}

// 保存正文step-4
function _submitContent(successCallback) {

    var colMainDataDomain = _$("#colMainData");
    CollUtils.fillDom(colMainDataDomain, {
        title : CollUtils.filterUnreadableCode(colMainDataDomain.querySelector("#subject").value)
    });

    var contentData = [];// 正文数据
    contentData.push("_currentDiv");
    contentData.push("mainbodyDataDiv_0");
    var postData = {};
    for(var i = 0, len = contentData.length; i < len; i++){
        postData[contentData[i]] = CollUtils.formPostData(contentData[i]);
        if(contentData[i] == "mainbodyDataDiv_0"
            && postData[contentData[i]]["content"]){
            postData[contentData[i]]["content"] = escapeStringToHTML(postData[contentData[i]]["content"]);
        }
    }
    var jsonParams = {
            "_json_params" : cmp.toJSON(postData)
    }
    $s.Coll.saveOrUpdate({}, jsonParams, errorBuilder({
        success : function(saveBack){
            if (saveBack["success"] == "true") {

                var contentAll = saveBack["contentAll"];

                // 设置协同相关数据
                CollUtils.fillDom("#colMainData", {
                    contentSaveId : contentAll["id"],
                    contentZWID : contentAll["id"]
                });
                successCallback();
            } else {
                _stopSubmit();
            }
        }
    }));
}

function _submitFormContent(successCallback, operType) {

    // 表单正式提交
    var options = {
        moduleId : pageX.cache.summary.id,
        needCheckRule : false,
        notSaveDB : false,
        checkNull : ("saveDraft" == operType) ? false : true,
        rightId : pageX.cache.formRightId,
        allowQRScan : pageX.cache.summary.canScanCode == '1' ? true : false,
        summaryId : pageX.cache.summary.id,
        templateId : pageX.cache.summary.templateId,
        needSn : ("saveDraft" == operType) ? false : true
    }
    
    cmp.sui.submit(options, function(err, data) {
        
        var capData = CAPUtil.mergeSubmitResult(err, data);
        err = capData.err;
        data = capData.data;
        
        if (err || data.success == "false") {
            _stopSubmit();
        } else {

            var contentAll = data.contentAll;
            CollUtils.fillDom("#colMainData", {
                contentSaveId : contentAll["id"],
                contentZWID : contentAll["id"],
                bodyType : "20",
                formRecordid : contentAll["contentDataId"],
                contentTemplateId : contentAll["contentTemplateId"],
                contentDataId : contentAll["contentDataId"]
            });
            
            successCallback(data.snMsg || "");
        }
    }, function(){
        
        //CAP4的error处理
        _stopSubmit();
    });
}

// 提交协同数据
function _submitSummary(formSnMsg, type) {

    // 组装数据
    pageX.postData["colMainData"] = CollUtils.formPostData("colMainData");// 协同数据
    pageX.postData = cmp.extend(pageX.postData, pageX.wfDesigner.getDatas());// 流程数据

    // 附件数据
    if (pageX.fileComponent) {
        pageX.postData.attFileDomain = pageX.fileComponent.getFileArray();
    }

    var p = {
        "_json_params" : cmp.toJSON(pageX.postData)
    }

    var restFunction;
    if(type === "saveDraft"){
        restFunction = $s.Coll.saveDraft;
    }else {
        restFunction = $s.Coll.send;
    }
    
    restFunction({}, p, errorBuilder({
        success : function(result) {
            if (result && result["error_msg"]) {
                _stopSubmit();
                _alert(result["error_msg"]);// 提示
            } else {
                
                if(type !== "saveDraft"){
                    //触发门户刷新数据
                    cmp.webViewListener.fire({
                        type : 'com.seeyon.m3.ListRefresh',
                        data : {
                            appId : "1",
                            type : "update"
                        }
                    })
                }

                if (formSnMsg) {
                    _alert(formSnMsg, _goBackAndRefresh);
                } else {
                    // 跳转到上个页面
                    _goBackAndRefresh();
                }
            }
        },
        error : function(req) {
            _stopSubmit();
        }
    }));
}

// 结束
function _stopSubmit() {
    cmp.dialog.loading(false);
    pageX.isSubmitting = false;
}

// 开始提交
function _startSubmit() {
    pageX.isSubmitting = true;
    cmp.dialog.loading();// 提交中...
}
//<<<=== 提交逻辑 结束

// ===>>> 保存待发 开始
function _saveDraft() {

    if (pageX.isSubmitting) {
        return;
    }
    // 开始提交
    _startSubmit();

    // 协同保存待发前事件
    var eventParams = {
        funName : "beforeSaveDraftColl",
        data : null,
        success : function() {
            if (!_checkSubject()) {
                // _stopSubmit();
                return;
            }
            var p = {};
            p.summaryId = pageX.cache.summary["id"];
            var newBusiness = _$("#newBusiness").value;
            p.isNeedCheckAffair = newBusiness == "1" ? "false" : "true";
            var templateId = pageX.cache.summary.templateId;
            checkTemplateCanUse(templateId, function() {
                $s.Coll.checkAffairAndLock4NewCol(p, errorBuilder({
                    success : function(result) {
                        if (result.success != 'true') {
                            _stopSubmit();
                            _alert(result["error_msg"]);
                            return;
                        } else {
                            // 创建流程
                            _creatWorkflow(function() {
                                var doSubmit = function(formSnMsg) {
                                    _submitSummary(formSnMsg, "saveDraft");
                                }
                                if (pageX.isForm) {
                                    _submitFormContent(doSubmit, "saveDraft");
                                } else {
                                    // 保存正文后提交
                                    _submitContent(doSubmit);
                                }
                            });

                        }
                    },
                    error : function(req) {
                        _stopSubmit();
                    },
                    exeSelfError : false
                }));
            }, function() {
                _stopSubmit();
                return;
            })

        },
        error : function() {
            _stopSubmit();
        }
    }
    cmp.funProxy.getter(eventParams);
}
// <<<=== 保存待发 结束














// 流程相关的事件
function _bindWfEvent() {

    // 点击编辑流程
    cmp.event.click(_$('#edit_receiver'), function() {
        /*
         * _creatWorkflow(function(){ pageX.wfDesigner.edit(); }, true);
         */
        var fillMember = []
        if (pageX.inputUsers) {
            for ( var k in pageX.inputUsers) {
                var m = pageX.inputUsers[k];
                fillMember.push({
                    id : m.id,
                    name : m.name,
                    type : "member"
                });
            }
        }

        pageX.wfDesigner.edit({
            initMembers : fillMember
        });
    });
}

// 验证字段
function checkFields() {

    if (!_checkSubject()) {
        return false;
    }

    // 流程
    if (pageX.wfDesigner.isWfEmpty() && (!pageX.inputUsers || cmp.isEmptyObject(pageX.inputUsers))) {

        _stopSubmit();

        // 流程不能为空！
        _alert(cmp.i18n("collaboration.page.dialog.wfNotNull"), function() {
            _toggleReceiver("show");
        });// 提示
        return false;
    }

    return true;
}

// 检查标题
function _checkSubject() {
    // 标题
    var $subject = _$("#subject");
    if (isValueBlank($subject)) {
        // 标题不能为空
        var dom = document.querySelector("#subject");

        _stopSubmit();

        _alert(cmp.i18n("collaboration.page.dialog.subjectNotNull"), function() {
            dom.focus();
        });// 提示
        return;
    }

    if (!pageX.cache.hasColSubject && isOverMaxSize($subject, 300)) {

        _stopSubmit();

        // 标题最大长度为300!
        _alert(cmp.i18n("collaboration.page.dialog.subject300Limit"));// 提示
        return false;
    }
    return true;
}

// 检查值是否未空
function isValueBlank(e) {
    var ret = false;
    if (e && CollUtils.trim(e.value) == "") {
        ret = true;
    }
    return ret;
}

// 检验最大长度
function isOverMaxSize(e, except) {
    var ret = false;
    if (e) {
        var v = e.value;
        if (v.length > except) {
            ret = true;
        }
    }
    return ret;
}

// 跟踪
function _setTracking(active) {
    var trackValue = "0";
    if (active) {
        trackValue = "1";
    }
    pageX.cache.colMainData.canTrack = trackValue;
    CollUtils.setDomainFieldVal("colMainData", "canTrack", trackValue);
}

// 重要级别
function _setImportantLevel() {
    // var btns = [];
    // var items = pageX.cache.importLevelEnum["items"];
    // for (var i = 0, len = items.length; i < len; i++) {
    //     btns.push({
    //         key : items[i]["key"],
    //         name : items[i]["label"]
    //     // 非常重要
    //     });
    // }
    // cmp.dialog.actionSheet(btns, cmp.i18n("collaboration.page.lable.button.cancel"), function(item) {
    //     // 点击操作
    //     _setImportValue(item);
    // }, function() {
    //     // 点击取消
    // });
}

function _setImportValue(item) {

    // 点击操作
    var tempKey = item.key;
    var lable = item.name;

    pageX.cache.importLevelEnum["defVal"] = {
        "label" : lable,
        "key" : tempKey
    };

    CollUtils.setDomainFieldVal("colMainData", "importantLevel", tempKey);
    // _$("#importLevelLable").innerText = lable;
}

// 处理header定位问题
function dealHeader() {
    setTimeout(function() {
        // cmp.HeaderFixed("#hid", document.querySelectorAll("#content, #subject, .sui-form-ctrl-value"));
        cmp.description.init(document.querySelector("#content"));
	
    }, 50);
}

// 预归档
function selectArchive() {
    docPigehole4Col("", function(_result) {
        
        var fillDatas = {
                colArchiveName : cmp.i18n("collaboration.pighole.click"),
                colPigeonhole : "",
                prevArchiveId : "",
                archiveId : ""
        }
        
        if (_result && _result.msg == "OK") {
            fillDatas.colArchiveName = pageX.cache.colArchiveName = _result.name;
            fillDatas.colPigeonhole = fillDatas.prevArchiveId = fillDatas.archiveId = _result.id;
        }
        if(_$("#colArchiveName")){
            //弹开···的时候回填到dom
            _$("#colArchiveName").innerHTML = fillDatas.colArchiveName;
        }
        CollUtils.fillDom("#colMainData", fillDatas);
    });
}


function checkTemplateCanUse(templateId, successCallBack, errorCallBack) {
    if (!templateId) {
        successCallBack();
    } else {
        var param = {};
        param["data"] = "0_" + templateId;
        $s.Coll.checkTemplateCanUse({}, param, errorBuilder({
            success : function(result) {
                if (result.success == 'true') {
                    successCallBack();
                } else {
                    errorCallBack();
                    _alert(cmp.i18n("collaboration.alert.template.cannot.use"));
                }
            },
            error : function(req) {
                errorCallBack();
            },
            exeSelfError : true
        }));
    }
}
var touchmoveMethod;
function _dragThis(obj,parentNode){
    var dragObj = document.getElementById(obj);
    var parentNode = document.getElementById(parentNode);
    var pWidth = parentNode.clientWidth,pHeight = parentNode.clientHeight;

    dragObj.addEventListener('touchstart',function(event){
        
        //拖动的时候就隐藏提示的那个区域
        var $src_form_view_hint = _$("#src_form_view_hint");
        if(!$src_form_view_hint.classList.contains("display_none")){
            $src_form_view_hint.classList.add("display_none");
        }
        
        //当只有一个手指时              .
        if(event.touches.length == 1){
            //禁止浏览器默认事
            event.preventDefault();
        };
        var touch = event.targetTouches[0];
        var disX = touch.clientX - dragObj.offsetLeft,disY = touch.clientY - dragObj.offsetTop;
        var oWidth = dragObj.offsetWidth,oHeight = dragObj.offsetHeight;
        touchmoveMethod = function(event){
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
        };
        dragObj.addEventListener('touchmove',touchmoveMethod,false);
    });
    dragObj.addEventListener('touchend',function(event){
        dragObj.removeEventListener('touchmove',touchmoveMethod,false);
    })
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