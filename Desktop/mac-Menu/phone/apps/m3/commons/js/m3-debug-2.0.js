/**
 * @description M3调试模块
 * @author Clyne
 * @createDate 2017-07-27
 */
;(function() {
    var tools, m3Config, m3Event;
    //构造函数
    var debug = function(modelState) {
        //初始化
        this.init(modelState);
    },
        _this = window;
    
    /* --------------------------- 对外Public函数 ------------------------------- */
    /* -------------------------------- start --------------------------------- */
    //debug函数的原型链
    debug.prototype = {
        
        //出事换函数
        init: function(modelState) {
            this.id = 0;
            this.modelState = modelState;
            this.logCache = [];
            this.callback = {};
            //模式检查
            if (!this.modelState) return;
            //初始化DOM
            this.initDom();
            this.reWriteNativeFunction();
            //添加debug监听
            this.addDebugListener();
            //DOM事件
            this.initEvent();
        },
        
        //debug监听方法
        fireDebug: fireDebug,
        
        addDebugListener: addDebugListener,
        
        //重写原生函数
        reWriteNativeFunction: reWriteNativeFunction,
        
        //输入日志
        showLog: showLog,
        
        //事件初始化
        initEvent: initEvent,
        
        //展开操作事件
        extendEvent: extendEvent,
        
        //DOM
        initDom: initDom,
        
        //关闭调试模式
        closeDebugModel: closeDebugModel,
        
        //事件委托
        _on: _on,
        
        //解除委托
        _off: _off
        
    };
    
    /**
     *  @method initDom
     *  @description 初始化DOM
     */
    function initDom() {
        var debugNode = document.createElement('div'),
            debugPageNode = document.createElement('div'),
            cssNode = document.createElement('link');
        //加载css
        cssNode.rel = 'stylesheet';
        cssNode.href = m3Config.debugCssUrl;
        //加载元素
        document.head.appendChild(cssNode);
        debugNode.id = 'm3-debug';
        debugPageNode.id = 'debug-page';
        debugNode.className = 'm3-debug';
        debugPageNode.className = 'debug-page m3display-none';
        //一开始先隐藏，等css文件加载完毕后显示
        debugPageNode.style.display = 'none';
        cssNode.onload = function() {
            debugPageNode.removeAttribute('style');
        }
        debugPageNode.innerHTML =   '\
            <div class="db-title">\
                <h1>M3调试模块</h1>\
                <a id="db-close">最小化</a>\
            </div>\
            <div class="db-content" id="db-content"></div>\
            <div class="m3-db-toolbar">\
                <textarea id="db-code" placeholder="输入你需要执行的代码"></textarea>\
                <a class="db-btn" id="db-clear-btn">清除</a>\
                <a class="db-btn" id="db-eval-btn">执行</a>\
            </div>';
        document.body.appendChild(debugNode);
        document.body.appendChild(debugPageNode);
    }
    
    /**
     *  @method closeDebugModel
     *  @description 关闭debug工具
     */
    function closeDebugModel() {
        this.modelState = false;
        //还没写玩
        //还没写玩
        //还没写玩
        //还没写玩
        //还没写玩
    }
    
    /**
     *  @method fireDebug
     *  @description 事件触发器
     *  @param 需要输出的值
     *  @type 错误类型
     */
    function fireDebug(value, type) {
        //如果value里面包含了错误类型则以value为主，屏蔽type
        if (!value.errorType) {
            value.errorType = type;
        }
        m3Event.fireEvent('m3-debug-module', value);
    }
    
    /**
     *  @method addDebugListener
     *  @description 事件监听器
     */
    function addDebugListener() {
        m3Event.addEventListener('m3-debug-module', function(e) {
            e = e.data;
            delete e.callback;
            if (tools.isEmpty(e.errorType)) {
                delete e.errorType;
            }
            console.log(e, e.errorType);
        });
    }
    
    /**
     *  @method _on
     *  @description 事件委托
     *  @param el [object Html***Element] html元素
     *  @param type [object String] 事件类型
     *  @param cb [object Function] 回调函数
     */
    function _on(el, type, cb) {
        if (el.length >= 0) {
            for (var i = 0;i < el.length;i++) {
                this.callback[type] = cb;
                el[i].addEventListener(type, this.callback[type], false);
            }
        } else {
            this.callback[type] = cb;
            el.addEventListener(type, this.callback[type], false);
        }
    }

    /**
     *  @method _off
     *  @description 移除事件委托
     *  @param el [object Html***Element] html元素
     *  @param type [object String] 事件类型
     */
    function _off(el, type) {
        if (el.length >= 0) {
            for (var i = 0;i < el.length;i++) {
                el[i].removeEventListener(type, this.callback[type]);
            }
        } else {
            el.removeEventListener(type, this.callback[type]);
        }
    }
    
    /**
     *  @method initEvent
     *  @description 事件初始化
     */
    function initEvent() {
        var objThis = this,
            objDebug = document.getElementById('m3-debug'),
            objCode = document.getElementById('db-code'),
            objContent = document.getElementById('db-content');
        
        var xy = {
            x: 0,
            y: 0,
            distX: 0,
            distY: 0,
            curDistX: 0,
            curDistY: 0,
            time: 0
        };
        // ============================ 拖拽部分 start ============================
        //触摸开始
        objDebug.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();
            xy.time = new Date().getTime();
            //单点触控
            xy.x = e.touches[0].pageX;
            xy.y = e.touches[0].pageY;
        });
        
        //滑动
        objDebug.addEventListener('touchmove', function(e) {
            xy.curDistX = Math.floor(e.touches[0].pageX - xy.x) + xy.distX,
            xy.curDistY = Math.floor(e.touches[0].pageY - xy.y) + xy.distY;
            this.style.webkitTransform = 'translate3d(' + xy.curDistX + 'px, ' + xy.curDistY + 'px, 0)';
            this.style.transform = 'translate3d(' + xy.curDistX + 'px, ' + xy.curDistY + 'px, 0)';
        });
        
        //触摸结束
        objDebug.addEventListener('touchend', function() {
            xy.distX = xy.curDistX;
            xy.distY = xy.curDistY;
            //触发tap事件，开启调试
            if (new Date().getTime() - xy.time <= 350) {
                //显示调试页面
                removeClass(document.getElementById('debug-page'), 'm3display-none');
                //隐藏调试按钮
                addClass(this, 'm3display-none');
            }
        });
        
        // ============================ 拖拽部分 end ==============================
        
        //关闭调试
        document.getElementById('db-close').onclick = function() {
            //显示调试页面
            addClass(document.getElementById('debug-page'), 'm3display-none');
            //隐藏调试按钮
            removeClass(objDebug, 'm3display-none');
        }
        
        //清空log
        document.getElementById('db-clear-btn').onclick = function() {
            objThis.logCache = [];
            objThis.id = 0;
            objContent.innerHTML = '';
        }
        
        //执行
        document.getElementById('db-eval-btn').onclick = function() {
            var code = objCode.value,
                codeStr = code + '',
                contentNode = objContent;
            if (code === '') return;
            codeStr = codeStr.replace(/\r|\n|\r\n/g, '<br />');
            contentNode.innerHTML += '<div class="db-code">' + codeStr + '</div>';
            contentNode.scrollTop = '10000000';
            try {
                objCode.value = '';
                console.log(eval(code));
            } catch(e) {
                console.log(e);
            }
        }
    }
    
    /**
     *  @method extendEvent
     *  @description 展开交互事件
     */
    function extendEvent() {
        var objThis = this,
            htmlStr,
            objNodes = document.querySelectorAll('.can-extend');
        
        this._off(objNodes, 'click');
        
        this._on(objNodes, 'click', function(e) {
            e.stopPropagation();
            var _ids = this.getAttribute('id'),
                ids = JSON.parse(_ids),
                data = objThis.logCache,
                childNode = document.getElementById('child-' + _ids);
            //判断是否展开
            //收起
            if (hasClass(this, 'active')) {
                removeClass(this, 'active');
                childNode.style.display = 'none';
                return;
            //展开
            } else {
                addClass(this, 'active');
                //是否展开过
                //展开过
                if (childNode.children.length > 0) {
                    childNode.style.display = 'block';
                    return;
                }
                //未展开
                for (var i in ids) {
                    //过滤掉Array对象上的原型链
                    if (ids.propertyIsEnumerable(i)) {
                        data = data[ids[i]];
                    }
                }
                htmlStr = render(data, ids, true);
                childNode.innerHTML = htmlStr;
                objThis.extendEvent();
            }
        });
    }
    
    /**
     *  @method reWriteNativeFunction
     *  @description 重写浏览器部分原生方法
     *  @param debugModule 调试模式 [object Boolen]
     *  @param objThis window对象 [object Object]
     */
    
    function reWriteNativeFunction() {
        //非调试模式，return
        if (!this.modelState)return;
        var objThis = this,
            nodeObj = document.getElementById('m3-debug');
        //console.log重写
        _this.console.log = function(arg, type) {
            console.info(arg);
            if (!objThis.modelState) return;
            if (!hasClass(nodeObj, 'm3-debug-error')) {
                addClass(nodeObj, 'm3-debug-log');
            }
            if (tools.isError(arg) || type) {
                removeClass(nodeObj, 'm3-debug-log');
                addClass(nodeObj, 'm3-debug-error');
            }
            objThis.showLog(arg, type);
        }
    }
    
    /**
     *  @method showLog
     *  @description 展示控制台
     *  @param arguments[0] 任意类型
     *  @param type [object String] 'append'表示追加，其他表示刷新
     */
    
    function showLog(arg, type) {
        var contentNode = document.getElementById('db-content'),
            htmlStr,
            id = this.id++;
        this.logCache.push(arg);
        htmlStr = render(arg, [id], false, type);
        contentNode.innerHTML += htmlStr;
        this.extendEvent();
    }
    
    /* -------------------------------- end --------------------------------- */
    
    
    /* --------------------------- 对内private函数 ------------------------------- */
    /* -------------------------------- start --------------------------------- */
    
    /**
     *  @method render
     *  @description 渲染数据
     *  @param data 任意数据
     *  @param id [object Array] 父级的id数组
     *  @param operExtend [object Boolen] 是否展开操作
     */
    function render(data, id, operExtend, type) {
        var str = '',
            className = tools.isError(data) ? 'debug-red' : '',
            typeStr = type + ' Error :';
        if (typeof type !== 'undefined') {
            className = 'debug' + '-' + type;
        } else {
            typeStr = 'm3Log :'
        }
        if (operExtend) {
            var hisId;
            for(var i in data) {
                //移除不可枚举的属性
                if (!data.propertyIsEnumerable(i)) continue;
                hisId = [].concat(id);
                hisId.push(i);
                hisId = JSON.stringify(hisId);
                if (isObjectCanExtend(data[i])) {
                    str +=  "<div class='can-extend " + className + " ' id='" + hisId + "'>\
                                " + i + " > " + renderObj(data[i]) + "\
                            </div>\
                            <div class='db-child-cont' id='child-" + hisId + "'></div>";
                } else {
                    str +=  "<div class='no-extend " + className + "' id='" + hisId + "'>\
                                " + i + " > " + dataToString(data[i]) + "\
                            </div>";
                }
            }
        } else {
            var tgtId = JSON.stringify(id);
            if (isObjectCanExtend(data)) {
                str += "<div class='can-extend " + className + "' id='" + tgtId + "'>\
                            " + typeStr + renderObj(data) + "\
                            <div class='db-child-cont'></div>\
                        </div>\
                        <div class='db-child-cont' id='child-" + tgtId + "'></div>";
            } else {
                str += "<div class='no-extend " + className + "' id='" + tgtId + "'>\
                            " + typeStr + dataToString(data) + "\
                        </div>";
            }
        }
        return str;
    }
    
    /**
     *  @method renderObj
     *  @description 对要渲染的对象，数组，function，等做特殊处理
     *  @param data [object Object] 对象
     */
    function renderObj(data) {
        var str = 'object: {',
            index = 0,
            _isArray = tools.isArray(data);
        if (tools.isError(data)) {
            return 'error:' + data + ',';
        }
        if (_isArray) str = 'array: [';
        for (var i in data) {
            if (tools.isArray(data[i])) {
                str += ' ' + i + ': array,'
            } else if (tools.getTypeof(data[i]) === 'object') {
                str += ' ' + i + ': object,'
            } else if(tools.isFunction(data[i])) {
                str += ' ' + i + ': function,'
            } else {
                str += ' ' + i + ': ' + data[i] + ',';
            }
        }
        if (_isArray) 
            str += ']';
        else
            str += '}';
        return str;
    }
    
    /**
     *  @method isObjectCanExtend
     *  @description 判断是否可展开的数据类型
     *  @param data 任意类型
     */
    function isObjectCanExtend(obj) {
        var type = Object.prototype.toString.call(obj);
        //非null，且可枚举
        if (
            tools.isObject(obj) && 
            !tools.isNull(obj) || 
            tools.isEvent(obj) || 
            tools.isError(obj) || 
            tools.isArguments(obj) || 
            tools.isArray(obj)
        )
            return true;
        else
            return false;
    }
    
    /**
     *  @method hasClass
     *  @description 判断是否存在该class
     *  @param el [object Html***Element] 被判断的节点
     *  @param className [object String] 类名
     */
    function hasClass(el, className) {
        return el.className.match(className) ? true : false;
    }
    
    /**
     *  @method addClass
     *  @description 添加class
     *  @param el [object Html***Element] 被判断的节点
     *  @param className [object String] 类名
     */
    function addClass(el, className) {
        if (!hasClass(el, className)) {
             el.className += ' ' + className;
        }
    }
    
    /**
     *  @method removeClass
     *  @description 移除class
     *  @param el [object Html***Element] 被判断的节点
     *  @param className [object String] 类名
     */
    function removeClass(el, className) {
        var tgtClass = el.className;
        if (tgtClass.match(' ' + className))
            el.className = tgtClass.replace(' ' + className, '');
        else
            el.className = tgtClass.replace(className, '');
    }
    
    function dataToString(data) {
        if (tools.isString(data))
            return '\"' + data + '\"';
        else
            return data;
    }
    define(function(require, exports, module){
        tools = require('tools');
        m3Config = require('m3Config');
        m3Event = require('event');
        module.exports = window.m3Debug = new debug(m3Config.debugModel);
    });
})();