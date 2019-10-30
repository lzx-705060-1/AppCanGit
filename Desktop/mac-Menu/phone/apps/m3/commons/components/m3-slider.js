/**
 * @Description slider轮播，fullpage
 * @Author Clyne
 * @createTime 2017-12-14
 */
;(function() {
    //定义配置参数模块
    define(function(require, exports, module){
        require('zepto');
        module.exports = slider;
    });
    function slider( el, ops ) {
        //安全作用域构造函数
        if ( this instanceof slider ) {
            var defaults = {
                //节点元素
                el: $(el),
                //sliderH 横向， sliderV纵向，
                type: ops.type || 'sliderH',
                //自动播放
                autoPlay: ops.autoPlay || false,
                //模板
                template: ops.template || '',
                //下一页的判断阈值
                thresholdVal: ops.thresholdVal || 100,
                //动画时间
                functionTime: ops.functionTime || 400,
                //动画轮询时间
                loopTime: ops.loopTime || 3000,
                //逗点设置
                hasDot: ops.hasDot || false
            }
            for ( var i in defaults ) {
                this[i] = defaults[i];
            }
            this.init();
        } else {
            return new slider(el, ops);
        }
    }

    //原型链
    slider.prototype = {

        init: function() {
            this.initTemplate();
            this.initStyle();
            if ( this.nodeLen <= 3 ) {return;}
            this.initEvent();
            this.indexTo(1, 0);
            this.setAutoPlay(this.autoPlay);
        },

        //初始化模板
        initTemplate: function() {
            this.moveEl = $('<div class="m3-slider-move"></div>');
            this.moveEl.append(this.template);
            //补充节点
            var firstNode = this.moveEl.children().first().clone(),
                lastNode = this.moveEl.children().last().clone();
            this.moveEl.children().first().before(lastNode);
            this.moveEl.append(firstNode);
            this.el.append(this.moveEl);
            if ( this.moveEl.children().length <= 3 ) return;
            if ( !this.hasDot ) return;
            var str = '<div class="m3-slider-dot">';
            for ( var i = 0,obj;i < this.moveEl.children().length - 2;i++ ) {
                str += '<span></span>';
            }
            str += '</div>';
            this.el.append(str);
        },

        //初始化样式
        initStyle: function() {
            this._w = this.el.width();
            this._h = this.el.height();
            this.nodeLen = this.moveEl.children().length;
            this.moveEl.css({
                width: (this.nodeLen * this._w) + 'px',
                height: this._h + 'px',
                overflow: 'hidden'
            });
            this.moveEl.children().css({
                width: this._w + 'px',
                height: this._h + 'px'
            });
            if (this.type === 'sliderH') {
                this.moveEl.children().css('float','left');
            }
            this.el.css('overflow','hidden');
        },

        //初始化事件
        initEvent: function() {
            var objThis = this,
                curDis;
            this.moveEl.on('touchstart', function( e ) {
                e.preventDefault();
                curDis = 0;
                objThis.x = e.touches[0].pageX;
                objThis.setAutoPlay(false);
            }).on('touchmove', function( e ) {
                //横向
                if ( objThis.type === 'sliderH' ) {
                    curDis = Math.floor(e.touches[0].pageX - objThis.x);
                    objThis.posXY(curDis + objThis.disXY, 0, 0);
                }
            }).on('touchend', function() {
                //上一页
                if ( curDis > 0 && Math.abs(curDis) > objThis.thresholdVal && objThis.type === 'sliderH' ) {
                    objThis.indexTo(--objThis.index);
                //下一页
                } else if ( curDis < 0 && Math.abs(curDis) > objThis.thresholdVal && objThis.type === 'sliderH' ) {
                    objThis.indexTo(++objThis.index);
                //弹回
                } else {
                    objThis.indexTo(objThis.index);
                }
                objThis.setAutoPlay(objThis.autoPlay);
            });
        },

        //位移函数
        posXY: function( x, y, time ) {
            time === 0 ? time = 0 : time = time || this.functionTime;
            this.moveEl.css({
                transform: 'translate3d(' + x + 'px, ' + y + 'px, 0)',
                '-webkit-transform': 'translate3d(' + x + 'px, ' + y + 'px, 0)',
                transitionDuration: time + 'ms'
            });
        },

        //设置轮播到指定位置
        setIndex: function( index, time ) {
            //当前值比对
            if ( this.getIndex() === index ) {
                return;
            }
            //超出范围检查
            if ( index < 0 || index > this.nodeLen - 3 ) {
                console.log('大神，Why are you so diao,你的index值都已经超出范围了，划不动了');
                return;
            }
            //当前index=0，要滑动到最后的边界值情况
            if ( this.getIndex() === 0 && index === this.nodeLen - 3 ) {
                this.indexTo(0, time);
            //当前index最后一个，要滑动到第一个的边界值情况
            } else if ( this.getIndex() === this.nodeLen - 3 && index === 0 ) {
                this.indexTo(this.nodeLen - 1, time);
            } else {
                this.indexTo(index + 1, time);
            }
        },

        //内部函数，仅仅内部使用，跳转到内部指定index
        indexTo: function( index, time, isLoop ) {
            var objThis = this;
            this.index = index;
            this.moveEl.children().removeClass('m3-slider-active');
            this.moveEl.children().eq(index).addClass('m3-slider-active');
            //横向
            if ( this.type === 'sliderH' ) {
                this.disXY = index * -this._w;
                this.posXY(this.disXY, 0, time);
                if ( isLoop ) {return;}
                //最大边界值,
                if ( this.index === this.nodeLen - 1 ) {
                    this.index = 1;
                    setTimeout(function() {
                        objThis.indexTo(1, 0, true);
                    }, objThis.functionTime);
                } else if ( this.index === 0 ) {
                    this.index = this.nodeLen - 2;
                    setTimeout(function() {
                        objThis.indexTo(objThis.nodeLen - 2, 0, true);
                    }, objThis.functionTime);
                }
                this.setDotByIndex();
            }
        },

        //获取当前轮播的index
        getIndex: function() {
            //边界值
            return this.index - 1;
        },

        //获取子元素长度
        getNodeLen: function() {
            return this.nodeLen - 2;
        },

        //设置自动播放
        setAutoPlay: function( state ) {
            var objThis = this;
            if ( state ) {
                this.timer = setInterval(function() {
                    objThis.indexTo(++objThis.index);
                }, this.loopTime);
            } else if ( state === false ) {
                clearInterval(this.timer);
            }
        },
        
        //设置dot
        setDotByIndex: function() {
            var obj = this.el.find('.m3-slider-dot').find('span');
            obj.removeClass('m3-dot-active');
            obj.eq(this.getIndex()).addClass('m3-dot-active');
        },

        refresh: function() {
            this.initStyle();
            this.indexTo(this.getIndex(), 0);
        }
    }
})();