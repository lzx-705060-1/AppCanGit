/**
 * Created by yangchao on 2016/8/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-handwrite', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.signature = model.signature || {};
            var sigFieldName = fieldInfo.name + '_' + s3scope.formMasterId;
            var fieldValue = (model.signature || {}).fieldValue || '';
            this.clickHandler = function (e) {

                //手机上才能调用签章
                if (!$.platform.CMPShell) {
                    return;
                }

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    e.stopPropagation();
                    return;
                }

                var width = '500';
                var height = '400';
                if (s3scope.metadata.templateType == 'infopath') {
                    var target = that.el.querySelector('.sui-form-ctrl-value-display');
                    if (target) {
                        var style = window.getComputedStyle(target);
                        width = parseInt(style.width);
                        height = parseInt(style.height);
                    }
                }

                //调用签章组件
                var options = {
                    height: height,
                    width: width,
                    fieldValue: fieldValue,
                    fieldName: sigFieldName,
                    summaryID: s3scope.formMasterId,
                    signatureListUrl: $.serverIp + '/seeyon/rest/signet/signets/' + s3scope.affaireId,
                    signaturePicUrl: $.serverIp + '/seeyon/rest/signet/signetPic',
                    affairId: s3scope.affaireId,

                    success: function (data) {
                        if (data instanceof Array && data.length > 0 ) {
                            model.display = sigFieldName;
                            that.set(sigFieldName);
                            model.__state = 'modified';
                            model.signature = data[0];
                            that.update(sigFieldName);
                            //设置summaryId
                            //data.summaryID = s3scope.formMasterId;
                            //保存签章数据
                            var options = {
                                isNewImg: false,
                                affairId: s3scope.moduleId,
                                qianpiData: JSON.stringify(data) //后台接受的数据是一个字符串
                            };
                            s3scope.signatures[fieldInfo.name] = options;

                            //将签章数据保存在缓存中，切换到原样表单的时候需要使用
                            //var signatureKey = $.sui.getSignatureKey();
                            //var signatureData = {};
                            //try {
                            //    signatureData = JSON.parse($.storage.get(signatureKey, true)) || {};
                            //} catch (e) {
                            //    signatureData = {};
                            //}

                            //signatureData[sigFieldName] = model.signature;
                            //$.storage.save(signatureKey, JSON.stringify(signatureData), true);
                        }

                    },
                    error: function (err) {
                    }

                };
                $.handWriteSignature.show(options);

                e.stopPropagation();

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                //$.sui.onImgLoadHandler(e);
                e.target.style.maxWidth = '100%';
                //e.target.style.maxHeight = '100%';
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);
        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var sigFieldName = fieldInfo.name + '_' + s3scope.formMasterId;
            var that = this;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

            if ($.platform.CMPShell) {
                //如果没有解码后的picData，就调用签章解码
                if (model.signature && !model.signature.picData) {
                    cmp.handWriteSignature && cmp.handWriteSignature.initSignatureData({
                        value: [model.signature],
                        success: function (decodeSignatures) {
                            console.log(decodeSignatures);

                            if (decodeSignatures instanceof Array && decodeSignatures.length > 0) {
                                var target = that.el.querySelector('img');
                                if (target && decodeSignatures[0].picData) {
                                    model.signature.picData = decodeSignatures[0].picData;
                                    target.src = 'data:image/png;base64,' + decodeSignatures[0].picData;
                                }
                            }
                        },
                        error: function (err) {

                        }
                    });
                }
            } else {
                var target = that.el.querySelector('.sui-form-ctrl-value-display');
                if (target) {
                    //如果本地化文件异步加载了，此时可能加载不到本地化信息，这么写只是临时策略，
                    //后续可改成如果取不到值，注入占位符，在本地化文件加载成功的回调里，替换占位符
                    target.innerHTML = $.i18n('form.weixin.canNotHandwrite') || '微协同环境不支持签章';
                }
            }

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);