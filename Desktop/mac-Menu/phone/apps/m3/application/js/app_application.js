/**
 * Created by hbh on 2016/6/27.
 */

(function() {
    var m3i18n, m3Ajax, nativeApi, sortDel,imgloader, loadProgress, m3Slider;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        require('commons');
        m3i18n = require("m3i18n");
        nativeApi = require("native");
        m3Ajax = require("ajax");
        imgloader = require('commons/js/cmp-img-loader.js');
        m3Progress = require('components/m3-download-animate.js');
        document.addEventListener('app-application', function(e) {
            initPage();
        });
        cmp.ready(function(){
            //样式初始化
            initStyle();
        });
    });
    //排序对象
    var sortObj = {},
        isNewAppList = false,
        //当前的套件应用
        curCipGroup = [],
        section, html, appHeader, appCenterIcon,
        //img对象
        imgObj,
        //激活状态
        active = false,
        //图标映射
        iconMap,
        //容器ID数组
        ids = [],
        //标题map
        titleMap = {},
        //排序数据源
        sortData,
        //删除的数据源
        delArr = [],
        // rAF 触发锁
        ticking = false,
        //外层滚动容器
        scrollWrapper = document.getElementsByClassName("grid-type")[0],
        //接口返回情况
        tipArr = [],
        //进度条对象
        m3ProgressObj = {},
        //ios11 
        animateName = 'icon-shake',
        preTime = 0,
        historyData;
    // 条件页面onshow 、didAppear 事件
    function bindDidAppearEvent() {
        document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
            loadUnloadedImg();
            getunreadFun();//初始化脚标未读信
            $('body').trigger('tap');
        });
        //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
        if ( cmp.os.ios ) {
            document.addEventListener("resume",function(){
                loadUnloadedImg();
                getunreadFun();//初始化脚标未读信息
            },false);
        }
    }
    /**
     * @function name loadUnloadedImg
     * @description 添加页面banner离线加载时图片失败再次拉取
     * @author ybjuejue
     * @createDate 2018/11/16/016
     * @params
     */
    function loadUnloadedImg() {
        nativeApi.getNetworkState(function( ret ) {
            var state = (ret.serverStatus === 'connect');
            if(state){
                dealIconImgLoad();
                dealIconImgLoad('#app-banner .app-banner-item-img>img');
            }
        });
    }
    /**
     * @function name dealIconImgLoad
     * @description 处理icon图片加载
     * @author ybjuejue
     * @createDate 2018/11/20/020
     * @params t string Selection
     */
    function dealIconImgLoad(t) {
        var iconList = [];
        var iconImgsNode = $(t||'.icon-list-warp-group .application-list-group li span>img');
        for(var i = 0; i< iconImgsNode.length;i++) {
            var url = $(iconImgsNode[i]).attr('data-view-url');
            if((url != iconImgsNode[i].src) && url) {
                iconList.push({
                    url: $(iconImgsNode[i]).attr('data-view-url'),
                    selector: '#' + iconImgsNode[i].id
                })
            }
        }
        if (iconList.length) {
            imgloader({
                config: iconList,
                defaultUrl: 'http://application.m3.cmp/v/img/'+(!t?'icon':'banner')+'-default.png',
                handleType: 'src'
            })
        }
    }
    //页面初始化
    function initPage() {
        section = $("section");
        html = $("html");
        appHeader = $(".app_header");
        appCenterIcon = $(".see-icon-m3-appcenter-fill");
        m3.closeGestureAndIndex();
        if ($('.cmp-ios-11').length > 0) {
            animateName = 'icon-shake-ios11'
        }
        var refreshTimer;
        setTimeout(function () {
            bindDidAppearEvent();
        }, 2000);
        document.addEventListener("com.seeyon.m3.message.refresh", function(event) {
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(function() {
                console.log('action');
                if (event.data === 'refresh') {
                    window.location.reload();
                    return;
                }
                active = false;
                //容器ID数组
                ids = [];
                //排序数据源
                sortData = null;
                //删除的数据源
                delArr = [];
                initListData(function(data) {
                    //数据绑定
                    data = cmp.extend({}, data);
                    section.find('.icon-list-warp-group').html(htmlString(data));
                    dealIconImgLoad();
                    if ( sortData.length == 0 ) {
                        $('.app-center-link').removeClass('display-none');
                    } else {
                        $('.app-center-link').addClass('display-none');
                    }
                    getunreadFun();//初始化脚标未读信息
                    initDrug(ids);
                });
            }, 500);
        });
        cmp.webViewListener.add({ "type": "com.seeyon.m3.message.refresh" });
        iconMap = getIconMap();
        var initHandle = function() {
            initListData(function(data) {
                data = cmp.extend({}, data);
                section.find('.icon-list-warp-group').html(htmlString(data));
                dealIconImgLoad();
                if ( sortData.length == 0 ) {
                    $('.app-center-link').removeClass('display-none');
                } else {
                    $('.app-center-link').addClass('display-none');
                }
                // getunreadFun();//初始化脚标未读信息
                initDrug(ids);
                getunreadFun();//初始化脚标未读信息
                nativeApi.saveAppList(JSON.stringify(sortData.concat(delArr)));
            });
        }
        getAppAndConfigRequestStatus(function() {
            initHandle();
        }, function(e) {
            initHandle();
            console.error('App Error：getAppAndConfigRequestStatus fail');
        });
        //事件初始化
        initEvent();
    }

    //applist config接口返回接听
    function M3InitRequestListener(type) {
        console.log('M3InitRequestListener ' + type);
        if (type === 'applist'){
            isNewAppList = true;
            cmp.event.trigger('com.seeyon.m3.message.refresh', document);
        }
    }
    var isBack = false;
    function refreshAppAndConfig() {
        if (isBack) {return;}
        isBack = true;
        nativeApi.refreshAppAndConfig(function(info) {
            var _info;
            try {
                _info = JSON.parse(info);
            } catch(e) {
                _info = {};
                cmp.notification.toast(fI18nData["application.m3.h5.refreshJsonError"], 'center');
                return;
            }
            isNewAppList = _info.applist;
            cmp.event.trigger('M3ConfigOrApplistRequestCompleted', document, {type: 'applist'});
        });
    }

    //移除不显示的filter
    function filterArr(data) {
        delArr = [];
        var arr = [];
        for (var i = 0;i < data.length;i++) {
            if ( !data[i].appId )continue;
            if (
                data[i].appStatus == null
                && (data[i].appType == 'integration_native'
                || data[i].appType == 'integration_local_h5'
                || data[i].appType == 'integration_remote_url'
                || data[i].appType == 'suite'
                || data[i].appType == 'third')//修改后，第三方的appType为third了，加上此类型
            ) {
                delArr.push(data[i]);
                continue;
            }
            if (data[i].appStatus == '0' || data[i].appStatus == '-1') {
                delArr.push(data[i]);
            } else {
                arr.push(data[i]);
            }
        }
        return arr;
    }

    //排序
    function reSort(data) {
        return data.sort(function(a, b){
            return a.sortNum - b.sortNum;
        });
    }

    function sortSortData( data ) {
        var arr = data;
        for ( i = 0; i < arr.length - 1;i++ ) {
            for ( j=0; j < arr.length - 1 - i;j++ ) {
                if ( arr[j].sortNum > arr[j + 1].sortNum ) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    function sortArr( data ) {
        var arr = data;
        for ( i = 0; i < arr.length - 1;i++ ) {
            for ( j=0; j < arr.length - 1 - i;j++ ) {
                if ( arr[j].m3AppType.sort > arr[j + 1].m3AppType.sort ) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    function getAppAndConfigRequestStatus(cb) {
        var _this = this;
        nativeApi.getNetworkState(function(net) {
            var noNet = false;
            if (net.serverStatus !== 'connect') {
                noNet = true;
            }
            nativeApi.getAppAndConfigRequestStatus(function(info) {
                console.log('getAppAndConfigRequestStatus: ' + info);
                var _info;
                try {
                    _info = JSON.parse(info);
                } catch(e) {
                    _info = {};
                    console.error('Todo Error：getAppAndConfigRequestStatus response is not a JSON string');
                }
                isNewAppList = noNet || _info.applist;
                cb();
            }, function(e) {
                cb();
                console.error('Todo Error：getAppAndConfigRequestStatus fail');
            });
        });
        //获取状态
    }

    function initListData(callback) {

        nativeApi.getAppList(function(appListData) {
            var appList;
            appListData = JSON.parse(appListData);
            if (Object.prototype.toString.call(appListData) === '[object Array]') {
                console.log('========native数据源========');
                sortData = filterArr(appListData);
            } else {
                // console.log('=======服务器数据源=======');
                // console.log(appListData);
                //数据格式化，过滤,原样数据
                sortData = filtAppList(appListData);
                if (m3.userInfo.getCurrentMember().showAppCategory != 'true') {
                    sortData = sortSortData(sortData);
                }
            }
            resetSortNum();
            sortDel = [].concat(sortData).length;
            if (m3.userInfo.getCurrentMember().showAppCategory === 'true') {
                appList = formatAppList(sortData);
            } else {
                appList = {all: sortData}
            }
            // console.log(appList);
            callback(appList);
        });
    }

    //分类显示的applist格式化
    function formatAppList(data) {
        data = sortArr(data);
        var map = {},
            sortMap = {};
        for (var i = 0;i < data.length;i++) {
            var typeId = data[i].m3AppType.id
            //判断该类别在map中是否存在，不存在则创建
            if (!map[typeId])
                map[typeId] = [];
            map[typeId].push(data[i]);
        }
        return map;
    }

    //appList过滤器
    function filtAppList(data) {
        var list = [];
        data = data.data;
        for (var i = 0; i < data.length;i++) {
            for(var j = 0,arr = data[i].appList;j < arr.length;j++) {
                if ( !arr[j].appId ){
                    continue;
                };
                //不可见分类
                if (arr[j].m3AppType.edit < 0)continue;
                //缓存类型title对象
                titleMap[arr[j].m3AppType.id] = arr[j].m3AppType;
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
                    //第三方
                    if (
                        arr[j].appStatus == null
                        && (arr[j].appType == 'integration_native'
                        || arr[j].appType == 'integration_local_h5'
                        || arr[j].appType == 'integration_remote_url'
                        || arr[j].appType == 'suite'
                        || arr[j].appType == "third")
                    ) {
                        delArr.push(arr[j]);
                        continue;
                    }
                    if (arr[j].appStatus == '0' || arr[j].appStatus == '-1') {
                        delArr.push(arr[j]);
                    } else {
                        if (data[i].appId === '43' || data[i].appId === '66') {
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
    }

    //事件初始化
    function initEvent() {

        //初始化config，applist接口监听
        m3.M3InitRequestListener(function(type) {
            M3InitRequestListener(type);
        });

        //保存
        $('body').on('tap', function() {
            if ( active == false ) return;
            saveAppList();
            $(".content-box").find('.iconfont').removeClass(animateName);
            $('.del-btn').addClass('display-none');
            drugOper(sortObj, true);
            active = false;
        });

        $('.m3-mask').on('touchstart', function(e) {
            e.preventDefault();
        }).on('tap', function(e) {
            e.stopPropagation();
            $('header,section').removeClass('m3-blur');
            $('.cip-group').addClass('display-none');
            $(this).addClass('display-none');
        });

        $('.backBtn').on('tap', function() {
            cmp.href.back();
        });

        //取消引导
        $('.tip').on('touchstart', function(e) {
            //取消默认事件
            e.preventDefault();
        });
        $('.tip').on('tap', function() {
            var objThis = $(this);
            objThis.addClass('fadeout');
            setTimeout(function() {
                objThis.remove();
            }, 400)
        })

        var touchTime,
            timer;
        var delTip = "";
        //长按
        section.on("touchstart", "li", function(e) {
            var objThis = $(this),
                currentBox = objThis.parent()[0].id,
                nodeName = e.target.nodeName;
            //阻止默认事件 bug OA-151266
            if ((nodeName === 'I' || nodeName === 'SPAN') && active) {
                e.preventDefault();
            }
            touchTime = new Date().getTime();
//            if (isGridStyle) return;
            timer = setTimeout(function() {
                if (!isNewAppList) {
                    refreshAppAndConfig();
                    cmp.notification.toast(m3i18n[cmp.language].loadingApplist, 'center');
                    return;
                }
                active = true;
                $('.del-btn').removeClass('display-none');
                $(".content-box").find('.iconfont').addClass(animateName);
                drugOper(sortObj, false);
            }, 700);
        }).on('touchmove', 'li', function() {
            clearTimeout(timer);
        });
        section.on("touchend", "li", function() {
            if (new Date().getTime() - touchTime < 700) {
                clearTimeout(timer);
            } else if (new Date().getTime() - touchTime >= 700) {
                delTip = true;
            }
        });

        //删除
        section.on('tap', '.del-btn', function(e) {
            var objThis = $(this),
                arr,
                elId = objThis.prev().prev().attr('data-elid');
            if (elId === 'null') {
                cmp.notification.alert(m3i18n[cmp.language].sortableDelErrorData);
                return;
            }
            e.stopPropagation();
            objThis.parent().addClass('icon-remove');
            setTimeout(function() {
                if ( sortData.length == 0 ) {
                    $('.app-center-link').removeClass('display-none');
                }
                if (objThis.parent().parent().find('.enable-li').length === 1) {
                    objThis.parents('.application-list-group-warp').remove();
                    return;
                }
                var id = objThis.parent().parent().attr('id'),
                    node = $('#' + id),
                    disableNode = node.find('.disable-li');
                objThis.parent().remove();
                if ( disableNode.length == 3 ) {
                    disableNode.remove();
                } else {
                    node.append('<li class="disable-li"></li>');
                }
            }, 400);
            for (var i = 0; i < sortData.length; i++) {
                if (sortData[i].id == elId) {
                    sortData[i].appStatus = '0';
                    sortData[i].sortNum = ++sortDel;
                    delArr.push(sortData[i]);
                    sortData.splice(i, 1);
                }
            }
            console.log(sortData.length);
            //iOS11强制渲染
            if ($('.cmp-ios-11').length > 0) {
                $('body').append('<div class="render-div" style="height:1px"></div>');
                setTimeout(function() {
                    $('.render-div').remove()
                },50)
            }
            resetSortNum();
            arr = sortData.concat(delArr);
            if ( sortData.length == 0 ) {
                $('body').trigger('tap');
                return;
            }
            //删除操作时，弹出提示框
            if (delTip) {
                cmp.notification.toast(m3i18n[cmp.language].delTip, "center");
                delTip = false;
            }
        });
        var bizLoad;
        //应用跳转
        $('body').on('tap', '.icon-color,.app-name', function() {
            var _this = $(this);
            if (active) return;
            if (_this.parent().attr('downloading') === 'true') return;
            var id = _this.attr("data-appid"),
                objThis = _this,
                url = "/statistics/appClick",
                elId = _this.attr('data-elid'),
                index,
                type = _this.attr('data-type'),
                info;
            if ( type == 'cip-group' ) {
                for (var i = 0; i < curCipGroup.length; i++) {
                    if (curCipGroup[i].id == elId) {
                        info = curCipGroup[i];
                        index = i;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < sortData.length; i++) {
                    if (sortData[i].id == elId) {
                        info = sortData[i];
                        index = i;
                        break;
                    }
                }
            }
            m3Ajax({

                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3" + url,
                setCache: {
                    isShowNoNetWorkPage: false
                },
                data: JSON.stringify({
                    "appId": info.appId,
                    "appName": info.appName
                }),
                success: function(res) {

                },
                error: function(err) {}
            });
            //我的
            if (id == '56') {
                m3.state.go(m3.href.map.my_index + '&ParamHrefMark=true', {fromPage: 'app'}, m3.href.animated.left, true);
                return;
            }
            //通讯录
            if (id == '62') {
                m3.state.go(m3.href.map.address_index + '&ParamHrefMark=true', {fromPage: 'app'}, m3.href.animated.left, true);
                // nativeApi.showAddressBook();  7.0SP2入口修改为H5页面
                return;
            }
            //待办
            if (id == '58') {
                m3.state.go(m3.href.map.todo_index + '&ParamHrefMark=true', {fromPage: 'app'}, m3.href.animated.left, true);
                return;
            }

            if (id == '79' ) {
                openAIApp(info);
                return;
            }

            if (info.appId == "9999") { //离线文档
                cmp.att.openOfflineFilesModule({
                    success: function() {},
                    error: function() {}
                });
            } else if (info.appType == "biz") { //业务生成器
                if ( !bizLoad ) {
                    bizLoad = true;
                    console.log(info);
                    openBiz(info, function() {
                        bizLoad = false;
                    });
                }
            } else {
                if (info.appType === 'integration_local_h5') {
                    //根据appId判断是否需要下载app
                    isDownloadApp(info.appId, function(tip, isUpdate,oldInfo) {
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
                                    if (_index == 1) {
                                        initProgress(id, objThis);
                                        objThis.parent().attr('downloading', 'true');
                                        downloadApp(info, index, function() {
                                            objThis.parent().removeAttr('downloading');
                                        }, objThis);
                                    }
                                }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].updated], -1, "");
                                return;
                            }
                            //需要下载
                            if ( tip ) {
                                msg += m3i18n[cmp.language].isNeedDownload;
                                cmp.notification.confirm(msg, function(_index, callback) {
                                    if (_index == 1) {
                                        initProgress(id, objThis);
                                        objThis.parent().attr('downloading', 'true');
                                        downloadApp(info, index, function() {
                                            objThis.parent().removeAttr('downloading');
                                        }, objThis);
                                    }
                                }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok], -1, "");
                                //不需要下载
                            } else {
                                var infoParam = $.extend(true, {}, info);
                                infoParam.version = oldInfo.version;
                                infoParam.domain = oldInfo.team;
                                infoParam.bundleName = oldInfo[ 'bundle_name' ];
                                m3.loadApp(infoParam, "application");
                            }
                        })
                    })
                    return;
                    //第三方应用的套件
                } else if ( info.appType === 'suite' ) {
                    curCipGroup = info.suiteAppList;
                    $('.cip-group').html(showCipGroup(curCipGroup)).removeClass('display-none');
                    $('.m3-mask').removeClass('display-none');
                    $('header,section').addClass('m3-blur');
                    console.log(info)
                    return;
                }
                m3.loadApp(info, "application");
            }
        });

        //应用中心
        $('section').on('tap', '.small-title', function(e) {
            if (!isNewAppList) {
                refreshAppAndConfig();
                cmp.notification.toast(m3i18n[cmp.language].loadingApplist, 'center');
                return;
            }
            saveAppList();
            e.stopPropagation();
            m3.state.go(m3.href.map.app_center, { sort: sortData.length }, m3.href.animated.left, true);
        });
        $('.app-center-link').on('tap', function(e) {
            e.stopPropagation();
            m3.state.go(m3.href.map.app_center, { sort: sortData.length }, m3.href.animated.left, true);
        });
    }

    function showCipGroup( data ) {
        var str = '<ul class="content-box">';
        for ( var i = 0;i < data.length;i++ ) {
            var url = '';
            var icon = 'icon-default see-icon-m3-appDefault-fill message-70';
            if ( data[i].iconUrl ) {
                url = m3.getCurServerInfo().url + '/mobile_portal' + data[i].iconUrl;
                url = '<img src="'+url+'" data-view-url="' + url + '" onload="this.style.opacity=1;this.parentElement.style.backgroundColor=\'transparent\';" onerror="this.src=\'\';this.style.opacity=0;this.parentElement.style.backgroundColor=\'#eee\';"/>';
                icon = '';
            }
            str +=  '   <li class="cip-app">\
                            <span class="icon-color iconfont ' + icon + ' " data-type="cip-group" data-appid="' + data[i].appId + '" data-elid="' + data[i].id + '">'+url+'</span>\
                            <span class="align-items app-name" data-type="cip-group" data-appid="' + data[i].appId + '" data-elid="' + data[i].id + '">\
                                <i>' + data[i].appName.escapeHTML() + '</i>\
                            </span>\
                        </li>';
        }
        str += '</ul>';
        return str;
    }

    //是否需要下载app
    function isDownloadApp(appId, callback) {
        //获取缓存
        getAppVersionInfo(appId, function(info) {
            //没有资源包，需要下载
            if ( info == undefined ) {
                callback(true);
                return;
            }
            //检查版本更新
            checkVersion(info, function(isDownload, isUpdate) {
                callback(isDownload, isUpdate,info);//将已有应用包中的信息返回
            });
            //没有资源包
        });
    }

    //获取版本信息
    function getAppVersionInfo( appId, callback ) {
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
    }

    //检查版本号
    function checkVersion(info, callback) {
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
                        callback(false);
                    }
                })
            }
        })
    }

    //下载app
    function downloadApp(info, index, callback, tgt, isReDownload) {
        var downloadUrl = m3.curServerInfo.url + "/mobile_portal/api/mobile/app/download/" + info.appId + "?checkCode=" + " ";
        var aExtData = {
            appID: info.appId,
            name: info.appName,
            type: "",
            domain: info.domain,
            version: info.version
        }
        var downloadFail = function() {
            cmp.notification.confirm(m3i18n[cmp.language].reloadTip1, function(_index, callback) {
                if (_index == 1) {
                    downloadApp(info, index, callback,tgt, true);//OA-148465 xp 2018-05-14
                } else {
                    tgt.parent().removeAttr('downloading');
                    tgt.parent().find('canvas').remove();
                }
            }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].reloadApp], -1, "");
        }
        var downloadHandle = function() {
            cmp.app.downloadApp({
                "url": downloadUrl,
                "title": info.bundleName + ".zip",
                "extData": aExtData,
                success: function() {
                    console.log('======== download end ========');
                    m3ProgressObj[info.appId].loadProgress(100);
                    setTimeout(function() {
                        $('canvas').remove();
                    }, 300);
                    delete m3ProgressObj[info.appId];
                    console.log(m3ProgressObj);
                    //更新appStatus状态
                    sortData[index].appStatus = '1';
                    //保存
                    saveAppList(function() {
                        callback();
                    }, true);
                },
                progress: function(res) {
                    console.log(parseFloat(res.pos * 100));
                    //下载进度显示
                    m3ProgressObj[info.appId].loadProgress(Math.floor(parseFloat(res.pos * 100)));
                },
                error: function() {
                    downloadFail();
                }
            });
        }
        if (isReDownload) {
            m3.checkNetwork(function(status) {
                console.log(status);
                if (status == 'none') {
                    downloadFail();
                } else {
                    downloadHandle();
                }
            });
        } else {
            downloadHandle();
        }

    }

    function initProgress(id, obj) {
        m3ProgressObj[id] = m3Progress({
            el: obj[0],
            loadedCb: function() {
                console.log('======== download start ========');
            }
        });
    }

    //样式初始化
    function initStyle() {
//        section.height(html.height() - appHeader.height());
    }

    //drug open
    function drugOper(ids, state) {
        if (active === false) return;
        var type = Object.prototype.toString.call(ids);
        if (type === '[object Array]') {
            for (var i = 0; i < ids.length; i++) {
                sortObj[ids[i]].options.disabled = state;
            }
        } else if (type === '[object Object]') {
            for (var i in ids) {
                ids[i].options.disabled = state;
            }
        };
    }

    //初始化拖拽
    function initDrug(ids) {
        var obj;
        if (Object.prototype.toString.call(ids) !== '[object Array]') return;
        var _this = this;
        if (document.querySelector('#js-sortable')) {
            callback()
        } else {
            cmp.asyncLoad.js([
                {url: 'http://cmp/v/js/cmp-sortable.js', id: 'js-sortable'}
            ], callback);
        }
        function callback() {
            for (var i = 0; i < ids.length; i++) {
                obj = $('#' + ids[i]);
                if (obj.html() === '') {
                    obj.addClass('display-none').prev().addClass('display-none');
                };
                sortObj[ids[i]] = new cmp.Sortable($('#' + ids[i])[0], {
                    animation: 500,
                    disabled: true,
                    filter: '.disable-li',
                    draggable: '.enable-li',
                    disabledNode: 'LI',
                    onStart: function(e) {
                        setTimeout(function() {
                            $('.sortable-drag').addClass('border-none');
                        },100)
                    },
                    onEnd: function(e) {
                        $('.sortable-drag').removeClass('border-none');
                        if (e.oldIndex === e.newIndex) return;
                        var addNum = 0;
                        addNum = getAddNum(e.from.id);
                        arrSort(e.oldIndex + addNum, e.newIndex + addNum);
                    }
                });
            }
        }
    }

    //获取间距值
    function getAddNum(id) {
        var addNum = 0,
            obj = $('#' + id),
            sortN = parseInt(obj.attr('data-index'));
        for (var i = 0; i < sortN;i++) {
            addNum += $('.content-box[data-index="' + i + '"]').find('.enable-li').length;
        }
        return addNum;
    }

    //保存appList
    function saveAppList(callback, tip) {
        console.log(delArr);
        //同步服务器
        saveToServer(tip);
        //保存原生
        nativeApi.saveAppList(
            JSON.stringify(sortData.concat(delArr)),
            callback
        )
    }

    //appList保存接口
    function saveToServer(isDownload) {
        var data = {},
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
                appStatus: delArr[i].appStatus === null ? null : '0'
            };
        }
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
                console.log(res);
                if (isDownload) return;
