var hasAttchment = false;
var hasDoc = false
var urlParam = {};
var affairId = false;
var lockBulletin = false;
cmp.ready(function() {
    cmp.dialog.loading();
    if (_getQueryString("openFrom") == "robot" || _getQueryString("VJoinOpen") == "VJoin") {
        //对语音小智穿透过来的搜索公告或VJoin穿透过来的公告进行处理
        urlParam['affairId'] = false;
        urlParam['bulId'] = _getQueryString("bulId");
        urlParam['comeFrom'] = _getQueryString("comeFrom") ? _getQueryString("comeFrom") : 0;
    } else {
        urlParam = getUrlParam();
    }
    if (!urlParam) {
        cmp.href.closePage();
        return;
    }
    affairId = urlParam['affairId'] == undefined ? false : urlParam['affairId'];
    // 头部显示(微协同屏蔽Header)
    headerShowOrNot();
    prevPage();

    $s.CmpBulletin.bulletinDetails(urlParam['bulId'], urlParam['comeFrom'], affairId, "", {
        repeat: true, //当网络掉线时是否自动重新连接
        success: function(result) {
            cmp.dialog.loading(false);
            viewCallBack(result);
            setWaterMark(result.waterMarkMap, "bul_content");
            setWaterMark(result.waterMarkMap, "bul_title");
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
                cmp.href.closePage();
            }
        }
    });
});

