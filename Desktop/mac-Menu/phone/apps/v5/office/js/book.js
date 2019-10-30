cmp.ready(function(){
    document.getElementById("title").innerText = cmp.i18n("office.h5.auditbook");
    cmp.backbutton();
    if (_getQueryString("VJoinOpen") == "VJoin") {
        urlParam.applyId = _getQueryString("applyId");
    } else {
        urlParam = getUrlParam();
    }
    headerShow();
    _bindEvent();
    cmp.footerAuto("#footer_num");
    // checkAffairValid(getBookAuditInfo);
    getBookAuditInfo();
});

var date = new Date();
var urlParam = {};

function _submitButtonHandle(){
    console.log("加事件");
    cmp("#noPass").on('tap', ".bottomLeftBtn", function(){
        auditSubmit("noPass");
    });
    cmp("#pass").on('tap', ".bottomMiddleBtn", function(){
        auditSubmit("pass");
    });
    cmp("#passAndLend").on('tap', ".bottomRightBtn", function(){
        auditSubmit("passAndLend");
    });
}

function getBookAuditInfo() {
    // var urlParam1 = parseQueryString(window.location.search);
    var param = {"applyId": urlParam.applyId};//2663325597922574524
    $s.Book.bookAuditInfo("", param, {
        success: function (rv) {
            console.log(rv);
            if(rv.state == 1){
                var applyState = rv.bookApplyVO.applyState;
                if(applyState==0){
                    cmp.notification.alert(cmp.i18n("office.h5.alert41"),function(){backFrom();},"",cmp.i18n("office.h5.okbutton"));
                }else if(applyState == 5||applyState == 10||applyState == 15||applyState == 20){
                    cmp.notification.alert(cmp.i18n("office.h5.alert42"),function(){backFrom();},"",cmp.i18n("office.h5.okbutton"));
                }else if(applyState == 25||applyState == 30){
                    cmp.notification.alert(cmp.i18n("office.h5.alert43"),function(){backFrom();},"",cmp.i18n("office.h5.okbutton"));
                }

                document.getElementById("applyId").value = rv.bookApplyVO.bookApplyPO.id;
                document.getElementById("applyUser").value = rv.bookApplyVO.applyUser;
                document.getElementById("applyDept").value = rv.bookApplyVO.applyDept;
                document.getElementById("startDate").value = rv.bookApplyVO.startDate;
                document.getElementById("endDate").value = rv.bookApplyVO.endDate;
                document.getElementById("bookNum").innerHTML = rv.bookApplyVO.bookNum;
                document.getElementById("bookName").innerHTML = rv.bookApplyVO.bookName;
                document.getElementById("bookAuthor").innerHTML = rv.bookApplyVO.bookInfoVO.bookAuthor;
                document.getElementById("bookPublisher").innerHTML = rv.bookApplyVO.bookInfoVO.bookPublisher;
                document.getElementById("bookHouseName").innerHTML = rv.bookApplyVO.bookHouseName;
                document.getElementById("bookCategory").value = rv.bookApplyVO.bookCategory;
                document.getElementById("bookCount").value = rv.bookApplyVO.bookInfoVO.bookCount;
                document.getElementById("applyCount").value = rv.bookApplyVO.applyCount;
                document.getElementById("applyDesc").value = rv.bookApplyVO.bookApplyPO.applyDesc;
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

function auditSubmit(flag) {
    cmp.dialog.loading(cmp.i18n("office.h5.submiting"));
    console.log("提交"+ flag);
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
    //日期校验
    if (flag == 'passAndLend') {
        var endDate = $('#endDate').val();
        if (endDate != '' && fnDateParse(endDate).getTime() < new Date().getTime()) {
            //已超过借阅期间，请重新发起借阅申请
            cmp.notification.alert(cmp.i18n("office.h5.alert7"),null,"");
            cmp.dialog.loading(false);
            return false;
        }
    }
    //提交审批
    var param = {
        "flag": flag,//passAndLend pass nopass
        "applyId": document.getElementById("applyId").value,
        "auditFlag": "audit",
        "auditOpinion": auditOpinion
    };
    $s.Book.bookAuditSubmit("", param, {
        success: function (rv) {
            _listRefresh();
            console.log(rv);
            // alert(rv.result);
            // cmp.href.next();
            cmp.notification.alert(rv.result,function(){backFrom();},"",cmp.i18n("office.h5.okbutton"));
        }
    });
}
function fnDateParse(dateStr) {
    dateStr = dateStr.replace(/-/g,"/");
    return new Date(dateStr);
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
//绑定事件
function _bindEvent(){
    //正文页签切换点击事件
    _toggleFlowHandle();
    //底部按钮事件
    _submitButtonHandle();
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
            openWorkflow();
        }else if(contentId == "#summary_info"){

        }
    });
}

function headerShow() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { //是微信浏览器
        document.getElementById("summary_info").style.height = window.innerHeight - 100 + "px";
    } else { //不是微信浏览器
        document.getElementById("summary_info").style.height = window.innerHeight - document.getElementById("contentAndWfTags").clientHeight - 100 + "px";
    }
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
function getUrlParam() {
    return urlParam = cmp.href.getParam();
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