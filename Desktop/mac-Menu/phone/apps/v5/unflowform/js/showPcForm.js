var params={};
var formData={};
var content={};
var myscroll;
var jsList=[
    "i18n_plugin.js",
	"dev/new_style/m1-form-style.js",
    "dev/new_style/m1-newCalendar.js",
    "seeyon.ui.calendar-debug.js",
    //"dev/new_style/iscroll-zoom.js",
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
    "seeyon.ui.checkform-debug.js"
];

var curr=0;
var showPcform={};
var errInfo;
var disabledColor="#e8e8e8";
window.onload=function(){
    loadForm();
}

var loadForm = function(){
    console.log("pcformonload-"+new Date().getTime());
    if(parent.cmp.language=="en"){
        jsList.push("i18n_en.js")
    }else if(parent.cmp.language=="zh-CN"){
        jsList.push("i18n_zh_CN.js")
    }else{
        jsList.push("i18n_zh_TW.js")
    }
    if(parent.cmp.storage.get("pcform_params",true)!=null){
        params=parent.cmp.parseJSON(parent.cmp.storage.get("pcform_params",true));
        parent.cmp.storage.delete("pcform_params",true);
        document.querySelector(".cmp-content").style.top="0px";
    }else{
        parent.cmp.backbutton();
        params=parent.cmp.href.getParam();
    }

    document.getElementById("scroll").style.height=(window.innerHeight || document.body.clientHeight)+'px';
    document.getElementById("scroll").style.overflow="hidden";

    params.needContent="true";
    params.h5Tag= (new Date()).getTime();
    params.style="1";
    if(cmp.storage.get("unflowform_contentDataId",true)){
        params.contentDataId=cmp.storage.get("unflowform_contentDataId",true);
    }
    top.cmp.dialog.loading(true);
    console.log(new Date().getTime());
    showContent();
};

