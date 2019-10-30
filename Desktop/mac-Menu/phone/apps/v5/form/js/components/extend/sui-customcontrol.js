/**
 * Created by yangchao on 2016/9/5.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-linenumber', {
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
    });

    Vue.directive('sui-customcontrol', {
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
            var isMaster = this.params.scope.isMaster;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            var that = this;
            //每次更新value后，触发通知自定义控件进行渲染的事件

            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                var recordId = -1;
                var arr = String(ctrlId).split('|');
                if (arr.length == 3) {
                    recordId = arr[1];
                }
                SuiEvent.trigger({target: document, eventName: 'sui_form_customcontrol_render', data: {
                    model : model,
                    fieldInfo: fieldInfo,
                    handler: that,
                    isMaster: isMaster,
                    tableName: model.ownerTableName,
                    recordId: recordId,
                    target: that.el.querySelector('.sui-form-ctrl-field-main')
                }}, function(err, result){});
            });

        },
        unbind: function () {

        }
    });

})(cmp, Vue, document);
