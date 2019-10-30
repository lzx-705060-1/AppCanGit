var spaceSelectionSort = function(portalId, fun) {
    // 加载国际化
    cmp.i18n.load(_portalPath + "/i18n/", "Portal", function() {
        var _spaceList = null;
        //静态选择空间页面
        var static_selected_html =  '<header id="page_header" class="cmp-bar cmp-bar-nav cmp-flex-header cmp-after-line">' +
                                        '<div id="goBack" class="cmp-action-back cmp-header-left">' +
                                            '<span class="cmp-icon see-icon-v5-common-arrow-back"></span>' +
                                            '<span class="nav-text">返回</span>' +
                                        '</div>' +
                                        '<h1 class="cmp-title">空间排序</h1>' +
                                        '<div class="cmp-header-right nav-icon-one"/>' +
                                    '</header>' +
                                    '<div class="canChooseSpace" style="margin-top: 64px;">'+
                                        '<span class="chooseTitle">选择空间</span>' +
                                    '</div>' +
                                    '<ul id="canChooseSpaceDetail" class="detailList"  style="list-style: none;"></ul>' +
                                    '<div class="canChooseSpaceMore">' +
                                    '<span>点击添加更多空间</span></div>' +
                                    '<ul id="canChooseSpaceDetailMore" class="detailList"></ul>';
        //动态选择空间页面
        var dynamic_selected_html = '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
                                    '<% var space = this[i]; %>' +
                                    '<li class="detailItem" id="<%= space.spaceId%>" name="<%= escapeStringToHTML(space.spaceName)%>" iconUrl="<%= escapeStringToHTML(space.iconUrl)%>" spacePath="<%= escapeStringToHTML(space.spacePath)%>" spaceType="<%= escapeStringToHTML(space.spaceType)%>">'  +
                                    '<div class="detailItemContent">' +
                                    '<div class="remove remove-show" style="width: 15px;color: #fff;">' +
                                    '<span>-</span>' +
                                    '</div>' +
                                    '<div class="elpse">' +
                                    '<span><%= escapeStringToHTML(space.spaceName)%></span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>' +
                                    '<% } %>';

        //动态待选择页面
        var dynamic_alternative_html = '<% for(var i = 0,len = this.length;i < len; i++){ %>' +
                                        '<% var space = this[i]; %>' +
                                        '<li class="detailItem" id="<%= space.spaceId%>" name="<%= escapeStringToHTML(space.spaceName)%>" iconUrl="<%= escapeStringToHTML(space.iconUrl)%>" spacePath="<%= escapeStringToHTML(space.spacePath)%>" spaceType="<%= escapeStringToHTML(space.spaceType)%>">' +
                                        '<div class="detailItemContent">' +
                                        '<div  class="elpse">' +
                                        '<span><%= escapeStringToHTML(space.spaceName)%></span>' +
                                        '</div>' +
                                        '</div>' +
                                        '</li>' +
                                    	'<% } %>';

        document.querySelector("#spaceSelectionSort").classList.add('cmp-active');
        document.querySelector("#spaceSelectionSort").style.display = "";
        document.querySelector("#spaceSelectionSort").innerHTML = static_selected_html;

        cmp.backbutton();
        cmp.backbutton.push(closePage);
        
        init();

        function init () {
            //关闭图层
            document.querySelector("#goBack").addEventListener("tap",function(){
                saveSpaceCustomize();
            });
            getSelectedSpace();
            getAlternativeSpace();
        }

        //删除空间
        var removeSpace = function () {
            var selected = document.getElementById("canChooseSpaceDetail");
            var alternative = document.getElementById("canChooseSpaceDetailMore");
            createItem(alternative,this.parentElement.parentElement,"none","");
            selected.removeChild(this.parentElement.parentElement);
        }

        //添加空间
        var spaceAdd = function () {
            var selected = document.getElementById("canChooseSpaceDetail");
            var alternative = document.getElementById("canChooseSpaceDetailMore"); 
            createItem(selected,this,"","add");
            alternative.removeChild(this);
        }

        //添加删除事件
        function addRemoveEvtnt(_isBind){
            var removeList = document.getElementsByClassName("remove-show");
            for (var i=0;i<removeList.length;i++) {
                if (_isBind) {
                    removeList[i].addEventListener("tap",removeSpace,false);
                } else {
                    removeList[i].removeEventListener("tap",removeSpace,false);
                }
            }
        }

        //备选空间添加事件
        function alternativeAddEvent (_isBind) {
            var el1 = document.getElementById('canChooseSpaceDetailMore');
            for(var i = 0;i < el1.children.length;i++){
                if (_isBind) {
                    //添加绑定
                    el1.children[i].addEventListener("tap",spaceAdd,false);
                } else {
                    //解除绑定
                    el1.children[i].removeEventListener("tap",spaceAdd,false);
                }
                
            }
        }
        
        function createItem(_id,_dom,_style,_type) {
        	var spaceId = _dom.getAttribute("id");
        	var sapceName = _dom.getAttribute("name");
        	var iconUrl = _dom.getAttribute("iconUrl");
            var spacePath = _dom.getAttribute("spacePath");
            var spaceType = _dom.getAttribute("spaceType");
            var removeFlag = "";
            if (_type == "add") {
                    removeFlag = '<div class="remove remove-show" style="width: 15px;color: #fff;display: '+_style+'">'+
                                '<span>-</span></div>';
                }
            _id.innerHTML = _id.innerHTML + '<li class="detailItem" id="' + spaceId + '" name="' + sapceName + '" iconUrl="' + iconUrl + '" spacePath="' + spacePath + '" spaceType="' + spaceType + '">'+
                '<div class="detailItemContent">'+ removeFlag +
                '<div class="elpse">'+
                '<span>'+ sapceName +'</span>'+
                '</div>'+
                '</div>'+
                '</li>';

            if (_type == "add") {
                var alternative = document.getElementById("canChooseSpaceDetail");
                var removeFlagList = alternative.getElementsByClassName("remove-show");
                for (var i=0;i<removeFlagList.length;i++) {
                    removeFlagList[i].addEventListener("tap",removeSpace,false);
                }
            } else {
                var selected = document.getElementById("canChooseSpaceDetailMore");
                var selectedList = selected.getElementsByClassName("detailItem");
                for (var i=0;i<selectedList.length;i++) {
                    selectedList[i].addEventListener("tap",spaceAdd,false);
                }
            }
        }

        function getSelectedSpace(){
            var url = "/seeyon/rest/mobilePortal/spaces/" + portalId;
            var type = "GET";
            spaceAjax(url, type, null ,function(result){
                renderData(dynamic_selected_html, result.data.data, "canChooseSpaceDetail");
                pushEvent('canChooseSpaceDetail',false);
                addRemoveEvtnt(true);
            });
        }

        function getAlternativeSpace(){
            var url = "/seeyon/rest/mobilePortal/getAlternativeSpace";
            var type = "POST";
            var data = {
                "portalId":portalId
            };
            spaceAjax(url, type,JSON.stringify(data) ,function(result){
                renderData(dynamic_alternative_html, result.data, "canChooseSpaceDetailMore");
                alternativeAddEvent(true);
            });
        }

        function saveSpaceCustomize() {
            //获取已选空间
            var selected = document.getElementById("canChooseSpaceDetail");
            var selectedList = selected.getElementsByClassName("detailItem");
            if (selectedList.length == 0) {
                cmp.notification.alert("所选空间不能为空");
                return;
            }
            var data = {};
            data.typeId = portalId;
            var spaceList = [];
            for (var i=0;i<selectedList.length;i++) {
                var spaceId = selectedList[i].getAttribute("id");
                var spaceName = selectedList[i].getAttribute("name");
                var iconUrl = selectedList[i].getAttribute("iconUrl");
                var spacePath = selectedList[i].getAttribute("spacePath");
                var spaceType = selectedList[i].getAttribute("spaceType");
                var space = {};
                space.spaceId = spaceId;
                space.spaceName = spaceName;
                space.iconUrl = iconUrl;
                space.spacePath = spacePath;
                space.spaceType = spaceType;
                spaceList.push(space);
            }

        	data.customizeValue = JSON.stringify(spaceList);
        	//保存个性化空间设置
        	var url = "/seeyon/rest/mobilePortal/saveSpaceCustomize";
            var type = "POST";
            spaceAjax(url, type,JSON.stringify(data) ,function(result){
                if (result.code == "200") {
                    _spaceList = result.data;
                    closePage ();
                }
            });
        }

        function closePage () {
            document.querySelector("#spaceSelectionSort").innerHTML = "";
            document.querySelector("#spaceSelectionSort").style.display = "none";
            cmp.backbutton.pop();
            fun(_spaceList);
        }
    });
};

//拖动排序
function pushEvent(_id,_destroy){
    var el = document.getElementById(_id);
    var sortable = Sortable.create(el,{});
    if (_destroy) {
        sortable.destroy();
    }
}

//rest接口以ajax方式请求
function spaceAjax (url,type,data,callBack) {
    var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
    var _spaceUrl = replaceAjaxUrl(url);
    cmp.ajax({
        type: type,
        url: _spaceUrl,
        data: data,
        dataType: "json",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        repeat: false, // 当网络掉线时是否自动重新连接
        success: function(result) {
            callBack(result);
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                // cmp处理了这个错误
            } else {
                // customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}

//页面渲染
function renderData(dynamic_html, data, domId) {
    var html = cmp.tpl(dynamic_html, data);
    var content_dom = document.getElementById(domId);
    content_dom.innerHTML = content_dom.innerHTML + html;
}