/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    function _checkAll (data, selected) {
        (data || []).forEach(function(item){
            item.selected = selected;
        });
    }

    function _isAllChecked (data) {
        var len = (data || []).length;
        for (var i=0; i<len; i++) {
            if (!data[i].selected) {
                return false;
            }
        }
        return true;
    }

    Vue.directive('sui-sub-table-check-all', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var that = this;
            var checked = false;

            this.clickHandler = function (e) {

                if (e.target.classList.contains('see-icon-v5-form-checkbox-checked')) {
                    this.set(false);
                    _checkAll(s3scope.data.children[tableName].data, false);
                    checked = false;
                    $.sui.trigger('onsubtablecheck');
                } else {
                    this.set(true);
                    _checkAll(s3scope.data.children[tableName].data, true);
                    checked = true;
                    $.sui.trigger('onsubtablecheck');
                }

            }.bind(this);

            //搭车绑定一个暂开合拢重复表的事件
            this.expandHandler = function (e) {
                var subTable = e.target.parentNode.parentNode.parentNode;
                var domArr = subTable.querySelectorAll('textarea');
                var len = domArr.length;
                for (var i=0; i<len; i++) {
                    var target = domArr[i];

                    (function (textarea) {
                        $.sui.nextTick(function(){
                            $.sui.resize(textarea);
                        });
                    })(target);
                }
            }
            var arrowDown =  this.el.parentNode.querySelector('.see-icon-v5-form-arrow-down');
            if (arrowDown) {
                arrowDown.addEventListener('tap', this.expandHandler);
            }


            this.el.addEventListener('tap', this.clickHandler);
            this.el.classList.add('sui-sub-table-check-all');

            this.subTableCheckHandler = function (e) {
                var ret = _isAllChecked(s3scope.data.children[tableName].data);
                that.update(ret);
            }.bind(this);

            document.addEventListener('onsubtablecheck', this.subTableCheckHandler);

        },
        update: function (newValue) {
            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var data = s3scope.data.children[tableName].data;
            var html = ''
            if (newValue) {
                html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked"></i>';
            } else {
                html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked-my"></i>';
            }

            this.el.innerHTML = html;

        },
        unbind: function () {
            var arrowDown =  this.el.parentNode.querySelector('.see-icon-v5-form-arrow-down');
            if (arrowDown) {
                arrowDown.removeEventListener('tap', this.expandHandler);
                arrowDown = null;
            }
            this.el.removeEventListener('tap', this.clickHandler);
            document.removeEventListener('onsubtablecheck', this.subTableCheckHandler);

        }
    })

})(cmp, Vue, document);