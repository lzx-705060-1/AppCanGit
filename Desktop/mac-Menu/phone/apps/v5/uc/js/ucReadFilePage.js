var $UcReadFile = {
  fileInfo : cmp.href.getParam(),
  dlPage : document.querySelector(".downloadFile"),
  openFile : document.querySelector(".openFile"),
  footer : document.querySelector(".cmp-bar-footer")
};
var serverAdress = uc.getCurServerInfo().serverurl;
cmp.ready(function() {
  // 获取ip
  cmp.chat.chatInfo({success:function(result){
      $UcReadFile.uc_url = result.ip;
  },error:function(error){}});
  cmp.listView("#readFile", {});
  initStyle();
  initEvent();
  initDownloadFile($UcReadFile.fileInfo);
  // cmp.os.ios && $("#share").hide();
});
// 显示下载文件的信息
function initStyle(){
  var fileName = $UcReadFile.fileInfo.fileName;
  var fileSize = $UcReadFile.fileInfo.fileSize;
  var df = document.querySelector(".downloadFile");
  df.querySelector(".fileIcon").className += " " + showDocIcon($UcReadFile.fileInfo.fileType);
  df.querySelector(".file_title").innerHTML = fileName;
  df.querySelector(".file_size").innerHTML = fileSize;

  var of = document.querySelector(".openFile");
  of.querySelector(".fileIcon").className += " " + showDocIcon($UcReadFile.fileInfo.fileType);
  of.querySelector(".file_title").innerHTML = fileName;
  of.querySelector(".file_size").innerHTML = fileSize;
}
//初始化页面事件
function initEvent(){
  document.getElementById("prev").addEventListener("tap",function(){
    cmp.href.back(1,{data:{isComplete:$UcReadFile.isComplete}});
  });
  share();
}
// 下载文件
function initDownloadFile(fileInfo){
  var fileId = fileInfo.fileId;
  var fileName = fileInfo.fileName;
  cmp('.downloadFile')[0].style.display="block"
  // chatFileDownload.getDownloadUrl(cmp.member.id, fileId, "filetrans", function(d){
  //   var obj = getIqXml(d);
  //   var xmlType = obj.xmlDoc.getElementsByTagName("iq")[0].getAttribute("type");
  //   if(xmlType == "result"){
  //     hiddenOpenFliePage();
  //     showDownloadPage();
  //     var downloadurl = getImgPath(obj.xmlDoc,$UcReadFile.uc_url);
  var downloadurl = serverAdress + "/seeyon/rest/attachment/file/"+fileId+"?ucFlag=yes";
      console.log({fileId : fileId,
        lastModified : "1505126075000",
        origin : cmp.serverIp})
      cmp.att.download({
        url : downloadurl,
        title : fileName,
        extData : {
          fileId : fileId,
          lastModified : "1505126075000",
          origin : cmp.serverIp
        },
        progress:function(result){
          console.log(result);

        },
        success:function(result){
          // 进度条，因为下载组件没有进度条的回调方法，只好模拟显示进度。
          if(result.isDownloaded){
            downloadFinsh(result,fileId)
          }else{
            if(result.pos == 1){
              intprogress(result,fileId);
            }
          }
        },
        error:function(error){
          // var msg = eval('(' + error.message + ')');
          if(error.code == "-1001"){
            cmp.notification.toast(error.message);
          }
        }
      });
  //   }
  // },function(data){
  //   if(data.code == "36005"){
  //       cmp.notification.alert(data.message,function(){
  //           cmp.href.closePage();
  //       },"","确定");
  //   }
  // });
}
// 读取文件
function initReadFile(fileInfo){
  cmp.att.read({
    path : fileInfo.filePath,
    filename : fileInfo.fileName,
    edit : false,
    extData : {
      fileId : fileInfo.fileId,
      lastModified : new Date(),
      origin : cmp.serverIp
    },
    success:function(result){
    },
    error:function(error){
      if(error.code == "17003"){
        cmp.notification.toast(error.message);
      }
    }
  });
}
// 显示下载页面
function showDownloadPage(){
  $UcReadFile.dlPage.style.display = "block";
}
// 显示打开文件页面
function showOpenFliePage(){
  $UcReadFile.openFile.style.display = "block";
  $UcReadFile.footer.style.display = "block";
}
// 隐藏下载页面
function hiddenDownloadPage(){
  $UcReadFile.dlPage.style.display = "none";
}
// 隐藏打开文件页面
function hiddenOpenFliePage(){
  $UcReadFile.openFile.style.display = "none";
  $UcReadFile.footer.style.display = "none";
}
function share(){
  cmp("header").on('tap', "#share", function(e) {
    // TODO：分享参数后续需要完善，目前只是调用了分享组件
    cmp.share({
      title:"分享内容显示的标题",
      text:"分享内容显示的内容",
      url:"http://www.baidu.com",//点击链接地址
      imgUrl:"http://ddddd.png",//需要显示的图片地址
      success:function(networkDetail){//成功后回调
        
      },
      error:function(error){
        
      }
    });
  });
}
// 显示进度条
function intprogress(result,fileId){
    var lineProgress = document.querySelector('.line-progress-number');
    var proNumber = lineProgress.querySelector('span');
    var proBlue = document.querySelector('.line-pro-blue');
    var k = 0;
    if(proNumber){
        var t = setInterval(function(){
            var num = parseInt(proNumber.innerHTML) * 2;
            k = k + 1;
            proNumber.innerHTML = k;
            if(k >= 101){
                clearInterval(t);
                proNumber.innerHTML = k - 1;
            }
            proBlue.style.width = num + "px";
            if(num == 200){
              downloadFinsh(result,fileId)
            }
        },50);
    }
}

function downloadFinsh(result,fileId) {
  hiddenDownloadPage();
  showOpenFliePage();
  var data = {};
  data.fileId = fileId;
  data.filePath = "file://" + result.target;
  data.fileName = data.filePath.substring(data.filePath.lastIndexOf("/") + 1,data.filePath.length).toLowerCase();
  cmp("footer").on('tap', "#openfile", function(e) {
    initReadFile(data);
  });
}
