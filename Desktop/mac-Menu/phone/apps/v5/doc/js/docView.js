var drId;
var urlParam = {};
var isFromCol;
var canShare = false; //分享
var isFromShare = false;
var title;
var source_fr_type;
var disPlay_footer = true;
cmp.ready(function() {
    if (_getQueryString("VJoinOpen") == "VJoin") {
        urlParam = {
            drId : _getQueryString("drId"),
            source_fr_type : _getQueryString("frType"),
            isFromCol : false,
            isFromShare : false,
            glwd : false
        }
    } else {
        urlParam = cmp.href.getParam();
    }
    drId = urlParam["drId"];
    source_fr_type = urlParam["source_fr_type"] == undefined ? false : urlParam["source_fr_type"];
    isFromCol = urlParam["isFromCol"] == undefined ? false : true;
    isFromShare = urlParam["fromShare"] == undefined ? false : true;
    prevPage(backFrom);
    cmp.dialog.loading();
    $s.Doc.docView({
        "drId": drId
    }, {
        success: function(result) {
            if (result["isExist"] == false) {
                cmp.notification.alert(cmp.i18n("doc.h5.noExist"), function() {}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
            } else if (result["isCanOpen"] == false){
              cmp.notification.alert(cmp.i18n("doc.h5.noAuthoir"), function() {}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
            } else {
                title = result.fr_name;
                renderData(result);
                headerShowOrNot();
                showItem(result);
                showContent(result);
                addAttchmentFileClick(result);
                setWaterMark(result, "content");
                setWaterMark(result, "segmented_title_content");
                //////
//                _$("#docView_itle").innerText = result.fr_name;
                _$("#doc_view_name").innerText = result.fr_name;
                _$("#doc_view_time").innerText = cmp.i18n("doc.h5.createDate") + ":" + result.fr_create_time;
                _$("#doc_view_size").innerText = cmp.i18n("doc.h5.file.size") + ":" + bytesToSize(result.fr_size);
                cmp.event.orientationChange(function(res){
                    window.location.reload();
                });
            }
            cmp.dialog.loading(false);
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
            cmp.dialog.loading(false);
        }
    });
    initEvent();
    headerShow();
});

function setWaterMark(result, id) {
    if (result.waterMarkEnable && result.waterMarkEnable == "true") {
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
        document.getElementById(id).style.backgroundImage = "url(" + imgUrl + ")";
        document.getElementById(id).style.backgroundRepeat = "repeat";
        document.getElementById(id).style.backgroundSize = "200px 100px";
    }
}

// 设置元素布高度等
function _initLayout(result) {
    // 设置正文区域高度
    var pageH = window.innerHeight;
    var headerHeight = _$("#docView_header") == null ? 0 : _$("#docView_header").offsetHeight;
    var titleHeight = _$("#segmented_title_content").offsetHeight;
    var attH = result.attSize ? 38 : 0;
    var footer = _$("#doc-view-operate") == null ? 0 : _$("#doc-view-operate").offsetHeight;
    if (!disPlay_footer) {
        footer = 0;
    }
    var cHeight = pageH - headerHeight - titleHeight - attH - footer;
    _$("#content").style.height = cHeight + "px";
    _$("#scroll").style.height = pageH - footer + "px";
    _toggleContent(false, result);

}
// 附件 评论区域显示和影藏
var flag = false;

function _toggleContent(show, result) {
    var cHeight = 0;
    if (!show) {
        cHeight = _$("#content").offsetHeight;
        _$("#scroll").style.transform = "translate(0px, " + cHeight + "px)";
        _$("#scroll").style.webkitTransform = "translate(0px, " + cHeight + "px)";
        if (flag) {
            cmp.listView("#scroll").disable();
        }
    } else {
        _$("#scroll").style.transform = "translate(0px, -1px)";
        _$("#scroll").style.webkitTransform = "translate(0px, -1px)";
        cmp.listView("#scroll").enable();
        flag = true;
    }
}

/**
 * 显示正文
 */
function showContent(result) {
    _initLayout(result);
    var bodyType = "10";
    if (result.fileType == "1") {
        bodyType = SeeyonContent.getBodyCode(result.officeType);
    }
    var bodyContent = "";
    var p = cmp.origin;
    if (result.fileType == "2") {
        bodyContent = '<img src="' + p + '/commonimage.do?method=showImage&id=' + result.file_id + '&size=auto"/>';
    } else if (result.fr_mine_type == "22" || result.fileType == "1") {
        canShare = true;
        bodyContent = result.content;
    } else {
        bodyContent = "<span class='cmp-h5'>" + cmp.i18n("doc.h5.doNotSupport") + "</span>";
    }
    var contentName = result.fr_name;
    if (result.fr_mine_type == 23) {
        contentName += ".doc";
    } else if (result.fr_mine_type == 24 || result.fr_mine_type == 26) {
        contentName += ".xls";
    } else if (result.fr_mine_type == 25) {
        contentName += ".wps";
    }

    var contentConfig = {
        "title": contentName,
        "target": "content",
        "bodyType": bodyType,
        "lastModified": result.updateDate,
        "content": bodyContent,
        "moduleType": "3",
        "rightId": "",
        "viewState": "",
        "canDownLoad" : result.folderShare,
        "tapImg": function() {
            var picId = result.file_id;
            if (result.file_id != undefined) {
                initBigPic(picId);
            }
        },
        "momentum": true,
        "onScrollBottom": function() {
            _toggleContent(true, result); // 展示意见区域
        }
    }
    if (canShare && cmp.platform.CMPShell) {
        _bindShareFunction();
    }
    // 初始化正文
    SeeyonContent.init(contentConfig);
    if (!result.attSize) {
        _$("#scroll").style.display = "none";
        return;
    }
    cmp.listView("#scroll", {
        config: {
            purpose: -1,
            pageSize: 20,
            params: {},
            dataFunc: function(params, options) {
                params.total = 1;
                params.data = [-1];
                options.success(params);
            },
            renderFunc: function(data, isRefresh) {
                if (isRefresh) { // 是否刷新操作，刷新操作 直接覆盖数据
                    _toggleContent(false, result);
                }
            }
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
    cmp.listView("#scroll").disable();
}

function backFrom() {
	//异常删除点击了返回的情况, 解决微协同打开office查看，返回时页面跳转问题
	if(cmp.href.backAbnormal()){
        //return;
    }
	
    cmp.connection.getNetworkType({
        success: function(networkState) {
            if (networkState == "none") {
                cmp.href.closePage();
                return;
            }
        }
    })
    if (isFromShare) {
        cmp.href.closePage();
        return;
    }

    if (urlParam) {
        var isForm = urlParam["isForm"] == undefined ? false : urlParam["isForm"];
        if (isForm == true || isForm == "true") {
            cmp.href.back();
            return;
        }
        var fromXZ = urlParam["fromXZ"] == undefined ? false : urlParam["fromXZ"];
        if (fromXZ) {
            cmp.href.closePage();
            return;
        }
        var weixinMessage = urlParam["weixinMessage"] == undefined ? false : urlParam["weixinMessage"];
        if (weixinMessage) {
            cmp.href.closePage();
            return;
        }
    }

    cmp.href.back();
}

/**
 * 数据渲染
 * @param att
 */
function renderData(result) {
    var liTPL = _$("#pageContent_tpl").innerHTML;
    var html = cmp.tpl(liTPL, result);
    _$("#segmented_title_content").innerHTML = html;
    var commentEnabled = _$("#commentEnabled").value;
    var forumCnt = _$("#tmpCnt").value;
    if (forumCnt > 0) {
        _$("#commentNum").style.display = "none";
        _$("#realCnt").innerHTML = _$("#tmpCnt").value + cmp.i18n("doc.h5.comment.strip");
    } else {
        _$("#commentNum").style.display = "none";
        _$("#realCnt").innerHTML = "0" + cmp.i18n("doc.h5.comment.strip");
    }

    cmp.i18n.detect();
}

/**
 * 绑定附件点击事件
 */
function addAttchmentFileClick(result) {
    if (_$("#attchmentFile") != null) {
        initFile("#attchemntFileList", result.att);
        //设置数量
        var attContainer = _$("#att_list");
        attContainer.querySelector("#att_file_count").innerText = result.fileAttachmentCount;
        attContainer.querySelector("#att_ass_count").innerText = result.assAttachmentCount;
        _$("#attchmentFile").addEventListener("tap", function() {
            _toggleContent(true);
            cmp.listView("#scroll").refresh();
            cmp.listView("#scroll").scrollTo(0, 0);
        });
        _$("#att_list").addEventListener("tap", function() {
            var flag = _$("#scroll").style.transform == "translate(0px, -1px)";
            if (!flag) {
                _toggleContent(true);
            } else {
                if (_$("#attchemntFileList").style.display != "none") {
                    _$("#attchemntFileList").style.display = "none";
                    cmp.listView("#scroll").refresh();
                    _$(".att-icon").classList.remove("see-icon-v5-common-arrow-down");
                    _$(".att-icon").classList.add("see-icon-v5-common-arrow-top");
                } else {
                    _$("#attchemntFileList").style.display = "";
                    cmp.listView("#scroll").refresh();
                    _$(".att-icon").classList.add("see-icon-v5-common-arrow-down");
                    _$(".att-icon").classList.remove("see-icon-v5-common-arrow-top");
                }
            }
        });
    } else {
        //没有附件直接移除容器
        _$("#att_list").remove();
    }
}

//初始化附件
function initFile(selector, fileList) {
    var loadParam = {
        selector: selector,
        atts: fileList,
        pageInfo: {
            url: _docPath + "/html/docView.html?cmp_orientation=auto",
            drId: drId,
            comeFrom: "",
            data: urlParam
        }
    }
    return new SeeyonAttachment({
        loadParam: loadParam
    });
}

/**取消收藏docId:-1*/
function initClick(docId, favoriteType, appKey, hasAtt, isFromCol) {
    document.querySelector('#collection').addEventListener("click", function() {
        var state = _$(".doc-view-operate-store-name").value;
        if (state) { //取消收藏
            var params = {
                "docId": -1,
                "sourceId": docId
            }
            cmp.dialog.loading();
            $s.Doc.cancelFavorite(params, {
                success: function() {
                    if (isFromCol) {
                        cmp.notification.toastExtend(cmp.i18n("doc.h5.cancel.collection"), "center", 1000);
                        cmp.storage.save("docRefreshList", "1", false);
                        if(cmp.webViewListener && cmp.webViewListener.fire){
                            cmp.webViewListener.fire({
                                type:"myDocReload",  //此参数必须和webview1注册的事件名相同
                                data:"",
                                success:function(){
                                },
                                error:function(error){
                                }
                            });
                        }
                        backFrom();
                    } else {
                        cmp.notification.toastExtend(cmp.i18n("doc.h5.cancel.collection"), "center", 1000);
                        _$(".doc-view-operate-store-name").innerText = cmp.i18n("doc.h5.collection");
                        _$(".doc-view-operate-store-name").value = false;
                        _$(".doc-view-operate-store-icon").classList.remove("see-icon-v5-common-collect-fill");
                        _$(".doc-view-operate-store-icon").classList.add("see-icon-v5-common-collect");
                    }
                    cmp.dialog.loading(false);
                },
                error: function(error) {
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {

                    } else {}
                    cmp.dialog.loading(false);
                }
            });
        } else { //收藏
            var params = {
                "sourceId": docId,
                "favoriteType": favoriteType,
                "appKey": appKey,
                "hasAtt": hasAtt
            }
            cmp.dialog.loading();
            $s.Doc.favorite(params, {
                success: function(result) {
                    cmp.notification.toastExtend(cmp.i18n("doc.h5.collection.success"), "center", 1000);
                    _$(".doc-view-operate-store-name").innerText = cmp.i18n("doc.h5.cancel.collection");
                    _$(".doc-view-operate-store-name").value = true;
                    _$(".doc-view-operate-store-icon").classList.remove("see-icon-v5-common-collect");
                    _$(".doc-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill");
                    cmp.dialog.loading(false);
                },
                error: function(error) {
                    if (error.code == '500') {
                        cmp.notification.alert(error.message, function() {
                            cmp.dialog.loading(false);
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                        return;
                    }
                    var cmpHandled = cmp.errorHandler(error);
                    if (cmpHandled) {

                    } else {}
                    cmp.dialog.loading(false);
                }

            });
        }
    });
}

function initCollection(isCollect) {
    _$(".doc-view-operate-store-name").value = isCollect;
    if (isCollect) {
        _$(".doc-view-operate-store-name").innerText = cmp.i18n("doc.h5.cancel.collection");
        _$(".doc-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill"); //实心
    } else {
        _$(".doc-view-operate-store-name").innerText = cmp.i18n("doc.h5.collection");
        _$(".doc-view-operate-store-icon").classList.add("see-icon-v5-common-collect"); //空心
    }
}

function initEvent() {
    _$(".doc-view-operate-comment").addEventListener("tap", function() {
        var docParam = {
            "drId": drId,
            "isForm": urlParam["isForm"],
            "isFormCol": isFromCol,
            "source_fr_type": source_fr_type,
            "pageInfo": {
                "url": _docPath + "/html/docView.html?cmp_orientation=auto",
                "data": {
                    "drId": drId
                }
            }
        }

        cmp.href.next(_docPath + "/html/docComment.html?cmp_orientation=auto", docParam);
    });
//    _$("#docView_itle").addEventListener("tap", function() {
//        _$("#view_shade").style.display = "block";
//        _$("#doc_view_detail").style.top = _$("#docView_header").clientHeight + "px"
//        _$("#view_shade_tag").style.top = _$("#docView_header").clientHeight - 10 + "px"
//    });
    _$("#view_shade").addEventListener("tap", function() {
        _$("#view_shade").style.display = "none";
    });
}

function _bindShareFunction() {
    cmp("#doc-view-operate").on('tap', "#share", function() {
        ShareRecord.share(urlParam["drId"], 3, title);
    });
}
//显示功能项
function showItem(result) {
    var shareFileType = result["fr_mine_type"] == 22;
    var commentEnabled = result["commentEnabled"];
    var glwd = urlParam["glwd"] == undefined ? false : urlParam["glwd"];
    if (isFromShare || glwd) {
        _$("#collection").style.display = "none";
        _$("#share").style.display = "none";
        _$("#comment").style.display = "none";
        disPlay_footer = false;
        _$("#doc-view-operate").style.display = "none";
        if (isFromShare) {
        	_$("#_shareName").innerText = result.shareTime + "  " + result.fr_create_username;
        }
    } else {
        if (!cmp.platform.CMPShell) {
            result["shareEnabled"] = false;
        }
        if (result["shareEnabled"] == true) {
            if (result["docLibType"] == 1) {
                _$("#collection").style.display = "none";
                if (source_fr_type == 51 || shareFileType == false) {
                    _$("#share").style.display = "none";
                    if (commentEnabled == false) {
                        _$("#comment").style.display = "none";
                        disPlay_footer = false;
                        _$("#doc-view-operate").style.display = "none";
                    } else {
                        _$("#comment").style.width = "100%";
                    }
                } else {
                    if (commentEnabled == false) {
                        _$("#comment").style.display = "none";
                        _$("#share").style.width = "100%";
                    } else {
                        _$("#share").style.width = "50%";
                        _$("#comment").style.width = "50%";
                        if (_$("#share").clientHeight == 0) {
                            _$("#comment").style.width = "100%";
                        }
                    }
                }
            } else {
                if (source_fr_type == 51 || result["folderShare"] == false || shareFileType == false) {
                    _$("#share").style.display = "none";
                    _$("#comment").style.width = "50%";
                    _$("#collection").style.width = "50%";
                    if (commentEnabled == false) {
                        _$("#comment").style.display = "none";
                        _$("#collection").style.width = "100%";
                    }
                } else {
                    _$("#share").style.width = "33%";
                    _$("#comment").style.width = "33%";
                    _$("#collection").style.width = "34%";
                    if (commentEnabled == false) {
                        _$("#comment").style.display = "none";
                        _$("#share").style.width = "50%";
                        _$("#collection").style.width = "50%";
                    }

                }
                initCollection(result["isCollect"]);
                initClick(result["fr_id"], 3, 3, result["hasAttr"], isFromCol);
            }
        } else {
            _$("#share").style.display = "none";
            if (result["docLibType"] == 1) {
                _$("#collection").style.display = "none";
                _$("#comment").style.width = "100%";
                if (commentEnabled == false) {
                    _$("#comment").style.display = "none";
                    disPlay_footer = false;
                    _$("#doc-view-operate").style.display = "none";
                }
            } else {
                if (commentEnabled == true) {
                    _$("#collection").style.width = "50%";
                    _$("#comment").style.width = "50%";
                } else {
                    _$("#comment").style.display = "none";
                    _$("#collection").style.width = "100%";
                }
                initCollection(result["isCollect"]);
                initClick(result["fr_id"], 3, 3, result["hasAttr"], isFromCol);
            }
        }
    }
}

function headerShow() {
    document.getElementById("segmented_title_content").style.display = "block";
    document.title = cmp.i18n("doc.h5.doc.detail");
}

function initBigPic(imgId) {
    var imgArray = [];
    imgArray.push({
        small: cmp.origin + "/commonimage.do?method=showImage&from=mobile&id=" + imgId + "&size=auto",
        big: cmp.origin + "/commonimage.do?method=showImage&id=" + imgId + "&size=source"
    });
    cmp.asyncLoad.css([_cmpPath + "/css/cmp-sliders.css" + _buildversion]);
    var jses = [_cmpPath + "/js/cmp-sliders.js" + _buildversion];
    cmp.asyncLoad.js(jses, function() {
        cmp.sliders.addNew(imgArray);
        cmp.sliders.detect(0);
    });
}

//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}