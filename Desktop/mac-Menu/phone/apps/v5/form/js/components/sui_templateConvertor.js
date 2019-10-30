/**
 * Created by yangchao on 2016/12/20.
 */

(function ($, doc) {
    $.sui = $.sui || {};

    function _getSuiInputType(finalInputType) {
        switch (finalInputType) {
            case 'text':
                return 'v-sui-input';
            case 'textarea':
                return 'v-sui-input';
            case 'date':
                return 'v-sui-date';
            case 'datetime':
                return 'v-sui-date';
            case 'flowdealoption':
                return 'v-sui-static';
            case 'lable':
                return 'v-sui-static';
            case 'label':
                return 'v-sui-static';
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
                return 'v-sui-organization';
            default:
                return 'v-sui-' + finalInputType;

        }
    }

   function _getRealInputType(fieldInfo) {
        //如果是relation或outwrite 则返回finalInputType
        if (fieldInfo.inputType == 'relation' || fieldInfo.inputType == 'outwrite') {
            return fieldInfo.finalInputType;
        } else {
            return fieldInfo.inputType;
        }
    }

    function _getMasterCtrlTemplate (ctrlId, suiInputType, finalInputType) {
        var html = [];
        html.push('<div id="' + ctrlId + '" class="sui-source-form-ctrl-wrapper ' + finalInputType + '">');
        html.push('<div id="master|' + ctrlId + '" sui-type="' + finalInputType + '" class="sui-form-ctrl sui-form-viewType-1 sui-form-ctrl-' + ctrlId + '">');
        html.push('<div ' + suiInputType + '="s3scope.data.master[\'' + ctrlId + '\'].value" v-bind:scope="{model:s3scope.data.master[\'' + ctrlId + '\'], fieldInfo:s3scope.metadata.fieldInfo[\'' + ctrlId + '\'], isMaster:true}"></div>');
        html.push('</div>');
        html.push('</div>');
        return html.join('');
    }

    function _getRepeatTableCtrlTemplate (tableName, ctrlId, suiInputType, finalInputType) {
        var html = [];
        html.push('<div id="' + ctrlId + '" class="sui-source-form-ctrl-wrapper ' + finalInputType + '">');
        html.push('<div id="' + tableName + '|{{item.__id}}|' + ctrlId + '" sui-type="' + finalInputType + '" class="sui-form-ctrl sui-form-viewType-1 sui-form-ctrl-' + ctrlId + '">');
        html.push('<div ' + suiInputType + '="item[\'' + ctrlId + '\'].value" v-bind:scope="{model:item[\'' + ctrlId + '\'], fieldInfo:s3scope.metadata.children[\'' + tableName + '\'].fieldInfo[\'' + ctrlId + '\'], isMaster:false}"></div>');
        html.push('</div>');
        html.push('</div>');
        return html.join('');
    }


    $.sui.templateConvertor = function (metadata, data, sourceTemplate) {
        //如果模板已经转换过的，忽略
        if (sourceTemplate.indexOf('class="sui-form-wrapper"') != -1) {
            return sourceTemplate;
        }

        var start = new Date();
        var newTemplate = sourceTemplate;
        if (metadata) {
            Object.keys(metadata.fieldInfo || {}).forEach(function(key){
                if (key.indexOf('field') != -1 && data.master[key]) {
                    var fieldInfo = metadata.fieldInfo[key];
                    var placeholder = '@' + fieldInfo.name + '@';
                    var finalInputType = _getRealInputType(fieldInfo);
                    var suiInputType = _getSuiInputType(finalInputType);
                    var html = _getMasterCtrlTemplate(fieldInfo.name, suiInputType, finalInputType);
                    newTemplate = newTemplate.replace(placeholder, html);
                }
            });

            Object.keys(metadata.children || {}).forEach(function(tableName){
                Object.keys(metadata.children[tableName].fieldInfo || {}).forEach(function(key){
                    if (key.indexOf('field') != -1 ) {
                        if (data.children[tableName] && data.children[tableName].data && data.children[tableName].data.length > 0) {
                            var recordData = data.children[tableName].data[0];
                            if (recordData[key]) {
                                var fieldInfo = metadata.children[tableName].fieldInfo[key];
                                var placeholder = '@' + fieldInfo.name + '@';
                                var finalInputType = _getRealInputType(fieldInfo);
                                var suiInputType = _getSuiInputType(finalInputType);
                                var html = _getRepeatTableCtrlTemplate(tableName, fieldInfo.name, suiInputType, finalInputType);
                                newTemplate = newTemplate.replace(placeholder, html);
                            }
                        }
                    }
                });
            });
        }

        //在模板末尾加一个扫码功能的控制
        newTemplate += '<div v-sui-qrscan v-show="s3scope.allowQRScan" ></div>';

        //构造一个新的原样表单的模板
        var formWrapper = document.createElement('div');
        formWrapper.classList.add('sui-form-wrapper');
        //给wrapper加一个id
        formWrapper.id = 'formWrapper_' + new Date().getTime();
        formWrapper.innerHTML = '<div class="sui-form-content" v-bind:class="{ \'sui-form-content-allow-check\': s3scope.allowCheck}"></div>';
        var formContent = formWrapper.children[0];
        //将新表单模板挂载到formContent上
        formContent.innerHTML = newTemplate;
        //将表单外层div加一个样式  sui-form-grid
        //formContent.children[0].classList.add('sui-form-grid');
        formContent.classList.add('sui-form-grid');
        var scripts = formContent.querySelectorAll('script');
        Array.apply(null, scripts).forEach(function(script){
            script.remove();
        });

        //找到具有recordid的dom，替换属性
        var repeatTrArr = formContent.querySelectorAll('[recordid]');
        Array.apply(null, repeatTrArr).forEach(function(tr){
            //找到第一个ctrl，获取tablename
            var ctrls = tr.querySelectorAll('[id*="formson_"]');
            var len = ctrls.length;
            if (len > 0) {
                var ctrl = ctrls[0];
                var tableName = ctrl.id.split('|')[0];
                tr.classList.add('sui-sub-table-record');
                tr.setAttribute('recordid', '{{item.__id}}');
                tr.setAttribute('tablename', tableName);
                tr.setAttribute('recordindex', '{{$index}}');
                tr.setAttribute('previd', '{{item.__prevId}}');
                tr.setAttribute('track-by', '__id');
                tr.setAttribute("v-for", "item in s3scope.data.children['" + tableName + "'].data");
                //如果是重复节，用table布局
                if (tr.tagName != 'TR') {
                    tr.style.display = 'inline-table';
                }

                //插入一个tr，或div显示更多
                var moreCtrl = document.createElement(tr.tagName);
                moreCtrl.classList.add('sui-sub-table-more-ctrl-grid');
                moreCtrl.setAttribute("v-show", "s3scope.unShowSubDataIdMap && s3scope.unShowSubDataIdMap['" + tableName + "'] && s3scope.unShowSubDataIdMap['" + tableName + "'].length>0");
                moreCtrl.setAttribute('colspan', len);
                if (tr.tagName == 'TR') {
                    moreCtrl.innerHTML = '<td colspan="' + len + '"><span v-on:touchend.prevent v-on:tap="onLoadMore(\'' + tableName + '\')">查看更多</span></td>';
                } else {
                    moreCtrl.innerHTML = '<span v-on:touchend.prevent v-on:tap="onLoadMore(\'' + tableName + '\')">查看更多</span>';
                }
                tr.parentNode.appendChild(moreCtrl);

                //将父元素设置为relative
                tr.parentNode.style.position = 'relative';
                //添加一个汇总重复表行的图标
                var collectCtrl = document.createElement('div');
                collectCtrl.classList.add('see-icon-v5-form-table-collect');
                collectCtrl.setAttribute('v-show', 's3scope.metadata.children["' + tableName + '"].collectTable');
                collectCtrl.setAttribute('v-on:tap', 'onCollectSubTableRecords("' + tableName + '")');
                tr.parentNode.appendChild(collectCtrl);

            }

        });
        //将已经有的logo，图片改一下地址
        var imgArr = formWrapper.querySelectorAll('img');
        Array.apply(null, imgArr).forEach(function(img){
            if (img.src && !img.src.startsWith('http')) {
                var url = img.src;
                if (url.startsWith('file://')) {
                    url = url.substring('file://'.length);
                }
                img.src = cmp.serverIp + url;
            }
        });
        var end = new Date();
        console.log('耗时：', end - start);
        return formWrapper.outerHTML;
    }

})(cmp, document);