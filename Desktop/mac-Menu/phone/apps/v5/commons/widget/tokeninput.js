
/**
 * 自动补全控件
 */
var AutoComplete = (function(){
        
    var App, 
        Controller, 
        DEFAULT_CALLBACKS, 
        Model, 
        TextareaController, 
        View, 
    
        slice = [].slice, 
        extend = function(child, parent) {
            for ( var key in parent) {
                if (hasProp.call(parent, key)){
                    child[key] = parent[key];
                }
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, 
        hasProp = {}.hasOwnProperty;
    
    
    App = (function() {
        function App(config) {
            
            this.controllers = null;
            this.$inputor = config.target;
            this.reg(config);
            this.listen();
            
            //调试开关
            this.isDebug = false;
        }
    
        App.prototype.controller = function() {
            return this.controllers;
        };
    
        App.prototype.reg = function(setting) {
            
            var controller = new TextareaController(this);
            controller.init(setting);
            
            this.controllers = controller;
        };
    
        App.prototype.handleEvent = function(e){
            switch (e.type) {
                case 'focus':
                    //this.focus(e);
                    break;
                case 'blur':
                    //this.blur(e);
                    break;
                case 'paste':
                    this.paste(e);
                    break;
                case 'keydown':
                    this.keydown(e);
                    break;
                case 'keyup':
                    this.keyup(e);
                    break;
                case 'compositionstart':
                    this.compositionstart(e);
                    break;
                case 'compositionend':
                    this.compositionend(e);
                    break;
                case 'tap':
                    //console.info("tap");
                    var targetE = e.target; 
                    if(targetE == this.$inputor){
                        e.stopPropagation();
                        this.focus(e);
                    }else{
                        this.blur(e);
                    }
                    break;
                case 'click':
                    //console.info("click");
                    var targetE = e.target; 
                    if(targetE == this.$inputor){
                        e.stopPropagation();
                        this.focus(e);
                    }
                    break;
            }
        }
        
        App.prototype.focus = function(e){
            this.dispatch(e);
            this.$inputor.focus();
        }
        
        App.prototype.blur = function(e){
            
            this.$inputor.value = "";
            this.controller().view.hide(e);
        }
        App.prototype.paste = function(e){
            //粘贴的时候
            this.keydown(e);
        }
        
        App.prototype.getPrevioussibling = function(n) {
            var x = n.previousSibling;
            if (x == null) {
                return null;
            }
            while (x && x.nodeType != 1) {
                x = x.previousSibling;
            }
            return x;
        } 
        
        App.prototype.keydown = function(e){
            /*var ref, view;
            view = (ref = this.controller()) != null ? ref.view : void 0;
            if (!(view && view.visible())) {
                return;
            }*/
            
            var keyDownFn = this.controllers.callbacks('onKeyDown');
            if(keyDownFn){
                keyDownFn(e, this.$inputor);
            }
        }
        App.prototype.keyup = function(e){
            
            this.dispatch(e);
        }
        App.prototype.compositionstart = function(e){
            
            var _this = this;
            var ref;
            if ((ref = _this.controller()) != null) {
                ref.view.hide();
            }
            this.isComposing = true;
        }
        
        App.prototype.compositionend = function(e){
            this.isComposing = false;
            this.dispatch(e);
        }
        
        //事件
        App.prototype.listen = function() {
            this.$inputor.addEventListener('compositionstart', this);
            this.$inputor.addEventListener('compositionend', this);
            this.$inputor.addEventListener('keyup', this);
            this.$inputor.addEventListener('keydown', this);
            //this.$inputor.addEventListener('blur', this);
            //this.$inputor.addEventListener('focus', this);
            this.$inputor.addEventListener('click', this);
            
            var ref = null;
            if((ref = this.controller()) != null && ref.setting.autoBlur !== false){
                document.body.addEventListener('tap', this);
            }
        };
    
        App.prototype.shutdown = function() {
            
            //清除事件
            this.$inputor.removeEventListener('compositionstart', this);
            this.$inputor.removeEventListener('compositionend', this);
            this.$inputor.removeEventListener('keyup', this);
            this.$inputor.removeEventListener('keydown', this);
            //this.$inputor.removeEventListener('blur', this);
            //this.$inputor.removeEventListener('focus', this);
            this.$inputor.removeEventListener('click', this);
            
            var ref = null;
            if((ref = this.controller()) != null && ref.setting.autoBlur !== false){
                document.body.removeEventListener('tap', this);
            }
            
            this.controllers.destroy();
            delete this.controllers;
        };
    
        App.prototype.dispatch = function(e) {
            return this.controllers.lookUp(e);
        };
        return App;
    })();
    
    Controller = (function() {
        
        function Controller(app1) {
            
            this.app = app1;
            this.$inputor = this.app.$inputor;
            this.setting = null;
            this.query = null;
            this.pos = 0;
            this.range = null;
            
            this.model = new Model(this);
            this.view = new View(this);
        }
    
        Controller.prototype.init = function(setting) {
            this.setting = extend({}, this.setting || DEFUALT_CONFIG);
            this.setting = extend(this.setting, setting)
            
            this.model.reload(this.setting.data);
            
            this.renderView(this.setting.data, false);
        };
    
        Controller.prototype.destroy = function() {
            // this.trigger('beforeDestroy');
            this.model.destroy();
            this.view.destroy();
        };
    
        Controller.prototype.callDefault = function() {
            var args, error, funcName;
            funcName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            try {
                return DEFAULT_CALLBACKS[funcName].apply(this, args);
            } catch (_error) {
                error = _error;
                return $.error(error + " Or maybe At.js doesn't have function " + funcName);
            }
        };
    
        Controller.prototype.trigger = function(name, data) {
            //内部对外事件
            switch (name) {
            case 'hidden':
                //触发影藏
                break;
            case "reposition":
                //重新定位 data有值
                break;
            case "choose":
                //选中事件
                var chooseFn = this.callbacks('onChoose');
                if(chooseFn){
                    var li = data;
                    chooseFn.call(this, li);
                }
                break;
            case 'shown' :
                //显示的时候执行
                var shownFn = this.callbacks('onShown');
                if(shownFn){
                    shownFn();
                }
                break;
            default:
                break;
            }
        };
    
        Controller.prototype.callbacks = function(funcName) {
            return this.getOpt("callbacks")[funcName] || DEFAULT_CALLBACKS[funcName];
        };
    
        Controller.prototype.getOpt = function(at, default_value) {
            var e;
            try {
                return this.setting[at];
            } catch (_error) {
                e = _error;
                return default_value;
            }
        };
    
        Controller.prototype.renderView = function(data, toShow) {
            
            var maxShowLength;
            
            maxShowLength = this.getOpt("maxShowLength");
            data = data.slice(0, maxShowLength);
            
            return this.view.render(data, toShow);
        };
    
        Controller.prototype.lookUp = function(e) {
            var query, wait;
            if (this.getOpt('suspendOnComposing') && this.app.isComposing) {
                return;
            }
            
            query = this.catchQuery(e);
            this._lookUp(query);
            
            return query;
        };
    
        Controller.prototype._stopDelayedCall = function() {
            if (this.delayedCallTimeout) {
                clearTimeout(this.delayedCallTimeout);
                return this.delayedCallTimeout = null;
            }
        };
    
        Controller.prototype._lookUp = function(query) {
            
            var _callback = function(data) {
                if (data && data.length > 0) {
                    return this.renderView(data, true);
                } else {
                    //没找到数据...
                    return this.view.hide();
                }
            };
            return this.model.query(query, _callback);
        };
    
        return Controller;
    
    })();
    
    TextareaController = (function(superClass) {
        extend(TextareaController, superClass);
    
        function TextareaController() {
            return TextareaController.__super__.constructor.apply(this, arguments);
        }
    
        TextareaController.prototype.catchQuery = function() {
            
            //查询字段
            var query = this.$inputor.value;
            return this.query = query;
        };
    
        TextareaController.prototype.rect = function() {
            
            var r;
            
            var getRectFn = this.callbacks('getRect')
            if(getRectFn){
                r = getRectFn(this);
            }else{
                r = {
                        left : 0,
                        top : 0,
                    }
            }
            
            //待实现
            return r;
        };
    
        return TextareaController;
    
    })(Controller);
    
    Model = (function() {
        function Model(context) {
            this.context = context;
            this.storage = this.context.$inputor;
            this.timeflag = 0;
        }
    
        Model.prototype.destroy = function() {
            return this.storage.data = null;
        };
    
        Model.prototype.saved = function() {
            return this.fetch() > 0;
        };
    
        Model.prototype.query = function(query, callback) {
            
            var _remoteFilter, data, searchKey;
            data = this.fetch();
            searchKey = this.context.getOpt("searchKey");
            
            // 本地数据
            data = this.context.callbacks('filter').call(this.context, query, data, searchKey) || [];
            
            // 请求查询
            _remoteFilter = this.context.callbacks('remoteFilter');
            
            if (data.length > 0 || (!_remoteFilter && data.length === 0)) {
                callback.call(this.context, data);
            } else {
                this.context.renderView([]);
                //调用ajax查询
                if(this.timeflag != 0){
                    clearTimeout(this.timeflag);
                }
                var _this = this;
                this.timeflag = setTimeout(function(){
                    _remoteFilter.call(_this.context, query, _this.context.callbacks('filter'), callback);
                }, 300);
            }
        };
    
        Model.prototype.fetch = function() {
            return this.storage.data || [];
        };
    
        Model.prototype.save = function(data) {
            return this.storage.data = this.context.callbacks("beforeSave").call(this.context, data || []);
        };
    
        Model.prototype.load = function(data) {
            if (!this.saved() && data) {
                return this._load(data);
            }
        };
    
        Model.prototype.reload = function(data) {
            return this._load(data);
        };
    
        Model.prototype._load = function(data) {
            
            // ajax请求
            if (typeof data === "string") {
                
                // TODO ...
                
            } else {
                return this.save(data);
            }
        };
    
        return Model;
    
    })();
    
    View = (function() {
        function View(context) {
            this.context = context;
            this.id = this.uid();
            
            this.$el = document.createElement("div");
            this.$el.className = "back_white search_box tokeninput display_none";
            with(this.$el.style){
                position = "absolute";
                overflow = "auto";
                zIndex = "10";
                bottom = "0px";
                width = "100%";
            }
            
            var $inner = document.createElement("DIV");
            $inner.setAttribute("id", this.id);
            $inner.classList.add("tokeninput-inner")

            var $close = document.createElement("div");
                $close.className = "tokeninput-close";
            var $closeIcon = document.createElement("span");
                $closeIcon.className = "see-icon-close-round-fill v5file-delete delete tokeninput-icon";
            $close.appendChild($closeIcon);
            var _this = this;
            cmp.event.click($close,function(e){
                e.stopPropagation();
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
                if(window.SeeyonTokeninput){
                    var ev = document.createEvent('Event');
                    ev.initEvent('tap', true, true);
                    SeeyonTokeninput.handleEvent(ev);
                }
            });
            
            var $ul = document.createElement("UL");
                $ul.className = "cmp-list-content my_work_content col";
            
          //加到页面中
            $inner.appendChild($close);
            $inner.appendChild($ul);
            this.$el.appendChild($inner);
            document.body.appendChild(this.$el);
            
            this.bindEvent();
        }
    
        View.prototype.uid = function() {
            return "tokeninput-" + (Math.random().toString(16) + "000000000").substr(2, 8) + (new Date().getTime());
        };
        
        View.prototype.destroy = function() {
            return this.$el.remove();
        };
    
        View.prototype.bindEvent = function() {
            
            var _this = this;
            cmp("#" + this.id).on("tap", "li", function(e){
                e.stopPropagation();
                _this.clickItem(this);
            });
        };
        
        View.prototype.handleEvent = function(e){
            switch (e.type) {
            case "touchstart":
                //console.log("滚动开始..")
                break;
            case 'tap':
                //console.log("滚动开始..")
                break;
            case 'focus':
                //console.log("聚焦..")
                break;
            default:
                break;
            }
        }
        
        View.prototype.clickItem = function(el){
            this.choose(el);
        }
    
        View.prototype.visible = function() {
            return !this.$el.classList.contains("display_none");
        };
    
        View.prototype.choose = function(el) {
            
            this.context.trigger("choose", el);
            
            //this.hide();重新定位
            if (rect = this.context.rect()) {
                this.reposition(rect);
            }
        };
    
        View.prototype.reposition = function(rect) {
            
            with(this.$el.style){
                left = rect.left + "px";
                top = rect.top + "px";
            };
            this.context.trigger("reposition", rect);
        };
    
        View.prototype.show = function() {
            
            var rect;
            
            if (!this.visible()) {
                this.$el.classList.remove("display_none");
                this.context.trigger('shown');
            }
            if (rect = this.context.rect()) {
                this.reposition(rect);
            }
        };
    
        View.prototype.hide = function(e) {
            
            if (!this.visible()) {
                return;
            }
            this.$el.classList.add("display_none");
            
            this.context.trigger('hidden');
        };
    
        View.prototype.render = function(list, toShow) {
            var $li, $ul, i, item, len, li, tpl;
            
            $ul = this.$el.querySelector('ul');
            var newHTML = "";
            tpl = this.context.getOpt('displayTpl');
            for (i = 0, len = list.length; i < len; i++) {
                item = list[i];
                li = this.context.callbacks("tplEval").call(this.context, tpl, item);
                $li = this.context.callbacks("highlighter").call(this.context, li, this.context.query);
                newHTML += $li;
                //$ul.insertAdjacentHTML("beforeEnd", $li);
            }
            $ul.innerHTML = newHTML;
            
            if(toShow !== false){
                if(list.length > 0){
                    var imgs = $ul.querySelectorAll("img");
                    if(imgs && imgs.length > 0){
                        var baseURL = cmp.origin + "/rest/orgMember/avatar/";
                        for(var i = 0; i < imgs.length; i++){
                            var dataId = imgs[i].getAttribute("cmp-data");
                            if(dataId){
                                imgs[i].setAttribute("cmp-data", "");
                                imgs[i].src = baseURL + dataId;
                            }
                        }
                    }
                    this.show();
                }else{
                    this.hide();
                }
            }
        };
        return View;
    })();
    
    DEFAULT_CALLBACKS = {
        beforeSave : function(data) {
            return data;
        },
        filter : function(query, data, searchKey) {
            var _results, i, item, len;
            _results = [];
            for (i = 0, len = data.length; i < len; i++) {
                item = data[i];
                if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())) {
                    _results.push(item);
                }
            }
            return _results;
        },
        remoteFilter : null,
        tplEval : function(tpl, map) {
            var error, template;
            template = tpl;
            try {
                if (typeof tpl !== 'string') {
                    template = tpl(map);
                }
                return template.replace(/\$\{([^\}]*)\}/g, function(tag, key, pos) {
                    return map[key];
                });
            } catch (_error) {
                error = _error;
                return "";
            }
        },
        highlighter : function(li, query) {
            var regexp;
            if (!query) {
                return li;
            }
            regexp = new RegExp(">\\s*([^><]*?)(" + query.replace("+", "\\+") + ")([^><]*)\\s*<", 'ig');
            return li.replace(regexp, function(str, $1, $2, $3) {
                return '> ' + $1 + '<span class="cmp-select-list-keyword">' + $2 + '</span>' + $3 + ' <';
            });
        },
        beforeInsert : function(value, $li) {
            return value;
        },
        beforeReposition : function(offset) {
            return offset;
        },
        afterMatchFailed : function(at, el) {
        }
    };
    
    var DEFUALT_CONFIG = {
        data : null,
        displayTpl : "<li>${name}</li>",
        callbacks : DEFAULT_CALLBACKS,
        searchKey : "name",
        suffix : void 0,
        hideWithoutSuffix : false,
        startWithSpace : true,
        limit : 5,
        maxLen : 20,
        maxShowLength : 5,
        minLen : 0,
        displayTimeout : 300,
        delay : null,
        spaceSelectsMatch : false,
        tabSelectsMatch : true,
        editableAtwhoQueryAttrs : {},
        scrollDuration : 150,
        suspendOnComposing : true,
        zIndex : "2",//view的层级
        autoBlur : true//自动影藏，还是托管隐藏
    };
    
   return App;
})();


