此插件为表单查询时的筛选器
使用此插件时，需要在页面中引入
1、sui-filter.css
2、sui-filter.min.js

由于此插件需依赖于Vue、cmp组件、选择项目的组件（涛哥）
所以，还需确保您的页面中引用了以下文件

css：
1、cmp.css
2、cmp-picker.css
3、cmp-listView.css
4、cmp-search.css
5、cmp-selectOrg.css


js：
1、...apps/v5/form/js/lib/vue/vue.min.js
2、cmp.js
3、cmp-picker.js
4、cmp-imgCache.js
5、cmp-listView.js
6、cmp-selectOrg.js
7、cmp-search.js
8、cmp-headerFixed.js
9、...commons/cmp-resources/project/js/projectAccountList.js





使用例子
     var options = {
            containerId: 'my-filter',
            //title应该是唯一的
            data: [
                {fieldName:'formain_001.field0001', title:'项目名称', inputType: 'text', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0002', title:'项目状态', inputType: 'select', fieldType:'VARCHAR', items:[{text:'北京', value:'100001'},{text:'成都', value:'100002'}], value:'100002'},
                {fieldName:'formain_001.field0003', title:'创建时间', inputType: 'datetime', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0004', title:'最后更新时间', inputType: 'date', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0005', title:'选人-多选', inputType: 'multimember', fieldType:'LONGTEXT', value:''},
                {fieldName:'formain_001.field0006', title:'选部门-单选', inputType: 'department', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0007', title:'选项目', inputType: 'project', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0008', title:'标签', inputType: 'select', fieldType:'VARCHAR', items:[{text:'北京', value:'100001'},{text:'成都', value:'100002'},{text:'上海', value:'100003'},{text:'广州', value:'100004'},{text:'深圳', value:'100005'}], value:''}
            ],
            success: function (results) {
                console.log(results);
            }

        };
	var filter = new SuiFilter(options);
