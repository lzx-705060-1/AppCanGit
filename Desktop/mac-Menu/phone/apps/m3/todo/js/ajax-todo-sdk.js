;(function() {
    var m3Ajax, server, m3;
    define('todo/js/ajax-todo-sdk.js', function(require, exports, module) {
        m3Ajax = require('ajax');
        m3 = require('m3');
        module.exports = server;
    });

    server = {

        getUnread: function(success, error) {
            m3Ajax({
                type: "GET",
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/common/hasPendingAndMessage",
                m3CatchError: false,
                success: success,
                error: error || function() {}
            });
        },

        getTaskList: function(pageNum, pageSize, success, fail) {
            m3Ajax({
                type: 'POST',
                ajaxId: '72bf712f-fb90-4572-a093-730279bb6d9b',
                url: m3.curServerInfo.url + '/mobile_portal/seeyon/rest/tasks/pending?option.n_a_s=1',
                noNetworkTgt: '.no-net',
                showLoading: false,
                data: JSON.stringify({
                    pageNo: pageNum,
                    pageSize: pageSize || 20,
                    needTotal: true
                }),
                setCache: {
                    isShowNoNetWorkPage: false
                },
                success: success,
                error: fail || function() {}
            });
        },

        getScheduleList: function(startTime, endTime, success, fail) {
            m3Ajax({
                type: 'POST',
                ajaxId: '676af216-7710-4643-a024-a54ad5a66708',
                url: m3.curServerInfo.url + '/mobile_portal/seeyon/rest/events/arrangetimes?&option.n_a_s=1',
                noNetworkTgt: '.no-net',
                showLoading: false,
                data: JSON.stringify({
                    "status": [0, 1],
                    "startTime": startTime,
                    "apps": [1, 2, 3, 4],
                    "endTime": endTime
                }),
                setCache: {
                    isShowNoNetWorkPage: false
                },
                success: success,
                error: fail || function() {}
            });
        },

        //获取页签
        getNavList: function(success, fail) {
            m3Ajax({
                type: 'GET',
                ajaxId: 'eb44f0b6-0090-4e99-8f83-5dddd266d5ae',
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/pending/classificationAll",
                noNetworkTgt: '.no-net',
                showLoading: false,
                setCache: {
                    key: 'm3-todo-bar',
                    isShowNoNetWorkPage: false
                },
                success: success,
                error: fail || function() {}
            });
        },

        //获取代办列表数据
        getTodoList: function(appId, isThird, param, pageNum, pageSize, isAiSort, success, fail) {
            if (isThird) {
                this.getThirdTodoList(appId, param, pageNum, pageSize, isAiSort, success, fail);
                return;
            }
            if ( isAiSort ) {
                param = JSON.parse(param);
                param.aiSort = 'true';
                param = JSON.stringify(param);
            }
            m3Ajax({
                type: 'POST',
                ajaxId: 'b04b2cba-13a7-45bb-a6eb-b83a1a2a745b',
                url: m3.curServerInfo.url + '/mobile_portal/seeyon/rest/m3/pending/portlet/' + pageNum + '/' + pageSize,
                noNetworkTgt: '.no-net',
                setCache: {
                    pageNum: pageNum,
                    isList: true,
                    key: 'm3-todo-list-' + appId,
                    isShowNoNetWorkPage: false
                },
                data: param,
                success: success,
                error: fail || function(e) {console.log(e)}
            });
        },

        //获取第三方代办数据
        getThirdTodoList: function(appId, param, pageNum, pageSize, isAiSort, success, fail) {
            m3Ajax({
                type: 'GET',
                ajaxId: 'b04b2cba-13a7-45bb-a6eb-b83a1a2a745b',
                url: m3.curServerInfo.url + '/mobile_portal/seeyon/rest/m3/pending/thirdPending?appId=' + appId + '&pageSize=' + pageSize + '&pageNo=' + pageNum,
                noNetworkTgt: '.no-net',
                setCache: {
                    pageNum: pageNum,
                    isList: true,
                    key: 'm3-todo-list-' + appId,
                    isShowNoNetWorkPage: false
                },
                success: success,
                error: fail || function(e) {console.log(e)}
            });
        }
    }
})();