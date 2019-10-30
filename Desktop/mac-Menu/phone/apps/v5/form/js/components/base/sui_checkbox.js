/**
 * Created by yangchao on 2016/6/8.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-checkbox', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.changeHandler = function (e) {
                //if (e.target.attr)
                // 将数据写回 vm
                //获取当前value和input的值
                var oldValue = model.value;
                var checkbox = this.el.querySelector('input');
                var newValue = checkbox.checked.toString();
                if (oldValue != newValue) {
                    //更新model
                    checkbox.value = newValue;
                    var val = newValue == 'true' ? '1' : '0';
                    this.set(val);
                    model.__state = 'modified';
                    $.sui.clearErrorTips(this.el);

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
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            that.el.querySelector('input').checked = newValue.toString() == 'true' || newValue == '1';

        },
        unbind: function () {
            this.el.removeEventListener('change', this.changeHandler);

        }
    })

})(cmp, Vue, document);