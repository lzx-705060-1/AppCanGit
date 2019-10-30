/**
 * Created by xp on 2017/2/6 0006.
 * iScroll和listView组合平滑滚动组件
 */
(function(_){
    _.listViewSmooth = function(container,opts){
        var self = this;
        var scrollItemStartY = 0;
        var scrollItem;

        if(opts.config.itemZoom){
            scrollItem = _.zoom(".cmp-scroll-item",{
                bounce:false,
                doubleTapZoom:opts.config.doubleTapZoom,
                initZoom:opts.config.initZoom,
                zoomMin:opts.config.zoomMin,
                zoomMax:opts.config.zoomMax,
                onZoomStart:opts.config.onZoomStart,
                onZoom:opts.config.onZoom,
                onZoomEnd:opts.config.onZoomEnd,
                onBeforeScrollStart:function(e){
                    scrollItemStartY = e.touches[0].pageY;
                },
                onScrollMove:function(e){
                    if(this.y <= this.maxScrollY){//大于最大滚动距离则，listview进行enable
                        if(!listView.enabled){
                            var scrollItemMoveY = e.touches[0].pageY;
                            listView.scrollTo(0,(scrollItemMoveY - scrollItemStartY),300);
                        }
                    }else {
                        if(!listView.enabled && listView.y < listView.minScrollY){
                            var scrollItemMoveY = e.touches[0].pageY;
                            listView.scrollTo(0,(scrollItemMoveY - scrollItemStartY),300);
                        }
                    }
                },
                onScrollEnd:function(){
                    if(this.y <= this.maxScrollY){
                        listView.enable();
                        this.disable();
                    }
                }
            });
        }else {
           //滚动块
            scrollItem = new _.iScroll(".cmp-scroll-item",{
                bounce:false,
                onBeforeScrollStart:function(e){
                    scrollItemStartY = e.touches[0].pageY;
                },
                onScrollMove:function(e){
                    if(this.y <= this.maxScrollY){//大于最大滚动距离则，listview进行enable
                        if(!listView.enabled){
                            var scrollItemMoveY = e.touches[0].pageY;
                            listView.scrollTo(0,(scrollItemMoveY - scrollItemStartY),300);
                        }
                    }
                },
                onScrollEnd:function(){
                    if(this.y <= this.maxScrollY){
                        listView.enable();
                        this.disable();
                    }
                }
            });
        }

        opts.config.onePageMaxNum = 9999999;//不允许上一页下一页按钮的出现
        opts.config.customEnable = true;
        opts.down = null;//不支持下拉刷新(再把这个玩意加上，那就没法玩了)
        opts.listViewBeforeScrollStart = function(e){
            var touchTarget = e.target;
            if(touchTarget.classList.contains(".cmp-scroll-item") || _.parents(touchTarget,".cmp-scroll-item").length > 0){//如果touche的元素是scroll

            }else {
                scrollItem.disable();
                listView.enable();
            }
        };
        opts.listViewScrollMove = function(y){
            if(y >= 0) {//listview滚动到了0，则进行scroll  enable
                scrollItem.enable();
                this.disable();
            }
        };
        opts.listViewScrollEnd = function(y){
            if(y >= 0) {
                scrollItem.enable();
                this.disable();
            }
        };
       var listView =  _.listView(container,opts);
        listView.disable();
    }
})(cmp);
