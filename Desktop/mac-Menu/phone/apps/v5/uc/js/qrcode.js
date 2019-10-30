/**
 * description: 群二维码
 * author: Ms
 * createDate: 2017-09-27
 */
 cmp.ready(function() { 
	

	initEvent();
});
//事件初始化
function initEvent() {
	//安卓自带返回键
	cmp.backbutton();
    cmp.backbutton.push(backbtn);
	 
	 //左上角返回按钮
	cmp.event.click(document.querySelector('#backBtn'),function(){
		 cmp.href.back();
	});
	makeQrCode();
}
function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}

//制作二维码
function makeQrCode(){ 
	var qrDatas = cmp.href.getParam();

	var personInf = {
		"type":"zhixin",
		"ConversationType":"group",
		"targetid":qrDatas.id
	};
	var path = cmp.serverIp + "/seeyon" + qrDatas.logo + '&' + new Date().getTime();
	_$('#logoImg').setAttribute('src',path);
	// _$('.qr_info').innerHTML = qrDatas.name;
	// var nameArray = new Array();
	// for(var i=0,len=qrDatas.members.length;i<len;i++){
	// 	if(i == 10){
	// 		break;
	// 	}
	// 	var name = JSON.parse(qrDatas.members[i]).name;
	// 	nameArray.push(name);
	// }
	_$('#menbers').innerHTML = qrDatas.name;

	cmp.barcode.makeBarScan({
		data:JSON.stringify(personInf),
		success:function(data){ 
			var img =document.querySelector('.codeImg');
			img.setAttribute("src","data:image/jpeg;base64," + data.image);
			eventSaveQR(data.image);
		},
		error:function(){
			//网络异常提示
			cmp.notification.toastExtend(cmp.i18n("uc.m3.h5.networkanomalies"), 
			"bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
		}
   });
}
function eventSaveQR(url){
	_$("#qrcode_save").addEventListener('click',function(){
		if (cmp.system.filePermission) {
			cmp.att.saveBase64({
				base64: url,
				filename: "致信群二维码" + new Date().getTime() + ".png",
				type: "png",
				success: function(result) {
					//保存成功提示语
					cmp.notification.toastExtend(cmp.i18n("uc.m3.h5.savesuccess"), "bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
				},
				error: function(error) {
					//保存失败提示语
					cmp.notification.toastExtend(cmp.i18n("uc.m3.h5.savefailed"), "bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
				}
			})
		} else {
			cmp.notification.toastExtend('微信端暫不支持圖片下載', "center", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
		}
	},false);
}
 function backbtn(){
	 cmp.href.back();
 }
 

 
