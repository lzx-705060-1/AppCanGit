/**
 * Created by yangchao on 2016/8/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-barcode', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

          //将attData装填进attachmentInputs
          this.vm.$nextTick(function(){
            var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
            s3scope.attachmentInputs[ctrlId] = model.attData;
          });

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

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    locked = false;
                    return;
                }

                if (e.target.suiMatchesSelector('.see-icon-v5-form-qrcode')) {
                    locked = true;
                    var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                    var options = {
                        dataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        fieldName: fieldInfo.name,
                        recordId: recordId,
                        data: $.sui.reduceSubmitData(s3scope.data)
                    };

                    $.sui.dataService.capForm.generateBarCode(options, function(err, data) {
                        if (err || !data.attr) {
                            var msg = data && data.msg ? data.msg : '';
                            //OA-109602重复点击图中的生成二维码，生成2层遮罩 ,点击确定后，再解锁
                            $.notification.alert(msg || 'Error when calling generateBarCode!', function(){
                                locked = false;
                            }, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        model.attData.splice(0);
                        model.attData.push(data.attr);
                        that.set(data.attr.subReference);
                        that.update(model.value);
                        locked = false;
                    });
                } else if (e.target.suiMatchesSelector('.see-icon-v5-form-close-circle-fill')) {
                    locked = true;
                    var msg = $.i18n('form.qr.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            model.attData.splice(0);
                            that.set('');
                            that.update('');
                        }
                        locked = false;
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
                } else {
                    locked = false;
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);
        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);