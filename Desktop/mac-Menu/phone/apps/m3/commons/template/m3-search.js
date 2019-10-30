/**
 * author Clyne,mashan
 * description M3搜索组件模板
 * createDate 2017-11-13
 */
;(function() {
    var tools, m3i18n;
    define(function(require, exports, module) {
        module.exports = template;
    });
    
    function template(id){
        return '<div class="components-search flex-v display-none" id="' + id + '">\
                    <div class="search-header flex-h flex-cross-center">\
                        <div class="search-box flex-1">\
                            <span class="search-btn">\
                                <i class="cmp-icon cmp-icon-search"></i>\
                                <i class="placeholder">请输入姓名</i>\
                            </span>\
                            <input id="m3-search" type="search" />\
                        </div>\
                        <a>取消</a>\
                    </div>\
                    <div class="search-content flex-1"><ul></ul></div>\
                </div>';
    }
})();