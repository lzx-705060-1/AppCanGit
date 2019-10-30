/**
 * Created by yangchao on 2016/8/17.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-relationform', {
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

                //if ($.sui.getFieldAuth(model.auth) != 'edit') {
                //    return;
                //}

                if (e.target.suiMatchesSelector('.see-icon-v5-form-ic-form-fill')) {

                    //判断templateSize,在model.extMap里面
                    if (model.extMap && model.extMap.templateSize <= 0) {
                        $.notification.alert($.i18n('form.app.noBind'), null, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    //关联表单跳转前，执行一次合并数据
                    $.sui.dataService.capForm.mergeFormData({
                        formDataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        data: $.sui.reduceSubmitData(s3scope.data),
                        attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                    }, function(err, data){
                        console.log('after mergeFormData');
                        var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                        var recordIndex = $.sui.getRecordIndexByVueElement(that.el, fieldInfo);
                        var pageKey = $.sui.getTempKey();
                        var fromRecordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        $.sui.lastPosCtrlId = ctrlId;
                        var options = {
                            formId: fieldInfo.relation.toRelationObj,
                            fromFormId: fieldInfo.relation.fromRelationObj,
                            moduleId: s3scope.moduleId,
                            fromDataId: s3scope.formMasterId,
                            fromRecordId: fromRecordId,
                            fromRelationAttr: fieldInfo.relation.fromRelationAttr,
                            toRelationAttr: fieldInfo.relation.toRelationAttr,
                            formType: fieldInfo.relation.toRelationFormType == '1' ? 'form' : 'unflowform',  //无流程有流程，需要从loadForm中传入参数
                            mutiselect: ctrlId.indexOf('master') >= 0 ? false : true, //如果是重复表为true，非重复表为false
                            showView: (fieldInfo.relation.showView==undefined || fieldInfo.relation.showView ==1) ? true : false,
                            data: s3scope.data
                        };

                        var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: fromRecordId}, fieldInfo);
                        console.log(options);

                        if (typeof $.relationForm == 'undefined') {
                            $.notification.alert('Can not find the js file $.relationForm!', null, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        $.relationForm(pageKey, metadata, options);
                    });

                } else if (e.target.suiMatchesSelector('.allow-click-relationform')) {
                    //如果有关联表单穿透就啥事不干
                } else if (fieldInfo.finalInputType == 'maplocate') {
                    //地图控件的绑定事件
                    $.sui.maplocate_clickHandler(e, that, model, fieldInfo);
                } else if (fieldInfo.finalInputType == 'mapmarked') {
                    //地图控件的绑定事件
                    $.sui.mapmarked_clickHandler(e, that, model, fieldInfo);
                } else if (fieldInfo.finalInputType == 'mapphoto') {
                    //地图控件的绑定事件
                    $.sui.mapphoto_clickHandler(e, that, model, fieldInfo);
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            if (fieldInfo.finalInputType == 'handwrite' || fieldInfo.finalInputType == 'image' || fieldInfo.finalInputType == 'mapphoto') {
                //在捕获阶段，监听load事件
                this.el.addEventListener('load', this.onLoadHandler, true);
            }



        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var that = this;
            this.setOptions(model);
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            //如果是系统关联，则auth为浏览
            if (fieldInfo.relation && fieldInfo.relation.viewSelectType == '2') {
                var target = this.el.querySelector('.sui-form-ctrl-field');
                if (target) {
                    target.classList.remove('sui-auth-edit');
                    target.classList.add('sui-auth-browse');
                }

            }

            //将所有input，textarea，select框的value设置为newValue
            //如果是radio先处理一下
            if (fieldInfo.finalInputType == 'radio') {
                var radio = this.el.querySelector('#radiogroup_' + fieldInfo.name).querySelector('[value="' + newValue + '"]');
                if (radio) radio.checked = true;
            } else {
                var domArr = this.el.querySelectorAll('input,textarea,select');
                var len = domArr.length;
                for (var i=0; i<len; i++){
                    var dom = domArr[i];
                    dom.value = newValue;
                    dom.checked = newValue.toString() == 'true' || newValue == '1';
                }
            }

            //处理一下textarea的resize
            if (fieldInfo.finalInputType == 'textarea') {

                that.vm.$nextTick(function(){
                    var target = that.el.querySelector('textarea');
                    $.sui.resize(target);
                    setTimeout(function(){
                        var target = that.el.querySelector('textarea');
                        $.sui.resize(target);
                    }, 100);

                });
            } else if (fieldInfo.finalInputType == 'flowdealoption') {
                //如果流程处理意见等html内容中含有img图片，则特殊处理一下
                var images = this.el.querySelectorAll('img');
                var len = images.length;
                for (var i=0; i<len; i++) {
                    var target = images[i];
                    if (typeof target.src == 'string' && !target.src.startsWith('http')) {
                        var src = target.src;
                        if (src.startsWith('file://')) {
                            src = src.replace('file://', '');
                        }
                        target.src = $.serverIp + src;
                    }
                }
            }

        },
        setOptions: function(model) {
            var str = $.i18n('form.select.notice') || '--请选择--';
            var items = model.items;
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });

                if (items[0].display == '' || items[0].value == '0') {
                    //在关联表单中，控件都是browse
                    //if (model.auth == 'edit') {
                    //    items[0].text = str;
                    //} else {
                    //    items[0].text = ''
                    //}

                    items[0].text = '';
                    items[0].value = '';
                }
            }
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);