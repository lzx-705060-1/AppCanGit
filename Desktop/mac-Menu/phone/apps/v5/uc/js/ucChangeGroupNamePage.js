var serverAdress = uc.getCurServerInfo().serverurl;
var params = {}, count = null;
cmp.ready(function() {
    params = cmp.href.getParam();
    cmp.listView("#changeName", {});
    //返回
    back();
    cmp.backbutton();
    cmp.backbutton.push(function(){
        if(location.search.indexOf("?") != -1){
            cmp.href.close();
        }else{
            cmp.href.back();
        }
    });
    countDom = document.querySelector(".uc-group-name-count");
    // 显示群名称
    showGroupName();
    // 点击确定按钮
    confirm();
});
function back(){
  document.getElementById("prev").addEventListener("tap", function(){
    cmp.href.back();
  });
}
// 初始化清空群组名称
function initClearBtn(e){
    countDom.innerHTML = 30 - e.value.length;
    var _self = e;
    var clear = _self.nextElementSibling;
    if(_self.value != ""){
        clear.style.display = "block";
        clear.addEventListener("click", function() {
            clear.style.display = "none";
            _self.value = "";
            _self.placeholder = cmp.i18n("uc.m3.h5.enterGroupName");
            _self.focus();
        });
    }else{
        clear.style.display = "none";
    }
}

function showGroupName(){
    var gn = document.getElementById("uc-group-name");
    gn.setAttribute('placeholder', cmp.i18n("uc.m3.h5.enterGroupName"));
    cmp.dialog.loading();
    cmp.ajax({
        type: "GET",
        url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + params.groupId,
        success: function (msg) {
            cmp.dialog.loading(false);
            var groupInfo = msg.group;
            gn.value = (groupInfo.n ? groupInfo.n : params.groupName);
            gn.placeholder = "";
            // gn.focus();
        },
        error: function (msg) {
            cmp.dialog.loading(false);
            console.log(msg)
            //进行错误处理
            if (msg && msg.message) {
                cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
            } else {
                cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetGroupName"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
            }
        }
    })
    // gn.focus();
}

function confirm(){
    document.querySelector(".uc-confirm").addEventListener("click",function(){
        var newGroupName = document.getElementById("uc-group-name").value.replace(/(^\s*)|(\s*$)/g,"");
        if (newGroupName) {
            cmp.notification.confirm(cmp.i18n("uc.m3.h5.areYouSureToSave"), function (index) {
                if (index == 1) {
                    cmp.dialog.loading(false);
                    cmp.ajax({
                        type: "POST",
                        data: JSON.stringify({
                            groupId:params.groupId,
                            groupName:newGroupName
                        }),
                        url: serverAdress + "/seeyon/rest/uc/rong/groups/update",
                        success: function (msg) {
                            cmp.dialog.loading(false);
                            console.log(msg)
                            cmp.href.back();
                        },
                        error: function (msg) {
                            cmp.dialog.loading(false);
                            console.log(msg)
                            //进行错误处理
                            /*if (msg && msg.message) {
                                cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
                            } else {*/
                                cmp.notification.alert(cmp.i18n("uc.m3.h5.groupNameFailed"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                            // }
                        }
                    })
                }
            });
            
        } else {
            cmp.notification.alert(cmp.i18n("uc.m3.h5.groupNameNotBeEmpty"),function(){
                document.getElementById("uc-group-name").focus();
            },"",cmp.i18n("uc.m3.h5.ok"));
        }
    });
}
