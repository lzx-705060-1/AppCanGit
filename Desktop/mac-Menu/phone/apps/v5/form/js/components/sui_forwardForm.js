/**
 * Created by yangchao on 2016/12/20.
 */

(function ($, doc) {
    $.sui = $.sui || {};

    var formRoot = '';
    //原表单转发的处理逻辑=================->
    $.sui.renderForwardForm = function (options, root) {
        formRoot = root;
        if (options.containerId ) {
            var container=document.getElementById(options.containerId);
            if(container) {
                var _width=container.offsetWidth+"px";
                var _height=container.offsetHeight+"px";
                container.innerHTML = '<iframe id="contentfrm" style="width: '+_width+';height: '+_height+';overflow: hidden;border: none;" ></iframe>';
                var content_Frame = document.getElementById("contentfrm");
                content_Frame.onload = function () {
                    content_Frame.contentWindow.document.getElementById("mainbodyHtmlDiv_0").innerHTML = s3scope.contentList[0].contentHtml;
                    if(options.onScroll){
                        content_Frame.contentWindow.onScroll=options.onScroll;
                    }
                    if(options.onScrollBottom){
                        content_Frame.contentWindow.onScrollBottom=options.onScrollBottom;
                    }
                    content_Frame.contentWindow.serverPath=cmp.origin;
                    var form=s3scope.contentList[0];
                    content_Frame.contentWindow.formData=s3scope;
                    if(form.extraMap.formJson){
                        var formJson=JSON.parse(form.extraMap.formJson);
                        form.tableList=formJson.tableList;
                        form.pageSize=formJson.pageSize;
                        form.unShowSubDataIdMap=formJson.unShowSubDataIdMap;
                        form.id=formJson.id;
                        content_Frame.contentWindow.document.getElementById("#id").value=form.id;
                    }
                    content_Frame.contentWindow.form=form;
                    _addJs(content_Frame);
                };
                var url = formRoot + '/forwardForm/content.html';
                if(cmp.platform.CMPShell){
                    var tempParam = {
                        "url" : url,
                        success : function(ret){
                            var _url = ret.localUrl;
                            content_Frame.setAttribute("src", _url);
                        },
                        error : function(e){
                            _this.isLoading = false;
                            console.log("读取iframe地址失败");
                        }
                    }
                    cmp.app.getLocalResourceUrl(tempParam);
                }else{
                    content_Frame.setAttribute("src", url);
                }
            }
        }
    }
    var curr=0;
    var formData={};
    var jsList=["jquery-debug.js",
        "dev/new_style/m1-form-style.js",
        "dev/new_style/m1-newCalendar.js",
        "seeyon.ui.calendar-debug.js",
        "dev/new_style/iscroll-zoom.js",
        "m1-global-debug.js",
        "jquery.json-debug.js",
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
    function _addJs(iframe){
        if(curr<jsList.length){
            _loadJSForIframe(iframe,jsList[curr], _addJs);
        }else{
            setTimeout(function(){
                cmp.dialog.loading(false);
                //转发的表单隐藏图标
                var icons=iframe.contentWindow.document.querySelectorAll(".documents_penetration_16");
                [].forEach.call(icons,function(icon){
                    icon.css("display","none");
                });
                var imgs=iframe.contentWindow.document.querySelectorAll("img");
                [].forEach.call(imgs,function(img){
                    var lowerSrcAtt = img.getAttribute("src").toLowerCase();
                    if(lowerSrcAtt.indexOf("uploadfile.gif")!=-1
                        ||lowerSrcAtt.indexOf("selecetuser.gif")!=-1
                        ||lowerSrcAtt.indexOf("date.gif")!=-1
                        ||lowerSrcAtt.indexOf("uploadimage.gif")!=-1
                        ||lowerSrcAtt.indexOf("delete.gif")!=-1
                        ||lowerSrcAtt.indexOf("handwrite.gif")!=-1){
                        img.css("display","none");
                    }
                });
            },500);
        }
        curr+=1
    }

    function _loadJSForIframe(iframe,url, success) {
        var script  = document.createElement('script');
        script.src =formRoot+"/forwardForm/"+ url;
        success = success || function () {};
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                success(iframe);
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        };
        iframe.contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
    }
    //原表单转发的处理逻辑=================!!

})(cmp, document);