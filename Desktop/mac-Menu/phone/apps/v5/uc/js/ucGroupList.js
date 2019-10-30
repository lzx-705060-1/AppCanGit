var page = {};
cmp.ready(function() {
    // 获取群列表数据
    loadData();
    // 返回
    prevPage();
    // 创建群组
    createGroup();
});
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
    cmp.listView("#all_uc", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            pageSize: 999,
            params: {},
            crumbsID: "#all_uc" + cmp.buildUUID(),
            renderFunc: renderList,
            dataFunc: function(params,option){  //请求数据的函数
                ucGroupApi.groupList(cmp.member.id,function(result){
                    var domParser = new DOMParser();
                    var xmlDoc = domParser.parseFromString(result, 'text/xml');
                    var ms = xmlDoc.getElementsByTagName("group_info");
                    var listData = {
                        data : ms,
                        total : ms.length
                    };
                    $("#title").html("选择群组");
                    option.success(listData);
                },function(data){
                    if(data === null){
                        $("header").find("h1").text().indexOf("未连接") == -1 && $("header").find("h1").append("【未连接】");
                        option.success({data:[],total:0});
                    }
                    if(data && data.code == "36005"){
                        cmp.notification.alert(data.message,function(){
                            cmp.href.closePage();
                        },"","确定");
                    }
                });
            },
            isClear: true
        },
        down: {
            contentdown: "下拉刷新",//cmp.i18n("下拉刷新"),
            contentover: "释放刷新",//cmp.i18n("释放刷新"),
            contentrefresh: ""
        },
        up: {
            contentdown: "加载更多",//cmp.i18n("加载更多"),
            contentrefresh: "加载更多",//cmp.i18n("加载更多"),
            contentnomore: "没有更多"//cmp.i18n("没有更多")
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
    for(var i = result.length-1;i >= 0;i--){
        var groupInfoTag = result[i];
        var groupInfo = {
            id : groupInfoTag.getAttribute("I").split("@")[0],
            // name : groupInfoTag.getAttribute("NA"),
            num : groupInfoTag.getAttribute("M")
        };
        groupInfo.name=uc.htmlEncodeByRegExp(groupInfoTag.getAttribute("NA"));
        groupInfo.name = groupInfo.name.replace(/(^[&nbsp;]*)|([&nbsp;]*$)/g,"");
        groupInfo.src = cmp.serverIp + "/seeyon/rest/orgMember/groupavatar?groupId=" + groupInfo.id + "&groupName=" + encodeURI(encodeURI(groupInfo.name)) + "&maxWidth=200&ucFlag=yes";
        listHtml += cmp.tpl(tpl, groupInfo);
    }
    listUl.innerHTML += listHtml;
}

/**
 * 列表添加点击事件
 */
function addbbsDetailsHref() {
    cmp("#group_list").on('tap', "li", function (e) {
        var toId = this.getAttribute("id");
        var toName = this.getAttribute("data-toName");
        var param = {
            "toId" : toId,//对方聊天人的id
            "chatType" : "groupchat",//消息类型：单人聊天(chat)，群组聊天(groupchat)
            "toName" : toName//对方聊天人名字
        };
        
        var msgInfo=uc.initChatMessageToDate(toId,toName,'groupchat',toName);
        uc.db.insertUcIndexMsg(msgInfo,true, function(res){
            cmp.href.next(ucPath + "/html/ucGroupChatView.html", param,{
                animated : true,
                direction : "left"
            });
        });
    });
}
// 创建群组
function createGroup(){
    cmp("header").on("tap", "#create-group", function(e) {
        console.log(ucPath + "/html/ucCreateGroup.html")
        cmp.href.next(ucPath + "/html/ucCreateGroup.html", {
          animated : true,
          direction : "left"
        });
    });
}

uc.checkChatListener(function(data){
    if (data && data.networkActive) {
        if (data.networkActive == "false") {
            cmp.dialog.loading({
                status: "nonetwork",
                text:"<h5 style='color: #666;'>无法连接到网络</h5><small>当前网络不可用,请检查您的网络设备</small>",
                background:"#fff",
                callback: function(){
                    cmp.connection.getNetworkType({
                        success:function(networkState){
                            if (networkState != 'none') {
                                cmp.dialog.loading(false);
                                cmp.listView("#all_uc").refreshInitData(false);
                            }
                        }
                    })
                }
            });
        } else {
            cmp.notification.toast("服务器连接失败","center",2000);
        }
    } else if (data && !data.networkActive) {
        cmp.notification.toast("连接失败","center",2000);
    }
})
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