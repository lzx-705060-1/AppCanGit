�˲��Ϊ����ѯʱ��ɸѡ��
ʹ�ô˲��ʱ����Ҫ��ҳ��������
1��sui-filter.css
2��sui-filter.min.js

���ڴ˲����������Vue��cmp�����ѡ����Ŀ��������θ磩
���ԣ�����ȷ������ҳ���������������ļ�

css��
1��cmp.css
2��cmp-picker.css
3��cmp-listView.css
4��cmp-search.css
5��cmp-selectOrg.css


js��
1��...apps/v5/form/js/lib/vue/vue.min.js
2��cmp.js
3��cmp-picker.js
4��cmp-imgCache.js
5��cmp-listView.js
6��cmp-selectOrg.js
7��cmp-search.js
8��cmp-headerFixed.js
9��...commons/cmp-resources/project/js/projectAccountList.js





ʹ������
     var options = {
            containerId: 'my-filter',
            //titleӦ����Ψһ��
            data: [
                {fieldName:'formain_001.field0001', title:'��Ŀ����', inputType: 'text', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0002', title:'��Ŀ״̬', inputType: 'select', fieldType:'VARCHAR', items:[{text:'����', value:'100001'},{text:'�ɶ�', value:'100002'}], value:'100002'},
                {fieldName:'formain_001.field0003', title:'����ʱ��', inputType: 'datetime', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0004', title:'������ʱ��', inputType: 'date', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0005', title:'ѡ��-��ѡ', inputType: 'multimember', fieldType:'LONGTEXT', value:''},
                {fieldName:'formain_001.field0006', title:'ѡ����-��ѡ', inputType: 'department', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0007', title:'ѡ��Ŀ', inputType: 'project', fieldType:'VARCHAR', value:''},
                {fieldName:'formain_001.field0008', title:'��ǩ', inputType: 'select', fieldType:'VARCHAR', items:[{text:'����', value:'100001'},{text:'�ɶ�', value:'100002'},{text:'�Ϻ�', value:'100003'},{text:'����', value:'100004'},{text:'����', value:'100005'}], value:''}
            ],
            success: function (results) {
                console.log(results);
            }

        };
	var filter = new SuiFilter(options);
