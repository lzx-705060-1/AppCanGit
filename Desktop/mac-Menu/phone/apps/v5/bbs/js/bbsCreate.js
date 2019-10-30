var typeChoosePage = false;
var chooseTypeId = "";
var anonymousPublish = false;
var anonymousReply = false;
var publishScopeIds = "";
var publishScopeName = "";
var bbsParam = {};
var arr = [];
var pageS={};
var _spacetype = false;//false单位true集团
//适配切换输入法弹出框的问题
var input_position_interval;
var And_win_innerHeight;
cmp.ready(function() {
  cmp.backbutton();
    // <title>显示
    document.getElementById("title").innerHTML = cmp.i18n("bbs.h5.create.title");

    if (document.getElementById("shadow")) {
        document.body.removeChild(document.getElementById("shadow"));
    }
    init();
    getContentImg();
    loadbbsTypes();
    attUploadInit();
    //页面跳转缓存监听
    document.addEventListener('beforepageredirect', function(e){
        _storePageObj();
    });
    /*if(cmp.os.android){
        var windowInnerHeight = window.innerHeight;
        setInterval(function () {
            if(parseInt(window.innerHeight) > parseInt(And_win_innerHeight)){
                _$("#bbsNew-footer").style.display = "block";
                _$("#bodyDiv").style.bottom = "90px";
                if(_$("#bbsNew-footer-img").clientHeight != 0){
                    _$("#bbsNew-footer-img").style.display = "none";
                }
            }else{
                if(And_win_innerHeight){
                    _$("#bbsNew-footer").style.display = "none";
                    _$("#bodyDiv").style.bottom = "0";
                    // if(_$("#bodyDiv").scrollTop != 0){
                    //     _$("#bbsNew-footer-img").style.display = "block";
                    // }else{
                    //     _$("#bbsNew-footer").style.display = "block";
                    // }
                }
            }
        },1000);
    }*/
    document.getElementById("contentDiv").setAttribute("placeholder",cmp.i18n("bbs.h5.create.writeContent"));
    cmp.footerAuto('#bbsNew-footer-img');
});

