var params;
var options;
var formStyle=1;//轻、原表单
var pcform;
var jsList=["/js/cmp-accDoc.js",
    "/js/cmp-app.js",
    "/js/cmp-lbs.js",
    "/js/cmp-camera.js",
    "/js/cmp-selectOrg.js",
    "/js/cmp-att.js",
    "/js/cmp-dtPicker.js",
    "/js/cmp-push.js",
    "/js/cmp-audio.js",
    "/js/cmp-server.js",
    "/js/cmp-headerFixed.js",
    "/js/cmp-search.js",
    "/js/cmp-v5.js",
    "/js/cmp-barcode.js",
    "/js/cmp-popPicker.js"
];
for(var j=0;j<jsList.length;j++){
    jsList[j]=_cmppath + jsList[j] + buildversion;
}
var cssList=["/css/cmp-selectOrg.css",
    "/css/cmp-att.css",
    "/css/cmp-picker.css",
    "/css/cmp-audio.css",
    "/css/cmp-listView.css",
    "/css/cmp-accDoc.css",
    "/css/cmp-search.css"
];
for(var c=0;c<cssList.length;c++){
    cssList[c]=_cmppath + cssList[c] + buildversion;
}
var jscssLoaded=false;
cmp.ready(function(){
    cmp.backbutton();
});

