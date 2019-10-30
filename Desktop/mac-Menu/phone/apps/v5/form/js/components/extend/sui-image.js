/**
 * Created by yangchao on 2016/8/5.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-image', {
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
            var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (e.target.tagName == 'IMG') {
                    //统一由外层协同处理图片点击事件

                } else if (e.target.classList.contains('see-icon-v5-form-close-circle') || e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {
                    //删除操作
                    //!!目前图片只支持上传单个图片，所有删除的时候，直接将attData清空，后续有需求，再改造支持多图片关闭

                    var msg = $.i18n('form.image.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            model.attData.splice(0);
                            model.__state = 'modified';
                            model.editAttr = true;
                            that.update(model.value);
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);



                } else if (e.target.parent('.image-add-item')) {
                    // if (!$.platform.CMPShell) {
                    //     $.notification.alert($.i18n('form.weixin.canNotAttachment'), null, '', $.i18n('form.btn.ok'));
                    //     return;
                    // }
                    //2017-9-14 去除微协同的附件功能的限制

                    if (model.attData.length > 0) {
                        var msg = $.i18n('form.image.updateConfirm');
                        $.notification.confirm(msg, function(index){
                            if (index == 1) {
                                _uploadImg(model, fieldInfo);

                            }
                        }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
                    } else {
                        _uploadImg(model, fieldInfo);
                    }


                }
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            function _uploadImg (model, fieldInfo) {

                var items = [
                    {
                        key: "1",
                        name: $.i18n('form.btn.photo')
                    },
                    {
                        key: "2",
                        name: $.i18n('form.btn.localImage')
                    }

                ];
                cmp.dialog.actionSheet(items, $.i18n('form.btn.cancel'), function (item) {

                    var type = '';
                    if (item.key == '1') {
                        type = 'photo';
                    } else if(item.key == '2'){
                        type = 'picture';
                    }

                    if (type) {
                        cmp.dialog.loading();
                        cmp.att.suite({
                            type: type,
                            pictureNum: 1,
                            maxFileSize: 10*1024*1024, //OA-127130
                            success:function(result){
                                cmp.dialog.loading(false);
                                //选图片只允许选一个，要替换之前的图片
                                model.attData.splice(0);
                                var subReference = model.value;
                                var reference = s3scope.moduleId;

                                (result.att || []).forEach(function(item){
                                    item.subReference = subReference;
                                    item.reference = reference;
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
                                $.notification.alert(err.message || err.msg || '上传图片失败!', null, '', $.i18n('form.btn.ok'));
                            }
                        });

                    }

                }, function () {

                });

            }

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);

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
            this.el.removeEventListener('load', this.onLoadHandler);
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);