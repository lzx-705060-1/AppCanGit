//定义path
if(cmp.platform.CMPShell){
    var _v5Path = cmp.seeyonbasepath;
    window.parent._v5Path = _v5Path;
} else {
    var _v5Path = "/seeyon"
}
//vportal
var vPortal = {};
vPortal.sectionHandler = {};
/*-M3壳下ajax请求url替换-*/
var replaceAjaxUrl = function(_ajaxUrl) {
    if(cmp.platform.CMPShell){
        _ajaxUrl = cmp.serverIp +_ajaxUrl;
    }
    return _ajaxUrl;
}


//rest接口以ajax方式请求
function spaceAjax (url,type,data,callBack) {
    var CMP_V5_TOKEN = window.localStorage.CMP_V5_TOKEN;
    var _spaceUrl = replaceAjaxUrl(url);
    cmp.ajax({
        type: type,
        url: _spaceUrl,
        data: data,
        dataType: "json",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept-Language': "zh-CN",
            'token': CMP_V5_TOKEN || ""
        },
        repeat: false, // 当网络掉线时是否自动重新连接
        success: function(result) {
            callBack(result);
        },
        error: function(error) {
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                // cmp处理了这个错误
            } else {
                // customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}

//拖动排序
function pushEvent(_id,_destroy){
    var el = document.getElementById(_id);
    var sortable = Sortable.create(el,{
        animation : 500,
        disabled : false,
        handle:".drag-handle",
        onStart:function(){
            cmp.listView("#scroll").disable();
        },
        onEnd:function(){
            cmp.listView("#scroll").enable();
        }
    });
    if (_destroy) {
        sortable.destroy();
    }
}

//页面渲染
function renderData(dynamic_html, data, domId) {
    var html = cmp.tpl(dynamic_html, data);
    var content_dom = document.getElementById(domId);
    content_dom.innerHTML = content_dom.innerHTML + html;
}