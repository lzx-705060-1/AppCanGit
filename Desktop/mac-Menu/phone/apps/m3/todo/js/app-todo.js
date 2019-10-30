;(function() {
    //定义模块
    var todo, task, schedule, cmplife, server, swipeView, m3, nativeSdk, m3Cache, m3Util, m3i18n, pageTask, pageSchedule, imgLoader;
    define('todo/js/app-todo.js', function(require, exports, module) {
        //模块加载
        require('zepto');
        m3 = require('m3');
        m3i18n = require('m3i18n');
        m3Util = require('tools');
        m3Cache = require('nativeCache');
        cmplife = require('todo/js/cmp-life.js');
        server = require('todo/js/ajax-todo-sdk.js');
        swipeView = require('todo/js/todo-swipe-view.js');
        nativeSdk = require('todo/js/cmp-native-sdk.js');
        m3Native = require('native');
        task = require('todo/js/app-task.js');
        schedule = require('todo/js/app-schedule.js');
        iscroll = require('iscroll1');
        imgLoader = require('cmpComponents/cmp-img-loader.js');
        window.__todo__ = cmplife('#todo-wapper', todo);
        module.exports = todo;
    });
    todo = {

        $onloaded: function() {
            var _this = this;
            cmp.dialog.loading({status:'global', calcHClass: 'header-nav', text: m3i18n[ cmp.language ].loading});
            this.initSourceWithBack();
            this.initEvent();
            this.initTodo();
            this.initTodoListEvent();
            this.initSetNavEvent();
            this.getAppAndConfigRequestStatus(function() {
                _this.initAuthority();
            });
        },

        $webviewListener: {
            //M3批处理，快捷处理webview监听
            M3ProcessFinish: function(e) {
                var param = e.data || {};
                //归档的处理
                param.type === 'archive' && this.archiveUnActive();
                //成功
                if (param.success) {
                    param.type === 'fastProcess' && cmp.notification.toast(this.i18n('processSuccess'), 'center', 2000, 1);
                    //刷新列表
                    cmp.event.trigger('com.seeyon.m3.ListRefresh',document, {type: 'update'})
                } else {
                    param.type === 'fastProcess' && cmp.notification.confirm(param.message || '',function(){}, this.i18n('quickProcessNotice'), [ m3i18n[cmp.language].ok ],"",false,0);
                }
                param.type === 'fastProcess' && this.closeQuickProcess();
            },

            'com.seeyon.m3.ListRefresh': function(e) {
                var _param = e.data || {}
                console.log('待办锚点');
                console.log(e);
                if ( _param.type === 'update' ) {
                    var curNavData = this.navData.show[ this.curTodoNavIndex ],
                        param = curNavData.portletParams,
                        appId = curNavData.appId,
                        pageObj = this.calPageNum(this.curListPageNum, 100);
                    this.scrollRender(pageObj.pageNum, pageObj.pageSize, true);
                    //刷新任务 日程
                    if (_param.appId === '30') {
                        pageTask && pageTask.refresh();
                        pageSchedule && pageSchedule.refresh();
                    }
                    //刷新日程
                    if(_param.appId === '11' || _param.appId === '6') {
                        pageSchedule && pageSchedule.refresh();
                    }
                }
            },

            'com.seeyon.m3.phone.webBaseVC.didAppear': function() {
                this.getUnread();
            },

            CMPNetworkStatusChange: function(e) {
                var _this = this;
                setTimeout(function() {
                    _this.swipeView && _this.swipeView.refresh();
                }, 0);
            }
        },

        methods: {
            //是否是最新的applist
            isNewAppList: false,
            //是否是最新的权限信息
            isNewConfig: false,
            //NAV 缓存的key
            navCacheKey: 'M3TodoNavData',
            //一级nav index
            curNavIndex: 0, 
            //todo 二级 nav index
            curTodoNavIndex: 0,
            //页签拖拽排序数据
            navData: {},
            //页签滚动条
            todoNavScroll: null,
            //当前todo list 页数
            curListPageNum: 1,
            initSourceWithBack: function() {
                //显示
                if (window.isNeedShowHeader) {
                    $('.header-nav').find('.other-btns').remove();
                } else {
                    $('.other-btns').removeClass('display-none');
                }
            },
            //初始化待办
            initTodo: function() {
                var _this = this;
                server.getNavList(function(response) {
                    console.log(response);
                    var firstNav;
                    _this.combineNav(response.data, function() {
                        firstNav = _this.navData.show[ 0 ];
                        _this.renderNav(true);
                        _this.initTodoNavScroll();
                        _this.initSwipeView();
                        _this.initTodoListData(0, firstNav.appId, firstNav.portletParams, firstNav.aiSort, 1, firstNav.isThird);
                        //分段加载 500m后渲染
                        setTimeout(function() {
                            _this.renderSetNav($('#nav-show'), _this.navData.show);
                            _this.renderSetNav($('#nav-hide'), _this.navData.hide, true);
                        }, 500)
                    });
                });
            },

            //刷新 applist config ingo
            refreshAppAndConfig: function() {
                var _this = this;
                if (_this.refreshNoBack) {return;}
                _this.refreshNoBack = true;
                m3Native.refreshAppAndConfig(function(info) {
                    _this.refreshNoBack = false;
                    var _info;
                    try {
                        _info = JSON.parse(info);
                    } catch(e) {
                        _info = {};
                        cmp.notification.toast(_this.i18n('refreshJsonError'), 'center');
                        return;
                    }
                    _this.isNewAppList = _info.applist;
                    _this.isNewConfig = _info.config;
                    cmp.event.trigger('M3ConfigOrApplistRequestCompleted', document, {type: 'config'});
                    cmp.event.trigger('M3ConfigOrApplistRequestCompleted', document, {type: 'applist'});
                }, function() {_this.refreshNoBack = false;});
            },

            initSwipeView: function() {
                var showNav = this.navData.show,
                    _this = this;
                this.swipeView = swipeView('.todo-list-content', {
                    wapperSize: 3,
                    navStack: this.getNavIds(showNav),
                    swipeHandle: function(index) {
                        _this.curTodoNavIndex = index;
                        _this.todoNavTranslate(index);
                    },
                    swipeInitHandle: function(index) {
                        _this.curTodoNavIndex = index;
                        _this.initTodoListData(index, showNav[ index ].appId, showNav[ index ].portletParams, showNav[ index ].aiSort, 1, showNav[ index ].isThird);
                    }
                });
            },

            i18n: function(key) {
                return window.fI18nData[ 'todo.m3.h5.' + key ];
            },

            //事件初始化
            initEvent: function() {
                var _this = this,
                    timer, todoNode = $('#todo'),
                    navNode = $('.header-nav-btn').find('a');
                
                //初始化config，applist接口监听
                m3.M3InitRequestListener(function(type) {
                    _this.M3InitRequestListener(type);
                });

                $('.back').on('tap', function() {
                    cmp.href.back();
                });

                //点击一级页签
                navNode.on('tap', function(e) {
                    var $this = $(this);
                    if ($this.hasClass('see-icon-v5-common-arrow-back')) {
                        cmp.href.back();
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        var index = parseInt($this.attr('data-index'));
                        if (_this.batchProcessActive) {
                            _this.batchProcessDialog();
                            return;
                        }
                        //重复点击处理
                        if (index === _this.curNavIndex) {
                            //展示已办等入口
                            if (index === 0 && !$this.hasClass('disable-entry')) {
                                _this.translateTodoEntry($this);
                            }
                            return;
                        }
                        if (todoNode.hasClass('m3-rotate180')) {
                            _this.translateTodoEntry(todoNode);
                        }
                        if (!_this.isNewAppList) {
                            _this.refreshAppAndConfig();
                            cmp.notification.toast(m3i18n[cmp.language].loadingApplist, 'center');
                            return;
                        }
                        //页签激活
                        $('.header-nav-btn').find('a').removeClass('active');
                        $this.addClass('active');
                        //过渡
                        _this.wapperTranslate(index);
                        //任务
                        if (index === 1 && !_this.taskLoaded) {
                            pageTask = window.__task__ = cmplife('#task-wapper', task);
                            _this.taskLoaded = true;
                        //日程
                        } else if (index === 2 && !_this.scheduleLoaded) {
                            pageSchedule = window.__schedule__ = cmplife('#schedule-wapper', schedule);
                            _this.scheduleLoaded = true;
                        }
                    }, 100);
                });

                //点击二级待办页签
                $('#nav-tabbar').on('tap', 'li', function(e) {
                    var $this = $(this);
                    if (_this.batchProcessActive) {
                        _this.batchProcessDialog();
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        var index = parseInt($this.attr('data-index')), param,
                            appId = $this.attr('data-appid');
                        param = _this.getNavParam(appId);
                        _this.curTodoNavIndex = index;
                        //滑动到指定的view
                        _this.swipeView.scrollToView(index);
                    }, 300);
                });

                //透明层
                $('.todo-entry-opacity').on('tap', function() {
                    //关闭已办，待发，已发
                    $('#todo').trigger('tap');
                });

                //entry 已办，待发，已发
                $('.todo-entry').find('div').on('tap', function() {
                    if (!_this.isNewConfig) {
                        _this.refreshAppAndConfig();
                        cmp.notification.toast(m3i18n[cmp.language].loadingConfig, 'center');
                        return;
                    }
                    var tgt = $(this).attr('data-target');
                    //判断是否有协同包信息
                    m3.penetrated({
                        appId: '1',
                        type: "shortcut",
                        sendParms: {
                            openFrom: tgt
                        },
                        returnUrl: m3.href.map.todo_index,
                        openNewPage: 1
                    });
                    //关闭过渡
                    $('#todo').trigger('tap');
                });

                //快捷方式
                $('#create, #create1').on('tap', function() {
                    if (_this.batchProcessActive) {
                        _this.batchProcessDialog();
                        return;
                    }
                    nativeSdk.showShortcuts();
                });

                //全文检索
                $('#search, #search1').on('tap', function() {
                    if (_this.batchProcessActive) {
                        _this.batchProcessDialog();
                        return;
                    }
                    if ( m3.userInfo.getCurrentMember().hasIndexPlugin ) {
                        //进入全文检索应用------代码修改：默认直接进入全文检索应用
                       m3.getDefaultAppByAppId("59",function(res){
                           if(!res) {
                               cmp.notification.toast(_this.i18n('hasNoIndexPlugin'), 'center');
                           };
                           m3.loadApp(res);
                       });
                    } else {
                        cmp.href.next('http://todo.m3.cmp/v1.0.0/layout/todo-search.html?cmp_orientation=auto', 'todo-list',  {openWebViewCatch: true});
                    }
                });

                //批处理
                $('#todo-wapper').on('tap', '.batch-btn', function() {
                    _this.activeBatchProcess();
                    //显示
                    $('.all-select').removeClass('display-none');
                    $('.cancel-btn').removeClass('display-none');
                    //隐藏
                    $('.ai-sort').addClass('display-none');
                    $(this).addClass('display-none');
                });
            },

            M3InitRequestListener: function(type) {
                console.log('M3InitRequestListener ' + type);
                if (type === 'config') {
                    this.isNewConfig = true;
                    this.initAppAuthority();
                } else if(type === 'applist'){
                    this.initTodoAuthority();
                    this.isNewAppList = true;
                }
            },

            //待办列表事件
            initTodoListEvent: function() {
                var timer, tapTime, 
                    todoWapper = $(".todo-list-content"),
                    _this = this;
                $('body').off().on('tap', function() {
                    _this.closeQuickProcess();
                });
                todoWapper.off();
                //批处理取消
                todoWapper.on('tap', '.cancel-btn', function() {
                    _this.closeBatchProcess();
                });

                todoWapper.on('touchstart', '.quick-process', function(e) {
                    if (_this.batchProcessActive) {return;}
                    e.preventDefault();
                    e.stopPropagation();
                    if (_this.quickProcessActive) {return;}
                    var node = $(this).parent().parent().parent(),
                        appId = node.attr('data-appid');
                    _this.activeQuickProcess(node, appId);
                });

                //智能排序
                todoWapper.on('tap', '.ai-sort', function() {
                    var curNavData = _this.navData.show[ _this.curTodoNavIndex ];
                    if (curNavData.aiSort) {
                        curNavData.aiSort = false;
                        $(this).text(_this.i18n('AISort'));
                    } else {
                        $(this).text(_this.i18n('cancelAISort'));
                        curNavData.aiSort = true;
                    }
                    _this.scrollRender(1, 20, true);
                    _this.curListPageNum = 1;
                    //保存缓存
                    _this.setNavCache(_this.navData);
                });

                //全选
                todoWapper.on('tap', '.all-select', function() {
                    var liNode = $(this).parent().next().find('li');
                    liNode.trigger('tap');
                });

                //列表事件
                todoWapper.on("touchstart", "li", function() {
                    var $this = $(this),
                        appId = $this.attr('data-appid');
                    if (appId !== '1' && appId !== '6') {
                        return;
                    }
                    clearTimeout(timer);
                    tapTime = new Date().getTime();
                    //长按
                    timer = setTimeout(function() {
                        if (_this.batchProcessActive) {return;}
                        if (_this.quickProcessActive) {return;}
                        _this.activeQuickProcess($this, appId);
                    }, 750);
                }).on("touchend", "li", function() {
                    clearTimeout(timer);
                }).on("touchmove", "li", function(e) {
                    //滑动时不触发长按
                    clearTimeout(timer);
                });

                todoWapper.on('tap', 'li', function() {
                    if ($('.quick-process-btn').length > 0) {
                        _this.closeQuickProcess();
                        return;
                    }
                    //只读
                    if ($(this).hasClass('readonly')) {
                        cmp.notification.toast(m3i18n[cmp.language].notSupport, "center");
                        return;
                    }
                    if (_this.batchProcessActive) {
                        _this.selectList($(this));
                        return;
                    }
                    var appId = $(this).attr("data-appId"),
                        isThird = $(this).hasClass('third-li'),
                        gotoParams = $(this).attr("data-gotoParams");
                    if (isThird) {
                        gotoParams.appId = appId;
                        m3.loadApp(JSON.parse(gotoParams), "todo");
                    } else {
                         m3.penetrated({
                            //会议室申请需要特殊处理一下，需要跳转到会议应用
                            appId: appId === '29' ? '6' : appId,
                            type: "todo",
                            sendParms: JSON.parse(gotoParams),
                            returnUrl: '',
                            openNewPage: 1
                        });
                    }
                    $(this).removeClass('unread');
                    _this.closeQuickProcess();
                });
                var timer1;
                //点击快捷处理
                todoWapper.on('touchend', '.quick-process-link', function(e) {
                    var $this = $(this),
                        liNode = $this.parent().prev();
                    clearTimeout(timer1);
                    timer1 = setTimeout(function() {
                        e.preventDefault();
                        e.stopPropagation();
                        var attitude = $this.attr('data-attitude'),
                            appId = $this.attr('data-appid'),
                            handleParam;
                        console.log(liNode);
                        handleParam = JSON.parse(liNode.attr('data-handleParam'))
                        handleParam.attitude = attitude;
                        handleParam.feedbackFlag = attitude;
                        console.log(handleParam);
                        _this.actionApi(appId, appId === '6' ? 'fastReplyProcess' : 'fastProcess', handleParam)
                        _this.quickProcessActive = false;
                    }, 300);
                });

                $('.doc-opacity').off().on('tap', function() {
                    _this.archiveUnActive();
                });

                //转发 归档 删除 批处理
                $('#batch-forword, #batch-archive, #batch-delete, #batch-process').off().on('tap', function() {
                    var method = $(this).attr('data-method'), 
                        selectedNode = $(".todo-list-content").find('.selected'),
                        params = [];
                    if (selectedNode.length === 0) {
                        cmp.notification.toast(_this.i18n('selectTip'), 'center');
                        return;
                    }
                    for (var i = 0;i < selectedNode.length;i++) {
                        params.push(JSON.parse(selectedNode.eq(i).attr('data-handleParam')));
                    }
                    var handle = function() {
                        method === 'archiveProcess' && _this.archiveActive();
                        console.log('doc-opacity', method);
                        _this.actionApi('1', method, params);
                        _this.closeBatchProcess();
                    }
                    console.log(params, method);
                    if (!_this.batchJSLoaded) {
                        cmp.asyncLoad.css([
                            'http://cmp/v/css/cmp-listView.css'
                        ])
                        cmp.asyncLoad.js([
                            'http://cmp/v/js/cmp-imgCache.js',
                            'http://cmp/v/js/cmp-listView.js'
                        ], function() {
                            handle();
                        });
                    } else {
                        handle();
                    }
                });
            },

            archiveActive: function() {
                var docOpacity = $('.doc-opacity');
                cmp.dialog.loading(true);
                docOpacity.removeClass('display-none').addClass('m3-fadein');
                setTimeout(function() {
                    docOpacity.removeClass('m3-down2up-100');
                }, 300);
            },

            archiveUnActive: function() {
                var docOpacity = $('.doc-opacity');
                cmp.dialog.loading(false);
                docOpacity.removeClass('m3-fadein').addClass('m3-fadeout');
                setTimeout(function() {
                    $('#docPigeonhole').css('display','none');
                    docOpacity.addClass('display-none').removeClass('m3-fadeout');
                }, 300);
            },

            //初始化nav 拖拽排序事件
            initSetNavEvent: function() {
                var _this = this, timer,
                    isEdit = false,
                    nodeShow = $('#nav-show'),
                    nodeHide = $('#nav-hide'),
                    navTextNode = $('.todo-nav-text'),
                    addTextNode = $('.nav-set-add'),
                    timer,
                    sortActive = function() {
                        var node = $('.nav-edit');
                        nodeShow.find('li').addClass('sort-active').find('.see-icon-menhushezhiquxiao').removeClass('display-none');
                        nodeHide.find('li').find('.see-icon-menhushezhitianjia').removeClass('display-none');
                        addTextNode.removeClass('display-none');
                        _this.navSortable.options.disabled = false;
                        _this.navSortableActive = true;
                        node.text(_this.i18n('complete'));
                        navTextNode.text(_this.i18n('drugSort'));
                        isEdit = true;
                        _this.cloneNavData = JSON.parse(JSON.stringify(_this.navData));
                    }, 
                    sortUnActive = function() {
                        var node = $('.nav-edit');
                        nodeShow.find('li').removeClass('sort-active').find('.see-icon-menhushezhiquxiao').addClass('display-none');
                        nodeHide.find('li').find('.see-icon-menhushezhitianjia').addClass('display-none');
                        addTextNode.addClass('display-none');
                        _this.navSortable.options.disabled = true;
                        _this.navSortableActive = false;
                        node.text(_this.i18n('edit'));
                        navTextNode.text(_this.i18n('selectEntryType'));
                        isEdit = false
                    };

                //设置nav
                $('.edit-nav').on('tap', function(e) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        if (_this.batchProcessActive) {
                            _this.batchProcessDialog();
                            return;
                        }
                        //开启导航设置
                        _this.translateNavSet(true);
                    }, 300);
                });

                //nav透明层
                $('.nav-set-opacity').on('tap', function() {
                    //关闭导航设置
                    _this.translateNavSet(false);
                    if (isEdit) {
                        sortUnActive();
                        _this.navData = _this.cloneNavData;
                        _this.renderSetNav($('#nav-show'), _this.navData.show);
                        _this.renderSetNav($('#nav-hide'), _this.navData.hide, true);
                    }
                });

                //长按激活排序
                nodeShow.on('touchstart', 'li', function() {
                    if (_this.navSortableActive) {return;}
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        sortActive();
                    }, 750);
                }).on('touchmove', 'li', function() {
                    clearTimeout(timer);
                }).on('touchend', 'li', function() {
                    clearTimeout(timer);
                });

                //nav set点击li进入页签
                nodeShow.on('tap', 'li', function() {
                    if (_this.navSortableActive) {return;}
                    var appId = $(this).attr('data-appid');
                    $('.nav-set-opacity').trigger('tap');
                    $('#nav-tabbar').find('li[data-appid="' + appId + '"]').trigger('tap');
                });

                //删除todo nav
                nodeShow.on('tap', '.see-icon-menhushezhiquxiao', function(e) {
                    var appId = $(this).parent().attr('data-appid'),
                        index = m3Util.arrIndexByKey(_this.navData.show, 'appId', appId),
                        node = $(this).parent().clone();
                    e.stopPropagation();
                    e.preventDefault();
                    //不能全部删除
                    if (_this.navData.show.length === 1) {
                        cmp.notification.toast(_this.i18n('delateTip'), 'center');
                        return;
                    }
                    //删除显示的nav
                    _this.deleteNavItem(index);
                    $(this).parent().remove();
                    node.removeClass('sort-active').find('.see-icon-menhushezhiquxiao').addClass('display-none');
                    node.find('.see-icon-menhushezhitianjia').removeClass('display-none');
                    nodeHide.append(node);
                    if (_this.navData.hide.length > 0) {
                        nodeHide.prev().removeClass('display-none');
                    }
                    //当前是否为激活的页签
                    if (node.hasClass('active')) {
                        node.removeClass('active');
                        nodeShow.find('li').eq(0).addClass('active');
                    }
                });

                //新增todo nav
                nodeHide.on('tap', 'li', function(e) {
                    if (!isEdit) {return;}
                    var appId = $(this).attr('data-appid'),
                        index = m3Util.arrIndexByKey(_this.navData.hide, 'appId', appId),
                        node = $(this).clone();
                    e.stopPropagation();
                    e.preventDefault();
                    //删除显示的nav
                    _this.addNavItem(index);
                    node.addClass('sort-active').find('.see-icon-menhushezhiquxiao').removeClass('display-none');
                    node.find('.see-icon-menhushezhitianjia').addClass('display-none');
                    nodeShow.append(node);
                    $(this).remove();
                    if (_this.navData.hide.length === 0) {
                        nodeHide.prev().addClass('display-none');
                    }
                });

                //点击 nav 完成，编辑
                $('.nav-edit').on('tap', function(e) {
                    //正在编辑 点击完成
                    if (isEdit) {
                        var firstNav = _this.navData.show[ 0 ];
                        //保存缓存
                        _this.setNavCache(_this.navData);
                        sortUnActive();
                        _this.renderNav();
                        //销毁swipeView
                        _this.swipeView.destroy();
                        _this.initTodoListEvent();
                        //初始化
                        _this.initSwipeView();
                        _this.initTodoListData(0, firstNav.appId, firstNav.portletParams, firstNav.aiSort, 1);
                        _this.todoNavScroll.refresh();
                        _this.todoNavScroll.scrollTo(0, 0, 400);
                        //关闭导航设置
                        _this.translateNavSet(false);
                        _this.curTodoNavIndex = 0;
                    //点击编辑
                    } else {
                        sortActive();
                    }
                });

                this.navSortable = new cmp.Sortable(nodeShow[ 0 ], {
                    animation: 500,
                    disabled: true,
                    onStart: function(e) {
                        setTimeout(function() {
                            $(e.target).find('.sortable-ghost').addClass('visibility-none');
                        },100)
                    },
                    onEnd: function(e) {
                        $(e.target).find('.visibility-none').removeClass('visibility-none');
                        if (e.oldIndex === e.newIndex) return;
                        _this.replaceNavItem(e.oldIndex, e.newIndex);
                    }
                });
            },

            //获取未读标识
            getUnread: function() {
                server.getUnread(function(response) {
                    console.log(response);
                    nativeSdk.setNavBarRedPoint({ "appID": "58", "show": response.data.pending});
                });
            },

            getAppAndConfigRequestStatus: function(cb) {
                var _this = this;
                m3Native.getNetworkState(function(net) {
                    var noNet = false;
                    if (net.serverStatus !== 'connect') {
                        noNet = true;
                    }
                    //获取状态
                    m3Native.getAppAndConfigRequestStatus(function(info) {
                        console.log('getAppAndConfigRequestStatus: ' + info);
                        var _info;
                        try {
                            _info = JSON.parse(info);
                        } catch(e) {
                            _info = {};
                            cmp.notification.toast(_this.i18n('jsonError'), 'center');
                            console.error('Todo Error：getAppAndConfigRequestStatus response is not a JSON string');
                        }
                        _this.isNewAppList = noNet || _info.applist;
                        _this.isNewConfig = noNet || _info.config;
                        cb();
                    }, function(e) {
                        cb();
                        cmp.notification.toast(_this.i18n('getAppConfigFail'), 'center');
                        console.error('Todo Error：getAppAndConfigRequestStatus fail');
                    });
                });
                
            },

            //初始化权限
            initAuthority: function() {
                this.initAppAuthority();
                this.initTodoAuthority();
            },

            initTodoAuthority: function() {
                m3Native.getConfigInfo(function(permission) {
                    try {
                        permission = JSON.parse(permission);
                    } catch(e) {
                        permission = {};
                        cmp.notification.toast('获取权限数据格式异常', 'center')
                    }
                    console.log(permission);
                    var entryNode = $('.todo-entry');
                    if (!permission.hasDoneList) {
                        entryNode.find('[data-target="listDone"]').addClass('display-none');
                    } else {
                        entryNode.find('[data-target="listDone"]').removeClass('display-none');
                    }
                    if (!permission.hasSentList) {
                        entryNode.find('[data-target="listSent"]').addClass('display-none');
                    } else {
                        entryNode.find('[data-target="listSent"]').removeClass('display-none');
                    }
                    if (!permission.hasWaitSendList) {
                        entryNode.find('[data-target="listWaitSend"]').addClass('display-none');
                    } else {
                        entryNode.find('[data-target="listWaitSend"]').removeClass('display-none');
                    }
                    if (!permission.hasDoneList && !permission.hasSentList && !permission.hasWaitSendList) {
                        $('#todo').addClass('disable-entry');
                    } else {
                        $('#todo').removeClass('disable-entry');
                    }
                });
            },

            //初始化task，schedule权限
            initAppAuthority: function() {
                //任务
                m3.getDefaultAppByAppId('30', function(appInfo) {
                    //存在应用
                    if (appInfo.appId) {
                        $('#task').removeClass('display-none');
                    } else {
                        $('#task').addClass('display-none');
                    }
                });
                //日程
                m3.getDefaultAppByAppId('11', function(appInfo) {
                    //存在应用
                    if (appInfo.appId) {
                        $('#schedule').removeClass('display-none');
                    } else {
                        $('#schedule').addClass('display-none');
                    }
                });
                
                //归档
                m3.getDefaultAppByAppId('3', function(appInfo) {
                    //存在应用
                    if (appInfo.appId) {
                        $('#batch-archive').removeClass('display-none');
                    } else {
                        $('#batch-archive').addClass('display-none');
                    }
                });
            },

            getNavParam: function(appId) {
                var showData = this.navData.show;
                for (var i = 0;i < showData.length;i++) {
                    if (showData[ i ].appId === appId) { return showData[ i ].portletParams }
                }
                console.error(appId + '获取参数异常');
            },

            //新增todo nav
            addNavItem: function(index) {
                var item = this.navData.hide[ index ];
                this.navData.hide.splice(index, 1);
                this.navData.show.push(item);
                //增加的过渡效果
                console.log('新增', this.navData);
                this.setNavCache(this.navData);
            },

            //删除todo nav
            deleteNavItem: function(index) {
                var item = this.navData.show[ index ];
                item.aiSort = false;
                this.navData.show.splice(index, 1);
                this.navData.hide.push(item);
                //删除过渡效果
                console.log('删除')
            },

            //交换 todo Nav
            replaceNavItem: function(from, to) {
                var showData = this.navData.show,
                    historyData = showData[ from ];
                showData.splice(from, 1);
                showData.splice(to, 0, historyData);
            },

            //wapper过渡
            wapperTranslate: function(index) {
                var _this = this,
                    wapper = $('.wapper'), 
                    methodsArr = ['initTodo', 'initTask', 'initSchedule'];
                //下一页 2L动画
                if (index > this.curNavIndex) {
                    wapper.eq(index).addClass('m3-translate-2l');
                } else {
                    wapper.eq(index).addClass('m3-translate-2r');
                }
                //显示且执行css动画
                wapper.eq(index).removeClass('display-none');
                //动画完成后 显示当前，影藏其他
                setTimeout(function() {
                    wapper.eq(_this.curNavIndex).addClass('display-none');
                    wapper.eq(index).removeClass('m3-translate-2l m3-translate-2r');
                    _this.curNavIndex = index;
                }, 300);
            },

            //todo nav 过渡
            translateNavSet: function(isOpen) {
                var navSetNode = $('.nav-set'),
                    navOpacity = $('.nav-set-opacity');
                //当前开启 关闭
                if (!isOpen) {
                    navSetNode.removeClass('m3-down2up-100').addClass('m3-up2down-100');
                    navOpacity.removeClass('m3-fadein').addClass('m3-fadeout');
                    setTimeout(function() {
                        navSetNode.addClass('display-none').removeClass('m3-up2down-100');
                        navOpacity.addClass('display-none').removeClass('m3-fadeout');
                    }, 300);
                //当前关闭 开启
                } else {
                    $('#nav-show').find('li').removeClass('active').eq(this.curTodoNavIndex).addClass('active');
                    navOpacity.addClass('m3-fadein').removeClass('display-none');
                    navSetNode.addClass('m3-down2up-100').removeClass('display-none');
                    setTimeout(function() {
                        navSetNode.removeClass('m3-down2up-100');
                    }, 300);
                }
            },

            //已办，已发，待发过渡
            translateTodoEntry: function($this) {
                var entryNode = $('.todo-entry'),
                    opacityNode = $('.todo-entry-opacity');
                //当前为开启，关闭
                if ($this.hasClass('m3-rotate180')) {
                    $this.removeClass('m3-rotate180');
                    //关闭入口。透明层
                    entryNode.removeClass('m3-slidedown').addClass('m3-slideup');
                    opacityNode.removeClass('m3-fadein').addClass('m3-fadeout');
                    setTimeout(function() {
                        entryNode.addClass('display-none').removeClass('m3-slideup');
                        opacityNode.addClass('display-none').removeClass('m3-fadeout');
                    }, 400);
                //开启
                } else {
                    $this.addClass('m3-rotate180');
                    entryNode.addClass('m3-slidedown').removeClass('display-none');
                    opacityNode.addClass('m3-fadein').removeClass('display-none');
                }
            },

            //待办页签过渡
            todoNavTranslate: function(index) {
                var navWapper = $('.todo-nav').find('li'),
                    _this = this,
                    $this = navWapper.eq(index),
                    _winW = document.body.offsetWidth,
                    nodeW = $this.width(), _x = $this.offset().left,
                    //X轴位移量
                    distX, moveX, scrollX, scrollMixX = 0;
                if (this.todoNavScroll) {
                    scrollMixX = this.todoNavScroll.maxScrollX;
                    scrollX = this.todoNavScroll.x,
                    //位移量
                    distX = nodeW / 2 + _x - _winW / 2;
                }
                navWapper.removeClass('active');
                $this.addClass('active');
                _this.navScrollTo(index);
                if (scrollMixX === 0) {return;}
                //计算位移量
                //往左边滑动
                if (distX >= 0) {
                    moveX = scrollX - distX < scrollMixX ? scrollMixX : scrollX - distX;
                } else {
                    moveX = scrollX - distX > 0 ? 0 : scrollX - distX
                }
                //神奇的iphoneX
                setTimeout(function() {
                    _this.todoNavScroll.scrollTo(moveX, 0, 500);
                }, 0);
            },

            navScrollTo: function(index) {
                console.log(index);
                var x = index === 0 ? 20 : index * 87.8 + 15;
                //iOS Android margin产生的差异
                cmp.os.android ? (x = index === 0 ? 20 : index * 87 + 15 - index / 4) : x
                $('.nav-line').css({
                    transform: 'translate3d(' + x + 'px, 0, 0)',
                    '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)'
                })
            },

            //初始化待办列表数据
            initTodoListData: function(index, appId, param, isAiSort, pageNum, isThird) {
                var _this = this, scrollOps;
                server.getTodoList(appId, isThird, param, pageNum, 20, isAiSort, function(data) {
                    _this.getUnread();
                    var total = data.data.total;
                    console.log(data);
                    scrollOps = {
                        listviewType: 'Complex-paging',
                        totalPage: Math.ceil(total / 20),
                        nextHandle: function(pageNum) {
                            console.log('next-refresh', pageNum);
                            _this.scrollRender(pageNum, 20);
                            _this.curListPageNum = pageNum;
                        },
                        refreshHandle: function(pageNum) {
                            console.log('todo-refresh', pageNum);
                            _this.scrollRender(pageNum, 20, true);
                            _this.curListPageNum = pageNum;
                        }
                    }
                    _this.navData.show[ _this.curTodoNavIndex ].total = total;
                    $('#nav-tabbar').find('li[data-appid="' + appId + '"]').find('span').text(total);
                    var obj = _this.getTodoTemplate(isThird, isAiSort, data, true);
                    _this.swipeView.renderView(index, appId, scrollOps, obj.str);
                    if (data.data.total === 0) {
                        _this.showNoContent(appId);
                    } else {
                        _this.removeNoContent(appId);
                    }
                    _this.loadHeader(obj.headerConfig);
                    cmp.dialog.loading(false);
                });
            },
            
            getNavParamByAppId: function(appId) {
                var showData = this.navData.show || [], 
                    index = m3Util.arrIndexByKey(showData, 'appId', appId);
                return showData[ index ].aiSort;
            },

            scrollRender: function(pageNum, pageSize, isRefresh) {
                var _this = this,
                    navData = this.navData.show,
                    curIndex = this.curTodoNavIndex,
                    appId = navData[ curIndex ].appId,
                    param = navData[ curIndex ].portletParams,
                    isThird = navData[ curIndex ].isThird,
                    isAiSort = navData[ curIndex ].aiSort;
                server.getTodoList(appId, isThird, param, pageNum, pageSize, isAiSort, function(data) {
                    var total = data.data.total,
                        totalPage = Math.ceil(total / 20);
                        console.log('totalPage', totalPage, pageSize);
                    _this.navData.show[ _this.curTodoNavIndex ].total = total;
                    if (total !== 0) {
                        _this.removeNoContent(appId);
                    } else {
                        _this.showNoContent(appId);
                    }
                    var obj = _this.getTodoTemplate(isThird, isAiSort, data);
                    _this.swipeView.scrollRender(appId, totalPage, obj.str, isRefresh);
                    $('#nav-tabbar').find('li[data-appid="' + appId + '"]').find('span').text(total);
                    _this.batchProcessActive && _this.activeBatchProcess();
                    _this.loadHeader(obj.headerConfig);
                });
            },

            loadHeader: function(config) {
                setTimeout(function() {
                    imgLoader(config);
                }, 0)
            },

            getNavIds: function(navData) {
                var arr = [];
                for (var i = 0;i < navData.length;i++) {
                    arr.push({
                        id: navData[ i ].appId
                    });
                }
                return arr;
            },

            getNavCache: function(cb) {
                // cb(JSON.parse(window.localStorage[ this.navCacheKey ] || '{}' ));
                m3Cache.getCache(this.navCacheKey, function(data) {
                    cb(JSON.parse(data) || {});
                }, function(data) {
                    console.error('获取nav原生缓存失败');
                    cb({})
                })
            },

            setNavCache: function(data) {
                // window.localStorage[ this.navCacheKey ] = JSON.stringify(data);
                m3Cache.setCache(this.navCacheKey, JSON.stringify(data));
            },

            clearNavCache: function() {
                delete window.localStorage[ this.navCacheKey ]
            },

            formatNavData: function(data) {
                var map = {
                    show: [],
                    hide: []
                };
                for (var i = 0;i < data.length;i++) {
                    data[ i ].aiSort = false;
                    if (data[ i ].isHide === 0) {
                        map.show.push(data[ i ]);
                    } else {
                        map.hide.push(data[ i ]);
                    }
                }
                return map;
            },
            
            combineNav: function(serverData, cb) {
                var _this = this;
                this.getNavCache(function(cache) {
                    console.log('cache', cache);
                    if (cache.show && cache.hide) {
                        _this.navData = _this.combineData(serverData, cache);
                    //不存在缓存
                    } else {
                        _this.navData = _this.formatNavData(serverData);
                    }
                    cb()
                });
            },

            combineData: function(data, cache) {
                var map = {
                    show: [],
                    hide: []
                }, newMap = {
                    show: [],
                    hide: []
                };
                //要保证缓存的顺序，只能先遍历缓存
                //遍历cache show
                for (var i = 0, show = cache.show;i < show.length;i++) {
                    var index = this.getIndex('appId', show[ i ].appId, data);
                    //是否在server存在
                    if (index !== -1) {
                        data[ index ].aiSort = show[ i ].aiSort;
                        map.show.push(data[ index ]);
                    }
                }

                //遍历cache hide
                for (var i = 0, hide = cache.hide;i < hide.length;i++) {
                    var index = this.getIndex('appId', hide[ i ].appId, data);
                    //是否在server存在
                    if (index !== -1) {
                        data[ index ].aiSort = false;
                        map.hide.push(data[ index ]);
                    }
                }

                //将之前处理好的数据拼接成一个数组
                var mapAllArr = map.show.concat(map.hide)
                //遍历server数据 
                for (var i = 0;i < data.length;i++) {
                    //查找服务器的每一条数据是否存在于缓存中 
                    //不存在则push到对应的数组中
                    if (this.getIndex('appId', data[ i ].appId, mapAllArr) === -1) {
                        data[ i ].aiSort = false;
                        if (data[ i ].isHide === 0) {
                            map.show.push(data[ i ]);
                        } else {
                            map.hide.push(data[ i ]);
                        }
                    }
                }
                return map;
            },

            getIndex: function(key, value, arr) {
                for (var i = 0;i < arr.length;i++) {
                    if (arr[ i ][ key ] === value) {
                        return i;
                    }
                }
                return -1;
            },

            //渲染nav
            renderNav: function(isInit) {
                var data = this.navData.show,
                    str = '', 
                    activeClass = ''
                if (isInit) {
                    str += '    <ul class="todo-nav flex-1">';
                }
                for (var i = 0;i < data.length;i++) {
                    activeClass = i === 0 ? 'active' : ''
                    str += '    <li class="' + activeClass + ' second-nav-item" data-index="' + i + '" data-appid="' + data[ i ].appId + '">\
                                    <span>' + data[ i ].total + '</span>\
                                    <p class="textover-1">' + (data[ i ].classificationName.escapeHTML() || '') + '</p>\
                                </li>'
                }
                if (isInit) {
                    str += '    <div class="nav-line"></div></ul>';
                }
                if (!isInit) {
                    $('#nav-tabbar').find('ul').html(str + '<div class="nav-line"></div>');
                    return;
                }
                $('#nav-tabbar').html(str);
            },

            renderSetNav: function(target, data, isHide) {
                var str = '', className;
                for (var i = 0;i < data.length;i++) {
                    //当前todonav的index 且不为隐藏
                    (i === this.curTodoNavIndex && !isHide) ? className = 'active' : className = '';
                    str += '<li class="' + className + '" data-appid="' + data[ i ].appId + '">\
                                <a class="textover-1">' + (data[ i ].classificationName.escapeHTML() || '') +  '</a>\
                                <span class="iconfont see-icon-menhushezhiquxiao display-none"></span>\
                                <span class="iconfont see-icon-menhushezhitianjia display-none"></span>\
                            </li>';
                }
                target.html(str);
            },

            //初始化待办滚动条
            initTodoNavScroll: function() {
                this.todoNavScroll = new iscroll('#nav-tabbar', {
                    scrollX: true,
                    scrollbars: false,
                    offsetT: 0,
                    offsetD: 0,
                    eventPassthrough: 'vertical',
                    disableMouse: true,
                    disablePointer: true,
                    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/ }
                });
            },

            selectList: function($this) {
                var appId = $this.attr('data-appid');
                //不是协同不能选
                if (appId !== '1') { return; }
                //当前为选中 取消选中
                if ($this.hasClass('selected')) {
                    $this.removeClass('selected');
                //当前未选中 选中
                } else {
                    $this.addClass('selected');
                }
            },

            actionApi: function(appId, method, param) {
                m3.penetrated({
                    appId: appId,
                    type: "todo",
                    returnUrl: '',
                    sendParms: param,
                    returnParms: null,
                    openNewPage: 1,
                    method: method
                });
            },

            //开启批处理
            activeBatchProcess: function() {
                this.swipeView.swipeDisabled();
                $('.batch-process-btn').removeClass('display-none');
                $('.todo-list-content').find('li').addClass('active-batch-process');
                this.batchProcessActive = true;
            },

            batchProcessDialog: function() {
                var _this = this;
                cmp.notification.confirm(this.i18n('batchDialogMsg'), function(_index) {
                    if (_index == 1) {
                        _this.closeBatchProcess();
                    }
                }, " ", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].confirm], -1, "");
            },

            //显示快捷处理
            activeQuickProcess: function($this, appId) {
                this.quickProcessActive = true;
                if ($this.hasClass('quick-process-active')) {return;}
                if (appId !== '1' && appId !== '6') {return;}
                var extParam, str, className, attitude, display, isNunciator = $this.attr('data-isNunciator')
                bgcolorMap = {
                    'collaboration.dealAttitude.haveRead': 'coo-attitude-1',
                    'collaboration.dealAttitude.agree': 'coo-attitude-2',
                    'collaboration.dealAttitude.disagree': 'coo-attitude-3'
                },
                meetingAttitude = [
                    {
                        display: this.i18n('join'),
                        className: 'coo-attitude-1',
                        value: '1'
                    },{
                        display: this.i18n('notJoin'),
                        className: 'coo-attitude-3',
                        value: '0'
                    },{
                        display: this.i18n('determined'),
                        className: 'coo-attitude-2',
                        value: '-1'
                    }
                ];
                extParam = $this.attr('data-extParam');
                try {
                    attitude = JSON.parse(extParam).attitude;
                    if (attitude === '{}') {
                        this.quickProcessActive = false;
                        return;
                    }
                    attitude = JSON.parse(attitude);
                } catch(e) {
                    //异常则表示没有态度
                    if(appId === '1') {
                        this.quickProcessActive = false;
                        return;
                    } 
                    //会议不显示快捷处理
                    if (isNunciator === '0') {
                        this.quickProcessActive = false;
                        return;
                    }
                    attitude = meetingAttitude
                }
                str = '<div class="quick-process-btn flex-h">';
                if (appId === '1') {
                    for (var value in attitude) {
                        display = attitude[ value ];
                        className = bgcolorMap[ value ];
                        str += '<a class="flex-1 quick-process-link ' + className + '" data-appid="1" data-attitude="' + value + '">' + display + '</a>';
                    }
                } else {
                    for (var i = 0;i < meetingAttitude.length;i++) {
                        display = meetingAttitude[ i ].display;
                        className = meetingAttitude[ i ].className;
                        str += '<a class="flex-1 quick-process-link ' + className + '"data-appid="6"  data-attitude="' + meetingAttitude[ i ].value + '">' + display + '</a>';
                    }
                }
                str += '</div>';
                $this.addClass('quick-process-active');
                $this.after(str);
            },

            //关闭快捷处理
            closeQuickProcess: function() {
                this.quickProcessActive = false;
                $('.quick-process-active').removeClass('quick-process-active');
                $('.quick-process-btn').remove();
            },

            //关闭批处理
            closeBatchProcess: function() {
                this.swipeView.swipeActive();
                this.batchProcessActive = false;
                $('.batch-process-btn').addClass('display-none');
                $('.todo-list-content').find('li').removeClass('active-batch-process selected');
                $('.all-select').addClass('display-none');
                $('.cancel-btn').addClass('display-none');
                //显示
                $('.batch-btn').removeClass('display-none');
                $('.ai-sort').removeClass('display-none');
            },

            getTodoTemplate: function(isThird, isAiSort, response, isScrollerHandle) {
                var res = response.data.data,
                    thirdClass = isThird ? 'third-li ' : '',
                    headerConfig = {
                        config: [],
                        defaultUrl: 'http://commons.m3.cmp/v/imgs/header.png'
                    },
                    //智能排序插件
                    hasAIPlugin = m3.userInfo.getCurrentMember().hasAIPlugin;
                aiSortStr = '<span class="ai-sort text-r textover-1">' + (isAiSort ? this.i18n('cancelAISort') : this.i18n('AISort')) + '</span>';
                aiSortStr = hasAIPlugin ? aiSortStr : '';
                var topContentStr = !isThird ? '<div class="listview-top-content flex-h">\
                                        <span class="batch-btn text-l textover-1">' + this.i18n('batch') + '</span>\
                                        <span class="all-select display-none text-l textover-1">' + this.i18n('selectAll') + '</span>\
                                        <span class="flex-1"></span>\
                                        ' + aiSortStr + '\
                                        <span class="cancel-btn display-none text-r textover-1">' + this.i18n('cancel') + '</span>\
                                    </div>' : '';
                var str =   '<div class="cmp-listview-scroll">\
                                ' + topContentStr + '\
                                <ul class="list-view-content">';
                if (!isScrollerHandle) {
                    str = '';
                }

                iconMap = this.iconMap();
                for (var i = 0;i < res.length;i++) {
                    var data = res[ i ], header = '', appName = '', str1 = '', str2 = '', str3 = '', str4 = '', quickProcess = '', disableProcessClass = data.appId !== '1' ? 'disable-batch' : '',
                        tipState = '', unRead = '', hasAttachment = '', readonlyClass = data.readonly, beBack = '', gotoParams = data.gotoParams || '',
                        extParam, handleParam, importantClass = 'iconfont see-icon-m3-important-' + data.grade;
                    extParam = JSON.stringify(data.extParam);
                    handleParam = JSON.stringify(data.handleParam);
                    var key = data.appId === '26' ? (data.appId + (data.subAppId || '')) : data.appId;
                    appName = '[' + fI18nData[ (iconMap[ 'appid_' + key ] || {}).text ] + ']';
                    if (isThird) {
                        appName = '';
                    }
                    //下面赋值的是类名
                    unRead = data.status || '';
                    //头像
                    header = m3.curServerInfo.url + '/mobile_portal' + data.senderFaceUrl + '?maxWidth=200';
                    //有无附件
                    hasAttachment = data.hasAttachment ? 'hasAttachment ' : 'hasNoAttachment';
                    //会议与协同
                    if (this.hasQuickProcess(data)) {
                        quickProcess = '<i class="quick-process iconfont see-icon-m3-more-fill"></i>';
                    }
                    //暂存代办
                    if (data.affairSubStatus === '13' || data.affairSubStatus === '19') {
                        tipState = 'save-state iconfont see-icon-m3-state';
                        str1 = '<i>' + this.i18n('staging') + '</i>';
                    }
                    //参加
                    if (data.joinMeetingState == 'FEEDBACK_FLAG_ATTEND') {
                        tipState = 'join-state iconfont see-icon-m3-state';
                        str1 = '<i>' + this.i18n('join') + '</i>';
                    }
                    //待定
                    if (data.joinMeetingState == 'FEEDBACK_FLAG_HOLD') {
                        tipState = 'undetermined-state iconfont see-icon-m3-state';
                        str1 = '<i>' + this.i18n('determined') + '</i>';
                    }
                    //回退
                    if (data.beBack) {
                        tipState = 'back-state iconfont see-icon-m3-state';
                        str1 = '<i>' + this.i18n('processBack') + '</i>';
                    }
                    //第二行的内容
                    str2 = '<i>' + appName + '  ' + data.senderName.escapeHTML() + '&nbsp;&nbsp;&nbsp;' + m3.showTime(data.createTime) + '</i>';
                    //第三行内容
                    str3 = '<span>' + this.getThirdLineMsg(data.displayValueList) + '</span>';
                    //第四行内容
                    str4 = this.getFourthMsg(data);
                    var curHeaderId = 'list-' + Math.ceil(Math.random() * 1000000000);
                    //字符串拼接
                    var replyShowFlag = data.handleParam === null ? '0' : (data.handleParam.replyShowFlag || '0');
                    str +=      '<li class="' + thirdClass + unRead  + ' ' + readonlyClass + ' flex-h ' + tipState + ' appid-' + data.appId + '"data-isNunciator="' + replyShowFlag + '" data-appid="' + data.appId + '" data-gotoParams=\'' + gotoParams + '\' data-extParam=\'' + extParam + '\' data-handleParam=\'' + handleParam + '\'>\
                                    <span class="' + disableProcessClass + ' header-icon" id="' + curHeaderId + '"></span>';
                    str +=          str1;
                    str +=          '<p class="flex-1 right-item">\
                                        <span class="title flex-h">\
                                            <i class="flex-1 textover-2 ' + importantClass + '" >' + data.content.escapeHTML() + '</i>';
                    str +=                  quickProcess;
                    str +=              '</span>\
                                        <span class="item-info ' + (hasAttachment + beBack) + ' iconfont see-icon-m3-attachment">' + str2 + '</span>';
                    str +=              str3;
                    str +=              str4;
                    str +=          '</p>\
                                </li>';
                    headerConfig.config.push({
                        url: header,
                        selector: '#' + curHeaderId
                    });
                }
                if (isScrollerHandle) {
                    str +=      '</ul>\
                                <div class="listview-bottom"></div>\
                            </div>';
                }
                return {
                    str: str,
                    headerConfig: headerConfig
                };
            },

            hasQuickProcess: function(data) {
                if (data.appId === '1') {
                    try {
                        if (data.extParam.attitude === '{}') { return false; }
                        JSON.parse(data.extParam.attitude);
                        return true;
                    } catch(e) {
                        return false;
                    }
                } else if (data.appId === '6') {
                    if (data.handleParam.replyShowFlag == '0' || data.handleParam.replyShowFlag === null) { return false; }
                    return true;
                }
                return false;
            },

            showNoContent: function(appId) {
                var _this = this;
                $('#list-' + appId).append('<div class="m3-no-content" data-appid="' + appId + '"><span class="no-content-icon"></span><span>' + fI18nData[ 'noContent' ] + '<span><div>');
                //暂无数据
                $('#list-' + appId).find('.m3-no-content').on('tap', function(e) {
                    var curNavData = _this.navData.show[ _this.curTodoNavIndex ],
                        param = curNavData.portletParams,
                        appId = curNavData.appId;
                    _this.scrollRender(1, 20, true);
                    _this.curListPageNum = 1;
                });
            },

            removeNoContent: function(appId) {
                $('#list-' + appId).find('.m3-no-content').off().remove();
            },

            calPageNum: function( pageNum, pageMaxSize ) {
                var newPageNum, pageSize;
                //大反页
                if ( pageNum * 20 > pageMaxSize ) {
                    newPageNum = Math.ceil(pageNum * 20 / pageMaxSize);
                    pageSize = pageMaxSize;
                } else {
                    newPageNum = 1;
                    pageSize = pageNum * 20;
                }
                //需要加载转换后的页数，一页的加载数量
                console.log({
                    pageNum: newPageNum,
                    pageSize: pageSize
                })
                return {
                    pageNum: newPageNum,
                    pageSize: pageSize
                }
            },

            //第三行内容 奇葩逻辑开始啦
            getThirdLineMsg: function(data) {
                var str = '';
                if (!data) {return '';}
                if (data.length === 1) {
                    str += (data[ 0 ].value || 0) + '&nbsp;' + this.i18n('reply');
                }
                if (data.length === 2) {
                    str += (data[ 0 ].value || 0) + ' ' + this.i18n('vote') + '&nbsp;&nbsp;' + (data[ 1 ].value || 0) + ' ' + this.i18n('notvote');
                }
                if (data.length === 4) {
                    str += (data[ 0 ].value || 0) + ' ' + this.i18n('join') + '&nbsp;&nbsp;' + (data[ 1 ].value || 0) + ' ' + this.i18n('nojoin') + '&nbsp;&nbsp;' + (data[ 2 ].value || 0) + ' ' + this.i18n('people.determined');
                }
                return str;
            },

            getFourthMsg: function(data) {
                var str = '';
                if (data.remainingTime === 'true') {
                    str += '<span class="over-time">' + this.i18n('overtime');
                }
                //展示会议时间
                if (data.appId === '6') {
                    str = '<span class="meeting-time">' + this.i18n('meetingTime') + '：' + (data.completeTime || '');
                }
                return str !== '' ? str + '</span>' : '';
            },

            iconMap: function() {
                return{
                    "appid_10": {
                        "icon": "see-icon-m3-research",
                        "css": "inquiry",
                        "text": "todo.m3.h5.inquiry"
                    },
                    "appid_3": {
                        "icon": "see-icon-m3-file",
                        "css": "doc",
                        "text": "todo.m3.h5.documentation"
                    },
                    "appid_4": {
                        "icon": "see-icon-m3-document",
                        "css": "edoc",
                        "text": "todo.m3.h5.document"
                    },
                    "appid_6": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_29": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_65": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_66": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_67": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_68": {
                        "icon": "see-icon-m3-meeting-fill",
                        "css": "metting",
                        "text": "todo.m3.h5.meeting"
                    },
                    "appid_1": {
                        "icon": "see-icon-m3-coordination-fill",
                        "css": "collaboration",
                        "text": "todo.m3.h5.coordination"
                    },
                    "appid_7": {
                        "icon": "see-icon-m3-notice-fill",
                        "css": "bulletin",
                        "text": "todo.m3.h5.bulletin"
                    },
                    "appid_8": {
                        "icon": "see-icon-m3-new-fill",
                        "css": "news",
                        "text": "todo.m3.h5.news"
                    },
                    "appid_9": {
                        "icon": "see-icon-m3-talk",
                        "css": "talk",
                        "text": "todo.m3.h5.discuss"
                    },
                    "appid_40": {
                        "icon": "see-icon-m3-show-fill",
                        "css": "show",
                        "text": "todo.m3.h5.bigshow"
                    },
                    "appid_260": {
                        "icon": "see-icon-m3-integratedoffice-fill",
                        "css": "car",
                        "text": "todo.m3.h5.car"
                    },
                    "appid_261": {
                        "icon": "see-icon-m3-integratedoffice-fill",
                        "css": "supplies",
                        "text": "todo.m3.h5.supplies"
                    },
                    "appid_262": {
                        "icon": "see-icon-m3-integratedoffice-fill",
                        "css": "equipment",
                        "text": "todo.m3.h5.equipment"
                    },
                    "appid_263": {
                        "icon": "see-icon-m3-integratedoffice-fill",
                        "css": "books",
                        "text": "todo.m3.h5.books"
                    }
                };
            }
        }
    };
})();