function initParam(){
    //如果是从原表单跳出，需要切换
    if(cmp.storage.get("formStyle_"+params.contentAllId,true)==2){
        formStyle=2;
    }

    if(params.name && params.name!="null"){
        document.getElementById("appTitle").innerText= params.name;
        document.getElementById("title-info-txt").innerText=params.name;
    }
    options = {
        //containerId: 'contentDiv', //渲染的div根节点id
        //moduleId: '5248713065191367153',
        //moduleType: '1',
        //rightId: '-1526619788876103578',
        //viewState: '1',

        containerId: 'contentDiv', //渲染的div根节点id
        moduleId: params.contentAllId,
        moduleType:params.moduleType,
        rightId: params.rightId,
        allowQRScan: params.allowQRScan,
        indexParam:"0",
        viewState:  params.showType=="browse"?"2":"1"

    }
    if(params.showType=="add") {
        if(cmp.storage.get("unflowform_contentDataId",true)){
            params.contentDataId=cmp.storage.get("unflowform_contentDataId",true);
            options.contentDataId =cmp.storage.get("unflowform_contentDataId",true);
        }
        document.getElementById("backBtn").querySelector("span").classList.remove("see-icon-v5-common-arrow-back");
        document.getElementById("backBtn").querySelector("span").classList.add("see-icon-v5-common-close");
        document.getElementById("backBtn").querySelector(".nav-text").innerText=cmp.i18n("unflowform.close");
        options.moduleId = params.formTemplateId;
    }

    if(params.showType=="browse"){
        //$s.CapForm.showFormData({}, options, {repeat:true,   //当网络掉线时是否自动重新连接
        sendFastAjax("post","/seeyon/rest/capForm/showFormData?&option.n_a_s=1",options,{
            success: function (ret) {
                var contentList = ret.contentList;
                if(contentList.length>1){//多视图
                    var views_tab = _$("#views_tab_tpl").innerHTML;
                    var segmentedControl = _$("#segmentedControl");
                    var tabs = _$("#tabs");
                    var tabhtml = cmp.tpl(views_tab, contentList);
                    tabs.innerHTML = tabhtml;
                    segmentedControl.style.display="block";
                    cmp.scrollBox("#segmentedControl");
                    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight-document.querySelector('#segmentedControl').offsetHeight+'px';
                    //绑定下拉事件
                    if(cmp.storage.get("currview",true)){
                        options.indexParam=cmp.storage.get("currview",true);

                        //激活当前tab页签
                        var tabs=document.getElementById("tabs").querySelectorAll(".cmp-control-item");
                        [].forEach.call(tabs,function(tab){
                           if(tab.classList.contains("cmp-active")){
                               tab.classList.remove("cmp-active");
                           }
                        });
                        document.getElementById("tab_"+options.indexParam).classList.add("cmp-active");
                    }else{
                        // document.getElementById("more_view_title").innerText=contentList[0].extraMap.viewTitle;
                    }

                }else{
                    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight+'px';

                }
                var isLightForm=contentList[0].extraMap.isLightForm;
                if(!document.getElementById("appTitle").innerText){
                    document.getElementById("appTitle").innerText=contentList[0].title;
                    document.getElementById("title-info-txt").innerText=contentList[0].title;
                }
                if(!isLightForm && cmp.storage.get("formStyle_"+params.contentAllId,true)!="1"){//未设置轻表单
                    formStyle=2;
                    cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
                }
                //if(!cmp.storage.get("formStyle_"+params.contentAllId,true)){
                //    formStyle=2;
                //    cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
                //}

                showHint();
                getInfo();
                bindEvent();
            },
            error:function(e){
                var cmpHandled = cmp.errorHandler(e);
                if(cmpHandled) {
                    cmp.href.back();
                }else {
                    cmp.notification.alert(e.message, function () {
                        cmp.href.back();
                    }, " ", cmp.i18n('unflowform.ok'));
                }
            }

        });
    }else{
        cmp.storage.save("unflowList_clearCache",true,true);
        showHint();
        //$s.CapForm.showFormData({}, options, {repeat:true,   //当网络掉线时是否自动重新连接
        sendFastAjax("post","/seeyon/rest/capForm/showFormData?&option.n_a_s=1",options,{
            success: function (ret) {
                document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight-document.getElementById('footer').offsetHeight+'px';
                var contentList = ret.contentList;
                //var isLightForm=contentList[0].extraMap.isLightForm;
                //if(!isLightForm  && cmp.storage.get("formStyle_"+params.contentAllId)!="1",true){//未设置轻表单
                //    formStyle=2;
                //    cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
                //}
                getInfo();
                bindEvent();
            },
            error:function(e){
                var cmpHandled = cmp.errorHandler(e);
                if(cmpHandled) {
                    cmp.href.back();
                }else {
                    cmp.notification.alert(e.message, function () {
                        cmp.href.back();
                    }, " ", cmp.i18n('unflowform.ok'));
                }
            }

        });
    }
}
function sendFastAjax(type,url,data,callBack){
    cmp.ajax({
        headers:{"Accept": "application/json; charset=utf-8", "Accept-Language": "zh-CN", "Content-Type": "application/json; charset=utf-8", "token": cmp.token},
        url:cmp.serverIp+url,
        cmpReady2Fire:false,//是否是在ready后再执行callback
        fastAjax:true,
        repeat:true,   //当网络掉线时是否自动重新连接
        type:type,
        data:JSON.stringify(data),
        dataType : "json",
        success: function (ret) {
            if(typeof (callBack.success)=="function"){
                callBack.success(ret);
            }
        },
        error:function(error){
            var err=error;
            if(typeof error == "object"){
                if (!error.message) {
                    var responseText = error.responseText;
                    if (responseText) {
                        try {
                            err = cmp.parseJSON(responseText);
                        } catch (e) {
                        }
                    }
                }
            }else {
                try{
                    err = cmp.parseJSON(error);
                }catch(e){}
            }

            if(typeof (callBack.error)=="function"){
                callBack.error(err);
            }
        }
    });
}

