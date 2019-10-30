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