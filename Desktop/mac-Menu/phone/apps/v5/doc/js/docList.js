var id;
var isForm;
var is_scroll;
var page = {};
var last_fr_type = "0";
var last_isShareAndBorrowRoot = false;
var fromBiz = false;
var all;
var add;
var edit;
var docLibId;
var parentFrId;
var commentEnabled;
var recommendEnable;
var versionEnabled;
var proTypeId;
var doc_lib_type;
var urlParam;
var msgRegEx_0 = "errorCode";
var initNum = 0;
var flag = false;
var layer_num = 0; //图层数
var clickPath = false;
var openFrom = "";
var fromOthers = false;
//文档列表参数
function listviewParams() {
    this.id = "";
    this.frType = "0";
    this.proTypeId = "";
    this.searchFun = "";
    this.condition = "";
    this.dataSoure = "";
    this.searchType = "";
    this.isShareAndBorrowRoot = false;
    this.fromBiz = false;
}
var listviewData = new listviewParams();
//文档路径参数
function docPathParams() {
    this.id = "";
    this.frType = "0";
    this.isShareAndBorrowRoot = false;
}
var docPathData = new docPathParams();
//上传文档ID数组
var arr = [];
var newArr = [];

cmp.ready(function() {
    if (_getQueryString("VJoinOpen") == "VJoin" || _getQueryString("from") == "shortcut") {
        id = _getQueryString("id");
        doc_lib_type = _getQueryString("frType");
        isForm = false;
        fromOthers = true;
    } else {
        urlParam = cmp.href.getParam();
        if (urlParam == undefined) { //如果没有从缓存中取值
            id = cmp.storage.get("last_id");
            isForm = cmp.storage.get("isForm");
            isForm2Boolean();
            doc_lib_type = cmp.storage.get("last_fr_type");
            last_isShareAndBorrowRoot = cmp.storage.get("last_isShareAndBorrowRoot");
        } else {
            id = urlParam["id"];
            isForm = urlParam["isForm"];
            doc_lib_type = urlParam["doc_lib_type"];

            if (urlParam["openFrom"] != undefined) {
                openFrom = urlParam["openFrom"];
            }

        }
        if (!isForm) {
            if (cmp.storage.get("isForm")) {
                isForm2Boolean();
                cmp.storage.save("isForm", "");
            } else {
                isForm = false;
            }
        }
    }

    var frombiz = cmp.href.getParam("fromBiz");
    if (frombiz != undefined) {
        fromBiz = frombiz;
    }
    headerShowOrNot();
    is_scroll = new cmp.iScroll('#boxscrolll', {
        hScroll: true,
        vScroll: false
    });
    var back_flg = false;
    if (cmp.storage.get("last_id")) {
        id = cmp.storage.get("last_id");
        last_fr_type = cmp.storage.get("last_fr_type");
        last_isShareAndBorrowRoot = cmp.storage.get("last_isShareAndBorrowRoot");
        back_flg = true;
        cmp.storage.save("last_id", "");
        cmp.storage.save("last_fr_type", "0");
        cmp.storage.save("last_isShareAndBorrowRoot", false);
    }

    var layerNum = cmp.storage.get("layer_num")==null?layer_num:cmp.storage.get("layer_num");
    addLayer(layerNum);

    prevPage(backClick);
    docPathData = new docPathParams();
    docPathData.id = id;
    docPathData.frType = last_fr_type;
    docPathData.isShareAndBorrowRoot = last_isShareAndBorrowRoot;
    getPath(docPathData);

    listviewData = new listviewParams();
    listviewData.id = id;
    listviewData.frType = last_fr_type;
    listviewData.isShareAndBorrowRoot = last_isShareAndBorrowRoot;
    listviewData.fromBiz = fromBiz;
    //搜索结果进入详情返回，搜索结果回显
    if (loadConditions()) {
        listviewData.searchFun = $s.Docs.archiveList;
        listviewData.condition = page.condition;
        listviewData.dataSoure = page.dataSoure;
        listviewData.searchType = page.searchType;
    }
    initListView(listviewData);

    _$("#cmp_search_textHandler").addEventListener("click", function() {
        pageSearch();
    });
    searchDo();
    initEvent();
    initOpen();
    goHome();

    setInterval(function() {
        if (document.getElementById("v5UploadCloseBtn")) {
            if (!document.getElementById("v5UploadCloseBtn").innerHTML) {
                document.getElementById("v5UploadCloseBtn").innerHTML = "<span style='font-size: 14px;color: #3aadfb!important;'>"+cmp.i18n("doc.h5.back")+"</span>"
            }
        }
    }, 50);
	document.title = cmp.i18n("doc.h5.docCenter");
});

