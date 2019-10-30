/**
 * description: 个人聊天详情页面
 * author: hbh
 * createDate: 2017-08-14
 */
(function() {
    var topStatus = "";//会话置顶开关
    var alertStatus = "";//消息免打扰开关
    var params = window.location.search.substr(1).split("&");
    var targetId = (params[0].split("="))[1];
    var userId = (params[1].split("="))[1];
    var userName = decodeURIComponent((params[2].split("="))[1]);
    var serverAdress = uc.getCurServerInfo().serverurl;//ip地址
    var groupName = "";
    var groupMembersNameList = [];
    var groupMembersId = [];
    var clickDebounce = false;


    //入口函数
    function initPage() {
        cmp.ready(function() {
            // 获取群组人数上线
            ucCommon.ucGetGroupTotal();
            initStyle();
            initEvent();
        });
    }
    initPage();

    //样式初始化
    function initStyle() {
        //人员头像
        var url = serverAdress +"/seeyon/rest/orgMember/avatar/"+ userId +"?maxWidth=100";
        $(".img").css({
            "background-image": "url('" + url + "')"
        });
        //人员姓名
        $("#name").text(userName);
        //初始化开关按钮状态
        cmp.chat.exec("getChatSettings",{
            success: function(res){
                console.log("获取开关状态成功");
                console.log(res);
                topStatus = res.topStatus;
                alertStatus = res.alertStatus;
                if(topStatus == "1"){
                    $("#top").addClass("cmp-active")
                }
                if(alertStatus == "1"){
                    $("#notDisturb").addClass("cmp-active")
                }
            },
            error: function(err){
                console.log("获取开关状态失败");
                console.log(err);
            },
            params:{
                "type":"private",
                "targetId":userId
            }
        })
    }

    //事件初始化
    function initEvent() {
        //初始化开关
        cmp('.cmp-switch')['switch']();
        //左上角返回按钮
        backBtn();
        //邀请
        inviteMember([
            {id:cmp.member.id,name:cmp.member.name,type:"member"},
            {id:userId,name:userName,type:"member"}
        ]);
        // selectMember([
        //     {id:cmp.member.id,name:cmp.member.name,type:"member"},
        //     {id:userId,name:userName,type:"member"}
        // ]);
        openMemberCard(userId);
        //会话置顶
        topSession();
        //消息免打扰
        notDisturb();
        //聊天记录查询
        chatHistory();
        //清空聊天记录
        emptyRecords();
    }

    // 打开人员名片
    function openMemberCard (userId) {
        if (userId) {
            $('.info-photo>div').on('touchend', function(e){


                if(!clickDebounce){
                    clickDebounce = true
                    setTimeout(function(){
                        clickDebounce = false
                    },1000)

                    if (e.target && e.target.className.indexOf('noClick') != -1) {
                        cmp.visitingCard(userId)
                    } else {
                        $('.info-photo>div').addClass('noClick')
                        cmp.visitingCard(userId)
                    }
                }



            })
        } else {
            console.log('userId获取失败：'+userId)
        }
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.close();
        });
    }

    //会话置顶
    function topSession() {
        $("#top").on("touchend", function() {
            if($(this).hasClass("cmp-active")){
                topStatus = "1"
            } else {
                topStatus = "0"
            }
            cmp.chat.exec("setTopStatus",{
                success: function(res){
                    console.log("会话置顶设置成功");
                },
                error: function(err){
                    console.log("会话置顶设置失败");
                },
                params:{
                    "type":"private",
                    "targetId":userId,
                    "topStatus":topStatus
                }
            })
        });
    }

    //消息免打扰
    function notDisturb() {
        $("#notDisturb").on("touchend", function() {
            if($(this).hasClass("cmp-active")){
                alertStatus = "1"
            } else {
                alertStatus = "0"
            }
            cmp.chat.exec("setChatAlertStatus",{
                success: function(res){
                    console.log("消息免打扰设置成功");
                },
                error: function(err){
                    console.log("消息免打扰设置失败");
                },
                params:{
                    "type":"private",
                    "targetId":userId,
                    "alertStatus":alertStatus
                }
            })
        });
    }

    //聊天记录查询
    function chatHistory() {
        $("#chatHistory").on("tap", function() {
            // alert("尚未开发，敬请期待")
        });
    }

    //清空聊天记录
    function emptyRecords() {
        $("#emptyRecords").on("tap",function(){
            cmp.notification.confirm(cmp.i18n("uc.m3.h5.whetherClearHistory"), function(index) {
                if (index == 0) { //取消

                } else if (index == 1) { //确定
                    cmp.chat.exec("clearChatMessage",{
                        success: function(res){
                            console.log("消息免打扰设置成功");
                        },
                        error: function(err){
                            console.log("消息免打扰设置失败");
                        },
                        params:{
                            "type":"private",
                            "targetId":userId
                        }
                    })
                }
            }, cmp.i18n("uc.m3.h5.confirm"), [cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")]);
        })
    }

    //调用选人控件
    function inviteMember(memberData){
        var n = 0;
        document.getElementById("invite").addEventListener('tap',function(){
            n++;
            if (n <= 1) {
                ucCommon.ucSelectMember({
                    minSize:2,
                    label: ['org','extP'],
                    notSelectAccount: true,
                    choosableType: ['member'],
                    maxSize: ucCommon.ucGroupTotal,
                    callback: function(result){
                        n = 0;
                        console.log(result);
                        var resultObj = JSON.parse(result);
                        var orgResult = resultObj.orgResult;
                        if (orgResult.length > 0) {
                            returnRangeData(orgResult);
                        }
                        cmp.selectOrgDestory("select");
                        // 用群成员名拼接群名
                        var gNamelist = [];
                        for (var i = 0; i < groupMembersNameList.length; i++) {
                            if (i <= 3) {
                                gNamelist.push(groupMembersNameList[i].slice(0,4));
                            }
                        }
                        groupName = gNamelist.join(",");
                        // 调用创建群租接口
                        cmp.ajax({
                            type: "POST",
                            data: JSON.stringify({
                                groupName: groupName,
                                description: "",
                                groupMembers: groupMembersId.join(","),
                                membersName: groupMembersNameList.join(",")
                            }),
                            url: serverAdress + "/seeyon/rest/uc/rong/groups/create",
                            success: function (msg) {
                                console.log(msg)


                                if(msg && msg.status === 'ok' && msg.code === '6110' && msg.groupId){
                                // 创建\跳转到群组聊天窗口
                                    var groupId = msg.groupId
                                    cmp.chat.exec("startChat",{
                                        success: function(res){

                                        },
                                        error: function(err){
                                            console.log(err);
                                            //进行错误处理
                                            if (msg && msg.code && msg.code == 501) {
                                                cmp.notification.alert('群组最大人数: ' + ucCommon.ucGroupTotal + ',已超出最大人数',function(){
                                                    selectMember(memberData);
                                                },"","确定");
                                            }
                                        },
                                        params:{
                                            "type":"group",
                                            "targetId":groupId,
                                            "title":groupName,
                                            "clearPrePage":true
                                        }
                                    })

                                }else if(msg && msg.code){
                                    var title = ''
                                    switch(msg.code){
                                        case 6111:
                                            title = '群组名称输入有误或包含非法字符，请重新输入！'
                                            break;
                                        case 6112:
                                            title = '创建群组失败，数据异常！'
                                            break;
                                        case 6113:
                                            title = '创建群组失败，超出群组最大限定人数！'
                                            break;
                                        case 6114:
                                            title = '群组不存在！'
                                            break;
                                        case 6115:
                                            title = '群组更新失败！'
                                            break;
                                        case 6116:
                                            title = '移除出群组失败！'
                                            break;
                                        case 6117:
                                            title = '解散群组失败！'
                                            break;
                                        case 6118:
                                            title = '退出群组失败！'
                                            break;
                                        default:
                                            title = '群组创建失败！(服务器错误)'
                                    }

                                    cmp.notification.alert(title,function(){
                                        selectMember(memberData);
                                    },"","确定");
                                }

                            },
                            error: function (err) {
                                console.log(err)
                            }
                        });
                    },
                    closeCallback: function(){
                        n = 0;
                    }
                }, memberData);
            }
        },false);
    }

    function returnRangeData(mdata) {
        for (var i = 0; i < mdata.length; i++) {
            groupMembersNameList[i] = mdata[i].name;
            groupMembersId[i] = mdata[i].id;
        }
    }
})();
