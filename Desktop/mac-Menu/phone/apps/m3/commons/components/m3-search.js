/**
 * author Clyne
 * description m3组织结构搜索组件
 * createDate 2017-11-13
 */
;(function() {
    var m3, m3Ajax, searchTemplate;
    //定义配置参数模块
    define(function(require, exports, module){
        require('zepto');
        m3 = require('m3');
        m3Ajax = require('ajax');
        searchTemplate = require('template/m3-search.js');
        module.exports = search;
    });
    function getGoPersonUrl(uid) {
        /*获取跳转人员信息地址*/
        var isSelf = uid == m3.userInfo.getCurrentMember().id;
        if (!arguments.length || !uid) return m3.href.map.my_personInfo;
        // var isSelf = false;
        return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
    }
    function search() {
        this.id = Math.floor(Math.random() * 10000000000);
        init(this.id);
        this.initEvent();
    }
    
    //原型链
    search.prototype = {
        
        //事件初始化
        initEvent: initEvent,
        //打开
        open: function() {
            $('#' + this.id).removeClass('display-none');
        },
        
        //关闭
        close: function() {
            $('#' + this.id).addClass('display-none');
        }
    }
    
    /* 私有方法 */
    //初始化页面
    function init(id) {
        $('body').append(searchTemplate(id));
    }
    
    //事件初始化
    function initEvent() {
        var timer,
            objThis = this,
            objNode = $('#' + this.id);
        //搜索框事件
        $('#m3-search').on('keyup', function() {
            clearTimeout(timer);
            var val = $(this).val();
            timer = setTimeout(function() {
                initData(val);
            }, 200);
        });
        
        //获取焦点
        objNode.find('input').focus(function() {
            inputFocus(objNode);
        }).blur(function() {
            inputBlur(objNode);
        });
        
        //取消
        objNode.find('a').on('tap', function() {
            objThis.close();
            objNode.find('input').val('');
            inputBlur(objNode);
            $('.search-content').find('ul').html('');
        });
        
        //穿透
        objNode.find('ul').on('tap', 'li', function() {
            var userId = $(this).attr('data-id');
            m3.state.go(
                getGoPersonUrl(userId) + "?page=search-next&id=" + userId + "&from=m3",
                "",
                m3.href.animated.none, true
            );
        });
    }
    
    //数据初始化
    function initData(value) {
        m3.checkNetwork(function(state) {
            if (state) {
                m3Ajax({
                    url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/addressbook/searchMember",
                    type: 'POST',
                    data: JSON.stringify({
                        accId: m3.userInfo.getCurrentMember().accountId || '',
                        key: value || '',
                        type: 'Name'
                    }),
                    success: function(res) {
                        var str = showList(res.children);
                        $('.search-content').find('ul').html(str);
                    },

                    error: function(e) {
                        console.log(e);
                    }
                })
            } else {
                //原生获取
                //原生获取
                //原生获取
                //原生获取
            }
        });
    }
    
    //数据绑定
    function showList(data) {
        var str = '';
//        http://10.5.1.242:8080/mobile_portal/seeyon/rest/orgMember/avatar/3130957269385826007?maxWidth=200
        for (var i = 0;i < data.length;i++) {
            str += '<li class="m3-mlist flex-h flex-cross-center" data-id="' + data[i].i + '">\
                        <span class="mlist-head" style="background-image:url(' + (m3.curServerInfo.url + '/mobile_portal' + data[i].img + '?maxWidth=200') + ');"></span>\
                        <span class="flex-1">\
                            <i>' + data[i].n + '</i>\
                            <i>' + data[i].pN + '</i>\
                        </span>\
                    </li>';
        }
        return str;
    }
    
    //获取位移量
    function getDisX(node) {
        return node.find('.cmp-icon').offset().left + 15;
    }
    
    //获取焦点操作
    function inputFocus(node) {
        if (node.find('input').val() === '') {
            var tranX = getDisX(node);
            node.find('.cmp-icon').css({
                '-webkit-transform': 'translate3d(-' + tranX + 'px, 0, 0)'
            });
            node.find('.placeholder').addClass('display-none');
        }
    }
    
    //移除焦点操作
    function inputBlur(node) {
        if (node.find('input').val() === '') {
            node.find('.cmp-icon').removeAttr('style');
            node.find('.placeholder').removeClass('display-none');
        }
    }
})();