// 获取url传递的参数,urlParam['xxx']
var urlParam = {};
// 表情调用显示
var $comment_emoji;
var canReply = false;
// 是否为归档
var isArchived = false;
// 讨论回复信息
var replyBox = {};
var hasAttchment = false;
//匿名回复标识
var anonymousReplyFlag = "0";
//适配切换输入法弹出框的问题
var input_position_interval;
//是否能删除
var canDel = false;
//收藏功能
var hasFav= false;
//是否已收藏
var isFav = false;
//是否点过赞
var isPraise = false;
//是否能点赞
var canPraise = false;

cmp.ready(function() {
    cmp.dialog.loading();
    document.documentElement.style.fontSize = 20 * (document.documentElement.clientWidth / 375) + 'px';
    if (_getQueryString("VJoinOpen") == "VJoin") {
        //对VJoin穿透过来的新闻进行处理
        urlParam['bbsId'] = _getQueryString("bbsId");
        urlParam['from'] = _getQueryString("from");
    } else {
        urlParam = cmp.href.getParam();
    }
    if (!urlParam) {
        cmp.href.closePage();
        return ;
    }
    // <title>显示
    document.getElementById("title").innerHTML = cmp.i18n("bbs.h5.bbs");
    // 头部显示(微协同屏蔽Header)
    headerShow();
    // 返回
    //cmp("#bbs_header").on('tap', "#goAheadBtn", backFrom);
    //cmp("#replyDiv").on('tap', "#prevReply", backFrom);
    // Android手机返回按钮监听
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
    $comment_emoji = new $emoji();

    // 讨论内容加载
    $s.Bbs.getBbsDetail(urlParam['bbsId'], urlParam['from'], "", {
        repeat: true, //当网络掉线时是否自动重新连接
        success: function(result) {
            cmp.dialog.loading(false);
            if (result && result.success) {
                loadData(result);
            } else {
                _$("#doc-view-operate").style.display = "none";
                cmp.notification.alert(result.msg, function() {
                    backFrom();
                }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
            }
        },
        error: function(error) {
            cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                //cmp处理了这个错误
            } else {
                //customHandle(error) ;//走自己的处理错误的逻辑
                cmp.href.closePage();
            }
        }
    });
    switchActiveEditableDiv("fast");
    _$("#reply_content").addEventListener("input", function() {
        var auditInput = this.innerText;
        if (getReallength(auditInput) > 400) {
            this.innerText = this.innerText.slice(0, 200);
            this.blur();
            cmp.notification.alert(cmp.i18n("bbs.h5.reply.numMost"), function() {
                _$("#reply_content").setAttribute("contenteditable", true);
            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
        }
    });
    cmp("body").on('touchmove', "#reply_shade", function(e) {
        this.style.display = "none";
        document.getElementById("reply_content").blur();
        showHideReplyFooter(2);
    });
    cmp("body").on('touchmove', "#quick_reply_shade", function(e) {
        hideQuickFooter();
    });
    cmp("body").on('tap', "#quick_reply_content_input.emojiStyle", function(e) {
        quick_content_div_tap();
    });
    cmp("body").on('tap', "#reply_content.emojiStyle", function(e) {
        content_div_tap();
    });
    if(document.getElementById("footer_quick")){
        cmp.footerAuto('#footer_quick');
    }
    cmp.event.orientationChange(function(res){
        // if(replyPage){
        //     footerAuto("", "footer_num1");
        // }else{
        //     if(document.getElementById("footer_quick").style.display == "block"){
        //         footerAuto("", "footer_quick");
        //     }
        // }
    });
});
// *****加载页面信息 ***** //
function loadData(data) {
    canReply = data.canReply;
    isArchived = data.article.state == 100;

    replyBox.bbsId = urlParam['bbsId'];
    replyBox.replyFlag = '4'; // 4,5,6
    replyBox.toReplyId = '';
    replyBox.topReplyId = '';
    replyBox.init = function() {
        replyBox.replyFlag = '4';
        replyBox.toReplyId = '';
        replyBox.topReplyId = '';
    };

    var liTpl_brief = document.getElementById("bbs_brief_js").innerHTML;
    var table_brief = document.getElementById('bbs_brief');
    var html_brief = cmp.tpl(liTpl_brief, data);
    table_brief.innerHTML = html_brief;
    getPraiseSum();
    if (data.attachements.length > 0) {
        hasAttchment = true;
        document.querySelector("#attachmentList").classList.remove("display_none");
        cmp.att.init("#attachments_ul", data.attachements);
        // document.getElementById("scroll").style.height = document.getElementById("scroll").clientHeight - 40 + "px";
        document.getElementById("scroll").style.height = CMPFULLSREENHEIGHT - 50 + "px";
        document.getElementById("file_count").innerText = data.attachements.length;
        document.querySelector(".attach-title").addEventListener("tap", function() {
            var bodyDom = document.querySelector("#attachBody");
            var jiantou = document.querySelector("#jiantou");
            if (bodyDom.classList.contains('display_none')) {
                bodyDom.classList.remove("display_none");
                jiantou.classList.remove('see-icon-v5-common-arrow-down');
                jiantou.classList.add('see-icon-v5-common-arrow-top');
                document.getElementById("reply_sum").style.borderTop = "none";
            } else {
                bodyDom.classList.add("display_none");
                jiantou.classList.add('see-icon-v5-common-arrow-down');
                jiantou.classList.remove('see-icon-v5-common-arrow-top');
                document.getElementById("reply_sum").style.borderTop = "1px #c7c7cc solid";
            }
            cmp.listView("#scroll").refresh();
        });
        // 附件图标定位 20171121任务项去掉此按钮
        // document.getElementById("attchmentFlag").addEventListener("tap", function() {
        //     _toggleContent(true);
        //     cmp.listView("#scroll").refresh();
        //     cmp.listView("#scroll").scrollTo(0, 0);
        // });
    }
    //评论加载
    replyLoad(data);
    cmp.i18n.detect();
    loadAttAndReplyList();
    _initLayout(data.attachements.length);

    // 正文 + 最赞回复
    var content = data.article.content;
    var praiseList = data.hotReplyList;
    var hotContent =  renderHotList(praiseList);
    _initContent("10", $comment_emoji.addHeader(content) + hotContent , data.attachements.length);
    // 加载附件及评论列表及拖动操作
    // loadAttAndReplyList();
    bbsControl(data);
    window.setTimeout(function() {
        for (var x = 0; x < praiseList.length; x++) {
            if (praiseList[x].fileListJson) {
                var subAttrs = cmp.parseJSON(praiseList[x].fileListJson);
                initFile("#praiseReplyAttachments_" + praiseList[x].id, subAttrs);
            } else {
                document.getElementById("praiseReplyAttachments_" + praiseList[x].id).remove();
            }
        }
        cmp.i18n.detect();
        toggleBrief();
        hotReplyPraise();
        hotListTap();
        resizePraisePic();
        cmp.listView("#scroll").refresh();
        SeeyonContent.reLayout("bbs_content");

    }, 500);
}

// 正文展现
var seeyonContentIscroll;

function _initContent(bodyType, content, attLength, refresh) {
    var contentConfig = {
        "target": "bbs_content",
        "bodyType": bodyType,
        "content": content,
        "moduleType": "9",
        "rightId": "",
        "viewState": "",
        "momentum": true,
        "onScrollBottom": function() {
            if (attLength > 0) {
                _toggleContent(true); // 展示意见区域
                cmp.listView("#scroll").refresh();
            }
        }
    }

    // 初始化正文
    seeyonContentIscroll = SeeyonContent.init(contentConfig);

}
// 设置元素布高度等
function _initLayout(_attachment) {
    // 设置正文区域高度
    var pageH = window.innerHeight;
    //var headerHeight = _$("#bbs_header") == null ? 0 : _$("#bbs_header").offsetHeight;
    var titleHeight = _$("#bbs_brief").offsetHeight;
    var fHeight = _$("#doc-view-operate") == null ? 0 : _$("#doc-view-operate").offsetHeight;

    if (_attachment) {
        var cHeight = pageH - fHeight - 35;
    } else {
        var cHeight = pageH - fHeight;
    }

    _$("#bbs_content").style.height = cHeight + "px";

    _toggleContent(false);

    _$("#scroll-shade").addEventListener("tap", function() {
        _toggleContent(true);
        cmp.listView("#scroll").refresh();
    }, false);
}

//讨论底部收藏，删除，评论显示控制
function bbsControl(data) {
    hasFav = !(urlParam['from'] == "pigeonhole" || isArchived || data.collectShow == "false");
    isFav = data.isCollect == "true";
    canDel = !(urlParam['from'] == "pigeonhole" || data.canDel == "false");
    canPraise = data.article.state!=100 && data.article.state!=3
    isPraise = data.article.userPraiseState;

    if(hasFav || canDel) {
        cmp("#footer_more").on('tap', "div", function (e) {
            showfootMenu();
        });
    }else{
        _$("#footer_more").style.display = "none";
    }
    if(isPraise){
        _$(".doc-view-operate-praise-icon").style.color = "#EC5F45";
        _$("#praiseIcon1").style.color = "#EC5F45";
    }
    if(canPraise && !isPraise){
        _$("#footer_praise").setAttribute("onclick","bbsPrise();");
        _$("#praiseIcon1").setAttribute("onclick","bbsPrise();");
    }
    var quickInput = _$("#quick_reply_content");
    quickInput.setAttribute("placeholder", cmp.i18n("bbs.h5.codecomment"));
    if(data.article.state != "30" && data.replyAuth){
        quickInput.innerText = cmp.i18n("news.h5.saySomething");
        quickInput.setAttribute("onclick","showQuickFooter()");
    }else{
        var quickInput = _$("#quick_reply_content");
        quickInput.innerText = cmp.i18n("bbs.h5.reply.ban");
        quickInput.style.opacity = 0.5;
        quickInput.style.backgroundColor = "#efefef";
    }
    _$("#quick_reply_content").style.width = _$("#doc-view-operate").clientWidth - _$("#footer_comment").clientWidth - _$("#footer_praise").clientWidth - _$("#footer_more").clientWidth - 10 + "px";
}

/**
 * 删除讨论
 */
function deleteBbs() {
    cmp.notification.confirm(cmp.i18n("bbs.h5.del.bbs"), function(e) {
        if (e == 1) {
            $s.Bbs.removeBbs(urlParam['bbsId'], {}, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    if (result.success) {
                        if (result.data == "isTop") {
                            cmp.notification.toast(cmp.i18n("bbs.h5.del.isTop"), "center", 2000);
                        } else if (result.data == "isElite") {
                            cmp.notification.toast(cmp.i18n("bbs.h5.del.isElite"), "center", 2000);
                        } else {
                            cmp.notification.alert(cmp.i18n("bbs.h5.delete.success"), function() {
                                //删除后用于更新listView,不使用listView缓存
                                cmp.storage.save("BBS_Create_Success_Refresh", "true", true);
                                backFrom();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        }
                    } else {
                        cmp.notification.alert(cmp.i18n("bbs.h5.del.already"), function() {
                            backFrom();
                        }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                    }
                },
                error: function(error) {
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });
        }
    }, null, [cmp.i18n("bbs.h5.cancel"), cmp.i18n("bbs.h5.confirm")]);
}

function replyLoad(data) {
    // 回复数
    _$("#replySum").innerText = data.article.replyNumber;
    _$("#commentNum").innerText = data.article.replyNumber > 999 ? "999+" : data.article.replyNumber;
    if(data.article.replyNumber == 0){
        _$(".doc-view-operate-comment-icon").style.color = "#AFBAD7";
        // _$("#commentNum").style.color = "#AFBAD7";
    }
    if (data.article.state != "30" && data.replyAuth) {
        document.getElementById("footer_num1").style.display = "block";
        _$("#reply_text").setAttribute("placeholder", cmp.i18n("bbs.h5.talking"));
        //匿名加载及操作
        if (data.article.anonymousReplyFlag) {
            _$("#replyScroll").style.height = _$("#replyScroll").clientHeight - 55 + "px";
            cmp("#footer_num1").on('tap', "#anonymousReply", function(e) {
                if (anonymousReplyFlag == "1") {
                    anonymousReplyFlag = "0";
                    _$("#anonymousReplyCheckBox").classList.add("see-icon-radio-unchecked");
                    _$("#anonymousReplyCheckBox").classList.remove("see-icon-success-circle-fill");
                } else {
                    anonymousReplyFlag = "1";
                    _$("#anonymousReplyCheckBox").classList.remove("see-icon-radio-unchecked");
                    _$("#anonymousReplyCheckBox").classList.add("see-icon-success-circle-fill");
                }
            });


            //快速回复
            cmp("#footer_quick").on('tap', "#quick_anonymousReply", function(e) {
                if (anonymousReplyFlag == "1") {
                    anonymousReplyFlag = "0";
                    _$("#quick_anonymousReplyCheckBox").classList.add("see-icon-radio-unchecked");
                    _$("#quick_anonymousReplyCheckBox").classList.remove("see-icon-success-circle-fill");
                } else {
                    anonymousReplyFlag = "1";
                    _$("#quick_anonymousReplyCheckBox").classList.remove("see-icon-radio-unchecked");
                    _$("#quick_anonymousReplyCheckBox").classList.add("see-icon-success-circle-fill");
                }
            });
            // _$("#quick_reply_content_input").style.marginTop = "0px";
            // _$("#quick_reply_content_input").style.marginBottom = "10px";
            // _$("#quick_send_reply").style.paddingTop = "7px";

        } else {
            _$("#anonymousReply").style.display = "none";
            _$("#footer_num1").style.minHeight = "55px";
            //快速回复
            _$("#quick_anonymousReply").style.display = "none";
            _$("#footer_quick").style.minHeight = "55px";
        }

        document.querySelector('#footer_button').addEventListener('tap', replyStyle);
        document.querySelector('#quick_footer_button').addEventListener('tap', quickReplyStyle);
        replyListView();
        replyTap();
        sendReply();
    } else {
        replyTap();
        replyListView();
    }
}

/**
 * 收藏讨论
 */
function collectOrNotBbs() {
    if (isFav) {
        //取消方法
        var params = {
            "docId": -1,
            "sourceId": urlParam['bbsId']
        };
        $s.Doc.cancelFavorite(params, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function() {
                cmp.notification.toastExtend(cmp.i18n("bbs.h5.cancleCollect.success"), "center", 1000);
                isFav = false;
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {
                    //cmp处理了这个错误
                } else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    }else {
        //收藏方法
        var params = {
            "sourceId": urlParam['bbsId'],
            "favoriteType": 3,
            "appKey": 9,
            "hasAtt": hasAttchment
        };
        $s.Doc.favorite(params, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                cmp.notification.toastExtend(cmp.i18n("bbs.h5.collect.success"), "center", 1000);
                isFav = true;
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {
                    //cmp处理了这个错误
                } else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    }
}

var replyPage = false; //评论浮层显示与否标识
function replyTap() {
    cmp("#doc-view-operate").on('tap', "#footer_comment", function(e) {
        //_$("#replyScroll").style.top = _$("#reply_header").clientHeight - 1 + "px";
        _$("#replyDiv").classList.add('cmp-active');
        _$("#bbs_content_par").style.display = "none";
        _$("#scroll").style.display = "none";
        //_$("#replyScroll").style.height = _$("#replyDiv").clientHeight  +"px";
        replyPage = true;
        showHideReplyFooter(2);
        switchActiveEditableDiv("common");
        if(document.getElementById("footer_num1")){
            cmp.footerAuto('#footer_num1');
        }
        cmp.backbutton.push(backFrom);
    });
    cmp("#bbs_content").on('tap', "#moreReply", function(e) {
        //_$("#replyScroll").style.top = _$("#reply_header").clientHeight - 1 + "px";
        _$("#replyDiv").classList.add('cmp-active');
        _$("#bbs_content_par").style.display = "none";
        _$("#scroll").style.display = "none";
        //_$("#replyScroll").style.height = _$("#replyDiv").clientHeight  +"px";
        replyPage = true;
        switchActiveEditableDiv("common");
        cmp.backbutton.push(backFrom);

    });
}

function replyListView() {
    cmp.listView("#replyScroll", {
        imgCache: true,
        config: {
            isClear: true,
            crumbsID: Math.random(),
            pageSize: 20,
            params: {},
            dataFunc: function(params, options) {
                $s.Bbs.bbsReplys(urlParam['bbsId'], {
                    "pageNo": params["pageNo"],
                    "pageSize": params["pageSize"]
                }, {
                    success: function(result) {
                        options.success(result);
                    }
                });
            },
            renderFunc: function(data, isRefresh) {
                var liTpl_reply = document.getElementById("bbs_reply_js").innerHTML;
                var table_replyPage = document.getElementById('replyUl');
                var html_replyPage = cmp.tpl(liTpl_reply, data);
                if (isRefresh) { // 是否刷新操作，刷新操作 直接覆盖数据
                    table_replyPage.innerHTML = html_replyPage;
                } else {
                    table_replyPage.innerHTML = table_replyPage.innerHTML + html_replyPage;
                }
                // 回复附件添加
                for (var x = 0; x < data.length; x++) {
                    if (data[x].fileListJson) {
                        var subAttrs = cmp.parseJSON(data[x].fileListJson);
                        initFile("#replyAttachments_" + data[x].id, subAttrs);
                    } else {
                        document.getElementById("replyAttachments_" + data[x].id).remove();
                    }
                }
                cmp.i18n.detect();
                cmp.listView("#replyScroll").refresh();
            }
        },
        up: {
            contentdown: cmp.i18n("bbs.page.lable.load_more"), // 可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bbs.page.lable.load_ing"), // 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("bbs.page.lable.load_nodata")
            // 可选，请求完毕若没有更多数据时显示的提醒内容；
        },
        down: {
            contentdown: cmp.i18n("bbs.page.lable.refresh_down"), // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("bbs.page.lable.refresh_release"), // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bbs.page.lable.refresh_ing"), // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        }
    });
}


// 附件 区域显示和影藏
function _toggleContent(show) {
    var cHeight = 0;
    if (!show) {
        cHeight = _$("#bbs_content").offsetHeight;
        _$("#scroll-shade").style.display = "";
        _$("#scroll").style.webkitTransform = "translate(0px, " + (cHeight) + "px)";
        _$("#scroll").style.transform = "translate(0px, " + (cHeight) + "px)";
        cmp.listView("#scroll").disable();
    } else {
        _$("#scroll-shade").style.display = "none";
        _$("#scroll").style.webkitTransform = "translate(0px, -1px)";
        _$("#scroll").style.transform = "translate(0px, -1px)";
        cmp.listView("#scroll").enable();
    }
}
// *****初始化附件 ***** //
function initFile(selector, fileList) {
    var loadParam = {
        selector: selector,
        atts: fileList
    };
    return new SeeyonAttachment({
        loadParam: loadParam
    });
}
// *****加载附件及评论列表及拖动操作 ***** //
function loadAttAndReplyList() {
    cmp.listView("#scroll", {
        config: {
            customScrollMoveEvent: function(scrollY) { // 启用自定义时，其他参数不要传
                if (scrollY > 30) {
                    _toggleContent(false);
                }
            }
        }
    });
    cmp.listView("#scroll").disable();
    replyPraise();
    cmp.i18n.detect();

    // 滑动事件--恢复成默认一级回复
    cmp("body").on('touchmove', "#bbs_reply", function() {
        replyBox.init();
        reSetTextArea();
    });
    // 大图查看
    cmp("#replyUl").on('tap', "img", function(e) {
        e.stopPropagation();
        var _src = this.getAttribute("src");
        if (_src.indexOf("&showType=small") != -1) {
            _src = _src.split("&showType=small")[0];
        }
        var imgArray = [];
        imgArray.push(_src);
        cmp.sliders.addNew(imgArray);
        cmp.sliders.detect("0");
    });
    // 超链接跳转
    cmp("#replyUl").on('tap', "a", function(e) {
        e.stopPropagation();
        var _href = this.getAttribute("href");
        if (cmp.platform.CMPShell) {
            var tTitle = this.innerText || cmp.i18n("bbs.h5.content.link");
            cmp.href.open(_href, tTitle);
        } else {
            location.href = _href;
        }
    });
    document.getElementById("reply_content").addEventListener("blur", function() {
        this.setAttribute("placeholder", cmp.i18n("bbs.h5.talking"));
    });
    // 点击内容区域，弹出框
    cmp("#replyUl").on('tap', ".bbs-reply-area", function(e) {
        var thisDom = this;
        showHideReplyFooter(1);
        document.getElementById("reply_content").innerHTML = "";
        document.getElementById("reply_content").setAttribute("placeholder", cmp.i18n("bbs.h5.reply") + " " + thisDom.getAttribute("replyName"));
        document.getElementById("reply_content").focus();
        setTimeout(function() {
            document.getElementById("reply_content").focus();
        }, 200);
        replyBox.init();
        var flag = thisDom.getAttribute("replyFlag");
        if (flag == '4') {
            replyBox.replyFlag = "5";
            replyBox.topReplyId = thisDom.getAttribute("replyId");
        } else {
            replyBox.replyFlag = "6";
            replyBox.topReplyId = thisDom.getAttribute("topReplyId");
        }
        replyBox.toReplyId = thisDom.getAttribute("replyId");

    });
    //评论删除
    cmp("#replyUl").on('tap', ".bbs-comment-delete", function(e) {
        var eThis = this;
        cmp.notification.confirm(cmp.i18n("bbs.h5.delete.reply"), function(e1) {
            if (e1 == 1) {
                deleteReply(eThis.getAttribute("replyId"), eThis.getAttribute("replyFlag"));
            }
        }, null, [cmp.i18n("bbs.h5.cancel"), cmp.i18n("bbs.h5.confirm")]);
        e.stopPropagation();
    });

}
// *****表情切换 ***** //
function replyStyle() {
    $comment_emoji.init_emoji_ontainer("commemnt_content_input", "emoji_ontainer", function() {
        // document.getElementById("reply_text").value = document.getElementById("reply_text").value + "[" + this.getAttribute("_title") + "]";
        document.getElementById("reply_content").innerText = document.getElementById("reply_content").innerText + this.getAttribute("_title");
    });
    var _this = document.getElementById("footer_button");
    var inputDiv = document.getElementById("reply_content");
    if (_this.classList.contains('see-icon-v5-common-expression')) {
        _this.classList.remove('see-icon-v5-common-expression');
        _this.classList.add('see-icon-v5-common-keyboard');
        setTimeout(function() {
            document.querySelector("#emoji_ontainer").classList.remove('display_none');
        }, 500);
        document.querySelector("#footer_num1").classList.add("emoji_div");
        if(!inputDiv.classList.contains("emojiStyle")){
            inputDiv.classList.add("emojiStyle");
        }
        inputDiv.setAttribute("contenteditable", "false");
    } else if (_this.classList.contains('see-icon-v5-common-keyboard')) {
        _this.classList.remove('see-icon-v5-common-keyboard');
        _this.classList.add('see-icon-v5-common-expression');
        document.querySelector("#emoji_ontainer").classList.add('display_none');
        document.querySelector("#footer_num1").classList.remove('emoji_div');
        if(inputDiv.classList.contains("emojiStyle")){
            inputDiv.classList.remove("emojiStyle");
        }
        inputDiv.setAttribute("contenteditable", "true");
        inputDiv.focus();
    }
}
function quickReplyStyle() {
    $comment_emoji.init_emoji_ontainer("quick_commemnt_content_input", "quick_emoji_ontainer", function() {
        document.getElementById("quick_reply_content_input").innerText = document.getElementById("quick_reply_content_input").innerText + this.getAttribute("_title");
    });
    var _this = document.getElementById("quick_footer_button");
    var inputDiv = document.getElementById("quick_reply_content_input");
    if (_this.classList.contains('see-icon-v5-common-expression')) {//切换到表情
        _this.classList.remove('see-icon-v5-common-expression');
        _this.classList.add('see-icon-v5-common-keyboard');
        setTimeout(function() {
            document.querySelector("#quick_emoji_ontainer").classList.remove('display_none');
        }, 500);
        document.querySelector("#footer_quick").classList.add("emoji_div");
        inputDiv.setAttribute("contenteditable", "false");
        if(!inputDiv.classList.contains("emojiStyle")){
            inputDiv.classList.add("emojiStyle");
        }
        inputDiv.setAttribute("contenteditable", "false");
        inputDiv.blur();
    } else if (_this.classList.contains('see-icon-v5-common-keyboard')) {//切换到键盘
        _this.classList.remove('see-icon-v5-common-keyboard');
        _this.classList.add('see-icon-v5-common-expression');
        document.querySelector("#quick_emoji_ontainer").classList.add('display_none');
        document.querySelector("#footer_quick").classList.remove('emoji_div');
        if(inputDiv.classList.contains("emojiStyle")){
            inputDiv.classList.remove("emojiStyle");
        }
        inputDiv.setAttribute("contenteditable", "true");
        inputDiv.focus();
    }
}
// *****恢复原输入样式 ***** //
function reSetTextArea() {
    _$("#reply_content").blur();
    var _this = document.getElementById("footer_button");
    if (_this.classList.contains('see-icon-v5-common-keyboard')) {
        _this.classList.remove('see-icon-v5-common-keyboard');
        _this.classList.add('see-icon-v5-common-expression');
        document.querySelector(".emoji_ontainer").classList.add('display_none');
        document.querySelector("#footer_num1").classList.remove('emoji_div');
        var inputDiv = document.getElementById("reply_content");
        if(inputDiv.classList.contains("emojiStyle")){
            inputDiv.classList.remove("emojiStyle");
        }
    }
}
// *****讨论点赞 ***** //
function bbsPrise() {
    document.getElementById("bbsPraise").setAttribute("onclick", "");
    document.getElementById("footer_praise").setAttribute("onclick","");
    document.getElementById("praiseIcon1").setAttribute("onclick","");

    $s.Bbs.bbsPraise(urlParam['bbsId'], {}, {}, {
        repeat: false, //当网络掉线时是否自动重新连接
        success: function(result) {
            if (result.success == "true") {
                var span = document.getElementById("bbsPraise");
                var span1 = document.getElementById("praiseIcon1");
                span.classList.remove("see-icon-v5-common-praise");
                span.classList.add("see-icon-v5-common-praise-fill");
                span.classList.remove("see-icon-v5-common-praise");
                span1.classList.add("see-icon-v5-common-praise-fill");
                span.style.color = "#EC5F45";
                span1.style.color = "#EC5F45";
                _$(".doc-view-operate-praise-icon").style.color = "#EC5F45";
                var praiseSum = document.getElementById("bbsPraiseSum").innerText;
                document.getElementById("bbsPraiseSum").innerText = parseInt(praiseSum) + 1;
            } else {
                cmp.notification.alert(cmp.i18n("bbs.h5.praise.fail"), function() {
                    backFrom();
                }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
            }
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                //cmp处理了这个错误
            } else {
                //customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}

// *****回复点赞 ***** //
function replyPraise() {
    cmp("#replyUl").on('tap', ".reply-praise", function(e) {
        // var e = window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        var thisDom = this.querySelector(".see-icon-v5-common-praise");
        if (isArchived || thisDom == null || thisDom.classList.contains('cmp-active')) {
            return;
        }
        var replyId = thisDom.getAttribute("replyId");
        $s.Bbs.bbsReplyPraise(replyId, {}, {}, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                if (result.success == "true") {
                    thisDom.classList.add("cmp-active");
                    thisDom.classList.remove("see-icon-v5-common-praise");
                    thisDom.classList.add("see-icon-v5-common-praise-fill");
                    thisDom.style.color = "#EC5F45";
                    var likeNum = parseInt(thisDom.previousElementSibling.innerText);
                    thisDom.previousElementSibling.innerText = likeNum + 1;
                    alterPraiseStyle(false);
                } else {
                    cmp.notification.toast(cmp.i18n("bbs.h5.praise.fail"), "center");
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {
                    //cmp处理了这个错误
                } else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    });
}
// *****最赞回复点赞 ***** //
function hotReplyPraise() {
    cmp("#praiseList").on('tap', ".reply-praise", function(e) {
        // var e = window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        var thisDom = this.querySelector(".see-icon-v5-common-praise");
        if (isArchived || thisDom == null || thisDom.classList.contains('cmp-active')) {
            return;
        }
        var replyId = thisDom.getAttribute("replyId");
        $s.Bbs.bbsReplyPraise(replyId, {}, {}, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                if (result.success == "true") {
                    thisDom.classList.add("cmp-active");
                    thisDom.classList.remove("see-icon-v5-common-praise");
                    thisDom.classList.add("see-icon-v5-common-praise-fill");
                    thisDom.style.color = "#EC5F45";
                    var likeNum = parseInt(thisDom.previousElementSibling.innerText);
                    thisDom.previousElementSibling.innerText = likeNum + 1;
                    cmp.listView("#replyScroll").refresh();
                    alterPraiseStyle(true);
                } else {
                    cmp.notification.toast(cmp.i18n("bbs.h5.praise.fail"), "center");
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {
                    //cmp处理了这个错误
                } else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    });
}

// *****回复讨论 ***** //
var doubleReplyCheck = false;//用于连点的防护
function sendReply() {
    cmp("footer").on('tap', "#send_reply", function(e) {
        if(doubleReplyCheck){
            return;
        }
        cmp.dialog.loading();
        doubleReplyCheck = true;
        var _this = document.getElementById("footer_button");
        if (_this.classList.contains('see-icon-v5-common-keyboard')) {
            _this.classList.remove('see-icon-v5-common-keyboard');
            _this.classList.add('see-icon-v5-common-expression');
            document.querySelector(".emoji_ontainer").classList.add('display_none');
            document.querySelector("#footer_num1").classList.remove('emoji_div');
            document.getElementById("reply_content").classList.remove("emojiStyle");
            switchActiveEditableDiv("common");
        }

        var reply_text = document.getElementById("reply_content").innerText;
        var len = reply_text.length;
        if (len > 200) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            document.getElementById("send_reply").removeAttribute("disabled");
            cmp.notification.toast(cmp.i18n("bbs.h5.reply.numMost"), "bottom", 1000);
        } else if (len === 0 || reply_text.trim().length === 0) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            document.getElementById("send_reply").removeAttribute("disabled");
            cmp.notification.toast(cmp.i18n("bbs.h5.reply.nonull"), "bottom", 1000);
        } else if (!canReply) {
            cmp.notification.alert(cmp.i18n("bbs.h5.reply.ban"), function() {
                cmp.dialog.loading(false);
                doubleReplyCheck = false;
                document.getElementById("send_reply").removeAttribute("disabled");
            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
        } else {
            var _content = reply_text;
            if (replyBox.replyFlag == "4") {
                _content = escapeStringToHTML(reply_text, true);
            }
            //特殊表情转换
            if (cmp.Emoji) {
                var cemoji = cmp.Emoji();
                if (_content) {
                    _content = filteremoji(cemoji.EmojiToString(_content));
                }
            }
            $s.Bbs.addReply({}, {
                "articleId": replyBox.bbsId,
                "content": _content,
                "anonymous": anonymousReplyFlag,
                "type": replyBox.replyFlag,
                "toReplyId": replyBox.toReplyId,
                "replyId": replyBox.topReplyId
            }, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    doubleReplyCheck = false;
                    cmp.dialog.loading(false);
                    if (result.success == "true") {
                        // cmp.notification.toast("回复成功", "center");
                        if (replyBox.replyFlag != "4") {
                            //showChildReply(result.reply);
                            replyBox.init();
                            document.getElementById("reply_content").innerText = "";
                            document.getElementById("reply_content").setAttribute("placeholder", cmp.i18n("bbs.h5.talking"));
                            document.getElementById("replySum").innerHTML = Number(document.getElementById("replySum").innerHTML) + 1;
                            replyListView();
                        } else {
                            replyListView();
                        }
                        var replyNumSpan = _$("#commentNum");
                        var replyNum = replyNumSpan.innerText;
                        if(replyNum !== "999+"){
                            replyNum = parseInt(replyNum) + 1;
                            if(replyNum >999 ){
                                replyNum = "999+";
                            }
                            replyNumSpan.innerText = replyNum;
                        }
                        cmp.notification.toast(cmp.i18n("bbs.h5.reply.success"), "center", 1500);
                    } else {
                        if (result.msg == "error_3") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.reply.isdel"), function() {
                                replyListView();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        } else if (result.msg == "error_1") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.delorcanceled"), function() {
                                backFrom();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        } else if (result.msg == "error_2") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.reply.fail"), function() {
                                replyListView();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        }
                    }
                    document.getElementById("reply_content").innerText = "";
                    document.getElementById("reply_content").blur();
                    showHideReplyFooter(2);
                },
                error: function(error) {
                    doubleReplyCheck = false;
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });
            cmp.dialog.loading(false);
        }
    });
    //快速回复
    cmp("footer").on('tap', "#quick_send_reply", function(e) {
        if(doubleReplyCheck){
            return;
        }
        cmp.dialog.loading();
        doubleReplyCheck = true;
        var _this = document.getElementById("quick_footer_button");
        if (_this.classList.contains('see-icon-v5-common-keyboard')) {
            _this.classList.remove('see-icon-v5-common-keyboard');
            _this.classList.add('see-icon-v5-common-expression');
            document.querySelector("#quick_emoji_ontainer").classList.add('display_none');
            document.querySelector("#footer_quick").classList.remove('emoji_div');
            document.getElementById("quick_reply_content_input").classList.remove("emojiStyle");
            switchActiveEditableDiv("fast");
        }
        var reply_text = document.getElementById("quick_reply_content_input").innerText;
        var len = reply_text.length;
        if (len > 200) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            document.getElementById("quick_send_reply").removeAttribute("disabled");
            cmp.notification.toast(cmp.i18n("bbs.h5.reply.numMost"), "bottom", 1000);
        } else if (len === 0 || reply_text.trim().length === 0) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            document.getElementById("quick_send_reply").removeAttribute("disabled");
            cmp.notification.toast(cmp.i18n("bbs.h5.reply.nonull"), "bottom", 1000);
        } else if (!canReply) {
            cmp.notification.alert(cmp.i18n("bbs.h5.reply.ban"), function() {
                cmp.dialog.loading(false);
                doubleReplyCheck = false;
                document.getElementById("quick_send_reply").removeAttribute("disabled");
            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
        } else {
            var _content = reply_text;
            if (replyBox.replyFlag == "4") {
                _content = escapeStringToHTML(reply_text, true);
            }
            //特殊表情转换
            if (cmp.Emoji) {
                var cemoji = cmp.Emoji();
                if (_content) {
                    _content = filteremoji(cemoji.EmojiToString(_content));
                }
            }
            $s.Bbs.addReply({}, {
                "articleId": replyBox.bbsId,
                "content": _content,
                "anonymous": anonymousReplyFlag,
                "type": replyBox.replyFlag,
                "toReplyId": replyBox.toReplyId,
                "replyId": replyBox.topReplyId
            }, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    doubleReplyCheck = false;
                    cmp.dialog.loading(false);
                    if (result.success == "true") {
                        // cmp.notification.toast("回复成功", "center");
                        if (replyBox.replyFlag != "4") {
                            //showChildReply(result.reply);
                            replyBox.init();
                            document.getElementById("reply_content").innerText = "";
                            document.getElementById("reply_content").setAttribute("placeholder", cmp.i18n("bbs.h5.talking"));
                            document.getElementById("replySum").innerHTML = Number(document.getElementById("replySum").innerHTML) + 1;
                            replyListView();
                        } else {
                            replyListView();
                        }
                        var replyNumSpan = _$("#commentNum");
                        var replyNum = replyNumSpan.innerText;
                        if(replyNum !== "999+"){
                            replyNum = parseInt(replyNum) + 1;
                            if(replyNum >999 ){
                                replyNum = "999+";
                            }
                            replyNumSpan.innerText = replyNum;
                        }
                        cmp.notification.toast(cmp.i18n("bbs.h5.reply.success"), "center", 1500);
                    } else {
                        if (result.msg == "error_3") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.reply.isdel"), function() {
                                replyListView();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        } else if (result.msg == "error_1") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.delorcanceled"), function() {
                                backFrom();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        } else if (result.msg == "error_2") {
                            cmp.notification.alert(cmp.i18n("bbs.h5.reply.fail"), function() {
                                replyListView();
                            }, cmp.i18n("bbs.h5.alert"), cmp.i18n("bbs.h5.confirm"));
                        }
                    }
                    document.getElementById("quick_reply_content_input").innerText = "";
                    document.getElementById("quick_reply_content_input").blur();
                    hideQuickFooter();
                },
                error: function(error) {
                    doubleReplyCheck = false;
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });
            cmp.dialog.loading(false);
        }
    });

    cmp("footer").on('tap', "#intoInputBtn", function(e) {
        showHideReplyFooter(1);
        _$("#reply_content").focus();
    });
}

// *****显示子回复 ***** //
function showChildReply(data) {
    if (data) {
        var jsonData = cmp.parseJSON(data);
        var show_child_reply = document.getElementById("show_child_reply_js").innerHTML;
        var replyLi = document.getElementById('replyLi_' + jsonData.topReplyId);
        var childDiv = replyLi.querySelector(".child-reply-list");
        var child_reply_html = cmp.tpl(show_child_reply, jsonData);
        if (childDiv != null) {
            childDiv.lastElementChild.className = childDiv.lastElementChild.className + " line";
            cmp.append(childDiv, child_reply_html);
        } else {
            child_reply_html = "<div class='child-reply-list'>" + child_reply_html + "</div>"
            cmp.append(replyLi.querySelector(".bbs-reply-div"), child_reply_html);
        }
        reSetTextArea();
        cmp.listView("#replyScroll").refresh();
        cmp.i18n.detect();
    }
}

// *****删除讨论回复 ***** //
function deleteReply(replyId, replyFlag) {
    $s.Bbs.removeReply({}, {
        "articleId": urlParam['bbsId'],
        "replyPostId": replyId,
        "type": replyFlag == "4" ? "1" : "0"
    }, {
        repeat: false, //当网络掉线时是否自动重新连接
        success: function(result) {
            replyBox.init();
            if (result.success == "true") {
                cmp.notification.toast(cmp.i18n("bbs.h5.delete.success"), "center");
                //location.reload(true);
                replyListView();
            } else {
                cmp.notification.toast(cmp.i18n("bbs.h5.delete.fail"), "bottom");
            }
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                //cmp处理了这个错误
            } else {
                //customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}

/**
 * 返回方法
 */
function backFrom() {
    _$("#reply_content").blur();
    if (replyPage) {
        window.clearInterval(input_position_interval);
        replyPage = false;
        _$("#replyDiv").classList.remove('cmp-active');
        cmp.i18n.detect();
        _$("#bbs_content_par").style.display = "block";
        _$("#scroll").style.display = "block";
        //弹出一个div浮层，向统一栈压一次逻辑返回的回调函数，当整个div浮层被逻辑销毁时，必须出栈一次，弹出逻辑返回的回调函数。
        //http://open.seeyon.com/seeyon/cmp2.0/book/chapter-3/API.html#backbutton
        cmp.backbutton.pop();
        switchActiveEditableDiv("fast");
        SeeyonContent.reLayout("bbs_content");
        if(document.getElementById("footer_quick")){
            cmp.footerAuto('#footer_quick');
        }
        return;
    }
    if (!urlParam) {
        cmp.href.back();
        return;
    }
    if (urlParam["isNav"] === true) {
        cmp.href.back();
        return;
    }
    if (urlParam["weixinMessage"] || urlParam["fromXz"]) {
        cmp.href.closePage();
        return;
    }
    cmp.href.back();
}

/**
 * 头部显示(微协同屏蔽Header)
 */
function headerShow() {
    /*if (!cmp.platform.CMPShell) { // 是微信浏览器
        cmp.headerHide();
        _$("#reply_header").style.display = "none";
    }*/
    if (document.getElementById("shadow")) {
        document.body.removeChild(document.getElementById("shadow"));
    }
}

function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}

function toggleBrief() {
    var startX, startY, endX, endY;
    seeyonContentIscroll.outer.ontouchstart = function(e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    };
    seeyonContentIscroll.outer.ontouchmove = function(e) {
        endX = e.touches[0].pageX;
        endY = e.touches[0].pageY;
        if (startY > endY) {
            // up
            _$("#bbs_brief").style.transform = "translate(0px, -" + _$("#bbs_brief").clientHeight + "px)";
            _$("#bbs_content_par").style.transform = "translate(0px, -" + _$("#bbs_brief").clientHeight + "px)";
        } else {
            // down
            _$("#bbs_brief").style.transform = "translate(0px, 0px)";
            _$("#bbs_content_par").style.transform = "translate(0px, 0px)";
        }
    };
}

function getReallength(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function replyImgDeal(html) {
    if (cmp.platform.CMPShell) {
        // cmp壳需要进行路径替换
        html = html.replace(/(<img[^<]*?src=)(["'])\/seeyon([^<]*?)\2/ig, "$1$2" + cmp.origin + "$3$2")
    }
    return html;
}
/**
 * 回复列表footer焦点事件
 */
function content_div_focus() {
    //TODO 回复框
    document.getElementById("reply_shade").style.display = "block";
    if (_$("#emoji_ontainer").clientHeight != 0) {
        _$("#emoji_ontainer").classList.add("display_none");
        _$("#footer_button").classList.remove("see-icon-v5-common-keyboard");
        _$("#footer_button").classList.add("see-icon-v5-common-expression");
    }
    if (cmp.os.ios ) {
        footerAuto("", "footer_num1");
    }
}
/**
 * 快速回复列表footer焦点事件
 */
function quick_content_div_focus() {
    //TODO 回复框
    document.getElementById("quick_reply_shade").style.display = "block";
    if (_$("#quick_emoji_ontainer").clientHeight != 0) {
        _$("#quick_emoji_ontainer").classList.add("display_none");
        _$("#quick_footer_button").classList.remove("see-icon-v5-common-keyboard");
        _$("#quick_footer_button").classList.add("see-icon-v5-common-expression");
    }
    if (cmp.os.ios ) {
        footerAuto("", "footer_quick");
    }
}

/**
 * 回复列表footer失去焦点事件
 */
function content_div_blur() {
    //TODO 回复框
    document.getElementById("reply_shade").style.display = "none";
    document.getElementById("footer_num1").style.bottom = "0";
    if (cmp.platform.CMPShell) {
        footerAuto("", "footer_num1");
    }
}
/**
 * 快速回复footer失去焦点事件
 */
function quick_content_div_blur() {
    //TODO 回复框
    document.getElementById("footer_quick").style.bottom = "0";
    if (cmp.platform.CMPShell) {
        footerAuto("", "footer_quick");
    }
}
/**
 * 快速回复footer点击
 */
function quick_content_div_tap() {
    var _this = document.getElementById("quick_footer_button");
    if (_this.classList.contains('see-icon-v5-common-keyboard')) {//切换到键盘
        quickReplyStyle();
    }else{
        if(document.getElementById("quick_reply_content_input").classList.contains("emojiStyle")){
            document.getElementById("quick_reply_content_input").classList.remove("emojiStyle");
        }
    }
    document.getElementById("quick_reply_content_input").focus();

}
/**
 * 快速回复footer点击
 */
function content_div_tap() {
    var _this = document.getElementById("footer_button");
    if (_this.classList.contains('see-icon-v5-common-keyboard')) {
        replyStyle();
    }else{
        if(document.getElementById("reply_content").classList.contains("emojiStyle")){
            document.getElementById("reply_content").classList.remove("emojiStyle");
        }
    }
    document.getElementById("reply_content").focus();
}

function footerAuto(_headerId, _footerId) {
    return null;
    //TODO 回复框
    if(cmp.os.ios){//大果子系统
        setTimeout(function() { //等待键盘完全被弹起
            var staticHeight = document.body.clientHeight;
            var ThisHeight = window.innerHeight; // 除去窗口外屏高
            var scrollTop = document.querySelector('body').scrollTop;
            if(cmp.platform.wechat){
                scrollTop = staticHeight - ThisHeight;
                // document.querySelector('body').scrollTop = scrollTop; 会白屏
            }
            if (_headerId) {
                _$("#" + _headerId).style.top = scrollTop + "px";
            }
        }, 500);
    }


    // setTimeout(function() { //键盘被弹起
    //     var ThisHeight = window.innerHeight;
    //     var position;
    //     if (ThisHeight < CMPFULLSREENHEIGHT) {
    //         var scrollTop = document.querySelector('body').scrollTop;
    //         position = CMPFULLSREENHEIGHT - ThisHeight - scrollTop;
    //         if (position < 0) {
    //             _$("#" + _footerId).style.bottom = "0px";
    //             if(cmp.platform.wechat){
    //                 _$("#" + _footerId).style.bottom = "60px";
    //             }
    //             if (_headerId) {
    //                 _$("#" + _headerId).style.top = CMPFULLSREENHEIGHT - ThisHeight + "px";
    //             }
    //         } else {
    //             if(cmp.os.android){
    //                 _$("#" + _footerId).style.bottom = "0px";
    //             }else{
    //                 _$("#" + _footerId).style.bottom = position + "px";
    //             }
    //             if(cmp.platform.wechat){
    //                 _$("#" + _footerId).style.bottom = "60px";
    //             }
    //             if (_headerId) {
    //                 _$("#" + _headerId).style.top = 0 + "px";
    //             }
    //         }
    //     } else {
    //         _$("#" + _footerId).style.bottom = 0;
    //         if (_headerId) {
    //             _$("#" + _headerId).style.top = 0;
    //         }
    //     }
    // }, 750);
}

//输入框中过滤输入法自带表情
function filteremoji(content) {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    emojireg = content.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}
//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function showfootMenu(){
    var items = [];
    if(hasFav){//可收藏
        if(isFav){
            items.push({
                key:"1",
                name:"<span>" + cmp.i18n("bbs.h5.cancleCollect") + "</span>",
                name2: cmp.i18n("bbs.h5.cancleCollect")
            })
        }else{
            items.push({
                key:"1",
                name:"<span>"+ cmp.i18n("bbs.h5.collect") +"</span>",
                name2:cmp.i18n("bbs.h5.collect")
            })
        }

    }
    if(canDel){//可删除
        items.push({
            key:"2",
            name:"<span>"+ cmp.i18n("bbs.h5.delete") +"</span>",
            name2:cmp.i18n("bbs.h5.delete")
        })
    }
    cmp.dialog.actionSheet(items, cmp.i18n('news.h5.cancel'),
        function (item) {
            var key = item.key;
            if(key == 1){
                collectOrNotBbs();
            }
            if(key == 2){
                deleteBbs();
            }
        }, function () {
        }
    );
}

function showQuickFooter(){
    //TODO 回复框
    _$("#footer_quick").style.display = "block";
    _$("#doc-view-operate").style.display = "none";
    if(!cmp.platform.wechat){//微信这个切换无法让键盘弹出改变window.innerHeight，所以要用户手动触发
        _$("#quick_reply_content_input").focus();
    }
}
function hideQuickFooter(){
    //TODO 回复框
    quick_content_div_blur();
    _$("#quick_reply_shade").style.display = "none";
    _$("#doc-view-operate").style.display = "block";
    _$("#footer_quick").style.display = "none";
}

function renderHotList(data){
    var liTpl_reply = document.getElementById("bbs_praise_reply_js").innerHTML;
    var html_replyPage = cmp.tpl(liTpl_reply, data);
    return html_replyPage;
}

function hotListTap() {
    if(canReply){
        // 点击内容区域，弹出框
        cmp("#praiseList").on('tap', ".bbs-reply-area", function(e) {
            var thisDom = this;
            showQuickFooter();
            document.getElementById("quick_reply_content_input").setAttribute("placeholder", cmp.i18n("bbs.h5.reply") + " " + thisDom.getAttribute("replyName"));
            document.getElementById("quick_reply_content_input").focus();
            setTimeout(function() {
                document.getElementById("quick_reply_content_input").focus();
            }, 200);
            replyBox.init();
            var flag = thisDom.getAttribute("replyFlag");
            if (flag == '4') {
                replyBox.replyFlag = "5";
                replyBox.topReplyId = thisDom.getAttribute("replyId");
            } else {
                replyBox.replyFlag = "6";
                replyBox.topReplyId = thisDom.getAttribute("topReplyId");
            }
            replyBox.toReplyId = thisDom.getAttribute("replyId");
        });
    }
}

function resizePraisePic(){
    var imgList = document.querySelectorAll("#praiseList .bbs-comment-content img");
    if(imgList && imgList.length>0){
        for(var i = 0 ; i < imgList.length ; i++){
            var tempPic = imgList[i];
            tempPic.style.height = "";
            tempPic.style.maxWidth = "100%";
        }
    }
}

/**
 * 更改点赞样式
 * 协同 V5OA-145958 风暴测试：移动端讨论评论可以点赞两次
 */
function alterPraiseStyle(fromHot){
    if (fromHot) {
        //同步最赞回复点赞样式
        var pDom = document.getElementById("replyUl");
    } else {
        //同步回复点赞样式
        var pDom = document.getElementById("praiseList");
    }
    if(pDom){
        var rp = pDom.getElementsByClassName("reply-praise")[0];
        var thisDom = rp.querySelector(".see-icon-v5-common-praise");
        if(thisDom){
            thisDom.classList.add("cmp-active");
            thisDom.classList.remove("see-icon-v5-common-praise");
            thisDom.classList.add("see-icon-v5-common-praise-fill");
            thisDom.style.color = "#48a0de";
            var likeNum = parseInt(thisDom.nextElementSibling.innerText);
            thisDom.nextElementSibling.innerText = likeNum + 1;
        }
    }
}

function switchActiveEditableDiv(type){
    var commonDiv = document.getElementById("reply_content");
    var quickDiv = document.getElementById("quick_reply_content_input");
    if(type === "common"){
        commonDiv.setAttribute("contenteditable","true");
        quickDiv.setAttribute("contenteditable","false");
    }
    if(type === "fast"){
        commonDiv.setAttribute("contenteditable","false");
        quickDiv.setAttribute("contenteditable","true");
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

/**
 * 取第一个字
 * @param str
 * @param len
 * @returns {string}
 */
function getTitleChar(str){
    charCode = str.charCodeAt(0);
    if(charCode>=0&&charCode<128){
        return str.substr(0,2);
    }
    return str.substr(0,1);
}

/**
 * 取色
 * @param str
 * @param len
 * @returns {string}
 */
function getRandomColor(str){
    var code = str.charCodeAt(0);
    var result = code % 10;
    var r = (result * 5201314)%255;
    var g = (result * 19777)%255;
    var b = (result * 77777)%255;
    return r + ","+ g + "," + b;
}

function getPraiseSum() {
    document.getElementById("bbsPraiseSum").innerText = document.getElementById("bbsPraiseSumInput").value;
}
function showHideReplyFooter(type){
    if(type === 1){
        _$("#footer_num1").style.display = "block";
        _$("#detailReplyFakeFooter").style.display = "none";
    }else if(type === 2){
        _$("#footer_num1").style.display = "none";
        _$("#detailReplyFakeFooter").style.display = "block";
    }
}