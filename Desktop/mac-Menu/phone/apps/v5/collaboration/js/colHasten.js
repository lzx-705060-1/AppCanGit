var page = {};
cmp.ready(function () {
	pageInit();
});

function pageInit() {
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration",null,$verstion);
    
	//缓存页面数据
	page = cmp.href.getParam();
	// _$("#goBackBtn").addEventListener("tap",fnGoSummaryListPage);
	_$("#sendBtn").addEventListener("tap",fnSubmit);
	_$("#content").addEventListener("input",fnFontCount);
	 //国际化title标签
    _$("title").innerText=cmp.i18n("collaboration.page.lable.button.hasten");
}

function fnSubmit(){
	var pageTemp = {};
	pageTemp.content = CollUtils.filterUnreadableCode(_$("#content").value);
	pageTemp.affairId = page.affairId;
	pageTemp.isAllHasten = page.isAllHasten;
	$s.Coll.hasten({},pageTemp, errorBuilder({
		success : function(result) {
			fnGoSummaryListPage();
		}
	}));
	
}


function fnGoSummaryListPage(){
	page = cmp.href.getParam();
	cmp.href.next(_collPath + "/html/colAffairs.html"+colBuildVersion,page.parentX);
}

function fnFontCount(){
	var feedback = _$("#content"),maxLength = 85;
	var content = feedback.value;
	if(content.length > maxLength){
		feedback.value = content.substr(0,maxLength);
		content = feedback.value;
	}
	//剩余可以输入的字数
	_$("#fontCount").innerHTML = maxLength-content.length;
}