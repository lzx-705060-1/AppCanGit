/**
 * Created by xp on 2016/1/6 0006.
 */

(function(_){
    if(typeof CMP_ACCDOC_I18N_LOADED  == "undefined") {
        _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-accDoc',function(){
            CMP_ACCDOC_I18N_LOADED = true;
            _.event.trigger("cmp-accDoc-init",document);
        },cmpBuildversion);//如果页面没有加载国际化资源，此处才加载
    }
    var accDocConstant = {
        C_iDataType_coordination:0,//数据类型是协同
        C_iDataType_doc:1,//数据类型是文档
        C_iDataType_edoc:2,//数据类型是公文数据

        C_iCoordination_dataParam_todo:3,//待办
        C_iCoordination_dataParam_done:4,//已办
        C_iCoordination_dataParam_send:2,//已发

        C_iEdoc_dataParam_send_pending:"0|listPending",//公文发文待办
        C_iEdoc_dataParam_send_doing:"0|listZcdb",//公文发文在办
        C_iEdoc_dataParam_send_done:"0|listDoneAll",//公文发文已办
        C_iEdoc_dataParam_send_sent:"0|listSent",//公文发文已发
        C_iEdoc_dataParam_send_waitSend:"0|listWaitSend",//公文发文待发
        C_iEdoc_dataParam_receive_pending:"1|listPending",//公文收文待办
        C_iEdoc_dataParam_receive_doing:"1|listZcdb",//公文收文在办
        C_iEdoc_dataParam_receive_done:"1|listDoneAll",//公文收文已办
        C_iEdoc_dataParam_receive_sent:"1|listSent",//公文收文已发
        C_iEdoc_dataParam_receive_waitSend:"1|listWaitSend",//公文收文待发
        C_iEdoc_dataParam_report_pending:"2|listPending",//公文签报待办
        C_iEdoc_dataParam_report_doing:"2|listZcdb",//公文签报在办
        C_iEdoc_dataParam_report_done:"2|listDoneAll",//公文签报已办
        C_iEdoc_dataParam_report_sent:"2|listSent",//公文签报已发
        C_iEdoc_dataParam_report_waitSend:"2|listWaitSend",//公文签报待发

        C_iSearchType_coordination:1,
        C_sSearchType_param_startMemberName:'startMemberName', //发起人姓名
        C_sSearchType_param_subject:'subject', //标题
        C_sSearchType_param_createDate:'createDate',//发起时间

        C_iSearchType_doc:2,
        C_iSearchType_doc_param_member:8,//文档搜索---按创建人搜
        C_iSearchType_doc_param_doc:1,//文档搜索----按文档名称搜索

        C_iDocDataType_lib:1,//文档数据类型----文档库
        C_iDocDataType_sub:2,//文档数据类型----文档

        C_iSearchType_edoc:3,

        C_iCrumbs_increase:1, //面包屑增加
        C_iCrumbs_reduce:2,  //面包屑减少
        C_iCrumbs_choose:3,  //面包屑选择
        C_sJumpPagePath:cmpBASEPATH + "/page/cmp-accDoc-penetrate-page.html"//跳转方式时，页面地址
    };
    var accDoc = function(opts){
        var self = this;
        self.opts = _.extend({
            callback:null,
            fillbackData:null,
            closeCallback:null,//关闭组件回调
            maxSize:-1,//最多选择数据的条数，默认-1 无限制
        },opts);
        self._init();
        if(typeof CMP_ACCDOC_I18N_LOADED == "undefined"){
            document.addEventListener("cmp-accDoc-init",function(){
                self._initShow();
            })
        }else {
            self._initShow();
        }

    };

    accDoc.prototype._init = function(){
        var self = this;
        var dataCacheArr = self._getSelectDataCache(self.opts.fillbackData);//选择的数据缓存(用于返回结果)
        self._setReshowDataCache(dataCacheArr);
        self.selectDataIDCache = [];
        self.preSelectDataCache = [];//前一次选中的数据集合
        self.basicDiv = "";
        self.uuID = self.opts._transed?"":_.buildUUID();
        self.docShow = self.opts._transed?self.opts.docShow:false;
        self.edocShow = self.opts._transed?self.opts.edocShow:false;
        self.coorState = self.opts.coorState || accDocConstant.C_iCoordination_dataParam_todo;
        self.edocState = self.opts.edocState || accDocConstant.C_iEdoc_dataParam_send_pending;
        self.otherTitle = document.title;
        self.initDataReady = false;//初始数据是否准备好
        self.initRequestDocData = true;//是否第一次请求文档数据
        self.initRenderContent = {};
        self.runOk = false;
        self.docChain = {};//文档链
        self.docLibID = "0";//文档当前操作层文档库id,用于搜索
        self.docReShow = false;
        self.coordinationReShow = false;
        self.userName = _.member?_.member.name + "_"+ _.member.id:_.storage.get("CMP_V5_USERNAME");//获取登陆名
        self.allRABC = true;//所有的权限
        self.typeSwitchAble = true;//类型切换可否
        self.loadingListened = false;//是否监听了loading的关闭
        self.initCreateDocContent = true;//第一次创建文档content
    };
    accDoc.prototype._getSelectDataCache = function(fillbackData){
        var selectDataCache = [];
        if(fillbackData != null) {
            var i = 0,len = fillbackData.length;
            for(;i < len ;i++){
                selectDataCache.push(fillbackData[i]);
            }
        }
        return selectDataCache;
    };
    accDoc.prototype._initShow = function(){
        var self = this;
        self._updateTitle(true);
        if(!self.opts._transed){
            _.backbutton.push(_.accDocClose);
        }
        self._cacheSelectedDataID(self.selectDataCache);
        self._cachePreSelectedData();
        _.dialog.loading();
        var initData = {},sendRbacRequestTimer = 4;//各种权限的判断需要发4个请求
        var  rbacReadyNextFun = function(){
            _.dialog.loading(false);
            console.log(initData);
            self._assemble(initData);
            self._setContentHeight();
            self._closeEvent();
            self._initRenderFirstList();
            self._event();
            document.removeEventListener("rbacReady",rbacReadyNextFun,false);
        };
        document.addEventListener("rbacReady",rbacReadyNextFun,false);//监听rbac是否ok
        //发送协同的权限请求和协同的待办，已办，已发数量数量
        accDoc.getColRBACAndColQuoteCounts({
            success:function(result){
                sendRbacRequestTimer --;
                var haveTab = result.haveTab;
                initData.colRBAC = true;
                initData.colTodoRBAC = haveTab[0];
                initData.colDoneRBAC = haveTab[1];
                initData.colSentRBAC = haveTab[2];
                initData.colNum = result.countMap;
                if(!haveTab[0] && !haveTab[1] && !haveTab[2]){
                    initData.colRABC = false;
                    self.colRABC = false;
                }
                if(!sendRbacRequestTimer){
                    _.event.trigger("rbacReady",document);
                }
            },
            error:function(e){
                self._handleInitRequestError(e,_.i18n("cmp.accDoc.requestError"),rbacReadyNextFun);
            }
        });
        //发送是否有文档和公文的加密狗的请求
        accDoc.getDocPlugin({
            success:function(product){
                sendRbacRequestTimer --;
                var plugins = product.plugins;
                initData.hasDocPlugin = (plugins.inArray("doc"));
                initData.hasEdocPlugin = plugins.inArray("edoc");
                if(!sendRbacRequestTimer){
                    _.event.trigger("rbacReady",document);
                }
            },
            error:function(e){
                self._handleInitRequestError(e,_.i18n("cmp.accDoc.requestPluginsError"),rbacReadyNextFun);
            }
        });
        //发送文档的权限的请求
        accDoc.getDocRBAC({
            success:function(rbac){
                sendRbacRequestTimer --;
                initData.hasDocRBAC = rbac.data;
                if(!sendRbacRequestTimer){
                    _.event.trigger("rbacReady",document);
                }
            },
            error:function(e){
                self._handleInitRequestError(e,_.i18n("cmp.accDoc.requestPluginsError"),rbacReadyNextFun);
            }
        });
        //发送公文的【发文】、【收文】、【签报】权限的请求
        accDoc.getEdocRBAC({
            success:function(rbac){
                sendRbacRequestTimer --;
                initData.send = rbac.haveEdocSend;
                initData.receive = rbac.haveEdocRec;
                initData.report = rbac.haveEdocSignReport;
                initData.edocRBAC = (initData.send || initData.receive || initData.report);
                if(!sendRbacRequestTimer){
                    _.event.trigger("rbacReady",document);
                }
            },
            error:function(e){
                self._handleInitRequestError(e,_.i18n("cmp.accDoc.requestPluginsError"),rbacReadyNextFun);
            }
        });

        
    };
    accDoc.prototype._updateTitle = function(selfTitle,newTitle){
        var self = this;
        var title;
        if(selfTitle){
            title = _.i18n("cmp.accDoc.widgetTitle");
        }else if(newTitle){
            title = newTitle;
        }else {
            title = self.otherTitle;
        }
        document.title = title;
    };
    //为了适配横竖屏，而新增的方法
    accDoc.prototype.orientationChange = function(initShow,reShow,reClick){
        var self = this;
        if(initShow){
            _.event.orientationChange(function(res){
                var cmp_accDoc_first = document.querySelector('.cmp_accDoc_first.cmp-active');
                if(!cmp_accDoc_first)return;
                var cmp_accDoc_floor = cmp_accDoc_first.querySelector('.cmp_accDoc_floor.cmp-active');
                var domId = cmp_accDoc_floor.getAttribute("id");
                var titleH = 45;
                var headerH = self.basicDiv.querySelector('.cmp-accDoc-header').offsetHeight;
                var footerH = self.basicDiv.querySelector('footer.cmp-accDoc-footer').offsetHeight;
                var windowH = window.innerHeight - headerH - footerH;
                    cmp_accDoc_floor.style.height = windowH - titleH +"px";
                    _.listView("#"+domId).refresh();
            });
        }else if(reShow){
            if(!cmp.os.iPad)return;
            if(reClick){
                self.reClickChange();
            }
            setTimeout(function(){
                var cmp_accDoc_first = document.querySelector('.cmp_accDoc_first.cmp-active');
                if(!cmp_accDoc_first)return;
                var cmp_accDoc_floor = cmp_accDoc_first.querySelector('.cmp_accDoc_floor.cmp-active');
                var domId = cmp_accDoc_floor.getAttribute("id");
                var titleH = 45;
                var headerH = self.basicDiv.querySelector('header.cmp-accDoc-header').offsetHeight;
                var footerH = self.basicDiv.querySelector('footer.cmp-accDoc-footer').offsetHeight;
                var windowH = window.innerHeight - headerH - footerH;
                cmp_accDoc_floor.style.height = windowH - titleH +"px";
                _.listView(domId).refresh();
            },300);
        }

    };
    //为了适配横屏切换再点击页签没有重新计算高度而新增函数
    accDoc.prototype.reClickChange = function(){
        var self = this;
        var navDom = self.basicDiv.querySelectorAll('nav.cmp-control-item');//获取所有的nav点击热点
        var navNumber= 0,len = navDom.length;
        for(navNumber;navNumber<len;navNumber++){
            (function(index){
                _.event.click(navDom[index],function(e){
                    var target = e.target;
                    var navHTML = target.tagName == "SPAN"?target.parentNode:target;
                    setTimeout(function(){
                        if(navHTML.classList.contains('cmp-active')){
                            var cmp_accDoc_first = self.basicDiv.querySelector('.cmp_accDoc_first.cmp-active');
                            var cmp_accDoc_floor = cmp_accDoc_first.querySelector('.cmp_accDoc_floor.cmp-active');
                            var domId = "#"+cmp_accDoc_floor.getAttribute("id");
                            var titleH = 45;
                            var headerH = self.basicDiv.querySelector('.cmp-accDoc-header').offsetHeight;
                            var footerH = self.basicDiv.querySelector('footer.cmp-accDoc-footer').offsetHeight;
                            var windowH = window.innerHeight - headerH - footerH;
                            cmp_accDoc_floor.style.height = windowH - titleH +"px";
                            _.listView(domId).refresh();
                        }
                    },300);

                });
            })(navNumber);
        }
    };
    var tipsError = false;
    accDoc.prototype._handleInitRequestError = function(error,message,rbacReadyNextFun){
        _.dialog.loading(false);
        if(tipsError) return;
        tipsError = true;
        var self = this;
        console.log(error);
        document.removeEventListener("rbacReady",rbacReadyNextFun,false);
        if(!_.errorHandler(error)){
            _.notification.alert(message,function(){
                if(self.opts._transed){
                    self._handleJumpPageDocResult(null);
                }else {
                    self._close();
                    self.cacheSelectedData();
                    self.runOk = false;
                }
            },_.i18n("cmp.accDoc.tips"),_.i18n("cmp.accDoc.ok"));
        }
    };
    accDoc.prototype._reShow= function(fillbackData){
        var self = this;
        self._updateTitle(true);
        _.backbutton.push(_.accDocClose);
        var dataCacheArr = [];
        if(fillbackData && fillbackData != null){
            dataCacheArr = self._getSelectDataCache(fillbackData);
        }else {
            dataCacheArr = (self.runOk == true)?self.selectDataCache:self.preSelectDataCache;
        }
        self._cacheSelectedDataID(dataCacheArr);
        self._setReshowDataCache(dataCacheArr);
        self._renderLastListViewFillback();
        self.basicDiv.classList.remove("cmp-hidden");



        setTimeout(function(){
            self.basicDiv.classList.remove("cmp-accDoc-basicDiv-close");
            self.basicDiv.classList.add("cmp-accDoc-basicDiv-show");
            self.orientationChange(false,true,true);
        },300);

    };

    accDoc.prototype._cacheSelectedDataID = function(dataArr){
        var self=  this;
        self.selectDataIDCache = [];
        var len = dataArr.length;
        if(len > 0) {
            var i = 0;
            for(; i < len; i ++) {
                var data;
                if(typeof dataArr[i] == "string"){
                    data = _.parseJSON(dataArr[i]);
                }else {
                    data = dataArr[i];
                }
                var dataId = typeof data.fileUrl != "undefined" ?data.fileUrl: data.fr_id || dataArr[i].id || data.affairId || data.fileId;
                self.selectDataIDCache.push(dataId);
            }
        }
    };
    accDoc.prototype.cacheSelectedData = function(){
        var self = this;
        self.selectDataCache = [];
        var i = 0,len = self.preSelectDataCache.length;
        for(; i < len ; i ++){
            self.selectDataCache.push(self.preSelectDataCache[i]);
        }
    };
    accDoc.prototype._setReshowDataCache = function(dataArr){
        var self = this;
        self.selectDataCache = [];
        var len = dataArr.length;
        if(len > 0) {
            var i = 0;
            for(; i < len; i ++) {
                self.selectDataCache.push(_.toJSON(dataArr[i]));
            }
        }
    };
    accDoc.prototype._cachePreSelectedData = function(){
        var self = this;
        self.preSelectDataCache = [];
        var i = 0,len = self.selectDataCache.length;
        for(; i < len ; i ++) {
            self.preSelectDataCache.push(self.selectDataCache[i]);
        }
    };
    accDoc.prototype._assemble = function(initData){
        var self = this;
        var basicDiv;
        if(!self.opts._transed){   //todo 本页弹出的，稍后处理
            basicDiv = document.createElement("div");
            basicDiv.classList.add("cmp-accDoc-basicDiv");
            initData.uuID = self.uuID;
            basicDiv.innerHTML = _.tpl(content(),initData);
            document.getElementsByTagName('body')[0].appendChild(basicDiv);
        }else {
            basicDiv = document.body;
        }
        basicDiv.setAttribute("id","cmp_accDoc_widget"+self.uuID);
        basicDiv.setAttribute("uid",self.opts.id);
        self.content = basicDiv.querySelector(".cmp-content");
        self.header = basicDiv.querySelector(".cmp-accDoc-header");
        self.footer = basicDiv.querySelector("footer");
        self.backBtn = basicDiv.querySelector("#cmp_accDoc_backBtn");  //回退按钮，协同页面不展示
        // _.append(self.backBtn,"<span class='back_text submit_text' style='margin-left: 0;'>"+_.i18n("cmp.accDoc.back.qudiao")+"</span>");
        self.searchBtn = basicDiv.querySelector("#cmp_accDoc_searchBtn");//搜索按钮
        self.colSwitch = basicDiv.querySelector("#colControlItem");//协同页签按钮
        self.docSwitch = basicDiv.querySelector("#docControlItem");//文档页签按钮
        self.edocSwitch = basicDiv.querySelector("#eDocControlItem");//公文页签按钮
        self.okBtn = basicDiv.querySelector("#cmp_accDoc_okBtn");//确定按钮
        self.closeBtn = basicDiv.querySelector("#cmp_accDoc_closeBtn");//关闭按钮
        self.numArea = basicDiv.querySelector("#cmp_accDoc_selectNum");//选择数量按钮
        self.searchUI = null;//搜索页面,初始置为空,动态创建

        self.coordinationArea = basicDiv.querySelector("#cmp_accDoc_coordinationArea"+self.uuID);//协同展示区
        self.coordinationSwitchBtn = self.coordinationArea.querySelector("#cmp_accDoc_coordinationSwitch");//协同切换按钮
        self.coorTodoArea = self.coordinationArea.querySelector("#cmp_addDoc_coordination_todoArea"+self.uuID);//待办区
        self.coorDoneArea = self.coordinationArea.querySelector("#cmp_addDoc_coordination_doneArea"+self.uuID);//已办区
        self.coorSendArea = self.coordinationArea.querySelector("#cmp_addDoc_coordination_sendArea"+self.uuID);//待发区
        self.coorTodoList = self.coordinationArea.querySelector("#cmp_accDoc_coordination_todoList"+self.uuID);//待办列表
        self.coorDoneList = self.coordinationArea.querySelector("#cmp_accDoc_coordination_doneList"+self.uuID);//已办列表
        self.coorSendList = self.coordinationArea.querySelector("#cmp_accDoc_coordination_sendList"+self.uuID);//已发列表
        self.coorTabCtrlTab = self.coordinationArea.querySelectorAll("nav.cmp-control-item");//协同中【待办】、【已办】【待发】页签

        self.docArea = basicDiv.querySelector("#cmp_accDoc_docArea"+self.uuID);//文档展示区
        self.crumbs = self.docArea.querySelector("#cmp_accDoc_crumbsList");//面包屑
        self.docList = self.docArea.querySelector("#cmp_accDoc_docList");//文档列表

        self.edocArea = basicDiv.querySelector("#cmp_accDoc_edocArea"+self.uuID);//公文展示区
        self.edocSwitchBtn = self.edocArea.querySelector("#cmp_accDoc_edocSwitch");//公文切换按钮
        self.edocTabCtrlTab = self.edocArea.querySelectorAll("nav.cmp-control-item");//公文【发文】、【收文】、【签报】页签

        self.edocListTypePopover = self.edocArea.querySelector(".popover-items");//公文列表类型选择器
        self.backDrop = basicDiv.querySelector(".cmp-accDoc-back-drop");//遮罩div
        self.gou = self.edocListTypePopover.querySelector(".accDoc-gou");//选择器小勾勾
        var initRABC = self._countInitRBAC(initData);
        if(initRABC != "7"){//如果不为7那么其中有页签没有权限
            if(initRABC == "0"){//全部权限都没有
                self.coordinationSwitchBtn.classList.add("cmp-hidden");
                self.footer.classList.add("cmp-hidden");
                self.content.style.background = "#ffffff";
                self.backBtn.classList.remove("display_none");
                if(_.os.ios){
                    self.content.classList.remove("cmp-accDoc-ios-content");
                    self.content.classList.add("cmp-accDoc-ios-content2");
                }
                self.allRABC = false;
                self.typeSwitchAble = false;
            }else if(initRABC.indexOf("1") != -1){//有协同的权限
                basicDiv.querySelector("#pendingNO").innerHTML = initData.colNum.listPending;
                basicDiv.querySelector("#doneNO").innerHTML = initData.colNum.listDone;
                basicDiv.querySelector("#sentNO").innerHTML = initData.colNum.listSent;
                self._handleColItemRBAC(initData);
                switch (initRABC){
                    case "1"://只有协同权限
                        self.docSwitch.classList.add("cmp-hidden");
                        self.edocSwitch.classList.add("cmp-hidden");
                        self.typeSwitchAble = false;
                        break;
                    case "12"://协同+文档权限
                        self.edocSwitch.classList.add("cmp-hidden");
                        break;
                    case "13"://协同+公文权限
                        self.docSwitch.classList.add("cmp-hidden");
                        break;
                }
            }else{//没有协同权限
                self.colSwitch.classList.remove("cmp-active");
                self.colSwitch.classList.add("cmp-hidden");
                self.coordinationArea.remove("cmp-active");
                self.coordinationArea.classList.add("cmp-hidden");
                if(initRABC.indexOf("2") != -1){//有文档权限
                    self.docSwitch.classList.add("cmp-active");
                    self.docArea.classList.add("cmp-active");
                    var docArchiveID = self.backBtn.getAttribute("data-key");
                    if(typeof self.docChain[docArchiveID] != "undefined") {
                        // self.backBtn.classList.add("cmp-active");
                        self.backBtn.classList.remove("display_none");
                    }else {
                        // self.backBtn.classList.remove("cmp-active");
                        self.backBtn.classList.add("display_none");
                    }
                    self.docShow = true;
                }
                switch(initRABC){
                    case "2"://只有文档权限
                        self.typeSwitchAble = false;
                        break;
                    case "3"://只有公文权限
                        self.typeSwitchAble = false;
                        self.docSwitch.classList.add("cmp-hidden");
                        self.edocSwitch.classList.add("cmp-active");
                        self.edocShow = true;
                        self._handleEdocItemRBAC(initData);
                        break;
                }
            }
        }else {
            // basicDiv.querySelector("#pendingNO").innerHTML = initData.colNum.listPending;
            // basicDiv.querySelector("#doneNO").innerHTML = initData.colNum.listDone;
            // basicDiv.querySelector("#sentNO").innerHTML = initData.colNum.listSent;
            self._handleColItemRBAC(initData);
        }
        setTimeout(function(){
            if(!self.opts._transed){
                basicDiv.classList.add("cmp-accDoc-basicDiv-show");
            }
        },300);
        self.basicDiv = basicDiv;
        self.orientationChange(true);
        if(cmp.os.iPad){
            self.reClickChange();
        }
    };
    accDoc.prototype._countInitRBAC = function(initData){
        var colRBAC = initData.colRBAC,docRBAC=(initData.hasDocPlugin && initData.hasDocRBAC),edocRBAC= (initData.hasEdocPlugin && initData.edocRBAC);
        if(!colRBAC && !docRBAC && !edocRBAC){
            return "0"; //全部权限都没有的情况
        }else {
            if(colRBAC){
                if(!docRBAC && !edocRBAC) return "1";//只有协同权限
                if(docRBAC && !edocRBAC) return "12";//协同+ 文档权限
                if(!docRBAC && edocRBAC) return "13";//协同 + 公文权限
            }else {
                if(docRBAC && edocRBAC) return "23";//文档+公文权限
                if(docRBAC && !edocRBAC) return "2";//只有文档的权限
                if(!docRBAC && edocRBAC) return "3";//只有公文的权限
            }
            return "7";//所有权限都有
        }
    };
    accDoc.prototype._handleColItemRBAC = function(initData){
        var self = this;
        if(!initData.colTodoRBAC){
            self.coorTabCtrlTab[0].classList.add("cmp-hidden");
            self.coorTabCtrlTab[0].classList.remove("cmp-active");
            if(initData.colDoneRBAC){
                self.coorTabCtrlTab[1].classList.add("cmp-active");
                self.coorState = accDocConstant.C_iCoordination_dataParam_done;
                if(!initData.colSentRBAC) self.coorTabCtrlTab[2].classList.add("cmp-hidden");
            }else {
                self.coorTabCtrlTab[1].classList.add("cmp-hidden");
                self.coorTabCtrlTab[2].classList.add("cmp-active");
                self.coorState = accDocConstant.C_iCoordination_dataParam_send;
            }
        }else {
            if(!initData.colDoneRBAC) self.coorTabCtrlTab[1].classList.add("cmp-hidden");
            if(!initData.colSentRBAC) self.coorTabCtrlTab[2].classList.add("cmp-hidden");
        }
    };

    accDoc.prototype._handleEdocItemRBAC = function(initData){
        var self = this;
        if(!initData.send){
            self.edocTabCtrlTab[0].classList.remove("cmp-active");
            self.edocTabCtrlTab[0].classList.add("cmp-hidden");
            if(initData.receive){
                self.edocTabCtrlTab[1].classList.add("cmp-active");
                self.edocState = accDocConstant.C_iEdoc_dataParam_receive_pending;
                if(!initData.report) self.edocTabCtrlTab[2].classList.add("cmp-hidden");
            }else {
                self.edocTabCtrlTab[1].classList.add("cmp-hidden");
                self.edocTabCtrlTab[2].classList.add("cmp-active");
                self.edcoState = accDocConstant.C_iEdoc_dataParam_report_pending;
            }
        }else {
            if(!initData.receive) self.edocTabCtrlTab[1].classList.add("cmp-hidden");
            if(!initData.report) self.edocTabCtrlTab[2].classList.add("cmp-hidden");
        }
    };
    accDoc.prototype._setContentHeight = function(){
        var self = this;
        var height = CMPFULLSREENHEIGHT;
        var headerHeight = self.header.offsetHeight;
        var btnAreaHeight = self.footer.offsetHeight;
        self.content.style.height = (height-headerHeight - btnAreaHeight)+"px";
    };
    accDoc.prototype._setTabHeight = function(tab){
        var self = this;
        if(!self.opts._transed){
            var mainHeight = self.basicDiv.offsetHeight;
            var headerHeight = self.header.offsetHeight;
            var footerHeight = self.footer.offsetHeight;
            var tabBtnHeight = self.coordinationSwitchBtn.offsetHeight;
            tab.style.height = (mainHeight - headerHeight - footerHeight - tabBtnHeight) + "px";
        }
    };
    accDoc.prototype._initRenderFirstList = function(){
        var self = this;
        if(!self.allRABC){//如果所有权限都没有，则进行无权限渲染
            self._noRBACRender();
        }else {
            if(self.docShow){//如果是文档中心先显示，则先渲染文档中心
                self._initRenderDoc();
            }else if(self.edocShow){
                self._initRenderEdoc();
            }else {
                self._initRenderCoor();
            }
        }
    };
    accDoc.prototype._initRenderCoor = function(){
        var self = this;
        var coorState = self._getStateObj(1);
        if(typeof self.initRenderContent[coorState.id] == "undefined"){
            self.initRenderContent[coorState.id] = true;
            var target = self.coordinationArea.querySelector("#"+coorState.area);
            target.classList.add("cmp-active");
            var aCtr = self.basicDiv.querySelector("nav[data-param=\""+self.coorState+"\"]");
            aCtr.classList.add("cmp-active");
            self._accDocListView(accDocConstant.C_iDataType_coordination,
                self._coordinationRender,self.coorState,coorState.id,coorState.id,1);
            target.classList.add("requested");
            self._setTabHeight(target);
        }
    };

    accDoc.prototype._initRenderDoc = function(){
        var self = this;
        if(self.opts.docChain && Object.keys(self.opts.docChain).length > 0) {//如果文档中心的
            //todo 渲染面包屑

            function initUpdateCrumbs(parentDoc){
                if(self.opts.docChain[parentDoc]){
                    var docName = self.opts.docChain[parentDoc].childrenName;
                    var docId = self.opts.docChain[parentDoc].children;
                    self._updateCrumbs(docId,docName,accDocConstant.C_iCrumbs_increase);
                    self._setDocChain(docId,docName);
                    delete self.opts.docChain[parentDoc];
                    initUpdateCrumbs(docId);
                }
            }
            initUpdateCrumbs("x-9999");
        }
        var crumbs = self.crumbs.lastElementChild.getAttribute("id").replace("crumbs_","");
        self.initRenderContent["cmp_accDoc_scroll4Doc"+crumbs] = true;
        var param = (crumbs == "x-9999")?[{accountId:""}]:[{archiveID:crumbs}];
        self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,param,"cmp_accDoc_scroll4Doc"+self.uuID,crumbs,1);
        self._createCrumbsScroll();
    };
    accDoc.prototype._initRenderEdoc = function(){  //TODO 完善公文首页的渲染
        var self = this;
        var edocState = self._getStateObj(2);
        if(typeof self.initRenderContent[edocState.id] == "undefined"){
            self.initRenderContent[edocState.id] = true;
            var target = self.edocArea.querySelector("#"+edocState.area);
            target.classList.add("cmp-active");
            var edocType = self.edocState.split("|")[0];
            var aCtr = self.basicDiv.querySelector("nav[edoc-type=\""+edocType+"\"]");
            aCtr.classList.add("cmp-active");
            self._accDocListView(accDocConstant.C_iDataType_edoc,
                self._edocRender,self._getEdocRequestParams(),edocState.id,self.edocState,1);
            target.classList.add("requested");
            self._setTabHeight(target);
        }
    };
    accDoc.prototype._getEdocRequestParams = function(){
        var self = this;
        var edocStateArr = self.edocState.split("|");
        return {
            edocType:edocStateArr[0],
            listType:edocStateArr[1]
        }
    };
    accDoc.prototype._createCrumbsScroll = function(){
        var self = this;
        self.crumbsScroll = new _.iScroll("#cmp_accDoc_crumbsScroll"+self.uuID,{
            vScroll:false,
            hScroll:true
        });
    };
    accDoc.prototype._updateCrumbs = function(archiveID,docName,type){
        var self = this;
        var crumbsChildren = self.crumbs.children;
        switch (type){
            case accDocConstant.C_iCrumbs_increase:  //增加面包屑
                var newCrumbs =
                    '<span class="transverse-mark cmp-icon cmp-icon-arrowright right-icon">' +
                    '</span><span id="crumbs_'+archiveID+'" class="transverse-mark on-text crumbs-text"><a href="javascript:void(0)" class="no-text">'+docName.escapeHTML()+'</a></span>';
                _.append(self.crumbs,newCrumbs);

                var preCrumb = crumbsChildren[crumbsChildren.length-3];
                var preCrumbA =preCrumb.getElementsByTagName("a")[0];
                preCrumbA.classList.remove("no-text");
                self._bindCrumbsEvent(preCrumb);
                break;
            case accDocConstant.C_iCrumbs_reduce://减少面包屑
                var currentCrumb = crumbsChildren[crumbsChildren.length -1];
                var currentCrumbArrow = crumbsChildren[crumbsChildren.length -2];
                var currentCrumbA = crumbsChildren[crumbsChildren.length -3].getElementsByTagName("a")[0];
                currentCrumbA.classList.add("no-text");
                currentCrumbArrow.remove();
                currentCrumb.remove();
                break;
            case accDocConstant.C_iCrumbs_choose: //选择指定的面包屑
                var currentCrumb = self.crumbs.querySelector("#crumbs_" + archiveID);
                var crumbs = self.crumbs.getElementsByTagName("span");
                var len = crumbs.length;
                for(var i = len-1; i >=0;i--) {
                    var crumb = crumbs[i],crumbID = crumb.getAttribute("id");
                    if(crumbID != "crumbs_"+archiveID){
                        crumb.remove();
                    }else {
                        break;
                    }
                }
                currentCrumb.getElementsByTagName("a")[0].classList.add("no-text");
                break;
        }
        self._updateCrumbsWidth();
    };
    accDoc.prototype._bindCrumbsEvent = function(crumb){
        var self = this;
        if(!crumb.getAttribute("binded")){ //避免重复绑定事件
            crumb.removeEventListener("tap",null,false);
            crumb.addEventListener('tap',function(){
                var archiveID = crumb.getAttribute("id").replace("crumbs_","");
                var param = (archiveID == "x-9999")?[{accountId:""}]:[{archiveID:archiveID}];
                self.docLibID = (archiveID == "x-9999")?0:self.docLibID;
                if(self.docLibID == 0 && self.backBtn.classList.contains("display_none")) return;
                self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,param,"cmp_accDoc_scroll4Doc"+self.uuID,archiveID,1);
                self._updateCrumbs(archiveID,"",accDocConstant.C_iCrumbs_choose);
                self.backBtn.setAttribute("data-key",archiveID);
                if(typeof self.docChain[archiveID] != "undefined") {
                    // self.backBtn.classList.add("cmp-active");
                    self.backBtn.classList.remove("display_none");
                }else {
                    // self.backBtn.classList.remove("cmp-active");
                    self.backBtn.classList.add("display_none");
                }
                self._resetSearchBtn();
            },false);
            crumb.setAttribute("binded",true);
        }

    };
    accDoc.prototype._updateCrumbsWidth = function(){
        var self = this;
        var items = self.crumbs.getElementsByClassName("transverse-mark"),
            windowWid = _.os.android?document.body.clientWidth : window.innerWidth,
            itemsWid = 0;
        for(var i = 0;i < items.length; i ++) {
            itemsWid += items[i].clientWidth;
        }
        if(itemsWid > windowWid) {
            self.crumbs.style.width = itemsWid + 4 + 'px'; //4是pandding值。
        }else {
            self.crumbs.style.width = windowWid + 'px';
        }
        if(self.crumbsScroll && typeof self.crumbsScroll != "undefined") {
            self.crumbsScroll.refresh();
        }
    };
    /**
     * 协同渲染都走这个接口
     * @param result
     * @param isRefresh
     * @private
     */
    accDoc.prototype._coordinationRender = function(result,isRefresh){
        var self = this;
        var scroll = self._cmpScroll;//获取scroll元素
        var widgetObj = self._opts._widgetObj;//组件对象
        var listContent = scroll.querySelector(".cmp-list-content");
        var listContentID = listContent.getAttribute("id");
        widgetObj._setDataID(result,accDocConstant.C_iDataType_coordination);
        var html = _.tpl(coordinationItem(),result);
        if(isRefresh){
            listContent.innerHTML = html;
        }else {
            _.append(listContent,html);
        }
        widgetObj._renderFillback(listContentID);
        _.IMG.detect();
        _.dialog.loading(false);
        widgetObj._chooseEvent(listContent.children);
        if(!widgetObj.initDataReady) widgetObj.initDataReady = true;
    };
    /**
     * 文档渲染都走这个接口
     * @param result
     * @param isRefresh
     * @private
     */
    accDoc.prototype._docRender = function(result,isRefresh){
        var scroll = this._cmpScroll;//获取scroll元素
        var widgetObj = this._opts._widgetObj;//组件对象
        var listContent = scroll.querySelector(".cmp-list-content");
        var listContentID = listContent.getAttribute("id");
        widgetObj._setDataID(result,accDocConstant.C_iDataType_doc);
        if(widgetObj.initCreateDocContent){//由于文档的布局符合listview的布局，但是是弹框显示的，所以cmp-segmented_title_content计算有问题CAPF-14918
            var docControlContent = widgetObj.docArea.querySelector(".cmp-control-content");
            var docTitleContent = widgetObj.docArea.querySelector(".cmp-segmented_title_content");
            docControlContent.style.height = docControlContent.offsetHeight - docTitleContent.offsetHeight + "px";
            widgetObj.initCreateDocContent = false;
        }


        if(result[0].hasOwnProperty("docLibID")){
            result.type = accDocConstant.C_iDocDataType_lib;
        }else {
            result.type = accDocConstant.C_iDocDataType_sub;
            for(var i = 0;i<result.length;i++){
                if(!result[i].is_folder){
                    result[i].id = result[i].fr_id;
                    var extension = _.v5.att_getExtension4DocFile(result[i]);
                    result[i].extension = extension;
                    if(extension.indexOf("gif") != -1
                        || extension.indexOf("jpg") != -1
                        || extension.indexOf("jpeg") != -1
                        || extension.indexOf("bmp") != -1
                        || extension.indexOf("png") != -1 )
                        result[i].isImg = true;
                    result[i].src = _.origin + "/commonimage.do?method=showImage&id="+result[i].file_id+"&size=custom&h=40&w=36";

                }
            }
        }
        var html = _.tpl(docItem(),result);
        if(isRefresh){
            listContent.innerHTML = html;
        }else {
            _.append(listContent,html);
        }
        widgetObj._renderFillback(listContentID);
        _.IMG.detect();
        _.dialog.loading(false);
        widgetObj._chooseEvent(listContent.children);
    };

    accDoc.prototype._edocRender = function(result,isRefresh){
        var self = this;
        var scroll = self._cmpScroll;//获取scroll元素
        var widgetObj = self._opts._widgetObj;//组件对象
        var listContent = scroll.querySelector(".cmp-list-content");
        var listContentID = listContent.getAttribute("id");
        widgetObj._setDataID(result,accDocConstant.C_iDataType_edoc);
        var html = _.tpl(edocItem(),result);
        if(isRefresh){
            listContent.innerHTML = html;
        }else {
            _.append(listContent,html);
        }
        widgetObj._renderFillback(listContentID);
        _.IMG.detect();
        _.dialog.loading(false);
        widgetObj._chooseEvent(listContent.children);
        if(!widgetObj.initDataReady) widgetObj.initDataReady = true;
    };


    accDoc.prototype._noRBACRender = function(){
        var self = this;
        _.append(self.content,"<div class='cmp-accDoc-not-allRBAC-parent'><div class='m3-icon-noaccess icon'></div><div class='text'>"+_.i18n("cmp.accDoc.noAccess")+"</div></div>");
    };
    accDoc.prototype._setDataID = function(data,dataType){
        var i = 0,len = data.length;
        for(;i<len;i ++){
            if(dataType == accDocConstant.C_iDataType_coordination){
                data[i].id = data[i].affairId;
                data[i].type = "collaboration";
                data[i].appId = "1";
                data[i].docName = data[i].subject;
            }else if(dataType == accDocConstant.C_iDataType_doc){
                data[i].id = data[i].archiveID;
                data[i].type = "docFile";
                data[i].appId="3";
                data[i].createDate = data[i].fr_create_time;
                data[i].docName = data[i].fr_name || data[i].filename;
            }else if(dataType == accDocConstant.C_iDataType_edoc){
                data[i].type = "edoc";
                data[i].appId = "4";
                data[i].docName = data[i].summary.subject;
            }
        }
    };
    /**
     * 回填值渲染
     * @param id  对应scroll容器id
     * @private
     */
    accDoc.prototype._renderFillback = function(id){
        var self = this;
        var items = self.basicDiv.querySelector('#'+id).children;
        if(self.selectDataIDCache.length > 0) {
            var idArr = self.selectDataIDCache;
            var i = 0,len = items.length;
            for(; i < len ; i ++) {
                if(idArr.length  == 0) break;
                var checkbox = items[i].querySelector('input');
                if(checkbox) {
                    var id = checkbox.getAttribute("data-key");
                    for(var j = 0; j < idArr.length > 0; j ++) {
                        if(id == idArr[j]) {
                            checkbox.checked = true;
                            self._delData(idArr,id);
                            self.selectDataIDCache.push(id);
                            break;
                        }
                    }
                }
            }
        }
        self.numArea.innerText = self.selectDataIDCache.length;
    };
    accDoc.prototype._event = function(){
        var self = this;
        self._forbidTouchMoveEvent();
        if(!self.allRABC){
            self._close4NoAllRBAC();
            return;
        }
        self._backEvent();
        self._searchEvent();
        self._okEvent();
        if(self.typeSwitchAble){
            self._switchEvent();
        }
        self._coordinationSwitchEvent();
        self._edocSwitchEvent();
        self._popoverEvent();
    };
    accDoc.prototype._forbidTouchMoveEvent = function(){
        var self = this;
        self.basicDiv.addEventListener("touchmove",function(e){
            e.preventDefault();
        },false);
    };
    accDoc.prototype._closeEvent = function(){
        var self = this;
        self.closeBtn.removeEventListener("tap", _.href.back,false);
        _.event.click(self.closeBtn,function(){
            if(self.opts._transed){
                self._handleJumpPageDocResult(null);
            }else {
                self._close();
                self.cacheSelectedData();
                self.runOk = false;
            }
        });
    };
    accDoc.prototype._close4NoAllRBAC = function(){
        var self = this;
        self.backBtn.addEventListener("tap",function(){
            if(self.opts._transed){
                self._handleJumpPageDocResult(null);
            }else {
                self._close();
                self.cacheSelectedData();
                self.runOk = false;
            }
        },false);
    };

    //公文弹框选择列表类型切换事件
    accDoc.prototype._popoverEvent = function(){
        var self = this;
        self.backDrop.addEventListener("tap",function(){
            self.edocListTypePopover.classList.add("cmp-hidden");
            this.classList.add("cmp-hidden");
        });
        self.edocListTypePopover.addEventListener("tap",function(e){
            var target = e.target;
            var state = self.edocState.split("|")[1];
            if(target == self.gou){
                this.classList.add("cmp-hidden");
                self.backDrop.classList.add("cmp-hidden");
            }else {
                var targetState = target.getAttribute("state");
                if(targetState == state){
                    this.classList.add("cmp-hidden");
                    self.backDrop.classList.add("cmp-hidden");
                }else {
                    target.appendChild(self.gou);
                    self.edocState = self.edocState.replace(state,targetState);
                    var edocState = self._getStateObj(2);
                    var edocType = self.edocState.split("|")[0];
                    self._accDocListView(accDocConstant.C_iDataType_edoc,
                        self._edocRender,self._getEdocRequestParams(),edocState.id,self.edocState,1);
                    setTimeout(function(){
                        self.edocListTypePopover.classList.add("cmp-hidden");
                        self.backDrop.classList.add("cmp-hidden");
                        var targetNav = self.edocSwitchBtn.querySelector("nav[edoc-type=\""+edocType+"\"]");
                        var targetNavStateTag = targetNav.querySelector("state");
                        targetNavStateTag.innerHTML = "." + _.i18n("cmp.accDoc."+targetState);
                        targetNavStateTag.setAttribute("value",targetState);
                    },300);
                }
            }
        },false);
    };
    accDoc.prototype._close = function(){
        var self = this;
        self.basicDiv.classList.add("cmp-accDoc-basicDiv-close");
        self.basicDiv.classList.remove("cmp-accDoc-basicDiv-show");
        self._resetCheckbox();
        var closeCallback = self.opts.closeCallback;
        if(closeCallback && typeof closeCallback == "function"){
            closeCallback();
        }
        _.backbutton.pop();
        self._updateTitle(false);
        if(self.searchUI) {
            if(self.searchUI.classList.contains("cmp-active")){
                self.searchUI.classList.remove("cmp-active");
            }
        }
        setTimeout(function(){
            self.basicDiv.classList.add("cmp-hidden");
        },300);
    };
    accDoc.prototype._okEvent = function(){
        var self = this;
        _.event.click(self.okBtn,function(){
            if(self.opts._transed){
                self._handleJumpPageDocResult(self.selectDataCache);
            }else {
                self._close();
//                if(self.initDataReady) {
//                    if(self.opts.callback){
//                        self.opts.callback(_.toJSON(self.selectDataCache));
//                    }
//                }
                if(self.opts.callback){
                    self.opts.callback(_.toJSON(self.selectDataCache));
                }
                self._cachePreSelectedData();
                self.runOk = true;
            }
        });
    };
    accDoc.prototype._handleJumpPageDocResult = function(accDocResult){
        var self = this;
        var queryParams;
        var historyPageKey = _.storage.get("cmp-accDoc-jump-pageKey",true);
        var dataKey = self.opts.pageKey;
        if(dataKey == "getAccDoc4WebView"){
            var selectedResult = accDocResult?self.selectDataCache:[];
            self.opts.callback(selectedResult);
            return;
        }
        if(!historyPageKey){
            _.storage.save("cmp-accDoc-jump-pageKey",dataKey,true);
            queryParams = "pageKey=" + self.opts.pageKey;
        }else {
            if(historyPageKey != dataKey){
                _.storage.save("cmp-accDoc-jump-pageKey",dataKey,true);
                queryParams = "pageKey=" + self.opts.pageKey;
            }
        }
        if(accDocResult){
            self.opts.fillbackData = accDocResult;
            accDocResult = _.toJSON(accDocResult);
        }
        _.storage.save("cmp-accDoc-opts", _.toJSON(self.opts),true);
        _.storage.save(dataKey,accDocResult ,true);//todo 修改回传值格式
        _.href.back(1,queryParams);
    };
    accDoc.prototype._backEvent = function(){
        var self = this;
        self.backBtn.addEventListener("tap",function(){
            var docArchiveID = this.getAttribute("data-key");
            if(typeof self.docChain[docArchiveID] != "undefined") {
                var parent = self.docChain[docArchiveID].parent;
                if(parent == "x-9999"){
                    self.docLibID = 0;
                    self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,[{accountId:""}],"cmp_accDoc_scroll4Doc"+self.uuID,"x-9999",1);
                    self._resetSearchBtn();
                    this.classList.add("display_none");
                    this.classList.remove("cmp-active");
                }else {
                    this.classList.remove("display_none");
                    this.classList.add("cmp-active");
                    self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,[{archiveID:parent}],"cmp_accDoc_scroll4Doc"+self.uuID,parent,1);
                }
                this.setAttribute("data-key",parent);
                self._updateCrumbs(docArchiveID,"",accDocConstant.C_iCrumbs_reduce);
            }
        },false);
    };
    accDoc.prototype._searchEvent = function(){
        var self = this;
        self.searchBtn.addEventListener("tap",function(){
            if(self.searchUI == null){
                self._initAssembleSearch();
            }
            self._searchUIShow();
            self._setSearchTypeShow();
            cmp.RefreshHeader();
        },false);
    };
    accDoc.prototype._initAssembleSearch = function(){
        var self = this;
        var searchDiv = document.createElement("div");
        searchDiv.className = "cmp-accDoc-basicDiv-search cmp-accDoc-searchUI Animated-Container right-go animated";
        searchDiv.setAttribute("uid",self.opts.id);
        searchDiv.innerHTML = _.tpl(searchUI(),self._setSearchParam());
        searchDiv.style.top = self.basicDiv.scrollTop + "px";
        self.basicDiv.appendChild(searchDiv);
        self.searchCoorCondition = searchDiv.querySelector("#cmp_accDoc_search4Coor");
        self.searchDocCondition = searchDiv.querySelector("#cmp_accDoc_search4Doc");
        self.searchEdocCondition = searchDiv.querySelector("#cmp_accDoc_search4Edoc");
        self.searchTitle = searchDiv.querySelector("#cmp_accDoc_searchTitle");
        self.searchContent = searchDiv.querySelector(".cmp-content");
        self.searchCtrlContent = searchDiv.querySelector(".cmp-accDoc-control-content");
        self.searchScroll = searchDiv.querySelector("#cmp_accDoc_scroll4Search");
        self.searchList = searchDiv.querySelector("#cmp_accDoc_searchList");
        self.searchUI = searchDiv;
        self._bindSearchEvent();
        setTimeout(function(){
            var footerH = self.footer.offsetHeight;
            var headerH = self.header.offsetHeight;
            self.searchCtrlContent.style.height = (CMPFULLSREENHEIGHT - headerH - footerH -44 ) + "px";

        },50);
    };
    accDoc.prototype._searchUIShow = function(){
        var self = this;
        _.backbutton.push(_.accDocSearchUIClose);
        setTimeout(function(){
            self.searchUI.classList.add("cmp-active");
            var searchParam = self._setSearchParam();
            // self.searchTitle.innerText = searchParam.title;
            self._updateTitle(false,searchParam.title);
        },200);
    };
    accDoc.prototype._searchUIClose = function(){
        var self = this;
        _.backbutton.pop();
        setTimeout(function(){
            self.searchUI.classList.remove("cmp-active");
            self._updateTitle(true);
            self._resetSearchList();
            self._renderLastListViewFillback();
        },200);
    };
    accDoc.prototype._renderLastListViewFillback = function(){
        var self = this;
        if(self.docShow){
            self._renderFillback("cmp_accDoc_docList");
        }
        _.each(self.coordinationArea.children,function(index,item){
            if(item.classList.contains("cmp-control-content")){
                var oneCoorListviewID = item.getElementsByTagName("ul")[0].getAttribute("id");
                self._renderFillback(oneCoorListviewID);
            }
        });
        _.each(self.edocArea.children,function(index,item){
            if(item.classList.contains("cmp-control-content")){
                var oneEdocListviewID = item.getElementsByTagName("ul")[0].getAttribute("id");
                self._renderFillback(oneEdocListviewID);
            }
        });
    };
    accDoc.prototype._setSearchTypeShow = function(){
        var self = this;
        if(self.docShow){
            self.searchDocCondition.classList.remove("display_none");
            self.searchDocCondition.classList.add("cmp-active");
            self.searchCoorCondition.classList.remove("cmp-active");
            self.searchCoorCondition.classList.add("display_none");
            self.searchEdocCondition.classList.remove("cmp-active");
            self.searchEdocCondition.classList.add("display_none");
        }else if(self.edocShow){
            self.searchEdocCondition.classList.remove("display_none");
            self.searchEdocCondition.classList.add("cmp-active");
            self.searchCoorCondition.classList.remove("cmp-active");
            self.searchCoorCondition.classList.add("display_none");
            self.searchDocCondition.classList.add("display_none");
            self.searchDocCondition.classList.remove("cmp-active");
        }else {
            self.searchDocCondition.classList.add("display_none");
            self.searchDocCondition.classList.remove("cmp-active");
            self.searchCoorCondition.classList.add("cmp-active");
            self.searchCoorCondition.classList.remove("display_none");
            self.searchEdocCondition.classList.remove("cmp-active");
            self.searchEdocCondition.classList.add("display_none");
        }
    };
    accDoc.prototype._setSearchParam = function(){
        var self = this;
        var param = {uuID:self.uuID};
        var title = "";
        if(self.docShow){
            title = _.i18n("cmp.accDoc.doc");
            param.type = accDocConstant.C_iSearchType_doc;
        }else if(self.edocShow){
            var edocStateArr = self.edocState.split("|");
            var edocType = edocStateArr[0],state=edocStateArr[1];
            switch (edocType){
                case "0":
                    title = _.i18n("cmp.accDoc.end");
                    break;
                case "1":
                    title = _.i18n("cmp.accDoc.receive");
                    break;
                case "2":
                    title = _.i18n("cmp.accDoc.report");
                    break;
            }
            title += _.i18n("cmp.accDoc."+state);
            param.type = accDocConstant.C_iSearchType_edoc;
            param.state = self.edocState
        }else {
            switch(self.coorState) {
                case accDocConstant.C_iCoordination_dataParam_todo:
                    //param.title = "待办搜索";
                    title = _.i18n("cmp.accDoc.listPending");
                    param.type = accDocConstant.C_iSearchType_coordination;
                    param.state= accDocConstant.C_iCoordination_dataParam_todo;
                    break;
                case accDocConstant.C_iCoordination_dataParam_done:
                    //param.title = "已办搜索";
                    title = _.i18n("cmp.accDoc.listDoneAll");
                    param.type = accDocConstant.C_iSearchType_coordination;
                    param.state= accDocConstant.C_iCoordination_dataParam_done;
                    break;
                case accDocConstant.C_iCoordination_dataParam_send:
                    //param.title = "已发搜索";
                    title = _.i18n("cmp.accDoc.listSent");
                    param.type = accDocConstant.C_iSearchType_coordination;
                    param.state= accDocConstant.C_iCoordination_dataParam_send;
                    break;
            }
        }
        param.title = title + _.i18n("cmp.accDoc.search");
        return param;
    };
    accDoc.prototype._bindSearchEvent = function(){
        var self = this;
        var coorOrEdocSearchItems  = [{  //需要将搜索条件传入
            value: 'text',
            //text: '标题',
            text: _.i18n("cmp.accDoc.title"),
            condition:accDocConstant.C_sSearchType_param_subject
        }, {
            value: 'text',
            //text: '发起人',
            text: _.i18n("cmp.accDoc.sender"),
            condition:accDocConstant.C_sSearchType_param_startMemberName
        }, {
            value: 'date',
            //text: '发起时间',
            text: _.i18n("cmp.accDoc.createData"),
            condition:accDocConstant.C_sSearchType_param_createDate
        }];
        var docSearchItems = [{
            value: 'text',
            //text: '标题',
            text: _.i18n("cmp.accDoc.title"),
            condition:accDocConstant.C_iSearchType_doc_param_doc
        }, {
            value: 'text',
            //text: '创建人',
            text: _.i18n("cmp.accDoc.creator"),
            condition:accDocConstant.C_iSearchType_doc_param_member
        }];
        _.search.sub(self.searchCoorCondition, {items: coorOrEdocSearchItems, callback: function(result){
            self._handleSearchResult(result);
        }});
        _.search.sub(self.searchDocCondition,{items:docSearchItems,callback:function(result){
            self._handleSearchResult(result);
        }});
        _.search.sub(self.searchEdocCondition,{items:coorOrEdocSearchItems,callback:function(result){
            self._handleSearchResult(result);
        }});
        if(!self.searchCloseBtnBinded){
            document.addEventListener("searchUIClose",function(){
                self._updateTitle(true);
            })
            self.searchCloseBtnBinded = true;
        }


    };
    accDoc.prototype._handleSearchResult = function(result){
        var self = this;
        self.searchCtrlContent.classList.remove("display_none");
        self.searchCtrlContent.classList.add("cmp-active");
        var searchParam;
        if(self.docShow){
            var propertyName = (result.item.condition == accDocConstant.C_iSearchType_doc_param_doc)?"frName":"createUserId";
            searchParam = [{
                archiveID:self.docLibID,
                propertyName:propertyName,
                searchType:result.item.condition,
                simple:true,
                value1:result.searchKey[0],
                search:true
            }];
            self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,searchParam,"cmp_accDoc_scroll4Search"+self.uuID,"cmp_accDoc_scroll4Search",2);
        }else if(self.edocShow){
            searchParam = self._getEdocRequestParams();
            searchParam["conditionKey"] = result.item.condition;
            searchParam["textfield"] = result.searchKey[0];
            if(result.searchKey[1]) searchParam["textfield1"] = result.searchKey[1];
            self._accDocListView(accDocConstant.C_iDataType_edoc,
                self._edocRender,searchParam,"cmp_accDoc_scroll4Search"+self.uuID,"cmp_accDoc_scroll4Search",2,true);
        }else {
            searchParam = {};
            switch (result.item.condition){
                case accDocConstant.C_sSearchType_param_createDate:
                    searchParam["createDate"] = result.searchKey[0] + "#" + result.searchKey[1];
                    break;
                case accDocConstant.C_sSearchType_param_startMemberName:
                    searchParam["startMemberName"] = result.searchKey[0];
                    break;
                case accDocConstant.C_sSearchType_param_subject:
                    searchParam["subject"] = result.searchKey[0];
                    break;
            }
            searchParam["state"] = self.coorState;
            self._accDocListView(accDocConstant.C_iDataType_coordination,self._coordinationRender,searchParam,"cmp_accDoc_scroll4Search"+self.uuID,"cmp_accDoc_scroll4Search",2,true);
        }

    };
    accDoc.prototype._switchEvent = function(){
        var self = this;
        self.colSwitch.addEventListener("tap",function(){
            if(!this.classList.contains("cmp-active")){
                // self.backBtn.classList.remove("cmp-active");
                self.backBtn.classList.add("display_none");
                self.docShow = false;
                self.edocShow = false;
                self._resetSearchList();
                self.searchBtn.classList.remove("display_none");
                self.searchBtn.classList.add("cmp-active");
                self.coordinationArea.classList.remove("display_none");
                self._initRenderCoor();
                if(self.coordinationReShow){
                    _.each(self.coordinationArea.children,function(index,item){
                        if(item.classList.contains("cmp-active")){
                            var cooListContentID = item.getElementsByTagName("ul")[0].getAttribute("id");
                            self._renderFillback(cooListContentID);
                        }
                    });
                    self.coordinationReShow = false;
                }
            }
        },false);
        self.docSwitch.addEventListener("tap",function(){
            if(!this.classList.contains("cmp-active")){
                var docArchiveID = self.backBtn.getAttribute("data-key");
                if(typeof self.docChain[docArchiveID] != "undefined") {
                    // self.backBtn.classList.add("cmp-active");
                    self.backBtn.classList.remove("display_none");
                }else {
                    // self.backBtn.classList.remove("cmp-active");
                    self.backBtn.classList.add("display_none");
                }
                self.docShow = true;
                self.edocShow = false;
                if(self.initRequestDocData){
                    self._initRenderDoc();
                    self.initRequestDocData = false;
                }else {
                    if(self.docReShow) {
                        self._renderFillback("cmp_accDoc_docList");
                        self.docReShow = false;
                    }
                }
                self._resetSearchList();
                self._resetSearchBtn();
            }
        },false);
        self.edocSwitch.addEventListener("tap",function(){
            if(!this.classList.contains("cmp-active")){
                self.searchBtn.classList.remove("display_none");
                self.searchBtn.classList.add("cmp-active");
                // self.backBtn.classList.remove("cmp-active");
                self.backBtn.classList.add("display_none");
                self.edocShow = true;
                self.docShow = false;
                self._initRenderEdoc();
            }
        },false);
    };
    accDoc.prototype._getStateObj = function(type){
        var self = this;
        var stateID,stateArea,stateType;
        if(type == 1){
            stateType = "coordination";
            switch(self.coorState){
                case 3:
                    stateID = "Todo";
                    stateArea = "todoArea";
                    break;
                case 4:
                    stateID = "Done";
                    stateArea = "doneArea";
                    break;
                case 2:
                    stateID = "Send";
                    stateArea = "sendArea";
                    break;
            }
        }else {
            stateType = "edoc";
            if(self.edocState.indexOf("0")  != -1){
                stateID = "Edoc_send";
                stateArea = "sendArea";
            }else if(self.edocState.indexOf("1") != -1){
                stateID = "Edoc_receive";
                stateArea = "receiveArea";
            }else {
                stateID = "Edoc_report";
                stateArea = "reportArea";
            }
        }

        return {
            id:"cmp_accDoc_scroll4" +stateID + self.uuID,
            area:"cmp_accDoc_"+stateType+"_" +stateArea + self.uuID
        }
    };
    accDoc.prototype._resetSearchList = function(){
        var self = this;
        if(self.searchUI != null){
            var noDataDiv = self.searchUI.querySelector(".StatusContainer");
            if(noDataDiv) noDataDiv.remove();
            self.searchList.innerHTML = "";
            self.searchCtrlContent.classList.add("display_none");
            self.searchCtrlContent.classList.remove("cmp-active");
            _.each(self.searchUI.getElementsByTagName("input"),function(index,item){
                item.value = "";
            });
        }
    };
    accDoc.prototype._resetSearchBtn = function(){
        var self = this;
        if(self.docLibID == "0" || self.docLibID == 0){
            self.searchBtn.classList.remove("cmp-active");
            self.searchBtn.classList.add("display_none");
        }else {
            self.searchBtn.classList.add("cmp-active");
            self.searchBtn.classList.remove("display_none");
        }
    };
    accDoc.prototype._chooseEvent = function(items){
        var self = this;
        _.each(items,function(index,item){
            var checkbox = item.getElementsByTagName("input")[0];
            var rightArrow = item.querySelector(".cmp-icon-arrowright");//向下一级的箭头
            var userHeader = item.getElementsByTagName("img");
            userHeader = userHeader && userHeader[0];
            if(!item.getAttribute("binded")){
                if(checkbox){   //如果是可以选择
                    self._bindItemCheckboxEvent(checkbox,userHeader);
                }
                if(rightArrow){  //如果可以进入下一级的
                    self._bindItemRightArrowEvent(item);
                }
                if(self.opts._transed){//兼容页面跳转才绑定穿透事件
                    self._bindItemPenetrateEvent(item,checkbox);
                }
                item.setAttribute("binded",true);
            }
        });
    };

    accDoc.prototype._bindItemCheckboxEvent = function(checkbox,userHeader){
        var self = this;
        function doSelect (checkbox){
            self._checkboxSwitch(checkbox);
            if(checkbox.checked == true){
                if(self.opts.maxSize != -1 && self.selectDataIDCache.length >= self.opts.maxSize){
                    var msg = _.i18n("cmp.accDoc.maxNum",[self.opts.maxSize]);
                    _.notification.alert(msg,null,_.i18n("cmp.accDoc.tips"),_.i18n("cmp.accDoc.ok"));
                    checkbox.checked = false;
                    return;
                }
                self.selectDataIDCache.push(dataID);
                self.selectDataCache.push(info);
            }else{
                self._delDataById(self.selectDataCache,info);
                self._delData(self.selectDataIDCache,dataID);
            }
            self.numArea.innerText = self.selectDataIDCache.length;
        }
        var dataID = checkbox.getAttribute("data-key");
        var info = checkbox.getAttribute("info");
        checkbox.addEventListener("tap",function(e){
            e.stopPropagation();
            doSelect(checkbox);
        },false);

        if(userHeader){
            userHeader.addEventListener("tap",function(e){
                e.stopPropagation();
                doSelect(checkbox);
            });
        }
    };
    accDoc.prototype._bindItemRightArrowEvent = function(item){
        var self = this;
        var rightArrow = item.querySelector(".cmp-icon-arrowright");
        item.addEventListener("tap",function(e){
            e.stopPropagation();
            _.dialog.loading();
            var docName = rightArrow.getAttribute("docName");
            var archiveID = rightArrow.getAttribute("archiveID");
            var docId = rightArrow.getAttribute("docId");
            if(docId) self.docLibID = docId;
            if(docName && archiveID){
                self._updateCrumbs(archiveID,docName,accDocConstant.C_iCrumbs_increase);
                if(typeof self.initRenderContent["cmp_accDoc_scroll4Doc"+archiveID] == "undefined")self.initRenderContent["cmp_accDoc_scroll4Doc"+archiveID] = true;
                self._setDocChain(archiveID,docName);
                self._resetSearchBtn();
                self._accDocListView(accDocConstant.C_iDataType_doc,self._docRender,[{archiveID:archiveID,docName:docName}],"cmp_accDoc_scroll4Doc"+self.uuID,archiveID,1);

                //_.dialog.loading(false);
            }else {
                //TODO 查看协同详情(tips 貌似不查看详情)
            }
            self.backBtn.classList.remove("display_none");
            // self.backBtn.classList.add("cmp-active");
        },false);
    };
    accDoc.prototype._bindItemPenetrateEvent = function(item,checkbox){
        var self = this;
        item.addEventListener("tap",function(){
            if(checkbox){
                var docData =  checkbox.getAttribute("info");
                docData = _.parseJSON(docData);
                if(docData.type == "collaboration"){
                    self._handleBeforeDocPenetrate();
                    AttUtil.transfer(docData);
                }else if (docData.fr_type){//回传回来的数据，有可能是之前通过文档中心选出来的文档协同、会议。。。。。
                    if(_.v5.att_canPenetration4Doc(docData.fr_type)){
                        docData = _.v5.att_transeDocData4Penetration(docData);
                        self._handleBeforeDocPenetrate();
                        AttUtil.transfer(docData);
                    }
                }else if(docData.hasOwnProperty("edocType")){
                    docData = _.v5.att_transeEdocData4Penetration(docData);
                    self._handleBeforeDocPenetrate();
                    AttUtil.transfer(docData);
                }
            }
        },false);

    };
    accDoc.prototype._handleBeforeDocPenetrate = function(){
        var self = this;
        self.opts.fillbackData = self._handlePenetrateSelectData();
        self.opts.docShow = self.docShow;
        self.opts.coorState = self.coorState;
        self.opts.edocShow = self.edocShow;
        self.opts.edocState = self.edocState;
        if(self.docShow){//如果穿透前是文档中心显示，需要处理最后一次的文档子父链
            var currentDoc = self.backBtn.getAttribute("data-key");
            self.opts.docChain = {};
            self._handlePenetrateDocChain(currentDoc,self.opts.docChain);
        }
        _.storage.save("cmp-accDoc-opts",_.toJSON(self.opts),true);
    };
    accDoc.prototype._handlePenetrateSelectData = function(){
        var self = this;
        var selectedData = [];
        for(var i = 0;i<self.selectDataCache.length ;i++){
            selectedData.push(_.parseJSON(self.selectDataCache[i]));
        }
        return selectedData;
    };
    accDoc.prototype._handlePenetrateDocChain = function(currentDocID,docChain){
        var self = this;
        if(self.docChain[currentDocID]){
            var parent = self.docChain[currentDocID].parent;
            docChain[parent] = {
                children:currentDocID,
                childrenName:self.docChain[currentDocID].childrenName
            };
            self._handlePenetrateDocChain(parent,docChain);
        }
    };
    accDoc.prototype._setDocChain = function(archiveID,docName){
        var self = this;
        var docParent = self.backBtn.getAttribute("data-key");
        self.docChain[archiveID] = {
            parent:docParent,
            childrenName:docName
        };
        self.backBtn.setAttribute("data-key",archiveID);
        self.backBtn.classList.remove("display_none");
        // self.backBtn.classList.add("cmp-active");
    };
    /**
     * 协同数据切换
     * @private
     */
    accDoc.prototype._coordinationSwitchEvent = function(){
        var self = this;
        _.each(self.coordinationArea.querySelectorAll(".cmp-control-content"),function(index,item){
            if(item.classList.contains("cmp-active")){
                if(!item.classList.contains("requested")){
                    item.classList.add("requested");
                }
            }
        });
        _.each(self.coordinationSwitchBtn.getElementsByTagName("nav"),function(index,item){
            item.addEventListener("tap",function(){
                if(!item.classList.contains("cmp-active")){
                    var id = item.getAttribute("href");
                    var target = self.coordinationArea.querySelector(id);
                    target.classList.add("cmp-active");
                    var dataParam = item.getAttribute("data-param");
                    dataParam = parseInt(dataParam);
                    if(!target.classList.contains("requested")){
                        var scrollID = target.querySelector(".cmp-scroll-wrapper").getAttribute("id");
                        self.initRenderContent[scrollID] = true;
                        self._accDocListView(accDocConstant.C_iDataType_coordination,
                            self._coordinationRender,dataParam,scrollID,scrollID,1);
                        target.classList.add("requested");
                        self._setTabHeight(target);
                    }
                    self.coorState = dataParam;
                }
            },false);
        });
    };

    accDoc.prototype._edocSwitchEvent = function(){
        var self = this;
        _.each(self.edocArea.querySelectorAll(".cmp-control-content"),function(index,item){
            if(item.classList.contains("cmp-active")){
                if(!item.classList.contains("requested")){
                    item.classList.add("requested");
                }
            }
        });
        var navs = self.edocSwitchBtn.getElementsByTagName("nav");
        var stateTags = self.edocSwitchBtn.getElementsByTagName("state");
        _.each(navs,function(index,item){
            item.addEventListener("tap",function(){
                if(!item.classList.contains("cmp-active")){
                    stateTags[0].innerHTML = "";
                    stateTags[1].innerHTML = "";
                    stateTags[2].innerHTML = "";
                    var id = item.getAttribute("href");
                    var target = self.edocArea.querySelector(id);
                    var stateTag = item.getElementsByTagName("state")[0];
                    target.classList.add("cmp-active");
                    var edocType = item.getAttribute("edoc-type");
                    var state = stateTag.getAttribute("value");
                    stateTag.innerHTML = "." + _.i18n("cmp.accDoc."+state);
                    self.edocState = edocType + "|" + state;
                    if(!target.classList.contains("requested")){
                        var scrollID = target.querySelector(".cmp-scroll-wrapper").getAttribute("id");
                        self.initRenderContent[scrollID] = true;
                        self._accDocListView(accDocConstant.C_iDataType_edoc,
                            self._edocRender,self._getEdocRequestParams(),scrollID,scrollID,1);
                        target.classList.add("requested");
                        self._setTabHeight(target);
                    }
                }
            },false);

            item.querySelector(".cmp-icon-arrowdown").addEventListener("tap",function(){
                var itemPosition = item.getBoundingClientRect();
                var left = itemPosition.left;
                if(left == 0) {
                    left = 10;
                }else {
                    left -= 10;
                }
                self.edocListTypePopover.style.left = left + "px";
                self.backDrop.classList.remove("cmp-hidden");
                self.edocListTypePopover.classList.remove("cmp-hidden");
                var state = self.edocState.split("|")[1];
                var liCtr = self.edocListTypePopover.querySelector("li[state=\""+state+"\"]");
                liCtr.appendChild(self.gou);
            },false);
        });
    };

    /**
     * 获取协同/文档的方法和参数拼接
     * @param dataType//数据类型：1：协同；2：文档；其他：可能后面有扩展
     * @param fun//渲染数据的方法
     * @param param//需要传递的参数,协同传state值，文档传archiveID即文件夹ID
     * @param listview//容器id
     * @param crumbsID//面包屑id
     * @param purpose//无内容的展现图片1，普通的；2，搜索的
     * @returns {{}}
     * @private
     */
    accDoc.prototype._accDocListView = function(dataType,renderFun,param,listview,crumbsID,purpose,isSearch){
        var self = this;
        var data = {},isClear = false,
            listMark = (dataType == accDocConstant.C_iDataType_doc)?listview+crumbsID:listview;
        if(self.initRenderContent[listMark]){
            if(dataType == 1){
                _.dialog.loading();
            }
            self.initRenderContent[listMark] = false;
        }
        if(!self.loadingListened){
            document.addEventListener("cmp-listview-loaded-callback",function(){
                accDoc.ajaxBackDrop(false);
            });
            self.loadingListened = true;
        }
        switch(dataType) {
            case accDocConstant.C_iDataType_coordination:
                crumbsID = listview;//协同是页签的形式crumbsID就等于容器id
                data.dataFunc = accDoc.getColQuote;
//                isClear = true;//由于页面跳转，这个缓不缓存有待考证
                switch (param){
                    case accDocConstant.C_iCoordination_dataParam_todo:
                        data.param = [{},{state:accDocConstant.C_iCoordination_dataParam_todo}];
                        break;
                    case accDocConstant.C_iCoordination_dataParam_done:
                        data.param = [{},{state:accDocConstant.C_iCoordination_dataParam_done}];
                        break;
                    case accDocConstant.C_iCoordination_dataParam_send:
                        data.param = [{},{state:accDocConstant.C_iCoordination_dataParam_send}];
                        break;
                    default :
                        data.param = [{},param];
                        break;
                }
                if(isSearch){
                    isClear = true;
                }
                break;
            case accDocConstant.C_iDataType_doc:
                if(param[0].hasOwnProperty("accountId")){
                    data.dataFunc = accDoc.getArchiveLibraries;
                }else if(param[0].hasOwnProperty("archiveID") || param[0].hasOwnProperty("search")){
                    data.dataFunc = accDoc.getArchiveList;
                }
                if(param[0].hasOwnProperty("search")){
                    isClear = true;
                }
                data.param = param;
                break;
            case accDocConstant.C_iDataType_edoc:
                data.param = [param];
                data.dataFunc = accDoc.getEdocList;
                if(isSearch){
                    isClear = true;
                }
                break;
        }
        var fullScreenHeight = CMPFULLSREENHEIGHT < window.innerHeight? window.innerHeight:CMPFULLSREENHEIGHT;
        var imgCacheY = self.opts._transed?0:fullScreenHeight;
        _.listView("#"+listview,{
            imgCache:true,
            offset:{
                x:0,
                y:imgCacheY
            },
            config:{
                isClear:isClear,  //协同不缓存,文档要缓存,所有搜索都不缓存
                crumbsID:crumbsID,
                purpose:purpose,
                params:data.param,
                dataFunc:data.dataFunc,
                renderFunc:renderFun
            },
            down : {
                contentdown: _.i18n("cmp.accDoc.pullDownToRefresh"),
                contentover: _.i18n("cmp.accDoc.releaseToLoad"),
                contentrefresh: _.i18n("cmp.accDoc.loading")
            },
            up : {
                contentdown: _.i18n("cmp.accDoc.pullUpToloadMore"),
                contentrefresh: _.i18n("cmp.accDoc.loading"),
                contentnomore: _.i18n("cmp.accDoc.noMoreData")
            },
            _widgetObj:self
        });
    };
    //删除数组中指定的数据
    accDoc.prototype._delData = function (dataArr,delVal) {
        var index = -1;
        for (var i = 0; i < dataArr.length; i++) {
            if (dataArr[i] == delVal) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            dataArr.splice(index, 1);
        }
    };
    accDoc.prototype._delDataById = function(dataArr,delVal){
        var index = -1;
        var delTemp = _.parseJSON(delVal);
        for (var i = 0; i < dataArr.length; i++) {
            var data = dataArr[i];
            try{
                data = _.parseJSON(data);
            }catch (e){}
            if (data.id == delTemp.id || data.fileUrl == delTemp.id) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            dataArr.splice(index, 1);
        }
    };
    accDoc.prototype._checkboxSwitch = function(checkbox){
        if(checkbox.checked == true) {
            checkbox.checked = false;
        }else {
            checkbox.checked = true;
        }
    };
    accDoc.prototype._resetCheckbox = function(){
        var self = this;
        var checkboxs = self.basicDiv.querySelectorAll("input") ,i = 0,len = checkboxs.length;
        for(; i < len ; i ++) {
            checkboxs[i].checked = false;
        }

    };

    accDoc.getDocPlugin = function(options){
        var url = _.origin + "/rest/product";
        accDoc.sendAjax(url,"GET","",options);
    };
    accDoc.getDocRBAC = function(options){
        var url = _.origin + "/rest/m3/appManager/hasResourceCode/F04_docIndex";
        accDoc.sendAjax(url,"GET","",options);
    };
    accDoc.getColRBACAndColQuoteCounts = function(options){
        var url = _.origin + "/rest/coll/collaboration/user/privMenuAndQuoteCounts";
        accDoc.sendAjax(url,"GET","",options);
    };
    accDoc.getEdocRBAC = function(options){
        var url = _.origin + "/rest/edocResource/edoc/user/privMenu";
        accDoc.sendAjax(url,"GET","",options);
    };
    accDoc.getColQuote = function(params,body,options){
        var url = _.origin + '/rest/coll/colQuotes';
        accDoc.sendAjax(url,"POST",body,options);
    };
    accDoc.getArchiveLibraries = function(body,options){
        var url = _.origin + '/rest/docs/archive';
        body = "";
        accDoc.ajaxBackDrop(true);
        accDoc.sendAjax(url,"GET",body,options);
    };
    accDoc.getArchiveList = function(body,options){
        var url = _.origin + '/rest/docs/search';
        accDoc.ajaxBackDrop(true);
        accDoc.sendAjax(url,"POST",body,options);
    };
    accDoc.getEdocList = function(body,options){
        //TODO 获取公文的列表数据
        var url = _.origin + "/rest/edocResource/getSummaryListByEdocTypeAndListType";
        accDoc.sendAjax(url,"POST",body,options);
    };
    accDoc.ajaxBackDrop = function(show){
        var backDrop = document.querySelector(".cmp-accDoc-back-drop2");
        if(backDrop){
            if(show){
                backDrop.classList.remove("cmp-hidden")
            }else {
                backDrop.classList.add("cmp-hidden")
            }
        }
    };
    accDoc.sendAjax = function(url,type,body,options){
        var success = options.success,
            error = options.error;

        var isSearch = false;
        if(body && body.search){
            isSearch = true;
        }
        if(arguments.length > 4){
            var queryStr = "";
            for(var key in body){
                queryStr += key + "=" + body[key] + "&";
            }
            url += "?" + queryStr + "option.n_a_s=1";
            body = "";
        }else {
            url += '?&option.n_a_s=1';
        }
        _.ajax({
            url:url,
            type:type,
            dataType:'json',
            data: _.toJSON(body),
            headers : {
                "Content-Type" : "application/json; charset=utf-8",
                "Accept":"application/json",
                'token' : _.token
            },
            success:function(result){

                if(isSearch) {
                    _filterSearchDocfolderData(result);
                }
                success(result);
                setTimeout(function(){
                    if(document.querySelector(".cmp-loading")){
                        _.dialog.loading(false);
                    }

                },300);
            },
            error:function (e) {
                accDoc.ajaxBackDrop(false);
                if(!_.errorHandler(e)){
                    error.call(this,e);
                }
            }
        });
    };

    var _filterSearchDocfolderData = function(result){
        try{
            var temp = [];
            var datas = result.data;
            for(var i = 0;i< datas.length;i++){
                if(!datas[i].is_folder){
                    temp.push(datas[i]);
                }
            }
            result.data = temp;
        }catch (e){}

    };

    var content = function() {
        var content =
            '<div class="<% if(cmp.os.ios && !cmp.platform.wechat){ %> cmp-accDoc-ios-header <% } %> cmp-bar <% if(cmp.os.android){ %> cmp-accDoc-top-header<% } %> cmp-bar-nav cmp-accDoc-header cmp-bar-accDoc ">' +
            '   <div data-key="x-9999" id="cmp_accDoc_backBtn" class="cmp-pull-left select_btnBack display_none cmp-hidden">' +
            '       <span  class="cmp-icon  see-icon-v5-common-arrow-back"></span>' +
            '   </div>' +
            '   <div id="cmp_accDoc_searchBtn" class="cmp-icon see-icon-search cmp-pull-right cmp-active"></div>' +
            '   <div class="cmp-segmented-control cmp-accDoc-control <% if(cmp.os.ios){ %>ios<% } %>">' +
            '       <nav id="colControlItem" class="cmp-control-item cmp-accDoc-control-item cmp-active" href="#cmp_accDoc_coordinationArea<%=this.uuID %>">' + _.i18n("cmp.accDoc.collaboration") + '</nav>' +
            '       <nav id="docControlItem" class="cmp-control-item cmp-accDoc-control-item" href="#cmp_accDoc_docArea<%=this.uuID %>">' + _.i18n("cmp.accDoc.doc") + '</nav>' +
            '       <nav id="eDocControlItem" class="cmp-control-item cmp-accDoc-control-item" href="#cmp_accDoc_edocArea<%=this.uuID %>">' + _.i18n("cmp.accDoc.edoc") + '</nav>' +
            '   </div>' +
            '</div>' +
            '   <div class="cmp-content accDoc position_relative background_fff ">' +//内容区
            '       <div id="cmp_accDoc_coordinationArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_first cmp-active">' +    //协同展示区
            '           <div id="cmp_accDoc_coordinationSwitch" class="cmp-segmented_title_content accDoc cmp-after-line">' +
            '               <div class="cmp-segmented-control cmp-segmented-control-inverted accDoc cmp-after-line">' +
            '                   <nav class="cmp-control-item cmp-active" href="#cmp_accDoc_coordination_todoArea<%=this.uuID %>" data-param=' + accDocConstant.C_iCoordination_dataParam_todo + '><span>' + _.i18n("cmp.accDoc.listPending") + '</span><span id="pendingNO" class="cmp-hidden"><%=this.colNum.listPending %></span></nav>' +
            '                   <nav class="cmp-control-item" href="#cmp_accDoc_coordination_doneArea<%=this.uuID %>" data-param=' + accDocConstant.C_iCoordination_dataParam_done + '><span>' + _.i18n("cmp.accDoc.listDoneAll") + '</span><span id="doneNO" class="cmp-hidden"><%=this.colNum.listDone %></span></nav>' +
            '                   <nav class="cmp-control-item " href="#cmp_accDoc_coordination_sendArea<%=this.uuID %>" data-param=' + accDocConstant.C_iCoordination_dataParam_send + '><span>' + _.i18n("cmp.accDoc.listSent") + '</span><span id="sentNO" class="cmp-hidden"><%=this.colNum.listSent %></span></nav>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_coordination_todoArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor  cmp-active">' +  //待办
            '               <div id="cmp_accDoc_scroll4Todo<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_coordination_todoList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_coordination_doneArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor">' +  //已办
            '               <div id="cmp_accDoc_scroll4Done<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_coordination_doneList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_coordination_sendArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor">' +  //已发
            '               <div id="cmp_accDoc_scroll4Send<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_coordination_sendList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '       <div id="cmp_accDoc_docArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_first">' +//文档展示区
            '           <div class="cmp-segmented_title_content cmp-accDoc-crumbs-container cmp-after-line">' +
            '               <div id="cmp_accDoc_crumbsScroll<%=this.uuID %>" class="cmp-crumbs-content-accDoc accDoc cmp-after-line">' +
            '                   <div id="cmp_accDoc_crumbsList" class="scroll"><span id="crumbs_x-9999" class="transverse-mark on-text crumbs-text"><a href="javascript:void(0)" class="no-text">' + _.i18n("cmp.accDoc.doc").escapeHTML() + '</a></span></div>' +
            '               </div>' +
            '           </div>' +
            '           <div class="cmp-control-content cmp_accDoc_floor cmp-active background_fff">' +
            '               <div id="cmp_accDoc_scroll4Doc<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_docList" class="cmp-list-content cmp-accDoc-file-index-content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '       <div id="cmp_accDoc_edocArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_first">' +
            '           <div id="cmp_accDoc_edocSwitch" class="cmp-segmented_title_content edoc">' +
            '               <div class="cmp-segmented-control cmp-segmented-control-inverted accDoc cmp-after-line">' +
            '                   <nav class="cmp-control-item cmp-accDoc-nav" href="#cmp_accDoc_edoc_sendArea<%=this.uuID %>" edoc-type="0">' +
            '                       <span class="edoc">' + _.i18n("cmp.accDoc.send") + '<state id="cmp_accDoc_edoc_initState" value="listPending">.' + _.i18n("cmp.accDoc.listPending") + '</state></span>' +
            '                       <span class="cmp-icon cmp-icon-arrowdown"></span>' +
            '                   </nav>' +
            '                   <nav class="cmp-control-item" href="#cmp_accDoc_edoc_receiveArea<%=this.uuID %>" edoc-type="1">' +
            '                       <span class="edoc">' + _.i18n("cmp.accDoc.receive") + '<state value="listPending"></state></span>' +
            '                       <span class="cmp-icon cmp-icon-arrowdown"></span>' +
            '                   </nav>' +
            '                   <nav class="cmp-control-item " href="#cmp_accDoc_edoc_reportArea<%=this.uuID %>" edoc-type="2">' +
            '                       <span class="edoc" >' + _.i18n("cmp.accDoc.report") + '<state value="listPending"></state></span>' +
            '                       <span class="cmp-icon cmp-icon-arrowdown"></span>' +
            '                   </nav>' +
            '               </div>' +
            '               <div class="popover-items cmp-hidden">' +
            '                   <div class="tri"></div>' +
            '                   <ul>' +
            '                       <li state="listPending">' + _.i18n("cmp.accDoc.listPending") + '<span class="cmp-icon cmp-icon-checkmarkempty accDoc-gou"></span></li>' +
            '                       <li state="listZcdb">' + _.i18n("cmp.accDoc.listZcdb") + '</li>' +
            '                       <li state="listDoneAll">' + _.i18n("cmp.accDoc.listDoneAll") + '</li>' +
            '                       <li state="listSent">' + _.i18n("cmp.accDoc.listSent") + '</li>' +
            '                   </ul>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_edoc_sendArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor background_eee cmp-active">' +
            '               <div id="cmp_accDoc_scroll4Edoc_send<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_edoc_sendList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_edoc_receiveArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor">' +
            '               <div id="cmp_accDoc_scroll4Edoc_receive<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_edoc_receiveList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div id="cmp_accDoc_edoc_reportArea<%=this.uuID %>" class="cmp-control-content cmp_accDoc_floor">' +
            '               <div id="cmp_accDoc_scroll4Edoc_report<%=this.uuID %>" class="cmp-scroll-wrapper">' +
            '                   <div class="cmp-scroll">' +
            '                       <ul id="cmp_accDoc_edoc_reportList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content"></ul>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <footer class="cmp-bar cmp-bar-footer cmp-accDoc-footer cmp-accDoc-footer_replay" style="z-index: 86;">' +
            '       <button id="cmp_accDoc_closeBtn" type="button" class="cmp-btn cmp-btn-primary cmp-btn-block display_inline-block hold">' + _.i18n("cmp.accDoc.cancel") + '</button>' +
            '       <button id="cmp_accDoc_okBtn" type="button" class="cmp-btn cmp-btn-primary cmp-btn-block display_inline-block">' + _.i18n("cmp.accDoc.ok") + '(<span id="cmp_accDoc_selectNum">0</span>)</button>' +
            '   </footer>' +
            '<div class="cmp-accDoc-back-drop cmp-hidden"></div>' +
            '<div class="cmp-accDoc-back-drop2 cmp-hidden"></div>';
        return content;
    };
    var coordinationItem =function() {
        var coordinationItem =
            '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
            '   <% var obj = this[i]; %>' +
            '   <% var at = cmp.toJSON(obj); %>' +
            '   <li class="cmp-list-cell   cmp-after-line" style="margin-bottom: 5px;background-color: #fff;">' +
            '       <div class="cmp-list-cell-img cmp-checkbox cmp-left">' +
            '           <input disabled type="checkbox" name="_checkbox" data-key="<%=obj.affairId%>" info=\'<%=at.escapeJS().escapeHTML() %>\' class="select-put cmp-select-input-disable"/>' +
            '           <img class=" cmp-pull-left img_setting cmp-img-cache" src="" cmp-data="<%=obj.startMemberId %>">' +
            '       </div>' +
            '       <div class="cmp-list-cell-info  " >' +
            '           <h6 class="cmp-ellipsis-2 list_cont_info accDoc-item-title">' +
            '               <span style="letter-spacing: 1px;"><%=obj.subject.escapeJS().escapeHTML()  %></span>' +
            '               <span class="unfold cmp-hidden">' + _.i18n("cmp.accDoc.zhankai") + '</span>' +
            '           </h6>' +
            '           <span class="cmp-ellipsis accDoc-item-name"><%=obj.startMemberName %></span>' +
            '           <span class="cmp-ellipsis cmp-h5  list_title_time width_30 cmp-text-right" style="font-size: 13px;"><%=obj.createDate %></span>' +
            '       </div>' +
            '   </li>' +
            '<% } %>';
        return coordinationItem;
    };
    var docItem = function() {
        var docItem =
            '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
            '   <% var obj = this[i]; %>' +
            '   <li class="background_fff cmp-after-line cmp-list-cell <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>file_indie <% } %>">' +
            '       <div class="cmp-list-cell-img cmp-left <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>cmp-checkbox <% } %>">' +
            '       <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>' +
            '           <input disabled type="checkbox" class="select-put cmp-select-input-disable" name="_checkbox" data-key="<%=obj.fr_id %>" info=\'<%=cmp.toJSON(obj).escapeJS().escapeHTML() %>\'>' +
            '           <% if(obj.isImg){ %>' +
            '               <img src="<%=obj.src %>">' +
            '           <% }else{ %>' +
            '               <div class="<%=cmp.att.iconCss(obj.extension) %>"></div>' +
            '           <% } %>' +
            '       <% }else{ %>' +
            '           <div class="cmp-accDoc-placeholder-div"></div>' +
            '           <div class="cmp-icon-document folder"></div>' +
            '       <% } %>' +
            '       </div>' +
            '       <div class="cmp-list-cell-info <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>null_pel_time<% } else{ %>folder-doc<% } %>">' +
            '           <span class="cmp-ellipsis-2 cmp-pull-left list_title_name"><% if(this.type == ' + accDocConstant.C_iDocDataType_sub + '){ %><%=obj.fr_name.escapeJS().escapeHTML() %> <% }else{ %><%=obj.name.escapeJS().escapeHTML() %><% } %></span>' +
            '           <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>' +
            '           <h5 class="cmp-ellipsis list_cont_info">' +
            '               <span class="cmp-ellipsis doc_name"><%=obj.fr_create_username %></span>' +
            '               <span><%=obj.fr_create_time %></span>' +
            '           </h5>' +
            '       <% }else{ %>' +
            '           <span class="cmp-h5 text_info cmp-ellipsis" style="position: relative;left: 10px;"><% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == true){ %><%=obj.next_Doc_Num %><% } %></span>' +
            '       <% } %>' +
            '           <div class="cmp-list-navigate" <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>  <% } %>>' +
            '               <% if(this.type ==' + accDocConstant.C_iDocDataType_sub + ' && obj.is_folder == false){ %>' +
            '               <span class="cmp-h5"><%=cmp.att.countAttSize(obj.fr_size) %></span>' +
            '               <% }else{ %>' +
            '               <span docName="<% if(this.type == ' + accDocConstant.C_iDocDataType_sub + '){ %><%=obj.fr_name.escapeHTML() %><% }else{ %><%=obj.name.escapeHTML() %><% } %>" <% if(obj.docId){ %>docId="<%=obj.docId %>" <% } %> archiveID="<% if(this.type ==' + accDocConstant.C_iDocDataType_lib + '){ %><%=obj.docId %><% }else{ %><%=obj.fr_id %><% } %>" class="cmp-icon cmp-icon-arrowright" style="margin-top:9px;"></span>' +
            '               <% } %>' +
            '           </div>' +
            '       </div>' +
            '   </li>' +
            '<% } %>';
        return docItem;
    };
    var edocItem = function() {
        var edocItem =
            '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
            '   <% var obj = this[i]; %>' +
            '   <% var at = cmp.toJSON(obj); %>' +
            '   <li class="cmp-list-cell   cmp-after-line" style="background-color: #fff;padding:10px 0;">' +
            '       <div class="cmp-list-cell-img cmp-checkbox cmp-left">' +
            '           <input disabled type="checkbox" name="_checkbox" data-key="<%=obj.affairId%>" info=\'<%=at.escapeJS().escapeHTML() %>\' class="select-put cmp-select-input-disable"/>' +
            '           <img class=" cmp-pull-left img_setting cmp-img-cache" src="" cmp-data="<%=obj.summary.startUserId %>">' +
            '       </div>' +
            '       <div class="cmp-list-cell-info" >' +
            '           <h6 class="cmp-ellipsis-2 list_cont_info accDoc-item-title" style="margin-bottom: 7px;">' +
            '               <span style="letter-spacing: 1px;">' +
            '                   <% if(obj.summary.urgentLevel){ %>' +
            '                   <span class="cmp-icon see-icon-v5-common-important-<%=obj.summary.urgentLevel %>" style="color:#ff0000;font-size:15px;"></span>' +
            '                   <% } %>' +
            '                   <% if(obj.secretLevelName){ %>' +
            '                   <span>[<%=obj.secretLevelName %>]</span>' +
            '                   <% } %>' +
            '                   <span><%=obj.summary.subject.escapeJS().escapeHTML()  %></span>' +
            '               </span>' +
            '           </h6>' +
            '          <span><%=obj.createPerson %></span>' +
            '           <span class="cmp-ellipsis accDoc-item-name"><% if(obj.summary.docMark){ %><%=obj.summary.docMark %><% } %></span>' +
            '           <span class="cmp-ellipsis cmp-h5  list_title_time width_30 cmp-text-right" style="font-size: 13px;"><%=obj.createDate %></span>' +
            '       </div>' +
            '   </li>' +
            '<% } %>';
        return edocItem;
    };
    var searchUI = function() {
        var searchUI =
            '<header class="cmp-bar <% if(cmp.os.android){ %> cmp-accDoc-top-header<% } %> cmp-header-none cmp-bar-nav cmp-hidden">' +
            '   <a id="cmp_accDoc_searchCloseBtn" class="cmp-icon see-icon-v5-common-arrow-back cmp-pull-left cmp-active"><span>' + _.i18n("cmp.accDoc.back.qudiao") + '</span></a>' +
            '   <h1 id="cmp_accDoc_searchTitle" class="cmp-title"><%=this.title %></h1>' +
            '</header>' +
            '<div class="cmp-content position_relative cmp-content-none">' +
            '   <div class="cmp-search-content">' +
            '       <div id="cmp_accDoc_search4Coor" data-key="<%=this.state %>" class="cmp-segmented-control cmp-search-title <% if(this.type=="' + accDocConstant.C_iSearchType_coordination + '"){ %>cmp-active <% }else{ %> display_none<% } %>"></div>' +
            '      <div id="cmp_accDoc_search4Doc" class="cmp-segmented-control cmp-search-title <% if(this.type=="' + accDocConstant.C_iSearchType_doc + '"){ %>cmp-active <% }else{ %> display_none<% } %>"></div>' +
            '      <div id="cmp_accDoc_search4Edoc" class="cmp-segmented-control cmp-search-title <% if(this.type=="' + accDocConstant.C_iSearchType_edoc + '"){ %>cmp-active <% }else{ %> display_none<% } %>"></div>' +
            '       <div class="cmp-accDoc-control-content display_none">' +
            '           <div class="cmp-scroll-wrapper" id="cmp_accDoc_scroll4Search<%=this.uuID %>">' +
            '               <div class="cmp-scroll">' +
            '                   <ul id="cmp_accDoc_searchList" class="cmp-list-content cmp-accDoc-file-index-content relevance_synergy_content" style="background: #fff;"></ul>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';
        return searchUI;
    };
    var accDocWidget = {};
    _.accDoc = function(id,options){
        if(typeof options == "undefined" && typeof id != "string"){
            options = id;
            id = "CMP_ONLY_ONE_ACCDOC_WIDGET";
        }
        if(!accDocWidget[id]){
            options.id = id;
            accDocWidget[id] = new accDoc(options);
            return accDocWidget[id];
        }else {
            accDocWidget[id].docReShow = true;
            accDocWidget[id].coordinationReShow = true;
            accDocWidget[id].opts = options;
            accDocWidget[id]._reShow(options.fillbackData);
        }
    };
    _.accDocJump = function(options){
        var _options = _.extend({
            fillbackData:null,
            pageKey:""
        },options);
        var currentSearch = window.location.search;
        if(currentSearch != "" && currentSearch.length >0){
            if(currentSearch.indexOf("?") != -1){
                currentSearch= currentSearch.replace("?","");
            }
            if(currentSearch.indexOf("pageKey") != -1){
                var searchArr=[];
                if(currentSearch.indexOf("&") != -1){
                    searchArr = currentSearch.split("&");
                }
                if(searchArr.length >0) {
                    for(var i = 0;i<searchArr.length;i++){
                        if(searchArr[i].indexOf("pageKey") != -1){
                            var pageKeyVal = searchArr[i].split("=")[1];
                            if(pageKeyVal != _options.pageKey){
                                _.storage.delete("cmp-accDoc-jump-pageKey",true);
                            }
                            break;
                        }
                    }
                }else {
                    var pageKeyVal = currentSearch.split("=")[1];
                    if(pageKeyVal != _options.pageKey){
                        _.storage.delete("cmp-accDoc-jump-pageKey",true);
                    }
                }
            }

        }else {
            var historyPageKey = _.storage.get("cmp-accDoc-jump-pageKey",true);
            if(historyPageKey){
                _.storage.delete("cmp-accDoc-jump-pageKey",true);
            }
        }
        _.storage.save("cmp-accDoc-opts", _.toJSON(_options),true);
        var tempPath = accDocConstant.C_sJumpPagePath +"?options=cmp-accDoc-opts&pageKey=" + _options.pageKey;
        _.event.trigger("beforepageredirect",document);
        _.href.next(tempPath);
    }
    /**
     * 关联文档组件关闭
     */
    _.accDocClose = function(){
        var currentAccDoc = document.querySelector(".cmp-accDoc-basicDiv-show");
        if(currentAccDoc){
            var uid = currentAccDoc.getAttribute("uid");
            if(typeof accDocWidget[uid] != "undefined" && accDocWidget[uid] != null){
                accDocWidget[uid]._updateTitle(false);
                accDocWidget[uid]._close();
            }
        }
    };
    _.accDocSearchUIClose = function(){
        var currentAccDocSearchUI = document.querySelector(".cmp-accDoc-searchUI");
        if(currentAccDocSearchUI){
            var uid = currentAccDocSearchUI.getAttribute("uid");
            if(typeof accDocWidget[uid] != "undefined" && accDocWidget[uid] != null){
                accDocWidget[uid]._searchUIClose();
            }
        }
    }
})(cmp);
