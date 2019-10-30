var common='/seeyon/m3/apps/v5/commons';
var myself = {};
(function () {
    var privated = 'feild_8586040726273737290';

    myself.dynamicLoading = {
        css: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        js: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        }
    }

    myself.init = function (adaptation) {
        cmp.ajax({
            type: 'post',
            url: cmp.seeyonbasepath +
            "/rest/cap4/formCreditquery/checkServiceUsable",
            dataType: 'JSON',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Accept-Language": "zh-CN",
                "Content-Type": "application/json; charset=utf-8",
                "token": cmp.token
            },
            success: function (data) {
                if (cmp.platform.CMPShell) {
                    data = JSON.parse(data);
                } else {
                    data = data;
                }
                init(adaptation,data.usable);
            },
            error: function () {
                init(adaptation,0);
            }
        });
    };
    myself.appendChildDom = function (adaptation, messageObj, privateId,usable) {
        switch ('button') {
            case 'button':
                myself.customButton(adaptation, messageObj, privateId,usable);
                break;
            default:
        }
    };
    //自定义控件渲染核心
    myself.customButton = function (adaptation, messageObj, privateId,usable) {
        //当权限是hide时，原样表单输出***，轻表单输出 ""
        if (messageObj.auth === 'hide') {
            if (!messageObj.formdata.rawData.viewInfo.viewContent.skin) {
                var dom_hide = '<section class="cap4-text is-one"><div class="cap4-text__left" id="text_left_' + privateId + '"></div><div class="cap4-text__right">' +
                    '<div class="cap4-text__browse">***</div>' +
                    '</div></section>';
                document.querySelector('#' + privateId).innerHTML = dom_hide;
                return;
            } else {
                document.querySelector('#' + privateId).innerHTML = "";
                return;
            }
        }

        //根据是否有skin判断是否为原样表单，构造对应的html
        var domStructure = "";
        //原样表单
        if (!messageObj.formdata.rawData.viewInfo.viewContent.skin) {
            //初始化原样表单dom
            domStructure = initSourceDom(privateId, messageObj.auth,usable);
        } else {
            //出事化轻表单
            domStructure = initM3Dom(privateId, messageObj.extra,usable);
        }
        //生成dom
        document.querySelector('#' + privateId).innerHTML = domStructure;

        //当html中没有searchDiv时，在body中appenchild一个searchDiv
        if (!document.querySelector("#searchDiv")) {
            var searchDiv = document.createElement('div');
            searchDiv.id = 'searchDiv';
            document.getElementsByTagName("body")[0].appendChild(searchDiv);
            document.querySelector('#searchDiv').innerHTML = initSearchDom();
        }

        //增加查询按钮监听
        document.querySelector('#edit_receiver' + privateId).addEventListener('tap', function () {
            openNewPage(privateId, adaptation.url_prefix, messageObj.formdata.rawData.viewInfo.viewContent.skin, adaptation, messageObj);
        });




        //初始化列名，原样表单时不展示列名
        if (messageObj.formdata.rawData.viewInfo.viewContent.skin) {
            document.querySelector('#text_left_' + privateId).innerHTML = messageObj.display;
        }

        //设置必填样式，原样表单
        if (messageObj.isNotNull == "1") {
            document.getElementById("section_" + privateId).setAttribute("class", "cap4-text is-one is-must");
            if (messageObj.formdata.rawData.viewInfo.viewContent.skin) {
                document.getElementById("real_" + privateId).setAttribute("style", "background:" + messageObj.extra.isNotNullBg + ";");
            }
        }
        //当控件有值时处理必填样式
        if (messageObj.value) {
            if (messageObj.formdata.rawData.viewInfo.viewContent.skin) {
                document.getElementById("real_" + privateId).setAttribute("style", "background: none;");
            } else {
                document.getElementById("section_" + privateId).setAttribute("class", "cap4-text is-one");
            }
        }
        //当权限为浏览时处理样式
        if (messageObj.auth === 'browse') {
            var d1 = document.getElementById("edit_receiver" + privateId);
            d1.parentNode.removeChild(d1);
            document.getElementById("custom" + privateId).readOnly = "true";

            //原样表单的浏览样式处理
            if (!messageObj.formdata.rawData.viewInfo.viewContent.skin) {
                var d2 = document.getElementById("cap4-text__" + privateId);
                d2.setAttribute("class", "cap4-text__browse");
                var d3 = document.getElementById("custom" + privateId);
                d3.parentNode.removeChild(d3);
            }
        }
    }

    //回填表单mapping字段
    myself.backfillFormControlData = function (payload, adaptation) {
        adaptation.adaptation.backfillFormControlData(payload, adaptation.privateId);
    }

    //在选择企业后，退至填写页面时，根据所选企业名称查询具体信息并回填页面
    myself.initBackData = function (name, messageObj, adaptation) {
        cmp.ajax({
            type: 'get',
            url: cmp.seeyonbasepath +
            "/rest/cap4/formCreditquery/parseCreditAndFillBack?" +
            "name=" + name + "&formId=" + messageObj.formdata.rawData.content.contentTemplateId + "&fieldName=" + messageObj.id +
            "&masterId=" + messageObj.formdata.rawData.content.contentDataId + "&subId=" + messageObj.recordId,
            dataType: 'JSON',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Accept-Language": "zh-CN",
                "Content-Type": "application/json; charset=utf-8",
                "token": cmp.token
            },
            success: function (data) {
                var d;
                if (cmp.platform.CMPShell) {
                    d = JSON.parse(data);
                } else {
                    d = data;
                }
                //将自定义控件值设置到adaptation中
                messageObj.value = name + "|" + d.data.chart_url;
                messageObj.showValue = name;
                adaptation.adaptation.childrenSetData(messageObj, adaptation.privateId);

                //回填mapping数据
                var backfill = {};
                backfill.tableName = adaptation.formMessage.tableName;
                backfill.tableCategory = adaptation.formMessage.tableCategory;
                backfill.updateData = d.data;
                backfill.updateRecordId = messageObj.recordId;
                myself.backfillFormControlData(backfill, adaptation);

                //初始化控件的值
                initData(messageObj.value, adaptation.privateId,messageObj);
            },
            error: function (data) {
                cmp.dialog.error(data.message, function (index) {
                }, "错误", ["确认", "取消"]);
            }
        });
    }

    window[privated] = myself;
})();


