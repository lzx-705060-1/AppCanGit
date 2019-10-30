/**
 * Created by yangchao on 2016/5/31.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-date', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            var year = new Date().getFullYear();
            var _options = {
                type: fieldInfo.finalInputType == 'date' ?  'date' : 'datetime',           //默认为date类型
                beginYear: 1900,        //开始时间
                endYear: year + 50      //结束时间 /*客户BUG 20180124053263 默认将endYear设置为当前+50*/
            };

            var that = this;
            var options = this.params.scope.options;
            var optionItems = model.items || [];
            var dtOptions = $.extend(_options, options);
            var _picker = null;

            //判断权限是否绑定点击事件
            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var action = e.target.getAttribute('action');

                //如果是点击的清除数据，则停止冒泡
                if (action == 'clear-value') {
                    that.set('');
                    model.display = '';
                    model.__state = 'modified';
                    this.update('');
                    $.sui.doCalculate(that.el, fieldInfo);
                    e.stopPropagation();
                    return;
                }

                dtOptions.value = model.value;
                _picker = new $.DtPicker(dtOptions);
                console.log(_picker);
                _picker.show(function(res) {
                    var newValue = res.value || '';
                    console.log(newValue);
                    var oldValue = model.value;
                    if (oldValue != newValue) {
                        //更新model
                        that.set(newValue);
                        model.__state = 'modified';
                        that.update(newValue);

                        $.sui.doCalculate(that.el, fieldInfo);
                    }
                    _picker.dispose();
                    _picker = null;
                }, function(){
                    _picker.dispose();
                    _picker = null;
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            var delDom = this.el.querySelector('.see-icon-v5-form-close-circle-fill');
            ///this.el.querySelector('.see-icon-v5-form-close-circle-fill').addEventListener('click', this.clearDataHandler);

        },
        update: function (newValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);