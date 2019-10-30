var serverAdress = uc.getCurServerInfo().serverurl;
var paramsData = {};
var groupMemberTatal = null;
var groupMembersList = [];//选人时传递进去的在群组内的人员，保存已选人员数据[{'id':123456,'name':'sdf','type':'member'}]
var groupMemberLength = null;
cmp.ready(function () {
    paramsData = cmp.href.getParam();
    paramsData && (paramsData.gAdminId = "");
    var group_admin_control = document.getElementById('uc-confirm');
    group_admin_control.style.display = paramsData ? ( paramsData.isAdmin ? 'block' : 'none') : 'none';
    // 返回
    back();
    // 获取群组人数上线
    ucCommon.ucGetGroupTotal();
    // 加载页面数据
    loadData();
    //设置搜索框为允许输入
    document.getElementById("btn_a").readOnly = false;
    document.getElementById("btn_a").setAttribute('placeholder', cmp.i18n("uc.m3.h5.search"));

    var searchValue= document.querySelector(".cmp-placeholder .cmp-icon");
    if(searchValue){
        searchValue.nextElementSibling.innerHTML=cmp.i18n("uc.m3.h5.search");
    }
    //监听回车
    $(document).keydown(function(e) {
        // 回车键事件
        e.stopPropagation();
        var value = $("#btn_a")[0].value.trim();
        if (value) {
            if (e.which == 13) {
                cmp.href.next(ucPath + "/html/ucSearchGroupMemberPage.html", {data:[value,paramsData.groupId]},{
                    animated : true,
                    direction : "left"
                });
            }
        }
    });
    cmp.event.orientationChange(function(res){
        window.location.reload();
    });
});
function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}
function back(){
    _$("#prev").addEventListener("tap", function () {
        cmp.href.back();
    },false);
    document.addEventListener("backbutton",function(){
        cmp.href.back();
    },false);
}
function loadData() {
    cmp.listView("#property", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            params: {},
            renderFunc: memberListDataCallback,
            dataFunc: function(params,option){
                var pageNo = params["pageNo"];
                cmp.ajax({
                    type: "GET",
                    url: serverAdress + "/seeyon/rest/uc/rong/groups/memberbygid/" + paramsData.groupId + '?pageNo=' + pageNo,
                    success: function (msg) {
                        // groupMemberTatal = msg.total;
                        var listData = {
                            data: msg.groupMembers,
                            total: msg.total
                        }
                        console.log(listData)
                        option.success(listData)
                    },
                    error: function (msg) {
                        console.log(msg)
                        //进行错误处理
                        if (msg && msg.message) {
                            cmp.notification.alert(msg.message,function(){
                                cmp.href.back();
                            },"",cmp.i18n("uc.m3.h5.ok"));
                        } else {
                            cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){
                                cmp.href.back();
                            },"",cmp.i18n("uc.m3.h5.ok"));
                        }
                    }
                });
            },
            customScrollMoveEvent: function(res){console.log(res);},
            clearUI: true,
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("uc.m3.h5.pullDownToRefresh"),
            contentover: cmp.i18n("uc.m3.h5.releaseTheRefresh"),
            contentrefresh: ""
        },
        up: {
            contentdown: cmp.i18n("uc.m3.h5.loadMore"),
            contentrefresh: cmp.i18n("uc.m3.h5.loadMore"),
            contentnomore: cmp.i18n("uc.m3.h5.noMore")
        }
    });

    addMember();
}
/**
 * 群成员信息回调
 * @param result
 * group_members
 */
function memberListDataCallback(result){
    var groupMembers = result;
    var mLen = groupMembers.length;
    groupMemberLength = mLen;
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        for(var i = 0,groupAdmin=[],members=[]; i < mLen ; i++){
            var member = groupMembers[i];
            var mId = member.id;
            var mName = member.name;
            var memberInfo = {
                id : mId,
                name : mName,
                src : serverAdress + "/seeyon/rest/orgMember/avatar/"+mId+"?maxWidth=100",
                isAdmin : member.isCreator
            };
            members.push(memberInfo);
        }
        
        // 渲染群成员
        var ul = _$(".uc-del-group-member");

        for (var t = 0 ; t < members.length ; t++) {
            var html = cmp.tpl(memberHeadTpl, members[t]);
            ul.innerHTML = ul.innerHTML + html;
        }

        if(paramsData.isAdmin){//管理员
            slideEvent();
            removetapEvent();
        }
        jumpToMemberDetail();
    }else{
        cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){
            cmp.href.back();
        },"",cmp.i18n("uc.m3.h5.ok"));
    }
}

function addMember(){
    document.getElementById("uc-confirm").addEventListener('tap',function(){
        cmp.ajax({
            type: "GET",
            url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + paramsData.groupId,
            success: function (msg) {
                selectMember(msg);
            },
            error: function (msg) {
                console.log(msg);
                //进行错误处理
            }
        });
        
    },false);
}

