/**
 * Created by 伟 on 2016/8/9.
 */
var searchPerson = {};
(function() {
    var m3Error, m3i18n, m3Ajax, posX, m3Search, nativeApi, isOutMember,userData,lineDownState = true,
        //面包屑
        recordArr = [],parent = "",getParam="",currentId="",
        //当前选中的companyId
        curCompanyId,networkState="";
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        urlParams = require("tools").getParamByUrl(window.location.search);
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        nativeApi = require('native');
        initPage();
    });
    function initPageBaseInfo() {
        m3Search = '';
        posX = undefined;
        isOutMember = undefined;
        recordArr = [];
        parent = undefined;
        userData = m3.userInfo.getCurrentMember() || {};
        getParam = (urlParams.ParamHrefMark || (urlParams.isfromnative == "true") || (urlParams.fromApp == "xiaozhiSpeechInput"));
        currentId = userData.id;
        curCompanyId = cmp.storage.get('curCompanyId', true) || m3.userInfo.getCurrentMember().accountId;
        networkState="";
        nativeApi.getConfigInfo(function( ret ) {
            var config = {};
            try {config = JSON.parse(ret);} catch (e) {}
            config.internal = true;
            // console.log('返回外编人员状态为:' + config.internal);
            isOutMember = !config.internal;
        });
    }
    function partialRefreshPage() {
        initPageBaseInfo();
        initPageUI();
        cmp.listView('#indexListView').refresh();
    }
    function initSourceWithBack() {
        //从其他模块进入通讯录-顶部导航显示返回
        if (getParam) {
            $('body').removeClass('from-app');
            $('body').addClass('from-page');
        } else {
            //从底部导航进入通讯录
            $('body').removeClass('from-page');
            $('body').addClass('from-app');

        }
    }
    function leaveThePageAction () {
        var appId = "search";
        cmp.storage.delete('curCompanyId', true);
        cmp.storage.delete("isMycurCompanyId");
        cmp.storage.delete("isMyorgHistory");
        cmp.storage.delete("isMydepartmentId_custom");
    }
    function leaveThePageEvent(fromTop) {
        cmp.backbutton();
        if (fromTop) {
            cmp.backbutton.push(cmp.closeM3App);
        } else {
            if(urlParams.fromApp && urlParams.fromApp == "xiaozhiSpeechInput"){
                document.addEventListener("backbutton",function(){
                    cmp.href.back();
                },false);
            }
            //点击左上角按钮 跳转到我的页面
            $("header").find(".cmp-action-back").on("tap", function() {
                leaveThePageAction();
                cmp.href.back();
            });
            cmp.backbutton.push(function () {
                leaveThePageAction();
                cmp.href.back();
            });
        }
    }
    function initPage(){
        cmp.ready(function() {
            cmp.webViewListener.addEvent("isOrgRefresh",function(e){
                if(e.isRefreshCompanyId){
                    cmp.storage.save("companyId", e.isCompanyId, true);
                    cmp.storage.save("curCompanyId", e.isRefreshCompanyId, true);
                    partialRefreshPage();
                }
            });
            cmp.listView('#indexListView');
            partialRefreshPage();
            initEvent();
            initData();
            setTimeout(function () {
                bindDidAppearEvent();
            }, 2500);
            offlineDownStateAndTip();
        });
    }
    function getNetWork(callback, failCallback){
        nativeApi.getNetworkState(function( ret ) {
            var state = (ret.serverStatus === 'connect');
            if(state){
                callback && callback();
            }else {
                typeof failCallback == 'function' && failCallback();
                return false;
            }
        });
    };
    //初始化事件
    function initEvent() {
        //获取融云权限
        cmp.chat.exec("version",{//获取致信版本
            success: function(result){
                //群聊
                var disableClick = false;
                $('#group').removeClass("display_none");
                if(result.version == "3.0"){
                    $('#group').on("tap",function(){
                        if (!disableClick) {
                            disableClick = true;
                            setTimeout(function () {
                                disableClick = false;
                            }, 1000);
                            var rongyun = "http://uc.v5.cmp/v/html/ucGroupListPage.html?cmp_orientation=auto";
                            // var defualt = "http://uc.v5.cmp/v/html/ucGroupList.html?cmp_orientation=auto";
                            m3.state.go(rongyun, null, m3.href.animated.left, true);
                        }

                    });
                } else if(result.version == "2.0") {
                    $('#group').on("tap",function(){
                        if (!disableClick) {
                            disableClick = true;
                            setTimeout(function () {
                                disableClick = false;
                            }, 1000);
                            // var rongyun = "http://uc.v5.cmp/v/html/ucGroupListPage.html?cmp_orientation=auto";
                            var defualt = "http://uc.v5.cmp/v/html/ucGroupList.html?cmp_orientation=auto";
                            m3.state.go(defualt, null, m3.href.animated.left, true);
                        }
                    });
                }else{
                    $('#group').addClass("display_none");
                }
            },
            error: function(err) {
                $('#group').addClass("display_none");
            }
        });
        //搜索框事件
        $('.m3-search').on('tap', function() {
            setTimeout(function() {
                nativeApi.showMemberSearch();
            }, 350);
        });
        leaveThePageEvent(!getParam);
        //跳转到切换企业
        $("ul.search-company").on("tap", "li", function() {
            if ( isOutMember ) {
                return
            }
            if (searchPerson.canChange) {
                m3.state.go(m3.href.map.search_company, {companyid: $(this).attr('data-company-id')}, m3.href.animated.left, true);
            }
        });

        //跳转下一级部门
        $("ul.search-depart").on("tap", "li", function() {
            var departmentId = $(this).attr("data-i");
            recordArr = [{
                departmentId: curCompanyId,
                departmentName: $('.search-company').find('.company_name').text()
            },{
                departmentId: departmentId,
                departmentName: $(this).find('.m3-department').text()
            }];
            cmp.storage.save('curCompanyId', curCompanyId);
            cmp.storage.save('orgHistory', JSON.stringify(recordArr));
            cmp.storage.save("departmentId", departmentId);
            cmp.storage.save("searchPosition", $(".search-depart")[0].scrollTop, true);

            var goTime = new Date().getTime();
            cmp.storage.save('orgHistorySetTime'+goTime, JSON.stringify(recordArr));
            m3.state.go(m3.href.map.search_nextDept+'&companyId='+curCompanyId+'&departmentId='+departmentId+'&openpagetime='+goTime, "", m3.href.animated.left, true);
        });

        //我的部门
        $('#myDepartment').on("tap",function(){
            SaveMyDepartments();
        });
        //关注人员
        $('#aspersonel').on("tap",function(){
            m3.state.go(m3.href.map.address_aspersonnel, null, m3.href.animated.left, true);
        });

        //项目组
        $('#projectTeam').on("tap",function(){
            m3.state.go(m3.href.map.project_team, null, m3.href.animated.left, true);
        });

    }
    // 在线时缓存当前部门层级，用于跳转我的部门
    function SaveMyDepartments(){
        // var id = cmp.storage.get("isMydepartmentId_custom");
        var id = searchPerson.myDepart && searchPerson.myDepart.id ? searchPerson.myDepart.id : cmp.storage.get("isMydepartmentId_custom");
        cmp.storage.save('isMydepartmentId_custom', id);
        nativeApi.getNetworkState(function( ret ) {
            var state = (ret.serverStatus === 'connect');
            if(state){
                nativeApi.getDepartmentMemberSortType(function(res){
                    var resSort = res =="" ?"department":"member" ;
                    var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/department/children/" + id + "/1/20/"+resSort+"";
                    var cache = {
                        isShowNoNetWorkPage: false
                    };
                    m3Ajax({
                        url: url,
                        type: "GET",
                        setCache: cache,
                        success: function(res) {
                            if (res.code == 200 && res.data) {
                                var childrenAccountId = res.data.members.length ? res.data.members[0].accountId : m3.userInfo.getCurrentMember().accountId;
                                var childrenDepartments = res.data.parents;
                                cmp.storage.save('curCompanyId', childrenAccountId);
                                cmp.storage.save('orgHistory', JSON.stringify(childrenDepartments));
                                cmp.storage.save('m3_from_myDepartmentInfo', JSON.stringify({
                                    data: res,
                                    id: childrenAccountId
                                }));
                                m3.state.go(m3.href.map.search_nextDept, null, m3.href.animated.left, true);
                            }
                        },
                        error: function(res) {
                            cmp.dialog.loading(false);
                            //离线获取部门层级
                            nativeApi.getMemberInfo({
                                id: currentId,
                                accountId: cmp.storage.get('curCompanyId',true) || m3.userInfo.getCurrentMember().accountId
                            }, function(res){
                                cmp.storage.save('curCompanyId', res.data.accountId);
                                cmp.storage.save('orgHistory', JSON.stringify(res.data.parentDepts));
                                m3.state.go(m3.href.map.search_nextDept, null, m3.href.animated.left, true);
                            }, function(e) {
                                m3.state.go(m3.href.map.search_nextDept, null, m3.href.animated.left, true);
                                console.log(e);
                            });
                        }
                    });
                },function(res){
                    console.log(res);
                });

            }else{
                //离线获取部门层级
                nativeApi.getMemberInfo({
                    id: currentId,
                    accountId: cmp.storage.get('curCompanyId',true) || m3.userInfo.getCurrentMember().accountId
                }, function(res){
                    var parents = res.data.parentDepts;
                    for(var i=0;i<parents.length;i++){
                        if(parents[i].internal == "0"){ //外单位 拼接“编外”
                            parents[i].departmentName = '('+fI18nData["search.m3.h5.departInternal"]+')'+parents[i].departmentName;
                        }
                    }
                    cmp.storage.save('curCompanyId', res.data.accountId);
                    cmp.storage.save('orgHistory', JSON.stringify(res.data.parentDepts));
                    m3.state.go(m3.href.map.search_nextDept, null, m3.href.animated.left, true);
                }, function(e) {
                    m3.state.go(m3.href.map.search_nextDept, null, m3.href.animated.left, true);
                    console.log(e);
                });
            }
        });
    }
    function initDepartListView (obool) {
        cmp.listView('#indexListView').refresh();
        cmp.dialog.loading(false);
        cmp.dialog.loading({
            status: "global",
            calcHClass: 'scroll_up_zone',
        });
        if (!obool) {
            getOfflineAccountInfoFn();
        } else {
            getOnlineAccountInfoFn();
        }
    }
    /*通讯录新逻辑*/
    // 条件页面onshow 、didAppear 事件
    function bindDidAppearEvent() {
        document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
            shouldReloadPage();
        });
        //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
        if ( cmp.os.ios ) {
            document.addEventListener("resume",function(){
                shouldReloadPage()
            },false);
        }
        function shouldReloadPage() {
            if($('.search-person .search-depart')) {
                var list = $('.search-person .search-depart li');
                if (!list || !list.length) {
                    partialRefreshPage();
                }
            }
        }
    }
    //获取离线下载状态----
    function offlineDownStateAndTip() {
        var tipText = {
            loading:fI18nData["search.m3.h5.downloadingAddress"],
            success:fI18nData["search.m3.h5.downloadedAddress"],
            fail:fI18nData["search.m3.h5.downloadFailAddress"]
        };
        function getDownloadState () {
            nativeApi.getDownloadState(function (res) {
                console.log("离线通讯录下载状态："+res);
                if(res == 0) {
                    setTipsStatus('success')
                } else if (res == 1) {
                    setTipsStatus('loading')
                } else if (res == 3) {
                    setTipsStatus('fail')
                } else{
                    setTipsStatus('success')
                }
            }, function () {
                setTipsStatus('fail')
            });
        }
        /**
         * @function name setTipsStatus
         * @description
         * @author ybjuejue
         * @createDate 2018/11/15/015
         * @params status
         */
        getDownloadState();
        function setTipsStatus(status, errorClick) {
            if ($('.cmp-state-dialog-toast')) {
                $('.cmp-state-dialog-toast').remove();
            }
            if (status != 'success') {
                var stateDiv = document.createElement('div');
                stateDiv.className = "cmp-state-dialog-toast";
                var spanIcon = '<span class="state-icon iconfont see-icon-prompt-line"></span><div id="stateDiv" class="stateDiv">'+tipText[status]+'</div>';
                stateDiv.innerHTML = spanIcon;
                document.body.appendChild(stateDiv);
                if (status == 'fail') {
                    $('#stateDiv').on("tap",function(){
                        if (typeof errorClick == 'function') {
                            errorClick();
                        } else{
                            nativeApi.retryDownload(function(){
                                getDownloadState();
                            },function(res){
                                console.log(res);//重试失败
                            });
                        }
                    });
                }
            }
        };
    }
    /*这是网络错误显示区 h代办使用时本门区*/
    function severNotConnectPage(h) {
        cmp.dialog.loading(false);
        cmp.dialog.loading({
            // dom: '.cmp-control-content.cmp-active',
            status: "systembusy",
            calcHClass: 'scroll_up_zone',
            text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
            callback: function() {
                partialRefreshPage();
            }
        });
        if (h) {
            var systembusyZone = $(".cmp-loading.cmp-loading-fixed.systembusy");
            systembusyZone.height(Math.floor(systembusyZone.height() - 74) + 'px')
        }
    }
    function getOnlineDepInfoFn() {
        console.log('单位人员在线数据开始');
        var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/get/departments/" + curCompanyId + "/0/1000";
        m3Ajax({
            url: url,
            type: "GET",
            // setCache: cache,
            success: function(res) {
                console.log(res);
                if (res.code == 200 && res.data) {
                    console.log('单位人员在线数据完成');
                    res.data.myDepartment = res.data.myDepartment || {};
                    res.data.departments = res.data.departments || [];
                    searchPerson.depart = res.data.departments;
                    res.data.myDepartment && (searchPerson.myDepart = (res.data.myDepartment||{}));
                    cmp.dialog.loading(false);
                    searchPerson.loadData();
                } else {
                    console.log('单位人员在线数据失败转离线');
                    getOfflineDepInfoFn();
                }
            },
            error: function(res) {
                console.log(res);
                console.log('单位人员在线数据失败转离线');
                getOfflineDepInfoFn();
            }
        });
    }
    function getOfflineDepInfoFn() {
        if (curCompanyId == m3.userInfo.getCurrentMember().accountId) {
            console.log('单位人员离线数据开始');
            nativeApi.getDepartmentList(curCompanyId, function(res) {
                console.log('单位人员离线数据完成');
                console.log(res);
                res.data.departments = res.data.departments || [];
                res.data.myDepartment = res.data.myDepartment || {};
                var parents = res.data.departments;
                if(parents && parents.length>0){
                    for(var i=0;i<parents.length;i++){
                        if(parents[i].internal == "0"){ //外单位 拼接“编外”
                            parents[i].name = '('+fI18nData["search.m3.h5.departInternal"]+')'+parents[i].name;
                        }
                    }
                }
                searchPerson.depart = res.data.departments;
                res.data.myDepartment && (searchPerson.myDepart = res.data.myDepartment);
                searchPerson.loadData();
            }, function(e) {
                console.log('离线获取部门列表失败');
                severNotConnectPage(true)
            })
        } else {
            console.log('非本单位无本门离线数据');
            severNotConnectPage(true)
        }

    }
    function getOnlineAccountInfoFn() {
        console.log('公司，单位在线模式开始');
        var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/get/account/" + curCompanyId;
        m3Ajax({
            url: url,
            type: "GET",
            // setCache: cache,
            success: function(res) {
                if (res.code == 200 && res.data) {
                    console.log('公司，单位在线模式完成');
                    //奇葩的逻辑，后台不给权限异常，只给你返回来一堆空，呵呵哒
                    if (!res.data.account.id || typeof res.data.account.id === 'undefined') {
                        cmp.notification.alert(fI18nData["search.m3.h5.authority"], function() {
                            cmp.href.back();
                        }, "", "<span>" + m3i18n['zh-CN']['ok'] + "</span>"); //"我知道了"
                        return;
                    }
                    searchPerson.company = res.data.account || {};
                    searchPerson.canChange = res.data.account.hasChildren;
                    searchPerson.loadAccount();
                    getOnlineDepInfoFn();
                } else {
                    console.log('公司，单位在线模式失败转离线');
                    getOfflineAccountInfoFn();
                }
            },
            error: function(res) {
                console.log('公司，单位在线模式失败转离线');
                cmp.dialog.loading(false);
                getOfflineAccountInfoFn();
            }
        });
    }
    function getOfflineAccountInfoFn() {
        if (curCompanyId == m3.userInfo.getCurrentMember().accountId) {
            nativeApi.getAccountInfo(curCompanyId, function(res) {
                console.log('公司，本单位，离线模式');
                console.log(res);
                searchPerson.company = res.data.account || {};
                console.log(searchPerson.company);
                searchPerson.canChange = true;
                searchPerson.loadAccount();
                getOfflineDepInfoFn();
                // getAccount(true, 'showArrow');
            }, function(e) {
                console.log('公司，本单位，离线获取失败');
                severNotConnectPage();
            });
        }
        else {
            console.log('非本单位无单位离线数据');
            severNotConnectPage();
        }

    }
    /*通讯录新逻辑---end*/

    //初始化页面
    function initPageUI() {
        searchPerson.company = {};
        searchPerson.depart = [];
        searchPerson.myDepart = {};
        searchPerson.model = m3.curServerInfo.model;
        searchPerson.address = m3.curServerInfo.ip;
        searchPerson.port = m3.curServerInfo.port;
        searchPerson.canChange = true;
        initSourceWithBack();
        getNetWork(function(){
            initDepartListView(true);
        }, function () {
            initDepartListView(false);
        });
    }
    function initData() {
        searchPerson.loadAccount = function() {
            if ( !m3.userInfo.getCurrentMember().internal ) {
                searchPerson.canChange = false;
            }
            var companyName = (searchPerson.company && searchPerson.company.name || '').escapeHTML();
            var companyId = (searchPerson.company && searchPerson.company.id) ? searchPerson.company.id :"";
            var companyHeaderSrc = cmp.origin +"/rest/orgMember/groupavatar?maxWidth=200&groupId="+ companyId +"&groupName="+companyName;
            var companyHTML = "";
            var arrow = (searchPerson.canChange ? '<span class="iconfont see-icon-change-company company-icon-right"></span>' : "");
            //是否为外遍人员
            if ( isOutMember ) {
                arrow = '';
            }
            //公司名称
            companyHTML += '<li class="cmp-table-view-cell" data-company-id="'+companyId+'"><div class="cmp-pull-left company_name flex-1">' + companyName + '</div> <div class="cmp-pull-right">' + arrow + '</div> </li>';
            $(".search-company").html(companyHTML);
        }
        searchPerson.loadData = function() {
            cmp.dialog.loading(false);
            //渲染数据到页面
            var colorArray = ['#3eb0ff', '#FFD142', '#27E0B8', '#FF7FAA', '#837FFF', '#FF7F7F'];
            var html = "";
            var myDepartTitle;
            var departTitle, loadIconUrl = searchPerson && searchPerson.company && searchPerson.company.iconUrl ? searchPerson.company.iconUrl : '';
            if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(loadIconUrl)) {
                searchPerson.company && (searchPerson.company.iconUrl += "&showType=small");
            }
            //我的部门
            if (searchPerson.myDepart.name && (searchPerson.company.id == curCompanyId)) {
                cmp.storage.save("isMydepartmentId_custom",searchPerson.myDepart.id);
            }
            //其他部门
            for (var i = 0; i < searchPerson.depart.length; i++) {
                var iconHead = 'm3-department';
                var munber = '';
                var count = searchPerson.depart[i].count;
                if( searchPerson.depart[i].internal === '1' ){ //内单位
                    munber = count?count:"";
                }
                if ( searchPerson.depart[i].internal === '0' ) { //外单位
                    iconHead = 'm3-department m3-department-out';
                    munber = count?count:"";
                }
                departTitle = searchPerson.depart[i].name.charAt(0);
                html += '<li id="' + searchPerson.depart[i].id + '" data-i="' + searchPerson.depart[i].id + '" class="cmp-table-view-cell ' + iconHead + '"><div class="search-list-icon m3-header-department" style="background-color: ' + colorArray[(i + 1) % colorArray.length] + '">' + departTitle + '</div><div class="cmp-pull-left m3-department flex-1">' + (searchPerson.depart[i].name.escapeHTML()) + '</div><div class="cmp-pull-right"><span class="' + searchPerson.depart[i].id + '">' + munber + '</span><span class="iconfont see-icon-m3-arrow-right"></span></div> </li>';

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
                    text: m3i18n[cmp.language].noContent,
                    calcHClass: 'scroll_up_zone'
                });
                var nocontentNode = $(".cmp-loading.cmp-loading-fixed.nocontent")
                nocontentNode.css("height", Math.floor(nocontentNode.height() - 74)+'px');
            }
            cmp.listView('#indexListView');
        };
    }

}());