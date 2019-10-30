;(function() {
    var schedule, server, m3, m3Util, cmpUtil, listview;
    define('todo/js/app-schedule.js', function(require, exports, module) {
        require('zepto')
        require('iscroll1');
        m3 = require('m3');
        listview = require('todo/js/cmp-list-view.js');
        cmpUtil = require('todo/js/cmp-util.js');
        m3Util = require('tools');
        server = require('todo/js/ajax-todo-sdk.js');
        module.exports = schedule;
    });

    
    schedule = {

        $onloaded: function() {
            this.initEvent();
            this.scheduleScroll = this.initScroll();
            this.initData();
        },

        methods: {

            //初始化事件
            initEvent: function() {
                var _this = this,
                    linkMap = this.getAppConfigMap();
                $('#schedule-list-view').on('tap', 'li', function() {
                    var type = $(this).attr('data-type'),
                        url = linkMap[ type ].entry,
                        paramId = $(this).attr('data-paramid'),
                        param = {};
                        param[ linkMap[ type ].paramKey ] = paramId;
                    cmp.href.next(url, param, {openWebViewCatch: true})
                });

                $('#schedule-app').on('tap', function() {
                    m3.getDefaultAppByAppId('11', function(info) {
                        if (info.appId) {
                            m3.loadApp(info);
                        }
                    });
                })
            },

            initData: function() {
                var _this = this,
                    todayTime = this.getTadayTime(),
                    startTime = todayTime.startTime,
                    endTime = todayTime.endTime;
                this.startTime = startTime;
                this.endTime = endTime;
                server.getScheduleList(startTime, endTime, function(respones) {
                    console.log(respones);
                    _this.toIntTime(respones.datas);
                    cmpUtil.sortByKey(respones.datas, 'startTime');
                    respones.datas = _this.formatList(respones.datas);
                    _this.render(respones.datas);
                    _this.scheduleScroll.refresh();
                });
            },

            toIntTime: function(data) {
                for (var i = 0;i < data.length;i++) {
                    data[ i ].startTime = parseInt(data[ i ].startTime);
                    data[ i ].endTime = parseInt(data[ i ].endTime);
                }
            },

            formatList: function(data) {
                var crossDay = [],
                    normal = [];
                for (var i = 0;i < data.length;i++) {
                    if (data[ i ].startTime < this.startTime || data[ i ].endTime > this.endTime) {
                        data[ i ].crossDay = true;
                        crossDay.push(data[ i ]);
                    } else {
                        normal.push(data[ i ]);
                    }
                }
                return normal.concat(crossDay);
            },

            getTadayTime: function() {
                var curDate = new Date();
                curDate.setHours(0);
                curDate.setMinutes(0);
                curDate.setSeconds(0);
                curDate.setMilliseconds(0);
                return {
                    startTime: curDate.getTime(),
                    endTime: curDate.getTime() + (24 * 60 * 60 - 1) * 1000
                }
            },

            initScroll: function() {
                var _this = this;
                return new listview('#schedule-list-view', {
                    refreshHandle: function() {
                        _this.initData();
                    }
                });
            },

            refresh: function() {
                this.initData();
            },

            i18n: function(key) {
                return window.fI18nData[ 'todo.m3.h5.' + key ];
            },
            
            render: function(respones) {
                var str = '', data, isAllcrossDay = true, isCrossDay, 
                    curTime = new Date().getTime();
                this.hasTimeLine = false;
                for (var i = 0;i < respones.length;i++) {
                    data = respones[ i ];
                    isCrossDay = data.crossDay;
                    if (!isCrossDay) {isAllcrossDay = false;}
                    if (curTime <= data.startTime && !this.hasTimeLine) {
                        str += this.getCurTimeLine();
                        this.hasTimeLine = true;
                    }
                    //第一个跨天
                    if (data.crossDay && !this.hasTimeLine) {
                        str += this.getCurTimeLine();
                        this.hasTimeLine = true;
                    }
                    str += '<li class="flex-h ' + (isCrossDay ? 'cross-day' : '') + '" data-type="' +  data.type  + '" data-paramid="' + data.id + '">\
                                <span class="schdule-time">\
                                    <i>' + (isCrossDay ? this.i18n('crossDay') : this.formatTime(data.startTime)) + '</i>\
                                    <i>' + data.typeName + '</i>\
                                </span>\
                                <span class="schedule-content flex-1">\
                                    <i class="schedule-sub textover-2">' + data.title + '</i>\
                                    <i>' + this.formatTime(data.startTime, isCrossDay) + ' <i class="color-d4">—</i> ' + this.formatTime(data.endTime, isCrossDay) + '</i>\
                                </span>\
                            </li>';
                    
                }
                $('#schedule-list-view').find('ul').html(str);
                if (respones.length === 0) {
                    this.showNoContent();
                } else {
                    this.removeNoContent();
                }
                //没有显示时间轴
                if (!this.hasTimeLine) {
                    //全部是跨天且没有显示时间轴
                    if (isAllcrossDay) {
                        $('#schedule-list-view').find('.cross-day').eq(0).before(this.getCurTimeLine());
                        this.hasTimeLine = true;
                        return;
                    }
                    $('#schedule-list-view').find('ul').append(this.getCurTimeLine());
                }
            },

            getCurTimeLine: function() {
                return '<li class="current-time flex-h y-center">\
                            <span class="schdule-time">' + this.i18n('curDateTime') + '</span>\
                            <span class="flex-1 time-line"></span>\
                        </li>';
            },

            formatTime: function(timestamp, isCrossDay) {
                //跨天
                if (isCrossDay) {
                    return m3Util.formatDate(timestamp, 'MM-dd hh:mm');
                }
                return m3Util.formatDate(timestamp, 'hh:mm');
            },

            showNoContent: function() {
                var _this = this;
                if ($('#schedule-list-view').find('.m3-no-content').length !== 0) {return;}
                $('#schedule-list-view').append('<div class="m3-no-content"><span class="no-content-icon"></span><span>' + fI18nData[ 'noContent' ] + '<span><div>');
                //暂无数据
                $('#schedule-list-view').find('.m3-no-content').on('tap', function(e) {
                    _this.initData();
                });
            },

            removeNoContent: function() {
                $('#schedule-list-view').find('.m3-no-content').off().remove();
            },

            getAppConfigMap: function() {
                return {
                    'meeting': {
                        appId: '6',
                        entry: 'http://meeting.v5.cmp/v1.0.0/html/meetingDetail.html',
                        paramKey: 'meetingId'
                    },
                    'taskManage': {
                        appId: '30',
                        entry: 'http://taskmanage.v5.cmp/v1.0.0/html/taskEditor.html',
                        paramKey: 'taskId',
                    },
                    'calendar': {
                        appId: '11',
                        entry: 'http://calendar.v5.cmp/v1.0.0/html/newCalEvent.html',
                        paramKey: 'id'
                    }
                }
            }
        }
    };
})();