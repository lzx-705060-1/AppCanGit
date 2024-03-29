(function (_, window, doc) {
    var m = Math, _bindArr = [],
        dummyStyle = doc.createElement('div').style,
        vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }
            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

    // Style properties
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        isIpad = navigator.userAgent.indexOf('iPad') > -1,
        isGtIos7 = Boolean(navigator.userAgent.match(/OS [7-9]_\d[_\d]* like Mac OS X/i)),
        isSperspective = prefixStyle('perspective') in dummyStyle,
        has3d = isIpad ? (isGtIos7 ? isSperspective : false) : isSperspective,
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

        RESIZE_EV = 'onorientationchange',
        RESIZE_EV_2 = 'resize',//两个事件都绑定
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        TRNEND_EV = (function () {
            if (vendor === false) return false;

            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),

        nextFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return setTimeout(callback, 1);
                };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),

    // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;
            that.wrapper = typeof el == 'object' ? el : doc.querySelector(el);
            if(!options.special){
                that.wrapper.style.overflow = 'hidden';
            }
            var tabViewContent = that.wrapper.parentNode;
            var isTabView = tabViewContent && tabViewContent.classList.contains('cmp-control-content');
            var isPopover = tabViewContent && tabViewContent.classList.contains('cmp-popover');
            if (isTabView) {
                var bodyHeight = window.innerHeight;
                var headerView = document.querySelector(".cmp-bar-nav");
                var headerHeight = headerView ? headerView.offsetHeight : 0;
                var footerView = document.querySelector(".cmp-bar-footer");
                var footerHeight = footerView ? footerView.offsetHeight : 0;
                var tabItemContentParentView = tabViewContent.parentNode;
                if (tabItemContentParentView.classList.contains("cmp-slider-group")) {
                    tabItemContentParentView = tabItemContentParentView.parentNode;
                }
                var segmentedTileView = tabItemContentParentView.querySelector(".cmp-segmented_title_content");
                var segmentedTileHeight = segmentedTileView ? segmentedTileView.offsetHeight : 0;
                var ctrlView = tabItemContentParentView.querySelector(".cmp-segmented-control");
                var segmentedCtrlHeight = 0;
                if (ctrlView && ctrlView.parentNode == tabItemContentParentView) {
                    segmentedCtrlHeight = ctrlView.offsetHeight;
                }
                //if(document.querySelectorAll('.cmp-segmented_title_content').length>0){
                //    segmentedTileHeight=0;
                //}
                tabViewContent.style.height = (bodyHeight - (headerHeight + footerHeight + segmentedCtrlHeight + segmentedTileHeight)) + "px";
            }

            if (isPopover) {
                tabViewContent.style.display = "block";
            }

            that.scroller = that.wrapper.children[0];
            that.linkscroller = {};//联动scroll滚动对象记录器
            that.linkRecode = {};//联动scroll记录器
            that.linkWrapperRecode = 0;//递增的scroll数量记录器

            that.translateZ = translateZ;
            // Default options
            that.options = {
                hScroll: false,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                handleClick: true,

                // Events
                onRefresh: null,
                onBeforeScrollStart: function (e) {
                    var target = e.target;
                    while (target.nodeType != 1) {
                        target = target.parentNode;
                    }
                    if (target.tagName != 'SELECT' && target.tagName != 'TEXTAREA' && target.tagName != 'INPUT') {
                        e.preventDefault();
                    }
                    //e.preventDefault();
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null
            };

            // User defined options
            for (i in options) that.options[i] = options[i];

            // Set starting position
            that.x = that.options.x;
            that.y = that.options.y;

            // Normalize options
            that.options.useTransform = hasTransform && that.options.useTransform;


            that.options.useTransition = hasTransitionEnd && that.options.useTransition;


            // Set some default styles
            that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
            that.scroller.style[transitionDuration] = '0';
            that.scroller.style[transformOrigin] = '0 0';
            if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

            if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
            else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

            that.refresh();

            that._bind(RESIZE_EV, window);
            that._bind(RESIZE_EV_2, window);
            that._bind(START_EV);

            if (isPopover) {
                tabViewContent.style.display = "none";
            }
        };

// Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        handleEvent: function (e) {
            var that = this;
            switch (e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV:
                    that._move(e);
                    break;
                case END_EV:
                case CANCEL_EV:
                    that._end(e);
                    break;
                case RESIZE_EV:
                case RESIZE_EV_2:
                    that._resize();
                    break;
                case TRNEND_EV:
                    that._transitionEnd(e);
                    break;
            }
        },

        _resize: function () {
            var that = this;
            setTimeout(function () {
                that.refresh();
            }, isAndroid ? 200 : 0);
        },

        _pos: function (x, y) {
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
                for(var i in this.linkRecode){
                    if(this.linkscroller[i]){
                        this.linkscroller[i].style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
                    }
                }

            } else {
                x = m.round(x);
                y = m.round(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
                for(var i in this.linkRecode){
                    if(this.linkscroller[i]){
                        this.linkscroller[i].style.left = x + 'px';
                        this.linkscroller[i].style.top = y + 'px';
                    }
                }

            }

            this.x = x;
            this.y = y;


        },


        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);


            if (that.options.useTransition) that._transitionTime(0);

            that.moved = false;
            that.animating = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    // 将/[^0-9-]/g 修改成 /[a-zA-Z]/g
                    x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9\-.,]/g, '');
                    y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9\-.,]/g, '');
                }

                if (x != that.x || y != that.y) {
                    if (that.options.useTransition) {
                        that._unbind(TRNEND_EV);
                    } else {
                        cancelFrame(that.aniTime);
                    }
                    that.steps = [];
                    that._pos(x, y);
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                }
            }

            that.absStartX = that.x;	// Needed by snap threshold
            that.absStartY = that.y;

            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV, window);
            that._bind(END_EV, window);
            that._bind(CANCEL_EV, window);
        },

        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,
                timestamp = e.timeStamp || Date.now();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);


            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;
            that._pos(newX, newY);
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },

        _end: function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = {dist: 0, time: 0},
                momentumY = {dist: 0, time: 0},
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                newDuration;

            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

            if (!that.moved) {
                if (hasTouch && this.options.handleClick) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            //target.dispatchEvent(ev);//注释掉主动触发事件，避免页面绑定的onclick事件被执行两次
                        }
                    }, 0);
                }
                that._resetPos(400);
                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = {
                    dist: 0,
                    time: 0
                };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = {
                    dist: 0,
                    time: 0
                };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);


                that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (!!that.pulldown && that.options.down) {
                that.minScrollY = that.options.down.height;
            } else {
                that.minScrollY = 0;
            }

            that._resetPos(200);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                }
                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },


        _transitionEnd: function (e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind(TRNEND_EV);

            that._startAni();
        },


        /**
         *
         * Utilities
         *
         */
        _startAni: function () {
            var that = this,
                startX = that.x, startY = that.y,
                startTime = Date.now(),
                step, easeOut,
                animate;

            if (that.animating) return;

            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }

            step = that.steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;

            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind(TRNEND_EV);
                else that._resetPos(0);
                return;
            }

            animate = function () {
                var now = Date.now(),
                    newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function (time) {
            time += 'ms';
            this.scroller.style[transitionDuration] = time;
            for(var i in this.linkRecode){
                if(this.linkscroller[i]) this.linkscroller[i].style[transitionDuration] = time;
            }

        },

        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
                speed = m.abs(dist) / time,
                newDist = (speed * speed) / (2 * deceleration),
                newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return {dist: newDist, time: m.round(newTime)};
        },

        _offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return {left: left, top: top};
        },


        _bind: function (type, el, bubble) {
            _bindArr.concat([el || this.scroller, type, this]);
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
            for(var i in this.linkRecode){
                if(this.linkscroller[i]){
                    this.linkscroller[i].removeEventListener(type, this, !!bubble);
                }
            }

        },


        /**
         *
         * Public methods
         *
         */
        destroy: function () {
            var that = this;

            that.scroller.style[transform] = '';


            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(RESIZE_EV_2, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);


            if (that.options.useTransition) that._unbind(TRNEND_EV);

            if (that.options.onDestroy) that.options.onDestroy.call(that);
            //清除所有绑定的事件
            for (var i = 0, l = _bindArr.length; i < l;) {
                _bindArr[i].removeEventListener(_bindArr[i + 1], _bindArr[i + 2]);
                _bindArr[i] = null;
                i = i + 3
            }
            _bindArr = [];
        },

        refresh: function () {
            var that = this, offset;

            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);


            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;


            that.scroller.style[transitionDuration] = '0';
            for(var i in that.linkRecode){
                if(that.linkscroller[i]){
                    that.linkscroller[i].style[transitionDuration] = '0';
                }
            }
            that._resetPos(400);
        },

        scrollTo: function (x, y, time, relative) {
            var that = this,
                step = x,
                i, l;

            that.stop();

            if (!step.length) step = [{x: x, y: y, time: time, relative: relative}];

            for (i = 0, l = step.length; i < l; i++) {
                if (step[i].relative) {
                    step[i].x = that.x - step[i].x;
                    step[i].y = that.y - step[i].y;
                }
                that.steps.push({x: step[i].x, y: step[i].y, time: step[i].time || 0});
            }

            that._startAni();
        },

        scrollToBottom: function (time, relative) {
            this.scrollTo(0, this.maxScrollY, time, relative);
        },

        scrollToElement: function (el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left) * 2, m.abs(pos.top) * 2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function (pageX, pageY, time) {
            var that = this, x, y;

            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);


            x = -that.wrapperW * pageX;
            y = -that.wrapperH * pageY;
            if (x < that.maxScrollX) x = that.maxScrollX;
            if (y < that.maxScrollY) y = that.maxScrollY;


            that.scrollTo(x, y, time);
        },

        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV, window);
            this._unbind(END_EV, window);
            this._unbind(CANCEL_EV, window);
        },

        enable: function () {
            this.enabled = true;
        },

        stop: function () {
            if (this.options.useTransition) this._unbind(TRNEND_EV);
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },

        isReady: function () {
            return !this.moved && !this.animating;
        }
    };

    function prefixStyle(style) {
        if (vendor === '') return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    dummyStyle = null;	// for the sake of it

    //if (typeof exports !== 'undefined') exports.iScroll = iScroll;
    //else window.iScroll = iScroll;
    /**
     * iscroll扩展方法，增加联动滚动区域
     * @param option
     */
    iScroll.prototype.bind = function(option){
        var self = this;
        var linkOption = _.extend({
            linkDiv:null,//绑定的联动的div
            vBind:true,//纵向绑定
            hBind:false,//横向绑定
            left:null,
            top:null
        },option);
        var linkDiv = (typeof linkOption.linkDiv == "object")?linkOption.linkDiv:document.querySelector(linkOption.linkDiv);
        self.linkscroller[self.linkWrapperRecode] = linkDiv.children[0];
        var wrapperH = self.wrapperH;
        var wrapperW = self.wrapperW;
        var wrapperTop = linkOption.top?linkOption.top:self.wrapper.offsetTop;
        var wrapperLeft = linkOption.left?linkOption.left:self.wrapper.offsetLeft;
        var hScroll = self.options.hScroll;
        var vScroll = self.options.vScroll;
        linkDiv.style.overflow = "hidden";
        linkDiv.style.position = "absolute";
        if(linkOption.vBind && !linkOption.hBind){
            linkDiv.style.top = wrapperTop + "px";
            linkDiv.style.height = wrapperH + "px";
            linkDiv.style.width = "50px";//暂时定成50
            if( linkOption.left){
                linkDiv.style.left = wrapperLeft + "px";
            }
        }else if(!linkOption.vBind && linkOption.hBind){
            linkDiv.style.left = wrapperLeft + "px";
            linkDiv.style.width = wrapperW + "px";
            linkDiv.style.height = "50px";
            if(linkOption.top){
                linkDiv.style.top = wrapperTop + "px";
            }
        }else {

        }

        self.linkscroller[self.linkWrapperRecode].style[transitionProperty] = self.options.useTransform ? cssVendor + 'transform' : 'top left';
        self.linkscroller[self.linkWrapperRecode].style[transitionDuration] = '0';
        self.linkscroller[self.linkWrapperRecode].style[transformOrigin] = '0 0';
        self._linkBind(self.linkscroller[self.linkWrapperRecode],RESIZE_EV, window);
        self._linkBind(self.linkscroller[self.linkWrapperRecode],RESIZE_EV_2, window);
        self._linkBind(self.linkscroller[self.linkWrapperRecode],START_EV);
        self._linkBind(self.linkscroller[self.linkWrapperRecode],MOVE_EV, window);
        self._linkBind(self.linkscroller[self.linkWrapperRecode],END_EV, window);
        self._linkBind(self.linkscroller[self.linkWrapperRecode],CANCEL_EV, window);
        self.linkscroller[self.linkWrapperRecode].classList.add("binded");
        self.linkRecode[self.linkWrapperRecode] = "";
        self.linkWrapperRecode ++;

    };
    iScroll.prototype._linkBind = function(linkscroller,type, el, bubble){
        linkscroller.addEventListener(type, this, !!bubble);
    };

    _.iScroll = iScroll;

})(cmp, window, document);