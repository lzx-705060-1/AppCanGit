/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-relation', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            //if ($.sui.getFieldAuth(model.auth) == 'edit') {
            this.clickHandler = function (e) {

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);
            //}

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;

            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);