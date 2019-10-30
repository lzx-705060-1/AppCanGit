cmp.ready(function() {
            var titHeight = $('#header').offset().height;
            // appcan.frame.open("content", "myApply_content.html", 0, titHeight);
            // window.onorientationchange = window.onresize = function() {
            //     appcan.frame.resize("content", 0, titHeight);
            // }
        });
		$("#nav-left").on("tap", function(){
            //appcan.window.publish('index');
            cmp.href.back();
        })
        
        function closethis(){
            //appcan.window.publish('index');
            cmp.href.back();
        }
		
var tabindex = 0;
        var formhide;
        cmp.ready(function() {
            appcan.initBounce();
            $("#newOAList").hide();
            $("#oldOAList").hide();
            var tabview = appcan.tab({
                selector : "#tabview",
                hasIcon : false,
                hasAnim : true,
                hasLabel : true,
                hasBadge : false,
                index : tabindex,
                data : [{
                    label : "新oa待办",
                }, {
                    label : "旧oa待办",
                }]
            })

            //if (true == is_intranet()) {//需要控制为内网
            /*var meetingdbCount = parseInt(cmp.storage.get("meetingdbCount"));
             var meetingqx = cmp.storage.get("meetingqx");
             if (meetingqx == "true") {
             tabview = appcan.tab({
             selector : "#tabview",
             hasIcon : false,
             hasAnim : true,
             hasLabel : true,
             hasBadge : false,
             index : tabindex,
             data : [{
             label : "新oa待办",
             }, {
             label : "旧oa待办",
             }, {
             label : "会议申请待办",
             }]
             });
             get_meeting_count();
             } else {
             tabview = appcan.tab({
             selector : "#tabview",
             hasIcon : false,
             hasAnim : true,
             hasLabel : true,
             hasBadge : false,
             index : tabindex,
             data : [{
             label : "新oa待办",
             }, {
             label : "旧oa待办",
             }]
             });
             }

             //}
             /*else {
             tabview = appcan.tab({
             selector : "#tabview",
             hasIcon : false,
             hasAnim : true,
             hasLabel : true,
             hasBadge : false,
             index : tabindex,
             data : [{
             label : "新oa待办",
             }, {
             label : "旧oa待办",
             }]
             })
             }*/

            if (cmp.storage.get('dbtabindex')) {
                tabindex = cmp.storage.get('dbtabindex');
            }
            if (tabindex != 2) {
                tabview.moveTo(tabindex);
            }
            tabview.on("tap", function(obj, index) {
                if (index == 1) {
                    showOldOAdaiban(1);
                    cmp.storage.save('dbtabindex', 1);
                     waterMark2("myApplylist");
                } else if (index == 0) {
                    showNewOAPageDaiban(1);
                    cmp.storage.save('dbtabindex', 0);
                     waterMark2("myApplylist");
                } else if (index == 2) {
                    //会议管理系统--开发中
                    //if (true == is_intranet()) {//需要控制为内网
                    tabview.moveTo(tabindex);
                    var serviceUrl = cmp.storage.get('serviceUrl');
                    var loginname = cmp.storage.get('loginname');
                    var password = cmp.storage.get('password');
                    //var url = 'http://10.1.9.144/phone/meeting_list.html?&loginname=' + loginname + '&password=' + password;
                    var url = serviceUrl + '/phone/meeting_list.html?&loginname=' + loginname + '&password=' + password;
                    cmp.href.next('meeting_list', url, 10, 4);
                    //} else {
                    //  cmp.notification.alert({
                    //     title : "提醒",
                    //     content : "您需要连接内网WiFi才能继续访问",
                    //     buttons : '确定',
                    //    callback : function(err, data, dataType, optId) {
                    //    }
                    //});
                    //}
                }
            })
            cmp.storage.save('can_track', 0);
            //控制显示
            if (cmp.storage.get('dbtabindex')) {
                tabindex = cmp.storage.get('dbtabindex');
                cmp.storage.save('dbtabindex', '');
            }

            if (tabindex == 0) {
                var oc = 0;
                if (cmp.storage.get('olddbCount')) {
                    oc = cmp.storage.get('olddbCount');
                }
                $(".sc-text-tab").eq(1).html("<div><span>旧OA待办</span><span style='color:red'>(" + oc + ")</span></div>");
                showNewOAPageDaiban(1);
            } else if (tabindex == 1) {

                var nc = 0;

                if (cmp.storage.get('newdbCount')) {
                    nc = cmp.storage.get('newdbCount');
                }
                $(".sc-text-tab").eq(0).html("<div><span>新OA待办</span><span style='color:red'>(" + nc + ")</span></div>");
                showOldOAdaiban(1);
            }
            appcan.frame.setBounce({
                bounceType : "1",
                downEndCall : function(type) {

                    if (type == 1) {
                        var tabindex1 = cmp.storage.get('dbtabindex');

                        if (tabindex1 == 0) {
                            var pageno = Number($("#pageNo").html());
                            pageno += 1;

                            $("#pageNo").html(pageno);
                            showNewOAPageDaiban(1);
                        } else if (tabindex1 == 1) {
                            var pageno = Number($("#pageNo").html());
                            pageno += 1;

                            $("#pageNo").html(pageno);
                            showOldOAdaiban(1);
                        }
                    }
                    appcan.frame.resetBounce(type);
                }
            });
            /*
            appcan.frame.setBounce(1, function(type) {
            $("#pullstatus" + type).html(!type ? "重新加载数据" : "加载下一页");
            }, function(type) {
            //$("#pullstatus"+type).html(!type?"下拉超过临界点,产生事件了！":"超过临界点,产生事件了！");
            }, function(type) {
            if (!type) {
            //重新加载数据
            setTimeout(function(type) {
            appcan.frame.resetBounce(0);
            $("#pullstatus").html("");
            //showNewOAdaiban(2);
            }, 1000);
            } else {
            }
            });*/
            //隐藏滚动条
            uexWindow.setWindowScrollbarVisible(false);
            uexWindow.evaluatePopoverScript("chatmain", "content0", "daibanTotalCount();");
            //获取搜索框的高度赋值给列表
            var titHeight = $('#searchTop').offset().top;
            $("#myApplylist").css('marginTop', titHeight);
            waterMark2("myApplylist");
        })
        //会议管理:待办数量
        function get_meeting_count() {
            //获取会议申请待办数量
            var c1 = cmp.storage.get("meetingdbCount")
            $(".ulev").eq(2).html("会议申请待办<span style='color:red'>(" + c1 + ")</span>")
        }

        function get_meeting_count3() {
            //获取会议申请待办数量
            var c1 = cmp.storage.get("meetingdbCount")
            $(".ulev").html("会议申请待办<span style='color:red'>(" + c1 + ")</span>")
            uexWindow.evaluatePopoverScript("chatmain", "content0", "daibanTotalCount();");
        }

        //会议待办数量（跨域时使用）
        function get_meeting_count2() {
            //获取会议申请待办数量
            var serviceUrl = cmp.storage.get('serviceUrl');
            var loginname = cmp.storage.get('loginname');
            var password = cmp.storage.get('password');
            var obj = new Object();
            obj.url = serviceUrl + "/servlet/PublicServiceServlet";
            obj.data = {
                'message_id' : 'meetingsys',
                'branch' : 'getlist',
                'loginname' : loginname,
                'password' : password
            };
            obj.successFun = 'get_meeting_count2_success';
            ajaxJson_v1(obj);

        }

        //会议管理:待办数量--成功
        function get_meeting_count2_success(a) {
            if (a.login.CURRENTUSERLOGINNAME == "") {

            } else {
                //获取会议待办数量
                var c1 = 0;
                var aff = a.list.DATA;
                for (var i in aff) {
                    if (aff[i].affairId != '') {
                        c1++;
                    }
                }
                $(".ulev").html("会议申请待办<span style='color:red'>(" + c1 + ")</span>")
            }
        }

        //新oa待办数据库
        /*function showNewOAdaiban(page) {
         var serviceUrl = cmp.storage.get('serviceUrl');
         var phoneid = cmp.storage.get('phoneid');
         var loginname = cmp.storage.get('loginname');
         var password = cmp.storage.get('password');
         var userid = cmp.storage.get('userid');
         var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_edoc_col";
         url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&pageNo=" + page + "&userId=" + userid;
         ajaxJson(url, httpsucess);
         }*/

        function showOldOAdaiban(page) {
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            cmp.storage.save('dbtabindex', 1);
            if (olduser && oldpwd) {
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_gw&stype=gwlist";
                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&pageNo=" + page;
                ajaxJson(url, httpoldsucess);
            } else {
                cmp.notification.alert({
                    title : "提醒",
                    content : "请先绑定AD帐号",
                    buttons : '确定',
                    callback : function(err, data, dataType, optId) {
                        console.log(err, data, dataType, optId);
                        cmp.href.next('old_user', 'old_user.html', 10);
                    }
                });
            }
        }

        function showOldOAdaibansoso(key) {
            var olduser = cmp.storage.get('olduser');
            var oldpwd = cmp.storage.get('oldpwd');
            cmp.storage.save('dbtabindex', 1);
            if (olduser && oldpwd) {
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_gw&stype=gwlist";
                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&key=";
                if (key) {
                    key = "null;Title,Contains," + key + ",And";
                    url = url + key;
                }
                ajaxJson(url, httpoldsucess);
            } else {
                cmp.notification.alert({
                    title : "提醒",
                    content : "请先绑定AD帐号",
                    buttons : '确定',
                    callback : function(err, data, dataType, optId) {
                        console.log(err, data, dataType, optId);
                        cmp.href.next('old_user', 'old_user.html', 10);
                    }
                });
            }
        }

        function httpoldsucess(data) {
            $("#oldOAList").show();
            $("#newOAList").hide();
            $("#jzList").hide();
            var stationguid = data.stationguid.GW.guid;
            var info_list = data.gwlist.LIST;
            var count = info_list.length;
            var info_list_mode = new Array();
            if (stationguid) {
                cmp.storage.save('StationGUID', stationguid);
            }
            for ( i = 0; i < info_list.length; i++) {
                var info_mode = new Object();
                info_mode.title = info_list[i].title;
                info_mode.id = info_list[i].id;
                info_mode.uniqueid = info_list[i].uniqueid;
                if ((info_list[i].title.indexOf('[发起]') > -1) || (info_list[i].title.indexOf('[归档]') > -1)) {
                    count--;
                } else {
                    info_list_mode.push(info_mode);
                }
            }
            var oldcount = count;
            var count1 = cmp.storage.get('olddbCount');
            cmp.storage.save('olddbCount', oldcount);
            $(".sc-text-tab").eq(1).html("<div><span>旧OA待办</span><span style='color:red'>(" + oldcount + ")</span></div>");
            uexWindow.evaluateScript("main", 0, "getTotal();");
            var lv1 = appcan.listview({
                selector : "#oldOAList",
                type : "thickLine",
                hasIcon : true,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 3,
                hasCheckbox : false,
                align : 'left'
            });
            var olddblist = cmp.storage.get('olddblist');
            lv1.set(info_list_mode);
            cmp.storage.save('olddblist', info_list_mode);
            //此处颜色斑马线
            $('li').each(function(index, item) {

                if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
                    $(item).css("background-color", "#77CFAD");
                } else {

                }
            });
            lv1.on('tap', function(ele, obj, subobj) {
                console.log(ele, obj, subobj);
                openArticle(obj.title, obj.uniqueid);
            });

            //旧oa
            function openArticle(title, uniqueid) {
                cmp.storage.save("link_uniqueid", uniqueid);
                cmp.storage.save("link_title", title);
                cmp.href.next({
                    name : 'gw_atricle',
                    data : 'gw_atricle.html',
                    aniId : 10,
                    type : 4
                });
            }

            //调用主菜单重新赋值待办
            appcan.window.evaluatePopoverScript({
                name : 'main',
                popName : 'main_content',
                scriptContent : 'setCount();'
            });
        }

        function showNewOAPageDaiban(page) {
            cmp.storage.save('dbtabindex', 0);
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var loginname = cmp.storage.get('loginname');
            var password = cmp.storage.get('password');
            var userid = cmp.storage.get('userid');
            // var templeteids =cmp.storage.get('templeteids');
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_dblist&stype=dblist";
            url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&pageNo=" + page;
            ajaxJson(url, httpNewsucess);
        }

        function showNewOAPageDaibansoso(key) {
            cmp.storage.save('dbtabindex', 0);
            //  showNewOAForm();
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var loginname = cmp.storage.get('loginname');
            var password = cmp.storage.get('password');
            var userid = cmp.storage.get('userid');
            // var templeteids =cmp.storage.get('templeteids');
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_dblist&stype=dblist";
            url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid + "&key=" + key;
            ajaxJson(url, httpNewsucess);
        }

        function httpNewsucess(data) {
            console.log(data);
            $("#oldOAList").hide();
            $("#jzList").hide();
            $("#newOAList").show();
            var dblist = data['dblist'].LIST;
            formhide = data['formhide'];

            var newcount = dblist.length;
            var count2 = cmp.storage.get('newdbCount');
            cmp.storage.save('newdbCount', newcount);
            $(".sc-text-tab").eq(0).html("<div><span>新OA待办</span><span style='color:red'>(" + newcount + ")</span></div>");
            uexWindow.evaluateScript("main", 0, "getTotal();");
            var info_list_mode = new Array(dblist.length);
            for ( i = 0; i < dblist.length; i++) {
                var info_mode = new Object();
                info_mode.affair_id = dblist[i].affairid;
                info_mode.summaryid = dblist[i].summaryid;
                info_mode.node_policy = dblist[i].node_policy;
                info_mode.processid = dblist[i].processid;
                info_mode.sendername = dblist[i].name;
                info_mode.create_date = dblist[i].time;
                info_mode.title = "[" + dblist[i].node_policy + "]" + dblist[i].title;
                info_list_mode.push(info_mode);
            }

            var lv1 = appcan.listview({
                selector : "#newOAList",
                type : "thickLine",
                hasIcon : true,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 3,
                hasCheckbox : false,
                align : 'left'
            });
            var newdblist = cmp.storage.get('newdblist');
            lv1.set(info_list_mode);

            //此处颜色斑马线
            $('li').each(function(index, item) {
                if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
                    $(item).css("background-color", "#77CFAD");
                } else {

                }
            });
            lv1.on('tap', function(ele, obj, subobj) {
                console.log(ele, obj, subobj);
                openDetail(obj);
            });

            /*-------------推送通知------------------*/
            //推送通知：如果通过点击通知栏进来则进入详细页
            //从myApply_content.html页面打开xietongdetail页面
            try {
                jpush_openDetail_page(dblist);
            } catch(e) {
                console.log(e);
            }
        }

        //如果点击了推送进来的，则默认是要再打开详情界面的
        //从myApply_content.html页面打开xietongdetail页面
        function jpush_openDetail_page(dblist) {
            var jPush_Open = cmp.storage.get('jPush_Open');
            if (jPush_Open == true || jPush_Open == 'true') {
                var jPush_newOA = JSON.parse(cmp.storage.get('jPush_newOA'));
                var jPush_affair_id = jPush_newOA.affair_id;
                var jPush_processid = jPush_newOA.processid;
                var jPush_summaryid = jPush_newOA.summaryid;
                for ( z = 0; z < dblist.length; z++) {
                    var bd_affairid = dblist[z].affairid;
                    var bd_processid = dblist[z].processid;
                    var bd_summaryid = dblist[z].summaryid;
                    try {
                        if (null != jPush_newOA && undefined != bd_affairid && undefined != bd_processid && undefined != bd_summaryid) {
                            if (bd_affairid == jPush_affair_id && bd_processid == jPush_processid && bd_summaryid == jPush_summaryid) {
                                openDetail(jPush_newOA);
                            }
                        }
                    } catch(e) {
                        console.log("出错了：" + e);
                    }
                }
            }
        }

        function openDetail(obj) {
            var hideflag = false;
            for ( i = 0; i < formhide.length; i++) {

                if (obj.title.indexOf(formhide[i].title) > -1 || obj.title.indexOf("工作行为评估") > -1) {
                    hideflag = true;
                    cmp.notification.alert({
                        title : "提醒",
                        content : "该事项暂不支持在移动端审批，请到电脑端审批。",
                        buttons : '确定',
                        callback : function(err, data, dataType, optId) {
                            console.log(err, data, dataType, optId);
                            //return;
                        }
                    });
                    break;
                }
            }
            if (hideflag == false) {
                cmp.href.next({
                    name : 'xietongdetail',
                    data : 'xietongdetail.html',
                    aniId : 10,
                    type : 4
                });

                cmp.storage.save('affairid', encodeURI(obj.affair_id));
                cmp.storage.save('summaryid', obj.summaryid);
                cmp.storage.save('title', obj.title);
                cmp.storage.save('node_policy', obj.node_policy);
                cmp.storage.save('processid', obj.processid);
                cmp.storage.save('sendername', obj.sendername);
                cmp.storage.save('create_date', obj.create_date);

            }
        }

        //----------------------------------------------------------------------------------------------------------
        //新oa因需表单控制，所以增加一层，待办显示表单列表及待办数量
        function showNewOAForm() {
            var serviceUrl = cmp.storage.get('serviceUrl');
            var phoneid = cmp.storage.get('phoneid');
            var loginname = cmp.storage.get('loginname');
            var password = cmp.storage.get('password');
            var userid = cmp.storage.get('userid');
            var templeteids = '';
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_dblist&stype=formlist";
            url = url + "&username=" + loginname + "&password=" + password + "&PHONE_ID=" + phoneid;
            ajaxJson(url, function(data) {
                console.log(data);
                var formlist = data['formlist'];
                for ( i = 0; i < formlist.length; i++) {
                    templeteids += "," + formlist[i].id;
                }
                cmp.storage.save('templeteids', templeteids.substring(1));

            });

        }

		$("#search").on("tap", function(){
            var infoName = $('#infoName').val();
            if (infoName == "" || infoName == null) {
                cmp.notification.alert({
                    title : '提示',
                    content : '输入条件不能为空！',
                    buttons : '确定'
                });
            } else {
                //查找内容
                var tabindex = cmp.storage.get('dbtabindex');
                console.log(tabindex);
                if (tabindex == 0) {
                    showNewOAPageDaibansoso(infoName);
                } else if (tabindex == 1) {
                    showOldOAdaibansoso(infoName);
                }

            }

        })