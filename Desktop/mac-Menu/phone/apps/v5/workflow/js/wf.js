var __workflow_bath_path__ = "/seeyon/m3/apps/v5/workflow";
 /**
   * 是否允许取回
   * 返回值是一个js数组对象，有以下属性
   * String[0]:true表示可以取回,false表示不可以取回
   * String[1]:
   *  -1表示程序或数据发生异常,不可以取回
   *  0表示正常状态,可以取回
   *  1表示当前流程已经结束,不可以取回
   *  2表示后面节点任务事项已处理完成,不可以取回
   *  3表示当前节点触发的子流程已经结束,不可以取回
   *  4表示当前节点触发的子流程中已核定通过,不可以取回
   *  5表示当前节点是知会节点,不可以取回
   *  6表示当前节点为核定节点,不可以取回
   *  7表示当前节点为封发节点,不可以取回
   *  8表示后面节点任务事项处于指定回退状态，不可以取回
   */
  function canTakeBack(workitemId, processId, activityId, performer, caseId, appName, isForm,callBackFun){
    var params = {};
    params.appName = appName;
    params.processId = processId;
    params.activityId = activityId;
    params.workitemId = workitemId;
    
    
    $s.Workflow.canTakeBack(params, errorBuilder({
        success : function(result) {
        	callBackFun(result);
        }
    }));
  }
  
  if(!window.AjaxErrorHander){
      /**
       * 封装处理ajax报错
       */
      window.AjaxErrorHander = function(setting){
          
          var ajaxSetting = setting || {};
          this.success = function(result){
              if(typeof ajaxSetting.success == "function"){
                  ajaxSetting.success(result);
              }
              ajaxSetting = null;
          }

          this.error = function(err){
              var cmpHandled = cmp.errorHandler(err);
              if(cmpHandled){
                  //
                  if(ajaxSetting.exeSelfError === true && typeof ajaxSetting.error == "function"){
                      ajaxSetting.error(err);
                  }
                  ajaxSetting = null;
              }else {
                   if(typeof ajaxSetting.error == "function"){
                       ajaxSetting.error(err);
                   }else{
                       _alert(cmp.i18n("workflow.alert.try.again"));
                   }
                   ajaxSetting = null;
              }
          }
}
  }
  
  if(!window.errorBuilder){
      /**
       * 封装ajax报错方法
       */
      window.errorBuilder = function(setting){
          return new AjaxErrorHander(setting);
      }
  }
  
  
//加载工作流国际化, WorkFlowDesignerUtil 方法里面用不到初始化的方法
  cmp.ready(function(){
      if(typeof WorkFlowDesigner == "undefined"){
          //延迟加载的
          cmp.i18n.load(__workflow_bath_path__ + "/i18n/", "WorkFlow", function(){
              if(WorkFlowDesigner){
                  WorkFlowDesigner.prototype.loadI18N = true;
              }
          });
      }else{
          if(!WorkFlowDesigner.prototype.loadI18N){
              cmp.i18n.load(__workflow_bath_path__ + "/i18n/", "WorkFlow", function(){
                  WorkFlowDesigner.prototype.loadI18N = true;
              }); 
          }
      }
  });

  
 var WF_WINDOW_HEIGHT = window.innerHeight;
//自适应页面
 window.addEventListener("resize", function(){
     WF_WINDOW_HEIGHT = window.innerHeight;
 });
 
 var WorkFlowLock = {
         ADD_NODE : 3, //加签
         DEL_NODE : 4, //减签
         JOIN_SIGN : 5,//当前会签
         INFORM : 6, //知会
         PASS_READ : 7, //传阅
         MORE_SIGN : 8, //多级会签
         STEP_BACK : 9, //回退
         SPECIFIES_RETURN  :10,//指定回退
         STEP_STOP : 11, //终止
         REPEAL_ITEM : 12, //撤销
         TAKE_BACK : 13, //取回
         SUBMIT : 14, //提交
         EDIT_CONTENT : 15,//修改正文
         TRANSFER : 20 //移交
     };
  

/**
 * 
 * 工作流编辑器, 依赖组织模型的选人组件
 * 
 * 
 * 工作流dom相关参数
 * config.workflow.moduleType string 模块 例如：系统 config.workflow.moduleType = "1"
 * 
 * [config.workflow.process_desc_by] string 工作流数据类型 默认值:"xml", 
 * [config.workflow.process_xml] string 工作流xml 默认值:"",
 * [config.workflow.readyObjectJSON] string 工作流扭转需要参数, 当前会签相关参数  默认值:""
 * [config.workflow.workflow_data_flag] string 工作流扭转需要参数 默认值:"WORKFLOW_SEEYON",
 * [config.workflow.process_info] string] string 工作流扭转需要参数， 流程选择相关信息  默认值:""
 * [config.workflow.process_info_selectvalue] string 工作流扭转需要参数，   默认值:""
 * [config.workflow.process_subsetting] string 工作流扭转需要参数，模版定义时设置绑定子流程信息   默认值:""
 * [config.workflow.workflow_newflow_input] string 工作流扭转需要参数， 运行时选择了那些子流程信息  默认值:""
 * [config.workflow.process_rulecontent] string 工作流扭转需要参数, 流程说明，流程的描述信息  默认值:""
 * [config.workflow.workflow_node_peoples_input] string 工作流扭转需要参数， 运行时：选人信息  默认值:""
 * [config.workflow.workflow_node_condition_input] string 工作流扭转需要参数,运行时：选分支  默认值:""
 * [config.workflow.processId] string 流程ID 默认值:"",
 * [config.workflow.caseId] string 工作流实例ID 默认值:"-1",
 * [config.workflow.subObjectId] string 工作流节点一条记录的标志，对应ctp_affair的subObjectId, 一一对应  默认值:"-1",
 * [config.workflow.currentNodeId] string 当前节点 默认值:"start",
 * [config.workflow.process_message_data] string 加签，减签发送消息用
 * [config.workflow.workflow_last_input] string 是否是流程最后一个处理人
 * [config.workflow.workflow_thisNodelast_input] string 是否是节点最后一个处理人
 * [config.workflow.processChangeMessage] string 工作流扭转需要参数，流程加/减签信息  默认值:""
 * [config.workflow.process_event] string 工作流扭转需要参数，模版设计时使用，节点高级事件  默认值:""
 * 
 * 
 * 样式参数
 * [config.style.zIndex] string 工作流层级
 * 
 * 参数设置
 * config.info.state string  流程图状态 view-只读 edit-编辑， edit_current-处理时加签或当前会签  默认值:"view" 
 * config.info.category string 分类 例如：collaboration
 * [config.info.model] string 工作流模式, trustee - 托管模式， 由wf.js负责展现， silent - 静默模式， 不创建流程图，customer - 自定义模式，将图画到用户自定义的容器中 
 * [config.info.wfSelectorId] string 自定义模式下，流程图容器ID
 * [config.info.dataCacheKey] string 数据缓存key, 用于缓存外托
 * [config.info.canEdit] function 自定义模式下， 是否可以编辑
 * [config.info.beforDrawWf] function 自定义模式下，画图前事件
 * [config.info.customerTap] function 自定义模式下, 流程节点击事件
 * [config.info.onDrawError] function 流程图画图时错误，例如：超过100个节点
 * [config.info.defaultPolicyId] string 默认节点code view状态不需要设置
 * [config.info.defaultPolicyName] string 默认节点名称 view状态不需要设置
 * [config.info.currentAccountId] string 当前登录单位ID 
 * [config.info.currentAccountName] string  当前登录单位名称
 * [config.info.currentUserId] string 当前登录人员ID
 * [config.info.currentUserName] string 当前登录人员名称
 * [config.info.workItemId] string 工作流事项的ID，对应affair的subObjectId,
 * [config.info.activityId] string 工作流节点ID
 * [config.info.affairId] string affairId,
 * [config.info.summaryId] string 业务数据ID,
 * [config.info.bodyType] string 正文类型 默认:"10",
 * [config.info.formData] string 表单数据, 对应表单的mastrid,
 * [config.info.processTemplateId] string 流程模板ID
 * [config.info.currentWorkItemIsInSpecial] boolean 是否为指定回退状态（(affairSubState == '15' || affairSubState == '16' || affairSubState == '17');）
 * [config.info.submitStyleCfg] int 指定回退的被回退者处理后流转方式（ 0  重新流转 /  1  提交回退者 /2  重新流转和提交回退者）
 * [config.info.maxNameLength] int 节点名称变动时，最大显示数量， 默认6个， -1 无限制
 * [config.info.useTemplateId] 预提交时，是否使用流程模板ID，默认为false
 * [config.info.isProcessTemplate] boolean 是否为调用模板发起的流程 默认为false 
 *
 * 事件
 * [config.onNodeChange(names)] 流程改变时，返回流程的人员名称 
 * 
 * 回调函数
 * [config.getPermissions] 获取节点权限列表，加签替换节点权限时使用
 * 
 * 
 * API:
 * 
 * visible() 流程图是否可见
 * switchActive() 影藏/显示切换
 * createXML(params) 通过人员信息， 拼装流程xml
 * preSubmit(options) 流程预提交
 * getDatas() 获取流程值域数据，用于后台流程处理
 * edit(xparams) 打开流程进行编辑
 * setInfoAtt(name) 设置info属性域的值
 * setInputVal(key, value) 设置表单域里面的值
 * 
 * addNode()  加签
 * jointSign() 当前会签
 * inform() 知会
 * passRead() 传阅
 * multistageSign() 多级会签
 * isWfEmpty() 校验流程是否为空
 * executeWorkflowBeforeEvent(params) 执行流程事件
 * isInit() 是否初始化完成
 * 
 * FLOW_TYPE 流程类型
 * 
 * 
 */
var WorkFlowDesigner = function(config){
    
    //标记没有记载完成
    this._isFinishInit = false;
    
    this._initI18n(function(){
        this.isLoad = true;//表明是完全重新加载
        this._init_(config);
    });
}


/**
 * 工作流是否初始化完成
 */
WorkFlowDesigner.prototype.isInit = function(){
    
    return this._isFinishInit;
}

WorkFlowDesigner.prototype._initI18n = function(callback){
    var _this = this;
    if(!WorkFlowDesigner.prototype.loadI18N){
        cmp.i18n.load(__workflow_bath_path__ + "/i18n/", "WorkFlow",function(){
            WorkFlowDesigner.prototype.loadI18N = true;
            callback.call(_this);
        }); 
    }else{
        callback.call(this);
    }
}


WorkFlowDesigner.prototype._init_ = function(config){
    
    this.containerId = null;
    this.wfShowId = null;
    this.SELECT_ORG_TYPE_1 = "select_org_1_" + (new Date()).getTime();
    //this.SELECT_ORG_TYPE_2 = "select_org_2_" + (new Date()).getTime();
    this.isCreateDom = false;
    this.clickTime = new Date().getTime();//记录页面的点击时间，防止重复点击
    this.specifiesReturnInfo = null;//指定回退缓存
    this.isSubmiting = false;//用来做重复点击的屏蔽
    this.isPresubmit = false;//是否在执行预提交
    this.backToMe = "0";//加签时的是否回到我
    this.selectOrgObj = null;//选人对象
    this.isLastPerson = false;  //最后一个处理人
    this.currentNodeLast = "false"; //是不是当前节点的最后一个处理人
    
    this.FLOW_TYPE = {
            sequence : 0,//串发
            concurrent : 1,//并发
            countersign : 2,//会签
            concurrentNext : 3// 与下一节点并发
        }
    
  //流程进行预提交时参数设置
    this.wfSelectInfo = {
            needSelectPeopleNodeNum : 0,
            realSelectPeopleNodeNum : 0,
            appName : "",
            nodeIdAndNodeNameMap : {},
            needPeopleTagObject : {}
    }
    
    //流程预提交交互页面特殊ID
    this.wfViewEleId = {
            WF_CHOOSE_MEMBER_ID : "WF_CHOOSE_MEMBER_" + (new Date().getTime()),//选人 的ID
            WF_SELECT_MEMBER_DIALOG : null,//匹配到人的分支选人dialog
            WF_BRANCH_DIALOG : null,//分支匹配dialog
            WF_MAIN_DIALOG : null,//工作流编辑dialog
            WF_CIRCLE_DIALOG : null//环形流程Dialog 
    }
    
  //分支选人缓存，解决节点人数多是卡死的问题
    this.WF_SELECT_MEMBER_DIALOG_DATAS = {}
    //分支选人，已选人员缓存，主要用于回填
    this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED = {}
    
    this.jsonKey = "workflow_definition";
    
    //当前事项对应的节点
    this.currentNode = null ;
    /**
     * 用于缓存数据
     */
    this.cacheDatas = {
            addNodeInfo : "",//保存处理时加签信息
            permissions : {},//缓存节点权限列表
            isEmpty : true,//是否有流程数据
            loadViewDatas : false,//只读状态下，是否已经加载了流程数据
            currentNodeIsFormReadOnly : "false",//当前节点是否是只读状态
            
          //加签，当前会签等新增的节点信息, key命名和 currentAction保持一致
            newNodes : {
                "AddNode" : [],//加签
                "JointSign" : [],//当前会签
                "Infom" : [],//知会
                "PassRead" : [],//传阅
                "MultistageSign":[],//多级会签
                "DeleteNode" : [],
                "SpecifiesReturn" : [] //指定回退
            },
            multistageSignInfo : {},
            multistageSignList : [],//多级会签的列表
            multistageSignDeptList : [],//多级会签，部门需要选人的节点列表
            multistageSignDeptUsers : {},//多级会签缓存部门选择人员
            jointSignParams : {},//当前会签传入参数
            currentAction : "",//记录当前操作，加签/当前会签 AddNode,JointSign,Infom,PassRead,DeleteNode
            
            //存放this.cacheDatas.newNodes的详细信息
            newNodesInfo : {},
            delNodesInfo : {},//减签的信息
            
            jsonDatas : null,//工作流画图数据
            initDataMap : {},//自定义模式下，记录初始化流程数据
            isEdited : false,
            editFormOperationValue : null,
            matchRequestToken : null,//工作流缓存
            selectMemberExcluedeAccountElements : null
    }
    this.actionMemberPanels = {
            "EDOC_MultistageSign" : ["dept","org","team"],
            "EDOC_AddNode" : ["dept","org","post","team"],
            "EDOC_JointSign" :["dept","org","post","team"],
            "EDOC_Infom" : ["dept","org","post","team"],
            "EDOC_PassRead": ["dept","org","team"]
    }
    this.CMP_ALL_PANELS = ["dept","org","post","team","extP", "vjOrg"];
    this.CMP_ALL_PANELS_NO_OUTER = ["dept","org","post","team", "vjOrg"];
    this.CMP_ALL_PANELS_NO_OUTER_VJOIN = ["dept","org","post","team"];
    
    
    
    //操作key
    this.actionKeys = [];
    this.actionKeysMap = {}
    for(var key in this.cacheDatas.newNodes){
        this.actionKeys.push(key);
        this.actionKeysMap[key] = key;
    }
    
    this.jsonFileds = {
        process_desc_by : "xml",
        process_xml : "",
        readyObjectJSON : "",
        workflow_data_flag : "WORKFLOW_SEEYON",
        process_info : "",
        process_info_selectvalue : "",
        process_subsetting : "",
        moduleType : "",
        workflow_newflow_input : "",
        process_rulecontent : "",
        workflow_node_peoples_input : "",
        workflow_node_condition_input : "",
        toReGo : "",
        dynamicFormMasterIds : "", //审批路径动态表底表数据Ids
        processId : "",
        caseId : "-1",
        subObjectId : "-1",
        currentNodeId : "start",
        process_message_data : "",//加签，减签发送消息用
        workflow_last_input : "false",// 是否是流程最后处理人
        workflow_thisNodelast_input : "false", // 是否是当前节点最后处理人
        processChangeMessage : "",
        process_event : ""
    }
    
    //节点改变回调函数
    this.onNodeChange = null;
    
    //获取可用的节点权限列表
    this.getPermissions = null;
    
    //指定回退
    this.stepBackToTargetNode = null;
    
    
    this.info = {
        state : "view",//是否是编辑状态, edit-编辑状态， edit_current-处理时加签或当前会签
        model : "trustee",//工作流模式, trustee - 托管模式， 由wf.js负责展现， 
                          //silent - 静默模式， 不创建流程图，
                          //customer - 自定义模式，将图画到用户自定义的容器中 
        wfSelectorId : "", //流程图容器ID
        dataCacheKey : "m3_v5_workflow_storage",//数据缓存key
        canEdit : null,//function 定制化, 是否可以编辑
        beforDrawWf : null,//function 定制化，画图事件
        customerTap : null, //function 定制化, 流程节点点击事件
        onDrawError : null, //function 画流程图时，超过100个节点就不能画了等错误时
        onTriggerEdit : null,//function 流程被编辑后触发
        defaultPolicyId : "",
        defaultPolicyName : "",
        currentAccountId : "",
        currentAccountName : "",
        currentUserId : "",
        currentUserName : "",
        category : "",//分类 协同 collaboration
        subCategory : "",//二级分类 sendEdoc
        workItemId : "",
        activityId : "",
        affairId : "",
        summaryId : "",
        bodyType : "10",
        formData : "",
        processTemplateId : "",
        currentWorkItemIsInSpecial : false,
        canTrackWorkflow :0,
        maxNameLength : 6,
        isProcessTemplate : false
    }
    this.style = {
            zIndex : 15
    }
    
    //初始化值
    for(var key in config){
        if(key == "workflow"){
            this.jsonFileds = cmp.extend(true, this.jsonFileds, config["workflow"]);
        }else if(key == "info"){
            this.info = cmp.extend(true, this.info, config["info"]);
        }else if(key == "style"){
            this.style = cmp.extend(true, this.style, config["style"]);
        }else if(key == "onNodeChange" && typeof config[key] == 'function'){
            this.onNodeChange = config[key];
        }else if(key == "getPermissions" && typeof config[key] == 'function'){
            this.getPermissions = config[key];
        }else if(key == "stepBackToTargetNode" && typeof config[key] == 'function'){
            this.stepBackToTargetNode = config[key];
        }else{
            //未知参数...
        }
    }
    
    //如果是查看状态，工作流默认显示有值
    this.cacheDatas.isEmpty = (this.info.state != "view");
    
    //自定义模式，赋值容器ID
    if(this.info.model == "customer"){
        this.wfShowId = this.info.wfSelectorId || "";
    }
    
    //执行初始化
    this._exeInit();
}


WorkFlowDesigner.prototype._exeInit = function(){
    
  //加载数据，并初始化工作流
    this._loadWfData(function(isInit){
        
      //创建dom元素
        this.createDom();
        
        //流程图回填
        if(this.cacheDatas.jsonDatas){
            
            //触发节点变动事件
            this.fire("nodeChange", this.cacheDatas.jsonDatas);
            
            //画图
            this.drawWf(this.cacheDatas.jsonDatas, false, !!isInit);
        }
        
        if(this.isLoad){
            
            var _this = this;
            
            //添加页面数据缓存事件
            document.addEventListener('beforepageredirect', function(e){ 
                _this.exeModel("save");
            });
            
            //TODO 添加删除缓存的事件
            document.addEventListener('deletesessioncache', function(e){ 

            });
            
          //重新渲染
            document.addEventListener('refreshWebView', function(e){ 
                _this.isLoad = false;
                _this._exeInit();
                //console.log("refreshWebView - 刷新流程成功...");
            });
        }
        
        this._isFinishInit = true;
    });
}


/*
 * 加载流程数据
 */
WorkFlowDesigner.prototype._loadWfData = function(callback){
    
  //缓存数据加载
    var storDatasJson = this.exeModel("load");
    if(storDatasJson){
        this.cacheDatas = cmp.extend(true, this.cacheDatas, storDatasJson["cacheDatas"]);
        this.jsonFileds = cmp.extend(true, this.jsonFileds, storDatasJson["jsonFileds"]);
    }
    
    //生成缓存key
    if(!this.cacheDatas.matchRequestToken){
        var nowDate = (new Date().getTime());
        this.cacheDatas.matchRequestToken = "H5-" + (this.info.currentUserId || nowDate) + "-" + nowDate;
    }
    
    if((this.info.model == "customer" || (this.info.model == "trustee" && this.jsonFileds.processId)) 
            && !this.cacheDatas.jsonDatas){
        //自定义模式，初始化的时候要画图
        this._loadWorkflow(function(){
            
            var jsonData = this.cacheDatas.jsonDatas;
            if(jsonData && jsonData.nodes) {
                for(var i=0; i< jsonData.nodes.length; i++) {
                    //缓存数据
                    this.cacheDatas.initDataMap[jsonData.nodes[i].id] = "";
                }
            }
            
            callback && callback.call(this, true);
        });
    }else{
        callback && callback.call(this, !this.cacheDatas.isEdited);
    }
}

/**
 * 加载流程图
 */
WorkFlowDesigner.prototype._loadWorkflow = function(callback){
    
    var workFlowParam = {};
    if(!this.jsonFileds.processId){
        workFlowParam.isRunning = false;
        workFlowParam.processId = this.info.processTemplateId;
    }else{
        workFlowParam.processId = this.jsonFileds.processId;
        workFlowParam.isRunning = true;
        workFlowParam.caseId = this.jsonFileds.caseId || "";
        workFlowParam.activityId = this.info.activityId || "";
    }
    
    //无流程id默认当前人员
    if(!workFlowParam.processId){
        
            workFlowParam.currentUserId = this.info.currentUserId;
            workFlowParam.currentUserName = this.info.currentUserName;
            
            workFlowParam.activityId = "start";
            workFlowParam.nodes = [{
                "id" : "start",
                "name" : this.info.currentUserName,
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
            }]
            
            this.cacheDatas.jsonDatas = workFlowParam;
            
            callback && callback.call(this);
    }else{
        
        var _this = this;
        cmp.dialog.loading();
        $s.Workflow.getWorkflowDiagramData(workFlowParam,errorBuilder({
            success : function(result) {
                cmp.dialog.loading(false);
                result.activityId = workFlowParam.activityId;
                _this.cacheDatas.jsonDatas = result;
                callback && callback.call(_this);
                _this = null;
            },
            error : function(e){
                cmp.dialog.loading(false);
                _this.alert(cmp.i18n("workflow.alert.load.data.error"));
                _this = null;
            }
        }));
    }
}

/**
 * 执行数据操作
 * @param action save/delete/load
 */
WorkFlowDesigner.prototype.exeModel = function(action){
    
    var ret = null, key = this.info.dataCacheKey;
    
    switch (action) {
    case "save":
        var storDatas = {
            "cacheDatas" : this.cacheDatas,
            "jsonFileds" : this.jsonFileds//this.formPostData(this.containerId)
        }
        cmp.storage.save(key, cmp.toJSON(storDatas), true);
        break;
    case "delete" :
        cmp.storage["delete"](key, true);
        break;
    case "load" :
        var storageObj = null;
        storageObj = cmp.storage.get(key, true);
        
        if(storageObj) {
            ret = cmp.parseJSON(storageObj);
            cmp.storage["delete"](key, true);
        }
        break;
    default:
        break;
    }
    return ret;
}


/**
 * 触发事件
 */
WorkFlowDesigner.prototype.fire = function(code, params){
    
    var _this = this;
    
    switch (code) {
    case "nodeChange":
        if(_this.onNodeChange){
            
          //节点改变事件
            var k = 0; 
            var jsonData = params;
            var names = "";
            for(var i = 0, len = jsonData.nodes.length; i < len && (_this.info.maxNameLength == -1 || k < _this.info.maxNameLength); i++){
                var n = jsonData.nodes[i];
                if("humen" == n.type){
                    if("" != names){
                        names += ",";
                    }
                    names += n["name"] + "("+n["policyName"]+")";
                    k++;
                }
            }
            
            if(names == "" && _this.info.state == "edit"){
                _this.cacheDatas.isEmpty = true;
            }
            
            _this.onNodeChange(names); 
        }
        break;
    case "triggerEdit":
        this.cacheDatas.isEdited = true;
        if(_this.info.onTriggerEdit){
            _this.info.onTriggerEdit();
        }
        break;
    default:
        break;
    }
    
}


/**
 * 获取提交数据
 * @since V5-A8 6.0
 */
WorkFlowDesigner.prototype.getDatas = function(){
    //var fields = this.formPostData(this.containerId);
    var fields = this.jsonFileds;
    var ret = {};
    ret[this.jsonKey] = fields;
    return ret;
}

/**
 * 设置info域的值
 * @param attName
 * @param val
 */
WorkFlowDesigner.prototype.setInfoAtt = function(attName, val){
    if(attName && this.info){
        this.info[attName] = val;
    }
}

/**
 * 打开蒙层
 */
WorkFlowDesigner.prototype._mask = function(show){
    
    var markDom;
    
    markDom = document.querySelector("#_workflow_mask_");
    
    if(show === true || show === void 0){
        if(!markDom){
            var dom = document.createElement("div");
            dom.setAttribute("id", "_workflow_mask_");
            dom.classList.add("workflow_mask");
            document.body.appendChild(dom);
        }
    }else{
        markDom && markDom.remove();
    }
}


/**
 * 预提交
 * options.callback 回调函数
 * options.onPop 弹出选人回调函数
 * options.formInfos = {
 *     contentDataId : ""
 * }
 * 
 */
WorkFlowDesigner.prototype.preSubmit = function(options){
    
    if(this.isPresubmit){
        //重复点击
        return;
    }
    this.isPresubmit = true;
    
    var _this = this;
    
    //清空相关数据
    this.setInputVal("workflow_newflow_input", "");
    this.setInputVal("workflow_node_peoples_input", "");
    this.setInputVal("workflow_node_condition_input", "");
    this.setInputVal("workflow_last_input", "");
    //this.setInputVal("toReGo", "");
    
    
    
    var context = {};
    var processId = this.jsonFileds.processId;
    
    context["appName"] = this.info.category;
    if(!processId || this.info.state=="edit_current"){
        context["processXml"] = this.getInputVal("process_xml");
    }else{
        context["processXml"] = "";
    }
    context["processId"] = processId;
    context["caseId"] = this.jsonFileds.caseId;
    context["currentActivityId"] = this.info.activityId;
    context["currentWorkitemId"] = this.info.workItemId;
    context["currentUserId"] = this.info.currentUserId;
    context["currentAccountId"] = this.info.currentAccountId;
    context["formData"] =  this.info.formData;
    context["mastrid"] = this.info.formData;
    context["processTemplateId"] = this.info.processTemplateId;
    context["currentWorkItemIsInSpecial"] = this.info.currentWorkItemIsInSpecial;
    context["isValidate"] = "true";
    context["debugMode"] = false;
    context["bussinessId"] = this.info.summaryId;
    context["matchRequestToken"] = this.cacheDatas.matchRequestToken;

    //新建时，表单mastrid为空
    if(options.formInfos && options.formInfos.contentDataId){
        context["formData"] =  options.formInfos.contentDataId;
        context["mastrid"] = options.formInfos.contentDataId;
    }
    

    //回调
    var callback = function(callParams){
        _this.isPresubmit = false;
        options.callback(callParams,_this.isLastPerson,_this.currentNodeLast);
    }
    
    var cpMatchResult1= {};
    cpMatchResult1= new Object();
    cpMatchResult1["allNotSelectNodes"]= [];
    cpMatchResult1["allSelectNodes"]= [];
    cpMatchResult1["allSelectInformNodes"]= [];
    cpMatchResult1["pop"]= false;
    cpMatchResult1["token"]= "";
    cpMatchResult1["last"]= "false";
    cpMatchResult1["alreadyChecked"]= "false";

  //设置流程ID
    this.setProcessId(context);
    
    var obj = {
        "context" : cmp.toJSON(context),
        "cpMatchResult" : cmp.toJSON(cpMatchResult1)
    };

    
    var _postDatas = {"_json_params" : obj}
    
    //预提交失败调用
    function __callbackFail(){
        callback({"result":"false"});
    }
    
    $s.Workflow.transBeforeInvokeWorkFlow({}, _postDatas, errorBuilder({
        
        success : function(cpMatchResult) {
            
            var pop= cpMatchResult["pop"];
            var requestToken= cpMatchResult["token"];
            var canSubmit= cpMatchResult["canSubmit"];
            var circleNodes = cpMatchResult["circleNodes"];
            var isInSpecialStepBackStatus = cpMatchResult["isInSpecialStepBackStatus"];
            
            _this.setInputVal("toReGo",  cpMatchResult["toReGo"] + "");
            
            var dynMIds = cpMatchResult["dynamicFormMasterIds"];
            if(dynMIds){
                _this.setInputVal("dynamicFormMasterIds",  dynMIds + "");
            }
            
            var oneSubProcessJson = cpMatchResult["oneSubProcessJson"];
            if(oneSubProcessJson){
                _this.setInputVal("workflow_newflow_input",  oneSubProcessJson);
            }
            
            if(requestToken && requestToken=="WORKFLOW"){
                
                if(canSubmit=='false'){
                    
                    var cannotSubmitMsg= cpMatchResult["cannotSubmitMsg"];
                    _this.alert(cannotSubmitMsg, __callbackFail);
                    
                 }else{
                     
                     //公文里面的参数
                     var _wLastInput = document.querySelector('#workflow_last_input');
                     if(_wLastInput){
                         // MARK
                         _wLastInput.value= cpMatchResult["last"];
                     }

                     _this.isLastPerson = cpMatchResult["last"] === "true";
                     _this.currentNodeLast = cpMatchResult["currentNodeLast"];
                     
                     // 记录隐藏域
                     _this.setInputVal('workflow_last_input', _this.isLastPerson);
                     _this.setInputVal('workflow_thisNodelast_input', _this.currentNodeLast);
                     
                     var invalidateActivityMap = cpMatchResult["invalidateActivityMap"] || {};
                     var isPass= true;
                     var nodeNameStr = "";
                     var conditon_Str = "";
                     
                     var humenNodeMatchAlertMsg = cmp.parseJSON(cpMatchResult["humenNodeMatchAlertMsg"]);
                     var nodeMatchAlertMsg = "";
                     
                     if(cpMatchResult["allSelectNodes"] && cpMatchResult["allSelectNodes"].length > 0){
                         for(var i = 0, len = cpMatchResult["allSelectNodes"].length; i < len; i++){
                             var value = cpMatchResult["allSelectNodes"][i];
                             var nodeNameStr1= invalidateActivityMap[value];
                             var isNodeValidate= (nodeNameStr1!=null && nodeNameStr1.trim()!="")?true:false;
                             if(isNodeValidate){
                               isPass= false;
                               nodeNameStr += (nodeNameStr!=null && nodeNameStr.trim()=="")?nodeNameStr1:"、"+nodeNameStr1;
                             }
                             
                             //节点匹配弹出信息(目前动态匹配在使用)
                             if(humenNodeMatchAlertMsg){
                           	 var nodeMatchAlertMsg1 = humenNodeMatchAlertMsg[value];
                           	  var humenNodeValidate= (nodeMatchAlertMsg1!=null && nodeMatchAlertMsg1.trim()!="")?true:false;
                           	  if(humenNodeValidate){
                           		  nodeMatchAlertMsg = nodeMatchAlertMsg1;
                           		  isPass = false;
                           	  }
                             }
                             
                             if(conditon_Str == ""){
                                 conditon_Str +="{\"condition\":[";
                             }else{
                                 conditon_Str += ",";
                             }
                             //拼匹配成功的和未成功的
                             conditon_Str +="{\"nodeId\":\""+value+"\",";
                             conditon_Str +="\"isDelete\":\"false\"}";
                         }
                      }
                      if(cpMatchResult["allNotSelectNodes"] && cpMatchResult["allNotSelectNodes"].length>0){
                          var last= cpMatchResult["allNotSelectNodes"].length-1;
                          
                          if(cpMatchResult["allNotSelectNodes"] && cpMatchResult["allNotSelectNodes"].length>0){
                              for(var i = 0, len = cpMatchResult["allNotSelectNodes"].length; i < len; i++){
                                  var value = cpMatchResult["allNotSelectNodes"][i];
                                  
                                  if(conditon_Str == ""){
                                      conditon_Str +="{\"condition\":[";
                                  }else{
                                      conditon_Str += ",";
                                  }
                                  conditon_Str +="{\"nodeId\":\""+value+"\",";
                                  conditon_Str +="\"isDelete\":\"true\"}";
                              };
                            }
                      }
                      if(conditon_Str!=""){
                          conditon_Str +="]}";
                      }
                      
                      _this.setInputVal('workflow_node_condition_input', conditon_Str);
                     
                     
                     var goSubmit = function(){
                        if(pop == true){
                             //回调弹出窗口页面
                             if(options.onPop){
                                 options.onPop();
                             }
                             
                             _this._preSubmitTrue(cpMatchResult, context, callback);
                         }else{
                             _this._preSubmitFalse(cpMatchResult, context, callback);
                         }
                     } 
                     
                     if(!isPass){
                         
                         if(processId!='' && _this.info.workItemId != null && _this.info.workItemId != '-1' && _this.info.workItemId != '0'){
                             _this.releaseWorkflowByAction(processId, 14);
                         }
                         
                         if(nodeMatchAlertMsg){
                        	 cmp.dialog.loading(false);
                        	 _this.alert(nodeMatchAlertMsg,__callbackFail);//动态匹配匹配不到人
                         }else{
                        	 //以下节点不可用，不能处理流程，请联系单位管理员处理
                        	 cmp.dialog.loading(false);
                        	 _this.alert(cmp.i18n("workflow.label.belowNoDedisabled", [nodeNameStr]), __callbackFail);
                         }
                     }else{
                         // 环形回退
                         var isCircle = circleNodes != null && typeof (circleNodes) != 'undefined' && circleNodes.length > 0;
                         if (isCircle) {
                            
                            var _currentWorkItemIsInSpecial = !!_this.info.currentWorkItemIsInSpecial;
                            if(isInSpecialStepBackStatus == 'true' && !_currentWorkItemIsInSpecial){ //流程处于指定回退的状态，但是当前事项不是指定回退的事项，这个是否运行产生环形分支。
                                
                                 
                                if(processId!='' && _this.info.workItemId != null && _this.info.workItemId != '-1' && _this.info.workItemId != '0'){
                                    _this.releaseWorkflowByAction(processId, 14);
                                }
                                
                                cmp.dialog.loading(false);
                                _this.alert(cmp.i18n("workflow.wapi.presend.alert.js"),__callbackFail); //alert:当前流程已经处于指定回退的状态，本次提交会产生环形回退，暂不能提交！
                            
                            }else if (circleNodes.length == 1 && circleNodes[0].submitStyle != "0,1") {
                                var circleBackedNode = circleNodes[0];
                                var targetNodeId = circleBackedNode.nodeId;
                                var submitStyle =  circleBackedNode.submitStyle;
                                var isgo = validateCircleOperation(context,targetNodeId,isInSpecialStepBackStatus,_this.info.workItemId,submitStyle, null, null,goSubmit,_this.stepBackToTargetNode,__callbackFail);
                            } else {
                                
                              //回调弹出窗口页面
                                if(options.onPop){
                                    options.onPop();
                                }
                                
                                var selectCircleBranchDialog = _this.dialog({
                                    initHeader : false,
                                    title : cmp.i18n("workflow.circle.choose.label")/*选择环形回退分支*/,
                                    dir : "right-go",
                                    containerExtClass : "wk-branch-back",
                                    zIndex : (_this.style.zIndex + 2) + "",//层级
                                    initHTML : function(){
                                        return getCircleChooseHtml(circleNodes,_this.info.canTrackWorkflow);
                                    },
                                    onInit : function(){
                                        
                                        var circleRadios = selectCircleBranchDialog.mainDiv.querySelectorAll("input[name='circle_choose_radio']");
                                        if(circleRadios != null){
                                            for(var i = 0; i < circleRadios.length; i++){
                                                circleRadios[i].addEventListener("click", function(){
                                                    changeRadio(this, selectCircleBranchDialog);
                                                })
                                            }
                                        }
                                    },
                                    onShow : function(){
                                    },
                                    bottonConfig : {
                                        buttons :[
                                            {
                                                type : 1,
                                                isPopBtn : true,
                                                label : cmp.i18n("workflow.dialog.cancel.label"),
                                                hander : function(){
                                                    if(processId!='' && _this.info.workItemId != null && _this.info.workItemId != '-1' && _this.info.workItemId != '0'){
                                                        _this.releaseWorkflowByAction(processId, 14);
                                                    }
                                                    
                                                    __callbackFail();
                                                    
                                                    selectCircleBranchDialog.close();
                                                    selectCircleBranchDialog = null;
                                                }
                                            },
                                            { 
                                                label : cmp.i18n("workflow.finished.label"),
                                                hander : function(){
                                                    
                                                    var __targetNodeId = "";
                                                    var ckRadio = selectCircleBranchDialog.mainDiv.querySelector("input[name='circle_choose_radio']:checked");
                                                    __targetNodeId = ckRadio.value;
                                                    
                                                    var __submitStyle = "";
                                                    var ckSubmit = selectCircleBranchDialog.mainDiv.querySelector("input[name='submitStyle_"+ __targetNodeId +"']:checked");
                                                    __submitStyle = ckSubmit.value;
                                                    
                                                    var __isWfTrace = "";
                                                    var isWfTrace = selectCircleBranchDialog.mainDiv.querySelector("input[name='track_"+ __targetNodeId +"']:checked");
                                                    __isWfTrace = isWfTrace.value;
                                                    
                                                    validateCircleOperation(context,__targetNodeId,isInSpecialStepBackStatus,context["currentWorkitemId"],__submitStyle,__isWfTrace,selectCircleBranchDialog,goSubmit,_this.stepBackToTargetNode,__callbackFail);
                                                    
                                                    selectCircleBranchDialog.close();
                                                    selectCircleBranchDialog = null;
                                                }
                                            }
                                        ]
                                     }
                                });
                                _this.wfViewEleId.WF_CIRCLE_DIALOG = selectCircleBranchDialog;
                            }
                            
                         }else{
                             goSubmit();
                         }
                     }
                 }
            }else{
            	cmp.dialog.loading(false);
                _this.alert(cmp.i18n("workflow.alert.network.instability"), __callbackFail);
            }
        },
        error : function(req) {
        	cmp.dialog.loading(false);
            _this.alert("预提交失败", __callbackFail);
        }
    }));
}

