cmp.ready(function(){
    document.getElementById("title").innerText = cmp.i18n("office.h5.auditstock");
    cmp.backbutton();
    if (_getQueryString("VJoinOpen") == "VJoin") {
        urlParam.affairId = _getQueryString("affairId");
    } else {
        urlParam = getUrlParam();
    }
    headerShow();
    _bindEvent();
    checkAffairValid(getStockAuditInfo);
    cmp.footerAuto("#footer_num");
    // wfDesigner = _initWfDesigner();
    cmp.dialog.loading(false);
});
var date = new Date();
var urlParam = {};
var workFlowJson = "";
var wfDesigner = null;
var submitData = {};
var choice = "";
//绑定事件
function _bindEvent(){
    //正文页签切换点击事件
    _toggleFlowHandle();
    _submitHandle();
    //返回事件
    prevPage();
}

function getStockAuditInfo() {
    // var urlParam1 = parseQueryString(window.location.search);
    var param = {"affairId": urlParam.affairId};
    $s.Stock.stockAuditInfo("", param, {
        success: function (rv) {
            if(rv.state == 1){
                console.log(rv);
                workFlowJson = rv.workFlowJson;

                if(workFlowJson.auditState === true||workFlowJson.auditState === "true"){
                    // 已处理
                    cmp.dialog.failure(cmp.i18n("office.h5.alert14"),function(index){
                        backFrom();
                    },"",[cmp.i18n("office.h5.okbutton")]);
                }

                document.getElementById("applyUserName").value = rv.stockUseVo.applyUserName;
                document.getElementById("applyDate").value = rv.stockUseVo.applyDate;
                document.getElementById("applyDeptName").value = rv.stockUseVo.applyDeptName;
                document.getElementById("applyTotal").value = rv.stockUseVo.applyTotal;
                document.getElementById("applyDesc").value = rv.stockUseVo.applyDesc;
                document.getElementById("auditContent").value = rv.stockUseVo.auditContent;

                submitData.applyId = rv.stockUseVo.applyId;
                submitData.auditOpinion = "";
                submitData.affairMemberId = rv.workFlowJson.currentUserId;
                submitData.auditAttitude = "";
                var workFlow = {};
                workFlow.workFlowJSON = "{\"UseMember\":\""+rv.stockUseVo.applyUser+"\",\"UseDept\":\""+rv.stockUseVo.applyDept + "\",\"UseReason\":\""+rv.stockUseVo.applyDesc+"\",\"ApplyTotal\":\""+rv.stockUseVo.applyTotal+"\"}";
                workFlow.workItemId = rv.workFlowJson.workItemId;
                submitData.workFlow = workFlow;
                for(var i = 0;i<rv.applyList.length;i++){
                    createStockInfoDiv(rv.applyList[i]);
                }

                //流程分支可能有的字段
                var stockHouseList = [];
                for(var i = 0;i<rv.applyList.length;i++){
                    stockHouseList.push(rv.applyList[i].stockHouseName);
                }
                choice = "{\"StockHouse\":\"" + stockHouseList + "\"}";
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
        error: function(error){
            if(cmp.errorHandler(error)){
                backFrom();
                return false;
            }
        }
    });
}
function createStockInfoDiv(data,dom){
    var rowDivClone = document.getElementById("prototypeDiv").cloneNode(true);
    rowDivClone.setAttribute("id", data.id);
    rowDivClone.setAttribute("class", "stockInfoRow-short");
    rowDivClone.removeAttribute("hidden");
    var info0 = rowDivClone.querySelector("#stockName");
    var info1 = rowDivClone.querySelector("#stockNum");
    var info2 = rowDivClone.querySelector("#stockTypeName");
    var info3 = rowDivClone.querySelector("#stockModel");
    var info4 = rowDivClone.querySelector("#stockPriceStr");
    var info5 = rowDivClone.querySelector("#stockCount");
    var info6 = rowDivClone.querySelector("#applyAmount");
    var info7 = rowDivClone.querySelector("#stockHouseName");
    var info8 = rowDivClone.querySelector("#stockHouseManagerName");
    var info9 = rowDivClone.querySelector("#totalPrice");

    info0.innerHTML = data.stockName;
    info1.innerHTML = data.stockNum;
    info2.innerHTML = data.stockTypeName;
    info3.innerHTML = data.stockModel?data.stockModel:"";
    info4.value = data.stockPriceStr;
    info5.value = data.stockCount;
    info6.value = data.applyAmount;
    info7.value = data.stockHouseName;
    info8.value = data.stockHouseManagerName;
    info9.value = data.totalPrice;

    info0.setAttribute("id", info0.getAttribute("id")+"_"+data.id);
    info1.setAttribute("id", info1.getAttribute("id")+"_"+data.id);
    info2.setAttribute("id", info2.getAttribute("id")+"_"+data.id);
    info3.setAttribute("id", info3.getAttribute("id")+"_"+data.id);
    info4.setAttribute("id", info4.getAttribute("id")+"_"+data.id);
    info5.setAttribute("id", info5.getAttribute("id")+"_"+data.id);
    info6.setAttribute("id", info6.getAttribute("id")+"_"+data.id);
    info7.setAttribute("id", info7.getAttribute("id")+"_"+data.id);
    info8.setAttribute("id", info8.getAttribute("id")+"_"+data.id);
    info9.setAttribute("id", info9.getAttribute("id")+"_"+data.id);
    document.getElementById("summary_info").insertBefore(rowDivClone,document.getElementById("prototypeDiv"));
    cmp.event.click(document.getElementById(data.id),function(e){
        var domObj = e.currentTarget;
        var rowState = domObj.getAttribute("class");
        if(rowState == "stockInfoRow-short"){
            domObj.setAttribute("class","stockInfoRow-full");
        }else{
            domObj.setAttribute("class","stockInfoRow-short");
        }
    });
}

function checkStockAuditState(){
    var param = {affairId:workFlowJson.affairId,isAudit:"true"};
    //检查affair是否是代办状态
    $s.Stock.stockAuditCheck("",param,{
       success: function (rv) {
           _initWfDesigner();
           if(rv){
              if(submitData.auditAttitude == "0"){
                  preSubmit(preSubmitFunction);
              }
              if(submitData.auditAttitude == "1"){
                  preSubmitFunction();
              }
          }else{//办公用品领用申请已其他人被处理!
              _listRefresh();
              cmp.dialog.loading(false);
              cmp.dialog.failure(cmp.i18n("office.h5.alert11"),function(index){
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
    $s.Stock.stockAuditSubmit("", submitData, {
        success: function (rv) {
            cmp.dialog.loading(false);
            //返回状态0：成功，1：申请被删除,2.流程已经撤销
            console.log("提交完成");
            console.log(rv);
            _listRefresh();
            if(rv ==0){
                // alert("成功");
                cmp.dialog.success(cmp.i18n("office.h5.success1"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv ==1){
                // 综合办公《办公用品领用申请》已经被竞争执行完毕!
                cmp.dialog.failure(cmp.i18n("office.h5.alert13"),function(index){
                    backFrom();
                },"",[cmp.i18n("office.h5.okbutton")]);
            }
            if(rv ==2){
                // 办公用品领用申请已经撤销!
                cmp.dialog.failure(cmp.i18n("office.h5.alert12"),function(index){
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
        //審批意見最大長度：600
        cmp.notification.alert(cmp.i18n("office.h5.alert6"),null,cmp.i18n("office.h5.prompt"));
        cmp.dialog.loading(false);
        return false;
    }
    submitData.auditAttitude = auditAttitude;
    if(typeof auditOpinion != 'undefined'){
        submitData.auditOpinion = auditOpinion;
    }
    checkAffairValid(checkStockAuditState);
    // checkStockAuditState();
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
		cmp.notification.confirm(cmp.i18n("office.h5.confirm3"),function(index){
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