if(!window.AjaxErrorHander){
    /**
     * 封装处理ajax报错
     */
    window.AjaxErrorHander = function(setting){
        
        this.setting = setting || {};
        this.success = function(result){
            if(typeof this.setting.success == "function"){
                this.setting.success(result);
            }
        }

        this.error = function(err){
            var cmpHandled = cmp.errorHandler(err);
            if(cmpHandled){
                //
            }else {
                 if(typeof this.setting.error == "function"){
                     this.setting.error(err);
                 }else{
                     cmp.notification.alert(cmp.i18n("commons.exception.request1"));
                 }
            }
        }
    }
}
if(!window.errorBuilder){
    /**
     * 封装ajax报错方法
     */
    window.errorBuilder = function(setting){
        return new AjaxErrorHander(setting);
    }
}



/**
 * 快速选人控件
 * 
 * 
 * API
 * 
 * SeeyonTokeninput.destroy() 注销快速选人
 * SeeyonTokeninput.init(config) 初始化
 * SeeyonTokeninput.showNames(names) 展示名称
 * SeeyonTokeninput.getNames() 获取名字列表
 * SeeyonTokeninput.focus() input框聚焦
 * SeeyonTokeninput.relayout() 重新布局
 * 
 */
var SeeyonTokeninput = (function(){
    
 // 键盘安建
    var KEYBOARD = {
        BACKSPACE : 8,
        DELETE : 46,
        DOWN : 40,
        ENTER : 13,
        LEFT : 37,
        RIGHT : 39,
        SPACEBAR : 32,
        TAB : 9,
        UP : 38,
        COMMOND : 91
    }
    
    
    var TokenInput = function(){
        
        //配置信息
        this.config = null;
        
        //目标对象
        this.$target = null;
        
        //input对象的宽高
        this.$targetWidth = 0;
        this.$targetHeight = 0;
        
        //快速输入input最短宽度
        this.inputMinWidth = 30;
        this.input = null;
        
        //已选中数据展示容器
        this.showContainer = null;
        this.showContainerWidth = 0;
        //展示数据外层容器
        this.showOuter = null;
        this.showOuterWidth = 0;
        
        
        //需要进行缓存的业务数据
        this.cacheDatas = {
             
             //已选中数据
             selectedList : []
        }

        /*
                                 测试数据
         for(var i = 0; i < 5; i++){
            var u = {};
            u.id = "" + i;
            u.name = "大" + i;
            u.accountId = "0";
            u.accountName = "0";
            u.entityType = "Member";
            this.cacheDatas.selectedList.push(u);
        }*/
        
        
        //调试开关
        this.isDebug = false;
        
    }
    
    /**
     * 初始化
     * config.target {String} 要进行快速选人的模板input
     * config.editable {boolean}  是否可编辑
     * config.layout //取值 hScroll 横向滚动，默认值， auto - 换行布局
     * config.names {Array<String>} 初始化展示的名称，使用场景，调用模板的时候只展示
     * config.datas {JSON} 初始化人员信息， 使用场景， 人员卡片新建协同
     * config.correntAccountId {String} 当前登录单位ID
     * config.onChoose(user) {Function} 选中事件
     * config.onDelete(id) {Function} 删除事件 
     * config.onDestroy {Function} 注销事件
     * config.onChange() {Function} 内容改变
     * config.onBlur() {Function} 
     * 
     */
    TokenInput.prototype.init = function(config){

        this.config = config;
        
        this.config.layout = this.config.layout || "hScroll"; 
        
        
        this.$target = document.getElementById(this.config.target);
        this.$targetWidth = this.$target.clientWidth;
        this.$targetHeight = this.$target.clientHeight;
        this.$target.innerHTML = "";
        this.receiverAuto = null;//自动补全对象
        this.destroyed = false; 
        this.iScroll = null;
        this.tagWidths = [];//元素宽度
        this.tagNames = [];
        this.inputMaxWidth = 0;
        this.inputLefitWidth = 5;
        this.lastTapSpan = [-1, -1];//记录点击情况，用于删除
        
        if(this.isDebug){
            console.log("目标元素的宽度/高度=" + this.$targetWidth + "/" + this.$targetHeight);
        }
        
        //横向滚动
        if(this.config.layout == "hScroll"){
          //创建数据容器
            this.showOuter = document.createElement("div");
            this.showOuter.style.height = this.$targetHeight + "px";
            this.showOuter.style.lineHeight = this.$targetHeight + "px";
            with(this.showOuter.style){
                display = "inline-block";
                width = "0px";
                overflow = "hidden";
                verticalAlign = "middle";
            }
            
            this.showContainer = document.createElement("div");
            with(this.showContainer.style){
                overflow = "hidden";
                height = "100%";
            }
            
            this.showOuter.appendChild(this.showContainer);
            this.$target.appendChild(this.showOuter);
        }else{
            //自动布局...
        }
        
        //创建input框
        if(this.config.editable){
            this.input = document.createElement("input");
            this.input.setAttribute("type", "text");
            with(this.input.style){
                border = "0px";
                fontSize = "16px";
                padding = "0px";
                marginLeft = this.inputLefitWidth + "px";
                verticalAlign = "middle";
            }
            this.inputMaxWidth = this.$targetWidth - this.inputLefitWidth;
            this.input.style.width = this.inputMaxWidth + "px";
            this.input.style.height = this.$targetHeight + "px";
            this.input.style.lineHeight = this.$targetHeight + "px";
            this.$target.appendChild(this.input);
             if(cmp.HeaderFixed && cmp("#hid").length != 0){
                //固定头部操作
                cmp.HeaderFixed("#hid", this.input);
            }
        }else if(this.config.layout == "hScroll"){
            //宽度100%
            this.showOuter.style.width = this.$targetWidth + "px";
            this.showOuterWidth = this.$targetWidth;
        }
        
        if(this.config.layout == "hScroll"){
          //初始化滚动容器
            this.iScroll = new cmp.iScroll(this.showOuter, {
                hScroll: true,
                vScroll: false,
                x: 0,
                y: 0,
                bounce: false,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: true,
                handleClick: true
            });
        }
        
        //初始化已有的数据
        this._initDatas();

        //初始化快速选人
        if(this.input){
            this._initInput();
        }
        
        if(this.config.editable){
            var _this = this;
            //添加页面数据缓存事件
            document.addEventListener('beforepageredirect', function(e){ 
                _this._storDatas();
            });
        }
        
        //添加事件
        this._listen();
    }
    
    /**
     * 页面布局变动
     */
    TokenInput.prototype.relayout = function(targetWidth){
        
        this.$targetWidth = targetWidth;
        
        if(this.config.editable && this.input){
            
            this.inputMaxWidth = this.$targetWidth - this.inputLefitWidth;
            this.input.style.width = this.inputMaxWidth + "px";
        }
    }
    
    /**
     * 添加事件
     */
    TokenInput.prototype._listen = function(){
        document.body.addEventListener('tap', this);
        
        var _this = this;
        this.$target.addEventListener('tap', function(e){
            e.stopPropagation();//不触发事件
            
            //双击删除
            if(_this.receiverAuto){
                var targetE = e.target, tagName = targetE.tagName.toLocaleLowerCase();
                
                if(tagName === "span" || tagName === "i"){
                    if(tagName === "i"){
                        targetE = targetE.parentNode;
                    }
                    
                    var nowTime = new Date().getTime(), dataId = targetE.getAttribute("data-id");
                    if(dataId){
                        if(!targetE.classList.contains("cmp-active")){
                            targetE.classList.add("cmp-active")
                        }else{
                            //双击删除
                            if(dataId == _this.lastTapSpan[1] && nowTime - _this.lastTapSpan[0] < 300){
                                _this._deleteTag(targetE);
                                return;
                            }
                            _this.lastTapSpan = [nowTime, dataId];
                        }
                    }
                }
            }
        });
    }
    
    /**
     * 初始化input快速选人
     */
    TokenInput.prototype._initInput = function(){
        
        var _this = this;
        
        $s.Cmporgnization.getCmpOrganization({}, errorBuilder({
            success : function(result) {
                if(result){
                    
                    var accountId = result.id;
                    var accountName = result.n;
                    
                    result = result.children;
                    
                    for(var i = 0, len = result.length; i < len; i++){
                        var r = result[i];
                        if(r.type == "recentPersion"){
                            //格式未统一，转换格式
                            if(r.obj){
                                for(var k = 0; k < r.obj.length; k++){
                                    var obj = r.obj[k]; 
                                    obj["n"] = obj["name"];
                                    obj["p"] = obj["post"];
                                    /*if(!obj["accountId"] && accountId){
                                        obj["accountId"] = accountId;
                                        obj["accountName"] = accountName;
                                    }*/
                                    if(!obj["accountId"]){
                                        obj["accountId"] = "";
                                        obj["accountName"] = "";
                                    }
                                }
                            }
                            _this._initAutoComplete(r.obj);
                            break;
                        }
                    }
                }
            },
            error:function(e) {
                //报错
            }
        }));
    }
    
    /**
     * 校验人员是否在已选列表中
     */
    TokenInput.prototype._isSelected = function(uId){

        var ret = false;

        for(var i = 0; i < this.cacheDatas.selectedList.length; i++){
            if(this.cacheDatas.selectedList[i].id == uId){
                ret = true;
                //选中
                var spanTags = this.$target.querySelectorAll("span"); 
                if(spanTags && spanTags.length > 0){
                    for(var k = 0; k < spanTags.length; k++){
                        var spanK = spanTags[k];
                        if(spanK.getAttribute("data-id") == uId){
                            var mt = "add";
                            if(spanK.classList.contains("cmp-active")){
                                mt = "remove";
                            }
                            spanK.classList[mt]("cmp-active");
                            break;
                        }
                    }
                }
                break;
            }
        }
        return ret;
    }
    
    /**
     * 初始化快速选人
     */
    TokenInput.prototype._initAutoComplete = function(datas){

        var _this = this;
        
        if(!this.destroyed){
            this.receiverAuto = new AutoComplete({
                "target" : _this.input,
                "maxShowLength" : 10,
                data : datas,
                autoBlur : false,//托管影藏
                displayTpl : '<li data-id="${id}" data-name="${n}" data-accountId="${accountId}" data-accountName="${accountName}" class="cmp-list-cell ">'
                        +'<div style="height:auto;" class="cmp-list-cell-img cmp-radio cmp-left">'
                        /*+    '<img class=" cmp-pull-left img_setting" src="${icon}">'*/
                        + '<img class="cmp-pull-left img_setting" cmp-data="${id}"/>'
                        +'</div>'
                        +'<div class="cmp-list-cell-info">'
                        +    '<span class="cmp-ellipsis cmp-pull-left list_title_name width_69">${n}</span>'
                        +    '<h6 class="cmp-ellipsis list_cont_info">${p}</h6>'
                        +'</div>'
                    +'</li>',
                callbacks : {
                    remoteFilter : function(query, filter, callback){
                        //ajax搜索
                        var _context = this;
                        //cmp.dialog.loading(cmp.i18n("collaboration.page.lable.searching"));//查询中...
                        
                        $s.Cmporgnization.searchEntity(_this.config.correntAccountId,"1",query, "", errorBuilder({
                            success : function(result) {
                                //cmp.dialog.loading(false);
                                var datas = null;
                                if(result && result.items){
                                    datas = result.items
                                    if(filter){
                                        datas = filter(query, datas, "n");
                                    }
                                }
                                
                                callback.call(_context, datas);
                                /*if(datas && datas.length > 0){
                                    callback.call(_context, datas);
                                }else{
                                    cmp.notification.toast(cmp.i18n("collaboration.page.lable.notFound"), "center", 1000);//没有查到
                                }*/
                            },
                            error:function(e) {
                                //报错
                                //cmp.dialog.loading(false);
                            }
                        }));
                    },
                    filter : function(query, data, searchKey) {
                        
                        var _results, i, item, len;
                        _results = [];
                        if(data){
                            for (i = 0, len = data.length; i < len; i++) {
                                item = data[i];
                                
                                /*if(_this._isSelected(item.id)){
                                    //过滤重复
                                    continue;
                                }*/
                                
                                if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())) {
                                    _results.push(item);
                                }
                            }
                        }
                        return _results;
                    },
                    getRect : function(e){
                        return _this._getInputLoacation();
                    },
                    onChoose : function(li){
                        
                        var dId = li.getAttribute("data-id");
                        if(!_this._isSelected(dId)){
                            var u = {}
                            
                            u.id = li.getAttribute("data-id");
                            u.name = li.getAttribute("data-name");
                            u.accountId = li.getAttribute("data-accountId") || "";
                            u.accountName = li.getAttribute("data-accountName") || "";
                            u.entityType = "Member";
                            
                            _this._choose(u);
                        }
                    },
                    onShown : function(li){
                        _this.input.focus();
                    },
                    onKeyDown : function(e, $e){
                        e = e;
                        var c = e.keyCode || e.charCode;
                        switch(c){
                            case(KEYBOARD["BACKSPACE"]):
                                _this._scoll("end");
                                var oldVal = $e.value;
                                setTimeout(function() {
                                  var newVal = $e.value;
                                  if (oldVal === "" && newVal === "") {
                                      //获取最后一个tag
                                      var tagEl = null;
                                      if(_this.config.layout == "hScroll"){
                                          tagEl = _this.showContainer.querySelector("span:last-child");
                                      }else{
                                          var spanTags = _this.$target.querySelectorAll("span"); 
                                          if(spanTags && spanTags.length > 0){
                                              tagEl = spanTags[spanTags.length - 1];
                                          }
                                      }
                                      if(tagEl){
                                          if(tagEl.classList.contains("cmp-active")){
                                              _this._deleteTag(tagEl);
                                          }else{
                                              tagEl.classList.add("cmp-active");
                                          }
                                      }
                                  } else {
                                      $e.value = newVal.replace(/^,/, "")
                                  }
                                }, 25);
                                break;
                            case(KEYBOARD["ENTER"]):
                                if (e.preventDefault) {
                                    e.preventDefault()
                                } else {
                                    e.returnValue = false
                                }
                                break;
                            default:
                                break;
                        }
                    }
                },
                searchKey : "n"
            });
        }
    }
    
    /**
     * 获取input的位置
     */
    TokenInput.prototype._getInputLoacation = function(){
        
        var r = {
                left : 0,
                //top : this._getElementTop(this.input) + this.input.offsetHeight + 8
                top : this._getElementTop(this.$target) + this.$target.offsetHeight + 8
        }
        return r;
    }
    
    /**
     * 获得某元素在网页中的绝对顶部位置
     */
    TokenInput.prototype._getElementTop = function(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    },
    
    /**
     * 加载数据
     */
    TokenInput.prototype._initDatas = function(){
        
        //显示已有的数据，如模板里面的节点名称
        var names = this.config.names;
        
        if(this.input){
          //加载缓存数据
            var storDatas = this._getStorDatas();
            if(storDatas){
                this.delStorDatas();
                var storDatasJson = cmp.parseJSON(storDatas);
                this.cacheDatas = cmp.extend(true, this.cacheDatas, storDatasJson["cacheDatas"]);
            }else{
                var initDatas = this.config.datas;
                if(initDatas && initDatas.length > 0){
                    for(var i = 0, len = initDatas.length; i < len; i++){
                        var u = initDatas[i];
                        u.entityType = "Member";
                        this.cacheDatas.selectedList.push(u);
                    }
                }
            }
        }else{
            this.delStorDatas();
        }
        
        var ns = [];
        if(names){
            for(var i = 0; i < names.length; i++){
                ns.push({
                    "id" : "",
                    "name" : names[i]
                });
            }
        }
        
        if(this.cacheDatas.selectedList.length > 0){
            for(var i = 0; i < this.cacheDatas.selectedList.length; i++){
                var u = this.cacheDatas.selectedList[i];
                ns.push({
                    "id" : u.id,
                    "name" : u.name
                });
                this._fire("choose", u);
            }
        }
        
        this.showNames(ns);
    }
    
    
    /**
     * 处理事件
     */
    TokenInput.prototype.handleEvent = function(e){
        switch (e.type) {
            case 'touchstart':
                break;
            case 'touchmove':
                break;
            case 'touchend':
                break;
            case 'tap':
                //body点击事件
                this.receiverAuto && this.receiverAuto.blur();
                this._fire("blur");
                break;
            default:
                break;
        }
    }
    
    /**
     * 滚动
     */
    TokenInput.prototype._scoll = function(difDist){
        
        if(difDist === "end" && this.config.layout == "hScroll"){
            //滚动到最后
            this.iScroll.scrollTo(this.showOuterWidth - this.showContainerWidth, 0);
        }
    }
    
    
    /**
     * 销毁
     */
    TokenInput.prototype.destroy = function(){
        
        if(this.input != null){
            
            this.destroyed = true;
            
            this.receiverAuto && this.receiverAuto.shutdown();
            this.receiverAuto = null;
            
            this.cacheDatas.selectedList = [];
            this.input.remove();
            
            if(this.config.layout == "hScroll"){
                this.showOuter.style.width = this.$targetWidth + "px";
                this.showOuterWidth = this.$targetWidth;
            }
            
            this.input = null;
            
            this._fire("destroy");
        }
    }
    
    /**
     * 聚焦
     */
    TokenInput.prototype.focus = function(){
        var _this = this;
        if(this.input != null && _this.receiverAuto != null){
            _this.receiverAuto.focus();
        }
    }
    
    /**
     * 创建tag
     */
    TokenInput.prototype._createTag = function(name, id){
        
        var spanTag = this._creatSpanTag(name, id);
        
        //计算宽度
        this.showContainerWidth += spanTag.offsetWidth;
        
        this._resetLayout(this.showContainerWidth);
    }
    
    /**
     * 创建tag span 并插入页面
     */
    TokenInput.prototype._creatSpanTag = function(name, id){
        
        var spanTag = document.createElement("span");
        //spanTag.className = "cmp-badge cmp-badge-purple";
        spanTag.className = "cmp-badge";
        spanTag.innerHTML = "<i class='tokenname'>" + name + "</i><small>、</small>";
        //spanTag.style.marginRight = "10px";
        
        //设置不换行
        spanTag.style.whiteSpace = "nowrap";
        if(id){
            spanTag.setAttribute("data-id", id);
        }
        
        if(this.config.layout == "hScroll"){
            this.showContainer.appendChild(spanTag);
        }else{
            if(this.input){
                this.$target.insertBefore(spanTag, this.input);
            }else{
                this.$target.appendChild(spanTag);
            }
        }
        
        //宽度有误差，进行设置
        spanTag.style.width = spanTag.offsetWidth + "px";
        
        //记录元素宽度
        this.tagWidths.push(spanTag.offsetWidth);
        this.tagNames.push(name);
        
        return spanTag;
    }
    
    /**
     * 获取名字字符拼接
     */
    TokenInput.prototype.getNames = function(){
        return this.tagNames.join("、");
    }
    
    /**
     * 展示名称
     */
    TokenInput.prototype.showNames = function(names){
        
        //清空原来的
        this.tagNames = [];
        
        //清空
        if(this.config.layout == "hScroll"){
            this.showContainer.innerHTML = "";
        }else{
            var spans = this.$target.querySelectorAll("span"); 
            if(spans && spans.length > 0){
                for(var k = 0; k < spans.length; k++){
                    spans[k].remove();
                }
            }
        }
        this.showContainerWidth = 0;
        if(names){
            for(var i = 0; i < names.length; i++){
                
                var n = "";
                var id = "";
                if(typeof names[i] === "string"){
                    n = names[i];
                }else{
                    n = names[i]["name"];
                    id = names[i]["id"];
                }
                
                if(n){
                    var spanTag = this._creatSpanTag(n, id);
                    //this.showContainerWidth += spanTag.offsetWidth + 10;
                    this.showContainerWidth += spanTag.offsetWidth;
                }
            }
        }
        this._resetLayout(this.showContainerWidth);
    }
    
    /**
     * 删除tag
     */
    TokenInput.prototype._deleteTag = function(spanTag){
        if(spanTag){
            //除去过滤
            var id = spanTag.getAttribute("data-id");
            if(id){
                
                //删除选项时的事件
                var newList = [];
                for(var i = 0; i < this.cacheDatas.selectedList.length; i++){
                    if(this.cacheDatas.selectedList[i].id != id){
                        newList.push(this.cacheDatas.selectedList[i]);
                    }
                }
                this.cacheDatas.selectedList = newList;
                
                this._fire("deleteItem", id);
            }
            //this.showContainerWidth -= spanTag.offsetWidth + 10;
            this.showContainerWidth -= spanTag.offsetWidth;
            this.tagWidths.pop();//移除最后的宽度
            this.tagNames.pop();
            
            if(this.showContainerWidth < 0){
                this.showContainerWidth = 0;
            }
            
            spanTag.remove();
            this._resetLayout(this.showContainerWidth);
        }
    }
    
    /**
     * 重置宽度
     */
    TokenInput.prototype._resetLayout = function(cWidth){
        
        var inputWidth = 0, outerWidth = this.$targetWidth;
        
        if(this.isDebug){
            console.log("内层容器宽度=" + this.showContainerWidth);
        }
        
        //设置内层容器宽度
        if(this.config.layout == "hScroll"){
            this.showContainer.style.width = cWidth + "px";
        }
        
        if(this.input){
            
            if(this.config.layout == "hScroll"){
                //外层宽度计算
                if(cWidth < this.$targetWidth){
                    inputWidth = Math.max(this.$targetWidth - cWidth, this.inputMinWidth);
                }else{
                    inputWidth = this.inputMinWidth;
                }
                outerWidth = this.$targetWidth - inputWidth;
                
                this.input.style.width = (inputWidth - this.inputLefitWidth) + "px";
                
                this.showOuter.style.width = outerWidth + "px";
                this.showOuterWidth = outerWidth;
            }else{
                //自动扩展
                var eWidth = 0;
                //元素顺排，记录换行后的宽度
                for(var i = 0, len = this.tagWidths.length; i < len; i++){
                    var w = this.tagWidths[i];
                    eWidth += w;
                    if(eWidth > this.$targetWidth){
                        if(w < this.$targetWidth){
                            //换行
                            eWidth = w;
                        }else{
                            eWidth = 0;
                        }
                    }
                }
                
                //滚动条宽度设置成8px， 不同手机可能不一样
                if((eWidth + this.inputMinWidth + 8) > this.$targetWidth){
                    //换行
                    inputWidth = this.inputMaxWidth;
                }else{
                    inputWidth = this.$targetWidth - eWidth - 8;//8px是滚动条的宽度
                }
                
                this.input.style.width = (inputWidth - this.inputLefitWidth) + "px";
            }
        }
        
        if(this.config.layout == "hScroll"){
            this.iScroll.refresh();
        }
        
        //滚动到最后
        this._scoll("end");
    }
    
    /**
     * 选中事件
     */
    TokenInput.prototype._choose = function(u){
        
        //数据缓存
        this.cacheDatas.selectedList.push(u);
        this._createTag(u.name, u.id);
        
        //清空已选值
        this.input.value = "";
        //this.input.focus();
        
        //触发事件
        this._fire("choose", u);
    }

    /**
     * 触发事件
     */
    TokenInput.prototype._fire = function(code, params){
        
        switch (code) {
        case "deleteItem":
            var id = params;
            if(this.config.onDelete){
                this.config.onDelete(id);
            }
            if(this.config.onChange){
                this.config.onChange();
            }
            break;
        case "choose":
            var u = params;
            if(this.config.onChoose){
                this.config.onChoose(u);
            }
            if(this.config.onChange){
                this.config.onChange();
            }
            break;
        case "destroy" :
            if(this.config.onDestroy){
                this.config.onDestroy();
            }
            break;
        case "blur":
            if(this.config.onBlur){
                this.config.onBlur();
            }
        default:
            break;
        }
    }
    
    /**
     * 保存工作流数据
     */
    TokenInput.prototype._storDatas = function(){
        
        var storDatas = {
            "cacheDatas" : this.cacheDatas,
        }
        
        cmp.storage.save("m3_v5_tokeninput_storage", cmp.toJSON(storDatas), true); 
    }

    /**
     * 获取缓存中的数据
     */
    TokenInput.prototype._getStorDatas = function(){
        return cmp.storage.get("m3_v5_tokeninput_storage", true); 
    }

    /**
     * 删除工作流缓存数据
     */
    TokenInput.prototype.delStorDatas = function(){
        cmp.storage["delete"]("m3_v5_tokeninput_storage", true);
    }
    
    
    return new TokenInput();
    
})();