/**
 * 设置工作流Id和模板ID
 */
WorkFlowDesigner.prototype.setProcessId = function(context){
    
    if(context.processId && this.info.useTemplateId !== true){
        context.processTemplateId = "";
    }
}



function changeRadio(inputObj, selectCircleBranchDialog){
    
    var _mainDiv = selectCircleBranchDialog.mainDiv;
    
    //将所有按钮置灰
    var inputs = _mainDiv.querySelectorAll("input[name='circle_choose_radio']");
    var ckInput = null;
    for(var i = 0; i < inputs.length; i++){
        var inp = inputs[i];
        if(inp.getAttribute("data-checked") == "checked"){
            ckInput = inp;
            break;
        }
    }
    
    if(inputObj.value == ckInput.value){
        return;//点击的当前
    }

    var subInputs =  _mainDiv.querySelectorAll("input[name='submitStyle_"+inputObj.value + "']");
    inputObj.setAttribute("data-checked", "checked");
    for(var j = 0; j < subInputs.length; j++){
        
        var si = subInputs[j];
        si.disabled = false;
        si.parentNode.classList.remove("cmp-disabled");
    }
    
    var ckSubInputs =  _mainDiv.querySelectorAll("input[name='submitStyle_"+ckInput.value + "']");
    ckInput.setAttribute("data-checked", "");
    for(var k = 0; k < ckSubInputs.length; k++){
        
        var si = ckSubInputs[k];
        si.disabled = true;
        si.parentNode.classList.add("cmp-disabled");
    }
    
}

/**
 * 获取环形流程展现HTML
 */
function getCircleChooseHtml(circleNodes,canTrackWorkflow){

    var _html = '<ul class="cmp-list-content operator">';
    
    var _reGo = cmp.i18n("workflow.special.stepback.label6");
    var _toMe = cmp.i18n("workflow.special.stepback.label7");
    
    for(var i = 0; i < circleNodes.length; i++){
        
        var disable_flag = "",
            cmp_disabled = "",
            input_checked = 'checked="checked"',
            input_checked_flag = 'checked';
            input_checked_sub = 'checked="checked"';
        if(i != 0){
            disable_flag = 'disabled="disabled"';
            cmp_disabled = "cmp-disabled";
            input_checked = '';
            input_checked_flag = "";
        }
        
        _html += '<li class="cmp-list-cell wk-item-li">' +
                '  <div class="cmp-list-cell-img cmp-radio">' +
                '     <input class="select-put" type="radio" data-checked="'+ input_checked_flag +'" ' + input_checked + ' name="circle_choose_radio" ' +
                '         submitStyle="'+circleNodes[i].submitStyle+'" value="'+circleNodes[i].nodeId+'"' + 
                '     />' +
                '  </div>' +
                '<div class="cmp-list-cell-info">' +
                '    <div class="cmp-ellipsis wk-title">'
                +circleNodes[i].nodeName + (circleNodes[i].nodeId == 'start' ? '': '&nbsp;&nbsp;('+circleNodes[i].nodePolicy+')')+
                '   </div>' +
                '    <h5 class="cmp-ellipsis wk-process-mode">' +
                '        <span class="color_nomal">'+circleNodes[i].conditionTitle+'</span>' +
                '    </h5>' +
                '    <div class="wk-select-hand wk-select-circle">' +
                '       <div style="float:left">'+cmp.i18n("workflow.label.submitStyle")+/*提交方式*/'&nbsp;:</div>' +
                '       <div style="float:left">';
        
        if(circleNodes[i].submitStyle.indexOf('0') != -1){
            _html += '<div class="submit-style cmp-radio '+cmp_disabled+'">' +
                     '   <label>'+ _reGo +'</label>' +
                     '   <input class="select-put" type="radio" value="0" ' + input_checked_sub + disable_flag 
                     + ' name="submitStyle_' + circleNodes[i].nodeId + '" onclick="dealWorkflowTraceStyle(1, \'' + circleNodes[i].nodeId + '\');"/>'+
                     '</div>';
            
            input_checked_sub = "";
        }
        
        if(circleNodes[i].submitStyle.indexOf('1') != -1){
            _html += '<div class="submit-style cmp-radio '+cmp_disabled+'">' +
                     '   <label>'+ _toMe +'</label>' +
                     '   <input class="select-put" type="radio" value="1" ' + input_checked_sub + disable_flag 
                     + ' name="submitStyle_' + circleNodes[i].nodeId + '" onclick="dealWorkflowTraceStyle(0, \'' + circleNodes[i].nodeId + '\');"/>'+
                     '</div>';
        }
                
	    var checked1 = (canTrackWorkflow == 1 ) ? " checked=\"checked\" " : "";
	    var checked2;
	    if(checked1 == ""){
	    	checked2 = " checked=\"checked\" ";
	    }
     	  
        var disabled =  (canTrackWorkflow == 1 || canTrackWorkflow == 2) ? " disabled=\"true\" " : "";
        
        _html +='       </div>'+
                '   </div>' +
                '   <div id="workflowTrace_' + circleNodes[i].nodeId + '" class="wk-select-hand wk-select-circle">' +
                '      <div style="float:left">'+cmp.i18n("workflow.label.lczs")+/*流程追溯*/'&nbsp;:</div>' +
                '      <div style="float:left">' +
                '         <div class="submit-style cmp-radio ">' +
                '            <label>'+ cmp.i18n("workflow.label.yes") +'</label>' +
                '            <input class="select-put" type="radio" '+disabled+ checked1 +' value="1" name="track_' + circleNodes[i].nodeId + '" />' +
                '         </div>' +
                '         <div class="submit-style cmp-radio ">' +
                '            <label>'+ cmp.i18n("workflow.label.no") +'</label>' +
                '            <input class="select-put" type="radio" '+disabled+ checked2 +' value="2" name="track_' + circleNodes[i].nodeId + '" />' +
                '         </div>' +
                '      </div>' +
                '   </div>' +
                '</div>' +
                '</li>';
    }
    _html += '</ul>';
    return _html;
}

function dealWorkflowTraceStyle(o, id){
	if(o == 1){
		document.getElementById('workflowTrace_'+id).classList.remove('display_none');
	}else{
		document.getElementById('workflowTrace_'+id).classList.add('display_none');
	}
}

function confirmGo(title, fn, selectCircleBranchDialog,__callbackFail) {
    
    cmp.notification.confirm(title,function(e){ //e==1是/e==0 否
        if(e==1){ //是
            if(selectCircleBranchDialog){
                selectCircleBranchDialog.close();
                selectCircleBranchDialog = null;
            }
            fn();
        }
        else{
            __callbackFail();
        }
    },null, [ cmp.i18n("workflow.dialog.cancel.label"), cmp.i18n("workflow.dialog.ok.label") ],null,null,0)
}


function confirmCircleBackSubmit(msg, dialog, workitemId, targetNodeId,
        submitStyle, context,stepBackToTargetNode,__callbackFail,isWfTrace, isCircleBack) {

    cmp.notification.confirm(msg, function(e) {
        if(e==1){ //是
            if (typeof (dialog) != 'undefined' && dialog != null) {
                dialog.close();
            }

            stepBackToTargetNode(targetNodeId, submitStyle, isCircleBack, isWfTrace);
        }
        else{
            __callbackFail();
        }
    },null,  [ cmp.i18n("workflow.dialog.cancel.label"), cmp.i18n("workflow.dialog.ok.label") ],null,null,0)
}
function validateCircleOperation(context, targetNodeId,isInSpecialStepBackStatus, workitemId, submitStyle, isWfTrace, dialog, goSubmit,stepBackToTargetNode,__callbackFail) {

    var params  =  {};
    params["caseId"] = context["caseId"];
    params["currentSelectedNodeId"] = targetNodeId;
    params["currentSelectedNodeName"] = "";
    params["currentStepbackNodeId"] = context["currentActivityId"];
    params["initialize_processXml"] = context["processXml"];
    params["permissionAccountId"] = context["currentAccountId"];
    params["configCategory"] = "collaboration";
    params["processId"] = context["processId"];
    var isCircleBack = "1"; //是否环形回退  1：是，0：否
    $s.Workflow.validateCurrentSelectedNode({},params,errorBuilder({
        success : function(rs){

            if (rs[0] == 'true') {
                if (isInSpecialStepBackStatus == 'true') {
                    if (rs[2] == 'true' || rs[8] == 'true') {
                	/*流程处于【直接提交给我】状态，只能选择【直接提交给我】的操作方式，但当前节点与被选择节点之间存在分支条件或子流程，因此不能环形回退，是否进行提交操作，向后继续流转？*/
                          
                        confirmGo(cmp.i18n('workflow.special.circleback.alert7.js'), goSubmit,dialog,__callbackFail);
                        return;
                    } else {
                        if (submitStyle.indexOf("1") == -1) {
                            /*多次指定回退状态下，提交方式只允许选择“直接提交给我”，环形分支未配置此种提交方式，系统将自动采用“直接提交给我”的方式，是否继续？*/
                            
                            confirmCircleBackSubmit(cmp.i18n("workflow.special.circleback.alert8.js"),
                                    dialog, workitemId, targetNodeId, "1", context,stepBackToTargetNode,__callbackFail,isWfTrace,isCircleBack);
                            return;
                        }
                    }
                } else {
                    if (rs[2] == 'true' || rs[8] == 'true') {
                        if (submitStyle.indexOf("0") == -1) {
                            /*当前节点与回退节点间有分支条件或触发子流程节点，只能选择流程重走，但环形分支没有配置流程重走，系统将自动采用流程重走的方式，是否继续？*/
                              
                            confirmCircleBackSubmit(cmp.i18n("workflow.special.circleback.alert12.js"),
                                    dialog, workitemId, targetNodeId, "0", context,stepBackToTargetNode,__callbackFail,isWfTrace,isCircleBack);
                            return;
                        }
                    }
                }
            }
            if (rs[14] == 'true') {
                confirmGo(cmp.i18n('workflow.special.circleback.alert15.js'), goSubmit,dialog,__callbackFail);
            }else if (rs[13] == 'true') {
                confirmGo(cmp.i18n('workflow.special.circleback.alert13.js'), goSubmit,dialog,__callbackFail);
            }
            else if (rs[12] == 'true') { // 该流程的子流程已核定通过，不能回退！

                confirmGo(cmp.i18n('workflow.special.circleback.alert4.js'), goSubmit,dialog,__callbackFail);

            } else if (rs[11] == 'true') {
                confirmGo(cmp.i18n('workflow.special.circleback.alert11.js'), goSubmit,dialog,__callbackFail);// 节点匹配不到人，不能回退!
            } else if (rs[3] == 'true') {// 有封发节点

                confirmGo(cmp.i18n('workflow.special.circleback.alert1.js'), goSubmit,dialog,__callbackFail);// 被回退的節點與當前處理節點之間有已辦的交換類型節點，不能選擇！

            } else if (rs[4] == 'true') {// 有核定节点

                confirmGo(cmp.i18n('workflow.special.circleback.alert2.js'), goSubmit,dialog,__callbackFail);

            }else if(rs[15] == 'true'){
                /* 被選擇的節點與當前處理節點之間有設置為不允許回退已辦的節點，不能選擇！ */
                confirmGo(cmp.i18n("workflow.special.circleback.alert16.js"), goSubmit,dialog,__callbackFail);
            }  else if(rs[16] == 'true'){
                /* 指定回退不能越过阻塞的超级节点！ */
                confirmGo(cmp.i18n('workflow.special.circleback.alert17.js'), goSubmit,dialog,__callbackFail);
            } else if (rs[5] == 'true') {// 有表单审核节点

                confirmGo(cmp.i18n('workflow.special.circleback.alert3.js'), goSubmit,dialog,__callbackFail);
            } else if (rs[6] == 'true') {// 有子流程结束节点
                if (rs[9] == 'true') { 
                    // 被回退节点含子流程且已结束不允许被回退！

                    confirmGo(cmp.i18n('workflow.special.circleback.alert4.js'), goSubmit,dialog,__callbackFail);
                } else {
                    // 被回退 的节点与当前处理节点之间有子流程触发节点，且触发的子流程已结束,不能选择！

                    confirmGo(cmp.i18n('workflow.special.circleback.alert5.js'), goSubmit,dialog,__callbackFail);
                }
            } else if (rs[7] == 'true') {// 当前流程为新流程，不允许选择开始节点进行指定回退操作！

                confirmGo(cmp.i18n('workflow.special.circleback.alert6.js'), goSubmit,dialog,__callbackFail);
            } else {

                if (typeof (dialog) != 'undefined' && dialog != null) {
                    dialog.close();
                }

               
                stepBackToTargetNode(targetNodeId, submitStyle, isCircleBack, isWfTrace);
            }
        }
    }))
    
    
}
/**
 * 解除流程锁
 * @processId:流程ID
 * @currentUserId:当前登录用户ID
 * @action 14: preSendOrHandleWorkflow时
 * 返回String[2]:String[0]:"true":表示解锁成功,"false":表示解锁失败;String[1]:当前占用锁的操作类型提示信息
 */
WorkFlowDesigner.prototype.releaseWorkflowByAction = function(processId,action){
    
    try{
        
        var params = {};
        params.processId = processId;
        //params.currentUserId = currentUserId;
        params.action = action;
        
        $s.Workflow.unLockH5Workflow(params, errorBuilder({
            success : function(result) {
                
            }
        }));
      }catch(e){
          //this.alert(e.message);
      }
      
}

/**
 * 工作流预提交没有流程和分支选择
 */
WorkFlowDesigner.prototype._preSubmitFalse = function(cpMatchResult, context, callback){

    //填充数据
    this.doWorkflowValue(cpMatchResult);
    
    var caseId = context["caseId"];
    if(caseId==null || caseId.trim()=='' || caseId.trim()=='-1'){//流程发起时
        //new
    }else if(caseId!=null && caseId.trim()!='' && caseId.trim()!='-1' && context["currentActivityId"]=='start'){
        //new
    }else{//流程处理时
        //finish
    }
    
    var processId = this.jsonFileds.processId;
    var workitemId = this.info.workItemId;
    
    if(processId!='' && workitemId!=null && workitemId!='-1' && workitemId!='0'){
        //this.releaseWorkflowByAction(processId, 14);
    }
    
    if(callback){
        callback({"result":"true"});
    }
}


/**
 * 工作流预提交需要选择分支/人员的时候
 */
