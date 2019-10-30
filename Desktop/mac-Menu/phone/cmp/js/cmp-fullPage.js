(function(_){
    var fullPage = function(container,options){
        var self = this;
        self.options = _.extend({
            afterLoad:null,//未来页面滚动到位后的回调
            onLeave:null,//当前页准备要被滚动到其他页时的回调，返回将要滚动到的页面的index
            scrollingSpeed:700//滚动速度
        },options);
        self.container = typeof container == "object"?container:document.querySelector(container);
        self.sections = self.container.querySelectorAll("section");
        self.moveActionThreshold = 30;//滑动启动的最小阀值
        self.index = 0;
        self.endpoint = false;
        self.direction = "down";
        self.topPosition = {};
        self._init();
        self._bindEvent();

    };
    fullPage.prototype._init = function(){
        var self = this;
        self._setStyle(document.body,"overflow","hidden");
        self._setStyle(document.body,"height","100%");
        self._setStyle(self.container,"height","100%");
        self._setStyle(self.container,"position","relative");
        var i = 0,len = self.sections.length;
        for(;i<len;i++){
            self._setStyle(self.sections[i],"width","100%");
            self._setStyle(self.sections[i],"height",window.innerHeight+"px");
            self._setStyle(self.sections[i],"position","relative");
            self._setStyle(self.sections[i],"display","table");
            self._setStyle(self.sections[i],"table-layout","fixed");
            if(i == 0) {
                self.sections[i].classList.add("active");
            }
            self.sections[i].setAttribute("page","page" + (i+1));
        }
        var pageName = self.sections[self.index].getAttribute("page");
        self.options.afterLoad && typeof self.options.afterLoad == "function" && self.options.afterLoad.call(this,pageName,(self.index+1));
    };
    fullPage.prototype._preventDefault = function(e){
        var target = e.target;
        if(target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){
            e.preventDefault();
        }
    }
    fullPage.prototype._bindEvent = function(){
        var self = this;
        var touchStartY = 0,touchStartTime;
        document.addEventListener("touchstart",function(e){
           self._preventDefault(e);

        },false);
        document.addEventListener("touchmove",function(e){
            self._preventDefault(e);
        },false);
        document.addEventListener("touchend",function(e){
            self._preventDefault(e);
        },false);
        self.container.addEventListener("touchstart",function(e){
            self._preventDefault(e);
            touchStartTime = e.timeStamp;
            touchStartY = self._getPage(e, "pageY");
        },false);
        self.container.addEventListener("touchend",function(e){
            var touchEndTime = e.timeStamp;
            if((touchEndTime - touchStartTime) < 300) {
                self._preventDefault(e);
            }
            var touchEndY = self._getPage(e, "pageY");
            var moveDistY = touchEndY - touchStartY;
            self._moveAction(moveDistY);
        });
    };
    fullPage.prototype._moveAction = function(moveDistY){
        var self = this;
        if(Math.abs(moveDistY) > self.moveActionThreshold){
            self.currentIndex = (self.index + 1);
            self.sections = self.container.querySelectorAll("section");
            var curruntPageNo = self.sections[self.index].getAttribute("page").replace("page","");
            curruntPageNo = parseInt(curruntPageNo);

            if(self.sections[self.index].classList.contains("active")) {
                self.sections[self.index].classList.remove("active");
            }
            if(moveDistY < 0){//朝上滑
                self.direction = "down";
                if(self.index == self.sections.length -1){
                    self.endpoint = true;
                    self.container.appendChild(self.sections[0]);
                    var beforeAniPositionY = -(_.getTop(self.sections[self.sections.length-1]));
                    self._move(0,beforeAniPositionY,"0","");
                }
                self.index ++;
                if(self.index > self.sections.length -1){
                    self.index = 0;
                }
            }else { //朝下滑
                self.direction = "up";
                if(self.index == 0){//当前是最开始一屏
                    self.endpoint = true;
                    self.container.insertBefore(self.sections[self.sections.length -1],self.sections[0]);
                    self._move(0,-(window.innerHeight),"0","");
                }
                self.index --;
                if(self.index < 0) {
                    self.index = self.sections.length -1;
                }
            }
            var nextPageNo = self.sections[self.index].getAttribute("page").replace("page","");
            nextPageNo = parseInt(nextPageNo);
            self.options.onLeave && typeof self.options.onLeave == "function" && self.options.onLeave.call(this,curruntPageNo,nextPageNo,self.direction);
            var positionY = -(_.getTop(self.sections[self.index]));
            self._move(0,positionY,self.options.scrollingSpeed,"ease");
            setTimeout(function(){
                if(self.endpoint){//如果首位结合的情况
                    if(self.direction == "up"){
                        self.container.appendChild(self.sections[self.sections.length -1]);
                    }else {
                        self.container.insertBefore(self.sections[0],self.container.firstChild);
                    }
                    var restPositionY = -(_.getTop(self.sections[self.index]));
                    self._move(0,restPositionY,"0","");
                    self.endpoint = false;
                }
                var pageName = self.sections[self.index].getAttribute("page");
                self.sections[self.index].classList.add("active");
                self.options.afterLoad && typeof self.options.afterLoad == "function" && self.options.afterLoad.call(this,pageName,(self.index+1));
            },self.options.scrollingSpeed);

        }
    };
    //滚动到指定的section,提供给开发者调用的
    fullPage.prototype.moveTo = function(index){
        var self = this;
        index = index -1;
        self.index = index;
        var activeSection = self.container.querySelector("section.active");
        if(activeSection) activeSection.classList.remove("active");
        var positionY = -(_.getTop(self.sections[self.index]));
        self._move(0,positionY,0,"");
        var pageName = self.sections[self.index].getAttribute("page");
        self.sections[self.index].classList.add("active");
        self.options.afterLoad && typeof self.options.afterLoad == "function" && self.options.afterLoad.call(this,pageName,(self.index+1));
    };
    fullPage.prototype._setStyle = function(item,attribute,value){
        item.style[attribute] = value;
    };
    fullPage.prototype._getTranslate =function(x,y){
        var distX = x, distY = y;
        return ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()) ? "translate3d("+ distX +"px, "+ distY +"px, 0)" : "translate("+ distX +"px, "+ distY +"px)";
    };
    fullPage.prototype._getPage = function(event, page){
        return ("ontouchstart" in window) ? event.changedTouches[0][page] : event[page];
    };
    fullPage.prototype._move = function(x, y,time,type){
        var self = this;
        self.container.style.webkitTransitionProperty = "-webkit-transform";
        self.container.style.webkitTransitionDuration = time + "ms";
        self.container.style.webkitTransitionTimingFunction = type;
        self.container.style.webkitTransform = self._getTranslate(x, y);
    };

    _.fullPage = function(container,options){
        return new fullPage(container,options);
    };
})(cmp);