//加载正文
function showContent(){
    parent.$s.CapForm.showFormData ({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success: function (ret) {
            //if(!document.getElementById('frm1').contentWindow){
            //    return;
            //}
            if (parent.LazyUtil) {
                parent.LazyUtil.addLoadedFn("lazy_form", function () {
                    parent.cmp.sui.s3scopeInit(params, ret);
                    errInfo = parent.cmp.sui.getErrorInfo();
                    parent.cmp.sui.clearCache(params, true);
                });
            } else {
                parent.cmp.sui.s3scopeInit(params, ret);
                errInfo = parent.cmp.sui.getErrorInfo();
                parent.cmp.sui.clearCache(params, true);
            }
            //document.getElementById('frm1').contentWindow.serverPath=parent.cmp.origin;
            serverPath = parent.cmp.origin;
            content = ret.contentList[params.indexParam];
            formData = ret;
            showPcform.contentList = ret.contentList;
            //if(params.dataLoadedCallback){
            //    eval("parent."+params.dataLoadedCallback+"(showPcform)") ;
            //}

            var html = content.contentHtml;
            html = html.substring(html.indexOf("</script>") + 9);
            html = html.replace(new RegExp(/(<script>)/g), "&lt;script&gt;");
            content.contentHtml = "";

            //var form={};
            if (content.extraMap.formJson) {
                form = JSON.parse(content.extraMap.formJson);
            }
            form.contentDataId = content.contentDataId;
            form.contentTemplateId = content.contentTemplateId;
            form.contentType = content.contentType;
            form.createId = content.createId;
            form.modifyId = content.modifyId;
            form.moduleId = content.moduleId;
            form.moduleType = content.moduleType;
            form.rightId = content.rightId;
            console.log("dataloaded-" + new Date().getTime());
            //top.cmp.dialog.loading(false);

            //document.getElementById('frm1').contentWindow.form=form;
            $("#mainbodyHtmlDiv_0").html(html);
            setContentSize();
            createScroll();

            //document.getElementById('frm1').contentWindow.contentScroll();
            $("#id").val(form.id);
            $("#createId").val(form.createId);
            $("#modifyId").val(form.modifyId);
            $("#moduleType").val(form.moduleType);
            $("#moduleId").val(form.moduleId);
            $("#contentType").val(form.contentType);
            $("#moduleTemplateId").val(form.moduleTemplateId);
            $("#contentTemplateId").val(form.contentTemplateId);
            $("#title").val(form.title);
            $("#rightId").val(form.rightId);
            $("#viewState").val(params.viewState);
            $("#contentDataId").val(form.contentDataId);
            console.log("addjs_start-" + new Date().getTime());
            addJs();
        },
        error: function (e) {
            var cmpHandled = cmp.errorHandler(e);
            if (cmpHandled) {
                cmp.href.back();
            } else {
                parent.cmp.notification.alert(e.message,function(){
                    parent.cmp.href.back();
                }," ","确定");
            }
        }
    });

}
//添加表单渲染JS
function addJs(){
    if(curr<jsList.length){
        loadJS(jsList[curr], addJs);
    }else{
        console.log("addjs_end-"+new Date().getTime());
        //document.getElementById('frm1').contentWindow.disableEditInput();
        disableEditInput();
        setTimeout(function(){
            if(errInfo && errInfo.indexOf("请确认是否继续")==-1){//刻盘当天，暂这样判断，改动小
                parent.cmp.notification.alert(errInfo,null,"提示","确定");
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
    //document.getElementById('frm1').contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
    document.getElementsByTagName('head')[0].appendChild(script);
}

//绑定图标事件
function bindEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        parent.cmp.href.back();
    });

    if( document.querySelector("header").style.display!="none"){
        parent.cmp.backbutton.push(function(){
            parent.cmp.href.back();
        })
    }

}

window.onresize=function(){
    //document.getElementById("frm1").style.height=document.getElementById("scroll").style.height;
    //document.getElementById("frm1").style.width=(window.innerWidth || document.body.clientWidth)+'px';
    setContentSize();
    myscroll.refresh();
};

function setContentSize(){
    var parentWindow = parent.window;
    var frm1W,frm1H;
    if(parentWindow.document.getElementById("m3_v5_form_source_iframe")){
        frm1W = parentWindow.document.getElementById("m3_v5_form_source_iframe").style.width;
        frm1H = parentWindow.document.getElementById("m3_v5_form_source_iframe").style.height;
    }else{
        frm1W = parentWindow.document.getElementById("contentFrame").style.width;
        frm1H = parentWindow.document.getElementById("contentFrame").style.height;
    }
    document.getElementById("scroll").style.height=frm1H;
    document.getElementById("scroll").style.overflow="hidden";

    document.getElementById("wrapper").style.height=frm1H;//适配小强意见区的margin-top 10px
    document.getElementById("wrapper").style.width=frm1W;
}
function contentScroll(){
    setContentSize();
    if(params.viewState !="2"){
        myscroll.refresh();//createScroll();
        console.log("pcformend-"+new Date().getTime());
        top.cmp.dialog.loading(false);
        setTimeout(function(){
            disableEditInput();
            setTimeout(function(){
                disableEditInput();
            },5000);
        },1000);
    }else {
        myscroll.refresh();//createScroll();
        console.log("pcformend-"+new Date().getTime());
        top.cmp.dialog.loading(false);
//                setTimeout(function() {
//                    createScroll();
//                },3000);
    }
    if(params.dataLoadedCallback){
        top.cmp.dialog.loading(false);
        console.log("callback-"+new Date().getTime());
        eval("top."+params.dataLoadedCallback+"(showPcform)") ;
    }else{
        top.cmp.dialog.loading(false);
        console.log("callback-"+new Date().getTime());
    }
    lbsHighlight ();
}
function createScroll(){
    var percent=document.getElementById("wrapper").offsetWidth/document.getElementById("mainbodyHtmlDiv_0").offsetWidth;
    var scrollEndActionTime = 0,scrollYMax = false;
    myscroll=new IScroll("#wrapper",{zoom:true,scrollX: true,
        scrollY: true,
        mouseWheel: true,
        zoomStart:1,
        zoomMin:percent,
        preventDefaultException:{tagName: /^(INPUT|SPAN|IMG|A|TEXTAREA|SELECT)$/ },
        zoomMax:1,
        mouseWheel: true,
        wheelAction: 'zoom',
        onScrollEnd: function () {
            // top.cmp.notification.toast("已经到底了","center");
        }
    });
    myscroll.on('scrollEnd', function(){
        if(params.onScrollEnd){
            if(scrollYMax) {
                if(scrollEndActionTime > 0) {
                    console.log('bottom');
                    eval("top."+params.onScrollEnd+"()");
                    scrollEndActionTime = 0;
                }else {
                    scrollEndActionTime ++;
                }
            }
        }
    });

    myscroll.on("scroll", function(e){
        if(params.onScrollTop){
            eval("top."+params.onScrollTop+"(-myscroll.y, myscroll.directionY)");
        }
        if(myscroll.y <= (myscroll.maxScrollY-10)) {
            scrollYMax = true;
        }else {
            scrollYMax = false;
        }
    });
    myscroll.zoom(percent);

    var tsY,tsT,wrapperMove = false;
    document.getElementById("wrapper").addEventListener("touchstart",function(e){
        if($("#img").find(e.srcElement).length==0){
            $("#img").hide();
        }
        if(myscroll.scale < 1 && e.targetTouches.length == 1) {
            tsY = e.touches[0].pageY;
            tsT = e.timeStamp;
            wrapperMove = true;
        }else {
            wrapperMove = false;
        }
    });
    document.getElementById("wrapper").addEventListener("touchend",function(e){
        var teY = e.changedTouches[0].pageY;
        var teT = e.timeStamp;
        if(wrapperMove == true) {
            if((teY - tsY) > 10 && (teT - tsT) >100 && myscroll.y == 0){
                if(params.onScrollTop){
                    eval("top."+params.onScrollTop+"(-5, -1)");
                }
            }
        }
    });
}


function disableEditInput(){
    $("img[src^=ic_form]").each(function(){
        if($(this).attr("src")!="ic_form_erweima.png"
            &&  $(this).attr("src")!="ic_form_delete.png"
            && $(this).attr("src") != "ic_form_copy.png"
            && $(this).attr("src") != "ic_form_new.png"
            && $(this).attr("src") != "ic_form_ass_form.png"
            && $(this).attr("src") != "ic_form_delete_row.png"){
            $(this).remove();
        }
    });
    //屏蔽计算控件及重复表参与计算不允许添加删除行
    var formson=formData.results.metadata.children;
    $("input[incondition='true'],input[incalculate='true'],select[incondition='true'],select[incalculate='true'],textarea[incondition='true'],textarea[incalculate='true'],span[incondition='true'],span[incalculate='true']").each(function(){
        var input=$(this);
        var validate=input.attr("validate");

        if(input.css("display")=='none' ){
            input=$("#"+input.attr("id")+"_txt");
        }

        if(validate){
            if(validate.indexOf("notNull:true")==-1 && input[0].tagName!="SPAN"){ //非必填的置灰
                input.css("background", disabledColor);
            }
        }

        input.attr("readonly","readonly").disable();

        for(key in formson) {
            if (key.indexOf("formson_")!=-1) {
                if(formson[key]["fieldInfo"][input.attr("id").replace("_txt","")]){ //重复表中找到此字段，禁用重复表添加删除
                    input.closest("table").attr("allowAddDelete",false);
                }
            }
        }
    });

    var spans = $("span[id$='_span']");
    for(var i=0;i<spans.length;i++){
        var jqField = $(spans[i]);
        setDisabledInputColor(jqField);
    }

}

function setDisabledInputColor(jqField){
    var editTag=jqField.hasClass(editClass);
    var browseTag=jqField.hasClass(browseClass);
    var designTag=jqField.hasClass(designClass);
    var editAndNotNull = jqField.hasClass("editableSpan");
    var fieldVal =jqField.attr("fieldVal");
    var idStr = jqField.attr("id").split("_")[0];
    if(fieldVal==undefined || browseTag || designTag || editAndNotNull){
        return true;
    }else{
        fieldVal = $.parseJSON(fieldVal);
        $.extend(fieldVal,{"editTag":editTag});
    }
    //TODO  解决转发时  ios7 IPhone 不换行的情况
    var inputType = fieldVal.inputType;
    if(typeof collForward != "undefined"){
        if(inputType =="textarea"&& collForward == "true" &&clientType==C_sClientType_Iphone) {
            inputType = "text";
        }

    }
    switch(inputType) {
        case "text":
        case "textarea":
        case "select":
        case "checkbox":
        case "select":
        case "radio":
        case "linenumber":
            if(inputType=="checkbox"){
                var input=jqField.find("input");
                if(input.width()<input.height()){
                    input.width(input.height());
                }
            }
            break;
        case "member":
        case "account":
        case "department":
        case "post":
        case "level":
            jqField.find("input").css("background-color", disabledColor);
            break;
        case "multimember":
        case "multiaccount":
        case "multidepartment":
        case "multipost":
        case "multilevel":
        case "customplan":
            jqField.find("textarea").css("background-color", disabledColor);
            break;
        case "attachment":
        case "document":
            var dispDiv;
            if (fieldVal.inputType == 'attachment') {
                dispDiv = jqField.find("div[id^='attachmentArea']");
            } else {
                dispDiv = jqField.find("div[id^='attachment2Area']");
            }
            jqField.find(".ico16").hide();
            dispDiv.css("background-color", disabledColor);
            if(dispDiv.height()<22){
                dispDiv.css("height","22px");
            }
            break;
        case "image":
            var dispDiv = jqField.find("div[id^='attachmentArea']");
            if(dispDiv){
                dispDiv.css("background-color", disabledColor).css({"min-height":"15px"});
                if(dispDiv.width()==0){
                    dispDiv.width(dispDiv.parent().closest("td").width());
                }
            }
            break;
        case "project":
            var input=$("input", jqField);
            input.css("background-color", disabledColor);
            if(input.height()<22){
                input.css("height","22px");
            }
            break;
        case "lable":
            var labelField = jqField.find("#" + idStr);
            labelField.css("background-color", disabledColor);
            if (labelField.height()<22){
                labelField.css("height","22px");
            }
            break;
        case "externalwrite-ahead":
            jqField.find("input[readonly]").css("background-color", disabledColor);
            break;
        case "relation":
            jqField.find("#" + idStr).css("background-color", disabledColor);
            break;
        case "date":
        case "datetime":
            var textInput = jqField.find("#" + idStr);
            textInput.trigger("change");
            textInput.attr("disabled", true);
            textInput.css("background-color", disabledColor);
            break;
        case "handwrite":
            jqField.css("background-color", disabledColor);
            break;
        case "querytask":
        case "exchangetask":
            jqField.find("#" + idStr).css("background-color", disabledColor);
            break;
        case "flowdealoption":
            jqField.find("#" + idStr).css("background-color", disabledColor);
            break;
        case "outwrite":
            jqField.find("#" + idStr).css("background-color", disabledColor);
            break;
        case "mapphoto":
            jqField.find("#" + idStr).css("background-color", disabledColor);
            if(jqField.find("img").length==0){
                jqField.find("#" + idStr).show();
            }
            break;
        case "mapmarked":
            jqField.find("span[id='" + idStr + "']").css("background-color", disabledColor);
            jqField.find("input[id='" + idStr + "']").css({
                "padding-left": "0px",
                "padding-right": "0px",
                "width": "97%"
            });
            break;
        case "maplocate":
            jqField.find("#" + idStr + "_txt").css("background-color", disabledColor);
            break;
        default :
    }
}
function lbsHighlight () {
    $("span[fieldval*='maplocate'],span[fieldval*='mapmarked']").addClass('lbs-highlight');
}

//预提交
showPcform.preSubmitData=function(option,successCallBack, failedCallback) {
    if(typeof (preSubmitData)=="function" ){
        preSubmitData(option,successCallBack, failedCallback);
    }else{
        failedCallback("表单未加载完成");
    }
}

//提交数据库
showPcform.saveContent=function(successCallBack, failedCallBack) {
    if(typeof (preSubmitData)=="function" ) {
        saveContent(params.moduleId, showPcform.contentList[params.indexParam].title, successCallBack, failedCallBack);
    }else{
        failedCallBack("表单未加载完成");
    }
}

//检查表单是否允许在原表单处理
// 传入参数 s3scope
showPcform.isAllowSubmit=function(){
    var flag=true;
    var master={};
    $.extend(master,formData.results.data.master);
    var children=formData.results.data.children;
    for(son in children){
        if(children[son]["data"] && children[son]["data"][0]){
            $.extend(master,children[son]["data"][0]);
        }
    }

    var fieldInfo={};
    $.extend(fieldInfo, formData.results.metadata.fieldInfo);
    var children_fieldInfo=formData.results.metadata.children;
    for(son_fieldInfo in children_fieldInfo){
        $.extend(fieldInfo,children_fieldInfo[son_fieldInfo]["fieldInfo"]);
    }

    for(key in master){
        if(typeof (master[key])=="object"){
            var currfield=master[key];
            if(currfield!=null && currfield.notNull==true){ //必填项，但必填项在以下支持范围，且不参与计算时，支持新建、处理提交
                var field=fieldInfo[key];
                if(field){ //fieldInfo里面没有此字段，表单此字段是隐藏，所以不用管规则
                    //if(field.finalInputType=="text" || field.finalInputType=="textarea" || field.finalInputType=="checkbox" ||
                    //    field.finalInputType=="radio" || field.finalInputType=="select" || field.finalInputType=="barcode")
                    //{
                    if(field.finalInputType=="radio"){
                        if((field.inCalc || field.inCondition) && $("input[name="+field.name+"]:checked").length==0){//参与计算或者参与条件则不允许提交
                            flag=false;
                            break;
                        }
                    }else{
                        if((field.inCalc || field.inCondition) && !$("#" + field.name).val()){//参与计算或者参与条件则不允许提交
                            flag=false;
                            break;
                        }
                    }



                    //}else{//必填项，且必填项不在上面的支持编辑范围
                    //    flag=false;
                    //    break;
                    //}
                }
            }
        }
    }
    console.log("allowSubmit:"+flag);
    return flag;
}
//协同调整正文区高度后通知，因IOS下iframe高度调小无效，添加此方法适配。
showPcform.resetIframeSize=function() {
    setContentSize();
    myscroll.refresh();
}
showPcform.refreshWhenWebViewShow=function(){
    parent.cmp.sui.s3scopeInit(params, formData);
    errInfo = parent.cmp.sui.getErrorInfo();
    parent.cmp.sui.clearCache(params, true);

    if(errInfo && errInfo.indexOf("请确认是否继续")==-1){
        parent.cmp.notification.alert(errInfo,null,"提示","确定");
    }
}





