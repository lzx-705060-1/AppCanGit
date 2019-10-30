var $UcGroupFile = {};
cmp.ready(function() {
  $UcGroupFile.params = cmp.href.getParam();
  $UcGroupFile.initData();
  $UcGroupFile.initEvent();
});
//初始化页面事件
$UcGroupFile.initEvent = function(){
  back("#prev");
  cmp.backbutton();
  cmp.backbutton.push(function(){
      if(location.search.indexOf("?") != -1){
        cmp.href.close();
      }else{
        cmp.href.back();
      }
  });
  $UcGroupFile.clickFile();
}
//初始化页面数据
$UcGroupFile.initData = function(){
  cmp.listView("#g_file", {
    config: {
      captionType:0,
      height: 60,
      params: {} ,
      renderFunc: function(data,isRefresh){
        var fileUl = document.getElementById("file_list");
        if(isRefresh){
          fileUl.innerHTML = "";
        }
        var list = data.length;
        var idList = [];
        var fileIdList = [];
        for(var i = list - 1;i >= 0;i--){
          var file = data[i];
          var jid = file.getAttribute("J").indexOf("@") != -1 ? file.getAttribute("J").split("@")[0] : "";
          if(jid != ""){
            var fileId = file.getAttribute("I");
            var fileName = file.getAttribute("N");
            var time = returnTime(file.getAttribute("T"));
            var fileSize = (file.getAttribute("FS") != "") ? bytesToSize(file.getAttribute("FS")) : "";
            var fileType = fileName.substring(fileName.lastIndexOf(".") + 1,fileName.length).toLowerCase();
            var fileIcon = showDocIcon(fileType);
            var pendingTPL = document.getElementById("file_list_tpl").innerHTML;
            var result = {
              fileId : fileId,
              fileIcon : fileIcon,
              fileName : fileName,
              time : time,
              fileSize : fileSize
            };
            var html = cmp.tpl(pendingTPL, result);
            fileUl.innerHTML += html;
            idList.push(jid);
            fileIdList.push(fileId);
          }
        }
        getName(idList,fileIdList);
      },
      dataFunc: function(params,option){ 
        ucGroupApi.getGroupFiles(cmp.member.id,$UcGroupFile.params.groupId,function(r){
          var obj = getIqXml(r);
          var fileList = obj.xmlDoc.getElementsByTagName("file");
          var listData = {};
          listData.data = fileList;
          listData.total = fileList.length;
          option.success(listData);
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
      contentrefresh: "松开刷新"
    },
    up: {
      contentdown: "",
      contentrefresh: "",
      contentnomore: "没有更多"
    }
  });
}
$UcGroupFile.clickFile = function(){
  cmp("#g_file").on('tap', "li", function(e) {
    var param = {};
    param.fileId = this.getAttribute("id");
    param.fileName = this.querySelector(".uc-title-l").innerText;
    param.fileSize = this.querySelector(".file_size").innerHTML;
    param.fileType = param.fileName.substring(param.fileName.lastIndexOf(".") + 1,param.fileName.length).toLowerCase();
    // 点击人名，跳转到当前人发送的所有文件列表
    if(e.target.className.indexOf("user_name") > -1){
      cmp.href.next(ucPath + "/html/ucGroupFile.html", param, {
        animated : true,
        direction : "left"
      });
    }else{// 群文件列表跳转
      cmp.href.next(ucPath + "/html/ucReadFile.html", param, {
        animated : true,
        direction : "left"
      });
    }
  });
}
function getName(memberIdList,fileIdList){
    getPeopleNameList(memberIdList,function (imgMap) {
        for(var imgKey in imgMap){
            for(var headId in imgMap[imgKey]){
                var nameDom = document.getElementById("n_" + fileIdList[imgKey]);
                if(nameDom){
                    nameDom.innerHTML = imgMap[imgKey][headId].name;
                }
            }
        }
    });
}