//                cmp.notification.toast(m3i18n[cmp.language].setAppSuccess, "top");
            },
            error: function(e) {
                cmp.notification.toast(m3i18n[cmp.language].setAppFail, "top");
                console.log(e);
            }
        })
    }

    //打开业务生成器
    function openBiz(option, callback) {
        var params = {
            "name": option.appName,
            "menuId": option.bizMenuId || "-1"
        };

        m3.penetrated({
            appId: option.appId,
            type: "application",
            returnUrl: m3.href.map.app_index,
            sendParms: params,
            returnParms: null,
            openNewPage: 0,
            callback: callback
        });

    }

    function openAIApp(option) {
        m3.penetrated({
            appId: option.appId,
            type: "application",
            returnUrl: m3.href.map.app_index,
            sendParms: option.gotoParam,
            returnParms: null,
            openNewPage: 0
        });
    }

    //新增未读脚标的功能
    function unreadFun(id){
        return (id == 1 || id == 4 || id == 6) ? true : false;
    }
    //获取脚标数据
    function getunreadFun(){
        preTime = new Date().getTime();
        var id = m3.userInfo.getCurrentMember().id;
        var ids = "1,4,6";
        var obj = {
            memberId:id,
            appKeys:ids
        };
        var noReadCounts = {};
        var stateAjax = 0;
        var resultObj;
        var logoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/affair/pending/count/";
        m3Ajax({
            url: logoUrl,
            type: "POST",
            customCatchSuccess:true,
            setCache: {
                isShowNoNetWorkPage: false
            },
            data:JSON.stringify(obj),
            success: function(msg) {
                if (msg) {
                    preTime = new Date().getTime();
                    var myAppArrayLi = document.querySelectorAll('.workbench.grid-type li');
                    for(var i=0,len=myAppArrayLi.length;i<len;i++){
                        var unreadDom = myAppArrayLi[i].querySelector('span.icon-unread');
                        if(!unreadDom){
                            continue;
                        }
                        var appId = unreadDom.getAttribute('data-appid');
                        if(msg[appId] == 0){
                            if(unreadDom.querySelector('.app-unread')){
                                unreadDom.querySelector('.app-unread').remove();
                            }
                            continue;
                        }
                        var str = '';
                        var number = msg[appId] > 99 ? "99+" : msg[appId];
                        if(unreadFun(appId)){
                            if(number){
                                str = '<span>'+ number +'</span>';
                                if(unreadDom.querySelector('.app-unread')){
                                    unreadDom.querySelector('.app-unread').remove();
                                }
                                var spanHtml =  document.createElement("span");
                                spanHtml.className = "app-unread";
                                spanHtml.innerHTML = str;
                                unreadDom.appendChild(spanHtml);
                            }

                        }
                    }
                }
                // bindDidAppearEvent();
            },
            error: function(msg) {
                // bindDidAppearEvent();
            }
        });
    }
    //数据绑定
    function htmlString(data) {
        var str = '',
            indexSort = 0,
            sort = 0,
            sortIds = [],
            desc,
            crossDisClass = '',
            icon = '',
            isList = false,
            classLi = isList ? 'flex-cross-center flexbox-h' : '',
            classText = isList ? 'flex-1' : '',
            suiteClass;
        if ( data['all'] ) {
            data = {all: [].concat(sortData)};
        }
        //非空校验
        if (Object.prototype.toString.call(data) !== '[object Object]' || data === {}) return str;
        var accountNum = 0;
        //遍历对象
        for (var i in data) {
            var itemStr = '';
            var dataLength = data[i].length;
            ids.push(i);
            if (dataLength > 0) {
                itemStr += '<h3 class="app-title flex-h"><span class="flex-1">';
                if (i === 'all'){
                    itemStr += fI18nData["application.m3.h5.myApp"];
                } else {
                    if (dataLength > 0) {
                        itemStr += data[i][0].m3AppType.name;
                    }
                }
                itemStr += '</span><span class="small-title">' + fI18nData["application.m3.h5.appCenter"] + '</span></h3>';
                itemStr += '<ul class="content-box" id="' + i + '" data-index="' + accountNum + '">';
                accountNum++;

                // if(cmp.os.iPad){
                //     var landsItem = cmp.device.orientation =="landscape" ? 6 :4;
                // }else {
                //     var landsItem = cmp.device.orientation =="landscape" ? 5 :4;
                // }
                var landsItem = 4;
                var comp = dataLength % landsItem;
                if ( comp !== 0) {
                    for ( var a = 0; a < landsItem - comp;a++ ) {
                        data[i].push({});
                    }
                }
                for (var j = 0, dataArr = data[i]; j < dataArr.length; j++) {
                    if ( !dataArr[j].appId ) {
                        itemStr += '<li class="disable-li"></li>'
                        continue;
                    };
                    desc = getDesc(dataArr[j].tags || '[]');
                    //图标Map
                    icon = iconMap['appId_' + dataArr[j].appId];
                    if (!icon) {
                        if (dataArr[j].appType === 'biz') {
                            icon = iconMap['biz'];
                        } else if (dataArr[j].appType === 'default') {
                            icon = iconMap['default'];
                        } else {
                            icon = iconMap['third'];
                        }
                    }
                    if (desc === '') {
                        crossDisClass = 'align-items';
                    }
                    suiteClass = (dataArr[j].appType == "suite")?"align-suite":"";
                    if ( dataArr[j].appId === '66' && ( dataArr[j].iconUrl && !dataArr[j].iconUrl.match('fileUpload.do|upload.do|.png')) ) {
                        var cap4Icon = dataArr[j].iconUrl;
                        cap4Icon = 'see-icon-' + cap4Icon.split('vp-')[1];
                        itemStr += '<li class="enable-li ' + classLi + ' '+suiteClass+'">\
                            <span data-appid="' + dataArr[j].appId + '" class="icon-color icon-default icon-unread see-icon-application ' + cap4Icon + ' iconfont message-' + dataArr[j].appId + '" data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '"></span>\
                            <span class="' + crossDisClass + ' app-name ' + classText + '" data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '">\
                                <i>' + dataArr[j].appName.escapeHTML() + '</i>';
                        //是否存在描述信息，利用flex-box进行居中
                        if (desc !== '') {
                            itemStr += '<i>' + desc + '</i>';
                        }
                        if (dataArr[j].appId != '56' && dataArr[j].appId != '62' && dataArr[j].appId != '58') {
                            itemStr += '</span><span class="del-btn iconfont see-icon-menhushezhiquxiao display-none" data-appid="' + dataArr[j].appId + '"></span>';
                        } else {
                            itemStr += '</span>';
                        }
                        itemStr += '</li>';
                        continue;
                    }
                    if (dataArr[j].iconUrl === undefined || dataArr[j].iconUrl === '{\"default\":\"\",\"multi\":[]}' || dataArr[j].iconUrl === null || dataArr[j].iconUrl === '') {
                        itemStr += '<li class="enable-li ' + classLi + ' '+suiteClass+'">\
                            <span data-appid="' + dataArr[j].appId + '" class="icon-color icon-default icon-unread ' + icon.icon + ' iconfont m3-iconfont message-' + dataArr[j].appId + '" data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '"></span>\
                            <span class="' + crossDisClass + ' app-name ' + classText + '" data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '">\
                                <i>' + dataArr[j].appName.escapeHTML() + '</i>';
                        //是否存在描述信息，利用flex-box进行居中
                        if (desc !== '') {
                            itemStr += '<i>' + desc + '</i>';
                        }
                        if (dataArr[j].appId != '56' && dataArr[j].appId != '62' && dataArr[j].appId != '58') {
                            itemStr += '</span><span class="del-btn iconfont see-icon-menhushezhiquxiao display-none" data-appid="' + dataArr[j].appId + '"></span>';
                        } else {
                            itemStr += '</span>';
                        }

                        itemStr += '</li>';
                    } else {
                        var url = m3.getCurServerInfo().url + '/mobile_portal' + dataArr[j].iconUrl;
                        itemStr += '<li class="enable-li ' + classLi + ' '+suiteClass+'">\
                            <span data-appid="' + dataArr[j].appId + '" class="iconfont icon-color icon-unread " data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '">\
                               <img src="" id="icon-img-'+dataArr[j].appId+'-'+j+'" data-view-url="' + url + '"/>\
                            </span>\
                            <span class="' + crossDisClass + ' app-name ' + classText + '" data-appid="' + dataArr[j].appId + '" data-elid="' + dataArr[j].id + '">\
                                <i>' + dataArr[j].appName.escapeHTML() + '</i>';
                        //是否存在描述信息，利用flex-box进行居中
                        if (desc !== '') {
                            itemStr += '<i>' + desc + '</i>';
                        }
                        if (dataArr[j].appId != '56' && dataArr[j].appId != '62' && dataArr[j].appId != '58') {
                            itemStr += '</span><span class="del-btn iconfont see-icon-menhushezhiquxiao display-none" data-appid="' + dataArr[j].appId + '"></span>';
                        } else {
                            itemStr += '</span>';
                        }

                        itemStr +=  '</li>';
                    }

                }
                itemStr += '</ul>';
                str += '<div class="application-list-group-warp"><div class="application-list-group">'+itemStr+'</div></div>';
            }
            sort++;
            indexSort++;
        }
        return str;
    }

    function getDesc(data) {
        var str = '';
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
            str += '<i>' + data[i].escapeHTML() + '</i>';
        }
        return str;
    }

    //数组操作
    function arrSort(from, to) {
        var hisData = sortData[from]
        sortData.splice(from, 1);
        sortData.splice(to, 0, hisData);
        resetSortNum()
    }

    //重置sort
    function resetSortNum() {
        var account = 0;
        for (var i = 0; i < sortData.length; i++) {
            sortData[i].sortNum = i;
        }
    }

    //图标映射
    function getIconMap() {
        return {
            appId_1: { // 协同
                icon: 'see-icon-m3-coordination-fill',
            },
            appId_4: { // 公文
                icon: 'see-icon-m3-document',
            },
            appId_7: { // 公告
                icon: 'see-icon-m3-notice-fill',
            },
            appId_8: { // 新闻
                icon: 'see-icon-m3-new-fill',
            },
            appId_10: { // 调查
                icon: 'see-icon-m3-research',
            },
            appId_6: { // 会议
                icon: 'see-icon-m3-meeting-fill',
            },
            appId_3: { // 文档中心
                icon: 'see-icon-m3-file',
            },
            appId_17: { // 工资条
                icon: 'see-icon-m3-salary',
            },
            appId_46: { // 足迹
                icon: 'see-icon-m3-footprint-fill',
            },
            appId_9: { // 讨论
                icon: 'see-icon-m3-talk',
            },
            appId_48: { // 统计查询
                icon: 'see-icon-m3-queryStatistics',
            },
            appId_61: { // 信息
                icon: 'see-icon-m3-zhixin-fill',
            },
            appId_9999: {
                icon: 'see-icon-m3-offlineDocument-fill',
            },
            appId_60: { // 我的收藏
                icon: 'see-icon-m3-collect-fill',
            },
            appId_36: { // 签到
                icon: 'see-icon-m3-sign',
            },
            appId_30: { // 任务管理
                icon: 'see-icon-m3-mission-fill',
            },
            appId_11: { // 时间安排
                icon: 'see-icon-workingaffair',
            },
            appId_40: { // 享空间
                icon: 'see-icon-m3-show-fill',
            },
            appId_42: { // 行为绩效
                icon: 'see-icon-m3-performance',
            },
            appId_63: { // 报表分析
                icon: 'see-icon-m3-reportAnalysis-fill',
            },
            appId_63: {
                icon: 'm3-icon-fullsearch',
            },
            appId_70: { // 报表中心
                icon: 'see-icon-m3-reportcenter',
            },
            appId_62: { // 通讯录
                icon: 'see-icon-m3-searchperson',
            },
            appId_58: { // 待办
                icon: 'see-icon-m3-backlog ',
            },
            appId_56: { // 我的
                icon: 'see-icon-wode-copy',
            },
            appId_59: { // 全文检索
                icon: 'see-icon-m3-search',
            },
            appId_79: { // 小智ai
                icon: 'see-icon-m3-xiaozhi',
            },
            biz: {
                // icon: 'see-icon-m3-customized-fill'
                icon: 'see-icon-m3-appDefault-fill'
            },
            third: {
                icon: 'see-icon-m3-third'
            },
            default: {
                icon: 'see-icon-m3-appDefault-fill',
                text: '默认图标'
            }
        };
    }

    function initTip() {
        var winW = $(window).width(),
            isCmpIos = ($('.cmp-ios').length > 0) ? 20 : 0,
            tip1Top = isCmpIos + 149,
            tip1Left = winW * 0.125 - 20,
            tip2Top = tip1Top + 182,
            tip2Right = winW * 0.2;
        if (winW <= 320) {
            tip1Left = winW * 0.333 / 2 - 26;
        }
        $('.tip-1').css({
            'top': tip1Top + 'px',
            'left': tip1Left + 'px'
        }).removeClass('display-none').addClass('fadeMove1');
        $('.tip-2').css({
            'top': tip2Top + 'px',
            'right': tip2Right + 'px'
        }).removeClass('display-none').addClass('fadeMove2');
        cmp.storage.save("isFirstShow","true");
    }
})()