WorkFlowDesigner.prototype._preSubmitTrue = function(cpMatchResult, context, callback){

    var _this = this;
    
    //可能二次预提交， 这里清空第一次预提交生成的DOM
    if(_this.wfViewEleId.WF_BRANCH_DIALOG != null){
        _this.wfViewEleId.WF_BRANCH_DIALOG.close();
        _this.wfViewEleId.WF_BRANCH_DIALOG = null;
    }
    
    if(_this.wfViewEleId.WF_SELECT_MEMBER_DIALOG != null){
        _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.close();
        _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG = null;
    }
    
    
    var hasSubProcess = cpMatchResult["hasSubProcess"];
    var dialogTitle = "";
    if(hasSubProcess){
      dialogTitle= cmp.i18n("workflow.presubmit.node.choose.person.label");  //选择节点执行人/新流程
    }else{
      dialogTitle= cmp.i18n("workflow.presubmit.choose.person.label");   //选择执行人;
    }
    
    
    //重置缓存数据
    this.wfSelectInfo.needSelectPeopleNodeNum = 0;
    this.wfSelectInfo.realSelectPeopleNodeNum = 0;
    //分支选人缓存，解决节点人数多是卡死的问题
    this.WF_SELECT_MEMBER_DIALOG_DATAS = {}
    //分支选人，已选人员缓存，主要用于回填
    this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED = {}

    
    var condtionMatchMap= cpMatchResult["condtionMatchMap"] || {};
    var invalidateActivityMap= cpMatchResult["invalidateActivityMap"] || {};
    var humenNodeMatchAlertMsg = cmp.parseJSON(cpMatchResult["humenNodeMatchAlertMsg"]);
    
    var has1= false;//分支标识
    var has3= false;
    
    var isBranchShowSuccess= false;
    var isBranchShowFail= false;
    var isHasConditionType2= true;
    
    //所有选人的内容
    var selectPeopleViewHTML = "";
    
    //流程分支input模板， 每个需要选择分支的前面 的input
    var branchInputTpl = '<input class="select-put <%=this.classSelector%>" ' +
            ' type="<%=this.type%>" '+
            ' id="<%=this.id%>"' +
            ' name="<%=this.name%>"' +
            ' na="<%=this.na%>"' +
            ' processMode="<%=this.processMode%>"' +
            ' needPeopleTag="<%=this.needPeopleTag%>"' +
            ' isInform="<%=this.isInform%>"' +
            ' nodeNamee="<%=this.nodeNamee%>"' +
            ' isForce="<%=this.isForce%>"' +
            ' defaultShow="<%=this.defaultShow%>"' +
            ' conditionType="<%=this.conditionType%>"' +
            ' needSelectPeople="<%=this.needSelectPeople%>"' +
            ' <%=this.others%>' +
            '/>';
    
    //一条数据模板
    var branchItemTpl = '<li id="<%=this.id%>" class="wf-list-cell wk-item-li <%=this.dispaly_none%> <%=this.branchType%>">' +
    '  <div class="wf-list-cell-img cmp-checkbox cmp-left">' +
    '    <%=this.inputStr%>' +
    '  </div>' +
    '<div class="wf-list-cell-info <%=this.selectPeopleClass%>" ' +
    '              selectPeopleId="<%=this.selectPeopleId%>"' +
    '              selectPeopleDialogTitle="<%=this.selectPeopleDialogTitle%>"' +
    '              selectType="<%=this.selectType%>"' +
    '              canSelectOrgMember="<%=this.canSelectOrgMember%>"' +
    '              selectStyle="<%=this.selectStyle%>"' +
    '              selectId="<%=this.selectId%>"' +
    '              selectInputId="<%=this.selectInputId%>"' +
    '          >' +
    '    <div class="cmp-ellipsis wk-title"><%=this.toNodeName%></div>' +
    '    <h5 class="cmp-ellipsis wk-process-mode">' +
    '        <%=this.processModeName%>' +
    '        <span class="<%=this.matchResultNameClass%>"><%=this.matchResultName%></span>' +
    '    </h5>' +
    '   <% if(this.conditionTitle){%>' +
    '    <h5 class="wk-conditionTitle">' +
    '        <span class="conditionTitle_container wf-breakword"><%=this.conditionTitle%></span>' +
    '    </h5>' +
    '   <%}%>' +
    '   <% if(this.conditionDesc){%>' +
    '    <h5 class="cmp-ellipsis wk-process-mode">' +
    '        <%=this.conditionDesc%>' +
    '    </h5>' +
    '   <%}%>' +
    '<%=this.selectOperator%>'+
    '<%=this.multipleSerialHTML%>'+
    '</div>' +
    '</li>';
    
  //分支匹配选择人员
    var selectPeopleContentTpl = '<h5 class="wk-select-hand wk-select-operator">' +
          '   <span class="cmp-icon see-icon-v5-common-node-operator-fill"></span>' +
          '   <span id="node_<%=this.toNodeId%>_peoples" name="node_<%=this.toNodeId%>_peoples">'+cmp.i18n("workflow.label.nodeOperator")/*节点执行人*/+':</span>' +
          '   <span id="manual_select_node_id<%=this.toNodeId%>_name"><%=this.label%></span>'+
          '   <input type="hidden" value="<%=this.posts%>" id="manual_select_node_id<%=this.toNodeId%>_post"/>'+
          '   <input type="hidden" value="<%=this.value%>" id="manual_select_node_id<%=this.toNodeId%>" <%=this.multimodel%> name="manual_select_node_id<%=this.toNodeId%>" inputName="<%=this.toNodeName%>'+cmp.i18n("workflow.label.operatorEmpty")/*执行人为空，请选择！*/+'"/>' +
          '</h5>';
    
    var multipleSerialTpl = '<div class="wk-select-hand wk-select-circle wk-select-operator not-click-selector">'
                            + '  <input type="hidden" id="manual_select_node_id<%=this.toNodeId%>_multi_add"/>'
                            + '<%if(this.canExecuteNormal){%>'
                            + '  <div class="submit-style cmp-radio radio-div-selector <%=this.disabledClass%>" style="margin-left:0;">'
                            + '     <label>' + cmp.i18n("workflow.label.mutiConcurrent")/*同时执行*/+ '</label>'
                            + '     <input class="select-put radio-selector" type="radio" <%=this.disabled%> <%if(!this.canOrderExecute){%>checked="checked"<%}%>' 
                            + '            name="multiple_radio_name_<%=this.toNodeId%>"'
                            + '            value="0" nodeid="<%=this.toNodeId%>" onclick=""/>'
                            + '  </div>'
                            + '<%}%>'
                            + '<%if(this.canOrderExecute){%>'
                            + '  <div class="submit-style cmp-radio radio-div-selector <%=this.disabledClass%>" <%if(!this.canExecuteNormal){%>style="margin-left:0;"<%}%>>'
                            + '     <label>' + cmp.i18n("workflow.label.mutiSerial")/*串发执行*/+ '</label>'
                            + '     <input class="select-put radio-selector" type="radio" <%=this.disabled%> checked="checked"'
                            + '            name="multiple_radio_name_<%=this.toNodeId%>"'
                            + '            value="1" nodeid="<%=this.toNodeId%>" onclick=""/>'
                            + '  </div>'
                            + '<%}%>'
                            + '  <div <%if(!this.canSortMembers){%>singleAdd="true"<%}%> nodeid="<%=this.toNodeId%>" canSelectOrgMember="<%=this.canSelectOrgMember%>" class="submit-style radio-div-selector multi-sort-add <%=this.disabledClass%>">'
                            + '<%if(this.canSortMembers){%>'
                            + '     <span style="border-left: solid 1px;padding-left: 10px;">' + cmp.i18n("workflow.label.sort")/*排序*/+ '<%if(this.canSelectOrgMember){%>&nbsp;&amp;&nbsp;' + cmp.i18n("workflow.label.add")/*新增*/+ '<%}%>&nbsp;</span>'
                            + '<%}else{%>'
                            + '     <span style="color:#3aadfb;vertical-align:middle" class="cmp-icon m3-icon-add-round"></span><span style="vertical-align:middle;">&nbsp;' + cmp.i18n("workflow.label.add")/*新增*/+ '&nbsp;</span>'
                            + '<%}%>'
                            + '  </div>'
                            + '</div>';

    
    
    //修正样式的两个标记
    var hashiddenInput = false;
    var hasCheckboxInput = false;
    
    
    
    var wfBranchHTML = '';//流程分支HTML
    for (var key in condtionMatchMap) {
      
      var valueObject = condtionMatchMap[key];
      
        //获取数据区域
      var conditionType= valueObject["conditionType"];
      var processMode= valueObject["processMode"];

      var canOrderExecute = valueObject["canOrderExecute"];//多人执行是否可以进行串行执行
      var canExecuteNormal = valueObject["canExecuteNormal"];//多人执行是否可以全部执行
      var canSelectOrgMember = valueObject["canSelectOrgMember"];//是否可以选择组织模型数据
      
      var hasMultipleSerial = canOrderExecute === "true" && processMode == "multiple";
      if(processMode != "multiple"){
          canExecuteNormal = "false";
      }
      
      var processModeName= valueObject["processModeName"];
      var hasBranch= valueObject["hasBranch"];
      var isDefaultShow= valueObject["defaultShow"];
      var matchResult= valueObject["matchResult"];
      var matchResultName= valueObject["matchResultName"];
      
      
      var needSelectPeople= valueObject["needSelectPeople"];
      var peoples= valueObject["peoples"];
      var hand= valueObject["hand"];
      var fromNodeId= valueObject["fromNodeId"];
      var toNodeId= valueObject["toNodeId"];
      var toNodeName= _this.escapeSpecialChar(valueObject["toNodeName"]);
      
      _this.wfSelectInfo.nodeIdAndNodeNameMap[toNodeId]= toNodeName;
      
      var conditionId= valueObject["id"];
      var isInformNode= valueObject["toNodeIsInform"];
      
//      var conditionDesc= _this.escapeSpecialChar(valueObject["conditionDesc"]+"", true);
//      conditionDesc = conditionDesc.replace(/(\r\n*|\r*\n)/g,'<br/>');
//      conditionDesc = conditionDesc.trim();
      //描述后台传回的结果为html，无需再转义修改
      var conditionDesc= valueObject["conditionDesc"];
      var conditionTitle= _this.escapeSpecialChar(valueObject["conditionTitle"] || "");
      var nodePolicy = _this.escapeSpecialChar(valueObject["nodePolicy"]);
      var na= valueObject["na"];
      var needPeopleTag= valueObject["needPeopleTag"];
      
      //校验数据是否有效数据
      var invalidateActivityMapStr= invalidateActivityMap[toNodeId];
      var isNodeValidate= (invalidateActivityMapStr != null && invalidateActivityMapStr.trim()!="")?true:false;
      
      var alertMsg = humenNodeMatchAlertMsg?humenNodeMatchAlertMsg[toNodeId]:"";
      var humenNodeMatchPass = (alertMsg!=null && alertMsg.trim()!="")?true:false;
      isNodeValidate = isNodeValidate || humenNodeMatchPass;
      if(humenNodeMatchPass){
      	needSelectPeople = false;
      	needPeopleTag = false;
      }
      if(hasBranch//分支条件
          || hand//需要手工选择
          || needSelectPeople//需要选择人员
          ){
        
        if(hasBranch && conditionType!='2'){
          has3= true;
        }
        
        has1= true;
        
        var inputData = {
                "na" : na,
                "processMode" : processMode,
                "needPeopleTag" : needPeopleTag,
                "isInform" : isInformNode,
                "nodeNamee" : toNodeName,
                "isForce" : !hand,
                "defaultShow" : isDefaultShow,
                "conditionType" : conditionType,
                "needSelectPeople" : needSelectPeople,
                
                "id" : toNodeId,
                "name" : toNodeId,
                "type" : "checkbox",
                "others" : "",
                
                "classSelector" : "branch_li_input_to_select branch_li_input"
        }
        var itemMap = {
                inputStr : "",
                toNodeName : "",
                processModeName : "",
                matchResultName : "",
                conditionTitle : "",
                conditionDesc :"",
                matchResultNameClass : "color_nomal",
                id : "",
                branchType : "branch_li",//分支选择类型
                dispaly_none : "",
                name : "",
                selectOperator : "",
                multipleSerialHTML : "",
                
                "selectPeopleId" : "",
                "selectPeopleClass" : "",
                "selectPeopleDialogTitle" : "",
                "canSelectOrgMember" : canSelectOrgMember,//是否允许选择组织模型数据
                "selectType" : "",
                "selectStyle" : "",
                "selectId" : "",
                "selectInputId" : toNodeId
            }
        
      //串发执行数据
        var multipleSerialData = {
            "toNodeId": toNodeId,
            "orgIds": "",
            "orgNames": "",
            "posts" : "",
            "disabledClass" : "",
            "disabled" : "",
            "canExecuteNormal" : canExecuteNormal === "true",
            "canSelectOrgMember" : canSelectOrgMember === "true",
            "canOrderExecute" : canOrderExecute === "true",
            "canSortMembers" : hasMultipleSerial
        }
        
        var _hasInput = true;
        if( hand && matchResult){
            
          isBranchShowSuccess= true;
          
          if(conditionType!='2'){
            isHasConditionType2 = false;
          }
          
          inputData["others"] = 'checked="checked"';
          
          if(needSelectPeople){
              _this.wfSelectInfo.needSelectPeopleNodeNum++;
          }
          
        }else if( hand && !matchResult ){
            
          if(!isDefaultShow){
              itemMap["dispaly_none"] = "display_none";
              itemMap["matchResultNameClass"] = "color_error";
              
              isBranchShowFail= true;
          }
          
          if(conditionType!='2'){
            isHasConditionType2= false;
          }
          
          multipleSerialData.disabledClass = "cmp-disabled";
          multipleSerialData.disabled = "disabled";
          
        }else if(!hand && matchResult){
            
          isBranchShowSuccess= true;
          
          if(hasBranch){
              inputData["others"] = ' checked="checked" disabled="disabled" ';
          }else{
              inputData["type"] = "hidden";
              
              inputData["id"] = "common_branch_nodes";
              inputData["name"] = "common_node_" + toNodeId;
              inputData["classSelector"] = "branch_li_input";
              inputData["others"] = " value='"+toNodeId+"' isSelect='true'";
          }
          
          if(needSelectPeople){
              _this.wfSelectInfo.needSelectPeopleNodeNum++;
          }
          
        }else if(!hand && !matchResult){
          if(hasBranch){
              
            isBranchShowFail= true;
            
            itemMap["dispaly_none"] = "display_none";
            itemMap["matchResultNameClass"] = "color_error";
            inputData["others"] = 'disabled="disabled"';
            
            multipleSerialData.disabledClass = "cmp-disabled";
            multipleSerialData.disabled = "disabled";
            
          }else {
              _hasInput = false;
          }
        }

        //样式修改正参数赋值
        if(!_hasInput || inputData["type"] == "hidden"){
            hashiddenInput = true;
        }else{
            hasCheckboxInput = true;
        }
        
        var htmlContent = "";
        if (_hasInput) {
            htmlContent = cmp.tpl(branchInputTpl, inputData);
        }
        
        // input框数据准备完成
        itemMap.inputStr = htmlContent;

        
        var toNodeNameHtml= toNodeName;
        if(isNodeValidate){
          toNodeNameHtml= "&nbsp;&nbsp;<span class='color_error'>"+toNodeName+"</span>";
        }
        if(nodePolicy && nodePolicy!=''){
          toNodeNameHtml += '&nbsp;&nbsp;('+nodePolicy+')';
        }else{
          toNodeNameHtml += '&nbsp;';
        }
        
        itemMap.toNodeName = toNodeNameHtml;
        if(processModeName){
            itemMap.processModeName = '<span>'+processModeName+'</span>&nbsp;&nbsp;';
        }
        
        var tempMatchResultName = "";
        if (hasBranch) {
            tempMatchResultName = matchResultName;
        }
        itemMap.conditionTitle = conditionTitle;
        if(conditionDesc){
            itemMap.conditionDesc = '<span class="conditionDesc">'+conditionDesc+'</span>';
        }
        itemMap.matchResultName = tempMatchResultName;
        itemMap.id = "workflow_select_people_or_branch_template_ready_" + toNodeId;
        itemMap.name = "workflow_select_people_or_branch_template_ready";
        
        
        //是否需要进行选人
        var hasSelectPeople = true;//标记是否有选人内容
        var selectPeopleContentMap = {
                "toNodeId" : toNodeId,
                "toNodeName" : toNodeName,
                "value" : "",
                "posts" : "",
                "multimodel" : "",
                "label" : cmp.i18n("workflow.label.operatorEmpty")//执行人为空，请选择！
            }
        
        if(hasMultipleSerial){
            //串发执行
            selectPeopleContentMap.multimodel = 'multimodel="1"';
        }else{
            selectPeopleContentMap.multimodel = 'multimodel="0"';
        }
        
        if(needSelectPeople){
            
            itemMap.selectPeopleClass = "branch_li_people";
            
            var _pType = "N";
            if (processMode == "single") {// 单人,调用选人界面
                _pType = "1";
            }
            
            itemMap.selectType =  _pType;
            var tempSelectId = "manual_select_node_id" + toNodeId;
            itemMap.selectId = tempSelectId;
            
            if (null == peoples || peoples.length == 0) {// 节点上没有匹配到人员
                
                //直接弹出选人界面进行选人
              //见choosePerson
                
              //不需要再从组织模拟选人了
                canSelectOrgMember = "false";
                
                
            } else {// 节点上匹配到人员

                var pSize = peoples.length;
                
                if(pSize == 1){//只有一个人
                    itemMap.selectPeopleClass = "";
                    
                    var a_people = peoples[0];
                    var people_name = _this.escapeSpecialChar(a_people["name"]);
                    multipleSerialData.orgIds = a_people["id"];
                    multipleSerialData.orgNames = a_people["name"];
                    multipleSerialData.posts = a_people["postName"];
                    
                    selectPeopleContentMap.posts = a_people["postName"];
                    selectPeopleContentMap.label = people_name;
                    selectPeopleContentMap.value = a_people["id"];
                    
                }else{
                    
                    var inputType = "radio";
                    
                    var tempSelectPeopleId = "BRANCH_SELECT_PEOPLE_" + toNodeId;
                    selectPeopleViewHTML += '<ul style="overflow:auto" selectId="'+tempSelectId+'" id="'+tempSelectPeopleId+'" class="cmp-list-content operator display_none">';
                    
                    itemMap.selectPeopleId = tempSelectPeopleId;
                    
                    
                    if (processMode == "single") {
                        // 单人，下拉选择
                        var selectStyle = "select_list";
                        itemMap.selectStyle =  selectStyle;
                        inputType = "radio";
                        itemMap.selectPeopleDialogTitle = cmp.i18n("workflow.presubmit.signle.person.label"); //单人执行
                        
                    } else {// 多人，弹出人员选择列表

                        var selectStyle = "select_list";
                        itemMap.selectStyle =  selectStyle;
                        inputType = "checkbox";
                        itemMap.selectPeopleDialogTitle = cmp.i18n("workflow.presubmit.mutile.person.label"); //多人执行
                    }
                    
                    var mDatas = [];
                    for (var i = 0; i < pSize; i++) {
                        var a_people = peoples[i];
                        if (a_people != null) {
                            var people_id = a_people["id"];
                            var people_name = a_people["name"];
                            var m = {
                                    inputType : inputType,
                                    inputName : "BRANCH_PEOPLE_INPUT_NAME" + toNodeId,
                                    name : a_people["name"],
                                    id : a_people["id"],
                                    post : a_people["postName"]
                            }
                            mDatas.push(m);
                        }
                    }
                    
                    _this.WF_SELECT_MEMBER_DIALOG_DATAS[tempSelectId] = mDatas;
                    //selectPeopleViewHTML += cmp.tpl(WorkFlowDesignerTpls.SELECT_MEMBER_LI_TPL, mDatas);
                    
                    selectPeopleViewHTML += "</ul>";
                }
            }
            
            var selectpPeopleHtml = cmp.tpl(selectPeopleContentTpl, selectPeopleContentMap);
            itemMap.selectOperator = selectpPeopleHtml;
            
        }else{//不需要选人
              var htmlContent = "";
              if (null != peoples && peoples.length == 1) {

                  var a_people = peoples[0];
                  var people_name = _this.escapeSpecialChar(a_people["name"]);
                  
                  selectPeopleContentMap.label = people_name;
                  selectPeopleContentMap.value = a_people["id"];
                  selectPeopleContentMap.posts = a_people["postName"];
                  
                  multipleSerialData.orgIds = a_people["id"];
                  multipleSerialData.orgNames = a_people["name"];
                  multipleSerialData.posts = a_people["postName"];
                  
                  var selectpPeopleHtml = cmp.tpl(selectPeopleContentTpl, selectPeopleContentMap);
                  itemMap.selectOperator = selectpPeopleHtml;
                  
              } else {
                  
                  //TODO 这里和PC不一致， 后续查明原因
                  if(na=="2"){//无人是流程自动跳过
                      
                    }else{
                      
                    }
                  hasSelectPeople = false;
              }
        }
        
        if (hasSelectPeople) {
            //如果需要选人做交互设置
        }
        
      //多人执行，串发执行设置
        if(processMode == "single"){
            if(canSelectOrgMember === "true"){
                itemMap.multipleSerialHTML = cmp.tpl(multipleSerialTpl, multipleSerialData);
            }
        }else if(processMode == "multiple"){
            if(hasMultipleSerial || canSelectOrgMember === "true"){
                multipleSerialData.canSortMembers = true;
                itemMap.multipleSerialHTML = cmp.tpl(multipleSerialTpl, multipleSerialData);
            }
        }
        
        //拼装好了选择的字符串
        var itemStr = cmp.tpl(branchItemTpl, itemMap);
        wfBranchHTML += itemStr;
      }
    }
    
    
  //子流程部分
    var hasSubProcess= cpMatchResult["hasSubProcess"];
    var has2= false;
    
    

    //子流程选人模板
    var selectSubPeopleContentTpl ='  <h5 class="wk-select-hand wk-select-operator">' +
            '    <span class="cmp-icon see-icon-v5-common-node-operator-fill"></span>' +
            '    <span id="senderId_<%=this.subProcessId%>Name" name="senderId_<%=this.subProcessId%>Name">'+cmp.i18n("workflow.label.sender")/*发起者*/+':</span>'+
            '    <span id="senderId_<%=this.subProcessId%>_name"><%=this.label%></span>'+
            '    <input type="hidden" value="<%=this.value%>" id="senderId_<%=this.subProcessId%>" name="senderId_<%=this.subProcessId%>" inputName="<%=this.subProcessTempleteName%>"/>' +
            '  </h5>';
    var wfSubWfHTML = '';
    
    if(hasSubProcess){
      var subProcessMatchMap= cpMatchResult["subProcessMatchMap"];
      var index = 0;
      for(var key in subProcessMatchMap){
          
          var valueObject = subProcessMatchMap[key];
        has2= true;
        index++;
        var isForce= valueObject["force"];
        var subProcessSender= valueObject["subProcessSender"];
        var peoples= valueObject["peoples"];
        var subProcessTempleteName= valueObject["subProcessTempleteName"];
        var triggerResult= valueObject["triggerResult"];
        var triggerResultName= valueObject["triggerResultName"];
        var subProcessId= valueObject["id"];
        var conditionTitle= _this.escapeSpecialChar(valueObject["triggerConditionTitle"]||"");
        
        var disableStr= "";
        var checkedStr= "";
        if(isForce){
          disableStr= " disabled='disabled' ";
        }
        if(triggerResult){
          checkedStr= " checked='checked' ";
        }

        //修正样式参数
        hasCheckboxInput = true;
        
        var htmlContent = "<input class='select-put subprocess_li_input'";
        htmlContent += " type='checkbox' "+checkedStr+" "+disableStr+" id='"+subProcessId+"' name='"+subProcessId+"'";
        htmlContent += " isForce='"+isForce+"' triggerResult='"+triggerResult+"' />";
        
      //一项内容的模板
        var itemMap = {
            inputStr : htmlContent,
            toNodeName : subProcessTempleteName,
            processModeName : "",
            matchResultName : triggerResultName,
            conditionTitle : conditionTitle,
            matchResultNameClass:"color_nomal",
            id : "workflow_select_subprocess_template_ready_"+subProcessId,
            branchType : "subprocess_li",
            dispaly_none : "",
            name : "workflow_select_subprocess_template_ready",
            selectOperator : "",
            multipleSerialHTML : "",
            
            "selectPeopleId" : "",
            "selectPeopleClass" : "",
            "selectPeopleDialogTitle" : cmp.i18n("workflow.presubmit.choose.person.label"),//选择执行人
            "selectType" : "",
            "selectStyle" : "",
            "selectId" : "",
            "selectInputId" : subProcessId
        }
        
        
        var subDisplay= "none";
        if(triggerResult){
          subDisplay= "block";
        }
        
        var selectSubPeopleContentMap = {"subProcessId" : subProcessId, 
                                         "subProcessTempleteName" : subProcessTempleteName,
                                         "value" : "",
                                         "label" : ""
                                         }
        
        itemMap.selectPeopleClass = "branch_li_people";
        
        var pType = 1;
        itemMap.selectType =  pType;
        var tempSelectId = "senderId_"+subProcessId;
        itemMap.selectId = tempSelectId;
        
        if(null== peoples || peoples.length== 0){//弹出选人界面
          
          //直接弹出选人界面进行选人
            //见choosePerson
            
        }else{//下拉选择
          
          var pSize= peoples.length;
          
          if(pSize == 1){
              
              itemMap.selectPeopleClass = "";
              var a_people= peoples[0];
              var people_name = _this.escapeSpecialChar(a_people["name"]);
              selectSubPeopleContentMap.label = people_name;
              selectSubPeopleContentMap.value = a_people["id"];
              
          }else{
              
              var selectStyle = "select_list";
              var tempSelectPeopleId = "SUBPPROCCESS_SELECT_PEOPLE_" + subProcessId;
              selectPeopleViewHTML += '<ul style="overflow:auto" selectId="'+tempSelectId+'" id="'+tempSelectPeopleId+'" class="cmp-list-content operator display_none">';
              
              itemMap.selectPeopleId = tempSelectPeopleId;
              itemMap.selectStyle =  selectStyle;
              
              var mDatas = [];
              for (var i = 0; i < pSize; i++) {
                  var a_people = peoples[i];
                  if (a_people != null) {
                      var people_id = a_people["id"];
                      var people_name = a_people["name"];
                      var m = {
                              inputType : "radio",
                              inputName : "SUBPPROCCESS_PEOPLE_INPUT_NAME" + subProcessId,
                              name : a_people["name"],
                              id : a_people["id"],
                              post : a_people["postName"]
                      }
                      mDatas.push(m);
                  }
              }
              
              _this.WF_SELECT_MEMBER_DIALOG_DATAS[tempSelectId] = mDatas;
              //selectPeopleViewHTML += cmp.tpl(WorkFlowDesignerTpls.SELECT_MEMBER_LI_TPL, mDatas);
              
              selectPeopleViewHTML += "</ul>";
          }
        }
        
        var subSelectpPeopleHtml = cmp.tpl(selectSubPeopleContentTpl, selectSubPeopleContentMap);
        itemMap.selectOperator = subSelectpPeopleHtml;
        
      //拼接HTML
        var itemStr = cmp.tpl(branchItemTpl, itemMap);
        wfSubWfHTML += itemStr;
      }
    }
    

    
    var autoBranchHTML = '';
    
    var SHOW_FIELD_CONDITION_ID = 'SHOW_FIELD_CONDITION_' + (new Date()).getTime();
    
    if(has3){//有分支

        var upLabel = cmp.i18n("workflow.presubmit.branch.hide");
        var downLabel = cmp.i18n("workflow.presubmit.branch.show");
        
        
        var showType= "0", showMsgFlag= upLabel, htmlFlag = true;
        if(isBranchShowSuccess && isBranchShowFail){
          showType= "0";
          showMsgFlag = downLabel;
        }else if(isBranchShowFail){
          showType= "1";
        }else if(isBranchShowSuccess && !isHasConditionType2){
          showType= "1";
        }else{
            htmlFlag = false;
        }
        
        if(htmlFlag){
            autoBranchHTML = '<li style="text-align:center" data-type="'+showType+'" id="' + SHOW_FIELD_CONDITION_ID + '">'+
                            '<span upLabel="' + upLabel +'" ' +
                            ' downLabel="' + downLabel + '" '+
                            ' class="wk_show_hide_branch_text">' + showMsgFlag + '</span></li>';
        }
    }
    
    
    //设置底部显示
     var selectPeopleBottonHTML = '<div id="selected-operator-scroll" currentUL="" class="selected-operator display_none">' + 
                                     '<div data-selectedNum="0" id="selected-operator-ul" class="selected-operator-container">'+
                                     '</div>'+
                                 '</div>';
    
     var processModeTitle = "";
     if(pType=="1") {//单人执
    	 processModeTitle = cmp.i18n("workflow.presubmit.signle.person.label");
     } else if(pType=="N") {//全体执行
    	 
     }
     
    //分支选人dialog
    var selectPeopleDialog = this.dialog({
        
        initHeader : false,
        title : cmp.i18n("workflow.presubmit.node.choose.person1.label"), //选择执行人/发起人
        dir : "right-go",
        zIndex : (_this.style.zIndex + 2) + "",//层级
        show : false,
        hideType : "hide",
        title: "",
        onInit : function(){
            
            if(selectPeopleViewHTML){
                //初始化头像
                cmp("#" + selectPeopleDialog.mainDiv.getAttribute("id")).on("click", "ul", function(event){
                    
                    var targetEle = event.target;
                    if(targetEle.tagName.toLocaleLowerCase() == "input"){
                        var mId = targetEle.value;
                        if(!targetEle.checked){
                            _this._removeSelectOperator(true, this.getAttribute("selectId"), mId);
                        }else{
                            if(targetEle.getAttribute("type") == "radio"){
                                _this._removeSelectOperator(true, this.getAttribute("selectId"));
                            }
                            
                            //获取头像地址
                            var pic = targetEle.nextElementSibling;
                            _this._addSelectOperator(true, this.getAttribute("selectId"), mId, 
                                    targetEle.getAttribute("memberName"), pic.getAttribute("src"), targetEle.getAttribute("postname"));
                        }
                    }
                });
                
                //添加UL的滚动事件
                var uls = selectPeopleDialog.mainDiv.querySelectorAll("ul");
                for(var i = 0, len = uls.length; i < len; i++){
                    var u = uls[i];
                    var clickDomId = u.getAttribute("selectId");
                    var mDatas = _this.WF_SELECT_MEMBER_DIALOG_DATAS[clickDomId];
                    
                    //超过40个备选才加事件
                    if(mDatas && mDatas.length > 40){
                        u.addEventListener("scroll", function(e){
                            //console.info("scroll" + this.offsetHeight + "/" + this.scrollHeight + "/" + this.scrollTop);
                            //检测向上向下滚动
                            var sTop = this.scrollTop,
                                oldTop = this.getAttribute("_scrollTop");
                            
                            if(sTop != oldTop){
                                
                                var hideHeight = 0,//影藏内容高度
                                    sign = 1;
                                
                                if(sTop > oldTop){
                                  //console.info("向下滚动...");
                                    hideHeight = this.scrollHeight - (this.scrollTop + this.offsetHeight);
                                    sign = -1;
                                }else{
                                  //console.info("向上滚动...");
                                    hideHeight = sTop;
                                    sign = 1;
                                }
                                
                                if(hideHeight < 300){
                                    
                                    var selectId = this.getAttribute("selectId"),
                                        start = 0,
                                        end = 0
                                        insertPoint = "";
                                
                                    if(sign == -1){
                                        start = parseInt(this.querySelector("li:last-child").getAttribute("index")) + 1;
                                        end = start + 20;
                                        insertPoint = "beforeEnd";
                                    }else {
                                        end = parseInt(this.querySelector("li:first-child").getAttribute("index")),
                                        start = Math.max(end - 20, 0);
                                        insertPoint = "afterBegin";
                                    }
                                    
                                    //加10个
                                    var nodeMembers = _this.WF_SELECT_MEMBER_DIALOG_DATAS[selectId];
                                    var mDatas = nodeMembers.slice(start, Math.min(end, nodeMembers.length));
                                    if(mDatas.length > 0){
                                        
                                        //设置选中状态
                                        var sMembers = _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId] || [];
                                        for(var t = 0; t < mDatas.length; t++){
                                            mDatas[t]["selected"] = false;
                                            mDatas[t]["headshotURL"] = cmp.origin + "/rest/orgMember/avatar/" + mDatas[t]["id"] + "?maxWidth=200";
                                            for(var f = 0; f < sMembers.length; f++){
                                                if(sMembers[f]["value"] == mDatas[t]["id"]){
                                                    mDatas[t]["selected"] = true;
                                                    break;
                                                }
                                            }
                                        }
                                        
                                        var h = cmp.tpl(WorkFlowDesignerTpls.SELECT_MEMBER_LI_TPL, {"start" : start, "datas" : mDatas});
                                        this.insertAdjacentHTML(insertPoint, h);
                                      
                                        //删20个
                                        var lis = this.querySelectorAll("li"),
                                            totalHeight = 0,
                                            dBegin = 0;
                                        
                                        if(sign == 1){
                                            dBegin = (mDatas.length * -1) + lis.length;
                                        }
                                        
                                      //删除元素,  下面的代码在IOS下面会导致空白闪动，先屏蔽
                                        /*for(var k = dBegin, dEnd = mDatas.length + dBegin; k < dEnd; k++){
                                            totalHeight += (lis[k].offsetHeight * sign);
                                            lis[k].remove();
                                        }
                                        
                                        sTop = sTop + totalHeight;
                                        this.scrollTop = sTop;
                                        cmp.IMG.detect();*/
                                    }
                                }
                                
                            }else{
                                //console.info("没动...");
                            }
                            
                            this.setAttribute("_scrollTop", sTop);
                        }, false);
                    }
                }
            }
        },
        initHTML : function(){
            return selectPeopleViewHTML + selectPeopleBottonHTML;
         },
        bottonConfig : {
            buttons :[
                {
                    type : 1,
                    isPopBtn : true,
                    label : cmp.i18n("workflow.dialog.cancel.label"),// 取消
                    hander : function(){
                        selectPeopleDialog.hide();
                    }
                },
                { 
                    label : cmp.i18n("workflow.dialog.ok.label"),//确定
                    hander : function(){
                        var uls = selectPeopleDialog.mainDiv.querySelectorAll("ul");
                        for(var i = 0, len = uls.length; i < len; i++){
                            var u = uls[i];
                            if(!u.classList.contains("display_none")){
                                
                                var clickDomId = u.getAttribute("selectId");
                                var names = "";
                                var ids = "";
                                var posts = "";
                                var sMembers = _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[clickDomId];
                                if(sMembers){
                                    for(var j = 0, len2 = sMembers.length; j < len2; j++){
                                        if(ids != ""){
                                            ids += ",";
                                            names += "、";
                                            posts += ",";
                                        }
                                        ids += sMembers[j].value;
                                        names += sMembers[j].name;
                                        posts += sMembers[j].post;
                                    }
                                }
                                _this._setSelectMember(names, ids, clickDomId, posts, true, "");
                                break;
                            }
                        }
                        
                        selectPeopleDialog.hide();
                    }
                }
            ]
         }
    }, false);
    
    _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG = selectPeopleDialog;
    
  //分支/子流程选择HTML
    var retHTML  = '<ul class="operator">';
        retHTML += wfBranchHTML + autoBranchHTML + wfSubWfHTML;
        retHTML += '</ul>';
    
    //分支情况
    var dialog = this.dialog({
        initHeader : false,
        title : dialogTitle,
        dir : "right-go",
        containerExtClass : "wk-branch-back",
        zIndex : (_this.style.zIndex + 1) + "",//层级
        initHTML : function(){
            return retHTML;
        },
        onShow : function(){
        },
        onInit : function(){
            
          //显示影藏不满足分支的条件
            var tempEle = dialog.mainDiv.querySelector("#" + SHOW_FIELD_CONDITION_ID);
            if(tempEle){
                
                tempEle.addEventListener("tap", function(){
                                       var type = this.getAttribute("data-type");
                                       _this.showFailedCondition(this, type, dialog.mainDiv);
                                   });
            }
            var isShow = isBranchShowSuccess && isBranchShowFail;
            if(!isBranchShowSuccess && isBranchShowFail){
                _this.showFailedCondition(tempEle, 1, dialog.mainDiv, isShow);
              }
            
            var dialogMainDivId = dialog.mainDiv.getAttribute("id");
            
          //分支流程选择 事件
            cmp("#" + dialogMainDivId).on("click", ".branch_li_input_to_select", function(){
                //console.info("This input is checked : " + this.checked);
                _this.showSelectPeoplePart(this, cpMatchResult, context); 
            });
            
          //子流程
            cmp("#" + dialogMainDivId).on("tap", ".subprocess_li_input", function(){
                //console.info("This input is checked : " + this.checked);
                _this.showSubSelectPeoplePart(this); 
            });

            
          //分支流程 选人
            var $branchLiPeoples =  dialog.mainDiv.querySelectorAll(".branch_li_people");
            if($branchLiPeoples && $branchLiPeoples.length > 0){
                function doSelectBranchLiPeople(event){
                  //检查select是否选中
                    var selInput = document.querySelector("input[id='" + this.getAttribute("selectInputId")+"']");
                    if(!selInput || selInput.getAttribute("type") != "checkbox"
                        || (selInput.getAttribute("type") == "checkbox" && selInput.checked)){
                        
                        //点到不可以点击的区域
                        var checkEle = event.target;
                        var isNotClick = false;
                        while(!isNotClick && checkEle != null && checkEle != this 
                                && checkEle != window.document.body){
                            
                            if(checkEle.classList.contains("not-click-selector")){
                                isNotClick = true;
                            }else{
                                checkEle = checkEle.parentNode;
                            }
                        }
                        
                        
                        if(isNotClick){
                            //不执行
                            return;
                        }
                        
                        var selectStyle = this.getAttribute("selectStyle");
                        if(selectStyle == "select_list"){
                            selectPeopleDialog.setTitle(this.getAttribute("selectPeopleDialogTitle"));
                            selectPeopleDialog.show();
                        } else {
                            _this.processModeName = this.querySelector("h5.wk-process-mode").querySelector("span").innerHTML;
                        }
                        _this.choosePerson(this); 
                    }
                }
                for(var ii = 0; ii < $branchLiPeoples.length; ii++){
                    $branchLiPeoples[ii].addEventListener("tap", doSelectBranchLiPeople);
                }
            }
            
            var $multipleRadios =  dialog.mainDiv.querySelectorAll(".radio-selector");
            if($multipleRadios && $multipleRadios.length > 0){
                for(var radioIndex = 0; radioIndex < $multipleRadios.length; radioIndex++){
                    $multipleRadios[radioIndex].addEventListener("click", function(){
                        //console.log("串发执行设置...");
                        var nodeId = this.getAttribute("nodeid"), setType = this.value;
                        if(setType == "0"){
                            //重置
                            _this._resetMultiSerial(nodeId, setType);
                        }else{
                            //排序设置
                            _this._multiSerialSet(nodeId, setType);
                        }
                    });
                }
            }
            


            //排序按钮事件
              var $sortAddEles = dialog.mainDiv.querySelectorAll(".multi-sort-add");
              if($sortAddEles && $sortAddEles.length > 0){
                  for(var sortIndex = 0; sortIndex < $sortAddEles.length; sortIndex++){
                      $sortAddEles[sortIndex].addEventListener("tap", function(){
                        //console.log("串发执行排序...");
                          if(!this.classList.contains("cmp-disabled")){
                              var nodeId = this.getAttribute("nodeid");
                              var canSelectOrgMember = this.getAttribute("canSelectOrgMember") === "true";
                              var singleAdd = this.getAttribute("singleAdd");
                              if(singleAdd === "true"){
                                  //单人打开选人界面选人
                                  
                                  //找到选人元素
                                  var checkEle = this.parentNode;
                                  var isFound = false;
                                  while(!isFound && checkEle != null && checkEle != window.document.body){
                                      if(checkEle.classList.contains("branch_li_people")){
                                          isFound = true;
                                      }else{
                                          checkEle = checkEle.parentNode;
                                      }
                                  }
                                  if(isFound){
                                      _this.choosePerson(checkEle, true);
                                  }
                              }else{
                                  //多人打开排序页面
                                  _this._multiSortAndAdd(nodeId, canSelectOrgMember);
                              }
                          }
                      });
                  }
              }
            
              
          //多人串发执行事件
            cmp("#" + dialogMainDivId).on("tap", ".subprocess_li_input", function(){
                //console.info("This input is checked : " + this.checked);
                _this.showSubSelectPeoplePart(this); 
            });
            
            //分支条件描述
            var titleContainers = document.querySelectorAll(".conditionTitle_container");
            if(titleContainers && titleContainers.length > 0){
                var arrowHtml = '<span class="cmp-icon see-icon-v5-common-arrow-down conditionTitle_icon"></span>';
                for(var ti = 0, tlen = titleContainers.length; ti < tlen; ti++){
                     var tc = titleContainers[ti];
                     if(tc.offsetHeight > 20){//超过两行, TODO 可以动态检查
                         var tcP, pWidth;
                         tcP = tc.parentElement;
                         pWidth = tcP.clientWidth;

                         tc.style.display = "inline-block";
                         tc.style.width = (pWidth - 42) + "px";
                         tc.classList.add("cmp-ellipsis");
                         
                         tcP.insertAdjacentHTML("beforeEnd", arrowHtml);
                     }
                }
                
              //分支流程 选人
                cmp("#" + dialogMainDivId).on("tap", ".conditionTitle_icon", function(e){
                    
                    e.stopPropagation();
                    var iRClass, iAClass, iClass, textSapn, textEll;
                    
                    iRClass = 'see-icon-v5-common-arrow-down';
                    iAClass = 'see-icon-v5-common-arrow-top';
                    textEll = "cmp-ellipsis";
                    iClass = this.classList;
                    textSapn = this.parentElement.querySelector('.conditionTitle_container');
                    
                    if(iClass.contains(iRClass)){
                        iClass.remove(iRClass);
                        iClass.add(iAClass);
                        textSapn.classList.remove(textEll);
                    }else{
                        iClass.add(iRClass);
                        iClass.remove(iAClass);
                        textSapn.classList.add(textEll);
                    }
                });
            }
        },
        bottonConfig : {
            buttons :[
                {
                    type : 1,
                    isPopBtn : true,
                    label : cmp.i18n("workflow.dialog.cancel.label"),
                    hander : function(){
                        
                        dialog.close();
                        selectPeopleDialog.close();
                        dialog = null;
                        selectPeopleDialog = null;
                        _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG = null;
                        _this.wfViewEleId.WF_BRANCH_DIALOG = null;
                        
                        //和PC保持一致
                        _this.setInputVal("workflow_newflow_input", "");
                        _this.setInputVal("workflow_node_peoples_input", "");
                        _this.setInputVal("workflow_node_condition_input", "");
                        _this.setInputVal("workflow_last_input", "");

                        _this.releaseWorkflowByAction(_this.jsonFileds.processId, 14);
                        
                        //取消
                        if(callback){
                            callback({"result":"false"});
                        }
                    }
                },
                { 
                    label : cmp.i18n("workflow.finished.label"),
                    hander : function(){
                        if(dialog.isSubmiting){
                            //重复点击...
                            return;
                        }
                        dialog.isSubmiting = true;
                        
                        _this.submitFunc_Next_rest(cpMatchResult, context, callback, function(tempRet){
                            
                            dialog.isSubmiting = false;
                            
                            if(tempRet){

                                dialog.close();
                                selectPeopleDialog.close();
                                dialog = null;
                                selectPeopleDialog = null;
                                
                                _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG = null;
                                _this.wfViewEleId.WF_BRANCH_DIALOG = null;
                                
                                //提交成功
                                callback({"result":"true"});
                            }else{
                                //TODO 预提交失败，暂时停留在这个页面
                            }
                        });
                    }
                }
            ]
         }
    }, false);
    
    _this.wfViewEleId.WF_BRANCH_DIALOG = dialog;
}

/** 串发执行 设置 **/
WorkFlowDesigner.prototype._multiSerialSet = function(nodeId, setType){
    
    var ntime = new Date().getTime();
    if(ntime - this.clickTime < 1000){
        this.clickTime = ntime;//连续点击的情况
        return;
    }
    this.clickTime = ntime;
    
    var _this = this, tempContainer, nameEl, idEl, multiAddEl, postEl;
    var clickDomId = "manual_select_node_id" + nodeId;
    
    tempContainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
    idEl = tempContainer.querySelector("#" + clickDomId);
    idEl.setAttribute("multimodel", setType);
}

/** 串发执行 重置 **/
WorkFlowDesigner.prototype._resetMultiSerial = function(nodeId, setType){
    
    var ntime = new Date().getTime();
    if(ntime - this.clickTime < 1000){
        this.clickTime = ntime;//连续点击的情况
        return;
    }
    this.clickTime = ntime;
    
    var _this = this, tempContainer, nameEl, idEl, orgNameEl, orgIdEl, multiAddEl;
    
    var clickDomId = "manual_select_node_id" + nodeId;
    
    tempContainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
    idEl = tempContainer.querySelector("#" + clickDomId);
    idEl.setAttribute("multimodel", setType);
}

/** 多人执行排序设置 **/
WorkFlowDesigner.prototype._multiSortAndAdd = function(nodeId, canSelectOrgMember){
    
    var ntime = new Date().getTime();
    if(ntime - this.clickTime < 1000){
        this.clickTime = ntime;//连续点击的情况
        return;
    }
    this.clickTime = ntime;
    
    var _this = this, tempContainer, nameEl, idEl, multiAddEl, postEl;
    var clickDomId = "manual_select_node_id" + nodeId;
    
    tempContainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
    nameEl = tempContainer.querySelector("#" + clickDomId + "_name");
    postEl = tempContainer.querySelector("#" + clickDomId + "_post");
    multiAddEl = tempContainer.querySelector("#" + clickDomId + "_multi_add");
    idEl = tempContainer.querySelector("#" + clickDomId);

    if(nameEl && idEl){
        
        var memberIdVal = idEl.value, 
            memberNameVal = nameEl.innerText, 
            memberPostVal = postEl.value,
            multiAddVal = multiAddEl.value;
        
        var memberIds = [], memberNames = [], memberPosts = [], multiAdd = []; 
        
        if(memberIdVal){
            memberIds = memberIdVal.split(","); 
        }
        if(memberNameVal){
            memberNames = memberNameVal.split("、"); 
        }
        if(memberPostVal){
            memberPosts = memberPostVal.split(",");
        }
        if(multiAddVal){
            multiAdd = multiAddVal.split(",");
        }
        
        var datas = [];
        for(var i = 0; i < memberIds.length; i++){
            
            var isAdd = false;
            for(var j = 0; j < multiAdd.length; j++){
                if(memberIds[i] == multiAdd[j]){
                    isAdd = true;
                    break;
                }
            }
            
            datas.push({
                headshotURL : cmp.origin + "/rest/orgMember/avatar/" + memberIds[i] + "?maxWidth=200",
                name : memberNames[i],
                post : memberPosts[i],
                id : memberIds[i],
                isAdd : isAdd
            });
        }
        
        var addMemberBtnHTML = "", addMemberBtnHeight = 0;
        var selectedHTML = '<ul id="sortMemberUL" style="overflow:auto;height:100%;" class="cmp-list-content operator">';
        selectedHTML += cmp.tpl(WorkFlowDesignerTpls.MULTI_SERIAL_SET_MEMBER_LI_TPL, datas);
        selectedHTML += '</ur>';
        
        var rightConfig = null;
        if(canSelectOrgMember === true){
            
            addMemberBtnHTML = '<div class="wf_flexbox border_b" style="height:40px;line-height:40px;justify-content:space-between;-webkit-justify-content:space-between;">'
                + '<span style="padding-left:10px;">' + cmp.i18n("workflow.label.addExecutor") + /*新增执行人*/ '</span>'
                + '<span id="addNewMember" style="font-size:24px;width:40px;height:40px;line-height:40px;color:#3AADFB;text-align:center;" class="cmp-icon m3-icon-add-round"></span>'
                + '</div>';
            addMemberBtnHeight = 40;
        }
        
        // 拼接HTML
        selectedHTML = addMemberBtnHTML + selectedHTML;
            
            
        
        
        //弹出进行排序
        var MultiSerialSetDialog = this.dialog({
            initHeader : false,
            title : cmp.i18n("workflow.presubmit.mutile.person.label"),//多人执行
            dir : "right-go",
            zIndex : (_this.style.zIndex + 2) + "",//层级
            show : true,
            toastConfig : {
                label : cmp.i18n("workflow.label.pressSort"),//长按进行排序
                time : 5000,
                layout : "center"
            },
            onShow : function(){
                
                if(addMemberBtnHeight !== 0){
                    
                    var $sortMemberUL = MultiSerialSetDialog.mainDiv.querySelector("#sortMemberUL");
                    $sortMemberUL.style.height = (MultiSerialSetDialog.mainDivHeight - 40) + "px";
                }
            },
            onInit : function(){
                
                
                if(addMemberBtnHeight !== 0){
                 // 添加外部人员
                    var $addNewMemberBtn = MultiSerialSetDialog.mainDiv.querySelector("#addNewMember");
                    $addNewMemberBtn.addEventListener("tap", function(e){
                        var selectConfig = {
                                maxSize : -1,
                                title : cmp.i18n("workflow.presubmit.mutile.person.label"),
                                selectCallback : function(members){
                                    
                                    var addMembers = [], existsMembes = {};
                                    
                                    var selectedMember = [];
                                    var dialogContainer = MultiSerialSetDialog.mainDiv;
                                    var $lis = dialogContainer.querySelectorAll("li");
                                    if($lis && $lis.length > 0){
                                        for(var liIndex = 0; liIndex < $lis.length; liIndex++){
                                            var mId = $lis[liIndex].getAttribute("mid");
                                            existsMembes[mId] = mId;
                                        }
                                    }
                                    
                                    if(members && members.length > 0){
                                        for(var i = 0; i < members.length; i++){
                                            if(!existsMembes[members[i]["id"]]){
                                                addMembers.push({
                                                    headshotURL : cmp.origin + "/rest/orgMember/avatar/" + members[i]["id"] + "?maxWidth=200",
                                                    name : members[i]["name"],
                                                    post : members[i]["post"],
                                                    id : members[i]["id"],
                                                    isAdd : true
                                                    
                                                });
                                            }
                                        }
                                    }
                                    
                                    if(addMembers.length > 0){
                                        var addHTML = cmp.tpl(WorkFlowDesignerTpls.MULTI_SERIAL_SET_MEMBER_LI_TPL, addMembers);
                                        var $ul = dialogContainer.querySelector("ul");
                                        $ul.insertAdjacentHTML("beforeEnd", addHTML);
                                    }
                                }
                            }
                            
                            //调用选人组件选择执行人
                            _this._selectOrgMember4Branch(selectConfig);
                    }, false)
                }
                
                
                var _dragTimeout, _removeTimeout;
                function _startDrag(moveLi, startEvent){
                    
                    if(_dragTimeout){
                        clearTimeout(_dragTimeout);
                    }
                    
                    document.addEventListener("touchend", _removeTimeout=function(e){
                        
                        //console.log("取消执行事件...");
                        
                        if(_dragTimeout){
                            clearTimeout(_dragTimeout);
                        }
                        document.removeEventListener("touchend", _removeTimeout);
                        _removeTimeout = null;
                        moveLi = null;
                    },false);
                    
                    _dragTimeout = setTimeout(function(){
                        
                        //console.log("执行移动...");
                        
                        //移除定时事件
                        document.removeEventListener("touchend", _removeTimeout);
                        _removeTimeout = null;
                        
                        function _getElementTop(element) {
                            
                            var actualTop = element.offsetTop;
                            var $ul = element.parentNode;
                            
                            actualTop -= $ul.scrollTop;
                            
                            actualTop += MultiSerialSetDialog.headerHeight;
                            
                            return actualTop;
                        }
                        function _insertAfter(newEle, targetEle){
                            
                            var targetParent = targetEle.parentNode;
                            if (targetParent.lastChild == targetEle){
                                targetParent.appendChild(newEle);
                            } else {
                                targetParent.insertBefore(newEle, targetEle.nextSibling );
                            }
                        }
                        
                        //取消滚动条
                        moveLi.parentNode.style.overflow = "hidden";
                        var liHeight = moveLi.offsetHeight;
                        
                        //动态创建一个li， 替换
                        blankLi =  document.createElement("li");
                        blankLi.className = "wf-list-cell wk-operator-li";
                        blankLi.style.height = liHeight + "px";
                        
                        //插入空白元素
                        _insertAfter(blankLi, moveLi);
                        
                        //浮起来
                        liTop = _getElementTop(moveLi);
                        
                        moveLi.style.top = liTop + "px";
                        moveLi.style.position = "fixed";
                        moveLi.style.backgroundColor = "#fff";
                        moveLi.style.border = "red dashed 1px";
                        moveLi.style.width = "100%";
                        
                        var p, _touchmove, _touchend, liTop;
                        p={
                            y : liTop - startEvent.touches[0].clientY
                        };
                        startEvent = null;

                        document.addEventListener("touchmove", _touchmove = function(e) {
                            
                            var t = e.touches[0], currentTop = parseInt(moveLi.style.top, 10);
                            var newY = p.y + t.clientY;
                            
                            if (newY < 0) {
                                newY = 0;
                            } else if (newY + moveLi.offsetHeight > document.body.clientHeight) {
                                newY = document.body.clientHeight - moveLi.offsetHeight;
                            }
                            
                            moveLi.style.top = newY + "px";
                            
                            //移动超过一半就移动
                            if(newY > currentTop){
                                //向下
                                if(liTop + liHeight / 2 < newY){
                                    //向下移动
                                    var nextLi = blankLi, whileFlag = true;
                                    do {
                                        nextLi = nextLi.nextSibling;
                                        if(!nextLi || nextLi.nodeType == 1){
                                            whileFlag = false
                                        }
                                    } while (whileFlag);
                                    
                                    if(nextLi){
                                        blankLi.remove();
                                        _insertAfter(blankLi, nextLi);
                                        liTop = _getElementTop(blankLi);
                                    }
                                }
                            }else{
                              //向上
                                if(liTop - liHeight / 2 > newY){
                                    //向下移动
                                    var preLi = blankLi, whileFlag = true;
                                    do {
                                        preLi = preLi.previousSibling;
                                        if(!preLi || preLi.nodeType == 1){
                                            whileFlag = false
                                        }
                                    } while (whileFlag);
                                    
                                    if(preLi){
                                        preLi.remove();
                                        _insertAfter(preLi, blankLi);
                                        liTop = _getElementTop(blankLi);
                                    }
                                }
                            }

                            // 阻止默认事件
                            e.preventDefault();
                        });
                        
                        document.addEventListener("touchend", _touchend=function(e){
                            
                            //移除在document上添加的两个事件
                            document.removeEventListener("touchend", _touchend);
                            document.removeEventListener("touchmove", _touchmove);
                                
                            moveLi.style.position = "";
                            moveLi.style.widht = "";
                            moveLi.style.backgroundColor = "";
                            moveLi.style.border = "";
                            moveLi.remove();
                            _insertAfter(moveLi, blankLi);
                            moveLi.parentNode.style.overflow = "auto";
                            
                            blankLi.remove();
                            blankLi = null;
                            moveLi = null;
                            _touchmove = null;
                            _touchend = null;
                            _getElementTop = null;
                            _insertAfter = null;
                        },false);
                    }, 500);
                }
                
                //拖动事件
                cmp(MultiSerialSetDialog.mainDiv).on("touchstart", "li", function(e){
                    _startDrag(this, e);
                });
            },
            initHTML : function(){
                return selectedHTML;
            },
            rightBtnConfig : rightConfig,
            bottonConfig : {
                buttons :[
                    {
                        type : 1,
                        isPopBtn : true,
                        label : cmp.i18n("workflow.dialog.cancel.label"),// 取消
                        hander : function(){
                            MultiSerialSetDialog.close();
                            MultiSerialSetDialog = null;
                        }
                    },
                    {
                        label : cmp.i18n("workflow.dialog.ok.label"),//确定
                        hander : function(){
                            
                            var names = "";
                            var ids = "";
                            var posts = "";
                            var multiAdd = "";
                            
                            var selectedMember = [];
                            var dialogContainer = MultiSerialSetDialog.mainDiv;
                            var $lis = dialogContainer.querySelectorAll("li");
                            if($lis && $lis.length > 0){
                                for(var liIndex = 0; liIndex < $lis.length; liIndex++){
                                    
                                    var mId = $lis[liIndex].getAttribute("mid");
                                    if(mId){
                                        if(ids != ""){
                                            ids += ",";
                                            names += "、";
                                            posts += ",";
                                        }
                                        names += $lis[liIndex].getAttribute("mname");
                                        ids += $lis[liIndex].getAttribute("mid");
                                        posts += $lis[liIndex].getAttribute("mpost");
                                        
                                        if($lis[liIndex].getAttribute("isadd") === "true"){
                                            if(multiAdd != ""){
                                                multiAdd += ",";
                                            }
                                            multiAdd += $lis[liIndex].getAttribute("mid");
                                        }
                                    }
                                }
                            }
                            
                            if(ids != ""){
                                _this._setSelectMember(names, ids, clickDomId, posts, false, multiAdd);
                            }
                            
                            MultiSerialSetDialog.close();
                            MultiSerialSetDialog = null;
                            clickDomId = null
                        }
                    }
                ]
             }
        }, false);
    }
}


