/**
 * Created by yangchao on 2016/5/31.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-organization', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            var that = this;
            this.clickHandler = function (e) {
                // 将数据写回 vm
                //获取当前value和input的值

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
                    e.stopPropagation();

                    var recordId = $.sui.getRecordIdByVueElement(this.el, fieldInfo);

                    $.sui.dataService.capForm.dealOrgFieldRelation({
                        formDataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        fieldName: fieldInfo.name,
                        recordId: recordId,
                        selectType: fieldInfo.finalInputType,
                        orgId: model.value,
                        data: $.sui.reduceSubmitData(s3scope.data),
                        attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                    }, function(err, data){
                        if (err) {
                            $.notification.alert(err.message || 'Error when calling dealOrgFieldRelation!', null, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        $.sui.refreshFormData(null, !data.results ? data : data.results);
                    });

                    return;
                } else {

                    var opts = {command:1,value:{
                        "selectType":"Member",
                        "isMulti":true,
                        "value": model.value}};

                    //计算最大值
                    var maxSize = 1;
                    if (fieldInfo.finalInputType.indexOf('multi') == 0) {
                        maxSize = Math.floor(fieldInfo.fieldLength / 21);
                        maxSize = maxSize || 1;
                    }

                    if (fieldInfo.fieldType.toLowerCase()  == 'longtext') {
                        //如果是longtext不需要限制个数
                        maxSize = 9999999999;
                    }

                    //控件id
                    var ctrlId = $.sui.getFormCtrlIdByVueElement(this.el);
                    var recordIndex = $.sui.getRecordIndexByVueElement(this.el, fieldInfo);
                    var recordId = $.sui.getRecordIdByVueElement(this.el, fieldInfo);
                    $.sui.lastPosCtrlId = ctrlId;
                    var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: recordId}, fieldInfo);

                    console.log(fieldInfo.finalInputType);
                    console.log(metadata);

                    var fillBackData = [];

                    //is是英文逗号隔开，display是中文顿号隔开，坑
                    model.display = model.display.replace(/,/g, '、');
                    var ids = model.value.split(',');
                    var names = model.display.split('、');

                    var selectType = fieldInfo.finalInputType.replace('multi', '');
                    var len = ids.length;
                    for (var i = 0; i < len; i++) {
                        if (ids[i]) {
                            fillBackData.push({id: ids[i], name: names[i], type: selectType});
                        }
                    }
                    
                    var vj = false;
                    var tempLabel = ["dept","org","post","team","extP"];
                    var orgSelectType = selectType;
                    if (fieldInfo.externalType != "0") {//V-Join外部组织控件
                        vj = true;
                        
                        if (selectType == "department") {
                            if (fieldInfo.externalType == "1") {//V-Join外部机构
                                orgSelectType = "department_vj1";
                            } else {//V-Join外部单位
                                orgSelectType = "department_vj2";
                            } 
                        }
                    } else {
                        if (selectType == "member") {//内部人员控件可以选择V-Join人员
                            tempLabel = ["dept","org","post","team","extP","vjOrg"];
                        }
                    }

                    $.selectOrgJump("select-jump",{
                        type:2,             //选人组件的类型1、流程选人；2、轻表单选人
                        fillBackData:fillBackData,    //第一次调用时的回填值
                        maxSize:maxSize,    //只要不等于1，都认为是多选
                        minSize:-1,
                        debug: $.sui.dataService.debug,
                        _proxyServer: $.sui.dataService.proxyServer,
                        _targetServer: $.sui.dataService.targetServer,
                        _sessionId: $.sui.dataService.sessionId,
                        label : tempLabel,
                        selectType: orgSelectType,//选人类型：1、'member':选人；2、'department':选部门；3、'account':选单位；4、'post':选岗位；5、'level':选职务级别
                        vj: vj,
                        pageKey: $.sui.getTempKey(),
                        metadata: metadata
                    });
                }

            }.bind(this);


            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);

        }
    })

})(cmp, Vue, document);
