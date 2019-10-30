(function () {
    var totalSize = 0;
    var warp = document.getElementById("wrapper");
    var fill = document.getElementById("fill");
    var total = document.getElementById("total");
    var current = document.getElementById("current");
    var params = cmp.href.getParam() || JSON.parse(cmp.storage.get('cap4-param', true));
    total.innerHTML = totalSize;

    //判断是否是从工作台进入，获取资源文件和回调有差异。
	if (params.entrance && params.entrance === 'workbench') {
        window.cordova = window.parent.cordova;
        window.onload = function () {
            cmp.dialog.loading('数据加载中', '');
            getAppMd5();
        }
    } else {
        cmp.ready(function () {
            cmp.dialog.loading('数据加载中', '');
            getAppMd5();
        });
    }
    

    //获得MD5码
    function getAppMd5() {
        cmp.app.getAppMd5({
            success: function (res) {
                var data = JSON.parse(res);
                var checkData = [];
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var item = {};
                        item.appId = data[i].appID;
                        item.md5 = data[i].md5;
                        item.from = 'cap4';
                        checkData.push(item);
                    }
                    checkUpdate(checkData);
                } else {
                    alert('没有模板ID');
                }
            },
            error: function (err) {
                alert(err);
            },
            appIds: params.appIds
        })
    }

    //从工作台进入此页时跳转的逻辑
    function fromworkbench(basePath, params) {
        cmp.app.getLocalResourceUrl({
            url: basePath + "?entrance=workbench",
            success: function (ret) {
                cmp.storage.save('cap4-param', JSON.stringify(params), true);
                window.location.href = ret.localUrl;
            },
            error: function (e) {
                alert('获取信息门户异常，请截图联系管理员');
            }
        });
    }

    //检查是否要更新
    function checkUpdate(checkData) {
        var path;
        cmp.ajax({
            type: 'post',
            data: JSON.stringify(checkData),
            url: cmp.serverIp + "/seeyon/rest/m3/appManager/check/version",
            timeout: '30000',
            dataType: 'json',
            success: function (res) {
                if (res.data.length > 0) {
                    var downInfo = [];
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].hasUpdate) {
                            downInfo.push(res.data[i]);
                        }
                        //确定最终跳转到的模板地址（首页，查询，统计都可用）
                        if (params.goUrlId === res.data[i].appId) {
                            path = 'http://' + res.data[i].urlSchemes + '/v1.0.0/dist/index.html';
                        }
                    }
                    //如果有更新就下载，没有就直接跳转
                    if (downInfo.length > 0) {
                        warp.style.display = 'block';
                        cmp.dialog.loading(false);
                        downloadApp(downInfo, 1, path);
                    } else {
                        cmp.dialog.loading(false);
                        //根据goUrlId ，跳转到模板地址还是无模板默认地址
                        jumpToUrl(path);
                    }
                } else {
                    alert('没有数据')
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    }

    //跳转
    function jumpToUrl(path) {
		
        var param = getParams(params);
        if (params.goUrlId === '0') {
            var wPath = getDefaultUrl(params.type);
            if (params.entrance && params.entrance === 'workbench') {
                fromworkbench(wPath, param);
            } else {
                cmp.href.go(wPath+"?useNativebanner=1", param);
            }
        } else {
            if (params.entrance && params.entrance === 'workbench') {
                fromworkbench(path, param);
            } else {
               cmp.href.go(path+"?useNativebanner=1", param);
            }
        }
    }

    //根据类型返回无模板默认地址
    function getDefaultUrl(type) {
        //默认地址，1为业务首页 3为统计首页 4为查询首页
        switch (type) {
            case '1':
			case 1:
                return "http://cap4.v5.cmp/v1.0.0/htmls/business/0/dist/index.html";
                break;
            case '3':
			case 3:
                return "http://cap4.v5.cmp/v1.0.0/htmls/report/0/dist/index.html";
                break;
            case '4':
			case 4:
                return "http://cap4.v5.cmp/v1.0.0/htmls/query/0/dist/index.html";
                break;
            default:
                break;
        }
    }

    //根据类型返回无模板默认地址
    function getParams(params) {
        //默认地址，1为业务首页 3为统计首页 4为查询首页
        switch (params.type) {
            case '1':
			case 1:
                return {
                    templateId: params.goUrlId,
                    bussId: params.bussId,
                    name: params.name,
                    entrance: params.entrance
                };
                break;
            case '3':
            case '4':
			case 3:
            case 4:
                return {
                    appId: params.goUrlId,
                    type: params.type,
                };
                break;
            default:
                break;
        }
    }

    //更新包
    function downloadApp(info, index, path) {
        var size = info.length;
        if (size === 0) {
            return;
        }
        totalSize = Math.ceil((info[index - 1].length) / 1024);
        total.innerHTML = totalSize;
        var downloadUrl = cmp.serverIp + "/api/mobile/app/download/" + info[index - 1].appId + "?checkCode=" + info[index - 1].md5 + "&from=cap4";
        var aExtData = {
            appID: info[index - 1].appId,
            name: info[index - 1].appName,
            type: "",
            domain: info[index - 1].domain || '',
            version: info[index - 1].version,
            md5: info[index - 1].md5
        };
        cmp.app.downloadApp({
            "url": downloadUrl,
            "title": info[index - 1].bundleName + ".zip",
            "extData": aExtData,
            success: function (res) {
                fill.style.width = '100%';
                current.innerHTML = totalSize;
                if (index !== size) {
                    var idx = index + 1;
                    downloadApp(info, idx, path);
                } else {
                    //更新包后，根据goUrlId ，跳转到模板地址还是无模板默认地址
                    jumpToUrl(path);
                }
            },
            progress: function (pro) {
                current.innerHTML = Math.ceil(totalSize * pro.pos);
                fill.style.width = Math.floor(pro.pos * 100) + "%";
            },
            error: function (err) {
                alert(err)
            }
        });
    }
})();