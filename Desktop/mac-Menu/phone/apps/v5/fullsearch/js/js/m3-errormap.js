/**
 * @description 错误code的映射Map
 * @author Clyne
 * @createDate 2017-07-25
 * @ 遇到错误code的操作方式有以下几种：
 * @ 1，logout操作；
 * @ 2，toast操作；
 * @ 3，none,不操作，业务处理，仅仅告知调试模块；
 * @ 4，network,弹出网络异常；
 */
;(function() {
    var map = {
        //ajax 异常code
        //需要logout的code
        '401': {type: 'logout', msg: '无权限'},
        '1001': {type: 'logout',msg: '超出并发数'},
        '1002': {type: 'logout', msg: '超出单位并发数'},
        '1003': {type: 'logout',msg: '强制下线'},
        '1004': {type: 'logout',msg: '账号在另一个设备登陆'},
        '1005': {type: 'logout',msg: '更新密码'},
        '1006': {type: 'logout',msg: 'pc端下线移动端'},
        '50011': {type: 'logout',msg: 'V5服务器异常，未连接'},
        '1010': {type: 'logout',msg: 'session失效'},
        '10000': {type: 'logout',msg: 'V5的位置错误，奇葩'},
        
        //不需要操作的code
        '404': {type: 'none', msg: '访问失败'},
        
        //系统繁忙
        '500': {type: 'busy', msg: '后台报错，别问我，我也不晓得为啥'},
        
        //需要弹出网络异常的code
        '-1009': {type: 'noNetWork', msg: '无网络'}
    };
    define(function(require, exports, module){
        //导出
        module.exports = map;
    });
})();