/**
 * @description门户banner
 */
;(function() {
    var workbench, m3, m3Cache, m3Ajax,cacheStyle,banner, urlParams, cmpApp, navMenuComponent;
    define(function(require, exports, module) {
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3Cache = require('nativeCache');
        rebuildCmpAPP();
        banner = require('application/js/app-banner.js');
        require('application/js/app_application.js');
        workbench.initPage();
    });
    function rebuildCmpAPP() {
        /*构建app模块的按需加载*/
        cmpApp = {
            getLocalResourceUrl: function () {
                getCmpAppJs('getLocalResourceUrl', arguments)
            },
            setStatusBar: function () {
                getCmpAppJs('setStatusBar', arguments)
            }
        };
        function getCmpAppJs(callBack, args) {
            if (document.querySelector('#js-cmp-app') && cmp.app) {
                cmp.app[callBack].apply(cmp.app, args);
            } else {
                if (!document.querySelector('#js-cmp-app')) {
                    cmp.asyncLoad.js(
                        [{
                            url: 'http://cmp/v/js/cmp-app.js',
                            id: 'js-cmp-app'
                        }], function () {
                            cmp.app[callBack].apply(cmp.app, args);
                        })
                }
            }
        }
    }
    function getParamByUrl (str) {
        try {
            var url = decodeURI(str || '');
            url = url.split('?')[1];
            url = url.replace(/=/g, '":"');
            url = url.replace(/&/g, '","');
            url = url.replace('?', '');
            url = url.replace(/#\S*/g, '')
            url = '{"' + url + '"}';
        } catch (e) {
            return {};
        }
        return JSON.parse(url);
    };
    function resizeBanner () {
        if (banner && banner.bannerSlider) {
            banner.bannerSlider.refresh();
            setTimeout(function () {
                $('#app-banner').css({overflow: 'visible'})
            }, 0)
        }
    };
    workbench = {
        //门户数据
        data: null,
        //加载完成标识
        appLoaded: false,
        //初始化
        initPage: function() {
            var _this = this;
            cmp.ready(function() {
                cmp.dialog.loading({status:'global', text: fI18nData['application.m3.h5.pageLoading']});
                urlParams = getParamByUrl(window.location.search);
                _this.initEvent();
                _this.initPortal(true);
                _this.bgChangeEvent();
            });
        },
        initSourceWithBack: function() {
            var parentLevel = (urlParams.ParamHrefMark || (urlParams.isfromnative == "true"));
            cmp.backbutton();
            $('.switch-app-header .cmp-title').removeClass('display_none');
            $("#backBtn").on("tap", function() {
                cmp.href.back();
            });
            if (parentLevel) {
                $('.switch-app-header .page-into').removeClass('display_none');
                $('.switch-app-header').removeClass('menu-into-header');
                $("#backBtn").on("tap", function() {
                    cmp.href.back();
                });
            } else {
                $('.switch-app-header .menu-into').removeClass('display_none');
                cmp.backbutton.push(cmp.closeM3App);
            }
        },
        initEvent: function(){
            var _this = this;
            _this.initSourceWithBack();
            cmp.webViewListener.add({type: 'portal-set'});
            document.addEventListener('portal-set', function() {
                _this.initPortal(false);
            });
            //v-portal门户自定义webview事件
            //刷新空间
            cmp.webViewListener.add({type: 'initSection'});
            document.addEventListener('initSection', function(e) {
                document.querySelectorAll('iframe')[0].contentWindow['m3ToPortalFireEvent']('initSection', e.data);
            });
            //栏目自定义
            cmp.webViewListener.add({type: 'saveSectionCustomizeCallBack'});
            document.addEventListener('saveSectionCustomizeCallBack', function(e) {
                document.querySelectorAll('iframe')[0].contentWindow['m3ToPortalFireEvent']('saveSectionCustomizeCallBack', e.data);
            });
            //刷新栏目
            cmp.webViewListener.add({type: 'refreshPortalData'});
            document.addEventListener('refreshPortalData', function(e) {
                document.querySelectorAll('iframe')[0].contentWindow['m3ToPortalFireEvent']('refreshPortalData', e.data);
            });
            //跳转到设置页面
            $('.app-setting').on('tap', function() {
                url = 'http://application.m3.cmp/v/layout/app-setting.html?cmp_orientation=auto';
                m3.state.go(url, {}, '', true);
            });
            var autoUnlock;
            //监听门户的iframe加载成功失败触发事件解锁页签按钮
            // document.addEventListener("com.seeyon.m3.portalLoaded",function(){
            //     // $('.m3-navbar').find("li").removeClass("disabled");
            //     // if(autoUnlock){
            //     //     clearInterval(autoUnlock);
            //     // }
            // });

            // document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
            //     setTimeout(function(){
            //         resizeBanner()
            //     },0);
            // });
            // //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
            // if ( cmp.os.ios ) {
            //     document.addEventListener("resume",function(){
            //         resizeBanner()
            //     },false);
            // }
            cmp.event.orientationChange(function(res){
                setTimeout(function() {
                    resizeBanner()
                }, 400);
            });
        },
        loadIframe4Portal:function(options){
            var _this = this;
            var requestUrl = "",iframeUrlParams = "";
            switch (options.type){
                case "portal":
                    requestUrl = "http://portal.v5.cmp/v1.0.0/html/portalIndex2.html";
                    iframeUrlParams = '?portalId=' + options.portalId + '&ParamHrefMark=workbench';
                    break;
                case "cap4":
                    requestUrl = "http://application.m3.cmp/v/layout/m3-transit-cap4.html";
                    iframeUrlParams = "?menuId=" + options.menuId +"&name=" + options.name.replace(/\s+/g, "") + '&m3From=workbench';
                    break;
            }
            cmpApp.getLocalResourceUrl({
                url:requestUrl,
                success:function(ret){
                    var iframeObj = $('<iframe class="flex-1 portal-wrapper"></iframe>');
                    var iframeUrl = ret.localUrl + iframeUrlParams;
                    setTimeout(function() {
                        _this.destoryIframe();
                        iframeObj.attr('src', iframeUrl);
                        $('.portal').append(iframeObj);
                    }, 300)

                },
                error:function(e){
                    ctrObj.removeClass("disabled");
                    alert('获取信息门户异常，请截图联系管理员');
                }
            })
        },
        destoryIframe:function () {
            $(document).find(".portal-wrapper").remove();
        },

        initPortal: function( isLoadAjax ) {
            var _this = this;
            this.initData(function( data ) {
                _this.data = data;
                _this.render();
            }, isLoadAjax);
        },

        //获取缓存
        initData: function(callback, isLoadAjax) {
            var _this = this;
            //获取缓存
            m3Cache.getCache('m3-portal-cache', function(ret) {
                console.log('缓存portal的数据');
                console.log(ret);
                //获取缓存成功
                _this.data = ret;

                if ( !isLoadAjax ) {
                    callback(_this.data);
                    return;
                }
                _this.getSeverData(function(data) {
                    callback(_this.formatData(ret, data.data));
                    //更新缓存
                    _this.updataCache();
                });
            }, function(e) {
                console.log('portal获取cache失败');
                //没有缓存，ret默认为null
                _this.getSeverData(function(data) {
                    var data = _this.formatData(null, data.data);
                    callback(data);
                    //更新缓存
                    _this.updataCache();
                });
            });
        },

        //获取服务器数据
        getSeverData: function( callback ) {
            var url = m3.getCurServerInfo().url + '/mobile_portal/seeyon/rest/mobilePortal/portals/mobile';
            m3Ajax({
                type: 'GET',
                url: url,
                ajaxId: 'portallist-973e61a0-6c54-4796-a390-a72906787c70',
                setCache: {
                    isShowNoNetWorkPage: false
                },
                success: function(ret) {
                    console.log('portal server')
                    console.log(ret)
                    ret.data.splice(0, 0, {
                        portalId: '0',
                        portalName: fI18nData["application.m3.h5.usApps"]
                    });
                    callback(ret);
                },
                error: function(e) {
                    console.log('获取服务器portal失败');
                    callback({
                        data: null
                    });
                }
            });
        },

        //渲染
        template: function( data ) {
            var str = '';
            for ( var i = 0;i < data.length;i++ ) {
                var name = '';
                if ( data[i].portalName.length > 6 ) {
                    name = data[i].portalName.substring(0, 6) + '...';
                } else {
                    name = data[i].portalName;
                }
                str += '<li class="portal-link m3-text-lowlight" id="' + data[i].portalId + '" data-portalid="' + data[i].portalId + '" portal-type="' + data[i].portalType + '">\
                            ' + name.escapeHTML() + '\
                        </li>'
            }
            return str;
        },
        navbarEvent: function () {
        console.log(11);
         var _this = workbench;
        if($(this).hasClass("disabled")) {
            cmp.notification.toast(cmp.i18n("application.m3.h5.tapfast"),"center",1000);
            return false;
        } else {
           var toast = document.querySelector(".cmp-toast");
            toast && toast.remove();
        }
        var portalId = $(this).attr('data-portalid'),
            portalType = $(this).attr('portal-type'),
            name = $(this).text();

        _this.destoryIframe();

        $('.m3-navbar').find('.portal-link').removeClass('active');
        $(this).addClass('active');


        if ( portalId === '0' ) {
            //适配门户底色改变后，外层的颜色和文字、状态栏颜色的改变 xinpei 2018-5-10
            var oldChangeStyle = document.getElementById("m3-change-style");
            if(oldChangeStyle){
                oldChangeStyle.remove();
            }
            document.body.style.backgroundColor = "";
            cmpApp.setStatusBar({
                statusBarStyle:0,
                bgColor:"#ffffff"
            });
            cacheStyle = {
                statusBarStyle:0,
                bgColor:"#ffffff"
            };
            if ( !_this.appLoaded ) {
                m3.notify('app-banner', '#app-banner');
                m3.notify('app-application');
                _this.appLoaded = true;
            }
            // setTimeout(function() {
            //     resizeBanner();
            // }, 400);
            $('.workbench').removeClass('display-none');
            $('.portal').addClass('display-none');

        } else {

            $('.m3-navbar').find(".portal-link").addClass("disabled");
            autoUnlock = setTimeout(function(){//三秒后自动解锁，避免加载其他iframe时对方没有处理到位，导致锁没有解除
                $('.m3-navbar').find(".portal-link").removeClass("disabled");
            },3000);
            //cap4门户
            if ( portalType !== 'mobile' ) {
                _this.loadIframe4Portal({type:"cap4",menuId:portalId,name:name});
                $('.workbench').addClass('display-none');
                $('.portal').removeClass('display-none');
                return;
            }
            //portal门户
            $('.workbench').addClass('display-none');
            $('.portal').removeClass('display-none');
            // _this.loadPortal(portalId);
            _this.loadIframe4Portal({type:"portal",portalId:portalId});
        }
        cmp.storage.save('curTapPortal', portalId);
    },
        render: function() {
            var _this = this;
            if (document.querySelector('#js-classHorizontalNav') && cmp.asyncLoad) {
                callback()
            } else if(!document.querySelector('#js-classHorizontalNav')){
                cmp.asyncLoad.js([
                    {url: 'http://application.m3.cmp/v/js/horizontal-nav.js', id: 'js-classHorizontalNav'}
                ], callback);
            }
            function callback() {
                navMenuComponent = new window.classHorizontalNav({
                    hasBar: true,
                    data: _this.data.add || [],
                    itemRender: function (item) {
                        return '<div class="portal-link" id="' + item.portalId + '" data-portalid="' +
                            item.portalId + '" portal-type="' +
                            item.portalType + '">'+
                            item.portalName.escapeHTML()+'</div>'
                    },
                    drag: true,
                    warpClass: 'nav-warp',
                    activeClass: 'active',
                    onclick: _this.navbarEvent
                });
                navMenuComponent && navMenuComponent.$mount('.m3-navbar');
                $('.opacity-hidden').removeClass('opacity-hidden');
                cmp.dialog.loading(false);
            }
        },

        //合并，格式化数据 ret为缓存数据，data为服务器数据
        formatData: function( ret, data ) {
            var map = {
                add: [],
                del: []
            };
            //没有缓存
            if ( ret == null ) {
                //接口异常
                if ( data == null ) {
                    map.add.push({
                        portalId: '0',
                        portalName: fI18nData["application.m3.h5.usApps"]
                    });
                    return map;
                }
                for ( var i = 0;i < data.length;i++ ) {
                    map.add.push(data[i]);
                }
                return map;
            //合并数据
            } if ( data == null ) {
                return ret;
            } else {
                //已添加分类
                for ( var i = 0,addData = ret.add;i < addData.length;i++ ) {
                    for ( var j = 0;j < data.length;j++ ) {
                        //服务器返回的存在
                        if ( data[j].portalId === addData[i].portalId ) {
                            map.add.push(data[j]);
                            break;
                        }
                    }
                }
                //未添加分类
                for ( var i = 0,delData = ret.del;i < delData.length;i++ ) {
                    for ( var j = 0;j < data.length;j++ ) {
                        //服务器返回的存在
                        if ( data[j].portalId === delData[i].portalId ) {
                            map.del.push(data[j]);
                            break;
                        }
                    }
                }
                //新增
                return this.updateItem(map, data);
            }
        },

        updateItem: function( map, data ) {
            for ( var i = 0;i < data.length;i++ ) {
                if ( map.add.length === 0 ) {
                    map.add.push(data[i]);
                    continue;
                }
                for ( var a = 0,addData = [].concat(map.add);a < addData.length;a++ ) {
                    if ( data[i].portalId === addData[a].portalId ) {
                        break;
                    }
                    if ( a === addData.length - 1 && !this.isInDelArr(map.del, data[i].portalId)) {
                        map.add.push(data[i]);
                    }
                }
            }
            console.log('update')
            console.log(map)
            return map;
        },

        isInDelArr: function( del, portalId ) {
            for ( var i = 0; i < del.length;i++ ) {
                if ( del[i].portalId === portalId ) {
                    return true
                }
            }
            return false;
        },

        //更新缓存
        updataCache: function(callback) {
            callback = callback || function() {}
            //更新保存门户缓存
            m3Cache.setCache('m3-portal-cache', this.data, callback, callback);
        },
        bgChangeEvent:function(){//监听适配门户底色改变后，外层的颜色和文字、状态栏颜色的改变 xinpei 2018-5-10
            // var _this = this;
            document.addEventListener("com.seeyon.m3.backgroundChange",function(e){
                /*var changeData = e.data;
                if(changeData){
                    var bgColor = changeData.bgColor,color = changeData.color,statusBarStyle= changeData.statusBarStyle;
                    var styleTag = document.createElement("style");
                    styleTag.id = 'm3-change-style';
                    var styleStr = "";
                    var oldChangeStyle = document.getElementById("m3-change-style");
                    if(oldChangeStyle){
                        oldChangeStyle.remove();
                    }
                    if(bgColor){
                        document.body.style.backgroundColor = bgColor;
                        styleStr =
                            " .m3-bg-transparent{background-color: transparent;}";
                    }
                    if(color){
                        var downColor = _this.colorDown(color,-60);
                        styleStr +=
                            " .m3-text-highlight{color:"+color+"!important;}" +
                            " .m3-text-lowlight{color:"+downColor+"!important;}" +
                            " .m3-text-lowlight.active{color:"+color+"!important;}";
                    }
                    console.log(statusBarStyle);
                    console.log(styleStr);
                    console.log(bgColor);
                    styleTag.innerHTML = styleStr;
                    document.head.appendChild(styleTag);
                    cacheStyle = {
                        statusBarStyle:statusBarStyle,
                        bgColor:bgColor
                    };
                    cmpApp.setStatusBar({
                        statusBarStyle:statusBarStyle,
                        bgColor:bgColor
                    });

                }*/
            });
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function(){//页面可见，还原成设置状态
                if(cacheStyle){
                    cmpApp.setStatusBar(cacheStyle);
                }
            });
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didDisAppear",function(){//页面不可见，导航栏颜色还原成初始状态
                cmpApp.setStatusBar({
                    statusBarStyle:0,
                    bgColor:"#ffffff"
                });
            })
        },
        colorDown: function (col, amt) {
            var usePound = false;

            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }

            var num = parseInt(col, 16);

            var r = (num >> 16) + amt;

            if (r > 255) r = 255;
            else if (r < 0) r = 1;

            var b = ((num >> 8) & 0x00FF) + amt;

            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            var g = (num & 0x0000FF) + amt;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            var hexStr = (g | (b << 8) | (r << 16)).toString(16);
            if (hexStr.length < 6) {
                var supplyNum = 6 - hexStr.length;
                for (var i = 0; i < supplyNum; i++) {
                    hexStr = "0" + hexStr;
                }
            }
            return (usePound ? "#" : "") + hexStr;
        },
    }
})();