var ucCommon = {
    ucGroupTotal: null,
    ucGetGroupTotal: function (params) {
        cmp.chat.exec('getRongConfig',{
            success: function(result){
                console.log(result)
                if (result) {
                    if (result.groupSize) {
                        ucCommon.ucGroupTotal = Number(result.groupSize)
                    }
                    else if (result.groupsize) {
                        ucCommon.ucGroupTotal = Number(result.groupsize)
                    }
                }
                params && params.success && params.success()
            },
            error: function(error){
                console.log(error)
                params.error && params.error()
            }
        })
    },
    // 调用选人控件（支持选择部门，默认包含子部门）
    ucSelectMember: function (params, memberData) {
        cmp.selectOrg('select',{
            type: params.type || 1,
            flowType: params.flowType || 2,
            fillBackData: params.fillBackData || memberData,
            excludeData: params.excludeData || memberData,
            jump: params.jump || false,
            maxSize: params.maxSize || 1000,
            minSize: params.minSize || 1,
            // seeExtAccount: params.seeExtAccount || true,
            directDepartment: true,
            label: params.label || ['dept','org','extP'],
            notSelectAccount: true,//(params.notSelectAccount===false?false:true),
            choosableType: params.choosableType || ['department','member'],
            selectType: params.selectType || 'member',
            permission: params.permission || true,
            lightMemberPermission: params.lightMemberPermission || true,
            h5header:true,
            callback:function(result){
                params.callback && params.callback(result);
            },
            closeCallback:function(result){
                params.closeCallback && params.closeCallback(result);
            }
        });
    }
}

