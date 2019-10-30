/**
 * @Author Clyne
 * @description 应用跳转的中转站
 * @createDate 2017-11-23
 */
/**
 * 各个应用的appType映射关系如下：
 * default 标准应用
 * biz biz应用
 * integration_portal 门户
 * integration_local_h5 第三方h5应用
 * integration_native 第三方原生应用
 * integration_remote_url 第三方外网地址类应用
 * suite 第三方套件类
 */
;(function() {
    var m3, nativeApi, m3Ajax, pageObj, m3Cache, sortData, m3i18n, delArr = [];
    define(function(require, exports, module) {
        //加载基础模块
        require('zepto');
        m3 = require('m3');
        m3Ajax = require('ajax');
        nativeApi = require('native');
        m3Cache = require('nativeCache');
        m3i18n = require('m3i18n');
        pageObj.initPage();
    });

    pageObj = {

        //页面初始化
        initPage: function() {
          var objThis = this;
          cmp.ready(function() {
              //异常监听
              var params;
              try {
                params = objThis.getParamByUrl();
              } catch(e) {
                  cmp.notification.toast('url截取异常，检查url格式，XXX?id=XXX', 'center');
              }
              console.log(params)
              //根据ID获取应用包信息
              nativeApi.getAppInfoById(params.id, function(data) {
                  data = JSON.parse(data);
                  objThis.curAppInfo = data;
                  objThis.toAppByData(data);
              }, function(e) {
                  cmp.notification.toast('原生接口getAppInfoById异常,异常信息：' + e.msg, 'center');
              });
          });
        },

        //获取从URL上面param
        getParamByUrl: function() {
            try {
                var url = window.location.href;
                url = url.split('?')[ 1 ];
                url = url.replace(/=/g, '":"');
                url = url.replace(/&/g, '","');
                url = url.replace('?', '');
                url = url.replace(/#\S*/g,'')
                url = '{"' + url + '"}';
            } catch(e) {
                return {};
            }
            return JSON.parse(url);
        },

        //根据应用信息跳转到对应的应用
        toAppByData: function(info) {
            var objThis = this;
            console.log(info);
            m3Ajax({
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/statistics/appClick",
                setCache: {
                    isShowNoNetWorkPage: false
                },
                data: JSON.stringify({
                    "appId": info.appId,
                    "appName": info.appName
                }),
                success: function(res) {},
                error: function(err) {}
            });
            if (info.appId == "9999") { //离线文档
                cmp.att.openOfflineFilesModule({
                    success: function() {},
                    error: function() {}
                });
            } else if (info.appType == "biz") { //业务生成器
                objThis.openBiz(info);
            } else if ( info.appType === 'integration_portal' ) {
                m3.state.go('http://portal.v5.cmp/v1.0.0/html/portalIndex.html?useNativebanner=1&cmp_orientation=auto', {
                    portalId: info.portalId,
					m3from:"navbar"
                }, '', false);
            } else {
                info.isOpenWebview = false;
                if (info.appType === 'integration_local_h5') {
                    //根据appId判断是否需要下载app
                    this.isDownloadApp(info.appId, function(tip, isUpdate) {
                        console.log('xiazai----' + tip);
                        m3.checkNetwork(function(status) {
                            var msg = '';
                            if ( status !== 'wifi' ) {
                                msg = m3i18n[cmp.language].noWifi;
                                if ( status == 'false' ) {
                                    msg = '';
                                }
                            }
                            if ( isUpdate ) {
                                msg += m3i18n[cmp.language].isNeedUpdate;
                                cmp.notification.confirm(msg, function(_index, callback) {
                                    objThis.downloadApp(info, function() {
                                        m3.loadApp(info, "navbar");
                                    });
                                }, "", [m3i18n[cmp.language].updated], -1, "");
                                return;
                            }
                            //需要下载
                            if (tip) {
                                if ( msg ) {
                                    msg += m3i18n[cmp.language].isNeedDownload;
                                    cmp.notification.confirm(msg, function(_index, callback) {
                                        objThis.downloadApp(info, function() {
                                            m3.loadApp(info, "navbar");
                                        });
                                    }, "", [ m3i18n[cmp.language].ok], -1, "");
                                    return;
                                }
                                objThis.downloadApp(info, function() {
                                    m3.loadApp(info, "navbar");
                                });
                            //不需要下载
                            } else {
                                m3.loadApp(info, "navbar");
                            }
                        });
                    })
                    return;
                } else {
                    objThis.saveAppList(info, function() {
                        cmp.webViewListener.fire({ 
                            type: "com.seeyon.m3.message.refresh",
                            data: "refresh"
                        });
                    });
                }
                m3.loadApp(info, "navbar");
            }
        },
        
        
        //是否需要下载app
        isDownloadApp: function(appId, callback) {
            var objThis = this;
            //获取缓存
            this.getAppVersionInfo(appId, function(info) {
                //没有资源包，需要下载
                if ( info == undefined ) {
                    callback(true);
                    return;
                }
                //检查版本更新
                objThis.checkVersion(info, function(isDownload, isUpdate) {
                    callback(isDownload, isUpdate);
                });
            //没有资源包
            }, function() {
                callback(true);
            });
        },
        
        //获取版本信息
        getAppVersionInfo: function( appId, callback ) {
            nativeApi.getVersionInfoByAppId(appId, function(data) {
                try {
                    data = JSON.parse(data);
                } catch ( e ) {
                    data = data;
                }
                console.log('--native version--');
                console.log(data);
                callback(data);
            }, function( e ) {
                //获取不到应用包
                if ( e.code == '12021' ) {
                    callback();
                }
                console.log(e);
            });
        },
    
        //检查版本号
        checkVersion: function(info, callback) {
            //判断网络
            m3.checkNetwork(function(state) {
                //无网络，无需更新，进入老包
                if ( state == 'none' ) {
                    callback(false);
                } else {
                    //数据请求
                    m3Ajax({
                        url: m3.getCurServerInfo().url + '/mobile_portal/seeyon/rest/m3AppResource/needUpdate/' + info.appId + '/' + info.version,
                        setCache: {
                            isShowNoNetWorkPage: false
                        },
                        m3CatchError: false,
                        type: 'GET',
                        success: function(data) {
                            console.log('--server back--');
                            console.log(data);
                            data = data.data;
                            if ( data.isDownload == true ) {
                                callback(true, true);
                            } else {
                                callback(false);
                            }
                        },
                        error: function(e) {
                            cmp.dialog.loading({
                                status: "systembusy",
                                text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + (e.msg || e.message || '异常信息为空') + "</span>",
                                callback: function() {
                                    window.location.reload();
                                }
                            });
                            callback(false);
                        }
                    })
                }
            })
        },
        
        initDownload: function(info) {
            $('.setup').text(m3i18n[cmp.language].setup);
            $('header, .download').removeClass('display-none');
            $('.name, header').text(info.appName || '');
            $('.icon').css('backgroundImage', 'url(' + info.iconUrl + ')');
        },
    
        //下载app
        downloadApp: function(info, callback) {
            var objThis = this;
            m3.checkNetwork(function(state){//OA-149265 xp 2018-05-29
                if(state == "false"){
                    cmp.notification.alert(m3i18n[cmp.language].reloadTip1, function() {
                        objThis.downloadApp(info, callback);
                    }, "", [m3i18n[cmp.language].reloadApp], -1, "");
                }else {
                    var downloadUrl = m3.curServerInfo.url + "/mobile_portal/api/mobile/app/download/" + info.appId + "?checkCode=" + " ";
                    var aExtData = {
                            appID: info.appId,
                            name: info.appName,
                            type: "",
                            domain: info.domain,
                            version: info.version
                        };

                    $('header, .download').removeClass('display-none');
                    objThis.initDownload(info);
                    cmp.app.downloadApp({
                        "url": downloadUrl,
                        "title": info.bundleName + ".zip",
                        "extData": aExtData,
                        success: function() {
                            $('.progress').find('span').css('width', '100%');
                            $('.precent').text('100%');
                            console.log('======== download end ========');
                            setTimeout(function() {
                                $('canvas').remove();
                            }, 300);
                            //更新appStatus状态
                            info.appStatus = '1';
                            //保存
                            objThis.saveAppList(info, function() {
                                cmp.webViewListener.fire({
                                    type: "com.seeyon.m3.message.refresh",
                                    data: "refresh"
                                });
                                callback();
                            });
                        },
                        progress: function(res) {
                            var num = parseFloat(res.pos * 100);
                            //下载进度显示
                            $('.progress').find('span').css('width', Math.floor(num) + '%');
                            $('.precent').text(Math.floor(num) + '%');
                        },
                        error: function() {
                            cmp.notification.alert(m3i18n[cmp.language].reloadTip1, function() {//OA-148473 xp 2018-05-15
                                objThis.downloadApp(info, callback);
                            }, "", [m3i18n[cmp.language].reloadApp], -1, "");
                        }
                    });
                }
            })

        },
        
        getAppList: function(info, callback) {
            var objThis = this;
            nativeApi.getAppList(function(appListData) {
                var appList;
                appListData = JSON.parse(appListData);
                if (Object.prototype.toString.call(appListData) === '[object Array]') {
                    console.log('yuansheng ');
                    console.log(appListData);
                    sortData = appListData;
                } else {
                    console.log('fuwuq ');
                    console.log(appListData);
                    sortData = objThis.filtAppList(appListData);
                    console.log('geshihua');
                    console.log(sortData);
                }
                console.log('===shujue yuan=');
                console.log(sortData);
                for (var i = 0;i < sortData.length;i++) {
                    if (info.appId === sortData[i].appId) {
                        sortData[i].appStatus = '1';
                        break;
                    }
                }
                callback();
            })
        },
        
        //保存appList
        saveAppList: function(info, callback) {
            var objThis = this;
            this.getAppList(info, function() {
                var isDone = false;
                //同步服务器
                objThis.saveToServer(function() {
                    console.log('server success')
                    if (isDone) {
                        callback();
                    }
                    isDone = true;
                });
                //保存原生
                console.log('===native data');
                console.log(sortData.concat(delArr));
                nativeApi.saveAppList(
                    JSON.stringify(sortData.concat(delArr)),
                    function() {
                        console.log('native success')
                        if (isDone) {
                            callback();
                        }
                        isDone = true;
                    }
                );
            });
            
        },
    
        //appList保存接口
        saveToServer: function(callback) {
            var data = {}
                objThis = this,
                curData = sortData;
            for (var i = 0;i < curData.length;i++) {
                data[curData[i].otherApppId] = {
                    id: curData[i].id,
                    otherApppId: curData[i].otherApppId,
                    sort: curData[i].sortNum,
                    appStatus: curData[i].appStatus === null ? '1' : curData[i].appStatus
                };
            }
            for (var i = 0;i < delArr.length;i++) {
                data[delArr[i].otherApppId] = {
                    id: delArr[i].id,
                    otherApppId: delArr[i].otherApppId,
                    sort: delArr[i].sortNum,
                    appStatus: '0'
                };
            }
            console.log('===server data');
            console.log(data);
            m3Ajax({
                type: 'POST',
                url: m3.curServerInfo.url  + '/mobile_portal/seeyon/rest/m3/appManager/save/user/settings',
                setCache: {
                    isShowNoNetWorkPage: false
                },
                data: JSON.stringify({
                    memberId: m3.userInfo.getId(),
                    settings: JSON.stringify(data)
                }),
                success: function(res) {
//                    cmp.notification.toast(m3i18n[cmp.language].setAppSuccess, "top");
                    console.log(res);
                    callback();
                },
                error: function(e) {
                    cmp.notification.alert(m3i18n[cmp.language].setAppFail, function() {//OA-148473 xp 2018-05-15
                        objThis.downloadApp(objThis.curAppInfo, callback);
                    }, "", [m3i18n[cmp.language].reloadApp], -1, "");

                    // console.log(e);
                }
            })
        },
        
        filterArr: function(data) {
            delArr = [];
            var arr = [];
            for (var i = 0;i < data.length;i++) {
                if (data[i].appStatus === '0') {
                    delArr.push(data[i])
                } else {
                    arr.push(data[i]);
                }
            }
            return arr;
        },
        
        //appList过滤器
        filtAppList: function(data) {
            var list = [];
            data = data.data;
            for (var i = 0; i < data.length;i++) {
                for(var j = 0,arr = data[i].appList;j < arr.length;j++) {
                    //不可见分类
                    if (arr[j].m3AppType.edit < 0)continue;
                    //过滤快捷方式
                    if (arr[j].appType === 'integration_shortcut')
                        continue;
                    if (arr[j].appId === "-1" 
                        || arr[j].appId === "2" || arr[j].appId === "44" 
                        || arr[j].appId === "45" || arr[j].appId === "47" 
                        || arr[j].appId === "49" || arr[j].appId === "50" 
                        || arr[j].appId === "51" || arr[j].appId === "65"
                       ) {
                            continue;
                        } else {
                            if (arr[j].appStatus === '0' || arr[j].appStatus === '-1') {
                                delArr.push(arr[j]);
                            } else {
                                if (data[i].appId === '43') {
                                    if (data[i].bizMenuId) {
                                        list.push(arr[j]);
                                    }
                                } else {
                                    list.push(arr[j]);
                                }
                            }
                        }
                }
            }
            return list;
        },
    
        initProgress: function(obj) {
//            m3ProgressObj = m3Progress({
//                el: obj[0],
//                loadedCb: function() {
//                    console.log('======== download start ========');
//                }
//            });
        },

        //打开业务生成器
        openBiz: function(option) {
            var params = {
                "name": option.appName,
                "menuId": option.bizMenuId || "-1"
            };

            m3.penetrated({
                appId: option.appId,
                type: "NavBar",
                returnUrl: m3.href.map.app_index,
                sendParms: params,
                returnParms: null,
                openNewPage: 0
            });
        }
    }
})();
