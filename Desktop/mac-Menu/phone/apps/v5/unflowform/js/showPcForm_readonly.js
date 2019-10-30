var params={};
var formData={};
var jsList=["dev/new_style/m1-form-style.js",
    "dev/new_style/m1-newCalendar.js",
    "seeyon.ui.calendar-debug.js",
    "dev/new_style/iscroll-zoom.js",
    "m1-global-debug.js",
    "jquery.json-debug.js",
    //"Moo-debug.js",
    //"jsonGateway-debug.js",
    "v3x-debug.js",
    "m1-form-debug.js",
    "m1-content-debug.js",
    "m1-common-debug.js",
    "jquery.comp-debug.js",
    "jquery.jsonsubmit-debug.js",
    "jquery.code-debug.js",
    "jquery.fillform-debug.js",
    "common-debug.js",
    "seeyon.ui.checkform-debug.js",
    "i18n_en.js",
];
var curr=0;

var showPcform={};

//预提交
showPcform.preSubmitData=function(successCallBack, failedCallback) {
    document.getElementById('frm1').contentWindow.preSubmitData(successCallBack, failedCallback);
}

//提交数据库
showPcform.saveContent=function(successCallBack, failedCallBack) {
    document.getElementById('frm1').contentWindow.saveContent(params.moduleId, showPcform.contentList[params.indexParam].title, successCallBack, failedCallBack);
}

//检查表单是否允许在原表单处理
// 传入参数 s3scope
showPcform.isAllowSubmit=function(){
    var flag=true;
    var master=formData.results.data.master;
    var fieldInfo=formData.results.metadata.fieldInfo;
    for(key in master){
        if(typeof (master[key])=="object"){
            var currfield=master[key];
            if(currfield!=null && currfield.notNull==true){ //必填项，但必填项在以下支持范围，且不参与计算时，支持新建、处理提交
                var field=fieldInfo[key];
                if(field.finalInputType=="text" || field.finalInputType=="textarea" || field.finalInputType=="checkbox" ||
                    field.finalInputType=="radio" || field.finalInputType=="select" || ( field.finalInputType=="barcode" && field.formatType=="text") )
                {
                    if(field.inCalc || field.inCondition ){//参与计算或者参与条件则不允许提交
                        flag=false;
                        break;
                    }

                }else{//必填项，且必填项不在上面的支持编辑范围
                    flag=false;
                    break;
                }

            }
        }
    }
    console.log("allowSubmit:"+flag);
    return flag;
}

cmp.ready(function(){


    if(parent.cmp.storage.get("pcform_params",true)!=null){
        params=parent.cmp.parseJSON(parent.cmp.storage.get("pcform_params",true));
        parent.cmp.storage.delete("pcform_params",true);
        document.querySelector("header").style.display="none";
        document.querySelector(".cmp-content").style.top="0px";
    }else{
        cmp.backbutton();
        params=cmp.href.getParam();
    }

    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight+'px';
    document.getElementById("scroll").style.overflow="hidden";
    document.getElementById("frm1").style.height=document.getElementById("scroll").style.height;
    document.getElementById("frm1").style.width=(window.innerWidth || document.body.clientWidth)+'px';
    //params.viewState ="2";
    params.needContent="true";
    params.h5Tag= (new Date()).getTime();
    params.style="1";
    bindEvent();
    //showHint();

    cmp.dialog.loading(true);
    setTimeout("showContent()",500);
    //showContent();

});
function showContent(){
    $s.CapForm.showFormData ({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            parent.cmp.sui.s3scopeInit(params, ret);
            document.getElementById('frm1').contentWindow.serverPath=parent.cmp.origin;
            var form=ret.contentList[params.indexParam];
            formData=ret;
            document.getElementById('frm1').contentWindow.formData=formData;
            showPcform.contentList=ret.contentList;
            if(params.dataLoadedCallback){
                eval("parent."+params.dataLoadedCallback+"(showPcform)") ;
            }

            var html=form.contentHtml;
            html=html.substring(html.indexOf("</script>")+9);
            form.contentHtml="";

            if(form.extraMap.formJson){
                var formJson=JSON.parse(form.extraMap.formJson);
                form.tableList=formJson.tableList;
                form.pageSize=formJson.pageSize;
                form.unShowSubDataIdMap=formJson.unShowSubDataIdMap;
                form.id=formJson.id;
            }

            document.getElementById('frm1').contentWindow.form=form;
            $("#frm1").contents().find("#mainbodyHtmlDiv_0").html(html);
            $("#frm1").contents().find("#id").val(form.id);
            $("#frm1").contents().find("#createId").val(form.createId);
            $("#frm1").contents().find("#modifyId").val(form.modifyId);
            $("#frm1").contents().find("#moduleType").val(form.moduleType);
            $("#frm1").contents().find("#moduleId").val(form.moduleId);
            $("#frm1").contents().find("#contentType").val(form.contentType);
            $("#frm1").contents().find("#moduleTemplateId").val(form.moduleTemplateId);
            $("#frm1").contents().find("#contentTemplateId").val(form.contentTemplateId);
            $("#frm1").contents().find("#title").val(form.title);
            $("#frm1").contents().find("#rightId").val(form.rightId);
            $("#frm1").contents().find("#viewState").val(params.viewState);
            $("#frm1").contents().find("#contentDataId").val(form.contentDataId);


            addJs();

        },
        error:function(e){
            var cmpHandled = cmp.errorHandler(e);
            if (cmpHandled) {
                cmp.href.back();
            } else {
                parent.cmp.notification.alert(e.message,function(){
                    parent.cmp.href.back();
                }," ",cmp.i18n('showPcForm.ok'));
            }
        }
    });

}
function addJs(){
    if(curr<jsList.length){
        loadJS(jsList[curr], addJs);
    }else{

        setTimeout(function(){
            cmp.dialog.loading(false);
            if(formData.contentList[params.indexParam].contentType=="10"){
                $("#frm1").contents().find(".documents_penetration_16").css("display","none");
                $("#frm1").contents().find("img").each(function(){
                    var lowerSrcAtt = $(this).attr("src").toLowerCase();
                    if(lowerSrcAtt.indexOf("uploadfile.gif")!=-1
                        ||lowerSrcAtt.indexOf("selecetuser.gif")!=-1
                        ||lowerSrcAtt.indexOf("date.gif")!=-1
                        ||lowerSrcAtt.indexOf("uploadimage.gif")!=-1
                        ||lowerSrcAtt.indexOf("delete.gif")!=-1
                        ||lowerSrcAtt.indexOf("handwrite.gif")!=-1){
                        $(this).remove();
                    }
                });
            }
        },500);
    }
    curr+=1
}

function loadJS(url, success) {
    var script  = document.createElement('script');
    script.src =_unflowformpath+"/FlowForm/"+ url+buildversion;
    success = success || function () {};
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        }
    };
    document.getElementById('frm1').contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
}

//绑定图标事件
function bindEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        cmp.href.back();
    });

    if( document.querySelector("header").style.display!="none"){
        cmp.backbutton.push(function(){
            cmp.href.back();
        })
    }

}
function showHint(){
    //新建引导 获取本地缓存
    var isHit = cmp.storage.get("showPcForm_hit_flag");
    if(!isHit || isHit != "true"){
        var hitEle =  document.getElementById("backbutton_hint");
        hitEle.classList.remove("display_none");
        hitEle.querySelector(".btn")
            .addEventListener("tap", function(){
                cmp.storage.save("showPcForm_hit_flag","true");
                hitEle.classList.add("display_none");
            });
    }
}



