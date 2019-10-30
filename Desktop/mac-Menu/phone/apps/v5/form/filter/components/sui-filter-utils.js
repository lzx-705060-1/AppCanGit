/**
 * Created by yangchao on 2016/12/30.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && (define.amd || define.cmd) ? define(factory) :
            (global.SuiFilter = factory());
} (this, function () {
    'use strict';

    function Filter (options) {
        this._data = options.data || [];
        this._containerId = options.containerId || '';
        this._callback = options.success;
        this._uuid = this._containerId + '_' + new Date().getTime();
        this._bindData = {
            __show: false,
            data: options.data || []
        };
        this._contentMaxHeight = 0;
        this._diffHeight = 185;
        this._vue = null;
        this._lastTarget = null;
        this._curTargetId = null;
        this._init(this._data, this._containerId);
    }

    /*以下是Filter的具体实现*/

    Filter.prototype.destroy = function () {
        var that = this;
        if (that._vue) {
            that._vue.$destroy();
            that._vue = null;
        }

        if (that._container) {
            that._container.removeEventListener('tap', that._containerClickHandler);
            that._container.innerHTML = '';
        }

        if (that._content) {
            that._content.removeEventListener('tap', that._contentClickHandler);
        }

        if (that._cover) {
            that._cover.removeEventListener('tap', that._coverClickHandler);
        }

        var filter = document.getElementById(that._uuid);
        if (filter) {
            filter.remove();
        }

        document.body.removeEventListener('scroll', that._documentScrollHandler);
    }

    Filter.prototype._prepareData = function () {
        var map = {};
        this._bindData.data.forEach(function(item){
            item.__isMore = true;
            item.__show = false;
            item.__expand = false;
            map[item.title] = item;
        });
        this._dataDict = map;
    }

    Filter.prototype._init = function (data, containerId) {
        this._prepareData();
        this._bindHeader(data, containerId);
    }

    Filter.prototype._onCallBack = function () {
        var that = this;
        //遍历数据，找到有值的部分

        var indexArr = [];
        var len = that._bindData.data.length;
        for (var i=0; i<len; i++) {
            var item = that._bindData.data[i];
            if (item.value != '') {
                var index = i > 2 ? 2 : i;
                if (indexArr.indexOf(index) == -1) {
                    indexArr.push(index);
                }
            }
        }

        var parentDom = that._lastTarget.parentNode;
        var count = parentDom.children.length;
        for (var i=0; i<count; i++){
            parentDom.children[i].classList.remove('is-valid');
        }

        indexArr.forEach(function(index){
            parentDom.children[index].classList.add('is-valid');
        });

        if (typeof that._callback == 'function') {
            //获取已选的数据
            var results = JSON.stringify(that._bindData.data);
            that._callback(JSON.parse(results));
        }
        that._bindData.__show = false;
    }

    Filter.prototype._onReset = function () {
        console.log('reset');
        var that = this;
        //遍历当前的数据，将item.show === true的数据value清空
        this._bindData.data.forEach(function(item){
            if (item.__show) {
                item.display = '';
                item.value = '';

                if (that._lastTarget){
                    that._lastTarget.classList.remove('is-valid');
                }

                //if (item.filterType == 'timespan') {
                //    item.value = [];
                //} else {
                //    item.value = '';
                //}
            }
        });
    }

    Filter.prototype._installPlugin = function (container) {
        var that = this;
        //在body下append filter
        var containerRect = container.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        var bodyHeight = bodyRect.bottom - bodyRect.top;
        var containerBottom = containerRect.bottom;
        var top = (containerBottom + 0) + 'px'; //header的下边框与插件展开时上边框重合，所以减去1像素
        var maxHeight = bodyHeight - containerBottom - 1 - 53; //最下方的最顶的条是 53px，加上border
        that._contentMaxHeight = maxHeight;
        var html = [];
        html.push(' <div id="' + that._uuid + '" style="height:calc(100% - ' + top + ');top:' + top +';" class="sui-filter-wrapper" v-show="scope.__show">');
        html.push('<div class="sui-filter-bg"></div>');
        html.push('<div class="sui-filter-content">');
        html.push('<div class="sui-filter-main" style="max-height:' + maxHeight + 'px;">');

        html.push('<div class="sui-filter-main-component sui-filter-{{item.inputType}} is-more-{{item.__isMore}}" v-for="item in scope.data" track-by="$index" v-show="item.__show">');
        html.push('<div class="sui-filter-main-component-header" v-show="item.__isMore"  v-bind:class="{\'sui-filter-main-component-collapse\': !item.__expand}">');
        html.push('<div class="header-title"><div class="header-title-line"></div><div class="header-title-text">{{item.title}}</div></div>');
        html.push('</div>');
        html.push('<div class="sui-filter-main-component-content" v-bind:class="{\'sui-filter-main-component-collapse\': !item.__expand}">');
        html.push('<div v-sui-filter-component="item.value" v-bind:scope="{model:item}"></div>');
        html.push('</div>');
        html.push('</div>');

        html.push('</div>'); //sui-filter-main
        html.push('<div class="sui-filter-footer">');
        html.push('<div class="sui-filter-footer-left"><div class="sui-filter-footer-btn-reset" id="filter.btn.clear">' + (cmp.i18n && cmp.i18n('filter.btn.clear') || '清 空') +'</div></div>');
        html.push('<div class="sui-filter-footer-right"><div class="sui-filter-footer-btn-ok" id="filter.btn.yes">' + (cmp.i18n && cmp.i18n('filter.btn.yes') || '确 认') + '</div></div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');

        var ctrl = document.createElement('div');
        ctrl.innerHTML = html.join('');
        var ctrlInner = ctrl.children[0];
        var cover = ctrlInner.children[0];
        var content = ctrlInner.children[1];
        document.body.appendChild(ctrl.children[0]);

        that._coverClickHandler = function(e) {
            that._bindData.__show = false;
            if (that._lastTarget) {
                that._lastTarget.classList.remove('arrow-expand');
                that._inputBlur();
            }
        }.bind(that);
        that._cover = cover;
        that._cover.addEventListener('tap', that._coverClickHandler);

        that._contentClickHandler = function (e) {
            var target = e.target;
            if (target.classList.contains('sui-filter-footer-btn-reset')) {
                that._onReset();
            } else if (target.classList.contains('sui-filter-footer-btn-ok')) {
                //将所有input控件失去焦点
                that._inputBlur();
                if (that._lastTarget) {
                    that._lastTarget.classList.remove('arrow-expand');
                }
                that._onCallBack();
            }
        }.bind(that);
        that._content = content;
        that._content.addEventListener('tap', that._contentClickHandler);

        if (typeof Vue != 'undefined') {
            if (that._vue) {
                that._vue.$destroy();
                that._vue = null;
            }
            that._vue = new Vue({
                el: '#' + that._uuid,
                data: {scope: that._bindData},
                methods: {

                }
            });
        }
    }


    Filter.prototype._inputBlur = function () {
        return;
        var filter = document.getElementById(this._uuid);
        if (filter) {
            var inputs = filter.querySelectorAll('input');
            var len = inputs.length;
            for (var i=0; i<len; i++) {
                inputs[i].blur();
            }
        }
    }

    Filter.prototype._toggle = function (filter) {
        //将之前展开的header合拢
        var that = this;
        var mainContent = filter.querySelector('.sui-filter-main');
        if ( this._curTargetId == 'more') {
            //将所有更多的show设置为true
            var len = this._bindData.data.length;
            this._bindData.data.forEach(function(item){
                if (item.__isMore) {
                    item.__show = true;
                } else {
                    item.__show = false;
                }
            });

            //修改maxHeight
            if (mainContent) {
                mainContent.style.maxHeight = that._contentMaxHeight + 'px';
            }

        } else if (this._curTargetId) {
            this._bindData.data.forEach(function(item){
                item.__show = false;
            });
            var item = this._dataDict[this._curTargetId];
            if (item) {
                item.__show = true;
            }

            //修改maxHeight
            if (mainContent) {
                mainContent.style.maxHeight = (that._contentMaxHeight - that._diffHeight) + 'px';
            }
        }
    }


    Filter.prototype._bindHeader = function (data, containerId) {
        var that = this;
        var html = [];
        var loop = data.length > 2 ? 2 : data.length;
        html.push('<div class="sui-filter"><div class="sui-filter-ctrls">');
        for (var i=0; i<loop; i++) {
            //前两个的isMore属性是false
            data[i].__isMore = false;
            html.push('<div class="sui-filter-ctrl-item-3 ' + (!!data[i].value ? 'is-valid' : '') + '" data-id="' + data[i].title + '">');
            html.push('<sapn class="header-title">' + data[i].title);
            html.push('<i class="see-icon-v5-common-arrow-down"></i>');
            html.push('</sapn>');
            html.push('</div>');
        }
        if (data.length > 2) {
            var isMoreValid = false;
            var len = data.length;
            for (var j=2; j<len; j++) {
                isMoreValid = isMoreValid || !!data[j].value;
            }
            html.push('<div class="sui-filter-ctrl-item-3 ' + (isMoreValid ? 'is-valid' : '') +'" data-id="more">');
            html.push('<sapn class="header-title" id="filter.btn.more">' + (cmp.i18n && cmp.i18n('filter.btn.more') || '更多'));
            html.push('<i class="see-icon-v5-common-arrow-down"></i>');
            html.push('</sapn>');
            html.push('</div>');
        }
        html.push('</div></div>'); //sui-filter-ctrls

        var container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html.join('');
            //绑定事件
            that._containerClickHandler = function (e) {
                var filter = document.getElementById(that._uuid);
                //获取被点击的父元素sui-filter-ctrl-item-3
                var target = _getParentDomNodeByClass(e.target, 'sui-filter-ctrl-item-3');
                if (filter) {
                    //如果_lastTarget跟当前的target不一样，则block
                    if (target) {
                        if (that._lastTarget != target) {
                            that._bindData.__show = true;
                            //lastTarget合拢，当前target展开
                            if (that._lastTarget){
                                that._lastTarget.classList.remove('arrow-expand');
                            }
                            target.classList.add('arrow-expand');
                        } else{
                            that._bindData.__show = !that._bindData.__show;
                            if (that._bindData.__show) {
                                target.classList.add('arrow-expand');
                            } else {
                                target.classList.remove('arrow-expand');
                            }
                        }
                        that._inputBlur();
                    }

                } else {
                    that._installPlugin(container);
                }
                if (target) {
                    that._lastTarget = target;
                    var dataId = target.getAttribute('data-id');
                    that._curTargetId = dataId;
                    that._toggle(filter);
                }
            }.bind(that);
            that._container = container;
            that._container.addEventListener('tap', that._containerClickHandler);
            that._installPlugin(container);
        }

        that._documentScrollHandler = function (e) {
            var position = window.getComputedStyle(document.body).position;
            var newPosition = position == 'absolute' ? 'static' : 'absolute';
            document.body.style.position = newPosition;
            setTimeout(function(){
                document.body.style.position = position;
            },0);
        }.bind(that);
        //增加一个在body上的兼听，让body 的scroll触发后，强制页面回流
        document.body.addEventListener('scroll', that._documentScrollHandler);
    }

    function _getParentDomNodeByClass (elem, classSelector) {
        //if (elem.classList.contains(classSelector))
        //    return elem;
        //返回父元素以上

        while ((elem = elem.parentElement) !== null) {
            if (elem.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            if (elem.classList.contains(classSelector)) {
                //elements.push(elem);
                return elem;
            }
        }

        return null;

    }


    /*以上是Filter的具体实现*/


    Filter.version = '1.0.1';
    return Filter;

}));