function init() {
  cmp.backbutton.push(function(){
        backFrom(true);
    });
    document.addEventListener("tap",function (e) {
        if(e.target.id != "bbsTitle"){
            document.getElementById("bbsTitle").blur();
        }else{
            document.getElementById("bbsTitle").focus();
        }
    });

    // _$(".bbsNew-content").firstElementChild.style.minHeight = _$("#bodyDiv").clientHeight - _$(".bbsNew-choose").clientHeight - 110 - 34 + "px";
    _$("#contentDiv").style.minHeight = window.innerHeight - _$(".bbsNew-choose").clientHeight - 10 + "px";
    // _$("#bodyDiv").style.bottom = 90 + "px";
    _$("#bodyDiv").style.overflowY = "auto";
    _$("#bodyDiv").style.height = "100%";
    var $contentOldHeight = _$("#contentDiv").clientHeight;
    cmp(".bbsNew-content-detail").on('input', "#contentDiv", function(e) {
        _$(".bbsNew-content").firstElementChild.style.height = this.clientHeight + "px";
        if($contentOldHeight < this.clientHeight){
            setTimeout(function () {
                $contentOldHeight = _$("#contentDiv").clientHeight;
                document.body.scrollTop = document.body.scrollTop + 21;
            },10);
        }
    });
    // cmp(".bbsNew-title").on('input', ".bbsNew-title-content div", function(e) {
    //     if (this.innerText.length > 85) {
    //
    //     } else {
    //         _$(".bbsNew-content").firstElementChild.style.height = _$("#bodyDiv").clientHeight - _$(".bbsNew-choose").clientHeight - 110 - 34 + "px";
    //     }
    // });
    //选择版块点击事件
    cmp(".bbsNew-block").on('tap', "#choosePubTypes", function(e) {
        typeChoosePage = true;
        _$("#show-block").classList.add('cmp-active');
        _$("#boardSelectDiv").style.height = window.innerHeight + 'px';
        _$("#contentDiv").blur();
        _$("#bbsTitle").blur();
    });
    //选择版块页面返回发布页面点击事件
    /*cmp("#show-block").on('tap', "#typeChooseBack", function(e) {
        backFrom();
    });*/
    cmp(".bbsNew-setting-detail").on('tap', ".bbsNew-setting-detail-placard", function(e) {
        _$("#contentDiv").blur();
        _$("#bbsTitle").blur();
        if (this.firstElementChild.firstElementChild.classList.contains("see-icon-checked-fill")) {
            this.firstElementChild.firstElementChild.classList.remove("see-icon-checked-fill");
            this.firstElementChild.firstElementChild.classList.add("see-icon-checked");
            this.firstElementChild.firstElementChild.style.color = "#c9c9c9";
            anonymousPublish = false;
        } else {
            this.firstElementChild.firstElementChild.classList.add("see-icon-checked-fill");
            this.firstElementChild.firstElementChild.classList.remove("see-icon-checked");
            this.firstElementChild.firstElementChild.style.color = "#3aadfb";
            anonymousPublish = true;
        }
    });
    cmp(".bbsNew-setting-detail").on('tap', ".bbsNew-setting-detail-reply", function(e) {
        if (this.firstElementChild.firstElementChild.classList.contains("see-icon-checked-fill")) {
            this.firstElementChild.firstElementChild.classList.remove("see-icon-checked-fill");
            this.firstElementChild.firstElementChild.classList.add("see-icon-checked");
            this.firstElementChild.firstElementChild.style.color = "#c9c9c9";
            anonymousReply = false;
        } else {
            this.firstElementChild.firstElementChild.classList.add("see-icon-checked-fill");
            this.firstElementChild.firstElementChild.classList.remove("see-icon-checked");
            this.firstElementChild.firstElementChild.style.color = "#3aadfb";
            anonymousReply = true;
        }
    });
    cmp(".bbsNew-area").on('tap', "#choosePubScope", function(e) {
        _$("#contentDiv").blur();
        _$("#bbsTitle").blur();
    });

    cmp(".bbs-block").on('tap', ".bbs-block-detail", function(e) {
        if (this.children[1].firstElementChild.classList.contains("see-icon-v5-common-arrow-down")) {
            this.children[1].firstElementChild.classList.remove("see-icon-v5-common-arrow-down");
            this.children[1].firstElementChild.classList.add("see-icon-v5-common-arrow-top");
            this.parentNode.nextElementSibling.style.display = "none";
            this.parentNode.parentNode.classList.add("line-bottom");
        } else {
            this.children[1].firstElementChild.classList.add("see-icon-v5-common-arrow-down");
            this.children[1].firstElementChild.classList.remove("see-icon-v5-common-arrow-top");
            this.parentNode.nextElementSibling.style.display = "block";
            this.parentNode.parentNode.classList.remove("line-bottom");
        }
    });
    cmp(".bbsNew-content").on('tap', ".bbsNew-content-detail", function(e) {
        this.firstElementChild.focus();
        content_div_focus();
    });
    //发送点击事件
    cmp("#bbsNew-footer").on('tap', ".bbsNew-footer-send-btn", function(e) {
        saveBbs(false);
    });
    //返回点击事件
    cmp("#bodyDiv").on('input', "#bbsTitle", function(e) {
        var auditInput = this.innerText;
        if(getReallength(auditInput) > 170){
            this.innerText = this.innerText.slice(0,85);
            this.blur();
            cmp.notification.toastExtend(cmp.i18n("bbs.h5.create.titleMostNum"),"center",2000);
        }
    });
    /*cmp("#bbs_header").on('tap', "#goAheadBtn", function(e) {
        backFrom(true);
    });*/
    document.getElementById("bbsTitle").setAttribute("placeholder",cmp.i18n("bbs.h5.create.titleMost"));
    document.getElementById("contentDiv").setAttribute("placeholder",cmp.i18n("bbs.h5.create.writeContent"));
    document.getElementById("groupTypes").setAttribute("spaceType",cmp.i18n("bbs.h5.create.group"));
    document.getElementById("accountTypes").setAttribute("spaceType",cmp.i18n("bbs.h5.create.account"));
}

