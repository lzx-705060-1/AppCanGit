(function(_){
    var pageMap = {};
    //=============================================================盒滚动 start=======================================//
    /**
     * 上下左右滚动
     */
    _.scrollBox = function (container, enableV) {
        if (arguments.length == 1) {
            enableV = true;
        }
        if (!pageMap[container]) {
            pageMap[container] = new _.iScroll(container, {
                hScroll: true,
                vScroll: enableV,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                handleClick: true
            });
            //解决需要调用者传入宽度问题
            setTimeout(function(){
                pageMap[container].scroller.style.width = pageMap[container].scroller.scrollWidth+"px";
                pageMap[container].refresh();
                var imgs = pageMap[container].scroller.querySelectorAll("img");
                if(imgs && imgs.length > 0){
                    var i = 0,len = imgs.length;
                    for(;i<len;i++){
                        (function(i){
                            imgs[i].onload = function(){
                                pageMap[container].refresh();
                            }
                        })(i);
                    }
                }
            },300);
        }
        return pageMap[container];
    };
//=============================================================盒滚动 end=======================================//
})(cmp);