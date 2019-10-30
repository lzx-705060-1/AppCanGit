;(function() {
    var task, server, listview, m3, m3Util;
    define('todo/js/app-task.js', function(require, exports, module) {
        m3 = require('m3');
        m3Util = require('tools');
        require('zepto');
        listview = require('todo/js/cmp-list-view.js');
        server = require('todo/js/ajax-todo-sdk.js');
        module.exports = task;
    });

    
    task = {

        $onloaded: function() {
            this.initEvent();
            this.taskScroll = this.initScroll();
            this.initData(1, 20, true);
        },

        methods: {

            taskBasePath: 'http://taskmanage.v5.cmp/v',

            i18n: function(key) {
                return window.fI18nData[ 'todo.m3.h5.' + key ];
            },

            //初始化事件
            initEvent: function() {
                var _this = this;
                $('#task-list-view').on('tap', 'li', function() {
                    var taskId = $(this).attr('data-id');
                    cmp.href.next(_this.taskBasePath + '/html/taskEditor.html', {taskId: taskId}, {openWebViewCatch: true})
                });

                $('#task-app').on('tap', function() {
                    m3.getDefaultAppByAppId('30', function(info) {
                        if (info.appId) {
                            m3.loadApp(info);
                        }
                    });
                })
            },

            initData: function(pageNum, pageSize, isRfresh, isNotRefreshPageNum) {
                var _this = this;
                server.getTaskList(pageNum, pageSize, function(respones) {
                    var data = respones.data;
                    console.log(respones);
                    _this.render(data, isRfresh);
                    if (!isNotRefreshPageNum) {
                        _this.pageNum = pageNum;
                        _this.taskScroll.refresh({
                            totalPage: Math.ceil(respones.total / 20),
                            pageNum: pageNum
                        });
                    }
                    if (data.length === 0) {
                        _this.showNoContent();
                    } else {
                        _this.removeNoContent();
                    }
                });
            },

            initScroll: function() {
                var _this = this;
                return listview('#task-list-view', {
                    nextHandle: function(pageNum) {
                        _this.initData(pageNum, 20, false);
                    },

                    refreshHandle: function(pageNum) {
                        _this.initData(pageNum, 20, true);
                    }
                });
            },

            refresh: function() {
                pageObj = this.calPageNum(this.pageNum, 100000);
                this.initData(pageObj.pageNum, pageObj.pageSize, true, true);
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

            render: function(respones, isRfresh) {
                var str = '', stateClass, stateStr, joinerStr,
                    startTime, endTime, attachmentClass, riskClass, mileStoneClass;
                for (var i = 0;i < respones.length;i++) {
                    var data  = respones[ i ];
                    attachmentClass = data.hasAttachments ? ' hasAttachment ' : ' hasNoAttachment';
                    riskClass = data.riskLevel === '0' ? ' hasNoRisk' : ' hasRisk';
                    mileStoneClass = data.milestone === '1' ? ' hasMileStone' : ' hasNoMileStone';
                    //status 1表示未开始 2表示进行中 6表示已超期
                    stateClass = 'task-state-' + data.status;
                    stateStr = '<i class="task-state ' + stateClass + '">' + data.statusLabel + '</i>';
                    joinerStr = data.participatorsLabel ? '<span class="list-member textover-1">' + this.i18n('joiner') + '：' + data.participatorsLabel.escapeHTML() + '</span>' : '';
                    //全天任务判断
                    startTime = this.formatTime(parseInt(data.plannedStartTime));
                    endTime = this.formatTime(parseInt(data.plannedEndTime));
                    str += '    <li data-id="' + data.id + '">\
                                    ' + stateStr + '\
                                    <span class="list-title textover-2">' + (data.subject || '').escapeHTML() + '</span>\
                                    <span class="list-time textover-1">\
                                        <i>' + startTime + ' <i class="color-d4">—</i> ' + endTime + '</i>\
                                        <i class="iconfont see-icon-m3-attachment ' + attachmentClass + '"></i>\
                                        <i class="iconfont see-icon-task-milestone ' + mileStoneClass + '"></i>\
                                        <i class="iconfont see-icon-task-risk ' + riskClass + '"></i>\
                                    </span>\
                                    <span class="list-resp textover-1">' + this.i18n('responer') + '：' + (data.managersLabel || '').escapeHTML() + '</span>\
                                    ' + joinerStr + '\
                                </li>';
                }
                if (isRfresh) {
                    $(this.target).find('#task-list-view').find('ul').html(str);
                } else {
                    $(this.target).find('#task-list-view').find('ul').append(str);
                }
            },

            formatTime: function(timestamp) {
                return m3.showTime(m3Util.formatDate(timestamp, 'yyyy-MM-dd hh:mm'));
            },

            showNoContent: function() {
                var _this = this;
                if ($('#task-list-view').find('.m3-no-content').length !== 0) {return;}
                $('#task-list-view').append('<div class="m3-no-content"><span class="no-content-icon"></span><span>' + fI18nData[ 'noContent' ] + '<span><div>');
                //暂无数据
                $('#task-list-view').find('.m3-no-content').on('tap', function(e) {
                    _this.initData(1, 20, true);
                });
            },

            removeNoContent: function() {
                $('#task-list-view').find('.m3-no-content').off().remove();
            },
        }
    };
})();