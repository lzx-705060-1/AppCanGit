/* Created by Administrator on 2016/10/17 0017.
  底部导航插件

  1.本插件在登录成功后调用
  2.配置的信息在application.zip(id=52)中，目录为tabConfig。其中m3TabConfig.json为数据及样式配置，m3TabFont.ttf为底部导航图标

    cmp.tabBarPlugin.show({"appIDs":"40"});  创建底部导航，去除appIDs中的应用。分享的appID=40，该例子为屏蔽分享的写法

    cmp.tabBar.setBadge({"appID":"40","show":true});  在appID=40的底部导航上加上红点。该例子为分享加红点

    cmp.tabBar.setBadge({"appID":"40","show":false}); 在appID=40的底部导航上去除红点。该例子为分享去除红点

    cmp.tabBar.setDefaultIndex({"appID":"62"}); 设置appID=62为底部导航默认页签。该例子为设置通讯录为默认首页

 */

(function(_){
    _.tabBar = {};

    //创建和显示底部导航 appIDs为不显示的app的ID 如果有多个使用|分割
    _.tabBar.show = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CMPTabBarPlugin",
            "show",
            [
                {
                    appIDs:_options.appIDs
                }
            ]
        );
    };
    //设置tabBar默认选中的index
    _.tabBar.setDefaultIndex = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CMPTabBarPlugin",
            "setDefaultIndex",
            [
                {
                    appID:_options.appID,
                }
            ]
        );
    };
    //在底部导航设置badge,小红点点，appID为要设置的app的ID，show为true为显示 false为隐藏
    _.tabBar.setBadge = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CMPTabBarPlugin",
            "setBadge",
            [
                {
                    appID:_options.appID,
                    show:_options.show
                }
            ]
        );
    };
    //当html页面有弹出模态视图时，调用该方法使得tabBar和模态页面有相同背景颜色。
    //color为要设置的tabBar蒙版的颜色，一般和模态视图的背景颜色一致，ffffff为白色，不要带#号。
    _.tabBar.addMask = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CMPTabBarPlugin",
            "addMask",
            [
                {
                    "color":_options.color
                }
            ]
        );
    };

    //去除蒙版
    _.tabBar.removeMask = function () {

        cordova.exec(
            function(){},
            function(){},
            "CMPTabBarPlugin",
            "removeMask",
            [{}]
        );
    };

})(cmp);
