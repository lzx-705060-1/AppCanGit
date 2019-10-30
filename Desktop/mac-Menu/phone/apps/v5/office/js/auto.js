cmp.ready(function(){
    document.getElementById("title").innerText = cmp.i18n("office.h5.auditauto");
    cmp.backbutton();
    if (_getQueryString("VJoinOpen") == "VJoin") {
        urlParam.affairId = _getQueryString("affairId");
    } else {
        urlParam = getUrlParam();
    }
    headerShow();
    _bindEvent();
    cmp.footerAuto("#footer_num");
    checkAffairValid(getAutoAuditInfo);
    cmp.dialog.loading(false);
});

var date = new Date();
var urlParam = {};
var workFlowJson = "";
var wfDesigner = null;
var submitData = {};
var choice = "";
function _submitHandle(){
    cmp(".bottomBtn").on('tap', "#noPass", function(){
		cmp.notification.confirm(cmp.i18n("office.h5.confirm1"),function(index){
			if(index == 0){
			}else if(index == 1){
				auditSubmit("1");
			}
		},cmp.i18n("office.h5.prompt"),[cmp.i18n("office.h5.cancel"),cmp.i18n("office.h5.okbutton")]);
    });
    cmp(".bottomBtn").on('tap', "#pass", function(){
        auditSubmit("0");
    });
}
/**
 * 写入审批详情
 */
