cmp.ready(function() {  

    document.title = cmp.i18n("portal.label.columnSelection");
    //加载图标库
    if(cmp.platform.CMPShell){
        var _v5Path = cmp.seeyonbasepath;
        window.parent._v5Path = _v5Path;
    } else {
        var _v5Path = "/seeyon"
    }
    cmp.asyncLoad.css([_v5Path+"/portal/icons/default/fonts/plane/iconfont.css"]);


    var portalId = localStorage.getItem("currentPortalId");
    var spaceId = localStorage.getItem("currentSpaceId");

    var sectiontplsJsUrl = _v5Path+"/portal/sections/tpl_mobile/sectiontpls_mobile.js"+$verstion;
    cmp.asyncLoad.js([sectiontplsJsUrl],function(){
        //下面基本上老方法
        sectionSelectionSort(portalId,spaceId);
 
        var _pageH = document.documentElement.clientHeight;
        document.getElementById("scroll").style.height = _pageH + "px";

        myScroll = cmp.listView("#scroll");
    });
    
});


//横竖屏切换的时候
cmp.event.orientationChange(function(){
    var _pageH = document.documentElement.clientHeight;
    document.getElementById("scroll").style.height = _pageH + "px";
    myScroll.refresh();
})

var sectionSelectionSort = function (portalId, spaceId, fun) {
    var sectionContainer;
    // 加载国际化
    // cmp.i18n.load(_portalPath + "/i18n/", "Portal", function() {
        //静态选择栏目页面
        // var static_selected_html =  '<header id="page_header" class="cmp-bar cmp-bar-nav cmp-flex-header cmp-after-line">' +
        //                                 '<div id="goBack" class="cmp-action-back cmp-header-left">' +
        //                                     '<span class="cmp-icon see-icon-v5-common-arrow-back"></span>' +
        //                                     '<span class="nav-text">返回</span>' +
        //                                 '</div>' +
        //                                 '<h1 class="cmp-title">栏目选择</h1>' +
        //                                 '<div class="cmp-header-right nav-icon-one"/>' +
        //                             '</header>' +
        //                             '<div class="canChooseSpace" style="height:60px;"></div>' +
        //                             '<div id="divSection">' +
        //                                 '<div class="choosedSection">' +
        //                                     '<div class="title selectedNum">' +
        //                                         '<span>已选栏目(0)</span>' +
        //                                     '</div>' +
        //                                     '<ul id="canChooseSpaceDetail" class="sectionMove">' +
        //                                     '</ul>' +
        //                                 '</div>' +
        //                                 '<div class="canChooseSection">' +
        //                                     '<div class="title">' +
        //                                         '<span>全部栏目</span>' +
        //                                     '</div>' +
        //                                     '<ul id="allSection" class="sectionMove">' +
        //                                     '</ul>' +
        //                                 '</div>' +
        //                             '</div>';

        //动态选择栏目页面
        var dynamic_selected_html = '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
                                    '<% var section = this[i]; %>' +
                                    '<li class="detailSection" id="<%=section.sectionName%>" name="<%=escapeStringToHTML(section.sectionDisplayName)%>" properties="<%=escapeStringToHTML(section.properties)%>">' +
                                        '<div class="sectionContent">' +
                                            '<div class="remove remove-show">' +
                                                '<span class="vportal vp-min"></span>' +
                                            '</div>' +
                                            '<span class="name" style="display: inline-block;width: 35%;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;"><%=escapeStringToHTML(section.sectionDisplayName)%></span>' +
                                            '<span class="drag-handle iconfont icon-wechat-menu"></span>' +
                                            '<% var properties = section.properties; %>' + 
                                            '<% var obj = JSON.parse(properties); %>' + 
                                            '<% if(obj.resourcesFunction != undefined){%>' +
                                                '<div class="add-sources" resState="1" style="float:right;width:55px;height:30px;border:1px solid #1f85ec;margin-top:5px;margin-right: 10px;line-height:30px;text-align:center;font-size:14px;color: #1f85ec;">' +
                                                    '<span>'+cmp.i18n("portal.label.source")+'</span>' +
                                                '</div>' +
                                            '<% } %>'+
                                            '<% if(obj.styleFunction != undefined){%>' +
                                            	'<% var displayNone = (obj.sections == "vreportAnalysisSection" && JSON.parse(obj["report_value:0"]).type == "0") ? "display:none;" : ""; %>' + 
                                                '<div class="add-style" style="float:right;width:55px;height:30px;border:1px solid #1f85ec;margin-top:5px;margin-right: 10px;line-height:30px;text-align:center;font-size:14px;color: #1f85ec;<%=displayNone%>">' +
                                                    '<span>'+cmp.i18n("portal.label.style")+'</span>' +
                                                '</div>' +
                                            '<% } %>'+
                                        '</div>' +
                                    '</li>' +
                                    '<% } %>';

        //动态所有栏目页面
        var dynamic_alternative_html =  '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
                                        '<% var section = this[i]; %>' +
                                        '<li class="detailSection" id="<%=section.sectionName%>" name="<%=escapeStringToHTML(section.sectionDisplayName)%>" properties="<%=escapeStringToHTML(section.properties)%>">' +
                                            '<div class="sectionContent">' +
                                                '<div class="add remove-show">' +
                                                    '<span class="vportal vp-btn-add"></span>' +
                                                '</div>' +
                                                '<span class="name"><%=escapeStringToHTML(section.sectionDisplayName)%></span>' +
                                            '</div>' +
                                        '</li>' +
                                        '<% } %>';

        var init = function () {
            // initHtml ();
            initSelectedSection();
            initAlternativeSection();
            // saveSection();
            pushEvent('canChooseSpaceDetail',false);
        }

        cmp.backbutton();
        cmp.backbutton.push(saveSectionCustomize);

        init();

        //页面初始化
        // function initHtml () {
        //     sectionContainer = document.createElement("div");
        //     sectionContainer.classList.add("Animated-Container");
        //     sectionContainer.classList.add("right-go");
        //     sectionContainer.classList.add("animated");
        //     sectionContainer.classList.add("cmp-active");
        //     sectionContainer.style.zIndex = 19;
        //     sectionContainer.style.overflow="auto";
        //     sectionContainer.innerHTML = cmp.tpl(static_selected_html, []);
        //     document.getElementsByTagName('body')[0].appendChild(sectionContainer);
        // }

        /*function saveSection(){
            document.querySelector("#goBack").addEventListener("tap",function(){
                saveSectionCustomize();
            });
        }*/
        //获取已选栏目
        function initSelectedSection(){
            var url = "/seeyon/rest/mobilePortal/getSelectedSection";
            var type = "POST";
            var data = {
                "spaceId":spaceId
            };
            spaceAjax(url, type,JSON.stringify(data) ,function(result){
                renderData(dynamic_selected_html, result.data, "canChooseSpaceDetail");
                renderSelectedNum(result.data.length);
                addRemoveEvtnt();
                addSourcesAndStyleEvent();
            });
        }
        //获取所有栏目
        function initAlternativeSection(){
            var url = "/seeyon/rest/mobilePortal/getAllCustomSection";
            var type = "GET";
            spaceAjax(url, type,null ,function(result){
                renderData(dynamic_alternative_html, result.data, "allSection");
                alternativeAddEvent();
            });
        }
        
        //保存选中栏目
        function saveSectionCustomize(){
            var selected = document.getElementById("canChooseSpaceDetail");
            var selectedResList = selected.getElementsByClassName("add-sources");
            for (var i=0;i<selectedResList.length;i++) {
                var resState = selectedResList[i].getAttribute("resState");
                if (resState == "0") {
                    var title = selectedResList[i].parentNode.getElementsByClassName("name")[0].innerText;
                    cmp.notification.alert(title+","+cmp.i18n("portal.label.chooseSource"));
                    return;
                }
            }
            var selectedList = selected.getElementsByClassName("detailSection");
            // if (selectedList.length == 0) {
            //     cmp.notification.alert("所选栏目不能为空");
            //     return;
            // }
            var data = {};
            data.portalId = portalId;
            data.spaceId = spaceId;
            data.fragments = [];
            for (var i=0;i<selectedList.length;i++) {
                var sectionProperties = selectedList[i].getAttribute("properties");
                var properties = {};
                var sectionList = {};
                var x = i;
                var y = 0;
                properties = JSON.parse(sectionProperties);
                sectionList.x = x;
                sectionList.y = y;
                sectionList.properties = properties;
                data.fragments.push(sectionList);
            }
            var url = "/seeyon/rest/mobilePortal/saveCustomSpace";
            var type = "POST";

            spaceAjax(url, type,JSON.stringify(data) ,function(result){
                //m3里面是从webview返回
                if(cmp.platform.CMPShell){
                    cmp.webViewListener.fire({
                        type:"saveSectionCustomizeCallBack",
                        data: result,
                        success:function(){
                            cmp.href.back();
                        },
                        error:function(){
                            cmp.href.back();
                        }
                    })
                }else{//非M3  直接后退  这里可能需要定位到具体空间 --- >   待验证，可能定位不到之前的空间
                    cmp.href.back();
                }
            });
        }

        //添加删除事件
        function addRemoveEvtnt(){
            var removeList = document.getElementsByClassName("remove");
            for (var i=0;i<removeList.length;i++) {
                removeList[i].addEventListener("tap",function () {
                    var selected = document.getElementById("canChooseSpaceDetail");
                    selected.removeChild(this.parentElement.parentElement);
                    renderSelectedNum(null);
                },false);
            }
        }

        //备选空间添加事件
        function alternativeAddEvent () {
            var addList = document.getElementById("allSection").children;
            for(var i = 0;i < addList.length;i++){
                addList[i].addEventListener("tap",function () {
                    var selected = document.getElementById("canChooseSpaceDetail");
                    createItem(selected,this);
                    renderSelectedNum(null);
                },false);
            }
        }

        function createItem (_id,_dom) {
            var sectionId = _dom.getAttribute("id");
            var sectionName = _dom.getAttribute("name");
            var properties = _dom.getAttribute("properties");
            var obj = JSON.parse(properties);
            var resourcesFunction = "";
            var styleFunction = "";
            if (obj.resourcesFunction != undefined) {
                resourcesFunction = 
                    '<div class="add-sources" resState="0" style="float:right;width:55px;height:30px;border:1px solid #1f85ec;margin-top:5px;margin-right: 10px;line-height:30px;text-align:center;font-size:14px;color: #1f85ec;">' +
                    '<span>'+cmp.i18n("portal.label.source")+'</span></div>';
            }
            if (obj.styleFunction != undefined) {
                styleFunction = '<div class="add-style" style="float:right;width:55px;height:30px;border:1px solid #1f85ec;margin-top:5px;margin-right: 10px;line-height:30px;text-align:center;font-size:14px;color: #1f85ec;">' +
                    '<span>'+cmp.i18n("portal.label.style")+'</span>' +
                    '</div>';
            }
            _id.innerHTML = _id.innerHTML + 
            '<li class="detailSection" id="'+sectionId+'" name="'+sectionName+'" properties="'+escapeStringToHTML(properties)+'">' +
                '<div class="sectionContent">' +
                    '<div class="remove remove-show">' +
                    '<span class="vportal vp-min"></span>' +
                    '</div>' +
                    '<span class="name" style="display: inline-block;width: 35%;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;">'+sectionName+'</span>' +
                    '<span class="drag-handle iconfont icon-wechat-menu"></span>' +
                    resourcesFunction + styleFunction+
                '</div>' +
            '</li>';
            //添加移除事件
            addRemoveEvtnt();
            addSourcesAndStyleEvent();
        }

        function addSourcesAndStyleEvent(){
            var sourcesList = document.getElementsByClassName("add-sources");
            for (var i=0;i<sourcesList.length;i++) {
                sourcesList[i].addEventListener("tap",function () {
                    var divDom = this.parentNode.parentNode;
                    var properties = divDom.getAttribute("properties");
                    var obj = JSON.parse(properties);

                    //数据来源
                    if (obj.resourcesFunction != undefined) {
                        // 表单类别特殊处理
                        var formType = "";
                        if (obj.sections == "formStatisticsGridSection4Vjoin") {
                            formType = "2,";
                        } else if (obj.sections == "formQueryResultSection4Vjoin") {
                            formType = "1,";
                        } else if (obj.sections == "formStatisticsChartSection4Vjoin") {
                            formType = "3,";
                        } else if (obj.sections == "vreportAnalysisSection") {//报表分析
                            var reportResource = obj["report_value:0"];
                            formType = "'"+reportResource + "',";
                        }

                        var resourcesFunction = obj.resourcesFunction;

                        
                        eval(resourcesFunction+'('+ formType +function(callbak){
                            addParamToProperties(callbak,obj,divDom);
                        }+')');
                    }

                },false);
            }

            var styleList = document.getElementsByClassName("add-style");
            for (var i=0;i<styleList.length;i++) {
                styleList[i].addEventListener("tap",function () {
                    var divDom = this.parentNode.parentNode;
                    var properties = divDom.getAttribute("properties");
                    var obj = JSON.parse(properties);
                    var reportType = "";
                    if (obj.sections == "vreportAnalysisSection") {//报表分析
                        var reportStyle = obj["columnstyle:0"];
                        reportType = reportStyle+",";
                    }

                    // 样式
                    if (obj.styleFunction != undefined) {
                        var styleFunction = obj.styleFunction;
                        eval(styleFunction+'('+ reportType + function(callbak){
                            addParamToProperties(callbak,obj,divDom);
                        }+')');
                    }
                },false);
            }
        }
        //渲染所选栏目数
        function renderSelectedNum(selectedNum) {
            if (selectedNum == null) {
                var selectedList = document.getElementById("canChooseSpaceDetail").getElementsByClassName("detailSection");
                selectedNum = selectedList.length;
            }
            var selectedNumDiv =document.querySelector(".selectedNum");
            selectedNumDiv.innerHTML = "<span>"+cmp.i18n('portal.label.selectedColumns')+"("+ selectedNum +")</span>";
        }

    // });

    var addParamToProperties = function (result,obj,divDom) {
        //报表分析 返回类型为0时,隐藏样式
        if (obj.sections == "vreportAnalysisSection" && result.report_value != undefined && result.report_value.type == "0") {
            divDom.firstElementChild.lastElementChild.style.display = "none";
            obj["columnstyle:0"] = "0";
        } else {
            divDom.firstElementChild.lastElementChild.style.display = "";
        }
        if (result.displayName != undefined) {
            var displayNameDom = divDom.firstElementChild.firstElementChild.nextElementSibling;
            displayNameDom.innerText = result.displayName;
            if (obj.sections == "vreportAnalysisSection") {
                obj["columnsName:0"] = result.displayName;
            }
        }
        for (var k in result) {
            if (obj[k+":0"] != undefined) {
                obj[k+":0"] = result[k];
                if (obj.sections == "vreportAnalysisSection" && k == "report_value") {
                    obj[k+":0"] = JSON.stringify(result[k]);
                }
                if (obj.sections == "formQueryResultSection4Vjoin") {//表单查询,修改其表单样式为列表
                    obj["showType:0"] = "sectionList";
                }
            }
        }
        var param = JSON.stringify(obj);
        //更改状态
        divDom.lastElementChild.getElementsByClassName("add-sources")[0].setAttribute("resState","1");
        divDom.setAttribute("properties",param);
    }
}