/**
 * 设置选择的人员信息
 */
WorkFlowDesigner.prototype._setSelectMember = function(names, ids, clickDomId, posts, toSetOrg, multiAdd){

    var _this = this;
    if(ids){
        var tempContainer, nameEl, idEl, postEl, orgNameEl, orgIdEl, orgPostEl, multiAddEl;
        tempContainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
        nameEl = tempContainer.querySelector("#" + clickDomId + "_name");
        postEl = tempContainer.querySelector("#" + clickDomId + "_post");
        multiAddEl = tempContainer.querySelector("#" + clickDomId + "_multi_add");
        idEl = tempContainer.querySelector("#" + clickDomId);
        
        if(nameEl && idEl){
            nameEl.innerText = names;
            idEl.value = ids;
            
            if(postEl){
                postEl.value = posts;
            }
            if(multiAddEl){
                multiAddEl.value = multiAdd || "";
            }
        }
    }
}

/**
 * 移动端协同【确定】提交入口方法
 */
WorkFlowDesigner.prototype.submitFunc_Next_rest = function(cpMatchResult, context, callback, handResultFn){
    
    var _this = this;
    
    //清空选择的流程对象
    _this.wfSelectInfo.realSelectPeopleNodeNum = 0;
    
    //检查分支最大能选择的数量
    if (!_this.isHandSelectOk(cpMatchResult)) {
        
        _this.alert(cmp.i18n("workflow.label.gtMaxBranch", [cpMatchResult.hst])/*所选的手动分支条数超出模板设定的可选数*/, function(){
            handResultFn(false);
        });
        return false;
    }else{
        var checkedNum = 0;
        var checkedNum1 = 0;
        
        var viewEle = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
        var checkedInputs = viewEle.querySelectorAll(".branch_li_input_to_select");
        if(checkedInputs){
            for(var i = 0, len = checkedInputs.length; i < len; i++){
                if(checkedInputs[i].getAttribute("type") == "checkbox"){
                    checkedNum1++;
                    if(checkedInputs[i].checked){
                        checkedNum++;
                    }
                }
            }
        }
        
        var currentSelectNodes = cpMatchResult["currentSelectNodes"];
        var currentSelectInformNodes = cpMatchResult["currentSelectInformNodes"];
        var allSelectNodes1 = cpMatchResult["allSelectNodes"];
        var allNotSelectNodes1 = cpMatchResult["allNotSelectNodes"];
        var condtionMatchMap1 = cpMatchResult["condtionMatchMap"];
        
        if (checkedNum <= 0 
                && (null == currentSelectNodes || currentSelectNodes.length <= 0)
                && (null == currentSelectInformNodes || currentSelectInformNodes.length <= 0)
                && (checkedNum1 > 0)) {
            
            _this.alert(cmp.i18n("workflow.label.selectSubWf") /*请选择流程，否则本分支流程将不能流转下去！*/, function(){
                handResultFn(false);
            });
            return false;
            
        } else {// 校验：选中的分支是否有执行人员,没有则提示选择人员
            
            var nodeId;
            var inputName;
            var isPass = true;
            
            var branchInputs = viewEle.querySelectorAll(".branch_li_input");
            if(branchInputs && branchInputs.length > 0){
                for(var i = 0, len = branchInputs.length; i < len; i++){
                    var branchInput = branchInputs[i];
                    if(branchInput.checked){
                        nodeId = branchInput.getAttribute("id");
                        var selectPeopleLi = viewEle.querySelector("#manual_select_node_id" + nodeId);
                        if(selectPeopleLi){
                            var pIds = selectPeopleLi.value;
                            if (pIds == null || pIds == '') {
                                inputName = selectPeopleLi.getAttribute("inputName");
                                isPass = false;
                                break;
                            }
                        }
                    }
                }
            }

            if (isPass) {
                var hideInputs = viewEle.querySelectorAll("#common_branch_nodes");
                if(hideInputs && hideInputs.length > 0){
                    for(var i = 0, len = hideInputs.length; i < len; i++){
                        var hideInput = hideInputs[i];
                        nodeId = hideInput.value;
                        var selectPeopleLi = viewEle.querySelector("#manual_select_node_id" + nodeId);
                        if (selectPeopleLi) {
                            var pIds = selectPeopleLi.value;
                            if (pIds == null || pIds == '') {
                                inputName = selectPeopleLi.getAttribute("inputName");
                                isPass = false;
                                break;
                            }
                        }
                    }
                }
            }
            
            if(!isPass){
                _this.alert(inputName, function(){
                    handResultFn(false);
                });
                return false;
            }
            
            
            // 校验：选中的新流程是否有执行人员，没有则提示选择人员
            var subProcessId;
            var subProcessTempleteName;
            var subProcessInputs = viewEle.querySelectorAll(".subprocess_li_input");
            
            if(subProcessInputs && subProcessInputs.length > 0){
                for(var i = 0, len = subProcessInputs.length; i < len; i++){
                    var myChecked = subProcessInputs[i].checked;
                    if (myChecked) {
                        subProcessId = subProcessInputs[i].getAttribute("id");
                        var peopleEle = viewEle.querySelector("#senderId_" + subProcessId);
                        var newFlowSenderIdStr = peopleEle.value;
                        subProcessTempleteName = peopleEle.getAttribute("inputName");
                        if (newFlowSenderIdStr == null || newFlowSenderIdStr == '') {
                            isPass = false;
                            break;
                        }
                    }
                }
            }
            if (!isPass) {
                _this.alert(cmp.i18n("workflow.label.subWfSenderNone", [subProcessTempleteName]), function(){
                    handResultFn(false);
                });

                //TODO PC端这里会自动打开选人窗口
                return false;
            }
            
            var invalidateActivityMap = cpMatchResult["invalidateActivityMap"] || {};
            var nodeNameStr = "";
            
            var humenNodeMatchAlertMsg = cmp.parseJSON(cpMatchResult["humenNodeMatchAlertMsg"]);
            var nodeMatchAlertMsg = "";
            if(cpMatchResult["allSelectNodes"] && cpMatchResult["allSelectNodes"].length > 0){
                for(var i = 0, len = cpMatchResult["allSelectNodes"].length; i < len; i++){
                    var value = cpMatchResult["allSelectNodes"][i];
                    var nodeNameStr1 = invalidateActivityMap[value];
                    var isNodeValidate = (nodeNameStr1 != null && nodeNameStr1.trim() != "") ? true : false;
                    if (isNodeValidate) {
                        isPass = false;
                        nodeNameStr += (nodeNameStr != null && nodeNameStr.trim() == "") ? nodeNameStr1 : "、" + nodeNameStr1;
                    }
                    
                  //节点匹配弹出信息(目前动态匹配在使用)
                    if(humenNodeMatchAlertMsg){
                  	  var nodeMatchAlertMsg1 = humenNodeMatchAlertMsg[value];
                  	  var humenNodeValidate = (nodeMatchAlertMsg1!=null && nodeMatchAlertMsg1.trim()!="")?true:false;
                  	  if(humenNodeValidate){
                  		  nodeMatchAlertMsg = nodeMatchAlertMsg1;
                  		  isPass = false;
                  		  break;
                  	  }
                    }
                }
            }
            
            if(checkedInputs && checkedInputs.length > 0){
                for(var i = 0, len = checkedInputs.length; i < len; i++){
                    var branchInput = checkedInputs[i];
                    
                    var checked = branchInput.checked;
                    var nodeId = branchInput.getAttribute("id");
                    if (checked) {
                        var nodeNameStr1 = invalidateActivityMap[nodeId];
                        var isNodeValidate = (nodeNameStr1 != null && nodeNameStr1.trim() != "") ? true : false;
                        if (isNodeValidate) {
                            isPass = false;
                            nodeNameStr += (nodeNameStr != null && nodeNameStr.trim() == "") ? nodeNameStr1 : "、"
                                    + nodeNameStr1;
                        }
                        
                      //节点匹配弹出信息(目前动态匹配在使用)
                        if(humenNodeMatchAlertMsg){
                      	 var nodeMatchAlertMsg1 = humenNodeMatchAlertMsg[nodeId];
                      	  var humenNodeValidate = (nodeMatchAlertMsg1!=null && nodeMatchAlertMsg1.trim()!="")?true:false;
                      	  if(humenNodeValidate){
                      		nodeMatchAlertMsg = nodeMatchAlertMsg1;
                      		  isPass = false;
                      		  break;
                      	  }
                        }
                    }
                }
            }
            if (!isPass) {
            	var alertMsg = "";
            	if(nodeMatchAlertMsg){
            		alertMsg = nodeMatchAlertMsg;
            	}else{
            		alertMsg = cmp.i18n("workflow.label.belowNoDedisabled", [nodeNameStr]);
            	}
            	//以下节点不可用，不能处理流程，请联系单位管理员处理: 
            	_this.alert(alertMsg, function(){
            		handResultFn(false);
            	});
                return false;
            }

            //var selectPeopleNames = {};
            var node_str = "{\"nodeAdditon\":[";
            var isbeforehas = false;
            if(checkedInputs && checkedInputs.length > 0){
                for(var i = 0, len = checkedInputs.length; i < len; i++){
                    var branchInput = checkedInputs[i];
                 // 分支
                    var nodeId = branchInput.getAttribute("id");
                    var nodeName = branchInput.getAttribute("nodeNamee");
                    var nodeIsInform = branchInput.getAttribute("isInform");
                    var checked = branchInput.checked;
                    var isForce = branchInput.getAttribute("isForce");
                    var na = branchInput.getAttribute("na");
                    
                    if (checked) {
                        // 看是否需要选择人员
                        var $workflow_Slelect_Obj = viewEle.querySelector("#manual_select_node_id" + nodeId);
                        var isDoSelectPeople = false;
                        if ($workflow_Slelect_Obj) {
                            
                            var pIdStr = $workflow_Slelect_Obj.value;
                            var multimodel = $workflow_Slelect_Obj.getAttribute('multimodel');
                            if (pIdStr && pIdStr != '') {
                                
                                var tempIsOrderExecute = "";
                                if(multimodel == "1"){
                                    var $nodeMultiAdd = viewEle.querySelector("#manual_select_node_id" + nodeId + "_multi_add");
                                    tempIsOrderExecute = ',"isOrderExecute":"true","addMember":['+ $nodeMultiAdd.value +']';
                                }else if(multimodel == "0"){
                                    tempIsOrderExecute = ',"isOrderExecute":"false","addMember":[]';
                                }
                                
                                node_str += '{"nodeId":"' + nodeId + '","pepole":[' + pIdStr + ']' + tempIsOrderExecute + '},';
                                isbeforehas = true;
                                _this.wfSelectInfo.realSelectPeopleNodeNum++;
                                isDoSelectPeople = true;
                            }
                        }
                        if (isForce == 'false') {
                            cpMatchResult["allSelectNodes"].push(nodeId);
                            if (nodeIsInform == 'true') {
                                if (na == '00' && isDoSelectPeople) {
                                    cpMatchResult["currentSelectNodes"].push(nodeId);
                                } else {
                                    cpMatchResult["allSelectInformNodes"].push(nodeId);
                                    cpMatchResult["currentSelectInformNodes"].push(nodeId);
                                }
                            } else {
                                cpMatchResult["currentSelectNodes"].push(nodeId);
                            }
                        }
                    } else {
                        if (isForce == 'false') {
                            cpMatchResult["allNotSelectNodes"].push(nodeId);
                        }
                    }
                }
            }
            
            if (node_str.lastIndexOf(",") == (node_str.length - 1)) {
                node_str = node_str.substring(0, node_str.length - 1);
            }
            
         // 选人
            var hideInputs = viewEle.querySelectorAll("#common_branch_nodes");
            if(hideInputs && hideInputs.length > 0){
                for(var i = 0, len = hideInputs.length; i < len; i++){
                    var hideInput = hideInputs[i];
                    
                    nodeId = hideInput.value;
                    var $workflow_Slelect_Obj = viewEle.querySelector("#manual_select_node_id" + nodeId);
                    if ($workflow_Slelect_Obj) {
                        
                        var pIdStr = $workflow_Slelect_Obj.value;
                        var multimodel = $workflow_Slelect_Obj.getAttribute('multimodel');
                        if (pIdStr && pIdStr != '') {
                            if (isbeforehas) {
                                node_str += ",";
                                _this.wfSelectInfo.realSelectPeopleNodeNum++;
                            } else {
                                isbeforehas = true;
                                _this.wfSelectInfo.realSelectPeopleNodeNum++;
                            }
                            var tempIsOrderExecute = "";
                            if(multimodel == "1"){
                                var $nodeMultiAdd = viewEle.querySelector("#manual_select_node_id" + nodeId + "_multi_add");
                                tempIsOrderExecute = ',"isOrderExecute":"true","addMember":['+ $nodeMultiAdd.value +']';
                            }else if(multimodel == "0"){
                                tempIsOrderExecute = ',"isOrderExecute":"false","addMember":[]';
                            }
                            node_str += '{"nodeId":"' + nodeId + '","pepole":[' + pIdStr + ']' + tempIsOrderExecute + '}';
                        }
                    }
                }
            }
            
            node_str += "]}";
            
            
            var oldPopNodeSelected = _this.getInputVal("workflow_node_peoples_input");
            if (oldPopNodeSelected.lastIndexOf("nodeAdditon") != -1 && oldPopNodeSelected.lastIndexOf("]}") != -1
                    && oldPopNodeSelected.lastIndexOf("pepole") != -1) {
                
                oldPopNodeSelected = oldPopNodeSelected.substring(0, oldPopNodeSelected.lastIndexOf("]}"));
                
                if (node_str.lastIndexOf("nodeAdditon") != -1 && node_str.lastIndexOf("]}") != -1
                        && node_str.lastIndexOf("pepole") != -1) {
                    var beginStr = "{\"nodeAdditon\":[";
                    node_str = node_str.substring(beginStr.length);
                    oldPopNodeSelected += "," + node_str;
                } else {
                    oldPopNodeSelected += "]}";
                }
                _this.setInputVal("workflow_node_peoples_input", oldPopNodeSelected);
            } else {
                _this.setInputVal("workflow_node_peoples_input", node_str);
            }

            
            // 节点的子流程触发信息
            var hasSubProcess1 = cpMatchResult["hasSubProcess"];
            if (hasSubProcess1) {
                var flow_Str = "";
                var selectSize = 0;
                
                if(subProcessInputs && subProcessInputs.length > 0){
                    for(var i = 0, len = subProcessInputs.length; i < len; i++){
                        var myChecked = subProcessInputs[i].checked;
                        if (myChecked) {
                            selectSize++;
                        }
                    }
                }
                
                if (selectSize > 0) {
                    for(var i = 0, len = subProcessInputs.length; i < len; i++){
                        var subProcessInput = subProcessInputs[i];
                        var myChecked = subProcessInput.checked;
                        var subProcessId = subProcessInput.getAttribute("id");
                        if (myChecked) {
                            
                            var newFlowSenderIdStr = viewEle.querySelector("#senderId_" + subProcessId).value;
                            
                            if(flow_Str == ""){
                                flow_Str = '{"hasNewflow":"true","newFlows":[';
                            }else{
                                flow_Str += ","
                            }
                            
                            flow_Str += '{"newFlowId":"' + subProcessId + '","newFlowSender":"' + newFlowSenderIdStr + '"}';
                        }
                    }
                }
                
                if(flow_Str != ""){
                    flow_Str += "]}";
                }

                cpMatchResult["hasSubProcess"] = false;
                _this.setInputVal("workflow_newflow_input", flow_Str);
            }
            
            var currentSelectInformNodes = cpMatchResult["currentSelectInformNodes"];
            var currentSelectNodes = cpMatchResult["currentSelectNodes"];
            var allSelectInformNodes = cpMatchResult["allSelectInformNodes"];
            var realCurrentSelectInformNodes = [];
            var realAllSelectInformNodes = [];
            
            if (currentSelectInformNodes && currentSelectInformNodes != null) {
                for (var k = 0; k < currentSelectInformNodes.length; k++) {
                    if (_this.wfSelectInfo.needPeopleTagObject[currentSelectInformNodes[k]]) {// 可以自动跳过的非知会节点转为不能自动跳过的非知会节点，且变为选中的非知会节点了。
                        currentSelectNodes.push(currentSelectInformNodes[k]);
                    } else {
                        realCurrentSelectInformNodes.push(currentSelectInformNodes[k]);
                    }
                }
            }
            if (allSelectInformNodes && allSelectInformNodes != null) {
                for (var k = 0; k < allSelectInformNodes.length; k++) {
                    if (_this.wfSelectInfo.needPeopleTagObject[allSelectInformNodes[k]]) {// 可以自动跳过的非知会节点转为不能自动跳过的非知会节点，且变为选中的非知会节点了。

                    } else {
                        realAllSelectInformNodes.push(allSelectInformNodes[k]);
                    }
                }
            }
            
            cpMatchResult["allSelectInformNodes"] = realAllSelectInformNodes;
            cpMatchResult["currentSelectNodes"] = currentSelectNodes;
            cpMatchResult["currentSelectInformNodes"] = realCurrentSelectInformNodes;
            
            var currentSelectInformNodes = cpMatchResult["currentSelectInformNodes"];
            if ((currentSelectInformNodes != null && currentSelectInformNodes.length > 0)) {
                cpMatchResult["pop"] = false;
                cpMatchResult["token"] = "";
                cpMatchResult["last"] = "false";
                
                var node_str = _this.getInputVal("workflow_node_peoples_input");
                context["selectedPeoplesOfNodes"] = node_str;
                
                //设置流程ID
                _this.setProcessId(context);
                
                var obj = {
                        "context" : cmp.toJSON(context),
                        "cpMatchResult" : cmp.toJSON(cpMatchResult)
                    };
                    var _postDatas = {"_json_params" : obj}
                
                //这里是同步的
                cmp.dialog.loading();
                $s.Workflow.transBeforeInvokeWorkFlow({}, _postDatas,errorBuilder({
                    success : function(cpMatchResult) {
                        cmp.dialog.loading(false);
                        var result = cpMatchResult["pop"];
                        var requestToken = cpMatchResult["token"];
                        if (requestToken && requestToken == "WORKFLOW") {
                            
                        } else {
                            _this.alert(cmp.i18n("workflow.alert.network.instability"), function(){
                                handResultFn(false);
                            });
                            return false;
                        }
                        
                        if (result == true) {

                            handResultFn(false);
                            
                          //还要来一轮~~~
                            _this._preSubmitTrue(cpMatchResult, context, callback);
                            //不往下面走了， 
                            return false;
                        } else {//提交流程
                            var invalidateActivityMap = cpMatchResult["invalidateActivityMap"] || {};
                            var isPass = true;
                            var nodeNameStr = "";
                            
                            var humenNodeMatchAlertMsg = cmp.parseJSON(cpMatchResult["humenNodeMatchAlertMsg"]);
                            var nodeMatchAlertMsg = "";
                            if(cpMatchResult["allSelectNodes"] && cpMatchResult["allSelectNodes"].length > 0){
                                for(var i = 0, len = cpMatchResult["allSelectNodes"].length; i < len; i++){
                                    var value = cpMatchResult["allSelectNodes"][i];
                                    var nodeNameStr1 = invalidateActivityMap[value];
                                    var isNodeValidate = (nodeNameStr1 != null && nodeNameStr1.trim() != "") ? true : false;
                                    if (isNodeValidate) {
                                        isPass = false;
                                        nodeNameStr += (nodeNameStr != null && nodeNameStr.trim() == "") ? nodeNameStr1 : "、"
                                                + nodeNameStr1;
                                    }
                                    
                                  //节点匹配弹出信息(目前动态匹配在使用)
                                    if(humenNodeMatchAlertMsg){
                                  	  var nodeMatchAlertMsg1 = humenNodeMatchAlertMsg[value];
                                  	  var humenNodeValidate= (nodeMatchAlertMsg1!=null && nodeMatchAlertMsg1.trim()!="")?true:false;
                                  	  if(humenNodeValidate){
                                  		nodeMatchAlertMsg = nodeMatchAlertMsg1;
                                  		  isPass = false;
                                  		  break;
                                  	  }
                                    }
                                }
                            }

                            if (!isPass) {
                            	var alertMsg = "";
                            	if(nodeMatchAlertMsg){
                            		alertMsg = nodeMatchAlertMsg;
                            	}else{
                            		alertMsg = cmp.i18n("workflow.label.belowNoDedisabled", [nodeNameStr]);
                            	}
                                //以下节点不可用，不能处理流程，请联系单位管理员处理: <br/> + nodeNameStr
                                _this.alert(alertMsg, function(){
                                    handResultFn(false);
                                });
                                return false;
                            } else {
                                var tempRet = _this.doWorkflowValue(cpMatchResult);
                                handResultFn(tempRet);
                                return tempRet;
                            }
                        }
                    },
                    error : function(req){
                        cmp.dialog.loading(false);
                        _this.alert(cmp.i18n("workflow.alert.skip.people.error"), function(){
                            handResultFn(false);
                        });
                    }
                })); 
                
            } else {//提交流程
                var tempRet = _this.doWorkflowValue(cpMatchResult);
                handResultFn(tempRet);
                return tempRet;
            }
        }
    }
}

/**
 * 判断是否超过了最大选择数量
 */
WorkFlowDesigner.prototype.isHandSelectOk = function(cpMatchResult) {
    
    var _this = this;
    
    var hst = cpMatchResult.hst;
    if (hst != null) {// 指定数目
        hst = parseInt(hst);
        if (hst > 0) {
         // 获得所有人工选中的分支数目
            var cCount = 0;
            
            var viewEle = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
            var checkedInputs = viewEle.querySelectorAll("input");
            if(checkedInputs){
                for(var i = 0, len = checkedInputs.length; i < len; i++){
                    if(checkedInputs[i].getAttribute("conditionType") == "2" && checkedInputs[i].checked){
                        cCount++;
                    }
                }
            }
            if (cCount > hst) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 添加已选人员
 */
WorkFlowDesigner.prototype._addSelectOperator = function(toAddData, selectId, id, name, pic, post){
    
    var _this = this;
    
    var d = {
            "value" : id,
            "name" : name, 
            "pic" : pic,
            "post" : post
        };
    
    if(toAddData){
        
        var list = _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId];
        if(!list){
            list = [];
        }
        list.push(d);
        _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId] = list;
    }
    
    var operatorUL = _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.mainDiv.querySelector("#selected-operator-ul");
    operatorUL.insertAdjacentHTML("beforeEnd", _this._addSelectOperatorTpl([d]));
    _this._setSelectOperatorWidth(operatorUL, 1);
}

/**
 * 拼装已选人员html
 */
WorkFlowDesigner.prototype._addSelectOperatorTpl = function(pDatas){
    var operators = "";
    for(var i = 0; i < pDatas.length; i++){
        var d = pDatas[i];
        if(!d.pic){
            d.pic = "";
        }
        operators +=  '<div memberId="'+d.value+'" class="selected-operator-item">' +
                        '<img class="cmp-pull-left img_setting" src="'+d.pic+'"  />'+
                        '<div class="name cmp-ellipsis">'+d.name+'</div>'+
                        '</div>';
    }
    return operators;
}

/**
 * 批量添加已选人员
 */
WorkFlowDesigner.prototype._addSelectOperatorList = function(pDatas){
    
    var _this = this;
    
    var operatorUL = _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.mainDiv.querySelector("#selected-operator-ul");
    operatorUL.insertAdjacentHTML("beforeEnd", _this._addSelectOperatorTpl(pDatas));
    _this._setSelectOperatorWidth(operatorUL, pDatas.length);
}

WorkFlowDesigner.prototype._setSelectOperatorWidth = function(operatorUL, a){
    
    var num = 0;
    if(a != 0){
        num = parseInt(operatorUL.getAttribute("data-selectedNum"), 10) + a;
    }
    operatorUL.setAttribute("data-selectedNum", num);
    
    //设置宽度
    operatorUL.style.width = (num * 54) + "px";
    
    var method = "", className = "display_none",
        tarEle = operatorUL.parentNode,//#selected-operator-scroll; 
        tarClass = tarEle.classList;
    if(num === 0){
        if(!tarClass.contains(className)){
            method = "add";
        }
    }else{
        if(tarClass.contains(className)){
            method = "remove";
        }
    }
    
    if(method !== ""){
        tarClass[method](className);
        //重新计算容器高度
        var _this = this, ulId = tarEle.getAttribute("currentUL");
        setTimeout(function(){
            var branchMainDialog = _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG;
            var cul = branchMainDialog.mainDiv.querySelector("#" + ulId);
            var selectedDiv = branchMainDialog.mainDiv.querySelector("#selected-operator-scroll");
          
            //ios怪得很， 不这样处理， 直接空白
            cul.style.overflow = "hidden";
            
            cul.style.height = (branchMainDialog.mainDivHeight - selectedDiv.offsetHeight) + "px";
            
          //ios怪得很， 不这样处理， 直接空白
            cul.style.overflow = "auto";
            
            ulId = null;
            _this = null;
        }, 50);
    }
}

/**
 * 移除已选人员
 */
WorkFlowDesigner.prototype._removeSelectOperator = function(toClearData, selectId, id){
    var _this = this;
    
    if(toClearData){
        var list = _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId];
        if(list){
            if(!id){
                delete _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId];
            }else{
                for(var i = 0, len = list.length; i < len; i++){
                    if(id == list[i]["value"]){
                        list.splice(i, 1);;
                        break;
                    }
                }
            }
        }
    }
    
    var operatorUL = _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.mainDiv.querySelector("#selected-operator-ul");
    if(!id){
        operatorUL.innerHTML = "";//移除所有
        _this._setSelectOperatorWidth(operatorUL, 0);
    }else{
        
        var os = operatorUL.querySelectorAll(".selected-operator-item");
        if(os){
            for(var i = 0; i < os.length; i++){
                if(os[i].getAttribute("memberId") == id){
                    os[i].remove();
                    _this._setSelectOperatorWidth(operatorUL, -1);
                    break;
                }
            }
        }
    }
}

/**
 * 分支/子流程选人
 */
WorkFlowDesigner.prototype.choosePerson = function(obj, selectOrg){
    
    
    var _this = this;
    
    var pType = obj.getAttribute("selectType");
  //是否允许选择组织人员
    var canSelectOrgMember = obj.getAttribute("canSelectOrgMember");
    var selectStyle = obj.getAttribute("selectStyle");
    
  //selectOrg === true 强制执行选人界面选人
    if(selectStyle == "select_list" && selectOrg !== true){
        
        //展示
        var peopleULViewId = obj.getAttribute("selectPeopleId");
        var container = _this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.mainDiv;
        var selectedDiv = container.querySelector("#selected-operator-scroll");
        
        //影藏其他的
        var uls = container.querySelectorAll("ul");
        for(var i = 0, len = uls.length; i < len; i++){
            var u = uls[i];
            if(!u.classList.contains("display_none")){
                u.classList.add("display_none");
            }
        }

        selectedDiv.setAttribute("currentUL", peopleULViewId);
        var cul = container.querySelector("#" + peopleULViewId);
        var selectId = cul.getAttribute("selectId");
        
        //移除所有
        _this._removeSelectOperator(false, selectId);
        
        
        //回填
        /*var tempInputs = cul.querySelectorAll("input:checked");
        if(tempInputs && tempInputs.length > 0){
            for(var j = 0, len = tempInputs.length; j < len; j++){
                var pic = tempInputs[j].nextElementSibling.getAttribute("src");
                _this._addSelectOperator(tempInputs[j].value, tempInputs[j].getAttribute("memberName"), pic);
            }
        }*/
        
        var sMembers = _this.WF_SELECT_MEMBER_DIALOG_DATAS_SELECTED[selectId]
        if(sMembers){
            _this._addSelectOperatorList(sMembers)
        }
        //页面绘制
        if(cul.innerHTML == ""){
            var nodeMembers = _this.WF_SELECT_MEMBER_DIALOG_DATAS[selectId];
            var mDatas = nodeMembers.slice(0, Math.min(40, nodeMembers.length));
            
            for(var i = 0; i < mDatas.length; i++){
                mDatas[i]["headshotURL"] = cmp.origin + "/rest/orgMember/avatar/" + mDatas[i]["id"] + "?maxWidth=200";
            }
            
            var h = cmp.tpl(WorkFlowDesignerTpls.SELECT_MEMBER_LI_TPL, {"start" : 0, "datas" : mDatas});
            cul.innerHTML = h;
            
            cmp.IMG.detect();
        }
        
        cul.style.height = (_this.wfViewEleId.WF_SELECT_MEMBER_DIALOG.mainDivHeight - selectedDiv.offsetHeight) + "px";
        cul.classList.remove("display_none");
    } else {
        
      //通过这种方式传递参数，直接传递，第一次初始化后就不变了
        _this.__domId__ = obj.getAttribute("selectId");
        
        //回填值
        var tempContainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv,
            tNames = tempContainer.querySelector("#" + _this.__domId__ + "_name").innerText,
            tIds = tempContainer.querySelector("#" + _this.__domId__).value,
            tFillBackData = [];
        
        if(tIds){
            var tIdList = tIds.split(",");
            var tNameList = tNames.split("、");
            for(var i = 0; i < tIdList.length; i++){
                var m = {
                        id:tIdList[i],
                        name:tNameList[i],
                        type:"member"
                      }
                tFillBackData.push(m);
            }
        }

        
        var max = 1;
        if(pType == "N"){
            max = -1;
        }
        
        var _selectOrgDialogTitle = "";
        if(_this.processModeName && _this.processModeName!="") {
        	_selectOrgDialogTitle = _this.processModeName;
        }
        var selectConfig = {
            fillBackData : tFillBackData,
            maxSize : max,
            title : _selectOrgDialogTitle,
            selectCallback : function(members){
                if(members && members.length > 0){
                    var names = "";
                    var ids = "";
                    var posts = "";
                    for(var i = 0; i < members.length; i++){
                        if(ids != ""){
                            ids += ",";
                            names += "、";
                            posts += ",";
                        }
                        names += members[i]["name"];
                        ids += members[i]["id"];
                        posts += members[i]["post"];
                    }
                    _this._setSelectMember(names, ids, _this.__domId__, posts, true, "");
                    delete _this.__domId__;
                }
            }
        }
        
        //调用选人组件选择执行人
        _this._selectOrgMember4Branch(selectConfig);
    }
}

/** 分支调用选人界面选人 **/
WorkFlowDesigner.prototype._selectOrgMember4Branch = function(config){
    
    /**
     * config.fillBackData 
     * config.maxSize
     * config.title
     * config.excludeData
     * config.selectCallback
     */
    
    var _this = this;
    
    var tempLabel = _this.CMP_ALL_PANELS_NO_OUTER_VJOIN;
    if("collaboration" == _this.info.category){
        tempLabel = _this.CMP_ALL_PANELS_NO_OUTER
    }
    
    cmp.selectOrg(_this.wfViewEleId.WF_CHOOSE_MEMBER_ID, {
        type : 2,
        // flowType:2,
        lightOptsChange : true,// 轻表单模式选人
        fillBackData : config.fillBackData || [],
        //excludeData : config.excludeData || [],
        //disable:true,
        jump : false,
        permission : true,
        lightMemberPermission : true,
        label : tempLabel,
        maxSize : config.maxSize || 1,
        flowOptsChange : true,
        minSize : 1,
        accountID : "", // 轻表单需要传当前登录人员的单位ID
        selectType : 'member',
        title : config.title || "",
        callback : function(result) {
            
            var selectMembers = [];
            if (result) {
                var jsonRet = cmp.parseJSON(result);//
                var mResult = jsonRet.orgResult;
                if (mResult) {
                    for (var i = 0, len = mResult.length; i < len; i++) {
                        var member = null;
                        if (typeof mResult[i] === "string") {
                            member = cmp.parseJSON(mResult[i]);
                        } else {
                            member = mResult[i];
                        }
                        
                        selectMembers.push({
                            "id" : member["id"],
                            "name" : member["name"] || member["n"],
                            "post" : member["post"]
                        });
                    }
                }
            }
            if(config.selectCallback){
                config.selectCallback(selectMembers);
            }
            config = null;
        }
    });
}



/**
 * 是否显示子流程选人部分
 */
