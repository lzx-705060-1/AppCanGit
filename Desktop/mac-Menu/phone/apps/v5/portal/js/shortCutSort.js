var sortableList = [];
// 栏目Id
var entityId = "";
var sourceValue = "";
// 当前空间id
var spaceId = "";
/**
 * 0 文件夹分组 + 普通磁贴分组 groupType=0或2
 * 1 只有分组，groupType=1
 */
var MODE_TYPE = 0;
// 已选磁贴
var portletMap = new Map();
// 备选磁贴区
var selectPortlets = {};

cmp.ready(function() {
    // title名称
    document.getElementById("title").innerHTML = cmp.i18n("shortcut.all.label");
    var _param = cmp.href.getParam();
    if (_param) {
        entityId = _param.entityId;
        sourceValue = _param.sourceValue;
        spaceId = _param.spaceId;
        var _iconFontPath = _param.iconFontPath;
        if (_iconFontPath) {
            cmp.asyncLoad.css(_iconFontPath);
        }

        loadData();
    }

    //物理按键的返回
    cmp.backbutton();
    cmp.backbutton.push(function() {
        //m3壳里面
        if (cmp.platform.CMPShell) {
            cmp.webViewListener.fire({
                type: "initSection",
                data: spaceId,
                success: function() {
                    cmp.href.back();
                },
                error: function() {
                    cmp.href.back();
                }
            })
        } else {
            cmp.href.back();
        }

    });
    //右上角返回
    /*cmp("header").on('tap', "#goAheadBtn", function() {
        //m3壳里面
        if (cmp.platform.CMPShell) {
            cmp.webViewListener.fire({
                type: "initSection",
                data: spaceId,
                success: function() {
                    cmp.href.back();
                },
                error: function() {
                    cmp.href.back();
                }
            })
        } else {
            cmp.href.back();
        }
    });*/
    
});
/*-M3壳下ajax请求url替换-*/
var replaceAjaxUrl = function(_ajaxUrl) {
    if (cmp.platform.CMPShell) {
        _ajaxUrl = cmp.serverIp + _ajaxUrl;
    }
    return _ajaxUrl;
}