//搜索后重置
function searchDo() {
    // 取消重新加载页面
    _$("#cancelSearch").addEventListener("click", function() {
        // 重置搜索条件
        listviewData = new listviewParams();
        listviewData.id = page.id;
        initListView(listviewData);

        docPathData = new docPathParams();
        docPathData.id = page.id;
        getPath(docPathData);

        page = {};
        reloadPage();
    });

    _$("#toSearch").addEventListener("click", function() {
        var params = {};
        params.type = page.type;
        params.text = page.text;
        params.condition = page.condition;
        var id = page.id;
        if (page.type == "date") {
            params.value = [page.begin, page.end];
        } else {
            params.value = page.dataSoure;
        }
        pageSearch(params);
    });
}

function reloadPage() {
    // 搜索条件
    var searchDiv = _$("#search");
    var reSearchDiv = _$("#reSearch");
    if (page.condition != undefined) {
        searchDiv.style.display = "none";
        reSearchDiv.style.display = "block";
        if (page.condition != "createTime") {
            _$("#searchText").style.display = "block";
            _$("#searchDate").style.display = "none";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchTextValue").value = page.dataSoure;
        } else {
            _$("#searchText").style.display = "none";
            _$("#searchDate").style.display = "block";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchDateBeg").value = page.begin;
            _$("#searchDateEnd").value = page.end;
        }
    } else {
        searchDiv.style.display = "block";
        reSearchDiv.style.display = "none";
    }
}

function pageSearch(params) {
    var searchObj = [{
        type: "text",
        condition: "frName",
        text: cmp.i18n("doc.h5.title")
    }, {
        type: "date",
        condition: "createTime",
        text: cmp.i18n("doc.h5.createDate")
    }];
    cmp.search.init({
        id: "#search",
        model: { //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name: "doc", //模块名，如："协同"，名称开发者自定义
            id: "8967" //模块的唯一标识：
        },
        parameter: params,
        items: searchObj,
        callback: function(result) { //回调函数：会将输入的搜索条件和结果返回给开发者
            var data = result.item; //返回的搜索相关的数据
            var condition = data.condition; //返回的搜索条件
            var dataSoure = ""; //搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
            var type = data.type; //搜索输入的数据类型有text和date两种
            var renderArea = data.search_result_render_area_ID; //提供一个该搜索页面上的可渲染的区域（可使用其作为滚动的容器）
            page["type"] = type;
            page["text"] = data.text;
            page["condition"] = condition;
            page["id"] = id;
            var searchType = "1";
            if (type == "date") {
                searchType = "5";
                dataSoure = result.searchKey[0] + "," + result.searchKey[1];
                page["begin"] = result.searchKey[0];
                page["end"] = result.searchKey[1];
                page["dataSoure"] = dataSoure;
            } else {
                dataSoure = result.searchKey[0];
                page["dataSoure"] = result.searchKey[0];
            }
            page["searchType"] = searchType;

            listviewData = new listviewParams();
            listviewData.id = id;
            listviewData.searchFun = $s.Docs.archiveList;
            listviewData.condition = condition;
            listviewData.dataSoure = dataSoure;
            listviewData.searchType = searchType;

            initListView(listviewData);
            reloadPage();
        }
    });
}

//将当前listview容器，以及查询框状态存入sessionStorage
function saveConditions() {
    cmp.storage.save("page", cmp.toJSON(page), true);
}
//从缓存中读取查询框状态
function loadConditions() {
    var pageCondition = cmp.storage.get("page", true);
    if (pageCondition != "{}" && pageCondition != null) {
        page = eval('(' + pageCondition + ')');
        cmp.storage.delete("page", true);
        reloadPage();
        return true;
    } else {
        return false;
    }
}

