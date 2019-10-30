/**
 * Created by 伟 on 2016/8/9.
 */
var searchPerson = {};
(function() {
    var m3Error, m3i18n, m3Ajax, posX;
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
            //cmp.dialog.loading(true);
            initPageUI();
            initEvent();
            initData();
            initDepart();
        });
    }
    
    //初始化事件
    function initEvent() {
        //搜索框事件
        $('.m3-search').on('tap', function() {
            alert('chuantou');
        });
        //点击左上角按钮 跳转到我的页面
        $("header").find(".cmp-action-back").on("tap", function() {
            var appId = "search";
            cmp.href.back();
        });

        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.close();
        });


        //跳转到切换企业
        $("ul.search-company").on("tap", "li", function() {
            if (searchPerson.canChange) {
                m3.state.go(m3.href.map.search_company, "", m3.href.animated.left, false);
            }
        });

        //跳转下一级部门
        $("ul.search-depart").on("tap", "li", function() {
            var departmentId = $(this).attr("data-i");
            cmp.storage.save("departmentId", departmentId);
            cmp.storage.save("searchPosition", $(".search-depart")[0].scrollTop, true);
            m3.state.go(m3.href.map.search_nextDept, "", m3.href.animated.left, false);
        });

    }
    
    function focusSearch() {
        $('.placeholder').addClass('display-none');
        $('.cmp-icon-search').css({
            '-webkit-transform': 'translate3d(-' + posX + 'px, 0, 0)'
        });
    }
    
    function blurSearch() {
        $('.placeholder').removeClass('display-none');
        $('.cmp-icon-search').removeAttr('style');
    }
    
    function getPosX() {
        return Math.floor($('.search-btn').find('.cmp-icon').offset().left + 15);
    }
    
    //初始化页面
    function initPageUI() {
        //给滚动容器设置高
        $(".search-depart").height($(window).height() - $("header").height() - $(".search-company").height() - 60);
        searchPerson.company = {};
        searchPerson.depart = [];
        searchPerson.myDepart = {};
        searchPerson.departmentsId = "";
        searchPerson.model = m3.curServerInfo.model;
        searchPerson.address = m3.curServerInfo.ip;
        searchPerson.port = m3.curServerInfo.port;
        searchPerson.canChange = true;

    }
    //获取部门id
    function initDepart() {
        //获取部门id
        searchPerson.departmentsId = m3.userInfo.getCurrentMember().accountId;
        searchPerson.getAccount();
        // searchPerson.getDeparts();
    }
    //获取数据并渲染
    function initData() {
        //获取数据
        searchPerson.getAccount = function() {
            if (cmp.storage.get("companyId", true)) {
                searchPerson.departmentsId = cmp.storage.get("companyId", true);
            } else {
                cmp.storage.save("companyId", searchPerson.departmentsId, true)
            }
            // console.log(searchPerson.departmentsId);
            var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/get/account/" + searchPerson.departmentsId;
            m3Ajax({
                url: url,
                type: "GET",
                success: function(res) {
                    cmp.dialog.loading(false);
                    if (res.code == 200 && res.data) {
                        //奇葩的逻辑，后台不给权限异常，只给你返回来一堆空，呵呵哒
                        if (!res.data.account.id || typeof res.data.account.id === 'undefined') {
                            cmp.notification.alert(fI18nData["search.m3.h5.authority"], function() {
                                window.history.back();
                            }, "", "<span>" + m3i18n['zh-CN']['ok'] + "</span>"); //"我知道了"
                        }
                        console.log(res.data.account);
                        searchPerson.company = res.data.account;
                        searchPerson.canChange = res.data.account.hasChildren;
                        searchPerson.loadAccount();
                        searchPerson.getDeparts();
                    }
                },
                error: function(res) {
                    cmp.dialog.loading(false);
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
        };

        searchPerson.getDeparts = function() {
            if (cmp.storage.get("companyId", true)) {
                searchPerson.departmentsId = cmp.storage.get("companyId", true);
            } else {
                cmp.storage.save("companyId", searchPerson.departmentsId, true)
            }
            var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/get/departments/" + searchPerson.departmentsId + "/0/1000";
            m3Ajax({
                url: url,
                type: "GET",
                success: function(res) {
                    if (res.code == 200 && res.data) {
                        searchPerson.depart = res.data.departments;
                        res.data.myDepartment && (searchPerson.myDepart = res.data.myDepartment);
                        searchPerson.loadData();
                    }
                },
                error: function(res) {
                    cmp.dialog.loading(false);
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
        };

        //渲染数据到页面
        var colorArray = ['#3eb0ff', '#FFD142', '#27E0B8', '#FF7FAA', '#837FFF', '#FF7F7F'];
        searchPerson.loadData = function() {
            var html = "";

            //var colorArray = ['#3eb0ff', '#FFD142', '#27E0B8', '#FF7FAA', '#837FFF', '#FF7F7F'];
            var myDepartTitle;
            var departTitle;
            if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(searchPerson.company.iconUrl)) {
                searchPerson.company.iconUrl += "&showType=small";
            }

            // console.log(searchPerson.myDepart.name);
            // console.log(searchPerson.company.id);
            // console.log(searchPerson.departmentsId);
            //我的部门
            if (searchPerson.myDepart.name && (searchPerson.company.id == searchPerson.departmentsId)) {
                // console.log(1);

                myDepartTitle = searchPerson.myDepart.name.charAt(0);
                html += '<li data-i="' + searchPerson.myDepart.id + '" class="cmp-table-view-cell m3-department"><div class="search-list-icon m3-header-department" style="background-color: ' + colorArray[0] + '">' + myDepartTitle + '</div><div class="cmp-pull-left m3-department">' + fI18nData["search.m3.h5.myDepart"] + '</div><div class="cmp-pull-right">' + searchPerson.myDepart.count + '<span class="iconfont see-icon-m3-arrow-right"></span></div> </li>';
            }
            //其他部门
            for (var i = 0; i < searchPerson.depart.length; i++) {
                departTitle = searchPerson.depart[i].name.charAt(0);
                html += '<li data-i="' + searchPerson.depart[i].id + '" class="cmp-table-view-cell m3-department"><div class="search-list-icon m3-header-department" style="background-color: ' + colorArray[(i + 1) % colorArray.length] + '">' + departTitle + '</div><div class="cmp-pull-left m3-department">' + (searchPerson.depart[i].name.escapeHTML()) + '</div><div class="cmp-pull-right">' + searchPerson.depart[i].count + '<span class="iconfont see-icon-m3-arrow-right"></span></div> </li>';
            }
            $(".search-depart").html(html);
            if (cmp.storage.get("searchPosition", true)) {
                $(".search-depart")[0].scrollTop = cmp.storage.get("searchPosition", true);
                cmp.storage.delete("searchPosition", true);
            }
            if (searchPerson.depart.length == 0) {
                cmp.dialog.loading(false);
                cmp.dialog.loading({
                    status: "nocontent",
                    text: m3i18n[cmp.language].noContent
                });
                $(".cmp-loading.cmp-loading-fixed").css("height", parseFloat($(".cmp-loading.cmp-loading-fixed").css("height")) - parseFloat($(".search-company").css("height")));
            }
        };
        searchPerson.loadAccount = function() {
            var companyName = searchPerson.company.name.escapeHTML();
            var companyHeaderSrc = cmp.origin +"/rest/orgMember/groupavatar?maxWidth=200&groupId="+searchPerson.company.id+"&groupName="+companyName;
            var companyHTML = "";
            var arrow = (searchPerson.canChange ? '<span class="iconfont see-icon-m3-arrow-right"></span>' : "");
            //公司名称
            companyHTML += '<li class="cmp-table-view-cell">' + '<img class="search-list-icon" src="'+companyHeaderSrc+'"> <div class="cmp-pull-left company_name">' + companyName + '</div> <div class="cmp-pull-right">' + arrow + '</div> </li>';
            $(".search-company").html(companyHTML);
            $(".cmp-loading.cmp-loading-fixed").css("height", parseFloat($(".cmp-loading.cmp-loading-fixed").css("height")) - parseFloat($(".search-company").css("height")));
        }
    }
}());