WorkFlowDesigner.prototype.showSubSelectPeoplePart = function(checkObj){
    
    var _this = this;
    //以前这里有交互
 }

/** 
 * 分支选人
 */
WorkFlowDesigner.prototype.showSelectPeoplePart = function(checkObj, cpMatchResult, context) {

    var _this = this;
    
    var conteainer = _this.wfViewEleId.WF_BRANCH_DIALOG.mainDiv;
    
    var toNodeId = checkObj.getAttribute("id");
    var processMode = checkObj.getAttribute("processMode");
    var isNeedSelectPeople = checkObj.getAttribute("needSelectPeople");
    var na = checkObj.getAttribute("na");
    var needPeopleTag = checkObj.getAttribute("needPeopleTag");

    var toNodeName = _this.wfSelectInfo.nodeIdAndNodeNameMap[toNodeId];
    
    //na==2 没有匹配人时自动跳过, 这个应该没有用了，先不删
    if (na == "2" && needPeopleTag == "true") {
        
       /* alert("怎么进入这个分支的，请联系开发描述先这个场景，谢谢！");*/
        
        //TODO 自动跳过分支节点没有验证
        if (checkObj.checked) {
        	cpMatchResult["allSelectNodes"].push(toNodeId);
            var preAllSelectNodesForBranchCheck = [];
            var preAllSelectInformNodesForBranchCheck = [];
            var currentSelectInformNodesForBranchCheck = [];
            var preAllNotSelectNodesForBranchCheck = [];
            
            var branchInputs = conteainer.querySelectorAll(".branch_li_input_to_select");
            if(branchInputs && branchInputs.length > 0){
                for(var i = 0, len = branchInputs.length; i < len; i++){
                    var branchInput = branchInputs[i];
                    if(branchInput.getAttribute("type") == "checkbox"){
                     // 分支
                        var nodeId = branchInput.getAttribute("id");
                        var nodeName = branchInput.getAttribute("nodeNamee");
                        var nodeIsInform = branchInput.getAttribute("isInform");
                        var checked = branchInput.checked;
                        var isForce = branchInput.getAttribute("isForce");
                        if (checked) {
                            if (isForce == 'false') {
                                preAllSelectNodesForBranchCheck.push(nodeId);
                                if (nodeIsInform == 'true') {
                                    currentSelectInformNodesForBranchCheck.push(nodeId);
                                }
                            }
                        } else {
                            if (isForce == 'false') {
                                preAllNotSelectNodesForBranchCheck.push(nodeId);
                            }
                        }
                    }
                }
            }
            
            // 把cpMatchResult中的加进来
            var _allSelectNodes = cpMatchResult["allSelectNodes"];
            if (_allSelectNodes && _allSelectNodes.length > 0) {
                for(var i = 0, len = _allSelectNodes; i < len; i++){
                    preAllSelectNodesForBranchCheck.push(_allSelectNodes[i]);
                }
            }
            var _allNotSelectNodes = cpMatchResult["allNotSelectNodes"];
            if (_allNotSelectNodes && _allNotSelectNodes.length > 0) {
                for(var i = 0, len = _allNotSelectNodes; i < len; i++){
                    preAllNotSelectNodesForBranchCheck.push(_allNotSelectNodes[i]);
                }
            }
            var _allSelectInformNodes = cpMatchResult["allSelectInformNodes"];
            if (_allSelectInformNodes && _allSelectInformNodes.length > 0) {
                for(var i = 0, len = _allSelectInformNodes; i < len; i++){
                    preAllSelectInformNodesForBranchCheck.push(_allSelectInformNodes[i]);
                }
            }
            
            //回调函数
            function checkCallback(isMyNeedSelectPeople){

                if (isMyNeedSelectPeople) {// 需要选人，则在该节点后面显示选人对话框
                    
                    var htmlContent = "";
                    var pType = "N";
                    if (processMode == "single") {// 单人,调用选人界面
                        pType = "1";
                    }
                    
                    var selectPeopleContentTpl ='  <h5 class="wk-select-hand wk-select-operator">' +
                    '    <span class="cmp-icon see-icon-v5-common-node-operator-fill"></span>' +
                    '    <span id="node_<%=this.toNodeId%>_peoples" name="node_<%=this.toNodeId%>_peoples">'+cmp.i18n("workflow.label.nodeOperator")/*节点执行人*/+':</span>'+
                    '    <span id="manual_select_node_id<%=this.toNodeId%>_name">'+cmp.i18n("workflow.label.operatorEmpty")/*执行人为空，请选择！*/+'</span>'+
                    '    <input type="hidden" id="manual_select_node_id<%=this.toNodeId%>" name="manual_select_node_id<%=this.toNodeId%>" inputName="<%=this.toNodeName%>'+cmp.i18n("workflow.label.operatorEmpty")/*执行人为空，请选择！*/+'"/>' +
                    '  </h5>';
                    
                    var selectPeopleContentMap = {
                            "toNodeId" : toNodeId,
                            "toNodeName" : toNodeName
                        }
                    var selectpPeopleHtml = cmp.tpl(selectPeopleContentTpl, selectPeopleContentMap);
                    
                    //TODO 逻辑不通， 需要添加事件
                    
                    _this.wfSelectInfo.needSelectPeopleNodeNum++;
                    _this.wfSelectInfo.needPeopleTagObject[toNodeId] = toNodeId;
                    
                } else {// 去掉该节点后面显示的选人对话框
                    
                    //TODO delete 不需要选人
                }
            }
            
            //TODO 这里可以性能优化， 做缓存
            var tempCeckParams = {
                    "context" : context,
                    "toNodeId" : toNodeId,
                    "preAllSelectNodesForBranchCheck" : preAllSelectNodesForBranchCheck,
                    "preAllNotSelectNodesForBranchCheck" : preAllNotSelectNodesForBranchCheck,
                    "preAllSelectInformNodesForBranchCheck" : preAllSelectInformNodesForBranchCheck,
                    "currentSelectInformNodesForBranchCheck" : currentSelectInformNodesForBranchCheck,
                    "callback" : checkCallback
            }
            
            _this.transCheckBrachSelectedWorkFlow(tempCeckParams);
             
        } else {
        	_this._deleteIfInArray(cpMatchResult["allSelectNodes"],toNodeId);
            //TODO 需要影藏选人
            
            if (_this.wfSelectInfo.needPeopleTagObject[toNodeId]) {
                _this.wfSelectInfo.needSelectPeopleNodeNum--;
                _this.wfSelectInfo.needPeopleTagObject[toNodeId] = "";
            }
        }
    } else {
        
        var disabled = true;
        
        if (checkObj.checked) {
        	cpMatchResult["allSelectNodes"].push(toNodeId);
            disabled = false;
            
            if (isNeedSelectPeople == 'true') {
                _this.wfSelectInfo.needSelectPeopleNodeNum++;
            }
        } else {
        	_this._deleteIfInArray(cpMatchResult["allSelectNodes"],toNodeId);
            if (isNeedSelectPeople == 'true') {
                _this.wfSelectInfo.needSelectPeopleNodeNum--;
            }
        }
        
      //获取到串发设置radio
        var liNode = checkObj.parentNode.parentNode;
        var radioDivs = liNode.querySelectorAll(".radio-div-selector");
        if(radioDivs && radioDivs.length > 0){
            
            var disClass = "cmp-disabled";
            for(var i = 0; i < radioDivs.length; i++){
                var radioDiv = radioDivs[i], radioDivClass = radioDiv.classList;

                var radio = radioDiv.querySelector("input[type='radio']");
                if(radio){
                    radio.disabled = disabled;
                }
                
                if(disabled){
                    if(!radioDivClass.contains(disClass)){
                        radioDivClass.add(disClass);
                    }
                }else{
                    if(radioDivClass.contains(disClass)){
                        radioDivClass.remove(disClass);
                    }
                }
            }
        }
    }

}

/**
 * 自动跳过节点前的分支被选中时的校验：后面是否会有分支或选人的节点，如果有，则返回true，否则返回false
 */
WorkFlowDesigner.prototype.transCheckBrachSelectedWorkFlow = function(params){
    
    var context = params["context"],
        toNodeId = params["toNodeId"],
        preAllSelectNodesForBranchCheck = params["preAllSelectNodesForBranchCheck"],
        preAllNotSelectNodesForBranchCheck = params["preAllNotSelectNodesForBranchCheck"],
        preAllSelectInformNodesForBranchCheck = params["preAllSelectInformNodesForBranchCheck"],
        currentSelectInformNodesForBranchCheck = params["currentSelectInformNodesForBranchCheck"];
    
    var callback = params["callback"];
    
  //设置流程ID
    this.setProcessId(context);
    
    var obj = {
            "context" : cmp.toJSON(context),
            "checkedNodeId" : checkedNodeId,
            "preAllSelectNodesForBranchCheck" : cmp.toJSON(preAllSelectNodesForBranchCheck),
            "preAllNotSelectNodesForBranchCheck" : cmp.toJSON(preAllNotSelectNodesForBranchCheck),
            "preAllSelectInformNodesForBranchCheck" : cmp.toJSON(preAllSelectInformNodesForBranchCheck),
            "currentSelectInformNodesForBranchCheck" : cmp.toJSON(currentSelectInformNodesForBranchCheck)
        };
    var _postDatas = {"_json_params" : obj}
    
    //这里是同步的
    $s.Workflow.transCheckBrachSelectedWorkFlow({}, _postDatas, errorBuilder({
            
            success : function(retMap) {
                if(callback){
                    var r = retMap.result == "true";
                    callback(r);
                }
            },
            error : function(req){
                _this.alert(cmp.i18n("workflow.alert.presend.error"),function(){
                    if(callback){
                        callback(false);
                    }
                });
            }
    }));
}

/**
 * 显示/隐藏不满足条件的分支
 * @type:0和1
 */
WorkFlowDesigner.prototype.showFailedCondition = function(obj, type, listView, isShow) {

    var hasChanged = false;
    var show = isShow== undefined ? true : isShow;
    
    var branchLis = listView.querySelectorAll(".branch_li");
    
    if(branchLis && branchLis.length > 0){
        for(var i = 0, len = branchLis.length; i < len; i++){
            
            var bLi = branchLis[i];
            var liInput = bLi.querySelector("input");
            
            var checked = liInput.checked;
            var checked1 = liInput.getAttribute("isSelect");
            var isDefaultShow = liInput.getAttribute("defaultShow");
            var toNodeId = liInput.getAttribute("id");
            
            var tempShow = true;
            var isCurrentDisplayNone = bLi.classList.contains("display_none");
            if (checked || checked1 || isDefaultShow == 'true') {
                tempShow = true;
            } else {
                hasChanged = true;
                if (type == 0 || isCurrentDisplayNone) {
                    tempShow = true;
                } else {
                    tempShow = false;
                }
            }
        
            if(tempShow){
                if(bLi.classList.contains("display_none")){
                    bLi.classList.remove("display_none")
                }
            }else{
                if(!bLi.classList.contains("display_none")){
                    bLi.classList.add("display_none")
                }
            }
        }
    }
    
    if (obj && hasChanged && show) {
        var showType = "";
        var txtSpan = obj.querySelector(".wk_show_hide_branch_text");
        var showLabel = "";
        if (type == 0) {
            showType = "1";
            showLabel = txtSpan.getAttribute("upLabel"); //隐藏
        } else {
            showType = "0";
            showLabel = txtSpan.getAttribute("downLabel"); //显示
        }
        obj.setAttribute("data-type", showType);
        txtSpan.innerText = showLabel;
    }
}


/**
 * 将预提交值回填
 */
WorkFlowDesigner.prototype.doWorkflowValue = function(cpMatchResult){
    
    var _this = this;
    
    var conditon_Str="";

    if(cpMatchResult["allSelectNodes"] && cpMatchResult["allSelectNodes"].length > 0){
        for(var i = 0, len = cpMatchResult["allSelectNodes"].length; i < len; i++){
            var value = cpMatchResult["allSelectNodes"][i];
            if(conditon_Str == ""){
                conditon_Str +="{\"condition\":[";
            }else{
                conditon_Str += ",";
            }
            conditon_Str +="{\"nodeId\":\""+value+"\",";
            conditon_Str +="\"isDelete\":\"false\"}";
        }
    }
    
    if(cpMatchResult["allNotSelectNodes"] && cpMatchResult["allNotSelectNodes"].length>0){
        for(var i = 0, len = cpMatchResult["allNotSelectNodes"].length; i < len; i++){
            var value = cpMatchResult["allNotSelectNodes"][i];
            if(conditon_Str == ""){
                conditon_Str +="{\"condition\":[";
            }else{
                conditon_Str += ",";
            }
            conditon_Str +="{\"nodeId\":\""+value+"\",";
            conditon_Str +="\"isDelete\":\"true\"}";
        };
      }
    
    if(conditon_Str!=""){
      conditon_Str +="]}";
    }
    
    
    _this.setInputVal("workflow_node_condition_input", conditon_Str);
    
    return true;
}

/**
 * 组装数据
 * @deprecated 流程的数据进行内存存放，所有不需要查找dom获取
 * @since V5-A8 6.0
 */
WorkFlowDesigner.prototype.formPostData = function(selector) {
    var ret = {}

    function _formData(type, ele, retJson) {
        var inputs = ele.querySelectorAll(type);
        if (inputs && inputs.length > 0) {
            for (var i = 0, len = inputs.length; i < len; i++) {
                var input = inputs[i];
                var tempId = input.getAttribute("id");
                if (!tempId) {
                    tempId = input.getAttribute("name");
                }
                if (tempId) {
                    retJson[tempId] = input.value;
                }
            }
        }
    }

    if (selector) {
        var ele = document.getElementById(selector);
        if (ele) {
            _formData("input", ele, ret);
            _formData("textarea", ele, ret);
        }
    }

    return ret;
}

/**
 * 生成一个层级模板
 * @param config 弹出框配置
 * @param check 是否校验弹出时间， 程序自动创建时
 */
WorkFlowDesigner.prototype.dialog = function(config, check){
    
    var _now = new Date().getTime();
    if(check !== false){
        
        var _last = WorkflowH5Diaolg.prototype._lastDialogTime_;
        if(_last && (_now - _last < 500)){
            //防止多次点击弹出多个窗口
            return;
        }
    }
    
    WorkflowH5Diaolg.prototype._lastDialogTime_ = _now;
    
    return new WorkflowH5Diaolg(config);
}

/**
 * 创建dom
 */
WorkFlowDesigner.prototype.createDom = function() {

    var _this = this;

    if (!this.isCreateDom) {

        //托管模式
        if(this.info.model == "trustee"){
            
            _this.containerId = "edit_workfow_container" + (new Date().getTime());

            // 流程展示容器
            _this.wfShowId = "wf_div" + (new Date().getTime());

            _this.info.state != "view";
            var wfTitle = cmp.i18n("workflow.label.editwf"),
                bottonLabel = "",
                //rConfig = null,
                toastConfig = null,
                _beforeDisappear = null;
            
            if(_this.info.state == "view"){
                
                wfTitle = cmp.i18n("workflow.label.viewwf"); // 查看流程
                bottonLabel = cmp.i18n("workflow.label.close"); // 关闭
                
            }else{
                toastConfig = {
                    label : cmp.i18n("workflow.label.clickEditWf"),//点击头像编辑流程
                    time : 3000,
                    layout : "center"
                }
                
                bottonLabel = cmp.i18n("workflow.finished.label");// 完成

                _beforeDisappear = function(){
                    var tRet = _this.cacheDatas.multistageSignDeptList.length > 0;
                    if(tRet){
                        _this.alert(cmp.i18n("workflow.label.clickQuestionMarkSelect")/*请点击问号进行选人. */);
                    }
                    return !tRet;
                }
                
            }
            
            var wfDialogParams = {
                    
                    initHeader : false,
                    title : wfTitle,
                    dir : "bottom-go",
                    zIndex : _this.style.zIndex,
                    id : _this.containerId,//
                    containerId : _this.wfShowId,
                    show : false,// 默认显示
                    hideType : "hide",
                    //rightBtnConfig : rConfig,
                    beforeDisappear : _beforeDisappear,
                    bottonConfig : {
                        buttons : [
                          {
                            isPopBtn : true,
                            label : bottonLabel,
                            hander : function(){
                                _this.switchActive();
                            }
                          }
                        ]
                    },
                    toastConfig : toastConfig,
                    onInit : function() {

                        // 创建工作流字段域
                        /*var c = document.createElement("DIV");
                        c.setAttribute("id", _this.jsonKey);
                        c.style.display = "none";
                        for ( var key in _this.jsonFileds) {
                            _this._createNewFormElement(c, key, _this.jsonFileds[key]);
                        }
                        wfDialog.container.appendChild(c);*/
                    }
                }
            
               
                
            var wfDialog = _this.dialog(wfDialogParams);

            //记录
            this.wfViewEleId.WF_MAIN_DIALOG = wfDialog;
        }
        this.isCreateDom = true;
    } else {
        //_this.alert("创建数据dom失败，没有找到ID对应的DOM节点");
    }
}

/**
 * 创建 hidden 元素
 * @deprecated 数据直接方内存， 不动态创建影藏域
 * @since 6.0
 */
WorkFlowDesigner.prototype._createNewFormElement = function(formEle, eleName, eleValue){
    var newEle = document.createElement("input");
    newEle.setAttribute("name", eleName);
    newEle.setAttribute("id", eleName);
    newEle.setAttribute("type", "hidden");
    newEle.setAttribute("disabled", "disabled");
    newEle.value = eleValue || "";
    formEle.appendChild(newEle);
    return newEle;
}

/**
 * 流程图界面计算及展示
 */
WorkFlowDesigner.prototype.showFirst = function(){
    this.switchActive(true);
}

/**
 * 校验流程是否可见
 */
WorkFlowDesigner.prototype.visible = function(){

    var ret;
    if(this.info.model == "silent"){
        ret = false;
    }else if(this.info.model == "customer"){
        ret = true;
    }else{
        ret = this.wfViewEleId.WF_MAIN_DIALOG.isVisible;
    }
    return ret;
}

/**
 * 显示或影藏流程图
 */
WorkFlowDesigner.prototype.switchActive = function(alwaysShow){
    
    if(this.info.model == "trustee"){//托管模式才执行
        if(!this.wfViewEleId.WF_MAIN_DIALOG.isVisible || alwaysShow){
            this.wfViewEleId.WF_MAIN_DIALOG.show();
        }else{
            this.wfViewEleId.WF_MAIN_DIALOG.hide();
        }
    }
}

/**
 * 流程是否为空
 */
WorkFlowDesigner.prototype.isWfEmpty = function(){
    return this.cacheDatas.isEmpty;
}

/**
 * params.jsonData : json数据[{id:xx,name:xxx,entityType:xxx,accountId:xxx,accountName:xxx}]
 * params.callback : 回调函数(names, jsonData)
 * params.type     : 0：串发，1：并发，2：会签
 * params.currentNodeId : 当前节点ID
 * params.policyId : 节点权限code
 * params.policyName : 节点名称
 * params.drawWf : true/画图， false/不画图
 *    
 */
WorkFlowDesigner.prototype.createXML = function(params){
    
    var newData = params["jsonData"],
        type = params["type"],
        currentNodeId = params["currentNodeId"],
        policyId =  params["policyId"],
        policyName =  params["policyName"],
        callback = params["callback"],
        drawWf = params["drawWf"],
    	errorCallback = params["errorCallback"];
    
    if(currentNodeId == "start"){
        currentNodeId = "";
    }
    
    var _this = this;
    
    if(!policyId){
        policyId =  _this.info.defaultPolicyId;
        policyName =  _this.info.defaultPolicyName;
    }
    
    var tempData = {
            "workflowXml" : this.getInputVal("process_xml"),
            "orgJson" : newData,
            "currentUserId" : _this.info.currentUserId,
            "currentUserName" : _this.info.currentUserName,
            "currentAccountId" : _this.info.currentAccountId,
            "currentAccountName" : _this.info.currentAccountName,
            "defaultPolicyId" : policyId,
            "defaultPolicyName" : policyName,
            "currentNodeId" : currentNodeId || "",
            "showNodes" : _this._getAddNodeInfo(),
            "type" : type,
            "caseId" : _this.jsonFileds.caseId
       }
    
    cmp.dialog.loading("");
    
    $s.Workflow.getProcessXmlandJson({}, tempData, errorBuilder({
    	exeSelfError : true,
    	success : function(result){
            cmp.dialog.loading(false);
            
            var jsonData = result[1] || "[]";
            _this.setInputVal("process_xml", result[0]);
            _this.cacheDatas.isEmpty = false;
            
            if(callback){
                if(jsonData){
                    jsonData = cmp.parseJSON(jsonData);
                    
                    //触发节点变动事件
                    _this.fire("nodeChange", jsonData);
                    
                    callback(jsonData);
                    
                    if(drawWf === true){
                        _this.drawWf(jsonData);
                    }
                }
            }
        },
        error : function(result){
        	errorCallback(result);
        }
    }));
 }

/**
 * 编辑页面
 */
WorkFlowDesigner.prototype.edit = function(xparams){
    
    var ntime = new Date().getTime();
    if(ntime - this.clickTime < 300){
        this.clickTime = ntime;//连续点击的情况
        return;
    }
    this.clickTime = ntime;
    
    var params = xparams || {};
    
    var _this = this,
        isEdit = params.isEdit,
        currentNodeId = params.currentNodeId || "",
        initMembers = params.initMembers || [];
    
    if(this.isWfEmpty() || isEdit){
        
        //打开选人界面
        this.selectMembers({
            id : _this.SELECT_ORG_TYPE_1,
            flowType : 3,
            label : _this.CMP_ALL_PANELS,
            initMembers : initMembers,
            callback : function(datas, type){
                
                var xmlParams = {
                        "jsonData" : cmp.toJSON(datas),
                        "type" : _this.FLOW_TYPE[type],
                        "currentNodeId" : currentNodeId,
                        "policyId" :  _this.info.defaultPolicyId,
                        "policyName" : _this.info.defaultPolicyName,
                        "callback" : function(jsonData){
                            _this.drawWf(jsonData);
                        }
                  }
                _this.createXML(xmlParams);
            }
        });
        
    }else{
        
        //如果是只读，则直接展示流程图
        if(this.info.state == "view" && !_this.cacheDatas.loadViewDatas){
            
            var processId = _this.jsonFileds.processId;
            var isRunning = true;
            
            if(processId == ""){
                isRunning = false;
                processId = _this.info.processTemplateId;
            }
            var loadWfParams = {
                "isRunning":isRunning,
                "processId" : processId,
                "caseId" : _this.jsonFileds.caseId
            }
            
            $s.Workflow.getWorkflowDiagramData(loadWfParams, errorBuilder({
                success : function(jsonData){
                    //画图
                    _this.drawWf(jsonData);
                    
                    //标记流程图已经加载了
                    _this.cacheDatas.loadViewDatas = true;
                }
            }))
        }else{
          //只是展示
            this.switchActive();
        }
    }
}

/**
 * 加载XML
 */
WorkFlowDesigner.prototype._loadXML = function(callback){
	callback();//该方法在H5传递processXml为tempId之后，不再验测并加载processXml，这里直接回调
	/*
    var xml = this.getInputVal("process_xml");
    var processId = this.jsonFileds.processId;
    var caseId = this.jsonFileds.caseId;
    if(xml == "" && processId != "" && caseId != ""){
        var params = {
                "isRunning":true,
                "processId" : processId,
                "caseId" : caseId
        }
        var _this = this;
        $s.Workflow.getWorkflowXMLData(params, errorBuilder({
            success : function(result){
                var processXML = result.process_xml;
                _this.setInputVal("process_xml", processXML);
                callback();
            }
        }))
    }else {
        callback();
    }*/
}

/**
 * 减签
 */
WorkFlowDesigner.prototype._deleteWfNode = function(pDatas){
    
    var _this = this;

    //TODO 各种场景 不同模块选人界面不同
    var activityId = pDatas["activityId"];
    var activityIdList = pDatas["activityIdList"];
    var callback = pDatas["callback"];
    var params = {
        "processId" : _this.jsonFileds.processId,
        "currentActivityId" : activityId,
        "userId" : _this.info.currentUserId,
        "activityIdList" :  cmp.toJSON(activityIdList),
        "baseProcessXML" : _this.getInputVal("process_xml"),
        "messageDataList":_this.getInputVal("process_message_data"),
        "changeMessageJSON":_this.getInputVal("processChangeMessage"),
        "summaryId" : _this.info.summaryId,
        "affairId" : _this.info.affairId,
        "showNodes" : _this._getAddNodeInfo(),
        "caseId" : _this.jsonFileds.caseId
    }
      
    cmp.dialog.loading("");
      
    $s.Workflow.deleteNode({}, params, errorBuilder({
        success : function(result){
            cmp.dialog.loading(false);
            if(result && result[0]){
                _this.setInputVal("process_xml", result[0]);
            }
            if(result && result[1]){
                _this.setInputVal("process_message_data", result[1]);
            }
            if(result && result[2]){
                _this.setInputVal("processChangeMessage", result[2]);
            }
            var jsonData = result[3] || [];
            _this.cacheDatas.isEmpty = false;
            if(callback){
                callback(jsonData);
            }
        }
    }));
}

/**
 * 是否是表单正文
 */
WorkFlowDesigner.prototype._isForm = function(){
    return this.info.bodyType == "20";
}

WorkFlowDesigner.prototype.specifiesReturnNodeClk = function(targetNodeId, callback) {


    var _this = this;
        
    var params = {};
    params["caseId"] = _this.jsonFileds.caseId;
    params["currentSelectedNodeId"] = targetNodeId;
    params["currentSelectedNodeName"] = "";
    params["currentStepbackNodeId"] = _this.info.activityId;
    params["initialize_processXml"] = _this.getInputVal("process_xml");
    params["permissionAccountId"] = _this.info.currentAccountId;
    params["configCategory"] = _this.info.subCategory || _this.info.category;
    params["processId"] = _this.jsonFileds.processId;
    var isCircleBack = "0"; // 是否环形回退 1：是，0：否

    $s.Workflow.validateCurrentSelectedNode({}, params, errorBuilder({
        success : function(rs) {
            
            var SpecifiesReturn = null, _canReturn = true;
            
            if (rs[0] == 'true') {
                if (!!_this.info.currentWorkItemIsInSpecial) {
                    if (rs[2] == 'true' || rs[8] == 'true') {
        
                    /* 流程处于【直接提交给我】状态，当前节点只能进行【直接提交给我】的指定回退操作，但当前节点与被选择节点之间存在分支条件或子流程，因此不能选择该节点进行指定回退操作！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert7'))
                    _canReturn = false;
                    }
                    else {
                        /* 多次指定回退状态下，提交方式只允许选择“提交给我”。*/
                        SpecifiesReturn = {
                                "altSubmitStyle" : "0",
                                "altSubmitTitle" : cmp.i18n('workflow.special.stepback.alert8')
                        }
                    }
                }
                else {
                    if (rs[2] == 'true' || rs[8] == 'true') {
                        /* 当前节点与回退节点间有触发子流程节点，只能选择”流程重走“。*/
                        SpecifiesReturn = {
                                "altSubmitStyle" : "1",
                                "altSubmitTitle" : cmp.i18n('workflow.special.stepback.label12')
                        }
                    }
                }
    
            } else {
            	if (rs[14] == 'true') {
                    _this.alert(cmp.i18n('workflow.validate.stepback.msg15'));
                    _canReturn = false;
                }else if (rs[13] == 'true') {
                    _this.alert(cmp.i18n('workflow.validate.stepback.msg13'));
                    _canReturn = false;
                }
                else if (rs[12] == 'true') {
                    /* 该流程的子流程已核定通过，不能回退！ */
                    _this.alert(cmp.i18n('workflow.validate.stepback.msg4'));
                    _canReturn = false;
                }
                else if (rs[11] == 'true') {
                    /* 节点匹配不到人，不能回退! */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert11'));
                    _canReturn = false;
                }
                else if (rs[3] == 'true') {// 有封发节点
                    /* 被选择的节点与当前处理节点之间有已办的交换类型节点，不能选择！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert1'));
                    _canReturn = false;
                }
                else if (rs[4] == 'true') {
                    /* 被选择的节点与当前处理节点之间有已办的核定节点，不能选择！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert2'));
                    _canReturn = false;
                }else if(rs[15] == 'true'){
                    /* 被選擇的節點與當前處理節點之間有設置為不允許回退已辦的節點，不能選擇！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert15.js'));
                    _canReturn = false;
                } else if(rs[16] == 'true'){
                    /* 指定回退不能越过阻塞的超级节点！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert16.js'));
                    _canReturn = false;
                } else if (rs[5] == 'true') {// 有表单审核节点
                    /* 被选择的节点与当前处理节点之间有已办的表单审核节点，不能选择！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert3'));
                    _canReturn = false;
                }
                else if (rs[6] == 'true') {// 有子流程结束节点
                    if (rs[9] == 'true') {
                    /* 被回退节点含子流程且已结束不允许被回退！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert4'));
                    _canReturn = false;
                    }
                    else {
                    /* 被选择的节点与当前处理节点之间有子流程触发节点，且触发的子流程已结束,不能选择！ */
                    _this.alert(cmp.i18n('workflow.special.stepback.alert5'));
                    _canReturn = false;
                    }
                }
                else if (rs[7] == 'true') {
                    // 当前流程为新流程，不允许选择开始节点进行指定回退操作！
                    _this.alert(cmp.i18n('workflow.special.stepback.alert6'));
                    _canReturn = false;
                }
            }
            
            //回调
            callback && callback(_canReturn, SpecifiesReturn);
        },
        error : function(){
            callback && callback(false);
        }
    }));
}
/**
 * 指定回退
 */
WorkFlowDesigner.prototype.specifiesReturn = function(callbackFn, initData) {
    
    var ntime = new Date().getTime();
    if(ntime - this.clickTime < 1000){
        this.clickTime = ntime;//连续点击的情况
        return;
    }
    this.clickTime = ntime;
    
    var _this = this;
    _this._mask(true);

    WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.SPECIFIES_RETURN, function(ret) {
        
        if(ret){
            _this.cacheDatas.currentAction = _this.actionKeysMap["SpecifiesReturn"];// 指定回退
            
            var btns = [];
            
            /*  submitStyleCfg   指定回退的被回退者处理后流转方式（ 0  重新流转 /  1  提交回退者 /2  重新流转和提交回退者）*/
            if(_this.info.submitStyleCfg == 0 || _this.info.submitStyleCfg == 2){
                var btn1 = {
                        label : cmp.i18n("workflow.special.stepback.label6"),//流程重走
                        hander : function(){
                            var s = _this.specifiesReturnInfo;
                            if(!s){
                                _this.alert(cmp.i18n("workflow.label.selectSbackMember"));//请选择指定回退节点.
                            }else{
                                
                                if("0" == s.altSubmitStyle){
                                    _this.alert(s.altSubmitTitle);
                                }else{
                                    
                                    s.submitStyle = "0";
                                    callbackFn(s, cmp.i18n("workflow.special.stepback.label6"));
                                    
                                    _this.specifiesReturnInfo = null;
                                    _this.wfDataObj = null;
                                    specifiesReturnDialog.close();
                                    specifiesReturnDialog = null;
                                    
                                    //清除指定回退弹出框的svg画板,重新渲染
                                    var flowDom = document.querySelector("#CMPFLOWSVG");
                					if(flowDom){
                						flowDom.remove();
                					}
                					_this.wfShowId = "";
                					_this.isCreateDom = false;
                					_this._exeInit(); 
                                   
                                }
                            }
                        }
                    };
                btns.push(btn1);
            }
            
            if(_this.info.submitStyleCfg == 1 || _this.info.submitStyleCfg == 2){
                var btn2 = {
                    label : cmp.i18n("workflow.special.stepback.label7"),//直接提交给我
                    hander : function(){
                        var s = _this.specifiesReturnInfo;
                        if(!s){
                            _this.alert(cmp.i18n("workflow.label.selectSbackMember"));//请选择指定回退节点.
                        }else{
                            
                            if("1" == s.altSubmitStyle){
                                _this.alert(s.altSubmitTitle);
                            }else{
                                s.submitStyle = "1";
                                callbackFn(s, cmp.i18n("workflow.special.stepback.label7"));
                                
                                _this.specifiesReturnInfo = null;
                                _this.wfDataObj = null;
                                specifiesReturnDialog.close();
                                specifiesReturnDialog = null;
                                
                                //清除指定回退弹出框的svg画板,重新渲染
                                var flowDom = document.querySelector("#CMPFLOWSVG");
            					if(flowDom){
            						flowDom.remove();
            					}
            					_this.wfShowId = "";
            					_this.isCreateDom = false;
            					_this._exeInit();
                            }
                        }
                    }
                }
                btns.push(btn2);
            }
            
            
            var specifiesReturnDialog = _this.dialog({
                
                initHeader : false,
                title : cmp.i18n("workflow.operation.specialback"),//指定回退
                dir : "bottom-go",
                zIndex : _this.style.zIndex + 1,
                show : true,// 默认显示
                delaySetHeight : true,
                toastConfig : {
                    label : cmp.i18n("workflow.special.toast"),
                    time : 3000
                },
                popFunction : function(){
                    
                    _this.specifiesReturnInfo = null;
                    _this.wfDataObj = null;
                    
                    specifiesReturnDialog.close();
                    permissionDailog = null;
                    
                    //清除指定回退弹出框的svg画板,重新渲染
                    var flowDom = document.querySelector("#CMPFLOWSVG");
					if(flowDom){
						flowDom.remove();
					}
					_this.wfShowId = "";
					_this.isCreateDom = false;
					_this._exeInit();
                },
                bottonConfig : {
                    buttons : btns,
                    extClass : "display_none"
                },
                onInit : function(){
                    
                    $s.Workflow.getWorkflowDiagramData({
                        "isRunning" : true,
                        "processId" : _this.jsonFileds.processId,
                        "caseId" : _this.jsonFileds.caseId
                    }, errorBuilder({
                        success : function(jsonData) {

                            _this._mask(false);
                            
                            // 计算可以点击的位置
                            computeSpecifiesReturnCanClkNodeIds(jsonData.nodes, _this.jsonFileds.currentNodeId)
                            
                            // 画图
                            _this.drawSpecifiesBack(jsonData, specifiesReturnDialog.containerId, function(selected){
                                if(selected){
                                    specifiesReturnDialog.showBottonDIV(true);
                                }else{
                                    specifiesReturnDialog.showBottonDIV(false);
                                }
                            }, initData);
                        },
                        error : function(){
                            _this._mask(false);
                        }
                    }));
                }
            });
            
            btns = null;
        }else{
            _this._mask(false);
        }
    });
}


function computeSpecifiesReturnCanClkNodeIds(allNodes, currentNodeId) {
    
    var nodesObj = {};  // 存放节点的对象
    var hasPassed = {}; // 已经计算过的不再重复计算了
    var currentNode = null; // 当前节点
    
    for (var i = 0; i < allNodes.length; i++) {
        
        var _node = allNodes[i];
    	_node.isHasten = false;//设置不显示催办
    	_node.disabled = true;//设置不可以点击
    	nodesObj[_node.id] = _node;
    	if (_node.id == currentNodeId) {
    	    currentNode = _node;
    	}
    }

    recursionCompute(nodesObj,currentNode,{});
}
function recursionCompute(nodesObj, currentNode,hasPassedMap){
  
    var pids = currentNode.pids;

    for (var j = 0; j < pids.length; j++) {

    	if (typeof (hasPassedMap[pids[j]]) != 'undefined' && hasPassedMap[pids[j]] != null) {
    	    continue;
    	}
    	else {
    	    hasPassedMap[pids[j]] = true;
    	}
    
    	var _node = nodesObj[pids[j]];
    	var policy = _node.policyId;
    	//只会节点和空节点不能点击
    	if (policy == "zhihui" || policy == "inform" || policy == "vouch" || _node.partyId == 'BlankNode' || _node.type == 'join' || _node.type == 'split') {
    
    	}
    	else {
    	    _node.disabled = false;
    	}
    
    	var parentNode = nodesObj[pids[j]];
    
    	recursionCompute(nodesObj, parentNode,hasPassedMap);

    }
}

