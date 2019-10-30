//加载完成就执行
cmp.ready(function(){
    //绑定表单初始化完成后的事件
    _bindInitFieldEvent();
});

//监听M3表单初始化完成后事件
function _bindInitFieldEvent(){
	document.addEventListener('sui_form_afterFormRender', function(e){
		
		
		var flag =  window.s3scope ? window.s3scope.deeIsInit : false;
		if(flag){
			//  cmp.notification.alert(flag,function(){}," ","ok");
			_initFormFieldData(null);	
		}else{
			// cmp.notification.alert(flag,function(){}," ","ok");
			var paramData = e.detail.data;
			var fields = paramData.metadata.fieldInfo;	//主表字段
			var fieldsNameArray = new Array();	
			for(var key in fields){
				var field = fields[key];
				if( field.inputType == "exchangetask") fieldsNameArray.push(key);
			}
			var children = paramData.metadata.children;	//重复表
			
			var recordId = 0;
			var formSonArray = new Array();
			for(var property in children){	//遍历所有重复表 对象
				if(property.indexOf("formson") >= 0){
					formSonArray.push(children[property]);
				}
			}
			if(formSonArray.length > 0){
				for(var i = 0;i < formSonArray.length; i++) {
					var formSon = formSonArray[i];
					var fields = formSon.fieldInfo;	//重复表字段
					var slaveFieldsNameArray = new Array();
					for(var key in fields){
						var field = fields[key];
						if(field.inputType == "exchangetask"){
							slaveFieldsNameArray.push(key);
							var recordTmp = document.getElementById(key).firstElementChild.getAttribute("id");
							if(recordTmp){	////formson_0023|5671601748695856051|field0004
								var id = recordTmp.split("|");
								if(id[1]) recordId = id[1];
							}
						}
					}
				}
			}
			Array.prototype.push.apply(fieldsNameArray, slaveFieldsNameArray);	//组合数组
			if(fieldsNameArray.length == 0) return;
			var fieldsName = fieldsNameArray.join(";");	//要被查询的字段名称（如：field0001;field0002）
			
			var params = {
				formId:paramData.formId,
				fieldNames:fieldsName,
				contentDataId:paramData.contentDataId,
				recordId:recordId,
				rightId:paramData.rightId
			};
			//查询字段值rest到后台dee模块
			var data = null;
			$s.CapForm.getDeeFieldInitData({}, params, {
				success : function(result) {
					if (result.code == 0 && result.data) {	//返回数据结构：exchangeTask字段显示的是display的值，其他的显示的是value值
						if(window.s3scope){
							 window.s3scope.deeIsInit = true;
						}
						data = JSON.parse(result.data);
						_initFormFieldData(data);	//初始化值
						
					}
				}
			});
		}
		
		
		
	});
}

//初始化表单字段值（type=exchangeTask）
function _initFormFieldData(data){
	cmp.sui.refreshFormData(null, data, function(){});
}