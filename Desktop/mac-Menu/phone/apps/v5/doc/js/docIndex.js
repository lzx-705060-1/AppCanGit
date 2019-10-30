var openFrom = "";
var urlParam;
//是否从底导航打开
var isFromM3NavBar = window.location.href.match('m3from=navbar');

cmp.ready(function() {
    cmp.storage.save("last_id", "");
    getParams();
    prevPageBack();
    headerShowOrNot();
    docLibsAjax();
    document.title = cmp.i18n("doc.h5.docCenter");
    //addCloseButton();
});

var isImport = false;
/**
 * 获取文档列表
 * @returns
 */
function docLibsAjax() {
    cmp.dialog.loading();
    $s.Docs.doclibs({}, {
        repeat: true,
        success: function(result) {
            renderData(result);
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

//渲染函数
function renderData(datas) {
    var liTPL = _$("#pageContent_tpl").innerHTML;
    var html = cmp.tpl(liTPL, datas);
    var content_dom = _$(".cmp-control-content");
    content_dom.innerHTML = content_dom.innerHTML + html;
    pageJump();
    color_sort();
    if (!isImport) {
        cmp.asyncLoad.css([_cmpPath + "/css/cmp-listView.css" + _buildversion]);
        var jses = [_cmpPath + "/js/cmp-listView.js" + _buildversion];
        cmp.asyncLoad.js(jses, function() {
            cmp.listView("#scroll");
            isImport = true;
        });
    } else {
        cmp.listView("#scroll");
    }
}

function color_sort() {
    //    对列表进行颜色排列
    var cmp_grid_view = document.querySelector('.cmp-grid-view');
    var aplication = cmp_grid_view.querySelectorAll('.application');

    var folder_count = [];
    for (var i = 0; i < aplication.length; i++) {
        var cmpData = cmp.parseJSON(aplication[i].childNodes[0].attributes["cmp-data"].value);
        var fr_type = cmpData["doclib_type"];
        var color = "";
        if (fr_type == 1) {
            color = "#5e97f6";
        } else if (fr_type == 5) {
            color = "#AE5E5E";
        } else if (fr_type == 2) {
            color = "#9a89b9";
        } else if (fr_type == 4) {
            color = "#5ec9f6";
        } else if (fr_type == 3) {
            color = "#FF3B30";
        } else {
            folder_count.push(aplication[i]);
        }
        aplication[i].firstChild.style.color = color;
    }
    for (var j = 0; j < folder_count.length; j++) {
        if (j % 3 == 0) {
            folder_count[j].firstChild.style.color = "#f5c52f";
        } else if (j % 3 == 1) {
            folder_count[j].firstChild.style.color = "#ff943e";
        } else if (j % 3 == 2) {
            folder_count[j].firstChild.style.color = "#ea4a4a";
        }
    }
}

function pageJump() {
    cmp(".cmp-table-view").on("tap", ".cmp-table-view-cell", function() {
        var id = this.getAttribute("id");
        var doc_lib_name = this.getAttribute("name");

        if (null == id) {
            return;
        }
        cmp.dialog.loading();
        $s.Doc.exitsDocLib({
            "docId": id
        }, {
            success: function(result) {
                if (!result) {
                    cmp.notification.alert(cmp.i18n("doc.lib.disabled"), function() {
                        location.reload(true);
                    }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                    return;
                } else {
                    if (openFrom == "dataRelation") {
                        var param = {
                            "id": id,
                            "doc_lib_name": doc_lib_name,
                            "isForm": false,
                            "openFrom":openFrom
                        };
                        cmp.href.go(_docPath + "/html/docList.html?cmp_orientation=auto", param);
                    } else {
                        var param = {
                            "id": id,
                            "doc_lib_name": doc_lib_name,
                            "isForm": false
                        };
                        var option = {};
                        if(isFromM3NavBar){
                            option.openWebViewCatch = true;
                        }
                        cmp.href.next(_docPath + "/html/docList.html?cmp_orientation=auto", param , option);
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

    });
}


function prevPageBack() {
    /*if(isFromM3NavBar){
        document.getElementById("prev").style.display = "none";
    }else{
        cmp("header").on('tap', "#prev", function(e) {
            backFrom();
        });
    }*/
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}


function backFrom() {
    if (isFromM3NavBar){
        cmp.closeM3App();
        return;
    }
    if (_getQueryString("backURL") == "weixin") {
        cmp.href.closePage();
        return;
    }
    cmp.href.back();
}

function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
    return null; //返回参数值
}

function getParams(){
    urlParam = cmp.href.getParam();
    if (urlParam != undefined && urlParam["openFrom"] != undefined) {
        openFrom = urlParam["openFrom"];
    }    
}
//添加头部的关闭按钮
function addCloseButton() {
    cmp.navigation.setCloseButtonHidden({
        hidden:false,
        success:function(){
        },
        error:function(error){
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {

            } else {}
        }
    })
}