function getAutoAuditInfo() {
    // var urlParam1 = parseQueryString(window.location.search);
    var param = {"affairId": urlParam.affairId};
    $s.Auto.autoAuditInfo("", param, {
        success: function (rv) {
            console.log(rv);
            if(rv.state == "1"){
                if(rv.auditInfo.AuditDone){
                    // 已处理
                    cmp.dialog.failure(cmp.i18n("office.h5.alert34"),function(index){
                        backFrom();
                    },"",[cmp.i18n("office.h5.okbutton")]);

                }
                workFlowJson = rv.WorkFlowItem;

                document.getElementById("applyId").value = rv.auditInfo.id;
                var applyUser = document.getElementById("applyUser").value = rv.auditInfo.applyUser;
                var applyUserName = document.getElementById("applyUserName").value = rv.auditInfo.applyUserName;
                var applyUserPhoneNum = document.getElementById("applyUserPhoneNum").value = rv.auditInfo.applyUserPhoneNum;
                var applyDept = document.getElementById("applyDept").value = rv.auditInfo.applyDept;
                var applyDeptName = document.getElementById("applyDeptName").value = rv.auditInfo.applyDeptName;
                // var startMemberId = document.getElementById("startMemberId");
                // var startMemberName = document.getElementById("startMemberName");
                var passenger = document.getElementById("passenger").value = rv.auditInfo.passenger;
                var passengerNum = document.getElementById("passengerNum").value = rv.auditInfo.passengerNum;
                var applyOrigin = document.getElementById("applyOrigin").value = rv.auditInfo.applyOrigin;//用车理由
                // var applyDate = document.getElementById("applyDate");
                var useTime1 = document.getElementById("useTime1").value = rv.auditInfo.useTime1;
                var useTime2 = document.getElementById("useTime2").value = rv.auditInfo.useTime2;
                var applyDep = document.getElementById("applyDep").innerHTML = escapeStringToHTML(rv.auditInfo.applyDep);
                var applyDes = document.getElementById("applyDes").innerHTML = escapeStringToHTML(rv.auditInfo.applyDes);
                var applyDepartType = document.getElementById("applyDepartType");
                var applyMemo = document.getElementById("applyMemo").value = rv.auditInfo.applyMemo;//备注
                var auditContent = document.getElementById("auditContent").value = rv.auditInfo.auditContent;//审批意见
                var autoNum = document.getElementById("autoNum").value = rv.auditInfo.autoNum;
                var selfDriving = document.getElementById("selfDriving");
                var msgToPassenger = document.getElementById("msgToPassenger");
                var applyDriver = document.getElementById("applyDriver").value = rv.auditInfo.applyDriver;
                var applyDriverName = document.getElementById("applyDriverName").value = rv.auditInfo.applyDriverName;
                var applyDriverPhone = document.getElementById("applyDriverPhone").value = rv.auditInfo.applyDriverPhone;
                // var createDate = document.getElementById("createDate");
                // var AuditDone = document.getElementById("AuditDone");
                // var workFlowState = document.getElementById("workFlowState");

                // startMemberId.value = rv.auditInfo.startMemberId;
                // startMemberName.value = rv.auditInfo.startMemberName;
                // applyDate.value = rv.auditInfo.applyDate;
                var applyDepartTypeItems = rv.applyDepartTypeItems;
                var selectEnumId = "";
                for(var i = 0;i<applyDepartTypeItems.length;i++){
                    var item = applyDepartTypeItems[i];
                    var optionId = "autoType_"+ item.enumvalue;
                    var text = item.showvalue;
                    var enumId = item.id;
                    var optionDom = document.createElement("option");
                    optionDom.setAttribute("id",optionId);
                    optionDom.setAttribute("enumId",enumId);
                    optionDom.innerHTML = text;
                    if(rv.auditInfo.applyDepartType==item.enumvalue){
                        // optionDom.selected = true;
                        applyDepartType.value = text;
                        selectEnumId = enumId;
                    }
                    // document.getElementById("applyDepartType").appendChild(optionDom);
                }

                if(rv.auditInfo.selfDriving){
                    selfDriving.checked = true;//是否自驾
                }
                if(rv.auditInfo.msgToPassenger == "1"){
                    msgToPassenger.checked = true;//是否通知乘车人
                }
                // createDate.value = rv.auditInfo.createDate;
                // AuditDone.value = rv.auditInfo.AuditDone;
                // workFlowState.value = rv.auditInfo.workFlowState;
                submitData.applyId = rv.auditInfo.id;
                submitData.auditOpinion = "";
                submitData.affairMemberId = rv.WorkFlowItem.currentUserId;
                submitData.auditAttitude = "";
                var workFlow = {};
                workFlow.workFlowJSON = "{\"UseMember\":\"" + rv.auditInfo.applyUser + "\",\"UseDept\":\"" + rv.auditInfo.applyDept + "\",\"UseType\":\"" + selectEnumId + "\",\"UseReason\":\"" + rv.auditInfo.applyOrigin + "\",\"UseAutoNum\":\"" + rv.auditInfo.autoNum + "\"}";
                workFlow.workItemId = rv.WorkFlowItem.workItemId;
                submitData.workFlow = workFlow;

                //流程分支可能有的字段
                choice = "{\"UseMember\":\"" + rv.auditInfo.applyUser +"\",\"UseLevel\":\"" + rv.auditInfo.applyLevel +"\",\"UseDept\":\"" + rv.auditInfo.applyDept + "\",\"UseType\":\"" + selectEnumId + "\",\"UseReason\":\"" + rv.auditInfo.applyOrigin + "\",\"UseAutoNum\":\"" + rv.auditInfo.autoNum + "\"}";
            }
            if(rv.state == "-1"){
                // 待审批申请不存在！
                cmp.dialog.failure(cmp.i18n("office.h5.alert1"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);

            }
            if(rv.state == "-2"){
                // alert("待办不存在！");
                cmp.dialog.failure(cmp.i18n("office.h5.alert2"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
        },
        error: function(error){
            if(cmp.errorHandler(error)){
                backFrom();
                return false;
            }
        }
    });
}

/**
 * 检查审批状态
 */
function checkAutoAuditState(){
    cmp.dialog.loading(cmp.i18n("office.h5.submiting"));
    var param = {affairId:workFlowJson.affairId,isAudit:"true"};
    $s.Auto.autoAuditCheck("",param,{
        success: function (rv) {
            _initWfDesigner();
            if(rv){
                console.log("预提交前："+submitData.auditAttitude);
                if(submitData.auditAttitude == "0"){
                    preSubmit(preSubmitFunction);
                }
                if(submitData.auditAttitude == "1"){
                    preSubmitFunction();
                }
            }else{
                _listRefresh();
                cmp.dialog.loading(false);
                //综合办公《车辆使用申请》已经被撤销！
                cmp.dialog.failure(cmp.i18n("office.h5.alert31"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
        }
    });
}
function preSubmitFunction() {
    //提交审批
    console.log("审批");
    var wfData = wfDesigner.getDatas().workflow_definition;

    submitData.workFlow.workflow_node_condition_input = wfData.workflow_node_condition_input;
    submitData.workFlow.workflow_newflow_input = wfData.workflow_newflow_input;
    submitData.workFlow.readyObjectJSON = wfData.readyObjectJSON;
    submitData.workFlow.workflow_node_peoples_input = wfData.workflow_node_peoples_input;
    submitData.workFlow.process_rulecontent = wfData.process_rulecontent;
    submitData.workFlow.process_message_data = wfData.process_message_data;

    submitData.workFlow.officeData = submitData.workFlow.workFlowJSON;
    $s.Auto.autoAuditSubmit("", submitData, {
        success: function (rv) {
            //返回状态0：成功，1：申请被删除,2.流程已经撤销
            console.log("提交完成");

            console.log(rv);
            cmp.dialog.loading(false);
            _listRefresh();
            if(rv ==0){
                // alert("提交成功");
                cmp.dialog.success(cmp.i18n("office.h5.success1"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv ==1){
                // alert("综合办公《车辆使用申请》已经被竞争执行完毕!");
                cmp.dialog.failure(cmp.i18n("office.h5.alert33"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv ==2){
                // alert("车辆申请流程已撤销！");
                cmp.dialog.failure(cmp.i18n("office.h5.alert32"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
        }
    });
}
/**
 * 提交
 */
function auditSubmit(auditAttitude) {
    cmp.dialog.loading(cmp.i18n("office.h5.submiting"));
    var auditOpinion = document.getElementById("auditOpinion").value;
    document.getElementById("auditOpinion").blur();
    if(isEmoji(auditOpinion)){
        cmp.notification.alert(cmp.i18n("office.h5.alertemoji"),null,cmp.i18n("office.h5.prompt"));
        cmp.dialog.loading(false);
        return false;
    }
    if(getRealLength(auditOpinion)>600){
        //审批意见最大长度：600
        cmp.notification.alert(cmp.i18n("office.h5.alert6"),null,cmp.i18n("office.h5.prompt"));
        cmp.dialog.loading(false);
        return false;
    }
    submitData.auditAttitude = auditAttitude;
    if(typeof auditOpinion != 'undefined'){
        submitData.auditOpinion = auditOpinion;
    }
    // checkAffairValid(checkAutoAuditState);
    checkAutoAuditState();
}
function isEmoji(text) {
    var reg = new RegExp(/\ud83d[\udc00-\ude4f\ude80-\udfff]/g);
    return reg.test(text);
}
/**
 * 取字符串实际长度
 * @param str
 * @returns {number}
 */
function getRealLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function prevPage() {
    // cmp("#page_header").on('tap', "#prev", function (e) {
    //     backFrom();
    // });
    //安卓手机返回按钮监听！
    cmp.backbutton.push(backFrom);
}
function backFrom() {
	if(urlParam["weixinMessage"]){
    	cmp.href.closePage();
    	return;
    }
    var pageInfo = urlParam["pageInfo"];
    if(pageInfo && pageInfo["url"] && pageInfo["url"]!="") {
    	var pageURL = pageInfo["url"];
    	var prePageData = pageInfo["data"];
    	var nextFlash = {"animated":true,"direction":"right"};
        cmp.href.next(pageURL, prePageData,nextFlash);
    } else {
    	cmp.href.back();
    }
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

//----------前端js----------//
//绑定事件
function _bindEvent(){
    //正文页签切换点击事件
    _toggleFlowHandle();
    //提交按钮事件
    _submitHandle();
    //返回事件
    prevPage();
}

/**
 * 正文流程切换
 */
function _toggleFlowHandle(){
    //旗帜的点击事件
    cmp("#contentAndWfTags").on('tap', ".cmp-control-item", function(){
        var contentId = this.getAttribute("href");
        if(contentId == "#workflow"){
            document.getElementById("footer_num").style.display = "none";
            openWorkflow("workflowDetail",workFlowJson);
        }else if(contentId == "#summary_info"){
            document.getElementById("footer_num").style.display = "block";
        }
    });
}

function headerShow() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { //是微信浏览器
        document.getElementById("summary_info").style.height = window.innerHeight - document.getElementById("contentAndWfTags").clientHeight - 100 + "px";
    } else { //不是微信浏览器
        document.getElementById("summary_info").style.height = window.innerHeight - document.getElementById("contentAndWfTags").clientHeight - 100 + "px";
    }
}
function _listRefresh(){
    //触发列表刷新
    cmp.webViewListener.fire({
        type: 'com.seeyon.m3.ListRefresh',
        /* 这里传appID，
         '1'，协同，
         '4'，公文，
         '6'，会议，
         '[7,8,9,10]'，文化建设审批，
         '26'，综合办公审批，
         '10'，调查，

         数据类型是[Object string]
         */
        data: {type: 'update'}
    });
}
//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}