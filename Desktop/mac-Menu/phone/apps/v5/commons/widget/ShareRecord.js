/**
 * 分享
 * objectId 应用主键
 * app 应用枚举类型
 * title 分享标题
 */
var ShareRecord = {};
ShareRecord.share = function(objectId, app, title) {
    var ShareRecordI18N = {
        "lang":cmp.language,
        "zh-CN":{
            doc:"文档",
            news:"新闻",
            footMark:"足迹",
            canNotShare:"无法分享，可联系管理员通过协同系统配置器添加外网地址！"
        },
        "zh-TW":{
            doc:"文檔",
            news:"新聞",
            footMark:"足迹",
            canNotShare:"無法分享，可聯系管理員通過協同系統配寘器添加外網地址！"
        },
        "en":{
            doc:"Doc",
            news:"News",
            footMark:"FootMark",
            canNotShare:"You can not share,try to connect Admin to set internet url in seeyonconfig!"
        }
    };
    var _head = "";
    if (app == 3) {
        _head = ShareRecordI18N[ShareRecordI18N.lang].doc;
    } else if (app == 8) {
        _head = ShareRecordI18N[ShareRecordI18N.lang].news;
    } else if (app == 46) {
        _head = ShareRecordI18N[ShareRecordI18N.lang].footMark;
    }

    // 保存分享信息
    $s.ShareRecord.saveShareRecord({}, {
        "objectId" : objectId,
        "app" : app,
        "shareType" : "wechat"
    }, {
        success : function(result) {
            var path = result.path;// V5外网地址
            var id = result.id;// V5分享key

            if (path == "no") {
                cmp.notification.alert(ShareRecordI18N[ShareRecordI18N.lang].canNotShare);
                return;
            }

            cmp.share({
                title : title,
                text : _head,
                url : path + "/seeyon/share.do?key=" + id,
                imgUrl : path + "/seeyon/apps_res/sysMgr/img/m3.png",
                success : function(networkDetail) {
                },
                error : function(error) {
                }
            });
        }
    });
};