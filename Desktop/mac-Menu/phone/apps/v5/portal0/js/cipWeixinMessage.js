var _v5Path = "/seeyon";
var param = null;
cmp.ready(function() {
    prevPage();
    init();
});

function init() {
	param = getUrlParam();
	
	if(!param){
		param =GetRequest();
	}
    var thirdpartyMessageId = param.thirdpartyMessageId;
    if (thirdpartyMessageId) {
        var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
        var _spaceUrl = _v5Path + "/rest/cip/thirdpartyMessage/through/" + param.registerCode + "/" + thirdpartyMessageId;
        cmp.ajax({
            type: "GET",
            data: null,
            url: _spaceUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language': "zh-CN",
                'token': CMP_V5_TOKEN || ""
            },
            dataType: "json",
            success: function(result) {
                if (result.code == 200) {
                    var appParams = result.data;
                    if (!appParams) {
                        cmp.notification.alert("查看第三方详情页面出错了，导致不能穿透", null, null, cmp.i18n("confirm"));
                        return;
                    }
                    if (appParams.appType != "integration_remote_url") {
                        cmp.notification.alert("第三方接入类型不是移动URL，导致不能穿透", null, null, cmp.i18n("confirm"));
                        return;
                    }
                    if (!appParams.entry) {
                        cmp.notification.alert("第三方详情页面不存在，导致不能穿透", null, null, cmp.i18n("confirm"));
                        return;
                    }
                    cmp.href.next(appParams.entry, null, { "openWebViewCatch": 1});
                } else {
                    console.log(result);
                    cmp.notification.alert("查看第三方详情出错，导致不能穿透", null, null, cmp.i18n("confirm"));
                }
            },
            error: function(error) {
                console.log(error);

            }
        });
    }
}

function prevPage() {
    var backFunc = cmp.href.closePage;
    cmp.backbutton();
    cmp.backbutton.push(backFunc);
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}