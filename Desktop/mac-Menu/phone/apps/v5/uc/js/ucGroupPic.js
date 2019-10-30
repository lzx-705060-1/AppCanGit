var $UcGroupPic = {
  imgDomList : [],
  doneCount : 0
};
cmp.ready(function() {
  // 获取ip
  cmp.chat.chatInfo({success:function(result){
      $UcGroupPic.uc_url = result.ip;
  },error:function(error){}});

  $UcGroupPic.params = cmp.href.getParam();
  // 返回
  back("#prev");
  // 物理返回
  document.addEventListener("backbutton",function(){
    if($(".cmp-sliders-basicDiv").hasClass('cmp-sliders-div-show')){
      cmp.sliders.close();
    }else{
     cmp.href.back();
    }
  });

  $UcGroupPic.showPic();
});
// 显示图片
$UcGroupPic.showPic = function(){
  cmp.listView("#g_pic_list", {
    config: {
      captionType:0,
      height: 60,
      params: {} ,
      renderFunc: function(data,isRefresh){
        var picUl = document.getElementById("pic_list");
        if(isRefresh){
            picUl.innerHTML = "";
        }
        var list = data.length;
        for(var i = list - 1;i >= 0;i--){
          var pic = data[i];
          var _id = pic.getElementsByTagName("id")[0].innerHTML;
          var picId = (_id.indexOf("_1") == -1) ? (_id + "_1") : _id;
          var pendingTPL = document.getElementById("pic_list_tpl").innerHTML;
          var result = {};
          result.id = picId;
          var html = cmp.tpl(pendingTPL, result);
          var picDom = parseDom(html)[0];
          picUl.appendChild(picDom);
          $UcGroupPic.initPicSize();
        }
        var imgList = picUl.querySelectorAll(".groupImg");
        var imgLen = imgList.length;
        for (var i = 0; i < imgLen; i++) {
            var imgDom = imgList[imgLen - 1 - i];
            if (imgDom.getAttribute("imgLoad") == "false") {
                $UcGroupPic.imgDomList.push(imgDom);
            } else {
                break;
            }
        }
        initImg();
      },
      dataFunc: function(params,option){ 
        ucGroupApi.getGroupPic(cmp.member.id,$UcGroupPic.params.groupId,function(r){
            var obj = getIqXml(r);
            var picList = obj.xmlDoc.getElementsByTagName("picture");
            var listData = {};
            listData.data = picList;
            listData.total = picList.length;
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
      contentrefresh: ""
    },
    up: {
      contentdown: "加载更多",
      contentrefresh: "加载更多",
      contentnomore: "没有更多"
    }
  });
}
$UcGroupPic.initPicSize = function(){
  var picList = document.querySelectorAll(".g_pic");
  if(picList.length > 0){
    var m = document.defaultView.getComputedStyle(picList[0], null);
    var mr = Number(m.marginRight.substring(0,m.marginRight.indexOf('px'))) * 3;
    var screenW = parseInt((window.screen.width - mr) / 4);
    for(var i = 0;i < picList.length;i++){
      var picLi = picList[i];
      if(i % 4 == 3){
        picLi.style.marginRight = "0";
      }
      picLi.style.width = screenW + "px";
      picLi.style.height = screenW + "px";
      picLi.style.lineHeight = screenW + "px";

      var img = picList[i].querySelector("img");
      // img.style.width = screenW + "px";
      img.style.display = "block";
    }
    //绑定点击大图事件
    cmp("#g_pic_list").on("tap","img",showBigPic);
  }
}
function initImg(){
    if($UcGroupPic.doneCount >= $UcGroupPic.imgDomList.length){
        return;
    }
    var nowDom = $UcGroupPic.imgDomList[$UcGroupPic.doneCount];
    var nowId = nowDom.getAttribute("imgid");
    nowDom.style.display = "block";
    chatFileDownload.getDownloadUrl(cmp.member.id, nowId, "image", function(d){
        document.querySelector(".default"+nowId).style.display = "none";
        $UcGroupPic.doneCount++;
        var obj = getIqXml(d);
        var xmlType = obj.xmlDoc.getElementsByTagName("iq")[0].getAttribute("type");
        if (xmlType == "result") {
            var url = getImgPath(obj.xmlDoc,$UcGroupPic.uc_url);
            nowDom.setAttribute("src",url);
            nowDom.setAttribute("imgLoad","true");
            var screenW = parseInt(nowDom.parentNode.style.width);
            nowDom.onload = function () {
              if(nowDom.clientHeight < nowDom.clientWidth){
                nowDom.style.height = screenW + "px";
                picPos(nowDom,"center");//当前图片水平居中
              }else{
                nowDom.style.width = screenW + "px";
                picPos(nowDom,"vertical");//当前图片垂直居中
              }
            }
        }
        initImg();
    },function(data){
      if(data.code == "36005"){
          cmp.notification.alert(data.message,function(){
              cmp.href.closePage();
          },"","确定");
      }
    });
}
/*
  picPos : 图片定位显示的方法
  dom : 需要定位的图片
  type : 定位类型。center是水平居中；vertical是垂直居中
*/
function picPos (dom,type) {
  if (dom && type) {
    if (type == "center") {
      dom.style.top = "0px";
      dom.style.left = "50%";
      dom.style.transform = "translateX(-50%)";
    } else if (type == "vertical") {
      dom.style.left = "0px";
      dom.style.top = "50%";
      dom.style.transform = "translateY(-50%)";
    }
  } else {
    console.log("picPos方法调用传参错误");
  }
}
function showBigPic () {
    $UcGroupPic.imgUrlList = [];
    var allImgs = document.querySelector("#pic_list").querySelectorAll(".g_pic > img");
    for(var i = 0,len = allImgs.length;i < len; i ++) {
        allImgs[i].setAttribute("img-index", i);
    }
    var mid = this.getAttribute("imgid");
    mid = mid.indexOf("_1") != -1 ? mid.split("_")[0] : mid; 
    getImgUrl(mid);
    setTimeout(function(){
        cmp.sliders.addNew($UcGroupPic.imgUrlList);
        cmp.sliders.detect(0);
    },500);
}
function getImgUrl (imgId){
    chatFileDownload.getDownloadUrl(cmp.member.id, imgId, "image", function (result) {
        var obj = getIqXml(result);
        var xmlType = obj.xmlDoc.getElementsByTagName("iq")[0].getAttribute("type");
        if (xmlType == "result") {
            var url = getImgPath(obj.xmlDoc,$UcGroupPic.uc_url);
            $UcGroupPic.imgUrlList.push(url);
        }
    },function(data){
        if(data.code == "36005"){
            cmp.notification.alert(data.message,function(){
                cmp.href.closePage();
            },"","确定");
        }
    });
}