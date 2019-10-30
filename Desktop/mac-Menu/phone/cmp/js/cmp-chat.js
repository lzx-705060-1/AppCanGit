/**
 * Created by wujs on 16/9/1.
 */
(function(_){
    /**
     *
     *chat选人
     */
    _.chat = {};

    /**
     *
     * @param method  调用的对应的方法名
     * @param options 传参  包含 success（成功回调），error（错误回调），params（所需参数，如果没有参数就不传）
     */
    _.chat.exec = function(method,options){
        var _options = _.extend({
            success:null,
            error:null,
            params:{}
        },options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            method,
            [_options.params]
        );
    };
    /*
     * demo 如登录工作微信模块调用方式
     *
     * cmp.chat.exec("loginChat",{
     *       success:function(){},
     *       error:function(){},
     *       params:{
     *           extranetIp:"xxx",
     *           intranetIp:"xxx",
     *           jid:"xxx",
     *           port:"xxx",
     *           token:"xxx",
     *           userid:"xxx",
     *           username:"xxx"
     *       }
     * });
     * */




    //完成选人
    _.chat.setSelectedOrgResult = function (options) {
        var _options = {
            success: null,
            error: null,
            result:""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "setSelectedOrgResult",
            [
                {
                    "result": _options.result
                }
            ]
        );
    };
    // 获取选人参数
    _.chat.getSelectOrgParam = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "getSelectOrgParam",
            [
                {
                }
            ]
        );
    };
    // 打开工作微信模块
    _.chat.openChat = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "openChat",
            [
                {
                }
            ]
        );
    };
    // 人员详情点击开始交流
    _.chat.chatToOther = function (options) {
        var _options = {
            success: null,
            error: null,
            memberid: ""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "chatToOther",
            [
                {
                     "memberid":_options.memberid
                }
            ]
        );
    };
    // 登录工作微信
    _.chat.loginChat = function (options) {
        var _options = {
            success: null,
            error: null,
            extranetIp:"",
            intranetIp:"",
            jid:"",
            port:"",
            token:"",
            userid:"",
            username:""

        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "loginChat",
            [
                {
                    "extranetIp":_options.extranetIp,
                    "intranetIp":_options.intranetIp,
                    "jid":_options.jid,
                    "port":_options.port,
                    "token":_options.token,
                    "userid":_options.userid,
                    "username":_options.username
                }
            ]
        );
    };
    // 登出工作微信
    _.chat.logoutChat = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "logoutChat",
            [
                {
                }
            ]
        );
    };
    // 获取工作微信未读消息条数
    _.chat.getUnreadChatNumber = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "getUnreadChatNumber",
            [
                {
                }
            ]
        );
    };

    /**
     * 发送uc消息
     * @param options
     *       @param options.data 发送的消息内容
     */
    _.chat.sendMessage  = function (options) {
        var _options = {
            success: null,
            error: null,
            id:null,
            data:null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "sendPacket",
            [
                {
                    data:_options.data,
                    id:_options.id
                }
            ]
        );
    };

    /**
     * 确认是否收到了消息
     */
    _.chat.confirmMessage  = function (options) {
        var _options = {
            success: null,
            error: null,
            id:null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "confirmMessage",
            [
                {
                    id:_options.id
                }
            ]
        );
    };
    _.chat.chatInfo  = function (options) {
        var _options = {
            success: null,
            error: null        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "chatInfo",
            [
                {
                }
            ]
        );
    };

    _.chat.getLocalMessage  = function (options) {
        var _options = {
            success: null,
            error: null        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "getLocalMessage",
            [
                {
                }
            ]
        );
    };

    //检查致信的连接状态
    _.chat.checkChatState  = function (options) {
        var _options = {
            success: null,
            error: null        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "checkChatState",
            [{}]
        );
    };


    _.chat.start = function(options){
        var _options = {
            title:"",
            id:"",//群id或人id
            clearPrePage:true,
            type:"",//group:群聊  private:私聊
            success:null,
            error:null
        };
        _options = _.extend(_options, options);
        var method,queryParams = {};
        if(_options.type == "group"){
            method = "startGroupChat";
            queryParams["targetGroupId"] = _options.id;
        }else {
            method = "startPrivateChat";
            queryParams["targetUserId"] = _options.id;
        }
        queryParams.title = _options.title;
        queryParams.clearPrePage = _options.clearPrePage;
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            method,
            [queryParams]
        );
    };
    //获取群组设置---置顶状态 、消息提醒状态
    _.chat.getGroupSettings = function(options){
        var _options = {
            id:"",//群id
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "getGroupChatSettings",
            [{
                targetGroupId:_options.id
            }]
        );
    };

    _.chat.setGroupSettings = function(options){
        var _options = {
            type:"",//top:置顶消息，alert ：提醒
            status:"",//状态值
            id:"",//群id
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        var method,queryParams = {};
        if(_options.type == "top"){
            method = "setGroupChatTopStatus";
            queryParams["topStatus"] = _options.status;
        }else {
            method = "setGroupChatAlertStatus";
            queryParams["alertStatus"] = _options.status;
        }
        queryParams.targetGroupId = _options.id;
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            method,
            [queryParams]
        );
    };

    //清空群消息
    _.chat.clearGroupChat = function(options){
        var _options = {
            id:"",
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "ClearGroupChat",
            [{
                targetGroupId:_options.id
            }]
        );
    };

    //从致信聊天的原生界面返回
    _.chat.backPage = function(options){
        var _options = {
            index:1,//返回的层级数
            type:"",//quitGroup：退出群 ；destroyGroup：销毁群
            data:"",//群的id
            refresh:true,//是否刷新前一个页面
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPChatPlugin",
            "backToPreviousView",
            [{
                layerCount:_options.index,
                type:_options.type,
                data:_options.data
            }]
        );
    };
})(cmp);