//初始化数据
function initData(data,id,messageObj) {
    if (data && data != "***") {

        var arr = data.split("|");
        if(!messageObj.formdata.rawData.viewInfo.viewContent.skin && messageObj.auth === 'browse'){
            document.querySelector("#input"+id).innerHTML = "<div>"+arr[0]+"<div>";
        }else{
            document.querySelector("#custom" + id).value = arr[0];
        }
        document.querySelector('#hyperlink' + id).addEventListener('tap', function () {
            if (cmp.platform.CMPShell) {
                if(arr[1] != "null"){
                    cmp.href.open(arr[1], arr[0]);
                }else{
                    cmp.dialog.error("请重新编辑此控件数据后使用该功能", function (index) {
                    }, "错误", ["确认", "取消"]);
                }
            } else {
                // cmp.notification.toast(cmp.i18n("commons.note.notsuport1"), 'top', 1000);
                cmp.notification.toast('微信端暂不支持超链接跳转!', 'top', 1000);
            }

        })
    }
}

function init(adaptation,usable){
    urlPath = adaptation.url_prefix;
    var messageObj = adaptation.adaptation.childrenGetData(adaptation.privateId);
    if (!document.getElementById("creditSearch")) {
        cmp.i18n.init(urlPath + 'i18n/', 'Formcreditqueryctrl');
        myself.dynamicLoading.css(urlPath + 'css/formQueryBtnMb.css');
        myself.dynamicLoading.js(urlPath + 'js/searchTemplate.js');
    }

    //拼接dom
    myself.appendChildDom(adaptation, messageObj, adaptation.privateId,usable);
    //初始化dom数据
    initData(messageObj.value, adaptation.privateId,messageObj);

    // 监听是否数据刷新
    adaptation.adaptation.ObserverEvent.listen('Event' + adaptation.privateId, function () {
        messageObj = adaptation.adaptation.childrenGetData(adaptation.privateId);
        myself.appendChildDom(adaptation, messageObj, adaptation.privateId,usable);
        initData(messageObj.value, adaptation.privateId,messageObj);
    });
}

//打开查询页面
function openNewPage(privateId, url, isSource, adaptation, messageObj) {
    cmp("#creditSubject")[0].attributes.privateId = privateId;
    cmp("#creditSubject")[0].attributes.messageObj = messageObj;
    cmp("#creditSubject")[0].attributes.adaptation = adaptation;
    var animate = document.querySelector('#creditSearch');
    ClassList = animate.classList;
    ClassList.add('cmp-active');
    ClassList.add('left-go');
    initPageBackCridet();
}

var ClassList;
var urlPath;