function initEvent() {
    //给面包屑添加点击事件
    cmp("#breadTop").on("tap", ".on-text", function() {
        var _id = this.getAttribute("id");
        var cmpData = this.getAttribute("cmp-data");
        var _protypeId = this.getAttribute("pro-type-id");
        var _frype = this.getAttribute("fr-type");
        if (null == _frype) {
            _frype = "";
        }
        if (null == _protypeId) {
            _protypeId = "";
        }
        cmp.dialog.loading();
        $s.Doc.isExist({
            "drId": _id,
            "frType": _frype
        }, {
            repeat: true,
            success: function(result) {
                if (!result) {
                    cmp.notification.alert(cmp.i18n("doc.notExist"), function() {
                        location.reload(true);
                    }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    return;
                } else {
                    id = _id;
                    listviewData = new listviewParams();
                    listviewData.id = _id;
                    listviewData.frype = _frype;
                    listviewData.protypeId = _protypeId;
                    initListView(listviewData);

                    docPathData = new docPathParams();
                    docPathData.id = _id;
                    clickPath = true;
                    getPath(docPathData);

                    page = {};
                    reloadPage();
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
    });
    //文档上传
    _$("#add").addEventListener("click", function() {
        var param = {
            "drId": parentFrId
        };
        cmp.dialog.loading();
        //判断该文档夹是否有新建权限
        $s.Docs.hasAcl(param, {
            repeat: true,
            success: function(result) {
                if (!result) {
                    cmp.notification.toastExtend(cmp.i18n("doc.h5.no.acl"), 2000);
                    _$(".content-typical2").style.width = "200px";
                    _$(".content-typical2").style.textAlign = "center";
                    reloadList();
                } else {
                    //判断文档库类型确定需要显示的组件
                    var showType = 4;
                    if (doc_lib_type == 3) {
                        showType = 3;
                    }

                    proTypeId = _$(".no-text").getAttribute("pro-type-id");
                    if (proTypeId == null) {
                        proTypeId = "";
                    }

                    var params = {
                        showAuth: showType, //显示权限，1，只显示附件按钮，2，只显示关联文档按钮，3,只显示新建文件夹按钮，4，显示新建文件夹按钮+拍照+本地文件+本地图片，其余数字两种按钮一起显示（但是不显示新建文件夹按钮）
                        initDocData: null, //默认存在的关联文档数据
                        initAttData: null, //默认存在的附件数据
                        fileWrapper: null, //将附件渲染到开发者指定的位置，如果为null则组件自己渲染(如协同处理页面，需要开发者自定义渲染位置)
                        callback: fileBack, //回调函数，将选择好的附件和关联文档返回给开发者
                        delCallback: delFileBack, //如果开发者设置了fileWrapper即自定义渲染位置，需要传删除的回调函数，告诉开发者删除的是哪个文件
                        clearCache: true, //是否 清空以缓存数据
                        docPenetrateCallback: null, //关联文档的穿透查看
                        createFolderCallback: createfolder, //创建文件夹的回调调用开发者提供的接口
                        closeCallback: close2UploadFile, //关闭【继续上传】页面回调
                        continueUpload: true, //根据业务需要是否显示继续上传附件
                        pageKey: null //页面跳转开发者自定义取数据的key
                    };
                    cmp.dialog.loading(false);
                    //调用上传组件
                    if (initNum == 0) {
                        cmp.asyncLoad.css([_cmpPath + "/css/cmp-att.css" + _buildversion]);
                        var jses = [_cmpPath + "/js/cmp-att.js" + _buildversion];
                        cmp.asyncLoad.js(jses, function() {
                            cmp.att.initUpload("#uploadFile", params);
                        });
                        initNum++;
                    } else {
                        cmp.att.initUpload("#uploadFile", params);
                    }

                    //创建文档夹
                    function createfolder() {
                        initFolder();
                    }
                    //上传回调
                    function fileBack(result) {
                        var fileId = result[0]["fileUrl"];
                        arr.push(fileId);
                    }
                    //删除回调
                    function delFileBack(result) {
                        var fileId = result["fileUrl"];
                        newArr = [];
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == fileId) {
                                continue;
                            }
                            newArr.push(arr[i]);
                        }
                        //清空数组
                        arr = [];
                        arr = newArr;
                    }
                    //关闭并上传文档
                    function close2UploadFile() {
                        var ids = "";
                        if (arr.length != 0) {
                            for (var i = 0; i < arr.length; i++) {
                                ids = ids + arr[i] + ",";
                            }
                            ids = ids.substring(0, ids.length - 1);

                            var param = {
                                "docLibId": docLibId,
                                "docResourceId": parentFrId,
                                "parentCommentEnabled": commentEnabled,
                                "parentRecommendEnable": recommendEnable,
                                "parentVersionEnabled": versionEnabled,
                                "docLibType": doc_lib_type,
                                "proTypeId": proTypeId,
                                "fileId": ids
                            };
                            cmp.dialog.loading();
                            $s.Docs.uploadDocFile({}, param, {
                                success: function(result) {
                                    if (result["state"] == true) {
                                        //刷新列表
                                        window.location.reload();
                                        //reloadList();
                                    } else {
                                        //提示
                                        var info = "";
                                        if (result["msg"] == "personal not enough") {
                                            info = cmp.i18n("doc.h5.personal.not.enough");
                                        } else if (result["msg"] == "same name" || result["msg"] == "doc_upload_dupli_name_failure_alert") {
                                            info = cmp.i18n("doc.h5.same.doc.name");
                                        } else if (result["msg"] == "no folder") {
                                            info = cmp.i18n("doc.h5.no.exist.folder");
                                        } else {
                                            info = result["msg"];
                                        }
                                        cmp.notification.toastExtend(info, 2000);
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
                        }
                        //清空数组
                        arr = [];
                        newArr = [];
                    }
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {

                } else {}
                cmp.dialog.loading(false);
            }
        });
    });
    //相关数据添加取消事件
    _$("#cancel").addEventListener("click", function() {
        cmp.href.back();
    });
}

function backClick() {
    cmp.connection.getNetworkType({
        success: function(networkState) {
            if (networkState == "none") {
                cmp.href.closePage();
                return;
            }
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
            cmp.href.closePage();
        }
    })

    if (document.getElementsByClassName("on-text").length > 0 && !isForm && !fromOthers) {
        var a_size = _$("#breadcrumb").getElementsByTagName("a").length;
        var index = a_size - 3;
        for (var i = a_size - 1; i > index; i--) {
            _$("#breadcrumb").removeChild(_$("#breadcrumb").getElementsByTagName("a")[i]);
        }
        var newIndex = _$("#breadcrumb").getElementsByTagName("a").length - 1;
        var lastATag = _$("#breadcrumb").getElementsByTagName("a")[newIndex];
        lastATag.className = "no-text";
        var _id = lastATag.getAttribute("id");
        id = _id;

        listviewData = new listviewParams();
        listviewData.id = _id;
        initListView(listviewData);

        docPathData = new docPathParams();
        docPathData.id = _id;
        getPath(docPathData);

        cmp.backbutton.pop();
        if (layer_num > 0) {
            layer_num--;
        }
        page = {};
        reloadPage();
    } else if (isForm || fromOthers) {
        cmp.storage.save("last_id", "");
        cmp.href.back();
    } else if (openFrom == "dataRelation") {
        var nextFlash = {
            "animated": true,
            "direction": "right"
        };
        var params = {openFrom :"dataRelation"}
        cmp.href.go(_docPath + "/html/docIndex.html?cmp_orientation=auto", params, nextFlash);
    }else {
        cmp.storage.save("last_id", "");
        cmp.href.back();
//        var nextFlash = {
//            "animated": true,
//            "direction": "right"
//        };
//        cmp.href.next(_docPath + "/html/docIndex.html", null, nextFlash);
    }
}

//渲染函数
function renderData(data, isRefresh) {
    var liTPL = _$("#pageContent_tpl").innerHTML;
    var html = cmp.tpl(liTPL, data);
    var content_dom = _$("#list_content");
    if (isRefresh) {
        content_dom.innerHTML = html;
    } else {
        content_dom.innerHTML = content_dom.innerHTML + html;
    }
    cmp.i18n.detect();
}

var obj = {};

function initOpen() {
    cmp(".cmp-list-content").on("tap", ".cmp-list-cell",
        function() {
            var cmpData = cmp.parseJSON(this.getAttribute("cmp-data"));
            var frId = cmpData["fr_id"];
            var entranceType = cmpData["entranceType"];
            var fr_type = cmpData["fr_mine_type"];
            var isShareAndBorrowRoot = cmpData["isShareAndBorrowRoot"];
            obj = {};
            obj.cmpData = cmpData;
            cmp.dialog.loading();
            if (cmpData["is_folder"]) { // 这里是文件夹
                $s.Doc.isExist({
                    "drId": frId,
                    "frType": cmpData["fr_type"]
                }, {
                    repeat: true,
                    success: function(result) {
                        if (!result) {
                            cmp.notification.alert(cmp.i18n("doc.notExist"), function() {
                                location.reload(true);
                            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                            return;
                        } else {
                            var docName = cmpData["fr_name"];
                            var docId = cmpData["fr_id"];
                            id = docId;

                            listviewData = new listviewParams();
                            listviewData.id = cmpData["fr_id"];
                            listviewData.frType = cmpData["fr_type"];
                            listviewData.proTypeId = cmpData["project_type_id"];
                            listviewData.isShareAndBorrowRoot = isShareAndBorrowRoot;
                            initListView(listviewData);

                            docPathData = new docPathParams();
                            docPathData.id = docId;
                            docPathData.frType = cmpData["fr_type"];
                            docPathData.isShareAndBorrowRoot = isShareAndBorrowRoot;
                            getPath(docPathData);

                            cmp.backbutton.push(backClick);
                            layer_num++;
                            page = {};
                            reloadPage();
                        }
                    },
                    error: function(error) {
                        var cmpHandled = cmp.errorHandler(error);
                        if (cmpHandled) {

                        } else {}
                    }
                });
            } else {
                //判断文档是否存在
                $s.Doc.canOppen({
                    "drId": frId,
                    "frType": cmpData["fr_type"],
                    "entranceType": entranceType
                }, {
                    repeat: true,
                    success: function(result) {
                        if (result == "1") {
                            //当前文档不存在
                            cmp.notification.alert(cmp.i18n("doc.h5.noExist"), function() {
                                cmp.listView("#allPending").pullupLoading(1);
                                cmp.dialog.loading(false);
                            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                            return;
                        } else if (result == "2") {
                            //没有打开文档的权限
                            cmp.notification.alert(cmp.i18n("doc.h5.noAuthoir"), function() {
                                cmp.dialog.loading(false);
                            }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                            return;
                        } else if (result == "0") {
                            var source_fr_type = fr_type;
                            if (fr_type == 51) { //映射文件
                                $s.Docs.getDosBySourceId(cmpData["source_id"], "", {
                                    repeat: true,
                                    success: function(docsData) {
                                        fr_type = docsData.frType;
                                        var doc_id = docsData.id;
                                        var isPig = docsData.isPig;
                                        if (isPig == 'true') {
                                            cmpData["source_id"] = docsData.sourceId;
                                        }
                                        docCanOpen(fr_type, doc_id, cmpData, source_fr_type);
                                    },
                                    error: function(error) {
                                        var cmpHandled = cmp.errorHandler(error);
                                        if (cmpHandled) {

                                        } else {}
                                    }
                                });
                            } else {
                                docCanOpen(fr_type, frId, cmpData, source_fr_type);
                            }
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
            }
        }, false);
}
/**
 *
 */
function docCanOpen(fr_type, frId, cmpData, source_fr_type) {
    var backPageInfo = _docPath + "/html/docList.html?cmp_orientation=auto";
    //搜索状态放入缓存方法
    saveConditions();
    if ((fr_type >= 101 && fr_type <= 122) || (fr_type >= 21 && fr_type <= 26)) {
        openRealDoc(frId, source_fr_type);
    } else { //讨论
        var source_id = cmpData["source_id"];
        saveStorage();
        $s.Doc.insertOpLog4Doc({
            "drId": frId
        }, {
            success: function() {
                if (fr_type == 8) { //讨论
                    bbsApi.jumpToBbs(source_id, "pigeonhole", backPageInfo);
                } else if (fr_type == 7) { //调查
                    inquiryApi.jumpToInquiry(source_id, "1", backPageInfo);
                } else if (fr_type == 6) { //公告
                    bulletinApi.jumpToBulletin(source_id, "1", backPageInfo);
                } else if (fr_type == 5) { //新闻
                    newsApi.jumpToNews(source_id, "1", backPageInfo);
                } else if (fr_type == 1 || fr_type == 9) { //协同、流程表单
                    collApi.openSummary({
                        summaryId: source_id,
                        openFrom: "docLib",
                        operationId: "1",
                        docResId: cmpData["fr_id"]
                    });
                } else if (fr_type == 2) { //公文
                    edocApi.openSummary({
                        summaryId: source_id,
                        openFrom: "lenPotent",
                        docResId: cmpData["fr_id"]
                    });
                } else if (fr_type == 4) { //会议
                    meetingApi.jumpToMeetingSummary(source_id, "docLib", backPageInfo);
                } else { //暂时其他的类型
                    cmp.notification.alert(cmp.i18n("doc.h5.docTypeError"), null, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {

                } else {}
            }
        });
    }
}

function initListView(listviewParams) {
    if (fromBiz) { //如果来自业务生成器
        cmp.dialog.loading();
        // 这里是文件夹
        $s.Doc.isExist({
            "drId": listviewParams.id,
            "frType": listviewParams.frType
        }, {
            repeat: true,
            success: function(result) {
                if (!result) {
                    cmp.notification.alert(cmp.i18n("doc.notExist"), function() {
                        cmp.dialog.loading(false);
                        cmp.href.closePage();
                    }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    return;
                }
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {

                } else {}
            }
        });
    }
    var param = {
        "docId": listviewParams.id,
        "frType": listviewParams.frType,
        "pro_type_id": listviewParams.proTypeId,
        "isShareAndBorrowRoot": listviewParams.isShareAndBorrowRoot,
        "fromBiz": listviewParams.fromBiz
    };
    if (listviewParams.searchFun != "") {
        listFun = listviewParams.searchFun;
        param = {
            "archiveID": listviewParams.id,
            "searchType": listviewParams.searchType,
            "propertyName": listviewParams.condition,
            "value1": listviewParams.dataSoure
        };
    }
    cmp.dialog.loading();
    cmp.listView("#allPending", {
        config: {
            pageSize: 20,
            params: param,
            crumbsID: listviewParams.id,
            dataFunc: function(params, options) {
                if (listviewParams.searchFun) {
                    $s.Docs.archiveList("", params, {
                        success: function(result) {
                            var upload = _$("#add");
                            upload.style.display = "none";
                            options.success(result);
                            cmp.dialog.loading(false);
                        },
                        error: function(error) {
                            var cmpHandled = cmp.errorHandler(error);
                            if (cmpHandled) {

                            } else {}
                            cmp.dialog.loading(false);
                        }
                    })
                } else {
                    $s.Docs.docs(params, {
                        repeat: true,
                        success: function(result) {
                            var res = result.data[0];
                            all = res.isAllAcl;
                            add = res.isAddAcl;
                            edit = res.isEditAcl;
                            commentEnabled = res.commentEnabled;
                            recommendEnable = res.recommendEnable;
                            versionEnabled = res.versionEnabled;
                            docLibId = res.docLibId;
                            parentFrId = res.parentFrId;
                            doc_lib_type = res.docLibType;
                            //是否显示上传按钮
                            isShowUpload();
                            if (res.result != undefined) {
                                var docs = [];
                                //为了符合cmp的格式
                                docs.data = res.result;
                                docs.total = result.total;
                                docs.pages = result.pages;
                                options.success(docs);
                            } else {
                                result.data = new Array;
                                options.success(result);
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
                }
            },
            renderFunc: renderData,
            isClear: true
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
}

/**
 * 存储数据to others
 */
function saveStorage() {
    var breadTail = _$(".no-text"); //获取面包屑上灰色字体(尾部)
    var last_id = breadTail.getAttribute("id");
    var last_fr_type = breadTail.getAttribute("fr-type");
    var last_isShareAndBorrowRoot = breadTail.getAttribute("isShareAndBorrowRoot");
    cmp.storage.save("last_id", last_id);
    cmp.storage.save("isForm", isForm);
    cmp.storage.save("last_fr_type", last_fr_type);
    cmp.storage.save("last_isShareAndBorrowRoot", last_isShareAndBorrowRoot);
    cmp.storage.save("layer_num", layer_num);
}

/**
 * 打开html页面
 */
function openRealDoc(drId, type) {
    saveStorage();
    var docParam = {
        "drId": drId,
        "isForm": isForm,
        "isFormCol": false,
        "source_fr_type": type,
        "pageInfo": _getCurrentPageInfo()
    }
    $s.Doc.insertOpLog4Doc({
        "drId": drId
    }, {
        success: function() {
            cmp.href.next(_docPath + "/html/docView.html?cmp_orientation=auto", docParam);
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
        }
    });
}

//获取当前页面信息,用于页面返回使用
function _getCurrentPageInfo() {
    var _thisPage = {
        "url": _docPath + "/html/docList.html?cmp_orientation=auto",
        "data": {
            "id": id
        }
    }
    return _thisPage;
}

//返回文档首页
function goHome() {
    cmp("#breadTop").on("tap", ".local", function() {
        var nextFlash = {
            "animated": true,
            "direction": "right"
        };
        var params = {};
        if (openFrom == "dataRelation") {
            params = {openFrom :"dataRelation"}
        }
        var popIndex = layer_num;
        cmp.href.popHistory(popIndex);
        cmp.storage.removeCacheData("layer_num", true);
        cmp.href.go(_docPath + "/html/docIndex.html?cmp_orientation=auto", params, nextFlash);
    });
}
//生成当前面包屑
function getPath(docPathData) {
    $s.Docs.getPath(docPathData.id, docPathData.isShareAndBorrowRoot, docPathData.frType, false, "", {
        repeat: true,
        success: function(result) {
            if (result.isShareAndBorrowRoot) {
                _$("#search").style.display = "none";
            }
            if (!result.getPathNull) {
                if (clickPath) { //获取点击面包屑后应追加图层的数量
                    layer_num = result.docNames.match(new RegExp('on-text', 'g')).length-1;
                    clickPath = false;
                }
                _$("#breadcrumb").innerHTML = result.docNames;
                var index = _$("#breadcrumb").getElementsByTagName("a").length - 1;
                _$("#breadcrumb").getElementsByTagName("a")[index].className = "no-text";
            }
            breadLength();
            if(document.getElementById("breadTop").clientWidth < document.getElementById("breadTop").scrollWidth){
                document.getElementById("breadTop").style.width = document.getElementById("breadTop").scrollWidth + 30 + "px";
                is_scroll.refresh();
                is_scroll.scrollTo(-is_scroll.scrollerW,0);
            }
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
        }
    });
}

/*是否显示上传按钮*/
function isShowUpload() {
    var upload = _$("#add");
    if (all == true || add == true || edit == true) {
        upload.style.display = "block";
        _$("#cmp_search_textHandler").style.width = "90%";
    } else {
        upload.style.display = "none";
        _$("#cmp_search_textHandler").style.width = "100%";
    }

    if (openFrom == "dataRelation") {
        upload.style.display = "none";
        var cancelButton = _$("#cancel");
        _$("#cmp_search_textHandler").style.width = "80%";
        cancelButton.style.display = "block";
    }
}

function initFolder() {
    if (doc_lib_type == 3) { //公文弹出需要后台画公文元素
        var html = "<div>" +
            "<div style='width:45%;float:left;line-height: 40px;'><span style='color:red'>*</span><span><i18n key='doc.h5.edoc.name'></i18n>:</span></div>" +
            "<div style='width:55%;float:right;line-height: 40px;'><input type='text' id='eodcTitle'/></div>" +
            "<div style='clear:both;'></div>" +
            "</div>" +
            "<div style='margin-top:5px;'>" +
            "<div style='width:45%;float:left;line-height: 40px;'><span style='color:red'>*</span><span><i18n key='doc.h5.edoc.year'></i18n>:</span></div>" +
            "<div style='width:55%;float:right;line-height: 40px;'><input type='text' id='integer2'/></div>" +
            "<div style='clear:both;'></div>" +
            "</div>" +
            "<div style='margin-top:5px;'>" +
            "<div style='width:45%;float:left;line-height: 40px;'><span style='color:red'>*</span><span><i18n key='doc.h5.edoc.pageno'></i18n>:</span></div>" +
            "<div style='width:55%;float:right;line-height: 40px;'><input type='text' id='avarchar13'/></div>" +
            "<div style='clear:both;'></div>" +
            "</div>" +
            "<div style='width:100%;float:left;line-height: 40px;'><span id='resultMsg' style='color:red'></span></div>" +
            "</div>";
        cmp.notification.confirm(html, function(index) {
            if (index == 0) {
                cmp.notification.close();
            } else if (index == 1) {
                if (flag) {
                    return;
                }
                flag = true;
                var title = _$("#eodcTitle").value;
                var integer2 = _$("#integer2").value;
                var avarchar13 = _$("#avarchar13").value;
                var params = {
                    "title": title,
                    "integer2": integer2,
                    "avarchar13": avarchar13,
                    "docLibId": docLibId,
                    "parentFrId": parentFrId,
                    "commentEnabled": commentEnabled,
                    "recommendEnable": recommendEnable,
                    "versionEnabled": versionEnabled,
                    "isEdocFolder": true
                };
                createFolder(params, true);
            }
        }, cmp.i18n("doc.h5.create.edoc.foleder"), [cmp.i18n("doc.h5.cancel"), cmp.i18n("doc.h5.OK")], -1, 1);
    } else {
        cmp.notification.prompt(cmp.i18n("doc.h5.create.foleder"), function(index, title, callbackObj) {
            if (index == 0) {
                cmp.notification.close();
            } else if (index == 1) {
                if (flag) {
                    return;
                }
                flag = true;
                var params = {
                    "title": title,
                    "docLibId": docLibId,
                    "parentFrId": parentFrId,
                    "commentEnabled": commentEnabled,
                    "recommendEnable": recommendEnable,
                    "versionEnabled": versionEnabled,
                    "isEdocFolder": false
                };
                createFolder(params, false, callbackObj);
            }
        }, [cmp.i18n("doc.h5.cancel"), cmp.i18n("doc.h5.OK")], cmp.i18n("doc.h5.create.foleder.name"), "", 1, 1);
    }
    cmp.i18n.detect();
}

//创建文件夹
function createFolder(params, isEdocFolder, callbackObj) {
    var msg = checkForm4Folder(params);
    if (msg != "") {
        if (isEdocFolder) {
            _$("#resultMsg").innerHTML = msg;
        } else {
            _$(".error").style.marginTop = "-15px";
            _$(".error").style.width = "84%";
            callbackObj.error(msg);
        }
        flag = false;
    } else {
        cmp.dialog.loading();
        $s.Docs.createFoleder({}, params, {
            success: function(result) {
                cmp.dialog.loading(false);
                if (result.code != '0') {
                    if (isEdocFolder) {
                        if (result.message == "same name" || result.message == "doc_upload_dupli_name_folder_failure_alert") {
                            result.message = cmp.i18n("doc.h5.same.folder.name");
                        }
                        _$("#resultMsg").innerHTML = result.message;
                    } else {
                        var info = "";
                        if (result.message == "no folder") {
                            info = cmp.i18n("doc.h5.no.exist.folder");
                        } else if (result.message == "too deep") {
                            info = cmp.i18n("doc.h5.too.deep");
                        } else if (result.message == "same name" || result.message == "doc_upload_dupli_name_folder_failure_alert") {
                            info = cmp.i18n("doc.h5.same.folder.name");
                        }
                        _$(".error").style.marginTop = "-15px";
                        _$(".error").style.width = "84%";
                        callbackObj.error(info);
                    }
                } else {
                    cmp.notification.close();
                    reloadList();
                }
                flag = false;
            },
            error: function(error) {
                var cmpHandled = cmp.errorHandler(error);
                if (cmpHandled) {

                } else {}
                cmp.dialog.loading(false);
            }
        });
    }
}

//校验
function checkForm4Folder(params) {
    var msg = "";
    var title = params["title"];
    if (title == "" || title == null || title.trim() == "") {
        return cmp.i18n("doc.h5.name.null");
    }
    var character = "\/|><:*?'&%$";
    var msg = "";
    for (var i = 0; i < character.length; i++) {
        if (title.indexOf(character.charAt(i)) > -1) {
            msg += character.charAt(i);
        }
    }
    if (msg != "") {
        var res = cmp.i18n("doc.h5.doc.dig");
        res = res.replace(msgRegEx_0, msg);
        return res;
    }


    if (title.length > 80) {
        return cmp.i18n("doc.h5.name.length");
    }
    var isEdocFolder = params["isEdocFolder"];
    if (isEdocFolder) {
        var avarchar13 = params["avarchar13"];
        var integer2 = params["integer2"];
        if (integer2 == "" || integer2 == null || integer2.trim() == "") {
            return cmp.i18n("doc.h5.edoc.year.null");
        }
        if (!(/(^[1-9]\d*$)/.test(integer2))) {
            return cmp.i18n("doc.h5.edoc.year.dig");
        }
        if (integer2 < 1900) {
            return cmp.i18n("doc.h5.edoc.year.small");
        }
        if (integer2 > 9999) {
            return cmp.i18n("doc.h5.edoc.year.huge");
        }
        if (avarchar13 == "" || avarchar13 == null || avarchar13.trim() == "") {
            return cmp.i18n("doc.h5.edoc.pageno.null");
        }
        if (avarchar13.length > 85) {
            return cmp.i18n("doc.h5.edoc.pageno.length");
        }
    }
    return msg;
}
//重新加载List
function reloadList() {
    if (_$(".no-text")) {
        var breadTail = _$(".no-text");
        var frType = breadTail.getAttribute("fr-type");
        var isshareandborrowroot = breadTail.getAttribute("isshareandborrowroot");
        var id = breadTail.getAttribute("id");
        var proTypeId = breadTail.getAttribute("pro-type-id");
        if (proTypeId == null) {
            proTypeId = "";
        }
        listviewData = new listviewParams();
        listviewData.id = id;
        listviewData.frType = frType;
        listviewData.proTypeId = proTypeId;
        listviewData.isShareAndBorrowRoot = isshareandborrowroot;
        initListView(listviewData);
    } else {
        location.reload(true);
    }
}

function isForm2Boolean() {
    if (cmp.storage.get("isForm") == "true" || cmp.storage.get("isForm") == true) {
        isForm = true;
    } else {
        isForm = false;
    }
}

function addLayer(num) {
    layer_num = num;
    for (var i = 0; i < num; i++) {
        cmp.backbutton.push(backClick);
    }
}

//解析url方法
function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}