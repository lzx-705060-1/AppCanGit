var serverAdress = uc.getCurServerInfo().serverurl;
var bulletin = "";
cmp.ready(function() {
  var noticeEle = document.getElementById("noticeInfo");
  noticeEle.setAttribute('placeholder', cmp.i18n("uc.m3.h5.enterText"));
  cmp.HeaderFixed(document.getElementById("header"),noticeEle);
  params = cmp.href.getParam();
  cmp.listView("#g_notice", {});
  // 返回
  backPage(noticeEle);
  // 初始化群公告面板高度
  initHeight(noticeEle);
  changeHeight(noticeEle);
  // 初始化群公告内容
  initInfo(noticeEle);
  // 确定按钮
  editNotice(noticeEle);
});
function backPage(e){
  document.getElementById("prev").addEventListener("tap", function(){
    var content = e.value.replace(/\s*$/g,"");
    if(content == bulletin){
      cmp.href.back();
    }else{
      cmp.notification.confirm(cmp.i18n("uc.m3.h5.whetherGiveUpChange"), function (index) {
        if (index == 1) {
          cmp.href.back();
        }
      });
    }
  });
}
// 初始化群公告面板高度
function initHeight(e){
  e.style.height = (parseInt(document.getElementById("cmp-control").style.height) - 11) + "px";
}
// 调用键盘后，计算群公告的高度
function changeHeight(e){
  window.onresize = function(){
    e.style.height = (window.innerHeight - parseInt(document.getElementById("header").style.height) - parseInt(document.querySelector(".cmp-bar-footer").clientHeight) - 11) + "px";
  }
}
// 初始化群公告内容
function initInfo(e){
  cmp.dialog.loading();
  cmp.ajax({
    type: "GET",
    url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + params.groupId,
    success: function (msg) {
      cmp.dialog.loading(false);
      var groupInfo = msg.group;
      if (groupInfo != null && groupInfo != undefined) {
        bulletin = e.value = groupInfo.b.replace(/&nbsp;/g," ");
      } else if (!groupInfo) {
        bulletin = e.value = params.n_info.replace(/&nbsp;/g," ");
      }
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
        cmp.notification.alert(cmp.i18n("uc.m3.h5.groupBulletinFailedLoad"),function(){
          cmp.href.back();
        },"",cmp.i18n("uc.m3.h5.ok"));
      }
    }
  });
}
// 修改群公告
function editNotice(e){
  document.getElementById("send").addEventListener("tap", function(){
    var content = e.value.replace(/\s*$/g,"");
    if (content != bulletin) { // 如果公告内容有变化
      cmp.notification.confirm(cmp.i18n("uc.m3.h5.confirmRelease"), function (index) {
        if (index == 1) {
          cmp.dialog.loading();
          cmp.ajax({
            type: "POST",
            data: JSON.stringify({
              groupId: params.groupId,
              bulletin: content
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
              if (msg && msg.message) {
                cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
              } else {
                cmp.notification.alert(cmp.i18n("uc.m3.h5.modifyBulletinFailed"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
              }
            }
          });
        }
      });
    } else {
      cmp.notification.confirm(cmp.i18n("uc.m3.h5.bulletinUnmodified"), function (index) {
        if (index == 1) {
          cmp.href.back();
        }
      });
    }
    
  });
}