/**
 * 执行工作流事件
 * @param xParams
 * xParams.event 必传 : 事件类型，示例："BeforeStart"
 * xParams.callback 必传 : 回调事件
 * xParams.formAppId 表单必传 : 表单ID， affair表里面的formAppid
 * xParams.formViewOperation  表单必传 : 表单视图信息
 * xParams.formData 非必传 ： 表单数据ID/公文数据json串
 * xParams.mastrid 非必传 ：  表单主表ID
 * 
 */
WorkFlowDesigner.prototype.executeWorkflowBeforeEvent = function(xParams){
    
    var event, formData, mastrid, processTemplateId, processId, 
        currentActivityId, bussinessId, affairId, appName, formAppId, 
        formViewOperation;
    var _this = this;
    
    if(xParams.event){
        var context = {
                event : xParams.event, 
                formData : this.info.formData,
                mastrid : this.info.formData,
                processTemplateId : this.info.processTemplateId,
                processId : this.jsonFileds.processId || "",
                currentActivityId : this.jsonFileds.currentNodeId || "start", 
                bussinessId : this.info.summaryId || "",
                affairId : this.info.affairId || "",
                appName : this._isForm() ? "form" : this.info.category,
                formAppId : xParams.formAppId,
                formViewOperation : xParams.formViewOperation,
                matchRequestToken:this.cacheDatas.matchRequestToken,
                currentNodeLast : this.currentNodeLast
        }
        
        var processId = this.jsonFileds.processId;
        if(!processId || this.info.state=="edit_current"){
            context["processXml"] = this.getInputVal("process_xml");
        }else{
            context["processXml"] = "";
        }
        
        //设置流程ID
        this.setProcessId(context);
        
        $s.Workflow.executeWorkflowBeforeEvent({}, context, errorBuilder({
        	exeSelfError : true,
            success : function(ret){
                if(ret && ret.success == "true"){
                	xParams.callback(true);
                }else{
                    xParams.callback(false);
                    _this.alert(ret.err_msg);
                }
            },
            error : function(e){
            	xParams.callback(false);
            }
        }));
    }else{
        this.alert(cmp.i18n("workflow.alert.eventNull"));
        xParams.callback(false);
    }
}


/**
 * 加签
 */
WorkFlowDesigner.prototype.addNode = function(){
    var _this = this;
    
    _this._mask(true);
    //console.log("开始加签:" + (new Date()).getTime());
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
    	exeSelfError : true,
        success : function(checkRet){
            //console.log("校验结束:" + (new Date()).getTime());
            if(checkRet.canChange == "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
              //TODO 校验流程是否可以修改 & 加锁 wfAjax.getAcountExcludeElements()
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.ADD_NODE, function(ret){
                    //console.log("加锁结束:" + (new Date()).getTime());
                    if(ret){
                        _this.cacheDatas.currentAction = _this.actionKeysMap["AddNode"];//加签
                        _this._loadXML(function(){
                            
                            setTimeout(function(){
                                _this._mask(false);
                            }, 500);
                            
                            var labels = _this.CMP_ALL_PANELS;
                            if("edoc" == _this.info.category){//公文的知会
                               labels = _this.actionMemberPanels["EDOC_AddNode"];
                            }
                            
                            //console.log("开始打开选人:" + (new Date()).getTime());
                          //打开选人界面
                            _this.selectMembers({
                                id : _this.SELECT_ORG_TYPE_1,
                                flowType : 3,
                                label : labels,
                                nextConcurrent : true,
                                saveSelectOrgObj : true,
                                moreOptions : {
                                    callback : function(){
                                        _this.exeMoreAction();
                                    }
                                },
                                closeCallback : function(){
                                    _this.backToMe = "0";//还原
                                    _this.selectOrgObj = null;
                                },
                                callback : function(datas, type){
                                    
                                  //兼容PC的类型
                                    var tempFlowType = _this.FLOW_TYPE[type];
                                    
                                    if(tempFlowType == _this.FLOW_TYPE.sequence){
                                        tempFlowType = "1";//串发
                                    }else if(tempFlowType == _this.FLOW_TYPE.concurrent){
                                        tempFlowType = "2";//并发
                                    }else if(tempFlowType == _this.FLOW_TYPE.concurrentNext){
                                        tempFlowType = "5";//与下一节点并发
                                    }
                                    
                                    
                                    //表单只读设置， 0 - 同当前节点， 1 - 只读
                                    var formOperationPolicy = '0';
                                    if(_this._isForm()) {
                                        formOperationPolicy = "1";
                                    }
                                    
                                    var params = {}
                                    params["members"] = datas;
                                    params["flowType"] = tempFlowType;
                                    params["formOperationPolicy"] = formOperationPolicy;
                                    params["policyId"] = _this.info.defaultPolicyId,
                                    params["policyName"] = _this.info.defaultPolicyName,
                                    params["changeType"] = "1";//1:加签，
                                    params["baseReadyObjectJSON"] = "";
                                    params["activityId"] = _this.jsonFileds.currentNodeId;
                                    params["subObjectId"] = _this.jsonFileds.subObjectId;
                                    params["callback"] = function(jData){
                                        
                                        _this.drawWf(jData);
                                        _this._cacheAddNodeInfo(jData);//需要放在_setAddNodeInfo前面
                                        
                                        //TODO 这里可以优化， 后续的js不在解析加签信息
                                        _this._setAddNodeInfo(jData, false);
                                    }
                                    params["backToMe"] = _this.backToMe;
                                    _this._editWorkflow(params);
                                    
                                    
                                    _this.backToMe = "0";//还原
                                    _this.selectOrgObj = null;
                                }
                            });
                        });
                    }else{
                        _this._mask(false);
                    }
                }); 
            }
        },
        error : function(){
        	_this._mask(false);
        }
    }));
}


/**
 * 加签更多操作
 */
WorkFlowDesigner.prototype.exeMoreAction = function() {
    
    var _this = this;
    
    var items = [];
    var backToMeLabel = cmp.i18n("workflow.label.backToMe1");//流程回到我
    /*if(backToMe == "1"){
        backToMeLabel = cmp.i18n("workflow.label.backToMe2");//取消流程回到我
    }*/
    
    items.push({
        key : "backToMeItem",
        name : backToMeLabel
    });
    
    //防止误操作
    _this.backToMe = "0";
    
    cmp.dialog.actionSheet(items, cmp.i18n("workflow.dialog.cancel.label")/*取消*/, function(item) {
        
        //点击操作
        if("backToMeItem" == item.key){
            _this.backToMe = "1";
            _this.selectOrgObj.doSelect();
        }
    });
}

/**
 * 减签
 */
WorkFlowDesigner.prototype.deleteNode = function() {
    
    var _this = this;
    _this._mask(true);
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
    	exeSelfError : true,
        success : function(checkRet){
            if(checkRet.canChange == "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
              //TODO 校验流程是否可以修改 & 加锁 
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.DEL_NODE, function(ret){
                    if(ret) {
                        _this.cacheDatas.currentAction = _this.actionKeysMap["DeleteNode"];//加签
                        _this._loadXML(function(){
                            
                        	var delNodesDailog = _this.wfDelNodesDialog();
                        	
                            $s.Workflow.preDeleteNodeFromDiagram({"processId" : _this.jsonFileds.processId, 
                                "nodeId" : _this.jsonFileds.currentNodeId,
                                "processXML": _this.getInputVal("process_xml")}, errorBuilder({
                                success : function(delNodes){
                                    
                                    setTimeout(function(){
                                		_this._mask(false);
                            		}, 500);
                                    
                                    _this.delNodes = delNodes;
                                    
                                    var delNodeHtml = "";
                                    if(!_this.delNodes || _this.delNodes.length==0) {
                                    	delNodeHtml += '<div class="StatusContainer" style="top:0px">';
                                        delNodeHtml += '    <div class="nocontent"></div>';
                                        delNodeHtml += '        <span class="text nocontent_text">'+cmp.i18n("workflow.deletePeople.noPeople")+'</span>';
                                        delNodeHtml += '</div>';
                                    } else {
                                    	delNodeHtml = _this.getDelNodeHtml(delNodes);
                                    }
                                    delNodesDailog.mainDiv.querySelector("#delNodeList").innerHTML = delNodeHtml;
                                }
                            }));
                        })
                    }else{
                        _this._mask(false);
                    }
                }); 
            }
        },
        error : function(){
        	_this._mask(false);
        }
    }));
}
	
/**
 * 当前会签
 */
WorkFlowDesigner.prototype.jointSign = function(pDatas){
    
    var _this = this;
    _this._mask(true);
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
    	exeSelfError : true,
        success : function(checkRet){
            if(checkRet.canChange == "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
              //TODO 校验流程是否可以修改 & 加锁 wfAjax.getAcountExcludeElements()
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.JOIN_SIGN, function(ret){
                    if(ret){
                        pDatas = pDatas || {};
                        
                        _this.cacheDatas.jointSignParams = pDatas;
                        
                        var policyId = pDatas.policyId;
                        var policyName = pDatas.policyName;
                        if(!policyId){
                            policyId = _this.info.defaultPolicyId;
                            policyName = _this.info.defaultPolicyName;
                        }
                        _this.cacheDatas.currentAction = _this.actionKeysMap["JointSign"];//当前会签
                        _this._loadXML(function(){
                            
                            setTimeout(function(){
                                _this._mask(false);
                            }, 500);
                            
                            var labels = _this.CMP_ALL_PANELS;
                            var choosableType = null;
                            if("edoc" == _this.info.category){//公文的知会
                                 labels = _this.actionMemberPanels["EDOC_JointSign"];
                                 //dept：本部门，org:本单位
                                 choosableType = ["account","department","member","team","post","org","dept"];
                            }
                            
                          //打开选人界面
                            _this.selectMembers({
                                id : _this.SELECT_ORG_TYPE_1,
                                flowType : 2,
                                label : labels,
                                choosableType : choosableType,
                                callback : function(datas, type){
                                    
                                    var formOperationPolicy = '0';
                                    if(_this._isForm()){
                                        formOperationPolicy = "1";
                                    }
                                    
                                    var params = {}
                                    params["members"] = datas;
                                    params["flowType"] = '5';
                                    params["formOperationPolicy"] = formOperationPolicy;
                                    params["policyId"] = policyId,
                                    params["policyName"] = policyName,
                                    params["changeType"] = "3";//当前会签
                                    params["baseReadyObjectJSON"] = _this.getInputVal("readyObjectJSON");
                                    params["activityId"] = _this.jsonFileds.currentNodeId;
                                    params["subObjectId"] = _this.jsonFileds.subObjectId;
                                    params["callback"] = function(jData){
                                        
                                        _this.drawWf(jData);
                                        _this._cacheAddNodeInfo(jData);//需要放在_setAddNodeInfo前面
                                        
                                        //TODO 这里可以优化， 后续的js不在解析加签信息
                                        _this._setAddNodeInfo(jData, false);
                                    }
                                    
                                    _this._editWorkflow(params);
                                    
                                }
                            });
                        });
                    }else{
                        _this._mask(false);
                    }
                });
            }
        },
        error : function(){
        	_this._mask(false);
        }
    }));
}

/**
 * 知会
 */
WorkFlowDesigner.prototype.inform = function(){
    var _this = this;
    _this._mask(true);
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
    	exeSelfError : true,
        success : function(checkRet){
            if(checkRet.canChange == "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
              //TODO 校验流程是否可以修改 & 加锁 & 根据加密狗获取选人类型getAcountExcludeElements wfAjax.getAcountExcludeElements()
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.INFORM, function(ret){
                    if(ret){
                        _this.cacheDatas.currentAction = _this.actionKeysMap["Infom"];//知会
                        _this._loadXML(function(){
                            
                            setTimeout(function(){
                                _this._mask(false);
                            }, 500);
                            
                            var labels = _this.CMP_ALL_PANELS;
                            if("edoc" == _this.info.category){//公文的知会
                               labels = _this.actionMemberPanels["EDOC_Infom"];
                            }
                            
                          //打开选人界面
                            _this.selectMembers({
                                id : _this.SELECT_ORG_TYPE_1,
                                flowType : 2,
                                label : labels,
                                callback : function(datas, type){
                                    
                                    var formOperationPolicy = '0';
                                    /*if(_this._isForm()){
                                        formOperationPolicy = "1";
                                    }*/
                                    
                                    var params = {}
                                    params["members"] = datas;
                                    params["flowType"] = '5';//并发
                                    params["formOperationPolicy"] = formOperationPolicy;
                                    
                                    var informName = "inform";
                                    if("edoc" == _this.info.category){//公文的知会
                                        informName = "zhihui";
                                    }
                                    
                                    params["policyId"] = informName,
                                    params["policyName"] = cmp.i18n("workflow.policy.informed"),//知会
                                    params["changeType"] = "2";//
                                    params["baseReadyObjectJSON"] = "";
                                    params["activityId"] = _this.jsonFileds.currentNodeId;
                                    params["subObjectId"] = _this.jsonFileds.subObjectId;
                                    params["callback"] = function(jData){
                                        
                                        _this.drawWf(jData);
                                        _this._cacheAddNodeInfo(jData);//需要放在_setAddNodeInfo前面
                                        
                                        //TODO 这里可以优化， 后续的js不在解析加签信息
                                        _this._setAddNodeInfo(jData, false);
                                    }
                                    
                                    _this._editWorkflow(params);
                                }
                            });
                        });
                    }else{
                        _this._mask(false);
                    }
                });    
            }
        },
        error : function(){
        	_this._mask(false);
        }
    }));
}

/**
 * 传阅
 */
WorkFlowDesigner.prototype.passRead = function(){
    var _this = this;
    
    _this._mask(true);
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
        success : function(checkRet){
            if(checkRet.canChange== "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
              //TODO 校验流程是否可以修改 & 加锁 & 根据加密狗获取选人类型getAcountExcludeElements wfAjax.getAcountExcludeElements()
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.PASS_READ, function(ret) {
                    if(ret) {
                        _this.cacheDatas.currentAction = _this.actionKeysMap["PassRead"];//知会
                        _this._loadXML(function(){
                            
                            setTimeout(function(){
                                _this._mask(false);
                            }, 500);
                            
                            var labels = _this.CMP_ALL_PANELS;
                            if("edoc" == _this.info.category){//公文的知会
                                 labels = _this.actionMemberPanels["EDOC_PassRead"];
                            }
                            
                          //打开选人界面
                            _this.selectMembers({
                                id : _this.SELECT_ORG_TYPE_1,
                                flowType : 2,
                                label : labels,
                                callback : function(datas, type){
                                    
                                    var formOperationPolicy = '0';
                                    if(_this._isForm()){
                                        formOperationPolicy = "1";
                                    }
                                    
                                    var params = {}
                                    params["members"] = datas;
                                    params["flowType"] = '2';//并发
                                    params["formOperationPolicy"] = formOperationPolicy;
                                    
                                    params["policyId"] = "yuedu",
                                    params["policyName"] = cmp.i18n("workflow.policy.read"),//阅读
                                    params["changeType"] = "6";//
                                    params["baseReadyObjectJSON"] = "";
                                    params["activityId"] = _this.jsonFileds.currentNodeId;
                                    params["subObjectId"] = _this.jsonFileds.subObjectId;
                                    params["callback"] = function(jData){
                                        
                                        _this.drawWf(jData);
                                        _this._cacheAddNodeInfo(jData);//需要放在_setAddNodeInfo前面
                                        
                                        //TODO 这里可以优化， 后续的js不在解析加签信息
                                        _this._setAddNodeInfo(jData, false);
                                    }
                                    
                                    _this._editWorkflow(params);
                                }
                            });
                        });
                    }else{
                        _this._mask(false);
                    }
                });
            }
        }
    }));
}


/**
 * 多级会签
 */
WorkFlowDesigner.prototype.multistageSign = function(){
    
  //TODO 校验流程是否可以修改 & 加锁 & 根据加密狗获取选人类型getAcountExcludeElements wfAjax.getAcountExcludeElements()
    
    var _this = this;
    _this._mask(true);
    $s.Workflow.canChangeNode({"workitemId":_this.info.workItemId}, errorBuilder({
        success : function(checkRet){
            if(checkRet.canChange == "false"){
                _this.alert(checkRet.msg);
                _this._mask(false);
            }else{
                WorkFlowDesignerUtil.lockH5Workflow(_this.jsonFileds.processId, WorkFlowLock.MORE_SIGN, function(ret) {
                    if(ret) {
                        _this.cacheDatas.currentAction = _this.actionKeysMap["MultistageSign"];//多级会签
                        _this._loadXML(function(){
                            
                            setTimeout(function(){
                                _this._mask(false);
                            }, 500);
                            
                            var labels = _this.CMP_ALL_PANELS;
                            var choosableType = null;
                            if("edoc" == _this.info.category){//公文的知会
                                labels = _this.actionMemberPanels["EDOC_MultistageSign"];
                                choosableType = ["department","member"];
                            }
                            
                          //打开选人界面
                            //TODO 只能有部门面板， 能选择部门和人员
                            //TODO 多级会签节点权限是有限制的
                            _this.selectMembers({
                                id : _this.SELECT_ORG_TYPE_1,
                                flowType : 2,
                                label : labels,
                                choosableType : choosableType,
                                permission: false,
                                notSelectAccount:true,
                                directDepartment : true,
                                callback : function(datas, type){
                                    
                                    //多级会签
                                    function doMultistageSign(ms){
                                        
                                        // 加载节点权限， 会签可能没有了
                                        _this._loadPermissions(function(){
                                            
                                            var formOperationPolicy = '0';
                                            if(_this._isForm()){
                                                formOperationPolicy = "1";
                                            }
                                            
                                            var params = {}
                                            params["members"] = ms;
                                            
                                            params["messageExtend"] = {
                                                    "currentUserId" : _this.info.currentUserId,
                                                    "performer" : _this.info.currentUserId,
                                                    "workitemId" : _this.info.workItemId,
                                                    "currentLoginAccountId" : _this.info.currentAccountId
                                            }
                                            
                                            params["flowType"] = '2';//并发
                                            params["formOperationPolicy"] = formOperationPolicy;
                                            
                                            
                                            // 会签可能被禁用
                                            var huiqianPolicy = "huiqian", huiqianPolicyName = cmp.i18n("workflow.policy.conSign");
                                            var tempCatchPolicy = _this.cacheDatas.permissions;
                                            if(tempCatchPolicy && tempCatchPolicy.length > 0){
                                                
                                                huiqianPolicy = tempCatchPolicy[0].value;
                                                huiqianPolicyName = tempCatchPolicy[0].name;
                                                
                                                for(var pIndex = 0; pIndex < tempCatchPolicy.length; pIndex++){
                                                    if(tempCatchPolicy[pIndex].value == "huiqian"){
                                                        huiqianPolicy = "huiqian";
                                                        huiqianPolicyName = cmp.i18n("workflow.policy.conSign");
                                                        break;
                                                    }
                                                }
                                            }
                                            params["policyId"] = huiqianPolicy;
                                            params["policyName"] = huiqianPolicyName;//会签
                                            params["changeType"] = "5";//
                                            params["baseReadyObjectJSON"] = "";
                                            params["activityId"] = _this.jsonFileds.currentNodeId;
                                            params["subObjectId"] = _this.jsonFileds.subObjectId;
                                            params["callback"] = function(jData){
                                                
                                                //最后一个ID是多级会签ID
                                                var multistageSignId = _this.cacheDatas.multistageSignList[_this.cacheDatas.multistageSignList.length - 1];
                                                
                                                _this._cacheAddNodeInfo(jData, multistageSignId);//需要放在_setAddNodeInfo前面
                                                
                                                //TODO 这里可以优化， 后续的js不在解析加签信息
                                                _this._setAddNodeInfo(jData, false);
                                                
                                                //画图
                                                _this.drawWf(jData);
                                            }
                                            
                                            _this._editWorkflow(params);
                                        });
                                    }
                                    
                                    var deptIds = "";
                                    
                                    for(var i = 0; i < datas.length; i++){
                                        var m = datas[i];
                                        if("Department" == m.entityType && !_this.cacheDatas.multistageSignDeptUsers[m.id]){
                                            if(deptIds != ""){
                                                deptIds += ",";
                                            }
                                            deptIds += m.id;
                                        }
                                    }
                                    
                                    //有部门
                                    if(deptIds != ""){
                                        
                                        $s.Workflow.multiSignDeptMembers({"deptIds":deptIds}, errorBuilder({
                                            success : function(result){
                                                if(result){
                                                    
                                                    //多级会签缓存部门选择人员
                                                    _this.cacheDatas.multistageSignDeptUsers = cmp.extend(_this.cacheDatas.multistageSignDeptUsers, result);
                
                                                    doMultistageSign(datas);
                                                }
                                            }
                                        }));
                                    }else{
                                        doMultistageSign(datas);
                                    }
                                }
                            });
                        });
                    }else{
                        _this._mask(false);
                    }
                });
            }
        }
    }));
}

/**
 * 加签/知会/当前会签
 */
WorkFlowDesigner.prototype._editWorkflow = function(pDatas){
    
    
  //TODO 校验流程是否可以修改 & 加锁 & 根据加密狗获取选人类型getAcountExcludeElements
    //TODO 各种场景 不同模块选人界面不同
    
    var _this = this;
    
    var datas = pDatas["members"];
    var messageExtend = pDatas["messageExtend"];//用户扩展信息
    var flowType = pDatas["flowType"];//"1":串发 "2":并发  5:会签,   加签+5: 与下一节点并发
    var formOperationPolicy = pDatas["formOperationPolicy"];
    var policyId = pDatas["policyId"];
    var policyName = pDatas["policyName"];
    var changeType = pDatas["changeType"];//1:加签，
    var baseReadyObjectJSON = pDatas["baseReadyObjectJSON"];
    var activityId = pDatas["activityId"];
    var subObjectId = pDatas["subObjectId"];
    var callback = pDatas["callback"];
    var backToMe = pDatas["backToMe"];
    
     
    var idArray = [];
    var nameArray = [];
    var typeArray = [];
    var includeChildArray = [];
    var accountIdArray = [];
    var accountShortnameArray = [];
    var modeArray = [];
    
    for(var i = 0; i < datas.length; i++){
        var m = datas[i];
        idArray.push(m.id);
        nameArray.push(m.name);
        typeArray.push(m.entityType);
        includeChildArray.push(m.excludeChildDepartment);
        accountIdArray.push(m.accountId);
        accountShortnameArray.push(m.accountName);
        //competition, all
        modeArray.push("all");//都是全部执行
    }
    
    var mssage = {
            "userId" : idArray,
            "userName" : nameArray,
            "userType" : typeArray,
            "userExcludeChildDepartment" : includeChildArray,
            "accountId" : accountIdArray,
            "accountShortname" : accountShortnameArray,
            "dealTerm" : "0",
            "remindTime" : "0",
            "policyId" : policyId,
            "policyName" : policyName,
            "flowType" : flowType,
            "node_process_mode" : modeArray,
            "formOperationPolicy" : formOperationPolicy,
            "summaryId" : _this.info.summaryId,
            "affairId" : _this.info.affairId,
            "caseId" : _this.jsonFileds.caseId,
            "workitemId" : _this.info.workItemId
        }
    
    //加签，回到我
    if(backToMe){
        mssage.backToMe = backToMe;
    }
    
    //扩展信息
    if(messageExtend){
        mssage = cmp.extend(mssage, messageExtend);
    }
    
    var params = {
            "processId" : _this.jsonFileds.processId,
            "currentActivityId" : activityId,
            "targetActivityId" : activityId,
            "userId" : _this.info.currentUserId,
            "changeType" : changeType,
            "message" : cmp.toJSON(mssage),
            "baseProcessXML" : _this.getInputVal("process_xml"),
            "baseReadyObjectJSON": baseReadyObjectJSON,
            "messageDataList":_this.getInputVal("process_message_data"),
            "changeMessageJSON":_this.getInputVal("processChangeMessage"),
            
            "showNodes" : _this._getAddNodeInfo(),
            "caseId" : _this.jsonFileds.caseId
    }
    
    cmp.dialog.loading("");
    
    $s.Workflow.addNode({}, params, errorBuilder({
        
        success : function(result){
            
            cmp.dialog.loading(false);
            
            if("false" == result[2]){
                _this.alert(result[3]);
                return;
            }
            
            if(result && result[0]){
                _this.setInputVal("process_xml", result[0]);
            }
            
            //当前会签设置
            if(_this.cacheDatas.currentAction == _this.actionKeysMap["JointSign"] && result && result[1]){
                _this.setInputVal("readyObjectJSON", result[1]);
            }
            
            if(result && result[4]){
                _this.setInputVal("process_message_data", result[4]);
            }
            
            if(result && result[5]){
                _this.setInputVal("processChangeMessage", result[5]);
                
                //如果表单权限为只读
                if(!(_this.cacheDatas.editFormOperationValue) || _this.cacheDatas.editFormOperationValue=="_readOnly") {
                	
                    var changeMessage = _this.getInputVal("processChangeMessage");
                    if (changeMessage) {
                        
                        var addNodes = [], changeMsgJson = cmp.parseJSON(changeMessage);
                        var tempAddNodes = changeMsgJson["nodes"];
                        
                        if (tempAddNodes && tempAddNodes.length > 0) {
                            for (var i = 0, len = tempAddNodes.length; i < len; i++) {
                                var tNode = tempAddNodes[i];
                                if(tNode.name == 'join' || tNode.name == 'split'
                                    || !_this._isInArray(_this.cacheDatas.newNodes["AddNode"], tNode.id)){
                                    continue;
                                }
                                addNodes.push(tNode);
                            }
                        }
                        if (addNodes && addNodes.length > 0) {
                            for (var k = 0, len = addNodes.length; k < len; k++) {
                                addNodes[k]["fr"] = "1";
                            }
                            _this.setInputVal("processChangeMessage", cmp.toJSON(changeMsgJson));
                        }
                    }
                }
            }

            var jsonData = result[6] || [];
            
            //多级会签，记录多级会签信息
            if(_this.cacheDatas.currentAction == _this.actionKeysMap["MultistageSign"]){
                _this.cacheDatas.multistageSignList.push(result[7]);
            }
            
            if(result && result[8]){
            	_this.cacheDatas.currentNodeIsFormReadOnly = result[8];
            }
            
            _this.cacheDatas.isEmpty = false;
            
            if(callback){
                if(jsonData){
                    jsonData = cmp.parseJSON(jsonData);
                    
                    _this.fire("nodeChange", jsonData);
                    
                    callback(jsonData);
                }
            }
        }
    }));
}

/**
 * 深度克隆数据
 * @param obj
 */
WorkFlowDesigner.prototype.cloneObject = function(obj) {
    if(typeof obj === "object") {
        if(cmp.isArray(obj)) {
            var newArr = [];
            for(var i = 0; i < obj.length; i++) 
                newArr.push(this.cloneObject(obj[i]));
            return newArr;
        } else if(obj == null){
            return null;
        } else{
            var newObj = {};
            for(var key in obj) {
                newObj[key] = this.cloneObject(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
}

/**
 * 画流程图
 */
WorkFlowDesigner.prototype.drawWf = function(jsonData, isShow, trigerEdit){
    
    //加入缓存数据
    this.cacheDatas.jsonDatas = jsonData;
    
    var _this = this;
    var cNodeId = _this.jsonFileds.currentNodeId;
    if(cNodeId == "start" || !cNodeId){
        cNodeId = ""; 
    }
    jsonData.activityId = cNodeId;
    
    //设置多级会签 部门节点
    _this._setSpecialPro(jsonData);
    
    
        
    if(_this.info.beforDrawWf){
        jsonData = _this.info.beforDrawWf(jsonData);
    }
    
    
    //设置
    if(trigerEdit !== true && _this.cacheDatas.currentAction){
        
        var jsonNodes = jsonData.nodes;
        
        for(var i = 0, len = jsonNodes.length; i < len; i++){
            
            var jNode = jsonNodes[i];
            
            var jsonText = jNode.id + "";
            if(_this.cacheDatas.initDataMap[jsonText] == "" 
                && this.jsonFileds.currentNodeId != jsonText){
                //置灰
                jNode.disabled = true;
            }
        }
    }
    
    if(_this.info.model != "silent"){
        if(_this.wfShowId){
            cmp.flowV5(this.cloneObject(jsonData), { // 流程数据
                id : _this.wfShowId,// 容器id
                callback : function(nodeInfo, typeName) { // 回调函数
                    if(!nodeInfo.disabled){
                        if (_this.info.state == "edit" || _this.info.state == "edit_current") {
        
                            if(_this.info.customerTap){
                                _this.info.customerTap(nodeInfo, typeName);
                            }else if (!_this.info.canEdit || _this.info.canEdit()) {
                                _this.editWf(nodeInfo);
                            }
        
                        }
                    }
                },
                completeCallback:function(){ 
                    if(arguments.length > 0){ 
                        var p = arguments[0];
                        if(p.success == false){ 
                            /*var code = p.code + ""; 
                            var message = p.message; 
                            var detail = p.detail;
                            if(code == "60001")*/
                            if(_this.info.onDrawError)
                                _this.info.onDrawError();
                        }
                    }
                } 
            });
        }else{
            _this.alert(cmp.i18n("workflow.alert.idNull"));
        }
    }
    
    //是true则为初始化加载
    if(trigerEdit !== true){
        //触发节点变动事件
        _this.fire("triggerEdit", _this.cacheDatas.jsonDatas);
    }

    //托管模式
    if(_this.info.model == "trustee"){
        if(isShow !== false){
            //展示
            this.showFirst();
        }
    }
        
    
}

/**
 * 画流程图
 */
WorkFlowDesigner.prototype.drawSpecifiesBack = function(jsonData, containerId, selectCallback, initData){
    
    var _this = this;
    var cNodeId = _this.jsonFileds.currentNodeId;
    if(cNodeId == "start"){
        cNodeId = ""; 
    }
    jsonData.activityId = cNodeId;
    
    //清除当前页面上的svg画板
	var flowDom = document.querySelector("#CMPFLOWSVG");
	if(flowDom){
		flowDom.remove();
	}
    
    //清缓存
    _this.wfDataObj = cmp.flowV5(jsonData, { // 流程数据
        id : containerId,// 容器id
        completeCallback : function(){
            //初始化完成后回调函数 TODO 需要辛裴那边实现
            if(initData){
                
                //选中
                setTimeout(function(){
                    //执行顺序问题
                    _this.wfDataObj.updateNode([{
                        nodeID : initData.toNodeId,
                        x : initData.x,
                        y : initData.y,
                        state : "select"
                    }]);
                    selectCallback(true);
                    _this.specifiesReturnInfo = initData;
                    
                    initData = null;
                }, 10);
              }
        },
        callback : function(nodeInfo, typeName) { // 回调函数
            if(!nodeInfo.disabled && !_this.isSubmiting){
                
                _this.isSubmiting = true;
                
                var specifiesReturnInfo = _this.specifiesReturnInfo ;
                if(specifiesReturnInfo && specifiesReturnInfo.toNodeId == nodeInfo.nodeID){
                    _this.specifiesReturnInfo = null;
                    var pReset = [{
                            nodeID : specifiesReturnInfo.toNodeId,
                            x : specifiesReturnInfo.x,
                            y : specifiesReturnInfo.y,
                            state : "reset"
                    }]
                    _this.wfDataObj.updateNode(pReset);
                    //取消选中
                    selectCallback(false);
                    _this.isSubmiting = false;
                }else{
                    _this.specifiesReturnNodeClk(nodeInfo.nodeID, function(ret, specifiesReturn){
                        
                        _this.isSubmiting = false;
                        
                        if(ret === true){
                            
                            //取消选中
                            if(specifiesReturnInfo){
                                var pReset = [{
                                        nodeID : specifiesReturnInfo.toNodeId,
                                        x : specifiesReturnInfo.x,
                                        y : specifiesReturnInfo.y,
                                        state : "reset"
                                }]
                                _this.wfDataObj.updateNode(pReset);
                            }
                            
                            //选中
                            _this.wfDataObj.updateNode([{
                                nodeID : nodeInfo.nodeID,
                                x : nodeInfo.x,
                                y : nodeInfo.y,
                                state : "select"
                            }]);
                            selectCallback(true);
                            _this.specifiesReturnInfo = {
                                toNodeId : nodeInfo.nodeID,
                                toNodeName : nodeInfo.partyName,
                                x : nodeInfo.x,
                                y : nodeInfo.y,
                                isCircleBack : "0"
                            }
                            
                            if(specifiesReturn){
                                _this.specifiesReturnInfo.altSubmitStyle = specifiesReturn.altSubmitStyle;
                                _this.specifiesReturnInfo.altSubmitTitle = specifiesReturn.altSubmitTitle;
                            }
                        }
                    });
                }
            }
        }
    });
}

/**
 * 处理多级会签节点
 */
WorkFlowDesigner.prototype._setSpecialPro = function(jsonData){
    
    var _this = this;
    
    
    //多级会签
    if(this.cacheDatas.currentAction == this.actionKeysMap["MultistageSign"]){
        
	    this.cacheDatas.multistageSignDeptList = [];
	    
	    var jsonNodes = jsonData.nodes;
	    
	    for(var i = 0, len = jsonNodes.length; i < len; i++){
	        
	        var jNode = jsonNodes[i];
	        
	        var jsonText = jNode.id + "";
	        if(jNode.partyType == "Department" 
	            && this._isInArray(this.cacheDatas.newNodes[this.cacheDatas.currentAction], jsonText)){
	            
	            this.cacheDatas.multistageSignDeptList.push(jsonText);
	            
	            //设置当前节点为多级会签节点，并且没有选人
	            jNode.isMultiNode = "true";
	        }
	       
	    }
    }
    
    
     //取当前结点
	 if( this.currentNode == null){
		    var jsonNodes = jsonData.nodes;
		    for(var i = 0, len = jsonNodes.length; i < len; i++){
		    	var jNode = jsonNodes[i];
		        
		        if(this.currentNode == null && jNode.id ==  this.jsonFileds.currentNodeId ){
		        	this.currentNode = jNode;
		        }
		    }
	    }
}

/**
 * 编辑流程
 */
WorkFlowDesigner.prototype.editWf = function(node){
    
    var canClickNode = false;
    
    //结束节点没有事件
    if(node.nodeID == "end" 
        || node.nodeID == "nextNodes" 
        || node.nodeID == "preNodes"){
        
        canClickNode = false;
            
    }else if(this.info.state == "edit_current"){
        
        if(this.cacheDatas.currentAction){
            
            if(node.nodeID == this.jsonFileds.currentNodeId){
                canClickNode = true;
            }else{
                if(this.cacheDatas.initDataMap[node.nodeID] != ""){
                    canClickNode = true;
                }
            }
        }
    }else{
        canClickNode = true;
    }
    
    //不可以点击
    if(!canClickNode){
        return;
    }
    
    //多级会签点击当前节点和多级会签的节点不触发事件
    if((this.cacheDatas.currentAction == this.actionKeysMap["MultistageSign"] 
            && node.nodeID == this.jsonFileds.currentNodeId)
            || this._isInArray(this.cacheDatas.multistageSignList, node.nodeID)){
        return;
    }

  //多级会签部门节点
    if(this._isInArray(this.cacheDatas.multistageSignDeptList, node.nodeID)){
        this._selMultiMember(node);
        return;
    }
    
    
    var items = [];
    
    //判断节点类型
    if(this.info.state != "edit_current" || node.nodeID == this.jsonFileds.currentNodeId){
        items.push({
            key : "_addNode",
            name : cmp.i18n("workflow.label.newNode")//新增
        })
    }
    
    var isMultistageSignNode = this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["MultistageSign"]], node.nodeID);
    
    if(node.nodeID != this.jsonFileds.currentNodeId){
        
        if(this.cacheDatas.currentAction == "" 
            || this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["AddNode"]], node.nodeID)
            || isMultistageSignNode){
            
           // items.push("修改节点权限");
            items.push({
                key : "_editPolicyNode",
                name : cmp.i18n("workflow.label.editNodePolicy")//修改节点权限
            })
        }
        
       
        var isJointSign = this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["JointSign"]], node.nodeID);
        
        if(node.formAppId != '' && node.formAppId != null && node.formAppId != "-1" && node.policyId != "inform" && node.policyId != "zhihui" && !isJointSign){

            items.push({
                key : "_editFormOperation",
                name : cmp.i18n("workflow.label.editFormPolicy")//修改表单操作权限
            })
        }
       
        items.push({
            key : "_replaceNode",
            name : cmp.i18n("workflow.label.replace")//替换
        })
        
        
        items.push({
            key : "_deleteNode",
            name : "<span style='color:red'>" + cmp.i18n("workflow.label.delete") + "</span>"//删除
        });
    }
    var _this = this;
    
    cmp.dialog.actionSheet(items, cmp.i18n("workflow.dialog.cancel.label")/*取消*/, function(item) {
        
        //点击操作
        if("_addNode" == item.key){
             _this._addNode(node);
        }else if("_editPolicyNode" == item.key){
             _this._editPolicyNode(node, !isMultistageSignNode);
        }else if("_replaceNode" == item.key){
            _this._replaceNode(node);
        }else if("_deleteNode" == item.key){
            _this._deleteNode(node);
        }else if("_editFormOperation" == item.key){
            _this._editFormOperation(node);
        }
    });
}


