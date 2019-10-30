/**
 * description: 我的模块——个人信息
 * author: hbh
 * createDate: 2017-01-05
 */
(function() {
    var parent = "";
    var id = "",
        name = '';
    var memberData = {};
    var imgFilePath = "";
    var coordinationId = ""; //获取新建自由协同id，用来穿透
    var currentId = "";
    var userNameStr = '';
    var faceRegex = /url\(\"[\'\"]?([^\'\"]*)[\'\")]?/i;
    var m3Error, m3i18n, m3Ajax, m3DB, nativeApi, m3Scroll;
    var penetratedMark=true;
    var url = 'http://commons.m3.cmp/v/imgs/header.png';
    var key = 'aspersonelItemsKey';
    var keyPepolDatas = [],
        faceUrl = '',
        headerUrl = '';
    var clickMark = true,
        //滚动条对象
        scrollObj;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        require('commons');
        m3Scroll = require('scroll');
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        m3DB = require("sqliteDB");
        nativeApi = require("native");
        initPage();
    });
    function getGoPersonUrl(uid) {
        /*获取跳转人员信息地址*/
        var isSelf = uid == m3.userInfo.getCurrentMember().id;
        if (!arguments.length || !uid) return m3.href.map.my_personInfo;
        // var isSelf = false;
        return isSelf?m3.href.map.my_person_detail:m3.href.map.my_other_person_detail;
    }
    //入口函数
    function initPage() {
        cmp.ready(function() {
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
                initStyle();
            });
            //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
            if ( cmp.os.ios ) {
                document.addEventListener("resume",function(){
                    initStyle();
                },false);
            }

            //左上角返回按钮
            backBtn();
            var data = cmp.href.getParam();
            console.log("getParam:")
            console.log(data);
            console.log("window.href:")
            console.log(window.location.href);
            if (data && !data.name) {
                id = data;
            } else {
                name = data ? data.name : '';
                parent = getParam("page");
                id = getParam("id");
            }
            currentId = m3.userInfo.getId();
            $('.name').text(name);
            nativeApi.getNetworkState(function( ret ) {
                var state = (ret.serverStatus === 'connect'),
                    networkState = state;
                console.log('当前网络为' + ret.serverStatus);
                initStyle();
                initEvent(networkState);
            })
        });
    }
    
    //样式初始化
    function initStyle() {
        //人员头像
        var personnelHead = "";
        if (id && id != currentId) { //从通讯录进入人员卡片
            getCache();   //获取当前key的缓存
            personnelHead = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + id + '?maxWidth=100';
        } else { //当前登录人员自己的人员卡片当前登录人员自己的人员卡片
            personnelHead = m3.userInfo.getCurrentMember().iconUrl;
            $('#officeNumber').addClass('myperson');
            $('#phone').addClass('myperson');
            $('#email').addClass('myperson');
        }
        headerUrl = personnelHead;
        
        $(".person_head").css({
            "background-image": "url('" + (personnelHead =="" ? url : personnelHead) + "')",
            "background-size": "cover",
            "background-position": "center center"
        });
        var imgObj = new Image(),
            defaultUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + id + '?maxWidth=100';
        imgObj.src = defaultUrl;
        imgObj.onload = function() {
            if (!m3.userInfo.getCurrentMember().iconUrl){
                 $(".person_head").css({
                    "background-image": "url('" + defaultUrl + "')",
                    "background-size": "cover",
                    "background-position": "center center"
                });
            }
            cmp.h2Base64({
                l: 100,
                imgUrl: defaultUrl,
                success: function(base64) {
                    faceUrl = base64
                },
                error: function(e) {
                    faceUrl = '';
                    console.log(e);
                    console.log('人员头像base64装换失败');
                }
            });
        }

        //防止ios下滚动时出现黑色背景
        $(".cmp-content").css({ "background-color": "transparent" });

        //从通讯录模块进入个人信息页，左上角文字为“返回”
        if (parent == "all-search" || (parent == "search-next") ||
            (parent == "todo-search") || (parent == "search-search") ||
            (parent == "message-detail") || (parent == "frequent-contacts") ||
            (parent == "project-team-project")) {
            $("#my").addClass("display_none");
            $("#return").removeClass("display_none");
        } else {
            //从我的模块进入个人信息页，左上角文字为“我的”
            $("#my").removeClass("display_none");
            $("#return").addClass("display_none");
        }
    }
    
    function onlineGetMember( id, isShowError, success, error ) {
        var otherPersonUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/contacts/showPeopleCard/" + id,
            cache = {};
        if ( !isShowError ) {
            cache = { 
                isShowNoNetWorkPage: false 
            }
        }
        console.log('在线获取')
        m3Ajax({
            url: otherPersonUrl,
            setCache: cache,
            type: "GET",
            success: function( ret ) {
                if ( !ret.data.isShow ) {
                    cmp.notification.toast(fI18nData['search.m3.h5.authority1'], "center");
                    return;
                }
                success(ret)
            },
            error: error
        });
    }
    
    function getInfo(id, networkState, success, fail) {
        //判断网络状态
        if ( networkState ) {
            onlineGetMember(id, false, success, function(err) {
                //在线获取失败
                console.log('在线获取人员卡片数据失败，开始加载离线人员卡片');
                //获取离线人员开票
                nativeApi.getMemberInfo({
                    id: id,
                    accountId: cmp.storage.get('curCompanyId') || m3.userInfo.getCurrentMember().accountId
                }, success, function(e) {
                    console.log(e);
                    console.log('离线人员卡片数据获取失败');
                    //异常处理
                    m3Error.notify(err, 'ajax', fail);
                });
            });
        } else {
            if ((cmp.storage.get('curCompanyId',true) !== null) && cmp.storage.get('curCompanyId',true) !== m3.userInfo.getCurrentMember().accountId) {
                console.log('非本单位人员');
                onlineGetMember(id, true, success, fail);
            } else {
                console.log('离线获取人员卡片数据');
                nativeApi.getMemberInfo({
                    id: id,
                    accountId: cmp.storage.get('curCompanyId',true) || m3.userInfo.getCurrentMember().accountId
                }, success, function(e) {
                    console.log(e);
                    console.log('离线人员卡片数据获取失败,开始切换在线访问');
                    onlineGetMember(id, true, success, function(e) {
                        console.log('在线人员获取失败');
                        fail(e);
                    })
                });
            }
        }
    }

    //事件初始化
    function initEvent(networkState) {
        $('#userDefined').on('touchstart', '.user-defined', function(e) {e.stopPropagation()});
        if (id !== m3.userInfo.getCurrentMember().id) {
            getInfo(id, networkState, function(res) {
                console.log(res);
                if ("200" == res.code) {
                    if(!res.data)return;
                    //登录名
                    var userName = m3.userInfo.getCurrentMember().name;
                    //单位简称
                    memberData.accShortName = m3.userInfo.getCurrentMember().accShortName;
                    personInfo(res.data);
                    $(".scroll").removeClass("display_none");

                    //发协同权限控制
                    authorityOfCoordination();
                    memberData.name = res.data.name;
                    cmp.storage.save("memberData", JSON.stringify(memberData), true);

                    var name = $(".name").text(); //人员姓名
                    var officeNumber = $("#officeNumber").text().replace(/[^0-9]+/g, ''); //工作电话
                    var phoneNumber = $("#phone").text().replace(/[^0-9]+/g, ''); //手机号
                    var email = $("#email").text(); //邮箱
                    var face = headerUrl; //人员头像
                    cmp.h2Base64({
                        l: 100,
                        imgUrl: face,
                        success: function(base64) {
                            faceUrl = base64
                        },
                        error: function(e) {
                            faceUrl = '';
                            console.log(e);
                        }
                    });

                    if (id != currentId) {

                        //显示快捷操作按钮（5个icon）
                        $(".person_icon").removeClass("display_none");
                        /* 点击头像下5个icon操作*/
                        if(clickMark){
                            //发消息
                            $("#talk").on("tap", function() {
                                if ($(this).hasClass('disable'))
                                    return
                                cmp.chat.exec("version",{//获取致信版本
                                    success: function(result){
                                        if(result.version == "3.0"){
                                            cmp.chat.exec("chatToOther",{
                                                success: function(res){
                                                },
                                                error: function(err){
                                                    $('#talk').addClass('disable');
                                                },
                                                params:{
                                                    "memberid":id,
                                                    "membername":userNameStr
                                                }
                                            })
                                        } else {
                                            var options = {
                                                type: "single",
                                                fromname: memberData.name,
                                                fromId: id,
                                                toname: userName,
                                                toId: currentId
                                            };
                                            var returnUrl = getGoPersonUrl(id);
                                            m3.penetrated({
                                                appId: "61",
                                                type: "myPerson",
                                                returnUrl: returnUrl,
                                                sendParms: options,
                                                returnParms: null,
                                                openNewPage: 1
                                            })
                                        }
                                    },
                                    error: function(err) {
                                        var options = {
                                            type: "single",
                                            fromname: memberData.name,
                                            fromId: id,
                                            toname: userName,
                                            toId: currentId
                                        };
                                        var returnUrl = getGoPersonUrl(id);
                                        m3.penetrated({
                                            appId: "61",
                                            type: "myPerson",
                                            returnUrl: returnUrl,
                                            sendParms: options,
                                            returnParms: null,
                                            openNewPage: 1
                                        })
                                        console.log(err)
                                    }
                                });
                            });
                            //打电话
                            $("#tel").on("tap", function() {
                                if ($(this).hasClass('disable')) return;
                                if (officeNumber && phoneNumber && (phoneNumber != "******")) { //工作电话、手机号都有
                                    var items1 = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].callOfficePhone //拨打工作电话
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].callPhone //拨打手机
                                    }, {
                                        key: "3",
                                        name: m3i18n[cmp.language].SaveToAddressBook //保存到手机通讯录
                                    }];

                                    cmp.dialog.actionSheet(items1, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.tel.call({
                                                    phoneNum: officeNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "2") {
                                                cmp.tel.call({
                                                    phoneNum: phoneNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "3") {
                                                cmp.tel.syncToLocal({
                                                    success: function() {},
                                                    error: function() {},
                                                    name: userNameStr,
                                                    mobilePhone: phoneNumber != "******" ? phoneNumber : "",
                                                    officePhone: officeNumber,
                                                    email: email,
                                                    imageData: faceUrl
                                                })
                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});

                                } else if (officeNumber) { //只有工作电话
                                    var items2 = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].callOfficePhone //拨打工作电话
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].SaveToAddressBook //保存到手机通讯录
                                    }];

                                    cmp.dialog.actionSheet(items2, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.tel.call({
                                                    phoneNum: officeNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "2") {
                                                cmp.tel.syncToLocal({
                                                    success: function() {},
                                                    error: function() {},
                                                    name: userNameStr,
                                                    mobilePhone: phoneNumber != "******" ? phoneNumber : "",
                                                    officePhone: officeNumber,
                                                    email: email,
                                                    imageData: faceUrl
                                                })
                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});

                                } else if (phoneNumber) { //只有手机号
                                    var items3 = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].callPhone //拨打手机
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].SaveToAddressBook //保存到手机通讯录
                                    }];

                                    cmp.dialog.actionSheet(items3, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.tel.call({
                                                    phoneNum: phoneNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "2") {
                                                cmp.tel.syncToLocal({
                                                    success: function() {},
                                                    error: function() {},
                                                    name: userNameStr,
                                                    mobilePhone: phoneNumber != "******" ? phoneNumber : "",
                                                    officePhone: officeNumber,
                                                    email: email,
                                                    imageData: faceUrl
                                                })
                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});

                                }
                            });
                            //发短信
                            $("#sms").on("tap", function() {
                                if ($(this).hasClass('disable')) return;
                                var items = [{
                                    key: "1",
                                    name: m3i18n[cmp.language].sendMessage
                                }];
                                cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                        if (item.key == "1") {
                                            cmp.tel.sms({
                                                phoneNum: phoneNumber // 手机号码
                                            }, function(success) {}, function(error) {
                                                //没有权限，弹出提示
                                                cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                            });
                                        }
                                    },
                                    //点击取消的回调函数
                                    function(e) {});
                            });
                            //发邮件
                            $("#mail").on("tap", function() {
                                if ($(this).hasClass('disable')) return;
                                var items = [{
                                    key: "1",
                                    name: m3i18n[cmp.language].sendEmail
                                }];
                                cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                        if (item.key == "1") {
                                            cmp.mail.send({
                                                receiver: email,
                                                bodystr: '',
                                                attname: '',
                                                attdata: '',
                                                success: null,
                                                error: null
                                            })
                                        }
                                    },
                                    //点击取消的回调函数
                                    function(e) {});
                            });
                            /*点击列表中工作电话、手机、邮箱操作*/
                            //拨打工作电话
                            $(".officenumber").on("tap", function() {
                                if (officeNumber) {
                                    var items = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].callOfficePhone //拨打工作电话
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].Copy
                                    }, {
                                        key: "3",
                                        name: m3i18n[cmp.language].SaveToAddressBook //保存到手机通讯录
                                    }];

                                    cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.tel.call({
                                                    phoneNum: officeNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "2") {
                                                cmp.pasteboard.setString({ value: officeNumber });
                                                cmp.notification.toast(m3i18n[cmp.language].CopySuccess, "center");

                                            } else if (item.key == "3") {
                                                cmp.tel.syncToLocal({
                                                    success: function() {},
                                                    error: function() {},
                                                    name: userNameStr,
                                                    mobilePhone: phoneNumber != "******" ? phoneNumber : "",
                                                    officePhone: officeNumber,
                                                    email: email,
                                                    imageData: faceUrl
                                                })
                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});
                                }
                            });
                            //拨打手机
                            $(".phone").on("tap", function() {
                                if (phoneNumber && (phoneNumber != "******")) {
                                    var items = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].callPhone //拨打手机
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].Copy //复制
                                    }, {
                                        key: "3",
                                        name: m3i18n[cmp.language].SaveToAddressBook //保存到手机通讯录
                                    }];

                                    cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.tel.call({
                                                    phoneNum: phoneNumber
                                                }, function(success) {}, function(error) {
                                                    //没有权限，弹出提示
                                                    cmp.notification.toast(m3i18n[cmp.language].NoPermissions, "center");
                                                });
                                            } else if (item.key == "2") {
                                                //复制手机号到剪贴板
                                                cmp.pasteboard.setString({ value: phoneNumber });
                                                cmp.notification.toast(m3i18n[cmp.language].CopySuccess, "center");

                                            } else if (item.key == "3") {
                                                cmp.tel.syncToLocal({
                                                    success: function() {},
                                                    error: function() {},
                                                    name: userNameStr,
                                                    mobilePhone: phoneNumber,
                                                    officePhone: officeNumber,
                                                    email: email,
                                                    imageData: faceUrl
                                                })
                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});
                                }
                            });
                            //发邮件
                            $(".email").on("tap", function() {
                                if (email) {
                                    var items = [{
                                        key: "1",
                                        name: m3i18n[cmp.language].sendEmail
                                    }, {
                                        key: "2",
                                        name: m3i18n[cmp.language].Copy
                                    }];
                                    cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                            if (item.key == "1") {
                                                cmp.mail.send({
                                                    receiver: email,
                                                    bodystr: '',
                                                    attname: '',
                                                    attdata: '',
                                                    success: null,
                                                    error: null
                                                })
                                            } else if (item.key == "2") {
                                                //复制手机号到剪贴板
                                                cmp.pasteboard.setString({ value: email });
                                                cmp.notification.toast(m3i18n[cmp.language].CopySuccess, "center");

                                            }
                                        },
                                        //点击取消的回调函数
                                        function(e) {});
                                }
                            });
                            clickMark  =false;
                        }
                    } else {
                        
                    }
                    if(res.data.isVjoin!=="1"){
                        userDefined(res.data.customFields);
                    }
                    initRp(res);
                    watermark(userName, memberData.accShortName, getDate());
                    // initScroll();
                }
            }, function(res) {
                
            });
        } else {
            $(".modify_icon").removeClass("display_none");
            var url = m3.curServerInfo.url + "/mobile_portal/api/contacts2/member/" + currentId;
            getInfo(currentId, networkState, function(res) {
                if (res.code == 200) {
                    //获取个人信息
                    var data = m3.userInfo.getCurrentMember();
                    cmp.storage.delete("memberData", true);
                    personInfo(data);
                    //自定义字段
                    if(data.isVjoin!=="1"){
                        userDefined(res.data.customFields);
                    }
                    $(".scroll").removeClass("display_none");

                    //点击头像 可编辑
                    $(".modify_icon").on("tap", function() {
                        modifyAvatar();
                    });
                    initRp(res);
                    watermark(data.name, data.accShortName, getDate());
                    // initScroll();
                }
            },function(res) {

            })
        }