function initSourceDom(privateId, auth,usable) {
    //CAPF-12586 征信控件--->控件内容与控件图标重叠
    var paddingrigth = 0;
    if (auth === 'edit') {
        paddingrigth = '40px';
    } else if (auth === 'browse') {
        paddingrigth = '16px';
    }
    var domStructure = '<section id="section_' + privateId + '" class="cap4-text is-one"><div id="text_left_' + privateId + '"></div><div  id="right'+privateId+'"><div id="cap4-text__' + privateId + '" class="cap4-text__cnt">' +
        '<div id="input' + privateId + '" style="padding-right:' + paddingrigth + '"><input readonly="true"   type="text" id="custom' + privateId + '"/></input></div>' +
        '<div class="cap4-date__picker" style="width:'+paddingrigth+'" ><i id="edit_receiver' + privateId + '" class="icon CAP cap-icon-sousuo ' + privateId + '"></i>';
    if(usable == 1){
        domStructure =domStructure +'<i id="hyperlink' + privateId + '" class="icon CAP cap-icon-link"></i></div>' +
            '</div></div></section>';
    }else{
        domStructure =domStructure +'<i style="display: none" id="hyperlink' + privateId + '" class="icon CAP cap-icon-link"></i></div>' +
            '</div></div></section>';
    }
    return domStructure;
}

function initM3Dom(privateId, fieldStyle,usable) {
    var domStructure =
        '<section id="section_' + privateId + '" class="cap4-text is-one" style="background:' + fieldStyle.fieldBg + '">' +
        '<div class="cap4-text__star"><i class="icon CAP cap-icon-bitian"></i></div>' +
        '<div class="cap4-text__content">' +
        '<div class="cap4-text__left" id="text_left_' + privateId + '"  style="color:' + fieldStyle.fieldTitleDefaultColor + '">' +
        '</div>' +
        '<div class="cap4-text__right">' +
        '<div class="cap4-text__real" id = "real_' + privateId + '"><input  style="border-radius: 6px; color:' + fieldStyle.fieldValueDefaultColor + '"  readonly="true" id="custom' + privateId + '" type="text" maxlength="85" ">' +
        '</div>' +
        '<div>' +
        '<span id="edit_receiver' + privateId + '" class="icon CAP cap-icon-sousuo" style="color: rgb(58, 173, 251)"></span>&nbsp&nbsp' ;
    if(usable == 1){
        domStructure = domStructure + '<span  id="hyperlink' + privateId + '" class="icon CAP cap-icon-link" style="color: rgb(58, 173, 251)"></span>' +
            '</div></div>' +
            '</section> ';
    }else{
        domStructure = domStructure + '<span style="display: none"  id="hyperlink' + privateId + '" class="icon CAP cap-icon-link" style="color: rgb(58, 173, 251)"></span>' +
            '</div></div>' +
            '</section> ';
    }

    return domStructure;
}


function initSearchDom() {
    var domStructure =
        //div容器
        '<div>' +
        '<div id="creditSearch" class="Animated-Container left-go">' +
        '<div class="">' +
        //返回
        // '<div class="cmp-bar cmp-bar-nav head-style credit-backbar">' +
        // '    <a id="prev_search" href="javascript:void(0)" class="cmp-pull-left left-btn">' +
        // '        <span class="see-icon-v5-common-arrow-back"></span>' +
        // '返回' +
        // '    </a>' +
        // '    <h1 id="searchTitle" class="cmp-title">' +
        // '企业查询' +
        // '    </h1>' +
        // '    <div class="add_border border_t"></div>' +
        // '</div>' +
        //内容
        '<div id="creditListContent" style="background: white;">' +
        //搜索框
        '<form action="javascript:void(0)">' +
        '        <div id="searchContent" class="col-search-credit">' +
        '            <input autocomplete="off" class="col-search-input-credit" disabled="disabled" type="search" id="creditSubject" placeholder="" />' +
        '            <span id="searchClear" class="cmp-icon  cmp-icon-search col-search-icon-credit"></span>' +
        '        </div>' +
        '    </form>' +
        //最多五条
        '<div class="cmp-slider-group">' +
        '<div id="dataCommonDiv" style="overflow: hidden;"' +
        'class="form_template cmp-slider-item cmp-control-content cmp-active">' +
        '<ul id="templateList_credite" class="cmp-list-content-credit file-index-content listes_credit">' +
        '<div class="StatusContainer">' +
        '<div class="nocontent"></div>' +
        '<span class="text nocontent_text">' +
        '最多显示五条记录' +
        '</span></div>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        //列表Js
        '<script type="text/html" id="templateTpl_credite">' +
        '        <% for(i=0;i < this.length;i++){%>' +
        '        <li class="none read templateList_credite" data="<%=this[i].name%>">' +
        '            <div class="content_list_credit">' +
        '                <div class="info_credit read_credit"><%=this[i].name%></div>' +
        '                <div class="info2_credit">法定代表人:<%=this[i].oper_name%></div>' +
        '                <div class="info2_credit">社会信用编码:<%=this[i].credit_no%></div>' +
        '            </div>' +
        '        </li>' +
        '        <% } %>' +
        '</script>'

    return domStructure;
}



