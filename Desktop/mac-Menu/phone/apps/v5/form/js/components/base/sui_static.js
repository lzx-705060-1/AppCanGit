/**
 * Created by yangchao on 2016/8/1.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-static', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            this.onLoadHandler = function (e) {
                if (s3scope.metadata.templateType == 'infopath') {
                    $.sui.refreshIScrollAsync();
                }
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;

            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

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

        },
        unbind: function () {
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);