function selectMember (res) {
    var groupInfo = res.group;
    var groupMembers = groupInfo.ma;
    groupMemberLength = groupMembers.length;
    if (groupMemberLength >= 1000) {
        cmp.notification.alert(cmp.i18n("uc.m3.h5.limitReached"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
    } else {
        // 为了给选人组件回填数据，必须获取全部群成员
        cmp.ajax({
            type: "GET",
            url: serverAdress + "/seeyon/rest/uc/rong/groups/memberbygid/" + paramsData.groupId + '?pageNo=1&pageSize=1000',
            success: function (msg) {
                groupMemberTatal = msg.total;
                var memberArr = msg.groupMembers;
                if (memberArr) {
                    for (var i = 0; i < memberArr.length; i++) {
                        groupMembersList[i] = {
                            id: memberArr[i].id,
                            name: memberArr[i].name,
                            type: 'member'
                        }
                    }
                }
                // 返回的群成员数据是json串，得转一下
                for (var j = 0, memberList = []; j < groupMembers.length; j++) {
                    memberList.push(JSON.parse(groupMembers[j]));
                }
                ucCommon.ucSelectMember({
                    minSize:1,
                    label: ['org','extP'],
                    notSelectAccount: true,
                    choosableType: ['member'],
                    maxSize: ucCommon.ucGroupTotal,
                    callback: function(result){
                        var resultObj = JSON.parse(result);
                        var orgResult = resultObj.orgResult;
                        var renderMemberIdList = [], addMemberDataV5 = [];
                        if (orgResult.length > 0) {
                            for(var i = 0;i<orgResult.length;i++){
                                var peo = orgResult[i];
                                addMemberDataV5[i] = peo.id;
                                renderMemberIdList[i] = {
                                    id: peo.id,
                                    name: peo.name,
                                    src: serverAdress + "/seeyon/rest/orgMember/avatar/"+peo.id+"?maxWidth=100"
                                };
                            }
                            cmp.ajax({
                                type: "POST",
                                url: serverAdress + "/seeyon/rest/uc/rong/groups/join",
                                data:JSON.stringify({
                                    groupId: paramsData.groupId,
                                    memberId: addMemberDataV5.join(",")
                                }),
                                success: function (msg) {
                                    window.location.reload();
                                },
                                error: function (msg) {
                                    console.log(msg);
                                    //进行错误处理
                                }
                            });
                            cmp.selectOrgDestory("select");
                        }
                    }
                }, groupMembersList);
            },
            error: function (msg) {
                console.log(msg)
                //进行错误处理
                if (msg && msg.message) {
                    cmp.notification.alert(msg.message,function(){
                        cmp.href.back();
                    },"",cmp.i18n("uc.m3.h5.ok"));
                } else {
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){
                        cmp.href.back();
                    },"",cmp.i18n("uc.m3.h5.ok"));
                }
            }
        });
    }
}

// 删除人员回调函数
function removedCallback (removeMemberId){
    if (removeMemberId) {
        var dom = document.getElementById(removeMemberId).parentNode.parentNode;
        dom.parentNode.removeChild(dom);
    }
}

// 滑动事件
function slideEvent () {
    var startP,endP;
    var maskList = document.querySelectorAll(".slide-mask");
    for (var i = 0 ; i < maskList.length ; i++) {
        maskList[i].addEventListener("touchstart",function(e){
            startP = e.changedTouches[0].clientX;
        });
        maskList[i].addEventListener("touchend",function(e){
            var slideRemove = this.querySelector(".slide-remove");
            endP = e.changedTouches[0].clientX;
            if (startP && endP && (startP - endP > 10)) {
                if (slideRemove) slideRemove.setAttribute("class","slide-remove slide-show");
            } else if (startP && endP && (endP - startP > 10)) {
                if (slideRemove) slideRemove.setAttribute("class","slide-remove slide-hide");
            }
        });
    }
}

function removetapEvent () {
    var removeBtnList = document.querySelectorAll(".slide-remove");
    for (var i = 0 ; i < removeBtnList.length ; i++) {
        delMember(removeBtnList[i]);
    }
}

// 删除按钮删除群成员
function delMember (ele) {
    ele.addEventListener('tap',function(){
        event.stopPropagation && event.stopPropagation();
        event.stopDefault && event.stopDefault();
        selectedMemberId = this.getAttribute("id");
        cmp.ajax({
            type: "POST",
            url: serverAdress + "/seeyon/rest/uc/rong/groups/remove",
            data:JSON.stringify({
                groupId: paramsData.groupId,
                memberId: selectedMemberId
            }),
            success: function (msg) {
                console.log(msg);
                // 更新已选择人员的数组，用来回填选人组件
                for(var i = 0;i<groupMembersList.length;i++){
                    if (groupMembersList[i].id == selectedMemberId) {
                        groupMembersList.splice(i,1);
                    }
                }
                removedCallback(selectedMemberId);
            },
            error: function (msg) {
                console.log(msg);
                //进行错误处理
            }
        });
    },false);
}

// 跳转到人员名片
function jumpToMemberDetail () {
    var membList = document.querySelectorAll(".container-cell");
    for (var i = 0 ; i < membList.length ; i++) {
        // removeEvent(membList[i],['tap']);
        membList[i].addEventListener('tap',function(){
            var memberId = this.getAttribute("data-id");
            var enableChat = false;
            memberId == paramsData.userId && (enableChat = true);
            var param = {
                page: 'ucShowMoreGroupMemberPage',
                id: memberId,
                from: 'uc',
                enableChat: enableChat
            };
            cmp.visitingCard(memberId);
        });
    }
}

// 单个元素解除绑定事件（避免初始化绑定过以后，选完人员后再次绑定）
/**
  * @ ele : dom对象
  * @ events : 绑定过的事件名称数组 ［‘click’，‘touchstart’］
**/
function removeEvent (ele, events) {
    if (events.length > 0 && events.length < 2) {
        ele.removeEventListener(events[0]);
    } else if (events.length >= 2) {
        for (var i = 0 ; i < events.length ; i++) {
            ele.removeEventListener(events[i]);
        }
    }
}