function showContent(){

    if(params.showType=="browse") {
        options.viewState="2";
    }else if(params.showType=="add") {
        options.moduleId = params.formTemplateId;
    }
    if(formStyle==1) {//轻表单
        cmp.sui.loadForm(options,function(err, data){
            if(err){
                cmp.href.back();
            }
        });
    }else{
        var opt = {
            "isNew": false,
            "style":"1",
            "moduleId": options.moduleId,
            "moduleType": params.moduleType,
            "openFrom": "unflowform",
            "templateId": params.formTemplateId,
            "rightId": params.rightId,// "rightId": params.rightId.indexOf(".")==-1?params.rightId:params.rightId.substring(params.rightId.indexOf(".")+1).replace("|",""),
            "indexParam": options.indexParam,
            "viewState": params.showType=="browse"?"2":"1",
            "contentType": "20",
            "dataLoadedCallback":"resetButton"
        };

        if(params.showType=="browse") {
            opt.moduleId = params.contentAllId;
        }
        showPcForm(opt);
    }
    if(jscssLoaded==false) {
        cmp.asyncLoad.js(jsList, function () {
        });

        cmp.asyncLoad.css(cssList, function () {
        });
        jscssLoaded=true;
    }
}
function getInfo(){
    if(params.showType=="browse"){  //查看
        if(params.openFrom=="search") { //来自全文检索
            //全文检索有权限的问题，需要判断
            $s.UnflowForm.viewUnflowFormData ({}, params, {
                repeat:true,   //当网络掉线时是否自动重新连接
                success: function (ret) {
                    showContent();
                },
                error:function(e){
                    document.getElementById("showPc_Btn").style.display="none";
                    var cmpHandled = cmp.errorHandler(e);
                    if(cmpHandled) {
                        cmp.href.back();
                    }else{
                        cmp.notification.alert(e.message, function () {
                            cmp.href.back();
                        }, " ", cmp.i18n('unflowform.ok'));
                    }
                }
            });
        }else{
            showContent();
        }
    }else {
        document.getElementById("footer").style.display = "";
        if(params.showType=="add") {
           document.getElementById("save_new").style.display = "";
           document.getElementById("save_copy").style.display = "";
        }

        $s.UnflowForm.newUnflowFormData({}, params, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success : function(ret) {
                params.allowQRScan=ret.allowQRScan;
                options.allowQRScan=ret.allowQRScan;
                showContent();
            },
            error:function(e){
                var cmpHandled = cmp.errorHandler(e);
                if(cmpHandled) {
                    cmp.href.back();
                }else{
                    cmp.notification.alert(e.message, function () {
                        cmp.href.back();
                    }, " ", cmp.i18n('unflowform.ok'));
                }
            }
        });
    }
}

function bindBackBtnEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        goBack();
    });
    cmp.backbutton.push(function(){
        goBack();
    });
}
function goBack(){
    cmp.storage.delete("currview",true);
    cmp.storage.delete("formStyle_"+params.contentAllId,true);
    cmp.storage.delete("unflowform_contentDataId",true);
    if(params.showType!="update"){
        cmp.href.back();
    }else{
        $s.CapForm.removeSessionMasterDataBean( params.dataId,{}, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function (ret) {
                cmp.href.back();
            },
            error:function(e){
                var cmpHandled = cmp.errorHandler(e);
                if(cmpHandled) {
                    cmp.href.back();
                }else{
                    cmp.notification.alert(e.message, function () {
                        cmp.href.back();
                    }, " ", cmp.i18n('unflowform.ok'));
                }
            }
        });
    }
}

