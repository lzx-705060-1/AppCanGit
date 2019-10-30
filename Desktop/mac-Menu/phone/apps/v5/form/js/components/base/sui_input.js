/**
 * Created by yangchao on 2016/5/30.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-input', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var isMaster = this.params.scope.isMaster;
            var that = this;
            var ctrlId = '';

            this.vm.$nextTick(function(){
                ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
            });
            var keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '.', 'Delete', 'Backspace'];
            //pc判断url
            var urlReg = /^(https|http|ftp|rtsp|mms)?:\/\/([0-9A-Za-z_-]+\.?)+(\/[0-9A-Za-z_-]+)*(\.[0-9a-zA-Z-_]*)?(:?[0-9]{1,4})?(\/[\u4E00-\u9FA50-9A-Za-z_-]+\.?[\u4E00-\u9FA50-9A-Za-z_-]+)*(\?([\u4E00-\u9FA50-9a-zA-Z-_]+=[\u4E00-\u9FA50-9a-zA-Z-_%]*(&|&amp;)?)*)?\/?$/;

            this.keydownHandler = function (e) {
                if (!e.ctrlKey && e.keyCode != 8 && e.keyWord != 46) {
                    e.target.setAttribute('notnull', 'true');
                }
            }.bind(this);

            this.changeHandler = function (e) {
                //if (e.target.attr)
                // 将数据写回 vm
                //获取当前value和input的值
                var target = e.target;
                var oldValue = model.value;
                var element = that.el.querySelector('.sui-form-ctrl-value');
                var newValue = (element || {}).value;
                if (newValue) {
                    e.target.setAttribute('notnull', 'false');
                }

                //如果是数字异常，则处理一下
                //if (fieldInfo.fieldType == 'DECIMAL' && e.target.validity.badInput) {
                //    newValue = element.getAttribute('value');
                //    element.value = newValue;
                //}

                if (oldValue != newValue) {
                    //更新model
                    that.set(newValue);
                    model.__state = 'modified';

                    //if (newValue && fieldInfo.fieldType == 'DECIMAL') {
                    //    element.setAttribute('value', newValue);
                    //}

                    //如果是textarea
                    //if (target.tagName == 'TEXTAREA' && s3scope.templateType == 'lightForm') {
                    if (target.tagName == 'TEXTAREA') {
                         $.sui.resize(target);
                    }
                    $.sui.clearErrorTips(that.el);
                    $.sui.preventSubmit = false;
                }

            }.bind(this);

            function refreshInput (element) {

                if (fieldInfo.inCalc || fieldInfo.inCondition) {
                    if (model.__state == 'modified') {
                        //doCalculate之前校验一下长度
                        var ret = $.sui.assertFieldLength(model, fieldInfo);

                        if (!ret.success) {
                            //提示超长
                            $.sui.preventSubmit = true;
                            var errorInfo = {type: 1, info:{}};
                            errorInfo.info[ctrlId] = ret.tips;
                            $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                            $.sui.nextTick(function(){
                                $.sui.preventSubmit = false;
                            });

                            //$.notification.alert(ret.tips, function(){
                            //    $.sui.preventSubmit = false;
                            //}, '', $.i18n('form.btn.ok'));
                            if (fieldInfo.fieldType == 'DECIMAL') {
                                that.set('');
                            } else {
                                //这个字符串的截取耗性能
                                var str = $.sui.utf8SubStr(element.value, Number(fieldInfo.fieldLength));
                                that.set(str);
                            }
                            that.update();
                        }

                        //参与计算
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        var options = {
                            formMasterId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            data: s3scope.data
                        };

                        $.sui.doCalculate(that.el, fieldInfo);

                    }
                }

                //处理必填时的背景色
                if (model.notNull) {
                    if (!model.value) {
                        that.el.children[0].classList.add('sui-form-ctrl-empty');
                    } else {
                        that.el.children[0].classList.remove('sui-form-ctrl-empty');
                    }
                }
            }

            this.focusoutHandler = function (e) {
                console.log('state:', model.__state);
                console.log('in focusoutHandler');
                var element = that.el.querySelector('.sui-form-ctrl-value');
                if (fieldInfo.fieldType == 'DECIMAL' && !element.value) {
                    element.value = '';
                    that.set('');
                    if (element.getAttribute('notnull') == 'true') {
                        $.sui.preventSubmit = true;

                        var errorInfo = {type: 1, info:{}};
                        errorInfo.info[ctrlId] = $.i18n('form.number.notValid');
                        $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                        $.sui.nextTick(function(){
                            $.sui.preventSubmit = false;
                        });

                        //$.notification.alert($.i18n('form.number.notValid'), function(){
                        //    e.target.setAttribute('notnull', 'false');
                        //    $.sui.preventSubmit = false;
                        //}, '', $.i18n('form.btn.ok'));
                    }
                }

                //如果input是pageUrl类型，判断格式是否正确
                if (fieldInfo.formatType == 'urlPage') {
                    if (!!element.value  && !urlReg.test(element.value)){
                        $.sui.preventSubmit = true;

                        var errorInfo = {type: 1, info:{}};
                        errorInfo.info[ctrlId] = $.i18n('form.field.urlNotValid');
                        $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                        $.sui.nextTick(function(){
                            $.sui.preventSubmit = false;
                        });

                        //$.notification.alert($.i18n('form.field.urlNotValid'), function(){
                        //    $.sui.preventSubmit = false;
                        //}, '', $.i18n('form.btn.ok'));
                        element.value = '';
                        that.set('');
                    }
                }

                refreshInput(element);

                //解决在iScroll内部使用scrollIntoView带来的坑
                if (s3scope.metadata.templateType == 'infopath') {
                    setTimeout(function(){
                        var dom = document.querySelector('.sui-form-wrapper');
                        if (dom) {
                            dom.scrollLeft = 0;
                            dom.scrollTop = 0;
                        }
                    },0);
                }

            }.bind(this);


            var input = that.el.querySelector('input');
            this.el.addEventListener('keydown',  this.keydownHandler);
            this.el.addEventListener('input', this.changeHandler);
            this.el.addEventListener('focusout', this.focusoutHandler);

            this.clickHandler = function (e) {
                var target = e.target;

                //软键盘弹起后，让input滚动到可视区域
                //2017-11-30 解决软键盘弹起后输入焦点问题
                if (target.classList.contains('sui-form-ctrl-value')) {
                  //留300毫米给软键盘弹起，然后定位
                  setTimeout(function(){
                    $.sui.scrollIntoViewIfNeeded(target);
                  }, 300);
                }

                if (e.target.classList.contains('sui-input-url')) {
                    if ($.platform.CMPShell) {
                        var url = e.target.getAttribute('src');
                        $.openWebView({url: url, useNativebanner: true});
                    }
                }
                else if (model && $.sui.getFieldAuth(model.auth) == 'add') {
                    //弹出层，然后添加需要add的值
                    //如果是追加属性
                    $.sui.nextTick(function(){
                        $.notification.prompt($.i18n('form.field.appendNotice'), function (index, addValue) {
                            if (index == 0) {
                                //if (addValue != '') {
                                //TODO 暂时获取不到当前用户，后续能获取当前用户后，拼接用户名
                                var line = model.value == '' ? '' : '\r\n';
                                var lastValue = model.value;
                                var userName = ' ';
                                if ($.member && $.member.name) {
                                    userName = $.member.name + ' ';
                                }
                                //如果有换行符，addValue中有\n, 这里将\n替换为 \r\n，适配ios下，ios下\r才有换行效果
                                addValue = addValue.replace(/\n/g, '\r\n');
                                var newValue = model.value + line + addValue + '\r\n\t[' + userName + new Date().format('yyyy-MM-dd hh:mm') + ']';
                                that.set(newValue);

                                var ret = $.sui.assertFieldLength(model, fieldInfo);

                                if (ret.success) {
                                    var input = that.el.querySelector('input');
                                    if (input)  {
                                        input.value = newValue;
                                        //if (newValue && fieldInfo.fieldType == 'DECIMAL') {
                                        //    input.setAttribute('value', newValue);
                                        //}
                                    }
                                        var textarea = that.el.querySelector('textarea');
                                    if (textarea) {
                                        textarea.value = newValue;
                                        that.update(newValue);
                                        $.sui.clearErrorTips(that.el);
                                    }
                                } else {
                                    that.set(lastValue);
                                    var errorInfo = {type: 1, info:{}};
                                    errorInfo.info[ctrlId] = ret.tips;
                                    $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                                    //$.notification.alert(ret.tips, null, '', $.i18n('form.btn.ok'));
                                }

                                model.__state = 'modified';
                                var element = that.el.querySelector('.sui-form-ctrl-value');
                                refreshInput(element);
                                //如果是textarea
                                //if (target.tagName == 'TEXTAREA' && s3scope.templateType == 'lightForm') {
                                if (target.tagName == 'TEXTAREA') {
                                    $.sui.resize(target);
                                }
                            }
                        },[$.i18n('form.btn.ok'), $.i18n('form.btn.cancel')],"","",4);
                    });

                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            var textarea = this.el.querySelector('textarea');
            var that = this;
            //只有在轻表单模式才自动撑开
            //if (textarea && s3scope.templateType == 'lightForm') {
            if (textarea){

                that.vm.$nextTick(function(){
                    var target = that.el.querySelector('textarea');
                    $.sui.resize(target);
                    setTimeout(function(){
                        //有可能点击切换的时候，表单元素被释放了
                        if (that && that.el) {
                            var target = that.el.querySelector('textarea');
                            $.sui.resize(target);
                        }
                    }, 100);

                });
            }

            $.sui.clearErrorTips(that.el);

        },
        unbind: function () {
            this.el.removeEventListener('input', this.changeHandler);
            this.el.removeEventListener('keydown', this.keydownHandler);
            this.el.removeEventListener('focusout', this.focusoutHandler);
            this.el.removeEventListener('tap', this.clickHandler);

        }
    });

})(cmp, Vue, document);
