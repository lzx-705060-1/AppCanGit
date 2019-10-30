/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-maplocate', {
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

            var locked = false;
            var timer = null;

            this.clickHandler = function (e) {
                if (locked) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function(){
                        locked = false;
                    }, 5000);
                    return;
                }
                locked = true;
                $.sui.maplocate_clickHandler(e, that, model, fieldInfo, function(){
                    locked = false;
                });


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