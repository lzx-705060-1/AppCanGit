/**
 * Created by yangchao on 2016/7/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-radio', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.changeHandler = function (e) {
                var oldValue = model.value;
                var radioCtrl = that.el.querySelector('input');
                var newValue = e.target.value;

                if (oldValue != newValue) {
                    //更新model
                    radioCtrl.value = newValue;
                    that.set(newValue);
                    model.__state = 'modified';
                    $.sui.clearErrorTips(that.el);
                    //清除必填的背景色
                    that.el.children[0].classList.remove('sui-form-ctrl-empty');

                    $.sui.doCalculate(that.el, fieldInfo);
                }

            }.bind(this);

            this.el.addEventListener('change', this.changeHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var that = this;
            this.setOptions(model.items);
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            var radioGroup = that.el.querySelector('#radiogroup_' + fieldInfo.name);
            if (radioGroup) {
                var radio = radioGroup.querySelector('[value="' + newValue + '"]');
                if (radio) radio.checked = true;
            }

        },
        setOptions: function(items) {
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });
            }

        },
        unbind: function () {
            this.el.removeEventListener('change', this.changeHandler);

        }
    })

})(cmp, Vue, document);

