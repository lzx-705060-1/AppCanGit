/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-project', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            function _eventSelected (selectedId,selectedName) {
                //selectedId 对应value
                //selectedName 对应display

                model.display = selectedName;
                that.set(selectedId);
                model.__state = 'modified';
                that.update(selectedId);

                //发送请求到后台，执行数据更新 dealProjectFieldRelation
                var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);

                var options = {
                    formDataId: s3scope.formMasterId,
                    formId: s3scope.formId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    fieldName: fieldInfo.name,
                    recordId: recordId,
                    projectId: selectedId,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                };
                $.sui.dataService.capForm.dealProjectFieldRelation(options, function(err, data){
                    if (err) {
                        $.notification.alert(err.message || 'Error when calling dealProjectFieldRelation!', null, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    $.sui.refreshFormData(null, !data.results ? data : data.results);
                });
            }

            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (typeof $ProjectAccountList == 'undefined') {
                    $.notification.alert('Can not find the js file $ProjectAccountList!', null, '', $.i18n('form.btn.ok'));
                    return;
                }

                //调用关联项目逻辑
                var val = model.value;
                $ProjectAccountList.init({
                    selectedId: val,  //被选中的项目ID，非必填
                    eventBack : function(){ //点击项目列表的返回按钮执行的回调
                        //执行关闭项目列表页面
                    },
                    eventSelected : function(selectedId,selectedName){ //选择项目之后执行的回调
                        _eventSelected(selectedId, selectedName);
                    }
                });


            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);