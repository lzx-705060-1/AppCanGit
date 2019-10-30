/**
 * Created by yangchao on 2016/9/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-outwrite', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
        }
    })

})(cmp, Vue, document);