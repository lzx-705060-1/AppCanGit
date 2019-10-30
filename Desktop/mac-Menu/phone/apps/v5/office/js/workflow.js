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
 * [config.workflow.readyObjectJSON] string 工作流扭转需要参数  默认值:""
 * [config.workflow.workflow_data_flag] string 工作流扭转需要参数 默认值:"WORKFLOW_SEEYON",
 * [config.workflow.process_info] string] string 工作流扭转需要参数  默认值:""
 * [config.workflow.process_info_selectvalue] string 工作流扭转需要参数  默认值:""
 * [config.workflow.process_subsetting] string 工作流扭转需要参数  默认值:""
 * [config.workflow.workflow_newflow_input] string 工作流扭转需要参数  默认值:""
 * [config.workflow.process_rulecontent] string 工作流扭转需要参数  默认值:""
 * [config.workflow.workflow_node_peoples_input] string 工作流扭转需要参数  默认值:""
 * [config.workflow.workflow_node_condition_input] string 工作流扭转需要参数  默认值:""
 * [config.workflow.processId] string 流程ID 默认值:"",
 * [config.workflow.caseId] string 工作流实例ID 默认值:"-1",
 * [config.workflow.subObjectId·] string 工作流节点一条记录的标志，对应ctp_affair的subObjectId, 一一对应  默认值:"-1",
 * [config.workflow.currentNodeId] string 当前节点 默认值:"start",
 * [config.workflow.process_message_data] string 加签，减签发送消息用
 * [config.workflow.processChangeMessage] string 工作流扭转需要参数  默认值:""
 * [config.workflow.process_event] string 工作流扭转需要参数  默认值:""
 *
 *
 * 样式参数
 * [config.style.zIndex] string 工作流层级
 *
 * 参数设置
 * config.info.state string  流程图状态 view-只读 edit-编辑， edit_current-处理时加签或当前会签  默认值:"view"
 * config.info.category string 分类 例如：collaboration
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
 *
 * addNode()  加签
 * jointSign() 当前会签
 * inform() 知会
 * passRead() 传阅
 * multistageSign() 多级会签
 * isWfEmpty() 校验流程是否为空
 * delStorDatas() 删除缓存数据
 *
 * FLOW_TYPE 流程类型
 *
 *
 */
function _initWfDesigner(){
    if(wfDesigner == null){
        wfDesigner = new WorkFlowDesigner({
            workflow : {
                moduleType : "26",
                processId : workFlowJson.processId,
                caseId : workFlowJson.caseId,
                currentNodeId : workFlowJson.activityId,
                subObjectId : workFlowJson.workItemId
            },
            info : {
                state : "edit",
                currentAccountId : workFlowJson.currentAccountId,
                currentAccountName : workFlowJson.currentAccountName,
                currentUserId : workFlowJson.currentUserId,
                currentUserName : workFlowJson.currentUserName,
                category : "office",
                workItemId : workFlowJson.workItemId,
                affairId : workFlowJson.affairId,
                summaryId : workFlowJson.summaryId,
                bodyType : "10",
                activityId : workFlowJson.activityId,
                processTemplateId : workFlowJson.processTemplateId
            }

        });
    }
}


function preSubmit(callBackFunction) {
    wfDesigner.preSubmit({
        formInfos : {
            contentDataId : choice
        },
        contentData : [],
        onPop : function(){
            //组件层级管理，需要把这个影藏
            cmp.dialog.loading(false);
        },
        callback : function(preSubmitResult) {
            console.log("预提交结果：");
            console.log(preSubmitResult);
            if (preSubmitResult["result"] == "true") {
                //继续调用转圈
                cmp.dialog.loading(cmp.i18n("office.h5.prepare.submiting"));
                //处理
                callBackFunction();
            }
        }
    });
}
/**
 * 工作流的图——炒鸡山寨自制小组件，综合办公特供
 * @param domId 要显示流程图的DIV的ID
 * @param workFlowJson 从controller里传来的相关工作流的参数集合 包含：processId，affairState，caseId，activityId
 */
//----------流程图----------//
function openWorkflow(domId,workFlowJson) {
    var ce = document.querySelector("#"+domId);
    var _loadStatus = ce.getAttribute("_loadStatus");
    if(_loadStatus == "0"){
        //未加载
        _loadWorkFlow(domId,workFlowJson);
    }
}
/**
 * 加载流程
 */
function _loadWorkFlow(domId,workFlowJson){
    var wfEle = document.querySelector("#"+domId);
    var workFlowParam = {};
    if(workFlowJson.processId == "" || workFlowJson.processId == null){
        workFlowParam.isRunning = false;
        workFlowParam.processId = workFlowJson.processId;
    }else{
        workFlowParam.processId = workFlowJson.processId;
        if( workFlowJson.affairState != 1){
            workFlowParam.caseId = workFlowJson.caseId;
        }
        workFlowParam.isRunning = true;
        workFlowParam.activityId = workFlowJson.activityId;
    }

    //设置成流程加载中
    wfEle.setAttribute("_loadStatus", "1");
    // wfEle.innerText = "加载中...";
    $s.Workflow.getWorkflowDiagramData(workFlowParam,{
        success : function(result) {
            result.activityId = workFlowParam.activityId;
            //设置成流程已加载
            wfEle.setAttribute("_loadStatus", "2");
            initWorkFlow(result,domId);
        },
        error:function(error){
            if(cmp.errorHandler(error)){
                alert(cmp.i18n("office.h5.load.error") + error);
                backFrom();
                return false;
            }
        }
    });
}

//生成流程图
function initWorkFlow(workFlowData,workFlowId){
    var listType = "onlyView";
    if(listType != "listSent") {
        if(workFlowData && workFlowData.nodes) {
            for(var i=0; i<workFlowData.nodes.length; i++) {
                workFlowData.nodes[i].isHasten = false;
            }
        }
    }
    cmp.flowV5(workFlowData,{  //流程数据
        id:workFlowId,//容器id
        callback:function(nodeInfo, typeName) { //回调函数
            // alert(cmp.toJSON(nodeInfo));
        }
    });
}

function checkAffairValid(checkAffairCallback) {
    cmp.dialog.loading(cmp.i18n("office.h5.check") + "Affair...");
    var param = {"affairId": urlParam.affairId};
    $s.Coll.checkAffairValid(param, {
        success: function (rv) {
            if(typeof rv.error_msg == 'undefined'){
                if(checkAffairCallback){
                    checkAffairCallback();
                }
                return true;
            }else{
                // alert(rv.error_msg);
                cmp.dialog.failure(rv.error_msg,function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
                cmp.dialog.loading(false);
            }
        },
        error: function(error){
            console.log("checkAffair出错");
            if(cmp.errorHandler(error)){
                backFrom();
                return false;
            }

        }
    });
}


//----------附加题----------//
function parseQueryString(url)
{
    var obj={};
    var keyvalue=[];
    var key="",value="";
    var paraString=url.substring(url.indexOf("?")+1,url.length).split("&");
    for(var i = 0;i<paraString.length;i++){
        keyvalue=paraString[i].split("=");
        key=keyvalue[0];
        value=keyvalue[1];
        obj[key]=value;
    }
    return obj;
}