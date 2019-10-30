/**
 * 弹出选择列表插件
 * 此组件依赖 listpcker ，请在页面中先引入 mui.picker.css + mui.picker.js
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */
;(function($, document) {
    var CMP_POPPICKER_I18N_LOADED = false;
    $.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-popPicker',function(){
        CMP_POPPICKER_I18N_LOADED = true;
        $.event.trigger("cmp-popPicker-init",document);
        $.event.trigger("cmp-popPicker-show",document);
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

    var panelBuffer = function() {
        var panelBuffer =
        '<div class="cmp-poppicker poppickerBox">\
		<div class="cmp-poppicker-header">\
			<button class="cmp-btn cmp-poppicker-btn-cancel">+$.i18n("cmp.popPicker.cancel")+</button>\
			<button class="cmp-btn cmp-btn-blue cmp-poppicker-btn-ok">+$.i18n("cmp.popPicker.ok")+</button>\
			<div class="cmp-poppicker-clear"></div>\
		</div>\
		<div class="cmp-poppicker-body">\
		</div>\
	</div>';
        return panelBuffer;
    };

    var pickerBuffer = '<div class="cmp-picker">\
		<div class="cmp-picker-inner">\
			<div class="cmp-pciker-rule cmp-pciker-rule-ft"></div>\
			<ul class="cmp-pciker-list">\
			</ul>\
			<div class="cmp-pciker-rule cmp-pciker-rule-bg"></div>\
		</div>\
	</div>';

    //定义弹出选择器类
    var PopPicker = $.PopPicker = $.Class.extend({
        //构造函数
        init:function(options){
            var self = this;
            if(!CMP_POPPICKER_I18N_LOADED){
                document.addEventListener("cmp-popPicker-init",function(){
                    self._doInit(options);
                    
                });
            }else {
                self._doInit(options);
            }
        },
        _doInit: function(options) {
            var self = this;
            self.options = options || {};
            self.options.buttons = self.options.buttons || [$.i18n("cmp.popPicker.cancel"), $.i18n("cmp.popPicker.ok")];
            self.panel = $.dom(panelBuffer())[0];
            document.body.appendChild(self.panel);
            self.ok = self.panel.querySelector('.cmp-poppicker-btn-ok');
            self.cancel = self.panel.querySelector('.cmp-poppicker-btn-cancel');
            self.body = self.panel.querySelector('.cmp-poppicker-body');
            self.mask = $.createMask();
            self.cancel.innerText = self.options.buttons[0];
            self.ok.innerText = self.options.buttons[1];
            self.defaultValue=self.options.defaultValue?self.options.defaultValue : null;
            self.cancel.addEventListener('tap', function(event) {
                self.hide();
            }, false);
            self.ok.addEventListener('tap', function(event) {
                event.stopPropagation();
                if (self.callback) {
                    var rs = self.callback(self.getSelectedItems());
                    if (rs !== false) {
                        self.hide();
                    }
                }
                if(self.mask){  //有可能调用者已经调用的关闭方法
                    self.mask[0].remove();
                }
            }, false);
            self.mask[0].addEventListener('tap', function(event) {
                event.stopPropagation();
                self.hide();
            }, false);
            self._createPicker();
            //防止滚动穿透
            self.panel.addEventListener('touchstart', function(event) {
                event.preventDefault();
            }, false);
            self.panel.addEventListener('touchmove', function(event) {
                event.preventDefault();
            }, false);
            self.setData(self.options.data);
            self.setPickerDefalutValue();
            
        },
        _createPicker: function() {
            var self = this;
            var layer = self.options.layer || 1;
            var width = (100 / layer) + '%';
            self.pickers = [];
            for (var i = 1; i <= layer; i++) {
                var pickerElement = $.dom(pickerBuffer)[0];
                pickerElement.style.width = width;
                self.body.appendChild(pickerElement);
                var picker = $(pickerElement).picker();
                self.pickers.push(picker);
                pickerElement.addEventListener('change', function(event) {
                    var nextPickerElement = this.nextSibling;
                    if (nextPickerElement && nextPickerElement.picker) {
                        var eventData = event.detail || {};
                        var preItem = eventData.item || {};
                        nextPickerElement.picker.setItems(preItem.children);
                    }
                }, false);
            }

        },
        //设置一个默认值
        setPickerDefalutValue:function(){
            var self=this;
            var piker=self.body.querySelector('.cmp-picker');
            var ul=piker.querySelector('ul');
            //处理点击的文本框如果有默认值的话
            if(self.defaultValue){
                var elementItems= [].slice.call(ul.querySelectorAll('li'));
                var i= 0,len=elementItems.length;
                var self_item;
                var picker = self.pickers[0];
                for(i ; i < len ; i++){
                    var value = elementItems[i].getAttribute("value");
                    if(value == self.defaultValue){
                        self_item = elementItems[i];
                        break;
                    }
                }
                picker.setSelectedIndex(elementItems.indexOf(self_item), 200);
            }
        },
        //填充数据
        setData: function(data) {
            var self = this;
            data = data || [];
            self.pickers[0].setItems(data);
        },
        //获取选中的项（数组）
        getSelectedItems: function() {
            var self = this;
            var items = [];
            var i=0,len=self.pickers.length;
            for ( i ;i<len;i++) {
                var picker = self.pickers[i];
                items.push(picker.getSelectedItem() || {});
            }

            return items;
        },
        //显示
        show:function (callback) {
            var self = this;
            if(!CMP_POPPICKER_I18N_LOADED){
                document.addEventListener("cmp-popPicker-show",function(){
                    self._doShow(callback);
                })
            }else{
                self._doShow(callback);
            }
        },
        _doShow: function(callback) {
            var self = this;
            self.callback = callback;
            self.mask.show();
            document.body.classList.add($.className('poppicker-active-for-page'));
            self.panel.classList.add($.className('active'));
            //处理物理返回键
            self.__back = $.back;
            $.popopickerBack = function() {
                self.hide();
            };
            $.backbutton.push($.popopickerBack);
        },
        //隐藏
        hide: function() {
            var self = this;
            if (!self.mask) return;
            if(self.panel){
                self.panel.classList.remove($.className('active'));
            }
            self.mask.close();
            document.body.classList.remove($.className('poppicker-active-for-page'));
            //处理物理返回键
            $.back=self.__back;
            $.backbutton.pop();
        },
        dispose: function() {
            var self = this;
            if(Object.keys(self).length == 0) return;
            self.disposed = true;
            self.hide();
            self.panel.parentNode.removeChild(self.panel);
            for (var name in self) {
                self[name] = null;
                delete self[name];
            };
            self = null;
        }
    });

})(mui, document);