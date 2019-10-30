;(function(_){
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-tableList',null,cmpBuildversion);
    //=============================================================联动scroll start==================================//
    var tablistType = {
        default:1,    //tablelist普通列表
        choosable:2  //tablelist是可进行多选/单选的列表
    };
    var getNoDataHtml = function(purpose){
        var noDataHtml = '<div class="StatusContainer tablelist">';
        switch (purpose) {
            case 1:
                noDataHtml +=
                    '   <div class="nocontent"></div>' +
                    '   <span class="text nocontent_text">'+_.i18n("cmp.tableList.noData4Default")+'</span>' +
                    '</div>';
                break;
            case 2:
                noDataHtml +=
                    '    <span class="cmp-icon see-icon-searchnoresults"></span>' +
                    '   <span class="text">'+_.i18n("cmp.tableList.noData4Search")+'</span>' +
                    '</div>';
                break;
            default :
                break;
        }
        return noDataHtml;
    };
    var linkScroll = function(container,opts){
        var self = this;
        self.options = _.extend({
            fields:{},  //{fields:{"0":"ddd","1":"ttt"}}
            params:{},//请求数据所传的参数
            pageSize:20,//分页数
            theme:{
                headerStyle:"background:#728197;color:#ececed;font-size:20px;font-weight:bolder;",//列表头部样式，以css字符串的形式
                sidebarStyle:"background:#ffffff;color:#bcbec1;",//侧边栏样式，以css字符串的形式
                rowClass:"table-content-list-default"//列表class类，由开发者自己定义，一般是定义的错峰显示的不同底色的类

            },//主题颜色包含了头部，索引列，行间错峰颜色,每一对数组值代表了|前面是背景色，后面是字体样式
            headerH:32,//头部高度
            sidebarW:50,//索引列的宽度
            rowH:41,//数据列表行高
            vBind:true,
            hBind:false,
            callback:null,//点击列表数据回调函数
            multiLevelCallback:null,//进入下一级的回调函数
            dataFunc:null,//请求数据的方法
            down:null,//下拉ue配置
            up:null,//上拉ue配置
            captionType:1,//是否显示最近更新日期
            purpose:1,//列表目的，1，普通列表数据展示；2，搜索内容
            type:1,//列表数据是否是可选择的(1:默认不可选择(数字排序)，2，可进行选择的)
            radio:false,//是否只能进行单选  true 只能单选，false进行多选
            multiLevel:false//是否是多级查看  true 会出现一个向右的按钮，可进行到下一级的回调函数，false：不会出现向右的按钮

        },opts);
        self.container = (typeof container == "object")?container:document.querySelector(container);
        var renderData = {};
        renderData.style = {
            headerStyle:self.options.theme.headerStyle,
            headerH:self.options.headerH,
            left:0,
            pl:self.options.sidebarW,
            mt:self.options.headerH

        };
        renderData.fields = self.options.fields;
        renderData.topPocket = self.options.down?true:false;
        renderData.bottomPocket = self.options.up?true:false;
        renderData.downTips = renderData.topPocket?self.options.down.contentrefresh:"";
        renderData.upTips = renderData.bottomPocket?self.options.up.contentdown:"";
        renderData.multiLevel = self.options.multiLevel;
        self.uuID = _.buildUUID();
        renderData.uuID = self.uuID;
        var ui = _.tpl(html,renderData);
        self.container.innerHTML = ui;
        self._init();
        self._createScroll();
        self._loadData(true,1);
        self._bindLoadMoreEven();
    };
    linkScroll.prototype._init = function(){
        var self = this;
        self._initSetTable();
        self._initParam();
        self._initUI();
    };
    linkScroll.prototype._createScroll = function(){
        var self = this;
        self.mainScroller = new _.iScroll("#cmp_main_wrapper_"+self.uuID,{
            hScroll: true,
            vScroll: false,
            bounceLock: true,
            lockDirection: true,
            bounce:false
        });
        self.secondaryScroller = new _.iScroll("#cmp_secondary_wrapper_"+self.uuID,{
            hScroll: false,
            vScroll: true,
            bounceLock: false,
            lockDirection: true,
            onScrollStart:function(){
                if (!self.loading) {
                    self.pulldown = self.pullPocket = self.pullCaption = self.pullLoading = false;
                }
            },
            onScrollMove:function(){
                if (self.options.down && !self.pulldown && !self.loading && self.options.down && this.y > 0) {
                    self._pullUIRefresh(true);
                }
                self.pulldown = this.y > 0;
                if (self.pulldown) {
                    if(this.y <= 18){
                        if(self.topPocket){
                            self.topPocket.classList.remove("cmp-visibility");
                        }
                    }else {
                        if(self.topPocket){
                            self.topPocket.classList.add("cmp-visibility");
                        }
                        if(self.options.down){
                            self._setCaption(this.y > self.downH ? self.options.down.contentover : self.options.down.contentdown);
                            self.doRefresh = this.y > self.downH;

                        }
                    }

                }else {
                    if(self.topPocket){
                        self.topPocket.classList.remove("cmp-visibility");
                    }
                    if(Math.abs(this.y) > (Math.abs(this.maxScrollY) - 25)){
                        if(self.bottomPocket && !self.bottomPocket.classList.contains("cmp-visibility")){
                            self.bottomPocket.classList.add("cmp-visibility");
                        }
                    }else {
                        if(self.bottomPocket && self.bottomPocket.classList.contains("cmp-visibility")){
                            self.bottomPocket.classList.remove("cmp-visibility");
                        }
                    }
                }
            },
            onTouchEnd:function(){
                if(self.doRefresh){
                    self.secondaryScroller.disable();
                    if(self.topPocket){
                        self.secondary_wrapper.querySelector(".div-placeholder").classList.remove("cmp-hidden");
                        self.link_wrapper.querySelector(".div-placeholder").classList.remove("cmp-hidden");
                        if(self.link_wrapper2){
                            self.link_wrapper2.querySelector(".div-placeholder").classList.remove("cmp-hidden");
                        }
                    }
                }
            },
            onScrollEnd:function(){
                if (Math.abs(this.y) > 0 && this.y <= this.maxScrollY && !self.finished) {
                    self._scrollbottom();
                }
                //处理顶部的情况
                if (self.pulldown) {
                    if(self.doRefresh){
                        self._loadData(true,1);
                    }
                }
                if(this.y == 0){
                    if(self.topPocket && self.topPocket.classList.contains("cmp-visibility") && !self.loading){
                        self.topPocket.classList.remove("cmp-visibility");
                    }
                }
                //处理底部的情况
                if(Math.abs(this.y) >= (Math.abs(this.maxScrollY))){
                    if(self.bottomPocket && !self.bottomPocket.classList.contains("cmp-visibility")){
                        self.bottomPocket.classList.add("cmp-visibility");
                    }
                }else {
                    if(self.bottomPocket && self.bottomPocket.classList.contains("cmp-visibility")){
                        self.bottomPocket.classList.remove("cmp-visibility");
                    }
                }
                if(!self.doRefresh){
                    if(self.topPocket){
                        self.secondary_wrapper.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        self.link_wrapper.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        if(self.link_wrapper2){
                            self.link_wrapper2.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        }
                    }

                }
            }
        });
        self.secondaryScroller.bind({
            linkDiv: "#cmp_link_wrapper_"+ self.uuID,
            width:self.options.sidebarW
        });
        if(self.options.multiLevel){ //如果是多级选择
            var left = window.innerWidth - 50;//靠右的距离
            self.secondaryScroller.bind({
                linkDiv: "#cmp_link_wrapper2_"+ self.uuID,
                left:left
            });
        }
    };

    linkScroll.prototype._initSetTable = function(){
        var self = this;
        self.hTable = self.container.querySelector('#head_table_'+ self.uuID);
        self.bTable = self.container.querySelector('#body_table_'+ self.uuID);
        self.lTable = self.container.querySelector("#body_table_link_"+ self.uuID);
        self.lTable2 = self.container.querySelector("#body_table_link2_"+ self.uuID);
        var thisWinH = window.innerWidth;
        var cellWNumber, hCells;
        var hTr = self.hTable.querySelectorAll("tr")[0];
        if(hTr) hCells = hTr.querySelectorAll("td");


        //计算默认列数的宽度
        if (hCells.length == 3) {
            cellWNumber = thisWinH / 3 + "px";
        } else if (hCells.length == 2) {
            cellWNumber = thisWinH / 2 + "px";
        } else if (hCells.length == 1) {
            cellWNumber = thisWinH + "px";
        } else {
            cellWNumber = thisWinH / 3 + "px";
        }
        self.cellW = parseInt(cellWNumber) - 2;
        for(var i = 0;i< hCells.length ;i++){
            hCells[i].style.width = self.cellW + "px";
            hCells[i].style.maxWidth = self.cellW + "px";
        }


        //计算表格默认列数的宽度设置之后再设置容器的宽度
        var main_scroller = self.container.querySelector('#cmp_main_scroll_'+ self.uuID);
        self.mainCotent = self.container.querySelector(".main-content");
        self.secondary_wrapper = self.container.querySelector("#cmp_secondary_wrapper_"+ self.uuID);
        var secondary_scroll = self.container.querySelector('#cmp_secondary_scroll_'+ self.uuID);
        self.table_header = main_scroller.querySelector("#head_table_"+ self.uuID);
        main_scroller.style.width = parseInt(hCells[0].style.width) * hCells.length + "px";
        secondary_scroll.style.width = parseInt(hCells[0].style.width) * hCells.length + "px";
        self.secondary_wrapper.style.height = (self.container.offsetHeight - self.table_header.offsetHeight + self.animationHThreshold) + "px";
        self.link_wrapper = self.container.querySelector("#cmp_link_wrapper_"+ self.uuID);
        self.link_wrapper2 = self.container.querySelector("#cmp_link_wrapper2_"+ self.uuID);
    };
    linkScroll.prototype._initParam = function(){
        var self = this;
        self.isLoadError = {};
        self.isLoadError["up"] = false;
        self.isLoadError["down"] = false;
        self.finished = false;
        self.initFinished = false;//用于是否展示底部加载更多按钮的标记（如果首次加载数据时就已经是分页模式了，则显示加载更多按钮）
        self.pageNo = 1;
        self.loading = false;
        self.initNo = 0;
        self.downH = 55;
        self.animationHThreshold = 50;//由于需要下拉刷新时的动画效果，需要加一个阀值为50的div占位符
        self.doRefresh = false;
        self.initRender = true;
    };
    linkScroll.prototype._initUI = function(){
        var self = this;
        self.topPocket = self.options.down?self.container.querySelector(".cmp-pull-top-pocket"):null;
        self.bottomPocket = self.options.up?self.container.querySelector(".cmp-pull-bottom-pocket"):null;

        if(self.topPocket){
            self.topLoading = self.topPocket.querySelector('.cmp-pull-loading');
            self.topCaption = self.topPocket.querySelector('.cmp-pull-caption');
            self.topShowText = self.topPocket.querySelector(".showText");
            if(self.options.captionType == 1){
                self.topTotalNum = self.topCaption.querySelector(".totalNum");
                self.topUpdateTime = self.topCaption.querySelector(".updateTime");
            }
        }
        if(self.bottomPocket){
            self.bottomLoading = self.bottomPocket.querySelector('.cmp-pull-loading');
            self.bottomCaption = self.bottomPocket.querySelector(".cmp-pull-caption");
            self.bottomHaveNum = self.bottomPocket.querySelector(".haveNum");
            self.bottomShowText = self.bottomCaption.querySelector(".showText");
        }

        self.content = self.bTable.querySelector("tbody");
        self.siderbar = self.lTable.querySelector("tbody");
        self.siderbarBtn = self.lTable2?self.lTable2.querySelector("tbody"):null;
    };

    linkScroll.prototype._loadData = function(down,pageNo){
        var self = this;
        if (self.loading) {
            return;
        }

        self.loading = true;
        if(self.options.down || self.options.up){
            self._pullUIRefresh(down);
        }
        if(down){  //如果是下拉刷新
            if(self.options.down){
                self._setCaption(self.options.down.contentrefresh);
            }
            self._loadDataAndRenderCallback(pageNo,"down");
        }else {  //如果是加载更多
            if(self.options.up){
                self._setCaption(self.options.up.contentrefresh);
            }
            self._loadDataAndRenderCallback(pageNo,"up");
        }
    };
    linkScroll.prototype._render = function(data,isRefresh){
        var self = this;
        var lockImgLeft = self.options.sidebarW - 15;
        var placeholderH = 50;
        if(isRefresh || self.options.sidebarW == 0){
            placeholderH = self.options.headerH+60;
        }
        data.style = {
            sidebarStyle:self.options.theme.sidebarStyle,
            sidebarW:self.options.sidebarW,
            rowH:self.options.rowH,
            rowClass:self.options.theme.rowClass,
            lockImgLeft:lockImgLeft,
            placeholderH:placeholderH
        };
        var item = _.tpl(itemHtml,data);
        var sidebar = _.tpl(sidebarNumHtml,data);
        var sidebarBtn = self.options.multiLevel? _.tpl(sidebarBtnHtml,data):null;
        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
            self.content.innerHTML = item;
            self.siderbar.innerHTML = sidebar;
            if(sidebarBtn){
                self.siderbarBtn.innerHTML = sidebarBtn;
            }
        } else {
            var contentPlaceholder = self.content.querySelector(".table-placeholder");
            var siderbarPlaceholder = self.siderbar.querySelector(".table-placeholder");
            if(contentPlaceholder) contentPlaceholder.remove();
            if(siderbarPlaceholder) siderbarPlaceholder.remove();
            _.append(self.content,item);
            _.append(self.siderbar,sidebar);
            if(sidebarBtn){
                var siderbarBtnPlaceholder = self.siderbarBtn.querySelector(".table-placeholder");
                if(siderbarBtnPlaceholder) siderbarBtnPlaceholder.remove();
                _.append(self.siderbarBtn,sidebarBtn);
            }
        }
        self._calculateCellW();
    };
    linkScroll.prototype._renderNoData = function(type){
        var self = this;
        var html = getNoDataHtml(self.options.purpose,true);
        _.append(self.mainCotent,html);
        self._endPulldownToRefresh(self.finished);
    };
    linkScroll.prototype._calculateCellW = function(){
        var self = this;
        var contentTd = self.content.querySelectorAll("td.init-render");
        var i = 0,len = contentTd.length;
        for(;i<len;i++){
            contentTd[i].style.width = self.cellW + "px";
            contentTd[i].classList.remove("init-render")
        }
    };
    linkScroll.prototype._pullUIRefresh = function (down) {
        var self = this;
        if(down){
            self.pulldown = true;
            if(self.topPocket){
                self.pullPocket = self.topPocket;
                self.pullPocket.classList.add("cmp-block");
                self.pullPocket.classList.add("cmp-visibility");
                self.pullCaption = self.topCaption;
                self.pullLoading = self.topLoading;
                if(self.topTotalNum && !self.loading) self.topTotalNum.classList.remove("cmp-hidden");
                if(self.topUpdateTime && !self.loading) self.topUpdateTime.classList.remove("cmp-hidden");
            }

        }else {
            self.pulldown = false;
            self.pullPocket = self.bottomPocket;
            self.pullCaption = self.bottomCaption;
            self.pullLoading = self.bottomLoading;
        }

    };
    linkScroll.prototype._setCaption = function (title, reset) {
        var self = this;

        var options = self.options;
        var pocket = self.pullPocket;
        var caption = self.pullCaption;
        var loading = self.pullLoading;
        var isPulldown = self.pulldown;
        var finished = self.finished;
        if (pocket || title == null) {
            if (reset) {
                if(caption){
                    setTimeout(function(){ //头部动画
                        if (options.captionType == 1) {
                            caption.querySelector(".showText").innerHTML = self.lastTitle = title;
                        } else {
                            caption.innerHTML = self.lastTitle = title;
                        }
                        if(isPulldown) loading.className = "cmp-pull-loading ";
                    },360);
                }

                if (isPulldown) {
                    if (caption && options.captionType == 1) {
                        self.topTotalNum.innerHTML = _.i18n("cmp.tableList.inAll",[self.total]);
                        self.topUpdateTime.innerHTML =_.i18n("cmp.tableList.update",[new Date().format("yyyy-MM-dd hh:mm")]);
                    }


                    if (self.bottomCaption) {
                        self._setCaptionClass(false, self.bottomCaption, options.up.contentdown);
                        var Num = self.total - (self.pageNo * options.pageSize);

                        if(Num > 0 && !finished) {
                            if(options.captionType == 1){
                                self.bottomShowText.innerHTML = options.up.contentdown;
                                self.bottomHaveNum.innerHTML = "还有" + Num + "条";
                                self.bottomHaveNum.classList.remove("cmp-hidden");
                            }else {
                                self.bottomCaption.innerHTML = options.up.contentdown;
                            }
                        }else {
                            self.bottomCaption.innerHTML = options.up.contentnomore;
                            if(self.bottomHaveNum) self.bottomHaveNum.classList.add("cmp-hidden");
                        }
                    }
                }
                else {
                    self._setCaptionClass(false, caption, title);
                    loading.className = "cmp-pull-loading cmp-icon cmp-spinner active";
                }
            } else {
                if (title != null && title !== this.lastTitle) {
                    if (options.captionType == 1) {
                        caption.querySelector(".showText").innerHTML = title;
                    } else {
                        caption.innerHTML = title;
                    }
                    if (isPulldown) {
                        if (title === options.down.contentrefresh) {
                            loading.className = "cmp-pull-loading cmp-icon cmp-spinner active";
                            self.topTotalNum.classList.add("cmp-hidden");
                            self.topUpdateTime.classList.add("cmp-hidden");
                        } else if (title === options.down.contentover) {
                            loading.className = "cmp-pull-loading";
                        } else if (title === options.down.contentdown) {
                            loading.className = "cmp-pull-loading";
                        }
                    } else {
                        if (title === options.up.contentrefresh) {
                            loading.className = "cmp-pull-loading cmp-icon cmp-spinner active cmp-visibility";
                            if(self.bottomHaveNum) self.bottomHaveNum.classList.add("cmp-hidden");
                        } else {
                            loading.className = "cmp-pull-loading cmp-icon cmp-spinner active cmp-hidden";
                            if(pocket.classList.contains("cmp-visibility")) pocket.classList.remove("cmp-visibility");
                            if(!finished) {
                                if(self.bottomHaveNum && self.bottomHaveNum.classList.contains("cmp-hidden")) {
                                    var Num = self.total - (self.pageNo * options.pageSize);
                                    if(Num > 0) {
                                        if (options.captionType == 1) {
                                            self.bottomHaveNum.innerHTML = _.i18n("cmp.tableList.rest",[Num]);
                                        }
                                    }
                                    self.bottomHaveNum.classList.remove("cmp-hidden");
                                }
                            }
                        }
                        self._setCaptionClass(false, caption, title);
                    }
                    self.lastTitle = title;
                }
            }

        }
    };
    linkScroll.prototype._setCaptionClass = function (isPulldown, caption, title) {
        var self = this;
        if (!isPulldown) {
            switch (title) {
                case self.options.up.contentdown:
                    caption.className = "cmp-pull-caption cmp-pull-caption-down";
                    break;
                case self.options.up.contentrefresh:
                    caption.className = 'cmp-pull-caption cmp-pull-caption-refresh';
                    break;
                case self.options.up.contentnomore:
                    caption.className = 'cmp-pull-caption cmp-pull-caption-nomore';
                    break;
            }
        }
    };
    linkScroll.prototype._scrollbottom = function () {
        var self = this;
        if (!self.pulldown && !self.loading && self.options.up) {
            self.pulldown = false;
            self._pullUIRefresh(false);
        }
    };
    linkScroll.prototype._bindLoadMoreEven = function(){
        var self = this;
        if(self.bottomPocket){
            self.bottomPocket.addEventListener("tap",function(){
                if(!self.finished){
                    self.secondaryScroller.disable();
                    self._loadData(false,self.pageNo);
                    self._updateContentH(0);
                }
            },false);
        }
    };
    linkScroll.prototype._bindClick = function(){
        var self = this;
        var noBindItems = self.content.querySelectorAll("tr.init-bind");
        var i = 0,len= noBindItems.length;
        for(;i<len;i++){
            (function(i){
                _.event.click(noBindItems[i],function(){
                    var info = noBindItems[i].getAttribute("info"),callback = self.options.callback;
                    if(callback && typeof callback == "function"){
                        callback(info);
                    }
                });
                noBindItems[i].classList.remove("init-bind");
            })(i);
        }
    };
    linkScroll.prototype._bindChoose = function(){
        var self = this;
        var noBindItems = self.content.querySelectorAll("tr.init-bind");
        var noBindCheckbox = self.lTable.querySelectorAll("input.init-bind");
        var i = 0,len= noBindItems.length;
        for(;i<len;i++){
            (function(i){
                _.event.click(noBindItems[i],function(){
                    var info = noBindItems[i].getAttribute("info"),callback = self.options.callback;
                    var index = noBindItems[i].getAttribute("index");
                    var currentCheckbox = self.lTable.querySelector("input.index_"+index+"");
                    if(!currentCheckbox.checked){
                        if(self.options.radio){
                            var allCheckbox = self.lTable.querySelectorAll("input");
                            var j = 0,length = allCheckbox.length;
                            for(;j<length;j++){
                                if(allCheckbox[j].checked) {
                                    allCheckbox[j].checked = false;
                                    break;
                                }
                            }
                        }
                        currentCheckbox.checked = true;
                    }else {
                        currentCheckbox.checked = false;
                    }
                    if(callback && typeof callback == "function"){
                        callback(info);
                    }
                });
                noBindItems[i].classList.remove("init-bind");
                _.event.click(noBindCheckbox[i],function(e){
                    var target = e.target;
                    var info = target.getAttribute("info"),callback = self.options.callback;
                    if(!target.checked){
                        if(self.options.radio){
                            var allCheckbox = self.lTable.querySelectorAll("input");
                            var j = 0,length = allCheckbox.length;
                            for(;j<length;j++){
                                if(allCheckbox[j].checked) {
                                    allCheckbox[j].checked = false;
                                    break;
                                }
                            }
                        }
                    }
                    if(callback && typeof callback == "function"){
                        callback(info);
                    }
                });
                noBindCheckbox[i].classList.remove("init-bind");
            })(i);
        }

    };
    linkScroll.prototype._bindMultiLevel = function(){
        var self = this;
        var noBindBtns = self.siderbarBtn.querySelectorAll("tr.init-bind");
        var i = 0,len= noBindBtns.length;
        for(;i<len;i++){
            (function(i){
                _.event.click(noBindBtns[i],function(){
                    var info = noBindBtns[i].getAttribute("info"),callback = self.options.multiLevelCallback;
                    if(callback && typeof callback == "function"){
                        callback(info);
                    }
                });
                noBindBtns[i].classList.remove("init-bind");
            })(i);
        }
    };
    linkScroll.prototype._loadDataAndRenderCallback = function(pageNo,type) {
        var self = this;
        var params = self.options.params;
        var dataFunc = self.options.dataFunc;
        var dataFuncArgs = [];
        if(pageNo == 1 && type == "down") {
            self.initNo = 0;
            self.pageNo = 1;
        }
        if (_.isObject(params)) {
            params["pageNo"] = pageNo;
            params["pageSize"] = self.options.pageSize;
            dataFuncArgs.push(params);
        } else if (_.isArray(params)) {
            var pLen = params.length;
            var postArgs = params[pLen - 1];
            if (_.isObject(postArgs)) {
                postArgs["pageNo"] = pageNo;
                postArgs["pageSize"] = self.options.pageSize;
                params[pLen - 1] = postArgs;
            }
            dataFuncArgs = dataFuncArgs.concat(params);
        }
        var optionsArg = {
            success: function (result) {  //result.isSwitchCrumbs是一个重要标识，表明是否在进行面包屑切换，如果是，则会把当前的页面的渲染的覆盖掉------辛裴（该标识是在ajax请求中设置的，很抽象，不需要开发者调用）
                self.total = parseInt(result.total);
                var pageSize = self.options.pageSize;
                var _pageCount = parseInt(self.total / pageSize);
                if (_pageCount <= 0) {
                    _pageCount = 1;
                }
                if (self.total > pageSize) {
                    self.totalPage = ((self.total % pageSize) > 0) ? _pageCount + 1 : _pageCount;
                } else {
                    self.totalPage = _pageCount;
                }
                self.finished = (self.totalPage <= pageNo || result.total <= result.data.length);
                var refreshParam = (pageNo == 1);
                result.initNo = self.initNo;
                result.finished = self.finished;
                result.listType = self.options.type;
                result.listRadio = self.options.radio;
                result.loadMoreUI = self.options.up?true:false;
                if(refreshParam) {
                    self.initFinished = self.finished;
                    result.initFinished = self.initFinished;
                    result.initFinished = false;//暂时设置成false
                }
                if(pageNo == 1 && result.data.length == 0) {  //如果是首次进行加载数据，并且数据为空时
                    self._renderNoData("down");
                }else {
                    self._render(result,refreshParam);
                    if(type == "up") {
                        self._endPullupToRefresh(self.finished);
                    }else if(type == "down") {
                        self._endPulldownToRefresh(self.finished)
                    }
                    self.isLoadError[type] = false;
                    self.pageNo ++;
                    self.initNo = result.initNo;
                    if(self.options.type == tablistType.default){
                        self._bindClick();
                    }else if(self.options.type == tablistType.choosable){
                        self._bindChoose();
                    }
                    if(self.options.multiLevel){
                        self._bindMultiLevel();
                    }
                }
                self.initNo += result.data.length;
            },
            error : function (result) {
                self.isLoadError[type] = true;
                if(type == "up") {
                    self._endPullupToRefresh(self.finished,self.isLoadError[type]);
                }else {
                    self._endPulldownToRefresh(self.finished);
                }
            }
        };
        dataFuncArgs.push(optionsArg);
        dataFunc && dataFunc.apply(dataFuncArgs, dataFuncArgs);
    };

    linkScroll.prototype._endPulldownToRefresh = function (isFinished) {
        var self = this;
        try{
            if (self.loading && self.pulldown) {
                self.loading = false;
                if (self.isLoadError["down"]) {
                    self._setCaption(_.i18n("cmp.tableList.error"), false);
                } else {
                    self._setCaption(self.options.down?self.options.down.contentdown:null, true);

                }
                self.pulldown = false;
                setTimeout(function(){
                    if(self.topPocket){
                        self.loading || self.topPocket.classList.remove("cmp-visibility");
                        self.secondary_wrapper.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        self.link_wrapper.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        if(self.link_wrapper2){
                            self.link_wrapper2.querySelector(".div-placeholder").classList.add("cmp-hidden");
                        }
                        if(self.doRefresh){
                            self.doRefresh = false;
                        }
                    }

                },250);
                self._updateContentH(self.animationHThreshold);

            }else {
                self._updateContentH(0);
            }
        }catch(e){}
        self.secondaryScroller.refresh();
        self.secondaryScroller.enable();
    };
    linkScroll.prototype._endPullupToRefresh = function (finished,isError) {
        var self = this;
        self.secondaryScroller.enable();
        if (self.bottomPocket && self.loading && !self.pulldown) {
            self.loading = false;
            if (finished && !isError) {
                self.finished = true;
                self._setCaption(self.options.up.contentnomore);
            } else {
                if(isError) {
                    self._setCaption(_.i18n("cmp.tableList.error"),false);
                }else {
                    self._setCaption(self.options.up.contentdown,false);
                }
            }
            self.secondaryScroller.refresh();

        }
    };
    linkScroll.prototype._updateContentH = function(threshold){
        var self = this;
        self.secondary_wrapper.style.height = (self.container.offsetHeight - self.table_header.offsetHeight + threshold) + "px";
        if(self.initRender){
            self.link_wrapper.style.height = (self.container.offsetHeight - self.table_header.offsetHeight-self.options.headerH + threshold - 10 ) + "px";
            if(self.link_wrapper2){
                self.link_wrapper2.style.height = (self.container.offsetHeight - self.table_header.offsetHeight-self.options.headerH + threshold) + "px";
            }
            self.initRender = false;
        }

    };
    linkScroll.prototype.getChoosedData = function(){
        var self = this;
        var data = [];
        var checkedboxs = self.siderbar.querySelectorAll("input:checked");
        var i = 0,len = checkedboxs.length;
        for(;i<len;i++){
            data.push(checkedboxs[i].getAttribute("info"));
        }
        return data;
    };

    _.tableList = function(container,opts){
        return new linkScroll(container,opts);
    };
    var html =
        '<div  class="table-content main-content" style="padding-left: <%=this.style.pl %>px;">' +
        '   <div id="cmp_main_wrapper_<%=this.uuID %>" class="main_wrapper bg_white" >' +  //横向主滚动区
        '       <div id="cmp_main_scroll_<%=this.uuID %>">' +
        '           <div class="table_head" >' +
        '               <table id="head_table_<%=this.uuID %>" class="table-th" cellpadding="0" cellspacing="0">' +
        '                   <tbody>' +
        '                       <tr style="height: <%=this.style.headerH %>px;<%=this.style.headerStyle %>;">' +
        '                       <% var fields = this.fields; %>'+
        '                       <% for(var key in fields){ %>' +
        '                           <td class="th-item" style="<%=this.style.headerStyle %>" ><%=fields[key] %></td>' +
        '                       <% } %>' +
        '                       </tr>' +
        '                   </tbody>' +
        '               </table>' +
        '           </div>' +
        '           <div id="cmp_secondary_wrapper_<%=this.uuID %>" class="table_body link-content bgw">' +  //纵向滚动区
        '               <div id="cmp_secondary_scroll_<%=this.uuID %>">' +
        '                <% if(this.topPocket){ %><div style="height:<%=this.style.headerH %>px;" class="div-placeholder"></div><% } %>' +
        '                   <table id="body_table_<%=this.uuID %>" class="table-content" cellpadding="0" cellspacing="0">' +
        '                       <tbody>' +
        '                       </tbody>'+
        '                   </table>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '</div>' +
        '<div id="cmp_link_wrapper_<%=this.uuID %>" style="left: <%=this.style.left %>px;" class="link-content bgw">' +     //左边索引/单选多选按钮联动区
        '   <div id="cmp_link_scroll_<%=this.uuID %>"><% if(this.topPocket){ %><div style="height:<%=this.style.headerH %>px;" class="div-placeholder"></div><% } %>' +
        '       <table id="body_table_link_<%=this.uuID %>" class="table-content2 sidbar" cellpadding="0" cellspacing="0">' +
        '           <tbody>' +
        '           </tbody>' +
        '       </table>' +
        '   </div>' +
        '</div>' +
        '<% if(this.multiLevel){ %>' +                                         //右边进入下一级悬浮按钮联动区
        '<div id="cmp_link_wrapper2_<%=this.uuID %>" class="link-content">' +
        '   <div id="cmp_link_scroll2_<%=this.uuID %>">' +
        '       <% if(this.topPocket){ %><div class="div-placeholder"></div><% } %>' +
        '       <table id="body_table_link2_<%=this.uuID %>" class="table-content2" cellpadding="0" cellspacing="0">' +
        '           <tbody></tbody>' +
        '       </table>' +
        '   </div>' +
        '</div>' +
        '<% } %>'+
        '<% if(this.topPocket){ %> ' +
        '<div class="cmp-pull-top-pocket" style="margin-top: <%=this.style.mt %>px;position: absolute;">' + //下拉刷新区
        '   <div class="cmp-pull">' +
        '       <div class="cmp-pull-loading cmp-icon cmp-spinner active"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
        '       <div class="cmp-pull-caption">' +
        '           <p class="showText tablelist"><%=this.downTips %></p><p class="totalNum little-text subtitle"></p><p class="updateTime little-text subtitle"></p>' +
        '       </div>' +
        '   </div>' +
        '</div>'+
        ' <% } %>'+
        '<% if(this.bottomPocket){ %>' +
        '<div class="cmp-pull-bottom-pocket tablelist">' +  //底部点击加载更多区
        '   <div class="cmp-pull">' +
        '       <div class="cmp-pull-loading cmp-icon cmp-spinner active cmp-hidden"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
        '       <div class="cmp-pull-caption cmp-pull-caption-nomore">' +
        '           <p class="showText tablelist"></p><p class="haveNum little-text"></p>' +
        '       </div>' +
        '  </div>' +
        '</div>' +
        '<% } %>'+
        '<div class="div-cover-up" style="<%=this.style.headerStyle %>;height:<%=this.style.headerH %>px;width:<%=(this.style.pl+1) %>px;"></div>'+
        '</div>';
    /*列表数据模板*/
    var itemHtml = '<% var datas = this.data,fields=this.fields,initNo = this.initNo,fieldsKeys = Object.keys(fields);%>'+
        '<% for(var i = 0;i< datas.length;i++){ %>' +
        '<tr style="height: <%=this.style.rowH %>px;" class="body-tr init-bind <%=this.style.rowClass %>" info=\'<%=cmp.toJSON(datas[i]).escapeHTML() %>\' index="<%=(initNo + (i+1)) %>">'+
        '<% for(var key in fields){  %> <td style="max-height:<%=this.style.rowH %>px;min-height:<%=this.style.rowH %>px;" class="init-render"><% if(datas[i][key]){ %><%=datas[i][key].escapeHTML() %><% }else{ %><%=datas[i][key] %><% } %></td> <% } %>' +
        '</tr>' +
        '<% } %>'+
        '<% if(!this.initFinished && this.loadMoreUI){ %>' +
        '<tr style="height: <%=this.style.placeholderH %>px;" class="table-placeholder"><td colspan="<%=fieldsKeys.length %>" ></td></tr>' +
        '<% } %>';
    var list_lock_img = cmpIMGPath + "/ic_list_lock.png";
    /*左侧边栏（包括显示索引/选择框）模板*/
    var sidebarNumHtml =   '<% var initNo = this.initNo,datas = this.data,type=this.listType,radio=this.listRadio,fieldsKeys = Object.keys(this.fields); %>'+
        '<% for(var i = 0;i<datas.length;i++){ %>' +
        '<tr style="<%=this.style.sidebarStyle %>;height: <%=this.style.rowH %>px;"><td style="width: <%=this.style.sidebarW %>px;"><% if(datas[i].lock){ %><img style="left: <%=this.style.lockImgLeft %>px;" class="cmp-table-list-lock-img" src="'+list_lock_img+'"><% } %><% if(type == 1){ %><%=(initNo + (i+1)) %><% }else if(type == 2){ %> <div style="width:<%=this.style.sidebarW %>px;height:<%=this.style.rowH %>px;" class="cmp-checkbox cmp-checkbox-box table-list"><input info=\'<%=cmp.toJSON(datas[i]).escapeHTML() %>\'  type="checkbox" name="cmp-radio" class="init-bind cmp-icon cmp-icon-checkmarkempty index_<%=(initNo + (i+1)) %>"></div> <% } %></td></tr>' +
        '<% } %>'+
        '<% if(!this.initFinished && this.loadMoreUI){ %>' +
        '<tr style="height: <%=this.style.placeholderH %>px;" class="table-placeholder"><td style="width: <%=this.style.sidebarW %>px;" colspan="<%=fieldsKeys.length %>" ></td></tr>' +
        '<% } %>';
    /*右侧边栏按钮模板*/
    var sidebarBtnHtml = '<% var initNo = this.initNo,datas = this.data,fieldsKeys = Object.keys(this.fields); %>'+
        '<% for(var i = 0;i<datas.length;i++){ %>' +
        '<tr style="height: <%=this.style.rowH %>px;line-height: <%=this.style.rowH %>px;" class="init-bind" info=\'<%=cmp.toJSON(datas[i]) %>\'><td class="arrow"><div style="height: <%=this.style.rowH %>px;" class="cmp-checkbox-box table-list"><span class="cmp-icon cmp-icon-arrowright"></span></div></td></tr>' +
        '<% } %>'+
        '<% if(!this.initFinished && this.loadMoreUI){ %>' +
        '<tr style="height: <%=this.style.placeholderH %>px;" class="table-placeholder"><td colspan="<%=fieldsKeys.length %>" ></td></tr>' +
        '<% } %>';
    //=============================================================联动scroll end=====================================//
})(cmp);