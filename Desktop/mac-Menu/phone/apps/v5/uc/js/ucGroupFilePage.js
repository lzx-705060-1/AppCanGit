var $UcGroupFile = {};
$UcGroupFile.groupId = cmp.href.getParam().groupId;
$UcGroupFile.adminId = cmp.href.getParam().adminId;
$UcGroupFile.deleteList = [];
var serverAdress = uc.getCurServerInfo().serverurl;
if($UcGroupFile.adminId == uc.userInfo.getId()){
  document.getElementById("edit").className = "nav-text"
}
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

  document.getElementById("edit").addEventListener("tap",function () {
    var list = cmp('.cmp-checkbox>.checkbox');
    if(this.innerHTML == cmp.i18n("uc.m3.h5.management")){
      this.innerHTML = cmp.i18n("uc.m3.h5.cancel");
      document.getElementById("delete").className = ""
      for (var i= list.length-1;i>=0;i--){
        list[i].className = 'checkbox';
      }
    }else{
      this.innerHTML = cmp.i18n("uc.m3.h5.management");
      document.getElementById("delete").className = "display_none"
      for (var i= list.length-1;i>=0;i--){
        list[i].className = "checkbox display_none";
      }
    }
  })

  //删除
  document.getElementById('delete').addEventListener('tap',function () {
    $UcGroupFile.deleteList = [];
    var list = cmp('.cmp-checkbox>.checkbox');
    for(var i=list.length-1;i>=0;i--){
      if(list[i].checked){
        $UcGroupFile.deleteList.push(list[i].getAttribute('data-id'));
      }
    }
    if($UcGroupFile.deleteList.length == 0){
      cmp.notification.toast(cmp.i18n("uc.m3.h5.selectFile"),"center",2000);
      return false;
    }
    cmp.notification.confirm(cmp.i18n("uc.m3.h5.deleteGroupFile"),function(index){
      if(index == 0){

      }else if(index == 1){
        //点击了第二个按钮
        cmp.ajax({
          type: "GET",
          url: serverAdress + "/seeyon/rest/uc/rong/groups/removeFile/"+$UcGroupFile.deleteList.join(',')+"?groupId="+$UcGroupFile.groupId,
          success: function (msg) {
            location.reload()
          },
          error: function (msg) {
            console.log(msg)
            //进行错误处理
          }
        })
      }
    },"",[cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")],false,0);

  })
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
        for(var i = 0;i <list;i++){
          var file = data[i];
          if(file.id != ""){
            var fileId = file.fi;
            var fileName = file.fn;
            $UcGroupFile.date = file.ud;
            var time = new Date(parseFloat(file.ud)).Format("yyyy年MM月dd日 hh时mm分")
            var fileSize = bytesToSize(file.fs);
            var fileType = fileName.substring(fileName.lastIndexOf(".") + 1,fileName.length).toLowerCase();
            var fileIcon = showDocIcon(fileType);
            var pendingTPL = document.getElementById("file_list_tpl").innerHTML;
            var sendName = (file.mi == uc.userInfo.getId()?cmp.i18n("uc.m3.h5.me"):file.mN);
            var result = {
              fileId : fileId,
              fileIcon : fileIcon,
              fileName : fileName,
              time : time,
              fileSize : fileSize,
              sendName: sendName,
              fileDate: file.ud,
              bytes: file.fs
            };
            var html = cmp.tpl(pendingTPL, result);
            if(document.getElementById("edit").innerHTML == cmp.i18n("uc.m3.h5.cancel")){
              setTimeout(function () {
                var check = cmp('.cmp-checkbox>.checkbox');
                for (var i= check.length-1;i>=0;i--){
                  check[i].className = 'checkbox';
                }
              },300);
            }
            fileUl.innerHTML += html;
            fileIdList.push(fileId);
          }
        }
        getName(idList,fileIdList);
      },
      dataFunc: function(params,option){
        var pageNo = params["pageNo"];
        cmp.ajax({
          type: "GET",
          url: serverAdress + "/seeyon/rest/attachment/reference/" + $UcGroupFile.groupId+"?pageNo="+pageNo+"&pageSize=20&type=0&option.n_a_s=1&ucFlag=yes",
          success: function (msg) {
            console.log(msg);
            var data = {
              data:msg,
              total:msg.length>=20?21:19
            }
            option.success(data);
          },
          error: function (msg) {
            console.log(msg)
            //进行错误处理
          }
        })
        /*ucGroupApi.getGroupFiles(cmp.member.id,$UcGroupFile.params.groupId,function(r){
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
        });*/
      },
      isClear: true
    },
    down: {
      contentdown: cmp.i18n("uc.m3.h5.pullDownToRefresh"),
      contentover: cmp.i18n("uc.m3.h5.releaseTheRefresh"),
      contentrefresh: cmp.i18n("uc.m3.h5.loosenRefresh")
    },
    up: {
      contentdown: "",
      contentrefresh: "",
      contentnomore: cmp.i18n("uc.m3.h5.noMore")
    }
  });
}
$UcGroupFile.clickFile = function(){
  cmp("#g_file").on('tap', "div.cmp-media-body", function(e) {
    var param = {};
    param.fileId = this.getAttribute('id');
    param.fileName =  this.querySelector(".uc-title-l").innerHTML;
    param.fileSize = this.getAttribute('data-size');
    param.fileType = param.fileName.substring(param.fileName.lastIndexOf(".") + 1,param.fileName.length).toLowerCase();
    param.fileTime = this.querySelector(".uc-date.cmp-pull-left").innerHTML;
    param.data = this.getAttribute('data-date');
    /*cmp.href.next(ucPath + "/html/ucReadFile.html", param, {
      animated : true,
      direction : "left"
    });*/

    var downloadUrl = serverAdress + "/seeyon/rest/attachment/file/"+param.fileId+"?ucFlag=yes";
    cmp.att.read({
      path : downloadUrl,
      filename : param.fileName,
      fileId : param.fileId,
      type:param.fileType,
      size:param.fileSize,
      extData : {
        lastModified:param.data,
        editable:true,
        autoSave:true,
        autoOpen:true
      },
      openFile:true,
      success:function(result){
        console.log(result)
      },
      error:function(error){
        if(error.code == "17003"){
          cmp.notification.toast(error.message);
        }
      }
    });
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

function bytesToSize(bytes) {
  if (bytes == 0) return '0 B';

  var k = 1024;

  sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseInt((bytes / Math.pow(k, i))) + ' ' + sizes[i];
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
