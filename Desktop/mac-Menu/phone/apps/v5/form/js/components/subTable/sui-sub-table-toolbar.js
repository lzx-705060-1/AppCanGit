/**
 * Created by yangchao on 2016/6/6.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-sub-table-toolbar', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var items = s3scope.data.children[tableName].data;
            var item = this.params.scope.item;
            var toolId = 'sub-table-' + tableName + '-' + item.__id;
            var that = this;

            that.update();
            function _afterInsertRecord (record) {
                //返回的数据中，children中的记录如果有__id
                if (s3scope.metadata.templateType == 'lightForm' && record) {
                    $.sui.nextTick(function(){
                        var dom = document.querySelector('[recordid="' + record.__id + '"]');
                        if (dom) {
                            $.sui.scrollIntoView(dom);
                            dom.classList.add('sui-sub-table-new-record');
                        }
                    });
                }
            }

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
                locked = true;
                var action = e.target.getAttribute('action');
                var index = items.indexOf(item);
                if (action == 'copy' || action == 'empty') {
                    cmp.dialog.loading();
                    $.sui.addRecordInSubTable(action, tableName, item, function(err, record){
                        cmp.dialog.loading(false);
                        if (!err) {
                            _afterInsertRecord(record);
                        }
                        locked = false;
                    });


                } else if (action == 'del') {
                    if (items.length > 1) {
                        var msg = $.i18n('form.childrenTable.deleteConfirm');
                        $.notification.confirm(msg, function(num){
                            if (num == 1) {
                                cmp.dialog.loading();
                                $.sui.delRecordInSubTable('del', tableName, item, function(err, result){
                                    cmp.dialog.loading(false);
                                    locked = false;
                                    if (err) {
                                        $.notification.alert(err.message || err.msg || 'Error when calling $.sui.delRecordInSubTable!', null, '', $.i18n('form.btn.ok'));
                                    } else {
                                        items.splice(index, 1);
                                    }
                                });
                            } else {
                                locked = false;
                            }

                        }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);

                    } else {
                        $.notification.alert($.i18n('form.childrenTable.deleteLastNotice'), null, '', $.i18n('form.btn.ok'));
                        locked = false;
                    }
                } else if (action == 'selectItem') {
                    item.selected = !item.selected;
                    $.sui.trigger('onsubtablecheck');
                    locked = false;
                } else {
                    locked = false;
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);


            this.subTableCheckHandler = function (e) {
                that.update();
            }.bind(this);

            this.updateToolbarHandler = function (e) {
                that.update();
            }.bind(this);

            document.addEventListener('onsubtablecheck', this.subTableCheckHandler);
            document.addEventListener('onupdatetoolbar', this.updateToolbarHandler);
        },
        update: function () {

            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var items = s3scope.data.children[tableName].data;
            var item = this.params.scope.item;
            var toolId = 'sub-table-' + tableName + '-' + item.__id;
            var html = '';
            if (s3scope.data.children[tableName].allowDelete || s3scope.data.children[tableName].allowAdd || s3scope.allowCheck) {
                html = '<div id="' + toolId + '" class="sui-sub-table-btns">';

                if (s3scope.allowCheck) {
                    if (item.selected) {
                        html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked"></i>';
                    } else {
                        html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked"></i>';
                    }
                    //html += '<i action="selectAll" v-show="s3scope.data.children["' + tableName + '"].selected" class="see-icon-v5-form-checkbox-checked"></i>';
                    //html += '<i action="selectAll" v-show="!s3scope.data.children["' + tableName + '"].selected" class="see-icon-v5-form-checkbox-unchecked"></i>';
                }

                if (s3scope.data.children[tableName].allowAdd) {
                    html += '<i action="copy" class="toolbar-btn see-icon-v5-form-new-circle"></i>';
                    html += '<i action="empty" class="toolbar-btn see-icon-v5-form-copy-circle"></i>';
                }
                if (s3scope.data.children[tableName].allowDelete) {
                    html += '<i action="del" class="toolbar-btn see-icon-v5-form-remove-circle"></i>';
                }

                html += '</div>';
            }

            this.el.innerHTML = html;


            //html = '<div id="' + toolId + '" class="sui-sub-table-btns" v-show="s3scope.allowCheck||s3scope.data.children[\'' + tableName + '\'].allowDelete||s3scope.data.children[\'' + tableName + '\'].allowAdd">';
            //html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked" v-show="s3scope.allowCheck&&item.selected"></i>';
            //html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked" v-show="s3scope.allowCheck"></i>';
            //html += '<i action="copy" class="toolbar-btn see-icon-v5-form-new-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowAdd"></i>';
            //html += '<i action="empty" class="toolbar-btn see-icon-v5-form-copy-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowAdd"></i>';
            //html += '<i action="del" class="toolbar-btn see-icon-v5-form-remove-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowDelete"></i>';
            //html += '</div>';

            //var dom = document.createElement('div');
            //dom.innerHTML = html;
            //this.vm.$compile(dom, s3scope);
            //Array.apply(null, this.el.children).forEach(function(item){
            //    item.remove();
            //});
            //this.el.appendChild(dom);

        },
        //paramWatchers
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            document.removeEventListener('onsubtablecheck', this.subTableCheckHandler);
            document.removeEventListener('onupdatetoolbar', this.updateToolbarHandler);

        }
    })

})(cmp, Vue, document);