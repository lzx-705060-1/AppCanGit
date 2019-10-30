/**
 * @description
 * @author ybjuejue
 * @createDate 2018/11/1/001
 */
;(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ?
            factory(global, true) : function (w) {
                if (!w.document) {
                    throw new Error("m3 requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window) {
    /**
     * @function classHorizontalNav
     * @description 建立头部导航菜单组件
     * @author ybjuejue
     * @createDate 2018/11/1/001
     * @params options
     * @options el：渲染的视图挂载点 支持 dom 和 选择器，
     * @options hasBar：是否开启穿梭条，
     * @options drag：是否开启拖动，
     * @options itemRender：function  用户自定义渲染模板支持 html-string 和 html-dom ，
     * @options el：渲染的视图挂载点 支持 dom 和 选择器，
     * @options warpClass：给包裹层添加类名，
     * @options activeClass：给当前激活项设置class名，
     */
    function classHorizontalNav(options) {
        var opts = typeof options === 'object' ? options : {};
        var el = opts.el;
        if (this instanceof classHorizontalNav) {
            opts.warpClass = opts.warpClass && typeof opts.warpClass === 'string' ? opts.warpClass : null;
            opts.activeClass = opts.activeClass && typeof opts.activeClass === 'string' ? opts.activeClass : 'horizontal-active';
            opts.autoEmit = opts.autoEmit === false || opts.autoEmit === 0 ? false : true;
            delete opts.el;
            this.$opts = opts;
            this.buildHorizontalNav();
            this.$eq = opts.eq || this.$eq;
            this.$mount(el)
        }
    }
    classHorizontalNav.prototype.isDom = function (dom) {
        if (typeof HTMLElement === 'object') {
            return dom instanceof HTMLElement;
        } else {
            return dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
        }
    };
    classHorizontalNav.prototype.setTouchEvent = function (position) {
        var _this = this;
        if (_this.isDom(_this.$warp) && _this.$opts.drag === true) {
            _this.$warp.addEventListener('touchstart', function (e) {
                position.x = e.touches[0].clientX || 0;
                position.y = e.touches[0].clientY || 0;
                this.style.webkitTransitionDuration = '';
                this.style.transitionDuration = '';
                this.removeEventListener('touchmove', moveFn, false);
                this.addEventListener('touchmove', moveFn, false);
            }, false);
            _this.$warp.addEventListener('touchend', function (e) {
                this.style.webkitTransitionDuration = '';
                this.style.transitionDuration = '';
                position.x = 0;
                position.y = 0;
                this.removeEventListener('touchmove', moveFn, false);
            }, false);

            function moveFn(e) {
                this.style.webkitTransition= 'left 0s';
                this.style.transition = 'left 0s';
                var elWidth = _this.$el.offsetWidth;
                var left = parseFloat(window.getComputedStyle(this).left);
                var minLeft = elWidth - this.offsetWidth;
                left = (left + e.touches[0].clientX - position.x);
                if (left <= minLeft && minLeft < 0) {
                    left = minLeft;
                } else if (left >= 0 || minLeft>=0) {
                    left = 0
                }
                this.style.left = left + 'px';
                position.x = e.touches[0].clientX;
            }
        }
    };
    classHorizontalNav.prototype.itemRender = function (item) {
        var itemNode = null;
        if (typeof this.$opts.itemRender === 'function') {
            itemNode = this.$opts.itemRender(item);
        } else {
            itemNode = '<div class="horizontal-item">' + (typeof item === 'string' ? item : JSON.stringify(item) + '') + '</div>';
        }
        if (this.isDom(itemNode)) {
            return itemNode;
        } else {
            var warp = document.createElement('div');
            warp.innerHTML = itemNode;
            itemNode = warp.childNodes[0];
        }
        return this.isDom(itemNode) ? itemNode : null;
    };
    classHorizontalNav.prototype.buildHorizontalNav = function () {
        var warp = document.createElement('div'), nav = document.createElement('div'),
            beforeNode = document.createElement('span'), datas = this.$opts.data,
            _this = this;
        var callback = typeof _this.$opts.onclick === 'function' ? _this.$opts.onclick : function () {
        };
        _this.dataNode = {};
        warp.className = 'horizontal-nav-warp';
        nav.className = 'horizontal-nav' + (_this.$opts.warpClass ? ' '+_this.$opts.warpClass : '');
        beforeNode.className = 'horizontal-before';
        nav.style = 'font-size: 0;\n' +
            '            left: 0;\n' +
            '            width: max-content;\n' +
            '            position: relative;';
        warp.style = 'width: auto;\n' +
            '            position: relative;\n' +
            '            white-space: nowrap;\n' +
            '            word-break: keep-all;';
        beforeNode.style = '-webkit-transform: translateX(-50%);\n' +
            '            transform: translateX(-50%);\n' +
            '            display: inline-block;\n' +
            '            position: absolute;';
        nav.appendChild(warp);
        if (!datas && (datas !== 0)) {
            return ''
        }
        datas = Object.prototype.toString.call(datas) === '[object Array]' ? datas : [datas.toString()];
        var forAccount = -1;
        for (var index = 0; index < datas.length;index++) {
            var item = _this.itemRender(datas[index]);
            _this.dataNode[index] = item;
            if (_this.isDom(item)) {
                forAccount++;
                if (forAccount === 0) {
                    _this.$eq = index;
                }
                (function (eq, dom) {
                    var reg = /^\s|\s$/;
                    var classList = dom.className.replace(reg, '').split(" ");
                    if (classList.indexOf('horizontal-item') < 0) {
                        classList.unshift('horizontal-item');
                        dom.className = classList.join(" ");
                    }
                    dom.setAttribute('data-horizontal-eq', eq);
                    dom.addEventListener(cmp ? 'tap':'click', function (e) {
                        var stop = callback.apply(this, [e, eq]);
                        _this.$eq = eq;
                        if (stop !== false) {
                            _this.go(eq);
                        }
                        if (typeof stop === 'boolean') {
                            return stop;
                        }
                    }, false);
                    warp.appendChild(dom);
                })(index, _this.dataNode[index]);

            }
        }
        if (_this.$opts.hasBar) {
            nav.appendChild(beforeNode);
            _this.$before = beforeNode;
        }
        _this.$warp = nav;
        this.setTouchEvent({x: 0, y: 0});
    };
    classHorizontalNav.prototype.getMountDom = function (dom) {
        var tempDom = dom;
        if (typeof tempDom === 'string') {
            tempDom = document.querySelector(dom);
        }
        return this.isDom(tempDom) ? tempDom : null;
    };
    classHorizontalNav.prototype.go = function (eq) {
        var goNode = this.dataNode[eq], left = -60, width = 0, reg = /^\s|\s$/, brothers = [];
        if (this.isDom(goNode) && this.isDom(this.$el)) {
            brothers = this.$warp.querySelectorAll('.horizontal-item');
            for (var j = 0; j < brothers.length; j++) {
                var itemClass = brothers[j].className.replace(reg, '').split(" ");
                var classEq = itemClass.indexOf(this.$opts.activeClass);
                if (brothers[j] != goNode) {
                    if (classEq > -1) {
                        itemClass.splice(classEq, 1);
                        brothers[j].className = itemClass.join(" ");
                    }
                } else {
                    if (classEq === -1) {
                        itemClass.push(this.$opts.activeClass);
                        goNode.className = itemClass.join(" ");
                    }
                }
            }
            left = goNode.offsetLeft;
            width = goNode.offsetWidth;
            var elWidth = this.$el.offsetWidth;
            var warpWidth = this.$warp.offsetWidth;
            var minLeft = elWidth - warpWidth;
            var centerLeft = left + (width / 2);
            var distanceLeft = elWidth / 2 - centerLeft;
            if (distanceLeft <= minLeft && minLeft < 0) {
                distanceLeft = minLeft;
            } else if (distanceLeft >= 0 || minLeft >= 0) {
                distanceLeft = 0
            }
            this.$warp.style.left = (distanceLeft) + 'px';
            this.$before && (this.$before.style.left = (left + (width / 2)) + 'px');
        }
    };
    classHorizontalNav.prototype.$destroy = function () {
        if (this.$warp) {
            if (this.$warp.parentElement) {
                this.$warp.parentElement.removeChild(this.$warp);
            }
        }
        for (var i in this) {
            this[i] = undefined;
        }
    };
    classHorizontalNav.prototype.$mount = function (el) {
        var $el = this.getMountDom(el);
        if ($el) {
            this.$el = $el;
            if (this.$el.querySelector('.horizontal-nav')) {
                this.$el.removeChild(this.$el.querySelector('.horizontal-nav'));
            }
            this.$el.appendChild(this.$warp);
            if (this.$eq || this.$eq == 0) {
                if (this.$opts.autoEmit) {
                    if (cmp) {
                       cmp.event.trigger('tap', this.dataNode[this.$eq])
                    } else{
                        this.dataNode[this.$eq].click();
                    }

                } else {
                    this.go(this.$eq);
                }
            }
        }
    };
    if (window.define && window.define.cmd) {
        define(function(require, exports, module){
            module.exports = classHorizontalNav;
        });

    }
    window.classHorizontalNav = classHorizontalNav;
});