//        InitConfluence(); //初始化汇报人信息
        ClickFocusFun();  //监听关注按钮的点击事件
        //页面跳转
        pageJump();

    }
    
    function initRp( msg ) {
        var rp = msg.data.rp;
        if(rp){
            var rpId = msg.data.rpId;
            $('#vjoinConf').show();
            //汇报人 
            memberData.Confluence = rp;
            $("#vjoinConfluence").text(memberData.Confluence);
            //点击人员进入人员信息
            $("#vjoinConfluence").on("tap", "", function() {
                if(!rp || !rpId)return;
                var url = getGoPersonUrl(rpId) + "?page=search-next&id=" + rpId + "&from=m3&enableChat=true";
                // cmp.href.next(url, {rpNameId:id} , m3.href.animated.none);
                // yic bug OA-142931，穿透时不需要去判断权限，人员卡片页面会统一处理
                m3.state.go(url, rpId, m3.href.animated.none, true);
            });
        }

        //新增关注功能
        var userId = m3.userInfo.getId();
        //初始化是否显示关注按钮，如果当前信息是自己的话
        if(userId != id ){
            $('.person_focusBtn').show();
            if(msg.data.isConcernedMember){  //已关注
                $('#FocusBtn').addClass('active');
                $('.person_focusIcon').removeClass('m3-icon-nofocus').addClass('m3-icon-focus');
                $('.person_focusText').text(fI18nData["my.m3.h5.nofocus"]);
            }else{   //未关注
                $('#FocusBtn').removeClass('active');
                $('.person_focusIcon').removeClass('m3-icon-focus').addClass('m3-icon-nofocus');
                $('.person_focusText').text(fI18nData["my.m3.h5.focus"]); 
            }
        }
    }

    //获取当前key的缓存 //关注人员
    function getCache(){
        m3Cache.getCache(key,function(res){
            if(res.data && res.data.length == 0)return;
            keyPepolDatas = (res instanceof Array)?res:res.data;
        },function(res){
            console.log(res);
        });
       
    }
    //关注按钮点击事件
    function ClickFocusFun(){
        var Saveurl = m3.curServerInfo.url + '/mobile_portal/seeyon/rest/m3/contacts/concern/saveConcernMember?option.n_a_s=1';
        var Cancelurl = m3.curServerInfo.url + '/mobile_portal/seeyon/rest/m3/contacts/concern/cancelConcernMember/' + id +'?option.n_a_s=1';
       
        $('#FocusBtn').click(function(){
            var self = $(this);
            if($(this).hasClass('active')){ //已关注
                m3Ajax({
                    type:"GET",
                    url:Cancelurl,
                    setCache: { 
                        isShowNoNetWorkPage: false 
                    },
                    success:function(){
                        console.log('取消关注成功');
                        self.removeClass('active');
                        $('.person_focusIcon').addClass('m3-icon-nofocus').removeClass('m3-icon-focus');
                        $('.person_focusText').text(fI18nData["my.m3.h5.focus"]);
                        var newArray = keyPepolDatas;
                        for(var i=0,len=keyPepolDatas.length;i<len;i++){
                            if(keyPepolDatas[i].id == id ){
                                newArray.splice(i,1);
                                break;
                            }
                        }
                        m3Cache.setCache(key,newArray);
                    },
                    error:function(res){
                        console.log('取消关注失败');
                    }
                }); 
            }else{   //未关注
                m3Ajax({
                    type:"POST",
                    url:Saveurl,
                    setCache: { 
                        isShowNoNetWorkPage: false 
                    },
                    data:JSON.stringify([{id:id}]),
                    success:function(data){
                        self.addClass('active');
                        $('.person_focusIcon').addClass('m3-icon-focus').removeClass('m3-icon-nofocus');
                        $('.person_focusText').text(fI18nData["my.m3.h5.nofocus"]);
                    },
                    error:function(res){
                        console.log('关注失败');
                    }
                }); 
            }
            
        });
    }

    //水印效果
    function watermark(userName, accShortName, date) {
        /* {
            水印内容：
                  "materMarkNameEnable" : "false",    姓名
                  "materMarkDeptEnable" : "true",     单位
                  "materMarkTimeEnable" : "false",    时间
            是否设置水印：
                  "materMarkEnable" : "true"
            }*/
        var info = m3.userInfo.getCurrentMember();
        if (info.materMarkEnable == "true") {
            var name = "";
            var dept = "";
            var time = "";
            if (info.materMarkNameEnable == "true") {
                name = userName;
            }
            if (info.materMarkDeptEnable == "true") {
                dept = accShortName;
            }
            if (info.materMarkTimeEnable == "true") {
                time = date;
            }
            var watermarkUrl = cmp.watermark({
                userName: name,
                department: dept,
                date: time
            }).toBase64URL();

            $("ul").css({
                "background-image": "url(" + watermarkUrl + ")",
                "background-repeat": "repeat",
                "background-position": "0% 0%",
                "background-size": "200px 100px"
            });
            $(".cmp-table-view").find(".cmp-table-view-cell").css({ "background-color": "transparent" });
        }
    }

    //跳转到二维码页面
    function pageJump() {
        $("#code").on("tap", function() {
            m3.state.go(m3.href.map.my_personDecoder, memberData, m3.href.animated.left, true);
        });
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            if (!cmp.href.getParam() && getParam("from") && getParam("from") == "uc") {
                cmp.closeWebView();
            } else {
                cmp.href.back();
                // setTimeout(function() {
                //     cmp.href.back();
                // }, 320);
            }
        });
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
    }

    //获取url参数
    function getParam(paramName) {
        var paramValue = "";
        var isFound = false;
        var arrSource = "";
        if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
            arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&");
            var i = 0;
            while (i < arrSource.length && !isFound) {
                if (arrSource[i].indexOf("=") > 0) {
                    if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                        paramValue = arrSource[i].split("=")[1];
                        isFound = true;
                    }
                }
                i++;
            }
        }
        return paramValue;
    }

    //卡片内容超出，容器可以滚动，滚动时，头像和姓名隐藏




    //人员信息
    function personInfo(info) {
        if(!info)return;
        userNameStr = info.name;
        //头像
        memberData.icon = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + info.id; //info.iconUrl;
        //姓名
        if (!info.name) {
//            alert("姓名为空，当前人员id:" + id);
        } else {
            memberData.name = (info.name.length > 15 ? (info.name.slice(0, 15) + "...") : info.name);
        }
        //部门
        if (!info.departmentName) {
//            alert("部门为空，当前人员id:" + id);
        } else {
            memberData.depart = (info.departmentName.length > 10 ? (info.departmentName.slice(0, 10) + "...") : info.departmentName);
        }
        //主岗
        if (!info.postName) {
            memberData.mainpost = "";
        } else {
            memberData.mainpost = (info.postName.length > 10 ? (info.postName.slice(0, 10) + "...") : info.postName);
        }
        //职务级别
        if (!info.levelName) {
            memberData.job = "";
        } else {
            memberData.job = (info.levelName.length > 10 ? (info.levelName.slice(0, 10) + "...") : info.levelName);
        }
        //工作电话
        memberData.officeNumber = info.officeNumber || "";
        //手机
        memberData.phone = info.tel || "";
        //邮箱
        memberData.email = info.email || "";
        //是否可修改头像
        memberData.revise = "";
        
        if(info.isVjoin === "1"){
            //vjoin机构
            if (!info.vjoinOrgName) {
                alert("vjoin机构为空，当前人员id:" + id);
            } else {
                memberData.vjoinOrgName = (info.vjoinOrgName.length > 10 ? (info.vjoinOrgName.slice(0, 10) + "...") : info.vjoinOrgName);
            }
            //vjoin单位
            if (!info.vjoinAccName) {
                alert("vjoin单位为空，当前人员id:" + id);
            } else {
                memberData.vjoinAccName = (info.vjoinAccName.length > 10 ? (info.vjoinAccName.slice(0, 10) + "...") : info.vjoinAccName);
            }
            //vjoin机构
            $("#vjoinOrg").text(memberData.vjoinOrgName);
            //vjoin单位
            $("#vjoinAcc").text(memberData.vjoinAccName);

            //vjoin有的不显示
            $("#vjoinOrgLi").show();
            $("#vjoinAccLi").show();

            $("#deptLi").hide();
            $("#jobLi").hide();
            $("#code").hide();
            $("#officeNumberLi").hide();
        }
        //姓名
        $(".name").text(memberData.name);
        //部门
        $("#department").text(memberData.depart);
        //主岗
        $("#mainpost").text(memberData.mainpost);
        
        //工作电话
        if (!memberData.officeNumber) {
            $("#tel").addClass("disable");
        } else {
            $("#tel").removeClass("disable");
            $("#officeNumber").text(memberData.officeNumber);
        }
        //邮箱
        if (!memberData.email) {
            $("#mail").addClass("disable");
        } else {
            $("#mail").removeClass("disable");
            $("#email").text(memberData.email);
        }
        cmp.chat.exec("version",{//获取致信版本
            success: function(result){

            },
            error: function(err) {
                $('#talk').addClass('disable');
                console.log(err);
            }
        });
        //职务级别
        if (memberData.job && memberData.job.indexOf('*') != -1) { //后台配置为隐藏了,则显示****
            $("#job").css("line-height", "1.4rem");
        }
        $("#job").text(memberData.job);
        //手机
        if (memberData.phone && memberData.phone.indexOf('*') != -1) { //后台配置为隐藏了,则显示****
            $("#phone").text(memberData.phone).css("line-height", "1.4rem");
            $("#sms").addClass("disable");
        } else {
            if (!memberData.phone) {
                $("#sms").addClass("disable");
            } else {
                $("#phone").text(memberData.phone);
                if ($("#tel").hasClass("disable")) {
                    $("#tel").removeClass("disable");
                }
            }
        }
    }

    //修改头像
    function getPicSuccess(res) {
        imgFilePath = res.files[0].filepath;
        if ((res.files[0].type == "jpeg" || res.files[0].type == "png" || res.files[0].type == "gif" || res.files[0].type == "jpg") && parseInt(res.files[0].fileSize) < 5242880) {
            cmp.dialog.loading(true);
            cmp.att.upload({ //附件上传接口
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/attachment?token=&firstSave=true&applicationCategory=13&option.n_a_s=1",
                fileList: [{
                    filepath: imgFilePath //单个文件路径
                }],
                progress: function(result) {},
                success: function(uploadRes) {
                    var fileUrl = {
                        "fileId": JSON.parse(uploadRes.response).atts[0].fileUrl
                    };
                    var date = JSON.parse(uploadRes.response).atts[0].createdate;
                    var uploadPicUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/modifyportrait";
                    m3Ajax({
                        url: uploadPicUrl,
                        m3CatchError: false,
                        data: JSON.stringify(fileUrl),
                        setCache: { 
                            isShowNoNetWorkPage: false 
                        },
                        success: function(msg) {
                            cmp.dialog.loading(false);
                            if ("200" == msg.code) {
                                var modifyHead = m3.userInfo.getCurrentMember().iconUrl + "1"; //防止缓存,每次修改头像改变url
                                m3.userInfo.setPic(modifyHead);
                                $(".person_head").css({
                                    "background-image": "url('" + (modifyHead) + "')",
                                    "background-size": "cover",
                                    "background-position": "center center"
                                });
                                // $(".blur_bg").css({
                                //     "background-image": "url('" + modifyHead + "')",
                                //     "background-repeat": "no-repeat",
                                //     "background-position": "center"
                                // });
                                cmp.webViewListener.fire({ type: "com.seeyon.m3.my.changeIcon", data: [1] });
                            }
                        },
                        error: function(msg) {
                            cmp.dialog.loading(false);
                        }
                    });
                },
                error: function(error) {
                    cmp.dialog.loading(false);
                    cmp.notification.toast(m3i18n[cmp.language].uploadPicFailed, "center");
                }
            });
        } else {
            cmp.notification.toast(m3i18n[cmp.language].uploadPicTip, "center");
        }
    }
    //原对象直接倒序
    // function sortObj(data) {
    //     var arrayKey = [],arrayValue=[];
    //     for(var index in data){ 
    //         arrayKey.push(index);
    //         arrayValue.push(data[index]);
    //     };
    //     arrayKey.reverse();
    //     arrayValue.reverse();
    //     var obj={};
    //     for(var i=0;i<arrayKey.length;i++){
    //         obj[arrayKey[i]]=arrayValue[i];
    //     }
    //     return obj;
    // }
    //自定义字段
    function userDefined(data) {
        data = data == undefined ? [] : data;
        // data = sortObj(data);
        if(data.length == 0){
            $('#userDefined').addClass('display_none');
            return;
        };
        $('#userDefined').removeClass('display_none');
        if (data && (data !== "null")) {
            var html = "";
            var value,i=0,length = data.length;
            if(!length){
                data = [data];
                length = data.length;
            }
            for(;i<length;i++){
                var oneData = data[i];
                for (var k in oneData) {
                    if (oneData[k] == "null") {
                        oneData[k] = "";
                    }
                    value = oneData[k];
                    if (k.length > 10) {
                        k = k.slice(0, 10) + "...";
                    }
                    if(typeof value == "function"){
                        continue;
                    }
                    value.length > 40 && (value = value.slice(0, 40) + "...");
                    html += '<li class="cmp-table-view-cell flex-v">' +
                        '<div class="cmp-pull-left left_word ellipsis_p">' + k.escapeHTML() + '</div>' +
                        '<div class="cmp-pull-left right_word flex-1 user-defined"><span>' + value.escapeHTML() + '</span></div>' +
                        '</li>';

                }
            }

            $("#userDefined").append(html);
        }
    }

    //通讯录水印 时间
    function getDate() {
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        var dateStr = year + "-" + month + "-" + day;
        return dateStr
    }

    //获取协同权限，有选项则显示发协同icon，没有则不显示
    function authorityOfCoordination() {
        var key="newcoll";
        nativeApi.getAuthorityByKey(key,
        function(res){    //有权限
            if(res == "true"){
                $("#coordination").removeClass("disable"); 
                //发协同
                if(penetratedMark ){
                    $('#coordination').on('tap',function(){
                        m3.penetrated({
                            appId: "1" , //res.appId
                            type: "shortcut",
                            returnUrl: getGoPersonUrl(id),
                            sendParms:  {openFrom: "newCollaboration",members: id }, //gotoParam
                            returnParms: null,
                            openNewPage: 1
                        });
                    });
                    penetratedMark = false;
                }
                // penetratedMark = true;
            }
        });
    }

    function formatTel(str) {
        var word = str.match(/[\u4e00-\u9fa5a-zA-Z]/g);
        if (word) {
            word = word[0];
        } else {
            return str;
        }
        return str.split(word)[0];
    }
    
    function initScroll() {
        scrollObj = m3Scroll({
            el: '.cmp-content',
            type: 'scrollY',
            criticalValue: 100,
            criticalUpCb: function() {
                console.log('up')
                $(".person_info").addClass("display_none");
                scrollObj.refresh();
            },
            criticalDownCb: function() {
                console.log('down')
                $(".person_info").removeClass("display_none");
                scrollObj.refresh();
            }
        })
    }

    function modifyAvatar() {
        m3Ajax({
            type: "GET",
            m3CatchError: false,
            url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/common/avatarConfig",
            setCache: { 
                isShowNoNetWorkPage: false 
            },
            success: function(msg) {
                if (msg.code == "200") {
                    if (msg.data.allowUpdateAvatar == "enable") {
                        //是否允许员工修改头像
                        var items = [{
                            key: "1",
                            name: m3i18n[cmp.language].photograph
                        }, {
                            key: "2",
                            name: m3i18n[cmp.language].selectPic
                        }];

                        cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function(item) {
                                if (item.key == "1") {
                                    cmp.camera.getPictures({
                                        sourceType: 1,
                                        quality: 100,
                                        destinationType: 1,
                                        edit:true,
                                        success: function(res) {
                                            getPicSuccess(res)
                                        },
                                        error: function(res) {
                                            if(res.code == "56002"){
                                                cmp.notification.alert(fI18nData['search.m3.h5.authority1']);
                                            }
                                        }
                                    });
                                } else if (item.key == "2") {
                                    cmp.camera.getPictures({
                                        sourceType: 2,
                                        quality: 100,
                                        pictureNum: 1,
                                        destinationType: 1,
                                        edit:true,
                                        success: function(res) {
                                            getPicSuccess(res)
                                        },
                                        error: function(res) {
                                            if(res.code == "56002"){
                                                cmp.notification.alert(fI18nData['search.m3.h5.authority1']);
                                            }
                                        }
                                    });
                                }
                            },
                            //点击取消的回调函数
                            function(e) {});
                    } else {
                        if (msg.data.allowUpdateAvatar == "disable") {
                            //是否允许员工修改头像
                            cmp.notification.toast(m3i18n[cmp.language].defaultAvatarTip, "center");
                        }
                    }
                }
            },
            error: function(msg) {}
        });
    }
})();