function loadData() {
    var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
    cmp.ajax({
        type: "GET",
        data: null,
        url: replaceAjaxUrl("/seeyon/rest/shortcut/portlets/" + (sourceValue || "null")),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': cmp.language || "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {
            // 已选磁贴
            var data0 = result["0"];
            if (data0 instanceof Array) {
                if (data0[0] && data0[0].groupType == 1) {
                    var tpl1 = document.getElementById("groupShortCutList").innerHTML;
                    var html = cmp.tpl(tpl1, data0);
                    document.getElementById("selectedShortCutDiv").innerHTML = html;
                    MODE_TYPE = 1;
                } else {
                    MODE_TYPE = 0;
                    var tpl2 = document.getElementById("normalShortCutList").innerHTML;
                    var html = cmp.tpl(tpl2, data0);
                    document.getElementById("selectedShortCutDiv").innerHTML = html;
                }

            }
            // 待选磁贴
            if (result["1"].length > 0 || result["2"].length > 0 || result["3"].length > 0) {
                var tpl3 = document.getElementById("addShortCutList").innerHTML;
                var html = cmp.tpl(tpl3, result);
                document.getElementById("addShortCutDiv").innerHTML = html;
            }
            //保存、编辑事件
            shortCutInit();
            //添加事件
            addEvent4Portlets();

            var contentH = window.innerHeight;
            document.querySelector('.body-content').style.height = contentH + "px";
            cmp.event.orientationChange(function(res) {
                var contentH = window.innerHeight;
                document.querySelector('.body-content').style.height = contentH + "px";
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}


//普通磁贴渲染，包括文件夹，不包括组
var editFlag = false;

function shortCutInit() {

    document.getElementById("operate").addEventListener("touchend", function(e) {
        if (this.classList.contains("state-edit")) {
            editFlag = true;
            this.innerHTML = cmp.i18n("shortcut.save.label");
            this.classList.add("state-save");
            this.classList.remove("state-edit");

            showHideEditTip(true);
            createSortable();
        } else {
            if (!editFlag) {
                return;
            }

            cmp.dialog.loading(true);
            saveAllPortlets({
                success: function() {
                    editFlag = false;
                    var dom = document.getElementById("operate");
                    dom.innerHTML = cmp.i18n("shortcut.edit.label");
                    dom.classList.add("state-edit");
                    dom.classList.remove("state-save");

                    showHideEditTip(false);
                    //移除拖动事件
                    destroySortable();

                    // 分组选中事件
                    if (MODE_TYPE == 1) {
                        for (var i = 0; i < document.querySelectorAll(".shortCutGroup").length; i++) {
                            (function(_i) {
                                document.querySelectorAll(".shortCutGroup")[_i].removeEventListener("tap", groupChoose);
                                document.querySelectorAll(".shortCutGroup")[_i].classList.remove("choose");
                            })(i);
                        }
                    }

                    cmp.dialog.loading(false);
                    return;
                },
                error: function() {
                    cmp.dialog.loading(false);
                    return;
                }
            });
        }
    });
}

function showHideEditTip(isShow) {
    // 已选区
    for (var i = 0; i < document.getElementById("selectedShortCutDiv").querySelectorAll(".operateArea .remove").length; i++) {
        document.getElementById("selectedShortCutDiv").querySelectorAll(".operateArea .remove")[i].style.display = isShow ? "block" : "none";
        // document.getElementById("selectedShortCutDiv").querySelectorAll(".operateArea .name")[i].style.textAlign = isShow ? 'left' : 'center';
    }

    // 备选区
    for (var i = 0; i < document.getElementById("addShortCutDiv").querySelectorAll(".operateArea").length; i++) {
        // document.getElementById("addShortCutDiv").querySelectorAll(".operateArea .name")[i].firstElementChild.style.display = isShow ? "block" : "none";
        // document.getElementById("addShortCutDiv").querySelectorAll(".operateArea .name")[i].style.textAlign = isShow ? 'left' : 'center';
    }

    for (var i = 0; i < document.querySelectorAll(".title .brief").length; i++) {
        document.querySelectorAll(".title .brief")[i].style.display = isShow ? "inline" : "none";
    }
}

// 当前长按对象
var touchElement = null;
var touchTime, timer;

function addEvent4Portlets() {

    if (cmp.os.android && !cmp.platform.CMPShell) {
        // 微信 android 长按出现打开浏览器问题
        document.oncontextmenu = function(e) { e.preventDefault(); }
    }

    // 已选区 长按拖拽
    mui('#selectedShortCutDiv').on('touchstart', 'li', function(e) {
        touchElement = this;
        if (editFlag) {
            touchTime = new Date().getTime();
            timer = setTimeout(function() {
                if (touchElement) {
                    touchElement.classList.add('longtap-shortcut');
                    drugOper(false);
                    document.querySelector(".body-content").style.overflow = "hidden";
                    if (MODE_TYPE == 1) {
                        var _index = touchElement.parentNode.getAttribute("groupIndex");
                        sortableList[_index]._onTapStart(e);
                    } else {
                        sortableList[0]._onTapStart(e);
                    }
                }
            }, 1000);
        }
    }, false).on('touchend', 'li', function(e) {
        if (editFlag) {
            if (new Date().getTime() - touchTime < 1000) {
                clearInterval(timer);
            } else {
                document.querySelector(".body-content").style.overflow = "auto";
                touchElement && touchElement.classList.remove('longtap-shortcut');
                drugOper(true);
            }
        }
    }, false);

    // 已选区 删除磁贴事件
    mui('#selectedShortCutDiv').on('tap', 'li', function(e) {
        if (editFlag) {
            removeShortCut(this);
        } else {
            if (!this.classList.contains('folderItem')) {
                var _u = this.getAttribute("data-url");
                shortCutEvent(_u);
            }
        }
    }, false);

    // 备选区 添加磁贴事件
    mui('#addShortCutDiv').on('tap', 'li', function(e) {
        if (editFlag) {
            addShortCut(this.querySelector('.add'));
        } else {
            var _u = this.getAttribute("data-url");
            shortCutEvent(_u);
        }
    }, false);
}

//初始化拖拽
function initDrug(_sortD) {
    if (!_sortD) { return; }
    sortableList.push(new cmp.Sortable(_sortD, {
        animation: 500,
        disabled: true,
        draggable: '.item',
        onStart: function(e) {

        },
        onEnd: function(e) {
            drugOper(true);
            document.querySelector(".body-content").style.overflow = "auto";
            touchElement && touchElement.classList.remove('longtap-shortcut');
        }
    }));
}

function createSortable() {
    // 分组选中事件
    if (MODE_TYPE == 1) {
        for (var i = 0; i < document.querySelectorAll(".shortCutGroup").length; i++) {
            (function(_i) {
                document.querySelectorAll(".shortCutGroup")[_i].addEventListener("tap", groupChoose);
                initDrug(document.querySelectorAll(".shortCutGroup")[_i].querySelector("ul"));
            })(i);
        }
    } else {
        initDrug(document.querySelector(".shortCut1"));
    }
}

function destroySortable() {
    for (var x = 0; x < sortableList.length; x++) {
        sortableList[x].destroy();
    }
    sortableList = [];

}

//drug open
function drugOper(state) {

    for (var i = 0; i < sortableList.length; i++) {
        sortableList[i].options.disabled = state;
    }
}

function groupChoose() {
    for (var j = 0; j < document.querySelectorAll(".shortCutGroup").length; j++) {
        document.querySelectorAll(".shortCutGroup")[j].classList.remove("choose");
    }
    this.classList.add("choose");
}

//删除磁贴
function removeShortCut(_this) {
    if (!_this || !editFlag) {
        return;
    }

    var _portletId = _this.querySelector(".remove").getAttribute("portletId");
    if (_portletId && portletMap.has(_portletId)) {
        portletMap.delete(_portletId);
        _this.parentNode.removeChild(_this);

        destroySortable();
        createSortable();

        var tagDom = document.querySelector("#add_" + _portletId);
        if (tagDom) {
            tagDom.classList.remove("vp-online0");
            tagDom.classList.add("vp-plus");
            tagDom.parentNode.classList.add("add");
            tagDom.parentNode.classList.remove("isChoose");
        }
    }
}

//添加磁贴
function addShortCut(_this) {
    if (!editFlag || !_this || !_this.classList.contains("add")) {
        return;
    }

    if (portletMap.size >= 20) {
        cmp.notification.alert(cmp.i18n("shortcut.add.max.count", 20));
        return;
    }
    var _portletId = _this.getAttribute("portletId");
    if (_portletId && !portletMap.has(_portletId)) {
        _this.classList.remove("add");
        _this.classList.add("isChoose");

        _this.querySelector(".leftIcon").classList.remove("vp-plus");
        _this.querySelector(".leftIcon").classList.add("vp-online0");
        var data = selectPortlets[_portletId];
        portletMap.set(_portletId, data);

        var item = document.createElement("li");
        item.className = "item";
        item.setAttribute("data-url", escapeStringToHTML(data.mobileUrl));
        item.innerHTML = '<div style="width: 100%;padding-right: 5px;"><div class="operateArea">' +
            '<span class="remove vportal vp-online2"  portletId="' + _portletId + '"></span> ' +
            '<div class="name">' +
            '<span>' + data.displayName + '</span>' +
            '</div>' +
            '</div></div>';


        destroySortable();
        createSortable();

        if (MODE_TYPE == 1) {
            var appendDom;
            for (var i = 0; i < document.querySelectorAll(".shortCutGroup").length; i++) {
                if (document.querySelectorAll(".shortCutGroup")[i].classList.contains("choose")) {
                    appendDom = document.querySelectorAll(".shortCutGroup")[i];
                    break;
                }
            }
            if (!appendDom) {
                document.querySelectorAll(".shortCutGroup")[0].classList.add("choose");
                appendDom = document.querySelectorAll(".shortCutGroup")[0];
            }
            appendDom.querySelector(".shortCutUl").appendChild(item);
            appendDom.querySelector(".shortCutUl").lastElementChild.querySelector(".operateArea .remove").style.display = "inline";


        } else {
            document.querySelector(".shortCut1").appendChild(item);
            document.querySelector(".shortCut1").lastElementChild.querySelector(".operateArea .remove").style.display = "inline";

        }
    }
}

/**
 * 保存磁贴
 * @return {[type]} [description]
 */
function saveAllPortlets(callFn) {
    var groupList = [];
    var saveState = true;
    switch (MODE_TYPE) {
        case 1:
            for (var i = 0; i < document.querySelectorAll(".shortCutGroup").length; i++) {
                var _group = document.querySelectorAll(".shortCutGroup")[i];
                var _groupName = _group.querySelector(".groupTitle span").innerText;
                var _portletList = [];
                if (_group.querySelectorAll(".shortCutUl li").length > 0) {
                    for (var j = 0; j < _group.querySelectorAll(".shortCutUl li").length; j++) {
                        var _portlet = _group.querySelectorAll(".shortCutUl li")[j].querySelector(".operateArea .remove");
                        var _portletId = "";
                        if (_portlet) {
                            _portletId = _portlet.getAttribute("portletId");
                            _portletList.push(portletMap.get(_portletId));
                        }
                    }
                    groupList.push({
                        "groupName": _groupName,
                        "groupType": "1",
                        "portlets": _portletList
                    });
                } else {
                    cmp.notification.toast(cmp.i18n("shortcut.group.notnull", _groupName), "center");
                    saveState = false;
                }
            }
            break;
        case 0:
            if (document.querySelectorAll(".shortCut1 li").length > 0) {
                var _portletList = [];
                for (var i = 0; i < document.querySelectorAll(".shortCut1 li").length; i++) {
                    var _portlet = document.querySelectorAll(".shortCut1 li")[i];

                    var nPortlet = _portlet.querySelector(".operateArea .remove");
                    if (nPortlet) {
                        var _portletId = nPortlet.getAttribute("portletId");
                        _portletList.push(portletMap.get(_portletId));
                    }
                }

                if (_portletList.length > 0) {
                    var normalGroup = {
                        "groupName": "",
                        "groupType": "0",
                        "portlets": _portletList
                    };
                    groupList.push(normalGroup);
                }
            } else {
                cmp.notification.toast(cmp.i18n("shortcut.add.min.count"), "center");
                saveState = false;
            }
            break;
        case 2:
            if (document.querySelectorAll(".shortCut1 li").length > 0) {
                var _portletList = [];
                for (var i = 0; i < document.querySelectorAll(".shortCut1 li").length; i++) {
                    var _portlet = document.querySelectorAll(".shortCut1 li")[i];
                    if (_portlet.classList.contains("folderItem")) {

                        var _fgroupName = _portlet.querySelector(".operateArea .name .groupName").innerText;
                        var inputs = _portlet.querySelectorAll(".operateArea input");
                        if (inputs.length > 0) {
                            for (var j = 0; j < inputs.length; j++) {
                                _portletList.push(portletMap.get(inputs[j].value));
                            }
                            groupList.push({
                                "groupName": _fgroupName,
                                "groupType": "2",
                                "portlets": _portletList
                            });
                            _portletList = [];
                        } else {
                            cmp.notification.toast(cmp.i18n("shortcut.group.notnull", _fgroupName), "center");
                            saveState = false;
                        }
                    } else {
                        var nPortlet = _portlet.querySelector(".operateArea .remove");
                        if (nPortlet) {
                            var _portletId = nPortlet.getAttribute("portletId");
                            var normalGroup = {
                                "groupName": "",
                                "groupType": "0",
                                "portlets": [portletMap.get(_portletId)]
                            };
                            groupList.push(normalGroup);
                        }
                    }
                }
            } else {
                cmp.notification.toast(cmp.i18n("shortcut.add.min.count"), "center");
                saveState = false;
            }
            break;
    }
    if (!saveState) {
        callFn.error();
        return;
    }
    var params = {
        "sourceValue": sourceValue,
        "groupList": groupList,
        "entityId": entityId,
        "spaceId": spaceId
    };
    var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
    cmp.ajax({
        type: "POST",
        data: JSON.stringify(params),
        url: replaceAjaxUrl("/seeyon/rest/shortcut/saveShortCut"),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': cmp.language || "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        dataType: "json",
        success: function(result) {
            if (result && result.data) {
                var ids = result.data.split(";");
                sourceValue = ids[2];
                entityId = ids[1];
                spaceId = ids[0];
                cmp.notification.toast(cmp.i18n("shortcut.save.success"), "center");
                callFn.success();
            }
        },
        error: function(error) {
            console.log(error);
            callFn.error();
        }
    });
}

function replaceMagnetIcon(_icon) {
    if (_icon === undefined) {
        return;
    }
    if (_icon === "") {
        return "";
    }
    if (_icon.indexOf(".png") > -1) {
        return _icon.replace(/^(d_)?(\w+).(\w+)$/, "$2");
    }
    if (_icon.indexOf("vp-") > -1) {
        return _icon.replace(/^(d_)?(\w+).(\w+)$/, "$3");
    }
    return _icon;
}

var replaceUrl4M3 = function(_linkUrl) {
    if (cmp.platform.CMPShell) {
        var _finalUrl = _linkUrl;
        if (_linkUrl.indexOf("/seeyon/m3/apps/v5/collaboration") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/collaboration", _colPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/bulletin") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/bulletin", _bulPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/news") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/news", _newsPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/doc") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/doc", _docPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/mycollection") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/mycollection", _mycollectionPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/unflowform") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/unflowform", _unflowformPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/workflow") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/workflow", _workflowPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/formqueryreport") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/formqueryreport", _formqueryreportPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/edoc") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/edoc", _edocPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/meeting") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/meeting", _meetingPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/bbs") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/bbs", _bbsPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/inquiry") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/inquiry", _inquiryPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/taskmanage") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/taskmanage", _taskmanagePath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/calendar") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/calendar", _calendarPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/addressbook") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/addressbook", _addressbookPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/attendance") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/attendance", _attendancePath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/hr") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/hr", _hrPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/footprint") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/footprint", _footprintPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/show") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/show", _showPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/portal") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/portal", _portalPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/vreport") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/vreport", _vreportPath);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/fullsearch") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/fullsearch", _fullsearch);
        } else if (_linkUrl.indexOf("/seeyon/m3/apps/v5/cap4") != -1) {
            _finalUrl = _finalUrl.replace("/seeyon/m3/apps/v5/cap4", _cap4Path);
        }
        return _finalUrl;
    } else {
        return _linkUrl;
    }
}
