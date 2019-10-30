var urlParam = {};
var inquiryId;
var affairId;
var affairState = 0;
var comeFrom = 0;
var $offsetTopDom = null;
var inq_data = null;
var lockInquiry = false;
cmp.ready(function () {
    cmp.dialog.loading();
    if (_getQueryString("VJoinOpen") == "VJoin") {
        //对VJoin穿透过来的新闻进行处理
        urlParam['affairId'] = _getQueryString("summaryId");
		if(typeof(urlParam['affairId']) == 'undefined'||urlParam['affairId']==""||urlParam['affairId']==null){
			affairId = false;
			urlParam['affairId'] = affairId;
		} else {
			affairId = urlParam['affairId'];
		}
        urlParam['inquiryId'] = _getQueryString("inquiryId");
        var comeFrom = _getQueryString("comeFrom");
        urlParam['comeFrom'] = comeFrom==="1"?1:0;
    } else {
        urlParam = getUrlParam();
    }
	//urlParam["inquiryId"] = '3562184277508047404';
    //urlParam['comeFrom'] = 2;
    //urlParam['affairState'] = 4;
    //inquiryId  ='3562184277508047404';
    //comeFrom = 2;
    //affairState = 4;
	if (urlParam) {
		inquiryId = urlParam['inquiryId'];
		if(typeof(urlParam['affairId']) == 'undefined'||urlParam['affairId']==""){
			affairId = false;
		} else {
			affairId = urlParam['affairId'];
		}
		affairId = typeof(urlParam['affairId']) == 'undefined'? false: urlParam['affairId'];
		comeFrom = typeof(urlParam['comeFrom']) == 'undefined'? 0: urlParam['comeFrom'];
        affairState = typeof(urlParam['affairState']) == 'undefined'? 0: urlParam['affairState'];
	} else {
        cmp.href.closePage();
        return;
    }
  	// 头部显示(微协同屏蔽Header)
  	//headerShow();
    prevPage();

    $s.Inquiry.inquiryDetails(inquiryId,affairId,comeFrom,affairState,"",{
        repeat:true,   //当网络掉线时是否自动重新连接
    	success:function(result){
            cmp.dialog.loading(false);
            viewCallBack(result);
    	},
        error:function(error){
            cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
              //cmp处理了这个错误
            }else {
              //customHandle(error) ;//走自己的处理错误的逻辑
              cmp.href.closePage();
            }
        }
    });
    _$("#top_div").style.height = window.innerHeight + "px";
    document.body.onscroll=function(){
        footerAuto("", "");
    };
});

