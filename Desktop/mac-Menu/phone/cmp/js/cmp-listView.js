(function(_){
    var CMP_LISTVIEW_I18N_LOADED = false;
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-listView',function(){
        CMP_LISTVIEW_I18N_LOADED = true;
        _.event.trigger("cmp-listView-init",document);
    },cmpBuildversion);
    
    //====================================================================iscroll4 start==============================//
    var m = Math, _bindArr = [],
        dummyStyle = document.createElement('div').style,
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
        isBeyondIOS7 = Boolean(!navigator.userAgent.match(/OS [5-7]_\d[_\d]* like Mac OS X/i)),
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
        iscrollInvoked = false,

    // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;
            that.wrapper = typeof el == 'object' ? el : document.querySelector(el);
            if(options && !options.special){
                that.wrapper.style.overflow = 'hidden';
            }
            var tabViewContent = that.wrapper.parentNode;
            // var isTabView = tabViewContent && tabViewContent.classList.contains('cmp-control-content');
            var isPopover = tabViewContent && tabViewContent.classList.contains('cmp-popover');
            CMPFULLSREENHEIGHT = CMPFULLSREENHEIGHT<=window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;//listview这里再防护一下
            var bodyHeight = CMPFULLSREENHEIGHT<=window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;
            // if (isTabView) {
            //     var bodyHeight = CMPFULLSREENHEIGHT<=window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;
            //     var headerView = document.querySelector(".cmp-bar-nav");
            //     var headerHeight = headerView ? headerView.offsetHeight : 0;
            //     var footerView = document.querySelector(".cmp-bar-footer");
            //     var footerHeight = footerView ? footerView.offsetHeight : 0;
            //     var tabItemContentParentView = tabViewContent.parentNode;
            //     if (tabItemContentParentView.classList.contains("cmp-slider-group")) {
            //         tabItemContentParentView = tabItemContentParentView.parentNode;
            //     }
            //     var segmentedTileView = tabItemContentParentView.querySelector(".cmp-segmented_title_content");
            //     var segmentedTileHeight = segmentedTileView ? segmentedTileView.offsetHeight : 0;
            //     var ctrlView = tabItemContentParentView.querySelector(".cmp-segmented-control");
            //     var segmentedCtrlHeight = 0;
            //     if (ctrlView && ctrlView.parentNode == tabItemContentParentView) {
            //         segmentedCtrlHeight = ctrlView.offsetHeight;
            //     }
            //     tabViewContent.style.height = (bodyHeight - (headerHeight + footerHeight + segmentedCtrlHeight + segmentedTileHeight)) + "px";
            // }
            that.computeWrapper(bodyHeight);
            iscrollInvoked = true;
            if (isPopover) {
                tabViewContent.style.display = "block";
            }

            that.scroller = that.wrapper.children[0];
            that.linkscroller = {};//联动scroll滚动对象记录器
            that.linkRecode = {};//联动scroll记录器
            that.linkWrapperRecode = 0;//递增的scroll数量记录器

            that.translateZ = translateZ;
            that.moveTimeStamp = 0;
            that.moveTimeStampTimer = null;
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
                    if (target.tagName != 'SELECT' && target.tagName != 'TEXTAREA' && target.tagName != 'INPUT' && !that.options.zoom) {//缩放的时候不阻止此事件 2018-06-20增加缩放修改
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
            // if scroller has cmp-pull-widget-div to set y 20181022
            var widgetNode = that.scroller.querySelector('.cmp-pull-widget');
            if (widgetNode) {
               that.y = - (widgetNode.offsetHeight);
            }
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
        computeWrapper:function(bodyHeight){
            var that = this;
            var tabViewContent = that.wrapper.parentNode;
            var isTabView = tabViewContent && tabViewContent.classList.contains('cmp-control-content');
            if (isTabView) {//todo  整一下横竖屏   要考虑软键盘弹出来的情况
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
                tabViewContent.style.height = (bodyHeight - (headerHeight + footerHeight + segmentedCtrlHeight + segmentedTileHeight)) + "px";
            }
        },
        refreshWrapper:function(options){
            var self = this;
            self.wrapper.style.width = options.wrapperW + "px";
            self.wrapper.style.height = options.wrapperH + "px";
            self.refresh();
        },
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
                    that._orientationchange();
                    break;
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
        _orientationchange:function(){
            var that = this;
            _.href.fouceAreaBlur();//让输入框失去焦点
            setTimeout(function () {
                that.computeWrapper(window.innerHeight);//横竖屏切换重新计算一下wrapper高度
                
                that.refresh();
            }, isAndroid ? 200 : 0);
        },


        _pos: function (x, y) {
            if (this.zoomed) return;//新增放大缩小
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;
            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
                for(var i in this.linkRecode){
                    if(this.linkscroller[i]){
                        this.linkscroller[i].style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
                    }
                }
                if(this.additionalParts){//额外部件的滚动效果要和整体一致
                    if(this.y > 0){//如果是在头部滚动区之外才进行滚动效果一致
                        this.additionalParts.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
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
            /* 新增过度*/
            var pullTopSleepNode = this.wrapper.querySelector('.cmp-pull-top-pocket.sleep .cmp-pull');
            var pullTopNode = this.wrapper.querySelector('.cmp-pull-top-pocket .cmp-pull');
            var positionPercent = (y / 50);
            positionPercent = Math.pow(positionPercent >= 1 ? 1 : positionPercent <=0 ? 0 : positionPercent, 2);
            if (pullTopNode && pullTopSleepNode) {
                pullTopNode.style.opacity = positionPercent >= 1 ? 1 : positionPercent <=0 ? 0 : positionPercent;
            } else if (pullTopNode) {
                pullTopNode.style.opacity = '';
            }
        },


        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y;
            if(_.platform.wechatOrDD && ! that.options.zoom){
                e.preventDefault();//微信端阻止微信浏览器的自带的回弹效果，缩放的时候不阻止此事件 2018-06-20增加缩放修改
            }

            if(that.moveTimeStampTimer){
                clearInterval(that.moveTimeStampTimer);
                that.moveTimeStampTimer = null;
            }
            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);
            if (!that.enabled) return;

//            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);


            if (that.options.useTransition) that._transitionTime(0);

            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;
            if(that.options.zoom && hasTouch && e.touches.length > 1){//执行缩放
                that.zoomed = true;
                that.onZoomStart(e);
            }
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


            if(that.options.zoom && hasTouch && e.touches.length > 1){//执行缩放
                that.zoomed = true;
                that.onZoom(e);
                return;
            }
            if(hasTouch &&e.touches.length > 1) {
                return;
            }
            var bodyH = CMPFULLSREENHEIGHT<=window.innerHeight?window.innerHeight:CMPFULLSREENHEIGHT;
            if(point.pageY<= 0 ||  point.pageY >= bodyH){  //防护ios7以上，滚动到了屏幕以外，touchend未生效的情况，android不管
                if(_.os.ios &&isBeyondIOS7){
                    if(that.moved){
                        that.moved = false;
                    }
                    that._end(e,true);
                    return;
                }
            }
            if(_.os.ios && isBeyondIOS7){//用时间来防护ios不触发touchend导致的页面卡住的情况
                var protectY = 0;
                if(that.topCaption) protectY += that.topCaption.offsetHeight;
                if(that.widget) protectY += that.widget.offsetHeight;
                if(that.moveTimeStamp != timestamp && that.y > that.minScrollY + protectY){
                    that.moveTimeStamp = timestamp;
                    if(that.moveTimeStampTimer){
                        clearInterval(that.moveTimeStampTimer);
                        that.moveTimeStampTimer = null;
                    }
                }else {
                    if(that.moveTimeStampTimer){
                        clearInterval(that.moveTimeStampTimer);
                        that.moveTimeStampTimer = null;
                    }
                }
                that.moveTimeStampTimer = setTimeout(function(){
                    if(that.moved){
                        that.moved = false;
                    }
                    that._end(e,true);
                    return;
                },1000);

            }

            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;
            that.minScrollY = that.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;

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

        _end: function (e,offset) {
            var that = this;
            if(that.moveTimeStampTimer){
                clearInterval(that.moveTimeStampTimer);
                that.moveTimeStampTimer = null;
            }
            if (!offset && hasTouch && e.touches.length !== 0){//防护暴力刷新的操作
                that.scrollTo(0, 0, 0);
                return
            };


            var point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = {dist: 0, time: 0},
                momentumY = {dist: 0, time: 0},
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                newDuration;

            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;
            if(that.zoomed){
                that.onZoomEnd();
                return;
            }
            that.minScrollY = that.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY ;

            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

            if (!that.moved) {
                if(hasTouch){
                    if(that.doubleTapTimer && that.options.doubleTapZoom){
                        // Double tapped
                        clearTimeout(that.doubleTapTimer);
                        that.doubleTapTimer = null;
                        that.doubleTapToZoom();
                    }else if (this.options.handleClick) {
                        that.doubleTapTimer = setTimeout(function () {
                            that.doubleTapTimer = null;

                            // Find the last touched element
                            target = point.target;
                            while (target.nodeType != 1) target = target.parentNode;

                            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                ev = document.createEvent('MouseEvents');
                                ev.initMouseEvent('click', true, true, e.view, 1,
                                    point.screenX, point.screenY, point.clientX, point.clientY,
                                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                    0, null);
                                ev._fake = true;
                                target.dispatchEvent(ev);//注释掉主动触发事件，避免页面绑定的onclick事件被执行两次
                            }
                        }, that.options.zoom ? 250 : 0);
                    }
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
            //解决快速下拉时候的end事件触发混乱问题
            setTimeout(function() {that._resetPos(200);}, 0);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
            if(resetY == 0){
                if(that.scrollerH < that.wrapperH && that.widget&&that.widgetShow){//适配有widget的情况，但是页面的列表数据滚动高度小于wrapper高度时
                    if(that.y < that.topOffset){//如果超过了最小则就是最小
                        resetY = that.topOffset;
                    }else {//否还是当前的y值
                        resetY = parseInt(that.y);
                    }

                }
            }

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
            _bindArr.concat([el || this.wrapper, type, this]);
            (el || this.wrapper).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.wrapper).removeEventListener(type, this, !!bubble);
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
            if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = that.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY ;
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
            top:null,
            width:null//宽度
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
            linkDiv.style.width = linkOption.width + "px";
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

    //==============================================================iscroll4 end=======================================//


    //==============================================================listview start====================================//
    //组件缓存，防止多次初始化
    var pageMap = {};

    var getNoDataHtml = function(purpose){
        var noDataHtml = '<div class="StatusContainer">' ;
        switch (purpose) {
            case 1:
                noDataHtml +=
                    //'   <span class="cmp-icon m3-icon-page-nodata"></span>' +  //无内容
                    '   <div class="nocontent"></div> ' +  //无内容
                    '   <span class="text nocontent_text">'+_.i18n("cmp.listView.noData4Default")+'</span>' +
                    '</div>';
                break;
            case 2:
                noDataHtml +=
                    '    <span class="cmp-icon see-icon-searchnoresults"></span>' +  //无搜索结果
                    '   <span class="text">'+_.i18n("cmp.listView.noData4Search")+'</span>' +
                    '</div>';
                break;
            default :
                break;
        }
        return noDataHtml;
    };
    var pullRefreshMap = {};

    /**
     * 下拉上拉刷新 初始化
     * @param container
     * @param opts 配置项
     */
    var pullRefresh = function (container, opts) {
        var self = this;
        var optTime = typeof opts.config.minTime === 'number' ? opts.config.minTime : 500;
        self.loadingTime = new Date().getTime();
        self.loadingTimer = null;
        self.minTime = optTime < 0 ? 500 : optTime;
        self._opts = opts;
        self.pullRefreshScroll = true;
        self._container = container;
        var containerDiv = document.querySelector(container);
        self.topOffset = self._getTopOffset(containerDiv);
        self._cmpScroll = containerDiv.querySelector(".cmp-scroll");
        if(!self._cmpScroll) {  //查询到该元素是为了渲染无数据
            self._cmpScrol = containerDiv.childNodes;
            if(!self._cmpScroll) self._cmpScroll = containerDiv;
        }
        _.iScroll.apply(this, arguments);
        if (opts.down || opts.up) {
            if(!CMP_LISTVIEW_I18N_LOADED){
                document.addEventListener("cmp-listView-init",function(){
                    self.init();
                });
            }else {
                self.init();
            }            
        }

    };
    pullRefresh.prototype = _.iScroll.prototype;
    pullRefresh.prototype._getTopOffset = function(container){
        var topOffset = 0;
        var widget = container.querySelector(".cmp-pull-widget");
        if(widget && !widget.classList.contains("cmp-init-display-none")){
            topOffset = widget.offsetHeight;
            if(!topOffset){
                container.classList.add("cmp-active");
                topOffset = widget.offsetHeight;
                container.classList.remove("cmp-active");
                if(!topOffset){
                    container.parentElement.classList.add("cmp-active");
                    topOffset = widget.offsetHeight;
                    container.parentElement.classList.remove("cmp-active");
                }
            }
            widget.classList.add("hiddenState");
        }
        return -topOffset;
    };
    //====================事件部分===============//
    pullRefresh.prototype.init = function () {
        var self = this;
        var opts = self._opts;
        self.initAll = true;
        self._setInitParam();
        self._setScrollParam();
        //下拉刷新
        self._createPullDownLayer();//创建下拉层
        self._createPullUpLayer();//创建上拉层
        if(!opts.down){
            self.options.down = {contentprepage:_.i18n("cmp.listView.prePageText")};
        }
        if(self.options.config.reverse){
            self._pullupRefresh();
        }else {
            self.pullupLoading();//自动上拉一次，加载数据
        }
        if (opts.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
            self._initFristCaption();
        }
    };
    pullRefresh.prototype._setInitParam = function(){
        var self = this;
        self.currentP = {};
        self.crumbs = (self._opts.config.crumbsID)?self._opts.config.crumbsID:null;
        self.currentP[self.crumbs] = {};
        self.currentP[self.crumbs].pageNo = 1;
        self.currentP[self.crumbs].finished = false;
        self.currentP[self.crumbs].refreshTimeScale = new Date().getTime();//下拉刷新时间刻度记录
        self.isLoadError = {};
        self.isLoadError["up"] = false;
        self.isLoadError["down"] = false;
        self.finished = false;
        self.pageNo = 1;
        self.pagingNo = 1;
        self.endOnePage = false;
        self.intiBindNextPageEvent = true;
        self.initNextPageLoadData = false;
        self.prevPageLoadData  = false;
        self.enableCustomeTopScroll = self._opts.config.customScrollMoveEvent?true:false;
        self.refreshingTopUI = false;
        self.preScrollerH = Math.floor(self.scrollerH);
        self.emptyData = false;
        self.loadingQuery = {};
    };
    pullRefresh.prototype.pullupLoading = function (pageNum) {
        var self = this;
        if (self.loading) {
            self.loadingQuery["loadingQueryPageNum"] = pageNum;
            _.event.trigger("cmp-listview-loading-callback",document);//防护多个请求来，loading还在显示，页面不能操作
            return;
        }
        self._initPullupRefresh();
        self._setCaption(self.options.up.contentrefresh);
        self.loading = true;
        var pageNo = pageNum?pageNum:self.currentP[self.crumbs].pageNo;
        self.currentP[self.crumbs].pageNo = pageNo;
        self.crumbs = (self._opts.config.crumbsID)?self._opts.config.crumbsID:null;
        self._doDataAndRenderCaLLback(pageNo,"up");
    };
    //获取页面跳转缓存数据
    pullRefresh.prototype.getCacheData = function(){
        var self = this;
        var cacheData = null;
        var saveMark = self.crumbs?(self._container + "&" + self.crumbs) :self._container;
        var pageData = _.storage.get(saveMark,true);
        var crumbsData = _.cache["list_cache_data_" + saveMark];
        if (pageData) {//页面跳转后取数据
            pageData = _.parseJSON(pageData);
            _.storage.delete(saveMark,true);
            if(self._opts.config.clearCache){
                _.cache["saveMark"] = saveMark;
                return null;
            }
            _.cache["list_cache_data_" + saveMark] = {
                containerID: self._container,
                data: pageData.data,
                crumbs:self.crumbs,
                pageNo:pageData.pageNo,
                finished:pageData.finished,
                scrollX:pageData.scrollX,
                scrollY:pageData.scrollY,
                total:pageData.total,
                pagingNo: pageData.pagingNo
            };
            cacheData = pageData;
            self.currentP[pageData.crumbs].crumbs = pageData.crumbs;
            self.currentP[pageData.crumbs].pageNo = pageData.pageNo;
            self.currentP[pageData.crumbs].finished = pageData.finished;
        }else {
            if(crumbsData){
                if(_.cache["saveMark"] != saveMark) {
                    var saveMarkCache =  _.cache["list_cache_data_" + saveMark];
                    saveMarkCache.isSwitchCrumbs = true;
                    saveMarkCache.data.scrollX = saveMarkCache.scrollX;
                    saveMarkCache.data.scrollY = saveMarkCache.scrollY;
                    saveMarkCache.data.finished = saveMarkCache.finished;
                    cacheData = saveMarkCache;
                }
            }
        }
        _.cache["saveMark"] = saveMark;
        return cacheData;
    };

    //缓存list数据用于页面跳转后的缓存
    pullRefresh.prototype.cacheListData = function(type,data){
        var self = this;
        var isCache = self._opts.config.isClear? false:true;
        var saveMark = self.crumbs?(self._container + "&" + self.crumbs) :self._container;

        var crumbsData = _.cache["list_cache_data_" + saveMark];
        if(isCache || isCache == true){
            var newData = [];
            if(crumbsData){
                if(_.cache["saveMark"] != saveMark){
                    newData = data.data;
                }else {
                    var oldData = crumbsData.data;
                    if(self.options.up.contentnextpage && self.options.down.contentprepage){
                        if(oldData && _.isArray(oldData) && oldData.length >= self._opts.config.onePageMaxNum){
                            oldData = [];
                        }
                    }
                    if(type == "down"){
                        oldData = [];
                    }
                    if(_.isArray(data.data)){
                        newData = oldData.concat(data.data);
                    }
                    if(self.prevPageLoadData) {//如果是点击上一页，就只缓存上一页初始的数据
                        newData = _.isArray(data.data)?data.data:[];
                        self.prevPageLoadData = false;
                    }
                }

            }else {
                if(type == "up" ||  (type == "down" && (self.pageNo-1) ==1) ){
                    newData = _.isArray(data.data)?data.data:[];
                }
            }
            var pageNo = self.pageNo-1;
            if(pageNo <=0) pageNo = 0;  //因为pageNo会前置，所以存的时候需要减1
            self.widgetShow = false;//用于跳转回来时，如果小控件的情况，是否显示小部件
            self.additionalPartsShow = false;//用于跳转回来时，是否展示额外部件
            if(self.widget && self.widget.classList.contains("showAction")) self.widgetShow = true;
            if(self.additionalParts) self.additionalPartsShow = true;
            _.cache["list_cache_data_" + saveMark] = {
                containerID: self._container,
                crumbs:self.crumbs,
                finished: self.finished,
                pageNo:pageNo,
                scrollX: self.x,
                scrollY: self.y,
                data: newData,
                total:data.total,
                pagingNo:self.pagingNo,
                widgetShow:self.widgetShow,
                additionalPartsShow:self.additionalPartsShow
            };
            _.cache["saveMark"] == saveMark;
        }
        self.prevPageLoadData = false;//如果就算不进行缓存那么点击上一页后还是需要将此值置为false
    };

    /**
     * 做取数据和渲染数据的回调函数
     * @param pageNo
     * @param type
     * @private
     */
    pullRefresh.prototype._doDataAndRenderCaLLback = function(pageNo,type,callback) {
        var self = this;
        var params = self.options.up.params;
        var dataFunc = self.options.up.dataFunc;
        var renderFunc = self.options.up.renderFunc;
        var cacheData = self.getCacheData();
        this.loadingTime = new Date().getTime();
        if(cacheData != null) {
            var cachePageNo = cacheData.pageNo;
            self.pageNo = cachePageNo;
            self.currentP[self.crumbs].pageNo = cachePageNo;
            self.pagingNo = cacheData.pagingNo;
            self._doSuccess(cacheData,type,cachePageNo,renderFunc,true);
        }else {
            var dataFuncArgs = [];
            if (_.isObject(params)) {
                params["pageNo"] = pageNo;
                params["pageSize"] = self.options.up.pageSize;
                dataFuncArgs.push(params);
            } else if (_.isArray(params)) {
                var pLen = params.length;
                var postArgs = params[pLen - 1];
                if (_.isObject(postArgs)) {
                    postArgs["pageNo"] = pageNo;
                    postArgs["pageSize"] = self.options.up.pageSize;
                    params[pLen - 1] = postArgs;
                }
                dataFuncArgs = dataFuncArgs.concat(params);
            }
            var optionsArg = {
                cache: {
                    isCache:self._opts.config.isClear? false:true,//是否在页面跳转时将列表数据保存进localStorage中，默认是需要保存（后期如果面包屑的数量较多，影响性能的话，设置成可配置项，根据实际场景性能来配置）
                    container: self._container,
                    crumbs:self.crumbs,
                    type: type
                },
                success: function (result) {  //result.isSwitchCrumbs是一个重要标识，表明是否在进行面包屑切换，如果是，则会把当前的页面的渲染的覆盖掉------辛裴（该标识是在ajax请求中设置的，很抽象，不需要开发者调用）
                    self.delayDealRefresh(function () {
                        self._doSuccess(result,type,pageNo,renderFunc);
                        self.cacheListData(type,result);
                        if(typeof callback == "function"){
                            callback();
                        }
                    }, self._cmpScroll.querySelector(".StatusContainer"))
                },
                error : function (result) {

                    self.delayDealRefresh(function () {
                        self.isLoadError[type] = true;
                        if(type == "up") {
                            self._endPullupToLoadMore(self.currentP[self.crumbs].finished,self.isLoadError[type]);
                        }else {
                            self._endPulldownToRefresh(self.currentP[self.crumbs].finished);
                        }
                    }, self._cmpScroll.querySelector(".StatusContainer"));
                }
            };
            dataFuncArgs.push(optionsArg);
            dataFunc && dataFunc.apply(dataFuncArgs, dataFuncArgs);
        }

    };
    pullRefresh.prototype.delayDealRefresh = function (fn, trigger) {
        /**
         * @function name delayDealRefresh
         * @description 这是加载最低显示时间
         * @createDate 2018/10/20/020
         * @params self.minTime 用户设置的最低加载时间 默认500ms
         * @params fn 回调函数
         * @params trigger 是否立即触发回调
         */
        var self = this;
        var minusTime = new Date().getTime() - self.loadingTime;
        clearTimeout(self.loadingTimer);
        if ((minusTime >= self.minTime) || (!Number(self.minTime))|| trigger) {
            typeof fn === 'function' && fn();
        }
        else {
            self.loadingTimer = setTimeout(function () {
                self.loadingTimer = null;
                typeof fn === 'function' && fn();
            }, self.minTime - minusTime)
        }
    };
    pullRefresh.prototype._doSuccess = function(result,type,pageNo,renderFunc,fromCacheData){
        var self = this;
        self.currentP[self.crumbs].refreshTimeScale = new Date().getTime();
        self.total = parseInt(result.total);
        self.network = result.network;
        var pageSize = self.options.up.pageSize;
        var onPageMaxNum = self.options.config.onePageMaxNum;
        var _pageCount = Math.ceil(parseFloat(self.total / pageSize));
        var _pagingCount  = Math.ceil(parseFloat(self.total/onPageMaxNum));
        if (_pageCount <= 0) {
            _pageCount = 1;
        }
        if(_pagingCount <= 0) {
            _pagingCount = 1;
        }
        self.totalPage = _pageCount;
        self.currentP[self.crumbs].finished = result.isSwitchCrumbs?result.finished:(self.totalPage <= pageNo || result.total <= result.data.length);

        if(!self.currentP[self.crumbs].finished){
            if(self.options.up.contentnextpage){
                if(fromCacheData){
                    self.endOnePage = (result.data.length) > self.pagingNo * onPageMaxNum?true:false;
                }else {
                    self.endOnePage = (pageNo * pageSize + result.data.length) > self.pagingNo * onPageMaxNum?true:false;//判断一屏数据是否加载完了
                }

            }
        }
        var refreshParam = false;
        if(result.isSwitchCrumbs){
            refreshParam = result.isSwitchCrumbs;
        }else if(pageNo == 1){
            refreshParam = true;
        }else if(self.initNextPageLoadData) { //如果是初始化加载下一屏的第一个pageNum数据,列表需要用innerHtml执行
            refreshParam = true;
        }else if(self.prevPageLoadData){
            refreshParam = true;
        }
        if(pageNo <= 1 && result.data.length == 0) {  //如果是首次进行加载数据，并且数据为空时
            self.emptyData = true;
            self._renderNoData(type,renderFunc,result.data);
        }else {
            self.emptyData = false;
            renderFunc && renderFunc.call(self, result.data,refreshParam);
            if(!result.data || result.data.length == 0){ //做一次数据过滤，有可能result.data的数据在调用开发者的渲染函数时进行内存修改，此时进行一个空数据过滤的显示
                self.emptyData = true;
                self._renderNoData(type,renderFunc,result.data);
                return;
            }
            var captionStyle;
            if(_pagingCount == 1){
                if(self.endOnePage || self.currentP[self.crumbs].finished){
                    captionStyle = "only_one_page_finished";
                }else {
                    captionStyle = "only_one_page_loadMore";
                }
            }else {
                if(self.endOnePage){
                    captionStyle = "end_one_page";
                    if(!result.isSwitchCrumbs){
                        self.currentP[self.crumbs].pagingNo = self.pagingNo;    //todo  做点击上一页的逻辑
                    }
                    if(self.pagingNo > 1){
                        captionStyle += "&one_page_prePage";
                    }
                }else {
                    captionStyle = "one_page_loadMore";
                    if(self.pagingNo > 1){
                        captionStyle += "&one_page_prePage";
                    }
                }
            }

            if(type == "up") {
                self._endPullupToLoadMore(self.currentP[self.crumbs].finished,captionStyle);
            }else if(type == "down") {
                self._endPulldownToRefresh(self.currentP[self.crumbs].finished)
            }else if(type == "downMore"){
                self._endPullDownToLoadMore();
            }else if(type == "upRefresh"){
                self._endPullupToRefresh();
            }
            self._renderData(type);
            self._createWidget(result);
            if (type == "down") {
                self.refresh();
            } else {
                self.refresh();
            }
            self.isLoadError[type] = false;
            if(!result.isSwitchCrumbs){
                if(typeof self.network == "undefined" || (typeof self.network != "undefined" && self.network == true)){
                    self.currentP[self.crumbs].pageNo +=1;
                }
                self.currentP[self.crumbs].pagingNo = self.pagingNo;
                self.currentP[self.crumbs].endOnePage =self.endOnePage;
                self.finished = self.currentP[self.crumbs].finished;
                self.pageNo = self.currentP[self.crumbs].pageNo;
                self.initNextPageLoadData = false;
                if(typeof result.scrollX != "undefined" && typeof result.scrollY != "undefined"){
                    self.scrollTo(result.scrollX,result.scrollY);
                }
            }else {
                self.scrollTo(result.scrollX,result.scrollY);
            }
        }
    };
    pullRefresh.prototype._renderNoData = function(type,renderFunc,data){
        var self = this;
        if(self.bottomPocket) self._setCaptionOpacity(self.bottomPocket,0);
        if(self.topPocket) self._setCaptionOpacity(self.topPocket,0);
        if(self._opts.down && self._opts.down.purpose == -1){ //如果配置是-1，则开发者自己渲染
            renderFunc && renderFunc.call(self, data);
        }else {//1,2组件默认帮助渲染
            var noDataDiv = self._cmpScroll.querySelector(".StatusContainer");
            var preDataList = self._cmpScroll.querySelector("ul");//查询到装载列表数据的ul标签
            if(preDataList && preDataList.childNodes && preDataList.childNodes.length > 0){
                preDataList.innerHTML = "";
            }
            if(!noDataDiv){
                if(!self._cmpScroll.classList.contains('bg_auto')){
                    self._cmpScroll.classList.add('bg_auto');
                }
                // _.dialog.loading({status:"nocontent"});
                var html = getNoDataHtml(self._opts.config.purpose);
                _.append(self._cmpScroll,html);
            }
            if(self.additionalParts){//空数据时要重置额外部件
                self.additionalPartsShow = false;
                self.topOffset = -(self.widget.offsetHeight);
                self._opts.onScrollMove = undefined;
                self.additionalParts.style.display = "none";
                self.additionalParts.style[transform] = 'translate(0px,0px) scale(' + self.scale + ')' + translateZ;
                self.additionalParts = undefined;
            }
            if(self.widget){//空数据时需要重置小部件
                self.widget.classList.remove("showAction");
                self.widget.classList.remove("active");
                self.widget.classList.add("hiddenState");
                self.widget = undefined;
            }
            if(self._opts["config"].renderNoDataCallback && typeof self._opts["config"].renderNoDataCallback == "function"){
                self._opts["config"].renderNoDataCallback(data);
            }

        }
        if(type == "up") {
            self._endPullupToLoadMore(self.currentP[self.crumbs].finished);
        }else if(type == "down") {
            self._endPulldownToRefresh(self.currentP[self.crumbs].finished)
        }else if(type == "downMore"){
            self._endPullDownToLoadMore();
        }else if(type == "upRefresh"){
            self._endPullupToRefresh();
        }
        _.dialog.loading(false);
    };
    pullRefresh.prototype._renderData = function(captionStyle){
        var self = this;
        var noDataDiv = self._cmpScroll.querySelector(".StatusContainer");
        if(noDataDiv) noDataDiv.remove();
        if(self._cmpScroll.classList.contains('bg_auto')){
            self._cmpScroll.classList.remove('bg_auto');
        }
        if(self.topPocket){
            if(self.pagingNo == 1){
                self._setCaptionOpacity(self.topPocket,1);
            }else {
                self._setCaptionOpacity(self.topPocket,0);
            }
        }
        if(self.bottomPocket){
            if(self.scroller.offsetHeight >= self.wrapperH){
                self._setCaptionOpacity(self.bottomPocket,1);
            }else {
                self._setCaptionOpacity(self.bottomPocket,0);
            }
        }

    };
    /**
     * 设置滚动参数
     * @private
     */
    pullRefresh.prototype._setScrollParam = function(){
        var self = this,opts = self._opts;
        this.options.onBeforeScrollStart= function(e){
            opts && opts.listViewBeforeScrollStart && opts.listViewBeforeScrollStart.call(this,e);
        };
        this.options.onScrollStart = function () {
            if (!self.loading) {
                self.pulldown = self.pullPocket = self.pullCaption = self.pullLoading = false;
            }
        };
        this.options.onScrollMove = function () {
            if (self.loading) {
                return;
            }
            if(self._opts.config.reverse){
                if(!self.currentP[self.crumbs].finished){
                    self._topLoadingReady(this.y);
                }
            }else {
                self._topLoadingReady(this.y);
            }
            self.enableCustomeTopScroll = self._opts.config.customScrollMoveEvent?true:false;
            if(self.enableCustomeTopScroll){  //启用自定义滚动到顶部的事件
                var customScrollMoveEvent = opts.config.customScrollMoveEvent;
                customScrollMoveEvent(this.y);

            }else {
                if (!self.pulldown && !self.loading && self.topPocket && this.y >= self.topOffset) {
                    if(self.pagingNo ==1){
                        self._initPulldownRefresh();
                    }
                    if(self.widget && !self.additionalParts) self.widget.classList.add("active");
                }
                self.pulldown = self.pulldown && self.y > 0 && self.y >= opts.down.height;
                if (self.pulldown) {
                    if(self._opts.config.reverse){
                        if(!self.currentP[self.crumbs].finished){
                            self._setCaption(self.y > opts.down.height ? opts.down.contentover : _.i18n("cmp.listView.refreshTips"));
                        }
                    }else {
                        self._setCaption(self.y > opts.down.height ? opts.down.contentover : _.i18n("cmp.listView.refreshTips"));
                    }
                }else {
                    if(self.y <= 18){
                        if(self.topPocket){
                            // var titleText = self._countRefreshTime() + _.i18n("cmp.listView.refreshTips");
                            var titleText = opts.down.contentover || _.i18n("cmp.listView.refreshTips");
                            self.topCaption.innerHtml = titleText;
                        }
                        if(self._opts.config.reverse && Math.abs(self.y) > Math.abs(self.maxScrollY)){
                            self._initPullupRefresh();
                        }
                    }
                }
                opts && opts.onScrollMove && opts.onScrollMove.call(this,this.y);
                opts && opts.listViewScrollMove && opts.listViewScrollMove.call(this,this.y);
            }
        };
        //滚动结束后给
        this.options.onScrollEnd = function () {
            if (self.loading) {
                return;
            }
            if (Math.abs(self.y) > 0 && self.y <= self.maxScrollY && !self.endOnePage && !self.pulldown) {
                if(self._opts.config.reverse){
                    self._pullupRefresh();
                }else {
                    if(!self.currentP[self.crumbs].finished){//数据总数未加载完可以继续加载
                        self._pullupLoading();
                    }
                }
            }
            if (self.pulldown) {
                self.topPocket.classList.remove("sleep");
                self.topPocket.classList.add("awaken");
                if(self._opts.config.reverse){
                    if(!self.currentP[self.crumbs].finished){//数据总数未加载完可以继续加载
                        self._pulldownLoadMore();
                    }
                }else {
                    self.pulldownLoading();
                }

            }else {
                if(self.widget){
                    if(!self.widget.classList.contains("initAction")){
                        self._scrollEndBounce4Widget(this.y);
                    }else {
                        self.widget.classList.remove("initAction");
                    }
                }
                if(self.topLoading){
                    self.topLoading.style.display = "none";
                }
            }

            opts && opts.onScrollEnd && opts.onScrollEnd.call(this,this.y);
            opts && opts.listViewScrollEnd && opts.listViewScrollEnd.call(this,this.y);
        };
    };
    pullRefresh.prototype._topLoadingReady = function(y) {
        var self = this;
        if(self.topPocket){
            self.topPocket.style.zIndex="";//防护页面可能在提示刷新完毕后，又进行拖动，造成文字有误
            self.topLoading.style.display = "inline-block";
            // if(y<18){
            //     self._awakenTadpole([0,0,0,0,0,0,0,0]);
            // }else if(y >=20 && y < 24){
            //     self._awakenTadpole([1,0,0,0,0,0,0,0]);
            // }else if(y >=26 && y < 28){
            //     self._awakenTadpole([1,1,0,0,0,0,0,0]);
            // }else if(y >=30 && y < 32){
            //     self._awakenTadpole([1,1,1,0,0,0,0,0]);
            // }else if(y >=34 && y < 36){
            //     self._awakenTadpole([1,1,1,1,0,0,0,0]);
            // }else if(y >=38 && y < 40){
            //     self._awakenTadpole([1,1,1,1,1,0,0,0]);
            // }else if(y >=42 && y < 44){
            //     self._awakenTadpole([1,1,1,1,1,1,0,0]);
            // }else if(y >=46 && y < 48){
            //     self._awakenTadpole([1,1,1,1,1,1,1,0]);
            // }else if(y >=48 ){
            //     self._awakenTadpole([1,1,1,1,1,1,1,1]);
            // }
        }
    };
    pullRefresh.prototype._setCaptionOpacity = function(caption,opacity){
        caption.style.opacity = opacity;
    };
    pullRefresh.prototype._awakenTadpole = function(opacitys){
        // var self = this;
        // var i = 0,len = opacitys.length;
        // for(;i<len;i++){
        //     var tadpole = self["tadpole"+(i+1)];
        //     tadpole.style.opacity = opacitys[i];
        // }
    };
    pullRefresh.prototype._sleepTadpole = function(){
        // var self = this;
        // var tadpoles = self.topLoading.getElementsByTagName("span");
        // for(var i = 0;i<tadpoles.length;i++){
        //     tadpoles[i].style.opacity = 0;
        // }
    };
    //下拉pageNo=1加载的数据（由于历史原因，此方法对外提供）
    pullRefresh.prototype.pulldownLoading = function (callback) {
        var self = this;
        self._initPulldownRefresh();
        self._setCaption(self.options.down.contentrefresh);
        self.loading = true;
        var pageNo = 1;
        self.currentP[self.crumbs].pageNo = pageNo;
        self._doDataAndRenderCaLLback(pageNo,"down",callback);
    };
    /**
     * 上拉加载更多数据（过去的_scrollbottom方法）
     * @private
     */
    pullRefresh.prototype._pullupLoading = function () {
        var self = this;
        if (!self.pulldown && !self.loading && self._opts.up) {
            self.pulldown = false;
            self._initPullupRefresh();
            self.pullupLoading();
        }
    };

    //倒序情况pageNo=1上拉刷新
    pullRefresh.prototype._pullupRefresh = function(){
        var self = this;
        self._initPullupRefresh();
        self._setCaption(self.options.up.contentrefresh);
        self.loading = true;
        var pageNo = 1;
        self.currentP[self.crumbs].pageNo = pageNo;
        self._doDataAndRenderCaLLback(pageNo,"upRefresh");
    };
    //倒序情况下拉加载更多数据
    pullRefresh.prototype._pulldownLoadMore = function(pageNum){
        var self = this;
        if(self.pulldown && !self.loading && self._opts.down){
            self.pulldown = false;
            self.preScrollerH = Math.floor(self.scrollerH);
            self._initPulldownRefresh();
            self._setCaption(self.options.down.contentrefresh);
            self.loading = true;
            var pageNo = pageNum?pageNum:self.currentP[self.crumbs].pageNo;
            self.currentP[self.crumbs].pageNo = pageNo;
            self.crumbs = (self._opts.config.crumbsID)?self._opts.config.crumbsID:null;
            self._doDataAndRenderCaLLback(pageNo,"downMore");
        }
    };
//==========================ui改变事件==============//
    pullRefresh.prototype._endPulldownToRefresh = function (isFinished) {
        var self = this;

        if (self.topPocket && self.loading && self.pulldown) {
            var tipsStr;
            if(typeof self.network == "undefined" || (self.network != "undefined" && self.network == true)){
                if (self.isLoadError["down"]) {
                    tipsStr = _.i18n("cmp.listView.refreshFailed");
                } else {
                    tipsStr = _.i18n("cmp.listView.refreshSuccess");
                }
            }else {
                tipsStr = _.i18n("cmp.listView.noNetworkTips");
            }
            self._setCaption(tipsStr, true);
            self.pulldown = false;
            self.refresh();
        }
    };

    pullRefresh.prototype._endPullDownToLoadMore = function(isFinished){
        var self = this;
        if (self.topPocket && self.loading && self.pulldown) {
            var tipsStr;
            if(typeof self.network == "undefined" || (self.network != "undefined" && self.network == true)){
                if (self.isLoadError["down"]) {
                    tipsStr = _.i18n("cmp.listView.refreshFailed");
                } else {
                    tipsStr = _.i18n("cmp.listView.refreshSuccess");
                }
            }else {
                tipsStr = _.i18n("cmp.listView.noNetworkTips");
            }
            self._setCaption(tipsStr,true);
            self.pulldown = false;
            self.refresh();
            if(self.scrollerH > (self.wrapperH+self.topPocket.offsetHeight)){//下拉加载更多，如果滚动高度大于wrapper+top的高度则要滚动一下
                self.scrollTo(0,-(self.scrollerH-self.preScrollerH-self.topPocket.offsetHeight),0,0);
            }
        }
    };

    pullRefresh.prototype._endPullupToLoadMore = function (finished,captionType) {
        var self = this;
        var title,topTitle = "";
        if(self.topPrePageBtnReplaceLoading){
            self.topPrePageBtnReplaceLoading.remove();
            self.topPrePageBtnReplaceLoading = undefined;
        }
        if(self.options.up.contentnextpage){
            switch (captionType){
                case "only_one_page_finished":
                    title = self.options.up.contentnomore;
                    break;
                case "only_one_page_loadMore":
                case "one_page_loadMore":
                    title = self.options.up.contentdown;
                    break;
                case "end_one_page":
                    title = self.options.up.contentnextpage;
                    break;
                case "end_one_page&one_page_prePage":
                    title = self.options.up.contentnextpage;
                    topTitle = self.options.down.contentprepage;
                    self._setTopCaption(topTitle);
                    break;
                case "next_new_one_page":
                    break;
                case "one_page_loadMore&one_page_prePage":
                    title = self.options.up.contentdown;
                    topTitle = self.options.down.contentprepage;
                    self._setTopCaption(topTitle);
                    break;
            }
        }else {
            title = self.options.up.contentdown;
        }
        if (self.bottomPocket && self.loading && !self.pulldown) {
            var isError = captionType == true;
            if (finished && !isError) {
                self.currentP[self.crumbs].finished = true;
                if(self.pagingNo > 1){
                    topTitle = self.options.down.contentprepage;
                    self._setTopCaption(topTitle);
                }
                self._setCaption(self.options.up.contentnomore);
            } else {
                if(isError) {
                    self._setCaption(_.i18n("cmp.listView.error"),false);
                }else {

                    self._setCaption(title,false);
                }
            }
            self.refresh();
            if(self.initNextPageLoadData){
                self.scrollTo(0,0);
            }
            _.event.trigger("cmp-listview-loaded-callback",document);
            self._loadingFalse();
        }

    };
    pullRefresh.prototype._loadingFalse = function(){
        var self = this;
        self.loading = false;
        if(Object.keys(self.loadingQuery).length){
            var pageNum = self.loadingQuery["loadingQueryPageNum"];
            delete self.loadingQuery["loadingQueryPageNum"];
            self.pullupLoading(pageNum);
        }
    };
    //倒序上拉刷新的ui设置
    pullRefresh.prototype._endPullupToRefresh = function(){
        var self = this;
        if (self.bottomPocket && self.loading && !self.pulldown) {
            self.bottomPocket.classList.remove('cmp-visibility'); // 新加的
            self.bottomPocket.classList.remove(CLASS_BLOCK);
            self.bottomPocket.classList.add(CLASS_HIDDEN);
            self.pullLoading.className = CLASS_LOADING_INIT + ' ' + CLASS_HIDDEN;
            self._setCaption(self.options.up.contentdown,false);
            self.refresh();
            if(self.scrollerH >=self.wrapperH ){
                self.scrollTo(0,self.maxScrollY,0,0);
            }
            self._loadingFalse();
        }
    };
    pullRefresh.prototype._setTopCaption = function(topTitle){
        var self = this;
        if(topTitle) {
            switch (topTitle){
                case self.options.down.contentprepage:
                    if(self.topCaption){
                        self.topCaption.classList.add("cmp-prev-page-proxy");
                        self._setCaptionOpacity(self.topPocket,0);
                    }
                    var topPrevPageBtn = self._cmpScroll.querySelector(".cmp-pull-top-btn");
                    if(!topPrevPageBtn){
                        var topPrevPageBtnHtml = _.tpl(top_prePageBtn,{topTitle:topTitle});
                        if(self.widget){
                            _.after(self.widget,topPrevPageBtnHtml);
                        }else {
                            var scrollChildren = self._cmpScroll.children;
                            if(scrollChildren && scrollChildren.length > 0){
                                var firstChild = scrollChildren[0];
                                _.before(firstChild,topPrevPageBtnHtml);

                            }
                        }
                        var topPrevPageBtn = self._cmpScroll.querySelector(".cmp-pull-top-btn");
                        self._bindPrevPageEvent(topPrevPageBtn);
                    }
                    break;
                    var topPrevPageBtn = self._cmpScroll.querySelector(".cmp-pull-top-btn");
                    if(topPrevPageBtn){
                        topPrevPageBtn.remove();
                        topPrevPageBtn = null;
                    }
                    self._setCaptionOpacity(self.topPocket,1);
                    break;
            }
        }else {
            var topPrevPageBtn = self._cmpScroll.querySelector(".cmp-pull-top-btn");
            if(topPrevPageBtn){
                topPrevPageBtn.remove();
                topPrevPageBtn = null;
            }
        }

    };
    //==============================组装ui=============//
    /*20181019 update loading animate*/
    // circleLoadingNode = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>',
    var CLASS_PULL_TOP_POCKET = "cmp-pull-top-pocket",
        CLASS_PULL_BOTTOM_POCKET = "cmp-pull-bottom-pocket",
        CLASS_PULL = "cmp-pull",
        CLASS_PULL_LOADING = "cmp-pull-loading",
        CLASS_PULL_CAPTION = "cmp-pull-caption",
        CLASS_PULL_CAPTION_DOWN = "cmp-pull-caption-down",
        CLASS_PULL_CAPTION_REFRESH = "cmp-pull-caption-refresh",
        CLASS_PULL_CAPTION_NOMORE = "cmp-pull-caption-nomore",
        CLASS_ICON = "cmp-icon",
        CLASS_SPINNER = "cmp-spinner",
        CLASS_ICON_PULLDOWN = "cmp-icon-pulldown",
        CLASS_BLOCK = "cmp-block",
        CLASS_HIDDEN = "cmp-hidden",
        CLASS_VISIBILITY = "cmp-visibility",
        CLASS_ACTIVE = "active",
        CLASS_INIT = "init",
        CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN,
        CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_SPINNER + ' ' + CLASS_INIT ,
        CLASS_LOADING_ACTIVE = CLASS_PULL_LOADING + ' ' + CLASS_SPINNER + ' ' + CLASS_ACTIVE,
        CLASS_LOADING_INIT= CLASS_PULL_LOADING + ' ' + CLASS_SPINNER + ' ' + CLASS_INIT,
        PULL_CAPTION_TYPE = {TYPE_TEXT: 0, TYPE_TOTAL: 1},
        CONTENTREFRESH_HTML_TOP = ['<p class="showText">{showtext}</p>', '<p class="totalNum"></p>', '<p class="updateTime"></p>'].join(''),
        CONTENTREFRESH_HTML_BOTTOM = ['<p class="showText">{showtext}</p>', '<p class="haveNum"></p>'].join(''),
        circleLoadingNode = '<div class="pull-push-circle-loading"></div>',
        pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}">'+circleLoadingNode+'</div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join(''),
        top_prePageBtn =
            '<div class="cmp-pull-top-btn cmp-prev-page">' +
            '   <div class="cmp-pull-wrapper">' +
            '       <div class="cmp-pull-loading cmp-icon cmp-icon-pulldown" ></div>' +
            '       <div class="cmp-pull-caption"><%=this.topTitle %></div>' +
            '   </div>' +
            '</div>',
        top_prePageBtn_replace_loading_div =
            '<div class="cmp-pull-bottom-pocket cmp-block cmp-visibility cmp-replace-loading" style="opacity: 1;">' +
            '  <div class="cmp-pull">' +
            '      <div class="cmp-pull-loading cmp-spinner active cmp-visibility">'+circleLoadingNode+'</div>' +
            '      <div class="cmp-pull-caption cmp-pull-caption-refresh">加载中...</div>' +
            '  </div>' +
            '</div>'
    ;
    /**
     * 创建上拉下拉文字层
     * @param clazz
     * @param options
     * @param iconClass
     * @returns {HTMLElement}
     * @private
     */
    pullRefresh.prototype._createPocket = function (clazz, options, iconClass) {
        var pocket = document.createElement('div');
        pocket.className = clazz;
        if (options.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
            if (clazz == CLASS_PULL_TOP_POCKET) {//下拉控件
                CONTENTREFRESH_HTML_TOP = CONTENTREFRESH_HTML_TOP.replace('{showtext}', options.contentrefresh);
                pocket.innerHTML = pocketHtml.replace('{contentrefresh}', CONTENTREFRESH_HTML_TOP).replace('{icon}', iconClass);
            } else {//上拉控件
                CONTENTREFRESH_HTML_BOTTOM = CONTENTREFRESH_HTML_BOTTOM.replace('{showtext}', options.contentrefresh);
                pocket.innerHTML = pocketHtml.replace('{contentrefresh}', CONTENTREFRESH_HTML_BOTTOM).replace('{icon}', iconClass);
            }
        } else {
            pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentrefresh).replace('{icon}', iconClass);
        }
        return pocket;
    };
    //创建下拉层
    pullRefresh.prototype._createPullDownLayer = function(){
        var self = this,opts = self._opts;
        if (opts.down && opts.down.hasOwnProperty("dataFunc")) {
            //创建下拉层
            self.topPocket = self.wrapper.querySelector('.' + CLASS_PULL_TOP_POCKET);
            if (!self.topPocket) {
                self.topPocket = self._createPocket(CLASS_PULL_TOP_POCKET, opts.down, CLASS_LOADING_DOWN);
                self.topPocket.classList.add("sleep");
                self.wrapper.insertBefore(self.topPocket, self.wrapper.firstChild);
            }
            self.topLoading = self.topPocket.querySelector('.' + CLASS_PULL_LOADING);
            self.topCaption = self.topPocket.querySelector('.' + CLASS_PULL_CAPTION);
            // self.tadpole1 = self.topLoading.querySelector("span:nth-child(6)");
            // self.tadpole2 = self.topLoading.querySelector("span:nth-child(7)");
            // self.tadpole3 = self.topLoading.querySelector("span:nth-child(8)");
            // self.tadpole4 = self.topLoading.querySelector("span:nth-child(1)");
            // self.tadpole5 = self.topLoading.querySelector("span:nth-child(2)");
            // self.tadpole6 = self.topLoading.querySelector("span:nth-child(3)");
            // self.tadpole7 = self.topLoading.querySelector("span:nth-child(4)");
            // self.tadpole8 = self.topLoading.querySelector("span:nth-child(5)");
        }
    };

    pullRefresh.prototype._createWidget = function(data){
        var self = this,opts = self._opts;
        if(self.topPocket) {
            var widgetDiv = self.wrapper.querySelector(".cmp-pull-widget");
            if(widgetDiv){
                if(!self.widget){//如果额外部件还没有创建过才创建
                    self.widget = widgetDiv;
                    var className = "cmp-pull-widget initAction ";
                    if(data.widgetShow) className += "active";
                    self.widget.className = className;
                    if(data.additionalPartsShow) self.updateAdditionalParts(true);
                }
            }
        }
    };
    //创建上拉层
    pullRefresh.prototype._createPullUpLayer = function(){
        var self = this,opts = self._opts;
        if (opts.up && opts.up.hasOwnProperty('dataFunc')) {
            self.bottomPocket = self.wrapper.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
            if (!self.bottomPocket) {
                self.bottomPocket = self._createPocket(CLASS_PULL_BOTTOM_POCKET, opts.up, CLASS_LOADING_ACTIVE);
                self.scroller.appendChild(self.bottomPocket);
            }
            self.bottomLoading = self.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
            self.bottomCaption = self.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
        }
    };
    /**
     * 初始化显示上拉下拉头动态文字
     * @private
     */
    pullRefresh.prototype._initFristCaption = function () {
        var self = this;
        setTimeout(function () {
            if (self.total) {
                if (self.topPocket) {
                    var totalNumText = _.i18n("cmp.listView.totalNumText",[self.total]);
                    var updateTimeText = _.i18n("cmp.listView.updateTimeText",[new Date().format("yyyy-MM-dd hh:mm")]);
                    self.topPocket.querySelector(".totalNum").innerHTML = totalNumText;
                    self.topPocket.querySelector(".updateTime").innerHTML = updateTimeText;
                }
                if (self.bottomPocket) {
                    var haveNum = self.total - ((self.currentP[self.crumbs].pageNo -1)* self._opts.up.pageSize);
                    haveNum = haveNum <= 0 ? 0 : haveNum;
                    if (self.options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                        var haveNumText = _.i18n("cmp.listView.haveNumText",[haveNum]);
                        self.bottomPocket.querySelector(".haveNum").innerHTML = haveNumText;
                    }
                    self.bottomPocket.classList.add('cmp-visibility'); //新加的
                }
            }
        }, 100);
    };
    pullRefresh.prototype._initPulldownRefresh = function () {
        var self = this;
        if(self.refreshingTopUI == true) return;
        self.pulldown = true;
        self.pullPocket = self.topPocket;
        self.pullPocket.classList.add(CLASS_BLOCK);
        self.pullPocket.classList.add(CLASS_VISIBILITY);
        self.pullCaption = self.topCaption;
        self.pullLoading = self.topLoading;
        self.pullLoading.className = CLASS_LOADING_DOWN;
        var showText = self.pullCaption.querySelector(".showText");
        var timeText = self._opts.down.contentover || _.i18n("cmp.listView.refreshTips");
        if(self._opts.config.reverse){
            if(self.currentP[self.crumbs].finished){
                timeText = self._opts.down.contentnomore
            }else {
                timeText = self._opts.down.contentdown
            }

        }
        if(showText){
            showText.innerHTML =  timeText;
        }else {
            self.pullCaption.innerHTML = timeText;
        }

    };

    pullRefresh.prototype._initPullupRefresh = function () {
        var self = this;
        self.pulldown = false;
        self.pullPocket = self.bottomPocket;
        self.pullPocket.classList.remove(CLASS_HIDDEN);
        self.pullPocket.classList.add(CLASS_BLOCK);
        self.pullPocket.classList.add(CLASS_VISIBILITY);
        self.pullCaption = self.bottomCaption;
        self.pullLoading = self.bottomLoading;

    };
    pullRefresh.prototype._setCaption = function (title, reset) {
        var self = this;
        var options = self.options;
        var pocket = self.pullPocket;
        var caption = self.pullCaption;
        var loading = self.pullLoading;
        var isPulldown = self.pulldown;
        if (pocket) {
            if(self.topPocket){
                if(!self.emptyData){//要判断出是无数据情况，之前写得太粗狂了
                    self.topPocket.style.opacity = 1;
                }
            }
            if (reset) {
                setTimeout(function () {
                    if (options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                        caption.querySelector(".showText").innerHTML = self.lastTitle = title;
                    } else {
                        if(self.refreshingTopUI == true)return;
                        self.lastTitle = title;
                        if(self._opts.config.reverse){
                            title = self._opts.down.contentdown;
                            if(self.currentP[self.crumbs].finished){
                                title = self._opts.down.contentnomore;
                                self._sleepTadpole();
                            }
                            caption.innerHTML  = title;
                            self._loadingFalse();
                        }else {
                            if(title == _.i18n("cmp.listView.refreshTips")){//如果是提示刷新过的提示
                                // title = self._countRefreshTime() + title;
                                title = self._opts.down.contentover || _.i18n("cmp.listView.refreshTips");
                            }
                            caption.innerHTML  = title;
                            if(title == _.i18n("cmp.listView.refreshSuccess") || title == _.i18n("cmp.listView.refreshFailed")|| title == _.i18n("cmp.listView.noNetworkTips")){
                                self.refreshingTopUI = true;
                                self._noNetworkTipsShowAction(caption,title);
                            }
                        }

                    }
                    if (isPulldown) {
                        if (options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                            var totalNumText = _.i18n("cmp.listView.totalNumText",[self.total]);
                            var updateTimeText = _.i18n("cmp.listView.updateTimeText",[new Date().format("yyyy-MM-dd hh:mm")]);
                            caption.querySelector(".totalNum").innerHTML = totalNumText;
                            caption.querySelector(".updateTime").innerHTML = updateTimeText;
                        }
                        loading.className = CLASS_LOADING_DOWN;

                        if (self.bottomCaption) {
                            self._setCaptionClass(false, self.bottomCaption, self.options.up.contentdown);
                            if (self.total && options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                                self.bottomCaption.querySelector(".showText").innerHTML = self.options.up.contentdown;
                                var haveNum = self.total - ((self.currentP[self.crumbs].pageNo -1)* self._opts.up.pageSize);
                                haveNum = haveNum <= 0 ? 0 : haveNum;
                                if (self.options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                                    var haveNumText = _.i18n("cmp.listView.haveNumText",[haveNum]);
                                    var haveNumSpan = self.bottomPocket.querySelector(".haveNum");
                                    haveNumSpan.innerHTML = haveNumText;
                                    haveNumSpan.classList.remove("cmp-hidden");
                                }
                            } else {
                                var displayTitle;
                                if(self.currentP[self.crumbs].finished){
                                    if(self._opts.config.reverse){
                                        displayTitle = self.options.up.contentdown;
                                    }else {
                                        displayTitle = self.options.up.contentnomore;
                                    }
                                }else {
                                    displayTitle = self.options.up.contentdown;
                                }
                                self.bottomCaption.innerHTML = displayTitle;
                                if(!self.endOnePage){
                                    self.bottomPocket.classList.remove("cmp-next-page");
                                }else if(self.endOnePage) {
                                    if(self.options.up.contentnextpage){
                                        self.bottomCaption.innerHTML = self.options.up.contentnextpage;
                                    }
                                }
                            }
                        }
                    } else {
                        if (self.total && options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                            var haveNum = self.total - ((self.currentP[self.crumbs].pageNo -1)* self._opts.up.pageSize);
                            haveNum = haveNum <= 0 ? 0 : haveNum;
                            var haveNumText = _.i18n("cmp.listView.haveNumText",[haveNum]);
                            caption.querySelector(".haveNum").innerHTML = haveNumText;
                        }
                        if(self.bottomPocket){
                            self.bottomPocket.classList.remove('cmp-visibility');  // 新加的
                        }
                        self._setCaptionClass(false, caption, title);
                        loading.className = CLASS_LOADING_ACTIVE;
                        self._loadingFalse();
                        _.event.trigger("cmp-listview-loaded-callback",document);
                    }
                }, 100);
            } else {
                if (title !== this.lastTitle && self.refreshingTopUI == false) {
                    if(title == _.i18n("cmp.listView.refreshTips")){
                        // title = self._countRefreshTime() + title;
                        title = options.down.contentover || _.i18n("cmp.listView.refreshTips");
                    }
                    if (options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                        caption.querySelector(".showText").innerHTML = title;
                    } else {
                        caption.innerHTML = title;
                    }
                    if (self.total && options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL) {
                        if(caption.querySelector(".updateTime")){
                            var updateTimeText = _.i18n("cmp.listView.updateTimeText",[new Date().format("yyyy-MM-dd hh:mm")]);
                            pocket.querySelector(".updateTime").innerHTML = updateTimeText;
                        }else if(caption.querySelector(".haveNum")){
                            var haveNum = self.total - ((self.currentP[self.crumbs].pageNo)* self._opts.up.pageSize);
                            haveNum = haveNum <= 0 ? 0 : haveNum;
                            var haveNumText = _.i18n("cmp.listView.haveNumText",[haveNum]);
                            pocket.querySelector(".haveNum").innerHTML = haveNumText;
                        }
                    }

                    if (isPulldown) {
                        if (title === options.down.contentrefresh) {
                            loading.className = CLASS_LOADING_ACTIVE;
                        } else if (title === options.down.contentover) {
                        } else if (title === _.i18n("cmp.listView.refreshTips")) {
                            // caption.innerHTML = self._countRefreshTime() + title;
                            caption.innerHTML = options.down.contentover || _.i18n("cmp.listView.refreshTips");
                        }
                    } else {
                        if(title == options.up.contentnextpage){
                            pocket.classList.add("cmp-next-page");
                            loading.classList.remove("active");//下一页的时候，需要把蝌蚪旋转隐藏掉
                            if(options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL){
                                self.bottomPocket.querySelector(".haveNum").classList.add("cmp-hidden");
                            }
                            if(self.intiBindNextPageEvent){
                                self._bindNextPageEvent();
                                self.intiBindNextPageEvent = false;
                            }
                        }else {
                            if(title === options.up.contentrefresh){
                                loading.className = CLASS_LOADING_ACTIVE + ' ' + CLASS_VISIBILITY;
                            }else {
                                loading.className = CLASS_LOADING_INIT + ' ' + CLASS_HIDDEN;
                                if(!self.initAll && (typeof self.network != "undefined" && self.network == false)){
                                    self._initNoNetworkTipsShow(title);
                                }
                            }
                            if(options.config.captionType == PULL_CAPTION_TYPE.TYPE_TOTAL){
                                self.bottomPocket.querySelector(".haveNum").classList.remove("cmp-hidden");
                            }
                            pocket.classList.remove("cmp-next-page");
                        }
                        self._setCaptionClass(false, caption, title);
                    }
                    this.lastTitle = title;
                    if(self.initAll && self.pageNo == 1 && (typeof self.network != "undefined" && self.network == false)){

                        self._initNoNetworkTipsShow(title);
                        self.initAll = false;
                    }
                }
            }
        }
    };
    pullRefresh.prototype._initNoNetworkTipsShow = function(title){
        var self = this;
        setTimeout(function(){
            if(!self.refreshButDontSeeRefreshTips){
                self.topPocket.style.zIndex="80";
                self.topPocket.classList.add("dialog");
                self.topPocket.classList.add("cmp-visible");
                self.topPocket.classList.add("cmp-block");
                self.topPocket.classList.add("cmp-visibility");
                self.topCaption.innerHTML = _.i18n("cmp.listView.noNetworkTips");
                self.refreshButDontSeeRefreshTips = true;
            }else {
                delete self.refreshButDontSeeRefreshTips;
            }

            setTimeout(function(){
                self.topPocket.style.zIndex="";
                self.topPocket.classList.remove("cmp-visible");
                self.topPocket.classList.remove("dialog");
                self.topPocket.classList.remove("cmp-block");
                self.topPocket.classList.remove("cmp-visibility");
                self.topCaption.innerHTML = title;
                self._loadingFalse();
                self.refreshingTopUI = false;
                delete self.refreshButDontSeeRefreshTips;
            },800);
        },350);
    }
    pullRefresh.prototype._noNetworkTipsShowAction = function(caption,title){
        var self = this;
        setTimeout(function () {
            self._sleepTadpole();
            self.topLoading.style.display="none";
            if(!self.refreshButDontSeeRefreshTips){
                // self.topPocket.style.zIndex="80";
                self.topPocket.classList.remove("awaken");
                self.topPocket.classList.add("sleep");
                // self.topPocket.classList.add("dialog");
                if(typeof self.network != "undefined" && self.network == false){
                    self.topPocket.style.zIndex="80";
                    self.topPocket.classList.add("dialog");
                }
                if(title == _.i18n("cmp.listView.refreshFailed")){
                    // self.topPocket.classList.add("failed");
                }
            }else {
                delete self.refreshButDontSeeRefreshTips;
            }
            setTimeout(function(){
                self.topPocket.style.zIndex="";
                // self.topPocket.classList.remove("failed");
                self.topPocket.classList.remove("dialog");
                if(self.isLoadError.down && self.pagingNo ==1){
                    self.bottomCaption.innerHTML = "";
                }else {
                    // title  = self._countRefreshTime() + title;
                    title  = self.options.down.contentover || _.i18n("cmp.listView.refreshTips");
                }
                caption.innerHTML  = title;
                self._loadingFalse();
                self.refreshingTopUI = false;
                _.event.trigger("cmp-listview-loaded-callback",document);
            },800);
        }, 350);
    };

    pullRefresh.prototype._bindNextPageEvent = function(){
        var self = this;
        var  _nextPageLoadData = function(){
            if(self.bottomPocket.classList.contains("cmp-next-page")){
                self.initNextPageLoadData = true;
                self.pagingNo ++;
                self._pullupLoading();
                if(self._opts.up.callback && typeof self._opts.up.callback == "function"){
                    self._opts.up.callback.call(this,self.pageNo,self.pagingNo);
                }
            }
        };
        self.bottomPocket.removeEventListener("tap",_nextPageLoadData,false);
        self.bottomPocket.addEventListener("tap",_nextPageLoadData,false);

    };
    pullRefresh.prototype._bindPrevPageEvent = function(topPrevPageBtn){
        var self = this;
        var _prevPageLoadData = function(){
            var onePageNo = self._opts.config.onePageMaxNum/self._opts.config.pageSize;
            var currentPaging_pageNo= onePageNo - ((self.pagingNo * onePageNo)%(self.pageNo-1));
            self.pagingNo --;
            if(self.pagingNo <= 0) {
                self.pagingNo = 1;
            }
            self.pageNo = self.pageNo - currentPaging_pageNo - onePageNo;
            if(self.pageNo <= 0) {
                self.pageNo = 1;
            }
            self.currentP[self.crumbs].pageNo = self.pageNo;
            self.prevPageLoadData = true;
            topPrevPageBtn.style.display = "none";
            var scrollChildren = self._cmpScroll.children;
            if(scrollChildren && scrollChildren.length > 0){
                var firstChild = scrollChildren[0];
                _.before(firstChild,top_prePageBtn_replace_loading_div);
                self.topPrePageBtnReplaceLoading = self._cmpScroll.querySelector(".cmp-replace-loading");
                topPrevPageBtn.removeEventListener("tap",_prevPageLoadData,false);
                topPrevPageBtn.remove();
                topPrevPageBtn = null;
            }
            self._pullupLoading();
            if(self._opts.down.callback && typeof self._opts.down.callback == "function"){
                self._opts.down.callback.call(this,self.pageNo,self.pagingNo);
            }
        };
        topPrevPageBtn.removeEventListener("tap",_prevPageLoadData,false);
        topPrevPageBtn.addEventListener("tap",_prevPageLoadData,false);
    };
    pullRefresh.prototype._setCaptionClass = function (isPulldown, caption, title) {
        var self = this;
        if (!isPulldown) {
            switch (title) {
                case self.options.up.contentdown:
                    caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                    break;
                case self.options.up.contentrefresh:
                    caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH;
                    break;
                case self.options.up.contentnomore:
                    caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
                    break;
            }
        }
    };
    pullRefresh.prototype._countRefreshTime = function(){
        var self = this;
        var text = "";
        var refreshedTime = self.currentP[self.crumbs].refreshTimeScale;
        var currentTime = new Date().getTime();
        var timeSpace = (currentTime - refreshedTime)/1000;
        if(timeSpace <= 30){  //如果小于30秒，则为刚刚
            text = _.i18n("cmp.listView.recent");
        }else if(timeSpace > 30 && timeSpace < 60) {
            text =   _.i18n("cmp.listView.second",[Math.floor(timeSpace)]);
        }else if(timeSpace >= 60 && timeSpace < 3600) {
            text =  _.i18n("cmp.listView.minute",[Math.floor(timeSpace/60)]);
        }else {
            text = _.i18n("cmp.listView.hour",[Math.floor(timeSpace/3600)]);
        }
        return text;

    };
    //用于拉出额外部件end时的优化动画回弹效果
    pullRefresh.prototype._scrollEndBounce4Widget = function(y){
        var self = this;
        if(Math.abs(y) > Math.abs(self.topOffset)) return;
        var y;
        if((Math.abs(self.topOffset)-Math.abs(y)) > (Math.abs(self.topOffset)/3)){
            y = 0;
            self.widget.classList.add("showAction");
        }else {
            y = self.topOffset;
            self.widget.classList.remove("showAction");
        }
        self.widget.classList.add("initAction");
        self.scrollTo(0,y,300);
    };
    pullRefresh.prototype._destory = function(){
        var self = this;
        delete pageMap[self._container];
        self.destroy();
        var saveMark = self.crumbs?(self._container + "&" + self.crumbs) :self._container;
        _.storage.delete(saveMark,true);
        delete _.cache["list_cache_data_" + saveMark];
        for(var k in self){
            delete self[k];
        }
        self = undefined;
        pullRefreshMap = {};
    };
    //重新计算滚动区高度(提供给开发调用的方法)
    pullRefresh.prototype.refreshHeight = function(height){
        var self = this;
        self.wrapper.style.height = height + "px";
        self.refresh();
    };
    //更新额外部件
    pullRefresh.prototype.updateAdditionalParts = function(active){
        var self = this;
        if(active){
            if(self.widget) self.widget.classList.remove("active");
            self.widgetShow = false;
            self.additionalPartsShow = true;
            self.additionalParts = self.wrapper.querySelector(".cmp-scroll-parts");
            self.additionalParts.style.display = "block";
            self.topOffset = 0;
        }else {
            if(self.widget) {
                self.widget.classList.add("active");
                self.topOffset = -(self.widget.offsetHeight);
            }
            self.widgetShow = true;
            self.additionalPartsShow = false;
            self._opts.onScrollMove = undefined;
            self.additionalParts = self.wrapper.querySelector(".cmp-scroll-parts");
            if(self.additionalParts){
                self.additionalParts.style.display = "none";
                self.additionalParts = undefined;
            }
        }
        self.refresh();
    };
    //更新小部件的显示与否
    pullRefresh.prototype.updateWidget = function(active){
        var self = this;
        if(active){
            if(!self.widget) self.widget = self.wrapper.querySelector(".cmp-pull-widget");
            self.widget.classList.add("active");
            self.widget.style.display = "block";
            self.widgetShow = true;
            self.topOffset = -(self.widget.offsetHeight);
        }else {
            if(!self.widget) self.widget = self.wrapper.querySelector(".cmp-pull-widget");
            self.widget.classList.remove("active");
            self.widget.style.display = "none";
            self.widgetShow = false;
            self.topOffset = 0;
        }
        self.refresh();
    };

    //listview组件销毁全部销毁
    pullRefresh.prototype.destroyListview = function(){
        var self = this;
        if(self.widget)self.widget.remove();
        if(self.additionalParts)self.additionalParts.remove();
        if(self.topPocket)self.topPocket.remove();
        if(self.bottomPocket)self.bottomPocket.remove();
        self._destory();
    };
    //销毁组件但是保留额外部件
    pullRefresh.prototype.destroyListviewButParts = function () {
        var self = this;
        if(self.topPocket)self.topPocket.remove();
        if(self.bottomPocket)self.bottomPocket.remove();
        self._destory();
    }
    //刷新初始化数据
    pullRefresh.prototype.refreshInitData = function(){
        var self = this;
        self.pagingNo = 1;
        var topPrevPageBtn = self._cmpScroll.querySelector(".cmp-pull-top-btn");
        if(topPrevPageBtn){
            topPrevPageBtn.remove();
            topPrevPageBtn = null;
        }
        var saveMark = self.crumbs?(self._container + "&" + self.crumbs) :self._container;
        var crumbsData = _.cache["list_cache_data_" + saveMark];
        if(crumbsData){//将缓存数据先清除
            delete _.cache["list_cache_data_" + saveMark]
        }
        if(arguments.length > 0){
            self.refreshButDontSeeRefreshTips = true;
        }
        self.pulldownLoading(function (){
            self.scrollTo(0,0,300);
            var endCallback = self._opts && self._opts.onScrollEnd?self._opts && self._opts.onScrollEnd:null;
            if(endCallback){
                setTimeout(function(){
                    endCallback.call(self.y);
                },310);
            }
        });

    };
    //获取listview对象各种尺寸
    pullRefresh.prototype.getSize = function(){
        var self = this;
        return {
            x:self.x,//当前滚动到的x坐标
            y:self.y,//当前滚动到的y坐标
            wrapperW:self.wrapperW,//容器宽度
            wrapperH:self.wrapperH,//容器高度
            scrollerW:self.scrollerW,//滚动层宽度
            scrollerH:self.scrollerH,//滚动层高度
            maxScrollX:self.maxScrollX,//滚动层最大可以滚动X向的距离
            maxScrollY:self.maxScrollY,//滚动层最大可以滚动的Y向距离
            minScrollY:self.minScrollY//滚动层最小可以滚动的Y向距离
        }
    };
    pullRefresh.prototype.setPageParams = function(pageParams){
        var self = this;
        var _pageParams = _.extend({
            pageNo:1,
            pagingNo:1
        },pageParams);

        self.currentP[self.crumbs].pageNo = _pageParams.pageNo;
        self.currentP[self.crumbs].pagingNo = _pageParams.pagingNo;
    };
    function delPullRefreshMapCache(container){
        pageMap[container]._destory();//删除时，要把绑定的事件彻底删除干净
        for(var key in pageMap[container]){
            delete pageMap[container][key];
        }
        delete pageMap[container];
        delete pullRefreshMap[container];
    }
    _.pullRefreshList = function (container, opts) {
        if (!pullRefreshMap[container]) {
            pullRefreshMap[container] = new pullRefresh(container, opts);
        }
        return pullRefreshMap[container];
    };

    _.listView = function (container, opts) {
        if(opts && opts["config"]) {
            if(opts["config"].clearUI)    //有一个场景是同一个id但是需要把ui清除掉
                if(pageMap[container]){
                    pageMap[container].destroyListview();
                    delete pageMap[container];
                }
        }
        if(pageMap[container] && opts){//删除同一个id，不同类型的scroll
            if(!pageMap[container].pullRefreshScroll){
                delPullRefreshMapCache(container);
            }
        }
        opts = opts || {};
        if (!pageMap[container]) {
            var config = {
                isClear:true,
                clearCache:false,
                pageSize: 20,
                captionType: 0,
                crumbsID:null,
                purpose:1,//列表用作的方式1、普通内容展示；2、搜索内容展示；3、。。。后面可能需要进行扩展
                onePageMaxNum:80,//一屏最大数据条数
                customScrollMoveEvent:null,//自定义滚动到顶部的事件,如果开发着定义该值，将滚动的y值返回给开发者
                renderNoDataCallback:null,//无数据的时候回调开发者定义的函数
                reverse:false//是否倒序
            };
            if (opts.config) {
                config = _.extend(config, opts.config);
                opts.config = config;
            }
            if (opts.down && config) {
                if (config.captionType == 1) {
                    config.height = 60;
                } else {
                    config.height = 50;
                }
                _.extend(opts.down, config);
            }
            if (opts.up && config) {
                if (config.captionType == 1) {
                    config.height = 60;
                } else {
                    config.height = 50;
                }
                _.extend(opts.up, config);
            }
            if(opts.imgCache && config){
                var offset = (typeof opts.offset != 'undefined')?opts.offset:null;//懒加载检测范围
                var type = (typeof opts.imgCacheType != "undefined")?opts.imgCacheType:2;
                var imgCache = cmp.imgCache(container,{scroll:true,type:type,offset:offset});
                opts.onScrollEnd = function(){
                    imgCache.inspect(this.x,this.y);
                };
                opts.onRefresh = function(){
                    imgCache.inspect(this.x,this.y);
                };
                _.extend(opts.onScrollEnd,config);
            }

            if ((opts.down && opts.down.hasOwnProperty("dataFunc")) || (opts.up && opts.up.hasOwnProperty("dataFunc"))) {
                pageMap[container] = _.pullRefreshList(container, opts);
            } else {
                if(opts && opts["config"]){
                    if(opts["config"].customScrollMoveEvent && typeof opts["config"].customScrollMoveEvent == "function"){
                        var customScrollMoveEvent = opts["config"].customScrollMoveEvent;
                        opts.onScrollMove = function(){
                            customScrollMoveEvent(this.y);
                        }
                    }
                }

                pageMap[container] = new _.iScroll(container, opts);
            }
        } else {
            if (opts["config"]) {
                if(!opts["config"].customScrollMoveEvent &&  (opts["config"].isClear || !pageMap[container].currentP[opts["config"].crumbsID])){ //如果是首次进行面包屑或者每次都是重新请求数据
                    if (pageMap[container].options.down) {
                        pageMap[container].options.down.crumbs = opts.config.crumbsID;
                        pageMap[container].options.down.params = opts.config.params;
                        pageMap[container].options.down.pageSize = opts.config.pageSize || 20;
                        pageMap[container].options.down.dataFunc = opts.config.dataFunc;
                        pageMap[container].options.down.renderFunc = opts.config.renderFunc;
                    }
                    if (pageMap[container].options.up) {
                        pageMap[container].options.up.crumbs = opts.config.crumbsID;
                        pageMap[container].options.up.params = opts.config.params;
                        pageMap[container].options.up.pageSize = opts.config.pageSize || 20;
                        pageMap[container].options.up.dataFunc = opts.config.dataFunc;
                        pageMap[container].options.up.renderFunc = opts.config.renderFunc;
                    }
                    pageMap[container]._opts.config.crumbsID = opts["config"].crumbsID;
                    pageMap[container].crumbs = opts.config.crumbsID;
                    pageMap[container].currentP[opts.config.crumbsID] = {};
                    pageMap[container].currentP[opts.config.crumbsID].pageNo =1;
                    pageMap[container].currentP[opts.config.crumbsID].finished = false;
                    pageMap[container].currentP[opts.config.crumbsID].refreshTimeScale = new Date().getTime();
                    pageMap[container].pagingNo = 1;
                    pageMap[container].scrollTo(0, 0);//首次创建新的面包屑时，滚动到0,0位置
                    if(pageMap[container].topPocket){//如果有头部下拉刷新ui，则要隐藏
                        pageMap[container]._setCaptionOpacity(pageMap[container].topPocket,0);
                    }
                    pageMap[container].pullupLoading(1);
                }else if(pageMap[container].currentP[opts["config"].crumbsID]) {
                    pageMap[container].crumbs = opts["config"].crumbsID;
                    pageMap[container]._opts.config.crumbsID = opts["config"].crumbsID;
                    if (pageMap[container].options.down) {
                        pageMap[container].options.down.crumbs = opts.config.crumbsID;
                        pageMap[container].options.down.params = opts.config.params;
                        pageMap[container].options.down.pageSize = opts.config.pageSize ||20;
                        pageMap[container].options.down.dataFunc = opts.config.dataFunc;
                        pageMap[container].options.down.renderFunc = opts.config.renderFunc;
                    }
                    if (pageMap[container].options.up) {
                        pageMap[container].options.up.crumbs = opts.config.crumbsID;
                        pageMap[container].options.up.params = opts.config.params;
                        pageMap[container].options.up.pageSize = opts.config.pageSize || 20;
                        pageMap[container].options.up.dataFunc = opts.config.dataFunc;
                        pageMap[container].options.up.renderFunc = opts.config.renderFunc;
                    }
                    if(pageMap[container].topPocket){//如果有头部下拉刷新ui，则要隐藏
                        pageMap[container]._setCaptionOpacity(pageMap[container].topPocket,0);
                    }
                    pageMap[container]._initPullupRefresh();
                    var finished = pageMap[container].currentP[opts["config"].crumbsID].finished;
                    var pagingNo = pageMap[container].currentP[opts["config"].crumbsID].pagingNo;
                    var refreshTimeScale = pageMap[container].currentP[opts.config.crumbsID].refreshTimeScale;
                    if(finished) {
                        pageMap[container]._setCaption(pageMap[container].options.up.contentnomore);
                    }else {
                        pageMap[container]._setCaption(pageMap[container].options.up.contentdown);
                    }
                    if(pagingNo){
                        pageMap[container].pagingNo = pagingNo;
                    }else {
                        pageMap[container].pagingNo = 1;
                    }
                    pageMap[container].finished = finished;
                    pageMap[container].refreshTimeScale = refreshTimeScale;
                    pageMap[container].pullupLoading();
                }
                if(opts["config"].customScrollMoveEvent){
                    pageMap[container]._opts["config"].customScrollMoveEvent = opts["config"].customScrollMoveEvent;
                }else {
                    pageMap[container]._opts["config"].customScrollMoveEvent = null;
                }
            }
        }
        return pageMap[container];
    };

    //=============================================================listview end======================================//
})(cmp);
