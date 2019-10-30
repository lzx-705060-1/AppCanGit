
cmp.ready(function() {
	//支持安卓手机返回键
	cmp.backbutton();
	cmp.backbutton.push(cmp.href.back);
	
	var options = {
		type : 1,
		flowType : 2,
		closeCallback : function(result){
			cmp.storage["delete"]("tempData", true);
			cmp.href.back();
		},
		wheader : true,
		callback : function(result){
			var ret = cmp.parseJSON(result);
			var personList = ret.orgResult;
			if(personList.length == 0){
				return;
			}
			var params = [];
			for(var i = 0 ; i < personList.length ; i++){
				var temp = personList[i];
				params.push({
					name : temp.name,
					phone : temp.telphone
				});
			}
			multicallReq(cmp.toJSON(params));
		}
	};
	cmp.selectOrg("selectOrg", options);
})

//请求电话会议参数
function multicallReq(selected){
	$s.Coll.multiCall({}, errorBuilder({
		success : function(result){
			var obj = result.data.meetingParams;
			obj.callback = function(result){
				obj.parties = selected;
				result.callback(obj);
			}
			multicall(obj);
		},
        error : function(result){
        	//抛出的异常需要反馈到界面上
        	_alert(result.message);
        }
	}))
}