function viewCallBack(data){
    var result = data.result;
    var substate = data.substate;
    if(data.error == "true"){
    	document.getElementById("sendBtn").style.display = "none";
        if(substate == 4){
            cmp.notification.alert(cmp.i18n("inquiry.h5.audit.alreadyDeal"), function () {
            	//触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    data: {type: 'update'}
                });
                backFrom();
            }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
        } else {
            cmp.notification.alert(cmp.i18n("inquiry.h5.stateError"), function () {
                backFrom();
            }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
        }
    } else if(data.inqLock == "true"){
    	document.getElementById("sendBtn").style.display = "none";
        cmp.notification.alert(data.inqLockMember + cmp.i18n("inquiry.h5.audit.dealOnPc"), function () {
            backFrom();
        }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
    }else {
        inq_data = result;
        loadData(result);
        showComplete();
        _$("#sendBtn").addEventListener("tap", _submit);
        _$("#scroll").style.height = _$("#scroll").clientHeight - _$("#approval").clientHeight  -  _$("#inquiryFoot").clientHeight + "px";
    }
}

/**
 * 模板数据加载
 * @param data
 */
function loadData(data) {
    data.comeFrom = urlParam.comeFrom;
    try {
        if(data.metaData.inquiryState == 4){
            var liTpl_head = document.getElementById("inquiry_detail_head_audit").innerHTML;
            var table_head = document.getElementById('body_inquiry_head');
            var html_head = cmp.tpl(liTpl_head, data);
            table_head.innerHTML = table_head.innerHTML + html_head;
            if(urlParam.comeFrom == '4'){
                document.getElementById("inquiryFoot").style.display = "block";
                footFunctions(true);
            }else{
                document.getElementById("approval").style.display = "block";
                auditInquiry();
                lockInquiry = true;
            }
            // Header固定
            //cmp.HeaderFixed(_$("#inquiry_header"), _$("#auditInput"));
        }else if(data.metaData.inquiryState == 1 || data.metaData.inquiryState == 2){//1-审核未通过 2-审过未发
            var checker = data.metaData.inquiryChecker;
            var checkMind =cmp.i18n("inquiry.h5.desc") + "：" + data.metaData.inquiryCheckMind;
            var checkStr = "";
            if(data.metaData.inquiryState == 1){
                checkStr = escapeStringToHTML(checker) + cmp.i18n("inquiry.h5.nopass");
            }
            if(data.metaData.inquiryState == 2){
                checkStr = escapeStringToHTML(checker) + cmp.i18n("inquiry.h5.pass");
            }
            var auditDomList = document.querySelectorAll("#body_audit_head span");
            auditDomList[0].innerHTML = checkStr;
            auditDomList[1].innerHTML = checkMind;
            document.getElementById("body_audit_head").style.display = "block";
            document.getElementById("inquiryFoot").style.display = "block";

            var liTpl_head = document.getElementById("inquiry_detail_head").innerHTML;
            var table_head = document.getElementById('body_inquiry_head');
            var html_head = cmp.tpl(liTpl_head, data);
            table_head.innerHTML = table_head.innerHTML + html_head;
            if(data.metaData.inquiryState == 1){
                footFunctions(true);
            }else if(data.metaData.inquiryState == 2){
                footFunctions(false);
            }
        } else {
            var liTpl_head = document.getElementById("inquiry_detail_head").innerHTML;
            var table_head = document.getElementById('body_inquiry_head');
            var html_head = cmp.tpl(liTpl_head, data);
            table_head.innerHTML = table_head.innerHTML + html_head;

            if(urlParam.comeFrom == '4'){
                document.getElementById("inquiryFoot").style.display = "block";

                if(data.metaData.inquiryState == 3){//草稿
                    footFunctions(false);
                }else{
                    footFunctions(true);
                }
            }
        }
        if (data.package.inquiryBefore != "") {
            var liTpl_body = document.getElementById("inquiry_detail_body").innerHTML;
            var table_body = document.getElementById('body_inquiry_body');
            var html_body = cmp.tpl(liTpl_body, data);
            table_body.innerHTML = table_body.innerHTML + html_body;
        }
        var liTpl = document.getElementById("inquiry_detail_li").innerHTML;
        var table = document.getElementById('body_inquiry_details');
        var html = cmp.tpl(liTpl, data);
        table.innerHTML = table.innerHTML + html;

        var attrsTpl = document.getElementById("attachmentList_js").innerHTML;
        var attrsTable = document.getElementById('body_inquiry_attrs');
        var attrsHtml = cmp.tpl(attrsTpl, data);
        attrsTable.innerHTML = attrsTable.innerHTML + attrsHtml;

        var inquiryState = data.metaData.inquiryState;
        if (!(urlParam.comeFrom!='4' && inquiryState == '8' && data.package.myState != "true"&& data.metaData.inquiryIsInScope == "true")) {
            document.getElementById("sendBtn").style.display = "none";
        }
        var timer = setTimeout(function () {
            if (_$("#inquiry_Before") && _$("#inquiry_Before").offsetHeight > 64) {
                _$("#inquiry_Before_more").classList.remove("display_hide");
            }
        }, 100);
        var timer_1 = setTimeout(function () {
            var img_opt_list = document.getElementsByClassName("img_opt");
            for (i = 0; i < img_opt_list.length; i++) {
                if (img_opt_list[i].offsetHeight > 65) {
                    var show_more = img_opt_list[i].parentNode.nextElementSibling;
                    show_more.classList.remove("display_hide");
                }
            }
        }, 100);

        cmp("body").on('tap', ".showImg", function (e) {
            var _eThis = this;
            cmp.dialog.loading();
            var csses = [_cmpBASEPATH + "/css/cmp-sliders.css" + $verstion];
            cmp.asyncLoad.css(csses);
            var jses = [_cmpBASEPATH + "/js/cmp-sliders.js"+ $verstion
                        ];
            cmp.asyncLoad.js(jses,function(){
                cmp.dialog.loading(false);
            	var index = _eThis.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll("img.showImg").length;
                var imgArray = [];
                var imgNameArray = [];
                for(var imgNum = 0;imgNum < _eThis.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll("img.showImg").length;imgNum++){
                    var _src = _eThis.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll("img.showImg")[imgNum].getAttribute("src-data");
                    imgArray.push(_src);
                    imgNameArray.push(_eThis.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll("img.showImg")[imgNum].getAttribute("imgName"));
                }
                var imgCount = _eThis.getAttribute("imgCount");
                //调度大图查看
                cmp.sliders.addNew(imgArray,imgNameArray);
                cmp.sliders.detect(imgCount);
            });
        });

        for (var i = 0; i < document.getElementsByClassName("showImg").length; i++) {
            document.getElementsByClassName("showImg")[i].style.height = document.getElementsByClassName("showImg")[i].parentNode.parentNode.parentNode.parentNode.clientWidth * 0.8 + "px";
        }
        if (document.getElementById("quest_imgId")) {
            document.getElementById("quest_imgId").style.height = document.getElementById("quest_imgId").clientWidth * 160 / 441 + "px";//宽和高441:160
            document.getElementById("quest_imgId").parentNode.style.height = document.getElementById("quest_imgId").clientWidth * 160 / 441 + "px";
        }
        var timer_3 = setTimeout(function () {
            var radio_img_opt = document.getElementsByClassName("radio_img_opt");
            for (i = 0; i < radio_img_opt.length; i++) {
                if (i % 2 != 0) {
                    if (radio_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.clientHeight > radio_img_opt[i].parentNode.parentNode.parentNode.parentNode.clientHeight) {
                        radio_img_opt[i].parentNode.parentNode.parentNode.parentNode.style.height = radio_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.clientHeight + "px";
                    } else {
                        radio_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.style.height = radio_img_opt[i].parentNode.parentNode.parentNode.parentNode.clientHeight + "px";
                    }
                }
            }
            var checkbox_img_opt = document.getElementsByClassName("checkbox_img_opt");
            for (i = 0; i < checkbox_img_opt.length; i++) {
                if (i % 2 != 0) {
                    if (checkbox_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.clientHeight > checkbox_img_opt[i].parentNode.parentNode.parentNode.parentNode.clientHeight) {
                        checkbox_img_opt[i].parentNode.parentNode.parentNode.parentNode.style.height = checkbox_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.clientHeight + "px";
                    } else {
                        checkbox_img_opt[i - 1].parentNode.parentNode.parentNode.parentNode.style.height = checkbox_img_opt[i].parentNode.parentNode.parentNode.parentNode.clientHeight + "px";
                    }
                }
            }
        }, 200);

        setInterval(function () {
            for (var i = 0; i < document.getElementsByClassName("input-radio").length; i++) {
                if (document.getElementsByClassName("input-radio")[i].checked == true) {
                    if (document.getElementsByClassName("input-radio")[i].parentNode.lastChild.previousSibling.getAttribute("disabled")) {
                        document.getElementsByClassName("input-radio")[i].parentNode.lastChild.previousSibling.removeAttribute("disabled");
                    }
                } else {
                    if (!document.getElementsByClassName("input-radio")[i].parentNode.lastChild.previousSibling.getAttribute("disabled")) {
                        document.getElementsByClassName("input-radio")[i].parentNode.lastChild.previousSibling.setAttribute("disabled", "true");
                    }
                }
            }
        }, 50);
        setInterval(function () {
            for (var i = 0; i < document.getElementsByClassName("input-checkbox").length; i++) {
                if (document.getElementsByClassName("input-checkbox")[i].checked == true) {
                    if (document.getElementsByClassName("input-checkbox")[i].parentNode.lastChild.previousSibling.getAttribute("disabled")) {
                        document.getElementsByClassName("input-checkbox")[i].parentNode.lastChild.previousSibling.removeAttribute("disabled");
                    }
                } else {
                    if (!document.getElementsByClassName("input-checkbox")[i].parentNode.lastChild.previousSibling.getAttribute("disabled")) {
                        document.getElementsByClassName("input-checkbox")[i].parentNode.lastChild.previousSibling.setAttribute("disabled", "true");
                    }
                }
            }
        }, 50);

    } catch (e) {
        alert(e.message);
    }
    //附件展示
    if (data.metaData.inquiryAtts.length > 0) {
        hasAttchment = true;
        initFile("#attchemntFileList", data.metaData.inquiryAtts);
        //设置数量
        var attContainer = _$("#att_list");
        attContainer.querySelector("#att_file_count").innerText = data.metaData.inquiryFileCount;
        attContainer.querySelector("#att_ass_count").innerText = data.metaData.inquiryCollCount;
        addAttchmentFileClick();
    } else {
        //没有附件直接移除容器
        _$("#att_list").remove();
    }
    lastFocus();
    cmp.i18n.detect();
}

//添加防护：部分安卓机偶发键盘弹出，页面没有顶上去的情况
function lastFocus(){
    if(_$('#lastFocus') && cmp.os.android){
        _$('#lastFocus').addEventListener('focus', function() {
            document.getElementById("lastDiv").style.display="block";
        });
        _$('#lastFocus').addEventListener('blur', function() {
            document.getElementById("lastDiv").style.display="none";
        });
    }
}

/**
 * 提交
 */
function _submit() {
    document.getElementById('sendBtn').focus();
    //验证调查状态是否存在
    $s.Inquiry.checkInquiryState(inquiryId, {}, {
        repeat:false,   //当网络掉线时是否自动重新连接
        success: function (result) {
            if (result.state == "1") {
                cmp.notification.alert(cmp.i18n("inquiry.h5.stateError"), function () {
                	backFrom();
                	return false;
                }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
            } else if (result.state == "2") {
                cmp.notification.alert(cmp.i18n("inquiry.h5.submitAgain"), function () {
                	backFrom();
                	return false;
                }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
            } else {
            	data_submit();
            }
        },
        error:function(error){
            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
              //cmp处理了这个错误
            }else {
              //customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}


function data_submit(){
    if (checkQuestion()) {
        var answer = "{\"inquiryId\": \"" + inquiryId + "\"";
        var quList = "\"quList\": [";
        var body_inquiry = _$("#body_inquiry_details").children;
        for (i = 0; i < body_inquiry.length; i++) {
            var ad = body_inquiry[i];
            var qId = ad.getAttribute("id");
            var qType = parseInt(ad.getAttribute("qType"));
            var isJump = parseInt(ad.getAttribute("qJump"));
            var qMin = parseInt(ad.getAttribute("qMin"));
            var qMax = parseInt(ad.getAttribute("qMax"));
            var qJump = 0;
            var qOpt = "";
            var qText = "";
            if (qType == 0 || qType == 1 || qType == 4 || qType == 5) {
                if (isJump == "1") {
                    qJump = "1";
                }
                var opt_check = ad.getElementsByTagName("input");
                for (j = 0; j < opt_check.length; j++) {
                    if (opt_check[j].checked) {
                        var optContent = "";
                        if (qType == 0 || qType == 1) {
                            if (opt_check[j].getAttribute("oExtContent") == "1") {
                                optContent = _escapeStringToJavascript(filteremoji(trim(opt_check[j].nextElementSibling.value)));
                            }
                        }
                        qOpt = qOpt + "\"" + opt_check[j].id + "\":\"" + optContent + "\",";
                    }
                }
                qOpt = qOpt.substr(0, qOpt.length - 1);
            } else if (qType == 2 || qType == 3) {
                if (isJump == "1") {
                    qJump = "1";
                }
                var qText = filteremoji(trim(ad.getElementsByClassName("inputText")[0].value));

            }
            var qu = "{" +
                "\"qId\": \"" + qId + "\"," +
                "\"qType\": " + qType + "," +
                "\"isJump\": \"" + qJump + "\"," +
                "\"qText\": \"" + qText + "\"," +
                "\"qOpt\": {" + qOpt + "}" +
                "}";
            quList = quList + qu + ",";
        }
        quList = quList.substr(0, quList.length - 1);
        answer = answer + "," + quList + "]}";
        var param = {
            "inquiryText": answer
        };
        var msgInfo = document.getElementById("inquiryAfter").value;
        $s.Inquiry.submitInquiry({}, param, {
            repeat:false,   //当网络掉线时是否自动重新连接
            success: function (result) {
                //触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    data: {type: 'update'}
                });
                if (result.result == "success") {
                	if(msgInfo==""||msgInfo==null||msgInfo=="null"){
                		backFrom();
                	} else {
                		cmp.notification.alert(msgInfo, function () {
                            // cmp.href.next(_inquiryPath + "/html/inquiryIndex.html?date=" + (new Date().getTime()));
                			backFrom();
                        }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                	}

                } else if(result.result == "again"){
                    cmp.notification.alert(cmp.i18n("inquiry.h5.submitAgain"), function () {
                    	backFrom();
                    }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                } else {
                    cmp.notification.alert(cmp.i18n("inquiry.h5.stateError"), function () {
                    	backFrom();
                    }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                }
            },
            error:function(error){
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                  //cmp处理了这个错误
                }else {
                  //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });

    } else {
        document.getElementById("top_div").style.marginTop = 0 + "px";
        $offsetTopDom.scrollIntoView();
        //document.getElementById("top_div").style.marginTop = 64 + "px";
        $offsetTopDom = null;
    }
}

/**
 * 问题标准验证
 * @param
 */
function checkQuestion() {
    var body_inquiry = _$("#body_inquiry_details").children;
    var check_falseCount = 0;
    for (i = 0; i < body_inquiry.length; i++) {
        var ad = body_inquiry[i];
        var qType = parseInt(ad.getAttribute("qType"));
        var qJump = parseInt(ad.getAttribute("qJump"));
        var qMin = parseInt(ad.getAttribute("qMin"));
        var qMax = parseInt(ad.getAttribute("qMax"));
        if (qType == 0 || qType == 4) {
            var opt_check = ad.getElementsByTagName("input");
            var count = 0;
            var length_check = true;
            for (j = 0; j < opt_check.length; j++) {
                if (opt_check[j].checked) {
                    if (qType == 0 && opt_check[j].getAttribute("oExtContent") == "1") {
                        var content_length = opt_check[j].nextElementSibling.value;
                        if (getReallength(content_length) > 100) {
                            if (!$offsetTopDom) {
                                $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                            }
                            ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                            ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                            ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.chooseInputNum");
                            ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                            length_check = false;
                            check_falseCount++;
                        } else {
                            if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide") && length_check) {
                                ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                            }
                        }
                    }
                    count++;
                }
            }
            if (count == 0 && qJump == "0") {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                check_falseCount++;
            } else {
                if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide") && length_check) {
                    ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                }
            }
        }
        if (qType == 1 || qType == 5) {
            var opt_check = ad.getElementsByTagName("input");
            var count = 0;
            var length_check = true;
            for (j = 0; j < opt_check.length; j++) {
                if (opt_check[j].checked) {
                    if (qType == 1 && opt_check[j].getAttribute("oExtContent") == "1") {
                        var content_length = opt_check[j].nextElementSibling.value;
                        if (getReallength(content_length) > 100) {
                            if (!$offsetTopDom) {
                                $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                            }
                            ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                            ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                            ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.chooseInputNum");
                            ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                            length_check = false;
                            check_falseCount++;
                        } else {
                            if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide") && length_check) {
                                ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                            }
                        }
                    }
                    count++;
                }
            }
            if (qJump == 0 && count == 0) {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                check_falseCount++;

            } else if (qMax > 0 && qMax == qMin && count != qMax) {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.chooseNumOnly") +" "+ qMax +" "+ cmp.i18n("inquiry.h5.chooseNumLast");
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                check_falseCount++;
            } else if (qMax > 0 && count > qMax) {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.chooseNumMost") +" "+ qMax +" "+ cmp.i18n("inquiry.h5.chooseNumLast");
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                check_falseCount++;
            } else if (qMin > 0 && count < qMin) {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.chooseNumLeast") +" "+ qMin +" "+ cmp.i18n("inquiry.h5.chooseNumLast");
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                check_falseCount++;
            } else {
                if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide") && length_check) {
                    ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                }
            }
        }
        if (qType == 2) {
            var content = trim(ad.getElementsByClassName("inputText")[0].value);
            if ((content == null || content == "") && qJump == "0") {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                ad.getElementsByClassName("inputText")[0].classList.add("inputText_red");
                check_falseCount++;
            } else if (getReallength(content) > 1600 && qJump == "0") {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.inputMoreNum");
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                ad.getElementsByClassName("inputText")[0].classList.add("inputText_red");
                check_falseCount++;
            } else {
                if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide")) {
                    ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                    ad.getElementsByClassName("inputText")[0].classList.remove("inputText_red");
                }
            }
        }
        if (qType == 3) {
            var content = trim(ad.getElementsByClassName("inputText")[0].value);
            if ((content == null || content == "") && qJump == "0") {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                ad.getElementsByClassName("inputText")[0].classList.add("inputText_red");
                check_falseCount++;
            } else if (getReallength(content) > 100 && qJump == "0") {
                if (!$offsetTopDom) {
                    $offsetTopDom = ad.getElementsByClassName("Hint")[0];
                }
                ad.getElementsByClassName("Hint")[0].style.width = window.screen.availWidth + "px";
                ad.getElementsByClassName("Hint")[0].style.marginLeft = -12 + "px";
                ad.getElementsByClassName("Hint")[0].childNodes[1].innerHTML = cmp.i18n("inquiry.h5.inputOnlyNum");
                ad.getElementsByClassName("Hint")[0].classList.remove("display_hide");
                ad.getElementsByClassName("inputText")[0].classList.add("inputText_red");
                check_falseCount++;
            } else {
                if (!ad.getElementsByClassName("Hint")[0].classList.contains("display_hide")) {
                    ad.getElementsByClassName("Hint")[0].classList.add("display_hide");
                    ad.getElementsByClassName("inputText")[0].classList.remove("inputText_red");
                }
            }
        }
    }
    if (check_falseCount == 0) {
        return true;
    } else {
        return false;
    }
}

function showComplete() {
    cmp("body").on('tap', "#inquiry_Before_more", function (e) {
        var cont = this.previousSibling.previousSibling;
        if (cont.classList.contains('cmp-ellipsis-3')) {
            cont.classList.remove('cmp-ellipsis-3');
            this.innerText = cmp.i18n("inquiry.h5.retract");
        } else {
            cont.classList.add('cmp-ellipsis-3');
            this.innerText = cmp.i18n("inquiry.h5.All");
        }
    });

    cmp("body").on('tap', ".inquiry_img_opt_more", function (e) {
        var cont = this.previousSibling.previousSibling;
        if (cont.classList.contains('cmp-ellipsis-3')) {
            cont.classList.remove('cmp-ellipsis-3');
            this.classList.remove('see-icon-v5-common-arrow-bottom-fill');
            this.classList.add('see-icon-v5-common-arrow-top-fill');
        } else {
            cont.classList.add('cmp-ellipsis-3');
            this.classList.remove('see-icon-v5-common-arrow-top-fill');
            this.classList.add('see-icon-v5-common-arrow-bottom-fill');
        }
    });
}

//调查审核
function auditInquiry(){
	var auditInput = "";
    _$("#auditInput").addEventListener("input",function () {
        auditInput = this.innerText;
        if(auditInput && auditInput.length > 150){
            this.innerText = this.innerText.slice(0,150);
            this.blur();
            this.setAttribute("contenteditable",false);
            cmp.notification.toast(cmp.i18n("inquiry.h5.audit.dealNumMost"),"bottom",3000);
            setTimeout(function () {
                _$("#auditInput").setAttribute("contenteditable",true);
            },3000);
        }
    });

    cmp("#approval .app-btns").on('tap', ".auditTap", function(e) {
        cmp.dialog.loading();
        document.getElementById("auditInput").blur();
        var auditParam = {
            "inquiryId" : urlParam['inquiryId'],
            "type" : e.target.getAttribute("value"),
            "audit_msg" : auditInput
        };
        $s.Inquiry.inqAudit({}, auditParam, {
            repeat:false,   //当网络掉线时是否自动重新连接
            success: function(result) {
                cmp.dialog.loading(false);
                //触发刷新壳数据
                cmp.webViewListener.fire({
                	type: 'com.seeyon.m3.ListRefresh',
                    data: {type: 'update'}
                });
                if (result.state == "error") {
                    cmp.notification.alert(cmp.i18n("inquiry.h5.stateError"), function () {
                        backFrom();
                    }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                } else if (result.state == "auditAgain") {
                    cmp.notification.alert(cmp.i18n("inquiry.h5.audit.alreadyDeal"), function() {
                        backFrom();
                    }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                } else if (result.state == "outOfDate"){
                    cmp.notification.alert(cmp.i18n("inquiry.h5.audit.outOfDate"), function() {
                        backFrom();
                    }, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                } else {
                    backFrom();
                }
            },
            error:function(error){
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                  //cmp处理了这个错误
                }else {
                  //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
        //document.getElementById("approval").removeAttribute("disabled");
    });
}

function footFunctions(isOnlyDel){
    var delBtn = document.getElementById("delBtn");
    var publishBtn = document.getElementById("publishBtn");
    if(isOnlyDel){
        delBtn.style.width = "9.5rem";
        delBtn.style.display = "block";
    }else{
        delBtn.style.width = "4.5rem";
        publishBtn.style.width = "4.5rem";
        delBtn.style.display = "block";
        publishBtn.style.display = "block";
    }
    cmp("#inquiryFoot .app-btns").on('tap', ".app-del", function(e) {
        cmp.notification.confirm(cmp.i18n("inquiry.h5.confirmdelete"),
            function (index) {
                if (index == 1) {
                    $s.Inquiry.delInquiry(urlParam['inquiryId'], "" , {
                        repeat:false,   //当网络掉线时是否自动重新连接
                        success: function(result) {
                            //触发刷新壳数据
                            cmp.webViewListener.fire({
                                type: 'com.seeyon.m3.ListRefresh',
                                data: {type: 'update'}
                            });
                            if (result) {
                                cmp.notification.alert(cmp.i18n("inquiry.h5.delete.success"), function () {backFrom();}, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
                            } else {
                                backFrom();
                            }
                        },
                        error:function(error){
                            var cmpHandled = cmp.errorHandler(error);
                            if(cmpHandled){
                                //cmp处理了这个错误
                            }else {
                                //customHandle(error) ;//走自己的处理错误的逻辑
                            }
                        }
                    });
                }
            },
            cmp.i18n("inquiry.h5.alert"), [cmp.i18n("inquiry.h5.no"), cmp.i18n("inquiry.h5.yes")]
        );
    });
    cmp("#inquiryFoot .app-btns").on('tap', ".app-publish", function(e) {
        $s.Inquiry.publishInquiry(urlParam['inquiryId'], "" , {
            repeat:false,   //当网络掉线时是否自动重新连接
            success: function(result) {
                //触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    data: {type: 'update'}
                });
                var msg = "";
                if(result=="100"){
                    msg = cmp.i18n("inquiry.h5.publishsuccess");
                }else if(result=="8"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish1");
                }else if(result=="1"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish2");
                }else if(result=="4"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish3");
                }else if(result=="5"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish4");
                }else if(result=="-1"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish5");
                }else if(result=="3"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish6");
                }else if(result=="noRoot"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish7");
                }else if(result=="noAuth"){
                    msg = cmp.i18n("inquiry.h5.cannotpublish8");
                    $.alert($.i18n("inquiry.manage.cannotpublish8"));
                }else{
                    msg = result;
                }
                cmp.notification.alert(msg, function () {backFrom();}, cmp.i18n("inquiry.h5.alert"), cmp.i18n("inquiry.h5.OK"));
            },
            error:function(error){
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    });
}
function prevPage() {
    
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backClick);
}

function backClick(){
    if (urlParam.comeFrom=='4' || !inq_data || inq_data.package.myState == 'true' || inq_data.metaData.inquiryState =="10" || inq_data.metaData.inquiryState =="5"
        || inq_data.metaData.inquiryState =="4") {
        backFrom();
    } else {
        cmp.notification.confirm(cmp.i18n("inquiry.h5.sureBack"),
            function (index) {
                if (index == 1) {
                	backFrom();
                }
            },
            cmp.i18n("inquiry.h5.alert"), [cmp.i18n("inquiry.h5.no"), cmp.i18n("inquiry.h5.yes")]
        );
    }
}

function backFrom() {
    if(lockInquiry){
        $s.Inquiry.unlockInquiry(urlParam['inquiryId'], "", {
            repeat:false,   //当网络掉线时是否自动重新连接
            success: function(result) {},
            error:function(error){
            var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                  //cmp处理了这个错误
                }else {
                  //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    }
    //传递from
    cmp.storage.save("listType", urlParam.comeFrom,true);
	if (!urlParam) {
		cmp.href.back();
		return;
	}
    if (urlParam["isNav"] === true) {
        cmp.href.back();
        return;
    }
    if(urlParam["weixinMessage"] || urlParam["fromXz"]){
    	cmp.href.closePage();
    	return;
    }
	cmp.href.back();
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

//简化选择器
function _$(selector) {
    return document.querySelector(selector);
}
//删除左右两端的空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 取字符串实际长度
 * @param str
 * @returns {number}
 */
function getReallength(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function formatInqTime(_beginTime, _closeTime){
    var finalTime = "";
    if(_beginTime){
        _beginTime = _beginTime.substring(10,0);
        finalTime = _beginTime;
    }
    if(_closeTime){
        _closeTime = _closeTime.substring(10,0);
        finalTime = _beginTime + "——" +_closeTime;
    }else{
        finalTime = finalTime + "——" + cmp.i18n("inquiry.h5.null");
    }
    return finalTime;
}

function headerShow() {
	var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { //是微信浏览器
        cmp.headerHide();
    } else { //不是微信浏览器

    }
}

//初始化附件
function initFile(selector, fileList) {
    var loadParam = {
        selector: selector,
        atts: fileList,
        pageInfo: {
            url: _inquiryPath + "/html/inquiryView.html"+"?r="+Math.random(),
            inquiryId: urlParam['inquiryId'],
            comeFrom: 1,
            data: urlParam
        }
    };
    var a = new SeeyonAttachment({
        loadParam: loadParam
    });
    return a;
}

function addAttchmentFileClick() {
    if (document.getElementById("att_list") != null) {
        document.getElementById("att_list").addEventListener("tap", function() {
            if (_$("#attchemntFileList").clientHeight > 50) {
                document.getElementById("attchemntFileList").style.display = "none";
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-down");
            } else {
                document.getElementById("attchemntFileList").style.display = "";
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-down");
            }
        });
    }
}

function auditInput_focus() {
    footerAuto("", "approval");
}

function auditInput_blur() {
    footerAuto("","approval");
}

function footerAuto(_headerId,_footerId) {
    if(cmp.os.ios){
        setTimeout(function(){   //键盘被弹起
            var ThisHeight=window.innerHeight;
            var position;
            if(ThisHeight < CMPFULLSREENHEIGHT){
                var scrollTop=document.querySelector('body').scrollTop;
                position=CMPFULLSREENHEIGHT - ThisHeight  - scrollTop ;
                if(position < 0){
                    if(_footerId){
                        _$("#" + _footerId).style.bottom=  "0px";
                    }
                    if(_headerId){
                        _$("#" + _headerId).style.top= CMPFULLSREENHEIGHT - ThisHeight + "px";
                    }
                }else{
                    if(_footerId){
                        _$("#" + _footerId).style.bottom= position + "px";
                    }
                    if(_headerId){
                        _$("#" + _headerId).style.top= scrollTop + "px";
                    }
                }
            }
            else{
                if(_footerId){
                    _$("#" + _footerId).style.bottom = 0;
                }
                if(_headerId){
                    _$("#" + _headerId).style.top= 0;
                }
            }
        },550);
    }
}

//输入框中过滤输入法自带表情
function filteremoji(content){
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    emojireg = content .replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}
//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
