/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-mapmarked', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            //model.attData = model.attData || [];
            //将attData装填进attachmentInputs
            //s3scope.attachmentInputs[fieldInfo.name] = model.attData;

            this.clickHandler = function (e) {
                $.sui.mapmarked_clickHandler(e, that, model, fieldInfo);
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            //model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);

        }
    })

})(cmp, Vue, document);