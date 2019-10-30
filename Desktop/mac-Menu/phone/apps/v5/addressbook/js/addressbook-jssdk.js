;
(function(global) {
    var api = {
        Addressbook : {
            getSubDeptInfo : function(dId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/subDeptInfo/' + dId + '', _params, '', cmp.extend({}, options))
            },

            getTeamMember : function(tId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/teamMembers/' + tId + '', _params, '', cmp.extend({}, options))
            },

            subDepts : function(pId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/subDepts/' + pId + '', _params, '', cmp.extend({}, options))
            },

            getAvatarImage : function(_params, _body, options) {
                return SeeyonApi.Rest.post('addressbook/avatarImages', _params, _body, cmp.extend({}, options))
            },

            getDeptPath : function(dId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/depPath/' + dId + '', _params, '', cmp.extend({}, options))
            },

            canShowPeopleCard : function(memberId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/canShowPeopleCard/' + memberId + '', _params, '', cmp.extend({}, options))
            },

            getRecentData : function(mId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/recentMember/' + mId + '', _params, '', cmp.extend({}, options))
            },

            getSubDeptOfAccount : function(accId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/firstDepts/' + accId + '', _params, '', cmp.extend({}, options))
            },

            childAccounts : function(supId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/childAccounts/' + supId + '', _params, '', cmp.extend({}, options))
            },

            currentUser : function(_params, options) {
                return SeeyonApi.Rest.get('addressbook/currentUser', _params, '', cmp.extend({}, options))
            },

            getAccountInfo : function(accId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/accountInfo/' + accId + '', _params, '', cmp.extend({}, options))
            },

            getAllSubDeptOfAccount : function(accId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/allDepts/' + accId + '', _params, '', cmp.extend({}, options))
            },

            accountMembers : function(accountId, lastM, pageSize, pageNo, _params, options) {
                return SeeyonApi.Rest.get('addressbook/accountMembers/' + accountId + '/' + lastM + '/' + pageSize + '/' + pageNo + '', _params, '', cmp.extend({}, options))
            },

            getTeam : function(type, _params, options) {
                return SeeyonApi.Rest.get('addressbook/team/' + type + '', _params, '', cmp.extend({}, options))
            },

            currentDepartment : function(_params, options) {
                return SeeyonApi.Rest.get('addressbook/currentDepartment', _params, '', cmp.extend({}, options))
            },

            members : function(accountId, lastM, pageSize, pageNo, letter, _params, options) {
                return SeeyonApi.Rest.get('addressbook/members/' + accountId + '/' + lastM + '/' + pageSize + '/' + pageNo + '/' + letter + '', _params, '', cmp.extend({}, options))
            },

            getDeptMembers : function(dId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/deptMembers/' + dId + '', _params, '', cmp.extend({}, options))
            },

            searchMemberOfGroupByName : function(_params, _body, options) {
                return SeeyonApi.Rest.post('addressbook/searchMemberOfGroupByName', _params, _body, cmp.extend({}, options))
            },

            getPeopleCardInfo : function(mId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/peopleCard/' + mId + '', _params, '', cmp.extend({}, options))
            },

            searchMember : function(_params, _body, options) {
                return SeeyonApi.Rest.post('addressbook/searchMember', _params, _body, cmp.extend({}, options))
            },

            currentAccount : function(_params, options) {
                return SeeyonApi.Rest.get('addressbook/currentAccount', _params, '', cmp.extend({}, options))
            },

            accounts : function(supId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/accounts/' + supId + '', _params, '', cmp.extend({}, options))
            },

            peopleRelateManager : function(memberId, _params, options) {
                return SeeyonApi.Rest.get('addressbook/peopleRelate/' + memberId + '', _params, '', cmp.extend({}, options))
            }
        }
    }
    global.SeeyonApi = global.SeeyonApi || {};
    for(var key in api){
        global.SeeyonApi[key] = api[key];
    }
})(this);