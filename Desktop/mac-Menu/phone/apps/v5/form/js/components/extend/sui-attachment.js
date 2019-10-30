/**
 * Created by yangchao on 2016/8/16.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-attachment', {
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

                    var msg = $.i18n('form.attachment.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            var arr = e.target.parent('.attachment-items').children.toArray();
                            var attachment = e.target.parent('.attachment-item');
                            var num = arr.indexOf(attachment);

                            if (num != -1) {
                                model.attData.splice(num, 1);
                                model.__state = 'modified';
                                model.editAttr = true;
                                that.update(model.value);
                            }
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);

                } else if (e.target.closest('.attachment-add-item')) {
                    // if (!$.platform.CMPShell) {
                    //     $.notification.alert($.i18n('form.weixin.canNotAttachment'), null, '', $.i18n('form.btn.ok'));
                    //     return;
                    // }
                    //2017-9-14 去除微协同的附件功能的限制

                    var items = [
                        {
                            key: "1",
                            name: $.i18n('form.btn.photo')
                        },
                        {
                            key: "2",
                            name: $.i18n('form.btn.voice')
                        },
                        {
                            key: "3",
                            name: $.i18n('form.btn.localFile')
                        },
                        {
                            key: "4",
                            name: $.i18n('form.btn.localImage')
                        }

                    ];
					
					
					//2017-9-26 OA-131734  ZM930版本，在微协同屏蔽语音项
					if (!$.platform.CMPShell) {
						items.splice(1,1);
					}

                    cmp.dialog.actionSheet(items, $.i18n('form.btn.cancel'), function (item) {

                        var type = '';
                        if (item.key == '1') {
                            type = 'photo';
                        }
                        else if(item.key == '2') {
                            type = 'voice';
                        } else if(item.key == '3') {
                            type = 'localFile';
                        } else if(item.key == '4'){
                            type = 'picture';
                        }

                        if (type) {
                            cmp.dialog.loading();
                            $.att.suite({
                                type: type,
                                maxFileSize: 50*1024*1024, //OA-127072
                                success:function(result){
                                    cmp.dialog.loading(false);
                                    var subReference = model.value;
                                    var reference = s3scope.moduleId;
                                    (result.att || []).forEach(function(item){
                                        item.subReference = subReference;

                                        //item.createdate = (new Date(Number(item.createdate)) || new Date()).format('yyyy-MM-dd');
                                        item.createdate = item.createdate || new Date().getTime().toString();
                                        model.attData.push(item);
                                    });
                                    that.update(model.value);
                                    model.__state = 'modified';
                                    model.editAttr = true;
                                    console.log(result);
                                },
                                cancel: function () {
                                    cmp.dialog.loading(false);
                                },
                                error:function(err){
                                    cmp.dialog.loading(false);
                                    $.notification.alert(err.message || err.msg || '上传附件失败!', null, '', $.i18n('form.btn.ok'));
                                }
                            });
                        }

                    }, function () {

                    });

                } else if (e.target.closest('.attachment-item')) {
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