/**
 * @description 门户入口
 */
;(function() {
    var infoPortal, error, m3, m3Ajax;
    define(function(require, exports, module) {
        //加载基础模块
        require('zepto');
        error = require('error');
        m3Ajax = require('ajax');
        m3 = require('m3');
        document.addEventListener('app-portal', function(e) {
            console.log('portal');
            infoPortal.init(e.data);
        });
    });
    //加载栏目模块
    infoPortal = {
        
        //页面初始化
        init: function(domTgt) {
            var objThis = this;
            this.domTgt = domTgt;
            //事件初始化
            this.initEvent();
            //初始化空间
            this.initData(function( res ) {
                $(objThis.domTgt).removeClass('display-none');
                $('.portal-move').html(objThis.showPortal(res.data));
            });
        },
        
        //事件初始化
        initEvent: function() {
            $('#portal-info').on('tap', '.portal-link', function(e) {
                e.stopPropagation();
                var portalId = $(this).attr('data-id');
                m3.state.go('http://portal.v5.cmp/v1.0.0/html/portalIndex.html?ParamHrefMark=true', {
                    portalId: portalId
                }, '', true);
            });
        },
        
        //初始化门户 Bar
        initData: function( callback ) {
            var url = m3.getCurServerInfo().url + '/mobile_portal/seeyon/rest/mobilePortal/portals/mobile',
                objThis = this;
            m3Ajax({
                ajaxId: m3.randomAjaxId(),
                type: 'GET',
                url: url,
                noNetworkTgt: '.grid-type',
                setCache: {
                    key: 'm3-portal',
                    isShowNoNetWorkPage: false
                },
                success: function(ret) {
                    console.log(ret);
                    callback(ret);
                },
                error: function(e) {
                }
            })
        },
        
        //数据绑定
        showPortal: function( data ) {
            var str = '',
                iconStyle,
                tip,
                name;
            for ( var i = 0;i < data.length;i++ ) {
                //图片url
                if ( data[i].iconUrl ) {
                    var url = m3.getCurServerInfo().url + '/mobile_portal/seeyon/fileUpload.do?method=showRTE&fileId=' + data[i].iconUrl + '&type=image';
                    iconStyle = 'style="background-image: url(' + url + ')"';
                    name = '';
                } else {
                    iconStyle = '';
                    name = data[i].portalName.substring(0, 2);
                }
                if ( data[i].portalName.length > 6 ) {
                    data[i].portalName = data[i].portalName.substring(0, 6);
                }
                str +=         '<a class="portal-link" data-id="' + data[i].portalId + '">\
                                    <span class="portal-icon" ' + iconStyle + '>' + name + '</span>\
                                    <span>' + data[i].portalName + '</span>\
                                </a>';
            }
            return str;
        }
    };
})();