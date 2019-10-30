/**
 * @description m3配置文件
 * @author Clyne
 * @createDate 2017-07-27
 */
define(function(require, exports, module){
    //导出
    module.exports = {
        //调试模式
        debugModel: false,
        //调试模块的CSS文件路径配置
        debugCssUrl: (window.__baseUrl__ === '../' ? '' : window.__baseUrl__) + '/js/css/debug.css',
        //数据库名称
        DBName: 'M3_DATABASE',
        //数据库版本
        DBVersion: '1.0.0'
    };
});