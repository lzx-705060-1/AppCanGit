cmp.ready(function() {
  var noticeEle = document.getElementById("noticeInfo");
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
    if(params.n_info.replace(/<br\/>/g,"\n").replace(/&nbsp;/g," ") == e.value){
      cmp.href.back();
    }else{
      cmp.notification.confirm("是否放弃修改？", function (index) {
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
  e.value = params.n_info.replace(/<br\/>/g,"\n").replace(/&nbsp;/g," ");
}
// 修改群公告
function editNotice(e){
  document.getElementById("send").addEventListener("tap", function(){
    var content = e.value.replace(/\n/g,"<br/>").replace(/\s/g,"&nbsp;");
    var noticeId = "";
    if(params.noticeId != ""){
      noticeId = params.noticeId;
    }
    ucGroupApi.editGroupNotice(
      cmp.member.id,
      params.groupId,
      noticeId,
      content,
      function(data){
        var domParser = new DOMParser();
        var xmlDoc = domParser.parseFromString(data, 'text/xml');
        var iq = xmlDoc.getElementsByTagName("iq")[0];
        var xmlType = iq.getAttribute("type");
        if(xmlType == "result"){
          // 取到新的公告内容
          var newNotice = iq.getElementsByTagName("notice")[0].getAttribute("V");
          var param = {"data" : {
              groupId : params.groupId,
              groupName : params.groupName,
              noticeId : params.noticeId,
              isAdmin : params.isAdmin,
              gNotice : newNotice
          }};
          cmp.href.back(1,param);
        }
      },
      function(data){
          if(data.code == "36005"){
              cmp.notification.alert(data.message,function(){
                  cmp.href.closePage();
              },"","确定");
          }
      }
    );
  });
}