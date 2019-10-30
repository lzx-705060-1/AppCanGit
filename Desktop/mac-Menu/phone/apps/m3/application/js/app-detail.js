/**
 * @description 应用详情
 */
;(function() {
    var page, error, m3, m3Ajax, m3i18n;
    define(function(require, exports, module) {
        //加载基础模块
        require('zepto');
        m3Ajax = require('ajax');
        m3i18n = require("m3i18n");
        m3 = require('m3');
        cmp.ready(function() {
            //初始化
            page.init();
        });
    });
    //加载栏目模块
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
    }
    page = {
        
        //页面初始化
        init: function() {
            var objThis = this;
            var urlObj = getParamByUrl(window.location.search);
            urlObj.isOpen = urlObj.isOpen === 'true' || urlObj.isOpen === 'false' ? JSON.parse(urlObj.isOpen) : urlObj.isOpen;
            var sendData = cmp.href.getParam();
            console.log(urlObj);
            this.param = {
               id: urlObj.id ? urlObj.id : sendData.id,
               isOpen: typeof urlObj.isOpen === 'Boolean' || urlObj.isOpen ? urlObj.isOpen :sendData.isOpen
            }
            if ( !this.param.isOpen ) {
                $('.open').removeClass('display_none');
            } else {
                $('.open').removeClass('display_none').text(fI18nData["application.m3.h5.nopublish"]).addClass('grey');
            }
            //事件初始化
            this.initEvent();
            //初始化空间
            this.initData(function( ret ) {
                console.log(ret)
                var url = ret.iconH5;
                if ( url ) {
                    url = url.split('/seeyon/')[1];
                    url = m3.getCurServerInfo().url + '/mobile_portal/seeyon/' + url;
                }
                $('.company-name').text(ret.productCompany || ret.appProvider || '');
                $('.cip-app-name').text(ret.appName);
                $('.cip-description').text(ret.introduction);
                $('.header-icon').css('backgroundImage', 'url(' + url + ')');
                if ( !url ) {
                    $('.header-icon').addClass('icon-default see-icon-m3-third iconfont');
                }
                if ( ret.param0 ) {
                    ret.param0 = ret.param0.split('/seeyon/')[1];
                    ret.param0 = m3.getCurServerInfo().url + '/mobile_portal/seeyon/' + ret.param0;
                    $('.cip-description').append('<img class="img-des" src="' + ret.param0 + '">')
                }
            });
        },
        
        //事件初始化
        initEvent: function() {
            //安卓自带返回键
            document.addEventListener("backbutton", function() {
                cmp.href.back();
            });
            //左上角返回按钮
            $("#backBtn").on("tap", function() {
                cmp.href.back();
            });
            
            $('.open').on('tap', function() {
                var objThis = $(this);
                if ( objThis.hasClass('grey') ) {
                    return;
                }
                cmp.notification.confirm(m3i18n[cmp.language].openTip, function(_index, callback) {
                    if ( _index === 1 ) {
                        cmp.webViewListener.fire({ 
                            type: "m3OpenThirdApp"
                        });
                        objThis.text(fI18nData["application.m3.h5.nopublish"]).addClass('grey');
                    }
                }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok], -1, "");
            }) 
        },
        
        //初始化门户 Bar
        initData: function( callback ) {
            var url = m3.getCurServerInfo().url + '/mobile_portal/seeyon/rest/m3RegisterResource/getRegister/' + this.param.id,
                objThis = this;
            m3Ajax({
                type: 'GET',
                url: url,
                success: function(ret) {
                    callback(ret);
                },
                error: function(e) {
                    
                }
            })
        },
        
        render: function( data ) {
            
        }
    };
})();