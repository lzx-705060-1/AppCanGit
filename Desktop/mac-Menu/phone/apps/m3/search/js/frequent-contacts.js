/**
 * Created by 伟 on 2016/12/14.
 */

var contacts = {};
(function() {

    var m3Error,m3i18n,m3Ajax;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        initPage();
    });
    function initPage(){
        cmp.ready(function() {
            initPageUI();
            initEvent();
            initData();
        });
    }
    function getGoPersonUrl(uid) {
        /*获取跳转人员信息地址*/
        var isSelf = uid == m3.userInfo.getCurrentMember().id;
        if (!arguments.length || !uid) return m3.href.map.my_personInfo;
        // var isSelf = false;
        return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
    }
    //初始化事件
    function initEvent() {
        //点击返回
        $("header").find(".cmp-action-back").on("tap", function() {
            cmp.href.back();
        });
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
        //点击人员
        $(".search-depart").on("tap", "li", function() {
            var id = $(this).attr("data-i");
            m3.checkLevelScope(id, function() {
                m3.state.go(getGoPersonUrl(id)+ "?page=frequent-contacts&id=" + id + "&from=m3&enableChat=true");
            });
        });
    }
    //页面初始化
    function initPageUI() {
        $(".cmp-table-view.search-depart").height($(window).height() - $("header").height())
    }
    //获取数据
    function initData() {
        //获取数据
        contacts.getData = (function() {
            var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/frequentContacts/" + m3.userInfo.getId();
            m3Ajax({
                url: url,
                type: "GET",
                success: function(res) {
                    console.log(res);
                    if (res.code == 200 && res.data) {
                        if (res.data.length != 0) {
                            contacts.loadData(res.data);
                        } else {
                            cmp.dialog.loading({
                                status: "nocontent",
                                text: m3i18n[cmp.language].noContent
                            });
                        }
                    }
                },
                error: function(res) {
                    if (res.code == -110) {
                        cmp.dialog.loading({
                            status: "nonetwork",
                            callback: function() {
                                window.location.reload();
                            }
                        });
                    } else if (res.code !== 401 && res.code !== 1001 && res.code !== 1002 && res.code !== 1003 && res.code !== 1004) {
                        cmp.dialog.loading({
                            status: "systembusy",
                            text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
                            callback: function() {
                                window.location.reload();
                            }
                        });

                    }
                }
            });
        })();
        //渲染数据
        contacts.loadData = function(data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {

                // html += '<li data-i="' + data[i].id + '" class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left" style="background-image: url('+m3.curServerInfo.url + '/mobile_portal' + data[i].iconUrl + ');background-size: cover;background-position: 50% 50%"></div> <p class="message_list_title">' + (data[i].name.length > 10 ? (data[i].name.slice(0, 10) + "...") : data[i].name) + '</p> <p class="cmp-ellipsis">' + (data[i].postName || '').escapeHTML() + '</p> </li>';
                html += '<li data-i="' + data[i].id + '" class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left" style="background-image: url('+m3.curServerInfo.url + '/mobile_portal/seeyon/rest/orgMember/avatar/'+ data[i].id + '?maxWidth=200);background-size: cover;background-position: 50% 50%"></div> <p class="message_list_title">' + (data[i].name.length > 10 ? (data[i].name.slice(0, 10) + "...") : data[i].name) + '</p> <p class="cmp-ellipsis">' + (data[i].postName || '').escapeHTML() + '</p> </li>';

            }

            $(".search-depart").html(html);
        };
    }
}());