function loadbbsTypes(){
    $s.Bbs.bbsNewCreate({},{
        repeat:true,   //当网络掉线时是否自动重新连接
        success:function(result){
            if(result.success){
                var accountTypes = result.data.account;
                var groupTypes = result.data.group;
                if(accountTypes.length + groupTypes.length == 0){
                    cmp.notification.alert(cmp.i18n("bbs.h5.create.noRightToCreate"), function() {
                        backFrom();
                    }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                } else {
                    if(accountTypes.length > 0){
                        _$("#accountBBS").style.display = "block";
                        var pendingTPL = document.getElementById("type_tpl").innerHTML;
                        var html = cmp.tpl(pendingTPL, accountTypes);
                        var parent = _$("#accountTypes");
                        cmp.append(parent,html);
                        chooseTypeId = accountTypes[0].id;
                        _spacetype = false;
                        _$("#typeChoosePlease").innerText =cmp.i18n("bbs.h5.create.account") + "-" + accountTypes[0].name;
                        _$("#anonymousPublish").setAttribute("disabled","true");
                        if(accountTypes[0].anonymousFlag == "1"){
                            _$("#anonymousPublish").style.display = "none";
                            _$("#anonymousPublishCopy").style.display = "inline-block";
                        }
                        if(accountTypes[0].anonymousReplyFlag == "1"){
                            _$("#anonymousReply").style.display = "none";
                            _$("#anonymousReplyCopy").style.display = "inline-block";
                        }
                        parent.firstElementChild.firstElementChild.firstElementChild
                            .classList.remove("see-icon-radio-unchecked");
                        parent.firstElementChild.firstElementChild.firstElementChild
                            .classList.add("see-icon-ok-circle-fill");
                    }
                    if(groupTypes.length > 0){
                        _$("#groupBBS").style.display = "block";
                        var pendingTPL = document.getElementById("type_tpl").innerHTML;
                        var html = cmp.tpl(pendingTPL, groupTypes);
                        var parent = _$("#groupTypes");
                        cmp.append(parent,html);
                        if(chooseTypeId == ""){
                            _$("#groupTypes").style.display = "block";
                            _$("#groupBBS").children[1].children[1].firstElementChild.classList.remove("see-icon-v5-common-arrow-top");
                            _$("#groupBBS").children[1].children[1].firstElementChild.classList.add("see-icon-v5-common-arrow-down");
                            chooseTypeId = groupTypes[0].id;
                            if(groupTypes[0].anonymousFlag == "1"){
                                _$("#anonymousPublish").style.display = "none";
                                _$("#anonymousPublishCopy").style.display = "inline-block";
                            }
                            if(groupTypes[0].anonymousReplyFlag == "1"){
                                _$("#anonymousReply").style.display = "none";
                                _$("#anonymousReplyCopy").style.display = "inline-block";
                            }
                            _spacetype = true;
                            _$("#typeChoosePlease").innerText =cmp.i18n("bbs.h5.create.group") + "-" + groupTypes[0].name;
                            parent.firstElementChild.firstElementChild.firstElementChild
                                .classList.remove("see-icon-radio-unchecked");
                            parent.firstElementChild.firstElementChild.firstElementChild
                                .classList.add("see-icon-ok-circle-fill");
                        }
                    }
                }
                typeChoose();
                storageInit();
                choosePublishScope();
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
/**
 * 选择要发布的版块
 */
function typeChoose(){
    cmp(".bbs-block-content").on("tap", ".bbs-block-content-detail", function(e) {
        var checkBack = _$(".see-icon-ok-circle-fill");
        checkBack.classList.remove("see-icon-ok-circle-fill");
        checkBack.classList.add("see-icon-radio-unchecked");
        this.firstElementChild.firstElementChild.classList.remove("see-icon-radio-unchecked");
        this.firstElementChild.firstElementChild.classList.add("see-icon-ok-circle-fill");
        chooseTypeId = this.getAttribute("typeid");
        _spacetype = this.parentNode.getAttribute("spaceId") == "0";
        _$("#typeChoosePlease").innerText =this.parentNode.getAttribute("spacetype") +"-"+ this.getAttribute("typeName");
        var _anonymousflag = this.getAttribute("anonymousflag");
        if(_anonymousflag == "0"){
            _$("#anonymousPublish").style.display = "inline-block";
            _$("#anonymousPublishCopy").style.display = "none";
        }else{
            _$("#anonymousPublish").style.display = "none";
            _$("#anonymousPublishCopy").style.display = "inline-block";
        }
        var _anonymousreplyflag = this.getAttribute("anonymousreplyflag");
        if(_anonymousreplyflag == "0"){
            _$("#anonymousReply").style.display = "inline-block";
            _$("#anonymousReplyCopy").style.display = "none";
        }else{
            _$("#anonymousReply").style.display = "none";
            _$("#anonymousReplyCopy").style.display = "inline-block";
        }
        //切范围后清空选人
        publishScopeName = "";
        publishScopeIds = "";
        _$("#publishScopeName").innerText = cmp.i18n("bbs.h5.create.publishScopeChoose");
        choosePubScope_fillBackData = [];
        backFrom();
    });
}
var choosePubScope_fillBackData=[];
/**
 * 加载选人组件，选择发布范围
 */
function choosePublishScope(){
    cmp("#bodyDiv").on("tap", "#choosePubScope", function(e) {
        cmp.dialog.loading();
        $s.Bbs.vjoinAccess(chooseTypeId,{},null,{
            repeat:false,   //当网络掉线时是否自动重新连接
            success:function(result){
                var label = ["dept","org","post","team","extP"];
                if(result === true){
                    label = ["dept","org","post","team","extP","vjOrg"];
                }
                var csses = [_cmpPath + "/css/cmp-selectOrg.css" + $verstion];
                cmp.asyncLoad.css(csses);
                var jses = [_cmpPath + "/js/cmp-selectOrg.js"+ $verstion];
                cmp.asyncLoad.js(jses,function(){
                    cmp.dialog.loading(false);
                    var selectOrgObj = cmp.selectOrg("#publishScopeName", {
                        type:1,
                        flowType:2,
                        permission : true, //OA-102650 -> OA-151038
                        fillBackData:choosePubScope_fillBackData,
                        jump:false,
                        maxSize:-1,
                        minSize:1,
                        multitype:true,
                        label:label,
                        seeExtAccount:_spacetype,//是否能查看外单位，即是否能进行外单位切换
                        closeCallback:cmp.selectOrgDestory("#publishScopeName"),
                        callback:function(result){
                            var orgResult = cmp.parseJSON(result).orgResult;
                            choosePubScope_fillBackData =orgResult;
                            publishScopeIds="";
                            publishScopeName="";
                            for(var i = 0;i < orgResult.length;i++){
                                publishScopeIds =publishScopeIds + orgResult[i].type + "|" + orgResult[i].id +",";
                                publishScopeName = publishScopeName + orgResult[i].name + "、";
                            }
                            publishScopeIds = publishScopeIds.substring(0,publishScopeIds.lastIndexOf(','));
                            publishScopeName = publishScopeName.substring(0,publishScopeName.lastIndexOf('、'));
                            _$("#publishScopeName").innerText = publishScopeName;
                        }
                    });
                });
            },
            error:function(error){
                cmp.dialog.loading(false);
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                    cmp.notification.alert(cmp.i18n("bbs.h5.create.sendError"), function() {
                        backFrom();
                    }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                }
            }
        });
    });
    cmp.dialog.loading(false);
}

/**
 * 讨论正文中获取相册或照相机图片对象
 */
function getContentImg(){
    cmp("#bbsNew-footer-img").on("tap", ".footer_upload", function(e) {
//        if(!cmp.platform.CMPShell){
//            cmp.notification.toast(cmp.i18n("bbs.h5.create.weixin.noimgUpload"),"center",2000);
//            return;
//        }
        var openType = 1;
        if(e.target.getAttribute("value") == "openPhotos"){
            openType = 0;
        }
        cmp.camera.getPictures({
            compress:false,  //是否生成缩略图
            sourceType: parseInt(openType),
            destinationType: 1,
            url:cmp.seeyonbasepath + "/rest/attachment?option.n_a_s=1",
            success: contentImgUpload,
            error:function(res){
                //TODO 取消拍照走的error路线，这个后续一定要让他们改
                //if(res){
                //    cmp.notification.alert("error:"+cmp.toJSON(res));
                //}
            }
        });
    });
}

/**
 * 讨论正文图片上传
 */
function contentImgUpload(imgObj){
    cmp.dialog.loading(cmp.i18n("bbs.h5.create.imgUpload"));
    //console.log(imgObj);
    var imgList = [];
    var imgNumber = imgObj.files.length;
    for(var i=0;i<imgNumber;i++){
        var splitFilename = imgObj.files[i].filepath.split("/");
        splitFilename[splitFilename.length-1];
        imgList[i] = {
            filepath : imgObj.files[i].filepath,
            filename : splitFilename[splitFilename.length-1],
            filesize : imgObj.files[i].fileSize,
            fileId : cmp.buildUUID(19,10),
            fileData : imgObj.files[i].fileData
        };
    }
    var urlLast = "/rest/attachment?extensions=jpeg,jpg,png,gif&type=1&applicationCategory=9&maxSize=10240000&firstSave=true&option.n_a_s=1";
    cmp.att.upload({
        url: cmp.seeyonbasepath + urlLast,
        fileList: imgList,
        imgIndex:"sortNum",
        title: "",
        extData: "",
        success: function (result) {
            var atts = JSON.parse(result.response).atts;
            imgNumber -- ;
            contentImgShow(atts,imgNumber);
        },
        progress:function(result){
            //console.log(result.pos);  //0~1的小数，即上传进度的百分比
        },
        error: function (res) {
        }
    });
}

/**
 * 讨论正文图片填充到正文区域
 */
function contentImgShow(imgFile,imgNumber){
    var contentDom = document.getElementById("contentDiv");
    var sb = '<div style=\"width:100%;\">'
        + '   <img alt src=\"' + cmp.origin + '/fileUpload.do?method=showRTE&amp;fileId='+ imgFile[0].fileUrl +'&amp;createDate='+ formatTime(imgFile[0].createdate) +'&amp;type=image\" '
        + '    class=\"uploadImgMark bbsCreateFakeWidth\"  value=\"/seeyon/fileUpload.do?method=showRTE&amp;fileId='+ imgFile[0].fileUrl +'&amp;createDate='+ formatTime(imgFile[0].createdate) +'&amp;type=image\">'
        + '</div>';

    cmp.append(contentDom,sb);
    if(imgNumber==0){
        cmp.append(contentDom,'<br><div style="width:100%;height:21px;"></div>');
        cmp.dialog.loading(false);
        document.getElementById("contentDiv").blur();
        content_div_blur();
    }
}

var initFileArray = [];
function attUploadInit(){
    /*if(!cmp.platform.CMPShell){
        cmp("#bbsNew-footer").on("tap", "#uploadFile", function() {
            cmp.notification.toast(cmp.i18n("bbs.h5.create.weixin.nofileUpload"),"center",2000);
            return;
        });
    }else{*/
        //初始化附件组件
        var initParam = {
            showAuth : 1,
            handler : "#uploadFile",
            uploadId : "uploadFileDiv",
            initAttData : initFileArray,
            needClone : true,
            continueUpload: true,
            selectFunc : function(fileArray){
                initFileArray = fileArray;
                for (var i =0;i<fileArray.length;i++){
                    arr.push(fileArray[i]["attachment_fileUrl"]);
                }
                //展示附件数量
                var tempCount = fileArray.length;
                var tempText = 0;
                if(tempCount > 0){
                    tempText = tempCount;
                }
                document.getElementById("attCount").innerHTML = tempText;
                // //附件图标有附件时显示蓝色
                // var attDom = document.querySelector("#attBtn span");
                // if(tempCount > 0 && attDom && !attDom.classList.contains("cmp-active")){
                //   attDom.classList.add("cmp-active");
                // }
            }
        }
        var seeyonAtt = new SeeyonAttachment({initParam : initParam});
//    }
}

//页面跳转加缓存
function _storePageObj(){
    pageS.bbsTitle = _$("#bbsTitle").innerHTML;
    pageS.chooseTypeId = chooseTypeId;
    pageS.typeChoosePlease = _$("#typeChoosePlease").innerHTML;
    pageS.contentDiv = _$("#contentDiv").innerHTML;
    pageS.choosePubScope_fillBackData = choosePubScope_fillBackData;
    pageS.choosePubScope_text = _$("#choosePubScope").firstElementChild.innerHTML;
    pageS.anonymousPublish = anonymousPublish;
    pageS.anonymousReply = anonymousReply;
    pageS.publishScopeIds= publishScopeIds;
    cmp.storage.save("pageDataSave", JSON.stringify(pageS), true);
    return;
}

//载入缓存数据
function storageInit(){
    var _jsonX = JSON.parse(cmp.storage.get("pageDataSave", true));
    if(_jsonX != null){//赋值缓存对象
        pageS = _jsonX;
        if(pageS.bbsTitle){
            _$("#bbsTitle").innerHTML = pageS.bbsTitle;
        }
        if(pageS.typeChoosePlease && pageS.chooseTypeId != chooseTypeId){
            chooseTypeId = pageS.chooseTypeId;
            _$("#typeChoosePlease").innerHTML = pageS.typeChoosePlease;
            var checkBack = _$(".see-icon-ok-circle-fill");
            checkBack.classList.remove("see-icon-ok-circle-fill");
            checkBack.classList.add("see-icon-radio-unchecked");
            var _chooseTypeDom = document.getElementById(chooseTypeId);
            if(_chooseTypeDom){
                _chooseTypeDom.firstElementChild.firstElementChild.classList.add("see-icon-ok-circle-fill");
                _chooseTypeDom.firstElementChild.firstElementChild.classList.remove("see-icon-radio-unchecked");
                var _anonymousflag = _chooseTypeDom.getAttribute("anonymousflag");
                if(_anonymousflag == "0"){
                    _$("#anonymousPublish").style.display = "inline-block";
                    _$("#anonymousPublishCopy").style.display = "none";
                }else{
                    _$("#anonymousPublish").style.display = "none";
                    _$("#anonymousPublishCopy").style.display = "inline-block";
                }
                var _anonymousreplyflag = _chooseTypeDom.getAttribute("anonymousreplyflag");
                if(_anonymousreplyflag == "0"){
                    _$("#anonymousReply").style.display = "inline-block";
                    _$("#anonymousReplyCopy").style.display = "none";
                }else{
                    _$("#anonymousReply").style.display = "none";
                    _$("#anonymousReplyCopy").style.display = "inline-block";
                }
            }
        }
        if(pageS.anonymousPublish){
            _$("#anonymousPublish").firstElementChild.firstElementChild.classList.add("see-icon-checked-fill");
            _$("#anonymousPublish").firstElementChild.firstElementChild.classList.remove("see-icon-checked");
            _$("#anonymousPublish").firstElementChild.firstElementChild.style.color = "#3aadfb";
            anonymousPublish = true;
        }
        if(pageS.anonymousReply){
            _$("#anonymousReply").firstElementChild.firstElementChild.classList.add("see-icon-checked-fill");
            _$("#anonymousReply").firstElementChild.firstElementChild.classList.remove("see-icon-checked");
            _$("#anonymousReply").firstElementChild.firstElementChild.style.color = "#3aadfb";
            anonymousReply = true;
        }
        if(pageS.choosePubScope_text){
            _$("#choosePubScope").firstElementChild.innerHTML = pageS.choosePubScope_text;
        }
        if(pageS.choosePubScope_fillBackData && pageS.choosePubScope_fillBackData.length>0){
            publishScopeIds = pageS.publishScopeIds;
            choosePubScope_fillBackData = pageS.choosePubScope_fillBackData;
            //choosePubScope_fillBackData = cmp.parseJSON(pageS.choosePubScope_fillBackData);
        }
        if(pageS.contentDiv){
            _$("#contentDiv").innerHTML = pageS.contentDiv;
        }
    }
}

function initImgUrl(data) {
  var imgSrc = "";
  var myregexp = /src="\/seeyon\/fileUpload\.do\?method=showRTE.*?fileId=([-]*\d+).*?createDate=(\d{4}-\d{2}-\d{2}).*?type=image/i;
  var match = myregexp.exec(data);
  var jsonStr = "";
  var data = {};
  var d = [];
  if (match != null) {
      data.fileId = match[1];
      data.createDate = match[2];
      d.push(data);
      jsonStr = cmp.toJSON(d);
  }
  return jsonStr;
}

/**
 *  保存讨论
 *  @param isDraft 是否保存为草稿
 */
function saveBbs(isDraft){
  if(_$("#bbsTitle").innerText.replace(/(^\s*)|(\s*$)/g, '').length == 0){
        cmp.notification.toast(cmp.i18n("bbs.h5.create.titleEmpty"),"center",2000);
        return;
    }else if(_$("#bbsTitle").innerText.length > 85){
        cmp.notification.toast(cmp.i18n("bbs.h5.create.titleMostNum"),"center",2000);
        return;
    }
    if(publishScopeIds.length == 0){
        cmp.notification.toast(cmp.i18n("bbs.h5.create.scopeNoEmpty"),"center",2000);
        return;
    }
    var _content = filteremoji(contentImgDeal(_$("#contentDiv")).innerHTML);
    var _title = _$("#bbsTitle").innerText.replace(/[\r\n]/g,"");
    //特殊表情转换
    if (cmp.Emoji) {
        var cemoji = cmp.Emoji();
        if (_title) {
            _title = filteremoji(cemoji.EmojiToString(_title));
        }
    }
    bbsParam = {
        "articleName": _title,
        "boardId": chooseTypeId,
        "issueArea": publishScopeIds,
        "resourceFlag": "0",
        "messageNotifyFlag": "checked",
        "anonymous": anonymousPublish ? "checked":null,
        "anonymousReply": anonymousReply? "checked":null,
        "shareDajia": "",
        "content": _content,
        "fileIds":arr,
        "draft": isDraft,
        "imgUrl": initImgUrl(_content)
    }
    cmp.dialog.loading();
    $s.Bbs.bbsSave({},bbsParam,{
        repeat:false,   //当网络掉线时是否自动重新连接
        success:function(result){
            cmp.dialog.loading(false);
            if(result.success){
                if(result.data == "-1"){
                    cmp.notification.alert(cmp.i18n("bbs.h5.create.typeDelete"), function() {
                        backFrom();
                    }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                }else{
                    var sendMsg = cmp.i18n("bbs.h5.create.sendSuccess");
                    if(isDraft){
                        var sendMsg =cmp.i18n("bbs.h5.create.saveSuccess");
                    }
                    cmp.notification.alert(sendMsg, function() {
                        cmp.storage.save("BBS_Create_Success_Refresh", "true", true);
                        backFrom();
                    }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                    if(document.querySelector(".window_alert ")){
                        document.querySelector(".window_alert ").focus();
                    }
                    document.getElementById("contentDiv").blur();
                }
            } else {
                cmp.notification.alert(cmp.i18n("bbs.h5.create.sendError"), function() {
                    backFrom();
                }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
            }
        },
        error:function(error){
            cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
                //cmp处理了这个错误
            }else {
                //customHandle(error) ;//走自己的处理错误的逻辑
                cmp.notification.alert(cmp.i18n("bbs.h5.create.sendError"), function() {
                    backFrom();
                }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
            }
        }
    });
}

/**
 * 返回方法
 * @param checkSave 检查是否为保存草稿
 */
function backFrom(checkSave){
    _$("#bbsTitle").blur();
    _$("#contentDiv").blur();
    if(typeChoosePage){
        typeChoosePage = false;
        _$("#show-block").classList.remove('cmp-active');
        return;
    }
    //返回是否保存草稿
    if(checkSave && (_$("#bbsTitle").innerText.length > 0 || _$("#contentDiv").innerText.length > 0)){
        var items = [ {
            key : "1",
            name : cmp.i18n("bbs.h5.create.savePc")
        }, {
            key : "2",
            name : cmp.i18n("bbs.h5.create.giveUpCreate")
        } ];
        cmp.dialog.actionSheet(items, cmp.i18n("bbs.h5.cancel"), function(item) {
            if(item.key == "1"){
                saveBbs(true);
                return;
            } else {
                pageBack();
            }
        });
    } else {
        pageBack();
    }
}

function pageBack(){
    document.removeEventListener('beforepageredirect', function(e){});
    cmp.storage.removeCacheData("pageDataSave", true);
//    cmp.href.next(bbsPath + "/html/bbsIndex.html"+"?r="+Math.random(), {}, {
//        animated : true,
//        direction : "right"
//    });
    cmp.href.back();
}

function title_div_blur(_this) {
    if (_$("#bbsTitle").clientHeight > 55) {
        _$("#bbsTitle").style.maxHeight = "21px";
        _this.classList.add("cmp-ellipsis");
    }
    if(cmp.os.android){
        _$("#bbsNew-footer").style.display = "table";
        _$("#bodyDiv").style.bottom = "90px";
    }
}

function title_div_focus(_this) {
    if (_this.classList.contains("cmp-ellipsis")) {
        _$("#bbsTitle").removeAttribute("style");
        _this.classList.remove("cmp-ellipsis");
    }
    if(cmp.os.android){
        _$("#bbsNew-footer").style.display = "table";
        _$("#bodyDiv").style.bottom = "90px";
        setTimeout(function () {
            And_win_innerHeight = window.innerHeight;
        },400);
    }
}

function content_div_focus() {
    _$("#bbsNew-footer-img").style.display = "table";
    _$("#bbsNew-footer").style.display = "none";

    /*setTimeout(function(){
        if(document.body.scrollTop > 200 && _$("#contentDiv").clientHeight<window.innerHeight){
            _$(".bbsNew-choose").style.marginTop = "100px";
        }
    },500);*/
    if(cmp.os.android){
        _$("#bodyDiv").scrollTop = 200;
        setTimeout(function () {
            And_win_innerHeight = window.innerHeight;
        },400);
        footerAuto("","bbsNew-footer-img");
        input_position_interval = setInterval(function(){
            footerAuto("","bbsNew-footer-img");
        },500);
    }
    if(cmp.os.ios){
        _$("#bodyDiv").style.bottom = 40 + "px";
        footerAuto("","bbsNew-footer-img");
        input_position_interval = setInterval(function(){
            footerAuto("","bbsNew-footer-img");
        },500);
    }

    // document.addEventListener("touchmove",function () {
    //     _$("#contentDiv").blur();
    // });
}

function content_div_blur() {
    // _$("#bbsNew-footer-img").style.bottom = 0;
    _$("#bbsNew-footer-img").style.display = "none";
    _$("#bbsNew-footer").style.display = "table";
    // _$(".bbsNew-choose").style.marginTop = "0";
    if(cmp.os.android){
        _$("#bodyDiv").scrollTop = 0;
    }
    if(cmp.os.ios){
        _$("#bodyDiv").style.bottom = 90 + "px";
        footerAuto("","bbsNew-footer-img");
        window.clearInterval(input_position_interval);
    }
}

function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}
function contentImgDeal(contentDom){
    var _contentDivCopy = _$("#contentDivCopy");
    _contentDivCopy.innerHTML = contentDom.innerHTML;
    var imgs  = _contentDivCopy.getElementsByClassName("uploadImgMark");
    for(var i =0;i<imgs.length;i++){
        imgs[i].setAttribute("src",imgs[i].getAttribute("value"));
    }
    return _contentDivCopy;
}

function formatTime(dateTime){
  return dateTime.substring(0, 10);
}
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

function footerAuto(_headerId,_footerId) {
    return null;
    if (cmp.os.ios) {
        setTimeout(function() { //键盘被弹起
            var ThisHeight = window.innerHeight;
            var position;
            if (ThisHeight < CMPFULLSREENHEIGHT) {
                var scrollTop = document.querySelector('body').scrollTop;
                position = CMPFULLSREENHEIGHT - ThisHeight - scrollTop;
                if(cmp.platform.wechat){
                    _$("#" + _footerId).style.bottom = "40px";
                    return;
                }
                if (position < 0) {
                    _$("#" + _footerId).style.bottom = "0px";
                } else {
                    _$("#" + _footerId).style.bottom = position + "px";
                }
            } else {
                _$("#" + _footerId).style.bottom = 0;
            }
        }, 550);
    }
}

//输入框中过滤输入法自带表情
function filteremoji(content) {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    emojireg = content.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}