//绑定图标事件
function bindEvent() {

    //tab
    var tabs = document.getElementById("segmentedControl").querySelectorAll("a");
    for(var i=0;i<tabs.length;i++){
        tabs[i].addEventListener("tap", function(){
            options.indexParam=this.getAttribute("id").replace("tab_","");
            cmp.storage.save("currview",options.indexParam,true);
            showContent();
        });
    }


    //保存并新建
    var save_new = document.getElementById("save_new");
    save_new.addEventListener("tap", function(){
        doSubmit("save_new");
    });

   //保存并复制
    var save_copy = document.getElementById("save_copy");
    save_copy.addEventListener("tap", function(){
        doSubmit("save_copy");
    });

    //保存
    var save = document.getElementById("save");
    save.addEventListener("tap", function(){
        doSubmit("save");
    });

    document.addEventListener("beforepageredirect",function(e){
        cmp.dialog.loading(true);
        if(params.showType=="add" && params.contentDataId) {
            cmp.storage.save("unflowform_contentDataId",params.contentDataId,true);
        }

        pcform.preSubmitData({needCheckRule:false},function(data){
            cmp.dialog.loading(false);
        },function(err){
            cmp.dialog.loading(false);
            //cmp.notification.toast(err.message,"center");
        });
    });


    //查看原样表单
    var showPc_Btn = document.getElementById("showPc_Btn");
    showPc_Btn.addEventListener("tap", function(){
        changeFormStyle();
    });


    document.addEventListener("tap",function(e){

        var srcEle = e.target;

        //附件
        if(srcEle.classList.contains("allow-click-attachment")) {
            var attData = srcEle.getAttribute("see-att-data");
            unflowForm_clickAtt(JSON.parse(attData));
        }else if(srcEle.classList.contains("allow-click-relationform")){
            //关联表单
            var relData = srcEle.getAttribute("see-att-data");
            relData = cmp.parseJSON(relData);
            if(relData.formType=="1"){//有流程
                //触发页面数据缓存
                cmp.event.trigger("beforepageredirect",document);
                parent.collApi.jumpToColSummary(relData.dataId,"formRelation");
            }else{
                var option={};
                option.moduleId=relData.dataId;
                option.moduleType=cmp.parseJSON(relData.record).formType;
                option.rightId=relData.rightId;
                option.name=relData.title;
                //触发页面数据缓存
                cmp.event.trigger("beforepageredirect",document);
                cmp.openUnflowFormData(option);
            }

        }else if(srcEle.tagName.toLocaleLowerCase() === "img"){

            if(cmp.platform.CMPShell){
                //图片
                var path = srcEle.getAttribute("url"),
                filename = srcEle.getAttribute('filename') || '' ;
                var fileId = srcEle.getAttribute('fileid');
                if(!fileId){
                    //表单意见里面签名图片不支持打开
                    return;
                }

                cmp.dialog.loading(true);
                cmp.att.read({
                    filename: filename,
                    path: path, // 文件路径
                    extData:{
                        fileId:fileId,
                        lastModified:"1"
                    },
                    success: function(res){
                        cmp.dialog.loading(false);
                    },
                    error:function(err){
                        cmp.dialog.loading(false);
                    }
                });
            }else{
                cmp.notification.toast("微信端暂不支持图片的查看","center");
            }
        }
    });

    //查看长标题
    var appTitle = document.getElementById("appTitle");
    if(appTitle.offsetWidth < appTitle.scrollWidth ){
        appTitle.addEventListener("tap", function(){
            document.getElementById("title-more").style.display=(document.getElementById("title-more").style.display=="block"?"none":"block");
            document.getElementById("title-info-txt").innerText=appTitle.innerText;
        });
    }

    document.querySelector(".title-info-bg").addEventListener("tap", function(){
        document.getElementById("title-more").style.display="none";
    });

    //安卓下textarea无法滚动的问题
    if(cmp.os.android){
        var tsY;
        document.addEventListener("touchstart", function (e) {
            if (e.target.tagName.toLocaleLowerCase() == "textarea") {
                tsY = e.touches[0].pageY;
            }
        });

        document.addEventListener("touchmove", function (e) {
            if (e.target.tagName.toLocaleLowerCase() == "textarea" && formStyle==1) {
                console.log(e.target.tagName);
                var textArea = e.target;
                var top = textArea.scrollTop <= 0;
                var bottom = textArea.scrollTop + textArea.clientHeight >= textArea.scrollHeight;
                var tdY = e.changedTouches[0].pageY;
                e.preventDefault();
                e.stopPropagation();
                if (!(top && bottom)) {
                    textArea.scrollTop = textArea.scrollTop + (tsY - tdY);
                    tsY = tdY;
                }
            }
        });
    }
}
//点击附件事件
function unflowForm_clickAtt(att){

    if(cmp.system.filePermission()){
        SeeyonAttachment.openRelatedDoc({"att" : att});
    }else{
        var attTypeMsg = "附件下载或查看!";
        switch (att.mimeType) {
            case "collaboration":
            case "edoc":
            case "meeting":
            case "km":
                attTypeMsg = "关联文档查看!";
                cmp.notification.toast("当前客户端暂不支持" + attTypeMsg, 'top', 1000);
                break;
            default:
                SeeyonAttachment.openRelatedDoc({"att" : att});
                break;
        }
    }
}