/**
 * 多级会签部门节点，选择人员
 */
WorkFlowDesigner.prototype._selMultiMember = function(node){
    
    var _this = this;
    var deptId = node.partyId;
    var multiUsers = this.cacheDatas.multistageSignDeptUsers[deptId];
    if(multiUsers){

        var tplHTML = "";
        var btnLabel = "";
        if(multiUsers.length > 0){
            
            var sel_multi_input_name = "sel_multi_input_name" + (new Date()).getTime();
            
            var mDatas = [];
            for (var i = 0; i < multiUsers.length; i++) {
                    var mu = multiUsers[i];
                    var m = {
                            inputType : "radio",
                            inputName : sel_multi_input_name,
                            name : mu["name"],
                            id : mu["id"],
                            post : "",
                            headshotURL : cmp.origin + "/rest/orgMember/avatar/" + mu["id"] + "?maxWidth=200"
                    }
                    mDatas.push(m);
            }

            tplHTML = cmp.tpl(WorkFlowDesignerTpls.SELECT_MEMBER_LI_TPL, mDatas);
            btnLabel = cmp.i18n("workflow.dialog.ok.label");//确定
        }else{
            tplHTML = '<li><div><p>'+cmp.i18n("workflow.label.selectOthers_note")+'</p></div></li>';
            btnLabel = cmp.i18n("workflow.label.selectOthers");//选择其他人
        }
            
         var contentHTML = "";
         contentHTML += '<div id="_selMultiMember_member_div">' +
         '    <ul class="wf-list-container select_list_custom">' 
         + tplHTML +
         '    </ul>'+
         '</div>';
         
        var dialogParams = {
                
                initHeader : false,
                
                title : cmp.i18n("workflow.presubmit.signle.person.label"),//单人执行
                dir : "right-go",
                zIndex : (_this.style.zIndex + 1) + "",// 层级
                show : true,
                initHTML : function() {
                    return contentHTML;
                },
                onInit : function() {
                    if(multiUsers.length > 0){
                        cmp.IMG.detect();
                    }
                },
                onShow : function() {

                    var bHeight = 0;
                    if(multiUsers.length > 0){
                        bHeight = 44;
                    }
                    var tempContent = permissionDailog.mainDiv.querySelector("#_selMultiMember_member_div");
                    tempContent.style.height = (permissionDailog.mainDivHeight - bHeight) + "px";
                }
            }
        
            dialogParams.bottonConfig = {};
            dialogParams.bottonConfig.buttons = [
              {
                  type : 1,
                  isPopBtn : true,
                  label : cmp.i18n("workflow.dialog.cancel.label"),
                  hander : function(){
                      permissionDailog.close();
                      permissionDailog = null;
                  }
              },
              { 
                label : btnLabel,
                hander : function(){


                    if(multiUsers.length > 0){
                     
                        // 获取选中的值
                        var checkInput = permissionDailog.mainDiv.querySelector("input:checked");
                        if(checkInput){
                            
                            var v = checkInput.value;
                            for(var j = 0; j < multiUsers.length; j++){
                                if(v == multiUsers[j].id){
                                    
                                    _this.cacheDatas.multistageSignDeptList = _this._deleteIfInArray(_this.cacheDatas.multistageSignDeptList, node.nodeID);
                                    
                                    //设置参数
                                    multiUsers[j].includeChild = true;
                                    
                                    //替换节点
                                    _this._doReplaceNode(multiUsers[j], node);
                                    
                                    permissionDailog.close();
                                    permissionDailog = null;
                                    break;
                                }
                            }
                            
                        }else{
                            _this.alert(cmp.i18n("workflow.label.selectOperator")/*请选择执行人 */);
                        }
                    }else {
                        //进行选人
                        _this.selectMembers({
                            id : _this.SELECT_ORG_TYPE_1,
                            type : 1,
                            lightOptsChange : true,
                            flowType : 1,
                            maxSize : 1,
                            selectType : "member",
                            callback : function(datas, type){
                                
                                //防止选的不是人员
                                var sMember = datas[0];
                                if(sMember && sMember.entityType == "Member"){
                                    
                                    _this.cacheDatas.multistageSignDeptList = _this._deleteIfInArray(_this.cacheDatas.multistageSignDeptList, node.nodeID);
                                    permissionDailog.close();
                                    permissionDailog = permissionDailog;
                                    
                                    _this._doReplaceNode(datas[0], node);
                                }
                            }
                        });
                    }
                }
            }];
        
        //弹出选人框
        var permissionDailog = _this.dialog(dialogParams);
    }
}

/**
 * 是否在数组中
 */
WorkFlowDesigner.prototype._isInArray = function(array, value) {
    var ret = false;
    if (array && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (value == array[i]) {
                ret = true;
                break;
            }
        }
    }
    return ret;
}

/**
 * 删除数组中的值
 */
WorkFlowDesigner.prototype._deleteIfInArray = function(array, value) {
    var ret = [];
    if(this._isInArray(array, value)){
        for(var i = 0, len = array.length; i < len; i++){
            if(array[i] != value){
                ret.push(array[i]);
            }
        }
    }else{
        ret = array;
    }
    return ret;
}

/**
 * 加签等操作时需要记录当前操作的节点
 */
WorkFlowDesigner.prototype._setAddNodeInfo = function(jsonData, updateProccessLog){
    
    if(this._isInArray(this.actionKeys, this.cacheDatas.currentAction)){
        
        var jsonNodes = jsonData.nodes;
        this.cacheDatas.addNodeInfo = "";
        this.cacheDatas.newNodesInfo = {};
        for(var i = 0, len = jsonNodes.length; i < len; i++){
            var jsonText = jsonNodes[i].id + "";
            
            //过滤前置节点和后置节点
            if(jsonText == "preNodes" || jsonText == "nextNodes"
                || this.cacheDatas.initDataMap[jsonText] == ""){
                continue;
            }
            if(this.cacheDatas.addNodeInfo != ""){
                this.cacheDatas.addNodeInfo += ",";
            }
            this.cacheDatas.addNodeInfo += jsonText;
            if("humen" == jsonNodes[i].type){
                this.cacheDatas.newNodesInfo[jsonText] = {
                        partyName : jsonNodes[i]["partyName"],
                        policyName : jsonNodes[i]["policyName"]
                }
            }
        }
        
        //合并减签的信息
        for(var key in this.cacheDatas.delNodesInfo){
            this.cacheDatas.newNodesInfo[key] = this.cacheDatas.delNodesInfo[key];
        }
        
        if(updateProccessLog !== false){
            //设置加签信息
            this._setEditInfos();
        }
    }
}


/**
 * 获取当前编辑节点列表
 * @returns
 */
WorkFlowDesigner.prototype._getAddNodeInfo = function(){
    
    var _this = this;
    
    //自定义模式，全部展示
    if(this.info.model == "customer"){
        return "";
    }
    
    if(_this.info.state == "edit"){
        _this.cacheDatas.addNodeInfo = "";
    }else{
        _this.cacheDatas.addNodeInfo = _this.cacheDatas.addNodeInfo || _this.jsonFileds.currentNodeId;
    }
    return "";//_this.cacheDatas.addNodeInfo;
}

/**
 * 缓存数据
 */
WorkFlowDesigner.prototype._cacheAddNodeInfo = function(jsonData, extendId){

    var _this = this;

    if(this._isInArray(this.actionKeys, this.cacheDatas.currentAction)){
        
        var jsonNodes = jsonData.nodes;
        
        delete this.cacheDatas.newNodes[this.cacheDatas.currentAction];
        this.cacheDatas.newNodes[this.cacheDatas.currentAction] = [];
        
        //是否为多级会签操作
        var isMultiSign = this.cacheDatas.currentAction == this.actionKeysMap["MultistageSign"];
        
        var regex = /^[-|\d]\d+$/;
        for(var i = 0, len = jsonNodes.length; i < len; i++){

            var jsonText = jsonNodes[i].id + "";
            

            if(_this.cacheDatas.initDataMap[jsonText] == ""){
                //初始化的数据
                continue;
            }
            
            if("humen" == jsonNodes[i].type && regex.test(jsonText) 
                    && jsonText != this.jsonFileds.currentNodeId){
                
                var isInarray = false;
                for(var j = 0; j < this.actionKeys.length && !isInarray; j++){
                    isInarray = this._isInArray(this.cacheDatas.newNodes[this.actionKeys[j]], jsonText)
                }
                
                //判断是否在多级会签的节点
                if(!isInarray){
                    isInarray = this._isInArray(this.cacheDatas.multistageSignList, jsonText)
                }
                
                if(!isInarray){
                    
                    this.cacheDatas.newNodes[this.cacheDatas.currentAction].push(jsonText);
                    
                    //多级会签节点
                    if(isMultiSign && extendId){
                        
                        var isInMultiArray = false;
                        for(var key in _this.cacheDatas.multistageSignInfo){
                            var muList = _this.cacheDatas.multistageSignInfo[key];
                            if(_this._isInArray(muList, jsonText)){
                                isInMultiArray = true;
                                break;
                            }
                        }
                        if(!isInMultiArray){
                            var multiList = this.cacheDatas.multistageSignInfo[extendId];
                            if(!multiList){
                                multiList = [];
                            }
                            multiList.push(jsonText);
                            this.cacheDatas.multistageSignInfo[extendId] = multiList;
                        }
                    }
                }
            }
        }
    }
}

/**
 * 设置加签和减签信息
 */
WorkFlowDesigner.prototype._setEditInfos = function(){
    
    var msgData = [];
    for(var key in this.cacheDatas.newNodes){
        var l = this.cacheDatas.newNodes[key];
        if(l.length > 0){
            var item = {
                    "affairId" : this.info.affairId,
                    "handlerId" : this.info.currentUserId,
                    "processLogParam" : "",
                    "partyNames" : "",
                    "operationType" : "insertPeople",
                    "summaryId" : this.info.summaryId
                }
            var processLogParam = "";
            var partyNames = "";
            for(var i = 0, len = l.length; i < len; i++){
                if(partyNames != ""){
                    processLogParam += ",";
                    partyNames += ",";
                }
                var id = l[i];
                var nodeInfo = this.cacheDatas.newNodesInfo[id];
            	processLogParam += nodeInfo["partyName"] + "("+nodeInfo["policyName"]+")";
                partyNames += nodeInfo["partyName"];
            }
            item.processLogParam = processLogParam;
            item.partyNames = partyNames;
            var operationType = "";
            
            //TODO PC端， 加签等操作，一次一条记录
            
            if(key == this.actionKeysMap["AddNode"]){
                operationType = "insertPeople";
            }else if(key == this.actionKeysMap["JointSign"]){
                operationType = "colAssign";
            }else if(key == this.actionKeysMap["Infom"]){
                operationType = "addInform";
            }else if(key == this.actionKeysMap["PassRead"]){
                operationType = "addPassRead";
            }else if(key == this.actionKeysMap["MultistageSign"]){
                operationType = "addMoreSign";
            }else if(key == this.actionKeysMap["DeleteNode"]) {
            	operationType = "deletePeople";
            }
            item.operationType = operationType;
            msgData.push(item);
        }
    }
    var val = "";
    if(msgData.length > 0){
        val = cmp.toJSON(msgData);
    }
    this.setInputVal("process_message_data", val);
}

/**
 * 增加节点
 */
WorkFlowDesigner.prototype._addNode = function(node){
    
    if(this.cacheDatas.currentAction == this.actionKeysMap["AddNode"]){
        this.addNode();
    }else if(this.cacheDatas.currentAction == this.actionKeysMap["JointSign"]){
        this.jointSign(this.cacheDatas.jointSignParams);
    }else if(this.cacheDatas.currentAction == this.actionKeysMap["Infom"]){
        this.inform();
    }else if(this.cacheDatas.currentAction == this.actionKeysMap["PassRead"]){
        this.passRead();
    }else{
        this.edit({
            "currentNodeId" : node.nodeID,
            "isEdit" : true
        });
    }
}

/**
 * 替换节点
 */
WorkFlowDesigner.prototype._replaceNode = function(node){
    
    var _this = this;
    var elseSetting = {
            label : _this.CMP_ALL_PANELS
    };

    if ("edoc" == _this.info.category) {
        if (this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["MultistageSign"]], node.nodeID)) {
            // 公文的知会
            elseSetting.label = _this.actionMemberPanels["EDOC_MultistageSign"];
            elseSetting.choosableType = ["department","member"];
            elseSetting.notSelectAccount = true;
            
        } else if (this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["AddNode"]], node.nodeID)) {
            // 公文的知会
            elseSetting.label = _this.actionMemberPanels["EDOC_AddNode"];
        } else if (this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["JointSign"]], node.nodeID)) {
            // 公文的知会
            elseSetting.label = _this.actionMemberPanels["EDOC_JointSign"];
        } else if (this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["Infom"]], node.nodeID)) {
            // 公文的知会
            elseSetting.label = _this.actionMemberPanels["EDOC_Infom"];
        } else if (this._isInArray(this.cacheDatas.newNodes[this.actionKeysMap["PassRead"]], node.nodeID)) {
            // 公文的知会
            elseSetting.label = _this.actionMemberPanels["EDOC_PassRead"];
        }
    }
    
    
    this.selectMembers(cmp.extend({
        id : _this.SELECT_ORG_TYPE_1,
        flowType : 1,
        callback : function(datas, type){
            _this._doReplaceNode(datas[0], node);
        }
    }, elseSetting));
}

/**
 * 执行替换节点
 */
WorkFlowDesigner.prototype._doReplaceNode = function(data, node){
    
    var _this = this;
    
    if(!data.accountId) {
    	data.accountId = "";
    }
    
    var params = {
        "workflowXml" : _this.getInputVal("process_xml"),
        "currentNodeId" : node.nodeID,
        "oneOrgJson" : cmp.toJSON(data),//替换只能替换一条，选人界面没有过滤这里过滤一下,
        "defaultPolicyId" : node.policyId,//"collaboration",
        "defaultPolicyName" : node.policyName,
        "caseId" : _this.jsonFileds.caseId,
        "showNodes" : _this._getAddNodeInfo()
    };
    
    cmp.dialog.loading("");
    
    $s.Workflow.freeReplaceNode({}, params, errorBuilder({
        success : function(result){
            
            cmp.dialog.loading(false);
            
            _this.setInputVal("process_xml", result[0]);
            
            var jsonData = result[1] || [];
            jsonData = cmp.parseJSON(jsonData);
            
            var newId = result[2];
            
            var jsonNodes = jsonData.nodes;
            var currentNode = null;
            for(var i = 0, len = jsonNodes.length; i < len; i++){
                
                var jNode = jsonNodes[i];
                
                var jsonText = jNode.id + "";
                if(jsonText == newId){
                    currentNode = jNode;
                    break;
                }
            }
            
          //加签需要更新更新日志
            var changeMessage = _this.getInputVal("processChangeMessage");
            if(changeMessage){
                var changeMsgJson = cmp.parseJSON(changeMessage);
                var addNodes = changeMsgJson["nodes"];
                if(addNodes && addNodes.length > 0){
                    for(var k = 0, len = addNodes.length; k < len; k++){
                        var tNode = addNodes[k];
                        //只更新当前节点
                        if(tNode["id"] == node.nodeID){
                            tNode["id"] = newId;
                            tNode["name"] = currentNode["name"];
                            tNode["eleName"] = currentNode["partyName"];
                            tNode["eleId"] = currentNode["partyId"];
                            tNode["eleType"] = currentNode["partyType"];
                            tNode["inclch"] = data["excludeChildDepartment"] + "";
                            break;
                        }
                    }
                }
                
                var addLinks = changeMsgJson["links"];
                if(addLinks && addLinks.length > 0){
                    for(var k = 0, len = addLinks.length; k < len; k++){
                        var tNode = addLinks[k];
                        //只更新当前节点
                        if(tNode["from"] == node.nodeID){
                            tNode["from"] = newId;
                        }else if(tNode["to"] == node.nodeID){
                            tNode["to"] = newId;
                        }
                    }
                }
                _this.setInputVal("processChangeMessage", cmp.toJSON(changeMsgJson));
                
              //当前会签需要替换readyObjectJSON字段
                var tempReadObject = _this.getInputVal("readyObjectJSON");
                if(tempReadObject){
                    tempReadObject = cmp.parseJSON(tempReadObject);
                    var readActivityList = tempReadObject.activityIdList || [];
                    for(var t = 0, len = readActivityList.length; t < len; t++){
                        if(readActivityList[t] == node.nodeID){
                            readActivityList[t] = newId;
                            break;
                        }
                    }
                    _this.setInputVal("readyObjectJSON", cmp.toJSON(tempReadObject));
                }
            }
            
            if(jsonData){
                
              //加签等操作时才进行设置
                if(_this.info.state == "edit_current"){
                    
                    var _action = "";
                    for(var i = 0; i < _this.actionKeys.length; i++){
                        var a = _this.actionKeys[i];
                        if(_this._isInArray(_this.cacheDatas.newNodes[a], node.nodeID)){
                            _action = a;
                            break;
                        }
                    }
                    if(_action){
                        //delete _this.cacheDatas.newNodesInfo[node.nodeID];
                        _this.cacheDatas.newNodes[_action] = _this._deleteIfInArray(_this.cacheDatas.newNodes[_action], node.nodeID);
                        _this.cacheDatas.newNodes[_action].push(newId);
                    }
                    
                    //多级会签
                    if(_action == _this.actionKeysMap["MultistageSign"]){
                        for(var key in _this.cacheDatas.multistageSignInfo){
                            var muList = _this.cacheDatas.multistageSignInfo[key];
                            if(_this._isInArray(muList, node.nodeID)){
                                muList = _this._deleteIfInArray(muList, node.nodeID);
                                muList.push(newId);
                                _this.cacheDatas.multistageSignInfo[key] = muList;
                                break;
                            }
                        }
                    }
                }
                _this._setAddNodeInfo(jsonData);
                
                //画图
                _this.drawWf(jsonData);
                
                //触发节点变动事件
                _this.fire("nodeChange", jsonData);
            }
        }
    }));
}


/**
 * 删除节点
 */
WorkFlowDesigner.prototype._deleteNode = function(node, nodeList){
    
    var _this = this;
    
    function tempDeleteCallback(jsonData){
        
        if(jsonData){
            jsonData = cmp.parseJSON(jsonData);
            
            //更改修改信息
            //delete _this.cacheDatas.newNodesInfo[node.nodeID];
            var delNodes = [];
            delNodes.push(node.nodeID);
            if(nodeList && nodeList.length > 0){//减签才有这个参数
                for(var k = 0; k < nodeList.length; k++){
                    if(nodeList[k].nodeID != node.nodeID){
                        delNodes.push(nodeList[k].nodeID);
                    }
                }
            }
            
          //删除加签后的缓存内容
            for(var i = 0; i < _this.actionKeys.length; i++){
                var a = _this.actionKeys[i];
                //TODO 数据量大的话会有性能问题
                for(var t = 0; t < delNodes.length; t++){
                    _this.cacheDatas.newNodes[a] = _this._deleteIfInArray(_this.cacheDatas.newNodes[a], delNodes[t]);
                }
            }
            
          //多级会签
            for(var key in _this.cacheDatas.multistageSignInfo){
                var muList = _this.cacheDatas.multistageSignInfo[key];
                if(_this._isInArray(muList, node.nodeID)){
                    muList = _this._deleteIfInArray(muList, node.nodeID);
                    if(muList.length == 0){
                        delete _this.cacheDatas.multistageSignInfo[key];
                        _this.cacheDatas.multistageSignList = _this._deleteIfInArray(_this.cacheDatas.multistageSignList, node.nodeID);
                    }else{
                        _this.cacheDatas.multistageSignInfo[key] = muList;
                    }
                    break;
                }
            }
            
            if(nodeList && nodeList.length > 0){
              //减签
                for(var t = 0; t < delNodes.length; t++) {
                    _this.cacheDatas.newNodes["DeleteNode"].push(delNodes[t]);
                }
                for(var t = 0; t < nodeList.length; t++) {
                    
                    _this.cacheDatas.delNodesInfo[nodeList[t].nodeID] = {
                        partyName : nodeList[t]["partyName"],
                        policyName : nodeList[t]["policyName"]
                    }
                }
            }
            
            //设置加签信息
            _this._setAddNodeInfo(jsonData);
            
            //画图
            _this.drawWf(jsonData);
            
            //触发节点变动事件
            _this.fire("nodeChange", jsonData);
        }
    }
    
    if(_this.info.state == "edit_current") {
    	
        //减签或删除新增的节点
        var activityList = [];
        if(nodeList && nodeList.length>0) {
        	for(var i=0; i<nodeList.length; i++) {
        		activityList.push(nodeList[i].nodeID);
        	}
        	if(!node) {
        		node = nodeList[0];
        	} 
        } else {
            //删除节点
        	activityList.push(node.nodeID);
        }
        
      //多级会签
        for(var key in _this.cacheDatas.multistageSignInfo){
            var muList = _this.cacheDatas.multistageSignInfo[key];
            if(_this._isInArray(muList, node.nodeID)){
                if(muList.length == 1){
                    //最后一个多级会签节点，只有最后一个的时候需要删除多级会签的节点
                    activityList.push(key);
                }
                break;
            }
        }
        
        var params = {};
        params["activityId"] = _this.jsonFileds.currentNodeId;
        params["activityIdList"] = activityList;
        params["callback"] = tempDeleteCallback;
        
        _this._deleteWfNode(params);
    }else{
        var params = {
                workflowXml : _this.getInputVal("process_xml"),
                currentNodeId : node.nodeID,
                showNodes : _this._getAddNodeInfo(),
                caseId : _this.jsonFileds.caseId
            };
            
            cmp.dialog.loading("");
            $s.Workflow.freeDeleteNode({}, params, errorBuilder({
                success : function(result){
                    
                    cmp.dialog.loading(false);
                    
                    _this.setInputVal("process_xml", result[0]);
                    
                    var jsonData = result[1] || [];
                    
                    tempDeleteCallback(jsonData);
                }
            }))
    }
}



WorkFlowDesigner.prototype._editFormOperation = function(node) {
    var _this = this,_nodeCount = 0,_nodeNames = "",addNodes = [],changeMsgJson;
    var changeMessage = _this.getInputVal("processChangeMessage");
    if (changeMessage) {
        changeMsgJson = cmp.parseJSON(changeMessage);
        
        var tempAddNodes = changeMsgJson["nodes"];
        
        if (tempAddNodes && tempAddNodes.length > 0) {
            for (var k = 0, len = tempAddNodes.length; k < len; k++) {
                var tNode = tempAddNodes[k];
            	if(tNode.name == 'join' || tNode.name == 'split'
            	    || !this._isInArray(this.cacheDatas.newNodes["AddNode"], tNode.id)){
            		continue;
            	}
            	_nodeCount++;
                if (_nodeNames == '') {
                    _nodeNames = tNode.name;
                } else {
                    _nodeNames += "、" + tNode.name;
                }
                addNodes.push(tNode);
            }
        }
    }

    var tplHTML = '<li class="wf-policy-item wf-policy-edit">'
            + '  <div class="cmp-input-row cmp-radio cmp-left">'
            + '    <input style="left:6px;" data-name="'+cmp.i18n("workflow.label.readOnly")+'" name="_formOperation" value="_readOnly" id="_readOnlyInput"  type="radio"/>'
            + '    <label style="padding-left:36px;">'+cmp.i18n("workflow.label.readOnly")/*只读*/+'</label>'
            + '  </div>'
            + '</li>';
    
	if(_this.cacheDatas.currentNodeIsFormReadOnly != 'true'){
		tplHTML += '<li class="wf-policy-item wf-policy-edit ">'
            + '  <div class="cmp-input-row cmp-radio cmp-left">'
            + '    <input style="left:6px;" data-name="'+cmp.i18n("workflow.label.sameAsCurrentNode")+'" name="_formOperation" id="_sameTothisInput" value="_sameTothis" type="radio"/>'
            + '    <label style="padding-left:36px;">'+cmp.i18n("workflow.label.sameAsCurrentNode")/*与当前节点相同*/+'</label>'
            + '  </div>' + '</li>';
	}
            
    	

    var policyListviewId = "policy_list_view_ID" + (new Date()).getTime();

    var contentHTML = "";

    // 应用到本次加签的X个节点：xx1、xx1、xx1、xx1、xx1、
    contentHTML += '<div id="policy_list_view_info" class="wf-policy-edit wf-policy-apply-all"><div>'
            + cmp.i18n("workflow.label.apply2Nodes", [_nodeCount, _nodeNames]) + '</div>'
            + '</div>';

    contentHTML += '<div id="form_policy_list_view_list_id" style="overflow:auto">' 
                +'    <ul>' 
                        + tplHTML
                 + '    </ul>'
                 + "</div>";

    var editFormOperationDailog = _this.dialog({
        
                initHeader : false,
                title : cmp.i18n("workflow.label.editFormPolicy"),//修改表单操作权限
                dir : "right-go",
                containerExtClass : "wk-branch-back",
                zIndex : (_this.style.zIndex + 1) + "",// 层级
                show : true,
                initHTML : function() {
                    return contentHTML;
                },
                onShow : function() {
                    
                    var quickSetting = editFormOperationDailog.mainDiv.querySelector("#policy_list_view_info");
                    var quickSetingHeight = quickSetting.offsetHeight + 20;
                    
                    var tempContent = editFormOperationDailog.mainDiv.querySelector("#form_policy_list_view_list_id");
                    var tempHeight = editFormOperationDailog.mainDivHeight - quickSetingHeight;
                    tempContent.style.height = tempHeight + "px";
                    
                    
                    //选中上次设置的值
                    if(_this.cacheDatas.editFormOperationValue == "_sameTothis" ){
                    	editFormOperationDailog.mainDiv.querySelector("#_sameTothisInput").checked = true;
                    }else{
                    	editFormOperationDailog.mainDiv.querySelector("#_readOnlyInput").checked = true;
                    }
                    
                },
                bottonConfig : {
                    buttons :[
                              {
                                  type : 1,
                                  isPopBtn : true,
                                  label : cmp.i18n("workflow.dialog.cancel.label"),
                                  hander : function(){
                                      editFormOperationDailog.close();
                                      editFormOperationDailog = null;
                                  }
                              },
                              { 
                                 label : cmp.i18n("workflow.dialog.ok.label"),
                                 hander : function() {

                                     var checkInput = editFormOperationDailog.mainDiv.querySelector("input:checked");

                                     var _radioValue = checkInput.value;
                                     
                                     _this.cacheDatas.editFormOperationValue = _radioValue;
                                     
                                     if (addNodes && addNodes.length > 0) {
                                         for (var k = 0, len = addNodes.length; k < len; k++) {
                                             var tNode = addNodes[k];
                                             if ("_sameTothis" == _radioValue) {
                                                 tNode["fr"] = "0";
                                             } else if ("_readOnly" == _radioValue) {
                                                 tNode["fr"] = "1";
                                             }
                                         }
                                     }

                                     if(changeMsgJson){
                                         _this.setInputVal("processChangeMessage", cmp.toJSON(changeMsgJson))
                                     }
                                     editFormOperationDailog.close();
                                     editFormOperationDailog = null;
                                 }
                              }
                           ]
                   }
            })
}

/**
 * 修改节点属性
 */
WorkFlowDesigner.prototype._editPolicyNode = function(node, hasEditAll){
    
    var _this = this;
    this._loadPermissions(function(){
        
        var itemTpl = '<%for(var i = 0, len = this.datas.length; i < len; i++){' +
                      '    var item = this.datas[i];' +
                      '%>'+
                      '<li class="wf-policy-item wf-policy-edit">' +
                      '  <div class="cmp-input-row cmp-radio cmp-left">' +
                      '    <input style="left:6px;" data-name="<%=item.name%>" name="permission" value="<%=item.value%>" <%if(item.value==this.defValue){%> checked="checked"<%}%> type="radio" />' +
                      '    <label style="padding-left: 38px;"><%=item.name%></label>' +
                      '  </div>'+
                      '</li>'+
                      '<%}%>';
        var tempParams = {
                "datas" : _this.cacheDatas.permissions,
                "defValue" : node.policyId
        }
        var tplHTML = cmp.tpl(itemTpl, tempParams);
        
        var contentHTML = "";
            
        //没有应用到全部节点
        if(hasEditAll !== false){
            
            contentHTML += '<div class="wf-policy-edit wf-policy-apply-all">' +
                            '    <div>'+cmp.i18n("workflow.label.apply2AllNodes")/*应用到所有节点 */+'</div>' +
                            '    <div class="cmp-switch cmp-switch-blue cmp-switch-mini">' +
                            '      <div class="cmp-switch-handle"></div>' +
                            '    </div>' +
                            '</div>';
        }
        
        contentHTML += '<div id="policy_list_view_list_id" style="overflow:auto">' +
                            '    <ul>' 
                            + tplHTML +
                            '    </ul>' +
                            '</div>';
        
        
        var permissionDailog = _this.dialog({

            initHeader : false,
            title : cmp.i18n("workflow.label.editNodePolicy"),//修改节点权限
            dir : "right-go",
            containerExtClass : "wk-branch-back",
            zIndex : (_this.style.zIndex + 1) + "",// 层级
            show : true,
            initHTML : function() {
                return contentHTML;
            },
            onInit : function() {

                if(hasEditAll !== false){
                    var switchEle = permissionDailog.mainDiv.querySelector(".cmp-switch");
                    
                    switchEle.addEventListener("tap", function() {
                        var tempClassList = switchEle.classList;
                        if (tempClassList.contains('cmp-active')) {
                            tempClassList.remove('cmp-active');
                        } else {
                            tempClassList.add('cmp-active');
                        }
                    });
                }
            },
            onShow : function() {

                // 设置高度
                var quickSetingHeight = 0;
                
                if(hasEditAll !== false){
                    quickSetingHeight = 70;
                }
                
                var tempContent = permissionDailog.mainDiv.querySelector("#policy_list_view_list_id");

                var tempHeight = permissionDailog.mainDivHeight - quickSetingHeight;
                tempContent.style.height = tempHeight + "px";
            },
            bottonConfig : {
                buttons :[
                   {
                       type : 1,
                       isPopBtn : true,
                       label : cmp.i18n("workflow.dialog.cancel.label"),
                       hander : function(){
                           permissionDailog.close();
                           permissionDailog = null;
                       }
                   },
                   { 
                      label : cmp.i18n("workflow.dialog.ok.label"),
                      hander : function() {

                          // 获取选中的值
                          var checkInput = permissionDailog.mainDiv.querySelector("input:checked");
                          var v = checkInput.value;
                          var l = checkInput.getAttribute("data-name");

                          var isUpdateAll = false;
                          
                          if(hasEditAll !== false){
                              var switchEle = permissionDailog.mainDiv.querySelector(".cmp-switch");
                              isUpdateAll = switchEle.classList.contains('cmp-active');
                          }

                          cmp.dialog.loading();
                          var nodePropertyJson = {
                              policyId : v,
                              policyName : l,
                              dealTerm : "",
                              remindTime : "",
                              processMode : "",
                              matchScope : "",
                              desc : "",
                              dealTermType : "0",
                              dealTermUserId : "-1",
                              dealTermUserName : "-1",
                              includeChild : "true",//TODO xxx
                              rup : "1",
                              pup : "1",
                              na : "-1",
                              formApp : "",
                              formViewOperation : "",
                              formField : "",
                              tolerantModel : ""
                          }
                          
                          //加签替换权限，只替换加签的节点
                          var updateNodes = node.nodeID;
                          var nArray = _this.cacheDatas.newNodes[_this.actionKeysMap["AddNode"]];
                          if(isUpdateAll && nArray){
                              updateNodes = nArray.join(",");
                          }
                          
                          var params = {
                              "workflowXml" : _this.getInputVal("process_xml"),
                              "currentNodeId" : node.nodeID,
                              "showNodes" : _this._getAddNodeInfo(),
                              "nodePropertyJson" : cmp.toJSON(nodePropertyJson),
                              "updateAll" : isUpdateAll + "",
                              "updateNodes" : updateNodes,
                              "caseId" : _this.jsonFileds.caseId
                          }
                          $s.Workflow.freeChangeNodeProperty({}, params, errorBuilder({
                              success : function(result) {

                                  cmp.dialog.loading(false);

                                  var jsonData = result[1] || [];
                                  _this.setInputVal("process_xml", result[0]);

                                  
                                  //加签需要更新更新日志
                                  var changeMessage = _this.getInputVal("processChangeMessage");
                                  if(changeMessage){
                                      var changeMsgJson = cmp.parseJSON(changeMessage);
                                      var addNodes = changeMsgJson["nodes"];
                                      if(addNodes && addNodes.length > 0){
                                          var tempUpdateNodes = updateNodes.split(",");
                                          for(var k = 0, len = addNodes.length; k < len; k++){
                                              var tNode = addNodes[k];
                                              if(_this._isInArray(tempUpdateNodes, tNode["id"])){
                                                  tNode["polId"] = v;
                                                  tNode["polName"] = l;
                                              }
                                          }
                                          _this.setInputVal("processChangeMessage", cmp.toJSON(changeMsgJson))
                                      }
                                  }
                                  
                                  
                                  if (jsonData) {
                                      jsonData = cmp.parseJSON(jsonData);
                                      _this.drawWf(jsonData);
                                      _this._setAddNodeInfo(jsonData);

                                    //触发节点变动事件
                                      _this.fire("nodeChange", jsonData);
                                  }

                                  // 关闭
                                  permissionDailog.close();
                                  permissionDailog = null;
                              }
                          }));
                      }
                   }
                ]
            }
        });
    })
}

/**
 * 加载节点权限
 */
