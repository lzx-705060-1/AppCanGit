var shortCutEvent = (function() {
    var addClick = function(url) {
        if (url == "scanPortlet") { // 扫一扫
            if (cmp.platform.CMPShell) {
                cmp.href.openWebViewCatch = function() {
                    return 1;
                }
                cmp.href.next("http://commons.m3.cmp/v/m3-scan-page.html?cmp_orientation=auto", null);
            } else {
                cmp.notification.toast(cmp.i18n("shortcut.scan.weixin.unload"), "top");
            }
        } else if (url == "offlineDocPortlet") { // 离线文档
            if (cmp.platform.CMPShell) {
                cmp.att.openOfflineFilesModule({
                    success: function() {},
                    error: function() {}
                });
            } else {
              cmp.notification.toast(cmp.i18n("shortcut.view.weixin.unload"), "top");
            }
        } else if (url.indexOf("bizMenuId|") > -1) { // cap3业务包
            var menuId = url.split("|")[1];
            bizApi.openBizInfo("application", {
                "menuId": menuId
            });
        } else if (url.indexOf("cap4BizMenuId|") > -1) { // cap4业务包
            var menuArr = url.split("|");
            cap4Api.openBizInfo("", {
                "menuId": menuArr[1],
                "name": menuArr[2]
            });
        } else if (url.indexOf("businessMenu|") > -1) { // 子业务跳转
            var menuArr = url.split("|");
            if (menuArr.length > 1) {
                var menuInfo = cmp.parseJSON(menuArr[1]);
                hrefBusiness(menuInfo);
            }
        } else if (url.indexOf("spaceId|") > -1) { // 空间跳转
            var spaceId = url.split("|")[1];
            var _sp = vPortalMainFrameElements.spaceBar.spacesSummary[spaceId];
            if (_sp) {
                vPortalMainFrameElements.spaceBar.entrySpace(spaceId);
            } else {
                getPortalIdBySpaceId(spaceId, function(__portalId) {
                    if (window.location.href.match('ParamHrefMark=workbench')) {
                        localStorage.setItem("spaceId", spaceId);
                        window.location.href = window.location.href.replace(/portalId=[0-9\-]+/, "portalId=" + __portalId);
                        // 定位m3门户导航页签，m3不给接口 先怎么写
                        var m3Navbar = parent.document.querySelectorAll(".m3-navbar li");
                        if (m3Navbar) {
                            for (var i = 0; i < m3Navbar.length; i++) {
                                if (m3Navbar[i].getAttribute("data-portalid") == portalId) {
                                    m3Navbar[i].setAttribute("class", "active");
                                } else {
                                    m3Navbar[i].setAttribute("class", "");
                                }
                            }
                        }
                    } else {
                        localStorage.setItem("spaceId", spaceId);
                        localStorage.setItem("tempPortalId", __portalId);
                        window.location.reload();
                    }
                });
            }
        } else if (url.indexOf("portalId|") > -1) { // 门户跳转
            var portalId = url.split("|")[1];

            if (window.location.href.match('ParamHrefMark=workbench')) {
              window.location.href = window.location.href.replace(/portalId=[0-9\-]+/, "portalId=" + portalId);
              // 定位m3门户导航页签，m3不给接口 先怎么写
              var m3Navbar = parent.document.querySelectorAll(".m3-navbar li");
              if (m3Navbar) {
                  for (var i = 0; i < m3Navbar.length; i++) {
                      if (m3Navbar[i].getAttribute("data-portalid") == portalId) {
                          m3Navbar[i].setAttribute("class", "active");
                      } else {
                          m3Navbar[i].setAttribute("class", "");
                      }
                  }
              }
          } else {
              localStorage.setItem("tempPortalId", portalId);
              //替换末位的#，避免URL跳转无效
              var urlStr = window.location.href;
              var newUrl = urlStr;
              if(urlStr.indexOf("#")+1 == urlStr.length){
                  newUrl = urlStr.substring(0, urlStr.length-1);
              }

              var URlSuffix = "&reload=0&currentPlatform="+currentPlatform;
              if(window.location.href.indexOf("?")>-1){
                  if(window.location.href.indexOf("&reload=0&currentPlatform=")>-1){
                      window.location.reload();
                  }else{
                      window.location.href = newUrl + URlSuffix;
                  }
              }else {
                  window.location.href = newUrl + "?" + URlSuffix;
              }
          }
        } else if (url.indexOf("formqueryreport|") > -1) { // 查询、统计
            var fqrArr = url.split("|");
            var formqueryreportArgs = {
                itemType: "dosearch",
                listType: fqrArr[1],
                id: fqrArr[2],
                openWebView: true
            };

            formqApi.jumpToFormqueryreport(formqueryreportArgs, "dashboard", fqrArr[2]);
        } else if (url.indexOf("unflowForm|") > -1) { // 无流程模板
            var newformParam = url.split("|")[1];
            toNextPage(_unflowformPath + "/html/index.html?cmp_orientation=auto&date=" + (new Date().getTime()), cmp.parseJSON(newformParam));
        } else if (url.indexOf("vreportId|") > -1) { // 报表
            var rptInfo = url.split("|")[1];
            vreportApi.reportView({
                rptInfo: cmp.parseJSON(rptInfo),
                openWebView: true
            });
        } else if (url.indexOf("thirdparty|") > -1) { // 第三方
            var infoStr = url.split("|")[1];
            var info = cmp.parseJSON(infoStr);
            if (cmp.platform.CMPShell) {
                if (info.entry.indexOf("{dependencies.collaboration}") > -1) {
                    info.entry = info.entry.replace("{dependencies.collaboration}", _colPath);
                }
                (function(topWin, _info) {
                  if (topWin.m3) {
                      topWin.m3.loadApp(_info, "application");
                  } else {
                      /*fI18nData["openAppFailTip1"] = "后台未设置穿透的URL";
                      fI18nData["openAppFailTip2"] = "加载该应用失败";
                      fI18nData["openAppFailTip3"] = "该设备未检测到此应用,请前往下载";
                      fI18nData["openAppFailTip4"] = "本地打开错误";
                      fI18nData["iKnow"] = "我知道了";
                      fI18nData["noParam"] = "后台未配置对应的打开参数";*/
                      cmp.asyncLoad.js(["http://commons.m3.cmp/v/js/m3.js"], function() {
                          m3.loadApp(_info, "application");
                      });
                  }
                })(parent.window, info);
                return;
            }
            // weixin
            if (info) {
                var u = info.entry;
                if (u.indexOf("{dependencies.collaboration}") > -1) {
                    u = u.replace("{dependencies.collaboration}", "/seeyon/m3/apps/v5/collaboration");
                }
                u = u.indexOf('?') > -1 ? u + '&' : u + '?';
                u += "token=" + cmp.token;
                cmp.href.next(u);
            }
        } else if (url.indexOf("docResourceId|") > -1) {
        		if (cmp.platform.CMPShell) {
                cmp.href.openWebViewCatch = function() { return 1; }
            }
            docApi.openApp("message", "", {'id': url.split("|")[1]}, {});
            //toNextPage(_docPath + "/html/docView.html?date=" + (new Date().getTime()), {'drId': url.split("|")[1]}); 归档其他类型跳转问题，暂不使用
        } else if (url) {
            toNextPage(url);
        }
    }
    var toNextPage = function(url, data) {
        // cmp壳下使用多webview方式打开
        if (cmp.platform.CMPShell) {
            cmp.href.openWebViewCatch = function() { return 1; }
            url = replaceUrl4M3(url);
        }

        cmp.href.next(url, data || null, { notuuid: true });
    };

    var hrefBusiness = function(info) {
        var menuId = info.id;
        var _sourceType = info.sourceType
        var sourceId = info.sourceId;
        var _menuType = info.menuType;

        var sourceType = {
            C_iCreate: 1, //新建流程
            C_iFlowList: 21, //流程列表
            C_iInfoMgrAppBind: 2, //信息管理应用绑定
            C_iBaseData: 3, //基础数据
            C_iQueryID: 4, //查询ID
            C_iStatisticsID: 5, //统计ID
            C_iArchiveID: 6, //文档文档中心ID
            C_iPublicInfoID: 7, //公共信息ID
            C_iNewsID: 8, //新闻ID
            C_iMenuItem: 15 //表示是菜单项
        };
        if (_sourceType == sourceType.C_iQueryID || _sourceType == sourceType.C_iStatisticsID) { //查询统计
        	if (_menuType == 3){//menutype=3为cap4无流程
				var rptInfoType= "1";
				if(_sourceType == sourceType.C_iQueryID ){
					rptInfoType= "0";
				}
				var formqueryreportArgs={
				    openWebView: true,
        			rptInfo:{
						relatedId: sourceId,
						portalId:"",
						name: info.name,
						module: "2",
						type: rptInfoType
					}
        		};
        		vreportApi.reportView(formqueryreportArgs);
        	}else{
        		var formqueryreportArgs = { itemType: "dosearch", listType: (_sourceType == sourceType.C_iQueryID ? 1 : 2), id: sourceId };

                formqApi.jumpToFormqueryreport(formqueryreportArgs, "biz", sourceId);
        	}
        } else if (_sourceType == sourceType.C_iCreate) { //新建流程
        	//m3在新的webview打开
            if (cmp.platform.CMPShell) {
                cmp.href.openWebViewCatch = function() {
                    return 1;
                }
            }
            collApi.jumpToNewtemplateIndex(sourceId);
        } else if (_sourceType == sourceType.C_iFlowList) { //流程列表
            var param = { 'templeteIds': sourceId, '_listTitle': "", 'openFrom': true };

            if (sourceId == "0") { //合并后的流程
                var para = { "menuId": menuId, "templeteId": sourceId };
                $s.Biz.listBizColList({}, para, {
                    repeat: true, //当网络掉线时是否自动重新连接
                    success: function(ret) {
                        param.templeteIds = ret.templateIds;
                        collApi.jumpToColList(ret.templateIds, "", "listPending");
                    },
                    error: function(e) {
                        var cmpHandled = cmp.errorHandler(e);
                        if (cmpHandled) {} else {
                            cmp.notification.alert(e.message, function() {});
                        }
                    }
                });
            } else {
                // 第二个参数先去掉，显示默认模板名称
                collApi.jumpToColList(sourceId, "", "listPending");
            }
        } else if (_sourceType == sourceType.C_iInfoMgrAppBind || _sourceType == sourceType.C_iBaseData) { //基础数据信息管理
        	if (_menuType == 3){//menutype=3并且sourceType=2则为cap4无流程
				var param = {'appId':info.sourceId,'formId':info.formAppmainId};
				toNextPage(_cap4Path + '/htmls/unflow/0/dist/index.html?cmp_orientation=auto' + "&r=" + Math.random(),param);
			}else{
				toNextPage(_unflowformPath + "/html/index.html?cmp_orientation=auto&date=" + (new Date().getTime()), info);
			}
        } else if (_sourceType == sourceType.C_iArchiveID) { //文档中心
            var param = { 'id': sourceId, 'isForm': true, 'fromBiz': true };
            toNextPage(_docPath + "/html/docList.html?cmp_orientation=auto&date=" + (new Date().getTime()), param);

        } else if (_sourceType == 7 || _sourceType == 11) { //公告：7、11
            toNextPage(_bulPath + "/html/bulIndex.html?cmp_orientation=auto" + "&r=" + Math.random(), { 'typeId': sourceId });

        } else if (_sourceType == 8 || _sourceType == 12) { //新闻：8、12
            toNextPage(_newsPath + "/html/newsIndex.html?cmp_orientation=auto" + "&r=" + Math.random(), { 'typeId': sourceId });

        } else if (_sourceType == 9 || _sourceType == 13) { //讨论：9、13
            toNextPage(_bbsPath + "/html/bbsIndex.html?cmp_orientation=auto" + "&r=" + Math.random(), { 'typeId': sourceId });

        } else if (_sourceType == 10 || _sourceType == 14) { //调查：10、14
            toNextPage(_inquiryPath + "/html/inquiryIndex.html?cmp_orientation=auto" + "&r=" + Math.random(), { 'typeId': sourceId });

        }
    };

    return addClick;
})();