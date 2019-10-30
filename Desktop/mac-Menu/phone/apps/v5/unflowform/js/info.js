var params;
var options;
var formStyle=1;//轻、原表单
var pcform;
var contentList;
var jsList=[
    _cmppath + "/js/cmp-picker.js" + buildversion,
    _cmppath + "/js/cmp-accDoc.js" + buildversion,
    _cmppath + "/js/cmp-app.js" + buildversion,
    _cmppath + "/js/cmp-lbs.js" + buildversion,
    _cmppath + "/js/cmp-camera.js" + buildversion,
    _cmppath + "/js/cmp-selectOrg.js" + buildversion,
    _cmppath + "/js/cmp-att.js" + buildversion,
    _cmppath + "/js/cmp-dtPicker.js" + buildversion,
    _cmppath + "/js/cmp-push.js" + buildversion,
    _cmppath + "/js/cmp-audio.js" + buildversion,
    _cmppath + "/js/cmp-server.js" + buildversion,
    _cmppath + "/js/cmp-headerFixed.js" + buildversion,
    _cmppath + "/js/cmp-search.js" + buildversion,
    _cmppath + "/js/cmp-v5.js" + buildversion,
    _cmppath + "/js/cmp-barcode.js" + buildversion,
    _cmppath + "/js/cmp-popPicker.js" + buildversion,
    _unflowformpath + "/unflowform_m_api.s3js" + buildversion,
    _collaboration_path + "/collaboration_m_api.s3js" + buildversion,
    _common_v5_path + "/cmp-resources/project/js/projectAccountList.js" + buildversion,
    _common_v5_path + "/widget/SeeyonAttachment.s3js" + buildversion,
    _cmppath + "/js/cmp-imgCache.js" + buildversion,
    _cmppath + "/js/cmp-listView.js" + buildversion,
    _cmppath + "/js/cmp-scrollBox.js" + buildversion
];

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

    if(params.name && params.name!="null"){
        document.title=params.name;
        document.getElementById("title-info-txt").innerText=params.name;
    }
    options = {
        //containerId: 'contentDiv', //渲染的div根节点id
        //moduleId: '5248713065191367153',
        //moduleType: '1',
        //rightId: '-1526619788876103578',
        //viewState: '1',

        containerId: "contentDiv", //渲染的div根节点id
        moduleId: params.contentAllId,
        moduleType:params.moduleType,
        rightId: params.rightId,
        allowQRScan: params.allowQRScan,
        style:"1",
        indexParam:"0",
        viewState:  params.showType=="browse"?"2":"1",
        openFrom:params.openFrom || "",
        onlyGenList:false
    }
    //如果是跳出后返回，需要切换
    var _state=cmp.storage.get("formStyle_"+options.indexParam+"_"+params.contentAllId,true);
    if(_state!=null) {
        formStyle = _state;
        options.templateType = (_state == 1 ? 'lightForm' : "infopath");
    }

    if(params.showType=="add") {
        if(cmp.storage.get("unflowform_contentDataId",true)){
            params.contentDataId=cmp.storage.get("unflowform_contentDataId",true);
            options.contentDataId =cmp.storage.get("unflowform_contentDataId",true);
        }
        options.moduleId = params.formTemplateId;
    }

    if(params.showType=="browse"){
        //$s.CapForm.showFormData({}, options, {repeat:true,   //当网络掉线时是否自动重新连接
        options.onlyGenList=true;//请求时此参数true只返回视图信息，不返回正文
        sendFastAjax("post","/seeyon/rest/capForm/showFormData?&option.n_a_s=1",options,{
            success: function (ret) {
                options.onlyGenList=false;
                contentList = ret.contentList;
                if(contentList.length>1){//多视图
                    var views_tab = _$("#views_tab_tpl").innerHTML;
                    var segmentedControl = _$("#segmentedControl");
                    var tabs = _$("#tabs");
                    var tabhtml = cmp.tpl(views_tab, contentList);
                    tabs.innerHTML = tabhtml;
                    segmentedControl.style.display="block";
                    jsList=jsList.slice(0,jsList.length-3);
                    cmp.asyncLoad.js([_cmppath + "/js/cmp-imgCache.js" + buildversion,
                                    _cmppath + "/js/cmp-listView.js" + buildversion,
                                    _cmppath + "/js/cmp-scrollBox.js" + buildversion], function () {
                        cmp.scrollBox("#segmentedControl");
                    });

                    document.getElementById("content").style.height="calc(100% - "  + document.querySelector("#segmentedControl").offsetHeight +"px)";
                    //绑定下拉事件
                    if(cmp.storage.get("currview",true)){
                        options.indexParam=cmp.storage.get("currview",true);
                        var _state=cmp.storage.get("formStyle_"+options.indexParam+"_"+params.contentAllId,true);
                        if(_state!=null) {
                            formStyle = _state;
                            options.templateType = (_state == 1 ? 'lightForm' : "infopath");
                        }
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
                    document.getElementById("content").style.height="100%";

                }
                var isLightForm=contentList[0].extraMap.isLightForm;

                if(!isLightForm && cmp.storage.get("formStyle_"+options.indexParam+"_"+params.contentAllId,true)!="1"){//未设置轻表单
                    formStyle=2;
                    options.templateType = 'infopath';
                    cmp.storage.save("formStyle_"+options.indexParam+"_"+params.contentAllId,formStyle,true);
                }

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
      if(params.showType=="update" && params.openFrom=="scanInput") { //二维码扫一扫只有一个权限时会跳过锁定状态的判断
        params.dataId=params.moduleId;
          //判断是否处于编辑锁定状态
          sendFastAjax("post","/seeyon/rest/unflowForm/checkDataLockForEdit?&option.n_a_s=1",params,{
          success: function (ret) {
            if (ret.msg != undefined) {
              cmp.notification.alert(ret.msg, function () {
                cmp.href.back();
              }, " ", cmp.i18n('unflowform.ok'));
              return;
            } else {
              sendFastAjax("post","/seeyon/rest/unflowForm/checkLock?&option.n_a_s=1",params,{
                success: function (ret) {
                  if (ret.locked) {
                    cmp.notification.alert(cmp.i18n("unflowform.datalocked"), function () {
                      cmp.href.back();
                    }, " ", cmp.i18n('unflowform.ok'));
                    return;
                  } else {
                    getContentList(options);
                  }
                },
                error: function (e) {
                  var cmpHandled = cmp.errorHandler(e);
                  if (cmpHandled) {
                  } else {
                    cmp.notification.alert(e.message, function () {
                    }, " ", cmp.i18n('unflowform.ok'));
                  }
                }
              });
            }
          },
          error: function (e) {
            var cmpHandled = cmp.errorHandler(e);
            if (cmpHandled) {
            } else {
              cmp.notification.alert(e.message, function () {
              }, " ", cmp.i18n('unflowform.ok'));
            }
          }
        });
      }else{
        getContentList(options);
      }

    }
}
function getContentList(options){
  //$s.CapForm.showFormData({}, options, {repeat:true,   //当网络掉线时是否自动重新连接
  options.onlyGenList=true;//请求时此参数true只返回视图信息，不返回正文
  sendFastAjax("post","/seeyon/rest/capForm/showFormData?&option.n_a_s=1",options,{
    success: function (ret) {
      options.onlyGenList=false;
      document.getElementById("content").style.height="calc(100% - 50px)";
      contentList = ret.contentList;
      var isLightForm=contentList[0].extraMap.isLightForm;
      if(!isLightForm  && cmp.storage.get("formStyle_"+options.indexParam+"_"+params.contentAllId,true)!="1"){//未设置轻表单
        formStyle=2;
        options.templateType = 'infopath';
        cmp.storage.save("formStyle_"+options.indexParam+"_"+params.contentAllId,formStyle,true);
      }
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
}
function sendFastAjax(type,url,data,callBack){
    cmp.ajax({
        headers:{"Accept": "application/json; charset=utf-8", "Accept-Language": "zh-CN", "Content-Type": "application/json; charset=utf-8", "token": cmp.token},
        url:cmp.serverIp+url,
        cmpReady2Fire:true,//是否是在ready后再执行callback
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

function showContent() {

    if (params.showType == "browse") {
        options.viewState = "2";
    } else if (params.showType == "add") {
        options.moduleId = params.formTemplateId;
    }
    if (formStyle == 1) {//轻表单
        document.getElementById("scroll").style.overflowY = "scroll";
    } else {
        document.getElementById("scroll").style.overflowY = "hidden";
    }
    cmp.dialog.loading(true);
    if(cmp.sui.loadForm){
        cmp.sui.loadForm(options, function (err, data) {
            if (err) {
            } else {
                //cmp.HeaderFixed(document.querySelector("header"),document.querySelectorAll("input"));
                cmp.dialog.loading(false);
            }
        });
    }else {
        cmp.asyncLoad.js([_unflowformpath + "/FlowForm/dev/new_style/iscroll-zoom.js" + buildversion,_formpath + "/js/sui.js" + buildversion], function () {
            cmp.sui.loadForm(options, function (err, data) {
                if (err) {
                } else {
                    //cmp.HeaderFixed(document.querySelector("header"),document.querySelectorAll("input"));
                    cmp.dialog.loading(false);
                }
            });
        });
    }


    if (jscssLoaded == false) {
        cmp.asyncLoad.js(jsList, function () {
        });

        cmp.asyncLoad.css(cssList, function () {
        });
        jscssLoaded = true;
    }
}
function getInfo(){
    if(params.showType=="browse"){  //查看
        if(params.openFrom=="search" || params.needCheckRight) { //来自全文检索 或者其它模块
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

    cmp.backbutton.push(function(){
        goBack();
    });
}
function goBack(){
    try{
        cmp.storage.delete("currview",true);
        if(typeof contentList !="undefined"){
            for(var i=0;i<contentList.length;i++){
                cmp.storage.delete("formStyle_"+i+"_"+params.contentAllId,true);
            }
        }
        cmp.storage.delete("unflowform_contentDataId",true);
        cmp.sui.clearCache(params, true);
        if(params.showType!="update"){
            cmp.href.back();
        }else{
            $s.CapForm.removeSessionMasterDataBean( params.dataId || params.moduleId,{}, {
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
    }catch(e){
        cmp.href.back();
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
            var isLightForm=contentList[options.indexParam].extraMap.isLightForm;
            formStyle=1;
            options.templateType ="lightForm";
            var _state=cmp.storage.get("formStyle_"+options.indexParam+"_"+params.contentAllId,true);
            if(_state!=null){//保存过状态
                if(_state==2){
                    formStyle=2;
                    options.templateType = 'infopath';
                }
            }else if(!isLightForm){//未设置轻表单显示原表单
                formStyle=2;
                options.templateType = 'infopath';
            }
            cmp.storage.save("formStyle_"+options.indexParam+"_"+params.contentAllId,formStyle,true);
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

//        pcform.preSubmitData({needCheckRule:false},function(data){
//            cmp.dialog.loading(false);
//        },function(err){
//            cmp.dialog.loading(false);
//            //cmp.notification.toast(err.message,"center");
//        });
    });


    //查看原样表单
    var showPc_Btn = document.getElementById("showPc_Btn");
    showPc_Btn.addEventListener("tap", function(){
        changeFormStyle();
    });

    showPc_Btn.addEventListener("touchstart",function(e){
        var p,f1,f2;
        if(e.touches.length == 1){
          e.preventDefault();
        };

        //由于触屏的坐标是个数组，所以取出这个数组的第一个元素
        e=e.targetTouches[0];
        //保存showPc_Btn和开始触屏时的坐标差
        p={
          x:showPc_Btn.offsetLeft-e.clientX,
          y:showPc_Btn.offsetTop-e.clientY
        };
        //添加触屏移动事件
        document.addEventListener("touchmove",f2=function(e){
          //拖动的时候就隐藏提示的那个区域
          var _formHitCacheKey=formStyle==1?"showPcForm_hit_flag":"showLightForm_hit_flag";
          var isHit = cmp.storage.get(_formHitCacheKey,false);
          if (!isHit || isHit != "true") {
            cmp.storage.save(_formHitCacheKey, "true");
            document.getElementById("formStyle_button_hint").classList.add("display_none");
          }
          //获取保触屏坐标的对象
          var t=t=e.targetTouches[0];
          //把showPc_Btn移动到初始计算的位置加上当前触屏位置
          var xx=p.x+t.clientX;
          if(xx<0){
            xx=0;
          }else if(xx+showPc_Btn.offsetWidth>document.body.clientWidth){
            xx=document.body.clientWidth-showPc_Btn.offsetWidth;
          }
          var yy=p.y+t.clientY;
          if(yy<0){
            yy=0;
          }else if(yy+showPc_Btn.offsetHeight>document.body.clientHeight){
            yy=document.body.clientHeight-showPc_Btn.offsetHeight;
          }

          showPc_Btn.style.left=xx+"px";
          showPc_Btn.style.top=yy+"px";
        },false);

        //添加触屏结束事件
        document.addEventListener("touchend",f1=function(e){
          //移除在document上添加的两个事件
          document.removeEventListener("touchend",f1);
          document.removeEventListener("touchmove",f2);
        },false);
    },false);


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
            if(relData.success!="false"){
                if(relData.formType=="1"){//有流程
                    //触发页面数据缓存
                    cmp.event.trigger("beforepageredirect",document);
                    var para={summaryId:relData.dataId,
                        openFrom:"formRelation",
                        baseObjectId:options.moduleId
                    }
                    collApi.openSummary(para);
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
            }else{
                cmp.notification.toast(relData.errorMsg,"center");
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
        }else if(srcEle.classList.contains("sui-input-url")){

            //连接
            var aHref = srcEle.getAttribute("url");
            if(aHref){
                // 普通连接，直接弹出查看
                if(cmp.platform.CMPShell){
                    var tTitle = srcEle.innerText || '';// 连接
                    cmp.href.open(aHref, tTitle);
                }else{
                    cmp.notification.toast('微信端暂不支持超链接跳转!', 'top', 1000);// 微信端暂不支持超链接跳转!
                }
            }

        }
    });

    // //查看长标题
    // var appTitle = document.getElementById("appTitle");
    // if(appTitle.offsetWidth < appTitle.scrollWidth ){
    //     appTitle.addEventListener("tap", function(){
    //         document.getElementById("title-more").style.display=(document.getElementById("title-more").style.display=="block"?"none":"block");
    //         document.getElementById("title-info-txt").innerText=appTitle.innerText;
    //     });
    // }
    //
    // document.querySelector(".title-info-bg").addEventListener("tap", function(){
    //     document.getElementById("title-more").style.display="none";
    // });

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
    cmp.sui.cacheFormData();
    if(formStyle==1) { //切换到原表单
        formStyle = 2;
        options.templateType = 'infopath';
        showHint();
        cmp.storage.save("formStyle_"+options.indexParam+"_" + params.contentAllId, formStyle, true);
        showContent();
    }else { //切换到轻表单
        formStyle = 1;
        options.templateType = 'lightForm';
        showHint();
        cmp.storage.save("formStyle_"+options.indexParam+"_" + params.contentAllId, formStyle, true);
        showContent();
    }
}

//-----切换到原表单
function showPcForm(option){
    //cmp.event.trigger("beforepageredirect",document);
    cmp.storage.save("pcform_params",JSON.stringify(option),true);
    document.getElementById("contentFrame").style.width=(window.innerWidth || document.body.clientWidth) + "px";
    if(params.showType=="browse"){
        document.getElementById("contentFrame").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('#segmentedControl').offsetHeight+'px';
    }else{
        document.getElementById("contentFrame").style.height=(window.innerHeight || document.body.clientHeight)-50+'px';
    }
    var  content_Frame=document.getElementById("contentFrame");
    content_Frame.style.display="block";
    content_Frame.setAttribute("src","../html/showPcForm.html")
    document.getElementById("scroll").style.display="none";
}

function resetButton(data){
    cmp.dialog.loading(false);
    pcform=data;
}
var allowsubmit=true;
function doSubmit(_type) {
    cmp.dialog.loading(true);//显示
    var opt = {moduleId: options.moduleId, needCheckRule: true, notSaveDB: false};
    cmp.sui.submit(opt, function (err, data) {
        cmp.dialog.loading(false);//不显示
        setTimeout(function () {
            allowsubmit = true;
        }, 2000);

        if (err) {
            // cmp.notification.toast(err.message,"center");
        } else {
            params.contentDataId = data.contentAll.contentDataId;
            if (_type == "save_new") {
                if (data.snMsg) {
                    cmp.notification.alert(data.snMsg, null, '', cmp.i18n('unflowform.ok'));
                }
                options.fromCopy = null;
                cmp.sui.loadForm(options);
            } else if (_type == "save_copy") {
                if (data.snMsg) {
                    cmp.notification.alert(data.snMsg, null, '', cmp.i18n('unflowform.ok'));
                }
                options.fromCopy = data.contentAll.contentDataId;
                cmp.sui.loadForm(options);
            } else {
                cmp.storage.delete("formStyle_"+options.indexParam+"_" + params.contentAllId, true);
                if (data.snMsg) {
                    cmp.notification.alert(data.snMsg, function () {
                        cmp.href.back();
                    }, '', cmp.i18n('unflowform.ok'));
                } else {
                    cmp.href.back();
                }
            }
        }
    });
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