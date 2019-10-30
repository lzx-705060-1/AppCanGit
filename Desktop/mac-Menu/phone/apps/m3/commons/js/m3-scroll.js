/**
 * @description 原生缓存模块
 * @author Clyne
 * @createDate 2017-11-03
 */
;(function() {
    var IScroll, m3i18n;
    //定义模块
    define(function(require, exports, module){
        require('zepto');
        m3i18n = require('m3i18n');
        IScroll = require('iscroll');
        module.exports = m3Scroll;
    });
    
    /**
     * @description M3滚动条组件 *代表必填
     * @type M3业务组件 
     * @options.el 目标DOM [object String] *
     * @options.type 滚动条类型 [object String]
     * @options.refreshCb 刷新回调 [object Function] 
     * @options.nextCb 下一页回调 [object Function]
     */
    function m3Scroll(ops) {
        if (this instanceof m3Scroll) {
            //初始化变量
            var defaults = {
                //元素 target 必填
                el: ops.el,
                //类型 pageScroll 分页类， scrollY，滚动条Y 非必填
                type: ops.type || 'pageScroll',
                //pageNum 页数 非必填
                pageNum: ops.pageNum || 1,
                //总页数 非必填
                totalPage: ops.totalPage || 1,
                //刷新回调 非必填
                refreshCb: ops.refreshCb,
                //下一页 非必填
                nextCb: ops.nextCb || function() {this.refresh();},
                
                // ========= scrollY参数 ========
                //scrollY类型滚动条，事件触发时候的临界值，非必填
                criticalValue: ops.criticalValue || 0,
                //临界点下拉回调 非必填
                criticalDownCb: ops.criticalDownCb || function() {},
                //临界点上拉回调 非必填
                criticalUpCb: ops.criticalUpCb || function() {},
                scrollbars: typeof ops.scrollbars == 'undefined' || Boolean(ops.scrollbars) ? true : false,
            };
            for (var i in defaults) {
                this[i] = defaults[i];
            }
            this.refreshBar = $('.m3-refresh-bar');
            this.moreBar = $('.m3-more-bar');
            this.moreLoadNode = this.moreBar.find('span');
            this.freshLoadNode = this.refreshBar.find('span');
            this.refreshAminateTime = this.refreshAminateTime || 400;
            //
            this.topOffset = this.refreshBar.height() || 0;
            this.downOffset = this.moreBar.height() || 0;
            //拖拽标识
            this.canDrug = true;
            //临界点标识,是否到达过临界点
            this.isCritical = false;
            this.init();
        } else {
            return new m3Scroll(ops);
        }
    }

    m3Scroll.prototype = {
        //
        init: function() {
            var objThis = this;
            //兼容chrome浏览器禁用preventDefault问题
            document.body.style.touchAction = 'none';
            this.scroll = new IScroll(this.el, {
                probeType: 2,
                scrollbars: this.scrollbars,
                scrollX:false,
                fadeScrollbars: true,
                topOffset: this.topOffset,
                downOffset: this.downOffset
            });
            setTimeout(function() {
                if (objThis.totalPage > this.pageNum) {
                    objThis.moreBar.find('.bar-text').text(m3i18n[cmp.language].pullupTipDown);
                }
                objThis.scroll.refresh();
            }, 0)
            //自定义事件
            this.scroll.on('scrollStart', function(e) {objThis.scrollStart()});
            this.scroll.on('scroll', function(e) {objThis.scrollMove()});
            this.scroll.on('flick', function(e) {return false;});
            this.scroll.on('scrollEnd', function(e) {objThis.scrollEnd()});
        },

        scrollStart: function() {
            //重置类型
            this.operType = '';
            this.curOperType;
            this.curLoadNum = 0;
            if ( this.scroll.wrapperHeight >= this.scroll.scrollerHeight ) {
                this.drugTip = true;
            }
        },
        
        curLoadNum: 0,

        //
        scrollMove: function() {
            if (!this.canDrug) return;
            //分页类滚动条
            if ( this.type === 'pageScroll' ) {
                //正常的刷新
                if (this.scroll.y > 0 && this.refreshCb) {
                    this.scroll.options.topOffset = 0;
                    this.operType = this.curOperType = 'refresh';
                //下一页
                } else if (this.scroll.maxScrollY > this.scroll.y + this.downOffset && this.nextCb) {
                    if (this.pageNum !== this.totalPage) {
                        this.scroll.options.downOffset = 0;
                        this.operType = this.curOperType = 'next'
                        this.moreBar.find('.bar-text').text(m3i18n[cmp.language].pulldownTipOver);
                    }
                //正常滚动
                } else if (this.scroll.maxScrollY > this.scroll.y) {
                    //滚动到底部出现加载动画
                    if (this.pageNum !== this.totalPage) {
                        var num = Math.ceil((this.scroll.maxScrollY - this.scroll.y) / 4.5);
                        if (this.curLoadNum !== num && num <= 9) {
                            this.curLoadNum = num;
                            this.showLoading(num);
                        }
                        this.moreBar.find('.bar-text').text(m3i18n[cmp.language].pullupTipDown);
                    }
                    this.operType = '';
                } else {
                    this.operType = '';
                }
            //常规滚动条
            } else if ( this.type === 'scrollY' ) {
                if ( this.drugTip && this.scroll.distY > 0 ) {
                    this.criticalDownCb();
                    this.drugTip = false;
                }
                if ( this.scroll.wrapperHeight >= this.scroll.scrollerHeight ) {
                    return;
                }
                //判断是否为上拉临界点，执行上拉临界回调
                if ( this.scroll.distY < 0 && this.scroll.y < -this.criticalValue && !this.isCritical ) {
                    this.isCritical = true;
                    this.criticalUpCb();
                //判断是否为下拉临界点，执行下拉临界回调
                } else if ( this.scroll.distY > 0 && this.isCritical && this.scroll.y > -this.criticalValue ) {
                    this.isCritical = false;
                    this.criticalDownCb();
                }
            }
        },
        
        showLoading: function(num) {
            for (var i = 0;i < 8;i++) {
                if (i < num - 1) {
                    this.moreLoadNode.eq(i).css('opacity', 1);
                } else {
                    this.moreLoadNode.eq(i).css('opacity', 0);
                }
            }
        },

        scrollEnd: function() {
            if (!this.operType) return;
            if (!this.canDrug) return;
            this.canDrug = false;
            if ( this.type === 'pageScroll' ) {
                if (this.operType === 'next') {
                    this.pageNum++;
                } else if (this.operType === 'refresh'){
                    this.pageNum = 1;
                }
                if (this.pageNum <= this.totalPage) {
                    this.loadingAnimate();
                    this[this.operType + 'Cb'](this.pageNum);
                    this.operType = '';
                } else {
                    this.pageNum = this.totalPage;
                    this.refresh();
                }
            }
        },

        refresh: function(total, pageNum) {
            var objThis = this;
            this.scroll.options.topOffset = this.topOffset;
            this.scroll.options.downOffset = this.downOffset;
            if (total !== undefined){
                this.totalPage = total;
            } 
            if (pageNum !== undefined){
                this.pageNum = pageNum;
            }
            if (this.curOperType === 'refresh') {
                this.scrollTo(-this.topOffset, 400);
            } else if (this.curOperType === 'next') {
                this.scrollTo(this.scroll.maxScrollY - this.downOffset, 400);
            }
            this.curOperType = '';
            setTimeout(function() {
                if (objThis.pageNum === objThis.totalPage) {
                    if (objThis.pageNum !== 1) {
                        objThis.moreBar.find('.bar-text').text(m3i18n[cmp.language].pullupTipNomore);
                    } else {
                        objThis.moreBar.find('.bar-text').text('');
                    }
                } else {
                    objThis.moreBar.find('.bar-text').text(m3i18n[cmp.language].pullupTipDown);
                }
                objThis.canDrug = true;
                objThis.moreBar.find('.cmp-spinner').removeClass('active').find('span').removeAttr('style');
                objThis.refreshBar.find('.cmp-spinner').removeClass('active').find('span').removeAttr('style');
                objThis.scroll.refresh();
            }, 0);
        },

        scrollTo: function(y, time) {
            this.scroll.scrollTo(0, y, time || 0);
        },

        loadingAnimate: function() {
            //刷新加载的动画
            if (this.operType === 'refresh') {
                this.refreshBar.find('.cmp-spinner').addClass('active');
            //下拉加载的动画
            } else {
                this.moreBar.find('.cmp-spinner').addClass('active');
            }
            this.moreBar.find('.bar-text').text(m3i18n[cmp.language].pullupTipRefresh);
        }
    };
})();