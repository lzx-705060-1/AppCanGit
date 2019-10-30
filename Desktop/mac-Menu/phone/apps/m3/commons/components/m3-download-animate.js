/**
 * author Clyne
 * description 下载动画组件
 * createDate 2017-11-29
 */
;(function() {
    
    /**
     * @description 模块定义模块
     */
    define(function(require, exports, module){
        module.exports = downloadAnimate;
    });
    
    /**
     * @param options.el 需要绑定的元素 [object HTML***Element]不是jquery对象哈，大神们别写错了
     * @param options.loadedCb 开始动画加载完后需要的回调 [object Function]
     */
    function downloadAnimate(options) {
        //安全作用域构造函数
        if (this instanceof downloadAnimate) {
            //初始化
            for (var i in options) {
                this[i] = options[i];
            }
        } else {
            return new downloadAnimate(options)
        }
        this.init();
        this.ctx = this.cav.getContext('2d');
        this.animate('start', this.loadedCb);
    }

    /* 原型链 */
    downloadAnimate.prototype = {

        //初始化
        init: function() {
            this.cav = document.createElement('canvas');
            this.cav.className = 'm3-cav-loading';
            //宽度
            this._w = parseInt(this.el.offsetWidth) * 2;
            //高度
            this._h = parseInt(this.el.offsetWidth) * 2;
            //初始化样式
            this.cav.setAttribute('width', this._w);
            this.cav.style.width = this._w / 2 + 'px';
            this.cav.setAttribute('height', this._h);
            this.cav.style.height = this._h / 2 + 'px';
            this.el.appendChild(this.cav);
            //中心X坐标
            this.cenX = this._w / 2;
            //中心Y坐标
            this.cenY = this._h / 2;
            //半径
            this.R = this._w / 2;
            //动画的动态半径
            this.curR = 0;
        },

        //清除图层
        clean: function() {
            this.cav.setAttribute('height', this._h); 
        },

        //画图API
        drawCircle: function(r, deg, color, globalCompositeOperation) {
            this.ctx.beginPath();
            if (deg < 360)
                this.ctx.moveTo(this.cenX, this.cenY);
            this.ctx.fillStyle = color;
            if (globalCompositeOperation)
                this.ctx.globalCompositeOperation = globalCompositeOperation;
            this.ctx.arc(this.cenX, this.cenY, r, 0, deg * Math.PI / 180, false);
            this.ctx.closePath();
            this.ctx.fill();
        },
        
        loadProgress: function(precent) {
            var objThis = this;
            if (precent - this.lastPrecent > 2 && !this.animateLoaded) {
                this.animateLoaded = false;
                    objThis.lastPrecent = precent;
                    objThis.loadProgressAnimate(precent);
            }
        },

        //加载进度
        loadProgressAnimate: function(precent) {
            var objThis = this;
            this.precent += 1;
            this.timer = window.requestAnimationFrame(function() {
                if (objThis.precent >= precent) {
                    if (objThis.precent === 100) {
                        objThis.animate('end');
                    }
                    this.animateLoaded = true;
                    window.cancelAnimationFrame(objThis.timer);
                    return;
                }
                //角度转换
                var deg = objThis.precent * 3.6;
                //进度扇形
                objThis.drawCircle(objThis.R - 10, deg, '#fff', 'destination-out');
                objThis.loadProgressAnimate(precent);
            })
        },

        //初始化图层
        initStart: function() {
            //巨星
            this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
            this.ctx.fillRect(0, 0, this._w, this._h);
            //透明圆形
            this.drawCircle(this.R - 10, 360, '#f00', 'destination-out');
            //灰色圆形
            this.drawCircle(this.R - 18, 360, 'rgba(0,0,0,0.3)', 'source-over');
        },

        //动画
        animate: function(type, callback) {
            var objThis = this;
            this.clean();
            this.curR = 0;
            this.drawCircle(this.R, 360, 'rgba(0,0,0,0.3)')
            if (type === 'start') {
                objThis.animateFun(this.R - 10, function() {
                    objThis.clean();
                    objThis.initStart();
                    objThis.precent = objThis.lastPrecent = 0;
                    callback();
                });
            } else {
                this.animateFun(this.R + 10, callback || function() {});
            }
        },

        //动画递归
        animateFun: function(ifNum, callback) {
            var objThis = this;
            this.curR = this.curR + 3;
            var timer = window.requestAnimationFrame(function() {
                console.log(objThis.curR);
                if (objThis.curR >= ifNum) {
                    callback();
                    window.cancelAnimationFrame(timer);
                    return;
                }
                objThis.drawCircle(objThis.curR, 360, '#fff', 'destination-out')
                objThis.animateFun(ifNum, callback);
            });
        }
    }
})();