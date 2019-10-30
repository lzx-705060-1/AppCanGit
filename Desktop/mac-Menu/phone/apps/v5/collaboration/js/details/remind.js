/**本页面不要使用Jquery**/

var pageX = {}
pageX.submiting = false;
cmp.ready(function () {

    initPageBack();
    pageX.winParams = cmp.href.getParam();
    cmp.i18n.init(_collPath+"/i18n/", "Collaboration", function() {
    	//初始化页面
    	initHtml();
    	
    	//初始化事件
    	initEvent();
    },$verstion);

    // cmp.HeaderFixed("#hid", document.querySelector("#content"));
    cmp.description.init(document.querySelector("#content"));
});

//页面展现
function initHtml(){
	 //国际化title标签
    _$("title").innerText=cmp.i18n("collaboration.page.lable.button.hasten");
};

//事件绑定
function initEvent() {
    _$("#sendBtn").addEventListener("tap", submitForm);
    _$("#content").addEventListener("input", initInputEvent);
}

//向前
function _goBack() {
    cmp.href.back();
}

function initPageBack() {
    
    //cmp控制返回
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    _$("#goBackBtn").addEventListener("tap", _goBack);
}




function submitForm() {
	
	if(pageX.submiting){
		return;
	}
	
	pageX.submiting = true;
    
	var pageTemp = {};
    pageTemp.content = CollUtils.filterUnreadableCode(_$("#content").value);
    pageTemp.app = pageX.winParams["app"] || "";
    pageTemp.affairId = pageX.winParams["affairId"] || "";
    pageTemp.activityId = pageX.winParams["activityId"] || "";
    pageTemp.isAllHasten = pageX.winParams["isAllHasten"];
    pageTemp.memberIds = pageX.winParams["memberIds"] || "";
    
    $s.Coll.hasten({},pageTemp, errorBuilder({
        success : function(result) {
        	_alert(result["message"], function() {
    			_goBack();
    		}, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
        	
        }
    }));
}

function initInputEvent() {
    var feedback = _$("#content"),maxLength = 85;
    var content = feedback.value;
    if(content.length > maxLength){
        feedback.value = content.substr(0,maxLength);
        content = feedback.value;
    }
    //剩余可以输入的字数
    _$("#fontCount").innerHTML = maxLength-content.length;
}
