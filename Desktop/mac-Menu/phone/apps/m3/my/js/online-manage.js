/**
 * @Author: lizhiheng <mars>
 * @Date:   2016-09-05 07:40:13
 * @Project: m3
 * @Last modified by:   mars
 * @Last modified time: 2016-09-06 10:31:34
 **/
;(function() {
    var m3, m3Ajax, m3Db, m3i18n;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3Db = require('sqliteDB');
        m3i18n = require('m3i18n');
        require('zepto');
        initPage();
    });
    
    function initPage() {
        var onlineManageModel = {};

        cmp.ready(function() {
            cmp.event.orientationChange(function(res){
                $(".cmp-scroll").height($(window).height() - $("header").height());
            });
            //安卓自带返回键
            document.addEventListener("backbutton", function() {
                cmp.href.back();
            });
            $(".cmp-scroll").height($(window).height() - $("header").height());
            $("#backBtn").on("tap", function() {
                cmp.href.back();
            });

            function getData() {
                cmp.dialog.loading(true);
                var onlineUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/onlinedevice";
                m3Ajax({
                    type: "get",
                    url: onlineUrl,
                    success: function onlinedeviceSuccess(onlinedeviceResult) {
                        cmp.dialog.loading(false);
                        if ("200" == onlinedeviceResult.code) {
                            var html = "";

                            $.each(onlinedeviceResult.data, function(i, value) {
                                var pcoriphone = "pcOnline";
                                var otherormine = "mine";
                                var text = "";
                                var displayText = "";
                                if (value.type !== "pc") {
                                    pcoriphone = "phoneOnline-fill";
                                    displayText = m3i18n[cmp.language].onlineM + value.type;
                                    text = fI18nData["my.m3.h5.local"];
                                } else {
                                    otherormine = "other";
                                    displayText = m3i18n[cmp.language].onlinePC + (value.ip == null ? "" : value.ip);
                                    text = m3i18n[cmp.language].offline;
                                }


                                html += '<li class="cmp-table-view-cell cmp-media list-top"><div class="cmp-pull-left iconfont see-icon-m3-' +
                                    pcoriphone + '"></div><p class="message_list_title"> <span></span><span>' +
                                    displayText + '</span></p><p class="cmp-ellipsis">' +
                                    value.onlineTime + '</p><p class="cmp-pull-right ' +
                                    otherormine + '">' + text + '</p></li>';
                            });


                            $(".online-device").html(html);
                            $(".other").on("tap", function() {
                                onlineManageModel.exitPC();
                            });
                            onlineManageModel.onlinerecord();
                        }
                    },
                    error: function(err) {
                        cmp.dialog.loading(false);
                        //提示弹框
                        cmp.notification.toast(err.message, "center");
                    }
                });
            }
            getData();

            onlineManageModel.exitPC = function exitPC() {
                var exitPCUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/exit/pc";
                m3Ajax({
                    type: "get",
                    url: exitPCUrl,
                    success: function(msg) {
                        if ("200" == msg.code) {
                            cmp.notification.toast(m3i18n[cmp.language].exitPCSuccess, "center");
                            getData();
                        }
                    },
                    error: function(err) {

                        cmp.notification.toast(err.message, "center");

                    }
                });
            };

            onlineManageModel.onlinerecord = function onlinerecord() {
                var onlinerecordUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/onlinerecord";
                m3Ajax({
                    type: "get",
                    url: onlinerecordUrl,
                    success: function onlinerecordSuccess(onlinerecordResult) {
                        if ("200" == onlinerecordResult.code) {
                            var html = "";

                            $.each(onlinerecordResult.data, function(i, value) {
                                html += '<li class="cmp-table-view-cell cmp-media list-top"><p class="message_list_title"> <span>' +
                                    value.deviceName + '</span><span>&nbsp;&nbsp;&nbsp;' + (value.type == "pc" ? "IP:" + value.ip : "") +
                                    '</span></p><p class="cmp-ellipsis">' +
                                    value.onlineTime + '</p></li>';
                            });


                            $(".near15-list").html(html);
                        }
                    },
                    error: function(err) {}
                });
            }
        });
    }
})();
