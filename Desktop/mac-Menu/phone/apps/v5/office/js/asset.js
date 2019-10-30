cmp.ready(function(){
    document.getElementById("title").innerText = cmp.i18n("office.h5.auditasset");
    cmp.backbutton();

    if (_getQueryString("VJoinOpen") == "VJoin") {
        urlParam.affairId = _getQueryString("affairId");
    } else {
        urlParam = getUrlParam();
    }

    headerShow();
    _bindEvent();
    cmp.footerAuto("#footer_num");
    checkAffairValid(getAssetAuditInfo);
    cmp.dialog.loading(false);
});

var date = new Date();
var urlParam = {};
var workFlowJson = "";
var wfDesigner = null;
var submitData = {};
var choice = "";
//----------数据获取与提交----------//
function getAssetAuditInfo() {
    // var urlParam1 = parseQueryString(window.location.search);
    var param = {"affairId": urlParam.affairId};
    $s.Asset.assetAuditInfo("", param, {
        success: function (rv) {
            if(rv.state == 1){
                document.getElementById("summary_info").scrollTop = document.getElementById("summary_info").scrollHeight;
                console.log(rv);
                workFlowJson = rv.workflow;
                var assetUseVo = rv.assetUseVo;
                var assetInfo = rv.assetInfo;
                if(assetUseVo.applyDone ==="true"||assetUseVo.applyDone === true){
                    // 已处理
                    cmp.dialog.failure(cmp.i18n("office.h5.alert24"),function(index){
                        backFrom();
                    },"",[cmp.i18n("office.h5.okbutton")]);
                }

                //申请属性
                document.getElementById("applyUserId").value = assetUseVo.applyUserId;
                document.getElementById("applyUserName").value = assetUseVo.applyUserName;
                document.getElementById("applyDept").value = assetUseVo.applyDept;
                document.getElementById("applyDeptName").value = assetUseVo.applyDeptName;
                document.getElementById("useTime1").value = assetUseVo.useTime1;
                document.getElementById("useTime2").value = assetUseVo.useTime2;
                if(assetUseVo.isOften == 1){
                    document.getElementById("isOften").checked = true;
                }
                var str = assetUseVo.ApplyDesc;
                var regEnter=new RegExp("<br/>","g");
                var regSpace=new RegExp("&nbsp;","g");
                str= str.replace(regEnter,"\r\n");
                str= str.replace(regSpace," ");
                document.getElementById("ApplyDesc").value = str;
                document.getElementById("auditContent").value = assetUseVo.auditContent;
                document.getElementById("applyAmount").value = assetUseVo.applyAmount;
                //设备属性
                document.getElementById("assetInfoId").value = assetInfo.assetInfoId;
                document.getElementById("assetNum").innerHTML = assetInfo.assetNum;
                document.getElementById("assetType").value = assetInfo.assetType;
                document.getElementById("assetTypeName").innerHTML = assetInfo.assetTypeName;
                document.getElementById("assetName").innerHTML = assetInfo.assetName;
                document.getElementById("assetBrand").innerHTML = assetInfo.assetBrand;
                document.getElementById("assetModel").innerHTML = assetInfo.assetModel;
                document.getElementById("assetDesc").value = assetInfo.assetDesc;
                document.getElementById("currentCount").value = assetInfo.currentCount;

                var applyDesc = document.getElementById("ApplyDesc");
                applyDesc.style.height = applyDesc.scrollHeight + "px";
                var assetDesc = document.getElementById("assetDesc");
                assetDesc.style.height = assetDesc.scrollHeight + "px";
                var auditContent = document.getElementById("auditContent");
                auditContent.style.height = auditContent.scrollHeight + "px";

                submitData.applyId = assetUseVo.id;
                submitData.auditOpinion = "";
                submitData.affairMemberId = workFlowJson.currentUserId;
                submitData.auditAttitude = "";
                var workFlow = {};
                workFlow.workFlowJSON = "{\"UseMember\":\""+assetUseVo.applyUserName +"\",\"UseDept\":\""+assetUseVo.applyDept + "\",\"UseReason\":\""+assetUseVo.ApplyDesc+"\",\"ApplyTotal\":\""+assetUseVo.applyAmount+"\"}";
                workFlow.workItemId = workFlowJson.workItemId;
                submitData.workFlow = workFlow;
                document.getElementById("summary_info").scrollTop = 0;
                //流程分支可能有的字段
                choice = "";
            }
            if(rv.state == "-1"){
                // alert("待审批申请不存在！");
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
        error: function(rv){
            if(cmp.errorHandler(error)){
                backFrom();
                return false;
            }
        }
    });
}

function checkAssetAuditState(){
    var param = {affairId:workFlowJson.affairId,isAudit:"true"};
    $s.Asset.assetAuditCheck("",param,{
       success: function (rv) {
           _initWfDesigner();
           if(rv){
               if(submitData.auditAttitude == "0"){
                   preSubmit(preSubmitFunction);
               }
               if(submitData.auditAttitude == "1"){
                   preSubmitFunction();
               }
           }else{
               _listRefresh();
               cmp.dialog.loading(false);
               //办公设备领用申请已经撤销
               cmp.dialog.failure(cmp.i18n("office.h5.alert21"),function(index){
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
    $s.Asset.assetAuditSubmit("", submitData, {
        success: function (rv) {
            cmp.dialog.loading(false);
            //返回状态0：成功，1：申请被删除,2.流程已经撤销
            console.log("提交完成");
            console.log(rv);
            _listRefresh();
            if(rv == 0){
                // alert("成功");
                cmp.dialog.success(cmp.i18n("office.h5.success1"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv == 1){
                // alert("申请被删除");
                cmp.dialog.failure(cmp.i18n("office.h5.alert23"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv == 2){
                // alert("流程已经撤销");
                cmp.dialog.failure(cmp.i18n("office.h5.alert22"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
        }
    });
}
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
    checkAffairValid(checkAssetAuditState);
    // checkAssetAuditState();
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
function _submitHandle(){
	cmp(".bottomBtn").on('tap', "#noPass", function(){
		cmp.notification.confirm(cmp.i18n("office.h5.confirm2"),function(index){
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