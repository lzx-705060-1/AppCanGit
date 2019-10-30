var params;
var options;
var toFormBean;
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
    _cmppath + "/js/cmp-imgCache.js" + buildversion,
    _cmppath + "/js/cmp-listView.js" + buildversion,
    _cmppath + "/js/cmp-scrollBox.js" + buildversion,
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
    params=cmp.parseJSON(cmp.storage.get("relationSubForm_params",true));
    toFormBean=params.toFormBean;

    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.getElementById('footer').offsetHeight+'px';

     options = {
        //containerId: 'contentDiv', //渲染的div根节点id
        //moduleId: '5248713065191367153',
        //moduleType: '1',
        //rightId: '-1526619788876103578',
        //viewState: '1',

        containerId: 'contentDiv', //渲染的div根节点id
        moduleId: params.contentAllId!=undefined?params.contentAllId:params.moduleId,
        moduleType:params.moduleType,
        rightId: params.rightId,
        viewState:  "2",
        allowCheck:true

    }

       // options.moduleId = params.formTemplateId;


        $s.CapForm.showFormData({}, options, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function (ret) {
                var contentList = ret.contentList;
                for(var i=0;i<contentList.length;i++){
                    if(contentList[i].extraMap && contentList[i].extraMap.isOffice){
                        contentList.splice(i,1);
                    }
                }
                if(contentList.length>1){//多视图
                    var views_tab = document.getElementById("views_tab_tpl").innerHTML;
                    var segmentedControl = document.getElementById("segmentedControl");
                    var tabs = document.getElementById("tabs");
                    var tabhtml = cmp.tpl(views_tab, contentList);
                    tabs.innerHTML = tabhtml;
                    segmentedControl.style.display="block";
                    jsList=jsList.slice(0,jsList.length-3);
                    cmp.asyncLoad.js([_cmppath + "/js/cmp-imgCache.js" + buildversion,
                        _cmppath + "/js/cmp-listView.js" + buildversion,
                        _cmppath + "/js/cmp-scrollBox.js" + buildversion], function () {
                        cmp.scrollBox("#segmentedControl");
                    });
                    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('#segmentedControl').offsetHeight-document.getElementById("footer").offsetHeight+'px';
                    //绑定下拉事件
                    if(cmp.storage.get("relationSubForm_currview",true)){
                        options.indexParam=cmp.storage.get("relationSubForm_currview",true);
                        //document.getElementById("more_view_title").innerText=contentList[options.indexParam].extraMap.viewTitle;
                    }else{
                        //document.getElementById("more_view_title").innerText=contentList[0].extraMap.viewTitle;
                    }
                }else{
                    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.getElementById("footer").offsetHeight+'px';

                }
                showContent();
                bindEvent();
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


});
function showContent(){

    if(params.showType=="browse") {
        options.viewState="2";
    }else if(params.showType=="add") {
        options.moduleId = params.formTemplateId;
    }
    options.templateType = 'lightForm';
    cmp.dialog.loading(true);
    if(cmp.sui.loadForm){
        cmp.sui.loadForm(options, function (err, data) {
            if (err) {
            } else {
                cmp.dialog.loading(false);
            }
        });
    }else {
        cmp.asyncLoad.js([_unflowformpath + "/FlowForm/dev/new_style/iscroll-zoom.js" + buildversion,_formpath + "/js/sui.js" + buildversion], function () {
            cmp.sui.loadForm(options, function (err, data) {
                if (err) {
                } else {
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

//绑定图标事件
function bindEvent() {
    cmp.backbutton.push(function(){
        if(params.formType==="form"){
            cmp.href.go(_unflowformpath+"/html/relationForm.html",params);
        }else{
            cmp.href.go(_unflowformpath+"/html/relationUnflow.html",params);
        }
    })

    document.addEventListener("tap",function(e){

        var srcEle = e.target;

        //附件
        if(srcEle.classList.contains("allow-click-attachment")){
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
                    parent.collApi.openSummary(para);
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
                cmp.notification.toast("微信端暂不支持图片查看","center");
            }
        }else if(srcEle.classList.contains("sui-input-url")){

            //连接
            var aHref = srcEle.getAttribute("src");
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

    //确定
    var ok = document.getElementById("ok");
    ok.addEventListener("tap", function(){
        //从表单获取选择数据
        var obj = new Object();
        obj.toFormId =  toFormBean.id;
        var subData=[];
        var dataIds=cmp.sui.getSelectedRecordIds();//从表单组件获取选择的重复表行
        for(var t=1;t<toFormBean.tableList.length;t++){
            var tablename=toFormBean.tableList[t].split("|")[0];
            subData.push({tableName:tablename,dataIds:dataIds[tablename]});
        }
        var selectArray=[];
        selectArray.push({masterDataId: params.dataId,subData:subData});

        /**返回数据格式
         *{toFormId:yyyy,selectArray:[{masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]},
                                      {masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]}]}
         */
        obj.selectArray = selectArray;
        cmp.storage.save(params.pageKey,JSON.stringify({"metadata":params.metadata,"data":obj}),true);
        cmp.storage.delete( "searhInfo",true);
        cmp.storage.delete("unflowList_clearCache",true);
        cmp.storage.delete("crumbsID",true);
        cmp.storage.delete("userOrderBy",true);
        cmp.href.go(params.fromUrl,params.pageParams);

    });

    //tab
    var tabs = document.getElementById("segmentedControl").querySelectorAll("a");
    for(var i=0;i<tabs.length;i++){
        tabs[i].addEventListener("tap", function(){
            options.indexParam=this.getAttribute("id").replace("tab_","");
            showContent();
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



