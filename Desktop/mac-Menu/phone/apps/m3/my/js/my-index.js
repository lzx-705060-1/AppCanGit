/**
 * description: 我的模块——首页
 * author: Clyne
 * createDate: 2017-09-27
 */
;(function() {
    var m3, m3Erro,nativeApi,CollectionData,documentData,headerLoaded, headerUrl,hrefMark,settingParam={};
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        require('commons');
        nativeApi = require("native");
        m3Error = require('error');
        require('zepto');
        initPage();
    });
    //页面跳转参数
    var parent = "";
    //人员全部信息
    var data = "";
    var getUrlParam="";
    //入口函数
    function initPage() {
        cmp.ready(function() {
            m3.closeGestureAndIndex();
            
            parent = cmp.href.getParam();
            getUrlParam = GetRequest();
            hrefMark = getUrlParam.ParamHrefMark;
            // if (hrefMark || getUrlParam.isfromnative == "true") {
            //     $('body').addClass('isOther');
            //     $('body').addClass('showHeader');//显示返回按钮
            // }
            data = m3.userInfo.getCurrentMember();
            getAppData();//获取应用数据
            initStyle(true);
            initEvent();
        });
    }

    function GetRequest() {  
        var url = window.location.search; //获取url中"?"符后的字串  
        var theRequest = new Object();  
        if (url.indexOf("?") != -1) {  
           var str = url.substr(1);  
           var strs = str.split("&");  
           for(var i = 0; i < strs.length; i ++) {  
              theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
           }  
        }  
        return theRequest;  
     }  

    // 添加didAppear 事件
    function bindDidAppearEvent() {
        // document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear", function(event) {
        //     headerUrl = '';
        //     initStyle(true);
        // });

    }
    //样式初始化
    function initStyle( firstLoaded ) {
        // 人员部门信息
        var userStation = data.postName;
        if(userStation){
            $('.station').text(userStation);
        }
        //人员头像
        var personnelHead = m3.userInfo.getCurrentMember().iconUrl;
        if(personnelHead){
            if ( !firstLoaded && !headerLoaded ) {
                personnelHead += '&' + new Date().getTime();
            }


            var xhr = new XMLHttpRequest();
            xhr.open('GET', personnelHead, true);
            xhr.responseType = 'blob';
            var abortTimeout = setTimeout(function () {
                xhr.abort();
            }, 10000);
            xhr.onload = function() {
                clearInterval(abortTimeout);
                headerUrl = personnelHead;
                headerLoaded = true;
                var blob = xhr.response;
                var obj = new Image();
                obj.src = window.URL.createObjectURL(blob);
                obj.onload = function(){
                    window.URL.revokeObjectURL(this.src);
                };
                $(".person_head").css({
                    "background-image": "url('" + personnelHead + "')"
                });
                // $(".blur_bg").css({
                //     "background-image": "url('" + personnelHead + "')"
                // });
                bindDidAppearEvent();
            };
            xhr.onerror = function(){
                bindDidAppearEvent();
                clearInterval(abortTimeout);
            };
            xhr.onloadend = function(){
                clearInterval(abortTimeout);
            };
            xhr.send();
        }
        // var obj = new Image();
        // obj.onload = function() {
        //     headerUrl = personnelHead;
        //     headerLoaded = true;
        // }
        // obj.src = personnelHead;
        // console.log(personnelHead);
        // $(".person_head").css({
        //     "background-image": "url('" + personnelHead + "')"
        // });
        // $(".blur_bg").css({
        //     "background-image": "url('" + personnelHead + "')"
        // });
        //姓名，超过10位...显示（头像下方显示的人员姓名）
        if(data.name){
            var myName = data.name.length > 15 ? (data.name.slice(0, 15) + "...") : data.name;
            $(".person_info").find(".name").html(myName);
        }
    }

    //事件初始化
    function initEvent() {
        if (hrefMark || getUrlParam.isfromnative == "true") {
            $('#backBtn').on('tap', function() {
                cmp.href.back();
            })
            document.addEventListener("backbutton", function(event) {
                cmp.href.back();
            });
        } else {
            cmp.backbutton();
            cmp.backbutton.push(m3.exitApp);
        }
        cmp.webViewListener.add({ "type": "com.seeyon.m3.my.changeIcon" });
        document.addEventListener("com.seeyon.m3.my.changeIcon", function(event) {
            var personnelHead = m3.userInfo.getCurrentMember().iconUrl;
            $(".person_head").css({
                "background-image": "url('" + personnelHead + "')"
            });
            // $(".blur_bg").css({
            //     "background-image": "url('" + personnelHead + "')"
            // });
        });
        //获取用户来电列表显示状态----------------------穿透到设置页面用到。
        nativeApi.getCallerAuthorShow(function(res){
            settingParam.listShow = res.state == 1 ? true : false;
        },function(error){ 
            settingParam.listShow = false;
        });

        //检查小智权限
        m3.checkXiaozhiPermission({
            success: function() {
                settingParam.xiaozhiShow = true;
            },
            error: function(err) {
                if ((err.code != 57001) || (err.code != 57007) ) { //没有插件(停用)
                    settingParam.xiaozhiShow = false;
                }
            }
        });

        //检查是否配置了关联账号，没有配置则不显示切换企业入口
        nativeApi.getAssociateAccountState(function(res){
            settingParam.switcherShow = res.state == 0 ? false : true;
        },function(res){
            settingParam.switcherShow = false;
        });

        pageJump();//页面跳转 
        //左上角返回按钮
        backBtn();

    }

    function getAppData(){
        //获取我的收藏
        m3.getDefaultAppByAppId("60",function(res){
            if(!res)return;
            var isShow = res.isShow;
            if(isShow != "1"){
                $('#mycollect').addClass('display_none');
            }else{
                $('#mycollect').removeClass('display_none');
            }
            CollectionData = res;
        });

        //获取离线文档
        m3.getDefaultAppByAppId("9999",function(res){
            if(!res)return;
            documentData = res;
        });

        //获取红包入口权限
        cmp.distinc.walletAuthorization({
            success:function(res){
                if(res){ //有权限
                    $('#mymoney').show();
                }
            },
            error:function(res){
                console.log('获取红包权限失败');
            }
        });
        //获取我的客服入口权限
        m3Ajax({
            url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/onlinecustomerservice/checkOnlineCustomerService",
            type: 'GET',
            setCache: {
                key: 'm3-onlinecustomerservice-show',
                isShowNoNetWorkPage: false
            },
            success: function(msg) {
               var flag = msg.data.result;
               if(flag){  
            	   $('#mycustomerservice').show();
               }
            },
            error: function(res){
                console.log('获取我的客服权限失败');
            }
        });
    }

    //点击item，页面跳转
    function pageJump() {
        //进入我的二维码页面
        $('#my_personDecoder').on("tap",function(e){
            e.preventDefault();
            e.stopPropagation();
            m3.state.go(m3.href.map.my_personDecoder, null, m3.href.animated.left, true);
        });
        
        //进入个人信息
        $(".person_header").on("tap", function(e) {
            e.preventDefault();
            e.stopPropagation();
            //判断网络状态，在线的话直接跳转，离线的话判断是否拿到了离线数据后再跳转
            nativeApi.getNetworkState(function( ret ) {
                var state = (ret.serverStatus === 'connect');
                if(state){ //在线
                    m3.state.go(m3.href.map.my_person_detail, m3.userInfo.getId(), m3.href.animated.left, true);
                }else {
                    nativeApi.getMemberInfo({
                        id: data.id,
                        accountId: cmp.storage.get('curCompanyId',true) || m3.userInfo.getCurrentMember().accountId
                    }, function(res){
                        m3.state.go(m3.href.map.my_person_detail, m3.userInfo.getId(), m3.href.animated.left, true);
                    }, function(e) {
                        cmp.notification.alert(fI18nData["my.m3.h5.isdownState"]);//正在下载离线通讯录,请稍后
                    });
                }
            });
            
            
        });
        //进入个人信息
        $("#person").on("tap", function() {
            m3.state.go(m3.href.map.my_person_detail, m3.userInfo.getId(), m3.href.animated.left, true);
        });

        //进入我的企业
        $("#company").on("tap", function() {
            m3.state.go(m3.href.map.my_company, parent, m3.href.animated.left, true);
        });

        //进入客户系统
        $("#customer").on("tap", function() {
            alert("未开放");
        });

        //进入帮助中心
        $("#help").on("tap", function() {
            alert("未开放");
        });

        //进入设置
        $("#setting").on("tap", function() {
            if(settingParam && settingParam.listShow){
                //获取用户来电按钮开关显示状态
                nativeApi.getCallerAuthor(function(data) {
                    //状态开启
                    settingParam.listOpen = data.state;
                    m3.state.go(m3.href.map.my_set, settingParam, m3.href.animated.left, true);
                }, function(e) {
                    settingParam.listOpen = false;
                    m3.state.go(m3.href.map.my_set, settingParam, m3.href.animated.left, true);
                });
            }else{
                m3.state.go(m3.href.map.my_set, settingParam, m3.href.animated.left, true);
            }
        });
        
        //进入离线文档
        $("#MyFile").on("tap", function() {
            cmp.att.openOfflineFilesModule({
                name:fI18nData["my.m3.h5.MyFile"],
                success: function() {},
                error: function() {}
            });
            // if(documentData)m3.loadApp(JSON.parse(documentData));   
        });

        //进入我的收藏
        $("#mycollect").on("tap", function() {
            if(CollectionData) m3.loadApp(CollectionData);
        });

        //进入我的钱包
        $("#mymoney").on("tap", function() {
            cmp.distinc.walletOpen();
        });
        //进入我的客服跳转页面
        $("#mycustomerservice").on("tap", function() {
        	 m3Ajax({
                 url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/onlinecustomerservice/getCustomerServicePage",
                 type: 'GET',
                 setCache: {
                     key: 'm3-onlinecustomerservice-page',
                     isShowNoNetWorkPage: false
                 },
                 success: function(msg) {
                	 if(msg.data.tips){
                		 cmp.notification.alert(msg.data.tips,null," ",cmp.i18n("my.m3.h5.sure"));
                	 }else{
                		  cmp.openWebView({
                            useNativebanner: true,
                            url: msg.data.url
                        });
                	 }
                 },
                 error: function(msg) {
                	 console.log('获取客服地址失败');
                 }
             });
        });
        
        
    }

    //左上角返回按钮
    function backBtn() {
//        $("#backBtn").on("tap", function() {
//            cmp.href.close();
//        });
    }
})();
