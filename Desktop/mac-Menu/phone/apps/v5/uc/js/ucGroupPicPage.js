var $UcGroupPic = {
  imgDomList : [],
  doneCount : 0,
  groupId:  cmp.href.getParam().groupId,
    deleteList:[],
    adminId : cmp.href.getParam().adminId
};
var serverAddress = uc.getCurServerInfo().serverurl;
if($UcGroupPic.adminId == uc.userInfo.getId()){
//    document.getElementById("edit").className = "nav-text"
}
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

    /*document.getElementById("edit").addEventListener("tap",function () {
        var list = cmp('.cmp-checkbox>.checkbox');
        if(this.innerHTML == "选择"){
            this.innerHTML = '取消';
            document.getElementById("delete").className = ""
            for (var i= list.length-1;i>=0;i--){
                list[i].className = 'checkbox';
            }
        }else{
            this.innerHTML = '选择';
            document.getElementById("delete").className = "display_none"
            for (var i= list.length-1;i>=0;i--){
                list[i].checked=false;
                list[i].className = "checkbox display_none";
            }
        }
    })

    //删除
    document.getElementById('delete').addEventListener('tap',function () {
        $UcGroupPic.deleteList = [];
        var list = cmp('.cmp-checkbox>.checkbox');
        for(var i=list.length-1;i>=0;i--){
            if(list[i].checked){
                $UcGroupPic.deleteList.push(list[i].getAttribute('data-id'));
            }
        }
        if($UcGroupPic.deleteList.length == 0){
            cmp.notification.toast("请选择群图片","center",2000);
            return false;
        }
        cmp.notification.confirm("确定删除群图片？",function(index){
            if(index == 0){

            }else if(index == 1){
                //点击了第二个按钮
                cmp.ajax({
                    type: "GET",
                    url: serverAddress + "/seeyon/rest/attachment/removeFile/"+$UcGroupPic.deleteList.join(','),
                    success: function (msg) {
                        location.reload()
                    },
                    error: function (msg) {
                        console.log(msg)
                        //进行错误处理
                    }
                })
            }
        },"",["取消","确定"],false,0);
    })*/

  $UcGroupPic.showPic();
});
// 显示图片
$UcGroupPic.showPic = function(){
  cmp.listView("#g_pic_list", {
    config: {
      captionType:0,
      pageSize: 40,
      params: {} ,
      renderFunc: function(data,isRefresh){
        var picUl = document.getElementById("pic_list");
        if(isRefresh){
            picUl.innerHTML = "";
        }
        var list = data.length;
        for(var i = list - 1;i >= 0;i--){
          var pic = data[i];
          /*var _id = pic.getElementsByTagName("id")[0].innerHTML;
          var picId = (_id.indexOf("_1") == -1) ? (_id + "_1") : _id;*/
          var picId = pic.fi;
          var pendingTPL = document.getElementById("pic_list_tpl").innerHTML;
          var result = {};
          result.id = picId;
            result.path=serverAddress+"/seeyon/fileUpload.do?method=showRTE&fileId="+picId+"&type=image&showType=small&smallPX=100&ucFlag=yes"
          var html = cmp.tpl(pendingTPL, result);
          var picDom = parseDom(html)[0];
          picUl.appendChild(picDom);
          $UcGroupPic.initPicSize();
        }
          //绑定点击大图事件
          showBigPic();
          // cmp("#g_pic_list").on("tap","img",showBigPic);
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
        /*ucGroupApi.getGroupPic(cmp.member.id,$UcGroupPic.params.groupId,function(r){
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
        });*/
          var pageNo = params["pageNo"];
          cmp.ajax({
              type: "GET",
              url: serverAddress + "/seeyon/rest/attachment/reference/" + $UcGroupPic.groupId+"?pageNo="+pageNo+"&pageSize=40&type=1&option.n_a_s=1&ucFlag=yes",
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
      },
      isClear: true
    },
    down: {
      contentdown: cmp.i18n("uc.m3.h5.pullDownToRefresh"),
      contentover: cmp.i18n("uc.m3.h5.releaseTheRefresh"),
      contentrefresh: ""
    },
    up: {
      contentdown: cmp.i18n("uc.m3.h5.loadMore"),
      contentrefresh: cmp.i18n("uc.m3.h5.loadMore"),
      contentnomore: cmp.i18n("uc.m3.h5.noMore")
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
  }
}
function initImg(){
    /*if($UcGroupPic.doneCount >= $UcGroupPic.imgDomList.length){
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
    });*/

    if($UcGroupPic.doneCount >= $UcGroupPic.imgDomList.length){
        return;
    }
    var nowDom = $UcGroupPic.imgDomList[$UcGroupPic.doneCount];
    var nowId = nowDom.getAttribute("imgid");
    nowDom.style.display = "block";
    document.querySelector(".default"+nowId).style.display = "none";
    $UcGroupPic.doneCount++;
        var url = serverAddress+"/seeyon/fileUpload.do?method=showRTE&fileId="+nowId+"&type=image&showType=small&smallPX=100&ucFlag=yes"
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
    initImg();
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
    var allImgs = document.querySelector("#pic_list").querySelectorAll(".g_pic > img.groupImg");
    console.log(allImgs)
    for(var i = 0,len = allImgs.length;i < len; i ++) {
        // allImgs[i].setAttribute("img-index", i);
        var mid = allImgs[i].getAttribute("imgid");
        // mid = mid.indexOf("_1") != -1 ? mid.split("_")[0] : mid;
        getImgUrl(mid);
    }
    cmp.each(allImgs,function(i,img){
        img.addEventListener("tap",function(e){
            cmp.sliders.addNew($UcGroupPic.imgUrlList);
            cmp.sliders.detect(i);
        },false);
    });


}
function getImgUrl (imgId){
    /*chatFileDownload.getDownloadUrl(cmp.member.id, imgId, "image", function (result) {
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
    });*/
    var big = serverAddress+"/seeyon/fileUpload.do?method=showRTE&fileId="+imgId+"&type=image&ucFlag=yes";
    var small = serverAddress+"/seeyon/fileUpload.do?method=showRTE&fileId="+imgId+"&type=image&showType=small&smallPX=500&ucFlag=yes";

    $UcGroupPic.imgUrlList.push({small:small,big:big});
}
