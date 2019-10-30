/**
 * Created by 伟 on 2016/8/9.
 */

var change = {};
(function() {
    var m3Error,m3i18n,m3Ajax, getParam = {};
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
            getParam = cmp.href.getParam() || {};
            initPageUI();
            initEvent();
            initData();
        });
    }
    
    //初始化事件
    function initEvent() {
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
        //点击返回
        $("header").find(".cmp-action-back").on("tap", function() {
            cmp.href.back();
        });

        //选择公司
        $(".search-person").on("tap", "li", function(event) {
            event.stopPropagation();
            cmp.storage.save("companyId", $(this).attr("data-i"), true);
            cmp.storage.save("curCompanyId", $(this).attr("data-i"), true);
            getParam.companyid = $(this).attr("data-i");
            change.loadData();
            cmp.webViewListener.fire({
                type:"isOrgRefresh",  //此参数必须和webview1注册的事件名相同
                data:{
                    "isRefreshCompanyId":$(this).attr("data-i"),
                    "isCompanyId": $(this).attr("data-i")
                }, //webview2传给webview1的参数
                success:function(){
                    cmp.href.back();
                },
                error:function(res){
                    console.log(res);
                }
            });
        });
        change.select.on("tap", ".cmp-pull-right", function(event) {
            event.stopPropagation();
            change.companyList = change.childList[$(this).parent().attr("data-path")];
            change.loadData();
        })
    }
    //初始化页面
    function initPageUI() {


        change.select = $(".search-company");
        change.companyId = -1;

        //动态赋值滚动容器高度
        if (cmp.os.ios) {
            $(".search-company").height($(window).height() - $("header").height());
        } else {
            $(".search-company").height($(window).height() - $("header").height());
        }
    }
    //获取数据及渲染
    function initData() {
        //加载数据
        change.getData = (function() {
            var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/accounts/" + change.companyId;
            m3Ajax({
                url: url,
                type: "GET",
                success: function(res) {
                    cmp.dialog.loading(false);
                    if (res.code == 200 && res.data) {
                        change.companyList = res.data.firstAccounts;
                        change.childList = res.data.pathToAccounts
                        change.loadData();
                    }
                },
                error: function(res) {
                    cmp.dialog.loading(false);
                    if (res.code == -110) {
                        cmp.dialog.loading(false);
                        cmp.dialog.loading({
                            status: "nonetwork",
                            callback: function() {
                                window.location.reload();
                            }
                        });
                    } else if (res.code !== 401 && res.code !== 1001 && res.code !== 1002 && res.code !== 1003 && res.code !== 1004) {
                        cmp.dialog.loading(false);
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
        }());
        //渲染数据
        change.loadData = function() {
            var html = "";
            for (var i = 0; i < change.companyList.length; i++) {
                var companyItem = change.companyList[i];
                var rightIcon = (change.childList[companyItem.path] ? '<div class="cmp-pull-right"><span class="iconfont see-icon-m3-arrow-right"></span></div>' : "");
                var addActiveCLass = getParam.companyid == companyItem.id ? ' is-select-active' : '';
                html += '<li data-i="' + companyItem.id + '"class="cmp-table-view-cell'+addActiveCLass+'" data-path="' + companyItem.path + '"> ' + '<div class="cmp-pull-left">' + (companyItem.name) + '</div> ' + rightIcon + '</li>';
            }
            change.select.html(html);
        };
    }
}());
