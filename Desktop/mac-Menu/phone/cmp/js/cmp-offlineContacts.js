/**
 * Created by xp on 2017-01-04.
 */
(function (_) {

//===========================================cmp  离线通讯录 start===================================//
    _.offlineContactList = {};
    /**
     * 获取单位下一级子部门列表，我的部门信息
     * @param options
     */
    _.offlineContactList.getDepartmentsByAccountId = function (options) {
        var _options = {
            accountId:null,//单位id
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "getDepartmentsByAccountId",
            [
                {
                    accountId:_options.accountId
                }
            ]
        );
    };

    /**
     * 获取单位下一级子部门列表，我的部门信息
     * @param options
     */
    _.offlineContactList.getDepartments = function (options) {
        var _options = {
            accountId:null,//单位id
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "getDepartmentsByAccountId",
            [
                {
                    accountId:_options.accountId
                }
            ]
        );
    };
    /**
     * 部门下的子部门和人员
     *
     * @param departmentId 部门ID
     * @param pageSize     每一页的大小
     * @param pageNo       页数
     */
    _.offlineContactList.getSubpart = function (options) {
        var _options = {
            departmentId:null,//部门id
            pageSize:20,//分页大小
            pageNo:null,//页数
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "getChildrenByDepartmentId",
            [
                {
                    departmentId:_options.departmentId,
                    pageSize:_options.pageSize,
                    pageNo:_options.pageNo
                }
            ]
        );
    };

    /**
     * 获取全单位列表
     */
    _.offlineContactList.getAllAccounts = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "getAllAccounts",
            [
                {}
            ]
        );
    };

    /**
     * 搜索人员
     *
     * @param accountId 单位ID
     * @param pageSize     每一页的大小
     * @param pageNo       页数
     * @param condition 搜索条件
     */
    _.offlineContactList.searchMembers = function (options) {
        var _options = {
            accountId:null,//部门id
            pageSize:20,//分页大小
            pageNo:null,//页数
            condition:null,//搜索条件
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "searchMembers",
            [
                {
                    accountId:_options.departmentId,
                    condition:_options.condition,
                    pageSize:_options.pageSize,
                    pageNo:_options.pageNo
                }
            ]
        );
    };

    /**
     * 打开离线通讯录
     */
    _.offlineContactList.open = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "openOfflineContacts",
            [
                {
                }
            ]
        );
    };

    /**
     * 根据用户id获取人员信息
     */
    _.offlineContactList.getMembersByUserIds = function (options) {
        var _options = {
            success: null,
            error: null,
            ids:[]
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "OfflineContactsPlugin",
            "getMembersByIds",
            [
                {
                    ids:_options.ids
                }
            ]
        );
    };

//===========================================cmp  离线通讯录 end===================================//

})(cmp);