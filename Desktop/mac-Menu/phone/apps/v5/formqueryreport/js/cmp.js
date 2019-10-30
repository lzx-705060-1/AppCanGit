/**
 * Created by xp on 2016/3/20 0020.
 * 精简版cmp+一些统计图业务
 */
window.cmp = {};
cmp.version = 1.1;
var tplCache = {};
(function(_){
    _.os = (function (u) {
        return { // 移动终端浏览器版本信息
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1 // 是否iPad
        };
    })(navigator.userAgent);
    _.language = (function () {
        var lang;
        var enRegex = /en/g;
        var chiRegex = /zh/g;
        if (navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
            lang = lang[1];
        }
        if (!lang && navigator) {
            if (navigator.language) {
                lang = navigator.language;
            } else if (navigator.browserLanguage) {
                lang = navigator.browserLanguage;
            } else if (navigator.systemLanguage) {
                lang = navigator.systemLanguage;
            } else if (navigator.userLanguage) {
                lang = navigator.userLanguage;
            }
        }

        if (enRegex.test(lang)) {
            lang = "en";
        } else if (chiRegex.test(lang)) {
            lang = "zh";
        }
        return lang;
    })();
    _.extend = function () { //from jquery2
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && !cmp.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (_.isPlainObject(copy) || (copyIsArray = _.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && _.isArray(src) ? src : [];

                        } else {
                            clone = src && _.isPlainObject(src) ? src : {};
                        }

                        target[name] = _.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    _.isFunction = function (value) {
        return typeof value=== "function";
    };
    _.isArray = Array.isArray ||
        function (object) {
            return object instanceof Array;
        };
    _.isPlainObject = function (obj) {
        return _.isObject(obj) && !_.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };
    _.isObject = function (obj) {
        return typeof obj=== "object";
    };
    _.isWindow = function (obj) {
        return obj != null && obj === obj.window;
    };
    _.getTop = function(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };
    _.getLeft = function(element){
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    };
    _.append = function(parent,dom){
        if(parent instanceof HTMLElement) {
            var children = _parseDom(dom);
            var i = 0,len = children.length;
            if(len > 0) {
                for(;i<len;i++) {
                    parent.appendChild(children[i]);
                }
            }
        }
    };
    function _parseDom(html) {
        var objE = document.createElement("div");
        objE.innerHTML = html;
        var children = [],childrenNode = objE.childNodes,i = 0,len = childrenNode.length;
        for(;i<len;i++) {
            if(typeof childrenNode[i] == "undefined") continue;
            if(childrenNode[i].nodeName &&childrenNode[i].nodeName != "#text"){
                children.push(childrenNode[i]);
            }
        }
        return children;
    }
})(cmp);

(function (_) {


    /**
     * hash 不支持原生JSON的容器
     */
    if (!window.JSON) {
        window.JSON = {
            parse: function (sJSON) {
                return eval('(' + sJSON + ')');
            },
            stringify: (function () {
                var toString = Object.prototype.toString;
                var isArray = Array.isArray || function (a) {
                    return toString.call(a) === '[object Array]';
                };
                var escMap = {
                    '"': '\\"',
                    '\\': '\\\\',
                    '\b': '\\b',
                    '\f': '\\f',
                    '\n': '\\n',
                    '\r': '\\r',
                    '\t': '\\t'
                };
                var escFunc = function (m) {
                    return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
                };
                var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
                return function stringify(value) {
                    if (value == null) {
                        return 'null';
                    } else if (typeof value === 'number') {
                        return isFinite(value) ? value.toString() : 'null';
                    } else if (typeof value === 'boolean') {
                        return value.toString();
                    } else if (typeof value === 'object') {
                        if (typeof value.toJSON === 'function') {
                            return stringify(value.toJSON());
                        } else if (isArray(value)) {
                            var res = '[';
                            for (var i = 0; i < value.length; i++)
                                res += (i ? ', ' : '') + stringify(value[i]);
                            return res + ']';
                        } else if (toString.call(value) === '[object Object]') {
                            var tmp = [];
                            for (var k in value) {
                                if (value.hasOwnProperty(k))
                                    tmp.push(stringify(k) + ': ' + stringify(value[k]));
                            }
                            return '{' + tmp.join(', ') + '}';
                        }
                    }
                    return '"' + value.toString().replace(escRE, escFunc) + '"';
                };
            })()
        };
    }

    /**
     * 将字符串转成JSON对象
     * @type {Window.JSON.parse|Function}
     */
    _.parseJSON = window.JSON.parse;

    /**
     * 将JSON对象装成JSON字符串
     */
    _.toJSON = window.JSON.stringify;
})(cmp);

(function(_){
    _.calendar = function (opts){  //日历控件
        var options = _.extend({
            title:"",
            ctrl:null,//日期组件绑定的控件
            value:"",//回填值，默认是当前日期
            ok:null,//ok按钮的回调函数（如果没有定义，则会判断是否是input，如果是input的话会进行数据填充）
            clear:null,//清除按钮的回调函数（如果没有定义，则会判断是否是input，如果是input则会将input的值清空）
            type:"date"//日期组件类型  date：选日期；datetime：选日期时间
        },opts);
        var isInput = false;
        if(options.ctrl && typeof options.ctrl == "object"){
            var ctrlType = options.ctrl.nodeName.toLowerCase();
            if(ctrlType == "input") isInput = true;
        }
        var okCallback = (options.ok) ? options.ok : (isInput)?_okCallback:null;
        var clearCallback = (options.clear)?options.clear:(isInput)?_clearCallback:null;
        var dateWidgetCtrl = options.ctrl;
        var dateConfig = {
            date : {
                preset : 'date',
                minDate: new Date(1900,3,10,9,22),
                maxDate: new Date(2050,7,30,15,44)
            },
            datetime : {
                preset : 'datetime',
                minDate: new Date(1900,3,10,9,22),
                maxDate: new Date(2050,7,30,15,44)
            }
        };
        var calendarOptions = _.extend(
            dateConfig[options.type],
            {
                theme : 'android-ics light',//直接用该主题
                mode : 'scroller',//直接选用日期滚动的模式
                display : 'bottom',//直接选用从底部弹出的方式
                lang : _.language,
                title : options.title,
                initVal:options.value,
                okCallback : okCallback,
                clearCallback : clearCallback
            }
        );
        setTimeout(function(){
            $(dateWidgetCtrl).mobiscroll(calendarOptions);
        },300);
        function _okCallback(formatDate){
            dateWidgetCtrl.value = formatDate;
        }
        function _clearCallback(){
            dateWidgetCtrl.value = "";
        }
    };
    //select选择面板html
    var selectPanelHtml = '<div class="select_ui">'+
        '<div class="select_panel panel_hidden_state">' +
        '   <div class="select_header">' +
        '       <div class="header_title">' +
        '           <span class="title"></span>' +
        '       </div>' +
        '   </div>' +
        '   <div class="select_body">' +
        '       <div  class="select_listpicker" id="optionPicker">' +
        '           <div class="select_scroller">' +
        '               <ul class="optionsList"></ul>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '</div>';
    _.select = function(ctrl){//下拉控件
        var height = ctrl.offsetHeight;
        var ctrlParent = ctrl.parentNode;
        var selectDiv = "<div id='containerDiv' style='width:100%;height:"+height+"px;position: relative;'><div id='selectDiv' style='width: 100%;height:"+height+"px;left:0px;top:0px;position: absolute;'></div></div>";
        ctrl.setAttribute("disabled",true);
        _.append(ctrlParent,selectDiv);
        var containerDiv = ctrlParent.querySelector("#containerDiv");
        _.append(containerDiv,ctrl);
        //ctrl.style.width = "100%";
        var newSelect = ctrlParent.querySelector("#selectDiv");
        newSelect.addEventListener("click",function(){
            ctrl.blur();
            var beforeChangeVal = ctrl.options[ctrl.selectedIndex].value;
            createSelectBox(ctrl,function(selectedValue){
                if(beforeChangeVal != selectedValue) {
                      //todo 回填值


                }
            });
        },false);

        function createSelectBox(select,changeCallback) {
            var options = select.options;
            var name = select.getAttribute("name");
            var lisHtml = '';
            for(var i = 0; i < options.length ; i ++) {
                lisHtml += '<li index="'+i+'" optionVal="'+options[i].value+'" ';

                lisHtml +='><label for="cmp_radio_'+i+'">'+((options[i].text == "" || options[i].text.length == 0) ? "&nbsp;" : options[i].text)+'</label><span class="select_radio"><div class="cmp-input-row cmp-radio cmp-left mui-table-view-cell" style="height: 100%;">' +
                    '<input style="position:relative;left:0;right:0;" id="cmp_radio_'+i+'" type="radio" class="select_radio_green newStyle_select_radio" name="'+name+'"';
                if(options[i].selected == true) {
                    lisHtml += 'checked="true"';
                }
                lisHtml += '></div></span></span></li>';
            }
            _.append(document.body,selectPanelHtml);
            var selectUi = document.querySelector(".select_ui");
            var selectPanel = selectUi.querySelector(".select_panel");
            var scrollArea = selectUi.querySelector(".select_listpicker");
            var ul = selectUi.querySelector(".optionsList");
            ul.innerHTML = lisHtml;
            var scrollAreaId = scrollArea.getAttribute("id") +"_"+select.getAttribute("id");
            scrollArea.setAttribute("id",scrollAreaId);
            var height = window.innerHeight;
            selectUi.style.height = height + "px";
            selectUi.addEventListener("touchmove",function(event) {
                event.preventDefault();
            },false);

            setTimeout(function() {
                var top = document.body.scrollTop;
                selectUi.style.top = top + "px";
                selectPanel.classList.remove("panel_hidden_state");
                selectPanel.classList.add("panel_show_state");
            },300);
            createSelectScroller(scrollAreaId,ul,selectUi,selectPanel,select,changeCallback);

        }
        //创建select的滚动对象
        function createSelectScroller(id,ul,ui,panel,select,changeCallback) {
            var selectScroller = new IScroll(id,{
                bounce :  true,
                hScroll : false,
                vScroll : true,
                hScrollbar: false,
                vScrollbar: false,
                snap : "li"
            });
            selectScroller.refresh();

            var childrenLi = ul.childNodes;
            var i = 0,len = childrenLi.length;
            for(;i<len;i++){
                (function(i){
                    var thisLi = childrenLi[i];
                    var radio = thisLi.querySelector("input");
                    if(radio.checked){
                        thisLi.setAttribute("selected","selected");
                    }
                    radio.addEventListener("click",function(){
                        for(var j = 0;j<childrenLi.length;j++){
                            childrenLi[j].removeAttribute("selected");
                        }
                        thisLi.setAttribute("selected","selected");
                        var value = thisLi.getAttribute("optionVal");

                        var selectedOption = select.options[i];
                        selectedOption.selected = true;
                        if(changeCallback) {
                            changeCallback(value);
                        }
                        selectClose(ui,panel,selectScroller);
                    },false);
                })(i)
            }
        }
        function selectClose(ui,panel,scroller){
            setTimeout(function(){
                panel.classList.remove("panel_show_state");
                panel.classList.add("panel_disappear_state");
                scroller = null;
                panel.remove();
                panel = null;
                ui.style.display="none";
                ui.remove();
            },200);
        }
    };

})(cmp);

var M1CommandConstant = {
    CMP_Command_BackPage:1002,  //关闭webview命令
    CMP_Command_GetCoordinate:2005,//获取坐标命令
    CMP_Command_SaveBase64:2004,  //保存base64数据命令
    CMP_Command_M1IOSPlatform:2006, //判断是否M1的IOS 平台
    CMP_Command_M1Camera:2007,//调用M1的相册或相机命令
    CMP_Command_UploadFileByPath:2009, //通过M1的壳进行文件上传
    CMP_Command_Alert:2012,//弹出对话框
    CMP_Command_BusinessPenetrate:6001,//业务首页应用的穿透查看命令
    CMP_Command_SelectPeople:6002,//选人组件
    CMP_Command_FormPenetrate:6003,//表单穿透查看
    CMP_Command_ChooseProject:6004,//选择关联项目
    CMP_Command_ChooseForm:6005,//选择关联表单
    CMP_Command_ChangeState:6006, //M1操作对象状态改变
    CMP_Command_Link:6007,//打开链接
    CMP_Command_RelationProject:6008//打开关联项目
};
var M1SelectPeopleConstant = {
    C_sSelectType_Member:"Member",
    C_sSelectType_Department:"Department",
    C_sSelectType_Post:"Post",
    C_sSelectType_Account:"Account",
    C_sSelectType_Level:"Level"
};

if(typeof _CallBackCache == 'undefined'){
    var _CallBackCache = {};
    var _CallBackIndex = 0;
}
var _requestCacheId = {}, _requestCacheIdIndex = 0;

(function(_){
    /**
     * 关闭webview
     */
    _.m1BackPage = function(){
        _smRequest(M1CommandConstant.CMP_Command_BackPage);
    };
    /**
     * 获取坐标的经纬度
     * @param opts:{
     *      success:成功的回调，将成功的返回值返回
     *      error:错误的回调，将错误信息值返回
     * }
     */
    _.m1GetCoordinate = function(opts){
        var options = _.extend({
            success:null,
            error:null
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_GetCoordinate,options);
    };
    /**
     * 保存base64数据到本地
     * @param opts{
     *      data:base64字符串，
     *      success:成功的回调，会将成功的值返回
     *      error:错误的回调，会将错误的值返回
     * }
     */
    _.m1SaveBase64 = function(opts){
        var options = _.extend({
            data:null,
            success:"",
            error:""
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_SaveBase64,options);
    };
    _.m1PlatformJudge = function(opts){
        var options = _.extend({
            success:"",
            error:""
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_M1IOSPlatform,options);
    };
    _.m1BusinessPenetrate = function(opts){
        var options = _.extend({
            data:null,
            success:null,
            error:null
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_BusinessPenetrate,options);
    };
    _.m1Alert = function(msg){
        var options = {
            data:typeof msg != "undefined"?msg:""
        }
        _smRequest(M1CommandConstant.CMP_Command_Alert,options);
    };
    _.selectPeople = function(opts){
        var options = _.extend({
            data:{
                selectType:M1SelectPeopleConstant.C_sSelectType_Member,
                isMulti:true,
                maxSize:-1,
                value:[]
            },
            success:null,
            error:null
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_SelectPeople,options);
    };
    _.m1FormPenetrate = function(form){
        try{
            form = _.parseJSON(form);
            var data = _.extend({
                moduleType:typeof form.moduleType == "undefined"?form.moduleType:0,  //1流程表单，2无流程表单,3基础数据
                //无流程表单参数
                moduleID:typeof form.moduleID == "undefined"?form.moduleID:"",
                formID:typeof form.formID == "undefined"?form.formID:"",
                rightID:typeof form.rightID == "undefined"?form.rightID:"",
                //流程表单参数
                operationID:typeof form.operationID == "undefined"?form.operationID:"",
                affairID:typeof form.affairID == "undefined"?form.affairID:"",
                summaryID:typeof form.summaryID == "undefined"?form.summaryID:"",
                archiveID:typeof form.archiveID == "undefined"?form.archiveID:"",
                from:typeof form.from == "undefined"?form.from:""  //即为state
            },form);
            var options = {
                data:data,
                success:null,//不用定义，只是保持格式一致
                error:null //不用定义，只是保持格式一致
            };
            _smRequest(M1CommandConstant.CMP_Command_FormPenetrate,options);
        }catch (e){
            _.m1Alert({data:e.message});
        }
    };
    _.m1RelationProject = function(opts){
        var options = _.extend({
            success:null,
            error:null
        },opts);
        _smRequest(M1CommandConstant.CMP_Command_RelationProject,options);//TODO 研究关联项目回填值
    };

//调用客户端接口向服务器请求数据
    function _smRequest(command,params){
        params = _.extend({
            success:null,
            error:null,
            data:null,
            requestType:0  //0:请求M1本地服务，1：请求远程
        },params);
        var requestParam = {};
        requestParam.data = params.data;
        requestParam.doType = command;
        var idCache = "cache"+_requestCacheIdIndex;
        _requestCacheId[idCache] = idCache;
        _requestCacheIdIndex++;
        requestParam.requestCacheId = idCache;
        //缓存回调函数
        var callbackId = "cbc"+_CallBackIndex;
        requestParam.callbackId = callbackId;
        _CallBackCache[callbackId] = {
            success : params.success,
            error:params.error,
            requestType : params.requestType
        };
        _CallBackIndex++;
        var paramJson = encodeURI(encodeURI(_.toJSON(requestParam)));

        if(_.os.android){
            //第三个参数是一个json作为预留参数，以后可以扩展
            window.seeyonMobile.smRequest(command,paramJson,callbackId);
        }else if(_.os.ios){
            _MJS_IOS_CommandParam_SMRequest(command, requestParam);
        }else {
            console.log("该平台不支持对M1命令的调用");
        }

    }
    function _MJS_IOS_CommandParam_SMRequest(MJSCommandNumber,paramObject){
        var jsonObject = {doType:MJSCommandNumber,param:paramObject};
        var paramJson = encodeURI(encodeURI(_.toJSON(jsonObject)));
        window.location.href = "MJSCommand?" + paramJson;
    }
})(cmp);


(function (_) {

    //dom 加载状态
    var readyRE = /complete|loaded|interactive/;

    _.event = {};

    /**
     * 设备就绪
     * 该函数是混合应用的入口函数
     * @param callback 设备准备就绪后的回调函数
     * @param cfg 设备准备配置
     * @type {Function}
     */
    _.ready = _.event.ready = function (callback, cfg) {
        if (typeof cfg == 'function') {
            callback = cfg;
            cfg = null;
        }
        if (readyRE.test(document.readyState)) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
    };
})(cmp);



String.prototype.TrimAll = function()
{
    return this.replace(/(^\s*)|(\s*$)|(\n)/g,"");
};
//服务器端请求数据的回调函数
function smResponse(callbackId,returnValue){
    if(returnValue!=null){
        //将+替换为%20  后解码，否则空格显示为+
        returnValue = decodeURIComponent(returnValue);
        returnValue = returnValue.replace(/\+/g,"%20");
        returnValue = decodeURIComponent(returnValue);
        var temp = _CallBackCache[callbackId];
        if(temp==null){
            return;
        }
        try{
            var r = returnValue;
            if(typeof returnValue == 'string' && returnValue.TrimAll().length != 0){
                r = cmp.parseJSON(returnValue);
            }
            if(temp.requestType==1){ //远程请求
                if(r!=null && r.success){
                    _doRemoteCallback4H5(temp,r);
                }
            }else if(temp.requestType==0){
                _doNativeCallback4H5(temp,r);
            }
        }catch(e){
            cmp.m1Alert({data:e.message});
        };
        _CallBackCache[callbackId] = null;
    }
}

function _doNativeCallback4H5(callback,returnVal){
    var params = cmp.extend({
        success:null,
        error:null
    },callback);
    if(returnVal.success){
        var successFun = params.success;
        if(successFun && typeof successFun == "function"){
            if(typeof returnVal == "string" && returnVal.length != 0){
                returnVal = cmp.parseJSON(returnVal);
            }
            successFun(returnVal);
        }
    }else {
        var errorFun = params.error;
        if(errorFun && typeof errorFun == "function"){
            if(typeof returnVal == "string" && returnVal.length != 0){
                returnVal = cmp.parseJSON(returnVal);
            }
            errorFun(returnVal);
        }
    }
}

function _doRemoteCallback4H5(callback,returnVal){
    var params = cmp.extend({
        success:null
    },callback);
    var callbackFun = params.success;
    if(callbackFun && typeof callbackFun == "function"){
        callbackFun(returnVal);
    }
}

//cmp.ready(function(){  //将页面所有的select重新渲染
//    var selects = document.getElementsByTagName("select");
//    var i = 0,len = selects.length;
//    for(;i<len;i++){
//        (function(i){
//            cmp.select(selects[i]);
//        })(i);
//    }
//});







