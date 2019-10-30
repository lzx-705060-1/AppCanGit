/**
 * Created by yangchao on 2016/8/19.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-document', {
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

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {

                    var msg = $.i18n('form.document.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            var arr = e.target.parent('.document-items').children.toArray();
                            var document = e.target.parent('.document-item');
                            var num = arr.indexOf(document);

                            if (num != -1) {
                                model.attData.splice(num, 1);
                                model.__state = 'modified';
                                model.editAttr = true;
                                that.update(model.value);
                            }
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);


                } else if (e.target.closest('.document-add-item')) {

                    $.accDoc("form-document",{
                        fillbackData: model.attData,
                        callback:function(data){
                            if (typeof data == 'string') {
                                data = JSON.parse(data);
                            }

                            console.log(data);
                            var subReference = model.value;
                            model.attData.splice(0);
                            $.sui.attachmentDataConverter(model.attData, data, subReference, true);
                            that.update(model.value);
                            model.__state = 'modified';
                            model.editAttr = true;

                        }
                    });



                } else if (e.target.closest('.document-item')) {
                    //弹出显示附件的层

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
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);