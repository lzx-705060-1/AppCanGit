(function(_,iScroll){
    iScroll.prototype.zoom = function(x, y, scale, time){
        var self = this,
            relScale = scale / self.scale;

        self.zoomed = true;
        time = time === undefined ? 200 : time;
        x = x - self.wrapperOffsetLeft - self.x;
        y = y - self.wrapperOffsetTop - self.y;
        self.x = x - x * relScale + self.x;
        self.y = y - y * relScale + self.y;

        self.scale = scale;
        self.refresh();

        self.x = self.x >= 0 ? 0 : self.x < self.maxScrollX ? self.maxScrollX : self.x;
        self.y = self.y > self.minScrollY ? self.minScrollY : self.y < self.maxScrollY ? self.maxScrollY : self.y;

        self.scroller.style["transitionDuration"] = time + 'ms';
        self.scroller.style["transform"] = 'translate(' + self.x + 'px,' + self.y + 'px) scale(' + scale + ')';
        self.zoomed = false;
    };
    iScroll.prototype.onZoomStart = function(e){
        var self = this;
        var c1 = Math.abs(e.touches[0].pageX-e.touches[1].pageX);
        var c2 = Math.abs(e.touches[0].pageY-e.touches[1].pageY);
        self.touchesDistStart = Math.sqrt(c1 * c1 + c2 * c2);

        self.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX - self.wrapperOffsetLeft * 2) / 2 - self.x;
        self.originY = Math.abs(e.touches[0].pageY + e.touches[1].pageY - self.wrapperOffsetTop * 2) / 2 - self.y;

        if (self.options.onZoomStart) self.options.onZoomStart.call(self, e);
    };

    iScroll.prototype.onZoom = function(e){
        var self = this;
        var c1 = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
        var c2 = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
        self.touchesDist = Math.sqrt(c1*c1+c2*c2);

        self.zoomed = true;

        var scale = 1 / self.touchesDistStart * self.touchesDist * self.scale;

        if (scale < self.options.zoomMin){
            if(self.options.zoomMinBounce){
                scale = 0.5 * self.options.zoomMin * Math.pow(2.0, scale / self.options.zoomMin);
            }else {
                scale =  self.options.zoomMin;
            }
        } else if (scale > self.options.zoomMax) scale = 2.0 * self.options.zoomMax * Math.pow(0.5, self.options.zoomMax / scale);

        self.lastScale = scale / self.scale;

        var newX = self.originX - self.originX * self.lastScale + self.x;
        var newY = self.originY - self.originY * self.lastScale + self.y;

        this.scroller.style["transform"] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')';

        if (self.options.onZoom) self.options.onZoom.call(self, e);
    };

    iScroll.prototype.onZoomEnd = function(e){
        var self = this;
        var scale = self.scale * self.lastScale;
        scale = Math.max(self.options.zoomMin, scale);
        scale = Math.min(self.options.zoomMax, scale);
        self.lastScale = scale / self.scale;
        self.scale = scale;

        self.x = self.originX - self.originX * self.lastScale + self.x;
        self.y = self.originY - self.originY * self.lastScale + self.y;

        self.scroller.style["transitionDuration"] = '200ms';
        self.scroller.style["transform"] = 'translate(' + self.x + 'px,' + self.y + 'px) scale(' + self.scale + ')';

        self.zoomed = false;
        self.refresh();

        if (self.options.onZoomEnd) self.options.onZoomEnd.call(self, self.scale);
    };
    iScroll.prototype.doubleTapToZoom = function(e){
        var self = this;
        if (self.options.onZoomStart) self.options.onZoomStart.call(self, e);
        self.zoom(self.pointX, self.pointY, self.scale == 1 ? self.options.doubleTapZoom : 1);
        if (self.options.onZoomEnd) {
            setTimeout(function() {
                self.options.onZoomEnd.call(self, e);
            }, 200); // 200 is default zoom duration
        }
    }

    _.zoom = function(container,options){
        var opts = _.extend({
            doubleTapZoom:true,//是否双击放大
            initZoom:1,//初始缩放比例
            zoomMin:1,//最小缩放比
            zoomMax:4,//最大缩放比
            onZoomStart:null,//缩放前的回调
            onZoom:null,//缩放回调
            onZoomEnd:null,//缩放完成的回调
            zoomMinBounce:true//缩放到最小时是否回弹效果------为了优化性能
        },options);
        opts = _.extend({//这里的配置参数不是组件定义的，不需要开发者关注
            zoom:true,
            hScroll: true,
            vScroll:true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: false,
            useTransform: true,
            useTransition: false,
            handleClick: true
        },opts);
        var zoomScroll = new iScroll(container,opts);
        if(opts.initZoom != 1){
            zoomScroll.zoom(0,0,opts.initZoom,0);
            zoomScroll.scale = opts.initZoom;
        }
        setTimeout(function(){
            zoomScroll.scroller.style.width = zoomScroll.scroller.scrollWidth+"px";
            zoomScroll.refresh();
        },300);
        return zoomScroll;
    }
})(cmp,cmp.iScroll);