//-----切换轻/原表单
function changeFormStyle(){
    cmp.dialog.loading(true);//显示
    if(formStyle==1){ //切换到原表单
        var opt = {
            "isNew": false,
            "style":"1",
            "moduleId": options.moduleId,
            "moduleType": params.moduleType,
            "openFrom": "unflowform",
            "templateId": params.formTemplateId,
            "rightId": params.rightId,// "rightId": params.rightId.indexOf(".")==-1?params.rightId:params.rightId.substring(params.rightId.indexOf(".")+1).replace("|",""),
            "indexParam": options.indexParam,
            "viewState": params.showType=="browse"?"2":"1",
            "contentType": "20",
            "dataLoadedCallback":"resetButton"
        };

        if(params.showType=="browse") {
            opt.moduleId=params.contentAllId;
            formStyle=2;
            showHint();
            cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
            showPcForm(opt);
        }else{

            var opt1= { moduleId:options.moduleId, needCheckRule:false, notSaveDB:true,needSn:false};
            cmp.sui.submit(opt1,function(err, data) {
                cmp.dialog.loading(false);//不显示
                if(err){
                    //cmp.notification.toast(err.message,"center");
                }else {
                    formStyle=2;
                    showHint();
                    cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
                    opt.contentDataId=data.contentAll.contentDataId;
                    params.contentDataId=data.contentAll.contentDataId;
                    showPcForm(opt);
                }
            });
        }
    }else{ //切换到轻表单
        if(params.showType!="browse") {
            pcform.preSubmitData({needCheckRule:false},function(data){
                cmp.dialog.loading(false);//不显示
                formStyle=1;
                showHint();
                cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
                document.getElementById("scroll").style.display="block";
                document.getElementById("contentFrame").style.display="none";
                options.fromCopy=null;
                options.contentDataId=data.contentAll.contentDataId;
                params.contentDataId=data.contentAll.contentDataId;
                showContent();
            },function(err){
                cmp.dialog.loading(false);//不显示
                if(typeof(err)=="object"){
                    cmp.notification.alert(err.message, null, " ",cmp.i18n('unflowform.ok'));
                }else{
                    cmp.notification.alert(err, null, " ",cmp.i18n('unflowform.ok'));
                }

            });

        }else{
            cmp.dialog.loading(false);//不显示
            formStyle=1;
            showHint();
            cmp.storage.save("formStyle_"+params.contentAllId,formStyle,true);
            document.getElementById("scroll").style.display="block";
            document.getElementById("contentFrame").style.display="none";
            showContent();
        }
    }
}

//-----切换到原表单
function showPcForm(option){
    //cmp.event.trigger("beforepageredirect",document);
    cmp.storage.save("pcform_params",JSON.stringify(option),true);
    document.getElementById("contentFrame").style.width=(window.innerWidth || document.body.clientWidth) + "px";
    if(params.showType=="browse"){
        document.getElementById("contentFrame").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight-document.querySelector('#segmentedControl').offsetHeight+'px';
    }else{
        document.getElementById("contentFrame").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight-document.getElementById('footer').offsetHeight+'px';
    }
    var  content_Frame=document.getElementById("contentFrame");
    content_Frame.style.display="block";
    //content_Frame.onload = function(){
    //    setTimeout(function(){
    //        pcform=document.getElementById('contentFrame').contentWindow.showPcform;
    //        if(!pcform.isAllowSubmit()){//是否允许提交
    //            var btns=document.querySelectorAll(".unflowform-btn");
    //            [].forEach.call(btns, function(btn) {
    //                btn.classList.add("cmp-disabled");
    //            });
    //        }
    //    },1000);
    //
    //};
    content_Frame.setAttribute("src","../html/showPcForm.html")
    document.getElementById("scroll").style.display="none";
}

