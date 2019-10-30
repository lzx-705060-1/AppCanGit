/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-mapphoto', {
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
                $.sui.mapphoto_clickHandler(e, that, model, fieldInfo);
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);
        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);

        }
    })

})(cmp, Vue, document);