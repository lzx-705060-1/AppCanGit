var urlParam;
var param = {};
param.drId = cmp.href.getParam("drId");
param.docId = cmp.href.getParam("drId");
param.parentForumId = 0;
param.createUserId = cmp.storage.get("createUserId");
//适配切换输入法弹出框的问题
var input_position_interval;
cmp.ready(function() {
  urlParam = getUrlParam();
  // 滚动容器
  cmp.listView("#scroll", {
    imgCache: true,
    config: {
      isClear: true,
      pageSize: 20,
      params: {},
      dataFunc: function(params, options) {
        param.pageNo = params["pageNo"];
        param.pageSize = params["pageSize"];
        $s.Doc.replys("", param, {
          success: function(result) {
            options.success(result);
            if(result.data.length){
                            document.getElementById("reply_shade_back").style.display = "block";
                            setTimeout(function () {
                                document.getElementById("reply_shade_back").style.display = "none";
                            },500);
                        }/*else{
                document.getElementById("reply_text").focus();
                        }*/
          },
              error: function(error){
                var cmpHandled = cmp.errorHandler(error);
                    if(cmpHandled){

                    }else{
                    }
              }
        });
      },
      renderFunc: renderCommentData
    },
    down: {
      contentdown: cmp.i18n("doc.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover: cmp.i18n("doc.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh: cmp.i18n("doc.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
    },
    up: {
      contentdown: cmp.i18n("doc.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
      contentrefresh: cmp.i18n("doc.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore: cmp.i18n("doc.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
    }
  });
    //cmp.HeaderFixed(document.getElementById("docView_header"), document.getElementById("reply_text"));
  initEvent();
  cmp.i18n.detect();
    if (cmp.platform.CMPShell && cmp.os.android) {
        input_position_interval = setInterval(function(){
            footerAuto("docView_header","doc-comment");
        },500);
    }
    _$("#reply_text").addEventListener("input",function () {
        var reply_txt = document.getElementById("reply_text").innerHTML;
        reply_txt = reply_txt.replace(/&nbsp;/ig, " ");
        var len = reply_txt.length;
        if(len > 200){
            this.innerText = this.innerText.slice(0,200);
            this.blur();
            cmp.notification.alert(cmp.i18n("doc.h5.reply.numMost"), function() {
                _$("#reply_text").setAttribute("contenteditable",true);
            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
        }
    });
    cmp.event.orientationChange(function(res){
        footerAuto("docView_header","doc-comment");
    });
});

function initEvent(){
  prevPage();
  cmp("body").on('blur', "#reply_text", function() {
       clearParam();
    });
  cmp("#doc-comment").on('tap', ".doc-comment-send", function() {
       docReply();
    });
  cmp("#doc_reply").on('tap', ".doc-comment-delete", function() {
       removeReplay(this);
    });
  cmp("body").on('tap', "#all-comments .doc-comment-content", function() {
        var thisNode = this;
        thisNode.parentNode.parentNode.parentNode.classList.add("commont_back");
        setTimeout(function () {
            thisNode.parentNode.parentNode.parentNode.classList.remove("commont_back");
        },1000);
        setParam(this);
    });
  cmp("body").on('click', ".doc-comment-surplus", function() {
       expandSurplusReplys(this);
    });
    cmp("body").on('tap', "#reply_shade", function() {
        this.style.display = "none";
        document.getElementById("reply_text").blur();
    });
}

function renderCommentData(data, isRefresh) {
    var liTpl_reply = document.getElementById("doc_reply_js").innerHTML;
    var table_reply = document.getElementById('doc_reply');
    var html_reply = cmp.tpl(liTpl_reply, data);
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        table_reply.innerHTML = html_reply;
    } else {
        table_reply.innerHTML = table_reply.innerHTML + html_reply;
    }
  document.getElementById("reply_text").setAttribute("placeholder", cmp.i18n('doc.h5.saySomething'));
  cmp("body").on('touchmove', "#doc_reply", function() {
        clearParam();
        document.getElementById("reply_text").setAttribute("placeholder", cmp.i18n('doc.h5.saySomething'));
    });
    cmp.i18n.detect();
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

function setParam(obj){
  document.getElementById("reply_text").blur();
  param.parentForumId = obj.getAttribute("forumId") || 0;
  //document.getElementById("reply_text").setAttribute("placeholder", cmp.i18n("doc.h5.Reply")+obj.getAttribute("createUserName"));
  document.getElementById("reply_text").focus();
    setTimeout(function() {
        document.getElementById("reply_text").focus();
    }, 200);
}

function clearParam(){
  if(!document.getElementById("reply_text").innerHTML){
    param.parentForumId = 0;
    document.getElementById("reply_text").setAttribute("placeholder", cmp.i18n('doc.h5.saySomething'));
  }
}

//回复的发送
var doubleReplyCheck = false;//用于连点的防护
function docReply() {
        if(doubleReplyCheck){
            return;
        }
    cmp.dialog.loading();
        doubleReplyCheck = true;
    document.getElementById("reply_text").blur();
        var reply_text = document.getElementById("reply_text").innerText;
        reply_text = reply_text.replace(/&nbsp;/ig, " ");
        //特殊表情转换
        if(cmp.Emoji){
            var cemoji = cmp.Emoji();
            if(reply_text){
                reply_text = cemoji.EmojiToString(reply_text);
            }
        }
        var len = reply_text.length;
        if (len > 200) {
          cmp.dialog.loading(false);
          doubleReplyCheck = false;
            cmp.notification.alert(cmp.i18n("doc.h5.commentLength") + len + cmp.i18n("doc.h5.commentLengthFooter"), function() {
            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
        } else if (len == 0) {
          cmp.dialog.loading(false);
          doubleReplyCheck = false;
            cmp.notification.alert(cmp.i18n("doc.h5.commentNotNull"), function() {
            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
            setTimeout(function () {
                document.getElementById("reply_text").blur();
            },10);
        } else {
            param.body = reply_text;
            $s.Doc.saveReply({}, param, {
                success: function(result) {
                    doubleReplyCheck = false;
                    cmp.dialog.loading(false);
                    if (result.state == "com") {
                        cmp.notification.alert(cmp.i18n("doc.h5.newsNoComment"), function() {
                            location.reload(true);
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    } else if (result.state == "-1") {
                        cmp.notification.alert(cmp.i18n("doc.h5.newsState"), function() {
                            backFrom();
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    } else if (result.state == "-2") {
                        cmp.notification.alert(cmp.i18n("doc.h5.commentDelete"), function() {
                            location.reload(true);
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    } else {
                        location.reload(true);
                    }
                    param.parentForumId = 0;
                },
                error: function(error){
                    doubleReplyCheck = false;
                  var cmpHandled = cmp.errorHandler(error);
                  if(cmpHandled){

                  }else{
                  }
                }
            });
            cmp.dialog.loading(false);
        }
    cmp.listView("#scroll").refresh();
}

function prevPage() {
    /*cmp("header").on('tap', "#prev", function(e) {
        backFrom();
    });*/
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}
function backFrom() {
  document.getElementById("reply_text").blur();
    if(urlParam["weixinMessage"]){
      cmp.href.closePage();
      return;
    } else {
      cmp.href.back();
    }
}

//删除评论
function removeReplay(obj){
  cmp.notification.confirm(cmp.i18n('doc.h5.deleteConfirm'), function (index) {
    var replyId = obj.getAttribute("forumId");
    if(index == 1){
      $s.Doc.removeReply(replyId, "", {
        success: function(result) {
          location.reload(true);
        },
            error: function(error){
              var cmpHandled = cmp.errorHandler(error);
                  if(cmpHandled){

                  }else{
                  }
            }
      });
    }
    }, "", [cmp.i18n("doc.h5.cancel"), cmp.i18n("doc.h5.OK")]);
}
//展开剩余子评论
function expandSurplusReplys(obj){
  obj.style.display = "none";
  var lis = document.getElementsByTagName("li");
  for(var i=0; i<lis.length; i++){
    lis[i].style.display = "block";
  }
}

function content_div_focus() {
  document.getElementById("reply_shade").style.display = "block";
    footerAuto("docView_header","doc-comment");
}
function content_div_blur() {
    document.getElementById("reply_shade").style.display = "none";
    footerAuto("docView_header","doc-comment");
}
function footerAuto(_headerId,_footerId) {
    if(cmp.os.ios){
        var timeout = setTimeout(function(){   //键盘被弹起
            var staticHeight = document.body.clientHeight;
            var dx = getDirection();
            var ThisHeight=window.innerHeight;
            var position;
            if(ThisHeight < staticHeight){
                var scrollTop = document.querySelector('body').scrollTop;
                position= staticHeight - ThisHeight  - scrollTop ;
                _$("#" + _footerId).style.bottom= position + "px";
                if(_headerId){
                    _$("#" + _headerId).style.top= scrollTop + "px";
                }
            }
            else{
                _$("#" + _footerId).style.bottom = 0;
                if(_headerId){
                    _$("#" + _headerId).style.top= 0;
                }
            }
            window.clearTimeout(timeout);
        },550);
    }
}

function getDirection(){
    if (window.orientation == 180){
        return "down"
    }
    if (window.orientation == 0) {
        return "up"
    }
    if (window.orientation == 90){
        return "left";
    }
    if (window.orientation == -90) {
        return "right";
    }
}
