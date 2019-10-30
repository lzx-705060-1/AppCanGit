/**
 * Created by yangchao on 2016/6/1.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-select', {
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

                var _picker = new $.PopPicker();
                this.setOptions(model);
                _picker.setData(model.items);
                _picker.defaultValue = model.value;
                _picker.setPickerDefalutValue();
                _picker.show(function(items) {
                    var curOption = items[0];
                    var oldValue = model.value;
                    var newValue = curOption.value || '';
                    if (oldValue != newValue) {
                        //更新model
                        model.display = curOption.text || '';
                        that.set(newValue);
                        model.__state = 'modified';
                        that.update(newValue);

                        //下拉框字段改变后，调用后台接口   dealMultiEnumRelation
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);

                        var options = {
                            formMasterId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            currentEnumItemValue: newValue,
                            data: $.sui.reduceSubmitData(s3scope.data),
                            attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                        };

                        if (model.event == 'refresh') {
                            $.sui.dataService.capForm.dealMultiEnumRelation(options, function(err, data){
                                if (err) {
                                    $.notification.alert(err.message || 'Error when calling dealMultiEnumRelation!', null, '', $.i18n('form.btn.ok'));
                                    return;
                                }

                                $.sui.refreshFormData(null, !data.results ? data : data.results);
                            });
                        } else if (model.event == 'calc') {
                            $.sui.doCalculate(that.el, fieldInfo);
                        }

                    }

                    _picker.dispose();
                    _picker = null;
                }, function () {
                    _picker.dispose();
                    _picker = null;
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.setOptions(model);
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        setOptions: function(model) {
            var str = $.i18n('form.select.notice') || '--请选择--';
            var items = model.items;
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });

                if (items[0].display == '' || items[0].value == '0') {
                    if (model.auth == 'edit') {
                        items[0].text = str;
                    } else {
                        items[0].text = ''
                    }

                    items[0].value = '';
                }
            }
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
