/**
 * @description门户banner
 */
;(function() {
    var m3, m3Ajax, slider, banner, imgloader;
    define(function(require, exports, module) {
        require('zepto');
        m3 = require('m3');
        m3Ajax = require('ajax');
        imgloader = require('commons/js/cmp-img-loader.js');
        slider = require('components/m3-slider.js');
      // 为appcenter重写slider模板渲染
      slider.prototype.initTemplate = function() {
        this.moveEl = $('<div class="m3-slider-move"></div>');
        this.moveEl.append(this.template);
        // 只有一个slider-item 就不补充渲染
        if (this.moveEl.children().length <= 1) {
          this.el.append(this.moveEl);
          return
        }
        //补充节点
        var firstNode = this.moveEl.children().first().clone(),
          lastNode = this.moveEl.children().last().clone();
        this.moveEl.children().first().before(lastNode);
        this.moveEl.append(firstNode);
        this.el.append(this.moveEl);
        if ( !this.hasDot ) return;
        var str = '<div class="m3-slider-dot">';
        for ( var i = 0,obj;i < this.moveEl.children().length - 2;i++ ) {
          str += '<span></span>';
        }
        str += '</div>';
        this.el.append(str);
      };
        module.exports = banner;
        document.addEventListener('app-banner', function(e) {
            banner.init(e.data);
        });
    });

    banner = {
        
        //初始化
        init: function(domTgt) {
            var objThis = this;
            this.domTgt = domTgt;
            this.initEvent();
            this.initData(function(data) {
                if ( data.length == 0 ) {
                    $(domTgt).parent().addClass('display-none');
                    return;
                }
                $(domTgt).removeClass('display-none');
                $(domTgt).parent().removeClass('display-none');
                objThis.initSlider(objThis.showBanner(data));
            });
        },
        
        //初始化banner
        initData: function(callback) {
            var objThis = this,
                url = m3.curServerInfo.url + "/mobile_portal/seeyon/m3/bannerController.do?method=bannerList";
            m3Ajax({
                ajaxId: 'banner-a464c8d7-f652-4852-9d46-d8a9706daf20',
                method: "get",
                url: url,
                noNetworkTgt: '.no-network',
                setCache: {
                    isShowNoNetWorkPage: false
                },
                success: function(res) {
                    $('#app-banner').css('height', (window.innerWidth - 20)*24/71) + 'px';
                    callback(res.data);
                },
                error: function(err) {
                    $('.banner').addClass('display-none');
                }
            });
        },
        
        initEvent: function() {
            var objThis = this;
            $(this.domTgt).on('tap', 'img', function(e) {
                e.stopPropagation();
                var url = $(this).attr('data-url');
                if ( url == '' || url == 'undefined' ) {
                    return;
                }
                m3.loadApp({
                    appType: "integration_remote_url",
                    bundleName:"",
                    entry: url
                });
            });
            
            $(this.domTgt).on('tap', '.close-banner', function() {
                this.style.display = 'none';
                var warpNode = $(objThis.domTgt);
                if ($(objThis.domTgt).parents('.banner-warp')){
                    warpNode = $(objThis.domTgt).parents('.banner-warp');
                }
                warpNode.on('transitionend webkitTransitionEnd', function () {
                    warpNode.remove();
                })
                warpNode.css('height','0px');
            });
        },
        
        //数据绑定
        showBanner: function( data ) {
            var calcH = (window.innerWidth - 20)*24/71 + 'px';
            var str = '';
            for ( var i = 0;i < data.length;i++ ) {
                var url;
                if(data[i].imageUrl == "{default.url}"){
                    url = m3.curServerInfo.url +"/mobile_portal/seeyon/apps_res/m3/img/defaultBannerImage.png";
                }else{
                    url = m3.curServerInfo.url
                    + "/mobile_portal/seeyon/commonimage.do?method=showImage&id="
                    + data[i].imageUrl
                    + "&size=custom&w=710&h=240";
                }
                str += '<div class="app-banner-item-warp"><div class="app-banner-item-img" style="height:'+calcH+';" data-url="' + (data[i].bannerUrl || '') + '"><img src="" data-view-url="' + url+'"/></div></div>';
            }
return str;
},
//初始化slider
initSlider: function(str) {
    this.bannerSlider = slider(this.domTgt, {
        autoPlay: false,
        hasDot: true,
        template: str
    });
    var bannerImgs = $(this.domTgt).find('.app-banner-item-img>img');
    var iconList = [];
    for(var i = 0; i< bannerImgs.length;i++) {
        if($(bannerImgs[i]).attr('data-view-url')) {
            var itemId = 'banner-img-item' + i;
            bannerImgs[i].id = itemId;
            iconList.push({
                url: $(bannerImgs[i]).attr('data-view-url'),
                selector: '#' + itemId
            })
        }
    }
    if (iconList.length) {
        imgloader({
            config: iconList,
            defaultUrl: 'http://application.m3.cmp/v/img/banner-default.png',
            handleType: 'src'
        })
    }
    $(this.domTgt).css({overflow: 'visible'});
    $(this.domTgt).append('<span class="close-banner iconfont see-icon-m3-close-fill"></span>')
}
}
})();