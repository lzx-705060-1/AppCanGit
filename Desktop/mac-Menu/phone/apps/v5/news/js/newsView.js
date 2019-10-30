var urlParam = {};
var newsPigeonhole = false;
var canComment = false;
var showComment = false;
var hasAttchment = false;
var canShare = false; //分享
var canPrise = false; //点赞
var hasDoc = false; //收藏
var lockNews = false;
var affairId = false;
var replyNum;
var isReplay = false;
var title;
var isShare = false;
var _data = null;
//适配切换输入法弹出框的问题
var input_position_interval;
cmp.ready(function() {
    cmp.dialog.loading();

    if (_getQueryString("openFrom") == "robot" || _getQueryString("VJoinOpen") == "VJoin" ) {
        //对VJoin穿透过来的新闻进行处理
        urlParam['affairId'] = false;
        urlParam['newsId'] = _getQueryString("newsId");
        urlParam['comeFrom'] = _getQueryString("comeFrom") ? _getQueryString("comeFrom") : 0;
    } else {
        urlParam = getUrlParam();
    }

    if (!urlParam) {
        cmp.href.closePage();
        return;
    }
    affairId = urlParam["affairId"] == undefined ? false : urlParam['affairId'];
    postData.newsId = urlParam['newsId'];
    isShare = urlParam["fromShare"] == undefined ? false : true;
    // 头部显示(微协同屏蔽Header)
    headerShowOrNot();
    prevPage();
    $s.CmpNews.newsDetails(urlParam['newsId'], urlParam['comeFrom'], affairId, "", {
        repeat: true, //当网络掉线时是否自动重新连接
        success: function(result) {
            cmp.dialog.loading(false);
            _data = result;
            viewCallBack(result);
            setWaterMark(result.waterMarkMap, "news_content");
            setWaterMark(result.waterMarkMap, "news_brief");
            cmp.event.orientationChange(function(res){
                window.location.reload();
            });
        },
        error: function(error) {
            cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                //cmp处理了这个错误
            } else {
                //customHandle(error) ;//走自己的处理错误的逻辑
                cmp.notification.alert(cmp.i18n("news.h5.newsState"), function() {
                    backFrom();
                }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
            }
        }
    });
    document.title = cmp.i18n("news.h5.newsDetails");
    cmp("body").on('touchmove', "#reply_shade", function() {
        this.style.display = "none";
        document.getElementById("reply_content").blur();
    });
    _$("#reply_content").addEventListener("input", function() {
        var auditInput = this.innerText;
        if (getReallength(auditInput) > 400) {
            this.innerText = this.innerText.slice(0, 200);
            this.blur();
            cmp.notification.alert(cmp.i18n("news.h5.reply.numMost"), function() {
                _$("#reply_content").setAttribute("contenteditable", true);
            }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
        }
    });

    if(document.getElementById("footer_num")){
        cmp.footerAuto('#footer_num');
    }
    cmp.event.orientationChange(function(res){
        if(isReplay){
            // footerAuto("", "footer_num");
        }
    });
});

function setWaterMark(result, id) {
    if (result && result.waterMarkEnable && result.waterMarkEnable == "true") {
        var data = {};
        if (result.waterMarkName) {
            data.userName = result.waterMarkName;
        }
        if (result.waterMarkDeptName) {
            data.department = result.waterMarkDeptName;
        }
        if (result.waterMarkTime) {
            data.date = result.waterMarkTime;
        }
        var imgUrl = cmp.watermark(data).toBase64URL();
        if (id == "news_brief") {
            document.getElementById(id).style.backgroundImage = "url(" + imgUrl + ")";
            document.getElementById(id).style.backgroundRepeat = "repeat";
            document.getElementById(id).style.backgroundSize = "200px 100px";
            document.getElementById(id).style.backgroundColor = "#fff";
        }
        if (id == "news_content") {
            var warterMark = setInterval(function() {
                if (document.getElementById(id).firstElementChild) {
                    if (document.getElementById(id).firstElementChild.clientHeight < document.getElementById(id).clientHeight) {
                        document.getElementById(id).style.backgroundImage = "url(" + imgUrl + ")";
                        document.getElementById(id).style.backgroundRepeat = "repeat";
                        document.getElementById(id).style.backgroundSize = "200px 100px";
                        document.getElementById(id).style.backgroundColor = "#fff";
                        window.clearInterval(warterMark);
                    } else {
                        document.getElementById(id).firstElementChild.style.backgroundImage = "url(" + imgUrl + ")";
                        document.getElementById(id).firstElementChild.style.backgroundRepeat = "repeat";
                        document.getElementById(id).firstElementChild.style.backgroundSize = "200px 100px";
                        document.getElementById(id).firstElementChild.style.backgroundColor = "#fff";
                        window.clearInterval(warterMark);
                    }

                }
            }, 100);
        }
    }
}

/**
 * 详情数据请求回调
 * @param result
 */
function viewCallBack(result) {
    if (!result || result.stateFlag == false) {
        if (document.getElementById("shadow")) {
            document.body.removeChild(document.getElementById("shadow"));
        }
        if (result.subState == 10 || result.state == 20) {
            cmp.notification.alert(cmp.i18n("news.h5.dealOrDelete"), function() {
                backFrom();
            }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
        } else {
            cmp.notification.alert(cmp.i18n("news.h5.newsState"), function() {
                backFrom();
            }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
        }
    } else if (result.lockState == 1) {
        cmp.notification.alert(result.lockMember + cmp.i18n("news.h5.dealOnPc"), function() {
            backFrom();
        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
    } else {
        title = result.title;
        loadData(result);
    }
}

function loadData(data) {
    replyNum = Number(data.commentNumber);
    if (data.replyFlag && data.state == 30) {
        canComment = true;
        if (data.commentNumber > 999) {
            _$("#comment .news-view-operate-comment-name").innerHTML = "999+";
        } else {
            _$("#comment .news-view-operate-comment-name").innerHTML = data.commentNumber;
        }
        _bindReplyFunction();
    }

    if (!data.shareWeixin || urlParam['comeFrom'] == "1" || !cmp.platform.CMPShell) { //是否分享
        canShare = false;
    } else { //TODO 加事件 下个任务项再见
        canShare = true;
        _bindShareFunction();
    }

    if (urlParam['comeFrom'] == 0 && data.hasDoc) { //是否收藏
        hasDoc = true;
        _bindFavFuction();
        if (data.fav) {
            _$(".news-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill");
            _$(".news-view-operate-store-icon").classList.remove("see-icon-v5-common-collect");
            _$(".news-view-operate-store-name").innerText = cmp.i18n("news.h5.favcancel");
            _$(".news-view-operate-store-name").value = "true";
        } else {
            _$(".news-view-operate-store-icon").classList.remove("see-icon-v5-common-collect-fill");
            _$(".news-view-operate-store-icon").classList.add("see-icon-v5-common-collect");
            _$(".news-view-operate-store-name").innerText = cmp.i18n("news.h5.fav");
            _$(".news-view-operate-store-name").value = "false";

        }
    }

    if (data.state == 10) {
        canShare = false;
        canPrise = false;
        document.getElementById("approval").style.display = "block";
        if(cmp.os.android){
            setInterval(function() {
                footerAuto("", "approval");
            }, 500);
        }
        auditNews();
        lockNews = true;
    }else{
        if(data.state == 100){//归档不能赞
            canPrise = false;
        }else{
            canPrise = true;
        }
    }
    //新加下方点赞
    var bottomDiv = document.getElementById("praise");
    var iconSpan = document.getElementById("praiseIcon");
    var iconSpan1 = document.getElementById("praiseIcon1");
    if(data.prise=="1"){//可点赞

    }else{//已点赞
        iconSpan.classList.remove("see-icon-v5-common-praise");
        iconSpan.classList.add("see-icon-v5-common-praise-fill");
        iconSpan1.classList.remove("see-icon-v5-common-praise");
        iconSpan1.classList.add("see-icon-v5-common-praise-fill");
        iconSpan.style.color = "#00B4FC";
        iconSpan1.style.color = "#00B4FC";
        document.getElementById("priseTextSpan").innerText = cmp.i18n("news.h5.liked");
        //$("#newsPraiseSum").text(parseInt($("#newsPraiseSum").text())+1);
        bottomDiv.setAttribute("onclick", "");
    }
    fixBarLayout();

    showComment = data.replyFlag && (data.state == 30 || data.state == 100);

    if (data.state == 100) {
        newsPigeonhole = true;
    }

    var liTpl_brief = document.getElementById("news_brief_js").innerHTML;
    var table_brief = document.getElementById('news_brief');
    var html_brief = cmp.tpl(liTpl_brief, data);
    table_brief.innerHTML = table_brief.innerHTML + html_brief;

    var liTpl_att = document.getElementById("attachmentList_js").innerHTML;
    var table_att = document.getElementById('attachmentList');
    var html_att = cmp.tpl(liTpl_att, data);
    table_att.innerHTML = table_att.innerHTML + html_att;

    if (data.fromDoc && data.state == 100) {
        document.getElementById("newsPraise").style.display = "none";
        document.getElementById("newsPraiseSum").style.display = "none";
    }
    //附件展示
    if (data["attachmentCount"] > 0 && !isShare) {
        hasAttchment = true;
        initFile("#attchemntFileList", data.attachmentList);
        document.getElementById("scroll").style.height = document.getElementById("scroll").clientHeight - 40 + "px";
        //设置数量
        var attContainer = _$("#att_list");
        attContainer.querySelector("#att_file_count").innerText = data.fileAttachmentCount;
        attContainer.querySelector("#att_ass_count").innerText = data.assAttachmentCount;
        addAttchmentFileClick();
        initAttList();
    } else {
        //没有附件直接移除容器
        document.getElementById("att_list").parentNode.removeChild(document.getElementById("att_list"));
        //_$("#att_list").remove();
        // _$("#scroll").remove();
    }

    if (isShare) {
        var buttonCotrolPart = document.getElementById("buttonCotrol");
        var clearLeftPart = document.getElementById("_clear_left");
        var sourceFromPart = document.getElementById("_sourceFrom");
        var newsViewOperatePart = document.getElementById("news-view-operate");
        var headImgPart = document.getElementById("headImg");
        var list_cont_info = document.getElementById("list_cont_info");
        var shareFromPart = document.getElementById("_shareFrom");
        if(headImgPart){
            headImgPart.style.display = "none";
        }
        if(buttonCotrolPart){
            buttonCotrolPart.style.display = "none";
        }
        if(clearLeftPart){
            clearLeftPart.style.display = "none";
        }
        if(sourceFromPart){
            sourceFromPart.style.display = "none";
        }
        if(newsViewOperatePart){//footer
            newsViewOperatePart.style.display = "none";
        }
        if(list_cont_info){
            list_cont_info.style.marginLeft = "0px";
        }
        if(shareFromPart){
            shareFromPart.style.marginLeft = "0px";
            shareFromPart.innerText = data.shareTime + "  " + data.shareFrom;
        }
    }

    _initLayout(isShare);

    var bodyType = SeeyonContent.getBodyCode(data.dataFormat);
    var content = data.content;
    var hotList = data.hotReplyList;
    var hotContent = "";
    if(hotList && !isShare){
        hotContent =  renderHotList(hotList);
    }
    if (data.ext5) {
        bodyType = SeeyonContent.getBodyCode("Pdf");
        content = data.ext5;
    }
    _initContent(bodyType, content + hotContent, data.updateDate);
    if (showComment || data["attachmentCount"] > 0) {
        loadReplyAll(data);
    }
    window.setTimeout(function() {
        if(hotList){
            hotParise();
        }
        cmp.i18n.detect();
        toggleBrief();
        SeeyonContent.reLayout("news_content");
    },500);
    window.setTimeout(function() {
        headImg();
    },1000);

}
//正文展现
var seeyonContentIscroll;

function _initContent(bodyType, content, updateDate, refresh) {
    var contentConfig = {
        "target": "news_content",
        "bodyType": bodyType,
        "lastModified": updateDate,
        "content": content,
        "moduleType": "8",
        "rightId": "",
        "viewState": "",
        "momentum": true,
        "ext": {
            "reference": urlParam['newsId']
        },
        "onScrollBottom": function() {
            _toggleContent(true); // 展示意见区域
            cmp.listView("#scroll").refresh();
        }
    }

    // 初始化正文
    seeyonContentIscroll = SeeyonContent.init(contentConfig);
}
//最赞回复列表
function renderHotList(data){
    var liTpl_reply = document.getElementById("news_hot_reply_js").innerHTML;
    var html_replyPage = cmp.tpl(liTpl_reply, data);
    return html_replyPage;
}
//初始化附件
function initFile(selector, fileList) {
    var loadParam = {
        selector: selector,
        atts: fileList
    }
    return new SeeyonAttachment({
        loadParam: loadParam
    });
}
// 设置元素布高度等
function _initLayout(_isShare) {
    // 设置正文区域高度
    var pageH = window.innerHeight;
    //var headerHeight = _$("#news_header") == null ? 0 : _$("#news_header").offsetHeight;
    var titleHeight = _$("#news_brief").offsetHeight;
    var barH = hasAttchment ? 37 : 0;
    var favH = (hasDoc || canComment || canShare || canPrise) ? 50 : 0;
    var approvalFooterHeight = _$("#approval") == null ? 0 : _$("#approval").offsetHeight;
    var cHeight = pageH - barH - favH - approvalFooterHeight + 1;
    if (_isShare) {
        _$("#news_content").style.height = cHeight + 44 + "px";
    } else {
        _$("#news_content").style.height = cHeight + "px";
    }

    _toggleContent(false);


    if (hasAttchment) {
        _$("#scroll-shade").addEventListener("tap", function() {
            _toggleContent(true);
            cmp.listView("#scroll").refresh();
        }, false);
    }


}
// 附件 评论区域显示和影藏
function _toggleContent(show) {
    if (!hasAttchment) {
        return;
    }
    var cHeight = 0;
    if (!show) {
        cHeight = _$("#news_content").offsetHeight;
        _$("#scroll-shade").style.display = "";
        _$("#scroll").style.webkitTransform = "translate(0px, " + (cHeight) + "px)";
        _$("#scroll").style.transform = "translate(0px, " + (cHeight) + "px)";
        cmp.listView("#scroll").disable();
    } else {
        _$("#scroll-shade").style.display = "none";
        _$("#scroll").style.webkitTransform = "translate(0px, " + cHeight + "px)";
        _$("#scroll").style.transform = "translate(0px, " + cHeight + "px)";
        cmp.listView("#scroll").enable();
    }
}
// 评论列表及评论点赞功能控制
function loadReplyAll(result) {
    if (showComment) {
        loadReply(result);
    }
    if (showComment) {
        loadReplySum(result);
    }
    if (canComment) {
        if (result.prise == 0) {
            var span = document.getElementById("newsPraise");
            var iconSpan = document.getElementById("praiseIcon");
            var iconSpan1 = document.getElementById("praiseIcon1");
            span.classList.remove("see-icon-v5-common-praise");
            span.classList.add("see-icon-v5-common-praise-fill");
            iconSpan.classList.remove("see-icon-v5-common-praise");
            iconSpan.classList.add("see-icon-v5-common-praise-fill");

            iconSpan1.classList.remove("see-icon-v5-common-praise");
            iconSpan1.classList.add("see-icon-v5-common-praise-fill");
            document.getElementById("praise").setAttribute("onclick", "");
            iconSpan1.setAttribute("onclick", "");
        }
        replyDialog();
        newsReply(urlParam['newsId']);
    }

}

function loadReplySum(data) {
    _$("#reply_sum").style.display = "none";
    var liTpl = document.getElementById("reply_sum_js").innerHTML;
    var table = document.getElementById('reply_sum');
    var html = cmp.tpl(liTpl, data);
    table.innerHTML = table.innerHTML + html;
    cmp.i18n.detect();
}

function initAttList() {
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
}

function loadReply(result) {
    var param = {
        "newsId": urlParam['newsId'],
        "newsTypeId": result.newsTypeId,
        "createUserId": result.newsTypeId
    };
    // 滚动容器
    cmp.listView("#replyDiv", {
        imgCache: true,
        config: {
            isClear: true,
            pageSize: 20,
            params: {},
            dataFunc: function(params, options) {
                param.pageNo = params["pageNo"];
                param.pageSize = params["pageSize"];
                $s.CmpNews.replays("", param, {
                    success: function(result) {
                        options.success(result);
                    }
                });
            },
            renderFunc: renderCommentData
            // customScrollMoveEvent : function(scrollY) { // 启用自定义时，其他参数不要传
            //   if (scrollY > 30) {
            //     _toggleContent(false);
            //   }
            // }
        },
        down: {
            contentdown: cmp.i18n("news.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("news.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("news.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("news.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("news.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("news.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
}

function renderCommentData(data, isRefresh) {
    var liTpl_reply = document.getElementById("news_reply_js").innerHTML;
    var table_reply = document.getElementById('news_reply');
    var html_reply = cmp.tpl(liTpl_reply, data);
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        table_reply.innerHTML = html_reply;
    } else {
        table_reply.innerHTML = table_reply.innerHTML + html_reply;
    }
    if (newsPigeonhole) {
        var aaa = document.getElementsByClassName("reply_flag");
        if (aaa) {
            for (var i = 0; i < aaa.length; i++) {
                aaa[i].style.display = "none";
            }
        }
    }
    cmp.i18n.detect();
    commentPrise();
    window.setTimeout(function() {
        cmp.listView("#replyDiv").refresh();
    }, 500);
}

function addAttchmentFileClick() {
    if (document.getElementById("attchmentFile") != null) {
        document.getElementById("attchmentFile").addEventListener("tap", function() {
            _toggleContent(true);
            cmp.listView("#scroll").refresh();
            cmp.listView("#scroll").scrollTo(0, 0);
        });
        document.getElementById("att_list").addEventListener("tap", function() {
            if (_$("#attchemntFileList").clientHeight > 50) {
                document.getElementById("attchemntFileList").style.display = "none";
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-down");
            } else {
                document.getElementById("attchemntFileList").style.display = "";
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-down");
            }
            cmp.listView("#scroll").refresh();
        });
    } else {
        document.getElementById("att_list").style.display = "none";
    }
}


//新闻点赞
function newsPrise() {
    var result = null;
    $s.CmpNews.addPraiseForNews(urlParam['newsId'], "", {
        repeat: true, //当网络掉线时是否自动重新连接
        success: function(result) {
            if (result.state == "noComment") {
                cmp.notification.alert(cmp.i18n("news.h5.newsNoPrise"), function() {
                    document.getElementById("praise").setAttribute("onclick", "");
                }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
            } else if (result.state == "newsState") {
                cmp.notification.alert(cmp.i18n("news.h5.newsState"), function() {
                    backFrom();
                }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
            } else {
                var span = document.getElementById("newsPraise");
                var bottomDiv = document.getElementById("praise");
                var iconSpan = document.getElementById("praiseIcon");
                var iconSpan1 = document.getElementById("praiseIcon1");
                span.classList.remove("see-icon-v5-common-praise");
                iconSpan.classList.remove("see-icon-v5-common-praise");
                iconSpan1.classList.remove("see-icon-v5-common-praise");
                span.classList.add("see-icon-v5-common-praise-fill");
                iconSpan.classList.add("see-icon-v5-common-praise-fill");
                iconSpan1.classList.add("see-icon-v5-common-praise-fill");
                span.style.color = "#00B4FC";
                iconSpan.style.color = "#00B4FC";
                iconSpan1.style.color = "#00B4FC";
                var newsPraiseSum = document.getElementById("newsPraiseSum").innerText;
                document.getElementById("priseTextSpan").innerText = cmp.i18n("news.h5.liked");
                document.getElementById("newsPraiseSum").innerText = parseInt(newsPraiseSum) + 1;
                //$("#newsPraiseSum").text(parseInt($("#newsPraiseSum").text())+1);
                // document.getElementById("newsPraise").setAttribute("onclick", "");
                bottomDiv.setAttribute("onclick", "");
                iconSpan1.setAttribute("onclick", "");
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

//回复点赞
function commentPrise() {
    cmp("#news_reply").on('tap', ".reply-praise", function (e) {
        var aaa = this.lastElementChild;
        var newsId = urlParam['newsId'];
        var likeNum = parseInt(aaa.getAttribute("likeNum"), 10);
        var commentId = aaa.getAttribute("commentId");
        var likeBtns = document.querySelectorAll('.comment_like_btn_' + commentId);
        var likeNums = document.querySelectorAll('.comment_like_num_' + commentId);
        if (!likeBtns[0].classList.contains("cmp-active")) {
            $s.CmpNews.addPraiseForComment(commentId, newsId, "", {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function (result) {
                    if (result.state == "noComment") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsNoPrise"), function () {
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "newsState") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsState"), function () {
                            backFrom();
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "commentDelete") {
                        cmp.notification.alert(cmp.i18n("news.h5.commentDelete"), function () {
                            location.reload(true);
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else {
                        // aaa.classList.add("cmp-active");
                        // aaa.classList.remove("see-icon-v5-common-praise");
                        // aaa.classList.add("see-icon-v5-common-praise-fill");
                        // aaa.style.color = "#00B4FC";

                        for (var i = 0, len = likeBtns.length; i < len; i++) {
                            likeNums[i].innerText = likeNum + 1;
                            likeBtns[i].setAttribute("likeNum", likeNum);
                            likeBtns[i].classList.add("cmp-active");
                            likeBtns[i].classList.remove("see-icon-v5-common-praise");
                            likeBtns[i].classList.add("see-icon-v5-common-praise-fill");
                            likeBtns[i].style.color = "#00B4FC";
                        }
                    }
                },
                error: function (error) {
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });

        }
        e.stopPropagation();
    });
}
function hotParise() {
    //最赞回复点赞
    cmp("#hotListUl").on('tap', ".reply-praise", function (e) {
        var aaa = this.lastElementChild;
        var newsId = urlParam['newsId'];
        var likeNum = parseInt(aaa.getAttribute("likeNum"), 10);
        var commentId = aaa.getAttribute("commentId");
        var likeBtns = document.querySelectorAll('.comment_like_btn_' + commentId);
        var likeNums = document.querySelectorAll('.comment_like_num_' + commentId);
        if (!likeBtns[0].classList.contains("cmp-active")) {
            $s.CmpNews.addPraiseForComment(commentId, newsId, "", {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function (result) {
                    if (result.state == "noComment") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsNoPrise"), function () {
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "newsState") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsState"), function () {
                            backFrom();
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "commentDelete") {
                        cmp.notification.alert(cmp.i18n("news.h5.commentDelete"), function () {
                            location.reload(true);
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else {
                        for (var i = 0, len = likeBtns.length; i < len; i++) {
                            likeNums[i].innerText = likeNum + 1;
                            likeBtns[i].setAttribute("likeNum", likeNum);
                            likeBtns[i].classList.add("cmp-active");
                            likeBtns[i].classList.remove("see-icon-v5-common-praise");
                            likeBtns[i].classList.add("see-icon-v5-common-praise-fill");
                            likeBtns[i].style.color = "#00B4FC";
                        }
                    }
                },
                error: function (error) {
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });

        }
        e.stopPropagation();
    });
}
var postData = {
    newsId: "",
    content: "",
    toReplyId: "",
    toMemberId: "",
    type: "0"
};
postData.init = function() {
    postData.content = '';
    postData.toReplyId = '';
    postData.toMemberId = '';
    postData.type = '0';
};

function replyDialog() {
    // document.getElementById("intoInputBtn").setAttribute("placeholder", cmp.i18n('news.h5.saySomething'));
    // 滑动事件--恢复成默认一级回复
    cmp("body").on('touchmove', "#news_reply", function() {
        postData.init();
        document.getElementById("reply_text").setAttribute("placeholder", cmp.i18n('news.h5.saySomething'));
        document.getElementById("send_reply").removeAttribute("disabled");
    });

    document.getElementById("reply_text").addEventListener("blur", function() {
        this.setAttribute("placeholder", cmp.i18n('news.h5.saySomething'));
    });
    // 点击内容区域，弹出框
    cmp("#news_reply").on('tap', ".reply_cell", function(e) {
        var thisDom = this;
        document.getElementById("reply_content").setAttribute("placeholder", cmp.i18n("news.h5.reply") + " " + thisDom.getAttribute("replyName"));
        postData.init();
        var commentType = thisDom.getAttribute("commentType");
        if (parseInt(commentType) == 2) {
            postData.type = parseInt(commentType);
        } else {
            postData.type = parseInt(commentType) + 1;
        }
        postData.toReplyId = thisDom.getAttribute("commentId");
        postData.toMemberId = thisDom.getAttribute("toMemberId");
        _$("#replyFooterDiv1").style.display = "none";
        _$("#replyFooterDiv2").style.display = "block";
        document.getElementById("reply_content").focus();
        e.stopPropagation();
    });

    //评论删除
    cmp("#news_reply").on('tap', ".news-comment-delete", function(e) {
        var eThis = this;
        cmp.notification.confirm(cmp.i18n('news.h5.sureToDeleteReply'), function(e1) {
            if (e1 == 1) {
                deleteReply(eThis.getAttribute("replyId"), eThis.getAttribute("commentType"));
                postData.init();
            }
        }, null, [cmp.i18n('news.h5.cancel'), cmp.i18n('news.h5.OK')]);
        e.stopPropagation();
    });
}
//回复的发送
var doubleReplyCheck = false; //用于连点的防护
function newsReply(newsId) {
    cmp("footer").on('tap', "#send_reply", function(e) {
        if(document.getElementById("send_reply").classList.contains("reply_gray")){
            return;
        }
        if (doubleReplyCheck) {
            return;
        }
        cmp.dialog.loading();
        doubleReplyCheck = true;
        var reply_text = document.getElementById("reply_content").innerText;
        var len = reply_text.length;
        if (len > 200) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            cmp.notification.alert(cmp.i18n("news.h5.commentLength") + len + cmp.i18n("news.h5.commentLengthFooter"), function() {}, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
        } else if (len === 0 || reply_text.trim().length === 0) {
            cmp.dialog.loading(false);
            doubleReplyCheck = false;
            cmp.notification.alert(cmp.i18n("news.h5.commentNotNull"), function() {}, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
        } else {
            postData.content = reply_text;
            //特殊表情转换
            if (cmp.Emoji) {
                var cemoji = cmp.Emoji();
                if (reply_text) {
                    postData.content = filteremoji(cemoji.EmojiToString(reply_text));
                }
            }
            postData.newsId = newsId;
            if (postData.type == '0') {
                postData.toReplyId = newsId;
            }
            $s.CmpNews.addReplay({}, postData, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    doubleReplyCheck = false;
                    cmp.dialog.loading(false);
                    if (result.state == "com") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsNoComment"), function() {
                            location.reload(true);
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "-1") {
                        cmp.notification.alert(cmp.i18n("news.h5.newsState"), function() {
                            backFrom();
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else if (result.state == "-2") {
                        cmp.notification.alert(cmp.i18n("news.h5.commentDelete"), function() {
                            location.reload(true);
                        }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                    } else {
                        loadReply(_data);
                        postData.init();
                        _$("#reply_content").innerHTML = "";
                        _$("#reply_content").blur();
                        cmp.notification.toast(cmp.i18n("news.h5.reply.success"), "center", 1500);
                        _$("#replyFooterDiv1").style.display = "block";
                        _$("#replyFooterDiv2").style.display = "none";
                        var rNumber = _$("#comment .news-view-operate-comment-name").innerText;
                        if (rNumber === "999+") {
                            _$("#comment .news-view-operate-comment-name").innerHTML = "999+";
                        } else {
                            rNumber = parseInt(rNumber);
                            rNumber++;
                            if(rNumber > 999){
                                _$("#comment .news-view-operate-comment-name").innerHTML = "999+";
                            }else{
                                _$("#comment .news-view-operate-comment-name").innerHTML = rNumber;
                            }
                        }
                    }
                    cmp.dialog.loading(false);
                },
                error: function(error) {
                    doubleReplyCheck = false;
                    cmp.dialog.loading(false);
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {
                        //cmp处理了这个错误
                    } else {
                        //customHandle(error) ;//走自己的处理错误的逻辑
                    }
                }
            });
        }
    });
}

//删除回复
function deleteReply(replyId, replyType) {
    $s.CmpNews.removeReplyById(replyId, replyType, "", {
        repeat: false, //当网络掉线时是否自动重新连接
        success: function(result) {
            loadReply(_data);
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

//新闻审核
function auditNews() {
    _$("#auditInput").addEventListener("input", function() {
        var auditInput = this.innerText;
        if (auditInput && auditInput.length > 150) {
            this.innerText = this.innerText.slice(0, 150);
            this.blur();
            this.setAttribute("contenteditable", false);
            cmp.notification.toast(cmp.i18n("news.h5.audit.dealNumMost"), "bottom", 3000);
            setTimeout(function() {
                _$("#auditInput").setAttribute("contenteditable", true);
            }, 3000);
        }
    });

    cmp(".app-btns").on('tap', ".auditTap", function(e) {
        document.getElementById("auditInput").blur();
        document.getElementById("approval").setAttribute("disabled", "true");
        var auditInput = document.getElementById("auditInput").innerText;
        var auditParam = {
            "newsId": urlParam['newsId'],
            "form_oper": e.target.getAttribute("value"),
            "auditAdvice": auditInput
        };
        $s.CmpNews.newsAudit({}, auditParam, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                //触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    // data: "{affairid:'" + urlParam[affairId] + "',type: 'delete'}"
                    data: {type: 'update'}
                })
                if (result.state == "error") {
                    cmp.notification.alert(cmp.i18n("news.h5.newsState"), function() {
                        backFrom();
                    }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                } else if (result.state == "auditAgain") {
                    cmp.notification.alert(cmp.i18n("news.h5.audit.alreadyDeal"), function() {
                        backFrom();
                    }, cmp.i18n("news.h5.alert"), cmp.i18n("news.h5.OK"));
                } else {
                    backFrom();
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
        //document.getElementById("approval").removeAttribute("disabled");
    });
}

function prevPage() {
    /*cmp("header").on('tap', "#goAheadBtn", function(e) {
        backFrom();
    });*/
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}

function backFrom() {
    if (isShare) {
        cmp.href.closePage();
        return;
    }
    if (isReplay) {
        document.getElementById("reply_content").blur();
        document.getElementById("replyFooterDiv1").style.display = "block";
        document.getElementById("replyFooterDiv1").style.display = "none";
        window.setTimeout(function() {
            window.clearInterval(input_position_interval);
            inputBlurFunction();
        }, 100);
        window.setTimeout(function() {
            SeeyonContent.reLayout("news_content");
        }, 300);
        return false;
    }
    if (lockNews) {
        $s.CmpNews.unlockNews(urlParam['newsId'], "", {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {},
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
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

//根据平台判断header是否隐藏
function headerShowOrNot() {
    /*if (cmp.platform.CMPShell) { //cmp壳打开页面

    } else { //非cmp壳打开页面
        cmp.headerHide();
    }*/
    if (document.getElementById("shadow")) {
        document.body.removeChild(document.getElementById("shadow"));
    }
}
/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl) {

    var p = pEl ? pEl : document;

    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}

/**
 * 取字符串实际长度
 * @param str
 * @returns {number}
 */
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
            //up
            _$("#news_brief").style.transform = "translate(0px, -" + _$("#news_brief").clientHeight + "px)";
            _$("#news_content_par").style.transform = "translate(0px, -" + _$("#news_brief").clientHeight + "px)";
        } else {
            //down
            _$("#news_brief").style.transform = "translate(0px, 0px)";
            _$("#news_content_par").style.transform = "translate(0px, 0px)";
        }
    };
}

function _bindFavFuction() {
    cmp("#news-view-operate").on('tap', "#collection", function() {
        if (_$(".news-view-operate-store-name").value == "true") {
            //取消方法
            var params = {
                "docId": -1,
                "sourceId": urlParam['newsId']
            };
            $s.Doc.cancelFavorite(params, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function() {
                    cmp.notification.toastExtend(cmp.i18n("news.h5.favcancelsuccess"), "center", 1000);
                    _$(".news-view-operate-store-name").innerText = cmp.i18n("news.h5.fav");
                    _$(".news-view-operate-store-name").value = "false";
                    _$(".news-view-operate-store-icon").classList.remove("see-icon-v5-common-collect-fill");
                    _$(".news-view-operate-store-icon").classList.add("see-icon-v5-common-collect");
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
        }else if (_$(".news-view-operate-store-name").value == "false") {
            //收藏方法
            var params = {
                "sourceId": urlParam['newsId'],
                "favoriteType": 3,
                "appKey": 8,
                "hasAtt": hasAttchment
            };
            $s.Doc.favorite(params, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    cmp.notification.toastExtend(cmp.i18n("news.h5.favsuccess"), "center", 1000);
                    _$(".news-view-operate-store-name").innerText = cmp.i18n("news.h5.favcancel");
                    _$(".news-view-operate-store-name").value = "true";
                    _$(".news-view-operate-store-icon").classList.remove("see-icon-v5-common-collect");
                    _$(".news-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill");
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
    });
}

function _bindReplyFunction() {
    cmp("#news-view-operate").on('tap', "#comment", function() {
        _$("#news-view-operate").style.display = "none";
        _$("#footer_num").style.display = "table";
        _$("#news_content_par").style.display = "none";
        _$("#scroll").style.display = "none";
        fixAttHeight(1);
        cmp.backbutton.push(backFrom);
        // _$("#reply_text").focus();
        //_toggleContent(true);
        cmp.listView("#replyDiv").refresh();
        _$("#replyFooterDiv1").style.display = "block";
        _$("#replyFooterDiv2").style.display = "none";
        isReplay = true;
    });
    cmp("#replyFooterDiv1").on('tap', "#intoInputBtn", function(e) {
        _$("#replyFooterDiv1").style.display = "none";
        _$("#replyFooterDiv2").style.display = "block";
        checkInputValue();
        setTimeout(function(){
            _$("#reply_content").focus();
        },500);
        e.stopPropagation();
    });

    cmp("#news_content").on('tap', "#moreReply", function(e) {
        _$("#news-view-operate").style.display = "none";
        _$("#footer_num").style.display = "table";
        _$("#news_content_par").style.display = "none";
        _$("#scroll").style.display = "none";
        fixAttHeight(1);
        cmp.backbutton.push(backFrom);
        // _$("#reply_text").focus();
        //_toggleContent(true);
        cmp.listView("#replyDiv").refresh();
        isReplay = true;
    });
}

function _bindShareFunction() {
    cmp("#news-view-operate").on('tap', "#share", function() {
        ShareRecord.share(urlParam['newsId'], 8, title);
    });
}

function inputBlurFunction() {
    _$("#news-view-operate").style.display = "block";
    _$("#footer_num").style.display = "none";
    _$("#replyDiv").style.transform = "";
    _$("#news_content_par").style.display = "block";
    _$("#scroll").style.display = "block";
    fixAttHeight(0);
    isReplay = false;
    //弹出一个div浮层，向统一栈压一次逻辑返回的回调函数，当整个div浮层被逻辑销毁时，必须出栈一次，弹出逻辑返回的回调函数。
    //http://open.seeyon.com/seeyon/cmp2.0/book/chapter-3/API.html#backbutton
    cmp.backbutton.pop();
}
/**
 * 修正输入回复时的附件区高度
 * @param type 0-正常时 1-回复时
 */
function fixAttHeight(type) {
    var pageH = window.innerHeight;
    //var headerHeight = _$("#news_header") == null ? 0 : _$("#news_header").offsetHeight;
    var barH = hasAttchment ? 37 : 0;
    var favH = (hasDoc || showComment || canShare) ? (type == 1 ? 44 : 50) : 0;
    var cHeight = pageH - barH - favH + 1;
    _$("#news_content").style.height = cHeight + "px";
    _$("#scroll").style.webkitTransform = "translate(0px, " + (cHeight) + "px)";
    _$("#scroll").style.transform = "translate(0px, " + (cHeight) + "px)";
    _$("#replyDiv").style.webkitTransform = "translate(0px, " + ((type == 1) ? -1 : pageH) + "px)";
    _$("#replyDiv").style.transform = "translate(0px, " + ((type == 1) ? -1 : pageH) + "px)";
    document.title = (type == 1) ? cmp.i18n("news.h5.comment") : cmp.i18n("news.h5.newsDetails");
};

function fixBarLayout() {
    var showDiv = [];
    //1px solid #CAECFF
    var i = 0;
    if (hasDoc) {
        i++;
        showDiv.push("#collection");
    } else {
        _$("#collection").style.display = "none";
    }
    if (canShare) {
        i++;
        showDiv.push("#share");
    } else {
        _$("#share").style.display = "none";
        _$("#share .news-view-operate-border").value = "none";
    }
    if (canComment) {
        i++;
        showDiv.push("#comment");
    } else {
        _$("#comment").style.display = "none";
    }
    if (canPrise) {
        i++;
        showDiv.push("#praise");
    } else {
        _$("#praise").style.display = "none";
    }
    if (i > 0) {
        _$(showDiv[showDiv.length - 1] + " .news-view-operate-border").style.borderRight = "0";
        var widthPer = 100 / i + "%";
        _$("#collection").style.width = widthPer;
        _$("#share").style.width = widthPer;
        _$("#comment").style.width = widthPer;
        _$("#praise").style.width = widthPer;
        _$("#news-view-operate").style.display = "block";
    } else {
        _$("#news-view-operate").style.display = "none";
    }

}

function auditInput_focus() {
    footerAuto("", "approval");
}

function auditInput_blur() {
    footerAuto("", "approval");
}

function content_div_focus() {
    document.getElementById("reply_shade").style.display = "block";
    // _$("#replyFooterDiv1").style.display = "none";
    // _$("#replyFooterDiv2").style.display = "block";
    checkInputValue();
    // footerAuto("", "footer_num");
}

function content_div_blur() {
    document.getElementById("reply_shade").style.display = "none";
    _$("#replyFooterDiv1").style.display = "block";
    _$("#replyFooterDiv2").style.display = "none";
    checkInputValue();
    document.getElementById("footer_num").style.bottom = "0";
    // footerAuto("", "footer_num");
}

function footerAuto(_headerId, _footerId) {
    if (cmp.os.ios) {
        setTimeout(function() { //键盘被弹起
            var staticHeight = document.body.clientHeight;
            var ThisHeight = window.innerHeight;
            var position;
            if (ThisHeight < staticHeight) {
                var scrollTop = document.querySelector('body').scrollTop;
                position = staticHeight - ThisHeight - scrollTop;
                if (position < 0) {
                    _$("#" + _footerId).style.bottom = "0px";
                    if(cmp.platform.wechat){
                        _$("#" + _footerId).style.bottom = "60px";
                    }
                    if (_headerId) {
                        _$("#" + _headerId).style.top = CMPFULLSREENHEIGHT - ThisHeight + "px";
                    }
                } else {
                    _$("#" + _footerId).style.bottom = position + "px";
                    // if(cmp.platform.wechat){
                    //     _$("#" + _footerId).style.bottom = "60px";
                    // }
                    if (_headerId) {
                        _$("#" + _headerId).style.top = scrollTop + "px";
                    }
                }
            } else {
                _$("#" + _footerId).style.bottom = 0;
                if (_headerId) {
                    _$("#" + _headerId).style.top = 0;
                }
            }
        }, 750);
    }
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

function checkInputValue(){
    var editDiv = document.getElementById("reply_content");
    var reply_text = editDiv.innerText;
    var len = reply_text.length;
    if (len === 0 || reply_text.trim().length === 0) {
        document.getElementById("send_reply").classList.remove("reply_gray");
        document.getElementById("send_reply").classList.add("reply_gray");
    }else{
        document.getElementById("send_reply").classList.remove("reply_gray");
    }
}

function headImg(){
    var url =  cmp.seeyonbasepath + "/rest/orgMember/avatar/";
    var urlFix = "?maxWidth=200";
    var imgList = document.querySelectorAll(".news-comment-one-img .cmp-img-cache");
    for(var i = 0;i<imgList.length;i++){
        var imgDom = imgList[i];
        var headId = imgDom.getAttribute("cmp-data");
        if(headId && headId !== ""){
            var finalUrl = url + headId + urlFix;
            imgDom.src = finalUrl;
            imgDom.classList.remove("cmp-img-cache");
            imgDom.removeAttribute("cmp-data");
        }
    }
}