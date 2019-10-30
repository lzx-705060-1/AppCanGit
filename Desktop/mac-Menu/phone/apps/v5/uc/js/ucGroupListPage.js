var serverAdress = uc.getCurServerInfo().serverurl;
var paramsData = {};
var memberData =[{
    id:cmp.member.id,
    name:cmp.member.name,
    type:"member"
}];
var loadedFlag = {} //用于存放是否加载指定js的标示

// var serverAdressV5 = "http://10.3.10.229:8082/mobile_portal/seeyon"
cmp.ready(function() {
    paramsData = cmp.href.getParam();
    console.log(paramsData)
    // 获取群组人数上限
    ucCommon.ucGetGroupTotal();
    // 获取群列表数据
    loadData();
    // 返回
    prevPage();
    // 创建群组
    createGroup();
    //设置搜索框为允许输入
    document.getElementById("btn_a").readOnly = false;
    document.getElementById("btn_a").value = "";
    document.getElementById("btn_a").setAttribute('placeholder', cmp.i18n("uc.m3.h5.search"));

    // 设置document title
    document.title = cmp.i18n("uc.m3.h5.myGroupChat");

    var searchValue= document.querySelector(".cmp-placeholder .cmp-icon");
    if(searchValue){
        searchValue.nextElementSibling.innerHTML=cmp.i18n("uc.m3.h5.search");
    }

    //监听回车
    // $(document).keydown(function(e) {
    //     // 回车键事件
    //     e.stopPropagation();
    //     var value = $("#btn_a")[0].value.trim();
    //     if (value) {
    //         if (e.which == 13) {
    //             cmp.href.next(ucPath + "/html/ucSearchGroupPage.html", {data: value},{
    //                 animated : true,
    //                 direction : "left"
    //             });
    //         }
    //     }
    // });

    document.onkeydown = function(e) {
        // 回车键事件
        e.stopPropagation();
        var value = _$("#btn_a").value.trim();
        if (value) {

            if (e.which == 13) {
                console.log("!~~~~~~~~~~~~",value)
                cmp.href.next(ucPath + "/html/ucSearchGroupPage.html", {data: value},{
                    animated : true,
                    direction : "left"
                });
            }

        }
    }

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
/**
 * 返回方法
 */
function prevPage() {
    document.getElementById("prev").addEventListener("tap", function(){
    		backFrom();
    });
    //安卓手机返回按钮监听！
    cmp.backbutton();
      cmp.backbutton.push(function(){
          cmp.href.closePage();
      });
}
//返回首页不刷新
function backFrom() {
	   // cmp.href.back(1,{ data:{isReload:false}});
       cmp.href.closePage();
}
// 通过uc列表接口，获取列表
function loadData() {
    cmp.dialog.loading();
    cmp.listView("#all_uc", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            params: {},
            renderFunc: renderList,
            dataFunc: function(params,option){  //请求数据的函数
                var pageNo = params["pageNo"];
                cmp.ajax({
                    type: "GET",
                    url: serverAdress + "/seeyon/rest/uc/rong/groups/mygroups?pageNo="+pageNo,
                    success: function (msg) {
                        cmp.dialog.loading(false);
                        var listData = {
                            data: msg.groups,
                            total: msg.total
                        }
                        console.log(listData)
                        option.success(listData)
                    },
                    error: function (msg) {
                        cmp.dialog.loading(false);
                        console.log(msg)
                        //进行错误处理
                        if (msg && msg.message) {
                            cmp.notification.alert(msg.message,function(){
                                cmp.href.back();
                            },"",cmp.i18n("uc.m3.h5.ok"));
                        } else {
                            cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetGroup"),function(){
                                cmp.href.back();
                            },"",cmp.i18n("uc.m3.h5.ok"));
                        }
                        // if (msg.code == -1009) {
                        //     cmp.dialog.loading({
                        //         status: "nonetwork",
                        //         text:"<h5 style='color: #666;'>无法连接到网络</h5><small>当前网络不可用,请检查您的网络设备</small>",
                        //         background:"#fff",
                        //         callback: function(){
                        //             cmp.connection.getNetworkType({
                        //                 success:function(networkState){
                        //                     if (networkState != 'none') {
                        //                         cmp.dialog.loading(false);
                        //                         cmp.listView("#all_uc").refreshInitData(false);
                        //                     }
                        //                 }
                        //             })
                        //         }
                        //     });
                        // }
                    }
                })
            },
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
    addbbsDetailsHref();
}
// 渲染数据
function renderList(result,isRefresh){
    var listUl = document.getElementById("group_list");
    var tpl = document.getElementById("ms_list_li").innerHTML;
    
    var listHtml = "";
    if(isRefresh){
        listUl.innerHTML = "";
    }

    for(var i = 0; i < result.length; i++){
        var groupInfoTag = result[i];
        console.log(groupInfoTag.n)
        var groupInfo = {
            id : groupInfoTag.i,
            name : groupInfoTag.n,
            src : serverAdress + "/seeyon" + groupInfoTag.pu,
            isAdmin : groupInfoTag.ci == cmp.member.id
        };
        listHtml += cmp.tpl(tpl, groupInfo);
    }
    listUl.innerHTML += listHtml;
}

/**
 * 列表添加点击事件
 */
function addbbsDetailsHref() {
    cmp("#group_list").on('tap', "li", function (e) {
        cmp.chat.start({
            title: this.getAttribute("data-toName"),
            id: this.getAttribute("id"),
            type: "group",
            success: function(){
                
            },
            error: function(){

            }
        })
    // cmp.href.next(ucPath + "/html/ucStartChat.html", {
    //     animated : true,
    //     direction : "left"
    // });
    });
}




// 创建群组
function createGroup(){  
    cmp("header").on("tap", "#create-group", function(e) {
        if(!loadedFlag.selectOrgModelJs){
            // 首次打开加载组件资源
            cmp.asyncLoad.css([cmpPath+"/css/cmp-selectOrg.css"], function() { });
            cmp.asyncLoad.js([cmpPath+"/js/cmp-selectOrg.js"],function(){
                loadedFlag.selectOrgModelJs = true
                selectMember(memberData);
            });
        }else{
            selectMember(memberData);
        }
    });
}

var groupName = "";
var departmentId = [];
var groupMembersNameList = [];
var groupMembersId = [];
var membersName = [];

function returnRangeData(mdata) {
    groupName = "";
    departmentId = [];
    groupMembersNameList = [];
    groupMembersId = [];
    membersName = [];
    for (var i = 0; i < mdata.length; i++) {
        if (mdata[i].type != 'Department') {
            groupMembersId.push(mdata[i].id);
            groupMembersNameList.push(mdata[i].name);
        } else {
            // 如果选择了部门需要给接口传递部门id
            departmentId.push(mdata[i].id);
        }
        membersName.push(mdata[i].name);
    } 
}

function selectMember (memberData) {
    ucCommon.ucSelectMember({
        minSize: 2,
        maxSize: ucCommon.ucGroupTotal - memberData.length,
        callback: function(result){
            cmp.chat.exec('getRongConfig',{
                success: function(res){
                    console.log(res);
                    ucCommon.ucGroupTotal = res.groupsize;
                    var resultObj = JSON.parse(result);
                    var orgResult = resultObj.orgResult;
                    if (orgResult.length > 0) {
                        returnRangeData(orgResult);
                    }
                    cmp.selectOrgDestory("select");

                    var isAlert = false;
                    if (departmentId && (departmentId.length > 0)) {
                        if ((departmentId.length + groupMembersId.length) > ucCommon.ucGroupTotal) {isAlert = true;}
                    }
                    if ((departmentId.length < 1) && (groupMembersId.length > ucCommon.ucGroupTotal)) {isAlert = true;}
                    if (isAlert) {
                        cmp.notification.alert(cmp.i18n("uc.m3.h5.maximumNumber")+ ': ' + ucCommon.ucGroupTotal,function(){
                            selectMember(memberData);
                        },"",cmp.i18n("uc.m3.h5.ok"));
                    }

                    // 用群成员名拼接群名
                    var gNamelist = [];
                    if (membersName && membersName.length != 0) {
                        for (var i = 0; i < membersName.length; i++) {
                            if (i <= 3) {
                                gNamelist.push(membersName[i].slice(0,4));
                            }
                        }
                        groupName = gNamelist.join(",");
                    }

                    // 调用创建群租接口
                    cmp.dialog.loading();
                    cmp.ajax({
                        type: "POST",
                        data: JSON.stringify({
                            groupName: groupName,
                            description: "",
                            groupMembers: groupMembersId.join(","),
                            membersName: groupMembersNameList.join(","),
                            departmentId: departmentId.join(",")
                        }),
                        url: serverAdress + "/seeyon/rest/uc/rong/groups/create",
                        success: function (msg) {
                            cmp.dialog.loading(false);

                            if(msg && msg.status === 'ok' && msg.code === '6110'){
                            // 创建\跳转到群组聊天窗口
                                cmp.chat.start({
                                    title: groupName,
                                    id: msg.groupId,
                                    type: 'group',
                                    success: function(){
                                        
                                    },
                                    error: function(){
                                        //进行错误处理
                                        if (msg && msg.code && msg.code == 501) {
                                            cmp.notification.alert(cmp.i18n("uc.m3.h5.maximumNumber")+ ': ' + ucCommon.ucGroupTotal + ','+cmp.i18n("uc.m3.h5.exceededMaximum"),function(){
                                                selectMember(memberData);
                                            },"",cmp.i18n("uc.m3.h5.ok"));
                                        } else {
                                            if (msg && msg.message) {
                                                cmp.notification.alert(msg.message,function(){
                                                    selectMember(memberData);
                                                },"",cmp.i18n("uc.m3.h5.ok"));
                                            } else {
                                                cmp.notification.alert(cmp.i18n("uc.m3.h5.failedCreateGroup"),function(){
                                                    selectMember(memberData);
                                                },"",cmp.i18n("uc.m3.h5.ok"));
                                            }
                                        }
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
                        error: function (msg) {
                            cmp.dialog.loading(false);
                            console.log(msg)
                            //进行错误处理
                            if (msg && msg.code && msg.code == 501) {
                                cmp.notification.alert(cmp.i18n("uc.m3.h5.maximumNumber")+ ': ' + ucCommon.ucGroupTotal + ','+cmp.i18n("uc.m3.h5.exceededMaximum"),function(){
                                    selectMember(memberData);
                                },"",cmp.i18n("uc.m3.h5.ok"));
                            } else {
                                if (msg && msg.message) {
                                    cmp.notification.alert(msg.message,function(){
                                        selectMember(memberData);
                                    },"",cmp.i18n("uc.m3.h5.ok"));
                                } else {
                                    cmp.notification.alert(cmp.i18n("uc.m3.h5.failedCreateGroup"),function(){
                                        selectMember(memberData);
                                    },"",cmp.i18n("uc.m3.h5.ok"));
                                }
                            }
                        }
                    })
                },
                error: function(error){
                    console.log(error)
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMaximum"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                }
            })
        }
    }, memberData)
}


// function pageSearch(modelId, params) {
//     var searchObj = [{
//         type: "text",
//         condition: "title",
//         text: "bbs.h5.title"//cmp.i18n("bbs.h5.title")
//     }, {
//         type: "text",
//         condition: "publishUser",
//         text: "bbs.h5.creater"//cmp.i18n("bbs.h5.creater")
//     }, {
//         type: "date",
//         condition: "publishDate",
//         text: "bbs.h5.dateTime"//cmp.i18n("bbs.h5.dateTime")
//     }];
//     cmp.search.init({
//         id: "#search",
//         model: {
//             name: "bbs",
//             id: modelId
//         },
//         parameter: params,
//         items: searchObj,
//         callback: function (result) { // 回调函数：会将输入的搜索条件和结果返回给开发者
//             if (!result.item) {
//                 page = {};
//             }
//             $("#CMP_SearchContent").hide();
//             var data = result.item; // 返回的搜索相关的数据
//             var condition = data.condition; // 返回的搜索条件
//             var dataSoure = ""; // 搜索输入的数据 如果type="text",为普通文本，如果type="date"
//             var type = data.type; // 搜索输入的数据类型有text和date两种
//             page["type"] = type;
//             page["text"] = data.text;
//             if (type == "date") {
//                 page["textfield1"] = result.searchKey[0];
//                 page["textfield2"] = result.searchKey[1];
//             } else {
//                 page["textfield1"] = result.searchKey[0];
//                 page["textHTML"] = result.searchKey[0];
//             }
//             page["condition"] = condition;

//             reloadPage();
//         }
//     });
// }