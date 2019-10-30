/*****************************专业签章开始**************************************/
//keySn相当于PC端的签章狗
hasSignaturepolicy = function(callback){//当前人员是否有签章权限
	$s.Signet.getIsignatureKeysn('', {
        success : function(result) {
            callback(result.keySn || "");
        },
        error : function(){
            callback("");
        }
    });
}
function resetElemId(data){

   if(data.signature){
	   data.signature.elemId = 'newInputPosition'//修改divId
   }

}  
//加载签章数据
initIsignature = function(_summaryId,canDeal) {
	var signImgPosition = "sui-form-content";
	if(document.getElementsByClassName("cap4-formBody__container").length>0){
		signImgPosition = "cap4-formBody__container";
	}
	if (typeof iSP != "undefined" && typeof _summaryId != "undefined") {
		if(canDeal){//有处理区域且有签章权限
			iSP.init({// 初始化
				fixed : false,
				encode:false,
				crossDomain : cmp.seeyonbasepath, //A8地址
				currentKeysn : "",
				documentId :_summaryId,//必须指定文档ID
				isGet : false,
				moveable : true,
				cbData:resetElemId,
				signImgPosition:signImgPosition
			});
		}else{
			iSP.init({// 初始化
				fixed : false,
				encode:false,
				crossDomain : cmp.seeyonbasepath, //A8地址
				documentId :_summaryId,//必须指定文档ID
				isGet : false,
				deletable:false,//删除按钮 开关
				moveable : true,
				cbData:resetElemId,
				signImgPosition:signImgPosition
			});
		}
		var v = document.getElementById("newInputPosition");
		if(signImgPosition == "sui-form-content"){
			iSP.setShowDivRange(v.offsetWidth*1.5,v.offsetHeight*1.5);
		}else{
			iSP.setShowDivRange(v.offsetWidth*2.1,v.offsetHeight*2.1);
		}
	}
}

//执行签章功能
showSignatureButton = function(keySn,summaryID){
	if(typeof iSP == "undefined") {
		   return;
	   }
	//签章必须的参数
	var runSignatureParams={
		keySN:keySn,//签章服务的keysn,获取key文件名称,不包括后缀名,所有key文件存放在WEB-INF/key文件
		documentId:summaryID,//文档ID
		elemId:"newInputPosition",//指定定位的页面元素的id,不仅限div元素,所有html元素都可以.
		enableMove:true
		};
	var params={
		callback:function(data){
			if(!data.error) {
  				var signatureData = data.properties;
				for(var key in signatureData){
					if(key.indexOf('signatureid')=="0"){
						signatureId += signatureData[key].signatureId+",";
						break;
					}
				}
			}
		},
		backGetPwd:false,//是否后台获取印章密码,跨域不支持
		protectedData:[{fieldDesc:"协议编号",fieldName:"XYBH"}],//跨域方式保护项不能过多
		runSignatureParams:runSignatureParams//运行签章的参数
		
		};
	//显示选择印章列表div窗口
	iSP.showGetSignatureByKey(params);
};

//删除签章
deleteSignatureButton = function(callback){
	if(typeof iSP == "undefined") {
		return;
	}
	var _ids = signatureId.split(',');
	if(_ids.length>1){
		cmp.notification.confirm("视图切换会导致印章丢失，是否切换？",function(e){ //e==0是/e==1 否
	        if(e==0){ //是
	        	callback();
	        	for(var i = 0;i<_ids.length-1;i++){
	        		$("div[signatureid='"+_ids[i]+"']").remove(); 
	        	}
	        	signatureId = "";
	        }else{
	        	return;  
	        }
	    },null, [ cmp.i18n("workflow.dialog.ok.label"), cmp.i18n("workflow.dialog.cancel.label")]);
	}else{
		callback();
	}
};
/*****************************专业签章开始**************************************/