/**
 * 前端点击电话按钮后，调用该方法，
 * @param o 对象，包含key：company_id,call_time,signature,user_name,user_phone,user_role,meeting_url,action
 */
function multicall(o){
	if(o.meeting_url!=null && o.meeting_url!=''){
		var f = document.createElement("form");
				document.body.appendChild(f);
				f.action = o.meeting_url;
				f.method = "POST";
				f.target = "";
				f.submit();
	}else{
		o.callback({callback:launchConference});
	}
}

/**
 * 发起电话会议
 * @param o
 */
function launchConference(o){
	var partiesJson = cmp.parseJSON(o.parties);
	var partiesArr = new Array();
	var noPhoneArr = new Array();
	var invalidPhoneArr = new Array();
	var num=0;
	var regex = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
	if(o.user_phone==''||o.user_phone=='null' || !regex.test(o.user_phone)){
		cmp.notification.alert(cmp.i18n('collaboration.multicall.hostphone'),null,cmp.i18n('collaboration.page.dialog.note'));
		return;
	}
	for(var i=0; i<partiesJson.length; i++){
		if(partiesJson[i].phone=='null'){
			noPhoneArr[noPhoneArr.length] = partiesJson[i].name;
		}else if(!regex.test(partiesJson[i].phone)){
			invalidPhoneArr[invalidPhoneArr.length] = partiesJson[i].name;
		}else{
			var obj = new Object();
			obj.name = partiesJson[i].name;
			obj.phone = partiesJson[i].phone;
			partiesArr[partiesArr.length] = obj;
			num++;
		}
	}
	if(num<1){
		cmp.notification.alert(cmp.i18n('collaboration.multicall.needtwo'),function(){
			cmp.storage["delete"]("tempData", true);
			cmp.href.back();
		},cmp.i18n('collaboration.page.dialog.note'));
		return;
	}
	o.parties = JSON.stringify(partiesArr);
	if(noPhoneArr.length>0 || invalidPhoneArr.length>0){
		var message = "";
		if(noPhoneArr.length>0){
			message = cmp.i18n('collaboration.multicall.phoneisnull',[noPhoneArr.join(",")]);
		}
		if(invalidPhoneArr.length>0){
			message = message+ cmp.i18n('collaboration.multicall.phoneisivalid',[invalidPhoneArr.join(",")]);
		}
		message = message + cmp.i18n('collaboration.multicall.iscontinue');
		cmp.notification.confirm(message,function(e){ //e==1是/e==0 否
			if(e==1){ //是
				var f = document.createElement("form");
				document.body.appendChild(f);
				f.action = o.action;
				f.method = "POST";
				f.appendChild(generateInput("action","createMeeting"));
				f.appendChild(generateInput("company_id",o.company_id));
				f.appendChild(generateInput("call_time",o.call_time));
				f.appendChild(generateInput("signature",o.signature));
				f.appendChild(generateInput("user_name",o.user_name));
				f.appendChild(generateInput("user_phone",o.user_phone));
				f.appendChild(generateInput("user_role",o.user_role));
				f.appendChild(generateInput("parties",o.parties));
				f.target = "";
				f.submit();
			}else if(e==0){
				cmp.storage["delete"]("tempData", true);
				cmp.href.back();
			}
		},null, [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
	}else{
		var f = document.createElement("form");
		document.body.appendChild(f);
		f.action = o.action;
		f.method = "POST";
		f.appendChild(generateInput("action","createMeeting"));
		f.appendChild(generateInput("company_id",o.company_id));
		f.appendChild(generateInput("call_time",o.call_time));
		f.appendChild(generateInput("signature",o.signature));
		f.appendChild(generateInput("user_name",o.user_name));
		f.appendChild(generateInput("user_phone",o.user_phone));
		f.appendChild(generateInput("user_role",o.user_role));
		f.appendChild(generateInput("parties",o.parties));
		f.target = "";
		f.submit();
	}
}

function generateInput(name,value){
	var tempInput = document.createElement("input");
    tempInput.type = "hidden";
    tempInput.name = name;
    tempInput.value = value;
    return tempInput;
}