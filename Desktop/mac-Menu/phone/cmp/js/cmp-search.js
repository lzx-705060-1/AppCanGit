;(function (_) {
    if(typeof cmpSearchI18nLoaded == "undefined"){
        _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-search',function(){
            cmpSearchI18nLoaded = true;
            _.event.trigger("cmp-search-init",document);
        },cmpBuildversion);
    }

    //======================================================================搜索公用部分 start============================//
    var searchCache = {};

    //======================================================================公用部分 end============================//
    //===========================================================搜索组件(cmp.search.init) start======================//
    /*** 常用的搜索组件，提供两种类型搜索的切换：<br>*/
    _.search = {};
    /*** 搜索组件的调用方法(标准版)*/
    _.search.init = function (selector, options) {
        searchCache["searchInit"] = new Search(selector, options);
        return searchCache["searchInit"];
    };
    /*** 搜索组件的关闭方法*/
    _.search.init_close = function () {
        if (searchCache["searchInit"]) {
            searchCache["searchInit"].cancelObject();
            searchCache["searchInit"] = null;
        }
    };

    var searchUI = function() {
        var searchUI =
        '<div id="search_container">' +
        '   <div class="cmp-content-none cmp-content  position_relative " >' +
        '       <div class="cmp-search-content">' +
        '           <div class="cmp-segmented-control cmp-search-title">' +
        '   <div class="cmp-search-item" id="cmp_item_piker">' +
        '       <span class="search-title title" id="cmp_search_title"></span>' +
        '       <span class="cmp-icon cmp-icon-arrowdown icon_select"></span>' +
        '       <div class="popover-items display_none"> <div class="tri"></div>' +
        '           <ul class="cmp-search-table-view" id="cmp_items_date">' +
        '           </ul>' +
        '       </div>' +
        '   </div>' +
        '	<div class="cmp-search-item" id="cmp_item_text">' +
        '    <form action="#">' +
        '		<div class="item text cmp-active">' +
        '			<input type="search"/>' +
        '           <span class="see-icon-close-round-fill clear" style="display: none;"></span>' +
        '		</div>' +
        '		<div class="item date">' +
        '			<input class="cmp-search-date_btn" type="search" disabled id="date_start"/>' +
        '			<span>-</span>' +
        '			<input class="cmp-search-date_btn" type="search" disabled id="date_end"/>' +
        '		</div>' +
        '		<div class="item date_day">' +
        '			<input class="cmp-search-date_btn" type="search" disabled />' +
        '		</div>' +
        '    </form>' +
        '	</div>' +
        '	<div class="cmp-search-item">' +
        '		<span class=" gotoSearch" id="cancel">' + _.i18n("cmp.search.cancel") + '</span>' +
        '	</div>' +

        '</div>' +
        '           <div class="cmp-control-content cmp-active">' +
        '               <div class="cmp-scroll-wrapper  " id="historyScroll" >' +
        '               <div class="cmp-scroll">' +
        '                   <ul id="table-view" class="cmp-table-view">' +
        '                   </ul>' +
        '               <div class="cmp-search-clear-history">' +
        '               <span>' + _.i18n("cmp.search.clean") + '</span>' +
        '               </div>' +
        '       </div></div></div></div></div>' +
        '</div>';
        return searchUI;
    };

    /**
     * 构造函数
     * @param selector
     * @param options
     * @constructor
     */
    function Search(options) {
        var self = this;
        self.opts = _.extend({
            id: '',
            model: {
                name: "coordination",
                id: "888888"
            },
            items: options.items ||
            [
                {type: 'text',text: '标题',condition: 1},
                {type: 'text',text: '发起人',condition: 2},
                {type: 'date',text: '创建时间',condition: 3},
                {type: 'date_day',text: '当天时间',condition: 4}
            ],
            TimeQueryControl: options.TimeQueryControl || true,
            dateOptions: options.dateOptions || {"type": "date", "MinutesScale": '1'},
            parameter: null,
            lessTime:options.lessTime || null,
            TimeNow:options.TimeNow || false,
            TimeMin:options.TimeMin || true,
            callback: options.callback || null,
            cancelCallback: options.cancelCallback || null,
            closeCallback:options.closeCallback || null,//关闭组件回调
            initShow:false,//用于判断是否初始化就显示，初始化就显示的话就不对backbutton做处理
            showSearchRecord:true,//是否显示搜索记录
            holdShow:false,//是否保持显示组件
            completeCallback:null//组件渲染完成的回调
        }, options);
        if(!self.opts.initShow){
            _.backbutton.push(_.search.init_close);
        }
        self.items = options.items;
        self.wrapper = null;
        self.SearchCondition = self.opts.items[0];
        if (self.opts.items.length < 1)throw "you must defined search item";
        self.dateOptions = self.opts.dateOptions;
        self.TimeQueryControl = self.opts.TimeQueryControl;
        self.itemMap = {};
        for (var i = 0; i < self.opts.items.length; i++) {
            var condition = self.opts.items[i].condition;
            self.itemMap[condition] = self.opts.items[i];
        }
        self.item = self.opts.items[0];
        if(typeof cmpSearchI18nLoaded == "undefined"){
            document.addEventListener("cmp-search-init",function(){
                self._triggerInit(options);
            });
        }else {
            self._triggerInit(options);
        }
    }
    Search.prototype._triggerInit = function(options){
        var self = this;
        self._initDom(options);

        if(!self.items && self.opts.parameter){   //判断只有一个条件的情况下
            var parameters = self.opts.parameter;
            var cells = [{
                "type":parameters.type,
                "text":parameters.text,
                "condition":parameters.condition
            }];
            self.setItems(cells);
        } else{
            self.setItems(self.opts.items);
        }
        if (self.opts.parameter) {
            self.transmit(self.opts.parameter);
        } else {
            self.SwitchValue();  //self.opts.items[0].text
        }
        self._bindEvent();
        self.historySearch();
        if(self.opts.completeCallback){
            self.opts.completeCallback();
        }
    };
    /**
     * 初始化dom结构
     * @private
     */
    Search.prototype._initDom = function (options) {
        var self = this;
        self.wrapper = document.createElement('div');
        self.wrapper.className = "Animated-Container right-go animated cmp-searchInit";
        self.wrapper.innerHTML = _.tpl(searchUI(), self.opts);
        self.wrapper.style.backgroundColor = "#efeff4";
        self.wrapper.style.height = CMPFULLSREENHEIGHT +'px';
        document.body.appendChild(this.wrapper);

        self.control = self.wrapper.querySelector('.cmp-control-content');
        self.searchTitle = self.wrapper.querySelector("#cmp_search_title");
        self.cmp_search_title = self.wrapper.querySelector(".cmp-search-title");
        self.popover_items = self.wrapper.querySelector(".popover-items");  //选择items
        self.searchItemsDate = self.wrapper.querySelector("#cmp_items_date");  //选择items
        self.table_View = self.wrapper.querySelector("#table-view");  // 记录容器
        self.searchContentView = self.wrapper.querySelector("#cmp_item_text");
        self.searchTextContentView = self.searchContentView.querySelector(".text");
        self.searchDateContentView = self.searchContentView.querySelector(".date");
        self.searchDateContentViewDay = self.searchContentView.querySelector(".date_day");
        self.clearInputTextBtn = self.searchTextContentView.querySelector(".clear");
        self.clearHistoryText = self.wrapper.querySelector('.cmp-search-clear-history');

        self.textInput = self.searchTextContentView.querySelector('input'); //文本的文本框
        self.dataInputs = self.searchDateContentView.querySelectorAll('input'); //时间的文本框
        self.dataInputsDate_day = self.searchDateContentViewDay.querySelector('input'); //时间的文本框
        self.cancel = self.wrapper.querySelector("#cancel");
        self.wrapper.classList.add('cmp-active');
        self.key =_.member.name +'_'+ self.opts.model.name + '_' + self.opts.model.id;
        var content = self.wrapper.querySelector('.cmp-content');
        if (cmp.os.ios && !_.platform.wechat) {
            // var topValue = 20;
            // if(/(iphonex)/i.test(navigator.userAgent)) topValue=40;
            // content.style.top = topValue + "px";
        } else if (cmp.platform.wechat || cmp.os.android) {
            content.style.top = "0";
        }
        var datas;
        if (_.member.name) {
            self.historyDatas(self.key);
            datas = self.getHistory(self.key);
        }
        self.clearHistoryText.style.display = (datas == null || datas == "" || !self.opts.showSearchRecord) ? "none" : "inline-block";
        self.control.style.height = window.innerHeight - self.cmp_search_title.offsetHeight + "px";
        if((self.items && self.items.length == 1) || (!self.items && self.opts.parameter)){
            var icon_select = self.wrapper.querySelector(".icon_select");
            icon_select.style.display='none';
        };

    };
    /**
     * 默认传递的参数，对应参数加载条件搜索
     * @private
     */
    Search.prototype.transmit = function (opts) {
        var self = this;
        self.item.condition = opts.condition;
        self.item.text = opts.text;
        self.item.type = opts.type;
        var type = opts.type;
        self.searchTitle.innerText = opts.text;  //默认选择列表的值
        self.searchTitle.setAttribute("type", opts.type);
        var textInput = self.textInput; //文本的文本框
        var dateInputs = self.dataInputs; //时间的文本框
        var values = opts.value;
        self.SwitchSelect(type);
        if (isArray(values) && values.length > 1) {
            if ((values[0] == "" && values[1] == "") || (values[0] == null && values[1] == null)) {
                self.SwitchValue(); //type
            }
        }
        else if (!self.isNull(values) && isString(values)) {
            textInput.value = values; //传递的默认搜索框的值
            textInput.focus();
        } else if (self.isNull(values) || values == null) {
            self.SwitchValue();  //self.searchTitle.innerHTML
        }
        if(dateInputs && (isArray(values) && values.length > 1) ){
            dateInputs[0].value = values[0] ? values[0]:'';
            dateInputs[1].value = values[1] ? values[1]:'';
        }
        function isArray(obj) {return (typeof obj == 'object') && obj.constructor == Array;}
        function isString(str) {return (typeof str == 'string') && str.constructor == String;}
    };
    /**
     * 绑定事件
     * @private
     */
    Search.prototype._bindEvent = function () {
        var self = this;
        //时间按钮
        var textInput = self.textInput; //文本的文本框
        var dateInputs = self.dataInputs; //文本的文本框
        var dateInputsDate_day = self.dataInputsDate_day; //一个时间的文本

        _.event.click(self.searchTitle, function () {
            if(self.opts.items.length == 1)return;
            if(!self.items && self.opts.parameter)return;
            self.popover_items.classList.remove('display_none');
            self.popover_items.style.width = window.innerWidth +"px";
            if(!self.wrapper.querySelector('.cmp-backdrop')){
                var backdrap = document.createElement('div');
                backdrap.className = "cmp-backdrop searchTitleGround";
                backdrap.style.backgroundColor='rgba(0, 0, 0, 0.31)';
                backdrap.style.width = window.innerWidth +'px';
                backdrap.style.height = CMPFULLSREENHEIGHT -49 +'px';
                backdrap.style.top = self.cmp_search_title.offsetHeight-10+"px";
                backdrap.style.bottom = "inherit";
                backdrap.style.zIndex = 9;
                var searchParent = self.searchTitle.parentNode;
                var searchTitleParentNodes = searchParent.childNodes;
                searchParent.insertBefore(backdrap,searchTitleParentNodes[searchTitleParentNodes.length-2]);
                backdrap.addEventListener('click',function(){
                    self.popover_items.classList.add('display_none');
                    backdrap.remove();
                },false);
            }

        }, false);
        //点击选择项
        _(self.popover_items).on('click', 'li', function () {
            var condition = this.getAttribute("condition");
            var text = this.getAttribute("text");
            var type = this.getAttribute("type");
            self.SearchCondition = {condition: condition, text: text, type: type };
            self.searchTitle.innerHTML = this.innerHTML;
            self.popover_items.classList.add('display_none');
            self.searchTitle.setAttribute("type", type);
            var searchTitleGround = document.querySelector('.searchTitleGround');
            if(searchTitleGround){
                searchTitleGround.remove();
            }
            self.SwitchSelect(type);
            self.SwitchValue();
        });

        textInput.addEventListener('input', function () {
            if (textInput.value != "") {
                self.clearInputTextBtn.style.display = "inline-block";
            }
        }, false);
        //清空历史记录
        self.clearHistoryText.addEventListener('click', function () {
            self.table_View.innerHTML = "";
            _.storage.delete(self.key);
            self.clearHistoryText.style.display = 'none';
        }, false);

        //给取消按钮绑定事件
        _.event.click(self.cancel,function(){
            var closeCallback = self.opts.closeCallback;
            if (closeCallback && typeof closeCallback == "function")closeCallback();
            textInput.blur();
            self.cancelObject();
        });
        //给文本清除按钮绑定事件
        self.clearInputTextBtn.addEventListener('click', function () {
            var inputs = self.searchContentView.querySelector(".item.text").querySelector("input");
            inputs.value = "";
        }, false);

        //给日期文本绑定事件
        _.each(dateInputs, function (i, btn) {
            btn.addEventListener('touchend', function () {
                var options = self.dateOptions;
                self.picker = new _.DtPicker(options);
                var picker=self.picker,TimeReg = /^(\d{4})-(\d{2})-(\d{2})$/,ThatValue = btn.value;
                picker.setSelectedValue(btn.value);
                picker.show(function (rs) {
                    btn.value = rs.value;
                    var ThatTime = new Date();
                    if (self.TimeQueryControl) {
                        if(dateInputs[0].value || dateInputs[1].value) {
                            if(self.opts.lessTime){
                                if((new Date(dateInputs[0].value)<ThatTime) || (new Date(dateInputs[1].value)<ThatTime)){
                                    //开始时间小于当前时间的话
                                    self.lessTimeconfirm();
                                }else{
                                    self.notification(_.i18n("cmp.search.beginSearch"));
                                }
                            }else{
                                self.notification(_.i18n("cmp.search.beginSearch"));
                            }
                        }
                    } else {
                        if(dateInputs[0].value && dateInputs[1].value) {
                            if(self.opts.lessTime){
                                if( (new Date(dateInputs[0].value)<ThatTime) ){
                                    //开始时间小于当前时间的话
                                    self.lessTimeconfirm();
                                }else{
                                    self.notification(_.i18n("cmp.search.beginSearch"));
                                }
                            }else{
                                self.notification(_.i18n("cmp.search.beginSearch"));
                            }
                        }
                    }
                }, function () {
                    btn.value = "";
                    if (!TimeReg.test(btn.value))btn.value = ThatValue;
                });
            }, false);
        });
        if(dateInputsDate_day){
            dateInputsDate_day.addEventListener('touchend',function(){
                var obj = this;
                var options = self.dateOptions;
                self.picker = new _.DtPicker(options);
                var picker=self.picker,TimeReg = /^(\d{4})-(\d{2})-(\d{2})$/,ThatValue = obj.value;
                picker.setSelectedValue(obj.value);
                picker.show(function (rs) {
                    obj.value = rs.value;
                    self.notification(_.i18n("cmp.search.beginSearch"));
                }, function () {
                    obj.value = "";
                    if (!TimeReg.test(obj.value))obj.value = ThatValue;
                });
            },false);
        }

        //绑定监听事件
        self.addEventSearch(textInput);
    };

    Search.prototype.lessTimeconfirm = function(){
        var self=this;
        _.notification.confirm(self.opts.lessTime, function (index) {
            if (index == 0) {
                if(self.opts.TimeMin){
                    self.doSearch(13);
                }
            }
        }, '', [_.i18n("cmp.search.ok")]);
    };
    Search.prototype.notification = function(title){
        var self=this;
        var cancelCallback = self.opts.cancelCallback;
        _.notification.confirm(title, function (index) {
            if (index == 1) {
                self.doSearch(13);
            } else {
                if (cancelCallback && typeof cancelCallback == "function") cancelCallback();
            }
        }, '', [_.i18n("cmp.search.cancel"), _.i18n("cmp.search.ok")]);
    };

    Search.prototype.compareNewTime = function(startTime){
        var self=this;
        var NewDate;
        NewDate = new Date();
        var Year = NewDate.getFullYear();
        var Month = NewDate.getMonth() + 1;
        var Day = NewDate.getDate();
        Month = Month < 10 ? '0' + Month : Month;
        Day = Day < 10 ? '0' + Day : Day;
        var ThatTime = Year + Month + Day;
        var startValue = startTime.replace('-','').replace('-','').replace('-','');
        if(parseInt(startValue) < parseInt(ThatTime) ){
            return true;
        }else{
            return false;
        }

    };
    Search.prototype.isNull = function (str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    };
    Search.prototype.cancelObject = function () {
        var self = this;
        if(!self.opts.holdShow){
            self.wrapper.classList.remove('cmp-active');
            setTimeout(function () {
                self.wrapper.remove();
                self = null;
            }, 300);
            if(!self.opts.initShow){
                _.backbutton.pop();
            }
        }

    };
    Search.prototype.addEventSearch = function (event) {
        var self = this;
        if (event) {
            event.addEventListener('keyup', function search(e) {
                self.doSearch(e.keyCode);
            }, false);
        }
    };
    Search.prototype.doSearch = function (e) {
        var self = this;
        if (e == 13) {
            var inputs = self.searchContentView.querySelector(".cmp-active").querySelectorAll("input");
            var textInput = self.textInput; //文本的文本框
            //var searchKey = [inputs[0].value.escapeHTML()];   //.replace(/\s/ig,'') 去掉所以空格
            var searchKey = [inputs[0].value];   //.replace(/\s/ig,'') 去掉所以空格
            //var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  //中文匹配
            //var TimeReg = new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");  //日期格式
            var patrn=/[`~!@#$%^&*()_+<>?"{},.\/;'[\]]/im; //非法字符
            if (inputs && inputs.length > 1) {   //对时间条件的操作
                if ((inputs[0].value == "" || self.isNull(inputs[0].value)) && inputs[1].value != "") {   // 第一种情况  第一个文本框没有值得话 但是第二个文本框有值
                    inputs[0].value = "";
                } else if (inputs[1].value == "" || inputs[1].value == " " || self.isNull(inputs[1].value)) {   //第二种情况 第二个文本框没有值得话
                    if(self.opts.TimeNow){
                        inputs[1].value ='';
                    }else{
                        var NewDate;
                        NewDate = new Date();
                        if(new Date(inputs[0].value) > NewDate ){   //开始时间大于当前日期的话
                            _.notification.toast(_.i18n("cmp.search.warningMsgStart"), "top");
                            return;
                        }else{  //自动填充当前日期
                            var Year = NewDate.getFullYear();
                            var Month = NewDate.getMonth() + 1;
                            var Day = NewDate.getDate();
                            Month = Month < 10 ? '0' + Month : Month;
                            Day = Day < 10 ? '0' + Day : Day;
                            var Time = Year + '-' + Month + '-' + Day;
                            inputs[1].value = Time;
                        }
                    }
                }
                else if ((inputs[0].value == "") && (inputs[1].value = "")) {  //开始时间和结束时间都为空的话
                    _.notification.toast(_.i18n("cmp.search.warningMsg"), "top");
                    return;
                }
                else if ( (inputs[1].value != new Date()) && (inputs[1].value < inputs[0].value) ) { //结束时间小于开始时间
                    _.notification.toast(_.i18n("cmp.search.warningMsgStart"), "top");
                    return;
                }
                else if(patrn.test(inputs[0].value) && patrn.test(inputs[1].value)){
                    _.notification.toast(_.i18n("cmp.search.formatError"), "top");
                    return;
                }
                searchKey = (inputs != "" && inputs.length > 0) ? inputs[0].value + "," + inputs[1].value : inputs[0].value;
                searchKey = searchKey.split(',');
            }
            var keyObj;
            keyObj = (searchKey.length > 1) ? {search1:searchKey[0],search2:searchKey[1]} : searchKey;
            var callbackResult = {
                item: self.SearchCondition,
                searchKey: searchKey
            };
            var listEach = {
                text: self.SearchCondition.text,
                type: self.SearchCondition.type,
                searchKey: keyObj,
                condition: self.SearchCondition.condition
            };
            textInput.blur();
            if(_.member.name + _.serverIp){
                if(!self.isNull(listEach.searchKey))self.saveHistory(self.key, listEach);
            }
            self.opts.callback && self.opts.callback(callbackResult);
            self.cancelObject();

        }
    };
    Search.prototype.SwitchValue = function () {
        var self = this;
        var input = self.searchTextContentView.querySelector('input');
        input.value = "";
        input.placeholder = _.i18n("cmp.search.SearchConditionThe") + self.searchTitle.innerHTML + _.i18n("cmp.search.SearchConditionSearch");
    };
    Search.prototype.SwitchSelect = function (type) {
        var self = this;
        if (type == "text") {
            self.searchDateContentView.classList.remove("cmp-active");
            self.searchDateContentViewDay.classList.remove('cmp-active');
            self.searchTextContentView.classList.add("cmp-active");
        } else if (type == "date") {
            self.searchTextContentView.classList.remove("cmp-active");
            self.searchDateContentViewDay.classList.remove('cmp-active');
            self.searchDateContentView.classList.add("cmp-active");
        }else if(type == "date_day"){
            self.searchTextContentView.classList.remove("cmp-active");
            self.searchDateContentView.classList.remove("cmp-active");
            self.searchDateContentViewDay.classList.add('cmp-active');
        }
    };
    Search.prototype.historySearch = function () {
        var self = this;
        if (self.table_View_list) {
            _.each(self.table_View_list, function (i, list) {
                list.addEventListener('click',function(){
                    if(self.picker){
                        self.picker.hide();
                    }
                    var searchKey= self.getHistory(self.key)[i].searchKey;
                    var type = this.getAttribute('type');
                    var condition = this.getAttribute('condition');
                    var text = this.getAttribute('text');
                    var str;
                    if (type == "text") {
                        str = searchKey;
                    } else if (type == "date") {
                        str =[ searchKey.search1 , searchKey.search2 ] ;
                    }else if(type == "date_day"){
                        str = searchKey;
                    }
                    var historyback = {
                        type: type,
                        condition: condition,
                        text: text
                    };
                    var callbackResult = {
                        item: historyback,
                        searchKey: str
                    };
                    if(historyback.type=="date" && self.opts.lessTime){
                        if(  self.compareNewTime(searchKey.search1)  ){
                            if(self.opts.TimeAlert){
                                _.notification.confirm(self.opts.lessTime, function (index) {
                                    if (index == 1) {
                                        if(self.opts.TimeMin){
                                            self.opts.callback && self.opts.callback(callbackResult);
                                            self.cancelObject();
                                        }
                                    }
                                }, '', [_.i18n("cmp.search.ok")]);
                            }else{
                                _.notification.confirm(self.opts.lessTime, function (index) {
                                    if (index == 1) {
                                        self.opts.callback && self.opts.callback(callbackResult);
                                        self.cancelObject();
                                    }else{
                                        if (self.cancelCallback && typeof self.cancelCallback == "function")self.cancelCallback();
                                    }
                                }, '', [_.i18n("cmp.search.cancel"), _.i18n("cmp.search.ok")]);
                            }

                        }else{
                            self.opts.callback && self.opts.callback(callbackResult);
                            self.cancelObject();
                        }
                    }else{
                        self.opts.callback && self.opts.callback(callbackResult);
                        self.cancelObject();
                    }
                },false);
            });
        }
    };
    Search.prototype.historyDatas = function (key) {
        var self = this;
        var datas = self.getHistory(key);
        if (!datas || datas.length == 0)return;
        var i = 0, lens = datas.length;
        var date1,date2,DatasTime;
        for (i; i < lens; i++) {
            date1=datas[i].searchKey.search1;
            date2=datas[i].searchKey.search2;
            DatasTime = (isArray(datas[i].searchKey)) ? datas[i].searchKey[0].escapeHTML() :  date1 + '-' + date2 ;
            var lis = '<li class="cmp-table-view-cell" text=' + datas[i].text + ' type=' + datas[i].type + ' condition=' + datas[i].condition + ' style="line-height: 0;">' +
                '<div class="cmp-icon see-icon-searchhistory icon-time"></div>' +
                '<div class="datas"> <div class="text cmp-ellipsis">' + datas[i].text + '</div>:&nbsp;&nbsp;<div class="value cmp-ellipsis">' + DatasTime + '</div></div> ' +
                '<span class="cmp-icon see-icon-gosearchhistory icon-key"></span>' +
                '</li>';
            if(_.member.name + _.serverIp){
                _.append(self.table_View, lis);
            }
        }
        function isArray(obj){
            return (typeof obj=='object')&&obj.constructor==Array;
        }
    };
    Search.prototype.getHistory = function (key) {
        var historys = [];
        var historyVal = _.storage.get(key);
        if (historyVal) {
            historys = _.parseJSON(historyVal);
        }
        return historys;
    };
    Search.prototype.saveHistory = function (key, value) {
        var self = this;
        var historys = self.getHistory(key);
        if (historys && historys.length > 0) {
            if (!historys.inArray(value)) {   //如果包含
                historys.unshift(value);
                if (historys.length > 5) {
                    historys.pop();
                }
                historys = _.toJSON(historys);
                _.storage.save(key, historys);
            }

        } else {
            historys.push(value);
            historys = _.toJSON(historys);
            _.storage.save(key, historys);
        }

    };
    Search.prototype.setItems = function (items) {
        if (!items || items.length <= 0) return;
        var self = this, i = 0, LiLens = items.length;
        var item='';
        for (i; i < LiLens; i++) {
            item +='<li class="cmp-search-table-view-cell" text ="'+items[i].text+'" type="'+items[i].type+'" condition="'+items[i].condition+'">'+items[i].text +'</li>';
        }
        self.searchItemsDate.innerHTML = item;
        self.searchTitle.innerHTML = items[0].text;
        self.searchTitle.setAttribute("type", items[0].type);
        self.table_View_list = self.table_View.querySelectorAll('.cmp-table-view-cell'); //记录容器列表
        self.SwitchSelect(items[0].type);
    };


    //===========================================================搜索组件(cmp.search.init) end=========================//

    //模版字符串
    var subSearchUI = function() {
        var subSearchUI =
        '   <div class="cmp-search-item" id="cmp_item_piker">' +
        '       <span class="search-title" id="cmp_search_title"></span>' +
        '       <span class="cmp-icon cmp-icon-arrowdown icon_select"></span>' +
        '       <div class="popover-items display_none"> <div class="tri"></div>' +
        '           <ul class="cmp-search-table-view" id="cmp_items_date">' +
        '           <% for(var i = 0;i<this.length;i++){ %>' +
        '           <li value="<%=i %>" type="<%=this[i].value %>"><%=this[i].text %></li>' +
        '           <% } %>' +
        '           </ul>' +
        '       </div>' +
        '   </div>' +
        '	<div class="cmp-search-item" id="cmp_item_text">' +
        ' <form action="#">' +
        '		<div class="item text cmp-active">' +
        '			<input type="search"/>' +
        '		</div>' +
        '		<div class="item date">' +
        '			<input  class="cmp-search-date_btn" disabled type="search" id="date_start"/>' +
        '			<span>-</span>' +
        '			<input  class="cmp-search-date_btn" disabled type="search" id="date_end"/>' +
        '		</div>' +
        '</form>' +
        '	</div>' +
        '	<div class="cmp-search-item">' +
        '		<span class=" gotoSearch subSearch" id="cmp_gotoSearch_btn">' + _.i18n("cmp.search.cancel") + '</span>' +
        '	</div>';
        return subSearchUI;
    };



    /**
     * 构造函数
     * @param selector
     * @param options
     * @constructor
     */
    function subSearch(selector, options) {
        this.wrapper = (typeof selector == "object") ? selector : document.querySelector(selector);
        this.callback = options.callback || null;
        this.dateOptions = {"type": "date"};
        var items = options.items || [{
                value: 'text',
                text: '标题',
                condition: 1
            }, {
                value: 'text',
                text: '发起人',
                condition: 2
            }, {
                value: 'date',
                text: '创建时间',
                condition: 3
            }];
        this.items = items;
        this._initDom(options);
        this._bindEvent(options);
        this._initSetItems(items);
        //this._initSearchContent();
    }

    /**
     * 初始化dom结构
     * @private
     */
    subSearch.prototype._initDom = function (options) {
        this.wrapper.innerHTML = cmp.tpl(subSearchUI(), options.items);
        this.searchTitle = this.wrapper.querySelector("#cmp_search_title");

        this.searchContentView = this.wrapper.querySelector("#cmp_item_text");
        this.searchTextContentView = this.searchContentView.querySelector(".text");
        this.searchDateContentView = this.searchContentView.querySelector(".date");

        this.searchBtn = this.wrapper.querySelector("#cmp_gotoSearch_btn");
        this.searchDateBtns = this.wrapper.querySelectorAll(".cmp-search-date_btn");
        if (options.items.length == 1) {  //只有一个默认的搜索条件的情况
            var itemPicker = this.wrapper.querySelector("#cmp_item_piker");
            var itemText = this.wrapper.querySelector("#cmp_item_text");
            itemPicker.style.display = "none";
            itemText.style.width = "90%";
        }
        _.RefreshHeader();
        //this.searchContentWrapper = this.wrapper.querySelector(".cmp-scroll-wrapper");
        //this.searchContentScroller = this.searchContentWrapper.querySelector(".cmp-list-content");

    };

    /**
     * 绑定事件
     * @private
     */
//    var documentBodyKeyUpBinded = false;//避免全局事件重复绑定
    subSearch.prototype._bindEvent = function (options) {
        var self = this;
        self.documentBodyKeyUpBinded = false;//避免全局事件重复绑定
        var TextInput = self.searchTextContentView.querySelector('input');

        var basicBgDiv,popover_items;
        //给选择Item绑定点击选择事件
        self.wrapper.querySelector("#cmp_item_piker").addEventListener('tap', function (e) {
            e.stopPropagation();
            var ThatTitleValue = self.searchTitle.innerText;
            TextInput.blur();
            if(!self.wrapper.querySelector('.searchTitleGround')){
                basicBgDiv = document.createElement('div');
                basicBgDiv.classList.add('search-backdrap');
                basicBgDiv.classList.add('searchTitleGround');
                basicBgDiv.style.backgroundColor='rgba(0, 0, 0, 0.31)';
                basicBgDiv.style.width = window.innerWidth +'px';
                basicBgDiv.style.height = CMPFULLSREENHEIGHT -60 +'px';
                basicBgDiv.style.top ="39px";
                basicBgDiv.style.bottom = "inherit";
                basicBgDiv.style.zIndex = 8;
                basicBgDiv.style.position = "absolute";
                var searchParent = self.searchTitle.parentNode;
                searchParent.appendChild(basicBgDiv);
                popover_items  = this.querySelector('.popover-items');
                popover_items.style.width = window.innerWidth+"px";
                popover_items.classList.remove('display_none');
            }
            cmp.event.click(basicBgDiv,function(){
                popover_items.classList.add('display_none');
                basicBgDiv.remove();
            });
            //点击选择项
            _(popover_items).on('click', 'li', function () {
                if (this.getAttribute("value") != ThatTitleValue) {
                    TextInput.value = '';
                }
                var BgDiv = document.querySelector('.search-backdrap');
                if(BgDiv)BgDiv.remove();
                var itemIndex  = parseInt(this.getAttribute("value"));
                self.searchCurrentItem = self.items[itemIndex];
                self.searchTitle.innerText = this.innerText;
                if (this.getAttribute("type") == "text") {
                    self.searchDateContentView.classList.remove("cmp-active");
                    self.searchTextContentView.classList.add("cmp-active");
                } else if (this.getAttribute("type") == "date") {
                    self.searchTextContentView.classList.remove("cmp-active");
                    self.searchDateContentView.classList.add("cmp-active");
                }
                popover_items.classList.add('display_none');
            });
        }, false);

        var textItemInput = self.searchContentView.querySelector("input[type=search]");
        //给搜索按钮绑定事件
        self.searchBtn.addEventListener("tap", function () {
            textItemInput.blur();
            if(!options.initShow){
                _.backbutton.pop();
            }
            setTimeout(function(){
                var basicDiv = document.querySelector('.cmp-accDoc-basicDiv-search');
                if(basicDiv){
                    basicDiv.classList.remove('cmp-active');
                    var listContent = basicDiv.querySelector(".cmp-list-content");
                    if(listContent && listContent.children.length > 0){
                        listContent.innerHTML = "";
                    }
                    _.each(basicDiv.getElementsByTagName("input"),function(index,item){
                        item.value = "";
                    });
                    var noDataDiv = basicDiv.querySelector(".StatusContainer");
                    if(noDataDiv) noDataDiv.remove();
                    _.event.trigger("searchUIClose",document);
                };
                
            },200);
            //_doSearch();
        }, false);
        if (!self.documentBodyKeyUpBinded) {
            textItemInput.addEventListener("keyup", _doKeyUp, false);
            self.documentBodyKeyUpBinded = true;
        }

        function _doKeyUp(e) {
            if (e.keyCode == 13) {
                e.target.blur();
                _doSearch();
            }
        }

        function _doSearch() {
            var inputs = self.searchContentView.querySelector(".cmp-active").querySelectorAll("input");
            var searchKey = [inputs[0].value.replace(/\s/ig, '')];
            if (inputs && inputs.length > 1) {
                searchKey.push(inputs[1].value);
                if (new Date(inputs[1].value) < new Date(inputs[0].value)) {
                    _.notification.toast(_.i18n("cmp.search.warningMsg"), "top");
                    return;
                }
            }
            var callbackResult = {
                item: self.searchCurrentItem,
                searchKey: searchKey
            };

            self.callback && self.callback(callbackResult);
        }

        //给日期文本绑定事件
        cmp.each(self.searchDateBtns, function (i, btn) {
            btn.addEventListener('tap', function () {
                var options = self.dateOptions;
                var picker = new cmp.DtPicker(options);
                //设置默认值
                picker.setSelectedValue(btn.value);
                picker.show(function (rs) {
                    btn.value = rs.value;
                    if(self.searchDateBtns[1].value){
                        _doSearch();
                    }
                    picker.dispose();
                }, function () {
                    btn.value = "";
                });
            }, false);
        });

    };

    /**
     * 设置可选择的items
     * @param items
     */
    subSearch.prototype._initSetItems = function (items) {
        if (!items || items.length <= 0) return;
        var self = this;
        self.searchCurrentItem = items[0];
        self.searchTitle.innerText = items[0].text;
    };
    /**
     * 搜索组件的调用方法
     * @method init
     * @namespace cmp.search
     */
    _.search.sub = function (selector, options) {
        return new subSearch(selector, options);
    };
})(cmp);