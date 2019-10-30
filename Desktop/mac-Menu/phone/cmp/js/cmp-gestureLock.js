(function(_){
    /**
     * 手势密码
     * @type {{}}
     */
    _.gestureLock = {};
    //关闭手势界面
    _.gestureLock.close = function(options) {
        cordova.exec(
            options.success,
            options.error,
            "GestureLockPlugin",
            "closeGestureLock",
            [{}]
        );
    };
    //验证手势密码界面
    var _validateGesture = function(options){
        cordova.exec(
            function success(res) {
                if(typeof options.success == "function"){
                    options.success(res);
                    //_closeGesturePage();
                }
            },
            function error(error) {
                switch(error.code){
                    case 25003://表示点击了右边的其他账号登陆
                        if(typeof options.otherAccount == "function"){
                            options.otherAccount();
                            //_closeGesturePage();
                        }
                        break;
                    case 25004://验证失败
                        if(typeof options.error == "function"){
                            options.error(error.detail);
                            //验证错误时，不能组件内关闭界面
                        }
                        break;
                    case 25005://其他错误
                        break;
                    case 25006://表示点击了左边的忘记手势密码
                        if(typeof options.forget == "function"){
                            options.forget(error.detail);
                            //_closeGesturePage();
                        }
                        break;

                }
            },
            "GestureLockPlugin",
            "verifyGestureLock",
            [{
                "userpassword": options.userPassword, //需要验证的密码
                "gespassword":options.gesPassword,
                "imgUrl": options.loginImg, //目前cmp没用户这块,这里后面设计下,原生代码根据这个值可以获取到图片就可以了
                "username": options.userName, //用户名用于显示
                "loginName":options.loginName, // 登陆名
                "autoHide":options.autoHide
            }]
        );
    };
    //设置手势密码界面
    var _setGesture = function(options){
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
                //_closeGesturePage();//关闭手势界面
            },
            function error(error){
                if(error.code ==  25001){
                    if(typeof options.skip == "function"){
                        options.skip();
                        //_closeGesturePage();
                    }
                }else if(error.code == 25002){
                        //点击的是android的返回按钮，原生自动处理，关闭手势界面
                    if(typeof options.error == "function"){
                        options.error();
                    }
                }
            },
            "GestureLockPlugin",
            "setGestureLock",
            [{
                showLeftArrow:options.showLeftArrow,
                username : options.userName,
                autoHide:options.autoHide,
                isClose:options.isClose
            }]
        );
    };
    /**
     * 设置密码
     * @param options
     *      options.userName:用户名
     *      options.showLeftArrow:是否显示返回按钮
     *      option.setSkip:点击跳过按钮回调函数
     *      option.setSuccess:密码设置成功回调函数
     */
    _.gestureLock.set = function(options){
        var _options = _.extend({
            userName:"",
            skip:null,
            showLeftArrow:false,
            autoHide:true, // 是否自动隐藏
            success:null,
            error:null
        },options);
        _setGesture(_options);
    };
    /**
     * 验证手势密码
     * @param options
     *     options.loginName:登录名
     *     options.loginImg:验证密码界面显示的头像
     *     options.validateSuccess；验证成功回调函数
     *     options.validateError:验证失败回调函数
     *     options.validateForget：点击忘记验证密码按钮回调函数
     *     options.validateOtherAccount:点击其他账号登陆按钮回调函数
     */
    _.gestureLock.validate = function(options){
        var _options = _.extend({
            loginName:"", // 用户登陆名
            userPassword:"", // 登陆密码
            gesPassword:"",//手势密码
            userName:"", // 用户名用于显示
            loginImg: cmpIMGPath + "def_member.png",
            success:null,
            error:null,
            forget:null,
            otherAccount:null,
            autoHide:true // 是否自动隐藏
        },options);
        _validateGesture(_options);
    };
    /**
     * 注册App后台多少秒后，再次打开App显示手势密码
     * @param options
     *     options.loginName:登录名
     *     options.loginImg:验证密码界面显示的头像
     *     options.validateSuccess；验证成功回调函数
     *     options.validateError:验证失败回调函数
     *     options.validateForget：点击忘记验证密码按钮回调函数
     *     options.validateOtherAccount:点击其他账号登陆按钮回调函数
     *     options.timeInterval 时间间隔
     */
    _.gestureLock.registerTimeInterval = function(options){
        var _options = _.extend({
            loginName:"", // 用户登陆名
            userPassword:"", // 登陆密码
            gesPassword:"",//手势密码
            userName:"", // 用户名用于显示
            loginImg: cmpIMGPath + "def_member.png",
            success:null,
            error:null,
            forget:null,
            otherAccount:null,
            timeInterval:300, // 秒为单位
        },options);
        //_validateGesture(_options);
        cordova.exec(
            function success(res) {
                //todo
            },
            function error(res) {
                //todo
            },
            "GestureLockPlugin",
            "registerTimeInterval",
            [{
                "userpassword": options.userPassword, //需要验证的密码
                "gespassword":options.gesPassword,
                "imgUrl": options.loginImg, //目前cmp没用户这块,这里后面设计下,原生代码根据这个值可以获取到图片就可以了
                "username": options.userName, //用户名用于显示
                "loginName":options.loginName, // 登陆名
                "autoHide":true,
                "timeInterval":_options.timeInterval
            }]
        );
    };
    /**
     * 清空后台运行计算器,关闭手势密码设置时调用，原生修改手势密码开关状态
     * @param options
     */
    _.gestureLock.unRegisterTimeInterval = function(options) {
        var _options = _.extend({
            success:null,
            error:null
        },options);
        //_validateGesture(_options);
        cordova.exec(
            _options.success,
            _options.error,
            "GestureLockPlugin",
            "unRegisterTimeInterval",
            [
                {}
            ]
        );
    };

    /**
     * 用于h5主动获取原生存储的手势密码
     * param options (userId),返回值为string
    */
    _.gestureLock.getUserGesturePassword = function(options) {
        cordova.exec(
            function success(res) {
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(res) {
                if(typeof options.error == "function"){
                    options.error(res);
                }
            },
            "GestureLockPlugin",
            "getUserGesturePassword",
            [{
                "userId": options.userId //需要验证的密码
            }]
        );
    }

})(cmp);
