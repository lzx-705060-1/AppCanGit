(function() {
    var m3i18n = {};
    m3i18n[cmp.language] = fI18nData;
    //判断是否存在模块加载器，定义国际化模块
    if (window.define && window.define.cmd) {
        define(function(require, exports, module){
            module.exports = m3i18n;
        });
    }
    //兼容老版本
    if (window.m3) {
        m3.i18n = m3i18n;
    }
})();
