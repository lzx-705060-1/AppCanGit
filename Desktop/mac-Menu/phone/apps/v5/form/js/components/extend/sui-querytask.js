/**
 * Created by yangchao on 2016/8/24.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-querytask', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                var recordIndex = $.sui.getRecordIndexByVueElement(that.el, fieldInfo);
                var pageKey = $.sui.getTempKey();
                var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                $.sui.lastPosCtrlId = ctrlId;
                var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: recordId}, fieldInfo);
                var options = {
                    formId: s3scope.formId,
                    contentDataId: s3scope.formMasterId,
                    fieldName: fieldInfo.name,
                    recordId: recordId,
                    allowCheck: false
                };

                //调用dee控件前，执行一次合并数据
                $.sui.dataService.capForm.mergeFormData({
                    formDataId: s3scope.formMasterId,
                    formId: s3scope.formId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                }, function(err, data){
                    $.deeDataList(pageKey, metadata, options);
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);