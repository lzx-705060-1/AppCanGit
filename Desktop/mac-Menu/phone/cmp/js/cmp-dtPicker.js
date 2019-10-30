/**
 * 日期时间插件
 * varstion 1.0.5
 * by ms
 * Houfeng@DCloud.io
 */
(function($, document) {
    var CMP_DTPICKER_I18N_LOADED = false;
    $.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-dtPicker',function(){
        CMP_DTPICKER_I18N_LOADED = true;
        $.event.trigger("cmp-dtPicker-init",document);
        $.event.trigger("cmp-dtPicker-show",document);
    },cmpBuildversion);
    //创建 DOM
    $.dom = function(str) {
        if (typeof(str) !== 'string') {
            if ((str instanceof Array) || (str[0] && str.length)) {
                return [].slice.call(str);
            } else {
                return [str];
            }
        }
        if (!$.__create_dom_div__) {
            $.__create_dom_div__ = document.createElement('div');
        }
        $.__create_dom_div__.innerHTML = str;
        return [].slice.call($.__create_dom_div__.childNodes);
    };
    //<div class="cmp-dtpicker-title">\
    //<h5 data-id="title-y">年</h5><h5 data-id="title-m">月</h5><h5 data-id="title-d">日</h5>\
    //<h5 data-id="title-h">时</h5><h5 data-id="title-i">分</h5>\
    //</div>\

    var domBuffer = function() {
        var domBuffer = '<div class="cmp-dtpicker" data-type="datetime">\
                <div class="cmp-dtpicker-header">\
                    <button data-id="btn-cancel" class="cmp-btn cmp-poppicker-btn-cancel">' + $.i18n("cmp.dtPicker.cancel") + '</button>\
			<button data-id="btn-ok" class="cmp-btn cmp-btn-blue cmp-poppicker-btn-ok">' + $.i18n("cmp.dtPicker.ok") + '</button>\
		</div>\
		<div class="cmp-dtpicker-body">\
		<div class="cmp-picker-hr cmp-picker-hr-top"></div><div class="cmp-picker-hr cmp-picker-hr-bottom"></div>\
			<div data-id="picker-y" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-m" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-d" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-h" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-i" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-hTwo" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
			<div data-id="picker-iTwo" class="cmp-picker">\
				<div class="cmp-picker-inner">\
					<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
					<ul class="cmp-pciker-list">\
					</ul>\
					<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
				</div>\
			</div>\
		</div>\
	</div>';
        return domBuffer;
    };

    //plugin
    var DtPicker = $.DtPicker = $.Class.extend({
        init:function(options){
            var self = this;
            if(!CMP_DTPICKER_I18N_LOADED){
                document.addEventListener("cmp-dtPicker-init",function(){
                    self._doInit(options);
                });
            }else {
                self._doInit(options)
            }
        },
        _doInit: function(options) {
            var self = this;
            self.options = options;
            var _picker = $.dom(domBuffer())[0];
            document.body.appendChild(_picker);
            $('[data-id*="picker"]', _picker).picker();
            self.ui  = {
                picker: _picker,
                mask: $.createMask(),
                ok: $('[data-id="btn-ok"]', _picker)[0],
                cancel: $('[data-id="btn-cancel"]', _picker)[0],
                y: $('[data-id="picker-y"]', _picker)[0],
                m: $('[data-id="picker-m"]', _picker)[0],
                d: $('[data-id="picker-d"]', _picker)[0],
                h: $('[data-id="picker-h"]', _picker)[0],
                i: $('[data-id="picker-i"]', _picker)[0],
                hTwo: $('[data-id="picker-hTwo"]', _picker)[0],
                iTwo: $('[data-id="picker-iTwo"]', _picker)[0],
                labels: $('[data-id*="title-"]', _picker)
            };
            cmp.event.click(self.ui.cancel,function(e){
                e.stopPropagation();
                self.cancelCallback && self.cancelCallback();
                self.hide();
            });
            cmp.event.click(self.ui.ok,function(e){
                e.stopPropagation();
                self.callback(self.getSelected());
                self.hide();
            });
            cmp.event.click(self.ui.mask[0],function(e){
                e.stopPropagation();
                e.stopPropagation();
                self.hide();
            });
            self.ui.y.addEventListener('change', function() {
                self._createDay();
            }, false);
            self.ui.m.addEventListener('change', function() {
                self._createDay();
            }, false);
            self._create(options);
            //防止滚动穿透
            self.ui.picker.addEventListener('touchstart',function(event){
                event.preventDefault();
            },false);
            self.ui.picker.addEventListener('touchmove',function(event){
                event.preventDefault();
            },false);
        },

        getSelected: function() {
            var self = this;
            var ui = self.ui;
            var type = self.options.type;
            var selected = {
                value:null,
                text:null,
                type: type,
                y: ui.y.picker.getSelectedItem(),
                m: ui.m.picker.getSelectedItem(),
                d: ui.d.picker.getSelectedItem(),
                h: ui.h.picker.getSelectedItem(),
                i: ui.i.picker.getSelectedItem(),
                hTwo: ui.hTwo.picker.getSelectedItem(),
                iTwo: ui.iTwo.picker.getSelectedItem(),
                toString: function() {
                    return this.value;
                }
            };
            switch (type) {
                case 'datetime':
                    if(selected){
                        if(selected.y && selected.m && selected.d && selected.h && selected.i){
                            if(selected.y.value && selected.m.value && selected.d.value && selected.h.value && selected.i.value){
                                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value + ':' + selected.i.value;
                                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text + ':' + selected.i.text;
                            }
                        }
                    }
                    break;
                case 'date':
                    if(selected){
                        if(selected.y && selected.m && selected.d){
                            if(selected.y.value && selected.m.value && selected.d.value){
                                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value;
                                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text;
                            }
                        }
                    }
                    break;
                case 'time':
                    if(selected){
                        if(selected.h && selected.i){
                            if(selected.h.value || selected.i.value){
                                selected.value = selected.h.value + ':' + selected.i.value;
                                selected.text = selected.h.text + ':' + selected.i.text;
                            }
                        }
                    }
                    break;
                case 'month':
                    if(selected){
                        if(selected.y && selected.m){
                            if(selected.y.value ||selected.m.value){
                                selected.value = selected.y.value + '-' + selected.m.value;
                                selected.text = selected.y.text + '-' + selected.m.text;
                            }
                        }
                    }
                    break;
                case 'hour':
                    if(selected){
                        if(selected.y && selected.m && selected.d && selected.h){
                            if(selected.y.value ||selected.m.value || selected.d.value || selected.h.value){
                                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value;
                                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text;
                            }
                        }
                    }
                    break;
                case 'timeInterval':
                    if(selected){
                        if(selected.h && selected.i && selected.hTwo && selected.iTwo){
                            if(selected.h.value || selected.i.value || selected.hTwo.value || selected.iTwo.value){
                                selected.value = selected.h.value + ':' + selected.i.value + '-' + selected.hTwo.value + ':' + selected.iTwo.value;
                                selected.text = selected.h.text + ':' + selected.i.text + '-' + selected.hTwo.text + ':' + selected.iTwo.text;
                            }
                        }
                    }
                    break;
            }
            return selected;
        },
        setSelectedValue: function(value) {
            var self = this;
            var ui = self.ui;
            var parsedValue = self._parseValue(value);
            ui.y.picker.setSelectedValue(parsedValue.y, 0);
            ui.m.picker.setSelectedValue(parsedValue.m, 0);
            ui.d.picker.setSelectedValue(parsedValue.d, 0);
            ui.h.picker.setSelectedValue(parsedValue.h, 0);
            ui.i.picker.setSelectedValue(parsedValue.i, 0);
            ui.hTwo.picker.setSelectedValue(parsedValue.hTwo, 0);
            ui.iTwo.picker.setSelectedValue(parsedValue.iTwo, 0);
        },
        isLeapYear: function(year) {
            return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        },
        _inArray: function(array, item) {
            for (var index in array) {
                var _item = array[index];
                if (_item === item) return true;
            }
            return false;
        },
        getDayNum: function(year, month) {
            var self = this;
            if (self._inArray([1, 3, 5, 7, 8, 10, 12], month)) {
                return 31;
            } else if (self._inArray([4, 6, 9, 11], month)) {
                return 30;
            } else if (self.isLeapYear(year)) {
                return 29;
            } else {
                return 28;
            }
        },
        _fill: function(num) {
            num = num.toString();
            if (num.length < 2) {
                num = 0 + num;
            }
            return num;
        },
        _createYear: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成年列表
            var yArray = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.y) {
                        yArray = options.customData.y;
                    }else{
                        var yBegin = options.beginYear;
                        var yEnd = options.endYear;
                        for (var y = yBegin; y <= yEnd; y++) {
                            yArray.push({
                                text: y + ''+$.i18n("cmp.dtPicker.year")+'',
                                value: y
                            });
                        }
                    }
                }
            }
            ui.y.picker.setItems(yArray);
            //ui.y.picker.setSelectedValue(current);
        },
        _createMonth: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成月列表
            var mArray = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.m) {
                        mArray = options.customData.m;
                    }else{
                        for (var m = 1; m <= 12; m++) {
                            var val = self._fill(m);
                            mArray.push({
                                text: val + ''+$.i18n("cmp.dtPicker.month"),
                                value: val
                            });
                        }
                    }
                }
            }
            ui.m.picker.setItems(mArray);
            //ui.m.picker.setSelectedValue(current);
        },
        _createDay: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成日列表
            var dArray = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.d) {
                        dArray = options.customData.d;
                    }else {
                        var maxDay = self.getDayNum(parseInt(ui.y.picker.getSelectedValue()), parseInt(ui.m.picker.getSelectedValue()));
                        for (var d = 1; d <= maxDay; d++) {
                            var val = self._fill(d);
                            dArray.push({
                                text: val + ''+$.i18n("cmp.dtPicker.day"),
                                value: val
                            });
                        }
                    }
                }
            }
            ui.d.picker.setItems(dArray);
            //current = current || ui.d.picker.getSelectedValue();
            //ui.d.picker.setSelectedValue(current);
        },
        _createHours: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成时列表
            var hArray = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.h) {
                        hArray = options.customData.h;
                    }else {
                        for (var h = 0; h <= 23; h++) {
                            var val = self._fill(h);
                            hArray.push({
                                text: val+ ''+$.i18n("cmp.dtPicker.hours"),
                                value: val
                            });
                        }
                    }
                }
            }
            ui.h.picker.setItems(hArray);
            //ui.h.picker.setSelectedValue(current);
        },
        _createMinutes: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成分列表
            var iArray = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.i) {
                        iArray = options.customData.i;
                    }else {
                        if(current){
                            var num = parseInt(current);
                            if(num > 30){
                                num = 30;
                            }else if(num < 1){
                                num = 1;
                            }
                            for (var m = 0; m <= 59; m+=num) {
                                if(m%10==0){
                                    var val2 = self._fill(m);
                                    iArray.push({
                                        text: val2 + ''+$.i18n("cmp.dtPicker.minutes"),
                                        value: val2
                                    });
                                }
                                
                            }
                        }else{
                            for (var i = 0; i <= 59; i++) {
                                if(i%10==0){
                                    var val = self._fill(i);
                                    iArray.push({
                                        text: val + ''+$.i18n("cmp.dtPicker.minutes"),
                                        value: val
                                    });
                                }
                                
                            }
                        }

                    }
                }
            }
            ui.i.picker.setItems(iArray);
            //ui.i.picker.setSelectedValue(current);
        },
        _createHoursTwo: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成时列表
            var hArray2 = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.hTwo) {
                        hArray2 = options.customData.hTwo;
                    }else {
                        for (var hTwo = 0; hTwo <= 23; hTwo++) {
                            var val = self._fill(hTwo);
                            hArray2.push({
                                text: val+ ''+$.i18n("cmp.dtPicker.hours"),
                                value: val
                            });
                        }
                    }
                }
            }
            ui.hTwo.picker.setItems(hArray2);
            //ui.h.picker.setSelectedValue(current);
        },
        _createMinutesTwo: function(current) {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            //生成分列表
            var iArray2 = [];
            if(options){
                if(typeof options.customData != "undefined"){
                    if (options.customData.iTwo) {
                        iArray2 = options.customData.iTwo;
                    }else {
                        for (var iTwo = 0; iTwo <= 59; iTwo++) {
                            var val = self._fill(iTwo);
                            iArray2.push({
                                text: val + ''+$.i18n("cmp.dtPicker.minutes"),
                                value: val
                            });
                        }
                    }
                }
            }
            ui.iTwo.picker.setItems(iArray2);
            //ui.i.picker.setSelectedValue(current);
        },
        _setLabels: function() {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            ui.labels.each(function(i, label) {
                label.innerText = options.labels[i];
            });
        },
        _setButtons: function() {
            var self = this;
            var options = self.options;
            var ui = self.ui;
            ui.cancel.innerText = options.buttons[0];
            ui.ok.innerText = options.buttons[1];
        },
        _parseValue: function(value) {
            var self = this;
            var rs = {};
            var type=self.options.type;
            if (value) {
                var parts;
                if(type == "timeInterval"){
                    parts = value.replace(":", "-").replace(":", "-").replace(" ", "-").split("-");
                    //rs.y = parts[0];
                    //rs.m = parts[1];
                    //rs.d = parts[2];

                    rs.h = parts[0];
                    rs.i = parts[1];
                    rs.hTwo = parts[2];
                    rs.iTwo = parts[3];
                }else{
                    parts = value.replace(":", "-").replace(" ", "-").split("-");
                    var now = new Date();
                    rs.y = parts[0] || now.getFullYear();
                    rs.m = parts[1] || now.getMonth() + 1;
                    rs.d = parts[2] || now.getDate();
                    rs.h = parts[3] || now.getHours();
                    rs.i = parts[4] || now.getMinutes();
                    rs.hTwo = parts[5] || now.getHours();
                    rs.iTwo = parts[6] || now.getMinutes();
                }


            } else {
                var now = new Date();
                rs.y = now.getFullYear();
                rs.m = now.getMonth() + 1;
                rs.d = now.getDate();
                rs.h = now.getHours();
                rs.i = now.getMinutes();
                rs.hTwo = now.getHours();
                rs.iTwo = now.getMinutes();
            }
            return rs;
        },
        _create: function(options) {
            var self = this;
            options = options || {};
            options.labels = options.labels || [$.i18n("cmp.dtPicker.year"), $.i18n("cmp.dtPicker.month"), $.i18n("cmp.dtPicker.day"), $.i18n("cmp.dtPicker.hours"), $.i18n("cmp.dtPicker.minutes")];
            options.buttons = options.buttons || [$.i18n("cmp.dtPicker.cancel"), $.i18n("cmp.dtPicker.ok")];
            options.type = options.type || 'datetime';
            options.customData = options.customData || {};
            options.MinutesScale=options.MinutesScale || '1';
            self.options = options;
            var now = new Date();
            options.beginYear = options.beginYear || (now.getFullYear() - 5);
            options.endYear = options.endYear || 2099;//默认固定在2099年 //(now.getFullYear() + 5)
            var ui = self.ui;
            //设定label
            self._setLabels();
            self._setButtons();
            //设定类型
            ui.picker.setAttribute('data-type', options.type);
            if(options.type == "datetime"){
                ui.hTwo.remove();
                ui.iTwo.remove();
            }
            //生成数据
            self._createYear();
            self._createMonth();
            self._createDay();
            self._createHours();
            self._createMinutes(options.MinutesScale);
            self._createHoursTwo();
            self._createMinutesTwo();


            //设定默认值
            self.setSelectedValue(options.value);
        },
        //显示
        show:function(callback,cancelCallback){
            var self = this;
            if(!CMP_DTPICKER_I18N_LOADED){
                document.addEventListener("cmp-dtPicker-show",function(){
                    self._doShow(callback,cancelCallback);
                })
            }else {
                self._doShow(callback,cancelCallback);
            }
        },
        _doShow: function(callback,cancelCallback) {
            var self = this;
            var ui = self.ui;
            self.callback = callback || $.noop;
            self.cancelCallback = cancelCallback || $.noop;
            ui.mask.show();
            document.body.classList.add($.className('dtpicker-active-for-page'));
            ui.picker.classList.add($.className('active'));
            //处理物理返回键
            self.__back = $.back;
            $.back = function() {
                self.hide();
            };
            $.dtpickerBack = function() {
                self.hide();
            };
            $.backbutton.push($.dtpickerBack);
        },
        hide: function() {
            var self = this;
            if(self.disposed) return;
            var ui = self.ui;
            ui.picker.classList.remove($.className('active'));
            ui.mask.close();
            document.body.classList.remove($.className('dtpicker-active-for-page'));
            //处理物理返回键
            //$.back=self.__back;
            self.clear();
            $.backbutton.pop();
        },
        dispose: function() {
            var self = this;
            self.hide();
            self.disposed = true;
        },
        clear:function(){
            var self = this;
            self.disposed = true;
            if(self.ui && self.ui.picker){
                self.ui.picker.remove();
            }
            self = null;
        }
    });

})(mui, document);
(function(_){
    //=======================================================================时间同步格林尼治时间 start===============//
    /**
     * 将timestamps 转为 yyyy-MM-dd hh:mm格式(此方法兼容了时区导致的时间不与中国时间同步的问题)
     * @param ms 毫秒值(1970年至今的毫秒数)
     * @param withDate  是否包含日期   不传默认不包含日期
     * @returns {*}
     */
    _.time = function(ms,withDate){
        if(parseInt(ms).toString() != 'NaN'){
            var date  = new Date();
            var chinaTimeZoneDifference = -480;//中国时间与格林尼治时间的相差的分钟数
            date.setTime(parseInt(ms));
            var year = date.getFullYear(), //年
                month = date.getMonth()+1, //月
                day = date.getDate(), //日
                hour = date.getHours(),//时
                min = date.getMinutes(),//分
                zone = date.getTimezoneOffset();//时区差
            var hourDifference = 0;
            if(zone != chinaTimeZoneDifference){
                hourDifference = (zone - chinaTimeZoneDifference)/60;
                hour = hour + hourDifference;
                if(hour > 24){
                    day ++;
                    hour = hour -24;
                    if(month == 2) {
                        if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)){
                            if(day > 29) {
                                day = 1;
                                month ++;
                            }
                        }else {
                            if(day > 28){
                                day = 1;
                                month ++
                            }
                        }
                    }else if(month == 12){
                        if(day > 31) {
                            day = 1;
                            month = 1;
                            year ++;
                        }
                    }else if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10){
                        if(day > 31){
                            day = 1;
                            month ++;
                        }
                    }else {
                        if(day > 30) {
                            day  = 1;
                            month ++;
                        }
                    }
                }
            }
            if(min<10 )min = "0"+min;
            if(hour < 10) hour = "0" + hour;
            var time = hour+":"+min;
            if(withDate === true){
                time = year+"-"+month+"-"+day+" "+time;
            }
            return time;
        }else{
            return ms;
        }
    };
    //=======================================================================时间同步格林尼治时间 end===============//
})(cmp);