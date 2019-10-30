/**
 * @Author Clyne
 * @description 应用跳转的中转站
 * @createDate 2017-11-23
 */
;(function() {
    var m3, nativeApi, m3Ajax, pageObj, sortData, m3i18n, param;
    define(function(require, exports, module) {
        //加载基础模块
        require('zepto');
        m3 = require('m3');
        nativeApi = require('native');
        m3i18n = require('m3i18n');
        window.onload = function() {
            window.cap4Loaded = true;
            pageObj.init();
        };
    });

    pageObj = {
        init: function() {
            window.CMPREADYMARK = true;
            var param = this.getParamByUrl();
            console.log(param);
            m3.penetrated({
                appId: '66',
                type: "workbench",
                returnUrl: '',
                sendParms: param,
                returnParms: null,
                openNewPage: 0
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
        }
    }
})();
