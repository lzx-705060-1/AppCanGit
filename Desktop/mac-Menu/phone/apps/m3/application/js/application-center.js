/**
 * description: 应用中心
 * author: hbh
 * createDate: 2017-02-09
 */
(function() {

    var m3Error, m3i18n, nativeApi, m3Ajax, sortDel,
        delArr = [], imgloader;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        imgloader = require('commons/js/cmp-img-loader.js');
        m3Error = require('error');
        m3Ajax = require('ajax');
        m3i18n = require("m3i18n");
        nativeApi = require("native");
        initPage();
    });

    var iconMap = "",
        sortData,
        curNode,
        curState,
        sort = 0;
    function resetSortNum() {
        var account = 0;
        for (var i = 0; i < sortData.length; i++) {
            sortData[i].sortNum = i;
        }
    }
    /**
     * @function name dealIconImgLoad
     * @description 处理icon图片加载
     * @author ybjuejue
     * @createDate 2018/11/20/020
     * @params
     */
    function dealIconImgLoad() {
        var iconList = [];
        var iconImgsNode = $('.m3-content li .cmp-pull-left');
        for(var i = 0; i< iconImgsNode.length;i++) {
            var url = $(iconImgsNode[i]).attr('data-view-url');
            var bgUrl = iconImgsNode[i].style.backgroundImage;

            if(('url(' + url + ')')!= bgUrl && url) {
                iconList.push({
                    url: url,
                    selector: '#' + iconImgsNode[i].id
                })
            }
        }
        if (iconList.length) {
            imgloader({
                config: iconList,
                defaultUrl: 'http://application.m3.cmp/v/img/icon-default.png',
            })
        }
    }
    //入口函数
    function initPage() {

        cmp.ready(function() {
            sort = cmp.href.getParam() ? cmp.href.getParam().sort : 0;
            initEvent();
            initListData(function(data) {
                // $('.m3-content').addClass('cmp-content');
                $('.m3-content').html(initDom(data));
                dealIconImgLoad();
                $('.see-icon-m3-arrow-down').eq(0).trigger('tap');
                cmp('.cmp-switch')['switch']();
            });
        });
    }

    //appList过滤器
    function filtAppList(data) {
        var list = [];
        data = data.data;
        for (var i = 0; i < data.length;i++) {
            for(var j = 0,arr = data[i].appList;j < arr.length;j++) {
                if (arr[j].appStatus == '0') {
                    arr[j].sortNum = 999;
                }
                //不可见分类
                if (arr[j].m3AppType.edit < 0)continue;
                //过滤快捷方式
                if (arr[j].appType === 'integration_shortcut')
                    continue;
                if (arr[j].appId === '62' || arr[j].appId === "56" || arr[j].appId === "58") {
                    delArr.push(arr[j]);
                    continue;
                }
                if (arr[j].appId === "-1"
                    || arr[j].appId === "2" || arr[j].appId === "44"
                    || arr[j].appId === "45" || arr[j].appId === "47"
                    || arr[j].appId === "49" || arr[j].appId === "50"
                    || arr[j].appId === "51" || arr[j].appId === "62"
                    || arr[j].appId === "65" || arr[j].appId === "56"
                    || arr[j].appId === "58"
                ) {
                    continue;
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
        console.log(list);
        console.log(delArr);
        return list.concat(delArr);
    }

    function initDom(data) {
        var str = '',
            apiString = getString(),
            index = 0;
        for (var i in data) {
            str += '<h3 class="flex-h"><span class="flex-1">' + data[i][0].m3AppType.name + '</span><span class="iconfont see-icon-m3-arrow-down" data-tgt="' + data[i][0].m3AppType.id + '"></span></h3>';
            str += '<ul class="cmp-table-view my_app my_app_center app-list" id="' + data[i][0].m3AppType.id + '">';
            index++;
            for (var j = 0,app = data[i];j < app.length;j++) {
                //不显示my和通讯录
                if (app[j].appId == '56' || app[j].appId == '62' || app[j].appId == '58')
                    continue;
                funObj = apiString[app[j].appType + 'Fun'] || apiString['othersFun'];
                str += funObj(app[j], j);
            }
            str += '</ul>';
        }
        return str;
    }

    //排序
    function reSort(data) {
        return data.sort(function(a, b){
            return a.sortNum - b.sortNum;
        });
    }

    function getString() {
        //返回数据绑定的function映射关系
        return {
            //标准应用
            defaultFun: defaultFun,

            //biz数据绑定function
            bizFun: bizFun,

            //other（第三方）
            othersFun: othersFun
        };
    }

    function saveAppList(callback) {
//        resetSortNum();
        //同步服务器
        saveToServer();
        //保存原生
        console.log('yuan sheng');
        console.log(sortData);
        nativeApi.saveAppList(
            JSON.stringify(sortData),
            callback
        )
    }

    //appList保存接口
    function saveToServer() {
        var data = {},
            curData = sortData;
        console.log('fuwuqi');
        console.log(curData);
        for (var i = 0;i < curData.length;i++) {
            data[curData[i].otherApppId] = {
                id: curData[i].id,
                otherApppId: curData[i].otherApppId,
                sort: curData[i].sortNum,
                appStatus: curData[i].appStatus
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
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    //标准应用数据绑定
    function defaultFun(data, eq) {
        var btn = "",
            str = '',
            iconStr = '',
            className = '',
            hasImg = '';
        icon = iconMap['appId_' + data.appId];
        if (!icon) {
            icon = iconMap['appId_0'];
        }
        if (data.iconUrl) {
            hasImg = ' has-img';
            iconStr = (m3.getCurServerInfo().url + '/mobile_portal' + data.iconUrl);
            iconStr = ' id="icon-img-'+data.appId+'-'+eq+'" data-view-url="' + iconStr + '">';
            className = '';
        } else {
            className = 'message-default message-' + data.appId;
            iconStr = '><span class="iconfont ' + icon.icon + '"></span>';
        }
        if (data.appStatus == "0") { //隐藏的
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini"><div class="cmp-switch-handle"></div></div>';
        } else {
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini cmp-active"><div class="cmp-switch-handle"></div></div>';
        }
        if (!filterApp(data.appId)) {
            str += '' +
                '<li data-id="' + data.id + '" class="cmp-table-view-cell cmp-media list-top"><hr/>' +
                '<div class="list-app-item">' +
                '<div class="cmp-media-body cmp-slider-handle">' +
                '<div class="cmp-pull-left message_left_icon ' + className + ' img radius'+hasImg+'"' + iconStr +
                '</div>' +
                '<p class="message_list_title notags">' + data.appName + '</p>' + btn +
                '</div>' +
                '</div>' +
                '</li>';
        }
        return str;
    }

    //biz数据绑定function
    function bizFun(data, eq) {
        var btn = "",
            str = '',
            hasImg = '';
        if (data.iconUrl) {
            if(data.iconUrl.match('fileUpload.do|upload.do|.png') || data.appId == '43'){
                hasImg = ' has-img';
                icon = (m3.getCurServerInfo().url + '/mobile_portal' + data.iconUrl);
                // icon = '<img src="" id="icon-img-'+data.appId+'-'+eq+'" data-view-url="' + icon + '"/>';
                icon = ' id="icon-img-'+data.appId+'-'+eq+'" data-view-url="' + icon + '">';
            }else {
                var iconfont = 'see-icon-' + data.iconUrl.split('vp-')[1];
                icon = '><span style="width: 100%;height: 100%;" class="icon-color icon-default icon-unread see-icon-application ' + iconfont + ' iconfont" ></span>';
            }
        } else {
            // icon = '<span class="iconfont see-icon-m3-customized-fill"></span>';
            icon = '><span class="iconfont see-icon-m3-appDefault-fill"></span>'
        }
        if (data.appStatus == "0") { //隐藏的业务生成器
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini"><div class="cmp-switch-handle"></div></div>';
        } else {
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini cmp-active"><div class="cmp-switch-handle"></div></div>';
        }
        str += '' +
            '<li data-id="' + data.id + '" class="cmp-table-view-cell cmp-media list-top"><hr/>' +
            '<div class="list-app-item">' +
            '<div class="cmp-media-body cmp-slider-handle">' +
            '<div class="cmp-pull-left message_left_icon message-default message-' + data.appId + ' img radius'+hasImg+'"' + icon + '</div>' +
            '<p class="message_list_title notags">' + data.appName + '</p>' + btn +
            '</div>' +
            '</div>' +
            '</li>';
        return str;
    }

    //第三方数据绑定
    function othersFun(data, eq) {
        var btn = "",
            tags = "",
            thirdApp = "",
            str = '',
            suteClass = '';
        if ( data.appType == 'suite' ) {
            suteClass = 'suite';
        }
        if (data.appStatus == "0") { //隐藏的业务生成器
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini"><div class="cmp-switch-handle"></div></div>';
        } else if (data.appStatus == "1") {
            btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini cmp-active"><div class="cmp-switch-handle"></div></div>';
        } else {
            if (data.appType == "integration_local_h5") { //此种类型才下载
                btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini cmp-active display_none"><div class="cmp-switch-handle"></div></div>' +
                    '<div class="cmp-pull-right open third-app">' + m3i18n[cmp.language].opened + '</div>' +
                    '<div class="cmp-fileupload-file-content cmp-pull-right display_none">' +
                    '<div class="cmp-fileupload-animation item">' +
                    '<div class="circle">' +
                    '<div class="pie_left">' +
                    '<div class="left"></div>' +
                    '</div>' +
                    '<div class="pie_right">' +
                    '<div class="right"></div>' +
                    '</div>' +
                    '<div class="mask">' +
                    '<span class="stop"></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {
                btn = '<div class="cmp-pull-right cmp-switch cmp-switch-blue cmp-switch-mini cmp-active display_none"><div class="cmp-switch-handle"></div></div>' +
                    '<div class="cmp-pull-right open third-app">' + m3i18n[cmp.language].opened + '</div>'
            }
        }

        //第三方标签
        data.tags && $.each(JSON.parse(data.tags), function(i, n) {
            tags += '<span class="tags">' + n.escapeHTML() + '</span>';
        });
        if (!data.tags) {
            thirdApp += '<p class="message_list_title notags ' + suteClass + '">' + data.appName + '</p>';
        } else {
            thirdApp += '<div class="cmp-pull-left ' + suteClass + '" style="width: 50%;"><div class="app_name">' + data.appName + '</div><div class="tags_wrapper">' + tags + '</div></div>';
        }

        if (data.iconUrl) {
            // icon = '<img style="width: 100%;height: 100%;border-radius: 6px;" src="' + (m3.getCurServerInfo().url + '/mobile_portal' + data.iconUrl) + '"/>';
            icon = (m3.getCurServerInfo().url + '/mobile_portal' + data.iconUrl);
            // icon = '<img src="" id="icon-img-'+data.appId+'-'+eq+'" data-view-url="' + icon + '"/>';
            icon = ' id="icon-img-'+data.appId+'-'+eq+'" data-view-url="' + icon + '">';
            str += '' +
                '<li data-detailid="' + data.otherApppId + '" data-id="' + data.id + '" data-hasPlugin="' + data.hasPlugin + '" data-appName="' + data.appName + '" class="cmp-table-view-cell cmp-media list-top third-app"><hr/>' +
                '<div class="list-app-item">' +
                '<div class="cmp-media-body cmp-slider-handle">' +
                '<div class="cmp-pull-left message_left_icon message-default ' + suteClass + ' message-' + data.appId + ' img radius has-img"' + icon + '</div>' +
                thirdApp + btn +
                '</div>' +
                '</div>' +
                '</li>';
        } else {
            icon = '><span class="iconfont see-icon-m3-third"></span>';
            str += '' +
                '<li data-detailid="' + data.otherApppId + '" data-id="' + data.id + '" data-hasPlugin="' + data.hasPlugin + '" data-appName="' + data.appName + '" class="cmp-table-view-cell cmp-media list-top third-app"><hr/>' +
                '<div class="list-app-item">' +
                '<div class="cmp-media-body cmp-slider-handle">' +
                '<div class="cmp-pull-left message_left_icon message-default message-' + data.appId + ' img radius"' + icon + '</div>' +
                thirdApp + btn +
                '</div>' +
                '</div>' +
                '</li>';
        }
        return str;
    }

    //事件初始化
    function initEvent() {
        iconMap = getIconMap();

        cmp.webViewListener.add({
            type: 'm3OpenThirdApp'
        });
        document.addEventListener("m3OpenThirdApp", function(event) {
            curNode = curNode.find('.open');
            if (!curNode.hasClass('third-app'))return;
            /*
             hasPlugin：1 已购买应用插件
             hasPlugin：0 未购买应用插件
             */
            var hasPlugin = curNode.parents('li').attr("data-hasPlugin");
            var appName = curNode.parents('li').attr("data-appName");
            var appId = curNode.parents('li').attr("data-id"),
                index = getIndex('id', appId);
            console.log('index');
            console.log(sortData[index]);
            console.log(index);
            var self = curNode;
            //点击“确定”后，H5应用包在更多应用列表页面加载（调用圆形进度条组件）
            if (sortData[index].appType == "integration_local_h5") { //H5类型才有zip包下载
                self.next().removeClass("display_none"); //显示下载进度样式
                var progressBtn = self.next();
                var btn = self.prev();
                var openBtn = self;
                self.addClass("display_none"); //去掉开通按钮
                downloadThird(sortData[index], openBtn, progressBtn, btn, index);
            } else {
                self.prev().removeClass("display_none"); //显示开关按钮
                self.remove(); //去掉开通按钮
                sortData[index].appStatus = '1';
                sortData[index].sortNum = ++sortDel;
                console.log(sortData[index]);
                saveAppList(function() {
                    cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh"});
                });
            }
        });

        $('.m3-content').on('tap', '.message_list_title,.cmp-pull-left', function(e) {
            var id = $(this).parents('li').attr('data-detailid'),
                isOpen;
            if ( $(this).hasClass('suite') ) {
                return;
            }
            if ( id ) {
                curNode = $(this).parents('li');
                if ( curNode.find('.open').length == 0 ) {
                    curState = isOpen = true;
                } else {
                    curState = isOpen = false;
                }
                m3.state.go('http://application.m3.cmp/v/layout/app-detail.html?cmp_orientation=auto&id='+id+'&isOpen='+isOpen,{id: id, isOpen: isOpen}, '', true);
            }
        })
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
        //左上角返回按钮
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
        var timer, tip = true;
        $('.m3-content').on('tap', 'h3', function() {
            clearTimeout(timer);
            var objList = $('#' + $(this).find('.see-icon-m3-arrow-down').attr('data-tgt')),
                objThis = $(this).find('.see-icon-m3-arrow-down');
            //是否为激活状态
            if (objThis.hasClass('arr-active') && tip) {
                objThis.removeClass('arr-active');
                objList.removeClass('list-active');
            } else {
                objThis.addClass('arr-active');
                objList.addClass('list-active');
            }
            tip = false;
            timer = setTimeout(function() {
                tip = true;
            }, 300);
        });

        //按钮开启、关闭事件
        $(".m3-content").on("toggle", ".cmp-switch", function(e) {
            var id = $(this).parents('li').attr("data-id"),
                index = getIndex('id', id);
            if (index === -1) {
                var e = new Error('操作开关是没有匹配到对应的应用信息');
                e.msg = '操作开关是没有匹配到对应的应用信息';
                m3Error.notify(e, 'window');
                cmp.notification.toast('保存数据异常', "center");
                return;
            }
            if (e.detail.isActive) { //开启按钮
                sortData[index].appStatus = '1';
                sortData[index].sortNum = ++sortDel;
            } else { //关闭按钮
                sortData[index].appStatus = '0';
                sortData[index].sortNum = ++sortDel;
            }
            saveAppList(function() {
                cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh"});
            });
        });

        //第三方应用下载
        $(".m3-content").on("tap", ".open", function() {
            if (!$(this).hasClass('third-app'))return;
            /*
             hasPlugin：1 已购买应用插件
             hasPlugin：0 未购买应用插件
             */
            var hasPlugin = $(this).parents('li').attr("data-hasPlugin");
            var appName = $(this).parents('li').attr("data-appName");
            var appId = $(this).parents('li').attr("data-id"),
                index = getIndex('id', appId);
            console.log('index');
            console.log(sortData[index]);
            console.log(index);
            var self = $(this);
            if (hasPlugin == "0") {
                //如果未购买该应用插件，提示：“您还不是“应用名称”的企业用户，请联系管理员购买”
                cmp.notification.confirm(m3i18n[cmp.language].notBuyTip1 + appName + m3i18n[cmp.language].notBuyTip2, function(index, callback) {}, "", [m3i18n[cmp.language].iKnow], -1, "");
            } else {
                //如果已购买插件，且已获得授权，弹出提示“您确定要开通此应用吗”
                cmp.notification.confirm(m3i18n[cmp.language].openTip, function(_index, callback) {
                    if (_index == 1) {
                        //点击“确定”后，H5应用包在更多应用列表页面加载（调用圆形进度条组件）
                        if (sortData[index].appType == "integration_local_h5") { //H5类型才有zip包下载
                            self.next().removeClass("display_none"); //显示下载进度样式
                            var progressBtn = self.next();
                            var btn = self.prev();
                            var openBtn = self;
                            self.addClass("display_none"); //去掉开通按钮
                            downloadThird(sortData[index], openBtn, progressBtn, btn, index);
                        } else {
                            self.prev().removeClass("display_none"); //显示开关按钮
                            self.remove(); //去掉开通按钮
                            sortData[index].appStatus = '1';
                            sortData[index].sortNum = ++sortDel;
                            console.log(sortData[index]);
                            saveAppList(function() {
                                cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh"});
                            });
                        }
                    }
                }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok], -1, "");
            }

        });
    }

    //根据ID获取appINfo
    function getAppById(id, callback) {
        var index = getIndex('id', id);
        console.log()
        callback(sortData[index], index);
    }

    //根据key，value获取index
    function getIndex(key, value) {
        var data = sortData;
        for (var i = 0;i < data.length;i++) {
            if (data[i][key] === value) {
                return i;
            }
        }
        return -1;
    }

    //初始化数据
    function initListData(callback) {
        nativeApi.getAppList(function(appListData) {
            var appList;
            appListData = JSON.parse(appListData);
            if (Object.prototype.toString.call(appListData) === '[object Array]') {
                console.log('=========原生 数据源=========')
                console.log([].concat(appListData));
                sortData = filterArr(appListData);
            } else {
                console.log('=========服务器 数据源=========')
                console.log(cmp.extend({},appListData));
                //数据格式化，过滤,原样数据
                sortData = filtAppList(appListData);
                sortDel = [].concat(sortData).length;
            }
            console.log(sortData);
            appList = formatAppList(sortData);
            callback(appList);
        });
    }

    function filterArr(data) {
        var arr = [];
        sortDel = data.length;
        delArr = [];
        for (var i = 0;i < data.length;i++) {
            if (data[i].appStatus === '0' || data[i].appId == '62' || data[i].appId == '56' || data[i].appId == '58') {
                data[i].sortNum = sortDel++
                delArr.push(data[i]);
            } else {
                arr.push(data[i]);
            }
        }
        return arr.concat(delArr);
    }

    //分类显示的applist格式化
    function formatAppList(data) {
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
        data = arr;
//        data = data.sort(function(a, b) {
//            if ( a.m3AppType.sort >= b.m3AppType.sort ) {
//                return true;
//            } else {
//                return false
//            }
//        });
        var map = {},
            sortMap = {};
        for (var i = 0;i < data.length;i++) {
            var typeId = data[i].m3AppType.id
            //判断该类别在map中是否存在，不存在则创建
            if (!map[typeId])
                map[typeId] = [];
            map[typeId].push(data[i]);
        }
        console.log(map)
        return map;
    }

    //图标映射
    function getIconMap() {
        return {
            appId_0: {
                icon: 'see-icon-m3-appDefault-fill',
                text: '默认图标'
            },
            appId_1: {
                icon: 'see-icon-m3-coordination-fill',
                text: '协同'
            },
            appId_4: {
                icon: 'see-icon-m3-document',
                text: '公文'
            },
            appId_7: {
                icon: 'see-icon-m3-notice-fill',
                text: '公告'
            },
            appId_8: {
                icon: 'see-icon-m3-new-fill',
                text: '新闻'
            },
            appId_10: {
                icon: 'see-icon-m3-research',
                text: '调查'
            },
            appId_6: {
                icon: 'see-icon-m3-meeting-fill',
                text: '会议'
            },
            appId_3: {
                icon: 'see-icon-m3-file',
                text: '文档'
            },
            appId_17: {
                icon: 'see-icon-m3-salary',
                text: '工资条'
            },
            appId_46: {
                icon: 'see-icon-m3-footprint-fill',
                text: '足迹'
            },
            appId_9: {
                icon: 'see-icon-m3-talk',
                text: '讨论'
            },
            appId_48: {
                icon: 'see-icon-m3-queryStatistics',
                text: '查询统计'
            },
            appId_59: {
                icon: 'see-icon-m3-search',
                text: '全文检索'
            },
            appId_61: {
                icon: 'see-icon-m3-zhixin-fill',
                text: '致信'
            },
            appId_9999: {
                icon: 'see-icon-m3-offlineDocument-fill',
                text: '离线文档'
            },
            appId_60: {
                icon: 'see-icon-m3-collect-fill',
                text: '我的收藏'
            },
            appId_36: {
                icon: 'see-icon-m3-sign',
                text: '签到'
            },
            appId_30: {
                icon: 'see-icon-m3-mission-fill',
                text: '工作任务'
            },
            appId_11: {
                icon: 'see-icon-m3-schedule-fill',
                text: '日程事件'
            },
            appId_40: {
                icon: 'see-icon-m3-show-fill',
                text: '享空间'
            },
            appId_42: {
                icon: 'see-icon-m3-performance',
                text: '行为绩效'
            },
            appId_59: {
                icon: 'see-icon-m3-search',
                text: '全文检索'
            },
            appId_63: {
                icon: 'see-icon-m3-reportAnalysis-fill',
                text: '报表分析'
            },
            appId_70: {
                icon: 'see-icon-m3-reportcenter',
                text: '报表中心'
            },
            appId_79: { // 小智ai
                icon: 'see-icon-m3-xiaozhi',
            }
        };
    }

    //过滤不显示的app应用
    function filterApp(appId) {
        if (appId === "-1" || appId === "2" || appId === "43" || appId === "44" || appId === "45" || appId === "47" || appId === "49" || appId === "50" || appId === "51") {
            return true;
        } else {
            return false;
        }
    }

    //左上角返回按钮


    //下载第三方应用
    function downloadThird(info, openBtn, progressBtn, btn, index) {
        //下载成功后，即为开通，去除下载按钮，显示为滑块开关
        progressBtn.addClass("display_none");
        btn.removeClass("display_none");
        //更新appStatus状态
        console.log(sortData[index]);
        sortData[index].appStatus = '1';
        sortData[index].sortNum = ++sortDel;
        saveAppList(function() {
            cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh"});
        });
//        var downloadUrl = m3.curServerInfo.url + "/mobile_portal/api/mobile/app/download/" + info.appId + "?checkCode=" + " ";
//        var aExtData = {
//            appID: info.appId,
//            name: info.appName,
//            type: "",
//            domain: info.domain,
//            version: info.version
//        },
//            index = getIndex('id', info.appId);
//        cmp.app.downloadApp({
//            "url": downloadUrl,
//            "title": info.bundleName + ".zip",
//            "extData": aExtData,
//            success: function() { //加载完成后，“开通”按钮变为显示开关，同时在应用列表中添加此应用的icon（如果应用分类，显示在更多应用分类中）
//                //返回数据没到1,即num不够180就进入success了，所以要自己再画出完整的右半边进度条
//                var left = document.querySelector('.left');
//                left.style.webkitTransform = "rotate(180deg)";
//                left.style.msTransform = "rotate(180deg)";
//                //下载成功后，即为开通，去除下载按钮，显示为滑块开关
//                progressBtn.addClass("display_none");
//                btn.removeClass("display_none");
//                //更新appStatus状态
//                sortData[index].appStatus = '1';
//                sortData[index].sortNum = ++sort;
//                saveAppList(function() {
//                    cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh"});
//                });
//            },
//            progress: function(res) {
//                //下载进度显示
//                progress(res.pos);
//            },
//            error: function() {
//                console.log(m3i18n[cmp.language].downloadFail + downloadUrl + "  " + aExtData.name);
//                progressBtn.addClass("display_none");
//                openBtn.removeClass("display_none");
//            }
//        });
    }

    //下载进度显示
    function progress(markNumber) {
        var mask = document.querySelector('.mask');
        if (!mask) return;
        var markNumber = markNumber;
        var left = document.querySelector('.left');
        var right = document.querySelector('.right');
        if (markNumber) {
            var num = Math.floor(parseFloat(markNumber) * 360);
            if (num <= 180) {
                right.style.webkitTransform = "rotate(" + (num) + "deg)";
                right.style.msTransform = "rotate(" + (num) + "deg)";
            } else {
                //num没有正好180的情况，所以要自己再画出完整的左半边进度条
                right.style.webkitTransform = "rotate(180deg)";
                right.style.msTransform = "rotate(180deg)";
                var ber = num - 180;
                left.style.webkitTransform = "rotate(" + (ber) + "deg)";
                left.style.msTransform = "rotate(" + (ber) + "deg)";
            }
        }
    }
})();
