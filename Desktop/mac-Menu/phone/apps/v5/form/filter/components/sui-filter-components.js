/**
 * Created by yangchao on 2017/1/5.
 */


(function ($, Vue, doc) {
    'use strict';

    var filterRoot = '';
    if (cmp.platform.CMPShell) {
        filterRoot = 'http://form.v5.cmp/v/filter';
    } else {
        filterRoot = '/seeyon/m3/apps/v5/form/filter';
    }

    var i18nMap = {
        'en' : {
            'org.select.member': 'Select Member',
            'org.select.account': 'Select Company',
            'org.select.department': 'Select Department',
            'org.select.post': 'Select Post',
            'org.select.level': 'Select Level',
            'org.select.external.member': 'Select External Member',
            'org.select.external.org': 'Select External Organization',
            'org.select.external.account': 'Select External Company',
            'org.select.external.post': 'Select External Post',
            'select.time': 'Select Time',
            'select.project': 'Select Project',
            'startTime': 'StartTime',
            'endTime': 'EndTime',
            'keyWord': 'Please Enter Key Word',
            'full': 'Full'
        },
        'zh-CN': {
            'org.select.member': '选择人员',
            'org.select.account': '选择单位',
            'org.select.department': '选择部门',
            'org.select.post': '选择岗位',
            'org.select.level': '选择职务级别',
            'org.select.external.member': '选择外部人员',
            'org.select.external.org': '选择外部机构',
            'org.select.external.account': '选择外部单位',
            'org.select.external.post': '选择外部人员岗位',
            'select.time': '选择时间',
            'select.project': '选择项目',
            'startTime': '开始时间',
            'endTime': '结束时间',
            'keyWord': '请输入关键字',
            'full': '全部'
        },
        'zh-TW': {
            'org.select.member': '選擇人員',
            'org.select.account': '選擇組織',
            'org.select.department': '選擇部門',
            'org.select.post': '選擇崗位',
            'org.select.level': '選擇職務級別',
            'org.select.external.member': '選擇外部人員',
            'org.select.external.org': '選擇外部機构',
            'org.select.external.account': '選擇外部組織',
            'org.select.external.post': '選擇外部人員崗位',
            'select.time': '選擇時間',
            'select.project': '選擇項目',
            'startTime': '開始時間',
            'endTime': '結束時間',
            'keyWord': '請輸入關鍵字',
            'full': '全部'
        }
    }

    //先加载国际化资源文件
    cmp.i18n.load(filterRoot + "/i18n/", "filter",function(){
        var keys = ['filter.btn.clear', 'filter.btn.yes', 'filter.btn.more'];
        keys.forEach(function(key){
            var dom = document.getElementById(key);
            if (dom) {
                dom.innerHTML = cmp.i18n(key);
            }
        });
    });

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
        member: i18nMap[cmp.language || 'zh-CN']['org.select.member'],
        multimember: i18nMap[cmp.language || 'zh-CN']['org.select.member'],
        account: i18nMap[cmp.language || 'zh-CN']['org.select.account'],
        multiaccount: i18nMap[cmp.language || 'zh-CN']['org.select.account'],
        department: i18nMap[cmp.language || 'zh-CN']['org.select.department'],
        multidepartment: i18nMap[cmp.language || 'zh-CN']['org.select.department'],
        post: i18nMap[cmp.language || 'zh-CN']['org.select.post'],
        multipost: i18nMap[cmp.language || 'zh-CN']['org.select.post'],
        level: i18nMap[cmp.language || 'zh-CN']['org.select.level'],
        multilevel: i18nMap[cmp.language || 'zh-CN']['org.select.level']
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

            that.clickHandler = function (e) {
                if (document.activeElement != e.target) {
                    e.target.focus();
                }
                //BUG OA-143818 (2018-4-9) 表单查询组件input框在获取焦点时，定位到最前面了
                e.target.value = e.target.value;
            }.bind(that);

            that.el.addEventListener('tap', that.clickHandler);
            that.el.addEventListener('input', that.changeHandler);
        },
        input_unbind: function (options) {
            var model = options.model;
            var that = options.that;
            that.el.removeEventListener('tap', that.clickHandler);
            that.el.removeEventListener('input', that.changeHandler);
        },
        select_bind: function (options) {
            var model = options.model;
            var that = options.that;
            model.items = model.items || [];
            //如果select是在更多中，将展现为标签
            if (model.__isMore) {
                that.clickHandler = function (e) {
                    var target = e.target;
                    //获取选中item的value

                    if (target.classList.contains('see-icon-v5-common-arrow-down') || target.classList.contains('sui-filter-tag-ctrl')) {
                        model.__expand = !model.__expand;
                        var ctrl = target;
                        if (target.tagName == 'I') {
                            ctrl = target.parentNode;
                        }
                        if (model.__expand) {
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
        time_bind: function (options) {
            var model = options.model;
            var that = options.that;

            var year = new Date().getFullYear();
            var _options = {
                type: model.inputType == 'date' ?  'date' : 'datetime', //默认为date类型
                beginYear: 1900,        //开始时间
                endYear: year + 10      //结束时间
            };
            var options = model.options;
            var optionItems = model.items || [];
            var dtOptions = $.extend(_options, options);
            var _picker = null;

            that.clickHandler = function (e) {
                var target = e.target;
                if (target.classList.contains('see-icon-v5-common-close')) {
                    that.set('');
                    model.__state = 'modified';
                    that.update('');
                } else {
                    dtOptions.value = model.value;
                    _picker = new $.DtPicker(dtOptions);
                    _picker.show(function(res) {
                        var newValue = res.value;
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
        time_unbind: function (options) {
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
                beginYear: 1900,        //开始时间
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

                if (target.classList.contains('see-icon-v5-common-close') && target.classList.contains('timespan-startime')) {
                    var newVal = ',' + endTime;
                    that.set(newVal);
                    model.__state = 'modified';
                    that.update(newVal);
                    return;
                } else if (target.classList.contains('timespan-startime')) {
                    dtOptions.value = startTime;
                    _picker = new $.DtPicker(dtOptions);
                    _picker.show(function(res) {
                        var st = new Date(res.value);
                        var et = new Date(endTime);
                        //兼容ios的 Safari 浏览器不支持Date的带"-"格式的写法。
                        st = isNaN(st) ? new Date(Date.parse(res.value.replace(/-/g, "/"))) : st;
                        et = isNaN(et) ? new Date(Date.parse(endTime.replace(/-/g, "/"))) : et;
                        if (st > et) {
                            $.notification.alert($.i18n('filter.timespan.endtime') || '结束时间不能早于开始时间!', null, '', $.i18n('filter.btn.ok') || '确定');
                        } else {
                            var newValue = (res.value || '') + ',' + endTime;
                            var oldValue = model.value;
                            if (oldValue != newValue) {
                                //更新model
                                that.set(newValue);
                                model.__state = 'modified';
                                that.update(newValue);
                            }
                        }
                        _picker.dispose();
                        _picker = null;
                    }, function(){
                        _picker.dispose();
                        _picker = null;
                    });

                } else if (target.classList.contains('see-icon-v5-common-close') && target.classList.contains('timespan-endtime')) {
                    var newVal = startTime + ',';
                    that.set(newVal);
                    model.__state = 'modified';
                    that.update(newVal);
                    return;
                } else if (target.classList.contains('timespan-endtime')) {
                    dtOptions.value = endTime;
                    _picker = new $.DtPicker(dtOptions);
                    _picker.show(function(res) {
                        var st = new Date(startTime);
                        var et = new Date(res.value);
                        //兼容ios的 Safari 浏览器不支持Date的带"-"格式的写法。
                        st = isNaN(st) ? new Date(Date.parse(startTime.replace(/-/g, "/"))) : st;
                        et = isNaN(et) ? new Date(Date.parse(res.value.replace(/-/g, "/"))) : et;
                        if (st > et) {
                            $.notification.alert($.i18n('filter.timespan.endtime') || '结束时间不能早于开始时间!', null, '', $.i18n('filter.btn.ok') || '确定');
                        } else {
                            var newValue = startTime + ',' + (res.value || '');
                            var oldValue = model.value;
                            if (oldValue != newValue) {
                                //更新model
                                that.set(newValue);
                                model.__state = 'modified';
                                that.update(newValue);
                            }
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
            
            var label = [ "dept", "org", "post", "team", "extP" ];
            if (model.fieldName == "start_member_id") {
                label = [ "dept", "org", "post", "team", "extP", "vjOrg" ];
            }
            
            var vj = false;
            var orgSelectType = orgType;
            
            var externalType = model.externalType;
            if (externalType && externalType != "0") {//V-Join外部组织控件
                vj = true;
                
                if (orgType == "member") {
                    model.desc = i18nMap[cmp.language || 'zh-CN']['org.select.external.member'];
                } else if (orgType == "department") {
                    if (externalType == "1") {//V-Join外部机构
                        orgSelectType = "department_vj1";
                        model.desc = i18nMap[cmp.language || 'zh-CN']['org.select.external.org'];
                    } else {//V-Join外部单位
                        orgSelectType = "department_vj2";
                        model.desc = i18nMap[cmp.language || 'zh-CN']['org.select.external.account'];
                    }
                } else if (orgType == "post") {
                    model.desc = i18nMap[cmp.language || 'zh-CN']['org.select.external.post'];
                }
            }
            
            that.clickHandler = function (e) {

                if (e.target.classList.contains('see-icon-v5-common-close')) {
                    that.set('');
                    model.display = '';
                    model.__state = 'modified';
                    that.update('');
                } else {
                    //计算最大值
                    var maxSize = 1;
                    if ((model.inputType || '').toLowerCase().indexOf('multi')  != -1) {
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
                        //minSize:1, //干掉minSize OA-117950
                        label: label,
                        selectType: orgSelectType,
                        vj: vj,
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
            switch (model.filterType) {
                case 'input':
                    html.push('<div class="sui-filter-ctrl sui-filter-input">');
                    html.push('<input ' + _utils.attrBuilder({placeholder: i18nMap[cmp.language || 'zh-CN']['keyWord'], class:'sui-filter-ctrl-value', value: model.value}) + '/>');
                    html.push('</div>');
                    break;
                case 'select':
                    //如果select是在更多中，将展现为标签
                    if (model.__isMore) {
                        html.push('<div class="sui-filter-ctrl sui-filter-tag">');
                        //展开收拢标签的按钮,如果items大于3才显示,考虑到如果第一个item为空的情况
                        if (model.items.length > 4 || (model.items.length == 4 && !!model.items[0].name)) {
                            html.push('<div class="sui-filter-tag-ctrl">' + i18nMap[cmp.language || 'zh-CN']['full'] + '<i class="see-icon-v5-common-arrow-down"></i></div>');
                        }
                        html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');

                        html.push('<div class="sui-filter-tag-items">');
                        var selectedValues = model.value.split(',');
                        (model.items || []).forEach(function(item){
                            if (item.name) {
                                html.push('<div ' + _utils.attrBuilder({'class':'sui-filter-tag-item ' + (selectedValues.indexOf(item.value) != -1 ? 'sui-filter-tag-item-selected' : '' ), 'data-val':item.value}) + '">' +  item.name.escapeHTML());
                                html.push('</div>');
                            }
                        });
                        html.push('</div>');
                        html.push('</div>');
                    } else {
                        html.push('<div class="sui-filter-ctrl sui-filter-select">');
                        html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');

                        html.push('<div class="sui-filter-select-items">');
                        var selectedValues = model.value.split(',');
                        (model.items || []).forEach(function(item){
                            if (item.name) {
                                html.push('<div ' + _utils.attrBuilder({'class':'sui-filter-select-item ' + (selectedValues.indexOf(item.value) != -1 ? 'sui-filter-select-item-selected' : '' ), 'data-val':item.value}) + '">' +  item.name.escapeHTML());
                                html.push('<i class="see-icon-v5-common-radio-unchecked"></i>');
                                html.push('</div>');
                            }
                        });
                        html.push('</div>');
                        html.push('</div>');
                    }
                    break;
                case 'time':
                    html.push('<div class="sui-filter-ctrl sui-filter-time">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display sui-filter-ctrl-value-time ' + (!!model.value ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (model.value || i18nMap[cmp.language || 'zh-CN']['select.time']) + '</div>');
                    if (!!model.value) {
                        html.push('<i action="clear-value" class="see-icon-v5-common-close"></i>');
                    } else {
                        html.push('<i class="see-icon-v5-common-arrow-down"></i>');
                    }
                    html.push('</div>');
                    break;
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
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display sui-filter-ctrl-value-startime timespan-startime ' + (!!startTime ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (startTime || i18nMap[cmp.language || 'zh-CN']['startTime']) + '</div>');
                    if (!!startTime) {
                        html.push('<i action="clear-value" class="see-icon-v5-common-close timespan-startime"></i>');
                    } else {
                        html.push('<i class="see-icon-v5-common-arrow-down timespan-startime"></i>');
                    }
                    html.push('<div class="timespan-line"><div></div></div>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display sui-filter-ctrl-value-endtime timespan-endtime ' + (!!endTime ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (endTime || i18nMap[cmp.language || 'zh-CN']['endTime']) + '</div>');
                    if (!!endTime) {
                        html.push('<i action="clear-value" class="see-icon-v5-common-close timespan-endtime"></i>');
                    } else {
                        html.push('<i class="see-icon-v5-common-arrow-down timespan-endtime"></i>');
                    }
                    html.push('</div>');
                    break;
                case 'project':
                    html.push('<div class="sui-filter-ctrl sui-filter-project">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    html.push('<div ' + _utils.attrBuilder({class:'sui-filter-ctrl-value-display ' + (!!model.display ? 'sui-filter-ctrl-value-not-null' : '') }) + '>' + (model.display || i18nMap[cmp.language || 'zh-CN']['select.project']).escapeHTML() + '</div>');
                    html.push('<i class="see-icon-v5-common-arrow-right"></i>');
                    html.push('</div>');
                    break;
                //组织控件
                case 'organization':
                    html.push('<div class="sui-filter-ctrl sui-filter-organization">');
                    html.push('<input ' + _utils.attrBuilder({readonly:'true', class:'sui-filter-ctrl-value sui-hide', value: model.value}) + '/>');
                    if (model.value) {
                        html.push('<div class="sui-filter-ctrl-value-display sui-filter-ctrl-value-not-null">' + (model.display) + '</div>');
                        html.push('<i action="clear-value" class="see-icon-v5-common-close"></i>');
                    } else {
                        html.push('<div class="sui-filter-ctrl-value-display">' + (model.desc || '') + '</div>');
                        html.push('<i class="see-icon-v5-common-arrow-right"></i>');
                    }

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
            //_utils.getFilterType(model); 不需要获取filterType了，外面会传入
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