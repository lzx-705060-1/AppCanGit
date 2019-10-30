(function(_,$){
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-sliders');
    if(typeof cmpSlidersI18nLoaded  == "undefined") _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-sliders',function(){
        cmpSlidersI18nLoaded = true;
        _.event.trigger("cmp-sliders-init",document);
    },cmpBuildversion);
    //========================================================================mui slider start========================//
    var CLASS_SLIDER = $.className('slider');
    var CLASS_SLIDER_GROUP = $.className('slider-group');
    var CLASS_SLIDER_LOOP = $.className('slider-loop');
    var CLASS_SLIDER_INDICATOR = $.className('slider-indicator');
    var CLASS_ACTION_PREVIOUS = $.className('action-previous');
    var CLASS_ACTION_NEXT = $.className('action-next');
    var CLASS_SLIDER_ITEM = $.className('slider-item');

    var CLASS_ACTIVE = 'cmp-active';

    var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
    var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
    var SELECTOR_SLIDER_PROGRESS_BAR = $.classSelector('.slider-progress-bar');


    var Slider = function (element, options) {
        this.element = element;
        this.options = $.extend({
            slideshowDelay: 0, //设置为0，则不定时轮播
            factor: 1,
            callback:null
        }, options);

        this.init();

    };
    Slider.prototype.init = function () {
        this.initEvent();
        this.initTimer();
    };
    Slider.prototype.refresh = function (options) {
        var self = this;
        self.sliderLength = self.element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
        self.gotoItem(0);
        var newOptions = $.extend({
            slideshowDelay: 0, //设置为0，则不定时轮播
            factor: 1
        }, options);
        if (this.options.slideshowDelay !== newOptions.slideshowDelay) {
            this.options.slideshowDelay = newOptions.slideshowDelay;
            if (this.options.slideshowDelay) {
                this.nextItem();
            }
        }
    };

    Slider.prototype.initEvent = function () {
        var self = this;
        var element = self.element;
        var slider = element.parentNode;
        self.translateX = 0;
        self.sliderWidth = element.offsetWidth;
        self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
        self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
        self.progressBarWidth = 0;
        self.progressBar = slider.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
        if (self.progressBar) {
            self.progressBarWidth = self.progressBar.offsetWidth;
        }

        var duplicates = document.querySelector('.cmp-slider').querySelector('.cmp-slider-group').querySelectorAll('.cmp-slider-item-duplicate');
        if(duplicates){
            if(duplicates[0] && !duplicates[0].classList.contains('cmp-hidden')){
                duplicates[0].classList.add('cmp-hidden');
            }
            if(duplicates[1] && !duplicates[1].classList.contains('cmp-hidden')){
                duplicates[1].classList.add('cmp-hidden');
            }
        }
        var number = slider.querySelector($.classSelector('.slider-indicator .number span'));
        if (number) {
            number.innerHTML = "1";
        }
        //slider
        var isDragable = false;
        self.isSwipeable = false;
        var finger = false;//添加限制条件，如果是两个手指的情况，就不进行轮播动画
        slider.addEventListener('touchstart',function(event){
            var touchTarget = event.touches.length; //获得触控点数
            if(touchTarget > 1){
                finger = false;
            }else {
                finger = true;
            }
        },false);
        slider.addEventListener('dragstart', function (event) {  //todo 修改如果是两个手指就不进行轮播
            if(finger){
                var detail = event.detail;
                var direction = detail.direction;
                if (self.options.dragstart) {
                    if (self.options.dragstart(direction)) return;
                }
                if (direction === 'left' || direction === 'right') { //reset
                    isDragable = true;
                    self.translateX = self.lastTranslateX = 0;
                    self.scrollX = self.getScroll();
                    self.sliderWidth = element.offsetWidth;
                    self.isLoop = element.classList.contains(CLASS_SLIDER_LOOP);
                    self.sliderLength = element.querySelectorAll(SELECTOR_SLIDER_ITEM).length;
                    if (self.progressBar) {
                        self.progressBarWidth = self.progressBar.offsetWidth;
                    }
                    self.maxTranslateX = ((self.sliderLength - 1) * self.sliderWidth);
                    event.detail.gesture.preventDefault();
                    var isStopPropagation = true;
                    if (!self.isLoop) {
                        if (direction === 'right' && self.scrollX === 0) {
                            isStopPropagation = false;
                        } else if (direction === 'left' && self.scrollX === -self.maxTranslateX) {
                            isStopPropagation = false;
                        }
                    }
                    isStopPropagation && event.stopPropagation();
                }
            }

        });
        slider.addEventListener('drag', function (event) {
            if (isDragable) {
                self.dragItem(event);
                event.stopPropagation();
            }

        });
        slider.addEventListener('dragend', function (event) {
            event.stopPropagation();
            if (isDragable) {
                if(finger){
                    self.gotoItem(self.getSlideNumber(), event.detail.direction);
                    isDragable = self.isSwipeable = false;
                }
            }
        });
        slider.addEventListener('swipeleft', function (event) {
            if (self.isSwipeable) {
                //stop dragend
                $.gestures.stoped = true;
                self.nextItem();
                isDragable = self.isSwipeable = false;
            }
            event.stopPropagation();
        });
        slider.addEventListener('swiperight', function (event) {
            if (self.isSwipeable) {
                //stop dragend
                $.gestures.stoped = true;
                self.prevItem();
                isDragable = self.isSwipeable = false;
            }
            event.stopPropagation();
        });
        slider.addEventListener('slide', function (e) {
            var detail = e.detail;
            detail.slideNumber = detail.slideNumber || 0;

            var number = slider.querySelector($.classSelector('.slider-indicator .number span'));
            if (number) {
                number.innerText = (detail.slideNumber + 1);
            }

            var indicators = slider.querySelectorAll($.classSelector('.slider-indicator .indicator'));
            for (var i = 0, len = indicators.length; i < len; i++) {
                indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove']($.className('active'));
            }

            var controlItems = slider.querySelectorAll($.classSelector('.control-item'));
            for (var i = 0, len = controlItems.length; i < len; i++) {
                controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove']($.className('active'));
            }
            var slidersCallback = self.options.slidersCallback;
            var callback = self.options.callback;
            if(slidersCallback && typeof slidersCallback == "function"){
                slidersCallback(detail.slideNumber);
            }else if(callback && typeof callback == "function"){
                callback(detail.slideNumber);
            }
            e.stopPropagation();
        });
        slider.addEventListener("shown.tab", function (e) { //tab
            self.gotoItem(-(e.detail.tabNumber || 0));
        });
        var indicator = element.parentNode.querySelector(SELECTOR_SLIDER_INDICATOR);
        if (indicator) {
            indicator.addEventListener('tap', function (event) {
                var target = event.target;
                if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
                    self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
                    event.stopPropagation();
                }
            });
            var indicatorItems = indicator.querySelectorAll($.classSelector('.slider-indicator .indicator'));
            if(indicatorItems && indicatorItems.length > 0){
                indicatorItems[0].classList.add($.className('active'));
            }
        }
    };
    Slider.prototype.dragItem = function (event) {
        var self = this;
        var detail = event.detail;
        if (detail.deltaX !== detail.lastDeltaX) {
            var translate = (detail.deltaX * self.options.factor + self.scrollX);
            self.element.style['-webkit-transition-duration'] = '0';
            var min = 0;
            var max = -self.maxTranslateX;
            if (self.isLoop) {
                min = self.sliderWidth;
                max = max + min;
            }
            if (translate > min || translate < max) {
                self.isSwipeable = false;
                return;
            }
            if (!self.requestAnimationFrame) {
                self.updateTranslate();
            }
            self.isSwipeable = true;
            self.translateX = translate;
        }
        if (self.timer) {
            clearTimeout(self.timer);
        }
        self.timer = setTimeout(function () {
            self.initTimer();
        }, 100);

    };
    Slider.prototype.updateTranslate = function () {
        var self = this;
        if (self.lastTranslateX !== self.translateX) {
            self.setTranslate(self.translateX);
            self.lastTranslateX = self.translateX;
        }
        self.requestAnimationFrame = requestAnimationFrame(function () {
            self.updateTranslate();
        });
    };
    Slider.prototype.setTranslate = function (x) {
        this.element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
        this.updateProcess(x);
    };
    Slider.prototype.updateProcess = function (translate) {
        var progressBarWidth = this.progressBarWidth;
        if (progressBarWidth) {
            translate = Math.abs(translate);
            this.setProcess(translate * (progressBarWidth / this.sliderWidth));
        }
    };
    Slider.prototype.setProcess = function (translate) {
        var progressBar = this.progressBar;
        if (progressBar) {
            progressBar.style.webkitTransform = 'translate3d(' + translate + 'px,0,0)';
        }
    };
    /**
     * 下一个轮播
     * @returns {Number}
     */
    Slider.prototype.nextItem = function () {
        this.gotoItem(this.getCurrentSlideNumber('next') - 1, "left");
    };
    /**
     * 上一个轮播
     * @returns {Number}
     */
    Slider.prototype.prevItem = function () {
        this.gotoItem(this.getCurrentSlideNumber('prev') + 1, "right");
    };
    /**
     * 滑动到指定轮播
     * @param {type} slideNumber
     * @returns {undefined}
     */
    Slider.prototype.gotoItem = function (slideNumber, direction) {
        if (!(slideNumber === 1 && this.getSlideNumber() === slideNumber)) {
            slideNumber = slideNumber > 0 ? -slideNumber : slideNumber;
        }

        var self = this;
        var slider = self.element;
        var slideLength = self.sliderLength;
        if (self.isLoop) { //循环轮播需减去2个过渡元素
            slideLength = slideLength - 2;
        } else {
            slideLength = slideLength - 1;
            slideNumber = Math.min(0, slideNumber);
            slideNumber = Math.max(slideNumber, -slideLength);
        }
        if (self.requestAnimationFrame) {
            cancelAnimationFrame(self.requestAnimationFrame);
            self.requestAnimationFrame = null;
        }
        var offsetX = Math.max(slideNumber, -slideLength) * slider.offsetWidth;
        if(slideNumber == 0){
            slider.style['-webkit-transition-duration'] = '0s';
        }else{
            slider.style['-webkit-transition-duration'] = '.2s';
        }
        self.setTranslate(offsetX);
        var fixedLoop = function () {
            slider.style['-webkit-transition-duration'] = '0';
            slider.style.webkitTransform = 'translate3d(' + (slideNumber * slider.offsetWidth) + 'px,0,0)';
            slider.removeEventListener('webkitTransitionEnd', fixedLoop);
        };
        slider.removeEventListener('webkitTransitionEnd', fixedLoop);
        if (self.isLoop) { //循环轮播自动重新定位
            if (slideNumber === 1 || slideNumber === -slideLength) {
                slideNumber = slideNumber === 1 ? (-slideLength + 1) : 0;
                slider.addEventListener('webkitTransitionEnd', fixedLoop);
            }
        }
        $.trigger(slider.parentNode, 'slide', {
            toatl: self.sliderLength,
            slideNumber: Math.abs(slideNumber),
            direction: direction
        });

        this.initTimer();
    };

    /**
     * 计算轮播应该处于的位置(四舍五入)
     * @returns {Number}
     */
    Slider.prototype.getSlideNumber = function () {
        return (Math.round(this.getScroll() / this.sliderWidth));
    };
    /**
     * 当前所处位置
     * @param {type} type
     * @returns {unresolved}
     */
    Slider.prototype.getCurrentSlideNumber = function (type) {
        return (Math[type === 'next' ? 'ceil' : 'floor'](this.getScroll() / this.sliderWidth));
    };
    /**
     * 获取当前滚动位置
     * @returns {Number}
     */
    Slider.prototype.getScroll = function () {
        var slider = this.element;
        var scroll = 0;
        if ('webkitTransform' in slider.style) {
            var result = $.parseTranslate(slider.style.webkitTransform);
            scroll = result ? result.x : 0;
        }
        return scroll;
    };
    /**
     * 自动轮播
     * @returns {undefined}
     */
    Slider.prototype.initTimer = function () {
        var self = this;
        var slideshowDelay = self.options.slideshowDelay;
        if (slideshowDelay) {
            var slider = self.element;
            var slidershowTimer = slider.getAttribute('data-slidershowTimer');
            slidershowTimer && window.clearTimeout(slidershowTimer);
            slidershowTimer = window.setTimeout(function () {
                if (!slider) {
                    return;
                }
                //仅slider显示状态进行自动轮播
                if (!!(slider.offsetWidth || slider.offsetHeight)) {
                    self.nextItem();
                    //下一个
                }
                self.initTimer();
            }, slideshowDelay);
            slider.setAttribute('data-slidershowTimer', slidershowTimer);
        }

    };

    $.fn.slider = function (options) {
        //新增定时轮播 重要：remove该轮播时，请获取data-slidershowTimer然后手动clearTimeout
        var slider = null;
        this.each(function () {
            var sliderGroup = this;
            if (this.classList.contains(CLASS_SLIDER)) {
                sliderGroup = this.querySelector('.' + CLASS_SLIDER_GROUP);
            }
            var id = sliderGroup.getAttribute('data-slider');
            if (!id) {
                id = ++$.uuid;
                $.data[id] = slider = new Slider(sliderGroup, options);
                sliderGroup.setAttribute('data-slider', id);
            } else {
                slider = $.data[id];
                if (slider && options) {
                    slider.refresh(options);
                }
            }
        });
        if(slider){
            slider.options.callback=function(index){
                var Len = slider.element.querySelectorAll(SELECTOR_SLIDER_ITEM).length-2;
                var duplicates = document.querySelector('.cmp-slider').querySelector('.cmp-slider-group').querySelectorAll('.cmp-slider-item-duplicate');
                if(index == Len){
                    slider.gotoItem(0);
                    var height = slider.element.offsetHeight;
                    slider.element.removeAttribute('style');
                    slider.element.style.height = height+"px";
                }
                if(index == Len-1){
                    if(duplicates[1] && duplicates[1].classList.contains('cmp-hidden')){
                        duplicates[1].classList.remove('cmp-hidden');
                    }
                }else if(index == 0){
                    //duplicates[0].classList.remove('cmp-hidden');
                }else{
                    if((duplicates[0] && !duplicates[0].classList.contains('cmp-hidden')) && (duplicates[1]&& !duplicates[1].classList.contains('cmp-hidden'))){
                        duplicates[0].classList.add('cmp-hidden');
                        duplicates[1].classList.add('cmp-hidden');
                    }
                }
                //document.querySelector('#slider').addEventListener('slide',function(){
                //    console.log(index)
                //    //if(index == 0 ){
                //    //    SliderReady.gotoItem(0);
                //    //}
                //},false);
            }
        }

        return slider;
    };
    //========================================================================mui slider end========================//

    //=================================================================轮播插件H5版 start=============================//
    var lang = _.language;
    var imgSliders = function(imgs){
        var self = this;
        self.imgs = [];
        if(self._isArray(imgs) || (toString.apply(imgs) == "[object HTMLCollection]")){
            self.imgs = imgs;
        }else {
            self.imgs.push(imgs);
        }
        self._transeImgs();
        self.slidersPlugin = null;//mui 轮播图插件对象
        self.loadedImg = [];    //缓存已经被加载了的图片
        self.initRender = true;  //是否是初次渲染标注
        self.index = 0; //图片的角标
        self.seeOrginalImg = false;//是否开始原图的查看
        self.uuid = _.buildUUID();
        self.zoomObj = null;
        if(typeof cmpSlidersI18nLoaded == "undefined"){
            document.addEventListener("cmp-sliders-init",function(){
                self.basicDiv = self._init();
                _.event.trigger("cmp-sliders-basicDiv-init",document);
            });
        }else {
            self.basicDiv = self._init();
        }
    };
    imgSliders.prototype._transeImgs = function(){
        var self = this;
        var i = 0,len = self.imgs.length;
        var cache = [];
        for(;i<len;i++){
            if(typeof self.imgs[i] == "object"){
                if(!self.imgs[i].hasOwnProperty("big") && !self.imgs[i].hasOwnProperty("small")){
                    cache.push(self.imgs[i].src);
                }
            }
        }
        if(cache.length > 0) {
            self.imgs = [];
            self.imgs = cache;
        }
    };
    /**
     * 初始化组件，根据需要轮播的图片数组进行组件初始化创建
     * @param imgs
     * @returns {*}
     * @private
     */
    imgSliders.prototype._init = function(){
        var self = this;
        var basicDiv = document.createElement("div"),scrollTop = document.body.scrollTop;
        basicDiv.classList.add("cmp-sliders-basicDiv");
        basicDiv.style.top = scrollTop + "px";
        var tempHtml = _.tpl(temp(),self.uuid);
        basicDiv.innerHTML = tempHtml;
        document.body.appendChild(basicDiv);
        basicDiv.addEventListener("touchmove",function(e){
            e.preventDefault();
        });
        return basicDiv;
    };
    /**
     * 公用方法，提供给开发者打开轮播图片的显示
     * @param currentImg
     */
    imgSliders.prototype._open = function(currentImg){
        var self = this;
        self.resetTop(self.basicDiv);
        self._assemble(currentImg,self.imgs);
        if(self.initRender) {
            self._bindClose(self.basicDiv);

            self.initRender = false;
        }
        if(self.basicDiv.classList.contains("cmp-sliders-div-hidden")) self.basicDiv.classList.remove("cmp-sliders-div-hidden");
        self.basicDiv.classList.add("cmp-sliders-div-show");
        _.backbutton.push(_.sliders.close);
        self._bindZoom();
        self._bindSmallZoom();
    };
    imgSliders.prototype._sliderDetect = function(index){
        var self = this;
        if(!self.basicDiv){
            document.addEventListener("cmp-sliders-basicDiv-init",function(){
                self._open(self.imgs[index]);
            })
        }else {
            self._open(self.imgs[index]);
        }
        
    };

    imgSliders.prototype.resetTop = function(basicDiv){
        var scrollTop = document.body.scrollTop;
        if(basicDiv){
            basicDiv.style.top = scrollTop + "px";
        }
    };
    /**
     * 组装html
     * @param imgs
     * @private
     */
    imgSliders.prototype._assemble = function(currentImg,imgs) {
        var self = this;
        var i = 0,len = imgs.length,placeholderImg = cmpIMGPath+ '/loading.gif';
        var container = self.basicDiv.querySelector("#cmp_sliders_container");
        self.container = container;
        var total = self.basicDiv.querySelector("#cmp_sliders_total");
        var saveBtn = self.basicDiv.querySelector("#saveBtn");
        self.saveBtn = saveBtn;
        var items = "";
        for(;i<len; i++) {
            items += '<div class="cmp-slider-item" index="'+i+'"><img  class="cmp-sliders-img" ';
            var src = imgs[i],big = imgs[i];
            if(typeof imgs[i] == "object"){
                if(imgs[i].hasOwnProperty("big") && imgs[i].hasOwnProperty("small")){
                    src = imgs[i].small;
                    big = imgs[i].big;
                }
            }
            if(typeof currentImg == "object" && currentImg.hasOwnProperty("big") && currentImg.hasOwnProperty("small")){
                currentImg = currentImg.small;
            }
            if(currentImg == src){
                if(!self._isContain(src,self.loadedImg)){
                    self.loadedImg.push(src);
                }
                self.index = i+1;
                items += 'src="'+src+'" onerror="this.src=\''+cmpIMGPath+'/logo.fw.png\'"';
            }else {
                if(self._isContain(src,self.loadedImg)){
                    items += 'src="'+src+'" ';
                }else {
                    items += 'src="'+placeholderImg+'" ';
                }
            }
            items +='data-src="'+src+'" big-src="'+big+'"></div>';
        }
        container.innerHTML = items;
        var itemList = container.childNodes;
        total.innerHTML = len;
        var num = self.basicDiv.querySelector("#cmp_sliders_num");
        num.innerHTML = self.index;
        self.basicDiv.style.display = "block";
        //=======================================保存图片=================//
        if(currentImg && currentImg.startsWith("file")){
            saveBtn.style.display = "none"
        }else {
            saveBtn.style.display = "block";
        }
        var saveBtnTapTimeGap = 0;
        saveBtn.addEventListener("tap",function(e){
            e.stopPropagation();
            if(saveBtnTapTimeGap != 0) return;
            saveBtnTapTimeGap = 3000;
            setTimeout(function(){
                saveBtnTapTimeGap = 0;
            },3000);
            var index = self.index -1;
            index = index <0?0:index;
            var type = "small";
            if(self.seeOrginalImg){
                type = "big";
            }
            var saveImg = self._getTargetImg(index,type);
            var saveImgName = self._getImgName(saveImg);
            if(_.system.filePermission()) {
                _.notification.toastExtend(_.i18n("cmp.sliders.start_to_download"),"top",1000,{bg:"rgba(244, 244, 244, 0.7)",color:"#fff"});
                _.att.download({
                    url:saveImg,
                    title:saveImgName,
                    success:function(result){
                        _.notification.toastExtend(_.i18n("cmp.sliders.download_target"),"bottom",1000,{bg:"rgba(244, 244, 244, 0.7)",color:"#fff"});
                    },
                    error:function(error){
                        if(!_.errorHandler(error)){
                            _.notification.toastExtend(_.i18n("cmp.sliders.fail_to_download"),"bottom",1000,{bg:"rgba(244, 244, 244, 0.7)",color:"#fff"});
                        }
                    }
                });
            }else {
                _.notification.toastExtend(_.i18n("cmp.sliders.wechart_no_file_permission"),"top", 1000,{bg:"rgba(244, 244, 244, 0.7)",color:"#fff"});
            }
        },false);


        //========================轮播图片===========================//
        if(self.slidersPlugin == null){
            self.slidersPlugin = _('#cmp_sliders_wrapper_' + self.uuid).slider({
                slidersCallback:function(slideNumber){
                    var preIndex = (self.index -1);
                    var dataSrc;
                    if(slideNumber > preIndex) { //向左
                        var sliderSrc = self._getTargetImg(self.index,"small");
                        if(!self._isContain(sliderSrc,self.loadedImg)){
                            var item = itemList[self.index];
                            var img = item.getElementsByTagName("img")[0];
                            var dataSrc = img.getAttribute("data-src");
                            img.setAttribute("src",dataSrc);
                            img.onload = function(){
                                img.classList.add("cmp-sliders-img-show");
                            };
                            img.onerror = function(){
                                img.src =  cmpIMGPath + '/logo.fw.png';
                            };
                            self.loadedImg.push(sliderSrc);
                        }
                        self.index ++;
                        self.index = self.index >= len?len:self.index;
                        num.innerHTML = self.index;

                    }else if(slideNumber < preIndex){ //向右(相等不改变什么)
                        self.index --;
                        var number = self.index;
                        number  = number <= 0?1:number;
                        num.innerHTML = number;
                        self.index = self.index < 1?1:self.index;
                        var sliderSrc = self._getTargetImg((self.index-1),"small");
                        if(!self._isContain(sliderSrc,self.loadedImg)){
                            var item = itemList[self.index-1];
                            var img = item.getElementsByTagName("img")[0];
                            img.style.opacity = 0.5;
                            dataSrc = img.getAttribute("data-src");
                            img.setAttribute("src",dataSrc);
                            img.onload = function(){
                                img.classList.add("cmp-sliders-img-show");
                            };
                            img.onerror = function(){
                                img.src =  cmpIMGPath + '/logo.fw.png';
                            };
                            self.loadedImg.push(sliderSrc);
                        }
                    }
                    if(dataSrc){
                        if(dataSrc.startsWith("file")){
                            saveBtn.style.display = "none";
                        }else {
                            saveBtn.style.display = "block";
                        }
                    }

                }
            });
        }
        self.slidersPlugin.gotoItem(-(self.index-1),"left");
    };

    /**
     * 绑定关闭事件，点击组件任何区域进行关闭
     * @param basicDiv
     * @private
     */
    imgSliders.prototype._bindClose = function(){
        var self = this;
        _.event.click(self.container,function(){
            self._close();
        });
    };
    imgSliders.prototype._close = function(backbutton){
        var self = this;
        var zoomContainer = self.basicDiv.querySelector(".cmp-slider-imgzoom-pack");
        if(self.basicDiv.classList.contains("cmp-sliders-div-show")) self.basicDiv.classList.remove("cmp-sliders-div-show");
        self.basicDiv.classList.add("cmp-sliders-div-hidden");
        _.backbutton.pop();
        setTimeout(function(){
            self.basicDiv.style.display = "none";
            if(zoomContainer != null) {
                zoomContainer.remove();
            }
        },300);
    };
    imgSliders.prototype._getTargetImg = function(index,type){
        var self = this;
        var targetImg = self.imgs[index];
        if(typeof targetImg == "object" && targetImg.hasOwnProperty("big") && targetImg.hasOwnProperty("small")){
            if(type == "small") {
                targetImg = targetImg.small;
            }else if(type == "big"){
                targetImg = targetImg.big;
            }
        }
        return targetImg;
    };
    var imgSuffix = /(suffix=png)|(suffix=jpg)|(suffix=jpeg)|(suffix=gif)|(suffix=bmp)/i;
    imgSliders.prototype._getImgName = function(saveImg){
        var imgName = "MX_IMG_" + _.buildUUID() + ".png";
        var suffixKeyValue = saveImg.match(imgSuffix);
        if(suffixKeyValue && suffixKeyValue[0]){
            var suffixValue = suffixKeyValue[0].split("=")[1];
            imgName  = "MX_IMG_" + _.buildUUID() + "."+suffixValue;
        }
        return imgName;
    };
    /**
     * 绑定手势改变事件
     * @param slidersPlugins
     * @param imgs
     * @private
     */
    imgSliders.prototype._bindZoom = function(){
        var self = this;
        //========================原图查看============================//
        var smallImgsObject = self.basicDiv.getElementsByTagName("img");
        var bigImgBtn = self.basicDiv.querySelector("#bigImgBtn");
        var numText = self.basicDiv.querySelector("#numText");
        bigImgBtn.addEventListener("tap",function(e){
            e.stopPropagation();
            this.classList.add("cmp-hidden");
            numText.classList.add("cmp-hidden");
            self.seeOrginalImg = true;
            var index = self.index -1;
            index = index <0?0:index;
            self._startUpZoom(smallImgsObject[index],self);
        },false);
    };
    imgSliders.prototype._bindSmallZoom = function(){
        var self = this;
        var sliderItem = self.basicDiv.querySelectorAll(".cmp-slider-item");
        var i = 0,len = sliderItem.length;
        var finger = false;
        for(;i<len;i++) {
            (function(i){
                sliderItem[i].addEventListener("touchstart",function(e){
                    var touchTarget = e.touches.length; //获得触控点数
                    if(touchTarget == 1){
                        finger = false;
                    }else {
                        finger = true;
                        var img = this.querySelector("img");
                        self._startUpZoom4Small(img);
                    }
                });

                sliderItem[i].addEventListener("touchend",function(e){
                    if(finger == true){

                    }
                });
            })(i)
        }
    };
    imgSliders.prototype._startUpZoom = function(img,imgSlidersObj){
        var self = this;
        var zoomPack = self.basicDiv.querySelector(".cmp-slider-imgzoom-pack");
        if(zoomPack)zoomPack.remove();
        var zoomContainerStr = _.tpl(zoomContainerTemp,{big:true});
        _.append(self.basicDiv,zoomContainerStr);
        var zoomContainer = self.basicDiv.querySelector(".cmp-slider-imgzoom-pack");
        setTimeout(function(){
            zoomContainer.classList.remove("cmp-hide");
            zoomContainer.classList.remove("cmp-sliders-div-hidden");
            zoomContainer.classList.add("cmp-active");
            zoomContainer.classList.add("cmp-sliders-div-show");
        },50);
        self.zoomObj = new ImagesZoom();
        var zoomParams = {
            container:zoomContainer,
            img:img,
            imgSlidersObj:imgSlidersObj
        };
        self.zoomObj._init(zoomParams);
    };
    imgSliders.prototype._startUpZoom4Small = function(img){
        var self = this;
        var zoomPack = self.basicDiv.querySelector(".cmp-slider-imgzoom-pack");
        if(zoomPack)zoomPack.remove();
            var zoomContainerStr = _.tpl(zoomContainerTemp,{});
            _.append(self.basicDiv,zoomContainerStr);
            var zoomContainer = self.basicDiv.querySelector(".cmp-slider-imgzoom-pack");
            self.zoomObj = new ImagesZoom();
            var zoomParams = {
                container:zoomContainer,
                img:img,
                callback:function(recode){
                    switch (recode){
                        case 1:
                            if(self.index > 1) {
                                self.slidersPlugin.gotoItem((self.index-2),"right");
                            }
                            break;
                        case 2:
                            self.slidersPlugin.gotoItem(-(self.index),"left");
                            break;
                    }
                    img.style.display = "block";
                }
            };
            self.zoomObj._init4small(zoomParams);
    };
    imgSliders.prototype._addImgs = function(imgs){
        var self = this;
        if(self._isArray(imgs)){
            self.imgs.concat(imgs);
        }else if(toString.apply(imgs) == "[object HTMLCollection]"){
            var cache = [],i = 0,len = imgs.length;
            for(;i<len;i ++){
                if(typeof imgs[i] == "object"){
                    cache.push(imgs[i].src);
                }
            }
            if(cache.length > 0) {
                self.imgs.concat(cache);
            }
        }else if(toString.apply(imgs) == "[object Object]"){ //如果是单个的图片对象
            self.imgs.push(imgs.src);
        }else {
            self.imgs.push(imgs);
        }

    };
    /**
     * 判断是否是数组
     * @param a
     * @returns {boolean}
     * @private
     */
    imgSliders.prototype._isArray = function(a){
        return toString.apply(a) === '[object Array]';
    };
    /**
     * 判断某个元素是否在数组里
     * @param item
     * @param array
     * @returns {boolean}
     * @private
     */
    imgSliders.prototype._isContain = function(item,array){
        var i = 0,len = array.length;
        for(;i < len; i ++) {
            if(item == array[i]) return true;
        }
        return false;
    };
    /*=======================缩放部分==================*/
    var ImagesZoom = function(){};

    ImagesZoom.prototype = {
        // 给初始化数据
        _init: function(param){
            var self   = this;
            self.container = param.container;
            self.smallImg = param.img;
            self.imgSlidersObj = param.imgSlidersObj;
            self.offsetXRecode = 0;//移动时超出x坐标界限的次数
            var zoomImg   = self.container.querySelector("#cmp_sliders_zoom_img");
            self.buffMove   = 3; //缓冲系数
            self.buffScale  = 2; //放大系数
            self.finger = false; //触摸手指的状态 false：单手指 true：多手指
            self.seeAction = 0;//监听如果大图还没有加载完，就关闭大图，此时小图还没有显示
            self._destroy();
            zoomImg.src = param.img.getAttribute("big-src");
            var containerW = self.container.offsetWidth;
            var imgWidth = param.img.offsetWidth;
            var imgHeight = param.img.offsetHeight;
            var containerWidth = self.container.offsetWidth;
            if(imgWidth <= containerWidth){
                zoomImg.style.width = containerW + "px";
            }
            zoomImg.style.marginTop = "-"+(imgHeight/2)+"px";
            zoomImg.onload = function(){
                if(!self.container) return;//防护加载大图片的时候，还没有加载完，组件就销毁了，导致错误
                if(self.seeAction == 1) return;
                self.imgBaseWidth  = zoomImg.offsetWidth;
                self.imgBaseHeight = zoomImg.offsetHeight;
                zoomImg.style.marginTop = "-"+(self.imgBaseHeight/2)+"px";
                param.img.classList.add("cmp-hidden");
                self.container.querySelector(".cmp-slider-imgzoom-loading-wrapper").remove();
                self._addEventStart({
                    wrapX: containerWidth,//大图缩放时，使用容器宽度，修改OA-148014
                    wrapY: self.container.offsetHeight,
                    mapX: zoomImg.width,
                    mapY: zoomImg.height
                });
            };
            zoomImg.onerror = function(){
                _.notification.toast(_.i18n("cmp.sliders.lostNetwork"),"center",1000);
                if(!self.container) return;//防护加载大图片的时候，还没有加载完，组件就销毁了，导致错误
                if(self.seeAction == 1) return;
                self.container.querySelector(".cmp-slider-imgzoom-loading-wrapper").remove();
                self.container.remove();
                self.container = null;
            };
            self._bindClose(param.img);
        },
        _init4small:function(param){
            var self   = this;
            self.container = param.container;
            self.callback = param.callback;
            self.offsetXRecode = 0;//移动时超出x坐标界限的次数
            var zoomImg   = self.container.querySelector("#cmp_sliders_zoom_img");
            self.buffMove   = 3; //缓冲系数
            self.buffScale  = 2; //放大系数
            self.finger = false; //触摸手指的状态 false：单手指 true：多手指
            self._destroy();
            zoomImg.src = param.img.src;
            var imgHeight = param.img.offsetHeight;
            var imgWidth = param.img.offsetWidth;
            var containerWidth = self.container.offsetWidth;
            if(imgWidth <= containerWidth){
                zoomImg.style.width = imgWidth + "px";
                zoomImg.style.marginLeft = ((containerWidth - imgWidth)/2) + "px";
            }
            zoomImg.style.marginTop = "-"+(imgHeight/2)+"px";
            zoomImg.onload = function(){
                self.imgBaseWidth  = zoomImg.offsetWidth;
                self.imgBaseHeight = zoomImg.offsetHeight;
                param.img.style.display="none";
                self._addEventStart({
                    wrapX: (imgWidth < containerWidth)?imgWidth: self.container.offsetWidth,
                    wrapY: self.container.offsetHeight,
                    mapX: zoomImg.width,
                    mapY: zoomImg.height,
                    small:true
                });
            };
            _.event.click(self.container,function(){
                param.img.classList.remove("cmp-hidden");
                param.img.style.display = "block";
                self.container.remove();
            });
        },
        _bindClose:function(smallImg){
            var self = this;
            var basicDiv = self.container.parentNode;
            var bigImgBtn = basicDiv.querySelector("#bigImgBtn");
            var numText = basicDiv.querySelector("#numText");
            var touchStartX,touchStartY,offset = 6;
            self.container.addEventListener("touchstart",function(e){
                e.preventDefault();
                var touchTarget = e.targetTouches.length; //获得触控点数
                touchStartX = self._getPage(e, "pageX");
                touchStartY = self._getPage(e, "pageY");
                if(touchTarget == 1){
                    // 获取开始坐标
                    self.finger = false;
                }else{
                    self.finger = true;
                }
            },false);
            self.container.addEventListener("touchend",function(e){
                e.preventDefault();
                if(!self || self.finger) return;
                var touchEndX = self._getPage(e, "pageX");
                var touchEndY = self._getPage(e, "pageY");
                if(Math.abs(touchEndX - touchStartX) < offset && Math.abs(touchEndY - touchStartY) < offset){
                    self.seeAction = 1;
                    setTimeout(function(){
                        if(!self) return;
                        self.container.classList.remove("cmp-active");
                        self.container.classList.add("cmp-hide");
                        self.container.classList.add("cmp-sliders-div-hidden");
                        self.container.classList.remove("cmp-sliders-div-show");
                    },50);
                    setTimeout(function(){
                        if(!self) return;
                        self.container.remove();
                        self.container = null;
                        self.imgSlidersObj.seeOrginalImg = false;
                        self = null;
                        bigImgBtn.classList.remove("cmp-hidden");
                        numText.classList.remove("cmp-hidden");
                        smallImg.classList.remove("cmp-hidden");
                        smallImg.style.display = "block";
                    },300);
                }
            },false);
        },
        _addEventStart: function(param){
            var self   = this,
                params = param || {};
            self.element = self.container.querySelector(".cmp-slider-imgzoom-pack img");
            self.elementContainer = self.container.querySelector(".cmp-slider-imgzoom-pack .cmp-slider-imgzoom-img");

            //config set
            self.wrapX = params.wrapX || 0; 	//可视区域宽度
            self.wrapY = params.wrapY || 0; 	//可视区域高度
            self.mapX  = params.mapX || 0; 	    //地图宽度
            self.mapY  = params.mapY || 0;      //地图高度

            self.outDistY = (self.mapY - self.wrapY)/2; //图片超过一屏的时候有用

            self.width  = self.mapX - self.wrapX;   //地图的宽度减去可视区域的宽度
            self.height = self.mapY - self.wrapY;   //地图的高度减去可视区域的高度

            self.elementContainer.addEventListener("touchstart",function(e){
                self._touchstart(e);
            },false);
            self.elementContainer.addEventListener("touchmove",function(e){
                self._touchmove(e);
            },false);
            self.elementContainer.addEventListener("touchend",function(e){
                self._touchend(e,param.small);
            },false);

        },
        // 重置坐标数据
        _destroy: function(){
            var self = this;
            self.distX = 0;
            self.distY = 0;
            self.newX  = 0;
            self.newY  = 0;
        },
        // 更新地图信息
        _changeData: function(){
            var self = this;
            self.mapX     = self.element.offsetWidth; 	  //地图宽度
            self.mapY     = self.element.offsetHeight;      //地图高度
            // this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
            self.width    = self.mapX - self.wrapX;   //地图的宽度减去可视区域的宽度
            self.height   = self.mapY - self.wrapY;   //地图的高度减去可视区域的高度
        },
        _touchstart: function(e){
            var self = this;

            e.preventDefault();

            var touchTarget = e.targetTouches.length; //获得触控点数

            self._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算

            if(touchTarget == 1){
                // 获取开始坐标
                self.basePageX = self._getPage(e, "pageX");
                self.basePageY = self._getPage(e, "pageY");

                self.finger = false;
            }else{
                self.finger = true;

                self.startFingerDist = self._getTouchDist(e).dist;
                self.startFingerX    = self._getTouchDist(e).x;
                self.startFingerY    = self._getTouchDist(e).y;
            }
        },
        _touchmove: function(e){
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            var touchTarget = e.targetTouches.length; //获得触控点数

            if(touchTarget == 1 && !self.finger){
                self._move(e);
            }

            if(touchTarget>=2){
                self._zoom(e);
            }
        },
        _touchend: function(e,small){
            var self = this;
            self._changeData(); //重新计算数据
            if(self.finger){
                self.distX = -self.imgNewX;
                self.distY = -self.imgNewY;
            }

            if( self.distX>0 ){
                self.newX = 0;
                if(small){
                    if(self.finger){
                        self._reset();
                    }else {
                        self.offsetXRecode ++;
                        if(self.offsetXRecode > 1) {
                            self.container.remove();
                            self.callback(1);
                        }else {
                            self._reset();
                        }
                    }

                }else {
                    self._reset();
                }

            }else if( self.distX<=0 && self.distX>=-self.width ){
                self.newX = self.distX;
                self.newY = self.distY;
                self.offsetXRecode = 0;
                self._reset();
            }else if( self.distX<-self.width ){
                self.newX = -self.width;
                if(small){
                    self.offsetXRecode ++;
                    if(self.offsetXRecode > 1) {
                        self.container.remove();
                        self.callback(2);
                    }else {
                        self._reset();
                    }
                }else {
                    self._reset();
                }
            }
        },
        _move: function(e){
            var self = this,
                pageX = self._getPage(e, "pageX"), //获取移动坐标
                pageY = self._getPage(e, "pageY");

            // 禁止默认事件
            // e.preventDefault();
            // e.stopPropagation();

            // 获得移动距离
            self.distX = (pageX - self.basePageX) + self.newX;
            self.distY = (pageY - self.basePageY) + self.newY;

            if(self.distX > 0){
                self.moveX = Math.round(self.distX/self.buffMove);
            }else if( self.distX<=0 && self.distX>=-self.width ){
                self.moveX = self.distX;
            }else if(self.distX < -self.width ){
                self.moveX = -self.width+Math.round((self.distX+self.width)/self.buffMove);
            }
            self._movePos();
            self.finger = false;
        },
        // 图片缩放
        _zoom: function(e){
            var self = this;
            var nowFingerDist = self._getTouchDist(e).dist, //获得当前长度
                ratio 		  = nowFingerDist / self.startFingerDist, //计算缩放比
                imgWidth  	  = Math.round(self.mapX * ratio), //计算图片宽度
                imgHeight 	  = Math.round(self.mapY * ratio); //计算图片高度

            // 计算图片新的坐标
            self.imgNewX = Math.round(self.startFingerX * ratio - self.startFingerX - self.newX * ratio);
            self.imgNewY = Math.round((self.startFingerY * ratio - self.startFingerY)/2 - self.newY * ratio);
            if(imgWidth >=self.imgBaseWidth){
                self.element.style.width = imgWidth + "px";
                self._refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
                self.finger = true;
            }else{
                if(imgWidth < self.imgBaseWidth){
//                    self.container.remove();
                }
            }
            self.finger = true;
        },
        // 移动坐标
        _movePos: function(){
            var self = this;

            if(self.height<0){
                if(self.element.offsetWidth == self.imgBaseWidth){
                    self.moveY = Math.round(self.distY/self.buffMove);
                }else{
                    var moveTop = Math.round((self.element.offsetHeight-self.imgBaseHeight)/2);
                    self.moveY = -moveTop + Math.round((self.distY + moveTop)/self.buffMove);
                }
            }else{
                var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
                    b = self.element.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;

                if(self.distY >= -a){
                    self.moveY = Math.round((self.distY + a)/self.buffMove) - a;
                }else if(self.distY <= -b){
                    self.moveY = Math.round((self.distY + b)/self.buffMove) - b;
                }else{
                    self.moveY = self.distY;
                }
            }
            self._refresh(self.moveX, self.moveY, "0s", "ease");
        },
        // 重置数据
        _reset: function(){
            var self = this,
                hideTime = ".2s";
            if(self.height<0){
                self.newY = -Math.round(self.element.offsetHeight - self.imgBaseHeight)/2;
            }else{
                var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
                    b = self.element.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;

                if(self.distY >= -a){
                    self.newY = -a;
                }else if(self.distY <= -b){
                    self.newY = -b;
                }else{
                    self.newY = self.distY;
                }
            }
            self._refresh(self.newX, self.newY, hideTime, "ease-in-out");
        },
        // 执行图片移动
        _refresh: function(x, y, timer, type){
            var self = this;
            self.element.style.webkitTransitionProperty = "-webkit-transform";
            self.element.style.webkitTransitionDuration = timer;
            self.element.style.webkitTransitionTimingFunction = type;
            self.element.style.webkitTransform = self._getTranslate(x, y);
        },
        // 获取多点触控
        _getTouchDist: function(e){
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0,
                x3 = 0,
                y3 = 0,
                result = {};

            x1 = e.touches[0].pageX;
            x2 = e.touches[1].pageX;
            y1 = e.touches[0].pageY - document.body.scrollTop;
            y2 = e.touches[1].pageY - document.body.scrollTop;

            if(!x1 || !x2) return;

            if(x1<=x2){
                x3 = (x2-x1)/2+x1;
            }else{
                x3 = (x1-x2)/2+x2;
            }
            if(y1<=y2){
                y3 = (y2-y1)/2+y1;
            }else{
                y3 = (y1-y2)/2+y2;
            }

            result = {
                dist: Math.round(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))),
                x: Math.round(x3),
                y: Math.round(y3)
            };
            return result;
        },
        _eventStop: function(e){
            e.preventDefault();
            e.stopPropagation();
        },
        _getTranslate:function(x,y){
            var distX = x, distY = y;
            return ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()) ? "translate3d("+ distX +"px, "+ distY +"px, 0)" : "translate("+ distX +"px, "+ distY +"px)";
        },
        _getPage:function(event, page){
            return ("ontouchstart" in window) ? event.changedTouches[0][page] : event[page];
        }
    };

    var temp = function() {
        var temp =
        '<div class="cmp-sliders-wrapper-parent">' +
        '   <div id="cmp_sliders_wrapper_<%=this %>" class="cmp-slider cmp-sliders-wrapper">' +
        '       <div class="cmp-slider-group" id="cmp_sliders_container"></div>' +
        '   </div>' +
        '</div>' +
        '<div class="cmp-slider-text">' +
        '   <div id="saveBtn" class="save-btn">' + _.i18n("cmp.sliders.save") + '</div>' +
        '   <div id="bigImgBtn" class="big-img-btn">' + _.i18n("cmp.sliders.viewOriginal") + '</div>' +
        '   <div id="numText" class="tab"><span id="cmp_sliders_num">1</span>/<span id="cmp_sliders_total"></span></div>' +
        '</div>';
        return temp;
    };
    var zoomContainerTemp =
        '<div class="cmp-slider-imgzoom-pack <% if(this.big){ %> cmp-hide cmp-sliders-div-hidden <% } %> ">' +
        '  <% if(this.big){ %><div class="cmp-slider-imgzoom-loading-wrapper"><div class="loading"><div class="cmp-spinner active"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div> <% } %> ' +
        '   <div class="cmp-slider-imgzoom-img">' +
        '       <img id="cmp_sliders_zoom_img">' +
        '   </div>' +
        '</div>';

    var _cmpH5Sliders;
    _.sliders = function(imgs,options){
        if(!_cmpH5Sliders){
            _cmpH5Sliders = new imgSliders(imgs,options);
        }else {
            _cmpH5Sliders._addImgs(imgs,options);
        }
    };

    /**
     * 按需轮播图片
     * @param imgs  //每次重新实例化一次组件
     */
    _.sliders.addNew = function(imgs,options) {
        if(_cmpH5Sliders) {
            var slidersDiv = document.querySelector(".cmp-sliders-basicDiv");
            if(slidersDiv) slidersDiv.remove();
            _cmpH5Sliders = null;
        }
        _cmpH5Sliders = new imgSliders(imgs,options);
    };
    /**
     * 检测将要轮播的图片的起始位置
     * @param index将要被轮播的图片的起始位置
     */
    _.sliders.detect = function(index){
        _cmpH5Sliders._sliderDetect(index);
    };
    /**
     * 轮播组件关闭方法
     */
    _.sliders.close = function(){
        if(_cmpH5Sliders){
            _cmpH5Sliders._close("backButton");
        }
    };

    //=================================================================轮播插件H5版 end=============================//
})(cmp,mui);
