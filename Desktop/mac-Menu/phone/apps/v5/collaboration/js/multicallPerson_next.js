cmp.ready(function() {
	var storageData = cmp.storage.get("tempData", true);
	if(storageData == null){
		cmp.storage.save("tempData", cmp.toJSON({isBack:true}), true);
	}else{
		cmp.storage["delete"]("tempData", true);
		cmp.href.back(2);
		return;
	}
	var urlParam = cmp.href.getParam();
	if(urlParam && urlParam.openFrom == "CollSummary"){//从协同详情进入，已经选人，直接传递给三方页面
		launchConference(urlParam);
	}else if(urlParam && urlParam.openFrom == "openWin"){//第二次进入直接打开三方页面
		multicall(urlParam);
	}else{//从三方应用打开，进入选人页面
		cmp.href.go(_collPath + "/html/multicallPerson.html"+colBuildVersion);
	}
})