WorkFlowDesigner.prototype._loadPermissions = function(callback){
    
    var _this = this;
    
    if(_this.cacheDatas.permissions && cmp.isEmptyObject(_this.cacheDatas.permissions)){
        
        if(_this.getPermissions){
            cmp.dialog.loading();
            _this.getPermissions(function(datas){
                _this.cacheDatas.permissions = datas;
                cmp.dialog.loading(false);
                callback();
            });
        }else{
            _this.alert(cmp.i18n("workflow.alert.notGetPermissionsFuction"));
        }
    }else{
        callback();
    }
}

/**
 * 弹出提示信息
 */
WorkFlowDesigner.prototype.alert = function(msg, callback, title, btnName, popExeCallback){

    if(!title){
        title = cmp.i18n("workflow.label.alert");//提示
    }
    if(!btnName){
        btnName = cmp.i18n("workflow.dialog.ok.label");//确定
    }
    
    var popCallback = true;
    if(popExeCallback === false){
        popCallback = false;
    }
    
    var exeCallback = callback;
    if(!callback)
        exeCallback = function(){}
    
    cmp.notification.alert(msg, callback, title, btnName, popCallback);
}

/**
 * 调用选人组件选人
 */
WorkFlowDesigner.prototype.selectMembers = function(params){
    
    var callback = params.callback,
        type = params.type || 1,
        lightOptsChange = params.lightOptsChange || false,
        flowType = params.flowType,
        selectType = params.selectType,
        notSelectAccount = params.notSelectAccount,
        maxSize = params.maxSize || -1,
        closeCallback = params.closeCallback,
        directDepartment = params.directDepartment || false,
        label = params.label,//备选栏目
        choosableType = params.choosableType,//可选择的人
        initMembers = params.initMembers,//初始化选人
        moreOptions = params.moreOptions,
        saveSelectOrgObj = params.saveSelectOrgObj,
        nextConcurrent = params.nextConcurrent || false
        ;
    var permission = typeof(params.permission)=='undefined' ? false : params.permission;

    if(!permission){
        if("collaboration" == this.info.category 
                && !this.info.processTemplateId){
            
            permission = true;//自由协同需要做权限控制
        }
    }
    
    var _this = this;
    
    var selectPrgParam = {
            "type":type,
            "flowType" : flowType,
            "directDepartment" : directDepartment,
            "flowOptsChange" : true,
            nextConcurrent : nextConcurrent,
            lightOptsChange : lightOptsChange,//轻表单模式选人
            fillBackData: initMembers || [],
            jump:false,
            excludeData:params.excludeData,
            notSelectAccount:params.notSelectAccount,
            maxSize:maxSize,
            closeCallback:closeCallback,
            minSize:1,
            accountID:"",
            selectType:'member',
            permission:permission,
            callback: function(datas, selectType){
                
                if(selectType !== "customSelect"){
                    _this.backToMe = "0";//还原
                }
                
                var result = cmp.parseJSON(datas);
                var type = result.orgResultType;
                /*switch (type) {
                case "light":
                    break;
                case "concurrent"://并联
                    _this.handleOrgData(result.orgResult,"concurrent");
                    break;
                case "sequence"://串联
                    _this.handleOrgData(result.orgResult, "sequence");
                    break;
                default: {
                }
                }*/
                
                callback(_this.deal4wfDatas(result.orgResult), type);
            },
            "moreOptions" : moreOptions
        };
    
    if(selectType){
        selectPrgParam.selectType = selectType;
    }
    if(label){
        //备选内容
        selectPrgParam.label = label;
    }
    if(choosableType && choosableType.length > 0){
        selectPrgParam.choosableType = choosableType;
    }
    
    
    var spFunc =  function(accountExcludeElements){
         var allExcludes = accountExcludeElements;
         if(accountExcludeElements && params.excludeData ){
          	allExcludes = accountExcludeElements.concat(params.excludeData);
         }
         else if(params.excludeData){
         	allExcludes = params.excludeData;
         }
        
         selectPrgParam.excludeData = allExcludes;
         
         if(saveSelectOrgObj === true){
          // 选人界面调用
             _this.selectOrgObj = cmp.selectOrg(params.id, selectPrgParam);
         }else{
             cmp.selectOrg(params.id, selectPrgParam);
         }
    }
    
    if(!_this.cacheDatas.selectMemberExcluedeAccountElements){
            $s.Workflow.getAcountExcludeElements( {}, errorBuilder({
            
            success : function(accountExcludeElements) {
                if(accountExcludeElements){
                    _this.cacheDatas.selectMemberExcluedeAccountElements = accountExcludeElements;
                    spFunc(accountExcludeElements);
                }
            },
            error: function(){
            	_this.alert(cmp.i18n("workflow.alert.getAccountError"));
            }
        }))
    }
    else{
        spFunc(_this.cacheDatas.selectMemberExcluedeAccountElements);
    }
}

/**
 * 将选人界面的返回的数据转换成流程需要的JSON格式
 */
WorkFlowDesigner.prototype.deal4wfDatas = function(orgMembers){
    
    var ret = [];
    if(orgMembers){
        for(var i = 0, len = orgMembers.length; i < len; i++){
            //返回数据是字符串
            var d = null;
            if(typeof orgMembers[i] === "string"){
                d = cmp.parseJSON(orgMembers[i]);
            }else{
                d = orgMembers[i];
            }
            
            var r = {};
            r.id= d.id;
            r.name = d.name;
            
            r.excludeChildDepartment= false;
            r.includeChild = true;
            
            //选人组件大小写问题，无语了
            d.type = d.type.substring(0, 1).toUpperCase() + d.type.substring(1);
            
            if(d.type == "Department_Post"){
                //TODO 名字显示重置
            }else if(d.type == "Department"){
                if(d.containSubDepartment == "1"){//包含子部门
                    r.excludeChildDepartment= false; 
                    r.includeChild = true;
                }else{
                    r.excludeChildDepartment= true; 
                    r.includeChild = false;
                }
            }
            r.accountId = d.account;
            r.accountName = !d.accountName ? "" : d.accountName;
            r.entityType = d.type;
            ret.push(r);
        }
    }
    return ret;
}

/**
 * 设置流程值
 */
WorkFlowDesigner.prototype.setInputVal = function(field, val){
    /*var container = this.wfViewEleId.WF_MAIN_DIALOG.container;
    var f = container.querySelector("#" + field);
    if(f){
        f.value = val;
    }*/
    for(var key in this.jsonFileds){
        if(key === field){
            
            if(field === "workflow_node_condition_input"){
                //添加缓存key
                var vJson = null;
                if(val == ""){
                    vJson = {};
                }else{
                    vJson = cmp.parseJSON(val);
                }
                if(!vJson["matchRequestToken"]){
                    vJson["matchRequestToken"] = this.cacheDatas.matchRequestToken;
                }
                val = cmp.toJSON(vJson);
            }
            this.jsonFileds[field] = val;
        }
    }
}

/**
 * 获取流程字段值
 */
WorkFlowDesigner.prototype.getInputVal = function(field){
    /*var container = this.wfViewEleId.WF_MAIN_DIALOG.container;
    var f = container.querySelector("#" + field);
    var ret = "";
    if(f){
        ret = f.value;
    }
    return ret;*/
    return this.jsonFileds[field] || "";
}

/**
 * 转换特殊字符
 */
WorkFlowDesigner.prototype.escapeSpecialChar = function(str){
    
    if(!str){
        return str;
    }
    str= str.replace(/\&/g, "&amp;")
            .replace(/\</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g,"&#039;")
            .replace(/"/g,"&#034;");
            
    return str;
}

var delNodeBackgroundColors = ["#E95A4C", "#4098E6", "#A47566", "#D57171", "#BFA587",
                               "#8A8A8A", "#F7B55E", "#F2725E", "#568AAD", "#4DA9EB"];

WorkFlowDesigner.prototype.getDelNodeHtml = function(allDelNodes) {
	var tplHTML = "";
	
	var k = 0;
	for(var i=0; i<allDelNodes.length; i++) {
		var memberImg = "";
		if(allDelNodes[i].type == "user") {
			var imgUrl = cmp.origin + "/rest/orgMember/avatar/" + allDelNodes[i].memberId;
			memberImg = '<img class="cmp-pull-left img_setting select-head-img no-save" src="'+imgUrl+'">';
		} else {
			var firstWord = allDelNodes[i].name.substring(0, 1);
			memberImg = '<span class="tal" style="border-radius: 50%;background-color: '+delNodeBackgroundColors[k]+';">'+firstWord+'</span>';

			k++;
			if(k == 10) {
				k = 0;
			}
		}
		var canDelete = true;
		var canDeleteStyle = "";
		var showName = allDelNodes[i].name;
		if(allDelNodes[i].isAdded != "true" && this.info.isProcessTemplate){
			showName = allDelNodes[i].name+"("+cmp.i18n("workflow.deletePeople.inherentNode")+")";
			canDelete = false;
			canDeleteStyle = "margin-left: 30px;";
		}
		tplHTML += '<li type="Member" class="cmp-list-cell cmp-selectOrg-list-cell select-height-63 binded cmp-after-line" style="'+canDeleteStyle+'">';
		tplHTML += '	<div class="cmp-list-cell-img cmp-selectOrg-checkbox cmp-left select-pt-6" style="height:50px;" >';
		if(canDelete){
			tplHTML += '		<input style="opacity: 1" type="checkbox"  name="delNodes" partyName="'+showName+'" policyName="'+allDelNodes[i].policyName+'" value="'+allDelNodes[i].id+'" class="cmp-select-input select-put ">';
		}
		tplHTML += 			memberImg;
		tplHTML += '	</div>';
		tplHTML += '	<div class="cmp-list-cell-info select-pt-6 cell-android4">';
		tplHTML += '		<span class="cmp-ellipsis cmp-pull-left list_title_name">'+showName+'</span>';
		if(allDelNodes[i].postName && allDelNodes[i].postName!="") {
			tplHTML += '		<h6 class="cmp-ellipsis list_cont_info">'+allDelNodes[i].postName+'</h6>';
		}
		tplHTML += '		</span>';
		tplHTML += '	</div>';
		tplHTML += '</li>';
	}
	return tplHTML;
} 


WorkFlowDesigner.prototype.wfDelNodesDialog = function() {
	
	var _this = this;
	
	var searchHTML = "";
	searchHTML += '	<div id="delNodeTitle" class="delNodeTitle wf_flexbox" style="padding:5px;">';
	
	
	searchHTML += '	  <div style="flex-grow:1;-webkit-flex-grow:1;"><form onsubmit="return false;">'
	
                    	+ '<div class="cmp-input-row cmp-search">'
                        + '  <input id="searchInput" type="search" autocomplete="off" class="cmp-input-clear" placeholder="">'
                        + '  <span id="search-delete" class="cmp-icon cmp-icon-clear cmp-hidden"></span>'
                        + '  <span id="search-placeholder" class="cmp-placeholder">'
                        + '      <span class="cmp-icon cmp-icon-search"></span>'
                        + '      <span>'+ cmp.i18n("workflow.page.lable.search") +'</span>'
                        + '  </span>'
                        + '</div>';
	
	searchHTML += '   </form> </div>';
	
	searchHTML += '<div style="flex-grow:0;-webkit-flex-grow:0; width:40px;color:#3AADFB;"><span id="removeNodeInfoBtn" style="width:100%;height:100%;text-align:center;line-height:29px;" class="cmp-icon m3-icon-about"></span></div>';
	
	searchHTML += '	</div>';
	
	var contentHTML = "";
	contentHTML += '<div class="cmp-content cmp-selectOrg-content" style="top:0px;" id="delNodeContent">';
	contentHTML += 		searchHTML;
	contentHTML += '	<div id="delNodeContain" class="select-selected-scroll" >';
	contentHTML += '		<div class="scroller" style="transition-property: transform; transform-origin: 0px 0px 0px; transform: translate(0px, 0px) translateZ(0px);">';
	contentHTML += '			<ul id="delNodeList" class="cmp-selectOrg-list-content">';
	//contentHTML += 					nodeHTML;
	contentHTML += '			</ul>';
	contentHTML += '		</div>';
	contentHTML += '	</div>';
	contentHTML += '</div>';
	
	var delNodesDailog = _this.dialog({
	    initHeader : false,
		title : cmp.i18n("workflow.deletePeople.title"),//选择减签人员
        dir : "bottom-go",
        zIndex : (_this.style.zIndex + 1) + "",// 层级
        show : true,
        initHTML : function() {
            return contentHTML;
        },
        onInit : function() {
        	searchEvent(delNodesDailog.mainDiv);
        },
        onShow : function() {
            // 设置容器高度
            var $delNodeContain = delNodesDailog.mainDiv.querySelector("#delNodeContain");
            $delNodeContain.style.height = (delNodesDailog.mainDivHeight - 40) + "px";
        },
        bottonConfig : {
            buttons :[
               {
                   type : 1,
                   isPopBtn : true,
                   label : cmp.i18n("workflow.dialog.cancel.label"),
                   hander : function(){
                       delNodesDailog.close();
                       delNodesDailog = null;
                   }
               },
           	   { 
           		  label : cmp.i18n("workflow.dialog.ok.label"),
                  hander : function() {
            
                	    var nodes = delNodesDailog.mainDiv.querySelectorAll("input[name='delNodes']");
                	    
                  		var selectedNodes = [];
                  		var k = 0;
	                  	for(var i = 0; i < nodes.length; i++) {
	                  		if(nodes[i].type == "checkbox" && nodes[i].checked) {
	                  			selectedNodes[k] = {};
	                  			selectedNodes[k].nodeID = nodes[i].value;
	                  			selectedNodes[k].partyName = nodes[i].getAttribute("partyName");
	                  			selectedNodes[k].policyName = nodes[i].getAttribute("policyName");
	                  			k++;
	                  		}
	                  	}
	                  	
	                  	if(selectedNodes.length == 0) {
	                  		cmp.notification.alert(cmp.i18n("workflow.deletePeople.alert"), null, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
	                  	    return;
	                  	}
	                  	
	                  	delNodesDailog.close();
	                	delNodesDailog = null;
	                	
	                	_this._deleteNode(selectedNodes[0], selectedNodes);
                  }
               }
            ]
        }
    });
	
	searchEvent = function(basicDiv) {
        
        _doSearch = function(e) {
            var result = textBtn.value;
            
            if(e.keyCode == 13 || e.which == 13) {
            	var nodes = [];
            	var delNodes = _this.delNodes;
                if(result != "" && result.trim().length >0) {
                	var k = 0;
            		for(var i=0; i<delNodes.length; i++) {
                		if(delNodes[i].name.indexOf(result) >= 0) {
                			nodes[k] = delNodes[i];
                			k++;
                		}
                	}
                } else {
            		nodes = delNodes;
            	}
                document.querySelector("#delNodeList").innerHTML = _this.getDelNodeHtml(nodes);
            } 
        }
        
        var textBtn, deleteBtn, placeholderBtn, $infoBtn;
        textBtn = basicDiv.querySelector("#searchInput");
        deleteBtn = basicDiv.querySelector("#search-delete");
        placeholderBtn = basicDiv.querySelector("#search-placeholder");
        $infoBtn = basicDiv.querySelector("#removeNodeInfoBtn");
        
        // 减签提示
        $infoBtn.addEventListener("tap", function(){
            cmp.notification.alert(cmp.i18n("workflow.deletePeople.desc"), null, cmp.i18n("workflow.label.alert"), cmp.i18n("workflow.dialog.ok.label"));
        }, false);
        
        textBtn.addEventListener("keyup", _doSearch, false);
        textBtn.addEventListener("focus", function() {
            var pNode = this.parentNode;
            var pNodeCL = pNode.classList;
            if(!pNodeCL.contains("cmp-active")){
                pNodeCL.add("cmp-active");
            }
            pNode.querySelector("#search-delete").classList.remove("cmp-hidden");
        }, false);
        textBtn.addEventListener("blur", function() {
            var pNode = this.parentNode;
            if(this.value == ""){
                var pNodeCL = pNode.classList;
                if(pNodeCL.contains("cmp-active")){
                    pNodeCL.remove("cmp-active");
                }
            }
            pNode.querySelector("#search-delete").classList.add("cmp-hidden");
        }, false);
        
        deleteBtn.addEventListener("tap", function(e){
            this.parentNode.querySelector("#searchInput").value = "";
            _doSearch({
                keyCode : 13
            });
        });
        placeholderBtn.addEventListener("tap", function(e){
            this.parentNode.querySelector("#searchInput").focus();
        });
        
        
        cmp("#delNodeList").on("click", "li", function(e){
            
            var targetEle = event.target;
            if(targetEle.tagName.toLocaleLowerCase() == "input"){
                e.stopPropagation();
            }else{
                var liInput = this.querySelector("input");
                if(liInput && !liInput.disabled){
                    liInput.checked = !liInput.checked;
                }
            }
        });
    }
	
	return delNodesDailog;
	
};

/**
 * 工作流公共的方法
 */
var WorkFlowDesignerUtil = (function(){
    
    var utilApi = {};
    
    /**
     * 流程加锁
     */
    utilApi.lockH5Workflow = function(processId, action, callback){
        
        $s.Workflow.lockH5Workflow({"processId":processId,"action":action}, errorBuilder({
            success : function(result) {
                if(result) {
                    if(result.length >=2 && result[0] == "false" && result[1] != "") {
                        cmp.notification.alert(result[1], function(){
                            callback(false);
                        }, cmp.i18n("workflow.label.alert")/*提示*/, cmp.i18n("workflow.dialog.ok.label") /*确定*/);
                    }else{
                        callback(true);
                    }
                }
            },
            error:function(e){
                callback(false);
            }
        }));
    }
    
    /**
     * 流程加锁(心跳锁的方式)
     */
    utilApi.lockH5WorkflowUseNowexpirationTime = function(processId, action,useNowexpirationTime,callback){
        
        $s.Workflow.lockH5WorkflowUseNowexpirationTime({"processId":processId,"action":action,"useNowexpirationTime":useNowexpirationTime}, errorBuilder({
            success : function(result) {
                if(result) {
                    if(result.length >=2 && result[0] == "false" && result[1] != "") {
                        cmp.notification.alert(result[1], function(){
                            callback(false);
                        }, cmp.i18n("workflow.label.alert")/*提示*/, cmp.i18n("workflow.dialog.ok.label") /*确定*/);
                    }else{
                        callback(true);
                    }
                }
            },
            error:function(e){
                callback(false);
            }
        }));
    }

    /**
     * 流程解锁
     */
    utilApi.unLockH5Workflow = function(processId, action){
        if(action) {
            try {
                $s.Workflow.unLockH5Workflow({"processId":processId, "action":action}, errorBuilder());
            } catch(e) {}
        }
    }
    return utilApi;
})();

/**
 * 工作流相关页面模板
 */
var WorkFlowDesignerTpls = {
        
        /**
         * {
         * inputType : input类型， radio/checkbox
         * inputName ： 如果类型是radio用来互斥
         * name : 人员名称
         * id : 人员ID
         * post : 人员岗位
         * }
         */
        SELECT_MEMBER_LI_TPL : 
            '<%'+
            ' var mDats = null,start=0;'+
            ' if(this instanceof Array){mDats=this;}'+
            ' else{mDats=this.datas,start=this.start;}'+
            ' for(var i = 0; i < mDats.length; i++){'  +
            '     var member = mDats[i],index=start+i,c=member["selected"] ? "checked=\'checked\'":"";' +
            '%>' + 
                '<li index="<%=index%>" class="wf-list-cell wk-operator-li">' +
                '<div class="wf-list-cell-img notop wf-h-center cmp-<%=member.inputType%> cmp-left">' +
                    '<input <%=c%> name="<%=member.inputName%>" postname="<%=member.post%>" memberName="<%=member.name%>" class="select-put" type="<%=member.inputType%>" value="<%=member.id%>"/>' +
                    '<img class="img_setting" src="<%=member.headshotURL%>"/>'+
                '</div>' +
                '<div class="wf-list-cell-info wf-v-center">' +
                    '<div id="checked_<%=member.id%>" class="cmp-ellipsis wk-title"><%=member.name%></div>' +
                    '<h5 class="cmp-ellipsis wk-process-mode">' +
                        '<span><%=member.post%></span>' +
                    '</h5>' +
                '</div>' +
            '</li>' +
            '<%} %>',
            
         MULTI_SERIAL_SET_MEMBER_LI_TPL : 
               '<%'
             + '   for(var i = 0; i < this.length; i++){'
             + '     var member = this[i];'
             + '%>'
             
             + '<li isadd="<%=member.isAdd%>" mid="<%=member.id%>" mname="<%=member.name%>" mpost="<%=member.post%>" class="wf-list-cell wk-operator-li">'
             + '  <div class="wf-list-cell-img notop wf-h-center cmp-left">'
             + '    <img class="img_setting" src="<%=member.headshotURL%>"/>'
             + '  </div>'
             + '  <div class="wf-list-cell-info wf-v-center">'
             + '    <div class="cmp-ellipsis wk-title"><%=member.name%></div>'
             + '    <h5 class="cmp-ellipsis wk-process-mode">'
             + '      <span><%=member.post%></span>'
             + '    </h5>'
             + '  </div>'
             + '</li>'
             
             + '<% } %>'
            
}


/**
 * 
 * 弹出框
 * 
 * API:
 * close() : 关闭窗口，并移除dom
 * hide() : 影藏dom
 * show() : 显示dom
 * 
 * container : 最外层的容器
 * mainDiv : 内容容器
 * mainDivHeight : 内容区域高度
 * headerHeight : 头部区域高度
 * bottonDIV : 底部容器
 * header : 头上容器
 * isVisible : 是否可见
 * 
 */
var WorkflowH5Diaolg = (function(){
    
    var H5Dialog = function(config){
        
        var defaultConfig = {
                initHeader : true,//是否加载头部
                title : "",
                dir : "bottom-go",//动画方向 left-go right-go bottom-go top-go
                zIndex : "15",//层级
                id : "H5_DIALOG_" + (new Date().getTime()),//
                containerId : "H5_DIALOG_CONTAINER_" + (new Date().getTime()),
                containerExtClass : "",//扩展class
                containerExtStyle : {},//扩展style属性，样式覆盖太严重，没办法
                bottonId : "H5_DIALOG_BOTTON_" + (new Date().getTime()),
                show : true,//默认显示
                hideType : "close",//取消层级时方式 colse : 关闭，  hide : 影藏
                //正文区域内容，需要返回HTML代码或者dom对象
                initHTML : function(){return "";},
                onShow : null,
                onHide : null,
                onClose : null,
                beforeDisappear : null,//关闭或隐藏之前执行
                toastConfig : null,//横幅
                popFunction : null // 点手机返回是默认执行方法， 优先级最高，  如果没有配置， 将找 button 里面 isPop 方法， 如果还没有直接push 一个空的方法
                
                /*
                 * 
                 toastConfig : {
                     label : "横幅内容",
                     time : 2000//悬浮时间 ，单位ms,
                     layout : "center"
                 }
                 
                 //加载完成后执行方法，主要用于事件绑定
                onInit : function(){
                    
                },
                //左侧按钮配置
                leftBtnConfig :{
                    label:"",
                    extClass : "",
                    hander:function(){}
                },
                //右侧按钮配置
                rightBtnConfig : {
                    label : "",
                    extClass : "",
                    fontSize : 16,
                    hander : function(){}
                },
                //底部配置
                bottonConfig : {
                   type : 0,
                   label : "",
                   extClass : "",
                   buttons :[
                       { 
                           label : "确定",
                           hander : function(){
                           }
                       }
                   ]
                }*/
                //初始化正文区域
        }
        for(var key in defaultConfig){
            if(typeof config[key] === "undefined"){
                config[key] = defaultConfig[key];
            }
        }
        
        this.config = config;
        
        
        
        //最外层的DOM
        this.container = null;
        this.mainDiv = null;
        this.mainDivHeight = 0;
        this.bottonDIV = null;
        this.header = null;
        this.headerHeight = 0;
        this.paddingTop = 0;
        this.setHeight = false;//标记是否设置了高度， 和滚动
        this.isFirstShow = true;//
        this.isVisible= false;
        this.containerId = config.containerId;
        this.popFun = null;//点手机返回触发事件
        this.beforeTitle = "";//修改前的标题
        this.title = "";//当前页面的 title
        
        this._init_ = function(){
          
            // 记录当前头部的标题
            this.title = config.title;
            this.popFun = config.popFunction || null;
            
            //动画模块
            var tempContainer = document.createElement("DIV");
            tempContainer.className = "GM_Alert_Content Animated-Container " + config.dir + " animated";
            tempContainer.setAttribute("id", config.id);
            tempContainer.style.zIndex = config.zIndex;
            tempContainer.style.background = "#fff";
            
            
            
            if(config.initHeader === true){
                
                
                var tempHeader = document.createElement("header");
                tempHeader.className = "cmp-bar cmp-bar-nav head-style border_b";
                tempHeader.style.position = "absolute";
                
              //设置高度
                //var mainHeader = document.querySelector("body>header");
                var mainHeader = document.querySelector("header");
                if(mainHeader){
                    var mHeight = mainHeader.style.height;
                    var mPadingTop = mainHeader.style.paddingTop;
                    if(mHeight){
                        tempHeader.style.height = mHeight;
                        mHeight = parseInt(mHeight, 10);
                    }
                    if(mPadingTop){
                        tempHeader.style.paddingTop = mPadingTop;
                        mPadingTop = parseInt(mPadingTop, 10);
                        this.paddingTop = mPadingTop;
                    }
                    this.headerHeight = (mHeight || 0); //+ (mPadingTop || 0);
                    
                    if(this.headerHeight == 0){
                        this.headerHeight = mainHeader.offsetHeight;
                    }
                    
                    if(this.headerHeight == 0){
                        this.headerHeight = 44;
                        tempHeader.style.height = this.headerHeight + "px";
                        tempHeader.style.paddingTop = "0px";
                        this.paddingTop = 0;
                    }
                    
                }else{
                    // 原生去头部适配
                    this.headerHeight = 44;
                    this.paddingTop = 0;
                    
                    tempHeader.style.height = this.headerHeight + "px";
                    tempHeader.style.paddingTop = "0px";
                }
                
                
                //左上角按钮
                if(config.leftBtnConfig){
                    var lConfig = config.leftBtnConfig;
                    var lNav = document.createElement("a");
                    lNav.className = "cmp-pull-left left-btn " + (lConfig.extClass  || "");
                    lNav.innerText = lConfig.label;
                    lNav.setAttribute("href", "javascript:void(0)");
                    if(lConfig.hander){
                        cmp.event.click(lNav, function(){
                            lConfig.hander();
                        });
                        /*lNav.addEventListener('tap', function(){
                            lConfig.hander();
                        });*/
                        if(this.popFun === null && lConfig.isPopBtn === true){
                            this.popFun = lConfig.hander;
                        }
                    }
                    tempHeader.appendChild(lNav);
                }
                
                //右上角按钮
                if(config.rightBtnConfig){
                    var rConfig = config.rightBtnConfig;
                    var nav = document.createElement("a");
                    nav.className = "cmp-icon cmp-pull-right " + (rConfig.extClass || "");//
                    nav.innerText = rConfig.label;
                    
                    if(config.rightBtnConfig.fontSize){
                        nav.style.fontSize = config.rightBtnConfig.fontSize + "px";
                    }else{
                        nav.style.fontSize = "16px";
                    }
                    
                    nav.style.height = "100%";
                    var navHeight = 24;//this.headerHeight - this.paddingTop - 20;
                    if(navHeight > 0){
                        nav.style.lineHeight = navHeight + "px";
                    }
                    //nav.style.marginTop = "6px";//同左边图标底部保持相同高度
                    nav.setAttribute("href", "javascript:void(0)");
                    if(rConfig.hander){
                        cmp.event.click(nav, function(){
                            rConfig.hander();
                        });
                        /*nav.addEventListener('tap', function(){
                            rConfig.hander();
                        });*/
                        if(this.popFun === null && rConfig.isPopBtn === true){
                            this.popFun = rConfig.hander;
                        }
                    }
                    if(!mainHeader){
                      nav.style.marginTop = "-20px";
                    }
                    tempHeader.appendChild(nav);
                }
                
                var tempTitle = document.createElement("h1");
                tempTitle.className = "cmp-title common-title";
                tempTitle.innerText = config.title;
                tempTitle.id = "cmp-title_id";
                tempHeader.appendChild(tempTitle);
                
                tempContainer.appendChild(tempHeader);
                
                this.header = tempHeader;
                
            }
            
            //流程展示容器
            var showEl = document.createElement("div");
            showEl.className = "wf-container workflow " + (config.containerExtClass || "");
            showEl.setAttribute("id", config.containerId);
            showEl.style.position = "relative";
            showEl.style.top = (this.headerHeight || 0) + "px";
            if(config.containerExtStyle){
                for(var style in config.containerExtStyle)
                    showEl.style[style] = config.containerExtStyle[style];
            }
            var cHTML = config.initHTML();
            if(cHTML){
                if (typeof cHTML === 'object'){
                    showEl.appendChild(cHTML);
                }else if (typeof cHTML === 'string'){
                    showEl.innerHTML = cHTML;
                }
            }
            tempContainer.appendChild(showEl);
            
            //底部区域
            if(config.bottonConfig){
                var pButtons = config.bottonConfig.buttons || [];
                var b = document.createElement("div");
                var bLen = pButtons.length;
                b.setAttribute("id", config.bottonId);
                
                b.className = "cmp-bar cmp-bar-footer wf_dialog_botton " + (bLen === 1 ? "siggle " : "") + (config.bottonConfig.extClass || "");
                if(bLen > 0){
                    for(var t = 0; t < bLen; t++){
                        var button = document.createElement("button");
                        button.setAttribute("type", "button");
                        
                        var secondaryClass = "";
                        if(pButtons[t]["type"] === 1){
                            secondaryClass = "secondary";
                        }
                        
                        button.className = "cmp-btn wf_text-ellipsis wf_flex-1 wf_button " + (bLen === 1 ? "siggle_button " : "") + secondaryClass;
                        button.style.verticalAlign = "middle";
                        button.innerText = pButtons[t]["label"];
                        if(pButtons[t]["hander"]){
                            button.addEventListener('tap', pButtons[t]["hander"]);
                            if(this.popFun === null && pButtons[t]["isPopBtn"] === true){
                                this.popFun = pButtons[t]["hander"];
                            }
                        }
                        b.appendChild(button);
                    }
                }else{
                    b.style.fontSize = "12px";
                    b.innerText = config.bottonConfig.label;
                }
                tempContainer.appendChild(b);
                this.bottonDIV = b;
            }
            
            
            document.body.appendChild(tempContainer);
            
            this.container = tempContainer;
            this.mainDiv = showEl;
            
            var _this = this;
            if(config.show){
              //动画进入
                setTimeout(function(){
                    _this.show();
                }, 300);
            }
            
            if(config.onInit){
                setTimeout(function(){
                    //执行加载完成
                      config.onInit();
                  }, 50);
            }
        }
        

        /**
         * 设置标题
         */
        this._setPageTitle = function(thisTitle){
            
            var $title = document.querySelector("title");
            if(thisTitle === true){
                if(this.title){
                    $title.innerHTML = this.title;
                }
            }else{
                
                if(this.beforeTitle){
                    $title.innerHTML = this.beforeTitle;
                }
            }
        }
        
        this.setTitle =  function(_title){
            if(config.initHeader === true){
                this.header.querySelector("#cmp-title_id").innerText = _title;
            }
            this.title = _title;
        }
        
        this._beforeDisappear = function(){
            var tRet = true;
            if(config.beforeDisappear){
                tRet = config.beforeDisappear();
            }
            return tRet;
        }
        
        //关闭
        this.close = function(){
            
            if(this.isVisible){
                 if(!this._beforeDisappear()){
                     return;
                 }
                 
                 //移除层级
                 this.container.classList.remove("cmp-active");
                 if(config.onClose){
                     config.onClose();
                 }
                 
                 this.isVisible = false;
               //cmp 返回键注销事件
                 cmp.backbutton.pop();
                 
              // 设置标题
                 this._setPageTitle(false);
            }
            
            var _this = this;
            setTimeout(function(){
                _this.container.remove();
            }, 300);
        }
        
        //影藏
        this.hide = function(){
            
            if(!this.isVisible){
                return; 
             }
            
            if(!this._beforeDisappear()){
                return;
            }
            
            if(this.container.classList.contains('cmp-active')){
                this.container.classList.remove('cmp-active');
                if(config.onHide){
                    config.onHide();
                }
            }
            this.isVisible = false;
            
            //cmp 返回键注销事件
            cmp.backbutton.pop();
            
            // 设置标题
            this._setPageTitle(false);
        }
        
        /**
         * 
         */
        this.toggle = function(){
            
            if(!this.isVisible){
                this.show();
            }else{
                if(this.hideType == "close"){
                    this.close();
                }else{
                    this.hide();
                }
            }
        }
        
        this.showBottonDIV = function(isShow){
            if(isShow){
                this.bottonDIV.classList.remove("display_none");
            } else {
                this.bottonDIV.classList.add("display_none");
            }
            this.computeHeight();
        }
        
        //计算高度
        this.computeHeight = function(){
            var bHeight = 0;
            //底部高度
            if(this.bottonDIV && !this.bottonDIV.classList.contains("display_none")){
                bHeight = 50;//this.bottonDIV.offsetHeight
            }
            
            //头部高度
            var hHeight = 0;
            
            if(config.initHeader === true){
                hHeight = this.headerHeight || this.header.offsetHeight;
                this.headerHeight = hHeight;
            }
            
            //容器总高度
            var cHeight = WF_WINDOW_HEIGHT;//this.container.offsetHeight;
            
            this.mainDivHeight = cHeight - bHeight - hHeight;
            
            this.mainDiv.style.height = this.mainDivHeight + "px";
        }
        
        //显示
        this.show = function(){
            
            if(this.isVisible){
               return; 
            }
            
            var toShow = false,
                _this = this;
            
            if(!this.container.classList.contains('cmp-active')){
                this.container.classList.add('cmp-active');
                toShow = true;
            }
            
            if(!this.setHeight){
                
                if(this.config.delaySetHeight === true){
                    setTimeout(function(){
                        _this.computeHeight();
                    }, 300);
                }else{
                    _this.computeHeight();
                }
                this.setHeight = true;
            }
            
            //触发回调
            if(toShow && config.onShow){
                config.onShow(); 
            }
            this.isVisible = true;
            
            //向cmp压堆栈
            cmp.backbutton.push(function(){
                if(_this.popFun){
                    _this.popFun();
                }else{
                    _this.toggle();
                }
            });
            
            // 记录修改前的标题
            this.beforeTitle = document.querySelector("title").innerText;

            // 设置标题
            this._setPageTitle(true);
            
            //拉横幅
            if(this.isFirstShow){
                this.isFirstShow = false;
                var t = this.config.toastConfig;
                if(t){
                    var toast = document.createElement("div");
                    toast.className = "workflow_toast " + (t.layout || "");
                    toast.innerHTML = '<span class="m3-icon-about margin_r_6"></span><span>' + t.label + "</span>";
                    toast.style.top = this.headerHeight + "px";
                    this.container.appendChild(toast);
                    
                    if(t.time){
                        setTimeout(function(){
                            function a(){
                                this.removeEventListener("webkitAnimationEnd", a);
                                this.remove();//自杀移除
                                a = null;
                            }
                            toast.addEventListener("webkitAnimationEnd", a, false); 
                            toast.classList.add("disappear");
                            toast = null;
                        }, t.time);
                    }
                }
            }
        }
        
        //初始化
        this._init_();
    }
    
    return H5Dialog;
})();