var bulIssue = {};
(function(_){
    cmp.i18n.load(_bulletinPath + "/i18n/", "Bulletin",function(){
        _.issue = {};
        _.issue.init = function (selector, params, callBack) {
            return new Issue(selector, params, callBack);
        };
        function Issue(selector, params, callBack) {
            _.self=this;
            _.self.summaryId = params.summaryId;
            _.self.affairId = params.affairId;
            _.self.bodyType = params.bodyType;
            _.self.rightId = params.rightId;
            _.self.bodyType = "content";
            _.self.issueScopeMemberIds = "";
            _.self.allowPrint = "0";
            _.self.noteCallInfo = "0";
            _.self.typeId = "";
            _.self.spacetype = "";
            _.self.showPub = "0";
            _.self.selector = selector;
            _.self.callBack = callBack;
            _.self.wrapper = document.getElementById(selector);
            _.self.wrapper.innerHTML = cmp.tpl(issueUI,{});
            _.self.choosePubScope_fillBackData=[];
    
            document.getElementById(selector).style.zIndex = "80";
            _.self.typeListData= _.self._getTypeListData(params);
        }
        Issue.prototype._getTypeListData = function (params) {
            $s.CmpBulletin.preIssueBulletin(params.bodyType,"", {
                repeat:true,   //当网络掉线时是否自动重新连接
                success: function(result) {
                    cmp.dialog.loading(false);
                    if(!result.issueFlag || result.typeList.length == 0){
                        cmp.notification.alert(cmp.i18n("bulletin.h5.audit.publish.noPublish"), function() {
                            var callbackFun = _.self.callBack;
                            if(callbackFun && typeof callbackFun == "function"){
                               callbackFun(false);
                            }
                        }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
                    } else {
                        document.getElementById(_.self.selector).classList.add('cmp-active');
                        _.self.TypeListData = result;
                        _.self._initDom(result);
                        if(result.typeList[0].spaceType == 1 || result.typeList[0].spaceType == 2){
                        	_.self.seeExtAccount = false;
                        } else {
                        	_.self.seeExtAccount = true;
                        }
                        _.self.cancelObject(_.self.selector);
                        _.self.sureObject();
                    }
    
                },
                error:function(error){
                    var cmpHandled = cmp.errorHandler(error);
                    if(cmpHandled){
                        //cmp处理了这个错误
                    }else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                        cmp.notification.toast(cmp.i18n("bulletin.h5.typeListError"));
                    }
                }
            });
        }
        Issue.prototype._initDom = function (data) {
            document.getElementById("bul-type").innerHTML=cmp.tpl(issueLi, data.typeList);
            _.self._bindEvent(data.typeList.length);
            if(data.typeList.length > 0){
                var farDom = document.getElementById("bul-type");
                farDom.firstElementChild.firstElementChild.classList.remove("see-icon-radio-unchecked");
                farDom.firstElementChild.firstElementChild.classList.add("see-icon-success-circle-fill");
                farDom.firstElementChild.firstElementChild.style.color = "#3aadfb";
                farDom.children[1].style.display = "block";
                _.self.typeId = farDom.firstElementChild.getAttribute("typeId");
                _.self.spacetype = farDom.firstElementChild.getAttribute("spacetype");
                if(farDom.firstElementChild.getAttribute("spacetype") == 1){
                    document.getElementById("bul-choose-name").innerHTML =cmp.i18n("bulletin.h5.audit.publish");
                }
            }
            cmp.i18n.detect();
        }
        /**
         * 绑定事件
         * @private
         */
        Issue.prototype._bindEvent = function (length) {
            for(var i= 0;i<length;i++){
                //版块绑定事件
                cmp("#bul-type").on('tap', ".bul-exe-" + i, function(e) {
                    var listI = this.getAttribute("list");
                    var thisExe = _$(".bul-exe-" + listI,true)[0];
                    var thisExeDetail = document.getElementsByClassName("bul-exe-detail-" + listI)[0];
                    for(var j= 0;j<length;j++){
                        _$(".bul-exe-detail-" + j,true)[0].style.display = "none";
                        _$(".bul-exe-" + j,true)[0].firstElementChild.classList.add("see-icon-radio-unchecked");
                        _$(".bul-exe-" + j,true)[0].firstElementChild.classList.remove("see-icon-success-circle-fill");
                        _$(".bul-exe-" + j,true)[0].firstElementChild.style.color = "";
                        for(var z = 0;z < _$(".bul-exe-detail-" + j,true)[0].firstElementChild.children.length;z++){
                            var tempNode = document.getElementsByClassName("bul-exe-detail-"+ j)[0];
                            tempNode.firstElementChild.children[z].lastElementChild.classList.add("see-icon-checked");
                            tempNode.firstElementChild.children[z].lastElementChild.classList.remove("see-icon-checked-fill");
                            tempNode.firstElementChild.children[z].lastElementChild.style.color = "";
                        }
                    }
                    thisExeDetail.style.display = "block";
                    thisExe.firstElementChild.classList.remove("see-icon-radio-unchecked");
                    thisExe.firstElementChild.classList.add("see-icon-success-circle-fill");
                    thisExe.firstElementChild.style.color = "#3aadfb";
                    _.self.typeId = this.getAttribute("typeId");
                    _.self.spacetype = this.getAttribute("spacetype");
                    _.self.showPub = "0";
                    _.self.noteCallInfo = "0";
                    _.self.allowPrint = "0";
                    if(this.getAttribute("spaceType") == 2){
                    	_.self.seeExtAccount = false;
                        document.getElementById("bul-choose-name").innerHTML =bulIssueI18N[bulIssueI18N.lang].choosePubScope;
                    } else if (this.getAttribute("spaceType") == 1){
                        document.getElementById("bul-choose-name").innerHTML =cmp.i18n("bulletin.h5.audit.publish");
                    } else {
                        _.self.seeExtAccount = true;
                        document.getElementById("bul-choose-name").innerHTML =cmp.i18n("bulletin.h5.choosePubScope");
                    }
    
                });
                //显示发布人绑定事件
                cmp(".bul-exe-detail").on('tap', ".bul-exe-detail-person-" + i, function(e) {
                    var personI = this.getAttribute("personI");
                    var thisPerson = _$(".bul-exe-detail-person-" + personI,true)[0];
                    if(thisPerson.lastElementChild.classList.contains("see-icon-checked")){
                        thisPerson.lastElementChild.classList.remove("see-icon-checked");
                        thisPerson.lastElementChild.classList.add("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "#3aadfb";
                        _.self.showPub = "1";
                    }else{
                        thisPerson.lastElementChild.classList.add("see-icon-checked");
                        thisPerson.lastElementChild.classList.remove("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "";
                        _.self.showPub = "0";
                    }
                });
                //记录阅读信息绑定事件
                cmp(".bul-exe-detail").on('tap', ".bul-exe-detail-record-" + i, function(e) {
                    var personI = this.getAttribute("recordI");
                    var thisPerson = _$(".bul-exe-detail-record-" + personI,true)[0];
                    if(thisPerson.lastElementChild.classList.contains("see-icon-checked")){
                        thisPerson.lastElementChild.classList.remove("see-icon-checked");
                        thisPerson.lastElementChild.classList.add("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "#3aadfb";
                        _.self.noteCallInfo = "1";
                    }else{
                        thisPerson.lastElementChild.classList.add("see-icon-checked");
                        thisPerson.lastElementChild.classList.remove("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "";
                        _.self.noteCallInfo = "0";
                    }
                });
                //允许打印绑定事件
                cmp(".bul-exe-detail").on('tap', ".bul-exe-detail-print-" + i, function(e) {
                    var personI = this.getAttribute("printI");
                    var thisPerson = _$(".bul-exe-detail-print-" + personI,true)[0];
                    if(thisPerson.lastElementChild.classList.contains("see-icon-checked")){
                        thisPerson.lastElementChild.classList.remove("see-icon-checked");
                        thisPerson.lastElementChild.classList.add("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "#3aadfb";
                        _.self.allowPrint = "1";
                    }else{
                        thisPerson.lastElementChild.classList.add("see-icon-checked");
                        thisPerson.lastElementChild.classList.remove("see-icon-checked-fill");
                        thisPerson.lastElementChild.style.color = "";
                        _.self.allowPrint = "0";
                    }
                });
            }
    
            function _$(selector, queryAll, pEl) {
                var p = pEl ? pEl : document;
                if (queryAll) {
                    return p.querySelectorAll(selector);
                } else {
                    return p.querySelector(selector);
                }
            }
    
        }
    
        Issue.prototype.cancelObject=function(selector){
            var callbackFun = _.self.callBack;
            /*cmp("#bul_header").on('tap', "#prev", function(e) {
                cmp.selectOrgDestory("bul-choose-btn");
                if(callbackFun && typeof callbackFun == "function"){
                   callbackFun(false);
                }
                document.getElementById(selector).classList.remove('cmp-active');
            });*/
            cmp.backbutton();
            cmp.backbutton.push(function(){
            	  cmp.backbutton.pop();
                document.getElementById(selector).classList.remove('cmp-active');
                cmp.selectOrgDestory("bul-choose-btn");
                if(callbackFun && typeof callbackFun == "function"){
                   callbackFun(false);
                }
            });
        }
        Issue.prototype.sureObject=function(){
            var clickFlag = false;
            cmp("#bul-choose").on('tap', "#bul-choose-btn", function(e) {
                if (clickFlag) {
                    return;
                }
                clickFlag = true;
                if(_.self.spacetype == 1){
                    _.self.publishBul();
                } else {
                    var selectOrgObj = cmp.selectOrg("#bul-choose-btn", {
                        type:1,
                        flowType:2,
                        permission : false, //OA-102650
                        fillBackData: _.self.choosePubScope_fillBackData,
                        jump:false,
                        maxSize:-1,
                        minSize:1,
                        multitype:true,
                        seeExtAccount:_.self.seeExtAccount,//是否能查看外单位，即是否能进行外单位切换
                        closeCallback:cmp.selectOrgDestory("#bul-choose-btn"),
                        callback:function(result){
                            var orgResult = cmp.parseJSON(result).orgResult;
                            _.self.choosePubScope_fillBackData = orgResult;
                            var issueScopeMemberIds = "";
                            for(var i = 0;i < orgResult.length;i++){
                                issueScopeMemberIds =issueScopeMemberIds + orgResult[i].type + "|" + orgResult[i].id +",";
                            }
                            _.self.issueScopeMemberIds = issueScopeMemberIds.substring(0,issueScopeMemberIds.lastIndexOf(','));
                            _.self.publishBul();
                        }
                    });
                    cmp.dialog.loading(false);
                }
            });
    
        }
        Issue.prototype.publishBul=function(){
            cmp.dialog.loading();
            var callbackFun = _.self.callBack;
            var issueParam = {
                "summaryId": _.self.summaryId,
                "affairId": _.self.affairId,
                "bodyType": _.self.bodyType,
                "publishContent": _.self.publishContent,
                "typeId": _.self.typeId,
                "issueScopeMemberIds": _.self.issueScopeMemberIds,
                "allowPrint": _.self.allowPrint,
                "toPDF": "",
                "noteCallInfo": _.self.noteCallInfo,
                "showPub": _.self.showPub,
                "rightId": _.self.rightId ? _.self.rightId : "",
                "showPublishUserFlag":_.self.showPub
            }
            $s.CmpBulletin.issueBulletin("", issueParam,{
                repeat:false,   //当网络掉线时是否自动重新连接
                success: function(result) {
                    document.getElementById(_.self.selector).classList.remove('cmp-active');
                    if(callbackFun && typeof callbackFun == "function"){
                       callbackFun(true);
                    }
                },
                error:function(error){
                    var cmpHandled = cmp.errorHandler(error);
                    if(cmpHandled){
                        //cmp处理了这个错误
                    }else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                        document.getElementById(_.self.selector).classList.remove('cmp-active');
                        if(callbackFun && typeof callbackFun == "function"){
                            callbackFun(true);
                        }
                    }
                }
            });
        }
        var issueUI =
                /*'<header id="bul_header" class="cmp-bar cmp-bar-nav head-style">'+
                '    <a class="cmp-action-back cmp-icon see-icon-v5-common-arrow-back cmp-pull-left cmpCommonPageBackBtn" id="prev" style="padding-top: 0;padding-bottom: 0"><i18n key="bulletin.h5.back"></i18n></a>'+
                '    <h1 class="cmp-title"><span><i18n key="bulletin.h5.chooseType"></i18n></span></h1>'+
                '</header>'+*/
                '<div id="bul-type" class="cmp-content cmp-content-none position_relative"></div>'+
    
                '<footer id="bul-choose">'+
                '<div class="footer_block"></div>'+
                '    <div style="width: 100%;margin-top: 10px;">'+
                '        <div class="bul-choose-btn" id="bul-choose-btn">'+
                '            <span id="bul-choose-name"><i18n key="bulletin.h5.choosePubScope"></i18n></span>'+
                '        </div>'+
                '    </div>'+
                '</footer>';
        var issueLi =
                '<% for(var i = 0,len = this.length;i < len; i++){ %>'+
                '<% var obj = this[i]; %>'+
                '<div class="cmp-ellipsis bul-exe bul-exe-<%=i%>" list="<%=i%>" typeId ="<%=obj.id%>" spaceType="<%=obj.spaceType%>">'+
                '    <span class="bul-radio see-icon-radio-unchecked"></span>'+
                '    <span class="bul-exe-name"><%=escapeStringToHTML(obj.typeName) %></span>'+
                '</div>'+
                '<div class="bul-exe-detail bul-exe-detail-<%=i%>"">'+
                '<div class="bul-exe-detail-block">'+
                '    <div class="bul-exe-detail-person-<%=i%>" personI="<%=i%>" style="display: inline-block;padding-left:8%;">'+
                '        <span class="bul-name"><i18n key="bulletin.h5.showPublishUser"></i18n></span>'+
                '        <span class="bul-icon see-icon-checked"></span>'+
                '    </div>'+
                '    <div class="bul-exe-detail-record-<%=i%>" recordI="<%=i%>" style="display: inline-block;margin-left:3%;">'+
                '        <span class="bul-name"><i18n key="bulletin.h5.recordRead"></i18n></span>'+
                '        <span class="bul-icon see-icon-checked"></span>'+
                '    </div>'+
                '    <div class="bul-exe-detail-print-<%=i%>" printI="<%=i%>" style="display: inline-block;margin-left:3%">'+
                '       <span class="bul-name"><i18n key="bulletin.h5.allowPrint"></i18n></span>'+
                '       <span class="bul-icon see-icon-checked"></span>'+
                '    </div>'+
                '</div>'+
                '</div>'+
                '<% } %>';
    });
})(bulIssue);