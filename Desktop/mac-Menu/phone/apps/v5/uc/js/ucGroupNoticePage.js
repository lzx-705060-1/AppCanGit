var serverAdress = uc.getCurServerInfo().serverurl;
var $UcGroupNotice = {
  params : null
};
cmp.ready(function() {
  if(cmp.href.getBackParam()){
    $UcGroupNotice.params = cmp.href.getBackParam();
  }else{
    $UcGroupNotice.params = cmp.href.getParam();
  }

  cmp.listView("#g_notice", {});
  // 返回
  backPage();

  // 展现群公告
  showGroupNotice();
  editNotice();
  clearNotice();
});
function backPage(){
  document.getElementById("prev").addEventListener("tap", function(){
    cmp.href.back();
  });
  cmp.backbutton();
  cmp.backbutton.push(function(){
    if(location.search.indexOf("?") != -1){
      cmp.href.close();
    }else{
      cmp.href.back();
    }
  });
}
function showGroupNotice(){
  cmp.dialog.loading();
  cmp.ajax({
      type: "GET",
      url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + $UcGroupNotice.params.groupId,
      success: function (msg) {
        cmp.dialog.loading(false);
        var groupInfo = msg.group;
        if(groupInfo != null && groupInfo != undefined){
          var c_height = (parseInt(document.getElementById("cmp-control").style.height) - 26) + "px";
          var gNo = groupInfo.b;
          var g_notice_box = document.getElementById('g_notice');
          var n_edit = document.getElementById("edit");
          var n_info = document.querySelector(".n_info");
          var n_info_mask = document.querySelector(".n_info_mask");
          var n_clearNotice_btn = document.querySelector(".uc-group-clearNotice-btn");
          if ($UcGroupNotice.params.isAdmin) {
            c_height = (parseInt(document.getElementById("cmp-control").style.height) - 56) + "px";
            // n_clearNotice_btn.style.display = 'block';
            n_edit.style.display = 'block';
          }
          if(gNo == ""){
            $UcGroupNotice.params.isAdmin && (n_clearNotice_btn.style.display = 'none');
            n_info.style.display = "block";
            n_info_mask.style.display = "block";
            g_notice_box.style.height = c_height;
            cmp.dialog.loading({
              status: "nocontent",
              text: cmp.i18n("uc.m3.h5.noData")
            });
          }else if (gNo) {
            $UcGroupNotice.params.isAdmin && (n_clearNotice_btn.style.display = 'block');
            n_info.style.display = "block";
            n_info_mask.style.display = "block";
            g_notice_box.style.height = c_height;
            n_info.innerHTML = gNo.escapeHTML();
          } 
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

//
function editNotice(){
  if($UcGroupNotice.params.isAdmin){
    document.getElementById("edit").className = "cmp-icon iconfont cmp-pull-right icon-uc-plan";
    cmp("header").on("tap","#edit",function(e){
      var param = {
        groupId : $UcGroupNotice.params.groupId,
        groupName : $UcGroupNotice.params.groupName,
        isAdmin : $UcGroupNotice.params.isAdmin,
        n_info : $UcGroupNotice.params.gNotice
      };
      cmp.href.next(ucPath + "/html/ucGroupNoticeEditPage.html", param, {
        animated : true,
        direction : "left"
      });
    });
  }
}

//
function clearNotice () {
  if ($UcGroupNotice.params.isAdmin) {
    cmp("#cmp-control").on("tap",".uc-group-clearNotice-btn",function(){
      var that = this;
      cmp.notification.confirm(cmp.i18n("uc.m3.h5.confirmClearGroupBulletin"), function (index) {
          if (index == 1) {
            cmp.dialog.loading();
            cmp.ajax({
              type: "POST",
              data: JSON.stringify({
                groupId: $UcGroupNotice.params.groupId,
                bulletin: ""
              }),
              url: serverAdress + "/seeyon/rest/uc/rong/groups/update",
              success: function (msg) {
                cmp.dialog.loading(false);
                console.log(msg)
                document.querySelector(".n_info").innerHTML = "";
                that.style.display = "none";
              },
              error: function (msg) {
                cmp.dialog.loading(false);
                console.log(msg)
                //进行错误处理
                if (msg && msg.message) {
                  cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
                } else {
                  cmp.notification.alert(cmp.i18n("uc.m3.h5.clearGroupBulletinFailed"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                }
              }
            });
            // document.querySelector(".n_info").value = "";
          }
      });
    })
  }
}