function initLayout() {
    if (cmp.platform.wechat) { // 是微信浏览器
        _$("#bul_content").style.minHeight = window.innerHeight + "px";
    } else {
        _$("#bul_content").style.minHeight = window.innerHeight + "px";
    }
}

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
        if (id == "bul_title") {
            document.getElementById(id).style.backgroundImage = "url(" + imgUrl + ")";
            document.getElementById(id).style.backgroundRepeat = "repeat";
            document.getElementById(id).style.backgroundSize = "200px 100px";
            document.getElementById(id).style.backgroundColor = "#fff";
        }
        if (id == "bul_content") {
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
    if (!result || result.stateFlag != "0") {
        if (document.getElementById("shadow")) {
            document.body.removeChild(document.getElementById("shadow"));
        }
        if (result.subState == 10) {
          if(result.stateFlag == "2"){
            cmp.notification.alert(cmp.i18n("bulletin.h5.audit.publish.error2"), function() {
                backFrom();
            }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
          }else {
            cmp.notification.alert(cmp.i18n("bulletin.h5.dealOrDelete"), function() {
                backFrom();
            }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
          }
        } else {
            cmp.notification.alert(cmp.i18n("bulletin.h5.bulletinState"), function() {
                backFrom();
            }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
        }
    } else if (result.lockState == 1) {
        cmp.notification.alert(result.lockMember + cmp.i18n("bulletin.h5.dealOnPc"), function() {
            backFrom();
        }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
    } else {
        loadData(result);
    }
}

/**
 * 模板数据加载
 * @param data
 */
function loadData(data) {

    var liTpl = document.getElementById("bul_title_tmp").innerHTML;
    var table = document.getElementById('bul_title');
    var html = cmp.tpl(liTpl, data);
    table.innerHTML = table.innerHTML + html;

    var liTpl1 = document.getElementById("bul_scroll_tmp").innerHTML;
    var table1 = document.getElementById('bul_scroll');
    var html1 = cmp.tpl(liTpl1, data);
    table1.innerHTML = table1.innerHTML + html1;

    if (data.state == 10) {
        document.getElementById("approval").style.display = "block";
        document.getElementById("bul-view-operate").style.display = "none";
        auditBulletin();
        // Header固定
        lockBulletin = true;
        //cmp.HeaderFixed(_$("#bul_header"), _$("#auditInput"));
    } else if (data.state == 20) {
        document.getElementById("bul-view-operate").style.display = "none";
        if (data.canPublish == "true") {
            document.getElementById("publish_footer").style.display = "block";
        }
        var liTpl2 = document.getElementById("bul_publish_tmp").innerHTML;
        var table2 = document.getElementById('bul_publish');
        var html2 = cmp.tpl(liTpl2, data);
        table2.innerHTML = table2.innerHTML + html2;
        document.getElementById("auditState").innerHTML = cmp.i18n("bulletin.h5.audit.pass");
        publishBulletin();
    } else if (data.state == 40) {
        document.getElementById("bul-view-operate").style.display = "none";
        var liTpl2 = document.getElementById("bul_publish_tmp").innerHTML;
        var table2 = document.getElementById('bul_publish');
        var html2 = cmp.tpl(liTpl2, data);
        table2.innerHTML = table2.innerHTML + html2;
        document.getElementById("auditState").innerHTML = cmp.i18n("bulletin.h5.audit.notPass");
    } else if (urlParam['comeFrom'] == 0 && data.hasDoc) {
        hasDoc = true;
        _bindFavFuction();
        document.getElementById("approval").style.display = "none";
        document.getElementById("bul-view-operate").style.display = "block";
        if (data.fav) {
            _$(".bul-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill");
            _$(".bul-view-operate-store-icon").classList.remove("see-icon-v5-common-collect");
            _$(".bul-view-operate-store-name").innerText = cmp.i18n("bulletin.h5.favcancel");
            _$(".bul-view-operate-store-name").value = "true";
        } else {
            _$(".bul-view-operate-store-icon").classList.remove("see-icon-v5-common-collect-fill");
            _$(".bul-view-operate-store-icon").classList.add("see-icon-v5-common-collect");
            _$(".bul-view-operate-store-name").innerText = cmp.i18n("bulletin.h5.fav");
            _$(".bul-view-operate-store-name").value = "false";

        }
    }

    // 附件展示
    if (data.attachmentList && data.attachmentList.length > 0) {
        //        cmp.dialog.loading();
        //            var csses = [_cmpPath + "/css/cmp-att.css" + $verstion];
        //            cmp.asyncLoad.css(csses);
        //            var jses = [_cmpPath + "/js/cmp-att.js"+ $verstion];
        //            cmp.asyncLoad.js(jses,function(){
        //            cmp.dialog.loading(false);
        hasAttchment = true;
        initFile("#attchemntFileList", data.attachmentList);
        // 设置数量
        var attContainer = _$("#att_list");
        attContainer.querySelector("#att_file_count").innerText = data.fileAttachmentCount;
        attContainer.querySelector("#att_ass_count").innerText = data.assAttachmentCount;

        cmp.listView("#bul_scroll", {
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
                        _toggleContent(false);
                    }
                }
            },
            up: {
                contentdown: cmp.i18n("bulletin.page.lable.load_more"), // 可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
                contentrefresh: cmp.i18n("bulletin.page.lable.load_ing"), // 可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: cmp.i18n("bulletin.page.lable.load_nodata"), // 可选，请求完毕若没有更多数据时显示的提醒内容；
            }

        }); // 滚动容器
        cmp.listView("#bul_scroll").disable();
        addAttchmentFileClick();
        window.setTimeout(function() {
            if (cmp.platform.wechat) { //是微信浏览器
                document.getElementById("bul_scroll").style.height = document.getElementById("bul_scroll").clientHeight - 104 + "px";
            } else {
                document.getElementById("bul_scroll").style.height = document.getElementById("bul_scroll").clientHeight - 50 + "px";
            }
            cmp.listView("#bul_scroll").refresh();
        }, 500);
        _initLayout();
        //});
    } else {
        // 没有附件直接移除容器
        _$("#bul_scroll").remove();
        _initLayout();
    }

    cmp.i18n.detect();

    var bodyType = SeeyonContent.getBodyCode(data.dataFormat);
    var content = data.content;
    if (data.ext5) {
        bodyType = SeeyonContent.getBodyCode("Pdf");
        content = data.ext5;
    }
    _initContent(bodyType, content, data.updateDate);
    cmp.i18n.detect();
    window.setTimeout(function() {
        toggleBrief();
        if (hasAttchment) {
            toggleAtt();
            cmp.listView("#bul_scroll").refresh();
        }
    }, 500);
}
//正文展现
var seeyonContentIscroll;

function _initContent(bodyType, content, updateDate, refresh) {
    var contentConfig = {
        "target": "bul_content",
        "bodyType": bodyType,
        "lastModified": updateDate,
        "content": content,
        "moduleType": "7",
        "rightId": "",
        "viewState": "",
        "momentum": true,
        "ext": {
            "reference": urlParam['bulId']
        },
        "onScrollBottom": function() {
            _toggleContent(true); // 展示意见区域
        }
    }

    // 初始化正文
    seeyonContentIscroll = SeeyonContent.init(contentConfig);
}
// 设置元素布高度等
function _initLayout() {
    // 设置正文区域高度
    var pageH = window.innerHeight;
    //var headerHeight = _$("#bul_header") == null ? 0 : _$("#bul_header").offsetHeight;
    var titleHeight = _$("#bul_title").offsetHeight;
    var publishHeight = _$("#bul_publish") == null ? 0 : _$("#bul_publish").offsetHeight;
    var publishFooterHeight = _$("#publish_footer") == null ? 0 : _$("#publish_footer").offsetHeight;
    var approvalFooterHeight = _$("#approval") == null ? 0 : _$("#approval").offsetHeight;
    var attH = hasAttchment ? 38 : 0;
    var favH = hasDoc ? 50 : 0;

    var cHeight = pageH - publishHeight - attH - favH - approvalFooterHeight - publishFooterHeight;
    _$("#bul_content").style.height = cHeight + "px";

    _toggleContent(false);

    if (hasAttchment) {
        _$("#scroll-shade").addEventListener("tap", function() {
            _toggleContent(true);
            cmp.listView("#bul_scroll").refresh();
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
        cHeight = _$("#bul_content").offsetHeight + (_$("#bul_publish") == null ? 0 : _$("#bul_publish").offsetHeight - 1);
        _$("#scroll-shade").style.display = "";
        _$("#bul_scroll").style.transform = "translate(0px, " + (cHeight + 2) + "px)";
        _$("#bul_scroll").style.webkitTransform = "translate(0px, " + (cHeight + 2) + "px)";
        cmp.listView("#bul_scroll").scrollTo(0,0);
        cmp.listView("#bul_scroll").disable();
    } else {
        _$("#scroll-shade").style.display = "none";
        _$("#bul_scroll").style.transform = "translate(0px, -2px)";
        _$("#bul_scroll").style.webkitTransform = "translate(0px, -2px)";
        cmp.listView("#bul_scroll").enable();
    }

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

/**
 * 附件图标点击事件
 */
function addAttchmentFileClick() {
    if (hasAttchment) {
        document.getElementById("attchmentFile").addEventListener("tap", function() {
            _toggleContent(true);
            cmp.listView("#bul_scroll").refresh();
            cmp.listView("#bul_scroll").scrollTo(0, 0);
        });
        document.getElementById("attTitle").addEventListener("tap", function() {
            if (_$("#attchemntFileList").clientHeight > 50) {
                document.getElementById("attchemntFileList").style.display = "none";
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-down");
            } else {
                document.getElementById("attchemntFileList").style.display = "";
                document.getElementsByClassName("att-icon")[0].classList.add("see-icon-v5-common-arrow-top");
                document.getElementsByClassName("att-icon")[0].classList.remove("see-icon-v5-common-arrow-down");
            }
        });
    } else {
        document.getElementById("att_list").style.display = "none";
    }
}

//公告发布
function publishBulletin() {
    cmp("#publish_footer").on('tap', "#bul_publish_tap", function(e) {
        cmp.dialog.loading();
        $s.CmpBulletin.publishBulletin(urlParam['bulId'], "", {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                //触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    // data: "{affairid:'" + urlParam[affairId] + "',type: 'delete'}"
                    data: {type: 'update'}
                });
                if (result.state == "error") {
                    cmp.notification.alert(cmp.i18n("bulletin.h5.audit.publish.error"), function() {
                        backFrom();
                    }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
                } else if (result.noPublish == "noPublish") {
                    cmp.notification.alert(cmp.i18n("bulletin.h5.audit.publish.noPublish"), function() {
                        backFrom();
                    }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
                } else {
                    cmp.notification.alert(cmp.i18n("bulletin.h5.audit.publish.success"), function() {
                        backFrom();
                    }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
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
        cmp.dialog.loading(false);
    });
}

//公告审核
function auditBulletin() {
    _$("#auditInput").addEventListener("input", function() {
        var auditInput = this.innerText;
        if (auditInput && auditInput.length > 150) {
            this.innerText = this.innerText.slice(0, 150);
            this.blur();
            this.setAttribute("contenteditable", false);
            cmp.notification.toast(cmp.i18n("bulletin.h5.audit.dealNumMost"), "bottom", 3000);
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
            "bulId": urlParam['bulId'],
            "type": e.target.getAttribute("value"),
            "audit_msg": auditInput
        };
        $s.CmpBulletin.bulAudit({}, auditParam, {
            repeat: false, //当网络掉线时是否自动重新连接
            success: function(result) {
                //触发刷新壳数据
                cmp.webViewListener.fire({
                    type: 'com.seeyon.m3.ListRefresh',
                    // data: "{affairid:'" + urlParam[affairId] + "',type: 'delete'}"
                    data: {type: 'update'}
                })
                if (result.state == "error") {
                    cmp.notification.alert(cmp.i18n("bulletin.h5.bulletinState"), function() {
                        backFrom();
                    }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
                } else if (result.state == "auditAgain") {
                    cmp.notification.alert(cmp.i18n("bulletin.h5.audit.alreadyDeal"), function() {
                        backFrom();
                    }, cmp.i18n("bulletin.h5.alert"), cmp.i18n("bulletin.h5.OK"));
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
    if (lockBulletin) {
        $s.CmpBulletin.unlockBulletin(urlParam['bulId'], "", {
            repeat: true, //当网络掉线时是否自动重新连接
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
    var ua = window.navigator.userAgent.toLowerCase();
    
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
    _$("#bul_details").addEventListener("touchstart", function(e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });
    _$("#bul_details").addEventListener("touchmove", function(e) {
        endX = e.touches[0].pageX;
        endY = e.touches[0].pageY;
        if (startY > endY) {
            // up
            _$("#bul_title").style.transform = "translate(0px, -" + _$("#bul_title").clientHeight + "px)";
            _$("#bul_publish").style.transform = "translate(0px, -" + _$("#bul_title").clientHeight + "px)";
            _$("#bul_details").style.transform = "translate(0px, -" + _$("#bul_title").clientHeight + "px)";
        } else {
            // down
            _$("#bul_title").style.transform = "translate(0px, 0px)";
            _$("#bul_publish").style.transform = "translate(0px, 0px)";
            _$("#bul_details").style.transform = "translate(0px, 0px)";
        }
    });
}

function toggleAtt() {
    var startX, startY, endX, endY;
    _$("#att_list").addEventListener("touchstart", function(e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });
    _$("#att_list").addEventListener("touchmove", function(e) {
        endX = e.touches[0].pageX;
        endY = e.touches[0].pageY;
        if (startY <= endY) {
            _toggleContent(false);
        }
    });
}

function _bindFavFuction() {
    cmp("#bul-view-operate").on('tap', "#collection", function() {
        if (_$(".bul-view-operate-store-name").value == "true") {
            //取消方法
            var params = {
                "docId": -1,
                "sourceId": urlParam['bulId']
            };
            $s.Doc.cancelFavorite(params, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function() {
                    cmp.notification.toastExtend(cmp.i18n("bulletin.h5.favcancelsuccess"), "center", 1000);
                    _$(".bul-view-operate-store-name").innerText = cmp.i18n("bulletin.h5.fav");
                    _$(".bul-view-operate-store-name").value = "false";
                    _$(".bul-view-operate-store-icon").classList.remove("see-icon-v5-common-collect-fill");
                    _$(".bul-view-operate-store-icon").classList.add("see-icon-v5-common-collect");
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
        }else if (_$(".bul-view-operate-store-name").value == "false") {
            //收藏方法
            var params = {
                "sourceId": urlParam['bulId'],
                "favoriteType": 3,
                "appKey": 7,
                "hasAtt": hasAttchment
            };
            $s.Doc.favorite(params, {
                repeat: false, //当网络掉线时是否自动重新连接
                success: function(result) {
                    cmp.notification.toastExtend(cmp.i18n("bulletin.h5.favsuccess"), "center", 1000);
                    _$(".bul-view-operate-store-name").innerText = cmp.i18n("bulletin.h5.favcancel");
                    _$(".bul-view-operate-store-name").value = "true";
                    _$(".bul-view-operate-store-icon").classList.remove("see-icon-v5-common-collect");
                    _$(".bul-view-operate-store-icon").classList.add("see-icon-v5-common-collect-fill");
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

function auditInput_focus() {
    if (cmp.os.ios && cmp.platform.CMPShell) {
        footerAuto("", "approval");
    }
}

function auditInput_blur() {
    if (cmp.os.ios && cmp.platform.CMPShell) {
        footerAuto("", "approval");
    }
}

function footerAuto(_headerId, _footerId) {
    setTimeout(function() { //键盘被弹起
        var ThisHeight = window.innerHeight;
        var position;
        if (ThisHeight < CMPFULLSREENHEIGHT) {
            var scrollTop = document.querySelector('body').scrollTop;
            position = CMPFULLSREENHEIGHT - ThisHeight - scrollTop;
            _$("#" + _footerId).style.bottom = position + "px";
            if (_headerId) {
                _$("#" + _headerId).style.top = scrollTop + "px";
            }
        } else {
            _$("#" + _footerId).style.bottom = 0;
            if (_headerId) {
                _$("#" + _headerId).style.top = 0;
            }
        }
    }, 550);
}

//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}