function resetButton(data){
    cmp.dialog.loading(false);
    pcform=data;
}
var allowsubmit=true;
function doSubmit(_type){
    if(!allowsubmit){
        return;
    }

    allowsubmit=false;
    //原表单下判断是否允许提交
    if(formStyle==2 && pcform.isAllowSubmit()==false) {//是否允许提交
        allowsubmit=true;
        cmp.notification.alert("当前表单不支持处理，请切换到轻表单或者电脑端处理！",null,"提示","确定");
        return;
    }

    cmp.dialog.loading(true);//显示
    if(formStyle==1) { //轻表单提交
        var opt= { moduleId:options.moduleId, needCheckRule:true, notSaveDB:false};
        cmp.sui.submit(opt,function(err, data){
            cmp.dialog.loading(false);//不显示
            setTimeout(function(){
                allowsubmit=true;
            },2000);

            if(err){
               // cmp.notification.toast(err.message,"center");
            }else{
                params.contentDataId=data.contentAll.contentDataId;
                if(_type=="save_new"){
                    if(data.snMsg){cmp.notification.alert(data.snMsg,null, '', cmp.i18n('unflowform.ok'));}
                    options.fromCopy=null;
                    cmp.sui.loadForm(options);
                }else if(_type=="save_copy"){
                    if(data.snMsg){cmp.notification.alert(data.snMsg,null, '', cmp.i18n('unflowform.ok'));}
                    options.fromCopy=data.contentAll.contentDataId;
                    cmp.sui.loadForm(options);
                }else{
                    cmp.storage.delete("formStyle_"+params.contentAllId,true);
                    if(data.snMsg){
                        cmp.notification.alert(data.snMsg,function(){
                            cmp.href.back();
                        }, '', cmp.i18n('unflowform.ok'));
                    }else{
                        cmp.href.back();
                    }
                }
            }
        });
    }else{ //原表单提交

         pcform.saveContent( function(data){
            cmp.dialog.loading(false);//不显示
             setTimeout(function(){
                 allowsubmit=true;
             },2000);
            params.contentDataId=data.contentAll.contentDataId;
            var opt = {
                "isNew": false,
                "style":"1",
                "moduleId": options.moduleId,
                "moduleType": params.moduleType,
                "openFrom": "unflowform",
                "templateId": params.formTemplateId,
                "rightId": params.rightId,// "rightId": params.rightId.indexOf(".")==-1?params.rightId:params.rightId.substring(params.rightId.indexOf(".")+1).replace("|",""),
                "indexParam": options.indexParam,
                "viewState": params.showType=="browse"?"2":"1",
                "contentType": "20",
                "dataLoadedCallback":"resetButton"
            };
            opt.contentDataId=data.contentAll.contentDataId;
                //showPcForm(opt);

            if(_type=="save_new"){
                opt.fromCopy=null;
                showPcForm(opt);
            }else if(_type=="save_copy"){
                opt.fromCopy=data.contentAll.contentDataId;
                showPcForm(opt);
            }else{
                cmp.storage.delete("formStyle_"+params.contentAllId,true);
                cmp.href.back();
            }
        }, function(err){
             cmp.dialog.loading(false);//不显示
             setTimeout(function(){
                 allowsubmit=true;
             },2000);
             if(typeof (err)=="object"){
                 cmp.notification.toast(err.message,"center");
             }else if(err){
                 cmp.notification.toast(err,"center");
             }
        });
        cmp.dialog.loading(false);//不显示
    }

}

function showHint(){
    //新建引导 获取本地缓存
    var hitEle =  document.getElementById("formStyle_button_hint");
    if(formStyle==1){
        var isHit = cmp.storage.get("showPcForm_hit_flag",false);
        if(!isHit || isHit != "true"){
            hitEle.querySelector(".text").innerHTML="<span>"+cmp.i18n("unflowform.hint")+"</span>";
            hitEle.classList.remove("display_none");
            hitEle.querySelector("#btn1").style.display="block";
            hitEle.querySelector("#btn2").style.display="none";
            hitEle.querySelector("#btn1").addEventListener("tap", function(){
                    cmp.storage.save("showPcForm_hit_flag","true",false);
                    hitEle.classList.add("display_none");
                });
        }else {
            hitEle.classList.add("display_none");
        }
    }else{
        var isHit = cmp.storage.get("showLightForm_hit_flag",false);
        if(!isHit || isHit != "true"){
            hitEle.querySelector(".text").innerHTML="<span>"+cmp.i18n("unflowform.hint_lightform")+"</span>";
            hitEle.classList.remove("display_none");
            hitEle.querySelector("#btn2").style.display="block";
            hitEle.querySelector("#btn1").style.display="none";
            hitEle.querySelector("#btn2").addEventListener("tap", function(){
                    cmp.storage.save("showLightForm_hit_flag","true",false);
                    hitEle.classList.add("display_none");
                });
        }else {
            hitEle.classList.add("display_none");
        }
    }

}

//简化选择器
function _$(selector){
    return document.querySelector(selector)
}