/**
 * @description
 * @author ybjuejue
 * @createDate 2018/11/12/012
 */
;(function () {
    define(function(require, exports, module) {
        //加载模块
        var m3 = require('m3');
        cmp.ready(function() {
            var data = cmp.href.getParam() || '';
            var query = getParamByUrl(window.location.search);
            delete query.webviewid;
            delete query.cmphistoryuuid;
            // delete query.webviewid;
            var id = '';
            if (typeof data !== 'object' && data && !data.name) {
                id = data;
            } else {
                id = query.id;
            }
            if (id) {
                query.id = id;
            }
            if (data.name) {
                query.name = data.name;
            }
            query.isshunt = 'true';
            var url = getGoPersonUrl(id).split('?')[0] + '?' + paramsRealize(query);
            m3.state.go(url, data, m3.href.animated.none, false);
            // window.location.replace(url)
        });
        function getGoPersonUrl(uid) {
            /*获取跳转人员信息地址*/
            var isSelf = uid == m3.userInfo.getCurrentMember().id;
            // var isSelf = false;
            return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
        }
        function getParamByUrl (str) {
            try {
                var url = decodeURI(str || '');
                url = url.split('?')[1];
                url = url.replace(/=/g, '":"');
                url = url.replace(/&/g, '","');
                url = url.replace('?', '');
                url = url.replace(/#\S*/g, '');
                url = '{"' + url + '"}';
            } catch (e) {
                return {};
            }
            return JSON.parse(url);
        }
        function paramsRealize(obj) {
           var querys = obj || {};
           var queryList = [];
           for (var k in querys) {
               queryList.push(k + '=' + querys[k]);
           }
           return queryList.join('&');
        }
    });
})();
