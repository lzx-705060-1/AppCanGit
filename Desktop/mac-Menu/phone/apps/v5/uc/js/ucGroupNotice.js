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
  cmp.listView("#g_notice", {
    config: {
      captionType:0,
      height: 60,
      params: {} ,
      renderFunc: function(result,isRefresh){
        var groupInfo = result
        var c_height = (parseInt(document.getElementById("cmp-control").style.height) - 26) + "px";
        var gNo = groupInfo[0].getAttribute("NO");
        var n_info = document.querySelector(".n_info");
        var n_info_mask = document.querySelector(".n_info_mask");
        if(groupInfo != null && groupInfo.length > 0){
            n_info.style.display = "block";
            n_info_mask.style.display = "block";
            n_info.style.height = c_height;
            n_info.innerHTML = gNo.replace(/<br\/>/g,"\n").replace(/&nbsp;/g," ");
        } else {
          n_info.style.display = "none";
          n_info_mask.style.display = "block";
          n_info.style.height = c_height;
        }
      },
      dataFunc: function(params,option){ 
        ucGroupApi.groupInfo(cmp.member.id,$UcGroupNotice.params.groupId,$UcGroupNotice.params.groupName,function(result){
          var domParser = new DOMParser();
          var xmlDoc = domParser.parseFromString(result, 'text/xml');
          var groupInfo = xmlDoc.getElementsByTagName("group_info");
          var notice = groupInfo[0].getAttribute("NO");
          if (notice) {
            var listDate = {
              data:groupInfo
            }
          } else {
            var listDate = {
              data:[]
            }
          }
          option.success(listDate);
        },function(data){
          if(data.code == "36005"){
              cmp.notification.alert(data.message,function(){
                  cmp.href.closePage();
              },"","确定");
          }
        });
      },
      isClear: true
    },
    down: {
      contentdown: "下拉刷新",
      contentover: "释放刷新",
      contentrefresh: ""
    },
    up: {
      contentdown: "加载更多",
      contentrefresh: "加载更多",
      contentnomore: "没有更多"
    }
  });
}
function editNotice(){
  if($UcGroupNotice.params.isAdmin){
    document.getElementById("edit").className = "cmp-icon iconfont cmp-pull-right icon-edit";
    cmp("header").on("tap","#edit",function(e){
      var param = {
        groupId : $UcGroupNotice.params.groupId,
        groupName : $UcGroupNotice.params.groupName,
        isAdmin : $UcGroupNotice.params.isAdmin,
        noticeId : $UcGroupNotice.params.noticeId,
        n_info : $UcGroupNotice.params.gNotice
      };
      cmp.href.next(ucPath + "/html/ucGroupNoticeEdit.html", param, {
        animated : true,
        direction : "left"
      });
    });
  }
}