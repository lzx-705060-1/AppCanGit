/**
 * Created by yangchao on 2017/1/5.
 */


(function ($, Vue, doc) {
    'use strict';


    var _filterMap = {
        text: 'input',
        textarea: 'input',
        input: 'input',
        flowdealoption: 'input',
        lable: 'input',
        label: 'input',
        //select
        checkbox: 'select',
        radio: 'select',
        select: 'select',
        //timespan
        date: 'timespan',
        datetime: 'timespan',
        timespan: 'timespan',
        //organization
        member: 'organization',
        multimember: 'organization',
        account: 'organization',
        multiaccount: 'organization',
        department: 'organization',
        multidepartment: 'organization',
        post: 'organization',
        multipost: 'organization',
        level: 'organization',
        multilevel: 'organization',
        //project
        project: 'project'

    };

    var _orgDescMap = {
        member: '选择人员',
        multimember: '选择人员',
        account: '选择单位',
        multiaccount: '选择单位',
        department: '选择部门',
        multidepartment: '选择部门',
        post: '选择岗位',
        multipost: '选择岗位',
        level: '选择职务级别',
        multilevel: '选择职务级别'
    };

    var _utils = {
        attrBuilder: function (attrObj) {
            var html = '';
            for (var key in attrObj) {
                html += ' ' + key + '="' + (attrObj[key] || '') + '"';
            }
            return html;
        },
        getFilterType: function (model) {
            model.filterType = _filterMap[String(model.inputType).toLowerCase()] || 'input';
        },
        geOrgDesc: function (model) {
            model.desc = _orgDescMap[String(model.inputType).toLowerCase()] || 'member';
        },
        input_bind: function (options) {
            var model = options.model;
            var that = options.that;
            that.changeHandler = function (e) {
                var target = e.target;
                var oldValue = model.value;
                var element = that.el.querySelector('.sui-filter-ctrl-value');
                var newValue = (element || {}).value;

                if (oldValue != newValue) {
                    that.set(newValue);
                    model.__state = 'modified';
                }

            }.bind(that);

            that.el.addEventListener('input', that.changeHandler);
        },
        input_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('input', that.changeHandler);
        },
        select_bind: function (options) {
            var model = options.model;
            var that = options.that;
            //如果select是在更多中，将展现为标签
            if (model.isMore) {
                that.clickHandler = function (e) {
                    var target = e.target;
                    //获取选中item的value

                    if (target.classList.contains('see-icon-v5-common-arrow-down') || target.classList.contains('sui-filter-tag-ctrl')) {
                        model.expand = !model.expand;
                        var ctrl = target;
                        if (target.tagName == 'I') {
                            ctrl = target.parentNode;
                        }
                        if (model.expand) {
                            ctrl.classList.add('arrow-expand');
                        } else{
                            ctrl.classList.remove('arrow-expand');
                        }
                    } else {

                        var val = target.getAttribute('data-val');
                        var selectedValues = [];
                        if (model.value != '') {
                            selectedValues = model.value.split(',');
                        }
                        var index = selectedValues.indexOf(val);
                        if (target.classList.contains('sui-filter-tag-item-selected')) {
                            target.classList.remove('sui-filter-tag-item-selected');
                            if (index != -1) {
                                selectedValues.splice(index, 1);
                            }
                        } else {
                            target.classList.add('sui-filter-tag-item-selected');
                            if (index == -1) {
                                selectedValues.push(val);
                            }
                        }

                        var newValue = selectedValues.join(',');
                        that.set(newValue);
                        model.__state = 'modified';
                    }


                }

                that.el.addEventListener('tap', that.clickHandler);
            } else {
                that.clickHandler = function (e) {
                    var target = e.target;
                    if (!target.classList.contains('sui-filter-select-item')) {
                        //如果点击在图标上，获取父元素
                        target = target.parentNode;
                    }

                    //获取选中item的value
                    var val = target.getAttribute('data-val');
                    var selectedValues = [];
                    if (model.value != '') {
                        selectedValues = model.value.split(',');
                    }
                    var index = selectedValues.indexOf(val);
                    if (target.classList.contains('sui-filter-select-item-selected')) {
                        target.classList.remove('sui-filter-select-item-selected');
                        if (index != -1) {
                            selectedValues.splice(index, 1);
                        }
                    } else {
                        target.classList.add('sui-filter-select-item-selected');
                        if (index == -1) {
                            selectedValues.push(val);
                        }
                    }

                    var newValue = selectedValues.join(',');
                    that.set(newValue);
                    model.__state = 'modified';

                }

                that.el.addEventListener('tap', that.clickHandler);
            }
        },
        select_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('tap', that.clickHandler);
        },
        timespan_bind: function (options) {
            var model = options.model;
            var that = options.that;

            var year = new Date().getFullYear();
            var _options = {
                type: model.inputType == 'date' ?  'date' : 'datetime', //默认为date类型
                beginYear: 1970,        //开始时间
                endYear: year + 10      //结束时间
            };
            var options = model.options;
            var optionItems = model.items || [];
            var dtOptions = $.extend(_options, options);
            var _picker = null;


            that.clickHandler = function (e) {
                var target = e.target;
                var arr = model.value.split(',');
                var startTime = arr[0];
                var endTime = '';
                if (arr.length > 1) {
                    endTime = arr[1];
                }

                if (target.classList.contains('sui-filter-ctrl-value-startime')) {
                    dtOptions.value = startTime;
                    _picker = new $.DtPicker(dtOptions);
                    _picker.show(function(res) {
                        var newValue = (res.value || '') + ',' + endTime;
                        var oldValue = model.value;
                        if (oldValue != newValue) {
                            //更新model
                            that.set(newValue);
                            model.__state = 'modified';
                            that.update(newValue);
                        }
                        _picker.dispose();
                        _picker = null;
                    }, function(){
                        _picker.dispose();
                        _picker = null;
                    });

                } else if (target.classList.contains('sui-filter-ctrl-value-endtime')) {
                    dtOptions.value = endTime;
                    _picker = new $.DtPicker(dtOptions);
                    _picker.show(function(res) {
                        var newValue = startTime + ',' + (res.value || '');
                        var oldValue = model.value;
                        if (oldValue != newValue) {
                            //更新model
                            that.set(newValue);
                            model.__state = 'modified';
                            that.update(newValue);
                        }
                        _picker.dispose();
                        _picker = null;
                    }, function(){
                        _picker.dispose();
                        _picker = null;
                    });
                }
            }
            that.el.addEventListener('tap', that.clickHandler);
        },
        timespan_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('tap', that.clickHandler);
        },
        project_bind: function (options) {
            var model = options.model;
            var that = options.that;

            function _eventSelected (selectedId,selectedName) {
                //selectedId 对应value
                //selectedName 对应display

                model.display = selectedName;
                that.set(selectedId);
                model.__state = 'modified';
                that.update(selectedId);
            }

            that.clickHandler = function (e) {
                //使用何涛的插件
                if (typeof $ProjectAccountList == 'undefined') {
                    $.notification.alert('Can not find the js file $ProjectAccountList!', null, '', 'OK');
                    return;
                }

                //调用关联项目逻辑
                var val = model.value;
                $ProjectAccountList.init({
                    selectedId: val,  //被选中的项目ID，非必填
                    eventBack : function(){ //点击项目列表的返回按钮执行的回调
                        //执行关闭项目列表页面
                    },
                    eventSelected : function(selectedId,selectedName){ //选择项目之后执行的回调
                        _eventSelected(selectedId, selectedName);
                    }
                });
            }
            that.el.addEventListener('tap', that.clickHandler);

        },
        project_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('tap', that.clickHandler);
        },
        organization_bind: function (options) {
            var model = options.model;
            var that = options.that;
            var orgType = model.inputType.replace('multi', '');
            _utils.geOrgDesc(model);

            that.clickHandler = function (e) {
                //计算最大值
                var maxSize = 1;
                if ((model.fieldType || '').toLowerCase()  == 'longtext') {
                    //如果是longtext不需要限制个数
                    maxSize = 9999999999;
                }

                var fillBackData = [];
                model.display = model.display.replace(/、/g, ',');
                var ids = model.value.split(',');
                var names = model.display.split(',');
                var len = ids.length;
                for (var i = 0; i < len; i++) {
                    if (ids[i]) {
                        fillBackData.push({id: ids[i], name: names[i], type: orgType});
                    }
                }

                var ctrlId = 'select-filter-' + model.title;
                cmp.selectOrgDestory(ctrlId);
                cmp.selectOrg(ctrlId,{
                    type:2,
                    fillBackData:fillBackData,
                    maxSize: maxSize,
                    minSize:-1,
                    selectType: orgType,
                    callback:function(result){
                        var ret = JSON.parse(result);
                        console.log(ret);
                        var ids = [];
                        var displays = [];
                        (ret.orgResult || []).forEach(function(item){
                            ids.push(item.id);
                            displays.push(item.name);
                        });


                        var newValue = ids.join(',');
                        var oldValue = model.value;
                        if (oldValue != newValue) {
                            //更新model
                            model.display = displays.join(',');
                            that.set(newValue);
                            model.__state = 'modified';
                            that.update(newValue);
                        }
                        cmp.selectOrgDestory(ctrlId);
                    },
                    closeCallback: function () {
                        cmp.selectOrgDestory(ctrlId);
                    }
                });
            }

            that.el.addEventListener('tap', that.clickHandler);

        },
        organization_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('tap', that.clickHandler);
        },
        htmlBuilder: function (options) {
            var that = options.that;
            var model = options.model;
            var html = [];
            switch (model.inputType) {
                case 'text':
                case 'textarea':
                case 'input':
                case 'flowdealoption':
                case 'lable':
                case 'label':
                    html.push('<div class="sui-filter-ctrl sui-filter-input">');
                    html.push('<input ' + _utils.attrBuilder({placeholder:'请输入关键字', class:'sui-filter-ctrl-value', value: model.value}) + '/>');
                    html.push('</div>');
                    break;
                case 'checkbox':
                case 'radio':
                case 'select':
                    //如果select是在更多中，将展现为标签
                    if (model.isMore) {
                        html.push('<div class="sui-filter-ctrl sui-filter-tag">');
                        //展开收拢标签的按钮
                        html.push('<div class="sui-filter-tag-ctrl">全部<i class="see-icon-v5-common-arrow-down"></i></div>');
                        html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');

                        html.push('<div class="sui-filter-tag-items">');
                        var selectedValues = model.value.split(',');
                        (model.items || []).forEach(function(item){
                            html.push('<div ' + _utils.attrBuilder({'class':'sui-filter-tag-item ' + (selectedValues.indexOf(item.value) != -1 ? 'sui-filter-tag-item-selected' : '' ), 'data-val':item.value}) + '">' +  item.text);
                            html.push('</div>');
                        });
                        html.push('</div>');
                        html.push('</div>');
                    } else {
                        html.push('<div class="sui-filter-ctrl sui-filter-select">');
                        html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');

                        html.push('<div class="sui-filter-select-items">');
                        var selectedValues = model.value.split(',');
                        (model.items || []).forEach(function(item){
                            html.push('<div ' + _utils.attrBuilder({'class':'sui-filter-select-item ' + (selectedValues.indexOf(item.value) != -1 ? 'sui-filter-select-item-selected' : '' ), 'data-val':item.value}) + '">' +  item.text);
                            html.push('<i class="see-icon-v5-common-radio-unchecked"></i>');
                            html.push('</div>');
                        });
                        html.push('</div>');
                        html.push('</div>');
                    }
                    break;
                case 'date':
                case 'datetime':
                case 'timespan':
                    //将value拆分
                    var arr = model.value.split(',');
                    var startTime = '';
                    var endTime = '';
                    startTime = arr[0];
                    if (arr.length > 1) {
                        endTime = arr[1];
                    }

                    html.push('<div class="sui-filter-ctrl sui-filter-timespan">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display sui-filter-ctrl-value-startime ' + (!!startTime ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (startTime || '开始时间') + '</div>');
                    html.push('<div class="timespan-line"><div></div></div>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display sui-filter-ctrl-value-endtime ' + (!!endTime ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (endTime || '结束时间') + '</div>');
                    html.push('</div>');
                    break;
                case 'project':
                    html.push('<div class="sui-filter-ctrl sui-filter-project">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display ' + (!!model.display ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (model.display || '选择项目') + '</div>');
                    html.push('<i class="see-icon-v5-common-arrow-right"></i>');
                    html.push('</div>');
                    break;
                //组织控件
                case 'member':
                case 'multimember':
                case 'account':
                case 'multiaccount':
                case 'department':
                case 'multidepartment':
                case 'post':
                case 'multipost':
                case 'level':
                case 'multilevel':
                    html.push('<div class="sui-filter-ctrl sui-filter-organization">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    if (model.value) {
                        html.push('<div class="sui-filter-ctrl-value-display sui-filter-ctrl-value-not-null">' + (model.display) + '</div>');
                    } else {
                        html.push('<div class="sui-filter-ctrl-value-display">' + (model.desc || '') + '</div>');
                    }
                    html.push('<i class="see-icon-v5-common-arrow-right"></i>');
                    html.push('</div>');
                    break;
            }


            return html.join('');

        }
    };

    Vue.directive('sui-filter-component', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var that = this;
            _utils.getFilterType(model);
            model.display = model.display || '';

            if (typeof _utils[model.filterType + '_bind'] == 'function') {
                _utils[model.filterType + '_bind']({that: that, model:model});
            }


        },
        update: function (newValue) {
            var model = this.params.scope.model;
            var that = this;
            this.el.innerHTML = _utils.htmlBuilder({that: that, model:model});
        },
        unbind: function () {
            var model = this.params.scope.model;
            var that = this;
            if (typeof _utils[model.filterType + '_unbind'] == 'function') {
                _utils[model.filterType + '_unbind']({that: that, model:model});
            }
        }
    });


})(cmp, Vue, document);
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
            show: false,
            data: options.data || []
        };
        this._vue = null;
        this._lastTarget = null;
        this._curTargetId = null;
        this._init(this._data, this._containerId);
    }

    /*以下是Filter的具体实现*/

    Filter.prototype._prepareData = function () {
        var map = {};
        this._bindData.data.forEach(function(item){
            item.isMore = true;
            item.show = false;
            item.expand = false;
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
        that._bindData.show = false;
    }

    Filter.prototype._onReset = function () {
        console.log('reset');
        var that = this;
        //遍历当前的数据，将item.show === true的数据value清空
        this._bindData.data.forEach(function(item){
            if (item.show) {
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
        var html = [];
        html.push(' <div id="' + that._uuid + '" style="height:calc(100% - ' + top + ');top:' + top +';" class="sui-filter-wrapper" v-show="scope.show">');
        html.push('<div class="sui-filter-bg"></div>');
        html.push('<div class="sui-filter-content">');
        html.push('<div class="sui-filter-main" style="max-height:' + maxHeight + 'px;">');

        html.push('<div class="sui-filter-main-component sui-filter-{{item.inputType}} is-more-{{item.isMore}}" v-for="item in scope.data" track-by="$index" v-show="item.show">');
        html.push('<div class="sui-filter-main-component-header" v-show="item.isMore"  v-bind:class="{\'sui-filter-main-component-collapse\': !item.expand}">');
        html.push('<div class="header-title"><div class="header-title-line"></div><div class="header-title-text">{{item.title}}</div></div>');
        html.push('</div>');
        html.push('<div class="sui-filter-main-component-content" v-bind:class="{\'sui-filter-main-component-collapse\': !item.expand}">');
        html.push('<div v-sui-filter-component="item.value" v-bind:scope="{model:item}"></div>');
        html.push('</div>');
        html.push('</div>');

        html.push('</div>'); //sui-filter-main
        html.push('<div class="sui-filter-footer">');
        html.push('<div class="sui-filter-footer-left"><div class="sui-filter-footer-btn-reset">清 除</div></div>');
        html.push('<div class="sui-filter-footer-right"><div class="sui-filter-footer-btn-ok">确 认</div></div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');

        var ctrl = document.createElement('div');
        ctrl.innerHTML = html.join('');
        var ctrlInner = ctrl.children[0];
        var cover = ctrlInner.children[0];
        var content = ctrlInner.children[1];
        document.body.appendChild(ctrl.children[0]);

        cover.addEventListener('click', function(e){
            that._bindData.show = false;
        });

        content.addEventListener('click', function(e){
            var target = e.target;
            if (target.classList.contains('sui-filter-footer-btn-reset')) {
                that._onReset();
            } else if (target.classList.contains('sui-filter-footer-btn-ok')) {
                that._onCallBack();
            }
        });

        if (typeof Vue != 'undefined') {
            that._vue = new Vue({
                el: '#' + that._uuid,
                data: {scope: that._bindData},
                methods: {

                }
            });
        }
    }

    Filter.prototype._toggle = function () {
        if ( this._curTargetId == 'more') {
            //将所有更多的show设置为true
            var len = this._bindData.data.length;
            this._bindData.data.forEach(function(item){
                if (item.isMore) {
                    item.show = true;
                } else {
                    item.show = false;
                }
            });
        } else if (this._curTargetId) {
            this._bindData.data.forEach(function(item){
                item.show = false;
            });
            var item = this._dataDict[this._curTargetId];
            if (item) {
                item.show = true;
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
            data[i].isMore = false;
            html.push('<div class="sui-filter-ctrl-item-3" data-id="' + data[i].title + '">');
            html.push('<sapn class="header-title">' + data[i].title);
            html.push('<i class="see-icon-v5-common-arrow-down"></i>');
            html.push('</sapn>');
            html.push('</div>');
        }
        if (data.length > 2) {
            html.push('<div class="sui-filter-ctrl-item-3" data-id="more">');
            html.push('<sapn class="header-title">更多');
            html.push('<i class="see-icon-v5-common-arrow-down"></i>');
            html.push('</sapn>');
            html.push('</div>');
        }
        html.push('</div></div>'); //sui-filter-ctrls

        var container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html.join('');
            //绑定事件
            container.addEventListener('click', function(e){
                var filter = document.getElementById(that._uuid);
                //获取被点击的父元素sui-filter-ctrl-item-3
                var target = _getParentDomNodeByClass(e.target, 'sui-filter-ctrl-item-3');
                if (filter) {
                    //如果_lastTarget跟当前的target不一样，则block
                    if (that._lastTarget != target) {
                        that._bindData.show = true;
                        //lastTarget合拢，当前target展开
                        if (that._lastTarget){
                            that._lastTarget.classList.remove('arrow-expand');
                        }
                        target.classList.add('arrow-expand');

                    } else {
                        that._bindData.show = !that._bindData.show;
                        if (that._bindData.show) {
                            target.classList.add('arrow-expand');
                        } else {
                            target.classList.remove('arrow-expand');
                        }
                    }
                } else {
                    that._installPlugin(container);
                }
                console.log(target);
                that._lastTarget = target;
                var dataId = target.getAttribute('data-id');
                that._curTargetId = dataId;
                that._toggle();

            });
            that._installPlugin(container);
        }
    }

    function _getParentDomNodeByClass (elem, classSelector) {
        if (elem.classList.contains(classSelector))
            return elem;

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


    Filter.version = '1.0.0';
    return Filter;

}));